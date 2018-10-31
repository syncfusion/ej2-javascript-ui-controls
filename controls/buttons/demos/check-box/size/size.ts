/**
 * CheckBox Default Sample
 */
import { CheckBox } from './../../../src/check-box/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);
let cbox1: CheckBox = new CheckBox({ label: 'Default' });
cbox1.appendTo('#checkbox1');

let cbox2: CheckBox = new CheckBox({ label: 'Default', checked: true });
cbox2.appendTo('#checkbox2');

let cbox3: CheckBox = new CheckBox({ label: 'Default', indeterminate: true });
cbox3.appendTo('#checkbox3');

let cbox4: CheckBox = new CheckBox({ label: 'Small', cssClass: 'e-small' });
cbox4.appendTo('#checkbox4');

let cbox5: CheckBox = new CheckBox({ label: 'Small', checked: true, cssClass: 'e-small' });
cbox5.appendTo('#checkbox5');

let cbox6: CheckBox = new CheckBox({ label: 'Small', indeterminate: true, cssClass: 'e-small' });
cbox6.appendTo('#checkbox6');

let cbox7: CheckBox = new CheckBox({ label: 'Bigger', cssClass: 'e-bigger' });
cbox7.appendTo('#checkbox7');

let cbox8: CheckBox = new CheckBox({ label: 'Bigger', checked: true, cssClass: 'e-bigger' });
cbox8.appendTo('#checkbox8');

let cbox9: CheckBox = new CheckBox({ label: 'Bigger', indeterminate: true, cssClass: 'e-bigger' });
cbox9.appendTo('#checkbox9');

let cbox10: CheckBox = new CheckBox({ label: 'Bigger_Small', cssClass: 'e-bigger e-small' });
cbox10.appendTo('#checkbox10');

let cbox11: CheckBox = new CheckBox({ label: 'Bigger_Small', checked: true, cssClass: 'e-bigger e-small' });
cbox11.appendTo('#checkbox11');

let cbox12: CheckBox = new CheckBox({ label: 'Bigger_Small', indeterminate: true, cssClass: 'e-bigger e-small' });
cbox12.appendTo('#checkbox12');