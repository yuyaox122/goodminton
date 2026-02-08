'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Trophy,
    Users,
    Briefcase,
    Calendar,
    Eye,
    Edit,
    Plus,
    ArrowRight,
    Clock
} from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/Navigation';
import { tournamentsAPI } from '@/lib/api/client';
import { OrganisedTournament } from '@/types';

const statusColors: Record<string, string> = {
    draft: 'bg-slate-700 text-slate-300',
    pending: 'bg-yellow-500/20 text-yellow-400',
    active: 'bg-green-500/20 text-green-400',
    completed: 'bg-blue-500/20 text-blue-400',
    cancelled: 'bg-red-500/20 text-red-400',
};

export default function MyTournamentsPage() {
    const [tournaments, setTournaments] = useState<OrganisedTournament[]>([]);

    useEffect(() => {
        tournamentsAPI.getOrganised()
            .then(data => setTournaments(data))
            .catch(err => console.error('Failed to fetch organised tournaments:', err));
    }, []);

    return (
        <div className="min-h-screen bg-slate-900">
            <Header
                title="My Tournaments"
                subtitle="Manage your organised tournaments"
            />

            <div className="container mx-auto px-4 py-6">
                {/* Create New Button */}
                <div className="mb-6">
                    <Link
                        href="/tournaments/organise"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl shadow-lg hover:bg-slate-100 hover:shadow-xl transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Tournament
                    </Link>
                </div>

                {/* Tournaments List */}
                <div className="space-y-4">
                    {tournaments.map((tournament, index) => (
                        <motion.div
                            key={tournament.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-800 rounded-2xl shadow-lg p-6 border border-white/10 hover:border-white/20 hover:shadow-xl transition-all"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                {/* Main Info */}
                                <div className="flex-1">
                                    <div className="flex items-start gap-3 mb-2">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg">
                                            <Trophy className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{tournament.name}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[tournament.status]}`}>
                                                    {tournament.status}
                                                </span>
                                                <span className="text-sm text-slate-400 flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {tournament.date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-sm ml-15 pl-0.5">{tournament.location.venue}</p>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-wrap gap-4">
                                    {/* Athletes */}
                                    <div className="bg-sky-500/20 rounded-xl px-4 py-3 text-center min-w-[100px]">
                                        <div className="flex items-center justify-center gap-1 text-sky-400 mb-1">
                                            <Users className="w-4 h-4" />
                                            <span className="font-bold">{tournament.athletesRegistered}/{tournament.maxAthletes}</span>
                                        </div>
                                        <p className="text-xs text-slate-400">Athletes</p>
                                    </div>

                                    {/* Staff Applications */}
                                    {tournament.hiringPersonnel && (
                                        <div className="bg-orange-500/20 rounded-xl px-4 py-3 text-center min-w-[100px]">
                                            <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
                                                <Briefcase className="w-4 h-4" />
                                                <span className="font-bold">{tournament.applicationsCount}</span>
                                            </div>
                                            <p className="text-xs text-slate-400">Applications</p>
                                        </div>
                                    )}

                                    {/* Positions */}
                                    {tournament.positions.length > 0 && (
                                        <div className="bg-green-500/20 rounded-xl px-4 py-3 text-center min-w-[100px]">
                                            <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                                                <span className="font-bold">
                                                    {tournament.positions.reduce((acc, p) => acc + p.filled, 0)}/
                                                    {tournament.positions.reduce((acc, p) => acc + p.slots, 0)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400">Staff Filled</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/tournaments/manage/${tournament.id}`}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Manage
                                    </Link>
                                    <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Positions Breakdown */}
                            {tournament.positions.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <p className="text-sm text-slate-400 mb-2">Staff Positions:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {tournament.positions.map((pos, i) => (
                                            <span key={i} className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-sm">
                                                {pos.role}: {pos.filled}/{pos.slots} (£{pos.wage}/hr)
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {tournaments.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
                            <Trophy className="w-10 h-10 text-sky-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Tournaments Yet</h3>
                        <p className="text-slate-400 mb-6">Start organising your first tournament!</p>
                        <Link
                            href="/tournaments/organise"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Create Tournament
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
