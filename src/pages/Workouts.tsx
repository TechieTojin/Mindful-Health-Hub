import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Dumbbell, Flame, Play, Plus, Search, Filter, Star, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

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
  show: { y: 0, opacity: 1 }
};

const workouts = [
  {
    id: 1,
    title: "Full Body HIIT",
    description: "High-intensity interval training to boost metabolism and burn fat",
    duration: 30,
    calories: 350,
    level: "Intermediate",
    category: "strength",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    title: "Morning Yoga Flow",
    description: "Gentle yoga sequence to improve flexibility and start your day right",
    duration: 20,
    calories: 150,
    level: "Beginner",
    category: "flexibility",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    title: "Strength Training",
    description: "Build muscle and increase strength with this resistance workout",
    duration: 45,
    calories: 400,
    level: "Advanced",
    category: "strength",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 4,
    title: "Cardio Kickboxing",
    description: "High-energy kickboxing workout to improve cardiovascular health",
    duration: 35,
    calories: 450,
    level: "Intermediate",
    category: "cardio",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 5,
    title: "Core Sculpt",
    description: "Focus on strengthening your core with targeted exercises",
    duration: 25,
    calories: 280,
    level: "Beginner",
    category: "strength",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 6,
    title: "HIIT Cardio Blast",
    description: "Maximize calorie burn with this intense cardio session",
    duration: 30,
    calories: 380,
    level: "Advanced",
    category: "cardio",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 7,
    title: "Gentle Stretching",
    description: "Improve flexibility and reduce muscle tension with guided stretching",
    duration: 25,
    calories: 120,
    level: "Beginner",
    category: "flexibility",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 8,
    title: "Power Pilates",
    description: "Strengthen your core and improve posture with dynamic Pilates",
    duration: 40,
    calories: 250,
    level: "Intermediate",
    category: "flexibility",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

const WorkoutCard = ({ workout }: { workout: typeof workouts[0] }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={workout.image} 
          alt={workout.title} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" 
        />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Badge className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm text-foreground border border-border/50">
          {workout.level}
        </Badge>
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-yellow-500/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium">
            <Star className="h-3.5 w-3.5 fill-current" /> {workout.rating}
          </div>
      </div>
      <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">{workout.title}</CardTitle>
          <CardDescription className="line-clamp-2">{workout.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1 text-sm bg-muted rounded-full px-2.5 py-1">
              <Clock className="h-4 w-4 text-health-primary" />
            <span>{workout.duration} min</span>
          </div>
            <div className="flex items-center gap-1 text-sm bg-muted rounded-full px-2.5 py-1">
              <Flame className="h-4 w-4 text-health-primary" />
            <span>{workout.calories} cal</span>
          </div>
            <div className="flex items-center gap-1 text-sm bg-muted rounded-full px-2.5 py-1">
              <Dumbbell className="h-4 w-4 text-health-primary" />
              <span className="capitalize">{workout.category}</span>
          </div>
        </div>
      </CardContent>
        <CardFooter className="pt-0">
          <Button variant="default" className="w-full gap-2 rounded-full bg-gradient-to-r from-health-primary to-health-accent hover:from-health-primary/90 hover:to-health-accent/90 transition-all">
          <Play className="h-4 w-4" /> Start Workout
        </Button>
      </CardFooter>
    </Card>
    </motion.div>
  );
};

const Workouts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterDuration, setFilterDuration] = useState("all");
  
  const filteredWorkouts = workouts.filter(workout => {
    // Filter by search term
    const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workout.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by level
    const matchesLevel = filterLevel === "all" || workout.level.toLowerCase() === filterLevel.toLowerCase();
    
    // Filter by duration
    let matchesDuration = true;
    if (filterDuration === "short") {
      matchesDuration = workout.duration <= 25;
    } else if (filterDuration === "medium") {
      matchesDuration = workout.duration > 25 && workout.duration <= 40;
    } else if (filterDuration === "long") {
      matchesDuration = workout.duration > 40;
    }
    
    return matchesSearch && matchesLevel && matchesDuration;
  });

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-health-primary/10 text-health-primary text-sm font-medium mb-2">
            <Dumbbell className="h-4 w-4 mr-1" /> Fitness Collection
          </div>
        <h1 className="text-3xl font-bold tracking-tight">Workout Library</h1>
          <p className="text-muted-foreground">Discover exercises tailored to your fitness goals</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" className="gap-2">
            <a href="/workouts/saved">
              <Star className="h-4 w-4" /> Saved Workouts
            </a>
          </Button>
          <Button className="gap-2 rounded-full bg-gradient-to-r from-health-primary to-health-accent hover:from-health-primary/90 hover:to-health-accent/90 transition-all">
          <Plus className="h-4 w-4" /> Create Workout
        </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search workouts..." 
            className="pl-9 border-border" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <div className="w-[140px]">
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="border-border">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">
                    {filterLevel === "all" ? "All Levels" : filterLevel}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-[150px]">
            <Select value={filterDuration} onValueChange={setFilterDuration}>
              <SelectTrigger className="border-border">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">
                    {filterDuration === "all" ? "Any Duration" : 
                     filterDuration === "short" ? "&lt; 25 min" : 
                     filterDuration === "medium" ? "25-40 min" : "&gt; 40 min"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Duration</SelectItem>
                <SelectItem value="short">Short (&lt; 25 min)</SelectItem>
                <SelectItem value="medium">Medium (25-40 min)</SelectItem>
                <SelectItem value="long">Long (&gt; 40 min)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-4 mb-6 bg-card border-border">
          <TabsTrigger value="all">All Workouts</TabsTrigger>
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="cardio">Cardio</TabsTrigger>
          <TabsTrigger value="flexibility">Flexibility</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-8">
          {filteredWorkouts.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {filteredWorkouts.map(workout => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No matching workouts found</h3>
              <p className="text-muted-foreground max-w-md">
                Try adjusting your search or filters to find more workout options.
              </p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => {
                  setSearchTerm("");
                  setFilterLevel("all");
                  setFilterDuration("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {filteredWorkouts.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline" className="rounded-full">
                <span>Load More Workouts</span>
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
          </div>
          )}
        </TabsContent>
        
        <TabsContent value="strength" className="space-y-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {filteredWorkouts
              .filter(workout => workout.category === "strength")
              .map(workout => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="cardio" className="space-y-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {filteredWorkouts
              .filter(workout => workout.category === "cardio")
              .map(workout => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="flexibility" className="space-y-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {filteredWorkouts
              .filter(workout => workout.category === "flexibility")
              .map(workout => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Workouts;
