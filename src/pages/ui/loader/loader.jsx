import React from 'react'
import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'

export function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="inline-block"
        >
          <Leaf className="h-16 w-16 text-green-500" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-2xl font-bold text-green-700"
        >
          Growing your experience...
        </motion.h2>
      </div>
    </div>
  )
}