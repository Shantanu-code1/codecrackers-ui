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
    <div className="bg-gradient-to-b from-primary via-background to-primary/90 min-h-screen flex flex-col">
      {/* Header with Login Button */}
      <Header openStepsDialog={openStepsDialog} />

      <div className="py-12 flex-grow">
        <PageContainer>
          {/* Hero Section */}
          <motion.div
            className="max-w-5xl mx-auto text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl md:text-6xl">
              Learn to <span className="text-secondary">Code</span> Like a Pro
            </h1>
            <p className="mt-3 text-base text-text-muted sm:mt-5 sm:text-lg sm:max-w-xl mx-auto md:mt-5 md:text-xl">
              Master programming with our interactive platform. Get personalized learning paths, AI-powered code reviews, and expert mentorship.
            </p>
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
              <div className="rounded-md shadow">
                <Button className="w-full bg-accent hover:bg-accent/90">
                  Get Started
                </Button>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Button variant="outline" className="w-full border-secondary text-secondary">
                  Learn More
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Technologies We Cover - Now using ImagesCircle */}
          <motion.div className="max-w-5xl mx-auto mb-16" initial="hidden" animate="visible" variants={staggerChildren}>
            <motion.h2 variants={fadeIn} className="text-3xl font-bold text-text text-center mb-8">
              Technologies We Cover
            </motion.h2>
            <ImagesCircle />
          </motion.div>

          {/* Why Choose Us */}
          <motion.div className="max-w-5xl mx-auto mb-16" initial="hidden" animate="visible" variants={fadeIn}>
            <h2 className="text-3xl font-bold text-[#E5E7EB] text-center mb-8">Why Choose Us?</h2>
            <div className="bg-[#161B22] rounded-lg shadow-xl overflow-hidden border border-[#30363D]">
              <div className="flex border-b border-[#30363D]">
                <motion.button
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-colors duration-300 ${
                    activeTab === "fast" ? "bg-[#0070F3] text-white" : "bg-[#161B22] text-[#A1A1AA]"
                  }`}
                  onClick={() => setActiveTab("fast")}
                >
                  Fast Resolution
                </motion.button>
                <motion.button
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-colors duration-300 ${
                    activeTab === "ai" ? "bg-[#0070F3] text-white" : "bg-[#161B22] text-[#A1A1AA]"
                  }`}
                  onClick={() => setActiveTab("ai")}
                >
                  Human + AI
                </motion.button>
              </div>
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeTab === "fast" && (
                    <motion.div
                      key="fast"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-xl font-semibold mb-3 text-[#E5E7EB]">Lightning-Fast Doubt Resolution</h3>
                      <p className="text-[#A1A1AA]">
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
                      <h3 className="text-xl font-semibold mb-3 text-[#E5E7EB]">Human Expertise + AI Efficiency</h3>
                      <p className="text-[#A1A1AA]">
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
          <motion.div className="max-w-5xl mx-auto mb-16" initial="hidden" animate="visible" variants={fadeIn}>
            <div className="bg-[#161B22] rounded-lg shadow-xl p-8 text-[#E5E7EB] overflow-hidden relative border border-[#30363D]">
              <motion.div
                className="absolute inset-0 bg-[#0070F3] opacity-5"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                  backgroundSize: ["100% 100%", "200% 200%"],
                }}
                transition={{
                  duration: 15,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%230070F3" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E")',
                }}
              />
              <h2 className="text-2xl font-bold mb-4 relative text-[#E5E7EB]">Our AI Advantage</h2>
              <p className="text-lg mb-6 relative text-[#A1A1AA]">
                Get access to our powerful AI doubt solver, free with your subscription!
              </p>
              <motion.div
                className="flex items-center space-x-4 bg-[#0D1117] p-4 rounded-lg relative border border-[#30363D]"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Bot className="h-8 w-8 text-[#0070F3]" />
                <div>
                  <span className="text-lg font-semibold text-[#E5E7EB]">24/7 AI-powered assistance</span>
                  <p className="text-sm text-[#A1A1AA]">Always available to help you overcome coding challenges</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Free Queries - Updated CTA */}
          <motion.div
            className="max-w-5xl mx-auto text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-[#E5E7EB] mb-4">Start Your Learning Journey Today</h2>
            <p className="text-xl text-[#A1A1AA] mb-8">Get your first query resolved absolutely free!</p>
            <motion.button
              className="bg-[#0070F3] hover:bg-[#0070F3]/90 text-white px-8 py-3 rounded-full font-medium text-lg shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(0, 112, 243, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={openStepsDialog}
            >
              Try Now - It's Free!
            </motion.button>
          </motion.div>
        </PageContainer>
      </div>

      {/* Footer Section - Update with border */}
      <footer className="bg-[#0D1117] text-[#E5E7EB] py-8 px-4 w-full relative">
        {/* Add gradient border effect matching header */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>
        
        <PageContainer>
          <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <img src={logo} alt="NiqSolve" className="w-[10rem] h-[3rem] ml-[-1rem]" />
              <p className="text-sm text-[#A1A1AA]">Empowering students through instant doubt resolution</p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
              <ul className="text-sm">
                <li>
                  <a href="#" className="text-[#A1A1AA] hover:text-[#0070F3]">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#A1A1AA] hover:text-[#0070F3]">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#A1A1AA] hover:text-[#0070F3]">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-[#A1A1AA] hover:text-[#0070F3]">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-[#A1A1AA] hover:text-[#0070F3]">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
                <a href="#" className="text-[#A1A1AA] hover:text-[#0070F3]">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </PageContainer>
      </footer>

      {/* Steps Dialog */}
      <TryNowStepsDialog isOpen={isStepsDialogOpen} onClose={closeStepsDialog} />
      <CustomCursor />
    </div>
  )
}

export default Home

