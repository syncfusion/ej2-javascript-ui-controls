/**
 * dropdownlist Sample
 */
import { MultiSelect } from '../../src/multi-select/index';
import { CheckBoxSelection } from '../../src/multi-select/checkbox-selection';
import { L10n, setCulture, } from '@syncfusion/ej2-base';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
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
    ];
let listObj: MultiSelect = new MultiSelect({
    dataSource: datasource,
    mode: 'CheckBox',
    closePopupOnSelect: true,
    popupHeight: 200,
    showSelectAll: true, 
    placeholder: 'Select countries',
    filterBarPlaceholder: 'Search countries',
    showDropDownIcon: true,
    fields: { text: 'Name' }, 
    filtering: function (e: FilteringEventArgs) {
        let query = new Query();
        //frame the query based on search string with filter type.
        query = (e.text != "") ? query.where("Name", "startswith", e.text, true) : query;
        //pass the filter data source, filter query to updateData method.
        e.updateData(datasource, query);
    }
});
listObj.appendTo(<HTMLElement>document.querySelector("#component"));
 