const express = require("express")
const { createCoupon, getCoupon, updateCoupon, deleteCoupon } = require("../../controllers/Admin/couponController")
const router = express.Router()


router.post('/', createCoupon)
router.get('/', getCoupon)
router.put('/:couponId', updateCoupon)
router.delete('/:couponId', deleteCoupon)

module.exports = router