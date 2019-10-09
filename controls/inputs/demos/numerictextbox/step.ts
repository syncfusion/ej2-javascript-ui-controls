import { NumericTextBox } from '../../src/numerictextbox/numerictextbox';
/**
 * Default NumericTextBox sample
 */
let numeric: NumericTextBox = new NumericTextBox({
    value: 10,
	step: 2,
    floatLabelType: "Auto"
});
numeric.appendTo('#numeric');