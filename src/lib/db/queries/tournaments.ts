import db, { fromJSON, DbTournament } from '../index';
import { Tournament, SkillLevel, TournamentFormat, OrganisedTournament, AthleteRegistration, TournamentJob, JobApplication, WorkExperience } from '@/types';
import { getPlayerById } from './players';

// Convert database row to Tournament type
function toTournament(row: DbTournament, currentPlayers: string[]): Tournament {
    return {
        id: row.id,
        name: row.name,
        description: row.description || '',
        location: {
            lat: row.location_lat || 0,
            lng: row.location_lng || 0,
            venue: row.location_venue || '',
            address: row.location_address || '',
        },
        date: row.date,
        endDate: row.end_date || undefined,
        format: row.format as TournamentFormat,
        skillLevelMin: row.skill_level_min as SkillLevel,
        skillLevelMax: row.skill_level_max as SkillLevel,
        maxPlayers: row.max_players,
        currentPlayers,
        entryFee: row.entry_fee || undefined,
        prizes: fromJSON<string[]>(row.prizes || '[]'),
        organizer: row.organizer || '',
        createdAt: row.created_at || new Date().toISOString(),
    };
}

// Convert to OrganisedTournament type
function toOrganisedTournament(row: DbTournament): OrganisedTournament {
    const participants = db.prepare('SELECT player_id FROM tournament_participants WHERE tournament_id = ?')
        .all(row.id) as { player_id: string }[];

    const positions = db.prepare('SELECT * FROM tournament_positions WHERE tournament_id = ?')
        .all(row.id) as {
            id: string;
            role: string;
            wage: number;
            slots: number;
            filled: number;
        }[];

    const applicationsCount = db.prepare('SELECT COUNT(*) as count FROM job_applications WHERE tournament_id = ?')
        .get(row.id) as { count: number };

    return {
        id: row.id,
        name: row.name,
        description: row.description || '',
        date: row.date,
        endDate: row.end_date || undefined,
        location: {
            venue: row.location_venue || '',
            address: row.location_address || '',
        },
        status: row.status as 'draft' | 'pending' | 'active' | 'completed' | 'cancelled',
        scale: row.scale || 'Open Entries (Local)',
        format: row.format as TournamentFormat,
        maxAthletes: row.max_players,
        athletesRegistered: participants.length,
        hiringPersonnel: row.hiring_personnel === 1,
        positions: positions.map(p => ({
            role: p.role,
            wage: p.wage,
            slots: p.slots,
            filled: p.filled,
        })),
        applicationsCount: applicationsCount.count,
        createdAt: row.created_at || new Date().toISOString(),
        organiserId: row.organizer_id || '',
    };
}

// Get all tournaments
export function getAllTournaments(): Tournament[] {
    const tournaments = db.prepare('SELECT * FROM tournaments ORDER BY date ASC').all() as DbTournament[];

    return tournaments.map(t => {
        const players = db.prepare('SELECT player_id FROM tournament_participants WHERE tournament_id = ?')
            .all(t.id) as { player_id: string }[];
        return toTournament(t, players.map(p => p.player_id));
    });
}

// Get tournament by ID
export function getTournamentById(id: string): Tournament | null {
    const tournament = db.prepare('SELECT * FROM tournaments WHERE id = ?').get(id) as DbTournament | undefined;
    if (!tournament) return null;

    const players = db.prepare('SELECT player_id FROM tournament_participants WHERE tournament_id = ?')
        .all(id) as { player_id: string }[];

    return toTournament(tournament, players.map(p => p.player_id));
}

// Get organised tournaments by user
export function getOrganisedTournaments(organiserId: string): OrganisedTournament[] {
    const tournaments = db.prepare('SELECT * FROM tournaments WHERE organizer_id = ?')
        .all(organiserId) as DbTournament[];

    return tournaments.map(toOrganisedTournament);
}

// Get organised tournament by ID
export function getOrganisedTournamentById(id: string): OrganisedTournament | null {
    const tournament = db.prepare('SELECT * FROM tournaments WHERE id = ?').get(id) as DbTournament | undefined;
    if (!tournament) return null;

    return toOrganisedTournament(tournament);
}

