import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MessageSquare, Users, Link as LinkIcon, BookOpen, ArrowRight, Check } from "lucide-react"

// Custom dialog that doesn't use the Dialog component which might have styling issues
export const TryNowStepsDialog = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState(0)
  
  // Lock scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const steps = [
    {
      title: "Post Your Doubt",
      description: "Share your question in detail.",
      icon: <MessageSquare className="w-6 h-6" />,
      color: "#0070F3"
    },
    {
      title: "Get Matched",
      description: "We find your ideal expert or you do.",
      icon: <Users className="w-6 h-6" />,
      color: "#6366F1"
    },
    {
      title: "Receive Link",
      description: "Join the meeting with the expert.",
      icon: <LinkIcon className="w-6 h-6" />,
      color: "#8B5CF6"
    },
    {
      title: "Apply Knowledge",
      description: "Solve similar problems confidently.",
      icon: <BookOpen className="w-6 h-6" />,
      color: "#FF4D6D"
    }
  ];
  
  const handleClose = () => {
    setActiveStep(0)
    onClose()
  }
  
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1)
    } else {
      handleClose()
    }
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#161B22] border border-[#2D3748] text-white rounded-xl overflow-hidden shadow-2xl w-full max-w-3xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0070F3] to-[#FF4D6D] p-6 relative">
          <div className="absolute inset-0 opacity-10" 
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")"
            }}
          />
          <div className="flex justify-between items-center relative z-10">
            <h2 className="text-white text-2xl font-bold">How CodeCrackers Works</h2>
            <button
              onClick={handleClose}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Steps Indicator */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between w-full mb-8">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <StepIndicator 
                  step={index + 1} 
                  title={step.title}
                  active={index === activeStep}
                  completed={index < activeStep}
                  color={step.color}
                />
                {index < steps.length - 1 && (
                  <div className="h-[2px] flex-1 mx-2 bg-[#2D3748]">
                    <div 
                      className="h-full bg-gradient-to-r from-[#0070F3] to-[#FF4D6D] transition-all duration-500"
                      style={{ 
                        width: index < activeStep ? '100%' : '0%'
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Step Content */}
        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              {/* Step Icon */}
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center shrink-0"
                style={{ 
                  background: `linear-gradient(135deg, ${steps[activeStep].color}20, ${steps[activeStep].color}10)`,
                  border: `2px solid ${steps[activeStep].color}40`
                }}
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${steps[activeStep].color}, ${steps[activeStep].color}90)` 
                  }}
                >
                  {steps[activeStep].icon}
                </div>
              </div>
              
              {/* Step Details */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-2">
                  {steps[activeStep].title}
                </h3>
                <p className="text-[#A1A1AA] text-lg mb-6">
                  {steps[activeStep].description}
                </p>
                
                {activeStep === 0 && (
                  <div className="bg-[#0D1117] border border-[#2D3748] rounded-lg p-6">
                    <p className="text-[#E5E7EB] mb-4">
                      Share your programming problem or question with as much detail as possible.
                      Paste code snippets, error messages, and what you've tried so far.
                    </p>
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-[#E5E7EB]">Detailed problem description</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-[#E5E7EB]">Relevant code snippets</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-[#E5E7EB]">Expected vs. actual results</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeStep === 1 && (
                  <div className="bg-[#0D1117] border border-[#2D3748] rounded-lg p-6">
                    <p className="text-[#E5E7EB] mb-4">
                      We'll match you with an expert who specializes in your problem area.
                      Alternatively, you can choose from our vetted experts yourself.
                    </p>
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-[#E5E7EB]">Experts matched to your problem</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-[#E5E7EB]">Advanced AI pre-analysis</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-[#E5E7EB]">95% match rate in minutes</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeStep === 2 && (
                  <div className="bg-[#0D1117] border border-[#2D3748] rounded-lg p-6">
                    <p className="text-[#E5E7EB] mb-4">
                      Once matched, you'll receive a link to join a video or chat session with your expert.
                      Choose the format that works best for your learning style.
                    </p>
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-[#E5E7EB]">Secure meeting links</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-[#E5E7EB]">Video or chat options</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-[#E5E7EB]">Screen sharing capabilities</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeStep === 3 && (
                  <div className="bg-[#0D1117] border border-[#2D3748] rounded-lg p-6">
                    <p className="text-[#E5E7EB] mb-4">
                      Our experts don't just solve your problem, they ensure you understand the solution.
                      This knowledge helps you tackle similar challenges independently in the future.
                    </p>
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-[#E5E7EB]">Detailed explanations</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-[#E5E7EB]">Reference materials</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-[#E5E7EB]">Follow-up support</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-between mt-8">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-[#2D3748] text-[#E5E7EB] rounded-md hover:bg-[#2D3748]/30 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-md flex items-center text-white transition-colors"
              style={{ 
                background: `linear-gradient(to right, ${steps[activeStep].color}, ${
                  activeStep === steps.length - 1 ? '#FF4D6D' : steps[Math.min(activeStep + 1, steps.length - 1)].color
                })` 
              }}
            >
              {activeStep === steps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StepIndicator = ({ step, title, active, completed, color }) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
          completed ? 'bg-[#0070F3]' : active ? 'bg-white' : 'bg-[#2D3748]'
        }`}
        style={{ 
          color: completed ? 'white' : active ? color : '#A1A1AA',
          borderColor: active ? color : 'transparent',
          borderWidth: active ? '2px' : '0'
        }}
      >
        {completed ? (
          <Check className="h-5 w-5" />
        ) : (
          <span className="text-sm font-medium">{step}</span>
        )}
      </div>
      <span className={`text-xs mt-2 hidden md:block transition-colors duration-300 ${
        active || completed ? 'text-white' : 'text-[#A1A1AA]'
      }`}>
        {title}
      </span>
    </div>
  );
}; 