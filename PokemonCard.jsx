// A small component that shows ONE pokemon.
// It receives data through "props": pokemon, isFavorite, onToggle.
function PokemonCard({ pokemon, isFavorite, onToggle }) {
  return (
    <div className="card">
      <img src={pokemon.image} alt={pokemon.name} />
      <h3>{pokemon.name}</h3>
      <button onClick={() => onToggle(pokemon.id)}>
        {isFavorite ? "❤️ Remove" : "🤍 Favorite"}
      </button>
    </div>
  );
}

export default PokemonCard;
