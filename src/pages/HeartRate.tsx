import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { Heart, Activity, TrendingUp, TrendingDown, Clock, Calendar, BarChart2, PlusCircle, RotateCcw, History } from "lucide-react";
import { motion } from "framer-motion";
import { format, subDays, subHours } from "date-fns";
import { Progress } from "@/components/ui/progress";

// Generate heart rate data
const generateHeartRateData = (days = 7) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(now, i);
    
    // Create more realistic heart rate patterns
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    // Base resting heart rate (lower on weekends due to less stress)
    const restingHR = isWeekend ? 
      Math.floor(Math.random() * 5) + 58 : // 58-63 on weekends
      Math.floor(Math.random() * 8) + 62;  // 62-70 on weekdays
    
    // Max heart rate varies more, simulating exercise
    const maxHR = isWeekend ?
      Math.floor(Math.random() * 40) + 120 : // 120-160 on weekends (longer exercise)
      Math.floor(Math.random() * 30) + 110;  // 110-140 on weekdays (shorter exercise)
    
    // Average heart rate
    const avgHR = Math.floor((restingHR + maxHR) / 2 - Math.random() * 15);
    
    data.push({
      date: format(date, "MMM d"),
      fullDate: date,
      restingHR,
      avgHR,
      maxHR,
      caloriesBurned: Math.floor((avgHR - 60) * 10) + Math.floor(Math.random() * 200),
      activeMinutes: Math.floor(Math.random() * 30) + (isWeekend ? 60 : 30)
    });
  }
  
  return data;
};

// Generate intraday heart rate data (for the current day)
const generateIntradayData = () => {
  const data = [];
  const now = new Date();
  const currentHour = now.getHours();
  
  for (let i = 0; i < 24; i++) {
    // Only generate up to current hour
    if (i > currentHour) break;
    
    let hr;
    // Sleeping hours (lower HR)
    if (i >= 0 && i < 6) {
      hr = Math.floor(Math.random() * 10) + 55; // 55-65 during sleep
    } 
    // Morning spike
    else if (i === 7) {
      hr = Math.floor(Math.random() * 15) + 75; // 75-90 waking up & morning routine
    }
    // Exercise time (if applicable)
    else if (i === 18) {
      hr = Math.floor(Math.random() * 40) + 110; // 110-150 during exercise
    }
    // Regular daytime
    else {
      hr = Math.floor(Math.random() * 20) + 65; // 65-85 during regular day
    }
    
    data.push({
      time: `${i}:00`,
      heartRate: hr
    });
  }
  
  return data;
};

// Heart rate zone calculation
const getHeartRateZone = (hr, age = 35) => {
  const maxHR = 220 - age;
  const percent = (hr / maxHR) * 100;
  
  if (percent < 50) return { name: "Rest", color: "bg-blue-100 text-blue-800" };
  if (percent < 60) return { name: "Easy", color: "bg-green-100 text-green-800" };
  if (percent < 70) return { name: "Fat Burn", color: "bg-emerald-100 text-emerald-800" };
  if (percent < 80) return { name: "Cardio", color: "bg-yellow-100 text-yellow-800" };
  if (percent < 90) return { name: "Hard", color: "bg-orange-100 text-orange-800" };
  return { name: "Peak", color: "bg-rose-100 text-rose-800" };
};

