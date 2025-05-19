import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaArrowRight, FaArrowLeft, FaCheckCircle, FaNotesMedical, FaInfoCircle, 
  FaExclamationTriangle, FaPhone, FaSyncAlt, FaSearch, FaTimes, FaFilter, 
  FaCheck, FaUserMd, FaRegLightbulb, FaPlus, FaQuestionCircle
} from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import '../styles/healthPages.css';

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

// Mock data for symptoms
const SYMPTOMS = [
  { id: 1, name: "Headache", category: "Neurological" },
  { id: 2, name: "Fever", category: "General" },
  { id: 3, name: "Cough", category: "Respiratory" },
  { id: 4, name: "Fatigue", category: "General" },
  { id: 5, name: "Sore Throat", category: "ENT" },
  { id: 6, name: "Shortness of Breath", category: "Respiratory" },
  { id: 7, name: "Nausea", category: "Gastrointestinal" },
  { id: 8, name: "Dizziness", category: "Neurological" },
  { id: 9, name: "Chest Pain", category: "Cardiovascular" },
  { id: 10, name: "Runny Nose", category: "ENT" },
  { id: 11, name: "Muscle Aches", category: "Musculoskeletal" },
  { id: 12, name: "Joint Pain", category: "Musculoskeletal" },
  { id: 13, name: "Abdominal Pain", category: "Gastrointestinal" },
  { id: 14, name: "Diarrhea", category: "Gastrointestinal" },
  { id: 15, name: "Rash", category: "Dermatological" },
  { id: 16, name: "Vomiting", category: "Gastrointestinal" },
  { id: 17, name: "Chills", category: "General" },
  { id: 18, name: "Loss of Appetite", category: "General" },
  { id: 19, name: "Sneezing", category: "ENT" },
  { id: 20, name: "Swelling", category: "General" }
];

// Define steps for the wizard
const STEPS = [
  "Select Symptoms",
  "Additional Questions",
  "Results",
  "Recommendations"
];

