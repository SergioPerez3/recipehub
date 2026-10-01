import { useState } from "react";
import RecipeCard from "./RecipeCard";

const PER_PAGE = 4;

function RecipeCarousel({ title, recipes }) {
  const [page, setPage] = useState(0);

  if (recipes.length === 0) return null;

  const totalPages = Math.ceil(recipes.length / PER_PAGE);
  const start = page * PER_PAGE;
  const visibleRecipes = recipes.slice(start, start + PER_PAGE);

  return (
    <section className="carousel">
      <h2 className="carousel-title">{title}</h2>

      <div className="carousel-wrapper">
        <button
          className="carousel-btn"
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          aria-label="Recetas anteriores"
        >
          ‹
        </button>

        <div className="carousel-grid">
          {visibleRecipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>

        <button
          className="carousel-btn"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages - 1}
          aria-label="Recetas siguientes"
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default RecipeCarousel;