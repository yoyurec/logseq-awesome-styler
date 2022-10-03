import '@logseq/libs';
import type Pickr from '@simonwep/pickr';
import { lighten, darken, transparentize, mix, toHex, readableColor } from 'color2k';
import { SettingSchemaDesc, LSPluginBaseInfo, Theme } from '@logseq/libs/dist/LSPlugin.user';
import { logseq as PL } from '../../package.json';

import '../css/awesomeStyler.css';

import tabsPluginStyles from '../css/tabsPlugin.css?inline';

declare global {
    interface Window {
        Pickr: Pickr;
    }
}

interface Preset {
    [key: string]: {
        [key: string]: string | number | boolean;
    };
}

const pluginID = PL.id;
const isAwesomeStylerThemeClass = 'is-awesomeStyler-theme';
const isAwesomeStylerLoadedClass = 'is-awesomeStyler-loaded';
const isTabsLoadedClass = 'is-tabs-loaded';
const isSettingsOpenedClass = 'is-settings-opened';

let doc: Document;
let root: HTMLElement;
let body: HTMLElement;
let modalContainer: HTMLElement | null;
let tabsPluginIframe: HTMLIFrameElement | null;


let isPresetApplied: boolean;
let isPresetCopied: boolean;
let isSettingsDuplicated: boolean;
let isThemeRunned: boolean;
let themeMode: string;
let pluginConfig: LSPluginBaseInfo['settings'];
let oldPluginConfig: LSPluginBaseInfo['settings'];

const promoAwesomeUIMsg = '⚡ Redesigned Logseq UI (wide search, header/sidebars buttons rearrange, tabs on top, kanban/columns, headers labels ,tasks recoloring, etc...) functionality moved to separate plugin "Awesome UI" (https://github.com/yoyurec/logseq-awesome-ui)'
const promoAwesomeLinksMsg = '⭐ Favicons & internal links icons functionality moved to separate plugin "Awesome Links" (https://github.com/yoyurec/logseq-awesome-links)'

