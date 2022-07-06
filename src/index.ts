import '@logseq/libs';
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";

let isSolarizedActive = false;
const pluginID = 'solarized-extended';
const isSolarizedLoadedClass = 'is-solext-loaded';
const isSolarizedActiveClass = 'is-solext-active';
const isTabsLoadedClass = 'is-tabs-loaded';
const isSearchOpenedClass = 'is-search-opened';
const isToolbarReorderedClass = 'is-toolbar-reordered';
const headersSelector = `.page-blocks-inner > div > div > div > div > div > div > .ls-block:not([haschild='']):not([data-refs-self='["quote"]']):not([data-refs-self='["card"]']):not(.pre-block) > .flex-row`;
let doc;
let body;
let popupContainer;
let appContainer;
let mainContainer;
let toolbar;
let leftToolbar;
let rightToolbar;
let search;

// Theme is active observer
let themeObserver, themeObserverConfig;
const initThemeObserver = () => {
    themeObserverConfig = { childList: true };
    const themeCallback = function (mutationsList, observer) {
        for (let i = 0; i < mutationsList.length; i++) {
            if (mutationsList[i].addedNodes[0] && mutationsList[i].addedNodes[0].tagName == 'LINK' && mutationsList[i].addedNodes[0].href.includes(pluginID)) {
                console.log('SolExt: themes mutation - activated');
                runStuff();
            }
            if (mutationsList[i].removedNodes[0] && mutationsList[i].removedNodes[0].tagName == 'LINK' && mutationsList[i].removedNodes[0].href.includes(pluginID)) {
                console.log('SolExt: themes mutation - deactivated');
                stopStuff();
            }
        }
    };
    themeObserver = new MutationObserver(themeCallback);
}
initThemeObserver();

const runThemeObserver = () => {
    themeObserver.observe(doc.head, themeObserverConfig);
}

// Detect Search popup viewer opened/closed and toggle CSS flag `is-search-opened`
let searchObserver, searchObserverConfig;
const initSearchObserver = () => {
    searchObserverConfig = {
        attributes: true,
        attributeFilter: ['style']
    };
    const searchCallback = (mutationsList, observer) => {
        const searchPopup = popupContainer.querySelector('.search-results-wrap');
        if (searchPopup) {
            body.classList.add(isSearchOpenedClass);
        } else {
            body.classList.remove(isSearchOpenedClass);
        }
    };
    searchObserver = new MutationObserver(searchCallback);
}
initSearchObserver();

const runSearchObserver = () => {
    searchObserver.observe(popupContainer, searchObserverConfig);
}

// Reposition Search and arrows on toolbar
const searchOnLoad = () => {
    if (!body.classList.contains(isToolbarReorderedClass)) {
        rightToolbar.insertAdjacentElement('afterbegin', search);
        body.classList.add(isToolbarReorderedClass);
        runSearchObserver();
    }
}

const searchOnUnload = () => {
    leftToolbar.insertAdjacentElement('beforeend', search);
    body.classList.remove(isToolbarReorderedClass);
    searchObserver.disconnect();
}

