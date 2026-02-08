'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, 
    Users, 
    Trophy, 
    Building2, 
    Calendar,
    MessageCircle,
    Clock,
    DollarSign,
    Search,
    Briefcase,
    UserPlus,
    ChevronDown,
    Target,
    FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    dropdownItems?: {
        label: string;
        href: string;
        icon: React.ReactNode;
        description?: string;
    }[];
}

const navItems: NavItem[] = [
    {
        label: 'Locations',
        href: '/locations',
        icon: <MapPin size={18} />,
        dropdownItems: [
            { label: 'Find Nearby Courts', href: '/locations', icon: <Search size={16} />, description: 'Discover sports halls near you' },
            { label: 'View Prices', href: '/locations?view=prices', icon: <DollarSign size={16} />, description: 'Compare court rental prices' },
            { label: 'Book a Court', href: '/locations?action=book', icon: <Calendar size={16} />, description: 'Reserve your playing time' },
        ]
    },
    {
        label: 'Partners',
        href: '/partners',
        icon: <Users size={18} />,
        dropdownItems: [
            { label: 'Find Partners Nearby', href: '/partners', icon: <Search size={16} />, description: 'Connect with players in your area' },
            { label: 'Swipe for Partners', href: '/partners/swipe', icon: <Users size={16} />, description: 'Tinder-style partner matching' },
            { label: 'My Preferences', href: '/partners/preferences', icon: <Target size={16} />, description: 'Set your partner preferences' },
            { label: 'Chat & Reach Out', href: '/matches', icon: <MessageCircle size={16} />, description: 'Message your connections' },
            { label: 'Scheduling', href: '/partners/scheduling', icon: <Clock size={16} />, description: 'Plan games with your partners' },
            { label: 'Fare Splitting', href: '/partners/fare-splitting', icon: <DollarSign size={16} />, description: 'Split court costs fairly' },
        ]
    },
    {
        label: 'League',
        href: '/league',
        icon: <Trophy size={18} />,
        dropdownItems: [
            { label: 'Browse Leagues', href: '/league', icon: <Search size={16} />, description: 'Find leagues near you' },
            { label: 'My Leagues', href: '/league?view=my-leagues', icon: <Users size={16} />, description: 'View your league memberships' },
            { label: 'Leaderboards', href: '/league?view=leaderboard', icon: <Trophy size={16} />, description: 'Check rankings and standings' },
        ]
    },
    {
        label: 'Club & Societies',
        href: '/clubs',
        icon: <Building2 size={18} />,
        dropdownItems: [
            { label: 'Discover Clubs', href: '/clubs', icon: <Search size={16} />, description: 'Find local badminton clubs' },
            { label: 'My Clubs', href: '/clubs?view=my-clubs', icon: <Users size={16} />, description: 'Manage your memberships' },
            { label: 'Create a Club', href: '/clubs/create', icon: <UserPlus size={16} />, description: 'Start your own community' },
        ]
    },
    {
        label: 'Organise Tournament',
        href: '/tournaments/organise',
        icon: <Calendar size={18} />,
        dropdownItems: [
            { label: 'Join a Tournament', href: '/tournaments/organise?action=join', icon: <UserPlus size={16} />, description: 'Register as a participant' },
            { label: 'Organise a Tournament', href: '/tournaments/organise?action=organize', icon: <Calendar size={16} />, description: 'Host your own event' },
            { label: 'My Tournaments', href: '/tournaments/my-tournaments', icon: <Trophy size={16} />, description: 'Manage your organised events' },
            { label: 'Work at a Tournament', href: '/tournaments/organise?action=work', icon: <Briefcase size={16} />, description: 'Find tournament jobs' },
            { label: 'My Applications', href: '/tournaments/work/my-applications', icon: <FileText size={16} />, description: 'Track your job applications' },
        ]
    },
];

