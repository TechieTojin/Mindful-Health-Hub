import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Moon, Sun, Sunrise, Activity, Calendar, Clock, BedDouble, Zap, Plus, PieChart as PieChartIcon, CalendarDays, ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, subDays, addDays } from "date-fns";
import { Progress } from "@/components/ui/progress";

// Mock data for sleep history
const generateSleepData = (days = 7) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(now, i);
    
    // More realistic sleep patterns
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseHours = isWeekend ? 8.5 : 7.2;
    const variation = Math.random() * 1.4 - 0.7; // -0.7 to +0.7 variation
    
    const hoursSlept = Math.max(4, Math.min(10, baseHours + variation));
    const deepSleepPercentage = Math.floor(Math.random() * 10) + 15; // 15-25%
    const remSleepPercentage = Math.floor(Math.random() * 15) + 20; // 20-35%
    const lightSleepPercentage = 100 - deepSleepPercentage - remSleepPercentage;
    
    data.push({
      date: format(date, "MMM d"),
      fullDate: date,
      hoursSlept,
      deepSleep: (hoursSlept * deepSleepPercentage / 100).toFixed(1),
      remSleep: (hoursSlept * remSleepPercentage / 100).toFixed(1),
      lightSleep: (hoursSlept * lightSleepPercentage / 100).toFixed(1),
      quality: Math.floor(Math.random() * 30) + 70, // 70-100
      efficiency: Math.floor(Math.random() * 20) + 80, // 80-100
      bedtime: `${isWeekend ? 23 : 22}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`,
      wakeup: `${isWeekend ? 8 : 7}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`
    });
  }
  
  return data;
};

// Mock sleep patterns data
const generateSleepPatterns = () => {
  const cycles = [];
  const sleepPhases = ['Awake', 'Light Sleep', 'Deep Sleep', 'REM Sleep'];
  let currentTime = new Date();
  currentTime.setHours(23, 0, 0, 0); // Start at 11pm
  
  for (let i = 0; i < 16; i++) {
    // First figure out which part of the night we're in
    const hoursPassed = i * 0.5; // Half hour intervals
    
    // More likely to be awake at beginning and end of night
    const isStartOrEnd = hoursPassed < 1 || hoursPassed > 7;
    
    // Determine sleep phase probabilities based on time
    let phaseDistribution;
    if (isStartOrEnd) {
      phaseDistribution = [0.3, 0.5, 0.1, 0.1]; // More likely awake or light sleep
    } else if (hoursPassed < 3) {
      phaseDistribution = [0.05, 0.3, 0.6, 0.05]; // Early night - more deep sleep
    } else {
      phaseDistribution = [0.05, 0.4, 0.15, 0.4]; // Later night - more REM
    }
    
    // Random selection based on probability distribution
    const rand = Math.random();
    let cumulativeProbability = 0;
    let selectedPhase = 0;
    
    for (let j = 0; j < phaseDistribution.length; j++) {
      cumulativeProbability += phaseDistribution[j];
      if (rand <= cumulativeProbability) {
        selectedPhase = j;
        break;
      }
    }
    
    // Create record
    cycles.push({
      time: format(currentTime, 'h:mm a'),
      phase: sleepPhases[selectedPhase],
      value: selectedPhase,
    });
    
    currentTime = addDays(currentTime, 0);
    currentTime.setMinutes(currentTime.getMinutes() + 30);
  }
  
  return cycles;
};

// Sleep quality improvement tips
const sleepTips = [
  { title: "Maintain Regular Sleep Schedule", description: "Go to bed and wake up at the same time every day, even on weekends." },
  { title: "Limit Screen Time", description: "Avoid screens 1 hour before bedtime to improve melatonin production." },
  { title: "Create a Restful Environment", description: "Keep your bedroom cool, quiet, and dark for optimal sleep conditions." },
  { title: "Monitor Caffeine Intake", description: "Avoid caffeine at least 6 hours before bedtime." },
  { title: "Wind Down Routine", description: "Develop a relaxing pre-sleep routine like reading or meditation." }
];

