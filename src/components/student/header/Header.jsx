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
    <header className='relative'>
      <div className={`z-[999] py-[0.5rem] px-4 sm:px-6 lg:px-8 bg-primary absolute w-[80%] left-[10%] top-[1.5rem] rounded-full`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-text flex items-center space-x-2"
          >
            <Link to={userRole === "ROLE_TEACHER" ? "/teacher/dashboard" : "/student/ai-tutor"} className="text-text">
              <img src={logo} alt="NiqSolve" className="w-[8rem] h-[3rem] sm:w-[10rem] sm:h-[4rem]" />
            </Link>
          </motion.div>
          
          <motion.nav
            className="bg-card/90 backdrop-blur-sm px-6 py-[1rem] rounded-full w-[25rem] shadow-lg border border-secondary/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center justify-between">
              {/* Always show navigation - use userRole to determine which links */}
              {userRole === "ROLE_TEACHER" ? (
                <>
                  {["Doubts", "Earnings", "Queries", "Profile"].map((item) => (
                    <motion.div key={item}>
                      <Link
                        to={item === "Queries" 
                          ? `/student/${item.toLowerCase()}`
                          : `/teacher/${item.toLowerCase()}`
                        }
                        className={`text-sm font-medium transition-colors duration-200 ${
                          isActive(item.toLowerCase()) 
                            ? "text-secondary font-semibold" 
                            : "text-text hover:text-secondary"
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
                    <motion.div key={item}>
                      <Link
                        to={`/student/${item.toLowerCase()}`}
                        className={`text-sm font-medium transition-colors duration-200 ${
                          isActive(item.toLowerCase()) 
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
          
        </div>
        
      </div>
    </header>
  )
}

export default Header

