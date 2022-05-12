// Detect search popup opened/closed and toggle CSS flag `is-search-opened`
const isSearchOpenedClass = 'is-search-opened';
const body = document.body;
const popupContainer = document.querySelector('.ui__modal');
const observer = new MutationObserver(function () {
    const searchPopup = document.querySelector('.search-results-wrap');
    if(searchPopup){
        body.classList.add(isSearchOpenedClass);
    } else {
        body.classList.remove(isSearchOpenedClass);
    }
});
observer.observe(popupContainer, { subtree: true, childList: true });
