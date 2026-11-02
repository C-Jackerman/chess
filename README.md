# ♔ Royal Chess Arena — Cờ Vua Online 1v1, AI & Custom Studio

Tựa game Cờ Vua thời gian thực (Real-time Multiplayer WebSockets) với giao diện tối ưu cho cả **PC** và **Mobile**, hỗ trợ **Solo 1v1 Online**, **Đấu Máy AI (4 cấp độ)**, **Solo 2 Người 1 Máy (Pass & Play / Tabletop)** và **Studio Tùy Chỉnh Giao Diện** chuyên sâu.

## ✨ Tính năng nổi bật

- ⚔️ **Solo 1v1 Online Thời Gian Thực (Socket.IO)**:
  - **Ghép Trận Nhanh (Quick Match)** hoặc **Tạo Phòng Mã 6 Ký Tự** kèm **Link Mời Bạn Bè (`/?room=XXXXXX`)**.
  - **Danh sách Phòng Đang Mở (Live Lobby)** cập nhật trực tiếp.
  - Hỗ trợ **Tái Đấu (Rematch)** tự động đổi màu quân, **Cầu Hòa**, **Xin Đi Lại (Undo)**, **Đầu Hàng**, **Khán Giả Xem Live** và **Tự Động Kết Nối Lại** khi tải lại trang.
  - **Phòng Chat Trực Tiếp** & **Thả Biểu Cảm (Floating Emoji Reactions)** trên bàn cờ.
- 🤖 **Đấu Máy AI (4 Cấp Độ)**:
  - Từ *Tập Sự (ELO 800)* đến *Đại Kiện Tượng (ELO 2100+)* sử dụng thuật toán Minimax + Alpha-Beta Pruning + Bảng Điểm Vị Trí (Piece-Square Tables).
  - Tích hợp **Gợi Ý Nước Đi Tối Ưu (AI Hint Arrow)** và **Thanh Đánh Giá Thế Cờ (Live Evaluation Bar)**.
- 👥 **2 Người 1 Máy (Pass & Play)**:
  - Tùy chọn **Tự động lật bàn cờ** sau mỗi nước đi hoặc **Xoay ngược quân Đen 180° (Tabletop Mode)** để 2 người ngồi đối diện chơi trên cùng 1 điện thoại/máy tính bảng.
- 🎨 **Studio Tùy Chỉnh (Custom UI & Board)**:
  - **8 Chủ Đề Bàn Cờ**: *Emerald Royal*, *Walnut Grandmaster*, *Midnight Cyberpunk*, *Oceanic Glass*, *Imperial Marble*, *Sakura Sunset*, *Nordic Ice*, *Onyx & Gold*.
  - **5 Bộ Quân Cờ SVG**: *Neo-Staunton Pro*, *Royal Imperial*, *Cyber Neon Glow*, *Bauhaus Minimal*, *3D Faceted Crystal*.
  - **4 Không Gian Nền (UI Atmosphere)** + **Góc Nhìn 3D Perspective** + **Bộ Tổng Hợp Âm Thanh Web Audio API**.

## 🚀 Chạy локально (Local Development)

```bash
npm install
npm start
```

Mở trình duyệt tại `http://localhost:3000`.