const SleepInsights = () => {
  const [sleepData] = useState(generateSleepData(14));
  const [sleepCycles] = useState(generateSleepPatterns());
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTab, setSelectedTab] = useState("overview");
  
  const todayData = sleepData[sleepData.length - 1];
  const weeklyAverage = (sleepData.slice(-7).reduce((acc, curr) => acc + curr.hoursSlept, 0) / 7).toFixed(1);
  
  // Getting trend information
  const isImproving = Number(weeklyAverage) > Number(sleepData.slice(-14, -7).reduce((acc, curr) => acc + curr.hoursSlept, 0) / 7);
  
  const sleepStageData = [
    { name: "Deep Sleep", value: Number(todayData.deepSleep), color: "#3b82f6" },
    { name: "REM Sleep", value: Number(todayData.remSleep), color: "#8b5cf6" },
    { name: "Light Sleep", value: Number(todayData.lightSleep), color: "#22c55e" }
  ];
  
  const sleepScoreInfo = [
    { name: "Quality", value: todayData.quality, color: "#3b82f6" },
    { name: "Efficiency", value: todayData.efficiency, color: "#22c55e" }
  ];

  return (
    <div className="space-y-8">
      {/* Modern Header Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-health-primary/90 via-health-secondary/70 to-health-accent/80 text-white mb-4">
        <div className="absolute inset-0 bg-[url('/images/pattern/dots.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-health-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-health-secondary/20 rounded-full blur-3xl"></div>
        
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-white/30 border-t-white/80"
                />
                <Moon className="h-8 w-8 text-white" />
              </div>
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-white"
                >
                  Sleep Insights
                </motion.h1>
                <p className="text-white/80">
                  Track and analyze your sleep patterns for better rest and recovery
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-white/10 hover:bg-white/20 text-white border-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Sleep Record
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <Tabs defaultValue={selectedTab} className="space-y-6" onValueChange={setSelectedTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-2 mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patterns">Sleep Patterns</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground font-medium">Last Night's Sleep</CardTitle>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{todayData.hoursSlept}</span>
                  <span className="text-sm ml-1 text-muted-foreground">hours</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <BedDouble className="h-4 w-4 text-muted-foreground" />
                    <span>{todayData.bedtime}</span>
                  </div>
                  <div>→</div>
                  <div className="flex items-center gap-1">
                    <Sunrise className="h-4 w-4 text-muted-foreground" />
                    <span>{todayData.wakeup}</span>
                  </div>
                </div>
                <Progress value={Math.min((todayData.hoursSlept/9) * 100, 100)} className="h-2 mt-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Too Little</span>
                  <span>Ideal</span>
                  <span>Too Much</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground font-medium">Weekly Average</CardTitle>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{weeklyAverage}</span>
                  <span className="text-sm ml-1 text-muted-foreground">hours</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className={`${isImproving ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                    {isImproving ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {isImproving ? 'Improving' : 'Declining'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">vs. previous week</span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">Sleep Quality</span>
                    <span className="text-xs font-medium">{todayData.quality}%</span>
                  </div>
                  <Progress value={todayData.quality} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground font-medium">Sleep Score</CardTitle>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">
                    {Math.round((todayData.quality + todayData.efficiency) / 2)}
                  </span>
                  <span className="text-sm ml-1 text-muted-foreground">/ 100</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {sleepScoreInfo.map((item, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs">{item.name}</span>
                        <span className="text-xs font-medium">{item.value}%</span>
                      </div>
                      <Progress value={item.value} className="h-2" style={{ backgroundColor: `${item.color}30` }} />
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-center text-muted-foreground">
                  {
                    todayData.quality >= 90 ? "Excellent sleep quality!" :
                    todayData.quality >= 80 ? "Very good sleep quality" :
                    todayData.quality >= 70 ? "Good sleep quality" :
                    "Fair sleep quality"
                  }
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sleep Composition Chart */}
          <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Sleep Composition</CardTitle>
              <CardDescription>Breakdown of your sleep stages</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/3 p-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={sleepStageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {sleepStageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} hours`, null]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="md:w-2/3 pl-0 md:pl-6 p-4">
                  <div className="space-y-4">
                    {sleepStageData.map((stage, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: stage.color }}></div>
                            <span className="text-sm font-medium">{stage.name}</span>
                          </div>
                          <span className="text-sm">{stage.value} hrs ({Math.round((stage.value / todayData.hoursSlept) * 100)}%)</span>
                        </div>
                        <Progress 
                          value={(stage.value / todayData.hoursSlept) * 100} 
                          className="h-2" 
                          style={{ backgroundColor: `${stage.color}20` }}
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          {stage.name === "Deep Sleep" && "Physical recovery, immune function, memory consolidation"}
                          {stage.name === "REM Sleep" && "Mental recovery, emotional processing, creativity"}
                          {stage.name === "Light Sleep" && "Transitional sleep stage, moderate restoration"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Weekly History */}
          <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Weekly Sleep History</CardTitle>
              <CardDescription>Your sleep duration over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sleepData.slice(-7)}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} tickCount={6} />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value} hours`, 
                        name === 'hoursSlept' ? 'Sleep Duration' : name
                      ]}
                    />
                    <Bar 
                      dataKey="hoursSlept" 
                      fill="url(#sleepGradient)" 
                      radius={[4, 4, 0, 0]} 
                      maxBarSize={60}
                    />
                    <defs>
                      <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Patterns Tab */}
        <TabsContent value="patterns" className="space-y-6">
          <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Sleep Cycles</CardTitle>
              <CardDescription>Visualization of your sleep stages throughout the night</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sleepCycles}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" />
                    <YAxis 
                      domain={[0, 3]} 
                      ticks={[0, 1, 2, 3]} 
                      tickFormatter={(value) => {
                        const phases = ['Awake', 'Light', 'Deep', 'REM'];
                        return phases[value];
                      }}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        value === 0 ? 'Awake' :
                        value === 1 ? 'Light Sleep' :
                        value === 2 ? 'Deep Sleep' :
                        'REM Sleep', 
                        'Sleep Phase'
                      ]}
                    />
                    <Line 
                      type="stepAfter" 
                      dataKey="value" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Bedtime Consistency</CardTitle>
                <CardDescription>Your bedtime over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sleepData.slice(-7)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis 
                        domain={['dataMin', 'dataMax']} 
                        tickFormatter={(value) => value}
                        reversed
                      />
                      <Tooltip formatter={(value) => [value, 'Bedtime']} />
                      <Line 
                        type="monotone" 
                        dataKey="bedtime" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Wake-up Consistency</CardTitle>
                <CardDescription>Your wake-up time over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sleepData.slice(-7)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis 
                        domain={['dataMin', 'dataMax']} 
                        tickFormatter={(value) => value}
                        reversed
                      />
                      <Tooltip formatter={(value) => [value, 'Wake-up Time']} />
                      <Line 
                        type="monotone" 
                        dataKey="wakeup" 
                        stroke="#22c55e" 
                        strokeWidth={2}
                        dot={{ fill: '#22c55e', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Sleep Quality Trends</CardTitle>
              <CardDescription>Your sleep quality and duration over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sleepData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" domain={[0, 10]} tickCount={6} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tickCount={6} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="hoursSlept" 
                      name="Sleep Duration (hours)"
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 3 }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="quality" 
                      name="Sleep Quality (%)"
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Sleep Tips & Recommendations */}
          <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Sleep Quality Recommendations</CardTitle>
              <CardDescription>Personalized tips to improve your sleep</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sleepTips.map((tip, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex p-3 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-health-primary/10 flex items-center justify-center mr-3 mt-0.5">
                      <Zap className="h-4 w-4 text-health-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">{tip.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SleepInsights; 