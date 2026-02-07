import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Calculate distance between two coordinates in km
export function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
}

function toRad(deg: number): number {
    return deg * (Math.PI / 180);
}

// Format distance for display
export function formatDistance(km: number): string {
    if (km < 1) {
        return `${Math.round(km * 1000)}m`;
    }
    return `${km}km`;
}

// Get skill level label
export function getSkillLabel(level: number): string {
    if (level <= 2) return 'Beginner';
    if (level <= 4) return 'Intermediate';
    if (level <= 6) return 'Advanced';
    if (level <= 8) return 'Expert';
    return 'Pro';
}

// Get skill level color
export function getSkillColor(level: number): string {
    if (level <= 2) return '#22c55e'; // green
    if (level <= 4) return '#3b82f6'; // blue
    if (level <= 6) return '#a855f7'; // purple
    if (level <= 8) return '#f97316'; // orange
    return '#ef4444'; // red
}

// Format date for display
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

// Format time ago
export function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return formatDate(dateString);
}

// Generate random avatar URL (for demo)
export function getRandomAvatar(seed: string): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

// Calculate match score between two players
export function calculateMatchScore(
    player1: { skillLevel: number; playStyle: string; preferredDays?: string[] },
    player2: { skillLevel: number; playStyle: string; preferredDays?: string[] }
): number {
    let score = 100;

    // Skill level difference (max 20 points penalty)
    const skillDiff = Math.abs(player1.skillLevel - player2.skillLevel);
    score -= skillDiff * 5;

    // Play style compatibility
    if (player1.playStyle === player2.playStyle ||
        player1.playStyle === 'both' ||
        player2.playStyle === 'both') {
        score += 10;
    } else {
        score -= 10;
    }

    // Availability overlap
    if (player1.preferredDays && player2.preferredDays) {
        const overlap = player1.preferredDays.filter(d =>
            player2.preferredDays?.includes(d)
        ).length;
        score += overlap * 5;
    }

    return Math.max(0, Math.min(100, score));
}
