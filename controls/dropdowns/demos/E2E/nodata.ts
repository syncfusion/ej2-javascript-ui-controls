/**
 * dropdownlist Sample
 */
import { DropDownList } from '../../src/drop-down-list/index';

    let empList: { [key: string]: Object }[] = [];

    let listObj: DropDownList = new DropDownList({
        dataSource: empList,
        width: '350px',
        locale: 'en-US',
        placeholder: 'Select an employee',
    });
    listObj.appendTo('#list');
