import { Splitter } from '../../src/splitter/splitter';

let splitObj: Splitter = new Splitter({
    height: '250px',
    paneSettings: [
        { size: '20%' },
        { size: '30%' },
        { size: '30%' },
        { size: '20%' }
    ],
    width: '100%'
});
splitObj.appendTo('#splitter');