// Create tournament
export function createTournament(data: {
    id: string;
    name: string;
    description?: string;
    locationLat?: number;
    locationLng?: number;
    locationVenue?: string;
    locationAddress?: string;
    date: string;
    endDate?: string;
    format?: string;
    skillLevelMin?: number;
    skillLevelMax?: number;
    maxPlayers?: number;
    entryFee?: number;
    prizes?: string[];
    organizer?: string;
    organizerId?: string;
    status?: string;
    scale?: string;
    hiringPersonnel?: boolean;
}): Tournament {
    db.prepare(`
        INSERT INTO tournaments (id, name, description, location_lat, location_lng, location_venue, location_address, date, end_date, format, skill_level_min, skill_level_max, max_players, entry_fee, prizes, organizer, organizer_id, status, scale, hiring_personnel)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        data.id,
        data.name,
        data.description || '',
        data.locationLat || null,
        data.locationLng || null,
        data.locationVenue || '',
        data.locationAddress || '',
        data.date,
        data.endDate || null,
        data.format || 'singles',
        data.skillLevelMin || 1,
        data.skillLevelMax || 10,
        data.maxPlayers || 32,
        data.entryFee || 0,
        JSON.stringify(data.prizes || []),
        data.organizer || '',
        data.organizerId || null,
        data.status || 'pending',
        data.scale || 'Open Entries (Local)',
        data.hiringPersonnel ? 1 : 0
    );

    return getTournamentById(data.id)!;
}

// Join tournament
export function joinTournament(tournamentId: string, playerId: string): boolean {
    try {
        db.prepare('INSERT INTO tournament_participants (tournament_id, player_id) VALUES (?, ?)').run(tournamentId, playerId);
        return true;
    } catch {
        return false;
    }
}

// Leave tournament
export function leaveTournament(tournamentId: string, playerId: string): boolean {
    const result = db.prepare('DELETE FROM tournament_participants WHERE tournament_id = ? AND player_id = ?').run(tournamentId, playerId);
    return result.changes > 0;
}

// ===== ATHLETE REGISTRATIONS =====

// Get athlete registrations for tournament
export function getAthleteRegistrations(tournamentId: string): AthleteRegistration[] {
    const registrations = db.prepare(`
        SELECT * FROM athlete_registrations WHERE tournament_id = ?
    `).all(tournamentId) as {
        id: string;
        tournament_id: string;
        player_id: string;
        discipline: string;
        category: string;
        gender: string;
        skill_level: number;
        registered_at: string;
        status: string;
    }[];

    return registrations.map(r => ({
        id: r.id,
        tournamentId: r.tournament_id,
        playerId: r.player_id,
        player: getPlayerById(r.player_id) || undefined,
        discipline: fromJSON<string[]>(r.discipline),
        category: r.category,
        gender: r.gender,
        skillLevel: r.skill_level as SkillLevel,
        registeredAt: r.registered_at,
        status: r.status as 'registered' | 'confirmed' | 'withdrawn',
    }));
}

// Create athlete registration
export function createAthleteRegistration(data: {
    id: string;
    tournamentId: string;
    playerId: string;
    discipline: string[];
    category: string;
    gender: string;
    skillLevel: number;
}): AthleteRegistration | null {
    try {
        db.prepare(`
            INSERT INTO athlete_registrations (id, tournament_id, player_id, discipline, category, gender, skill_level)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
            data.id,
            data.tournamentId,
            data.playerId,
            JSON.stringify(data.discipline),
            data.category,
            data.gender,
            data.skillLevel
        );

        return {
            ...data,
            player: getPlayerById(data.playerId) || undefined,
            skillLevel: data.skillLevel as SkillLevel,
            registeredAt: new Date().toISOString(),
            status: 'registered',
        };
    } catch {
        return null;
    }
}

// Update athlete registration status
export function updateAthleteRegistrationStatus(id: string, status: 'registered' | 'confirmed' | 'withdrawn'): boolean {
    const result = db.prepare('UPDATE athlete_registrations SET status = ? WHERE id = ?').run(status, id);
    return result.changes > 0;
}

// ===== TOURNAMENT JOBS =====

// Get tournament jobs (for workers to apply)
export function getTournamentJobs(): TournamentJob[] {
    const jobs = db.prepare(`
        SELECT tp.*, t.name as tournament_name, t.location_venue
        FROM tournament_positions tp
        JOIN tournaments t ON tp.tournament_id = t.id
        WHERE t.status IN ('pending', 'active')
    `).all() as {
        id: string;
        tournament_id: string;
        tournament_name: string;
        role: string;
        description: string;
        wage: number;
        slots: number;
        filled: number;
        requirements: string;
        dates: string;
        location_venue: string;
        application_deadline: string;
    }[];

    return jobs.map(j => ({
        id: j.id,
        tournamentId: j.tournament_id,
        tournamentName: j.tournament_name,
        role: j.role,
        description: j.description,
        wage: j.wage,
        slots: j.slots,
        filled: j.filled,
        requirements: fromJSON<string[]>(j.requirements),
        dates: fromJSON<string[]>(j.dates),
        location: j.location_venue,
        applicationDeadline: j.application_deadline,
    }));
}

