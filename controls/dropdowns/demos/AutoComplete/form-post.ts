/**
 * AutoComplete Sample
 */
import { AutoComplete } from '../../src/auto-complete/index';
import {FormValidator, FormValidatorModel} from '@syncfusion/ej2-inputs';

let objectData1: { [key: string]: Object; }[] = [{ index: "s11", countryName: "Hawaii" },
{ index: "s12", countryName: "Idaho" }, { index: "s13", countryName: "Illinois" },
{ index: "s14", countryName: "Indiana" }, { index: "s15", countryName: "Iowa" },
{ index: "s16", countryName: "Kansas" }, { index: "s17", countryName: "Kentucky" },
{ index: "s18", countryName: "Louisiana" }, { index: "s19", countryName: "Maine" },
{ index: "s20", countryName: "Maryland" }, { index: "s21", countryName: "Massachusetts" },
{ index: "s22", countryName: "Michigan" }, { index: "s23", countryName: "Montana" },
{ index: "s24", countryName: "New Mexico" }, { index: "25", countryName: "New York" },
{ index: "26", countryName: "North Carolina" }, { index: "s27", countryName: "Nevada" },
{ index: "s28", countryName: "New Jersey" }, { index: "s29", countryName: "Pennsylvania" },
{ index: "s30", countryName: "Ohio" }, { index: "s31", countryName: "Oklahoma" },
{ index: "s32", countryName: "Oregon" }
];

let listObj: AutoComplete = new AutoComplete({
    dataSource: objectData1,
    fields: { value: 'countryName' },
    placeholder: 'Select a country',
    filterType: 'StartsWith'
});
listObj.appendTo('#list');
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