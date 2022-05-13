import '@logseq/libs';

const main = () => {
    const isSearchOpenedClass = 'is-search-opened';
    const isToolbarReorderedClass = 'is-toolbar-reordered';

    // Theme init
    const body = parent.document.body;
    body.classList.add('solarized-extended-loaded');


    // Reposition Search and arrows on toolbar
    if (!body.classList.contains(isToolbarReorderedClass)) {
        // avoid reposition twice
        const head = parent.document.getElementById('head');
        const leftToolbar = head.querySelector('.l');
        const rightToolbar = head.querySelector('.r');
        const search = leftToolbar.querySelector('div:nth-child(2)');
        const arrows = rightToolbar.querySelector('.flex');
        leftToolbar.insertAdjacentElement('beforeend', arrows);
        rightToolbar.insertAdjacentElement('afterbegin', search);
        body.classList.add(isToolbarReorderedClass);
    }


    // Detect search popup opened/closed and toggle CSS flag `is-search-opened`
    // Catch Search opened
    const popupContainer = parent.document.querySelector('.ui__modal-panel');
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

};
logseq.ready(main).catch(console.error);
