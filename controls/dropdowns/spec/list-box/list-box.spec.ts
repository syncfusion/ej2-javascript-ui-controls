/**
 * 
 */
import { createElement, EventHandler } from '@syncfusion/ej2-base';
import { ListBox, ListBoxChangeEventArgs, SelectionSettings } from '../../src/index';
import { cssClass } from '@syncfusion/ej2-lists';
import { CheckBoxSelection } from '../../src/multi-select/checkbox-selection';
import { Query } from '@syncfusion/ej2-data';

ListBox.Inject(CheckBoxSelection);

let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', value: '1', icon: 'icon' }, { id: 'list2', value: '2', text: 'C#' },
{ id: 'list3', value: '3', text: 'C++' }, { id: 'list4', value: '4', text: 'NET', icon: 'icon' }, { id: 'list5', value: '5', text: 'Oracle' }];

let eData: { [key: string]: Object }[] = [{ id: 'list0', text: '', value: '0', icon: 'icon' }, { id: 'list1', text: 'JAVA', value: '1', icon: 'icon' }, { id: 'list2', value: '2', text: 'C#' },
{ id: 'list3', value: '3', text: 'C++' }, { id: 'list4', value: '4', text: 'NET', icon: 'icon' }, { id: 'list5', value: '5', text: 'Oracle' }];

let data2: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', value: 1, icon: 'icon' }, { id: 'list2', value: 2, text: 'C#' },
{ id: 'list3', value: 3, text: 'C++' }, { id: 'list4', value: 4, text: 'NET', icon: 'icon' }, { id: 'list5', value: 5, text: 'Oracle' }];

let vegetableData: { [key: string]: Object }[] = [
    { text: 'Cabbage', id: 'item1', category: 'Leafy and Salad' },
    { text: 'Spinach', id: 'item2', category: 'Leafy and Salad' },
    { text: 'Wheat', id: 'item3', category: 'Leafy and Salad' },
    { text: 'Yarrow', id: 'item4', category: 'Leafy and Salad' },
    { text: 'Pumpkins', id: 'item5', category: 'Leafy and Salad' },
    { text: 'Chickpea', id: 'item6', category: 'Beans' },
    { text: 'Bean', id: 'item7', category: 'Beans' },
    { text: 'Horse gram', id: 'item8', category: 'Beans' },
    { text: 'Garlic', id: 'item9', category: 'Bulb and Stem' },
    { text: 'Nopal', id: 'item10', category: 'Bulb and Stem' },
    { text: 'Onion', id: 'item11', category: 'Bulb and Stem' }
];

function generateItems(data:  { [key: string]: Object }[], count: number):  { [key: string]: Object }[] {
    let result:  { [key: string]: Object }[] = [];
    while (result.length < count) {
        let randomIndex = Math.floor(Math.random() * data.length);
        result.push(data[randomIndex]);
    }
    return result;
}

const maxData:  { [key: string]: Object }[] = generateItems(vegetableData, 1000);

