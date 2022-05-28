const router = require("express").Router();
const Users = require("../models/UserModel");

const verify = require("./privateRoute");

//Images Multer Setup
const multer = require("multer");
const multerS3 = require("multer-s3"); // AWS MULTER

//AWS S3 CONFIG
const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.AWS_KEYID,
  secretAccessKey: process.env.AWS_SECRET,
});
AWS.config.update({ region: "us-east-2" });

const options = {
  apiVersion: "2006-03-01",
  params: {
    Bucket: "erkanisuf",
  },
  accessKeyId: process.env.AWS_KEYID,
  secretAccessKey: process.env.AWS_SECRET,
  signatureVersion: "v4",
};

const s3 = new AWS.S3(options);
const cloudStorage = multerS3({
  s3: s3,
  bucket: "erkanisuf",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (request, file, ab_callback) {
    ab_callback(null, { fieldname: file.originalname });
  },
  key: function (request, file, ab_callback) {
    let newFileName = Date.now() + "-" + file.originalname;
    ab_callback(null, newFileName);
  },
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only jpeg and png files!"), false);
  }
};

const upload = multer({ storage: cloudStorage, fileFilter: fileFilter });

// import Models
const Products = require("../models/ProductModel");

router.post(
  "/addproduct",
  verify,
  upload.array("productImage", 12),
  async (req, res, next) => {
    const user = await Users.findById({ _id: req.user._id });
    const userAdmin = user.isAdmin;

    if (userAdmin !== "Admin") {
      return res.status(400).send("Only admin premission");
    } else {
      const json_arr = req.body.sizes;
      console.log(json_arr);
      const product = new Products({
        name: req.body.name,
        price: parseInt(req.body.price),
        user: user,
        image: req.files,
        ///
        category: req.body.category,
        countInStock: req.body.countInStock,
        brand: req.body.brand,
        sizes: json_arr,
        description: req.body.description,
        selectedSize: req.body.selectedSize,
        color: req.body.color,
      });
      console.log(product);

      const savedNote = await product.save();
      console.log(savedNote);
      user.products = user.products.concat(savedNote._id);
      await user.save();
      res.send(savedNote);
    }
  }
);
///reviews
///////////Add Review To Product
const Reviews = require("../models/ReviewsModel");

router.post("/addreview", verify, async (req, res) => {
  //First check if user has already posted
  const user = await Users.findById({ _id: req.user._id });

  const product = await Products.findById({ _id: req.body.products })
    .populate("user", {
      name: 1,
      email: 1,
    })
    .populate({ path: "reviews", populate: { path: "user", select: "name" } })

    .then((result) => {
      return result;
    })
    .catch((err) => console.log(err));
  const reviews = product.reviews;

  const checkForUser = reviews.find(
    (el) => el.user._id.toString() == user._id.toString()
  );

  if (checkForUser)
    return res.status(400).send("This user has already reviewed it!!");

  const review = new Reviews({
    review: req.body.review,
    rating: req.body.rating,
    products: req.body.products,
    user: user,
  });

  try {
    const savedNote = await review.save();
    user.reviews = user.reviews.concat(savedNote._id);
    product.reviews = product.reviews.concat(savedNote._id);
    await user.save();
    await product.save();
    res.send(savedNote);
  } catch (err) {
    res.status(400).status(err);
  }
});

///Adds to Database

router.get("/showproducts", (req, res) => {
  Products.find({})
    .select("name price _id image")
    .exec()
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});
///SHOWS The DataBase
router.get("/singleproducts", async (req, res) => {
  const find = await Products.findById({ _id: req.body.id })
    .populate("user", {
      name: 1,
      email: 1,
    })
    .populate({ path: "reviews", populate: { path: "user", select: "name" } })

    .then((result) => {
      return result;
    })
    .catch((err) => console.log(err));
  const reviews = find.reviews;
  const checkForUser = reviews.find((el) => el.user.id === req.body.id);
  if (checkForUser) {
    console.log(checkForUser);
  } else {
    console.log("nope");
  }
});

///////////Gets All products with comments!!!!!!!!
router.get("/productuser", async (req, res) => {
  const products = await Products.find({})
    .select(
      "name price _id image user category  countInStock  brand sizes description selectedSize color"
    )
    .populate("user", {
      name: 1,
      email: 1,
    })
    .populate({ path: "reviews", populate: { path: "user", select: "name" } })
    .exec(); //stringa tuka e v mongoDB variable koito si go imam (primerno user e tozi na products v mongoto)
  res.send(products);
});
///////////Gets All products with comments!!!!!!!!

const Orders = require("../models/OrdersModel");
router.post("/trackorder", (req, res) => {
  console.log(req.body.trackingNumber);

  if (!req.body.trackingNumber) {
    res.status(401).send("Please write a valid Order ID!");
  } else {
    const orders = Orders.find({ trackingNumber: req.body.trackingNumber })
      .select(
        "trackingNumber orderMessage orderLocation clientname date adress"
      )

      .then((result) => {
        console.log(Boolean(result.length), "len");
        if (!result.length) {
          res.send({
            message: `Not found any orders by ID: ${req.body.trackingNumber}`,
            data: result,
          });
        } else {
          res.send({
            message: `Order by id: ${req.body.trackingNumber}`,
            data: result,
          });
        }
      })
      .catch((err) => console.log(err));
  }
});

module.exports = router;
