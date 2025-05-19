import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaFileAlt, 
  FaRobot, 
  FaLightbulb, 
  FaNotesMedical, 
  FaHeartbeat, 
  FaChartLine, 
  FaCalendarAlt, 
  FaBrain, 
  FaAppleAlt, 
  FaBed, 
  FaRunning,
  FaSearch,
  FaBell,
  FaStar,
  FaArrowRight
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

// Mock health summary data
const healthSummary = {
  healthScore: 82,
  alerts: 2,
  recentUpdates: 4,
  lastCheckup: "2025-03-15",
  vitalSigns: {
    heartRate: { value: 68, status: "normal" },
    bloodPressure: { value: "122/78", status: "normal" },
    bloodGlucose: { value: 96, status: "normal" },
    temperature: { value: 98.6, status: "normal" }
  }
};

// Featured health modules
const featuredModules = [
  {
    id: "medical-records",
    title: "Medical Records",
    icon: FaFileAlt,
    path: "/medical-records",
    description: "Securely access and manage your medical history, test results, and health documents",
    updates: 3,
    color: "blue"
  },
  {
    id: "ai-summary",
    title: "AI Health Summary",
    icon: FaRobot,
    path: "/ai-summary",
    description: "Get AI-powered insights and analysis of your overall health trends and patterns",
    updates: 1,
    color: "purple"
  },
  {
    id: "personalized-insights",
    title: "Personalized Insights",
    icon: FaLightbulb,
    path: "/personalized-insights",
    description: "Receive tailored recommendations and articles based on your health profile",
    updates: 2,
    color: "amber"
  },
  {
    id: "symptom-checker",
    title: "Symptom Checker",
    icon: FaNotesMedical,
    path: "/symptom-checker",
    description: "Analyze your symptoms and get guidance on potential conditions and next steps",
    badge: "New",
    color: "green"
  }
];

// All health modules
const allHealthModules = [
  ...featuredModules,
  {
    id: "vitals-tracker",
    title: "Vitals Tracker",
    icon: FaHeartbeat,
    path: "/vitals-tracker",
    description: "Monitor and track your vital signs and health metrics over time",
    color: "red"
  },
  {
    id: "mental-wellness",
    title: "Mental Wellness",
    icon: FaBrain,
    path: "/mental-wellness",
    description: "Tools and resources for mental health tracking and improvement",
    color: "indigo"
  },
  {
    id: "fitness-progress",
    title: "Fitness Progress",
    icon: FaRunning,
    path: "/fitness-progress",
    description: "Track your workouts, set goals, and monitor your fitness journey",
    color: "cyan"
  },
  {
    id: "nutrition",
    title: "Nutrition",
    icon: FaAppleAlt,
    path: "/nutrition",
    description: "Meal planning, nutrient tracking, and dietary recommendations",
    color: "emerald"
  },
  {
    id: "sleep-analysis",
    title: "Sleep Analysis",
    icon: FaBed,
    path: "/sleep-analysis",
    description: "Understand your sleep patterns and improve your rest quality",
    color: "violet"
  },
  {
    id: "health-calendar",
    title: "Health Calendar",
    icon: FaCalendarAlt,
    path: "/calendar",
    description: "Schedule appointments, set medication reminders, and manage health activities",
    color: "fuchsia"
  },
  {
    id: "health-analytics",
    title: "Health Analytics",
    icon: FaChartLine,
    path: "/analytics",
    description: "Advanced analytics and visualizations of your health data",
    color: "teal"
  }
];

// Recent health activities
const recentActivities = [
  {
    id: 1,
    title: "Updated blood test results",
    type: "medical-records",
    time: "Today, 10:23 AM",
    icon: FaFileAlt,
    color: "blue"
  },
  {
    id: 2,
    title: "New personalized nutrition plan available",
    type: "insights",
    time: "Yesterday, 3:15 PM",
    icon: FaLightbulb,
    color: "amber"
  },
  {
    id: 3,
    title: "Upcoming appointment reminder",
    type: "calendar",
    time: "Mar 25, 9:00 AM",
    icon: FaCalendarAlt,
    color: "fuchsia"
  },
  {
    id: 4,
    title: "Weekly health assessment completed",
    type: "analytics",
    time: "Mar 22, 8:45 PM",
    icon: FaChartLine,
    color: "teal"
  }
];

const getColorClass = (color: string, type: "bg" | "text" | "border" | "gradient") => {
  const colorMap = {
    blue: {
      bg: "bg-blue-500",
      text: "text-blue-500",
      border: "border-blue-200 dark:border-blue-800",
      gradient: "from-blue-500 to-indigo-600"
    },
    purple: {
      bg: "bg-purple-500",
      text: "text-purple-500",
      border: "border-purple-200 dark:border-purple-800",
      gradient: "from-purple-500 to-violet-600"
    },
    amber: {
      bg: "bg-amber-500",
      text: "text-amber-500",
      border: "border-amber-200 dark:border-amber-800",
      gradient: "from-amber-500 to-orange-600"
    },
    green: {
      bg: "bg-green-500",
      text: "text-green-500",
      border: "border-green-200 dark:border-green-800",
      gradient: "from-green-500 to-emerald-600"
    },
    red: {
      bg: "bg-red-500",
      text: "text-red-500",
      border: "border-red-200 dark:border-red-800",
      gradient: "from-red-500 to-rose-600"
    },
    indigo: {
      bg: "bg-indigo-500",
      text: "text-indigo-500",
      border: "border-indigo-200 dark:border-indigo-800",
      gradient: "from-indigo-500 to-blue-600"
    },
    cyan: {
      bg: "bg-cyan-500",
      text: "text-cyan-500",
      border: "border-cyan-200 dark:border-cyan-800",
      gradient: "from-cyan-500 to-blue-600"
    },
    emerald: {
      bg: "bg-emerald-500",
      text: "text-emerald-500",
      border: "border-emerald-200 dark:border-emerald-800",
      gradient: "from-emerald-500 to-green-600"
    },
    violet: {
      bg: "bg-violet-500",
      text: "text-violet-500",
      border: "border-violet-200 dark:border-violet-800",
      gradient: "from-violet-500 to-purple-600"
    },
    fuchsia: {
      bg: "bg-fuchsia-500",
      text: "text-fuchsia-500",
      border: "border-fuchsia-200 dark:border-fuchsia-800",
      gradient: "from-fuchsia-500 to-pink-600"
    },
    teal: {
      bg: "bg-teal-500",
      text: "text-teal-500",
      border: "border-teal-200 dark:border-teal-800",
      gradient: "from-teal-500 to-cyan-600"
    }
  };

  return colorMap[color][type];
};

