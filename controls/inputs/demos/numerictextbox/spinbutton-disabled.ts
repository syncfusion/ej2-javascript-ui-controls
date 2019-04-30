import { NumericTextBox } from '../../src/numerictextbox/numerictextbox';
/**
 * Default NumericTextBox sample
 */
let numeric: NumericTextBox = new NumericTextBox({
    value: 10,
    floatLabelType: "Auto",
    showSpinButton :false 
});
numeric.appendTo('#numeric');

let percent: NumericTextBox = new NumericTextBox({
    format: 'p2',
    value: 0.5,
    min: 0,
    max: 1,
    step: 0.01,
    floatLabelType: "Auto",
    showSpinButton :false
});
percent.appendTo('#percent');

let currency: NumericTextBox = new NumericTextBox({
    format: 'c2',
    value: 100,
    floatLabelType: "Auto",
    showSpinButton :false
});
currency.appendTo('#currency');

