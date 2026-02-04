const roomsMap = require('./rooms');
const roomHandlers = require('./roomHandlers');
const gameHandlers = require('./gameHandlers');
const { updateLobby, updateRoomData } = require('./helpers');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Người dùng kết nối: ${socket.id}`);

    // Log events for debug
    socket.onAny && socket.onAny((eventName, ...args) => {
      console.log(`[Server] Received: ${eventName}`, args);
    });

    // Gửi danh sách phòng ngay khi mới kết nối
    updateLobby(socket); // Gửi chỉ cho socket này

    // Cho phép client chủ động yêu cầu
    socket.on('request_rooms', () => updateLobby(socket));

    // Register Handlers
    roomHandlers(io, socket);
    gameHandlers(io, socket);

    // Disconnect Logic
    socket.on('disconnect', () => {
      console.log('Người dùng ngắt kết nối', socket.id);
      
      roomsMap.forEach((info, roomId) => {
        const index = info.players.findIndex(p => p.id === socket.id);
        if (index !== -1) {
          const departingPlayer = info.players[index];
          info.players.splice(index, 1);
          info.isPlaying = false; // Dừng game nếu có người thoát
          
          if (info.players.length === 0) {
            roomsMap.delete(roomId);
          } else {
            // Thông báo trong chat
            io.in(roomId).emit('receive_message', {
              id: Date.now(),
              user: 'Hệ thống',
              text: `${departingPlayer.name} đã rời khỏi phòng.`,
              isSystem: true
            });

            // Gửi sự kiện người chơi rời đi
            io.in(roomId).emit('player_left', { 
              playerName: departingPlayer.name,
              isOwner: departingPlayer.isOwner 
            });

            // Chuyển quyền chủ phòng nếu người cũ rời đi
            info.players[0].isOwner = true;
            updateRoomData(io, roomId);
          }
        }
      });

      // Update Lobby
      updateLobby(io);
    });
  });
};
