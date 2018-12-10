import { enableRipple } from '@syncfusion/ej2-base';
import { Splitter } from '../../src/splitter/splitter';

let splitObj: Splitter = new Splitter({
    height: '390px',
    paneSettings: [
        { size: '128px' },
        { size: '128px' },
        { size: '128px' }
    ],
    orientation: 'Vertical',
    width: '600px'
});
splitObj.appendTo('#splitter');