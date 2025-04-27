import React from "react"
import { Button as ShadcnButton } from "./button"

export function PrimaryButton({ children, ...props }) {
  return (
    <ShadcnButton 
      className="bg-secondary hover:bg-secondary/90 text-white"
      {...props}
    >
      {children}
    </ShadcnButton>
  )
}

export function SecondaryButton({ children, ...props }) {
  return (
    <ShadcnButton 
      className="bg-card hover:bg-card/90 text-text border border-secondary"
      {...props}
    >
      {children}
    </ShadcnButton>
  )
}

export function AccentButton({ children, ...props }) {
  return (
    <ShadcnButton 
      className="bg-accent hover:bg-accent/90 text-white"
      {...props}
    >
      {children}
    </ShadcnButton>
  )
}

export function GhostButton({ children, ...props }) {
  return (
    <ShadcnButton 
      className="bg-transparent hover:bg-card text-text hover:text-text"
      {...props}
    >
      {children}
    </ShadcnButton>
  )
} 