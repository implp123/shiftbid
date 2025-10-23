/** @type {import('tailwindcss').Config} */
export default {
content: [
'./index.html',
'./src/**/*.{js,jsx,ts,tsx}',
],
theme: {
extend: {
colors: {
brand: {
DEFAULT: '#b91c1c',
dark: '#991b1b',
},
},
boxShadow: {
glass: '0 10px 30px rgba(15,23,42,0.06)',
elevate: '0 12px 28px rgba(2,6,23,0.12)'
},
},
},
plugins: [],
};