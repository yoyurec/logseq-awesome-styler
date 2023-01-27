import { lighten, darken, transparentize, mix, toHex } from 'color2k';

import {
    globals,
    root, body
} from '../../internal';

export const setStylingCSSVars = () => {
    const themeModeAttr = root.getAttribute('data-theme') || '';
    globals.themeMode = themeModeAttr.charAt(0).toUpperCase() + themeModeAttr.slice(1);

    // fonts
    let fontVar = '';
    switch (globals.pluginConfig.fontContentName) {
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
    if (globals.pluginConfig.fontContentName == 'Fira Code Nerd') {
        body.style.letterSpacing = '-1px';
        body.style.wordSpacing = '-1px';
    } else {
        body.style.letterSpacing = '0';
        body.style.wordSpacing = '0';
    }
    root.style.setProperty('--awSt-content-font', `var(${fontVar})`);
    if (globals.pluginConfig.fontContentSize) {
        root.style.setProperty('--awSt-content-font-size', globals.pluginConfig.fontContentSize);
    }
    if (globals.pluginConfig.fontUiSize) {
        root.style.setProperty('--awSt-ui-font-size', globals.pluginConfig.fontUiSize);
    }

    // colors
    root.style.setProperty('--awSt-ui-panels-bg-user', globals.pluginConfig[`color${globals.themeMode}UiPanelsBg`]);
    root.style.setProperty('--awSt-ui-content-bg-user', toHex(darken(globals.pluginConfig[`color${globals.themeMode}UiPanelsBg`], 0.04)));
    root.style.setProperty('--awSt-ui-body-bg-user', globals.pluginConfig[`color${globals.themeMode}UiBodyBg`]);

    root.style.setProperty('--awSt-content-border-user', toHex(darken(globals.pluginConfig[`color${globals.themeMode}ContentAltBg`], 0.04)));
    root.style.setProperty('--awSt-content-alt-bg-0-user', toHex(darken(globals.pluginConfig[`color${globals.themeMode}ContentAltBg`], 0.02)));
    root.style.setProperty('--awSt-content-alt-bg-user', globals.pluginConfig[`color${globals.themeMode}ContentAltBg`]);
    root.style.setProperty('--awSt-content-alt-bg-2-user', toHex(lighten(globals.pluginConfig[`color${globals.themeMode}ContentAltBg`], 0.02)));
    root.style.setProperty('--awSt-content-alt-bg-3-user', toHex(lighten(globals.pluginConfig[`color${globals.themeMode}ContentAltBg`], 0.04)));

    root.style.setProperty('--awSt-content-bg-user', globals.pluginConfig[`color${globals.themeMode}ContentBg`]);
    root.style.setProperty('--awSt-content-props-bg-user', globals.pluginConfig[`color${globals.themeMode}ContentPropsBg`]);

    root.style.setProperty('--awSt-title-text-user', globals.pluginConfig[`color${globals.themeMode}TitleText`]);
    root.style.setProperty('--awSt-content-text-user', globals.pluginConfig[`color${globals.themeMode}ContentText`]);
    root.style.setProperty('--awSt-content-text-alt-user', toHex(lighten(globals.pluginConfig[`color${globals.themeMode}ContentText`], 0.2)));
    root.style.setProperty('--awSt-content-text-op-user', toHex(transparentize(globals.pluginConfig[`color${globals.themeMode}ContentText`], 0.85)));
    root.style.setProperty('--awSt-ui-scroll-user', toHex(transparentize(globals.pluginConfig[`color${globals.themeMode}Link`], 0.75)));

    root.style.setProperty('--awSt-content-text-bold-user', globals.pluginConfig[`color${globals.themeMode}ContentTextBold`]);
    root.style.setProperty('--awSt-content-text-italic-user', globals.pluginConfig[`color${globals.themeMode}ContentTextItalic`]);
    root.style.setProperty('--awSt-content-text-code-user', globals.pluginConfig[`color${globals.themeMode}ContentTextCode`]);

    root.style.setProperty('--awSt-link-user', globals.pluginConfig[`color${globals.themeMode}Link`]);
    root.style.setProperty('--awSt-link-lighter-user', toHex(transparentize(globals.pluginConfig[`color${globals.themeMode}Link`], 0.85)));
    root.style.setProperty('--awSt-link-ext-user', globals.pluginConfig[`color${globals.themeMode}LinkExt`]);
    root.style.setProperty('--awSt-link-ext-lighter-user', toHex(transparentize(globals.pluginConfig[`color${globals.themeMode}LinkExt`], 0.85)));
    root.style.setProperty('--awSt-tag-user', globals.pluginConfig[`color${globals.themeMode}Tag`]);
    root.style.setProperty('--awSt-tag-lighter-user', toHex(transparentize(globals.pluginConfig[`color${globals.themeMode}Tag`], 0.85)));

    root.style.setProperty('--awSt-mark-bg-user', globals.pluginConfig[`color${globals.themeMode}MarkBg`]);
    root.style.setProperty('--awSt-mark-text-user', globals.pluginConfig[`color${globals.themeMode}MarkText`]);
    root.style.setProperty('--awSt-quote-bg-user', globals.pluginConfig[`color${globals.themeMode}QuoteBg`]);
    root.style.setProperty('--awSt-quote-text-user', globals.pluginConfig[`color${globals.themeMode}QuoteText`]);

    root.style.setProperty('--awSt-flashcard-bg-user', toHex(lighten(globals.pluginConfig[`color${globals.themeMode}ContentBg`], 0.01)));

    root.style.setProperty('--awSt-selected-user', toHex(mix(globals.pluginConfig[`color${globals.themeMode}ContentBg`], globals.pluginConfig[`color${globals.themeMode}Link`], 0.2)));

    root.style.setProperty('--awSt-h1-user', globals.pluginConfig[`color${globals.themeMode}H1`]);
    root.style.setProperty('--awSt-h2-user', globals.pluginConfig[`color${globals.themeMode}H2`]);
    root.style.setProperty('--awSt-h3-user', globals.pluginConfig[`color${globals.themeMode}H3`]);
    root.style.setProperty('--awSt-h4-user', globals.pluginConfig[`color${globals.themeMode}H4`]);
    root.style.setProperty('--awSt-h5-user', globals.pluginConfig[`color${globals.themeMode}H5`]);
    root.style.setProperty('--awSt-h6-user', globals.pluginConfig[`color${globals.themeMode}H6`]);


    // bg
    if (globals.pluginConfig.backgroundURL) {
        root.style.setProperty('--awSt-bg-url', `url(${globals.pluginConfig.backgroundURL})`);
    } else {
        root.style.setProperty('--awSt-bg-url', 'none');
    }
    root.style.setProperty('--awSt-content-padding', globals.pluginConfig.backgroundPadding);
    root.style.setProperty('--awSt-content-padding-top', globals.pluginConfig.backgroundPadding.split(' ')[0]);

    if (!globals.pluginConfig.backgroundShadow) {
        root.style.setProperty('--awSt-bg-shadow', 'none');
    } else {
        root.style.removeProperty('--awSt-bg-shadow');
    }

    // banners
    if (!globals.pluginConfig.bannersAsBackground) {
        root.style.setProperty('--awSt-banner-asBg', 'none');
    } else {
        root.style.removeProperty('--awSt-banner-asBg');
    }
    if (!globals.pluginConfig.bannersIconGlow) {
        root.style.setProperty('--awSt-banner-iconGlow', 'none');
    } else {
        root.style.removeProperty('--awSt-banner-iconGlow');
    }

    // sizes
    root.style.setProperty('--awSt-content-max-width', globals.pluginConfig.contentMaxWidth);
    root.style.setProperty('--ls-main-content-max-width-wide', globals.pluginConfig.contentWideMaxWidth);
    root.style.setProperty('--ls-left-sidebar-width', globals.pluginConfig.leftSidebarWidth);
    root.style.setProperty('--ls-right-sidebar-width', globals.pluginConfig.rightSidebarWidth);
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

    root.style.removeProperty('--awSt-flashcard-bg-user');

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
