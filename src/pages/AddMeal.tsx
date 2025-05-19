import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PageTitle from "@/components/layout/PageTitle";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Camera, Clock, Search, Utensils, Apple, Check, Info, ChevronRight, SaveAll, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

// Array of common meals for quick selection
const commonMeals = [
  { id: 1, name: "Greek Yogurt with Berries", calories: 230, protein: 15, carbs: 25, fat: 8, type: "Breakfast" },
  { id: 2, name: "Grilled Chicken Salad", calories: 350, protein: 30, carbs: 15, fat: 18, type: "Lunch" },
  { id: 3, name: "Protein Smoothie", calories: 280, protein: 20, carbs: 35, fat: 5, type: "Snack" },
  { id: 4, name: "Salmon with Roasted Vegetables", calories: 420, protein: 32, carbs: 25, fat: 22, type: "Dinner" },
  { id: 5, name: "Avocado Toast", calories: 310, protein: 10, carbs: 30, fat: 16, type: "Breakfast" },
  { id: 6, name: "Quinoa Bowl with Vegetables", calories: 380, protein: 12, carbs: 60, fat: 10, type: "Lunch" },
];

// Types for meal and related data
interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: Date;
  time: string;
  type: string;
  description: string;
  servingSize: string;
}

const AddMeal = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("manual");
  const [date, setDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Form state
  const [meal, setMeal] = useState<Meal>({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    date: new Date(),
    time: format(new Date(), "HH:mm"),
    type: "Breakfast",
    description: "",
    servingSize: "1 serving"
  });

  const handleInputChange = (field: keyof Meal, value: any) => {
    setMeal(prev => ({ ...prev, [field]: value }));
  };

  const handleSearchMeal = () => {
    if (searchTerm.trim() === "") return;
    
    setIsSearching(true);
    
    // Simulate API search
    setTimeout(() => {
      // Filter common meals based on search term
      const results = commonMeals.filter(meal => 
        meal.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleSelectMeal = (selectedMeal: any) => {
    setMeal({
      ...meal,
      name: selectedMeal.name,
      calories: selectedMeal.calories,
      protein: selectedMeal.protein,
      carbs: selectedMeal.carbs,
      fat: selectedMeal.fat,
      type: selectedMeal.type || meal.type
    });
    
    setActiveTab("manual");
    toast({
      title: "Meal selected",
      description: `${selectedMeal.name} has been added to the form.`,
    });
  };

  const handleOpenScanner = () => {
    navigate("/food-scanner");
  };

  const handleSaveMeal = () => {
    // Validate required fields
    if (!meal.name) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter a meal name.",
      });
      return;
    }

    // In a real app, save to API
    // For now, just show success message and navigate back
    toast({
      title: "Meal logged successfully",
      description: `${meal.name} has been added to your meal log.`,
    });
    
    // Here we would update the local state or send to an API
    navigate("/meal");
  };

  // Calculate total calories from macronutrients
  const calculateTotalCalories = () => {
    return meal.protein * 4 + meal.carbs * 4 + meal.fat * 9;
  };

  return (
    <div className="space-y-8">
      {/* Modern Header Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-health-primary/90 via-health-secondary/70 to-health-accent/80 text-white">
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
                <Utensils className="h-8 w-8 text-white" />
              </div>
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-white"
                >
                  Add New Meal
                </motion.h1>
                <p className="text-white/80">
                  Record your nutrition to track your health goals
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleOpenScanner}
              className="bg-white/10 hover:bg-white/20 text-white border-0 shadow-md"
            >
              <Camera className="h-4 w-4 mr-2" />
              Scan Food
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-3 h-12">
            <TabsTrigger value="manual" className="text-base">
              <Info className="h-4 w-4 mr-2" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="search" className="text-base">
              <Search className="h-4 w-4 mr-2" />
              Search Food
            </TabsTrigger>
            <TabsTrigger value="recent" className="text-base">
              <Clock className="h-4 w-4 mr-2" />
              Recent Meals
            </TabsTrigger>
        </TabsList>
        </div>
        
        {/* Manual Entry Tab */}
        <TabsContent value="manual">
          <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardHeader className="border-b bg-muted/20 py-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>Meal Details</span>
                </CardTitle>
                <Badge variant="outline" className="bg-muted/30 px-2.5 py-1">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                  {format(date, "MMMM d, yyyy")}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-medium">Meal Name</Label>
                    <Input 
                      id="name" 
                      value={meal.name} 
                      onChange={(e) => handleInputChange("name", e.target.value)} 
                      placeholder="e.g., Greek Yogurt with Berries"
                      className="border-border/50 focus-visible:ring-health-primary/30"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
                    <Textarea 
                      id="description" 
                      value={meal.description} 
                      onChange={(e) => handleInputChange("description", e.target.value)} 
                      placeholder="Additional details about your meal..."
                      className="resize-none border-border/50 focus-visible:ring-health-primary/30 min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal border-border/50"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            {format(date, "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(date) => date && setDate(date)}
                            initialFocus
                            className="rounded-md border"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="time" className="text-sm font-medium">Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="time" 
                          type="time" 
                          value={meal.time} 
                          onChange={(e) => handleInputChange("time", e.target.value)} 
                          className="pl-10 border-border/50 focus-visible:ring-health-primary/30"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="type" className="text-sm font-medium">Meal Type</Label>
                    <Select 
                      defaultValue={meal.type} 
                      onValueChange={(value) => handleInputChange("type", value)}
                    >
                      <SelectTrigger className="border-border/50 focus-visible:ring-health-primary/30">
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Breakfast">Breakfast</SelectItem>
                        <SelectItem value="Lunch">Lunch</SelectItem>
                        <SelectItem value="Dinner">Dinner</SelectItem>
                        <SelectItem value="Snack">Snack</SelectItem>
                        <SelectItem value="Pre-Workout">Pre-Workout</SelectItem>
                        <SelectItem value="Post-Workout">Post-Workout</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="servingSize" className="text-sm font-medium">Serving Size</Label>
                    <Input 
                      id="servingSize" 
                      value={meal.servingSize} 
                      onChange={(e) => handleInputChange("servingSize", e.target.value)} 
                      placeholder="e.g., 1 cup, 100g"
                      className="border-border/50 focus-visible:ring-health-primary/30"
                    />
                  </div>
                </div>
                
                {/* Right column - Nutrition */}
                <div className="space-y-5">
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                      <Apple className="h-4 w-4 text-health-primary" />
                      Nutrition Information
                    </h3>
                    
                    <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                          <Label className="text-sm">Calories</Label>
                          <span className="text-sm font-medium">{meal.calories} kcal</span>
                      </div>
                      <Slider
                          value={[meal.calories]}
                        min={0}
                          max={2000}
                          step={10}
                          onValueChange={(values) => handleInputChange("calories", values[0])}
                          className="[&>span]:bg-health-primary"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                          <Label className="text-sm">Protein</Label>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium">{meal.protein}g</span>
                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200">
                              {meal.protein ? Math.round((meal.protein * 4 / calculateTotalCalories()) * 100) : 0}%
                            </Badge>
                          </div>
                      </div>
                      <Slider
                          value={[meal.protein]}
                        min={0}
                          max={200}
                        step={1}
                          onValueChange={(values) => handleInputChange("protein", values[0])}
                          className="[&>span]:bg-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                          <Label className="text-sm">Carbs</Label>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium">{meal.carbs}g</span>
                            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200">
                              {meal.carbs ? Math.round((meal.carbs * 4 / calculateTotalCalories()) * 100) : 0}%
                            </Badge>
                          </div>
                      </div>
                      <Slider
                          value={[meal.carbs]}
                        min={0}
                          max={300}
                        step={1}
                          onValueChange={(values) => handleInputChange("carbs", values[0])}
                          className="[&>span]:bg-amber-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                          <Label className="text-sm">Fat</Label>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium">{meal.fat}g</span>
                            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200">
                              {meal.fat ? Math.round((meal.fat * 9 / calculateTotalCalories()) * 100) : 0}%
                            </Badge>
                          </div>
                      </div>
                      <Slider
                          value={[meal.fat]}
                        min={0}
                        max={100}
                        step={1}
                          onValueChange={(values) => handleInputChange("fat", values[0])}
                          className="[&>span]:bg-red-500"
                      />
                    </div>
                  </div>
                  
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Macronutrient Breakdown</span>
                        <span className="text-xs text-muted-foreground">
                          {calculateTotalCalories()} total calories
                        </span>
                      </div>
                      
                      <div className="h-2 w-full rounded-full overflow-hidden flex">
                        <div 
                          className="bg-blue-500 h-full" 
                          style={{ width: `${meal.protein ? (meal.protein * 4 / calculateTotalCalories()) * 100 : 0}%` }}
                        ></div>
                        <div 
                          className="bg-amber-500 h-full" 
                          style={{ width: `${meal.carbs ? (meal.carbs * 4 / calculateTotalCalories()) * 100 : 0}%` }}
                        ></div>
                        <div 
                          className="bg-red-500 h-full" 
                          style={{ width: `${meal.fat ? (meal.fat * 9 / calculateTotalCalories()) * 100 : 0}%` }}
                        ></div>
                    </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          Protein
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                          Carbs
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                          Fat
                        </span>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="border-t bg-muted/20 py-4 px-6 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate("/meal")}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveMeal}
                className="bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90"
                disabled={!meal.name}
              >
                <SaveAll className="h-4 w-4 mr-2" />
                Save Meal
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Search Food Tab */}
        <TabsContent value="search">
          <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardHeader className="border-b bg-muted/20 py-4">
              <CardTitle className="text-lg">Search Food Database</CardTitle>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search for foods..." 
                    className="pl-10 border-border/50 focus-visible:ring-health-primary/30"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchMeal();
                      }
                    }}
                  />
                </div>
                <Button 
                  onClick={handleSearchMeal}
                  className="bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90"
                  disabled={isSearching || searchTerm.trim() === ""}
                >
                  {isSearching ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Search className="h-4 w-4 mr-2" />
                      </motion.div>
                      Searching...
                    </>
                  ) : (
                    <>Search</>
                  )}
                </Button>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Search Results</h3>
                
                {searchResults.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-border/50 rounded-lg bg-muted/20">
                    {searchTerm ? (
                      isSearching ? (
                        <motion.div 
                          className="flex flex-col items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="h-10 w-10 border-2 border-health-primary/30 border-t-health-primary rounded-full mb-3"
                          />
                          <p className="text-muted-foreground">Searching for foods...</p>
                        </motion.div>
                      ) : (
                        <div className="text-muted-foreground">
                          <p>No results found for "{searchTerm}"</p>
                          <p className="text-sm mt-1">Try a different search term or add manually</p>
                        </div>
                      )
                    ) : (
                      <div className="text-muted-foreground">
                        <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Enter a food name to search</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {searchResults.map((foodItem, index) => (
                        <motion.div
                          key={foodItem.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <Card className="overflow-hidden border-border/50 hover:border-health-primary/30 transition-all hover:shadow-md">
                      <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{foodItem.name}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {foodItem.calories} cal | Protein: {foodItem.protein}g | Carbs: {foodItem.carbs}g | Fat: {foodItem.fat}g
                                  </p>
                        </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleSelectMeal(foodItem)}
                                  className="h-8 text-health-primary"
                                >
                                  Select
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                        </div>
                      </CardContent>
                    </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Recent Meals Tab */}
        <TabsContent value="recent">
          <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardHeader className="border-b bg-muted/20 py-4">
              <CardTitle className="text-lg">Recently Added Meals</CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                {commonMeals.slice(0, 5).map((recentMeal, index) => (
                  <motion.div
                    key={recentMeal.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group"
                  >
                    <Card className="overflow-hidden border-border/50 hover:border-health-primary/30 transition-all hover:shadow-md">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={`
                                  ${recentMeal.type === "Breakfast" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200" : ""}
                                  ${recentMeal.type === "Lunch" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200" : ""}
                                  ${recentMeal.type === "Dinner" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200" : ""}
                                  ${recentMeal.type === "Snack" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200" : ""}
                                `}
                              >
                                {recentMeal.type}
                              </Badge>
                              <h3 className="font-medium">{recentMeal.name}</h3>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-2 mt-2">
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground">Calories</p>
                                <p className="text-sm font-medium">{recentMeal.calories}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground">Protein</p>
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{recentMeal.protein}g</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground">Carbs</p>
                                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">{recentMeal.carbs}g</p>
                      </div>
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground">Fat</p>
                                <p className="text-sm font-medium text-red-600 dark:text-red-400">{recentMeal.fat}g</p>
                        </div>
                        </div>
                        </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleSelectMeal(recentMeal)}
                            className="h-8 text-health-primary opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Use
                          </Button>
                      </div>
                    </CardContent>
                  </Card>
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

export default AddMeal; 