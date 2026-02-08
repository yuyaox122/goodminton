import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
    getAthleteRegistrations,
    createAthleteRegistration,
    updateAthleteRegistrationStatus
} from '@/lib/db/queries';
import { getAuthUser, getAuthPlayer } from '@/lib/auth';

// GET /api/tournaments/[id]/athletes
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const athletes = getAthleteRegistrations(id);
        return NextResponse.json(athletes);
    } catch (error) {
        console.error('Get athletes error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/tournaments/[id]/athletes - Register as athlete
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = getAuthUser(request);
        if (!auth) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const player = getAuthPlayer(request);
        if (!player) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { id } = await params;
        const { discipline, category, gender } = await request.json();

        const registration = createAthleteRegistration({
            id: uuidv4(),
            tournamentId: id,
            playerId: auth.userId,
            discipline: discipline || [],
            category: category || 'Senior (21+)',
            gender: gender || '',
            skillLevel: player.skillLevel,
        });

        if (!registration) {
            return NextResponse.json({ error: 'Already registered or tournament not found' }, { status: 400 });
        }

        return NextResponse.json(registration, { status: 201 });
    } catch (error) {
        console.error('Register athlete error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/tournaments/[id]/athletes - Update registration status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = getAuthUser(request);
        if (!auth) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { registrationId, status } = await request.json();

        if (!registrationId || !status) {
            return NextResponse.json({ error: 'registrationId and status are required' }, { status: 400 });
        }

        const success = updateAthleteRegistrationStatus(registrationId, status);

        if (!success) {
            return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
