import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Activity, 
  Brain, 
  Dumbbell, 
  Heart, 
  Droplets, 
  Sun, 
  Moon, 
  Coffee, 
  Utensils,
  Plus,
  ChevronRight,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import PageTitle from "@/components/layout/PageTitle";

// Define types for our data
interface ScheduleItem {
  id: number;
  title: string;
  description: string;
  time: string;
  category: string;
  icon: React.ElementType;
  color: string;
  completed: boolean;
}

interface HealthGoal {
  id: number;
  title: string;
  target: number;
  current: number;
  unit?: string;
  icon: React.ElementType;
  color: string;
}

// Mock data for the schedule
const scheduleData: ScheduleItem[] = [
  {
    id: 1,
    title: "Morning Workout",
    description: "30-minute cardio session followed by stretching",
    time: "07:00 AM - 08:00 AM",
    category: "fitness",
    icon: Dumbbell,
    color: "bg-health-primary",
    completed: false,
  },
  {
    id: 2,
    title: "Healthy Breakfast",
    description: "Protein smoothie with Greek yogurt and fruits",
    time: "08:15 AM - 08:45 AM",
    category: "nutrition",
    icon: Coffee,
    color: "bg-health-secondary",
    completed: true,
  },
  {
    id: 3,
    title: "Meditation Session",
    description: "15-minute mindfulness meditation",
    time: "09:00 AM - 09:15 AM",
    category: "mental",
    icon: Brain,
    color: "bg-health-accent",
    completed: true,
  },
  {
    id: 4,
    title: "Hydration Reminder",
    description: "Drink 500ml of water",
    time: "10:30 AM",
    category: "hydration",
    icon: Droplets,
    color: "bg-blue-500",
    completed: false,
  },
  {
    id: 5,
    title: "Lunch Break",
    description: "Balanced meal with vegetables and lean protein",
    time: "12:30 PM - 01:15 PM",
    category: "nutrition",
    icon: Utensils,
    color: "bg-amber-500",
    completed: false,
  }
];

// Daily health goals data
const healthGoals: HealthGoal[] = [
  { id: 1, title: "Steps", target: 10000, current: 6540, icon: Activity, color: "bg-health-primary" },
  { id: 2, title: "Water", target: 2000, current: 1200, unit: "ml", icon: Droplets, color: "bg-health-secondary" },
  { id: 3, title: "Sleep", target: 8, current: 0, unit: "hours", icon: Moon, color: "bg-health-accent" },
  { id: 4, title: "Calories", target: 2500, current: 1650, icon: Utensils, color: "bg-amber-500" },
];

