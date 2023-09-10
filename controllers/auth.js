const User = require("../models/user");

exports.createOrUpdateUser = async (req, res) => {
  const { name, picture, email } = req.user;

  const user = await User.findOneAndUpdate(
    { email },
    { name: email.split("@")[0], picture },
    { new: true }
  );

  if (user) {
    console.log("USER UPDATED", user); /// if exist in db just updae hoga
    res.json(user);
  } else {
    console.log("USER 123");
    const newUser = await new User({
      //else create in db this user
      email,
      name: email.split("@")[0],
      picture,
    }).save();

    console.log("USER CREATED", newUser);
    res.json(newUser);
  }
};

exports.currentUser = async (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, user) => {
    console.log("USER 1234");
    console.log(user.email);
    console.log(err);
    console.log(user);
    if (err) {
      console.log("USER 12346");
      // throw new Error(err);
    }
    // res.json(user);
  });
};
