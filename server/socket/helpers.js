const roomsMap = require('./rooms');

const updateLobby = (io) => {
  const roomsData = Array.from(roomsMap.entries()).map(([id, info]) => ({
    id,
    gameId: info.gameId,
    playerCount: info.players.length,
    isPlaying: info.isPlaying
  }));
  console.log(`[Socket] Đang gửi bộ dữ liệu lobby (${roomsData.length} phòng)`);
  io.emit('update_rooms', roomsData);
};

const updateRoomData = (io, roomId) => {
  const room = roomsMap.get(roomId);
  if (room) {
    io.in(roomId).emit('room_data_updated', {
      players: room.players,
      gameId: room.gameId,
      settings: room.settings
    });
  }
};

module.exports = {
  updateLobby,
  updateRoomData
};
