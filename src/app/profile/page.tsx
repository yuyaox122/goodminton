'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Navigation';
import { PlayerStats } from '@/components/PlayerStats';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCurrentUser } from '@/lib/mock-data';
import { getSkillLabel, getSkillColor } from '@/lib/utils';
import {
    Camera,
    Edit2,
    MapPin,
    Trophy,
    Users,
    Settings,
    LogOut,
    Shield,
    Bell,
    HelpCircle,
} from 'lucide-react';

export default function ProfilePage() {
    const [user, setUser] = useState(mockCurrentUser);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user.name,
        bio: user.bio,
        playStyle: user.playStyle,
        skillLevel: user.skillLevel,
    });

    const handleSave = () => {
        setUser({ ...user, ...editForm });
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen pb-20">
            <Header
                title="Profile"
                rightElement={
                    <Button variant="ghost" size="icon">
                        <Settings size={20} />
                    </Button>
                }
            />

            <div className="max-w-lg mx-auto px-4 pt-4">
                {/* Profile header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6"
                >
                    <div className="relative inline-block">
                        <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback className="text-3xl">{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-0 right-0 w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <Camera size={18} className="text-primary-foreground" />
                        </button>
                    </div>

                    <h1 className="text-2xl font-bold mt-4">{user.name}</h1>

                    <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground">
                        <MapPin size={16} />
                        <span>{user.location.city || 'Birmingham'}</span>
                    </div>

                    <div className="flex justify-center gap-2 mt-3">
                        <Badge
                            style={{
                                backgroundColor: `${getSkillColor(user.skillLevel)}20`,
                                color: getSkillColor(user.skillLevel),
                            }}
                        >
                            {getSkillLabel(user.skillLevel)} (Level {user.skillLevel})
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                            🏸 {user.playStyle === 'both' ? 'All Styles' : user.playStyle}
                        </Badge>
                    </div>

                    <p className="text-muted-foreground mt-4 max-w-xs mx-auto">
                        {user.bio}
                    </p>

                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        <Edit2 size={16} className="mr-2" />
                        Edit Profile
                    </Button>
                </motion.div>

                {/* Tabs */}
                <Tabs defaultValue="stats" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="stats" className="flex-1">
                            <Trophy size={16} className="mr-2" />
                            Stats
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="flex-1">
                            <Users size={16} className="mr-2" />
                            Activity
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex-1">
                            <Settings size={16} className="mr-2" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="stats" className="mt-4">
                        <PlayerStats player={user} showRadar={true} />
                    </TabsContent>

                    <TabsContent value="activity" className="mt-4 space-y-4">
                        {/* Looking for */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Looking For</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {user.lookingFor.map((type) => (
                                        <Badge key={type} variant="default" className="capitalize">
                                            {type}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                                        🏆
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Won a match</p>
                                        <p className="text-xs text-muted-foreground">vs Sarah Chen • 2 days ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                        🤝
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">New match</p>
                                        <p className="text-xs text-muted-foreground">with James Wilson • 3 days ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                                        🏟️
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Joined club</p>
                                        <p className="text-xs text-muted-foreground">Aston Shuttlers • 1 week ago</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-4 space-y-2">
                        <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                            <CardContent className="flex items-center gap-3 p-4">
                                <Bell size={20} className="text-muted-foreground" />
                                <span className="flex-1">Notifications</span>
                                <Badge variant="secondary">On</Badge>
                            </CardContent>
                        </Card>
                        <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                            <CardContent className="flex items-center gap-3 p-4">
                                <Shield size={20} className="text-muted-foreground" />
                                <span className="flex-1">Privacy</span>
                            </CardContent>
                        </Card>
                        <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                            <CardContent className="flex items-center gap-3 p-4">
                                <MapPin size={20} className="text-muted-foreground" />
                                <span className="flex-1">Location</span>
                                <Badge variant="secondary">{user.location.city}</Badge>
                            </CardContent>
                        </Card>
                        <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                            <CardContent className="flex items-center gap-3 p-4">
                                <HelpCircle size={20} className="text-muted-foreground" />
                                <span className="flex-1">Help & Support</span>
                            </CardContent>
                        </Card>
                        <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                            <CardContent className="flex items-center gap-3 p-4 text-red-500">
                                <LogOut size={20} />
                                <span className="flex-1">Log Out</span>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Edit modal */}
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 bg-background/95 p-4 overflow-y-auto"
                    >
                        <div className="max-w-lg mx-auto pt-4">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Edit Profile</h2>
                                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <Label>Name</Label>
                                    <Input
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <Label>Bio</Label>
                                    <textarea
                                        value={editForm.bio}
                                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                        className="w-full mt-2 p-3 rounded-lg border border-input bg-background resize-none h-24"
                                    />
                                </div>

                                <div>
                                    <Label>Skill Level: {editForm.skillLevel}</Label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={editForm.skillLevel}
                                        onChange={(e) => setEditForm({ ...editForm, skillLevel: parseInt(e.target.value) as any })}
                                        className="w-full mt-2"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Beginner</span>
                                        <span>Pro</span>
                                    </div>
                                </div>

                                <div>
                                    <Label>Play Style</Label>
                                    <div className="flex gap-2 mt-2">
                                        {['singles', 'doubles', 'both'].map((style) => (
                                            <Badge
                                                key={style}
                                                variant={editForm.playStyle === style ? 'default' : 'outline'}
                                                className="cursor-pointer capitalize px-4 py-2"
                                                onClick={() => setEditForm({ ...editForm, playStyle: style as any })}
                                            >
                                                {style === 'both' ? 'Both' : style}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <Button className="w-full" onClick={handleSave}>
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
