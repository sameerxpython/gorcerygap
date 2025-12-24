const GroceryList = require("../models/GroceryList");
const Recipe = require("../models/Recipe");
const PantryItem = require("../models/PantryItem");

const buildPantryMap = (pantryItems) => {
    const map = {};
    pantryItems.forEach((item) => {
        const key = item.name.toLowerCase();
        if (!map[key]) {
            map[key] = 0;
        }
        map[key] += parseFloat(item.quantity) || 0;
    });
    return map;
};

const generateGroceryList = async (req, res) => {
    try {
        const recipeIds = req.body?.recipeIds || [];
        const name = req.body?.name;

        let recipes;

        if (recipeIds.length > 0) {
            recipes = await Recipe.find({
                _id: { $in: recipeIds },
                user: req.user._id,
            });
        } else {
            recipes = await Recipe.find({ user: req.user._id });
        }

        if (!recipes.length) {
            return res.status(404).json({ message: "No recipes found to generate list from." });
        }

        const pantryItems = await PantryItem.find({ user: req.user._id });
        const pantryMap = buildPantryMap(pantryItems);

        const totalNeededMap = {};

        recipes.forEach((recipe) => {
            recipe.ingredients.forEach((ingredient) => {
                const key = ingredient.name.toLowerCase();
                const needed = parseFloat(ingredient.quantity) || 1;
                const unit = ingredient.unit || "";

                if (!totalNeededMap[key]) {
                    totalNeededMap[key] = {
                        name: ingredient.name,
                        quantity: 0,
                        unit: unit
                    };
                }
                totalNeededMap[key].quantity += needed;
            });
        });

        const missingItems = [];

        Object.keys(totalNeededMap).forEach((key) => {
            const neededItem = totalNeededMap[key];
            const availableQuantity = pantryMap[key] || 0;
            const missingQuantity = neededItem.quantity - availableQuantity;

            if (missingQuantity > 0) {
                missingItems.push({
                    name: neededItem.name,
                    quantity: missingQuantity,
                    unit: neededItem.unit,
                    isPurchased: false
                });
            }
        });

        const items = missingItems;

        const groceryList = await GroceryList.create({
            user: req.user._id,
            name: name || "Auto-generated list",
            items,
            generatedFromRecipes: recipes.map((recipe) => recipe._id),
        });

        res.status(201).json(groceryList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGroceryLists = async (req, res) => {
    try {
        const lists = await GroceryList.find({ user: req.user._id }).sort({
            createdAt: -1,
        });
        res.json(lists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateGroceryItem = async (req, res) => {
    try {
        const { listId, itemId } = req.params;
        const { isPurchased, quantity, unit } = req.body;

        const list = await GroceryList.findOne({
            _id: listId,
            user: req.user._id,
        });

        if (!list) {
            return res.status(404).json({ message: "List not found" });
        }

        const item = list.items.id(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (typeof isPurchased === "boolean") item.isPurchased = isPurchased;
        if (quantity !== undefined) item.quantity = quantity;
        if (unit !== undefined) item.unit = unit;

        await list.save();
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateGroceryList = async (req, res) => {
    try {
        const list = await GroceryList.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!list) {
            return res.status(404).json({ message: "List not found" });
        }

        Object.assign(list, req.body);
        const updated = await list.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteGroceryList = async (req, res) => {
    try {
        const list = await GroceryList.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!list) {
            return res.status(404).json({ message: "List not found" });
        }

        res.json({ message: "Grocery list removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    generateGroceryList,
    getGroceryLists,
    updateGroceryItem,
    updateGroceryList,
    deleteGroceryList,
};