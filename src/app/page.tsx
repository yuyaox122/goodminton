'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
    Star
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

const featureCards = [
    {
        title: 'Partner Preferences',
        description: 'Set your ideal partner criteria',
        icon: Heart,
        href: '/partners/preferences',
        color: 'from-pink-400 to-rose-400',
    },
    {
        title: 'Scheduling',
        description: 'Plan games with your partners',
        icon: Calendar,
        href: '/partners/scheduling',
        color: 'from-violet-400 to-purple-400',
    },
    {
        title: 'Play Now',
        description: 'Find available partners nearby',
        icon: Zap,
        href: '/partners',
        color: 'from-amber-400 to-orange-400',
    },
    {
        title: 'Fare Splitting',
        description: 'Split court costs fairly',
        icon: DollarSign,
        href: '/partners/fare-splitting',
        color: 'from-emerald-400 to-teal-400',
    },
];

const quickLinks = [
    { title: 'Find Courts', description: 'Discover venues near you', icon: MapPin, href: '/locations', emoji: '🏸' },
    { title: 'Tournaments', description: 'Compete and win', icon: Trophy, href: '/tournaments/organise', emoji: '🏆' },
    { title: 'Join Clubs', description: 'Find your community', icon: Building2, href: '/clubs', emoji: '🎯' },
];

