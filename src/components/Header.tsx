
import type { FC } from 'react';
import Image from 'next/image';
import { Zap } from 'lucide-react'; // Changed from CircleDollarSign to Zap

interface HeaderProps {
  currentCoins: number;
}

const Header: FC<HeaderProps> = ({ currentCoins }) => {
  return (
    <header className="bg-white backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="App Logo" width={40} height={40} data-ai-hint="app logo" />
        </div>
        <div className="flex items-center space-x-2 bg-card text-card-foreground px-4 py-2 rounded-lg shadow-md">
          <Zap className="h-6 w-6 text-yellow-400" /> {/* Changed icon and class */}
          <span className="text-xl font-semibold">{currentCoins.toLocaleString()}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
