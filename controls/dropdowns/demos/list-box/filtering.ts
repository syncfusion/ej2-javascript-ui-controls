/**
 * listbox filtering
 */
import { ListBox } from '../../src/list-box/index';
import { CheckBoxSelection } from '../../src/multi-select/checkbox-selection';
import { FilteringEventArgs } from './../../src/drop-down-base/drop-down-base';
import { Query } from '@syncfusion/ej2-data';

ListBox.Inject(CheckBoxSelection);


let data: { [key: string]: Object }[] = [
    { text: 'Hennessey Venom', id: 'list-01' },
    { text: 'Bugatti Chiron', id: 'list-02' },
    { text: 'Bugatti Veyron Super Sport', id: 'list-03' },
    { text: 'SSC Ultimate Aero', id: 'list-04' },
    { text: 'Koenigsegg CCR', id: 'list-05' },
    { text: 'McLaren F1', id: 'list-06' },
    { text: 'Aston Martin One- 77', id: 'list-07' },
    { text: 'Jaguar XJ220', id: 'list-08' },
    { text: 'McLaren P1', id: 'list-09' },
    { text: 'Ferrari LaFerrari', id: 'list-10' },
];

let listObj: ListBox = new ListBox({
    dataSource: data,
    allowFiltering: true,
    filtering: function (e: FilteringEventArgs) {
        let query = new Query();
        //frame the query based on search string with filter type.
        query = (e.text != "") ? query.where("text", "startswith", e.text, true) : query;
        //pass the filter data source, filter query to updateData method.
        e.updateData(data, query);
    },
    selectionSettings: { showCheckbox: true, showSelectAll: true },
    enablePersistence: true
});
listObj.appendTo('#listbox');