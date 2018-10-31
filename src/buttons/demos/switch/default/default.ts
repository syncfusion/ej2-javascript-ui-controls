/**
 * CheckBox Default Sample
 */
import { enableRipple, getValue } from '@syncfusion/ej2-base';
import { Switch } from './../../../src/switch/index';
import { rippleMouseHandler } from './../../../src/common/index';
import { Button } from '../../../src/button/index';

enableRipple(true);
let switch1: Switch = new Switch({ name: 'hotspot', value: 'USB tethering',
checked: true });
switch1.appendTo('#switch1');

let switch2: Switch = new Switch({ name: 'hotspot', value: 'Wi-Fi hotspot',
onLabel: 'ON', offLabel: 'OFF' });
switch2.appendTo('#switch2');

let switch3: Switch = new Switch({ name: 'hotspot', value: 'Bluetooth tethering',
disabled: true});
switch3.appendTo('#switch3');

let switch4: Switch = new Switch({
    name: 'hotspot', value: 'RTL', disabled: true, onLabel: 'ON', offLabel: 'OFF'});
switch4.appendTo('#switch4');

let switch5: Switch = new Switch({ name: 'hotspot', value: 'Wi-Fi', enableRtl: true });
switch5.appendTo('#switch5');

let switch6: Switch = new Switch({ enableRtl: true,
    name: 'hotspot', value: 'Bluetooth tethering', onLabel: 'ON', offLabel: 'OFF' });
switch6.appendTo('#switch6');

let switch7: Switch = new Switch({ name: 'hotspot', value: 'USB tethering', enableRtl: true,
 checked: true, onLabel: 'ON', offLabel: 'OFF', disabled: true });
switch7.appendTo('#switch7');

let switch8: Switch = new Switch({
    name: 'hotspot', cssClass: 'e-bigger', value: 'Wi-Fi hotspot'
});
switch8.appendTo('#switch8');

let switch9: Switch = new Switch({
    name: 'hotspot', value: 'Bluetooth tethering', cssClass: 'e-bigger', onLabel: 'ON',  offLabel: 'OFF'
});
switch9.appendTo('#switch9');

let switch10: Switch = new Switch({
    name: 'hotspot', value: 'RTL', cssClass: 'e-bigger', disabled: true
});
switch10.appendTo('#switch10');

let switch11: Switch = new Switch({
    name: 'hotspot', value: 'Wi-Fi', cssClass: 'e-bigger', checked: true, onLabel: 'ON', offLabel: 'OFF', disabled: true
 });
switch11.appendTo('#switch11');

let switch12: Switch = new Switch({
    enableRtl: true, name: 'hotspot', cssClass: 'e-bigger', value: 'Bluetooth tethering'
});
switch12.appendTo('#switch12');

let switch13: Switch = new Switch({
    name: 'hotspot', value: 'USB tethering', cssClass: 'e-bigger', enableRtl: true, checked: true, onLabel: 'ON', offLabel: 'OFF'
});
switch13.appendTo('#switch13');

let switch14: Switch = new Switch({
    name: 'hotspot', value: 'Wi-Fi hotspot', onLabel: 'ON', cssClass: 'e-bigger',  offLabel: 'OFF', disabled: true
});
switch14.appendTo('#switch14');

let switch15: Switch = new Switch({
    name: 'hotspot', value: 'Bluetooth tethering', cssClass: 'e-small'
});
switch15.appendTo('#switch15');

let switch16: Switch = new Switch({
    name: 'hotspot', value: 'RTL', cssClass: 'e-small', onLabel: 'ON', offLabel: 'OFF'
});
switch16.appendTo('#switch16');

let switch17: Switch = new Switch({
    name: 'hotspot', value: 'Wi-Fi', cssClass: 'e-small', checked: true, disabled: true
});
switch17.appendTo('#switch17');

let switch18: Switch = new Switch({
    name: 'hotspot', cssClass: 'e-small', value: 'Bluetooth tethering', onLabel: 'ON', offLabel: 'OFF', disabled: true
});
switch18.appendTo('#switch18');

let switch19: Switch = new Switch({
    name: 'hotspot', value: 'RTL', cssClass: 'e-small', enableRtl: true
});
switch19.appendTo('#switch19');

let switch20: Switch = new Switch({
    name: 'hotspot', value: 'Wi-Fi', cssClass: 'e-small', checked: true, onLabel: 'ON', offLabel: 'OFF', enableRtl: true
 });
switch20.appendTo('#switch20');

let switch21: Switch = new Switch({
    enableRtl: true,
    name: 'hotspot', cssClass: 'e-small', value: 'Bluetooth tethering', disabled: true, onLabel: 'ON', offLabel: 'OFF'
});
switch21.appendTo('#switch21');

let switch22: Switch = new Switch({
    name: 'hotspot', value: 'Bluetooth tethering', cssClass: 'e-small'
});
switch22.appendTo('#switch22');

let switch23: Switch = new Switch({
    name: 'hotspot', value: 'RTL', cssClass: 'e-small', onLabel: 'ON', offLabel: 'OFF'
});
switch23.appendTo('#switch23');

let switch24: Switch = new Switch({
    name: 'hotspot', value: 'Wi-Fi', cssClass: 'e-small', checked: true, disabled: true
});
switch24.appendTo('#switch24');

let switch25: Switch = new Switch({ name: 'hotspot', cssClass: 'e-small', value: 'Bluetooth tethering', disabled: true, onLabel: 'ON',
    offLabel: 'OFF'
});
switch25.appendTo('#switch25');

let switch26: Switch = new Switch({
    name: 'hotspot', value: 'RTL', cssClass: 'e-small', enableRtl: true
});
switch26.appendTo('#switch26');

let switch27: Switch = new Switch({
    name: 'hotspot', value: 'Wi-Fi', cssClass: 'e-small', checked: true, onLabel: 'ON', offLabel: 'OFF', enableRtl: true
});
switch27.appendTo('#switch27');

let switch28: Switch = new Switch({
    enableRtl: true,
    name: 'hotspot', cssClass: 'e-small', value: 'Bluetooth tethering', disabled: true, onLabel: 'ON', offLabel: 'OFF'
});
switch28.appendTo('#switch28');


//Theme
let btnObj: Button = new Button();
btnObj.appendTo('#material');

btnObj = new Button();
btnObj.appendTo('#fabric');

btnObj = new Button();
btnObj.appendTo('#bootstrap');

btnObj = new Button();
btnObj.appendTo('#highcontrast');

document.getElementById('material').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/material.css');
};
document.getElementById('fabric').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/fabric.css');
};
document.getElementById('bootstrap').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/bootstrap.css');
};
document.getElementById('highcontrast').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/highcontrast.css');
};

    let elemArray: NodeListOf<Element> = document.querySelectorAll('.switch-control label');
    for (let i: number = 0, len: number = elemArray.length; i < len; i++) {
        let switchInst: Switch = getValue('ej2_instances', elemArray[i].parentElement.nextElementSibling.querySelector('.e-switch'))[0];
        elemArray[i].addEventListener('mouseup', (e: MouseEvent) => {
            let rippleSpan: Element = switchInst.element.parentElement.getElementsByClassName('e-ripple-container')[0];
            rippleMouseHandler(e, rippleSpan);
        });
        elemArray[i].addEventListener('mousedown', (e: MouseEvent) => {
            let rippleSpan: Element = switchInst.element.parentElement.getElementsByClassName('e-ripple-container')[0];
            rippleMouseHandler(e, rippleSpan);
        });
    }
