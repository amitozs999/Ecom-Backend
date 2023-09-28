const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");

//save cart

exports.userCart = async (req, res) => {
  // console.log(req.body); // {cart: []}

  const { cart } = req.body; //req me cart obj ayega

  let products = [];

  const user = await User.findOne({ email: req.user.email }).exec(); //cur user find

  let cartExistByThisUser = await Cart.findOne({ orderdBy: user._id }).exec(); //check if any cart prestnt related to this user

  if (cartExistByThisUser) {
    cartExistByThisUser.remove(); //remove that
    console.log("removed old cart");
  }

  for (let i = 0; i < cart.length; i++) {
    //create obj based on our backend cart modal using passed cart obj from frontend
    let object = {};

    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;
    // get price for creating total
    let { price } = await Product.findById(cart[i]._id).select("price").exec(); //verifing prod proce from databse
    object.price = price;

    products.push(object);
  }

  // console.log('products', products)

  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  }

  // console.log("cartTotal", cartTotal);

  //create obj based on our backend cart modal using passed cart obj from frontend

  let newCart = await new Cart({
    products,
    cartTotal,
    orderdBy: user._id,
  }).save();

  console.log("new cart ----> ", newCart);
  res.json({ ok: true });
};

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  let cart = await Cart.findOne({ orderdBy: user._id }) //find cart for this user
    .populate("products.product", "_id title price totalAfterDiscount")
    .exec();

  const { products, cartTotal, totalAfterDiscount } = cart; //fetch these values
  res.json({ products, cartTotal, totalAfterDiscount }); //s end back in response
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
