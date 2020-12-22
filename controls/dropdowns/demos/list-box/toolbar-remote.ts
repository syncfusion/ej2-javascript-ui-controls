/**
 * Drag and Drop Sample
 */
import { ListBox } from '../../src/list-box/index';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { getComponent } from '@syncfusion/ej2-base';

let vehicleData: { [key: string]: Object }[] = [
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

let vegetableData: { [key: string]: Object }[] = [
    { text: 'Cabbage', id: 'item1' },
    { text: 'Spinach', id: 'item2' },
    { text: 'Wheat grass', id: 'item3' },
    { text: 'Yarrow', id: 'item4' },
    { text: 'Pumpkins', id: 'item5' },
    { text: 'Chickpea', id: 'item6' },
    { text: 'Green bean', id: 'item7' },
    { text: 'Horse gram', id: 'item8' },
    { text: 'Garlic', id: 'item9' },
    { text: 'Nopal', id: 'item10' },
    { text: 'Onion', id: 'item11' }
];

let listObj: ListBox = new ListBox({
    scope: '#listbox2',
    fields: { text: 'CustomerID' },
    toolbarSettings: { items: ['moveUp', 'moveDown', 'moveTo', 'moveFrom', 'moveAllTo', 'moveAllFrom'] }
});
listObj.appendTo('#listbox1');

let listObj2: ListBox = new ListBox({
    fields: { text: 'CustomerID' }
});

listObj2.appendTo('#listbox2');

document.getElementById("loaddata").onclick = function () {
    var hostUrl = 'https://ej2services.syncfusion.com/production/web-services/';
    var data = new DataManager({
        url: hostUrl + 'api/Orders',
        adaptor: new WebApiAdaptor(),
        crossDomain: true
    });
    let listbox1: ListBox= getComponent(document.getElementById('listbox1'), 'listbox');
    let listbox2: ListBox = getComponent(document.getElementById('listbox2'), 'listbox');

    listbox1.dataSource = data;

    listbox2.dataSource = data;

    document.getElementById("getdata").onclick = function () {
        let listbox1: ListBox= getComponent(document.getElementById('listbox1'), 'listbox');
        let listbox2: ListBox = getComponent(document.getElementById('listbox2'), 'listbox');
        var assignedList = listbox1.getDataList();
        var unAssignedList = listbox2.getDataList();
        if (assignedList.length > 0 && typeof assignedList[0] === "undefined")
            alert("Undefined")
    }
}

function actionCompleteA(args: any) {
    let listbox1: ListBox= getComponent(document.getElementById('listbox1'), 'listbox');
    if (args.request && args.request == "GET") {
        (listbox1 as any).jsonData = args.result;
    }
}

function actionCompleteB(args: any) {
    let listbox2: ListBox= getComponent(document.getElementById('listbox2'), 'listbox');
    if (args.request && args.request == "GET") {
        (listbox2 as any).jsonData = args.result;
    }
}