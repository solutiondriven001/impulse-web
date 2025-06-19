"use client";

import type { FC } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Users, Star, TrendingUp } from 'lucide-react';
import type { LeaderboardEntry } from '@/types';

interface LeaderboardCardProps {
  leaderboardData: LeaderboardEntry[];
  currentUserName?: string;
}

const getInitials = (name: string) => {
  const names = name.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

const LeaderboardCard: FC<LeaderboardCardProps> = ({ leaderboardData, currentUserName }) => {
  const sortedLeaderboard = [...leaderboardData].sort((a, b) => b.score - a.score);

  return (
    <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <Trophy className="mr-3 h-7 w-7 text-primary" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {sortedLeaderboard.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Users className="h-12 w-12 mb-2" />
            <p>Leaderboard is currently empty.</p>
            <p>Start mining to get on the board!</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-3">
            <ul className="space-y-3">
              {sortedLeaderboard.map((user, index) => (
                <li
                  key={user.id}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200
                    ${user.name === currentUserName ? 'bg-primary/20 ring-2 ring-primary' : 'bg-card-foreground/5 hover:bg-card-foreground/10'}`}
                >
                  <span className={`mr-3 font-bold w-6 text-center ${
                    index === 0 ? 'text-yellow-400' : 
                    index === 1 ? 'text-slate-400' :
                    index === 2 ? 'text-orange-400' : 'text-card-foreground/70'
                  }`}>
                    {index + 1}
                    {index < 3 && <Star className="inline ml-0.5 h-3 w-3 mb-1" fill="currentColor"/>}
                  </span>
                  <Avatar className="h-9 w-9 mr-3 border-2 border-primary/50">
                    <AvatarImage src={`https://placehold.co/40x40/800080/FFFFFF/png?text=${getInitials(user.name)}&font=Inter`} alt={user.name} data-ai-hint="abstract avatar" />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <p className={`font-medium text-sm ${user.name === currentUserName ? 'text-primary' : 'text-card-foreground'}`}>
                      {user.name}
                      {user.name === currentUserName && " (You)"}
                    </p>
                  </div>
                  <div className="flex items-center font-semibold text-sm text-yellow-500">
                    <TrendingUp className="h-4 w-4 mr-1 text-green-500"/>
                    {user.score.toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
