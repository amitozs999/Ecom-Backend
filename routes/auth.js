const express = require("express");

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const { createOrUpdateUser, currentUser } = require("../controllers/auth");

router.post("/create-or-update-user", authCheck, createOrUpdateUser); //firdt to authcheck midware then call createOrUpdateUser
router.post("/current-user", authCheck, currentUser);
router.post("/current-admin", authCheck, adminCheck, currentUser);

// const mymidware = (req, res, next) => {
//   console.log("mid me");
//   next();
// };

// router.get("/testing", mymidware, (req, res) => {
//   ///api/testing   first hit my midware-> next() which is remaing function
//   res.json({
//     data: "here in middleware ",
//   });
// });

module.exports = router;
