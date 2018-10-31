/**
 * Radio-button default sample
 */
import { RadioButton } from './../../../src/radio-button/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);
let radiobutton: RadioButton = new RadioButton({label: 'Left Side Label', name: 'position', checked: true, labelPosition: 'Before'});
radiobutton.appendTo('#radio1');

let radiobutton1: RadioButton = new RadioButton({label: 'Right Side Label', name: 'position'});
radiobutton1.appendTo('#radio2');