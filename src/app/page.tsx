'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
    Users, 
    Calendar, 
    MapPin, 
    DollarSign,
    ArrowRight,
    Zap,
    Trophy,
    Building2,
    Sparkles,
    Heart,
    Star,
    Search,
    MessageCircle,
    Clock,
    Target,
    Briefcase,
    FileText,
    UserPlus
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

// Section options from navigation
const partnerOptions = [
    { label: 'Find Partners Nearby', href: '/partners', icon: Search, description: 'Connect with players in your area' },
    { label: 'Swipe for Partners', href: '/partners/swipe', icon: Users, description: 'Tinder-style partner matching' },
    { label: 'My Preferences', href: '/partners/preferences', icon: Target, description: 'Set your partner preferences' },
    { label: 'Chat & Reach Out', href: '/matches', icon: MessageCircle, description: 'Message your connections' },
    { label: 'Scheduling', href: '/partners/scheduling', icon: Clock, description: 'Plan games with your partners' },
    { label: 'Fare Splitting', href: '/partners/fare-splitting', icon: DollarSign, description: 'Split court costs fairly' },
];

const tournamentOptions = [
    { label: 'Join a Tournament', href: '/tournaments/organise?action=join', icon: UserPlus, description: 'Register as a participant' },
    { label: 'Organise a Tournament', href: '/tournaments/organise?action=organize', icon: Calendar, description: 'Host your own event' },
    { label: 'My Tournaments', href: '/tournaments/my-tournaments', icon: Trophy, description: 'Manage your organised events' },
    { label: 'Work at a Tournament', href: '/tournaments/organise?action=work', icon: Briefcase, description: 'Find tournament jobs' },
    { label: 'My Applications', href: '/tournaments/work/my-applications', icon: FileText, description: 'Track your job applications' },
];

const clubOptions = [
    { label: 'Discover Clubs', href: '/clubs', icon: Search, description: 'Find local badminton clubs' },
    { label: 'My Clubs', href: '/clubs?view=my-clubs', icon: Users, description: 'Manage your memberships' },
    { label: 'Create a Club', href: '/clubs/create', icon: UserPlus, description: 'Start your own community' },
    { label: 'Browse Leagues', href: '/league', icon: Trophy, description: 'Find leagues near you' },
    { label: 'Leaderboards', href: '/league?view=leaderboard', icon: Star, description: 'Check rankings and standings' },
];

const courtOptions = [
    { label: 'Find Nearby Courts', href: '/locations', icon: Search, description: 'Discover sports halls near you' },
    { label: 'View Prices', href: '/locations?view=prices', icon: DollarSign, description: 'Compare court rental prices' },
    { label: 'Book a Court', href: '/locations?action=book', icon: Calendar, description: 'Reserve your playing time' },
];

// Image placeholders - Replace with your own images
const IMAGES = {
    hero: '/images/hero.jpg', // Main hero image
    partners: '/images/partners.jpg', // Partners section image
    tournaments: '/images/tournaments.jpg', // Tournaments section image
    clubs: '/images/clubs.jpg', // Clubs section image
    courts: '/images/courts.jpg', // Courts section image
};

interface OptionCardProps {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    index: number;
}

