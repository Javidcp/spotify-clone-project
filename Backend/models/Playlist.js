const mongoose = require("mongoose")

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    image: { type: String, required: true },
    songs: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Song"},
    ],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
})

const Playlist = mongoose.model('Playlist', playlistSchema)
module.exports = Playlist 