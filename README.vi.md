# Terisc - Nền tảng Game Online Đa Người Chơi 🎮

**Terisc** là một nền tảng chơi game trực tuyến hiện đại, cho phép người chơi kết nối và thi đấu thời gian thực với nhau. Dự án được xây dựng với công nghệ MERN Stack và Socket.IO, mang lại trải nghiệm mượt mà và giao diện "Glassmorphism" đẹp mắt.

## ✨ Tính năng Nổi bật

*   **⚡ Real-time Multiplayer**: Thi đấu trực tiếp với thời gian thực (Socket.IO).
*   **🎲 Kho Game Đa dạng**:
    *   **Tic Tac Toe (Cờ Caro)**: Chế độ 2 người đấu trí.
    *   **Rắn Săn Mồi (Snake)**: Cổ điển nhưng gây nghiện (Đang phát triển).
    *   **Lật Hình (Memory Match)**: Thử thách trí nhớ (Đang phát triển).
*   **🎨 Giao diện Đỉnh cao**:
    *   Thiết kế **Glassmorphism** sang trọng.
    *   Hỗ trợ **Dark Mode / Light Mode**.
    *   Responsive hoàn hảo trên **Mobile / Tablet / Desktop**.
*   **lobby Phòng Chờ**: Xem danh sách phòng, trạng thái online/offline.
*   **🛠️ Hệ thống Seed Data**: Tự động khởi tạo dữ liệu game ban đầu.

## 🛠️ Công nghệ Sử dụng

### Frontend
*   **React (Vite)**: Tốc độ build siêu nhanh.
*   **Ant Design**: Hệ thống UI Component chuyên nghiệp.
*   **CSS Variables**: Quản lý Theme động (Sáng/Tối).
*   **Socket.IO Client**: Kết nối thời gian thực.

### Backend
*   **Node.js & Express**: API Server mạnh mẽ.
*   **Socket.IO Server**: Xử lý logic game thời gian thực (Room, State, Events).
*   **MongoDB & Mongoose**: Lưu trữ thông tin Game và User.

## 🚀 Cài đặt và Chạy dự án

### Yêu cầu tiên quyết
*   Node.js (v16 trở lên)
*   MongoDB (đã cài đặt local hoặc có URI cloud)

### 1. Cài đặt Client
Tại thư mục gốc:
```bash
npm install
```

### 2. Cài đặt Server
Di chuyển vào thư mục server và cài đặt:
```bash
cd server
npm install
```

### 3. Cấu hình Môi trường
Tạo file `server/.env` và điền thông tin:
```env
REACT_APP_MONGODB_URI=mongodb://localhost:27017/terisc
PORT=3000
```
*(Thay thế URI MongoDB của bạn nếu dùng Cloud)*

### 4. Khởi tạo Dữ liệu (Seed)
Chạy lệnh này một lần để nạp danh sách game vào Database:
```bash
cd server
node seed.js
```

### 5. Khởi chạy
**Chạy Server:**
```bash
cd server
npm run server
```
**Chạy Client:**
(Mở terminal mới tại thư mục gốc)
```bash
npm run dev
```

Truy cập: `http://localhost:5173`

## 📂 Cấu trúc Dự án

```
terisc/
├── src/
│   ├── components/    # Các thành phần UI (Sidebar, Lobby, GameStage...)
│   ├── games/         # Logic trừng trò chơi (TicTacToe, Snake...)
│   ├── GameContext.jsx # Quản lý State toàn cục
│   └── ...
├── server/
│   ├── index.js       # Main Server & Socket logic
│   ├── seed.js        # Script nạp dữ liệu
│   └── ...
└── ...
```

## 🤝 Đóng góp
Dự án được phát triển bởi **Linh Nguyen**. Mọi đóng góp đều được hoan nghênh!

---
*© 2026 Terisc. Built with ❤️.*
