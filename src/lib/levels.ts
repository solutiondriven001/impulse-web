
'use client';

import type { ElementType } from 'react';
import { Feather, Award, Pickaxe, Gem, Crown, type LucideProps } from 'lucide-react';

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
    1: { name: 'Novice', icon: Feather },
    2: { name: 'Apprentice', icon: Award },
    3: { name: 'Miner', icon: Pickaxe },
    4: { name: 'Expert', icon: Gem },
    5: { name: 'Master', icon: Crown },
  };

  if (level >= 5) {
    return details[5];
  }
  
  if (details[level]) {
    return details[level];
  }

  return details[1]; // Default for level 0 or less
}