// Get job by ID
export function getTournamentJobById(id: string): TournamentJob | null {
    const job = db.prepare(`
        SELECT tp.*, t.name as tournament_name, t.location_venue
        FROM tournament_positions tp
        JOIN tournaments t ON tp.tournament_id = t.id
        WHERE tp.id = ?
    `).get(id) as {
        id: string;
        tournament_id: string;
        tournament_name: string;
        role: string;
        description: string;
        wage: number;
        slots: number;
        filled: number;
        requirements: string;
        dates: string;
        location_venue: string;
        application_deadline: string;
    } | undefined;

    if (!job) return null;

    return {
        id: job.id,
        tournamentId: job.tournament_id,
        tournamentName: job.tournament_name,
        role: job.role,
        description: job.description,
        wage: job.wage,
        slots: job.slots,
        filled: job.filled,
        requirements: fromJSON<string[]>(job.requirements),
        dates: fromJSON<string[]>(job.dates),
        location: job.location_venue,
        applicationDeadline: job.application_deadline,
    };
}

// ===== JOB APPLICATIONS =====

// Get applications for a tournament (organizer view)
export function getJobApplicationsForTournament(tournamentId: string): JobApplication[] {
    const applications = db.prepare(`
        SELECT ja.*, tp.role as position, tp.wage
        FROM job_applications ja
        JOIN tournament_positions tp ON ja.job_id = tp.id
        WHERE ja.tournament_id = ?
    `).all(tournamentId) as {
        id: string;
        job_id: string;
        tournament_id: string;
        applicant_id: string;
        full_name: string;
        email: string;
        phone: string;
        photo_url: string;
        cv_url: string;
        cover_letter: string;
        availability: string;
        status: string;
        applied_at: string;
        reviewed_at: string | null;
        notes: string;
        position: string;
        wage: number;
    }[];

    return applications.map(a => {
        const experiences = db.prepare('SELECT * FROM work_experiences WHERE application_id = ?')
            .all(a.id) as {
                id: string;
                tournament_name: string;
                role: string;
                date_from: string;
                date_to: string;
                description: string;
                reference_name: string;
                reference_contact: string;
            }[];

        return {
            id: a.id,
            jobId: a.job_id,
            tournamentId: a.tournament_id,
            position: a.position,
            wage: a.wage,
            applicantId: a.applicant_id,
            fullName: a.full_name,
            email: a.email,
            phone: a.phone,
            photoUrl: a.photo_url || undefined,
            experiences: experiences.map(e => ({
                id: e.id,
                tournamentName: e.tournament_name,
                role: e.role,
                dateFrom: e.date_from,
                dateTo: e.date_to,
                description: e.description,
                reference: e.reference_name ? { name: e.reference_name, contact: e.reference_contact } : undefined,
            })),
            cvUrl: a.cv_url || undefined,
            coverLetter: a.cover_letter,
            availability: fromJSON<string[]>(a.availability),
            status: a.status as 'pending' | 'under_review' | 'accepted' | 'rejected',
            appliedAt: a.applied_at,
            reviewedAt: a.reviewed_at || undefined,
            notes: a.notes || undefined,
        };
    });
}

