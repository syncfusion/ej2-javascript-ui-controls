import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
import { FormValidator, FormValidatorModel } from '@syncfusion/ej2-inputs';
import { enableRipple } from '@syncfusion/ej2-base';
//enable ripple style
enableRipple(true);
/**
 * Validation sample
 */

/*Initialize the datetimepicker component*/
let datetimeObject: DateTimePicker = new DateTimePicker({
    placeholder: 'Select Date and Time'
});
datetimeObject.appendTo('#element');

let options: FormValidatorModel = {
    rules: {
        //must specify the name attribute value in rules section
        'datetimevalue': { required: true }
    },
    customPlacement: (inputElement: HTMLElement, errorElement: HTMLElement) => {
        //to place the error message in custom position
        //inputElement - target element where the error text will be appended
        //errorElement - error text which will be displayed.
        inputElement.parentElement.parentElement.appendChild(errorElement);
    }
};
let formObject: FormValidator = new FormValidator('#form-element', options);