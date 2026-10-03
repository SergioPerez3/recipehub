import { useEffect, useState } from "react";
import { getRecipes } from "../services/recipeService";
import RecipeCard from "../components/RecipeCard";
import RecipeFilters from "../components/RecipeFilters";
import Pagination from "../components/Pagination";

const PER_PAGE = 6; // 2 filas de 3 recetas

const initialFilters = {
  search: "",
  category: "",
  difficulty: "",
};

// Quita tildes y mayúsculas para que "facil" encuentre "fácil"
const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(0);

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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFilters({
      ...filters,
      [name]: value,
    });
    setPage(0); // al cambiar un filtro volvemos a la primera página
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setPage(0);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const search = normalize(filters.search.trim());

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      !search ||
      normalize(
        `${recipe.title} ${recipe.description} ${recipe.ingredients}`,
      ).includes(search);

    const matchesCategory =
      !filters.category || recipe.category === filters.category;

    const matchesDifficulty =
      !filters.difficulty || recipe.difficulty === filters.difficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const totalPages = Math.ceil(filteredRecipes.length / PER_PAGE);
  const start = page * PER_PAGE;
  const visibleRecipes = filteredRecipes.slice(start, start + PER_PAGE);

  return (
    <section className="despensa">
      <div className="container">
        <h1>Despensa</h1>

        <RecipeFilters
          filters={filters}
          onChange={handleChange}
          onReset={handleReset}
        />

        {loading && <p>Cargando recetas...</p>}
        {error && <p className="auth-error">{error}</p>}

        {!loading && !error && (
          <p className="results-count">
            {filteredRecipes.length}{" "}
            {filteredRecipes.length === 1 ? "receta" : "recetas"}
          </p>
        )}

        {!loading && !error && filteredRecipes.length === 0 && (
          <p>No hay recetas con esos filtros.</p>
        )}

        <div className="despensa-grid">
          {visibleRecipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
}

export default RecipesPage;