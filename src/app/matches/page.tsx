'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockPlayers, mockCurrentUser } from '@/lib/mock-data';
import { Match } from '@/types';
import { getSkillLabel, getSkillColor, timeAgo } from '@/lib/utils';
import { MessageCircle, Send, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';

// Generate some mock matches
const generateMockMatches = (): Match[] => {
    return mockPlayers.slice(0, 4).map((player, index) => ({
        id: `match-${index}`,
        player1Id: mockCurrentUser.id,
        player2Id: player.id,
        player1: mockCurrentUser,
        player2: player,
        matchedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
        status: 'accepted' as const,
        lastMessage: index === 0
            ? "Hey! Want to play this weekend?"
            : index === 1
                ? "Great game yesterday! 🏸"
                : undefined,
    }));
};

export default function MatchesPage() {
    const [matches] = useState<Match[]>(generateMockMatches());
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<{ id: string; text: string; sender: 'me' | 'them'; time: string }[]>([
        { id: '1', text: 'Hey! I saw we matched. Want to play sometime?', sender: 'them', time: '2:30 PM' },
        { id: '2', text: 'Hi! Yes, I d love to! When are you free?', sender: 'me', time: '2:35 PM' },
        { id: '3', text: 'How about Saturday morning at Aston Sports Centre?', sender: 'them', time: '2:40 PM' },
        { id: '4', text: 'Perfect! 10am works for me 🏸', sender: 'me', time: '2:42 PM' },
    ]);

    const handleSendMessage = () => {
        if (!message.trim()) return;
        setMessages([...messages, {
            id: Date.now().toString(),
            text: message,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
        setMessage('');
    };

    // Chat view
    if (selectedMatch) {
        const otherPlayer = selectedMatch.player2;

        return (
            <div className="min-h-screen flex flex-col">
                {/* Chat header */}
                <header className="sticky top-0 z-30 bg-card border-b border-border">
                    <div className="max-w-lg mx-auto px-4 py-3">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedMatch(null)}
                            >
                                <ArrowLeft size={20} />
                            </Button>

                            <Avatar className="h-10 w-10">
                                <AvatarImage src={otherPlayer?.avatarUrl} />
                                <AvatarFallback>{otherPlayer?.name[0]}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <p className="font-semibold">{otherPlayer?.name}</p>
                                <p className="text-xs text-green-500">Online</p>
                            </div>

                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon">
                                    <Phone size={18} />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Video size={18} />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical size={18} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                    <div className="max-w-lg mx-auto">
                        {/* Match banner */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-4 py-2 rounded-full">
                                <span className="text-2xl">🏸</span>
                                <span className="text-sm text-green-500 font-medium">
                                    You matched with {otherPlayer?.name}!
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {timeAgo(selectedMatch.matchedAt)}
                            </p>
                        </div>

                        {/* Message bubbles */}
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] px-4 py-2 rounded-2xl ${msg.sender === 'me'
                                            ? 'bg-primary text-primary-foreground rounded-br-md'
                                            : 'bg-muted rounded-bl-md'
                                        }`}
                                >
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-[10px] mt-1 ${msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                        }`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Message input */}
                <div className="sticky bottom-0 bg-card border-t border-border p-4">
                    <div className="max-w-lg mx-auto flex gap-2">
                        <Input
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1"
                        />
                        <Button onClick={handleSendMessage} size="icon">
                            <Send size={18} />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Matches list view
    return (
        <div className="min-h-screen pb-20">
            <Header
                title="Matches"
                subtitle={`${matches.length} connections`}
            />

            <div className="max-w-lg mx-auto px-4 pt-4">
                {matches.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">💬</div>
                        <h3 className="text-xl font-semibold mb-2">No matches yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Start swiping to find your perfect badminton partner!
                        </p>
                        <Button asChild>
                            <a href="/discover">Discover Players</a>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* New matches carousel */}
                        <div>
                            <h2 className="text-sm font-medium text-muted-foreground mb-3">New Matches</h2>
                            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
                                {matches.filter(m => !m.lastMessage).map((match) => (
                                    <motion.button
                                        key={match.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-shrink-0 text-center"
                                        onClick={() => setSelectedMatch(match)}
                                    >
                                        <div className="relative">
                                            <Avatar className="h-16 w-16 border-2 border-green-500">
                                                <AvatarImage src={match.player2?.avatarUrl} />
                                                <AvatarFallback>{match.player2?.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                <span className="text-xs">✓</span>
                                            </div>
                                        </div>
                                        <p className="text-xs mt-2 font-medium truncate w-16">
                                            {match.player2?.name.split(' ')[0]}
                                        </p>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Messages */}
                        <div>
                            <h2 className="text-sm font-medium text-muted-foreground mb-3">Messages</h2>
                            <div className="space-y-2">
                                {matches.filter(m => m.lastMessage).map((match) => (
                                    <motion.div
                                        key={match.id}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <Card
                                            className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                                            onClick={() => setSelectedMatch(match)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-14 w-14">
                                                    <AvatarImage src={match.player2?.avatarUrl} />
                                                    <AvatarFallback>{match.player2?.name[0]}</AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-semibold">{match.player2?.name}</p>
                                                        <span className="text-xs text-muted-foreground">
                                                            {timeAgo(match.matchedAt)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-[10px] px-1.5"
                                                            style={{
                                                                backgroundColor: `${getSkillColor(match.player2?.skillLevel || 5)}20`,
                                                                color: getSkillColor(match.player2?.skillLevel || 5),
                                                            }}
                                                        >
                                                            {getSkillLabel(match.player2?.skillLevel || 5)}
                                                        </Badge>
                                                        <span className="text-sm text-muted-foreground truncate">
                                                            {match.lastMessage}
                                                        </span>
                                                    </div>
                                                </div>

                                                <MessageCircle size={20} className="text-muted-foreground" />
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
