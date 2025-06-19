export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  avatarSeed: string; // Seed for placeholder avatar
  isCurrentUser?: boolean;
}

export interface Task {
  id: string;
  description: string;
  reward: number;
  completed: boolean;
}
