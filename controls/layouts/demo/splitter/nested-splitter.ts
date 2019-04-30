import { Splitter } from '../../src/splitter/splitter';


let splitObj: Splitter = new Splitter({
    height: '300px',
    paneSettings: [
        { size: '50%' },
        { size: '50%' }
    ],
    orientation: 'Vertical'
});
splitObj.appendTo('#outterSplitter');

let splitObj1: Splitter = new Splitter({
    height: '250px',
    paneSettings: [
        { size: '30%' },
        { size: '40%' },
        { size: '30%' }
    ],
    width: '100%'
});
splitObj1.appendTo('#splitter');