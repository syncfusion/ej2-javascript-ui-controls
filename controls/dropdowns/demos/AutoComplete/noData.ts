/**
 * AutoComplete Sample
 */
import { AutoComplete } from '../../src/auto-complete/index';

let empList: { [key: string]: Object }[] = [];

let listObj: AutoComplete = new AutoComplete({
    dataSource: empList,
    fields: {  value: 'country' },
    noRecordsTemplate: '<div> <img src="http://www.404errorpages.com/images/image001.png" height="150px", width="150px"/> <div> There is no records to rendering the list items</div></div>',
    width: '250px',
    popupHeight: '300px',
    popupWidth: '250px',
});
listObj.appendTo('#list');