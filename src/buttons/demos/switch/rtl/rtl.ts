/**
 * Switch Default Sample
 */
import { Switch } from './../../../src/switch/index';
import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);

let cbox1: Switch = new Switch({  enableRtl: true, checked: true });
cbox1.appendTo('#switch1');

let cbox2: Switch = new Switch({ enableRtl: true });
cbox2.appendTo('#switch2');