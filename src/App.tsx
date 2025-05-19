import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles/main.css"; // Import main CSS for health app styling
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";
import Analytics from "./pages/Analytics";
import Workouts from "./pages/Workouts";
import MentalWellness from "./pages/MentalWellness";
import Calendar from "./pages/Calendar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Web3Login from "./pages/Web3Login";
import Web3Register from "./pages/Web3Register";
import Web3Auth from "./pages/Web3Auth";
import Web3AuthLogin from "./pages/Web3AuthLogin";
import ConnectDevice from "./pages/ConnectDevice";
import AICoachChat from "./pages/AICoachChat";
import LiveWorkout from "./pages/LiveWorkout";
import FoodScanner from "./pages/FoodScanner";
import Meal from "./pages/Meal";
import AddMeal from "./pages/AddMeal";
import MealPlanner from "./pages/MealPlanner";
import MealDatabase from "./pages/MealDatabase";
import Achievements from "./pages/Achievements";
import DataVault from "./pages/DataVault";
import AboutUs from "./pages/AboutUs";
import ProfileSettings from "./pages/ProfileSettings";
import AIVideoAnalysis from "./pages/AIVideoAnalysis";
import AIVoiceAssistant from "./pages/AIVoiceAssistant";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Web3AuthProvider } from "./contexts/Web3AuthContext";
import FitnessProgress from "./pages/FitnessProgress";
import HealthReport from "./pages/HealthReport";
import LiveStatsDashboard from "./pages/LiveStatsDashboard";
import HydrationTracker from "./pages/HydrationTracker";
import SleepAnalysis from "./pages/SleepAnalysis";
import PersonalizedInsights from "./pages/PersonalizedInsights";
import SleepInsights from "./pages/SleepInsights";
import HeartRate from "./pages/HeartRate";
import DailySchedule from "./pages/DailySchedule";
import DashboardCustomize from "./pages/DashboardCustomize";

const queryClient = new QueryClient();

// Protected route component that uses AuthContext
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Wrapper component to provide auth context
const AppWithAuth = () => (
  <BrowserRouter>
    <AuthProvider>
      <Web3AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/web3-login" element={<Web3Login />} />
          <Route path="/web3-register" element={<Web3Register />} />
          <Route path="/web3-auth" element={<Web3Auth />} />
          <Route path="/web3-auth-login" element={<Web3AuthLogin />} />
          <Route path="/connect-device" element={<ConnectDevice />} />
          
          {/* Non-auth but with drawer layout */}
          <Route path="/about" element={
            <AppLayout>
              <AboutUs />
            </AppLayout>
          } />
          
          {/* Dashboard - No authentication required */}
          <Route path="/dashboard" element={
            <AppLayout>
              <Index />
            </AppLayout>
          } />
          
          {/* Redirects for removed pages */}
          <Route path="/medical-records" element={<Navigate to="/dashboard" replace />} />
          <Route path="/ai-summary" element={<Navigate to="/dashboard" replace />} />
          <Route path="/personalized-insights-feed" element={<Navigate to="/personalized-insights" replace />} />
          <Route path="/symptom-checker" element={<Navigate to="/dashboard" replace />} />
          <Route path="/modern-symptom-checker" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/personalized-insights" element={
            <ProtectedRoute>
              <AppLayout>
                <PersonalizedInsights />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/analytics" element={
            <ProtectedRoute>
              <AppLayout>
                <Analytics />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/workouts" element={
            <ProtectedRoute>
              <AppLayout>
                <Workouts />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/fitness-progress" element={
            <ProtectedRoute>
              <AppLayout>
                <FitnessProgress />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/mental-wellness" element={
            <ProtectedRoute>
              <AppLayout>
                <MentalWellness />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <AppLayout>
                <Calendar />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <AppLayout>
                <AICoachChat />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/live-workout" element={
            <ProtectedRoute>
              <AppLayout>
                <LiveWorkout />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/food-scanner" element={
            <ProtectedRoute>
              <AppLayout>
                <FoodScanner />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/meal" element={
            <ProtectedRoute>
              <AppLayout>
                <Meal />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/add-meal" element={
            <ProtectedRoute>
              <AppLayout>
                <AddMeal />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/meal-planner" element={
            <ProtectedRoute>
              <AppLayout>
                <MealPlanner />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/meal-database" element={
            <ProtectedRoute>
              <AppLayout>
                <MealDatabase />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/achievements" element={
            <ProtectedRoute>
              <AppLayout>
                <Achievements />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/data-vault" element={
            <ProtectedRoute>
              <AppLayout>
                <DataVault />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile-settings" element={
            <ProtectedRoute>
              <AppLayout>
                <ProfileSettings />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/ai-video-analysis" element={
            <ProtectedRoute>
              <AppLayout>
                <AIVideoAnalysis />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/ai-voice-assistant" element={
            <ProtectedRoute>
              <AppLayout>
                <AIVoiceAssistant />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/health-report" element={
            <ProtectedRoute>
              <AppLayout>
                <HealthReport />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/live-stats-dashboard" element={
            <ProtectedRoute>
              <AppLayout>
                <LiveStatsDashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/hydration-tracker" element={
            <ProtectedRoute>
              <AppLayout>
                <HydrationTracker />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/sleep-analysis" element={
            <ProtectedRoute>
              <AppLayout>
                <SleepAnalysis />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/sleep-insights" element={
            <ProtectedRoute>
              <AppLayout>
                <SleepInsights />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/heart-rate" element={
            <ProtectedRoute>
              <AppLayout>
                <HeartRate />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/daily-schedule" element={
            <ProtectedRoute>
              <AppLayout>
                <DailySchedule />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/ai-coach-chat" element={
            <ProtectedRoute>
              <AppLayout>
                <AICoachChat />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/customize" element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardCustomize />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={
            <AppLayout>
              <NotFound />
            </AppLayout>
          } />
        </Routes>
      </Web3AuthProvider>
    </AuthProvider>
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppWithAuth />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
