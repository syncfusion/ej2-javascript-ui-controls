import { Input, InputObject } from  '../../../src/input/index';

// Bigger Input

let inputObj10: InputObject;
let element10: HTMLInputElement;

element10 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('inner-panel-bigger-01')[0].appendChild(element10);
inputObj10 = Input.createInput({
    element: element10,
    floatLabelType: "Auto",
    properties: {
        placeholder: 'Enter Value'
    }
});
inputObj10.container.classList.add('e-bigger');
inputObj10.container.classList.add('e-filled');

let inputObj22: InputObject;
let element22: HTMLInputElement;

element22 = <HTMLInputElement>document.createElement('input');
element22.value = 'Input with Value';
document.getElementsByClassName('inner-panel-bigger-02')[0].appendChild(element22);
inputObj22 = Input.createInput({
    element: element22,
    floatLabelType: "Auto",
    properties: {
        placeholder: 'Enter Value'
    }
});
inputObj22.container.classList.add('e-bigger');
inputObj22.container.classList.add('e-filled');

let element11: HTMLInputElement;
let inputObj11: InputObject;

element11 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('inner-panel-bigger-03')[0].appendChild(element11);
inputObj11 = Input.createInput({
    element: element11,
    floatLabelType: "Always",
    properties: {
        placeholder: 'Float Always'
    }
});
inputObj11.container.classList.add('e-bigger');
inputObj11.container.classList.add('e-filled');

let element12: HTMLInputElement;
let inputObj12: InputObject;

element12 = <HTMLInputElement>document.createElement('input');
element12.value = 'Clear Input';
document.getElementsByClassName('inner-panel-bigger-04')[0].appendChild(element12);
inputObj12 = Input.createInput({
    element: element12,
    floatLabelType: "Auto",
    properties: {
        placeholder: 'Enter Value',
        showClearButton: true
    }
});
inputObj12.container.classList.add('e-bigger');
inputObj12.container.classList.add('e-static-clear');
inputObj12.container.classList.add('e-filled');

let element13: HTMLInputElement;
let inputObj13: InputObject;

