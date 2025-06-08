import React, { useState } from 'react'
import { motion } from "framer-motion"
import { Code, LogIn, LogOut, Menu, X } from 'lucide-react'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  console.log("Current user data:", userData); // Add this to debug

  return (
    <header className='fixed top-0 left-0 right-0 z-50 flex justify-center'>
      {/* Centered Rounded Header Container */}
      <motion.div 
        className="bg-gradient-to-r from-[#161B22]/95 to-[#1A2233]/95 backdrop-blur-md rounded-full shadow-lg border border-[#30363D]/30 mt-3 sm:mt-4 mx-3 sm:mx-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 py-3 w-[20rem] sm:w-[24rem] md:w-[42rem] lg:w-[50rem] xl:w-[60rem] 2xl:max-w-7xl">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center flex-shrink-0"
          >
            <Link to={userRole === "ROLE_TEACHER" ? "/teacher/dashboard" : "/student/ai-tutor"} className="text-text">
              <img src={logo} alt="NiqSolve" className="w-16 h-7 sm:w-20 sm:h-8 md:w-24 md:h-9 lg:w-28 lg:h-10 object-contain" />
            </Link>
          </motion.div>
          
          {/* Navigation Items - Desktop & Tablet */}
          <motion.nav
            className="hidden md:flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center space-x-4 md:space-x-6 lg:space-x-8 xl:space-x-10">
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
                        className={`text-xs md:text-sm lg:text-base font-medium transition-all duration-200 px-2 md:px-3 lg:px-4 py-2 rounded-lg whitespace-nowrap ${
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
                        className={`text-xs md:text-sm lg:text-base font-medium transition-all duration-200 px-2 md:px-3 lg:px-4 py-2 rounded-lg whitespace-nowrap ${
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
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Mobile Navigation - Dropdown */}
      <motion.div 
        className="md:hidden fixed top-16 sm:top-20 left-3 right-3 sm:left-4 sm:right-4 bg-gradient-to-r from-[#161B22]/95 to-[#1A2233]/95 backdrop-blur-md border border-[#30363D]/30 rounded-2xl shadow-lg"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isMobileMenuOpen ? "auto" : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
        exit={{ height: 0, opacity: 0 }}
        style={{ display: isMobileMenuOpen ? "block" : "none" }}
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
                  className={`block text-sm font-medium transition-all duration-200 px-3 py-3 rounded-lg ${
                    isActive(item.toLowerCase()) 
                      ? "text-[#0070F3] bg-[#0070F3]/10 font-semibold border border-[#0070F3]/30" 
                      : "text-[#E5E7EB] hover:text-[#0070F3] hover:bg-[#0070F3]/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
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
                  className={`block text-sm font-medium transition-all duration-200 px-3 py-3 rounded-lg ${
                    isActive(item.toLowerCase()) 
                      ? "text-[#0070F3] bg-[#0070F3]/10 font-semibold border border-[#0070F3]/30" 
                      : "text-[#E5E7EB] hover:text-[#0070F3] hover:bg-[#0070F3]/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
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

