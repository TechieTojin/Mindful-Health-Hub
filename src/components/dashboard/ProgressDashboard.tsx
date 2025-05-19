import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { NutritionProgress } from '@/components/ui/nutrition-progress';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Activity, Heart, Sun, Dumbbell, Brain, Droplets, Apple, Moon, Battery, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProgressDashboardProps {
  className?: string;
}

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

export function ProgressDashboard({ className }: ProgressDashboardProps) {
  // Sample data for the progress bars
  const nutritionData = {
    calories: { current: 1500, max: 2000, unit: 'kcal' },
    protein: { current: 80, max: 120, unit: 'g' },
    carbs: { current: 150, max: 250, unit: 'g' },
    fat: { current: 45, max: 60, unit: 'g' },
  };

  const healthMetrics = [
    { 
      id: 'steps', 
      label: 'Daily Steps', 
      current: 7500, 
      max: 10000, 
      unit: 'steps',
      icon: Activity, 
      color: 'from-blue-500 to-cyan-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-100 dark:border-blue-800',
      iconColor: 'text-blue-500',
      isImproving: true
    },
    { 
      id: 'heart', 
      label: 'Heart Rate', 
      current: 65, 
      max: 100, 
      unit: 'bpm',
      icon: Heart, 
      color: 'from-rose-500 to-red-400',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      border: 'border-rose-100 dark:border-rose-800',
      iconColor: 'text-rose-500',
      isImproving: true
    },
    { 
      id: 'workouts', 
      label: 'Weekly Workouts', 
      current: 3, 
      max: 5, 
      unit: '',
      icon: Dumbbell, 
      color: 'from-violet-500 to-purple-400',
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      border: 'border-violet-100 dark:border-violet-800',
      iconColor: 'text-violet-500',
      isImproving: false
    },
    { 
      id: 'sleep', 
      label: 'Sleep', 
      current: 7, 
      max: 8, 
      unit: 'hrs',
      icon: Moon, 
      color: 'from-indigo-500 to-blue-400',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      border: 'border-indigo-100 dark:border-indigo-800',
      iconColor: 'text-indigo-500',
      isImproving: true
    },
  ];

  const wellnessGoals = [
    { 
      id: 'weight', 
      label: 'Weight Goal', 
      current: 70, 
      max: 100, 
      unit: '%',
      icon: Battery, 
      color: 'from-emerald-500 to-green-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-100 dark:border-emerald-800',
      iconColor: 'text-emerald-500'
    },
    { 
      id: 'meditation', 
      label: 'Meditation', 
      current: 4, 
      max: 7, 
      unit: 'days',
      icon: Brain, 
      color: 'from-amber-500 to-yellow-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-100 dark:border-amber-800',
      iconColor: 'text-amber-500'
    },
    { 
      id: 'water', 
      label: 'Water Intake', 
      current: 6, 
      max: 8, 
      unit: 'L',
      icon: Droplets, 
      color: 'from-cyan-500 to-blue-400',
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
      border: 'border-cyan-100 dark:border-cyan-800',
      iconColor: 'text-cyan-500'
    },
    { 
      id: 'activity', 
      label: 'Activity Time', 
      current: 45, 
      max: 60, 
      unit: 'min',
      icon: Clock, 
      color: 'from-orange-500 to-red-400',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-100 dark:border-orange-800',
      iconColor: 'text-orange-500'
    },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={cn("space-y-8", className)}
    >
      {/* Health Metrics Cards - Modern Design */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-health-primary/20 to-health-accent/20 flex items-center justify-center">
              <Activity className="h-5 w-5 text-health-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Health Metrics</h3>
              <p className="text-sm text-muted-foreground">Your current health status</p>
            </div>
          </div>
          <Badge variant="outline" className="px-3 py-1 bg-gradient-to-r from-health-primary/10 to-health-accent/10 border-health-primary/20 text-health-primary">
            Daily update
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {healthMetrics.map((metric, index) => (
            <motion.div 
              key={metric.id}
              variants={itemVariants} 
              className="relative"
            >
              <Card className={cn(
                "overflow-hidden transition-all duration-300 hover:shadow-md border-transparent",
                metric.border
              )}>
                <div className={cn("absolute inset-0 opacity-30", metric.bg)}></div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn(
                      "flex items-center justify-center h-12 w-12 rounded-xl",
                      metric.bg
                    )}>
                      <metric.icon className={cn("h-6 w-6", metric.iconColor)} />
                    </div>
                    <div className="flex items-center">
                      {metric.isImproving ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Improving
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                          Focus needed
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{metric.label}</h4>
                      <span className="text-sm font-bold">
                        {metric.current}/{metric.max} {metric.unit}
                      </span>
                    </div>
                    
                    <div className="h-2.5 w-full bg-muted/50 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(metric.current / metric.max) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={cn(
                          "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
                          metric.color
                        )}
                      />
                    </div>
                    
                    <div className="text-xs text-muted-foreground text-right">
                      {Math.round((metric.current / metric.max) * 100)}% of daily goal
                    </div>
                  </div>
        </CardContent>
      </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Nutrition Progress - Modern Design with Animation */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-none shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-health-primary/5 to-health-accent/5 -z-10"></div>
          <CardHeader className="border-b bg-card/70 backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-health-primary/20 to-health-accent/20 flex items-center justify-center">
                  <Apple className="h-4 w-4 text-health-primary" />
                </div>
                <div>
                  <CardTitle>Nutrition Progress</CardTitle>
                  <CardDescription>Today's macro and calorie tracking</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="px-3 py-1 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-500">
                On track
              </Badge>
            </div>
        </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <motion.div 
                  variants={itemVariants}
                  className="relative"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                        <Activity className="h-4 w-4 text-rose-500" />
                      </div>
                      <span className="font-medium">Calories</span>
                    </div>
                    <span>
                      <span className="text-xl font-bold">{nutritionData.calories.current}</span>
                      <span className="text-muted-foreground text-sm"> / {nutritionData.calories.max} {nutritionData.calories.unit}</span>
                </span>
                  </div>
                  
                  <div className="h-4 w-full bg-muted/40 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(nutritionData.calories.current / nutritionData.calories.max) * 100}%` }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-400 relative"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(at_top_right,_rgba(255,255,255,0.2)_0%,transparent_60%)]"></div>
                    </motion.div>
                  </div>
                  
                  <div className="mt-1 text-xs text-right text-muted-foreground">
                    {Math.round((nutritionData.calories.current / nutritionData.calories.max) * 100)}% of daily target
                  </div>
                </motion.div>
                
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      label: "Protein",
                      data: nutritionData.protein,
                      color: "from-blue-500 to-cyan-400",
                      bg: "bg-blue-100 dark:bg-blue-900/30",
                      icon: Dumbbell,
                      iconColor: "text-blue-500"
                    },
                    {
                      label: "Carbs",
                      data: nutritionData.carbs,
                      color: "from-amber-500 to-yellow-400",
                      bg: "bg-amber-100 dark:bg-amber-900/30",
                      icon: Battery,
                      iconColor: "text-amber-500"
                    },
                    {
                      label: "Fat",
                      data: nutritionData.fat,
                      color: "from-green-500 to-emerald-400",
                      bg: "bg-green-100 dark:bg-green-900/30",
                      icon: Droplets,
                      iconColor: "text-green-500"
                    }
                  ].map((nutrient, idx) => (
                    <motion.div
                      key={nutrient.label}
                      variants={itemVariants}
                      className="rounded-xl border border-muted bg-card p-3 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex flex-col justify-between h-full">
                        <div className="mb-2 flex items-center gap-1.5">
                          <div className={cn("h-6 w-6 rounded-full flex items-center justify-center", nutrient.bg)}>
                            <nutrient.icon className={cn("h-3 w-3", nutrient.iconColor)} />
                          </div>
                          <span className="text-xs font-medium">{nutrient.label}</span>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold">{nutrient.data.current}{nutrient.data.unit}</div>
                          <div className="text-xs text-muted-foreground">{Math.round((nutrient.data.current / nutrient.data.max) * 100)}% of goal</div>
                        </div>
                        <div className="mt-2 h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(nutrient.data.current / nutrient.data.max) * 100}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className={cn("h-full rounded-full bg-gradient-to-r", nutrient.color)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Nutrition Insights Section */}
              <div className="rounded-xl border border-muted p-5 bg-gradient-to-br from-card to-muted/20">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-500" />
                  Nutrition Insights
                </h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-0.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    </div>
                    <span>You're <span className="font-medium text-blue-500">under your calorie target</span> by 500 calories</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mt-0.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    </div>
                    <span>Your <span className="font-medium text-amber-500">carb intake</span> is optimal for your workout plan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    </div>
                    <span>Try to increase your <span className="font-medium text-green-500">protein intake</span> by 15g to meet your goal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mt-0.5">
                      <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                    </div>
                    <span>Overall nutrition balance is <span className="font-medium text-purple-500">better than last week</span></span>
                  </li>
                </ul>
                
                <div className="mt-5 pt-4 border-t border-muted">
                  <h5 className="text-xs font-medium mb-2">Weekly Nutrition Balance</h5>
                  <div className="h-5 w-full rounded-full overflow-hidden bg-muted flex">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "30%" }}
                      transition={{ duration: 1 }}
                      className="h-full bg-blue-500 flex items-center justify-center"
                    >
                      <span className="text-[10px] text-white font-medium">30% Protein</span>
                    </motion.div>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "45%" }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-amber-500 flex items-center justify-center"
                    >
                      <span className="text-[10px] text-white font-medium">45% Carbs</span>
                    </motion.div>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "25%" }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="h-full bg-green-500 flex items-center justify-center"
                    >
                      <span className="text-[10px] text-white font-medium">25% Fat</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Wellness Goals - Modern Design */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-health-accent/20 to-health-primary/20 flex items-center justify-center">
              <Battery className="h-5 w-5 text-health-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Wellness Goals</h3>
              <p className="text-sm text-muted-foreground">Your progress towards better wellness</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {wellnessGoals.map((goal, index) => (
            <motion.div 
              key={goal.id}
              variants={itemVariants} 
              className="relative"
            >
              <Card className={cn(
                "overflow-hidden transition-all duration-300 hover:shadow-md border-transparent group",
                goal.border
              )}>
                <div className={cn("absolute inset-0 opacity-20", goal.bg)}></div>
                
                <CardContent className="p-6 relative">
                  <div className="mb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform",
                          goal.bg
                        )}>
                          <goal.icon className={cn("h-5 w-5", goal.iconColor)} />
                        </div>
                        <h4 className="font-medium">{goal.label}</h4>
                      </div>
                      <span className="text-lg font-bold">
                        {goal.current}<span className="text-sm font-normal text-muted-foreground">/{goal.max}</span> <span className="text-xs">{goal.unit}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Progress</span>
                      <span>{Math.round((goal.current / goal.max) * 100)}%</span>
                    </div>
                    <div className="h-3 w-full bg-muted/40 rounded-full overflow-hidden p-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(goal.current / goal.max) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={cn(
                          "h-full rounded-full bg-gradient-to-r relative",
                          goal.color
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-muted flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">Updated today</div>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px] font-normal", 
                        (goal.current / goal.max) > 0.7 
                          ? "bg-green-500/10 text-green-500 border-green-500/20" 
                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      )}
                    >
                      {(goal.current / goal.max) > 0.7 ? "On track" : "Needs focus"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
    </div>
      </motion.div>
    </motion.div>
  );
} 