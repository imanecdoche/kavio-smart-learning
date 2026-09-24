/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
        },
        surface: {
          base: '#090a0f',
          card: '#12141c',
          raised: '#1a1d28',
          border: '#232736',
        },
        destructive: {
          DEFAULT: '#e11d48',
          hover: '#be123c',
        },
      },
      borderRadius: {
        DEFAULT: '8px',
        md: '8px',
        lg: '10px',
        xl: '12px',
      },
    },
  },
  plugins: [],
};
