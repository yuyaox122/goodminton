'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@/types';
import { Button } from '@/components/ui/button';
import { X, MessageCircle, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    matchedPlayer: Player | null;
    currentUser: Player | null;
}

export function MatchModal({ isOpen, onClose, matchedPlayer, currentUser }: MatchModalProps) {
    React.useEffect(() => {
        if (isOpen) {
            // Trigger confetti
            const duration = 2000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#22c55e', '#3b82f6', '#a855f7'],
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#22c55e', '#3b82f6', '#a855f7'],
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        }
    }, [isOpen]);

    if (!matchedPlayer || !currentUser) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal content */}
                    <motion.div
                        className="relative z-10 max-w-md w-full mx-4"
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 50 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute -top-12 right-0 text-white/70 hover:text-white"
                        >
                            <X size={32} />
                        </button>

                        {/* Match card */}
                        <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-3xl p-1">
                            <div className="bg-card rounded-3xl p-6 text-center">
                                {/* Header */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                >
                                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                                        <Heart size={40} className="text-white" fill="white" />
                                    </div>
                                </motion.div>

                                <motion.h2
                                    className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    It's a Match!
                                </motion.h2>

                                <motion.p
                                    className="text-muted-foreground mb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    You and {matchedPlayer.name} both want to play together! 🏸
                                </motion.p>

                                {/* Avatars */}
                                <motion.div
                                    className="flex justify-center items-center gap-4 mb-6"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <div className="relative">
                                        <img
                                            src={currentUser.avatarUrl}
                                            alt={currentUser.name}
                                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                    </div>

                                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                                        🏸
                                    </div>

                                    <div className="relative">
                                        <img
                                            src={matchedPlayer.avatarUrl}
                                            alt={matchedPlayer.name}
                                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                    </div>
                                </motion.div>

                                {/* Match info */}
                                <motion.div
                                    className="bg-muted/50 rounded-xl p-4 mb-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <p className="text-sm text-muted-foreground mb-2">
                                        <span className="font-medium text-foreground">{matchedPlayer.name}</span> is a{' '}
                                        <span className="font-medium text-foreground">
                                            {matchedPlayer.playStyle === 'both' ? 'Singles & Doubles' : matchedPlayer.playStyle}
                                        </span>{' '}
                                        player
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Available on{' '}
                                        <span className="font-medium text-foreground">
                                            {matchedPlayer.stats.preferredDays.join(', ')}
                                        </span>
                                    </p>
                                </motion.div>

                                {/* Actions */}
                                <motion.div
                                    className="flex gap-3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <Button variant="outline" className="flex-1" onClick={onClose}>
                                        Keep Swiping
                                    </Button>
                                    <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                                        <MessageCircle size={18} className="mr-2" />
                                        Send Message
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