const HeartRate = () => {
  const [dailyData] = useState(generateHeartRateData(7));
  const [weeklyData] = useState(generateHeartRateData(30));
  const [intradayData] = useState(generateIntradayData());
  const [selectedTab, setSelectedTab] = useState("today");
  
  const currentHR = Math.floor(Math.random() * 20) + 70; // Simulated current heart rate
  const todayData = dailyData[dailyData.length - 1];
  const hrZone = getHeartRateZone(currentHR);
  const hrChange = currentHR - todayData.restingHR;
  
  // Weekly averages
  const avgRestingHR = Math.round(dailyData.reduce((sum, day) => sum + day.restingHR, 0) / dailyData.length);
  const weeklyTrend = avgRestingHR < weeklyData.slice(0, 7).reduce((sum, day) => sum + day.restingHR, 0) / 7;
  
  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-500/90 via-rose-600/80 to-rose-700/90 text-white mb-4">
        <div className="absolute inset-0 bg-[url('/images/pattern/dots.svg')] opacity-10 mix-blend-overlay"></div>
        
        {/* Animated background elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl"></div>
        
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
                {/* Animated pulse effect */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 0.9, 0.7]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full bg-rose-500/50"
                ></motion.div>
                <Heart className="h-8 w-8 text-white relative z-10" />
              </div>
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-white"
                >
                  Heart Rate Monitor
                </motion.h1>
                <p className="text-white/80">
                  Track and analyze your heart rate for better cardiovascular health
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-white/10 hover:bg-white/20 text-white border-0">
                <PlusCircle className="h-4 w-4 mr-2" />
                Record Exercise
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Current Heart Rate Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Current Heart Rate</CardTitle>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{currentHR}</span>
              <span className="text-sm ml-1 text-muted-foreground">bpm</span>
              <Badge className={`ml-2 ${hrChange > 0 ? 'bg-rose-100 text-rose-800' : 'bg-green-100 text-green-800'}`}>
                {hrChange > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(hrChange)} bpm
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={hrZone.color}>{hrZone.name} Zone</Badge>
                <span className="text-xs text-muted-foreground">
                  {hrZone.name === "Rest" && "Resting or relaxed state"}
                  {hrZone.name === "Easy" && "Light activity, warm up"}
                  {hrZone.name === "Fat Burn" && "Moderate activity, improving endurance"}
                  {hrZone.name === "Cardio" && "Harder activity, improving performance"}
                  {hrZone.name === "Hard" && "High intensity exercise"}
                  {hrZone.name === "Peak" && "Maximum effort, short bursts"}
                </span>
              </div>
              <Progress 
                value={((currentHR - 50) / 170) * 100} 
                className="h-2 mt-2" 
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>50</span>
                <span>100</span>
                <span>150</span>
                <span>220</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <div className="text-xs text-muted-foreground">Resting HR</div>
                <div className="text-lg font-medium">{todayData.restingHR} bpm</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Max HR Today</div>
                <div className="text-lg font-medium">{todayData.maxHR} bpm</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-2 border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Today's Heart Rate</CardTitle>
            <CardDescription>How your heart rate has changed throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={intradayData}>
                  <defs>
                    <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" />
                  <YAxis domain={[50, 160]} />
                  <Tooltip formatter={(value) => [`${value} bpm`, 'Heart Rate']} />
                  <Area 
                    type="monotone" 
                    dataKey="heartRate" 
                    stroke="#ef4444" 
                    fillOpacity={1} 
                    fill="url(#heartRateGradient)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for different views */}
      <Tabs defaultValue={selectedTab} className="space-y-6" onValueChange={setSelectedTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-2 mx-auto">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Heart Rate Zones</CardTitle>
                <CardDescription>Time spent in each zone today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Peak", percent: 5, color: "bg-rose-500" },
                    { name: "Hard", percent: 10, color: "bg-orange-500" },
                    { name: "Cardio", percent: 20, color: "bg-yellow-500" },
                    { name: "Fat Burn", percent: 30, color: "bg-emerald-500" },
                    { name: "Easy", percent: 20, color: "bg-green-500" },
                    { name: "Rest", percent: 15, color: "bg-blue-500" }
                  ].map((zone) => (
                    <div key={zone.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{zone.name}</span>
                        <span className="text-sm font-medium">{zone.percent}%</span>
                      </div>
                      <Progress value={zone.percent} className="h-2" style={{ backgroundColor: `${zone.color}20` }} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-2 border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Comparison to Previous Days</CardTitle>
                <CardDescription>How today compares to your recent history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData.slice(-3)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar name="Resting HR" dataKey="restingHR" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar name="Average HR" dataKey="avgHR" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      <Bar name="Max HR" dataKey="maxHR" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="week" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Weekly Heart Rate Trends</CardTitle>
              <CardDescription>Your heart rate patterns over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="restingHR" 
                      name="Resting HR" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avgHR" 
                      name="Average HR" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="maxHR" 
                      name="Max HR" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={{ fill: '#ef4444', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Active minutes by day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} min`, 'Active Time']} />
                      <Bar dataKey="activeMinutes" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Calories Burned</CardTitle>
                <CardDescription>Based on your heart rate activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} kcal`, 'Calories Burned']} />
                      <Bar dataKey="caloriesBurned" fill="#f97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="month" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Monthly Heart Rate Trends</CardTitle>
                  <CardDescription>Your resting heart rate over the past 30 days</CardDescription>
                </div>
                <Badge variant="outline" className={weeklyTrend ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'}>
                  {weeklyTrend ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
                  {weeklyTrend ? 'Improving' : 'Elevated'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="restingHR" 
                      name="Resting Heart Rate" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Lower resting heart rate generally indicates better cardiovascular fitness
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Heart Health Insights</CardTitle>
              <CardDescription>Analysis of your heart rate data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-start">
                    <Activity className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Consistent Activity</h3>
                      <p className="text-xs mt-1 text-green-700 dark:text-green-400">
                        You've maintained regular activity levels this month, which helps improve cardiovascular health.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-start">
                    <Heart className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Healthy Recovery Rate</h3>
                      <p className="text-xs mt-1 text-blue-700 dark:text-blue-400">
                        Your heart rate recovers quickly after activities, indicating good cardiovascular fitness.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-purple-600 mt-0.5 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">Circadian Rhythm</h3>
                      <p className="text-xs mt-1 text-purple-700 dark:text-purple-400">
                        Your heart rate follows a healthy pattern with lower rates during rest and appropriate increases during activity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <BarChart2 className="h-4 w-4 mr-2" />
                View Detailed Heart Analysis
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HeartRate;