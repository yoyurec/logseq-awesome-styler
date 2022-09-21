import '@logseq/libs';
import type Pickr from '@simonwep/pickr';
import { lighten, darken, transparentize, mix, toHex, readableColor } from 'color2k';
import { SettingSchemaDesc, LSPluginBaseInfo, Theme } from '@logseq/libs/dist/LSPlugin.user';
import { logseq as PL } from '../../package.json';

import tabsPluginStyles from '../css/components/tabsPlugin.css';

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
const isSolExtThemeClass = 'is-solext-theme';
const isTabsLoadedClass = 'is-tabs-loaded';
const isSettingsOpenedClass = 'is-settings-opened';
const isSearchOpenedClass = 'is-search-opened';
const isSearchReorderedClass = 'is-solext-search-reordered';
const headersSelector = `.page-blocks-inner > div > div > div > div > div > div > .ls-block:not([haschild='']):not([data-refs-self='["quote"]']):not([data-refs-self='["card"]']):not(.pre-block) > .flex-row`;

let doc: Document;
let root: HTMLElement;
let body: HTMLElement;
let modalContainer: HTMLElement | null;
let appContainer: HTMLElement | null;
let mainContainer: HTMLElement | null;
let tabsPluginIframe: HTMLIFrameElement | null;


let isPresetApplied: boolean;
let isPresetCopied: boolean;
let isSettingsDuplicated: boolean;
let isThemeRunned: boolean;
let themeMode: string;
let pluginConfig: LSPluginBaseInfo['settings'];
let oldPluginConfig: LSPluginBaseInfo['settings'];

