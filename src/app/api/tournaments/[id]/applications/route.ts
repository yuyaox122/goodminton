import { NextRequest, NextResponse } from 'next/server';
import {
    getJobApplicationsForTournament,
    getJobApplicationById,
    updateJobApplicationStatus
} from '@/lib/db/queries';
import { getAuthUser } from '@/lib/auth';

// GET /api/tournaments/[id]/applications
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = getAuthUser(request);
        if (!auth) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { id } = await params;
        const applications = getJobApplicationsForTournament(id);
        return NextResponse.json(applications);
    } catch (error) {
        console.error('Get applications error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/tournaments/[id]/applications - Update application status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = getAuthUser(request);
        if (!auth) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { applicationId, status, notes } = await request.json();

        if (!applicationId || !status) {
            return NextResponse.json({ error: 'applicationId and status are required' }, { status: 400 });
        }

        const success = updateJobApplicationStatus(applicationId, status, notes);

        if (!success) {
            return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
        }

        const updated = getJobApplicationById(applicationId);
        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update application error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
