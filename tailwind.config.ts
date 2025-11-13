import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          glow: "hsl(var(--success-glow))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "slide-in-from-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-from-left": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-from-top": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-from-bottom": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "scale-out": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--primary) / 0.3)" },
          "50%": { boxShadow: "0 0 30px hsl(var(--primary) / 0.5)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "shimmer-text": {
          "0%": { backgroundPosition: "0% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "expand": {
          "0%": { transform: "scaleY(0.95)", opacity: "0" },
          "100%": { transform: "scaleY(1)", opacity: "1" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pop": {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "70%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "flip-in": {
          "0%": { transform: "perspective(400px) rotateY(90deg)", opacity: "0" },
          "100%": { transform: "perspective(400px) rotateY(0deg)", opacity: "1" },
        },
        "float-orb-1": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(-30px, -30px)" },
          "50%": { transform: "translate(-60px, 0)" },
          "75%": { transform: "translate(-30px, 30px)" },
        },
        "float-orb-2": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(30px, 30px)" },
          "50%": { transform: "translate(60px, 0)" },
          "75%": { transform: "translate(30px, -30px)" },
        },
        "float-orb-3": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "33%": { transform: "translate(40px, -40px)" },
          "66%": { transform: "translate(-30px, 50px)" },
        },
        "float-orb-4": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "33%": { transform: "translate(-50px, 30px)" },
          "66%": { transform: "translate(40px, -40px)" },
        },
        "gradient-animation": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.3s ease-out",
        "accordion-up": "accordion-up 0.3s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-in-from-right": "slide-in-from-right 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-from-left": "slide-in-from-left 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-from-top": "slide-in-from-top 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-from-bottom": "slide-in-from-bottom 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-out": "scale-out 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "shimmer": "shimmer 2s linear infinite",
        "bounce-in": "bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "glow": "glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
        "shimmer-text": "shimmer-text 3s linear infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "expand": "expand 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "gradient-shift": "gradient-shift 3s ease infinite",
        "pop": "pop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "flip-in": "flip-in 0.6s ease-out",
        "float-orb-1": "float-orb-1 20s ease-in-out infinite",
        "float-orb-2": "float-orb-2 25s ease-in-out infinite reverse",
        "float-orb-3": "float-orb-3 30s ease-in-out infinite",
        "float-orb-4": "float-orb-4 22s ease-in-out infinite reverse",
        "gradient-animation": "gradient-animation 15s ease infinite",
      },
      boxShadow: {
        "glow-sm": "0 0 10px hsl(var(--primary) / 0.3)",
        "glow-md": "0 0 20px hsl(var(--primary) / 0.4)",
        "glow-lg": "0 0 30px hsl(var(--primary) / 0.5)",
        "success-glow": "0 0 20px hsl(var(--success) / 0.4)",
        "glass-sm": "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
        "glass-md": "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        "glass-lg": "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
        "glass-xl": "0 8px 32px 0 rgba(31, 38, 135, 0.35)",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },
      backgroundColor: {
        "glass/5": "rgba(255, 255, 255, 0.05)",
        "glass/10": "rgba(255, 255, 255, 0.1)",
        "glass/15": "rgba(255, 255, 255, 0.15)",
        "glass/20": "rgba(255, 255, 255, 0.2)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
