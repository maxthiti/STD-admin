/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Prompt", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],

  daisyui: {
    themes: [
      {
        blueYellow: {
          primary: "#2563eb", // น้ำเงิน (Blue) - สีหลัก
          "primary-content": "#ffffff", // ข้อความบนพื้นหลังน้ำเงิน
          secondary: "#fbbf24", // เหลือง (Yellow)
          "secondary-content": "#1f2937", // ข้อความบนพื้นหลังเหลือง
          accent: "#facc15", // เหลืองสว่าง
          "accent-content": "#1f2937",
          neutral: "#1e3a8a", // น้ำเงินเข้ม
          "neutral-content": "#ffffff",
          "base-100": "#ffffff", // พื้นหลังขาว
          "base-200": "#eff6ff", // น้ำเงินอ่อนมาก
          "base-300": "#dbeafe", // น้ำเงินอ่อน
          "base-content": "#1e293b",
          info: "#3b82f6", // น้ำเงิน
          "info-content": "#ffffff",
          success: "#10b981", // เขียว
          "success-content": "#ffffff",
          warning: "#fbbf24", // เหลือง
          "warning-content": "#1f2937",
          error: "#ef4444", // แดง
          "error-content": "#ffffff",
        },
      },
    ],
  },
};
