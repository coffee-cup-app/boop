/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        cabin: {
          50: "#f4f6ef",
          100: "#e5ebdc",
          200: "#cedabc",
          300: "#afc294",
          400: "#92aa71",
          500: "#758e54",
          600: "#5a7040",
          700: "#475734",
          800: "#3b472d",
          900: "#293121",
          950: "#192013"
        },
        sun: {
          50: "#fef6e4",
          100: "#fcedc9",
          200: "#f9d88e",
          300: "#f6be53",
          400: "#f3a72c",
          500: "#ed8513",
          600: "#d1610e",
          700: "#ae430f",
          800: "#8d3413",
          900: "#742c13",
          950: "#431405"
        },
        blue: {
          50: "#e4f6ff",
          100: "#cfedff",
          200: "#a8dcff",
          300: "#74c3ff",
          400: "#3e96ff",
          500: "#1368ff",
          600: "#0055ff",
          700: "#0055ff",
          800: "#004ce4",
          900: "#0035b0",
          950: "#001858"
        },
        pink: {
          50: "#fdf2f6",
          100: "#fce7f0",
          200: "#fbcfe2",
          300: "#f9a8c9",
          400: "#f582ae",
          500: "#ec4882",
          600: "#db275e",
          700: "#be1846",
          800: "#9d173a",
          900: "#831834",
          950: "#50071a"
        }
      },
      fontFamily: {
        mono: ["Fira Mono", "monospace"]
      }
    }
  },
  plugins: []
};