const presets: Preset = {
    Solarized_default: {
        fontContentName: 'Fira Sans (theme default)',
        fontContentSize: '16px',
        colorLightTitleText: '#009991',
        colorLightContentText: '#354145',
        colorLightContentTextBold: '#334247',
        colorLightContentTextItalic: '#354145',
        colorLightLink: '#009991',
        colorLightLinkExt: '#B88726',
        colorLightTag: '#008ECE',
        colorLightUiPanelsBg: '#EDE4D4',
        colorLightUiBodyBg: '#FEF8EC',
        colorLightContentBg: '#FEF8EC',
        colorLightContentPropsBg: '#F0E9DB',
        colorLightContentAltBg: '#F0E9DB',
        colorLightH1: '#354145',
        colorLightH2: '#354145',
        colorLightH3: '#354145',
        colorLightH4: '#354145',
        colorLightH5: '#354145',
        colorLightH6: '#354145',
        colorLightMarkBg: '#F9D86C',
        colorLightMarkText: '#334247',
        colorLightQuoteBg: '#D7EADD',
        colorLightQuoteText: '#334247',
        colorDarkTitleText: '#B88726',
        colorDarkContentText: '#AFB6B6',
        colorDarkContentTextBold: '#AFB6B6',
        colorDarkContentTextItalic: '#AFB6B6',
        colorDarkLink: '#B88726',
        colorDarkLinkExt: '#738500',
        colorDarkTag: '#008ECE',
        colorDarkH1: '#AFB6B6',
        colorDarkH2: '#AFB6B6',
        colorDarkH3: '#AFB6B6',
        colorDarkH4: '#AFB6B6',
        colorDarkH5: '#AFB6B6',
        colorDarkH6: '#AFB6B6',
        colorDarkUiPanelsBg: '#002933',
        colorDarkUiBodyBg: '#00323d',
        colorDarkContentBg: '#00323d',
        colorDarkContentPropsBg: '#073945',
        colorDarkContentAltBg: '#073945',
        colorDarkMarkBg: '#F9D86C',
        colorDarkMarkText: '#334247',
        colorDarkQuoteBg: '#223F3F',
        colorDarkQuoteText: '#AFB6B6',
        backgroundURL: 'lsp://logseq.io/logseq-awesome-styler/dist/img/bg.webp',
        backgroundPadding: '20px 40px 20px 40px',
        backgroundShadow: true,
        bannersAsBackground: true,
        bannersIconGlow: true,
        contentMaxWidth: '1100px',
        contentWideMaxWidth: '1600px'
    },
    Logseq_original: {
        fontContentName: 'Inter (Logseq default)',
        fontContentSize: '16px',
        colorLightTitleText: '#433F38',
        colorLightContentText: '#433F38',
        colorLightContentTextBold: '#433F38',
        colorLightContentTextItalic: '#433F38',
        colorLightLink: '#106BA3',
        colorLightLinkExt: '#106BA3',
        colorLightTag: '#106BA3',
        colorLightUiPanelsBg: '#FFFFFF',
        colorLightUiBodyBg: '#FFFFFF',
        colorLightContentBg: '#FFFFFF',
        colorLightContentPropsBg: '#F7F7F7',
        colorLightContentAltBg: '#F7F7F7',
        colorLightH1: '#433F38',
        colorLightH2: '#433F38',
        colorLightH3: '#433F38',
        colorLightH4: '#433F38',
        colorLightH5: '#433F38',
        colorLightH6: '#433F38',
        colorLightMarkBg: '#FEF4AE',
        colorLightMarkText: '#262626',
        colorLightQuoteBg: '#FBFAF8',
        colorLightQuoteText: '#433F38',
        colorDarkTitleText: '#A4B5B6',
        colorDarkContentText: '#A4B5B6',
        colorDarkContentTextBold: '#A4B5B6',
        colorDarkContentTextItalic: '#A4B5B6',
        colorDarkLink: '#8ABBBB',
        colorDarkLinkExt: '#8ABBBB',
        colorDarkTag: '#8ABBBB',
        colorDarkUiPanelsBg: '#003642',
        colorDarkUiBodyBg: '#052B36',
        colorDarkContentBg: '#052B36',
        colorDarkContentPropsBg: '#083643',
        colorDarkContentAltBg: '#083643',
        colorDarkH1: '#A4B5B6',
        colorDarkH2: '#A4B5B6',
        colorDarkH3: '#A4B5B6',
        colorDarkH4: '#A4B5B6',
        colorDarkH5: '#A4B5B6',
        colorDarkH6: '#A4B5B6',
        colorDarkMarkBg: '#FEF4AE',
        colorDarkMarkText: '#262626',
        colorDarkQuoteBg: '#083643',
        colorDarkQuoteText: '#A4B5B6',
        backgroundURL: '',
        backgroundPadding: '32px 32px 32px 32px',
        backgroundShadow: false,
        bannersAsBackground: false,
        bannersIconGlow: false,
        contentMaxWidth: '940px',
        contentWideMaxWidth: '100%'
    },
    Mia_quattro: {
        fontContentName: 'iA Writer Quattro',
        fontContentSize: '16px',
        colorLightTitleText: '#1A1A1A',
        colorLightContentText: '#1A1A1A',
        colorLightContentTextBold: '#1A1A1A',
        colorLightContentTextItalic: '#1A1A1A',
        colorLightLink: '#0B82B9',
        colorLightLinkExt: '#0B82B9',
        colorLightTag: '#747474',
        colorLightUiPanelsBg: '#EAEAEA',
        colorLightUiBodyBg: '#F7F7F7',
        colorLightContentBg: '#F7F7F7',
        colorLightContentPropsBg: '#EAEAEA',
        colorLightContentAltBg: '#EAEAEA',
        colorLightH1: '#1A1A1A',
        colorLightH2: '#1A1A1A',
        colorLightH3: '#1A1A1A',
        colorLightH4: '#1A1A1A',
        colorLightH5: '#1A1A1A',
        colorLightH6: '#1A1A1A',
        colorLightMarkBg: '#FDEB95',
        colorLightMarkText: '#262626',
        colorLightQuoteBg: '#EAEAEA',
        colorLightQuoteText: '#1A1A1A',
        colorDarkTitleText: '#CCCCCC',
        colorDarkContentText: '#CCCCCC',
        colorDarkContentTextBold: '#CCCCCC',
        colorDarkContentTextItalic: '#CCCCCC',
        colorDarkLink: '#18BDEC',
        colorDarkLinkExt: '#18BDEC',
        colorDarkTag: '#909090',
        colorDarkUiPanelsBg: '#27272A',
        colorDarkUiBodyBg: '#18181A',
        colorDarkContentBg: '#18181A',
        colorDarkContentPropsBg: '#27272A',
        colorDarkContentAltBg: '#27272A',
        colorDarkH1: '#CCCCCC',
        colorDarkH2: '#CCCCCC',
        colorDarkH3: '#CCCCCC',
        colorDarkH4: '#CCCCCC',
        colorDarkH5: '#CCCCCC',
        colorDarkH6: '#CCCCCC',
        colorDarkMarkBg: '#FCE386',
        colorDarkMarkText: '#262626',
        colorDarkQuoteBg: '#27272A',
        colorDarkQuoteText: '#CCCCCC',
        backgroundURL: '',
        backgroundPadding: '32px 32px 32px 32px',
        backgroundShadow: false,
        bannersAsBackground: false,
        bannersIconGlow: false,
        contentMaxWidth: '940px',
        contentWideMaxWidth: '100%'
    },
    Chocolate: {
        fontContentName: 'Fira Sans (theme default)',
        fontContentSize: '16px',
        colorLightTitleText: '#2D3D43',
        colorLightContentText: '#2D3D43',
        colorLightContentTextBold: '#C26356',
        colorLightContentTextItalic: '#9A6064',
        colorLightLink: '#368B96',
        colorLightLinkExt: '#368B96',
        colorLightTag: '#CA7B70',
        colorLightUiPanelsBg: '#E3D6CE',
        colorLightUiBodyBg: '#E9DED8',
        colorLightContentBg: '#E9DED8',
        colorLightContentPropsBg: '#D7D5D1',
        colorLightContentAltBg: '#E5D6D0',
        colorLightH1: '#2D3D43',
        colorLightH2: '#2D3D43',
        colorLightH3: '#2D3D43',
        colorLightH4: '#2D3D43',
        colorLightH5: '#2D3D43',
        colorLightH6: '#2D3D43',
        colorLightMarkBg: '#E5D1CB',
        colorLightMarkText: '#C26256',
        colorLightQuoteBg: '#D9C5C0',
        colorLightQuoteText: '#9A6064',
        colorDarkTitleText: '#B5937D',
        colorDarkContentText: '#B5937D',
        colorDarkContentTextBold: '#D54455',
        colorDarkContentTextItalic: '#C26356',
        colorDarkLink: '#56B6C2',
        colorDarkLinkExt: '#56B6C2',
        colorDarkTag: '#B33D4B',
        colorDarkUiPanelsBg: '#34282B',
        colorDarkUiBodyBg: '#2B2124',
        colorDarkContentBg: '#2B2124',
        colorDarkContentPropsBg: '#303134',
        colorDarkContentAltBg: '#34282B',
        colorDarkH1: '#B5937D',
        colorDarkH2: '#B5937D',
        colorDarkH3: '#B5937D',
        colorDarkH4: '#B5937D',
        colorDarkH5: '#B5937D',
        colorDarkH6: '#B5937D',
        colorDarkMarkBg: '#3D2529',
        colorDarkMarkText: '#D54455',
        colorDarkQuoteBg: '#492E2E',
        colorDarkQuoteText: '#C26356',
        backgroundURL: 'lsp://logseq.io/logseq-awesome-styler/dist/img/chocolate-bg.webp',
        backgroundPadding: '32px 32px 32px 32px',
        backgroundShadow: true,
        bannersAsBackground: false,
        bannersIconGlow: false,
        contentMaxWidth: '940px',
        contentWideMaxWidth: '100%'
    }
};

const settingSchema: SettingSchemaDesc[] = [
    {
        key: 'promoAwesomeLinks',
        title: '',
        description: promoAwesomeLinksMsg,
        type: 'boolean',
        default: false,
    },
    {
        key: 'promoAwesomeUI',
        title: '',
        description: promoAwesomeUIMsg,
        type: 'boolean',
        default: false,
    },
    {
        key: 'infoWarning',
        title: '',
        description: 'Switch to "Awesome Styler" theme to enable settings',
        type: 'boolean',
        default: false,
    },
    {
        key: 'presetHeading',
        title: 'Presets',
        description: '',
        type: 'heading',
        default: null,
    },
    {
        key: 'presetName',
        title: 'Choose preset: built-in (uneditable ⚠) OR user "Custom" (editable)',
        description: '(press "Clone" button to copy values to your "Custom" preset with overwriting it ⚠)',
        type: 'enum',
        enumPicker: 'select',
        enumChoices: [
            'Solarized_default',
            'Logseq_original',
            'Mia_quattro',
            'Chocolate',
            'Custom'
        ],
        default: 'Solarized_default',
    },
    {
        key: 'presetCustom',
        title: 'Custom theme configuration',
        description: '',
        type: 'object',
        default: presets.Solarized_default,
    },
    {
        key: 'fontHeading',
        title: 'Font',
        description: '',
        type: 'heading',
        default: null,
    },
    {
        key: 'fontContentName',
        title: 'Content font name',
        description: '',
        type: 'enum',
        enumPicker: 'select',
        enumChoices: [
            'Fira Sans (theme default)',
            'Fira Code Nerd',
            'iA Writer Quattro',
            'Inter (Logseq default)',
            'OS System default'
        ],
        default: presets.Solarized_default.fontContentName,
    },
    {
        key: 'fontContentSize',
        title: 'Content font size',
        description: '',
        type: 'string',
        default: presets.Solarized_default.fontContentSize,
    },
    {
        key: 'colorLightHeading',
        title: 'Colors: light mode (switch to dark to see it`s settings)',
        description: '',
        type: 'heading',
        default: null,
    },
    {
        key: 'colorLightUiPanelsBg',
        title: 'UI bg',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightUiPanelsBg
    },
    {
        key: 'colorLightUiBodyBg',
        title: 'Body bg',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightUiBodyBg
    },
    {
        key: 'colorLightContentBg',
        title: 'Page bg',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightContentBg
    },
    {
        key: 'colorLightContentPropsBg',
        title: 'Props bg',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightContentPropsBg
    },
    {
        key: 'colorLightContentAltBg',
        title: 'References bg',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightContentAltBg
    },
    {
        key: 'colorLightTitleText',
        title: 'Title',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightTitleText
    },
    {
        key: 'colorLightContentText',
        title: 'Text',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightContentText
    },
    {
        key: 'colorLightContentTextBold',
        title: 'Bold',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightContentTextBold
    },
    {
        key: 'colorLightContentTextItalic',
        title: 'Italic',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightContentTextItalic
    },
    {
        key: 'colorLightLink',
        title: 'Link (internal)',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightLink
    },
    {
        key: 'colorLightLinkExt',
        title: 'Link (external)',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightLinkExt
    },
    {
        key: 'colorLightTag',
        title: 'Tag',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightTag
    },
    {
        key: 'colorLightH1',
        title: 'H1',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightH1
    },
    {
        key: 'colorLightH2',
        title: 'H2',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightH2
    },
    {
        key: 'colorLightH3',
        title: 'H3',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightH3
    },
    {
        key: 'colorLightH4',
        title: 'H4',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightH4
    },
    {
        key: 'colorLightH5',
        title: 'H5',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightH5
    },
    {
        key: 'colorLightH6',
        title: 'H6',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightH6
    },
    {
        key: 'colorLightMarkBg',
        title: 'Highlight bg',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightMarkBg
    },
    {
        key: 'colorLightMarkText',
        title: 'Highlight text',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightMarkText
    },
    {
        key: 'colorLightQuoteBg',
        title: 'Quote bg',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightQuoteBg
    },
    {
        key: 'colorLightQuoteText',
        title: 'Quote text',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorLightQuoteText
    },
    {
        key: 'colorDarkHeading',
        title: 'Colors: dark mode (switch to light to see it`s settings)',
        description: '',
        type: 'heading',
        default: null,
    },
    {
        key: 'colorDarkUiPanelsBg',
        title: 'UI bg',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkUiPanelsBg
    },
    {
        key: 'colorDarkUiBodyBg',
        title: 'Body bg',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkUiBodyBg
    },
    {
        key: 'colorDarkContentBg',
        title: 'Page bg',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkContentBg
    },
    {
        key: 'colorDarkContentPropsBg',
        title: 'Props bg',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkContentPropsBg
    },
    {
        key: 'colorDarkContentAltBg',
        title: 'References bg',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkContentAltBg
    },
    {
        key: 'colorDarkTitleText',
        title: 'Title',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkTitleText
    },
    {
        key: 'colorDarkContentText',
        title: 'Text',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkContentText
    },
    {
        key: 'colorDarkContentTextBold',
        title: 'Bold',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkContentTextBold
    },
    {
        key: 'colorDarkContentTextItalic',
        title: 'Italic',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkContentTextItalic
    },
    {
        key: 'colorDarkLink',
        title: 'Link (internal)',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkLink
    },
    {
        key: 'colorDarkLinkExt',
        title: 'Link (external)',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkLinkExt
    },
    {
        key: 'colorDarkTag',
        title: 'Tag',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkTag
    },
    {
        key: 'colorDarkH1',
        title: 'H1',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkH1
    },
    {
        key: 'colorDarkH2',
        title: 'H2',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkH2
    },
    {
        key: 'colorDarkH3',
        title: 'H3',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkH3
    },
    {
        key: 'colorDarkH4',
        title: 'H4',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkH4
    },
    {
        key: 'colorDarkH5',
        title: 'H5',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkH5
    },
    {
        key: 'colorDarkH6',
        title: 'H6',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkH6
    },
    {
        key: 'colorDarkMarkBg',
        title: 'Highlight bg',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkMarkBg
    },
    {
        key: 'colorDarkMarkText',
        title: 'Highlight text',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkMarkText
    },
    {
        key: 'colorDarkQuoteBg',
        title: 'Quote bg',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkQuoteBg
    },
    {
        key: 'colorDarkQuoteText',
        title: 'Quote text',
        description: '',
        type: 'string',
        default: presets.Solarized_default.colorDarkQuoteText
    },
    {
        key: 'backgroundHeading',
        title: 'Background',
        description: '',
        type: 'heading',
        default: null,
    },
    {
        key: 'backgroundURL',
        title: 'Background URL (set empty to disable feature)',
        description: '',
        type: 'string',
        default: presets.Solarized_default.backgroundURL,
    },
    {
        key: 'backgroundPadding',
        title: 'Content background padding (top right bottom left)',
        description: '',
        type: 'string',
        default: presets.Solarized_default.backgroundPadding,
    },
    {
        key: 'backgroundShadow',
        title: '',
        description: 'Enable content shadow?',
        type: 'boolean',
        default: presets.Solarized_default.backgroundShadow
    },
    {
        key: 'bannersPluginHeading',
        title: 'Banners plugin support',
        description: '',
        type: 'heading',
        default: null,
    },
    {
        key: 'bannersAsBackground',
        title: '',
        description: 'Use banner image as blurred background?',
        type: 'boolean',
        default: presets.Solarized_default.bannersAsBackground,
    },
    {
        key: 'bannersIconGlow',
        title: '',
        description: 'Add glow to banner icon?',
        type: 'boolean',
        default: presets.Solarized_default.bannersIconGlow,
    },
    {
        key: 'sizeHeading',
        title: 'Sizes',
        description: '',
        type: 'heading',
        default: null,
    },
    {
        key: 'contentMaxWidth',
        title: 'Content max width (px, %, vw)',
        description: '',
        type: 'string',
        default: presets.Solarized_default.contentMaxWidth,
    },
    {
        key: 'contentWideMaxWidth',
        title: 'Content max width in wide mode (in px, %, vw)',
        description: '',
        type: 'string',
        default: presets.Solarized_default.contentWideMaxWidth,
    },
    {
        key: 'leftSidebarWidth',
        title: 'Left sidebar width (in px, %, vw)',
        description: '',
        type: 'string',
        default: '250px',
    },
    {
        key: 'rightSidebarWidth',
        title: 'Right sidebar width (in px, %, vw)',
        description: '',
        type: 'string',
        default: '460px',
    },
];

