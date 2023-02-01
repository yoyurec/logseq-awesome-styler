import { body, doc, globals } from '../globals/globals';

import { getInheritedBackgroundColor } from '../utils/utils';

let pluginDocument: Document;

export const tabPluginInjectCSSVars = () => {
    setTimeout(() => {
        tabsPluginEjectCSSVars();
        if (pluginDocument) {
            pluginDocument.head.insertAdjacentHTML(
                'beforeend',
                `<style id='tabs-vars'>
                    ${tabsPluginCSSVars()}
                </style>`
            );
        }
    }, 800)
}

const tabsPluginEjectCSSVars = () => {
    if (pluginDocument) {
        pluginDocument.getElementById('tabs-vars')?.remove();
    }
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

// First init run
export const tabsPluginLoad = async () => {
    globals.tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
    if (globals.tabsPluginIframe) {
        pluginDocument = globals.tabsPluginIframe.contentDocument;
        tabPluginInjectCSSVars();
    }
}

export const tabsPluginUnload = () => {
    if (globals.tabsPluginIframe) {
        tabsPluginEjectCSSVars();
    }
}
