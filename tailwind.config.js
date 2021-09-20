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
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer')
  ],
}
