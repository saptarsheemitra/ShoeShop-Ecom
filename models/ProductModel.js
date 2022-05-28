const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    category: { type: String },
    countInStock: { type: Number, default: 1 },
    brand: { type: String },

    sizes: { type: Array },
    description: { type: String, required: true },
    selectedSize: { type: String, default: "" },
    name: { type: String, required: true, unique: false },
    price: { type: Number, required: true },
    color: { type: String },
    image: { type: Array, default: [] },
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", //ref se izpolzva za modela Users
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews", //ref se izpolzva za modela Users
      },
    ],
  },

  {
    timestamps: true,
  }
);

productSchema.set("toJSON", {
  //This transforms the obj Id of mongo to String to the front end
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Products = mongoose.model("Products", productSchema);
module.exports = Products;
