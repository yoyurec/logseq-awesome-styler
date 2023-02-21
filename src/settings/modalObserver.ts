import { doc, body, globals } from '../modules/globals/globals';

import { tweakPluginSettings } from './tweakSettings';

// Detect modals opened/closed
let modalObserver: MutationObserver;
let modalObserverConfig: MutationObserverInit;
let themeInnerObserver: MutationObserver;
let themeInnerObserverConfig: MutationObserverInit;
let subModalObserver: MutationObserver;
let subModalObserverConfig: MutationObserverInit;

export const modalObserverLoad = () => {
    initModalObserver();
    runModalObserver();
    initThemeInnerObserver();
    runThemeInnerObserver();
    initSubModalObserver();
}

export const modalObserverUnload = () => {
    stopModalObserver();
    stopThemeInnerObserver();
}

const modalCallback: MutationCallback = (mutationsList) => {
    for (let i = 0; i < mutationsList.length; i++) {
        const mutationItem = mutationsList[i];
        const addedNode = mutationItem.addedNodes[0] as HTMLElement;
        const removedNode = mutationItem.removedNodes[0] as HTMLElement;

        if (addedNode && addedNode.childNodes.length) {
            if (addedNode.querySelector(`#settings.cp__settings-main`)) {
                // Logseq settings popup opened
                body.dataset[globals.isLsSettingsOpenedAttr] = '';
            }
            if (addedNode.querySelector(`.cp__plugins-page`)) {
                // Logseq plugins popup opened
                body.dataset[globals.isLsPluginsOpenedAttr] = '';
            }
            // "Toolbar -> AwesomeStyler -> Settings"
            if (addedNode.querySelector('.panel-wrap[data-id="logseq-awesome-styler"]')) {
                body.dataset[globals.isAwStSettingsPopupOpenedAttr] = '';
                setTimeout(() => {
                    tweakPluginSettings();
                }, 500);
            }
        }
        if (removedNode && removedNode.childNodes.length) {
            if (removedNode.querySelector(`#settings.cp__settings-main`)) {
                // Logseq settings popup closed
                delete body.dataset[globals.isLsSettingsOpenedAttr];
            }
            if (removedNode.querySelector(`.cp__plugins-page`)) {
                // Logseq plugins popup closed
                delete body.dataset[globals.isLsPluginsOpenedAttr];
            }
            // "Toolbar -> AwesomeStyler -> Settings"
            if (removedNode.querySelector('.panel-wrap[data-id="logseq-awesome-styler"]')) {
                delete body.dataset[globals.isAwStSettingsPopupOpenedAttr];
            }
        }
    }
};

const themeInnerCallback: MutationCallback = (mutationsList) => {
    for (let i = 0; i < mutationsList.length; i++) {
        const mutationItem = mutationsList[i];
        const addedNode = mutationItem.addedNodes[0] as HTMLElement;
        const removedNode = mutationItem.removedNodes[0] as HTMLElement;
        if (addedNode && addedNode.childNodes.length && addedNode.classList.contains(`is-sub-modal`)) {
            // Submodal opened
            runSubModalObserver();
        }
        if (removedNode && removedNode.childNodes.length && removedNode.classList.contains(`is-sub-modal`)) {
            // Submodal closed
            stopSubModalObserver();
        }
    }
}

const subModalCallback: MutationCallback = (mutationsList) => {
    for (let i = 0; i < mutationsList.length; i++) {
        const mutationItem = mutationsList[i];
        const addedNode = mutationItem.addedNodes[0] as HTMLElement;
        const settingsContainer = addedNode.parentElement;
        if (settingsContainer && settingsContainer.dataset.id === 'logseq-awesome-styler') {
            // "Settings -> Plugins -> AwesomeStyler" OR "Plugins -> AwesomeStyler -> Settings"
            setTimeout(() => {
                tweakPluginSettings();
            }, 500);
        }
    }
}

const initModalObserver = () => {
    modalObserverConfig = {
        childList: true
    };
    modalObserver = new MutationObserver(modalCallback);
}

const runModalObserver = () => {
    const modalContainer = doc.querySelector('.ui__modal-panel');
    if (!modalContainer) {
        return;
    }
    modalObserver.observe(modalContainer, modalObserverConfig);
}

const stopModalObserver = () => {
    modalObserver.disconnect();
}

const initThemeInnerObserver = () => {
    themeInnerObserverConfig = {
        childList: true
    };
    themeInnerObserver = new MutationObserver(themeInnerCallback);
}

const runThemeInnerObserver = () => {
    const themeInner = doc.querySelector('.theme-inner');
    if (!themeInner) {
        return;
    }
    themeInnerObserver.observe(themeInner, themeInnerObserverConfig);
}

const stopThemeInnerObserver = () => {
    themeInnerObserver.disconnect();
}

const initSubModalObserver = () => {
    subModalObserverConfig = {
        childList: true,
        subtree: true
    };
    subModalObserver = new MutationObserver(subModalCallback);
}

const runSubModalObserver = () => {
    const subModalContainer = doc.querySelector('.ui__modal.is-sub-modal')
    if (!subModalContainer) {
        return;
    }
    subModalObserver.observe(subModalContainer, subModalObserverConfig);
}

const stopSubModalObserver = () => {
    subModalObserver.disconnect();
}