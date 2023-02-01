import { body, globals } from '../globals/globals';

import { onSettingsPluginsOpened } from './tweakSettings';

// Detect modals opened/closed
let modalObserver: MutationObserver;
let modalObserverConfig: MutationObserverInit;
let submodalObserver: MutationObserver;
let submodalObserverConfig: MutationObserverInit;

export const modalObserverLoad = () => {
    initModalObserver();
    runModalObserver();
}

export const modalObserverUnload = () => {
    stopModalObserver();
}

const modalCallback: MutationCallback = (mutationsList) => {
    for (let i = 0; i < mutationsList.length; i++) {
        const mutationItem = mutationsList[i];
        const addedNode = mutationItem.addedNodes[0] as HTMLElement;
        const removedNode = mutationItem.removedNodes[0] as HTMLElement;
        // Settings popup
        if (addedNode && addedNode.childNodes.length && addedNode.querySelector(`#settings.cp__settings-main`)) {
            body.classList.add(globals.isSettingsOpenedClass);
            runSubmodalObserver();
        }
        if (removedNode && removedNode.childNodes.length && removedNode.querySelector(`#settings.cp__settings-main`)) {
            body.classList.remove(globals.isSettingsOpenedClass);
            stopSubmodalObserver();
        }
    }
};

const submodalCallback: MutationCallback = (mutationsList) => {
    for (let i = 0; i < mutationsList.length; i++) {
        const mutationItem = mutationsList[i];
        const addedNode = mutationItem.addedNodes[0] as HTMLElement;
        const removedNode = mutationItem.removedNodes[0] as HTMLElement;
        // Settings -> Plugins popup
        if (addedNode && addedNode.childNodes.length && addedNode.querySelector(`.cp__plugins-settings`)) {
            stopModalObserver();
            onSettingsPluginsOpened();
        }
        if (removedNode && removedNode.childNodes.length && removedNode.querySelector(`.cp__plugins-settings`)) {
            runModalObserver();
        }
    }
}

const initModalObserver = () => {
    modalObserverConfig = {
        childList: true
    };
    modalObserver = new MutationObserver(modalCallback);
    initSubmodalObserver();
}

const runModalObserver = () => {
    if (!globals.modalContainer) {
        return;
    }
    modalObserver.observe(globals.modalContainer, modalObserverConfig);
}

const stopModalObserver = () => {
    modalObserver.disconnect();
}

const initSubmodalObserver = () => {
    submodalObserverConfig = {
        childList: true
    };
    submodalObserver = new MutationObserver(submodalCallback);
}

const runSubmodalObserver = () => {
    if (!globals.submodalContainer) {
        return;
    }
    submodalObserver.observe(globals.submodalContainer, submodalObserverConfig);
}

const stopSubmodalObserver = () => {
    submodalObserver.disconnect();
}