export default function HomePage() {
    const { user, isLoading } = useUser();
    const userName = user?.name?.split(' ')[0] || 'Player';

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 bubble-bg">
            {/* Floating decorative elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div 
                    className="absolute top-20 left-10 w-20 h-20 bg-sky-200/40 rounded-full blur-xl"
                    animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                    className="absolute top-40 right-20 w-32 h-32 bg-cyan-200/30 rounded-full blur-2xl"
                    animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                    className="absolute bottom-40 left-1/4 w-24 h-24 bg-blue-200/30 rounded-full blur-xl"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-8">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 via-transparent to-cyan-100/50" />
                
                {/* Content */}
                <div className="relative z-10 container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Cute floating badge */}
                        <motion.div 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8 border border-sky-100"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span className="text-sky-600 text-sm font-medium">
                                Your Badminton Community
                            </span>
                            <Star className="w-4 h-4 text-amber-400" />
                        </motion.div>
                        
                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                            <span className="gradient-text">Welcome to</span>
                            <br />
                            <motion.span 
                                className="text-sky-500 inline-block"
                                animate={{ rotate: [-1, 1, -1] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                Goodminton ✨
                            </motion.span>
                        </h1>
                        
                        {/* User Name */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="mb-8"
                        >
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-sky-100">
                                <span className="text-2xl">👋</span>
                                <span className="text-2xl text-slate-700">
                                    {isLoading ? (
                                        <span className="opacity-50">Loading...</span>
                                    ) : (
                                        <>Hello, <span className="font-bold text-sky-500">{userName}</span>!</>
                                    )}
                                </span>
                            </div>
                        </motion.div>

                        {/* Subtitle */}
                        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Connect with badminton enthusiasts, find courts, and join a community of passionate players 🏸
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/partners">
                                <motion.div 
                                    className="group px-8 py-4 bg-gradient-to-r from-sky-400 to-cyan-400 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 cursor-pointer"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Users className="w-5 h-5" />
                                    Find Partners
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.div>
                            </Link>
                            <Link href="/discover">
                                <motion.div 
                                    className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-sky-600 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 border-2 border-sky-200 cursor-pointer"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Discover Players
                                </motion.div>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Bouncing shuttlecock */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-4xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    🏸
                </motion.div>
            </section>

            {/* Quick Links Section - Floating Cards */}
            <section className="py-12 relative z-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickLinks.map((link, index) => (
                            <motion.div
                                key={link.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.5 }}
                            >
                                <Link href={link.href}>
                                    <motion.div 
                                        className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-sky-100 cursor-pointer cute-card"
                                        whileHover={{ y: -8 }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <motion.div 
                                                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-400 flex items-center justify-center shadow-lg"
                                                whileHover={{ rotate: 10 }}
                                            >
                                                <span className="text-2xl">{link.emoji}</span>
                                            </motion.div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-700 group-hover:text-sky-500 transition-colors text-lg">
                                                    {link.title}
                                                </h3>
                                                <p className="text-sm text-slate-400">{link.description}</p>
                                            </div>
                                            <motion.div
                                                className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center"
                                                whileHover={{ x: 5 }}
                                            >
                                                <ArrowRight className="w-4 h-4 text-sky-400" />
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Find Partner Section */}
            <section className="py-16 relative">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <motion.div 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md mb-6 border border-pink-100"
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Heart className="w-4 h-4 text-pink-400" />
                            <span className="text-pink-500 text-sm font-medium">Find Your Partner</span>
                        </motion.div>
                        
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-700 mb-4">
                            Let&apos;s find you a{' '}
                            <span className="text-sky-500">perfect match</span> 💕
                        </h2>
                        <p className="text-slate-500 text-lg max-w-xl mx-auto">
                            Connect with players who match your skill level and playing style
                        </p>
                    </motion.div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featureCards.map((card, index) => (
                            <motion.div
                                key={card.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <Link href={card.href}>
                                    <motion.div 
                                        className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg cursor-pointer h-full border border-white/50 cute-card overflow-hidden relative"
                                        whileHover={{ y: -10 }}
                                    >
                                        {/* Gradient background on hover */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                                        
                                        {/* Icon */}
                                        <motion.div 
                                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-5 shadow-lg`}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                        >
                                            <card.icon className="w-6 h-6 text-white" />
                                        </motion.div>
                                        
                                        {/* Content */}
                                        <h3 className="text-lg font-bold text-slate-700 mb-2 group-hover:text-sky-500 transition-colors">
                                            {card.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            {card.description}
                                        </p>
                                        
                                        {/* Arrow */}
                                        <motion.div 
                                            className="mt-4 flex items-center text-slate-400 group-hover:text-sky-500 transition-colors"
                                            whileHover={{ x: 5 }}
                                        >
                                            <span className="text-sm font-medium">Explore</span>
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </motion.div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section - Floating bubbles */}
            <section className="py-16 relative">
                <div className="container mx-auto px-6">
                    <motion.div 
                        className="bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 rounded-3xl p-10 shadow-2xl relative overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        {/* Decorative circles */}
                        <div className="absolute top-4 right-10 w-20 h-20 bg-white/10 rounded-full" />
                        <div className="absolute bottom-4 left-20 w-32 h-32 bg-white/10 rounded-full" />
                        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-full" />
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                            {[
                                { value: '2,500+', label: 'Active Players', emoji: '🎾' },
                                { value: '50+', label: 'Courts Listed', emoji: '🏟️' },
                                { value: '100+', label: 'Tournaments', emoji: '🏆' },
                                { value: '30+', label: 'Clubs', emoji: '🎯' },
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className="text-center"
                                >
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 2, delay: index * 0.2, repeat: Infinity }}
                                    >
                                        <span className="text-3xl mb-2 block">{stat.emoji}</span>
                                        <p className="text-4xl md:text-5xl font-bold text-white mb-1">{stat.value}</p>
                                        <p className="text-white/80 text-sm">{stat.label}</p>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 pb-24">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/60 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-sky-100 max-w-2xl mx-auto"
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="text-5xl mb-6"
                        >
                            🚀
                        </motion.div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-700 mb-4">
                            Ready to play?
                        </h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                            Join our community of passionate players and find your perfect match!
                        </p>
                        <Link href="/discover">
                            <motion.div 
                                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-sky-400 to-cyan-400 text-white font-bold rounded-2xl shadow-lg cursor-pointer"
                                whileHover={{ scale: 1.05, y: -3 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Start Discovering
                                <Sparkles className="w-5 h-5" />
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}