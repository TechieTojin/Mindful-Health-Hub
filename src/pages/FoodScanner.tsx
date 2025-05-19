import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Camera, Image as ImageIcon, Utensils, X, Check, AlertCircle, RefreshCw, Save, ChevronRight, Zap } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import PageTitle from '@/components/layout/PageTitle';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Types
interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface FoodDetection {
  name: string;
  confidence: number;
  nutrition: NutritionInfo;
}

interface MealSuggestion {
  title: string;
  description: string;
  nutritionInfo: NutritionInfo;
  healthScore: number;
}

// Mock Groq API call for food detection (in a real app, this would call Groq Vision API)
const mockDetectFood = async (imageData: string): Promise<FoodDetection> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Mock detection result
      resolve({
        name: "Grilled Chicken with Brown Rice and Vegetables",
        confidence: 0.89,
        nutrition: {
          calories: 420,
          protein: 35,
          carbs: 45,
          fat: 12,
          fiber: 6
        }
      });
    }, 1500);
  });
};

// Mock Groq API call for meal suggestions (in a real app, this would call Groq LLM API)
const mockGetMealSuggestions = async (foodData: FoodDetection): Promise<MealSuggestion[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Mock suggestions based on detected food
      resolve([
        {
          title: "Quinoa Bowl with Grilled Chicken",
          description: "Replace brown rice with protein-rich quinoa for more nutrients and a lower glycemic index. Add more leafy greens for additional fiber.",
          nutritionInfo: {
            calories: 390,
            protein: 38,
            carbs: 38,
            fat: 11,
            fiber: 8
          },
          healthScore: 92
        },
        {
          title: "Cauliflower Rice Chicken Bowl",
          description: "Lower-carb alternative using cauliflower rice instead of brown rice. Add avocado for healthy fats and more nutrient density.",
          nutritionInfo: {
            calories: 350,
            protein: 36,
            carbs: 18,
            fat: 16,
            fiber: 9
          },
          healthScore: 89
        },
        {
          title: "Mediterranean Chicken Plate",
          description: "Switch to a Mediterranean-style plate with hummus, tabbouleh, and olive oil dressing for heart-healthy benefits.",
          nutritionInfo: {
            calories: 430,
            protein: 34,
            carbs: 42,
            fat: 15,
            fiber: 7
          },
          healthScore: 88
        }
      ]);
    }, 2000);
  });
};

