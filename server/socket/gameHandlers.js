const roomsMap = require('./rooms');
const { updateLobby, updateRoomData } = require('./helpers');

module.exports = (io, socket) => {
  // Nước đi, Rematch, Winner, Chat handlers...


  // Gửi nước đi
  socket.on('send_move', (data) => {
    socket.to(data.roomId).emit('receive_move', data);
  });

  // Chơi lại
  socket.on('request_rematch', (roomId) => {
    const room = roomsMap.get(roomId);
    if (room && room.players.length === 2) {
      if (!room.rematchRequests) room.rematchRequests = new Set();
      room.rematchRequests.add(socket.id);

      socket.to(roomId).emit('rematch_requested');

      if (room.rematchRequests.size === 2) {
        room.rematchRequests.clear();
        const isReverse = Math.random() < 0.5;
        const p1Symbol = isReverse ? 'O' : 'X';
        const p2Symbol = isReverse ? 'X' : 'O';
        const p1 = room.players[0];
        const p2 = room.players[1];

        io.in(roomId).emit('start_rematch'); 
        setTimeout(() => {
           io.to(p1.id).emit('player_assignment', p1Symbol);
           io.to(p2.id).emit('player_assignment', p2Symbol);
        }, 100);
      }
    }
  });

  // Báo thắng
  socket.on('report_winner', ({ roomId, winnerId }) => {
    const room = roomsMap.get(roomId);
    if (room) {
      let targetId = winnerId || socket.id;
      
      // Nếu winnerId là 'opponent', tìm người chơi còn lại trong phòng
      if (winnerId === 'opponent') {
        const opponent = room.players.find(p => p.id !== socket.id);
        if (opponent) targetId = opponent.id;
      }

      const player = room.players.find(p => p.id === targetId);
      if (player) {
        player.score = (player.score || 0) + 1;
        updateRoomData(io, roomId);
        
        // Nếu là thắng do timeout (có winnerId), báo cho cả phòng để hiện UI
        if (winnerId) {
          io.in(roomId).emit('game_over_timeout', { winnerId: targetId });
        }
      }
    }
  });

  // Chat
  socket.on('send_message', ({ roomId, message, user }) => {
     io.in(roomId).emit('receive_message', { 
       id: Date.now(), 
       user, 
       text: message, 
       senderId: socket.id 
     });
  });
};
