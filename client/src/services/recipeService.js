const API_URL = `${import.meta.env.VITE_API_URL}/recipes`;

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Error en la solicitud");
  }
  return data;
};

const getAuthHeaders = () => ({
  "Content-type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getRecipes = async () => {
  const response = await fetch(API_URL);
  return handleResponse(response);
};

export const getRecipeById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return handleResponse(response);
};

export const createRecipe = async (recipeData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(recipeData),
  });
  return handleResponse(response);
};

export const updateRecipe = async (id, recipeData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(recipeData),
  });
  return handleResponse(response);
};

export const deleteRecipe = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const likeRecipe = async (id) => {
  const response = await fetch(`${API_URL}/${id}/likes`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const unlikeRecipe = async (id) => {
  const response = await fetch(`${API_URL}/${id}/likes`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getLikedRecipes = async () => {
  const response = await fetch(`${API_URL}/liked`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

