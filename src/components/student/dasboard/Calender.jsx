import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Trophy, Target, Zap, Code, BookOpen } from "lucide-react"
import { useMonthlyStatus } from "../../../hooks/useMonthlyStatus"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Mock data for learning activities - will be replaced with API data
const learningActivities = {
  "2023-11-15": { type: "challenge", name: "Solved Daily Challenge", xp: 50 },
  "2023-11-16": { type: "practice", name: "Array Practice", xp: 30 },
  "2023-11-17": { type: "lesson", name: "Completed Linked List Lesson", xp: 40 },
  "2023-11-20": { type: "challenge", name: "Solved Daily Challenge", xp: 50 },
  "2023-11-21": { type: "practice", name: "Tree Traversal Practice", xp: 35 },
  "2023-11-23": { type: "lesson", name: "Completed Graph Theory Lesson", xp: 45 },
}

export default function LearningStreakCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)

  // Get month and year for API call
  const currentMonth = currentDate.getMonth() + 1 // Month is 1-based for the API
  const currentYear = currentDate.getFullYear()
  
  // Fetch monthly status data from the API
  const { monthlyStatusMap, isLoading, userId } = useMonthlyStatus(currentMonth, currentYear)
  
  // Log the monthly status map whenever it changes
  useEffect(() => {
    console.log("Current month status map in calendar:", monthlyStatusMap);
  }, [monthlyStatusMap]);
  
  // Handle loading states, including when userId is undefined
  const isDataLoading = isLoading || !userId

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
  const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth())

  // Get activity for a day - first check API data, then fallback to mock data
  const getActivityForDay = (day) => {
    let dateString;
    
    if (typeof day === 'string') {
      // Already a date string like "2023-11-15"
      dateString = day;
    } else {
      // A day number that needs to be converted
      dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    }
    
    return learningActivities[dateString];
  }
  
  // Check if a day has activity based on the API response
  const getDayStatus = (day) => {
    // If userId is not available, return undefined
    if (!userId) return undefined;
    
    let dateString;
    
    if (typeof day === 'string') {
      dateString = day;
    } else {
      dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    }
    
    // Return the status from the API (true/false) or undefined if not available
    const status = monthlyStatusMap[dateString];
    console.log(`Day: ${day}, DateString: ${dateString}, Status: ${status}`);
    return status;
  }

  const getStreakInfo = () => {
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    for (let i = 1; i <= daysInMonth; i++) {
      // Use API data if available, otherwise fallback to mock data
      const hasActivity = getDayStatus(i) !== undefined ? getDayStatus(i) : !!getActivityForDay(i);
      
      if (hasActivity) {
        tempStreak++
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak
        }
        if (i === new Date().getDate() && currentDate.getMonth() === new Date().getMonth()) {
          currentStreak = tempStreak
        }
      } else {
        tempStreak = 0
      }
    }

    return { currentStreak, longestStreak }
  }

  const { currentStreak, longestStreak } = getStreakInfo()

  const handleMonthChange = (monthName) => {
    const monthIndex = months.indexOf(monthName);
    if (monthIndex !== -1) {
      setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    }
  };

  return (
    <Card className="bg-gradient-to-br from-[#161B22] to-[#1A2233] border-[#30363D] text-[#E5E7EB] overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] relative">
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-[#0070F3]/10 to-transparent blur-[30px] pointer-events-none" />
      
      <CardHeader className="pb-3 border-b border-[#30363D]/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="h-5 w-1 bg-[#0070F3] rounded-full mr-2"></span>
            <CardTitle className="text-xl font-semibold">Learning Streak</CardTitle>
            {currentStreak > 0 && (
              <Badge className="ml-2 bg-gradient-to-r from-[#0070F3]/80 to-[#0070F3]/40 border-none text-white font-normal">
                {currentStreak} day streak 🔥
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Select value={months[currentDate.getMonth()]} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-32 h-8 text-sm bg-[#0D1117] border-[#30363D] text-[#E5E7EB]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB]">
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        {isDataLoading ? (
          <div className="py-4 text-center text-sm text-[#A1A1AA]">
            {!userId ? "Loading user data..." : "Loading calendar data..."}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-1 mb-3">
              {weekdays.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-[#A1A1AA]">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="h-9 rounded-md" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const activity = getActivityForDay(dateString);
                const status = getDayStatus(dateString);
                const hasStatus = status !== undefined;
                const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
                
                return (
                  <TooltipProvider key={day}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          className={`h-9 rounded-md flex items-center justify-center cursor-pointer text-sm relative ${
                            isToday ? "ring-2 ring-[#0070F3] ring-opacity-70" : ""
                          } ${
                            // If API data is available and status is true (has activity), show green background
                            hasStatus && status
                              ? "bg-gradient-to-br from-[#0D4522] to-[#0A3A1C] border border-[#2E6B38] hover:bg-[#2E6B38] text-green-200"
                              // If API data is available and status is false (no activity), show darker background with red tint
                              : hasStatus && !status
                              ? "bg-gradient-to-br from-[#231717] to-[#1A1212] border border-[#3D3030] hover:bg-[#321C1C] text-red-200"
                              // If no API data, fallback to the original styling
                              : activity 
                                ? "bg-gradient-to-br from-[#0D1117] to-[#131b29] border border-[#30363D] hover:bg-[#30363D]" 
                                : "bg-[#0D1117]/50 hover:bg-[#0D1117] border border-[#30363D]/30"
                          } ${selectedDay === dateString ? "ring-2 ring-[#0070F3] ring-opacity-70" : ""}`}
                          whileHover={{ scale: 1.08, boxShadow: (hasStatus && status) || activity ? "0 0 10px rgba(0,112,243,0.15)" : "none" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedDay(dateString)}
                        >
                          {day}
                          {/* Show green circle for days with activity from API */}
                          {/* {hasStatus && status && (
                            <motion.div 
                              initial={{ scale: 0.8 }}
                              animate={{ scale: [0.8, 1.2, 0.8] }} 
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="absolute bottom-1 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(46,200,94,0.7)]" 
                            />
                          )} */}
                          {/* Remove red dot, keeping only red background */}
                          {/* Fallback to blue dot for activity from mock data */}
                          {!hasStatus && activity && (
                            <motion.div 
                              initial={{ scale: 0.8 }}
                              animate={{ scale: [0.8, 1.2, 0.8] }} 
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#0070F3] shadow-[0_0_5px_rgba(0,112,243,0.7)]" 
                            />
                          )}
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="top"
                        align="center"
                        className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB] p-2 shadow-xl"
                      >
                        {hasStatus ? (
                          <div className="py-1">
                            {status ? (
                              <p className="font-medium text-xs text-green-400">Completed learning activity</p>
                            ) : (
                              <p className="font-medium text-xs text-red-400">No learning activity</p>
                            )}
                          </div>
                        ) : activity ? (
                          <div className="py-1">
                            <p className="font-medium text-xs">{activity.name}</p>
                            <div className="flex items-center mt-1 text-xs text-[#A1A1AA]">
                              <Zap className="w-3 h-3 text-[#0070F3] mr-1" />
                              <span>+{activity.xp} XP</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs">No activity</span>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </>
        )}
        
        <div className="mt-5 flex flex-wrap justify-between items-center text-xs">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-[#0D1117] to-[#131b29] border border-[#30363D] text-[#E5E7EB]">
              <Trophy className="w-3 h-3 text-[#0070F3]" />
              <span>Streak: {currentStreak}</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-[#0D1117] to-[#131b29] border border-[#30363D] text-[#E5E7EB]">
              <Target className="w-3 h-3 text-[#0070F3]" />
              <span>Best: {longestStreak}</span>
            </Badge>
          </div>
          <Badge variant="outline" className="flex items-center space-x-1 px-2 py-1 border border-[#30363D]/70 text-[#E5E7EB] bg-[#0D1117]/50">
            <Zap className="w-3 h-3 text-[#0070F3]" />
            <span>XP: {Object.values(learningActivities).reduce((sum, activity) => sum + activity.xp, 0)}</span>
          </Badge>
        </div>
        
        <AnimatePresence>
          {selectedDay && getActivityForDay(selectedDay) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="mt-4 p-4 bg-gradient-to-r from-[#0D1117] to-[#131b29] border border-[#30363D] rounded-md text-sm shadow-lg"
            >
              <div className="flex items-start">
                <div className="bg-[#0070F3]/10 p-1.5 rounded-full mr-3">
                  {getActivityForDay(selectedDay).type === 'challenge' ? (
                    <Trophy className="w-4 h-4 text-[#0070F3]" />
                  ) : getActivityForDay(selectedDay).type === 'practice' ? (
                    <Code className="w-4 h-4 text-[#0070F3]" />
                  ) : (
                    <BookOpen className="w-4 h-4 text-[#0070F3]" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-[#E5E7EB]">{getActivityForDay(selectedDay).name}</h3>
                  <div className="flex items-center text-xs text-[#A1A1AA]">
                    <Zap className="w-3 h-3 text-[#0070F3] mr-1" />
                    <span>Earned {getActivityForDay(selectedDay).xp} XP</span>
                    <span className="mx-2">•</span>
                    <span>{selectedDay}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

