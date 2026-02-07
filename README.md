# 🏸 BadmintonConnect

> **AstonHack11** - Theme: Community - Connect, Support, Empower

Find your perfect badminton partner. Connect, play, and grow together.

## 🌟 Features

### 🔥 Core Features
- **Tinder-style Player Matching** - Swipe right to connect with players matching your skill level
- **3D Interactive Map** - Powered by Mapbox GL JS, discover players, courts, clubs, and tournaments near you
- **Player Profiles** - Detailed stats, skill levels, play styles, and availability
- **Real-time Matching** - Get instant notifications when you match with another player

### 🏆 Community Features
- **Tournaments** - Browse and join local badminton tournaments
- **Clubs** - Discover and join badminton clubs in your area
- **Chat** - Message your matches to arrange games

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| Animations | Framer Motion |
| Maps | Mapbox GL JS (3D terrain, custom markers) |
| Backend | Supabase (PostgreSQL, Auth, Real-time) |
| Icons | Lucide React |
| Charts | Recharts |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Mapbox account (for map token)
- Supabase account (for backend)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-team/badminton-connect.git
cd badminton-connect
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with app overview |
| `/discover` | Swipe cards & 3D map view to find players |
| `/matches` | View your matches and chat |
| `/tournaments` | Browse and join tournaments |
| `/clubs` | Discover and join local clubs |
| `/profile` | View and edit your profile |

## 🗃️ Database Schema

```sql
-- Players table
players (
  id UUID PRIMARY KEY,
  email TEXT,
  name TEXT,
  bio TEXT,
  avatar_url TEXT,
  skill_level INT (1-10),
  play_style TEXT (singles/doubles/both),
  location JSONB {lat, lng, city},
  stats JSONB {wins, losses, winRate, preferredDays},
  looking_for TEXT[] (casual/competitive/coaching),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Swipes table
swipes (
  id UUID PRIMARY KEY,
  swiper_id UUID REFERENCES players,
  swiped_id UUID REFERENCES players,
  direction TEXT (left/right),
  created_at TIMESTAMP
)

-- Matches table (mutual swipes)
matches (
  id UUID PRIMARY KEY,
  player1_id UUID REFERENCES players,
  player2_id UUID REFERENCES players,
  matched_at TIMESTAMP,
  status TEXT (pending/accepted/declined)
)

-- Tournaments table
tournaments (
  id UUID PRIMARY KEY,
  name TEXT,
  description TEXT,
  location JSONB {lat, lng, venue, address},
  date TIMESTAMP,
  format TEXT (singles/doubles/mixed),
  skill_level_min INT,
  skill_level_max INT,
  max_players INT,
  current_players UUID[],
  entry_fee DECIMAL,
  prizes TEXT[],
  organizer TEXT
)

-- Clubs table
clubs (
  id UUID PRIMARY KEY,
  name TEXT,
  description TEXT,
  location JSONB {lat, lng, address},
  member_count INT,
  members UUID[],
  activity_level TEXT (low/medium/high),
  meeting_days TEXT[],
  skill_level_range INT[2],
  is_open BOOLEAN
)
```

## 🎯 How It Addresses the Theme

**Community - Connect, Support, Empower**

- **Connect**: Our Tinder-style matching and 3D map help badminton players find each other based on skill level, location, and play preferences.

- **Support**: The club system creates support networks for players of all levels, from beginners seeking coaching to advanced players looking for competitive partners.

- **Empower**: Tournament discovery and registration empowers players to compete, improve their skills, and become active members of the badminton community.

## 🎬 Demo Script (2 minutes)

1. **Problem** (0:00-0:20): "Finding badminton partners is hard. You don't know who plays near you, their skill level, or when they're available."

2. **Solution Demo** (0:20-1:30):
   - Show the landing page and swipe interface
   - Demonstrate the smooth swipe animations
   - Trigger a match and show the confetti celebration
   - Toggle to the 3D map view with player markers
   - Browse tournaments and show the detail modal
   - Quick look at clubs

3. **Impact** (1:30-2:00): "BadmintonConnect builds community by connecting players, supporting growth through clubs, and empowering competition through tournaments."

## 👥 Team

Built with ❤️ at AstonHack11

## 📄 License

MIT License - feel free to use this for your own hackathons!
