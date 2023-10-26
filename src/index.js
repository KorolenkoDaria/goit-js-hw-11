import { fetchBreeds, fetchCatByBreed } from './js/cat-api';
import Notiflix from 'notiflix';

const refs = {
    select: document.querySelector('.breed-select'),
    catDescription: document.querySelector('.cat-info'),
    loader:document.querySelector('.loader')
};

refs.loader.textContent = '';

refs.select.addEventListener('change', onChange);

switchLoader('none');

function fetchData() {
    switchLoader('block');

    fetchBreeds()
        .then(data => {       
            refs.select.innerHTML = renderOptions(data);              
        })
        .catch(onError)
        .finally(() => switchLoader('none'));
}

fetchData();

function renderOptions(data) {
    const result = data.map(
        ({ id, name }) => `<option value="${id}">${name}</option>`
    );
    return result
}


function onChange(evt) {
    switchLoader('block');
    refs.catDescription.style.display = 'none';
    const breedId = evt.target.value;
    fetchCatByBreed(breedId)
        .then(data => {
            refs.catDescription.style.display = 'flex';
            renderCard(data);
        })
        .catch(onError) 
        .finally(() => switchLoader('none'));
    };

function renderCard(breed) {
    const { url } = breed;
    const { name, description, temperament } = breed.breeds[0];
    switchLoader('none');
    refs.catDescription.innerHTML = 
    `<div class="wrap-foto" style="background-image:url(${url})"></div>
    <div class="wrap-description">
      <h2 class="title">${name}</h2>
      <p class="description">${description}</p>
      <p class="temperament"><strong>Temperament:</strong> ${temperament}</p>
    </div>`;
};

function onError() {
    Notiflix.Notify.failure('❌ Oops! Something went wrong! Try reloading the page!');
};

function switchLoader(value) {
    refs.loader.style.display = value === "block" ? "block" : "none";
}
