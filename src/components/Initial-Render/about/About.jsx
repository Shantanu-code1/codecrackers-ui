"use client"

import { motion } from "framer-motion"
import { Code, Users, BookOpen, Zap } from "lucide-react"
import Header from "../header-start/Header"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const About = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen relative overflow-hidden">
      {/* Glassmorphism Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      <div className="absolute top-3/4 left-1/6 w-64 h-64 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-2xl"></div>
      
      <Header />

      <main className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {/* Hero Section */}
          <motion.div variants={fadeIn} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl mb-8 sm:mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
              About <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">niqSolve</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 px-2">
              Empowering students through instant doubt resolution and expert guidance in DSA and coding challenges.
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <motion.div 
              className="backdrop-blur-md bg-white/10 border border-white/20 p-4 sm:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-3 rounded-xl inline-block mb-3 sm:mb-4">
                <Code className="h-10 w-10 sm:h-12 sm:w-12 text-cyan-300" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-white">Expert Problem Solving</h2>
              <p className="text-sm sm:text-base text-white/80">
                Our team of experienced developers and educators are here to help you tackle even the most challenging
                DSA problems and coding doubts.
              </p>
            </motion.div>
            
            <motion.div 
              className="backdrop-blur-md bg-white/10 border border-white/20 p-4 sm:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3 rounded-xl inline-block mb-3 sm:mb-4">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-purple-300" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-white">Community-Driven</h2>
              <p className="text-sm sm:text-base text-white/80">
                Join a thriving community of learners and experts, sharing knowledge and growing together in the world
                of programming.
              </p>
            </motion.div>
          </motion.div>

          {/* Mission Section */}
          <motion.div variants={fadeIn} className="backdrop-blur-md bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-white/30 text-white p-6 sm:p-8 rounded-2xl shadow-2xl mb-8 sm:mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-purple-400/10"></div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">Our Mission</h2>
              <p className="text-base sm:text-lg leading-relaxed text-white/90">
                At niqSolve, we're dedicated to helping students overcome challenges while learning Data Structures and Algorithms. We provide the right guidance and resources to clear doubts, making problem-solving easier and ensuring every student excels in their coding journey.
              </p>
            </div>
          </motion.div>

          {/* Additional Features Grid */}
          <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <motion.div 
              className="backdrop-blur-md bg-white/10 border border-white/20 p-4 sm:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-3 rounded-xl inline-block mb-3 sm:mb-4">
                <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-green-300" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-white">Comprehensive Learning</h2>
              <p className="text-sm sm:text-base text-white/80">
                From basic to advanced topics, we cover a wide range of DSA concepts and programming challenges to
                ensure a thorough understanding.
              </p>
            </motion.div>
            
            <motion.div 
              className="backdrop-blur-md bg-white/10 border border-white/20 p-4 sm:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-3 rounded-xl inline-block mb-3 sm:mb-4">
                <Zap className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-300" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-white">Instant Solutions</h2>
              <p className="text-sm sm:text-base text-white/80">
                Get quick and accurate solutions to your coding doubts, ensuring you never stay stuck for long in your
                learning process.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="backdrop-blur-md bg-white/10 border-t border-white/20 text-white py-6 sm:py-8 px-4 mt-8 sm:mt-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm sm:text-base text-white/80">&copy; 2023 niqSolve. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default About

