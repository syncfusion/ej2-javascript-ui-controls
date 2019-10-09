import { Splitter } from '../../src/splitter/splitter';

let splitObj: Splitter = new Splitter({
    height: '250px',
    paneSettings: [
        { size: '30%' },
        { size: '40%' },
        { size: '30%' }
    ],
    width: '100%'
});
splitObj.appendTo('#splitter');
