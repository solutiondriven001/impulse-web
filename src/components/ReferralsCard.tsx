
"use client";

import { useState, useEffect } from 'react';
import { useUserStats } from '@/hooks/use-user-stats';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Copy, Gift } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getLevelDetails } from '@/lib/levels';

const REFERRAL_COUNT_KEY = 'impulseAppReferralCount_v1';
const REFERRAL_CODE_KEY = 'impulseAppReferralCode_v1';
const GOAL = 5;

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

  const handleCopyCode = () => {
    if(navigator.clipboard) {
        navigator.clipboard.writeText(referralCode);
        toast({
          title: "Copied!",
          description: "Referral code copied to clipboard.",
        });
    }
  };

  const progress = (referralCount % GOAL) / GOAL * 100;

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
                Invite {GOAL} friends to level up!
            </h3>
            <p className="text-card-foreground/80">
                For every {GOAL} friends you invite, your mining power increases, and you level up permanently.
            </p>
        </div>
        
        <div className="space-y-2">
            <p className="text-sm text-card-foreground/70">
                Progress: {referralCount % GOAL} / {GOAL}
            </p>
            <Progress value={progress} className="w-full bg-black/30" indicatorClassName="bg-slate-300 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-wave bg-no-repeat bg-[length:200%_auto]" />
        </div>

        </CardContent>
        <CardFooter className="flex-col items-start pt-4 border-t border-white/10 mt-4">
            <h3 className="text-sm font-medium text-card-foreground/70 mb-1">
                Total Organic Referrals
            </h3>
            <p className="text-2xl font-bold text-primary-foreground">{referralCount.toLocaleString()}</p>
        </CardFooter>
    </Card>
  );
}
