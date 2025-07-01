
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ListChecks, ExternalLink, ChevronRight, Award, Loader2, Zap, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ParentTask } from '@/types';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface TasksCardProps {
  onTaskCompleted: (reward: number) => void;
}

const TASKS_STATE_KEY = 'impulseAppParentTasks_v7';

const initialParentTasks: ParentTask[] = [
  {
    id: 'parent-socials-1',
    title: 'Connect Your Socials',
    description: 'Follow us on social media and get rewarded!',
    bonusReward: 10,
    completed: false,
    tasks: [
        { id: 'social-1-youtube', description: 'Subscribe on YouTube', reward: 2, completed: false, link: 'https://youtube.com' },
        { id: 'social-2-x', description: 'Follow us on X', reward: 2, completed: false, link: 'https://x.com' },
        { id: 'social-3-telegram', description: 'Join our Telegram', reward: 2, completed: false, link: 'https://telegram.org' },
        { id: 'social-4-instagram', description: 'Follow us on Instagram', reward: 2, completed: false, link: 'https://instagram.com' },
        { id: 'social-5-facebook', description: 'Like our Facebook page', reward: 1, completed: false, link: 'https://facebook.com' },
        { id: 'social-6-whatsapp', description: 'Join our WhatsApp community', reward: 1, completed: false, link: 'https://whatsapp.com' },
    ],
  },
  {
    id: 'parent-tegasfx-1',
    title: 'Register with TegasFX Broker',
    description: 'Complete all sub-tasks to earn a massive bonus!',
    bonusReward: 100,
    completed: false,
    tasks: [
        { id: 'subtask-0-name', description: 'Enter your government name', reward: 0, completed: false, requiresTextInput: true },
        { id: 'subtask-1-register', description: 'Click this link and register your account', reward: 10, completed: false, link: 'https://secure.tegasfx.com/links/go/9924' },
        { id: 'subtask-2-kyc', description: 'Verify your account after KYC', reward: 15, completed: false, requiresUpload: true },
        { id: 'subtask-3-copytrade', description: 'Follow my copytrading', reward: 5, completed: false, requiresUpload: true },
    ],
  }
];


