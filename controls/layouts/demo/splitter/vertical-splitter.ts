import { Splitter } from '../../src/splitter/splitter';

let splitObj: Splitter = new Splitter({
    height: '390px',
    paneSettings: [
        { size: '30%' },
        { size: '40%' },
        { size: '30%' }
    ],
    orientation: 'Vertical',
    width: '100%'
});
splitObj.appendTo('#splitter');