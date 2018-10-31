/**
 * CheckBox Default Sample
 */
import { CheckBox } from './../../../src/check-box/index';
import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);

let cbox1: CheckBox = new CheckBox({ label: 'CheckBox', enableRtl: true });
cbox1.appendTo('#checkbox1');

let cbox2: CheckBox = new CheckBox({ label: 'CheckBox', labelPosition: 'Before', enableRtl: true });
cbox2.appendTo('#checkbox2');