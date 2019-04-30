import { Input, InputObject } from  '../../../src/input/index';

let inputObj: InputObject;
let inputO = Input;
let element: HTMLInputElement;

element = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('inner-panel-small-01')[0].appendChild(element);
inputObj = Input.createInput({
    floatLabelType: "Auto",
    element: element,
    properties: {
        placeholder: 'Enter Value'
    }
});
inputObj.container.classList.add('e-small');

let inputObj20: InputObject;
let element20: HTMLInputElement;

element20 = <HTMLInputElement>document.createElement('input');
element20.value = 'Input with Value';
document.getElementsByClassName('inner-panel-small-02')[0].appendChild(element20);
inputObj20 = Input.createInput({
    floatLabelType: "Auto",
    element: element20,
    properties: {
        placeholder: 'Enter Value'
    }
});
inputObj20.container.classList.add('e-small');

let element1: HTMLInputElement;
let inputObj1: InputObject;

element1 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('inner-panel-small-03')[0].appendChild(element1);
inputObj1 = Input.createInput({
    floatLabelType: "Always",
    element: element1,
    properties: {
        placeholder: 'Float Always'
    }
});
inputObj1.container.classList.add('e-small');

let element2: HTMLInputElement;
let inputObj2: InputObject;

element2 = <HTMLInputElement>document.createElement('input');
element2.value = 'Clear Input';
document.getElementsByClassName('inner-panel-small-04')[0].appendChild(element2);
inputObj2 = Input.createInput({
    element: element2,
    floatLabelType: "Auto",
    properties: {
        placeholder: 'Enter Value',
        showClearButton: true
    }
});
inputObj2.container.classList.add('e-small');
inputObj2.container.classList.add('e-static-clear');

let element3: HTMLInputElement;
let inputObj3: InputObject;

element3 = <HTMLInputElement>document.createElement('input');
element3.value = 'Input with Icon';
document.getElementsByClassName('inner-panel-small-05')[0].appendChild(element3);
inputObj3 = Input.createInput({
            element: element3,
            floatLabelType: "Auto",
            properties:{
                placeholder:'Enter Value'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj3.container);
inputObj3.container.classList.add('e-small');

let element4: HTMLInputElement;
let inputObj4: InputObject;

element4 = <HTMLInputElement>document.createElement('input');
element4.value = 'Input with Multiple Icon';
document.getElementsByClassName('inner-panel-small-06')[0].appendChild(element4);
inputObj4 = Input.createInput({
            element: element4,
            floatLabelType: "Auto",
            properties:{
                placeholder:'Enter Value'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj4.container);
Input.appendSpan('e-input-group-icon e-input-down', inputObj4.container);
inputObj4.container.classList.add('e-small');

// Normal Input

let inputObj5: InputObject;
let element5: HTMLInputElement;

element5 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('inner-panel-normal-01')[0].appendChild(element5);
inputObj5 = Input.createInput({
    element: element5,
    floatLabelType: "Auto",
    properties: {
        placeholder: 'Enter Value'
    }
});

let inputObj21: InputObject;
let element21: HTMLInputElement;

element21 = <HTMLInputElement>document.createElement('input');
element21.value = 'Input with Value';
document.getElementsByClassName('inner-panel-normal-02')[0].appendChild(element21);
inputObj21 = Input.createInput({
    element: element21,
    floatLabelType: "Auto",
    properties: {
        placeholder: 'Enter Value'
    }
});

let element6: HTMLInputElement;
let inputObj6: InputObject;

element6 = <HTMLInputElement>document.createElement('input');
document.getElementsByClassName('inner-panel-normal-03')[0].appendChild(element6);
inputObj6 = Input.createInput({
    element: element6,
    floatLabelType: "Always",
    properties: {
        placeholder: 'Float Always'
    }
});

let element7: HTMLInputElement;
let inputObj7: InputObject;

element7 = <HTMLInputElement>document.createElement('input');
element7.value = 'Clear Input';
document.getElementsByClassName('inner-panel-normal-04')[0].appendChild(element7);
inputObj7 = Input.createInput({
    element: element7,
    floatLabelType: "Auto",
    properties: {
        placeholder: 'Enter Value',
        showClearButton: true
    }
});
inputObj7.container.classList.add('e-static-clear');

let element8: HTMLInputElement;
let inputObj8: InputObject;

element8 = <HTMLInputElement>document.createElement('input');
element8.value = 'Input with Icon';
document.getElementsByClassName('inner-panel-normal-05')[0].appendChild(element8);
inputObj8 = Input.createInput({
            element: element8,
            floatLabelType: "Auto",
            properties:{
                placeholder:'Enter Value'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj8.container);


let element9: HTMLInputElement;
let inputObj9: InputObject;

element9 = <HTMLInputElement>document.createElement('input');
element9.value = 'Input with Multiple Icon';
document.getElementsByClassName('inner-panel-normal-06')[0].appendChild(element9);
inputObj9 = Input.createInput({
            element: element9,
            floatLabelType: "Auto",
            properties:{
                placeholder:'Enter Value'
            }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj9.container);
Input.appendSpan('e-input-group-icon e-input-down', inputObj9.container);

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