// Tweak settings
const tweakPluginSettings = () => {
    if (isThemeChosen()) {
        initInputs();
        initPresetCopy();
        initColorpickers();
    }
}

// Presets
const updatePresets = () => {
    applyPreset();
    refreshSettingsPage();
    initInputs();
    body.classList.remove(`awSt-preset-${oldPluginConfig.presetName}`);
    body.classList.add(`awSt-preset-${pluginConfig.presetName}`);
}

const refreshSettingsPage = () => {
    const closeSettings = doc.querySelector('.is-sub-modal .ui__modal-close') as HTMLAnchorElement;
    const awStPluginButton = doc.querySelector(`.settings-plugin-item[data-id="${pluginID}"]`) as HTMLAnchorElement;
    if (!awStPluginButton) {
        return;
    }
    const clickPlugin = doc.querySelectorAll(`.settings-plugin-list .settings-plugin-item:not([data-id="${pluginID}"])`);
    if (clickPlugin.length > 0) {
        (clickPlugin[0] as HTMLAnchorElement).click();
        setTimeout(() => {
            awStPluginButton.click();
        }, 100);
    } else {
        closeSettings.click();
        const settingsPluginButton = doc.querySelector('.settings-menu-link[data-id="plugins"]') as HTMLAnchorElement;
        setTimeout(() => {
            settingsPluginButton.click();
        }, 100);
        setTimeout(() => {
            awStPluginButton.click();
        }, 100);
    }
}

const initPresetCopy = () => {
    if (pluginConfig.presetName !== 'Custom') {
        const presetCopyButton = doc.querySelector(`.panel-wrap[data-id="${pluginID}"] .preset-clone-button`);
        if (presetCopyButton) {
            return;
        }
        const presetsSelector = doc.querySelector('.desc-item[data-key="presetName"] .form-select') as HTMLSelectElement;
        if (!presetsSelector) {
            return;
        }
        presetsSelector?.insertAdjacentHTML(
            'afterend',
            `<button class="button preset-clone-button" title="Clone preset values to your Custom preset and switch to it">
                <i class= "ti ti-clipboard-list"></i>Clone
            </button >`
        )
        doc.querySelector(`.panel-wrap[data-id="${pluginID}"] .preset-clone-button`)?.addEventListener('click', () => {
            isPresetCopied = true;
            logseq.updateSettings({
                presetCustom: { ...presets[presetsSelector.value] }
            });
            logseq.updateSettings({ presetName: 'Custom'});
        });
    }
}
const initInputs = () => {
    if (pluginConfig.presetName === 'Custom') {
        enableSettingsEditing();
    } else {
        disableSettingsEditing();
    }
}
// Disable settings form
const disableSettingsEditing = () => {
    const pluginPanel = doc.querySelector(`.panel-wrap[data-id="${pluginID}"]`);
    if (!pluginPanel) {
        return false;
    }
    const settingsList = pluginPanel.querySelectorAll('.desc-item :is(input, select)')
    if (settingsList.length) {
        for (let i = 0; i < settingsList.length; i++) {
            const settingsItem = settingsList[i] as HTMLInputElement;
            settingsItem.disabled = true;
        }
    }
    const presetsSelector = pluginPanel.querySelector('[data-key="presetName"] .form-select') as HTMLSelectElement;
    presetsSelector.disabled = false;
}
// Enable settings form
const enableSettingsEditing = () => {
    const pluginPanel = doc.querySelector(`.panel-wrap[data-id="${pluginID}"]`);
    if (!pluginPanel) {
        return false;
    }
    const settingsList = pluginPanel.querySelectorAll('.desc-item :is(.form-input, .form-select)')
    if (settingsList.length) {
        for (let i = 0; i < settingsList.length; i++) {
            const settingsItem = settingsList[i] as HTMLInputElement;
            settingsItem.disabled = false;
        }
    }
}

// Switch preset
const applyPreset = () => {
    let settingsVal = null;
    switch (pluginConfig.presetName) {
        case 'Solarized_default':
            settingsVal = presets.Solarized_default;
            break;
        case 'Logseq_original':
            settingsVal = presets.Logseq_original;
            break;
        case 'Mia_quattro':
            settingsVal = presets.Mia_quattro;
            break;
        case 'Chocolate':
            settingsVal = presets.Chocolate;
            break;
        case 'Custom':
            settingsVal = pluginConfig.presetCustom;
            break;
        default:
            settingsVal = presets.Solarized_default;
        }
    logseq.updateSettings(settingsVal);
    isPresetApplied = true;
    console.log(`AwesomeStyler: applied preset ${pluginConfig.presetName}`);
}

// Colors
const initColorpickers = () => {
    const pluginPanel = doc.querySelector(`.panel-wrap[data-id="${pluginID}"]`);
    if (!pluginPanel) {
        return false;
    }
    const isAlreadyInited = pluginPanel.getElementsByClassName('color-input-helper')[0];
    if (isAlreadyInited) {
        return false;
    }
    const colorSettingsList = pluginPanel.querySelectorAll(`.desc-item.as-input[data-key^="color${themeMode}"]`);
    if (colorSettingsList.length) {
        for (let i = 0; i < colorSettingsList.length; i++) {
            const colorSettingsItem = colorSettingsList[i] as HTMLElement;
            const colorSettingsKey = colorSettingsItem.getAttribute('data-key') || '';
            const colorSettingsInput = colorSettingsItem.getElementsByTagName('input')[0];
            colorSettingsInput.classList.add('color-input-helper');
            updateColorInputStyle(colorSettingsInput);
            if (pluginConfig.presetName !== 'Custom') {
                continue;
            }
            colorSettingsInput.addEventListener(`keyup`, (event) => {
                const target = event.target as HTMLInputElement;
                updateColorInputStyle(target);
            });
            colorSettingsInput.addEventListener(`change`, (event) => {
                const target = event.target as HTMLInputElement;
                updateColorInputStyle(target);
            });
            // @ts-ignore
            const pickr = parent.Pickr.create({
                container: colorSettingsItem,
                el: colorSettingsInput,
                theme: 'monolith',
                position: 'bottom-end',
                useAsButton: true,
                autoReposition: false,
                adjustableNumbers: true,
                components: {
                    // Main components
                    hue: true,
                    opacity: false,
                    interaction: {
                        input: true,
                        hex: true,
                        hsla: true
                      }
                }
            });
            pickr.on('show', () => {
                pickr.setColor(colorSettingsInput.value);
            });
            pickr.on('change', (color: Pickr.HSVaColor) => {
                const pickedColor = color.toHEXA().toString();
                colorSettingsInput.value = pickedColor;
                updateColorInputStyle(colorSettingsInput);
                 logseq.updateSettings({
                     [colorSettingsKey]: pickedColor
                 });
            });
        }
    }
}


