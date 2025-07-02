
'use client';

import type { DailyEarning } from '@/types';

const EARNINGS_KEY = 'impulseAppDailyEarnings_v1';

// Function to get the date in YYYY-MM-DD format
function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

// Get all daily earnings from localStorage
export function getDailyEarnings(): DailyEarning[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const storedEarnings = localStorage.getItem(EARNINGS_KEY);
  if (storedEarnings) {
    try {
      const parsed = JSON.parse(storedEarnings);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to parse daily earnings from localStorage", e);
      return [];
    }
  }
  return [];
}

// Add an earning to today's stats
export function addDailyEarning(
  source: 'mining' | 'ads' | 'tasks',
  amount: number
): void {
  if (typeof window === 'undefined' || amount === 0) return;

  const todayStr = getTodayDateString();
  const allEarnings = getDailyEarnings();
  let todayEarning = allEarnings.find(e => e.date === todayStr);

  if (todayEarning) {
    // Update existing entry
    todayEarning[source] = (todayEarning[source] || 0) + amount;
    todayEarning.total = (todayEarning.total || 0) + amount;
  } else {
    // Create new entry for today
    todayEarning = {
      date: todayStr,
      mining: 0,
      ads: 0,
      tasks: 0,
      total: 0,
    };
    todayEarning[source] = amount;
    todayEarning.total = amount;
    allEarnings.push(todayEarning);
  }

  // Sort by date just in case
  allEarnings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  localStorage.setItem(EARNINGS_KEY, JSON.stringify(allEarnings));
}