const presets: Preset = {
    SolExt_default: {
        fontContentName: 'Fira Sans (SolExt default)',
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
        backgroundURL: 'https://images.unsplash.com/photo-1584004400883-35a54de8b74c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        backgroundPadding: '20px 40px 20px 40px',
        backgroundShadow: true,
        bannersAsBackground: true,
        bannersIconGlow: true,
        contentMaxWidth: '1200px',
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
        fontContentName: 'Fira Sans (SolExt default)',
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
        colorDarkContentPropsBg: '#34282B',
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
        backgroundURL: 'https://4kwallpapers.com/images/wallpapers/lakeside-pink-sky-sunset-minimal-art-gradient-background-7680x3215-4584.png',
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
            'SolExt_default',
            'Logseq_original',
            'Mia_quattro',
            'Chocolate',
            'Custom'
        ],
        default: 'SolExt_default',
    },
    {
        key: 'presetCustom',
        title: 'Custom theme configuration',
        description: '',
        type: 'object',
        default: presets.SolExt_default,
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
            'Fira Sans (SolExt default)',
            'Fira Code Nerd',
            'iA Writer Quattro',
            'Inter (Logseq default)',
            'OS System default'
        ],
        default: presets.SolExt_default.fontContentName,
    },
    {
        key: 'fontContentSize',
        title: 'Content font size',
        description: '',
        type: 'string',
        default: presets.SolExt_default.fontContentSize,
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
        default: presets.SolExt_default.colorLightUiPanelsBg
    },
    {
        key: 'colorLightUiBodyBg',
        title: 'Body bg',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightUiBodyBg
    },
    {
        key: 'colorLightContentBg',
        title: 'Page bg',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightContentBg
    },
    {
        key: 'colorLightContentPropsBg',
        title: 'Props bg',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightContentPropsBg
    },
    {
        key: 'colorLightContentAltBg',
        title: 'References bg',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightContentAltBg
    },
    {
        key: 'colorLightTitleText',
        title: 'Title',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightTitleText
    },
    {
        key: 'colorLightContentText',
        title: 'Text',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightContentText
    },
    {
        key: 'colorLightContentTextBold',
        title: 'Bold',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightContentTextBold
    },
    {
        key: 'colorLightContentTextItalic',
        title: 'Italic',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightContentTextItalic
    },
    {
        key: 'colorLightLink',
        title: 'Link (internal)',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightLink
    },
    {
        key: 'colorLightLinkExt',
        title: 'Link (external)',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightLinkExt
    },
    {
        key: 'colorLightTag',
        title: 'Tag',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightTag
    },
    {
        key: 'colorLightH1',
        title: 'H1',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightH1
    },
    {
        key: 'colorLightH2',
        title: 'H2',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightH2
    },
    {
        key: 'colorLightH3',
        title: 'H3',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightH3
    },
    {
        key: 'colorLightH4',
        title: 'H4',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightH4
    },
    {
        key: 'colorLightH5',
        title: 'H5',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightH5
    },
    {
        key: 'colorLightH6',
        title: 'H6',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightH6
    },
    {
        key: 'colorLightMarkBg',
        title: 'Highlight bg',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightMarkBg
    },
    {
        key: 'colorLightMarkText',
        title: 'Highlight text',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightMarkText
    },
    {
        key: 'colorLightQuoteBg',
        title: 'Quote bg',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightQuoteBg
    },
    {
        key: 'colorLightQuoteText',
        title: 'Quote text',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightQuoteText
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
        default: presets.SolExt_default.colorDarkUiPanelsBg
    },
    {
        key: 'colorDarkUiBodyBg',
        title: 'Body bg',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkUiBodyBg
    },
    {
        key: 'colorDarkContentBg',
        title: 'Page bg',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkContentBg
    },
    {
        key: 'colorDarkContentPropsBg',
        title: 'Props bg',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkContentPropsBg
    },
    {
        key: 'colorDarkContentAltBg',
        title: 'References bg',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkContentAltBg
    },
    {
        key: 'colorDarkTitleText',
        title: 'Title',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkTitleText
    },
    {
        key: 'colorDarkContentText',
        title: 'Text',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkContentText
    },
    {
        key: 'colorDarkContentTextBold',
        title: 'Bold',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkContentTextBold
    },
    {
        key: 'colorDarkContentTextItalic',
        title: 'Italic',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkContentTextItalic
    },
    {
        key: 'colorDarkLink',
        title: 'Link (internal)',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkLink
    },
    {
        key: 'colorDarkLinkExt',
        title: 'Link (external)',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkLinkExt
    },
    {
        key: 'colorDarkTag',
        title: 'Tag',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkTag
    },
    {
        key: 'colorDarkH1',
        title: 'H1',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkH1
    },
    {
        key: 'colorDarkH2',
        title: 'H2',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkH2
    },
    {
        key: 'colorDarkH3',
        title: 'H3',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkH3
    },
    {
        key: 'colorDarkH4',
        title: 'H4',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkH4
    },
    {
        key: 'colorDarkH5',
        title: 'H5',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkH5
    },
    {
        key: 'colorDarkH6',
        title: 'H6',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkH6
    },
    {
        key: 'colorDarkMarkBg',
        title: 'Highlight bg',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkMarkBg
    },
    {
        key: 'colorDarkMarkText',
        title: 'Highlight text',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkMarkText
    },
    {
        key: 'colorDarkQuoteBg',
        title: 'Quote bg',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkQuoteBg
    },
    {
        key: 'colorDarkQuoteText',
        title: 'Quote text',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkQuoteText
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
        default: presets.SolExt_default.backgroundURL,
    },
    {
        key: 'backgroundPadding',
        title: 'Content background padding (top right bottom left)',
        description: '',
        type: 'string',
        default: presets.SolExt_default.backgroundPadding,
    },
    {
        key: 'backgroundShadow',
        title: '',
        description: 'Enable content shadow?',
        type: 'boolean',
        default: presets.SolExt_default.backgroundShadow
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
        default: presets.SolExt_default.bannersAsBackground,
    },
    {
        key: 'bannersIconGlow',
        title: '',
        description: 'Add glow to banner icon?',
        type: 'boolean',
        default: presets.SolExt_default.bannersIconGlow,
    },
    {
        key: 'featureHeading',
        title: 'Features',
        description: '',
        type: 'heading',
        default: null,
    },
    {
        key: 'featureFaviconsEnabled',
        title: '',
        description: 'Show site favicon for external links?',
        type: 'boolean',
        default: true,
    },
    {
        key: 'featurePageIconsEnabled',
        title: '',
        description: 'Show page icon for internal links?',
        type: 'boolean',
        default: true,
    },
    {
        key: 'featureInheritPageIcons',
        title: '',
        description: 'Inherit page icon from custom property page',
        type: 'string',
        default: 'page-type',
    },
    {
        key: 'featureJournalIcon',
        title: '',
        description: 'Journal item icon: emoji or Nerd icon (https://www.nerdfonts.com/cheat-sheet). Delete value to disable feature',
        type: 'string',
        default: '',
    },
    {
        key: 'featureStickyHeadersEnabled',
        title: '',
        description: 'Enable sticky headers (h1-h5 in document root)?',
        type: 'boolean',
        default: true,
    },
    {
        key: 'featureTasksEnabled',
        title: '',
        description: 'Enable tasks status and priority restyling?',
        type: 'boolean',
        default: true,
    },
    {
        key: 'featureColumnsEnabled',
        title: '',
        description: 'Enable columns: ".kanban" & ".grid" tags?',
        type: 'boolean',
        default: true,
    },
    {
        key: 'featureHeadersLabelsEnabled',
        title: '',
        description: 'Show headers (h1-h5) labels?',
        type: 'boolean',
        default: true,
    },
    {
        key: 'featureNewBlockBulletEnabled',
        title: '',
        description: 'Always show add block bullet on page bottom?',
        type: 'boolean',
        default: false,
    },
    {
        key: 'featureHomeButtonEnabled',
        title: '',
        description: 'Show Home button?',
        type: 'boolean',
        default: false,
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
        default: presets.SolExt_default.contentMaxWidth,
    },
    {
        key: 'contentWideMaxWidth',
        title: 'Content max width in wide mode (in px, %, vw)',
        description: '',
        type: 'string',
        default: presets.SolExt_default.contentWideMaxWidth,
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
    body.classList.remove(`solext-preset-${oldPluginConfig.presetName}`);
    body.classList.add(`solext-preset-${pluginConfig.presetName}`);
}

