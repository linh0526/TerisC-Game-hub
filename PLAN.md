# Kế hoạch phát triển GameHub 🎮

Dự án này nhằm tạo ra một nền tảng Web Game Center với giao diện hiện đại, cao cấp và có khả năng mở rộng cao để dễ dàng thêm các trò chơi mới.

## 🏗️ Kiến trúc hệ thống

### 1. Công nghệ sử dụng
- **Core**: React (Vite)
- **Styling**: Vanilla CSS (CSS Modules) với hệ thống Design System chuẩn "Premium".
- **Quản lý trạng thái**: React Context API (cho điểm số, user profile).

### 2. Thiết kế đặc trưng (Aesthetics)
- **Phong cách**: Glassmorphism (hiệu ứng kính mờ), Dark Mode sang trọng.
- **Màu sắc**: Ocean Blue (#0077ff), Neon Purple (#bc13fe), và Slate Black (#0f172a).
- **Hiệu ứng**: Animation mượt mà với CSS Transitions và Keyframes.

### 3. Cơ chế mở rộng (Extensibility)
- Mỗi trò chơi sẽ được đóng gói như một module độc lập trong thư mục `src/games/`.
- Một tệp `registry.js` sẽ định nghĩa metadata cho từng game (tên, icon, component).
- `GameStage`: Một component chung để render bất kỳ trò chơi nào được chọn.

## 📋 Danh sách công việc (Tasks)

### Giai đoạn 1: Khởi tạo nền móng
- [ ] Khởi tạo dự án Vite + React.
- [ ] Thiết lập cấu trúc thư mục.
- [ ] Xây dựng bộ Design System (biến CSS, reset styles).

### Giai đoạn 2: UI/UX Framework
- [ ] Tạo `Sidebar` điều hướng và `Header`.
- [ ] Xây dựng `Dashboard` hiển thị danh sách game dưới dạng Card cao cấp.
- [ ] Triển khai hiệu ứng hover và chuyển cảnh.

### Giai đoạn 3: Game Core & Extensibility
- [ ] Xây dựng `GameRegistry` và `GameLoader`.
- [ ] Implement trò chơi mẫu 1: **Tic Tac Toe (Cờ Caro)**.
- [ ] Implement trò chơi mẫu 2: **Snake (Rắn săn mồi)**.

### Giai đoạn 4: Hoàn thiện & Polish
- [ ] Tối ưu hóa SEO.
- [ ] Thêm hiệu ứng âm thanh (nếu cần) và hoàn thiện micro-interactions.

---
*Người thực hiện: terisc*
