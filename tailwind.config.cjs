const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

const navyColor = {
  50: "#E7E9EF",
  100: "#C2C9D6",
  200: "#A3ADC2",
  300: "#697A9B",
  400: "#5C6B8A",
  450: "#465675",
  500: "#384766",
  600: "#313E59",
  700: "#26334D",
  750: "#222E45",
  800: "#202B40",
  900: "#192132",
};

const customColors = {
  navy: navyColor,
  "slate-150": "#E9EEF5",
  primary: colors.indigo["600"],
  "primary-focus": colors.indigo["700"],
  "secondary-light": "#ff57d8",
  secondary: "#F000B9",
  "secondary-focus": "#BD0090",
  "accent-light": colors.indigo["400"],
  accent: "#5f5af6",
  "accent-focus": "#4d47f5",
  info: colors.sky["500"],
  "info-focus": colors.sky["600"],
  success: colors.emerald["500"],
  "success-focus": colors.emerald["600"],
  warning: "#ff9800",
  "warning-focus": "#e68200",
  error: "#ff5724",
  "error-focus": "#f03000",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: [
    'stories-status-0',
    'stories-status-1',
    'stories-status-2',
    'stories-status-3',
    'screens-status-0',
    'screens-status-1',
    'screens-status-2',
    'screens-status-3',
    'screens-status-4',
    'screens-status-5',
    'screens-status-6',
    'w-0/12',
    'w-1/12',
    'w-2/12',
    'w-3/12',
    'w-4/12',
    'w-5/12',
    'w-6/12',
    'w-7/12',
    'w-8/12',
    'w-9/12',
    'w-10/12',
    'w-11/12',
    'w-12/12',
  ],
  mode: "jit",
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
        inter: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        tiny: ["0.625rem", "0.8125rem"],
        "tiny+": ["0.6875rem", "0.875rem"],
        "xs+": ["0.8125rem", "1.125rem"],
        "sm+": ["0.9375rem", "1.375rem"],
      },
      colors: { ...customColors },
      opacity: {
        15: ".15",
      },
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        18: "4.5rem",
      },
      boxShadow: {
        soft: "0 3px 10px 0 rgb(48 46 56 / 6%)",
        "soft-dark": "0 3px 10px 0 rgb(25 33 50 / 30%)",
      },
      zIndex: {
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        "fade-out": {
          "0%": {
            opacity: 1,
            visibility: "visible",
          },
          "100%": {
            opacity: 0,
            visibility: "hidden",
          },
        },
      },
    },
  },
  corePlugins: {
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
  },
  plugins: [
  ],
}
