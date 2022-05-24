import '@logseq/libs';

const main = () => {

    const isSolarizedLoadedClass = 'is-solarized-extended-loaded';
    const isTabsLoadedClass = 'is-tabs-loaded';
    const isSearchOpenedClass = 'is-search-opened';
    const isToolbarReorderedClass = 'is-toolbar-reordered';

    // Theme init
    const doc = parent.document;
    const body = doc.body;
    let contentContainer;
    body.classList.add(isSolarizedLoadedClass);

    // Reposition Search and arrows on toolbar
    if (!body.classList.contains(isToolbarReorderedClass)) {
        // avoid reposition twice
        const head = doc.getElementById('head');
        const leftToolbar = head.querySelector('.l');
        const rightToolbar = head.querySelector('.r');
        const search = doc.getElementById('search-button');
        rightToolbar.insertAdjacentElement('afterbegin', search);
        body.classList.add(isToolbarReorderedClass);
    }

    // Detect Search popup viewer opened/closed and toggle CSS flag `is-search-opened`
    const popupContainer = doc.querySelector('.ui__modal');
    const searchToggleObserverConfig = {
        attributes: true,
        attributeFilter: ['style']
    };
    const searchToggleCallback = (mutationsList, observer) => {
        const searchPopup = popupContainer.querySelector('.search-results-wrap');
        if (searchPopup) {
            body.classList.add(isSearchOpenedClass);
        } else {
            body.classList.remove(isSearchOpenedClass);
        }
    };
    const searchToggleObserver = new MutationObserver(searchToggleCallback);
    searchToggleObserver.observe(popupContainer, searchToggleObserverConfig);

    // Observe plugins iframes
    // & add styles to TabsPlugin
    const injectCssToPlugin = (iframeEl: HTMLIFrameElement, cssName: string) => {
        const tabsPluginDocument = iframeEl.contentDocument;
        tabsPluginDocument.getElementsByTagName('head')[0].insertAdjacentHTML(
            "beforeend",
            `<link rel='stylesheet' href='../../logseq-solarized-extended-theme/dist/${cssName}.css' />`
        );
        console.log(`SolExt: plugins css inject - ${iframeEl.id}`);
        if (doc.documentElement.classList.contains('is-mac')) {
            tabsPluginDocument.body.classList.add('is-mac');
        }
    }
    const tabPluginConnect = () => {
        const tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
        if (tabsPluginIframe) {
            setTimeout(() => {
                injectCssToPlugin(tabsPluginIframe, 'tabsPlugin');
                body.classList.add(isTabsLoadedClass);
            }, 500);
        }
    }
    const tabsPluginDisconnect = () => {
        body.classList.remove(isTabsLoadedClass);
    }
    const observePluginsIframes = () => {
        const pluginsIframesObserverConfig = {
            childList: true,
        };
        const pluginsIframesCallback = function (mutationsList, observer) {
            console.log('SolExt: plugins mutation');
            if (mutationsList[0].addedNodes[0] && mutationsList[0].addedNodes[0].id == 'logseq-tabs_lsp_main') {
                tabPluginConnect();
            }
            if (mutationsList[0].removedNodes[0] && mutationsList[0].removedNodes[0].id == 'logseq-tabs_lsp_main') {
                tabsPluginDisconnect();
            }
        };
        const pluginsIframeObserver = new MutationObserver(pluginsIframesCallback);
        pluginsIframeObserver.observe(doc.body, pluginsIframesObserverConfig);
    }

    // First init run
    const tabsPluginOnLoad = () => {
        const tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
        if (tabsPluginIframe) {
            injectCssToPlugin(tabsPluginIframe, 'tabsPlugin');
            body.classList.add(isTabsLoadedClass);
            observePluginsIframes();
        }
    }
    tabsPluginOnLoad();

    // External links favicons
    const setFavicon = (extLinkEl: HTMLAnchorElement) => {
        const oldFav = extLinkEl.querySelector('.external-link-img');
        if (oldFav) {
            oldFav.remove();
        }
        const { hostname } = new URL(extLinkEl.href);
        const faviconValue = `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
        const fav = doc.createElement('img');
        fav.src = faviconValue;
        fav.classList.add('external-link-img');
        extLinkEl.insertAdjacentElement('afterbegin', fav);
    }

    // First init run
    const setFaviconsOnLoad = () => {
        setTimeout(() => {
            const extLinkList: NodeListOf<HTMLAnchorElement> = doc.querySelectorAll('.external-link');
            for (let i = 0; i < extLinkList.length; i++) {
                setFavicon(extLinkList[i]);
            }
            extLinksObserver.observe(appContainer, extLinksObserverConfig);
        }, 500);
    }
    setFaviconsOnLoad();

    const appContainer = doc.getElementById('app-container');
    const extLinksObserverConfig = { childList: true, subtree: true };
    const extLinksCallback = function (mutationsList, observer) {
        for (let i = 0; i < mutationsList.length; i++) {
            const addedNode = mutationsList[i].addedNodes[0];
            if (addedNode && addedNode.childNodes.length) {
                const extLinkList = addedNode.querySelectorAll('.external-link');
                if (extLinkList.length) {
                    extLinksObserver.disconnect();
                    for (let i = 0; i < extLinkList.length; i++) {
                        setFavicon(extLinkList[i]);
                    }
                    extLinksObserver.observe(appContainer, extLinksObserverConfig);
                }
            }
        }
    };
    const extLinksObserver = new MutationObserver(extLinksCallback);

};
logseq.ready(main).catch(console.error);
