import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';

import { globals, presetsConfig } from '../globals/globals';

export const settingsConfig: SettingSchemaDesc[] = [
    {
        key: 'settingsWarning',
        title: '',
        description: globals.settingsWarningMsg,
        type: 'boolean',
        default: false,
    },
    {
        key: 'promoAwesomeLinks',
        title: '',
        description: globals.promoAwesomeLinksMsg,
        type: 'boolean',
        default: false,
    },
    {
        key: 'promoAwesomeUI',
        title: '',
        description: globals.promoAwesomeUIMsg,
        type: 'boolean',
        default: false,
    },
    {
        key: 'infoWarning',
        title: '',
        description: globals.themeWarningMsg,
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
        title: 'Choose preset: built-in (uneditable ⚠) OR user "Custom 1/2/3" (editable)',
        description: '(press "Clone" button to copy values to your custom preset with overwriting ⚠)',
        type: 'enum',
        enumPicker: 'select',
        enumChoices: [
            'Solarized_default',
            'Logseq_original',
            'Mia_quattro',
            'Chocolate',
            'Custom',
            'Custom2',
            'Custom3'
        ],
        default: 'Solarized_default',
    },
    {
        key: 'presetCustom',
        title: 'Custom theme configuration',
        description: '',
        type: 'object',
        default: presetsConfig.Solarized_default,
    },
    {
        key: 'presetCustom2',
        title: 'Custom2 theme configuration',
        description: '',
        type: 'object',
        default: presetsConfig.Solarized_default,
    },
    {
        key: 'presetCustom3',
        title: 'Custom3 theme configuration',
        description: '',
        type: 'object',
        default: presetsConfig.Solarized_default,
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
            'Mulish',
            'Inter (Logseq default)',
            'OS System default'
        ],
        default: presetsConfig.Solarized_default.fontContentName,
    },
    {
        key: 'fontContentSize',
        title: 'Content font size',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.fontContentSize,
    },
    {
        key: 'fontUiSize',
        title: 'UI font size',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.fontUiSize,
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
        default: presetsConfig.Solarized_default.colorLightUiPanelsBg
    },
    {
        key: 'colorLightUiBodyBg',
        title: 'Body bg',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightUiBodyBg
    },
    {
        key: 'colorLightContentBg',
        title: 'Page bg',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightContentBg
    },
    {
        key: 'colorLightContentPropsBg',
        title: 'Props bg',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightContentPropsBg
    },
    {
        key: 'colorLightContentAltBg',
        title: 'References bg',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightContentAltBg
    },
    {
        key: 'colorLightTitleText',
        title: 'Title',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightTitleText
    },
    {
        key: 'colorLightContentText',
        title: 'Text',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightContentText
    },
    {
        key: 'colorLightContentTextBold',
        title: 'Bold',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightContentTextBold
    },
    {
        key: 'colorLightContentTextItalic',
        title: 'Italic',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightContentTextItalic
    },
    {
        key: 'colorLightContentTextCode',
        title: 'Inline code',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightContentTextCode
    },
    {
        key: 'colorLightLink',
        title: 'Link (internal)',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightLink
    },
    {
        key: 'colorLightLinkExt',
        title: 'Link (external)',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightLinkExt
    },
    {
        key: 'colorLightTag',
        title: 'Tag',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightTag
    },
    {
        key: 'colorLightH1',
        title: 'H1',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightH1
    },
    {
        key: 'colorLightH2',
        title: 'H2',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightH2
    },
    {
        key: 'colorLightH3',
        title: 'H3',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightH3
    },
    {
        key: 'colorLightH4',
        title: 'H4',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightH4
    },
    {
        key: 'colorLightH5',
        title: 'H5',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightH5
    },
    {
        key: 'colorLightH6',
        title: 'H6',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightH6
    },
    {
        key: 'colorLightMarkBg',
        title: 'Highlight bg',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightMarkBg
    },
    {
        key: 'colorLightMarkText',
        title: 'Highlight text',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightMarkText
    },
    {
        key: 'colorLightQuoteBg',
        title: 'Quote bg',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightQuoteBg
    },
    {
        key: 'colorLightQuoteText',
        title: 'Quote text',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorLightQuoteText
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
        default: presetsConfig.Solarized_default.colorDarkUiPanelsBg
    },
    {
        key: 'colorDarkUiBodyBg',
        title: 'Body bg',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkUiBodyBg
    },
    {
        key: 'colorDarkContentBg',
        title: 'Page bg',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkContentBg
    },
    {
        key: 'colorDarkContentPropsBg',
        title: 'Props bg',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkContentPropsBg
    },
    {
        key: 'colorDarkContentAltBg',
        title: 'References bg',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkContentAltBg
    },
    {
        key: 'colorDarkTitleText',
        title: 'Title',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkTitleText
    },
    {
        key: 'colorDarkContentText',
        title: 'Text',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkContentText
    },
    {
        key: 'colorDarkContentTextBold',
        title: 'Bold',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkContentTextBold
    },
    {
        key: 'colorDarkContentTextItalic',
        title: 'Italic',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkContentTextItalic
    },
    {
        key: 'colorDarkContentTextCode',
        title: 'Inline code',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkContentTextCode
    },
    {
        key: 'colorDarkLink',
        title: 'Link (internal)',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkLink
    },
    {
        key: 'colorDarkLinkExt',
        title: 'Link (external)',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkLinkExt
    },
    {
        key: 'colorDarkTag',
        title: 'Tag',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkTag
    },
    {
        key: 'colorDarkH1',
        title: 'H1',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkH1
    },
    {
        key: 'colorDarkH2',
        title: 'H2',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkH2
    },
    {
        key: 'colorDarkH3',
        title: 'H3',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkH3
    },
    {
        key: 'colorDarkH4',
        title: 'H4',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkH4
    },
    {
        key: 'colorDarkH5',
        title: 'H5',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkH5
    },
    {
        key: 'colorDarkH6',
        title: 'H6',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkH6
    },
    {
        key: 'colorDarkMarkBg',
        title: 'Highlight bg',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkMarkBg
    },
    {
        key: 'colorDarkMarkText',
        title: 'Highlight text',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkMarkText
    },
    {
        key: 'colorDarkQuoteBg',
        title: 'Quote bg',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkQuoteBg
    },
    {
        key: 'colorDarkQuoteText',
        title: 'Quote text',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.colorDarkQuoteText
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
        default: presetsConfig.Solarized_default.backgroundURL,
    },
    {
        key: 'backgroundPadding',
        title: 'Content background padding (top right bottom left)',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.backgroundPadding,
    },
    {
        key: 'backgroundShadow',
        title: '',
        description: 'Enable content shadow?',
        type: 'boolean',
        default: presetsConfig.Solarized_default.backgroundShadow
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
        default: presetsConfig.Solarized_default.bannersAsBackground,
    },
    {
        key: 'bannersIconGlow',
        title: '',
        description: 'Add glow to banner icon?',
        type: 'boolean',
        default: presetsConfig.Solarized_default.bannersIconGlow,
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
        default: presetsConfig.Solarized_default.contentMaxWidth,
    },
    {
        key: 'contentWideMaxWidth',
        title: 'Content max width in wide mode (in px, %, vw)',
        description: '',
        type: 'string',
        default: presetsConfig.Solarized_default.contentWideMaxWidth,
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
    {
        key: 'otherHeading',
        title: 'Other',
        description: '',
        type: 'heading',
        default: null,
    },
    {
        key: 'featureUpdaterEnabled',
        title: '',
        description: 'Enable new version notifier on app load?',
        type: 'boolean',
        default: true,
    },
];
