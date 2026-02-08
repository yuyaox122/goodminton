import db, { DbVenue, DbBookedSession } from '../index';
import { BookedSession, BookingVenue, BookingParticipant, SplitMode, BookingStatus } from '@/types';
import { getPlayerById } from './players';

// ===== VENUES =====

export function getAllVenues(): BookingVenue[] {
    const rows = db.prepare('SELECT * FROM venues').all() as DbVenue[];
    return rows.map(r => ({
        id: r.id,
        name: r.name,
        pricePerHour: r.price_per_hour,
    }));
}

export function getVenueById(id: string): BookingVenue | null {
    const row = db.prepare('SELECT * FROM venues WHERE id = ?').get(id) as DbVenue | undefined;
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        pricePerHour: row.price_per_hour,
    };
}

export interface VenueWithDetails {
    id: string;
    name: string;
    address: string;
    pricePerHour: number;
    courts: number;
}

export function getVenuesWithDetails(): VenueWithDetails[] {
    const rows = db.prepare('SELECT * FROM venues').all() as DbVenue[];
    return rows.map(r => ({
        id: r.id,
        name: r.name,
        address: r.address,
        pricePerHour: r.price_per_hour,
        courts: r.courts,
    }));
}

// ===== COURTS (for map view) =====

export interface Court {
    id: string;
    name: string;
    lat: number;
    lng: number;
    courts: number;
    hourlyRate: number;
}

export function getAllCourts(): Court[] {
    const rows = db.prepare('SELECT * FROM courts').all() as {
        id: string;
        name: string;
        lat: number;
        lng: number;
        courts: number;
        hourly_rate: number;
    }[];

    return rows.map(r => ({
        id: r.id,
        name: r.name,
        lat: r.lat,
        lng: r.lng,
        courts: r.courts,
        hourlyRate: r.hourly_rate,
    }));
}

// ===== BOOKED SESSIONS =====

function toBookedSession(row: DbBookedSession, venue: BookingVenue, participants: BookingParticipant[]): BookedSession {
    return {
        id: row.id,
        date: row.date,
        time: row.time,
        duration: row.duration,
        venue,
        participants,
        totalCost: row.total_cost,
        splitMode: row.split_mode as SplitMode,
        status: row.status as BookingStatus,
        createdAt: row.created_at,
        createdBy: row.created_by,
    };
}

// Get all sessions for a user
export function getSessionsForUser(userId: string): BookedSession[] {
    // Get sessions where user is creator or participant
    const rows = db.prepare(`
        SELECT DISTINCT bs.* FROM booked_sessions bs
        LEFT JOIN session_participants sp ON bs.id = sp.session_id
        WHERE bs.created_by = ? OR sp.player_id = ?
        ORDER BY bs.date DESC
    `).all(userId, userId) as DbBookedSession[];

    return rows.map(row => {
        const venue = getVenueById(row.venue_id);
        const participants = getSessionParticipants(row.id);
        return toBookedSession(row, venue!, participants);
    });
}

// Get session by ID
export function getSessionById(id: string): BookedSession | null {
    const row = db.prepare('SELECT * FROM booked_sessions WHERE id = ?').get(id) as DbBookedSession | undefined;
    if (!row) return null;

    const venue = getVenueById(row.venue_id);
    const participants = getSessionParticipants(id);
    return toBookedSession(row, venue!, participants);
}

// Get participants for a session
function getSessionParticipants(sessionId: string): BookingParticipant[] {
    const rows = db.prepare(`
        SELECT sp.*, p.name, p.avatar_url 
        FROM session_participants sp
        JOIN players p ON sp.player_id = p.id
        WHERE sp.session_id = ?
    `).all(sessionId) as {
        session_id: string;
        player_id: string;
        share: number;
        custom_share: number | null;
        percentage: number | null;
        paid: number;
        name: string;
        avatar_url: string;
    }[];

    return rows.map(r => ({
        id: r.player_id,
        name: r.name,
        avatarUrl: r.avatar_url || '',
        share: r.share,
        customShare: r.custom_share || undefined,
        percentage: r.percentage || undefined,
        paid: r.paid === 1,
    }));
}

