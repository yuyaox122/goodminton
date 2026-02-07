'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardStack, SwipeButtons } from '@/components/SwipeCard';
import { MapView } from '@/components/MapView';
import { MatchModal } from '@/components/MatchModal';
import { Header } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockPlayers, mockTournaments, mockClubs, mockCurrentUser } from '@/lib/mock-data';
import { Player, Match } from '@/types';
import { Map, LayoutGrid, Filter, SlidersHorizontal } from 'lucide-react';

export default function DiscoverPage() {
    const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [matchedPlayer, setMatchedPlayer] = useState<Player | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    const [swipedIds, setSwipedIds] = useState<Set<string>>(new Set());

    // Filter states
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        minSkill: 1,
        maxSkill: 10,
        playStyle: 'all',
        maxDistance: 50,
    });

    // User location (Birmingham for demo)
    const userLocation = { lat: 52.4862, lng: -1.8904 };

    // Filter players
    const availablePlayers = mockPlayers.filter(
        (p) => !swipedIds.has(p.id) && p.id !== mockCurrentUser.id
    );

    const handleSwipe = (direction: 'left' | 'right') => {
        const swipedPlayer = availablePlayers[0];
        if (!swipedPlayer) return;

        setSwipedIds((prev) => new Set([...prev, swipedPlayer.id]));

        if (direction === 'right') {
            // Simulate 40% chance of match for demo
            const isMatch = Math.random() < 0.4;

            if (isMatch) {
                const newMatch: Match = {
                    id: `match-${Date.now()}`,
                    player1Id: mockCurrentUser.id,
                    player2Id: swipedPlayer.id,
                    player1: mockCurrentUser,
                    player2: swipedPlayer,
                    matchedAt: new Date().toISOString(),
                    status: 'pending',
                };
                setMatches((prev) => [newMatch, ...prev]);
                setMatchedPlayer(swipedPlayer);
                setShowMatchModal(true);
            }
        }

        setCurrentIndex((prev) => prev + 1);
    };

    const handlePlayerClick = (player: Player) => {
        // Could show player detail modal
        console.log('Player clicked:', player);
    };

    return (
        <div className="min-h-screen pb-20">
            <Header
                title="Discover"
                subtitle={`${availablePlayers.length} players nearby`}
                rightElement={
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal size={20} />
                        </Button>
                        <Button
                            variant={viewMode === 'cards' ? 'default' : 'ghost'}
                            size="icon"
                            onClick={() => setViewMode('cards')}
                        >
                            <LayoutGrid size={20} />
                        </Button>
                        <Button
                            variant={viewMode === 'map' ? 'default' : 'ghost'}
                            size="icon"
                            onClick={() => setViewMode('map')}
                        >
                            <Map size={20} />
                        </Button>
                    </div>
                }
            />

            {/* Filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-b border-border"
                    >
                        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Play Style</label>
                                <div className="flex gap-2">
                                    {['all', 'singles', 'doubles'].map((style) => (
                                        <Badge
                                            key={style}
                                            variant={filters.playStyle === style ? 'default' : 'outline'}
                                            className="cursor-pointer capitalize"
                                            onClick={() => setFilters({ ...filters, playStyle: style })}
                                        >
                                            {style === 'all' ? 'All' : style}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Skill Level: {filters.minSkill} - {filters.maxSkill}
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                                        <button
                                            key={level}
                                            className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${level >= filters.minSkill && level <= filters.maxSkill
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground'
                                                }`}
                                            onClick={() => {
                                                if (level < filters.maxSkill) {
                                                    setFilters({ ...filters, minSkill: level });
                                                }
                                            }}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main content */}
            <div className="max-w-lg mx-auto px-4 pt-4">
                <AnimatePresence mode="wait">
                    {viewMode === 'cards' ? (
                        <motion.div
                            key="cards"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            {/* Card stack */}
                            <div className="relative h-[500px] w-full">
                                <CardStack
                                    players={availablePlayers}
                                    currentIndex={0}
                                    onSwipe={handleSwipe}
                                    userLocation={userLocation}
                                />
                            </div>

                            {/* Swipe buttons */}
                            <SwipeButtons
                                onSwipe={handleSwipe}
                                disabled={availablePlayers.length === 0}
                            />

                            {/* Instructions */}
                            <p className="text-center text-sm text-muted-foreground">
                                Swipe right to connect, left to pass
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="map"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="h-[600px] w-full">
                                <MapView
                                    players={availablePlayers}
                                    tournaments={mockTournaments}
                                    clubs={mockClubs}
                                    userLocation={userLocation}
                                    onPlayerClick={handlePlayerClick}
                                    showPlayers={true}
                                    showTournaments={true}
                                    showClubs={true}
                                    className="h-full"
                                />
                            </div>

                            {/* Map legend/stats */}
                            <div className="mt-4 flex justify-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                    {availablePlayers.length} Players
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-3 h-3 bg-yellow-500 rounded"></span>
                                    {mockTournaments.length} Tournaments
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-3 h-3 bg-purple-500 rounded"></span>
                                    {mockClubs.length} Clubs
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Match modal */}
            <MatchModal
                isOpen={showMatchModal}
                onClose={() => setShowMatchModal(false)}
                matchedPlayer={matchedPlayer}
                currentUser={mockCurrentUser}
            />
        </div>
    );
}
