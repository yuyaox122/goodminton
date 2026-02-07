'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Player, Tournament, Club } from '@/types';
import { getSkillColor, getSkillLabel } from '@/lib/utils';

// You'll need to set this in your .env.local file
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNsdGVzdCJ9.demo';

interface MapViewProps {
    players?: Player[];
    tournaments?: Tournament[];
    clubs?: Club[];
    userLocation?: { lat: number; lng: number } | null;
    onPlayerClick?: (player: Player) => void;
    onTournamentClick?: (tournament: Tournament) => void;
    onClubClick?: (club: Club) => void;
    showPlayers?: boolean;
    showTournaments?: boolean;
    showClubs?: boolean;
    className?: string;
}

export function MapView({
    players = [],
    tournaments = [],
    clubs = [],
    userLocation,
    onPlayerClick,
    onTournamentClick,
    onClubClick,
    showPlayers = true,
    showTournaments = true,
    showClubs = true,
    className = '',
}: MapViewProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Initialize map
    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        mapboxgl.accessToken = MAPBOX_TOKEN;

        const centerLat = userLocation?.lat || 52.4862;
        const centerLng = userLocation?.lng || -1.8904;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [centerLng, centerLat],
            zoom: 12,
            pitch: 45,
            bearing: -17.6,
            antialias: true,
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add 3D buildings
        map.current.on('load', () => {
            const layers = map.current!.getStyle().layers;
            const labelLayerId = layers?.find(
                (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
            )?.id;

            // Add 3D building layer
            map.current!.addLayer(
                {
                    id: '3d-buildings',
                    source: 'composite',
                    'source-layer': 'building',
                    filter: ['==', 'extrude', 'true'],
                    type: 'fill-extrusion',
                    minzoom: 12,
                    paint: {
                        'fill-extrusion-color': '#1a1a2e',
                        'fill-extrusion-height': ['get', 'height'],
                        'fill-extrusion-base': ['get', 'min_height'],
                        'fill-extrusion-opacity': 0.8,
                    },
                },
                labelLayerId
            );

            setMapLoaded(true);
        });

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, []);

    // Update user location marker
    useEffect(() => {
        if (!map.current || !mapLoaded || !userLocation) return;

        // Add user marker
        const el = document.createElement('div');
        el.className = 'user-marker';
        el.innerHTML = `
      <div class="w-10 h-10 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-pulse">
        <div class="w-3 h-3 bg-white rounded-full"></div>
      </div>
    `;

        new mapboxgl.Marker(el)
            .setLngLat([userLocation.lng, userLocation.lat])
            .addTo(map.current);

        // Fly to user location
        map.current.flyTo({
            center: [userLocation.lng, userLocation.lat],
            zoom: 13,
            duration: 2000,
        });
    }, [userLocation, mapLoaded]);

    // Add markers for players, tournaments, and clubs
    useEffect(() => {
        if (!map.current || !mapLoaded) return;

        // Clear existing markers
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        // Add player markers
        if (showPlayers) {
            players.forEach((player) => {
                const el = document.createElement('div');
                el.className = 'player-marker cursor-pointer';
                el.innerHTML = `
          <div class="relative group">
            <div class="w-12 h-12 rounded-full border-3 shadow-lg overflow-hidden transition-transform hover:scale-110" style="border-color: ${getSkillColor(player.skillLevel)}">
              <img src="${player.avatarUrl}" alt="${player.name}" class="w-full h-full object-cover" />
            </div>
            <div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style="background-color: ${getSkillColor(player.skillLevel)}">
              ${player.skillLevel}
            </div>
          </div>
        `;

                el.addEventListener('click', () => {
                    onPlayerClick?.(player);
                    map.current?.flyTo({
                        center: [player.location.lng, player.location.lat],
                        zoom: 15,
                        duration: 1000,
                    });
                });

                const marker = new mapboxgl.Marker(el)
                    .setLngLat([player.location.lng, player.location.lat])
                    .setPopup(
                        new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div class="p-2">
                <p class="font-semibold">${player.name}</p>
                <p class="text-xs text-gray-500">${getSkillLabel(player.skillLevel)} • ${player.playStyle}</p>
              </div>
            `)
                    )
                    .addTo(map.current!);

                markersRef.current.push(marker);
            });
        }

        // Add tournament markers
        if (showTournaments) {
            tournaments.forEach((tournament) => {
                const el = document.createElement('div');
                el.className = 'tournament-marker cursor-pointer';
                el.innerHTML = `
          <div class="w-10 h-10 bg-yellow-500 rounded-lg shadow-lg flex items-center justify-center transition-transform hover:scale-110">
            <span class="text-xl">🏆</span>
          </div>
        `;

                el.addEventListener('click', () => {
                    onTournamentClick?.(tournament);
                    map.current?.flyTo({
                        center: [tournament.location.lng, tournament.location.lat],
                        zoom: 15,
                        duration: 1000,
                    });
                });

                const marker = new mapboxgl.Marker(el)
                    .setLngLat([tournament.location.lng, tournament.location.lat])
                    .setPopup(
                        new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div class="p-2">
                <p class="font-semibold">${tournament.name}</p>
                <p class="text-xs text-gray-500">${tournament.location.venue}</p>
              </div>
            `)
                    )
                    .addTo(map.current!);

                markersRef.current.push(marker);
            });
        }

        // Add club markers
        if (showClubs) {
            clubs.forEach((club) => {
                const el = document.createElement('div');
                el.className = 'club-marker cursor-pointer';
                el.innerHTML = `
          <div class="w-10 h-10 bg-purple-500 rounded-lg shadow-lg flex items-center justify-center transition-transform hover:scale-110">
            <span class="text-xl">🏟️</span>
          </div>
        `;

                el.addEventListener('click', () => {
                    onClubClick?.(club);
                    map.current?.flyTo({
                        center: [club.location.lng, club.location.lat],
                        zoom: 15,
                        duration: 1000,
                    });
                });

                const marker = new mapboxgl.Marker(el)
                    .setLngLat([club.location.lng, club.location.lat])
                    .setPopup(
                        new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div class="p-2">
                <p class="font-semibold">${club.name}</p>
                <p class="text-xs text-gray-500">${club.memberCount} members</p>
              </div>
            `)
                    )
                    .addTo(map.current!);

                markersRef.current.push(marker);
            });
        }
    }, [players, tournaments, clubs, showPlayers, showTournaments, showClubs, mapLoaded, onPlayerClick, onTournamentClick, onClubClick]);

    return (
        <div className={`relative ${className}`}>
            <div ref={mapContainer} className="w-full h-full rounded-2xl overflow-hidden" />

            {/* Map legend */}
            <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 text-xs space-y-2">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span>You</span>
                </div>
                {showPlayers && (
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span>Players</span>
                    </div>
                )}
                {showTournaments && (
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                        <span>Tournaments</span>
                    </div>
                )}
                {showClubs && (
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                        <span>Clubs</span>
                    </div>
                )}
            </div>
        </div>
    );
}
