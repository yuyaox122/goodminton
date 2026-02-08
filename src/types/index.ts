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
    createdBy?: string; // User ID of the club creator
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

// Tournament Job Types
export interface TournamentJob {
    id: string;
    tournamentId: string;
    tournamentName: string;
    role: string;
    description: string;
    wage: number;
    slots: number;
    filled: number;
    requirements: string[];
    dates: string[];
    location: string;
    applicationDeadline: string;
}

export interface WorkExperience {
    id: string;
    tournamentName: string;
    role: string;
    dateFrom: string;
    dateTo: string;
    description: string;
    reference?: {
        name: string;
        contact: string;
    };
}

export interface JobApplication {
    id: string;
    jobId: string;
    tournamentId: string;
    position: string;
    wage: number;
    
    // Applicant Info
    applicantId: string;
    fullName: string;
    email: string;
    phone: string;
    photoUrl?: string;
    
    // Experience & Documents
    experiences: WorkExperience[];
    cvUrl?: string;
    coverLetter: string;
    
    // Availability
    availability: string[];
    
    // Status
    status: 'pending' | 'under_review' | 'accepted' | 'rejected';
    appliedAt: string;
    reviewedAt?: string;
    notes?: string;
}

export interface AthleteRegistration {
    id: string;
    tournamentId: string;
    playerId: string;
    player?: Player;
    discipline: string[];
    category: string;
    gender: string;
    skillLevel: SkillLevel;
    registeredAt: string;
    status: 'registered' | 'confirmed' | 'withdrawn';
}

export interface OrganisedTournament {
    id: string;
    name: string;
    description: string;
    date: string;
    endDate?: string;
    location: {
        venue: string;
        address: string;
    };
    status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled';
    scale: string;
    format: TournamentFormat;
    
    // Athletes
    maxAthletes: number;
    athletesRegistered: number;
    
    // Staff
    hiringPersonnel: boolean;
    positions: {
        role: string;
        wage: number;
        slots: number;
        filled: number;
    }[];
    
    // Counts
    applicationsCount: number;
    
    createdAt: string;
    organiserId: string;
}

export interface PartnerPreferences {
    gender: string;
    location: string;
    skillLevel: string;
    playStyle: string[];
    availability: string[];
    intention: string[];
}

export interface PartnerSwipe {
    id: string;
    swiperId: string;
    swipedId: string;
    direction: 'like' | 'pass';
    createdAt: string;
}

export interface PartnerMatch {
    id: string;
    player1Id: string;
    player2Id: string;
    player1?: Player;
    player2?: Player;
    matchedAt: string;
    compatibility: number;
}

// Booking & Fare Splitting Types
export interface BookingVenue {
    id: string;
    name: string;
    pricePerHour: number;
}

export interface BookingParticipant {
    id: string;
    name: string;
    avatarUrl: string;
    share: number;
    customShare?: number;
    percentage?: number;
    paid: boolean;
}

export type SplitMode = 'equal' | 'custom' | 'percentage';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface BookedSession {
    id: string;
    date: string;
    time: string;
    duration: number;
    venue: BookingVenue;
    participants: BookingParticipant[];
    totalCost: number;
    splitMode: SplitMode;
    status: BookingStatus;
    createdAt: string;
    createdBy: string;
}

// Payment Allocation for fare splitting
export interface PaymentAllocation {
    participantId: string;
    name: string;
    avatarUrl: string;
    amount: number;
    percentage: number;
    isIncluded: boolean; // Can toggle off to exclude from paying
    isPaid: boolean;
}

export interface ScheduledSession extends BookedSession {
    paymentAllocations?: PaymentAllocation[];
}

