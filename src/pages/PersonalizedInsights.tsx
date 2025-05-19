import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, FaUserMd, FaLink, FaCalendarAlt, FaArrowRight, 
  FaArrowLeft, FaSearch, FaEllipsisV, FaBookmark, FaRegBookmark,
  FaChartLine, FaHeartbeat, FaRunning, FaBrain, FaAppleAlt, FaBed,
  FaFilter, FaExternalLinkAlt, FaLightbulb, FaShareAlt, FaEye, FaTags,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import '../styles/healthPages.css';

// Animation variants for staggered animations
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
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

// Define proper types
interface Category {
  id: string;
  name: string;
  icon?: React.ComponentType<any>;
}

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  readTime: number;
  source: string;
  sourceUrl: string;
  author: string;
  authorCredentials: string;
  authorSpecialty: string;
  relevance: number;
  image: string;
  saved: boolean;
  metrics: {
    views: number;
    saves: number;
    shares: number;
  };
}

// Mock article categories
const categories: Category[] = [
  { id: 'all', name: 'All' },
  { id: 'nutrition', name: 'Nutrition', icon: FaAppleAlt },
  { id: 'fitness', name: 'Fitness', icon: FaRunning },
  { id: 'mental', name: 'Mental Health', icon: FaBrain },
  { id: 'heart', name: 'Heart Health', icon: FaHeartbeat },
  { id: 'sleep', name: 'Sleep', icon: FaBed },
  { id: 'general', name: 'General Wellness', icon: FaChartLine }
];

// More realistic images for health articles
const getCategoryImage = (category: string, index: number): string => {
  const images = {
    nutrition: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=1780&auto=format&fit=crop"
    ],
    fitness: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518310383802-640c2de311b6?q=80&w=2070&auto=format&fit=crop"
    ],
    mental: [
      "https://images.unsplash.com/photo-1499728603263-13726abce5fd?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1468971050039-be99497410af?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602192509154-0b900ee1f851?q=80&w=2070&auto=format&fit=crop"
    ],
    heart: [
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559757175-7b21e5afae2a?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?q=80&w=2071&auto=format&fit=crop"
    ],
    sleep: [
      "https://images.unsplash.com/photo-1519003300449-424ad0405076?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1455642305362-08c2a90ab74f?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520206183501-b80df61043c2?q=80&w=1933&auto=format&fit=crop"
    ],
    general: [
      "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506126279646-a697353d3166?q=80&w=2070&auto=format&fit=crop"
    ]
  };
  
  return images[category][index % images[category].length];
};

// Helper function to generate realistic article titles
const getArticleTitle = (category: string): string => {
  const titles: Record<string, string[]> = {
    nutrition: [
      "The Impact of Mediterranean Diet on Your Specific Health Profile",
      "Personalized Nutrition: Tailoring Your Diet to Your Body's Needs",
      "Understanding Your Metabolic Response to Different Foods",
      "How Your Genetic Factors Influence Nutritional Requirements",
      "Optimizing Your Diet Based on Your Health Biomarkers"
    ],
    fitness: [
      "Exercise Routines Optimized for Your Body Type",
      "The Right Intensity: Exercise Levels Based on Your Heart Data",
      "Building a Sustainable Fitness Plan for Your Lifestyle",
      "Recovery Strategies Tailored to Your Physical Response",
      "Your Optimal Workout Timing Based on Circadian Rhythms"
    ],
    mental: [
      "Mindfulness Practices Tailored to Your Stress Patterns",
      "Cognitive Behavioral Strategies for Your Thought Patterns",
      "Digital Detox: Personalized Approach for Your Screen Habits",
      "Social Connection: Building Relationships That Support Your Mental Health",
      "Sleep and Mental Health: Your Personal Connection"
    ],
    heart: [
      "Understanding Your Unique Cardiovascular Risk Factors",
      "Heart-Healthy Habits Customized to Your Lifestyle",
      "Your Blood Pressure Patterns: What They Mean and How to Respond",
      "Exercise and Heart Health: Your Personalized Approach",
      "Stress Management Techniques for Your Cardiovascular Health"
    ],
    sleep: [
      "Your Chronotype: Optimizing Your Day Based on Sleep Patterns",
      "Building a Sleep Routine Around Your Personal Habits",
      "Environmental Factors Affecting Your Specific Sleep Quality",
      "The Connection Between Your Diet and Sleep Quality",
      "Managing Your Screen Time for Better Sleep Outcomes"
    ],
    general: [
      "Preventive Health Strategies Based on Your Risk Profile",
      "Understanding Your Health Data: Making Informed Decisions",
      "Building Sustainable Health Habits That Work for You",
      "Personalized Approaches to Managing Chronic Conditions",
      "Integrating Multiple Health Aspects for Your Overall Wellbeing"
    ]
  };
  
  return titles[category][Math.floor(Math.random() * titles[category].length)];
};

