import mongoose from "mongoose";
import User from "../models/User.js";
import Recipe from "../models/Recipe.js";

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }

    const user = await User.findById(id).select("name createdAt");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const recipes = await Recipe.find({ author: id }).sort({ createdAt: -1 });

    res.status(200).json({ user, recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};