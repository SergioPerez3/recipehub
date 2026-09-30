import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema(
  {
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },

    description: { 
        type: String, 
        default: "" 
    },

    image: { 
        type: String, 
        default: "" 
    },

    ingredients: { 
        type: String, 
        required: true, 
        trim: true 
    },

    steps: { 
        type: String, 
        required: true, 
        trim: true 
    },

    category: {
      type: String,
      enum: ["desayuno", "comida", "cena", "postre", "snack", "otros"],
      default: "otros",
    },

    difficulty: {
      type: String,
      enum: ["fácil", "media", "difícil"],
      default: "fácil",
    },

    cookingTime: { 
        type: Number, 
        default: 0 
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { 
    timestamps: true 
},
);

const Recipe = mongoose.model("Recipe", RecipeSchema);
export default Recipe;