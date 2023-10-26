const express = require("express");

const router = express.Router();

// middlewares
const { authCheck } = require("../middlewares/auth");
// controllers
const {
  userCart,
  userCart2,
  getUserCart,
  emptyCart,
  saveAddress,
  applyCouponToUserCart,
  createOrder,
  orders,
  addToWishlist,
  wishlist,
  removeFromWishlist,
  createCashOrder,
} = require("../controllers/user");

router.post("/user/cart", authCheck, userCart); // save cart
router.post("/user/cart2", authCheck, userCart2); // save cart

router.get("/user/cart", authCheck, getUserCart); // get cart
router.delete("/user/cart", authCheck, emptyCart); // empty cart

// user trying to apply coupon on cart
router.post("/user/cart/coupon", authCheck, applyCouponToUserCart);

router.post("/user/address", authCheck, saveAddress);

router.post("/user/order", authCheck, createOrder);
router.get("/user/orders", authCheck, orders); //GET

router.post("/user/cash-order", authCheck, createCashOrder); // create cash order

// wishlist
router.post("/user/wishlist", authCheck, addToWishlist);
router.get("/user/wishlist", authCheck, wishlist);
router.put("/user/wishlist/:productId", authCheck, removeFromWishlist);

// router.get("/user", (req, res) => {
//   res.json({
//     data: "hey you hit user API endpoint",
//   });
// });
module.exports = router;
