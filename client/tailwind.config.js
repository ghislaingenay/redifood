/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/components/*.{js,jsx,ts,tsx}",
        "./src/components/index.ts",
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        // "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        spacing: {
            1: "8px",
            2: "12px",
            3: "16px",
            4: "24px",
            5: "32px",
            6: "48px",
        },
        extend: {},
    },
    plugins: [],
    corePlugins: {
        preflight: false,
    },
};
