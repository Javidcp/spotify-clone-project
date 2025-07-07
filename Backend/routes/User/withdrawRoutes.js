const express = require("express")
const verifyToken = require("../../middleware/verifyToken")
const { withdrawReferralCode } = require("../../controllers/User/withdrawController")
const router = express.Router()


router.post('/withdraw', verifyToken, withdrawReferralCode)

module.exports = router