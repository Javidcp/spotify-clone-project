const express = require("express")
const { getNotification, markAsRead } = require("../../controllers/Admin/notificationController")
const router = express.Router()

router.get('/:userId', getNotification);
router.put('/mark-all-read/:userId', markAsRead);

module.exports = router