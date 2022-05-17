import '@logseq/libs';

const main = () => {
    const isSolarizedLoadedClass = 'is-solarized-extended-loaded';
    const isTabsLoadedClass = 'is-tabs-loaded';
    const isSearchOpenedClass = 'is-search-opened';
    const isToolbarReorderedClass = 'is-toolbar-reordered';

    // Theme init
    const doc = parent.document;
    const body = doc.body;
    body.classList.add(isSolarizedLoadedClass);
    if (parent.document.getElementById('logseq-tabs_lsp_main')) {
        body.classList.add(isTabsLoadedClass);
    }

    // Reposition Search and arrows on toolbar
    if (!body.classList.contains(isToolbarReorderedClass)) {
        // avoid reposition twice
        const head = doc.getElementById('head');
        const leftToolbar = head.querySelector('.l');
        const rightToolbar = head.querySelector('.r');
        const search = leftToolbar.querySelector('div:nth-child(2)');
        rightToolbar.insertAdjacentElement('afterbegin', search);
        body.classList.add(isToolbarReorderedClass);
    }

    // Detect Search popup viewer opened/closed and toggle CSS flag `is-search-opened`
    const popupContainer = doc.querySelector('.ui__modal');
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

    // Add styles to TabsPlugin
    const tabsPluginDocument = parent.document.getElementById('logseq-tabs_iframe').contentDocument;
    tabsPluginDocument.getElementsByTagName('head')[0].insertAdjacentHTML(
        "beforeend",
        "<link rel='stylesheet' href='../../logseq-solarized-extended-theme/dist/tabsPlugin.css' />"
    );

};
logseq.ready(main).catch(console.error);
