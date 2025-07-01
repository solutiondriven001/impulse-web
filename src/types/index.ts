
export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number; // Represents coins
  avatarSeed: string; 
  isCurrentUser?: boolean;
}

export interface Task {
  id: string;
  description: string;
  reward: number; // Represents coins
  completed: boolean;
  link?: string;
  requiresUpload?: boolean;
  requiresTextInput?: boolean;
}

export interface ParentTask {
    id: string;
    title: string;
    description: string;
    bonusReward: number;
    tasks: Task[];
    completed: boolean;
}
