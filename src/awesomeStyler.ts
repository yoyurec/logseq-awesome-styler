import '@logseq/libs';

import {
    globalContext,
    body, getDOMContainers,
    themeLoad,
    setStylingCSSVars, unsetStylingCSSVars,
    tabsPluginLoad, tabsPluginUnload,
    tweakSettingsLoad, tweakSettingsUnload,
    settingsLoad
} from './modules/internal';
import { checkUpdate } from './modules/utils';

import './awesomeStyler.css';



// Main logic runners
const runStuff = async () => {
    globalContext.isThemeRunned = true;
    let runtimeout = 500;
    const presetName = logseq.settings?.presetName;
    if (!presetName) {
        console.log(`AwesomeStyler: no settings ini file! Run later`);
        runtimeout = 2000;
    }

    getDOMContainers();

    setTimeout(() => {
        body.classList.add(`awSt-preset-${logseq.settings?.presetName}`);

        if (globalContext.isThemeChosen()) {
            body.classList.add(globalContext.isAwesomeStylerThemeClass);
            setStylingCSSVars();
        }
        tweakSettingsLoad();
        tabsPluginLoad();
        body.classList.add(globalContext.isAwesomeStylerLoadedClass);
    }, runtimeout);
}

const stopStuff = () => {
    globalContext.isThemeRunned = false;
    body.classList.remove(`awSt-preset-${globalContext.pluginConfig.presetName}`);
    unsetStylingCSSVars();
    tweakSettingsUnload();
    tabsPluginUnload();
    body.classList.remove(globalContext.isAwesomeStylerLoadedClass);
}

// Main logseq on ready
const main = async () => {
    console.log(`AwesomeStyler: plugin loaded`);

    settingsLoad();
    themeLoad();

    runStuff();

    // Listen plugin unload
    logseq.beforeunload(async () => {
        stopStuff();
    });

    setTimeout(() => {
        checkUpdate();
    }, 8000);

};

logseq.ready(main).catch(null);
