"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Trophy, Users, Zap, Lightbulb, Bookmark, AlertCircle } from "lucide-react"
import { useProblemOfTheDay } from '@/hooks/useProblemOfTheDay'

// Fallback mock data in case API fails
const fallbackProblem = {
  title: "Longest Palindromic Substring",
  difficulty: "MEDIUM",
  category: "Dynamic Programming",
  description: "Given a string s, return the longest palindromic substring in s.",
  exampleInput: "babad",
  exampleOutput: "bab",
  timeComplexity: "O(n^2)",
  spaceComplexity: "O(1)",
  likes: 12500,
  dislikes: 800,
  submissions: 1000000,
  acceptanceRate: 85.5,
}

export default function ProblemOfTheDay() {
  const [showHint, setShowHint] = useState(false)
  const { problemData, isLoading, error } = useProblemOfTheDay()
  
  // Use API data if available, otherwise use fallback data
  const problem = problemData || fallbackProblem
  
  // Handle loading state
  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-[#161B22] to-[#1A2233] border-[#30363D] text-[#E5E7EB] overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] relative">
        <CardHeader className="pb-3 border-b border-[#30363D]/50 relative">
          <CardTitle className="text-2xl font-bold flex items-center">
            <span className="mr-2 bg-[#0070F3] h-5 w-1 rounded-full"></span>
            Problem of the Day
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-5 flex justify-center items-center min-h-[300px]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0070F3] mb-4"></div>
            <p className="text-[#A1A1AA]">Loading problem of the day...</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // Handle error state
  if (error) {
    return (
      <Card className="bg-gradient-to-br from-[#161B22] to-[#1A2233] border-[#30363D] text-[#E5E7EB] overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] relative">
        <CardHeader className="pb-3 border-b border-[#30363D]/50 relative">
          <CardTitle className="text-2xl font-bold flex items-center">
            <span className="mr-2 bg-[#0070F3] h-5 w-1 rounded-full"></span>
            Problem of the Day
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-5 flex justify-center items-center min-h-[300px]">
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-900/20 p-3 rounded-full mb-4">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <p className="text-red-400 mb-2">Error loading today's problem</p>
            <p className="text-[#A1A1AA] text-sm max-w-md">
              We're having trouble loading the problem of the day. Showing fallback data instead.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-[#161B22] to-[#1A2233] border-[#30363D] text-[#E5E7EB] overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-[#0070F3]/10 to-transparent blur-[30px] pointer-events-none" />
      
      <CardHeader className="pb-3 border-b border-[#30363D]/50 relative">
        <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#0070F3]/30 rounded-full blur-[30px]" />
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold flex items-center">
            <span className="mr-2 bg-[#0070F3] h-5 w-1 rounded-full"></span>
            Problem of the Day
            <motion.div 
              animate={{ rotate: [0, 15, 0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 5, repeatType: "loop" }}
              className="ml-2 text-yellow-400 text-sm"
            >
              ★
            </motion.div>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className={`bg-gradient-to-r from-[#0D1117] to-[#141d29] text-[#E5E7EB] border border-[#30363D] ${
              problem.difficulty === 'EASY' ? 'text-green-400' :
              problem.difficulty === 'MEDIUM' ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {problem.difficulty}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 pb-5 relative">
        <h3 className="text-xl font-semibold mb-3 text-[#E5E7EB]">{problem.title}</h3>
        <div className="mb-4 bg-gradient-to-r from-[#0070F3]/5 to-transparent p-0.5 rounded-lg">
          <p className="text-[#A1A1AA] p-2">{problem.description}</p>
        </div>

        <div className="bg-[#0D1117] p-4 rounded-md border border-[#30363D] mb-5 shadow-inner">
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-[#A1A1AA]">Input:</span>
              <span className="text-xs text-[#A1A1AA]">Example 1</span>
            </div>
            <div className="bg-[#161B22] p-2 rounded border border-[#30363D]/50">
              <code className="text-[#0070F3]">{problem.exampleInput}</code>
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-[#A1A1AA]">Output:</span>
            <div className="bg-[#161B22] p-2 rounded border border-[#30363D]/50 mt-1">
              <code className="text-[#0070F3]">{problem.exampleOutput}</code>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          <div className="bg-[#0D1117] px-2 py-1 rounded-full text-xs border border-[#30363D] flex items-center">
            <span className="w-2 h-2 rounded-full bg-[#0070F3] mr-1.5"></span>
            <span className="text-[#A1A1AA]">Time: </span>
            <span className="ml-1">{problem.timeComplexity}</span>
          </div>
          <div className="bg-[#0D1117] px-2 py-1 rounded-full text-xs border border-[#30363D] flex items-center">
            <span className="w-2 h-2 rounded-full bg-[#0070F3] mr-1.5"></span>
            <span className="text-[#A1A1AA]">Space: </span>
            <span className="ml-1">{problem.spaceComplexity}</span>
          </div>
          <div className="bg-[#0D1117] px-2 py-1 rounded-full text-xs border border-[#30363D] flex items-center">
            <span className="w-2 h-2 rounded-full bg-[#0070F3] mr-1.5"></span>
            <span className="text-[#A1A1AA]">AC Rate: </span>
            <span className="ml-1">{problem.acceptanceRate}%</span>
          </div>
        </div>

        <div className="flex space-x-3 mb-5">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
            <Button variant="default" className="w-full py-5 bg-gradient-to-r from-[#0070F3] to-[#3b82f6] hover:opacity-90 text-white shadow-md shadow-[#0070F3]/20 text-base font-medium">
              Solve Challenge
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button 
              variant="outline" 
              className="h-full text-[#E5E7EB] bg-[#0D1117] border-[#30363D] hover:bg-[#30363D]"
              onClick={() => setShowHint(!showHint)}
            >
              {showHint ? "Hide Hint" : "Show Hint"}
            </Button>
          </motion.div>
        </div>

        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-[#0D1117] to-[#131b29] p-4 rounded-lg border border-[#30363D] mb-5"
          >
            <div className="flex items-start space-x-3">
              <div className="bg-[#0070F3]/10 p-2 rounded-full">
                <Lightbulb className="w-5 h-5 text-[#0070F3]" />
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-[#E5E7EB]">Hint:</h3>
                <p className="text-[#A1A1AA]">
                  Consider using dynamic programming or expanding around the center of each possible palindrome.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex justify-between items-center pt-1 border-t border-[#30363D]/30">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-[#0070F3]" />
            <span className="text-sm">{(problem.likes).toLocaleString()} likes</span>
          </div>
          <div className="flex items-center">
            <button className="text-[#A1A1AA] hover:text-[#0070F3] p-1">
              <Bookmark className="w-4 h-4" />
            </button>
            <Badge variant="outline" className="ml-3 text-[#0070F3] border-[#30363D]">
              {problem.category}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