// Create session
export function createSession(data: {
    id: string;
    date: string;
    time: string;
    duration: number;
    venueId: string;
    totalCost: number;
    splitMode: SplitMode;
    status?: BookingStatus;
    createdBy: string;
    participants: { playerId: string; share: number; customShare?: number; percentage?: number; paid?: boolean }[];
}): BookedSession | null {
    try {
        db.prepare(`
            INSERT INTO booked_sessions (id, date, time, duration, venue_id, total_cost, split_mode, status, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            data.id,
            data.date,
            data.time,
            data.duration,
            data.venueId,
            data.totalCost,
            data.splitMode,
            data.status || 'pending',
            data.createdBy
        );

        // Insert participants
        const insertParticipant = db.prepare(`
            INSERT INTO session_participants (session_id, player_id, share, custom_share, percentage, paid)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        for (const p of data.participants) {
            insertParticipant.run(
                data.id,
                p.playerId,
                p.share,
                p.customShare || null,
                p.percentage || null,
                p.paid ? 1 : 0
            );
        }

        return getSessionById(data.id);
    } catch (e) {
        console.error('Failed to create session:', e);
        return null;
    }
}

// Update session
export function updateSession(id: string, data: Partial<{
    date: string;
    time: string;
    duration: number;
    venueId: string;
    totalCost: number;
    splitMode: SplitMode;
    status: BookingStatus;
}>): BookedSession | null {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (data.date !== undefined) { updates.push('date = ?'); values.push(data.date); }
    if (data.time !== undefined) { updates.push('time = ?'); values.push(data.time); }
    if (data.duration !== undefined) { updates.push('duration = ?'); values.push(data.duration); }
    if (data.venueId !== undefined) { updates.push('venue_id = ?'); values.push(data.venueId); }
    if (data.totalCost !== undefined) { updates.push('total_cost = ?'); values.push(data.totalCost); }
    if (data.splitMode !== undefined) { updates.push('split_mode = ?'); values.push(data.splitMode); }
    if (data.status !== undefined) { updates.push('status = ?'); values.push(data.status); }

    if (updates.length === 0) return getSessionById(id);

    values.push(id);
    db.prepare(`UPDATE booked_sessions SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    return getSessionById(id);
}

// Update participant payment status
export function updateParticipantPayment(sessionId: string, playerId: string, paid: boolean): boolean {
    const result = db.prepare(`
        UPDATE session_participants SET paid = ? WHERE session_id = ? AND player_id = ?
    `).run(paid ? 1 : 0, sessionId, playerId);
    return result.changes > 0;
}

// Update participant share
export function updateParticipantShare(sessionId: string, playerId: string, share: number): boolean {
    const result = db.prepare(`
        UPDATE session_participants SET share = ? WHERE session_id = ? AND player_id = ?
    `).run(share, sessionId, playerId);
    return result.changes > 0;
}

// Add participant to session
export function addSessionParticipant(sessionId: string, playerId: string, share: number): boolean {
    try {
        db.prepare(`
            INSERT INTO session_participants (session_id, player_id, share, paid)
            VALUES (?, ?, ?, 0)
        `).run(sessionId, playerId, share);
        return true;
    } catch {
        return false;
    }
}

// Remove participant from session
export function removeSessionParticipant(sessionId: string, playerId: string): boolean {
    const result = db.prepare(`
        DELETE FROM session_participants WHERE session_id = ? AND player_id = ?
    `).run(sessionId, playerId);
    return result.changes > 0;
}

// Delete session
export function deleteSession(id: string): boolean {
    const result = db.prepare('DELETE FROM booked_sessions WHERE id = ?').run(id);
    return result.changes > 0;
}