export function TopNav() {
    const pathname = usePathname();
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-sky-100 shadow-sm">
            <div className="container mx-auto px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <GoodmintonLogo />
                        <span className="text-xl font-bold tracking-wide text-slate-700 group-hover:text-sky-500 transition-colors">
                            Good<span className="text-sky-500">minton</span>
                        </span>
                    </Link>

                    {/* Navigation Items */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => (
                            <div
                                key={item.label}
                                className="relative"
                                onMouseEnter={() => setActiveDropdown(item.label)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-xl",
                                        pathname.startsWith(item.href)
                                            ? "text-sky-500 bg-sky-50"
                                            : "text-slate-600 hover:text-sky-500 hover:bg-sky-50/50"
                                    )}
                                >
                                    {item.label}
                                    {item.dropdownItems && (
                                        <ChevronDown 
                                            size={14} 
                                            className={cn(
                                                "transition-transform duration-200",
                                                activeDropdown === item.label && "rotate-180"
                                            )}
                                        />
                                    )}
                                </Link>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {activeDropdown === item.label && item.dropdownItems && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full left-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-sky-100 overflow-hidden"
                                        >
                                            <div className="p-2">
                                                {item.dropdownItems.map((dropItem) => (
                                                    <Link
                                                        key={dropItem.label}
                                                        href={dropItem.href}
                                                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-sky-50 transition-colors group"
                                                    >
                                                        <div className="p-2 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-400 text-white shadow-md">
                                                            {dropItem.icon}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-700 group-hover:text-sky-500 transition-colors">
                                                                {dropItem.label}
                                                            </p>
                                                            {dropItem.description && (
                                                                <p className="text-xs text-slate-400 mt-0.5">
                                                                    {dropItem.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </nav>

                    {/* Profile */}
                    <Link
                        href="/profile"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-400 text-white text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                            👤
                        </div>
                        Profile
                    </Link>
                </div>
            </div>
        </header>
    );
}

// Custom Goodminton Logo
export function GoodmintonLogo({ size = 40 }: { size?: number }) {
    return (
        <div 
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            {/* Cute Shuttlecock Logo */}
            <svg 
                viewBox="0 0 100 100" 
                className="absolute inset-0 w-full h-full drop-shadow-lg"
            >
                {/* Feathers - Sky blue gradient */}
                <path
                    d="M50 5 L30 40 L50 35 L70 40 Z"
                    fill="url(#featherGradientCute)"
                    opacity="0.9"
                />
                <path
                    d="M50 5 L25 45 L50 38 L75 45 Z"
                    fill="url(#featherGradientCute2)"
                    opacity="0.7"
                />
                {/* Cork base - Gradient */}
                <circle cx="50" cy="65" r="25" fill="url(#corkGradientCute)" />
                
                {/* G Letter */}
                <text
                    x="50"
                    y="73"
                    textAnchor="middle"
                    fontSize="26"
                    fontWeight="700"
                    fill="white"
                    fontFamily="system-ui, sans-serif"
                >
                    G
                </text>
                
                <defs>
                    <linearGradient id="featherGradientCute" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7dd3fc" />
                        <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                    <linearGradient id="featherGradientCute2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#bae6fd" />
                        <stop offset="100%" stopColor="#7dd3fc" />
                    </linearGradient>
                    <linearGradient id="corkGradientCute" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

// Keep the bottom nav for mobile
export function BottomNav() {
    const pathname = usePathname();

    const mobileNavItems = [
        { href: '/discover', icon: Search, label: 'Discover' },
        { href: '/matches', icon: MessageCircle, label: 'Matches' },
        { href: '/tournaments', icon: Trophy, label: 'Tournaments' },
        { href: '/clubs', icon: Building2, label: 'Clubs' },
        { href: '/profile', icon: Users, label: 'Profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-sky-100 shadow-lg lg:hidden">
            <div className="flex items-center justify-around h-16 px-2">
                {mobileNavItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center flex-1 py-2 rounded-2xl transition-all mx-1",
                                isActive
                                    ? "text-sky-500 bg-sky-50"
                                    : "text-slate-400 hover:text-sky-500 hover:bg-sky-50/50"
                            )}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

// Header component for pages
interface HeaderProps {
    title: string;
    subtitle?: string;
    rightElement?: React.ReactNode;
}

export function Header({ title, subtitle, rightElement }: HeaderProps) {
    return (
        <header className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-sky-100">
            <div className="container mx-auto px-6 py-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-700">{title}</h1>
                        {subtitle && (
                            <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
                        )}
                    </div>
                    {rightElement}
                </div>
            </div>
        </header>
    );
}

// Logo component (legacy support)
export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizes = {
        sm: 24,
        md: 40,
        lg: 56,
    };

    return <GoodmintonLogo size={sizes[size]} />;
}