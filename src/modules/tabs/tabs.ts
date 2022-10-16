import {
    globalContext,
    body, doc
} from '../internal';

import { getInheritedBackgroundColor } from '../utils';

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
    globalContext.tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
    if (globalContext.tabsPluginIframe) {
        pluginDocument = globalContext.tabsPluginIframe.contentDocument;
        tabPluginInjectCSSVars();
    }
}

export const tabsPluginUnload = () => {
    if (globalContext.tabsPluginIframe) {
        tabsPluginEjectCSSVars();
    }
}
