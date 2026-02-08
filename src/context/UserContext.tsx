'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Player } from '@/types';
import { authAPI } from '@/lib/api/client';

interface UserContextType {
    user: Player | null;
    setUser: (user: Player | null) => void;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (data: { email: string; password: string; name: string }) => Promise<void>;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Player | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Try to restore session from JWT cookie
        authAPI.me()
            .then(data => setUser(data.user))
            .catch(() => {
                // Not logged in - that's fine
            })
            .finally(() => setIsLoading(false));
    }, []);

    const login = async (email: string, password: string) => {
        setError(null);
        setIsLoading(true);
        try {
            const data = await authAPI.login(email, password);
            setUser(data.user);
        } catch (err: any) {
            const message = err.message || 'Login failed';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: { email: string; password: string; name: string }) => {
        setError(null);
        setIsLoading(true);
        try {
            const result = await authAPI.register(data);
            setUser(result.user);
        } catch (err: any) {
            const message = err.message || 'Registration failed';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch {
            // Ignore logout errors
        }
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, isLoading, error, login, register, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
