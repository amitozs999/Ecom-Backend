const admin = require("../firebase");
const User = require("../models/user");

exports.authCheck = async (req, res, next) => {
  //when this midw is hot it will log headers on of the post req then move to next
  console.log(req.headers); // token

  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken); // verifying in backend is this authkey is valid though firebase .. middleware tasdk
    console.log("FIREBASE USER IN AUTHCHECK", firebaseUser);
    req.user = firebaseUser; // if yes go to next part and set this user
    next();
  } catch (err) {
    res.status(401).json({
      err: "Invalid or expired token",
    });
  }
  // next();
};

exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;

  const adminUser = await User.findOne({ email }).exec();

  if (adminUser.role !== "admin") {
    res.status(403).json({
      err: "Admin resource. Access denied.",
    });
  } else {
    next();
  }
};
