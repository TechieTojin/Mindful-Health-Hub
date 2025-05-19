import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PageTitle from "@/components/layout/PageTitle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, Plus, Edit, Trash2, Filter, Star, Calendar, Database, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// Mock data for custom meals
interface CustomMeal {
  id: number;
  name: string;
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  lastUsed: string; // ISO date string
  timesUsed: number;
}

const initialMeals: CustomMeal[] = [
  {
    id: 1,
    name: "Greek Yogurt with Berries",
    type: "Breakfast",
    calories: 230,
    protein: 15,
    carbs: 25,
    fat: 8,
    lastUsed: "2023-06-10",
    timesUsed: 12
  },
  {
    id: 2,
    name: "Grilled Chicken Salad",
    type: "Lunch",
    calories: 350,
    protein: 30,
    carbs: 15,
    fat: 18,
    lastUsed: "2023-06-11",
    timesUsed: 8
  },
  {
    id: 3,
    name: "Protein Smoothie",
    type: "Snack",
    calories: 280,
    protein: 20,
    carbs: 35,
    fat: 5,
    lastUsed: "2023-06-09",
    timesUsed: 15
  },
  {
    id: 4,
    name: "Salmon with Roasted Vegetables",
    type: "Dinner",
    calories: 420,
    protein: 32,
    carbs: 25,
    fat: 22,
    lastUsed: "2023-06-08",
    timesUsed: 6
  }
];

