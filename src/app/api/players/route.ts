import { NextRequest, NextResponse } from 'next/server';
import { getAllPlayers, getPlayersForSwiping, updatePlayer } from '@/lib/db/queries';
import { getAuthUser } from '@/lib/auth';

// GET /api/players - Get all players or players for swiping
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const forSwiping = searchParams.get('forSwiping') === 'true';

        if (forSwiping) {
            const auth = getAuthUser(request);
            if (!auth) {
                return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
            }
            const players = getPlayersForSwiping(auth.userId);
            return NextResponse.json(players);
        }

        const players = getAllPlayers();
        return NextResponse.json(players);
    } catch (error) {
        console.error('Get players error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/players - Update current user profile
export async function PATCH(request: NextRequest) {
    try {
        const auth = getAuthUser(request);
        if (!auth) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const data = await request.json();
        const updated = updatePlayer(auth.userId, data);

        if (!updated) {
            return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update player error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
