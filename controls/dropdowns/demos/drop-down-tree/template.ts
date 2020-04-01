/**
 * dropdowntree template Sample
 */
import { DropDownTree } from '../../src/drop-down-tree/index';

let employees: { [key: string]: Object }[] = [
    { id: 1, name: 'Steven Buchanan', eimg: '10', job: 'CEO', hasChild: true, expanded: true },   
    { id: 2, pid: 1, name: 'Laura Callahan', eimg: '2', job: 'Product Manager', hasChild: true },
    { id: 3, pid: 2, name: 'Andrew Fuller', eimg: '7', job: 'Team Lead', hasChild: true },
    { id: 4, pid: 3, name: 'Anne Dodsworth', eimg: '1', job: 'Developer' },
    { id: 5, pid: 1, name: 'Nancy Davolio', eimg: '4', job: 'Product Manager', hasChild: true },   
    { id: 6, pid: 5, name: 'Michael Suyama', eimg: '9', job: 'Team Lead', hasChild: true },
    { id: 7, pid: 6, name: 'Robert King', eimg: '8', job: 'Developer ' },
    { id: 8, pid: 7, name: 'Margaret Peacock', eimg: '6', job: 'Developer' },
    { id: 9, pid: 1, name: 'Janet Leverling', eimg: '3', job: 'HR' },
];


    let listObj: DropDownTree = new DropDownTree({
     
        fields: { dataSource: employees, text: 'name', value: 'id', parentValue: 'pid', hasChildren: 'hasChild'},
        headerTemplate: '<div class="head">  Photo  <span style="padding-left:42px"> Contact Info </span></div>',
        itemTemplate: '<div><img class="eimage" src="images/Employees/${eimg}.png" alt="employee"/>' +
            '<div class="ename"> ${name} </div><div class="ejob"> ${job} </div></div>',
        footerTemplate: '<div class="Foot"> Total Items Count: 5 </div>',
        width: '250px',
        placeholder: 'Select an employee',
        popupWidth: '250px',
        popupHeight: '300px'
    });
    listObj.appendTo('#list');