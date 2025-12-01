/** @type {import('tailwindcss').Config} */
export const content = [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
];
export const theme = {
    extend: {
        colors: {
            primary: "#4f46e5"
        }
    },
};
export const plugins = [];
