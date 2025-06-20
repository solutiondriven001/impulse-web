
"use client";

import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Power, CircleDollarSign, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface MiningCardProps {
  onCoinsClaimed: (amount: number) => void;
  level: number;
}

const MINING_DURATION_SECONDS = 1 * 60 * 60; // 1 hour
const BASE_COINS_PER_CYCLE = 10;
const MINING_STATE_KEY = 'impulseAppMiningState_v1';

const MiningCard: FC<MiningCardProps> = ({ onCoinsClaimed, level }) => {
  const [miningProgress, setMiningProgress] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [isClaimable, setIsClaimable] = useState(false);
  const [miningStartTime, setMiningStartTime] = useState<number | null>(null);
  const { toast } = useToast();

  const coinsPerCycle = BASE_COINS_PER_CYCLE + (level -1) * 5;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedStateJSON = localStorage.getItem(MINING_STATE_KEY);
    if (savedStateJSON) {
      try {
        const savedState = JSON.parse(savedStateJSON);
        const now = Date.now();

        if (savedState.isClaimable && savedState.miningStartTime) {
          setIsClaimable(true);
          setMiningProgress(100);
          setIsMining(false);
          setMiningStartTime(Number(savedState.miningStartTime));
        } else if (savedState.isMining && savedState.miningStartTime && savedState.coinsReadyAt) {
          const startTime = Number(savedState.miningStartTime);
          const endTime = Number(savedState.coinsReadyAt);

          if (now >= endTime) {
            setIsClaimable(true);
            setMiningProgress(100);
            setIsMining(false);
            setMiningStartTime(startTime);
          } else {
            const totalDurationMs = MINING_DURATION_SECONDS * 1000;
            const elapsedTimeMs = now - startTime;
            const currentProgress = Math.min(100, (elapsedTimeMs / totalDurationMs) * 100);

            setMiningStartTime(startTime);
            setIsMining(true);
            setMiningProgress(currentProgress);
            setIsClaimable(false);
          }
        }
      } catch (error) {
        console.error("Failed to parse mining state from localStorage", error);
        localStorage.removeItem(MINING_STATE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isMining && miningStartTime) {
      const coinsReadyAtTime = miningStartTime + MINING_DURATION_SECONDS * 1000;
      localStorage.setItem(MINING_STATE_KEY, JSON.stringify({
        isMining: true,
        isClaimable: false,
        miningStartTime,
        coinsReadyAt: coinsReadyAtTime,
      }));
    } else if (isClaimable && miningStartTime) {
      const coinsReadyAtTime = miningStartTime + MINING_DURATION_SECONDS * 1000;
      localStorage.setItem(MINING_STATE_KEY, JSON.stringify({
        isMining: false,
        isClaimable: true,
        miningStartTime,
        coinsReadyAt: coinsReadyAtTime,
      }));
    } else if (!isMining && !isClaimable) {
      localStorage.removeItem(MINING_STATE_KEY);
    }
  }, [isMining, isClaimable, miningStartTime]);


  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMining && miningStartTime) {
      const coinsReadyAtTime = miningStartTime + MINING_DURATION_SECONDS * 1000;

      const now = Date.now();
      if (now >= coinsReadyAtTime) {
        setMiningProgress(100);
        setIsMining(false);
        setIsClaimable(true);
        return;
      }

      interval = setInterval(() => {
        const currentTime = Date.now();
        if (currentTime >= coinsReadyAtTime) {
          clearInterval(interval);
          setMiningProgress(100);
          setIsMining(false);
          setIsClaimable(true);
        } else {
          const totalDurationMs = MINING_DURATION_SECONDS * 1000;
          const elapsedTimeMs = currentTime - miningStartTime;
          const currentProgress = (elapsedTimeMs / totalDurationMs) * 100;
          setMiningProgress(Math.min(100, currentProgress));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMining, miningStartTime]);


  const handleGenerateOrClaim = () => {
    if (isClaimable) {
      onCoinsClaimed(coinsPerCycle);
      toast({
        title: "Coins Claimed!",
        description: `You've successfully claimed ${coinsPerCycle} coins.`,
      });
      setIsMining(false);
      setIsClaimable(false);
      setMiningProgress(0);
      setMiningStartTime(null);
    } else if (!isMining && !isClaimable) {
      const startTime = Date.now();
      setMiningStartTime(startTime);
      setIsMining(true);
      setMiningProgress(0);
      setIsClaimable(false);
    }
  };

  const getButtonContent = () => {
    if (isClaimable) {
      return (
        <>
          <CircleDollarSign className="mr-2 h-5 w-5 text-primary" /> Claim {coinsPerCycle} Coins
        </>
      );
    }
    if (isMining) {
      return (
        <>
          <Zap className="mr-2 h-5 w-5 animate-pulse-lg text-black" /> Generating... ({Math.round(miningProgress)}%)
        </>
      );
    }
    return (
      <>
        <Zap className="mr-2 h-5 w-5 text-yellow-400" /> Generate
      </>
    );
  };

  const isConnected = isMining || isClaimable;

  const progressBarClasses = cn(
    "absolute left-0 top-0 h-full transition-all duration-1000 ease-linear"
  );


  return (
    <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-2xl font-headline">
            Coin Generation
          </CardTitle>
          <div className="flex items-center text-sm">
            <Power className={cn("mr-1.5 h-5 w-5", isConnected ? 'text-green-500 animate-pulse' : 'text-muted-foreground')} />
            {isConnected && <span className="text-green-500">Connected</span>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-center flex-grow">
        <div>
            <p className="text-lg">
                Potential Yield: <span className="font-bold text-yellow-400">{coinsPerCycle}</span> <Zap className="inline h-5 w-5 text-yellow-400 animate-pulse" />
            </p>
        </div>
        {isClaimable && <p className="mt-2 text-sm text-green-400 animate-pulse">Ready to Claim!</p>}
         {!isMining && !isClaimable && <p className="mt-2 text-sm text-muted-foreground">Click "Generate" to start a new cycle.</p>}
         {isMining && <p className="mt-2 text-sm text-muted-foreground">Mining in progress...</p>}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGenerateOrClaim}
          disabled={isMining && !isClaimable}
          className="w-full bg-white text-black hover:bg-gray-100 text-lg py-6 transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 relative overflow-hidden"
          aria-live="polite"
        >
          <div
            className={cn(progressBarClasses, "bg-yellow-400")}
            style={{ width: isMining || isClaimable ? `${miningProgress}%` : '0%' }}
            aria-hidden="true"
          />
          {isMining && (
            <div
              className="absolute left-0 top-0 h-full bg-yellow-200 opacity-0 animate-glitter-pulse transition-all duration-1000 ease-linear"
              style={{ width: `${miningProgress}%` }}
              aria-hidden="true"
            />
          )}
          <span className="relative z-10 flex items-center justify-center w-full">
            {getButtonContent()}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MiningCard;
