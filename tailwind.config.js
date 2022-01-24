module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './projects/**/*.{html,ts}'
  ],
  theme: {
    extend: {
      boxShadow: {
        'brutal-violet': '8px 8px #4C1D95',
        'brutal-teal-300': '8px 8px #5eead4',
      },
      flex: {
        '100': '1 1 100%'
      }
    },
  },
  plugins: [],
}