// Helper function to generate realistic article summaries
const getArticleSummary = (category: string, title: string): string => {
  const summaries: Record<string, string[]> = {
    nutrition: [
      `Based on your dietary patterns showing lower intake of omega-3 fatty acids and higher consumption of processed foods, this article provides tailored insights on how Mediterranean diet principles could significantly improve your metabolic markers.`,
      `Your recent food tracking shows you're consuming less than 15g of fiber daily. This article provides personalized recommendations for increasing fiber intake based on your food preferences and health goals.`,
      `Analysis of your meal timing patterns indicates inconsistent eating schedules that may be affecting your insulin response. Learn how to optimize your nutrition timing based on your unique metabolic profile.`
    ],
    fitness: [
      `Your workout data shows high intensity training 4-5 times weekly with minimal recovery periods. This article offers personalized insights on optimizing your rest cycles to prevent the plateau in progress we've detected in your last 3 weeks of activity.`,
      `Based on your heart rate variability data and recovery metrics, we've identified that your current exercise intensity may be too high. This article provides a tailored approach for your specific cardiovascular profile.`,
      `Your movement patterns indicate potential muscular imbalances that could be affecting your workout efficiency. Discover customized exercise modifications based on your unique biomechanical profile.`
    ],
    mental: [
      `Your mood tracking data shows increased stress levels between 2-4pm on workdays. This article provides personalized mindfulness strategies timed specifically for your daily stress patterns.`,
      `Based on your sleep and activity data, we've detected potential connections between your exercise timing and evening anxiety levels. Learn about tailored approaches to mental wellness that align with your specific behavioral patterns.`,
      `Your focus metrics have shown a 23% decline during afternoon work sessions. These cognitive behavioral techniques have been selected specifically for your attention patterns and productivity goals.`
    ],
    heart: [
      `Your recent health check indicated slightly elevated blood pressure readings (average 132/84). This article provides personalized lifestyle modifications specifically effective for your cardiovascular risk profile.`,
      `Based on your family history of heart disease and your current activity levels, this article outlines a personalized approach to cardiovascular health that addresses your specific risk factors.`,
      `Your heart rate variability data suggests moderate autonomic nervous system imbalance. These targeted approaches can help improve your HRV based on your specific cardiovascular metrics.`
    ],
    sleep: [
      `Your sleep tracking shows an average of 6.2 hours of sleep with 14% in deep sleep phase - below optimal levels. These recommendations are customized based on your specific sleep architecture and chronotype.`,
      `Analysis of your sleep patterns indicates potential disruptions around 2-3AM correlating with room temperature fluctuations. This guide provides environment optimization strategies tailored to your sleep data.`,
      `Your evening screen time has increased 42% in the last month, coinciding with declining sleep quality metrics. These digital wellness strategies are specifically designed for your usage patterns and sleep goals.`
    ],
    general: [
      `Based on your comprehensive health profile, including recent lab work showing vitamin D levels at 28 ng/mL, this article provides personalized wellness strategies to optimize your overall health markers.`,
      `Your health data indicates excellent consistency in some habits but challenges maintaining others. This personalized approach to behavior change is based on your specific pattern of habit formation and lifestyle factors.`,
      `Integrating your activity, nutrition, sleep, and stress data, we've identified key opportunity areas for optimizing your overall wellbeing with minimal lifestyle disruption.`
    ]
  };
  
  return summaries[category][Math.floor(Math.random() * summaries[category].length)];
};

