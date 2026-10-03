import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLikedRecipes } from "../services/recipeService";
import { useAuth } from "../hooks/useAuth";
import RecipeCard from "../components/RecipeCard";

function LikedPage() {
  const { user } = useAuth();
  const userId = user?._id;

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const data = await getLikedRecipes();
        setRecipes(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLiked();
  }, []);

  // Si quitas el like, la card desaparece de la lista
  const handleLikeChange = (recipeId, likes) => {
    if (!likes.includes(userId)) {
      setRecipes((current) =>
        current.filter((recipe) => recipe._id !== recipeId),
      );
    }
  };

  return (
    <section className="liked-page">
      <div className="container">
        <h1>Mis me gusta</h1>

        {loading && <p>Cargando tus recetas...</p>}
        {error && <p className="auth-error">{error}</p>}

        {!loading && !error && recipes.length === 0 && (
          <p>
            Todavía no has dado me gusta a ninguna receta.{" "}
            <Link to="/recipes">Date una vuelta por la despensa</Link>
          </p>
        )}

        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onLikeChange={handleLikeChange}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default LikedPage;