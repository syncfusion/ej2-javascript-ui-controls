import { NumericTextBox } from '../../src/numerictextbox/numerictextbox';
/**
 * Default NumericTextBox sample
 */
let numeric1: NumericTextBox = new NumericTextBox({
    value: 10,
	placeholder:"placeholder",
    floatLabelType: "Auto",
	showClearButton: true,
});
numeric1.appendTo('#numeric1');
let numeric2: NumericTextBox = new NumericTextBox({
    value: 10,
    floatLabelType: "Auto",
    placeholder:"placeholder",
	showClearButton: true,
	showSpinButton: false
});
numeric2.appendTo('#numeric2');