// Observe plugins iframes
// & add styles to TabsPlugin
const injectCssToPlugin = (iframeEl: HTMLIFrameElement, cssName: string) => {
    const pluginDocument = iframeEl.contentDocument;
    pluginDocument.head.insertAdjacentHTML(
        "beforeend",
        `<link rel='stylesheet' id='${pluginID}' href='../../logseq-solarized-extended-theme/dist/${cssName}.css' />`
    );
    console.log(`SolExt: plugins css inject - ${iframeEl.id}`);
    if (doc.documentElement.classList.contains('is-mac')) {
        pluginDocument.body.classList.add('is-mac');
    }
}
const removeCssFromPlugin = (iframeEl: HTMLIFrameElement, cssName: string) => {
    const pluginDocument = iframeEl.contentDocument;
    pluginDocument.getElementById(pluginID).remove();
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

let pluginsIframeObserver, pluginsIframesObserverConfig;
const initPluginsIframesObserver = () => {
    pluginsIframesObserverConfig = {
        childList: true,
    };
    const pluginsIframesCallback = function (mutationsList, observer) {
        console.log('SolExt: plugins mutation');
        for (let i = 0; i < mutationsList.length; i++) {
            if (mutationsList[i].addedNodes[0] && mutationsList[i].addedNodes[0].id == 'logseq-tabs_lsp_main') {
                tabPluginConnect();
            }
            if (mutationsList[i].removedNodes[0] && mutationsList[i].removedNodes[0].id == 'logseq-tabs_lsp_main') {
                tabsPluginDisconnect();
            }
        }
    };
    pluginsIframeObserver = new MutationObserver(pluginsIframesCallback);
}
initPluginsIframesObserver();

const runPluginsIframeObserver = () => {
    pluginsIframeObserver.observe(doc.body, pluginsIframesObserverConfig);
}

// First init run
const tabsPluginOnLoad = () => {
    const tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
    if (tabsPluginIframe) {
        injectCssToPlugin(tabsPluginIframe, 'tabsPlugin');
        body.classList.add(isTabsLoadedClass);
        runPluginsIframeObserver();
    }
}

const tabsPluginOnUnload = () => {
    const tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
    if (tabsPluginIframe) {
        body.classList.remove(isTabsLoadedClass);
        pluginsIframeObserver.disconnect();
        removeCssFromPlugin(tabsPluginIframe, 'tabsPlugin');
    }
}

// External links favicons
const setFavicon = (extLinkEl: HTMLAnchorElement) => {
    const oldFav = extLinkEl.querySelector('.external-link-img');
    if (oldFav) {
        oldFav.remove();
    }
    const { hostname, protocol } = new URL(extLinkEl.href);
    if ((protocol === 'http:') || (protocol === 'https:')) {
        const faviconValue = `https://www.google.com/s2/favicons?domain=${hostname}&sz=16`;
        const fav = doc.createElement('img');
        fav.src = faviconValue;
        fav.width = 16;
        fav.height = 16;
        fav.classList.add('external-link-img');
        extLinkEl.insertAdjacentElement('afterbegin', fav);
    }
}

const removeFavicons = () => {
    const favicons = doc.querySelectorAll('.external-link-img');
    if (favicons.length) {
        for (let i = 0; i < favicons.length; i++) {
            favicons[i].remove();
        }
    }
}

// First init run
const setFaviconsOnLoad = () => {
    setTimeout(() => {
        const extLinkList: NodeListOf<HTMLAnchorElement> = doc.querySelectorAll('.external-link');
        for (let i = 0; i < extLinkList.length; i++) {
            setFavicon(extLinkList[i]);
        }
        runExtLinksObserver();
    }, 500);
}

const setFaviconsOnUnload = () => {
    extLinksObserver.disconnect();
    removeFavicons();
}

// Favicons observer
let extLinksObserver, extLinksObserverConfig;
const initExtLinksObserver = () => {
    extLinksObserverConfig = { childList: true, subtree: true };
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
    extLinksObserver = new MutationObserver(extLinksCallback);
}
initExtLinksObserver();

const runExtLinksObserver = () => {
    extLinksObserver.observe(appContainer, extLinksObserverConfig);
}


// Sticky 1 levels

// Header observer
let headersObserver, headersObserverConfig;
const initHeadersObserver = () => {
    headersObserverConfig = { childList: true, subtree: true };
    const headersCallback = function (mutationsList, observer) {
        for (let i = 0; i < mutationsList.length; i++) {
            const addedNode = mutationsList[i].addedNodes[0];
            if (addedNode && addedNode.childNodes.length) {
                const headersList = addedNode.querySelectorAll(headersSelector);
                if (headersList.length) {
                    for (let i = 0; i < headersList.length; i++) {
                        if (headersList[i].querySelector(':is(h1, h2, h3, h4, h5)')) {
                            headersList[i].classList.add('will-stick');
                            setHeadersIntersectObserver(headersList[i]);
                        }
                    }
                }
            }
        }
    };
    headersObserver = new MutationObserver(headersCallback);
}

const runHeadersObserver = () => {
    headersObserver.observe(mainContainer, headersObserverConfig);
}

const setHeadersIntersectObserver = (el) => {
    const headersIntersectCallback = (entries) => {
        for (let i = 0; i < entries.length; i++) {
            entries[i].target.classList.toggle('is-sticky', entries[i].intersectionRatio < 1);
        }
    }
    const headersIntersectObserverConfig = {
        root: mainContainer,
        rootMargin: '0px 0px 0px 0px',
        threshold: [1]
    };
    const headersIntersectObserver = new IntersectionObserver(headersIntersectCallback, headersIntersectObserverConfig);
    headersIntersectObserver.observe(el);
}

// First init run
let isStickyHeaders;
const headersOnLoad = () => {
    setTimeout(() => {
        isStickyHeaders = getComputedStyle(doc.documentElement).getPropertyValue('--sticky-headers').trim() === 'sticky' ? true : false;
        if (!isStickyHeaders) {
            return;
        }
        initHeadersObserver();
        runHeadersObserver();
    }, 500);
}

const headersOnUnload = () => {
    if (!isStickyHeaders) {
        return;
    }
    headersObserver.disconnect();
}

// Theme is active onLoad detection
const themeActiveOnLoad = () => {
    const stylesheets: NodeListOf<HTMLLinkElement> = doc.querySelectorAll('head link');
    for (let i = 0; i < stylesheets.length; i++) {
        if (stylesheets[i].href && stylesheets[i].href.includes(pluginID)) {
            runStuff();
        }
    }
}

const runStuff = () => {
    body.classList.add(isSolarizedActiveClass);
    isSolarizedActive = true;
    searchOnLoad();
    setFaviconsOnLoad();
    tabsPluginOnLoad();
    headersOnLoad();
}

const stopStuff = () => {
    body.classList.remove(isSolarizedActiveClass);
    isSolarizedActive = false;
    searchOnUnload();
    tabsPluginOnUnload();
    setFaviconsOnUnload();
    headersOnUnload();
}

const main = () => {
    doc = parent.document;
    body = doc.body;
    popupContainer = doc.querySelector('.ui__modal')
    appContainer = doc.getElementById('app-container');
    mainContainer = doc.getElementById('main-content-container');
    toolbar = doc.getElementById('head');
    leftToolbar = toolbar.querySelector('.l');
    rightToolbar = toolbar.querySelector('.r');
    search = doc.getElementById('search-button');

    // Init
    body.classList.add(isSolarizedLoadedClass);

    setTimeout(() => {
        themeActiveOnLoad();
    }, 500)
    runThemeObserver();
};
logseq.ready(main).catch(console.error);
