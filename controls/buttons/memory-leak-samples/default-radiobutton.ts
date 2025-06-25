/**
 * Radio-button default sample
 */
import { RadioButton } from '../src/radio-button/radio-button';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

let rObj1: RadioButton;
let rObj2: RadioButton;
let rObj3: RadioButton;
let rObj4: RadioButton;

document.getElementById('render').addEventListener('click', renderRadioButtons);
document.getElementById('destroy').addEventListener('click', destroyRadioButtons);

function renderRadioButtons(): void {
    rObj1 = new RadioButton({ label: 'Credit/Debit Card', name: 'payment-mode', checked: true });
    rObj1.appendTo('#radio1');

    rObj2 = new RadioButton({ label: 'NetBanking', name: 'payment-mode', labelPosition: 'Before' });
    rObj2.appendTo('#radio2');

    rObj3 = new RadioButton({ label: 'Cash on Delivery', name: 'payment-mode', cssClass: 'e-small' });
    rObj3.appendTo('#radio3');

    rObj4 = new RadioButton({ label: 'Other', name: 'payment-mode', cssClass: 'e-small', labelPosition: 'Before' });
    rObj4.appendTo('#radio4');
}

function destroyRadioButtons(): void {
    if (rObj1) { rObj1.destroy(); rObj1 = null; }
    if (rObj2) { rObj2.destroy(); rObj2 = null; }
    if (rObj3) { rObj3.destroy(); rObj3 = null; }
    if (rObj4) { rObj4.destroy(); rObj4 = null; }
}
