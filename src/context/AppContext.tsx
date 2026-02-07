'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Player, Match } from '@/types';
import { mockCurrentUser, mockPlayers } from '@/lib/mock-data';

interface AppContextType {
    // User state
    currentUser: Player | null;
    setCurrentUser: (user: Player | null) => void;
    isAuthenticated: boolean;

    // Discover state
    discoverPlayers: Player[];
    setDiscoverPlayers: (players: Player[]) => void;
    currentCardIndex: number;
    setCurrentCardIndex: (index: number) => void;

    // Matches
    matches: Match[];
    addMatch: (match: Match) => void;

    // UI state
    showMatchModal: boolean;
    setShowMatchModal: (show: boolean) => void;
    matchedPlayer: Player | null;
    setMatchedPlayer: (player: Player | null) => void;

    // View state
    viewMode: 'cards' | 'map';
    setViewMode: (mode: 'cards' | 'map') => void;

    // Location
    userLocation: { lat: number; lng: number } | null;
    setUserLocation: (location: { lat: number; lng: number } | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    // For demo purposes, we'll use the mock user
    const [currentUser, setCurrentUser] = useState<Player | null>(null);
    const [discoverPlayers, setDiscoverPlayers] = useState<Player[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [matches, setMatches] = useState<Match[]>([]);
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [matchedPlayer, setMatchedPlayer] = useState<Player | null>(null);
    const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    // Initialize with mock data for demo
    useEffect(() => {
        // Simulating logged in state for demo
        setCurrentUser(mockCurrentUser);
        setDiscoverPlayers(mockPlayers);

        // Set default user location (Birmingham)
        setUserLocation({ lat: 52.4862, lng: -1.8904 });

        // Try to get real location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                () => {
                    // Keep default Birmingham location on error
                }
            );
        }
    }, []);

    const addMatch = (match: Match) => {
        setMatches((prev) => [match, ...prev]);
    };

    const value: AppContextType = {
        currentUser,
        setCurrentUser,
        isAuthenticated: !!currentUser,
        discoverPlayers,
        setDiscoverPlayers,
        currentCardIndex,
        setCurrentCardIndex,
        matches,
        addMatch,
        showMatchModal,
        setShowMatchModal,
        matchedPlayer,
        setMatchedPlayer,
        viewMode,
        setViewMode,
        userLocation,
        setUserLocation,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
