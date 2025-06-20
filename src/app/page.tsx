
"use client";

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import MiningCard from '@/components/MiningCard';
import TasksCard from '@/components/TasksCard';
import AdsCard from '@/components/AdsCard';
import LeaderboardCard from '@/components/LeaderboardCard';
import type { LeaderboardEntry } from '@/types';
import { Award, Brain, Gift, Trophy, Zap } from 'lucide-react';

const CURRENT_USER_NAME = "Player1"; 
const USER_COINS_KEY = 'impulseAppUserCoins_v1';

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

  // Load coins from localStorage on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCoins = localStorage.getItem(USER_COINS_KEY);
      if (savedCoins !== null) {
        setCurrentCoins(parseInt(savedCoins, 10));
      }
    }
  }, []);

  // Save coins to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_COINS_KEY, currentCoins.toString());
    }
    // Update current user's score in leaderboard when coins change
    setLeaderboard(prevLeaderboard =>
      prevLeaderboard.map(user =>
        user.name === CURRENT_USER_NAME ? { ...user, score: currentCoins, isCurrentUser: true } : { ...user, isCurrentUser: false }
      )
    );
  }, [currentCoins]);

  const level = useMemo(() => Math.floor(currentCoins / 100) + 1, [currentCoins]);

  const handleCoinsUpdate = (amount: number) => {
    setCurrentCoins(prevCoins => prevCoins + amount);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentCoins={currentCoins} />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MiningCard onCoinsClaimed={handleCoinsUpdate} level={level} />
            <AdsCard onAdWatched={handleCoinsUpdate} level={level}/>
          </div>
          
          <div className="w-full">
            <TasksCard currentCoins={currentCoins} level={level} onTaskCompleted={handleCoinsUpdate} />
          </div>
          
          <div className="w-full">
            <LeaderboardCard leaderboardData={leaderboard} currentUserName={CURRENT_USER_NAME} />
          </div>

        {/* Info Section - This was not in the original screenshot but we'll style it to match */}
        <section className="p-6 bg-white border rounded-xl shadow-sm">
          <h2 className="text-2xl font-headline font-semibold mb-4 flex items-center text-foreground">
            <Brain className="w-7 h-7 mr-2 text-primary" />
            How to Play Impulse
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-4 bg-background rounded-lg border">
              <h3 className="font-semibold flex items-center mb-1 text-foreground"><Zap className="w-5 h-5 mr-1.5 text-accent"/>Earn Coins</h3>
              <p className="text-foreground/80">Start generating coins and claim them when the cycle completes. Higher levels yield more coins!</p>
            </div>
            <div className="p-4 bg-background rounded-lg border">
              <h3 className="font-semibold flex items-center mb-1 text-foreground"><Award className="w-5 h-5 mr-1.5 text-accent"/>Complete Tasks</h3>
              <p className="text-foreground/80">Use the AI Task Suggester to find new challenges. Completing tasks earns you bonus coins.</p>
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
