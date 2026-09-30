import { Router } from "express";
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipe.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", isAuth, createRecipe);

router.get("/", getRecipes);
router.get("/:id", getRecipeById);

router.put("/:id", isAuth, updateRecipe);
router.delete("/:id", isAuth, deleteRecipe);

export default router;