import React, { useState, useEffect } from "react"
import { 
  MessageSquare, Search, Filter, Clock, Star, 
  ChevronDown, CheckCircle, Calendar, BarChart2, 
  Zap, Eye, FileCode, User, Code
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Header from "../../student/header/Header"
import { DollarSign } from "lucide-react"
import { getAllDoubtsForAdminsOrTeachers } from "../../../zustand/student/action"
import { initiateAnswerSession } from "../../../zustand/teacher/action"

// Mock data for doubts - This will be removed
// const mockDoubts = [ ... ];

// Statistics for the dashboard
const mockStats = {
  pendingDoubts: 12,
  resolvedToday: 8,
  averageResponseTime: "18 min",
  earningsToday: 320,
  totalResolved: 432
};

const TeacherDoubtsPage = () => {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    language: "all",
    priority: "all",
    complexity: "all"
  });
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [initiatingSessionFor, setInitiatingSessionFor] = useState(null);
  
  useEffect(() => {
    const fetchDoubtsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const rawData = await getAllDoubtsForAdminsOrTeachers();
        // Map API response to the structure expected by the component
        const mappedDoubts = (Array.isArray(rawData) ? rawData : rawData.doubts || []).map(doubt => ({
          id: doubt.id,
          title: doubt.title,
          description: doubt.description,
          codeSnippet: doubt.codeSnippet,
          programmingLanguage: doubt.topic, // Map topic to programmingLanguage
          category: doubt.topic, // Use topic for category as well, or adjust as needed
          tags: doubt.tagsList || (doubt.tags ? doubt.tags.split(',').map(t => t.trim()) : []), // Map tagsList or split tags string
          status: doubt.isSolved === "PENDING" ? "pending" : "answered", // Map isSolved to status
          timePosted: new Date(doubt.timeSubmitted).toLocaleString(), // Format timeSubmitted
          // priority, complexity, bounty, estimatedTime are removed as per user request or if not in API
          // Add any other necessary fields here, with defaults if needed
          bounty: doubt.bounty || 0, // Keep bounty if it exists, otherwise default or remove if not needed
        }));
        setDoubts(mappedDoubts);
      } catch (e) {
        setError(e.message || "Failed to fetch doubts");
        console.error("Failed to fetch doubts:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDoubtsData();
  }, []);
  
  // Filter doubts based on search, filters, and activeTab
  const filteredDoubts = doubts.filter(doubt => {
    // Status filter based on activeTab
    const statusMatch = activeTab === "all" || 
                        (activeTab === "pending" && doubt.status === "pending") ||
                        (activeTab === "answered" && doubt.status === "answered"); // Ensure your API uses "answered" or adjust as needed

    if (!statusMatch) return false;
    
    // Search filter
    const searchMatch = 
      doubt.title.toLowerCase().includes(search.toLowerCase()) ||
      doubt.description.toLowerCase().includes(search.toLowerCase()) ||
      doubt.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    
    // Other filters
    const languageMatch = filter.language === "all" || doubt.programmingLanguage === filter.language;
    const priorityMatch = filter.priority === "all" || doubt.priority === filter.priority;
    const complexityMatch = filter.complexity === "all" || doubt.complexity === filter.complexity;
    
    return searchMatch && languageMatch && priorityMatch && complexityMatch;
  });
  
  // Calculate counts for tabs
  const pendingDoubtsCount = doubts.filter(d => d.status === "pending").length;
  const answeredDoubtsCount = doubts.filter(d => d.status !== "pending").length; // Consider any non-pending as answered for now
  const allDoubtsCount = doubts.length;
  
  // Handle selecting a doubt to view/answer
  const handleDoubtSelect = (doubt) => {
    setSelectedDoubt(doubt);
  };

  const handleInitiateAndSelectDoubt = async (doubt) => {
    if (!doubt || !doubt.id) {
      console.error("Invalid doubt object or missing doubt ID");
      return;
    }
    setInitiatingSessionFor(doubt.id);
    try {
      await initiateAnswerSession(doubt.id);
      // If successful, then select the doubt to show details
      handleDoubtSelect(doubt);
    } catch (apiError) {
      // Handle error (e.g., show a notification to the user)
      console.error("Failed to initiate answer session:", apiError);
      // Optionally, display an error message to the user here
      alert(`Error initiating session for doubt: ${doubt.title}. Please try again.`);
    } finally {
      setInitiatingSessionFor(null);
    }
  };
  
  // Close detailed view
  const handleBackToList = () => {
    setSelectedDoubt(null);
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary via-primary/95 to-primary text-text pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <p className="text-xl text-text-muted">Loading doubts...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary via-primary/95 to-primary text-text pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <p className="text-xl text-red-500">Error fetching doubts: {error}</p>
          <p className="text-text-muted mt-2">Please try again later or contact support.</p>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-primary via-primary/95 to-primary text-text pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">Student Doubts</h1>
              <p className="text-text-muted">Review and answer student programming questions</p>
            </div>
          </div>
          
          {!selectedDoubt ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
                <Card className="bg-card border-border shadow-lg">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="bg-blue-500/10 p-3 rounded-full mb-2">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-text">{mockStats.pendingDoubts}</div>
                    <p className="text-text-muted text-sm">Pending Doubts</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border shadow-lg">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="bg-green-500/10 p-3 rounded-full mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-text">{mockStats.resolvedToday}</div>
                    <p className="text-text-muted text-sm">Resolved Today</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border shadow-lg">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="bg-yellow-500/10 p-3 rounded-full mb-2">
                      <Clock className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="text-2xl font-bold text-text">{mockStats.averageResponseTime}</div>
                    <p className="text-text-muted text-sm">Avg. Response Time</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border shadow-lg">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="bg-secondary/10 p-3 rounded-full mb-2">
                      <DollarSign className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="text-2xl font-bold text-text">${mockStats.earningsToday}</div>
                    <p className="text-text-muted text-sm">Earnings Today</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border shadow-lg">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="bg-purple-500/10 p-3 rounded-full mb-2">
                      <BarChart2 className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold text-text">{mockStats.totalResolved}</div>
                    <p className="text-text-muted text-sm">Total Resolved</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
                  <Input 
                    className="bg-muted border-border text-text pl-10" 
                    placeholder="Search doubts by title, description, or tags..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Select 
                    value={filter.language} 
                    onValueChange={(value) => setFilter({...filter, language: value})}
                  >
                    <SelectTrigger className="w-[140px] border-border bg-muted text-text">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-text">
                      <SelectItem value="all">All Languages</SelectItem>
                      {/* Dynamically populate these from available topics in doubts or a predefined list */}
                      {[...new Set(doubts.map(d => d.programmingLanguage))].map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Priority and Complexity filters removed as data is not in API response */}
                  {/* 
                  <Select 
                    value={filter.priority} 
                    onValueChange={(value) => setFilter({...filter, priority: value})}
                  >
                    <SelectTrigger className="w-[130px] border-border bg-muted text-text">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-text">
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={filter.complexity} 
                    onValueChange={(value) => setFilter({...filter, complexity: value})}
                  >
                    <SelectTrigger className="w-[130px] border-border bg-muted text-text">
                      <SelectValue placeholder="Complexity" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-text">
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="high">Complex</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Simple</SelectItem>
                    </SelectContent>
                  </Select>
                  */}
                </div>
              </div>
              
              {/* Tabs and Doubts List */}
              <Tabs defaultValue="pending" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="bg-muted/50 border border-border inline-flex mb-6">
                  <TabsTrigger value="pending" className="data-[state=active]:bg-secondary data-[state=active]:text-white">
                    Pending ({pendingDoubtsCount})
                  </TabsTrigger>
                  <TabsTrigger value="answered" className="data-[state=active]:bg-secondary data-[state=active]:text-white">
                    Answered ({answeredDoubtsCount})
                  </TabsTrigger>
                  <TabsTrigger value="all" className="data-[state=active]:bg-secondary data-[state=active]:text-white">
                    All Doubts ({allDoubtsCount})
                  </TabsTrigger>
                </TabsList>
                
                <div>
                  {filteredDoubts.length > 0 ? (
                    <div className="space-y-4">
                      {filteredDoubts.map((doubt) => (
                        <Card 
                          key={doubt.id} 
                          className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInitiateAndSelectDoubt(doubt);
                          }}
                          disabled={initiatingSessionFor === doubt.id}
                        >
                          <CardContent className="p-5">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                                    {doubt.programmingLanguage}
                                  </Badge>
                                </div>
                                
                                <h3 className="text-lg font-medium text-text mb-1">{doubt.title}</h3>
                                <p className="text-text-muted text-sm line-clamp-2">{doubt.description}</p>
                                
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {doubt.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-text-muted border-border/50 bg-muted/50">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end gap-2">
                                <div className="text-right">
                                  {/* Bounty and Estimated Time Removed */}
                                  {/* <div className="text-xl font-semibold text-secondary">${doubt.bounty}</div> */}
                                  {/* <div className="text-text-muted text-xs">Estimated: {doubt.estimatedTime}</div> */}
                                </div>
                                
                                <div className="flex items-center text-text-muted text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>Posted {doubt.timePosted}</span>
                                </div>
                                
                                <Button 
                                  className="mt-2 bg-secondary hover:bg-secondary/90 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleInitiateAndSelectDoubt(doubt);
                                  }}
                                  disabled={initiatingSessionFor === doubt.id}
                                >
                                  {initiatingSessionFor === doubt.id ? "Initiating..." : "Answer Question"}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="bg-card border-border shadow-lg">
                      <CardContent className="p-8 text-center">
                        <MessageSquare className="h-12 w-12 text-text-muted mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-text mb-2">No Doubts Found</h3>
                        <p className="text-text-muted max-w-md mx-auto">
                          {search || filter.language !== "all" || filter.priority !== "all" || filter.complexity !== "all" ? 
                            "No doubts match your current filters. Try adjusting your search criteria." : 
                            activeTab === "pending" ? "There are no pending doubts to answer right now. Check back later!" :
                            activeTab === "answered" ? "No doubts have been answered yet." :
                            "There are no doubts available at the moment."}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </Tabs>
            </>
          ) : (
            /* Detailed Doubt View */
            <div>
              <Button 
                variant="outline" 
                className="mb-6 border-border text-text-muted hover:text-text"
                onClick={handleBackToList}
              >
                ← Back to Doubts List
              </Button>
              
              <Card className="bg-card border-border shadow-lg mb-6">
                <CardHeader className="border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-text">{selectedDoubt.title}</CardTitle>
                      <CardDescription className="text-text-muted mt-1">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Posted {selectedDoubt.timePosted} {/* Estimated time removed */}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      {/* Bounty display removed */}
                      {/* <div className="text-2xl font-bold text-secondary">${selectedDoubt.bounty}</div> */}
                      <div className="flex gap-2 mt-2">
                        {/* Priority Badge Removed */}
                        {/* <Badge className={`
                          ${selectedDoubt.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/30' : 
                            selectedDoubt.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' : 
                            'bg-green-500/10 text-green-500 border-green-500/30'}
                        `}>
                          {selectedDoubt.priority.charAt(0).toUpperCase() + selectedDoubt.priority.slice(1)} Priority
                        </Badge> */}
                        {/* Complexity Badge Removed */}
                        {/* <Badge className={`
                          ${selectedDoubt.complexity === 'high' ? 'bg-purple-500/10 text-purple-500 border-purple-500/30' : 
                            selectedDoubt.complexity === 'medium' ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' : 
                            'bg-green-500/10 text-green-500 border-green-500/30'}
                        `}>
                          {selectedDoubt.complexity.charAt(0).toUpperCase() + selectedDoubt.complexity.slice(1)} Complexity
                        </Badge> */}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-text mb-2">Description</h3>
                      <p className="text-text">{selectedDoubt.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-text mb-2 flex items-center">
                        <Code className="h-5 w-5 mr-2" />
                        Code Snippet
                        <Badge className="ml-3 bg-blue-500/10 text-blue-500 border-blue-500/30">
                          {selectedDoubt.programmingLanguage}
                        </Badge>
                      </h3>
                      <div className="bg-muted p-4 rounded-md border border-border overflow-auto">
                        <pre className="text-text font-mono text-sm whitespace-pre-wrap">
                          {selectedDoubt.codeSnippet}
                        </pre>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-text mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedDoubt.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-text-muted border-border/50 bg-muted/50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Answer Section */}
              <Card className="bg-card border-border shadow-lg">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="text-xl text-text">Your Answer</CardTitle>
                  <CardDescription className="text-text-muted">
                    Provide a clear and concise explanation to help the student understand
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="explanation" className="block text-text mb-2">Explanation</Label>
                      <textarea 
                        id="explanation" 
                        className="w-full bg-muted border-border text-text rounded-md p-3 min-h-[150px]"
                        placeholder="Write your detailed explanation here..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="code-solution" className="block text-text mb-2">Code Solution (optional)</Label>
                      <textarea 
                        id="code-solution" 
                        className="w-full bg-muted border-border text-text rounded-md p-3 min-h-[150px] font-mono"
                        placeholder="// Provide corrected or example code here"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="additional-resources" className="block text-text mb-2">Additional Resources (optional)</Label>
                      <Input 
                        id="additional-resources" 
                        className="bg-muted border-border text-text"
                        placeholder="Add links to helpful documentation, tutorials, etc."
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-code-execution" />
                      <Label htmlFor="include-code-execution" className="text-text-muted">
                        Include code execution results
                      </Label>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t border-border/50 p-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    className="border-border text-text-muted hover:text-text"
                  >
                    Save as Draft
                  </Button>
                  <div className="space-x-3">
                    <Button 
                      variant="outline" 
                      className="border-border text-text-muted hover:text-text"
                    >
                      Preview Answer
                    </Button>
                    <Button className="bg-secondary hover:bg-secondary/90 text-white">
                      Submit Answer {/* Bounty removed from button text */}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TeacherDoubtsPage; 