import { lighten, darken, transparentize, mix, toHex } from 'color2k';

import { root, body, globals } from '../modules/globals/globals';

export const getThemeCSSVars = (): string => {
    const themeModeAttr = root.getAttribute('data-theme') || '';
    const mode = themeModeAttr.charAt(0).toUpperCase() + themeModeAttr.slice(1);
    globals.themeMode = mode;

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
        bannersAsBackground = '--awSt-banner-asBg: none;';
    }
    let bannersIconGlow = '';
    if (!globals.pluginConfig.bannersIconGlow) {
        bannersIconGlow = '--awSt-banner-iconGlow: none;';
    }

    globals.mainCSSVars = `
        :root {
            --ls-primary-text-color:${globals.pluginConfig[`color${mode}ContentText`]};
            --ls-link-text-color:${globals.pluginConfig[`color${mode}Link`]};
            --ls-primary-background-color:${globals.pluginConfig[`color${mode}ContentBg`]};
            --ls-secondary-background-color:${globals.pluginConfig[`color${mode}UiPanelsBg`]};
            --ls-border-color:${toHex(darken(globals.pluginConfig[`color${mode}ContentAltBg`], 0.04))};
        }
    `;

    return `
        :root {
            /* colors */
            --awSt-ui-panels-bg-user: ${globals.pluginConfig[`color${mode}UiPanelsBg`]};
            --awSt-ui-content-bg-user: ${toHex(darken(globals.pluginConfig[`color${mode}UiPanelsBg`], 0.04))};
            --awSt-ui-body-bg-user: ${globals.pluginConfig[`color${mode}UiBodyBg`]};

            --awSt-content-border-user: ${toHex(darken(globals.pluginConfig[`color${mode}ContentAltBg`], 0.04))};
            --awSt-content-alt-bg-0-user: ${toHex(darken(globals.pluginConfig[`color${mode}ContentAltBg`], 0.02))};
            --awSt-content-alt-bg-user: ${globals.pluginConfig[`color${mode}ContentAltBg`]};
            --awSt-content-alt-bg-2-user: ${toHex(lighten(globals.pluginConfig[`color${mode}ContentAltBg`], 0.02))};
            --awSt-content-alt-bg-3-user: ${toHex(lighten(globals.pluginConfig[`color${mode}ContentAltBg`], 0.04))};

            --awSt-content-bg-user: ${globals.pluginConfig[`color${mode}ContentBg`]};
            --awSt-content-props-bg-user: ${globals.pluginConfig[`color${mode}ContentPropsBg`]};

            --awSt-title-text-user: ${globals.pluginConfig[`color${mode}TitleText`]};
            --awSt-content-text-user: ${globals.pluginConfig[`color${mode}ContentText`]};
            --awSt-content-text-alt-user: ${toHex(lighten(globals.pluginConfig[`color${mode}ContentText`], 0.2))};
            --awSt-content-text-op-user: ${toHex(transparentize(globals.pluginConfig[`color${mode}ContentText`], 0.85))};
            --awSt-ui-scroll-user: ${toHex(transparentize(globals.pluginConfig[`color${mode}Link`], 0.75))};

            --awSt-content-text-bold-user: ${globals.pluginConfig[`color${mode}ContentTextBold`]};
            --awSt-content-text-italic-user: ${globals.pluginConfig[`color${mode}ContentTextItalic`]};

            --awSt-link-user: ${globals.pluginConfig[`color${mode}Link`]};
            --awSt-link-lighter-user: ${toHex(transparentize(globals.pluginConfig[`color${mode}Link`], 0.85))};
            --awSt-link-ext-user: ${globals.pluginConfig[`color${mode}LinkExt`]};
            --awSt-link-ext-lighter-user: ${toHex(transparentize(globals.pluginConfig[`color${mode}LinkExt`], 0.85))};
            --awSt-tag-user: ${globals.pluginConfig[`color${mode}Tag`]};
            --awSt-tag-lighter-user: ${toHex(transparentize(globals.pluginConfig[`color${mode}Tag`], 0.85))};

            --awSt-mark-bg-user: ${globals.pluginConfig[`color${mode}MarkBg`]};
            --awSt-mark-text-user: ${globals.pluginConfig[`color${mode}MarkText`]};
            --awSt-quote-bg-user: ${globals.pluginConfig[`color${mode}QuoteBg`]};
            --awSt-quote-text-user: ${globals.pluginConfig[`color${mode}QuoteText`]};
            --awSt-inline-code-text-user: ${globals.pluginConfig[`color${mode}InlineCodeText`]};
            --awSt-inline-code-bg-user: ${globals.pluginConfig[`color${mode}InlineCodeBg`]};

            --awSt-flashcard-bg-user: ${toHex(lighten(globals.pluginConfig[`color${mode}ContentBg`], 0.01))};

            --awSt-selected-user: ${toHex(mix(globals.pluginConfig[`color${mode}ContentBg`], globals.pluginConfig[`color${mode}Link`], 0.2))};

            --awSt-h1-user: ${globals.pluginConfig[`color${mode}H1`]};
            --awSt-h2-user: ${globals.pluginConfig[`color${mode}H2`]};
            --awSt-h3-user: ${globals.pluginConfig[`color${mode}H3`]};
            --awSt-h4-user: ${globals.pluginConfig[`color${mode}H4`]};
            --awSt-h5-user: ${globals.pluginConfig[`color${mode}H5`]};
            --awSt-h6-user: ${globals.pluginConfig[`color${mode}H6`]};


            /* fonts */
            --awSt-content-font: var(${fontContentName});
            --awSt-content-font-size: ${globals.pluginConfig.fontContentSize};
            --awSt-ui-font-size: ${globals.pluginConfig.fontUiSize};

            /* bg */
            --awSt-bg-url: url('${globals.pluginConfig[`backgroundURL${mode}`]}');
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
    `;
}
