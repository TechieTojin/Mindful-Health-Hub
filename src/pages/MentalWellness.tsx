import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, Clock, Headphones, MoonStar, Play, Plus, Sun, BookOpen, 
  CalendarDays, ChevronDown, PenLine, Smile, Frown, Meh, ThumbsUp,
  Heart, Sparkles, Leaf, Activity, Target, ArrowUpRight, Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const meditationSessions = [
  {
    id: 1,
    title: "Morning Mindfulness",
    description: "Start your day with clarity and intention",
    duration: 10,
    category: "mindfulness",
    time: "morning",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    title: "Stress Relief",
    description: "Release tension and find calm in the midst of stress",
    duration: 15,
    category: "stress",
    time: "any",
    image: "https://images.unsplash.com/photo-1528319725582-ddc096101511?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    title: "Deep Sleep",
    description: "Prepare your mind for restful sleep",
    duration: 20,
    category: "sleep",
    time: "evening",
    image: "https://images.unsplash.com/photo-1511295742362-92754fef59a4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 4,
    title: "Focus Boost",
    description: "Sharpen your concentration and mental clarity",
    duration: 8,
    category: "focus",
    time: "any",
    image: "https://images.unsplash.com/photo-1602192509154-0b900ee1f851?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

const journalEntries = [
  {
    id: 1,
    date: "2023-05-12",
    title: "Finding Balance",
    excerpt: "Today I focused on creating more balance between work and relaxation...",
    mood: "positive",
    tags: ["work-life balance", "self-care"]
  },
  {
    id: 2,
    date: "2023-05-10",
    title: "Managing Anxiety",
    excerpt: "Felt anxious about the upcoming presentation, used breathing techniques...",
    mood: "neutral",
    tags: ["anxiety", "coping strategies"]
  },
  {
    id: 3,
    date: "2023-05-07",
    title: "Difficult Conversation",
    excerpt: "Had to have a challenging talk with a coworker today. It went better than expected...",
    mood: "positive",
    tags: ["communication", "work"]
  },
  {
    id: 4,
    date: "2023-05-04",
    title: "Feeling Overwhelmed",
    excerpt: "Too many deadlines converging this week. Need to practice better time management...",
    mood: "negative",
    tags: ["stress", "time management"]
  }
];

const moodData = [
  { date: "05/05", mood: 4 },
  { date: "05/06", mood: 3 },
  { date: "05/07", mood: 4 },
  { date: "05/08", mood: 5 },
  { date: "05/09", mood: 4 },
  { date: "05/10", mood: 3 },
  { date: "05/11", mood: 3 },
  { date: "05/12", mood: 4 },
  { date: "05/13", mood: 5 },
  { date: "05/14", mood: 4 },
  { date: "05/15", mood: 2 },
  { date: "05/16", mood: 3 },
  { date: "05/17", mood: 4 }
];

const MeditationCard = ({ session }: { session: typeof meditationSessions[0] }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group border border-muted/50">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={session.image} 
            alt={session.title} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-foreground text-xs">
            {session.time === "morning" ? (
              <Sun className="h-3 w-3 text-amber-500" />
            ) : session.time === "evening" ? (
              <MoonStar className="h-3 w-3 text-indigo-500" />
            ) : (
              <Clock className="h-3 w-3 text-sky-500" />
            )}
            <span>{session.time}</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="secondary" size="sm" className="w-full gap-2 bg-white/90 hover:bg-white text-black">
              <Play className="h-4 w-4" /> Begin Session
            </Button>
          </div>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            {session.category === "mindfulness" && <Leaf className="h-4 w-4 text-emerald-500" />}
            {session.category === "stress" && <Zap className="h-4 w-4 text-amber-500" />}
            {session.category === "sleep" && <MoonStar className="h-4 w-4 text-indigo-500" />}
            {session.category === "focus" && <Target className="h-4 w-4 text-rose-500" />}
            {session.title}
          </CardTitle>
          <CardDescription>{session.description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{session.duration} min</span>
            <Badge variant="outline" className="ml-auto">
              {session.category}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const JournalEntryCard = ({ entry }: { entry: typeof journalEntries[0] }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="hover:shadow-md transition-all duration-300 border border-muted/50 overflow-hidden group">
        <div className={`h-1 w-full ${
          entry.mood === "positive" ? "bg-gradient-to-r from-green-400 to-emerald-500" :
          entry.mood === "neutral" ? "bg-gradient-to-r from-amber-400 to-yellow-500" :
          "bg-gradient-to-r from-red-400 to-rose-500"
        }`}></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base group-hover:text-primary transition-colors">{entry.title}</CardTitle>
            <div className="flex items-center text-muted-foreground text-xs">
              <CalendarDays className="h-3 w-3 mr-1" />
              {new Date(entry.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{entry.excerpt}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-1 flex-wrap">
              {entry.tags.map((tag, index) => (
                <span key={index} className="text-xs px-2 py-0.5 bg-muted rounded-full">{tag}</span>
              ))}
            </div>
            <div>
              {entry.mood === "positive" && <Smile className="h-5 w-5 text-green-500" />}
              {entry.mood === "neutral" && <Meh className="h-5 w-5 text-amber-500" />}
              {entry.mood === "negative" && <Frown className="h-5 w-5 text-red-500" />}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/10 pt-2">
          <Button variant="ghost" size="sm" className="w-full text-xs gap-1 hover:bg-background/80">
            Read Full Entry <ArrowUpRight className="h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const MoodTracker = () => {
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  
  return (
    <Card className="border border-muted/50 overflow-hidden">
      <CardHeader className="border-b bg-muted/20">
        <CardTitle className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-amber-400/20 to-yellow-400/20 flex items-center justify-center">
            <Heart className="h-3 w-3 text-amber-600 dark:text-amber-400" />
          </div>
          Mood Tracker
        </CardTitle>
        <CardDescription>Track your emotional wellbeing over time</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3">Today's Mood</h4>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map((mood) => (
                <motion.button
                  key={mood}
                  onClick={() => setCurrentMood(mood)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 ${
                    currentMood === mood 
                      ? 'bg-primary/15 border border-primary/50 shadow-sm' 
                      : 'hover:bg-muted border border-transparent hover:scale-105'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="mb-2">
                    {mood === 1 && (
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${currentMood === mood ? 'bg-red-100 dark:bg-red-900/30' : 'bg-muted'}`}>
                        <Frown className={`h-8 w-8 ${currentMood === mood ? 'text-red-500' : 'text-muted-foreground'}`} />
                      </div>
                    )}
                    {mood === 2 && (
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${currentMood === mood ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-muted'}`}>
                        <Frown className={`h-8 w-8 ${currentMood === mood ? 'text-orange-500' : 'text-muted-foreground'}`} />
                      </div>
                    )}
                    {mood === 3 && (
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${currentMood === mood ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-muted'}`}>
                        <Meh className={`h-8 w-8 ${currentMood === mood ? 'text-amber-500' : 'text-muted-foreground'}`} />
                      </div>
                    )}
                    {mood === 4 && (
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${currentMood === mood ? 'bg-lime-100 dark:bg-lime-900/30' : 'bg-muted'}`}>
                        <Smile className={`h-8 w-8 ${currentMood === mood ? 'text-lime-500' : 'text-muted-foreground'}`} />
                      </div>
                    )}
                    {mood === 5 && (
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${currentMood === mood ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'}`}>
                        <Smile className={`h-8 w-8 ${currentMood === mood ? 'text-green-500' : 'text-muted-foreground'}`} />
                      </div>
                    )}
                  </div>
                  <span className={`text-xs font-medium ${currentMood === mood ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {mood === 1 && "Very Bad"}
                    {mood === 2 && "Bad"}
                    {mood === 3 && "Neutral"}
                    {mood === 4 && "Good"}
                    {mood === 5 && "Great"}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="pt-4">
            <div className="flex justify-between mb-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Mood History
              </h4>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                View Full History <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
            <div className="bg-muted/30 p-4 rounded-xl">
              <div className="flex items-end h-32 gap-1">
                {moodData.map((day, i) => (
                  <motion.div 
                    key={i} 
                    className="flex flex-col items-center flex-1"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <motion.div 
                      className={`w-full rounded-md transition-all ${
                        day.mood === 1 ? 'bg-gradient-to-t from-red-500 to-red-400 h-[20%]' :
                        day.mood === 2 ? 'bg-gradient-to-t from-orange-500 to-orange-400 h-[40%]' :
                        day.mood === 3 ? 'bg-gradient-to-t from-amber-500 to-amber-400 h-[60%]' :
                        day.mood === 4 ? 'bg-gradient-to-t from-lime-500 to-lime-400 h-[80%]' :
                        'bg-gradient-to-t from-green-500 to-green-400 h-full'
                      }`}
                      initial={{ height: 0 }}
                      animate={{ height: day.mood === 1 ? '20%' : day.mood === 2 ? '40%' : day.mood === 3 ? '60%' : day.mood === 4 ? '80%' : '100%' }}
                      transition={{ duration: 0.7, delay: 0.3 + (i * 0.05) }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="absolute top-0 w-full opacity-0 hover:opacity-100 transition-opacity text-[10px] text-center -mt-5 text-muted-foreground">
                        {day.mood === 1 ? 'Very Bad' : day.mood === 2 ? 'Bad' : day.mood === 3 ? 'Neutral' : day.mood === 4 ? 'Good' : 'Great'}
                      </div>
                    </motion.div>
                    <span className="text-[10px] mt-1 text-muted-foreground">{day.date.split('/')[1]}</span>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>May 5</span>
                <span>May 17</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/10 pt-4">
        <Button className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
          <PenLine className="h-4 w-4" /> Add Journal Entry
        </Button>
      </CardFooter>
    </Card>
  );
};

const MentalWellness = () => {
  const [activeJournalTab, setActiveJournalTab] = useState<string>("recent");
  
  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/10 dark:to-indigo-950/10 rounded-2xl -z-10 blur-sm"></div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl border border-purple-100/50 dark:border-purple-800/20">
          <div className="space-y-1">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium mb-2">
              <Brain className="h-4 w-4 mr-2" /> Mental Health
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Mental Wellness</h1>
            <p className="text-muted-foreground">Monitor your emotional wellbeing and practice mindfulness</p>
          </div>
          <Button className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
            <Plus className="h-4 w-4" /> New Journal Entry
          </Button>
        </div>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2"
      >
        <motion.div variants={itemVariants}>
          <Card className="border border-muted/50 overflow-hidden hover:shadow-md transition-all duration-300">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                  <Activity className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                </div>
                Today's Wellness Score
              </CardTitle>
              <CardDescription>Based on your sleep, activity, and stress levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle 
                      cx="50%" 
                      cy="50%" 
                      r="40%" 
                      fill="none" 
                      stroke="hsl(var(--muted))" 
                      strokeWidth="10%" 
                      strokeLinecap="round"
                    />
                    <motion.circle 
                      cx="50%" 
                      cy="50%" 
                      r="40%" 
                      fill="none" 
                      stroke="url(#wellnessGradient)" 
                      strokeWidth="10%" 
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "251.2", strokeDashoffset: "251.2" }}
                      animate={{ strokeDashoffset: "70" }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                    <defs>
                      <linearGradient id="wellnessGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <motion.span 
                      className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 1 }}
                    >
                      76
                    </motion.span>
                    <span className="text-muted-foreground text-sm">Very Good</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Sleep Quality</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Stress Level</span>
                    <span className="text-sm font-medium">32%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "32%" }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Mood Balance</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="border border-muted/50 overflow-hidden hover:shadow-md transition-all duration-300 h-full">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500/20 to-violet-500/20 flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                </div>
                Wellness Streak
              </CardTitle>
              <CardDescription>Your mindfulness practice history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6">
                <motion.div 
                  className="text-center mb-6"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-5xl font-bold block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">14</span>
                  <span className="text-muted-foreground">Day Streak</span>
                </motion.div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 21 }).map((_, i) => (
                    <motion.div 
                      key={i} 
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        i < 14 ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white' : 'bg-muted'
                      }`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.05 * i }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {i < 14 && <Brain className="h-5 w-5" />}
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full gap-2 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950/30 dark:hover:text-purple-400 border-purple-200 dark:border-purple-800/30"
                >
                  <Headphones className="h-4 w-4" /> Start Today's Practice
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      <div>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-4 mb-6 bg-card border-border">
            <TabsTrigger value="all">All Sessions</TabsTrigger>
            <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
            <TabsTrigger value="stress">Stress Relief</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {meditationSessions.map(session => (
                <MeditationCard key={session.id} session={session} />
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="mindfulness" className="space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {meditationSessions
                .filter(session => session.category === "mindfulness")
                .map(session => (
                  <MeditationCard key={session.id} session={session} />
                ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="sleep" className="space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {meditationSessions
                .filter(session => session.category === "sleep")
                .map(session => (
                  <MeditationCard key={session.id} session={session} />
                ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="stress" className="space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {meditationSessions
                .filter(session => session.category === "stress")
                .map(session => (
                  <MeditationCard key={session.id} session={session} />
                ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 lg:grid-cols-5"
      >
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2"
        >
          <MoodTracker />
        </motion.div>
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-3"
        >
          <Card className="border border-muted/50 overflow-hidden hover:shadow-md transition-all duration-300">
            <CardHeader className="border-b bg-muted/20">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500/20 to-sky-500/20 flex items-center justify-center">
                      <BookOpen className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    Journal
                  </CardTitle>
                  <CardDescription>Track your thoughts and feelings</CardDescription>
                </div>
                <Button size="sm" className="gap-1 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white">
                  <PenLine className="h-4 w-4" /> New Entry
                </Button>
              </div>
              <div className="flex border-b space-x-4 mt-4">
                <button 
                  className={`pb-2 text-sm font-medium transition-colors ${
                    activeJournalTab === "recent" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveJournalTab("recent")}
                >
                  Recent Entries
                </button>
                <button 
                  className={`pb-2 text-sm font-medium transition-colors ${
                    activeJournalTab === "tagged" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveJournalTab("tagged")}
                >
                  Tagged
                </button>
                <button 
                  className={`pb-2 text-sm font-medium transition-colors ${
                    activeJournalTab === "favorites" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveJournalTab("favorites")}
                >
                  Favorites
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <motion.div 
                variants={containerVariants}
                className="grid gap-4 md:grid-cols-2"
              >
                {journalEntries.map(entry => (
                  <JournalEntryCard key={entry.id} entry={entry} />
                ))}
              </motion.div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4 bg-muted/10">
              <Button variant="ghost" size="sm" className="gap-1 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                View All Entries <ChevronDown className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MentalWellness;
