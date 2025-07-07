const { createError, errorHandling } = require("../../helper/errorMiddleware");
const User = require("../../models/User")

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};



exports.toggleBlockUser = errorHandling(async (req, res, next) => {
    const { isActive } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { isActive },
        { new: true }
    );
    if (!updatedUser) {
        return next(new Error("User not found"));
    }
    res.status(200).json(updatedUser);
});



exports.getUserRegisterationStats = errorHandling( async (req, res, next) => {

  const today = new Date();
  const last7Days = new Date();
  last7Days.setDate(today.getDate() - 6);
  
    const result = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: last7Days,
            $lte: today
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const statsMap = {};
    result.forEach(item => statsMap[item._id] = item.count);

    const stats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const formatted = date.toISOString().slice(0, 10);
      stats.push({ date: formatted, count: statsMap[formatted] || 0 });
    }

    res.json(stats);
})