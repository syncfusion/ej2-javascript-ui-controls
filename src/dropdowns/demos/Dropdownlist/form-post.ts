/**
 * ComboBox Sample
 */
import { DropDownList } from '../../src/drop-down-list/index';
import {FormValidator, FormValidatorModel} from '@syncfusion/ej2-inputs';

// defined the array of data
let sportsData: string[] = ['Badminton', 'Tennis', 'Cricket', 'Football', 'Golf'];

// initialize DropDownList component
let dropDownListObject: DropDownList = new DropDownList({
    //set the data to dataSource property
    dataSource: sportsData,
    // set placeholder to DropDownList input element
    placeholder: "Select a game"
    
});

// render initialized DropDownList
dropDownListObject.appendTo('#ddlelement');

let options: FormValidatorModel = {
    rules: {
        'listItems': { required: true },
    },
    customPlacement: (inputElement: HTMLElement, errorElement: HTMLElement) => {
        let errorEle: Element = document.getElementById('error');
        errorEle.appendChild(errorElement);
    }
}
let formObject: FormValidator = new FormValidator('#form-element', options);