const MealDatabase = () => {
  const navigate = useNavigate();
  const [meals, setMeals] = useState<CustomMeal[]>(initialMeals);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [editingMeal, setEditingMeal] = useState<CustomMeal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter meals based on search query and meal type
  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType ? meal.type === filterType : true;
    return matchesSearch && matchesType;
  });

  // Handle creating or updating a meal
  const handleSaveMeal = (meal: CustomMeal) => {
    if (editingMeal) {
      // Update existing meal
      setMeals(prev => prev.map(m => m.id === meal.id ? meal : m));
      toast({
        title: "Meal updated",
        description: `"${meal.name}" has been updated in your meal database.`,
      });
    } else {
      // Create new meal
      const newMeal = {
        ...meal,
        id: meals.length > 0 ? Math.max(...meals.map(m => m.id)) + 1 : 1,
        lastUsed: new Date().toISOString().split('T')[0],
        timesUsed: 0
      };
      setMeals(prev => [...prev, newMeal]);
      toast({
        title: "Meal created",
        description: `"${meal.name}" has been added to your meal database.`,
      });
    }
    setIsDialogOpen(false);
    setEditingMeal(null);
  };

  // Handle deleting a meal
  const handleDeleteMeal = (id: number) => {
    const mealToDelete = meals.find(m => m.id === id);
    if (mealToDelete) {
      setMeals(prev => prev.filter(m => m.id !== id));
      toast({
        title: "Meal deleted",
        description: `"${mealToDelete.name}" has been removed from your meal database.`,
      });
    }
  };

  // Handle editing a meal
  const handleEditMeal = (meal: CustomMeal) => {
    setEditingMeal(meal);
    setIsDialogOpen(true);
  };

  // Handle creating a new meal
  const handleNewMeal = () => {
    setEditingMeal(null);
    setIsDialogOpen(true);
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
                <Database className="h-8 w-8 text-white" />
              </div>
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-white"
                >
                  Meal Database
                </motion.h1>
                <p className="text-white/80">
                  Manage your custom meals for easy logging and planning
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleNewMeal}
              className="bg-white/10 hover:bg-white/20 text-white border-0 shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Meal
            </Button>
          </div>
        </div>
      </div>
      
      {/* Search and Filters */}
      <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input 
                type="search" 
                placeholder="Search meals by name..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[180px] justify-between">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                  <span>{filterType || "All Types"}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuItem 
                  onClick={() => setFilterType(null)}
                  className={!filterType ? "bg-muted/50" : ""}
                >
                  <CheckCircle className={`h-4 w-4 mr-2 ${!filterType ? "opacity-100" : "opacity-0"}`} />
                  All Types
                </DropdownMenuItem>
                
                {["Breakfast", "Lunch", "Dinner", "Snack"].map(type => (
                  <DropdownMenuItem 
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={filterType === type ? "bg-muted/50" : ""}
                  >
                    <CheckCircle className={`h-4 w-4 mr-2 ${filterType === type ? "opacity-100" : "opacity-0"}`} />
                    {type}
                </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="border-0 bg-white/50 dark:bg-gray-800/50 shadow-sm">
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Meals</p>
                  <p className="text-2xl font-bold">{meals.length}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/50 dark:bg-gray-800/50 shadow-sm">
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                  <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Most Used</p>
                  <p className="text-2xl font-bold">
                    {meals.length > 0 ? Math.max(...meals.map(m => m.timesUsed)) : 0}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/50 dark:bg-gray-800/50 shadow-sm">
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Added</p>
                  <p className="text-md font-medium">
                    {meals.length > 0 
                      ? new Date(Math.max(...meals.map(m => new Date(m.lastUsed).getTime()))).toLocaleDateString() 
                      : "None"}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/50 dark:bg-gray-800/50 shadow-sm">
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <Filter className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Filter</p>
                  <p className="text-md font-medium">{filterType || "All Types"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      {/* Meals Table */}
      <Card className="border-0 shadow-lg overflow-hidden bg-white dark:bg-gray-900">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-4 px-6 border-b">
          <CardTitle className="text-lg">Your Custom Meals</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Calories</TableHead>
                  <TableHead className="text-right">Protein</TableHead>
                  <TableHead className="text-right">Carbs</TableHead>
                  <TableHead className="text-right">Fat</TableHead>
                  <TableHead className="text-right">Usage</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <XCircle className="h-8 w-8 text-muted-foreground" />
                        <p>
                      {searchQuery || filterType
                        ? "No meals match your search criteria."
                        : "No custom meals created yet. Create your first meal!"}
                        </p>
                        {!searchQuery && !filterType && (
                          <Button 
                            onClick={handleNewMeal}
                            className="mt-2 bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Meal
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <AnimatePresence>
                    {filteredMeals.map((meal, index) => (
                      <motion.tr
                        key={meal.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        className="group hover:bg-muted/20 transition-colors cursor-default"
                      >
                      <TableCell className="font-medium">{meal.name}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`
                              ${meal.type === "Breakfast" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200" : ""}
                              ${meal.type === "Lunch" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200" : ""}
                              ${meal.type === "Dinner" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200" : ""}
                              ${meal.type === "Snack" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200" : ""}
                            `}
                          >
                            {meal.type}
                          </Badge>
                        </TableCell>
                      <TableCell className="text-right">{meal.calories}</TableCell>
                        <TableCell className="text-right font-medium text-blue-600 dark:text-blue-400">{meal.protein}g</TableCell>
                        <TableCell className="text-right font-medium text-amber-600 dark:text-amber-400">{meal.carbs}g</TableCell>
                        <TableCell className="text-right font-medium text-red-600 dark:text-red-400">{meal.fat}g</TableCell>
                        <TableCell className="text-right">
                          <span className="flex items-center justify-end gap-1">
                            <Star className={`h-3.5 w-3.5 ${meal.timesUsed > 5 ? "text-yellow-500" : "text-muted-foreground"}`} />
                            {meal.timesUsed}
                          </span>
                        </TableCell>
                        <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button 
                            variant="ghost" 
                              size="sm" 
                            onClick={() => handleEditMeal(meal)}
                              className="h-8 w-8 p-0 rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                          </Button>
                            
                          <Button 
                            variant="ghost" 
                              size="sm" 
                            onClick={() => handleDeleteMeal(meal.id)}
                              className="h-8 w-8 p-0 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center py-4 bg-muted/10">
          <p className="text-sm text-muted-foreground">
            Showing {filteredMeals.length} of {meals.length} meals
          </p>
          <Button 
            onClick={handleNewMeal}
            className="bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Meal
          </Button>
        </CardFooter>
      </Card>
      
      {/* Edit or Create Meal Dialog */}
      {isDialogOpen && (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm border-0 shadow-lg max-w-md">
          <DialogHeader>
              <DialogTitle>
                {editingMeal ? "Edit Meal" : "Create New Meal"}
              </DialogTitle>
            <DialogDescription>
              {editingMeal 
                  ? "Update the details of your existing meal." 
                  : "Enter the details for your new custom meal."}
            </DialogDescription>
          </DialogHeader>
            
          <MealForm 
            initialMeal={editingMeal || {
              id: 0,
              name: "",
              type: "Breakfast",
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
                lastUsed: new Date().toISOString().split('T')[0],
              timesUsed: 0
            }} 
            onSave={handleSaveMeal}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      )}
    </div>
  );
};

// Meal Form component for creating/editing meals
interface MealFormProps {
  initialMeal: CustomMeal;
  onSave: (meal: CustomMeal) => void;
  onCancel: () => void;
}

const MealForm = ({ initialMeal, onSave, onCancel }: MealFormProps) => {
  const [meal, setMeal] = useState<CustomMeal>(initialMeal);

  const handleChange = (field: keyof CustomMeal, value: any) => {
    setMeal(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!meal.name.trim()) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please enter a name for your meal.",
      });
      return;
    }
    
    onSave(meal);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Meal Name</Label>
          <Input 
            id="name" 
            value={meal.name} 
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g., Greek Yogurt with Berries"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Meal Type</Label>
          <RadioGroup 
            value={meal.type}
            onValueChange={(value) => handleChange("type", value)}
            className="flex flex-wrap gap-2"
          >
            {["Breakfast", "Lunch", "Dinner", "Snack"].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <RadioGroupItem value={type} id={`type-${type}`} />
                <Label htmlFor={`type-${type}`}>{type}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="calories">Calories</Label>
            <Input 
              id="calories" 
              type="number" 
              min={0}
              value={meal.calories}
              onChange={(e) => handleChange("calories", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="protein">Protein (g)</Label>
            <Input 
              id="protein" 
              type="number" 
              min={0}
              value={meal.protein}
              onChange={(e) => handleChange("protein", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="carbs">Carbs (g)</Label>
            <Input 
              id="carbs" 
              type="number" 
              min={0}
              value={meal.carbs}
              onChange={(e) => handleChange("carbs", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fat">Fat (g)</Label>
            <Input 
              id="fat" 
              type="number" 
              min={0}
              value={meal.fat}
              onChange={(e) => handleChange("fat", parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialMeal.id ? "Update Meal" : "Create Meal"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default MealDatabase; 