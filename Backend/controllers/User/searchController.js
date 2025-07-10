const Artist = require("../../models/Artist")
const Song = require("../../models/Song")
const GenrePlaylist = require("../../models/GenrePlaylist")
const Playlist = require("../../models/Playlist")
const { errorHandling } = require("../../helper/errorMiddleware")



exports.serachDetails = errorHandling( async (req, res, next) => {
    const q = req.query.q || ''
    const regex = new RegExp(q, 'i')

    const artists = await Artist.find({ name: regex }).lean();
    const songs = await Song.find({ title: regex }).populate('artist').lean();
    const genres = await GenrePlaylist.find({ name: regex }).lean();
    const playlists = await Playlist.find({ name: regex }).lean()

    const formattedArtists = artists.map(a => ({ ...a, type: 'artist' }));
    const formattedSongs = songs.map(s => ({ ...s, type: 'song' }));
    const formattedGenres = genres.map(g => ({ ...g, type: 'genre' }));
    const formattedPlaylists = playlists.map(p => ({ ...p, type: 'playlist' }));

    res.json({
    artists: formattedArtists,
    songs: formattedSongs,
    genres: formattedGenres,
    playlists: formattedPlaylists
    });
})