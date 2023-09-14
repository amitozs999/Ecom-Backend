const Category = require("../models/category");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({ name, slug: slugify(name) }).save(); //created categoryfor given name="TabLet",  slug="tablet'
    res.json(category); //sending back this categ in response after that
  } catch (err) {
    // console.log(err);
    res.status(400).send("Create category failed");
  }
};

exports.list = async (req, res) => {
  console.log("yoyo11");
  const categlist = await Category.find({}).sort({ createdAt: -1 }).exec(); // find list of categories from databse category model
  console.log(categlist);
  res.json(categlist); //sending back this categ  list in response after that
};

exports.read = async (req, res) => {
  let category = await Category.findOne({ slug: req.params.slug }).exec(); // given param me categ ka naam aya hoga in slug param  /:slug, finding that categ from databse
  res.json(await Category.findOne({ slug: req.params.slug }).exec()); //sending back in response
};

exports.update = async (req, res) => {
  const { name } = req.body;

  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug }, //slug= req.params.slug  (old categ name)
      { name, slug: slugify(name) }, //name =res.body ke under  (new anme for categ)
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send("Category update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug }); //delete this cataeg from database
    res.json(deleted); //show deleted categ is response
  } catch (err) {
    res.status(400).send("Category delete failed");
  }
};
