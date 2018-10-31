/**
 * dropdownlist Sample
 */
import { DropDownList } from '../../src/drop-down-list/index';

    let listObj: DropDownList = new DropDownList({ placeholder: 'Select a vegetable'});
    listObj.appendTo('#list');