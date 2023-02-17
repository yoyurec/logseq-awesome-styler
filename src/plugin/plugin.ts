import { Theme } from '@logseq/libs/dist/LSPlugin.user';

import { doc, body, globals } from '../modules/globals/globals';

import { checkPluginUpdate  } from '../utils/utils';
import { modalObserverLoad, modalObserverUnload } from '../settings/modalObserver';
import { tweakSettingsLoad } from '../settings/tweakSettings';
import { settingsLoad, onSettingsChangedCallback, setThemeAndPluginsCSS, settingsUnload, unsetThemeAndPluginsCSS } from '../settings/settings';
import { presetsList } from '../settings/settingsConfig';

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
        closePresetsPanel: closePresetsPanel,
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
                <a
                class="button" id="awSt-presets-button"
                data-on-click="togglePresetsPanel" data-rect>
                    <i class="ti ti-palette"></i>
                </a>
            `
        }
    )
}

const generatePresetsList = () => {
    const app = document.getElementById('awSt-app');
    const appInner = document.getElementById('awSt-app-inner');
    const appSettingsBtn = document.getElementById('awSt-app-settings-btn');
    document.querySelector('.awSt-presets')?.remove();
    const presetsContainer = document.createElement('div');
    presetsContainer.classList.add('awSt-presets');
    for (let i = 0; i < presetsList.length; ++i) {
        const presetItem = presetsList[i];
        const presetItemEl = document.createElement('a');
        presetItemEl.classList.add('awSt-presets__item');
        if (presetItem === globals.pluginConfig.presetName) {
            presetItemEl.classList.add('chosen');
        }
        presetItemEl.id = presetItem;
        presetItemEl.textContent = presetItem.replace('_', ' ');
        presetsContainer.appendChild(presetItemEl);
    }
    appInner!.appendChild(presetsContainer);
    app!.addEventListener('click', containerClickHandler);
    appSettingsBtn!.addEventListener('click', settingsBtnClickHandler);
}

const containerClickHandler = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('awSt-presets__item')) {
        logseq.updateSettings({ presetName: target!.id });
    }
    closePresetsPanel();
}

const settingsBtnClickHandler = () => {
    logseq.showSettingsUI();
}

const openPresetsPanel = () => {
    if (!globals.isThemeChosen) {
        showThemeWarning();
        return;
    }
    setPopupPosition();
    generatePresetsList();
    logseq.showMainUI();
}

const showThemeWarning = () => {
    // @ts-ignore
    parent.window.logseq.api.show_themes();
    logseq.UI.showMsg(`Choose "Awesome Styler" theme first!`, 'warning', { timeout: 5000 });
}

const closePresetsPanel = async () => {
    logseq.hideMainUI();
}

const togglePresetsPanel = () => {
    if (logseq.isMainUIVisible) {
        closePresetsPanel();
    } else {
        openPresetsPanel();
    }
}

const setPopupPosition = () => {
    const button = doc.querySelector('#awSt-presets-button');
    if (button) {
        const buttonPos = button.getBoundingClientRect();
        const appInner = document.getElementById('awSt-app-inner');
        Object.assign(
            appInner!.style,
            {
                top: `${buttonPos.top + 40}px`,
                left: `${buttonPos.left - 140}px`,
                // items + padding + settings btn
                height: `${presetsList.length * 36 + 16 + 38}px`
            }
        );
    }
}

const runThemeStuff = async () => {
    globals.isThemeChosen = true;
    body.classList.add(globals.isAwesomeStylerThemeClass);
    body.classList.add(`awSt-preset-${globals.pluginConfig.presetName}`);

    setTimeout(() => {
        setThemeAndPluginsCSS();
    }, 500);

    setTimeout(() => {
        tweakSettingsLoad();
      }, 1000);
}

const stopThemeStuff = () => {
    globals.isThemeChosen = false;
    body.classList.remove(globals.isAwesomeStylerThemeClass);
    body.classList.remove(`awSt-preset-${globals.pluginConfig.presetName}`);
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
