
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import MiningCard from '@/components/MiningCard';
import TasksCard from '@/components/TasksCard';
import AdsCard from '@/components/AdsCard';
import StoryCard from '@/components/StoryCard';
import LeaderboardCard from '@/components/LeaderboardCard';
import type { LeaderboardEntry } from '@/types';
import { Award, Brain, Gift, Trophy, Zap, Loader2 } from 'lucide-react';
import { useUserStats } from '@/hooks/use-user-stats';

// Mock initial leaderboard data
const initialLeaderboardData: LeaderboardEntry[] = [
  { id: '2', name: 'FocusMaster', score: 1520, avatarSeed: 'FM' },
  { id: '3', name: 'CoinCollector', score: 980, avatarSeed: 'CC' },
  { id: '4', name: 'TaskNinja', score: 750, avatarSeed: 'TN' },
  { id: '5', name: 'AdWatcherPro', score: 500, avatarSeed: 'AW' },
];

export default function HomePage() {
  const { user, isInitialized, currentCoins, level, addCoins, levelUp } = useUserStats();
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboardData);

  // Route protection
  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/login');
    }
  }, [isInitialized, user, router]);
  
  // Update leaderboard with current user's data
  useEffect(() => {
    if (user) {
        const currentUserEntry: LeaderboardEntry = {
            id: user.uid,
            name: user.displayName || "You",
            score: currentCoins,
            avatarSeed: user.uid.substring(0,2),
            isCurrentUser: true,
        };
        
        // Remove existing current user entry if present and add the updated one
        const otherPlayers = initialLeaderboardData.filter(p => !p.isCurrentUser);
        setLeaderboard([currentUserEntry, ...otherPlayers]);
    }
  }, [currentCoins, user]);

  if (!isInitialized || !user) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading your Impulse...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentCoins={currentCoins} />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MiningCard onCoinsClaimed={addCoins} level={level} />
            <AdsCard onAdWatched={addCoins} onLevelUpgrade={levelUp} level={level} />
          </div>

          <div className="w-full">
            <TasksCard onTaskCompleted={addCoins} currentCoins={currentCoins} />
          </div>
          
          <div className="w-full">
            <StoryCard level={level} currentCoins={currentCoins} onSpendCoins={addCoins} />
          </div>

          <div className="w-full">
            <LeaderboardCard leaderboardData={leaderboard} />
          </div>

        {/* Info Section */}
        <section className="p-6 bg-white border rounded-xl shadow-sm">
          <h2 className="text-2xl font-headline font-semibold mb-4 flex items-center text-foreground">
            <Brain className="w-7 h-7 mr-2 text-primary" />
            How to mine Impulse
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-4 bg-background rounded-lg border">
              <h3 className="font-semibold flex items-center mb-1 text-foreground"><Zap className="w-5 h-5 mr-1.5 text-accent"/>Earn Coins</h3>
              <p className="text-foreground/80">Start generating coins and claim them when the cycle completes. Higher levels yield more coins!</p>
            </div>
            <div className="p-4 bg-background rounded-lg border">
              <h3 className="font-semibold flex items-center mb-1 text-foreground"><Award className="w-5 h-5 mr-1.5 text-accent"/>Complete Tasks</h3>
              <p className="text-foreground/80">Take on special challenges, from social media follows to broker registrations. Each completed task boosts your earnings!</p>
            </div>
            <div className="p-4 bg-background rounded-lg border">
              <h3 className="font-semibold flex items-center mb-1 text-foreground"><Gift className="w-5 h-5 mr-1.5 text-accent"/>Watch Ads</h3>
              <p className="text-foreground/80">Need a quick coin boost? Watch a short rewarded ad for an instant bonus.</p>
            </div>
             <div className="p-4 bg-background rounded-lg border">
              <h3 className="font-semibold flex items-center mb-1 text-foreground"><Trophy className="w-5 h-5 mr-1.5 text-accent"/>Climb Leaderboard</h3>
              <p className="text-foreground/80">Compete with other players and show off your progress by reaching the top ranks!</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="text-center p-4 text-sm text-foreground/70">
        © {new Date().getFullYear()} Impulse. All rights reserved.
      </footer>
    </div>
  );
}
