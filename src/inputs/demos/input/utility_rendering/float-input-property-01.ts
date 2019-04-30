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

document.getElementById('valuehold').addEventListener("click", () => {
    let txt = (<HTMLInputElement> document.getElementById('valuetext')).value;
    Input.setValue(txt, element, "Auto" , false);
    Input.setValue(txt, element1,  "Always" , false);
    Input.setValue(txt, element2,  "Auto" , true);
    Input.setValue(txt, element3,  "Auto" , false);
    Input.setValue(txt, element4,  "Auto" , false);
    Input.setValue(txt, element5,  "Auto" , false);
    Input.setValue(txt, element6,  "Always" , false);
    Input.setValue(txt, element7,  "Auto" , true);
    Input.setValue(txt, element8,  "Auto" , false);
    Input.setValue(txt, element9,  "Auto" , false);
    Input.setValue(txt, element20,  "Auto" , false);
    Input.setValue(txt, element21,  "Auto" , false);
});

document.getElementById('placehold').addEventListener("click", () => {
    let txt = (<HTMLInputElement> document.getElementById('placetext')).value;
    Input.setPlaceholder(txt, element);
    Input.setPlaceholder(txt, element1);
    Input.setPlaceholder(txt, element2);
    Input.setPlaceholder(txt, element3);
    Input.setPlaceholder(txt, element4);
    Input.setPlaceholder(txt, element5);
    Input.setPlaceholder(txt, element6);
    Input.setPlaceholder(txt, element7);
    Input.setPlaceholder(txt, element8);
    Input.setPlaceholder(txt, element9);
    Input.setPlaceholder(txt, element20);
    Input.setPlaceholder(txt, element21);
});

document.getElementById('setenable').addEventListener("click", () => {
    Input.setEnabled(true, element, 'Auto', inputObj.container);
    Input.setEnabled(true, element1, 'Auto', inputObj1.container);
    Input.setEnabled(true, element2, 'Auto', inputObj2.container);
    Input.setEnabled(true, element3, 'Auto', inputObj3.container);
    Input.setEnabled(true, element4, 'Auto', inputObj4.container);
    Input.setEnabled(true, element5, 'Auto', inputObj5.container);
    Input.setEnabled(true, element6, 'Auto', inputObj6.container);
    Input.setEnabled(true, element7, 'Auto', inputObj7.container);
    Input.setEnabled(true, element8, 'Auto', inputObj8.container);
    Input.setEnabled(true, element9, 'Auto', inputObj9.container);
    Input.setEnabled(true, element20, 'Auto', inputObj20.container);
    Input.setEnabled(true, element21, 'Auto', inputObj21.container);
});

document.getElementById('clearenable').addEventListener("click", () => {
    Input.setEnabled(false, element, 'Auto', inputObj.container);
    Input.setEnabled(false, element1, 'Auto', inputObj1.container);
    Input.setEnabled(false, element2, 'Auto', inputObj2.container);
    Input.setEnabled(false, element3, 'Auto', inputObj3.container);
    Input.setEnabled(false, element4, 'Auto', inputObj4.container);
    Input.setEnabled(false, element5, 'Auto', inputObj5.container);
    Input.setEnabled(false, element6, 'Auto', inputObj6.container);
    Input.setEnabled(false, element7, 'Auto', inputObj7.container);
    Input.setEnabled(false, element8, 'Auto', inputObj8.container);
    Input.setEnabled(false, element9, 'Auto', inputObj9.container);
    Input.setEnabled(false, element20, 'Auto', inputObj20.container);
    Input.setEnabled(false, element21, 'Auto', inputObj21.container);
});

document.getElementById('setread').addEventListener("click", () => {
    Input.setReadonly(true, element);
    Input.setReadonly(true, element1);
    Input.setReadonly(true, element2);
    Input.setReadonly(true, element3);
    Input.setReadonly(true, element4);
    Input.setReadonly(true, element5);
    Input.setReadonly(true, element6);
    Input.setReadonly(true, element7);
    Input.setReadonly(true, element8);
    Input.setReadonly(true, element9);
    Input.setReadonly(true, element20);
    Input.setReadonly(true, element21);
});

document.getElementById('clearread').addEventListener("click", () => {
    Input.setReadonly(false, element);
    Input.setReadonly(false, element1);
    Input.setReadonly(false, element2);
    Input.setReadonly(false, element3);
    Input.setReadonly(false, element4);
    Input.setReadonly(false, element5);
    Input.setReadonly(false, element6);
    Input.setReadonly(false, element7);
    Input.setReadonly(false, element8);
    Input.setReadonly(false, element9);
    Input.setReadonly(false, element20);
    Input.setReadonly(false, element21);
});

document.getElementById('setrtl').addEventListener("click", () => {
    Input.setEnableRtl(true, [inputObj.container]);
    Input.setEnableRtl(true, [inputObj1.container]);
    Input.setEnableRtl(true, [inputObj2.container]);
    Input.setEnableRtl(true, [inputObj3.container]);
    Input.setEnableRtl(true, [inputObj4.container]);
    Input.setEnableRtl(true, [inputObj5.container]);
    Input.setEnableRtl(true, [inputObj6.container]);
    Input.setEnableRtl(true, [inputObj7.container]);
    Input.setEnableRtl(true, [inputObj8.container]);
    Input.setEnableRtl(true, [inputObj9.container]);
    Input.setEnableRtl(true, [inputObj20.container]);
    Input.setEnableRtl(true, [inputObj21.container]);
});

document.getElementById('clearrtl').addEventListener("click", () => {
    Input.setEnableRtl(false, [inputObj.container]);
    Input.setEnableRtl(false, [inputObj1.container]);
    Input.setEnableRtl(false, [inputObj2.container]);
    Input.setEnableRtl(false, [inputObj3.container]);
    Input.setEnableRtl(false, [inputObj4.container]);
    Input.setEnableRtl(false, [inputObj5.container]);
    Input.setEnableRtl(false, [inputObj6.container]);
    Input.setEnableRtl(false, [inputObj7.container]);
    Input.setEnableRtl(false, [inputObj8.container]);
    Input.setEnableRtl(false, [inputObj9.container]);
    Input.setEnableRtl(false, [inputObj20.container]);
    Input.setEnableRtl(false, [inputObj21.container]);
});