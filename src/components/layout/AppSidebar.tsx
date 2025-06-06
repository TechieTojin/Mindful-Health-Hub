import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  Brain, Calendar, Dumbbell, Home, LineChart, MessageSquare, Mic, Settings, 
  Video, Heart, LogOut, ChevronRight, PlayCircle, Utensils, Apple, Award, 
  Database, Lock, Shield, Info, User, LogIn, BarChart3, Bell, ChevronDown,
  Activity, Trophy, LayoutDashboard, BarChart, Droplets, Watch,
  FileText,
  Sparkles,
  Lightbulb,
  Stethoscope,
  Code,
  Layers,
  Users,
  Moon,
  PieChart,
  Search,
  Plus,
  Smartphone,
  BarChart2,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/dashboard",
    submenu: [
      { title: "Home Dashboard", icon: Home, path: "/dashboard" },
      { title: "Customize Dashboard", icon: Settings, path: "/dashboard-customize" },
    ],
  },
  {
    title: "Analytics",
    icon: LineChart,
    path: "/analytics",
  },
  {
    title: "Workouts",
    icon: Dumbbell,
    path: "/workouts",
  },
  {
    title: "Fitness Progress",
    icon: BarChart3,
    path: "/fitness-progress",
    badge: "New"
  },
  {
    title: "Mental Wellness",
    icon: Brain,
    path: "/mental-wellness",
  },
  {
    title: "Calendar",
    icon: Calendar,
    path: "/calendar",
  },
  {
    title: "Live Workout",
    icon: PlayCircle,
    path: "/live-workout",
    badge: "Live",
    realtime: true
  },
  {
    title: "Health Hub",
    icon: Activity,
    path: "/health-hub",
    submenu: [
      { title: "Sleep Analysis", icon: Moon, path: "/sleep-analysis" },
      { title: "Health Report", icon: BarChart2, path: "/health-report" },
    ],
  },
  {
    title: "Data & Tracking",
    icon: PieChart,
    path: "/data-tracking",
    submenu: [
      { title: "Live Stats Dashboard", icon: Activity, path: "/live-stats-dashboard", badge: "Live", realtime: true },
      { title: "Hydration Tracker", icon: Droplets, path: "/hydration-tracker" },
      { title: "Sleep Insights", icon: Moon, path: "/sleep-insights" },
      { title: "Heart Rate", icon: Heart, path: "/heart-rate" },
      { title: "Data Vault", icon: Shield, path: "/data-vault" },
    ],
  },
  {
    title: "AI Features",
    icon: Sparkles,
    path: "/ai-features",
    badge: "AI",
    submenu: [
      { title: "Voice Assistant", icon: Mic, path: "/ai-voice-assistant" },
      { title: "Video Analysis", icon: Video, path: "/ai-video-analysis" },
      { title: "Coach Chat", icon: MessageSquare, path: "/ai-coach-chat" },
    ],
  },
  {
    title: "Food & Nutrition",
    icon: Utensils,
    path: "/nutrition",
    submenu: [
      { title: "Food Scanner", icon: Search, path: "/food-scanner", badge: "New" },
      { title: "Meal Planner", icon: Calendar, path: "/meal-planner" },
      { title: "Meal Database", icon: Database, path: "/meal-database" },
      { title: "Add Meal", icon: Plus, path: "/add-meal" },
      { title: "Meal Details", icon: Apple, path: "/meal" },
    ],
  },
  {
    title: "Achievements & Goals",
    icon: Award,
    path: "/achievements",
    submenu: [
      { title: "Achievements", icon: Trophy, path: "/achievements" },
      { title: "Daily Schedule", icon: Calendar, path: "/daily-schedule" },
    ],
  },
  {
    title: "Connect Devices",
    icon: Smartphone,
    path: "/connect-device",
  },
  {
    title: "Profile Settings",
    icon: User,
    path: "/profile-settings",
  },
  {
    title: "Authentication",
    icon: Shield,
    path: "/auth",
    submenu: [
      { title: "Login", icon: LogIn, path: "/login" },
      { title: "Register", icon: User, path: "/register" },
      { title: "Web3 Login", icon: Shield, path: "/web3-login" },
      { title: "Web3 Register", icon: Shield, path: "/web3-register" },
      { title: "Web3 Auth", icon: Shield, path: "/web3-auth" },
    ],
  },
];

