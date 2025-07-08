const Playlist = require("../../models/Playlist")
const { errorHandling, createError } = require("../../helper/errorMiddleware")

exports.createPlaylist = errorHandling( async (req, res, next) => {
    const { name, description } = req.body;
    const image = req.file?.path;

    if (!name || !image) {
        return next(createError(400, "Name and image are required"));
    }
    const existing = await Playlist.findOne({name: { $regex: `^${name.trim()}$`, $options: "i" }});
    if (existing) {
        return next(createError(409, `Playlist "${name}" already exists`));
    }

    const newPlaylist = new Playlist({
        name: name.trim(),
        description: description || "",
        image,
        songs: [],
    });
    await newPlaylist.save();

    res.status(201).json({
        success: true,
        message: `Playlist "${name}" created successfully`,
        playlists: newPlaylist,
    });
})  



exports.getAllPlaylists = errorHandling(async (req, res) => {
    const playlists = await Playlist.find({}, "name image").sort({ createdAt: -1 })
    res.status(200).json(playlists);
});



exports.getPlaylist = errorHandling(async (req, res) => {
    const playlists = await Playlist.find({}, "name");
    res.status(200).json(playlists)
});



exports.getPlaylists = errorHandling( async (req, res, next) => {
    const playlist = await Playlist.findById(req.params.id).populate({path: 'songs', populate: [{ path: 'artist', model: 'Artist'}, { path: 'playlist', model: 'Playlist' }]})
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