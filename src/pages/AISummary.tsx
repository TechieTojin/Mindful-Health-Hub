import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChartLine, FaHeartbeat, FaRunning, FaBrain, FaAppleAlt, 
  FaBed, FaSyncAlt, FaCalendarAlt, FaRegLightbulb, FaInfoCircle,
  FaExclamationTriangle, FaCheck, FaBullseye, FaClipboardCheck,
  FaChartPie, FaChartBar, FaArrowUp, FaArrowDown, FaLock, FaShareAlt,
  FaDownload, FaFilter, FaCog, FaLightbulb, FaPrescription, FaSlidersH, 
  FaArrowRight, FaRobot, FaHistory, FaSearch, FaBell, FaUser, FaEllipsisH, FaTimes
} from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import '../styles/healthPages.css';
import services from '../services';

// Enhanced insights data generator
const generateInsights = () => {
  // Basic health metrics
  const metrics = [
    {
      id: 'sleep',
      title: 'Sleep Quality',
      icon: FaBed,
      value: Math.floor(Math.random() * 30) + 70, // 70-100
      change: Math.floor(Math.random() * 20) - 10, // -10 to +10
      status: 'good',
      category: 'lifestyle',
      trend: generateTrendData(7),
      details: {
        avgDuration: Math.floor(Math.random() * 2) + 7, // 7-9 hours
        deepSleep: Math.floor(Math.random() * 20) + 15, // 15-35%
        remSleep: Math.floor(Math.random() * 15) + 20, // 20-35%
        interruptions: Math.floor(Math.random() * 3),
        sleepLatency: Math.floor(Math.random() * 20) + 5 // 5-25 minutes
      }
    },
    {
      id: 'activity',
      title: 'Physical Activity',
      icon: FaRunning,
      value: Math.floor(Math.random() * 40) + 60, // 60-100
      change: Math.floor(Math.random() * 30) - 5, // -5 to +25
      status: 'good',
      category: 'lifestyle',
      trend: generateTrendData(7),
      details: {
        stepsAvg: Math.floor(Math.random() * 4000) + 6000, // 6000-10000 steps
        activeMinutes: Math.floor(Math.random() * 60) + 30, // 30-90 minutes
        caloriesBurned: Math.floor(Math.random() * 400) + 200, // 200-600 calories
        workouts: Math.floor(Math.random() * 5) + 2, // 2-7 workouts/week
        activityTypes: ['Walking', 'Running', 'Strength Training', 'Cycling'].slice(0, Math.floor(Math.random() * 3) + 2)
      }
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      icon: FaAppleAlt,
      value: Math.floor(Math.random() * 35) + 60, // 60-95
      change: Math.floor(Math.random() * 20) - 8, // -8 to +12
      status: 'normal',
      category: 'lifestyle',
      trend: generateTrendData(7),
      details: {
        caloriesAvg: Math.floor(Math.random() * 800) + 1600, // 1600-2400 calories
        protein: Math.floor(Math.random() * 40) + 60, // 60-100g
        carbs: Math.floor(Math.random() * 100) + 150, // 150-250g
        fat: Math.floor(Math.random() * 30) + 50, // 50-80g
        hydration: Math.floor(Math.random() * 1000) + 1500, // 1500-2500ml
        mealQuality: Math.floor(Math.random() * 30) + 70 // 70-100
      }
    },
    {
      id: 'heart',
      title: 'Heart Health',
      icon: FaHeartbeat,
      value: Math.floor(Math.random() * 25) + 75, // 75-100
      change: Math.floor(Math.random() * 12) - 6, // -6 to +6
      status: 'good',
      category: 'vitals',
      trend: generateTrendData(7),
      details: {
        restingHR: Math.floor(Math.random() * 15) + 55, // 55-70 bpm
        hrVariability: Math.floor(Math.random() * 20) + 40, // 40-60ms
        systolic: Math.floor(Math.random() * 20) + 110, // 110-130 mmHg
        diastolic: Math.floor(Math.random() * 15) + 70, // 70-85 mmHg
        o2Saturation: Math.floor(Math.random() * 4) + 96 // 96-99%
      }
    },
    {
      id: 'stress',
      title: 'Stress Level',
      icon: FaBrain,
      value: Math.floor(Math.random() * 40) + 40, // 40-80 (lower is better)
      change: Math.floor(Math.random() * 20) - 15, // -15 to +5
      status: 'attention',
      category: 'mental',
      trend: generateTrendData(7),
      details: {
        averageLevel: Math.floor(Math.random() * 40) + 30, // 30-70
        peakStressTime: ['Morning', 'Afternoon', 'Evening'][Math.floor(Math.random() * 3)],
        recoveryRate: Math.floor(Math.random() * 20) + 60, // 60-80%
        mindfulnessSessions: Math.floor(Math.random() * 7), // 0-7 sessions
        stressFactors: ['Work', 'Sleep', 'Relationships', 'Health', 'Finances'].slice(0, Math.floor(Math.random() * 3) + 1)
      }
    },
    {
      id: 'mentalWellbeing',
      title: 'Mental Wellbeing',
      icon: FaBrain,
      value: Math.floor(Math.random() * 30) + 65, // 65-95
      change: Math.floor(Math.random() * 14) - 7, // -7 to +7
      status: 'normal',
      category: 'mental',
      trend: generateTrendData(7),
      details: {
        moodAverage: Math.floor(Math.random() * 30) + 70, // 70-100
        anxietyLevel: Math.floor(Math.random() * 30) + 10, // 10-40
        focusScore: Math.floor(Math.random() * 30) + 65, // 65-95
        socialConnections: Math.floor(Math.random() * 5) + 2, // 2-7 connections
        cognitivePerformance: Math.floor(Math.random() * 25) + 70 // 70-95
      }
    }
  ];

  // Generate detailed insights with advanced analytics 
  const insights = [
    {
      id: 'insight-1',
      title: 'Sleep pattern improvements',
      description: 'Your sleep consistency has improved by 18% over the past month. Maintaining a regular sleep schedule is contributing positively to your overall health.',
      category: 'sleep',
      type: 'positive',
      confidence: 92,
      relatedMetrics: ['heart', 'mentalWellbeing'],
      actionable: true,
      source: 'Sleep analysis algorithm based on 30-day data',
      actions: ['Maintain 10:30pm bedtime', 'Continue morning sunlight exposure']
    },
    {
      id: 'insight-2',
      title: 'Increased heart rate variability',
      description: 'Your heart rate variability has increased by 12% this month, indicating improved cardiovascular health and better stress recovery.',
      category: 'heart',
      type: 'positive',
      confidence: 89,
      relatedMetrics: ['stress', 'activity'],
      actionable: false,
      source: 'Cardiovascular pattern analysis from wearable data',
      supportingEvidence: 'Consistent correlation between HRV increases and lower stress levels has been observed'
    },
    {
      id: 'insight-3',
      title: 'Exercise consistency',
      description: 'You\'ve maintained your exercise routine for 3 weeks consistently. This pattern is associated with improved long-term fitness outcomes.',
      category: 'activity',
      type: 'positive',
      confidence: 95,
      relatedMetrics: ['heart', 'mentalWellbeing'],
      actionable: true,
      source: 'Activity pattern recognition',
      actions: ['Increase intensity gradually', 'Add one more strength session per week']
    },
    {
      id: 'insight-4',
      title: 'Nutrient imbalance',
      description: 'Your dietary logs show lower than recommended intake of vitamin D and magnesium. Consider adjusting your diet or discussing supplements with your healthcare provider.',
      category: 'nutrition',
      type: 'attention',
      confidence: 87,
      relatedMetrics: ['activity', 'mentalWellbeing'],
      actionable: true,
      source: 'Nutritional analysis based on 14-day food log',
      actions: ['Increase intake of leafy greens', 'Consider vitamin D supplementation', 'Add more nuts and seeds to diet'],
      riskLevel: 'moderate'
    },
    {
      id: 'insight-5',
      title: 'Stress triggers identified',
      description: 'Correlation analysis shows increased stress levels during mid-week work hours. Consider implementing stress management techniques on Wednesdays and Thursdays.',
      category: 'stress',
      type: 'attention',
      confidence: 83,
      relatedMetrics: ['mentalWellbeing', 'sleep', 'heart'],
      actionable: true,
      source: 'Pattern recognition algorithm',
      actions: ['Schedule short breaks on Wednesdays', 'Practice 5-minute breathing exercises', 'Block focus time on calendar'],
      riskLevel: 'moderate'
    },
    {
      id: 'insight-6',
      title: 'Cognitive performance peak times',
      description: 'Your cognitive performance metrics show peak focus and problem-solving abilities between 9-11am. Consider scheduling complex tasks during this window.',
      category: 'mentalWellbeing',
      type: 'neutral',
      confidence: 78,
      relatedMetrics: ['sleep', 'nutrition'],
      actionable: true,
      source: 'Cognitive assessment pattern analysis',
      actions: ['Schedule complex tasks between 9-11am', 'Protect this time block in your calendar']
    },
    {
      id: 'insight-7',
      title: 'Hydration and energy correlation',
      description: 'Days with consistent hydration (>2000ml) show 23% higher energy levels and 18% better mood scores. Your hydration has been below target on 4 of the last 7 days.',
      category: 'nutrition',
      type: 'attention',
      confidence: 91,
      relatedMetrics: ['activity', 'mentalWellbeing'],
      actionable: true,
      source: 'Multivariate correlation analysis',
      actions: ['Set hydration reminders', 'Carry a water bottle', 'Track intake in app'],
      riskLevel: 'low'
    }
  ];

  // Generate personalized recommendations with scientific evidence
  const recommendations = [
    {
      id: 'rec-1',
      title: 'Optimize your sleep environment',
      description: 'Consider blackout curtains and reducing screen time 1 hour before bed to improve sleep quality.',
      category: 'sleep',
      priority: 'medium',
      impact: 'high',
      timeToResult: '1-2 weeks',
      effort: 'low',
      scientificEvidence: 'Strong evidence from multiple sleep studies shows blue light reduction before bed improves sleep latency by 20-30%',
      personalizedReasoning: 'Based on your sleep data showing 25+ minutes average sleep latency'
    },
    {
      id: 'rec-2',
      title: 'Add magnesium-rich foods',
      description: 'Include more nuts, seeds, and leafy greens in your diet to address the magnesium deficiency.',
      category: 'nutrition',
      priority: 'high',
      impact: 'high',
      timeToResult: '2-4 weeks',
      effort: 'medium',
      scientificEvidence: 'Clinical studies indicate magnesium supplementation improves sleep quality and reduces anxiety symptoms',
      personalizedReasoning: 'Your nutritional logs show consistently low magnesium intake (est. 65% of RDA)'
    },
    {
      id: 'rec-3',
      title: 'Try guided meditation',
      description: 'A 10-minute guided meditation during your mid-week workdays may help manage the stress peaks we\'ve identified.',
      category: 'stress',
      priority: 'high',
      impact: 'medium',
      timeToResult: 'immediate',
      effort: 'low',
      scientificEvidence: 'Meta-analysis of 18 studies showed brief mindfulness practice reduces acute stress response by 15-25%',
      personalizedReasoning: 'Pattern analysis shows consistent stress peaks on Wednesday afternoons'
    },
    {
      id: 'rec-4',
      title: 'Increase cardiovascular exercise',
      description: 'Adding 2 more cardio sessions per week could significantly improve your heart health metrics.',
      category: 'activity',
      priority: 'medium',
      impact: 'high',
      timeToResult: '3-6 weeks',
      effort: 'medium',
      scientificEvidence: '150+ min/week of moderate cardiovascular activity associated with 20-30% reduced risk of heart disease',
      personalizedReasoning: 'Your current activity levels (avg 90 min/week) are below optimal for your age and health profile'
    },
    {
      id: 'rec-5',
      title: 'Implement a digital sunset routine',
      description: 'Create an evening routine that gradually reduces digital device usage starting 2 hours before bedtime.',
      category: 'sleep',
      priority: 'medium',
      impact: 'high',
      timeToResult: '1 week',
      effort: 'medium',
      scientificEvidence: 'Research shows 54% improvement in sleep onset with structured digital reduction before bed',
      personalizedReasoning: 'Your sleep data shows correlation between evening device usage and delayed sleep onset'
    },
    {
      id: 'rec-6',
      title: 'Schedule focus blocks for deep work',
      description: 'Set aside 90-minute blocks for focused work during your cognitive peak times (9-11am).',
      category: 'mentalWellbeing',
      priority: 'low',
      impact: 'high',
      timeToResult: 'immediate',
      effort: 'low',
      scientificEvidence: 'Research on ultradian rhythms shows productivity increases of 30-50% when aligning work with natural focus periods',
      personalizedReasoning: 'Your cognitive assessment data shows peak performance during morning hours'
    }
  ];

  // Generate health forecast
  const generateForecast = () => {
    return {
      shortTerm: {
        timeline: '1-2 weeks',
        predictions: [
          { metric: 'Sleep quality', direction: 'improve', confidence: 85, condition: 'if evening routine is maintained' },
          { metric: 'Stress levels', direction: 'improve', confidence: 75, condition: 'with consistent mindfulness practice' }
        ]
      },
      mediumTerm: {
        timeline: '1-3 months',
        predictions: [
          { metric: 'Heart health', direction: 'improve', confidence: 80, condition: 'with increased cardiovascular exercise' },
          { metric: 'Mental wellbeing', direction: 'improve', confidence: 70, condition: 'with continued stress management and sleep improvements' },
          { metric: 'Nutrient deficiencies', direction: 'resolve', confidence: 85, condition: 'with dietary adjustments' }
        ]
      },
      longTerm: {
        timeline: '6+ months',
        predictions: [
          { metric: 'Overall health risk score', direction: 'decrease', confidence: 75, condition: 'with adherence to recommendations' },
          { metric: 'Cognitive performance', direction: 'improve', confidence: 65, condition: 'with continued improvements in sleep, nutrition, and stress management' }
        ]
      },
      potentialRisks: [
        { condition: 'Continued magnesium deficiency', outcome: 'May impact sleep quality and muscle recovery', probability: 'moderate' },
        { condition: 'Sustained high stress periods', outcome: 'May affect long-term heart health and cognitive function', probability: 'low' }
      ]
    };
  };

  // Generate health connections (relations between metrics)
  const generateHealthConnections = () => {
    return [
      { source: 'sleep', target: 'mentalWellbeing', strength: 0.8, impact: 'positive', description: 'Sleep quality strongly influences cognitive performance and mood' },
      { source: 'stress', target: 'heart', strength: 0.7, impact: 'negative', description: 'Elevated stress correlates with increased heart rate and blood pressure' },
      { source: 'nutrition', target: 'activity', strength: 0.6, impact: 'positive', description: 'Proper nutrition provides energy for optimal physical performance' },
      { source: 'sleep', target: 'stress', strength: 0.75, impact: 'negative', description: 'Poor sleep increases stress hormone levels and emotional reactivity' },
      { source: 'activity', target: 'mentalWellbeing', strength: 0.65, impact: 'positive', description: 'Regular physical activity boosts mood and reduces anxiety' }
    ];
  };
  
  // Helper function to generate trend data
  function generateTrendData(days) {
    const data = [];
    let value = Math.floor(Math.random() * 20) + 70;
    
    for (let i = 0; i < days; i++) {
      // Small random change each day
      value += Math.floor(Math.random() * 10) - 5;
      // Keep within range
      value = Math.max(50, Math.min(95, value));
      
      data.push({
        day: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000),
        value
      });
    }
    
    return data;
  }

  return {
    metrics,
    insights,
    recommendations,
    forecast: generateForecast(),
    healthConnections: generateHealthConnections(),
    lastUpdated: new Date().toISOString(),
    dataPoints: Math.floor(Math.random() * 5000) + 15000, // Number of data points analyzed
    aiModel: "HealthMetrics Pro v2.1",
    analysisConfidence: Math.floor(Math.random() * 10) + 88, // 88-98%
    nextScheduledUpdate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
  };
};

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

