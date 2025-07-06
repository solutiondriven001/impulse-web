"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { EarningsChart, type ChartData } from '@/components/EarningsChart';
import { getDailyEarnings } from '@/lib/earnings';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { subDays, format } from 'date-fns';
import { useUserStats } from '@/hooks/use-user-stats';
import ReferralsCard from '@/components/ReferralsCard';
import LevelsCard from '@/components/LevelsCard';

export default function EarningsPage() {
  const { currentCoins, isInitialized } = useUserStats();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateChartData = () => {
    setIsLoading(true);
    const earnings = getDailyEarnings();
    const earningsMap = new Map(earnings.map(e => [e.date, e]));
    const data: ChartData[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const dateString = format(date, 'yyyy-MM-dd');
      const dayData = earningsMap.get(dateString);

      data.push({
        date: dateString,
        name: format(date, 'd MMM'),
        shortName: format(date, 'd'),
        monthName: format(date, 'MMM'),
        total: dayData?.total ?? 0,
        mining: dayData?.mining ?? 0,
        ads: dayData?.ads ?? 0,
        tasks: dayData?.tasks ?? 0,
      });
    }
    setChartData(data);
    setIsLoading(false);
  };
  
  // Load data on mount
  useEffect(() => {
    if (isInitialized) {
      generateChartData();
    }
  }, [isInitialized]);

  const handleRefresh = () => {
    generateChartData();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentCoins={currentCoins} />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <LevelsCard />
        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center text-2xl font-headline">
              <LineChart className="mr-3 h-7 w-7 text-primary" />
              Earnings Statistics
            </CardTitle>
            <Button variant="ghost" onClick={handleRefresh} className="text-primary hover:bg-primary/10">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading || !isInitialized ? (
              <div className="h-[350px] w-full flex items-center justify-center text-card-foreground/80 space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p>Loading chart data...</p>
              </div>
            ) : chartData.every(d => d.total === 0) ? (
              <div className="h-[350px] w-full flex flex-col items-center justify-center text-center text-card-foreground/80 space-y-2">
                 <LineChart className="h-12 w-12 text-primary/50" />
                <h3 className="text-lg font-semibold text-card-foreground">No Earnings Yet</h3>
                <p>Start earning coins on the main page to see your statistics here.</p>
              </div>
            ) : (
              <EarningsChart data={chartData} />
            )}
          </CardContent>
        </Card>
        <ReferralsCard />
      </main>
      <footer className="text-center p-4 text-sm text-foreground/70">
        © {new Date().getFullYear()} Impulse. All rights reserved.
      </footer>
    </div>
  );
}
