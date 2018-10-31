import { FilteringEventArgs } from './../../src/drop-down-base/index';
import { ComboBox } from './../../src/combo-box/index';
import '../../node_modules/es6-promise/dist/es6-promise';
import { DataManager,ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
    let customerData: DataManager = new DataManager({
        url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Customers',
        adaptor: new ODataV4Adaptor,
        crossDomain: true
    });
    let query: Query = new Query().select(['ContactName', 'CustomerID']);
    let comboBoxObj: ComboBox = new ComboBox({
        dataSource: customerData,
        query: query.take(25),
        fields: { text: 'ContactName', value: 'CustomerID' },
        placeholder: 'Select a customer',
        popupHeight: '230px',
        allowFiltering: true,
        filtering: (e: FilteringEventArgs) => {
            let query: Query = new Query().select(['ContactName', 'CustomerID']);
            query = (e.text !== '') ? query.where('ContactName', 'startswith', e.text, true) : query;
            e.updateData(customerData, query);
        }
    });
    comboBoxObj.appendTo('#dropdownlist');