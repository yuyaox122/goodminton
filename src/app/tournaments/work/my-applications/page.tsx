'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Briefcase, 
    ArrowLeft,
    Search,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    Calendar,
    MapPin,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/Navigation';
import { mockMyApplications, mockOrganisedTournaments, mockTournamentJobs } from '@/lib/mock-data';

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
    under_review: { label: 'Under Review', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Eye },
    accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

export default function MyApplicationsPage() {
    const [filter, setFilter] = useState<'all' | 'pending' | 'under_review' | 'accepted' | 'rejected'>('all');
    
    // Enrich applications with tournament details
    const enrichedApplications = mockMyApplications.map(app => {
        const job = mockTournamentJobs.find(j => j.id === app.jobId);
        const tournament = job ? mockOrganisedTournaments.find(t => t.id === job.tournamentId) : null;
        return { ...app, job, tournament };
    });

    const filteredApplications = enrichedApplications.filter(app => {
        return filter === 'all' || app.status === filter;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            <Header 
                title="My Applications" 
                subtitle="Track your tournament job applications"
            />

            <div className="container mx-auto px-4 py-6">
                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
                    {(['all', 'pending', 'under_review', 'accepted', 'rejected'] as const).map(status => {
                        const count = status === 'all' 
                            ? enrichedApplications.length 
                            : enrichedApplications.filter(a => a.status === status).length;
                        return (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                                    filter === status
                                        ? 'bg-sky-500 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                {status === 'all' ? 'All' : status === 'under_review' ? 'Under Review' : status.charAt(0).toUpperCase() + status.slice(1)}
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                    filter === status ? 'bg-white/20' : 'bg-gray-100'
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Applications List */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredApplications.map((application, index) => {
                            const StatusIcon = statusConfig[application.status].icon;
                            return (
                                <motion.div
                                    key={application.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:border-sky-200 hover:shadow-xl transition-all"
                                >
                                    <div className="p-5">
                                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                                            {/* Job Info */}
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg">
                                                    <Briefcase className="w-7 h-7 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-lg font-bold text-gray-800">
                                                            {application.job?.role || application.position || 'Unknown Position'}
                                                        </h3>
                                                    </div>
                                                    <p className="text-sky-600 font-medium">{application.tournament?.name}</p>
                                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                                                        {application.tournament && (
                                                            <>
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-4 h-4" />
                                                                    {application.tournament.date}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin className="w-4 h-4" />
                                                                    {application.tournament.location.venue}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status & Actions */}
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border ${statusConfig[application.status].color}`}>
                                                        <StatusIcon className="w-4 h-4" />
                                                        {statusConfig[application.status].label}
                                                    </span>
                                                    <p className="text-xs text-gray-400 mt-1">Applied {application.appliedAt}</p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-300" />
                                            </div>
                                        </div>

                                        {/* Status Message */}
                                        {application.status === 'accepted' && (
                                            <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100">
                                                <p className="text-sm text-green-700">
                                                    🎉 Congratulations! Your application has been accepted. Check your email for next steps.
                                                </p>
                                            </div>
                                        )}
                                        {application.status === 'rejected' && (
                                            <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
                                                <p className="text-sm text-red-700">
                                                    Unfortunately, your application was not selected this time. Don&apos;t give up - more opportunities await!
                                                </p>
                                            </div>
                                        )}
                                        {application.status === 'under_review' && (
                                            <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                                <p className="text-sm text-blue-700">
                                                    Your application is currently being reviewed by the organizers.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Quick Details Footer */}
                                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            {application.job && (
                                                <span className="text-green-600 font-medium">£{application.job.wage}/hr</span>
                                            )}
                                        </div>
                                        <Link
                                            href="/tournaments"
                                            className="text-sm text-sky-600 font-medium hover:text-sky-700"
                                        >
                                            View Tournament
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {filteredApplications.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <Briefcase className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {filter === 'all' ? 'No Applications Yet' : `No ${filter} Applications`}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {filter === 'all' 
                                ? 'Start applying for tournament jobs to see them here'
                                : 'Try a different filter to see your applications'
                            }
                        </p>
                        <Link
                            href="/tournaments"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors"
                        >
                            <Briefcase className="w-5 h-5" />
                            Browse Jobs
                        </Link>
                    </div>
                )}

                {/* Stats Summary */}
                {enrichedApplications.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    >
                        <h3 className="font-bold text-gray-800 mb-4">Application Stats</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-gray-50 rounded-xl">
                                <p className="text-2xl font-bold text-gray-800">{enrichedApplications.length}</p>
                                <p className="text-sm text-gray-500">Total</p>
                            </div>
                            <div className="text-center p-3 bg-yellow-50 rounded-xl">
                                <p className="text-2xl font-bold text-yellow-600">
                                    {enrichedApplications.filter(a => a.status === 'pending' || a.status === 'under_review').length}
                                </p>
                                <p className="text-sm text-gray-500">In Progress</p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-xl">
                                <p className="text-2xl font-bold text-green-600">
                                    {enrichedApplications.filter(a => a.status === 'accepted').length}
                                </p>
                                <p className="text-sm text-gray-500">Accepted</p>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded-xl">
                                <p className="text-2xl font-bold text-red-600">
                                    {enrichedApplications.filter(a => a.status === 'rejected').length}
                                </p>
                                <p className="text-sm text-gray-500">Rejected</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
