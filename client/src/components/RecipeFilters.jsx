import { CATEGORIES, DIFFICULTIES } from "../constants/recipe";

function RecipeFilters({ filters, onChange, onReset }) {
  return (
    <form className="recipe-filters" onSubmit={(event) => event.preventDefault()}>
      <div className="form-group">
        <label htmlFor="search">Buscar: </label>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Título, ingrediente..."
          value={filters.search}
          onChange={onChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Tipo de comida: </label>
        <select
          name="category"
          id="category"
          value={filters.category}
          onChange={onChange}
        >
          <option value="">Todos</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="difficulty">Dificultad: </label>
        <select
          name="difficulty"
          id="difficulty"
          value={filters.difficulty}
          onChange={onChange}
        >
          <option value="">Todas</option>
          {DIFFICULTIES.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>
      </div>

      <button type="button" onClick={onReset}>
        Limpiar filtros
      </button>
    </form>
  );
}

export default RecipeFilters;
