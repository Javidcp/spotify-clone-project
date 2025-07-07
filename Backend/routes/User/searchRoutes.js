const express = require("express")
const { serachDetails } = require("../../controllers/User/searchController")
const router = express.Router()


router.get('/all', serachDetails)

module.exports = router