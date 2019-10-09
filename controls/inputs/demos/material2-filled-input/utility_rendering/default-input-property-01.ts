import { Input, InputObject } from  '../../../src/input/index';

let inputObj: InputObject;
let inputO = Input;
let element: HTMLInputElement;

element = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('control-panel-small')[0].appendChild(element);
inputObj = Input.createInput({
    element: element,
    properties: {
        placeholder: 'Enter Value'
    }
});
inputObj.container.classList.add('e-small');
inputObj.container.classList.add('e-filled');

let element1: HTMLInputElement;
let inputObj1: InputObject;

element1 = <HTMLInputElement>document.createElement('input');
element1.value = 'Basic Input';
document.getElementsByClassName('control-panel-small')[0].appendChild(element1);
inputObj1 = Input.createInput({
    element: element1,
    properties: {
        placeholder: 'Enter Value'
    }
});
inputObj1.container.classList.add('e-small');
inputObj1.container.classList.add('e-filled');

let element2: HTMLInputElement;
let inputObj2: InputObject;

element2 = <HTMLInputElement>document.createElement('input');
element2.value = 'Clear Input';
document.getElementsByClassName('control-panel-small')[0].appendChild(element2);
inputObj2 = Input.createInput({
    element: element2,
    properties: {
        placeholder: 'Enter Value',
        showClearButton: true 
    }
});
inputObj2.container.classList.add('e-small');
inputObj2.container.classList.add('e-static-clear');
inputObj2.container.classList.add('e-filled');

let element3: HTMLInputElement;
let inputObj3: InputObject;

