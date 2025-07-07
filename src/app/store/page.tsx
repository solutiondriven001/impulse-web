
'use client';

import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserStats } from '@/hooks/use-user-stats';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function StorePage() {
    const { currentCoins } = useUserStats();

    return (
        <div className="flex flex-col min-h-screen">
            <Header currentCoins={currentCoins} />
            <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex items-center justify-center">
                <Card className="w-full max-w-lg shadow-2xl text-center">
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline">Download Impulse</CardTitle>
                        <CardDescription>
                            Get the full experience on your mobile device.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6">
                        <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
                            <Image src="https://placehold.co/180x60.png" alt="Download on the App Store" width={180} height={60} className="rounded-md" data-ai-hint="app store"/>
                        </a>
                        <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
                            <Image src="https://placehold.co/180x60.png" alt="Get it on Google Play" width={180} height={60} className="rounded-md" data-ai-hint="google play"/>
                        </a>
                    </CardContent>
                    <CardContent>
                         <Link href="/" passHref>
                            <Button variant="ghost" className="text-card-foreground/70 hover:text-card-foreground">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
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
