/**
 * CheckBox Default Sample
 */
import { CheckBox } from './../../../src/check-box/index';
import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);

let cbox1: CheckBox = new CheckBox();
cbox1.appendTo('#checkbox1');

let cbox2: CheckBox = new CheckBox({ label: 'Right side label' });
cbox2.appendTo('#checkbox2');

let cbox3: CheckBox = new CheckBox({ label: 'Left side label', labelPosition: 'Before' });
cbox3.appendTo('#checkbox3');