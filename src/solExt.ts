import '@logseq/libs';
import type Pickr from '@simonwep/pickr';
import { lighten, darken, transparentize, mix, toHex, readableColor } from 'color2k';
import { SettingSchemaDesc, LSPluginBaseInfo, Theme } from '@logseq/libs/dist/LSPlugin.user';

import tabsPluginStyles from './tabsPlugin.css';

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

const pluginID = 'solarized-extended';
const isSolExtRunnedClass = 'is-solext-runned';
const isTabsLoadedClass = 'is-tabs-loaded';
const isSettingsOpenedClass = 'is-settings-opened';
const isSearchOpenedClass = 'is-search-opened';
const isSearchReorderedClass = 'is-search-reordered';
const headersSelector = `.page-blocks-inner > div > div > div > div > div > div > .ls-block:not([haschild='']):not([data-refs-self='["quote"]']):not([data-refs-self='["card"]']):not(.pre-block) > .flex-row`;

let doc: Document;
let root: HTMLElement;
let body: HTMLElement;
let modalContainer: HTMLElement | null;
let appContainer: HTMLElement | null;
let mainContainer: HTMLElement | null;
let tabsPluginIframe: HTMLIFrameElement | null;


let runtimeout = 500;
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
        colorLightContentText: '#334247',
        colorLightLink: '#009991',
        colorLightTag: '#008ECE',
        colorLightUiPanelsBg: '#EDE4D4',
        colorLightUiBodyBg: '#FEF8EC',
        colorLightContentBg: '#FEF8EC',
        colorLightContentAltBg: '#F0E9DB',
        colorLightMarkBg: '#F9D86C',
        colorLightMarkText: '#334247',
        colorLightQuoteBg: '#D7EADD',
        colorLightQuoteText: '#334247',
        colorDarkContentText: '#AFB6B6',
        colorDarkLink: '#B88726',
        colorDarkTag: '#869629',
        colorDarkUiPanelsBg: '#002933',
        colorDarkUiBodyBg: '#00323d',
        colorDarkContentBg: '#00323d',
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
        colorLightContentText: '#433F38',
        colorLightLink: '#106BA3',
        colorLightTag: '#106BA3',
        colorLightUiPanelsBg: '#FFFFFF',
        colorLightUiBodyBg: '#FFFFFF',
        colorLightContentBg: '#FFFFFF',
        colorLightContentAltBg: '#F7F7F7',
        colorLightMarkBg: '#FEF4AE',
        colorLightMarkText: '#262626',
        colorLightQuoteBg: '#FBFAF8',
        colorLightQuoteText: '#433F38',
        colorDarkContentText: '#A4B5B6',
        colorDarkLink: '#8ABBBB',
        colorDarkTag: '#8ABBBB',
        colorDarkUiPanelsBg: '#003642',
        colorDarkUiBodyBg: '#052B36',
        colorDarkContentBg: '#052B36',
        colorDarkContentAltBg: '#083643',
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
        colorLightContentText: '#1A1A1A',
        colorLightLink: '#0B82B9',
        colorLightTag: '#747474',
        colorLightUiPanelsBg: '#EAEAEA',
        colorLightUiBodyBg: '#F7F7F7',
        colorLightContentBg: '#F7F7F7',
        colorLightContentAltBg: '#EAEAEA',
        colorLightMarkBg: '#FDEB95',
        colorLightMarkText: '#262626',
        colorLightQuoteBg: '#EAEAEA',
        colorLightQuoteText: '#1A1A1A',
        colorDarkContentText: '#CCCCCC',
        colorDarkLink: '#18BDEC',
        colorDarkTag: '#909090',
        colorDarkUiPanelsBg: '#27272A',
        colorDarkUiBodyBg: '#18181A',
        colorDarkContentBg: '#18181A',
        colorDarkContentAltBg: '#27272A',
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
        colorLightContentText: '#2D3D43',
        colorLightLink: '#368B96',
        colorLightTag: '#CA7B70',
        colorLightUiPanelsBg: '#E3D6CE',
        colorLightUiBodyBg: '#E9DED8',
        colorLightContentBg: '#E9DED8',
        colorLightContentAltBg: '#E5D6D0',
        colorLightMarkBg: '#E5D1CB',
        colorLightMarkText: '#C26256',
        colorLightQuoteBg: '#D9C5C0',
        colorLightQuoteText: '#9A6064',
        colorDarkContentText: '#B5937D',
        colorDarkLink: '#56B6C2',
        colorDarkTag: '#B33D4B',
        colorDarkUiPanelsBg: '#34282B',
        colorDarkUiBodyBg: '#2B2124',
        colorDarkContentBg: '#2B2124',
        colorDarkContentAltBg: '#34282B',
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
        description: '(press "Clone" button to copy values to your "Custom" preset)',
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
        key: 'fontsHeading',
        title: 'Fonts',
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
        title: 'UI Panels bg (header, sidebars)',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightUiPanelsBg
    },
    {
        key: 'colorLightUiBodyBg',
        title: 'UI body bg (around content)',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightUiBodyBg
    },
    {
        key: 'colorLightContentBg',
        title: 'Content bg',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightContentBg
    },
    {
        key: 'colorLightContentAltBg',
        title: 'Blocks bg (references, props)',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightContentAltBg
    },
    {
        key: 'colorLightContentText',
        title: 'Text color',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightContentText
    },
    {
        key: 'colorLightLink',
        title: 'Link color',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightLink
    },
    {
        key: 'colorLightTag',
        title: 'Tag color',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorLightTag
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
        title: 'UI Panels bg (header, sidebars)',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkUiPanelsBg
    },
    {
        key: 'colorDarkUiBodyBg',
        title: 'UI body bg (around content)',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkUiBodyBg
    },
    {
        key: 'colorDarkContentBg',
        title: 'Content bg',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkContentBg
    },
    {
        key: 'colorDarkContentAltBg',
        title: 'Blocks bg (references, props)',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkContentAltBg
    },
    {
        key: 'colorDarkContentText',
        title: 'Text color',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkContentText
    },
    {
        key: 'colorDarkLink',
        title: 'Link color',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkLink
    },
    {
        key: 'colorDarkTag',
        title: 'Tag color',
        description: '',
        type: 'string',
        default: presets.SolExt_default.colorDarkTag
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
        key: 'featuresHeading',
        title: 'Features',
        description: '',
        type: 'heading',
        default: null,
    },
    {
        key: 'faviconsEnabled',
        title: '',
        description: 'Enable favicons for external links?',
        type: 'boolean',
        default: true,
    },
    {
        key: 'stickyHeadersEnabled',
        title: '',
        description: 'Enable sticky headers (h1-h5 in document root)?',
        type: 'boolean',
        default: true,
    },
    {
        key: 'headersLabelsEnabled',
        title: '',
        description: 'Show headers labels?',
        type: 'boolean',
        default: true,
    },
    {
        key: 'newBlockBulletEnabled',
        title: '',
        description: 'Always show add block bullet on page bottom?',
        type: 'boolean',
        default: false,
    },
    {
        key: 'homeButtonEnabled',
        title: '',
        description: 'Show Home button?',
        type: 'boolean',
        default: false,
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
        key: 'widthHeading',
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
    initInputs();
    initPresetCopy();
    initColorpickers();
}

