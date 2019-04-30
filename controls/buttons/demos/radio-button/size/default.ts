/**
 * Radio-button default sample
 */
import { RadioButton } from './../../../src/radio-button/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);
let radiobutton: RadioButton = new RadioButton({ label: 'Male', name: 'gender-demo1', value: 'male', checked: true });
radiobutton.appendTo('#radio1');

radiobutton = new RadioButton({ label: 'Female', name: 'gender-demo1', value: 'female' });
radiobutton.appendTo('#radio2');

radiobutton = new RadioButton({ label: 'Others', name: 'gender-demo1', value: 'others', disabled: true });
radiobutton.appendTo('#radio3');

radiobutton = new RadioButton({ label: 'Male', name: 'gender-demo2', value: 'male', cssClass: 'e-small' });
radiobutton.appendTo('#radio4');

radiobutton = new RadioButton({ label: 'Female', name: 'gender-demo2', value: 'female', cssClass: 'e-small', checked: true });
radiobutton.appendTo('#radio5');

radiobutton = new RadioButton({ label: 'Others', name: 'gender-demo2', value: 'others', cssClass: 'e-small', disabled: true });
radiobutton.appendTo('#radio6');

radiobutton = new RadioButton({ label: 'Male', name: 'gender-demo3', value: 'male' });
radiobutton.appendTo('#radio7');

radiobutton = new RadioButton({ label: 'Female', name: 'gender-demo3', value: 'female' });
radiobutton.appendTo('#radio8');

radiobutton = new RadioButton({ label: 'Disabled', name: 'gender-demo3', value: 'others', checked: true, disabled: true });
radiobutton.appendTo('#radio9');

radiobutton = new RadioButton({ label: 'Male', name: 'gender-demo4', value: 'male', cssClass: 'e-small', checked: true });
radiobutton.appendTo('#radio10');

radiobutton = new RadioButton({ label: 'Female', name: 'gender-demo4', value: 'female', cssClass: 'e-small' });
radiobutton.appendTo('#radio11');

radiobutton = new RadioButton({ label: 'Others', name: 'gender-demo4', value: 'others', cssClass: 'e-small', disabled: true });
radiobutton.appendTo('#radio12');