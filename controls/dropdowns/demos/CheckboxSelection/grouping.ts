/**
 * dropdownlist Sample
 */
import { MultiSelect } from '../../src/multi-select/index';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from './../../src/drop-down-base/index';
import { CheckBoxSelection } from '../../src/multi-select/checkbox-selection';

MultiSelect.Inject(CheckBoxSelection);

let datasource: { [key: string]: Object }[] = [
    { vegetable: 'Cabbage', category: 'Leafy and Salad' }, { vegetable: 'Spinach', category: 'Leafy and Salad' },
    { vegetable: 'Wheatgrass', category: 'Leafy and Salad' }, { vegetable: 'Yarrow', category: 'Leafy and Salad' },
    { vegetable: 'Chickpea', category: 'Beans' }, { vegetable: 'Green bean', category: 'Beans' },
    { vegetable: 'Horse gram', category: 'Beans' }, { vegetable: 'Garlic', category: 'Bulb and Stem' },
    { vegetable: 'Nopal', category: 'Bulb and Stem' }, { vegetable: 'Onion', category: 'Bulb and Stem' }
];

let listObj2: MultiSelect = new MultiSelect({
    dataSource: datasource,
    fields: { groupBy: 'category', text: 'vegetable' },
    allowCustomValue: true,
    mode: 'CheckBox',
    showSelectAll: true,
    placeholder: 'Select a vegetable',
    filtering: function (e: FilteringEventArgs) {
        let query = new Query();
        //frame the query based on search string with filter type.
        query = (e.text != "") ? query.where("vegetable", "startswith", e.text, true) : query;
        //pass the filter data source, filter query to updateData method.
        e.updateData(datasource, query);
    },
});
listObj2.appendTo(<HTMLElement>document.querySelector("#delim"));


