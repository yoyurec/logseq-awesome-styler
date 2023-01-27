import { LSPluginBaseInfo } from '@logseq/libs/dist/LSPlugin.user';

import { objectDiff } from '../../utils/utils';
import {
    globals,
    settingsConfig,
    updatePresets,
    setStylingCSSVars,
    tabPluginInjectCSSVars
} from '../../internal';

import settingsStyles from './settings.css?inline';

export const settingsLoad = () => {
    logseq.useSettingsSchema(settingsConfig);
    globals.pluginConfig = logseq.settings;
    logseq.provideStyle(settingsStyles);

    // Listen settings update
    logseq.onSettingsChanged((settings, oldSettings) => {
        onSettingsChangedCallback(settings, oldSettings);
    });
}

// Setting changed
export const onSettingsChangedCallback = (settings: LSPluginBaseInfo['settings'], oldSettings: LSPluginBaseInfo['settings']) => {
    globals.oldPluginConfig = { ...oldSettings };
    globals.pluginConfig = { ...settings };
    const settingsDiff = objectDiff(globals.oldPluginConfig, globals.pluginConfig)

    if (globals.isThemeChosen()) {
        if (globals.isPresetApplied) {
            // settings changed programmatically (preset applied), skipping
            globals.isPresetApplied = false;
            setStylingCSSVars();
            if (globals.tabsPluginIframe) {
                tabPluginInjectCSSVars();
            }
            return;
        }
        if (globals.isSettingsDuplicated) {
            // settings changed programmatically (preset settings duplicated), skipping
            globals.isSettingsDuplicated = false;
            return;
        }
        if (globals.isPresetCopied) {
            // settings changed programmatically (preset settings copied), skipping
            globals.isPresetCopied = false;
            return;
        }
        if (settingsDiff.includes('presetName')) {
            updatePresets();
        } else {
            setStylingCSSVars();
            if (globals.tabsPluginIframe) {
                tabPluginInjectCSSVars();
            }
            duplicateSettingsToCustom();
        }
    }
}

// Update presetCustom vars
export const duplicateSettingsToCustom = () => {
    const { presetName, presetCustom, presetCustom2, presetCustom3, ...customSettings } = globals.pluginConfig;
    if (globals.pluginConfig.presetName === 'Custom') {
        logseq.updateSettings({ presetCustom: customSettings });
        globals.isSettingsDuplicated = true;
    }
    if (globals.pluginConfig.presetName === 'Custom2') {
        logseq.updateSettings({ presetCustom2: customSettings });
        globals.isSettingsDuplicated = true;
    }
    if (globals.pluginConfig.presetName === 'Custom3') {
        logseq.updateSettings({ presetCustom3: customSettings });
        globals.isSettingsDuplicated = true;
    }
}
