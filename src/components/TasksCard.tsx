
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ListChecks, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ParentTask } from '@/types';
import { Separator } from '@/components/ui/separator';

interface TasksCardProps {
  onTaskCompleted: (reward: number) => void;
}

const TASKS_STATE_KEY = 'impulseAppParentTasksState_v1';

const initialParentTask: ParentTask = {
    id: 'parent-tegasfx-1',
    title: 'Suggested Task',
    description: 'Complete all sub-tasks to earn a massive bonus!',
    bonusReward: 100,
    completed: false,
    tasks: [
        {
            id: 'subtask-1-register',
            description: 'Click this link and register your account',
            reward: 10,
            completed: false,
            link: 'https://secure.tegasfx.com/links/go/9924',
        },
        {
            id: 'subtask-2-kyc',
            description: 'Verify your account after KYC',
            reward: 15,
            completed: false,
        },
        {
            id: 'subtask-3-copytrade',
            description: 'Follow my copytrading',
            reward: 5,
            completed: false,
        },
    ],
};


const TasksCard: FC<TasksCardProps> = ({ onTaskCompleted }) => {
  const [parentTask, setParentTask] = useState<ParentTask>(initialParentTask);
  const { toast } = useToast();

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedState = localStorage.getItem(TASKS_STATE_KEY);
        if (savedState) {
            try {
                setParentTask(JSON.parse(savedState));
            } catch (e) {
                console.error("Failed to parse tasks state from localStorage", e);
                localStorage.removeItem(TASKS_STATE_KEY);
            }
        }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TASKS_STATE_KEY, JSON.stringify(parentTask));
    }
  }, [parentTask]);

  // Check for all sub-tasks completion to award bonus
  useEffect(() => {
    if (!parentTask.completed) {
      const allSubTasksCompleted = parentTask.tasks.every(t => t.completed);
      if (allSubTasksCompleted) {
        onTaskCompleted(parentTask.bonusReward);
        
        setParentTask(prev => ({ ...prev, completed: true }));

        toast({
          title: "Challenge Complete!",
          description: `You earned a bonus of ${parentTask.bonusReward} coins!`,
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentTask]);

  const handleCompleteTask = (taskId: string) => {
    const taskIndex = parentTask.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1 && !parentTask.tasks[taskIndex].completed) {
      const taskToComplete = parentTask.tasks[taskIndex];
      onTaskCompleted(taskToComplete.reward);

      toast({
        title: "Task Completed!",
        description: `You earned ${taskToComplete.reward} coins.`,
      });
      
      setParentTask(prev => {
        const newTasks = [...prev.tasks];
        newTasks[taskIndex] = { ...newTasks[taskIndex], completed: true };
        return { ...prev, tasks: newTasks };
      });
    }
  };

  const allTasksDone = parentTask.tasks.every(t => t.completed);

  return (
    <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <ListChecks className="mr-3 h-7 w-7 text-primary" />
          {parentTask.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-card-foreground/80">{parentTask.description}</p>
        <ul className="space-y-3">
          {parentTask.tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                task.completed ? 'bg-black/20 opacity-60' : 'bg-black/20 hover:bg-black/30'
              }`}
            >
              <div className="flex-1 space-y-1">
                <p className={`text-sm ${task.completed ? 'line-through text-card-foreground/50' : 'text-card-foreground/90'}`}>
                  {task.description}
                </p>
                {task.link && !task.completed && (
                  <a
                    href={task.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-primary/80 hover:text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Go to link <ExternalLink className="ml-1.5 h-3 w-3" />
                  </a>
                )}
              </div>
              <div className="flex items-center pl-4 space-x-2">
                 <span className="font-bold text-yellow-400">+{task.reward}</span>
                {!task.completed ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCompleteTask(task.id)}
                    className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                    aria-label={`Complete task: ${task.description}`}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </Button>
                ) : (
                   <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
              </div>
            </li>
          ))}
        </ul>
        <Separator className="my-4 bg-white/10" />
        <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
            allTasksDone ? 'bg-green-500/20' : 'bg-black/20'
        }`}>
            <p className="font-bold text-base text-card-foreground">
                Bonus for completing all tasks
            </p>
            <div className="flex items-center space-x-2">
                <span className={`font-bold text-lg ${allTasksDone ? 'text-green-400' : 'text-yellow-400'}`}>
                    +{parentTask.bonusReward} Impulse
                </span>
                {allTasksDone && <CheckCircle2 className="h-6 w-6 text-green-400" />}
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TasksCard;
