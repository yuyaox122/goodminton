-- Badminton Connect Database Schema

-- Users/Players table
CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    bio TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    skill_level INTEGER CHECK(skill_level >= 1 AND skill_level <= 10) DEFAULT 5,
    play_style TEXT CHECK(play_style IN ('singles', 'doubles', 'both')) DEFAULT 'both',
    location_lat REAL,
    location_lng REAL,
    location_city TEXT DEFAULT '',
    looking_for TEXT DEFAULT '[]', -- JSON array: ['casual', 'competitive', 'coaching']
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Player stats table
CREATE TABLE IF NOT EXISTS player_stats (
    player_id TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    total_matches INTEGER DEFAULT 0,
    win_rate REAL DEFAULT 0,
    preferred_days TEXT DEFAULT '[]', -- JSON array
    average_rating REAL DEFAULT 0,
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Partner swipes table
CREATE TABLE IF NOT EXISTS partner_swipes (
    id TEXT PRIMARY KEY,
    swiper_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    swiped_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    direction TEXT CHECK(direction IN ('like', 'pass')) NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(swiper_id, swiped_id)
);

-- Partner matches table (created when two players mutually like each other)
CREATE TABLE IF NOT EXISTS partner_matches (
    id TEXT PRIMARY KEY,
    player1_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    player2_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    matched_at TEXT DEFAULT (datetime('now')),
    compatibility INTEGER DEFAULT 0,
    UNIQUE(player1_id, player2_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    match_id TEXT NOT NULL REFERENCES partner_matches(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    read INTEGER DEFAULT 0
);

-- Clubs table
CREATE TABLE IF NOT EXISTS clubs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    location_lat REAL,
    location_lng REAL,
    location_address TEXT DEFAULT '',
    activity_level TEXT CHECK(activity_level IN ('low', 'medium', 'high')) DEFAULT 'medium',
    meeting_days TEXT DEFAULT '[]', -- JSON array
    skill_level_min INTEGER DEFAULT 1,
    skill_level_max INTEGER DEFAULT 10,
    is_open INTEGER DEFAULT 1, -- boolean
    created_at TEXT DEFAULT (datetime('now'))
);

-- Club members junction table
CREATE TABLE IF NOT EXISTS club_members (
    club_id TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    joined_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY(club_id, player_id)
);

-- Tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    location_lat REAL,
    location_lng REAL,
    location_venue TEXT DEFAULT '',
    location_address TEXT DEFAULT '',
    date TEXT NOT NULL,
    end_date TEXT,
    format TEXT CHECK(format IN ('singles', 'doubles', 'mixed')) DEFAULT 'singles',
    skill_level_min INTEGER DEFAULT 1,
    skill_level_max INTEGER DEFAULT 10,
    max_players INTEGER DEFAULT 32,
    entry_fee REAL DEFAULT 0,
    prizes TEXT DEFAULT '[]', -- JSON array
    organizer TEXT DEFAULT '', -- For public tournaments: org name
    organizer_id TEXT REFERENCES players(id), -- For user-organized tournaments
    status TEXT CHECK(status IN ('draft', 'pending', 'active', 'completed', 'cancelled')) DEFAULT 'pending',
    scale TEXT DEFAULT 'Open Entries (Local)',
    hiring_personnel INTEGER DEFAULT 0, -- boolean
    created_at TEXT DEFAULT (datetime('now'))
);

-- Tournament participants (players registered for tournament)
CREATE TABLE IF NOT EXISTS tournament_participants (
    tournament_id TEXT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    registered_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY(tournament_id, player_id)
);

-- Tournament positions (jobs available)
CREATE TABLE IF NOT EXISTS tournament_positions (
    id TEXT PRIMARY KEY,
    tournament_id TEXT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    description TEXT DEFAULT '',
    wage REAL DEFAULT 0,
    slots INTEGER DEFAULT 1,
    filled INTEGER DEFAULT 0,
    requirements TEXT DEFAULT '[]', -- JSON array
    dates TEXT DEFAULT '[]', -- JSON array
    application_deadline TEXT
);

-- Athlete registrations
CREATE TABLE IF NOT EXISTS athlete_registrations (
    id TEXT PRIMARY KEY,
    tournament_id TEXT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    discipline TEXT DEFAULT '[]', -- JSON array
    category TEXT DEFAULT '',
    gender TEXT DEFAULT '',
    skill_level INTEGER DEFAULT 5,
    registered_at TEXT DEFAULT (datetime('now')),
    status TEXT CHECK(status IN ('registered', 'confirmed', 'withdrawn')) DEFAULT 'registered',
    UNIQUE(tournament_id, player_id)
);

-- Job applications
CREATE TABLE IF NOT EXISTS job_applications (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES tournament_positions(id) ON DELETE CASCADE,
    tournament_id TEXT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    applicant_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    photo_url TEXT DEFAULT '',
    cv_url TEXT DEFAULT '',
    cover_letter TEXT DEFAULT '',
    availability TEXT DEFAULT '[]', -- JSON array
    status TEXT CHECK(status IN ('pending', 'under_review', 'accepted', 'rejected')) DEFAULT 'pending',
    applied_at TEXT DEFAULT (datetime('now')),
    reviewed_at TEXT,
    notes TEXT DEFAULT ''
);

-- Work experiences (for job applications)
CREATE TABLE IF NOT EXISTS work_experiences (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
    tournament_name TEXT NOT NULL,
    role TEXT NOT NULL,
    date_from TEXT NOT NULL,
    date_to TEXT NOT NULL,
    description TEXT DEFAULT '',
    reference_name TEXT DEFAULT '',
    reference_contact TEXT DEFAULT ''
);

-- Venues table
CREATE TABLE IF NOT EXISTS venues (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT DEFAULT '',
    price_per_hour REAL DEFAULT 0,
    courts INTEGER DEFAULT 1,
    location_lat REAL,
    location_lng REAL
);

-- Booked sessions
CREATE TABLE IF NOT EXISTS booked_sessions (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    duration REAL DEFAULT 1,
    venue_id TEXT NOT NULL REFERENCES venues(id),
    total_cost REAL DEFAULT 0,
    split_mode TEXT CHECK(split_mode IN ('equal', 'custom', 'percentage')) DEFAULT 'equal',
    status TEXT CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled', 'upcoming')) DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    created_by TEXT NOT NULL REFERENCES players(id)
);

-- Session participants
CREATE TABLE IF NOT EXISTS session_participants (
    session_id TEXT NOT NULL REFERENCES booked_sessions(id) ON DELETE CASCADE,
    player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    share REAL DEFAULT 0,
    custom_share REAL,
    percentage REAL,
    paid INTEGER DEFAULT 0, -- boolean
    PRIMARY KEY(session_id, player_id)
);

-- Courts/locations for map view
CREATE TABLE IF NOT EXISTS courts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    courts INTEGER DEFAULT 1,
    hourly_rate REAL DEFAULT 0
);

-- Partner preferences
CREATE TABLE IF NOT EXISTS partner_preferences (
    player_id TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
    gender TEXT DEFAULT '',
    location TEXT DEFAULT '',
    skill_level TEXT DEFAULT '',
    play_style TEXT DEFAULT '[]', -- JSON array
    availability TEXT DEFAULT '[]', -- JSON array
    intention TEXT DEFAULT '[]', -- JSON array
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_partner_swipes_swiper ON partner_swipes(swiper_id);
CREATE INDEX IF NOT EXISTS idx_partner_swipes_swiped ON partner_swipes(swiped_id);
CREATE INDEX IF NOT EXISTS idx_partner_matches_player1 ON partner_matches(player1_id);
CREATE INDEX IF NOT EXISTS idx_partner_matches_player2 ON partner_matches(player2_id);
CREATE INDEX IF NOT EXISTS idx_messages_match ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_club_members_club ON club_members(club_id);
CREATE INDEX IF NOT EXISTS idx_club_members_player ON club_members(player_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_tournament ON tournament_participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_athlete_registrations_tournament ON athlete_registrations(tournament_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_booked_sessions_created_by ON booked_sessions(created_by);
