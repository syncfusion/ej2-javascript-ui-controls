/**
 * dropdownlist Sample
 */

import { MultiSelect } from '../../src/multi-select/index';
import { Query, DataManager,ODataV4Adaptor } from '@syncfusion/ej2-data';
import { CheckBoxSelection } from '../../src/multi-select/checkbox-selection';
import { FilteringEventArgs } from './../../src/drop-down-base/index';


MultiSelect.Inject(CheckBoxSelection);
let customerData: DataManager = new DataManager({
    url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Customers',
    adaptor: new ODataV4Adaptor,
    crossDomain: true
});
let listObj: MultiSelect = new MultiSelect({
    dataSource: new DataManager({ url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/' }),
    query: new Query().from('Customers').select('ContactName').take(25),
    fields: { text: 'ContactName' },
    placeholder: 'Select a name',
    popupHeight: '500px',
    mode: 'CheckBox',
    filterBarPlaceholder: 'Search a name',
    closePopupOnSelect: true,
    showSelectAll: true,
     showDropDownIcon: true,
     filtering: function (e: FilteringEventArgs) {
        var query = new Query().select(['ContactName']);
        query = (e.text !== '') ? query.where('ContactName', 'startswith', e.text, true) : query;
        e.updateData(customerData, query);
    },
});
listObj.appendTo('#component');
