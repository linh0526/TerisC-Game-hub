# Terisc - Real-time Multiplayer Game Platform 🎮

**Terisc** is a modern web-based gaming platform that allows players to connect and compete in real-time. Built with the MERN Stack and Socket.IO, it delivers a smooth experience with a stunning "Glassmorphism" UI.

## ✨ Key Features

*   **⚡ Real-time Multiplayer**: Compete instantly with low latency (Socket.IO).
*   **🎲 Diverse Game Library**:
    *   **Tic Tac Toe**: Classic 2-player strategy.
    *   **Snake**: Addictive classic (In progress).
    *   **Memory Match**: Test your memory (In progress).
*   **🎨 Premium UI/UX**:
    *   **Glassmorphism** design language.
    *   **Dark / Light Mode** support.
    *   Fully **Responsive** (Mobile / Tablet / Desktop).
*   **Lobby System**: View active rooms, online/offline status.
*   **🛠️ Seed System**: Auto-initialize game data.

## 🛠️ Tech Stack

### Frontend
*   **React (Vite)**: Lightning fast build.
*   **Ant Design**: Professional UI Components.
*   **CSS Variables**: Dynamic Theme management.
*   **Socket.IO Client**: Real-time connection.

### Backend
*   **Node.js & Express**: Robust API Server.
*   **Socket.IO Server**: Real-time game logic (Rooms, State, Events).
*   **MongoDB & Mongoose**: Database for Games and Users.

## 🚀 Installation & Setup

### Prerequisites
*   Node.js (v16+)
*   MongoDB (Local installed or Cloud URI)

### 1. Client Setup
In root directory:
```bash
npm install
```

### 2. Server Setup
Navigate to server directory:
```bash
cd server
npm install
```

### 3. Environment Config
Create `server/.env` file:
```env
REACT_APP_MONGODB_URI=mongodb://localhost:27017/terisc
PORT=3000
```
*(Replace with your MongoDB URI if using Cloud)*

### 4. Seed Database
Run this once to load initial game data:
```bash
cd server
node seed.js
```

### 5. Run Application
**Start Server:**
```bash
cd server
npm run server
```
**Start Client:**
(Open new terminal in root)
```bash
npm run dev
```

Visit: `http://localhost:5173`

## 📂 Project Structure

```
terisc/
├── src/
│   ├── components/    # UI Components (Sidebar, Lobby, GameStage...)
│   ├── games/         # Game Logic (TicTacToe, Snake...)
│   ├── GameContext.jsx # Global State Management
│   └── ...
├── server/
│   ├── index.js       # Main Server & Socket logic
│   ├── seed.js        # Data Seeding Script
│   └── ...
└── ...
```

## 🤝 Contribution
Developed by **Linh Nguyen**. Contributions are welcome!

---
*© 2026 Terisc. Built with ❤️.*
