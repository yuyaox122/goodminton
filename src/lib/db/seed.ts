import db, { initializeDatabase, toJSON } from './index';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Initialize database schema
initializeDatabase();

// Hash password helper
function hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
}

// Check if data already exists
const existingPlayers = db.prepare('SELECT COUNT(*) as count FROM players').get() as { count: number };

if (existingPlayers.count > 0) {
    console.log('Database already seeded. Skipping...');
    process.exit(0);
}

console.log('Seeding database...');

// ============================================
// PLAYERS
// ============================================
const players = [
    {
        id: 'player-1',
        email: 'sarah@example.com',
        password_hash: hashPassword('password123'),
        name: 'Sarah Chen',
        bio: 'Love doubles! Looking for a regular partner for weekend games. Been playing for 3 years.',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        skill_level: 6,
        play_style: 'doubles',
        location_lat: 52.4862,
        location_lng: -1.8904,
        location_city: 'Birmingham',
        looking_for: toJSON(['casual', 'competitive']),
    },
    {
        id: 'player-2',
        email: 'james@example.com',
        password_hash: hashPassword('password123'),
        name: 'James Wilson',
        bio: "Competitive singles player. Training for local tournaments. Let's rally! 🏸",
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        skill_level: 8,
        play_style: 'singles',
        location_lat: 52.4796,
        location_lng: -1.9026,
        location_city: 'Birmingham',
        looking_for: toJSON(['competitive']),
    },
    {
        id: 'player-3',
        email: 'priya@example.com',
        password_hash: hashPassword('password123'),
        name: 'Priya Patel',
        bio: 'Beginner looking to improve! Patient partners welcome. Available most evenings.',
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        skill_level: 3,
        play_style: 'both',
        location_lat: 52.4751,
        location_lng: -1.8686,
        location_city: 'Birmingham',
        looking_for: toJSON(['casual', 'coaching']),
    },
    {
        id: 'player-4',
        email: 'marcus@example.com',
        password_hash: hashPassword('password123'),
        name: 'Lin Dan',
        bio: 'I am the fucking goat.',
        avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRACP1mpKD3n9HIPu1BMng67cnw8GTl4QgYG1hQUCXPjhvkfsukTBiT1fdZDMpz0f-X1LXgcY6_zyBl6Ir8RYoQN3KFVlkKySZMTAvG2Q&s=10',
        skill_level: 9,
        play_style: 'both',
        location_lat: 52.4508,
        location_lng: -1.9305,
        location_city: 'Birmingham',
        looking_for: toJSON(['competitive', 'coaching']),
    },
    {
        id: 'player-5',
        email: 'emma@example.com',
        password_hash: hashPassword('password123'),
        name: 'Emma Rodriguez',
        bio: 'Social player who loves the game! Always up for a friendly match and post-game drinks.',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        skill_level: 5,
        play_style: 'doubles',
        location_lat: 52.4922,
        location_lng: -1.8745,
        location_city: 'Birmingham',
        looking_for: toJSON(['casual']),
    },
    {
        id: 'player-6',
        email: 'david@example.com',
        password_hash: hashPassword('password123'),
        name: 'David Kim',
        bio: 'New to the area! Looking to join the local badminton scene. Intermediate player.',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        skill_level: 5,
        play_style: 'singles',
        location_lat: 52.4668,
        location_lng: -1.9123,
        location_city: 'Birmingham',
        looking_for: toJSON(['casual', 'competitive']),
    },
    {
        id: 'player-7',
        email: 'lisa@example.com',
        password_hash: hashPassword('password123'),
        name: 'Lisa Chang',
        bio: 'Morning player! Love 7am sessions before work. Doubles preferred.',
        avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
        skill_level: 7,
        play_style: 'doubles',
        location_lat: 52.4835,
        location_lng: -1.8567,
        location_city: 'Birmingham',
        looking_for: toJSON(['competitive']),
    },
    {
        id: 'player-8',
        email: 'alex@example.com',
        password_hash: hashPassword('password123'),
        name: 'Alex Nguyen',
        bio: "Just picked up badminton 6 months ago and I'm hooked! Looking for patient practice partners.",
        avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
        skill_level: 2,
        play_style: 'both',
        location_lat: 52.4589,
        location_lng: -1.8834,
        location_city: 'Birmingham',
        looking_for: toJSON(['casual', 'coaching']),
    },
    // Demo user
    {
        id: 'demo-user',
        email: 'demo@badmintonconnect.com',
        password_hash: hashPassword('demo123'),
        name: 'Demo User',
        bio: 'Hackathon demo account! Looking to connect with the badminton community.',
        avatar_url: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
        skill_level: 5,
        play_style: 'both',
        location_lat: 52.4862,
        location_lng: -1.8904,
        location_city: 'Birmingham',
        looking_for: toJSON(['casual', 'competitive']),
    },
];

