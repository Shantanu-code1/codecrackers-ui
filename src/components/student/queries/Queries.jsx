import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Star, MessageCircle, ThumbsUp, ThumbsDown, Clock, Filter, Award, User, Users, ArrowLeft } from "lucide-react"
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

// Example mock data for answers, can be replaced with real API data later
const mockAnswers = [
  {
    id: 1,
    queryId: 1,
    author: {
      id: 2,
      name: "Sophie Chen",
      avatar: "/placeholder.svg",
      role: "Teacher"
    },
    content: "In Redux, the store is the central piece that holds your application state. Here's how you can set it up correctly:",
    codeSnippet: `// Define your reducers
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

// Combine reducers if you have multiple
import { combineReducers, createStore } from 'redux';
const rootReducer = combineReducers({
  counter: counterReducer,
  // other reducers...
});

// Create the store
const store = createStore(rootReducer);`,
    date: "2025-03-10",
    votes: {
      up: 12,
      down: 2
    },
    isVerified: true
  },
  {
    id: 2,
    queryId: 1,
    author: {
      id: 3,
      name: "Miguel Rodriguez",
      avatar: "/placeholder.svg",
      role: "Student"
    },
    content: "I had the same issue last week. Make sure you're installing both redux and react-redux packages.",
    codeSnippet: "",
    date: "2025-03-11",
    votes: {
      up: 8,
      down: 1
    },
    isVerified: false
  }
];

// Expected API response format for queries
const apiResponseFormat = {
  success: true,
  data: {
    queries: [
      {
        id: 1,
        title: "How do I implement a Redux store in a React application?",
        body: "I'm new to Redux and I'm trying to set up a store in my React app. Can someone provide a simple example of how to properly configure Redux with React?",
        codeSnippet: "import { createStore } from 'redux';\n\n// What should I put here?\nconst rootReducer = ???\n\nconst store = createStore(rootReducer);",
        author: {
          id: 1,
          name: "Jamie Miller",
          avatar: "/placeholder.svg",
          role: "Student",
        },
        category: "React",
        tags: ["react", "redux", "javascript"],
        date: "2025-03-10",
        views: 128,
        answers: 3,
        votes: 15,
        status: "Open",
      },
      // Additional query objects...
    ],
    total: 25,
    page: 1,
    limit: 10
  }
};

