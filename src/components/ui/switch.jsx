"use client"

import React from "react"

export const Switch = ({ className, ...props }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input 
      type="checkbox" 
      className="sr-only peer"
      {...props}
    />
    <div className={`
      peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full 
      border-2 border-transparent transition-colors 
      peer-checked:bg-secondary peer-unchecked:bg-muted
      ${className || ''}
    `}>
      <span className={`
        pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg 
        transform transition-transform 
        peer-checked:translate-x-5 peer-unchecked:translate-x-0
      `}></span>
    </div>
  </label>
) 