const express = require("express");

const router = express.Router();

// middlewares
const { authCheck } = require("../middlewares/auth");

// controller
const { createOrUpdateUser } = require("../controllers/auth");

router.post("/create-or-update-user", authCheck, createOrUpdateUser);

const mymidware = (req, res, next) => {
  console.log("mid me");
  next();
};

router.get("/testing", mymidware, (req, res) => {
  res.json({
    data: "here in middleware ",
  });
});

module.exports = router;
