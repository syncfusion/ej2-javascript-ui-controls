/**
 * DropDownButton Default Sample
 */
import { DropDownButton, DropDownButtonModel } from './../../src/drop-down-button/index';
import { ItemModel } from './../../src/common/index';
import { SplitButton } from './../../src/split-button/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

let items: ItemModel[] = [
    {
        text: 'Learn SQL'
    },
    {
        text: 'Learn PHP'
    },
    {
        text: 'Learn Bootstrap'
    }];

let menuOptions: DropDownButtonModel = {
    items: items
};
let menuOptions1: DropDownButtonModel = {
    items: items,
    enableRtl: true
};

let btnObj: DropDownButton = new DropDownButton(menuOptions);
btnObj.appendTo('#ddb');
let btnObj1: DropDownButton = new DropDownButton(menuOptions);
btnObj1.appendTo('#ddb1');

let items1: ItemModel[] = [
    {
        text: 'Paste Text'
    },
    {
        text: 'Paste Special'
    }];


let btnObj2: SplitButton = new SplitButton({items: items1});
btnObj2.appendTo('#splitbtn');