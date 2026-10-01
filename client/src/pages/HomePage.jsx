import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecipes } from "../services/recipeService";
import RecipeCard from "../components/RecipeCard";

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
        <h1>Sobremesa</h1>
        <p>Lo que se cocina hoy</p>

        <h2>Recién salido del horno</h2>

        {loading && <p>Cargando recetas...</p>}
        {error && <p className="auth-error">{error}</p>}
        {!loading && !error && recipes.length === 0 && (
          <p>Todavía no hay recetas.</p>
        )}

        <div className="recipes-grid">
          {recipes.slice(0, 8).map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>

        <Link to="/recipes">Ver todas las recetas</Link>
      </div>
    </section>
  );
}

export default HomePage;