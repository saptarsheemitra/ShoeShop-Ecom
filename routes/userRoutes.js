const router = require("express").Router();
const Users = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("./privateRoute");
const mongoose = require("mongoose");

//Validate
const Joi = require("@hapi/joi"); //Validation package (it needs own Joi.object({} schema))

const JoiSchema = Joi.object({
  name: Joi.string().min(4).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

/// Routes
router.post("/register", async (req, res) => {
  const { error } = JoiSchema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const noDupeEmail = await Users.findOne({ email: req.body.email }); //Checks if email duplicates in Database (findOne!)
  if (noDupeEmail) return res.status(400).send("Email already exists!");

  //Has Password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new Users({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const saveUser = await user.save();
    // res.send({ user: user.email });

    const userFind = await Users.findOne({ name: req.body.name });
    const validPassword = await bcrypt.compare(
      req.body.password,
      userFind.password
    );
    const token = jwt.sign({ _id: userFind._id }, process.env.TOKEN_USER);
    res
      .header("auth_token", token)
      .send({ token: token, user: userFind.name, userID: userFind.id });
  } catch (err) {
    res.status(400).status(err);
  }
});

////// LOGIN //////////////
const JoiSchemaLogin = Joi.object({
  name: Joi.string().min(4).required(),
  password: Joi.string().min(6).required(),
});
router.post("/login", async (req, res) => {
  const { error } = JoiSchemaLogin.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  const user = await Users.findOne({ name: req.body.name }); //Checks if email duplicates in Database (findOne!)
  if (!user) return res.status(400).send("User name doesnt exists!");

  const validPassword = await bcrypt.compare(req.body.password, user.password); //Checks if password matches with Db
  if (!validPassword) return res.status(400).send("Invalid password");
  //Make Tokens
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_USER);

  res.header("auth_token", token).send({
    token: token,
    user: user.name,
    userID: user.id,
    adress: user.adress,
  });
});
// UPDATE User Adress
const JoiSchemaUpdateAdress = Joi.object({
  adress: {
    street: Joi.string().min(6),
    city: Joi.string().min(6),
    phone: Joi.string().min(6),
    postcode: Joi.string().min(4),
    name: Joi.string().min(4),
    surname: Joi.string().min(4),
    contactemail: Joi.string().email(),
  },
});

router.put("/update/:id", (request, response, next) => {
  const { error } = JoiSchemaUpdateAdress.validate(request.body);
  if (error) return response.status(400).send(error.details[0].message);
  const body = request.body;

  const newUpdate = {
    adress: body.adress,
  };
  let token = request.header("auth_token");
  if (!token)
    return response
      .status(401)
      .send({ auth: false, message: "No token provided" });
  jwt.verify(token, process.env.TOKEN_USER, function (err, decoded) {
    if (err)
      return response
        .status(500)
        .send({ auth: false, message: "failed to auth token" });
    Users.findByIdAndUpdate(
      { _id: decoded._id },
      newUpdate,
      { new: true },
      function (err, user) {
        if (err) response.send(err);
        response.json(user.adress);
      }
    );
  });
});
///////// Get Adress User
router.get("/useradress", verify, async (req, res) => {
  let token = req.header("auth_token");
  if (!token)
    return response
      .status(401)
      .send({ auth: false, message: "No token provided" });
  const tokenID = jwt.verify(token, process.env.TOKEN_USER);

  const users = await Users.find({ _id: tokenID }).select("adress");
  res.send(users);
});

router.get("/userpost", async (req, res) => {
  const users = await Users.find({}).populate("products", {
    name: 1,
    price: 1,
  });
  res.send(users);
});

router.get("/userorders", verify, async (req, res) => {
  let token = req.header("auth_token");
  if (!token)
    return response
      .status(401)
      .send({ auth: false, message: "No token provided" });
  const tokenID = jwt.verify(token, process.env.TOKEN_USER);

  const users = await Users.find({ _id: tokenID })
    .select("orders")
    .populate("orders", {
      trackingNumber: 1,
      amount: 1,
      createdAt: 1,
      orderMessage: 1,
      orderLocation: 1,
      _id: 1,
      cart: 1,
      metadata: 1,
    })
    .populate({
      path: "orders",
      populate: { path: "cartMongo", select: "name id image" },
    });
  res.send(users);
});