// Update color input look
const updateColorInputStyle = (input: HTMLInputElement) => {
    const color = input.value;
    input.style.backgroundColor = color;
    input.style.color = readableColor(color);
}

// Detect modals opened/closed
let modalObserver: MutationObserver, modalObserverConfig: MutationObserverInit;
const modalCallback: MutationCallback = () => {
    if (!modalContainer) {
        return;
    }
    // Settings opened
    const settingsModal = modalContainer.querySelector('.cp__settings-main');
    if (settingsModal) {
        body.classList.add(isSettingsOpenedClass);
        initSettingsModal(settingsModal);
    } else {
        body.classList.remove(isSettingsOpenedClass);
    }
    // Plugins opened
    const pluginsModal = modalContainer.querySelector('.cp__plugins-page');
    if (pluginsModal) {
        initPluginsModal(pluginsModal);
    }
};
const initModalObserver = () => {
    modalObserverConfig = {
        attributes: true,
        attributeFilter: ['style']
    };
    modalObserver = new MutationObserver(modalCallback);
}
const runModalObserver = () => {
    if (!modalContainer) {
        return;
    }
    modalObserver.observe(modalContainer, modalObserverConfig);
}

const initSettingsModal = (settingsModal: Element) => {
    const settingsPluginButton = settingsModal.querySelector('.settings-menu-link[data-id="plugins"]');
    settingsPluginButton?.addEventListener('click', () => {
        setTimeout(() => {
            const awStPluginItem = doc.querySelector(`.ui__modal.is-sub-modal .settings-plugin-item[data-id="${pluginID}"]`) as HTMLAnchorElement;
            if (!awStPluginItem) {
                return;
            }
            if (awStPluginItem.parentElement?.classList.contains('active')) {
                setTimeout(() => {
                    tweakPluginSettings();
                }, 500)
            }
            const clickPlugin = doc.querySelectorAll('.settings-plugin-list li');
            if (clickPlugin.length > 1) {
                awStPluginItem.addEventListener('click', () => {
                    setTimeout(() => {
                        tweakPluginSettings();
                    }, 500)
                });
            }
        }, 500)
    });
}

const initPluginsModal = (pluginsModal: Element) => {
    const buttons = pluginsModal.querySelectorAll('.ui__button:first-child[intent="logseq"]:not(.load-unpacked)');
    buttons[0].addEventListener('click', () => {
        setTimeout(() => {
            moveAwStPluginButton(pluginsModal);
        }, 300)
    });
    buttons[1].addEventListener('click', () => {
        setTimeout(() => {
            moveAwStPluginButton(pluginsModal);
        }, 100)
    });
    moveAwStPluginButton(pluginsModal);
}

const moveAwStPluginButton = (pluginsModal: Element) => {
    const pluginsList = pluginsModal.querySelector('.cp__plugins-item-lists');
    const pluginButton = pluginsList?.querySelector(`img[src*="${pluginID}"]`)?.parentNode?.parentNode as Element;
    if (pluginsList && pluginButton) {
        pluginsList.insertAdjacentElement('afterbegin', pluginButton);
    }
}

// Add styles to TabsPlugin
const injectCssToPlugin = (iframeEl: HTMLIFrameElement, cssContent: string, id: string) => {
    const pluginDocument = iframeEl.contentDocument;
    if (pluginDocument) {
        pluginDocument.head.insertAdjacentHTML(
            'beforeend',
            `<style id='${id}'>
                ${cssContent}
            </style>`
        );
        if (doc.documentElement.classList.contains('is-mac')) {
            pluginDocument.documentElement.classList.add('is-mac');
        }
        console.log(`AwesomeStyler: plugins css inject - ${iframeEl.id} - ${id}`);
    }
}
const removeCssFromPlugin = (iframeEl: HTMLIFrameElement, id: string) => {
    const pluginDocument = iframeEl.contentDocument;
    if (pluginDocument) {
        pluginDocument.getElementById(id)?.remove();
    }
}

// Plugins observer
let pluginsIframeObserver: MutationObserver, pluginsIframesObserverConfig: MutationObserverInit;
const initPluginsIframesObserver = () => {
    pluginsIframesObserverConfig = {
        childList: true,
    };
    pluginsIframeObserver = new MutationObserver(pluginsIframesCallback);
}
const pluginsIframesCallback: MutationCallback = function (mutationsList) {
    console.log('AwesomeStyler: plugins mutation');
    for (let i = 0; i < mutationsList.length; i++) {
        const addedNode = mutationsList[i].addedNodes[0] as HTMLIFrameElement;
        if (addedNode && addedNode.id == 'logseq-tabs_lsp_main') {
            setTimeout(() => {
                body.classList.add(isTabsLoadedClass);
                tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
                tabPluginInjectCSS(tabsPluginIframe);
                tabPluginInjectCSSVars(tabsPluginIframe);
            }, 1000)
        }
        const removedNode = mutationsList[i].removedNodes[0] as HTMLIFrameElement;
        if (removedNode && removedNode.id == 'logseq-tabs_lsp_main') {
            body.classList.remove(isTabsLoadedClass);
            tabsPluginIframe = null;
        }
    }
};
const runPluginsIframeObserver = () => {
    pluginsIframeObserver.observe(doc.body, pluginsIframesObserverConfig);
}

const tabPluginInjectCSS = (tabsPluginIframe: HTMLIFrameElement) => {
    if (doc.body.classList.contains('is-awesomeUI')) {
        return;
    }
    setTimeout(() => {
        removeCssFromPlugin(tabsPluginIframe, 'tabs-styles');
        injectCssToPlugin(tabsPluginIframe, tabsPluginStyles, 'tabs-styles');
    }, 400);
}
const tabPluginInjectCSSVars = (tabsPluginIframe: HTMLIFrameElement) => {
    setTimeout(() => {
        removeCssFromPlugin(tabsPluginIframe, 'tabs-vars');
        injectCssToPlugin(tabsPluginIframe, tabsPluginCSSVars(), 'tabs-vars');
    }, 800)
}
const tabsPluginEjectCSS = (tabsPluginIframe: HTMLIFrameElement) => {
    removeCssFromPlugin(tabsPluginIframe, 'tabs-styles');
    removeCssFromPlugin(tabsPluginIframe, 'tabs-vars');
}