const mealItems = [
  {
    title: "Food Scanner",
    icon: Utensils,
    path: "/food-scanner",
    badge: "New",
  },
  {
    title: "Meal Planner",
    icon: Apple,
    path: "/meal",
  },
  {
    title: "Weekly Meals",
    icon: Calendar,
    path: "/meal-planner",
  },
];

const progressItems = [
  {
    title: "Live Stats Dashboard",
    icon: Activity,
    path: "/live-stats-dashboard",
    badge: "Live",
    realtime: true
  },
  {
    title: "Hydration Tracker",
    icon: Droplets,
    path: "/hydration-tracker",
  },
  {
    title: "Sleep Analysis",
    icon: Watch,
    path: "/sleep-analysis",
  },
  {
    title: "Achievements",
    icon: Award,
    path: "/achievements",
    badge: "3",
    count: 3,
  },
  {
    title: "Health Report",
    icon: Activity,
    path: "/health-report",
    badge: "New",
  },
  {
    title: "Data Vault",
    icon: Shield,
    path: "/data-vault",
    badge: "Sync",
    realtime: true
  },
];

const inputItems = [
  {
    title: "Voice Assistant",
    icon: Mic,
    path: "/ai-voice-assistant",
    badge: "AI",
  },
  {
    title: "Video Analysis",
    icon: Video,
    path: "/ai-video-analysis",
    badge: "AI",
  },
  {
    title: "Chat Coach",
    icon: MessageSquare,
    path: "/chat",
    badge: "2",
    count: 2,
  },
];

// Public navigation items for non-authenticated users
const publicItems = [
  {
    title: "About Us",
    icon: Info,
    path: "/about",
  },
  {
    title: "Features",
    icon: Award,
    path: "/#features",
  },
  {
    title: "Pricing",
    icon: Database,
    path: "/#pricing",
  },
];

const ActiveUserIndicator = () => (
  <span className="relative flex h-3 w-3 ml-auto">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
  </span>
);

// Add a new loading screen component
const ModernLoadingScreen = ({ progress }) => (
  <div className="flex flex-col items-center justify-center h-full p-6">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-20 h-20 mb-6 relative"
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-health-primary to-health-accent opacity-20 animate-pulse"></div>
      <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
        <Heart className="h-8 w-8 text-health-primary animate-pulse" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-20 w-20 rounded-full border-2 border-health-primary border-t-transparent animate-spin"></div>
      </div>
    </motion.div>
    
    <motion.h3 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-health-primary to-health-accent"
    >
      Preparing Your Health Hub
    </motion.h3>
    
    <motion.div 
      initial={{ opacity: 0, width: "40%" }}
      animate={{ opacity: 1, width: "100%" }}
      transition={{ duration: 1.5 }}
      className="w-full max-w-xs mb-6"
    >
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-health-primary to-health-accent"
        />
      </div>
    </motion.div>
    
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="text-sm text-muted-foreground flex items-center gap-2"
    >
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div 
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              delay: i * 0.2,
              repeatDelay: 0.5
            }}
            className="h-2 w-2 rounded-full bg-health-primary"
          />
        ))}
      </div>
      <span>Loading your personalized experience...</span>
    </motion.div>
  </div>
);

