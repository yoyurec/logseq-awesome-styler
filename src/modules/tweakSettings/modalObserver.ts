import {
    globalContext,
    doc, body, modalContainer,
    onSettingsModalOpened
} from '../internal';

// Detect modals opened/closed
let modalObserver: MutationObserver;
let modalObserverConfig: MutationObserverInit;

const modalCallback: MutationCallback = () => {
    if (!modalContainer) {
        return;
    }
    // Settings opened
    const settingsModal = modalContainer.querySelector('.cp__settings-main');
    if (settingsModal) {
        body.classList.add(globalContext.isSettingsOpenedClass);
        globalContext.tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;

        onSettingsModalOpened(settingsModal);
    } else {
        body.classList.remove(globalContext.isSettingsOpenedClass);
    }
};

export const initModalObserver = () => {
    modalObserverConfig = {
        attributes: true,
        attributeFilter: ['style']
    };
    modalObserver = new MutationObserver(modalCallback);
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
