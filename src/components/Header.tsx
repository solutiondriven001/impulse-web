
"use client";

import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Zap } from 'lucide-react';

interface HeaderProps {
  currentCoins: number;
}

const NUMBER_ANIMATION_DURATION = 500; // ms for number counting
const REVEAL_ANIMATION_DURATION = 500; // ms for the reveal effect

const Header: FC<HeaderProps> = ({ currentCoins }) => {
  const [displayedCoins, setDisplayedCoins] = useState(currentCoins);
  const [isRevealingChange, setIsRevealingChange] = useState(false);
  const previousCoinsRef = useRef<number>(currentCoins);
  const animationFrameRef = useRef<number>();
  const revealTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const startValue = previousCoinsRef.current;
    const endValue = currentCoins;

    if (startValue === endValue) {
      setDisplayedCoins(endValue);
      return;
    }

    setIsRevealingChange(true);
    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
    }
    revealTimeoutRef.current = setTimeout(() => {
      setIsRevealingChange(false);
    }, REVEAL_ANIMATION_DURATION);

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
        setDisplayedCoins(endValue); 
        previousCoinsRef.current = endValue; 
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animateCoins);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
      }
      setDisplayedCoins(endValue); 
      previousCoinsRef.current = endValue;
    };
  }, [currentCoins]);


  return (
    <header className="bg-white backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="App Logo" width={40} height={40} data-ai-hint="app logo" />
        </div>
        <div className="flex items-center space-x-2 bg-card text-card-foreground px-4 py-2 rounded-lg shadow-md">
          <Zap className="h-6 w-6 text-yellow-400" />
          <span 
            className={`text-xl font-semibold min-w-[3ch] text-right ${isRevealingChange ? 'animate-reveal-down' : ''}`}
          >
            {displayedCoins.toLocaleString()}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
