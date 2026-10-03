import { Router } from "express";
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
  unlikeRecipe,
  getLikedRecipes,
} from "../controllers/recipe.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getRecipes);
router.get("/liked", isAuth, getLikedRecipes); // antes de "/:id"
router.get("/:id", getRecipeById);
router.post("/", isAuth, createRecipe);
router.put("/:id", isAuth, updateRecipe);
router.delete("/:id", isAuth, deleteRecipe);
router.post("/:id/likes", isAuth, likeRecipe);
router.delete("/:id/likes", isAuth, unlikeRecipe);

export default router;