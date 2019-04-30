/**
 * Button Default Sample
 */
import { Button } from './../../../src/button/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);
let btnObj: Button = new Button({ cssClass: 'e-small' });
btnObj.appendTo('#button1');

btnObj = new Button();
btnObj.appendTo('#button2');

btnObj = new Button();
btnObj.appendTo('#button3');

btnObj = new Button();
btnObj.appendTo('#button4');
