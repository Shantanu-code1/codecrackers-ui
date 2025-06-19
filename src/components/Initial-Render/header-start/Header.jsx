import React, { useState } from 'react'
import { motion } from "framer-motion"
import { Code, LogIn, Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import logo from "../../../img/niqSolve-removebg.png"

const Header = ({openStepsDialog}) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2"
          >
            <a href="/" className='text-xl sm:text-2xl font-bold text-white'>
              <img src={logo} alt="NiqSolve" className="w-[8rem] h-[3rem] sm:w-[10rem] sm:h-[4rem] sm:ml-[3rem] filter drop-shadow-lg" />
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            className="hidden md:flex md:w-[20%]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center justify-between w-full">
              {["Home", "About", "Pricing"].map((item) => (
                <motion.a
                  key={item}
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className={`text-sm font-medium transition-all duration-300 text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.nav>

          {/* Desktop Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex items-center space-x-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={openStepsDialog}
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 border-white/30 backdrop-blur-sm px-6 py-2 rounded-lg transition-all duration-300"
              >
                Try Now
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={()=> navigate("/login")} 
                variant="ghost" 
                className="text-white hover:bg-white/10 backdrop-blur-sm px-6 py-2 rounded-lg transition-all duration-300"
              >
                <LogIn className="h-4 w-4 mr-2" />
                <span>Login</span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
            onClick={toggleMenu}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 backdrop-blur-md bg-white/10 border border-white/20 rounded-b-2xl shadow-2xl md:hidden z-50 mt-2"
            >
              <div className="flex flex-col space-y-4 p-4">
                {["Home", "About", "Pricing"].map((item) => (
                  <motion.a
                    key={item}
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-sm font-medium transition-all duration-300 text-white/80 hover:text-white py-2 px-4 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </motion.a>
                ))}
                <div className="flex flex-col space-y-2 pt-2 border-t border-white/20">
                  <Button
                    onClick={() => {
                      openStepsDialog();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="bg-white/10 text-white hover:bg-white/20 border-white/30 w-full backdrop-blur-sm rounded-lg transition-all duration-300"
                    size="sm"
                  >
                    Try Now
                  </Button>
                  <Button 
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }} 
                    variant="ghost" 
                    className="text-white hover:bg-white/10 w-full backdrop-blur-sm rounded-lg transition-all duration-300"
                    size="sm"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    <span>Login</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
    </header>
  )
}

export default Header
