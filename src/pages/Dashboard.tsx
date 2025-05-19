import { Activity, Brain, Heart, Dumbbell, Sun, ArrowUpRight, Sparkles, Calendar, Flame, Droplets, TrendingUp, Apple, Video, Mic, MessageSquare, Clock, Zap, Medal, ChevronRight, PieChart, Shield, BarChart3, Check, Utensils, Baby, Bell, Search, User, Cloud, Waves, Target, Wind, Radar } from "lucide-react";
import HealthMetricCard from "@/components/dashboard/HealthMetricCard";
import HealthChart from "@/components/dashboard/HealthChart";
import AIRecommendation from "@/components/dashboard/AIRecommendation";
import MultimodalInput from "@/components/dashboard/MultimodalInput";
import UserProfile from "@/components/dashboard/UserProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Line, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar, BarChart, Bar, Legend } from "recharts";
import { ProgressDashboard } from "@/components/dashboard/ProgressDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

// Animation variants for staggered elements
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

// Fade-in animation variant
const fadeIn = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: {
      duration: 0.6
    } 
  }
};

// Slide-up animation variant
const slideUp = {
  hidden: { y: 20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

// Add these animation variants after the other animation variants
const pulseAnimation = {
  animate: {
    scale: [1, 1.03, 1],
    opacity: [0.9, 1, 0.9],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const floatAnimation = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const rotateAnimation = {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Sample sleep data
const sleepData = [
  { name: "Mon", value: 7.2, efficiency: 89 },
  { name: "Tue", value: 6.8, efficiency: 84 },
  { name: "Wed", value: 7.5, efficiency: 92 },
  { name: "Thu", value: 8.1, efficiency: 95 },
  { name: "Fri", value: 7.3, efficiency: 87 },
  { name: "Sat", value: 8.4, efficiency: 94 },
  { name: "Sun", value: 7.9, efficiency: 91 },
];

// Sample heart rate data
const heartRateData = [
  { name: "Mon", value: 68, recovery: 96 },
  { name: "Tue", value: 72, recovery: 92 },
  { name: "Wed", value: 75, recovery: 89 },
  { name: "Thu", value: 69, recovery: 94 },
  { name: "Fri", value: 70, recovery: 93 },
  { name: "Sat", value: 65, recovery: 97 },
  { name: "Sun", value: 67, recovery: 95 },
];

// Add these sample data for new charts after the existing sample data (heartRateData)
const weeklyActivityData = [
  { name: "Mon", workout: 45, meditation: 10, steps: 65 },
  { name: "Tue", workout: 30, meditation: 15, steps: 45 },
  { name: "Wed", workout: 60, meditation: 20, steps: 80 },
  { name: "Thu", workout: 45, meditation: 0, steps: 55 },
  { name: "Fri", workout: 30, meditation: 15, steps: 75 },
  { name: "Sat", workout: 90, meditation: 30, steps: 90 },
  { name: "Sun", workout: 20, meditation: 25, steps: 60 },
];

const nutritionPieData = [
  { name: "Protein", value: 30, color: "#3b82f6" },
  { name: "Carbs", value: 45, color: "#f59e0b" },
  { name: "Fat", value: 25, color: "#10b981" },
];

const healthRadarData = [
  { subject: 'Sleep', A: 85, fullMark: 100 },
  { subject: 'Diet', A: 70, fullMark: 100 },
  { subject: 'Workout', A: 80, fullMark: 100 },
  { subject: 'Cardio', A: 65, fullMark: 100 },
  { subject: 'Hydration', A: 75, fullMark: 100 },
  { subject: 'Mental', A: 90, fullMark: 100 },
];

const moodData = [
  { name: "Mon", value: 8 },
  { name: "Tue", value: 7 },
  { name: "Wed", value: 9 },
  { name: "Thu", value: 5 },
  { name: "Fri", value: 6 },
  { name: "Sat", value: 9 },
  { name: "Sun", value: 8 },
];

// AI insights with more detailed content and links
const aiInsights = [
  {
    id: 1,
    title: "Sleep quality improvement",
    description: "Your sleep pattern shows improved quality over the last week. Your deep sleep has increased by 14%.",
    icon: Clock,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    link: "/sleep-insights",
    action: "View sleep details"
  },
  {
    id: 2,
    title: "Meditation recommendation",
    description: "Adding 10 min of meditation could reduce your daily stress peaks. Try our guided sessions.",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    link: "/mental-wellness",
    action: "Start meditation"
  },
  {
    id: 3,
    title: "Workout intensity",
    description: "Your workout consistency is excellent. Increasing intensity by 10% could improve your performance.",
    icon: Dumbbell,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    link: "/workouts",
    action: "Adjust workout plan"
  },
  {
    id: 4,
    title: "Hydration alert",
    description: "Hydration levels are below optimal. Aim for 3L daily for better recovery and performance.",
    icon: Droplets,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    link: "/hydration-tracker",
    action: "Set hydration reminders"
  },
];

// Quick access items with proper links
const quickAccessItems = [
  {
    title: "Meal Planner",
    description: "Plan meals, track nutrition, and discover healthy recipes tailored to your goals.",
    icon: Apple,
    color: "text-health-primary",
    bgColor: "bg-health-primary/10",
    link: "/meal",
    isNew: true
  },
  {
    title: "Workouts",
    description: "Access your workout routines, track progress, and join live training sessions.",
    icon: Dumbbell,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    link: "/workouts"
  },
  {
    title: "AI Voice Assistant",
    description: "Ask health questions, get coaching, and log activities using voice commands.",
    icon: Mic,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    link: "/ai-voice-assistant",
    isNew: true
  },
  {
    title: "Live Training",
    description: "Join live workout sessions with trainers and other members in real-time.",
    icon: Video,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    link: "/live-workout",
    isNew: true
  },
  {
    title: "Analytics",
    description: "View detailed insights and trends about your health and fitness progress.",
    icon: BarChart3,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    link: "/analytics"
  },
  {
    title: "Health Calendar",
    description: "Schedule workouts, meals, and appointments in your personalized calendar.",
    icon: Calendar,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    link: "/calendar"
  },
  {
    title: "Food Scanner",
    description: "Scan food items to instantly get nutritional information and suggestions.",
    icon: Utensils,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    link: "/food-scanner",
    isNew: true
  },
  {
    title: "Health Data Vault",
    description: "Securely store and manage your health data with blockchain protection.",
    icon: Shield,
    color: "text-cyan-600",
    bgColor: "bg-cyan-600/10",
    link: "/data-vault",
    isNew: true
  },
];

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    // Simulate loading
    const loadTimer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => {
      clearInterval(timer);
      clearTimeout(loadTimer);
    };
  }, []);
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  // Get date in nice format
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Glass Header with Navigation */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        className="sticky top-0 z-10 -mx-6 px-6 py-3 backdrop-blur-md bg-background/70 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search dashboard..."
              className="pl-9 w-[250px] bg-background/40 border-muted rounded-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your Profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
        </div>
        </div>
        
        <div className="flex items-center justify-between md:justify-end space-x-3 w-full md:w-auto">
          <div className="flex flex-1 md:flex-none">
            <Button asChild variant="outline" size="sm" className="rounded-full text-xs border-health-primary/50 text-health-primary hover:bg-health-primary/10">
            <Link to="/analytics">
                <BarChart3 className="mr-1 h-3.5 w-3.5" /> Analytics
            </Link>
          </Button>
          </div>
          <Button asChild size="sm" className="rounded-full text-xs bg-gradient-to-r from-health-primary to-health-accent text-white hover:opacity-90 transition-all">
            <Link to="/calendar">
              <Calendar className="mr-1 h-3.5 w-3.5" /> Schedule
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Hero Section with Welcome and Stats */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-health-primary/5 to-health-accent/5 rounded-3xl -z-10"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5 rounded-3xl -z-10"></div>
        
      <motion.div
          variants={slideUp}
        initial="hidden"
        animate="show"
          className="px-6 py-8 md:p-8 rounded-3xl"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-health-primary/10 to-health-accent/10 border border-health-primary/20 text-health-primary text-sm font-medium mb-3">
                <Sun className="h-4 w-4 mr-1" /> {getGreeting()}, Tojin
              </div>
              <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">Your Wellness Dashboard</h1>
              <p className="text-muted-foreground mt-2">{formattedDate} • Here's your personal health snapshot for today</p>
            </div>
            
            <div className="flex items-center gap-4 self-end">
              <div className="flex flex-col items-end">
                <div className="text-xs text-muted-foreground">Current streak</div>
                <div className="flex items-center mt-1">
                  <div className="text-2xl font-bold text-health-primary mr-2">7</div>
                  <div className="text-xs px-1.5 py-0.5 rounded bg-health-primary/10 text-health-primary">days</div>
                </div>
              </div>
              
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-health-primary to-health-accent p-0.5">
                <div className="h-full w-full bg-card rounded-full flex items-center justify-center">
                  <Flame className="h-6 w-6 text-health-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Health Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                {healthMetrics.map((metric, index) => (
              <motion.div
                    key={index} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={metric.link}>
                  <Card className="border-border hover:border-health-primary/30 transition-all group hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${metric.trend === "up" ? "bg-green-500/10" : metric.trend === "down" ? "bg-blue-500/10" : "bg-yellow-500/10"}`}>
                          <metric.icon className={`h-4 w-4 ${metric.trend === "up" ? "text-green-500" : metric.trend === "down" ? "text-blue-500" : "text-yellow-500"}`} />
                      </div>
                        <div className={`text-xs font-medium flex items-center ${metric.trend === "up" ? "text-green-500" : metric.trend === "down" ? "text-blue-500" : "text-yellow-500"}`}>
                        {metric.trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
                        {metric.trend === "down" && <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />}
                        {metric.trendValue}
                      </div>
                    </div>
                      <div className="space-y-1">
                        <div className="text-xl font-bold">{metric.value}</div>
                        <p className="text-xs text-muted-foreground">{metric.title}</p>
                      </div>
                    <div className="mt-3">
                        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div 
                            className={`absolute h-full ${metric.trend === "up" ? "bg-green-500" : metric.trend === "down" ? "bg-blue-500" : "bg-yellow-500"}`} 
                          style={{ width: `${metric.progressValue}%` }}
        />
      </div>
              </div>
            </CardContent>
          </Card>
                </Link>
        </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Health Charts Section with enhanced styling */}
        <motion.div variants={itemVariants} className="grid gap-8 md:grid-cols-2">
          <Card className="border-border hover:border-health-primary/30 transition-all duration-300 hover:shadow-md overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-r from-health-primary/5 to-health-accent/5 flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-health-primary" />
                  Sleep Duration
                </CardTitle>
                <CardDescription>Hours of sleep tracked over the week</CardDescription>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                Improving
              </Badge>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-3xl font-bold">7.5</div>
                  <div className="text-xs text-muted-foreground">avg hours/night</div>
                </div>
                <Button asChild variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <Link to="/sleep-insights">
                    View Details <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
              <div className="h-[180px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
          data={sleepData} 
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="sleepStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#4F46E5"/>
                        <stop offset="100%" stopColor="#9333EA"/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" opacity={0.2} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      className="text-muted-foreground"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      className="text-muted-foreground"
                      domain={[5, 10]}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                      formatter={(value, name) => [`${value} hours`, 'Sleep']}
                    />
                    <Area
                      type="monotone"
          dataKey="value" 
                      stroke="url(#sleepStrokeGradient)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#sleepGradient)"
                      animationDuration={1500}
                      animationEasing="ease-out"
                      name="Sleep"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                  <div className="text-xs text-muted-foreground">Sleep Quality</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-base font-semibold">92%</span>
                    <div className="text-blue-500">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px]">
                        +5%
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20">
                  <div className="text-xs text-muted-foreground">Deep Sleep</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-base font-semibold">1.8 hrs</span>
                    <div className="text-indigo-500">
                      <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 text-[10px]">
                        +12%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border hover:border-health-primary/30 transition-all duration-300 hover:shadow-md overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-r from-health-accent/5 to-health-primary/5 flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4 text-health-accent" />
                  Heart Rate
                </CardTitle>
                <CardDescription>Resting heart rate (BPM) over time</CardDescription>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                Optimal
              </Badge>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-3xl font-bold">68</div>
                  <div className="text-xs text-muted-foreground">avg BPM</div>
                </div>
                <Button asChild variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <Link to="/heart-rate">
                    View Details <ArrowUpRight className="h-3 w-3" />
          </Link>
                </Button>
              </div>
              <div className="h-[180px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
          data={heartRateData} 
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E11D48" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#E11D48" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="heartRateStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#E11D48"/>
                        <stop offset="100%" stopColor="#F43F5E"/>
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" opacity={0.2} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      className="text-muted-foreground"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      className="text-muted-foreground"
                      domain={[60, 80]}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                      formatter={(value, name) => [`${value} BPM`, 'Heart Rate']}
                    />
                    <Area
                      type="monotone"
          dataKey="value" 
                      stroke="url(#heartRateStrokeGradient)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#heartRateGradient)"
                      animationDuration={1500}
                      animationEasing="ease-out"
                      name="Heart Rate"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20">
                  <div className="text-xs text-muted-foreground">Recovery Rate</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-base font-semibold">94%</span>
                    <div className="text-rose-500">
                      <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[10px]">
                        +3%
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                  <div className="text-xs text-muted-foreground">VO2 Max</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-base font-semibold">48.3</span>
                    <div className="text-amber-500">
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px]">
                        +1.4
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Advanced Health Metrics Section */}
        <motion.div variants={itemVariants} className="grid gap-8 grid-cols-1">
          <Card className="border-border hover:border-health-primary/30 transition-all duration-300 hover:shadow-lg overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-r from-health-primary/5 to-health-accent/5 flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-health-primary" />
                  Advanced Health Metrics
                </CardTitle>
                <CardDescription>Multi-dimensional view of your health</CardDescription>
              </div>
              <Tabs defaultValue="charts" className="w-[260px]">
                <TabsList className="grid w-full grid-cols-3 h-8">
                  <TabsTrigger value="charts" className="text-xs">Charts</TabsTrigger>
                  <TabsTrigger value="comparison" className="text-xs">Comparison</TabsTrigger>
                  <TabsTrigger value="radar" className="text-xs">Radar</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="charts" className="w-full">
                <TabsContent value="charts" className="mt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Activity Distribution Chart */}
                    <Card className="border-border/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Activity className="h-4 w-4 text-health-primary" />
                          Weekly Activity Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="h-[240px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={weeklyActivityData}
                              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                            >
                              <defs>
                                <linearGradient id="colorWorkout" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorMeditation" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <XAxis 
                                dataKey="name" 
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                className="text-muted-foreground"
                              />
                              <YAxis 
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                className="text-muted-foreground"
                              />
                              <RechartsTooltip 
                                contentStyle={{
                                  backgroundColor: "hsl(var(--card))",
                                  borderColor: "hsl(var(--border))",
                                  borderRadius: "var(--radius)",
                                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                                }}
                                labelStyle={{ color: "hsl(var(--foreground))" }}
                              />
                              <Area
                                type="monotone"
                                dataKey="workout"
                                stackId="1"
                                stroke="#8884d8"
                                fill="url(#colorWorkout)"
                                name="Workout (mins)"
                              />
                              <Area
                                type="monotone"
                                dataKey="meditation"
                                stackId="1"
                                stroke="#82ca9d"
                                fill="url(#colorMeditation)"
                                name="Meditation (mins)"
                              />
                              <Area
                                type="monotone"
                                dataKey="steps"
                                stackId="1"
                                stroke="#ffc658"
                                fill="url(#colorSteps)"
                                name="Steps (x100)"
                              />
                              <Legend iconType="circle" iconSize={8} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Mood Tracker Chart */}
                    <Card className="border-border/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Brain className="h-4 w-4 text-purple-500" />
                          Mood Tracking
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="h-[240px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={moodData}
                              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                            >
                              <defs>
                                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                </linearGradient>
                              </defs>
                              <XAxis 
                                dataKey="name" 
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                className="text-muted-foreground"
                              />
                              <YAxis 
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 10]}
                                ticks={[0, 2, 4, 6, 8, 10]}
                                className="text-muted-foreground"
                              />
                              <RechartsTooltip 
                                contentStyle={{
                                  backgroundColor: "hsl(var(--card))",
                                  borderColor: "hsl(var(--border))",
                                  borderRadius: "var(--radius)",
                                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                                }}
                                labelStyle={{ color: "hsl(var(--foreground))" }}
                                formatter={(value) => [`${value}/10`, 'Mood Score']}
                              />
                              <Bar
                                dataKey="value"
                                fill="url(#moodGradient)"
                                radius={[4, 4, 0, 0]}
                                barSize={30}
                                name="Mood Score"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="comparison" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nutrition Pie Chart */}
                    <Card className="border-border/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Apple className="h-4 w-4 text-green-500" />
                          Nutrient Balance
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 flex items-center justify-center">
                        <div className="h-[200px] w-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={nutritionPieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={70}
                                paddingAngle={2}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                              >
                                {nutritionPieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip 
                                contentStyle={{
                                  backgroundColor: "hsl(var(--card))",
                                  borderColor: "hsl(var(--border))",
                                  borderRadius: "var(--radius)",
                                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                                }}
                                formatter={(value) => [`${value}%`, '']}
                              />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Today vs. Goal Comparison */}
                    <Card className="border-border/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Target className="h-4 w-4 text-rose-500" />
                          Today vs. Weekly Goal
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-xs text-muted-foreground">Steps</span>
                              <span className="text-xs font-medium">7,543 / 10,000</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "75.4%" }}
                                transition={{ duration: 1, delay: 0.1 }}
                                className="h-full bg-health-primary"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-xs text-muted-foreground">Water (L)</span>
                              <span className="text-xs font-medium">1.8 / 3.0</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "60%" }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-full bg-blue-500"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-xs text-muted-foreground">Active Calories</span>
                              <span className="text-xs font-medium">324 / 500</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "64.8%" }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className="h-full bg-amber-500"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-xs text-muted-foreground">Active Minutes</span>
                              <span className="text-xs font-medium">42 / 60</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "70%" }}
                                transition={{ duration: 1, delay: 0.4 }}
                                className="h-full bg-green-500"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="radar" className="mt-0">
                  <Card className="border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Radar className="h-4 w-4 text-indigo-500" />
                        Wellness Balance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex items-center justify-center">
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart outerRadius={100} data={healthRadarData}>
                            <PolarGrid stroke="hsl(var(--border))" />
                            <PolarAngleAxis 
                              dataKey="subject" 
                              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                            />
                            <PolarRadiusAxis 
                              angle={30} 
                              domain={[0, 100]} 
                              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                              axisLine={false}
                            />
                            <RechartsRadar 
                              name="Health Metrics" 
                              dataKey="A" 
                              stroke="hsl(var(--health-primary))" 
                              fill="hsl(var(--health-primary))" 
                              fillOpacity={0.3} 
                            />
                            <RechartsTooltip 
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                borderColor: "hsl(var(--border))",
                                borderRadius: "var(--radius)",
                                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                              }}
                              formatter={(value) => [`${value}/100`, '']}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wellness Timeline */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-health-primary/20 to-health-accent/20 flex items-center justify-center">
                <Waves className="h-5 w-5 text-health-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Wellness Timeline</h3>
                <p className="text-sm text-muted-foreground">Your health journey for today</p>
              </div>
            </div>
            <Badge variant="outline" className="px-3 py-1 bg-gradient-to-r from-health-primary/10 to-health-accent/10 border-health-primary/20 text-health-primary">
              <motion.span 
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="h-2 w-2 rounded-full bg-health-primary mr-2"
              ></motion.span>
              Live
            </Badge>
          </div>

          <Card className="border-border hover:border-health-primary/30 transition-all duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <ScrollArea className="h-[300px] pr-4">
                <div className="relative">
                  <div className="absolute top-0 bottom-0 left-[19px] w-[2px] bg-border"></div>
                  
                  <div className="space-y-6">
                    {/* Current Activity */}
                    <div className="relative pl-12">
                      <div className="absolute left-0 h-10 w-10 rounded-full bg-gradient-to-r from-health-primary to-health-accent flex items-center justify-center">
                        <motion.div 
                          animate={pulseAnimation.animate}
                          className="absolute inset-0 rounded-full"
                        />
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <div className="bg-health-primary/5 rounded-lg p-4 border border-health-primary/20">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-health-primary">Current Activity</h4>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            Now
                          </Badge>
                        </div>
                        <p className="text-sm">You're being active right now! Keep moving to reach your daily goal.</p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>11:24 AM</span>
                          <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
                          <span>1,223 steps</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Meditation Session */}
                    <div className="relative pl-12">
                      <div className="absolute left-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Brain className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="bg-card rounded-lg p-4 border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Meditation Session</h4>
                          <span className="text-xs text-muted-foreground">10:30 AM</span>
                        </div>
                        <p className="text-sm">Completed a 10-minute mindfulness meditation session.</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-xs">
                            Mindfulness
                          </Badge>
                          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-xs">
                            Focus
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hydration */}
                    <div className="relative pl-12">
                      <div className="absolute left-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Droplets className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="bg-card rounded-lg p-4 border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Hydration Update</h4>
                          <span className="text-xs text-muted-foreground">9:45 AM</span>
                        </div>
                        <p className="text-sm">Added 500ml of water to your daily intake.</p>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-muted-foreground">Daily Progress</span>
                            <span>1.5L / 3.0L</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-muted/50 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: "50%" }}
                              transition={{ duration: 1 }}
                              className="h-full rounded-full bg-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Morning Workout */}
                    <div className="relative pl-12">
                      <div className="absolute left-0 h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <Dumbbell className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="bg-card rounded-lg p-4 border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Morning Workout</h4>
                          <span className="text-xs text-muted-foreground">7:30 AM</span>
                        </div>
                        <p className="text-sm">Completed a 30-minute strength training session.</p>
                        <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                          <div className="p-2 bg-muted/30 rounded">
                            <div className="font-medium">235</div>
                            <div className="text-muted-foreground">Cal Burned</div>
                          </div>
                          <div className="p-2 bg-muted/30 rounded">
                            <div className="font-medium">32 min</div>
                            <div className="text-muted-foreground">Duration</div>
                          </div>
                          <div className="p-2 bg-muted/30 rounded">
                            <div className="font-medium">💪 5/5</div>
                            <div className="text-muted-foreground">Intensity</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Three Column Section: Improved Profile, AI Insights, Today's Focus */}
        <motion.div variants={itemVariants} className="grid gap-8 md:grid-cols-3">
          {/* Profile Card - Enhanced */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden h-full border-none shadow-md">
              <div className="relative h-32 bg-gradient-to-r from-health-primary to-health-accent overflow-hidden">
                <div className="absolute inset-0 bg-[url('/mesh-pattern.png')] opacity-20 mix-blend-overlay"></div>
                <motion.div 
                  className="absolute w-64 h-64 rounded-full bg-white/10 -top-32 -right-32"
                  animate={rotateAnimation.animate}
                />
                <motion.div 
                  className="absolute w-40 h-40 rounded-full bg-white/5 top-20 -left-10"
                  animate={{ 
                    rotate: -360,
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 15,
                    ease: "linear"
                  }}
                />
              </div>
              <CardContent className="relative -mt-16 px-6">
                <div className="flex justify-center">
                  <div className="relative h-28 w-28 rounded-full border-4 border-card bg-card p-1">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.05, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-health-primary/20 to-health-accent/20 rounded-full blur-md"
                    />
                    <Avatar className="h-full w-full">
                      <AvatarImage 
                        src="https://t4.ftcdn.net/jpg/00/87/28/19/360_F_87281963_29bnkFXa6RQnJYWeRfrSpieagNxw1Rru.jpg" 
                        alt="Tojin Varkey Simson"
                        className="object-cover"
                      />
                      <AvatarFallback>TVS</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-card flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-semibold">Tojin Varkey Simson</h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Badge variant="outline" className="bg-gradient-to-r from-health-primary/10 to-health-accent/10 text-health-primary border-health-primary/20">
                      Premium
                    </Badge>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      Level 8
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">Today's Goal</span>
                      <span className="font-medium">75% complete</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-health-primary to-health-accent"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between py-4 border-t border-b">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-center"
                    >
                      <div className="text-xl font-semibold">7</div>
                      <div className="text-xs text-muted-foreground mt-1">Day Streak</div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-center"
                    >
                      <div className="text-xl font-semibold">12k</div>
                      <div className="text-xs text-muted-foreground mt-1">Steps</div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-center"
                    >
                      <div className="text-xl font-semibold">3/5</div>
                      <div className="text-xs text-muted-foreground mt-1">Workouts</div>
                    </motion.div>
                  </div>
                  
                  <Button asChild className="w-full rounded-full bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90 text-white transition-all">
                  <Link to="/profile-settings">
                      View Profile
                  </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
      </div>
      
          {/* AI Insights Card - Enhanced */}
        <div className="md:col-span-1">
            <Card className="h-full border-none shadow-md overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-health-primary/5 to-health-accent/5 -z-10"></div>
              <CardHeader className="border-b px-6 py-5 bg-card/70 backdrop-blur-sm">
                <CardTitle className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-health-primary to-health-accent flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                  AI Health Insights
                </CardTitle>
                <CardDescription>Personalized recommendations based on your data</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-border/50">
                  {aiInsights.map((insight, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="relative"
                    >
                      <div className="flex items-start gap-3 p-4 hover:bg-muted/30 transition-colors">
                        <div className={cn("h-9 w-9 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5", insight.bgColor)}>
                          <insight.icon className={cn("h-4.5 w-4.5", insight.color)} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{insight.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                          <Link to={insight.link}>
                            <Button variant="link" className="h-6 px-0 text-xs font-medium text-health-primary hover:text-health-accent">
                              {insight.action} <ArrowUpRight className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="px-6 py-4 border-t bg-card/50 backdrop-blur-sm">
                <Button asChild variant="secondary" className="w-full rounded-full hover:bg-health-primary/10 border border-health-primary/20 text-health-primary">
                  <Link to="/ai-coach-chat">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat with AI Coach
                  </Link>
                </Button>
              </CardFooter>
            </Card>
        </div>
          
          {/* Today's Focus - Enhanced */}
        <div className="md:col-span-1">
            <Card className="h-full border-none shadow-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-health-accent/5 to-health-primary/5 -z-10"></div>
              <CardHeader className="border-b px-6 py-5 bg-card/70 backdrop-blur-sm">
                <CardTitle className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-health-accent to-health-primary flex items-center justify-center">
                    <Zap className="h-3.5 w-3.5 text-white" />
                  </div>
                  Today's Focus
                </CardTitle>
                <CardDescription>Key areas to prioritize today</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {todaysFocus.map((focus, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="group"
                    >
                      <div className="flex items-center gap-4">
                      <div className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center relative group-hover:scale-105 transition-transform",
                        focus.bgColor
                      )}>
                        <focus.icon className={cn("h-6 w-6", focus.iconColor)} />
                          <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-card border border-border flex items-center justify-center text-[10px] font-medium">
                            {focus.progress}%
                          </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{focus.title}</h4>
                          <span className="text-sm text-muted-foreground">{focus.value}</span>
                        </div>
                          <div className="relative h-2 w-full mt-2 overflow-hidden rounded-full bg-muted">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${focus.progress}%` }}
                              transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                              className={cn("absolute h-full", focus.progressColor)} 
          />
        </div>
        </div>
      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="px-6 py-4 border-t bg-card/50 backdrop-blur-sm">
                <Button asChild className="w-full rounded-full bg-gradient-to-r from-health-accent to-health-primary text-white hover:opacity-90 transition-all">
                  <Link to="/daily-schedule">
                    <Check className="mr-2 h-4 w-4" />
                    Start Next Activity
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </motion.div>
        
        {/* Bottom Section - Summary and Widgets */}
        <motion.div 
          variants={itemVariants}
          className="grid gap-6 md:grid-cols-3"
        >
          {/* Achievements and Badges */}
          <div className="md:col-span-2">
            <Card className="border-border overflow-hidden hover:shadow-md hover:border-health-primary/30 transition-all duration-300 h-full">
              <CardHeader className="border-b bg-gradient-to-r from-health-primary/5 to-health-accent/5 flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Medal className="h-4 w-4 text-amber-500" />
                    Weekly Achievements
                  </CardTitle>
                  <CardDescription>Your progress this week</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View All <ArrowUpRight className="h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">3 achievements unlocked</h3>
                      <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">+2 this week</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">You're on a 7-day streak!</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-health-primary">280</div>
                    <div className="text-xs text-muted-foreground">points earned</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: "Early Bird", icon: Sun, color: "bg-amber-500/10 text-amber-500", complete: true },
                    { name: "Step Master", icon: Activity, color: "bg-blue-500/10 text-blue-500", complete: true },
                    { name: "Workout Warrior", icon: Dumbbell, color: "bg-green-500/10 text-green-500", complete: true },
                    { name: "Meal Planner", icon: Apple, color: "bg-health-primary/10 text-health-primary", complete: false },
                    { name: "Mind Master", icon: Brain, color: "bg-purple-500/10 text-purple-500", complete: false },
                    { name: "Sleep Guardian", icon: Clock, color: "bg-indigo-500/10 text-indigo-500", complete: false },
                  ].map((badge, index) => (
                    <div 
                      key={index}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border ${badge.complete ? 'border-health-primary/20 bg-health-primary/5' : 'border-border bg-card'} transition-all hover:shadow-sm`}
                    >
                      <div className={`h-10 w-10 rounded-full ${badge.color} flex items-center justify-center mb-2 relative`}>
                        <badge.icon className="h-5 w-5" />
                        {badge.complete && (
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <Check className="h-2 w-2 text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-center">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Weather and Recommendation Widget */}
          <div className="md:col-span-1">
            <Card className="border-border overflow-hidden hover:shadow-md hover:border-health-primary/30 transition-all duration-300 h-full">
              <div className="relative h-24 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <Sun className="relative h-12 w-12 text-white drop-shadow-lg" />
              </div>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">76°F</h3>
                    <p className="text-sm text-muted-foreground">Sunny, New York</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Perfect for a walk!</p>
                    <div className="text-xs text-muted-foreground">12:00 PM · Jun 15</div>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 mb-4">
                  <h4 className="text-sm font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Sparkles className="h-4 w-4" /> Activity Suggestion
                  </h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Great weather for outdoor activities! How about a 30 minute walk in the park?</p>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[
                    { day: "Thu", temp: "75°", icon: Sun },
                    { day: "Fri", temp: "72°", icon: Sun },
                    { day: "Sat", temp: "69°", icon: Cloud },
                  ].map((day, index) => (
                    <div key={index} className="flex flex-col items-center p-2 rounded-lg hover:bg-muted transition-colors">
                      <span className="text-xs text-muted-foreground">{day.day}</span>
                      <day.icon className="h-5 w-5 my-1 text-blue-500" />
                      <span className="text-xs font-medium">{day.temp}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
        
        {/* Health Progress Section */}
        <motion.div variants={itemVariants}>
          <ProgressDashboard />
        </motion.div>
        
        {/* Quick Access Section - Modern UI version */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-health-primary/20 to-health-accent/20 flex items-center justify-center">
                <Zap className="h-4 w-4 text-health-primary" />
              </div>
              <h3 className="text-xl font-bold">Quick Access</h3>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-full text-xs gap-1 border-health-primary/30 text-health-primary hover:bg-health-primary/10">
              <Link to="/dashboard/customize">
                <span>Customize</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {quickAccessItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.3 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 border-border/40 overflow-hidden h-full relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-health-primary/[0.03] to-health-accent/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                <Link to={item.link} className="block h-full">
                    <CardHeader className="p-5 pb-2">
                    <div className="flex justify-between items-start">
                        <div className="relative">
                          <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", item.bgColor)}>
                        <item.icon className={cn("h-5 w-5", item.color)} />
                          </div>
                          <motion.div
                            animate={{ 
                              scale: [1, 1.1, 1],
                              opacity: [0, 0.5, 0]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-health-primary/20 to-health-accent/20 rounded-xl"
                          />
                      </div>
                      {item.isNew && (
                          <Badge variant="outline" className="text-[10px] bg-health-accent/10 text-health-accent border-health-accent/20 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-health-accent animate-pulse"></span>
                          New
                        </Badge>
                      )}
                    </div>
                      <CardTitle className="text-base mt-3 group-hover:text-health-primary transition-colors">{item.title}</CardTitle>
                  </CardHeader>
                    <CardContent className="px-5 pt-1 pb-3">
                    <CardDescription className="line-clamp-2 text-xs">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                    <CardFooter className="p-5 pt-0 flex justify-between items-center">
                      <div className="flex items-center text-sm font-medium text-health-primary">
                      Open
                    </div>
                      <div className="h-8 w-8 rounded-full bg-health-primary/10 flex items-center justify-center transform translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <ArrowUpRight className="h-4 w-4 text-health-primary" />
                      </div>
                  </CardFooter>
                </Link>
              </Card>
              </motion.div>
            ))}
    </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Enhanced health metrics with links
const healthMetrics = [
  {
    title: "Resting Heart Rate",
    value: "68 bpm",
    icon: Heart,
    trend: "down",
    trendValue: "3 bpm",
    progressValue: 68,
    link: "/heart-rate"
  },
  {
    title: "Sleep Quality",
    value: "7.5 hrs",
    icon: Activity,
    trend: "up",
    trendValue: "0.5 hrs",
    progressValue: 75,
    link: "/sleep-insights"
  },
  {
    title: "Stress Level",
    value: "Medium",
    icon: Brain,
    trend: "neutral",
    trendValue: "No change",
    progressValue: 50,
    link: "/mental-wellness"
  },
  {
    title: "Workout Streak",
    value: "7 days",
    icon: Dumbbell,
    trend: "up",
    trendValue: "2 days",
    progressValue: 83,
    link: "/workouts"
  }
];

// Enhanced today's focus items
const todaysFocus = [
  {
    title: "Hydration",
    value: "1.2 / 3.0 L",
    icon: Droplets,
    progress: 40,
    bgColor: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-500",
    progressColor: "bg-blue-500"
  },
  {
    title: "Activity",
    value: "5.4k / 10k steps",
    icon: Flame,
    progress: 54,
    bgColor: "bg-orange-50 dark:bg-orange-950",
    iconColor: "text-orange-500",
    progressColor: "bg-orange-500"
  },
  {
    title: "Meditation",
    value: "0 / 10 min",
    icon: Brain,
    progress: 0,
    bgColor: "bg-purple-50 dark:bg-purple-950",
    iconColor: "text-purple-500",
    progressColor: "bg-purple-500"
  }
];

export default Dashboard;
