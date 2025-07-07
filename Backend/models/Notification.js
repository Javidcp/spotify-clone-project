const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    title: String,
    coverImage: String,
    message: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song'},
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: 86400 }
});

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification