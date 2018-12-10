import { enableRipple } from '@syncfusion/ej2-base';
import { Splitter } from '../../src/splitter/splitter';


let splitObj: Splitter = new Splitter({
    height: '250px',
    paneSettings: [
        { size: '50px' },
        { size: '200px' }
    ],
    orientation: 'Vertical',
    width: '610px'
});
splitObj.appendTo('#outterSplitter');

let splitObj1: Splitter = new Splitter({
    height: '250px',
    paneSettings: [
        { size: '200px' },
        { size: '200px' },
        { size: '200px' }
    ],
    width: '610px'
});
splitObj1.appendTo('#splitter');