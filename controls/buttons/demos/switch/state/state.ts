/**
 * Switch Default Sample
 */
import { Switch } from './../../../src/switch/index';
let cbox1: Switch = new Switch({});
cbox1.appendTo('#switch1');

let cbox2: Switch = new Switch({ checked: true });
cbox2.appendTo('#switch2');