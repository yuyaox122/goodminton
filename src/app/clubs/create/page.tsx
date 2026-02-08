'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    MapPin, 
    Calendar, 
    ChevronLeft,
    ChevronRight,
    Check,
    Star,
    Lock,
    Unlock,
    Activity,
    FileText,
    Image,
    Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Navigation';
import { mockCurrentUser } from '@/lib/mock-data';

const skillLevels = [
    { level: 1, label: 'Beginner', description: 'Just starting out' },
    { level: 2, label: 'Novice', description: 'Learning the basics' },
    { level: 3, label: 'Intermediate-', description: 'Can rally consistently' },
    { level: 4, label: 'Intermediate', description: 'Good fundamentals' },
    { level: 5, label: 'Intermediate+', description: 'Competitive at club level' },
    { level: 6, label: 'Advanced-', description: 'Strong club player' },
    { level: 7, label: 'Advanced', description: 'Can compete regionally' },
    { level: 8, label: 'Advanced+', description: 'County level' },
    { level: 9, label: 'Elite', description: 'National level' },
    { level: 10, label: 'Pro', description: 'Professional level' },
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const activityLevels = [
    { level: 'high', label: 'High Activity', description: 'Multiple sessions per week, active chat', icon: '🔥' },
    { level: 'medium', label: 'Medium Activity', description: 'Weekly sessions, regular updates', icon: '⚡' },
    { level: 'low', label: 'Casual', description: 'Occasional meetups, relaxed pace', icon: '🌿' },
];

interface ClubFormData {
    name: string;
    description: string;
    address: string;
    skillMin: number;
    skillMax: number;
    meetingDays: string[];
    isOpen: boolean;
    activityLevel: 'low' | 'medium' | 'high';
    maxMembers: number;
}

export default function CreateClubPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<ClubFormData>({
        name: '',
        description: '',
        address: '',
        skillMin: 1,
        skillMax: 10,
        meetingDays: [],
        isOpen: true,
        activityLevel: 'medium',
        maxMembers: 50,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps = [
        { id: 'basics', title: 'Club Basics', icon: FileText },
        { id: 'location', title: 'Location', icon: MapPin },
        { id: 'level', title: 'Skill Level', icon: Star },
        { id: 'schedule', title: 'Schedule', icon: Calendar },
        { id: 'settings', title: 'Settings', icon: Users },
    ];

    const updateForm = (field: keyof ClubFormData, value: ClubFormData[keyof ClubFormData]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleDay = (day: string) => {
        setFormData(prev => ({
            ...prev,
            meetingDays: prev.meetingDays.includes(day)
                ? prev.meetingDays.filter(d => d !== day)
                : [...prev.meetingDays, day],
        }));
    };

    const canProceed = () => {
        switch (currentStep) {
            case 0: return formData.name.trim().length >= 3 && formData.description.trim().length >= 10;
            case 1: return formData.address.trim().length >= 5;
            case 2: return formData.skillMin <= formData.skillMax;
            case 3: return formData.meetingDays.length > 0;
            case 4: return true;
            default: return false;
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            router.back();
        }
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        // Simulate API call with createdBy field
        const newClub = {
            id: `club-${Date.now()}`,
            ...formData,
            createdBy: mockCurrentUser.id, // Set the creator as current user
            memberCount: 1,
            members: [mockCurrentUser.id],
            createdAt: new Date().toISOString(),
        };
        console.log('Creating club:', newClub);
        setTimeout(() => {
            alert(`🎉 "${formData.name}" has been created successfully! You are now the owner.`);
            router.push('/clubs');
        }, 1500);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Basics
                return (
                    <motion.div
                        key="basics"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Club Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => updateForm('name', e.target.value)}
                                placeholder="e.g., Birmingham Badminton Buddies"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all text-lg"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                {formData.name.length}/50 characters
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => updateForm('description', e.target.value)}
                                placeholder="Tell potential members about your club, what makes it special, and what they can expect..."
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all resize-none"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                {formData.description.length}/300 characters
                            </p>
                        </div>
                    </motion.div>
                );

            case 1: // Location
                return (
                    <motion.div
                        key="location"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-sky-500 mt-0.5" />
                                <div>
                                    <h3 className="font-medium text-gray-800">Where does your club meet?</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Enter the main venue or area where your club plays.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address / Venue *
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => updateForm('address', e.target.value)}
                                placeholder="e.g., Aston University Sports Centre, Birmingham B4 7ET"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all"
                            />
                        </div>

                        <div className="bg-gray-100 rounded-2xl h-48 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p>Map preview will appear here</p>
                            </div>
                        </div>
                    </motion.div>
                );

            case 2: // Skill Level
                return (
                    <motion.div
                        key="level"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100">
                            <div className="flex items-start gap-3">
                                <Star className="w-5 h-5 text-sky-500 mt-0.5" />
                                <div>
                                    <h3 className="font-medium text-gray-800">What skill levels are welcome?</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Set a range to help players find the right fit.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Minimum Level: <span className="text-sky-600 font-bold">{skillLevels[formData.skillMin - 1]?.label}</span>
                                </label>
                                <input
                                    type="range"
                                    min={1}
                                    max={10}
                                    value={formData.skillMin}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        updateForm('skillMin', val);
                                        if (val > formData.skillMax) updateForm('skillMax', val);
                                    }}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, hsl(199, 89%, 48%) 0%, hsl(199, 89%, 48%) ${(formData.skillMin - 1) * 11.1}%, #e5e7eb ${(formData.skillMin - 1) * 11.1}%, #e5e7eb 100%)`
                                    }}
                                />
                                <p className="text-xs text-gray-500 mt-1">{skillLevels[formData.skillMin - 1]?.description}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Maximum Level: <span className="text-sky-600 font-bold">{skillLevels[formData.skillMax - 1]?.label}</span>
                                </label>
                                <input
                                    type="range"
                                    min={1}
                                    max={10}
                                    value={formData.skillMax}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        updateForm('skillMax', val);
                                        if (val < formData.skillMin) updateForm('skillMin', val);
                                    }}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, hsl(199, 89%, 48%) 0%, hsl(199, 89%, 48%) ${(formData.skillMax - 1) * 11.1}%, #e5e7eb ${(formData.skillMax - 1) * 11.1}%, #e5e7eb 100%)`
                                    }}
                                />
                                <p className="text-xs text-gray-500 mt-1">{skillLevels[formData.skillMax - 1]?.description}</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-4 text-white text-center">
                            <p className="text-sm opacity-80">Your club welcomes players from</p>
                            <p className="text-xl font-bold mt-1">
                                {skillLevels[formData.skillMin - 1]?.label} to {skillLevels[formData.skillMax - 1]?.label}
                            </p>
                        </div>
                    </motion.div>
                );

            case 3: // Schedule
                return (
                    <motion.div
                        key="schedule"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-sky-500 mt-0.5" />
                                <div>
                                    <h3 className="font-medium text-gray-800">When does your club usually meet?</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Select all days that apply.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {daysOfWeek.map(day => (
                                <button
                                    key={day}
                                    onClick={() => toggleDay(day)}
                                    className={`p-4 rounded-xl font-medium transition-all flex items-center justify-between ${
                                        formData.meetingDays.includes(day)
                                            ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-200'
                                            : 'bg-gray-100 text-gray-700 hover:bg-sky-50 hover:text-sky-700'
                                    }`}
                                >
                                    {day}
                                    {formData.meetingDays.includes(day) && <Check className="w-5 h-5" />}
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Expected Activity Level
                            </label>
                            <div className="space-y-3">
                                {activityLevels.map(level => (
                                    <button
                                        key={level.level}
                                        onClick={() => updateForm('activityLevel', level.level as 'low' | 'medium' | 'high')}
                                        className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${
                                            formData.activityLevel === level.level
                                                ? 'bg-sky-100 border-2 border-sky-400'
                                                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                        }`}
                                    >
                                        <span className="text-2xl">{level.icon}</span>
                                        <div>
                                            <p className="font-medium text-gray-800">{level.label}</p>
                                            <p className="text-sm text-gray-500">{level.description}</p>
                                        </div>
                                        {formData.activityLevel === level.level && (
                                            <Check className="w-5 h-5 text-sky-500 ml-auto" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );

            case 4: // Settings
                return (
                    <motion.div
                        key="settings"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100">
                            <div className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-sky-500 mt-0.5" />
                                <div>
                                    <h3 className="font-medium text-gray-800">Membership Settings</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Configure how players can join your club.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Joining Policy
                            </label>
                            <div className="space-y-3">
                                <button
                                    onClick={() => updateForm('isOpen', true)}
                                    className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${
                                        formData.isOpen
                                            ? 'bg-green-100 border-2 border-green-400'
                                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.isOpen ? 'bg-green-500' : 'bg-gray-300'}`}>
                                        <Unlock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Open Club</p>
                                        <p className="text-sm text-gray-500">Anyone can join instantly</p>
                                    </div>
                                    {formData.isOpen && <Check className="w-5 h-5 text-green-500 ml-auto" />}
                                </button>

                                <button
                                    onClick={() => updateForm('isOpen', false)}
                                    className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${
                                        !formData.isOpen
                                            ? 'bg-amber-100 border-2 border-amber-400'
                                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${!formData.isOpen ? 'bg-amber-500' : 'bg-gray-300'}`}>
                                        <Lock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Admin Approval</p>
                                        <p className="text-sm text-gray-500">Review join requests manually</p>
                                    </div>
                                    {!formData.isOpen && <Check className="w-5 h-5 text-amber-500 ml-auto" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Maximum Members: <span className="text-sky-600 font-bold">{formData.maxMembers}</span>
                            </label>
                            <input
                                type="range"
                                min={10}
                                max={200}
                                step={10}
                                value={formData.maxMembers}
                                onChange={(e) => updateForm('maxMembers', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, hsl(199, 89%, 48%) 0%, hsl(199, 89%, 48%) ${((formData.maxMembers - 10) / 190) * 100}%, #e5e7eb ${((formData.maxMembers - 10) / 190) * 100}%, #e5e7eb 100%)`
                                }}
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>10</span>
                                <span>200</span>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-6 text-white">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Club Preview
                            </h3>
                            <div className="bg-white/10 rounded-xl p-4 space-y-2">
                                <p className="font-bold text-xl">{formData.name || 'Your Club Name'}</p>
                                <p className="text-sm opacity-80">{formData.address || 'Location'}</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs">
                                        {skillLevels[formData.skillMin - 1]?.label} - {skillLevels[formData.skillMax - 1]?.label}
                                    </span>
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs">
                                        {formData.isOpen ? 'Open' : 'Approval Required'}
                                    </span>
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs">
                                        {formData.meetingDays.length} days/week
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            <Header 
                title="Create a Club" 
                subtitle="Build your badminton community"
            />

            <div className="container mx-auto px-4 py-6 max-w-2xl">
                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={step.id} className="flex items-center">
                                <div className={`flex flex-col items-center ${index <= currentStep ? 'text-sky-500' : 'text-gray-400'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                        index < currentStep 
                                            ? 'bg-sky-500 text-white' 
                                            : index === currentStep 
                                                ? 'bg-sky-100 text-sky-600 ring-4 ring-sky-200' 
                                                : 'bg-gray-100'
                                    }`}>
                                        {index < currentStep ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 ${index < currentStep ? 'bg-sky-500' : 'bg-gray-200'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-3xl shadow-lg p-6 border border-sky-100 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {renderStepContent()}
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        {currentStep === 0 ? 'Cancel' : 'Back'}
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!canProceed() || isSubmitting}
                        className={`flex items-center gap-2 px-8 py-3 font-semibold rounded-xl transition-all ${
                            canProceed() && !isSubmitting
                                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-200 hover:shadow-xl'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                />
                                Creating...
                            </>
                        ) : currentStep === steps.length - 1 ? (
                            <>
                                Create Club
                                <Sparkles className="w-5 h-5" />
                            </>
                        ) : (
                            <>
                                Continue
                                <ChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
