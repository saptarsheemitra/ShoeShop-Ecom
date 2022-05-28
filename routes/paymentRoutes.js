const router = require("express").Router();
const keyStripe = process.env.KEY_STRIPE;
const gmailacc = process.env.GMAIL_ACC;
const gmailapasw = process.env.GMAIL_PASW;
const stripe = require("stripe")(keyStripe);
const { v4: uuidv4 } = require("uuid");
const Joi = require("@hapi/joi");
const verify = require("./ordersGuest");

const calculateOrderAmount = (items) => {
  const arrayZ = [...items];

  var resultPrice = 0;

  // we wait for the axios.get Promise to be resolved
  const objects = arrayZ;

  objects.forEach((childSnapshot) => {
    let childData = childSnapshot;
    resultPrice += childData.price_data.unit_amount * childData.quantity;
  });

  return Number(resultPrice);
};

const JoiSchema = Joi.object({
  street: Joi.string().min(6).required(),
  phone: Joi.string().min(6).required(),
  city: Joi.string().min(6).required(),
  postcode: Joi.string().min(4).required(),
  name: Joi.string().min(4).required(),
  surname: Joi.string().min(4).required(),
  contactemail: Joi.string().min(4).required().email(),
});
router.post("/checkadress", async (req, res) => {
  const { userinfo } = req.body;

  const { error } = JoiSchema.validate(userinfo);
  if (error) return res.status(400).send(error.details[0].message);
  res.send({ message: "AdressOK" });
});

router.post("/create-payment-intent", async (req, res) => {
  const { items, userinfo, cart, typeUser } = req.body;

  if (
    userinfo.street === "" ||
    userinfo.phone === "" ||
    userinfo.city === "" ||
    userinfo.postcode === "" ||
    userinfo.name === "" ||
    userinfo.surname === "" ||
    userinfo.contactemail === ""
  )
    return res.status(400).send("Please make sure to fill all Fields !");
  const cartItems = cart.map((el) => {
    const newObj = {
      name: el.name,
      mongoProductID: el.id,
      color: el.color,
      quantity: el.quantity,
      selectedSize: el.selectedSize,
      user: { ...el.user[0] },
    };
    return newObj;
  });

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "eur",
    receipt_email: userinfo.contactemail,
    // metadata: {
    //   date: new Date(),
    //   cartProducts: JSON.stringify({ cartItems }),
    //   typeUser: JSON.stringify({ typeUser }),
    // },
    shipping: {
      address: {
        line1: userinfo.street,
        city: userinfo.city,
        postal_code: userinfo.postcode,
      },
      tracking_number: uuidv4(),
      name: userinfo.name + "," + userinfo.surname,
      phone: userinfo.phone,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    info: paymentIntent,
    metadata: {
      date: new Date(),
      cartProducts: JSON.stringify({ cartItems }),
      typeUser: JSON.stringify({ typeUser }),
    },
  });
});

const Users = require("../models/UserModel");
const Orders = require("../models/OrdersModel");
const nodemailer = require("nodemailer");

const sendEmailToUser = (param) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailacc,
      pass: gmailapasw, // naturally, replace both with your real credentials or an application-specific password
    },
  });

  const mailOptions = {
    from: gmailacc,
    to: param.email,
    subject: "Your Order has been successfull!",
    text: `Tracking number: ${param.trackingNumber},
    Total paid: ${param.amount / 100} euros,
     Order date: ${param.createdAt} euros,
    
    Delivery To Adress: ${param.adress.city},${param.adress.street},${
      param.adress.postcode
    },
    
    The Shoe Shop Thanks for the order!,
    
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
router.post("/orderstomongo", verify, async (req, res) => {
  const { orders } = req.body;
  const user = await Users.findById({ _id: req.user._id });

  const neworder = new Orders({ ...orders, user: user });

  const savedOrder = await neworder.save();

  user.orders = user.orders.concat(savedOrder._id);
  await user.save();

  res.send(savedOrder);

  sendEmailToUser(savedOrder);
});
module.exports = router;
