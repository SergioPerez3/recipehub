import { Link } from "react-router-dom";

function RecipeCard({ recipe }) {
  return (
    <article className="recipe-card">
      <Link to={`/recipes/${recipe._id}`}>
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} />
        ) : (
          <div className="recipe-card-placeholder">🍽️</div>
        )}

        <div className="recipe-card-body">
          <span className="recipe-card-category">{recipe.category}</span>
          <h3>{recipe.title}</h3>
          <p>
            {recipe.difficulty} · {recipe.cookingTime} min
          </p>
        </div>
      </Link>

      {recipe.author?.name && (
        <p className="recipe-card-author">
          Por <Link to={`/users/${recipe.author._id}`}>{recipe.author.name}</Link>
        </p>
      )}
    </article>
  );
}

export default RecipeCard;