// Mock data generator
const generateArticles = (): Article[] => {
  const sources = [
    {name: 'Harvard Health', url: 'https://www.health.harvard.edu/'},
    {name: 'Mayo Clinic', url: 'https://www.mayoclinic.org/'},
    {name: 'Cleveland Clinic', url: 'https://my.clevelandclinic.org/'},
    {name: 'Johns Hopkins Medicine', url: 'https://www.hopkinsmedicine.org/'},
    {name: 'WebMD', url: 'https://www.webmd.com/'},
    {name: 'Medical News Today', url: 'https://www.medicalnewstoday.com/'}
  ];
  
  const authors = [
    {name: 'Dr. Sarah Johnson', credentials: 'MD, PhD', specialty: 'Nutritional Medicine'},
    {name: 'Dr. Michael Chen', credentials: 'MD, FACC', specialty: 'Cardiology'},
    {name: 'Dr. Emily Rodriguez', credentials: 'PhD', specialty: 'Exercise Physiology'},
    {name: 'Dr. David Patel', credentials: 'MD, MPH', specialty: 'Preventive Medicine'},
    {name: 'Dr. Olivia Wilson', credentials: 'PsyD', specialty: 'Behavioral Psychology'},
    {name: 'Dr. James Thompson', credentials: 'MD', specialty: 'Sleep Medicine'}
  ];
  
  const articles: Article[] = [];
  
  // Generate articles for each category
  categories.slice(1).forEach(category => {
    for (let i = 0; i < 3; i++) {
      const title = getArticleTitle(category.id);
      const sourceIndex = Math.floor(Math.random() * sources.length);
      const authorIndex = Math.floor(Math.random() * authors.length);
      
      articles.push({
        id: `${category.id}-${i}`,
        title,
        summary: getArticleSummary(category.id, title),
        category: category.id,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        readTime: Math.floor(Math.random() * 10) + 3,
        source: sources[sourceIndex].name,
        sourceUrl: sources[sourceIndex].url,
        author: authors[authorIndex].name,
        authorCredentials: authors[authorIndex].credentials,
        authorSpecialty: authors[authorIndex].specialty,
        relevance: Math.floor(Math.random() * 15) + 85, // More realistic high match scores (85-100%)
        image: getCategoryImage(category.id, i),
        saved: Math.random() > 0.7,
        metrics: {
          views: Math.floor(Math.random() * 1000) + 100,
          saves: Math.floor(Math.random() * 100) + 10,
          shares: Math.floor(Math.random() * 50) + 5
        }
      });
    }
  });
  
  return articles.sort((a, b) => b.relevance - a.relevance);
};

