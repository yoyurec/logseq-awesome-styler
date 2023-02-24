import { Theme } from '@logseq/libs/dist/LSPlugin.user';

import { doc, body, globals } from '../modules/globals/globals';

import { checkPluginUpdate  } from '../utils/utils';
import { modalObserverLoad, modalObserverUnload } from '../settings/modalObserver';
import { tweakSettingsLoad } from '../settings/tweakSettings';
import { settingsLoad, onSettingsChangedCallback, setThemeAndPluginsCSS, settingsUnload, unsetThemeAndPluginsCSS } from '../settings/settings';
import { togglePresetsPanel } from './pluginPopup';

import pluginStyles from './plugin.css?inline';

export const pluginLoad = async () => {
    body.classList.add(globals.isPluginEnabled);
    registerPlugin();
    if (!isThemeChosen()) {
        return;
    }
    modalObserverLoad();
    runThemeStuff();
}

const pluginUnload = async () => {
    body.classList.remove(globals.isPluginEnabled);
    unregisterPlugin();
    modalObserverUnload();
    stopThemeStuff();
}

const registerPlugin = async () => {
    settingsLoad();
    registerTheme();
    logseq.provideModel({
        togglePresetsPanel: togglePresetsPanel,
    });
    registerToolbarButton();
    logseq.provideStyle({ key: 'awSt-plugin-css', style: pluginStyles });

    if (globals.pluginConfig.featureUpdaterEnabled) {
        setTimeout(() => {
            checkPluginUpdate();
        }, 8000)
    }

    // Listen for theme activated
    logseq.App.onThemeChanged(() => {
        onThemeChangedCallback();
    });

    // Listen for theme mode changed
    logseq.App.onThemeModeChanged(() => {
        onThemeModeChangedCallback();
    });

    // Listen settings update
    logseq.onSettingsChanged((settings, oldSettings) => {
        onSettingsChangedCallback(settings, oldSettings);
    });

    // Listen plugin unload
    logseq.beforeunload(async () => {
        pluginUnload();
    });
}

const unregisterPlugin = () => {
    settingsUnload();
    doc.head.querySelector('style[data-injected-style^="awSt-plugin-css"]')?.remove();
 }

const registerTheme = () => {
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
 }

const registerToolbarButton = () => {
    logseq.App.registerUIItem(
        'toolbar',
        {
            key: 'AwesomeStyler',
            template: `
                <button
                class="button" id="awSt-presets-button"
                data-on-click="togglePresetsPanel" data-rect>
                    <span class="ti ti-palette"></span>
                </button>
            `
        }
    )
}

const runThemeStuff = async () => {
    globals.isThemeChosen = true;
    body.dataset[globals.isAwesomeStylerThemeAttr] = '';
    body.dataset.awstPreset = globals.pluginConfig.presetName;

    setTimeout(() => {
        setThemeAndPluginsCSS();
    }, 500);

    setTimeout(() => {
        tweakSettingsLoad();
      }, 1000);
}

const stopThemeStuff = () => {
    globals.isThemeChosen = false;
    delete body.dataset[globals.isAwesomeStylerThemeAttr];
    delete body.dataset.awstPreset;
    unsetThemeAndPluginsCSS();
}

const isThemeChosen = () => {
    if (doc.querySelector(`link[href="lsp://logseq.io/${globals.pluginID}/dist/assets/awesomeStyler.css"]`)) {
        return true;
    }
    return false;
}

// Theme  changed
const onThemeChangedCallback = () => {
    if (isThemeChosen()) {
        console.log(`AwesomeStyler: switching to its theme detected!`);
        runThemeStuff();
    } else {
        stopThemeStuff();
    }
}

// Theme mode changed
const onThemeModeChangedCallback = () => {
    onThemeChangedCallback();
}
