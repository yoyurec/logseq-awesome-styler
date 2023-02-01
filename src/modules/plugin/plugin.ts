import { Theme } from '@logseq/libs/dist/LSPlugin.user';

import { body, globals } from '../globals/globals';


import { checkUpdate } from '../utils/utils';
import { setStylingCSSVars, unsetStylingCSSVars } from '../settings/cssVars';
import { modalObserverLoad, modalObserverUnload } from '../settings/modalObserver';
import { tabsPluginLoad, tabsPluginUnload, tabPluginInjectCSSVars } from '../extPlugins/tabs';
import { tweakSettingsLoad, tweakSettingsUnload } from '../settings/tweakSettings';
import { settingsLoad, onSettingsChangedCallback } from '../settings/settings';

export const pluginLoad = async () => {
    body.classList.add(globals.isPluginEnabled);
    registerPlugin();
    settingsLoad();
    runStuff();
    // Listen for theme activated
    logseq.App.onThemeChanged((theme) => {
        onThemeChangedCallback(theme as Theme);
    });

    // Listen for theme mode changed
    logseq.App.onThemeModeChanged(() => {
        onThemeModeChangedCallback();
    });

    // Listen plugin unload
    logseq.beforeunload(async () => {
        pluginUnload();
    });

    // Listen settings update
    logseq.onSettingsChanged((settings, oldSettings) => {
        onSettingsChangedCallback(settings, oldSettings);
    });

    if (globals.pluginConfig.featureUpdaterEnabled) {
        setTimeout(() => {
            checkUpdate();
        }, 8000)
    }
}

const pluginUnload = async () => {
    body.classList.remove(globals.isPluginEnabled);
    stopStuff();
}

const registerPlugin = async () => {
    const themeURL = `lsp://logseq.io/${globals.pluginID}/dist/assets/awesomeStyler.css`;
    const themeLight: Theme = {
        name: 'Awesome Styler Light',
        url: themeURL,
        description: 'Light customizable theme theme with extra stuff',
        mode: 'light',
        pid: globals.pluginID
    }
    const themeDark: Theme = {
        name: 'Awesome Styler Dark',
        url: themeURL,
        description: 'Dark customizable theme theme with extra stuff',
        mode: 'dark',
        pid: globals.pluginID
    }
    logseq.provideTheme(themeLight);
    logseq.provideTheme(themeDark);
    logseq.provideStyle(`
        body:not(.is-awSt-theme) .panel-wrap[data-id="logseq-awesome-styler"] [data-key] {
            display: none;
        }
        body:not(.is-awSt-theme) .panel-wrap[data-id="logseq-awesome-styler"] [data-key="infoWarning"] {
            display: block;
        }
    `);
}

const runStuff = async () => {
    if (!globals.isThemeChosen()) {
        return;
    }
    body.classList.add(globals.isAwesomeStylerThemeClass);
    let runtimeout = 500;
    const presetName = globals.pluginConfig.presetName;
    if (!presetName) {
        console.log(`AwesomeStyler: no settings ini file! Run later`);
        runtimeout = 2000;
    }
    globals.getDOMContainers();
    setTimeout(() => {
        body.classList.add(`awSt-preset-${globals.pluginConfig.presetName}`);
        setStylingCSSVars();
        modalObserverLoad()
        tweakSettingsLoad();
        tabsPluginLoad();
    }, runtimeout);
}

const stopStuff = () => {
    body.classList.remove(globals.isAwesomeStylerThemeClass);
    body.classList.remove(`awSt-preset-${globals.pluginConfig.presetName}`);
    unsetStylingCSSVars();
    modalObserverUnload();
    tweakSettingsUnload();
    tabsPluginUnload();
}

// Theme  changed
const onThemeChangedCallback = (theme: Theme) => {
    if (theme.pid === globals.pluginID) {
        console.log(`AwesomeStyler: switching to its theme detected!`);
        runStuff();
    } else {
        stopStuff();
    }
}

// Theme mode changed
const onThemeModeChangedCallback = () => {
    if (globals.tabsPluginIframe) {
        tabPluginInjectCSSVars();
    }
    if (globals.isThemeChosen()) {
        setStylingCSSVars();
    }
}
