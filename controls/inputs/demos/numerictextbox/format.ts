import {
    NumericTextBox
} from '../../src/numerictextbox/numerictextbox';
/**
 * Custom format NumericTextBox sample
 */
let numeric: NumericTextBox = new NumericTextBox({
    placeholder: 'Enter the distance',
    format: '###.### Kms',
    value: 250,
    min: 0,
    floatLabelType: "Never"
});
numeric.appendTo('#numeric');

let percent: NumericTextBox = new NumericTextBox({
    format: '### \'%\'',
    placeholder: 'Enter the tax',
    min: 0,
    value: 25,
    max: 100,
    floatLabelType: "Never"
});
percent.appendTo('#percent');

let currency: NumericTextBox = new NumericTextBox({
    format: '$ ###.##',
    placeholder: 'Enter the amount',
    min: 0,
    value: 1025,
    floatLabelType: "Never"
});
currency.appendTo('#currency');