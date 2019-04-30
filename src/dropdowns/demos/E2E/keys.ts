/**
 * dropdownlist Sample
 */
import { DropDownList } from '../../src/drop-down-list/index';

    let empList: string[] = ['Football', 'Badminton', 'Basketball', 'Cricket', 'Golf', 'Hockey', 'Snooker', 'Tennis' ]
    let listObj: DropDownList = new DropDownList({
        dataSource: empList,
        popupHeight: '250px',
        placeholder: 'Select a vegetable'});
    listObj.appendTo('#list');