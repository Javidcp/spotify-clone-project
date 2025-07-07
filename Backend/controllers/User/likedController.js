const { errorHandling } = require("../../helper/errorMiddleware")
const User = require("../../models/User")


exports.addToLikedSongs = errorHandling( async (req, res, next) => {
    const userId = req.userId
    const { songId } = req.body
    console.log(userId, "fvdc");

    const user = await User.findById( userId )
    const index = user.likedSongs.indexOf(songId)

    if (index !== -1) {
        user.likedSongs.pull(songId)
    } else {
        user.likedSongs.push(songId)
    }
    await user.save()

    res.json({ likedSongs: user.likedSongs })
})




exports.getLikedSongs = errorHandling( async (req, res,next) => {
    const user = await User.findById(req.userId).populate({
      path: "likedSongs",
      populate: [
        { path: "artist", model: "Artist" },
        { path: "genre", model: "GenrePlaylist" }
      ]
    }).exec()
    res.json(user.likedSongs)
})