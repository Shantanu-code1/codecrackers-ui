import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Star, Book, Clock, MessageCircle, TrendingUp, Filter, ArrowUpRight, CheckCircle, AlertCircle, Sparkles, MoreHorizontal, ChevronDown, Bookmark, Code, UserCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import Header from "../header/Header"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useSubmitDoubt } from "@/hooks/useSubmitDoubt"
import { useFetchDoubts } from "@/hooks/useFetchDoubts"
import { useUserDoubts } from "@/hooks/useUserDoubts"
import signuporloginStore from '@/zustand/login-signup/store'

const mockTeachers = [
  {
    id: 1,
    name: "Dr. Jane Smith",
    expertise: ["Algorithms", "Data Structures"],
    rating: 4.8,
    doubtsAnswered: 120,
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Prof. John Doe",
    expertise: ["JavaScript", "React", "Node.js"],
    rating: 4.9,
    doubtsAnswered: 150,
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Dr. Emily Brown",
    expertise: ["Python", "Machine Learning", "AI"],
    rating: 4.7,
    doubtsAnswered: 100,
    image: "/placeholder.svg",
  },
]

const analyticsData = [
  { name: "Jan", doubts: 40, solutions: 30 },
  { name: "Feb", doubts: 30, solutions: 25 },
  { name: "Mar", doubts: 50, solutions: 45 },
  { name: "Apr", doubts: 40, solutions: 35 },
  { name: "May", doubts: 60, solutions: 55 },
  { name: "Jun", doubts: 50, solutions: 48 },
]

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

