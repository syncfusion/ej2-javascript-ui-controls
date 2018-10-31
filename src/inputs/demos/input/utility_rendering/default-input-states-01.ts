import { Input, InputObject } from  '../../../src/input/index';

let inputObj: InputObject;
let inputO = Input;
let element: HTMLInputElement;

element = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('control-panel-small')[0].appendChild(element);
inputObj = Input.createInput({
    element: element,
    properties: {
        enabled: false,
        placeholder: 'Enter Value'
    }
});
inputObj.container.classList.add('e-small');

let element1: HTMLInputElement;
let inputObj1: InputObject;

element1 = <HTMLInputElement>document.createElement('input');
element1.value = 'Basic Input';
document.getElementsByClassName('control-panel-small')[0].appendChild(element1);
inputObj1 = Input.createInput({
    element: element1,
    properties: {
        enabled: false,
        placeholder: 'Enter Value'
    }
});
inputObj1.container.classList.add('e-small');

let element2: HTMLInputElement;
let inputObj2: InputObject;

element2 = <HTMLInputElement>document.createElement('input');
element2.value = 'Clear Input';
document.getElementsByClassName('control-panel-small')[0].appendChild(element2);
inputObj2 = Input.createInput({
    element: element2,
    properties: {
        enabled: false,
        placeholder: 'Enter Value',
        showClearButton: true 
    }
});
inputObj2.container.classList.add('e-small');
inputObj2.container.classList.add('e-static-clear');

let element3: HTMLInputElement;
let inputObj3: InputObject;

element3 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('control-panel-small')[0].appendChild(element3);
inputObj3 = Input.createInput({
            element: element3,
            properties:{
                enabled: false,
                placeholder:'Input with Icon'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj3.container);
inputObj3.container.classList.add('e-small');

let element21: HTMLInputElement;
let inputObj21: InputObject;

element21 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('control-panel-small')[0].appendChild(element21);
inputObj21 = Input.createInput({
            element: element21,
            properties:{
                enabled: false,
                placeholder:'Input with Multiple Icon'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj21.container);
Input.appendSpan('e-input-group-icon e-input-down', inputObj21.container);
inputObj21.container.classList.add('e-small');

// Normal Input

let inputObj5: InputObject;
let inputO5 = Input;
let element5: HTMLInputElement;

element5 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('control-panel-normal')[0].appendChild(element5);
inputObj5 = Input.createInput({
    element: element5,
    properties: {
        enabled: false,
        placeholder: 'Enter Value'
    }
});

let element6: HTMLInputElement;
let inputObj6: InputObject;

element6 = <HTMLInputElement>document.createElement('input');
element6.value = 'Basic Input';
document.getElementsByClassName('control-panel-normal')[0].appendChild(element6);
inputObj6 = Input.createInput({
    element: element6,
    properties: {
        enabled: false,
        placeholder: 'Enter Value'
    }
});

let element7: HTMLInputElement;
let inputObj7: InputObject;

element7 = <HTMLInputElement>document.createElement('input');
element7.value = 'Clear Input';
document.getElementsByClassName('control-panel-normal')[0].appendChild(element7);
inputObj7 = Input.createInput({
    element: element7,
    properties: {
        enabled: false,
        placeholder: 'Enter Value',
        showClearButton: true
    }
});
inputObj7.container.classList.add('e-static-clear');

let element8: HTMLInputElement;
let inputObj8: InputObject;

element8 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('control-panel-normal')[0].appendChild(element8);
inputObj8 = Input.createInput({
            element: element8,
            properties:{
                enabled: false,
                placeholder:'Input with Icon'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj8.container);

let element22: HTMLInputElement;
let inputObj22: InputObject;

element22 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('control-panel-normal')[0].appendChild(element22);
inputObj22 = Input.createInput({
            element: element22,
            properties:{
                enabled: false,
                placeholder:'Input with Multiple Icon'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj22.container);
Input.appendSpan('e-input-group-icon e-input-down', inputObj22.container);

// Bigger Input

let inputObj10: InputObject;
let element10: HTMLInputElement;

element10 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('control-panel-bigger')[0].appendChild(element10);
inputObj10 = Input.createInput({
    element: element10,
    properties: {
        enabled: false,
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
        enabled: false,
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
        enabled: false,
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
                enabled: false,
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
                enabled: false,
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
        enabled: false,
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
        enabled: false,
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
        enabled: false,
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
                enabled: false,
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
                enabled: false,
                placeholder:'Input with Multiple Icon'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj24.container);
Input.appendSpan('e-input-group-icon e-input-down', inputObj24.container);
inputObj24.container.classList.add('e-bigger');
inputObj24.container.classList.add('e-small');
