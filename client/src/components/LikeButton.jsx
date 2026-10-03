import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { likeRecipe, unlikeRecipe } from "../services/recipeService";

function LikeButton({ recipeId, initialLikes = [], onChange }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  const liked = !!user && likes.includes(user._id);

  const handleClick = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const data = liked
        ? await unlikeRecipe(recipeId)
        : await likeRecipe(recipeId);

      setLikes(data.likes);
      onChange?.(data.likes);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`like-btn ${liked ? "is-liked" : ""}`}
      onClick={handleClick}
      disabled={loading}
      aria-pressed={liked}
      aria-label={liked ? "Quitar me gusta" : "Dar me gusta"}
    >
      <span aria-hidden="true">{liked ? "❤️" : "🤍"}</span> {likes.length}
    </button>
  );
}

export default LikeButton;