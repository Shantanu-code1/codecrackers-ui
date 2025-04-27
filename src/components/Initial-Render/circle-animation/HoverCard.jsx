import React from "react";
import { motion } from "framer-motion";

const HoverCard = ({ name, description, icon, color }) => {
  return (
    <motion.div
      className="absolute top-[-17rem] mt-4 p-6 bg-white rounded-lg shadow-lg z-10 w-64"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={{
        boxShadow: `0 10px 25px -5px ${color}40, 0 8px 10px -6px ${color}30`,
        border: `2px solid ${color}20`,
      }}
    >
      <div className="flex items-center mb-4">
        <div className="mr-4 relative">
          <div className="absolute inset-0 rounded-full opacity-20" style={{ backgroundColor: color }}></div>
          <img src={icon || "/placeholder.svg"} alt={name} width={40} height={40} className="relative z-10" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      <motion.div
        className="mt-4 text-sm font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 transition-colors"
        >
          Learn more →
        </a>
      </motion.div>
    </motion.div>
  );
};

export default HoverCard;
