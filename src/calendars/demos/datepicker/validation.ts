import {DatePicker} from '../../src/datepicker/datepicker';
import { FormValidator, FormValidatorModel } from '@syncfusion/ej2-inputs';
// creates datepicker with readonly.
let datepickerObject: DatePicker = new DatePicker({
    // sets the palceholder property.
    placeholder: 'Enter date',
    // sets the value
    focus:function (){
        console.log("focusIn");

    },
    blur:function(){
        console.log("focusOut");
    },
    change:function(){
      
    }
});
datepickerObject.appendTo('#element');

let options: FormValidatorModel = {
    rules: {
        'datevalue': { required: true }
    },
    customPlacement: function (inputElement, errorElement) {
        //to place the error message in custom position.
        (<HTMLElement>inputElement).parentElement.parentElement.appendChild(errorElement);
    }
}
let formObject: FormValidator = new FormValidator('#form-element', options);