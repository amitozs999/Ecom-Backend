const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    console.log(req.body + "llll");
    console.log(req.body.title + "llllyy");
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save(); // json me hi bhejs hoga direct usi me add kardo product ko
    res.json(newProduct);
  } catch (err) {
    console.log(err);
    // res.status(400).send("Create product failed");
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subs")
    .exec();
  res.json(product);
};

exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category") //response me cat ke fields bhi dal dega
    .populate("subs")
    .sort([["createdAt", "desc"]])
    .exec();
  res.json(products);
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();

    res.json(deleted);
  } catch (err) {
    console.log(err);
    return res.staus(400).send("Product delete failed");
  }
};

exports.update = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title); //if titile in req body not null slugify it add in slug value
    }

    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug }, //find that slug
      req.body, //jo value ayi he body me i.e new updated value pass tha
      { new: true } //old vali remove
    ).exec();

    res.json(updated);
  } catch (err) {
    console.log("PRODUCT UPDATE ERROR ----> ", err);
    // return res.status(400).send("Product update failed");
    res.status(400).json({
      err: err.message,
    });
  }
};

// WITHOUT PAGINATION
// exports.list = async (req, res) => {
//   try {
//     // createdAt/updatedAt, desc/asc, 3
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .populate("category")
//       .populate("subs")
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();

//     res.json(products);
//   } catch (err) {
//     console.log(err);
//   }
// };

// WITH PAGINATION
exports.list = async (req, res) => {
  // console.table(req.body);
  try {
    // createdAt/updatedAt, desc/asc, 3(konse page ke prod fetch)
    const { sort, order, page } = req.body;
    const currentPage = page || 1; //by default page 1
    const perPage = 3; // 3

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage) //will skip this no of products for 1 to prev page wale ke
      .populate("category")
      .populate("subs")
      .sort([[sort, order]]) //sort by created, order is descending
      .limit(perPage)
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

exports.productsCount = async (req, res) => {
  console.log("herecnt");
  let total = await Product.find({}).estimatedDocumentCount().exec();

  console.log(total + "cnt");
  res.json(total);
};
