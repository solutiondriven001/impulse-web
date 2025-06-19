export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number; // Represents points
  avatarSeed: string; 
  isCurrentUser?: boolean;
}

export interface Task {
  id: string;
  description: string;
  reward: number; // Represents points
  completed: boolean;
}
