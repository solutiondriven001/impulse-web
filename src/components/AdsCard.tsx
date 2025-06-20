
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaySquare, Gift, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdsCardProps {
  onAdWatched: (reward: number) => void;
  level: number;
}

const AD_REWARD_BASE = 25;
const AD_WATCH_DURATION_MS = 5000;
const AD_COOLDOWN_MS = 60000;
const AD_STATE_KEY = 'impulseAppAdState_v1';

const AdsCard: FC<AdsCardProps> = ({ onAdWatched, level }) => {
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0); // Time in ms remaining for cooldown
  const { toast } = useToast();

  const adReward = AD_REWARD_BASE + (level -1) * 10;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedStateJSON = localStorage.getItem(AD_STATE_KEY);
    if (savedStateJSON) {
      try {
        const savedState = JSON.parse(savedStateJSON);
        if (savedState.cooldownEndTime) {
          const now = Date.now();
          const remainingCooldown = Math.max(0, savedState.cooldownEndTime - now);
          setCooldownTime(remainingCooldown);
        }
      } catch (error) {
        console.error("Failed to parse ad state from localStorage", error);
        localStorage.removeItem(AD_STATE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime(prev => {
          const newTime = Math.max(0, prev - 1000);
          if (newTime === 0 && typeof window !== 'undefined') {
            localStorage.removeItem(AD_STATE_KEY);
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

    setTimeout(() => {
      onAdWatched(adReward);
      setIsWatchingAd(false);
      const newCooldownEndTime = Date.now() + AD_COOLDOWN_MS;
      setCooldownTime(AD_COOLDOWN_MS);

      if (typeof window !== 'undefined') {
        localStorage.setItem(AD_STATE_KEY, JSON.stringify({ cooldownEndTime: newCooldownEndTime }));
      }

      toast({
        title: "Ad Watched!",
        description: `You earned ${adReward} coins!`,
      });
    }, AD_WATCH_DURATION_MS);
  };

  const canWatchAd = !isWatchingAd && cooldownTime === 0;

  return (
    <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <PlaySquare className="mr-3 h-7 w-7 text-primary" />
          Rewarded Video Ad
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center flex-grow flex flex-col justify-center items-center">
        <Gift className="h-16 w-16 text-yellow-400" />
        <p className="text-lg text-card-foreground/80">
          Watch a short ad to earn <span className="font-bold text-yellow-400">{adReward}</span> coins!
        </p>
        {!canWatchAd && cooldownTime > 0 && (
          <p className="text-sm text-card-foreground/60">
            Next ad available in {Math.ceil(cooldownTime / 1000)}s
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