// Main component
const AISummary = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [showDetailPanel, setShowDetailPanel] = useState<string>('');
  const [viewMode, setViewMode] = useState<'standard' | 'advanced'>('standard');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
  const currentDate = new Date();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Effect for initial data loading and periodic updates
  useEffect(() => {
    loadData();

    // Set up an automatic refresh every 5 minutes for real-time updates
    const autoRefreshInterval = setInterval(() => {
      if (!refreshing) {
        handleQuietRefresh();
      }
    }, 5 * 60 * 1000);
    
    return () => {
      clearInterval(autoRefreshInterval);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Effect to simulate real-time data analysis when refreshing
  useEffect(() => {
    if (refreshing) {
      setAnalysisProgress(0);
      intervalRef.current = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 95) {
            clearInterval(intervalRef.current!);
            return 95;
          }
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 150);
    } else if (analysisProgress > 0 && analysisProgress < 100) {
      setAnalysisProgress(100);
      setTimeout(() => setAnalysisProgress(0), 500);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshing]);
  
  // Load data with simulated API call
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setAnalysisProgress(0);
    
    // Start progress animation
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 150);
    
    try {
      // Simulate API call with artificial delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if we have a mock service to use
      if (services && services.groq) {
        // Pretend we're using the Groq service for AI analysis
        console.log('Using Groq service for health analysis');
        await services.groq.generateCompletion({
          prompt: "Analyze health data and generate insights",
          model: "llama2-70b-4096"
        });
      }
      
      // Set the generated data
      setData(generateInsights());
    } catch (error) {
      console.error('Error loading health data:', error);
      // Fallback to generated data
      setData(generateInsights());
    } finally {
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      // Clear the progress bar after completion
      setTimeout(() => {
        setAnalysisProgress(0);
        setIsLoading(false);
        setRefreshing(false);
      }, 500);
    }
  }, []);
  
  // Handle quiet background refresh without full loading state
  const handleQuietRefresh = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    
    try {
      // Simulate lightweight API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update with fresh data
      setData(generateInsights());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  // Manually trigger data refresh
  const regenerateInsights = () => {
    if (refreshing) return;
    loadData();
  };
  
  if (isLoading || !data) {
    return (
      <div className="container mx-auto p-4 max-w-6xl app-dark-bg">
        <h1 className="text-2xl font-bold mb-6 text-gradient-primary">AI Health Summary</h1>
        <div className="health-card p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="progress-container w-full mb-6">
              <div 
                className="progress-primary" 
                style={{ width: `${analysisProgress}%` }}
              ></div>
            </div>
            <div className="loading-spinner mb-4"></div>
            <div className="text-center space-y-2">
              <p className="text-muted">Analyzing your health data...</p>
              <p className="text-muted/70 text-sm">Processing {(data?.dataPoints || 15000).toLocaleString()} data points using advanced AI algorithms</p>
              <p className="text-xs text-primary mt-4 animate-pulse">Applying machine learning models • Identifying patterns • Generating insights</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const filteredInsights = data.insights.filter((insight: any) => 
    selectedCategory === 'all' || insight.category === selectedCategory
  );
  
  const filteredRecommendations = data.recommendations.filter((rec: any) => 
    selectedCategory === 'all' || rec.category === selectedCategory
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get color for metric status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return { bg: 'bg-success', text: 'text-success', bgLight: 'bg-success/20', bar: 'bg-success' };
      case 'normal':
        return { bg: 'bg-primary', text: 'text-primary', bgLight: 'bg-primary/20', bar: 'bg-primary' };
      case 'attention':
        return { bg: 'bg-warning', text: 'text-warning', bgLight: 'bg-warning/20', bar: 'bg-warning' };
      case 'poor':
      case 'alert':
        return { bg: 'bg-danger', text: 'text-danger', bgLight: 'bg-danger/20', bar: 'bg-danger' };
      default:
        return { bg: 'bg-muted', text: 'text-muted', bgLight: 'bg-muted/50', bar: 'bg-muted' };
    }
  };
  
  // Get badge for recommendation priority
  const getPriorityBadge = (priority: string, impact: string) => {
    switch (priority) {
      case 'high':
        return (
          <div className="flex items-center gap-1">
            <span className="health-tag tag-danger flex items-center">
              <FaArrowUp className="mr-1" size={10} /> High Priority
            </span>
            <span className={`health-tag ${impact === 'high' ? 'tag-danger' : impact === 'medium' ? 'tag-warning' : 'tag-primary'}`}>
              {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
            </span>
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center gap-1">
            <span className="health-tag tag-warning">Medium Priority</span>
            <span className={`health-tag ${impact === 'high' ? 'tag-danger' : impact === 'medium' ? 'tag-warning' : 'tag-primary'}`}>
              {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
            </span>
          </div>
        );
      case 'low':
        return (
          <div className="flex items-center gap-1">
            <span className="health-tag tag-success">Low Priority</span>
            <span className={`health-tag ${impact === 'high' ? 'tag-danger' : impact === 'medium' ? 'tag-warning' : 'tag-primary'}`}>
              {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
            </span>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Get icon for insight type
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <FaCheck className="text-success" />;
      case 'neutral':
        return <FaInfoCircle className="text-primary" />;
      case 'attention':
        return <FaExclamationTriangle className="text-warning" />;
      case 'negative':
        return <FaExclamationTriangle className="text-danger" />;
      default:
        return <FaInfoCircle className="text-muted" />;
    }
  };
  
  // Get change indicator with colored arrows
  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return <span className="text-success text-sm flex items-center"><FaArrowUp className="mr-1" size={10} /> {change}%</span>;
    } else if (change < 0) {
      return <span className="text-danger text-sm flex items-center"><FaArrowDown className="mr-1" size={10} /> {Math.abs(change)}%</span>;
    } else {
      return <span className="text-muted text-sm">–</span>;
    }
  };

  // Get confidence badge
  const getConfidenceBadge = (confidence: number) => {
    let colorClass = 'tag-primary';
    if (confidence >= 90) colorClass = 'tag-success';
    else if (confidence >= 75) colorClass = 'tag-primary';
    else if (confidence >= 60) colorClass = 'tag-warning';
    else colorClass = 'tag-danger';

    return (
      <span className={`health-tag ${colorClass}`}>
        {confidence}% Confidence
      </span>
    );
  };

  // Handle showing details panel
  const toggleDetailPanel = (metricId: string) => {
    if (showDetailPanel === metricId) {
      setShowDetailPanel('');
    } else {
      setShowDetailPanel(metricId);
    }
  };

  // Switch between standard and advanced view
  const toggleViewMode = () => {
    setViewMode(viewMode === 'standard' ? 'advanced' : 'standard');
  };

  // Dummy function for development purposes
  const handleShare = () => {
    alert('Share functionality would be implemented here in a real application');
  };

  const handleDownload = () => {
    alert('Download functionality would be implemented here in a real application');
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8 max-w-7xl space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-indigo-500/20 to-blue-500/20 dark:from-violet-900/30 dark:via-indigo-900/30 dark:to-blue-900/30 backdrop-blur-sm"></div>
        
        <div className="relative p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                <FaRobot className="h-4 w-4 mr-2" /> AI-Powered Analysis
            </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Your Health Summary
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Comprehensive AI-generated insights based on your health data, activity patterns, and medical history
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-center px-4 py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border/60">
                <p className="text-sm text-muted-foreground">Last updated</p>
                <p className="font-medium">{formatDate(new Date().toISOString())}</p>
            </div>
              
              <Button 
              onClick={regenerateInsights}
              disabled={refreshing}
                className="gap-2"
                variant="outline"
            >
                <FaSyncAlt className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Analyzing...' : 'Refresh Analysis'}</span>
              </Button>
          </div>
        </div>
      </div>
          </div>
      
      {/* Dashboard Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs 
          defaultValue="insights" 
          className="w-full sm:w-auto"
          onValueChange={(value) => console.log(`Switched to ${value} view`)}
        >
          <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
            <TabsTrigger value="insights">
              <FaLightbulb className="h-4 w-4 mr-2" /> Insights
            </TabsTrigger>
            <TabsTrigger value="trends">
              <FaChartLine className="h-4 w-4 mr-2" /> Trends
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <FaClipboardCheck className="h-4 w-4 mr-2" /> Recommendations
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-9 gap-1" onClick={handleShare}>
            <FaShareAlt className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="h-9 gap-1" onClick={handleDownload}>
            <FaDownload className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 gap-1" 
            onClick={toggleViewMode}
            >
            <FaSlidersH className="h-4 w-4" />
            <span className="hidden sm:inline">{viewMode === 'detailed' ? 'Simple View' : 'Detailed View'}</span>
          </Button>
              </div>
              </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 relative mb-8">
            <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
            <div className="absolute inset-3 rounded-full border-t-2 border-indigo-500 animate-spin-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaRobot className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                </div>
          <h3 className="text-xl font-medium mb-2">Analyzing Your Health Data</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Our AI is processing your health information to generate personalized insights and recommendations...
          </p>
        </div>
      ) : (
        <TabsContent value="insights" className="m-0 mt-6">
          {/* Health Metrics Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Health Metrics</h2>
              <Button variant="outline" size="sm" className="gap-1">
                <FaHistory className="h-4 w-4" />
                <span>View History</span>
              </Button>
      </div>
      
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
            >
              {data.metrics.map((metric) => (
                <motion.div key={metric.id} variants={itemVariants}>
                  <Card 
                    className={`h-full cursor-pointer border hover:shadow-md transition-all duration-300 ${
                      showDetailPanel === metric.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => toggleDetailPanel(metric.id)}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getStatusColor(metric.status).bgLight}`}>
                          <metric.icon className={`h-5 w-5 ${getStatusColor(metric.status).text}`} />
                          </div>
                        <Badge className={`${getStatusColor(metric.status).bg} text-white`}>
                          {metric.status === 'good' && 'Good'}
                          {metric.status === 'normal' && 'Normal'}
                          {metric.status === 'attention' && 'Attention'}
                          {metric.status === 'alert' && 'Alert'}
                        </Badge>
                        </div>
                      <CardTitle className="text-lg mt-3">{metric.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-baseline justify-between">
                        <div className="text-3xl font-bold">{metric.value}</div>
                        {getChangeIndicator(metric.change)}
                      </div>
                      
                      <div className="mt-4">
                        <div className="h-2 bg-muted rounded-full overflow-hidden mb-1">
                        <div 
                            className={`h-full rounded-full ${getStatusColor(metric.status).bar}`} 
                          style={{ width: `${metric.value}%` }}
                        ></div>
                      </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0</span>
                          <span>100</span>
                          </div>
                          </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            
            {showDetailPanel && (
              <div className="mt-4">
                <Card className="border-t-4 border-t-blue-500">
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>
                        {data.metrics.find(m => m.id === showDetailPanel)?.title} Details
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setShowDetailPanel(null)}
                >
                        <FaTimes className="h-4 w-4" />
                      </Button>
            </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-4">Trend (Last 7 Days)</h4>
                        <div className="h-44 flex items-end justify-between gap-1 mb-2">
                          {data.metrics.find(m => m.id === showDetailPanel)?.trend.map((value, i) => (
                            <div 
                              key={i} 
                              className="w-full bg-blue-500/20 dark:bg-blue-500/10 rounded-t relative group"
                              style={{ height: `${value}%` }}
                            >
                              <div className="absolute inset-x-0 bottom-0 bg-blue-500 rounded-t transition-all duration-300 group-hover:opacity-80" style={{ height: `${value}%` }}></div>
                              <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-background border border-border px-2 py-1 rounded text-xs whitespace-nowrap transition-opacity">
                                {value}%
              </div>
                      </div>
                                    ))}
                                  </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Mon</span>
                          <span>Tue</span>
                          <span>Wed</span>
                          <span>Thu</span>
                          <span>Fri</span>
                          <span>Sat</span>
                          <span>Sun</span>
                                </div>
                            </div>
                            
                              <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-4">Key Details</h4>
                            <div className="space-y-3">
                          {Object.entries(data.metrics.find(m => m.id === showDetailPanel)?.details || {}).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center">
                              <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className="font-medium">{value}{key.includes('percentage') ? '%' : ''}</span>
                  </div>
                ))}
              </div>
                </div>
                </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/50 flex justify-between">
                    <Button variant="ghost" size="sm">View Full History</Button>
                    <Button variant="outline" size="sm">Set Goals</Button>
                  </CardFooter>
                </Card>
          </div>
        )}
          </section>
        
          {/* Top Insights */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Key Insights</h2>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {data.insights.slice(0, 4).map((insight) => (
                <motion.div key={insight.id} variants={itemVariants}>
                  <Card className="h-full hover:shadow-md transition-all duration-300 overflow-hidden group">
                    <div className={`h-1 w-full ${insight.type === 'positive' ? 'bg-green-500' : insight.type === 'attention' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                    <CardHeader className="p-5 pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4 items-start">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            insight.type === 'positive' ? 'bg-green-100 dark:bg-green-900/30 text-green-500' : 
                            insight.type === 'attention' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-500' : 
                            'bg-blue-100 dark:bg-blue-900/30 text-blue-500'
                          }`}>
                            {getInsightIcon(insight.type)}
                            </div>
                        <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">{insight.title}</CardTitle>
                            <CardDescription className="mt-1 text-sm">{insight.category.charAt(0).toUpperCase() + insight.category.slice(1)}</CardDescription>
                            </div>
                          </div>
                        {getConfidenceBadge(insight.confidence)}
                        </div>
                    </CardHeader>
                    <CardContent className="px-5 pt-0 pb-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {insight.description}
                      </p>
                      
                      {insight.relatedMetrics && insight.relatedMetrics.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {insight.relatedMetrics.map((metricId) => {
                            const metric = data.metrics.find(m => m.id === metricId);
                            return metric ? (
                              <Badge key={metricId} variant="outline" className="bg-muted/50 hover:bg-muted">
                                {metric.title}
                              </Badge>
                            ) : null;
                          })}
                            </div>
                      )}
                    </CardContent>
                    <CardFooter className="px-5 py-3 flex justify-between border-t bg-muted/20">
                      <div className="text-xs text-muted-foreground">
                        Source: {insight.source.length > 30 ? insight.source.substring(0, 30) + '...' : insight.source}
                          </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Details <FaArrowRight className="h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            
            <div className="flex justify-center mt-6">
              <Button variant="outline" className="gap-2">
                View All Insights <FaArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>

          {/* Recommendations will be similarly styled */}
        </TabsContent>
      )}
    </motion.div>
  );
};

export default AISummary; 