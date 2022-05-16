import '@logseq/libs';

const main = () => {
    const isSolarizedLoadedClass = 'solarized-extended-loaded';
    const isSearchOpenedClass = 'is-search-opened';
    const isPDFOpenedClass = 'is-pdf-opened';
    const isToolbarReorderedClass = 'is-toolbar-reordered';

    // Theme init
    const body = parent.document.body;
    if (!body.classList.contains(isSolarizedLoadedClass)) {
        body.classList.add(isSolarizedLoadedClass);
     }

    // Reposition Search and arrows on toolbar
    if (!body.classList.contains(isToolbarReorderedClass)) {
        // avoid reposition twice
        const head = parent.document.getElementById('head');
        const leftToolbar = head.querySelector('.l');
        const rightToolbar = head.querySelector('.r');
        const search = leftToolbar.querySelector('div:nth-child(2)');
        rightToolbar.insertAdjacentElement('afterbegin', search);
        body.classList.add(isToolbarReorderedClass);
    }

    // Detect Search popup viewer opened/closed and toggle CSS flag `is-search-opened`
    const popupContainer = parent.document.querySelector('.ui__modal');
    const searchToggleObserverConfig = {
        attributes: true,
        attributeFilter: ['style']
    };
    const searchToggleCallback = function (mutationsList, observer) {
        const searchPopup = popupContainer.querySelector('.search-results-wrap');
        if (searchPopup) {
            body.classList.add(isSearchOpenedClass);
        } else {
            body.classList.remove(isSearchOpenedClass);
        }
    };
    const searchToggleObserver = new MutationObserver(searchToggleCallback);
    searchToggleObserver.observe(popupContainer, searchToggleObserverConfig);

};
logseq.ready(main).catch(console.error);
