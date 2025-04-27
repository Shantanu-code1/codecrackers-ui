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
    <div className="bg-gradient-to-b from-indigo-50 via-white to-indigo-50 min-h-screen">
      <Header />

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.h1 variants={fadeIn} className="text-4xl font-bold text-gray-900 mb-6 text-center">
            About Codecrackers
          </motion.h1>

          <motion.p variants={fadeIn} className="text-xl text-gray-600 mb-12 text-center">
            Empowering students through instant doubt resolution and expert guidance in DSA and coding challenges.
          </motion.p>

          <motion.div variants={fadeIn} className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Code className="h-12 w-12 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Expert Problem Solving</h2>
              <p className="text-gray-600">
                Our team of experienced developers and educators are here to help you tackle even the most challenging
                DSA problems and coding doubts.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Users className="h-12 w-12 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Community-Driven</h2>
              <p className="text-gray-600">
                Join a thriving community of learners and experts, sharing knowledge and growing together in the world
                of programming.
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeIn} className="bg-indigo-600 text-white p-8 rounded-lg shadow-xl mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg">
                At Codecrackers, we're dedicated to helping students overcome challenges while learning Data Structures and Algorithms. We provide the right guidance and resources to clear doubts, making problem-solving easier and ensuring every student excels in their coding journey.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <BookOpen className="h-12 w-12 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Comprehensive Learning</h2>
              <p className="text-gray-600">
                From basic to advanced topics, we cover a wide range of DSA concepts and programming challenges to
                ensure a thorough understanding.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Zap className="h-12 w-12 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Instant Solutions</h2>
              <p className="text-gray-600">
                Get quick and accurate solutions to your coding doubts, ensuring you never stay stuck for long in your
                learning process.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <footer className="bg-gray-800 text-white py-8 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p>&copy; 2023 Codecrackers. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default About

