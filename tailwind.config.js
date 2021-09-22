const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    enabled: true,
    content: [
      './public/*.html',
      './public/js/*.js',
    ],
  },
  darkMode: false,
  theme: {
	extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      black: colors.black,
      white: colors.white,
      gray: colors.coolGray,
      red: colors.red,
      yellow: colors.amber,
      green: colors.emerald,
      blue: colors.blue,
      indigo: colors.indigo,
      purple: colors.violet,
      pink: colors.pink,
      myGreen: {
        400:'#63D397',
        500:'#51BC83',
        600:'#3EB575',
        700:'#359A63',
        800:'#2b8656',
        900:'#246A45',
      },
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('@tailwindcss/forms')
  ],
}
