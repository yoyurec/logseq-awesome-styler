import { LSPluginBaseInfo } from '@logseq/libs/dist/LSPlugin.user';

import { objectDiff } from '../utils';
import {
    globalContext,
    settingsConfig,
    updatePresets,
    setStylingCSSVars,
    tabPluginInjectCSSVars
} from '../internal';

import settingsStyles from './settings.css?inline';

export const settingsLoad = () => {
    logseq.useSettingsSchema(settingsConfig);
    globalContext.pluginConfig = logseq.settings;
    logseq.provideStyle(settingsStyles);

    // Listen settings update
    logseq.onSettingsChanged((settings, oldSettings) => {
        onSettingsChangedCallback(settings, oldSettings);
    });
}

// Setting changed
export const onSettingsChangedCallback = (settings: LSPluginBaseInfo['settings'], oldSettings: LSPluginBaseInfo['settings']) => {
    globalContext.oldPluginConfig = { ...oldSettings };
    globalContext.pluginConfig = { ...settings };
    const settingsDiff = objectDiff(globalContext.oldPluginConfig, globalContext.pluginConfig)

    if (globalContext.isThemeChosen()) {
        if (globalContext.isPresetApplied) {
            // settings changed programmatically (preset applied), skipping
            globalContext.isPresetApplied = false;
            setStylingCSSVars();
            if (globalContext.tabsPluginIframe) {
                tabPluginInjectCSSVars();
            }
            return;
        }
        if (globalContext.isSettingsDuplicated) {
            // settings changed programmatically (preset settings duplicated), skipping
            globalContext.isSettingsDuplicated = false;
            return;
        }
        if (globalContext.isPresetCopied) {
            // settings changed programmatically (preset settings copied), skipping
            globalContext.isPresetCopied = false;
            return;
        }
        if (settingsDiff.includes('presetName')) {
            updatePresets();
        } else {
            setStylingCSSVars();
            if (globalContext.tabsPluginIframe) {
                tabPluginInjectCSSVars();
            }
            duplicateSettingsToCustom();
        }
    }
}

// Update presetCustom vars
export const duplicateSettingsToCustom = () => {
    const { presetName, presetCustom, presetCustom2, presetCustom3, ...customSettings } = globalContext.pluginConfig;
    if (globalContext.pluginConfig.presetName === 'Custom') {
        logseq.updateSettings({ presetCustom: customSettings });
        globalContext.isSettingsDuplicated = true;
    }
    if (globalContext.pluginConfig.presetName === 'Custom2') {
        logseq.updateSettings({ presetCustom2: customSettings });
        globalContext.isSettingsDuplicated = true;
    }
    if (globalContext.pluginConfig.presetName === 'Custom3') {
        logseq.updateSettings({ presetCustom3: customSettings });
        globalContext.isSettingsDuplicated = true;
    }
}
