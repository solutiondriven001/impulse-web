'use client';

import type { ElementType } from 'react';
import { Leaf, Sparkles, Gem, Crown, Trophy, type LucideProps } from 'lucide-react';

export interface LevelDetails {
    name: string;
    icon: ElementType<LucideProps>;
}

export interface LevelUpRequirements {
  referrals: number;
  ads: number;
}


/**
 * Returns the name and icon for a given user level.
 * @param level The user's current level.
 * @returns The details of the level.
 */
export function getLevelDetails(level: number): LevelDetails {
  const details: { [key: number]: LevelDetails } = {
    1: { name: 'Novice', icon: Leaf },
    2: { name: 'Apprentice', icon: Sparkles },
    3: { name: 'Miner', icon: Gem },
    4: { name: 'Expert', icon: Crown },
    5: { name: 'Master', icon: Trophy },
  };

  // Handle levels above 5, returning the highest tier details
  if (level >= 5) {
    return details[5];
  }
  
  if (details[level]) {
    return details[level];
  }

  return details[1]; // Default for level 0 or less
}

/**
 * Returns the requirements to advance FROM a given level.
 * @param currentLevel The user's current level.
 * @returns The requirements to get to the next level.
 */
export function getLevelUpRequirements(currentLevel: number): LevelUpRequirements {
  const baseReferrals = 5;
  const baseAds = 20;

  return {
    referrals: currentLevel * baseReferrals,
    ads: currentLevel * baseAds,
  };
}

/**
 * Returns the CUMULATIVE requirements to reach a target level from level 1.
 * @param targetLevel The level to calculate total requirements for.
 * @returns The total requirements to reach that level.
 */
export function getTotalRequirementsForLevel(targetLevel: number): LevelUpRequirements {
  let totalReferrals = 0;
  let totalAds = 0;
  // Sum requirements for all levels *before* the target level
  for (let i = 1; i < targetLevel; i++) {
    const reqs = getLevelUpRequirements(i);
    totalReferrals += reqs.referrals;
    totalAds += reqs.ads;
  }
  return { referrals: totalReferrals, ads: totalAds };
}
