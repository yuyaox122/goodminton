import { NextResponse } from 'next/server';
import { getAllCourts } from '@/lib/db/queries';

// GET /api/courts - Get all courts for map view
export async function GET() {
    try {
        const courts = getAllCourts();
        return NextResponse.json(courts);
    } catch (error) {
        console.error('Get courts error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
