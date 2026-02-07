'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Navigation';
import { MapView } from '@/components/MapView';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { mockClubs, mockCurrentUser, mockPlayers } from '@/lib/mock-data';
import { Club } from '@/types';
import { getSkillLabel } from '@/lib/utils';
import {
    Users,
    MapPin,
    Calendar,
    Activity,
    Map,
    List,
    Lock,
    Unlock,
    Star,
    CheckCircle,
} from 'lucide-react';

export default function ClubsPage() {
    const [clubs] = useState<Club[]>(mockClubs);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [selectedClub, setSelectedClub] = useState<Club | null>(null);
    const [joinedClubs, setJoinedClubs] = useState<Set<string>>(new Set(['c2'])); // User already in Aston Shuttlers

    const userLocation = { lat: 52.4862, lng: -1.8904 };

    const handleJoin = (club: Club) => {
        if (club.isOpen) {
            setJoinedClubs(prev => new Set([...prev, club.id]));
            alert(`🎉 Welcome to ${club.name}!`);
        } else {
            alert(`📩 Request sent to join ${club.name}. The admin will review your application.`);
        }
        setSelectedClub(null);
    };

    const getActivityColor = (level: string) => {
        switch (level) {
            case 'high': return 'text-green-500';
            case 'medium': return 'text-yellow-500';
            case 'low': return 'text-red-500';
            default: return 'text-muted-foreground';
        }
    };

    // Get member avatars for a club
    const getMemberAvatars = (club: Club) => {
        return mockPlayers.filter(p => club.members.includes(p.id)).slice(0, 3);
    };

    return (
        <div className="min-h-screen pb-20">
            <Header
                title="Clubs"
                subtitle={`${clubs.length} clubs near you`}
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
                            {/* My Clubs */}
                            {joinedClubs.size > 0 && (
                                <div>
                                    <h2 className="text-sm font-medium text-muted-foreground mb-3">My Clubs</h2>
                                    <div className="space-y-3">
                                        {clubs.filter(c => joinedClubs.has(c.id)).map((club) => (
                                            <motion.div key={club.id} whileHover={{ scale: 1.01 }}>
                                                <Card
                                                    className="overflow-hidden cursor-pointer border-green-500/30 bg-green-500/5"
                                                    onClick={() => setSelectedClub(club)}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg">
                                                                🏟️
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="font-bold truncate">{club.name}</h3>
                                                                    <Badge variant="secondary" className="bg-green-500/20 text-green-600 text-xs">
                                                                        <CheckCircle size={12} className="mr-1" />
                                                                        Member
                                                                    </Badge>
                                                                </div>

                                                                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                                                    <span className="flex items-center gap-1">
                                                                        <Users size={14} />
                                                                        {club.memberCount}
                                                                    </span>
                                                                    <span className={`flex items-center gap-1 ${getActivityColor(club.activityLevel)}`}>
                                                                        <Activity size={14} />
                                                                        {club.activityLevel}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Discover Clubs */}
                            <div>
                                <h2 className="text-sm font-medium text-muted-foreground mb-3">Discover Clubs</h2>
                                <div className="space-y-3">
                                    {clubs.filter(c => !joinedClubs.has(c.id)).map((club, index) => (
                                        <motion.div
                                            key={club.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.01 }}
                                        >
                                            <Card
                                                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                                                onClick={() => setSelectedClub(club)}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg overflow-hidden">
                                                            {club.avatarUrl ? (
                                                                <img src={club.avatarUrl} alt={club.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                '🏟️'
                                                            )}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="font-bold truncate">{club.name}</h3>
                                                                {club.isOpen ? (
                                                                    <Unlock size={14} className="text-green-500" />
                                                                ) : (
                                                                    <Lock size={14} className="text-yellow-500" />
                                                                )}
                                                            </div>

                                                            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                                                                {club.description}
                                                            </p>

                                                            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                                                                <span className="flex items-center gap-1">
                                                                    <Users size={14} />
                                                                    {club.memberCount} members
                                                                </span>
                                                                <span className={`flex items-center gap-1 ${getActivityColor(club.activityLevel)}`}>
                                                                    <Activity size={14} />
                                                                    {club.activityLevel}
                                                                </span>
                                                            </div>

                                                            {/* Member avatars preview */}
                                                            <div className="flex items-center mt-3">
                                                                <div className="flex -space-x-2">
                                                                    {getMemberAvatars(club).map((member) => (
                                                                        <Avatar key={member.id} className="w-7 h-7 border-2 border-background">
                                                                            <AvatarImage src={member.avatarUrl} />
                                                                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                                                                        </Avatar>
                                                                    ))}
                                                                </div>
                                                                {club.memberCount > 3 && (
                                                                    <span className="text-xs text-muted-foreground ml-2">
                                                                        +{club.memberCount - 3} more
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
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
                                    clubs={clubs}
                                    userLocation={userLocation}
                                    onClubClick={setSelectedClub}
                                    showPlayers={false}
                                    showTournaments={false}
                                    showClubs={true}
                                    className="h-full"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Club detail modal */}
            <Dialog open={!!selectedClub} onOpenChange={() => setSelectedClub(null)}>
                <DialogContent className="max-w-md mx-auto">
                    {selectedClub && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg overflow-hidden">
                                        {selectedClub.avatarUrl ? (
                                            <img src={selectedClub.avatarUrl} alt={selectedClub.name} className="w-full h-full object-cover" />
                                        ) : (
                                            '🏟️'
                                        )}
                                    </div>
                                    <div>
                                        <DialogTitle className="flex items-center gap-2">
                                            {selectedClub.name}
                                            {selectedClub.isOpen ? (
                                                <Badge variant="secondary" className="bg-green-500/20 text-green-600">Open</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">Invite Only</Badge>
                                            )}
                                        </DialogTitle>
                                        <DialogDescription className="flex items-center gap-2 mt-1">
                                            <Star size={14} className="text-yellow-500" />
                                            {selectedClub.activityLevel} activity
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    {selectedClub.description}
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Users size={18} className="text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Members</p>
                                            <p className="font-medium">{selectedClub.memberCount}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Activity size={18} className="text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Activity</p>
                                            <p className="font-medium capitalize">{selectedClub.activityLevel}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <Card>
                                    <CardContent className="p-3">
                                        <div className="flex items-start gap-2">
                                            <MapPin size={18} className="text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedClub.location.address}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Meeting days */}
                                <div>
                                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                        <Calendar size={16} />
                                        Meeting Days
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                                            const fullDay = {
                                                Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday',
                                                Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
                                            }[day];
                                            const isActive = selectedClub.meetingDays.includes(fullDay!);
                                            return (
                                                <Badge
                                                    key={day}
                                                    variant={isActive ? 'default' : 'outline'}
                                                    className={isActive ? 'bg-primary' : 'opacity-50'}
                                                >
                                                    {day}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Skill level range */}
                                <div>
                                    <p className="text-sm font-medium mb-2">Skill Level Range</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">
                                            {getSkillLabel(selectedClub.skillLevelRange[0])}
                                        </Badge>
                                        <span className="text-muted-foreground">to</span>
                                        <Badge variant="secondary">
                                            {getSkillLabel(selectedClub.skillLevelRange[1])}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Members preview */}
                                <div>
                                    <p className="text-sm font-medium mb-2">Members</p>
                                    <div className="flex items-center">
                                        <div className="flex -space-x-3">
                                            {getMemberAvatars(selectedClub).map((member) => (
                                                <Avatar key={member.id} className="w-10 h-10 border-2 border-background">
                                                    <AvatarImage src={member.avatarUrl} />
                                                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                                                </Avatar>
                                            ))}
                                        </div>
                                        {selectedClub.memberCount > 3 && (
                                            <span className="text-sm text-muted-foreground ml-3">
                                                +{selectedClub.memberCount - 3} more members
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="pt-2">
                                    {joinedClubs.has(selectedClub.id) ? (
                                        <Button className="w-full" variant="outline" disabled>
                                            <CheckCircle size={18} className="mr-2" />
                                            You're a Member
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                            onClick={() => handleJoin(selectedClub)}
                                        >
                                            {selectedClub.isOpen ? 'Join Club' : 'Request to Join'}
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
