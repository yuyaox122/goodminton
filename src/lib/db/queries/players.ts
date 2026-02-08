import db, { fromJSON, DbPlayer, DbPlayerStats } from '../index';
import { Player, PlayerStats } from '@/types';

// Convert database row to Player type
function toPlayer(row: DbPlayer & Partial<DbPlayerStats>): Player {
    return {
        id: row.id,
        email: row.email,
        name: row.name,
        bio: row.bio || '',
        avatarUrl: row.avatar_url || '',
        skillLevel: (row.skill_level || 5) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
        playStyle: (row.play_style || 'both') as 'singles' | 'doubles' | 'both',
        location: {
            lat: row.location_lat || 0,
            lng: row.location_lng || 0,
            city: row.location_city || '',
        },
        stats: {
            wins: row.wins || 0,
            losses: row.losses || 0,
            totalMatches: row.total_matches || 0,
            winRate: row.win_rate || 0,
            preferredDays: fromJSON<string[]>(row.preferred_days || '[]'),
            averageRating: row.average_rating || 0,
        },
        lookingFor: fromJSON<('casual' | 'competitive' | 'coaching')[]>(row.looking_for || '[]'),
        createdAt: row.created_at || new Date().toISOString(),
        updatedAt: row.updated_at || new Date().toISOString(),
    };
}

// Get all players
export function getAllPlayers(): Player[] {
    const rows = db.prepare(`
        SELECT p.*, ps.wins, ps.losses, ps.total_matches, ps.win_rate, ps.preferred_days, ps.average_rating
        FROM players p
        LEFT JOIN player_stats ps ON p.id = ps.player_id
    `).all() as (DbPlayer & DbPlayerStats)[];

    return rows.map(toPlayer);
}

// Get player by ID
export function getPlayerById(id: string): Player | null {
    const row = db.prepare(`
        SELECT p.*, ps.wins, ps.losses, ps.total_matches, ps.win_rate, ps.preferred_days, ps.average_rating
        FROM players p
        LEFT JOIN player_stats ps ON p.id = ps.player_id
        WHERE p.id = ?
    `).get(id) as (DbPlayer & DbPlayerStats) | undefined;

    return row ? toPlayer(row) : null;
}

// Get player by email
export function getPlayerByEmail(email: string): (Player & { passwordHash: string }) | null {
    const row = db.prepare(`
        SELECT p.*, ps.wins, ps.losses, ps.total_matches, ps.win_rate, ps.preferred_days, ps.average_rating
        FROM players p
        LEFT JOIN player_stats ps ON p.id = ps.player_id
        WHERE p.email = ?
    `).get(email) as (DbPlayer & DbPlayerStats) | undefined;

    if (!row) return null;

    return {
        ...toPlayer(row),
        passwordHash: row.password_hash,
    };
}

// Get players for swiping (excluding already swiped and self)
export function getPlayersForSwiping(currentUserId: string): Player[] {
    const rows = db.prepare(`
        SELECT p.*, ps.wins, ps.losses, ps.total_matches, ps.win_rate, ps.preferred_days, ps.average_rating
        FROM players p
        LEFT JOIN player_stats ps ON p.id = ps.player_id
        WHERE p.id != ?
        AND p.id NOT IN (
            SELECT swiped_id FROM partner_swipes WHERE swiper_id = ?
        )
    `).all(currentUserId, currentUserId) as (DbPlayer & DbPlayerStats)[];

    return rows.map(toPlayer);
}

// Create player
export function createPlayer(data: {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    bio?: string;
    avatarUrl?: string;
    skillLevel?: number;
    playStyle?: string;
    locationLat?: number;
    locationLng?: number;
    locationCity?: string;
    lookingFor?: string[];
}): Player {
    const stmt = db.prepare(`
        INSERT INTO players (id, email, password_hash, name, bio, avatar_url, skill_level, play_style, location_lat, location_lng, location_city, looking_for)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
        data.id,
        data.email,
        data.passwordHash,
        data.name,
        data.bio || '',
        data.avatarUrl || '',
        data.skillLevel || 5,
        data.playStyle || 'both',
        data.locationLat || null,
        data.locationLng || null,
        data.locationCity || '',
        JSON.stringify(data.lookingFor || [])
    );

    // Create initial stats
    db.prepare(`
        INSERT INTO player_stats (player_id, wins, losses, total_matches, win_rate, preferred_days, average_rating)
        VALUES (?, 0, 0, 0, 0, '[]', 0)
    `).run(data.id);

    return getPlayerById(data.id)!;
}

// Update player
export function updatePlayer(id: string, data: Partial<{
    name: string;
    bio: string;
    avatarUrl: string;
    skillLevel: number;
    playStyle: string;
    locationLat: number;
    locationLng: number;
    locationCity: string;
    lookingFor: string[];
}>): Player | null {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (data.name !== undefined) { updates.push('name = ?'); values.push(data.name); }
    if (data.bio !== undefined) { updates.push('bio = ?'); values.push(data.bio); }
    if (data.avatarUrl !== undefined) { updates.push('avatar_url = ?'); values.push(data.avatarUrl); }
    if (data.skillLevel !== undefined) { updates.push('skill_level = ?'); values.push(data.skillLevel); }
    if (data.playStyle !== undefined) { updates.push('play_style = ?'); values.push(data.playStyle); }
    if (data.locationLat !== undefined) { updates.push('location_lat = ?'); values.push(data.locationLat); }
    if (data.locationLng !== undefined) { updates.push('location_lng = ?'); values.push(data.locationLng); }
    if (data.locationCity !== undefined) { updates.push('location_city = ?'); values.push(data.locationCity); }
    if (data.lookingFor !== undefined) { updates.push('looking_for = ?'); values.push(JSON.stringify(data.lookingFor)); }

    if (updates.length === 0) return getPlayerById(id);

    updates.push("updated_at = datetime('now')");
    values.push(id);

    db.prepare(`UPDATE players SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    return getPlayerById(id);
}

// Update player stats
export function updatePlayerStats(playerId: string, stats: Partial<PlayerStats>): void {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (stats.wins !== undefined) { updates.push('wins = ?'); values.push(stats.wins); }
    if (stats.losses !== undefined) { updates.push('losses = ?'); values.push(stats.losses); }
    if (stats.totalMatches !== undefined) { updates.push('total_matches = ?'); values.push(stats.totalMatches); }
    if (stats.winRate !== undefined) { updates.push('win_rate = ?'); values.push(stats.winRate); }
    if (stats.preferredDays !== undefined) { updates.push('preferred_days = ?'); values.push(JSON.stringify(stats.preferredDays)); }
    if (stats.averageRating !== undefined) { updates.push('average_rating = ?'); values.push(stats.averageRating); }

    if (updates.length === 0) return;

    updates.push("updated_at = datetime('now')");
    values.push(playerId);

    db.prepare(`UPDATE player_stats SET ${updates.join(', ')} WHERE player_id = ?`).run(...values);
}
