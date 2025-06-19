
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, ListChecks, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { suggestTasks, type SuggestTasksInput, type SuggestTasksOutput } from '@/ai/flows/suggest-tasks';
import { useToast } from '@/hooks/use-toast';
import type { Task } from '@/types';

interface TasksCardProps {
  currentCoins: number;
  level: number;
  onTaskCompleted: (reward: number) => void;
}

const TasksCard: FC<TasksCardProps> = ({ currentCoins, level, onTaskCompleted }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const input: SuggestTasksInput = { currentCoins, level };
      const output: SuggestTasksOutput = await suggestTasks(input);
      const suggestedTasks = output.tasks.map((desc, index) => ({
        id: `task-${Date.now()}-${index}`,
        description: desc,
        reward: 10 + level * 2 + Math.floor(Math.random() * 5),
        completed: false,
      }));
      setTasks(suggestedTasks);
    } catch (e) {
      console.error("Failed to suggest tasks:", e);
      setError("Could not fetch new tasks. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tasks from AI.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tasks.length === 0) {
        fetchTasks();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const handleCompleteTask = (taskId: string) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1 && !tasks[taskIndex].completed) {
      const taskToComplete = tasks[taskIndex];
      onTaskCompleted(taskToComplete.reward);

      setTasks(prevTasks => prevTasks.map(t =>
        t.id === taskId ? { ...t, completed: true } : t
      ));
    }
  };

  return (
    <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <ListChecks className="mr-3 h-7 w-7 text-primary" />
          AI Suggested Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Loading tasks...</p>
          </div>
        )}
        {error && (
            <div className="flex items-center text-destructive p-3 bg-destructive/10 rounded-md">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p>{error}</p>
            </div>
        )}
        {!isLoading && !error && tasks.length === 0 && (
          <p className="text-center text-muted-foreground py-6">No tasks available. Try fetching new ones!</p>
        )}
        {!isLoading && tasks.length > 0 && (
          <ScrollArea className="h-[250px] pr-3">
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                    task.completed ? 'bg-muted/50 opacity-60' : 'bg-card-foreground/5 hover:bg-card-foreground/10'
                  }`}
                >
                  <div className="flex-1">
                    <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'}`}>
                      {task.description}
                    </p>
                    <p className="text-xs text-primary font-medium">Reward: {task.reward} coins</p>
                  </div>
                  {!task.completed && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCompleteTask(task.id)}
                      className="ml-2 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                      aria-label={`Complete task: ${task.description}`}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </Button>
                  )}
                  {task.completed && (
                     <CheckCircle2 className="h-5 w-5 text-green-500 ml-2" />
                  )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={fetchTasks}
          disabled={isLoading}
          className="w-full bg-white text-black hover:bg-gray-100 transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
          )}
          Get New Task Suggestions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TasksCard;
