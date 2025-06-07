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
    <header className="py-4 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary via-primary/90 to-card border-b border-border">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-2xl font-bold text-text flex items-center space-x-2"
          >
            <a href="/" className='text-xl sm:text-2xl font-bold text-text'>
              <img src={logo} alt="NiqSolve" className="w-[8rem] h-[3rem] sm:w-[10rem] sm:h-[4rem] sm:ml-[3rem]" />
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
                  className={`text-sm font-medium transition-colors duration-200 text-text hover:text-secondary`}
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
                className="bg-card text-secondary hover:bg-card/90 border-secondary"
              >
                Try Now
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={()=> navigate("/login")} variant="ghost" className="text-text hover:bg-card/80">
                <LogIn className="h-4 w-4 mr-2" />
                <span>Login</span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-md text-text hover:bg-card/80"
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
              className="absolute top-full left-0 right-0 bg-card border border-border rounded-b-lg shadow-lg md:hidden z-50"
            >
              <div className="flex flex-col space-y-4 p-4">
                {["Home", "About", "Pricing"].map((item) => (
                  <motion.a
                    key={item}
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-sm font-medium transition-colors duration-200 text-text hover:text-secondary py-2 px-4 rounded hover:bg-primary/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </motion.a>
                ))}
                <div className="flex flex-col space-y-2 pt-2 border-t border-border">
                  <Button
                    onClick={() => {
                      openStepsDialog();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="bg-card text-secondary hover:bg-card/90 border-secondary w-full"
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
                    className="text-text hover:bg-card/80 w-full"
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
