
/**
 * dropDownList Sample
 */
import { DropDownList } from '../../src/drop-down-list/index';
import { Query, DataManager } from '@syncfusion/ej2-data';

let objectData1: DataManager = new DataManager({
    url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/Customers'
});
let query: Query = new Query().select(['ContactName', 'CustomerID']);
let listItems: { [key: string]: Object }[];
let dropdownList: DropDownList;
(objectData1 as DataManager).executeQuery(query).then((response: any) => {
    listItems = <{ [key: string]: Object }[]>response.result;
    dropdownList = new DropDownList({
        placeholder: 'Select a country',
        dataSource: listItems.slice(0, 10),
        fields: { text: 'ContactName', value: 'CustomerID' },
        footerTemplate: '<div id="foot" class="footer-item"> +81 more </div>',
        popupHeight: '250px',
        allowFiltering: true,
        filtering: (e: any) => {
            let query: Query = new Query();
            query = (e.text !== '') ? query.where('ContactName', 'startswith', e.text, true) : query;
            (objectData1 as DataManager).executeQuery(query).then((response: any) => {
                listItems = <{ [key: string]: Object }[]>response.result;
                e.updateData(listItems.slice(0, 10), query);
                footerUpdate(response.result);
            })
        }
    });
    dropdownList.appendTo('#list');
})

function footerUpdate(result: any) {
    let footer: HTMLElement = document.getElementById('foot');
    let items: number = result.length - 10;
    footer.innerHTML = items <= 0 ? 'All items' : '+' + items + ' more';
}
document.addEventListener('click', (e: any) => {
    let target = <HTMLElement>e.target;
    if (target.classList.contains('footer-item')) {
        dropdownList.addItem(listItems.slice(10, listItems.length));
        let footer: HTMLElement = document.getElementById('foot');
        footer.innerHTML = 'All items';
    }
})
