import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '../components/ui/badge';
import { Heart, Activity, Droplets, Wind, Watch, LayoutDashboard, RefreshCw, Clock, CalendarClock, AlertTriangle, ArrowUp, ArrowDown, Shield, Zap, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock real-time data simulation
const generateVitalData = () => {
  return {
    heartRate: Math.floor(Math.random() * 25) + 65, // 65-90 bpm
    spO2: Math.floor(Math.random() * 5) + 95, // 95-100%
    steps: Math.floor(Math.random() * 500) + (Math.floor(Date.now() / 3600000) % 24) * 500, // Increase throughout day
    calories: Math.floor(Math.random() * 100) + (Math.floor(Date.now() / 3600000) % 24) * 100, // Increases with steps
    bloodPressure: {
      systolic: Math.floor(Math.random() * 20) + 110, // 110-130
      diastolic: Math.floor(Math.random() * 15) + 70, // 70-85
    },
    respirationRate: Math.floor(Math.random() * 5) + 14, // 14-19 breaths per minute
    temperature: (Math.random() * 0.8 + 36.5).toFixed(1), // 36.5-37.3°C
    timestamp: new Date().toISOString(),
  };
};

// Sample historical data
const generateHistoricalData = (hours = 24) => {
  const data = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourOfDay = time.getHours();
    
    // Create more realistic patterns
    let heartRate = Math.floor(Math.random() * 15) + 65;
    // Heart rate higher during active hours (8am-8pm)
    if (hourOfDay >= 8 && hourOfDay <= 20) {
      heartRate += 10;
    }
    
    let steps = 0;
    // More steps during active hours with a peak at lunch and after work
    if (hourOfDay >= 6 && hourOfDay <= 22) {
      steps = Math.floor(Math.random() * 1000) + 200;
      if (hourOfDay === 12 || hourOfDay === 17) {
        steps += 1500;
      }
    }
    
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      heartRate,
      spO2: Math.floor(Math.random() * 3) + 96,
      steps,
      calories: Math.floor(steps * 0.05),
      systolic: Math.floor(Math.random() * 20) + 110,
      diastolic: Math.floor(Math.random() * 15) + 70,
      respirationRate: Math.floor(Math.random() * 5) + 14,
    });
  }
  
  return data;
};

// Health Zone calculation
const getHeartRateZone = (hr: number, age: number = 35) => {
  const maxHr = 220 - age;
  
  if (hr < maxHr * 0.5) return { zone: 'Rest', color: 'bg-blue-400' };
  if (hr < maxHr * 0.6) return { zone: 'Very Light', color: 'bg-green-400' };
  if (hr < maxHr * 0.7) return { zone: 'Light', color: 'bg-green-500' };
  if (hr < maxHr * 0.8) return { zone: 'Moderate', color: 'bg-yellow-400' };
  if (hr < maxHr * 0.9) return { zone: 'Hard', color: 'bg-orange-500' };
  return { zone: 'Maximum', color: 'bg-red-500' };
};

// Alert threshold checking
const checkAlerts = (vitals: any) => {
  const alerts = [];
  
  if (vitals.heartRate > 100) alerts.push({ 
    type: 'High Heart Rate', 
    message: 'Your heart rate is elevated',
    severity: 'warning'
  });
  
  if (vitals.heartRate < 55) alerts.push({ 
    type: 'Low Heart Rate', 
    message: 'Your heart rate is below normal range',
    severity: 'warning'
  });
  
  if (vitals.spO2 < 95) alerts.push({ 
    type: 'Low Blood Oxygen', 
    message: 'Your blood oxygen level is below optimal range',
    severity: 'warning'
  });
  
  if (vitals.bloodPressure.systolic > 140 || vitals.bloodPressure.diastolic > 90) alerts.push({ 
    type: 'High Blood Pressure', 
    message: 'Your blood pressure is elevated',
    severity: 'warning'
  });
  
  return alerts;
};

