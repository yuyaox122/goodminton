'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    DollarSign, 
    Users, 
    Calculator,
    Check,
    MapPin,
    Clock,
    Calendar,
    ChevronRight,
    AlertTriangle,
    RotateCcw,
    UserX,
    UserCheck,
    Send,
    CreditCard,
    Bell,
    MessageCircle,
    CheckCircle2,
    X
} from 'lucide-react';
import { Header } from '@/components/Navigation';
import { useBooking, ScheduledSession } from '@/context/BookingContext';

interface PaymentAllocation {
    participantId: string;
    name: string;
    avatarUrl: string;
    amount: number;
    percentage: number;
    isIncluded: boolean;
    isPaid: boolean;
}

export default function FareSplittingPage() {
    const { getSessionsForFareSplitting, getSessionById, updatePaymentAllocations, markParticipantPaid } = useBooking();
    
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [allocations, setAllocations] = useState<PaymentAllocation[]>([]);
    const [showWarning, setShowWarning] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showReminderSent, setShowReminderSent] = useState(false);
    const [showPaymentSimulation, setShowPaymentSimulation] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'complete'>('details');
    
    const sessions = getSessionsForFareSplitting();
    const selectedSession = selectedSessionId ? getSessionById(selectedSessionId) : null;

    // Initialize allocations when session is selected
    useEffect(() => {
        if (selectedSession) {
            if (selectedSession.paymentAllocations) {
                setAllocations(selectedSession.paymentAllocations);
            } else {
                const initialAllocations: PaymentAllocation[] = selectedSession.participants.map(p => ({
                    participantId: p.id,
                    name: p.name,
                    avatarUrl: p.avatarUrl,
                    amount: p.share,
                    percentage: (p.share / selectedSession.totalCost) * 100,
                    isIncluded: true,
                    isPaid: p.paid,
                }));
                setAllocations(initialAllocations);
            }
        }
    }, [selectedSession]);

    // Calculate totals
    const totalAllocated = allocations
        .filter(a => a.isIncluded)
        .reduce((sum, a) => sum + a.amount, 0);
    
    const difference = selectedSession ? selectedSession.totalCost - totalAllocated : 0;
    const isBalanced = Math.abs(difference) < 0.01;
    const includedCount = allocations.filter(a => a.isIncluded).length;

    // Update a participant's payment amount via slider
    const handleSliderChange = (participantId: string, newAmount: number) => {
        setAllocations(prev => prev.map(a => {
            if (a.participantId === participantId) {
                return {
                    ...a,
                    amount: newAmount,
                    percentage: selectedSession ? (newAmount / selectedSession.totalCost) * 100 : 0,
                };
            }
            return a;
        }));
    };

    // Toggle include/exclude participant
    const toggleIncluded = (participantId: string) => {
        setAllocations(prev => {
            const updated = prev.map(a => {
                if (a.participantId === participantId) {
                    return { ...a, isIncluded: !a.isIncluded, amount: a.isIncluded ? 0 : a.amount };
                }
                return a;
            });
            
            // Redistribute among included participants
            const includedParticipants = updated.filter(a => a.isIncluded);
            if (includedParticipants.length > 0 && selectedSession) {
                const equalShare = selectedSession.totalCost / includedParticipants.length;
                return updated.map(a => ({
                    ...a,
                    amount: a.isIncluded ? equalShare : 0,
                    percentage: a.isIncluded ? (equalShare / selectedSession.totalCost) * 100 : 0,
                }));
            }
            return updated;
        });
    };

    // Reset to equal split
    const resetToEqual = () => {
        if (!selectedSession) return;
        const includedParticipants = allocations.filter(a => a.isIncluded);
        if (includedParticipants.length === 0) return;
        
        const equalShare = selectedSession.totalCost / includedParticipants.length;
        setAllocations(prev => prev.map(a => ({
            ...a,
            amount: a.isIncluded ? equalShare : 0,
            percentage: a.isIncluded ? (equalShare / selectedSession.totalCost) * 100 : 0,
        })));
    };

    // Toggle paid status
    const togglePaid = (participantId: string) => {
        setAllocations(prev => prev.map(a => 
            a.participantId === participantId ? { ...a, isPaid: !a.isPaid } : a
        ));
    };

    // Save allocations
    const handleSave = () => {
        if (!isBalanced) {
            setShowWarning(true);
            return;
        }
        if (selectedSessionId) {
            updatePaymentAllocations(selectedSessionId, allocations);
            setShowSuccessModal(true);
        }
    };

    // Handle sending reminders
    const handleSendReminders = () => {
        setShowReminderSent(true);
        setTimeout(() => setShowReminderSent(false), 3000);
    };

    // Handle payment simulation
    const handlePaymentSimulation = () => {
        setShowPaymentSimulation(true);
        setPaymentStep('details');
    };

    const processPayment = () => {
        setPaymentStep('processing');
        setTimeout(() => {
            setPaymentStep('complete');
        }, 2000);
    };

    // Format currency
    const formatCurrency = (amount: number) => `£${amount.toFixed(2)}`;

    // Get unpaid participants
    const unpaidParticipants = allocations.filter(a => a.isIncluded && !a.isPaid);

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            <Header 
                title="Fare Splitting" 
                subtitle="Split court costs from scheduled sessions"
            />

            <div className="container mx-auto px-4 py-6 max-w-2xl">
                {/* Session Selector */}
                {!selectedSessionId ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-sky-500" />
                            Select a Scheduled Session
                        </h2>

                        {sessions.length === 0 ? (
                            <div className="bg-white rounded-3xl shadow-lg p-8 text-center border border-sky-100">
                                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Scheduled Sessions</h3>
                                <p className="text-gray-500">Schedule a game first to split costs with your partners.</p>
                            </div>
                        ) : (
                            sessions.map((session) => (
                                <motion.button
                                    key={session.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedSessionId(session.id)}
                                    className="w-full bg-white rounded-2xl shadow-lg p-5 border border-sky-100 hover:border-sky-300 transition-all text-left"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MapPin className="w-4 h-4 text-sky-500" />
                                                <span className="font-semibold text-gray-800">{session.venue.name}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(session.date).toLocaleDateString('en-GB', { 
                                                        weekday: 'short', 
                                                        day: 'numeric', 
                                                        month: 'short' 
                                                    })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {session.time}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {session.participants.length} players
                                                </span>
                                            </div>
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className="text-2xl font-bold text-sky-600">
                                                    {formatCurrency(session.totalCost)}
                                                </span>
                                                <span className="text-sm text-gray-500">total</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-6 h-6 text-gray-400" />
                                    </div>
                                    
                                    {/* Participant avatars */}
                                    <div className="flex -space-x-2 mt-4">
                                        {session.participants.slice(0, 5).map((p, i) => (
                                            <div
                                                key={p.id}
                                                className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                                            >
                                                {p.name.charAt(0)}
                                            </div>
                                        ))}
                                        {session.participants.length > 5 && (
                                            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-gray-600 text-xs font-bold">
                                                +{session.participants.length - 5}
                                            </div>
                                        )}
                                    </div>
                                </motion.button>
                            ))
                        )}
                    </motion.div>
                ) : selectedSession && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        {/* Session Header */}
                        <div className="bg-white rounded-3xl shadow-lg p-6 border border-sky-100">
                            <button
                                onClick={() => setSelectedSessionId(null)}
                                className="text-sky-500 text-sm font-medium mb-4 hover:text-sky-600"
                            >
                                ← Back to sessions
                            </button>
                            
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-5 h-5 text-sky-500" />
                                <h2 className="text-xl font-bold text-gray-800">{selectedSession.venue.name}</h2>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(selectedSession.date).toLocaleDateString('en-GB', { 
                                        weekday: 'long', 
                                        day: 'numeric', 
                                        month: 'long' 
                                    })}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {selectedSession.time} • {selectedSession.duration}hr
                                </span>
                            </div>

                            <div className="flex items-center justify-between bg-sky-50 rounded-2xl p-4">
                                <div>
                                    <p className="text-sm text-gray-500">Total Cost</p>
                                    <p className="text-3xl font-bold text-sky-600">{formatCurrency(selectedSession.totalCost)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Per Person (equal)</p>
                                    <p className="text-xl font-semibold text-gray-700">
                                        {formatCurrency(selectedSession.totalCost / includedCount || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Balance Indicator */}
                        <div className={`rounded-2xl p-4 ${isBalanced ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {isBalanced ? (
                                        <Check className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    )}
                                    <span className={`font-medium ${isBalanced ? 'text-green-700' : 'text-amber-700'}`}>
                                        {isBalanced ? 'Balanced!' : `${difference > 0 ? 'Under' : 'Over'} by ${formatCurrency(Math.abs(difference))}`}
                                    </span>
                                </div>
                                <button
                                    onClick={resetToEqual}
                                    className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 font-medium"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Reset Equal
                                </button>
                            </div>
                            
                            {/* Progress bar */}
                            <div className="mt-3 h-3 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((totalAllocated / selectedSession.totalCost) * 100, 100)}%` }}
                                    className={`h-full rounded-full ${
                                        isBalanced ? 'bg-green-500' : 
                                        totalAllocated > selectedSession.totalCost ? 'bg-red-500' : 'bg-amber-500'
                                    }`}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-right">
                                {formatCurrency(totalAllocated)} / {formatCurrency(selectedSession.totalCost)} allocated
                            </p>
                        </div>

                        {/* Payment Allocations */}
                        <div className="bg-white rounded-3xl shadow-lg p-6 border border-sky-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Calculator className="w-5 h-5 text-sky-500" />
                                Payment Allocations
                            </h3>

                            <div className="space-y-6">
                                {allocations.map((allocation) => (
                                    <div 
                                        key={allocation.participantId}
                                        className={`p-4 rounded-2xl transition-all ${
                                            allocation.isIncluded 
                                                ? 'bg-white border-2 border-gray-100' 
                                                : 'bg-gray-50 border-2 border-dashed border-gray-200 opacity-60'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold">
                                                    {allocation.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{allocation.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {allocation.percentage.toFixed(1)}% of total
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                {/* Include/Exclude Toggle */}
                                                <button
                                                    onClick={() => toggleIncluded(allocation.participantId)}
                                                    className={`p-2 rounded-xl transition-colors ${
                                                        allocation.isIncluded 
                                                            ? 'bg-sky-100 text-sky-600 hover:bg-sky-200'
                                                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                                    }`}
                                                    title={allocation.isIncluded ? 'Exclude from split' : 'Include in split'}
                                                >
                                                    {allocation.isIncluded ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                                                </button>
                                                
                                                {/* Paid Toggle */}
                                                <button
                                                    onClick={() => togglePaid(allocation.participantId)}
                                                    className={`p-2 rounded-xl transition-colors ${
                                                        allocation.isPaid 
                                                            ? 'bg-green-100 text-green-600'
                                                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                    }`}
                                                    title={allocation.isPaid ? 'Mark as unpaid' : 'Mark as paid'}
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {allocation.isIncluded && (
                                            <>
                                                {/* Amount Display */}
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-gray-500">Amount to pay:</span>
                                                    <span className="text-xl font-bold text-sky-600">
                                                        {formatCurrency(allocation.amount)}
                                                    </span>
                                                </div>

                                                {/* Slider */}
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={selectedSession.totalCost}
                                                    step={0.5}
                                                    value={allocation.amount}
                                                    onChange={(e) => handleSliderChange(allocation.participantId, parseFloat(e.target.value))}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-sky"
                                                    style={{
                                                        background: `linear-gradient(to right, hsl(199, 89%, 48%) 0%, hsl(199, 89%, 48%) ${(allocation.amount / selectedSession.totalCost) * 100}%, #e5e7eb ${(allocation.amount / selectedSession.totalCost) * 100}%, #e5e7eb 100%)`
                                                    }}
                                                />
                                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                                    <span>£0</span>
                                                    <span>{formatCurrency(selectedSession.totalCost)}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Save Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            disabled={!isBalanced}
                            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                                isBalanced
                                    ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg hover:shadow-xl'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {isBalanced ? 'Save Allocations' : 'Balance amounts to save'}
                        </motion.button>
                    </motion.div>
                )}

                {/* Warning Modal */}
                <AnimatePresence>
                    {showWarning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                            onClick={() => setShowWarning(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-3xl p-6 max-w-sm w-full"
                            >
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <AlertTriangle className="w-8 h-8 text-amber-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Amounts Don't Match</h3>
                                    <p className="text-gray-600 mb-4">
                                        The total allocated ({formatCurrency(totalAllocated)}) doesn't match the session cost ({formatCurrency(selectedSession?.totalCost || 0)}).
                                    </p>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Adjust the sliders or click "Reset Equal" to balance.
                                    </p>
                                    <button
                                        onClick={() => setShowWarning(false)}
                                        className="w-full py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors"
                                    >
                                        Got it
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Success Modal */}
                <AnimatePresence>
                    {showSuccessModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                            onClick={() => setShowSuccessModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
                            >
                                <button
                                    onClick={() => setShowSuccessModal(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                
                                <div className="text-center mb-6">
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.2 }}
                                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                    >
                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Allocations Saved! 🎉</h3>
                                    <p className="text-gray-600">
                                        Payment splits have been updated for all participants.
                                    </p>
                                </div>

                                {/* Unpaid participants summary */}
                                {unpaidParticipants.length > 0 && (
                                    <div className="bg-amber-50 rounded-2xl p-4 mb-6 border border-amber-100">
                                        <p className="text-sm text-amber-700 font-medium mb-2">
                                            {unpaidParticipants.length} participant{unpaidParticipants.length > 1 ? 's' : ''} still need to pay:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {unpaidParticipants.map(p => (
                                                <span key={p.participantId} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-amber-200">
                                                    {p.name} • {formatCurrency(p.amount)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleSendReminders}
                                        className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
                                    >
                                        <Bell className="w-5 h-5" />
                                        Send Payment Reminders
                                    </button>
                                    
                                    <button
                                        onClick={handlePaymentSimulation}
                                        className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
                                    >
                                        <CreditCard className="w-5 h-5" />
                                        Go to Payment Page
                                    </button>

                                    <button
                                        onClick={() => setShowSuccessModal(false)}
                                        className="w-full flex items-center justify-center gap-3 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        Open Group Chat
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Reminder Sent Toast */}
                <AnimatePresence>
                    {showReminderSent && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
                        >
                            <div className="bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3">
                                <Send className="w-5 h-5" />
                                <span className="font-medium">Reminders sent to {unpaidParticipants.length} participant{unpaidParticipants.length !== 1 ? 's' : ''}!</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Payment Simulation Modal */}
                <AnimatePresence>
                    {showPaymentSimulation && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                            onClick={() => setShowPaymentSimulation(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
                            >
                                {paymentStep === 'details' && (
                                    <>
                                        <div className="text-center mb-6">
                                            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CreditCard className="w-8 h-8 text-sky-500" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">Collect Payment</h3>
                                            <p className="text-gray-600">Simulated payment collection</p>
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            <div className="bg-gray-50 rounded-2xl p-4">
                                                <p className="text-sm text-gray-500 mb-1">Total to collect</p>
                                                <p className="text-3xl font-bold text-gray-800">
                                                    {formatCurrency(unpaidParticipants.reduce((sum, p) => sum + p.amount, 0))}
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-700">Payment Method</p>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <button className="p-3 border-2 border-sky-500 bg-sky-50 rounded-xl text-center">
                                                        <span className="text-2xl">💳</span>
                                                        <p className="text-xs mt-1 font-medium text-sky-600">Card</p>
                                                    </button>
                                                    <button className="p-3 border-2 border-gray-200 rounded-xl text-center hover:border-gray-300">
                                                        <span className="text-2xl">🏦</span>
                                                        <p className="text-xs mt-1 text-gray-500">Bank</p>
                                                    </button>
                                                    <button className="p-3 border-2 border-gray-200 rounded-xl text-center hover:border-gray-300">
                                                        <span className="text-2xl">📱</span>
                                                        <p className="text-xs mt-1 text-gray-500">PayPal</p>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowPaymentSimulation(false)}
                                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={processPayment}
                                                className="flex-1 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600"
                                            >
                                                Process Payment
                                            </button>
                                        </div>
                                    </>
                                )}

                                {paymentStep === 'processing' && (
                                    <div className="text-center py-8">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-16 h-16 border-4 border-sky-200 border-t-sky-500 rounded-full mx-auto mb-4"
                                        />
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">Processing Payment...</h3>
                                        <p className="text-gray-600">Please wait while we process your payment</p>
                                    </div>
                                )}

                                {paymentStep === 'complete' && (
                                    <div className="text-center py-4">
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring" }}
                                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                        >
                                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Complete! 🎉</h3>
                                        <p className="text-gray-600 mb-6">
                                            {formatCurrency(unpaidParticipants.reduce((sum, p) => sum + p.amount, 0))} has been collected
                                        </p>
                                        <button
                                            onClick={() => {
                                                setShowPaymentSimulation(false);
                                                setShowSuccessModal(false);
                                            }}
                                            className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600"
                                        >
                                            Done
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
