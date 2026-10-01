const API_URL = `${import.meta.env.VITE_API_URL}/recipes`;

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Error en la solicitud");
  }
  return data;
};

export const getRecipes = async () => {
  const response = await fetch(API_URL);
  return handleResponse(response);
};

export const getRecipeById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return handleResponse(response);
};