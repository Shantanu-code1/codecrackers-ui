import React from 'react';

/**
 * A consistent container for page content
 * @param {Object} props
 * @param {ReactNode} props.children - Page content
 * @param {string} props.className - Additional styling
 */
const PageContainer = ({ children, className = "" }) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer; 