'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Navigation';
import { MapView } from '@/components/MapView';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { mockTournaments, mockCurrentUser } from '@/lib/mock-data';
import { Tournament } from '@/types';
import { formatDate, getSkillLabel } from '@/lib/utils';
import {
    Trophy,
    MapPin,
    Calendar,
    Users,
    Clock,
    Medal,
    Map,
    List,
    Filter,
    DollarSign,
} from 'lucide-react';

export default function TournamentsPage() {
    const [tournaments] = useState<Tournament[]>(mockTournaments);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
    const [filter, setFilter] = useState<'all' | 'singles' | 'doubles' | 'mixed'>('all');

    const userLocation = { lat: 52.4862, lng: -1.8904 };

    const filteredTournaments = tournaments.filter(
        t => filter === 'all' || t.format === filter
    );

    const handleJoin = (tournament: Tournament) => {
        // In real app, this would call API
        alert(`🎉 You've registered for ${tournament.name}!`);
        setSelectedTournament(null);
    };

    const isJoined = (tournament: Tournament) => {
        return tournament.currentPlayers.includes(mockCurrentUser.id);
    };

    const spotsLeft = (tournament: Tournament) => {
        return tournament.maxPlayers - tournament.currentPlayers.length;
    };

    return (
        <div className="min-h-screen pb-20">
            <Header
                title="Tournaments"
                subtitle={`${filteredTournaments.length} upcoming events`}
                rightElement={
                    <div className="flex gap-2">
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="icon"
                            onClick={() => setViewMode('list')}
                        >
                            <List size={20} />
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
            <div className="border-b border-border">
                <div className="max-w-lg mx-auto px-4 py-3">
                    <div className="flex gap-2 overflow-x-auto">
                        {(['all', 'singles', 'doubles', 'mixed'] as const).map((f) => (
                            <Badge
                                key={f}
                                variant={filter === f ? 'default' : 'outline'}
                                className="cursor-pointer capitalize whitespace-nowrap"
                                onClick={() => setFilter(f)}
                            >
                                {f === 'all' ? 'All Formats' : f}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-4 pt-4">
                <AnimatePresence mode="wait">
                    {viewMode === 'list' ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            {filteredTournaments.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="text-6xl mb-4">🏆</div>
                                    <h3 className="text-xl font-semibold mb-2">No tournaments found</h3>
                                    <p className="text-muted-foreground">
                                        Try changing your filters
                                    </p>
                                </div>
                            ) : (
                                filteredTournaments.map((tournament, index) => (
                                    <motion.div
                                        key={tournament.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card
                                            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                                            onClick={() => setSelectedTournament(tournament)}
                                        >
                                            <div className="relative h-32 bg-gradient-to-br from-yellow-500 to-orange-500">
                                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                    <Trophy size={48} className="text-white/80" />
                                                </div>
                                                <div className="absolute top-3 left-3">
                                                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 capitalize">
                                                        {tournament.format}
                                                    </Badge>
                                                </div>
                                                <div className="absolute top-3 right-3">
                                                    {spotsLeft(tournament) <= 5 && (
                                                        <Badge variant="destructive">
                                                            {spotsLeft(tournament)} spots left!
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <CardContent className="p-4">
                                                <h3 className="font-bold text-lg mb-2">{tournament.name}</h3>

                                                <div className="space-y-2 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={16} />
                                                        <span>{formatDate(tournament.date)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={16} />
                                                        <span className="truncate">{tournament.location.venue}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users size={16} />
                                                        <span>{tournament.currentPlayers.length}/{tournament.maxPlayers} players</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex gap-2">
                                                        <Badge variant="secondary">
                                                            Level {tournament.skillLevelMin}-{tournament.skillLevelMax}
                                                        </Badge>
                                                        {tournament.entryFee ? (
                                                            <Badge variant="secondary">£{tournament.entryFee}</Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="bg-green-500/20 text-green-600">Free</Badge>
                                                        )}
                                                    </div>
                                                    {isJoined(tournament) ? (
                                                        <Badge className="bg-green-500">Registered</Badge>
                                                    ) : (
                                                        <Button size="sm">Join</Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))
                            )}
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
                                    tournaments={filteredTournaments}
                                    userLocation={userLocation}
                                    onTournamentClick={setSelectedTournament}
                                    showPlayers={false}
                                    showTournaments={true}
                                    showClubs={false}
                                    className="h-full"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Tournament detail modal */}
            <Dialog open={!!selectedTournament} onOpenChange={() => setSelectedTournament(null)}>
                <DialogContent className="max-w-md mx-auto">
                    {selectedTournament && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Trophy className="text-yellow-500" />
                                    {selectedTournament.name}
                                </DialogTitle>
                                <DialogDescription>
                                    {selectedTournament.description}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                {/* Details */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={18} className="text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Date</p>
                                            <p className="font-medium">{formatDate(selectedTournament.date)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={18} className="text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Time</p>
                                            <p className="font-medium">
                                                {new Date(selectedTournament.date).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users size={18} className="text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Players</p>
                                            <p className="font-medium">
                                                {selectedTournament.currentPlayers.length}/{selectedTournament.maxPlayers}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign size={18} className="text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Entry Fee</p>
                                            <p className="font-medium">
                                                {selectedTournament.entryFee ? `£${selectedTournament.entryFee}` : 'Free'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <Card>
                                    <CardContent className="p-3">
                                        <div className="flex items-start gap-2">
                                            <MapPin size={18} className="text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="font-medium">{selectedTournament.location.venue}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedTournament.location.address}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Skill level */}
                                <div>
                                    <p className="text-sm font-medium mb-2">Skill Level Required</p>
                                    <div className="flex gap-1">
                                        {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
                                            <div
                                                key={level}
                                                className={`w-6 h-6 rounded text-xs flex items-center justify-center font-medium ${level >= selectedTournament.skillLevelMin &&
                                                        level <= selectedTournament.skillLevelMax
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted text-muted-foreground'
                                                    }`}
                                            >
                                                {level}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Prizes */}
                                {selectedTournament.prizes && selectedTournament.prizes.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                            <Medal size={16} className="text-yellow-500" />
                                            Prizes
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTournament.prizes.map((prize, i) => (
                                                <Badge key={i} variant="secondary">
                                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} {prize}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action */}
                                <div className="pt-2">
                                    {isJoined(selectedTournament) ? (
                                        <Button className="w-full" variant="outline" disabled>
                                            ✓ You're Registered
                                        </Button>
                                    ) : spotsLeft(selectedTournament) === 0 ? (
                                        <Button className="w-full" disabled>
                                            Tournament Full
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                                            onClick={() => handleJoin(selectedTournament)}
                                        >
                                            Register Now ({spotsLeft(selectedTournament)} spots left)
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
