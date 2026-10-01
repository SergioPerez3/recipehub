import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

const initialForm = {
  email: "",
  password: "",
};

function LoginPage() {
  const context = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      setMessage("");

      const userData = {
        email: form.email.trim(),
        password: form.password,
      };

      const data = await login(userData);

      context.login(data);

      setMessage(data.message || "Sesión iniciada correctamente");
      setForm(initialForm);

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className="auth-section">
      <div className="container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Iniciar sesión</h1>

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-message">{message}</p>}

          <div className="form-group">
            <label htmlFor="email">Correo: </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña: </label>
            <input
              autoComplete="off"
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button className="btn" type="submit">
            Iniciar sesión
          </button>

          <p>
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;