import type Pickr from '@simonwep/pickr';
import { readableColor } from 'color2k';

import {
    globalContext,
    root, doc,
    initModalObserver, runModalObserver, stopModalObserver,
    presetsConfig
} from '../internal';

declare global {
    interface Window {
        Pickr: Pickr;
    }
}

export const tweakSettingsLoad = () => {
    initModalObserver();
    runModalObserver();
    injectColorpickerAssets();
}

export const tweakSettingsUnload = () => {
    stopModalObserver();
}

export const onSettingsModalOpened = (settingsModal: Element) => {
    const settingsPluginButton = settingsModal.querySelector('.settings-menu-link[data-id="plugins"]');
    settingsPluginButton?.addEventListener('click', () => {
        setTimeout(() => {
            const awStPluginItem = doc.querySelector(`.ui__modal.is-sub-modal .settings-plugin-item[data-id="${globalContext.pluginID}"]`) as HTMLAnchorElement;
            if (!awStPluginItem) {
                return;
            }
            if (awStPluginItem.parentElement?.classList.contains('active')) {
                setTimeout(() => {
                    tweakPluginSettings();
                }, 500)
            }
            const clickPlugin = doc.querySelectorAll('.settings-plugin-list li');
            if (clickPlugin.length > 1) {
                awStPluginItem.addEventListener('click', () => {
                    setTimeout(() => {
                        tweakPluginSettings();
                    }, 500)
                });
            }
        }, 500)
    });
}

// Tweak settings
const tweakPluginSettings = () => {
    if (globalContext.isThemeChosen()) {
        initInputs();
        initPresetCopy();
        initColorpickers();
    }
}

export const initInputs = () => {
    if (globalContext.pluginConfig.presetName === 'Custom') {
        enableSettingsEditing();
    } else {
        disableSettingsEditing();
    }
}

// Enable settings form
const enableSettingsEditing = () => {
    const pluginPanel = doc.querySelector(`.panel-wrap[data-id="${globalContext.pluginID}"]`);
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

// Disable settings form
const disableSettingsEditing = () => {
    const pluginPanel = doc.querySelector(`.panel-wrap[data-id="${globalContext.pluginID}"]`);
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
    const presetsSelector = pluginPanel.querySelector('[data-key="presetName"] .form-select') as HTMLSelectElement;
    presetsSelector.disabled = false;
}

// Colors
const initColorpickers = () => {
    const pluginPanel = doc.querySelector(`.panel-wrap[data-id="${globalContext.pluginID}"]`);
    if (!pluginPanel) {
        return false;
    }
    const isAlreadyInited = pluginPanel.getElementsByClassName('color-input-helper')[0];
    if (isAlreadyInited) {
        return false;
    }
    const themeModeAttr = root.getAttribute('data-theme') || '';
    globalContext.themeMode = themeModeAttr.charAt(0).toUpperCase() + themeModeAttr.slice(1);
    const colorSettingsList = pluginPanel.querySelectorAll(`.desc-item.as-input[data-key^="color${globalContext.themeMode}"]`);
    if (colorSettingsList.length) {
        for (let i = 0; i < colorSettingsList.length; i++) {
            const colorSettingsItem = colorSettingsList[i] as HTMLElement;
            const colorSettingsKey = colorSettingsItem.getAttribute('data-key') || '';
            const colorSettingsInput = colorSettingsItem.getElementsByTagName('input')[0];
            colorSettingsInput.classList.add('color-input-helper');
            updateColorInputStyle(colorSettingsInput);
            if (globalContext.pluginConfig.presetName !== 'Custom') {
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
                position: 'bottom-end',
                useAsButton: true,
                autoReposition: false,
                adjustableNumbers: true,
                components: {
                    // Main components
                    hue: true,
                    opacity: false,
                    interaction: {
                        input: true,
                        hex: true,
                        hsla: true
                      }
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

const injectColorpickerAssets = async () => {
    const pickrCSS = doc.createElement('link');
    pickrCSS.rel = 'stylesheet';
    pickrCSS.href = `lsp://logseq.io/${globalContext.pluginID}/dist/vendors/pickr/monolith.min.css`;
    doc.getElementsByTagName('head')[0].appendChild(pickrCSS);
    const pickrJS = doc.createElement('script');
    pickrJS.type = 'text/javascript';
    pickrJS.async = true;
    pickrJS.src = `lsp://logseq.io/${globalContext.pluginID}/dist/vendors/pickr/pickr.min.js`;
    doc.getElementsByTagName('head')[0].appendChild(pickrJS);
}

const initPresetCopy = () => {
    if (globalContext.pluginConfig.presetName !== 'Custom') {
        const presetCopyButton = doc.querySelector(`.panel-wrap[data-id="${globalContext.pluginID}"] .preset-clone-button`);
        if (presetCopyButton) {
            return;
        }
        const presetsSelector = doc.querySelector('.desc-item[data-key="presetName"] .form-select') as HTMLSelectElement;
        if (!presetsSelector) {
            return;
        }
        presetsSelector?.insertAdjacentHTML(
            'afterend',
            `<button class="button preset-clone-button" title="Clone preset values to your Custom preset and switch to it">
                <i class= "ti ti-clipboard-list"></i>Clone
            </button >`
        )
        doc.querySelector(`.panel-wrap[data-id="${globalContext.pluginID}"] .preset-clone-button`)?.addEventListener('click', () => {
            globalContext.isPresetCopied = true;
            logseq.updateSettings({
                presetCustom: { ...presetsConfig[presetsSelector.value] }
            });
            logseq.updateSettings({ presetName: 'Custom'});
        });
    }
}
