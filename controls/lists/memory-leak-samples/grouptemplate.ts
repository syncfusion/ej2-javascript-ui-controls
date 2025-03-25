/**
 * ListView Default Sample
 */
import { ListView } from '../src/list-view/index';

let listObj: ListView;
let template: string = '<div class="e-list-wrapper e-list-multi-line e-list-avatar">' +
    '<img class="e-avatar e-avatar-circle" src=${image} style="background:#BCBCBC" />' +
    '<span class="e-list-item-header">${Name}</span>' +
    '<span class="e-list-content">${contact}</span>' +
    '</div>';

//Define an array of JSON data
let data = [
    { Name: 'Nancy', contact: '(206) 555-985774', id: '1', image: 'https://ej2.syncfusion.com/demos/src/grid/images/1.png', category: 'Experience' },
    { Name: 'Janet', contact: '(206) 555-3412', id: '2', image: 'https://ej2.syncfusion.com/demos/src/grid/images/3.png', category: 'Fresher' },
    { Name: 'Margaret', contact: '(206) 555-8122', id: '4', image: 'https://ej2.syncfusion.com/demos/src/grid/images/4.png', category: 'Experience' },
    { Name: 'Andrew ', contact: '(206) 555-9482', id: '5', image: 'https://ej2.syncfusion.com/demos/src/grid/images/2.png', category: 'Experience' },
    { Name: 'Steven', contact: '(71) 555-4848', id: '6', image: 'https://ej2.syncfusion.com/demos/src/grid/images/5.png', category: 'Fresher' },
    { Name: 'Michael', contact: '(71) 555-7773', id: '7', image: 'https://ej2.syncfusion.com/demos/src/grid/images/6.png', category: 'Experience' },
    { Name: 'Robert', contact: '(71) 555-5598', id: '8', image: 'https://ej2.syncfusion.com/demos/src/grid/images/7.png', category: 'Fresher' },
    { Name: 'Laura', contact: '(206) 555-1189', id: '9', image: 'https://ej2.syncfusion.com/demos/src/grid/images/8.png', category: 'Experience' },
];
document.getElementById('render').addEventListener('click', renderListView);
document.getElementById('destroy').addEventListener('click', destoryListView);


function renderListView(): void {
    listObj = new ListView({

        //Set the defined data to the data source property
        dataSource: data,
    
        width: 350,
    
        height: 380,
    
        //Map the appropriate columns to the fields property
        fields: { text: 'Name', groupBy: 'category' },
    
        //set cssClass for template customization
        cssClass: 'e-list-template',
    
        //Set the customized template
        template: template,
        groupTemplate: '<div><span class="category">${items[0].category}</span> <span class="count"> ${items.length} Item(s)</span></div> '
    
    });
    
    listObj.appendTo('#group-list');
}

function destoryListView(): void {
    if (listObj && !listObj.isDestroyed) {
        listObj.destroy();
        listObj = null;
    }
}