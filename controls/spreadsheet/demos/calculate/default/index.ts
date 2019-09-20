import { Calculate, FailureEventArgs, ValueChangedArgs, IFormulaColl } from './../../../src/calculate/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Caluculate sample with key value.
 */
let value1: HTMLInputElement = <HTMLInputElement>document.getElementById('value1');
let value2: HTMLInputElement = <HTMLInputElement>document.getElementById('value2');
let formulaInp: HTMLInputElement = <HTMLInputElement>document.getElementById('formula');
let result: HTMLElement = <HTMLElement>document.getElementById('result');
let value3: HTMLInputElement = <HTMLInputElement>document.getElementById('value3');
let value4: HTMLInputElement = <HTMLInputElement>document.getElementById('value4');
let calculate: Calculate = new Calculate();
window.onload = (): void => {

    // calculate.registerGridAsSheet('Sheet1', 'Sheet1', 1);
    //calculate.valueChanged("Sheet1", new ValueChangedArgs(1,1,'=sheet1!A1'), true);
    //calculate.addNamedRange('name1','20');
    //calculate.addNamedRange('name2','10');
    let sel: any = document.getElementById('formulacoll');
    let opt: any = document.createElement('option');
    opt.value = '';
    opt.text = '--Select--';
    sel.add(opt);
    calculate.getLibraryFormulas().forEach((value: IFormulaColl, key: string) => {
        let opt: any = document.createElement('option');
        if (!isNullOrUndefined(calculate.getFunction(key))) {
            opt.value = '=' + key + '(';
            opt.text = key;
            sel.add(opt);
        }
    });
    showHideKeys();
}

document.getElementById('formula').onkeydown = (evt: KeyboardEvent): void => {
    if (evt.keyCode === 13) { // enter 
        calculateKeyValue();
    }
}

document.getElementById('formulacoll').onchange = (evt: Event): void => {
    formulaInp.value = (evt.target as any).value;
    formulaInp.focus();
}
document.getElementById('showkey').onclick = (): void => {
    showHideKeys();
}
function showHideKeys(): void {
    let elems: any = document.getElementsByClassName('keytxt');
    for (let i: number = 0; i < elems.length; i++) {
        elems[i].style.display = elems[i].style.display === 'none' ? '' : 'none';
    }
}

document.getElementById('computeValue').onclick = (): void => {
    calculateKeyValue()
};


function calculateKeyValue(): void {
    let formulaVal: string = formulaInp.value;
    let count: number = formulaInp.value.length;
    calculate.setKeyValue('A', value1.value);
    calculate.setKeyValue('B', value2.value);
    calculate.setKeyValue('C', value3.value);
    calculate.setKeyValue('D', value4.value);
    calculate.setKeyValue('F', formulaInp.value);
    if (value1.value[0] === "=") {
        document.getElementById("txt1").innerText = value1.value;
    }
    if (value2.value[0] === "=") {
        document.getElementById("txt2").innerText = value2.value;
    }
    if (value3.value[0] === "=") {
        document.getElementById("txt3").innerText = value3.value;
    }
    if (value4.value[0] === "=") {
        document.getElementById("txt4").innerText = value4.value;
    }
    //  calculate.registerGridAsSheet('A', calculate, 0);
    calculate.onFailure = function (exp: FailureEventArgs) {
        exp.computeForceCalculate = confirm("Do you want to force calculate?");
    }
    value1.value = calculate.getKeyValue('A').toString();
    value2.value = calculate.getKeyValue('B').toString();
    value3.value = calculate.getKeyValue('C').toString();
    value4.value = calculate.getKeyValue('D').toString();
    // calculate.valueChanged("Sheet1", new ValueChangedArgs(1,1,'=name2'), true);
    // calculate.valueChanged("Sheet1", new ValueChangedArgs(1,1, element6.value), true);
    result.innerHTML = calculate.getKeyValue('F').toString();
    formulaInp.value = calculate.storedData.get('F').formulaText;
    calculate.setKeyValue('F', formulaInp.value);
}

function failure(e: FailureEventArgs): void {
    alert('called');
}
// spreadsheet.appendTo('#spreadsheet');