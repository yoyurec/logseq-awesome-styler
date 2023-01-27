import {
    globals,
    doc, body,
    initInputs,
    presetsConfig
} from '../../internal';

export const updatePresets = () => {
    applyPreset();
    refreshSettingsPage();
    initInputs();
    body.classList.remove(`awSt-preset-${globals.oldPluginConfig.presetName}`);
    body.classList.add(`awSt-preset-${globals.pluginConfig.presetName}`);
}

// Switch preset
const applyPreset = () => {
    let settingsVal = null;
    switch (globals.pluginConfig.presetName) {
        case 'Solarized_default':
            settingsVal = presetsConfig.Solarized_default;
            break;
        case 'Logseq_original':
            settingsVal = presetsConfig.Logseq_original;
            break;
        case 'Mia_quattro':
            settingsVal = presetsConfig.Mia_quattro;
            break;
        case 'Chocolate':
            settingsVal = presetsConfig.Chocolate;
            break;
        case 'Custom':
            settingsVal = globals.pluginConfig.presetCustom;
            break;
        case 'Custom2':
            settingsVal = globals.pluginConfig.presetCustom2;
            break;
        case 'Custom3':
            settingsVal = globals.pluginConfig.presetCustom3;
            break;
        default:
            settingsVal = presetsConfig.Solarized_default;
        }
    logseq.updateSettings(settingsVal);
    globals.isPresetApplied = true;
}

const refreshSettingsPage = () => {
    const closeSettings = doc.querySelector('.is-sub-modal .ui__modal-close') as HTMLAnchorElement;
    const awStPluginButton = doc.querySelector(`.settings-plugin-item[data-id="${globals.pluginID}"]`) as HTMLAnchorElement;
    if (!awStPluginButton) {
        return;
    }
    const clickPlugin = doc.querySelectorAll(`.settings-plugin-list .settings-plugin-item:not([data-id="${globals.pluginID}"])`);
    if (clickPlugin.length > 0) {
        (clickPlugin[0] as HTMLAnchorElement).click();
        setTimeout(() => {
            awStPluginButton.click();
        }, 100);
    } else {
        closeSettings.click();
        const settingsPluginButton = doc.querySelector('.settings-menu-link[data-id="plugins"]') as HTMLAnchorElement;
        setTimeout(() => {
            settingsPluginButton.click();
        }, 100);
        setTimeout(() => {
            awStPluginButton.click();
        }, 100);
    }
}
