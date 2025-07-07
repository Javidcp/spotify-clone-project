const mongoose = require("mongoose")

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist:  [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Artist" 
    }],
    coverImage: { type: String },
    duration: { type: String, required: true },
    url: { type: String, required: true },
    playCount: { type: Number, default: 0 },
    genre: { type: mongoose.Schema.Types.ObjectId, ref: "GenrePlaylist" },
    createdAt: { type: Date, default: Date.now },
})


const Song = mongoose.model('Song', songSchema)
module.exports = Song