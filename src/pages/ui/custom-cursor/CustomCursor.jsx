import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const colors = [
  "#FF69B4",
  "#1E90FF",
  "#FFD700",
  "#32CD32",
  "#FFA500",
  "#8A2BE2",
  "#FF4500",
  "#00FFFF",
  "#FF00FF",
  "#00FF00",
  "#008080",
  "#4B0082",
  "#EE82EE",
  "#A52A2A",
  "#FFD700",
];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const CustomCursor = () => {
  const [sparkles, setSparkles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let lastSparkleTime = 0;
    
    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      setMousePosition({ x: e.clientX, y: e.clientY });

      if (currentTime - lastSparkleTime > 20) {
        const newSparkles = Array.from({ length: getRandomInt(0, 1) }).map(() => ({
          id: Date.now() + Math.random(),
          x: getRandomInt(-20, 20),
          y: getRandomInt(-20, 20),
          size: getRandomInt(4, 12),
          color: getRandomColor(),
          rotation: getRandomInt(0, 360),
        }));

        setSparkles((prev) => [...prev, ...newSparkles]);
        lastSparkleTime = currentTime;

        setTimeout(() => {
          setSparkles((prev) => prev.slice(newSparkles.length));
        }, 1000);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute"
          style={{
            width: sparkle.size,
            height: sparkle.size,
            x: mousePosition.x + sparkle.x,
            y: mousePosition.y + sparkle.y,
            rotate: sparkle.rotation,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [1, 1.5, 0],
            opacity: [1, 0.8, 0],
            x: mousePosition.x + sparkle.x * 3,
            y: mousePosition.y + sparkle.y * 3,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill={sparkle.color} />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default CustomCursor;