// Expected API response format for answers
const apiAnswersResponseFormat = {
  success: true,
  data: {
    answers: [
      {
        id: 1,
        queryId: 1,
        author: {
          id: 2,
          name: "Sophie Chen",
          avatar: "/placeholder.svg",
          role: "Teacher"
        },
        content: "In Redux, the store is the central piece that holds your application state. Here's how you can set it up correctly:",
        codeSnippet: "// Define your reducers\nconst counterReducer = (state = 0, action) => {\n  switch (action.type) {\n    case 'INCREMENT':\n      return state + 1;\n    case 'DECREMENT':\n      return state - 1;\n    default:\n      return state;\n  }\n};\n\n// Combine reducers if you have multiple\nimport { combineReducers, createStore } from 'redux';\nconst rootReducer = combineReducers({\n  counter: counterReducer,\n  // other reducers...\n});\n\n// Create the store\nconst store = createStore(rootReducer);",
        date: "2025-03-10",
        votes: {
          up: 12,
          down: 2
        },
        isVerified: true
      },
      // Additional answer objects...
    ]
  }
};

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
    
    // Create the payload in the required format
    const payload = {
      title: newQuery.title,
      body: newQuery.body,
      codeSnippet: newQuery.codeSnippet,
      category: newQuery.category,
      tags: newQuery.tags,
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
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">Community Queries</h1>
              <p className="text-text-muted">Explore and answer questions from the community</p>
            </div>
            {!activeQuery && !showNewQueryForm && (
              <Button 
                className="bg-secondary hover:bg-secondary/90 text-white"
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
                          { value: 'react', label: 'React' },
                          { value: 'javascript', label: 'JavaScript' },
                          { value: 'redux', label: 'Redux' },
                          { value: 'api', label: 'API' },
                          { value: 'async', label: 'Async' },
                          { value: 'promises', label: 'Promises' },
                          { value: 'error-handling', label: 'Error Handling' },
                          { value: 'performance', label: 'Performance' },
                          { value: 'optimization', label: 'Optimization' },
                          { value: 'typescript', label: 'TypeScript' },
                        ]}
                        selected={newQuery.tags.map(tag => ({ value: tag, label: tag }))}
                        onChange={(selected) => 
                          setNewQuery({
                            ...newQuery, 
                            tags: selected.map(item => item.value)
                          })
                        }
                        className="bg-muted border-border text-text"
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
                <div className="fixed bottom-8 right-8">
                  <Button 
                    className="bg-secondary hover:bg-secondary/90 text-white shadow-lg rounded-full w-14 h-14 flex items-center justify-center"
                    onClick={() => {
                      document.getElementById('answer-form').scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                      });
                    }}
                  >
                    <MessageCircle className="h-6 w-6" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="bg-card border border-border rounded-lg p-4 mb-6 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                    <Input 
                      placeholder="Search queries..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-muted border-border text-text"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px] bg-muted border-border text-text">
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
                      className="bg-muted hover:bg-muted/80 text-text border border-border"
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    >
                      <Filter className="h-4 w-4 mr-2" /> 
                      {showAdvancedFilters ? "Hide Filters" : "Show Filters"}
                    </Button>
                  </div>
                </div>
                
                {/* Tag filters */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {allTags.slice(0, 8).map((tag, i) => (
                    <Badge 
                      key={i} 
                      className={`cursor-pointer ${
                        selectedTags.includes(tag)
                          ? "bg-secondary text-white"
                          : "bg-muted hover:bg-muted/80 text-text-muted"
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
                    </Badge>
                  ))}
                </div>
                
                {/* Advanced Filters */}
                {showAdvancedFilters && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-text-muted mb-2 block">Category</Label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-full bg-muted border-border text-text">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border text-text">
                            {allCategories.map((category, i) => (
                              <SelectItem key={i} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-text-muted mb-2 block">Status</Label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                          <SelectTrigger className="w-full bg-muted border-border text-text">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border text-text">
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="Solved">Solved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-text-muted mb-2 block">Date Range</Label>
                        <Select value={dateRange} onValueChange={setDateRange}>
                          <SelectTrigger className="w-full bg-muted border-border text-text">
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border text-text">
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="flex items-center">
                        <Checkbox 
                          id="answered-only" 
                          checked={showAnsweredOnly}
                          onCheckedChange={(checked) => {
                            setShowAnsweredOnly(checked)
                            if (checked) setShowUnansweredOnly(false)
                          }}
                          className="mr-2 border-border"
                        />
                        <Label htmlFor="answered-only" className="text-text-muted text-sm">
                          Answered only
                        </Label>
                      </div>
                      
                      <div className="flex items-center">
                        <Checkbox 
                          id="unanswered-only" 
                          checked={showUnansweredOnly}
                          onCheckedChange={(checked) => {
                            setShowUnansweredOnly(checked)
                            if (checked) setShowAnsweredOnly(false)
                          }}
                          className="mr-2 border-border"
                        />
                        <Label htmlFor="unanswered-only" className="text-text-muted text-sm">
                          Unanswered only
                        </Label>
                      </div>
                      
                      <div className="flex items-center">
                        <Checkbox 
                          id="verified-only" 
                          checked={showVerifiedOnly}
                          onCheckedChange={setShowVerifiedOnly}
                          className="mr-2 border-border"
                        />
                        <Label htmlFor="verified-only" className="text-text-muted text-sm">
                          With verified answers only
                        </Label>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
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
                        className="border-border text-text hover:bg-muted"
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <Tabs defaultValue="browse" className="mb-6">
                <TabsList className="bg-card border border-border grid grid-cols-3 h-auto p-1 w-full sm:w-auto">
                  <TabsTrigger 
                    value="browse" 
                    className="py-2.5 data-[state=active]:bg-secondary data-[state=active]:text-white"
                  >
                    Browse Questions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="my-questions" 
                    className="py-2.5 data-[state=active]:bg-secondary data-[state=active]:text-white"
                  >
                    My Questions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="my-answers" 
                    className="py-2.5 data-[state=active]:bg-secondary data-[state=active]:text-white"
                  >
                    My Answers
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
                    <div className="space-y-6">{filteredQueries.map((query) => (
                      <Card 
                        key={query.id} 
                        className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                        onClick={() => handleQueryClick(query)}
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between">
                            <div>
                              <h2 className="text-xl font-semibold text-text hover:text-secondary transition-colors duration-200">
                                {query.title}
                              </h2>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {query.tags.map((tag, i) => (
                                  <Badge key={i} className="bg-secondary/10 text-secondary border border-secondary/30">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <p className="mt-3 text-text-muted line-clamp-2">{query.body}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <Badge className={`mb-2 ${
                                query.status === "Open" 
                                  ? "bg-green-500/10 text-green-500 border-green-500/30" 
                                  : "bg-blue-500/10 text-blue-500 border-blue-500/30"
                              }`}>
                                {query.status}
                              </Badge>
                              <div className="flex items-center text-text-muted text-sm">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                <span className="mr-3">{query.votes}</span>
                                <MessageCircle className="h-4 w-4 mr-1" />
                                <span>{query.answers}</span>
                              </div>
                            </div>
                          </div>
                          
                          {query.codeSnippet && (
                            <div className="mt-4 bg-muted p-3 rounded-md border border-border overflow-x-auto">
                              <pre className="text-text-muted text-sm font-mono">
                                <code>{query.codeSnippet}</code>
                              </pre>
                            </div>
                          )}
                          
                          <div className="mt-4 flex justify-between items-center">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={query.author.avatar} />
                                <AvatarFallback className="bg-muted text-text-muted">
                                  {query.author.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="text-sm text-text">{query.author.name}</span>
                                <div className="flex items-center text-xs text-text-muted">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{query.date}</span>
                                </div>
                              </div>
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
                    <div className="space-y-6">
                      {queries.map((query) => (
                        <Card 
                          key={query.id} 
                          className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                          onClick={() => handleQueryClick(query)}
                        >
                          <CardContent className="p-6">
                            <div className="flex justify-between">
                              <div>
                                <h2 className="text-xl font-semibold text-text hover:text-secondary transition-colors duration-200">
                                  {query.title}
                                </h2>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {query.tags.map((tag, i) => (
                                    <Badge key={i} className="bg-secondary/10 text-secondary border border-secondary/30">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <p className="mt-3 text-text-muted line-clamp-2">{query.body}</p>
                              </div>
                              <div className="flex flex-col items-end">
                                <Badge className={`mb-2 ${
                                  query.status === "Open" 
                                    ? "bg-green-500/10 text-green-500 border-green-500/30" 
                                    : "bg-blue-500/10 text-blue-500 border-blue-500/30"
                                }`}>
                                  {query.status}
                                </Badge>
                                <div className="flex items-center text-text-muted text-sm">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{query.date}</span>
                                </div>
                              </div>
                            </div>
                            
                            {query.codeSnippet && (
                              <div className="mt-4 bg-muted p-3 rounded-md border border-border overflow-x-auto">
                                <pre className="text-text-muted text-sm font-mono">
                                  <code>{query.codeSnippet}</code>
                                </pre>
                              </div>
                            )}
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