const mongoose = require("mongoose");

const groceryItemSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        quantity: { type: String },
        unit: { type: String },
        isPurchased: { type: Boolean, default: false },
    },
    { _id: true }
);

const groceryListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      default: "Grocery List",
    },
    items: [groceryItemSchema],
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    generatedFromRecipes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("GroceryList", groceryListSchema);

