const express = require("express");
const router = express.Router();
const { updatePlaylist, deletePlaylist, getPlaylists, getPlaylist, getAllPlaylists, createPlaylist, addSongToPlaylist,removeSongFromPlaylist, getUserPlaylists } = require("../../controllers/User/userPlaylistController");
const upload = require("../../multer/multer");

router.post("/playlist", upload.single("image"), createPlaylist);
router.get("/playlist", getAllPlaylists);
router.get("/playlistName", getPlaylist);
router.get("/playlist/:id", getPlaylists)
router.delete("/deletePlaylist/:playlistId", deletePlaylist)
router.put("/updatePlaylist/:id", upload.single("image"), updatePlaylist)
router.post('/playlist/add-song', addSongToPlaylist);
router.post('/playlist/remove-song', removeSongFromPlaylist);
router.get('/user-playlist/:userId', getUserPlaylists)

module.exports = router;