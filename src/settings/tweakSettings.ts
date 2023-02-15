import type Pickr from '@simonwep/pickr';
import { readableColor } from 'color2k';

import { root, doc, globals } from '../modules/globals/globals';
import { presetsConfig } from './settingsConfig';

declare global {
    interface Window {
        Pickr: Pickr;
    }
}

export const tweakSettingsLoad = () => {
    injectColorpickerAssets();
}

// Tweak settings
export const tweakPluginSettings = () => {
    if (globals.isThemeChosen) {
        initInputs();
        initPresetCopy();
        initColorpickers();
    }
}

export const initInputs = () => {
    if (globals.pluginConfig.presetName === 'Custom' || globals.pluginConfig.presetName === 'Custom2' || globals.pluginConfig.presetName === 'Custom3') {
        enableSettingsEditing();
    } else {
        disableSettingsEditing();
    }
}

// Enable settings form
const enableSettingsEditing = () => {
    const pluginPanel = doc.querySelector(`.panel-wrap[data-id="${globals.pluginID}"]`);
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
    const pluginPanel = doc.querySelector(`.panel-wrap[data-id="${globals.pluginID}"]`);
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
    const pluginPanel = doc.querySelector(`.panel-wrap[data-id="${globals.pluginID}"]`);
    if (!pluginPanel) {
        return false;
    }
    const isAlreadyInited = pluginPanel.getElementsByClassName('color-input-helper')[0];
    if (isAlreadyInited) {
        return false;
    }
    const themeModeAttr = root.getAttribute('data-theme') || '';
    globals.themeMode = themeModeAttr.charAt(0).toUpperCase() + themeModeAttr.slice(1);
    const colorSettingsList = pluginPanel.querySelectorAll(`.desc-item.as-input[data-key^="color${globals.themeMode}"]`);
    if (colorSettingsList.length) {
        for (let i = 0; i < colorSettingsList.length; i++) {
            const colorSettingsItem = colorSettingsList[i] as HTMLElement;
            const colorSettingsKey = colorSettingsItem.getAttribute('data-key') || '';
            const colorSettingsInput = colorSettingsItem.getElementsByTagName('input')[0];
            colorSettingsInput.classList.add('color-input-helper');
            updateColorInputStyle(colorSettingsInput);
            if (globals.pluginConfig.presetName !== 'Custom' && globals.pluginConfig.presetName !== 'Custom2' && globals.pluginConfig.presetName !== 'Custom3') {
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
    pickrCSS.href = `lsp://logseq.io/${globals.pluginID}/dist/vendors/pickr/monolith.min.css`;
    doc.getElementsByTagName('head')[0].appendChild(pickrCSS);
    const pickrJS = doc.createElement('script');
    pickrJS.type = 'text/javascript';
    pickrJS.async = true;
    pickrJS.src = `lsp://logseq.io/${globals.pluginID}/dist/vendors/pickr/pickr.min.js`;
    doc.getElementsByTagName('head')[0].appendChild(pickrJS);
}

const cloneButtonClickHandler = (event: Event) => {
    const target = event.currentTarget as HTMLElement;
    if (!target) {
        return;
    }
    const presetsSelector = doc.querySelector('.desc-item[data-key="presetName"] .form-select') as HTMLSelectElement;
    if (!presetsSelector) {
        return;
    }
    const srcPreset = presetsConfig[presetsSelector.value];
    const destPreset = target.getAttribute('data-dest');
    const configPresetKey = `preset${destPreset}`;
    const customPresetObj = {};
    //@ts-ignore
    customPresetObj[configPresetKey] = srcPreset;
    globals.isPredefinedPresetClonedToCustom = true;
    logseq.updateSettings(customPresetObj);
    logseq.updateSettings({ presetName: destPreset});
}

const initPresetCopy = () => {
    if (globals.pluginConfig.presetName !== 'Custom' || globals.pluginConfig.presetName !== 'Custom2' || globals.pluginConfig.presetName !== 'Custom3') {
        const presetCloneButton = doc.querySelector(`.panel-wrap[data-id="${globals.pluginID}"] .preset-clone-button`);
        if (presetCloneButton) {
            return;
        }
        const presetsSelector = doc.querySelector('.desc-item[data-key="presetName"] .form-select') as HTMLSelectElement;
        if (!presetsSelector) {
            return;
        }
        presetsSelector?.insertAdjacentHTML(
            'afterend',
            `
            <button data-dest="Custom" class="button preset-clone-button" title="Clone preset values to your Custom preset and switch to it">
                <i class="ti ti-chevrons-right"></i> to 1st
            </button>
            <button data-dest="Custom2" class="button preset-clone-button" title="Clone preset values to your Custom2 preset and switch to it">
                <i class="ti ti-chevrons-right"></i> to 2nd
            </button>
            <button data-dest="Custom3" class="button preset-clone-button" title="Clone preset values to your Custom3 preset and switch to it">
                <i class="ti ti-chevrons-right"></i> to 3rd
            </button>
            `
        )
        const cloneButtonList = [...doc.querySelectorAll(`.panel-wrap[data-id="${globals.pluginID}"] .preset-clone-button`)] as HTMLElement[];
        if (cloneButtonList.length)
            for (let i = 0; i < cloneButtonList!.length; i++) {
                const cloneButton = cloneButtonList[i];
                cloneButton.addEventListener('click', cloneButtonClickHandler);
            }
    }
}
