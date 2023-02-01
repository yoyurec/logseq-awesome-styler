import '@logseq/libs';

import { pluginLoad } from './modules/plugin/plugin';

import './awesomeStyler.css';

// Main logseq on ready
const main = async () => {
    console.log(`AwesomeStyler: plugin loaded`);
    pluginLoad();
};

logseq.ready(main).catch(null);