const FoodScanner = () => {
  const [activeTab, setActiveTab] = useState<string>("camera");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [detectedFood, setDetectedFood] = useState<FoodDetection | null>(null);
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);
  const [userGoal, setUserGoal] = useState<string>("balanced"); // balanced, low-carb, high-protein
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start camera when component mounts and tab is 'camera'
  useEffect(() => {
    if (activeTab === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  // Start webcam
  const startCamera = async () => {
    if (!videoRef.current) return;
    
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError("Unable to access camera. Please check permissions.");
      setIsCameraActive(false);
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  // Capture image from webcam
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
      stopCamera();
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCapturedImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Reset the scan state
  const resetScan = () => {
    setCapturedImage(null);
    setDetectedFood(null);
    setSuggestions([]);
    setIsAnalyzing(false);
    if (activeTab === "camera") {
      startCamera();
    }
  };

  // Analyze captured food image
  const analyzeFood = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    
    try {
      // In a real app, send image to Groq Vision API
      const detectionResult = await mockDetectFood(capturedImage);
      setDetectedFood(detectionResult);
      
      // Get meal suggestions based on detected food
      const suggestionsResult = await mockGetMealSuggestions(detectionResult);
      setSuggestions(suggestionsResult);
      
      toast({
        title: "Food Analyzed",
        description: `Detected: ${detectionResult.name}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error analyzing food:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the food image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Add meal to user's tracked meals
  const addToMyMeals = () => {
    if (!detectedFood) return;
    
    toast({
      title: "Meal Added",
      description: `${detectedFood.name} has been added to your meals.`,
      variant: "default",
    });
  };

  // Format nutrition value (add unit)
  const formatNutritionValue = (value: number, unit: string) => {
    return `${value}${unit}`;
  };

  // Calculate percentage for progress bars
  const calculatePercentage = (current: number, total: number) => {
    return Math.min(Math.round((current / total) * 100), 100);
  };
  
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-health-primary/90 via-health-secondary/70 to-health-accent/80 text-white mb-6">
        <div className="absolute inset-0 bg-[url('/images/pattern/dots.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-health-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-health-secondary/20 rounded-full blur-3xl"></div>
        
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-white"
                >
                  Food Scanner
                </motion.h1>
                <p className="text-white/80">
                  Scan your food for instant nutrition information
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
            <TabsTrigger value="camera" className="text-base" onClick={() => !isAnalyzing && setActiveTab("camera")}>
              <Camera className="mr-2 h-4 w-4" />
            Camera
          </TabsTrigger>
            <TabsTrigger value="gallery" className="text-base" onClick={() => !isAnalyzing && setActiveTab("gallery")}>
              <ImageIcon className="mr-2 h-4 w-4" />
              Upload Image
          </TabsTrigger>
        </TabsList>
                </div>

        <TabsContent value="camera" className="space-y-6">
          <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardContent className="p-0 aspect-video relative">
              {isCameraActive && !capturedImage ? (
                <div className="relative h-full w-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative"
                    >
                      <motion.div 
                        animate={{ 
                          opacity: [0.5, 0.2], 
                          scale: [1, 1.05] 
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        className="w-60 h-60 rounded-full border-4 border-dashed border-white/40 absolute -top-1/2 -left-1/2 transform translate-x-1/2 translate-y-1/2"
                      />
                    </motion.div>
                  </div>
                </div>
              ) : capturedImage ? (
                <div className="relative h-full w-full">
                  <img 
                    src={capturedImage} 
                    alt="Captured"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center p-8 h-full">
                  {cameraError ? (
                    <div className="text-center text-muted-foreground">
                      <AlertCircle className="mx-auto h-12 w-12 mb-2 text-red-500" />
                      <p className="mb-2 font-medium">{cameraError}</p>
                      <Button variant="outline" onClick={startCamera}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Camera className="mx-auto h-12 w-12 mb-2 text-health-primary" />
                      <p className="mb-2">Camera access required</p>
                      <Button variant="default" onClick={startCamera} className="bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90">
                        Start Camera
                      </Button>
                  </div>
                )}
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </CardContent>
            <CardFooter className="flex justify-center p-6 gap-4">
              {isCameraActive && !capturedImage ? (
                <Button
                  onClick={captureImage}
                  className="rounded-full h-14 w-14 p-0 bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </motion.div>
                </Button>
              ) : capturedImage ? (
                <div className="flex gap-4">
                  <Button variant="outline" onClick={resetScan} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                Retake
              </Button>
                  <Button onClick={analyzeFood} disabled={isAnalyzing} className="gap-2 bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90">
                {isAnalyzing ? (
                  <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </motion.div>
                    Analyzing...
                  </>
                ) : (
                  <>
                        <Utensils className="h-4 w-4" />
                        Analyze Food
                  </>
                )}
              </Button>
            </div>
              ) : null}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="gallery" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
            <CardContent className="p-6">
                {capturedImage ? (
                <div className="relative aspect-video mb-6">
                      <img 
                        src={capturedImage} 
                    alt="Uploaded"
                    className="h-full w-full object-cover rounded-lg border border-border/50"
                      />
                    </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center mb-6 aspect-video flex flex-col items-center justify-center">
                  <ImageIcon className="h-12 w-12 mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Upload an image of your food for analysis</p>
                  <Button onClick={triggerFileUpload} className="bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90">
                    Choose Image
                      </Button>
                  <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                </div>
              )}

              {capturedImage && (
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={resetScan} className="gap-2">
                    <X className="h-4 w-4" />
                    Clear
                    </Button>
                  <Button 
                    onClick={analyzeFood} 
                    disabled={isAnalyzing}
                    className="gap-2 bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90"
                  >
                    {isAnalyzing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </motion.div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Utensils className="h-4 w-4" />
                        Analyze Food
                  </>
                )}
                  </Button>
              </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Detection Results */}
      <AnimatePresence>
      {detectedFood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-health-primary/90 to-health-accent/90 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Food Detected
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">{detectedFood.name}</h3>
                
                <div className="bg-muted/30 p-4 rounded-lg mb-6">
                  <h4 className="font-medium mb-3">Nutrition Information</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center shadow-sm">
                      <p className="text-sm text-muted-foreground">Calories</p>
                      <p className="text-xl font-bold text-health-primary">{detectedFood.nutrition.calories}</p>
                      <p className="text-xs text-muted-foreground">kcal</p>
                        </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center shadow-sm">
                      <p className="text-sm text-muted-foreground">Protein</p>
                      <p className="text-xl font-bold text-blue-500">{detectedFood.nutrition.protein}g</p>
                      <div className="h-1 w-1/2 mx-auto mt-1 bg-blue-500 rounded-full"></div>
                      </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center shadow-sm">
                      <p className="text-sm text-muted-foreground">Carbs</p>
                      <p className="text-xl font-bold text-amber-500">{detectedFood.nutrition.carbs}g</p>
                      <div className="h-1 w-1/2 mx-auto mt-1 bg-amber-500 rounded-full"></div>
                        </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center shadow-sm">
                      <p className="text-sm text-muted-foreground">Fat</p>
                      <p className="text-xl font-bold text-red-500">{detectedFood.nutrition.fat}g</p>
                      <div className="h-1 w-1/2 mx-auto mt-1 bg-red-500 rounded-full"></div>
                    </div>
                    </div>
                  </div>
                  
                <div className="flex flex-wrap gap-4">
                  <Button 
                    onClick={addToMyMeals}
                    className="flex-1 gap-2 bg-gradient-to-r from-health-primary to-health-accent hover:opacity-90"
                  >
                    <Save className="h-4 w-4" />
                      Add to My Meals
                    </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Utensils className="h-4 w-4" />
                    View Similar Foods
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alternative Meal Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-health-secondary/90 to-health-primary/90 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Healthier Alternatives
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
            <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                    <motion.div
                    key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="bg-white dark:bg-gray-800 border border-border/50 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{suggestion.title}</h3>
                        <Badge variant="outline" className={`bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200`}>
                          {suggestion.healthScore}% Match
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Calories</p>
                          <p className="font-semibold">{suggestion.nutritionInfo.calories}</p>
                          <div className="h-1 w-1/2 mx-auto mt-1 bg-health-primary rounded-full"></div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Protein</p>
                          <p className="font-semibold">{suggestion.nutritionInfo.protein}g</p>
                          <div className="h-1 w-1/2 mx-auto mt-1 bg-blue-500 rounded-full"></div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Carbs</p>
                          <p className="font-semibold">{suggestion.nutritionInfo.carbs}g</p>
                          <div className="h-1 w-1/2 mx-auto mt-1 bg-amber-500 rounded-full"></div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Fat</p>
                          <p className="font-semibold">{suggestion.nutritionInfo.fat}g</p>
                          <div className="h-1 w-1/2 mx-auto mt-1 bg-red-500 rounded-full"></div>
                        </div>
                      </div>
                      <Button 
                        variant="link" 
                        className="text-health-primary p-0 h-auto gap-1 font-medium hover:text-health-accent hover:no-underline"
                      >
                        View Recipe
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                ))}
              </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        </AnimatePresence>
    </div>
  );
};

export default FoodScanner; 