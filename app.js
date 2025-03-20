// Basis-URL für die PokeAPI
const baseUrl = "https://pokeapi.co/api/v2/pokemon";

const cardContainer = document.getElementById('pokemonCard');
const searchInput = document.getElementById('searchInput');

// Beim Laden der Seite einen zufälligen Pokémon anzeigen
window.onload = () => {
  getRandomPokemon();
};

// Event-Listener hinzufügen, um die Enter-Taste im Suchfeld zu erkennen
searchInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    searchPokemon();
  }
});

// Funktion, um einen zufälligen Pokémon zu laden
async function getRandomPokemon() {
  const randomId = Math.floor(Math.random() * 898) + 1; // IDs von 1 bis 898
  await fetchPokemon(randomId);
}

// Funktion, um Pokémon anhand von Name oder ID zu suchen
async function searchPokemon() {
  const query = searchInput.value.trim().toLowerCase(); // Eingabewert bereinigen
  if (!query) {
    alert("Bitte gib einen Pokémon-Namen oder eine ID ein!");
    return;
  }

  await fetchPokemon(query);
}

// Funktion, um Daten von der PokeAPI zu holen
async function fetchPokemon(pokemon) {
  try {
    const response = await fetch(`${baseUrl}/${pokemon}`);
    if (!response.ok) {
      throw new Error("Pokémon wurde nicht gefunden!");
    }

    const data = await response.json();
    renderPokemonCard(data);
  } catch (error) {
    cardContainer.innerHTML = `<p>${error.message}</p>`;
  }
}

// Funktion, um die Pokémon-Karte im HTML anzuzeigen
function renderPokemonCard(pokemon) {
  const abilitiesList = pokemon.abilities
    .map(ability => `<li>${capitalize(ability.ability.name)}</li>`)
    .join('');

  cardContainer.innerHTML = `
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <h2>${capitalize(pokemon.name)}</h2>
    <p><strong>ID:</strong> ${pokemon.id}</p>
    <p><strong>Größe:</strong> ${pokemon.height / 10} m</p>
    <p><strong>Gewicht:</strong> ${pokemon.weight / 10} kg</p>
    <div>
      <strong>Fähigkeiten:</strong>
      <ul class="abilities">${abilitiesList}</ul>
    </div>
  `;
}

// Funktion, um den ersten Buchstaben großzuschreiben
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
