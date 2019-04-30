import { Input, InputObject } from  '../../../src/input/index';

// Bigger Input

let inputObj10: InputObject;
let element10: HTMLInputElement;

element10 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('control-panel-bigger')[0].appendChild(element10);
inputObj10 = Input.createInput({
    element: element10,
    properties: {
        placeholder: 'Enter Value'
    }
});
inputObj10.container.classList.add('e-bigger');

let element11: HTMLInputElement;
let inputObj11: InputObject;

element11 = <HTMLInputElement>document.createElement('input');
element11.value = 'Basic Input';
document.getElementsByClassName('control-panel-bigger')[0].appendChild(element11);
inputObj11 = Input.createInput({
    element: element11,
    properties: {
        placeholder: 'Enter Value'
    }
});
inputObj11.container.classList.add('e-bigger');

let element12: HTMLInputElement;
let inputObj12: InputObject;

element12 = <HTMLInputElement>document.createElement('input');
element12.value = 'Clear Input';
document.getElementsByClassName('control-panel-bigger')[0].appendChild(element12);
inputObj12 = Input.createInput({
    element: element12,
    properties: {
        placeholder: 'Enter Value',
        showClearButton: true
    }
});
inputObj12.container.classList.add('e-bigger');
inputObj12.container.classList.add('e-static-clear');

let element13: HTMLInputElement;
let inputObj13: InputObject;

