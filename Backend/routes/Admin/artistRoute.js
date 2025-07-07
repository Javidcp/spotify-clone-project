const express = require("express")
const router = express.Router()
const { addArtist, getArtist, deleteArtist, updateArtist, getSingleArtist, getArtistName } = require("../../controllers/Admin/artistController")
const upload = require("../../multer/multer")

router.post('/add', upload.single('image'), addArtist)
router.get('/', getArtist)
router.get('/artistname', getArtistName)
router.delete('/deleteArtist/:artistId', deleteArtist)
router.patch('/updateArtist/:artistId',upload.single('image'), updateArtist)
router.get('/:artistId', getSingleArtist)

module.exports = router