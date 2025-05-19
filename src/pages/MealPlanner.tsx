import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageTitle from "@/components/layout/PageTitle";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  Utensils, 
  ArrowRight,
  Trash2,
  Calendar as CalendarIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, addDays, startOfWeek, getDay } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

// Mock data for meal plan
const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

interface PlannedMeal {
  id: number;
  name: string;
  mealType: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image?: string;
}

interface DayPlan {
  date: Date;
  meals: {
    [key in MealType]?: PlannedMeal;
  };
}

const MealPlanner = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedMealFromStorage, setSelectedMealFromStorage] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selectedMealType, setSelectedMealType] = useState<MealType>("Breakfast");
  
  // Initialize weekly plan
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>(
    Array.from({ length: 7 }, (_, i) => ({
      date: addDays(startOfCurrentWeek, i),
      meals: {}
    }))
  );

  // Check for selected meal from the meals page on component mount
  useEffect(() => {
    const storedMeal = localStorage.getItem('selectedMeal');
    if (storedMeal) {
      const parsedMeal = JSON.parse(storedMeal);
      setSelectedMealFromStorage(parsedMeal);
      
      // Open dialog to choose day and meal type
      setAddDialogOpen(true);
      
      // Clean up storage
      localStorage.removeItem('selectedMeal');
    }
  }, []);

  // Sample meal data
  const sampleMeals: PlannedMeal[] = [
    {
      id: 1,
      name: "Greek Yogurt with Berries",
      mealType: "Breakfast",
      calories: 230,
      protein: 15,
      carbs: 25,
      fat: 8,
      image: "https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=120&h=80&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Grilled Chicken Salad",
      mealType: "Lunch",
      calories: 350,
      protein: 30,
      carbs: 15,
      fat: 18,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&h=80&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Salmon with Vegetables",
      mealType: "Dinner",
      calories: 420,
      protein: 32,
      carbs: 25,
      fat: 22,
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=120&h=80&auto=format&fit=crop"
    }
  ];

  // Function to navigate to previous week
  const goToPreviousWeek = () => {
    const newDate = addDays(currentDate, -7);
    setCurrentDate(newDate);
    updateWeeklyPlan(newDate);
  };

  // Function to navigate to next week
  const goToNextWeek = () => {
    const newDate = addDays(currentDate, 7);
    setCurrentDate(newDate);
    updateWeeklyPlan(newDate);
  };

  // Update weekly plan when date changes
  const updateWeeklyPlan = (date: Date) => {
    const startOfNewWeek = startOfWeek(date, { weekStartsOn: 0 });
    setWeeklyPlan(
      Array.from({ length: 7 }, (_, i) => ({
        date: addDays(startOfNewWeek, i),
        meals: {}
      }))
    );
  };

  // Add meal to plan
  const addMealToPlan = (dayIndex: number, mealType: MealType) => {
    // If we have a meal from storage, use it
    if (selectedMealFromStorage && addDialogOpen) {
      setSelectedDay(dayIndex);
      setSelectedMealType(mealType);
      setAddDialogOpen(true);
      return;
    }
    
    // Otherwise use a random meal from sample meals
    const randomMeal = sampleMeals[Math.floor(Math.random() * sampleMeals.length)];
    randomMeal.mealType = mealType;

    const updatedPlan = [...weeklyPlan];
    updatedPlan[dayIndex].meals[mealType] = randomMeal;
    setWeeklyPlan(updatedPlan);

    toast({
      title: "Meal added to plan",
      description: `${randomMeal.name} added for ${mealType} on ${format(weeklyPlan[dayIndex].date, "EEEE")}`,
    });
  };

  // Add selected meal to plan
  const addSelectedMealToPlan = () => {
    if (!selectedMealFromStorage) return;
    
    // Convert the meal format
    const plannedMeal: PlannedMeal = {
      id: selectedMealFromStorage.id,
      name: selectedMealFromStorage.name,
      mealType: selectedMealType,
      calories: selectedMealFromStorage.calories,
      protein: selectedMealFromStorage.protein,
      carbs: selectedMealFromStorage.carbs,
      fat: selectedMealFromStorage.fat,
      image: selectedMealFromStorage.image
    };
    
    const updatedPlan = [...weeklyPlan];
    updatedPlan[selectedDay].meals[selectedMealType] = plannedMeal;
    setWeeklyPlan(updatedPlan);
    
    toast({
      title: "Meal added to plan",
      description: `${plannedMeal.name} added for ${selectedMealType} on ${format(weeklyPlan[selectedDay].date, "EEEE")}`,
    });
    
    // Close dialog
    setAddDialogOpen(false);
    setSelectedMealFromStorage(null);
  };

  // Remove meal from plan
  const removeMealFromPlan = (dayIndex: number, mealType: MealType) => {
    const updatedPlan = [...weeklyPlan];
    const mealName = updatedPlan[dayIndex].meals[mealType]?.name;
    
    if (mealName) {
      delete updatedPlan[dayIndex].meals[mealType];
      setWeeklyPlan(updatedPlan);
      
      toast({
        title: "Meal removed",
        description: `${mealName} removed from ${format(weeklyPlan[dayIndex].date, "EEEE")}'s ${mealType}`,
      });
    }
  };

  // Navigate to Add Meal page
  const navigateToAddMeal = () => {
    navigate("/add-meal");
  };

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
                <CalendarIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-white"
                >
                  Meal Planner
                </motion.h1>
                <p className="text-white/80">
                  Plan your meals for the week ahead
                </p>
              </div>
            </div>
            
            <Button onClick={navigateToAddMeal} className="bg-white/10 hover:bg-white/20 text-white border-0 font-medium">
              <Plus className="h-4 w-4 mr-2" />
              Add New Meal
            </Button>
          </div>
        </div>
      </div>
      
      {/* Week navigation */}
      <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToPreviousWeek}
              className="border-health-primary/20 text-health-primary hover:bg-health-primary/5"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous Week
            </Button>
            
            <div className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-health-primary/10 to-health-accent/10">
              <CalendarDays className="h-5 w-5 mr-2 text-health-primary" />
              <span className="font-medium">
                {format(weeklyPlan[0].date, "MMM d")} - {format(weeklyPlan[6].date, "MMM d, yyyy")}
              </span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToNextWeek}
              className="border-health-primary/20 text-health-primary hover:bg-health-primary/5"
            >
              Next Week
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Weekly plan */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {weeklyPlan.map((day, dayIndex) => {
          const isToday = getDay(day.date) === getDay(new Date()) && 
                         day.date.getDate() === new Date().getDate() &&
                         day.date.getMonth() === new Date().getMonth() &&
                         day.date.getFullYear() === new Date().getFullYear();
          
          return (
            <motion.div
              key={dayIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: dayIndex * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className={`h-full border-0 shadow-md overflow-hidden ${
                isToday ? "ring-2 ring-health-primary/50 shadow-health-primary/10" : ""
              }`}>
                <CardHeader className={`py-3 px-4 ${
                  isToday 
                  ? "bg-gradient-to-r from-health-primary/80 to-health-accent/80 text-white" 
                  : "bg-gradient-to-r from-gray-100 to-white dark:from-gray-800 dark:to-gray-900"
                }`}>
                  <CardTitle className="text-base flex justify-between items-center">
                    <span>{format(day.date, "EEE")}</span>
                    <Badge 
                      variant="outline" 
                      className={`${
                        isToday 
                        ? "bg-white/20 text-white border-white/40" 
                        : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      {format(day.date, "d")}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-3 space-y-3">
                  {["Breakfast", "Lunch", "Dinner", "Snack"].map((mealType) => {
                    const meal = day.meals[mealType as MealType];
                    
                    return (
                      <div 
                        key={mealType} 
                        className="rounded-lg border border-border/40 overflow-hidden"
                      >
                        <div className="bg-muted/20 py-1.5 px-3 text-xs font-medium border-b border-border/30 flex justify-between items-center">
                          <span>{mealType}</span>
                          {!meal && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => addMealToPlan(dayIndex, mealType as MealType)}
                              className="h-6 w-6 p-0 rounded-full"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        
                        {meal ? (
                          <div className="p-2">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{meal.name}</p>
                                <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                                  <span>{meal.calories} cal</span>
                                  <span>•</span>
                                  <span>P: {meal.protein}g</span>
                                  <span>•</span>
                                  <span>C: {meal.carbs}g</span>
                                </div>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMealFromPlan(dayIndex, mealType as MealType)}
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive ml-2 rounded-full"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="flex flex-col items-center justify-center p-3 hover:bg-muted/10 transition-colors cursor-pointer"
                            onClick={() => addMealToPlan(dayIndex, mealType as MealType)}
                          >
                            <div className="text-xs text-muted-foreground text-center">
                              Add {mealType.toLowerCase()}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      {/* Dialog for adding meal from storage */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
          <DialogHeader>
            <DialogTitle>Add to Meal Plan</DialogTitle>
            <DialogDescription>
              Choose when to add "{selectedMealFromStorage?.name}" to your plan
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Day</label>
              <Select 
                value={selectedDay.toString()} 
                onValueChange={(value) => setSelectedDay(parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {weeklyPlan.map((day, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {format(day.date, "EEEE, MMMM d")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Meal Type</label>
              <Select 
                value={selectedMealType} 
                onValueChange={(value) => setSelectedMealType(value as MealType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Breakfast">Breakfast</SelectItem>
                  <SelectItem value="Lunch">Lunch</SelectItem>
                  <SelectItem value="Dinner">Dinner</SelectItem>
                  <SelectItem value="Snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={addSelectedMealToPlan}
              className="bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90"
            >
              Add to Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MealPlanner; 