/**
 * Radio-button default sample
 */
import { RadioButton } from './../../../src/radio-button/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { Button } from '../../../src/button/index';

enableRipple(true);
let radiobutton: RadioButton = new RadioButton({ label: 'Credit/Debit Card', name: 'payment', value: 'credit/debit', checked: true });
radiobutton.appendTo('#radio1');

let radiobutton1: RadioButton = new RadioButton({ label: 'Net Banking', name: 'payment', value: 'netbanking' });
radiobutton1.appendTo('#radio2');

let radiobutton2: RadioButton = new RadioButton({ label: 'Cash on Delivery', name: 'payment', value: 'cashondelivery' });
radiobutton2.appendTo('#radio3');

let radiobutton3: RadioButton = new RadioButton({ label: 'Other Wallets', name: 'payment', value: 'others' });
radiobutton3.appendTo('#radio4');

//Theme
let btnObj: Button = new Button();
btnObj.appendTo('#material');

btnObj = new Button();
btnObj.appendTo('#fabric');

btnObj = new Button();
btnObj.appendTo('#bootstrap');

btnObj = new Button();
btnObj.appendTo('#highcontrast');

btnObj = new Button();
btnObj.appendTo('#materialdark');

btnObj = new Button();
btnObj.appendTo('#fabricdark');

btnObj = new Button();
btnObj.appendTo('#bootstrapdark');

btnObj = new Button();
btnObj.appendTo('#bootstrap4');

// btnObj = new Button();
// btnObj.appendTo('#highcontrastlight');

document.getElementById('material').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/material.css');
    enableRipple(true);
    refresh();
};
document.getElementById('fabric').onclick = (e: Event) => {
    document.body.classList.remove('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/fabric.css');
    enableRipple(false);
    refresh();
};
document.getElementById('bootstrap').onclick = (e: Event) => {
    document.body.classList.remove('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/bootstrap.css');
    enableRipple(false);
    refresh();
};
document.getElementById('highcontrast').onclick = (e: Event) => {
    document.body.classList.add('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/highcontrast.css');
    enableRipple(false);
    refresh();
};

document.getElementById('materialdark').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/material-dark.css');
    enableRipple(true);
    refresh();
};

document.getElementById('fabricdark').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/fabric-dark.css');
    enableRipple(false);
    refresh();
};

document.getElementById('bootstrapdark').onclick = (e : Event) => {
    document.body.classList.add('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/bootstrap-dark.css');
    enableRipple(false);
    refresh();
};

document.getElementById('bootstrap4').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/bootstrap4.css');
    enableRipple(false);
    refresh();
};

// document.getElementById('highcontrastlight').onclick = (e : Event) => {
//     document.body.classList.remove('darkBG');
//     document.getElementById('theme').setAttribute('href', '../../theme-files/highcontrast-light.css');
// };

function refresh(): void {
    setTimeout(() => {
        let ele: NodeListOf<HTMLInputElement> = document.getElementById('radio').getElementsByTagName('input');
        for (let i: number = 0; i < ele.length; i++) {
            (ele[i] as any).ej2_instances[0].refresh();
        }
    }, 1000);
}
