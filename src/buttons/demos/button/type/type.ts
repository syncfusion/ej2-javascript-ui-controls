/**
 * Button Default Sample
 */
import { Button } from './../../../src/button/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);
let btnObj: Button = new Button();
btnObj.appendTo('#button1');

btnObj = new Button({ cssClass: 'e-flat' });
btnObj.appendTo('#button2');

btnObj = new Button({ cssClass: 'e-outline' });
btnObj.appendTo('#button3');

btnObj = new Button({ cssClass: 'e-round', isPrimary: true, iconCss: 'e-icons e-add-icon' });
btnObj.appendTo('#button4');

