import { LSPluginBaseInfo } from '@logseq/libs/dist/LSPlugin.user';

import { globals, doc, body } from '../globals/globals';

import { objectsKeysDiff, injectPluginCSS, wait, ejectPluginCSS } from '../utils/utils';

import { settingsConfig } from './settingsConfig';
import { onPresetSwitched, writeSettingsItemToCustomPreset } from './presets';
import { getThemeCSSVars } from './cssVars';

import settingsStyles from './settings.css?inline';

export const settingsLoad = () => {
    logseq.useSettingsSchema(settingsConfig);
    globals.pluginConfig = logseq.settings;
    logseq.provideStyle({ key: 'awSt-settings-css', style: settingsStyles });
}

export const settingsUnload = () => {
    doc.head.querySelector('style[data-injected-style^="awSt-settings-css"]')?.remove();
}

// Setting changed
export const onSettingsChangedCallback = async (settings: LSPluginBaseInfo['settings'], oldSettings: LSPluginBaseInfo['settings']) => {
    globals.oldPluginConfig = { ...oldSettings };
    globals.pluginConfig = { ...settings };

    // settings changed programmatically (preset settings duplicated), skipping
    if (globals.isSettingsItemWrittenToCustomPreset) {
        // reset flag back
        globals.isSettingsItemWrittenToCustomPreset = false;
        return;
    }
    // settings changed programmatically (preset settings copied), skipping
    if (globals.isPredefinedPresetClonedToCustom) {
        // reset flag back
        globals.isPredefinedPresetClonedToCustom = false;
        return;
    }
    // settings changed programmatically (preset applied)
    if (globals.isPresetWrittenToSettings) {
        // reset flag back
        globals.isPresetWrittenToSettings = false;
        return;
    }

    const settingsChangedKey = objectsKeysDiff(globals.oldPluginConfig, globals.pluginConfig);
    if (!settingsChangedKey.length) {
        return;
    }

    if (settingsChangedKey.includes('presetName')) {
        // preset switched?
        onPresetSwitched();
    } else {
        // single settings item changed?
        writeSettingsItemToCustomPreset({
            [settingsChangedKey[0]]: settings[settingsChangedKey[0]]
        });
    }
    await wait(300);
    setThemeAndPluginsCSS();
}

export const setThemeAndPluginsCSS = async () => {
    const cssVarsStyle = getThemeCSSVars();
    logseq.provideStyle({ key: 'awSt-vars-css', style: cssVarsStyle });
    injectPluginCSS('logseq-awesome-styler_iframe', 'awSt-main-vars', globals.mainCSSVars);
    logseq.App.invokeExternalPlugin('logseq-awesome-ui.models.onThemeChangedCallback');
    // injectPluginCSS('logseq-tabs_iframe', 'awSt-tabs-vars', globals.mainCSSVars);
}

export const unsetThemeAndPluginsCSS = async () => {
    doc.head.querySelector('style[data-injected-style^="awSt-vars-css"]')?.remove();
    ejectPluginCSS('logseq-awesome-styler_iframe', 'awSt-main-vars');
    // ejectPluginCSS('logseq-tabs_iframe', 'awSt-tabs-vars');
}
