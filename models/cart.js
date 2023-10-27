const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

// cart me many products, cart total
//each product is of type Product model

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
        },
        count: Number,
        color: String,
        price: Number,
        title: String,
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderdBy: { type: ObjectId, ref: "User" }, //konse user ka cart he ye
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
