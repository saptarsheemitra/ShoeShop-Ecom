const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    name: { type: String, required: true, min: 6, max: 200 },
    email: { type: String, required: true, min: 6, max: 200 },
    password: { type: String, required: true, min: 6, max: 1500 },
    isAdmin: {
      type: String,
      required: true,
      min: 6,
      max: 1500,
      default: "user",
    },
    resetLink: { type: String },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products", //ref se izpolzva za modela Products (ProductModel.js)
      },
    ],
    adress: {
      type: {
        name: { type: String, required: false, min: 6, max: 1500 },
        surname: { type: String, required: false, min: 6, max: 1500 },
        contactemail: { type: String, required: false, min: 6, max: 1500 },
        street: { type: String, required: false, min: 6, max: 1500 },
        city: { type: String, required: false, min: 6, max: 1500 },
        postcode: { type: String, required: false, min: 6, max: 1500 },
        phone: { type: String, required: false, min: 6, max: 1500 },
      },
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products", //ref se izpolzva za modela Products (ProductModel.js)
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders", //ref se izpolzva za modela Products (ProductModel.js)
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews", //ref se izpolzva za modela Products (ProductModel.js)
      },
    ],
  },

  {
    timestamps: true,
  }
);
usersSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const Users = mongoose.model("Users", usersSchema);
module.exports = Users;
