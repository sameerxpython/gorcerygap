const express = require("express");
const router = express.Router();
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipeController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getRecipes).post(createRecipe);
router
  .route("/:id")
  .get(getRecipeById)
  .put(updateRecipe)
  .delete(deleteRecipe);

module.exports = router;
