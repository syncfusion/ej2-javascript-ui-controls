/**
 * Button Default Sample
 */
import { Button } from './../../../src/button/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);
let btnObj: Button = new Button({ iconCss: 'e-icons e-add-icon' });
btnObj.appendTo('#button1');

btnObj = new Button({ iconCss: 'e-icons e-open-icon' });
btnObj.appendTo('#button2');

btnObj = new Button({ iconCss: 'e-icons e-open-icon', iconPosition: 'Right' });
btnObj.appendTo('#button3');