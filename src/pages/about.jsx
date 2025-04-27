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
    <div className="min-h-screen bg-gradient-to-b from-primary via-background to-primary/90 text-text" style={{backgroundColor: "#0D1117"}}>
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-text mb-6"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            About <span className="text-secondary">Codecrackers</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-text-muted max-w-3xl mx-auto mb-10"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            We're on a mission to revolutionize coding education by providing instant, quality solutions to programming challenges.
          </motion.p>
          
          <motion.div 
            className="flex flex-col md:flex-row justify-center gap-8 mt-12"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <motion.div 
              className="bg-card p-8 rounded-lg shadow-lg border border-border"
              variants={fadeIn}
            >
              <Shield className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text mb-3">Our Mission</h3>
              <p className="text-text-muted">
                To break barriers in coding education by providing accessible, high-quality guidance to learners of all levels.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-card p-8 rounded-lg shadow-lg border border-border"
              variants={fadeIn}
            >
              <Award className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text mb-3">Our Values</h3>
              <p className="text-text-muted">
                Excellence, accessibility, and innovation drive everything we do at Codecrackers.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-card p-8 rounded-lg shadow-lg border border-border"
              variants={fadeIn}
            >
              <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text mb-3">Our Team</h3>
              <p className="text-text-muted">
                A diverse group of passionate educators, engineers, and designers committed to your learning success.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Story Section */}
      <section className="py-20 px-4 bg-primary/60">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-text mb-4">Our Story</h2>
            <div className="w-20 h-1 bg-secondary mx-auto mb-8"></div>
            <p className="text-text-muted max-w-3xl mx-auto">
              Codecrackers was founded in 2023 by a group of passionate educators and software engineers who 
              recognized a gap in coding education. Students often got stuck on problems for hours, disrupting 
              their learning momentum and causing frustration.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="rounded-lg overflow-hidden border-4 border-secondary/20 shadow-xl">
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
              <h3 className="text-2xl font-bold text-text mb-4">From Idea to Innovation</h3>
              <p className="text-text-muted mb-6">
                We built Codecrackers to provide immediate, high-quality help when students need it most. 
                Our platform combines the best of AI technology with human expertise to deliver personalized 
                learning experiences.
              </p>
              <p className="text-text-muted mb-6">
                Since our launch, we've helped thousands of students overcome coding challenges and build 
                their confidence as developers.
              </p>
              <div className="flex space-x-4">
                <Button className="bg-secondary hover:bg-secondary/90">
                  Join Our Journey
                </Button>
                <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
                  Meet the Team
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-text mb-4">Why Choose Codecrackers</h2>
            <div className="w-20 h-1 bg-accent mx-auto mb-8"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Expert-Verified Solutions",
                description: "All answers are reviewed by our team of experienced developers to ensure accuracy and best practices."
              },
              {
                title: "24/7 Availability",
                description: "Get help whenever you need it, day or night, from anywhere in the world."
              },
              {
                title: "Personalized Learning",
                description: "Our system adapts to your skill level and learning style to provide the most effective guidance."
              },
              {
                title: "Code Quality Focus",
                description: "We don't just solve problems—we teach you how to write clean, efficient, and maintainable code."
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex gap-4 p-6 bg-card rounded-lg border border-border shadow-lg"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <CheckCircle2 className="h-6 w-6 text-secondary shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-text mb-2">{item.title}</h3>
                  <p className="text-text-muted">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-card">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold text-text mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            Ready to Accelerate Your Coding Journey?
          </motion.h2>
          <motion.p 
            className="text-xl text-text-muted mb-8 max-w-2xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            Join thousands of students who are learning faster and more effectively with Codecrackers.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-secondary to-accent text-white px-8 py-3 rounded-full font-medium text-lg shadow-lg"
            >
              Get Started Free
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Footer - Add border */}
      <footer className="bg-primary/80 text-text py-8 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Codecrackers</h3>
            <p className="text-sm text-text-muted">Empowering students through instant doubt resolution</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
            <ul className="text-sm">
              <li>
                <a href="#" className="text-text-muted hover:text-secondary">About Us</a>
              </li>
              <li>
                <a href="#" className="text-text-muted hover:text-secondary">FAQs</a>
              </li>
              <li>
                <a href="#" className="text-text-muted hover:text-secondary">Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-text-muted hover:text-secondary">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-text-muted hover:text-secondary">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a href="#" className="text-text-muted hover:text-secondary">
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