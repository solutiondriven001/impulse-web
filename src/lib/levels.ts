
'use client';

/**
 * Returns the name for a given user level.
 * @param level The user's current level.
 * @returns The name of the level.
 */
export function getLevelName(level: number): string {
  const names: { [key: number]: string } = {
    1: 'Novice',
    2: 'Apprentice',
    3: 'Miner',
    4: 'Expert',
    5: 'Master',
  };

  if (level >= 5) {
    return names[5];
  }
  
  if (names[level]) {
    return names[level];
  }

  return 'Novice'; // Default for level 0 or less
}
