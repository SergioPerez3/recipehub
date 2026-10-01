import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header>
        <nav>
          <Link to="/">🍳TASTEFY</Link>
          <Link to="/recipes">Despensa</Link>

          {user ? (
            <>
              <Link to="/dashboard">Mi Cocina</Link>
              <span>Hola, {user.name}</span>
              <button onClick={handleLogout}>Salir</button>
            </>
          ) : (
            <>
              <Link to="/login">Entrar</Link>
              <Link to="/register">Registro</Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>RecipeHub</p>
      </footer>
    </>
  );
}

export default MainLayout;