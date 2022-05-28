const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewsSchema = new Schema(
  {
    review: { type: String, required: true, min: 6, max: 200 },
    rating: { type: Number, required: true },
    products: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products", //ref se izpolzva za modela Products (ProductModel.js)
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", //ref se izpolzva za modela Users
    },
  },

  {
    timestamps: true,
  }
);

const Reviews = mongoose.model("Reviews", ReviewsSchema);
module.exports = Reviews;
