import '@logseq/libs';

import { pluginLoad } from './plugin/plugin';

import './awesomeStylerInt.css';

// Main logseq on ready
const main = async () => {
    console.log(`AwesomeStyler: plugin loaded`);
    pluginLoad();
};

logseq.ready(main).catch(null);
