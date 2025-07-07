const express = require("express")
const router = express.Router()
const verifyToken = require("../../middleware/verifyToken");
const { getAllUsers, toggleBlockUser, getUserRegisterationStats } = require("../../controllers/Admin/userController");


router.get('/users', verifyToken, getAllUsers)
router.get('/user-stats', getUserRegisterationStats)
router.patch('/users/:id', verifyToken, toggleBlockUser)


module.exports = router