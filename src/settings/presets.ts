import { body, doc, globals } from '../modules/globals/globals';
import { presetsConfig } from './settingsConfig';

export const onPresetSwitched = async () => {
    writePresetToSettings();
    refreshSettingsForm();
}

// Switch preset
export const writePresetToSettings = () => {
    globals.isPresetWrittenToSettings = true;
    if ((globals.pluginConfig.presetName as string).startsWith('Custom')) {
        // user
        logseq.updateSettings(globals.pluginConfig[`preset${globals.pluginConfig.presetName}`]);
    } else {
        // or predefined
        logseq.updateSettings(presetsConfig[globals.pluginConfig.presetName]);
    }
    delete body.dataset.awstPreset;
    body.dataset.awstPreset = globals.pluginConfig.presetName;
}

export const writeSettingsItemToCustomPreset = (settingsItem: object) => {
    globals.isSettingsItemWrittenToCustomPreset = true;
    logseq.updateSettings({
        [`preset${globals.pluginConfig.presetName}`]: settingsItem
    });
}

const refreshSettingsForm = () => {
    if (globals.isLsSettingsOpenedAttr in body.dataset) {
        // "Settings -> Plugins -> AwesomeStyler"
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
    if (globals.isLsPluginsOpenedAttr in body.dataset) {
        // "Plugins -> AwesomeStyler -> Settings"
        const closeModalBtn = doc.querySelector('.is-sub-modal .ui__modal-close') as HTMLAnchorElement;
        // hide settings
        closeModalBtn.click();
        // show settings
        logseq.showSettingsUI();
    }
    if (globals.isAwStSettingsPopupOpenedAttr in body.dataset) {
        // "Toolbar -> AwesomeStyler -> Settings"
        const closeModalBtn = doc.querySelector('.ui__modal:not(.is-sub-modal) .ui__modal-close') as HTMLAnchorElement;
        // hide settings
        closeModalBtn.click();
        // show settings
        logseq.showSettingsUI();
    }
}
