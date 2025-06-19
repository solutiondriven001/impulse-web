
"use client";

import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, ServerCog, Star } from 'lucide-react'; // Changed Pickaxe to Zap, Coins to Star
import { useToast } from '@/hooks/use-toast';

interface MiningCardProps {
  onPointsClaimed: (amount: number) => void; // Changed onCoinsClaimed to onPointsClaimed
  level: number;
}

const MINING_DURATION_SECONDS = 30; 
const BASE_POINTS_PER_CYCLE = 10; // Changed BASE_COINS_PER_CYCLE

const MiningCard: FC<MiningCardProps> = ({ onPointsClaimed, level }) => {
  const [miningProgress, setMiningProgress] = useState(0);
  const [isMining, setIsMining] = useState(true); 
  const [isClaimable, setIsClaimable] = useState(false);
  const { toast } = useToast();

  const pointsPerCycle = BASE_POINTS_PER_CYCLE + (level -1) * 5; // Changed coinsPerCycle

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

  const handleClaimPoints = () => { // Changed handleClaimCoins
    if (isClaimable) {
      onPointsClaimed(pointsPerCycle);
      toast({
        title: "Points Claimed!", // Changed Coins to Points
        description: `You've successfully claimed ${pointsPerCycle} points.`, // Changed coins to points
      });
      startMiningCycle();
    }
  };

  return (
    <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-2xl font-headline">
            <Zap className="mr-3 h-7 w-7 text-primary" /> {/* Changed Pickaxe to Zap */}
            Point Generation {/* Changed Coin Mining */}
          </CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <ServerCog className="mr-1.5 h-5 w-5 text-green-500" />
            <span>Connected</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-card-foreground">Progress</span> {/* Changed Mining Progress */}
            <span className="text-sm font-medium text-primary">{Math.round(miningProgress)}%</span>
          </div>
          <Progress value={miningProgress} aria-label="Point generation progress" className="w-full h-4 transition-all duration-1000 ease-linear"/>
          {isClaimable && <p className="text-center mt-2 text-sm text-green-400 animate-pulse">Ready to Claim!</p>}
        </div>
        <div className="text-center">
            <p className="text-lg">
                Potential Yield: <span className="font-bold text-yellow-400">{pointsPerCycle}</span> <Star className="inline h-5 w-5" /> {/* Changed Coins to Star */}
            </p>
            <p className="text-xs text-muted-foreground">Yield increases with your level.</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleClaimPoints} // Changed handleClaimCoins
          disabled={!isClaimable}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6 transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95"
          aria-live="polite"
        >
          {isClaimable ? (
            <>
              <Star className="mr-2 h-5 w-5" /> Claim {pointsPerCycle} Points {/* Changed Coins to Points & Icon */}
            </>
          ) : (
            <>
              <Zap className="mr-2 h-5 w-5 animate-pulse" /> Generating... {/* Changed Mining... */}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MiningCard;
