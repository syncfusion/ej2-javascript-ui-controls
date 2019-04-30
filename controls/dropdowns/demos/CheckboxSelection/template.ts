/**
 * dropdownlist Sample
 */
import { MultiSelect } from '../../src/multi-select/index';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from './../../src/drop-down-base/index';
import { CheckBoxSelection } from '../../src/multi-select/checkbox-selection';

MultiSelect.Inject(CheckBoxSelection);

let empList: { [key: string]: Object }[] = [
    { text: 'Mona Sak', eimg: '1', status: 'Available', country: 'USA' },
    { text: 'Kapil Sharma', eimg: '2', status: 'Available', country: 'USA' },
    { text: 'Erik Linden', eimg: '3', status: 'Available', country: 'England' },
    { text: 'Kavi Tam', eimg: '4', status: 'Available', country: 'England' },
    { text: "Harish Sree", eimg: "5", status: "Available", country: 'USA' },
];
let listObjt: MultiSelect = new MultiSelect({
    dataSource: empList,
    fields: { text: 'text' },
    headerTemplate: '<div class="head">  Photo  <span style="padding-left:42px"> Contact Info </span></div>',
    itemTemplate: '<span class="e-text"><div><img class="eimg" src="../Employees/${eimg}.png" alt="employee"/>' +
    '<div class="ename"> ${text} </div><div class="temp"> ${country} </div></div></span>',
    footerTemplate: '<div class="Foot"> Total Items Count: 5 </div>',
    valueTemplate: '<span><img class="tempImg" src="../Employees/${eimg}.png" height="20px" width="20px" alt="employee"/>' +
    '<span class="tempName"> ${text} </span></span>',
    width: '350px',
    mode: 'CheckBox',
    showSelectAll: true,
    showDropDownIcon: true,
    filterBarPlaceholder: "Search an employee",
    filtering: function (e: FilteringEventArgs) {
        let query = new Query();
        //frame the query based on search string with filter type.
        query = (e.text != "") ? query.where("text", "startswith", e.text, true) : query;
        //pass the filter data source, filter query to updateData method.
        e.updateData(empList, query);
    },
    placeholder: 'Select an employee',
    popupWidth: '350px',
    popupHeight: '300px'
});
listObjt.appendTo('#template');