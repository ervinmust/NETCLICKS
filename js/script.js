const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const showsList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const tvShows = document.querySelector('.tv-shows');
const tvCardImg = document.querySelector('.tv-card__img');
const modalTitle = document.querySelector('.modal__title');
const genresList = document.querySelector('.genres-list');
const rating = document.querySelector('.rating');
const description = document.querySelector('.description');
const modalLink = document.querySelector('.modal__link');
const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');

const loading = document.createElement('div');
loading.className = 'loading';

const IMG_PATH = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = 'b572b2281c64cd5b4272f2a6367179ad';
const API_URL = 'https://api.themoviedb.org/3/';


// работа с API
const DBService = class {
    
    getData = async url => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные ${url}`);
        }
    }

    // поиск
    getSearchResult = query => {
        return this.getData(`${API_URL}search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`);
    }

    // информация о выбранном сериале
    getTvShow = id => {
        return this.getData(`${API_URL}tv/${id}?api_key=${API_KEY}&language=ru-RU`);
    }
}

// отображение списка карточек
const renderCards = res => {
    
    showsList.textContent = '';
    res.results.forEach(({
        id, name, poster_path: poster, backdrop_path: backdrop, vote_average: vote
    }) => {
        poster = poster ? IMG_PATH + poster : 'img/no-poster.jpg';
        backdrop = backdrop ? IMG_PATH + backdrop : '';
        vote = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

        const card = document.createElement('li');
        card.className = 'tv-shows__item';
        card.innerHTML = `
        <a href="#" class="tv-card">
            ${vote}
            <img class="tv-card__img"
                src="${poster}"
                data-backdrop="${backdrop}"
                data-id="${id}"
                alt="${name}">
            <h4 class="tv-card__head">${name}</h4>
        </a>        
        `;
        
        showsList.append(card);
    });

    if (!res.results.length) {
        showsList.innerHTML = `<div><h3 style="text-align: center">Ничего не найдено...</h3><br/><img src="img/not_found.jpg" class="not_found" alt="" /></div>`;
    }

    loading.remove();
}

//поиск
searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const value = searchFormInput.value.trim();

    if (value) {
        searchFormInput.value = '';
        tvShows.append(loading);
        new DBService().getSearchResult(value).then(renderCards);
    }
});

// меню
const menu = () => {
    // открытие/закрытие меню при клике на гамбургер
    hamburger.addEventListener('click', () => {
        leftMenu.classList.toggle('openMenu');
        hamburger.classList.toggle('open');
    });

    // закрытие меню, при клике вне меню
    document.body.addEventListener('click', e => {
        e.preventDefault();
        if (!e.target.closest('.left-menu')) {
            leftMenu.classList.remove('openMenu');
            hamburger.classList.remove('open');        
        }
    });

    // автоматическое открытие подменю
    leftMenu.addEventListener('click', e => {
        const target = e.target;
        const dropdown = target.closest('.dropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
            leftMenu.classList.add('openMenu');
            hamburger.classList.add('menu');
        }
    });
}

menu();

// смена карточки
const rotate = e => {
    const target = e.target;
    if (target.closest('.tv-card__img')) {
        if (target.dataset.backdrop) {
            [target.dataset.backdrop, target.src] = [target.src, target.dataset.backdrop]
        }
    }
};
showsList.addEventListener('mouseover', e => rotate(e));
showsList.addEventListener('mouseout', e => rotate(e));

// открытие модального окна
showsList.addEventListener('click', e => {
    tvShows.append(loading);
    const target = e.target;
    if (target.closest('.tv-card')) {
        new DBService()
            .getTvShow(target.dataset.id)
            .then(res => {
                console.log(res);
                tvCardImg.src = IMG_PATH + res.poster_path;
                modalTitle.textContent = res.name;
                genresList.innerHTML = res.genres.reduce((acc, {name}) => `${acc} <li>${name}</li>`, '');
                description.textContent = res.overview;
                modalLink.href = res.homepage;
                rating.textContent = res.vote_average;
            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
                loading.remove();
            });


    }
});

// закрытие модального окна
modal.addEventListener('click', e => {
    if (
        e.target.classList.contains('modal') || 
        e.target.closest('.cross')
    ) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});