const EnhancedDoubtPage = () => {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedStatus, setSelectedStatus] = useState("All")
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

  const filteredDoubts = doubtsData.filter(
    (doubt) =>
      (doubt.title?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All Categories" || doubt.category === selectedCategory) &&
      (selectedStatus === "All" || 
       (selectedStatus === "Pending" && (!doubt.isSolved || doubt.isSolved === "PENDING")) ||
       (selectedStatus === "Solved" && doubt.isSolved && doubt.isSolved !== "PENDING")) &&
      true
  )

  const filteredTeachers = mockTeachers.filter(
    (teacher) =>
      teacher.rating >= ratingFilter[0] &&
      teacher.rating <= ratingFilter[1] &&
      (expertiseFilter.length === 0 || teacher.expertise.some((exp) => expertiseFilter.includes(exp))),
  )

  const categoriesList = ["All Categories", "Algorithms", "JavaScript", "React", "Data Structures", "Dynamic Programming", "Complexity Analysis", "Sorting", "Web Development", "System Design", "Database"]

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D1117] via-[#111827] to-[#0D1117] text-[#E5E7EB] pb-16 relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/4 bg-gradient-to-b from-[#0070F3]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-gradient-to-t from-[#8884d8]/5 to-transparent rounded-full blur-[150px] pointer-events-none" />
      
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[7rem]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-[#E5E7EB]">Coding Doubts</h1>
            <p className="text-[#A1A1AA] mt-1">Find answers to your programming questions</p>
          </div>
          
          <Button 
            className="bg-gradient-to-r from-[#0070F3] to-[#3b82f6] hover:opacity-90 text-white shadow-md shadow-[#0070F3]/20 flex items-center"
            onClick={() => setIsAskModalOpen(true)}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Ask a Question
          </Button>
        </div>

        {/* Search and filter bar */}
        <Card className="bg-gradient-to-r from-[#161B22] to-[#1A2233] border-[#30363D] text-[#E5E7EB] mb-6 shadow-lg overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A1A1AA]" />
                  <Input
                  placeholder="Search doubts..." 
                  className="pl-10 bg-[#0D1117] border-[#30363D] text-[#E5E7EB] w-full focus:ring-[#0070F3] focus:border-[#0070F3]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB] flex items-center">
                      <Filter className="w-4 h-4 mr-2" />
                      {selectedStatus}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB]">
                    <DropdownMenuItem onClick={() => setSelectedStatus("All")}>All Statuses</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus("Solved")}>Solved</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus("Pending")}>Pending</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left panel - Doubts list with scrolling */}
          <div className="md:col-span-2">
            <div className="bg-gradient-to-br from-[#161B22] to-[#1A2233] border border-[#30363D] rounded-lg shadow-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#E5E7EB] flex items-center">
                  <span className="mr-2 bg-[#0070F3] h-5 w-1 rounded-full"></span>
                  Coding Doubts
                </h2>
                <Badge className="bg-[#0070F3]/10 text-[#0070F3] border border-[#0070F3]/30">
                  {filteredDoubts.length} results
                </Badge>
              </div>
              
              {/* Add this scrollable container */}
              <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {isLoading ? (
                  // Skeleton loaders for doubts
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="animate-pulse mb-4">
                      <div className="bg-[#0D1117] rounded-lg p-4 border border-[#30363D]">
                        <div className="h-4 bg-[#30363D] rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-[#30363D] rounded w-1/2 mb-3"></div>
                        <div className="flex space-x-2 mb-2">
                          <div className="h-2 bg-[#30363D] rounded w-16"></div>
                          <div className="h-2 bg-[#30363D] rounded w-20"></div>
                        </div>
                        <div className="flex justify-between">
                          <div className="h-3 bg-[#30363D] rounded w-24"></div>
                          <div className="h-3 bg-[#30363D] rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : isError ? (
                  // Error state
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#0D1117] flex items-center justify-center mb-4 border border-[#FF4D4F]">
                      <AlertCircle className="w-8 h-8 text-[#FF4D4F]" />
                    </div>
                    <h3 className="text-lg font-medium text-[#E5E7EB] mb-1">Error fetching doubts</h3>
                    <p className="text-[#A1A1AA] mb-4">{error?.message || "An unexpected error occurred."}</p>
                  </div>
                ) : filteredDoubts.length > 0 ? (
                <AnimatePresence>
                  {filteredDoubts.map((doubt) => (
                    <motion.div
                      key={doubt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      layout
                      >
                        <DoubtCard doubt={doubt} onAddActivity={addActivity} />
                    </motion.div>
                  ))}
                </AnimatePresence>
                ) : (
                  // Empty state
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#0D1117] flex items-center justify-center mb-4 border border-[#30363D]">
                      <AlertCircle className="w-8 h-8 text-[#A1A1AA]" />
              </div>
                    <h3 className="text-lg font-medium text-[#E5E7EB] mb-1">No doubts found</h3>
                    <p className="text-[#A1A1AA] mb-4">Try adjusting your filters or search terms, or ask a new question.</p>
                    <Button 
                      className="bg-[#0070F3] hover:bg-[#0070F3]/90 text-white"
                      onClick={() => setIsAskModalOpen(true)}
                    >
                      Ask a Question
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right panel - Stats */}
          <div className="md:col-span-1">
            <DoubtsStats doubtsData={doubtsData} isLoading={isLoading} recentActivities={recentActivities} />
          </div>
        </div>
      </div>

      <Dialog open={isAskModalOpen} onOpenChange={setIsAskModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-[#161B22] to-[#1A2233] border-[#30363D] text-[#E5E7EB]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center">
              <span className="mr-2 bg-[#0070F3] h-5 w-1 rounded-full"></span>
              Ask a Question
            </DialogTitle>
            <DialogDescription className="text-[#A1A1AA]">
              Provide details about your coding question to get the best answers.
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
                      {category}
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
                    className={`cursor-pointer ${
                      newQuestion.tags.includes(tag) 
                        ? "bg-[#0070F3]/20 text-[#0070F3] border-[#0070F3]/30" 
                        : "bg-[#0D1117] text-[#A1A1AA] border-[#30363D] hover:bg-[#30363D]/30"
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
          
          <DialogFooter className="flex justify-between items-center pt-4 border-t border-[#30363D]/50">
            <div className="text-xs text-[#A1A1AA]">
              Please review our community guidelines before posting.
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="border-[#30363D] text-[#E5E7EB] hover:bg-[#30363D]/30"
                onClick={() => setIsAskModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                className="bg-gradient-to-r from-[#0070F3] to-[#3b82f6] hover:opacity-90"
                onClick={handleAskQuestion}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Submitting...
                  </>
                ) : 'Submit Question'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Also add this CSS for a better scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0D1117;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #30363D;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0070F3;
        }
      `}</style>
    </div>
  )
}

function DoubtCard({ doubt, onAddActivity }) {
  // Adjust to match the actual API response structure
  const safeTags = Array.isArray(doubt.tagsList) ? doubt.tagsList : [];
  const safeDate = doubt.timeSubmitted ? new Date(doubt.timeSubmitted).toLocaleDateString() : "Date unknown";
  const safeDescription = doubt.description || "No description provided.";
  const safeCodeSnippet = doubt.codeSnippet || null;
  const safeTitle = doubt.title || "Untitled Doubt";
  const safeTopic = doubt.topic || "Uncategorized";
  const safeStatus = doubt.isSolved || "PENDING";

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddActivity("doubt_saved", safeTitle, `You saved a doubt for later: ${safeTitle}`);
  };

  const handleReply = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddActivity("question_reply", safeTitle, `You started a reply to: ${safeTitle}`);
  };

  return (
    <Card className="bg-gradient-to-br from-[#161B22] to-[#1A2233] border-[#30363D] text-[#E5E7EB] overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <CardHeader className="pb-3 border-b border-[#30363D]/50">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-[#E5E7EB]">{safeTitle}</CardTitle>
            <Badge className="mt-2 bg-[#0D1117] text-[#A1A1AA] border-[#30363D]">
              {safeTopic}
            </Badge>
          </div>
        </div>
        <CardDescription className="flex items-center mt-2 text-[#A1A1AA]">
          <span className="text-xs flex items-center">
            <Clock className="w-3 h-3 mr-1" /> {safeDate}
          </span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        
        {safeCodeSnippet && (
          <div className="bg-[#0D1117] border border-[#30363D] rounded-md p-4 overflow-x-auto">
            <pre className="text-[#E5E7EB] font-mono text-sm whitespace-pre">
              {safeCodeSnippet}
            </pre>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {safeTags.map((tag, index) => (
            <Badge key={`${tag}-${index}`} variant="outline" className="bg-[#0D1117] text-[#A1A1AA] border-[#30363D]">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-[#30363D]/50">
          <Badge 
            className={`${ 
              safeStatus !== "PENDING"
                ? "bg-green-900/20 text-green-400 border-green-800/30" 
                : "bg-amber-900/20 text-amber-400 border-amber-800/30"
            }`}
          >
            {safeStatus}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function DoubtsStats({ doubtsData, isLoading, recentActivities }) {
  // Fetch user's doubts with the hook
  const { userDoubtsData, isLoading: isUserDoubtsLoading } = useUserDoubts();
  
  // Calculate dynamic stats only when not loading and data is available
  const stats = React.useMemo(() => {
    if (isLoading || !doubtsData || doubtsData.length === 0) {
      return [
        { icon: UserCircle, label: "Your Doubts", value: "-" },
        { icon: CheckCircle, label: "Answered", value: "-" },
        { icon: AlertCircle, label: "Pending", value: "-" }
      ];
    }

    const totalDoubts = doubtsData.length;
    const answeredDoubts = doubtsData.filter(d => d.isSolved && d.isSolved !== "PENDING").length;
    const pendingDoubts = totalDoubts - answeredDoubts;
    
    // Get user doubts count - use loading state and fall back to "..." if still loading
    const yourDoubts = isUserDoubtsLoading 
      ? "..." 
      : Array.isArray(userDoubtsData) 
        ? userDoubtsData.length 
        : 0;

    return [
      { icon: UserCircle, label: "Your Doubts", value: yourDoubts.toString(), highlight: true },
      { icon: CheckCircle, label: "Answered", value: answeredDoubts.toString() },
      { icon: AlertCircle, label: "Pending", value: pendingDoubts.toString() },
    ];
  }, [doubtsData, isLoading, userDoubtsData, isUserDoubtsLoading]);

  // Calculate top categories dynamically with better field detection
  const topCategories = React.useMemo(() => {
    if (isLoading || !doubtsData || doubtsData.length === 0) {
      return [];
    }

    // Create a counter for all fields that might contain category information
    const categoryCounts = doubtsData.reduce((acc, doubt) => {
      // Try different fields that might contain category info, with priority order
      const category = doubt.category || doubt.topic || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const sortedCategories = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Take top 5
      
    // Generate a deterministic color for each category name
    const getColorForCategory = (name, index) => {
      const colors = ["#0070F3", "#8884d8", "#FF4D4F", "#52C41A", "#FAAD14", "#722ED1", "#13C2C2", "#EB2F96"];
      
      // Hash the category name to get a consistent index
      let hashCode = 0;
      for (let i = 0; i < name.length; i++) {
        hashCode = (hashCode << 5) - hashCode + name.charCodeAt(i);
        hashCode |= 0; // Convert to 32bit integer
      }
      
      // Use abs to ensure positive number, then mod by array length
      const colorIndex = Math.abs(hashCode) % colors.length;
      
      // Or use index position as fallback
      return colors[colorIndex] || colors[index % colors.length];
    };
    
    return sortedCategories.map((cat, index) => ({ 
        ...cat, 
        color: getColorForCategory(cat.name, index),
        percentage: Math.round((cat.count / doubtsData.length) * 100)
    }));
      
  }, [doubtsData, isLoading]);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-[#161B22] to-[#1A2233] border-[#30363D] text-[#E5E7EB] shadow-lg overflow-hidden">
        <CardHeader className="pb-3 border-b border-[#30363D]/50">
          <CardTitle className="text-xl font-semibold flex items-center">
            <span className="mr-2 bg-[#0070F3] h-5 w-1 rounded-full"></span>
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 animate-pulse">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-[#0D1117] rounded-lg p-4 border border-[#30363D]">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#30363D] mr-2"></div>
                    <div className="h-3 bg-[#30363D] rounded w-20"></div>
                  </div>
                  <div className="h-6 bg-[#30363D] rounded w-10"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`bg-[#0D1117] rounded-lg p-4 border ${stat.highlight ? 'border-[#0070F3]/30' : 'border-[#30363D]'} ${stat.highlight ? 'bg-[#0070F3]/5' : ''}`}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-8 h-8 rounded-full ${stat.highlight ? 'bg-[#0070F3]/20' : 'bg-[#0070F3]/10'} flex items-center justify-center mr-2`}>
                      <stat.icon className={`w-4 h-4 ${stat.highlight ? 'text-[#0070F3]' : 'text-[#0070F3]'}`} />
                    </div>
                    <span className="text-sm text-[#A1A1AA]">{stat.label}</span>
                  </div>
                  <p className={`text-2xl font-semibold ${stat.highlight ? 'text-[#0070F3]' : 'text-[#E5E7EB]'}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Categories Card - Enhanced with animations and better visualization */}
      <Card className="bg-gradient-to-br from-[#161B22] to-[#1A2233] border-[#30363D] text-[#E5E7EB] shadow-lg overflow-hidden">
        <CardHeader className="pb-3 border-b border-[#30363D]/50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold flex items-center">
              <span className="mr-2 bg-[#0070F3] h-5 w-1 rounded-full"></span>
              Top Categories
            </CardTitle>
            <Badge variant="outline" className="bg-[#0D1117] text-[#A1A1AA] border-[#30363D]">
              {topCategories.length} of {Object.keys(doubtsData.reduce((acc, d) => {
                const category = d.category || d.topic || "Uncategorized";
                acc[category] = true;
                return acc;
              }, {})).length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#30363D] mr-2"></div>
                    <div className="h-3 bg-[#30363D] rounded w-24"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 bg-[#30363D] rounded w-8 mr-2"></div>
                    <div className="w-16 h-1.5 bg-[#30363D] rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : topCategories.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence>
                {topCategories.map((category, index) => (
                  <motion.div 
                    key={category.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: category.color }} />
                        <span className="text-[#E5E7EB] font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-[#A1A1AA] text-sm mr-2">{category.count}</span>
                      </div>
                    </div>
                    <motion.div 
                      className="w-full h-1.5 bg-[#0D1117] rounded-full overflow-hidden"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <motion.div 
                        className="h-full rounded-full" 
                        style={{ backgroundColor: category.color }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${(category.count / (topCategories[0].count || 1)) * 100}%` }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center text-[#A1A1AA] py-4 flex flex-col items-center">
              <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
              <p>No category data available</p>
              <p className="text-xs mt-1">Submit questions to see categories</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default EnhancedDoubtPage
