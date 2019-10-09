import { NumericTextBox } from '../../src/numerictextbox/numerictextbox';
/**
 * Default NumericTextBox sample
 */
let numeric: NumericTextBox = new NumericTextBox({
    floatLabelType: "Auto",
    placeholder: "Enter value",
    value: 20
});
numeric.appendTo('#numeric');

let percent: NumericTextBox = new NumericTextBox({
    format: 'p2',
    min: 0,
    max: 1,
    step: 0.01,
    floatLabelType: "Always",
    placeholder: "Enter percentage",
    value: 2
});
percent.appendTo('#percent');

let currency: NumericTextBox = new NumericTextBox({
    format: 'c2',
    floatLabelType: "Never",
    placeholder: "Enter amount",
    value: 100
});
currency.appendTo('#currency');

