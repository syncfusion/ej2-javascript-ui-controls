/**
 * ListView Default Sample
 */
import { ListView, Virtualization } from '../../../src/list-view/index';

let data: any = [];
ListView.Inject(Virtualization);
data = [
    { name: 'Nancy', id: '0', },
    { name: 'Andrew', id: '1' },
    { name: 'Janet', id: '2' },
    { name: 'Margaret', id: '3' },
    { name: 'Steven', id: '4' },
    { name: 'Laura', id: '5' },
    { name: 'Robert', id: '6' },
    { name: 'Michael', id: '7' },
    { name: 'Albert', id: '8' },
    { name: 'Nolan', id: '9' }
];

for (let i:number = 10; i <= 20; i++) {
    for (let j:number = 0; j < 10; j++) {
        let index:any = j.toString();
        data.push({ name: data[index].name, id: i.toString() + index});
    }
}

let listObj: any = new ListView({

    //Set defined data to dataSource property.
    dataSource: data,
    enableVirtualization: true,
    height: 324,
    headerTitle: 'Contacts',
    showHeader: true,
    fields: { text: 'name', id: 'id' }
});

listObj.appendTo('#virtual-list');

document.getElementById('list_scroll').onclick = function () {
    let ele: any = document.getElementById("virtual-list")
    ele.scrollTop=ele.scrollHeight;    
};