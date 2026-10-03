import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import RecipesPage from "../pages/RecipesPage";
import RecipeDetailPage from "../pages/RecipeDetailPage";
import UserProfilePage from "../pages/UserProfilePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import RecipeFormPage from "../pages/RecipeFormPage";
import NotFoundPage from "../pages/NotFoundPage";
import authLoader from "../loaders/authLoader";
import LikedPage from "../pages/LikedPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // RUTAS PÚBLICAS
      { index: true, element: <HomePage /> },
      { path: "recipes", element: <RecipesPage /> },
      { path: "recipes/:id", element: <RecipeDetailPage /> },
      { path: "users/:id", element: <UserProfilePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "likes", loader: authLoader, element: <LikedPage /> },

      // RUTAS PRIVADAS 
      { path: "dashboard",loader: authLoader, element: <DashboardPage /> },
      { path: "dashboard/recipes/new",loader: authLoader, element: <RecipeFormPage /> },
      { path: "dashboard/recipes/:id/edit",loader: authLoader, element: <RecipeFormPage /> },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);