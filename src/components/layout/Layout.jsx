import React from 'react';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-background to-primary/90 text-text flex flex-col">
      {/* This will be a direct container for all children content */}
      <div className="flex-grow flex flex-col">
        {children}
      </div>
      
      {/* Style for consistent footer appearance */}
      <style jsx global>{`
        footer {
          border-top: 1px solid var(--border-color);
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default Layout; 