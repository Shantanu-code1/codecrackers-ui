import React from "react";
import { motion } from "framer-motion";

const HoverCard = ({ name, description, icon, color }) => {
  return (
    <motion.div
      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 p-4 sm:p-6 bg-white rounded-lg shadow-xl z-50 w-56 sm:w-64"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={{
        boxShadow: `0 10px 25px -5px ${color}40, 0 8px 10px -6px ${color}30`,
        border: `2px solid ${color}20`,
      }}
    >
      {/* Arrow pointing down to the icon */}
      <div 
        className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
        style={{
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: `8px solid ${color}20`,
        }}
      ></div>
      <div 
        className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
        style={{
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '6px solid white',
          marginTop: '-2px',
        }}
      ></div>

      <div className="flex items-center mb-3 sm:mb-4">
        <div className="mr-3 sm:mr-4 relative flex-shrink-0">
          <div className="absolute inset-0 rounded-full opacity-20" style={{ backgroundColor: color }}></div>
          <img 
            src={icon || "/placeholder.svg"} 
            alt={name} 
            width={32} 
            height={32} 
            className="relative z-10 sm:w-10 sm:h-10" 
          />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">{name}</h3>
      </div>
      
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
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
          className="inline-flex items-center transition-colors"
          style={{ color: color }}
          onMouseEnter={(e) => e.target.style.opacity = '0.8'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          Learn more →
        </a>
      </motion.div>
    </motion.div>
  );
};

export default HoverCard;
