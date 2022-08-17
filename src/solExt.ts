import '@logseq/libs';
import { lighten, darken, mix } from 'color2k';

import { SettingSchemaDesc, Theme } from "@logseq/libs/dist/LSPlugin.user";

import tabsPluginStyles from "./tabsPlugin.css?raw";

const pluginID = 'solarized-extended';
const isTabsLoadedClass = 'is-tabs-loaded';
const isSearchOpenedClass = 'is-search-opened';
const isSearchReorderedClass = 'is-search-reordered';
const headersSelector = `.page-blocks-inner > div > div > div > div > div > div > .ls-block:not([haschild='']):not([data-refs-self='["quote"]']):not([data-refs-self='["card"]']):not(.pre-block) > .flex-row`;

type pluginConfig = {
    width: any;
    favicons: any,
    headersLabels: any
    stickyHeaders: any
    newBlockBullet: any;
    homeButton: any;
    banners: any
    background: any;
    font: any;
  }

let doc: Document;
let root: HTMLElement;
let body: HTMLElement;
let themeInner: HTMLElement | null;
let popupContainer: HTMLElement | null;
let appContainer: HTMLElement | null;
let mainContainer: HTMLElement | null;
let pluginConfig: pluginConfig;
let oldPluginConfig: pluginConfig;

