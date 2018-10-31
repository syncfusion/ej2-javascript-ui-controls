import { NumericTextBox } from '../../src/numerictextbox/numerictextbox';
import { FormValidator, FormValidatorModel } from '../../src/form-validator/index';
import { createElement, KeyboardEvents, EventHandler, extend } from '@syncfusion/ej2-base';
/**
 * Sample demonstrates NumericTextBox with form validation
 */
let numeric: NumericTextBox = new NumericTextBox({
    value: 10,
    floatLabelType: "Auto"
});
numeric.appendTo('#numeric');

let options: FormValidatorModel = {
    rules: {
        'numeric': { required: true }
    }
}

let formObject: FormValidator = new FormValidator('#form-element', options);

formObject.validate();

document.getElementById('numeric').focus();



