const User = require("../../models/User")
const Coupon = require("../../models/Coupon")
const { errorHandling, createError } = require("../../helper/errorMiddleware")
const { nanoid } = require("nanoid") 


exports.withdrawReferralCode = errorHandling( async (req, res, next) => {
    const user = await User.findById( req.userId );
    if (!user) return next(createError(404, "User not found"))
    
    if(user.rewardPoints < 500) return next(createError(400, "You need 500 referral points to withdraw a coupon"))

    user.rewardPoints -= 500
    await user.save()
    
    const coupon = new Coupon({
        code: `REF50-${nanoid(6).toUpperCase()}`,
        discountType: "percentage",
        discountValue: 50,
        isActive: true,
        minOrderAmount: 0,
        maxDiscountAmount: 999,
        maxUses: 1,
        userId: user._id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await coupon.save()
    res.status(201).json({message: "Referral points converted to a 50% coupon",coupon})
})