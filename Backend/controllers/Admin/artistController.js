const { createError, errorHandling } = require("../../helper/errorMiddleware")
const Artist = require("../../models/Artist")

exports.addArtist = errorHandling(async (req, res, next) => {
    const { name } = req.body
    const image = req.file?.path || '';

    if (!name) return next(createError(400,'Artist name is required' ))
    const existing = await Artist.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (existing) {
        return next(createError(400, 'Artist with this name already exists.'));
    }

    const newArtist = new Artist({ name, image })
    const savedArtist = await newArtist.save()
    res.status(201).json(savedArtist)
})



exports.getArtist = errorHandling(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const artists = await Artist.find().populate('songs').skip(skip).limit(limit)
    const total = await Artist.countDocuments()
    res.status(200).json({ page, totalPages: Math.ceil(total / limit), totalItems: total, data: artists });
})



exports.getSingleArtist = errorHandling( async (req, res, next) => {
    const { artistId } = req.params;
    const artist = await Artist.findById( artistId ).populate({path: 'songs', populate: [{ path: 'artist', model: 'Artist'}, { path: 'genre', model: 'GenrePlaylist' }]})
    if ( !artist ) return next(createError(404, "Artist not found"))

    res.status(200).json( artist )
})

exports.getArtistName = errorHandling( async(req, res, next) => {
    const artist = await Artist.find({}, "name")
    res.json(artist)
})



exports.updateArtist = errorHandling( async (req, res, next) => {
    const { name } = req.body
    const image = req.file?.path || ''
    const { artistId } = req.params

    const updatedData = { name };
    if (image) updatedData.image = image;

    const artist = await Artist.findByIdAndUpdate( artistId, updatedData, { new: true } )
    if ( !artist ) return next(createError(404, "Artist not found"))

    res.status(200).json({ message : "Artist updated successfully",artist })
})



exports.deleteArtist = errorHandling(async (req, res, next) => {
    const { artistId } = req.params;

    const artist = await Artist.findByIdAndDelete( artistId )
    if (!artist) return next(createError(404, "Artist not found"))
    res.status(200).json(artist)
})