element13 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('control-panel-bigger')[0].appendChild(element13);
inputObj13 = Input.createInput({
            element: element13,
            properties:{
                placeholder:'Input with Icon'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj13.container);
inputObj13.container.classList.add('e-bigger');

let element23: HTMLInputElement;
let inputObj23: InputObject;

element23 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('control-panel-bigger')[0].appendChild(element23);
inputObj23 = Input.createInput({
            element: element23,
            properties:{
                placeholder:'Input with Multiple Icon'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj23.container);
Input.appendSpan('e-input-group-icon e-input-down', inputObj23.container);
inputObj23.container.classList.add('e-bigger');

// Small Bigger Input

let inputObj15: InputObject;
let element15: HTMLInputElement;

element15 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('control-panel-small-bigger')[0].appendChild(element15);
inputObj15 = Input.createInput({
    element: element15,
    properties: {
        placeholder: 'Enter Value'
    }
});
inputObj15.container.classList.add('e-bigger');
inputObj15.container.classList.add('e-small');

let element16: HTMLInputElement;
let inputObj16: InputObject;

element16 = <HTMLInputElement>document.createElement('input');
element16.value = 'Basic Input';
document.getElementsByClassName('control-panel-small-bigger')[0].appendChild(element16);
inputObj16 = Input.createInput({
    element: element16,
    properties: {
        placeholder: 'Enter Value'
    }
});
inputObj16.container.classList.add('e-bigger');
inputObj16.container.classList.add('e-small');

let element17: HTMLInputElement;
let inputObj17: InputObject;

element17 = <HTMLInputElement>document.createElement('input');
element17.value = 'Clear Input';
document.getElementsByClassName('control-panel-small-bigger')[0].appendChild(element17);
inputObj17 = Input.createInput({
    element: element17,
    properties: {
        placeholder: 'Enter Value',
        showClearButton: true
    }
});
inputObj17.container.classList.add('e-bigger');
inputObj17.container.classList.add('e-small');
inputObj17.container.classList.add('e-static-clear');

let element18: HTMLInputElement;
let inputObj18: InputObject;

element18 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('control-panel-small-bigger')[0].appendChild(element18);
inputObj18 = Input.createInput({
            element: element18,
            properties:{
                placeholder:'Input with Icon'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj18.container);
inputObj18.container.classList.add('e-bigger');
inputObj18.container.classList.add('e-small');


let element24: HTMLInputElement;
let inputObj24: InputObject;

element24 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('control-panel-small-bigger')[0].appendChild(element24);
inputObj24 = Input.createInput({
            element: element24,
            properties:{
                placeholder:'Input with Multiple Icon'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj24.container);
Input.appendSpan('e-input-group-icon e-input-down', inputObj24.container);
inputObj24.container.classList.add('e-bigger');
inputObj24.container.classList.add('e-small');

document.getElementById('valuehold').addEventListener("click", () => {
    let txt = (<HTMLInputElement> document.getElementById('valuetext')).value;
    Input.setValue(txt, element10, "None" , false);
    Input.setValue(txt, element11, "None" , false);
    Input.setValue(txt, element12, "None" , true);
    Input.setValue(txt, element13, "None" , false);
    Input.setValue(txt, element15, "None" , false);
    Input.setValue(txt, element16, "None" , false);
    Input.setValue(txt, element17, "None" , true);
    Input.setValue(txt, element18, "None" , false);
    Input.setValue(txt, element23, "None" , false);
    Input.setValue(txt, element24, "None" , false);
});

document.getElementById('placehold').addEventListener("click", () => {
    let txt = (<HTMLInputElement> document.getElementById('placetext')).value;
    Input.setPlaceholder(txt, element10);
    Input.setPlaceholder(txt, element11);
    Input.setPlaceholder(txt, element12);
    Input.setPlaceholder(txt, element13);
    Input.setPlaceholder(txt, element15);
    Input.setPlaceholder(txt, element16);
    Input.setPlaceholder(txt, element17);
    Input.setPlaceholder(txt, element18);
    Input.setPlaceholder(txt, element23);
    Input.setPlaceholder(txt, element24);
});

document.getElementById('setenable').addEventListener("click", () => {
    Input.setEnabled(true, element10, 'Always', inputObj10.container);
    Input.setEnabled(true, element11, 'Always', inputObj11.container);
    Input.setEnabled(true, element12, 'Always', inputObj12.container);
    Input.setEnabled(true, element13, 'Always', inputObj13.container);
    Input.setEnabled(true, element15, 'Always', inputObj15.container);
    Input.setEnabled(true, element16, 'Always', inputObj16.container);
    Input.setEnabled(true, element17, 'Always', inputObj17.container);
    Input.setEnabled(true, element18, 'Always', inputObj18.container);
    Input.setEnabled(true, element23, 'Always', inputObj23.container);
    Input.setEnabled(true, element24, 'Always', inputObj24.container);
});

document.getElementById('clearenable').addEventListener("click", () => {
    Input.setEnabled(false, element10, 'Always', inputObj10.container);
    Input.setEnabled(false, element11, 'Always', inputObj11.container);
    Input.setEnabled(false, element12, 'Always', inputObj12.container);
    Input.setEnabled(false, element13, 'Always', inputObj13.container);
    Input.setEnabled(false, element15, 'Always', inputObj15.container);
    Input.setEnabled(false, element16, 'Always', inputObj16.container);
    Input.setEnabled(false, element17, 'Always', inputObj17.container);
    Input.setEnabled(false, element18, 'Always', inputObj18.container);
    Input.setEnabled(false, element23, 'Always', inputObj23.container);
    Input.setEnabled(false, element24, 'Always', inputObj24.container);
});

document.getElementById('setread').addEventListener("click", () => {
    Input.setReadonly(true, element10);
    Input.setReadonly(true, element11);
    Input.setReadonly(true, element12);
    Input.setReadonly(true, element13);
    Input.setReadonly(true, element15);
    Input.setReadonly(true, element16);
    Input.setReadonly(true, element17);
    Input.setReadonly(true, element18);
    Input.setReadonly(true, element23);
    Input.setReadonly(true, element24);
});

document.getElementById('clearread').addEventListener("click", () => {
    Input.setReadonly(false, element10);
    Input.setReadonly(false, element11);
    Input.setReadonly(false, element12);
    Input.setReadonly(false, element13);
    Input.setReadonly(false, element15);
    Input.setReadonly(false, element16);
    Input.setReadonly(false, element17);
    Input.setReadonly(false, element18);
    Input.setReadonly(false, element23);
    Input.setReadonly(false, element24);
});

document.getElementById('setrtl').addEventListener("click", () => {
    Input.setEnableRtl(true, [inputObj10.container]);
    Input.setEnableRtl(true, [inputObj11.container]);
    Input.setEnableRtl(true, [inputObj12.container]);
    Input.setEnableRtl(true, [inputObj13.container]);
    Input.setEnableRtl(true, [inputObj15.container]);
    Input.setEnableRtl(true, [inputObj16.container]);
    Input.setEnableRtl(true, [inputObj17.container]);
    Input.setEnableRtl(true, [inputObj18.container]);
    Input.setEnableRtl(true, [inputObj23.container]);
    Input.setEnableRtl(true, [inputObj24.container]);
});

document.getElementById('clearrtl').addEventListener("click", () => {
    Input.setEnableRtl(false, [inputObj10.container]);
    Input.setEnableRtl(false, [inputObj11.container]);
    Input.setEnableRtl(false, [inputObj12.container]);
    Input.setEnableRtl(false, [inputObj13.container]);
    Input.setEnableRtl(false, [inputObj15.container]);
    Input.setEnableRtl(false, [inputObj16.container]);
    Input.setEnableRtl(false, [inputObj17.container]);
    Input.setEnableRtl(false, [inputObj18.container]);
    Input.setEnableRtl(false, [inputObj23.container]);
    Input.setEnableRtl(false, [inputObj24.container]);
});

