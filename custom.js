// Theme init
const body = document.body;
body.classList.add('solarized-extended-theme');

// Detect search popup opened/closed and toggle CSS flag `is-search-opened`

const isSearchOpenedClass = 'is-search-opened';
// Catch Search opened
const popupContainer = document.querySelector('.ui__modal-panel');
const observerOpen = new MutationObserver(function () {
    const searchPopup = popupContainer.querySelector('.search-results-wrap');
    if (searchPopup) {
        body.classList.add(isSearchOpenedClass);
        this.disconnect();
        observerClose.observe(popupContainer, { childList: true });
    }
});
observerOpen.observe(popupContainer, { attributes: true });
// Catch Search closed
const observerClose = new MutationObserver(function () {
    body.classList.remove(isSearchOpenedClass);
    this.disconnect();
    observerOpen.observe(popupContainer, { attributes: true });
});
