import { body, doc, globals } from '../globals/globals';
import { presetsConfig } from '../settings/settingsConfig';

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
    body.classList.remove(`awSt-preset-${globals.oldPluginConfig.presetName}`);
    body.classList.add(`awSt-preset-${globals.pluginConfig.presetName}`);
}

export const writeSettingsItemToCustomPreset = (settingsItem: object) => {
    globals.isSettingsItemWrittenToCustomPreset = true;
    logseq.updateSettings({
        [`preset${globals.pluginConfig.presetName}`]: settingsItem
    });
}

const refreshSettingsForm = () => {
    if (body.classList.contains(globals.isLsSettingsOpenedClass)) {
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
    if (body.classList.contains(globals.isLsPluginsOpenedClass)) {
        // "Plugins -> AwesomeStyler -> Settings"
        const closeModalBtn = doc.querySelector('.is-sub-modal .ui__modal-close') as HTMLAnchorElement;
        // hide settings
        closeModalBtn.click();
        // show settings
        logseq.showSettingsUI();
    }
    if (body.classList.contains(globals.isAwStSettingsPopupOpenedClass)) {
        // "Toolbar -> AwesomeStyler -> Settings"
        const closeModalBtn = doc.querySelector('.ui__modal:not(.is-sub-modal) .ui__modal-close') as HTMLAnchorElement;
        // hide settings
        closeModalBtn.click();
        // show settings
        logseq.showSettingsUI();
    }
}
