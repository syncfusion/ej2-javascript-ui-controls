/**
 * Template Sample
 */
import { ListBox } from '../../src/list-box/index';


let empList: { [key: string]: Object }[] = [
    { text: 'Mona Sak', eimg: '1', status: 'Available', country: 'USA' },
    { text: 'Kapil Sharma', eimg: '2', status: 'Available', country: 'USA' },
    { text: 'Erik Linden', eimg: '3', status: 'Available', country: 'England' },
    { text: 'Kavi Tam', eimg: '4', status: 'Available', country: 'England' },
    { text: 'Harish Sree', eimg: '5', status: 'Available', country: 'USA' },
];
let listObj: ListBox = new ListBox({
    dataSource: empList,
    fields: { text: 'text', groupBy: 'country' },
    itemTemplate: '<div><img class="eimg" src="../Employees/${eimg}.png" alt="employee"/>' +
    '<div class="ename"> ${text} </div><div class="temp"> ${country} </div></div>'
});
listObj.appendTo('#listbox');