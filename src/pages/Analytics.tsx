import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageTitle from "@/components/layout/PageTitle";
import { motion } from "framer-motion";
import { Activity, TrendingUp, Calendar, BarChart3, ArrowUpRight, Download, Heart, Dumbbell, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

const data = [
  { date: "Mon", calories: 2100, steps: 8000, sleep: 7.5, mood: 8 },
  { date: "Tue", calories: 1800, steps: 10000, sleep: 8, mood: 7 },
  { date: "Wed", calories: 2200, steps: 7500, sleep: 6.5, mood: 6 },
  { date: "Thu", calories: 1900, steps: 9000, sleep: 7, mood: 8 },
  { date: "Fri", calories: 2000, steps: 12000, sleep: 8.5, mood: 9 },
  { date: "Sat", calories: 2400, steps: 6000, sleep: 9, mood: 9 },
  { date: "Sun", calories: 2300, steps: 7000, sleep: 8, mood: 8 },
];

// Weekly summary data
const summaryData = [
  { name: "Sleep", value: 7.8, target: 8, unit: "hrs", color: "#8884d8" },
  { name: "Steps", value: 8500, target: 10000, unit: "steps", color: "#82ca9d" },
  { name: "Calories", value: 2100, target: 2200, unit: "cal", color: "#ff7f0e" },
  { name: "Mood", value: 7.9, target: 8, unit: "/10", color: "#f087b3" },
];

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Nutrition data
const nutritionData = [
  { name: 'Protein', value: 40 },
  { name: 'Carbs', value: 30 },
  { name: 'Fats', value: 20 },
  { name: 'Fiber', value: 10 },
];

const Analytics = () => {
  const [timePeriod, setTimePeriod] = useState("week");

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-health-primary/10 text-health-primary text-sm font-medium mb-2">
            <BarChart3 className="h-4 w-4 mr-1" /> Health Insights
          </div>
        <PageTitle title="Analytics Dashboard" />
          <p className="text-muted-foreground">Track your health metrics and see your progress over time</p>
        </div>
        <div className="flex items-center gap-4">
          <Select 
            defaultValue="week" 
            onValueChange={setTimePeriod}
          >
            <SelectTrigger className="w-[180px] bg-card border-border">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 hours</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="rounded-full">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekly Summary Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
      >
        {summaryData.map((item, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="overflow-hidden border-border hover:shadow-md hover:border-health-primary/30 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  {item.name}
                  <Badge variant={item.value >= item.target ? "default" : "outline"} className={item.value >= item.target ? "bg-green-500/20 text-green-600 hover:bg-green-500/30" : "bg-amber-500/20 text-amber-600 hover:bg-amber-500/30"}>
                    {item.value >= item.target ? "On Track" : "Below Target"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-health-primary to-health-accent">
                      {item.value}{item.unit}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center">
                      Target: {item.target}{item.unit}
                      <div className={`ml-2 flex items-center ${item.value >= item.target ? "text-green-500" : "text-amber-500"}`}>
                        {item.value >= item.target ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                        )}
                        {item.value >= item.target 
                          ? `+${((item.value / item.target) * 100 - 100).toFixed(1)}%` 
                          : `-${(100 - (item.value / item.target) * 100).toFixed(1)}%`}
                      </div>
                    </div>
                  </div>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-r from-${item.color}/20 to-${item.color}/40`}>
                    <Activity className="h-5 w-5" style={{ color: item.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-4 mb-4 bg-card border-border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fitness">Fitness</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="wellbeing">Mental Wellbeing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2"
          >
            <motion.div variants={itemVariants}>
              <Card className="border-border overflow-hidden hover:shadow-md hover:border-health-primary/30 transition-all duration-300">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                      <Activity className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    Daily Activity Overview
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-foreground">
                    View Details <ArrowUpRight className="h-3 w-3" />
                  </Button>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                      <defs>
                        <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                        </linearGradient>
                        <filter id="shadow" height="200%">
                          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#8884d8" floodOpacity="0.2"/>
                        </filter>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#aaa" opacity={0.15} />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '0.75rem',
                          border: '1px solid #eee',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}
                        itemStyle={{ fontWeight: 500 }}
                        labelStyle={{ fontWeight: 600, marginBottom: 5 }}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: 10 }}
                        iconSize={10}
                        iconType="circle"
                      />
                      <Area
                      type="monotone"
                      dataKey="steps"
                      stroke="#8884d8"
                      name="Steps"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorSteps)"
                        animationDuration={1500}
                        filter="url(#shadow)"
                    />
                      <Area
                      type="monotone"
                      dataKey="calories"
                      stroke="#82ca9d"
                      name="Calories"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorCalories)"
                        animationDuration={1500}
                        animationBegin={300}
                    />
                    </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="border-border overflow-hidden hover:shadow-md hover:border-health-primary/30 transition-all duration-300">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-rose-500/20 to-pink-500/20 flex items-center justify-center">
                      <Heart className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                    </div>
                    Wellness Metrics
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-foreground">
                    View Details <ArrowUpRight className="h-3 w-3" />
                  </Button>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                      <defs>
                        <linearGradient id="gradientSleep" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#ff7f0e" stopOpacity={1} />
                          <stop offset="100%" stopColor="#ffb74d" stopOpacity={1} />
                        </linearGradient>
                        <linearGradient id="gradientMood" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#f087b3" stopOpacity={1} />
                          <stop offset="100%" stopColor="#e57373" stopOpacity={1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#aaa" opacity={0.15} />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '0.75rem',
                          border: '1px solid #eee',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}
                        itemStyle={{ fontWeight: 500 }}
                        labelStyle={{ fontWeight: 600, marginBottom: 5 }}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: 10 }}
                        iconSize={10} 
                        iconType="circle"
                      />
                    <Line
                      type="monotone"
                      dataKey="sleep"
                        stroke="url(#gradientSleep)"
                      name="Sleep (hours)"
                        strokeWidth={3}
                        dot={{ stroke: '#ff7f0e', strokeWidth: 2, r: 5, fill: 'white' }}
                        activeDot={{ r: 8, stroke: '#ff7f0e', strokeWidth: 2, fill: '#ff7f0e' }}
                        animationDuration={1500}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                        stroke="url(#gradientMood)"
                      name="Mood (1-10)"
                        strokeWidth={3}
                        dot={{ stroke: '#f087b3', strokeWidth: 2, r: 5, fill: 'white' }}
                        activeDot={{ r: 8, stroke: '#f087b3', strokeWidth: 2, fill: '#f087b3' }}
                        animationDuration={1500}
                        animationBegin={300}
                    />
                  </LineChart>
                </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants} 
            className="grid gap-6 md:grid-cols-3"
          >
            <Card className="border-border overflow-hidden hover:shadow-md hover:border-health-primary/30 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                    <Activity className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Weekly Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-[150px]">
                  <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">+12%</div>
                  <div className="text-sm text-muted-foreground">Improvement from last week</div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '70%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      />
                    </div>
                    <span className="text-xs font-medium">This week</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-muted-foreground/30 rounded-full" style={{ width: '58%' }} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Last week</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border overflow-hidden hover:shadow-md hover:border-health-primary/30 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                    <Dumbbell className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  Workout Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col h-[150px] justify-center">
                  <div className="grid grid-cols-7 gap-1 mb-3">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className={`h-14 w-6 rounded-full flex items-end mb-1 overflow-hidden ${i === 2 || i === 4 || i === 5 ? 'bg-muted' : 'bg-muted/40'}`}>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: i === 2 ? '80%' : i === 4 ? '60%' : i === 5 ? '90%' : '0%' }}
                            transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                            className="w-full bg-gradient-to-t from-blue-500 to-indigo-500 rounded-full"
                          />
                        </div>
                        <span className="text-xs font-medium">{day}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <span className="font-medium">3 workouts</span>
                    </span>
                    <span className="text-muted-foreground">4 hours total</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border overflow-hidden hover:shadow-md hover:border-health-primary/30 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                    <Brain className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                  </div>
                  Mental Wellness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col h-[150px] justify-center items-center">
                  <div className="relative w-24 h-24 mb-3">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle className="text-muted stroke-current" strokeWidth="10" cx="50" cy="50" r="40" fill="none"></circle>
                      <motion.circle
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 0.85 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="text-amber-500 stroke-current" 
                        strokeWidth="10" 
                        strokeLinecap="round" 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="none"
                        strokeDasharray="251.2"
                        strokeDashoffset="0"
                      ></motion.circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">8.5</span>
                    </div>
                  </div>
                  <div className="text-sm">Mood Score</div>
                  <div className="text-xs text-muted-foreground mt-1">2 points above average</div>
          </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="fitness" className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVariants}>
              <Card className="border-border overflow-hidden hover:shadow-md hover:border-health-primary/30 transition-all duration-300 mb-6">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500/20 to-violet-500/20 flex items-center justify-center">
                      <Dumbbell className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                    </div>
                    Fitness Trends
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-foreground">
                    Export Data <Download className="h-3 w-3" />
                  </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                        <defs>
                          <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8884d8" stopOpacity={1}/>
                            <stop offset="100%" stopColor="#8884d8" stopOpacity={0.3}/>
                          </linearGradient>
                          <filter id="barShadow" height="130%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                            <feOffset dx="0" dy="4" result="offsetblur" />
                            <feComponentTransfer>
                              <feFuncA type="linear" slope="0.2" />
                            </feComponentTransfer>
                            <feMerge>
                              <feMergeNode />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#aaa" opacity={0.15} />
                        <XAxis dataKey="date" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '0.75rem',
                            border: '1px solid #eee',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                          }}
                          cursor={{ fill: 'rgba(136, 132, 216, 0.1)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: 10 }} />
                        <Bar
                      dataKey="steps"
                      name="Steps"
                          fill="url(#colorBar)"
                          radius={[6, 6, 0, 0]}
                          filter="url(#barShadow)"
                          animationDuration={1500}
                          animationBegin={300}
                    />
                      </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="border-border overflow-hidden hover:shadow-md hover:border-health-primary/30 transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-teal-500/20 to-green-500/20 flex items-center justify-center">
                        <Activity className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                      </div>
                      Active Minutes Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Last Week', current: 220, target: 300 },
                          { name: 'This Week', current: 280, target: 300 }
                        ]}
                        layout="vertical"
                        margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#aaa" opacity={0.15} horizontal={false} />
                        <XAxis type="number" stroke="#888" />
                        <YAxis dataKey="name" type="category" stroke="#888" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '0.75rem',
                            border: '1px solid #eee',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Bar 
                          dataKey="current" 
                          name="Active Minutes" 
                          fill="#4ade80" 
                          radius={[0, 4, 4, 0]} 
                          animationDuration={1500}
                        />
                        <Bar 
                          dataKey="target" 
                          name="Target" 
                          fill="#d1d5db" 
                          radius={[0, 4, 4, 0]} 
                          animationDuration={1500}
                          animationBegin={300}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-border overflow-hidden hover:shadow-md hover:border-health-primary/30 transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 flex items-center justify-center">
                        <Heart className="h-3 w-3 text-red-600 dark:text-red-400" />
                      </div>
                      Heart Rate Zones
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="flex flex-col h-full">
                      <div className="text-center mb-6">
                        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                          142 bpm
                        </div>
                        <div className="text-sm text-muted-foreground">Average peak heart rate</div>
                      </div>

                      <div className="flex-1 space-y-4">
                        {[
                          { name: 'Maximum (90-100%)', min: 171, max: 190, color: 'from-red-500 to-red-600', current: 7 },
                          { name: 'Hard (80-90%)', min: 152, max: 171, color: 'from-orange-500 to-orange-600', current: 12 },
                          { name: 'Moderate (70-80%)', min: 133, max: 152, color: 'from-amber-500 to-amber-600', current: 25 },
                          { name: 'Light (60-70%)', min: 114, max: 133, color: 'from-yellow-500 to-yellow-600', current: 36 },
                          { name: 'Very Light (<60%)', min: 95, max: 114, color: 'from-lime-500 to-lime-600', current: 20 }
                        ].map((zone, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{zone.name}</span>
                              <span className="text-muted-foreground">{zone.min}-{zone.max} bpm</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${zone.current}%` }}
                                transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                                className={`h-full rounded-full bg-gradient-to-r ${zone.color}`}
                              />
                            </div>
                            <div className="text-xs text-right text-muted-foreground">{zone.current}% of time</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-border overflow-hidden hover:shadow-md hover:border-health-primary/30 transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500/20 to-sky-500/20 flex items-center justify-center">
                      <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    Workout Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {[...Array(28)].map((_, i) => {
                      const intensity = 
                        [2, 5, 9, 12, 15, 19, 23, 26].includes(i) ? 'high' : 
                        [1, 6, 8, 13, 16, 20, 22, 27].includes(i) ? 'medium' : 
                        [0, 3, 10, 17, 24].includes(i) ? 'low' : 'none';
                      
                      const colorClass = 
                        intensity === 'high' ? 'bg-violet-500 hover:bg-violet-600' : 
                        intensity === 'medium' ? 'bg-violet-400 hover:bg-violet-500' : 
                        intensity === 'low' ? 'bg-violet-300 hover:bg-violet-400' : 
                        'bg-muted hover:bg-muted-foreground/20';
                      
                      return (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.5 + (i * 0.01) }}
                          className={`h-10 rounded-md ${colorClass} cursor-pointer transition-colors duration-200 flex items-center justify-center`}
                        >
                          <span className="text-xs font-medium text-white">{i + 1}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm bg-violet-500"></span>
                      <span>High Intensity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm bg-violet-400"></span>
                      <span>Medium Intensity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm bg-violet-300"></span>
                      <span>Low Intensity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm bg-muted"></span>
                      <span>Rest Day</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="nutrition" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border overflow-hidden hover:shadow-md hover:border-health-primary/30 transition-all duration-300">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle>Caloric Intake</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-foreground">
                  View Meal Plan <ArrowUpRight className="h-3 w-3" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                      <defs>
                        <linearGradient id="calorieGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#aaa" opacity={0.15} />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '0.5rem',
                          border: '1px solid #eee',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area
                      type="monotone"
                      dataKey="calories"
                      stroke="#82ca9d"
                        fill="url(#calorieGradient)"
                      name="Calories"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border overflow-hidden hover:shadow-md hover:border-health-primary/30 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle>Macronutrient Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={nutritionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {nutritionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Value']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '0.5rem',
                          border: '1px solid #eee',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="wellbeing" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border overflow-hidden hover:shadow-md hover:border-health-primary/30 transition-all duration-300">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle>Mood Trends</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-foreground">
                  View Journal <ArrowUpRight className="h-3 w-3" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                      <CartesianGrid strokeDasharray="3 3" stroke="#aaa" opacity={0.15} />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '0.5rem',
                          border: '1px solid #eee',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#f087b3"
                        strokeWidth={3}
                        dot={{ stroke: '#f087b3', strokeWidth: 2, r: 6 }}
                        activeDot={{ stroke: '#f087b3', strokeWidth: 2, r: 8 }}
                      name="Mood (1-10)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border overflow-hidden hover:shadow-md hover:border-health-primary/30 transition-all duration-300">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle>Sleep Quality</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-foreground">
                  View Details <ArrowUpRight className="h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#aaa" opacity={0.15} />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '0.5rem',
                          border: '1px solid #eee',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sleep"
                      stroke="#ff7f0e"
                        strokeWidth={3}
                        dot={{ stroke: '#ff7f0e', strokeWidth: 2, r: 6 }}
                        activeDot={{ stroke: '#ff7f0e', strokeWidth: 2, r: 8 }}
                      name="Sleep (hours)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Analytics;
