import { NumericTextBox } from '../../src/numerictextbox/numerictextbox';
/**
 * Default NumericTextBox sample
 */

let numeric1: NumericTextBox = new NumericTextBox({
    floatLabelType: "Auto",
	showClearButton: true,
});
numeric1.appendTo('#numeric1');

let numeric2: NumericTextBox = new NumericTextBox({
    floatLabelType: "Auto",
	showClearButton: true,
});
numeric2.appendTo('#numeric2');





