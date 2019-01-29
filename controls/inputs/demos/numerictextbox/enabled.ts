import { NumericTextBox } from '../../src/numerictextbox/numerictextbox';
/**
 * Default NumericTextBox sample
 */
let numeric: NumericTextBox = new NumericTextBox({
    value: 10,
    floatLabelType: "Auto",
    created: onCreate
});
numeric.appendTo('#numeric');

let percent: NumericTextBox = new NumericTextBox({
    format: 'p2',
    value: 0.5,
    min: 0,
    max: 1,
    step: 0.01,
    floatLabelType: "Auto",
});
percent.appendTo('#percent');

let currency: NumericTextBox = new NumericTextBox({
    format: 'c2',
    value: 100,
    floatLabelType: "Auto",
});
currency.appendTo('#currency');

function onCreate() {
    numeric.enabled = false;
}
