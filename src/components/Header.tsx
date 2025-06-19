
import type { FC } from 'react';
import Image from 'next/image';
import { CircleDollarSign } from 'lucide-react';

interface HeaderProps {
  currentCoins: number;
}

const Header: FC<HeaderProps> = ({ currentCoins }) => {
  return (
    <header className="bg-white backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Impulse Logo" width={40} height={40} data-ai-hint="logo company" />
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
            Impulse
          </h1>
        </div>
        <div className="flex items-center space-x-2 bg-card text-card-foreground px-4 py-2 rounded-lg shadow-md">
          <CircleDollarSign className="h-6 w-6 text-yellow-400" />
          <span className="text-xl font-semibold">{currentCoins.toLocaleString()}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