// First init run
const tabsPluginLoad = async () => {
    if (tabsPluginIframe) {
        body.classList.add(isTabsLoadedClass);
        tabPluginInjectCSS(tabsPluginIframe);
        tabPluginInjectCSSVars(tabsPluginIframe);
    }
    runPluginsIframeObserver();
}
const tabsPluginUnload = () => {
    if (tabsPluginIframe) {
        tabsPluginEjectCSS(tabsPluginIframe);
    }
    pluginsIframeObserver.disconnect();
}

// Main logic runners
const runStuff = () => {
    isThemeRunned = true;
    let runtimeout = 500;
    const presetName = logseq.settings?.presetName;
    if (!presetName) {
        console.log(`AwesomeStyler: no settings ini file! Run later`);
        runtimeout = 2000;
    }
    setTimeout(() => {
        body.classList.add(`awSt-preset-${logseq.settings?.presetName}`);
        tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
        if (isThemeChosen()) {
            body.classList.add(isAwesomeStylerThemeClass);
            setStylingCSSVars();
        }
        setStylingCSSVars();
        runModalObserver();
        tabsPluginLoad();
        body.classList.add(isAwesomeStylerLoadedClass);
    }, runtimeout)
}
const stopStuff = () => {
    isThemeRunned = false;
    body.classList.remove(`awSt-preset-${pluginConfig.presetName}`);
    //unregisterTheme();
    unsetStylingCSSVars();
    tabsPluginUnload();
    modalObserver.disconnect();
    body.classList.remove(isAwesomeStylerLoadedClass);
}

// Setting changed
const onSettingsChangedCallback = (settings: LSPluginBaseInfo['settings'], oldSettings: LSPluginBaseInfo['settings']) => {
    if (!isThemeRunned) {
        return;
    }
    oldPluginConfig = { ...oldSettings };
    pluginConfig = { ...settings };
    const settingsDiff = objectDiff(oldPluginConfig, pluginConfig)
    console.log(`AwesomeStyler: settings changed:`, settingsDiff);

    if (isThemeChosen()) {
        if (isPresetApplied) {
            console.log(`AwesomeStyler: settings changed programmatically (preset applied), skipping`);
            isPresetApplied = false;
            setStylingCSSVars();
            if (tabsPluginIframe) {
                tabPluginInjectCSSVars(tabsPluginIframe);
            }
            return;
        }
        if (isSettingsDuplicated) {
            console.log(`AwesomeStyler: settings changed programmatically (preset settings duplicated), skipping`);
            isSettingsDuplicated = false;
            return;
        }
        if (isPresetCopied) {
            console.log(`AwesomeStyler: settings changed programmatically (preset settings copied), skipping`);
            isPresetCopied = false;
            return;
        }
        if (settingsDiff.includes('presetName')) {
            updatePresets();
        } else {
            setStylingCSSVars();
            if (tabsPluginIframe) {
                tabPluginInjectCSSVars(tabsPluginIframe);
            }
            duplicateSettingsToCustom();
        }
    }
}

// Update presetCustom vars
const duplicateSettingsToCustom = () => {
    if (pluginConfig.presetName === 'Custom') {
        const { presetName, presetCustom, ...customSettings } = pluginConfig;
        logseq.updateSettings({ presetCustom: customSettings });
        isSettingsDuplicated = true;
        console.log(`AwesomeStyler: settings duplicated`);
    }
}


// Utils: object diff
const objectDiff = (orig: object, updated: object) => {
    const difference = Object.keys(orig).filter((key) => {
        if (key === 'presetCustom') {
            return false
        }
        // @ts-ignore
        return orig[key] !== updated[key]
    });
    return difference;
}

// Theme  changed
const onThemeChangedCallback = (theme: Theme) => {
    console.log(`AwesomeStyler: theme changed to`, theme);
    themeMode = theme.mode.charAt(0).toUpperCase() + theme.mode.slice(1);
    if (theme.pid === pluginID) {
        console.log(`AwesomeStyler: switching to its theme detected!`);
        themeMode = theme.mode.charAt(0).toUpperCase() + theme.mode.slice(1);
        setStylingCSSVars();
        body.classList.add(isAwesomeStylerThemeClass);
    } else {
        unsetStylingCSSVars();
    }
    if (tabsPluginIframe) {
        tabPluginInjectCSSVars(tabsPluginIframe);
    }
}

// Theme mode changed
const onThemeModeChangedCallback = (mode: string) => {
    console.log(`AwesomeStyler: theme mode changed to`, mode);
    if (tabsPluginIframe) {
        tabPluginInjectCSSVars(tabsPluginIframe);
    }
    if (isThemeChosen()) {
        themeMode = mode.charAt(0).toUpperCase() + mode.slice(1);
        setStylingCSSVars();
    }
}

// Plugin unloaded
const onPluginUnloadCallback = () => {
    stopStuff();
}

const registerTheme = async () => {
    const themeURL = `lsp://logseq.io/${pluginID}/dist/assets/awesomeStyler.css`;
    const themeLight: Theme = {
        name: 'Awesome Styler Light',
        url: themeURL,
        description: 'Light customizable theme theme with extra stuff',
        mode: 'light',
        pid: pluginID
    }
    const themeDark: Theme = {
        name: 'Awesome Styler Dark',
        url: themeURL,
        description: 'Dark customizable theme theme with extra stuff',
        mode: 'dark',
        pid: pluginID
    }
    logseq.provideTheme(themeLight);
    logseq.provideTheme(themeDark);

    const pluginCSS = `
        body:not(.${isAwesomeStylerThemeClass}) .panel-wrap[data-id='${pluginID}'] :is(.desc-item, .heading-item) {
            display: none;
        }
        body:not(.${isAwesomeStylerThemeClass}) .panel-wrap[data-id="${pluginID}"] .desc-item[data-key="infoWarning"] {
            display: block;
        }
        .${isAwesomeStylerThemeClass} .panel-wrap[data-id="${pluginID}"] .desc-item[data-key="infoWarning"] {
            display: none;
        }
        .desc-item[data-key="infoWarning"] {
            margin: 1em 0 !important;
            font-size: 1.3em;
        }
        .desc-item[data-key="infoWarning"] .form-checkbox {
            display: none;
        }
    `;
    logseq.provideStyle(pluginCSS);
}
// const unregisterTheme = () => {
// }


// Check theme activated
const isThemeChosen = () => {
    if (doc.querySelector(`link[href="lsp://logseq.io/${pluginID}/dist/assets/awesomeStyler.css"]`)) {
        return true;
    }
    return false
}

