// Core types for BadmintonConnect

export type PlayStyle = 'singles' | 'doubles' | 'both';
export type SkillLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type MatchStatus = 'pending' | 'accepted' | 'declined';
export type TournamentFormat = 'singles' | 'doubles' | 'mixed';

export interface PlayerStats {
    wins: number;
    losses: number;
    totalMatches: number;
    winRate: number;
    preferredDays: string[];
    averageRating: number;
}

export interface Player {
    id: string;
    email: string;
    name: string;
    bio: string;
    avatarUrl: string;
    skillLevel: SkillLevel;
    playStyle: PlayStyle;
    location: {
        lat: number;
        lng: number;
        city?: string;
    };
    stats: PlayerStats;
    lookingFor: ('casual' | 'competitive' | 'coaching')[];
    createdAt: string;
    updatedAt: string;
}

export interface Swipe {
    id: string;
    swiperId: string;
    swipedId: string;
    direction: 'left' | 'right';
    createdAt: string;
}

export interface Match {
    id: string;
    player1Id: string;
    player2Id: string;
    player1?: Player;
    player2?: Player;
    matchedAt: string;
    status: MatchStatus;
    lastMessage?: string;
}

export interface Tournament {
    id: string;
    name: string;
    description: string;
    location: {
        lat: number;
        lng: number;
        venue: string;
        address: string;
    };
    date: string;
    endDate?: string;
    format: TournamentFormat;
    skillLevelMin: SkillLevel;
    skillLevelMax: SkillLevel;
    maxPlayers: number;
    currentPlayers: string[];
    entryFee?: number;
    prizes?: string[];
    organizer: string;
    createdAt: string;
}

export interface Club {
    id: string;
    name: string;
    description: string;
    avatarUrl?: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    memberCount: number;
    members: string[];
    activityLevel: 'low' | 'medium' | 'high';
    meetingDays: string[];
    skillLevelRange: [SkillLevel, SkillLevel];
    isOpen: boolean;
    createdAt: string;
}

export interface Message {
    id: string;
    matchId: string;
    senderId: string;
    content: string;
    createdAt: string;
    read: boolean;
}

// Map marker types
export interface MapMarker {
    id: string;
    type: 'player' | 'tournament' | 'club' | 'court';
    lat: number;
    lng: number;
    data: Player | Tournament | Club;
}