const settings: SettingSchemaDesc[] = [
    {
        key: "sizesHeading",
        title: "📐 Sizes",
        description: "",
        type: "heading",
        default: null,
    },
    {
        key: "contentMaxWidth",
        title: "Content max width (in px)",
        description: "",
        type: "string",
        default: "1200px",
    },
    {
        key: "contentWideMaxWidth",
        title: "Content max width in wide mode (in px)",
        description: "",
        type: "string",
        default: "1600px",
    },
    {
        key: "leftSidebarWidth",
        title: "Left sidebar width (in px)",
        description: "",
        type: "string",
        default: "250px",
    },
    {
        key: "rightSidebarWidth",
        title: "Right sidebar width (in px)",
        description: "",
        type: "string",
        default: "460px",
    },
    {
        key: "featuresHeading",
        title: "⚡ Features",
        description: "",
        type: "heading",
        default: null,
    },
    {
        key: "faviconsEnabled",
        title: "",
        description: "⭐ Enable favicons for external links?",
        type: "boolean",
        default: true,
    },
    {
        key: "headersLabelsEnabled",
        title: "",
        description: "🔖 Show headers labels?",
        type: "boolean",
        default: true,
    },
    {
        key: "stickyHeadersEnabled",
        title: "",
        description: "📌 Enable sticky headers (h1-h5 in document root)?",
        type: "boolean",
        default: true,
    },
    {
        key: "newBlockBulletEnabled",
        title: "",
        description: "➕ Always show add block bullet on page bottom?",
        type: "boolean",
        default: false,
    },
    {
        key: "homeButtonEnabled",
        title: "",
        description: "🏠 Show Home button?",
        type: "boolean",
        default: false,
    },
    {
        key: "bannersPluginHeading",
        title: "📰 Banners plugin support",
        description: "",
        type: "heading",
        default: null,
    },
    {
        key: "bannersAsBackground",
        title: "",
        description: "Use banner image as blurred background?",
        type: "boolean",
        default: true,
    },
    {
        key: "bannersIconGlow",
        title: "",
        description: "Add glow to banner icon?",
        type: "boolean",
        default: true,
    },
    {
        key: "backgroundHeading",
        title: "🌆 Background",
        description: "",
        type: "heading",
        default: null,
    },
    {
        key: "backgroundURL",
        title: "Background URL (set empty to disable feature)",
        description: "",
        type: "string",
        default: "https://images.unsplash.com/photo-1584004400883-35a54de8b74c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    },
    {
        key: "backgroundShadow",
        title: "",
        description: "Enable content shadow?",
        type: "boolean",
        default: true,
    },
    {
        key: "fontsHeading",
        title: "🆎 Fonts",
        description: "",
        type: "heading",
        default: null,
    },
    {
        key: "fontContentName",
        title: "Content font name",
        description: "",
        type: "enum",
        enumPicker: "select",
        enumChoices: ["Fira Sans (SolExt default)", "iA Writer Quattro", "Inter (Logseq default)", "OS System default"],
        default: "Fira Sans (SolExt default)",
    },
    {
        key: "fontContentSize",
        title: "Content font size",
        description: "",
        type: "string",
        default: "16px",
    },
    {
        key: "colorsHeading",
        title: "🎨 Colors (🚧 in progress)",
        description: "",
        type: "heading",
        default: null,
    }
]


// Read settings
const readPluginSettings = () => {
    oldPluginConfig = { ...pluginConfig };
    pluginConfig = {
        width: {},
        favicons: {},
        headersLabels: {},
        stickyHeaders: {},
        newBlockBullet: {},
        homeButton: {},
        banners: {},
        background: {},
        font: {}
    };
    if (logseq.settings) {
        ({
            contentMaxWidth: pluginConfig.width.content,
            contentWideMaxWidth: pluginConfig.width.contentWide,
            leftSidebarWidth: pluginConfig.width.leftSidebar,
            rightSidebarWidth: pluginConfig.width.rightSidebar,
            faviconsEnabled: pluginConfig.favicons.enabled,
            stickyHeadersEnabled: pluginConfig.stickyHeaders.enabled,
            headersLabelsEnabled: pluginConfig.headersLabels.enabled,
            newBlockBulletEnabled: pluginConfig.newBlockBullet.enabled,
            homeButtonEnabled: pluginConfig.homeButton.enabled,
            bannersAsBackground: pluginConfig.banners.asBackground,
            bannersIconGlow: pluginConfig.banners.iconGlow,
            backgroundURL: pluginConfig.background.url,
            fontContentName: pluginConfig.font.contentName,
            fontContentSize: pluginConfig.font.contentSize,
        } = logseq.settings);
    }
}


// Toggle features on settings changes
const toggleFeatures = () => {
    if (pluginConfig.favicons.enabled !== oldPluginConfig.favicons.enabled) {
        if (pluginConfig.favicons.enabled) {
            setFaviconsOnLoad();
        } else {
            setFaviconsOnUnload();
        }
    }
    if (pluginConfig.stickyHeaders.enabled !== oldPluginConfig.stickyHeaders.enabled) {
        if (pluginConfig.stickyHeaders.enabled) {
            setHeadersOnLoad();
        } else {
            setHeadersOnUnload();
        }
    }
}

// Detect Search popup viewer opened/closed and toggle CSS flag `is-search-opened`
let searchObserver: MutationObserver, searchObserverConfig: MutationObserverInit;
const searchCallback: MutationCallback = (mutationsList, observer) => {
    if (!popupContainer) {
        return;
    }
    const searchPopup = popupContainer.querySelector('.search-results-wrap');
    if (searchPopup) {
        body.classList.add(isSearchOpenedClass);
        (doc.querySelector(".ui__modal .ls-search") as HTMLElement).style.width = doc.getElementById("search-button")?.offsetWidth + "px" || "var(--ls-main-content-max-width)";
    } else {
        body.classList.remove(isSearchOpenedClass);
    }
};
const initSearchObserver = () => {
    searchObserverConfig = {
        attributes: true,
        attributeFilter: ['style']
    };
    searchObserver = new MutationObserver(searchCallback);
}
initSearchObserver();
const runSearchObserver = () => {
    if (!popupContainer) {
        return;
    }
    searchObserver.observe(popupContainer, searchObserverConfig);
}

// Reposition toolbar search button
const searchOnLoad = () => {
    if (!body.classList.contains(isSearchReorderedClass)) {
        const rightToolbar = doc.querySelector('#head .r');
        if (rightToolbar) {
            const search = doc.getElementById('search-button');
            if (search) {
                rightToolbar.insertAdjacentElement('afterbegin', search);
            }
        }
        body.classList.add(isSearchReorderedClass);
        runSearchObserver();
    }
}
const searchOnUnload = () => {
    const leftToolbar = doc.querySelector('#head .l');
    const search = doc.getElementById('search-button');
    if (!leftToolbar || !search) {
        return;
    }
    leftToolbar.insertAdjacentElement('beforeend', search);
    body.classList.remove(isSearchReorderedClass);
    searchObserver.disconnect();
}

// Reposition right sidebar toggle button
const rightSidebarOnLoad = () => {
    reorderRightSidebarToggleButton();
}
const reorderRightSidebarToggleButton = () => {
    const toggleRightSidebar = doc.querySelector("#right-sidebar .toggle-right-sidebar");
    if (!toggleRightSidebar) {
        if (themeInner && !themeInner?.classList.contains('ls-right-sidebar-open')) {
            doc.querySelector("#head .toggle-right-sidebar")?.remove();
        }
    }
    const rightToolbar = doc.querySelector('#head .r');
    if (rightToolbar && toggleRightSidebar) {
        rightToolbar.insertAdjacentElement('beforeend', toggleRightSidebar);
    }
}

// Add styles to TabsPlugin
const injectCssToPlugin = (iframeEl: HTMLIFrameElement, cssContent: string, id: string) => {
    const pluginDocument = iframeEl.contentDocument;
    if (pluginDocument) {
        pluginDocument.head.insertAdjacentHTML(
            "beforeend",
            `<style id='${id}'>
                ${cssContent}
            </style>`
        );
        console.log(`SolExt: plugins css inject - ${iframeEl.id}`);
        if (doc.documentElement.classList.contains('is-mac')) {
            pluginDocument.body.classList.add('is-mac');
        }

    }
}
const removeCssFromPlugin = (iframeEl: HTMLIFrameElement, id: string) => {
    const pluginDocument = iframeEl.contentDocument;
    if (pluginDocument) {
        pluginDocument.getElementById(id)?.remove();
    }
}
const tabsPluginCSSVars = (): string => {
    return `
        :root {
            --ls-border-color: ${getComputedStyle(top!.document.documentElement).getPropertyValue('--ls-border-color').trim()};
            --ls-title-text-color: ${getComputedStyle(top!.document.documentElement).getPropertyValue('--ls-title-text-color').trim()};
            --ls-primary-text-color: ${getComputedStyle(top!.document.documentElement).getPropertyValue('--ls-primary-text-color').trim()};
            --ls-primary-background-color: ${getComputedStyle(top!.document.documentElement).getPropertyValue('--ls-primary-background-color').trim()};
            --ls-secondary-background-color: ${getComputedStyle(top!.document.documentElement).getPropertyValue('--ls-secondary-background-color').trim()};
            --ls-tertiary-background-color: ${getComputedStyle(top!.document.documentElement).getPropertyValue('--ls-tertiary-background-color').trim()};
        }
    `
}
const setTabsPluginCSSVars = () => {
    const tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
    removeCssFromPlugin(tabsPluginIframe, "tabs-vars");
    setTimeout(() => {
        injectCssToPlugin(tabsPluginIframe, tabsPluginCSSVars(), "tabs-vars");
    }, 1000)
}

// Plugins observer
let pluginsIframeObserver: MutationObserver, pluginsIframesObserverConfig: MutationObserverInit;
const pluginsIframesCallback: MutationCallback = function (mutationsList, observer) {
    console.log('SolExt: plugins mutation');
    for (let i = 0; i < mutationsList.length; i++) {
        const addedNode = mutationsList[i].removedNodes[0] as HTMLIFrameElement;
        if (addedNode && addedNode.id == 'logseq-tabs_lsp_main') {
            tabPluginConnect();
        }
        const removedNode = mutationsList[i].removedNodes[0] as HTMLIFrameElement;
        if (removedNode && removedNode.id == 'logseq-tabs_lsp_main') {
            tabsPluginDisconnect();
        }
    }
};
const initPluginsIframesObserver = () => {
    pluginsIframesObserverConfig = {
        childList: true,
    };
    pluginsIframeObserver = new MutationObserver(pluginsIframesCallback);
}
initPluginsIframesObserver();
const runPluginsIframeObserver = () => {
    pluginsIframeObserver.observe(doc.body, pluginsIframesObserverConfig);
}
const tabPluginConnect = () => {
    const tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
    if (tabsPluginIframe) {
        setTimeout(() => {
            injectCssToPlugin(tabsPluginIframe, tabsPluginStyles, "tabs-styles");
            injectCssToPlugin(tabsPluginIframe, tabsPluginCSSVars(), "tabs-vars");
            body.classList.add(isTabsLoadedClass);
        }, 500);
    }
}
const tabsPluginDisconnect = () => {
    const tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
    if (tabsPluginIframe) {
        body.classList.remove(isTabsLoadedClass);
        removeCssFromPlugin(tabsPluginIframe, "tabs-styles");
        removeCssFromPlugin(tabsPluginIframe, "tabs-vars");
    }
}

// First init run
const tabsPluginOnLoad = () => {
    tabPluginConnect();
    runPluginsIframeObserver();
}
const tabsPluginOnUnload = () => {
    tabsPluginDisconnect();
    pluginsIframeObserver.disconnect();
}

// External links favicons
const setFavicons = (extLinkList: NodeListOf<HTMLAnchorElement>) => {
    for (let i = 0; i < extLinkList.length; i++) {
        const oldFav = extLinkList[i].querySelector('.external-link-img');
        if (oldFav) {
            oldFav.remove();
        }
        const { hostname, protocol } = new URL(extLinkList[i].href);
        if ((protocol === 'http:') || (protocol === 'https:')) {
            const faviconValue = `https://www.google.com/s2/favicons?domain=${hostname}&sz=16`;
            const fav = doc.createElement('img');
            fav.src = faviconValue;
            fav.width = 16;
            fav.height = 16;
            fav.classList.add('external-link-img');
            extLinkList[i].insertAdjacentElement('afterbegin', fav);
        }
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
    if (!pluginConfig.favicons.enabled) {
        return;
    }
    setTimeout(() => {
        const extLinkList: NodeListOf<HTMLAnchorElement> = doc.querySelectorAll('.external-link');
        setFavicons(extLinkList);
        runExtLinksObserver();
    }, 500);
}
const setFaviconsOnUnload = () => {
    extLinksObserver.disconnect();
    removeFavicons();
}

// Favicons observer
let extLinksObserver: MutationObserver, extLinksObserverConfig: MutationObserverInit;
const extLinksCallback: MutationCallback = function (mutationsList, observer) {
    if (!appContainer) {
        return;
    }
    for (let i = 0; i < mutationsList.length; i++) {
        const addedNode = mutationsList[i].addedNodes[0] as HTMLAnchorElement;
        if (addedNode && addedNode.childNodes.length) {
            const extLinkList = addedNode.querySelectorAll('.external-link') as NodeListOf<HTMLAnchorElement>;
            if (extLinkList.length) {
                extLinksObserver.disconnect();
                setFavicons(extLinkList);
                extLinksObserver.observe(appContainer, extLinksObserverConfig);
            }
        }
    }
};
const initExtLinksObserver = () => {
    extLinksObserverConfig = { childList: true, subtree: true };
    extLinksObserver = new MutationObserver(extLinksCallback);
}
initExtLinksObserver();
const runExtLinksObserver = () => {
    if (!appContainer) {
        return;
    }
    extLinksObserver.observe(appContainer, extLinksObserverConfig);
}


// Sticky 1 levels

// Header observer
let headersObserver: MutationObserver, headersObserverConfig: MutationObserverInit;
const headersCallback: MutationCallback = function (mutationsList, observer) {
    for (let i = 0; i < mutationsList.length; i++) {
        const addedNode = mutationsList[i].addedNodes[0] as HTMLElement;
        if (addedNode && addedNode.childNodes.length) {
            const headersList = addedNode.querySelectorAll(headersSelector);
            if (headersList.length) {
                setHeaders(headersList);
            }
        }
    }
};
const setHeaders = (headersList: NodeListOf<Element>) => {
    for (let i = 0; i < headersList.length; i++) {
        const headerItem = headersList[i] as HTMLElement;
        if (headerItem && headerItem.querySelector(':is(h1, h2, h3, h4, h5)')) {
            headerItem.classList.add('will-stick');
            setHeadersIntersectObserver(headerItem);
        }
    }
}
const initHeadersObserver = () => {
    headersObserverConfig = { childList: true, subtree: true };
    headersObserver = new MutationObserver(headersCallback);
}
initHeadersObserver();
const runHeadersObserver = () => {
    if (!mainContainer) {
        return;
    }
    headersObserver.observe(mainContainer, headersObserverConfig);
}

const setHeadersIntersectObserver = (el: HTMLElement) => {
    const headersIntersectCallback: IntersectionObserverCallback = (entries) => {
        for (let i = 0; i < entries.length; i++) {
            entries[i].target.classList.toggle('is-sticky', entries[i].intersectionRatio < 1);
        }
    }
    const headersIntersectObserverConfig: IntersectionObserverInit = {
        root: mainContainer,
        rootMargin: '0px 0px 0px 0px',
        threshold: [1]
    };
    const headersIntersectObserver: IntersectionObserver = new IntersectionObserver(headersIntersectCallback, headersIntersectObserverConfig);
    headersIntersectObserver.observe(el);
}

// First init run
const setHeadersOnLoad = () => {
    if (!pluginConfig.stickyHeaders.enabled) {
        return;
    }
    setTimeout(() => {
        const headersList = doc.querySelectorAll(headersSelector);
        setHeaders(headersList);
        runHeadersObserver();
    }, 500);
}
const setHeadersOnUnload = () => {
    headersObserver.disconnect();
    const headersList = doc.querySelectorAll(".will-stick");
    if (headersList.length) {
        for (let i = 0; i < headersList.length; i++) {
            headersList[i].classList.remove("will-stick");
        }
    }
}

// Main logic runners
const runStuff = () => {
    readPluginSettings();
    setGlobalCSSVars();
    setFaviconsOnLoad();
    rightSidebarOnLoad();
    tabsPluginOnLoad();
    setHeadersOnLoad();
    searchOnLoad();
}
const stopStuff = () => {
    unsetGlobalCSSVars();
    searchOnUnload();
    tabsPluginOnUnload();
    setFaviconsOnUnload();
    setHeadersOnUnload();
}

// Setting changed
const onSidebarVisibleChangedCallback = () => {
    reorderRightSidebarToggleButton();
}

// Setting changed
const onSettingsChangedCallback = () => {
    readPluginSettings();
    toggleFeatures();
    setGlobalCSSVars();
}

// Theme  changed
const onThemeChangedCallback = (theme: Theme) => {
    if (theme.pid === "logseq-solarized-extended-theme") {
        console.log(`SolExt: theme activated!`);
        setTimeout(() => {
            runStuff();
        }, 1000)
    } else {
        stopStuff();
    }
}

// Theme mode changed
const onThemeModeChangedCallback = () => {
    readPluginSettings();
    setGlobalCSSVars();
    const tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
    removeCssFromPlugin(tabsPluginIframe, "tabs-vars");
    setTimeout(() => {
        injectCssToPlugin(tabsPluginIframe, tabsPluginCSSVars(), "tabs-vars");
    }, 1000)
}

// Plugin unloaded
const onPluginUnloadCallback = () => {
    // clean up
    stopStuff();
}

const initTheme = async () => {
    let themeURL = "lsp://logseq.io/logseq-solarized-extended-theme/dist/assets/solExtTheme.css";
    // let response = await fetch("http://localhost:3000/src/solExtTheme.css")
    // if (response.status === 200) {
    //     themeURL = "http://localhost:3000/src/solExtTheme.css"
    // }
    const themeLight: Theme = {
        name: "Solarized Extended Light Theme",
        url: themeURL,
        description: "Light solarized Logseq theme with extra stuff",
        mode: "light",
        pid: pluginID
    }
    const themeDark: Theme = {
        name: "Solarized Extended Dark Theme",
        url: themeURL,
        description: "Dark solarized Logseq theme with extra stuff",
        mode: "dark",
        pid: `pluginID`
    }
    logseq.provideTheme(themeLight);
    logseq.provideTheme(themeDark);
}

// Global Logseq CSS variables
const setGlobalCSSVars = () => {
    root.style.setProperty("--ls-main-content-max-width", pluginConfig.width.content);
    root.style.setProperty("--ls-main-content-max-width-wide", pluginConfig.width.contentWide);
    root.style.setProperty("--ls-left-sidebar-width", pluginConfig.width.leftSidebar);
    root.style.setProperty("--ls-right-sidebar-width", pluginConfig.width.rightSidebar);

    if (!pluginConfig.headersLabels.enabled) {
        root.style.setProperty("--headers-labels", "none");
    } else {
        root.style.removeProperty("--headers-labels");
    }
    if (pluginConfig.newBlockBullet.enabled) {
        root.style.setProperty("--new-bullet-hidden", "none");
    } else {
        root.style.removeProperty("--new-bullet-hidden");
    }
    if (pluginConfig.homeButton.enabled) {
        root.style.setProperty("--hidden-home", "none");
    } else {
        root.style.removeProperty("--hidden-home");
    }
    if (!pluginConfig.banners.asBackground) {
        root.style.setProperty("--banner-asBg", "none");
    } else {
        root.style.removeProperty("--banner-asBg");
    }
    if (!pluginConfig.banners.iconGlow) {
        root.style.setProperty("--banner-iconGlow", "none");
    } else {
        root.style.removeProperty("--banner-iconGlow");
    }
    if (pluginConfig.background.url) {
        root.style.setProperty("--bg-url", `url(${pluginConfig.background.url})`);
    } else {
        root.style.removeProperty("--bg-url");
    }
    switch (pluginConfig.font.contentName) {
        case "Fira Sans (SolExt default)":
            root.style.setProperty("--solext-content-font", "var(--solext-font-fira-sans)");
            break;
        case "iA Writer Quattro":
            root.style.setProperty("--solext-content-font", "var(--solext-font-aiwriter-quattro)");
            break;
        case "Inter (Logseq default)":
            root.style.setProperty("--solext-content-font", "var(--solext-font-default-inter)");
            break;
        case "OS System default":
            root.style.setProperty("--solext-content-font", "var(--solext-font-os-system)");
            break;
        default:
            root.style.setProperty("--solext-content-font", "var(--solext-font-fira-sans)");
    }
    if (pluginConfig.font.contentSize) {
        root.style.setProperty("--solext-content-font-size", pluginConfig.font.contentSize);
    }

    const solextAccent = getComputedStyle(top!.document.documentElement).getPropertyValue('--solext-accent').trim();
    const solextContentBg = getComputedStyle(top!.document.documentElement).getPropertyValue('--solext-content-bg').trim();
    root.style.setProperty("--solext-accent-lighter-user", mix(solextContentBg, solextAccent, 0.15));
}
const unsetGlobalCSSVars = () => {
    root.style.removeProperty("--ls-main-content-max-width");
    root.style.removeProperty("--ls-main-content-max-width-wide");
    root.style.removeProperty("--ls-left-sidebar-width");
    root.style.removeProperty("--ls-right-sidebar-width");
    root.style.removeProperty("--new-bullet-hidden");
    root.style.removeProperty("--headers-labels");
    root.style.removeProperty("--banner-asBg");
    root.style.removeProperty("--banner-iconGlow");
    root.style.removeProperty("--bg-url");
}

// Settings
const pluginSettingsClick = () => {
    doc.querySelector("#settings ul li:last-child")?.addEventListener("click", () => {
        doc.querySelector(".cp__plugins-settings img[src*='solarized-extended']")?.parentElement?.click();
    });
}

// Main logseq on ready
const main = () => {
    logseq.useSettingsSchema(settings);

    doc = parent.document;
    root = doc.documentElement;
    body = doc.body;
    themeInner = doc.querySelector('.theme-inner');
    popupContainer = doc.querySelector('.ui__modal');
    appContainer = doc.getElementById('app-container');
    mainContainer = doc.getElementById('main-content-container');

    // Init
    initTheme();

    pluginSettingsClick();

    // Listen for theme activated
    logseq.App.onThemeChanged( (theme) => {
        onThemeChangedCallback(theme as Theme);
    })

    setTimeout(() => {

        // Listen settings update
        logseq.App.onSidebarVisibleChanged(() => {
            onSidebarVisibleChangedCallback();
        })

        // Listen settings update
        logseq.onSettingsChanged(() => {
            onSettingsChangedCallback();
        })

        // Listen for theme mode changed
        logseq.App.onThemeModeChanged( () => {
            onThemeModeChangedCallback();
        })

        // Listen plugin unload
        logseq.beforeunload(async () => {
            onPluginUnloadCallback();
        })

    }, 500)

};

logseq.ready(main).catch(console.error);
