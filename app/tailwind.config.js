/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#fff',
        mediumslateblue: '#5669ff',
        'color-primary-blue': '#5669ff',
        blueviolet: '#4A43EC',
        'color-typography-title': '#120d26',
        darkgray: '#9d9898',
        gainsboro: '#e4dfdf',
        slategray: '#747688',
        gray: '#716E90',
        'gray-100': '#FEFEFF',
      },
      spacing: {},
      fontFamily: {
        airbnbcereal_w_bd: 'AirbnbCereal_W_Bd',
        airbnbcereal_w_bk: 'AirbnbCereal_W_Bk',
        'airbnb-cereal-app': 'AirbnbCereal_W_Bk',
      },
      fontSize: {
        base: '16px',
        sm: '14px',
        inherit: 'inherit',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
