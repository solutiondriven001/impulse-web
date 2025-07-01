
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaySquare, Gift, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdsCardProps {
  onAdWatched: (reward: number) => void;
}

const AD_WATCH_DURATION_MS = 5000;
// Cooldown now increases with each ad watched
const BASE_AD_COOLDOWN_MS = 60000; // 1 minute
const COOLDOWN_INCREMENT_MS = 300000; // 5 minutes per ad watched
// Using separate keys for different concerns and versioning them.
const AD_COOLDOWN_STATE_KEY = 'impulseAppAdCooldown_v1';
const AD_REWARD_STATE_KEY = 'impulseAppAdReward_v1';

const AdsCard: FC<AdsCardProps> = ({ onAdWatched }) => {
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0); // Time in ms remaining for cooldown
  const [adsWatchedToday, setAdsWatchedToday] = useState(0);
  const { toast } = useToast();

  const nextReward = adsWatchedToday + 2; // Reward starts at 2 and increments

  // Effect to load and manage the daily-resetting reward state
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedRewardStateJSON = localStorage.getItem(AD_REWARD_STATE_KEY);
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    if (savedRewardStateJSON) {
      try {
        const savedState = JSON.parse(savedRewardStateJSON);
        // If the last watch was today, use the saved count.
        if (savedState.date === today) {
          setAdsWatchedToday(savedState.adsWatched || 0);
        } else {
          // It's a new day, so we reset.
           localStorage.setItem(AD_REWARD_STATE_KEY, JSON.stringify({ adsWatched: 0, date: today }));
           setAdsWatchedToday(0);
        }
      } catch (error) {
        console.error("Failed to parse ad reward state from localStorage", error);
        localStorage.removeItem(AD_REWARD_STATE_KEY);
      }
    }
  }, []);

  // Effect to manage the ad cooldown timer
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedCooldownStateJSON = localStorage.getItem(AD_COOLDOWN_STATE_KEY);
    if (savedCooldownStateJSON) {
      try {
        const savedState = JSON.parse(savedCooldownStateJSON);
        if (savedState.cooldownEndTime) {
          const now = Date.now();
          const remainingCooldown = Math.max(0, savedState.cooldownEndTime - now);
          setCooldownTime(remainingCooldown);
        }
      } catch (error) {
        console.error("Failed to parse ad cooldown state from localStorage", error);
        localStorage.removeItem(AD_COOLDOWN_STATE_KEY);
      }
    }
  }, []);

  // Countdown logic for the cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime(prev => {
          const newTime = Math.max(0, prev - 1000);
          if (newTime === 0 && typeof window !== 'undefined') {
            localStorage.removeItem(AD_COOLDOWN_STATE_KEY);
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownTime]);

  const handleWatchAd = () => {
    if (isWatchingAd || cooldownTime > 0) return;

    setIsWatchingAd(true);
    const rewardForThisAd = nextReward;

    setTimeout(() => {
      onAdWatched(rewardForThisAd);
      setIsWatchingAd(false);
      
      // Calculate the cooldown for the next ad based on ads watched today
      const nextCooldownDuration = BASE_AD_COOLDOWN_MS + (adsWatchedToday * COOLDOWN_INCREMENT_MS);
      const newCooldownEndTime = Date.now() + nextCooldownDuration;
      setCooldownTime(nextCooldownDuration);
      
      if (typeof window !== 'undefined') {
        // Save cooldown state
        localStorage.setItem(AD_COOLDOWN_STATE_KEY, JSON.stringify({ cooldownEndTime: newCooldownEndTime }));
        
        // Update and save reward state
        const today = new Date().toISOString().split('T')[0];
        const newAdsWatchedCount = adsWatchedToday + 1;
        setAdsWatchedToday(newAdsWatchedCount);
        localStorage.setItem(AD_REWARD_STATE_KEY, JSON.stringify({ adsWatched: newAdsWatchedCount, date: today }));
      }

      toast({
        title: "Ad Watched!",
        description: `You earned ${rewardForThisAd} coins!`,
      });
    }, AD_WATCH_DURATION_MS);
  };

  const canWatchAd = !isWatchingAd && cooldownTime === 0;
  const formatCooldown = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }

  return (
    <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <PlaySquare className="mr-3 h-7 w-7 text-primary" />
          Rewarded Video Ad
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center flex-grow flex flex-col justify-center items-center">
        <Gift className="h-16 w-16 text-yellow-400 animate-bobble" />
        <p className="text-lg text-card-foreground/80">
          Watch a short ad to earn <span className="font-bold text-yellow-400">{nextReward}</span> Impulse!
        </p>
         <p className="text-sm text-card-foreground/70">
          Reward increases with each ad you watch today.
        </p>
        {!canWatchAd && cooldownTime > 0 && (
          <p className="text-sm text-card-foreground/60">
            Next ad available in {formatCooldown(cooldownTime)}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleWatchAd}
          disabled={!canWatchAd}
          className="w-full bg-white text-black hover:bg-gray-200 text-lg py-6 transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95"
        >
          {isWatchingAd ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <PlaySquare className="mr-2 h-5 w-5" />
          )}
          {isWatchingAd ? 'Watching...' : 'Watch Ad'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdsCard;
