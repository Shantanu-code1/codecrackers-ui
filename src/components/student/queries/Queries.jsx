import React, { useState } from "react"
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

const mockQueries = [
  {
    id: 1,
    title: "How do I implement a Redux store in a React application?",
    body: "I'm new to Redux and I'm trying to set up a store in my React app. Can someone provide a simple example of how to properly configure Redux with React?",
    codeSnippet: `
import { createStore } from 'redux';

// What should I put here?
const rootReducer = ???

const store = createStore(rootReducer);
    `,
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
  {
    id: 2,
    title: "Understanding async/await in JavaScript",
    body: "I'm confused about how async/await works in JavaScript. Can someone explain the concept with some practical examples?",
    codeSnippet: `
async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  return data;
}

// How do I properly call this function?
    `,
    author: {
      id: 2,
      name: "Alex Wong",
      avatar: "/placeholder.svg",
      role: "Student",
    },
    category: "JavaScript",
    tags: ["javascript", "async", "promises"],
    date: "2025-03-08",
    views: 210,
    answers: 5,
    votes: 28,
    status: "Answered",
  },
  {
    id: 3,
    title: "Proper way to handle API errors in React",
    body: "What is the recommended approach to handle API errors in a React application? I want to display user-friendly error messages.",
    codeSnippet: `
function fetchUserData() {
  fetch('/api/user')
    .then(response => {
      if (!response.ok) {
        // What's the best way to handle this?
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Handle data
    })
    .catch(error => {
      // Show error to user somehow?
      console.error('Error:', error);
    });
}
    `,
    author: {
      id: 3,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg",
      role: "Student",
    },
    category: "React",
    tags: ["react", "api", "error-handling"],
    date: "2025-03-05",
    views: 156,
    answers: 4,
    votes: 19,
    status: "Closed",
  },
  {
    id: 4,
    title: "How to optimize React component performance?",
    body: "My React application is getting slow as it grows. What techniques can I use to optimize the performance of my components?",
    codeSnippet: `
// Current implementation
function MyComponent({ data }) {
  const processedData = expensiveCalculation(data);
  
  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  );
}
    `,
    author: {
      id: 4,
      name: "David Chen",
      avatar: "/placeholder.svg",
      role: "Student",
    },
    category: "React",
    tags: ["react", "performance", "optimization"],
    date: "2025-03-02",
    views: 189,
    answers: 6,
    votes: 32,
    status: "Answered",
  },
]

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

const QueriesPage = () => {
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

  // Get all unique tags from queries for the filter
  const allTags = [...new Set(mockQueries.flatMap(query => query.tags))]
  
  // Get all unique categories for the filter
  const allCategories = ["All", ...new Set(mockQueries.map(query => query.category))]

  const handleQueryClick = (query) => {
    console.log("Clicking query:", query.id);
    // Force a re-render with a fresh state object to ensure React detects the change
    setActiveQuery({...query});
  }

  const handleBackToList = () => {
    setActiveQuery(null)
  }

  const filteredQueries = mockQueries.filter((query) => {
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
    // Check if mockAnswers exists first
    if (!mockAnswers || !Array.isArray(mockAnswers)) {
      console.error("mockAnswers is undefined or not an array");
      return [];
    }
    
    console.log("Looking for answers for query ID:", queryId);
    let answers = mockAnswers.filter((answer) => answer.queryId === queryId);
    console.log("Found answers:", answers);
    
    if (showTeacherAnswersOnly) {
      answers = answers.filter((answer) => answer.author.role === "Teacher");
    }
    
    return answers;
  }

  const handleSubmitQuery = (e) => {
    e.preventDefault()
    // In a real app, we would submit to the backend
    alert("Query submitted! (This is a mock implementation)")
    setNewQuery({
      title: "",
      body: "",
      codeSnippet: "",
      category: "",
      tags: [],
    })
  }

  const handleSubmitAnswer = (e) => {
    e.preventDefault()
    // In a real app, we would submit to the backend
    // Here's what would be sent:
    const answerToSubmit = {
      ...newAnswer,
      queryId: activeQuery.id,
      author: {
        id: 999, // In a real app, this would be the current user's ID
        name: "Current User",
        avatar: "/placeholder.svg",
        role: "Student"
      },
      date: new Date().toISOString().split('T')[0], // Today's date
      votes: { up: 0, down: 0 },
      isVerified: false
    };
    
    console.log("Submitting answer:", answerToSubmit);
    
    // This would be a fetch/axios call in a real app
    alert("Answer submitted! (This is a mock implementation)");
    
    // For demonstration, we could add it to the mockAnswers array
    // mockAnswers.push({...answerToSubmit, id: mockAnswers.length + 1});
    
    // Reset the form
    setNewAnswer({
      content: "",
      codeSnippet: "",
    });
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-primary via-primary/95 to-primary text-text pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 w-1/3 h-1/4 bg-gradient-to-b from-secondary/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-gradient-to-t from-secondary/5 to-transparent rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text mb-2">Community Queries</h1>
            <p className="text-text-muted">Explore and answer questions from the community</p>
          </div>
          
          {activeQuery ? (
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
                    {activeQuery.answers} {activeQuery.answers === 1 ? 'Answer' : 'Answers'}
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
                
                {getAnswersForQuery(activeQuery.id).map((answer) => (
                  <Card key={answer.id} className="bg-card border-border shadow-md mb-4">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={answer.author.avatar} />
                            <AvatarFallback className="bg-muted text-text-muted">
                              {answer.author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center">
                              <span className="text-text font-medium mr-2">{answer.author.name}</span>
                              {answer.author.role === "Teacher" && (
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
                            <div className="text-text-muted text-sm">{answer.date}</div>
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
                ))}
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
                  <div className="space-y-6">
                    {filteredQueries.map((query) => (
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
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="my-questions">
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
                        <Button className="bg-secondary hover:bg-secondary/90 text-white">
                          Ask Your First Question
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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