import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.js',
        './resources/js/**/*.ts',
        './resources/js/**/*.tsx',
    ],
    theme: {
        extend: {
            animation: {
                pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                tafaria: {
                    primary: '#2a5c45',
                    secondary: '#d4a762',
                    light: '#f5f5f0',
                    dark: '#1a2e22',
                    background: '#902729',
                },
                whatsapp: '#25D366',
            },

            fontFamily: {
                sans: ['Montserrat', 'sans-serif'],
            },
        },
        container: {
            center: true,
            padding: '1rem',
            screens: {
                sm: '512px',
                md: '720px',
                lg: '960px',
                xl: '1100px',
                '2xl': '1400px',
            },
        },
    },
    plugins: [daisyui],
};