const AppSidebar = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  
  // Add loading state
  const [isLoading, setIsLoading] = useState(true);
  const [connectionProgress, setConnectionProgress] = useState(0);
  
  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    meals: true,
    progress: true,
    ai: true,
    'health-hub': true
  });
  
  // State for real-time counters and indicators
  const [liveUsers, setLiveUsers] = useState(24);
  const [notifications, setNotifications] = useState(3);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSync, setIsSync] = useState(false);

  // Function to toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Show loading state for 3 seconds (reduced from 6 seconds)
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    // Update connection progress every 100ms
    const progressInterval = setInterval(() => {
      setConnectionProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 3.3; // Roughly reach 100 in 3 seconds
      });
    }, 100);
    
    return () => {
      clearTimeout(loadingTimer);
      clearInterval(progressInterval);
    };
  }, []);
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update live users count
      setLiveUsers(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        return Math.max(15, prev + change);
      });

      // Random chance to increment notifications
      if (Math.random() < 0.1) {
        setNotifications(prev => prev + 1);
      }
    }, 5000);

    // Simulate data sync
    const syncInterval = setInterval(() => {
      if (!isSync && Math.random() < 0.2) {
        setIsSync(true);
        const progressInterval = setInterval(() => {
          setSyncProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              setTimeout(() => {
                setIsSync(false);
                setSyncProgress(0);
              }, 1000);
              return 100;
            }
            return prev + 10;
          });
        }, 300);
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(syncInterval);
    };
  }, [isSync]);
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Rendering menu items with better animations
  const renderMenuItems = (items, activeIndication = false) => {
    return items.map((item, index) => (
      <SidebarMenuItem key={item.title}>
        {item.submenu ? (
          // Handle items with submenus (like Health Hub)
          <div className="space-y-1">
            {/* Main menu item with dropdown indicator */}
            <motion.div 
              whileHover={{ x: 3 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={cn(
              "group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative overflow-hidden",
                "text-muted-foreground hover:bg-gradient-to-r hover:from-health-primary/10 hover:to-transparent hover:text-foreground cursor-pointer"
            )}
              onClick={() => toggleSection(item.title.toLowerCase().replace(/\s+/g, '-'))}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: [0, -10, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-health-primary transition-colors duration-300" />
                </motion.div>
                <span className="truncate">{item.title}</span>
              </div>
              <motion.div
                animate={{ 
                  rotate: expandedSections[item.title.toLowerCase().replace(/\s+/g, '-')] ? 0 : 180,
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20 
                }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </motion.div>
            
            {/* Submenu items */}
            <AnimatePresence>
              {expandedSections[item.title.toLowerCase().replace(/\s+/g, '-')] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="pl-4 overflow-hidden"
                >
                  <motion.div 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="space-y-1 border-l-2 border-muted pl-2"
                  >
                    {item.submenu.map((subItem, subIndex) => (
                      <motion.div
                        key={subItem.title}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + (subIndex * 0.05) }}
                        whileHover={{ x: 3 }}
                        className="menu-hover-effect"
                      >
                        <SidebarMenuButton asChild isActive={isActive(subItem.path)}>
                        <Link to={subItem.path} className={cn(
                          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all relative overflow-hidden",
                          isActive(subItem.path) ? 
                            "bg-gradient-to-r from-health-primary/20 to-health-primary/5 text-health-primary shadow-sm" : 
                            "text-muted-foreground hover:bg-gradient-to-r hover:from-health-primary/5 hover:to-transparent hover:text-foreground"
                        )}>
                          {!isActive(subItem.path) && (
                            <motion.div 
                              initial={{ width: 0 }}
                              whileHover={{ width: "100%" }}
                              transition={{ duration: 0.3 }}
                              className="absolute inset-0 bg-gradient-to-r from-health-primary/10 to-transparent -z-10"
                            />
                            )}
                            
                            <div className="relative">
                              <motion.div
                                whileHover={{ rotate: [0, -10, 0] }}
                                transition={{ duration: 0.4 }}
                              >
                          <subItem.icon className={cn(
                            "h-4 w-4 transition-colors duration-300",
                            isActive(subItem.path) ? "text-health-primary" : "text-muted-foreground group-hover:text-foreground"
                          )} />
                              </motion.div>
                              {isActive(subItem.path) && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.3 }}
                                  className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-health-primary"
                                />
                              )}
                            </div>
                          
                          <span className="truncate">{subItem.title}</span>
                          
                          {isActive(subItem.path) && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto h-2 w-2 rounded-full bg-health-primary"
                            ></motion.div>
                          )}
                        </Link>
                      </SidebarMenuButton>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          // Regular menu items without submenu
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ x: 3 }}
            className="menu-hover-effect"
          >
          <SidebarMenuButton asChild isActive={isActive(item.path)}>
            <Link to={item.path} className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative overflow-hidden",
              isActive(item.path) ? 
                "bg-gradient-to-r from-health-primary/20 to-health-primary/5 text-health-primary shadow-sm" : 
                  "text-muted-foreground hover:bg-gradient-to-r hover:from-health-primary/5 hover:to-transparent hover:text-foreground"
            )}>
              {/* Hover background effect */}
              {!isActive(item.path) && (
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  whileHover={{ width: "100%", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-r from-health-primary/10 to-transparent -z-10"
                />
              )}
              
              {/* Icon with pulse effect for realtime items */}
              <div className={cn(
                "relative",
                item.realtime && !isActive(item.path) && "group-hover:animate-pulse"
              )}>
                  <motion.div whileHover={{ rotate: [0, -10, 0] }} transition={{ duration: 0.4 }}>
                <item.icon className={cn(
                  "h-5 w-5 transition-colors duration-300",
                  isActive(item.path) ? "text-health-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                  </motion.div>
                
                {/* Animated glow effect for real-time items */}
                {item.realtime && (
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="absolute inset-0 bg-health-primary rounded-full -z-10"
                  />
                )}
              </div>
              
              <span className="truncate">{item.title}</span>
              
              {/* Active indicator dot */}
              {isActive(item.path) && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="ml-auto h-2 w-2 rounded-full bg-health-primary"
                />
              )}
              
              {/* Badge or counter with animations */}
              {item.badge && !isActive(item.path) && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                  "ml-auto inline-flex h-5 items-center justify-center rounded-full px-2 text-xs font-medium ring-1 ring-inset",
                  item.badge === 'New' 
                    ? "bg-health-accent/10 text-health-accent ring-health-accent/20" 
                    : item.badge === 'Live'
                      ? "bg-green-500/10 text-green-500 ring-green-500/20"
                      : item.badge === 'AI'
                        ? "bg-purple-500/10 text-purple-500 ring-purple-500/20"
                        : item.badge === 'Sync'
                          ? "bg-blue-500/10 text-blue-500 ring-blue-500/20"
                          : "bg-health-primary/10 text-health-primary ring-health-primary/20"
                  )}
                >
                  {/* Animated content for badges */}
                  {item.title === "Live Workout" && isActive(item.path)
                    ? (
                      <motion.span 
                        key={liveUsers}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                      >
                        {`${liveUsers} online`}
                      </motion.span>
                    )
                    : item.badge === 'Sync' && isSync
                      ? (
                        <motion.span
                          key={syncProgress}
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                        >{`${syncProgress}%`}</motion.span>
                      )
                      : item.badge
                  }
                </motion.span>
              )}
              
              {/* Online user indicator for active items */}
              {activeIndication && item.count && !isActive(item.path) && (
                <ActiveUserIndicator />
              )}
            </Link>
          </SidebarMenuButton>
          </motion.div>
        )}
      </SidebarMenuItem>
    ));
  };

  return (
    <Sidebar className="border-r bg-sidebar/90 dark:bg-sidebar/80 sidebar-glass-effect">
      {isLoading ? (
        <ModernLoadingScreen progress={connectionProgress} />
      ) : (
        <>
          {/* Modern header with animated gradient */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-health-primary/10 via-health-secondary/10 to-health-accent/10 backdrop-blur-sm border-b border-health-primary/10 px-3 py-2 animated-gradient"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                  className="h-6 w-6 rounded-full bg-gradient-to-r from-health-primary to-health-accent flex items-center justify-center text-white shadow-md"
                >
                  <Heart className="h-3 w-3" />
                </motion.div>
              </div>
              <div className="flex items-center gap-1">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-green-500"
                />
            </div>
            </div>
          </motion.div>
          
          <SidebarHeader className="px-6 py-5 mb-2">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <div className="relative group">
                <motion.div 
                  animate={{ 
                    opacity: [0.4, 0.8, 0.4],
                    scale: [0.9, 1.05, 0.9]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -inset-0.5 bg-gradient-to-r from-health-primary to-health-accent rounded-lg blur opacity-60 group-hover:opacity-100"
                />
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-health-primary to-health-accent text-white shadow-lg">
                  <Heart className="h-4 w-4" />
                </div>
          </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-health-primary to-health-accent transition-all duration-300">MindfulHealth</span>
              {notifications > 0 && (
                <Badge variant="outline" className="h-5 ml-auto bg-red-500/10 text-red-500 hover:bg-red-500/20">
                  {notifications} new
                </Badge>
              )}
        </Link>
      </SidebarHeader>
          
          <SidebarContent className="px-4 py-2 sidebar-scrollbar overflow-y-auto max-h-[calc(100vh-130px)]">
            <SidebarTrigger className="absolute right-2 top-4 sm:right-5" />
            
            {/* Conditional content based on authentication */}
            {isAuthenticated ? (
              <div>
                {/* User Profile with animation */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6 px-2"
                >
                <Link to="/profile-settings">
                  <motion.div 
                    whileHover={{ scale: 1.02, x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-gradient-to-r hover:from-health-primary/5 hover:to-transparent transition-all cursor-pointer border border-transparent hover:border-health-primary/20 group"
                  >
                      <div className="relative">
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
                        <Avatar className="h-10 w-10 border-2 border-health-primary/20 relative group-hover:border-health-primary/40 transition-all">
                        <AvatarImage src="https://t4.ftcdn.net/jpg/00/87/28/19/360_F_87281963_29bnkFXa6RQnJYWeRfrSpieagNxw1Rru.jpg" alt={user?.name || "User"} />
                        <AvatarFallback>{user?.name?.substring(0, 2) || "MH"}</AvatarFallback>
                      </Avatar>
                      </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-health-primary transition-colors">{user?.name || "Sarah Johnson"}</p>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                          <motion.span 
                          className="font-medium text-xs text-muted-foreground group-hover:text-health-primary/70 transition-colors"
                        >
                          View Profile
                        </motion.span>
                      </p>
                    </div>
                      <motion.div
                      whileHover={{ x: 2 }}
                        transition={{ duration: 0.2 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="h-4 w-4 text-health-primary/70" />
                      </motion.div>
                  </motion.div>
                  </Link>
                </motion.div>
                
                {/* Menu Items */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-1 flex items-center">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: 16 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="h-px bg-gradient-to-r from-health-primary/30 to-transparent mr-2"
                      />
                      Menu
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 16 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="h-px bg-gradient-to-l from-health-primary/30 to-transparent ml-2"
                    />
                  </SidebarGroupLabel>
                        <SidebarGroupContent>
                          <SidebarMenu className="px-1 space-y-1">
                        {renderMenuItems(menuItems)}
                          </SidebarMenu>
                        </SidebarGroupContent>
                </SidebarGroup>
                </motion.div>
        
                {/* Health Score */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mt-auto px-4 py-4"
                >
                  <motion.div 
                    className="rounded-xl bg-gradient-to-r from-health-primary/5 via-health-primary/10 to-health-accent/5 p-4 mt-6 border border-health-primary/10 shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-health-primary to-health-accent flex items-center justify-center">
                        <Activity className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Health Score</h4>
                        <p className="text-xs text-muted-foreground">Very Good</p>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-background/50 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-health-primary to-health-accent"
                        initial={{ width: 0 }}
                        animate={{ width: "78%" }}
                        transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-right text-muted-foreground">78/100</div>
                  </motion.div>
                  </motion.div>
                </div>
            ) : (
              <div>
                {/* Non-authenticated UI */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 px-4 py-4 rounded-xl bg-gradient-to-r from-health-primary/5 to-health-accent/5 border border-health-primary/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-health-primary/20 to-health-accent/20 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-health-primary" />
                  </div>
                    <div>
                      <h3 className="text-sm font-medium">Mindful Health Hub</h3>
                      <p className="text-xs text-muted-foreground">Personalized wellness companion</p>
                  </div>
                </div>
                
                  <motion.div 
                    className="grid grid-cols-2 gap-2 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {[
                      { name: "Health", icon: <Activity className="h-3 w-3" /> },
                      { name: "Fitness", icon: <Dumbbell className="h-3 w-3" /> },
                      { name: "Nutrition", icon: <Apple className="h-3 w-3" /> }, 
                      { name: "Mindfulness", icon: <Brain className="h-3 w-3" /> }
                    ].map((module, i) => (
                      <motion.div 
                        key={module.name}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        className="px-2 py-1.5 text-xs bg-card/80 backdrop-blur-sm rounded-lg border border-health-primary/10 text-muted-foreground flex items-center justify-center gap-1.5"
                      >
                        <span className="text-health-primary">{module.icon}</span>
                        {module.name}
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
                
                {/* Discovery Items */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                <SidebarGroup className="mt-4">
                    <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-1 flex items-center">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: 16 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="h-px bg-gradient-to-r from-health-primary/30 to-transparent mr-2"
                      />
                      Discover
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: 16 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="h-px bg-gradient-to-l from-health-primary/30 to-transparent ml-2"
                      />
                    </SidebarGroupLabel>
          <SidebarGroupContent>
                    <SidebarMenu className="px-1 space-y-1">
                        {publicItems.map((item, index) => (
                          <motion.div
                            key={item.title}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + (index * 0.05) }}
                          >
                            <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                                <Link to={item.path} className={cn(
                                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative overflow-hidden",
                                  isActive(item.path) ? 
                                    "bg-gradient-to-r from-health-primary/20 to-health-primary/5 text-health-primary shadow-sm" : 
                                    "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                )}>
                                  {!isActive(item.path) && (
                                    <motion.div 
                                      initial={{ width: 0, opacity: 0 }}
                                      whileHover={{ width: "100%", opacity: 1 }}
                                      transition={{ duration: 0.3 }}
                                      className="absolute inset-0 bg-gradient-to-r from-health-primary/10 to-transparent -z-10"
                                    />
                                  )}
                                  <item.icon className={cn(
                                    "h-5 w-5 transition-colors duration-300",
                                    isActive(item.path) ? "text-health-primary" : "text-muted-foreground group-hover:text-foreground"
                                  )} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                          </motion.div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
                </motion.div>
                    </div>
              )}
              
            {/* Footer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-auto pt-6 pb-4 text-center"
            >
              <div className="flex justify-center items-center gap-2">
                <motion.div 
                  animate={{ 
                    width: ["30%", "70%", "30%"]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "mirror"
                  }}
                  className="h-px flex-1 bg-gradient-to-r from-transparent via-health-primary/20 to-transparent"
                />
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.8 }}
                  className="h-8 w-8 rounded-full bg-gradient-to-r from-health-primary/10 to-health-accent/10 flex items-center justify-center cursor-pointer"
                >
                  <Heart className="h-4 w-4 text-health-primary/60" />
                </motion.div>
                <motion.div 
                  animate={{ 
                    width: ["30%", "70%", "30%"]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "mirror"
                  }}
                  className="h-px flex-1 bg-gradient-to-r from-transparent via-health-primary/20 to-transparent"
                />
                </div>
              <div className="mt-2 text-xs bg-clip-text text-transparent bg-gradient-to-r from-health-primary/80 to-health-accent/80 font-medium">
                Mindful Health Hub
              </div>
            </motion.div>
      </SidebarContent>
        </>
      )}
    </Sidebar>
  );
};

// Remove the Fluvio-specific styling
const style = document.createElement('style');
style.innerHTML = `
  .sidebar-glass-effect {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  .menu-hover-effect {
    transition: all 0.3s ease;
  }
  
  .menu-hover-effect:hover {
    transform: translateX(3px);
  }
  
  .sidebar-scrollbar::-webkit-scrollbar {
    width: 5px;
  }
  
  .sidebar-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .sidebar-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(var(--health-primary), 0.2);
    border-radius: 10px;
  }
  
  .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(var(--health-primary), 0.4);
  }
  
  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  .animated-gradient {
    background-size: 200% 200%;
    animation: gradientShift 15s ease infinite;
  }
`;
document.head.appendChild(style);

export default AppSidebar;
