/*
================================================================================
| FILE: tailwind.config.js
| ACTION: Replace the entire content of this file with the code below.
================================================================================
*/
/** @type {import('tailwindcss').Config} */
export default {
    // Add darkMode property to enable class-based theme switching
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}