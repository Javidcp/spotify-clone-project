const { errorHandling } = require("../../helper/errorMiddleware");
const Notification = require("../../models/Notification")


exports.getNotification = errorHandling( async (req, res, next) => {
    const { userId } = req.params
    console.log("esadcf", userId);
    
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const notifications = await Notification.find( { userId, createdAt: { $gte: oneDayAgo } }).sort({ createdAt: -1 });
    res.json(notifications);
})




exports.markAsRead = errorHandling( async(req, res, next) => {
    const { userId } = req.params
    console.log("mark", userId);

    await Notification.updateMany(
        { userId, isRead: false },
        { $set: { isRead: true } }
    )
    res.status(200).json({ message: "All notification ,arked as read" })
})