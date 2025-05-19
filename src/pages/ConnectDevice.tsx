import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation, useCycle } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, Watch, CheckCircle, Smartphone, Scan, Wifi, ChevronRight, LogIn, 
  ArrowUpRight, Sparkles, Activity, Heart, Layers, Zap,
  Shield, CloudOff, CloudSun, WifiIcon, BluetoothConnected, BluetoothOff, BookOpen, 
  Circle, Info, PlusCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import PageTitle from '@/components/layout/PageTitle';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ConnectDevice = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [glowEffect, toggleGlowEffect] = useCycle(false, true);
  const scanAnimation = useAnimation();
  const cardRef = useRef(null);
  
  // 0 = Initial state
  // 1 = Scanning (3 seconds)
  // 2 = Found devices, connecting (15 seconds)
  // 3 = Connected (6 seconds before redirect)
  
  const [progress, setProgress] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(false);
  const [scanningCount, setScanningCount] = useState(0);
  
  const devices = [
    { id: '1', name: "Tojin's Watch", type: 'watch', batteryLevel: 86, signal: 'strong', lastSync: '2 hrs ago', features: ['heart', 'steps', 'sleep'], firmware: '4.5.2', model: 'Galaxy Watch 5', img: 'https://images.samsung.com/is/image/samsung/p6pim/levant/2208/gallery/levant-galaxy-watch5-40mm-sm-r900nzsامئطر-533280744' },
    { id: '2', name: "Jaiby's A56", type: 'smartphone', batteryLevel: 72, signal: 'medium', lastSync: '6 hrs ago', features: ['gps', 'health', 'fitness'], firmware: '12.1.0', model: 'iPhone 13', img: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-family-select-2021?wid=940&hei=1112&fmt=jpeg&qlt=90&.v=1629842667000' },
    { id: '3', name: "Tojin's S25", type: 'smartphone', batteryLevel: 95, signal: 'excellent', lastSync: 'Just now', features: ['gps', 'sleep', 'activity'], firmware: '14.0.1', model: 'Samsung S22', img: 'https://images.samsung.com/is/image/samsung/p6pim/za/galaxy-s22/gallery/za-galaxy-s22-s901-412948-412948-533176-533176-cosmos-white-gallery-images-thumb-531447730' },
    { id: '4', name: "Fitbit Sense", type: 'watch', batteryLevel: 54, signal: 'poor', lastSync: '1 day ago', features: ['ecg', 'stress', 'oxygen'], firmware: '2.4.1', model: 'Fitbit Sense', img: 'https://www.fitbit.com/global/content/dam/fitbit/global/pdp/devices/sense/device-360/shadow/sense-shadow-device-360-hero.jpg' }
  ];
  
  // Pulse animation for devices
  const pulseAnimation = {
    initial: { scale: 1, opacity: 1 },
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  // Floating animation
  const floatAnimation = {
    initial: { y: 0 },
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  // Appear animation
  const appearAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  // Scan animation (ripple effect)
  const scanPulse = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: [0, 0.5, 0],
      scale: [1, 2, 1],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  // 3D tilt effect for cards
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  };
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    
    // Toggle glow effect every 3 seconds
    const glowTimer = setInterval(() => {
      toggleGlowEffect();
    }, 3000);
    
    // Show tip after 5 seconds on initial screen
    if (step === 0) {
      timer = setTimeout(() => {
        setShowTip(true);
      }, 5000);
    }
    
    if (step === 1) {
      // Scanning animation - 3 seconds
      setProgress(0);
      scanAnimation.start({
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
        transition: { duration: 1.5, repeat: Infinity }
      });
      
      progressInterval = setInterval(() => {
        setProgress(prev => {
          const newValue = prev + (100 / 30); // 100% in 3 seconds (with 100ms interval)
          return newValue >= 100 ? 100 : newValue;
        });
        
        // Randomize scanning count for visual effect
        if (Math.random() > 0.7) {
          setScanningCount(prev => prev + Math.floor(Math.random() * 3) + 1);
        }
      }, 100);
      
      timer = setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);
        setStep(2);
      }, 3000);
    } 
    else if (step === 2) {
      // Wait for device selection
      if (selectedDevice) {
        // Found & connecting animation - 15 seconds
        setProgress(0);
        progressInterval = setInterval(() => {
          setProgress(prev => {
            const newValue = prev + (100 / 150); // 100% in 15 seconds (with 100ms interval)
            return newValue >= 100 ? 100 : newValue;
          });
        }, 100);
        
        timer = setTimeout(() => {
          clearInterval(progressInterval);
          setProgress(100);
          setStep(3);
        }, 15000);
      }
    }
    else if (step === 3) {
      // Connected state - redirect after 6 seconds
      timer = setTimeout(() => {
        navigate('/dashboard');
      }, 6000);
    }
    
    return () => {
      clearTimeout(timer);
      if (progressInterval) clearInterval(progressInterval);
      clearInterval(glowTimer);
    };
  }, [step, navigate, selectedDevice, toggleGlowEffect, scanAnimation]);
  
  const handleConnectClick = () => {
    setStep(1);
  };
  
  const handleSelectDevice = (deviceId: string) => {
    setSelectedDevice(deviceId);
    // Automatically start connecting after device selection
    setProgress(0);
    setStep(2);
  };
  
  const getDeviceIcon = (type: string, signal: string) => {
    let icon;
    
    switch (type) {
      case 'watch':
        icon = <Watch className="h-5 w-5 mr-3 text-health-primary" />;
        break;
      case 'smartphone':
        icon = <Smartphone className="h-5 w-5 mr-3 text-health-primary" />;
        break;
      default:
        icon = <Smartphone className="h-5 w-5 mr-3 text-health-primary" />;
    }
    
    // Add signal indicator
    let signalColor = "";
    let signalIcon = null;
    
    switch(signal) {
      case 'excellent':
        signalColor = "text-green-500";
        signalIcon = <WifiIcon className="h-3 w-3 absolute -top-1 -right-1" />;
        break;
      case 'strong':
        signalColor = "text-green-500";
        signalIcon = <Wifi className="h-3 w-3 absolute -top-1 -right-1" />;
        break;
      case 'medium':
        signalColor = "text-yellow-500";
        signalIcon = <Wifi className="h-3 w-3 absolute -top-1 -right-1" />;
        break;
      case 'poor':
        signalColor = "text-red-500";
        signalIcon = <Wifi className="h-3 w-3 absolute -top-1 -right-1" />;
        break;
      default:
        signalIcon = null;
    }
    
    return (
      <div className="relative">
        {icon}
        {signalIcon && (
          <span className={`absolute -top-1 -right-1 ${signalColor}`}>
            {signalIcon}
          </span>
        )}
      </div>
    );
  };
  
  const renderDeviceList = () => {
    return devices.map(device => (
      <motion.div 
        key={device.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * Number(device.id) }}
        onClick={() => handleSelectDevice(device.id)}
        className={`flex items-center justify-between p-4 border rounded-xl mb-3 cursor-pointer hover:bg-muted/50 transition-all backdrop-blur-sm ${
          selectedDevice === device.id 
            ? 'border-health-primary bg-health-primary/5 shadow-lg shadow-health-primary/10' 
            : 'hover:shadow-md'
        }`}
        whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.08)" }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center">
          <div className={`relative p-2 rounded-full ${
            selectedDevice === device.id 
              ? 'bg-health-primary/10 ring-2 ring-health-primary/30' 
              : 'bg-muted'
          }`}>
            {getDeviceIcon(device.type, device.signal)}
            {selectedDevice === device.id && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-health-primary/30"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0.2, 0.7]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
          <div className="ml-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-base">{device.name}</span>
              {device.lastSync === 'Just now' && (
                <Badge variant="outline" className="h-5 bg-green-500/10 text-green-500 text-xs border-green-500/20">
                  <div className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  Active
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-muted-foreground flex items-center">
                <span className={`inline-block h-2 w-2 rounded-full mr-1 ${
                  device.batteryLevel > 80 ? 'bg-green-500' : 
                  device.batteryLevel > 30 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`} />
                {device.batteryLevel}%
              </span>
              
              <span className="text-xs text-muted-foreground">{device.model}</span>
              
              <span className="text-xs text-muted-foreground">
                Last sync: {device.lastSync}
              </span>
            </div>
            <div className="flex gap-1 mt-1.5">
              {device.features.map((feature, i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          {selectedDevice === device.id ? (
            <div className="text-xs bg-health-primary/20 text-health-primary px-3 py-1.5 rounded-full animate-pulse flex items-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="h-3 w-3 mr-1.5"
              >
                <Circle className="h-3 w-3" />
              </motion.div>
              Connecting...
            </div>
          ) : (
            <motion.div
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          )}
        </div>
      </motion.div>
    ));
  };
  
  const getSelectedDeviceName = () => {
    const device = devices.find(d => d.id === selectedDevice);
    return device ? device.name : "";
  };
  
  // Background particles
  const particles = [...Array(20)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute rounded-full bg-health-primary/10"
      initial={{ 
        top: `${Math.random() * 100}%`, 
        left: `${Math.random() * 100}%`,
        scale: Math.random() * 0.5 + 0.5
      }}
      animate={{ 
        top: `${Math.random() * 100}%`, 
        left: `${Math.random() * 100}%`,
        opacity: [0.3, 0.6, 0.3]
      }}
      transition={{ 
        duration: Math.random() * 10 + 10, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ 
        width: `${Math.random() * 30 + 10}px`,
        height: `${Math.random() * 30 + 10}px`,
      }}
    />
  ));
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-health-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        
        {/* Dynamic background gradients */}
        <motion.div 
          className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-gradient-to-br from-health-primary/20 to-health-accent/5 rounded-full blur-[80px] -z-10"
          animate={glowEffect ? {
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          } : {}}
          transition={{ duration: 8, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-gradient-to-tr from-health-accent/10 to-purple-500/10 rounded-full blur-[100px] -z-10"
          animate={glowEffect ? {
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          } : {}}
          transition={{ duration: 10, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Floating elements */}
        <motion.div
          className="absolute top-[20%] left-[30%] h-3 w-3 rounded-full bg-health-primary/40"
          variants={floatAnimation}
          initial="initial"
          animate="float"
        />
        
        <motion.div
          className="absolute top-[70%] right-[20%] h-2 w-2 rounded-full bg-health-accent/40"
          variants={floatAnimation}
          initial="initial"
          animate="float"
          transition={{ delay: 1.5, duration: 4 }}
        />
        
        <motion.div
          className="absolute top-[40%] right-[35%] h-4 w-4 rounded-full bg-purple-400/30"
          variants={floatAnimation}
          initial="initial"
          animate="float"
          transition={{ delay: 0.8, duration: 5 }}
        />
        
        {particles}
      </div>
      
      <div className="w-full max-w-lg z-10">
        <motion.div
          variants={appearAnimation}
          initial="hidden"
          animate="visible"
        >
          <PageTitle 
            title="Connect Your Device"
            subtitle="Connect your fitness device to track your health metrics and receive personalized insights"
          />
          {step > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="mt-2"
            >
              <Badge variant="outline" className="bg-health-primary/10 text-health-primary border-health-primary/20">
                {step === 1 ? 'Scanning' : step === 2 ? 'Connecting' : 'Connected'}
              </Badge>
            </motion.div>
          )}
        </motion.div>
        
        <div className="w-full mt-8">
          {/* Remove authentication check and show connection UI for everyone */}
          <>
          <div className="relative mb-6">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div 
                className="h-full bg-gradient-to-r from-health-primary via-health-accent to-health-primary bg-size-200"
                initial={{ width: "0%", backgroundPosition: "0% 0%" }}
                animate={{ 
                  width: `${(step / 3) * 100}%`,
                  backgroundPosition: "100% 0%"
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            
            <div className="flex justify-between mt-3">
              {['Start', 'Scanning', 'Connecting', 'Complete'].map((label, index) => (
                <div key={label} className="flex flex-col items-center">
                  <motion.div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      step >= index 
                        ? 'bg-health-primary text-white' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                    animate={step === index ? {
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(var(--health-primary), 0.2)",
                        "0 0 0 10px rgba(var(--health-primary), 0)",
                        "0 0 0 0 rgba(var(--health-primary), 0)"
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: step === index ? Infinity : 0 }}
                  >
                    {step > index ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </motion.div>
                  <span className={`text-xs font-medium mt-1 ${
                    step >= index ? 'text-health-primary' : 'text-muted-foreground'
                  }`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm shadow-lg overflow-hidden rounded-xl perspective-1000" ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <CardContent className="p-8 flex flex-col items-center text-center">
              {/* Top Icon */}
              <motion.div 
                className={`mb-6 rounded-full p-6 ${step === 3 ? 'bg-green-50 dark:bg-green-950/30' : 'bg-muted/70'}`}
                animate={{ 
                  scale: step === 0 ? [1, 1.05, 1] : 1,
                  boxShadow: step === 3 ? ['0 0 0 rgba(74, 222, 128, 0)', '0 0 20px rgba(74, 222, 128, 0.4)', '0 0 0 rgba(74, 222, 128, 0)'] : 'none'
                }}
                transition={{ 
                  repeat: step === 0 || step === 3 ? Infinity : 0, 
                  duration: step === 0 ? 2 : 1.5 
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step === 3 ? (
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    ) : step === 1 ? (
                      <Scan className="h-12 w-12 text-health-primary" />
                    ) : (
                      <Smartphone className={`h-12 w-12 ${step > 0 ? 'text-health-primary' : 'text-muted-foreground'}`} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
              
              <AnimatePresence mode="wait">
                {/* Initial State */}
                {step === 0 && (
                  <motion.div 
                    className="space-y-6"
                    key="initial"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative">
                      <motion.div
                        className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-health-primary/10 to-health-accent/10 opacity-70 blur-lg"
                        animate={{ 
                          scale: [1, 1.05, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      <motion.div
                        className="relative flex items-center justify-center h-32 mb-4 bg-card/80 backdrop-blur-sm rounded-xl border border-health-primary/20 overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-health-primary via-health-accent to-transparent"></div>
                        
                        <div className="flex flex-col items-center justify-center">
                          <motion.div
                            className="rounded-full bg-health-primary/10 p-3"
                            animate={{ 
                              scale: [1, 1.05, 1],
                              opacity: [1, 0.8, 1]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Smartphone className="h-8 w-8 text-health-primary" />
                          </motion.div>
                          <motion.h3 
                            className="mt-3 text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-health-primary to-health-accent"
                            animate={{ 
                              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
                            }}
                            transition={{ duration: 5, repeat: Infinity }}
                            style={{ backgroundSize: "200% auto" }}
                          >
                            Health Device Sync
                          </motion.h3>
                        </div>
                        
                        {/* Decorative elements */}
                        <motion.div 
                          className="absolute top-2 right-2 h-5 w-5 rounded-full border border-health-primary/30 flex items-center justify-center"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        >
                          <motion.div className="h-2 w-2 rounded-full bg-health-primary/50" />
                        </motion.div>
                      </motion.div>
                    </div>
                    
                    <h3 className="text-xl font-medium">Ready to sync your fitness data?</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect your fitness device to enable real-time tracking, health analysis, and personalized recommendations.
                    </p>
                    
                    {showTip && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg bg-health-primary/5 border border-health-primary/20 text-xs text-health-primary/90 flex items-start gap-2"
                      >
                        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>For optimal tracking performance, place the device within 2 meters of your phone or computer during the connection process.</span>
                      </motion.div>
                    )}
                    
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button 
                        onClick={handleConnectClick} 
                        size="lg" 
                        className="mt-4 w-full bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90 text-white rounded-xl relative overflow-hidden group"
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                        <span className="relative z-10 flex items-center gap-2">
                          Connect Your Device
                          <PlusCircle className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                        </span>
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      className="text-center text-xs text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.8 }}
                      transition={{ delay: 0.5 }}
                    >
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <span className="cursor-help underline decoration-dotted underline-offset-2">Compatible with most fitness trackers and smartwatches</span>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="flex justify-between space-x-4">
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold">Supported devices include</h4>
                              <div className="text-xs text-muted-foreground">
                                <ul className="list-disc pl-4 space-y-1">
                                  <li>Apple Watch Series 4+</li>
                                  <li>Samsung Galaxy Watch 4+</li>
                                  <li>Fitbit Sense/Versa 3+</li>
                                  <li>Garmin Venu/Forerunner series</li>
                                  <li>And many more</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </motion.div>
                  </motion.div>
                )}
                
                {/* Scanning */}
                {step === 1 && (
                  <motion.div 
                    className="space-y-6 w-full"
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <motion.div
                        className="relative w-20 h-20 flex items-center justify-center"
                        animate={scanAnimation}
                      >
                        <div className="absolute inset-0 rounded-full bg-health-primary/10"></div>
                        <Wifi className="h-10 w-10 text-health-primary" />
                        {[...Array(3)].map((_, i) => (
                          <motion.div 
                            key={i}
                            className="absolute inset-0 rounded-full border-4 border-health-primary/30"
                            initial={{ scale: 1, opacity: 0.8 }}
                            animate={{
                              scale: [1, 2, 1],
                              opacity: [0.8, 0, 0.8]
                            }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: 2, 
                              ease: "easeOut",
                              delay: i * 0.4
                            }}
                          />
                        ))}
                        
                        {/* Radial scanning effect */}
                        <motion.div 
                          className="absolute -inset-5 rounded-full"
                          initial={{ opacity: 0 }}
                          animate={{ 
                            opacity: [0, 0.2, 0],
                            rotateZ: [0, 359]
                          }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          style={{
                            background: 'conic-gradient(transparent, transparent, rgba(var(--health-primary), 0.3), transparent)',
                          }}
                        />
                      </motion.div>
                    </div>
                    
                    <motion.h3 
                      className="text-xl font-medium"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Scanning for devices...
                    </motion.h3>
                    
                    <div className="relative">
                      <Progress 
                        value={progress} 
                        className="h-2 w-full rounded-full bg-muted [&>div]:bg-gradient-to-r [&>div]:from-health-primary [&>div]:to-health-accent [&>div]:animate-pulse" 
                      />
                      <motion.div 
                        className="absolute left-0 top-0 h-2 w-10 bg-white/50 blur-sm rounded-full" 
                        animate={{ x: ["0%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center p-3 rounded-lg bg-muted/30 backdrop-blur-sm border border-muted">
                        <motion.div 
                          className="text-sm font-medium text-health-primary"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {scanningCount}
                        </motion.div>
                        <div className="text-xs text-muted-foreground mt-1">Devices scanned</div>
                      </div>
                      
                      <div className="text-center p-3 rounded-lg bg-muted/30 backdrop-blur-sm border border-muted">
                        <div className="text-sm font-medium text-yellow-500 flex items-center justify-center gap-1">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          >
                            <Circle className="h-3 w-3" />
                          </motion.div>
                          Searching
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Networks</div>
                      </div>
                    </div>
                    
                    <motion.div 
                      className="text-sm text-muted-foreground flex items-center justify-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      <Info className="h-4 w-4" />
                      <p>
                        Please make sure your device is turned on and within range
                      </p>
                    </motion.div>
                  </motion.div>
                )}
                
                {/* Found Devices */}
                {step === 2 && !selectedDevice && (
                  <motion.div 
                    className="space-y-6 w-full"
                    key="devices"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-medium">Devices Found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select your device to connect
                    </p>
                    {renderDeviceList()}
                  </motion.div>
                )}
                
                {/* Connecting to specific device */}
                {step === 2 && selectedDevice && (
                  <motion.div 
                    className="space-y-6 w-full"
                    key="connecting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-medium">Connecting to {getSelectedDeviceName()}</h3>
                    <div className="relative py-2">
                      <Progress 
                        value={progress} 
                        className="h-2 w-full rounded-full bg-muted [&>div]:bg-gradient-to-r [&>div]:from-health-primary [&>div]:to-health-accent" 
                      />
                      <div className="mt-2 text-xs text-right text-muted-foreground">{Math.round(progress)}%</div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Establishing secure connection and syncing your data...
                    </p>
                    <div className="flex justify-center gap-2 text-xs text-muted-foreground">
                      <div className="animate-pulse">⚪</div>
                      <div className="animate-pulse delay-300">⚪</div>
                      <div className="animate-pulse delay-600">⚪</div>
                    </div>
                  </motion.div>
                )}
                
                {/* Connected successfully */}
                {step === 3 && (
                  <motion.div 
                    className="space-y-6 w-full"
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <motion.div
                        className="absolute -inset-10 rounded-full bg-green-500/10 blur-3xl"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: [0, 0.2, 0],
                          scale: [0.8, 1.2, 0.8]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      
                      <motion.div
                        className="flex flex-col items-center"
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <motion.div 
                          className="h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.2, 1] }}
                          transition={{ 
                            duration: 0.6, 
                            times: [0, 0.6, 1],
                            ease: "easeOut" 
                          }}
                        >
                          <CheckCircle className="h-10 w-10 text-white" />
                        </motion.div>
                        
                        <motion.div 
                          className="absolute inset-0 rounded-full"
                          initial={{ opacity: 0 }}
                          animate={{ 
                            opacity: [0, 0.5, 0],
                            scale: [1, 1.5, 1],
                          }}
                          transition={{ 
                            duration: 2,
                            delay: 0.3,
                            repeat: 2
                          }}
                          style={{
                            background: 'radial-gradient(circle, rgba(74, 222, 128, 0.4) 0%, rgba(74, 222, 128, 0) 70%)',
                          }}
                        />
                        
                        <motion.h3 
                          className="mt-6 text-2xl font-bold text-green-600 dark:text-green-400 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-400"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          Connected Successfully!
                        </motion.h3>
                      </motion.div>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-card/80 backdrop-blur-sm border border-green-200/30"
                    >
                      <div className="relative rounded-full overflow-hidden h-12 w-12 bg-muted flex items-center justify-center border border-green-200/30">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20"
                          animate={{ 
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                        {getDeviceIcon(devices.find(d => d.id === selectedDevice)?.type || 'smartphone', 'excellent')}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{getSelectedDeviceName()}</span>
                          <Badge variant="outline" className="h-5 bg-green-500/10 text-green-500 text-xs border-green-500/20">
                            <div className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            Active
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Ready to track your health metrics
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="p-3 rounded-lg bg-muted/50 border border-muted text-muted-foreground text-xs"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
                        <span>Redirecting to dashboard in a few seconds...</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        <span>Initial device sync complete</span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
          </>
        </div>
      </div>
    </div>
  );
};

export default ConnectDevice; 