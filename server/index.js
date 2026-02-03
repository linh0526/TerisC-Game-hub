const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Load env vars
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// MongoDB Connection
mongoose.connect(process.env.REACT_APP_MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const GameSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  description: String,
  thumbnail: String,
  rule: String,
  guide: mongoose.Schema.Types.Mixed
});

const Game = mongoose.model('Game', GameSchema);

// API Routes
app.get('/api/games', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Lưu trữ thông tin phòng: { roomId: { gameId, players: [] } }
const roomsMap = new Map();

io.on('connection', (socket) => {
  console.log(`Người dùng kết nối: ${socket.id}`);

  // Gửi danh sách phòng hiện tại cho người mới kết nối
  socket.emit('update_rooms', Array.from(roomsMap.entries()).map(([id, info]) => ({
    id,
    ...info,
    playerCount: info.players.length
  })));

  // Tham gia vào phòng chơi
  socket.on('join_room', ({ roomId, gameId }) => {
    socket.join(roomId);
    
    if (!roomsMap.has(roomId)) {
      roomsMap.set(roomId, { gameId, players: [] });
    }
    
    const room = roomsMap.get(roomId);
    if (!room.players.includes(socket.id)) {
      room.players.push(socket.id);
    }

    // Gán quân cờ: người đầu tiên là X, người thứ hai là O
    const symbol = room.players.indexOf(socket.id) === 0 ? 'X' : 'O';
    socket.emit('player_assignment', symbol);

    console.log(`Người dùng ${socket.id} đã tham gia phòng: ${roomId} (${gameId}) - Đóng vai: ${symbol}`);
    
    // Thông báo cho tất cả về danh sách phòng mới
    io.emit('update_rooms', Array.from(roomsMap.entries()).map(([id, info]) => ({
      id,
      ...info,
      playerCount: info.players.length
    })));
  });

  // Xử lý gửi nước đi
  socket.on('send_move', (data) => {
    // Reset trạng thái đồng ý chơi lại khi có nước đi mới
    const room = roomsMap.get(data.roomId);
    if (room) {
      room.rematchAgreements = [];
    }
    socket.to(data.roomId).emit('receive_move', data);
  });

  // Xử lý yêu cầu chơi lại
  socket.on('request_rematch', (roomId) => {
    const room = roomsMap.get(roomId);
    if (room) {
      if (!room.rematchAgreements) room.rematchAgreements = [];
      
      if (!room.rematchAgreements.includes(socket.id)) {
        room.rematchAgreements.push(socket.id);
      }

      // Thông báo cho đối thủ biết có người muốn chơi lại
      socket.to(roomId).emit('rematch_requested', {
        requesterId: socket.id,
        count: room.rematchAgreements.length
      });

      // Nếu cả 2 đều đồng ý
      if (room.rematchAgreements.length === 2) {
        room.rematchAgreements = [];
        io.in(roomId).emit('start_rematch');
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Người dùng ngắt kết nối', socket.id);
    
    // Dọn dẹp phòng khi người dùng rời đi
    roomsMap.forEach((info, roomId) => {
      const index = info.players.indexOf(socket.id);
      if (index !== -1) {
        info.players.splice(index, 1);
        if (info.players.length === 0) {
          roomsMap.delete(roomId);
        }
      }
    });

    // Cập nhật lại danh sách phòng sau khi dọn dẹp
    io.emit('update_rooms', Array.from(roomsMap.entries()).map(([id, info]) => ({
      id,
      ...info,
      playerCount: info.players.length
    })));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
