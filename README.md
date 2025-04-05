# 🎬 Blockbuster

**A movie shopping web app using Next.js, MUI, Tailwind CSS, and LocalStorage.**  
**เว็บไซต์จำหน่ายภาพยนตร์ สร้างด้วย Next.js ร่วมกับ MUI, Tailwind CSS และ LocalStorage**

👉 **Live Demo:** [https://movietest-nontachai.netlify.app/](https://movietest-nontachai.netlify.app/)  
📦 **GitHub:** [https://github.com/Gas-nontachai/Skuberg_Test_Frontend_Blockbuster-_Nontachai.git](https://github.com/Gas-nontachai/Skuberg_Test_Frontend_Blockbuster-_Nontachai.git)

---

## 🚀 Features / ฟีเจอร์

- 🔍 **Movie search** (via TMDb API)  
  **ค้นหาภาพยนตร์** โดยใช้ API จาก TMDb
- 📄 **Movie detail page**  
  **แสดงหน้ารายละเอียดของหนัง** เช่น ชื่อ เรื่องย่อ คะแนน และภาพโปสเตอร์
- 💵 **Automatic pricing based on rating (internal logic)**  
  **คำนวณราคาหนังจากคะแนนเรตติ้ง (โดยใช้ฟังก์ชันภายใน)**
- 🛒 **Add to cart**  
  **สามารถเพิ่มหนังลงในตะกร้า**
- 🔄 **Cart persistence via LocalStorage**  
  **เก็บข้อมูลตะกร้าไว้ใน LocalStorage แม้ปิดเว็บไป**
- 📉 **Discount system**  
  **ระบบส่วนลดอัตโนมัติ**  
  - 10% off when buying more than 3 items  
    ลด 10% เมื่อซื้อเกิน 3 รายการ  
  - 20% off when buying more than 5 items  
    ลด 20% เมื่อซื้อเกิน 5 รายการ
- ❌ **Clear cart button**  
  **สามารถล้างตะกร้าได้**
- 🕒 **Popup with payment info and 1-minute countdown**  
  **แสดง Popup รายละเอียดการโอนเงิน พร้อมนับถอยหลัง 1 นาที**

---

## 🧪 Tech Stack / เทคโนโลยีที่ใช้

- [Next.js](https://nextjs.org/) – React framework
- [MUI (Material UI)](https://mui.com/) – UI components
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS
- [TMDb API](https://www.themoviedb.org/documentation/api) – Movie data source
- [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) – Store cart data on client

---

## 🛠 Installation / วิธีติดตั้ง

```bash
# 1. Clone the repository / โคลนโปรเจกต์
git clone https://github.com/Gas-nontachai/Skuberg_Test_Frontend_Blockbuster-_Nontachai.git

# 2. Go to the project folder / เข้าโฟลเดอร์
cd Skuberg_Test_Frontend_Blockbuster-_Nontachai

# 3. Install dependencies / ติดตั้ง dependency
npm install

# 4. Start development server / เริ่มใช้งาน
npm run dev
