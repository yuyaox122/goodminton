import db, { fromJSON, DbClub } from '../index';
import { Club, SkillLevel } from '@/types';
import { getPlayerById } from './players';

// Convert database row to Club type
function toClub(row: DbClub, memberCount: number, members: string[]): Club {
    return {
        id: row.id,
        name: row.name,
        description: row.description || '',
        avatarUrl: row.avatar_url || undefined,
        location: {
            lat: row.location_lat || 0,
            lng: row.location_lng || 0,
            address: row.location_address || '',
        },
        memberCount,
        members,
        activityLevel: (row.activity_level || 'medium') as 'low' | 'medium' | 'high',
        meetingDays: fromJSON<string[]>(row.meeting_days || '[]'),
        skillLevelRange: [row.skill_level_min as SkillLevel || 1, row.skill_level_max as SkillLevel || 10],
        isOpen: row.is_open === 1,
        createdAt: row.created_at || new Date().toISOString(),
    };
}

// Get all clubs
export function getAllClubs(): Club[] {
    const clubs = db.prepare('SELECT * FROM clubs').all() as DbClub[];

    return clubs.map(club => {
        const members = db.prepare('SELECT player_id FROM club_members WHERE club_id = ?')
            .all(club.id) as { player_id: string }[];
        return toClub(club, members.length, members.map(m => m.player_id));
    });
}

// Get club by ID
export function getClubById(id: string): Club | null {
    const club = db.prepare('SELECT * FROM clubs WHERE id = ?').get(id) as DbClub | undefined;
    if (!club) return null;

    const members = db.prepare('SELECT player_id FROM club_members WHERE club_id = ?')
        .all(id) as { player_id: string }[];

    return toClub(club, members.length, members.map(m => m.player_id));
}

// Get clubs by player
export function getClubsByPlayer(playerId: string): Club[] {
    const clubIds = db.prepare('SELECT club_id FROM club_members WHERE player_id = ?')
        .all(playerId) as { club_id: string }[];

    return clubIds.map(({ club_id }) => getClubById(club_id)).filter(Boolean) as Club[];
}

// Create club
export function createClub(data: {
    id: string;
    name: string;
    description?: string;
    avatarUrl?: string;
    locationLat?: number;
    locationLng?: number;
    locationAddress?: string;
    activityLevel?: string;
    meetingDays?: string[];
    skillLevelMin?: number;
    skillLevelMax?: number;
    isOpen?: boolean;
}): Club {
    db.prepare(`
        INSERT INTO clubs (id, name, description, avatar_url, location_lat, location_lng, location_address, activity_level, meeting_days, skill_level_min, skill_level_max, is_open)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        data.id,
        data.name,
        data.description || '',
        data.avatarUrl || '',
        data.locationLat || null,
        data.locationLng || null,
        data.locationAddress || '',
        data.activityLevel || 'medium',
        JSON.stringify(data.meetingDays || []),
        data.skillLevelMin || 1,
        data.skillLevelMax || 10,
        data.isOpen !== false ? 1 : 0
    );

    return getClubById(data.id)!;
}

// Join club
export function joinClub(clubId: string, playerId: string): boolean {
    try {
        db.prepare('INSERT INTO club_members (club_id, player_id) VALUES (?, ?)').run(clubId, playerId);
        return true;
    } catch {
        return false;
    }
}

// Leave club
export function leaveClub(clubId: string, playerId: string): boolean {
    const result = db.prepare('DELETE FROM club_members WHERE club_id = ? AND player_id = ?').run(clubId, playerId);
    return result.changes > 0;
}

// Check if player is member
export function isClubMember(clubId: string, playerId: string): boolean {
    const row = db.prepare('SELECT 1 FROM club_members WHERE club_id = ? AND player_id = ?').get(clubId, playerId);
    return !!row;
}

// Get club members with player details
export function getClubMembers(clubId: string) {
    const members = db.prepare('SELECT player_id FROM club_members WHERE club_id = ?')
        .all(clubId) as { player_id: string }[];

    return members.map(m => getPlayerById(m.player_id)).filter(Boolean);
}
