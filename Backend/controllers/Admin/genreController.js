const GenrePlaylist = require("../../models/GenrePlaylist")
const { errorHandling, createError } = require("../../helper/errorMiddleware")

exports.createGenrePlaylist = errorHandling( async (req, res, next) => {
    const { name, description } = req.body;
    const image = req.file?.path;

    if (!name || !image) {
        return next(createError(400, "Name and image are required"));
    }
    const existing = await GenrePlaylist.findOne({name: { $regex: `^${name.trim()}$`, $options: "i" }});
    if (existing) {
        return next(createError(409, `Playlist "${name}" already exists`));
    }

    const newPlaylist = new GenrePlaylist({
        name: name.trim(),
        description: description || "",
        image,
        songs: [],
    });
    await newPlaylist.save();

    res.status(201).json({
        success: true,
        message: `Playlist "${name}" created successfully`,
        playlist: newPlaylist,
    });
})  



exports.getAllGenrePlaylists = errorHandling(async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit

    const playlists = await GenrePlaylist.find({}, "name description image").sort({ createdAt: -1 }).skip(skip).limit(limit)
    const total = await GenrePlaylist.countDocuments()
    res.status(200).json({ page, totalPages: Math.ceil(total / limit), totalItem: total, data: playlists });
});



exports.getGenres = errorHandling(async (req, res) => {
    const genres = await GenrePlaylist.find({}, "name");
    res.status(200).json(genres)
});



exports.getGenrePlaylist = errorHandling( async (req, res, next) => {
    const genre = await GenrePlaylist.findById(req.params.id).populate({path: 'songs', populate: [{ path: 'artist', model: 'Artist'}, { path: 'genre', model: 'GenrePlaylist' }]})
    if (!genre) return next(createError(404, "Genre not found"))
    res.json(genre);
})



exports.deleteGenre = errorHandling(async (req, res, next) => {
    const { genreId } = req.params;

    const genre = await GenrePlaylist.findByIdAndDelete( genreId )
    if (!genre) return next(createError(404, "Artist not found"))
    res.status(200).json(genre)
})



exports.updateGenre = errorHandling(async (req, res) => {
    const genreId = req.params.id;
    const { name, description } = req.body;
    const image = req.file?.path || ''

    const updateData = {
        name: name?.trim(),
        description: description?.trim(),
    };
    if (image) updateData.image = image;
    const updatedGenre = await GenrePlaylist.findByIdAndUpdate(
        genreId,
        updateData,
        { new: true }
    );
    if (!updatedGenre) return next(createError(404,"Genre not found" ));

    res.status(200).json({ message: "Genre updated", genre: updatedGenre });
})