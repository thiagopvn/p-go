/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1e3a8a',
        'brand-blue-light': '#2563eb',
        'brand-blue-dark': '#1e40af',
        'brand-accent': '#60a5fa',
        'brand-bg': '#f0f4f8',
        'brand-surface': '#ffffff',
        'brand-text': '#111827',
        'brand-text-light': '#6b7280',
        'section-date': '#fef3c7',
        'section-date-border': '#f59e0b',
        'section-enter': '#d1fae5',
        'section-enter-border': '#10b981',
        'section-exit': '#fee2e2',
        'section-exit-border': '#ef4444',
        'section-service': '#e0e7ff',
        'section-service-border': '#6366f1',
      }
    }
  },
  plugins: [],
}