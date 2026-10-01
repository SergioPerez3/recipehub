import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRecipeById } from "../services/recipeService";
import { useAuth } from "../hooks/useAuth";

const toList = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

function RecipeDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchRecipe();
  }, [id]);

  if (error) return <p className="auth-error">{error}</p>;
  if (!recipe) return <p>Cargando receta...</p>;

  const isOwner = user && recipe.author && user._id === recipe.author._id;

  return (
    <article className="recipe-detail">
      <div className="container">
        <Link to="/recipes">← Volver a la despensa</Link>

        {recipe.image && <img src={recipe.image} alt={recipe.title} />}

        <h1>{recipe.title}</h1>

        <p className="recipe-meta">
          {recipe.category} · {recipe.difficulty} · {recipe.cookingTime} min
        </p>

        {recipe.author && (
          <p>
            Por <Link to={`/users/${recipe.author._id}`}>{recipe.author.name}</Link>
          </p>
        )}

        {isOwner && (
          <Link className="btn" to={`/dashboard/recipes/${recipe._id}/edit`}>
            Editar receta
          </Link>
        )}

        {recipe.description && <p>{recipe.description}</p>}

        <h2>Ingredientes</h2>
        <ul>
          {toList(recipe.ingredients).map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>

        <h2>Preparación</h2>
        <ol>
          {toList(recipe.steps).map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </article>
  );
}

export default RecipeDetailPage;