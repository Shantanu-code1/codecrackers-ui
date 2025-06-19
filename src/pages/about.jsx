import React from "react"
import { motion } from "framer-motion"
import { Shield, Award, Users, CheckCircle2 } from "lucide-react"
import Header from "@/components/Initial-Render/header-start/Header"
import { Button } from "@/components/ui/button"

const AboutPage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const staggerChildren = {
    visible: { transition: { staggerChildren: 0.2 } }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Glassmorphism Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      <div className="absolute top-3/4 left-1/6 w-64 h-64 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-2xl"></div>
      
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl mb-12">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              About <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">niqSolve</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-white/80 max-w-3xl mx-auto mb-10"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              We're on a mission to revolutionize coding education by providing instant, quality solutions to programming challenges.
            </motion.p>
          </div>
          
          <motion.div 
            className="flex flex-col md:flex-row justify-center gap-8 mt-12"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <motion.div 
              className="backdrop-blur-md bg-white/10 border border-white/20 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              variants={fadeIn}
              whileHover={{ y: -5 }}
            >
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-3 rounded-xl inline-block mb-4">
                <Shield className="h-12 w-12 text-cyan-300 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Our Mission</h3>
              <p className="text-white/80">
                To break barriers in coding education by providing accessible, high-quality guidance to learners of all levels.
              </p>
            </motion.div>
            
            <motion.div 
              className="backdrop-blur-md bg-white/10 border border-white/20 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              variants={fadeIn}
              whileHover={{ y: -5 }}
            >
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3 rounded-xl inline-block mb-4">
                <Award className="h-12 w-12 text-purple-300 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Our Values</h3>
              <p className="text-white/80">
                Excellence, accessibility, and innovation drive everything we do at niqSolve.
              </p>
            </motion.div>
            
            <motion.div 
              className="backdrop-blur-md bg-white/10 border border-white/20 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              variants={fadeIn}
              whileHover={{ y: -5 }}
            >
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-3 rounded-xl inline-block mb-4">
                <Users className="h-12 w-12 text-green-300 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Our Team</h3>
              <p className="text-white/80">
                A diverse group of passionate educators, engineers, and designers committed to your learning success.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Story Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-8 sm:p-12 shadow-xl">
              <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">Our Story</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mb-8"></div>
              <p className="text-white/80 max-w-3xl mx-auto">
                niqSolve was founded in 2023 by a group of passionate educators and software engineers who 
                recognized a gap in coding education. Students often got stuck on problems for hours, disrupting 
                their learning momentum and causing frustration.
              </p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/images/team-collaboration.jpg" 
                  alt="Team collaboration" 
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x400/161B22/0070F3?text=Team+Collaboration";
                  }}
                />
              </div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-6 sm:p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-4">From Idea to Innovation</h3>
                <p className="text-white/80 mb-6">
                  We built niqSolve to provide immediate, high-quality help when students need it most. 
                  Our platform combines the best of AI technology with human expertise to deliver personalized 
                  learning experiences.
                </p>
                <p className="text-white/80 mb-6">
                  Since our launch, we've helped thousands of students overcome coding challenges and build 
                  their confidence as developers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                    Join Our Journey
                  </Button>
                  <Button variant="outline" className="border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300">
                    Meet the Team
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-white mb-4">Why Choose niqSolve</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-8"></div>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Expert-Verified Solutions",
                description: "All answers are reviewed by our team of experienced developers to ensure accuracy and best practices.",
                color: "from-cyan-500/20 to-blue-500/20",
                iconColor: "text-cyan-300"
              },
              {
                title: "24/7 Availability",
                description: "Get help whenever you need it, day or night, from anywhere in the world.",
                color: "from-purple-500/20 to-pink-500/20",
                iconColor: "text-purple-300"
              },
              {
                title: "Personalized Learning",
                description: "Our system adapts to your skill level and learning style to provide the most effective guidance.",
                color: "from-green-500/20 to-emerald-500/20",
                iconColor: "text-green-300"
              },
              {
                title: "Code Quality Focus",
                description: "We don't just solve problems—we teach you how to write clean, efficient, and maintainable code.",
                color: "from-yellow-500/20 to-orange-500/20",
                iconColor: "text-yellow-300"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex gap-4 p-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-102"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                whileHover={{ y: -3 }}
              >
                <div className={`bg-gradient-to-r ${item.color} p-2 rounded-xl shrink-0 mt-1`}>
                  <CheckCircle2 className={`h-6 w-6 ${item.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-white/80">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="backdrop-blur-md bg-gradient-to-br from-white/15 to-white/5 border border-white/30 rounded-2xl p-8 sm:p-12 shadow-2xl">
            <motion.h2 
              className="text-3xl font-bold text-white mb-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              Ready to Accelerate Your Coding Journey?
            </motion.h2>
            <motion.p 
              className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              Join thousands of students who are learning faster and more effectively with niqSolve.
            </motion.p>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-0"
              >
                Get Started Free
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="backdrop-blur-md bg-white/10 border-t border-white/20 text-white py-8 px-4 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">niqSolve</h3>
            <p className="text-sm text-white/70">Empowering students through instant doubt resolution</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
            <ul className="text-sm">
              <li>
                <a href="#" className="text-white/70 hover:text-cyan-400 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-cyan-400 transition-colors">FAQs</a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-cyan-400 transition-colors">Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-cyan-400 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-cyan-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-cyan-400 transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AboutPage 