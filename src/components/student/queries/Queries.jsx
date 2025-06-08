import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Star, MessageCircle, ThumbsUp, ThumbsDown, Clock, Filter, Award, User, Users, ArrowLeft, Eye, ChevronUp, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { RichTextEditor } from "../doubts/ui/rich-text"
import { MultiSelect } from "../doubts/ui/multi-select"
import { CodeEditor } from "../doubts/ui/code-editor"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Header from "../header/Header"
import { Textarea } from "@/components/ui/textarea"
import { submitQuery, getQueries, getQueryAnswers, submitAnswer } from "@/zustand/student/action"
import { toast } from "react-toastify"


const QueriesPage = () => {
  // State for real queries data
  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // State for answers
  const [answers, setAnswers] = useState([])
  const [loadingAnswers, setLoadingAnswers] = useState(false)
  const [answersError, setAnswersError] = useState(null)
  
  // Other state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [showTeacherAnswersOnly, setShowTeacherAnswersOnly] = useState(false)
  const [sortBy, setSortBy] = useState("latest")
  const [activeQuery, setActiveQuery] = useState(null)
  const [newQuery, setNewQuery] = useState({
    title: "",
    body: "",
    codeSnippet: "",
    category: "",
    tags: [],
  })
  const [newAnswer, setNewAnswer] = useState({
    content: "",
    codeSnippet: "",
  })
  const [selectedTags, setSelectedTags] = useState([])
  const [dateRange, setDateRange] = useState("all")
  const [showAnsweredOnly, setShowAnsweredOnly] = useState(false)
  const [showUnansweredOnly, setShowUnansweredOnly] = useState(false)
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [showNewQueryForm, setShowNewQueryForm] = useState(false)

  // Fetch queries on component mount
  useEffect(() => {
    fetchQueries();
  }, []);

  // Function to fetch queries
  const fetchQueries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getQueries();
      console.log("fetchQueries data:", response);
      
      // Check if the response has the expected structure
      if (!response || !response.success || !response.data || !response.data.queries) {
        throw new Error("Invalid response format from API");
      }
      
      const data = response.data.queries;
      
      // Filter out any items that might be doubts instead of queries
      const queriesOnly = data.filter(item => {
        // Check if the item is a query and not a doubt
        // This depends on how your API distinguishes between queries and doubts
        // Possible fields to check: type, isDoubt, etc.
        return !item.isDoubt && item.type !== 'doubt';
      });
      
      // Transform API data to match expected format
      const formattedQueries = queriesOnly.map(item => ({
        id: item.id,
        title: item.title,
        body: item.body, // API now directly provides body field
        codeSnippet: item.codeSnippet,
        author: item.author || {
          id: 1,
          name: "You",
          avatar: "/placeholder.svg",
          role: "Student",
        },
        category: item.category, // API now directly provides category field
        tags: item.tags || [], // API provides tags directly
        date: new Date(item.date).toISOString().split('T')[0], // Format the date
        views: item.views || 0,
        answers: item.answers || 0,
        votes: item.votes || 0,
        status: item.status || "Open", // API provides status directly
      }));
      
      setQueries(formattedQueries);
    } catch (error) {
      console.error("Error fetching queries:", error);
      setError("Failed to fetch queries. Please try again.");
      toast.error("Failed to fetch queries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get all unique tags from queries for the filter
  const allTags = [...new Set(queries.flatMap(query => query.tags))]
  
  // Get all unique categories for the filter
  const allCategories = ["All", ...new Set(queries.map(query => query.category))]

  const handleQueryClick = async (query) => {
    console.log("Clicking query:", query.id);
    // Force a re-render with a fresh state object to ensure React detects the change
    setActiveQuery({...query});

    // Fetch answers for this query
    setLoadingAnswers(true);
    setAnswersError(null);
    setAnswers([]);
    
    try {
      const response = await getQueryAnswers(query.id);
      console.log("Fetched answers:", response);
      
      // Process the answers
      if (response && response.success && response.data && response.data.answers) {
        setAnswers(response.data.answers);
      } else {
        // If the response format is different, try to handle it
        const answersData = response.answers || response.data || [];
        setAnswers(Array.isArray(answersData) ? answersData : []);
      }
    } catch (error) {
      console.error("Error fetching answers:", error);
      setAnswersError("Failed to load answers. Please try again.");
      toast.error("Failed to load answers. Please try again.");
    } finally {
      setLoadingAnswers(false);
    }
  }

  const handleBackToList = () => {
    setActiveQuery(null)
  }

  const filteredQueries = queries.filter((query) => {
    if (!query.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !query.body.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    if (selectedCategory !== "All" && query.category !== selectedCategory) {
      return false
    }
    
    if (selectedStatus !== "All" && query.status !== selectedStatus) {
      return false
    }
    
    if (selectedTags.length > 0 && !selectedTags.some(tag => query.tags.includes(tag))) {
      return false
    }
    
    if (dateRange !== "all") {
      const queryDate = new Date(query.date)
      const now = new Date()
      const daysDiff = Math.floor((now - queryDate) / (1000 * 60 * 60 * 24))
      
      if (dateRange === "today" && daysDiff > 1) return false
      if (dateRange === "week" && daysDiff > 7) return false
      if (dateRange === "month" && daysDiff > 30) return false
    }
    
    if (showAnsweredOnly && query.answers === 0) return false
    if (showUnansweredOnly && query.answers > 0) return false
    
    if (showVerifiedOnly && !query.hasVerifiedAnswer) return false
    
    return true
  }).sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.date) - new Date(a.date)
    } else if (sortBy === "oldest") {
      return new Date(a.date) - new Date(b.date)
    } else if (sortBy === "votes") {
      return b.votes - a.votes
    } else if (sortBy === "answers") {
      return b.answers - a.answers
    }
    return 0
  })

  const getAnswersForQuery = (queryId) => {
    // Use the real answers from the state
    let queryAnswers = answers;
    
    // Filter by teacher if needed
    if (showTeacherAnswersOnly) {
      queryAnswers = queryAnswers.filter((answer) => answer.author.role === "Teacher");
    }
    
    return queryAnswers;
  }

  const handleSubmitQuery = async (e) => {
    e.preventDefault()
    
    // Check if tags are available
    const tags = newQuery.tags || [];
    console.log("Tags being submitted:", tags);
    
    // Create the payload in the required format
    const payload = {
      title: newQuery.title,
      body: newQuery.body,
      codeSnippet: newQuery.codeSnippet,
      category: newQuery.category,
      tags: tags, // Use the tags array
      type: 'query', // Explicitly mark as a query
      isDoubt: false // Make sure it's not a doubt
    }
    
    console.log("Submitting payload:", payload)
    
    try {
      // Submit the query using the API function
      const response = await submitQuery(payload);
      console.log("handleSubmitQuery Response:", response);
      
      // Add the new query to the list
      if (response && response.data) {
        const newQueryData = response.data;
        
        // Check if the response is actually a query and not a doubt
        if (newQueryData.isDoubt || newQueryData.type === 'doubt') {
          console.warn("Received a doubt instead of a query in the response");
          // Don't add it to the queries list since it's a doubt
          toast.success("Submission successful, but it was processed as a doubt not a query.");
          setNewQuery({
            title: "",
            body: "",
            codeSnippet: "",
            category: "",
            tags: [],
          });
          setShowNewQueryForm(false);
          return;
        }
        
        // Get user data from localStorage for author information
        let userData = { name: "You" };
        try {
          const userDataStr = localStorage.getItem('userData');
          if (userDataStr) {
            userData = JSON.parse(userDataStr);
          }
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
        
        // Format the new query to match the expected format
        const formattedQuery = {
          id: newQueryData.id,
          title: newQueryData.title,
          body: newQueryData.description || newQueryData.body || "", 
          codeSnippet: newQueryData.codeSnippet,
          author: {
            id: userData.id || 1,
            name: userData.name || "You",
            avatar: "/placeholder.svg",
            role: "Student",
          },
          category: newQueryData.topic || newQueryData.category || "",
          tags: newQueryData.tagsList || newQueryData.tags || [],
          date: new Date(newQueryData.timeSubmitted || newQueryData.date || Date.now()).toISOString().split('T')[0],
          views: 0, 
          answers: 0,
          votes: 0,
          status: newQueryData.isSolved === "PENDING" || !newQueryData.isSolved ? "Open" : "Solved",
          // Add fields to keep track that this is a query, not a doubt
          type: 'query',
          isDoubt: false
        };
        
        // Add the new query to the top of the list
        setQueries(prevQueries => [formattedQuery, ...prevQueries]);
      }
      
      toast.success("Query submitted successfully!");
      
      // Reset form and hide it on success
      setNewQuery({
        title: "",
        body: "",
        codeSnippet: "",
        category: "",
        tags: [],
      });
      setShowNewQueryForm(false);
      
    } catch (error) {
      console.error("Error submitting query:", error);
      toast.error(error.response?.data?.message || "Failed to submit query. Please try again.");
    }
  }

  const handleCancelNewQuery = () => {
    setShowNewQueryForm(false)
    setNewQuery({
      title: "",
      body: "",
      codeSnippet: "",
      category: "",
      tags: [],
    })
  }

  const handleSubmitAnswer = async (e) => {
    e.preventDefault()
    
    if (!activeQuery || !activeQuery.id) {
      toast.error("Cannot submit answer: No active query selected");
      return;
    }
    
    // Prepare answer data
    const answerData = {
      content: newAnswer.content,
      codeSnippet: newAnswer.codeSnippet
    };
    
    console.log("Submitting answer:", answerData);
    
    try {
      // Submit the answer using the API function
      const response = await submitAnswer(activeQuery.id, answerData);
      console.log("Answer submission response:", response);
      
      // Add the new answer to the list if successful
      if (response && response.data) {
        const newAnswerData = response.data;
        
        // Get user data from localStorage for author information
        let userData = { name: "You" };
        try {
          const userDataStr = localStorage.getItem('userData');
          if (userDataStr) {
            userData = JSON.parse(userDataStr);
          }
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
        
        // Format the answer to match expected format
        const formattedAnswer = {
          id: newAnswerData.id || Date.now(), // Use the server ID or generate one
          queryId: activeQuery.id,
          content: newAnswerData.content || newAnswer.content,
          codeSnippet: newAnswerData.codeSnippet || newAnswer.codeSnippet,
          date: newAnswerData.date || new Date().toISOString(),
          author: newAnswerData.author || {
            id: userData.id || 999,
            name: userData.name || "You",
            avatar: "/placeholder.svg",
            role: "Student"
          },
          votes: newAnswerData.votes || { up: 0, down: 0 },
          isVerified: newAnswerData.isVerified || false
        };
        
        // Add the new answer to the list
        setAnswers(prevAnswers => [...prevAnswers, formattedAnswer]);
      }
      
      toast.success("Answer submitted successfully!");
      
      // Reset the form
      setNewAnswer({
        content: "",
        codeSnippet: "",
      });
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error(error.response?.data?.message || "Failed to submit answer. Please try again.");
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-primary via-primary/95 to-primary text-text pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 w-1/3 h-1/4 bg-gradient-to-b from-secondary/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-gradient-to-t from-secondary/5 to-transparent rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">Community Queries</h1>
              <p className="text-sm sm:text-base text-text-muted">Explore and answer questions from the community</p>
            </div>
            {!activeQuery && !showNewQueryForm && (
              <Button 
                className="bg-secondary hover:bg-secondary/90 text-white w-full sm:w-auto"
                onClick={() => setShowNewQueryForm(true)}
              >
                Ask a Question
              </Button>
            )}
          </div>
          
          {showNewQueryForm ? (
            <Card className="bg-card border-border shadow-lg mb-6">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-xl text-text">Ask a New Question</CardTitle>
                <CardDescription className="text-text-muted">
                  Be specific and provide details to get better answers
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmitQuery}>
                  <div className="mb-4">
                    <Label htmlFor="query-title" className="text-text-muted mb-2 block">
                      Title
                    </Label>
                    <Input 
                      id="query-title"
                      value={newQuery.title}
                      onChange={(e) => setNewQuery({...newQuery, title: e.target.value})}
                      placeholder="What's your question? Be specific."
                      className="bg-muted border-border text-text"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="query-body" className="text-text-muted mb-2 block">
                      Description
                    </Label>
                    <Textarea 
                      id="query-body"
                      value={newQuery.body}
                      onChange={(e) => setNewQuery({...newQuery, body: e.target.value})}
                      placeholder="Provide detailed context about your question..."
                      className="bg-muted border-border text-text min-h-[150px]"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="query-code" className="text-text-muted mb-2 block">
                      Code Snippet (optional)
                    </Label>
                    <Textarea 
                      id="query-code"
                      value={newQuery.codeSnippet}
                      onChange={(e) => setNewQuery({...newQuery, codeSnippet: e.target.value})}
                      placeholder="Add your code here if applicable..."
                      className="bg-muted border-border text-text font-mono min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="query-category" className="text-text-muted mb-2 block">
                        Category
                      </Label>
                      <Select 
                        value={newQuery.category}
                        onValueChange={(value) => setNewQuery({...newQuery, category: value})}
                      >
                        <SelectTrigger className="bg-muted border-border text-text">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border text-text">
                          <SelectItem value="JavaScript">JavaScript</SelectItem>
                          <SelectItem value="React">React</SelectItem>
                          <SelectItem value="Node.js">Node.js</SelectItem>
                          <SelectItem value="CSS">CSS</SelectItem>
                          <SelectItem value="HTML">HTML</SelectItem>
                          <SelectItem value="TypeScript">TypeScript</SelectItem>
                          <SelectItem value="Python">Python</SelectItem>
                          <SelectItem value="Java">Java</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-text-muted mb-2 block">
                        Tags
                      </Label>
                      <MultiSelect
                        options={[
                          { value: 'React', label: 'React' },
                          { value: 'JavaScript', label: 'JavaScript' },
                          { value: 'Redux', label: 'Redux' },
                          { value: 'API', label: 'API' },
                          { value: 'Async', label: 'Async' },
                          { value: 'Promises', label: 'Promises' },
                          { value: 'Error-Handling', label: 'Error Handling' },
                          { value: 'Performance', label: 'Performance' },
                          { value: 'Optimization', label: 'Optimization' },
                          { value: 'TypeScript', label: 'TypeScript' },
                          { value: 'CSS', label: 'CSS' },
                          { value: 'HTML', label: 'HTML' },
                          { value: 'Node.js', label: 'Node.js' },
                          { value: 'Java', label: 'Java' },
                          { value: 'Python', label: 'Python' },
                          { value: 'C++', label: 'C++' },
                          { value: 'Data Structures', label: 'Data Structures' },
                          { value: 'Algorithms', label: 'Algorithms' },
                          { value: 'Sorting', label: 'Sorting' },
                          { value: 'DP', label: 'Dynamic Programming' },
                        ]}
                        selected={newQuery.tags.map(tag => ({ value: tag, label: tag }))}
                        onChange={(selected) => {
                          console.log("Selected tags:", selected);
                          setNewQuery({
                            ...newQuery, 
                            tags: selected.map(item => item.value)
                          });
                        }}
                        className="bg-muted border-border text-text"
                        placeholder="Select tags for your question"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-4 mt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancelNewQuery}
                      className="border-border text-text"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-secondary hover:bg-secondary/90 text-white"
                    >
                      Post Question
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : activeQuery ? (
            <div>
              <Button 
                variant="ghost" 
                onClick={handleBackToList}
                className="mb-4 text-text-muted hover:text-text hover:bg-muted"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Questions
              </Button>
              <Card className="bg-card border-border shadow-lg mb-6">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-semibold text-text mb-2">{activeQuery.title}</h2>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {activeQuery.tags.map((tag, i) => (
                          <Badge key={i} className="bg-secondary/10 text-secondary border border-secondary/30">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge className={`${
                      activeQuery.status === "Open" 
                        ? "bg-green-500/10 text-green-500 border-green-500/30" 
                        : "bg-blue-500/10 text-blue-500 border-blue-500/30"
                    }`}>
                      {activeQuery.status}
                    </Badge>
                  </div>
                  <p className="text-text mb-4">{activeQuery.body}</p>
                  {activeQuery.codeSnippet && (
                    <div className="mb-6 bg-muted p-4 rounded-md border border-border overflow-x-auto">
                      <pre className="text-text-muted text-sm font-mono">
                        <code>{activeQuery.codeSnippet}</code>
                      </pre>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={activeQuery.author.avatar} />
                        <AvatarFallback className="bg-muted text-text-muted">
                          {activeQuery.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-text font-medium">{activeQuery.author.name}</div>
                        <div className="text-text-muted text-sm">{activeQuery.author.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-text-muted text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{activeQuery.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Answers Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-text">
                    {loadingAnswers ? "Loading Answers..." : 
                     `${answers.length} ${answers.length === 1 ? 'Answer' : 'Answers'}`}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Checkbox 
                        id="teacher-only" 
                        checked={showTeacherAnswersOnly}
                        onCheckedChange={setShowTeacherAnswersOnly}
                        className="mr-2 border-border"
                      />
                      <Label htmlFor="teacher-only" className="text-text-muted text-sm">
                        Show teacher answers only
                      </Label>
                    </div>
                    <Button 
                      className="bg-secondary hover:bg-secondary/90 text-white"
                      onClick={() => {
                        // Scroll to the answer form
                        document.getElementById('answer-form').scrollIntoView({ 
                          behavior: 'smooth', 
                          block: 'start' 
                        });
                      }}
                    >
                      Quick Reply
                    </Button>
                  </div>
                </div>
                
                {loadingAnswers ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
                  </div>
                ) : answersError ? (
                  <div className="text-center py-8">
                    <p className="text-red-500 mb-4">{answersError}</p>
                    <Button 
                      onClick={() => handleQueryClick(activeQuery)}
                      className="bg-secondary hover:bg-secondary/90 text-white"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : answers.length === 0 ? (
                  <div className="text-center py-8 border border-border rounded-lg bg-card p-6">
                    <MessageCircle className="h-12 w-12 mx-auto text-text-muted mb-4" />
                    <h3 className="text-lg font-medium text-text mb-2">No Answers Yet</h3>
                    <p className="text-text-muted mb-6">
                      Be the first to answer this question and help a fellow student!
                    </p>
                    <Button 
                      className="bg-secondary hover:bg-secondary/90 text-white"
                      onClick={() => {
                        document.getElementById('answer-form').scrollIntoView({ 
                          behavior: 'smooth', 
                          block: 'start' 
                        });
                      }}
                    >
                      Write an Answer
                    </Button>
                  </div>
                ) : (
                  getAnswersForQuery(activeQuery.id).map((answer) => (
                    <Card key={answer.id} className="bg-card border-border shadow-md mb-4">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-start">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={answer.author?.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-muted text-text-muted">
                                {answer.author?.name ? answer.author.name.split(' ').map(n => n[0]).join('') : 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center">
                                <span className="text-text font-medium mr-2">{answer.author?.name || "Anonymous"}</span>
                                {answer.author?.role === "Teacher" && (
                                  <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                                    Teacher
                                  </Badge>
                                )}
                                {answer.isVerified && (
                                  <Badge className="ml-2 bg-green-500/10 text-green-500 border-green-500/30">
                                    Verified Answer
                                  </Badge>
                                )}
                              </div>
                              <div className="text-text-muted text-sm">{new Date(answer.date || Date.now()).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>
                        <p className="text-text mb-4">{answer.content}</p>
                        {answer.codeSnippet && (
                          <div className="mb-4 bg-muted p-4 rounded-md border border-border overflow-x-auto">
                            <pre className="text-text-muted text-sm font-mono">
                              <code>{answer.codeSnippet}</code>
                            </pre>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              <Card className="bg-card border-border shadow-lg mt-6" id="answer-form">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-lg text-text">Your Answer</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmitAnswer}>
                    <div className="mb-4">
                      <Label htmlFor="answer-content" className="text-text-muted mb-2 block">
                        Answer
                      </Label>
                      <Textarea 
                        id="answer-content"
                        value={newAnswer.content}
                        onChange={(e) => setNewAnswer({...newAnswer, content: e.target.value})}
                        placeholder="Write your answer here..."
                        className="bg-muted border-border text-text min-h-[150px]"
                      />
                    </div>
                    
                    <div className="mb-6">
                      <Label htmlFor="answer-code" className="text-text-muted mb-2 block">
                        Code Snippet (optional)
                      </Label>
                      <Textarea 
                        id="answer-code"
                        value={newAnswer.codeSnippet}
                        onChange={(e) => setNewAnswer({...newAnswer, codeSnippet: e.target.value})}
                        placeholder="Add code if relevant..."
                        className="bg-muted border-border text-text font-mono min-h-[100px]"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Checkbox 
                          id="include-code-run" 
                          className="mr-2 border-border"
                        />
                        <Label htmlFor="include-code-run" className="text-text-muted text-sm">
                          Include code execution results
                        </Label>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="bg-secondary hover:bg-secondary/90 text-white"
                      >
                        Submit Answer
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {activeQuery && (
                <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50">
                  <Button 
                    className="bg-secondary hover:bg-secondary/90 text-white shadow-lg rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center touch-none"
                    onClick={() => {
                      document.getElementById('answer-form').scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                      });
                    }}
                  >
                    <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="bg-card border border-border rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 shadow-lg">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
                    <Input 
                      placeholder="Search queries..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-muted border-border text-text text-sm sm:text-base"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full sm:w-[180px] bg-muted border-border text-text text-sm">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-text">
                        <SelectItem value="latest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="votes">Most Votes</SelectItem>
                        <SelectItem value="answers">Most Answers</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      className="bg-muted hover:bg-muted/80 text-text border border-border text-sm w-full sm:w-auto"
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    >
                      <Filter className="h-4 w-4 mr-2" /> 
                      <span className="hidden sm:inline">{showAdvancedFilters ? "Hide Filters" : "Show Filters"}</span>
                      <span className="sm:hidden">Filters</span>
                    </Button>
                  </div>
                </div>
                
                {/* Tag filters */}
                <div className="mt-3 sm:mt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center mb-2 gap-2">
                    <span className="text-xs sm:text-sm font-medium text-text-muted">Popular Tags:</span>
                    {selectedTags.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTags([])}
                        className="text-xs text-text-muted hover:text-text h-6 px-2 w-fit"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                     {allTags.slice(0, typeof window !== 'undefined' && window.innerWidth < 640 ? 6 : 12).map((tag, i) => (
                      <Badge 
                        key={i} 
                        className={`cursor-pointer transition-all duration-200 text-xs ${
                          selectedTags.includes(tag)
                            ? "bg-secondary text-white shadow-md scale-105 border-secondary"
                            : "bg-muted hover:bg-secondary/10 text-text-muted hover:text-secondary border-border hover:border-secondary/30"
                        }`}
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(selectedTags.filter(t => t !== tag))
                          } else {
                            setSelectedTags([...selectedTags, tag])
                          }
                        }}
                      >
                        {tag}
                        {selectedTags.includes(tag) && (
                          <span className="ml-1.5 text-xs">×</span>
                        )}
                      </Badge>
                    ))}
                                         {allTags.length > (typeof window !== 'undefined' && window.innerWidth < 640 ? 6 : 12) && (
                      <Badge 
                        className="bg-muted/50 text-text-muted cursor-pointer hover:bg-muted text-xs"
                        onClick={() => setShowAdvancedFilters(true)}
                      >
                                                 +{allTags.length - (typeof window !== 'undefined' && window.innerWidth < 640 ? 6 : 12)} more
                      </Badge>
                    )}
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="mt-2 text-xs sm:text-sm text-text-muted">
                      Showing questions tagged with: {selectedTags.join(', ')}
                    </div>
                  )}
                </div>
                
                {/* Advanced Filters */}
                {showAdvancedFilters && (
                                      <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: "auto" }}
                     exit={{ opacity: 0, height: 0 }}
                     transition={{ duration: 0.3 }}
                     className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border bg-muted/20 rounded-lg p-3 sm:p-6"
                   >
                     <h4 className="text-base sm:text-lg font-semibold text-text mb-3 sm:mb-4">Advanced Filters</h4>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                       <div>
                         <Label className="text-text font-medium mb-2 sm:mb-3 block flex items-center text-sm">
                           <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                           Category
                         </Label>
                         <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                           <SelectTrigger className="w-full bg-card border-border text-text hover:border-secondary/50 transition-colors text-sm">
                             <SelectValue placeholder="Select category" />
                           </SelectTrigger>
                           <SelectContent className="bg-card border-border text-text">
                             {allCategories.map((category, i) => (
                               <SelectItem key={i} value={category} className="hover:bg-secondary/10 text-sm">
                                 {category}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>
                       
                       <div>
                         <Label className="text-text font-medium mb-2 sm:mb-3 block flex items-center text-sm">
                           <Badge className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                           Status
                         </Label>
                         <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                           <SelectTrigger className="w-full bg-card border-border text-text hover:border-secondary/50 transition-colors text-sm">
                             <SelectValue placeholder="Select status" />
                           </SelectTrigger>
                           <SelectContent className="bg-card border-border text-text">
                             <SelectItem value="All" className="hover:bg-secondary/10 text-sm">All</SelectItem>
                             <SelectItem value="Open" className="hover:bg-secondary/10 text-sm">Open</SelectItem>
                             <SelectItem value="Answered" className="hover:bg-secondary/10 text-sm">Answered</SelectItem>
                             <SelectItem value="Solved" className="hover:bg-secondary/10 text-sm">Solved</SelectItem>
                             <SelectItem value="Closed" className="hover:bg-secondary/10 text-sm">Closed</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                       
                       <div className="sm:col-span-2 lg:col-span-1">
                         <Label className="text-text font-medium mb-2 sm:mb-3 block flex items-center text-sm">
                           <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                           Date Range
                         </Label>
                         <Select value={dateRange} onValueChange={setDateRange}>
                           <SelectTrigger className="w-full bg-card border-border text-text hover:border-secondary/50 transition-colors text-sm">
                             <SelectValue placeholder="Select date range" />
                           </SelectTrigger>
                           <SelectContent className="bg-card border-border text-text">
                             <SelectItem value="all" className="hover:bg-secondary/10 text-sm">All Time</SelectItem>
                             <SelectItem value="today" className="hover:bg-secondary/10 text-sm">Today</SelectItem>
                             <SelectItem value="week" className="hover:bg-secondary/10 text-sm">This Week</SelectItem>
                             <SelectItem value="month" className="hover:bg-secondary/10 text-sm">This Month</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                     </div>
                     
                     <div className="mb-4 sm:mb-6">
                       <Label className="text-text font-medium mb-2 sm:mb-3 block text-sm">Quick Filters</Label>
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                         <div className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-card rounded-lg border border-border hover:border-secondary/30 transition-colors">
                           <Checkbox 
                             id="answered-only" 
                             checked={showAnsweredOnly}
                             onCheckedChange={(checked) => {
                               setShowAnsweredOnly(checked)
                               if (checked) setShowUnansweredOnly(false)
                             }}
                             className="border-border"
                           />
                           <Label htmlFor="answered-only" className="text-text text-xs sm:text-sm font-medium cursor-pointer">
                             Answered only
                           </Label>
                         </div>
                         
                         <div className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-card rounded-lg border border-border hover:border-secondary/30 transition-colors">
                           <Checkbox 
                             id="unanswered-only" 
                             checked={showUnansweredOnly}
                             onCheckedChange={(checked) => {
                               setShowUnansweredOnly(checked)
                               if (checked) setShowAnsweredOnly(false)
                             }}
                             className="border-border"
                           />
                           <Label htmlFor="unanswered-only" className="text-text text-xs sm:text-sm font-medium cursor-pointer">
                             Unanswered only
                           </Label>
                         </div>
                         
                         <div className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-card rounded-lg border border-border hover:border-secondary/30 transition-colors sm:col-span-2 lg:col-span-1">
                           <Checkbox 
                             id="verified-only" 
                             checked={showVerifiedOnly}
                             onCheckedChange={setShowVerifiedOnly}
                             className="border-border"
                           />
                           <Label htmlFor="verified-only" className="text-text text-xs sm:text-sm font-medium cursor-pointer">
                             With verified answers
                           </Label>
                         </div>
                       </div>
                     </div>
                     
                     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                       <div className="text-xs sm:text-sm text-text-muted">
                         {filteredQueries.length} questions match your filters
                       </div>
                       <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                         <Button 
                           variant="outline" 
                           onClick={() => {
                             setSearchQuery("")
                             setSelectedCategory("All")
                             setSelectedStatus("All")
                             setSelectedTags([])
                             setDateRange("all")
                             setShowAnsweredOnly(false)
                             setShowUnansweredOnly(false)
                             setShowVerifiedOnly(false)
                           }}
                           className="border-border text-text hover:bg-muted text-sm w-full sm:w-auto"
                         >
                           Reset All Filters
                         </Button>
                         <Button 
                           onClick={() => setShowAdvancedFilters(false)}
                           className="bg-secondary hover:bg-secondary/90 text-white text-sm w-full sm:w-auto"
                         >
                           Apply Filters
                         </Button>
                       </div>
                     </div>
                   </motion.div>
                )}
              </div>
              
              <Tabs defaultValue="browse" className="mb-4 sm:mb-6">
                <TabsList className="bg-card border border-border grid grid-cols-3 h-auto p-1 w-full rounded-lg">
                  <TabsTrigger 
                    value="browse" 
                    className="py-2.5 px-2 sm:py-3 sm:px-6 data-[state=active]:bg-secondary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-b-2 data-[state=active]:border-secondary font-medium transition-all duration-300 text-xs sm:text-sm"
                  >
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Browse Questions</span>
                      <span className="sm:hidden">Browse</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="my-questions" 
                    className="py-2.5 px-2 sm:py-3 sm:px-6 data-[state=active]:bg-secondary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-b-2 data-[state=active]:border-secondary font-medium transition-all duration-300 text-xs sm:text-sm"
                  >
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <User className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">My Questions</span>
                      <span className="sm:hidden">Mine</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="my-answers" 
                    className="py-2.5 px-2 sm:py-3 sm:px-6 data-[state=active]:bg-secondary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-b-2 data-[state=active]:border-secondary font-medium transition-all duration-300 text-xs sm:text-sm"
                  >
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">My Answers</span>
                      <span className="sm:hidden">Answers</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="browse">
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <p className="text-red-500 mb-4">{error}</p>
                      <Button onClick={fetchQueries} className="bg-secondary hover:bg-secondary/90 text-white">
                        Try Again
                      </Button>
                    </div>
                  ) : queries.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="w-16 h-16 mx-auto text-text-muted mb-4" />
                      <h3 className="text-xl font-medium text-text mb-2">No Questions Yet</h3>
                      <p className="text-text-muted max-w-md mx-auto mb-6">
                        There are no questions available right now. Be the first to ask a question!
                      </p>
                      <Button 
                        className="bg-secondary hover:bg-secondary/90 text-white"
                        onClick={() => setShowNewQueryForm(true)}
                      >
                        Ask a Question
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-8">{filteredQueries.map((query) => (
                      <Card 
                        key={query.id} 
                        className="bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-secondary/30"
                        onClick={() => handleQueryClick(query)}
                      >
                        <CardContent className="p-4 sm:p-6 lg:p-8">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6">
                            <div className="flex-1 sm:pr-6">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4">
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-text hover:text-secondary transition-colors duration-200 leading-tight mb-2 sm:mb-0">
                                  {query.title}
                                </h2>
                                <div className="flex items-center justify-between sm:justify-start space-x-2 sm:ml-4">
                                  <div className="flex items-center space-x-1">
                                    <button 
                                      className="p-2 sm:p-1 hover:bg-muted rounded transition-colors touch-none"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle upvote
                                      }}
                                    >
                                      <ChevronUp className="h-5 w-5 sm:h-4 sm:w-4 text-text-muted hover:text-green-500" />
                                    </button>
                                    <span className="text-sm font-medium text-text min-w-[20px] text-center">{query.votes}</span>
                                    <button 
                                      className="p-2 sm:p-1 hover:bg-muted rounded transition-colors touch-none"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle downvote
                                      }}
                                    >
                                      <ChevronDown className="h-5 w-5 sm:h-4 sm:w-4 text-text-muted hover:text-red-500" />
                                    </button>
                                  </div>
                                  <Badge className={`ml-4 sm:hidden ${
                                    query.status === "Open" 
                                      ? "bg-green-500/10 text-green-500 border-green-500/30" 
                                      : query.status === "Answered"
                                      ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                                      : query.status === "Solved"
                                      ? "bg-purple-500/10 text-purple-500 border-purple-500/30"
                                      : "bg-gray-500/10 text-gray-500 border-gray-500/30"
                                  }`}>
                                    {query.status}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                                {query.tags.slice(0, 3).map((tag, i) => (
                                  <Badge key={i} className="bg-secondary/10 text-secondary border border-secondary/30 hover:bg-secondary/20 transition-colors text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {query.tags.length > 3 && (
                                  <Badge className="bg-muted text-text-muted text-xs">
                                    +{query.tags.length - 3} more
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="mb-3 sm:mb-4">
                                <p className="text-text-muted leading-relaxed line-clamp-2 sm:line-clamp-3 text-sm sm:text-base">
                                  {query.body.length > 150 ? `${query.body.substring(0, 150)}...` : query.body}
                                </p>
                              </div>
                              
                              <div className="flex items-center justify-between sm:hidden mb-3">
                                <div className="flex items-center space-x-4 text-text-muted text-sm">
                                  <div className="flex items-center space-x-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{query.views}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MessageCircle className="h-4 w-4" />
                                    <span>{query.answers}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="hidden sm:flex flex-col items-end space-y-3">
                              <Badge className={`${
                                query.status === "Open" 
                                  ? "bg-green-500/10 text-green-500 border-green-500/30" 
                                  : query.status === "Answered"
                                  ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                                  : query.status === "Solved"
                                  ? "bg-purple-500/10 text-purple-500 border-purple-500/30"
                                  : "bg-gray-500/10 text-gray-500 border-gray-500/30"
                              }`}>
                                {query.status}
                              </Badge>
                              
                              <div className="flex items-center space-x-4 text-text-muted text-sm">
                                <div className="flex items-center space-x-1">
                                  <Eye className="h-4 w-4" />
                                  <span>{query.views}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{query.answers}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {query.codeSnippet && (
                            <div className="mb-4 sm:mb-6 bg-muted/50 p-3 sm:p-4 rounded-lg border border-border overflow-x-auto">
                              <pre className="text-text-muted text-xs sm:text-sm font-mono">
                                <code>{query.codeSnippet}</code>
                              </pre>
                            </div>
                          )}
                          
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 sm:pt-4 border-t border-border gap-3 sm:gap-0">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-muted">
                                <AvatarImage src={query.author.avatar} />
                                <AvatarFallback className="bg-secondary/10 text-secondary font-medium text-xs sm:text-sm">
                                  {query.author.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-text font-medium text-sm sm:text-base">{query.author.name}</div>
                                <div className="flex items-center text-text-muted text-xs sm:text-sm">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{query.date}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-text-muted text-xs sm:text-sm text-center sm:text-right">
                              <span className="hidden sm:inline">Click to view details and answers</span>
                              <span className="sm:hidden">Tap to view details</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}</div>
                  )}
                </TabsContent>
                
                <TabsContent value="my-questions">
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <p className="text-red-500 mb-4">{error}</p>
                      <Button onClick={fetchQueries} className="bg-secondary hover:bg-secondary/90 text-white">
                        Try Again
                      </Button>
                    </div>
                  ) : queries.length === 0 ? (
                    <Card className="bg-card shadow-lg rounded-lg overflow-hidden border border-border">
                      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                        <CardTitle className="text-2xl">My Questions</CardTitle>
                        <CardDescription className="text-blue-100">
                          Track and manage all your questions
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="text-center py-12">
                          <Users className="w-16 h-16 mx-auto text-text-muted mb-4" />
                          <h3 className="text-xl font-medium text-text mb-2">No Questions Yet</h3>
                          <p className="text-text-muted max-w-md mx-auto mb-6">
                            You haven't asked any questions yet. When you do, they will appear here.
                          </p>
                          <Button 
                            className="bg-secondary hover:bg-secondary/90 text-white"
                            onClick={() => setShowNewQueryForm(true)}
                          >
                            Ask Your First Question
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-8">
                      {queries.filter(query => query.author.name === "You" || query.author.id === 1).map((query) => (
                        <Card 
                          key={query.id} 
                          className="bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-secondary/30"
                          onClick={() => handleQueryClick(query)}
                        >
                          <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-6">
                              <div className="flex-1 pr-6">
                                <div className="flex items-start justify-between mb-4">
                                  <h2 className="text-2xl font-bold text-text hover:text-secondary transition-colors duration-200 leading-tight">
                                    {query.title}
                                  </h2>
                                  <div className="flex items-center space-x-2 ml-4">
                                    <div className="flex items-center space-x-1">
                                      <span className="text-sm font-medium text-text">{query.votes}</span>
                                      <ThumbsUp className="h-4 w-4 text-text-muted" />
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {query.tags.map((tag, i) => (
                                    <Badge key={i} className="bg-secondary/10 text-secondary border border-secondary/30">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                
                                <div className="mb-4">
                                  <p className="text-text-muted leading-relaxed line-clamp-3 text-base">
                                    {query.body.length > 200 ? `${query.body.substring(0, 200)}...` : query.body}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end space-y-3">
                                <Badge className={`${
                                  query.status === "Open" 
                                    ? "bg-green-500/10 text-green-500 border-green-500/30" 
                                    : query.status === "Answered"
                                    ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                                    : query.status === "Solved"
                                    ? "bg-purple-500/10 text-purple-500 border-purple-500/30"
                                    : "bg-gray-500/10 text-gray-500 border-gray-500/30"
                                }`}>
                                  {query.status}
                                </Badge>
                                
                                <div className="flex items-center space-x-4 text-text-muted text-sm">
                                  <div className="flex items-center space-x-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{query.views}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MessageCircle className="h-4 w-4" />
                                    <span>{query.answers}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {query.codeSnippet && (
                              <div className="mb-6 bg-muted/50 p-4 rounded-lg border border-border overflow-x-auto">
                                <pre className="text-text-muted text-sm font-mono">
                                  <code>{query.codeSnippet}</code>
                                </pre>
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10 border-2 border-muted">
                                  <AvatarImage src={query.author.avatar} />
                                  <AvatarFallback className="bg-secondary/10 text-secondary font-medium">
                                    {query.author.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-text font-medium">{query.author.name}</div>
                                  <div className="flex items-center text-text-muted text-sm">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>{query.date}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-text-muted text-sm">
                                Click to view details and manage
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="my-answers">
                  <Card className="bg-card shadow-lg rounded-lg overflow-hidden border border-border">
                    <CardHeader className="bg-gradient-to-r from-secondary/90 to-secondary text-white p-6">
                      <CardTitle className="text-2xl">My Answers</CardTitle>
                      <CardDescription className="text-text-muted">
                        Track your contributions to the community
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="text-center py-12">
                        <MessageCircle className="w-16 h-16 mx-auto text-text-muted mb-4" />
                        <h3 className="text-xl font-medium text-text mb-2">No Answers Yet</h3>
                        <p className="text-text-muted max-w-md mx-auto mb-6">
                          You haven't answered any questions yet. Help the community by sharing your knowledge!
                        </p>
                        <Button className="bg-secondary hover:bg-secondary/90 text-white">
                          Browse Questions to Answer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default QueriesPage 