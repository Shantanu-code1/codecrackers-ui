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
    <header className='fixed top-0 left-0 right-0 z-50 flex justify-center'>
      {/* Centered Rounded Header Container */}
      <motion.div 
        className="bg-gradient-to-r from-[#161B22]/95 to-[#1A2233]/95 backdrop-blur-md rounded-full shadow-lg border border-[#30363D]/30 mt-4 mx-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 w-[23rem] sm:w-96 md:min-w-[1000px] md:max-w-9xl">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center flex-shrink-0"
          >
            <Link to={userRole === "ROLE_TEACHER" ? "/teacher/dashboard" : "/student/ai-tutor"} className="text-text">
              <img src={logo} alt="NiqSolve" className="w-20 h-8 sm:w-24 sm:h-9 object-contain" />
            </Link>
          </motion.div>
          
          {/* Navigation Items - Desktop */}
          <motion.nav
            className="hidden md:flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center space-x-10">
              {userRole === "ROLE_TEACHER" ? (
                <>
                  {["Doubts", "Earnings", "Queries", "Profile"].map((item, index) => (
                    <motion.div 
                      key={item}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={item === "Queries" 
                          ? `/student/${item.toLowerCase()}`
                          : `/teacher/${item.toLowerCase()}`
                        }
                        className={`text-xs lg:text-sm font-medium transition-all duration-200 px-4 py-2 rounded-lg whitespace-nowrap ${
                          isActive(item.toLowerCase()) 
                            ? "text-[#0070F3] font-semibold" 
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
                  {["AI-Tutor", "Doubts", "Queries", "Profile"].map((item, index) => (
                    <motion.div 
                      key={item}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={`/student/${item.toLowerCase()}`}
                        className={`text-xs lg:text-sm font-medium transition-all duration-200 px-4 py-2 rounded-lg whitespace-nowrap ${
                          isActive(item.toLowerCase()) 
                            ? "text-secondary font-semibold" 
                            : "text-text hover:text-secondary hover:bg-secondary/5"
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
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-[#E5E7EB] hover:text-[#0070F3] hover:bg-[#0070F3]/10 p-2"
              onClick={() => {
                // You can add mobile menu toggle logic here
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Mobile Navigation - Dropdown */}
      <motion.div 
        className="md:hidden fixed top-20 left-4 right-4 bg-gradient-to-r from-[#161B22]/95 to-[#1A2233]/95 backdrop-blur-md border border-[#30363D]/30 rounded-2xl shadow-lg"
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
                  className={`block text-xs font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
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
                  className={`block text-xs font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
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
    </header>
  )
}

export default Header

