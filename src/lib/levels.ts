
'use client';

import type { ElementType } from 'react';
import { Shield, Award, Gem, Crown, Diamond, type LucideProps } from 'lucide-react';

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
    1: { name: 'Iron', icon: Shield },
    2: { name: 'Bronze', icon: Award },
    3: { name: 'Silver', icon: Gem },
    4: { name: 'Gold', icon: Crown },
    5: { name: 'Platinum', icon: Diamond },
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
