const express = require('express');
const router = express.Router();
const { addSong, getAllSongs, deleteSong, updateSong, getSingleSong, playCounting } = require('../../controllers/Admin/songController');
const verifyToken = require('../../middleware/verifyToken');
const upload = require("../../multer/multer")

router.post('/add' , upload.fields([
    { name: 'url', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), addSong);
router.get('/', getAllSongs);
router.get('/:songId', getSingleSong);
router.post('/increment-play/:id', playCounting)
router.delete('/deleteSong/:songId', deleteSong)
router.put('/update/:id', upload.fields([
        { name: 'coverImage', maxCount: 1 },
        { name: 'url', maxCount: 1 }
    ]), updateSong)

module.exports = router;
