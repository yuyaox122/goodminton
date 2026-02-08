import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
    createSwipe,
    getMatchesForUser,
    getMessagesForMatch,
    sendMessage,
    markMessagesAsRead
} from '@/lib/db/queries';
import { getAuthUser } from '@/lib/auth';

// GET /api/matches - Get user's matches
export async function GET(request: NextRequest) {
    try {
        const auth = getAuthUser(request);
        if (!auth) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const matchId = searchParams.get('matchId');

        // Get messages for a specific match
        if (matchId) {
            const messages = getMessagesForMatch(matchId);
            // Mark messages as read
            markMessagesAsRead(matchId, auth.userId);
            return NextResponse.json(messages);
        }

        const matches = getMatchesForUser(auth.userId);
        return NextResponse.json(matches);
    } catch (error) {
        console.error('Get matches error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/matches - Create swipe or send message
export async function POST(request: NextRequest) {
    try {
        const auth = getAuthUser(request);
        if (!auth) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await request.json();
        const { action, playerId, direction, matchId, content } = body;

        // Swipe action
        if (action === 'swipe') {
            if (!playerId || !direction) {
                return NextResponse.json({ error: 'playerId and direction are required' }, { status: 400 });
            }

            const result = createSwipe({
                id: uuidv4(),
                swiperId: auth.userId,
                swipedId: playerId,
                direction,
            });

            return NextResponse.json({
                swipe: result.swipe,
                match: result.match || null,
                isMatch: !!result.match,
            });
        }

        // Send message action
        if (action === 'message') {
            if (!matchId || !content) {
                return NextResponse.json({ error: 'matchId and content are required' }, { status: 400 });
            }

            const message = sendMessage({
                id: uuidv4(),
                matchId,
                senderId: auth.userId,
                content,
            });

            return NextResponse.json(message, { status: 201 });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Match action error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
