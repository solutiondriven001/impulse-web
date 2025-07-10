
'use client';

import Header from '@/components/Header';
import { useUserStats } from '@/hooks/use-user-stats';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, Phone, Youtube, Send, Instagram, Facebook } from 'lucide-react';

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
    </svg>
);

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);

export default function ContactPage() {
    const { currentCoins } = useUserStats();

    const socialLinks = [
        { name: 'YouTube', href: 'https://www.youtube.com/@ImpulseApp', icon: Youtube },
        { name: 'X (Twitter)', href: 'https://x.com', icon: XIcon },
        { name: 'Telegram', href: 'https://telegram.org', icon: Send },
        { name: 'Instagram', href: 'https://instagram.com', icon: Instagram },
        { name: 'Facebook', href: 'https://facebook.com', icon: Facebook },
        { name: 'WhatsApp', href: 'https://whatsapp.com', icon: WhatsAppIcon },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header currentCoins={currentCoins} />
            <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col items-center">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold font-headline text-foreground">Contact Us</h1>
                    <p className="text-foreground/70 mt-2 max-w-2xl mx-auto">Have questions or need support? We're here to help.</p>
                </div>

                <Card className="w-full max-w-2xl shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline">Get in Touch</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <h3 className="font-semibold text-card-foreground/80">Direct Contact</h3>
                            <a href="mailto:support@impulseapp.com" className="flex items-center p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors">
                                <Mail className="h-5 w-5 mr-4 text-primary" />
                                <span className="text-card-foreground">support@impulseapp.com</span>
                            </a>
                            <a href="tel:+1234567890" className="flex items-center p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors">
                                <Phone className="h-5 w-5 mr-4 text-primary" />
                                <span className="text-card-foreground">+1 (234) 567-890</span>
                            </a>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-card-foreground/80">Follow Us</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
                                    >
                                        <link.icon />
                                        <span className="ml-3 text-card-foreground">{link.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

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
