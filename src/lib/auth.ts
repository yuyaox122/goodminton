import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { getPlayerById } from '@/lib/db/queries';
import { Player } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'badminton-connect-secret-key-change-in-production';

export interface AuthUser {
    userId: string;
    email: string;
}

// Get authenticated user from request
export function getAuthUser(request: NextRequest): AuthUser | null {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
        return decoded;
    } catch {
        return null;
    }
}

// Get full player profile from request
export function getAuthPlayer(request: NextRequest): Player | null {
    const auth = getAuthUser(request);
    if (!auth) return null;

    return getPlayerById(auth.userId);
}

// Require authentication helper
export function requireAuth(request: NextRequest): { userId: string } | null {
    const auth = getAuthUser(request);
    if (!auth) return null;
    return { userId: auth.userId };
}
