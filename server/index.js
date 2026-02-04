const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const Game = require('./models/Game');
const roomsMap = require('./socket/rooms');
const socketInit = require('./socket');

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

// API Routes
app.get('/api/games', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = roomsMap.get(roomId);
  if (room) {
    res.json({ gameId: room.gameId });
  } else {
    res.status(404).json({ message: 'Room not found' });
  }
});

app.post('/api/rooms', (req, res) => {
  const { roomId, gameId } = req.body;
  if (!roomId || !gameId) {
    return res.status(400).json({ message: 'Missing roomId or gameId' });
  }
  
  if (!roomsMap.has(roomId)) {
    roomsMap.set(roomId, { 
      gameId, 
      players: [], 
      isPlaying: false,
      settings: {
        timePerTurn: 30,
        timePerPerson: 300,
        firstPlayer: 'random',
        boardSize: 3
      }
    });
  }
  
  res.status(200).json({ success: true });
});

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: ["https://terisc.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

socketInit(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
