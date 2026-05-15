// เก็บการตั้งค่าเปิด/ปิดฟีเจอร์สำหรับแต่ละโรงเรียน

export default {
  // ฟีเจอร์สำหรับตารางเข้า-ออก
  attendance: {
    enableLineupColumn: import.meta.env.VITE_ENABLE_LINEUP_COLUMN === "false",
  },

  // ฟีเจอร์สำหรับหน้าเช็คชื่อ
  checkName: {
    // person_confirmation: ต้องมี usecase = person_confirmation
    // any_timestamp: มี timeStamps มากกว่า 0 ก็ถือว่ามา
    presentMode:
      import.meta.env.VITE_CHECKNAME_PRESENT_MODE || "any_timestamp",
  },

  // ฟีเจอร์สำหรับอุปกรณ์
  device: {
    enableUseCase: import.meta.env.VITE_ENABLE_DEVICE_USECASE === "false",
  },

  // ฟีเจอร์อื่น ๆ (เพิ่มได้ตามต้องการ)
};
