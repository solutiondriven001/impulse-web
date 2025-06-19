
"use client";

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import MiningCard from '@/components/MiningCard';
import TasksCard from '@/components/TasksCard';
import AdsCard from '@/components/AdsCard';
import LeaderboardCard from '@/components/LeaderboardCard';
import type { LeaderboardEntry } from '@/types';
import { Award, BarChartBig, Brain, Gift, Trophy, CircleDollarSign } from 'lucide-react';

const CURRENT_USER_NAME = "Player1"; // Example current user

// Mock initial leaderboard data
const initialLeaderboardData: LeaderboardEntry[] = [
  { id: '1', name: 'Player1', score: 0, avatarSeed: 'P1' , isCurrentUser: true},
  { id: '2', name: 'FocusMaster', score: 1520, avatarSeed: 'FM' },
  { id: '3', name: 'CoinCollector', score: 980, avatarSeed: 'CC' },
  { id: '4', name: 'TaskNinja', score: 750, avatarSeed: 'TN' },
  { id: '5', name: 'AdWatcherPro', score: 500, avatarSeed: 'AW' },
];


export default function HomePage() {
  const [currentCoins, setCurrentCoins] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboardData);

  const level = useMemo(() => Math.floor(currentCoins / 100) + 1, [currentCoins]);

  // Update current user's score in leaderboard when coins change
  useEffect(() => {
    setLeaderboard(prevLeaderboard =>
      prevLeaderboard.map(user =>
        user.name === CURRENT_USER_NAME ? { ...user, score: currentCoins } : user
      )
    );
  }, [currentCoins]);

  const handleCoinsUpdate = (amount: number) => {
    setCurrentCoins(prevCoins => prevCoins + amount);
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground selection:bg-accent selection:text-accent-foreground bg-gradient-to-br from-white to-purple-300 dark:from-purple-900 dark:to-fuchsia-700">
      <Header currentCoins={currentCoins} />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Coin Generation & Ads */}
          <div className="md:col-span-1 lg:col-span-1 space-y-6">
            <MiningCard onCoinsClaimed={handleCoinsUpdate} level={level} />
          </div>

          {/* Column 2: Tasks */}
          <div className="md:col-span-1 lg:col-span-1 space-y-6">
             <TasksCard currentCoins={currentCoins} level={level} onTaskCompleted={handleCoinsUpdate} />
          </div>
          
          {/* Column 3: Leaderboard & Ads */}
          <div className="md:col-span-2 lg:col-span-1 space-y-6">
            <LeaderboardCard leaderboardData={leaderboard} currentUserName={CURRENT_USER_NAME} />
            <AdsCard onAdWatched={handleCoinsUpdate} level={level}/>
          </div>
        </div>

        {/* Info Section */}
        <section className="mt-12 p-6 bg-card text-card-foreground rounded-xl shadow-lg">
          <h2 className="text-2xl font-headline font-semibold mb-4 flex items-center">
            <Brain className="w-7 h-7 mr-2 text-primary" />
            How to Play Impulse
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-card-foreground/5 rounded-lg">
              <h3 className="font-semibold flex items-center mb-1"><CircleDollarSign className="w-5 h-5 mr-1.5 text-accent"/>Earn Coins</h3>
              <p className="text-card-foreground/80">Start generating coins and claim them when the cycle completes. Higher levels yield more coins!</p>
            </div>
            <div className="p-3 bg-card-foreground/5 rounded-lg">
              <h3 className="font-semibold flex items-center mb-1"><Award className="w-5 h-5 mr-1.5 text-accent"/>Complete Tasks</h3>
              <p className="text-card-foreground/80">Use the AI Task Suggester to find new challenges. Completing tasks earns you bonus coins.</p>
            </div>
            <div className="p-3 bg-card-foreground/5 rounded-lg">
              <h3 className="font-semibold flex items-center mb-1"><Gift className="w-5 h-5 mr-1.5 text-accent"/>Watch Ads</h3>
              <p className="text-card-foreground/80">Need a quick coin boost? Watch a short rewarded ad for an instant bonus.</p>
            </div>
             <div className="p-3 bg-card-foreground/5 rounded-lg">
              <h3 className="font-semibold flex items-center mb-1"><Trophy className="w-5 h-5 mr-1.5 text-accent"/>Climb Leaderboard</h3>
              <p className="text-card-foreground/80">Compete with other players and show off your progress by reaching the top ranks!</p>
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

