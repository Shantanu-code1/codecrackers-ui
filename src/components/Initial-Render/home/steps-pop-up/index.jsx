import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const steps = [
  { title: "Sign Up", icon: "✉️" },
  { title: "Ask", icon: "❓" },
  { title: "Learn", icon: "📚" },
  { title: "Grow", icon: "🚀" }
];

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.05 } }
}

export function TryNowStepsDialog({ isOpen, onClose }) {

  const navigate = useNavigate();
  const handleGetStarted = () => {
    onClose();
    navigate('/login');
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[525px] backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-white bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                Get Started in 4 Easy Steps
              </DialogTitle>
            </DialogHeader>
            <motion.div 
              className="max-w-5xl mx-auto mb-6"
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { step: 1, title: 'Post Your Doubt', description: 'Share your question in detail.' },
                  { step: 2, title: 'Get Matched', description: 'We find your ideal expert or you do.' },
                  { step: 3, title: 'Receive Link', description: 'Join the meeting with the expert.' },
                  { step: 4, title: 'Apply Knowledge', description: 'Solve similar problems confidently.' },
                ].map((step) => (
                  <motion.div 
                    key={step.step} 
                    className="backdrop-blur-sm bg-white/10 border border-white/20 p-4 rounded-2xl text-center relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                    variants={fadeIn}
                    whileHover={{ y: -3, scale: 1.02, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <motion.div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-bold shadow-lg"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {step.step}
                    </motion.div>
                    <h3 className="text-sm font-semibold mb-1 text-white">{step.title}</h3>
                    <p className="text-xs text-white/80">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <DialogFooter>
              <Button 
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
              >
                Get Started Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
