const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Order = require("../models/order");
const uniqueid = require("uniqueid");

//save cart

exports.userCart = async (req, res) => {
  // console.log(req.body); // {cart: []}

  const { cart } = req.body; //req me cart obj ayega

  console.log("bcknd sent cart in", cart);

  let products = [];

  const user = await User.findOne({ email: req.user.email }).exec(); //cur user find

  let cartExistByThisUser = await Cart.findOne({ orderdBy: user._id }).exec(); //check if any cart prestnt related to this user

  if (cartExistByThisUser) {
    cartExistByThisUser.remove(); //remove that
    console.log("removed old cart");
  }

  console.log("cc", cart);
  // for (let i = 0; i < cart.length; i++) {
  //   //create obj based on our backend cart modal using passed cart obj from frontend
  //   let object = {};

  //   object.product = cart[i]._id;
  //   object.count = cart[i].count;
  //   object.color = cart[i].color;
  //   object.title = cart[i].title;
  //   object.shipping = cart[i].shipping;
  //   object.brand = cart[i].brand;
  //   object.description = cart[i].description;

  //   //  object.images=cart[i]

  //   // get price for creating total
  //   let { price } = await Product.findById(cart[i]._id).select("price").exec(); //verifing prod proce from databse
  //   object.price = price;

  //   products.push(object);
  // }

  // console.log('products', products)

  let cartTotal = 0;
  for (let i = 0; i < cart.products.length; i++) {
    cartTotal = cartTotal + cart.products[i].price * cartproducts[i].count;
  }

  // console.log("cartTotal", cartTotal);

  //create obj based on our backend cart modal using passed cart obj from frontend

  let xx = cart.products;
  let newCart = await new Cart({
    xx,
    cartTotal,
    orderdBy: user._id,
  }).save();

  console.log("new cart ----> ", newCart);
  res.json({ ok: true });
};

exports.userCart2 = async (req, res) => {
  // console.log(req.body); // {cart: []}

  const { product } = req.body; //req me cart obj ayega
  console.log("bcknd sent product in", product);
  let xv = product._id;

  //console.log("bcknd sent product in", product);

  let products = [];

  const user = await User.findOne({ email: req.user.email }).exec(); //cur user find

  let cartExistByThisUser = await Cart.findOne({ orderdBy: user._id }).exec(); //check if any cart prestnt related to this user

  let productIdd = product._id;
  let countt = 1;
  let colorr = product.color;
  let pricee = product.price;

  let titlee = product.title;

  let mycart;
  if (cartExistByThisUser) {
    // cartExistByThisUser.remove(); //remove that
    console.log("exist cart");

    //cartExistByThisUser.products.push({ product, countt, colorr, pricee });
    console.log("ss1", cartExistByThisUser);

    // cartExistByThisUser.save(done);
    console.log("orid id", product._id);
    var origid = product._id;

    var newtotal = cartExistByThisUser.cartTotal + pricee;
    //cartExistByThisUser.update(cartTotal:newtotal);

    const cc = await Cart.findOneAndUpdate(
      { orderdBy: user._id },
      { cartTotal: newtotal }
    ).exec();

    let existingcartObject = cartExistByThisUser.products.find(
      (ele) => ele.product._id.toString() === origid.toString() //finf is use user ki rating for this prod
    );

    if (existingcartObject) {
      countt = existingcartObject.count + 1;

      console.log("exist cnt", countt);

      let obj1 = {
        product: product,
        count: countt,
        color: colorr,
        price: pricee,
        title: titlee,
      };

      const produpdated = await Cart.updateOne(
        {
          products: { $elemMatch: existingcartObject }, //jiiska ratobj vo tha jo uper mila already ratdwala
        },
        { $set: { "products.$.count": countt } }, //uska star update with new star
        { new: true }
      ).exec();
    } else {
      let obj1 = {
        product: product,
        count: countt,
        color: colorr,
        price: pricee,
        title: titlee,
      };

      const cc = await Cart.findOneAndUpdate(
        { orderdBy: user._id },
        { $addToSet: { products: obj1 } }
      ).exec();
    }

    console.log("ss2", cartExistByThisUser);
  } else {
    console.log("not exist cart");
    let obj1 = {
      product: product,
      count: countt,
      color: colorr,
      price: pricee,
      title: titlee,
    };
    const newCart = await Cart.create({
      products: [obj1],
      cartTotal: 6772,
      orderdBy: user._id,
    });
    console.log("ss", newCart);
  }

  // console.log("new cart ----> ", newCart);
  res.json({ ok: true });
};

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  let cart = await Cart.findOne({ orderdBy: user._id }) //find cart for this user
    .populate(
      "products.product",
      "_id title price brand shipping totalAfterDiscount quantity images"
    )
    .exec();

  //const { products, cartTotal, totalAfterDiscount } = cart; //fetch these values
  // res.json({ products, cartTotal, totalAfterDiscount }); //s end back in response
  res.json(cart);
};

