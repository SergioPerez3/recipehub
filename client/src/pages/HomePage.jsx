import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecipes } from "../services/recipeService";
import RecipeCarousel from "../components/RecipeCarousel";

function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const mostLiked = [...recipes]
    .filter((recipe) => recipe.likes.length > 0)
    .sort((a, b) => b.likes.length - a.likes.length)
    .slice(0, 12);

  return (
    <section className="home">
      <div className="container">
        {loading && <p>Cargando recetas...</p>}
        {error && <p className="auth-error">{error}</p>}
        {!loading && !error && recipes.length === 0 && (
          <p>Todavía no hay recetas.</p>
        )}

        <RecipeCarousel title="Nuevas recetas" recipes={recipes.slice(0, 12)} />
        <RecipeCarousel title="Los más gustados" recipes={mostLiked} />

        <Link to="/recipes">Ver toda la despensa</Link>
      </div>
    </section>
  );
}

export default HomePage;