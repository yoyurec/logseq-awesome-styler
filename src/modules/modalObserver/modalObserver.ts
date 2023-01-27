import {
    globals,
    doc, body, modalContainer, submodalContainer,
    onSettingsPluginsOpened
} from '../../internal';

// Detect modals opened/closed
let modalObserver: MutationObserver;
let modalObserverConfig: MutationObserverInit;
let submodalObserver: MutationObserver;
let submodalObserverConfig: MutationObserverInit;

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

export const initModalObserver = () => {
    modalObserverConfig = {
        childList: true
    };
    modalObserver = new MutationObserver(modalCallback);
    initSubmodalObserver();
}

export const runModalObserver = () => {
    if (!modalContainer) {
        return;
    }
    modalObserver.observe(modalContainer, modalObserverConfig);
}

export const stopModalObserver = () => {
    modalObserver.disconnect();
}

const initSubmodalObserver = () => {
    submodalObserverConfig = {
        childList: true
    };
    submodalObserver = new MutationObserver(submodalCallback);
}

export const runSubmodalObserver = () => {
    if (!submodalContainer) {
        return;
    }
    submodalObserver.observe(submodalContainer, submodalObserverConfig);
}

export const stopSubmodalObserver = () => {
    submodalObserver.disconnect();
}