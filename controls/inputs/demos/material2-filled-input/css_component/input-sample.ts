/**
 * Input and Floating Input through Utility
 */
import { createElement } from '../../../node_modules/@syncfusion/ej2-base';
import { Input, InputObject } from  '../../../src/input/index';

let inputObj: InputObject;

let element: HTMLInputElement;

element = <HTMLInputElement>createElement('input', { id: 'inputpopup', attrs: {  value: 'Floating text' } });
document.getElementById('utilInput').appendChild(element);
inputObj = Input.createInput({
            element: element,
            floatLabelType: "Auto",
            properties: {
               placeholder: 'Search Float',
              }
          });

let inputObjBig: InputObject;

let elementBig: HTMLInputElement;

elementBig = <HTMLInputElement>createElement('input', { id: 'inputpopupbig', attrs: {  value: 'Floating text' } });
document.getElementById('utilInputBigger').appendChild(elementBig);
inputObjBig = Input.createInput({
            element: elementBig,
            floatLabelType: "Auto",
            properties: {
               placeholder: 'Bigger Float',
              }
          });
Input.setCssClass('e-bigger', [inputObjBig.container]);

let element2: HTMLInputElement;
let inputObj2: InputObject;

element2 = <HTMLInputElement>createElement('input', { id: 'inputpopup2', attrs: { value: 'Floating text' } });
document.getElementById('utilInputDisabled').appendChild(element2);
inputObj2 = Input.createInput({
            element: element2,
            floatLabelType: "Auto",
            properties: {
               placeholder: 'Disabled Float',
               enabled: false,
              }
          });


let element3: HTMLInputElement;
let inputObj3: InputObject;

element3 = <HTMLInputElement>createElement('input', { id: 'inputpopup3', attrs: { value: 'Floating text' } });
document.getElementById('utilInputRead').appendChild(element3);
inputObj3 = Input.createInput({
            element: element3,
            floatLabelType: "Auto",
            properties: {
               placeholder: 'Readonly Float',
               readonly: true,
              }
          });

let element4: HTMLInputElement;
let inputObj4: InputObject;

element4 = <HTMLInputElement>createElement('input', { id: 'inputpopup4', attrs: { value: 'Floating text' } });
document.getElementById('utilInputRtl').appendChild(element4);
inputObj4 = Input.createInput({
            element: element4,
            floatLabelType: "Auto",
            properties: {
               placeholder: 'RTL Float',
               enableRtl: true,
              }
          });

let element19: HTMLInputElement;
let inputObj19: InputObject;

element19 = <HTMLInputElement>createElement('input', { id: 'inputDef_prop1', attrs: { type: 'text', value: 'Default' } });
document.getElementById('inputDef1').appendChild(element19);
inputObj19 = Input.createInput({
            element: element19,
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj19.container);

let element20: HTMLInputElement;
let inputObj20: InputObject;

element20 = <HTMLInputElement>createElement('input', { id: 'inputDef_prop2', attrs: { type: 'text', value: 'Bigger' } });
document.getElementById('inputDefBigger').appendChild(element20);
inputObj20 = Input.createInput({
            element: element20,
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj20.container);
Input.setCssClass('e-bigger', [inputObj20.container] );

let element22: HTMLInputElement;
let inputObj22: InputObject;

element22 = <HTMLInputElement>createElement('input', { id: 'inputDis_prop3', attrs: { type: 'text', value: 'Disabled' } });
document.getElementById('inputDis1').appendChild(element22);
inputObj22 = Input.createInput({
            element: element22,
            properties: {
               enabled: false,
              }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj22.container);

let element23: HTMLInputElement;
let inputObj23: InputObject;

element23 = <HTMLInputElement>createElement('input', { id: 'inputDef_prop4', attrs: { type: 'text', value: 'Readonly' } });
document.getElementById('inputRead').appendChild(element23);
inputObj23 = Input.createInput({
            element: element23,
            properties: {
                readonly: true,
              }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj23.container);

let element24: HTMLInputElement;
let inputObj24: InputObject;

element24 = <HTMLInputElement>createElement('input', { id: 'inputDef_prop5', attrs: { type: 'text', value: 'RTL input' } });
document.getElementById('inputRtl').appendChild(element24);
inputObj24 = Input.createInput({
            element: element24,
            properties: {
                enableRtl: true,
              }
          });
Input.appendSpan('e-input-group-icon e-input-down', inputObj24.container);

