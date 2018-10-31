/**
 * dropdownlist Sample
 */
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

import { MultiSelect } from '../../src/multi-select/index';
import { CheckBoxSelection } from '../../src/multi-select/checkbox-selection';
import { Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from './../../src/drop-down-base/index';

MultiSelect.Inject(CheckBoxSelection);


let noRecords: string;

let datasource: { [key: string]: Object }[] = [
    { Name: 'Australia', Code: 'AU' },
    { Name: 'Bermuda', Code: 'BM' },
    { Name: 'Canada', Code: 'CA' },
    { Name: 'Cameroon', Code: 'CM' },
    { Name: 'Denmark', Code: 'DK' },
    { Name: 'France', Code: 'FR' },
    { Name: 'Finland', Code: 'FI' },
    { Name: 'Germany', Code: 'DE' },
    { Name: 'Greenland', Code: 'GL' },
    { Name: 'Hong Kong', Code: 'HK' },
    { Name: 'India', Code: 'IN' },
    { Name: 'Italy', Code: 'IT' },
    { Name: 'Japan', Code: 'JP' },
    { Name: 'Mexico', Code: 'MX' },
    { Name: 'Norway', Code: 'NO' },
    { Name: 'Poland', Code: 'PL' },
    { Name: 'Switzerland', Code: 'CH' },
    { Name: 'United Kingdom', Code: 'GB' },
    { Name: 'United States', Code: 'US' }
];
let listObj: MultiSelect = new MultiSelect({
    dataSource: datasource,
    mode: 'CheckBox',
    popupHeight: 200,
    fields: { text: 'Name', value: 'Code' },
    value: ['US'],
    placeholder: 'Select countries',
    filterBarPlaceholder: 'Search countries',
    filtering: function (e: FilteringEventArgs) {
        let query = new Query();
        //frame the query based on search string with filter type.
        query = (e.text != "") ? query.where("Name", "startswith", e.text, true) : query;
        //pass the filter data source, filter query to updateData method.
        e.updateData(datasource, query);
    }
});
listObj.appendTo(<HTMLElement>document.querySelector("#component"));
 