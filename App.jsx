import { useState, useEffect } from "react";
import PokemonCard from "./PokemonCard";

function App() {
  // ----- STATE (data that can change) -----
  const [pokemon, setPokemon] = useState([]);       // list from the API
  const [loading, setLoading] = useState(true);     // true while fetching
  const [error, setError] = useState("");           // error message
  const [search, setSearch] = useState("");         // text in search box
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Favorites: start with what is saved in localStorage (or empty list)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // ----- FETCH DATA FROM THE API (runs once when the page opens) -----
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=50")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        return response.json();
      })
      .then((data) => {
        // Turn the API data into a simple list with id, name, image
        const list = data.results.map((item) => {
          const id = item.url.split("/")[6]; // get the number from the url
          return {
            id: Number(id),
            name: item.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          };
        });
        setPokemon(list);
        setLoading(false);
      })
      .catch(() => {
        setError("Something went wrong. Please try again later.");
        setLoading(false);
      });
  }, []);

  // ----- SAVE FAVORITES to localStorage whenever they change -----
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // ----- ADD or REMOVE a favorite -----
  function toggleFavorite(id) {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id)); // remove
    } else {
      setFavorites([...favorites, id]); // add
    }
  }

  // ----- SEARCH + FILTER -----
  const visiblePokemon = pokemon
    .filter((p) => p.name.includes(search.toLowerCase()))
    .filter((p) => (showFavoritesOnly ? favorites.includes(p.id) : true));

  // ----- WHAT THE USER SEES -----
  return (
    <div className="app">
      <h1>Pokémon App</h1>

      <input
        type="text"
        placeholder="Search pokemon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <label className="checkbox">
        <input
          type="checkbox"
          checked={showFavoritesOnly}
          onChange={(e) => setShowFavoritesOnly(e.target.checked)}
        />
        Show favorites only ({favorites.length})
      </label>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && visiblePokemon.length === 0 && (
        <p>No pokemon found.</p>
      )}

      <div className="grid">
        {visiblePokemon.map((p) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            isFavorite={favorites.includes(p.id)}
            onToggle={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
