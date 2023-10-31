const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      text: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    subs: [
      {
        type: ObjectId,
        ref: "Sub",
      },
    ],
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    shipping: {
      type: String,
      enum: ["Yes", "No"],
    },
    color: {
      type: String,
      enum: ["Black", "Brown", "Silver", "White", "Blue"],
    },
    brand: {
      type: String,
      enum: [
        "Acer",
        "Adidas",
        "Allen Solly",
        "American Tourister",
        "Apple",
        "Apsara",
        "Arrow",
        "Bajaj",
        "BoAt",
        "Boniry",
        "Campus",
        "Casio",
        "Cello",
        "Classmate",
        "Dove",
        "Engage",
        "FACTOR",
        "Fastrack",
        "Fogg",
        "GRAPHENE",
        "HIRNAYA",
        "HP",
        "JBL",
        "John Jacobs",
        "L'Oreal Paris",
        "Lenovo",
        "Levi's",
        "Luxor",
        "Mamaearth",
        "Minimalist",
        "Nataraj",
        "Neutrogena",
        "Nike",
        "OnePlus",
        "Peter England",
        "Puma",
        "Realme",
        "Red Tape",
        "Reynolds",
        "ROZEN 47",
        "Safari",
        "Samsung",
        "Skullcandy",
        "Sony",
        "Sparx",
        "Storio",
        "The Derma",
        "TIMEX",
        "Villain",
        "Vincent",
        "Wild Stone",
        "worison",
      ],
    },
    ratings: [
      {
        star: Number,
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
