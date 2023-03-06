import { packageVersion } from '../../.version';

import { doc, body, globals } from '../modules/globals/globals';

export const objectsKeysDiff = (orig: object, updated: object) => {
    const difference = Object.keys(orig).filter((key) => {
        if (key === 'presetCustom' || key === 'presetCustom2' || key === 'presetCustom3') {
            return false
        }
        // @ts-ignore
        return orig[key] !== updated[key]
    });
    return difference;
}

export const checkPluginUpdate = async () => {
    const response = await fetch(
        `https://api.github.com/repos/yoyurec/${globals.pluginID}/releases/latest`,
        { headers: { 'Accept': 'application/vnd.github.v3+json' } }
    );
    if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
    }
    const repoInfo = await response.json();
    if (repoInfo) {
        const latestReleaseVersion = repoInfo.tag_name.replace('v', '');
        // https://stackoverflow.com/a/65687141
        const hasUpdate = latestReleaseVersion.localeCompare(packageVersion, undefined, { numeric: true, sensitivity: 'base' });
        if (hasUpdate == 1) {
            logseq.UI.showMsg(`"${globals.pluginID}" new version is available! Please, update!`, 'warning', { timeout: 30000 });
        }
    }
}

export const injectPluginCSS = (iframeId: string, label: string, cssContent: string) => {
    const pluginIframe = doc.getElementById(iframeId) as HTMLIFrameElement;
    if (!pluginIframe) {
        return
    }
    ejectPluginCSS(iframeId, label);
    pluginIframe.contentDocument?.head.insertAdjacentHTML(
        'beforeend',
        `<style id='${label}'>
            ${cssContent}
        </style>`
    );
}

export const ejectPluginCSS = (iframeId: string, label: string) => {
    const pluginIframe = doc.getElementById(iframeId) as HTMLIFrameElement;
    if (!pluginIframe) {
        return;
    }
    pluginIframe.contentDocument?.getElementById(label)?.remove();
}

export const toKebabCase = (str: string): string => {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export const wait = (amount = 0) => new Promise(resolve => setTimeout(resolve, amount));

export const waitForElement = async (context: Document, query: string, timeout = 3000):Promise<HTMLElement | null>  => {
    return new Promise((resolve) => {
        let waited = 0;
        let element: HTMLElement | null = null;
        const waiteInterval = setInterval(function () {
            element = context.querySelector(query);
            if (waited >= timeout || element) {
                clearInterval(waiteInterval);
                if (element) {
                    resolve(element);
                    console.log(`element ${element} found!`);
                } else {
                    console.log(`no element ${element}!`);
                    resolve(null);
                }
            }
            waited += 166;
        }, 166);
    });
}

export const getMainCSSColors = (): string => {
    const span = doc.createElement('span');
    span.textContent = 'span';
    span.style.color = 'var(--ls-primary-text-color)';
    span.style.backgroundColor = 'var(--ls-primary-background-color)';
    body.insertAdjacentElement('beforeend', span);
    const textColor = getComputedStyle(span).color.trim();
    const textBg = getComputedStyle(span).backgroundColor.trim();
    span.remove();
    const link = doc.createElement('a');
    link.style.border = '1px solid var(--ls-border-color)';
    link.style.backgroundColor = 'var(--ls-a-chosen-bg)';
    body.insertAdjacentElement('beforeend', link);
    const linkColor = getComputedStyle(link).color.trim();
    const chosenColor = getComputedStyle(link).backgroundColor.trim();
    const borderColor = getComputedStyle(link).borderColor.trim();
    link.remove();
    return `
        :root {
            --ls-primary-text-color:${textColor};
            --ls-primary-background-color:${textBg};
            --ls-link-text-color:${linkColor};
            --ls-a-chosen-bg:${chosenColor};
            --ls-border-color:${borderColor};
        }
    `
}
