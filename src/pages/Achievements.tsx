import React, { useState, useEffect } from "react";
import { 
  Award, 
  Trophy, 
  Medal, 
  Sparkles, 
  Clock, 
  Dumbbell, 
  Heart, 
  Brain, 
  Flame, 
  Target, 
  Calendar, 
  Zap,
  ArrowUpRight,
  Bell,
  Gift,
  ChevronRight,
  Share2,
  Users,
  Bookmark,
  Gem,
  Star,
  Crown,
  Rocket,
  TrendingUp,
  ChevronDown,
  Moon,
  Droplets
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import PageTitle from "@/components/layout/PageTitle";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

// Mock data for achievements
const achievementCategories = [
  { id: "all", name: "All Achievements", icon: Award },
  { id: "workout", name: "Workout", icon: Dumbbell },
  { id: "nutrition", name: "Nutrition", icon: Flame },
  { id: "mental", name: "Mental Health", icon: Brain },
  { id: "consistency", name: "Consistency", icon: Calendar },
  { id: "social", name: "Social", icon: Users }
];

// Current user level data
const userLevelData = {
  level: 7,
  title: "Health Enthusiast",
  currentXP: 3240,
  nextLevelXP: 4000,
  progress: 81, // percentage
  badges: 12,
  achievements: 14,
  memberSince: "February 2023",
  streakDays: 28
};

const achievements = [
  {
    id: 1,
    title: "Workout Warrior",
    description: "Complete 10 workouts",
    icon: Dumbbell,
    progress: 80,
    total: 10,
    current: 8,
    category: "workout",
    date: "Unlocked May 12, 2023",
    color: "from-orange-500 to-red-500",
    backgroundColor: "bg-orange-100 dark:bg-orange-900/20",
    iconColor: "text-orange-500 dark:text-orange-400",
    iconBackgroundColor: "bg-orange-100 dark:bg-orange-900/20",
    xpReward: 150,
    unlocksAt: 10,
    friendsCompleted: 12,
    featured: true,
    tier: "silver",
    upcomingMilestone: 10
  },
  {
    id: 2,
    title: "Mindfulness Master",
    description: "Complete 15 meditation sessions",
    icon: Brain,
    progress: 100,
    total: 15,
    current: 15,
    category: "mental",
    date: "Unlocked June 3, 2023",
    color: "from-purple-500 to-indigo-500",
    backgroundColor: "bg-purple-100 dark:bg-purple-900/20",
    iconColor: "text-purple-500 dark:text-purple-400",
    iconBackgroundColor: "bg-purple-100 dark:bg-purple-900/20",
    xpReward: 200,
    unlocksAt: 15,
    friendsCompleted: 5,
    featured: true,
    tier: "gold",
    milestone: 15
  },
  {
    id: 3,
    title: "Nutrition Ninja",
    description: "Log 20 healthy meals",
    icon: Flame,
    progress: 65,
    total: 20,
    current: 13,
    category: "nutrition",
    date: "In Progress",
    color: "from-green-500 to-emerald-500",
    backgroundColor: "bg-green-100 dark:bg-green-900/20",
    iconColor: "text-green-500 dark:text-green-400",
    iconBackgroundColor: "bg-green-100 dark:bg-green-900/20",
    xpReward: 250,
    unlocksAt: 20,
    friendsCompleted: 8,
    featured: false,
    tier: "silver",
    upcomingMilestone: 15
  },
  {
    id: 4,
    title: "Streak Seeker",
    description: "Maintain a 7-day streak",
    icon: Zap,
    progress: 100,
    total: 7,
    current: 7,
    category: "consistency",
    date: "Unlocked April 28, 2023",
    color: "from-blue-500 to-cyan-500",
    backgroundColor: "bg-blue-100 dark:bg-blue-900/20",
    iconColor: "text-blue-500 dark:text-blue-400",
    iconBackgroundColor: "bg-blue-100 dark:bg-blue-900/20",
    xpReward: 100,
    unlocksAt: 7,
    friendsCompleted: 22,
    featured: false,
    tier: "bronze",
    milestone: 7,
    nextMilestone: 14
  },
  {
    id: 5,
    title: "Heart Rate Hero",
    description: "Reach target heart rate in 5 workouts",
    icon: Heart,
    progress: 40,
    total: 5,
    current: 2,
    category: "workout",
    date: "In Progress",
    color: "from-red-500 to-pink-500",
    backgroundColor: "bg-red-100 dark:bg-red-900/20",
    iconColor: "text-red-500 dark:text-red-400",
    iconBackgroundColor: "bg-red-100 dark:bg-red-900/20",
    xpReward: 120,
    unlocksAt: 5,
    friendsCompleted: 7,
    featured: false,
    tier: "silver",
    upcomingMilestone: 3
  },
  {
    id: 6,
    title: "Early Bird",
    description: "Complete 3 workouts before 8am",
    icon: Clock,
    progress: 33,
    total: 3,
    current: 1,
    category: "consistency",
    date: "In Progress",
    color: "from-amber-500 to-yellow-500",
    backgroundColor: "bg-amber-100 dark:bg-amber-900/20",
    iconColor: "text-amber-500 dark:text-amber-400",
    iconBackgroundColor: "bg-amber-100 dark:bg-amber-900/20",
    xpReward: 75,
    unlocksAt: 3,
    friendsCompleted: 3,
    featured: false,
    tier: "bronze",
    upcomingMilestone: 2
  },
  {
    id: 7,
    title: "Goal Getter",
    description: "Achieve 5 personal goals",
    icon: Target,
    progress: 100,
    total: 5,
    current: 5,
    category: "mental",
    date: "Unlocked May 20, 2023",
    color: "from-teal-500 to-green-500",
    backgroundColor: "bg-teal-100 dark:bg-teal-900/20",
    iconColor: "text-teal-500 dark:text-teal-400",
    iconBackgroundColor: "bg-teal-100 dark:bg-teal-900/20",
    xpReward: 150,
    unlocksAt: 5,
    friendsCompleted: 9,
    featured: false,
    tier: "silver",
    milestone: 5,
    nextMilestone: 10
  },
  {
    id: 8,
    title: "Meal Prep Pro",
    description: "Create 3 weekly meal plans",
    icon: Calendar,
    progress: 67,
    total: 3,
    current: 2,
    category: "nutrition",
    date: "In Progress",
    color: "from-lime-500 to-emerald-500",
    backgroundColor: "bg-lime-100 dark:bg-lime-900/20",
    iconColor: "text-lime-500 dark:text-lime-400",
    iconBackgroundColor: "bg-lime-100 dark:bg-lime-900/20",
    xpReward: 80,
    unlocksAt: 3,
    friendsCompleted: 6,
    featured: false,
    tier: "bronze",
    upcomingMilestone: 3
  },
  {
    id: 9,
    title: "Sleep Champion",
    description: "Record 8+ hours of sleep for 5 nights",
    icon: Moon,
    progress: 60,
    total: 5,
    current: 3,
    category: "consistency",
    date: "In Progress",
    color: "from-indigo-500 to-violet-500",
    backgroundColor: "bg-indigo-100 dark:bg-indigo-900/20",
    iconColor: "text-indigo-500 dark:text-indigo-400",
    iconBackgroundColor: "bg-indigo-100 dark:bg-indigo-900/20",
    xpReward: 100,
    unlocksAt: 5,
    friendsCompleted: 11,
    featured: true,
    tier: "silver",
    upcomingMilestone: 5
  },
  {
    id: 10,
    title: "Hydration Hero",
    description: "Drink 2L of water daily for 7 days",
    icon: Droplets,
    progress: 71,
    total: 7,
    current: 5,
    category: "nutrition",
    date: "In Progress",
    color: "from-sky-500 to-blue-500",
    backgroundColor: "bg-sky-100 dark:bg-sky-900/20",
    iconColor: "text-sky-500 dark:text-sky-400",
    iconBackgroundColor: "bg-sky-100 dark:bg-sky-900/20",
    xpReward: 120,
    unlocksAt: 7,
    friendsCompleted: 15,
    featured: false,
    tier: "silver",
    upcomingMilestone: 7
  },
  {
    id: 11,
    title: "Community Champion",
    description: "Participate in 3 community challenges",
    icon: Users,
    progress: 33,
    total: 3,
    current: 1,
    category: "social",
    date: "In Progress",
    color: "from-pink-500 to-rose-500",
    backgroundColor: "bg-pink-100 dark:bg-pink-900/20",
    iconColor: "text-pink-500 dark:text-pink-400",
    iconBackgroundColor: "bg-pink-100 dark:bg-pink-900/20",
    xpReward: 200,
    unlocksAt: 3,
    friendsCompleted: 4,
    featured: true,
    tier: "gold",
    upcomingMilestone: 2
  },
  {
    id: 12,
    title: "Strength Builder",
    description: "Complete 10 strength training sessions",
    icon: Dumbbell,
    progress: 90,
    total: 10,
    current: 9,
    category: "workout",
    date: "In Progress",
    color: "from-orange-400 to-amber-600",
    backgroundColor: "bg-orange-100 dark:bg-orange-900/20",
    iconColor: "text-orange-500 dark:text-orange-400",
    iconBackgroundColor: "bg-orange-100 dark:bg-orange-900/20",
    xpReward: 150,
    unlocksAt: 10,
    friendsCompleted: 8,
    featured: false,
    tier: "silver",
    upcomingMilestone: 10
  }
];

// Badges data
const badges = [
  {
    id: 1,
    name: "Gold Achiever",
    icon: Trophy,
    description: "Earned for exceptional dedication and consistency",
    rarity: "Legendary",
    date: "Jun 2023",
    color: "from-yellow-400 to-amber-600",
    rarityColor: "text-yellow-500 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20",
    xpGranted: 500,
    unlockedBy: "Completing 10 gold tier achievements"
  },
  {
    id: 2,
    name: "Silver Supporter",
    icon: Medal,
    description: "Awarded for ongoing commitment to health goals",
    rarity: "Rare",
    date: "May 2023",
    color: "from-gray-400 to-slate-500",
    rarityColor: "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/20",
    xpGranted: 250,
    unlockedBy: "Completing 15 silver tier achievements"
  },
  {
    id: 3,
    name: "Wellness Warrior",
    icon: Award,
    description: "Recognized for balanced approach to mind and body health",
    rarity: "Epic",
    date: "Apr 2023",
    color: "from-indigo-500 to-blue-600",
    rarityColor: "text-indigo-500 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/20",
    xpGranted: 350,
    unlockedBy: "Balancing achievements across all categories"
  },
  {
    id: 4,
    name: "Mindful Master",
    icon: Sparkles,
    description: "Excellence in maintaining regular meditation practice",
    rarity: "Uncommon",
    date: "Mar 2023",
    color: "from-purple-500 to-violet-600",
    rarityColor: "text-purple-500 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20",
    xpGranted: 200,
    unlockedBy: "Completing all mental wellness achievements"
  },
  {
    id: 5,
    name: "30-Day Champion",
    icon: Crown,
    description: "Maintained an incredible 30-day streak of activity",
    rarity: "Legendary",
    date: "May 2023",
    color: "from-amber-400 to-yellow-600",
    rarityColor: "text-amber-500 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20",
    xpGranted: 600,
    unlockedBy: "Maintaining activity for 30 consecutive days"
  },
  {
    id: 6,
    name: "Progress Pioneer",
    icon: Rocket,
    description: "First to reach health milestones in your friend group",
    rarity: "Epic",
    date: "Apr 2023",
    color: "from-blue-500 to-cyan-500",
    rarityColor: "text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20",
    xpGranted: 300,
    unlockedBy: "Being in the top 5% of app users for achievements"
  }
];

// Achievements overview stats
const statsData = [
  { label: "Current Level", value: "7", icon: Star, color: "bg-emerald-500", change: "+2 this month" },
  { label: "Achievements Unlocked", value: "14", icon: Award, color: "bg-indigo-500", change: "+3 this month" },
  { label: "Completion Rate", value: "68%", icon: Target, color: "bg-green-500", change: "+5% this month" },
  { label: "Badges Earned", value: "6", icon: Medal, color: "bg-amber-500", change: "+2 this month" },
  { label: "Current Streak", value: "28 days", icon: Zap, color: "bg-blue-500", change: "Personal best!" },
  { label: "XP Earned", value: "3,240", icon: Gem, color: "bg-purple-500", change: "+450 this month" }
];

const Achievements = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [showNewAchievement, setShowNewAchievement] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState(null);

  const filteredAchievements = selectedCategory === "all" 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const handleAchievementUnlock = (achievement) => {
    setNewlyUnlocked(achievement);
    setShowNewAchievement(true);
  };

  return (
    <div className="space-y-8">
      {/* Show achievement unlock notification */}
      <AnimatePresence>
        {showNewAchievement && newlyUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 max-w-md"
          >
            <Alert className="border-0 shadow-lg bg-gradient-to-r from-health-primary/90 via-health-secondary/80 to-health-accent/80 text-white backdrop-blur-sm">
              <Trophy className="h-5 w-5 text-white" />
              <div className="ml-3">
                <AlertTitle className="text-white">Achievement Unlocked!</AlertTitle>
                <AlertDescription className="text-white/90">
                  {newlyUnlocked.title} - {newlyUnlocked.description}
                </AlertDescription>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-white/80">+{newlyUnlocked.xpReward} XP</span>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => setShowNewAchievement(false)}
                    className="h-7 bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    View
                  </Button>
                </div>
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Hero Section with Level Progress */}      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-health-primary/90 via-health-secondary/70 to-health-accent/80 text-white">        <div className="absolute inset-0 bg-pattern opacity-10"></div>        <div className="relative p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      rotate: 360,
                    }}
                    transition={{ 
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 rounded-full border-2 border-white/30 border-t-white"
                  />
                  <span className="text-xl font-bold">{userLevelData.level}</span>
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-yellow-500 text-black flex items-center justify-center text-xs font-bold shadow-lg"
                >
                  <Crown className="h-3 w-3" />
                </motion.div>
              </div>
              <div>
                <h2 className="text-xl font-bold">{userLevelData.title}</h2>
                <p className="text-white/80 text-sm">Member since {userLevelData.memberSince}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="secondary" className="bg-white/10 hover:bg-white/20 border-0 text-white">
                <Share2 className="h-4 w-4 mr-2" />
                Share Progress
              </Button>
              <Button variant="secondary" className="bg-white/10 hover:bg-white/20 border-0 text-white">
                <Users className="h-4 w-4 mr-2" />
                See Friends
              </Button>
            </div>
          </div>
          
          <div className="space-y-2 max-w-lg">
            <div className="flex justify-between text-sm">
              <span>Level Progress</span>
              <span>{userLevelData.currentXP} / {userLevelData.nextLevelXP} XP</span>
            </div>
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${userLevelData.progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <p className="text-sm text-white/70">
              <TrendingUp className="h-3 w-3 inline mr-1" /> 
              {userLevelData.nextLevelXP - userLevelData.currentXP} XP needed for Level {userLevelData.level + 1}
            </p>
          </div>

          {/* Featured Achievements */}
          <div className="pt-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-300" /> 
              Featured Achievements
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {achievements.filter(a => a.featured).map((achievement) => (
                <div 
                  key={achievement.id} 
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/15 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full bg-white/10 flex items-center justify-center`}>
                      <achievement.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{achievement.title}</h4>
                      <div className="flex justify-between text-xs text-white/70">
                        <span>{achievement.current}/{achievement.total}</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white rounded-full"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

            {/* Stats Overview with animated counters */}      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">        {statsData.map((stat, index) => (          <motion.div            key={index}            initial={{ opacity: 0, y: 20 }}            animate={{ opacity: 1, y: 0 }}            transition={{ duration: 0.4, delay: index * 0.1 }}            whileHover={{ y: -5, scale: 1.02 }}            className="group"          >            <Card className="border-none shadow-lg overflow-hidden h-full bg-gradient-to-br from-white/90 to-white/80 dark:from-gray-800/40 dark:to-gray-900/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300">              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r opacity-70" style={{                 backgroundImage: `linear-gradient(to right, var(--${stat.color.replace('bg-', '')}), var(--${stat.color.replace('bg-', '')})80)`              }}></div>              <CardContent className="p-5 relative">                <div className="flex items-center gap-3 mb-2">                  <div className="relative">                    <div className={`h-12 w-12 rounded-full ${stat.color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>                      <stat.icon className="h-5 w-5 text-white" />                    </div>                    <motion.div                       animate={{                         opacity: [0, 0.7, 0],                        scale: [0.8, 1.8]                      }}                      transition={{                         duration: 3,                        repeat: Infinity,                        delay: index * 0.5                      }}                      className={`absolute inset-0 rounded-full ${stat.color.replace('bg-', 'bg-')}/20`}                    />                  </div>                  <div>                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>                    <motion.div                      className="relative"                    >                      <motion.span                         initial={{ opacity: 0, y: 10 }}                        animate={{ opacity: 1, y: 0 }}                        transition={{ delay: 0.3 + (index * 0.1) }}                        className="text-xl font-bold bg-clip-text text-transparent"                        style={{                           backgroundImage: `linear-gradient(to right, var(--${stat.color.replace('bg-', '')}), var(--${stat.color.replace('bg-', '')})90)`                         }}                      >                        {stat.value}                      </motion.span>                    </motion.div>                  </div>                </div>                <div className="text-xs text-muted-foreground flex items-center bg-gray-50 dark:bg-gray-900/30 px-2 py-1 rounded-full">                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />                  <motion.span                    animate={{ opacity: [0.8, 1, 0.8] }}                    transition={{ duration: 2, repeat: Infinity }}                  >                    {stat.change}                  </motion.span>                </div>              </CardContent>            </Card>          </motion.div>        ))}      </div>
      
      <PageTitle 
        title="Achievements & Badges" 
        subtitle="Track your progress and unlock rewards as you reach health milestones"
      />

      {/* Main content tabs */}
      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="achievements" className="text-base">Achievements</TabsTrigger>
          <TabsTrigger value="badges" className="text-base">Badges & Rewards</TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {achievementCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  selectedCategory === category.id ? "bg-gradient-to-r from-health-primary to-health-accent" : "",
                  "rounded-full px-4"
                )}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Achievements grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full overflow-hidden hover:shadow-md transition-shadow border-border/50">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className={`h-12 w-12 rounded-full ${achievement.iconBackgroundColor} flex items-center justify-center`}>
                        <achievement.icon className={`h-6 w-6 ${achievement.iconColor}`} />
                      </div>
                      <Badge variant="outline" className={cn(
                        "px-2.5 py-0.5",
                        achievement.progress === 100 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800/30"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800/30"
                      )}>
                        {achievement.progress === 100 ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{achievement.title}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{achievement.current}/{achievement.total}</span>
                      </div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`absolute h-full bg-gradient-to-r ${achievement.color}`}
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      {achievement.date}
                    </p>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader className="py-5 px-6 border-b bg-muted/40">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Your Collection
                  </CardTitle>
                  <CardDescription>Badges and rewards you've earned on your health journey</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-health-primary to-health-accent hover:from-health-accent hover:to-health-primary md:self-end transition-all duration-300">
                  View All Possible Rewards
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {badges.map((badge, index) => (
                  <Card key={badge.id} className="relative overflow-hidden border-border/50 hover:shadow-md transition-shadow">
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r opacity-90 dark:opacity-80" 
                      style={{ backgroundImage: `linear-gradient(to right, ${badge.color.split(' ')[1]}, ${badge.color.split(' ')[3]})` }}>
                    </div>
                    <CardContent className="pt-6 pb-4 px-6 relative z-10 flex flex-col items-center">
                      <div className="h-24 w-24 rounded-full bg-background border-4 border-background shadow-lg flex items-center justify-center mb-4 mt-4">
                        <badge.icon className="h-10 w-10 text-transparent bg-clip-text bg-gradient-to-br stroke-2 dark:stroke-[1.5]" 
                          style={{ backgroundImage: `linear-gradient(to bottom right, ${badge.color.split(' ')[1]}, ${badge.color.split(' ')[3]})` }} />
                      </div>
                      <h3 className="font-semibold text-center">{badge.name}</h3>
                      <Badge className={`mt-2 ${badge.rarityColor}`}>
                        {badge.rarity}
                      </Badge>
                      <p className="text-center text-sm text-muted-foreground mt-3 line-clamp-3">
                        {badge.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Earned {badge.date}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievement milestones */}
          <Card className="border-none shadow-sm">
            <CardHeader className="py-5 px-6 border-b bg-muted/40">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-5 w-5 text-health-primary" />
                Upcoming Milestones
              </CardTitle>
              <CardDescription>Keep going to unlock these rewards</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {achievements.filter(a => a.progress < 100).slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                    <div className={`h-12 w-12 rounded-full ${achievement.iconBackgroundColor} flex-shrink-0 flex items-center justify-center`}>
                      <achievement.icon className={`h-6 w-6 ${achievement.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                        <h3 className="font-medium">{achievement.title}</h3>
                        <Badge variant="outline" className="w-fit">
                          {achievement.current}/{achievement.total} completed
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      <Progress value={achievement.progress} className="h-2" />
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full mt-4">
                  View All Upcoming Achievements
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Achievements; 