// Presets
const updatePresets = () => {
    applyPreset();
    refreshSettingsPage();
    initInputs();
    body.classList.remove(`preset-${oldPluginConfig.presetName}`);
    body.classList.add(`preset-${pluginConfig.presetName}`);
}

const refreshSettingsPage = () => {
    const pluginLink = doc.querySelector('.settings-plugin-item[data-id="logseq-solarized-extended-theme"]') as HTMLAnchorElement;
    if (!pluginLink) { return }
    (pluginLink?.parentNode?.previousSibling as Element)?.getElementsByTagName('a')[0].click();
    setTimeout(() => {
        pluginLink.click();
    }, 100)
}

const initPresetCopy = () => {
    if (pluginConfig.presetName !== 'Custom') {
        const presetsSelector = doc.querySelector('.desc-item[data-key="presetName"] .form-select') as HTMLSelectElement;
        if (!presetsSelector) {
            return;
        }
        presetsSelector?.insertAdjacentHTML(
            'afterend',
            `<button class="button preset-copy-button" title="Clone preset values to your Custom preset and switch to it">
                <i class= "ti ti-clipboard-list"></i>Clone
            </button >`
        )
        const presetCopyButton = doc.querySelector('.panel-wrap[data-id="logseq-solarized-extended-theme"] .preset-copy-button');
        presetCopyButton?.addEventListener('click', () => {
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
    const pluginPanel = doc.querySelector('.panel-wrap[data-id="logseq-solarized-extended-theme"]');
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
    const pluginPanel = doc.querySelector('.panel-wrap[data-id="logseq-solarized-extended-theme"]');
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
    switch (pluginConfig.presetName) {
        case 'SolExt_default':
            logseq.updateSettings(presets.SolExt_default);
            break;
        case 'Logseq_original':
            logseq.updateSettings(presets.Logseq_original);
            break;
        case 'Mia_quattro':
            logseq.updateSettings(presets.Mia_quattro);
            break;
        case 'Chocolate':
            logseq.updateSettings(presets.Chocolate);
            break;
        case 'Custom':
            logseq.updateSettings(pluginConfig.presetCustom);
            break;
        default:
            logseq.updateSettings(presets.SolExt_default);
    }
    isPresetApplied = true;
    console.log(`SolExt: applied preset ${pluginConfig.presetName}`);
}

// Colors
const initColorpickers = () => {
    const pluginPanel = doc.querySelector('.panel-wrap[data-id="logseq-solarized-extended-theme"]');
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
                useAsButton: true,
                autoReposition: false,
                position: 'bottom-middle',
                components: {
                    // Main components
                    opacity: false,
                    hue: true,
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

// Update favicons features
const toggleFaviconsFeature = () => {
    if (pluginConfig.faviconsEnabled) {
        setFaviconsOnLoad();
    } else {
        setFaviconsOnUnload();
    }
}
// Update headers features
const toggleHeadersFeature = () => {
    if (pluginConfig.stickyHeadersEnabled) {
        setHeadersOnLoad();
    } else {
        setHeadersOnUnload();
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
            const SolExtPluginItem = doc.querySelector('.ui__modal.is-sub-modal .settings-plugin-item[data-id="logseq-solarized-extended-theme"]') as HTMLAnchorElement;
            if (!SolExtPluginItem) {
                return;
            }
            SolExtPluginItem.addEventListener('click', () => {
                setTimeout(() => {
                    tweakPluginSettings();
                }, 500)
            });
        }, 500)
    });
}

// Reposition toolbar search button
const searchOnLoad = async () => {
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
const searchOnUnload = () => {
    const leftToolbar = doc.querySelector('#head .l');
    const search = doc.getElementById('search-button');
    if (!leftToolbar || !search) {
        return;
    }
    leftToolbar.insertAdjacentElement('beforeend', search);
    body.classList.remove(isSearchReorderedClass);
}

// Reposition right sidebar toggle button
const rightSidebarOnLoad = async () => {
    const toggleRightSidebar = doc.querySelector('#right-sidebar .toggle-right-sidebar');
    reorderRightSidebarToggleButton(toggleRightSidebar ? true : false);
}
const rightSidebarOnUnload = async () => {
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
            pluginDocument.body.classList.add('is-mac');
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
const tabsPluginOnLoad = async () => {
    if (tabsPluginIframe) {
        body.classList.add(isTabsLoadedClass);
        tabPluginInjectCSS(tabsPluginIframe);
        tabPluginInjectCSSVars(tabsPluginIframe);
    }
    runPluginsIframeObserver();
}
const tabsPluginOnUnload = () => {
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
}
const removeFavicons = () => {
    const favicons = doc.querySelectorAll('.external-link-img');
    if (favicons.length) {
        for (let i = 0; i < favicons.length; i++) {
            favicons[i].remove();
        }
    }
}

// First init run
const setFaviconsOnLoad = () => {
    if (!pluginConfig.faviconsEnabled) {
        return;
    }
    setTimeout(() => {
        const extLinkList: NodeListOf<HTMLAnchorElement> = doc.querySelectorAll('.external-link');
        setFavicons(extLinkList);
        runExtLinksObserver();
    }, 500);
}
const setFaviconsOnUnload = () => {
    extLinksObserver.disconnect();
    removeFavicons();
}

// Favicons observer
let extLinksObserver: MutationObserver, extLinksObserverConfig: MutationObserverInit;
const extLinksCallback: MutationCallback = function (mutationsList) {
    if (!appContainer) {
        return;
    }
    for (let i = 0; i < mutationsList.length; i++) {
        const addedNode = mutationsList[i].addedNodes[0] as HTMLAnchorElement;
        if (addedNode && addedNode.childNodes.length) {
            const extLinkList = addedNode.querySelectorAll('.external-link') as NodeListOf<HTMLAnchorElement>;
            if (extLinkList.length) {
                extLinksObserver.disconnect();
                setFavicons(extLinkList);
                extLinksObserver.observe(appContainer, extLinksObserverConfig);
            }
        }
    }
};
const initExtLinksObserver = () => {
    extLinksObserverConfig = { childList: true, subtree: true };
    extLinksObserver = new MutationObserver(extLinksCallback);
}
const runExtLinksObserver = () => {
    if (!appContainer) {
        return;
    }
    extLinksObserver.observe(appContainer, extLinksObserverConfig);
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
const setHeadersOnLoad = () => {
    if (!pluginConfig.stickyHeadersEnabled) {
        return;
    }
    setTimeout(() => {
        const headersList = doc.querySelectorAll(headersSelector);
        setHeaders(headersList);
        runHeadersObserver();
    }, 500);
}
const setHeadersOnUnload = () => {
    headersObserver.disconnect();
    const headersList = doc.querySelectorAll('.will-stick');
    if (headersList.length) {
        for (let i = 0; i < headersList.length; i++) {
            headersList[i].classList.remove('will-stick');
        }
    }
}

// Main logic runners
const runStuff = () => {
    isThemeRunned = true;
    body.classList.add(isSolExtRunnedClass);
    const presetName = logseq.settings?.presetName;
    if (!presetName) {
        console.log(`SolExt: no settings ini file! Run later`);
        runtimeout = 2000;
    }
    setTimeout(() => {
        body.classList.add(`preset-${logseq.settings?.presetName}`);
        tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
        setGlobalCSSVars();
        searchOnLoad();
        rightSidebarOnLoad();
        tabsPluginOnLoad();
        setFaviconsOnLoad();
        setHeadersOnLoad();
        runModalObserver();
    }, runtimeout)
}
const stopStuff = () => {
    isThemeRunned = false;
    body.classList.remove(isSolExtRunnedClass);
    body.classList.remove(`preset-${pluginConfig.presetName}`);
    unsetGlobalCSSVars();
    searchOnUnload();
    rightSidebarOnUnload();
    tabsPluginOnUnload();
    setFaviconsOnUnload();
    setHeadersOnUnload();
    modalObserver.disconnect();
}

// Setting changed
const onSidebarVisibleChangedCallback = (visible: boolean) => {
    if (!isThemeRunned) {
        return;
    }
    reorderRightSidebarToggleButton(visible);
}

// Setting changed
const onSettingsChangedCallback = (settings: LSPluginBaseInfo['settings'], oldSettings: LSPluginBaseInfo['settings']) => {
    if (!isThemeRunned) {
        return;
    }

    oldPluginConfig = { ...oldSettings };
    pluginConfig = { ...settings };

    if (isPresetApplied) {
        console.log(`SolExt: settings changed programmatically (preset applied), skipping`);
        isPresetApplied = false;
        updateCSSVars();
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
    console.log(`SolExt: settings changed`);
    const settingsDiff = objectDiff(oldPluginConfig, pluginConfig)
    console.log(`SolExt: settings changed:`, settingsDiff);

    if (settingsDiff.includes('presetName')) {
        updatePresets();
    } else {
        updateCSSVars();
        duplicateSettingsToCustom();
    }
    if (settingsDiff.includes('faviconsEnabled')) {
        toggleFaviconsFeature();
    }
    if (settingsDiff.includes('stickyHeadersEnabled')) {
        toggleHeadersFeature();
    }
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
// Update all CSS vars
const updateCSSVars = () => {
    setGlobalCSSVars();
    if (tabsPluginIframe) {
        tabPluginInjectCSSVars(tabsPluginIframe);
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
    themeMode = theme.mode.charAt(0).toUpperCase() + theme.mode.slice(1);
    if (theme.pid === 'logseq-solarized-extended-theme') {
        console.log(`SolExt: switching to SolExt theme detected!`);
        if (isThemeRunned) {
        console.log(`SolExt: ...but skipping init, already runned!`);
            return
        }
        runStuff();
    } else {
        stopStuff();
    }
}

// Theme mode changed
const onThemeModeChangedCallback = (mode: string) => {
    if (!isThemeRunned) {
        return;
    }
    console.log(`SolExt: theme mode changed to`, mode);
    themeMode = mode.charAt(0).toUpperCase() + mode.slice(1);
    updateCSSVars();
}

// Plugin unloaded
const onPluginUnloadCallback = () => {
    if (!isThemeRunned) {
        return;
    }
    stopStuff();
}

const registerTheme = async () => {
    const themeURL = 'lsp://logseq.io/logseq-solarized-extended-theme/dist/assets/solExtTheme.css';
    // let response = await fetch('http://localhost:3000/src/solExtTheme.css')
    // if (response.status === 200) {
    //     themeURL = 'http://localhost:3000/src/solExtTheme.css'
    // }
    const themeLight: Theme = {
        name: 'Solarized Extended Light Theme',
        url: themeURL,
        description: 'Light solarized Logseq theme with extra stuff',
        mode: 'light',
        pid: pluginID
    }
    const themeDark: Theme = {
        name: 'Solarized Extended Dark Theme',
        url: themeURL,
        description: 'Dark solarized Logseq theme with extra stuff',
        mode: 'dark',
        pid: `pluginID`
    }
    logseq.provideTheme(themeLight);
    logseq.provideTheme(themeDark);
}

// Check theme activated
const isThemeChosen = () => {
    if (doc.querySelector('link[href="lsp://logseq.io/logseq-solarized-extended-theme/dist/assets/solExtTheme.css"]')) {
        console.log(`SolExt: theme is chosen!`);
        return true;
    }
    return false
}

const injectColorpickerAssets = async () => {
    const pickerCSS = doc.createElement('link');
    pickerCSS.rel = 'stylesheet';
    pickerCSS.href = 'https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/monolith.min.css';
    doc.getElementsByTagName('head')[0].appendChild(pickerCSS);
    const pickerJS = doc.createElement('script');
    pickerJS.type = 'text/javascript';
    pickerJS.async = true;
    pickerJS.src = 'https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js';
    doc.getElementsByTagName('head')[0].appendChild(pickerJS);
}

// Global Logseq CSS variables
const setGlobalCSSVars = () => {
    // fonts
    switch (pluginConfig.fontContentName) {
        case 'Fira Sans (SolExt default)':
            root.style.setProperty('--solext-content-font', 'var(--solext-font-fira-sans)');
            break;
        case 'iA Writer Quattro':
            root.style.setProperty('--solext-content-font', 'var(--solext-font-aiwriter-quattro)');
            break;
        case 'Inter (Logseq default)':
            root.style.setProperty('--solext-content-font', 'var(--solext-font-default-inter)');
            break;
        case 'OS System default':
            root.style.setProperty('--solext-content-font', 'var(--solext-font-os-system)');
            break;
        default:
            root.style.setProperty('--solext-content-font', 'var(--solext-font-fira-sans)');
    }
    if (pluginConfig.fontContentSize) {
        root.style.setProperty('--solext-content-font-size', pluginConfig.fontContentSize);
    }

    // colors
    root.style.setProperty('--solext-ui-panels-bg-user', pluginConfig[`color${themeMode}UiPanelsBg`]);
    root.style.setProperty('--solext-ui-border-user', toHex(darken(pluginConfig[`color${themeMode}UiPanelsBg`], 0.08)));
    root.style.setProperty('--solext-ui-content-bg-user', toHex(darken(pluginConfig[`color${themeMode}UiPanelsBg`], 0.04)));
    root.style.setProperty('--solext-ui-body-bg-user', pluginConfig[`color${themeMode}UiBodyBg`]);

    root.style.setProperty('--solext-content-border-user', toHex(darken(pluginConfig[`color${themeMode}ContentAltBg`], 0.04)));
    root.style.setProperty('--solext-content-alt-bg-0-user', toHex(darken(pluginConfig[`color${themeMode}ContentAltBg`], 0.02)));
    root.style.setProperty('--solext-content-alt-bg-user', pluginConfig[`color${themeMode}ContentAltBg`]);
    root.style.setProperty('--solext-content-alt-bg-2-user', toHex(lighten(pluginConfig[`color${themeMode}ContentAltBg`], 0.02)));
    root.style.setProperty('--solext-content-alt-bg-3-user', toHex(lighten(pluginConfig[`color${themeMode}ContentAltBg`], 0.04)));

    root.style.setProperty('--solext-content-bg-user', pluginConfig[`color${themeMode}ContentBg`]);

    root.style.setProperty('--solext-content-text-user', pluginConfig[`color${themeMode}ContentText`]);
    root.style.setProperty('--solext-content-text-alt-user', toHex(lighten(pluginConfig[`color${themeMode}ContentText`], 0.2)));
    root.style.setProperty('--solext-content-text-op-user', toHex(transparentize(pluginConfig[`color${themeMode}ContentText`], 0.85)));
    root.style.setProperty('--solext-ui-scroll-user', toHex(transparentize(pluginConfig[`color${themeMode}ContentText`], 0.75)));

    root.style.setProperty('--solext-link-user', pluginConfig[`color${themeMode}Link`]);
    root.style.setProperty('--solext-link-lighter-user', toHex(transparentize(pluginConfig[`color${themeMode}Link`], 0.85)));
    root.style.setProperty('--solext-tag-user', pluginConfig[`color${themeMode}Tag`]);
    root.style.setProperty('--solext-tag-lighter-user', toHex(transparentize(pluginConfig[`color${themeMode}Tag`], 0.85)));

    root.style.setProperty('--solext-mark-bg-user', pluginConfig[`color${themeMode}MarkBg`]);
    root.style.setProperty('--solext-mark-text-user', pluginConfig[`color${themeMode}MarkText`]);
    root.style.setProperty('--solext-quote-bg-user', pluginConfig[`color${themeMode}QuoteBg`]);
    root.style.setProperty('--solext-quote-text-user', pluginConfig[`color${themeMode}QuoteText`]);

    root.style.setProperty('--solext-selected-user', toHex(mix(pluginConfig[`color${themeMode}ContentBg`], pluginConfig[`color${themeMode}Link`], 0.2)));

    // features
    if (!pluginConfig.headersLabelsEnabled) {
        root.style.setProperty('--headers-labels', 'none');
    } else {
        root.style.removeProperty('--headers-labels');
    }
    if (pluginConfig.newBlockBulletEnabled) {
        root.style.setProperty('--new-bullet-hidden', 'none');
    } else {
        root.style.removeProperty('--new-bullet-hidden');
    }
    if (pluginConfig.homeButtonEnabled) {
        root.style.setProperty('--hidden-home', 'none');
    } else {
        root.style.removeProperty('--hidden-home');
    }

    // sizes
    root.style.setProperty('--ls-main-content-max-width', pluginConfig.contentMaxWidth);
    root.style.setProperty('--ls-main-content-max-width-wide', pluginConfig.contentWideMaxWidth);
    root.style.setProperty('--ls-left-sidebar-width', pluginConfig.leftSidebarWidth);
    root.style.setProperty('--ls-right-sidebar-width', pluginConfig.rightSidebarWidth);

    // bg
    if (pluginConfig.backgroundURL) {
        root.style.setProperty('--bg-url', `url(${pluginConfig.backgroundURL})`);
    } else {
        root.style.setProperty('--bg-url', 'none');
    }
    if (pluginConfig.backgroundPadding) {
        root.style.setProperty('--solext-content-padding', pluginConfig.backgroundPadding);
    } else {
        root.style.setProperty('--bg-url', 'none');
    }
    if (!pluginConfig.backgroundShadow) {
        root.style.setProperty('--bg-shadow', 'none');
    } else {
        root.style.removeProperty('--bg-shadow');
    }

    // banners
    if (!pluginConfig.bannersAsBackground) {
        root.style.setProperty('--banner-asBg', 'none');
    } else {
        root.style.removeProperty('--banner-asBg');
    }
    if (!pluginConfig.bannersIconGlow) {
        root.style.setProperty('--banner-iconGlow', 'none');
    } else {
        root.style.removeProperty('--banner-iconGlow');
    }

    root.style.setProperty('--solext-sticky-top', getComputedStyle(mainContainer!).getPropertyValue('padding-top').trim());

    console.log(`SolExt: global CSS vars updated`);
}
const unsetGlobalCSSVars = () => {
    root.style.removeProperty('--ls-main-content-max-width');
    root.style.removeProperty('--ls-main-content-max-width-wide');
    root.style.removeProperty('--ls-left-sidebar-width');
    root.style.removeProperty('--ls-right-sidebar-width');
    root.style.removeProperty('--new-bullet-hidden');
    root.style.removeProperty('--headers-labels');
    root.style.removeProperty('--banner-asBg');
    root.style.removeProperty('--banner-iconGlow');
    root.style.removeProperty('--bg-url');
}

const tabsPluginCSSVars = (): string => {
    return `
        :root {
            --ls-title-text-color: ${getComputedStyle(top!.document.documentElement).getPropertyValue('--ls-title-text-color').trim()};
            --ls-primary-text-color: ${getComputedStyle(top!.document.documentElement).getPropertyValue('--ls-primary-text-color').trim()};
            --solext-ui-panels-bg: ${getComputedStyle(top!.document.documentElement).getPropertyValue('--solext-ui-panels-bg').trim()};
            --solext-ui-content-bg: ${getComputedStyle(top!.document.documentElement).getPropertyValue('--solext-ui-content-bg').trim()};
            --solext-ui-border: ${getComputedStyle(top!.document.documentElement).getPropertyValue('--solext-ui-border').trim()};
            --solext-link: ${getComputedStyle(top!.document.documentElement).getPropertyValue('--solext-link').trim()};
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

    logseq.provideStyle(`
        body:not(.is-solext-runned) .ui__modal.is-sub-modal .settings-plugin-item[data-id="logseq-solarized-extended-theme"] {
            display: none;
        }
    `);

    registerTheme();
    logseq.useSettingsSchema(settingSchema);

    getDOMContainers();
    themeMode = root.getAttribute('data-theme') || 'light';
    themeMode = themeMode.charAt(0).toUpperCase() + themeMode.slice(1);
    pluginConfig = logseq.settings as LSPluginBaseInfo['settings'];

    // Init observers
    initModalObserver();
    initPluginsIframesObserver();
    initExtLinksObserver();
    initHeadersObserver();

    // First thme run
    if (isThemeChosen()) {
        runStuff();
    }

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
        logseq.App.onSidebarVisibleChanged(({visible}) => {
            onSidebarVisibleChangedCallback(visible);
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

};

logseq.ready(main).catch(console.error);
