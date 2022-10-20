import { lighten, darken, transparentize, mix, toHex } from 'color2k';

import {
    globalContext,
    root, body
} from '../internal';

export const setStylingCSSVars = () => {
    const themeModeAttr = root.getAttribute('data-theme') || '';
    globalContext.themeMode = themeModeAttr.charAt(0).toUpperCase() + themeModeAttr.slice(1);

    // fonts
    let fontVar = '';
    switch (globalContext.pluginConfig.fontContentName) {
        case 'Fira Sans (theme default)':
            fontVar = '--awSt-font-fira-sans'
            break;
        case 'Fira Code Nerd':
            fontVar = '--awSt-font-fira-code';
            break;
        case 'iA Writer Quattro':
            fontVar = '--awSt-font-aiwriter-quattro';
            break;
        case 'Mulish':
            fontVar = '--awSt-font-mulish';
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
    if (globalContext.pluginConfig.fontContentName == 'Fira Code Nerd') {
        body.style.letterSpacing = '-1px';
        body.style.wordSpacing = '-1px';
    } else {
        body.style.letterSpacing = '0';
        body.style.wordSpacing = '0';
    }
    root.style.setProperty('--awSt-content-font', `var(${fontVar})`);
    if (globalContext.pluginConfig.fontContentSize) {
        root.style.setProperty('--awSt-content-font-size', globalContext.pluginConfig.fontContentSize);
    }
    if (globalContext.pluginConfig.fontUiSize) {
        root.style.setProperty('--awSt-ui-font-size', globalContext.pluginConfig.fontUiSize);
    }

    // colors
    root.style.setProperty('--awSt-ui-panels-bg-user', globalContext.pluginConfig[`color${globalContext.themeMode}UiPanelsBg`]);
    root.style.setProperty('--awSt-ui-content-bg-user', toHex(darken(globalContext.pluginConfig[`color${globalContext.themeMode}UiPanelsBg`], 0.04)));
    root.style.setProperty('--awSt-ui-body-bg-user', globalContext.pluginConfig[`color${globalContext.themeMode}UiBodyBg`]);

    root.style.setProperty('--awSt-content-border-user', toHex(darken(globalContext.pluginConfig[`color${globalContext.themeMode}ContentAltBg`], 0.04)));
    root.style.setProperty('--awSt-content-alt-bg-0-user', toHex(darken(globalContext.pluginConfig[`color${globalContext.themeMode}ContentAltBg`], 0.02)));
    root.style.setProperty('--awSt-content-alt-bg-user', globalContext.pluginConfig[`color${globalContext.themeMode}ContentAltBg`]);
    root.style.setProperty('--awSt-content-alt-bg-2-user', toHex(lighten(globalContext.pluginConfig[`color${globalContext.themeMode}ContentAltBg`], 0.02)));
    root.style.setProperty('--awSt-content-alt-bg-3-user', toHex(lighten(globalContext.pluginConfig[`color${globalContext.themeMode}ContentAltBg`], 0.04)));

    root.style.setProperty('--awSt-content-bg-user', globalContext.pluginConfig[`color${globalContext.themeMode}ContentBg`]);
    root.style.setProperty('--awSt-content-props-bg-user', globalContext.pluginConfig[`color${globalContext.themeMode}ContentPropsBg`]);

    root.style.setProperty('--awSt-title-text-user', globalContext.pluginConfig[`color${globalContext.themeMode}TitleText`]);
    root.style.setProperty('--awSt-content-text-user', globalContext.pluginConfig[`color${globalContext.themeMode}ContentText`]);
    root.style.setProperty('--awSt-content-text-alt-user', toHex(lighten(globalContext.pluginConfig[`color${globalContext.themeMode}ContentText`], 0.2)));
    root.style.setProperty('--awSt-content-text-op-user', toHex(transparentize(globalContext.pluginConfig[`color${globalContext.themeMode}ContentText`], 0.85)));
    root.style.setProperty('--awSt-ui-scroll-user', toHex(transparentize(globalContext.pluginConfig[`color${globalContext.themeMode}Link`], 0.75)));

    root.style.setProperty('--awSt-content-text-bold-user', globalContext.pluginConfig[`color${globalContext.themeMode}ContentTextBold`]);
    root.style.setProperty('--awSt-content-text-italic-user', globalContext.pluginConfig[`color${globalContext.themeMode}ContentTextItalic`]);

    root.style.setProperty('--awSt-link-user', globalContext.pluginConfig[`color${globalContext.themeMode}Link`]);
    root.style.setProperty('--awSt-link-lighter-user', toHex(transparentize(globalContext.pluginConfig[`color${globalContext.themeMode}Link`], 0.85)));
    root.style.setProperty('--awSt-link-ext-user', globalContext.pluginConfig[`color${globalContext.themeMode}LinkExt`]);
    root.style.setProperty('--awSt-link-ext-lighter-user', toHex(transparentize(globalContext.pluginConfig[`color${globalContext.themeMode}LinkExt`], 0.85)));
    root.style.setProperty('--awSt-tag-user', globalContext.pluginConfig[`color${globalContext.themeMode}Tag`]);
    root.style.setProperty('--awSt-tag-lighter-user', toHex(transparentize(globalContext.pluginConfig[`color${globalContext.themeMode}Tag`], 0.85)));

    root.style.setProperty('--awSt-mark-bg-user', globalContext.pluginConfig[`color${globalContext.themeMode}MarkBg`]);
    root.style.setProperty('--awSt-mark-text-user', globalContext.pluginConfig[`color${globalContext.themeMode}MarkText`]);
    root.style.setProperty('--awSt-quote-bg-user', globalContext.pluginConfig[`color${globalContext.themeMode}QuoteBg`]);
    root.style.setProperty('--awSt-quote-text-user', globalContext.pluginConfig[`color${globalContext.themeMode}QuoteText`]);

    root.style.setProperty('--awSt-selected-user', toHex(mix(globalContext.pluginConfig[`color${globalContext.themeMode}ContentBg`], globalContext.pluginConfig[`color${globalContext.themeMode}Link`], 0.2)));

    root.style.setProperty('--awSt-h1-user', globalContext.pluginConfig[`color${globalContext.themeMode}H1`]);
    root.style.setProperty('--awSt-h2-user', globalContext.pluginConfig[`color${globalContext.themeMode}H2`]);
    root.style.setProperty('--awSt-h3-user', globalContext.pluginConfig[`color${globalContext.themeMode}H3`]);
    root.style.setProperty('--awSt-h4-user', globalContext.pluginConfig[`color${globalContext.themeMode}H4`]);
    root.style.setProperty('--awSt-h5-user', globalContext.pluginConfig[`color${globalContext.themeMode}H5`]);
    root.style.setProperty('--awSt-h6-user', globalContext.pluginConfig[`color${globalContext.themeMode}H6`]);


    // bg
    if (globalContext.pluginConfig.backgroundURL) {
        root.style.setProperty('--awSt-bg-url', `url(${globalContext.pluginConfig.backgroundURL})`);
    } else {
        root.style.setProperty('--awSt-bg-url', 'none');
    }
    root.style.setProperty('--awSt-content-padding', globalContext.pluginConfig.backgroundPadding);
    root.style.setProperty('--awSt-content-padding-top', globalContext.pluginConfig.backgroundPadding.split(' ')[0]);

    if (!globalContext.pluginConfig.backgroundShadow) {
        root.style.setProperty('--awSt-bg-shadow', 'none');
    } else {
        root.style.removeProperty('--awSt-bg-shadow');
    }

    // banners
    if (!globalContext.pluginConfig.bannersAsBackground) {
        root.style.setProperty('--awSt-banner-asBg', 'none');
    } else {
        root.style.removeProperty('--awSt-banner-asBg');
    }
    if (!globalContext.pluginConfig.bannersIconGlow) {
        root.style.setProperty('--awSt-banner-iconGlow', 'none');
    } else {
        root.style.removeProperty('--awSt-banner-iconGlow');
    }

    // sizes
    root.style.setProperty('--awSt-content-max-width', globalContext.pluginConfig.contentMaxWidth);
    root.style.setProperty('--ls-main-content-max-width-wide', globalContext.pluginConfig.contentWideMaxWidth);
    root.style.setProperty('--ls-left-sidebar-width', globalContext.pluginConfig.leftSidebarWidth);
    root.style.setProperty('--ls-right-sidebar-width', globalContext.pluginConfig.rightSidebarWidth);
}

export const unsetStylingCSSVars = () => {
    root.style.removeProperty('--awSt-content-font');
    root.style.removeProperty('--awSt-content-font-size');
    root.style.removeProperty('--awSt-ui-font-size');

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
