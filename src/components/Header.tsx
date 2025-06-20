
"use client";

import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Zap } from 'lucide-react';

interface HeaderProps {
  currentCoins: number;
}

const ANIMATION_DURATION = 500; // ms

const Header: FC<HeaderProps> = ({ currentCoins }) => {
  const [displayedCoins, setDisplayedCoins] = useState(currentCoins);
  const previousCoinsRef = useRef<number>(currentCoins);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const startValue = previousCoinsRef.current;
    const endValue = currentCoins;

    if (startValue === endValue) {
      setDisplayedCoins(endValue); // Ensure display is accurate if no change
      return;
    }

    let startTime: number | null = null;

    const animateCoins = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / ANIMATION_DURATION, 1);
      const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
      
      setDisplayedCoins(currentValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateCoins);
      } else {
        setDisplayedCoins(endValue); // Ensure final value is exact
        previousCoinsRef.current = endValue;
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animateCoins);

    // Update ref immediately for next potential change during an ongoing animation
    // Or at the end of animation for subsequent changes
    // previousCoinsRef.current = endValue; // This was moved to the end of animation

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // On unmount or if currentCoins changes before animation finishes,
      // set displayedCoins to the target to avoid intermediate state if re-rendered quickly.
      // And update the ref.
      setDisplayedCoins(endValue);
      previousCoinsRef.current = endValue;
    };
  }, [currentCoins]);

  // Initialize displayedCoins and previousCoinsRef if currentCoins is 0 initially or changes to 0
  useEffect(() => {
    if (currentCoins === 0) {
      setDisplayedCoins(0);
      previousCoinsRef.current = 0;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [currentCoins]);


  return (
    <header className="bg-white backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="App Logo" width={40} height={40} data-ai-hint="app logo" />
        </div>
        <div className="flex items-center space-x-2 bg-card text-card-foreground px-4 py-2 rounded-lg shadow-md">
          <Zap className="h-6 w-6 text-yellow-400" />
          <span className="text-xl font-semibold min-w-[3ch] text-right">
            {displayedCoins.toLocaleString()}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