const PersonalizedInsights = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [savedOnly, setSavedOnly] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'readTime'>('relevance');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  const articlesPerPage = 6;
  
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setArticles(generateArticles());
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, savedOnly, sortBy]);
  
  // Filter articles based on active category, search query, and saved filter
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
      const matchesSearch = searchQuery === '' || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSaved = !savedOnly || article.saved;
      
      return matchesCategory && matchesSearch && matchesSaved;
    }).sort((a, b) => {
      if (sortBy === 'relevance') return b.relevance - a.relevance;
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return a.readTime - b.readTime;
    });
  }, [articles, activeCategory, searchQuery, savedOnly, sortBy]);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  // Get current page articles
  const currentArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage, 
    currentPage * articlesPerPage
  );
  
  // Handle pagination
  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Toggle saved status
  const toggleSaved = (articleId: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    
    setArticles(articles.map(article => 
      article.id === articleId 
        ? { ...article, saved: !article.saved } 
        : article
    ));
    
    if (selectedArticle && selectedArticle.id === articleId) {
      setSelectedArticle({ ...selectedArticle, saved: !selectedArticle.saved });
    }
  };
  
  // Handle article selection
  const viewArticle = (article: Article) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // In a real app, this would trigger an API call to fetch the full article content
  };
  
  // Handle closing article view
  const closeArticleView = () => {
    setSelectedArticle(null);
  };
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
    return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Header with Gradient */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500/90 via-orange-500/80 to-red-500/90 text-white mb-6">
        <div className="absolute inset-0 bg-[url('/images/pattern/dots.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-white/30 border-t-white/80"
                />
                <FaLightbulb className="h-8 w-8 text-white" />
              </div>
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-bold text-white"
                >
                  Personalized Health Insights
                </motion.h1>
                <p className="text-white/80">
                  Discover customized health content based on your unique health profile
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                variant={savedOnly ? "default" : "outline"}
                className={`h-9 gap-1 ${savedOnly ? 'bg-white/10 hover:bg-white/20' : 'bg-white/10 hover:bg-white/20'} text-white border border-white/20`}
                onClick={() => setSavedOnly(!savedOnly)}
              >
                {savedOnly ? <FaBookmark className="h-4 w-4" /> : <FaRegBookmark className="h-4 w-4" />}
                <span>{savedOnly ? 'Saved Only' : 'Show Saved'}</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-9 gap-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
                        </div>
                      </div>
                    </div>
              </div>
      
      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col md:flex-row justify-between gap-4 mb-6"
      >
        <div className="relative w-full md:w-auto md:flex-1 max-w-md">
          <motion.div
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              type="text"
              placeholder="Search articles by topic, keyword, or health goal..."
              className="pl-10 w-full border-0 shadow-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
          <FaSearch className="absolute left-3 top-3 text-muted-foreground" />
          </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <div className="flex rounded-md overflow-hidden border bg-card/50 backdrop-blur-sm">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-9 rounded-none ${sortBy === 'relevance' ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-400 font-medium' : ''}`}
              onClick={() => setSortBy('relevance')}
            >
              Relevance
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-9 rounded-none ${sortBy === 'date' ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-400 font-medium' : ''}`}
              onClick={() => setSortBy('date')}
            >
              Latest
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-9 rounded-none ${sortBy === 'readTime' ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-400 font-medium' : ''}`}
              onClick={() => setSortBy('readTime')}
            >
              Quick Reads
            </Button>
        </div>
        </motion.div>
      </motion.div>
      
      {/* Categories */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex overflow-x-auto pb-2 gap-2"
      >
        {categories.map((category, idx) => {
          const Icon = category.icon;
                return (
            <motion.div
                    key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + (idx * 0.05) }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                className={`whitespace-nowrap flex items-center gap-1.5 shadow-sm ${
                      activeCategory === category.id 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 hover:from-amber-600 hover:to-orange-600' 
                  : 'border bg-card/50 backdrop-blur-sm'
                    }`}
                onClick={() => {
                  setActiveCategory(category.id);
                  setCurrentPage(1);
                }}
                  >
                {Icon && <Icon className="h-4 w-4" />}
                    {category.name}
              </Button>
            </motion.div>
                );
              })}
      </motion.div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 relative mb-8">
            <div className="absolute inset-0 rounded-full border-t-2 border-amber-500 animate-spin"></div>
            <div className="absolute inset-3 rounded-full border-t-2 border-orange-500 animate-spin-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaLightbulb className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <h3 className="text-xl font-medium mb-2">Finding Personalized Content</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Our AI is analyzing your health profile to find the most relevant articles and recommendations...
          </p>
        </div>
      ) : (
        <>
          {/* Results summary */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {filteredArticles.length === 0 ? 'No articles found' : (
                activeCategory === 'all' 
                  ? 'All Articles' 
                  : `${categories.find(c => c.id === activeCategory)?.name} Articles`
              )}
            </h2>
        <p className="text-sm text-muted-foreground">
              {filteredArticles.length} {filteredArticles.length === 1 ? 'result' : 'results'}
            </p>
      </div>
      
      {filteredArticles.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-12 border rounded-xl bg-muted/10"
        >
          <FaSearch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No articles found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            We couldn't find any articles matching your search criteria. 
            Try adjusting your filters or search terms.
          </p>
          <Button 
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
              setSavedOnly(false);
            }}
          >
            Reset Filters
          </Button>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
        >
          {currentArticles.map((article, index) => (
            <motion.div 
              key={article.id} 
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-900/70 dark:to-gray-800/60 backdrop-blur-sm">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Badge className={`
                        ${article.category === 'nutrition' ? 'bg-emerald-500 hover:bg-emerald-600' : 
                          article.category === 'fitness' ? 'bg-blue-500 hover:bg-blue-600' : 
                          article.category === 'heart' ? 'bg-red-500 hover:bg-red-600' : 
                          article.category === 'mental' ? 'bg-violet-500 hover:bg-violet-600' : 
                          article.category === 'sleep' ? 'bg-indigo-500 hover:bg-indigo-600' : 
                          'bg-gray-500 hover:bg-gray-600'} 
                        hover:cursor-pointer text-white font-medium`}
                        onClick={() => {
                          setActiveCategory(article.category);
                          setCurrentPage(1);
                        }}
                      >
                        {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                      </Badge>
                    </motion.div>
                    <Badge variant="outline" className="bg-black/50 text-white border-none">
                      {article.readTime} min read
                    </Badge>
                    </div>
                  <motion.button 
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                        onClick={(e) => toggleSaved(article.id, e)}
                  >
                    {article.saved 
                      ? <FaBookmark className="h-4 w-4 text-amber-400" /> 
                      : <FaRegBookmark className="h-4 w-4" />
                    }
                  </motion.button>
                    </div>
                
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <span>{formatDate(article.date)}</span>
                    <span>•</span>
                    <span>{article.source}</span>
                    </div>
                  <CardTitle className="line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pb-0">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {article.summary}
                  </p>
                  
                  <div className="mt-3 flex items-center gap-1">
                    <div className="flex-shrink-0">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 text-xs">
                          {article.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                        </div>
                    <div className="text-xs flex-1 min-w-0">
                      <p className="font-medium truncate">{article.author}</p>
                      <p className="text-muted-foreground truncate">{article.authorCredentials}, {article.authorSpecialty}</p>
                        </div>
                    <div className="flex-shrink-0">
                      <Badge variant="outline" className="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800 font-medium">
                        {article.relevance}% Match
                      </Badge>
                        </div>
                        </div>
                </CardContent>
                
                <CardFooter className="pt-4 flex justify-between mt-3">
                  <div className="flex text-xs text-muted-foreground gap-3">
                    <div className="flex items-center gap-1">
                      <FaEye className="h-3 w-3" /> {article.metrics.views}
                      </div>
                    <div className="flex items-center gap-1">
                      <FaBookmark className="h-3 w-3" /> {article.metrics.saves}
                    </div>
                    <div className="flex items-center gap-1">
                      <FaShareAlt className="h-3 w-3" /> {article.metrics.shares}
                  </div>
                </div>
                  <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors"
                      onClick={() => viewArticle(article)}
                    >
                      Read <FaArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Pagination */}
      {filteredArticles.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex justify-center mt-8 mb-4"
        >
          <div className="flex gap-1 border rounded-lg p-1 shadow bg-card/50 backdrop-blur-sm">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentPage === 1}
              className={`w-9 h-9 flex items-center justify-center rounded ${
                currentPage === 1 
                  ? 'text-muted-foreground cursor-not-allowed' 
                : 'hover:bg-amber-100 dark:hover:bg-amber-900/20 text-amber-600 dark:text-amber-400'
              }`}
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            >
              <FaChevronLeft className="h-4 w-4" />
            </motion.button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
              // Only show 5 page buttons at a time with current page in the middle when possible
              const visiblePageNumbers = 5;
              const halfVisible = Math.floor(visiblePageNumbers / 2);
              
              let startPage = Math.max(currentPage - halfVisible, 1);
              let endPage = Math.min(startPage + visiblePageNumbers - 1, totalPages);
              
              if (endPage - startPage + 1 < visiblePageNumbers) {
                startPage = Math.max(endPage - visiblePageNumbers + 1, 1);
              }
              
              if (page >= startPage && page <= endPage) {
                return (
                  <motion.button
                key={page}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-9 h-9 flex items-center justify-center rounded ${
                  currentPage === page 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                      : 'hover:bg-amber-100 dark:hover:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                }`}
                    onClick={() => setCurrentPage(page)}
              >
                {page}
                  </motion.button>
                );
              }
              
              // Show ellipsis at appropriate positions
              if ((page === startPage - 1 && page > 1) || (page === endPage + 1 && page < totalPages)) {
                return (
                  <span key={page} className="w-9 h-9 flex items-center justify-center text-muted-foreground">
                    ...
                  </span>
                );
              }
              
              return null;
            })}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentPage === totalPages}
              className={`w-9 h-9 flex items-center justify-center rounded ${
                currentPage === totalPages 
                  ? 'text-muted-foreground cursor-not-allowed' 
                : 'hover:bg-amber-100 dark:hover:bg-amber-900/20 text-amber-600 dark:text-amber-400'
              }`}
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
            >
              <FaChevronRight className="h-4 w-4" />
            </motion.button>
        </div>
        </motion.div>
      )}
        </>
      )}
      
      {/* Article View Dialog */}
      {selectedArticle && (
        <Dialog open={!!selectedArticle} onOpenChange={() => closeArticleView()}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={`bg-${selectedArticle.category === 'nutrition' ? 'emerald' : selectedArticle.category === 'fitness' ? 'blue' : selectedArticle.category === 'heart' ? 'red' : selectedArticle.category === 'mental' ? 'violet' : selectedArticle.category === 'sleep' ? 'indigo' : 'gray'}-500 text-white`}>
                  {selectedArticle.category.charAt(0).toUpperCase() + selectedArticle.category.slice(1)}
                </Badge>
                <Badge variant="outline">
                  {selectedArticle.relevance}% Match
                </Badge>
    </div>
              
              <DialogTitle className="text-2xl mb-1">{selectedArticle.title}</DialogTitle>
              
              <div className="flex items-center gap-3 mt-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedArticle.author.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedArticle.author}, {selectedArticle.authorCredentials}</p>
                  <p className="text-sm text-muted-foreground">{selectedArticle.authorSpecialty}</p>
                </div>
              </div>
            </DialogHeader>
            
            <div className="mt-2 mb-6">
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title} 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            
            <div className="space-y-4">
              <p className="font-medium text-lg">Summary</p>
              <p>{selectedArticle.summary}</p>
              
              <div className="flex justify-between mt-6 pt-6 border-t">
                <div className="flex gap-2">
                  <Button onClick={() => toggleSaved(selectedArticle.id)} variant="outline" className="gap-2">
                    {selectedArticle.saved ? <FaBookmark className="h-4 w-4" /> : <FaRegBookmark className="h-4 w-4" />}
                    {selectedArticle.saved ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <FaShareAlt className="h-4 w-4" />
                    Share
                  </Button>
                </div>
                <Button className="gap-2" asChild>
                  <a href={selectedArticle.sourceUrl} target="_blank" rel="noopener noreferrer">
                    Read Full Article <FaExternalLinkAlt className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

export default PersonalizedInsights; 