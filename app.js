const baseUrl = "https://pokeapi.co/api/v2/pokemon/";


window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("resultSize").value = 1; 
  fetchData(); 
});

async function fetchData() {
  let resultSize = document.getElementById("resultSize").value;
  
  clearTable();

  const pokemonList = [];

  try {
    for (let i = 0; i < resultSize; i++) {
      const randomId = Math.floor(Math.random() * 1025) + 1;
      const response = await fetch(`${baseUrl}${randomId}`);
      const data = await response.json();
      pokemonList.push(data);
    }

    displayResults(pokemonList);

  } catch (error) {
    console.error(`Ошибка при получении данных: ${error.message}`);
    window.alert(`Ошибка при получении данных: ${error.message}`);
  }
}

function clearTable() {
  const table = document.getElementById("usersTable");
  table.innerHTML = "";
}

function displayResults(results) {
  if (!Array.isArray(results) || results.length === 0) {
    const para = document.createElement("p");
    para.innerHTML = "Keine Pokémon gefunden.";
    document.getElementById("usersTable").appendChild(para);
    return;
  }

  const headerRow = document.createElement("tr");
  const headers = ["Bild", "Name", "Größe", "Gewicht", "Typ(en)"];
  
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.innerText = headerText;
    headerRow.appendChild(th);
  });

  document.getElementById("usersTable").appendChild(headerRow);

  for (const pokemon of results) {
    const rowTable = document.createElement("tr");

    const imgCell = document.createElement("td");
    const img = document.createElement("img");
    img.src = pokemon.sprites.front_default;
    img.alt = pokemon.name;
    img.width = 50;
    imgCell.appendChild(img);
    rowTable.appendChild(imgCell);

    const nameCell = document.createElement("td");
    nameCell.innerHTML = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    rowTable.appendChild(nameCell);

    const heightCell = document.createElement("td");
    heightCell.innerHTML = `${pokemon.height / 10} m`;
    rowTable.appendChild(heightCell);

    const weightCell = document.createElement("td");
    weightCell.innerHTML = `${pokemon.weight / 10} kg`;
    rowTable.appendChild(weightCell);

    const typesCell = document.createElement("td");
    const types = pokemon.types.map(t => t.type.name).join(", ");
    typesCell.innerHTML = types;
    rowTable.appendChild(typesCell);

    document.getElementById("usersTable").appendChild(rowTable);
  }
}
