const User = require("../../models/User")


exports.addToRecentlyPlayed = async (req, res) => {
    const { userId } = req.params;
    const { itemType, itemId } = req.body;

    const user = await User.findById(userId);

    user.recentlyPlayed = user.recentlyPlayed.filter(
        (item) => item.itemId.toString() !== itemId
    );

    user.recentlyPlayed.unshift({ itemType, itemId });
    user.recentlyPlayed = user.recentlyPlayed.slice(0, 4);

    await user.save();
    res.status(200).json(user.recentlyPlayed);
};

 

exports.getRecentlyPlayed = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate('recentlyPlayed.itemId');
  res.status(200).json(user.recentlyPlayed);
};