function OptionCard({ label, href, icon: Icon, description, index }: OptionCardProps) {
    // Alternate cards come from left and right
    const isEven = index % 2 === 0;
    
    return (
        <motion.div
            initial={{ opacity: 0, x: isEven ? -80 : 80, rotate: isEven ? -5 : 5 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: false, margin: "-30px" }}
            transition={{ 
                delay: index * 0.08, 
                duration: 0.5,
                type: "spring",
                stiffness: 100
            }}
        >
            <Link href={href}>
                <motion.div 
                    className="group flex items-center gap-4 p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    whileHover={{ x: 8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{label}</h4>
                        <p className="text-sm text-slate-400">{description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                </motion.div>
            </Link>
        </motion.div>
    );
}

interface SectionProps {
    title: string;
    subtitle: string;
    emoji: string;
    options: { label: string; href: string; icon: React.ComponentType<{ className?: string }>; description: string }[];
    imageSrc: string;
    imageAlt: string;
    imageOnLeft: boolean;
    bgColor: string;
    accentColor: string;
}

function FeatureSection({ title, subtitle, emoji, options, imageSrc, imageAlt, imageOnLeft, bgColor, accentColor }: SectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Image comes from left or right depending on position - FASTER
    const imageX = useTransform(
        scrollYProgress, 
        [0, 0.15, 0.85, 1], 
        [imageOnLeft ? -300 : 300, 0, 0, imageOnLeft ? -300 : 300]
    );
    const imageOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
    const imageScale = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0.7, 1, 1, 0.7]);
    const imageRotate = useTransform(
        scrollYProgress, 
        [0, 0.15, 0.85, 1], 
        [imageOnLeft ? -15 : 15, 0, 0, imageOnLeft ? -15 : 15]
    );

    // Options come from opposite side - FASTER
    const optionsX = useTransform(
        scrollYProgress, 
        [0, 0.15, 0.85, 1], 
        [imageOnLeft ? 300 : -300, 0, 0, imageOnLeft ? 300 : -300]
    );
    const optionsOpacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);

    const imageContent = (
        <motion.div 
            className="relative"
            style={{ 
                x: imageX,
                opacity: imageOpacity,
                scale: imageScale,
                rotate: imageRotate
            }}
        >
            {/* ============================================
                IMAGE PLACEHOLDER - REPLACE WITH YOUR IMAGE
                ============================================
                
                To add your image:
                1. Place your image file in: public/images/
                2. Name it according to the section (see imageSrc below)
                3. Uncomment the <img> tag below
                4. Comment out or delete the placeholder <div>
                
                Current image path: {imageSrc}
            */}
            <div className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 ${accentColor === 'indigo' ? 'border-indigo-200' : accentColor === 'pink' ? 'border-pink-200' : accentColor === 'amber' ? 'border-amber-200' : 'border-emerald-200'}`}>
                {/* PLACEHOLDER - Delete this div when adding real image */}
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 left-4 text-6xl">{emoji}</div>
                        <div className="absolute bottom-4 right-4 text-6xl">{emoji}</div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-50">{emoji}</div>
                    </div>
                    <div className="text-center z-10">
                        <span className="text-6xl mb-4 block">{emoji}</span>
                        <p className="text-slate-400 font-medium">Your image here</p>
                        <p className="text-slate-300 text-sm">{imageSrc}</p>
                    </div>
                </div>
                
                {/* UNCOMMENT THIS when you have your image ready:
                <img 
                    src={imageSrc} 
                    alt={imageAlt} 
                    className="aspect-[4/3] w-full h-full object-cover" 
                />
                */}
            </div>
            
            {/* Floating decorative elements */}
            <motion.div 
                className={`absolute -top-4 -right-4 w-20 h-20 ${accentColor === 'indigo' ? 'bg-indigo-200' : accentColor === 'pink' ? 'bg-pink-200' : accentColor === 'amber' ? 'bg-amber-200' : 'bg-emerald-200'} rounded-full blur-xl opacity-60`}
                style={{ x: useTransform(scrollYProgress, [0.85, 1], [0, 150]) }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
                className={`absolute -bottom-4 -left-4 w-16 h-16 ${accentColor === 'indigo' ? 'bg-violet-200' : accentColor === 'pink' ? 'bg-rose-200' : accentColor === 'amber' ? 'bg-orange-200' : 'bg-teal-200'} rounded-full blur-xl opacity-60`}
                style={{ x: useTransform(scrollYProgress, [0.85, 1], [0, -150]) }}
                animate={{ scale: [1.2, 1, 1.2] }}
                transition={{ duration: 5, repeat: Infinity }}
            />
        </motion.div>
    );

    const optionsContent = (
        <motion.div 
            style={{ 
                x: optionsX,
                opacity: optionsOpacity
            }}
        >
            {/* Section header */}
            <div className="mb-8">
                <motion.div 
                    className={`inline-flex items-center gap-2 px-4 py-2 ${accentColor === 'indigo' ? 'bg-indigo-50 border-indigo-100' : accentColor === 'pink' ? 'bg-pink-50 border-pink-100' : accentColor === 'amber' ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'} rounded-full shadow-sm mb-4 border`}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <span className="text-xl">{emoji}</span>
                    <span className={`${accentColor === 'indigo' ? 'text-indigo-600' : accentColor === 'pink' ? 'text-pink-600' : accentColor === 'amber' ? 'text-amber-600' : 'text-emerald-600'} text-sm font-medium`}>{subtitle}</span>
                </motion.div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-slate-700 leading-tight">
                    {title}
                </h2>
            </div>

            {/* Options list - each card staggers in */}
            <div className="space-y-3">
                {options.map((option, index) => (
                    <OptionCard key={option.label} {...option} index={index} />
                ))}
            </div>
        </motion.div>
    );

    return (
        <section ref={sectionRef} className={`py-20 md:py-32 ${bgColor} relative overflow-hidden`}>
            {/* Background decorations that spread on scroll */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div 
                    className={`absolute top-1/4 ${imageOnLeft ? 'right-10' : 'left-10'} w-40 h-40 ${accentColor === 'indigo' ? 'bg-indigo-100' : accentColor === 'pink' ? 'bg-pink-100' : accentColor === 'amber' ? 'bg-amber-100' : 'bg-emerald-100'} rounded-full blur-3xl opacity-50`}
                    style={{ x: useTransform(scrollYProgress, [0.85, 1], [0, imageOnLeft ? 300 : -300]) }}
                />
                <motion.div 
                    className={`absolute bottom-1/4 ${imageOnLeft ? 'left-20' : 'right-20'} w-32 h-32 ${accentColor === 'indigo' ? 'bg-violet-100' : accentColor === 'pink' ? 'bg-rose-100' : accentColor === 'amber' ? 'bg-orange-100' : 'bg-teal-100'} rounded-full blur-2xl opacity-40`}
                    style={{ x: useTransform(scrollYProgress, [0.85, 1], [0, imageOnLeft ? -300 : 300]) }}
                />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {imageOnLeft ? (
                        <>
                            {imageContent}
                            {optionsContent}
                        </>
                    ) : (
                        <>
                            {optionsContent}
                            {imageContent}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

export default function HomePage() {
    const { user, isLoading } = useUser();
    const userName = user?.name?.split(' ')[0] || 'Player';
    
    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress: heroScrollProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    
    // Hero element animations - FAST split left and right on scroll
    const heroOpacity = useTransform(heroScrollProgress, [0, 0.25], [1, 0]);
    
    // Title "Welcome to" goes LEFT - faster
    const welcomeX = useTransform(heroScrollProgress, [0, 0.2], [0, -400]);
    const welcomeRotate = useTransform(heroScrollProgress, [0, 0.2], [0, -20]);
    
    // Title "Goodminton" goes RIGHT - faster
    const goodmintonX = useTransform(heroScrollProgress, [0, 0.2], [0, 400]);
    const goodmintonRotate = useTransform(heroScrollProgress, [0, 0.2], [0, 20]);
    
    // Badge goes UP and fades - faster
    const badgeY = useTransform(heroScrollProgress, [0, 0.15], [0, -200]);
    const badgeScale = useTransform(heroScrollProgress, [0, 0.15], [1, 0.3]);
    
    // User greeting goes DOWN - faster
    const greetingY = useTransform(heroScrollProgress, [0, 0.2], [0, 300]);
    const greetingScale = useTransform(heroScrollProgress, [0, 0.2], [1, 0.5]);
    
    // Subtitle splits - faster
    const subtitleY = useTransform(heroScrollProgress, [0, 0.2], [0, 150]);
    
    // Scroll indicator fades immediately
    const scrollIndicatorOpacity = useTransform(heroScrollProgress, [0, 0.08], [1, 0]);
    
    // Background elements spread dramatically - faster
    const bgSpreadLeft = useTransform(heroScrollProgress, [0, 0.2], [0, -350]);
    const bgSpreadRight = useTransform(heroScrollProgress, [0, 0.2], [0, 350]);
    const bgSpreadUp = useTransform(heroScrollProgress, [0, 0.2], [0, -300]);
    const bgSpreadDown = useTransform(heroScrollProgress, [0, 0.2], [0, 300]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20">
            {/* Hero Section - Welcome to Goodminton */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated background elements that spread dramatically on scroll */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Top-left bubble - goes further left and up */}
                    <motion.div 
                        className="absolute top-20 left-[10%] w-24 h-24 bg-indigo-300/40 rounded-full blur-xl"
                        style={{ 
                            x: bgSpreadLeft,
                            y: bgSpreadUp,
                            opacity: heroOpacity 
                        }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                    {/* Top-right bubble - goes further right and up */}
                    <motion.div 
                        className="absolute top-32 right-[12%] w-36 h-36 bg-violet-300/30 rounded-full blur-2xl"
                        style={{ 
                            x: bgSpreadRight,
                            y: bgSpreadUp,
                            opacity: heroOpacity 
                        }}
                        animate={{ scale: [1.1, 1, 1.1] }}
                        transition={{ duration: 5, repeat: Infinity }}
                    />
                    {/* Bottom-left bubble - goes left and down */}
                    <motion.div 
                        className="absolute bottom-32 left-[20%] w-28 h-28 bg-slate-300/30 rounded-full blur-xl"
                        style={{ 
                            x: bgSpreadLeft,
                            y: bgSpreadDown,
                            opacity: heroOpacity 
                        }}
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 6, repeat: Infinity }}
                    />
                    {/* Bottom-right bubble - goes right and down */}
                    <motion.div 
                        className="absolute bottom-24 right-[18%] w-32 h-32 bg-rose-200/25 rounded-full blur-xl"
                        style={{ 
                            x: bgSpreadRight,
                            y: bgSpreadDown,
                            opacity: heroOpacity 
                        }}
                        animate={{ scale: [1.1, 1, 1.1] }}
                        transition={{ duration: 7, repeat: Infinity }}
                    />
                    {/* Center-left accent */}
                    <motion.div 
                        className="absolute top-1/2 left-[5%] w-20 h-20 bg-amber-200/40 rounded-full blur-lg"
                        style={{ 
                            x: useTransform(heroScrollProgress, [0, 0.5], [0, -350]),
                            opacity: heroOpacity 
                        }}
                    />
                    {/* Center-right accent */}
                    <motion.div 
                        className="absolute top-1/2 right-[5%] w-20 h-20 bg-emerald-200/40 rounded-full blur-lg"
                        style={{ 
                            x: useTransform(heroScrollProgress, [0, 0.5], [0, 350]),
                            opacity: heroOpacity 
                        }}
                    />
                </div>

                {/* Hero Content - Each element splits differently */}
                <div className="relative z-10 container mx-auto px-6 text-center">
                    
                    {/* Floating badge - floats UP on scroll */}
                    <motion.div 
                        className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8 border border-slate-200"
                        style={{ 
                            y: badgeY,
                            scale: badgeScale,
                            opacity: heroOpacity 
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-indigo-600 text-sm font-medium">Your Badminton Community</span>
                        <Star className="w-4 h-4 text-amber-400" />
                    </motion.div>
                    
                    {/* Main Heading - "Welcome to" goes LEFT, "Goodminton" goes RIGHT */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
                        <motion.span 
                            className="gradient-text inline-block"
                            style={{ 
                                x: welcomeX,
                                rotate: welcomeRotate,
                                opacity: heroOpacity 
                            }}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            Welcome to
                        </motion.span>
                        <br />
                        <motion.span 
                            className="text-indigo-600 inline-block"
                            style={{ 
                                x: goodmintonX,
                                rotate: goodmintonRotate,
                                opacity: heroOpacity 
                            }}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            Goodminton ✨
                        </motion.span>
                    </h1>
                    
                    {/* User Greeting - goes DOWN on scroll */}
                    <motion.div
                        style={{ 
                            y: greetingY,
                            scale: greetingScale,
                            opacity: heroOpacity 
                        }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mb-10"
                    >
                        <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200">
                            <span className="text-3xl">👋</span>
                            <span className="text-2xl md:text-3xl text-slate-700">
                                {isLoading ? (
                                    <span className="opacity-50">Loading...</span>
                                ) : (
                                    <>Hello, <span className="font-bold text-indigo-600">{userName}</span>!</>
                                )}
                            </span>
                        </div>
                    </motion.div>

                    {/* Subtitle - fades and moves down */}
                    <motion.p 
                        className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed"
                        style={{ 
                            y: subtitleY,
                            opacity: heroOpacity 
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        Connect with badminton enthusiasts, find courts, join tournaments, and be part of a passionate community 🏸
                    </motion.p>

                    {/* Scroll indicator - fades quickly */}
                    <motion.div
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                        style={{ opacity: scrollIndicatorOpacity }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <span className="text-slate-400 text-sm">Scroll to explore</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <div className="w-6 h-10 rounded-full border-2 border-slate-300 flex items-start justify-center p-1">
                                <motion.div 
                                    className="w-1.5 h-3 bg-indigo-500 rounded-full"
                                    animate={{ y: [0, 12, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Partner Finding Section - Image Right, Options Left */}
            <FeatureSection
                title="Find Your Perfect Badminton Partner 💕"
                subtitle="Partner Finder"
                emoji="🤝"
                options={partnerOptions}
                imageSrc={IMAGES.partners}
                imageAlt="Badminton partners playing together"
                imageOnLeft={false}
                bgColor="bg-gradient-to-br from-pink-50/50 via-white to-rose-50/30"
                accentColor="pink"
            />

            {/* Tournament Section - Image Left, Options Right */}
            <FeatureSection
                title="Compete & Organise Tournaments 🏆"
                subtitle="Tournaments"
                emoji="🎯"
                options={tournamentOptions}
                imageSrc={IMAGES.tournaments}
                imageAlt="Badminton tournament action"
                imageOnLeft={true}
                bgColor="bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30"
                accentColor="amber"
            />

            {/* Clubs & Leagues Section - Image Right, Options Left */}
            <FeatureSection
                title="Join Clubs & Leagues 🏟️"
                subtitle="Community"
                emoji="🎪"
                options={clubOptions}
                imageSrc={IMAGES.clubs}
                imageAlt="Badminton club members"
                imageOnLeft={false}
                bgColor="bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30"
                accentColor="emerald"
            />

            {/* Book a Court Section - Image Left, Options Right */}
            <FeatureSection
                title="Find & Book Courts Near You 📍"
                subtitle="Court Finder"
                emoji="🏸"
                options={courtOptions}
                imageSrc={IMAGES.courts}
                imageAlt="Badminton court"
                imageOnLeft={true}
                bgColor="bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/30"
                accentColor="indigo"
            />

            {/* Stats Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <motion.div 
                        className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Decorative circles */}
                        <div className="absolute top-4 right-10 w-24 h-24 bg-white/10 rounded-full" />
                        <div className="absolute bottom-4 left-20 w-40 h-40 bg-white/10 rounded-full" />
                        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-white/10 rounded-full" />
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                            {[
                                { value: '2,500+', label: 'Active Players', emoji: '🎾' },
                                { value: '50+', label: 'Courts Listed', emoji: '🏟️' },
                                { value: '100+', label: 'Tournaments', emoji: '🏆' },
                                { value: '30+', label: 'Clubs', emoji: '🎯' },
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className="text-center"
                                >
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 2, delay: index * 0.2, repeat: Infinity }}
                                    >
                                        <span className="text-4xl mb-3 block">{stat.emoji}</span>
                                        <p className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</p>
                                        <p className="text-white/80 text-sm">{stat.label}</p>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 pb-32">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-slate-200 max-w-3xl mx-auto"
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="text-6xl mb-6"
                        >
                            🚀
                        </motion.div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-700 mb-4">
                            Ready to play?
                        </h2>
                        <p className="text-slate-500 mb-8 text-lg max-w-lg mx-auto">
                            Join our community of passionate players and start your badminton journey today!
                        </p>
                        <Link href="/discover">
                            <motion.div 
                                className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-lg rounded-2xl shadow-lg cursor-pointer"
                                whileHover={{ scale: 1.05, y: -3 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Start Discovering
                                <Sparkles className="w-6 h-6" />
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}