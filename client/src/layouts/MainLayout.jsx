import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import UserIcon from "../components/UserIcon";

function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className="brand">
        <Link to="/" className="brand-title">
          <span className="brand-icon" aria-hidden="true">🍴</span>
          <span>TASTEFY</span>
          <span className="brand-icon" aria-hidden="true">🔪</span>
        </Link>
        <p className="brand-tagline">Donde las ideas se llevan a la olla</p>
      </header>

      <nav className="main-nav">
        <div className="nav-spacer" />

        <div className="nav-links">
          <Link to="/recipes">Despensa</Link>
          <Link to="/dashboard">Mi Cocina</Link>
        </div>

        {user ? (
          <div className="nav-user is-online">
            <Link to="/dashboard" className="nav-user-link">
              <UserIcon />
              <span>Hola, {user.name}</span>
            </Link>
            <button className="nav-logout" onClick={handleLogout}>
              Salir
            </button>
          </div>
        ) : (
          <Link to="/login" className="nav-user is-offline">
            <UserIcon />
            <span>¡Entra ya!</span>
          </Link>
        )}
      </nav>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>© Tastefy</p>
      </footer>
    </>
  );
}

export default MainLayout;