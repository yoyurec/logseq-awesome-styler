import { Theme } from '@logseq/libs/dist/LSPlugin.user';

import {
    globalContext,
    body,
    setStylingCSSVars, unsetStylingCSSVars,
    tabPluginInjectCSSVars
} from '../internal';

export const themeLoad = async () => {
    registerTheme();
    // Listen for theme activated
    logseq.App.onThemeChanged((theme) => {
        onThemeChangedCallback(theme as Theme);
    });

    // Listen for theme mode changed
    logseq.App.onThemeModeChanged(() => {
        onThemeModeChangedCallback();
    });
}

const registerTheme = async () => {
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

    // const pluginCSS = ``;
    // logseq.provideStyle(pluginCSS);
}

// Theme  changed
const onThemeChangedCallback = (theme: Theme) => {
    if (theme.pid === globalContext.pluginID) {
        console.log(`AwesomeStyler: switching to its theme detected!`);
        setStylingCSSVars();
        body.classList.add(globalContext.isAwesomeStylerThemeClass);
    } else {
        unsetStylingCSSVars();
    }
    if (globalContext.tabsPluginIframe) {
        tabPluginInjectCSSVars();
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
