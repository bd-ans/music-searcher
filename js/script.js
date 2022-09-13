const musicsList = $('.js-music-list');
const musicsCardTemplate = $('#template-element').content;

const elSearchInput = $('.js-search-input');
const elSearchBtn = $('.js-search-btn');
const elFailTxt = $('.js-fail-txt');

let arr = [];

// render function
function mainFunc() {
    // creating elements for music list
    let createMusicElements = function (arr) {
        let musicElement = musicsCardTemplate.cloneNode(true);
        musicElement.querySelector('.js-music-img').src = `https://api.napster.com/imageserver/v2/albums/${arr.albumId}/images/300x300.jpg`;
        musicElement.querySelector('.js-music-img').alt = arr.name;
        musicElement.querySelector('.js-modal-music-img').src = `https://api.napster.com/imageserver/v2/albums/${arr.albumId}/images/300x300.jpg`;
        musicElement.querySelector('.js-modal-music-img').alt = arr.name;

        musicElement.querySelector('.js-music-title').textContent = arr.name;
        musicElement.querySelector('.js-modal-title').textContent = arr.name;
        musicElement.querySelector('.js-music-artist-name').textContent = arr.artistName;
        musicElement.querySelector('.js-music-album-name').textContent = arr.albumName;

        musicElement.querySelector('.audio').src = arr.previewURL;
        musicElement.querySelector('.js-music-disc').textContent = arr.disc;
        musicElement.querySelector('.js-music-playback').textContent = arr.playbackSeconds;
        musicElement.querySelector('.js-music-shortcuts').textContent = arr.shortcut;
        musicElement.querySelector('.js-music-explicits').textContent = arr.isExplicit;
        musicElement.querySelector('.js-music-hires').textContent = arr.isAvailableInHiRes;

        let formats = [];
        arr.formats.forEach((item, i) => {
            formats.push(item.name);
        });
        musicElement.querySelector('.js-music-formats').textContent = formats.join(', ');
        musicElement.querySelector('.js-modal').id = `exampleModal${arr.index}`;
        musicElement.querySelector('.js-modal-title').id = `exampleModal${arr.index}`;
        musicElement.querySelector('.js-modal-btn').setAttribute('data-bs-target', `#exampleModal${arr.index}`);

        return musicElement;
    }

    // render function
    let renderMusics = function (arr) {
        musicsList.innerHTML = null;
        let fragment = document.createDocumentFragment();
    
        arr.forEach(music => {
            fragment.appendChild(createMusicElements(music));
        });
        
        musicsList.appendChild(fragment);
    }
    
    renderMusics(arr);
    if (arr.length === 0) {
        elFailTxt.classList.remove('d-none');
    } else {
        elFailTxt.classList.add('d-none');
    }
}

// api request
const searchMusics = async music => {
    try {
        const urlApi = await fetch(`https://api.napster.com/v2.2/search?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&query=${music}&type=track`);
        const data = await urlApi.json();
        
        if (data.status === 404) {
            arr = [];
            elFailTxt.classList.remove('d-none');
            return;
        } else {
            elSearchInput.blur();
            elFailTxt.classList.add('d-none');
            arr = data.search.data.tracks;
            mainFunc();
        }
    } catch (err) {
        console.log(err);
    } finally {
        elSearchInput.value = '';
            elSearchBtn.disabled = false;
            elSearchBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>`;
    }
}

// Search input enter
elSearchInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        elSearchBtn.click();
    }
});

// Search btn click
elSearchBtn.onclick = function () {
    let value = elSearchInput.value.toLowerCase().trim();
    if (value === '') {
        elSearchInput.value = null;
        return;
    } else {
    musicsList.innerHTML = null;
    arr = [];
    elSearchBtn.disabled = true;
    elSearchBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

    searchMusics(value)
    }
}