describe('ListBox', () => {
    let listObj: any;
    let li: any;

    beforeAll(() => {
        document.body.appendChild(createElement('link', { attrs: { rel: 'stylesheet', href: '/base/styles/list-box/material.css', type: 'text/css' } }));
    });

    describe('Selection', () => {
        let elem: HTMLElement = createElement('input');
        beforeAll(() => {
            document.body.appendChild(elem);
        });

        afterEach(() => {
            listObj.destroy();
        });

        it('Normal', () => {
            listObj = new ListBox({ dataSource: data, allowFiltering: true }, elem);
            li = listObj.getItems();
            li[0].click();
            expect(li[0].classList).toContain(cssClass.selected);
            expect(listObj.value[0]).toEqual('JAVA');
            expect(listObj.list.querySelector('.e-hidden-select').children[0].value).toEqual('JAVA');

            li[1].click();
            expect(li[0].classList).not.toContain(cssClass.selected);
            expect(li[1].classList).toContain(cssClass.selected);
            expect(listObj.value[0]).toEqual('C#');
            expect(listObj.list.querySelector('.e-hidden-select').children[0].value).toEqual('C#');
            listObj.resizeHandler();
            listObj.cssClass = 'e-horizontal-listbox';
            listObj.dataBind();
            listObj.resizeHandler();
        });


        it('Ctrl', () => {
            listObj = new ListBox({ dataSource: data, fields: { value: 'value', text: 'text' } }, elem);
            li = listObj.getItems();
            li[2].click();
            listObj.clickHandler({ target: li[3], ctrlKey: true });
            expect(li[2].classList).toContain(cssClass.selected);
            expect(li[3].classList).toContain(cssClass.selected);
            expect(listObj.value[0]).toEqual('3');
            expect(listObj.value[1]).toEqual('4');
            expect(listObj.list.querySelector('.e-hidden-select').children[0].value).toEqual('3');
            expect(listObj.list.querySelector('.e-hidden-select').children[1].value).toEqual('4');

            listObj.clickHandler({ target: li[4], ctrlKey: true });
            expect(li[4].classList).toContain(cssClass.selected);
            expect(listObj.value[2]).toEqual('5');

            listObj.clickHandler({ target: li[3], ctrlKey: true });
            expect(li[3].classList).not.toContain(cssClass.selected);

            listObj.selectionSettings.mode = 'Single';
            listObj.clickHandler({ target: li[0], ctrlKey: true });
            expect(li[0].classList).toContain(cssClass.selected);
            expect(li[2].classList).not.toContain(cssClass.selected);
            expect(listObj.value[0]).toEqual('1');
            expect(listObj.value.length).toEqual(1);
            listObj.selectionSettings.mode = 'Multiple';

            listObj.destroy();
            listObj = new ListBox({ dataSource: data2, fields: { value: 'value', text: 'text' }, value: [3] }, elem);
            li = listObj.getItems();
            expect(li[2].classList).toContain(cssClass.selected);
            expect(listObj.value[0]).toEqual(3);
            listObj.clickHandler({ target: li[3], ctrlKey: true });
            expect(li[3].classList).toContain(cssClass.selected);
            expect(listObj.value[1]).toEqual(4);
        });

        it('Shift', () => {
            listObj = new ListBox({ dataSource: data }, elem);
            li = listObj.getItems();
            li[2].click();
            listObj.clickHandler({ target: li[0], shiftKey: true });
            expect(li[0].classList).toContain(cssClass.selected);
            expect(li[1].classList).toContain(cssClass.selected);
            expect(li[2].classList).toContain(cssClass.selected);
            expect(listObj.value[0]).toEqual('JAVA');
            expect(listObj.value[1]).toEqual('C#');
            expect(listObj.value[2]).toEqual('C++');

            listObj.clickHandler({ target: li[4], shiftKey: true });
            expect(li[0].classList).not.toContain(cssClass.selected);
            expect(li[1].classList).not.toContain(cssClass.selected);
            expect(li[2].classList).toContain(cssClass.selected);
            expect(li[3].classList).toContain(cssClass.selected);
            expect(li[4].classList).toContain(cssClass.selected);
            expect(listObj.value[0]).toEqual('C++');
            expect(listObj.value[2]).toEqual('Oracle');

            listObj.selectionSettings.mode = 'Single';
            listObj.clickHandler({ target: li[0], shiftKey: true });
            expect(li[0].classList).toContain(cssClass.selected);
            expect(li[2].classList).not.toContain(cssClass.selected);
            expect(listObj.value[0]).toEqual('JAVA');
            expect(listObj.value.length).toEqual(1);
            listObj.selectionSettings.mode = 'Multiple';
        });

        it('Checkbox', () => {
            listObj = new ListBox({ dataSource: data }, elem);
            listObj.selectionSettings.showCheckbox = true;
            listObj.selectionSettings.showSelectAll = true;
            listObj.dataBind();
            let liEle: any = listObj.getItems();
            liEle[2].click();
            expect(liEle[2].classList).not.toContain(cssClass.selected);
            expect(listObj.value[0]).toEqual('C++');
            expect(liEle[2].getElementsByClassName('e-frame')[0].classList).toContain('e-check');
            liEle[4].click();
            expect(listObj.value[1]).toEqual('Oracle');
            expect(liEle[4].getElementsByClassName('e-frame')[0].classList).toContain('e-check');
            liEle[2].click();
            expect(listObj.value[0]).not.toEqual('C++');
            expect(liEle[2].getElementsByClassName('e-frame')[0].classList).not.toContain('e-check');
            listObj.selectionSettings.showCheckbox = false;
            listObj.dataBind();
            listObj.selectionSettings.showSelectAll = true;
            (listObj as any).showCheckbox(true);
        });

        it('Checkbox - SelectAll', () => {
            listObj = new ListBox({ dataSource: data, allowFiltering: true }, elem);
            listObj.selectionSettings.showCheckbox = true;
            listObj.dataBind();
            (listObj as any).selectAllItems();
            (listObj as any).selectHandler({target: (listObj as any).list.querySelector('li') })
        });

        it('Select All Checkbox', () => {
            listObj = new ListBox({ dataSource: data, allowFiltering: true, selectionSettings: { showCheckbox: true, showSelectAll: true } }, elem);
            let ele: any = listObj.list.getElementsByClassName('e-selectall-parent')[0];
            EventHandler.trigger(ele, 'mousedown', { currentTarget: ele, preventDefault: () => { } });
            expect(ele.getElementsByClassName('e-frame')[0].classList).toContain('e-check');
            expect(listObj.getSelectedItems().length).toEqual(5);
            EventHandler.trigger(ele, 'mousedown', { currentTarget: ele, preventDefault: () => { } });
            expect(ele.getElementsByClassName('e-frame')[0].classList).not.toContain('e-check');
            expect(listObj.getSelectedItems().length).toEqual(0);
            let liele: any = listObj.list.getElementsByClassName('e-list-item');
            liele[0].click();
            liele[1].click();
            liele[2].click();
            liele[3].click();
            liele[4].click();
            expect(ele.getElementsByClassName('e-frame')[0].classList).toContain('e-check');
            expect(ele.innerText).toEqual('Unselect All');
            expect(listObj.getSelectedItems().length).toEqual(5);
            liele[0].click();
            expect(liele[0].getElementsByClassName('e-frame')[0].classList).not.toContain('e-check');
            expect(ele.getElementsByClassName('e-frame')[0].classList).not.toContain('e-check');
            expect(ele.innerText).toEqual('Select All');
            expect(listObj.getSelectedItems().length).toEqual(4);
            (listObj as any).updateMainList();
        });

        it('Selected Options', () => {
            listObj = new ListBox({ dataSource: data, value: ['C#', 'C++'] }, elem);
            let liEle: any = listObj.getItems();
            expect(liEle[1].classList).toContain(cssClass.selected);
            expect(liEle[2].classList).toContain(cssClass.selected);
            listObj.value = ['JAVA'];
            listObj.dataBind();
            expect(listObj.getSelectedItems().length).toEqual(1);
            expect(listObj.getItems()[0].classList).toContain(cssClass.selected);
            listObj.value = ['JAVA', 'C#', 'C++'];
            listObj.dataBind();
            listObj.moveDown(['C++']);
            listObj.moveUp(['C++']);
            listObj.moveBottom(['C++']);
            listObj.moveTop(['C++']);
            expect(listObj.getItems()[0].textContent).toEqual('C++');
        });
    });

    describe('Property', () => {
        let listObj: any
        let elem: HTMLElement = createElement('input');
        beforeAll(() => {
            document.body.appendChild(elem);
        });

        afterEach(() => {
            listObj.destroy();
        });

        it('cssClass', () => {
            listObj = new ListBox({ dataSource: data, cssClass: 'e-custom' }, elem);
            expect(listObj.element.parentElement.classList).toContain('e-custom');
            listObj.cssClass = 'e-custom2';
            listObj.dataBind();
            expect(listObj.element.parentElement.classList).toContain('e-custom2');
            listObj.setScrollDown(listObj.element, 10, true);
            listObj.setScrollDown(listObj.element, 10, false);
        });

        it('Rtl', () => {
            listObj = new ListBox({ dataSource: data, enableRtl: true }, elem);
            expect(listObj.element.parentElement.classList).toContain('e-rtl');
            listObj.enableRtl = false;
            listObj.dataBind();
            expect(listObj.element.parentElement.classList).not.toContain('e-rtl');
            listObj.enableRtl = true;
            listObj.dataBind();
            expect(listObj.element.parentElement.classList).toContain('e-rtl');
        });

        it('Enabled', () => {
            listObj = new ListBox({ dataSource: data, enabled: false }, elem);
            expect(listObj.list.classList).toContain('e-disabled');
            listObj.enabled = true;
            listObj.dataBind();
            expect(listObj.list.classList).not.toContain('e-disabled');
        });

        it('Value', () => {
            listObj = new ListBox({ dataSource: data, selectionSettings: { showCheckbox: true, showSelectAll: true }, value: ['JAVA', 'C#', 'C++', 'NET', 'Oracle'] }, elem);
            let ele: any = listObj.list.getElementsByClassName('e-selectall-parent')[0];
            let liEle: any = listObj.list.getElementsByClassName('e-list-item');
            expect(liEle[0].getElementsByClassName('e-frame')[0].classList).toContain('e-check');
            expect(ele.getElementsByClassName('e-frame')[0].classList).toContain('e-check');
            expect(ele.innerText).toEqual('Unselect All');
            expect(listObj.getSelectedItems().length).toEqual(5);
            listObj.value = ['C#'];
            listObj.dataBind();
            expect(liEle[1].getElementsByClassName('e-frame')[0].classList).toContain('e-check');
            expect(ele.getElementsByClassName('e-frame')[0].classList).not.toContain('e-check');
            expect(ele.innerText).toEqual('Select All');
            expect(listObj.getSelectedItems().length).toEqual(1);
        });

        it('selectionSettings', () => {
            listObj = new ListBox({ dataSource: data, selectionSettings: { showCheckbox: true, showSelectAll: true, checkboxPosition: 'Right'} }, elem);
            var ele = listObj.list.getElementsByClassName('e-selectall-parent');
            expect(listObj.list.childElementCount).toEqual(4);
            expect(ele.length).toEqual(1);
            listObj.selectionSettings.showSelectAll = false;
            listObj.dataBind();
            expect(listObj.list.childElementCount).toEqual(3);
            expect(ele.length).toEqual(0);
            listObj.selectionSettings.showSelectAll = true;
            listObj.dataBind();
            expect(listObj.list.childElementCount).toEqual(4);
            expect(ele.length).toEqual(1);
            ele = listObj.list;
            expect(ele.classList).toContain('e-right');
            listObj.selectionSettings.checkboxPosition = 'Left';
            listObj.dataBind();
            expect(ele.classList).not.toContain('e-right');
        });

        it('allowFiltering', () => {
            listObj = new ListBox({
                dataSource: data, allowFiltering: true, value: ['JAVA', 'C#', 'C++', 'NET', 'Oracle'],
                filtering: function (e) {
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(data, query);
                }, selectionSettings: { showCheckbox: true, showSelectAll: true }
            }, elem);
            var ele = listObj.list.getElementsByClassName('e-input-filter')[0];
            expect(listObj.list.getElementsByClassName('e-ul')[0].childElementCount).toEqual(5);
            expect(listObj.list.getElementsByClassName('e-list-item')[0].getAttribute('data-value').charAt(0)).not.toEqual(listObj.list.getElementsByClassName('e-list-item')[1].getAttribute('data-value').charAt(0));
            ele.click();
            ele.value = "c";
            listObj.dataBind();
            listObj.keyDownStatus = true;
            listObj.onInput();
            listObj.KeyUp({
                preventDefault: function () { },
                altKey: false,
                ctrlKey: false,
                shiftKey: false,
                char: '',
                key: 'c',
                charCode: 22,
                keyCode: 67,
                which: 22,
                code: 22
            });
            expect(listObj.list.getElementsByClassName('e-ul')[0].childElementCount).toEqual(2);
            expect(listObj.list.getElementsByClassName('e-list-item')[0].getAttribute('data-value').charAt(0)).toEqual(listObj.list.getElementsByClassName('e-list-item')[1].getAttribute('data-value').charAt(0));
        });

        it('notify changes for allowFiltering', () => {
            listObj = new ListBox({ dataSource: data }, elem);
            listObj.allowFiltering = true;
            listObj.dataBind();
            listObj.filterBarPlaceholder = 'filter the list';
            listObj.dataBind();
            var ele = listObj.list.getElementsByClassName('e-input-filter')[0];
            expect(ele).not.toBeNull();
        });
    });

    describe('Angular', () => {
        let listObj: any
        let elem: HTMLElement = createElement('EJS-LISTBOX');
        beforeAll(() => {
            document.body.appendChild(elem);
        });

        afterEach(() => {
            listObj.destroy();
        });

        it('Listbox', () => {
            listObj = new ListBox({ dataSource: data, allowFiltering: true }, elem);
            expect(listObj.element.getAttribute('tabindex')).toContain('0');
            expect(listObj.element.firstElementChild.classList).toContain('e-listbox-wrapper');
            expect(listObj.getComponent(listObj.getItems()[0])).toEqual(listObj);
        });
    });

    describe('Toolbar', () => {
        let elem1: HTMLElement = createElement('input', { id: 'listbox1' });
        let elem2: HTMLElement = createElement('input', { id: 'listbox2' });
        let elem3: HTMLElement = createElement('input', { id: 'listbox3' });
        let listObj1: any;
        let listObj2: any;
        let listObj3: any;
        beforeAll(() => {
            document.body.appendChild(elem1);
            document.body.appendChild(elem2);
            document.body.appendChild(elem3);
        });

        beforeEach(() => {
            listObj1 = new ListBox({
                dataSource: data, scope: '#listbox2',
                toolbarSettings: { items: ['moveUp', 'moveDown', 'moveTo', 'moveFrom', 'moveAllTo', 'moveAllFrom'] }
            }, elem1);
            listObj2 = new ListBox({ dataSource: vegetableData }, elem2);
            listObj3 = new ListBox({ dataSource: vegetableData }, elem3);
        });

        afterEach(() => {
            listObj1.destroy();
            listObj2.destroy();
            listObj3.destroy();
        });

        it('Move To & From', () => {
            let toolChild: any = listObj1.getToolElem().children;
            // initial button should be disabled
            expect(toolChild[0].disabled).toBeTruthy();
            expect(toolChild[1].disabled).toBeTruthy();
            expect(toolChild[2].disabled).toBeTruthy();
            expect(toolChild[3].disabled).toBeTruthy();
            expect(toolChild[4].disabled).toBeFalsy();
            expect(toolChild[5].disabled).toBeFalsy();

            // Move To
            listObj1.getItems()[1].click();
            toolChild[2].click();
            expect(listObj1.getItems()[1].innerText).not.toEqual('C#');
            expect(listObj2.getItems()[11].innerText).toEqual('C#');
            expect(listObj1.getDataByValue('C#')).toBeNull();
            expect(listObj2.getDataByValue('C#').text).toEqual('C#');
            toolChild[2].click();
            expect(listObj1.getItems()[1].innerText).not.toEqual('C++');
            expect(listObj2.getItems()[12].innerText).toEqual('C++');
            expect(listObj1.getDataByValue('C++')).toBeNull();
            expect(listObj2.getDataByValue('C++').text).toEqual('C++');

            // Move From
            listObj2.getItems()[1].click();
            toolChild[3].click();
            expect(listObj2.getItems()[1].innerText).not.toEqual('Spinach');
            expect(listObj1.getItems()[3].innerText).toEqual('Spinach');
            expect(listObj2.getDataByValue('Spinach')).toBeNull();
            expect(listObj1.getDataByValue('Spinach').text).toEqual('Spinach');
            toolChild[3].click();
            expect(listObj2.getItems()[1].innerText).not.toEqual('Wheat');
            expect(listObj1.getItems()[4].innerText).toEqual('Wheat');
            expect(listObj2.getDataByValue('Wheat')).toBeNull();
            expect(listObj1.getDataByValue('Wheat').text).toEqual('Wheat');

            // Move To -> Multiple
            listObj1.clickHandler({ target: listObj1.getItems()[3], ctrlKey: true });
            toolChild[2].click();
            expect(listObj1.getItems()[1].innerText).not.toEqual('NET');
            expect(listObj2.getItems()[11].innerText).toEqual('NET');
            expect(listObj1.getDataByValue('NET')).toBeNull();
            expect(listObj2.getDataByValue('NET').text).toEqual('NET');
            expect(listObj1.getItems()[2].innerText).not.toEqual('Spinach');
            expect(listObj2.getItems()[12].innerText).toEqual('Spinach');
            expect(listObj1.getDataByValue('Spinach')).toBeNull();
            expect(listObj2.getDataByValue('Spinach').text).toEqual('Spinach');

            // Move From -> Multiple
            listObj2.clickHandler({ target: listObj2.getItems()[6], ctrlKey: true });
            toolChild[3].click();
            expect(listObj2.getItems()[1].innerText).not.toEqual('Yarrow');
            expect(listObj1.getItems()[3].innerText).toEqual('Yarrow');
            expect(listObj2.getDataByValue('Yarrow')).toBeNull();
            expect(listObj1.getDataByValue('Yarrow').text).toEqual('Yarrow');
            expect(listObj2.getItems()[6].innerText).not.toEqual('Garlic');
            expect(listObj1.getItems()[4].innerText).toEqual('Garlic');
            expect(listObj2.getDataByValue('Garlic')).toBeNull();
            expect(listObj1.getDataByValue('Garlic').text).toEqual('Garlic');
        });

        it('Move All To & From', () => {
            let toolChild: any = listObj1.getToolElem().children;
            // Move All To
            toolChild[4].click();
            expect(listObj1.ulElement.childElementCount).toEqual(1);
            expect(listObj1.ulElement.innerText).toEqual('No records found');
            expect(listObj2.ulElement.childElementCount).toEqual(16);
            expect(toolChild[4].disabled).toBeTruthy();
            expect(listObj2.listData[11].text).toEqual('JAVA');
            expect(listObj2.listData[15].text).toEqual('Oracle');

            // Move All From
            toolChild[5].click();
            expect(listObj2.ulElement.childElementCount).toEqual(1);
            expect(listObj2.ulElement.innerText).toEqual('No records found');
            expect(listObj1.ulElement.childElementCount).toEqual(16);
            expect(toolChild[5].disabled).toBeTruthy();
            expect(listObj1.listData[0].text).toEqual('Cabbage');
            expect(listObj1.listData[15].text).toEqual('Oracle');
        });

        it('Move Up & Down', () => {
            let toolChild: any = listObj1.getToolElem().children;
            // Move Up
            listObj1.getItems()[2].click();
            toolChild[0].click();
            expect(listObj1.getItems()[1].innerText).toEqual('C++');
            expect(listObj1.getItems()[2].innerText).toEqual('C#');
            expect(listObj1.jsonData[1].text).toEqual('C++');
            expect(listObj1.jsonData[2].text).toEqual('C#');
            toolChild[0].click();
            expect(listObj1.getItems()[0].innerText).toEqual('C++');
            expect(listObj1.getItems()[1].innerText).toEqual('JAVA');
            expect(listObj1.jsonData[0].text).toEqual('C++');
            expect(listObj1.jsonData[1].text).toEqual('JAVA');
            expect(toolChild[0].disabled).toBeTruthy();

            // Move Down
            toolChild[1].click();
            expect(listObj1.getItems()[0].innerText).toEqual('JAVA');
            expect(listObj1.getItems()[1].innerText).toEqual('C++');
            expect(listObj1.jsonData[0].text).toEqual('JAVA');
            expect(listObj1.jsonData[1].text).toEqual('C++');
            listObj1.height = '150'; // scroll while reordering
            listObj1.dataBind();
            listObj1.getItems()[3].click();
            toolChild[1].click();
            expect(listObj1.getItems()[3].innerText).toEqual('Oracle');
            expect(listObj1.getItems()[4].innerText).toEqual('NET');
            expect(listObj1.jsonData[3].text).toEqual('Oracle');
            expect(listObj1.jsonData[4].text).toEqual('NET');
            expect(toolChild[1].disabled).toBeTruthy();
            expect(listObj1.list.scrollTop).toBeGreaterThan(0);
        });

        it('Move To & From by key', () => {
            // Move To
            listObj1.getItems()[1].click();
            listObj1.keyDownHandler({ keyCode: 39, ctrlKey: true, preventDefault: () => { } });
            expect(listObj1.getItems()[1].innerText).not.toEqual('C#');
            expect(listObj2.getItems()[11].innerText).toEqual('C#');
            expect(listObj1.getDataByValue('C#')).toBeNull();
            expect(listObj2.getDataByValue('C#').text).toEqual('C#');
            listObj1.keyDownHandler({ keyCode: 39, ctrlKey: true, preventDefault: () => { } });
            expect(listObj1.getItems()[1].innerText).not.toEqual('C++');
            expect(listObj2.getItems()[12].innerText).toEqual('C++');
            expect(listObj1.getDataByValue('C++')).toBeNull();
            expect(listObj2.getDataByValue('C++').text).toEqual('C++');

            // Move From
            listObj2.getItems()[1].click();
            listObj1.keyDownHandler({ keyCode: 37, ctrlKey: true, preventDefault: () => { } });
            expect(listObj2.getItems()[1].innerText).not.toEqual('Spinach');
            expect(listObj1.getItems()[3].innerText).toEqual('Spinach');
            expect(listObj2.getDataByValue('Spinach')).toBeNull();
            expect(listObj1.getDataByValue('Spinach').text).toEqual('Spinach');
            listObj1.keyDownHandler({ keyCode: 37, ctrlKey: true, preventDefault: () => { } });
            expect(listObj2.getItems()[1].innerText).not.toEqual('Wheat');
            expect(listObj1.getItems()[4].innerText).toEqual('Wheat');
            expect(listObj2.getDataByValue('Wheat')).toBeNull();
            expect(listObj1.getDataByValue('Wheat').text).toEqual('Wheat');

            // Move To -> Multiple
            listObj1.clickHandler({ target: listObj1.getItems()[3], ctrlKey: true });
            listObj1.keyDownHandler({ keyCode: 39, ctrlKey: true, preventDefault: () => { } });
            expect(listObj1.getItems()[1].innerText).not.toEqual('NET');
            expect(listObj2.getItems()[11].innerText).toEqual('NET');
            expect(listObj1.getDataByValue('NET')).toBeNull();
            expect(listObj2.getDataByValue('NET').text).toEqual('NET');
            expect(listObj1.getItems()[2].innerText).not.toEqual('Spinach');
            expect(listObj2.getItems()[12].innerText).toEqual('Spinach');
            expect(listObj1.getDataByValue('Spinach')).toBeNull();
            expect(listObj2.getDataByValue('Spinach').text).toEqual('Spinach');

            // Move From -> Multiple
            listObj2.clickHandler({ target: listObj2.getItems()[6], ctrlKey: true });
            listObj1.keyDownHandler({ keyCode: 37, ctrlKey: true, preventDefault: () => { } });
            expect(listObj2.getItems()[1].innerText).not.toEqual('Yarrow');
            expect(listObj1.getItems()[3].innerText).toEqual('Yarrow');
            expect(listObj2.getDataByValue('Yarrow')).toBeNull();
            expect(listObj1.getDataByValue('Yarrow').text).toEqual('Yarrow');
            expect(listObj2.getItems()[6].innerText).not.toEqual('Garlic');
            expect(listObj1.getItems()[4].innerText).toEqual('Garlic');
            expect(listObj2.getDataByValue('Garlic')).toBeNull();
            expect(listObj1.getDataByValue('Garlic').text).toEqual('Garlic');
        });

        it('Move All To & From by key', () => {
            let toolChild: any = listObj1.getToolElem().children;
            // Move All To
            listObj1.keyDownHandler({ keyCode: 39, shiftKey: true, ctrlKey: true, preventDefault: () => { } });
            expect(listObj1.ulElement.childElementCount).toEqual(1);
            expect(listObj1.ulElement.innerText).toEqual('No records found');
            expect(listObj2.ulElement.childElementCount).toEqual(16);
            expect(toolChild[4].disabled).toBeTruthy();
            expect(listObj2.listData[11].text).toEqual('JAVA');
            expect(listObj2.listData[15].text).toEqual('Oracle');

            // Move All From
            listObj1.keyDownHandler({ keyCode: 37, shiftKey: true, ctrlKey: true, preventDefault: () => { } });
            expect(listObj2.ulElement.childElementCount).toEqual(1);
            expect(listObj2.ulElement.innerText).toEqual('No records found');
            expect(listObj1.ulElement.childElementCount).toEqual(16);
            expect(toolChild[5].disabled).toBeTruthy();
            expect(listObj1.listData[0].text).toEqual('Cabbage');
            expect(listObj1.listData[15].text).toEqual('Oracle');
        });

        it('Move Up & Down by key', () => {
            let toolChild: any = listObj1.getToolElem().children;
            // Move Up
            listObj1.getItems()[2].click();
            listObj1.keyDownHandler({ keyCode: 38, shiftKey: true, ctrlKey: true, preventDefault: () => { } });
            expect(listObj1.getItems()[1].innerText).toEqual('C++');
            expect(listObj1.getItems()[2].innerText).toEqual('C#');
            expect(listObj1.jsonData[1].text).toEqual('C++');
            expect(listObj1.jsonData[2].text).toEqual('C#');
            listObj1.keyDownHandler({ keyCode: 38, shiftKey: true, ctrlKey: true, preventDefault: () => { } });
            expect(listObj1.getItems()[0].innerText).toEqual('C++');
            expect(listObj1.getItems()[1].innerText).toEqual('JAVA');
            expect(listObj1.jsonData[0].text).toEqual('C++');
            expect(listObj1.jsonData[1].text).toEqual('JAVA');
            expect(toolChild[0].disabled).toBeTruthy();

            // Move Down
            listObj1.keyDownHandler({ keyCode: 40, shiftKey: true, ctrlKey: true, preventDefault: () => { } });
            expect(listObj1.getItems()[0].innerText).toEqual('JAVA');
            expect(listObj1.getItems()[1].innerText).toEqual('C++');
            expect(listObj1.jsonData[0].text).toEqual('JAVA');
            expect(listObj1.jsonData[1].text).toEqual('C++');
            listObj1.height = '150'; // scroll while reordering
            listObj1.dataBind();
            listObj1.getItems()[3].click();
            listObj1.keyDownHandler({ keyCode: 40, shiftKey: true, ctrlKey: true, preventDefault: () => { } });
            expect(listObj1.getItems()[3].innerText).toEqual('Oracle');
            expect(listObj1.getItems()[4].innerText).toEqual('NET');
            expect(listObj1.jsonData[3].text).toEqual('Oracle');
            expect(listObj1.jsonData[4].text).toEqual('NET');
            expect(toolChild[1].disabled).toBeTruthy();
            expect(listObj1.list.scrollTop).toBeGreaterThan(0);
        });

        it('MoveTo public method', () => {
            listObj1.moveTo(['JAVA', 'C#'], 1);
            expect(listObj1.getItems().length).toEqual(3);
            listObj1.setProperties({ selectionSettings: {showCheckbox: true} });
            listObj1.moveTo(['C++', 'Oracle'], 1);
        });

        it('MoveAllTo public method', () => {
            listObj1.moveAllTo();
            expect(listObj1.getItems().length).toEqual(0);
        });

        it('notify changes for scope', () => {
            listObj1.scope = '#listbox3';
            listObj1.dataBind();
        });

        it('notify changes for scope with allowDragAndDrop', () => {
            listObj1.allowDragAndDrop = true;
            listObj1.scope = '#listbox3';
            listObj1.dataBind();
        });
    });

    describe('Toolbar with sorting', () => {
        let elem1: HTMLElement = createElement('input', { id: 'listbox1-sort' });
        let elem2: HTMLElement = createElement('input', { id: 'listbox2-sort' });
        let listObj1: any;
        let listObj2: any;
        beforeAll(() => {
            document.body.appendChild(elem1);
            document.body.appendChild(elem2);
        });

        beforeEach(() => {
            listObj1 = new ListBox({
                dataSource: data, scope: '#listbox2-sort', sortOrder: 'Ascending',
                toolbarSettings: { items: ['moveUp', 'moveDown', 'moveTo', 'moveFrom', 'moveAllTo', 'moveAllFrom'] }
            }, elem1);
            listObj2 = new ListBox({ dataSource: vegetableData, sortOrder: 'Ascending' }, elem2);
        });

        afterEach(() => {
            listObj1.destroy();
            listObj2.destroy();
        });

        it('Move To & From', () => {
            let toolChild: any = listObj1.getToolElem().children;
            // Move To
            listObj1.getItems()[1].click();
            toolChild[2].click();
            expect(listObj2.getItems()[1].innerText).toEqual('C++');
            expect(listObj1.getDataByValue('C++')).toBeNull();
            expect(listObj2.jsonData[11].text).toEqual('C++');
            expect(listObj2.sortedData[1].text).toEqual('C++');

            listObj2.getItems()[0].click();
            toolChild[3].click();
            expect(listObj1.getItems()[0].innerText).toEqual('Bean');
            expect(listObj2.getDataByValue('Bean')).toBeNull();
            expect(listObj1.jsonData[4].text).toEqual('Bean');
            expect(listObj1.sortedData[0].text).toEqual('Bean');
        });

        it('Move All To & From', () => {
            let toolChild: any = listObj1.getToolElem().children;
            // Move To
            toolChild[4].click();
            expect(listObj2.getItems()[0].innerText).toEqual('Bean');
            expect(listObj2.getItems()[1].innerText).toEqual('C#');
            expect(listObj1.jsonData.length).toEqual(0);
            expect(listObj2.jsonData[11].text).toEqual('C#');
            expect(listObj2.sortedData[0].text).toEqual('Bean');
            expect(listObj2.sortedData[1].text).toEqual('C#');

            toolChild[5].click();
            expect(listObj1.getItems()[2].innerText).toEqual('C++');
            expect(listObj1.getItems()[3].innerText).toEqual('Cabbage');
            expect(listObj2.jsonData.length).toEqual(0);
        });
    });

    describe('Toolbar', () => {
        let elem1: HTMLElement = createElement('input');
        let listObj1: any;
        beforeAll(() => {
            document.body.appendChild(elem1);
        });

        beforeEach(() => {
            listObj1 = new ListBox({
                dataSource: data,
                toolbarSettings: { items: ['moveUp', 'moveDown'] }
            }, elem1);
        });

        afterEach(() => {
            listObj1.destroy();
        });

        it('Move Up & Down with single lisbox', () => {
            let toolChild: any = listObj1.getToolElem().children;
            // Move Up
            listObj1.getItems()[2].click();
            listObj1.keyDownHandler({ keyCode: 38, shiftKey: true, ctrlKey: true, preventDefault: () => { } });
            expect(listObj1.getItems()[1].innerText).toEqual('C++');
            expect(listObj1.getItems()[2].innerText).toEqual('C#');
            expect(listObj1.jsonData[1].text).toEqual('C++');
            expect(listObj1.jsonData[2].text).toEqual('C#');
            listObj1.keyDownHandler({ keyCode: 38, shiftKey: true, ctrlKey: true, preventDefault: () => { } });
            expect(listObj1.getItems()[0].innerText).toEqual('C++');
            expect(listObj1.getItems()[1].innerText).toEqual('JAVA');
            expect(listObj1.jsonData[0].text).toEqual('C++');
            expect(listObj1.jsonData[1].text).toEqual('JAVA');
            expect(toolChild[0].disabled).toBeTruthy();

            // Move Down
            listObj1.keyDownHandler({ keyCode: 40, shiftKey: true, ctrlKey: true, preventDefault: () => { } });
            expect(listObj1.getItems()[0].innerText).toEqual('JAVA');
            expect(listObj1.getItems()[1].innerText).toEqual('C++');
            expect(listObj1.jsonData[0].text).toEqual('JAVA');
            expect(listObj1.jsonData[1].text).toEqual('C++');
            listObj1.height = '150'; // scroll while reordering
            listObj1.dataBind();
            listObj1.getItems()[3].click();
            listObj1.keyDownHandler({ keyCode: 40, shiftKey: true, ctrlKey: true, preventDefault: () => { } });
            expect(listObj1.getItems()[3].innerText).toEqual('Oracle');
            expect(listObj1.getItems()[4].innerText).toEqual('NET');
            expect(listObj1.jsonData[3].text).toEqual('Oracle');
            expect(listObj1.jsonData[4].text).toEqual('NET');
            expect(toolChild[1].disabled).toBeTruthy();
            expect(listObj1.list.scrollTop).toBeGreaterThan(0);
        });
    });

    describe('Methods', () => {
        let elem: HTMLElement = createElement('input');
        beforeAll(() => {
            document.body.appendChild(elem);
        });

        afterEach(() => {
            listObj.destroy();
        });

        it('EnableItems', () => {
            listObj = new ListBox({ dataSource: data }, elem);
            listObj.enableItems(['JAVA', 'NET'], false);
            expect(listObj.getItems()[0].classList).toContain(cssClass.disabled);
            expect(listObj.getItems()[3].classList).toContain(cssClass.disabled);
            listObj.enableItems(['JAVA', 'NET']);
            expect(listObj.getItems()[0].classList).not.toContain(cssClass.disabled);
            expect(listObj.getItems()[3].classList).not.toContain(cssClass.disabled);
        });

        it('SelectItems', () => {
            listObj = new ListBox({ dataSource: data }, elem);
            listObj.selectItems(['JAVA', 'NET']);
            expect(listObj.getItems()[0].classList).toContain(cssClass.selected);
            expect(listObj.getItems()[3].classList).toContain(cssClass.selected);
            expect(JSON.stringify(listObj.value)).toEqual(JSON.stringify(['JAVA', 'NET']));
            listObj.selectItems(['JAVA', 'NET'], false);
            expect(listObj.getItems()[0].classList).not.toContain(cssClass.selected);
            expect(listObj.getItems()[3].classList).not.toContain(cssClass.selected);
            expect(listObj.value.length).toEqual(0);
        });

        it('SelectAll', () => {
            listObj = new ListBox({ dataSource: data }, elem);
            listObj.selectAll();
            expect(listObj.getSelectedItems().length).toEqual(5);
            expect(JSON.stringify(listObj.value)).toEqual(JSON.stringify(['JAVA', 'C#', 'C++', 'NET', 'Oracle']));
            listObj.selectAll(false);
            expect(listObj.getSelectedItems().length).toEqual(0);
            expect(listObj.value.length).toEqual(0);
        });

        it('SelectItems with Checkbox', () => {
            listObj = new ListBox({ dataSource: data, selectionSettings: { showCheckbox: true, showSelectAll: true } }, elem);
            let ele: any = listObj.list.getElementsByClassName('e-selectall-parent')[0];
            let liEle: any = listObj.list.getElementsByClassName('e-list-item');
            liEle[2].click();
            liEle[3].click();
            liEle[4].click();
            listObj.selectItems(['JAVA', 'C#']);
            expect(ele.getElementsByClassName('e-frame')[0].classList).toContain('e-check');
            expect(ele.innerText).toEqual('Unselect All');
            expect(liEle[0].getElementsByClassName('e-frame')[0].classList).toContain('e-check');
            expect(liEle[2].getElementsByClassName('e-frame')[0].classList).toContain('e-check');
            expect(listObj.getSelectedItems().length).toEqual(5);
            listObj.selectItems(['JAVA', 'C#'], false);
            expect(ele.getElementsByClassName('e-frame')[0].classList).not.toContain('e-check');
            expect(ele.innerText).toEqual('Select All');
            expect(liEle[0].getElementsByClassName('e-frame')[0].classList).not.toContain('e-check');
            expect(liEle[2].getElementsByClassName('e-frame')[0].classList).toContain('e-check');
            expect(listObj.getSelectedItems().length).toEqual(3);
        });

        it('formResetHandler with Checkbox', () => {
            listObj = new ListBox({ dataSource: data }, elem);
            listObj.formResetHandler();
        });

        it('getPersistData with Checkbox', () => {
            listObj = new ListBox({ dataSource: data }, elem);
            listObj.getPersistData();
        });
    });

    describe('Keyboard', () => {
        let elem: HTMLElement = createElement('input');
        beforeAll(() => {
            document.body.appendChild(elem);
        });

        afterEach(() => {
            listObj.destroy();
        });

        it('Selection', () => {
            listObj = new ListBox({ dataSource: data }, elem);
            listObj.keyDownHandler({ keyCode: 40, preventDefault: () => { } });
            expect(listObj.getItems()[0].classList).toContain(cssClass.selected);
            listObj.keyDownHandler({ keyCode: 40, ctrlKey: true, preventDefault: () => { } });
            expect(listObj.getItems()[1].classList).toContain('e-focused');
            listObj.keyDownHandler({ keyCode: 32, preventDefault: () => { } });
            expect(listObj.getItems()[1].classList).toContain(cssClass.selected);
            listObj.keyDownHandler({ keyCode: 32, ctrlKey: true, preventDefault: () => { } });
            expect(listObj.getItems()[1].classList).not.toContain(cssClass.selected);
            listObj.keyDownHandler({ keyCode: 40, shiftKey: true, preventDefault: () => { } });
            expect(listObj.getItems()[0].classList).not.toContain(cssClass.selected);
            expect(listObj.getItems()[1].classList).toContain(cssClass.selected);
            expect(listObj.getItems()[2].classList).toContain(cssClass.selected);
            listObj.keyDownHandler({ keyCode: 40, preventDefault: () => { } });
            expect(listObj.getSelectedItems().length).toEqual(1);
            listObj.keyDownHandler({ keyCode: 65, ctrlKey: true, preventDefault: () => { } });
            expect(listObj.getSelectedItems().length).toEqual(5);
            listObj.keyDownHandler({ keyCode: 38, preventDefault: () => { } });
            expect(listObj.getSelectedItems().length).toEqual(1);
            listObj.enableItems(['C++'], false);
            listObj.keyDownHandler({ keyCode: 38, preventDefault: () => { } });
            expect(listObj.getItems()[1].classList).toContain(cssClass.selected);
            listObj.keyDownHandler({ keyCode: 40, preventDefault: () => { } });
            expect(listObj.getItems()[3].classList).toContain(cssClass.selected);
            listObj.selectionSettings.showCheckbox =  true;
            listObj.keyDownHandler({ keyCode: 36, shiftKey: true, ctrlKey: true,  preventDefault: () => { } });
        });

        it('Ctrl + A Keydown Action Should Not Select All in Single Mode', () => {
            listObj = new ListBox({ dataSource: data, selectionSettings: { mode: 'Single' } }, elem);
            listObj.keyDownHandler({ keyCode: 65, ctrlKey: true, preventDefault: () => {} });
            expect(listObj.getSelectedItems().length).toEqual(0);
        });
    });

    describe('Drag and Drop', () => {
        let elem: HTMLElement = createElement('input');
        let elem1: HTMLElement = createElement('input1');
        let listObj1: any; let listObj: any;
        let mouseEventArs: any = {
            preventDefault: (): void => { },
            stopImmediatePropagation: (): void => { },
            target: null,
            relatedTarget: null,
            type: null,
            shiftKey: false,
            ctrlKey: false,
            offset: Number
        };
        let helper: Element = createElement('div', {className: 'e-listbox-wrapper e-wrapper e-lib e-sortableclone'});
        beforeAll(() => {
            document.body.appendChild(elem);
            document.body.appendChild(elem1);
            document.body.appendChild(helper);
        });

        afterEach(() => {
            listObj.destroy();
            if (listObj1) {
                listObj1.destroy();
            }
        });

        it('single listbox drag and drop action', () => {
            listObj = new ListBox({ dataSource: data, allowDragAndDrop: true, fields: { value: 'value', text: 'text', groupBy: 'icon' } }, elem);
            let listItem: any = listObj.list.querySelectorAll('.e-list-item');
            li = listObj.getItems();
            li[0].click();
            listItem[0].classList.add('e-grabbed');
            let dragArgs: any = { bindEvents: null, dragElement: listItem[0], element: listObj.element, event: mouseEventArs, name: 'dragStart', target: listItem[0] };
            listObj.triggerDragStart(dragArgs);
            dragArgs = { element: listObj.element, event: mouseEventArs, name: 'drag', target: listItem[0] };
            listObj.triggerDrag(dragArgs);
            dragArgs = { cancel: false, currentIndex: 3, droppedElement: listItem[0], handled: false, helper: helper, name: 'beforeDrop',
                 target: listItem[2], previousIndex: 0
            };
            listObj.beforeDragEnd(dragArgs);
            dragArgs.droppedElement = listItem[2];
            dragArgs.event = mouseEventArs; dragArgs.name = 'drop';
            listObj.dragEnd(dragArgs);
        });

        it('single listbox drag and drop action with Filtering', () => {
            listObj = new ListBox({ dataSource: data, allowFiltering: true,
                beforeDrop: (args: any) => {
                    args.items = [ { id: 'list4', value: '4', text: 'NET', icon: 'icon' } ];
                },
                allowDragAndDrop: true, fields: { value: 'value', text: 'text', groupBy: 'icon' } }, elem);
            let listItem: any = listObj.list.querySelectorAll('.e-list-item');
            li = listObj.getItems();
            li[0].click();
            listItem[0].classList.add('e-grabbed');
            let dragArgs: any = { bindEvents: null, dragElement: listItem[0], element: listObj.element, event: mouseEventArs, name: 'dragStart', target: listItem[0] };
            listObj.triggerDragStart(dragArgs);
            dragArgs = { element: listObj.element, event: mouseEventArs, name: 'drag', target: listItem[0] };
            listObj.triggerDrag(dragArgs);
            dragArgs = { cancel: false, currentIndex: 3, droppedElement: listItem[0], handled: false, helper: helper, name: 'beforeDrop',
                 target: listItem[2], previousIndex: 0
            };
            listObj.beforeDragEnd(dragArgs);
            dragArgs.droppedElement = listItem[2];
            dragArgs.event = mouseEventArs; dragArgs.name = 'drop';
            listObj.dragEnd(dragArgs);
        });

        it('Multiple listbox drag and drop action', () => {
            listObj = new ListBox({ dataSource: data, allowDragAndDrop: true, fields: { text: 'text', groupBy: 'icon' } }, elem);
            listObj1 = new ListBox({ dataSource: vegetableData, allowDragAndDrop: true, sortOrder: 'Ascending' }, elem1);
            let listItem: any = listObj.list.querySelectorAll('.e-list-item');
            let listItem1: any = listObj1.list.querySelectorAll('.e-list-item');
            listItem[0].classList.add('e-grabbed');
            let dragArgs: any = { bindEvents: null, dragElement: listItem[0], element: listObj.element, event: mouseEventArs, name: 'dragStart', target: listItem[0] };
            listObj.triggerDragStart(dragArgs);
            dragArgs = { element: listObj.element, event: mouseEventArs, name: 'drag', target: listItem[0] };
            listObj.triggerDrag(dragArgs);
            dragArgs = { cancel: false, currentIndex: 3, droppedElement: listItem[0], handled: false, helper: helper, name: 'beforeDrop',
                target: listItem1[2], previousIndex: 0, element: listObj1.list
            };
            listObj.beforeDragEnd(dragArgs);
            dragArgs.event = mouseEventArs; dragArgs.name = 'drop'; dragArgs.droppedElement = listItem1[2];
            listObj.dragEnd(dragArgs);
        });
        it('Multiple listbox drag and drop action with empty item', () => {
            listObj = new ListBox({ dataSource: eData, allowDragAndDrop: true, fields: { text: 'text', groupBy: 'icon' } }, elem);
            listObj1 = new ListBox({ dataSource: vegetableData, allowDragAndDrop: true, sortOrder: 'Ascending' }, elem1);
            let listItem: any = listObj.list.querySelectorAll('.e-list-item');
            let listItem1: any = listObj1.list.querySelectorAll('.e-list-item');
            listItem[0].classList.add('e-grabbed');
            let dragArgs: any = { bindEvents: null, dragElement: listItem[0], element: listObj.element, event: mouseEventArs, name: 'dragStart', target: listItem[0] };
            listObj.triggerDragStart(dragArgs);
            dragArgs = { element: listObj.element, event: mouseEventArs, name: 'drag', target: listItem[0] };
            listObj.triggerDrag(dragArgs);
            dragArgs = { cancel: false, currentIndex: 3, droppedElement: listItem[0], handled: false, helper: helper, name: 'beforeDrop',
                target: listItem1[2], previousIndex: 0, element: listObj1.list
            };
            listObj.beforeDragEnd(dragArgs);
            dragArgs.event = mouseEventArs; dragArgs.name = 'drop'; dragArgs.droppedElement = listItem1[2];
            listObj.dragEnd(dragArgs);
        });
        it('Multiple listbox drag and drop action with template', () => {
            listObj = new ListBox({
                dataSource: data, allowDragAndDrop: true, fields: { text: 'text', groupBy: 'icon' },
                itemTemplate: '<div class="ename"> ${text} </div>'
            }, elem);
            listObj1 = new ListBox({
                dataSource: eData, allowDragAndDrop: true, sortOrder: 'Ascending',
                itemTemplate: '<div class="ename"> ${text} </div>'
            }, elem1);
            let listItem: any = listObj.list.querySelectorAll('.e-list-item');
            let listItem1: any = listObj1.list.querySelectorAll('.e-list-item');
            listItem[0].classList.add('e-grabbed');
            let dragArgs: any = { bindEvents: null, dragElement: listItem[0], element: listObj.element, event: mouseEventArs, name: 'dragStart', target: listItem[0] };
            listObj.triggerDragStart(dragArgs);
            dragArgs = { element: listObj.element, event: mouseEventArs, name: 'drag', target: listItem[0] };
            listObj.triggerDrag(dragArgs);
            dragArgs = { cancel: false, currentIndex: 3, droppedElement: listItem[0], handled: false, helper: helper, name: 'beforeDrop',
                target: listItem1[2], previousIndex: 0, element: listObj1.list
            };
            listObj.beforeDragEnd(dragArgs);
            dragArgs.event = mouseEventArs; dragArgs.name = 'drop'; dragArgs.droppedElement = listItem1[2];
            listObj.dragEnd(dragArgs);
        });
        it('Multiple listbox drag and drop action with empty datasource', () => {
            listObj = new ListBox({ dataSource: data, allowDragAndDrop: true, fields: { text: 'text', groupBy: 'icon' } }, elem);
            listObj1 = new ListBox({ allowDragAndDrop: true, sortOrder: 'Ascending' }, elem1);
            let listItem: any = listObj.list.querySelectorAll('.e-list-item');
            let listItem1: any = listObj1.element.parentElement;
            listItem[0].classList.add('e-grabbed');
            let dragArgs: any = { bindEvents: null, dragElement: listItem[0], element: listObj.element, event: mouseEventArs, name: 'dragStart', target: listItem[0] };
            listObj.triggerDragStart(dragArgs);
            dragArgs = { element: listObj.element, event: mouseEventArs, name: 'drag', target: listItem1 };
            listObj.triggerDrag(dragArgs);
            dragArgs = { cancel: false, currentIndex: 3, droppedElement: listItem[0], handled: false, helper: helper, name: 'beforeDrop',
                target: listItem1, previousIndex: 0, element: listObj1.list
            };
            listObj.beforeDragEnd(dragArgs);
            dragArgs.event = mouseEventArs; dragArgs.name = 'drop'; dragArgs.droppedElement = listItem[0];
            listObj.dragEnd(dragArgs);
        });
        it('Multiple listbox drag and drop action with empty datasource and template', () => {
            listObj = new ListBox({ dataSource: data, allowDragAndDrop: true, fields: { text: 'text', groupBy: 'icon' },
            itemTemplate: '<div class="ename"> ${text} </div>' }, elem);
            listObj1 = new ListBox({ allowDragAndDrop: true, sortOrder: 'Ascending',
            itemTemplate: '<div class="ename"> ${text} </div>' }, elem1);
            let listItem: any = listObj.list.querySelectorAll('.e-list-item');
            let listItem1: any = listObj1.element.parentElement;
            listItem[0].classList.add('e-grabbed');
            let dragArgs: any = { bindEvents: null, dragElement: listItem[0], element: listObj.element, event: mouseEventArs, name: 'dragStart', target: listItem[0] };
            listObj.triggerDragStart(dragArgs);
            dragArgs = { element: listObj.element, event: mouseEventArs, name: 'drag', target: listItem1 };
            listObj.triggerDrag(dragArgs);
            dragArgs = { cancel: false, currentIndex: 3, droppedElement: listItem[0], handled: false, helper: helper, name: 'beforeDrop',
                target: listItem1, previousIndex: 0, element: listObj1.list
            };
            listObj.beforeDragEnd(dragArgs);
            dragArgs.event = mouseEventArs; dragArgs.name = 'drop'; dragArgs.droppedElement = listItem[0];
            listObj.dragEnd(dragArgs);
        });
    });

    describe('Customer Reported Bug', () => {
        let elem: HTMLElement = createElement('input');
        let elem1: HTMLElement = createElement('input', { id: 'listbox1' });
        let elem2: HTMLElement = createElement('input', { id: 'listbox2' });
        let listObj1: any;
        let listObj2: any;
        let listObj: any
        beforeAll(() => {
            document.body.appendChild(elem);
            document.body.appendChild(elem1);
            document.body.appendChild(elem2);
        });

        beforeEach(() => {
            listObj1 = new ListBox({
                enableRtl: true,
                dataSource: data, scope: '#listbox2', allowFiltering: true,
                toolbarSettings: { items: ['moveUp', 'moveDown', 'moveTo', 'moveFrom', 'moveAllTo', 'moveAllFrom'] },
                noRecordsTemplate : '<div style="padding:10px; padding-left:20%; position:relative;"> <span class = "img" > <img src="http://www.404errorpages.com/images/image001.png" height="40px", width="40px"/></span> <span style="padding:10px; position: absolute;">No records found</span></div>'
            }, elem1);
            listObj2 = new ListBox({ dataSource: vegetableData , enableRtl: true, allowFiltering: true,
                noRecordsTemplate : '<div style="padding:10px; padding-left:20%; position:relative;"> <span class = "img" > <img src="http://www.404errorpages.com/images/image001.png" height="40px", width="40px"/></span> <span style="padding:10px; position: absolute;">No records found</span></div>'
            }, elem2);
        });

        afterEach(() => {
            listObj1.destroy();
            listObj2.destroy();
        });

        it('EJ2-48312', () => {
            let vegetableData: { [key: string]: Object }[] = [];
            listObj = new ListBox({ dataSource: vegetableData , allowFiltering: true }, elem);
            var ele = listObj.list.getElementsByClassName('e-input-filter')[0];
            var clearEle = listObj.list.getElementsByClassName('e-input-group-icon')[0];
            expect(listObj.list.getElementsByClassName('e-ul')[0].childElementCount).toEqual(1);
            ele.click();
            ele.value = "c";
            listObj.dataBind();
            listObj.keyDownStatus = true;
            listObj.onInput();
            listObj.KeyUp({
                preventDefault: function () { },
                altKey: false,
                ctrlKey: false,
                shiftKey: false,
                char: '',
                key: 'c',
                charCode: 22,
                keyCode: 67,
                which: 22,
                code: 22
            });
            expect(listObj.list.getElementsByClassName('e-ul')[0].childElementCount).toEqual(1);
            ele.click();
            listObj.dataBind();
            listObj.keyDownStatus = true;
            listObj.onInput();
            listObj.KeyUp({
                preventDefault: function () { },
                altKey: false,
                ctrlKey: false,
                shiftKey: false,
                metaKey: false,
                char: '',
                key: 'Backspace',
                charCode: 0,
                keyCode: 8,
                which: 8,
                code: "Backspace"
            });
            expect(listObj.list.getElementsByClassName('e-ul')[0].childElementCount).toEqual(1);
            clearEle.click();
            expect(listObj.list.getElementsByClassName('e-ul')[0].childElementCount).toEqual(1);
            listObj.destroy();
        });

        it('toolbarSettings', () => {
            listObj1.toolbarSettings.items = ['moveUp', 'moveDown', 'moveTo', 'moveAllTo', 'moveAllFrom'];
            listObj1.dataBind();
            listObj1.toolbarSettings.position = 'Left';
            listObj1.dataBind();
        });

        it('EJ2-45800 - Items not updated in filtering while using delete button', () => {
            listObj = new ListBox({ dataSource: vegetableData , allowFiltering: true}, elem);
            var ele = listObj.list.getElementsByClassName('e-input-filter')[0];
            expect(listObj.list.getElementsByClassName('e-ul')[0].childElementCount).toEqual(11);
            ele.click();
            ele.value = "ca";
            listObj.dataBind();
            listObj.keyDownStatus = true;
            listObj.onInput();
            listObj.KeyUp({
                preventDefault: function () { },
                altKey: false,
                ctrlKey: false,
                shiftKey: false,
                char: '',
                key: 'c',
                charCode: 22,
                keyCode: 67,
                which: 22,
                code: 22
            });
            listObj.KeyUp({
                preventDefault: function () { },
                altKey: false,
                ctrlKey: false,
                shiftKey: false,
                char: '',
                key: 'a',
                charCode: 0,
                keyCode: 65,
                which: 65,
                code: 65
            });
            expect(listObj.list.getElementsByClassName('e-ul')[0].childElementCount).toEqual(1);
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                stopPropagation: (): void => { /** NO Code */ },
                keyCode: 46,
                metaKey: false
            };
            listObj.filterInput.value = "c";
            listObj.onKeyDown(keyEventArgs);
            listObj.onInput()
            listObj.KeyUp(keyEventArgs);
            expect(listObj.list.getElementsByClassName('e-ul')[0].childElementCount).toEqual(2);
            listObj.destroy();
        });

        it('EJ2-47596 - Provided showSpinner and hideSpinner method support', () => {
            listObj = new ListBox({
                dataSource: data
            }, elem);
            listObj.showSpinner();
            // expect(listObj.list.children[2].children[0].classList.contains('e-spin-show')).toBeTruthy();
            listObj.hideSpinner();
            // expect(listObj.list.children[2].children[0].classList.contains('e-spin-show')).toBeFalsy();
            listObj.destroy();
        });

        it('EJ2-50548 - Toolbar settings not aligned properly when Rtl mode is applied', () => {
            expect(listObj1.list.nextElementSibling.classList.contains('e-rtl')).toBeFalsy();
            expect(listObj1.list.classList.contains('e-rtl')).toBeTruthy();
        });

        it('EJ2-51528 - getDataList not updated properly after removing the items', () => {
            listObj = new ListBox({ dataSource: vegetableData }, elem);
            expect(listObj.getDataList().length).toEqual(11);
            listObj.removeItem(['Garlic', 'Nopal' ]);
            expect(listObj.getDataList().length).toEqual(9);
            listObj.removeItem();
        });
        
        it('EJ2-38419-Need to provide noRecordsTemplate support in Listbox', () => {
            let toolChild: any = listObj1.getToolElem().children;
            toolChild[4].click();
            expect(listObj1.ulElement.childElementCount).toEqual(1);
            expect(listObj1.list.getElementsByClassName('e-ul')[0].children[0].children[1].textContent).toEqual('No records found');
            expect(listObj1.list.getElementsByClassName('e-ul')[0].children[0].children[0].classList).toContain('img');
            expect(listObj2.ulElement.childElementCount).toEqual(16);
            var ele = listObj1.list.getElementsByClassName('e-input-filter')[0];
            ele.click();
            ele.value = "c";
            listObj1.dataBind();
            listObj1.keyDownStatus = true;
            listObj1.onInput();
            listObj1.KeyUp({
                preventDefault: function () { },
                altKey: false,
                ctrlKey: false,
                shiftKey: false,
                char: '',
                key: 'c',
                charCode: 22,
                keyCode: 67,
                which: 22,
                code: 22
            });
            expect(listObj1.ulElement.childElementCount).toEqual(1);
            expect(listObj1.list.getElementsByClassName('e-ul')[0].children[0].children[1].textContent).toEqual('No records found');
            expect(listObj1.list.getElementsByClassName('e-ul')[0].children[0].children[0].classList).toContain('img');
        });

        it('EJ2-61181 - RemoveItems not working properly after adding items with specific index', () => {
            listObj = new ListBox({ dataSource: vegetableData }, elem);
            let vegetable: { [key: string]: Object }[] = [
                { text: 'Potato', id: 'item12' },
            ];
            expect(listObj.ulElement.children[1].innerText).toEqual('Spinach');
            listObj.addItems(vegetable, 1);
            expect(listObj.ulElement.children[1].innerText).toEqual('Potato');
            listObj.removeItem(vegetable);
            expect(listObj.ulElement.children[1].innerText).toEqual('Spinach');
        });
        
        it('EJ2-61108 - Datasource not update properly after clearing the filtering in the dual listbox', () => {
            let toolChild: any = listObj1.getToolElem().children;
            var ele = listObj2.list.getElementsByClassName('e-input-filter')[0];
            expect(listObj2.list.getElementsByClassName('e-ul')[0].childElementCount).toEqual(11);
            ele.click();
            ele.value = "c";
            listObj2.dataBind();
            listObj2.keyDownStatus = true;
            listObj2.onInput();
            listObj2.KeyUp({
                preventDefault: function () { },
                altKey: false,
                ctrlKey: false,
                shiftKey: false,
                char: '',
                key: 'c',
                charCode: 22,
                keyCode: 67,
                which: 22,
                code: 22
            });
            toolChild[5].click();
            expect(listObj2.ulElement.childElementCount).toEqual(1);
            expect(listObj2.ulElement.innerText).toEqual('No records found');
            expect(listObj1.ulElement.childElementCount).toEqual(7);
            toolChild[4].click();
            toolChild[5].click();
            expect(listObj2.ulElement.innerText).toEqual('No records found');
            expect(listObj1.ulElement.childElementCount).toEqual(7);
            toolChild[4].click();
            toolChild[5].click();
            var ele1 =  listObj2.list.getElementsByClassName('e-input-group-icon e-clear-icon e-icons')[0];
            ele1.click();
            expect(listObj1.ulElement.childElementCount).toEqual(8);
            expect(listObj2.ulElement.childElementCount).toEqual(9);
        });

        it('EJ2-66007 - SelectItems function not work when values contain backslashes', () => {
            listObj = new ListBox({ fields: { text: 'text', value: 'value' },
              dataSource: [
                { text: 'folder1\\item1', value: 'folder1\\item1' },
                { text: 'folder1\\item2', value: 'folder1\\item2' }],
              selectionSettings: { showCheckbox: true } }, elem);
              listObj.selectItems(['folder1\\item1'], true, true);
              let liEle: any = listObj.list.getElementsByClassName('e-list-item');
              expect(liEle[0].getElementsByClassName('e-frame')[0].classList).toContain('e-check');
        });

        it('Filtering', function () {
            let datasource = ['Java']
            listObj = new ListBox({ dataSource: datasource }, elem);
            listObj.filter({dataSource: datasource});
        });

        it('905360 - Filtering updateData method with prevent default sorting', () => {
            listObj = new ListBox({
                dataSource: [
                    { text: 'McLaren F1' },
                    { text: 'Aston Martin One- 77' },
                    { text: 'Jaguar XJ220' },
                    { text: 'McLaren P1' },
                    { text: 'Ferrari LaFerrari' }
                ],
                fields: { text: 'text' },
                allowFiltering: true,
                sortOrder: 'Ascending',
                filtering: (args) => {    
                    if (args.text.length > 1) {
                        var matches = [ { text: 'McLaren Z1' }, { text: 'McLaren A1' } ];
                        args.preventDefaultAction = true;
                        args.updateData(matches, null)
                    }
                }
            }, elem);
            listObj.filterInput.value = 'mc';
            listObj.KeyUp({ keyCode: 67, ctrlKey: false, text: 'mc', preventDefault: () => { } });
            expect(listObj.liCollections.length).toEqual(2);
            expect(listObj.liCollections[0].innerText).toEqual("McLaren Z1");
        });

        it('941520 - Filtering data not properly displayed while filter with diacritic characters in Listbox.', () => {
            let data: any = [
                { text: 'Hennessey Venom', id: 'list-01' },
                { text: 'ăgatti Chiron', id: 'list-02' },
                { text: 'agatti Veyron Super Sport', id: 'list-03' }
            ];
            listObj = new ListBox({ dataSource: data, allowFiltering: true, filtering: (args) => {
                console.log('filter event triggered');
            } }, elem);
            listObj.filterInput.value = 'ă';
            listObj.KeyUp({ keyCode: 259, ctrlKey: false, text: 'ă', preventDefault: () => { } });
            expect(listObj.liCollections.length).toEqual(1);
            expect(listObj.liCollections[0].innerText).toEqual("ăgatti Chiron");
        });
    });

    describe('Coverage improvement', () => {
        let listObj: any
        let elem: HTMLElement = createElement('input', { id: 'input' });
        beforeAll(() => {
            document.body.appendChild(elem);
        });
        afterEach(() => {
            listObj.destroy();
        });

        it('allowFiltering', () => {
            listObj = new ListBox({ dataSource: data, allowFiltering: true }, elem);
            listObj.dataBind();
            expect(listObj.allowFiltering).toEqual(true);
            listObj.allowFiltering = false;
            listObj.dataBind();
            expect(listObj.allowFiltering).toEqual(false);
        });

        it('allowDragAndDrop', () => {
            listObj = new ListBox({ dataSource: data, allowDragAndDrop: true }, elem);
            expect(listObj.allowDragAndDrop).toEqual(true);
            listObj.dataBind();
            listObj.allowDragAndDrop = false;
            listObj.dataBind();
            expect(listObj.allowDragAndDrop).toEqual(false);
        });

        it('filterBarPlaceholder', () => {
            listObj = new ListBox({ dataSource: data, filterBarPlaceholder: '' }, elem);
            expect(listObj.filterBarPlaceholder).toEqual('');
            listObj.dataBind();
            listObj.filterBarPlaceholder = 'lisbox';
            listObj.allowDragAndDrop = true;
            listObj.dataBind();
            expect(listObj.filterBarPlaceholder).toEqual('lisbox');
        });

        it('getSortedList', () => {
            listObj = new ListBox({ dataSource: data, fields: { text: 'text', groupBy: 'icon' } }, elem);
            listObj.getSortedList();
        });

        it('dataSource', () => {
            listObj = new ListBox({ }, elem);
            listObj.dataSource =  data;
            listObj.dataBind();
        });

        it('SelectItems', () => {
            listObj = new ListBox({ fields: { text: 'text', value: 'value' },
              dataSource: [
                { text: 'folder1\\item1', value: 'folder1\\item1' },
                { text: 'folder1\\item2', value: 'folder1\\item2' }],
              selectionSettings: { showCheckbox: false, mode: 'Single' } }, elem);
              listObj.selectItems(['folder1\\item1'], true, true);
        });

        it('removeItem', function () {
            listObj = new ListBox({ dataSource: vegetableData, fields: { text: 'text', value: 'id' } }, elem);
            listObj.removeItem({ text: 'Cabbage', id: 'item1' });
            listObj.removeItems([{ text: 'Wheat', id: 'item3' }, { text: 'Yarrow', id: 'item4' } ]);
        });
        it('addItem', function () {
            listObj = new ListBox({ dataSource: vegetableData, fields: { text: 'text', value: 'id' } }, elem);
            listObj.addItem({ text: 'Cabbage1', id: 'item11' });
        });
        it('getDataByValues', function () {
            listObj = new ListBox({ dataSource: vegetableData, fields: { text: 'text', value: 'id' } }, elem);
            let data: any = listObj.getDataByValues(['Cabbage']);
        });
        it('getDataByElements', function () {
            let datasource = ['Java']
            listObj = new ListBox({ dataSource: datasource }, elem);
            li = listObj.getItems();
            li[0].click();
        });
    });

    describe('Null or undefined Property testing', () => {
        let elem: HTMLElement = createElement('input');
        let listObj: any
        beforeAll(() => {
            document.body.appendChild(elem);
        });
        afterEach(() => {
            listObj.destroy();
        });

        it('ListBox With allowDragAndDrop', () => {
            listObj = new ListBox({ allowDragAndDrop: null }, elem);
            expect(listObj.allowDragAndDrop).toEqual(null);
            listObj = new ListBox({ allowDragAndDrop: undefined }, elem);
            expect(listObj.allowDragAndDrop).toEqual(false);
        });

        it('ListBox With allowFiltering', () => {
            listObj = new ListBox({ allowFiltering: null }, elem);
            expect(listObj.allowFiltering).toEqual(null);
            listObj = new ListBox({ allowFiltering: undefined }, elem);
            expect(listObj.allowFiltering).toEqual(false);
        });

        it('ListBox With cssClass', () => {
            listObj = new ListBox({ cssClass: null }, elem);
            expect(listObj.cssClass).toEqual(null);
            listObj = new ListBox({ cssClass: undefined }, elem);
            expect(listObj.cssClass).toEqual('');
        });

        it('ListBox With dataSource', () => {
            listObj = new ListBox({ dataSource: null }, elem);
            expect(listObj.dataSource).toEqual(null);
            listObj = new ListBox({ dataSource: undefined }, elem);
            expect(listObj.dataSource).toEqual([]);
        });

        it('ListBox With enablePersistence', () => {
            listObj = new ListBox({ enablePersistence: null }, elem);
            expect(listObj.enablePersistence).toEqual(null);
            listObj = new ListBox({ enablePersistence: undefined }, elem);
            expect(listObj.enablePersistence).toEqual(false);
        });

        it('ListBox With enableRtl', () => {
            listObj = new ListBox({ enableRtl: null }, elem);
            expect(listObj.enableRtl).toEqual(false);
            listObj = new ListBox({ enableRtl: undefined }, elem);
            expect(listObj.enableRtl).toEqual(false);
        });

        it('ListBox With enabled', () => {
            listObj = new ListBox({ enabled: null }, elem);
            expect(listObj.enabled).toEqual(null);
            listObj = new ListBox({ enabled: undefined }, elem);
            expect(listObj.enabled).toEqual(true);
        });

        it('ListBox With fields', () => {
            listObj = new ListBox({ fields: { text: null, value: null, iconCss: null, groupBy: null } }, elem);
            expect(listObj.fields.text).toEqual('text');
            expect(listObj.fields.value).toEqual('text');
            expect(listObj.fields.iconCss).toEqual(null);
            expect(listObj.fields.groupBy).toEqual(null);
            listObj = new ListBox({ fields: { text: undefined, value: undefined, iconCss: undefined, groupBy: undefined } }, elem);
            expect(listObj.fields.text).toEqual('text');
            expect(listObj.fields.value).toEqual('text');
            expect(listObj.fields.iconCss).toEqual(undefined);
            expect(listObj.fields.groupBy).toEqual(undefined);
        });

        it('ListBox With filterBarPlaceholder', () => {
            listObj = new ListBox({ filterBarPlaceholder: null }, elem);
            expect(listObj.filterBarPlaceholder).toEqual(null);
            listObj = new ListBox({ filterBarPlaceholder: undefined }, elem);
            expect(listObj.filterBarPlaceholder).toEqual(null);
        });

        it('ListBox With filterType', () => {
            listObj = new ListBox({ filterType: null }, elem);
            expect(listObj.filterType).toEqual(null);
            listObj = new ListBox({ filterType: undefined }, elem);
            expect(listObj.filterType).toEqual('StartsWith');
        });

        it('ListBox With height', () => {
            listObj = new ListBox({ height: null }, elem);
            expect(listObj.height).toEqual(null);
            listObj = new ListBox({ height: undefined }, elem);
            expect(listObj.height).toEqual('');
        });

        it('ListBox With itemTemplate', () => {
            listObj = new ListBox({ itemTemplate: null }, elem);
            expect(listObj.itemTemplate).toEqual(null);
            listObj = new ListBox({ itemTemplate: undefined }, elem);
            expect(listObj.itemTemplate).toEqual(null);
        });

        it('ListBox With locale', () => {
            listObj = new ListBox({ locale: null }, elem);
            expect(listObj.locale).toEqual('en-US');
            listObj = new ListBox({ locale: undefined }, elem);
            expect(listObj.locale).toEqual('en-US');
        });

        it('ListBox With maximumSelectionLength', () => {
            listObj = new ListBox({ maximumSelectionLength: null }, elem);
            expect(listObj.maximumSelectionLength).toEqual(null);
            listObj = new ListBox({ maximumSelectionLength: undefined }, elem);
            expect(listObj.maximumSelectionLength).toEqual(1000);
        });

        it('ListBox With noRecordsTemplate', () => {
            listObj = new ListBox({ noRecordsTemplate: null }, elem);
            expect(listObj.noRecordsTemplate).toEqual(null);
            listObj = new ListBox({ noRecordsTemplate: undefined }, elem);
            expect(listObj.noRecordsTemplate).toEqual('No records found');
        });

        it('ListBox With selectionSettings', () => {
            listObj = new ListBox({ selectionSettings: { mode: null } }, elem);
            expect(listObj.selectionSettings.mode).toEqual(null);
            listObj = new ListBox({ selectionSettings: { mode: undefined } }, elem);
            expect(listObj.selectionSettings.mode).toEqual('Multiple');
        });

        it('ListBox With query', () => {
            listObj = new ListBox({ query: null }, elem);
            expect(listObj.query).toEqual(null);
            listObj = new ListBox({ query: undefined }, elem);
            expect(listObj.query).toEqual(null);
        });

        it('ListBox With scope', () => {
            listObj = new ListBox({ scope: null }, elem);
            expect(listObj.scope).toEqual(null);
            listObj = new ListBox({ scope: undefined }, elem);
            expect(listObj.scope).toEqual('');
        });

        it('ListBox With sortOrder', () => {
            listObj = new ListBox({ sortOrder: null }, elem);
            expect(listObj.sortOrder).toEqual(null);
            listObj = new ListBox({ sortOrder: undefined }, elem);
            expect(listObj.sortOrder).toEqual('None');
        });

        it('ListBox With toolbarSettings', () => {
            listObj = new ListBox({ toolbarSettings: { items: null, position: null } }, elem);
            expect(listObj.toolbarSettings.items).toEqual([]);
            expect(listObj.toolbarSettings.position).toEqual(null);
            listObj = new ListBox({ toolbarSettings: { items: undefined, position: undefined } }, elem);
            expect(listObj.toolbarSettings.items).toEqual([]);
            expect(listObj.toolbarSettings.position).toEqual('Right');
        });

        it('ListBox With value', () => {
            listObj = new ListBox({ value: null }, elem);
            expect(listObj.value).toEqual(null);
            listObj = new ListBox({ value: undefined }, elem);
            expect(listObj.value).toEqual([]);
        });

        it('Angular ListBox', () => {
            listObj = new ListBox({ dataSource: data, allowFiltering: true });
            listObj.isAngular = true;
            listObj.appendTo(elem);
            li = listObj.getItems();
            li[0].click();
            li[1].click();
        });
    });

    const mousedownevent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100
    });
    const mousemoveevent = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 200
    });
    const mouseupevent = new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 200
    });

    describe('Coverage improvements with form', () => {
        let form: HTMLFormElement = createElement('form', { id: 'form1' }) as HTMLFormElement;
        let elem: HTMLElement = createElement('input');
        let listObj: any
        beforeAll(() => {
            form.appendChild(elem);
            document.body.appendChild(form);
        });
        afterEach(() => {
            listObj.destroy();
        });
        it('Coverage improvements with form', () => {
            listObj = new ListBox({ dataSource: vegetableData, allowDragAndDrop: true }, elem);
        });
    });
    describe('Coverage improvements drag and drop', () => {
        let elem: HTMLElement = createElement('input');
        let listObj: any
        beforeAll(() => {
            document.body.appendChild(elem);
        });
        afterEach(() => {
            listObj.destroy();
        });
        it('ListBox With allowDragAndDrop', () => {
            listObj = new ListBox({ dataSource: vegetableData, allowDragAndDrop: true }, elem);
            let draggableElement: Element = listObj.element.parentElement.querySelector('.e-list-item');
            draggableElement.dispatchEvent(mousedownevent);
            draggableElement.dispatchEvent(mousemoveevent);
            draggableElement.dispatchEvent(mouseupevent);
        });
        it('listbox with responsive height', () => {
            listObj = new ListBox({ dataSource: data, allowFiltering: true, height: '100%' }, elem);
        });
        it('SelectItems', () => {
            listObj = new ListBox({ dataSource: data, selectionSettings: { mode: 'Single'} }, elem);
            listObj.selectItems(['JAVA', 'NET']);
            listObj.selectItems(['C#', 'Oracle']);
        });
        it('Listbox with Filtering and add items', () => {
            let vegetableData: { [key: string]: Object }[] = [];
            listObj = new ListBox({ dataSource: vegetableData , allowFiltering: true }, elem);
            var ele = listObj.list.getElementsByClassName('e-input-filter')[0];
            ele.click();
            ele.value = "c";
            listObj.dataBind();
            listObj.addItems([{ text: 'Cabb', id: 'item12' }]);
            listObj.addItem([{ text: 'Cabba', id: 'item13' }]);
            ele.value = "";
            listObj.addItems([{ text: 'Spin', id: 'item15' }]);
        });
        it('allow filtering with keycode checking', () => {
            listObj = new ListBox({ dataSource: vegetableData , allowFiltering: true }, elem);
            var ele = listObj.list.getElementsByClassName('e-input-filter')[0];
            ele.click();
            ele.value = "c";
            listObj.dataBind();
            listObj.KeyUp({
                preventDefault: function () { },
                altKey: false,
                ctrlKey: true,
                shiftKey: false,
                char: '',
                key: 'c',
                charCode: 22,
                keyCode: 65,
                which: 22,
                code: 22
            });
            (listObj as any).isSelected();
        });
        it('Validation attribute checking', () => {
            listObj = new ListBox({
                dataSource: vegetableData,
                itemTemplate: '<div class="ename"> ${text} </div>',
                allowFiltering: true }, elem);
            (listObj as any).inputFormName = 'form1';
            (listObj as any).validationAttribute(listObj.element, listObj.element.parentElement.querySelector('.e-hidden-select'));
        });
        it('Data updater checking', () => {
            let vegetableData: { [key: string]: Object }[] = [];
            listObj = new ListBox({
                dataSource: vegetableData,
                itemTemplate: '<div class="ename"> ${text} </div>',
                allowFiltering: true }, elem);
            var ele = listObj.list.getElementsByClassName('e-input-filter')[0];
            var clearEle = listObj.list.getElementsByClassName('e-input-group-icon')[0];
            expect(listObj.list.getElementsByClassName('e-ul')[0].childElementCount).toEqual(1);
            ele.click();
            ele.value = "c";
            listObj.dataBind();
            listObj.keyDownStatus = true;
            listObj.onInput();
            listObj.KeyUp({
                preventDefault: function () { },
                altKey: false,
                ctrlKey: false,
                shiftKey: false,
                char: '',
                key: 'c',
                charCode: 22,
                keyCode: 67,
                which: 22,
                code: 22
            });
            (listObj as any).isAngular = true;
            clearEle.click();
        });
        it('Item template with filtering sample', () => {
            listObj = new ListBox({ dataSource: data, itemTemplate: '<div class="ename"> ${text} </div>', allowFiltering: true }, elem);
            var ele = listObj.list.getElementsByClassName('e-input-filter')[0];
            var clearEle = listObj.list.getElementsByClassName('e-input-group-icon')[0];
            ele.click();
            ele.value = "j";
            listObj.dataBind();
            listObj.keyDownStatus = true;
            listObj.onInput();
            listObj.KeyUp({ preventDefault: function () { }, altKey: false, ctrlKey: false, shiftKey: false, char: '', key: 'j',
                charCode: 22, keyCode: 74, which: 22, code: 22 });
            expect(listObj.list.getElementsByClassName('e-input-filter')[0]).not.toBeNull();
            clearEle.click();
            expect(listObj.list.getElementsByClassName('e-input-filter')[0]).not.toBeNull();
            ele = listObj.list.getElementsByClassName('e-input-filter')[0];
            ele.click();
            ele.value = "\t\t";
            listObj.dataBind();
            listObj.dataUpdater([]);
        });
    });
    describe('Coverage improvements toolbar', () => {
        let elem1: HTMLElement = createElement('input', { id: 'listbox4' });
        let elem2: HTMLElement = createElement('input', { id: 'listbox5' });
        let listObj1: any;
        let listObj2: any;
        beforeAll(() => {
            document.body.appendChild(elem1);
            document.body.appendChild(elem2);
        });
        beforeEach(() => {
            listObj1 = new ListBox({
                dataSource: maxData, scope: '#listbox5',
                toolbarSettings: { items: ['moveUp', 'moveDown', 'moveTo', 'moveFrom', 'moveAllTo', 'moveAllFrom'] }
            }, elem1);
            listObj2 = new ListBox({ }, elem2);
        });

        afterEach(() => {
            listObj1.destroy();
            listObj2.destroy();
        });
        it('ListBox With Move Items', () => {
            listObj1.selectAll();
            listObj1.moveTo();
        });
        it('ListBox With Move Items with disabled', () => {
            listObj1.dataSource = vegetableData;
            listObj1.dataBind();
            listObj1.enableItems(['Cabbage'], false);
            listObj1.moveAllTo();
        });
        it('On Action Complete dummy', () => {
            (listObj1 as any).onActionComplete((listObj1 as any).ulElement, (listObj1 as any).jsonData, {});
        });
        it('On Action Complete data source update', () => {
            (listObj1 as any).isDataSourceUpdate = true;
            (listObj1 as any).onActionComplete((listObj1 as any).ulElement, (listObj1 as any).jsonData, {});
            (listObj1 as any).isDataSourceUpdate = false;
        });
        it('Disabled state checking', () => {
            (listObj1 as any).ulElement = null;
            (listObj1 as any).checkDisabledState(listObj1);
        });
        it('Disabled state checking datamanager', () => {
            (listObj1 as any).ulElement = null;
            (listObj1 as any).dataSource = {};
            (listObj1 as any).checkDisabledState(listObj1);
        });
        it('Clear Selection', () => {
            (listObj1 as any).clearSelection();
        });
        it('Get Valid Index', () => {
            let cli: HTMLElement = (listObj1 as any).ulElement.children[0] as HTMLElement;
            cli.classList.add('e-disabled');
            (listObj1 as any).getValidIndex(cli, 1, 41);
            (listObj1 as any).getValidIndex(cli, -1, 41);
        });
        it('Focus out handle', () => {
            let cli: HTMLElement = (listObj1 as any).ulElement.children[0] as HTMLElement;
            cli.classList.add('e-focused');
            (listObj1 as any).focusOutHandler();
        });
        it('toolbar setting position', () => {
            (listObj1 as any).setProperties({toolbarSettings: {position: 'Right'}});
        });
        it('toolbar with grouping', () => {
            listObj1.dataSource = vegetableData;
            listObj2.sortOrder = 'Descending';
            listObj1.fields = { text: 'text', groupBy: 'category' };
            listObj1.dataBind();
            listObj1.moveTo(['Cabbage', 'Spinach']);
        });

        it('Dual listbox drag and drop action with toolbar', () => {
            listObj1.allowDragAndDrop = true;
            listObj1.dataSource = data;
            listObj1.fields = { text: 'text', groupBy: 'icon' };
            listObj1.dataBind();
            listObj2.allowDragAndDrop = true;
            listObj2.dataSource = vegetableData;
            listObj2.dataBind();
            let listItem: any = listObj1.list.querySelectorAll('.e-list-item');
            let listItem1: any = listObj2.list.querySelectorAll('.e-list-item');
            listItem[0].classList.add('e-grabbed');
            let mouseEventArs: any = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                relatedTarget: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
                offset: Number
            };
            let helper: Element = createElement('div', {className: 'e-listbox-wrapper e-wrapper e-lib e-sortableclone'});
            let dragArgs: any = { bindEvents: null, dragElement: listItem[0], element: listObj1.element, event: mouseEventArs, name: 'dragStart', target: listItem[0] };
            listObj1.triggerDragStart(dragArgs);
            dragArgs = { element: listObj1.element, event: mouseEventArs, name: 'drag', target: listItem[0] };
            listObj1.triggerDrag(dragArgs);
            dragArgs = { cancel: false, currentIndex: 3, droppedElement: listItem[0], handled: false, helper: helper, name: 'beforeDrop',
                target: listItem1[2], previousIndex: 0, element: listObj2.list
            };
            listObj1.beforeDragEnd(dragArgs);
            dragArgs.event = mouseEventArs; dragArgs.name = 'drop'; dragArgs.droppedElement = listItem1[2];
            listObj1.dragEnd(dragArgs);
        });
    });
    describe('Coverage improvements toolbar - filter', () => {
        let elem1: HTMLElement = createElement('input', { id: 'listbox4' });
        let elem2: HTMLElement = createElement('input', { id: 'listbox5' });
        let listObj1: any;
        let listObj2: any;
        beforeAll(() => {
            document.body.appendChild(elem1);
            document.body.appendChild(elem2);
        });
        beforeEach(() => {
            listObj1 = new ListBox({
                dataSource: maxData, scope: '#listbox5', allowFiltering: true,
                toolbarSettings: { items: ['moveUp', 'moveDown', 'moveTo', 'moveFrom', 'moveAllTo', 'moveAllFrom'] }
            }, elem1);
            listObj2 = new ListBox({ }, elem2);
        });

        afterEach(() => {
            listObj1.destroy();
            listObj2.destroy();
        });
        it('ListBox With Move Items', () => {
            listObj1.selectAll();
            listObj1.moveTo();
        });
        it('ListBox With Move Items with filtering', () => {
            listObj1.enableItems(['Cabbage'], false);
            var ele = listObj1.list.getElementsByClassName('e-input-filter')[0];
            ele.click();
            ele.value = "c";
            listObj1.dataBind();
            listObj1.keyDownStatus = true;
            listObj1.onInput();
            listObj1.KeyUp({
                preventDefault: function () { },
                altKey: false,
                ctrlKey: false,
                shiftKey: false,
                char: '',
                key: 'c',
                charCode: 22,
                keyCode: 67,
                which: 22,
                code: 22
            });
            listObj1.enableItems(['Cabbage'], false);
            listObj1.moveAllTo();
        });
        it('ListBox With Move Items with disabled items', function () {
            listObj1.allowFiltering = false;
            listObj1.dataBind();
            listObj1.enableItems(['Cabbage'], false);
            listObj1.moveAllTo();
            listObj1.toolbarAction = "moveAllTo";
            listObj1.moveTo();
        });
    });

    describe('ListBox Change Event Args', () => {
        let listObj: any;
        let elem: HTMLElement = createElement('input');
    
        beforeAll(() => {
            document.body.appendChild(elem);
        });
    
        afterEach(() => {
            listObj.destroy();
        });
    
        it('should emit change event with value as string[]', () => {
            listObj = new ListBox({ dataSource: ['Java', 'JavaScript', 'Python'], value: ['Java'], selectionSettings: { showCheckbox: false } }, elem);
            let changeArgs: string[] | number[] | boolean[];
            listObj.change = (args: ListBoxChangeEventArgs) => {
                changeArgs = args.value;
            };
            let index = 1;
            let li = listObj.getItems()[index];
            li.click();
            expect(Array.isArray(changeArgs)).toBe(true);
        });
    });
});
