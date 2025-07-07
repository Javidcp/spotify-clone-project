const express = require("express");
const router = express.Router();
const { createGenrePlaylist, getAllGenrePlaylists, getGenres, getGenrePlaylist, deleteGenre, updateGenre } = require("../../controllers/Admin/genreController");
const upload = require("../../multer/multer");

router.post("/genre", upload.single("image"), createGenrePlaylist);
router.get("/genre", getAllGenrePlaylists);
router.get("/genreName", getGenres);
router.get("/genre-playlists/:id", getGenrePlaylist)
router.delete("/deleteGenre/:genreId", deleteGenre)
router.put("/updateGenre/:id", upload.single("image"), updateGenre)

module.exports = router;