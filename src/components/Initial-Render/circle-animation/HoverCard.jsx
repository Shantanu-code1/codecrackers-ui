import React from "react";
import { motion } from "framer-motion";

const HoverCard = ({ name, description, icon, color }) => {
  return (
    <motion.div
      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 p-4 sm:p-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl z-50 w-56 sm:w-64"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={{
        boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 20px 25px -5px ${color}20, 0 0 20px ${color}15`,
      }}
    >
      {/* Glassmorphism Arrow */}
      <div 
        className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
        style={{
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '10px solid rgba(255, 255, 255, 0.2)',
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
        }}
      ></div>

      <div className="flex items-center mb-3 sm:mb-4">
        <div className="mr-3 sm:mr-4 relative flex-shrink-0">
          <div 
            className="absolute inset-0 rounded-xl opacity-30 backdrop-blur-sm" 
            style={{ backgroundColor: color }}
          ></div>
          <div className="relative z-10 p-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl">
            <img 
              src={icon || "/placeholder.svg"} 
              alt={name} 
              width={32} 
              height={32} 
              className="sm:w-10 sm:h-10 filter drop-shadow-lg" 
            />
          </div>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white leading-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
          {name}
        </h3>
      </div>
      
      <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-3">
        {description}
      </p>
      
      <motion.div
        className="text-xs sm:text-sm font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center transition-all duration-300 backdrop-blur-sm bg-white/10 px-3 py-1 rounded-lg border border-white/30 hover:bg-white/20 hover:border-white/50"
          style={{ color: color }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = `0 4px 20px ${color}40`;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Learn more →
        </a>
      </motion.div>
    </motion.div>
  );
};

export default HoverCard;
