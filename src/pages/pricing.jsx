import React, { useState } from "react"
import { motion } from "framer-motion"
import { Check, X, HelpCircle } from "lucide-react"
import Header from "@/components/Initial-Render/header-start/Header"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState("monthly")
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }
  
  const staggerChildren = {
    visible: { transition: { staggerChildren: 0.15 } }
  }
  
  const plans = [
    {
      name: "Free",
      description: "Perfect for trying out the platform",
      monthlyPrice: "$0",
      yearlyPrice: "$0",
      color: "border-border",
      bgColor: "bg-card",
      highlight: false,
      features: [
        { name: "5 queries per month", included: true },
        { name: "Basic AI assistance", included: true },
        { name: "Community support", included: true },
        { name: "Response within 24 hours", included: true },
        { name: "Human expert review", included: false },
        { name: "Priority support", included: false },
        { name: "Code explanations", included: false },
        { name: "Personalized feedback", included: false },
      ]
    },
    {
      name: "Pro",
      description: "For serious learners and students",
      monthlyPrice: "$19",
      yearlyPrice: "$190",
      color: "border-secondary",
      bgColor: "bg-gradient-to-b from-card via-card to-secondary/10",
      highlight: true,
      features: [
        { name: "Unlimited queries", included: true },
        { name: "Advanced AI solutions", included: true },
        { name: "Community access", included: true },
        { name: "Response within 3 hours", included: true },
        { name: "Human expert review", included: true },
        { name: "Priority support", included: true },
        { name: "Code explanations", included: true },
        { name: "Personalized feedback", included: false },
      ]
    },
    {
      name: "Premium",
      description: "Full access to all features",
      monthlyPrice: "$49",
      yearlyPrice: "$490",
      color: "border-accent",
      bgColor: "bg-gradient-to-b from-card via-card to-accent/10",
      highlight: false,
      features: [
        { name: "Unlimited queries", included: true },
        { name: "Premium AI solutions", included: true },
        { name: "Private community", included: true },
        { name: "Response within 1 hour", included: true },
        { name: "Human expert review", included: true },
        { name: "Priority support", included: true },
        { name: "Code explanations", included: true },
        { name: "Personalized feedback", included: true },
      ]
    }
  ]

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
            Simple, Transparent <span className="text-secondary">Pricing</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-text-muted max-w-3xl mx-auto mb-10"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            Choose the plan that fits your learning needs, with no hidden fees or commitments.
          </motion.p>
          
          {/* Billing Toggle */}
          <motion.div 
            className="flex items-center justify-center space-x-4 mb-12"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-text" : "text-text-muted"}`}>
              Monthly
            </span>
            <div className="flex items-center" onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}>
              <Switch checked={billingCycle === "yearly"} />
            </div>
            <span className={`text-sm font-medium flex items-center gap-1 ${billingCycle === "yearly" ? "text-text" : "text-text-muted"}`}>
              Yearly <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded">20% off</span>
            </span>
          </motion.div>
          
          {/* Pricing Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            {plans.map((plan, index) => (
              <motion.div 
                key={index}
                className={`
                  ${plan.bgColor}
                  border-2 ${plan.color} rounded-lg shadow-lg overflow-hidden
                  ${plan.highlight ? 'transform md:-translate-y-4' : ''}
                `}
                variants={fadeIn}
              >
                {plan.highlight && (
                  <div className="bg-secondary text-white py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-text mb-2">{plan.name}</h3>
                  <p className="text-text-muted mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-text">
                      {billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className="text-text-muted">/{billingCycle === "monthly" ? "month" : "year"}</span>
                  </div>
                  <Button 
                    className={`w-full 
                      ${plan.name === "Free" 
                        ? "bg-card hover:bg-card/90 border border-secondary text-secondary" 
                        : plan.name === "Pro" 
                          ? "bg-secondary hover:bg-secondary/90 text-white" 
                          : "bg-accent hover:bg-accent/90 text-white"
                      }
                    `}
                  >
                    {plan.name === "Free" ? "Sign Up" : "Get Started"}
                  </Button>
                  
                  <div className="mt-8 space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-secondary mr-3 shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-text-muted mr-3 shrink-0" />
                        )}
                        <span className={feature.included ? "text-text" : "text-text-muted"}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Features Comparison */}
      <section className="py-16 px-4 bg-primary/60">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-text mb-4">Detailed Features Comparison</h2>
            <div className="w-20 h-1 bg-secondary mx-auto mb-8"></div>
          </motion.div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 px-6 text-left text-text">Feature</th>
                  <th className="py-4 px-6 text-center text-text">Free</th>
                  <th className="py-4 px-6 text-center text-text">Pro</th>
                  <th className="py-4 px-6 text-center text-text">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-4 px-6 text-text">Monthly Queries</td>
                  <td className="py-4 px-6 text-center text-text-muted">5</td>
                  <td className="py-4 px-6 text-center text-text">Unlimited</td>
                  <td className="py-4 px-6 text-center text-text">Unlimited</td>
                </tr>
                <tr className="border-b border-border/40 bg-card/30">
                  <td className="py-4 px-6 text-text">Response Time</td>
                  <td className="py-4 px-6 text-center text-text-muted">24 hours</td>
                  <td className="py-4 px-6 text-center text-text">3 hours</td>
                  <td className="py-4 px-6 text-center text-text">1 hour</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-4 px-6 text-text">Code Reviews</td>
                  <td className="py-4 px-6 text-center">
                    <X className="h-5 w-5 text-text-muted mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center text-text-muted">3 per month</td>
                  <td className="py-4 px-6 text-center text-text">Unlimited</td>
                </tr>
                <tr className="border-b border-border/40 bg-card/30">
                  <td className="py-4 px-6 text-text">1-on-1 Sessions</td>
                  <td className="py-4 px-6 text-center">
                    <X className="h-5 w-5 text-text-muted mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <X className="h-5 w-5 text-text-muted mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center text-text">2 per month</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-4 px-6 text-text">AI Code Generation</td>
                  <td className="py-4 px-6 text-center text-text-muted">Basic</td>
                  <td className="py-4 px-6 text-center text-text">Advanced</td>
                  <td className="py-4 px-6 text-center text-text">Premium</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-text mb-4">Frequently Asked Questions</h2>
            <div className="w-20 h-1 bg-accent mx-auto mb-8"></div>
          </motion.div>
          
          <div className="space-y-6">
            {[
              {
                question: "Can I upgrade or downgrade my plan at any time?",
                answer: "Yes, you can change your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, your new plan will take effect at the start of your next billing cycle."
              },
              {
                question: "Is there a limit to how complex my queries can be?",
                answer: "No, we handle queries of all complexity levels. However, more complex queries might take a little longer to resolve, especially on the Free plan."
              },
              {
                question: "How do the human expert reviews work?",
                answer: "Our AI generates initial solutions, which are then reviewed and refined by our team of professional developers to ensure accuracy, best practices, and clear explanations."
              },
              {
                question: "Do you offer refunds?",
                answer: "Yes, we offer a 14-day money-back guarantee if you're not satisfied with our service. Simply contact our support team to process your refund."
              },
              {
                question: "Can I share my account with others?",
                answer: "Our plans are designed for individual use. If you need accounts for a team or classroom, please contact us about our special Team and Education pricing options."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-card rounded-lg border border-border p-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <h3 className="text-xl font-medium text-text mb-3">{faq.question}</h3>
                <p className="text-text-muted">{faq.answer}</p>
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
            Ready to Start Your Learning Journey?
          </motion.h2>
          <motion.p 
            className="text-xl text-text-muted mb-8 max-w-2xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            Join niqSolve today and take your coding skills to the next level. No credit card required for free accounts.
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
      
      {/* Footer */}
      <footer className="bg-primary/80 text-text py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">niqSolve</h3>
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

export default PricingPage 