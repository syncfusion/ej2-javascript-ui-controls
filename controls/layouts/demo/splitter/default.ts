import { enableRipple } from '@syncfusion/ej2-base';
import { Splitter } from '../../src/splitter/splitter';

let splitObj: Splitter = new Splitter({
    height: '250px',
    paneSettings: [
        { size: '196px' },
        { size: '196px' },
        { size: '196px' }
    ],
    width: '600px'
});
splitObj.appendTo('#splitter');
