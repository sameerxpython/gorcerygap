const express = require("express");
const router = express.Router();
const {
  getPantryItems,
  addPantryItem,
  updatePantryItem,
  deletePantryItem,
} = require("../controllers/pantryController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getPantryItems).post(addPantryItem);
router.route("/:id").put(updatePantryItem).delete(deletePantryItem);

module.exports = router;
