/*
*       Button eventlisteners
*/
let previousButton = document.querySelector('#previousList');
let nextButton = document.querySelector('#nextList');

previousButton.addEventListener('click', () => loadPokemons(false));
nextButton.addEventListener('click', () => loadPokemons(true));

function getFetch(url, func) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Fout");
            }
            return response.json();
        })
        .then(func)
        .catch(showError);
}

function showError(error) {
    console.log(error);
}

function getId(url) {
    return Number(url.split('/').filter(Boolean).pop());
}

/*
*       Fetch Pokemons
*/
let offset = 0;

function loadPokemons(next) {
    if (next) {
        offset = offset + 20;
    } else {
        if (offset > 0) {
            offset = offset - 20;
        }
    }

    let url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`;
    getFetch(url, showPokemons);
}

function showPokemons(data) {
    const pokemons = data.results;
    const pokemonList = document.querySelector('#pokemonList');

    pokemonList.innerHTML = '';

    pokemons.forEach(pokemon => {
        let id = getId(pokemon.url);

        let li = document.createElement('li');
        li.setAttribute('id', `pokemonContainer-${id}`);

        let img = document.createElement('img');
        img.setAttribute('src', `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`);
        img.setAttribute('alt', pokemon.name);

        let h3 = document.createElement('h3');
        h3.textContent = pokemon.name;

        let span = document.createElement('span');
        span.textContent = id;

        // let audio = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`);
        // audio.play();

        li.appendChild(img);
        li.appendChild(h3);
        li.appendChild(span);

        li.addEventListener('click', () => loadPokemon(id));

        pokemonList.appendChild(li);
    });
}

/*
*       Fetch Pokemon
*/
function loadPokemon(pokemonId) {
    if (pokemonId > 0) {
        let url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
        getFetch(url, showPokemon);
    }
}

function showPokemon(data) {
    console.log(data);

    const audio = new Audio(data.cries.legacy);
    audio.play();

    const details = document.querySelector('#pokemonDetails');
    details.innerHTML = `
        <h2>${data.name}</h2>
        <p>ID: ${data.id}</p>
        <img src="${data.sprites.front_default}" alt="${data.name}">
    `;
}

/*
*       Load pokemon when page loads
*/
window.onload = function() {
    loadPokemons(false);
};