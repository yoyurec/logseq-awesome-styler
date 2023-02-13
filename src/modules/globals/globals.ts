import { logseq as PL } from '../../../package.json';

type globalsType = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export const doc = parent.document;
export const root = doc.documentElement;
export const body = doc.body;

export const globals: globalsType = {
    promoAwesomeUIMsg: '⚡ Redesigned Logseq UI (wide search, header/sidebars buttons rearrange, tabs on top, kanban/columns, headers labels ,tasks recoloring, etc...) functionality moved to separate plugin "Awesome UI" (https://github.com/yoyurec/logseq-awesome-ui)',
    promoAwesomeLinksMsg: '⭐ Favicons & internal links icons functionality moved to separate plugin "Awesome Links" (https://github.com/yoyurec/logseq-awesome-links)',
    themeWarningMsg: '⚠ Switch to "Awesome Styler" theme to enable settings',
    pluginID: PL.id,
    oldPluginConfig: null,
    pluginConfig: null,
    isPresetWrittenToSettings: false,
    isPredefinedPresetClonedToCustom: false,
    isSettingsItemWrittenToCustomPreset: false,
    isPluginEnabled: 'is-awSt-enabled',
    isAwesomeStylerTheme: false,
    isAwesomeStylerThemeClass: 'is-awSt-theme',
    isAwStSettingsPopupOpenedClass: 'is-awSt-settings-popup-opened',
    isLsSettingsOpenedClass: 'is-ls-settings-opened',
    isLsPluginsOpenedClass: 'is-ls-plugins-opened',
    themeMode: '',
    mainCSSVars: '',
};
