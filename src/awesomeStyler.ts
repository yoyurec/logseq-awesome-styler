import '@logseq/libs';

import {
    pluginLoad,
    settingsLoad,
} from './internal';

import './awesomeStyler.css';

// Main logseq on ready
const main = async () => {
    console.log(`AwesomeStyler: plugin loaded`);
    settingsLoad();
    pluginLoad();
};

logseq.ready(main).catch(null);
