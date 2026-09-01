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
                    DEFAULT: '#0d01a3',
                    50: '#eeebff',
                    100: '#cbc2ff',
                    200: '#a899ff',
                    300: '#8570ff',
                    400: '#6247ff',
                    500: '#0d01a3',
                    600: '#0a017c',
                    700: '#070058',
                    800: '#040035',
                    900: '#02001c',
                },
                accent: {
                    DEFAULT: '#4285F4',
                    50: '#E8F0FE',
                    100: '#D2E3FC',
                    200: '#A8C8FA',
                    300: '#7EAEF7',
                    400: '#5894F5',
                    500: '#4285F4',
                    600: '#3367D6',
                    700: '#254EAF',
                    800: '#173688',
                    900: '#0C1E61',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
