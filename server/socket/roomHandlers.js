const roomsMap = require('./rooms');
const { updateLobby, updateRoomData } = require('./helpers');

module.exports = (io, socket) => {
  // Tham gia phòng
  socket.on('join_room', ({ roomId, gameId, playerName }) => {
    socket.join(roomId);
    
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
    
    const room = roomsMap.get(roomId);
    const existingPlayerIndex = room.players.findIndex(p => p.id === socket.id);
    if (existingPlayerIndex === -1 && room.players.length < 2) {
      room.players.push({
        id: socket.id,
        name: playerName || 'Người chơi ẩn danh',
        ready: false,
        isOwner: room.players.length === 0,
        score: 0
      });
    }

    console.log(`[Socket] Người chơi "${playerName}" (${socket.id}) tham gia phòng: ${roomId}`);
    updateRoomData(io, roomId);
    updateLobby(io);
  });

  // Đổi trò chơi (Chỉ chủ phòng)
  socket.on('change_game', ({ roomId, gameId }) => {
    const room = roomsMap.get(roomId);
    if (room && !room.isPlaying) {
      const player = room.players.find(p => p.id === socket.id);
      if (player && player.isOwner) {
        room.gameId = gameId;
        console.log(`[Socket] Phòng ${roomId} đổi sang game: ${gameId}`);
        // Reset trạng thái sẵn sàng khi đổi game
        room.players.forEach(p => p.ready = false);
        updateRoomData(io, roomId);
        updateLobby(io);
      }
    }
  });

  // Sẵn sàng
  socket.on('toggle_ready', ({ roomId }) => {
    const room = roomsMap.get(roomId);
    if (room && !room.isPlaying) {
      const player = room.players.find(p => p.id === socket.id);
      if (player) {
        player.ready = !player.ready;
        updateRoomData(io, roomId);

        if (!player.ready) {
          io.in(roomId).emit('stop_countdown');
        }

        // Kiểm tra xem cả 2 đã sẵn sàng chưa
        if (room.players.length === 2 && room.players.every(p => p.ready)) {
          console.log(`[Socket] Phòng ${roomId}: Cả 2 đã sẵn sàng. Bắt đầu đếm ngược 3s...`);
          io.in(roomId).emit('start_countdown', { seconds: 3 });
          
          // Sau 3 giây thì khởi chạy game thực sự
          setTimeout(() => {
            // Kiểm tra lại lần nữa nhỡ có người cancel trong lúc đếm ngược (optional)
            const currentRoom = roomsMap.get(roomId);
            if (currentRoom && currentRoom.players.length === 2 && currentRoom.players.every(p => p.ready)) {
              // Kích hoạt gameHandlers.start_game thủ công hoặc emit cho chính mình xử lý
              // Ở đây ta copy logic start_game vào hoặc gọi helper.
              // Tốt nhất là thực hiện logic start_game ở đây.
              
              const isReverse = Math.random() < 0.5;
              const p1Symbol = isReverse ? 'O' : 'X';
              const p2Symbol = isReverse ? 'X' : 'O';
              const p1 = currentRoom.players[0];
              const p2 = currentRoom.players[1];

              io.to(p1.id).emit('player_assignment', p1Symbol);
              io.to(p2.id).emit('player_assignment', p2Symbol);
              
              currentRoom.isPlaying = true;
              io.in(roomId).emit('game_started');
              updateLobby(io);
            }
          }, 3000);
        }
      }
    }
  });

  // Cập nhật tên
  socket.on('update_player_name', ({ roomId, playerName }) => {
    const room = roomsMap.get(roomId);
    if (room) {
      const player = room.players.find(p => p.id === socket.id);
      if (player) {
        player.name = playerName;
        updateRoomData(io, roomId);
        updateLobby(io);
      }
    }
  });

  // Cập nhật settings (Chỉ chủ phòng)
  socket.on('update_room_settings', ({ roomId, settings }) => {
    const room = roomsMap.get(roomId);
    if (room) {
      const player = room.players.find(p => p.id === socket.id);
      if (player && player.isOwner) {
        room.settings = { ...room.settings, ...settings };
        console.log(`[Socket] Phòng ${roomId} cập nhật settings:`, room.settings);
        // Gửi cho tất cả mọi người trong phòng
        io.in(roomId).emit('settings_updated', room.settings);
        // Cập nhật cả room_data để người mới vào thấy luôn
        updateRoomData(io, roomId);
      }
    }
  });
};

