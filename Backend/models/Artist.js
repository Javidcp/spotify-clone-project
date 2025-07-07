const mongoose = require("mongoose")

const artistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
    }],
    followers: { type: Number, default: 0 },
}, { timestamps: true })

const Artist = mongoose.model('Artist', artistSchema)
module.exports = Artist