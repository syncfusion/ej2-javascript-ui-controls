import { Splitter } from '../../src/splitter/splitter';

let splitObj: Splitter = new Splitter({
    height: '250px',
    paneSettings: [
        { collapsible: true, size: '30%' },
        { collapsible: true, size: '40%' },
        { collapsible: true, size: '30%' }
    ],
    width: '100%'
});
splitObj.appendTo('#splitter');
