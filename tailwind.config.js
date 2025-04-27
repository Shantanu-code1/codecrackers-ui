/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			primary: {
  				DEFAULT: '#0D1117',
  				foreground: '#E5E7EB'
  			},
  			secondary: {
  				DEFAULT: '#0070F3',
  				foreground: '#FFFFFF'
  			},
  			accent: {
  				DEFAULT: '#FF4D6D',
  				foreground: '#FFFFFF'
  			},
  			background: '#0D1117',
  			text: {
  				DEFAULT: '#E5E7EB',
  				muted: '#A1A1AA'
  			},
  			foreground: '#E5E7EB',
  			card: {
  				DEFAULT: '#161B22',
  				foreground: '#E5E7EB'
  			},
  			popover: {
  				DEFAULT: '#161B22',
  				foreground: '#E5E7EB'
  			},
  			muted: {
  				DEFAULT: '#161B22',
  				foreground: '#A1A1AA'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: '#2D3748',
  			input: '#2D3748',
  			ring: '#0070F3',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
