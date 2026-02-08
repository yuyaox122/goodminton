'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, 
    Clock, 
    MapPin, 
    Users, 
    Check,
    ChevronLeft,
    ChevronRight,
    Plus,
    Minus,
    DollarSign,
    ArrowRight,
    Star,
    Sparkles
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Navigation';
import { useUser } from '@/context/UserContext';
import { useBooking } from '@/context/BookingContext';
import { mockPlayers } from '@/lib/mock-data';

const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00'
];

const venues = [
    { id: '1', name: 'Aston University Sports Centre', pricePerHour: 12 },
    { id: '2', name: 'Birmingham Sports Hub', pricePerHour: 15 },
    { id: '3', name: 'Nechells Community Centre', pricePerHour: 8 },
    { id: '4', name: 'Perry Barr Leisure Centre', pricePerHour: 10 },
];

// Wrapper component with Suspense for useSearchParams
export default function SchedulingPage() {
    return (
        <Suspense fallback={<SchedulingLoadingState />}>
            <SchedulingPageContent />
        </Suspense>
    );
}

function SchedulingLoadingState() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            <Header title="Schedule a Game" subtitle="Loading..." />
            <div className="container mx-auto px-4 py-6 max-w-2xl">
                <div className="animate-pulse space-y-4">
                    <div className="h-32 bg-gray-200 rounded-3xl"></div>
                    <div className="h-64 bg-gray-200 rounded-3xl"></div>
                    <div className="h-48 bg-gray-200 rounded-3xl"></div>
                </div>
            </div>
        </div>
    );
}

function SchedulingPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useUser();
    const { createSessionFromSchedule } = useBooking();
    
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
    const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
    const [duration, setDuration] = useState<number>(1);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isScheduling, setIsScheduling] = useState(false);
    
    // Get partner info from URL params (from match modal or chat)
    const urlPartnerId = searchParams.get('partnerId');
    const urlPartnerName = searchParams.get('partnerName');

    // Build connected partners list - ensure URL partner is always included
    const connectedPartners = useMemo(() => {
        const baseConnections = mockPlayers.slice(0, 5);
        
        if (urlPartnerId) {
            // First, try to find the player in mockPlayers by ID
            let matchedPlayer = mockPlayers.find(p => p.id === urlPartnerId);
            
            // If not found by ID and we have a name, try to find by name
            if (!matchedPlayer && urlPartnerName) {
                matchedPlayer = mockPlayers.find(p => 
                    p.name.toLowerCase() === decodeURIComponent(urlPartnerName).toLowerCase()
                );
            }
            
            // If still not found but we have the name, create a temporary player object
            if (!matchedPlayer && urlPartnerName) {
                matchedPlayer = {
                    id: urlPartnerId,
                    name: decodeURIComponent(urlPartnerName),
                    email: '',
                    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${urlPartnerId}`,
                    bio: '',
                    skillLevel: 5,
                    playStyle: 'both' as const,
                    location: { lat: 52.4862, lng: -1.8904, city: 'Birmingham' },
                    stats: {
                        wins: 0,
                        losses: 0,
                        totalMatches: 0,
                        winRate: 0,
                        preferredDays: [],
                        averageRating: 0,
                    },
                    lookingFor: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
            }
            
            if (matchedPlayer) {
                // Remove from base if exists, then add at front
                const filtered = baseConnections.filter(c => c.id !== matchedPlayer!.id);
                return [matchedPlayer, ...filtered];
            }
        }
        
        return baseConnections;
    }, [urlPartnerId, urlPartnerName]);

    // Auto-select the URL partner when component mounts or URL changes
    useEffect(() => {
        if (urlPartnerId && !selectedPartners.includes(urlPartnerId)) {
            setSelectedPartners([urlPartnerId]);
        }
    }, [urlPartnerId]); // Only run when urlPartnerId changes
    
    const selectedVenue = useMemo(() => 
        venues.find(v => v.id === selectedVenueId),
        [selectedVenueId]
    );

    const totalCost = useMemo(() => 
        selectedVenue ? selectedVenue.pricePerHour * duration : 0,
        [selectedVenue, duration]
    );

    const totalParticipants = selectedPartners.length + 1;
    const costPerPerson = totalCost / totalParticipants;

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days: Date[] = [];
        
        const startPadding = firstDay.getDay();
        for (let i = startPadding - 1; i >= 0; i--) {
            days.push(new Date(year, month, -i));
        }
        
        for (let d = 1; d <= lastDay.getDate(); d++) {
            days.push(new Date(year, month, d));
        }
        
        return days;
    };

    const togglePartner = (id: string) => {
        setSelectedPartners(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-GB', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
        });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date: Date) => {
        return date.toDateString() === selectedDate.toDateString();
    };

    const isPast = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const canSchedule = selectedDate && selectedTime && selectedVenueId && selectedPartners.length > 0;

    const handleCreateSchedule = () => {
        if (!canSchedule || !selectedVenue) return;
        
        setIsScheduling(true);
        
        const participantDetails = selectedPartners.map(id => {
            const player = connectedPartners.find(p => p.id === id);
            return {
                id,
                name: player?.name || 'Unknown',
                avatarUrl: player?.avatarUrl || '',
            };
        });

        createSessionFromSchedule({
            date: selectedDate,
            time: selectedTime!,
            duration,
            venue: {
                id: selectedVenue.id,
                name: selectedVenue.name,
                pricePerHour: selectedVenue.pricePerHour,
            },
            participantDetails,
        });

        setTimeout(() => {
            router.push('/partners/fare-splitting');
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            <Header 
                title="Schedule a Game" 
                subtitle="Plan your next badminton session"
            />

            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Calendar Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-sky-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-sky-500" />
                            Select Date
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                className="p-2 rounded-xl hover:bg-sky-50 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <span className="font-semibold text-gray-800 min-w-[140px] text-center">
                                {currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                            </span>
                            <button
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                className="p-2 rounded-xl hover:bg-sky-50 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(currentMonth).map((date, index) => {
                            const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                            return (
                                <button
                                    key={index}
                                    onClick={() => !isPast(date) && setSelectedDate(date)}
                                    disabled={isPast(date)}
                                    className={`p-3 rounded-xl text-sm font-medium transition-all ${
                                        !isCurrentMonth
                                            ? 'text-gray-300'
                                            : isPast(date)
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : isSelected(date)
                                            ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-200'
                                            : isToday(date)
                                            ? 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {date.getDate()}
                                </button>
                            );
                        })}
                    </div>

                    <p className="mt-4 text-center text-sky-600 font-medium">
                        Selected: {formatDate(selectedDate)}
                    </p>
                </motion.div>

                {/* Time Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-sky-100"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-sky-500" />
                        Select Time
                    </h2>

                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                        {timeSlots.map(time => (
                            <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`p-3 rounded-xl text-sm font-medium transition-all ${
                                    selectedTime === time
                                        ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-200'
                                        : 'bg-gray-50 text-gray-700 hover:bg-sky-50 hover:text-sky-700'
                                }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Duration Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-sky-100"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-sky-500" />
                        Duration
                    </h2>

                    <div className="flex items-center justify-center gap-6">
                        <button
                            onClick={() => setDuration(Math.max(0.5, duration - 0.5))}
                            className="p-4 rounded-2xl bg-sky-100 text-sky-600 hover:bg-sky-200 transition-colors"
                        >
                            <Minus className="w-6 h-6" />
                        </button>
                        <div className="text-center">
                            <span className="text-4xl font-bold text-gray-800">{duration}</span>
                            <span className="text-lg text-gray-500 ml-2">hour{duration !== 1 ? 's' : ''}</span>
                        </div>
                        <button
                            onClick={() => setDuration(duration + 0.5)}
                            className="p-4 rounded-2xl bg-sky-100 text-sky-600 hover:bg-sky-200 transition-colors"
                        >
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>
                </motion.div>

                {/* Venue Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-sky-100"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-sky-500" />
                        Select Venue
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {venues.map(venue => (
                            <button
                                key={venue.id}
                                onClick={() => setSelectedVenueId(venue.id)}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                    selectedVenueId === venue.id
                                        ? 'border-sky-400 bg-sky-50'
                                        : 'border-gray-200 hover:border-sky-200 hover:bg-sky-50/50'
                                }`}
                            >
                                <span className={`font-medium ${selectedVenueId === venue.id ? 'text-sky-700' : 'text-gray-700'}`}>
                                    {venue.name}
                                </span>
                                <span className="text-sm font-bold text-green-600">£{venue.pricePerHour}/hr</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Partner Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-sky-100"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Users className="w-6 h-6 text-sky-500" />
                        Invite Partners ({selectedPartners.length} selected)
                    </h2>

                    {/* Show pre-selected partner banner if coming from match/chat */}
                    {urlPartnerId && (
                        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                            <p className="text-sm text-green-700 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                <span>
                                    <strong>{connectedPartners.find(p => p.id === urlPartnerId)?.name || urlPartnerName || 'Your match'}</strong> has been pre-selected from your match! 🎉
                                </span>
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {connectedPartners.map(partner => {
                            const isPreSelected = partner.id === urlPartnerId;
                            const isSelected = selectedPartners.includes(partner.id);
                            
                            return (
                                <button
                                    key={partner.id}
                                    onClick={() => togglePartner(partner.id)}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all relative ${
                                        isSelected
                                            ? isPreSelected 
                                                ? 'border-green-400 bg-green-50' 
                                                : 'border-sky-400 bg-sky-50'
                                            : 'border-gray-200 hover:border-sky-200 hover:bg-sky-50/50'
                                    }`}
                                >
                                    {isPreSelected && (
                                        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full">
                                            From Match
                                        </div>
                                    )}
                                    <div className="relative">
                                        <div className={`w-12 h-12 rounded-full overflow-hidden ${isPreSelected ? 'ring-2 ring-green-400' : ''}`}>
                                            <img src={partner.avatarUrl} alt={partner.name} className="w-full h-full object-cover" />
                                        </div>
                                        {isSelected && (
                                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${isPreSelected ? 'bg-green-500' : 'bg-sky-500'} rounded-full flex items-center justify-center`}>
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-left flex-1">
                                        <p className={`font-medium ${isSelected ? (isPreSelected ? 'text-green-700' : 'text-sky-700') : 'text-gray-800'}`}>
                                            {partner.name}
                                        </p>
                                        <p className="text-sm text-gray-500">Level {partner.skillLevel} • {partner.playStyle}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Cost Preview */}
                <AnimatePresence>
                    {selectedVenue && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -20, height: 0 }}
                            transition={{ delay: 0.35 }}
                            className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-lg p-6 mb-6 text-white"
                        >
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <DollarSign className="w-6 h-6" />
                                Cost Preview
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="bg-white/20 rounded-xl p-4 text-center">
                                    <p className="text-emerald-100 text-sm">Venue Rate</p>
                                    <p className="text-xl font-bold">£{selectedVenue.pricePerHour}/hr</p>
                                </div>
                                <div className="bg-white/20 rounded-xl p-4 text-center">
                                    <p className="text-emerald-100 text-sm">Duration</p>
                                    <p className="text-xl font-bold">{duration} hr{duration !== 1 ? 's' : ''}</p>
                                </div>
                                <div className="bg-white/20 rounded-xl p-4 text-center">
                                    <p className="text-emerald-100 text-sm">Total Cost</p>
                                    <p className="text-xl font-bold">£{totalCost.toFixed(2)}</p>
                                </div>
                                <div className="bg-white/20 rounded-xl p-4 text-center">
                                    <p className="text-emerald-100 text-sm">Per Person</p>
                                    <p className="text-xl font-bold">£{costPerPerson.toFixed(2)}</p>
                                </div>
                            </div>

                            <p className="text-center text-emerald-100 text-sm">
                                Split between {totalParticipants} {totalParticipants === 1 ? 'person' : 'people'} (You{selectedPartners.length > 0 ? ` + ${selectedPartners.length} partner${selectedPartners.length > 1 ? 's' : ''}` : ''})
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Schedule Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    disabled={!canSchedule || isScheduling}
                    onClick={handleCreateSchedule}
                    className={`w-full flex items-center justify-center gap-3 px-8 py-4 font-bold text-lg rounded-2xl transition-all ${
                        canSchedule && !isScheduling
                            ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-200 hover:shadow-xl hover:scale-[1.02]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {isScheduling ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                            />
                            Creating...
                        </>
                    ) : (
                        <>
                            <Plus className="w-6 h-6" />
                            Create Schedule & Split Fare
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </motion.button>

                {!canSchedule && (
                    <p className="text-center text-gray-500 mt-4 text-sm">
                        Select a date, time, venue, and at least one partner to continue
                    </p>
                )}
            </div>
        </div>
    );
}
