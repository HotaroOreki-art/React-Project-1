import { useState, useEffect } from 'react';
import './App.css'; 

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showVegOnly, setShowVegOnly] = useState(false);

  async function searchApi(query) {
    setIsLoading(true); 

    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (error) {
      console.error("Network error:", error);
      setRecipes([]); 
    } finally {
      setIsLoading(false); 
    }
  }

  useEffect(() => {
    searchApi("chicken"); 
  }, []); 

  const handleSearch = (e) => {
    e.preventDefault(); 
    if (searchTerm.trim() !== "") {
      searchApi(searchTerm);
    }
  };

  const toggleFavorite = (recipe) => {
    const isAlreadyFavorite = favorites.some((fav) => fav.idMeal === recipe.idMeal);

    if (isAlreadyFavorite) {
      setFavorites(favorites.filter((fav) => fav.idMeal !== recipe.idMeal));
    } else {
      setFavorites([...favorites, recipe]);
    }
  };

  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>👨‍🍳 Recipe Finder</h1>
        <div className="favorites-badge">
          Favorites ❤️: {favorites.length}
        </div>
      </header>

      {/* SEARCH BAR & FILTER */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Search ingredient (e.g., beef, pasta)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="primary-btn">
            Search
          </button>
        </form>

        <label className="veg-toggle">
          <input
            type="checkbox"
            checked={showVegOnly}
            onChange={(e) => setShowVegOnly(e.target.checked)}
          />
          🌿 Vegetarian Only
        </label>
      </div>

      {/* CONDITIONAL RENDERING */}
      {isLoading ? (
        <div className="status-message">Loading tasty recipes... ⏳</div>
      ) : recipes.length === 0 ? (
        <div className="status-message">No recipes found. Try searching for something else! 🍽️</div>
      ) : (
        <div className="recipe-grid">
          
          {/* LIST RENDERING WITH MAP */}
          {recipes
            .filter((recipe) => (showVegOnly ? recipe.strCategory === 'Vegetarian' : true))
            .map((recipe) => {
              
              const isFavorite = favorites.some((fav) => fav.idMeal === recipe.idMeal);
              const isExpanded = expandedId === recipe.idMeal;

              return (
                <div key={recipe.idMeal} className="recipe-card">
                  <img src={recipe.strMealThumb} alt={recipe.strMeal} className="recipe-image" />
                  <h3 className="recipe-title">{recipe.strMeal}</h3>
                  
                  <div className="button-group">
                    <button 
                      onClick={() => toggleFavorite(recipe)} 
                      className={`action-btn ${isFavorite ? 'fav-active' : ''}`}
                    >
                      {isFavorite ? 'Unfavorite 💔' : 'Favorite ❤️'}
                    </button>
                    <button 
                      onClick={() => toggleDetails(recipe.idMeal)} 
                      className="action-btn"
                    >
                      {isExpanded ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>

                  {/* NESTED CONDITIONAL RENDERING - FULL INSTRUCTIONS */}
                  {isExpanded && (
                    <div className="recipe-details">
                      <p className="recipe-category"><strong>Category:</strong> {recipe.strCategory}</p>
                      <h4>Instructions:</h4>
                      <p className="recipe-instructions">{recipe.strInstructions}</p>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default App;