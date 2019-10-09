import { TimePicker } from '../../src/timepicker/timepicker';
import { FormValidator, FormValidatorModel } from '@syncfusion/ej2-inputs';
import { enableRipple } from '@syncfusion/ej2-base';
//enable ripple style
enableRipple(true);
/**
 * Validation sample
 */

/*Initialize the timepicker component*/
let timeObject: TimePicker = new TimePicker({
    placeholder: 'Select Time'
});
timeObject.appendTo('#element');

let options: FormValidatorModel = {
    rules: {
        //must specify the name attribute value in rules section
        'timevalue': { required: true }
    },
    customPlacement: (inputElement: HTMLElement, errorElement: HTMLElement) => {
        //to place the error message in custom position
        //inputElement - target element where the error text will be appended
        //errorElement - error text which will be displayed.
        inputElement.parentElement.parentElement.appendChild(errorElement);
    }
};
let formObject: FormValidator = new FormValidator('#form-element', options);