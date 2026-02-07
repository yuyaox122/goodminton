'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Users,
  Trophy,
  MapPin,
  Heart,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: <Heart className="text-red-500" size={24} />,
      title: 'Find Partners',
      description: 'Swipe to connect with players matching your skill level',
    },
    {
      icon: <MapPin className="text-blue-500" size={24} />,
      title: '3D Map View',
      description: 'Discover players, courts, and clubs near you',
    },
    {
      icon: <Trophy className="text-yellow-500" size={24} />,
      title: 'Tournaments',
      description: 'Join local tournaments and compete',
    },
    {
      icon: <Users className="text-purple-500" size={24} />,
      title: 'Clubs',
      description: 'Become part of the badminton community',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Hero section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-8">
            <Sparkles size={16} />
            <span className="text-sm font-medium">Built at AstonHack11</span>
          </div>

          {/* Logo */}
          <div className="text-6xl mb-4">🏸</div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              BadmintonConnect
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-md mx-auto mb-8">
            Find your perfect badminton partner. Connect, play, and grow together.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-lg px-8"
              onClick={() => router.push('/discover')}
            >
              Start Swiping
              <ArrowRight size={20} className="ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8"
              onClick={() => router.push('/tournaments')}
            >
              <Trophy size={20} className="mr-2" />
              View Tournaments
            </Button>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 gap-4 mt-16 max-w-lg w-full"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              className="bg-card border border-border rounded-xl p-4 text-left hover:shadow-lg transition-shadow"
            >
              <div className="mb-2">{feature.icon}</div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center gap-8 mt-12 text-center"
        >
          <div>
            <p className="text-3xl font-bold text-green-500">500+</p>
            <p className="text-sm text-muted-foreground">Players</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-yellow-500">50+</p>
            <p className="text-sm text-muted-foreground">Tournaments</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-500">20+</p>
            <p className="text-sm text-muted-foreground">Clubs</p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-muted-foreground">
        <p>Theme: Community - Connect, Support, Empower</p>
        <p className="mt-1">Made with ❤️ at AstonHack11</p>
      </div>
    </div>
  );
}
