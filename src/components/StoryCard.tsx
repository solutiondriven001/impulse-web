
"use client";

import type { FC } from 'react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookMarked, Bot, Loader2, Sparkles, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { continueStory, type StoryHistory } from '@/ai/flows/story-flow';
import { Skeleton } from '@/components/ui/skeleton';

interface StoryCardProps {
  level: number;
  currentCoins: number;
  onSpendCoins: (amount: number) => void;
}

const STORY_START_COST = 5;
const STORY_CONTINUE_COST = 2;

const THEMES = [
    { key: "sci-fi", name: "Sci-Fi Adventure" },
    { key: "treasure-hunt", name: "Treasure Hunt" },
    { key: "mastery-quest", name: "Quest for Mastery" },
];

const StoryCard: FC<StoryCardProps> = ({ level, currentCoins, onSpendCoins }) => {
  const [theme, setTheme] = useState<string | null>(null);
  const [history, setHistory] = useState<StoryHistory[]>([]);
  const [currentPart, setCurrentPart] = useState<string | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStartSaga = async (selectedTheme: string) => {
    if (currentCoins < STORY_START_COST) {
      toast({ title: "Not enough coins!", description: `You need ${STORY_START_COST} coins to start a new saga.`, variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    onSpendCoins(-STORY_START_COST);
    
    try {
      const result = await continueStory({ level, theme: selectedTheme, history: [] });
      setCurrentPart(result.storyPart);
      setChoices(result.choices);
      setTheme(selectedTheme);
      setHistory([]);
      setIsStarted(true);
    } catch (error) {
      console.error("Failed to start story:", error);
      toast({ title: "AI Error", description: "The storyteller is resting. Please try again later.", variant: "destructive" });
      onSpendCoins(STORY_START_COST); // Refund
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeChoice = async (choice: string) => {
    if (currentCoins < STORY_CONTINUE_COST) {
        toast({ title: "Not enough coins!", description: `You need ${STORY_CONTINUE_COST} coins to continue the story.`, variant: "destructive" });
        return;
    }

    setIsLoading(true);
    onSpendCoins(-STORY_CONTINUE_COST);
    
    const newHistory: StoryHistory[] = [...history, { part: currentPart!, choice }];
    setHistory(newHistory);

    try {
        const result = await continueStory({ level, theme: theme!, history: newHistory });
        setCurrentPart(result.storyPart);
        setChoices(result.choices);
    } catch (error) {
        console.error("Failed to continue story:", error);
        toast({ title: "AI Error", description: "The storyteller got lost. Please try again.", variant: "destructive" });
        onSpendCoins(STORY_CONTINUE_COST); // Refund
    } finally {
        setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsStarted(false);
    setTheme(null);
    setCurrentPart(null);
    setChoices([]);
    setHistory([]);
  };

  return (
    <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <BookMarked className="mr-3 h-7 w-7 text-primary" />
          Your Impulse Saga
        </CardTitle>
      </CardHeader>
      
      {!isStarted ? (
        <CardContent className="flex-grow flex flex-col justify-center items-center text-center space-y-4">
            <Sparkles className="h-16 w-16 text-primary animate-pulse" />
            <p className="text-lg text-card-foreground/80">
              Spend <span className="font-bold text-yellow-400">{STORY_START_COST}</span> coins to begin a unique, AI-powered adventure!
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
                {THEMES.map(t => (
                    <Button key={t.key} onClick={() => handleStartSaga(t.name)} disabled={isLoading} variant="secondary">
                         {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t.name}
                    </Button>
                ))}
            </div>
        </CardContent>
      ) : (
        <>
            <CardContent className="flex-grow space-y-4">
                <div className="flex items-center text-sm text-primary">
                    <Bot className="h-4 w-4 mr-2" />
                    <p>The Storyteller narrates...</p>
                </div>
                {isLoading && !currentPart ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                ) : (
                    <p className="text-card-foreground/90 leading-relaxed min-h-[72px] animate-fade-in-slow">
                        {currentPart}
                    </p>
                )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
                 {choices.map((choice, index) => (
                    <Button 
                        key={index} 
                        onClick={() => handleMakeChoice(choice)} 
                        disabled={isLoading}
                        className="w-full bg-white/10 text-white/90 hover:bg-white/20 relative"
                    >
                        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {choice}
                        <div className="absolute top-1 right-2 flex items-center gap-1 text-xs text-yellow-400/80">
                           <span>{STORY_CONTINUE_COST}</span> <Zap className="h-3 w-3" />
                        </div>
                    </Button>
                ))}
            </CardFooter>
             <div className="px-6 pb-4">
                <Button variant="link" onClick={handleReset} disabled={isLoading} className="text-card-foreground/50 h-auto p-0">
                    Start a new Saga
                </Button>
            </div>
        </>
      )}
    </Card>
  );
};

export default StoryCard;
