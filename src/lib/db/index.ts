import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database file location
const DB_PATH = path.join(process.cwd(), 'data', 'badminton.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Create and export database instance
const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize schema
export function initializeDatabase() {
    const schemaPath = path.join(process.cwd(), 'src', 'lib', 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);
    console.log('Database schema initialized');
}

// Helper to convert JS arrays to JSON strings for storage
export function toJSON(arr: unknown): string {
    return JSON.stringify(arr);
}

// Helper to parse JSON strings from database
export function fromJSON<T>(json: string | null): T {
    if (!json) return [] as T;
    try {
        return JSON.parse(json) as T;
    } catch {
        return [] as T;
    }
}

// Export database instance
export default db;

// Type helpers for database rows
export interface DbPlayer {
    id: string;
    email: string;
    password_hash: string;
    name: string;
    bio: string;
    avatar_url: string;
    skill_level: number;
    play_style: string;
    location_lat: number | null;
    location_lng: number | null;
    location_city: string;
    looking_for: string;
    created_at: string;
    updated_at: string;
}

export interface DbPlayerStats {
    player_id: string;
    wins: number;
    losses: number;
    total_matches: number;
    win_rate: number;
    preferred_days: string;
    average_rating: number;
    updated_at: string;
}

export interface DbClub {
    id: string;
    name: string;
    description: string;
    avatar_url: string;
    location_lat: number | null;
    location_lng: number | null;
    location_address: string;
    activity_level: string;
    meeting_days: string;
    skill_level_min: number;
    skill_level_max: number;
    is_open: number;
    created_at: string;
}

export interface DbTournament {
    id: string;
    name: string;
    description: string;
    location_lat: number | null;
    location_lng: number | null;
    location_venue: string;
    location_address: string;
    date: string;
    end_date: string | null;
    format: string;
    skill_level_min: number;
    skill_level_max: number;
    max_players: number;
    entry_fee: number;
    prizes: string;
    organizer: string;
    organizer_id: string | null;
    status: string;
    scale: string;
    hiring_personnel: number;
    created_at: string;
}

export interface DbVenue {
    id: string;
    name: string;
    address: string;
    price_per_hour: number;
    courts: number;
    location_lat: number | null;
    location_lng: number | null;
}

export interface DbBookedSession {
    id: string;
    date: string;
    time: string;
    duration: number;
    venue_id: string;
    total_cost: number;
    split_mode: string;
    status: string;
    created_at: string;
    created_by: string;
}
