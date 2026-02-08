import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
    getAllTournaments,
    getTournamentById,
    getOrganisedTournaments,
    createTournament,
    joinTournament,
    leaveTournament,
    getAthleteRegistrations,
    getJobApplicationsForTournament,
    getTournamentJobs
} from '@/lib/db/queries';
import { getAuthUser } from '@/lib/auth';

// GET /api/tournaments
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const organised = searchParams.get('organised') === 'true';
        const jobs = searchParams.get('jobs') === 'true';
        const id = searchParams.get('id');

        // Get single tournament
        if (id) {
            const tournament = getTournamentById(id);
            if (!tournament) {
                return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
            }
            return NextResponse.json(tournament);
        }

        // Get tournament jobs for workers
        if (jobs) {
            const tournamentJobs = getTournamentJobs();
            return NextResponse.json(tournamentJobs);
        }

        // Get user's organised tournaments
        if (organised) {
            const auth = getAuthUser(request);
            if (!auth) {
                return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
            }
            const tournaments = getOrganisedTournaments(auth.userId);
            return NextResponse.json(tournaments);
        }

        // Get all public tournaments
        const tournaments = getAllTournaments();
        return NextResponse.json(tournaments);
    } catch (error) {
        console.error('Get tournaments error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/tournaments - Create tournament or join/leave
export async function POST(request: NextRequest) {
    try {
        const auth = getAuthUser(request);
        if (!auth) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await request.json();
        const { action, tournamentId, ...data } = body;

        // Join tournament action
        if (action === 'join') {
            const success = joinTournament(tournamentId, auth.userId);
            if (!success) {
                return NextResponse.json({ error: 'Already registered or tournament not found' }, { status: 400 });
            }
            return NextResponse.json({ success: true });
        }

        // Leave tournament action
        if (action === 'leave') {
            const success = leaveTournament(tournamentId, auth.userId);
            if (!success) {
                return NextResponse.json({ error: 'Not registered' }, { status: 400 });
            }
            return NextResponse.json({ success: true });
        }

        // Create new tournament
        const tournament = createTournament({
            id: uuidv4(),
            organizerId: auth.userId,
            organizer: '',
            ...data,
        });

        return NextResponse.json(tournament, { status: 201 });
    } catch (error) {
        console.error('Tournament action error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
