/**
 * 
 */
import { createElement, EventHandler } from '@syncfusion/ej2-base';
import { ListBox } from '../../src/index';
import { cssClass } from '@syncfusion/ej2-lists';
import { CheckBoxSelection } from '../../src/multi-select/checkbox-selection';
import { Query } from '@syncfusion/ej2-data';

ListBox.Inject(CheckBoxSelection);

let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', value: '1', icon: 'icon' }, { id: 'list2', value: '2', text: 'C#' },
{ id: 'list3', value: '3', text: 'C++' }, { id: 'list4', value: '4', text: 'NET', icon: 'icon' }, { id: 'list5', value: '5', text: 'Oracle' }];

let data2: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', value: 1, icon: 'icon' }, { id: 'list2', value: 2, text: 'C#' },
{ id: 'list3', value: 3, text: 'C++' }, { id: 'list4', value: 4, text: 'NET', icon: 'icon' }, { id: 'list5', value: 5, text: 'Oracle' }];

let vegetableData: { [key: string]: Object }[] = [
    { text: 'Cabbage', id: 'item1' },
    { text: 'Spinach', id: 'item2' },
    { text: 'Wheat', id: 'item3' },
    { text: 'Yarrow', id: 'item4' },
    { text: 'Pumpkins', id: 'item5' },
    { text: 'Chickpea', id: 'item6' },
    { text: 'Bean', id: 'item7' },
    { text: 'Horse gram', id: 'item8' },
    { text: 'Garlic', id: 'item9' },
    { text: 'Nopal', id: 'item10' },
    { text: 'Onion', id: 'item11' }
];

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
            listObj = new ListBox({ dataSource: data }, elem);
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
            listObj = new ListBox({ dataSource: data, selectionSettings: { showCheckbox: true } }, elem);
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
        });

        it('Select All Checkbox', () => {
            listObj = new ListBox({ dataSource: data, selectionSettings: { showCheckbox: true, showSelectAll: true } }, elem);
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
            listObj = new ListBox({ dataSource: data }, elem);
            expect(listObj.element.getAttribute('tabindex')).toContain('0');
            expect(listObj.element.firstElementChild.classList).toContain('e-listbox-wrapper');
            expect(listObj.getComponent(listObj.getItems()[0])).toEqual(listObj);
        });
    });

    describe('Toolbar', () => {
        let elem1: HTMLElement = createElement('input', { id: 'listbox1' });
        let elem2: HTMLElement = createElement('input', { id: 'listbox2' });
        let listObj1: any;
        let listObj2: any;
        beforeAll(() => {
            document.body.appendChild(elem1);
            document.body.appendChild(elem2);
        });

        beforeEach(() => {
            listObj1 = new ListBox({
                dataSource: data, scope: '#listbox2',
                toolbarSettings: { items: ['moveUp', 'moveDown', 'moveTo', 'moveFrom', 'moveAllTo', 'moveAllFrom'] }
            }, elem1);
            listObj2 = new ListBox({ dataSource: vegetableData }, elem2);
        });

        afterEach(() => {
            listObj1.destroy();
            listObj2.destroy();
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
            expect(listObj1.ulElement.innerText).toEqual('No Records Found');
            expect(listObj2.ulElement.childElementCount).toEqual(16);
            expect(toolChild[4].disabled).toBeTruthy();
            expect(listObj2.listData[11].text).toEqual('JAVA');
            expect(listObj2.listData[15].text).toEqual('Oracle');

            // Move All From
            toolChild[5].click();
            expect(listObj2.ulElement.childElementCount).toEqual(1);
            expect(listObj2.ulElement.innerText).toEqual('No Records Found');
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
            expect(listObj1.ulElement.innerText).toEqual('No Records Found');
            expect(listObj2.ulElement.childElementCount).toEqual(16);
            expect(toolChild[4].disabled).toBeTruthy();
            expect(listObj2.listData[11].text).toEqual('JAVA');
            expect(listObj2.listData[15].text).toEqual('Oracle');

            // Move All From
            listObj1.keyDownHandler({ keyCode: 37, shiftKey: true, ctrlKey: true, preventDefault: () => { } });
            expect(listObj2.ulElement.childElementCount).toEqual(1);
            expect(listObj2.ulElement.innerText).toEqual('No Records Found');
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
            expect(listObj2.jsonData[11].text).toEqual('JAVA');
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
        });
    });

});