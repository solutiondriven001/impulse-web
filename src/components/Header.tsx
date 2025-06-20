
"use client";

import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Zap } from 'lucide-react';

interface HeaderProps {
  currentCoins: number;
}

const NUMBER_ANIMATION_DURATION = 500; // ms for number counting
const POP_ANIMATION_DURATION = 300; // ms for the pop effect, should match tailwind.config.ts

const Header: FC<HeaderProps> = ({ currentCoins }) => {
  const [displayedCoins, setDisplayedCoins] = useState(currentCoins);
  const [isPopping, setIsPopping] = useState(false);
  const previousCoinsRef = useRef<number>(currentCoins);
  const animationFrameRef = useRef<number>();
  const popTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const startValue = previousCoinsRef.current;
    const endValue = currentCoins;

    if (startValue === endValue) {
      // If values are same, ensure displayedCoins is correct, but don't re-animate
      // This handles initial render or cases where prop updates but value is same
      setDisplayedCoins(endValue);
      return;
    }

    // Trigger pop animation if the value actually changed
    setIsPopping(true);
    if (popTimeoutRef.current) {
      clearTimeout(popTimeoutRef.current);
    }
    popTimeoutRef.current = setTimeout(() => {
      setIsPopping(false);
    }, POP_ANIMATION_DURATION);

    let startTime: number | null = null;

    const animateCoins = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / NUMBER_ANIMATION_DURATION, 1);
      const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
      
      setDisplayedCoins(currentValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateCoins);
      } else {
        setDisplayedCoins(endValue); // Ensure final value is exact
        previousCoinsRef.current = endValue; // Update ref for next change after animation completes
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animateCoins);

    // This is important: update previousCoinsRef immediately for the *next* potential
    // useEffect run if currentCoins changes again *before* this animation cycle finishes.
    // However, for the current animation cycle's `startValue`, we use the value captured at the beginning of this effect.
    // The line `previousCoinsRef.current = endValue;` at the end of `animateCoins` is for when this cycle fully completes.
    // If the prop changes mid-animation, this effect re-runs, `startValue` gets the *last completed* or *initial* ref value.
    // This is generally okay. If very rapid updates are needed, `previousCoinsRef.current` could be set to `endValue` here too.
    // For now, existing logic should be fine.

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (popTimeoutRef.current) {
        clearTimeout(popTimeoutRef.current);
      }
      // On unmount or if currentCoins changes again before animation finishes,
      // ensure displayedCoins is set to the current target and ref is updated.
      setDisplayedCoins(endValue); 
      previousCoinsRef.current = endValue;
    };
  }, [currentCoins]);


  return (
    <header className="bg-white backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="App Logo" width={40} height={40} data-ai-hint="app logo" />
        </div>
        <div className="flex items-center space-x-2 bg-card text-card-foreground px-4 py-2 rounded-lg shadow-md">
          <Zap className="h-6 w-6 text-yellow-400" />
          <span 
            className={`text-xl font-semibold min-w-[3ch] text-right ${isPopping ? 'animate-pop-in-out' : ''}`}
          >
            {displayedCoins.toLocaleString()}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
