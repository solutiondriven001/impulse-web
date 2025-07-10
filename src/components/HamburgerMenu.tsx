
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu, Store, Mail, LogOut, LineChart } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export function HamburgerMenu() {
    const router = useRouter();
    const { toast } = useToast();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast({ title: "Logged Out", description: "You have been successfully logged out." });
            router.push('/login');
        } catch (error) {
            toast({ variant: 'destructive', title: "Logout Failed", description: "Could not log you out. Please try again." });
        }
    };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2 text-foreground/80 hover:bg-primary/10 hover:text-primary">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-card text-card-foreground flex flex-col p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="text-2xl text-left text-primary-foreground">
            <Link href="/">Dashboard</Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col h-full py-4">
            <div className="px-4 space-y-1">
                <Link href="/progress">
                    <Button variant="ghost" className="w-full justify-start text-lg h-14 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10">
                        <LineChart className="mr-4 h-5 w-5" />
                        PROGRESS
                    </Button>
                </Link>
                <Link href="/store">
                    <Button variant="ghost" className="w-full justify-start text-lg h-14 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10">
                        <Store className="mr-4 h-5 w-5" />
                        STORE
                    </Button>
                </Link>
                <Link href="/contact">
                    <Button variant="ghost" className="w-full justify-start text-lg h-14 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10">
                        <Mail className="mr-4 h-5 w-5" />
                        CONTACT
                    </Button>
                </Link>
            </div>
            <div className="mt-auto px-4">
                <Separator className="my-4 bg-card-foreground/20" />
                <Button variant="ghost" className="w-full justify-start text-lg h-14 text-card-foreground/50 hover:text-card-foreground hover:bg-white/10" onClick={handleLogout}>
                    <LogOut className="mr-4 h-5 w-5" />
                    Log out
                </Button>
            </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
