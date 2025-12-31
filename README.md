# phu_tate_next

## Quick start

1. ติดตั้ง dependencies  
   ```bash
   npm install
   ```

2. ตั้งค่า environment (`.env.local`) ตัวอย่างตัวแปรที่ใช้  
   ```
   NEXT_PUBLIC_LIFF_ID=your_liff_id
   DB_HOST=...
   DB_USER=...
   DB_PASS=...
   DB_NAME=...
   DB_HOST_LAB=...
   DB_USER_LAB=...
   DB_PASS_LAB=...
   DB_NAME_LAB=...
   ```

3. รัน dev server  
   ```bash
   npm run dev
   ```

4. เปิดเบราว์เซอร์ที่ `http://localhost:3000` แล้วเข้าสู่ระบบด้วย LIFF ตาม flow ในหน้าแรก

## ใช้ ngrok สำหรับทดสอบ LIFF/LINE
1. ติดตั้ง/ล็อกอิน ngrok แล้วรัน tunnel ไปยังพอร์ต 3000  
   ```bash
   ngrok http 3000
   ```
2. นำ HTTPS URL ที่ได้ (เช่น `https://xyz.ngrok.io`) ไปตั้งใน LINE Developers:
   - LIFF Endpoint URL: `https://xyz.ngrok.io`
   - OAuth2 Callback/Redirect (ถ้ามี): `https://xyz.ngrok.io`
3. ตั้งค่า `NEXT_PUBLIC_LIFF_ID` ให้ตรง LIFF ที่ชี้ไป ngrok URL แล้วรีสตาร์ท dev server

## Notes
- ถ้าปุ่มออกจากระบบใน LIFF จะ `logout + closeWindow`; บนเบราว์เซอร์ทั่วไปจะพาไปหน้าแรกของแอป
- หน้าบ้าน `/home` จะใช้ข้อมูลแล็บจาก `sessionStorage` (labs/cid/person) ที่ถูกตั้งค่าจากขั้นตอนล็อกอินแรก
