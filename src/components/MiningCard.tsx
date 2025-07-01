"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Power, Zap, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface MiningCardProps {
  onCoinsClaimed: (amount: number) => void;
  level: number;
}

const MINING_DURATION_SECONDS = 1 * 60 * 60; // 1 hour
const CLAIM_WINDOW_SECONDS = 10 * 60; // 10 minutes
const MINING_STATE_KEY = 'impulseAppMiningState_v1';

const MiningCard: FC<MiningCardProps> = ({ onCoinsClaimed, level }) => {
  const [miningProgress, setMiningProgress] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [isClaimable, setIsClaimable] = useState(false);
  const [miningStartTime, setMiningStartTime] = useState<number | null>(null);
  const [claimDeadline, setClaimDeadline] = useState<number | null>(null);
  const [timeUntilBurn, setTimeUntilBurn] = useState<string | null>(null);
  const [liveCoins, setLiveCoins] = useState(0);
  const { toast } = useToast();

  const coinsPerCycle = level;

  const handleBurn = () => {
    setIsMining(false);
    setIsClaimable(false);
    setMiningProgress(0);
    setMiningStartTime(null);
    setClaimDeadline(null);
    setTimeUntilBurn(null);
    setLiveCoins(0);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(MINING_STATE_KEY);
    }
    toast({
      title: "Impulse Burned!",
      description: "You didn't claim your coins in time. Be faster next cycle!",
      variant: "destructive",
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedStateJSON = localStorage.getItem(MINING_STATE_KEY);
    if (savedStateJSON) {
      try {
        const savedState = JSON.parse(savedStateJSON);
        const now = Date.now();
        const coinsReadyAtTime = Number(savedState.coinsReadyAt);

        if (savedState.isClaimable && coinsReadyAtTime) {
          const deadline = coinsReadyAtTime + CLAIM_WINDOW_SECONDS * 1000;
          if (now >= deadline) {
            localStorage.removeItem(MINING_STATE_KEY);
          } else {
            setIsClaimable(true);
            setMiningProgress(100);
            setIsMining(false);
            setMiningStartTime(Number(savedState.miningStartTime));
            setClaimDeadline(deadline);
          }
        } else if (savedState.isMining && savedState.miningStartTime && coinsReadyAtTime) {
          const startTime = Number(savedState.miningStartTime);

          if (now >= coinsReadyAtTime) {
            const deadline = coinsReadyAtTime + CLAIM_WINDOW_SECONDS * 1000;
            if (now >= deadline) {
                localStorage.removeItem(MINING_STATE_KEY);
            } else {
                setIsClaimable(true);
                setMiningProgress(100);
                setIsMining(false);
                setMiningStartTime(startTime);
                setClaimDeadline(deadline);
            }
          } else {
            const totalDurationMs = MINING_DURATION_SECONDS * 1000;
            const elapsedTimeMs = now - startTime;
            const currentProgress = Math.min(100, (elapsedTimeMs / totalDurationMs) * 100);
            
            const currentLiveCoins = (currentProgress / 100) * coinsPerCycle;
            setLiveCoins(currentLiveCoins);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

      interval = setInterval(() => {
        const currentTime = Date.now();
        if (currentTime >= coinsReadyAtTime) {
          clearInterval(interval);
          setMiningProgress(100);
          setIsMining(false);
          setIsClaimable(true);
          setClaimDeadline(Date.now() + CLAIM_WINDOW_SECONDS * 1000);
        } else {
          const totalDurationMs = MINING_DURATION_SECONDS * 1000;
          const elapsedTimeMs = currentTime - miningStartTime;
          const currentProgress = (elapsedTimeMs / totalDurationMs) * 100;
          setMiningProgress(Math.min(100, currentProgress));

          const currentLiveCoins = (currentProgress / 100) * coinsPerCycle;
          setLiveCoins(currentLiveCoins);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMining, miningStartTime, coinsPerCycle]);

  useEffect(() => {
    if (isClaimable) {
      setLiveCoins(coinsPerCycle);
    }
  }, [isClaimable, coinsPerCycle]);

  useEffect(() => {
    if (!isClaimable || !claimDeadline) {
        setTimeUntilBurn(null);
        return;
    }
    
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const interval = setInterval(() => {
        const remaining = claimDeadline - Date.now();
        if (remaining <= 0) {
            clearInterval(interval);
            handleBurn();
        } else {
            setTimeUntilBurn(formatTime(remaining));
        }
    }, 1000);

    setTimeUntilBurn(formatTime(claimDeadline - Date.now()));

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClaimable, claimDeadline]);


  const handleGenerateOrClaim = () => {
    if (isClaimable) {
      onCoinsClaimed(coinsPerCycle);
      toast({
        title: "Impulse Claimed!",
        description: `You've successfully claimed ${coinsPerCycle} Impulse.`,
      });
      setIsMining(false);
      setIsClaimable(false);
      setMiningProgress(0);
      setMiningStartTime(null);
      setClaimDeadline(null);
      setLiveCoins(0);
    } else if (!isMining && !isClaimable) {
      const startTime = Date.now();
      setMiningStartTime(startTime);
      setIsMining(true);
      setMiningProgress(0);
      setIsClaimable(false);
      setLiveCoins(0);
    }
  };

  const handleStopMining = () => {
    if (isMining || isClaimable) {
      setIsMining(false);
      setIsClaimable(false);
      setMiningProgress(0);
      setMiningStartTime(null);
      setClaimDeadline(null);
      setLiveCoins(0);
      toast({
        title: "Mining Disconnected",
        description: "You have stopped the current mining cycle.",
        variant: "destructive",
      });
    }
  };

  const getButtonContent = () => {
    if (isClaimable) {
      return (
        <>
          <Zap className="mr-2 h-5 w-5" /> Claim {coinsPerCycle} Impulse
        </>
      );
    }
    if (isMining) {
      return (
        <>
          <Zap className="mr-2 h-5 w-5 animate-pulse-lg text-yellow-400" /> Generating... ({Math.round(miningProgress)}%)
        </>
      );
    }
    return (
      <>
        <Zap className="mr-2 h-5 w-5" /> Generate
      </>
    );
  };

  const isConnected = isMining || isClaimable;

  const baseButtonClasses = "w-full text-lg py-6 transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 relative overflow-hidden";


  return (
    <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-2xl font-headline">
            Coin Generation
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                disabled={!isConnected}
                className="flex items-center text-sm disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Toggle mining connection"
              >
                <Power className={cn("h-5 w-5", isConnected ? 'text-green-500 animate-pulse mr-1.5' : 'text-muted-foreground')} />
                {isConnected && (
                    <span className="text-green-500">
                        Connected
                    </span>
                )}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will stop the current mining cycle. You will lose any progress and potential coins from this cycle.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleStopMining} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Stop Mining
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-center flex-grow">
        <div>
            <p className="text-lg text-card-foreground/80">
                {isMining ? 'Yield' : 'Potential Yield'}: <Zap className={cn("inline h-5 w-5 text-yellow-400 -mt-1 mr-1", isConnected && 'animate-pulse')} /> <span className={cn(
                  "font-bold tabular-nums",
                  isMining
                    ? "bg-gradient-to-r from-yellow-400 via-white/90 to-yellow-400 bg-clip-text text-transparent animate-shimmer-wave bg-[length:200%_auto]"
                    : "text-yellow-400"
                )}>{isMining ? liveCoins.toFixed(5) : coinsPerCycle}</span>
            </p>
        </div>
        {isClaimable && timeUntilBurn && (
            <div className="mt-2 text-sm text-yellow-400 animate-pulse flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 mr-1.5" />
                Coins burn in: {timeUntilBurn}
            </div>
        )}
         {!isMining && !isClaimable && <p className="mt-2 text-sm text-card-foreground/60">Click "Generate" to start a new cycle.</p>}
         {isMining && <p className="mt-2 text-sm text-card-foreground/60">Mining in progress...</p>}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGenerateOrClaim}
          disabled={isMining && !isClaimable}
          className={cn(
            baseButtonClasses,
            isClaimable
              ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black/80 hover:from-yellow-500 hover:to-amber-600'
              : 'bg-white/10 text-white/90 hover:bg-white/20'
          )}
          aria-live="polite"
        >
          <div
            className={cn(
              "absolute left-0 top-0 h-full transition-all duration-1000 ease-linear",
              isClaimable ? 'bg-transparent' : 'bg-white/20',
              (isMining || isClaimable) && 'animate-shimmer-wave bg-gradient-to-r from-transparent via-white/30 to-transparent bg-no-repeat'
            )}
            style={{
              width: isMining ? `${miningProgress}%` : isClaimable ? '100%' : '0%',
              ...((isMining || isClaimable) && { backgroundSize: '200% 100%' })
            }}
            aria-hidden="true"
          />
          <span className="relative z-10 flex items-center justify-center w-full">
            {getButtonContent()}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MiningCard;
