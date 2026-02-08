import { NextRequest, NextResponse } from 'next/server';
import { getAllClubs, joinClub, leaveClub, isClubMember, getClubsByPlayer } from '@/lib/db/queries';
import { getAuthUser } from '@/lib/auth';

// GET /api/clubs - Get all clubs
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const myClubs = searchParams.get('my') === 'true';

        if (myClubs) {
            const auth = getAuthUser(request);
            if (!auth) {
                return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
            }
            const clubs = getClubsByPlayer(auth.userId);
            return NextResponse.json(clubs);
        }

        const clubs = getAllClubs();
        return NextResponse.json(clubs);
    } catch (error) {
        console.error('Get clubs error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/clubs - Join or leave a club
export async function POST(request: NextRequest) {
    try {
        const auth = getAuthUser(request);
        if (!auth) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { clubId, action } = await request.json();

        if (!clubId || !action) {
            return NextResponse.json({ error: 'clubId and action are required' }, { status: 400 });
        }

        if (action === 'join') {
            const success = joinClub(clubId, auth.userId);
            if (!success) {
                return NextResponse.json({ error: 'Already a member or club not found' }, { status: 400 });
            }
            return NextResponse.json({ success: true, message: 'Joined club' });
        }

        if (action === 'leave') {
            const success = leaveClub(clubId, auth.userId);
            if (!success) {
                return NextResponse.json({ error: 'Not a member' }, { status: 400 });
            }
            return NextResponse.json({ success: true, message: 'Left club' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Club action error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
