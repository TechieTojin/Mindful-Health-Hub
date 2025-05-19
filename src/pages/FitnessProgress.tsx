import React, { useState } from 'react';
import { NutritionProgress } from '@/components/ui/nutrition-progress';
import { ProgressDashboard } from '@/components/dashboard/ProgressDashboard';
import PageTitle from '@/components/layout/PageTitle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Dumbbell, Heart, Brain, CalendarDays, ArrowUpRight, Plus, Apple, Battery } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { FitnessGoalProgress, FitnessGoal } from '@/components/fitness/FitnessGoalProgress';
import { UpdateGoalDialog } from '@/components/fitness/UpdateGoalDialog';
import { toast } from '@/components/ui/use-toast';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const FitnessProgress = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoal[]>([
    {
      id: '1',
      name: 'Bench Press',
      current: 180,
      target: 225,
      unit: 'lbs',
      category: 'strength',
      startDate: new Date(2023, 5, 15),
      targetDate: new Date(2023, 11, 31),
      progress: 80,
    },
    {
      id: '2',
      name: '5K Run Time',
      current: 28,
      target: 22,
      unit: 'min',
      category: 'cardio',
      startDate: new Date(2023, 6, 1),
      targetDate: new Date(2023, 12, 15),
      progress: 60,
    },
    {
      id: '3',
      name: 'Full Split',
      current: 70,
      target: 100,
      unit: '%',
      category: 'flexibility',
      startDate: new Date(2023, 7, 10),
      targetDate: new Date(2024, 1, 10),
      progress: 70,
    },
    {
      id: '4',
      name: 'Pull-ups',
      current: 8,
      target: 15,
      unit: 'reps',
      category: 'strength',
      startDate: new Date(2023, 6, 1),
      targetDate: new Date(2023, 11, 30),
      progress: 53,
    },
  ]);
  
  // Sample weekly activities
  const weeklyActivities = [
    { day: 'Mon', minutes: 45, type: 'Strength' },
    { day: 'Tue', minutes: 30, type: 'Cardio' },
    { day: 'Wed', minutes: 60, type: 'Strength' },
    { day: 'Thu', minutes: 0, type: 'Rest' },
    { day: 'Fri', minutes: 45, type: 'Cardio' },
    { day: 'Sat', minutes: 90, type: 'Mixed' },
    { day: 'Sun', minutes: 0, type: 'Rest' },
  ];
  
  const getActivityColorClass = (type: string) => {
    switch (type) {
      case 'Strength':
        return 'bg-blue-500';
      case 'Cardio':
        return 'bg-red-500';
      case 'Mixed':
        return 'bg-purple-500';
      default:
        return 'bg-gray-300';
    }
  };
  
  const calculateRemainingDays = (targetDate: Date) => {
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  const handleUpdateGoal = (goalId: string) => {
    const goal = fitnessGoals.find(g => g.id === goalId);
    if (goal) {
      setSelectedGoal(goal);
      setIsUpdateDialogOpen(true);
    }
  };
  
  const handleSaveGoalUpdate = (goalId: string, newValue: number) => {
    setFitnessGoals(prevGoals => {
      return prevGoals.map(goal => {
        if (goal.id === goalId) {
          const newProgress = Math.min(Math.round((newValue / goal.target) * 100), 100);
          return {
            ...goal,
            current: newValue,
            progress: newProgress
          };
        }
        return goal;
      });
    });
    
    toast({
      title: "Progress Updated",
      description: `Your progress has been updated successfully.`,
    });
  };
  
  const handleViewHistory = (goalId: string) => {
    toast({
      title: "View History",
      description: `Viewing history for goal ID: ${goalId}`,
    });
    // In a real app, this would navigate to a history view or open a dialog
  };
  
  const handleAddNewGoal = () => {
    toast({
      title: "Add New Goal",
      description: "Creating a new fitness goal",
    });
    // In a real app, this would open a dialog to create a new goal
  };
  
  return (
    <div className="space-y-6">
      <PageTitle 
        title="Fitness Progress" 
        subtitle="Track your fitness goals, nutrition, and health metrics"
      />
      
      <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Fitness Goals</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Weekly Activity Chart */}
            <motion.div variants={itemVariants} className="mb-6">
              <Card className="overflow-hidden border">
                <CardHeader className="border-b bg-muted/30">
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                      <Activity className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    Weekly Activity
                  </CardTitle>
                  <CardDescription>
                    Your workout activity for the past week
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-7 gap-3 h-48">
                    {weeklyActivities.map((activity, i) => (
                      <motion.div 
                        key={i} 
                        className="flex flex-col h-full justify-end text-center relative"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                      >
                        <div className="absolute inset-x-0 bottom-10 text-xs font-semibold">
                          {activity.minutes > 0 && (
                            <span>{activity.minutes}<span className="text-muted-foreground">m</span></span>
                          )}
                        </div>
                        <div className="relative flex-1 flex items-end pt-6 pb-2">
                          <motion.div 
                            className={cn(
                              "w-full rounded-md", 
                              getActivityColorClass(activity.type)
                            )}
                            style={{ height: `${(activity.minutes / 90) * 100}%` }}
                            initial={{ height: 0 }}
                            animate={{ height: `${(activity.minutes / 90) * 100}%` }}
                            transition={{ duration: 0.7, delay: 0.3 + (i * 0.05) }}
                          >
                            {activity.minutes === 0 && (
                              <div className="absolute inset-x-0 top-0 -mt-6 text-xs text-muted-foreground">Rest</div>
                            )}
                          </motion.div>
                          </div>
                        <div className="h-8 flex items-center justify-center">
                          <span className="text-sm font-medium">{activity.day}</span>
                        </div>
                        <div className="absolute -bottom-2 inset-x-0 h-2 flex justify-center">
                          {activity.minutes > 0 && (
                            <span className="h-2 w-2 rounded-full bg-muted-foreground/40"></span>
                          )}
                      </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center mt-6 gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm bg-blue-500"></div>
                      <span>Strength</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm bg-red-500"></div>
                      <span>Cardio</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm bg-purple-500"></div>
                      <span>Mixed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm bg-gray-300"></div>
                      <span>Rest</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* High-Level Metrics */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    title: "Workouts",
                    current: 16,
                    target: 20,
                    progress: 80,
                    icon: Dumbbell,
                    color: "bg-gradient-to-br from-blue-500 to-indigo-600",
                    textColor: "text-blue-600 dark:text-blue-400",
                    lightBg: "bg-blue-50 dark:bg-blue-900/20"
                  },
                  {
                    title: "Weekly Active Minutes",
                    current: 270,
                    target: 300,
                    progress: 90,
                    icon: Activity,
                    color: "bg-gradient-to-br from-emerald-500 to-green-600",
                    textColor: "text-emerald-600 dark:text-emerald-400",
                    lightBg: "bg-emerald-50 dark:bg-emerald-900/20"
                  },
                  {
                    title: "Avg. Heart Rate",
                    current: 72,
                    suffix: "bpm",
                    subtitle: "Healthy range",
                    icon: Heart,
                    color: "bg-gradient-to-br from-rose-500 to-red-600",
                    textColor: "text-rose-600 dark:text-rose-400",
                    lightBg: "bg-rose-50 dark:bg-rose-900/20"
                  },
                  {
                    title: "Recovery Score",
                    current: 85,
                    target: 100,
                    progress: 85,
                    icon: Battery,
                    color: "bg-gradient-to-br from-amber-500 to-yellow-600",
                    textColor: "text-amber-600 dark:text-amber-400",
                    lightBg: "bg-amber-50 dark:bg-amber-900/20"
                  },
                ].map((metric, index) => (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <div className={`h-5 w-5 rounded-full ${metric.lightBg} flex items-center justify-center`}>
                            <metric.icon className={`h-3 w-3 ${metric.textColor}`} />
                    </div>
                          {metric.title}
                    </CardTitle>
                  </CardHeader>
                      <CardContent className="p-4 pt-2">
                    <div className="flex items-end">
                          <span className="text-3xl font-bold">{metric.current}</span>
                          {metric.target ? (
                            <span className="text-sm text-muted-foreground ml-2">/ {metric.target} {metric.suffix || "goal"}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground ml-2">{metric.suffix}</span>
                          )}
                    </div>
                        
                        {metric.progress !== undefined ? (
                          <>
                            <motion.div 
                              className="h-1.5 w-full bg-muted mt-2 rounded-full overflow-hidden"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 + (index * 0.1) }}
                            >
                              <motion.div 
                                className={`h-full ${metric.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.progress}%` }}
                                transition={{ duration: 1, delay: 0.7 + (index * 0.1) }}
                              />
                            </motion.div>
                            <div className="text-xs text-right mt-1 text-muted-foreground">{metric.progress}%</div>
                          </>
                        ) : metric.subtitle ? (
                    <div className="flex items-center gap-2 mt-2">
                            <metric.icon className={`h-4 w-4 ${metric.textColor}`} />
                            <span className="text-xs text-muted-foreground">{metric.subtitle}</span>
                    </div>
                        ) : null}
                  </CardContent>
                </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Featured Progress */}
            <motion.div variants={itemVariants} className="mb-6">
              <Card className="overflow-hidden border">
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                          <Dumbbell className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                        </div>
                        Featured Progress
                      </CardTitle>
                  <CardDescription>Your most active fitness goals</CardDescription>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground hover:text-foreground gap-1"
                      onClick={() => setActiveTab('goals')}
                    >
                      View All <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-5">
                    {fitnessGoals.slice(0, 2).map((goal, idx) => (
                      <div key={goal.id} className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {goal.category === "strength" && <Dumbbell className="h-4 w-4 text-blue-500" />}
                              {goal.category === "cardio" && <Activity className="h-4 w-4 text-red-500" />}
                              {goal.category === "flexibility" && <Activity className="h-4 w-4 text-purple-500" />}
                              {goal.category === "endurance" && <Activity className="h-4 w-4 text-amber-500" />}
                              {goal.name}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <CalendarDays className="h-3 w-3" />
                              <span>Target: {goal.targetDate.toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="font-semibold">{goal.current}</span>
                            <span className="text-sm text-muted-foreground">/ {goal.target} {goal.unit}</span>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${goal.progress}%` }}
                              transition={{ duration: 1, delay: 0.3 + (idx * 0.2) }}
                              className={cn(
                                "h-full", 
                                goal.category === "strength" ? "bg-blue-500" :
                                goal.category === "cardio" ? "bg-red-500" :
                                goal.category === "flexibility" ? "bg-purple-500" :
                                "bg-amber-500"
                              )}
                            />
                          </div>
                          
                          <div className="flex justify-between mt-1">
                            <div className="text-xs text-muted-foreground">{calculateRemainingDays(goal.targetDate)} days left</div>
                            <div className="text-xs font-medium">{goal.progress}% complete</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Nutrition Summary */}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border">
                <CardHeader className="border-b bg-muted/30">
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                      <Apple className="h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                    Nutrition Summary
                  </CardTitle>
                  <CardDescription>Today's nutrition intake</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-5">
                    {[
                      { label: "Calories", current: 1650, max: 2000, unit: "kcal", type: "calories", color: "from-rose-500 to-red-500" },
                      { label: "Protein", current: 95, max: 120, unit: "g", type: "protein", color: "from-blue-500 to-indigo-500" },
                      { label: "Carbs", current: 180, max: 250, unit: "g", type: "carbs", color: "from-amber-500 to-yellow-500" },
                      { label: "Fat", current: 48, max: 60, unit: "g", type: "fat", color: "from-green-500 to-emerald-500" }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{item.label}</span>
                          <span>
                            <span className="font-semibold">{item.current}</span>
                            <span className="text-muted-foreground"> / {item.max} {item.unit}</span>
                          </span>
                        </div>
                        
                        <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.current/item.max) * 100}%` }}
                            transition={{ duration: 1, delay: 0.3 + (idx * 0.1) }}
                            className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                          />
                        </div>
                        
                        <div className="flex justify-end text-xs text-muted-foreground">
                          {Math.round((item.current/item.max) * 100)}% of daily target
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <div className="px-6 pb-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => setActiveTab('nutrition')}
                  >
                    View Detailed Nutrition
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="goals" className="mt-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <div className="mb-8">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/40 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-3">
                      <Dumbbell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      Fitness Journey
                    </h3>
                    <p className="text-muted-foreground mb-4">Track your progress and accomplish your fitness goals with our personalized tracking system.</p>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white dark:bg-card/60 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-indigo-100/50 dark:border-indigo-800/30">
                        <div className="text-sm text-muted-foreground mb-1">Total Goals</div>
                        <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{fitnessGoals.length}</div>
                      </div>
                      <div className="bg-white dark:bg-card/60 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-indigo-100/50 dark:border-indigo-800/30">
                        <div className="text-sm text-muted-foreground mb-1">On Track</div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {fitnessGoals.filter(g => g.progress >= 70).length}
                        </div>
                      </div>
                      <div className="bg-white dark:bg-card/60 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-indigo-100/50 dark:border-indigo-800/30">
                        <div className="text-sm text-muted-foreground mb-1">Needs Focus</div>
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                          {fitnessGoals.filter(g => g.progress < 70).length}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="w-40 h-40 relative">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle className="text-indigo-100 dark:text-indigo-900/50 stroke-current" strokeWidth="10" cx="50" cy="50" r="40" fill="none"></circle>
                        <motion.circle
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 0.75 }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className="text-indigo-600 dark:text-indigo-400 stroke-current" 
                          strokeWidth="10" 
                          strokeLinecap="round" 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          fill="none"
                        ></motion.circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                          75%
                        </div>
                        <div className="text-xs text-muted-foreground">Overall Progress</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fitnessGoals.map((goal, index) => (
                <motion.div key={goal.id} variants={itemVariants}>
                  <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border">
                    <CardHeader className="pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {goal.category === "strength" && <Dumbbell className="h-4 w-4 text-blue-500" />}
                            {goal.category === "cardio" && <Activity className="h-4 w-4 text-red-500" />}
                            {goal.category === "flexibility" && <Activity className="h-4 w-4 text-purple-500" />}
                            {goal.category === "endurance" && <Activity className="h-4 w-4 text-amber-500" />}
                            {goal.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Target: {goal.target} {goal.unit} by {goal.targetDate.toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full", 
                          goal.category === "strength" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                          goal.category === "cardio" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                          goal.category === "flexibility" ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" :
                          "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                        )}>
                          {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3 pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full",
                              goal.progress >= 90 ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                              goal.progress >= 70 ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                              goal.progress >= 40 ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                              "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            )}>
                              <span className="font-bold text-sm">{goal.progress}%</span>
                            </div>
                            <span>
                              <span className="font-medium">{goal.current} {goal.unit}</span>
                              <span className="text-muted-foreground"> of {goal.target} {goal.unit}</span>
                            </span>
                          </div>
                          
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {calculateRemainingDays(goal.targetDate)} days left
                          </span>
                        </div>
                        
                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className={cn(
                              "h-full",
                              goal.category === "strength" ? "bg-blue-500" :
                              goal.category === "cardio" ? "bg-red-500" :
                              goal.category === "flexibility" ? "bg-purple-500" :
                              "bg-amber-500"
                            )}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                          <span>Started {goal.startDate.toLocaleDateString()}</span>
                          <span className={cn(
                            goal.progress >= 90 ? "text-green-600 dark:text-green-400" :
                            goal.progress >= 70 ? "text-blue-600 dark:text-blue-400" :
                            goal.progress >= 40 ? "text-amber-600 dark:text-amber-400" :
                            "text-red-600 dark:text-red-400"
                          )}>
                            {goal.progress >= 90 ? "Almost there!" :
                             goal.progress >= 70 ? "Good progress" :
                             goal.progress >= 40 ? "On track" :
                             "Needs focus"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t bg-muted/20 pt-3">
                      <Button 
                        variant="default" 
                        size="sm"
                        className="bg-gradient-to-r from-health-primary to-health-accent text-white hover:opacity-90"
                        onClick={() => handleUpdateGoal(goal.id)}
                      >
                        Update Progress
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground"
                        onClick={() => handleViewHistory(goal.id)}
                      >
                        View History
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
            ))}
            
              <motion.div variants={itemVariants}>
                <Card className="flex flex-col items-center justify-center p-6 border-dashed h-full">
              <Button 
                variant="outline" 
                    className="w-full h-full py-8 border-dashed hover:border-health-primary/50 hover:bg-health-primary/5 transition-all duration-300"
                onClick={handleAddNewGoal}
              >
                <div className="flex flex-col items-center gap-2">
                      <div className="h-14 w-14 rounded-full flex items-center justify-center bg-muted">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <span className="font-medium">Add New Fitness Goal</span>
                      <span className="text-xs text-muted-foreground">Track and monitor your progress</span>
                </div>
              </Button>
            </Card>
              </motion.div>
          </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="nutrition" className="mt-6">
          <ProgressDashboard />
        </TabsContent>
      </Tabs>
      
      {selectedGoal && (
        <UpdateGoalDialog
          goal={selectedGoal}
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          onUpdate={handleSaveGoalUpdate}
        />
      )}
    </div>
  );
};

export default FitnessProgress; 