const injectColorpickerAssets = async () => {
    const pickrCSS = doc.createElement('link');
    pickrCSS.rel = 'stylesheet';
    pickrCSS.href = `lsp://logseq.io/${pluginID}/dist/vendors/pickr/monolith.min.css`;
    doc.getElementsByTagName('head')[0].appendChild(pickrCSS);
    const pickrJS = doc.createElement('script');
    pickrJS.type = 'text/javascript';
    pickrJS.async = true;
    pickrJS.src = `lsp://logseq.io/${pluginID}/dist/vendors/pickr/pickr.min.js`;
    doc.getElementsByTagName('head')[0].appendChild(pickrJS);
}


const setStylingCSSVars = () => {
    // fonts
    let fontVar = '';
    switch (pluginConfig.fontContentName) {
        case 'Fira Sans (theme default)':
            fontVar = '--awSt-font-fira-sans'
            break;
        case 'Fira Code Nerd':
            fontVar = '--awSt-font-fira-code';
            break;
        case 'iA Writer Quattro':
            fontVar = '--awSt-font-aiwriter-quattro';
            break;
        case 'Inter (Logseq default)':
            fontVar = '--awSt-font-default-inter';
            break;
        case 'OS System default':
            fontVar = '--awSt-font-os-system';
            break;
        default:
            fontVar = '--awSt-font-fira-sans';
    }
    if (pluginConfig.fontContentName == 'Fira Code Nerd') {
        body.style.letterSpacing = '-1px';
        body.style.wordSpacing = '-1px';
    } else {
        body.style.letterSpacing = '0';
        body.style.wordSpacing = '0';
    }
    root.style.setProperty('--awSt-content-font', `var(${fontVar})`);
    if (pluginConfig.fontContentSize) {
        root.style.setProperty('--awSt-content-font-size', pluginConfig.fontContentSize);
    }

    // colors
    root.style.setProperty('--awSt-ui-panels-bg-user', pluginConfig[`color${themeMode}UiPanelsBg`]);
    root.style.setProperty('--awSt-ui-content-bg-user', toHex(darken(pluginConfig[`color${themeMode}UiPanelsBg`], 0.04)));
    root.style.setProperty('--awSt-ui-body-bg-user', pluginConfig[`color${themeMode}UiBodyBg`]);

    root.style.setProperty('--awSt-content-border-user', toHex(darken(pluginConfig[`color${themeMode}ContentAltBg`], 0.04)));
    root.style.setProperty('--awSt-content-alt-bg-0-user', toHex(darken(pluginConfig[`color${themeMode}ContentAltBg`], 0.02)));
    root.style.setProperty('--awSt-content-alt-bg-user', pluginConfig[`color${themeMode}ContentAltBg`]);
    root.style.setProperty('--awSt-content-alt-bg-2-user', toHex(lighten(pluginConfig[`color${themeMode}ContentAltBg`], 0.02)));
    root.style.setProperty('--awSt-content-alt-bg-3-user', toHex(lighten(pluginConfig[`color${themeMode}ContentAltBg`], 0.04)));

    root.style.setProperty('--awSt-content-bg-user', pluginConfig[`color${themeMode}ContentBg`]);
    root.style.setProperty('--awSt-content-props-bg-user', pluginConfig[`color${themeMode}ContentPropsBg`]);

    root.style.setProperty('--awSt-title-text-user', pluginConfig[`color${themeMode}TitleText`]);
    root.style.setProperty('--awSt-content-text-user', pluginConfig[`color${themeMode}ContentText`]);
    root.style.setProperty('--awSt-content-text-alt-user', toHex(lighten(pluginConfig[`color${themeMode}ContentText`], 0.2)));
    root.style.setProperty('--awSt-content-text-op-user', toHex(transparentize(pluginConfig[`color${themeMode}ContentText`], 0.85)));
    root.style.setProperty('--awSt-ui-scroll-user', toHex(transparentize(pluginConfig[`color${themeMode}ContentText`], 0.75)));

    root.style.setProperty('--awSt-content-text-bold-user', pluginConfig[`color${themeMode}ContentTextBold`]);
    root.style.setProperty('--awSt-content-text-italic-user', pluginConfig[`color${themeMode}ContentTextItalic`]);

    root.style.setProperty('--awSt-link-user', pluginConfig[`color${themeMode}Link`]);
    root.style.setProperty('--awSt-link-lighter-user', toHex(transparentize(pluginConfig[`color${themeMode}Link`], 0.85)));
    root.style.setProperty('--awSt-link-ext-user', pluginConfig[`color${themeMode}LinkExt`]);
    root.style.setProperty('--awSt-link-ext-lighter-user', toHex(transparentize(pluginConfig[`color${themeMode}LinkExt`], 0.85)));
    root.style.setProperty('--awSt-tag-user', pluginConfig[`color${themeMode}Tag`]);
    root.style.setProperty('--awSt-tag-lighter-user', toHex(transparentize(pluginConfig[`color${themeMode}Tag`], 0.85)));

    root.style.setProperty('--awSt-mark-bg-user', pluginConfig[`color${themeMode}MarkBg`]);
    root.style.setProperty('--awSt-mark-text-user', pluginConfig[`color${themeMode}MarkText`]);
    root.style.setProperty('--awSt-quote-bg-user', pluginConfig[`color${themeMode}QuoteBg`]);
    root.style.setProperty('--awSt-quote-text-user', pluginConfig[`color${themeMode}QuoteText`]);

    root.style.setProperty('--awSt-selected-user', toHex(mix(pluginConfig[`color${themeMode}ContentBg`], pluginConfig[`color${themeMode}Link`], 0.2)));

    root.style.setProperty('--awSt-h1-user', pluginConfig[`color${themeMode}H1`]);
    root.style.setProperty('--awSt-h2-user', pluginConfig[`color${themeMode}H2`]);
    root.style.setProperty('--awSt-h3-user', pluginConfig[`color${themeMode}H3`]);
    root.style.setProperty('--awSt-h4-user', pluginConfig[`color${themeMode}H4`]);
    root.style.setProperty('--awSt-h5-user', pluginConfig[`color${themeMode}H5`]);
    root.style.setProperty('--awSt-h6-user', pluginConfig[`color${themeMode}H6`]);


    // bg
    if (pluginConfig.backgroundURL) {
        root.style.setProperty('--awSt-bg-url', `url(${pluginConfig.backgroundURL})`);
    } else {
        root.style.setProperty('--awSt-bg-url', 'none');
    }
    root.style.setProperty('--awSt-content-padding', pluginConfig.backgroundPadding);
    root.style.setProperty('--awSt-content-padding-top', pluginConfig.backgroundPadding.split(' ')[0]);

    if (!pluginConfig.backgroundShadow) {
        root.style.setProperty('--awSt-bg-shadow', 'none');
    } else {
        root.style.removeProperty('--awSt-bg-shadow');
    }

    // banners
    if (!pluginConfig.bannersAsBackground) {
        root.style.setProperty('--awSt-banner-asBg', 'none');
    } else {
        root.style.removeProperty('--awSt-banner-asBg');
    }
    if (!pluginConfig.bannersIconGlow) {
        root.style.setProperty('--awSt-banner-iconGlow', 'none');
    } else {
        root.style.removeProperty('--awSt-banner-iconGlow');
    }

    // sizes
    root.style.setProperty('--ls-main-content-max-width', pluginConfig.contentMaxWidth);
    root.style.setProperty('--ls-main-content-max-width-wide', pluginConfig.contentWideMaxWidth);
    root.style.setProperty('--ls-left-sidebar-width', pluginConfig.leftSidebarWidth);
    root.style.setProperty('--ls-right-sidebar-width', pluginConfig.rightSidebarWidth);

    console.log(`AwesomeStyler: styling CSS vars updated`);
}

