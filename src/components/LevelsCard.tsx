
'use client';

import type { FC } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trophy, ArrowRight } from 'lucide-react';
import { getLevelDetails, type LevelDetails } from '@/lib/levels';
import { cn } from '@/lib/utils';
import { useUserStats } from '@/hooks/use-user-stats';

const LEVEL_REQUIREMENTS = {
  referrals: 5,
  ads: 20,
};

const LevelNode: FC<{ details: LevelDetails, level: number, isUnlocked: boolean, isCurrent: boolean }> = ({ details, level, isUnlocked, isCurrent }) => {
  const Icon = details.icon;
  return (
    <div className="flex flex-col items-center text-center gap-2 flex-shrink-0 w-32">
      <div
        className={cn(
          "relative flex items-center justify-center h-20 w-20 rounded-full border-4 transition-all duration-300",
          isCurrent ? "bg-primary border-primary-foreground shadow-lg scale-110 ring-4 ring-primary/50" : isUnlocked ? "bg-primary/80 border-primary" : "bg-black/20 border-border"
        )}
      >
        <Icon className={cn("h-10 w-10", isUnlocked ? "text-primary-foreground" : "text-card-foreground/50")} />
         {isCurrent && <div className="absolute -top-1 -right-1 w-4 h-4 bg-background rounded-full flex items-center justify-center"><div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" /></div>}
      </div>
      <div className={cn("px-2 py-0.5 text-sm font-semibold rounded-md", isUnlocked ? "bg-primary text-primary-foreground" : "bg-card-foreground/20 text-card-foreground/70")}>
        Lvl {level}
      </div>
      <p className={cn("text-base font-bold", isUnlocked ? "text-primary-foreground" : "text-card-foreground/70")}>{details.name}</p>
    </div>
  );
};

const RequirementNode: FC = () => (
  <div className="flex flex-col items-center text-center text-sm text-card-foreground/80 px-4 flex-shrink-0 w-40">
    <ArrowRight className="h-8 w-8 text-primary mb-2" />
    <p><span className="font-bold">{LEVEL_REQUIREMENTS.referrals}</span> Referrals</p>
    <p className="text-card-foreground/60">or</p>
    <p><span className="font-bold">{LEVEL_REQUIREMENTS.ads}</span> Ads</p>
  </div>
);

const LevelsCard: FC = () => {
  const { level: currentUserLevel } = useUserStats();
  const maxLevel = 5;
  const levels = Array.from({ length: maxLevel }, (_, i) => ({ details: getLevelDetails(i + 1), level: i + 1 }));

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <Trophy className="mr-3 h-7 w-7 text-primary" />
          Level Tiers
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto pb-4">
          <div className="flex items-center p-4 min-w-[1000px] justify-center">
             {levels.map(({ details, level }, index) => (
                 <div key={level} className="flex items-center">
                    <LevelNode 
                        details={details}
                        level={level}
                        isUnlocked={level <= currentUserLevel}
                        isCurrent={level === currentUserLevel}
                    />
                    {index < levels.length - 1 && <RequirementNode />}
                 </div>
             ))}
          </div>
      </CardContent>
    </Card>
  );
};

export default LevelsCard;
