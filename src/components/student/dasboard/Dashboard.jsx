import { useState, useEffect, useRef, useMemo, lazy, Suspense } from "react"
import { motion } from "framer-motion"
import { Search, Brain, Rocket, Users, Sparkles, Flame, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Header from "../header/Header"
import { ChevronDown } from "lucide-react"
import ProblemOfTheDay from "./ProblemOfTheDay"
import LearningStreakCalendar from "./Calender"
import signuporloginStore from "../../../zustand/login-signup/store";
import { useUserProfile } from '../../../hooks/useUserProfile'
import { useRecentDoubts } from '../../../hooks/useRecentDoubts'
import { useMonthlyStatus } from '../../../hooks/useMonthlyStatus'

// Lazy load the chart component to avoid build issues
const ChartComponent = lazy(() => import('./ChartComponent'))

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const getStartingDay = (month, year) => {
  return new Date(year, month - 1, 1).getDay();
};

// Add fallback data for recent doubts
const fallbackDoubts = [
  {
    id: 1,
    title: "Getting issue while solving array",
    category: "Array",
    timeAgo: "2 hours ago",
    status: "Answered",
    replyCount: 3,
    isNew: false
  },
  {
    id: 2,
    title: "Optimizing dynamic programming solution",
    category: "DP",
    timeAgo: "5 hours ago",
    status: "Pending",
    replyCount: 0,
    isNew: true
  },
  {
    id: 3,
    title: "Implementing Dijkstra's algorithm",
    category: "Graph",
    timeAgo: "1 day ago",
    status: "Answered",
    replyCount: 5,
    isNew: false
  }
];

export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState("doubts")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [timeRange, setTimeRange] = useState("month");
  
  // Use the custom hooks to fetch user profile and recent doubts data
  const { profileData, isLoading: isProfileLoading, error: profileError } = useUserProfile()
  const { doubtsData, isLoading: isDoubtsLoading, error: doubtsError } = useRecentDoubts(3)
  
  // --- Fetching POTD Status Data ---
  const today = new Date();
  const currentMonthIndex = today.getMonth() + 1;
  const currentYearForHook = selectedYear; // Use selectedYear for consistency
  
  // Fetch current month data
  const { 
    monthlyStatusMap: currentMonthStatus, 
    isLoading: isCurrentMonthPotdLoading, 
    userId 
  } = useMonthlyStatus(currentMonthIndex, currentYearForHook);

  // Determine previous month and year
  const prevMonthDate = new Date(today);
  prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
  const prevMonthIndex = prevMonthDate.getMonth() + 1;
  const prevMonthYear = prevMonthDate.getFullYear(); // Could be previous year
  
  // Fetch previous month data (only if needed - check if year matches selectedYear if you add year selector)
  const { 
    monthlyStatusMap: prevMonthStatus, 
    isLoading: isPrevMonthPotdLoading 
  } = useMonthlyStatus(prevMonthIndex, prevMonthYear, { enabled: !!userId }); // Only fetch if userId is available

  // Combined loading state for POTD data
  const isPotdLoading = isCurrentMonthPotdLoading || isPrevMonthPotdLoading;
  // --- End Fetching ---

  // --- Aggregating Monthly Data (Calculate XP) ---
  const monthlyChartData = useMemo(() => {
    if (isPotdLoading || !userId || !currentMonthStatus) {
        // Return empty structure with xp field
        return shortMonths.map(m => ({ time: m, xp: 0 })); 
    }
    const aggregated = shortMonths.map((monthName, index) => {
        let solvedCount = 0;
        const monthNum = index + 1;
        if (monthNum === currentMonthIndex && currentMonthStatus) { 
            Object.keys(currentMonthStatus).forEach(dateString => {
                if (currentMonthStatus[dateString] === true) {
                    solvedCount++;
                }
            });
        }
        // Calculate XP: solved count * 50
        return { time: monthName, xp: solvedCount * 50 }; 
    });
    console.log("Generated Monthly Chart Data (XP):", aggregated);
    return aggregated;
  }, [currentMonthStatus, isPotdLoading, userId, selectedYear, currentMonthIndex]);
  
  // --- Aggregating Weekly Data (Last 7 Days - Calculate XP) ---
  const weeklyChartData = useMemo(() => {
    if (isPotdLoading || !userId || (!currentMonthStatus && !prevMonthStatus)) {
      return [];
    }
    const last7DaysData = [];
    const weekdaysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayOfWeek = weekdaysShort[date.getDay()];
      const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      let solved = false;
      if (month === currentMonthIndex && currentMonthStatus) {
        solved = currentMonthStatus[dateString] === true;
      } else if (month === prevMonthIndex && prevMonthStatus) {
        solved = prevMonthStatus[dateString] === true;
      }
      // Assign 50 XP if solved, 0 otherwise
      last7DaysData.push({ 
        time: `${dayOfWeek} ${day}`, 
        xp: solved ? 50 : 0 
      });
    }
    console.log("Generated Weekly Chart Data (XP):", last7DaysData);
    return last7DaysData;
  }, [currentMonthStatus, prevMonthStatus, isPotdLoading, userId, currentMonthIndex, prevMonthIndex, today]);
  // --- End Data Aggregation ---

  const displayDoubts = (doubtsData && doubtsData.length > 0) ? doubtsData : 
    (doubtsError ? fallbackDoubts : []);
  
  // Log when data changes
  useEffect(() => {
    console.log("Current profile data:", profileData)
    console.log("Current doubts data:", displayDoubts)
    console.log("Current POTD Status (Current Month):", currentMonthStatus)
    console.log("Current POTD Status (Prev Month):", prevMonthStatus)
  }, [profileData, displayDoubts, currentMonthStatus, prevMonthStatus])

  // Chart data determined by timeRange (only month is dynamic now)
  const chartData = timeRange === "week" ? weeklyChartData : monthlyChartData;

  // You can use isLoading to show a loading state
  if (isProfileLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <p>Loading your dashboard...</p>
    </div>
  }

  // Replace the renderDoubtsSection function:
  const renderDoubtsSection = () => {
    return (
      <Card className="lg:col-span-2 bg-gradient-to-br from-[#161B22] to-[#1A2233] border-[#30363D] text-[#E5E7EB] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)] relative">
        <div className="absolute top-0 left-0 h-20 w-20 bg-gradient-to-br from-[#8884d8]/10 to-transparent rounded-br-[100%] pointer-events-none" />
        
        <CardHeader className="border-b border-[#30363D]/50 pb-3">
          <CardTitle className="text-2xl font-bold text-[#E5E7EB] flex items-center">
            <span className="mr-2 bg-[#0070F3] h-5 w-1 rounded-full"></span>
            Recent Doubts
            {doubtsError && <span className="ml-2 text-xs text-yellow-400">(Using cached data)</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-[#30363D] scrollbar-track-transparent">
              <motion.button
                key="Doubts"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter("doubts")}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  selectedFilter === "doubts"
                    ? "bg-gradient-to-r from-[#0070F3] to-[#0070F3]/80 text-white shadow-[0_0_15px_rgba(0,112,243,0.3)]"
                    : "bg-[#161B22] hover:bg-[#30363D]/70 text-[#E5E7EB] border border-[#30363D]"
                }`}
              >
                Doubts
              </motion.button>
              <motion.button
                key="Queries"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter("queries")}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  selectedFilter === "queries"
                    ? "bg-gradient-to-r from-[#0070F3] to-[#0070F3]/80 text-white shadow-[0_0_15px_rgba(0,112,243,0.3)]"
                    : "bg-[#161B22] hover:bg-[#30363D]/70 text-[#E5E7EB] border border-[#30363D]"
                }`}
              >
                Queries
              </motion.button>
              <motion.button
                key="AI"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter("ai")}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  selectedFilter === "ai"
                    ? "bg-gradient-to-r from-[#0070F3] to-[#0070F3]/80 text-white shadow-[0_0_15px_rgba(0,112,243,0.3)]"
                    : "bg-[#161B22] hover:bg-[#30363D]/70 text-[#E5E7EB] border border-[#30363D]"
                }`}
              >
                AI
              </motion.button>
            </div>
            <div className="space-y-3">
              {isDoubtsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0070F3]"></div>
                </div>
              ) : displayDoubts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-[#A1A1AA]">No recent doubts found</p>
                  <Button 
                    variant="ghost" 
                    className="mt-4 text-[#0070F3] hover:text-[#0070F3] hover:bg-[#0070F3]/10 flex items-center"
                  >
                    Ask a Doubt <span className="ml-1">→</span>
                  </Button>
                </div>
              ) : (
                displayDoubts.map((doubt, index) => (
                  <EnhancedDoubtItem
                    key={doubt.id || index}
                    title={doubt.title}
                    category={doubt.category}
                    time={doubt.timeAgo || "Recently"}
                    status={doubt.status}
                    replies={doubt.replyCount || 0}
                    isNew={doubt.isNew || false}
                  />
                ))
              )}
            </div>
          </div>
        </CardContent>
        <div className="p-4 border-t border-[#30363D]/50 flex justify-center">
          <Button 
            variant="ghost" 
            className="text-[#0070F3] hover:text-[#0070F3] hover:bg-[#0070F3]/10 flex items-center"
          >
            View All Doubts <span className="ml-1">→</span>
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D1117] via-[#111827] to-[#0D1117] text-[#E5E7EB] p-6 relative overflow-hidden">
      {/* Add subtle background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/4 bg-gradient-to-b from-[#0070F3]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-gradient-to-t from-[#8884d8]/5 to-transparent rounded-full blur-[150px] pointer-events-none" />
      
      <Header />

      {/* Enhanced welcome section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mt-[7rem] mb-8 relative"
      >
        <div className="relative">
          <h1 className="text-3xl font-semibold text-[#E5E7EB] flex items-center">
            Hello, {profileData?.name}!
            <div className="ml-3 flex items-center px-2 py-1 bg-[#0070F3]/10 rounded-full text-sm font-normal">
              <Flame className="w-4 h-4 text-[#0070F3] mr-1" /> 8 day streak
            </div>
          </h1>
          <div className="flex items-center mt-3">
            <div className="w-48 h-2 bg-[#161B22] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#0070F3] to-[#3b82f6] w-[65%]" />
            </div>
            <p className="text-[#A1A1AA] text-xs ml-3">65% to Level 16</p>
          </div>
          <p className="text-[#A1A1AA] mt-3">Ready to crack some code today?</p>
        </div>
        
        <div className="flex gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative w-[20rem] bg-gradient-to-r from-[#161B22] to-[#1A2233] rounded-full border border-[#30363D] overflow-hidden shadow-[0_0_15px_rgba(0,112,243,0.1)]"
          >
            <Search height={20} width={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A1A1AA]" />
            <Input placeholder="Search doubts" className="pl-10 bg-transparent border-none text-[#E5E7EB] focus:ring-[#0070F3]/30" />
          </motion.div>
        </div>
      </motion.div>

      {/* Main content grid with staggered animation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6"
      >
        <div className="space-y-6">
          {/* Updated coding progress card */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-[#161B22] to-[#1A2233] border-[#30363D] text-[#E5E7EB] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)] relative">
            <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-br from-[#0070F3]/20 to-transparent rounded-bl-[100%] pointer-events-none" />
            
            <CardHeader className="border-b border-[#30363D]/50 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold text-[#E5E7EB] flex items-center">
                  <span className="mr-2 bg-[#0070F3] h-5 w-1 rounded-full"></span>
                  POTD XP Earned
                </CardTitle>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={isPotdLoading}
                    className={`text-xs ${timeRange === "week" 
                      ? "text-white bg-[#0070F3]/20 hover:bg-[#0070F3]/30"
                      : "text-[#A1A1AA] hover:text-[#E5E7EB] hover:bg-[#30363D]"} disabled:opacity-50`}
                    onClick={() => setTimeRange("week")}
                  >
                    Week
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={isPotdLoading}
                    className={`text-xs ${timeRange === "month" 
                      ? "text-white bg-[#0070F3]/20 hover:bg-[#0070F3]/30"
                      : "text-[#A1A1AA] hover:text-[#E5E7EB] hover:bg-[#30363D]"} disabled:opacity-50`}
                    onClick={() => setTimeRange("month")}
                  >
                    Month
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-5 relative">
              <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#0070F3]/5 rounded-full blur-[80px] pointer-events-none" />
              
              {isPotdLoading ? (
                <div className="h-[300px] flex justify-center items-center text-[#A1A1AA]">Loading Chart Data...</div>
              ) : ( 
                <Suspense fallback={<div className="h-[300px] flex justify-center items-center text-[#A1A1AA]">Loading Chart Data...</div>}>
                  <ChartComponent data={chartData} />
                </Suspense>
              )}
              
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#30363D]/30">
                <div className="text-center">
                  <p className="text-[#A1A1AA] text-xs mb-1">{timeRange === 'week' ? 'Total XP (Last 7d)' : 'Total XP (Year)'}</p>
                  <p className="text-xl font-semibold text-white">
                    {isPotdLoading ? '-' : chartData.reduce((sum, item) => sum + item.xp, 0)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[#A1A1AA] text-xs mb-1">{timeRange === 'week' ? 'XP Today' : 'XP This Month'}</p>
                  <p className="text-xl font-semibold text-white">
                    {isPotdLoading ? '-' : 
                      (timeRange === 'week' 
                        ? weeklyChartData[weeklyChartData.length - 1]?.xp ?? 0
                        : monthlyChartData.find(m => m.time === shortMonths[currentMonthIndex - 1])?.xp ?? 0
                      )}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[#A1A1AA] text-xs mb-1">{timeRange === 'week' ? 'Best Day (XP)' : 'Best Month (XP)'}</p>
                  <p className="text-xl font-semibold text-white">
                    {isPotdLoading ? '-' : Math.max(...chartData.map(item => item.xp))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Doubts Section */}
          {renderDoubtsSection()}
        </div>

        <div className="space-y-6">
          <LearningStreakCalendar />
          <ProblemOfTheDay />
        </div>
      </motion.div>
    </div>
  )
}

function EnhancedDoubtItem({ title, category, time, status, replies, isNew }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
      className="flex items-start p-4 bg-gradient-to-r from-[#161B22] to-[#1A2233] rounded-lg border border-[#30363D]/70 shadow-md transition-all duration-200 relative overflow-hidden"
    >
      {isNew && (
        <div className="absolute top-0 right-0">
          <div className="bg-[#0070F3] text-white text-xs py-0.5 px-2 transform rotate-45 translate-y-2 translate-x-6 shadow-md">
            New
          </div>
        </div>
      )}
      
      <div className="flex-1">
        <div className="flex items-center">
          <h3 className="font-semibold text-[#E5E7EB]">{title}</h3>
          {status === "Answered" && (
            <Sparkles className="w-3 h-3 text-[#0070F3] ml-2" />
          )}
        </div>
        <div className="flex items-center mt-2">
          <span className="bg-[#0D1117] px-2 py-0.5 rounded-full text-xs mr-2 border border-[#30363D]">{category}</span>
          <span className="text-xs text-[#A1A1AA]">{time}</span>
          {replies > 0 && (
            <div className="ml-auto flex items-center text-xs text-[#A1A1AA]">
              <span className="mr-1">{replies}</span>
              <span>replies</span>
            </div>
          )}
        </div>
      </div>
      <div className="ml-4">
        <span
          className={`px-3 py-1 text-xs rounded-full shadow-inner ${
            status === "Answered" 
              ? "bg-gradient-to-r from-[#044a2c] to-[#065f38] text-green-100 border border-green-700/30" 
              : "bg-gradient-to-r from-[#5e4409] to-[#725609] text-yellow-100 border border-yellow-700/30"
          }`}
        >
          {status}
        </span>
      </div>
    </motion.div>
  )
}