const TasksCard: FC<TasksCardProps> = ({ onTaskCompleted }) => {
  const [parentTasks, setParentTasks] = useState<ParentTask[]>(initialParentTasks);
  const [selectedTask, setSelectedTask] = useState<ParentTask | null>(null);
  const [verifyingTaskId, setVerifyingTaskId] = useState<string | null>(null);
  const [clickedLinks, setClickedLinks] = useState<Set<string>>(new Set());
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const [textInputValues, setTextInputValues] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedState = localStorage.getItem(TASKS_STATE_KEY);
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                // Simple validation to ensure the loaded state has the expected structure
                if (Array.isArray(parsedState) && parsedState.every(p => p.hasOwnProperty('tasks'))) {
                    setParentTasks(parsedState);
                } else {
                    localStorage.setItem(TASKS_STATE_KEY, JSON.stringify(initialParentTasks));
                }
            } catch (e) {
                console.error("Failed to parse tasks state from localStorage", e);
                localStorage.setItem(TASKS_STATE_KEY, JSON.stringify(initialParentTasks));
            }
        }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TASKS_STATE_KEY, JSON.stringify(parentTasks));
    }
  }, [parentTasks]);

  // Check for all sub-tasks completion to award bonus
  useEffect(() => {
    const newTasks = parentTasks.map(pTask => {
      if (!pTask.completed) {
        const allSubTasksCompleted = pTask.tasks.every(t => t.completed);
        if (allSubTasksCompleted) {
          onTaskCompleted(pTask.bonusReward);
          toast({
            title: "Challenge Complete!",
            description: `You earned a bonus of ${pTask.bonusReward} coins for completing ${pTask.title}!`,
          });
          return { ...pTask, completed: true };
        }
      }
      return pTask;
    });

    if (JSON.stringify(newTasks) !== JSON.stringify(parentTasks)) {
      setParentTasks(newTasks);
    }
  }, [parentTasks, onTaskCompleted, toast]);

  const handleLinkClick = (taskId: string) => {
    setClickedLinks(prev => new Set(prev).add(taskId));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
    if (e.target.files && e.target.files.length > 0) {
        setSelectedFiles(prev => ({ ...prev, [taskId]: e.target.files![0] }));
    }
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
    setTextInputValues(prev => ({ ...prev, [taskId]: e.target.value }));
  };

  const handleCompleteTask = (parentTaskId: string, taskId: string) => {
    if (verifyingTaskId) return;

    setVerifyingTaskId(taskId);

    setTimeout(() => {
      const newParentTasks = parentTasks.map(pTask => {
        if (pTask.id === parentTaskId) {
          const taskIndex = pTask.tasks.findIndex(t => t.id === taskId);
          if (taskIndex !== -1 && !pTask.tasks[taskIndex].completed) {
            const taskToComplete = pTask.tasks[taskIndex];
            onTaskCompleted(taskToComplete.reward);

            toast({
              title: "Task Verified!",
              description: `You earned ${taskToComplete.reward} coins.`,
            });
            
            const newTasks = [...pTask.tasks];
            newTasks[taskIndex] = { ...newTasks[taskIndex], completed: true };
            const updatedParentTask = { ...pTask, tasks: newTasks };
            
            setSelectedTask(updatedParentTask);
            return updatedParentTask;
          }
        }
        return pTask;
      });
      setParentTasks(newParentTasks);
      setVerifyingTaskId(null);

      if (selectedFiles[taskId]) {
        setSelectedFiles(prev => {
            const newFiles = {...prev};
            delete newFiles[taskId];
            return newFiles;
        });
      }
      if (textInputValues[taskId]) {
        setTextInputValues(prev => {
            const newValues = {...prev};
            delete newValues[taskId];
            return newValues;
        });
      }
    }, 1500);
  };

  const getProgress = (task: ParentTask) => {
    if (task.completed) return { count: task.tasks.length, total: task.tasks.length };
    const completedCount = task.tasks.filter(t => t.completed).length;
    const totalCount = task.tasks.length;
    return { count: completedCount, total: totalCount };
  }
  
  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedTask(null);
      // Reset states when dialog closes
      setClickedLinks(new Set()); 
      setSelectedFiles({});
      setTextInputValues({});
    }
  }


  return (
    <>
      <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-headline">
            <ListChecks className="mr-3 h-7 w-7 text-primary" />
            Suggested Task
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {parentTasks.map((task) => {
            const progress = getProgress(task);
            return (
              <button
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="w-full text-left p-4 rounded-lg transition-all duration-300 bg-black/20 hover:bg-black/30 flex items-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={task.completed}
              >
                <div className="flex-1 space-y-1">
                  <p className="font-semibold">{task.title}</p>
                  <p className="text-sm text-card-foreground/70">{task.description}</p>
                </div>
                {task.completed ? (
                  <div className="flex items-center space-x-2 text-green-400">
                     <span className="text-sm font-medium">Completed</span>
                     <CheckCircle2 className="h-6 w-6" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <p className="text-xs text-card-foreground/60">{progress.count}/{progress.total} Done</p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-card-foreground/50"/>
                  </div>
                )}
              </button>
            )
          })}
        </CardContent>
      </Card>

      <Dialog open={!!selectedTask} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[480px] bg-gradient-to-br from-[hsl(285,35%,22%)] to-[hsl(300,40%,18%)] border-border text-card-foreground">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedTask.title}</DialogTitle>
                <DialogDescription className="text-card-foreground/70">{selectedTask.description}</DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh] pr-4 -mr-4">
              <ul className="space-y-3 py-4">
                {selectedTask.tasks.map((task) => {
                  const isVerifying = verifyingTaskId === task.id;
                  
                  let canVerify = false;
                  if (task.completed || verifyingTaskId) {
                      canVerify = false;
                  } else if (task.requiresUpload) {
                      canVerify = !!selectedFiles[task.id];
                  } else if (task.requiresTextInput) {
                      canVerify = !!textInputValues[task.id]?.trim();
                  } else if (task.link) {
                      canVerify = clickedLinks.has(task.id);
                  } else {
                      canVerify = true; // For tasks with no pre-requisite
                  }

                  return (
                    <li
                      key={task.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                        task.completed ? 'bg-black/20 opacity-60' : 'bg-black/20'
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLinkClick(task.id);
                            }}
                          >
                            Go to link <ExternalLink className="ml-1.5 h-3 w-3" />
                          </a>
                        )}
                        {task.requiresUpload && !task.completed && (
                          <div className="pt-2">
                            <Input
                              type="file"
                              id={`file-upload-${task.id}`}
                              className="hidden"
                              onChange={(e) => handleFileChange(e, task.id)}
                              accept="image/png, image/jpeg, image/gif"
                            />
                            <label
                              htmlFor={`file-upload-${task.id}`}
                              className="inline-flex items-center text-xs text-primary/80 hover:text-primary hover:underline cursor-pointer"
                            >
                              <Upload className="mr-1.5 h-3 w-3" />
                              {selectedFiles[task.id] ? 'Change file' : 'Upload screenshot'}
                            </label>
                            {selectedFiles[task.id] && (
                              <p className="text-xs text-card-foreground/60 mt-1 truncate w-48">
                                Selected: {selectedFiles[task.id]?.name}
                              </p>
                            )}
                          </div>
                        )}
                         {task.requiresTextInput && !task.completed && (
                          <div className="pt-2">
                            <Input
                              type="text"
                              id={`text-input-${task.id}`}
                              className="bg-black/30 border-input/50 text-card-foreground placeholder:text-card-foreground/50 text-sm h-9"
                              placeholder="Enter text here..."
                              value={textInputValues[task.id] || ''}
                              onChange={(e) => handleTextInputChange(e, task.id)}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-end pl-4 space-x-2 min-w-[130px]">
                        <span className="font-bold text-yellow-400">
                          +{task.reward}
                        </span>
                        {(task.completed || isVerifying || canVerify) && (
                          <div className="flex items-center justify-center w-[80px] h-9">
                            {task.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : isVerifying ? (
                              <Button variant="ghost" size="sm" disabled className="w-[80px]">
                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                              </Button>
                            ) : canVerify ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCompleteTask(selectedTask.id, task.id)}
                                className="border border-primary/50 hover:bg-primary/20 text-white w-[80px] h-auto py-1 px-2 text-xs"
                                aria-label={`Verify task: ${task.description}`}
                                disabled={!!verifyingTaskId}
                              >
                                Verify
                              </Button>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
              <Separator className="my-4 bg-white/10" />
              <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                  selectedTask.completed ? 'bg-green-500/20' : 'bg-black/20'
              }`}>
                  <p className="font-bold text-base text-card-foreground flex items-center">
                      <Award className="mr-2 h-5 w-5" />
                      Bonus
                  </p>
                  <div className="flex items-center space-x-2">
                      <span className={cn(
                          'font-bold text-lg',
                           selectedTask.completed 
                           ? 'text-green-400' 
                           : !selectedTask.completed && (selectedTask.bonusReward === 10 || selectedTask.bonusReward === 100)
                             ? 'bg-gradient-to-r from-yellow-400 via-white/90 to-yellow-400 bg-clip-text text-transparent animate-shimmer-wave bg-[length:200%_auto]'
                             : 'text-yellow-400'
                        )}>
                          +{selectedTask.bonusReward}
                      </span>
                      <Zap className={cn("h-5 w-5", selectedTask.completed ? 'text-green-400' : 'text-yellow-400')} />
                      {selectedTask.completed && <CheckCircle2 className="h-6 w-6 text-green-400" />}
                  </div>
              </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TasksCard;
