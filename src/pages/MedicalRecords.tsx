import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaFileAlt, FaFileUpload, FaFileDownload, FaShareAlt, FaSearch, 
  FaEllipsisV, FaFilePdf, FaFileImage, FaFileCsv, FaLock, FaEye, 
  FaCalendarAlt, FaHospital, FaUser, FaStethoscope, FaDownload,
  FaFilter, FaSort, FaCheckCircle, FaTimes, FaPlus, FaCloudUploadAlt,
  FaShieldAlt, FaInfoCircle, FaExternalLinkAlt, FaSyncAlt
} from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

// Mock data generator
const generateMedicalRecords = () => {
  const recordTypes = ['Lab Result', 'Prescription', 'Doctor Note', 'Imaging', 'Vaccination', 'Discharge Summary'];
  const providers = ['City Hospital', 'Wellness Clinic', 'Primary Care Associates', 'University Medical Center', 'Family Health Partners'];
  const doctors = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis', 'Dr. Miller'];
  const fileTypes = ['pdf', 'csv', 'jpg', 'doc'];
  
  return Array(15).fill(0).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 180)); // Random date within last 6 months
    
    const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    const recordType = recordTypes[Math.floor(Math.random() * recordTypes.length)];
    const provider = providers[Math.floor(Math.random() * providers.length)];
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    
    return {
      id: `med-${i + 1}`,
      title: `${recordType} - ${date.toLocaleDateString()}`,
      date: date,
      provider: provider,
      doctor: doctor,
      type: recordType,
      fileType: fileType,
      fileSize: Math.floor(Math.random() * 10000) + 200,
      shared: Math.random() > 0.7,
      flagged: Math.random() > 0.8,
      notes: Math.random() > 0.6 ? "Important medical information included" : null
    };
  }).sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by date (newest first)
};

const MedicalRecords = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isUploading, setIsUploading] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<any>(null);
  
  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => {
      setRecords(generateMedicalRecords());
    }, 800);
  }, []);
  
  const filteredRecords = records
    .filter(record => 
      (filter === "all" || record.type === filter) &&
      (searchQuery === "" || 
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.type.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "date") {
        comparison = a.date.getTime() - b.date.getTime();
      } else if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === "provider") {
        comparison = a.provider.localeCompare(b.provider);
      } else if (sortBy === "type") {
        comparison = a.type.localeCompare(b.type);
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
  
  const handleUpload = () => {
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newRecord = {
        id: `med-${records.length + 1}`,
        title: `New Upload - ${new Date().toLocaleDateString()}`,
        date: new Date(),
        provider: "Self Upload",
        doctor: "N/A",
        type: "Lab Result",
        fileType: "pdf",
        fileSize: 1458,
        shared: false,
        flagged: false,
        notes: null
      };
      
      setRecords([newRecord, ...records]);
      setIsUploading(false);
    }, 2000);
  };
  
  const toggleRecordSelection = (id: string) => {
    if (selectedRecords.includes(id)) {
      setSelectedRecords(selectedRecords.filter(recordId => recordId !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  };
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };
  
  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return null;
    
    return (
      <span className="ml-1 text-foreground/50">
        {sortOrder === "asc" ? "↑" : "↓"}
      </span>
    );
  };
  
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      case 'jpg':
        return <FaFileImage className="text-blue-500" />;
      case 'csv':
        return <FaFileCsv className="text-green-500" />;
      default:
        return <FaFileAlt className="text-muted-foreground" />;
    }
  };
  
  const recordTypeFilters = ["all", ...Array.from(new Set(records.map(r => r.type)))];
  
  return (
    <motion.div 
      className="container mx-auto py-8 px-4 max-w-7xl space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with Gradient Background */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 dark:from-blue-950/30 dark:to-indigo-950/30 backdrop-blur-sm"></div>
        <div className="relative p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium">
                <FaShieldAlt className="h-4 w-4 mr-2" /> HIPAA Compliant
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
              <p className="text-muted-foreground max-w-2xl">
                Securely access, manage, and share your medical history, test results, and health documents in one place.
        </p>
      </div>
      
            <div className="flex flex-wrap gap-3">
              <Button
            onClick={handleUpload}
            disabled={isUploading}
                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                {isUploading ? <FaSyncAlt className="animate-spin" /> : <FaCloudUploadAlt />}
                <span>{isUploading ? 'Uploading...' : 'Upload Record'}</span>
              </Button>
              
              <Button variant="outline" className="gap-2">
                <FaPlus className="h-4 w-4" />
                <span>Add Manual Entry</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Advanced search and filter section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="lg:col-span-2">
          <div className="relative flex">
            <Input
              type="text"
              placeholder="Search records by title, provider, doctor..."
              className="pl-10 pr-4 py-2 rounded-l-lg border-r-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              className="rounded-l-none bg-blue-600 text-white hover:bg-blue-700"
            >
              <FaSearch className="h-4 w-4" />
            </Button>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none">
              <FaSearch className="h-4 w-4" />
                        </div>
                          </div>
                        </div>
        
        <Select
          value={filter}
          onValueChange={setFilter}
        >
          <SelectTrigger className="w-full">
            <div className="flex items-center gap-2">
              <FaFilter className="h-4 w-4 text-muted-foreground" />
              <span>{filter === "all" ? "All Record Types" : filter}</span>
                      </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Record Types</SelectItem>
            {recordTypeFilters.filter(t => t !== "all").map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value);
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          }}
        >
          <SelectTrigger className="w-full">
            <div className="flex items-center gap-2">
              <FaSort className="h-4 w-4 text-muted-foreground" />
              <span>Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)} {sortOrder === "asc" ? "↑" : "↓"}</span>
                      </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="provider">Provider</SelectItem>
            <SelectItem value="type">Type</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          className={`${selectedRecords.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={selectedRecords.length === 0}
          onClick={() => setIsShareModalOpen(true)}
        >
          <FaShareAlt className="mr-2 h-4 w-4" />
          Share Selected
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className={`${selectedRecords.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={selectedRecords.length === 0}
        >
          <FaDownload className="mr-2 h-4 w-4" />
          Download Selected
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <FaFilter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <h4 className="font-medium">Filter Records</h4>
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Date Range</h5>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Last 30 days</Button>
                  <Button variant="outline" size="sm" className="flex-1">Last 90 days</Button>
                  <Button variant="outline" size="sm" className="flex-1">Last year</Button>
                </div>
                      </div>
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Provider</h5>
                <div className="space-y-1">
                  {['City Hospital', 'Wellness Clinic', 'Primary Care Associates'].map(provider => (
                    <div key={provider} className="flex items-center">
                      <input type="checkbox" id={provider} className="mr-2 accent-blue-500" />
                      <label htmlFor={provider} className="text-sm">{provider}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <Button variant="ghost" size="sm">Reset</Button>
                <Button size="sm">Apply Filters</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="ml-auto">
          <Tabs defaultValue="list" className="w-[160px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="grid">Grid</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
              </div>
              
      {/* Records list - rendered in TabsContent later */}
      
      {/* Share Modal - implement later */}
      
      {/* View Record Modal - implement later */}
    </motion.div>
  );
};

export default MedicalRecords; 