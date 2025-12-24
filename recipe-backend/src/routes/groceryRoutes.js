const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  generateGroceryList,
  getGroceryLists,
  updateGroceryItem,
  updateGroceryList,
  deleteGroceryList,
} = require("../controllers/groceryController");

router.use(protect);

router.post("/generate", generateGroceryList);
router.get("/", getGroceryLists);
router
  .route("/:id")
  .put(updateGroceryList)
  .delete(deleteGroceryList);
router.patch("/:listId/items/:itemId", updateGroceryItem);

module.exports = router;
