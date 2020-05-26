const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const showsList = document.querySelector('.tv-shows__list');

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

// --------------------- ДЗ ---------------------------
const rotate = e => {
    const target = e.target;
    if (target.closest('.tv-card__img')) {
        const backdrop = target.dataset.backdrop;
        const src = target.src;
        if (backdrop) {
            target.src = backdrop;
            target.dataset.backdrop = src;
        }
    }
};
showsList.addEventListener('mouseover', e => rotate(e));
showsList.addEventListener('mouseout', e => rotate(e));