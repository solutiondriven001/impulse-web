
'use client';

import type { ElementType } from 'react';
import { Leaf, Sparkles, Pickaxe, Crown, Trophy, type LucideProps } from 'lucide-react';

export interface LevelDetails {
    name: string;
    icon: ElementType<LucideProps>;
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
    3: { name: 'Miner', icon: Pickaxe },
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