element13 = <HTMLInputElement>document.createElement('input');
element13.value = 'Input with Icon';
document.getElementsByClassName('inner-panel-bigger-05')[0].appendChild(element13);
inputObj13 = Input.createInput({
            element: element13,
            floatLabelType: "Auto",
            properties:{
                placeholder:'Enter Value'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj13.container);
inputObj13.container.classList.add('e-bigger');
inputObj13.container.classList.add('e-filled');

let element14: HTMLInputElement;
let inputObj14: InputObject;

element14 = <HTMLInputElement>document.createElement('input');
element14.value = 'Input with Multiple Icon';
document.getElementsByClassName('inner-panel-bigger-06')[0].appendChild(element14);
inputObj14 = Input.createInput({
            element: element14,
            floatLabelType: "Auto",
            properties:{
                placeholder:'Enter Value'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj14.container);
Input.appendSpan('e-input-group-icon e-input-down', inputObj14.container);
inputObj14.container.classList.add('e-bigger');
inputObj14.container.classList.add('e-filled');

// Small Bigger Input

let inputObj15: InputObject;
let element15: HTMLInputElement;

element15 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('inner-panel-small-bigger-01')[0].appendChild(element15);
inputObj15 = Input.createInput({
    element: element15,
    floatLabelType: "Auto",
    properties: {
        placeholder: 'Enter Value'
    }
});
inputObj15.container.classList.add('e-bigger');
inputObj15.container.classList.add('e-small');
inputObj15.container.classList.add('e-filled');

let inputObj23: InputObject;
let element23: HTMLInputElement;

element23 = <HTMLInputElement>document.createElement('input');
element23.value = 'Input with Value';
document.getElementsByClassName('inner-panel-small-bigger-02')[0].appendChild(element23);
inputObj23 = Input.createInput({
    element: element23,
    floatLabelType: "Auto",
    properties: {
        placeholder: 'Enter Value'
    }
});
inputObj23.container.classList.add('e-bigger');
inputObj23.container.classList.add('e-small');
inputObj23.container.classList.add('e-filled');

let element16: HTMLInputElement;
let inputObj16: InputObject;

element16 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('inner-panel-small-bigger-03')[0].appendChild(element16);
inputObj16 = Input.createInput({
    element: element16,
    floatLabelType: "Always",
    properties: {
        placeholder: 'Float Always'
    }
});
inputObj16.container.classList.add('e-bigger');
inputObj16.container.classList.add('e-small');
inputObj16.container.classList.add('e-filled');

let element17: HTMLInputElement;
let inputObj17: InputObject;

element17 = <HTMLInputElement>document.createElement('input');
element17.value = 'Clear Input';
document.getElementsByClassName('inner-panel-small-bigger-04')[0].appendChild(element17);
inputObj17 = Input.createInput({
    element: element17,
    floatLabelType: "Auto",
    properties: {
        placeholder: 'Enter Value',
        showClearButton: true
    }
});
inputObj17.container.classList.add('e-bigger');
inputObj17.container.classList.add('e-small');
inputObj17.container.classList.add('e-static-clear');
inputObj17.container.classList.add('e-filled');

let element18: HTMLInputElement;
let inputObj18: InputObject;

element18 = <HTMLInputElement>document.createElement('input');
element18.value = 'Input with Icon';
document.getElementsByClassName('inner-panel-small-bigger-05')[0].appendChild(element18);
inputObj18 = Input.createInput({
            element: element18,
            floatLabelType: "Auto",
            properties:{
                placeholder:'Enter Value'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj18.container);
inputObj18.container.classList.add('e-bigger');
inputObj18.container.classList.add('e-small');
inputObj18.container.classList.add('e-filled');

let element19: HTMLInputElement;
let inputObj19: InputObject;

element19 = <HTMLInputElement>document.createElement('input');
element19.value = 'Input with Multiple Icon';
document.getElementsByClassName('inner-panel-small-bigger-06')[0].appendChild(element19);
inputObj19 = Input.createInput({
            element: element19,
            floatLabelType: "Auto",
            properties:{
                placeholder:'Enter Value'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj19.container);
Input.appendSpan('e-input-group-icon e-input-down', inputObj19.container);
inputObj19.container.classList.add('e-bigger');
inputObj19.container.classList.add('e-small');
inputObj19.container.classList.add('e-filled');


document.getElementById('valuehold').addEventListener("click", () => {
    let txt = (<HTMLInputElement> document.getElementById('valuetext')).value;
    Input.setValue(txt, element10, "Auto" , false);
    Input.setValue(txt, element11, "Always" , false);
    Input.setValue(txt, element12, "Auto" , true);
    Input.setValue(txt, element13, "Auto" , false);
    Input.setValue(txt, element15, "Auto" , false);
    Input.setValue(txt, element16, "Always" , false);
    Input.setValue(txt, element17, "Auto" , true);
    Input.setValue(txt, element18, "Auto" , false);
    Input.setValue(txt, element22, "Auto" , false);
    Input.setValue(txt, element23, "Auto" , false);
    Input.setValue(txt, element14, "Auto" , false);
    Input.setValue(txt, element19, "Auto" , false);
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
    Input.setPlaceholder(txt, element22);
    Input.setPlaceholder(txt, element23);
    Input.setPlaceholder(txt, element14);
    Input.setPlaceholder(txt, element19);
});

document.getElementById('setenable').addEventListener("click", () => {
    Input.setEnabled(true, element10, 'Auto', inputObj10.container);
    Input.setEnabled(true, element11, 'Auto', inputObj11.container);
    Input.setEnabled(true, element12, 'Auto', inputObj12.container);
    Input.setEnabled(true, element13, 'Auto', inputObj13.container);
    Input.setEnabled(true, element15, 'Auto', inputObj15.container);
    Input.setEnabled(true, element16, 'Auto', inputObj16.container);
    Input.setEnabled(true, element17, 'Auto', inputObj17.container);
    Input.setEnabled(true, element18, 'Auto', inputObj18.container);
    Input.setEnabled(true, element22, 'Auto', inputObj22.container);
    Input.setEnabled(true, element23, 'Auto', inputObj23.container);
    Input.setEnabled(true, element14, 'Auto', inputObj14.container);
    Input.setEnabled(true, element19, 'Auto', inputObj19.container);
});

document.getElementById('clearenable').addEventListener("click", () => {
    Input.setEnabled(false, element10, 'Auto', inputObj10.container);
    Input.setEnabled(false, element11, 'Auto', inputObj11.container);
    Input.setEnabled(false, element12, 'Auto', inputObj12.container);
    Input.setEnabled(false, element13, 'Auto', inputObj13.container);
    Input.setEnabled(false, element15, 'Auto', inputObj15.container);
    Input.setEnabled(false, element16, 'Auto', inputObj16.container);
    Input.setEnabled(false, element17, 'Auto', inputObj17.container);
    Input.setEnabled(false, element18, 'Auto', inputObj18.container);
    Input.setEnabled(false, element22, 'Auto', inputObj22.container);
    Input.setEnabled(false, element23, 'Auto', inputObj23.container);
    Input.setEnabled(false, element14, 'Auto', inputObj14.container);
    Input.setEnabled(false, element19, 'Auto', inputObj19.container);
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
    Input.setReadonly(true, element22);
    Input.setReadonly(true, element23);
    Input.setReadonly(true, element14);
    Input.setReadonly(true, element19);
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
    Input.setReadonly(false, element22);
    Input.setReadonly(false, element23);
    Input.setReadonly(false, element14);
    Input.setReadonly(false, element19);
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
    Input.setEnableRtl(true, [inputObj22.container]);
    Input.setEnableRtl(true, [inputObj23.container]);
    Input.setEnableRtl(true, [inputObj14.container]);
    Input.setEnableRtl(true, [inputObj19.container]);
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
    Input.setEnableRtl(false, [inputObj22.container]);
    Input.setEnableRtl(false, [inputObj23.container]);
    Input.setEnableRtl(false, [inputObj14.container]);
    Input.setEnableRtl(false, [inputObj19.container]);
});

