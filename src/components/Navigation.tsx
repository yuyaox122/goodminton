'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, MessageCircle, Trophy, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/discover', icon: Search, label: 'Discover' },
    { href: '/matches', icon: MessageCircle, label: 'Matches' },
    { href: '/tournaments', icon: Trophy, label: 'Tournaments' },
    { href: '/clubs', icon: Users, label: 'Clubs' },
    { href: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-lg border-t border-border">
            <div className="max-w-lg mx-auto px-4">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'relative flex flex-col items-center justify-center w-16 h-full transition-colors',
                                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute -top-0.5 w-12 h-1 bg-primary rounded-full"
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <Icon size={22} />
                                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Safe area padding for mobile */}
            <div className="h-safe-area-inset-bottom bg-card" />
        </nav>
    );
}

// Header component
interface HeaderProps {
    title: string;
    subtitle?: string;
    rightElement?: React.ReactNode;
}

export function Header({ title, subtitle, rightElement }: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="max-w-lg mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">{title}</h1>
                        {subtitle && (
                            <p className="text-sm text-muted-foreground">{subtitle}</p>
                        )}
                    </div>
                    {rightElement}
                </div>
            </div>
        </header>
    );
}

// Logo component
export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizes = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-4xl',
    };

    return (
        <div className={cn('font-bold flex items-center gap-2', sizes[size])}>
            <span className="text-3xl">🏸</span>
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                BadmintonConnect
            </span>
        </div>
    );
}
