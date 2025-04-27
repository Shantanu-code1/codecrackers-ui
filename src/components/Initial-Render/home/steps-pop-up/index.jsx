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
    close();
    navigate('/login');
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[525px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-gray-900">Get Started in 4 Easy Steps</DialogTitle>
            </DialogHeader>
            <motion.div 
          className="max-w-5xl mx-auto mb-12"
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
                className="bg-white p-4 rounded-lg shadow-md text-center relative overflow-hidden"
                variants={fadeIn}
                whileHover={{ y: -3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <motion.div 
                  className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-bold"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {step.step}
                </motion.div>
                <h3 className="text-sm font-semibold mb-1">{step.title}</h3>
                <p className="text-xs text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
            <DialogFooter>
              <Button 
                onClick={handleGetStarted}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200"
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