element3 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('control-panel-small')[0].appendChild(element3);
inputObj3 = Input.createInput({
            element: element3,
            properties:{
                placeholder:'Input with Icon'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj3.container);
inputObj3.container.classList.add('e-small');
inputObj3.container.classList.add('e-filled');

let element21: HTMLInputElement;
let inputObj21: InputObject;

element21 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('control-panel-small')[0].appendChild(element21);
inputObj21 = Input.createInput({
            element: element21,
            properties:{
                placeholder:'Input with Multiple Icon'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj21.container);
Input.appendSpan('e-input-group-icon e-input-down', inputObj21.container);
inputObj21.container.classList.add('e-small');
inputObj21.container.classList.add('e-filled');

// Normal Input

let inputObj5: InputObject;
let inputO5 = Input;
let element5: HTMLInputElement;

element5 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('control-panel-normal')[0].appendChild(element5);
inputObj5 = Input.createInput({
    element: element5,
    properties: {
        placeholder: 'Enter Value'
    }
});
inputObj5.container.classList.add('e-filled');

let element6: HTMLInputElement;
let inputObj6: InputObject;

element6 = <HTMLInputElement>document.createElement('input');
element6.value = 'Basic Input';
document.getElementsByClassName('control-panel-normal')[0].appendChild(element6);
inputObj6 = Input.createInput({
    element: element6,
    properties: {
        placeholder: 'Enter Value'
    }
});
inputObj6.container.classList.add('e-filled');

let element7: HTMLInputElement;
let inputObj7: InputObject;

element7 = <HTMLInputElement>document.createElement('input');
element7.value = 'Clear Input';
document.getElementsByClassName('control-panel-normal')[0].appendChild(element7);
inputObj7 = Input.createInput({
    element: element7,
    properties: {
        placeholder: 'Enter Value',
        showClearButton: true
    }
});
inputObj7.container.classList.add('e-static-clear');
inputObj7.container.classList.add('e-filled');

let element8: HTMLInputElement;
let inputObj8: InputObject;

element8 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('control-panel-normal')[0].appendChild(element8);
inputObj8 = Input.createInput({
            element: element8,
            properties:{
                placeholder:'Input with Icon'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj8.container);
inputObj8.container.classList.add('e-filled');

let element22: HTMLInputElement;
let inputObj22: InputObject;

element22 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('control-panel-normal')[0].appendChild(element22);
inputObj22 = Input.createInput({
            element: element22,
            properties:{
                placeholder:'Input with Multiple Icon'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj22.container);
Input.appendSpan('e-input-group-icon e-input-down', inputObj22.container);
inputObj22.container.classList.add('e-filled');

document.getElementById('placehold').addEventListener("click", () => {
    let txt = (<HTMLInputElement> document.getElementById('placetext')).value;
    Input.setPlaceholder(txt, element);
    Input.setPlaceholder(txt, element1);
    Input.setPlaceholder(txt, element2);
    Input.setPlaceholder(txt, element3);
    Input.setPlaceholder(txt, element5);
    Input.setPlaceholder(txt, element6);
    Input.setPlaceholder(txt, element7);
    Input.setPlaceholder(txt, element8);
    Input.setPlaceholder(txt, element21);
    Input.setPlaceholder(txt, element22);
});

document.getElementById('valuehold').addEventListener("click", () => {
    let txt = (<HTMLInputElement> document.getElementById('valuetext')).value;
    Input.setValue(txt, element, "None" , false);
    Input.setValue(txt, element1, "None" , false);
    Input.setValue(txt, element2, "None" , true);
    Input.setValue(txt, element3, "None" , false);
    Input.setValue(txt, element5, "None" , false);
    Input.setValue(txt, element6, "None" , false);
    Input.setValue(txt, element7, "None" , true);
    Input.setValue(txt, element8, "None" , false);
    Input.setValue(txt, element21, "None" , false);
    Input.setValue(txt, element22, "None" , false);
});

document.getElementById('setenable').addEventListener("click", () => {
    Input.setEnabled(true, element, 'Always', inputObj.container);
    Input.setEnabled(true, element1, 'Always', inputObj1.container);
    Input.setEnabled(true, element2, 'Always', inputObj2.container);
    Input.setEnabled(true, element3, 'Always', inputObj3.container);
    Input.setEnabled(true, element5, 'Always', inputObj5.container);
    Input.setEnabled(true, element6, 'Always', inputObj6.container);
    Input.setEnabled(true, element7, 'Always', inputObj7.container);
    Input.setEnabled(true, element8, 'Always', inputObj8.container);
    Input.setEnabled(true, element21, 'Always', inputObj21.container);
    Input.setEnabled(true, element22, 'Always', inputObj22.container);
});

document.getElementById('clearenable').addEventListener("click", () => {
    Input.setEnabled(false, element, 'Always', inputObj.container);
    Input.setEnabled(false, element1, 'Always', inputObj1.container);
    Input.setEnabled(false, element2, 'Always', inputObj2.container);
    Input.setEnabled(false, element3, 'Always', inputObj3.container);
    Input.setEnabled(false, element5, 'Always', inputObj5.container);
    Input.setEnabled(false, element6, 'Always', inputObj6.container);
    Input.setEnabled(false, element7, 'Always', inputObj7.container);
    Input.setEnabled(false, element8, 'Always', inputObj8.container);
    Input.setEnabled(false, element21, 'Always', inputObj21.container);
    Input.setEnabled(false, element22, 'Always', inputObj22.container);
});

document.getElementById('setread').addEventListener("click", () => {
    Input.setReadonly(true, element);
    Input.setReadonly(true, element1);
    Input.setReadonly(true, element2);
    Input.setReadonly(true, element3);
    Input.setReadonly(true, element5);
    Input.setReadonly(true, element6);
    Input.setReadonly(true, element7);
    Input.setReadonly(true, element8);
    Input.setReadonly(true, element21);
    Input.setReadonly(true, element22);
});

document.getElementById('clearread').addEventListener("click", () => {
    Input.setReadonly(false, element);
    Input.setReadonly(false, element1);
    Input.setReadonly(false, element2);
    Input.setReadonly(false, element3);
    Input.setReadonly(false, element5);
    Input.setReadonly(false, element6);
    Input.setReadonly(false, element7);
    Input.setReadonly(false, element8);
    Input.setReadonly(false, element21);
    Input.setReadonly(false, element22);
});

document.getElementById('setrtl').addEventListener("click", () => {
    Input.setEnableRtl(true, [inputObj.container]);
    Input.setEnableRtl(true, [inputObj1.container]);
    Input.setEnableRtl(true, [inputObj2.container]);
    Input.setEnableRtl(true, [inputObj3.container]);
    Input.setEnableRtl(true, [inputObj5.container]);
    Input.setEnableRtl(true, [inputObj6.container]);
    Input.setEnableRtl(true, [inputObj7.container]);
    Input.setEnableRtl(true, [inputObj8.container]);
    Input.setEnableRtl(true, [inputObj21.container]);
    Input.setEnableRtl(true, [inputObj22.container]);
});

document.getElementById('clearrtl').addEventListener("click", () => {
    Input.setEnableRtl(false, [inputObj.container]);
    Input.setEnableRtl(false, [inputObj1.container]);
    Input.setEnableRtl(false, [inputObj2.container]);
    Input.setEnableRtl(false, [inputObj3.container]);
    Input.setEnableRtl(false, [inputObj5.container]);
    Input.setEnableRtl(false, [inputObj6.container]);
    Input.setEnableRtl(false, [inputObj7.container]);
    Input.setEnableRtl(false, [inputObj8.container]);
    Input.setEnableRtl(false, [inputObj21.container]);
    Input.setEnableRtl(false, [inputObj22.container]);
});
