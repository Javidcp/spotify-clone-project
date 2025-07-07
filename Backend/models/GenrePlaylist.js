const mongoose = require("mongoose")

const genreSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    image: { type: String, required: true },
    songs: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
    },
  ],
})

const GenrePlaylist = mongoose.model('GenrePlaylist', genreSchema)
module.exports = GenrePlaylist