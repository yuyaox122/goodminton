'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy,
    UserPlus,
    Calendar,
    Briefcase,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Check,
    Users,
    MapPin,
    DollarSign,
    Star,
    Clock
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { Header } from '@/components/Navigation';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { tournamentsAPI } from '@/lib/api/client';
import { TournamentJob } from '@/types';

type FlowType = 'join' | 'organize' | 'work' | null;

interface TournamentQuestion {
    id: string;
    question: string;
    type: 'single' | 'multiple' | 'input';
    options?: string[];
    placeholder?: string;
    condition?: { field: string; value: string };
}

// Join Tournament Questions
const joinQuestions: TournamentQuestion[] = [
    {
        id: 'gender',
        question: 'What is your gender?',
        type: 'single',
        options: ['Male', 'Female', 'Other'],
    },
    {
        id: 'ageGroup',
        question: 'What is your age group?',
        type: 'single',
        options: ['Under 15', 'Under 18', 'Under 21', 'Senior (21+)', 'Veterans (35+)', 'Masters (45+)'],
    },
    {
        id: 'discipline',
        question: 'Which discipline are you willing to play?',
        type: 'multiple',
        options: ['Men\'s Singles', 'Women\'s Singles', 'Men\'s Doubles', 'Women\'s Doubles', 'Mixed Doubles'],
    },
    {
        id: 'abilityLevel',
        question: 'What is your ability level?',
        type: 'single',
        options: ['Beginner', 'Intermediate', 'Advanced', 'Semi-Professional', 'Professional'],
    },
    {
        id: 'competitiveness',
        question: 'What level of competitiveness are you looking for?',
        type: 'single',
        options: ['Casual/Fun', 'Moderately Competitive', 'Highly Competitive', 'Elite/Professional'],
    },
];

// Organize Tournament Questions
const organizeQuestions: TournamentQuestion[] = [
    {
        id: 'name',
        question: 'What is the name of your tournament?',
        type: 'input',
        placeholder: 'e.g. Birmingham Spring Open 2026',
    },
    {
        id: 'date',
        question: 'When will the tournament take place?',
        type: 'input',
        placeholder: 'e.g. 2026-03-15',
    },
    {
        id: 'format',
        question: 'What format will the tournament be?',
        type: 'single',
        options: ['Singles', 'Doubles', 'Mixed'],
    },
    {
        id: 'scale',
        question: 'What scale is the tournament going to be?',
        type: 'single',
        options: ['Open Entries (Local)', 'County Level', 'Nationals', 'International'],
    },
    {
        id: 'participants',
        question: 'Roughly how many participants are you expecting?',
        type: 'single',
        options: ['16-32 players', '32-64 players', '64-128 players', '128-256 players', '256+ players'],
    },
    {
        id: 'complexity',
        question: 'What is the level of complexity?',
        type: 'single',
        options: ['Simple (Single elimination)', 'Standard (Group + Knockout)', 'Complex (Multiple disciplines)', 'Professional (Full tournament system)'],
    },
    {
        id: 'location',
        question: 'Where will the tournament be held?',
        type: 'input',
        placeholder: 'Enter venue name and location...',
    },
    {
        id: 'hiring',
        question: 'Will you be hiring personnel?',
        type: 'single',
        options: ['Yes', 'No'],
    },
    {
        id: 'wage',
        question: 'What wage will you offer per hour?',
        type: 'single',
        options: ['£10/hour', '£12/hour', '£15/hour', '£18/hour', '£20+/hour'],
        condition: { field: 'hiring', value: 'Yes' },
    },
    {
        id: 'slots',
        question: 'How many staff positions are available?',
        type: 'single',
        options: ['1-5 positions', '5-10 positions', '10-20 positions', '20+ positions'],
        condition: { field: 'hiring', value: 'Yes' },
    },
];

// Work at Tournament - Month Selection
const workMonths = ['February 2026', 'March 2026', 'April 2026', 'May 2026', 'June 2026', 'July 2026'];

function TournamentOrganiseContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useUser();
    const userName = user?.name?.split(' ')[0] || 'Player';

    const [selectedFlow, setSelectedFlow] = useState<FlowType>(
        (searchParams.get('action') as FlowType) || null
    );
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [jobs, setJobs] = useState<TournamentJob[]>([]);

    useEffect(() => {
        tournamentsAPI.getJobs()
            .then(data => setJobs(data))
            .catch(err => console.error('Failed to fetch jobs:', err));
    }, []);

    const currentQuestions = selectedFlow === 'join' ? joinQuestions : organizeQuestions;

    const getVisibleQuestions = () => {
        return currentQuestions.filter(q => {
            if (!q.condition) return true;
            return answers[q.condition.field] === q.condition.value;
        });
    };

    const visibleQuestions = getVisibleQuestions();
    const currentQuestion = visibleQuestions[currentStep];
    const progress = selectedFlow ? ((currentStep + 1) / visibleQuestions.length) * 100 : 0;

    const handleOptionSelect = (value: string) => {
        if (currentQuestion.type === 'multiple') {
            const current = (answers[currentQuestion.id] as string[]) || [];
            const updated = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            setAnswers(prev => ({ ...prev, [currentQuestion.id]: updated }));
        } else {
            setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
        }
    };

    const handleInputChange = (value: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    };

    const canProceed = () => {
        const answer = answers[currentQuestion?.id];
        if (!currentQuestion) return false;
        if (currentQuestion.type === 'multiple') {
            return Array.isArray(answer) && answer.length > 0;
        }
        if (currentQuestion.type === 'input') {
            return typeof answer === 'string' && answer.trim().length > 0;
        }
        return !!answer;
    };

    const parseMaxPlayers = (participants: string): number => {
        const map: Record<string, number> = {
            '16-32 players': 32,
            '32-64 players': 64,
            '64-128 players': 128,
            '128-256 players': 256,
            '256+ players': 512,
        };
        return map[participants] || 32;
    };

    const handleNext = async () => {
        if (currentStep < visibleQuestions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Complete flow
            if (selectedFlow === 'join') {
                router.push('/tournaments');
            } else if (selectedFlow === 'organize') {
                setIsSubmitting(true);
                try {
                    const locationText = (answers.location as string) || '';
                    await tournamentsAPI.create({
                        name: answers.name as string,
                        date: new Date(answers.date as string).toISOString(),
                        format: ((answers.format as string) || 'singles').toLowerCase(),
                        locationVenue: locationText,
                        locationAddress: locationText,
                        maxPlayers: parseMaxPlayers(answers.participants as string),
                        scale: answers.scale as string,
                        hiringPersonnel: answers.hiring === 'Yes',
                        status: 'pending',
                    });
                    router.push('/tournaments');
                } catch (error) {
                    console.error('Failed to create tournament:', error);
                    alert('Failed to create tournament. Please make sure you are logged in.');
                } finally {
                    setIsSubmitting(false);
                }
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            setSelectedFlow(null);
            setAnswers({});
        }
    };

    const resetFlow = () => {
        setSelectedFlow(null);
        setCurrentStep(0);
        setAnswers({});
        setSelectedMonth(null);
    };

    // Main Selection Screen
    if (!selectedFlow) {
        return (
            <div className="min-h-screen bg-slate-900">
                <Header
                    title="Tournaments"
                    subtitle="Join, organize, or work at tournaments"
                />

                <div className="container mx-auto px-4 py-8">
                    {/* Main Question */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg">
                            <Trophy className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Willing to find competition,{' '}
                            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                                {userName}
                            </span>
                            ?
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Choose how you&apos;d like to be involved in tournaments
                        </p>
                    </motion.div>

                    {/* Options */}
                    <div className="max-w-2xl mx-auto space-y-4">
                        {[
                            {
                                key: 'join',
                                icon: UserPlus,
                                title: "I'm hoping to join a tournament",
                                description: 'Register as a participant and compete',
                                gradient: 'from-sky-400 to-blue-500',
                            },
                            {
                                key: 'organize',
                                icon: Calendar,
                                title: "I'm hoping to organise a tournament",
                                description: 'Host and manage your own event',
                                gradient: 'from-cyan-400 to-sky-500',
                            },
                            {
                                key: 'work',
                                icon: Briefcase,
                                title: "I'm hoping to work for a tournament",
                                description: 'Find paid positions at events',
                                gradient: 'from-blue-400 to-indigo-500',
                            },
                        ].map((option, index) => (
                            <motion.button
                                key={option.key}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setSelectedFlow(option.key as FlowType)}
                                className="w-full flex items-center gap-4 p-6 bg-slate-800 rounded-2xl border-2 border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <option.icon className="w-7 h-7 text-white" />
                                </div>
                                <div className="text-left flex-1">
                                    <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
                                        {option.title}
                                    </h3>
                                    <p className="text-slate-400">{option.description}</p>
                                </div>
                                <ArrowRight className="w-6 h-6 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Work Flow - Show available jobs
    if (selectedFlow === 'work') {
        return (
            <div className="min-h-screen bg-slate-900">
                <Header
                    title="Find Tournament Jobs"
                    subtitle="Get paid while being part of the action"
                />

                <div className="container mx-auto px-4 py-6 max-w-4xl">
                    {/* Month Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-800 rounded-3xl shadow-lg p-6 mb-6 border border-white/10"
                    >
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-sky-500" />
                            When are you available to work?
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {workMonths.map(month => (
                                <button
                                    key={month}
                                    onClick={() => setSelectedMonth(prev => prev === month ? null : month)}
                                    className={`px-4 py-2 rounded-xl font-medium transition-all ${selectedMonth === month
                                            ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg'
                                            : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                                        }`}
                                >
                                    {month}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Available Jobs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Briefcase className="w-6 h-6 text-sky-500" />
                            Available Positions
                            {selectedMonth && <span className="text-sky-400 font-normal">in {selectedMonth}</span>}
                        </h2>

                        <div className="space-y-4">
                            {jobs
                                .filter(job => {
                                    if (!selectedMonth) return true;
                                    // Filter by job dates (e.g. "March 15, 2026")
                                    return job.dates?.some(d => d.includes(selectedMonth.split(' ')[0]) && d.includes(selectedMonth.split(' ')[1]));
                                })
                                .map((job, index) => (
                                        <motion.div
                                            key={job.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-slate-800 rounded-2xl shadow-lg p-6 border border-white/10 hover:border-white/20 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-white mb-1">{job.role}</h3>
                                                    <p className="text-sky-400 font-medium mb-2">{job.tournamentName}</p>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            {job.location || 'TBD'}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {job.dates?.[0] || 'TBD'}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {job.dates?.[0] || 'Full day'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-300 mt-2">{job.description}</p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-green-400">£{job.wage}/hr</p>
                                                        <p className="text-sm text-slate-400">
                                                            <Users className="w-3 h-3 inline mr-1" />
                                                            {job.slots - job.filled} spots left
                                                        </p>
                                                    </div>
                                                    <Link
                                                        href={`/tournaments/work/apply/${job.id}`}
                                                        className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all"
                                                    >
                                                        Apply
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                        </div>
                    </motion.div>

                    {/* Back Button */}
                    <button
                        onClick={resetFlow}
                        className="mt-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to options
                    </button>
                </div>
            </div>
        );
    }

    // Join / Organize Flow - Question by Question
    return (
        <div className="min-h-screen bg-slate-900">
            {/* Progress Bar */}
            <div className="fixed top-16 left-0 right-0 h-1 bg-slate-700 z-40">
                <motion.div
                    className="h-full bg-gradient-to-r from-sky-400 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Step Counter */}
                <div className="text-center mb-4">
                    <span className="text-sm text-sky-400 font-medium">
                        Step {currentStep + 1} of {visibleQuestions.length}
                    </span>
                </div>

                {/* Question Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-2xl mx-auto"
                    >
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white shadow-lg">
                                {selectedFlow === 'join' ? (
                                    <UserPlus className="w-8 h-8" />
                                ) : (
                                    <Calendar className="w-8 h-8" />
                                )}
                            </div>
                        </div>

                        {/* Question */}
                        <h1 className="text-2xl md:text-4xl font-bold text-center text-white mb-8">
                            {currentQuestion?.question}
                        </h1>

                        {/* Options */}
                        {currentQuestion?.type === 'input' ? (
                            <input
                                type="text"
                                placeholder={currentQuestion.placeholder}
                                value={(answers[currentQuestion.id] as string) || ''}
                                onChange={(e) => handleInputChange(e.target.value)}
                                className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-white/20 bg-slate-800 text-white placeholder-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-500/20 outline-none transition-all"
                            />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {currentQuestion?.options?.map((option) => {
                                    const isSelected = currentQuestion.type === 'multiple'
                                        ? ((answers[currentQuestion.id] as string[]) || []).includes(option)
                                        : answers[currentQuestion.id] === option;

                                    return (
                                        <button
                                            key={option}
                                            onClick={() => handleOptionSelect(option)}
                                            className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 ${isSelected
                                                    ? 'border-sky-400 bg-sky-500/20 shadow-lg shadow-sky-500/10'
                                                    : 'border-white/10 bg-slate-800 hover:border-white/20 hover:bg-slate-700'
                                                }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                                    ? 'border-sky-500 bg-sky-500'
                                                    : 'border-slate-500'
                                                }`}>
                                                {isSelected && <Check className="w-4 h-4 text-white" />}
                                            </div>
                                            <span className={`font-medium ${isSelected ? 'text-sky-300' : 'text-slate-300'}`}>
                                                {option}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="fixed bottom-0 left-0 right-0 bg-slate-800/80 backdrop-blur-xl border-t border-white/10 p-4 md:relative md:bg-transparent md:border-none md:mt-12">
                    <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-6 py-3 text-slate-400 font-medium rounded-xl hover:bg-white/10 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={!canProceed() || isSubmitting}
                            className={`flex items-center gap-2 px-8 py-3 font-semibold rounded-xl transition-all ${canProceed() && !isSubmitting
                                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
                                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            {isSubmitting
                                ? 'Creating...'
                                : currentStep === visibleQuestions.length - 1
                                    ? (selectedFlow === 'join' ? 'Find Tournaments' : 'Create Tournament')
                                    : 'Continue'
                            }
                            {!isSubmitting && <ChevronRight className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TournamentOrganisePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-pulse text-sky-500">Loading...</div>
            </div>
        }>
            <TournamentOrganiseContent />
        </Suspense>
    );
}
