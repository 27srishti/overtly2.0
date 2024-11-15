import type { Config } from "tailwindcss";
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
     
    },
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',    // ~15 inch screens
        '2xl': '1536px',   // ~16 inch screens
        '4xl': '1920px',   // Larger screens
      },
      fontFamily: {
        readex: ["Readex Pro", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        gradientbg: {
          DEFAULT: "var(--gradientbg)",
          foreground:
            "linear-gradient(134.2deg, rgba(213, 230, 255, 0.2) 20.86%, rgba(255, 252, 169, 0.128) 85.59%), #FFFFFF",
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "logo-cloud": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - 4rem))" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.3s ease-out",
        "logo-cloud": "logo-cloud 30s linear infinite",
      },
    },
    fontFamily: {
      montserrat: ["var(--font-montserrat)"],
      raleway: ["var(--font-raleway)"],
      readex: ["Readex Pro", "sans-serif"],
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    addVariablesForColors,
    addNoScrollbar,
  ],
};

export default config;

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

function addNoScrollbar({ addUtilities }: { addUtilities: Function }) {
  addUtilities({
    '.no-scrollbar': {
      /* Hide scrollbar for Chrome, Safari, and Opera */
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      /* Hide scrollbar for IE, Edge, and Firefox */
      '-ms-overflow-style': 'none', /* IE and Edge */
      'scrollbar-width': 'none', /* Firefox */
    },
  });
}
