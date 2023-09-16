const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const { create, read } = require("../controllers/product");

const { listAll, remove, update } = require("../controllers/product");

// routes

//router.get("/products", read);   using below now
router.get("/products/:count", listAll); // products/100

router.get("/product/:slug", read);

router.post("/product", authCheck, adminCheck, create);

router.delete("/product/:slug", authCheck, adminCheck, remove);
router.put("/product/:slug", authCheck, adminCheck, update);

module.exports = router;
