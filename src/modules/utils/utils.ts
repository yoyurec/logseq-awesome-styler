import { packageVersion } from '../../../.version';

import { globals } from '../globals/globals';

export const objectDiff = (orig: object, updated: object) => {
    const difference = Object.keys(orig).filter((key) => {
        if (key === 'presetCustom' || key === 'presetCustom2' || key === 'presetCustom3') {
            return false
        }
        // @ts-ignore
        return orig[key] !== updated[key]
    });
    return difference;
}

export const getInheritedBackgroundColor = (el: Element | null): string => {
    if (!el) {
        return '';
    }
    const defaultStyle = 'rgba(0, 0, 0, 0)';
    const backgroundColor = getComputedStyle(el).backgroundColor
    if (backgroundColor != defaultStyle) return backgroundColor
    if (!el.parentElement) return defaultStyle
    return getInheritedBackgroundColor(el.parentElement)
}

export const checkUpdate = async () => {
    const response = await fetch(
        `https://api.github.com/repos/yoyurec/${globals.pluginID}/releases/latest`,
        { headers: { 'Accept': 'application/vnd.github.v3+json' } }
    );
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
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
                    console.log(`AwesomeStyler: element ${element} found!`);
                } else {
                    console.log(`AwesomeStyler: no element ${element}!`);
                    resolve(null);
                }
            }
            waited += 166;
        }, 166);
    });
}
