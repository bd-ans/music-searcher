const countryList = $('.js-country-list');
const moviesCardTemplate = $('#template-element').content;

const searchInput = $('.js-search-input');
const searchSelect = $('.js-search-select');
const searchBtn = $('.js-search-btn');
const elFailTxt = $('.js-fail-txt');

let arr = [];

// render function
function mainFunc() {
    // creating elements for movies list
    let createMovieElement = function (arr) {
        let movieElement = moviesCardTemplate.cloneNode(true);
        movieElement.querySelector('.js-movie-img').src = `https://api.napster.com/imageserver/v2/albums/${arr.albumId}/images/300x300.jpg`;
        movieElement.querySelector('.js-movie-img').alt = arr.name;
        movieElement.querySelector('.js-modal-movie-img').src = `https://api.napster.com/imageserver/v2/albums/${arr.albumId}/images/300x300.jpg`;
        movieElement.querySelector('.js-modal-movie-img').alt = arr.name;

        movieElement.querySelector('.js-country-title').textContent = arr.name;
        movieElement.querySelector('.js-modal-title').textContent = arr.name;
        movieElement.querySelector('.js-country-capital').textContent = arr.artistName;
        movieElement.querySelector('.js-country-population').textContent = arr.albumName;

        movieElement.querySelector('.audio').src = arr.previewURL;
        movieElement.querySelector('.js-country-independent').textContent = arr.disc;
        movieElement.querySelector('.js-country-borders').textContent = arr.playbackSeconds;
        movieElement.querySelector('.js-country-timezones').textContent = arr.shortcut;
        movieElement.querySelector('.js-music-explicits').textContent = arr.isExplicit;
        movieElement.querySelector('.js-music-hires').textContent = arr.isAvailableInHiRes;

        let formats = [];
        arr.formats.forEach((item, i) => {
            formats.push(item.name);
        });
        movieElement.querySelector('.js-country-start-week').textContent = formats.join(', ');
        movieElement.querySelector('.js-modal').id = `exampleModal${arr.index}`;
        movieElement.querySelector('.js-modal-title').id = `exampleModal${arr.index}`;
        movieElement.querySelector('.js-modal-btn').setAttribute('data-bs-target', `#exampleModal${arr.index}`);

        return movieElement;
    }

    // render function
    let renderCountries = function (arr) {
        countryList.innerHTML = null;
        let fragment = document.createDocumentFragment();
    
        arr.forEach(movie => {
            fragment.appendChild(createMovieElement(movie));
        });
        
        countryList.appendChild(fragment);
    }
    
    renderCountries(arr);
    if (arr.length === 0) {
        elFailTxt.classList.remove('d-none');
    } else {
        elFailTxt.classList.add('d-none');
    }
}

// api request
const searchMovies = async music => {
    try {
        const urlApi = await fetch(`https://api.napster.com/v2.2/search?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&query=${music}&type=track`);
        const data = await urlApi.json();
        
        if (data.status === 404) {
            arr = [];
            elFailTxt.classList.remove('d-none');
            return;
        } else {
            searchInput.blur();
            elFailTxt.classList.add('d-none');
            arr = data.search.data.tracks;
            mainFunc();
        }
    } catch (err) {
        console.log(err);
    } finally {
        searchInput.value = '';
            searchBtn.disabled = false;
            searchBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>`;
    }
}

// Search input enter
searchInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});

// Search btn click
searchBtn.onclick = function () {
    let value = searchInput.value.toLowerCase().trim();
    if (value === '') {
        searchInput.value = null;
        return;
    } else {
    countryList.innerHTML = null;
    arr = [];
    searchBtn.disabled = true;
    searchBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

    searchMovies(value)
    }
}