import React, { useState } from 'react'
import { motion } from "framer-motion"
import { Code, LogIn } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import logo from "../../../img/niqSolve-removebg.png"

const Header = ({openStepsDialog}) => {
    const navigate = useNavigate();
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary via-primary/90 to-card border-b border-border">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-text flex items-center space-x-2"
          >
            {/* <Code className="h-8 w-8 text-secondary" /> */}
            <a href="/" className='text-2xl font-bold text-text'>
            <img src={logo} alt="NiqSolve" className="w-[10rem] h-[4rem] ml-[3rem]" />
            {/* NiqSolve */}
            </a>
          </motion.div>
          <motion.nav
            className="w-[20%]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center justify-between">
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
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4"
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
        </div>
    </header>
  )
}

export default Header
