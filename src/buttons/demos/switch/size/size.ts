/**
 * Switch Default Sample
 */
import { Switch } from './../../../src/switch/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);
let cbox1: Switch = new Switch({  });
cbox1.appendTo('#switch1');

let cbox2: Switch = new Switch({  checked: true });
cbox2.appendTo('#switch2');

let cbox3: Switch = new Switch({  });
cbox3.appendTo('#switch3');

let cbox4: Switch = new Switch({  cssClass: 'e-small' });
cbox4.appendTo('#switch4');

let cbox5: Switch = new Switch({  checked: true, cssClass: 'e-small' });
cbox5.appendTo('#switch5');

let cbox6: Switch = new Switch({  cssClass: 'e-small' });
cbox6.appendTo('#switch6');

let cbox7: Switch = new Switch({ cssClass: 'e-bigger' });
cbox7.appendTo('#switch7');

let cbox8: Switch = new Switch({ checked: true, cssClass: 'e-bigger' });
cbox8.appendTo('#switch8');

let cbox9: Switch = new Switch({  cssClass: 'e-bigger' });
cbox9.appendTo('#switch9');

let cbox10: Switch = new Switch({  cssClass: 'e-bigger e-small' });
cbox10.appendTo('#switch10');

let cbox11: Switch = new Switch({  checked: true, cssClass: 'e-bigger e-small' });
cbox11.appendTo('#switch11');

let cbox12: Switch = new Switch({ cssClass: 'e-bigger e-small' });
cbox12.appendTo('#switch12');