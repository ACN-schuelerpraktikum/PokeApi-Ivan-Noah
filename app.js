const baseUrl = "https://pokeapi.co/api/v2/pokemon/";

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("resultSize").value = 1; 
  fetchData();
});

async function fetchData() {
  const resultSize = document.getElementById("resultSize").value;
  
  clearContainer();

  const pokemonList = [];

  try {
    for (let i = 0; i < resultSize; i++) {
      const randomId = Math.floor(Math.random() * 1025) + 1;
      const response = await fetch(`${baseUrl}${randomId}`);
      const data = await response.json();
      pokemonList.push(data);
    }

    displayPokemonCards(pokemonList);

  } catch (error) {
    console.error(`Fehler beim Laden der Pokémon: ${error.message}`);
    alert(`Fehler beim Laden der Pokémon: ${error.message}`);
  }
}

async function searchPokemon() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase().trim();

  if (!searchValue) {
    alert("Bitte gib einen Pokémon-Namen oder eine ID ein!");
    return;
  }

  clearContainer();

  try {
    const response = await fetch(`${baseUrl}${searchValue}`);

    if (!response.ok) {
      alert(`Pokémon "${searchValue}" wurde nicht gefunden!`);
      return;
    }

    const data = await response.json();
    displayPokemonCards([data]);

  } catch (error) {
    console.error(`Fehler bei der Suche: ${error.message}`);
    alert(`Fehler bei der Suche: ${error.message}`);
  }
}

function clearContainer() {
  const container = document.getElementById("pokemonContainer");
  container.innerHTML = "";
}

function displayPokemonCards(pokemons) {
  const container = document.getElementById("pokemonContainer");

  if (!Array.isArray(pokemons) || pokemons.length === 0) {
    container.innerHTML = "<p>Keine Pokémon gefunden.</p>";
    return;
  }

  pokemons.forEach(pokemon => {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = pokemon.sprites.front_default || "";
    img.alt = pokemon.name;

    const name = document.createElement("h3");
    name.textContent = capitalize(pokemon.name);

    const id = document.createElement("p");
    id.textContent = `ID: ${pokemon.id}`;

    const height = document.createElement("p");
    height.textContent = `Größe: ${pokemon.height / 10} m`;

    const weight = document.createElement("p");
    weight.textContent = `Gewicht: ${pokemon.weight / 10} kg`;

    const types = pokemon.types.map(t => capitalize(t.type.name)).join(", ");
    const typesText = document.createElement("p");
    typesText.textContent = `Typ(en): ${types}`;

    const abilities = pokemon.abilities.map(a => capitalize(a.ability.name)).join(", ");
    const abilitiesText = document.createElement("p");
    abilitiesText.textContent = `Fähigkeiten: ${abilities}`;

   
    const formsButton = document.createElement("button");
    formsButton.textContent = "Formulare anzeigen";
    formsButton.addEventListener("click", () => showFormsById(pokemon.id, card));

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(id);
    card.appendChild(height);
    card.appendChild(weight);
    card.appendChild(typesText);
    card.appendChild(abilitiesText);
    card.appendChild(formsButton);

    container.appendChild(card);
  });
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

async function showFormsById(id, parentCard) {

  const existingForms = parentCard.querySelector(".forms-container");
  if (existingForms) {
    existingForms.remove();
  }

  const formsContainer = document.createElement("div");
  formsContainer.classList.add("forms-container");

  const title = document.createElement("h4");
  title.textContent = "Die Formen dieses Pokémon sind:";
  formsContainer.appendChild(title);

  
  let relatedIds = [];

  if (id % 3 === 0) {
    relatedIds = [id - 1, id - 2];
  } else if (id % 3 === 1) {
    relatedIds = [id + 1, id + 2];
  } else if (id % 3 === 2) {
    relatedIds = [id - 1, id + 1];
  }

  
  relatedIds = relatedIds.filter(newId => newId > 0 && newId <= 1025);

  if (relatedIds.length === 0) {
    const noForms = document.createElement("p");
    noForms.textContent = "Keine Formulare verfügbar.";
    formsContainer.appendChild(noForms);
    parentCard.appendChild(formsContainer);
    return;
  }

  
  for (let relatedId of relatedIds) {
    try {
      const response = await fetch(`${baseUrl}${relatedId}`);
      if (!response.ok) continue;

      const formData = await response.json();

      const formDiv = document.createElement("div");
      formDiv.classList.add("form-item");

      const formImg = document.createElement("img");
      formImg.src = formData.sprites.front_default || "";
      formImg.alt = formData.name;

      const formName = document.createElement("p");
      formName.textContent = `ID: ${formData.id} - ${capitalize(formData.name)}`;

      formDiv.appendChild(formImg);
      formDiv.appendChild(formName);
      formsContainer.appendChild(formDiv);

    } catch (error) {
      console.error(`Fehler beim Laden des ID-Formulars ${relatedId}: ${error.message}`);
    }
  }

  parentCard.appendChild(formsContainer);
}
