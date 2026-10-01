import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserById } from "../services/userService";
import { deleteRecipe } from "../services/recipeService";
import { useAuth } from "../hooks/useAuth";

function DashboardPage() {
  const { user } = useAuth();
  const userId = user?._id;

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchMyRecipes = async () => {
      try {
        const data = await getUserById(userId);
        setRecipes(data.recipes);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, [userId]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Seguro que quieres borrar esta receta?");
    if (!confirmed) return;

    try {
      setError(null);
      await deleteRecipe(id);
      setRecipes(recipes.filter((recipe) => recipe._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className="dashboard">
      <div className="container">
        <h1>Mi Cocina</h1>

        <Link className="btn" to="/dashboard/recipes/new">
          + Nueva receta
        </Link>

        {loading && <p>Cargando tus recetas...</p>}
        {error && <p className="auth-error">{error}</p>}
        {!loading && recipes.length === 0 && (
          <p>Todavía no has publicado ninguna receta.</p>
        )}

        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <article key={recipe._id} className="mini-card">
              <Link to={`/recipes/${recipe._id}`}>
                {recipe.image ? (
                  <img src={recipe.image} alt={recipe.title} />
                ) : (
                  <div className="recipe-card-placeholder">🍽️</div>
                )}
                <h3>{recipe.title}</h3>
              </Link>

              <div className="mini-card-actions">
                <Link to={`/dashboard/recipes/${recipe._id}/edit`}>Editar</Link>
                <button onClick={() => handleDelete(recipe._id)}>Borrar</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;