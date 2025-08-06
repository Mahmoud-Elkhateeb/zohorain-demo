module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4f46e5',
            },
        },
    },
    plugins: [
        require('tailwind-scrollbar'),
    ],
}