/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1e3a5f',
                    50: '#f0f5fa',
                    100: '#d9e8f5',
                    200: '#b3d1eb',
                    300: '#6fa8d4',
                    400: '#3a7fbf',
                    500: '#1e3a5f',
                    600: '#162c48',
                    700: '#0f1e32',
                    800: '#080f19',
                    900: '#040810',
                },
                accent: {
                    DEFAULT: '#f97316',
                    light: '#fdba74',
                    dark: '#c2410c',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
