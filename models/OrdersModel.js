const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ordersSchema = new Schema(
  {
    adress: {
      city: { type: String },
      postcode: { type: String },
      street: { type: String },
    },
    amount: { type: Number },
    clientname: { type: String },
    date: { type: Number },
    email: { type: String },
    orderLocation: { type: String },
    orderMessage: { type: String },
    phone: { type: String },
    trackingNumber: { type: String },
    metadata: { type: String },
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", //ref se izpolzva za modela Users
      },
    ],
    cart: { type: Array },
    cartMongo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products", //ref se izpolzva za modela Products (ProductModel.js)
      },
    ],
  },

  {
    timestamps: true,
  }
);

const Orders = mongoose.model("Orders", ordersSchema);
module.exports = Orders;
