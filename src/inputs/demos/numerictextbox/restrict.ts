import { NumericTextBox } from '../../src/numerictextbox/numerictextbox';
/**
 * Restrict NumericTextBox sample
 */


let numeric: NumericTextBox = new NumericTextBox({
    decimals: 3,
    validateDecimalOnType: true,
    value: 10,
    floatLabelType: "Auto"
});
numeric.appendTo('#numeric');

let percent: NumericTextBox = new NumericTextBox({
    format: 'p2',
    decimals: 3,
    validateDecimalOnType: false,
    value: 0.5,
    min: 0,
    max: 1,
    step: 0.01,
    floatLabelType: "Auto"
});
percent.appendTo('#percent');

let currency: NumericTextBox = new NumericTextBox({
    format: 'c2',
    decimals: 3,
    validateDecimalOnType: true,
    value: 100,
    floatLabelType: "Auto"
});
currency.appendTo('#currency');
