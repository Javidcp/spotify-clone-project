const Artist = require("../../models/Artist")
const Song = require("../../models/Song")
const GenrePlaylist = require("../../models/GenrePlaylist")
const { errorHandling } = require("../../helper/errorMiddleware")



exports.serachDetails = errorHandling( async (req, res, next) => {
    const q = req.query.q || ''
    const regex = new RegExp(q, 'i')

    const artists = await Artist.find({ name: regex }).lean();
    const songs = await Song.find({ title: regex }).populate('artist').lean();
    const genres = await GenrePlaylist.find({ name: regex }).lean();

    const formattedArtists = artists.map(a => ({ ...a, type: 'artist' }));
    const formattedSongs = songs.map(s => ({ ...s, type: 'song' }));
    const formattedGenres = genres.map(g => ({ ...g, type: 'genre' }));

    res.json({
    artists: formattedArtists,
    songs: formattedSongs,
    genres: formattedGenres
    });
})