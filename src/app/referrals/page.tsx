
'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function ReferralsMovedPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header currentCoins={0} />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <Card className="shadow-xl text-center">
          <CardHeader>
            <CardTitle>Page Moved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground/80">
              The referrals section has been moved to the Earnings page.
            </p>
            <Link href="/earnings" passHref>
              <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                <ArrowLeft className="mr-2 h-4 w-4" /> Go to Earnings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
      <footer className="text-center p-4 text-sm text-foreground/70">
        © {new Date().getFullYear()} Impulse. All rights reserved.
      </footer>
    </div>
  );
}
