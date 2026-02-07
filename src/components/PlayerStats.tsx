'use client';

import React from 'react';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
} from 'recharts';
import { Player } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, Calendar, Star, TrendingUp } from 'lucide-react';

interface PlayerStatsProps {
    player: Player;
    showRadar?: boolean;
}

export function PlayerStats({ player, showRadar = true }: PlayerStatsProps) {
    // Transform stats for radar chart
    const radarData = [
        { subject: 'Win Rate', value: player.stats.winRate, fullMark: 100 },
        { subject: 'Experience', value: Math.min(player.stats.totalMatches, 100), fullMark: 100 },
        { subject: 'Skill', value: player.skillLevel * 10, fullMark: 100 },
        { subject: 'Consistency', value: player.stats.averageRating * 20, fullMark: 100 },
        { subject: 'Activity', value: player.stats.preferredDays.length * 14, fullMark: 100 },
    ];

    return (
        <div className="space-y-4">
            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-3">
                <StatCard
                    icon={<Trophy className="text-yellow-500" size={18} />}
                    label="Wins"
                    value={player.stats.wins.toString()}
                />
                <StatCard
                    icon={<Target className="text-red-500" size={18} />}
                    label="Win Rate"
                    value={`${player.stats.winRate}%`}
                />
                <StatCard
                    icon={<TrendingUp className="text-green-500" size={18} />}
                    label="Total Matches"
                    value={player.stats.totalMatches.toString()}
                />
                <StatCard
                    icon={<Star className="text-purple-500" size={18} />}
                    label="Rating"
                    value={player.stats.averageRating.toFixed(1)}
                />
            </div>

            {/* Radar chart */}
            {showRadar && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Performance Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={radarData}>
                                    <PolarGrid stroke="#374151" />
                                    <PolarAngleAxis
                                        dataKey="subject"
                                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                                    />
                                    <PolarRadiusAxis
                                        angle={30}
                                        domain={[0, 100]}
                                        tick={{ fill: '#6b7280', fontSize: 8 }}
                                    />
                                    <Radar
                                        name="Stats"
                                        dataKey="value"
                                        stroke="#22c55e"
                                        fill="#22c55e"
                                        fillOpacity={0.3}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Availability */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Calendar size={16} />
                        Available Days
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                            const fullDay = {
                                Mon: 'Monday',
                                Tue: 'Tuesday',
                                Wed: 'Wednesday',
                                Thu: 'Thursday',
                                Fri: 'Friday',
                                Sat: 'Saturday',
                                Sun: 'Sunday',
                            }[day];
                            const isAvailable = player.stats.preferredDays.includes(fullDay!);

                            return (
                                <Badge
                                    key={day}
                                    variant={isAvailable ? 'default' : 'outline'}
                                    className={isAvailable ? 'bg-green-500 hover:bg-green-600' : 'opacity-50'}
                                >
                                    {day}
                                </Badge>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Stat card component
function StatCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <Card>
            <CardContent className="p-3">
                <div className="flex items-center gap-2">
                    {icon}
                    <div>
                        <p className="text-lg font-bold">{value}</p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Match percentage component
export function MatchPercentage({ percentage }: { percentage: number }) {
    const getColor = (p: number) => {
        if (p >= 80) return 'text-green-500';
        if (p >= 60) return 'text-yellow-500';
        return 'text-orange-500';
    };

    return (
        <div className="flex items-center gap-1">
            <span className={`text-lg font-bold ${getColor(percentage)}`}>{percentage}%</span>
            <span className="text-xs text-muted-foreground">match</span>
        </div>
    );
}
