import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '../components/ui/badge';
import { Droplets, Plus, Minus, Bell, BellOff, TrendingUp, Calendar, Droplet, Waves, Zap, ShieldAlert, Clock } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

// Mock hydration data
const generateDailyIntake = (targetML = 2500) => {
  const now = new Date();
  const currentHour = now.getHours();
  let total = 0;
  
  const entries = [];
  
  // Generate more realistic intake throughout the day
  for (let i = 6; i <= Math.min(currentHour, 22); i++) {
    // Higher probability of drinking at certain hours
    const isPeakHour = [8, 12, 15, 18, 20].includes(i);
    const probability = isPeakHour ? 0.9 : 0.5;
    
    if (Math.random() < probability) {
      const amount = Math.floor(Math.random() * 300) + 150;
      total += amount;
      
      entries.push({
        id: `intake-${i}`,
        time: `${i}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        amount,
        timestamp: new Date(now.getFullYear(), now.getMonth(), now.getDate(), i, Math.floor(Math.random() * 60)).toISOString()
      });
    }
  }
  
  return {
    total,
    target: targetML,
    percentage: Math.min(Math.round((total / targetML) * 100), 100),
    entries
  };
};

// Generate weekly history
const generateWeeklyHistory = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = subDays(now, i);
    const isToday = isSameDay(date, now);
    
    // More randomized pattern but weighted toward weekdays having more intake
    const weekday = date.getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    
    let target = 2500;
    let amount;
    
    if (isToday) {
      // Use current day's actual amount
      amount = currentData.total;
    } else {
      // Generate a more realistic pattern
      const baseAmount = isWeekend ? 1800 : 2200;
      const variance = Math.floor(Math.random() * 800) - 400; // -400 to +400
      amount = Math.max(800, Math.min(3000, baseAmount + variance));
    }
    
    data.push({
      date: format(date, 'EEE'),
      amount,
      target,
      percentage: Math.round((amount / target) * 100)
    });
  }
  
  return data;
};

// Initial data
const currentData = generateDailyIntake();
const weeklyData = generateWeeklyHistory();

// Streak calculation
const calculateStreak = () => {
  // Mock streak data - in a real app this would be calculated from history
  return Math.floor(Math.random() * 10) + 1;
};

const HydrationTracker = () => {
  const [hydrationData, setHydrationData] = useState(currentData);
  const [weekHistory, setWeekHistory] = useState(weeklyData);
  const [customAmount, setCustomAmount] = useState(250);
  const [waterGoal, setWaterGoal] = useState(2500);
  const [remindersActive, setRemindersActive] = useState(true);
  const [reminderInterval, setReminderInterval] = useState(60); // minutes
  const [streak, setStreak] = useState(calculateStreak());
  const [nextReminder, setNextReminder] = useState(new Date(Date.now() + 60 * 60 * 1000));
  
  // Simulate data updates
  useEffect(() => {
    // Update timer for next reminder
    const reminderTimer = setInterval(() => {
      if (remindersActive) {
        const now = new Date();
        if (now >= nextReminder) {
          // In a real app, this would trigger a notification
          console.log("Hydration reminder triggered!");
          setNextReminder(new Date(Date.now() + reminderInterval * 60 * 1000));
        }
      }
    }, 10000);
    
    return () => clearInterval(reminderTimer);
  }, [remindersActive, reminderInterval, nextReminder]);
  
  const addWater = (amount) => {
    const newTotal = hydrationData.total + amount;
    const newPercentage = Math.min(Math.round((newTotal / waterGoal) * 100), 100);
    
    const newEntry = {
      id: `intake-${Date.now()}`,
      time: format(new Date(), 'HH:mm'),
      amount,
      timestamp: new Date().toISOString()
    };
    
    setHydrationData({
      ...hydrationData,
      total: newTotal,
      percentage: newPercentage,
      entries: [...hydrationData.entries, newEntry]
    });
    
    // Update today's data in weekly view
    setWeekHistory(prev => {
      const updated = [...prev];
      updated[updated.length - 1].amount = newTotal;
      updated[updated.length - 1].percentage = newPercentage;
      return updated;
    });
  };
  
  const toggleReminders = () => {
    setRemindersActive(!remindersActive);
    if (!remindersActive) {
      setNextReminder(new Date(Date.now() + reminderInterval * 60 * 1000));
    }
  };
  
  const updateReminderInterval = (minutes) => {
    setReminderInterval(minutes);
    if (remindersActive) {
      setNextReminder(new Date(Date.now() + minutes * 60 * 1000));
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Modern Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-400/90 via-cyan-500/80 to-teal-500/90 text-white mb-6">
        <div className="absolute inset-0 bg-[url('/images/pattern/dots.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-white/30 border-t-white/80"
                />
                <Droplets className="h-8 w-8 text-white" />
              </div>
        <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-white"
                >
                  Hydration Tracker
                </motion.h1>
                <p className="text-white/80">
            Track your daily water intake and stay hydrated
          </p>
              </div>
        </div>
        <div className="flex items-center space-x-2">
              <Button
                variant={remindersActive ? "default" : "outline"}
                onClick={toggleReminders}
                className={`bg-white/10 hover:bg-white/20 text-white border border-white/20 ${!remindersActive && "bg-transparent"}`}
              >
                {remindersActive ? <Bell className="mr-2 h-4 w-4" /> : <BellOff className="mr-2 h-4 w-4" />}
            {remindersActive ? 'Reminders On' : 'Reminders Off'}
              </Button>
          {streak > 0 && (
                <Badge variant="secondary" className="flex items-center border-white/20 bg-white/10 text-white">
              <TrendingUp className="mr-1 h-3 w-3" />
              {streak} day streak
            </Badge>
          )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Today's Hydration</CardTitle>
              <CardDescription>
                {format(new Date(), 'EEEE, MMMM do, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{hydrationData.percentage}%</div>
                      <div className="text-sm text-muted-foreground">
                        {hydrationData.total} / {waterGoal} ml
                      </div>
                    </div>
                  </div>
                  {/* Water fill animation */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="6"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${hydrationData.percentage * 2.83} 283`}
                      transform="rotate(-90 50 50)"
                      initial={{ strokeDasharray: "0 283" }}
                      animate={{ strokeDasharray: `${hydrationData.percentage * 2.83} 283` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>

                  {/* Decorative water drops */}
                  <motion.div 
                    className="absolute -right-2 top-1/4 w-4 h-4 rounded-full bg-blue-400/30"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div 
                    className="absolute -left-3 top-1/2 w-6 h-6 rounded-full bg-blue-500/20"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  />
                </div>
                <div className="w-full max-w-md mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Daily Goal</span>
                    <span className="text-sm font-medium">{waterGoal} ml</span>
                  </div>
                  <Slider
                    value={[waterGoal]}
                    min={1000}
                    max={4000}
                    step={100}
                    onValueChange={([value]) => setWaterGoal(value)}
                    className="mb-6"
                  />
                </div>
              </div>
              
              <motion.div 
                className="flex flex-wrap gap-3 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                {[150, 250, 500].map((amount, index) => (
                  <motion.div 
                    key={amount} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + (index * 0.1) }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="flex items-center bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30" 
                      onClick={() => addWater(amount)}
                    >
                      <Droplets className="h-4 w-4 mr-1 text-blue-500" /> {amount}ml
                </Button>
                  </motion.div>
                ))}
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-center border rounded-md bg-white dark:bg-gray-800 shadow-sm"
                >
                  <Button variant="ghost" size="icon" onClick={() => setCustomAmount(Math.max(50, customAmount - 50))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center">{customAmount} ml</span>
                  <Button variant="ghost" size="icon" onClick={() => setCustomAmount(customAmount + 50)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="default" 
                    className="ml-2 mr-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    onClick={() => addWater(customAmount)}
                  >
                    Add
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Reminder Settings</CardTitle>
              <CardDescription>
                Customize your hydration reminders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Reminder Status</span>
                    <Button 
                      variant={remindersActive ? "default" : "outline"} 
                      size="sm" 
                      onClick={toggleReminders}
                      className={`flex items-center ${remindersActive ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600' : ''}`}
                    >
                      {remindersActive ? <Bell className="h-4 w-4 mr-1" /> : <BellOff className="h-4 w-4 mr-1" />}
                      {remindersActive ? 'Active' : 'Inactive'}
                    </Button>
                  </div>
                  
                  <AnimatePresence>
                  {remindersActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Remind me every</span>
                          <span className="text-sm font-medium">{reminderInterval} minutes</span>
                        </div>
                        <Slider
                          value={[reminderInterval]}
                          min={30}
                          max={120}
                          step={15}
                          onValueChange={([value]) => updateReminderInterval(value)}
                        />
                      </div>
                      
                        <motion.div 
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/30 p-3 flex items-start mt-4 border border-blue-100 dark:border-blue-900"
                        >
                          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                            <Clock className="h-4 w-4 text-blue-500" />
                          </div>
                        <div>
                          <p className="text-sm font-medium">Next reminder</p>
                          <p className="text-xs text-muted-foreground">
                            {format(nextReminder, 'h:mm a')}
                          </p>
                        </div>
                        </motion.div>
                      </motion.div>
                  )}
                  </AnimatePresence>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList className="bg-card/50 backdrop-blur-sm border dark:border-white/5 p-1">
            <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Weekly History</TabsTrigger>
            <TabsTrigger value="entries" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Today's Entries</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Insights</TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
          <TabsContent value="history">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
              <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                <CardTitle>Weekly Hydration History</CardTitle>
                <CardDescription>Your hydration progress over the past week</CardDescription>
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20">
                        <Waves className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weekHistory} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              border: 'none' 
                            }}
                        formatter={(value, name) => {
                          if (name === 'amount') return [`${value} ml`, 'Intake'];
                          if (name === 'target') return [`${value} ml`, 'Target'];
                          return [value, name];
                        }}
                      />
                      <Legend />
                          <Bar dataKey="amount" name="Intake" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
                            {weekHistory.map((entry, index) => (
                              <motion.rect 
                                key={`bar-${index}`}
                                fillOpacity={1}
                                initial={{ height: 0, y: 300 }}
                                animate={{ height: undefined, y: undefined }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                              />
                            ))}
                          </Bar>
                      <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
              </motion.div>
          </TabsContent>
          
          <TabsContent value="entries">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
              <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                <CardTitle>Today's Hydration Entries</CardTitle>
                <CardDescription>All water intake logged today</CardDescription>
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20">
                        <Droplet className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
              </CardHeader>
              <CardContent>
                {hydrationData.entries.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-center py-8 text-muted-foreground"
                      >
                        <div className="flex justify-center mb-4">
                          <div className="h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                            <Droplets className="h-8 w-8 text-blue-300" />
                          </div>
                    </div>
                        <h3 className="text-lg font-medium mb-1">No entries yet today</h3>
                    <p className="text-sm">Add your first water intake to get started</p>
                      </motion.div>
                ) : (
                      <motion.div 
                        className="space-y-3"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                    {hydrationData.entries.map((entry, index) => (
                          <motion.div 
                            key={entry.id} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center p-3 bg-gradient-to-r from-blue-50/80 to-blue-50/20 dark:from-blue-900/20 dark:to-blue-900/5 rounded-lg border border-blue-100/50 dark:border-blue-800/30"
                          >
                            <div className="mr-4 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                          <Droplets className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{entry.amount} ml</p>
                            <p className="text-sm text-muted-foreground">{entry.time}</p>
                          </div>
                              <div className="mt-0.5 h-1 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, (entry.amount / 500) * 100)}%` }}
                                  transition={{ duration: 0.5, delay: 0.2 + (index * 0.05) }}
                              className="h-full bg-blue-500 rounded-full"
                                />
                          </div>
                        </div>
                          </motion.div>
                    ))}
                      </motion.div>
                )}
              </CardContent>
            </Card>
              </motion.div>
          </TabsContent>
          
          <TabsContent value="insights">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
              <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                <CardTitle>Hydration Insights</CardTitle>
                <CardDescription>Analysis of your hydration habits</CardDescription>
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                        <Zap className="h-5 w-5 text-emerald-500" />
                      </div>
                    </div>
              </CardHeader>
              <CardContent>
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="p-4 border border-emerald-100 dark:border-emerald-900 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-emerald-950/50 dark:to-emerald-950/20"
                      >
                        <h3 className="font-semibold flex items-center text-emerald-700 dark:text-emerald-300">
                      <Droplet className="h-4 w-4 mr-2" /> Hydration Level
                    </h3>
                    <p className="mt-1 text-sm">
                      {hydrationData.percentage >= 90 ? 'Excellent! You\'re well-hydrated today.' :
                       hydrationData.percentage >= 70 ? 'Good progress! Keep drinking water regularly.' :
                       hydrationData.percentage >= 50 ? 'You\'re halfway to your goal. Keep it up!' :
                       'You need more water today. Try to drink regularly.'}
                    </p>
                      </motion.div>
                  
                      <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 border rounded-lg"
                      >
                    <h3 className="font-semibold flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" /> Weekly Trend
                    </h3>
                    <p className="mt-1 text-sm">
                      {Math.random() > 0.5 ? 
                        'You\'re drinking more water compared to last week. Great job!' : 
                        'Your water intake is slightly lower than last week. Try to drink more regularly.'}
                    </p>
                      </motion.div>
                  
                      <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="p-4 border rounded-lg"
                      >
                    <h3 className="font-semibold flex items-center">
                      <Calendar className="h-4 w-4 mr-2" /> Best Hydration Day
                    </h3>
                    <p className="mt-1 text-sm">
                      Your best hydration day this week was {
                        weekHistory.sort((a, b) => b.percentage - a.percentage)[0].date
                      } with {
                        weekHistory.sort((a, b) => b.percentage - a.percentage)[0].percentage
                      }% of your target.
                    </p>
                      </motion.div>
                    </motion.div>
              </CardContent>
              <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                    >
                      View Detailed Report
                    </Button>
              </CardFooter>
            </Card>
              </motion.div>
          </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default HydrationTracker; 