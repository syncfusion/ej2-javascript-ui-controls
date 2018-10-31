/**
 * AutoComplete Sample
 */
import { AutoComplete } from '../../src/auto-complete/index';


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
{ index: "s32", countryName: "Oregon" },
{ index: "s33", countryName: "Rhode Island" },
{ index: "s34", countryName: "South Carolina" }, { index: "s35", countryName: "South Dakota" },
{ index: "s36", countryName: "Tennessee" }, { index: "s37", countryName: "Texas" },
{ index: "s38", countryName: "Utah" },
{ index: "s39", countryName: "Vermont" }, { index: "s40", countryName: "Virginia" },
{ index: "s41", countryName: "Washington" }, { index: "s42", countryName: "West Virginia" },
{ index: "s43", countryName: "Wisconsin" }, { index: "s44", countryName: "Wyoming" },
{ index: "s1", countryName: "Alabama" }, { index: "s2", countryName: "Alaska" },
{ index: "s3", countryName: "Arizona" }, { index: "s4", countryName: "Arkansas" },
{ index: "s5", countryName: "California" }, { index: "s6", countryName: "Colorado" },
{ index: "s7", countryName: "Connecticut" }, { index: "s8", countryName: "Delaware" },
{ index: "s9", countryName: "Florida" }, { index: "s10", countryName: "Georgia" }
];

let listObj: AutoComplete = new AutoComplete({
    dataSource: objectData1,
    fields: { value: 'countryName' },
    width: '250px',
    placeholder: 'Select a country',
    popupHeight: '200px',
    popupWidth: '250px',
    highlight: true
});
listObj.appendTo('#list');