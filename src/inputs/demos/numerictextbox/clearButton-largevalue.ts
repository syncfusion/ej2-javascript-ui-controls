import { NumericTextBox } from '../../src/numerictextbox/numerictextbox';
/**
 * Default NumericTextBox sample
 */

let numeric1: NumericTextBox = new NumericTextBox({
    floatLabelType: "Auto",
	showClearButton: true,
	width: "200px",
	value: 32184973281674326476324723164721
});
numeric1.appendTo('#numeric1');

let numeric2: NumericTextBox = new NumericTextBox({
    floatLabelType: "Auto",
	showClearButton: true,
	width: "200px",
	value: 43127413645378274839749832749832
});
numeric2.appendTo('#numeric2');





