import { LSPluginBaseInfo } from '@logseq/libs/dist/LSPlugin.user';

import { globals } from '../globals/globals';

import { objectDiff } from '../utils/utils';

import { settingsConfig } from './settingsConfig';
import { updatePresets, duplicateSettingsToCustom } from './presets';
import { setStylingCSSVars } from './cssVars';
import { tabPluginInjectCSSVars } from '../extPlugins/tabs';

import settingsStyles from './settings.css?inline';

export const settingsLoad = () => {
    logseq.useSettingsSchema(settingsConfig);
    globals.pluginConfig = logseq.settings;
    logseq.provideStyle(settingsStyles);
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