const DailySchedule: React.FC = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(scheduleData);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Update current time every minute for real-time display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Handle marking an item as complete
  const handleCompleteItem = (id: number): void => {
    setScheduleItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <motion.div 
      className="container mx-auto py-8 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
            {/* Header Section */}      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-health-primary/90 via-health-secondary/70 to-health-accent/80 text-white mb-8">        <div className="absolute inset-0 bg-[url('/images/pattern/circles.svg')] opacity-10 mix-blend-overlay"></div>        <div className="absolute -top-10 -left-10 w-40 h-40 bg-health-secondary/20 rounded-full blur-3xl"></div>        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-health-primary/20 rounded-full blur-3xl"></div>
        
        <div className="relative p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-white/30 border-t-white/80"
              />
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-white"
              >
                Daily Schedule
              </motion.h1>
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="h-4 w-4" />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium"
                >
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </motion.p>
                <span className="text-white/50">|</span>
                <motion.p
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </motion.p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-2 md:mt-0">
            <div className="flex border border-white/20 rounded-full overflow-hidden bg-white/10 text-white p-1 shadow-inner backdrop-blur-sm">
              <Button variant="ghost" size="sm" className="rounded-full px-3 text-white hover:bg-white/20 hover:text-white">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span>Today</span>
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full px-3 hover:bg-white/20 hover:text-white text-white/80">
                <Dumbbell className="h-4 w-4 mr-1.5" />
                <span>Workout</span>
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full px-3 hover:bg-white/20 hover:text-white text-white/80">
                <Utensils className="h-4 w-4 mr-1.5" />
                <span>Meals</span>
              </Button>
            </div>
            
            <Button className="bg-white/10 hover:bg-white/20 text-white border-0 font-medium">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Activity
            </Button>
          </div>
        </div>
        
        {/* Date Indicators */}
        <div className="relative px-6 pb-5 pt-2 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <div className="flex gap-2 min-w-max">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date();
              date.setDate(currentTime.getDate() - 3 + i);
              const isToday = date.getDate() === currentTime.getDate();
              
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg cursor-pointer border transition-all ${
                    isToday 
                      ? "bg-white/20 border-white/20" 
                      : "bg-white/5 border-transparent hover:bg-white/10"
                  }`}
                >
                  <span className="text-xs font-medium text-white/80">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}
                  </span>
                  <span className={`text-lg font-bold ${isToday ? "text-white" : "text-white/80"}`}>
                    {date.getDate()}
                  </span>
                  {isToday && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-white rounded-full mt-1"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Daily Goals */}
      <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
        <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-health-primary to-health-accent flex items-center justify-center shadow-md">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-health-primary to-health-accent">
                Daily Health Goals
              </span>
            </CardTitle>
            <Button variant="ghost" size="sm" className="gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
              View All
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {healthGoals.map((goal, index) => {
              const progress = Math.round((goal.current / goal.target) * 100);
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="relative"
                >
                  <Card className="border overflow-hidden h-full bg-white/80 dark:bg-gray-900/50 shadow-md hover:shadow-lg transition-all duration-300 group">
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ 
                      background: `linear-gradient(to right, var(--${goal.color.replace('bg-', '')}), var(--${goal.color.replace('bg-', '')})80)`
                    }}></div>
                    
                    <CardContent className="p-4 space-y-3 relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-9 w-9 rounded-full ${goal.color} flex items-center justify-center shadow-sm relative overflow-hidden group-hover:shadow-md transition-shadow`}>
                            <goal.icon className="h-4.5 w-4.5 text-white" />
                            <motion.div 
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ 
                                scale: [1, 1.5],
                                opacity: [0.3, 0]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "loop",
                                delay: index * 0.2
                              }}
                              className="absolute inset-0 rounded-full bg-white"
                            />
                          </div>
                          <span className="font-medium">{goal.title}</span>
                        </div>
                        
                        <div className="relative">
                          <motion.div 
                            className={`text-sm font-bold px-2 py-0.5 rounded-full ${goal.color.replace("bg-", "bg-")}/10 ${goal.color.replace("bg-", "text-")}`}
                            animate={progress >= 100 ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 1, repeat: progress >= 100 ? Infinity : 0 }}
                          >
                            {progress}%
                          </motion.div>
                          {progress >= 100 && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white"
                            >
                              <CheckCircle className="h-2.5 w-2.5" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {goal.current} / {goal.target} {goal.unit}
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                            className={`absolute h-full left-0 top-0 rounded-full ${goal.color}`}
                          />
                          {progress < 100 && progress > 30 && (
                            <motion.div
                              animate={{ x: ['-100%', '400%'] }}
                              transition={{ 
                                duration: 2.5, 
                                repeat: Infinity,
                                ease: "linear"
                              }}
                              className="absolute h-full w-10 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          {goal.id === 1 ? "+2,458 today" : 
                           goal.id === 2 ? "+400ml today" : 
                           goal.id === 3 ? "Tonight's goal" : 
                           "+450 cal remaining"}
                        </span>
                        
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs rounded-md">
                          Update
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>Your activities for today</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {scheduleItems.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border transition-all",
                  item.completed ? "bg-muted/30" : "hover:border-health-primary/30 hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                  item.color
                )}>
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={cn(
                      "font-medium",
                      item.completed && "text-muted-foreground line-through"
                    )}>
                      {item.title}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-7 px-2 rounded text-xs",
                        item.completed ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 hover:text-green-700" : "hover:bg-primary/10"
                      )}
                      onClick={() => handleCompleteItem(item.id)}
                    >
                      {item.completed ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Completed
                        </span>
                      ) : "Mark complete"}
                    </Button>
                  </div>
                  <p className={cn(
                    "text-sm text-muted-foreground mt-1",
                    item.completed && "line-through"
                  )}>
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1 opacity-70" />
                      {item.time}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${item.color.replace("bg", "text")}/80`}>
                      {item.category}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t">
          <Button variant="ghost" className="w-full gap-1">
            <Plus className="h-4 w-4" />
            Add New Activity
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default DailySchedule;