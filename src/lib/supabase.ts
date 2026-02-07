import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    return { data, error };
}

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

// Player helpers
export async function getPlayer(userId: string) {
    const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', userId)
        .single();
    return { data, error };
}

export async function createPlayer(player: {
    id: string;
    email: string;
    name: string;
    bio?: string;
    avatar_url?: string;
    skill_level: number;
    play_style: string;
    location: { lat: number; lng: number; city?: string };
    stats?: object;
    looking_for?: string[];
}) {
    const { data, error } = await supabase
        .from('players')
        .insert([player])
        .select()
        .single();
    return { data, error };
}

export async function updatePlayer(userId: string, updates: Partial<{
    name: string;
    bio: string;
    avatar_url: string;
    skill_level: number;
    play_style: string;
    location: { lat: number; lng: number; city?: string };
    stats: object;
    looking_for: string[];
}>) {
    const { data, error } = await supabase
        .from('players')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
    return { data, error };
}

// Discover/Swipe helpers
export async function getDiscoverPlayers(userId: string, limit = 10) {
    // Get players that haven't been swiped yet
    const { data: swipedIds } = await supabase
        .from('swipes')
        .select('swiped_id')
        .eq('swiper_id', userId);

    const excludeIds = [userId, ...(swipedIds?.map(s => s.swiped_id) || [])];

    const { data, error } = await supabase
        .from('players')
        .select('*')
        .not('id', 'in', `(${excludeIds.join(',')})`)
        .limit(limit);

    return { data, error };
}

export async function createSwipe(swiperId: string, swipedId: string, direction: 'left' | 'right') {
    const { data, error } = await supabase
        .from('swipes')
        .insert([{ swiper_id: swiperId, swiped_id: swipedId, direction }])
        .select()
        .single();

    // Check for mutual match if swiped right
    if (direction === 'right' && !error) {
        const { data: mutualSwipe } = await supabase
            .from('swipes')
            .select('*')
            .eq('swiper_id', swipedId)
            .eq('swiped_id', swiperId)
            .eq('direction', 'right')
            .single();

        if (mutualSwipe) {
            // Create a match!
            const { data: matchData } = await supabase
                .from('matches')
                .insert([{
                    player1_id: swiperId,
                    player2_id: swipedId,
                    status: 'pending'
                }])
                .select()
                .single();

            return { data, error, isMatch: true, match: matchData };
        }
    }

    return { data, error, isMatch: false };
}

// Match helpers
export async function getMatches(userId: string) {
    const { data, error } = await supabase
        .from('matches')
        .select(`
      *,
      player1:players!matches_player1_id_fkey(*),
      player2:players!matches_player2_id_fkey(*)
    `)
        .or(`player1_id.eq.${userId},player2_id.eq.${userId}`)
        .order('matched_at', { ascending: false });

    return { data, error };
}

// Tournament helpers
export async function getTournaments() {
    const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true });

    return { data, error };
}

export async function joinTournament(tournamentId: string, userId: string) {
    const { data: tournament } = await supabase
        .from('tournaments')
        .select('current_players, max_players')
        .eq('id', tournamentId)
        .single();

    if (!tournament) return { error: { message: 'Tournament not found' } };
    if (tournament.current_players.length >= tournament.max_players) {
        return { error: { message: 'Tournament is full' } };
    }

    const { data, error } = await supabase
        .from('tournaments')
        .update({
            current_players: [...tournament.current_players, userId]
        })
        .eq('id', tournamentId)
        .select()
        .single();

    return { data, error };
}

// Club helpers
export async function getClubs() {
    const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .order('member_count', { ascending: false });

    return { data, error };
}

export async function joinClub(clubId: string, userId: string) {
    const { data: club } = await supabase
        .from('clubs')
        .select('members, member_count')
        .eq('id', clubId)
        .single();

    if (!club) return { error: { message: 'Club not found' } };

    const { data, error } = await supabase
        .from('clubs')
        .update({
            members: [...club.members, userId],
            member_count: club.member_count + 1
        })
        .eq('id', clubId)
        .select()
        .single();

    return { data, error };
}