const HealthHub = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter modules based on search and category
  const filteredModules = allHealthModules.filter(module => 
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      className="container mx-auto p-4 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm dark:from-blue-950/30 dark:to-purple-950/30"></div>
        <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Welcome to Your Health Hub
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Your personalized health dashboard with AI-powered insights and complete health management tools
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button 
                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                size="lg"
              >
                Health Assessment <FaArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                Connect Health Device
              </Button>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="relative h-40 w-40 md:h-48 md:w-48">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-20 animate-pulse"></div>
              <div className="absolute inset-3 rounded-full bg-background"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold">{healthSummary.healthScore}</div>
                  <div className="text-sm font-medium text-muted-foreground">Health Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search health modules..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-muted-foreground" />
          </div>
        </div>
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Alerts</p>
              <p className="text-2xl font-bold">{healthSummary.alerts}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/30">
              <FaBell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Updates</p>
              <p className="text-2xl font-bold">{healthSummary.recentUpdates}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center dark:bg-green-900/30">
              <FaStar className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Modules */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Featured Health Tools</h2>
          <Button variant="outline" size="sm" className="gap-2">
            View All <FaArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {featuredModules.map((module) => (
            <motion.div key={module.id} variants={itemVariants}>
              <Link to={module.path} className="block h-full">
                <Card className="h-full hover:shadow-md transition-all duration-300 border-border/40 hover:border-border/80 overflow-hidden group">
                  <div className={`h-1.5 w-full bg-gradient-to-r ${getColorClass(module.color, "gradient")}`}></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-opacity-20 ${getColorClass(module.color, "text")} bg-${module.color}-100 dark:bg-${module.color}-900/30`}>
                        <module.icon className="h-5 w-5" />
                      </div>
                      {module.updates && (
                        <Badge variant="secondary" className="bg-background border h-6">
                          {module.updates} new
                        </Badge>
                      )}
                      {module.badge && (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white">
                          {module.badge}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mt-4 group-hover:text-primary transition-colors">
                      {module.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 h-10">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0 flex items-center justify-end">
                    <Button variant="ghost" size="sm" className="gap-1 group-hover:text-primary transition-colors">
                      Access <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Health Summary and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Summary Card */}
        <Card className="col-span-1 border-border/40">
          <CardHeader className="pb-2">
            <CardTitle>Health Summary</CardTitle>
            <CardDescription>Your latest health metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Heart Rate</span>
                <span className="text-sm font-medium">{healthSummary.vitalSigns.heartRate.value} bpm</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${(healthSummary.vitalSigns.heartRate.value / 200) * 100}%` }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Blood Pressure</span>
                <span className="text-sm font-medium">{healthSummary.vitalSigns.bloodPressure.value} mmHg</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "60%" }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Blood Glucose</span>
                <span className="text-sm font-medium">{healthSummary.vitalSigns.bloodGlucose.value} mg/dL</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "48%" }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Body Temperature</span>
                <span className="text-sm font-medium">{healthSummary.vitalSigns.temperature.value}°F</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: "37%" }}></div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Full Health Report</Button>
          </CardFooter>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-2 border-border/40">
          <CardHeader className="pb-2">
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your latest health updates and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getColorClass(activity.color, "text")} bg-${activity.color}-100 dark:bg-${activity.color}-900/30 flex-shrink-0`}>
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                    <FaArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Activities</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Quick Access */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">All Health Modules</h2>
          <div>
            <Button variant="outline" size="sm" className={activeCategory === "all" ? "bg-muted" : ""} onClick={() => setActiveCategory("all")}>
              All
            </Button>
            <Button variant="outline" size="sm" className={activeCategory === "tracking" ? "bg-muted" : ""} onClick={() => setActiveCategory("tracking")}>
              Tracking
            </Button>
            <Button variant="outline" size="sm" className={activeCategory === "analysis" ? "bg-muted" : ""} onClick={() => setActiveCategory("analysis")}>
              Analysis
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredModules.map((module) => (
            <Link to={module.path} key={module.id}>
              <div className="flex items-center gap-4 p-4 border border-border/40 rounded-lg hover:border-border hover:shadow-sm transition-all group">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getColorClass(module.color, "text")} bg-${module.color}-100 dark:bg-${module.color}-900/30`}>
                  <module.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium group-hover:text-primary transition-colors">{module.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{module.description}</p>
                </div>
                <FaArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default HealthHub; 