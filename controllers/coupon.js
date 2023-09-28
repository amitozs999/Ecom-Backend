const Coupon = require("../models/coupon");

// create, remove, list

exports.create = async (req, res) => {
  try {
    // console.log(req.body);
    // return;
    const { name, expiry, discount } = req.body.coupon;
    const coup = await new Coupon({ name, expiry, discount }).save();
    res.json(coup);
  } catch (err) {
    console.log(err);
  }
};

exports.remove = async (req, res) => {
  try {
    res.json(await Coupon.findByIdAndDelete(req.params.couponId).exec());
  } catch (err) {
    console.log(err);
  }
};

exports.list = async (req, res) => {
  try {
    res.json(await Coupon.find({}).sort({ createdAt: -1 }).exec());
  } catch (err) {
    console.log(err);
  }
};