const insertPlayer = db.prepare(`
    INSERT INTO players (id, email, password_hash, name, bio, avatar_url, skill_level, play_style, location_lat, location_lng, location_city, looking_for)
    VALUES (@id, @email, @password_hash, @name, @bio, @avatar_url, @skill_level, @play_style, @location_lat, @location_lng, @location_city, @looking_for)
`);

const insertPlayerStats = db.prepare(`
    INSERT INTO player_stats (player_id, wins, losses, total_matches, win_rate, preferred_days, average_rating)
    VALUES (@player_id, @wins, @losses, @total_matches, @win_rate, @preferred_days, @average_rating)
`);

// Player stats data
const playerStats = [
    { player_id: 'player-1', wins: 45, losses: 23, total_matches: 68, win_rate: 66, preferred_days: toJSON(['Saturday', 'Sunday']), average_rating: 4.5 },
    { player_id: 'player-2', wins: 89, losses: 31, total_matches: 120, win_rate: 74, preferred_days: toJSON(['Monday', 'Wednesday', 'Friday']), average_rating: 4.8 },
    { player_id: 'player-3', wins: 12, losses: 28, total_matches: 40, win_rate: 30, preferred_days: toJSON(['Tuesday', 'Thursday']), average_rating: 4.2 },
    { player_id: 'player-4', wins: 156, losses: 44, total_matches: 200, win_rate: 78, preferred_days: toJSON(['Saturday', 'Sunday', 'Wednesday']), average_rating: 4.9 },
    { player_id: 'player-5', wins: 34, losses: 36, total_matches: 70, win_rate: 49, preferred_days: toJSON(['Friday', 'Saturday']), average_rating: 4.6 },
    { player_id: 'player-6', wins: 22, losses: 18, total_matches: 40, win_rate: 55, preferred_days: toJSON(['Monday', 'Thursday', 'Saturday']), average_rating: 4.3 },
    { player_id: 'player-7', wins: 67, losses: 33, total_matches: 100, win_rate: 67, preferred_days: toJSON(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']), average_rating: 4.7 },
    { player_id: 'player-8', wins: 5, losses: 15, total_matches: 20, win_rate: 25, preferred_days: toJSON(['Sunday']), average_rating: 4.0 },
    { player_id: 'demo-user', wins: 25, losses: 20, total_matches: 45, win_rate: 56, preferred_days: toJSON(['Wednesday', 'Saturday', 'Sunday']), average_rating: 4.4 },
];

// Insert players and stats
const insertPlayers = db.transaction(() => {
    for (const player of players) {
        insertPlayer.run(player);
    }
    for (const stats of playerStats) {
        insertPlayerStats.run(stats);
    }
});
insertPlayers();
console.log('✓ Players seeded');

// ============================================
// CLUBS
// ============================================
const clubs = [
    {
        id: 'club-1',
        name: 'Birmingham Badminton Club',
        description: 'The largest and oldest badminton club in Birmingham. Weekly sessions, coaching, and social events.',
        avatar_url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400',
        location_lat: 52.4862,
        location_lng: -1.8904,
        location_address: 'Aston University Sports Centre, Birmingham B4 7ET',
        activity_level: 'high',
        meeting_days: toJSON(['Tuesday', 'Thursday', 'Saturday']),
        skill_level_min: 1,
        skill_level_max: 10,
        is_open: 1,
    },
    {
        id: 'club-2',
        name: 'Aston Shuttlers',
        description: 'Aston University students and alumni. Casual and competitive play welcome!',
        avatar_url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400',
        location_lat: 52.4870,
        location_lng: -1.8895,
        location_address: 'Aston University, Aston St, Birmingham B4 7ET',
        activity_level: 'high',
        meeting_days: toJSON(['Monday', 'Wednesday', 'Friday']),
        skill_level_min: 1,
        skill_level_max: 8,
        is_open: 1,
    },
    {
        id: 'club-3',
        name: 'Elite Smashers',
        description: 'Competitive club for advanced players. Regular training and tournament preparation.',
        avatar_url: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=400',
        location_lat: 52.4668,
        location_lng: -1.9123,
        location_address: 'Edgbaston Priory Club, Birmingham B15 3TB',
        activity_level: 'high',
        meeting_days: toJSON(['Monday', 'Wednesday', 'Saturday', 'Sunday']),
        skill_level_min: 7,
        skill_level_max: 10,
        is_open: 0,
    },
    {
        id: 'club-4',
        name: 'Weekend Warriors',
        description: 'Casual weekend club for those who just want to have fun. All levels welcome!',
        avatar_url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400',
        location_lat: 52.4589,
        location_lng: -1.8834,
        location_address: 'Harborne Leisure Centre, Birmingham B17 9LS',
        activity_level: 'medium',
        meeting_days: toJSON(['Saturday', 'Sunday']),
        skill_level_min: 1,
        skill_level_max: 6,
        is_open: 1,
    },
];

const insertClub = db.prepare(`
    INSERT INTO clubs (id, name, description, avatar_url, location_lat, location_lng, location_address, activity_level, meeting_days, skill_level_min, skill_level_max, is_open)
    VALUES (@id, @name, @description, @avatar_url, @location_lat, @location_lng, @location_address, @activity_level, @meeting_days, @skill_level_min, @skill_level_max, @is_open)
`);

const insertClubMember = db.prepare(`
    INSERT INTO club_members (club_id, player_id) VALUES (@club_id, @player_id)
`);

const clubMembers = [
    { club_id: 'club-1', player_id: 'player-1' },
    { club_id: 'club-1', player_id: 'player-2' },
    { club_id: 'club-1', player_id: 'player-4' },
    { club_id: 'club-1', player_id: 'player-7' },
    { club_id: 'club-2', player_id: 'player-3' },
    { club_id: 'club-2', player_id: 'player-5' },
    { club_id: 'club-2', player_id: 'player-6' },
    { club_id: 'club-2', player_id: 'player-8' },
    { club_id: 'club-3', player_id: 'player-2' },
    { club_id: 'club-3', player_id: 'player-4' },
    { club_id: 'club-4', player_id: 'player-1' },
    { club_id: 'club-4', player_id: 'player-3' },
    { club_id: 'club-4', player_id: 'player-5' },
    { club_id: 'club-4', player_id: 'player-6' },
    { club_id: 'club-4', player_id: 'player-8' },
    { club_id: 'club-1', player_id: 'demo-user' },
];

const insertClubs = db.transaction(() => {
    for (const club of clubs) {
        insertClub.run(club);
    }
    for (const member of clubMembers) {
        insertClubMember.run(member);
    }
});
insertClubs();
console.log('✓ Clubs seeded');

// ============================================
// TOURNAMENTS
// ============================================
const tournaments = [
    {
        id: 'tournament-1',
        name: 'Birmingham Spring Open',
        description: 'Annual spring tournament open to all skill levels. Great prizes and atmosphere!',
        location_lat: 52.4862,
        location_lng: -1.8904,
        location_venue: 'Aston University Sports Centre',
        location_address: 'Aston St, Birmingham B4 7ET',
        date: '2026-03-15T09:00:00Z',
        end_date: '2026-03-15T18:00:00Z',
        format: 'singles',
        skill_level_min: 1,
        skill_level_max: 10,
        max_players: 32,
        entry_fee: 15,
        prizes: toJSON(['Trophy', '£100 voucher', 'Free coaching session']),
        organizer: 'Birmingham Badminton Association',
        organizer_id: null,
        status: 'pending',
        scale: 'Open Entries (Local)',
        hiring_personnel: 1,
    },
    {
        id: 'tournament-2',
        name: 'Doubles Championship 2026',
        description: 'Competitive doubles tournament. Find a partner and compete!',
        location_lat: 52.4751,
        location_lng: -1.8686,
        location_venue: 'National Indoor Arena',
        location_address: 'King Edwards Rd, Birmingham B1 2AA',
        date: '2026-04-20T10:00:00Z',
        end_date: '2026-04-21T17:00:00Z',
        format: 'doubles',
        skill_level_min: 5,
        skill_level_max: 10,
        max_players: 16,
        entry_fee: 25,
        prizes: toJSON(['Championship Trophy', '£250 cash', 'Pro racket set']),
        organizer: 'Midlands Badminton League',
        organizer_id: null,
        status: 'pending',
        scale: 'County Level',
        hiring_personnel: 1,
    },
    {
        id: 'tournament-3',
        name: 'Beginner Friendly Fun Tournament',
        description: 'No pressure, just fun! Perfect for those new to competitive play.',
        location_lat: 52.4922,
        location_lng: -1.8745,
        location_venue: 'Selly Oak Leisure Centre',
        location_address: 'Bristol Rd, Birmingham B29 6SL',
        date: '2026-02-28T13:00:00Z',
        end_date: '2026-02-28T17:00:00Z',
        format: 'mixed',
        skill_level_min: 1,
        skill_level_max: 4,
        max_players: 24,
        entry_fee: 10,
        prizes: toJSON(['Medals', 'Shuttlecock pack']),
        organizer: 'Selly Oak Badminton Club',
        organizer_id: null,
        status: 'pending',
        scale: 'Open Entries (Local)',
        hiring_personnel: 0,
    },
    {
        id: 'tournament-4',
        name: 'University League Finals',
        description: 'The grand finale of the inter-university badminton league.',
        location_lat: 52.4508,
        location_lng: -1.9305,
        location_venue: 'University of Birmingham Sport Centre',
        location_address: 'Edgbaston, Birmingham B15 2TT',
        date: '2026-05-10T11:00:00Z',
        end_date: '2026-05-10T19:00:00Z',
        format: 'singles',
        skill_level_min: 6,
        skill_level_max: 10,
        max_players: 16,
        entry_fee: 0,
        prizes: toJSON(['University Trophy', 'Champion Title']),
        organizer: 'BUCS',
        organizer_id: null,
        status: 'pending',
        scale: 'University Level',
        hiring_personnel: 0,
    },
    // Demo user's organized tournaments
    {
        id: 'tournament-org-1',
        name: 'Birmingham Spring Open 2026',
        description: 'Annual spring tournament open to all skill levels. Great prizes and atmosphere!',
        location_lat: 52.4862,
        location_lng: -1.8904,
        location_venue: 'Aston University Sports Centre',
        location_address: 'Aston St, Birmingham B4 7ET',
        date: '2026-03-15',
        end_date: '2026-03-16',
        format: 'singles',
        skill_level_min: 1,
        skill_level_max: 10,
        max_players: 32,
        entry_fee: 15,
        prizes: toJSON(['Trophy', '£100 voucher']),
        organizer: 'Demo User',
        organizer_id: 'demo-user',
        status: 'pending',
        scale: 'Open Entries (Local)',
        hiring_personnel: 1,
    },
    {
        id: 'tournament-org-2',
        name: 'Summer Smash Championship',
        description: 'Competitive doubles tournament for intermediate to advanced players.',
        location_lat: 52.4700,
        location_lng: -1.8800,
        location_venue: 'Birmingham Sports Hub',
        location_address: 'Park Street, Birmingham B5 5JR',
        date: '2026-06-20',
        end_date: '2026-06-21',
        format: 'doubles',
        skill_level_min: 5,
        skill_level_max: 10,
        max_players: 64,
        entry_fee: 20,
        prizes: toJSON(['Trophy', '£200 cash']),
        organizer: 'Demo User',
        organizer_id: 'demo-user',
        status: 'draft',
        scale: 'County Level',
        hiring_personnel: 1,
    },
];

const insertTournament = db.prepare(`
    INSERT INTO tournaments (id, name, description, location_lat, location_lng, location_venue, location_address, date, end_date, format, skill_level_min, skill_level_max, max_players, entry_fee, prizes, organizer, organizer_id, status, scale, hiring_personnel)
    VALUES (@id, @name, @description, @location_lat, @location_lng, @location_venue, @location_address, @date, @end_date, @format, @skill_level_min, @skill_level_max, @max_players, @entry_fee, @prizes, @organizer, @organizer_id, @status, @scale, @hiring_personnel)
`);

const insertTournamentParticipant = db.prepare(`
    INSERT INTO tournament_participants (tournament_id, player_id) VALUES (@tournament_id, @player_id)
`);

const tournamentParticipants = [
    { tournament_id: 'tournament-1', player_id: 'player-1' },
    { tournament_id: 'tournament-1', player_id: 'player-2' },
    { tournament_id: 'tournament-1', player_id: 'player-4' },
    { tournament_id: 'tournament-1', player_id: 'player-7' },
    { tournament_id: 'tournament-2', player_id: 'player-2' },
    { tournament_id: 'tournament-2', player_id: 'player-4' },
    { tournament_id: 'tournament-3', player_id: 'player-3' },
    { tournament_id: 'tournament-3', player_id: 'player-5' },
    { tournament_id: 'tournament-3', player_id: 'player-8' },
];

const insertTournaments = db.transaction(() => {
    for (const tournament of tournaments) {
        insertTournament.run(tournament);
    }
    for (const participant of tournamentParticipants) {
        insertTournamentParticipant.run(participant);
    }
});
insertTournaments();
console.log('✓ Tournaments seeded');

// ============================================
// TOURNAMENT POSITIONS (JOBS)
// ============================================
const positions = [
    {
        id: 'job-1',
        tournament_id: 'tournament-org-1',
        role: 'Line Judge',
        description: 'Responsible for making line calls during matches. Must have good eyesight and be able to stand for extended periods.',
        wage: 12,
        slots: 8,
        filled: 3,
        requirements: toJSON(['Good eyesight', 'Ability to stand for 4+ hours', 'Basic badminton knowledge']),
        dates: toJSON(['March 15, 2026', 'March 16, 2026']),
        application_deadline: '2026-03-01',
    },
    {
        id: 'job-2',
        tournament_id: 'tournament-org-1',
        role: 'Umpire',
        description: 'Control matches, make decisions on service faults, and manage player conduct. BWF certification preferred.',
        wage: 18,
        slots: 4,
        filled: 1,
        requirements: toJSON(['BWF certification preferred', 'Previous umpiring experience', 'Excellent communication']),
        dates: toJSON(['March 15, 2026', 'March 16, 2026']),
        application_deadline: '2026-03-01',
    },
    {
        id: 'job-3',
        tournament_id: 'tournament-org-1',
        role: 'Scorer',
        description: 'Manage electronic scoring systems and update live scores. Training provided.',
        wage: 10,
        slots: 6,
        filled: 2,
        requirements: toJSON(['Basic computer skills', 'Attention to detail', 'Reliability']),
        dates: toJSON(['March 15, 2026', 'March 16, 2026']),
        application_deadline: '2026-03-01',
    },
    {
        id: 'job-4',
        tournament_id: 'tournament-org-2',
        role: 'Line Judge',
        description: 'Line judging for competitive doubles matches at county level event.',
        wage: 15,
        slots: 12,
        filled: 0,
        requirements: toJSON(['Previous experience required', 'County level or above']),
        dates: toJSON(['June 20, 2026', 'June 21, 2026']),
        application_deadline: '2026-06-01',
    },
    {
        id: 'job-5',
        tournament_id: 'tournament-org-2',
        role: 'Umpire',
        description: 'Chief umpire and match umpires needed for county level doubles event.',
        wage: 20,
        slots: 6,
        filled: 0,
        requirements: toJSON(['BWF certified', 'County level experience minimum']),
        dates: toJSON(['June 20, 2026', 'June 21, 2026']),
        application_deadline: '2026-06-01',
    },
];

const insertPosition = db.prepare(`
    INSERT INTO tournament_positions (id, tournament_id, role, description, wage, slots, filled, requirements, dates, application_deadline)
    VALUES (@id, @tournament_id, @role, @description, @wage, @slots, @filled, @requirements, @dates, @application_deadline)
`);

const insertPositions = db.transaction(() => {
    for (const position of positions) {
        insertPosition.run(position);
    }
});
insertPositions();
console.log('✓ Tournament positions seeded');

// ============================================
// ATHLETE REGISTRATIONS
// ============================================
const athleteRegistrations = [
    { id: uuidv4(), tournament_id: 'tournament-org-1', player_id: 'player-4', discipline: toJSON(["Men's Singles"]), category: 'Senior (21+)', gender: 'Male', skill_level: 9, status: 'confirmed' },
    { id: uuidv4(), tournament_id: 'tournament-org-1', player_id: 'player-2', discipline: toJSON(["Men's Singles"]), category: 'Senior (21+)', gender: 'Male', skill_level: 8, status: 'confirmed' },
    { id: uuidv4(), tournament_id: 'tournament-org-1', player_id: 'player-1', discipline: toJSON(["Women's Singles"]), category: 'Senior (21+)', gender: 'Female', skill_level: 6, status: 'confirmed' },
    { id: uuidv4(), tournament_id: 'tournament-org-1', player_id: 'player-5', discipline: toJSON(["Women's Singles"]), category: 'Senior (21+)', gender: 'Female', skill_level: 5, status: 'registered' },
    { id: uuidv4(), tournament_id: 'tournament-org-1', player_id: 'player-3', discipline: toJSON(["Women's Singles"]), category: 'Senior (21+)', gender: 'Female', skill_level: 3, status: 'registered' },
    { id: uuidv4(), tournament_id: 'tournament-org-1', player_id: 'player-6', discipline: toJSON(["Men's Singles"]), category: 'Senior (21+)', gender: 'Male', skill_level: 5, status: 'confirmed' },
    { id: uuidv4(), tournament_id: 'tournament-org-1', player_id: 'player-7', discipline: toJSON(["Women's Singles"]), category: 'Senior (21+)', gender: 'Female', skill_level: 7, status: 'confirmed' },
];

const insertAthleteRegistration = db.prepare(`
    INSERT INTO athlete_registrations (id, tournament_id, player_id, discipline, category, gender, skill_level, status)
    VALUES (@id, @tournament_id, @player_id, @discipline, @category, @gender, @skill_level, @status)
`);

const insertAthleteRegistrations = db.transaction(() => {
    for (const reg of athleteRegistrations) {
        insertAthleteRegistration.run(reg);
    }
});
insertAthleteRegistrations();
console.log('✓ Athlete registrations seeded');

// ============================================
// JOB APPLICATIONS
// ============================================
const jobApplications = [
    {
        id: 'app-1',
        job_id: 'job-1',
        tournament_id: 'tournament-org-1',
        applicant_id: 'player-6',
        full_name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '07123456789',
        photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        cv_url: '/uploads/john_smith_cv.pdf',
        cover_letter: 'I am passionate about badminton and have been involved in the sport for over 10 years. I have experience as a line judge and scorer at various local tournaments. I am reliable, punctual, and have excellent attention to detail.',
        availability: toJSON(['March 15, 2026', 'March 16, 2026']),
        status: 'pending',
    },
    {
        id: 'app-2',
        job_id: 'job-2',
        tournament_id: 'tournament-org-1',
        applicant_id: 'player-7',
        full_name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '07987654321',
        photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        cv_url: '/uploads/sarah_johnson_cv.pdf',
        cover_letter: 'As a BWF certified umpire with 5 years of experience, I would love to be part of your tournament. I have officiated at national and county level events and pride myself on fair and consistent officiating.',
        availability: toJSON(['March 15, 2026', 'March 16, 2026']),
        status: 'pending',
    },
    {
        id: 'app-3',
        job_id: 'job-1',
        tournament_id: 'tournament-org-1',
        applicant_id: 'player-8',
        full_name: 'Michael Chen',
        email: 'mchen@email.com',
        phone: '07555123456',
        photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        cv_url: '/uploads/michael_chen_cv.pdf',
        cover_letter: 'I am a university student looking to gain more experience in tournament officiating. I have basic training and am eager to learn from experienced officials.',
        availability: toJSON(['March 15, 2026']),
        status: 'under_review',
        reviewed_at: '2026-02-06T15:00:00Z',
        notes: 'Limited experience but enthusiastic. Consider for backup.',
    },
];

const insertJobApplication = db.prepare(`
    INSERT INTO job_applications (id, job_id, tournament_id, applicant_id, full_name, email, phone, photo_url, cv_url, cover_letter, availability, status, reviewed_at, notes)
    VALUES (@id, @job_id, @tournament_id, @applicant_id, @full_name, @email, @phone, @photo_url, @cv_url, @cover_letter, @availability, @status, @reviewed_at, @notes)
`);

const insertJobApplications = db.transaction(() => {
    for (const app of jobApplications) {
        insertJobApplication.run({
            ...app,
            reviewed_at: app.reviewed_at || null,
            notes: app.notes || '',
        });
    }
});
insertJobApplications();
console.log('✓ Job applications seeded');

// ============================================
// WORK EXPERIENCES (for applications)
// ============================================
const workExperiences = [
    { id: uuidv4(), application_id: 'app-1', tournament_name: 'City Championship 2025', role: 'Line Judge', date_from: '2025-03-15', date_to: '2025-03-16', description: 'Served as line judge for 20+ matches across 2 days' },
    { id: uuidv4(), application_id: 'app-1', tournament_name: 'Regional Open 2024', role: 'Scorer', date_from: '2024-09-10', date_to: '2024-09-10', description: 'Managed scoring for singles and doubles matches' },
    { id: uuidv4(), application_id: 'app-2', tournament_name: 'National Junior Championships 2024', role: 'Umpire', date_from: '2024-07-20', date_to: '2024-07-23', description: 'BWF certified umpire for junior national event' },
    { id: uuidv4(), application_id: 'app-2', tournament_name: 'County League Finals 2025', role: 'Umpire', date_from: '2025-05-15', date_to: '2025-05-15', description: 'Chief umpire for county finals' },
    { id: uuidv4(), application_id: 'app-3', tournament_name: 'University Championships 2025', role: 'Line Judge', date_from: '2025-02-20', date_to: '2025-02-21', description: 'Volunteered as line judge' },
];

const insertWorkExperience = db.prepare(`
    INSERT INTO work_experiences (id, application_id, tournament_name, role, date_from, date_to, description)
    VALUES (@id, @application_id, @tournament_name, @role, @date_from, @date_to, @description)
`);

const insertWorkExperiences = db.transaction(() => {
    for (const exp of workExperiences) {
        insertWorkExperience.run(exp);
    }
});
insertWorkExperiences();
console.log('✓ Work experiences seeded');

// ============================================
// VENUES
// ============================================
const venues = [
    { id: 'venue-1', name: 'Aston University Sports Centre', address: 'Aston Triangle, Birmingham B4 7ET', price_per_hour: 12, courts: 4, location_lat: 52.4862, location_lng: -1.8904 },
    { id: 'venue-2', name: 'Birmingham Sports Hub', address: 'Walsall Road, Birmingham B42 1TR', price_per_hour: 15, courts: 6, location_lat: 52.5200, location_lng: -1.9100 },
    { id: 'venue-3', name: 'Nechells Community Centre', address: 'Nechells Park Road, Birmingham B7 5PR', price_per_hour: 8, courts: 2, location_lat: 52.4900, location_lng: -1.8700 },
    { id: 'venue-4', name: 'Perry Barr Leisure Centre', address: 'Aldridge Road, Birmingham B42 2ET', price_per_hour: 10, courts: 3, location_lat: 52.5100, location_lng: -1.9000 },
    { id: 'venue-5', name: 'Sparkhill Pool & Fitness', address: 'Stratford Road, Birmingham B11 4EA', price_per_hour: 9, courts: 2, location_lat: 52.4500, location_lng: -1.8600 },
];

const insertVenue = db.prepare(`
    INSERT INTO venues (id, name, address, price_per_hour, courts, location_lat, location_lng)
    VALUES (@id, @name, @address, @price_per_hour, @courts, @location_lat, @location_lng)
`);

const insertVenues = db.transaction(() => {
    for (const venue of venues) {
        insertVenue.run(venue);
    }
});
insertVenues();
console.log('✓ Venues seeded');

// ============================================
// COURTS (for map view)
// ============================================
const courts = [
    { id: 'court-1', name: 'Aston University Sports Centre', lat: 52.4862, lng: -1.8904, courts: 6, hourly_rate: 12 },
    { id: 'court-2', name: 'National Indoor Arena', lat: 52.4751, lng: -1.8686, courts: 8, hourly_rate: 15 },
    { id: 'court-3', name: 'Selly Oak Leisure Centre', lat: 52.4922, lng: -1.8745, courts: 4, hourly_rate: 10 },
    { id: 'court-4', name: 'University of Birmingham Sport Centre', lat: 52.4508, lng: -1.9305, courts: 10, hourly_rate: 8 },
];

const insertCourt = db.prepare(`
    INSERT INTO courts (id, name, lat, lng, courts, hourly_rate)
    VALUES (@id, @name, @lat, @lng, @courts, @hourly_rate)
`);

const insertCourts = db.transaction(() => {
    for (const court of courts) {
        insertCourt.run(court);
    }
});
insertCourts();
console.log('✓ Courts seeded');

// ============================================
// BOOKED SESSIONS
// ============================================
const bookedSessions = [
    {
        id: 'session-1',
        date: '2026-02-10',
        time: '18:00',
        duration: 2,
        venue_id: 'venue-1',
        total_cost: 24,
        split_mode: 'equal',
        status: 'upcoming',
        created_by: 'demo-user',
    },
    {
        id: 'session-2',
        date: '2026-02-08',
        time: '10:00',
        duration: 1.5,
        venue_id: 'venue-3',
        total_cost: 12,
        split_mode: 'equal',
        status: 'completed',
        created_by: 'demo-user',
    },
    {
        id: 'session-3',
        date: '2026-02-15',
        time: '14:00',
        duration: 2,
        venue_id: 'venue-2',
        total_cost: 30,
        split_mode: 'custom',
        status: 'pending',
        created_by: 'demo-user',
    },
];

const insertBookedSession = db.prepare(`
    INSERT INTO booked_sessions (id, date, time, duration, venue_id, total_cost, split_mode, status, created_by)
    VALUES (@id, @date, @time, @duration, @venue_id, @total_cost, @split_mode, @status, @created_by)
`);

const insertSessionParticipant = db.prepare(`
    INSERT INTO session_participants (session_id, player_id, share, paid)
    VALUES (@session_id, @player_id, @share, @paid)
`);

const sessionParticipants = [
    { session_id: 'session-1', player_id: 'demo-user', share: 8, paid: 1 },
    { session_id: 'session-1', player_id: 'player-1', share: 8, paid: 1 },
    { session_id: 'session-1', player_id: 'player-2', share: 8, paid: 0 },
    { session_id: 'session-2', player_id: 'demo-user', share: 6, paid: 1 },
    { session_id: 'session-2', player_id: 'player-3', share: 6, paid: 1 },
    { session_id: 'session-3', player_id: 'demo-user', share: 12, paid: 1 },
    { session_id: 'session-3', player_id: 'player-4', share: 10, paid: 0 },
    { session_id: 'session-3', player_id: 'player-5', share: 8, paid: 0 },
];

const insertBookedSessions = db.transaction(() => {
    for (const session of bookedSessions) {
        insertBookedSession.run(session);
    }
    for (const participant of sessionParticipants) {
        insertSessionParticipant.run(participant);
    }
});
insertBookedSessions();
console.log('✓ Booked sessions seeded');

// ============================================
// PARTNER SWIPES & MATCHES
// ============================================
const partnerSwipes = [
    // Demo user swipes - mutual likes
    { id: uuidv4(), swiper_id: 'demo-user', swiped_id: 'player-1', direction: 'like' },
    { id: uuidv4(), swiper_id: 'player-1', swiped_id: 'demo-user', direction: 'like' },
    { id: uuidv4(), swiper_id: 'demo-user', swiped_id: 'player-2', direction: 'like' },
    { id: uuidv4(), swiper_id: 'player-2', swiped_id: 'demo-user', direction: 'like' },
    { id: uuidv4(), swiper_id: 'demo-user', swiped_id: 'player-5', direction: 'like' },
    { id: uuidv4(), swiper_id: 'player-5', swiped_id: 'demo-user', direction: 'like' },
    // Demo user passes and one-way likes
    { id: uuidv4(), swiper_id: 'demo-user', swiped_id: 'player-3', direction: 'pass' },
    { id: uuidv4(), swiper_id: 'player-4', swiped_id: 'demo-user', direction: 'like' },
];

const insertSwipe = db.prepare(`
    INSERT INTO partner_swipes (id, swiper_id, swiped_id, direction)
    VALUES (@id, @swiper_id, @swiped_id, @direction)
`);

const partnerMatches = [
    { id: 'match-1', player1_id: 'demo-user', player2_id: 'player-1', compatibility: 85 },
    { id: 'match-2', player1_id: 'demo-user', player2_id: 'player-2', compatibility: 72 },
    { id: 'match-3', player1_id: 'demo-user', player2_id: 'player-5', compatibility: 78 },
];

const insertPartnerMatch = db.prepare(`
    INSERT INTO partner_matches (id, player1_id, player2_id, compatibility)
    VALUES (@id, @player1_id, @player2_id, @compatibility)
`);

const insertPartnerData = db.transaction(() => {
    for (const swipe of partnerSwipes) {
        insertSwipe.run(swipe);
    }
    for (const match of partnerMatches) {
        insertPartnerMatch.run(match);
    }
});
insertPartnerData();
console.log('✓ Partner swipes & matches seeded');

// ============================================
// MESSAGES
// ============================================
const messages = [
    // Messages for match with Sarah (player-1)
    { id: uuidv4(), match_id: 'match-1', sender_id: 'player-1', content: 'Hey! Great to match with you. When are you free to play?', read: 1 },
    { id: uuidv4(), match_id: 'match-1', sender_id: 'demo-user', content: 'Hi Sarah! I\'m free this Saturday afternoon. Does 2pm work?', read: 1 },
    { id: uuidv4(), match_id: 'match-1', sender_id: 'player-1', content: 'Perfect! See you at Aston Sports Centre?', read: 0 },
    // Messages for match with James (player-2)
    { id: uuidv4(), match_id: 'match-2', sender_id: 'player-2', content: 'Hey! Looking forward to some competitive singles matches!', read: 1 },
    { id: uuidv4(), match_id: 'match-2', sender_id: 'demo-user', content: 'Same here! Let me know your availability this week.', read: 1 },
];

const insertMessage = db.prepare(`
    INSERT INTO messages (id, match_id, sender_id, content, read)
    VALUES (@id, @match_id, @sender_id, @content, @read)
`);

const insertMessages = db.transaction(() => {
    for (const message of messages) {
        insertMessage.run(message);
    }
});
insertMessages();
console.log('✓ Messages seeded');

console.log('\n✅ Database seeding complete!');
console.log('Demo user credentials:');
console.log('  Email: demo@badmintonconnect.com');
console.log('  Password: demo123');
