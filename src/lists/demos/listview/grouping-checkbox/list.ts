/**
 * ListView Checkbox Sample
 */
import { ListView, SelectedItem } from '../../../src/list-view/index';

let dataSource: { [key: string]: Object }[] = [
    {
        'text': 'Audi A4',
        'id': '9bdb',
        'category': 'Audi',
        'checked': true 
    },
    {
        'text': 'Audi A5',
        'id': '4589',
        'category': 'Audi'
    },
    {
        'text': 'Audi A6',
        'id': 'e807',
        'category': 'Audi'
    },
    {
        'text': 'Audi A7',
        'id': 'a0cc',
        'category': 'Audi'
    },
    {
        'text': 'Audi A8',
        'id': '5e26',
        'category': 'Audi'
    },
    {
        'text': 'BMW 501',
        'id': 'f849',
        'category': 'BMW'
    },
    {
        'text': 'BMW 502',
        'id': '7aff',
        'category': 'BMW',
        'checked': true 
    },
    {
        'text': 'BMW 503',
        'id': 'b1da',
        'category': 'BMW'
    },
    {
        'text': 'BMW 507',
        'id': 'de2f',
        'category': 'BMW',
        'checked': true 
    },
    {
        'text': 'BMW 3200',
        'id': 'b2b1',
        'category': 'BMW'
    }
];

let listObj: ListView = new ListView({
    dataSource: dataSource,
    fields: { groupBy: 'category' ,isChecked: 'checked'},
    //Set defined data to dataSource property, enable checkbox and map the checked in the fields.
     showCheckBox: true
});

listObj.appendTo('#group-checkbox');

document.getElementById('group_check').onclick = function () {
    listObj.checkAllItems();
};
document.getElementById('group_uncheck').onclick = function () {
    listObj.uncheckAllItems();
};
document.getElementById('material').onclick = (e: Event) => {
    document.getElementById("theme").setAttribute('href', '../../../styles/material.css');
    document.getElementById("check").setAttribute('href', '../../../node_modules/@syncfusion/ej2-buttons/styles/material.css');    
};
document.getElementById('fabric').onclick = (e: Event) => {
    document.getElementById("theme").setAttribute('href', '../../../styles/fabric.css');
    document.getElementById("check").setAttribute('href', '../../../node_modules/@syncfusion/ej2-buttons/styles/fabric.css');    
};
document.getElementById('bootstrap').onclick = (e: Event) => {
    document.getElementById("theme").setAttribute('href', '../../../styles/bootstrap.css');
    document.getElementById("check").setAttribute('href', '../../../node_modules/@syncfusion/ej2-buttons/styles/bootstrap.css');   
};
document.getElementById('rtl').onclick = (e: Event) => {
    listObj.enableRtl = true;
};

