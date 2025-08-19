/**
 * CheckBox Default Sample
 */
import { enableRipple, getValue } from '@syncfusion/ej2-base';
import { Switch } from '../src/switch/index';
import { rippleMouseHandler } from '../src/common/index';

let switchObj1: Switch;
let switchObj2: Switch;
let switchObj3: Switch;

document.getElementById('render').addEventListener('click', renderSwitches);
document.getElementById('destroy').addEventListener('click', destroySwitches);

function renderSwitches(): void {
    switchObj1 = new Switch({ name: 'hotspot', value: 'USB tethering', checked: true });
    switchObj1.appendTo('#checked');

    switchObj2 = new Switch({ name: 'hotspot', value: 'Wi-Fi hotspot' });
    switchObj2.appendTo('#unchecked');

    switchObj3 = new Switch({ name: 'hotspot', value: 'Bluetooth tethering', disabled: true });
    switchObj3.appendTo('#disabled');
}

function destroySwitches(): void {
    if (switchObj1) { switchObj1.destroy(); switchObj1 = null; }
    if (switchObj2) { switchObj2.destroy(); switchObj2 = null; }
    if (switchObj3) { switchObj3.destroy(); switchObj3 = null; }
}
