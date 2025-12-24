const PantryItem = require("../models/PantryItem");

const getPantryItems = async (req, res) => {
    try {
        const items = await PantryItem.find({ user: req.user._id }).sort({
            createdAt: -1,
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addPantryItem = async (req, res) => {
    try {
        const { name, quantity, unit, category, expiryDate } = req.body;

        const item = await PantryItem.create({
            user: req.user._id,
            name,
            quantity,
            unit,
            category,
            expiryDate,
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePantryItem = async (req, res) => {
    try {
        const item = await PantryItem.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        Object.assign(item, req.body);

        const updated = await item.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePantryItem = async (req, res) => {
    try {
        const item = await PantryItem.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({message: "Item removed"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPantryItems,
    addPantryItem,
    updatePantryItem,
    deletePantryItem,
};