import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, Bot, User, Code2, Upload, RotateCcw, 
  MessageSquare, FileText, Mic, Square, Sparkles,
  Brain, Maximize2, Minimize2, Zap, Star
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import Header from '../header/Header'
import logo from "../../../img/niqSolve-removebg.png"
import logo2 from "../../../img/niqSolve4-removebg.png"

// Mock AI responses and data
const AI_RESPONSES = {
  greeting: "Hello! I'm your AI coding tutor. I can help you with programming concepts, debug code, explain algorithms, and guide your learning journey. What would you like to learn today?",
  codeReview: "I've analyzed your code. Here are some suggestions for improvement:",
  explanation: "Let me break this down for you step by step:",
  debug: "I found a potential issue in your code. Here's what might be causing the problem:",
}

const AiTutor = () => {
  // Chat state
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showChat, setShowChat] = useState(false)
  
  // Voice and media state
  const [isRecording, setIsRecording] = useState(false)
  
  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [codeLanguage, setCodeLanguage] = useState('javascript')
  
  // Refs
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message function
  const sendMessage = async () => {
    if (!newMessage.trim()) return
    
    if (!showChat) setShowChat(true)
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: newMessage,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(newMessage),
        timestamp: new Date(),
        suggestions: generateSuggestions(newMessage)
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  // Generate AI response based on input
  const generateAIResponse = (input) => {
    if (input.toLowerCase().includes('debug') || input.toLowerCase().includes('error')) {
      return AI_RESPONSES.debug + " Check your variable declarations and function calls."
    } else if (input.toLowerCase().includes('explain') || input.toLowerCase().includes('how')) {
      return AI_RESPONSES.explanation + " I'll walk you through this concept with examples."
    } else if (input.toLowerCase().includes('code')) {
      return AI_RESPONSES.codeReview + " Consider using more descriptive variable names and add comments."
    } else {
      return "That's a great question! Let me help you understand this concept better. Here's what you need to know..."
    }
  }

  // Generate suggestions
  const generateSuggestions = (input) => {
    return [
      "Tell me more about this",
      "Show me an example", 
      "What are the best practices?",
      "How do I implement this?"
    ]
  }

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const fileMessage = {
        id: Date.now(),
        type: 'user',
        content: `Uploaded file: ${file.name}`,
        timestamp: new Date(),
        file: {
          name: file.name,
          type: file.type,
          size: file.size
        }
      }
      setMessages(prev => [...prev, fileMessage])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {!showChat && <Header />}
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars */}
        {[...Array(50)].map((_, i) => {
          // Generate stable positions based on index
          const x = (i * 37) % 100; // Pseudo-random but stable X position
          const y = (i * 23) % 100; // Pseudo-random but stable Y position
          const duration = 2 + (i % 4); // Stable duration
          const delay = (i % 10) * 0.2; // Stable delay
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
                x: [0, (i % 3 - 1) * 10, 0], // Gentle horizontal drift
                y: [0, (i % 2) * 5, 0], // Gentle vertical drift
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
              }}
            />
          )
        })}
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-40 right-32 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {!showChat ? (
          // Landing View - Similar to Dora AI
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="max-w-4xl mx-auto text-center">
              {/* Central AI Avatar */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-12"
              >
                
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mb-12"
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                    Learning beyond
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    imagination
                  </span>
                  <br />
                </h1>
              </motion.div>

              {/* Main Input */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mb-8"
              >
                <div className="relative max-w-2xl mx-auto">
                  <div className="relative flex items-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-2 shadow-2xl">
                    <Sparkles className="w-5 h-5 text-purple-400 ml-4 mr-3" />
                                         <Input
                       placeholder="Ask anything about programming, algorithms, or coding concepts..."
                       value={newMessage}
                       onChange={(e) => setNewMessage(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                       className="flex-1 bg-transparent border-none text-white placeholder-gray-300 text-lg focus:ring-0 focus:outline-none focus:border-transparent focus:ring-transparent focus:ring-offset-0 focus:shadow-none"
                       style={{
                         outline: 'none',
                         border: 'none',
                         boxShadow: 'none',
                         borderColor: 'transparent'
                       }}
                     />
                    <Button 
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isTyping}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 ml-2 shadow-lg"
                    >
                      Ask me
                      <Zap className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Feature Cards */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
              >
                {[
                  { icon: Code2, title: "Code Analysis", desc: "Debug and optimize your code" },
                  { icon: Brain, title: "Concept Learning", desc: "Understand programming concepts" },
                  { icon: Sparkles, title: "Interactive Help", desc: "Get personalized guidance" }
                ].map((feature, idx) => (
                  <Card key={idx} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <feature.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                      <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-300 text-sm">{feature.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </div>
          </div>
        ) : (
          // Chat View
          <div className="flex-1 flex flex-col">
                         {/* Chat Header */}
             <div className="border-b border-white/10 backdrop-blur-lg sticky top-0 z-10">
               <div className="max-w-full mx-auto px-4 py-4">
                 <div className="flex items-center justify-between">
                   {/* Left side - niqSolve name */}
                   <motion.div
                     initial={{ x: 0, opacity: 1 }}
                     animate={{ x: 0, opacity: 1 }}
                     transition={{ duration: 0.5, ease: "easeInOut" }}
                     className="flex items-center space-x-3"
                   >
                      <img src={logo} alt="NiqSolve" className="w-[8rem] h-[3rem] sm:w-[10rem] sm:h-[4rem]" />
                      <p className="text-sm text-gray-300">AI Tutor Assistant</p>
                   </motion.div>

                   {/* Right side - Card element */}
                   <motion.div
                     initial={{ x: 100, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
                     className="bg-card/90 backdrop-blur-sm px-6 py-[1rem] rounded-full w-[25rem] shadow-lg border border-secondary/20 flex items-center justify-between"
                   >
                     <span className="text-white text-sm">Chat with AI Tutor</span>
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => {
                         setMessages([])
                         setShowChat(false)
                       }}
                       className="text-gray-300 hover:text-white hover:bg-white/10 ml-2"
                     >
                       <RotateCcw className="w-4 h-4" />
                     </Button>
                   </motion.div>
                 </div>
               </div>
             </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
              <div className="max-w-4xl mx-auto px-4 py-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-6"
                    >
                      <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} space-x-3 max-w-2xl`}>
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center`}>
                              {message.type === 'ai' ? <img src={logo2} alt="NiqSolve logo" className="w-10 h-10 text-white" /> : ""}
                            </div>
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className={`p-4 rounded-2xl ${
                              message.type === 'ai' 
                                ? 'bg-white/10 backdrop-blur-sm border border-white/20' 
                                : 'bg-blue-600/80 backdrop-blur-sm'
                            }`}>
                              <div className="text-white whitespace-pre-wrap">
                                {message.content}
                              </div>
                            </div>
                            
                            {message.file && (
                              <div className="mt-2 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                                <div className="flex items-center space-x-2">
                                  <FileText className="w-4 h-4 text-purple-400" />
                                  <span className="text-sm text-white">{message.file.name}</span>
                                  <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
                                    {Math.round(message.file.size / 1024)}KB
                                  </Badge>
                                </div>
                              </div>
                            )}
                            
                            {message.suggestions && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {message.suggestions.map((suggestion, idx) => (
                                  <Button
                                    key={idx}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs border-white/20 text-gray-300 hover:bg-white/10"
                                    onClick={() => setNewMessage(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6"
                  >
                    <div className="flex justify-start">
                      <div className="flex flex-row space-x-3 max-w-2xl">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="border-t border-white/10 bg-black/20 backdrop-blur-lg sticky bottom-0">
              <div className="max-w-3xl mx-auto px-4 py-3">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-300 hover:text-white hover:bg-white/10 p-2"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  
                  <Input
                    placeholder="Continue the conversation..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    className="flex-1 bg-transparent border-none text-white placeholder-gray-300 focus:outline-none focus:ring-0 focus:ring-transparent focus:ring-offset-0 focus:shadow-none"
                    style={{
                      outline: 'none',
                      boxShadow: 'none'
                    }}
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-2 rounded-xl"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.html,.css,.json,.md,.txt"
        />
      </div>
    </div>
  )
}

export default AiTutor
