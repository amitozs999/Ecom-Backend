const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const {
  create,
  read,
  update,
  remove,
  list,
  getSubs,
} = require("../controllers/category");

// routes
router.get("/categories", list);
router.get("/category/:slug", read);

router.post("/category", authCheck, adminCheck, create); //create
router.put("/category/:slug", authCheck, adminCheck, update); //update
router.delete("/category/:slug", authCheck, adminCheck, remove); //delete

router.get("/category/subs/:_id", getSubs); //get sub list for id categ

module.exports = router;
