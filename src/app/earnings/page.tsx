
"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { EarningsChart, type ChartData } from '@/components/EarningsChart';
import { getDailyEarnings } from '@/lib/earnings';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { subDays, format } from 'date-fns';

const USER_COINS_KEY = 'impulseAppUserCoins_v1';

export default function EarningsPage() {
  const [currentCoins, setCurrentCoins] = useState(0);
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
    if (typeof window !== 'undefined') {
      const savedCoins = localStorage.getItem(USER_COINS_KEY);
      if (savedCoins !== null) {
        setCurrentCoins(parseInt(savedCoins, 10));
      }
      generateChartData();
    }
  }, []);

  const handleRefresh = () => {
    generateChartData();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentCoins={currentCoins} />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
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
            {isLoading ? (
              <div className="h-[350px] w-full flex items-center justify-center">
                <p>Loading chart data...</p>
              </div>
            ) : (
              <EarningsChart data={chartData} />
            )}
          </CardContent>
        </Card>
      </main>
      <footer className="text-center p-4 text-sm text-foreground/70">
        © {new Date().getFullYear()} Impulse. All rights reserved.
      </footer>
    </div>
  );
}
