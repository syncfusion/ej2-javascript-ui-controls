/**
 * CheckBox and RadioButton Default Sample
 */
import { CheckBox } from '../src/check-box/check-box';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

let cbox1: CheckBox;
let cbox2: CheckBox;
let cbox3: CheckBox;

document.getElementById('render').addEventListener('click', renderCheckBoxes);
document.getElementById('destroy').addEventListener('click', destroyCheckBoxes);

function renderCheckBoxes(): void {
    cbox1 = new CheckBox({ label: 'Football' });
    cbox1.appendTo('#checkbox1');

    cbox2 = new CheckBox({ checked: true, label: 'Basketball' });
    cbox2.appendTo('#checkbox2');

    cbox3 = new CheckBox({ label: 'Tennis' });
    cbox3.appendTo('#checkbox3');
}

function destroyCheckBoxes(): void {
    if (cbox1) { cbox1.destroy(); cbox1 = null; }
    if (cbox2) { cbox2.destroy(); cbox2 = null; }
    if (cbox3) { cbox3.destroy(); cbox3 = null; }
}
