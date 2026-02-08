import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getPlayerById } from '@/lib/db/queries';

const JWT_SECRET = process.env.JWT_SECRET || 'badminton-connect-secret-key-change-in-production';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
        const user = getPlayerById(decoded.userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}
