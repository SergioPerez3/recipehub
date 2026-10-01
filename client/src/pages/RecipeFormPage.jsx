import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createRecipe,
  getRecipeById,
  updateRecipe,
} from "../services/recipeService";
import { CATEGORIES, DIFFICULTIES } from "../constants/recipe";

const initialForm = {
  title: "",
  description: "",
  image: "",
  ingredients: "",
  steps: "",
  category: "otros",
  difficulty: "fácil",
  cookingTime: "",
};

function RecipeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        const recipe = await getRecipeById(id);

        setForm({
          title: recipe.title,
          description: recipe.description,
          image: recipe.image,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          category: recipe.category,
          difficulty: recipe.difficulty,
          cookingTime: String(recipe.cookingTime),
        });
      } catch (error) {
        setError(error.message);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError(null);

      const recipeData = {
        title: form.title.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        ingredients: form.ingredients.trim(),
        steps: form.steps.trim(),
        category: form.category,
        difficulty: form.difficulty,
        cookingTime: Number(form.cookingTime) || 0,
      };

      if (id) {
        await updateRecipe(id, recipeData);
      } else {
        await createRecipe(recipeData);
      }

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className="recipe-form-section">
      <div className="container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>{id ? "Editar receta" : "Nueva receta"}</h1>

          {error && <p className="auth-error">{error}</p>}

          <div className="form-group">
            <label htmlFor="title">Título: </label>
            <input
              type="text"
              name="title"
              id="title"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción: </label>
            <input
              type="text"
              name="description"
              id="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Imagen (URL): </label>
            <input
              type="text"
              name="image"
              id="image"
              value={form.image}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ingredients">Ingredientes (uno por línea): </label>
            <textarea
              name="ingredients"
              id="ingredients"
              rows="6"
              value={form.ingredients}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="steps">Pasos (uno por línea): </label>
            <textarea
              name="steps"
              id="steps"
              rows="6"
              value={form.steps}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoría: </label>
            <select
              name="category"
              id="category"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Dificultad: </label>
            <select
              name="difficulty"
              id="difficulty"
              value={form.difficulty}
              onChange={handleChange}
            >
              {DIFFICULTIES.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cookingTime">Tiempo (minutos): </label>
            <input
              type="number"
              min="0"
              name="cookingTime"
              id="cookingTime"
              value={form.cookingTime}
              onChange={handleChange}
            />
          </div>

          <button className="btn" type="submit">
            {id ? "Guardar cambios" : "Publicar receta"}
          </button>

          <Link to="/dashboard">Cancelar</Link>
        </form>
      </div>
    </section>
  );
}

export default RecipeFormPage;