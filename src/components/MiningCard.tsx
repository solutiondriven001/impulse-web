
"use client";

import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ServerCog, CircleDollarSign, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MiningCardProps {
  onCoinsClaimed: (amount: number) => void;
  level: number;
}

const MINING_DURATION_SECONDS = 12 * 60 * 60; // 12 hours in seconds
const BASE_COINS_PER_CYCLE = 10;

const MiningCard: FC<MiningCardProps> = ({ onCoinsClaimed, level }) => {
  const [miningProgress, setMiningProgress] = useState(0);
  const [isMining, setIsMining] = useState(true);
  const [isClaimable, setIsClaimable] = useState(false);
  const { toast } = useToast();

  const coinsPerCycle = BASE_COINS_PER_CYCLE + (level -1) * 5;
  const currentlyGeneratingCoins = Math.floor((miningProgress / 100) * coinsPerCycle);

  const startMiningCycle = useCallback(() => {
    setIsMining(true);
    setIsClaimable(false);
    setMiningProgress(0);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMining && miningProgress < 100) {
      interval = setInterval(() => {
        setMiningProgress(prev => {
          const nextProgress = prev + (100 / MINING_DURATION_SECONDS);
          if (nextProgress >= 100) {
            clearInterval(interval);
            setIsMining(false);
            setIsClaimable(true);
            return 100;
          }
          return nextProgress;
        });
      }, 1000);
    } else if (miningProgress >= 100) {
        setIsMining(false);
        setIsClaimable(true);
    }
    return () => clearInterval(interval);
  }, [isMining, miningProgress]);

  const handleClaimCoins = () => {
    if (isClaimable) {
      onCoinsClaimed(coinsPerCycle);
      toast({
        title: "Coins Claimed!",
        description: `You've successfully claimed ${coinsPerCycle} coins.`,
      });
      startMiningCycle();
    }
  };

  return (
    <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-2xl font-headline">
            Coin Generation
          </CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <ServerCog className="mr-1.5 h-5 w-5 text-green-500" />
            <span>Connected</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <div>
            <p className="text-lg">
                Potential Yield: <span className="font-bold text-yellow-400">{coinsPerCycle}</span> <CircleDollarSign className="inline h-5 w-5" />
            </p>
        </div>
        {isClaimable && <p className="mt-2 text-sm text-green-400 animate-pulse">Ready to Claim!</p>}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleClaimCoins}
          disabled={!isClaimable && isMining}
          className="w-full bg-white text-black hover:bg-gray-100 text-lg py-6 transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 relative overflow-hidden"
          aria-live="polite"
        >
          {!isClaimable && isMining && (
            <div
              className="absolute left-0 top-0 h-full bg-yellow-400 transition-all duration-1000 ease-linear"
              style={{ width: `${miningProgress}%` }}
              aria-hidden="true"
            />
          )}
          <span className="relative z-10 flex items-center justify-center w-full">
            {isClaimable ? (
              <>
                <CircleDollarSign className="mr-2 h-5 w-5 text-primary" /> Claim {coinsPerCycle} Coins
              </>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5 animate-pulse text-yellow-400" /> Generating... ({currentlyGeneratingCoins} / {coinsPerCycle} Coins)
              </>
            )}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MiningCard;
