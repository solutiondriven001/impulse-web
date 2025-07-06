
"use client";

import { useState, useEffect } from 'react';
import { useUserStats } from '@/hooks/use-user-stats';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Copy, Gift, PlusCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getLevelDetails, getTotalRequirementsForLevel, getLevelUpRequirements } from '@/lib/levels';

const REFERRAL_COUNT_KEY = 'impulseAppReferralCount_v1';
const REFERRAL_CODE_KEY = 'impulseAppReferralCode_v1';

export default function ReferralsCard() {
  const { level, levelUp } = useUserStats();
  const [referralCount, setReferralCount] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCount = localStorage.getItem(REFERRAL_COUNT_KEY);
      if (savedCount) {
        setReferralCount(parseInt(savedCount, 10));
      }

      let savedCode = localStorage.getItem(REFERRAL_CODE_KEY);
      if (!savedCode) {
        savedCode = nanoid(8).toUpperCase();
        localStorage.setItem(REFERRAL_CODE_KEY, savedCode);
      }
      setReferralCode(savedCode);
    }
  }, []);
  
  useEffect(() => {
    if (referralCount > 0 && level < 5) { // Max level check
      const requirementsForNextLevel = getTotalRequirementsForLevel(level + 1);
      if (referralCount >= requirementsForNextLevel.referrals) {
        levelUp();
        const newLevelDetails = getLevelDetails(level + 1);
        toast({
          title: `Level Up to ${newLevelDetails.name}!`,
          description: `You've referred enough friends and are now Level ${level + 1}.`,
          duration: 5000,
        });
      }
    }
  }, [referralCount, level, levelUp, toast]);


  const handleCopyCode = () => {
    if(navigator.clipboard) {
        navigator.clipboard.writeText(referralCode);
        toast({
          title: "Copied!",
          description: "Referral code copied to clipboard.",
        });
    }
  };
  
  const handleAddReferral = () => {
    const newCount = referralCount + 1;
    setReferralCount(newCount);
    localStorage.setItem(REFERRAL_COUNT_KEY, newCount.toString());
  };

  const reqsToGetCurrentLevel = getTotalRequirementsForLevel(level);
  const reqsForNextLevelGap = getLevelUpRequirements(level);

  const progressSinceLastLevel = Math.max(0, referralCount - reqsToGetCurrentLevel.referrals);
  const progressPercent = level >= 5 ? 100 : (progressSinceLastLevel / reqsForNextLevelGap.referrals) * 100;
  const nextLevelGoal = reqsToGetCurrentLevel.referrals + reqsForNextLevelGap.referrals;


  return (
    <Card className="shadow-xl">
        <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
            <Users className="mr-3 h-7 w-7 text-primary" />
            Refer a Friend
        </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
        <div className="p-4 bg-black/20 rounded-lg">
            <p className="text-sm text-card-foreground/70 mb-2">Your unique referral code:</p>
            <div className="flex justify-center items-center gap-4">
                <p className="text-2xl font-bold tracking-widest text-yellow-400">{referralCode}</p>
                <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                    <Copy className="h-5 w-5" />
                </Button>
            </div>
        </div>

        <div className="space-y-4">
            <Gift className="h-20 w-20 text-yellow-400 mx-auto animate-bobble" />
            <h3 className="text-xl font-semibold text-card-foreground">
                Invite friends to level up!
            </h3>
            <p className="text-card-foreground/80">
                Each level you gain increases your mining power permanently.
            </p>
        </div>
        
        <div className="space-y-2">
            <p className="text-sm text-card-foreground/70">
                Progress to next level: {progressSinceLastLevel} / {reqsForNextLevelGap.referrals}
            </p>
            <Progress value={progressPercent} className="w-full bg-black/30" indicatorClassName="bg-slate-300 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-wave bg-no-repeat bg-[length:200%_auto]" />
        </div>

        </CardContent>
        <CardFooter className="flex-col items-start pt-4 border-t border-white/10 mt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h3 className="text-sm font-medium text-card-foreground/70 mb-1">
                    Total Referrals
                </h3>
                <p className="text-2xl font-bold text-primary-foreground">{referralCount.toLocaleString()}</p>
            </div>
             <Button onClick={handleAddReferral} size="sm" variant="secondary" className="mt-2 sm:mt-0">
                <PlusCircle className="mr-2 h-4 w-4" />
                Simulate Invite
            </Button>
        </CardFooter>
    </Card>
  );
}
