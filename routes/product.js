const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const { create, read } = require("../controllers/product");

const {
  listAll,
  remove,
  update,
  listsortall,
} = require("../controllers/product");

const { list } = require("../controllers/product");

const {
  listsort,
  listsortandfilter,
  listsortandfilterfinal,
} = require("../controllers/product");

const { productsCount } = require("../controllers/product");

const { productStar } = require("../controllers/product");

const { listRelated } = require("../controllers/product");

const { searchFilters } = require("../controllers/product");

// routes

router.get("/products/total", productsCount);

//router.get("/products", read);   using below now
router.get("/products/:count", listAll); // products/100

router.post("/products/viewall", listsortall); // products/100 /products/viewall/:slug

router.get("/product/:slug", read);

router.post("/product", authCheck, adminCheck, create);

router.delete("/product/:slug", authCheck, adminCheck, remove);
router.put("/product/:slug", authCheck, adminCheck, update);

router.post("/products", list); //to get the list based on same conditions post bcoz pass some condition param inside body
router.post("/productssort", listsort);

//router.post("/productssortandfilter", listsortandfilter);
router.post("/productssortandfilter", listsortandfilterfinal);

router.put("/product/star/:productId", authCheck, productStar);

// related
router.get("/product/related/:productId", listRelated);

router.post("/search/filters", searchFilters);

module.exports = router;
