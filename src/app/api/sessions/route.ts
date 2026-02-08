import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
    getSessionsForUser,
    getSessionById,
    createSession,
    updateSession,
    updateParticipantPayment,
    deleteSession,
    getAllVenues,
    getVenuesWithDetails
} from '@/lib/db/queries';
import { getAuthUser } from '@/lib/auth';

// GET /api/sessions
export async function GET(request: NextRequest) {
    try {
        const auth = getAuthUser(request);
        if (!auth) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('id');
        const venues = searchParams.get('venues') === 'true';

        // Get venues
        if (venues) {
            const venueList = getVenuesWithDetails();
            return NextResponse.json(venueList);
        }

        // Get specific session
        if (sessionId) {
            const session = getSessionById(sessionId);
            if (!session) {
                return NextResponse.json({ error: 'Session not found' }, { status: 404 });
            }
            return NextResponse.json(session);
        }

        // Get all user's sessions
        const sessions = getSessionsForUser(auth.userId);
        return NextResponse.json(sessions);
    } catch (error) {
        console.error('Get sessions error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/sessions - Create new session
export async function POST(request: NextRequest) {
    try {
        const auth = getAuthUser(request);
        if (!auth) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await request.json();
        const { date, time, duration, venueId, totalCost, splitMode, participants } = body;

        if (!date || !time || !venueId) {
            return NextResponse.json({ error: 'date, time, and venueId are required' }, { status: 400 });
        }

        const session = createSession({
            id: uuidv4(),
            date,
            time,
            duration: duration || 1,
            venueId,
            totalCost: totalCost || 0,
            splitMode: splitMode || 'equal',
            createdBy: auth.userId,
            participants: participants || [{ playerId: auth.userId, share: totalCost || 0, paid: false }],
        });

        if (!session) {
            return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
        }

        return NextResponse.json(session, { status: 201 });
    } catch (error) {
        console.error('Create session error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/sessions - Update session or payment status
export async function PATCH(request: NextRequest) {
    try {
        const auth = getAuthUser(request);
        if (!auth) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await request.json();
        const { sessionId, action, playerId, paid, ...updates } = body;

        if (!sessionId) {
            return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
        }

        // Update payment status
        if (action === 'payment') {
            if (!playerId || paid === undefined) {
                return NextResponse.json({ error: 'playerId and paid are required' }, { status: 400 });
            }
            const success = updateParticipantPayment(sessionId, playerId, paid);
            if (!success) {
                return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
            }
            const session = getSessionById(sessionId);
            return NextResponse.json(session);
        }

        // Update session details
        const session = updateSession(sessionId, updates);
        if (!session) {
            return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
        }

        return NextResponse.json(session);
    } catch (error) {
        console.error('Update session error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/sessions
export async function DELETE(request: NextRequest) {
    try {
        const auth = getAuthUser(request);
        if (!auth) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('id');

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
        }

        const success = deleteSession(sessionId);
        if (!success) {
            return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete session error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
