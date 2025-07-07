const { errorHandling, createError } = require("../../helper/errorMiddleware")
const Coupon = require("../../models/Coupon")

exports.createCoupon = errorHandling( async(req, res, next) => {
    const coupon = new Coupon(req.body)
    await coupon.save()

    res.status(201).json(coupon)
})



exports.getCoupon = errorHandling(async (req, res, next) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    const today = new Date();

    const updatedCoupons = await Promise.all(
        coupons.map(async (coupon) => {
            if (new Date(coupon.endDate) < today && coupon.isActive) {
                coupon.isActive = false;
                await coupon.save();
            }
            return coupon;
        })
    );

    res.json(updatedCoupons);
});





exports.updateCoupon = errorHandling( async(req, res, next) => {
    const { couponId } = req.params
    const coupon = await Coupon.findByIdAndUpdate(couponId, req.body, {
        new: true,
    })
    if (!coupon) return next(createError(404, "Coupon not found"))

    res.json(coupon)
})



exports.deleteCoupon = errorHandling( async(req, res, next) => {
    const { couponId } = req.params
    const coupon = await Coupon.findByIdAndDelete(couponId)
    if (!coupon) return next(createError(404, "Coupon not found"))

    res.json({ message: "Coupon deleted successfull" })
})