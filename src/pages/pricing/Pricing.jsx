import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import Header from "../../components/Initial-Render/header-start/Header"

const PricingOption = ({
  title,
  price,
  description,
  features,
  isPopular = false,
  badge = "",
  showCounter = false,
  onIncrement,
  onDecrement,
  doubtsCount,
  theme = "dark"
}) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -5 }}
    transition={{ type: "spring", stiffness: 300, damping: 10 }}
    className="h-full"
  >
    <Card
      className={`w-full max-w-sm mx-auto relative ${
        isPopular 
          ? "border-cyan-400/50 border-2 shadow-cyan-500/25" 
          : "border-white/20"
      } h-full flex flex-col backdrop-blur-md bg-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300`}
    >
      {badge && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-medium ${
            isPopular 
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white" 
              : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          } shadow-lg backdrop-blur-sm`}>
            {badge}
          </span>
        </div>
      )}
      <CardHeader className="text-center flex-grow-0">
        <CardTitle className="text-2xl font-bold text-white">{title}</CardTitle>
        <CardDescription className="text-white/80">
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold text-white">
              ₹{typeof price === "number" ? price * doubtsCount : price}
            </span>
          </div>
          {showCounter && (
            <div className="flex items-center justify-center mt-4 space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={onDecrement}
                disabled={doubtsCount <= 4}
                className="rounded-full h-8 w-8 p-0 border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-semibold text-white">{doubtsCount} doubts</span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onIncrement} 
                className="rounded-full h-8 w-8 p-0 border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-center mb-6 text-white/80">{description}</p>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-white/90">
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-1 rounded-full mr-3">
                <Check className="h-4 w-4 text-cyan-300" />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex-grow-0">
        <Button className={`w-full ${
          isPopular 
            ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600" 
            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        } text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
          Select Plan
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
)

const Pricing = () => {
  const [doubtsCount, setDoubtsCount] = useState(4)

  const handleIncrement = () => {
    setDoubtsCount((prev) => prev + 1)
  }

  const handleDecrement = () => {
    setDoubtsCount((prev) => Math.max(4, prev - 1))
  }

  const plans = [
    {
      title: "Geek",
      price: "80",
      description: "Perfect for quick questions and individual learners",
      features: [
        "1 doubt resolution",
        "Priority AI assistance",
        "Community support"
      ],
      isPopular: true,
      badge: "MOST POPULAR",
    },
    {
      title: "Consistence",
      price: "200",
      description: "Ideal for small teams and collaborative learning",
      features: [
        "3 doubt resolutions",
        "Advanced AI assistance",
        "Priority support",
      ],
      badge: "BEST VALUE",
    },
    {
      title: "Custom",
      price: 67,
      description: "Flexible plan tailored to your specific needs",
      features: [
        "Choose 4 or more doubts",
        "Advanced AI assistance",
        "Priority support",
      ],
      badge: "FLEXIBLE",
      showCounter: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Glassmorphism Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      <div className="absolute top-3/4 left-1/6 w-64 h-64 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-2xl"></div>
      
      <Header />
      
      <div className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-8 sm:p-12 shadow-2xl mb-12">
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-base font-semibold text-cyan-300"
              >
                Pricing
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent"
              >
                Choose Your Plan
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto mt-6 max-w-2xl text-lg text-white/80"
              >
                Find the perfect plan for your learning journey. Get instant access to expert solutions and AI-powered
                assistance.
              </motion.p>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <PricingOption
                  {...plan}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  doubtsCount={doubtsCount}
                />
              </motion.div>
            ))}
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16"
          >
            <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-6 sm:p-8 shadow-xl text-center">
              <p className="text-white/80">
                All plans include access to our community forum and basic learning resources.
                <br />
                Need a custom plan?{" "}
                <a href="#contact" className="text-cyan-300 font-medium hover:text-cyan-200 transition-colors">
                  Contact us
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Pricing

