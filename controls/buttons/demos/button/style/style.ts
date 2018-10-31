/**
 * Button Default Sample
 */
import { Button } from './../../../src/button/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);
let btnObj: Button = new Button({ cssClass: 'e-primary' });
btnObj.appendTo('#button1');

btnObj = new Button({ cssClass: 'e-success' });
btnObj.appendTo('#button2');

btnObj = new Button({ cssClass: 'e-info' });
btnObj.appendTo('#button3');

btnObj = new Button({ cssClass: 'e-warning' });
btnObj.appendTo('#button4');

btnObj = new Button({ cssClass: 'e-danger' });
btnObj.appendTo('#button5');

btnObj = new Button({ cssClass: 'e-link' });
btnObj.appendTo('#button6');

