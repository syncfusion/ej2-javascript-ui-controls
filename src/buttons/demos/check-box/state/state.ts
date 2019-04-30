/**
 * CheckBox Default Sample
 */
import { CheckBox } from './../../../src/check-box/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);
let cbox1: CheckBox = new CheckBox({ label: 'Unchecked State' });
cbox1.appendTo('#checkbox1');

let cbox2: CheckBox = new CheckBox({ label: 'Checked State', checked: true });
cbox2.appendTo('#checkbox2');

let cbox3: CheckBox = new CheckBox({ label: 'Indeterminate State', indeterminate: true });
cbox3.appendTo('#checkbox3');

let cbox4: CheckBox = new CheckBox({ label: 'Disabled', disabled: true });
cbox4.appendTo('#checkbox4');

let cbox5: CheckBox = new CheckBox({ label: 'Disabled Check', checked: true, disabled: true });
cbox5.appendTo('#checkbox5');

let cbox6: CheckBox = new CheckBox({ label: 'Disabled Indeterminate', indeterminate: true, disabled: true });
cbox6.appendTo('#checkbox6');