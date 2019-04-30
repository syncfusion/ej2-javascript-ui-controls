/**
 * ComboBox Template Sample
 */
import { ComboBox } from '../../src/combo-box/index';

    let empList: { [key: string]: Object }[] = [
        { text: 'Mona Sak', eimg: '1', status: 'Available', country: 'USA'  },
        { text: 'Kapil Sharma', eimg: '2', status: 'Available', country: 'USA' },
        { text: 'Erik Linden', eimg: '3', status: 'Available', country: 'England' },
        { text: 'Kavi Tam', eimg: '4', status: 'Available', country: 'England' },
        { text: "Harish Sree", eimg: "5", status: "Available", country: 'USA' },
    ];

    let listObj: ComboBox = new ComboBox({
        dataSource: empList,
        fields: { text: 'text', groupBy: 'country'},
        headerTemplate: '<div class="head">  Photo  <span style="padding-left:42px"> Contact Info </span></div>',
        itemTemplate: '<div><img class="eimg" src="./../Employees/${eimg}.png" alt="employee"/>' +
            '<div class="ename"> ${text} </div><div class="temp"> ${country} </div></div>',
        footerTemplate: '<div class="Foot"> Total Items Count: 5 </div>',
        width: '250px',
        placeholder: 'Select an employee',
        popupWidth: '250px',
        popupHeight: '300px'
    });
    listObj.appendTo('#list');