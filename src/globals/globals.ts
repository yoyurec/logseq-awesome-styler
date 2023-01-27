import { logseq as PL } from '../../package.json';

type globalsType = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export const globals: globalsType = {
    pluginID: PL.id,
    oldPluginConfig: null,
    pluginConfig: null,
    isPresetApplied: null,
    isPresetCopied: null,
    isSettingsDuplicated: null,
    isPluginEnabled: 'is-awSt-enabled',
    isAwesomeStylerThemeClass: 'is-awSt-theme',
    isSettingsOpenedClass: 'is-settings-opened',
    themeMode: '',
    tabsPluginIframe: null,
    isThemeChosen: function () {
        if (doc.querySelector(`link[href="lsp://logseq.io/${this.pluginID}/dist/assets/awesomeStyler.css"]`)) {
            return true;
        }
        return false
    },
    promoAwesomeUIMsg: '⚡ Redesigned Logseq UI (wide search, header/sidebars buttons rearrange, tabs on top, kanban/columns, headers labels ,tasks recoloring, etc...) functionality moved to separate plugin "Awesome UI" (https://github.com/yoyurec/logseq-awesome-ui)',
    promoAwesomeLinksMsg: '⭐ Favicons & internal links icons functionality moved to separate plugin "Awesome Links" (https://github.com/yoyurec/logseq-awesome-links)',
    settingsWarningMsg: '⚠ Use [Main menu ("...") -> Settings -> Plugins -> Awesome Styler] instead!',
    themeWarningMsg: '⚠ Switch to "Awesome Styler" theme to enable settings',
};

export let modalContainer: HTMLElement | null;
export let submodalContainer: HTMLElement | null;

export const doc = parent.document;
export const root = doc.documentElement;
export const body = doc.body;

export const getDOMContainers = async () => {
    modalContainer = doc.querySelector('.ui__modal-panel');
    submodalContainer = doc.querySelector('.theme-inner');
}
