'use client';

import Header from '@/components/Header';
import { useUserStats } from '@/hooks/use-user-stats';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

export default function StorePage() {
    const { currentCoins } = useUserStats();

    return (
        <div className="flex flex-col min-h-screen">
            <Header currentCoins={currentCoins} />
            <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">

                 <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold font-headline text-foreground">The Impulse Store</h1>
                    <p className="text-foreground/70 mt-2 max-w-2xl mx-auto">Enhance your Impulse experience. Download our official applications to stay connected and boost your earnings on the go.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">

                    {/* App Store Card */}
                    <Card className="flex flex-col transition-all duration-300 hover:border-primary/50 hover:shadow-2xl overflow-hidden p-0">
                        <div className="relative h-48 w-full bg-gradient-to-br from-background to-black/20 flex items-center justify-center p-4">
                           <div className="absolute top-3 left-3 bg-primary/20 text-primary font-bold text-xs py-1 px-3 rounded-full">
                                Official App
                           </div>
                           <Image src="https://placehold.co/300x200.png" alt="Impulse on iOS" width={300} height={200} className="z-10 object-contain drop-shadow-lg" data-ai-hint="iphone screen" />
                        </div>
                        <CardContent className="p-5 flex-grow flex flex-col">
                            <h2 className="text-2xl font-bold text-card-foreground">Impulse iOS App</h2>
                            <p className="text-sm text-card-foreground/70 mt-2 flex-grow">Get the official Impulse app for your iPhone and iPad. Track your progress and manage your earnings seamlessly.</p>
                            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer" className="mt-6 w-full">
                                <Button className="w-full text-lg py-6 bg-accent text-accent-foreground hover:bg-accent/90">
                                    <Download className="mr-2 h-5 w-5"/>
                                    Download
                                </Button>
                            </a>
                        </CardContent>
                    </Card>

                    {/* Play Store Card */}
                     <Card className="flex flex-col transition-all duration-300 hover:border-primary/50 hover:shadow-2xl overflow-hidden p-0">
                        <div className="relative h-48 w-full bg-gradient-to-br from-background to-black/20 flex items-center justify-center p-4">
                            <div className="absolute top-3 left-3 bg-primary/20 text-primary font-bold text-xs py-1 px-3 rounded-full">
                                Highest Uptime
                           </div>
                           <Image src="https://placehold.co/300x200.png" alt="Impulse on Android" width={300} height={200} className="z-10 object-contain drop-shadow-lg" data-ai-hint="android screen"/>
                        </div>
                        <CardContent className="p-5 flex-grow flex flex-col">
                            <h2 className="text-2xl font-bold text-card-foreground">Impulse Android App</h2>
                             <p className="text-sm text-card-foreground/70 mt-2 flex-grow">The complete Impulse experience, optimized for your Android device. Never miss a beat.</p>
                            <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="mt-6 w-full">
                                <Button className="w-full text-lg py-6 bg-accent text-accent-foreground hover:bg-accent/90">
                                    <Download className="mr-2 h-5 w-5"/>
                                    Download
                                </Button>
                            </a>
                        </CardContent>
                    </Card>

                </div>

                 <div className="text-center mt-12">
                     <Link href="/" passHref>
                        <Button variant="ghost" className="text-foreground/70 hover:text-foreground">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </main>
             <footer className="text-center p-4 text-sm text-foreground/70">
                © {new Date().getFullYear()} Impulse. All rights reserved.
            </footer>
        </div>
    );
}
