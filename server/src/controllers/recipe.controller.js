import mongoose from "mongoose";
import Recipe from "../models/Recipe.js";

const EDITABLE_FIELDS = [
  "title",
  "description",
    "image",
    "ingredients",
    "steps",
    "category",
    "difficulty",
    "cookingTime",
];

export const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, steps } = req.body;

    if (!title || !ingredients || !steps) {
      return res
        .status(422)
        .json({ message: "Título, ingredientes y pasos son obligatorios" });
    }

    const data = { author: req.user._id };
    EDITABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) data[field] = req.body[field];
    });

    const recipe = await Recipe.create(data);

    res.status(201).json({
      message: "Receta creada correctamente",
      recipe,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(422).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Error al crear la receta" });
  }
};

export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las recetas" });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }

    const recipe = await Recipe.findById(id).populate("author", "name");

    if (!recipe) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la receta" });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "No puedes editar una receta que no es tuya" });
    }

    EDITABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) recipe[field] = req.body[field];
    });

    await recipe.save();

    res.status(200).json({
      message: "Receta actualizada correctamente",
      recipe,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(422).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la receta" });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "No puedes eliminar una receta que no es tuya" });
    }

    await recipe.deleteOne();

    res.status(200).json({ message: "Receta eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la receta" });
  }
};