import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Star, Book, Clock, MessageCircle, TrendingUp, Filter, ArrowUpRight, CheckCircle, AlertCircle, Sparkles, MoreHorizontal, ChevronDown, Bookmark, Code, UserCircle, Bot, Zap, Timer, User, Eye, ChevronRight, Play } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import Header from "../header/Header"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useSubmitDoubt } from "@/hooks/useSubmitDoubt"
import { useFetchDoubts } from "@/hooks/useFetchDoubts"
import { useUserDoubts } from "@/hooks/useUserDoubts"
import logo from "../../../img/niqSolve4-removebg.png"
import { Pencil } from "lucide-react"

function formatRelativeTime(dateString) {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) {
    return date.toLocaleDateString();
  } else if (diffDays > 1) {
    return `${diffDays} days ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffHours > 1) {
    return `${diffHours} hours ago`;
  } else if (diffMinutes > 1) {
    return `${diffMinutes} minutes ago`;
  } else {
    return "Just now";
  }
}

// Enhanced function to get urgency level and color
function getUrgencyInfo(dateString, status) {
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (status !== "PENDING") return { level: "resolved", color: "text-green-400", text: "Resolved" };
  
  if (diffHours < 2) return { level: "new", color: "text-blue-400", text: "Just posted" };
  if (diffHours < 24) return { level: "recent", color: "text-yellow-400", text: `${diffHours}h pending` };
  if (diffHours < 72) return { level: "urgent", color: "text-orange-400", text: `${Math.floor(diffHours/24)}d pending` };
  return { level: "critical", color: "text-red-400", text: "Needs attention" };
}

// Language/Technology icon mapping
const getTechIcon = (category) => {
  const icons = {
    "JavaScript": "🟨",
    "Python": "🐍", 
    "Java": "☕",
    "C++": "⚡",
    "React": "⚛️",
    "Node.js": "🟢",
    "Algorithms": "🧮",
    "Data Structures": "📊",
    "Database": "🗄️",
    "Web Development": "🌐",
    "AI": "🤖"
  };
  return icons[category] || "💻";
}

const EnhancedDoubtPage = () => {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedDate, setSelectedDate] = useState("All")
  const [ratingFilter, setRatingFilter] = useState([0, 5])
  const [expertiseFilter, setExpertiseFilter] = useState([])
  const [previewMode, setPreviewMode] = useState(false)
  const [title, setTitle] = useState("")
  const [categories, setCategories] = useState([])
  const [description, setDescription] = useState("")
  const [codeSnippet, setCodeSnippet] = useState("")
  const [selectedDoubt, setSelectedDoubt] = useState(null)
  const [isAskModalOpen, setIsAskModalOpen] = useState(false)
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    category: "",
    description: "",
    code: "",
    tags: []
  })
  const [formErrors, setFormErrors] = useState({})
  const [recentActivities, setRecentActivities] = useState([])
  const { submitDoubt, isSubmitting, isSuccess } = useSubmitDoubt()
  const { doubtsData, isLoading, isError, error, refetch } = useFetchDoubts()

  // Function to add a new activity
  const addActivity = useCallback((type, title = "", detail = "") => {
    const newActivity = {
      id: Date.now(),
      type,
      title,
      detail,
      timestamp: new Date(),
    }
    setRecentActivities(prev => [newActivity, ...prev.slice(0, 9)]) // Keep only 10 most recent activities
  }, [])

  useEffect(() => {
    // Clear form and close modal when submission is successful
    if (isSuccess) {
      // Add activity for successful submission
      addActivity(
        "question_asked", 
        newQuestion.title,
        `You submitted a new question in ${newQuestion.category}`
      )
      
      setNewQuestion({
        title: "",
        category: "",
        description: "",
        code: "",
        tags: []
      })
      setFormErrors({})
      setIsAskModalOpen(false)
      
      // Manually refetch the doubts after successful submission
      refetch()
    }
  }, [isSuccess, refetch, addActivity, newQuestion.title, newQuestion.category])

  // Load recent activities from localStorage on initial load
  useEffect(() => {
    const savedActivities = localStorage.getItem('recentActivities')
    if (savedActivities) {
      try {
        setRecentActivities(JSON.parse(savedActivities))
      } catch (e) {
        console.error('Failed to parse saved activities:', e)
      }
    }
  }, [])
  
  // Save activities to localStorage when they change
  useEffect(() => {
    if (recentActivities.length > 0) {
      localStorage.setItem('recentActivities', JSON.stringify(recentActivities))
    }
  }, [recentActivities])

  const togglePreview = () => {
    setPreviewMode(!previewMode)
  }

  // Enhanced filtering with multiple criteria
  const filteredDoubts = doubtsData.filter((doubt) => {
    const matchesSearch = (doubt.title?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
                         (doubt.description?.toLowerCase() ?? '').includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || doubt.category === selectedCategory || doubt.topic === selectedCategory;
    
    // Enhanced status filtering - need to calculate status for each doubt to filter properly
    let doubtStatus = "Pending";
    if (selectedStatus !== "All") {
      // Replicate the status logic for filtering
      const doubtId = doubt.id || doubt.title || "default";
      let hash = 0;
      for (let i = 0; i < doubtId.toString().length; i++) {
        const char = doubtId.toString().charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      const hashCode = Math.abs(hash);
      const isAssigned = (doubt.isSolved || "PENDING") === "PENDING" && (hashCode % 100) < 50;
      const isSaved = (hashCode % 100) < 20;
      const safeStatus = doubt.isSolved || "PENDING";
      
      if (safeStatus !== "PENDING" && safeStatus !== "IN_PROGRESS") {
        doubtStatus = "Resolved";
      } else if (safeStatus === "IN_PROGRESS" || isAssigned) {
        doubtStatus = "In Progress";
      } else if (doubt.isSaved || doubt.bookmarked || isSaved) {
        doubtStatus = "Saved";
      } else if (safeStatus === "PENDING") {
        const timeVariant = hashCode % 4;
        if (timeVariant === 0) doubtStatus = "Pending";
        else if (timeVariant === 1) doubtStatus = "Under Review";
        else if (timeVariant === 2) doubtStatus = "Needs Attention";
        else doubtStatus = "Recently Posted";
      }
    }
    
    const matchesStatus = selectedStatus === "All" || selectedStatus === doubtStatus;
                         
    const matchesLanguage = selectedLanguage === "All Languages" || doubt.language === selectedLanguage || doubt.category === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesLanguage;
  });

  // Enhanced sorting
  const sortedDoubts = [...filteredDoubts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.timeSubmitted || 0) - new Date(a.timeSubmitted || 0);
      case "oldest":
        return new Date(a.timeSubmitted || 0) - new Date(b.timeSubmitted || 0);
      case "most_engaged":
        return (b.replies?.length || 0) - (a.replies?.length || 0);
      case "urgent":
        const aHours = Math.floor((new Date() - new Date(a.timeSubmitted)) / (1000 * 60 * 60));
        const bHours = Math.floor((new Date() - new Date(b.timeSubmitted)) / (1000 * 60 * 60));
        return bHours - aHours; // Oldest pending first for urgency
      default:
        return 0;
    }
  });

  const categoriesList = ["All Categories", "Algorithms", "JavaScript", "React", "Data Structures", "Dynamic Programming", "Complexity Analysis", "Sorting", "Web Development", "System Design", "Database"]
  const languagesList = ["All Languages", "JavaScript", "Python", "Java", "C++", "React", "Node.js"]
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "most_engaged", label: "Most Engaged" },
    { value: "urgent", label: "Most Urgent" }
  ]

  const handleAskQuestion = () => {
    // Validate form
    const errors = {}
    if (!newQuestion.title.trim()) errors.title = "Question title is required"
    if (!newQuestion.category) errors.category = "Please select a category"
    if (!newQuestion.description.trim()) errors.description = "Question description is required"
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    // Prepare the doubt data
    const doubtData = {
      title: newQuestion.title.trim(),
      category: newQuestion.category,
      description: newQuestion.description.trim(),
      code: newQuestion.code.trim() || null,
      tags: newQuestion.tags
    }
    
    // Submit the doubt to the API
    submitDoubt(doubtData)
  }

  // Handle category filter from sidebar
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    addActivity("filter_applied", "Category Filter", `Filtered by ${category}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D1117] via-[#111827] to-[#0D1117] text-[#E5E7EB] pb-16 relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/4 bg-gradient-to-b from-[#0070F3]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-gradient-to-t from-[#8884d8]/5 to-transparent rounded-full blur-[150px] pointer-events-none" />
      
      <Header />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-20 md:pt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-3 md:gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#E5E7EB] flex items-center">
              <span className="mr-2 md:mr-3 text-3xl md:text-4xl">🚀</span>
              Coding Doubts
            </h1>
            <p className="text-sm md:text-base text-[#A1A1AA] mt-1">Get instant AI insights + expert guidance</p>
          </div>
          
          <Button 
            className="bg-gradient-to-r from-[#0070F3] to-[#3b82f6] hover:opacity-90 hover:scale-105 text-white shadow-md shadow-[#0070F3]/20 flex items-center transition-all duration-200 w-full md:w-auto text-sm md:text-base"
            onClick={() => setIsAskModalOpen(true)}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Ask a Question
          </Button>
        </div>

        {/* Enhanced Search and filter bar - Mobile Optimized */}
        <Card className="bg-gradient-to-r from-[#161B22] to-[#1A2233] border-[#30363D] text-[#E5E7EB] mb-4 md:mb-6 shadow-lg overflow-hidden">
          <CardContent className="p-3 md:p-6">
            <div className="flex flex-col gap-3 md:gap-4">
              {/* Search Bar - Mobile Optimized */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A1A1AA] w-4 h-4 md:w-5 md:h-5" />
                <Input
                  placeholder="Search doubts..." 
                  className="pl-10 bg-[#0D1117] border-[#30363D] text-[#E5E7EB] w-full focus:ring-[#0070F3] focus:border-[#0070F3] h-10 md:h-12 text-sm md:text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Active Filters Indicator - Mobile Optimized */}
              {(selectedStatus !== "All" || selectedLanguage !== "All Languages" || sortBy !== "newest") && (
                <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[#30363D]/30">
                  <span className="text-xs text-[#A1A1AA] font-medium">Filters:</span>
                  {selectedStatus !== "All" && (
                    <Badge className="bg-[#0070F3]/10 text-[#0070F3] border-[#0070F3]/30 text-xs">
                      {selectedStatus}
                    </Badge>
                  )}
                  {selectedLanguage !== "All Languages" && (
                    <Badge className="bg-[#0070F3]/10 text-[#0070F3] border-[#0070F3]/30 text-xs">
                      {selectedLanguage}
                    </Badge>
                  )}
                  {sortBy !== "newest" && (
                    <Badge className="bg-[#0070F3]/10 text-[#0070F3] border-[#0070F3]/30 text-xs">
                      {sortOptions.find(s => s.value === sortBy)?.label}
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs text-[#A1A1AA] hover:text-[#E5E7EB]"
                    onClick={() => {
                      setSelectedStatus("All");
                      setSelectedLanguage("All Languages");
                      setSortBy("newest");
                    }}
                  >
                    Clear
                  </Button>
                </div>
              )}
              
              {/* Enhanced Filters - Mobile Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                {/* Status Filter - Mobile Optimized */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={`border-[#30363D] text-[#E5E7EB] hover:bg-[#30363D]/30 transition-colors w-full text-sm md:text-base h-9 md:h-10 ${
                        selectedStatus !== "All" 
                          ? "bg-[#0070F3]/10 border-[#0070F3]/30 text-[#0070F3]" 
                          : "bg-[#0D1117]"
                      }`}
                    >
                      <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      <span className="hidden md:inline">Status: </span>{selectedStatus}
                      <ChevronDown className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB]">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#30363D]" />
                    <DropdownMenuItem onClick={() => setSelectedStatus("All")}>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-[#A1A1AA] mr-2"></div>
                        All Statuses
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus("Pending")}>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-amber-400 mr-2"></div>
                        Pending
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus("In Progress")}>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                        In Progress
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus("Under Review")}>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        Under Review
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus("Recently Posted")}>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                        Recently Posted
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus("Saved")}>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                        Saved
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus("Needs Attention")}>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                        Needs Attention
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus("Solved")}>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                        Solved
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Language Filter - Mobile Optimized */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={`border-[#30363D] text-[#E5E7EB] hover:bg-[#30363D]/30 transition-colors w-full text-sm md:text-base h-9 md:h-10 ${
                        selectedLanguage !== "All Languages" 
                          ? "bg-[#0070F3]/10 border-[#0070F3]/30 text-[#0070F3]" 
                          : "bg-[#0D1117]"
                      }`}
                    >
                      <Code className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      {selectedLanguage === "All Languages" ? "Language" : selectedLanguage}
                      <ChevronDown className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB]">
                    <DropdownMenuLabel>Filter by Language</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#30363D]" />
                    {languagesList.map((language) => (
                      <DropdownMenuItem key={language} onClick={() => setSelectedLanguage(language)}>
                        <span className="mr-2">{getTechIcon(language)}</span>
                        {language}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort Options - Mobile Optimized */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={`border-[#30363D] text-[#E5E7EB] hover:bg-[#30363D]/30 transition-colors w-full text-sm md:text-base h-9 md:h-10 ${
                        sortBy !== "newest" 
                          ? "bg-[#0070F3]/10 border-[#0070F3]/30 text-[#0070F3]" 
                          : "bg-[#0D1117]"
                      }`}
                    >
                      <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      <span className="hidden md:inline">Sort: </span>{sortOptions.find(s => s.value === sortBy)?.label}
                      <ChevronDown className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB]">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#30363D]" />
                    {sortOptions.map((option) => (
                      <DropdownMenuItem key={option.value} onClick={() => setSortBy(option.value)}>
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main content - Mobile Optimized Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Left panel - Enhanced Doubts list */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#161B22] to-[#1A2233] border border-[#30363D] rounded-lg shadow-lg p-3 md:p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-2 md:gap-0">
                <h2 className="text-lg md:text-xl font-semibold text-[#E5E7EB] flex items-center">
                  <span className="mr-2 md:mr-3 bg-gradient-to-r from-[#0070F3] to-[#3b82f6] h-5 md:h-6 w-1 md:w-1.5 rounded-full"></span>
                  Coding Doubts
                </h2>
                <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
                  <Badge className="bg-[#0070F3]/10 text-[#0070F3] border border-[#0070F3]/30 px-2 md:px-3 py-1 text-xs flex-1 md:flex-none text-center">
                    {sortedDoubts.length} of {doubtsData.length} results
                  </Badge>
                </div>
              </div>
              
              {/* Enhanced scrollable container with better spacing - Mobile Optimized */}
              <div className="max-h-[600px] md:max-h-[700px] overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
                {isLoading ? (
                  // Enhanced skeleton loaders
                  <div className="space-y-6">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-[#0D1117] rounded-xl p-6 border border-[#30363D]">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                              <div className="h-4 bg-[#30363D] rounded w-6 mr-3"></div>
                              <div className="h-5 bg-[#30363D] rounded w-48"></div>
                            </div>
                            <div className="h-4 bg-[#30363D] rounded w-20"></div>
                          </div>
                          <div className="h-3 bg-[#30363D] rounded w-32 mb-4"></div>
                          <div className="h-16 bg-[#30363D] rounded mb-4"></div>
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                              <div className="h-6 bg-[#30363D] rounded w-16"></div>
                              <div className="h-6 bg-[#30363D] rounded w-20"></div>
                            </div>
                            <div className="h-6 bg-[#30363D] rounded w-24"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : isError ? (
                  // Enhanced error state
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#FF4D4F]/20 to-[#FF4D4F]/5 flex items-center justify-center mb-6 border border-[#FF4D4F]/30">
                      <AlertCircle className="w-10 h-10 text-[#FF4D4F]" />
                    </div>
                    <h3 className="text-xl font-medium text-[#E5E7EB] mb-2">Error fetching doubts</h3>
                    <p className="text-[#A1A1AA] mb-6 max-w-md mx-auto">{error?.message || "An unexpected error occurred while loading your doubts."}</p>
                    <Button onClick={() => refetch()} className="bg-[#0070F3] hover:bg-[#0070F3]/90">
                      Try Again
                    </Button>
                  </div>
                ) : sortedDoubts.length > 0 ? (
                  <div className="space-y-4 md:space-y-6">
                    <AnimatePresence>
                      {sortedDoubts.map((doubt) => (
                        <motion.div
                          key={doubt.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          layout
                        >
                          <EnhancedDoubtCard doubt={doubt} onAddActivity={addActivity} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  // Enhanced empty state
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#0070F3]/20 to-[#0070F3]/5 flex items-center justify-center mb-6 border border-[#0070F3]/30">
                      <MessageCircle className="w-10 h-10 text-[#0070F3]" />
                    </div>
                    <h3 className="text-xl font-medium text-[#E5E7EB] mb-2">No doubts found</h3>
                    <p className="text-[#A1A1AA] mb-6 max-w-md mx-auto">Try adjusting your filters or search terms, or ask your first question to get started.</p>
                    <Button 
                      className="bg-gradient-to-r from-[#0070F3] to-[#3b82f6] hover:opacity-90 text-white"
                      onClick={() => setIsAskModalOpen(true)}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Ask Your First Question
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right panel - Enhanced Stats - Mobile Optimized */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <EnhancedDoubtsStats 
              doubtsData={doubtsData} 
              isLoading={isLoading} 
              recentActivities={recentActivities}
              onCategoryFilter={handleCategoryFilter}
            />
          </div>
        </div>
      </div>

      <Dialog open={isAskModalOpen} onOpenChange={setIsAskModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#161B22] to-[#1A2233] border-[#30363D] text-[#E5E7EB]">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl font-semibold flex items-center">
              <span className="mr-2 md:mr-3 bg-gradient-to-r from-[#0070F3] to-[#3b82f6] h-5 md:h-6 w-1 md:w-1.5 rounded-full"></span>
              Ask a Question
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base text-[#A1A1AA]">
              Provide details about your coding question to get instant AI insights + expert answers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#E5E7EB]">Question Title</Label>
              <Input 
                id="title"
                className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:border-[#0070F3] focus:ring-[#0070F3]/10"
                placeholder="e.g., How to optimize quicksort algorithm?"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
              />
              {formErrors.title && (
                <p className="text-[#FF4D4F] text-xs flex items-center mt-1">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {formErrors.title}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-[#E5E7EB]">Category</Label>
              <Select 
                value={newQuestion.category}
                onValueChange={(value) => setNewQuestion({...newQuestion, category: value})}
              >
                <SelectTrigger id="category" className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB]">
                  {categoriesList.filter(cat => cat !== "All Categories").map((category) => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center">
                        <span className="mr-2">{getTechIcon(category)}</span>
                        {category}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.category && (
                <p className="text-[#FF4D4F] text-xs flex items-center mt-1">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {formErrors.category}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#E5E7EB]">Description</Label>
              <Textarea 
                id="description"
                className="min-h-32 bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:border-[#0070F3] focus:ring-[#0070F3]/10 resize-none"
                placeholder="Describe your problem in detail. What have you tried so far? What errors are you getting?"
                value={newQuestion.description}
                onChange={(e) => setNewQuestion({...newQuestion, description: e.target.value})}
              />
              {formErrors.description && (
                <p className="text-[#FF4D4F] text-xs flex items-center mt-1">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {formErrors.description}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="code" className="text-[#E5E7EB] flex items-center">
                <Code className="w-4 h-4 mr-1" />
                Code Snippet (Optional)
              </Label>
              <Textarea 
                id="code"
                className="min-h-32 bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:border-[#0070F3] focus:ring-[#0070F3]/10 font-mono text-sm resize-none"
                placeholder="// Paste your code here"
                value={newQuestion.code}
                onChange={(e) => setNewQuestion({...newQuestion, code: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[#E5E7EB]">Tags (Select up to 3)</Label>
              <div className="flex flex-wrap gap-2">
                {["Arrays", "Algorithms", "Sorting", "DP", "Graphs", "Trees", "JavaScript", "React", "Python", "Java", "C++"].map((tag) => (
                  <Badge 
                    key={tag}
                    variant="outline"
                    className={`cursor-pointer transition-all duration-200 ${
                      newQuestion.tags.includes(tag) 
                        ? "bg-[#0070F3]/20 text-[#0070F3] border-[#0070F3]/30 scale-105" 
                        : "bg-[#0D1117] text-[#A1A1AA] border-[#30363D] hover:bg-[#30363D]/30 hover:scale-105"
                    }`}
                    onClick={() => {
                      if (newQuestion.tags.includes(tag)) {
                        setNewQuestion({
                          ...newQuestion, 
                          tags: newQuestion.tags.filter(t => t !== tag)
                        })
                      } else if (newQuestion.tags.length < 3) {
                        setNewQuestion({
                          ...newQuestion, 
                          tags: [...newQuestion.tags, tag]
                        })
                      }
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0 pt-4 border-t border-[#30363D]/50">
            <div className="text-xs text-[#A1A1AA] flex items-center order-2 md:order-1">
              <Bot className="w-3 h-3 mr-1" />
              <span className="hidden md:inline">AI will analyze your question instantly upon submission</span>
              <span className="md:hidden">AI analysis on submission</span>
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto order-1 md:order-2">
              <Button 
                variant="outline" 
                className="border-[#30363D] text-[#E5E7EB] hover:bg-[#30363D]/30 w-full md:w-auto"
                onClick={() => setIsAskModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                className="bg-gradient-to-r from-[#0070F3] to-[#3b82f6] hover:opacity-90 w-full md:w-auto"
                onClick={handleAskQuestion}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Submit Question
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced scrollbar styles and utilities */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, #0D1117, #161B22);
          border-radius: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #30363D, #21262D);
          border-radius: 8px;
          border: 1px solid #161B22;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0070F3, #3b82f6);
        }

        /* Line clamp utilities for text truncation */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Enhanced hover effects */
        .group:hover .group-hover\\:scale-105 {
          transform: scale(1.05);
        }

        .group:hover .group-hover\\:text-primary {
          color: #0070F3;
        }

        /* Smooth transitions for all interactive elements */
        * {
          transition-property: color, background-color, border-color, transform, box-shadow, opacity;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 200ms;
        }
      `}</style>
    </div>
  )
}

function EnhancedDoubtCard({ doubt, onAddActivity }) {
  // Adjust to match the actual API response structure
  const safeTags = Array.isArray(doubt.tagsList) ? doubt.tagsList : [];
  const safeDate = doubt.timeSubmitted ? new Date(doubt.timeSubmitted) : new Date();
  
  // Clean and format description - remove raw JSON and make readable
  let safeDescription = doubt.description || doubt.fullContent || "No description provided.";
  
  // Clean up any JSON-like content or malformed text
  if (safeDescription.includes('doubt.setStudent') || safeDescription.includes('"title":')) {
    // This looks like debugging/JSON content, replace with clean description
    safeDescription = "Code implementation question - click to view details";
  }
  
  // Ensure description is clean and readable
  safeDescription = safeDescription.replace(/[{}"\[\]]/g, '').trim();
  
  const safeCodeSnippet = doubt.codeSnippet || null;
  const safeTitle = doubt.title || "Untitled Doubt";
  const safeTopic = doubt.topic || doubt.category || "Uncategorized";
  const safeStatus = doubt.isSolved || "PENDING";
  
  // Get urgency info
  const urgencyInfo = getUrgencyInfo(safeDate, safeStatus);
  
  // Get tech icon
  const techIcon = getTechIcon(safeTopic);
  
  // Generate consistent data based on doubt ID to avoid changes on re-render
  const doubtId = doubt.id || doubt.title || "default";
  const hashCode = React.useMemo(() => {
    let hash = 0;
    for (let i = 0; i < doubtId.toString().length; i++) {
      const char = doubtId.toString().charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }, [doubtId]);

  // Consistent AI suggestions and teacher assignment based on doubt ID
  const hasAISuggestions = (hashCode % 100) < 60; // 60% chance, but consistent
  const aiSuggestionCount = (hashCode % 3) + 1;
  const isAssignedToTeacher = safeStatus === "PENDING" && (hashCode % 100) < 50; // 50% chance for more visibility
  const assignedTeacher = React.useMemo(() => {
    if (!isAssignedToTeacher) return null;
    
    const teachers = ["Dr. Smith", "Prof. Johnson", "Ms. Chen"];
    const teacherIndex = hashCode % teachers.length;
    
    return {
      name: teachers[teacherIndex],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${doubtId}`
    };
  }, [isAssignedToTeacher, hashCode, doubtId]);

  // Enhanced status logic with multiple workflow states - moved after isAssignedToTeacher
  const enhancedStatus = React.useMemo(() => {
    // Mock some saved doubts based on hash for variety
    const isSaved = (hashCode % 100) < 20; // 20% chance to be saved
    
    // Check for resolved status first
    if (safeStatus !== "PENDING" && safeStatus !== "IN_PROGRESS") {
      return { text: "Resolved", color: "bg-green-900/20 text-green-400 border-green-800/30", icon: CheckCircle };
    }
    
    // Check if it's in progress (has assigned teacher or specific status)
    if (safeStatus === "IN_PROGRESS" || isAssignedToTeacher) {
      return { text: "In Progress", color: "bg-blue-900/20 text-blue-400 border-blue-800/30", icon: User };
    }
    
    // Check if it's saved/bookmarked
    if (doubt.isSaved || doubt.bookmarked || isSaved) {
      return { text: "Saved", color: "bg-purple-900/20 text-purple-400 border-purple-800/30", icon: Bookmark };
    }
    
    // For pending status, create more variety in time-based logic
    if (safeStatus === "PENDING") {
      const hours = Math.floor((new Date() - safeDate) / (1000 * 60 * 60));
      
      // Use hash to create variety even for old doubts
      const timeVariant = hashCode % 4;
      
      if (timeVariant === 0) {
        return { text: "Pending", color: "bg-amber-900/20 text-amber-400 border-amber-800/30", icon: Clock };
      } else if (timeVariant === 1) {
        return { text: "Under Review", color: "bg-blue-900/20 text-blue-400 border-blue-800/30", icon: Eye };
      } else if (timeVariant === 2 || hours > 48) {
        return { text: "Needs Attention", color: "bg-red-900/20 text-red-400 border-red-800/30", icon: AlertCircle };
      } else {
        return { text: "Recently Posted", color: "bg-green-900/20 text-green-400 border-green-800/30", icon: Sparkles };
      }
    }
    
    // Default fallback
    return { text: "Pending", color: "bg-amber-900/20 text-amber-400 border-amber-800/30", icon: Clock };
  }, [safeStatus, isAssignedToTeacher, doubt.isSaved, doubt.bookmarked, safeDate, hashCode]);

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddActivity("doubt_saved", safeTitle, `You saved a doubt for later: ${safeTitle}`);
  };

  const handleAskAI = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddActivity("question_reply", safeTitle, `You started a reply to: ${safeTitle}`);
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddActivity("doubt_viewed", safeTitle, `You viewed details for: ${safeTitle}`);
  };

  return (
    <Card className="bg-gradient-to-br from-[#161B22] to-[#1A2233] border-[#30363D] text-[#E5E7EB] overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,112,243,0.15)] hover:border-[#0070F3]/30 hover:scale-[1.01] md:hover:scale-[1.02] group cursor-pointer" onClick={handleViewDetails}>
      <CardHeader className="pb-3 md:pb-4 border-b border-[#30363D]/50 p-3 md:p-6">
        <div className="flex justify-between items-start mb-2 md:mb-3">
          <div className="flex items-start flex-1">
            <span className="text-lg md:text-2xl mr-2 md:mr-3 flex-shrink-0">{techIcon}</span>
            <div className="flex-1 min-w-0">
              {/* Enhanced title with better typography - Mobile Optimized */}
              <CardTitle className="text-base md:text-xl font-bold text-[#E5E7EB] group-hover:text-[#0070F3] transition-colors line-clamp-2 pr-1 md:pr-2 leading-tight">
                {safeTitle}
              </CardTitle>
              
              {/* Primary info row - Mobile Optimized for smaller screens */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mt-2 md:mt-3">
                <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                  <Badge className="bg-[#0D1117] text-[#A1A1AA] border-[#30363D] text-xs font-medium px-2 py-1">
                    <span className="mr-1">{techIcon}</span>
                    <span className="hidden sm:inline">{safeTopic}</span>
                    <span className="sm:hidden">{safeTopic.substring(0, 8)}{safeTopic.length > 8 ? '...' : ''}</span>
                  </Badge>
                  <span className={`text-xs font-semibold ${urgencyInfo.color} flex items-center`}>
                    <Timer className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">{urgencyInfo.text}</span>
                    <span className="sm:hidden">{urgencyInfo.text.split(' ')[0]}</span>
                  </span>
                </div>
                {assignedTeacher && (
                  <div className="flex items-center text-xs text-[#0070F3]">
                    <img 
                      src={assignedTeacher.avatar} 
                      alt={assignedTeacher.name}
                      className="w-4 h-4 rounded-full mr-1"
                    />
                    <span className="font-medium hidden sm:inline">{assignedTeacher.name}</span>
                    <span className="font-medium sm:hidden">{assignedTeacher.name.split(' ')[0]}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Action buttons - Mobile Optimized */}
          <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 md:h-8 md:w-8 p-0 hover:bg-[#0070F3]/10 transition-colors"
                >
                  <MoreHorizontal className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB]">
                <DropdownMenuItem onClick={handleEdit} className="hover:bg-[#30363D]/30">
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Question
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAskAI} className="hover:bg-[#30363D]/30">
                  <img src={logo} alt="AI" width={16} height={16} className="mr-2" />
                  Ask AI
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Enhanced description with better readability - Mobile Optimized */}
        <CardDescription className="text-[#A1A1AA] text-xs md:text-sm line-clamp-2 leading-relaxed mt-1 md:mt-2 font-normal">
          {safeDescription}
          {safeDescription.length > 80 && (
            <span className="text-[#0070F3] hover:underline ml-1 cursor-pointer font-medium">
              more
            </span>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-3 md:p-4 space-y-3 md:space-y-4">
        {/* Code snippet preview - Mobile Optimized */}
        {safeCodeSnippet && (
          <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-2 md:p-3 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-xs text-[#A1A1AA]">
                <Code className="w-3 h-3 mr-1" />
                Code Preview
              </div>
              <Button size="sm" variant="ghost" className="h-5 md:h-6 px-1 md:px-2 text-xs hover:bg-[#30363D]/30">
                <Play className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Expand</span>
              </Button>
            </div>
            <pre className="text-[#E5E7EB] font-mono text-xs whitespace-pre line-clamp-2 md:line-clamp-3 overflow-hidden">
              {safeCodeSnippet}
            </pre>
          </div>
        )}
        
        {/* Tags - Mobile Optimized */}
        {safeTags.length > 0 && (
          <div className="flex flex-wrap gap-1 md:gap-2">
            <span className="text-xs text-[#A1A1AA] font-medium mr-1 md:mr-2 flex items-center">
              <span className="w-1 h-1 rounded-full bg-[#A1A1AA] mr-1 md:mr-2"></span>
              <span className="hidden sm:inline">Tags:</span>
            </span>
            {safeTags.slice(0, 2).map((tag, index) => (
              <Badge 
                key={`${tag}-${index}`} 
                variant="outline" 
                className="bg-[#0D1117] text-[#A1A1AA] border-[#30363D] hover:border-[#0070F3]/30 hover:text-[#0070F3] transition-colors cursor-pointer text-xs rounded-full"
              >
                #{tag}
              </Badge>
            ))}
            {safeTags.length > 2 && (
              <Badge variant="outline" className="bg-[#0D1117] text-[#A1A1AA] border-[#30363D] text-xs rounded-full">
                +{safeTags.length - 2}
              </Badge>
            )}
          </div>
        )}
        
        {/* Enhanced footer with clearer status - Mobile Optimized */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0 pt-3 border-t border-[#30363D]/50">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 w-full md:w-auto">
            <Badge 
              className={`text-xs flex items-center px-2 md:px-3 py-1 ${enhancedStatus.color}`}
            >
              <enhancedStatus.icon className="w-3 h-3 mr-1" />
              {enhancedStatus.text}
            </Badge>
            
            {/* Engagement metrics - Mobile Optimized */}
            <div className="flex items-center text-xs text-[#A1A1AA] gap-2 md:gap-3">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">{formatRelativeTime(safeDate)}</span>
                <span className="sm:hidden">{formatRelativeTime(safeDate).split(' ')[0]}</span>
              </span>
              {hasAISuggestions && (
                <span className="flex items-center text-[#0070F3]">
                  <Sparkles className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">AI ready</span>
                  <span className="sm:hidden">AI</span>
                </span>
              )}
            </div>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-[#0070F3] hover:bg-[#0070F3]/10 h-6 md:h-7 px-2 md:px-3 font-medium w-full md:w-auto"
            onClick={handleViewDetails}
          >
            <span className="md:hidden">View</span>
            <span className="hidden md:inline">View Details</span>
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EnhancedDoubtsStats({ doubtsData, isLoading, recentActivities, onCategoryFilter }) {
  // Fetch user's doubts with the hook
  const { userDoubtsData, isLoading: isUserDoubtsLoading } = useUserDoubts();
  
  // Calculate enhanced stats with AI insights
  const stats = React.useMemo(() => {
    if (isLoading || !doubtsData || doubtsData.length === 0) {
      return [
        { icon: UserCircle, label: "Your Doubts", value: "-", subtext: "Loading..." },
        { icon: Bot, label: "AI Assisted", value: "-", subtext: "AI solutions" },
        { icon: CheckCircle, label: "Resolved", value: "-", subtext: "Success rate" },
        { icon: Timer, label: "Avg. Time", value: "-", subtext: "Resolution" }
      ];
    }

    const totalDoubts = doubtsData.length;
    const resolvedDoubts = doubtsData.filter(d => d.isSolved && d.isSolved !== "PENDING").length;
    const pendingDoubts = totalDoubts - resolvedDoubts;
    const aiAssistedCount = Math.floor(totalDoubts * 0.7); // Mock: 70% AI assisted
    const avgResolutionTime = "2.4h"; // Mock average time
    
    // Get user doubts count
    const yourDoubts = isUserDoubtsLoading 
      ? "..." 
      : Array.isArray(userDoubtsData) 
        ? userDoubtsData.length 
        : totalDoubts;

    return [
      { 
        icon: UserCircle, 
        label: "Your Questions", 
        value: yourDoubts.toString(), 
        subtext: `${pendingDoubts} still pending`,
        highlight: true 
      },
      { 
        icon: Bot, 
        label: "AI Powered", 
        value: `${Math.round((aiAssistedCount/totalDoubts)*100)}%`, 
        subtext: "Of your questions get AI insights",
        highlight: false,
        color: "text-purple-400"
      },
      { 
        icon: CheckCircle, 
        label: "Success Rate", 
        value: `${Math.round((resolvedDoubts/totalDoubts)*100)}%`, 
        subtext: "Questions successfully resolved",
        color: "text-green-400"
      },
      { 
        icon: Timer, 
        label: "Avg. Response", 
        value: avgResolutionTime, 
        subtext: "Typical resolution time for your doubts",
        color: "text-amber-400"
      }
    ];
  }, [doubtsData, isLoading, userDoubtsData, isUserDoubtsLoading]);

  // Enhanced top categories with click handlers
  const topCategories = React.useMemo(() => {
    if (isLoading || !doubtsData || doubtsData.length === 0) {
      return [];
    }

    const categoryCounts = doubtsData.reduce((acc, doubt) => {
      const category = doubt.category || doubt.topic || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const sortedCategories = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
      
    const getColorForCategory = (name, index) => {
      const colors = ["#0070F3", "#8884d8", "#FF4D4F", "#52C41A", "#FAAD14", "#722ED1", "#13C2C2", "#EB2F96"];
      let hashCode = 0;
      for (let i = 0; i < name.length; i++) {
        hashCode = (hashCode << 5) - hashCode + name.charCodeAt(i);
        hashCode |= 0;
      }
      const colorIndex = Math.abs(hashCode) % colors.length;
      return colors[colorIndex] || colors[index % colors.length];
    };
    
    return sortedCategories.map((cat, index) => ({ 
        ...cat, 
        color: getColorForCategory(cat.name, index),
        percentage: Math.round((cat.count / doubtsData.length) * 100),
        icon: getTechIcon(cat.name)
    }));
      
  }, [doubtsData, isLoading]);

  // Recent Activities with better formatting
  const recentActivitiesDisplay = React.useMemo(() => {
    return recentActivities.slice(0, 5).map(activity => ({
      ...activity,
      timeAgo: formatRelativeTime(activity.timestamp),
      icon: activity.type === "question_asked" ? MessageCircle :
            activity.type === "doubt_saved" ? Bookmark :
            activity.type === "doubt_viewed" ? Eye :
            activity.type === "filter_applied" ? Filter : 
            CheckCircle
    }));
  }, [recentActivities]);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Enhanced Summary Card - Mobile Optimized */}
      <Card className="bg-gradient-to-br from-[#161B22] to-[#1A2233] border-[#30363D] text-[#E5E7EB] shadow-lg overflow-hidden">
        <CardHeader className="pb-3 md:pb-4 border-b border-[#30363D]/50 p-3 md:p-6">
          <CardTitle className="text-lg md:text-xl font-semibold flex items-center">
            <span className="mr-2 md:mr-3 bg-gradient-to-r from-[#0070F3] to-[#3b82f6] h-5 md:h-6 w-1 md:w-1.5 rounded-full"></span>
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-5">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 animate-pulse">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-[#0D1117] rounded-xl p-3 md:p-4 border border-[#30363D]">
                  <div className="flex items-center mb-2 md:mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#30363D] mr-2 md:mr-3"></div>
                    <div>
                      <div className="h-3 bg-[#30363D] rounded w-16 md:w-20 mb-1"></div>
                      <div className="h-2 bg-[#30363D] rounded w-12 md:w-16"></div>
                    </div>
                  </div>
                  <div className="h-6 md:h-7 bg-[#30363D] rounded w-10 md:w-12"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`bg-gradient-to-br from-[#0D1117] to-[#0D1117]/80 rounded-xl p-3 md:p-4 border transition-all duration-200 hover:scale-[1.02] md:hover:scale-105 cursor-pointer ${
                    stat.highlight 
                      ? 'border-[#0070F3]/30 bg-gradient-to-br from-[#0070F3]/5 to-[#0070F3]/10 hover:border-[#0070F3]/50' 
                      : 'border-[#30363D] hover:border-[#30363D]/80'
                  }`}
                >
                  <div className="flex items-center mb-2 md:mb-3">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center mr-2 md:mr-3 ${
                      stat.highlight 
                        ? 'bg-gradient-to-br from-[#0070F3]/20 to-[#0070F3]/10' 
                        : 'bg-[#30363D]/20'
                    }`}>
                      <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${
                        stat.color || (stat.highlight ? 'text-[#0070F3]' : 'text-[#A1A1AA]')
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm text-[#A1A1AA] truncate">{stat.label}</p>
                      <p className="text-xs text-[#A1A1AA]/70 line-clamp-1">{stat.subtext}</p>
                    </div>
                  </div>
                  <p className={`text-xl md:text-2xl font-bold ${
                    stat.color || (stat.highlight ? 'text-[#0070F3]' : 'text-[#E5E7EB]')
                  }`}>
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Top Categories Card with clickable items - Mobile Optimized */}
      <Card className="bg-gradient-to-br from-[#161B22] to-[#1A2233] border-[#30363D] text-[#E5E7EB] shadow-lg overflow-hidden">
        <CardHeader className="pb-3 md:pb-4 border-b border-[#30363D]/50 p-3 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
            <CardTitle className="text-lg md:text-xl font-semibold flex items-center">
              <span className="mr-2 md:mr-3 bg-gradient-to-r from-[#0070F3] to-[#3b82f6] h-5 md:h-6 w-1 md:w-1.5 rounded-full"></span>
              Top Categories
            </CardTitle>
            {!isLoading && doubtsData.length > 0 && (
              <Badge variant="outline" className="bg-[#0D1117] text-[#A1A1AA] border-[#30363D] text-xs">
                {topCategories.length} trending
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-3 md:p-5">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-[#30363D] mr-3"></div>
                    <div>
                      <div className="h-3 bg-[#30363D] rounded w-24 mb-1"></div>
                      <div className="h-2 bg-[#30363D] rounded w-16"></div>
                    </div>
                  </div>
                  <div className="w-16 h-2 bg-[#30363D] rounded-full"></div>
                </div>
              ))}
            </div>
          ) : topCategories.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence>
                {topCategories.map((category, index) => (
                  <motion.div 
                    key={category.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group cursor-pointer"
                    onClick={() => onCategoryFilter(category.name)}
                  >
                    <div className="flex items-center justify-between mb-2 p-2 md:p-3 rounded-lg hover:bg-[#0D1117]/50 transition-all duration-200 group-hover:scale-[1.01] md:group-hover:scale-[1.02]">
                      <div className="flex items-center flex-1">
                        <div 
                          className="w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center mr-2 md:mr-3 text-sm md:text-lg font-bold"
                          style={{ backgroundColor: `${category.color}20`, color: category.color }}
                        >
                          {category.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-0">
                            <span className="text-sm md:text-base text-[#E5E7EB] font-medium group-hover:text-[#0070F3] transition-colors truncate">
                              {category.name}
                            </span>
                            <div className="flex items-center">
                              <span className="text-xs md:text-sm text-[#A1A1AA] mr-1 md:mr-2">{category.count}</span>
                              <Badge className="bg-[#0D1117] text-[#A1A1AA] border-[#30363D] text-xs">
                                {category.percentage}%
                              </Badge>
                            </div>
                          </div>
                          <motion.div 
                            className="w-full h-1.5 md:h-2 bg-[#0D1117] rounded-full overflow-hidden mt-1 md:mt-2"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <motion.div 
                              className="h-full rounded-full" 
                              style={{ backgroundColor: category.color }}
                              initial={{ width: "0%" }}
                              animate={{ width: `${(category.count / (topCategories[0].count || 1)) * 100}%` }}
                              transition={{ duration: 0.7, delay: 0.2 + index * 0.1 }}
                            />
                          </motion.div>
                        </div>
                      </div>
                      <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-[#A1A1AA] group-hover:text-[#0070F3] opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center text-[#A1A1AA] py-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#0D1117] flex items-center justify-center mb-4 border border-[#30363D]">
                <TrendingUp className="w-8 h-8 opacity-50" />
              </div>
              <p className="font-medium">No category data available</p>
              <p className="text-xs mt-1 opacity-70">Submit questions to see trending topics</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default EnhancedDoubtPage
