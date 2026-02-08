import db from '../index';
import { PartnerSwipe, PartnerMatch, Message, Player } from '@/types';
import { getPlayerById } from './players';

// ===== PARTNER SWIPES =====

// Create a swipe
export function createSwipe(data: {
    id: string;
    swiperId: string;
    swipedId: string;
    direction: 'like' | 'pass';
}): { swipe: PartnerSwipe; match?: PartnerMatch } {
    db.prepare(`
        INSERT INTO partner_swipes (id, swiper_id, swiped_id, direction)
        VALUES (?, ?, ?, ?)
    `).run(data.id, data.swiperId, data.swipedId, data.direction);

    const swipe: PartnerSwipe = {
        id: data.id,
        swiperId: data.swiperId,
        swipedId: data.swipedId,
        direction: data.direction,
        createdAt: new Date().toISOString(),
    };

    // Check for mutual like (match)
    if (data.direction === 'like') {
        const mutualSwipe = db.prepare(`
            SELECT * FROM partner_swipes 
            WHERE swiper_id = ? AND swiped_id = ? AND direction = 'like'
        `).get(data.swipedId, data.swiperId) as { id: string } | undefined;

        if (mutualSwipe) {
            // Create a match
            const matchId = `match-${Date.now()}`;
            const compatibility = calculateCompatibility(data.swiperId, data.swipedId);

            db.prepare(`
                INSERT INTO partner_matches (id, player1_id, player2_id, compatibility)
                VALUES (?, ?, ?, ?)
            `).run(matchId, data.swiperId, data.swipedId, compatibility);

            const match: PartnerMatch = {
                id: matchId,
                player1Id: data.swiperId,
                player2Id: data.swipedId,
                player1: getPlayerById(data.swiperId) || undefined,
                player2: getPlayerById(data.swipedId) || undefined,
                matchedAt: new Date().toISOString(),
                compatibility,
            };

            return { swipe, match };
        }
    }

    return { swipe };
}

// Calculate compatibility between two players
function calculateCompatibility(player1Id: string, player2Id: string): number {
    const p1 = getPlayerById(player1Id);
    const p2 = getPlayerById(player2Id);

    if (!p1 || !p2) return 50;

    let score = 50;

    // Similar skill level (within 2 levels = +20, within 4 = +10)
    const skillDiff = Math.abs(p1.skillLevel - p2.skillLevel);
    if (skillDiff <= 2) score += 20;
    else if (skillDiff <= 4) score += 10;

    // Same play style = +15
    if (p1.playStyle === p2.playStyle || p1.playStyle === 'both' || p2.playStyle === 'both') {
        score += 15;
    }

    // Overlapping looking for = +15
    const overlap = p1.lookingFor.filter(x => p2.lookingFor.includes(x));
    if (overlap.length > 0) score += 15;

    return Math.min(100, score);
}

// Get swipes by user
export function getSwipesByUser(userId: string): PartnerSwipe[] {
    const rows = db.prepare('SELECT * FROM partner_swipes WHERE swiper_id = ?').all(userId) as {
        id: string;
        swiper_id: string;
        swiped_id: string;
        direction: string;
        created_at: string;
    }[];

    return rows.map(r => ({
        id: r.id,
        swiperId: r.swiper_id,
        swipedId: r.swiped_id,
        direction: r.direction as 'like' | 'pass',
        createdAt: r.created_at,
    }));
}

// ===== PARTNER MATCHES =====

// Get matches for user
export function getMatchesForUser(userId: string): PartnerMatch[] {
    const rows = db.prepare(`
        SELECT * FROM partner_matches 
        WHERE player1_id = ? OR player2_id = ?
    `).all(userId, userId) as {
        id: string;
        player1_id: string;
        player2_id: string;
        matched_at: string;
        compatibility: number;
    }[];

    return rows.map(r => ({
        id: r.id,
        player1Id: r.player1_id,
        player2Id: r.player2_id,
        player1: getPlayerById(r.player1_id) || undefined,
        player2: getPlayerById(r.player2_id) || undefined,
        matchedAt: r.matched_at,
        compatibility: r.compatibility,
    }));
}

// Get match by ID
export function getMatchById(id: string): PartnerMatch | null {
    const row = db.prepare('SELECT * FROM partner_matches WHERE id = ?').get(id) as {
        id: string;
        player1_id: string;
        player2_id: string;
        matched_at: string;
        compatibility: number;
    } | undefined;

    if (!row) return null;

    return {
        id: row.id,
        player1Id: row.player1_id,
        player2Id: row.player2_id,
        player1: getPlayerById(row.player1_id) || undefined,
        player2: getPlayerById(row.player2_id) || undefined,
        matchedAt: row.matched_at,
        compatibility: row.compatibility,
    };
}

// ===== MESSAGES =====

// Get messages for a match
export function getMessagesForMatch(matchId: string): Message[] {
    const rows = db.prepare(`
        SELECT * FROM messages WHERE match_id = ? ORDER BY created_at ASC
    `).all(matchId) as {
        id: string;
        match_id: string;
        sender_id: string;
        content: string;
        created_at: string;
        read: number;
    }[];

    return rows.map(r => ({
        id: r.id,
        matchId: r.match_id,
        senderId: r.sender_id,
        content: r.content,
        createdAt: r.created_at,
        read: r.read === 1,
    }));
}

// Send message
export function sendMessage(data: {
    id: string;
    matchId: string;
    senderId: string;
    content: string;
}): Message {
    db.prepare(`
        INSERT INTO messages (id, match_id, sender_id, content)
        VALUES (?, ?, ?, ?)
    `).run(data.id, data.matchId, data.senderId, data.content);

    return {
        id: data.id,
        matchId: data.matchId,
        senderId: data.senderId,
        content: data.content,
        createdAt: new Date().toISOString(),
        read: false,
    };
}

// Mark messages as read
export function markMessagesAsRead(matchId: string, readerId: string): void {
    db.prepare(`
        UPDATE messages SET read = 1 
        WHERE match_id = ? AND sender_id != ?
    `).run(matchId, readerId);
}

// Get unread count for user
export function getUnreadCount(userId: string): number {
    const matches = getMatchesForUser(userId);
    let total = 0;

    for (const match of matches) {
        const count = db.prepare(`
            SELECT COUNT(*) as count FROM messages 
            WHERE match_id = ? AND sender_id != ? AND read = 0
        `).get(match.id, userId) as { count: number };
        total += count.count;
    }

    return total;
}
