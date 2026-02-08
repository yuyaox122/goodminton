// API client for frontend
const BASE_URL = '/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
}

// Auth API
export const authAPI = {
    login: (email: string, password: string) =>
        fetchAPI<{ user: any; token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    register: (data: { email: string; password: string; name: string; skillLevel?: number }) =>
        fetchAPI<{ user: any; token: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    logout: () =>
        fetchAPI<{ success: boolean }>('/auth/logout', { method: 'POST' }),

    me: () =>
        fetchAPI<{ user: any }>('/auth/me'),
};

// Players API
export const playersAPI = {
    getAll: () => fetchAPI<any[]>('/players'),
    getForSwiping: () => fetchAPI<any[]>('/players?forSwiping=true'),
    update: (data: any) =>
        fetchAPI<any>('/players', {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
};

// Clubs API
export const clubsAPI = {
    getAll: () => fetchAPI<any[]>('/clubs'),
    getMy: () => fetchAPI<any[]>('/clubs?my=true'),
    join: (clubId: string) =>
        fetchAPI<{ success: boolean }>('/clubs', {
            method: 'POST',
            body: JSON.stringify({ clubId, action: 'join' }),
        }),
    leave: (clubId: string) =>
        fetchAPI<{ success: boolean }>('/clubs', {
            method: 'POST',
            body: JSON.stringify({ clubId, action: 'leave' }),
        }),
};

// Tournaments API
export const tournamentsAPI = {
    getAll: () => fetchAPI<any[]>('/tournaments'),
    getById: (id: string) => fetchAPI<any>(`/tournaments?id=${id}`),
    getOrganised: () => fetchAPI<any[]>('/tournaments?organised=true'),
    getJobs: () => fetchAPI<any[]>('/tournaments?jobs=true'),
    create: (data: any) =>
        fetchAPI<any>('/tournaments', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    join: (tournamentId: string) =>
        fetchAPI<{ success: boolean }>('/tournaments', {
            method: 'POST',
            body: JSON.stringify({ tournamentId, action: 'join' }),
        }),
    leave: (tournamentId: string) =>
        fetchAPI<{ success: boolean }>('/tournaments', {
            method: 'POST',
            body: JSON.stringify({ tournamentId, action: 'leave' }),
        }),
    getAthletes: (tournamentId: string) =>
        fetchAPI<any[]>(`/tournaments/${tournamentId}/athletes`),
    getApplications: (tournamentId: string) =>
        fetchAPI<any[]>(`/tournaments/${tournamentId}/applications`),
    updateApplication: (tournamentId: string, applicationId: string, status: string, notes?: string) =>
        fetchAPI<any>(`/tournaments/${tournamentId}/applications`, {
            method: 'PATCH',
            body: JSON.stringify({ applicationId, status, notes }),
        }),
};

// Jobs API (for workers)
export const jobsAPI = {
    getAll: () => fetchAPI<any[]>('/jobs'),
    getById: (id: string) => fetchAPI<any>(`/jobs?id=${id}`),
    getMy: () => fetchAPI<any[]>('/jobs?my=true'),
    apply: (data: any) =>
        fetchAPI<{ success: boolean }>('/jobs', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};

// Matches/Partner API
export const matchesAPI = {
    getAll: () => fetchAPI<any[]>('/matches'),
    getMessages: (matchId: string) => fetchAPI<any[]>(`/matches?matchId=${matchId}`),
    swipe: (playerId: string, direction: 'like' | 'pass') =>
        fetchAPI<{ swipe: any; match?: any; isMatch: boolean }>('/matches', {
            method: 'POST',
            body: JSON.stringify({ action: 'swipe', playerId, direction }),
        }),
    sendMessage: (matchId: string, content: string) =>
        fetchAPI<any>('/matches', {
            method: 'POST',
            body: JSON.stringify({ action: 'message', matchId, content }),
        }),
};

// Sessions API
export const sessionsAPI = {
    getAll: () => fetchAPI<any[]>('/sessions'),
    getById: (id: string) => fetchAPI<any>(`/sessions?id=${id}`),
    getVenues: () => fetchAPI<any[]>('/sessions?venues=true'),
    create: (data: any) =>
        fetchAPI<any>('/sessions', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (sessionId: string, data: any) =>
        fetchAPI<any>('/sessions', {
            method: 'PATCH',
            body: JSON.stringify({ sessionId, ...data }),
        }),
    updatePayment: (sessionId: string, playerId: string, paid: boolean) =>
        fetchAPI<any>('/sessions', {
            method: 'PATCH',
            body: JSON.stringify({ sessionId, action: 'payment', playerId, paid }),
        }),
    delete: (id: string) =>
        fetchAPI<{ success: boolean }>(`/sessions?id=${id}`, { method: 'DELETE' }),
};

// Courts API
export const courtsAPI = {
    getAll: () => fetchAPI<any[]>('/courts'),
};
