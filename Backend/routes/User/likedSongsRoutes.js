const express = require("express")
const { addToLikedSongs, getLikedSongs } = require("../../controllers/User/likedController")
const verifyToken = require("../../middleware/verifyToken")
const router = express.Router()

router.post('/', verifyToken, addToLikedSongs)
router.get('/', verifyToken, getLikedSongs)

module.exports = router