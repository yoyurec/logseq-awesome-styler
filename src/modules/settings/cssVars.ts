import { lighten, darken, transparentize, mix, toHex } from 'color2k';

import { root, doc, body, globals } from '../globals/globals';

export const setStylingCSSVars = () => {
    const themeModeAttr = root.getAttribute('data-theme') || '';
    globals.themeMode = themeModeAttr.charAt(0).toUpperCase() + themeModeAttr.slice(1);

    if (globals.pluginConfig.fontContentName == 'Fira Code Nerd') {
        body.style.letterSpacing = '-1px';
        body.style.wordSpacing = '-1px';
    } else {
        body.style.letterSpacing = '0';
        body.style.wordSpacing = '0';
    }

    // fonts
    let fontContentName = '';
    switch (globals.pluginConfig.fontContentName) {
        case 'Fira Sans (theme default)':
            fontContentName = '--awSt-font-fira-sans'
            break;
        case 'Fira Code Nerd':
            fontContentName = '--awSt-font-fira-code';
            break;
        case 'iA Writer Quattro':
            fontContentName = '--awSt-font-aiwriter-quattro';
            break;
        case 'Mulish':
            fontContentName = '--awSt-font-mulish';
            break;
        case 'Inter (Logseq default)':
            fontContentName = '--awSt-font-default-inter';
            break;
        case 'OS System default':
            fontContentName = '--awSt-font-os-system';
            break;
        default:
            fontContentName = '--awSt-font-fira-sans';
    }

    let backgroundShadow = '';
    if (!globals.pluginConfig.backgroundShadow) {
        backgroundShadow = '--awSt-bg-shadow: none;';
    }
    // banners
    let bannersAsBackground = '';
    if (!globals.pluginConfig.bannersAsBackground) {
        bannersAsBackground = '--awSt-banner-asBg: none';
    }
    let bannersIconGlow = '';
    if (!globals.pluginConfig.bannersIconGlow) {
        bannersIconGlow = '--awSt-banner-iconGlow: none';
    }

    const cssVarsStyle = `
        :root {
            /* colors */
            --awSt-ui-panels-bg-user: ${globals.pluginConfig[`color${globals.themeMode}UiPanelsBg`]};
            --awSt-ui-content-bg-user: ${toHex(darken(globals.pluginConfig[`color${globals.themeMode}UiPanelsBg`], 0.04))};
            --awSt-ui-body-bg-user: ${globals.pluginConfig[`color${globals.themeMode}UiBodyBg`]};

            --awSt-content-border-user: ${toHex(darken(globals.pluginConfig[`color${globals.themeMode}ContentAltBg`], 0.04))};
            --awSt-content-alt-bg-0-user: ${toHex(darken(globals.pluginConfig[`color${globals.themeMode}ContentAltBg`], 0.02))};
            --awSt-content-alt-bg-user: ${globals.pluginConfig[`color${globals.themeMode}ContentAltBg`]};
            --awSt-content-alt-bg-2-user: ${toHex(lighten(globals.pluginConfig[`color${globals.themeMode}ContentAltBg`], 0.02))};
            --awSt-content-alt-bg-3-user: ${toHex(lighten(globals.pluginConfig[`color${globals.themeMode}ContentAltBg`], 0.04))};

            --awSt-content-bg-user: ${globals.pluginConfig[`color${globals.themeMode}ContentBg`]};
            --awSt-content-props-bg-user: ${globals.pluginConfig[`color${globals.themeMode}ContentPropsBg`]};

            --awSt-title-text-user: ${globals.pluginConfig[`color${globals.themeMode}TitleText`]};
            --awSt-content-text-user: ${globals.pluginConfig[`color${globals.themeMode}ContentText`]};
            --awSt-content-text-alt-user: ${toHex(lighten(globals.pluginConfig[`color${globals.themeMode}ContentText`], 0.2))};
            --awSt-content-text-op-user: ${toHex(transparentize(globals.pluginConfig[`color${globals.themeMode}ContentText`], 0.85))};
            --awSt-ui-scroll-user: ${toHex(transparentize(globals.pluginConfig[`color${globals.themeMode}Link`], 0.75))};

            --awSt-content-text-bold-user: ${globals.pluginConfig[`color${globals.themeMode}ContentTextBold`]};
            --awSt-content-text-italic-user: ${globals.pluginConfig[`color${globals.themeMode}ContentTextItalic`]};
            --awSt-content-text-code-user: ${globals.pluginConfig[`color${globals.themeMode}ContentTextCode`]};

            --awSt-link-user: ${globals.pluginConfig[`color${globals.themeMode}Link`]};
            --awSt-link-lighter-user: ${toHex(transparentize(globals.pluginConfig[`color${globals.themeMode}Link`], 0.85))};
            --awSt-link-ext-user: ${globals.pluginConfig[`color${globals.themeMode}LinkExt`]};
            --awSt-link-ext-lighter-user: ${toHex(transparentize(globals.pluginConfig[`color${globals.themeMode}LinkExt`], 0.85))};
            --awSt-tag-user: ${globals.pluginConfig[`color${globals.themeMode}Tag`]};
            --awSt-tag-lighter-user: ${toHex(transparentize(globals.pluginConfig[`color${globals.themeMode}Tag`], 0.85))};

            --awSt-mark-bg-user: ${globals.pluginConfig[`color${globals.themeMode}MarkBg`]};
            --awSt-mark-text-user: ${globals.pluginConfig[`color${globals.themeMode}MarkText`]};
            --awSt-quote-bg-user: ${globals.pluginConfig[`color${globals.themeMode}QuoteBg`]};
            --awSt-quote-text-user: ${globals.pluginConfig[`color${globals.themeMode}QuoteText`]};

            --awSt-flashcard-bg-user: ${toHex(lighten(globals.pluginConfig[`color${globals.themeMode}ContentBg`], 0.01))};

            --awSt-selected-user: ${toHex(mix(globals.pluginConfig[`color${globals.themeMode}ContentBg`], globals.pluginConfig[`color${globals.themeMode}Link`], 0.2))};

            --awSt-h1-user: ${globals.pluginConfig[`color${globals.themeMode}H1`]};
            --awSt-h2-user: ${globals.pluginConfig[`color${globals.themeMode}H2`]};
            --awSt-h3-user: ${globals.pluginConfig[`color${globals.themeMode}H3`]};
            --awSt-h4-user: ${globals.pluginConfig[`color${globals.themeMode}H4`]};
            --awSt-h5-user: ${globals.pluginConfig[`color${globals.themeMode}H5`]};
            --awSt-h6-user: ${globals.pluginConfig[`color${globals.themeMode}H6`]};


            /* fonts */
            --awSt-content-font: var(${fontContentName});
            --awSt-content-font-size: ${globals.pluginConfig.fontContentSize};
            --awSt-ui-font-size: ${globals.pluginConfig.fontUiSize};

            /* bg */
            --awSt-bg-url: url('${globals.pluginConfig[`backgroundURL${globals.themeMode}`]}');
            ${backgroundShadow}

            /* banners */
            ${bannersAsBackground}
            ${bannersIconGlow}
            /* sizes */
            --awSt-content-padding: ${globals.pluginConfig.backgroundPadding};
            --awSt-content-padding-top: ${globals.pluginConfig.backgroundPadding.split(' ')[0]};
            --awSt-content-max-width: ${globals.pluginConfig.contentMaxWidth};
            --ls-main-content-max-width-wide: ${globals.pluginConfig.contentWideMaxWidth};
            --ls-left-sidebar-width: ${globals.pluginConfig.leftSidebarWidth};
            --ls-right-sidebar-width: ${globals.pluginConfig.rightSidebarWidth};
        }
    `
    logseq.provideStyle({ key: 'awSt-vars-css', style: cssVarsStyle });

}

export const unsetStylingCSSVars = () => {
    doc.head.querySelector('style[data-injected-style^="awSt-vars-css"]')?.remove();
}
