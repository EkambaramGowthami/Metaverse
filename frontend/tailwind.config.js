import { transform } from 'typescript';


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 1, transform: 'scale(1.2)' },
          '100%': { opacity: 0.9, transform: 'scale(1)' },
        },
        slideInRight:{
          '0%':{opacity:0,transform:'translateX(100%)',},
          '100%':{opacity:1,transform:'translateX(0%)'}
        },
        slideInLeft:{
          '0%':{opacity:0,transform:'translateX(-100%) rotate(-180deg)'},
          '100%':{opacity:1,transform:'translateX(0%) rotate-0'}

        },
        slideInTop:{
          '0%':{opacity:0,transform:'translateY(-100%) rotate(-180deg)'},
          '100%':{opacity:1,transform:'translateY(0%) rotate-0'}
        },
        slideInDown:{
          '0%':{opacity:0,transform:'translateY(-00%) rotate(-180deg)'},
          '100%':{opacity:1,transform:'translateY(0%) rotate-0'}
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        
        
      },
      animation: {
        fadeInUp: 'fadeInUp 1s ease-out forwards',
        slideInLeft :'slideInLeft 1s ease-out forwards',
        slideInRight:'slideInRight 1s ease-out forwards',
        slideInDown:'slideInDown 1s ease-out forwards',
        slideInTop:'slideInTOp 1s ease-out forwards',
        blob: 'blob 10s infinite ease-in-out',

     },
    },
  
  },
  plugins: [],
}
