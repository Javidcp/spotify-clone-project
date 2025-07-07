const express = require("express");
const { getRecentlyPlayed, addToRecentlyPlayed } = require("../../controllers/User/recentlyController");
const router = express.Router()


router.post("/:userId/recently-played", addToRecentlyPlayed);
router.get("/:userId/recently-played", getRecentlyPlayed);

module.exports = router