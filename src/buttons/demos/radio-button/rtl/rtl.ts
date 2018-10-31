/**
 * Radio-button default sample
 */
import { RadioButton } from './../../../src/radio-button/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);
let radiobutton: RadioButton = new RadioButton({label: 'RTL', name: 'rtl', enableRtl: true, checked: true});
radiobutton.appendTo('#radio1');

let radiobutton1: RadioButton = new RadioButton({label: 'RTL', name: 'rtl', enableRtl: true, labelPosition: 'Before'});
radiobutton1.appendTo('#radio2');