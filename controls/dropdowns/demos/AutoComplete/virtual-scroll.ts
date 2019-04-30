
/**
 * AutoComplete Sample
 */
import { AutoComplete } from '../../src/auto-complete/index';
import { Query, DataManager, ODataV4Adaptor, WebApiAdaptor } from '@syncfusion/ej2-data';
import '../../node_modules/es6-promise/dist/es6-promise';

let data: DataManager = new DataManager({
    url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/',
    crossDomain: true
});
let query = new Query().from('Customers').select('ContactName');
let listObj: AutoComplete = new AutoComplete({
    dataSource: data,
    query: query.take(7),
    fields: { value: 'ContactName' },
    placeholder: 'Select a name',
    popupWidth: '250px',
    popupHeight: '200px',
    width: '250px',
    //Bind the filter event
    filtering: function (e: any) {
        let operator: Query = new Query().from('Customers').select('ContactName').where('ContactName', 'contains', e.text, true);
        let start: number = 7;
        let end: number = 12;
        let listElement: HTMLElement = this.list;
        listElement.addEventListener('scroll', () => {
            if ((listElement.scrollTop + listElement.offsetHeight >= listElement.scrollHeight)) {
                let filterQuery = operator.clone();
                data.executeQuery(filterQuery.range(start, end)).then((event: any) => {
                    start = end;
                    end += 5;
                    listObj.addItem(event.result as { [key: string]: Object }[]);
                }).catch((e: Object) => {
                });
            }
        })
    }
});
listObj.appendTo('#list');
