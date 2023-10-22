const Product = require("../models/product");
const slugify = require("slugify");
const User = require("../models/user");

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

// Post.find({}).sort('test').exec(function(err, docs) { ... });
// Post.find({}).sort([['date', -1]]).exec(function(err, docs) { ... });
// Post.find({}).sort({test: 1}).exec(function(err, docs) { ... });
// Post.find({}, null, {sort: {date: 1}}, function(err, docs) { ... });

// WITH PAGINATION
exports.list = async (req, res) => {
  // console.table(req.body);
  try {
    // createdAt/updatedAt, desc/asc, 3(konse page ke prod fetch)
    const { sort, order, page } = req.body;
    const currentPage = page || 1; //by default page 1
    const perPage = 4; // 3
    // const x1 = sortt;

    console.log(sort);
    console.log(order);
    console.log(page);

    const products = await Product.find({})

      .populate("category")
      .populate("subs")
      //.sort([[sort, order]]) //sort by created, order is descending
      .sort({ [sort]: order, _id: 1 }) //sort by created, order is descending
      .skip((currentPage - 1) * perPage) //will skip this no of products for 1 to prev page wale ke
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

exports.productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec(); //find that prod
  const user = await User.findOne({ email: req.user.email }).exec(); //find that user jisne rating bheji he
  const { star } = req.body; //fetch star

  // check if currently logged in user have already added rating to this product?
  //return ratobj
  let existingRatingObject = product.ratings.find(
    (r) => r.postedBy.toString() === user._id.toString()
  );

  if (existingRatingObject === undefined) {
    // first time rate

    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star, postedBy: user._id } }, //
      },
      { new: true } // If you want it to return the modified document

      //$push{  } in this prod
      // ratings: [
      //   {
      //     star: Number,
      //     postedBy: { type: ObjectId, ref: "User" },
      //   },
      // ],
    ).exec();
    console.log("ratingAdded", ratingAdded);
    res.json(ratingAdded);
  } else {
    // if user have already left rating, update it
    const ratingUpdated = await Product.updateOne(
      {
        ratings: { $elemMatch: existingRatingObject }, //jiiska ratobj vo tha jo uper mila already ratdwala
      },
      { $set: { "ratings.$.star": star } }, //uska star update with new star
      { new: true }
    ).exec();
    console.log("ratingUpdated", ratingUpdated);
    res.json(ratingUpdated);
  }
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec(); //find jonsa curr prod he

  const related = await Product.find({
    _id: { $ne: product._id }, //not equal to this one baki consider all
    category: product.category, // same to this prod categ
  })
    .limit(3)
    .populate("category")
    .populate("subs")
    .populate("postedBy")
    .exec();

  res.json(related);
};

//search/filters based on
//     query,
//     price,
//     category,
//     stars,
//     sub,
//     shipping,
//     color,
//     brand,

const handleQuery = async (req, res, query) => {
  const products = await Product.find({
    //$text: { $search: query }
    slug: {
      $regex: `(.*)${query}(.*)`,
    },
  }) //search passed query in product text
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0], // greater then
        $lte: price[1], //lesss than
      },
    })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category }) //same ctaeg wale
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleStar = (req, res, stars) => {
  Product.aggregate([
    {
      //rating structure was diff so diff method for filter
      // ratings: [
      //   {
      //     star: Number,
      //     postedBy: { type: ObjectId, ref: "User" },
      //   },
      // ],

      //now each prod can have array of rating[1,4,5,5,2] need to take average for each prod and store in new doc

      $project: {
        //created new doc for rating
        document: "$$ROOT",

        floorAverage: {
          $floor: { $avg: "$ratings.star" }, //    //taking avg of rating arr for each prod
        },
      },
    },
    { $match: { floorAverage: stars } }, //now consider those prod which has avg rating as jo rating/star passed he in filter api
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("AGGREGATE ERROR", err);

      Product.find({ _id: aggregates }) //aggreagtes
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, products) => {
          if (err) console.log("PRODUCT AGGREGATE ERROR", err);
          res.json(products);
        });
    });
};

const handleSub = async (req, res, sub) => {
  const products = await Product.find({ subs: sub })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

const handleShipping = async (req, res, shipping) => {
  const products = await Product.find({ shipping })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

const handleColor = async (req, res, color) => {
  const products = await Product.find({ color })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

const handleBrand = async (req, res, brand) => {
  const products = await Product.find({ brand })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

exports.searchFilters = async (req, res) => {
  const { query, price, category, stars, sub, shipping, color, brand } =
    req.body; //check karlenge req ki body me kya bheja us hisab se function call

  //using different function for each different filter search based

  if (query) {
    console.log("query --->", query);
    await handleQuery(req, res, query);
  }

  // price [20, 200]
  if (price !== undefined) {
    console.log("price ---> ", price);
    await handlePrice(req, res, price);
  }

  if (category) {
    console.log("category ---> ", category);
    await handleCategory(req, res, category);
  }

  if (stars) {
    console.log("stars ---> ", stars);
    await handleStar(req, res, stars);
  }

  if (sub) {
    console.log("sub ---> ", sub);
    await handleSub(req, res, sub);
  }

  if (shipping) {
    console.log("shipping ---> ", shipping);
    await handleShipping(req, res, shipping);
  }

  if (color) {
    console.log("color ---> ", color);
    await handleColor(req, res, color);
  }

  if (brand) {
    console.log("brand ---> ", brand);
    await handleBrand(req, res, brand);
  }
};
