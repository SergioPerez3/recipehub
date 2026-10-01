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

  return (
    <section className="home">
      <div className="container">
        {loading && <p>Cargando recetas...</p>}
        {error && <p className="auth-error">{error}</p>}
        {!loading && !error && recipes.length === 0 && (
          <p>Todavía no hay recetas.</p>
        )}

        {/* Los más gustados: lo añadimos cuando tengamos likes */}

        {/* El back ya devuelve las recetas de la más nueva a la más antigua */}
        <RecipeCarousel title="Nuevas recetas" recipes={recipes.slice(0, 12)} />

        <Link to="/recipes">Ver toda la despensa</Link>
      </div>
    </section>
  );
}

export default HomePage;