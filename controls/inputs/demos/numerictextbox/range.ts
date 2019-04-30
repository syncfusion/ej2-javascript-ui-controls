import {
    NumericTextBox
} from '../../src/numerictextbox/numerictextbox';
// import { Button } from '@syncfusion/ej2-buttons';
/**
 * Min-Max Range NumericTextBox sample
 */

let numeric: NumericTextBox = new NumericTextBox({
    min: 10,
    max: 12,
    value: 11,
    floatLabelType: "Auto"
});
numeric.appendTo('#numeric');

/** Property Panel Controls Rendering */

document.getElementById("buttonApply").addEventListener('click', function () {
    let min: number = parseFloat((document.getElementById('min') as HTMLInputElement).value);
    let max: number = parseFloat((document.getElementById('max') as HTMLInputElement).value);
    let step: number = parseFloat((document.getElementById('step') as HTMLInputElement).value);

    numeric.min = min;
    numeric.max = max;
    numeric.step = step;
});

