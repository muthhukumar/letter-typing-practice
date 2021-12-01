module.exports = {
  mode: 'jit',
  purge: ['./app/**/*.tsx', './app/**/*.jsx', './app/**/*.js', './app/**/*.ts'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extends: {
      colors: {
        black: '#000',
      },
    },
  },
  variants: {},
  plugins: [],
}
