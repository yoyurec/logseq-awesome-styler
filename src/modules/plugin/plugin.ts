import { Theme } from '@logseq/libs/dist/LSPlugin.user';

import {
    body,
    getDOMContainers,
    globalContext,
    setStylingCSSVars,
    tabPluginInjectCSSVars, tabsPluginLoad, tabsPluginUnload,
    tweakSettingsLoad, tweakSettingsUnload, unsetStylingCSSVars
} from '../internal';
import { checkUpdate } from '../utils';

export const pluginLoad = async () => {
    body.classList.add(globalContext.isPluginEnabled);
    registerPlugin();
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

    if (globalContext.pluginConfig.featureUpdaterEnabled) {
        setTimeout(() => {
            checkUpdate();
        }, 8000)
    }
}

const pluginUnload = async () => {
    body.classList.remove(globalContext.isPluginEnabled);
    stopStuff();
}

const registerPlugin = async () => {
    const themeURL = `lsp://logseq.io/${globalContext.pluginID}/dist/assets/awesomeStyler.css`;
    const themeLight: Theme = {
        name: 'Awesome Styler Light',
        url: themeURL,
        description: 'Light customizable theme theme with extra stuff',
        mode: 'light',
        pid: globalContext.pluginID
    }
    const themeDark: Theme = {
        name: 'Awesome Styler Dark',
        url: themeURL,
        description: 'Dark customizable theme theme with extra stuff',
        mode: 'dark',
        pid: globalContext.pluginID
    }
    logseq.provideTheme(themeLight);
    logseq.provideTheme(themeDark);
    logseq.provideStyle(`
        body:not(.is-awSt-theme) .panel-wrap[data-id="logseq-awesome-styler"] [data-key] {
            display: none;
        }
        .panel-wrap[data-id="logseq-awesome-styler"] [data-key="infoWarning"] {
            display: block !important;
        }
    `);
}

const runStuff = async () => {
    if (!globalContext.isThemeChosen()) {
        return;
    }
    body.classList.add(globalContext.isAwesomeStylerThemeClass);
    let runtimeout = 500;
    const presetName = logseq.settings?.presetName;
    if (!presetName) {
        console.log(`AwesomeStyler: no settings ini file! Run later`);
        runtimeout = 2000;
    }
    getDOMContainers();
    setTimeout(() => {
        body.classList.add(`awSt-preset-${logseq.settings?.presetName}`);
        setStylingCSSVars();
        tweakSettingsLoad();
        tabsPluginLoad();
    }, runtimeout);
}

const stopStuff = () => {
    body.classList.remove(globalContext.isAwesomeStylerThemeClass);
    body.classList.remove(`awSt-preset-${globalContext.pluginConfig.presetName}`);
    unsetStylingCSSVars();
    tweakSettingsUnload();
    tabsPluginUnload();
}

// Theme  changed
const onThemeChangedCallback = (theme: Theme) => {
    if (theme.pid === globalContext.pluginID) {
        console.log(`AwesomeStyler: switching to its theme detected!`);
        runStuff();
    } else {
        stopStuff();
    }
}

// Theme mode changed
const onThemeModeChangedCallback = () => {
    if (globalContext.tabsPluginIframe) {
        tabPluginInjectCSSVars();
    }
    if (globalContext.isThemeChosen()) {
        setStylingCSSVars();
    }
}
