const Recipe = require("../models/Recipe");

const getRecipes = async (req, res) => {
    try {
        const { ingredient, difficulty } = req.query;
        const query = { user: req.user._id };

        if (ingredient) {
            query["ingredients.name"] = {
                $regex: ingredient,
                $options: "i",
            };
        }

        if (difficulty) {
            query.difficulty = difficulty;
        }

        const recipes = await Recipe.find(query).sort({ createdAt: -1 });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createRecipe = async (req, res) => {
    try {
        const {
            title,
            description,
            ingredients,
            steps,
            difficulty,
            cookTimeMinutes,
            tags,
        } = req.body;

        const recipe = await Recipe.create({
            user: req.user._id,
            title,
            description,
            ingredients,
            steps,
            difficulty,
            cookTimeMinutes,
            tags,
        });

        res.status(201).json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        Object.assign(recipe, req.body);

        const updated = await recipe.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        res.json({ message: "Recipe removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
}
