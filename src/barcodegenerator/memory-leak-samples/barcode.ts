import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);
import {
    BarcodeGenerator, ValidateEvent
} from '../src/barcode/index';

document.getElementById('render').addEventListener('click', renderGrid);
document.getElementById('destroy').addEventListener('click', destoryGrid);


let barcode: BarcodeGenerator;
function renderGrid(): void {
    barcode = new BarcodeGenerator({
        width: '200px',
        height: '150px',
        mode: 'SVG',
        type: 'Codabar',
        value: '123456789',
        margin: { left: 30, right: 30, top: 30, bottom: 30 },
        displayText: {
            text: 'Codabar',
            margin: { top: 30, bottom: 30, left: 30, right: 30 }
        },

    });
    barcode.appendTo('#element');
};


function destoryGrid(): void {
    document.getElementById('render').removeEventListener('click', renderGrid);
    document.getElementById('destroy').removeEventListener('click', destoryGrid);
    if (barcode && !barcode.isDestroyed) {
        barcode.destroy();
    }

}
