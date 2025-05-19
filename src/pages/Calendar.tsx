import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus,
  ArrowUpRight,
  MapPin,
  Tag,
  Users,
  Dumbbell,
  Heart,
  Briefcase,
  User,
  Coffee,
  Bell,
  Filter,
  Search,
  CalendarRange,
  Download,
  Share2
} from "lucide-react";
import { format, isSameDay, parseISO, addDays, subDays, isToday, isBefore, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

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

const scheduleItems = [
  {
    id: 1,
    title: "Morning Yoga",
    date: new Date(2025, 3, 17, 7, 30),
    duration: 30,
    type: "workout",
    location: "Home Studio",
    participants: ["Alex"],
    recurring: "daily",
    description: "Start your day with a gentle yoga flow to energize your body and mind."
  },
  {
    id: 2,
    title: "Team Meeting",
    date: new Date(2025, 3, 17, 10, 0),
    duration: 60,
    type: "work",
    location: "Conference Room B",
    participants: ["Sarah", "Michael", "Jessica"],
    recurring: "weekly",
    description: "Weekly team sync to discuss project progress and address any blockers."
  },
  {
    id: 3,
    title: "Lunch with Alex",
    date: new Date(2025, 3, 17, 12, 30),
    duration: 60,
    type: "personal",
    location: "Green Cafe",
    participants: ["Alex"],
    recurring: null,
    description: "Catching up over lunch to discuss the upcoming hiking trip."
  },
  {
    id: 4,
    title: "HIIT Workout",
    date: new Date(2025, 3, 17, 18, 0),
    duration: 45,
    type: "workout",
    location: "Fitness Center",
    participants: [],
    recurring: "weekly",
    description: "High-intensity interval training for cardiovascular health and strength building."
  },
  {
    id: 5,
    title: "Evening Meditation",
    date: new Date(2025, 3, 17, 21, 0),
    duration: 15,
    type: "wellness",
    location: "Home",
    participants: [],
    recurring: "daily",
    description: "Wind down with a guided meditation session to improve sleep quality."
  }
];

// Create events for today as well
const todayEvents = scheduleItems.map(item => ({
  ...item,
  id: item.id + 100,
  date: new Date(new Date().setHours(item.date.getHours(), item.date.getMinutes()))
}));

// Add tomorrow events
const tomorrowEvents = scheduleItems.map(item => ({
  ...item,
  id: item.id + 200,
  date: new Date(new Date().setHours(item.date.getHours(), item.date.getMinutes()))
}));
tomorrowEvents[0].date = addDays(tomorrowEvents[0].date, 1);
tomorrowEvents[3].date = addDays(tomorrowEvents[3].date, 1);

// All events
const allEvents = [...scheduleItems, ...todayEvents, ...tomorrowEvents];

const getEventIcon = (type) => {
  switch (type) {
    case "workout":
      return <Dumbbell className="h-4 w-4 text-blue-500" />;
    case "wellness":
      return <Heart className="h-4 w-4 text-purple-500" />;
    case "work":
      return <Briefcase className="h-4 w-4 text-amber-500" />;
    case "personal":
      return <Coffee className="h-4 w-4 text-green-500" />;
    default:
      return <Tag className="h-4 w-4 text-gray-500" />;
  }
};

const getEventColor = (type) => {
  switch (type) {
    case "workout":
      return {
        bg: "bg-blue-500",
        text: "text-blue-500",
        light: "bg-blue-100 dark:bg-blue-900/30",
        border: "border-blue-200 dark:border-blue-800/30",
        gradient: "from-blue-500 to-indigo-600"
      };
    case "wellness":
      return {
        bg: "bg-purple-500",
        text: "text-purple-500",
        light: "bg-purple-100 dark:bg-purple-900/30",
        border: "border-purple-200 dark:border-purple-800/30",
        gradient: "from-purple-500 to-violet-600"
      };
    case "work":
      return {
        bg: "bg-amber-500",
        text: "text-amber-500",
        light: "bg-amber-100 dark:bg-amber-900/30",
        border: "border-amber-200 dark:border-amber-800/30",
        gradient: "from-amber-500 to-orange-600"
      };
    case "personal":
      return {
        bg: "bg-green-500",
        text: "text-green-500",
        light: "bg-green-100 dark:bg-green-900/30", 
        border: "border-green-200 dark:border-green-800/30",
        gradient: "from-green-500 to-emerald-600"
      };
    default:
      return {
        bg: "bg-gray-500",
        text: "text-gray-500",
        light: "bg-gray-100 dark:bg-gray-800/30",
        border: "border-gray-200 dark:border-gray-700/30",
        gradient: "from-gray-500 to-slate-600"
      };
  }
};

const ScheduleItem = ({ item }: { item: typeof scheduleItems[0] }) => {
  const eventColor = getEventColor(item.type);
  
  return (
    <motion.div 
      variants={itemVariants}
      className="group"
    >
      <div className="flex items-start p-4 rounded-xl hover:bg-muted/50 transition-all duration-300 border border-transparent hover:border-muted group-hover:shadow-sm">
      <div className="flex-shrink-0 w-16 text-center">
        <div className="text-sm font-medium">
          {format(item.date, "h:mm")}
            <span className="text-xs ml-1">{format(item.date, "a")}</span>
          </div>
        </div>
        <div className={`w-1.5 h-full min-h-[70px] rounded-full mx-4 bg-gradient-to-b ${eventColor.gradient}`} />
      <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium flex items-center gap-2">
                {getEventIcon(item.type)}
                {item.title}
                {item.recurring && (
                  <Badge variant="outline" className="text-[10px] h-4 px-1.5 ml-1 font-normal border-muted-foreground/30 text-muted-foreground">
                    {item.recurring}
                  </Badge>
                )}
              </h4>
              <div className="flex flex-wrap gap-3 mt-2">
                <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>{item.duration} min</span>
                </div>
                {item.location && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{item.location}</span>
                  </div>
                )}
              </div>
            </div>
            <Badge variant="outline" className={`${eventColor.light} ${eventColor.text} ${eventColor.border}`}>
              {item.type}
            </Badge>
          </div>
          
          {item.description && (
            <div className="mt-3 text-sm text-muted-foreground">
              <p className="line-clamp-2">{item.description}</p>
            </div>
          )}
          
          {item.participants.length > 0 && (
            <div className="mt-3 flex items-center">
              <Users className="h-3 w-3 text-muted-foreground mr-2" />
              <div className="flex -space-x-2">
                {item.participants.map((participant, idx) => (
                  <Avatar key={idx} className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-[10px] bg-muted">
                      {participant.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-2">
                {item.participants.length} {item.participants.length === 1 ? 'person' : 'people'}
              </span>
            </div>
          )}
          
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs">
              View Details <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              Edit
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DayEvents = ({ date }: { date: Date }) => {
  // Filter events for the selected date
  const events = allEvents.filter(item => 
    isSameDay(item.date, date)
  ).sort((a, b) => a.date.getTime() - b.date.getTime());
  
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <CalendarIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No Events</h3>
        <p className="text-muted-foreground max-w-sm">
          There are no events scheduled for {format(date, "MMMM d, yyyy")}. 
          Click the "Add Event" button to create a new event.
        </p>
        <Button className="mt-6 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
          <Plus className="h-4 w-4" /> Add Event
        </Button>
      </div>
    );
  }
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="divide-y"
    >
      {events.map((item) => (
        <ScheduleItem key={item.id} item={item} />
      ))}
    </motion.div>
  );
};

const WeekView = ({ date, events }: { date: Date; events: typeof allEvents }) => {
  const startDate = startOfWeek(date);
  const endDate = endOfWeek(date);
  const weekDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  return (
    <div className="space-y-4">
      <div className="flex border-b">
        {weekDays.map((day, index) => (
          <div key={index} className="flex-1 p-2 text-center">
            <div className={`text-xs font-medium mb-1 ${isToday(day) ? 'text-blue-600' : ''}`}>
              {format(day, "EEE")}
            </div>
            <div 
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center mx-auto",
                isToday(day) 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" 
                  : "hover:bg-muted cursor-pointer"
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-2">
        {weekDays.map((day, dayIndex) => {
          const dayEvents = events.filter(event => isSameDay(event.date, day));
          
          if (dayEvents.length === 0) {
            return (
              <div key={dayIndex} className="py-2">
                <div className="flex items-center mb-2">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 ${
                    isToday(day) ? 'bg-blue-100 text-blue-600' : 'bg-muted'
                  }`}>
                    {format(day, "d")}
                  </div>
                  <h3 className={`text-sm font-medium ${isToday(day) ? 'text-blue-600' : ''}`}>
                    {format(day, "EEEE, MMMM d")}
                  </h3>
                  {isToday(day) && (
                    <Badge className="ml-2 bg-blue-500/20 text-blue-700 dark:text-blue-400 border-0">Today</Badge>
                  )}
                </div>
                <div className="pl-8 pr-4 py-6 text-center text-muted-foreground text-sm">
                  No events
                </div>
              </div>
            );
          }
          
          return (
            <div key={dayIndex} className="py-2">
              <div className="flex items-center mb-2">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 ${
                  isToday(day) ? 'bg-blue-100 text-blue-600' : 'bg-muted'
                }`}>
                  {format(day, "d")}
                </div>
                <h3 className={`text-sm font-medium ${isToday(day) ? 'text-blue-600' : ''}`}>
                  {format(day, "EEEE, MMMM d")}
                </h3>
                {isToday(day) && (
                  <Badge className="ml-2 bg-blue-500/20 text-blue-700 dark:text-blue-400 border-0">Today</Badge>
                )}
              </div>
              <div className="pl-8 space-y-1">
                {dayEvents.map((event) => {
                  const eventColor = getEventColor(event.type);
                  return (
                    <div 
                      key={event.id}
                      className="flex items-center p-2 rounded-md hover:bg-muted/50 transition-all group"
                    >
                      <div className="w-12 text-xs text-muted-foreground">
                        {format(event.date, "h:mm a")}
                      </div>
                      <div className={`w-1 h-full min-h-[30px] rounded-full mx-2 bg-gradient-to-b ${eventColor.gradient}`} />
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="mr-2">
                          {getEventIcon(event.type)}
                        </div>
                        <div className="flex-1 truncate">
                          <p className="text-sm font-medium truncate">{event.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {event.location} · {event.duration} min
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ArrowUpRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MonthView = ({ date, events }: { date: Date; events: typeof allEvents }) => {
  return (
    <div className="pt-2">
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
          <div key={i} className="text-xs text-muted-foreground font-medium py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 h-[500px]">
        {Array.from({ length: 35 }).map((_, i) => {
          const cellDate = new Date(date.getFullYear(), date.getMonth(), i - date.getDay() + 1);
          const isCurrentMonth = cellDate.getMonth() === date.getMonth();
          const isSelected = isSameDay(cellDate, date);
          const isTodayDate = isToday(cellDate);
          const cellEvents = events.filter(event => isSameDay(event.date, cellDate));
          
          return (
            <div
              key={i}
              className={cn(
                "border rounded-md p-1 text-sm relative hover:bg-muted/50 transition-colors min-h-[85px]",
                !isCurrentMonth && "opacity-40",
                isSelected && "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50/60 dark:hover:bg-blue-950/30"
              )}
            >
              <div className="absolute top-1 right-1">
                <div className={cn(
                  "h-6 w-6 flex items-center justify-center text-xs rounded-full",
                  isTodayDate && "bg-blue-600 text-white",
                  isSelected && !isTodayDate && "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400"
                )}>
                  {cellDate.getDate()}
                </div>
              </div>
              
              <div className="pt-6 space-y-1 max-h-[55px] overflow-hidden">
                {cellEvents.slice(0, 3).map((event, eventIndex) => {
                  const eventColor = getEventColor(event.type);
                  return (
                    <div 
                      key={eventIndex} 
                      className={`text-[11px] px-1.5 py-1 rounded truncate flex items-center gap-1 ${eventColor.light} ${eventColor.text}`}
                    >
                      <div className={`w-1 h-2 rounded-full ${eventColor.bg}`}></div>
                      <span className="truncate">{event.title}</span>
                    </div>
                  );
                })}
                {cellEvents.length > 3 && (
                  <div className="text-[10px] text-muted-foreground text-center">
                    +{cellEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CalendarPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7)
  });
  const [view, setView] = useState("day");
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("filter-all");

  const filteredEvents = allEvents.filter(event => {
    // Apply date filter
    if (view === "day" && !isSameDay(event.date, date)) {
      return false;
    }
    
    // Apply type filter
    if (eventFilter !== "filter-all") {
      const filterType = eventFilter.replace("filter-", "");
      if (event.type !== filterType && filterType !== "all") {
        return false;
      }
    }
    
    // Apply search filter if there's a query
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const todayQuickView = allEvents.filter(event => isToday(event.date))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);
  
  const upcomingEvents = allEvents
    .filter(event => !isToday(event.date) && !isBefore(event.date, new Date()))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/10 rounded-2xl -z-10 blur-sm"></div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl border border-blue-100/50 dark:border-blue-800/20">
          <div className="space-y-1">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">
              <CalendarIcon className="h-4 w-4 mr-2" /> Schedule
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground">Manage your appointments and activities</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events..."
                className="pl-9 w-full sm:w-[200px] h-9 bg-card border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1 h-9 border-border bg-card">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span>Filter</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-52 p-2">
                <div className="grid gap-1">
                  <Button 
                    variant={eventFilter === "filter-all" ? "default" : "ghost"} 
                    size="sm" 
                    className="justify-start font-normal"
                    onClick={() => setEventFilter("filter-all")}
                  >
                    <span className="h-2 w-2 rounded-full bg-foreground mr-2" />
                    All Events
                  </Button>
                  <Button 
                    variant={eventFilter === "filter-workout" ? "default" : "ghost"} 
                    size="sm" 
                    className="justify-start font-normal"
                    onClick={() => setEventFilter("filter-workout")}
                  >
                    <span className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                    Workout
                  </Button>
                  <Button 
                    variant={eventFilter === "filter-wellness" ? "default" : "ghost"} 
                    size="sm" 
                    className="justify-start font-normal"
                    onClick={() => setEventFilter("filter-wellness")}
                  >
                    <span className="h-2 w-2 rounded-full bg-purple-500 mr-2" />
                    Wellness
                  </Button>
                  <Button 
                    variant={eventFilter === "filter-work" ? "default" : "ghost"} 
                    size="sm" 
                    className="justify-start font-normal"
                    onClick={() => setEventFilter("filter-work")}
                  >
                    <span className="h-2 w-2 rounded-full bg-amber-500 mr-2" />
                    Work
                  </Button>
                  <Button 
                    variant={eventFilter === "filter-personal" ? "default" : "ghost"} 
                    size="sm" 
                    className="justify-start font-normal"
                    onClick={() => setEventFilter("filter-personal")}
                  >
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                    Personal
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
              <Plus className="h-4 w-4" /> Add Event
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4" />
            <span>Date Range</span>
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal w-[260px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                classNames={{
                  day_selected: "bg-gradient-to-r from-blue-600 to-indigo-600 text-primary-foreground",
                  day_today: "bg-muted text-accent-foreground",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 lg:grid-cols-[350px_1fr]"
      >
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="border border-muted/50 overflow-hidden hover:shadow-md transition-all duration-300">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                  <CalendarIcon className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                Date Selection
              </CardTitle>
              <CardDescription>Choose a date to view or add events</CardDescription>
          </CardHeader>
            <CardContent className="p-4">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              className="rounded-md border"
                classNames={{
                  day_selected: "bg-gradient-to-br from-blue-600 to-indigo-600 text-primary-foreground hover:bg-blue-600 hover:text-primary-foreground focus:bg-blue-600 focus:text-primary-foreground",
                  day_today: "bg-muted text-accent-foreground",
                }}
                components={{
                  DayContent: (props) => {
                    // Check if this date has events
                    const hasEvents = allEvents.some(event => 
                      isSameDay(event.date, props.date)
                    );
                    
                    return (
                      <div className="relative flex items-center justify-center">
                        <div>{props.date.getDate()}</div>
                        {hasEvents && (
                          <div className="absolute bottom-0 h-1 w-1 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    );
                  }
                }}
              />
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">Today's Events</h3>
                  {todayQuickView.length > 0 && (
                    <Button variant="link" size="sm" className="h-6 p-0">
                      View All
                    </Button>
                  )}
                </div>
                
                {todayQuickView.length > 0 ? (
                  <div className="space-y-2">
                    {todayQuickView.map((event) => {
                      const eventColor = getEventColor(event.type);
                      return (
                        <div 
                          key={event.id} 
                          className="flex items-center p-2 rounded-lg border border-transparent hover:border-muted hover:bg-muted/50 transition-all"
                        >
                          <div className={`h-10 w-1 rounded-full mr-3 bg-gradient-to-b ${eventColor.gradient}`} />
                          <div>
                            <p className="text-sm font-medium flex items-center">
                              {getEventIcon(event.type)}
                              <span className="ml-2">{event.title}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">{format(event.date, "h:mm a")}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 px-2">
                    <p className="text-sm text-muted-foreground">No events scheduled for today</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="h-3 w-3 mr-1" /> Add Event
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">Upcoming</h3>
                  {upcomingEvents.length > 0 && (
                    <Button variant="link" size="sm" className="h-6 p-0">
                      View All
                    </Button>
                  )}
                </div>
                
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-2">
                    {upcomingEvents.map((event) => {
                      const eventColor = getEventColor(event.type);
                      return (
                        <div 
                          key={event.id} 
                          className="flex items-center p-2 rounded-lg border border-transparent hover:border-muted hover:bg-muted/50 transition-all"
                        >
                          <div className={`h-10 w-1 rounded-full mr-3 bg-gradient-to-b ${eventColor.gradient}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{event.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(event.date, "EEE, MMM d")} · {format(event.date, "h:mm a")}
                            </p>
                          </div>
                          <Badge variant="outline" className={`${eventColor.light} ${eventColor.text} ml-2`}>
                            {event.type}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 px-2">
                    <p className="text-sm text-muted-foreground">No upcoming events</p>
                  </div>
                )}
              </div>
          </CardContent>
        </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="border border-muted/50 overflow-hidden hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b bg-muted/20">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-indigo-500/20 to-blue-500/20 flex items-center justify-center">
                    <Clock className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  Schedule for {format(date, "EEEE, MMMM d, yyyy")}
                </CardTitle>
                <CardDescription>View and manage your appointments</CardDescription>
              </div>
            <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setDate(subDays(date, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 rounded-full"
                  onClick={() => setDate(new Date())}
                >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Today
              </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setDate(addDays(date, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
                <div className="ml-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full relative group">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-background"></span>
                    <span className="sr-only">Notifications</span>
                  </Button>
                </div>
            </div>
          </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="day" className="w-full" onValueChange={setView}>
                <div className="px-6 pt-4 border-b">
                  <TabsList className="w-full md:w-auto mb-0 bg-muted/50">
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
                </div>
              
                <TabsContent value="day" className="p-0 pt-6">
                  <div className="px-6">
                    <DayEvents date={date} />
                </div>
              </TabsContent>
              
                <TabsContent value="week" className="pt-6">
                  <div className="px-6">
                    <WeekView date={date} events={filteredEvents} />
                </div>
              </TabsContent>
              
                <TabsContent value="month" className="pt-6">
                  <div className="px-6">
                    <MonthView date={date} events={filteredEvents} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CalendarPage;