exports.emptyCart = async (req, res) => {
  console.log("empty cart");
  const user = await User.findOne({ email: req.user.email }).exec();

  const cart = await Cart.findOneAndRemove({ orderdBy: user._id }).exec();
  res.json(cart);
};

exports.saveAddress = async (req, res) => {
  const userAddress = await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address }
  ).exec();

  res.json({ ok: true });
};

exports.applyCouponToUserCart = async (req, res) => {
  const { coupon } = req.body;
  console.log("COUPON", coupon);

  const validCoupon = await Coupon.findOne({ name: coupon }).exec();
  if (validCoupon === null) {
    return res.json({
      err: "Invalid coupon",
    });
  }

  console.log("VALID COUPON", validCoupon);

  const user = await User.findOne({ email: req.user.email }).exec();

  let { products, cartTotal } = await Cart.findOne({ orderdBy: user._id }) //find cart of user
    .populate("products.product", "_id title price")
    .exec();

  console.log("cartTotal", cartTotal, "discount%", validCoupon.discount);

  // calculate the total after discount
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2); // 99.99

  console.log(totalAfterDiscount + "  JJ");

  Cart.findOneAndUpdate(
    //update card with discounted price
    { orderdBy: user._id },
    { totalAfterDiscount },
    { new: true }
  ).exec();

  res.json(totalAfterDiscount);
};

exports.createOrder = async (req, res) => {
  // console.log(req.body);
  // return;
  const { paymentIntent } = req.body.stripeResponse;

  const user = await User.findOne({ email: req.user.email }).exec();

  let { products } = await Cart.findOne({ orderdBy: user._id }).exec(); //fetch products from cur user cart

  let newOrder = await new Order({
    //create a order using payment intent and products for cur user
    products,
    paymentIntent,
    orderdBy: user._id,
  }).save();

  // decrement quantity, increment sold

  let bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id }, // jese hi item match with this product IMPORTANT item.product
        update: { $inc: { quantity: -item.count, sold: +item.count } }, //decr quant, incr sold  based on no of items in cur cart products
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, {}); //used to bulk update on Product db
  console.log("PRODUCT QUANTITY-- AND SOLD++", updated);

  console.log("NEW ORDER SAVED", newOrder);
  res.json({ ok: true });
};

exports.orders = async (req, res) => {
  let user = await User.findOne({ email: req.user.email }).exec();

  let userOrders = await Order.find({ orderdBy: user._id })
    .populate("products.product")
    .exec();

  res.json(userOrders);
};

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } }
  ).exec();

  res.json({ ok: true });
};

exports.wishlist = async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
    .select("wishlist")
    .populate("wishlist")
    .exec();

  res.json(list);
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  ).exec();

  res.json({ ok: true });
};

exports.createCashOrder = async (req, res) => {
  const { COD, couponApplied } = req.body;
  // if COD is true, create order with status of Cash On Delivery

  if (!COD) return res.status(400).send("Create cash order failed");

  const user = await User.findOne({ email: req.user.email }).exec();

  let userCart = await Cart.findOne({ orderdBy: user._id }).exec();

  let finalAmount = 0;

  if (couponApplied && userCart.totalAfterDiscount) {
    finalAmount = userCart.totalAfterDiscount * 100;
  } else {
    finalAmount = userCart.cartTotal * 100;
  }

  let newOrder = await new Order({
    //own payment intent instead of stirpr one for cod  baki same hi he
    products: userCart.products,
    paymentIntent: {
      id: uniqueid(),
      amount: finalAmount,
      currency: "INR",
      status: "Cash On Delivery",
      created: Date.now(),
      payment_method_types: ["cash"],
    },
    orderdBy: user._id,
    orderStatus: "Cash On Delivery",
  }).save();

  // decrement quantity, increment sold
  let bulkOption = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id }, // IMPORTANT item.product
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, {});
  console.log("PRODUCT QUANTITY-- AND SOLD++", updated);

  console.log("NEW ORDER SAVED", newOrder);
  res.json({ ok: true });
};