const SymptomChecker = () => {
  // State variables
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>("");

  // Toggle symptom selection
  const toggleSymptom = (symptomId: number) => {
    if (selectedSymptoms.includes(symptomId)) {
      setSelectedSymptoms(selectedSymptoms.filter(id => id !== symptomId));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    }
  };

  // Progress bar animation during analysis
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 150);
    } else if (analysisProgress > 0) {
      setAnalysisProgress(100);
      setTimeout(() => setAnalysisProgress(0), 500);
    }
    
    return () => clearInterval(interval);
  }, [isLoading]);

  // Handle next button click
  const handleNext = () => {
    if (currentStep === 0 && selectedSymptoms.length === 0) {
      alert("Please select at least one symptom to continue.");
      return;
    }

    if (currentStep === 1) {
      setIsLoading(true);
      // Simulate API call to get conditions based on symptoms
      setTimeout(() => {
        setIsLoading(false);

        const matchedConditions = [
          {
            id: 1,
            name: "Common Cold",
            probability: 75,
            severity: "low",
            description: "The common cold is a viral infection of your nose and throat. It's usually harmless, although it might not feel that way. Many types of viruses can cause a common cold.",
            matchingSymptoms: [3, 5, 10, 19],
            nonMatchingSymptoms: [9, 13]
          },
          {
            id: 2,
            name: "Influenza",
            probability: 65,
            severity: "medium",
            description: "Influenza (flu) is a viral infection that attacks your respiratory system — your nose, throat and lungs. Influenza is commonly called the flu, but it's not the same as stomach 'flu' viruses that cause diarrhea and vomiting.",
            matchingSymptoms: [2, 3, 4, 17],
            nonMatchingSymptoms: [15, 20]
          },
          {
            id: 3,
            name: "COVID-19",
            probability: 40,
            severity: "high",
            description: "Coronavirus disease (COVID-19) is an infectious disease caused by the SARS-CoV-2 virus. Most people infected with the virus will experience mild to moderate respiratory illness and recover without requiring special treatment.",
            matchingSymptoms: [2, 3, 4, 6],
            nonMatchingSymptoms: [12, 15]
          }
        ];

        setResults(matchedConditions);
      }, 2000);
    }

    setCurrentStep(currentStep + 1);
  };

  // Handle previous button click
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedSymptoms([]);
    setSearchQuery("");
    setAge("");
    setGender("");
    setDuration("");
    setResults([]);
  };

  // Helper function to get symptom name by ID
  const getSymptomName = (id: number) => {
    const symptom = SYMPTOMS.find(s => s.id === id);
    return symptom ? symptom.name : "";
  };

  // Filter symptoms based on search query and category
  const filteredSymptoms = SYMPTOMS.filter(symptom => 
    (symptom.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     symptom.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterCategory === "" || symptom.category === filterCategory)
  );

  // Get unique categories for filtering
  const symptomCategories = [...new Set(SYMPTOMS.map(s => s.category))].sort();

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'medium': return 'text-amber-500 bg-amber-100 dark:bg-amber-900/30';
      case 'high': return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      default: return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
    }
  };

  return (
    <motion.div 
      className="container mx-auto py-8 px-4 max-w-6xl space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Header with Gradient */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-teal-500/20 to-cyan-500/20 dark:from-green-900/30 dark:via-teal-900/30 dark:to-cyan-900/30 backdrop-blur-sm"></div>
        <div className="relative p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium">
                <FaNotesMedical className="h-4 w-4 mr-2" /> AI-Powered Analysis
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Symptom Checker
          </h1>
              <p className="text-muted-foreground max-w-2xl">
                Analyze your symptoms and get AI-powered insights on potential conditions and next steps
              </p>
            </div>
            
          {currentStep > 0 && (
              <Button 
                variant="outline" 
                className="gap-2"
              onClick={handleRestart}
            >
                <FaArrowLeft className="h-4 w-4" /> Start Over
              </Button>
          )}
          </div>
        </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
        <Progress value={(currentStep / (STEPS.length - 1)) * 100} className="h-2" />
          <div className="flex justify-between mt-3">
            {STEPS.map((step, index) => (
            <motion.span 
                key={step} 
                className={`px-3 py-1 rounded-full text-xs ${
                  currentStep >= index 
                  ? "bg-primary/20 text-primary font-medium" 
                  : "text-muted-foreground"
                }`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              >
                {step}
            </motion.span>
            ))}
          </div>
        </div>

        {/* Content Area with enhanced styling */}
      <Card className="border-border shadow-sm">
        {/* Step 1: Select Symptoms */}
        {currentStep === 0 && (
          <>
            <CardHeader className="border-b">
              <CardTitle>Select Your Symptoms</CardTitle>
              <CardDescription>
              Select all symptoms you're experiencing. This helps us provide more accurate results.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                  <Input
                    className="pl-10"
                  placeholder="Search symptoms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
                
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="md:w-[200px]">
                    <div className="flex items-center gap-2">
                      <FaFilter className="h-4 w-4 text-muted-foreground" />
                      <span>{filterCategory || "All Categories"}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {symptomCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedSymptoms.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Selected Symptoms ({selectedSymptoms.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map(id => (
                      <Badge key={id} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                        {getSymptomName(id)}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-5 w-5 p-0 rounded-full hover:bg-muted"
                          onClick={() => toggleSymptom(id)}
                        >
                          <FaTimes className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => setSelectedSymptoms([])}
                    >
                      <FaTimes className="h-3 w-3" /> Clear All
                    </Button>
              </div>
            </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredSymptoms.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <FaInfoCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No symptoms match your search criteria</p>
                  </div>
                ) : (
                  <motion.div 
                    className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                  >
                {filteredSymptoms.map(symptom => (
                      <motion.div key={symptom.id} variants={itemVariants}>
                  <div 
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                      selectedSymptoms.includes(symptom.id) 
                              ? 'bg-primary/10 border-primary/30 border'
                              : 'hover:bg-muted/50 border border-border'
                          }`}
                    onClick={() => toggleSymptom(symptom.id)}
                  >
                          <div className={`h-5 w-5 rounded flex items-center justify-center mr-3 ${
                          selectedSymptoms.includes(symptom.id)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}>
                            {selectedSymptoms.includes(symptom.id) && <FaCheck className="h-3 w-3" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{symptom.name}</p>
                            <p className="text-xs text-muted-foreground">{symptom.category}</p>
                          </div>
                          {selectedSymptoms.includes(symptom.id) && (
                            <Badge className="bg-primary ml-2">Selected</Badge>
                          )}
                        </div>
                      </motion.div>
                ))}
                  </motion.div>
                )}
              </div>
              
              <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4 flex items-start gap-3">
                <FaInfoCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-700 dark:text-blue-400">How to get the best results</h4>
                  <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                      Select all symptoms you're experiencing, even mild ones
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                      Be as specific as possible when selecting symptoms
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                      In the next step, you'll provide additional details about your symptoms
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 2: Additional Questions */}
        {currentStep === 1 && (
          <>
            <CardHeader className="border-b">
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>
                Please provide some additional details to help us analyze your symptoms more accurately.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
          <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Age Range</label>
                  <Select value={age} onValueChange={setAge}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-17">Under 18</SelectItem>
                      <SelectItem value="18-29">18-29</SelectItem>
                      <SelectItem value="30-39">30-39</SelectItem>
                      <SelectItem value="40-49">40-49</SelectItem>
                      <SelectItem value="50-59">50-59</SelectItem>
                      <SelectItem value="60-69">60-69</SelectItem>
                      <SelectItem value="70+">70 or older</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
              
                <div>
                  <label className="text-sm font-medium mb-2 block">Biological Sex</label>
                  <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <label htmlFor="male">Male</label>
                        </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <label htmlFor="female">Female</label>
                </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <label htmlFor="other">Other</label>
              </div>
                  </RadioGroup>
                </div>
                            
                            <div>
                  <label className="text-sm font-medium mb-2 block">How long have you been experiencing these symptoms?</label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Less than 24 hours</SelectItem>
                      <SelectItem value="days">1-3 days</SelectItem>
                      <SelectItem value="week">4-7 days</SelectItem>
                      <SelectItem value="twoWeeks">1-2 weeks</SelectItem>
                      <SelectItem value="month">More than 2 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                            </div>
                            
                              <div>
                  <label className="text-sm font-medium mb-2 block">Selected Symptoms</label>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                    {selectedSymptoms.map(id => (
                      <div key={id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="text-primary h-4 w-4" />
                          <span>{getSymptomName(id)}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0 rounded-full hover:bg-muted"
                          onClick={() => toggleSymptom(id)}
                        >
                          <FaTimes className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/30 rounded-lg p-4 flex items-start gap-3">
                  <FaExclamationTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-700 dark:text-amber-400">Important Note</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      This tool is for informational purposes only and is not a qualified medical opinion. 
                      Always consult with a healthcare professional for medical advice, diagnosis, or treatment.
                    </p>
              </div>
                </div>
              </div>
            </CardContent>
          </>
        )}
          
        {/* Steps 3 & 4 would be similarly styled */}
        
        <CardFooter className="bg-muted/20 border-t p-4 flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <FaArrowLeft className="h-4 w-4" /> Previous
          </Button>
          <Button
              onClick={handleNext}
            disabled={isLoading || (currentStep === 0 && selectedSymptoms.length === 0)}
            className="gap-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
            >
              {isLoading ? (
                <>
                <FaSyncAlt className="animate-spin h-4 w-4" /> Analyzing...
                </>
              ) : (
                <>
                Next <FaArrowRight className="h-4 w-4" />
                </>
              )}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Emergency Contact */}
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/30 rounded-lg p-4 flex items-start gap-3 mt-6">
        <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
          <FaPhone className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h4 className="font-medium text-red-700 dark:text-red-400">For emergency symptoms, seek immediate medical attention</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            If you're experiencing severe chest pain, difficulty breathing, severe bleeding, or any other emergency symptoms, 
            please call emergency services (911 in the US) or go to your nearest emergency room immediately.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SymptomChecker; 