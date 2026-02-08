import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { createPlayer, getPlayerByEmail } from '@/lib/db/queries';

const JWT_SECRET = process.env.JWT_SECRET || 'badminton-connect-secret-key-change-in-production';

export async function POST(request: NextRequest) {
    try {
        const { email, password, name, skillLevel, playStyle, locationCity } = await request.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = getPlayerByEmail(email);
        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
        }

        // Hash password
        const passwordHash = bcrypt.hashSync(password, 10);

        // Create user
        const user = createPlayer({
            id: uuidv4(),
            email,
            passwordHash,
            name,
            skillLevel: skillLevel || 5,
            playStyle: playStyle || 'both',
            locationCity: locationCity || '',
            lookingFor: ['casual'],
        });

        // Create JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const response = NextResponse.json({
            user,
            token,
        });

        // Set HTTP-only cookie
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
