import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Code, Bot, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TryNowStepsDialog } from "./steps-pop-up"
import { useNavigate } from "react-router-dom"
import ImagesCircle from "../circle-animation/index.jsx"
import Header from "../header-start/Header.jsx"
import CustomCursor from "../../../pages/ui/custom-cursor/CustomCursor.jsx"
import PageContainer from '@/components/layout/PageContainer'
import logo from "../../../img/niqSolve2.png"

const Home = () => {
  const [activeTab, setActiveTab] = useState("fast")
  const [isStepsDialogOpen, setIsStepsDialogOpen] = useState(false)
  const navigate = useNavigate()

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const staggerChildren = {
    visible: { transition: { staggerChildren: 0.05 } },
  }

  const openStepsDialog = () => {
    setIsStepsDialogOpen(true)
  }

  const closeStepsDialog = () => {
    setIsStepsDialogOpen(false)
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen flex flex-col relative overflow-hidden">
      {/* Glassmorphism Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      
      {/* Header with Login Button */}
      <Header openStepsDialog={openStepsDialog} />

      <div className="py-6 sm:py-12 flex-grow relative z-10">
        <PageContainer>
          {/* Hero Section */}
          <motion.div
            className="max-w-5xl mx-auto text-center mb-8 sm:mb-16 px-4"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                Learn to <span className="text-cyan-300 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Code</span> Like a Pro
              </h1>
              <p className="mt-3 text-base sm:text-lg md:text-xl text-white/80 sm:mt-5 sm:max-w-xl mx-auto md:mt-5 px-2">
                Master programming with our interactive platform. Get personalized learning paths, AI-powered code reviews, and expert mentorship.
              </p>
              <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center px-4">
                <div className="rounded-xl shadow-lg w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 backdrop-blur-sm px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                    Get Started
                  </Button>
                </div>
                <div className="sm:ml-3 w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Technologies We Cover - Now using ImagesCircle */}
          <motion.div className="max-w-5xl mx-auto mb-8 sm:mb-16 px-4 overflow-visible" initial="hidden" animate="visible" variants={staggerChildren}>
            <motion.h2 variants={fadeIn} className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 sm:mb-8">
              Technologies We Cover
            </motion.h2>
            <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-6 sm:p-8 overflow-visible shadow-xl">
              <ImagesCircle />
            </div>
          </motion.div>

          {/* Why Choose Us */}
          <motion.div className="max-w-5xl mx-auto mb-8 sm:mb-16 px-4" initial="hidden" animate="visible" variants={fadeIn}>
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 sm:mb-8">Why Choose Us?</h2>
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex flex-col sm:flex-row border-b border-white/20">
                <motion.button
                  className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 text-sm font-medium transition-all duration-300 relative ${
                    activeTab === "fast" 
                      ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-white backdrop-blur-sm border-b-2 border-cyan-400" 
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("fast")}
                >
                  Fast Resolution
                </motion.button>
                <motion.button
                  className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 text-sm font-medium transition-all duration-300 relative ${
                    activeTab === "ai" 
                      ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-white backdrop-blur-sm border-b-2 border-cyan-400" 
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("ai")}
                >
                  Human + AI
                </motion.button>
              </div>
              <div className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm">
                <AnimatePresence mode="wait">
                  {activeTab === "fast" && (
                    <motion.div
                      key="fast"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">Lightning-Fast Doubt Resolution</h3>
                      <p className="text-sm sm:text-base text-white/80">
                        Our expert teachers provide quick and accurate solutions to your doubts, ensuring you never get
                        stuck in your learning journey.
                      </p>
                    </motion.div>
                  )}
                  {activeTab === "ai" && (
                    <motion.div
                      key="ai"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">Human Expertise + AI Efficiency</h3>
                      <p className="text-sm sm:text-base text-white/80">
                        We combine the knowledge of human teachers with the speed of AI, ensuring personalized, accurate
                        answers with 24/7 availability.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* AI Offering */}
          <motion.div className="max-w-5xl mx-auto mb-8 sm:mb-16 px-4" initial="hidden" animate="visible" variants={fadeIn}>
            <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl shadow-2xl p-4 sm:p-8 text-white overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 opacity-50"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                  backgroundSize: ["100% 100%", "200% 200%"],
                }}
                transition={{
                  duration: 15,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Our AI Advantage</h2>
                <p className="text-base sm:text-lg mb-6 text-white/80">
                  Get access to our powerful AI doubt solver, free with your subscription!
                </p>
                <motion.div
                  className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-lg"
                  whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 flex-shrink-0" />
                  <div>
                    <span className="text-base sm:text-lg font-semibold text-white block">24/7 AI-powered assistance</span>
                    <p className="text-sm text-white/80">Always available to help you overcome coding challenges</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Free Queries - Updated CTA */}
          <motion.div
            className="max-w-5xl mx-auto text-center mb-8 sm:mb-16 px-4"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 sm:p-12 shadow-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Start Your Learning Journey Today</h2>
              <p className="text-lg sm:text-xl text-white/80 mb-6 sm:mb-8">Get your first query resolved absolutely free!</p>
              <motion.button
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 sm:px-8 py-3 rounded-full font-medium text-base sm:text-lg shadow-lg w-full sm:w-auto backdrop-blur-sm border border-white/20"
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(6, 182, 212, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={openStepsDialog}
              >
                Try Now - It's Free!
              </motion.button>
            </div>
          </motion.div>
        </PageContainer>
      </div>

      {/* Footer Section - Update with glassmorphism */}
      <footer className="backdrop-blur-md bg-white/10 border-t border-white/20 text-white py-6 sm:py-8 px-4 w-full relative">
        <PageContainer>
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
            <div className="w-full md:w-1/3 text-center md:text-left">
              <img src={logo} alt="NiqSolve" className="w-[8rem] h-[2.5rem] sm:w-[10rem] sm:h-[3rem] sm:ml-[-1rem] mx-auto md:mx-0" />
              <p className="text-sm text-white/70">Empowering students through instant doubt resolution</p>
            </div>
            <div className="w-full md:w-1/3 text-center">
              <h4 className="text-base sm:text-lg font-semibold mb-2">Quick Links</h4>
              <ul className="text-sm space-y-1">
                <li>
                  <a href="#" className="text-white/70 hover:text-cyan-400 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-cyan-400 transition-colors">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-cyan-400 transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/3 text-center md:text-right">
              <h4 className="text-base sm:text-lg font-semibold mb-2">Follow Us</h4>
              <div className="flex justify-center md:justify-end space-x-4">
                <a href="#" className="text-white/70 hover:text-cyan-400 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-white/70 hover:text-cyan-400 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
                <a href="#" className="text-white/70 hover:text-cyan-400 transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </PageContainer>
      </footer>

      {/* Try Now Steps Dialog */}
      <TryNowStepsDialog isOpen={isStepsDialogOpen} onClose={closeStepsDialog} />
      <CustomCursor />
    </div>
  )
}

export default Home

