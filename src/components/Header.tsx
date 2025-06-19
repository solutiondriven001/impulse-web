import type { FC } from 'react';
import { Star, Sparkles } from 'lucide-react'; // Changed Coins to Star

interface HeaderProps {
  currentPoints: number; // Changed currentCoins to currentPoints
}

const Header: FC<HeaderProps> = ({ currentPoints }) => {
  return (
    <header className="bg-primary/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-10 w-10 text-primary-foreground animate-pulse-lg" />
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary-foreground">
            Impulse
          </h1>
        </div>
        <div className="flex items-center space-x-2 bg-card text-card-foreground px-4 py-2 rounded-lg shadow-md">
          <Star className="h-6 w-6 text-yellow-400" /> {/* Changed Coins to Star */}
          <span className="text-xl font-semibold">{currentPoints.toLocaleString()}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