///Shows Top Orders for Front page
const Orders = require("../models/OrdersModel");
router.get("/toporders", async (req, res) => {
  const orders = await Orders.find({})
    .select("cartMongo")
    .populate({
      path: "cartMongo",
      select: { id: 1, name: 1, image: 1, price: 1 },

      populate: { path: "reviews", select: "rating" },
    });
  console.log(orders);
  res.send(orders);
});

router.put("/addfavorites", verify, async (req, res) => {
  const item = req.body.item;
  console.log(item);
  const newUpdate = {
    $push: { favorites: req.body.item },
  };

  const findItem = await Users.findById({ _id: req.user._id });
  const isItemIn = await findItem.favorites.find(
    (el) => el.toString() === item
  );

  if (isItemIn)
    return res.status(400).send("This Item is Already in your Favorite List");
  const result = Users.findByIdAndUpdate(
    { _id: req.user._id },
    newUpdate,
    { new: true },
    function (err, user) {
      if (err) res.send(err);
      res.json(user.favorites);
    }
  );
});

router.get("/userfavs", verify, async (req, res) => {
  const item = req.body.item;
  console.log(item);

  const findItem = await Users.findById({ _id: req.user._id });
  res.status(200).send(findItem.favorites);
});

router.get("/myfavs", verify, async (req, res) => {
  const item = req.body.item;
  console.log(item);

  const findItem = await Users.findById({ _id: req.user._id })
    .select("favorites ")
    .populate({
      path: "favorites",

      populate: { path: "reviews", select: "rating" },
    });

  res.send(findItem);
});

router.put("/deletefav", verify, async (req, res) => {
  const item = req.body.item;

  Users.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { favorites: item } },
    { multi: true },
    function (err, data) {
      if (err) {
        return res.status(500).json({ error: "error in deleting address" });
      }

      res.json(data);
    }
  );
});

const nodemailer = require("nodemailer");

const sendEmailToUser = (useremail, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ACC,

      pass: process.env.GMAIL_PASW, // naturally, replace both with your real credentials or an application-specific password
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_ACC,
    to: useremail,
    subject: "Rest your Password",
    html: `<h2>Please Click the given link to reset your password </h2>
    <p>${process.env.RESET_LINK}/${token}</p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

router.put("/forgotpassword", async (req, res) => {
  const email = req.body.email;
  console.log(req.body.email);

  const user = Users.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json("User does not exists.");
    }
    const token = jwt.sign({ _id: user._id }, process.env.RESET_PASS, {
      expiresIn: "20m",
    });

    user.updateOne({ resetLink: token }, (err, succ) => {
      if (err) {
        return res.status(400).json("reset password error!");
      } else {
        sendEmailToUser(email, token);
        res.send("Email has been send sent! Follow the instructions");
      }
    });
  });
});

const JoiSnewPassword = Joi.object({
  newPassword: Joi.string().min(6).required(),
  resetLink: Joi.string().min(6).required(),
});
router.put("/resetpassword", async (req, res) => {
  const { error } = JoiSnewPassword.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  const { resetLink, newPassword } = req.body;

  if (resetLink) {
    jwt.verify(resetLink, process.env.RESET_PASS, function (err, succ) {
      if (err) {
        return res.status(401).json({ error: "Expired Token or Wrong Token" });
      }
      Users.findOne({ resetLink }, async (err, user) => {
        if (err || !user) {
          return res
            .status(400)
            .json({ error: "No users found with this token!" });
        }
        console.log(user, "user");
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashPassword;
        user.save((err, succ) => {
          if (err) {
            res.status(400).send("err couldnt asve");
          } else {
            res.status(200).send("Password changed");
          }
        });
      });
    });
  } else {
    return res.status(401).json({ error: "Something Went Wrong!" });
  }
});

router.put("/asdf", async (req, res) => {
  const email = req.body.email;
  console.log(email);
});

module.exports = router;
