const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { errorHandling } = require("../../helper/errorMiddleware");
const Coupon = require("../../models/Coupon");
const User = require("../../models/User")

exports.paymentGateway = errorHandling(async (req, res, next) => {
    const { priceId, couponCode, userId } = req.body;

    let discountAmount = 0;
    let discounts = [];

    if (!priceId) {
        return res.status(400).json({ error: "Missing priceId." });
    }

    const priceData = await stripe.prices.retrieve(priceId);
    const amount = priceData.unit_amount / 100;

    if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode, isActive: true });

        if (!coupon) {
        return res.status(400).json({ error: "Invalid coupon code." });
        }

        const now = new Date();
        if (now < coupon.startDate || now > coupon.endDate) {
        return res.status(400).json({ error: "Coupon expired or not yet valid." });
        }

        if (coupon.currentUses >= coupon.maxUses) {
        return res.status(400).json({ error: "Coupon usage limit reached." });
        }

        if (amount < coupon.minOrderAmount) {
        return res.status(400).json({
            error: `Minimum order amount is ${coupon.minOrderAmount}`,
        });
        }

        if (coupon.discountType === "percentage") {
        discountAmount = Math.min(
            (amount * coupon.discountValue) / 100,
            coupon.maxDiscountAmount
        );
        } else if (coupon.discountType === "flat") {
        discountAmount = Math.min(coupon.discountValue, coupon.maxDiscountAmount);
        }

        const stripeCoupon = await stripe.coupons.create({
        amount_off: Math.round(discountAmount * 100),
        currency: "INR",
        duration: "once",
        });

        discounts.push({ coupon: stripeCoupon.id });
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
        {
            price: priceId,
            quantity: 1,
        },
        ],
        discounts,
        success_url: "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:5173/payment-cancel",
            metadata: {
        userId: userId.toString(),
        couponCode: couponCode || "",
        },
    });

    res.json({ url: session.url });
});



exports.confirmPayment = errorHandling(async (req, res) => {
    const { sessionId } = req.body;

    if (!sessionId) {
        return res.status(400).json({ error: "Missing session ID" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
        return res.status(400).json({ error: "Payment not completed" });
    }

    const userId = session.metadata.userId;
    const couponCode = session.metadata.couponCode;

    await User.findByIdAndUpdate(userId, { isPremium: true });

    if (couponCode) {
        await Coupon.findOneAndUpdate(
        { code: couponCode },
        { $inc: { currentUses: 1 } }
        );
    }

    res.json({ success: true, message: "User and coupon updated" });
});