const refreshSettingsPage = () => {
    const closeSettings = doc.querySelector('.is-sub-modal .ui__modal-close') as HTMLAnchorElement;
    const solExtPluginButton = doc.querySelector(`.settings-plugin-item[data-id="${pluginID}"]`) as HTMLAnchorElement;
    if (!solExtPluginButton) {
        return;
    }
    const clickPlugin = doc.querySelectorAll(`.settings-plugin-list .settings-plugin-item:not([data-id="${pluginID}"])`);
    if (clickPlugin.length > 0) {
        (clickPlugin[0] as HTMLAnchorElement).click();
        setTimeout(() => {
            solExtPluginButton.click();
        }, 100);
    } else {
        closeSettings.click();
        const settingsPluginButton = doc.querySelector('.settings-menu-link[data-id="plugins"]') as HTMLAnchorElement;
        setTimeout(() => {
            settingsPluginButton.click();
        }, 100);
        setTimeout(() => {
            solExtPluginButton.click();
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
    const presetsSelecrtor = pluginPanel.querySelector('[data-key="presetName"] .form-select') as HTMLSelectElement;
    presetsSelecrtor.disabled = false;
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
        case 'SolExt_default':
            settingsVal = presets.SolExt_default;
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
            settingsVal = presets.SolExt_default;
        }
    logseq.updateSettings(settingsVal);
    isPresetApplied = true;
    console.log(`SolExt: applied preset ${pluginConfig.presetName}`);
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

const toggleFaviconsFeature = () => {
    if (pluginConfig.featureFaviconsEnabled) {
        faviconsLoad();
    } else {
        faviconsDisable();
    }
}
const toggleIconsFeature = () => {
    if (pluginConfig.featurePageIconsEnabled) {
        pageIconsLoad();
    } else {
        pageIconsDisable();
    }
}
const toggleJournalIconFeature = () => {
    if (pluginConfig.featureJournalIcon) {
        journalIconsLoad();
    } else {
        journalIconsUnload();
    }
}
const toggleHeadersFeature = () => {
    if (pluginConfig.featureStickyHeadersEnabled) {
        headersLoad();
    } else {
        headersUnload();
    }
}

const toggleTasksFeature = () => {
    if (pluginConfig.featureTasksEnabled) {
        tasksApply();
    } else {
        tasksUnload();
    }
}

const toggleColumnsFeature = () => {
    if (pluginConfig.featureColumnsEnabled) {
        columnsLoad();
    } else {
        columnsUnload();
    }
}

// Detect modals opened/closed
let modalObserver: MutationObserver, modalObserverConfig: MutationObserverInit;
const modalCallback: MutationCallback = () => {
    if (!modalContainer) {
        return;
    }
    // Search opened
    const searchModal = modalContainer.querySelector('.ls-search') as HTMLElement;
    if (searchModal) {
        body.classList.add(isSearchOpenedClass);
        initSearchModal(searchModal);
    } else {
        body.classList.remove(isSearchOpenedClass);
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

const initSearchModal = (searchModal: HTMLElement) => {
    searchModal.style.width = doc.getElementById('search-button')?.offsetWidth + 'px' || 'var(--ls-main-content-max-width)';
}

const initSettingsModal = (settingsModal: Element) => {
    const settingsPluginButton = settingsModal.querySelector('.settings-menu-link[data-id="plugins"]');
    settingsPluginButton?.addEventListener('click', () => {
        setTimeout(() => {
            const SolExtPluginItem = doc.querySelector(`.ui__modal.is-sub-modal .settings-plugin-item[data-id="${pluginID}"]`) as HTMLAnchorElement;
            if (!SolExtPluginItem) {
                return;
            }
            if (SolExtPluginItem.parentElement?.classList.contains('active')) {
                setTimeout(() => {
                    tweakPluginSettings();
                }, 500)
            }
            const clickPlugin = doc.querySelectorAll('.settings-plugin-list li');
            if (clickPlugin.length > 1) {
                SolExtPluginItem.addEventListener('click', () => {
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
            moveSolExtPluginButton(pluginsModal);
        }, 300)
    });
    buttons[1].addEventListener('click', () => {
        setTimeout(() => {
            moveSolExtPluginButton(pluginsModal);
        }, 100)
    });
    moveSolExtPluginButton(pluginsModal);
}

const moveSolExtPluginButton = (pluginsModal: Element) => {
    const pluginsList = pluginsModal.querySelector('.cp__plugins-item-lists');
    const pluginButton = pluginsList?.querySelector(`img[src*="${pluginID}"]`)?.parentNode?.parentNode as Element;
    if (pluginsList && pluginButton) {
        pluginsList.insertAdjacentElement('afterbegin', pluginButton);
    }
}

// Reposition toolbar search button
const searchLoad = async () => {
    if (!body.classList.contains(isSearchReorderedClass)) {
        const rightToolbar = doc.querySelector('#head .r');
        if (rightToolbar) {
            const search = doc.getElementById('search-button');
            if (search) {
                rightToolbar.insertAdjacentElement('afterbegin', search);
            }
        }
        body.classList.add(isSearchReorderedClass);
    }
}
const searchUnload = () => {
    const leftToolbar = doc.querySelector('#head .l');
    const search = doc.getElementById('search-button');
    if (!leftToolbar || !search) {
        return;
    }
    leftToolbar.insertAdjacentElement('beforeend', search);
    body.classList.remove(isSearchReorderedClass);
}

// Reposition right sidebar toggle button
const rightSidebarLoad = async () => {
    const toggleRightSidebar = doc.querySelector('#right-sidebar .toggle-right-sidebar');
    reorderRightSidebarToggleButton(toggleRightSidebar ? true : false);
}
const rightSidebarUnload = async () => {
    const hideRightSidebarButton = doc.querySelector('#head .hide-right-sidebar-button');
    const rightToolbarPlaceholder = doc.querySelector('.cp__right-sidebar-topbar div:last-child div');
    if (rightToolbarPlaceholder && hideRightSidebarButton) {
        rightToolbarPlaceholder.insertAdjacentElement('beforeend', hideRightSidebarButton);
    }
}
const reorderRightSidebarToggleButton = (visible: boolean) => {
    if (visible) {
        const hideRightSidebarButton = doc.querySelector('#right-sidebar .toggle-right-sidebar');
        hideRightSidebarButton?.classList.add('hide-right-sidebar-button')
        const headToolbar = doc.querySelector('#head .r');
        if (headToolbar && hideRightSidebarButton) {
            headToolbar.insertAdjacentElement('beforeend', hideRightSidebarButton);
        }
    } else {
        doc.querySelector('#head .hide-right-sidebar-button')?.remove();
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
        console.log(`SolExt: plugins css inject - ${iframeEl.id} - ${id}`);
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
const pluginsIframesCallback: MutationCallback = function (mutationsList) {
    console.log('SolExt: plugins mutation');
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
const initPluginsIframesObserver = () => {
    pluginsIframesObserverConfig = {
        childList: true,
    };
    pluginsIframeObserver = new MutationObserver(pluginsIframesCallback);
}
const runPluginsIframeObserver = () => {
    pluginsIframeObserver.observe(doc.body, pluginsIframesObserverConfig);
}

const tabPluginInjectCSS = (tabsPluginIframe: HTMLIFrameElement) => {
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

// External links favicons
const setFavicons = (extLinkList: NodeListOf<HTMLAnchorElement>) => {
    for (let i = 0; i < extLinkList.length; i++) {
        const oldFav = extLinkList[i].querySelector('.external-link-img');
        if (oldFav) {
            oldFav.remove();
        }
        const { hostname, protocol } = new URL(extLinkList[i].href);
        if ((protocol === 'http:') || (protocol === 'https:')) {
            const faviconValue = `https://www.google.com/s2/favicons?domain=${hostname}&sz=16`;
            const fav = doc.createElement('img');
            fav.src = faviconValue;
            fav.width = 16;
            fav.height = 16;
            fav.classList.add('external-link-img');
            extLinkList[i].insertAdjacentElement('afterbegin', fav);
        }
    }
    body.classList.add('is-solext-favicons');
}
const removeFavicons = () => {
    const favicons = doc.querySelectorAll('.external-link-img');
    if (favicons.length) {
        for (let i = 0; i < favicons.length; i++) {
            favicons[i].remove();
        }
    }
    body.classList.remove('is-solext-favicons');
}


const getPageIcon = async (title: string) => {
    let pageIcon = '';
    const iconQuery = `
    [
      :find ?icon
      :where
          [?id :block/name "${title}"]
          [?id :block/properties ?prop]
          [(get ?prop :icon) ?icon]
    ]
    `;
    const journalQuery = `
    [
      :find ?isjournal
      :where
          [?id :block/name "${title}"]
          [?id :block/journal? ?isjournal]
    ]
    `;
    const isJournal = await logseq.DB.datascriptQuery(journalQuery);
    if (isJournal.length && isJournal[0][0] && pluginConfig.featureJournalIcon) {
        return pluginConfig.featureJournalIcon;
    }
    const pageIconArr = await logseq.DB.datascriptQuery(iconQuery);
    if (pageIconArr.length) {
        pageIcon = pageIconArr[0];
    }
    return pageIcon;
}

const getInheritedPageTitle = async (title: string, prop: string) => {
    let inheritedPageTitle = '';
    const inheritedTitleQuery = `
    [
      :find ?title
      :where
          [?id :block/name "${title}"]
          [?id :block/properties ?prop]
          [(get ?prop :${prop}) ?title]
    ]
    `;
    const titleArr = await logseq.DB.datascriptQuery(inheritedTitleQuery);
    if (titleArr.length) {
        inheritedPageTitle = titleArr[0][0][0];
    }
    return inheritedPageTitle;
}

const setPageIcons = async (linkList: NodeListOf<HTMLAnchorElement>) => {
    for (let i = 0; i < linkList.length; i++) {
        const linkItem = linkList[i];
        const oldPageIcon = linkItem.querySelector('.link-icon');
        if (oldPageIcon) {
            oldPageIcon.remove();
        }
        const pageTitle = linkItem.getAttribute('data-ref');
        if (!pageTitle) {
            continue;
        }
        let pageIcon = await getPageIcon(pageTitle);
        if (!pageIcon && pluginConfig.featureInheritPageIcons) {
            const inheritedTitle = await getInheritedPageTitle(pageTitle, pluginConfig.featureInheritPageIcons);
            if (inheritedTitle) {
                pageIcon = await getPageIcon(inheritedTitle.toLowerCase());
            }
        }
        if (pageIcon) {
            linkItem.insertAdjacentHTML('afterbegin', `<span class="link-icon">${pageIcon}</span>`);
        }
    }
    body.classList.add('is-solext-icons');
}
const removePageIcons = () => {
    const pageIcons = doc.querySelectorAll('.link-icon');
    if (pageIcons.length) {
        for (let i = 0; i < pageIcons.length; i++) {
            pageIcons[i].remove();
        }
    }
    body.classList.remove('is-solext-icons');
}

// const setTitleInheritedIcons = async (titleList: NodeListOf<HTMLAnchorElement>) => {
//     for (let i = 0; i < titleList.length; i++) {
//         let iconExists = false;
//         const titleItem = titleList[i];
//         const originalIcon = titleItem.querySelector('.page-icon');
//         if (originalIcon) {
//             iconExists = !!originalIcon.textContent;
//         }
//         if (iconExists || !pluginConfig.featureInheritPageIcons) {
//             continue;
//         }
//         let pageIcon = '';
//         const pageTitle = titleItem.textContent;
//         if (!pageTitle) {
//             continue;
//         }
//         const inheritedTitle = await getInheritedPageTitle(pageTitle.toLowerCase(), pluginConfig.featureInheritPageIcons);
//         if (inheritedTitle) {
//             pageIcon = await getPageIcon(inheritedTitle.toLowerCase());
//             if (pageIcon) {
//                 originalIcon?.remove();
//                 titleItem.insertAdjacentHTML('afterbegin', `<span class="link-icon">${pageIcon}</span>`);
//             }
//         }
//     }
// }

const faviconsLoad = () => {
    if (pluginConfig.featureFaviconsEnabled) {
        setTimeout(() => {
            const extLinkList: NodeListOf<HTMLAnchorElement> = doc.querySelectorAll('.external-link');
            setFavicons(extLinkList);
        }, 500);
    }
}
const faviconsDisable = () => {
    removeFavicons();
    if (!pluginConfig.featurePageIconsEnabled && !pluginConfig.featureFaviconsEnabled) {
        stopLinksObserver();
    }
}
const faviconsUnload = () => {
    removeFavicons();
}

const pageIconsLoad = () => {
    const linkList: NodeListOf<HTMLAnchorElement> = doc.querySelectorAll('.ls-block .page-ref:not(.page-property-key)');
    setPageIcons(linkList);
    // const pageTitleList: NodeListOf<HTMLAnchorElement> = doc.querySelectorAll('h1.title, .favorite-item a, .recent-item a');
    // setTitleInheritedIcons(pageTitleList);
}
const pageIconsDisable = () => {
    removePageIcons();
    if (!pluginConfig.featurePageIconsEnabled && !pluginConfig.featureFaviconsEnabled) {
        stopLinksObserver();
    }
}
const pageIconsUnload = () => {
    removePageIcons();
}

// Links observer
let linksObserver: MutationObserver, linksObserverConfig: MutationObserverInit;
const linksObserverCallback: MutationCallback = function (mutationsList) {
    if (!appContainer) {
        return;
    }
    for (let i = 0; i < mutationsList.length; i++) {
        const addedNode = mutationsList[i].addedNodes[0] as HTMLAnchorElement;
        if (addedNode && addedNode.childNodes.length) {
            // favicons
            const extLinkList = addedNode.querySelectorAll('.external-link') as NodeListOf<HTMLAnchorElement>;
            if (extLinkList.length) {
                stopLinksObserver();
                setFavicons(extLinkList);
                runLinksObserver();
            }
            // page icons
            const linkList = addedNode.querySelectorAll('.ls-block .page-ref:not(.page-property-key)') as NodeListOf<HTMLAnchorElement>;
            if (linkList.length) {
                stopLinksObserver();
                setPageIcons(linkList);
                runLinksObserver();
            }
            // page title
            // const pageTileList = addedNode.querySelectorAll('h1.title, .favorite-item a, .recent-item a') as NodeListOf<HTMLAnchorElement>;
            // if (pageTileList.length) {
            //     stopLinksObserver();
            //     setTitleInheritedIcons(pageTileList);
            //     runLinksObserver();
            // }
        }
    }
};
const initLinksObserver = () => {
    linksObserverConfig = { childList: true, subtree: true };
    linksObserver = new MutationObserver(linksObserverCallback);
}
const runLinksObserver = () => {
    if (!appContainer) {
        return;
    }
    console.log(`SolExt: links observer started`);
    linksObserver.observe(appContainer, linksObserverConfig);
}
const stopLinksObserver = () => {
    console.log(`SolExt: links observer stopped`);
    linksObserver.disconnect();
}


// Sticky 1 levels

// Header observer
let headersObserver: MutationObserver, headersObserverConfig: MutationObserverInit;
const headersCallback: MutationCallback = function (mutationsList) {
    for (let i = 0; i < mutationsList.length; i++) {
        const addedNode = mutationsList[i].addedNodes[0] as HTMLElement;
        if (addedNode && addedNode.childNodes.length) {
            const headersList = addedNode.querySelectorAll(headersSelector);
            if (headersList.length) {
                setHeaders(headersList);
            }
        }
    }
};
const setHeaders = (headersList: NodeListOf<Element>) => {
    for (let i = 0; i < headersList.length; i++) {
        const headerItem = headersList[i] as HTMLElement;
        if (headerItem && headerItem.querySelector(':is(h1, h2, h3, h4, h5)')) {
            headerItem.classList.add('will-stick');
            setHeadersIntersectObserver(headerItem);
        }
    }
}
const initHeadersObserver = () => {
    headersObserverConfig = { childList: true, subtree: true };
    headersObserver = new MutationObserver(headersCallback);
}
const runHeadersObserver = () => {
    if (!mainContainer) {
        return;
    }
    headersObserver.observe(mainContainer, headersObserverConfig);
}

const setHeadersIntersectObserver = (el: HTMLElement) => {
    const headersIntersectCallback: IntersectionObserverCallback = (entries) => {
        for (let i = 0; i < entries.length; i++) {
            entries[i].target.classList.toggle('is-sticky', entries[i].intersectionRatio < 1);
        }
    }
    const headersIntersectObserverConfig: IntersectionObserverInit = {
        root: mainContainer,
        rootMargin: '0px 0px 0px 0px',
        threshold: [1]
    };
    const headersIntersectObserver: IntersectionObserver = new IntersectionObserver(headersIntersectCallback, headersIntersectObserverConfig);
    headersIntersectObserver.observe(el);
}

// First init run
const headersLoad = () => {
    if (!pluginConfig.featureStickyHeadersEnabled) {
        return;
    }
    setTimeout(() => {
        const headersList = doc.querySelectorAll(headersSelector);
        setHeaders(headersList);
        runHeadersObserver();
    }, 500);
}
const headersUnload = () => {
    headersObserver.disconnect();
    const headersList = doc.querySelectorAll('.will-stick');
    if (headersList.length) {
        for (let i = 0; i < headersList.length; i++) {
            headersList[i].classList.remove('will-stick');
        }
    }
}

const tasksApply = () => {
    if (!pluginConfig.featureTasksEnabled) {
        return;
    }
    setTimeout(() => {
        if (doc.head) {
            doc.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" id="solext-css-tasks" href="lsp://logseq.io/${pluginID}/dist/assets/css/components/tasks.css">`)
        }
    }, 500)
}
const tasksUnload = () => {
    doc.getElementById('solext-css-tasks')?.remove();
}

const columnsLoad = () => {
    if (!pluginConfig.featureColumnsEnabled) {
        return;
    }
    setTimeout(() => {
        if (doc.head) {
            doc.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" id="solext-css-columns" href="lsp://logseq.io/${pluginID}/dist/assets/css/components/columns.css">`)
        }
    }, 500)
}
const columnsUnload = () => {
    doc.getElementById('solext-css-columns')?.remove();
}

const journalIconsLoad = () => {
    if (!pluginConfig.featureJournalIcon) {
        return;
    }
    root.style.setProperty('--solext-journal-icon', `"${pluginConfig.featureJournalIcon}"`);
    body.classList.add('is-solext-journal-icon');
}
const journalIconsUnload = () => {
    body.classList.remove('is-solext-journal-icon');
}


// Main logic runners
const runStuff = () => {
    isThemeRunned = true;
    let runtimeout = 500;
    const presetName = logseq.settings?.presetName;
    if (!presetName) {
        console.log(`SolExt: no settings ini file! Run later`);
        runtimeout = 2000;
    }
    setTimeout(() => {
        root.style.setProperty('--solext-calc-ui-bg', getInheritedBackgroundColor(doc.querySelector('.left-sidebar-inner')).trim());
        body.classList.add(`solext-preset-${logseq.settings?.presetName}`);
        tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
        setFeaturesCSSVars();
        if (isThemeChosen()) {
            body.classList.add(isSolExtThemeClass);
            setStylingCSSVars();
        }
        runModalObserver();
        searchLoad();
        rightSidebarLoad();
        tabsPluginLoad();
        journalIconsLoad();
        headersLoad();
        tasksApply();
        columnsLoad();
        setTimeout(() => {
            faviconsLoad();
            pageIconsLoad();
            if (pluginConfig.featureFaviconsEnabled || pluginConfig.featurePageIconsEnabled) {
                runLinksObserver();
            }
        }, 1000)
    }, runtimeout)
}
const stopStuff = () => {
    isThemeRunned = false;
    body.classList.remove(`solext-preset-${pluginConfig.presetName}`);
    unregisterTheme();
    tasksUnload();
    columnsUnload();
    unsetGlobalCSSVars();
    searchUnload();
    rightSidebarUnload();
    tabsPluginUnload();
    pageIconsUnload();
    faviconsUnload();
    journalIconsUnload();
    headersUnload();
    stopLinksObserver();
    modalObserver.disconnect();
}

// Sidebar toggled
const onSidebarVisibleChangedCallback = (visible: boolean) => {
    reorderRightSidebarToggleButton(visible);
}

// Setting changed
const onSettingsChangedCallback = (settings: LSPluginBaseInfo['settings'], oldSettings: LSPluginBaseInfo['settings']) => {
    if (!isThemeRunned) {
        return;
    }

    oldPluginConfig = { ...oldSettings };
    pluginConfig = { ...settings };
    console.log(`SolExt: settings changed`);
    const settingsDiff = objectDiff(oldPluginConfig, pluginConfig)
    console.log(`SolExt: settings changed:`, settingsDiff);

    if (settingsDiff.includes('featureFaviconsEnabled')) {
        toggleFaviconsFeature();
    }
    if (settingsDiff.includes('featurePageIconsEnabled')) {
        toggleIconsFeature();
    }
    if (settingsDiff.includes('featureJournalIcon')) {
        toggleJournalIconFeature();
    }
    if (settingsDiff.includes('featureStickyHeadersEnabled')) {
        toggleHeadersFeature();
    }
    if (settingsDiff.includes('featureTasksEnabled')) {
        toggleTasksFeature();
    }
    if (settingsDiff.includes('featureColumnsEnabled')) {
        toggleColumnsFeature();
    }

    if (isThemeChosen()) {
        if (isPresetApplied) {
            console.log(`SolExt: settings changed programmatically (preset applied), skipping`);
            isPresetApplied = false;
            setStylingCSSVars();
            if (tabsPluginIframe) {
                tabPluginInjectCSSVars(tabsPluginIframe);
            }
            setFeaturesCSSVars();
            return;
        }
        if (isSettingsDuplicated) {
            console.log(`SolExt: settings changed programmatically (preset settings duplicated), skipping`);
            isSettingsDuplicated = false;
            return;
        }
        if (isPresetCopied) {
            console.log(`SolExt: settings changed programmatically (preset settings copied), skipping`);
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

    setFeaturesCSSVars();
}

// Update presetCustom vars
const duplicateSettingsToCustom = () => {
    if (pluginConfig.presetName === 'Custom') {
        const { presetName, presetCustom, ...customSettings } = pluginConfig;
        logseq.updateSettings({ presetCustom: customSettings });
        isSettingsDuplicated = true;
        console.log(`SolExt: settings duplicated`);
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
    console.log(`SolExt: theme changed to`, theme);
    root.style.setProperty('--solext-calc-ui-bg', getInheritedBackgroundColor(doc.querySelector('.left-sidebar-inner')).trim());
    themeMode = theme.mode.charAt(0).toUpperCase() + theme.mode.slice(1);
    if (theme.pid === pluginID) {
        console.log(`SolExt: switching to SolExt theme detected!`);
        themeMode = theme.mode.charAt(0).toUpperCase() + theme.mode.slice(1);
        setStylingCSSVars();
        body.classList.add(isSolExtThemeClass);
    } else {
        body.classList.remove(isSolExtThemeClass);
    }
    if (tabsPluginIframe) {
        tabPluginInjectCSSVars(tabsPluginIframe);
    }
}

// Theme mode changed
const onThemeModeChangedCallback = (mode: string) => {
    console.log(`SolExt: theme mode changed to`, mode);
    root.style.setProperty('--solext-calc-ui-bg', getInheritedBackgroundColor(doc.querySelector('.left-sidebar-inner')).trim());
    if (tabsPluginIframe) {
        tabPluginInjectCSSVars(tabsPluginIframe);
    }
    if (isThemeChosen()) {
        themeMode = mode.charAt(0).toUpperCase() + mode.slice(1);
        setStylingCSSVars();
    }
}

// Page changed
const routeChangedCallback = () => {
    // console.info(`#${pluginID}: page route changed`);
    // linksObserver.disconnect();
    // setTimeout(() => {
    //   runLinksObserver();
    // }, 200)
}

// Plugin unloaded
const onPluginUnloadCallback = () => {
    if (!isThemeRunned) {
        return;
    }
    stopStuff();
}

const registerTheme = async () => {
    setTimeout(() => {
        if (doc.head) {
            const logseqCSS = doc.head.querySelector(`link[href="./css/style.css"]`);
            logseqCSS!.insertAdjacentHTML('afterend', `<link rel="stylesheet" id="solext-css-core" href="lsp://logseq.io/${pluginID}/dist/assets/css/solExtCore.css">`)
        }
    }, 100)

    const themeURL = `lsp://logseq.io/${pluginID}/dist/assets/css/solExtStyling.css`;
    const themeLight: Theme = {
        name: 'Solarized Extended Light',
        url: themeURL,
        description: 'Light solarized Logseq theme with extra stuff',
        mode: 'light',
        pid: pluginID
    }
    const themeDark: Theme = {
        name: 'Solarized Extended Dark',
        url: themeURL,
        description: 'Dark solarized Logseq theme with extra stuff',
        mode: 'dark',
        pid: pluginID
    }
    logseq.provideTheme(themeLight);
    logseq.provideTheme(themeDark);
}

const unregisterTheme = () => {
    doc.getElementById('solext-css-core')?.remove();
}


// Check theme activated
const isThemeChosen = () => {
    if (doc.querySelector(`link[href="lsp://logseq.io/${pluginID}/dist/assets/css/solExtStyling.css"]`)) {
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
        case 'Fira Sans (SolExt default)':
            fontVar = '--solext-font-fira-sans'
            break;
        case 'Fira Code Nerd':
            fontVar = '--solext-font-fira-code';
            break;
        case 'iA Writer Quattro':
            fontVar = '--solext-font-aiwriter-quattro';
            break;
        case 'Inter (Logseq default)':
            fontVar = '--solext-font-default-inter';
            break;
        case 'OS System default':
            fontVar = '--solext-font-os-system';
            break;
        default:
            fontVar = '--solext-font-fira-sans';
    }
    if (pluginConfig.fontContentName == 'Fira Code Nerd') {
        body.style.letterSpacing = '-1px';
        body.style.wordSpacing = '-1px';
    } else {
        body.style.letterSpacing = '0';
        body.style.wordSpacing = '0';
    }
    root.style.setProperty('--solext-content-font', `var(${fontVar})`);
    if (pluginConfig.fontContentSize) {
        root.style.setProperty('--solext-content-font-size', pluginConfig.fontContentSize);
    }

    // colors
    root.style.setProperty('--solext-ui-panels-bg-user', pluginConfig[`color${themeMode}UiPanelsBg`]);
    root.style.setProperty('--solext-ui-content-bg-user', toHex(darken(pluginConfig[`color${themeMode}UiPanelsBg`], 0.04)));
    root.style.setProperty('--solext-ui-body-bg-user', pluginConfig[`color${themeMode}UiBodyBg`]);

    root.style.setProperty('--solext-content-border-user', toHex(darken(pluginConfig[`color${themeMode}ContentAltBg`], 0.04)));
    root.style.setProperty('--solext-content-alt-bg-0-user', toHex(darken(pluginConfig[`color${themeMode}ContentAltBg`], 0.02)));
    root.style.setProperty('--solext-content-alt-bg-user', pluginConfig[`color${themeMode}ContentAltBg`]);
    root.style.setProperty('--solext-content-alt-bg-2-user', toHex(lighten(pluginConfig[`color${themeMode}ContentAltBg`], 0.02)));
    root.style.setProperty('--solext-content-alt-bg-3-user', toHex(lighten(pluginConfig[`color${themeMode}ContentAltBg`], 0.04)));

    root.style.setProperty('--solext-content-bg-user', pluginConfig[`color${themeMode}ContentBg`]);
    root.style.setProperty('--solext-content-props-bg-user', pluginConfig[`color${themeMode}ContentPropsBg`]);

    root.style.setProperty('--solext-title-text-user', pluginConfig[`color${themeMode}TitleText`]);
    root.style.setProperty('--solext-content-text-user', pluginConfig[`color${themeMode}ContentText`]);
    root.style.setProperty('--solext-content-text-alt-user', toHex(lighten(pluginConfig[`color${themeMode}ContentText`], 0.2)));
    root.style.setProperty('--solext-content-text-op-user', toHex(transparentize(pluginConfig[`color${themeMode}ContentText`], 0.85)));
    root.style.setProperty('--solext-ui-scroll-user', toHex(transparentize(pluginConfig[`color${themeMode}ContentText`], 0.75)));

    root.style.setProperty('--solext-content-text-bold-user', pluginConfig[`color${themeMode}ContentTextBold`]);
    root.style.setProperty('--solext-content-text-italic-user', pluginConfig[`color${themeMode}ContentTextItalic`]);

    root.style.setProperty('--solext-link-user', pluginConfig[`color${themeMode}Link`]);
    root.style.setProperty('--solext-link-lighter-user', toHex(transparentize(pluginConfig[`color${themeMode}Link`], 0.85)));
    root.style.setProperty('--solext-link-ext-user', pluginConfig[`color${themeMode}LinkExt`]);
    root.style.setProperty('--solext-link-ext-lighter-user', toHex(transparentize(pluginConfig[`color${themeMode}LinkExt`], 0.85)));
    root.style.setProperty('--solext-tag-user', pluginConfig[`color${themeMode}Tag`]);
    root.style.setProperty('--solext-tag-lighter-user', toHex(transparentize(pluginConfig[`color${themeMode}Tag`], 0.85)));

    root.style.setProperty('--solext-mark-bg-user', pluginConfig[`color${themeMode}MarkBg`]);
    root.style.setProperty('--solext-mark-text-user', pluginConfig[`color${themeMode}MarkText`]);
    root.style.setProperty('--solext-quote-bg-user', pluginConfig[`color${themeMode}QuoteBg`]);
    root.style.setProperty('--solext-quote-text-user', pluginConfig[`color${themeMode}QuoteText`]);

    root.style.setProperty('--solext-selected-user', toHex(mix(pluginConfig[`color${themeMode}ContentBg`], pluginConfig[`color${themeMode}Link`], 0.2)));

    root.style.setProperty('--solext-h1-user', pluginConfig[`color${themeMode}H1`]);
    root.style.setProperty('--solext-h2-user', pluginConfig[`color${themeMode}H2`]);
    root.style.setProperty('--solext-h3-user', pluginConfig[`color${themeMode}H3`]);
    root.style.setProperty('--solext-h4-user', pluginConfig[`color${themeMode}H4`]);
    root.style.setProperty('--solext-h5-user', pluginConfig[`color${themeMode}H5`]);
    root.style.setProperty('--solext-h6-user', pluginConfig[`color${themeMode}H6`]);


    // bg
    if (pluginConfig.backgroundURL) {
        root.style.setProperty('--solext-bg-url', `url(${pluginConfig.backgroundURL})`);
    } else {
        root.style.setProperty('--solext-bg-url', 'none');
    }
    root.style.setProperty('--solext-content-padding', pluginConfig.backgroundPadding);
    if (!pluginConfig.backgroundShadow) {
        root.style.setProperty('--solext-bg-shadow', 'none');
    } else {
        root.style.removeProperty('--solext-bg-shadow');
    }

    // banners
    if (!pluginConfig.bannersAsBackground) {
        root.style.setProperty('--solext-banner-asBg', 'none');
    } else {
        root.style.removeProperty('--solext-banner-asBg');
    }
    if (!pluginConfig.bannersIconGlow) {
        root.style.setProperty('--solext-banner-iconGlow', 'none');
    } else {
        root.style.removeProperty('--solext-banner-iconGlow');
    }

    // sticky headers
    setTimeout(() => {
        root.style.setProperty('--solext-sticky-top', getComputedStyle(mainContainer!).getPropertyValue('padding-top').trim());
     }, 3000)

    console.log(`SolExt: styling CSS vars updated`);
}

const setFeaturesCSSVars = () => {
    // features
    if (!pluginConfig.featureHeadersLabelsEnabled) {
        root.style.setProperty('--headers-labels', 'none');
    } else {
        root.style.removeProperty('--headers-labels');
    }
    if (pluginConfig.featureNewBlockBulletEnabled) {
        root.style.setProperty('--new-bullet-hidden', 'none');
    } else {
        root.style.removeProperty('--new-bullet-hidden');
    }
    if (pluginConfig.featureHomeButtonEnabled) {
        root.style.removeProperty('--home-button');
    } else {
        root.style.setProperty('--home-button', 'none');
    }

    // sizes
    root.style.setProperty('--ls-main-content-max-width', pluginConfig.contentMaxWidth);
    root.style.setProperty('--ls-main-content-max-width-wide', pluginConfig.contentWideMaxWidth);
    root.style.setProperty('--ls-left-sidebar-width', pluginConfig.leftSidebarWidth);
    root.style.setProperty('--ls-right-sidebar-width', pluginConfig.rightSidebarWidth);

    console.log(`SolExt: features CSS vars updated`);
}
const unsetGlobalCSSVars = () => {
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
    return `
        :root {
            --ls-primary-text-color:${getComputedStyle(doc.querySelector('.cp__sidebar-main-content')!).color.trim()};
            --ls-link-text-color:${getComputedStyle(doc.querySelector('.content .page-ref:not(.page-property-key)')!).color.trim()};
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
    appContainer = doc.getElementById('app-container');
    mainContainer = doc.getElementById('main-content-container');
}

// Main logseq on ready
const main = async () => {
    console.log(`SolExt: plugin loaded`);

    registerTheme();

    logseq.useSettingsSchema(settingSchema);

    getDOMContainers();
    themeMode = root.getAttribute('data-theme') || 'light';
    themeMode = themeMode.charAt(0).toUpperCase() + themeMode.slice(1);
    pluginConfig = logseq.settings as LSPluginBaseInfo['settings'];

    // Init observers
    initModalObserver();
    initPluginsIframesObserver();
    initLinksObserver();
    initHeadersObserver();

    // First thme run
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

        // Listen sidebar update
        logseq.App.onSidebarVisibleChanged(({visible}) => {
            onSidebarVisibleChangedCallback(visible);
        });

        // Listen settings update
        logseq.onSettingsChanged((settings, oldSettings) => {
            onSettingsChangedCallback(settings, oldSettings);
        });

        // Listen for pages switch
        logseq.App.onRouteChanged( async () => {
            routeChangedCallback();
        })

        // Listen plugin unload
        logseq.beforeunload(async () => {
            onPluginUnloadCallback();
        });

        injectColorpickerAssets();

    }, 2000)

};

logseq.ready(main).catch(console.error);
