
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useUserStats } from '@/hooks/use-user-stats';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Copy, Gift, UserPlus, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getLevelName } from '@/lib/levels';

const REFERRAL_COUNT_KEY = 'impulseAppReferralCount_v1';
const REFERRAL_CODE_KEY = 'impulseAppReferralCode_v1';
const GOAL = 5;

export default function ReferralsPage() {
  const { currentCoins, level, levelUp, isInitialized } = useUserStats();
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

  const handleInvite = () => {
    const newCount = referralCount + 1;
    setReferralCount(newCount);
    localStorage.setItem(REFERRAL_COUNT_KEY, newCount.toString());

    toast({
      title: "Friend Invited!",
      description: `You have successfully invited a friend. Progress: ${newCount % GOAL}/${GOAL}.`,
    });

    if (newCount > 0 && newCount % GOAL === 0) {
      const newLevel = level + 1;
      levelUp();
      toast({
        title: `Level Up to ${getLevelName(newLevel)}!`,
        description: `You've invited ${GOAL} friends and are now Level ${newLevel}. Your mining power has increased!`,
        variant: 'default',
      });
    }
  };
  
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

  if (!isInitialized) {
      return (
          <div className="flex flex-col min-h-screen">
              <Header currentCoins={0} />
              <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex items-center justify-center">
                  <div className="flex items-center space-x-2 text-foreground/80">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Loading user stats...</span>
                  </div>
              </main>
          </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentCoins={currentCoins} />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
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
                <Progress value={progress} className="w-full" />
            </div>

          </CardContent>
          <CardFooter>
            <Button
              onClick={handleInvite}
              className="w-full bg-white text-black hover:bg-gray-200 text-lg py-6 transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Simulate Friend Invitation
            </Button>
          </CardFooter>
        </Card>
      </main>
      <footer className="text-center p-4 text-sm text-foreground/70">
        © {new Date().getFullYear()} Impulse. All rights reserved.
      </footer>
    </div>
  );
}
