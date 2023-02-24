import { globals, doc } from '../modules/globals/globals';
import { presetsList } from '../settings/settingsConfig';

const generatePresetsList = () => {
    const app = document.getElementById('app');
    const appInner = document.getElementById('app-inner');
    const appSettingsBtn = document.getElementById('app-settings-btn');
    appSettingsBtn!.addEventListener('click', settingsBtnClickHandler);
    document.querySelector('.awSt-presets')?.remove();
    const presetsContainer = document.createElement('div');
    presetsContainer.classList.add('awSt-presets');
    for (let i = 0; i < presetsList.length; ++i) {
        const presetItem = presetsList[i];
        const presetItemEl = document.createElement('a');
        presetItemEl.classList.add('awSt-presets__item');
        if (presetItem === globals.pluginConfig.presetName) {
            presetItemEl.classList.add('chosen');
        }
        presetItemEl.id = presetItem;
        presetItemEl.textContent = presetItem.replace('_', ' ');
        presetsContainer.appendChild(presetItemEl);
    }
    appInner!.appendChild(presetsContainer);
    app!.addEventListener('click', containerClickHandler);
}

const containerClickHandler = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('awSt-presets__item')) {
        logseq.updateSettings({ presetName: target!.id });
    }
    closePresetsPanel();
}

const settingsBtnClickHandler = () => {
    logseq.showSettingsUI();
}

const openPresetsPanel = () => {
    if (!globals.isThemeChosen) {
        showThemeWarning();
        return;
    }
    setPopupPosition();
    generatePresetsList();
    logseq.showMainUI();
}

const showThemeWarning = () => {
    // @ts-ignore
    parent.window.logseq.api.show_themes();
    logseq.UI.showMsg(`Choose "Awesome Styler" theme first!`, 'warning', { timeout: 5000 });
}

export const closePresetsPanel = async () => {
    logseq.hideMainUI();
}

export const togglePresetsPanel = () => {
    if (!logseq.isMainUIVisible) {
        openPresetsPanel();
    } else {
        closePresetsPanel();
    }
}

const setPopupPosition = () => {
    const button = doc.getElementById('awSt-presets-button');
    if (button) {
        const buttonPos = button.getBoundingClientRect();
        const appInner = document.getElementById('app-inner');
        Object.assign(
            appInner!.style,
            {
                top: `${buttonPos.top + 40}px`,
                left: `${buttonPos.left - 140}px`,
                // items + padding + settings btn
                height: `${presetsList.length * 36 + 16 + 38}px`
            }
        );
    }
}
