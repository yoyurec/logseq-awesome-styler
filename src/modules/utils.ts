import { packageVersion } from '../../.version';

import { globalContext } from './internal';

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
        `https://api.github.com/repos/yoyurec/${globalContext.pluginID}/releases/latest`,
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
            logseq.UI.showMsg(`"${globalContext.pluginID}" new version is available! Please, update!`, 'warning', {timeout: 30000});
        }
    }
}
