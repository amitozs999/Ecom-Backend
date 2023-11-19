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
exports.listsortall = async (req, res) => {
  // console.table(req.body);

  //req.params.slug   passed in slug

  console.log("viewall hit, ", req.body);
  try {
    // createdAt/updatedAt, desc/asc, 3(konse page ke prod fetch)  passed in
    const { sort, order } = req.body; //passed in body
    //const currentPage = page || 1; //by default page 1
    //const perPage = 8; // 3
    // const x1 = sortt;

    console.log(sort);
    console.log(order);
    //console.log(page);

    const products = await Product.find({})

      .populate("category")
      .populate("subs")
      //.sort([[sort, order]]) //sort by created, order is descending
      .sort({ [sort]: order, _id: 1 }) //sort by created, order is descending
      // .skip((currentPage - 1) * perPage) //will skip this no of products for 1 to prev page wale ke
      //.limit(perPage)
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};
exports.listsort = async (req, res) => {
  // console.table(req.body);
  try {
    // createdAt/updatedAt, desc/asc, 3(konse page ke prod fetch)
    const { sort, order, page } = req.body;
    const currentPage = page || 1; //by default page 1
    const perPage = 8; // 3
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

exports.listsortandfilter = async (req, res) => {
  // console.log("my query ji", req.query);
  // console.table(req.body);

  const { subcateg } = req.body;

  //console.table(req.body);
  //console.log("categpassed", categ);
  try {
    // createdAt/updatedAt, desc/asc, 3(konse page ke prod fetch)
    const {
      sort,
      order,
      page,
      color,
      brand,
      shipping,
      starNumbers,
      mypricechanged,
      myprice,
    } = req.body;
    const currentPage = page || 1; //by default page 1
    const perPage = 8; // 3
    // const x1 = sortt;

    console.log(sort);
    console.log(order);
    console.log(page);

    console.log(subcateg);
    console.log(color);
    console.log(brand);

    console.log(shipping);
    console.log(starNumbers);

    console.log(mypricechanged);

    console.log(myprice);

    let low = myprice[0];
    let high = myprice[1];
    console.log("low", low);
    console.log("high", high);

    let priceobj = { $gte: myprice[0] };
    if (high != 0) {
      priceobj = {
        $gte: myprice[0], // greater then
        $lte: myprice[1], //lesss than
      };
    }

    // if (myprice !== undefined)
    // let products = await Product.find({
    //   price: {
    //     $gte: myprice[0], // greater then
    //     $lte: myprice[1], //lesss than
    //   },
    // })

    let mylist = {};

    let a = subcateg.length > 0; //cattrue
    let b = color.length > 0; //colortrue
    let c = brand.length > 0; //brandtrue
    let d = shipping.length > 0; //shippingmarked
    let e = starNumbers.length > 0; //starNumberstrue

    // mylist = {
    //   category: subcateg,
    //   color: color,
    //   brand:brand,
    //   shipping:shipping
    // };

    if (a && b && c && d) {
      mylist = {
        category: subcateg,
        color: color,
        brand: brand,
        shipping: shipping,
        price: priceobj,
      };
    } else if (a && b && c) {
      mylist = {
        category: subcateg,
        color: color,
        brand: brand,
        price: priceobj,
      };
    } else if (a && b && d) {
      mylist = {
        category: subcateg,
        color: color,

        shipping: shipping,
        price: priceobj,
      };
    } else if (a && c && d) {
      mylist = {
        category: subcateg,

        brand: brand,
        shipping: shipping,
        price: priceobj,
      };
    } else if (b && c && d) {
      mylist = {
        color: color,
        brand: brand,
        shipping: shipping,
        price: priceobj,
      };
    } else if (a && b) {
      mylist = {
        category: subcateg,
        color: color,
        price: priceobj,
      };
    } else if (a && c) {
      mylist = {
        category: subcateg,

        brand: brand,
        price: priceobj,
      };
    } else if (a && d) {
      mylist = {
        category: subcateg,

        shipping: shipping,
        price: priceobj,
      };
    } else if (b && c) {
      mylist = {
        color: color,
        brand: brand,
        price: priceobj,
      };
    } else if (b && d) {
      mylist = {
        color: color,

        shipping: shipping,
        price: priceobj,
      };
    } else if (c && d) {
      mylist = {
        brand: brand,
        shipping: shipping,
        price: priceobj,
      };
    } else if (a) {
      mylist = {
        category: subcateg,
        price: priceobj,
      };
    } else if (b) {
      mylist = {
        color: color,
        price: priceobj,
      };
    } else if (c) {
      mylist = {
        brand: brand,
        price: priceobj,
      };
    } else if (d) {
      mylist = {
        shipping: shipping,
        price: priceobj,
      };
    }

    // if (subcateg.length > 0) {
    //   if (color.length > 0) {
    //     mylist = {
    //       category: subcateg,
    //       color: color,
    //     };
    //   } else {
    //     mylist = {
    //       category: subcateg,
    //     };
    //   }
    // } else if (color.length > 0) {
    //   mylist = {
    //     color: color,
    //   };
    // }

    console.log("meri list", mylist);
    const products = await Product.find(mylist) //same ctaeg wale

      .populate("category")
      .populate("subs")
      //.sort([[sort, order]]) //sort by created, order is descending
      .sort({ [sort]: order, _id: 1 }) //sort by created, order is descending
      .skip((currentPage - 1) * perPage) //will skip this no of products for 1 to prev page wale ke
      .limit(perPage)
      .exec();

    //console.log("mera cat wala allray", catlist);

    // let products = await Product.find({ category: subcateg }) //same ctaeg wale
    //   .populate("category", "_id name")
    //   .populate("subs", "_id name")
    //   .populate("postedBy", "_id name")
    //   .exec();

    // const prods = await Product.aggregate([
    //   {
    //     $lookup: {
    //       from: "categories",
    //       localField: "category",
    //       foreignField: "_id",
    //       as: "cats",
    //     },
    //   },
    //   {
    //     $match: { "cats.name": "Clothing" },
    //   },
    // ]);

    //console.log("filter prods", prods);

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
let queryy = "plus";
const handleQuery = async (req, res, query) => {
  console.log("myquueryyyyy", query);
  const products = await Product.find({
    //$text: { $search: query }

    slug: {
      $regex: `(.*)${queryy}(.*)`,
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
    // if (price !== undefined)
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

const handleCategory = async (req, res, category1) => {
  console.log("my query ji", req.query);

  console.log("my body ji", req.body);
  console.log("cat wala allray", category1);
  console.log("cat wala allray", category1);
  console.log("cat wala allray", category1);
  try {
    let products = await Product.find({ category: category1 }) //same ctaeg wale
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
  console.log("count of stars hu");
  console.log("count of stars", stars);
  console.log("count of stars", stars[0]);
  console.log("count of stars", stars[1]);
  console.log("count of stars huy");

  let as1 = stars[0];
  let as2 = stars[1];
  let as3 = stars[2];
  let as4 = stars[3];
  let as5 = stars[4];

  let x = stars.length;
  //let obj = { floorAverage: as1 };
  let obj1 = { floorAverage: !null };
  let obj2 = { floorAverage: !null };
  let obj3 = { floorAverage: !null };
  let obj4 = { floorAverage: !null };
  let obj5 = { floorAverage: !null };
  if (x == 1) {
    obj1 = { floorAverage: as1 };
  } else if (x == 2) {
    obj1 = { floorAverage: as1 };
    obj2 = { floorAverage: as2 };
  } else if (x == 3) {
    obj1 = { floorAverage: as1 };
    obj2 = { floorAverage: as2 };
    obj3 = { floorAverage: as3 };
  } else if (x == 4) {
    obj1 = { floorAverage: as1 };
    obj2 = { floorAverage: as2 };
    obj3 = { floorAverage: as3 };
    obj4 = { floorAverage: as4 };
  } else if (x == 5) {
    obj1 = { floorAverage: as1 };
    obj2 = { floorAverage: as2 };
    obj3 = { floorAverage: as3 };
    obj4 = { floorAverage: as4 };
    obj5 = { floorAverage: as5 };
  }

  //let obj = { floorAverage: as1 };

  const {
    sort,
    order,
    page,
    color,
    brand,
    shipping,
    starNumbers,
    mypricechanged,
    myprice,
  } = req.body;
  const currentPage = page || 1; //by default page 1
  const perPage = 8; // 3
  // const x1 = sortt;

  console.log(sort);
  console.log(order);
  console.log(page);

  console.log(subcateg);
  console.log(color);
  console.log(brand);

  console.log(shipping);
  console.log(starNumbers);

  console.log(mypricechanged);

  console.log(myprice);

  let low = myprice[0];
  let high = myprice[1];
  console.log("low", low);
  console.log("high", high);

  let priceobj = { $gte: myprice[0] };
  if (high != 0) {
    priceobj = {
      $gte: myprice[0], // greater then
      $lte: myprice[1], //lesss than
    };
  }

  // if (myprice !== undefined)
  // let products = await Product.find({
  //   price: {
  //     $gte: myprice[0], // greater then
  //     $lte: myprice[1], //lesss than
  //   },
  // })

  let mylist = {};

  let a = subcateg.length > 0; //cattrue
  let b = color.length > 0; //colortrue
  let c = brand.length > 0; //brandtrue
  let d = shipping.length > 0; //shippingmarked
  let e = starNumbers.length > 0; //starNumberstrue

  // mylist = {
  //   category: subcateg,
  //   color: color,
  //   brand:brand,
  //   shipping:shipping
  // };

  if (a && b && c && d) {
    mylist = {
      category: subcateg,
      color: color,
      brand: brand,
      shipping: shipping,
      price: priceobj,
      _id: aggregates,
    };
  } else if (a && b && c) {
    mylist = {
      category: subcateg,
      color: color,
      brand: brand,
      price: priceobj,
      _id: aggregates,
    };
  } else if (a && b && d) {
    mylist = {
      category: subcateg,
      color: color,

      shipping: shipping,
      price: priceobj,
      _id: aggregates,
    };
  } else if (a && c && d) {
    mylist = {
      category: subcateg,

      brand: brand,
      shipping: shipping,
      price: priceobj,
      _id: aggregates,
    };
  } else if (b && c && d) {
    mylist = {
      color: color,
      brand: brand,
      shipping: shipping,
      price: priceobj,
      _id: aggregates,
    };
  } else if (a && b) {
    mylist = {
      category: subcateg,
      color: color,
      price: priceobj,
      _id: aggregates,
    };
  } else if (a && c) {
    mylist = {
      category: subcateg,

      brand: brand,
      price: priceobj,
      _id: aggregates,
    };
  } else if (a && d) {
    mylist = {
      category: subcateg,

      shipping: shipping,
      price: priceobj,
      _id: aggregates,
    };
  } else if (b && c) {
    mylist = {
      color: color,
      brand: brand,
      price: priceobj,
      _id: aggregates,
    };
  } else if (b && d) {
    mylist = {
      color: color,

      shipping: shipping,
      price: priceobj,
      _id: aggregates,
    };
  } else if (c && d) {
    mylist = {
      brand: brand,
      shipping: shipping,
      price: priceobj,
      _id: aggregates,
    };
  } else if (a) {
    mylist = {
      category: subcateg,
      price: priceobj,
      _id: aggregates,
    };
  } else if (b) {
    mylist = {
      color: color,
      price: priceobj,
      _id: aggregates,
    };
  } else if (c) {
    mylist = {
      brand: brand,
      price: priceobj,
      _id: aggregates,
    };
  } else if (d) {
    mylist = {
      shipping: shipping,
      price: priceobj,
      _id: aggregates,
    };
  }

  // if (subcateg.length > 0) {
  //   if (color.length > 0) {
  //     mylist = {
  //       category: subcateg,
  //       color: color,
  //     };
  //   } else {
  //     mylist = {
  //       category: subcateg,
  //     };
  //   }
  // } else if (color.length > 0) {
  //   mylist = {
  //     color: color,
  //   };
  // }

  console.log("meri list", mylist);

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
    {
      $match: {
        $or: [
          // { floorAverage: as1 },
          // { floorAverage: as2 },
          // { floorAverage: !null },
          obj1,
          obj2,
          obj3,
          obj4,
          obj5,
          // obj,
          // {
          //   floorAverage: as1},
          // {floorAverage: as2},
          //  { floorAverage: as3},
          // },
        ],
      },
    }, //now consider those prod which has avg rating as jo rating/star passed he in filter api
  ])
    //  .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("AGGREGATE ERROR", err);

      console.log("myagreg ids", aggregates);

      // Product.find({ _id: aggregates }) //aggreagtes
      Product.find(mylist) //aggreagtes
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, products) => {
          if (err) console.log("PRODUCT AGGREGATE ERROR", err);
          res.json(products);
        });

      // products = await Product.find(mylist) //same ctaeg wale

      // .populate("category")
      // .populate("subs")
      // //.sort([[sort, order]]) //sort by created, order is descending
      // .sort({ [sort]: order, _id: 1 }) //sort by created, order is descending
      // .skip((currentPage - 1) * perPage) //will skip this no of products for 1 to prev page wale ke
      // .limit(perPage)
      // .exec();
    });
};

const handletotal = async (req, res, newobj) => {
  // const products = await Product.find({ subs: sub })
  //   .populate("category", "_id name")
  //   .populate("subs", "_id name")
  //   .populate("postedBy", "_id name")
  //   .exec();

  // res.json(products);

  let total = await Product.find(newobj).countDocuments().exec();
  return total;
};

exports.listsortandfilterfinal = async (req, res) => {
  try {
    const { subcateg } = req.body;

    //let obj = { floorAverage: as1 };

    const {
      sort,
      order,
      page,
      color,
      brand,
      shipping,
      starNumbers,
      mypricechanged,
      myprice,
      mytext,
      // starNumbers,
    } = req.body;
    const currentPage = page || 1; //by default page 1
    const perPage = 8; // 3
    // const x1 = sortt;

    console.log(sort);
    console.log(order);
    console.log(page);

    console.log(subcateg);
    console.log(color);
    console.log(brand);

    console.log(shipping);
    console.log(starNumbers);

    console.log(mypricechanged);

    console.log(myprice);

    console.log(mytext);
    console.log("count of stars hu");
    console.log("count of stars", starNumbers);
    console.log("count of stars", starNumbers[0]);
    console.log("count of stars", starNumbers[1]);
    console.log("count of stars huy");

    let low = myprice[0];
    let high = myprice[1];
    console.log("low", low);
    console.log("high", high);

    let priceobj = { $gte: myprice[0] };

    // slug: {
    //   $regex: `(.*)${queryy}(.*)`,
    // },

    let pricehe = false;
    if (high != 0) {
      pricehe = true;
      priceobj = {
        $gte: myprice[0], // greater then
        $lte: myprice[1], //lesss than
      };
    }

    let as1 = starNumbers[0];
    let as2 = starNumbers[1];
    let as3 = starNumbers[2];
    let as4 = starNumbers[3];
    let as5 = starNumbers[4];

    let x = starNumbers.length;
    //let obj = { floorAverage: as1 };
    let obj1 = { floorAverage: !null };
    let obj2 = { floorAverage: !null };
    let obj3 = { floorAverage: !null };
    let obj4 = { floorAverage: !null };
    let obj5 = { floorAverage: !null };
    if (x == 1) {
      obj1 = { floorAverage: as1 };
    } else if (x == 2) {
      obj1 = { floorAverage: as1 };
      obj2 = { floorAverage: as2 };
    } else if (x == 3) {
      obj1 = { floorAverage: as1 };
      obj2 = { floorAverage: as2 };
      obj3 = { floorAverage: as3 };
    } else if (x == 4) {
      obj1 = { floorAverage: as1 };
      obj2 = { floorAverage: as2 };
      obj3 = { floorAverage: as3 };
      obj4 = { floorAverage: as4 };
    } else if (x == 5) {
      obj1 = { floorAverage: as1 };
      obj2 = { floorAverage: as2 };
      obj3 = { floorAverage: as3 };
      obj4 = { floorAverage: as4 };
      obj5 = { floorAverage: as5 };
    }

    // if (myprice !== undefined)
    // let products = await Product.find({
    //   price: {
    //     $gte: myprice[0], // greater then
    //     $lte: myprice[1], //lesss than
    //   },
    // })

    let mylist = {};

    let a = subcateg.length > 0; //cattrue
    let b = color.length > 0; //colortrue
    let c = brand.length > 0; //brandtrue
    let d = shipping.length > 0; //shippingmarked
    let e = starNumbers.length > 0; //starNumberstrue

    // mylist = {
    //   category: subcateg,
    //   color: color,
    //   brand:brand,
    //   shipping:shipping
    // };

    if (a && b && c && d) {
      mylist = {
        category: subcateg,
        color: color,
        brand: brand,
        shipping: shipping,
        price: priceobj,
        //  slug:
        //  _id: aggregates,
      };
    } else if (a && b && c) {
      mylist = {
        category: subcateg,
        color: color,
        brand: brand,
        price: priceobj,
        //  _id: aggregates,
      };
    } else if (a && b && d) {
      mylist = {
        category: subcateg,
        color: color,

        shipping: shipping,
        price: priceobj,
        //_id: aggregates,
      };
    } else if (a && c && d) {
      mylist = {
        category: subcateg,

        brand: brand,
        shipping: shipping,
        price: priceobj,
        //  _id: aggregates,
      };
    } else if (b && c && d) {
      mylist = {
        color: color,
        brand: brand,
        shipping: shipping,
        price: priceobj,
        //   _id: aggregates,
      };
    } else if (a && b) {
      mylist = {
        category: subcateg,
        color: color,
        price: priceobj,
        //  _id: aggregates,
      };
    } else if (a && c) {
      mylist = {
        category: subcateg,

        brand: brand,
        price: priceobj,
        //  _id: aggregates,
      };
    } else if (a && d) {
      mylist = {
        category: subcateg,

        shipping: shipping,
        price: priceobj,
        // _id: aggregates,
      };
    } else if (b && c) {
      mylist = {
        color: color,
        brand: brand,
        price: priceobj,
        //   _id: aggregates,
      };
    } else if (b && d) {
      mylist = {
        color: color,

        shipping: shipping,
        price: priceobj,
        //  _id: aggregates,
      };
    } else if (c && d) {
      mylist = {
        brand: brand,
        shipping: shipping,
        price: priceobj,
        //  _id: aggregates,
      };
    } else if (a) {
      mylist = {
        category: subcateg,
        price: priceobj,
        // _id: aggregates,
      };
    } else if (b) {
      mylist = {
        color: color,
        price: priceobj,
        //  _id: aggregates,
      };
    } else if (c) {
      mylist = {
        brand: brand,
        price: priceobj,
        //    _id: aggregates,
      };
    } else if (d) {
      mylist = {
        shipping: shipping,
        price: priceobj,
        //  _id: aggregates,
      };
    } else {
      mylist = {
        price: priceobj,
        //  _id: aggregates,
      };
    }

    let mylistwithmytext = {
      slug: {
        $regex: `(.*)${mytext}(.*)`,
      },
    };

    if (mytext != "") {
      mylist = {
        ...mylistwithmytext,
        ...mylist,
      };
    }

    // let textobj={

    //   ,

    // }

    // if (subcateg.length > 0) {
    //   if (color.length > 0) {
    //     mylist = {
    //       category: subcateg,
    //       color: color,
    //     };
    //   } else {
    //     mylist = {
    //       category: subcateg,
    //     };
    //   }
    // } else if (color.length > 0) {
    //   mylist = {
    //     color: color,
    //   };
    // }

    let total = await Product.find(mylist).countDocuments().exec();

    console.log("meri list", mylist);

    let aggregates = await Product.aggregate([
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
      {
        $match: {
          $or: [
            // { floorAverage: as1 },
            // { floorAverage: as2 },
            // { floorAverage: !null },
            obj1,
            obj2,
            obj3,
            obj4,
            obj5,
            // obj,
            // {
            //   floorAverage: as1},
            // {floorAverage: as2},
            //  { floorAverage: as3},
            // },
          ],
        },
      }, //now consider those prod which has avg rating as jo rating/star passed he in filter api
    ]);

    console.log("aggregates=", aggregates);

    //  .limit(12)
    // .exec((err, aggregates) => {
    //   if (err) console.log("AGGREGATE ERROR", err);

    //   console.log("myagreg ids", aggregates);

    // Product.find({ _id: aggregates }) //aggreagtes
    // Product.find(mylist) //aggreagtes
    //   .populate("category", "_id name")
    //   .populate("subs", "_id name")
    //   .populate("postedBy", "_id name")
    //   .exec((err, products) => {
    //     if (err) console.log("PRODUCT AGGREGATE ERROR", err);
    //     res.json(products);
    //   });

    //  Product.find({ $or: [mylist] })
    // products = await

    if (e) {
      let starobj = {
        _id: aggregates,
      };

      let newobj = {
        ...starobj,
        ...mylist,
      };

      console.log("I am here star condition", newobj);
      console.log("I am here star condition mylist", mylist);
      // Product.find({ _id: aggregates }) //same ctaeg wale

      //total = await Product.find(newobj).countDocuments().exec();
      // total = handletotal(req, res, newobj);
      console.log("aggre lenght", aggregates.length);
      //total = aggregates.length;

      const total = await Product.find(newobj).countDocuments();

      const products = await Product.find(newobj) //same ctaeg wale
        // .populate("category")
        // .populate("subs")
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        //.sort([[sort, order]]) //sort by created, order is descending
        .sort({ [sort]: order, _id: 1 }) //sort by created, order is descending
        .skip((currentPage - 1) * perPage) //will skip this no of products for 1 to prev page wale ke
        .limit(perPage);
      // .exec((err, products) => {
      //   if (err) console.log("PRODUCT AGGREGATE ERROR", err);
      //   // res.json(products);
      //   console.log("totttttt", total);
      //   res.json({ products, total });
      // });
      console.log("totttttt", total);
      res.json({ products, total });
    } else {
      console.log("I am here non star condition", mylist);

      const products = await Product.find(mylist) //same ctaeg wale
        .populate("category")
        .populate("subs")
        // .populate("category", "_id name")
        // .populate("subs", "_id name")
        // .populate("postedBy", "_id name")
        //.sort([[sort, order]]) //sort by created, order is descending
        .sort({ [sort]: order, _id: 1 }) //sort by created, order is descending
        .skip((currentPage - 1) * perPage) //will skip this no of products for 1 to prev page wale ke
        .limit(perPage);
      // .exec((err, products) => {
      //   if (err) console.log("PRODUCT AGGREGATE ERROR", err);

      //   // let total = Product.find({}).estimatedDocumentCount().exec();
      //   console.log("totttttt", total);

      //   res.json({ products, total });
      // });

      console.log("totttttt", total);

      res.json({ products, total });
    }

    // );
  } catch (err) {
    console.log(err);
  }
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
