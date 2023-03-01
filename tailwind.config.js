/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@smartive-education/design-system-component-library-yeahyeahyeah')],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@smartive-education/design-system-component-library-yeahyeahyeah/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [],
};
