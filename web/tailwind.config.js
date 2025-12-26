/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // iOS System Colors (Light/Dark adaptive approximations)
                ios: {
                    bg: {
                        light: '#F2F2F7',
                        dark: '#000000',
                    },
                    card: {
                        light: '#FFFFFF',
                        dark: '#1C1C1E',
                    },
                    text: {
                        light: '#000000',
                        dark: '#FFFFFF',
                    },
                    gray: '#8E8E93',
                    blue: '#007AFF',
                }
            },
            fontFamily: {
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    'Helvetica',
                    'Arial',
                    'sans-serif',
                ],
            },
            boxShadow: {
                'card': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
                'float': '0 8px 16px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04)',
            },
            keyframes: {
                'fade-in-up': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(10px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.3s ease-out',
            },
        },
    },
    plugins: [],
}