// Get application by ID
export function getJobApplicationById(id: string): JobApplication | null {
    const a = db.prepare(`
        SELECT ja.*, tp.role as position, tp.wage
        FROM job_applications ja
        JOIN tournament_positions tp ON ja.job_id = tp.id
        WHERE ja.id = ?
    `).get(id) as {
        id: string;
        job_id: string;
        tournament_id: string;
        applicant_id: string;
        full_name: string;
        email: string;
        phone: string;
        photo_url: string;
        cv_url: string;
        cover_letter: string;
        availability: string;
        status: string;
        applied_at: string;
        reviewed_at: string | null;
        notes: string;
        position: string;
        wage: number;
    } | undefined;

    if (!a) return null;

    const experiences = db.prepare('SELECT * FROM work_experiences WHERE application_id = ?')
        .all(a.id) as {
            id: string;
            tournament_name: string;
            role: string;
            date_from: string;
            date_to: string;
            description: string;
            reference_name: string;
            reference_contact: string;
        }[];

    return {
        id: a.id,
        jobId: a.job_id,
        tournamentId: a.tournament_id,
        position: a.position,
        wage: a.wage,
        applicantId: a.applicant_id,
        fullName: a.full_name,
        email: a.email,
        phone: a.phone,
        photoUrl: a.photo_url || undefined,
        experiences: experiences.map(e => ({
            id: e.id,
            tournamentName: e.tournament_name,
            role: e.role,
            dateFrom: e.date_from,
            dateTo: e.date_to,
            description: e.description,
            reference: e.reference_name ? { name: e.reference_name, contact: e.reference_contact } : undefined,
        })),
        cvUrl: a.cv_url || undefined,
        coverLetter: a.cover_letter,
        availability: fromJSON<string[]>(a.availability),
        status: a.status as 'pending' | 'under_review' | 'accepted' | 'rejected',
        appliedAt: a.applied_at,
        reviewedAt: a.reviewed_at || undefined,
        notes: a.notes || undefined,
    };
}

// Get my applications (worker view)
export function getMyJobApplications(applicantId: string) {
    const applications = db.prepare(`
        SELECT ja.*, tp.role as position, tp.wage, t.name as tournament_name, t.location_venue as location
        FROM job_applications ja
        JOIN tournament_positions tp ON ja.job_id = tp.id
        JOIN tournaments t ON ja.tournament_id = t.id
        WHERE ja.applicant_id = ?
    `).all(applicantId) as {
        id: string;
        job_id: string;
        tournament_id: string;
        tournament_name: string;
        position: string;
        wage: number;
        location: string;
        status: string;
        applied_at: string;
    }[];

    return applications.map(a => {
        const job = getTournamentJobById(a.job_id);
        return {
            id: a.id,
            jobId: a.job_id,
            tournamentId: a.tournament_id,
            tournamentName: a.tournament_name,
            position: a.position,
            wage: a.wage,
            location: a.location,
            dates: job?.dates || [],
            status: a.status as 'pending' | 'under_review' | 'accepted' | 'rejected',
            appliedAt: a.applied_at,
        };
    });
}

// Create job application
export function createJobApplication(data: {
    id: string;
    jobId: string;
    tournamentId: string;
    applicantId: string;
    fullName: string;
    email: string;
    phone?: string;
    photoUrl?: string;
    cvUrl?: string;
    coverLetter: string;
    availability: string[];
    experiences?: WorkExperience[];
}): boolean {
    try {
        db.prepare(`
            INSERT INTO job_applications (id, job_id, tournament_id, applicant_id, full_name, email, phone, photo_url, cv_url, cover_letter, availability)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            data.id,
            data.jobId,
            data.tournamentId,
            data.applicantId,
            data.fullName,
            data.email,
            data.phone || '',
            data.photoUrl || '',
            data.cvUrl || '',
            data.coverLetter,
            JSON.stringify(data.availability)
        );

        // Insert work experiences
        if (data.experiences && data.experiences.length > 0) {
            const insertExp = db.prepare(`
                INSERT INTO work_experiences (id, application_id, tournament_name, role, date_from, date_to, description, reference_name, reference_contact)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            for (const exp of data.experiences) {
                insertExp.run(
                    exp.id,
                    data.id,
                    exp.tournamentName,
                    exp.role,
                    exp.dateFrom,
                    exp.dateTo,
                    exp.description,
                    exp.reference?.name || '',
                    exp.reference?.contact || ''
                );
            }
        }

        return true;
    } catch {
        return false;
    }
}

// Update job application status
export function updateJobApplicationStatus(id: string, status: 'pending' | 'under_review' | 'accepted' | 'rejected', notes?: string): boolean {
    const result = db.prepare(`
        UPDATE job_applications 
        SET status = ?, reviewed_at = datetime('now'), notes = COALESCE(?, notes)
        WHERE id = ?
    `).run(status, notes || null, id);

    // If accepted, increment filled count on position
    if (status === 'accepted') {
        const app = db.prepare('SELECT job_id FROM job_applications WHERE id = ?').get(id) as { job_id: string } | undefined;
        if (app) {
            db.prepare('UPDATE tournament_positions SET filled = filled + 1 WHERE id = ?').run(app.job_id);
        }
    }

    return result.changes > 0;
}
