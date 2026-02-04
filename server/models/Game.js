const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  description: String,
  thumbnail: String,
  guide: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Game', GameSchema);