const unsetStylingCSSVars = () => {
    root.style.removeProperty('--awSt-content-font');
    root.style.removeProperty('--awSt-content-font-size');

    root.style.removeProperty('--awSt-ui-panels-bg-user');
    root.style.removeProperty('--awSt-ui-content-bg-user');
    root.style.removeProperty('--awSt-ui-body-bg-user');

    root.style.removeProperty('--awSt-content-border-user');
    root.style.removeProperty('--awSt-content-alt-bg-0-user');
    root.style.removeProperty('--awSt-content-alt-bg-user');
    root.style.removeProperty('--awSt-content-alt-bg-2-user');
    root.style.removeProperty('--awSt-content-alt-bg-3-user');

    root.style.removeProperty('--awSt-content-bg-user');
    root.style.removeProperty('--awSt-content-props-bg-user');

    root.style.removeProperty('--awSt-title-text-user');
    root.style.removeProperty('--awSt-content-text-user');
    root.style.removeProperty('--awSt-content-text-alt-user');
    root.style.removeProperty('--awSt-content-text-op-user');
    root.style.removeProperty('--awSt-ui-scroll-user');

    root.style.removeProperty('--awSt-content-text-bold-user');
    root.style.removeProperty('--awSt-content-text-italic-user');

    root.style.removeProperty('--awSt-link-user');
    root.style.removeProperty('--awSt-link-lighter-user');
    root.style.removeProperty('--awSt-link-ext-user');
    root.style.removeProperty('--awSt-link-ext-lighter-user');
    root.style.removeProperty('--awSt-tag-user');
    root.style.removeProperty('--awSt-tag-lighter-user');

    root.style.removeProperty('--awSt-mark-bg-user');
    root.style.removeProperty('--awSt-mark-text-user');
    root.style.removeProperty('--awSt-quote-bg-user');
    root.style.removeProperty('--awSt-quote-text-user');

    root.style.removeProperty('--awSt-selected-user');

    root.style.removeProperty('--awSt-h1-user');
    root.style.removeProperty('--awSt-h2-user');
    root.style.removeProperty('--awSt-h3-user');
    root.style.removeProperty('--awSt-h4-user');
    root.style.removeProperty('--awSt-h5-user');
    root.style.removeProperty('--awSt-h6-user');


    root.style.removeProperty('--awSt-bg-url');
    root.style.removeProperty('--awSt-banner-asBg');
    root.style.removeProperty('--awSt-banner-iconGlow');

    root.style.removeProperty('--ls-main-content-max-width');
    root.style.removeProperty('--ls-main-content-max-width-wide');
    root.style.removeProperty('--ls-left-sidebar-width');
    root.style.removeProperty('--ls-right-sidebar-width');
}

const getInheritedBackgroundColor = (el: Element | null): string => {
    if (!el) {
        return '';
    }
    const defaultStyle = 'rgba(0, 0, 0, 0)';
    const backgroundColor = getComputedStyle(el).backgroundColor
    if (backgroundColor != defaultStyle) return backgroundColor
    if (!el.parentElement) return defaultStyle
    return getInheritedBackgroundColor(el.parentElement)
}

const tabsPluginCSSVars = (): string => {
    const link = doc.createElement('a');
    body.insertAdjacentElement('beforeend', link);
    const linkColor = getComputedStyle(link).color.trim();
    link.remove();
    return `
        :root {
            --ls-primary-text-color:${getComputedStyle(doc.querySelector('.cp__sidebar-main-content')!).color.trim()};
            --ls-link-text-color:${linkColor};
            --ls-primary-background-color:${getInheritedBackgroundColor(doc.querySelector('.cp__sidebar-main-content')).trim()};
            --ls-secondary-background-color:${getInheritedBackgroundColor(doc.querySelector('.left-sidebar-inner')).trim()};
        }
    `
}

// Get main containers
const getDOMContainers = async () => {
    doc = parent.document;
    root = doc.documentElement;
    body = doc.body;
    modalContainer = doc.querySelector('.ui__modal');
}

// Main logseq on ready
const main = async () => {
    console.log(`AwesomeStyler: plugin loaded`);
    registerTheme();
    logseq.useSettingsSchema(settingSchema);

    getDOMContainers();
    themeMode = root.getAttribute('data-theme') || 'light';
    themeMode = themeMode.charAt(0).toUpperCase() + themeMode.slice(1);
    pluginConfig = logseq.settings as LSPluginBaseInfo['settings'];

    // Init observers
    initModalObserver();
    initPluginsIframesObserver();

    // First theme run
    runStuff();

    // Later listeners
    setTimeout(() => {
        // Listen for theme activated
        logseq.App.onThemeChanged((theme) => {
            onThemeChangedCallback(theme as Theme);
        });

        // Listen for theme mode changed
        logseq.App.onThemeModeChanged(({ mode }) => {
            onThemeModeChangedCallback(mode);
        });

        // Listen settings update
        logseq.onSettingsChanged((settings, oldSettings) => {
            onSettingsChangedCallback(settings, oldSettings);
        });

        // Listen plugin unload
        logseq.beforeunload(async () => {
            onPluginUnloadCallback();
        });

        injectColorpickerAssets();

    }, 2000)

    const promoMgs = () => {
        if (!doc.body.classList.contains('is-awesomeUI')) {
            logseq.UI.showMsg(promoAwesomeUIMsg, 'warning', {timeout: 300000});
        }
        if (!doc.body.classList.contains('is-awesomeLinks')) {
            logseq.UI.showMsg(promoAwesomeLinksMsg, 'warning', {timeout: 300000});
        }
    }
    setTimeout(() => {
        promoMgs();
    }, 8000)

};

logseq.ready(main).catch(console.error);
