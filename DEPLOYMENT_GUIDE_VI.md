# Hướng dẫn Deploy Terisc lên Render và Vercel

Hướng dẫn chi tiết từng bước để đưa ứng dụng Terisc lên môi trường thực tế (Production).

## 🌍 Kiến trúc Triển khai
Chúng ta sẽ sử dụng chiến lược **Split Deployment**:
1.  **Backend (Server)**: Deploy lên **Render** (để hỗ trợ WebSocket & MongoDB).
2.  **Frontend (Client)**: Deploy lên **Vercel** (tối ưu cho React/Vite).

---

## Phần 1: Deploy Backend lên Render

### Bước 1: Chuẩn bị Code
Đảm bảo bạn đã push code mới nhất lên GitHub (bao gồm folder `server` và `package.json` trong đó).

### Bước 2: Tạo Web Service trên Render
1.  Truy cập [Render Dashboard](https://dashboard.render.com).
2.  Chọn **New +** -> **Web Service**.
3.  Kết nối với Repository GitHub của bạn `TerisC-Game-hub`.

### Bước 3: Cấu hình Render
Điền các thông tin sau:
*   **Name**: `terisc-server` (hoặc tên tùy ý).
*   **Region**: Singapore (cho tốc độ tốt nhất về VN).
*   **Root Directory**: `server` (Rất quan trọng! Chỉ định thư mục chứa backend).
*   **Runtime**: Node.
*   **Build Command**: `npm install`.
*   **Start Command**: `node index.js`.

### Bước 4: Thiết lập Biến môi trường (Environment Variables)
Kéo xuống phần **Environment Variables** và thêm:
*   `REACT_APP_MONGODB_URI`: (Copy chuỗi kết nối MongoDB của bạn vào đây).
*   `PORT`: `3000` (Mặc định).

### Bước 5: Deploy
Nhấn **Create Web Service**. Chờ quá trình build hoàn tất.
👉 **Lưu lại URL Backend** vừa được tạo (Ví dụ: `https://terisc-server.onrender.com`).

---

## Phần 2: Deploy Frontend lên Vercel

### Bước 1: Import Dự án trên Vercel
1.  Truy cập [Vercel Dashboard](https://vercel.com/dashboard).
2.  Chọn **Add New...** -> **Project**.
3.  Import Repository GitHub `TerisC-Game-hub`.

### Bước 2: Cấu hình Vercel
*   **Framework Preset**: Vite (Vercel thường tự nhận diện).
*   **Root Directory**: `./` (Mặc định).

### Bước 3: Thiết lập Biến môi trường
Mở phần **Environment Variables** và thêm:
*   **Name**: `VITE_API_URL`
*   **Value**: `https://terisc-server.onrender.com` (Dán URL Backend bạn đã lưu ở Phần 1 - **Lưu ý: Không có dấu / ở cuối**).

### Bước 4: Deploy
Nhấn **Deploy**. Chờ Vercel build và hoàn tất.

---

## 🚀 Kiểm tra Hoạt động

1.  Truy cập trang web của bạn trên Vercel (ví dụ: `https://terisc-game-hub.vercel.app`).
2.  **Kiểm tra kết nối Server**:
    *   Nhìn vào góc trên bên phải trang chủ hoặc vào **Phòng chờ (Lobby)**.
    *   Nếu thấy **"● Máy chủ Trực tuyến"** (màu xanh) -> Kết nối thành công! ✅
    *   Nếu thấy danh sách Game load được -> Kết nối Database thành công! ✅
3.  **Chơi thử**:
    *   Tạo phòng Tic Tac Toe và gửi link cho bạn bè (hoặc mở tab ẩn danh) để test tính năng Real-time.

## ⚠️ Lưu ý Quan trọng
*   **Render Free Tier**: Server trên Render gói miễn phí sẽ tự động "ngủ" (spin down) sau 15 phút không hoạt động. Lần truy cập tiếp theo có thể mất 30-60s để server khởi động lại. Đây là bình thường.
*   **CORS**: Server hiện tại đã cấu hình `cors: origin: "*"` nên sẽ chấp nhận request từ mọi nguồn (bao gồm Vercel).

Chúc mừng bạn đã deploy thành công! 🎉
