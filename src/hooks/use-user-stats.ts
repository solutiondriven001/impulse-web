
'use client';

import { useState, useEffect, useCallback } from 'react';

const USER_COINS_KEY = 'impulseAppUserCoins_v1';
const USER_LEVEL_KEY = 'impulseAppUserLevel_v1';

export const useUserStats = () => {
  const [currentCoins, setCurrentCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCoins = localStorage.getItem(USER_COINS_KEY);
      const savedLevel = localStorage.getItem(USER_LEVEL_KEY);

      if (savedCoins !== null) {
        setCurrentCoins(parseInt(savedCoins, 10));
      }
      if (savedLevel !== null) {
        setLevel(parseInt(savedLevel, 10));
      }
      setIsInitialized(true);
    }
  }, []);

  const updateCoins = useCallback((newCoins: number | ((prevCoins: number) => number)) => {
    if (typeof newCoins === 'function') {
      setCurrentCoins(prevCoins => {
        const result = newCoins(prevCoins);
        localStorage.setItem(USER_COINS_KEY, result.toString());
        return result;
      });
    } else {
      setCurrentCoins(newCoins);
      localStorage.setItem(USER_COINS_KEY, newCoins.toString());
    }
  }, []);

  const levelUp = useCallback(() => {
    setLevel(prevLevel => {
      const newLevel = prevLevel + 1;
      localStorage.setItem(USER_LEVEL_KEY, newLevel.toString());
      return newLevel;
    });
  }, []);

  return {
    currentCoins,
    level,
    updateCoins,
    levelUp,
    isInitialized,
  };
};
