'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Player } from '@/types';
import { Badge } from '@/components/ui/badge';
import { getSkillLabel, getSkillColor, formatDistance, calculateDistance } from '@/lib/utils';
import { MapPin, Trophy, Calendar, Heart, X } from 'lucide-react';

interface SwipeCardProps {
    player: Player;
    onSwipe: (direction: 'left' | 'right') => void;
    userLocation?: { lat: number; lng: number } | null;
    isTop?: boolean;
}

export function SwipeCard({ player, onSwipe, userLocation, isTop = false }: SwipeCardProps) {
    const [exitX, setExitX] = useState(0);

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

    // Indicator opacities
    const likeOpacity = useTransform(x, [0, 100], [0, 1]);
    const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

    const distance = userLocation
        ? calculateDistance(
            userLocation.lat,
            userLocation.lng,
            player.location.lat,
            player.location.lng
        )
        : null;

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
        if (info.offset.x > 100) {
            setExitX(300);
            onSwipe('right');
        } else if (info.offset.x < -100) {
            setExitX(-300);
            onSwipe('left');
        }
    };

    return (
        <motion.div
            className="absolute w-full h-full"
            style={{ x, rotate, opacity }}
            drag={isTop ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
            animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
            exit={{ x: exitX, opacity: 0, transition: { duration: 0.2 } }}
            whileDrag={{ cursor: 'grabbing' }}
        >
            <div className="relative w-full h-full bg-card rounded-3xl overflow-hidden shadow-2xl border border-border">
                {/* Profile Image */}
                <div className="relative h-[60%] overflow-hidden">
                    <img
                        src={player.avatarUrl}
                        alt={player.name}
                        className="w-full h-full object-cover"
                        draggable={false}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Like indicator */}
                    <motion.div
                        className="absolute top-8 right-8 border-4 border-green-500 text-green-500 px-4 py-2 rounded-lg font-bold text-2xl rotate-12"
                        style={{ opacity: likeOpacity }}
                    >
                        LIKE
                    </motion.div>

                    {/* Nope indicator */}
                    <motion.div
                        className="absolute top-8 left-8 border-4 border-red-500 text-red-500 px-4 py-2 rounded-lg font-bold text-2xl -rotate-12"
                        style={{ opacity: nopeOpacity }}
                    >
                        NOPE
                    </motion.div>

                    {/* Basic info overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-end justify-between">
                            <div>
                                <h2 className="text-3xl font-bold">{player.name}</h2>
                                <div className="flex items-center gap-2 mt-1 text-white/90">
                                    {distance !== null && (
                                        <span className="flex items-center gap-1">
                                            <MapPin size={16} />
                                            {formatDistance(distance)}
                                        </span>
                                    )}
                                    {player.location.city && (
                                        <span>• {player.location.city}</span>
                                    )}
                                </div>
                            </div>

                            {/* Skill badge */}
                            <div
                                className="px-3 py-1.5 rounded-full font-semibold text-white"
                                style={{ backgroundColor: getSkillColor(player.skillLevel) }}
                            >
                                {getSkillLabel(player.skillLevel)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="h-[40%] p-5 flex flex-col">
                    {/* Bio */}
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                        {player.bio}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="flex items-center gap-1">
                            🏸 {player.playStyle === 'both' ? 'Singles & Doubles' : player.playStyle.charAt(0).toUpperCase() + player.playStyle.slice(1)}
                        </Badge>
                        {player.lookingFor.map((type) => (
                            <Badge key={type} variant="outline" className="capitalize">
                                {type}
                            </Badge>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-border">
                        <div className="flex items-center gap-1.5">
                            <Trophy size={16} className="text-yellow-500" />
                            <span className="text-sm font-medium">{player.stats.winRate}% win rate</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar size={16} className="text-primary" />
                            <span className="text-sm text-muted-foreground">
                                {player.stats.preferredDays.slice(0, 2).join(', ')}
                                {player.stats.preferredDays.length > 2 && '...'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Swipe buttons component
interface SwipeButtonsProps {
    onSwipe: (direction: 'left' | 'right') => void;
    disabled?: boolean;
}

export function SwipeButtons({ onSwipe, disabled }: SwipeButtonsProps) {
    return (
        <div className="flex justify-center gap-6 mt-6">
            <motion.button
                className="w-16 h-16 rounded-full bg-card border-2 border-red-500 text-red-500 flex items-center justify-center shadow-lg disabled:opacity-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onSwipe('left')}
                disabled={disabled}
            >
                <X size={32} />
            </motion.button>

            <motion.button
                className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white flex items-center justify-center shadow-lg disabled:opacity-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onSwipe('right')}
                disabled={disabled}
            >
                <Heart size={36} fill="white" />
            </motion.button>
        </div>
    );
}

// Card stack component
interface CardStackProps {
    players: Player[];
    currentIndex: number;
    onSwipe: (direction: 'left' | 'right') => void;
    userLocation?: { lat: number; lng: number } | null;
}

export function CardStack({ players, currentIndex, onSwipe, userLocation }: CardStackProps) {
    const visiblePlayers = players.slice(currentIndex, currentIndex + 3);

    if (visiblePlayers.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🏸</div>
                    <h3 className="text-xl font-semibold mb-2">No more players</h3>
                    <p className="text-muted-foreground">Check back later for new connections!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            <AnimatePresence>
                {visiblePlayers.map((player, index) => (
                    <SwipeCard
                        key={player.id}
                        player={player}
                        onSwipe={onSwipe}
                        userLocation={userLocation}
                        isTop={index === 0}
                    />
                )).reverse()}
            </AnimatePresence>
        </div>
    );
}
