/**
 * CheckBox Default Sample
 */
import { CheckBox } from './../../../src/check-box/index';
import { Button } from './../../../src/button/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);
let cbox1: CheckBox = new CheckBox({ label: 'Football' });
cbox1.appendTo('#checkbox1');

let cbox2: CheckBox = new CheckBox({ checked: true, label: 'Basketball' });
cbox2.appendTo('#checkbox2');

let cbox3: CheckBox = new CheckBox({ disabled: true, label: 'Tennis' });
cbox3.appendTo('#checkbox3');

let cbox4: CheckBox = new CheckBox({ label: 'Cricket' });
cbox4.appendTo('#checkbox4');

let cbox5: CheckBox = new CheckBox({ label: 'Baseball' });
cbox5.appendTo('#checkbox5');

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
document.getElementById('fabric').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/fabric.css');
    enableRipple(false);
    refresh();
};
document.getElementById('bootstrap').onclick = (e : Event) => {
    document.body.classList.remove('darkBG');
    document.getElementById('theme').setAttribute('href', '../../theme-files/bootstrap.css');
    enableRipple(false);
    refresh();
};
document.getElementById('highcontrast').onclick = (e : Event) => {
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
        let ele: NodeListOf<HTMLInputElement> = document.getElementById('basic').getElementsByTagName('input');
        for (let i: number = 0; i < ele.length; i++) {
            (ele[i] as any).ej2_instances[0].refresh();
        }
    }, 1000);
}