const LiveStatsDashboard = () => {
  const [currentVitals, setCurrentVitals] = useState(generateVitalData());
  const [historicalData, setHistoricalData] = useState(generateHistoricalData());
  const [alerts, setAlerts] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [connectedDevices, setConnectedDevices] = useState([
    { id: 'watch-01', name: 'Smart Watch', status: 'connected', battery: 78, lastSync: new Date() },
    { id: 'scale-01', name: 'Smart Scale', status: 'connected', battery: 92, lastSync: new Date() },
    { id: 'band-01', name: 'Fitness Band', status: 'connected', battery: 45, lastSync: new Date() }
  ]);
  
  const hrZone = getHeartRateZone(currentVitals.heartRate);
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newVitals = generateVitalData();
      setCurrentVitals(newVitals);
      setLastUpdated(new Date());
      
      // Check for alerts
      const newAlerts = checkAlerts(newVitals);
      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev].slice(0, 5));
      }
      
      // Update historical data every 5 updates
      if (Math.random() > 0.8) {
        setHistoricalData(prev => {
          const newData = [...prev.slice(1), {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            heartRate: newVitals.heartRate,
            spO2: newVitals.spO2,
            steps: newVitals.steps,
            calories: newVitals.calories,
            systolic: newVitals.bloodPressure.systolic,
            diastolic: newVitals.bloodPressure.diastolic,
            respirationRate: newVitals.respirationRate,
          }];
          return newData;
        });
      }
      
      // Simulate device updates
      if (Math.random() > 0.9) {
        setConnectedDevices(prev => {
          return prev.map(device => ({
            ...device,
            battery: Math.max(device.battery - Math.floor(Math.random() * 2), 0),
            lastSync: new Date()
          }));
        });
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const refreshData = () => {
    const newVitals = generateVitalData();
    setCurrentVitals(newVitals);
    setLastUpdated(new Date());
    setAlerts(checkAlerts(newVitals));
  };
  
  return (
    <div className="space-y-8">
      {/* Modern Hero Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500/90 via-indigo-500/80 to-purple-500/90 text-white mb-4">
        <div className="absolute inset-0 bg-[url('/images/pattern/dots.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
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
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-white"
                >
                  Live Stats Dashboard
                </motion.h1>
                <p className="text-white/80">
                  Real-time monitoring of your vital health metrics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-white/80 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
              <Button className="bg-white/10 hover:bg-white/20 text-white border-0" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Real-time vitals cards */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm overflow-hidden">
            <div className="absolute h-full w-1 bg-red-500 left-0 top-0"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-medium">Heart Rate</CardTitle>
              <div className="flex items-end justify-between">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{currentVitals.heartRate}</span>
                  <span className="text-sm ml-1">bpm</span>
                </div>
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Heart className="h-6 w-6 text-red-500" />
                </motion.div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-2">
                <Badge className={`${hrZone.color} text-xs font-medium`}>{hrZone.zone}</Badge>
                <Progress 
                  value={((currentVitals.heartRate - 50) / 130) * 100} 
                  className="h-2 mt-2" 
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm overflow-hidden">
            <div className="absolute h-full w-1 bg-blue-500 left-0 top-0"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-medium">Blood Oxygen</CardTitle>
              <div className="flex items-end justify-between">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{currentVitals.spO2}</span>
                  <span className="text-sm ml-1">%</span>
                </div>
                <Droplets className="h-6 w-6 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-2">
                <Badge className={currentVitals.spO2 >= 95 ? 'bg-green-500 text-xs font-medium' : 'bg-yellow-500 text-xs font-medium'}>
                  {currentVitals.spO2 >= 95 ? 'Normal' : 'Low'}
                </Badge>
                <Progress 
                  value={((currentVitals.spO2 - 90) / 10) * 100} 
                  className="h-2 mt-2" 
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm overflow-hidden">
            <div className="absolute h-full w-1 bg-green-500 left-0 top-0"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-medium">Steps</CardTitle>
              <div className="flex items-end justify-between">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{currentVitals.steps.toLocaleString()}</span>
                  <span className="text-sm ml-1">steps</span>
                </div>
                <Activity className="h-6 w-6 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-2">
                <Badge className={
                  currentVitals.steps > 7500 ? 'bg-green-500 text-xs font-medium' : 
                  currentVitals.steps > 5000 ? 'bg-yellow-500 text-xs font-medium' : 'bg-orange-500 text-xs font-medium'
                }>
                  {currentVitals.steps > 7500 ? 'Active' : 
                   currentVitals.steps > 5000 ? 'Moderate' : 'Light'}
                </Badge>
                <Progress 
                  value={(currentVitals.steps / 10000) * 100} 
                  className="h-2 mt-2" 
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm overflow-hidden">
            <div className="absolute h-full w-1 bg-purple-500 left-0 top-0"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-medium">Blood Pressure</CardTitle>
              <div className="flex items-end justify-between">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">
                    {currentVitals.bloodPressure.systolic}/{currentVitals.bloodPressure.diastolic}
                  </span>
                  <span className="text-sm ml-1">mmHg</span>
                </div>
                <Activity className="h-6 w-6 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-2">
                <Badge className={
                  currentVitals.bloodPressure.systolic <= 120 && currentVitals.bloodPressure.diastolic <= 80 ? 'bg-green-500 text-xs font-medium' : 
                  currentVitals.bloodPressure.systolic <= 140 && currentVitals.bloodPressure.diastolic <= 90 ? 'bg-yellow-500 text-xs font-medium' : 'bg-red-500 text-xs font-medium'
                }>
                  {currentVitals.bloodPressure.systolic <= 120 && currentVitals.bloodPressure.diastolic <= 80 ? 'Normal' : 
                   currentVitals.bloodPressure.systolic <= 140 && currentVitals.bloodPressure.diastolic <= 90 ? 'Elevated' : 'High'}
                </Badge>
                <div className="flex gap-2 mt-2">
                  <Progress 
                    value={((currentVitals.bloodPressure.systolic - 90) / 80) * 100} 
                    className="h-2 flex-1" 
                  />
                  <Progress 
                    value={((currentVitals.bloodPressure.diastolic - 60) / 50) * 100} 
                    className="h-2 flex-1 bg-purple-200" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      {/* Secondary vitals */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <motion.div whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}>
          <Card className="border-0 shadow-md bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Respiration Rate</CardTitle>
                <Wind className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="py-0">
              <div className="flex items-baseline">
                <span className="text-2xl font-semibold">{currentVitals.respirationRate}</span>
                <span className="text-sm ml-1 text-muted-foreground">breaths/min</span>
              </div>
              <div className="w-full h-1 bg-blue-100 dark:bg-blue-900/30 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-blue-400 rounded-full"
                  style={{ width: `${(currentVitals.respirationRate / 20) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}>
          <Card className="border-0 shadow-md bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Body Temperature</CardTitle>
                <Activity className="h-4 w-4 text-orange-400" />
              </div>
            </CardHeader>
            <CardContent className="py-0">
              <div className="flex items-baseline">
                <span className="text-2xl font-semibold">{currentVitals.temperature}</span>
                <span className="text-sm ml-1 text-muted-foreground">°C</span>
              </div>
              <div className="w-full h-1 bg-orange-100 dark:bg-orange-900/30 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-orange-400 rounded-full"
                  style={{ width: `${((Number(currentVitals.temperature) - 36) / 2) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}>
          <Card className="border-0 shadow-md bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
                <Zap className="h-4 w-4 text-red-400" />
              </div>
            </CardHeader>
            <CardContent className="py-0">
              <div className="flex items-baseline">
                <span className="text-2xl font-semibold">{currentVitals.calories}</span>
                <span className="text-sm ml-1 text-muted-foreground">kcal</span>
              </div>
              <div className="w-full h-1 bg-red-100 dark:bg-red-900/30 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-red-400 rounded-full"
                  style={{ width: `${(currentVitals.calories / 2000) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}>
          <Card className="border-0 shadow-md bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Active Minutes</CardTitle>
                <Watch className="h-4 w-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent className="py-0">
              <div className="flex items-baseline">
                <span className="text-2xl font-semibold">{Math.floor(currentVitals.steps / 100)}</span>
                <span className="text-sm ml-1 text-muted-foreground">min</span>
              </div>
              <div className="w-full h-1 bg-green-100 dark:bg-green-900/30 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-green-400 rounded-full"
                  style={{ width: `${(Math.floor(currentVitals.steps / 100) / 60) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      {/* Graphs and detailed data */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Tabs defaultValue="heart" className="mb-6">
          <TabsList className="mb-4 bg-card/50 backdrop-blur-sm border dark:border-white/5 p-1">
            <TabsTrigger value="heart" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Heart Rate</TabsTrigger>
            <TabsTrigger value="oxygen" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Blood Oxygen</TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Activity</TabsTrigger>
            <TabsTrigger value="bp" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Blood Pressure</TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <TabsContent value="heart">
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
                        <CardTitle>Heart Rate Trends</CardTitle>
                        <CardDescription>24-hour heart rate pattern</CardDescription>
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20">
                        <Heart className="h-5 w-5 text-red-500" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={historicalData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <defs>
                            <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="time" />
                          <YAxis domain={[50, 120]} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              border: 'none' 
                            }}
                          />
                          <Area type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} fill="url(#heartRateGradient)" activeDot={{ r: 8 }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          
            <TabsContent value="oxygen">
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
                        <CardTitle>Blood Oxygen Levels</CardTitle>
                        <CardDescription>24-hour SpO2 measurements</CardDescription>
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20">
                        <Droplets className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historicalData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="time" />
                          <YAxis domain={[90, 100]} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              border: 'none' 
                            }}
                          />
                          <Line type="monotone" dataKey="spO2" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          
            <TabsContent value="activity">
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
                        <CardTitle>Daily Activity</CardTitle>
                        <CardDescription>Steps and calories burned throughout the day</CardDescription>
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20">
                        <Activity className="h-5 w-5 text-green-500" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={historicalData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="time" />
                          <YAxis yAxisId="left" orientation="left" stroke="#22c55e" />
                          <YAxis yAxisId="right" orientation="right" stroke="#f97316" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              border: 'none' 
                            }}
                          />
                          <Legend />
                          <Bar yAxisId="left" dataKey="steps" name="Steps" fill="#22c55e" radius={[4, 4, 0, 0]} />
                          <Bar yAxisId="right" dataKey="calories" name="Calories" fill="#f97316" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          
            <TabsContent value="bp">
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
                        <CardTitle>Blood Pressure Trends</CardTitle>
                        <CardDescription>Systolic and diastolic readings</CardDescription>
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20">
                        <Activity className="h-5 w-5 text-purple-500" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historicalData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="time" />
                          <YAxis domain={[60, 160]} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              border: 'none' 
                            }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="systolic" stroke="#8b5cf6" strokeWidth={2} name="Systolic" />
                          <Line type="monotone" dataKey="diastolic" stroke="#a855f7" strokeWidth={2} name="Diastolic" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>
      
      {/* Connected devices and alerts section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <motion.div 
          className="lg:col-span-2"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Connected Devices</CardTitle>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {connectedDevices.length} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connectedDevices.map((device, index) => (
                  <motion.div 
                    key={device.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="relative mr-3">
                        <div className={`h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/10 flex items-center justify-center`}>
                          {device.id.includes('watch') && <Watch className="h-5 w-5 text-blue-500" />}
                          {device.id.includes('scale') && <BarChart2 className="h-5 w-5 text-blue-500" />}
                          {device.id.includes('band') && <Activity className="h-5 w-5 text-blue-500" />}
                        </div>
                        <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${device.status === 'connected' ? 'bg-green-500' : 'bg-orange-500'} border-2 border-white dark:border-gray-800`}></div>
                      </div>
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-xs text-muted-foreground">Last synced: {device.lastSync.toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4">
                        <div className="text-xs text-muted-foreground mb-1">Battery</div>
                        <div className="flex items-center">
                          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                device.battery > 50 ? 'bg-green-500' : 
                                device.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${device.battery}%` }}
                            ></div>
                          </div>
                          <span className="text-xs ml-2">{device.battery}%</span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-sm px-3 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300">
                        Settings
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Health Alerts</CardTitle>
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  {alerts.length} {alerts.length === 1 ? 'Alert' : 'Alerts'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-6 text-muted-foreground"
                >
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-1">All Clear</h3>
                  <p className="text-sm">No health alerts at this time</p>
                  <p className="text-xs text-muted-foreground mt-1">All vitals are within normal ranges</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {alerts.map((alert, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex p-3 rounded-lg border border-orange-100 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-orange-50/50 dark:from-orange-950/50 dark:to-orange-950/20"
                    >
                      <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{alert.type}</p>
                        <p className="text-xs text-muted-foreground">{alert.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LiveStatsDashboard; 