
"use client";

import type { FC } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Star } from 'lucide-react';
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
    <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <Trophy className="mr-3 h-7 w-7 text-primary" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <ScrollArea className="h-[220px] pr-3">
            <ul className="space-y-3">
              {sortedLeaderboard.map((user, index) => (
                <li
                  key={user.id}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200
                    ${user.isCurrentUser ? 'bg-black/40 ring-2 ring-primary' : 'bg-black/20 hover:bg-black/30'}`}
                >
                  <span className={`mr-4 font-bold w-6 text-center text-lg ${index === 0 ? 'text-yellow-400' : 'text-card-foreground/70'}`}>
                    {index + 1}
                  </span>
                  <Avatar className="h-10 w-10 mr-4 border-2 border-primary/50">
                    <AvatarImage src={`https://placehold.co/40x40/800080/FFFFFF/png?text=${getInitials(user.name)}&font=Inter`} alt={user.name} data-ai-hint="abstract avatar" />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <p className={`font-medium text-base ${user.isCurrentUser ? 'text-primary-foreground' : 'text-card-foreground'}`}>
                      {user.name}
                      {user.isCurrentUser && " (You)"}
                    </p>
                  </div>
                  <div className="flex items-center font-semibold text-lg text-yellow-400">
                    {user.score.toLocaleString()}
                    {index === 0 && <Star className="inline ml-1.5 h-4 w-4" fill="currentColor"/>}
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
