import { NumericTextBox } from '../../src/numerictextbox/numerictextbox';
/**
 * Dark themes NumericTextBox sample
 */

let numeric1: NumericTextBox = new NumericTextBox({
    value: 20,
    floatLabelType: "Auto",
	showClearButton: true,
});
numeric1.appendTo('#numeric1');

let numeric2: NumericTextBox = new NumericTextBox({
    value: 100,
    floatLabelType: "Never",
	showClearButton: true,
});
numeric2.appendTo('#numeric2');