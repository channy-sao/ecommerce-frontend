// /** @type {import('tailwindcss').Config} */
// export const content = [
//   "./app/**/*.{js,ts,jsx,tsx}",
//   "./pages/**/*.{js,ts,jsx,tsx}",
//   "./components/**/*.{js,ts,jsx,tsx}",
// ];
// export const theme = {
//   extend: {
//     colors: {
//       primary: "#4f46e5",
//     },
//   },
// };
// export const plugins = [];

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",

        // Your CSS variable colors
        sidebar: {
          active: "var(--sidebar-active)",
          hover: "var(--sidebar-hover)",
          muted: "var(--sidebar-muted)",
        },
      },
    },
  },
  plugins: [],
};
