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
}

// api request
function searchMovies(event) {
    let urlApi = `https://api.napster.com/v2.2/search?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&query=${event}&type=track`;

    setTimeout(() => {
        countryList.innerHTML = null;
        mainFunc();
    }, 1000);
    
    fetch(urlApi)
    .then(response => response.json())
    .catch(err => console.log(err))
    .then(data => {
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
    })
}

// searchMovies();
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
    searchInput.value = null;
    // searchInput.blur();

    searchMovies(value)
    }
}

// const request = fetch('https://api.napster.com/v2.2/search?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&query=love&type=artist').
//   then(res => res.json()).
//   then(data => console.log(data));
