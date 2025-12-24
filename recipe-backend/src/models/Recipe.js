const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        quantity: { type: String },
    },
    { _id: false }
);

const recipeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,
        },
        title: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        ingredients: [ingredientSchema],
        steps: { type: String },
        difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
        cookTimeMinutes: { type: Number, default: 0 },
        tags: [String],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);


