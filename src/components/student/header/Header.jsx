import React from 'react'
import { motion } from "framer-motion"
import { Code, LogIn, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import signuporloginStore from '@/zustand/login-signup/store'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logo from "../../../img/niqSolve-removebg.png"

const Header = () => {
  // Get user data and logout function from store
  const userData = signuporloginStore(state => state.userData);
  const logout = signuporloginStore(state => state.logout);
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  
  // Determine user role from store or use fallback
  const userRole = userData?.role || "ROLE_STUDENT"; // Fallback to student if no role
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname.includes(path.toLowerCase());
  };

  console.log("Current user data:", userData); // Add this to debug

  return (
    <header className='fixed top-0 left-0 right-0 z-50'>
      <div className="bg-gradient-to-r from-[#0D1117]/95 via-[#161B22]/95 to-[#0D1117]/95 backdrop-blur-md border-b border-[#30363D]/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            {/* Logo Section - Mobile Optimized */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <Link to={userRole === "ROLE_TEACHER" ? "/teacher/dashboard" : "/student/ai-tutor"} className="text-text">
                <img src={logo} alt="NiqSolve" className="w-[6rem] h-[2.5rem] sm:w-[8rem] sm:h-[3rem] object-contain" />
              </Link>
            </motion.div>
            
            {/* Navigation - Mobile Optimized */}
            <motion.nav
              className="hidden md:flex bg-gradient-to-r from-[#161B22]/90 to-[#1A2233]/90 backdrop-blur-sm px-4 lg:px-6 py-2 lg:py-3 rounded-full shadow-lg border border-[#30363D]/30"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="flex items-center space-x-6 lg:space-x-8">
                {/* Always show navigation - use userRole to determine which links */}
                {userRole === "ROLE_TEACHER" ? (
                  <>
                    {["Doubts", "Earnings", "Queries", "Profile"].map((item) => (
                      <motion.div 
                        key={item}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to={item === "Queries" 
                            ? `/student/${item.toLowerCase()}`
                            : `/teacher/${item.toLowerCase()}`
                          }
                          className={`text-sm lg:text-base font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                            isActive(item.toLowerCase()) 
                              ? "text-[#0070F3] bg-[#0070F3]/10 font-semibold border border-[#0070F3]/30" 
                              : "text-[#E5E7EB] hover:text-[#0070F3] hover:bg-[#0070F3]/5"
                          }`}
                        >
                          {item}
                        </Link>
                      </motion.div>
                    ))}
                  </>
                ) : (
                  <>
                    {["AI-Tutor", "Doubts", "Queries", "Profile"].map((item) => (
                      <motion.div 
                        key={item}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to={`/student/${item.toLowerCase()}`}
                          className={`text-sm lg:text-base font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                            isActive(item.toLowerCase()) 
                              // ? "text-[#0070F3] bg-[#0070F3]/10 font-semibold border border-[#0070F3]/30" 
                              // : "text-[#E5E7EB] hover:text-[#0070F3] hover:bg-[#0070F3]/5"
                              ? "text-secondary font-semibold" 
                            : "text-text hover:text-secondary"
                          }`}
                        >
                          {item}
                        </Link>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>
            </motion.nav>

            {/* Mobile Menu Button */}
            <motion.div 
              className="md:hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-[#E5E7EB] hover:text-[#0070F3] hover:bg-[#0070F3]/10 p-2"
                onClick={() => {
                  // You can add mobile menu toggle logic here
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Mobile Navigation - Hidden by default, can be toggled */}
        <motion.div 
          className="md:hidden bg-gradient-to-r from-[#161B22]/95 to-[#1A2233]/95 backdrop-blur-md border-t border-[#30363D]/30"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          style={{ display: "none" }} // Toggle this based on mobile menu state
        >
          <div className="px-4 py-3 space-y-2">
            {userRole === "ROLE_TEACHER" ? (
              <>
                {["Doubts", "Earnings", "Queries", "Profile"].map((item) => (
                  <Link
                    key={item}
                    to={item === "Queries" 
                      ? `/student/${item.toLowerCase()}`
                      : `/teacher/${item.toLowerCase()}`
                    }
                    className={`block text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                      isActive(item.toLowerCase()) 
                        ? "text-[#0070F3] bg-[#0070F3]/10 font-semibold border border-[#0070F3]/30" 
                        : "text-[#E5E7EB] hover:text-[#0070F3] hover:bg-[#0070F3]/5"
                    }`}
                  >
                    {item}
                  </Link>
                ))}
              </>
            ) : (
              <>
                {["AI-Tutor", "Doubts", "Queries", "Profile"].map((item) => (
                  <Link
                    key={item}
                    to={`/student/${item.toLowerCase()}`}
                    className={`block text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                      isActive(item.toLowerCase()) 
                        ? "text-[#0070F3] bg-[#0070F3]/10 font-semibold border border-[#0070F3]/30" 
                        : "text-[#E5E7EB] hover:text-[#0070F3] hover:bg-[#0070F3]/5"
                    }`}
                  >
                    {item}
                  </Link>
                ))}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </header>
  )
}

export default Header

