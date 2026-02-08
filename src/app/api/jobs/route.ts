import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
    getTournamentJobs,
    getTournamentJobById,
    getMyJobApplications,
    createJobApplication
} from '@/lib/db/queries';
import { getAuthUser, getAuthPlayer } from '@/lib/auth';

// GET /api/jobs - Get available jobs or my applications
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const myApplications = searchParams.get('my') === 'true';
        const jobId = searchParams.get('id');

        // Get specific job
        if (jobId) {
            const job = getTournamentJobById(jobId);
            if (!job) {
                return NextResponse.json({ error: 'Job not found' }, { status: 404 });
            }
            return NextResponse.json(job);
        }

        // Get my applications
        if (myApplications) {
            const auth = getAuthUser(request);
            if (!auth) {
                return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
            }
            const applications = getMyJobApplications(auth.userId);
            return NextResponse.json(applications);
        }

        // Get all available jobs
        const jobs = getTournamentJobs();
        return NextResponse.json(jobs);
    } catch (error) {
        console.error('Get jobs error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/jobs - Apply for a job
export async function POST(request: NextRequest) {
    try {
        const auth = getAuthUser(request);
        if (!auth) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const player = getAuthPlayer(request);
        if (!player) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { jobId, fullName, email, phone, coverLetter, availability, experiences } = body;

        const job = getTournamentJobById(jobId);
        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        const success = createJobApplication({
            id: uuidv4(),
            jobId,
            tournamentId: job.tournamentId,
            applicantId: auth.userId,
            fullName: fullName || player.name,
            email: email || player.email,
            phone: phone || '',
            photoUrl: player.avatarUrl,
            coverLetter: coverLetter || '',
            availability: availability || [],
            experiences: experiences?.map((e: any) => ({ ...e, id: uuidv4() })) || [],
        });

        if (!success) {
            return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error('Apply for job error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
