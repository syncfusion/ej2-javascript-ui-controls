import { NumericTextBox } from '../../src/numerictextbox/numerictextbox';
/**
 * Default NumericTextBox sample
 */
let numeric1: NumericTextBox = new NumericTextBox({
    value: 10,
    floatLabelType: "Auto"
});
numeric1.appendTo('#numeric');
let numeric2: NumericTextBox = new NumericTextBox({
    value: 10,
    floatLabelType: "Auto"
});
numeric2.appendTo('#numeric1');

