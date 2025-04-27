/**
 * Theme utility functions to maintain consistent styling
 */

export const cardStyles = {
  base: "bg-card border-border shadow-lg rounded-lg overflow-hidden",
  gradient: {
    primary: "bg-gradient-to-r from-primary to-card",
    secondary: "bg-gradient-to-r from-secondary/80 to-secondary",
    accent: "bg-gradient-to-r from-accent/80 to-accent",
    mixed: "bg-gradient-to-r from-secondary to-accent/50"
  }
}

export const textStyles = {
  heading: "font-semibold text-text",
  paragraph: "text-text-muted",
  link: "text-secondary hover:text-secondary/80 underline-offset-4"
}

export const inputStyles = {
  base: "bg-muted border-border text-text focus:border-secondary focus:ring-secondary/20"
}

// Helper function to generate consistent card headers
export const getCardHeader = (type = 'primary', title, description) => {
  return {
    bgClass: cardStyles.gradient[type] || cardStyles.gradient.primary,
    titleClass: "text-xl font-medium text-white",
    descriptionClass: "text-white/80"
  }
}

// Add badge styles for different states
export const badgeStyles = {
  success: "bg-green-500/20 text-green-500 border-green-500/30",
  error: "bg-destructive/20 text-destructive border-destructive/30",
  warning: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  info: "bg-secondary/20 text-secondary border-secondary/30",
  default: "bg-card/70 text-text-muted border-border/60"
}

// Common styling patterns
export const commonStyles = {
  sectionTitle: "text-2xl font-semibold text-text mb-4",
  cardTitle: "text-xl font-medium text-text",
  cardDescription: "text-sm text-text-muted",
  formLabel: "block text-sm font-medium text-text mb-1",
  formInput: "bg-muted border-border text-text",
  avatarFallback: "bg-card text-text-muted",
  pageHeading: "text-3xl font-bold text-text",
  iconColor: "text-secondary",
  gradients: {
    primary: "bg-gradient-to-r from-primary to-card",
    secondary: "bg-gradient-to-r from-secondary to-secondary/70",
    accent: "bg-gradient-to-r from-accent to-accent/70",
    mixed: "bg-gradient-to-r from-secondary to-accent"
  }
}

// Layout patterns
export const layoutStyles = {
  pageContainer: "px-4 py-6 md:px-6 lg:px-8",
  contentContainer: "max-w-7xl mx-auto",
  sectionSpacing: "mb-8",
  grid: {
    twoColumn: "grid grid-cols-1 md:grid-cols-2 gap-6",
    threeColumn: "grid grid-cols-1 md:grid-cols-3 gap-6",
    fourColumn: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
  }
} 