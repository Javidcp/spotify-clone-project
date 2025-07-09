const Playlist = require("../../models/Playlist")
const Song = require("../../models/Song")
const { errorHandling, createError } = require("../../helper/errorMiddleware")

exports.createPlaylist = errorHandling(async (req, res, next) => {
    const { name, description, userId } = req.body;
    const image = req.file?.path;
    console.log(userId, 'er');
    

    if (!name || !image || !userId) return next(createError(400, "Name, image, and userId are required"));
    

    const existing = await Playlist.findOne({
        name: { $regex: `^${name.trim()}$`, $options: "i" },
        user: userId,
    });

    if (existing) return next(createError(409, `Playlist "${name}" already exists`));

    const newPlaylist = new Playlist({
        name: name.trim(),
        description: description || "",
        image,
        songs: [],
        userId: userId,
    });

    await newPlaylist.save();

    res.status(201).json({
        success: true,
        message: `Playlist "${name}" created successfully`,
        playlists: newPlaylist,
    });
});




exports.getUserPlaylists = errorHandling(async (req, res, next) => {
    const { userId } = req.params;
    const playlists = await Playlist.find({ userId: userId });
    res.status(200).json({ success: true, playlists });
});




exports.getAllPlaylists = errorHandling(async (req, res) => {
    const playlists = await Playlist.find({}, "name image").sort({ createdAt: -1 })
    res.status(200).json(playlists);
});



exports.getPlaylist = errorHandling(async (req, res) => {
    const playlists = await Playlist.find({}, "name");
    res.status(200).json(playlists)
});



exports.getPlaylists = errorHandling( async (req, res, next) => {
    const playlist = await Playlist.findById(req.params.id).populate({path: 'songs', populate: [{ path: 'artist', model: 'Artist'}, { path: "genre", model: "GenrePlaylist" }]})
    if (!playlist) return next(createError(404, "Playlist not found"))
    res.json(playlist);
})



exports.deletePlaylist = errorHandling(async (req, res, next) => {
    const { playlistId } = req.params;

    const playlist = await Playlist.findByIdAndDelete( playlistId )
    if (!playlist) return next(createError(404, "Artist not found"))
    res.status(200).json(playlist)
})



exports.updatePlaylist = errorHandling(async (req, res) => {
    const playlistId = req.params.id;
    const { name, description } = req.body;
    const image = req.file?.path || ''

    const updateData = {
        name: name?.trim(),
        description: description?.trim(),
    };
    if (image) updateData.image = image;
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        updateData,
        { new: true }
    );
    if (!updatedPlaylist) return next(createError(404,"Playlist not found" ));

    res.status(200).json({ message: "Playlist updated", playlist: updatedPlaylist });
})




exports.addSongToPlaylist = errorHandling(async (req, res, next) => {
    const { playlistId, songId } = req.body;

    if (!playlistId || !songId) {
        return next(createError(400, 'playlistId and songId are required'));
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        return next(createError(404, 'Playlist not found'));
    }

    const song = await Song.findById(songId);
    if (!song) {
        return next(createError(404, 'Song not found'));
    }

    if (playlist.songs.includes(songId)) {
        return next(createError(409, 'Song already exists in the playlist'));
    }

    playlist.songs.push(songId);
    await playlist.save();

    res.status(200).json({
        success: true,
        message: `Song "${song.title}" added to playlist "${playlist.name}"`,
        playlist,
    });
});



exports.removeSongFromPlaylist = errorHandling(async (req, res, next) => {
    const { playlistId, songId } = req.body;

    if (!playlistId || !songId) {
        return next(createError(400, 'playlistId and songId are required'));
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        return next(createError(404, 'Playlist not found'));
    }

    const song = await Song.findById(songId);
    if (!song) {
        return next(createError(404, 'Song not found'));
    }

    if (!playlist.songs.includes(songId)) {
        return next(createError(404, 'Song not found in the playlist'));
    }

    playlist.songs = playlist.songs.filter(id => id.toString() !== songId.toString());
    await playlist.save();

    res.status(200).json({
        success: true,
        message: `Song "${song.title}" removed from playlist "${playlist.name}"`,
        playlist,
    });
});
