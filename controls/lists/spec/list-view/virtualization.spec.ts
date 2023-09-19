/**
 * Virtualization spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { ListView, Virtualization } from '../../src/list-view/index';
ListView.Inject(Virtualization);

describe('UI virtualization', () => {
    function setStyle(ele: HTMLElement, height: number) {
        let css: string = `.e-list-item, .e-list-group-item { height: ${height}px;}`;
        let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
        let styleNode: Node = style.appendChild(document.createTextNode(css));
        ele.appendChild(style);
    }
    function simulateScrollEvent(target: HTMLElement, newScrollTop: number) {
        target.scrollTop = newScrollTop;
        var e = document.createEvent("UIEvents");
        e.initUIEvent("scroll", true, true, window, 1);
        target.dispatchEvent(e);
    }
    let dataSource: { [key: string]: Object }[] = [
        { name: 'Nancy', id: '0', },
        { name: 'Andrew', id: '1' },
        { name: 'Janet', id: '2' },
        { name: 'Margaret', id: '3' },
        { name: 'Steven', id: '4' },
        { name: 'Laura', id: '5' },
        { name: 'Robert', id: '6' },
        { name: 'Michael', id: '7' },
        { name: 'Albert', id: '8' },
        { name: 'Nolan', id: '9' }
]
    describe('UI virtualization for flat List', () => {
        describe('UI virtualization with Array of JSON data in window scoll', () => {
            let listObj: any;
            let ele: HTMLElement = createElement('div', { id: 'ListView' });
            setStyle(ele, 45);
            let data: { [key: string]: Object }[] = [
            ];
            for (let i = 0; i <= 99; i++) {
                data.push({ 'text': i.toString(), 'id': i.toString() });
            }
            data[30].enabled = false;
            data[40].id = undefined
            beforeAll(() => {
                document.body.appendChild(ele);
                listObj = new ListView({
                    dataSource: data, enableVirtualization: true, sortOrder: 'Ascending'
                });
                listObj.appendTo(ele);
            });
            it('Test Dom Item count, isWindowScroll , listItemHeight', () => {
                expect(listObj.virtualizationModule.expectedDomItemCount).toBe(listObj.virtualizationModule.domItemCount);
                expect(listObj.isWindow).toBe(true);
                expect(listObj.virtualizationModule.listItemHeight).toBe(45);
            });
            it('window  scroll down', () => {
                let uiFirstIndex: number = listObj.virtualizationModule.uiFirstIndex;
                let uiLastIndex: number = listObj.virtualizationModule.uiLastIndex;
                let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                    document.documentElement.getBoundingClientRect().top;
                simulateScrollEvent(document.documentElement, startingHeight + 181);
                expect(uiFirstIndex + 4).toBe(listObj.virtualizationModule.uiFirstIndex);
                expect(uiLastIndex + 4).toBe(listObj.virtualizationModule.uiLastIndex);
            });
            it('window  scroll up', () => {
                let uiFirstIndex: number = listObj.virtualizationModule.uiFirstIndex;
                let uiLastIndex: number = listObj.virtualizationModule.uiLastIndex;
                let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                    document.documentElement.getBoundingClientRect().top;
                simulateScrollEvent(document.documentElement, startingHeight + 91);
                expect(uiFirstIndex - 2).toBe(listObj.virtualizationModule.uiFirstIndex);
                expect(uiLastIndex - 2).toBe(listObj.virtualizationModule.uiLastIndex);
            });
            it('scrolling to top of the page', () => {
                let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                    document.documentElement.getBoundingClientRect().top;
                simulateScrollEvent(document.documentElement, startingHeight + 0);
                expect(0).toBe(listObj.virtualizationModule.uiFirstIndex);
            });
            it('scrolling to end of the page', () => {
                let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                    document.documentElement.getBoundingClientRect().top;
                simulateScrollEvent(document.documentElement, startingHeight + 4500);
                expect(99).toBe(listObj.virtualizationModule.uiLastIndex);
            });

            it('Remove Selected list Item', () => {
                let data = { text: '55', id: '55' };
                listObj.selectItem(data);
                let selectedItem = listObj.getSelectedItems();
                expect(selectedItem.index).toBe(55);
                expect(selectedItem.text).toBe('55');
                expect(selectedItem.data.text).toBe(data.text);
                expect(selectedItem.data.id).toBe(data.id);
                listObj.selectItem();
                expect(listObj.getSelectedItems()).toBe(undefined);
            });

            it('Adding single item at end of the scroll', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.addItem([{ text: '999', id: '101' }]);
                let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                    document.documentElement.getBoundingClientRect().top;
                simulateScrollEvent(document.documentElement, startingHeight + 4545);
                expect(100).toBe(listObj.virtualizationModule.uiLastIndex);
                expect(ItemCount + 1).toBe(listObj.dataSource.length);
            });
            it('Adding Multiple items at end of the the scroll', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.addItem([{ text: '999999', id: '102' }, { text: '99999', id: '103' }, { text: '9999', id: '104' }]);
                let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                    document.documentElement.getBoundingClientRect().top;
                simulateScrollEvent(document.documentElement, startingHeight + 4680);
                expect(103).toBe(listObj.virtualizationModule.uiLastIndex);
                expect(ItemCount + 3).toBe(listObj.dataSource.length);
            });
            it('Removing item at end of the scroll', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.removeItem({ text: '999999', id: '104' });
                let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                    document.documentElement.getBoundingClientRect().top;
                simulateScrollEvent(document.documentElement, startingHeight + 4635);
                expect(102).toBe(listObj.virtualizationModule.uiLastIndex);
                expect(ItemCount - 1).toBe(listObj.dataSource.length);
            });
            it('Removing Multiple items at end of the scroll', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.removeMultipleItems([{ text: '999', id: '101' }, { text: '9999', id: '102' }, { text: '99999', id: '103' }]);
                let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                    document.documentElement.getBoundingClientRect().top;
                simulateScrollEvent(document.documentElement, startingHeight + 4500);
                expect(99).toBe(listObj.virtualizationModule.uiLastIndex);
                expect(ItemCount - 3).toBe(listObj.dataSource.length);
            });
            it('Adding single item at begining of the scroll', () => {
                let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                    document.documentElement.getBoundingClientRect().top;
                simulateScrollEvent(document.documentElement, startingHeight + 181);
                listObj.selectItem({ text: '1', id: '1' })
                startingHeight = listObj.ulElement.getBoundingClientRect().top -
                    document.documentElement.getBoundingClientRect().top;
                simulateScrollEvent(document.documentElement, startingHeight + 0);
                let ItemCount: number = listObj.dataSource.length;
                listObj.addItem([{ text: '0', id: '101' }]);
                expect(ItemCount + 1).toBe(listObj.dataSource.length);
            });
            it('Adding Multiple items at begining of the the scroll', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.addItem([{ text: '00', id: '102' }, { text: '000', id: '103' }, { text: '0000', id: '104' }]);
                expect(ItemCount + 3).toBe(listObj.dataSource.length);
            });
            it('Removing item at begining of the scroll', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.removeItem({ text: '0', id: '101' });
                expect(ItemCount - 1).toBe(listObj.dataSource.length);
            });
            it('Removing Multiple items at begining of the scroll', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.removeMultipleItems([{ text: '00', id: '102' }, { text: '000', id: '103' }, { text: '0000', id: '104' }]);
                expect(ItemCount - 3).toBe(listObj.dataSource.length);
            });
            it('Adding single item data at end of the list', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.addItem([{ text: '999', id: '101' }]);
                expect(ItemCount + 1).toBe(listObj.dataSource.length);
            });
            it('Removing slected item data', () => {
                let ItemCount: number = listObj.dataSource.length;
                let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                    document.documentElement.getBoundingClientRect().top;
                simulateScrollEvent(document.documentElement, startingHeight + 4500);
                listObj.selectItem({ text: '999', id: '101' });
                expect(listObj.element.querySelector('[data-uid="101"]').classList.contains('e-active')).toBe(true);
                listObj.removeItem({ text: '999', id: '101' });
                expect(ItemCount - 1).toBe(listObj.dataSource.length);
            });
            it('Adding single item data at middle of the list', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.addItem([{ text: '00', id: '101' }]);
                expect(ItemCount + 1).toBe(listObj.dataSource.length);
            });
            it('Disabling list item', () => {
                let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                    document.documentElement.getBoundingClientRect().top;
                simulateScrollEvent(document.documentElement, startingHeight + 0);
                listObj.disableItem({ text: '1', id: '1' });
                expect(listObj.element.querySelector('[data-uid="1"]').classList.contains('e-disabled')).toBe(true);
            });
            it('Enabling list item', () => {
                listObj.enableItem({ text: '1', id: '1' });
                expect(listObj.element.querySelector('[data-uid="1"]').classList.contains('e-disabled')).toBe(false);
            });
            it('Enabling/Disabling wrong list ID', () => {
                listObj.disableItem({ text: '2e1', id: '1h7' });
                listObj.enableItem({ text: '2e1', id: '1h7' });
            });
            it('Removing disabled list item', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.disableItem({ text: '2', id: '2' });
                listObj.removeItem({ text: '2', id: '2' });
                expect(ItemCount - 1).toBe(listObj.dataSource.length);
            });
            it('Destroying UI virtualization', () => {
                listObj.destroy();
            });
            afterAll(() => {
                listObj.destroy();
                ele.remove();
            });
        });
        describe('UI virtualization with Array of string data in Element scoll', () => {
            let listObj: any;
            let ele: HTMLElement = createElement('div', { id: 'ListView' });
            ele.style.overflow = 'auto';
            setStyle(ele, 50);
            let data: string[] = [
            ];
            for (let i = 0; i <= 99; i++) {
                data.push(i.toString());
            }
            beforeAll(() => {
                document.body.appendChild(ele);
                listObj = new ListView({
                    dataSource: data, enableVirtualization: true, height: 500, sortOrder: 'Ascending',
                });
                listObj.appendTo(ele);
            });
            it('Test Dom Item count, isWindowScroll , listItemHeight', () => {
                expect(listObj.virtualizationModule.expectedDomItemCount).toBe(listObj.virtualizationModule.domItemCount);
                expect(listObj.isWindow).toBe(false);
                expect(listObj.virtualizationModule.listItemHeight).toBe(50);
            });

            it('Listview element scroll down', () => {
                let uiFirstIndex: number = listObj.virtualizationModule.uiFirstIndex;
                let uiLastIndex: number = listObj.virtualizationModule.uiLastIndex;
                simulateScrollEvent(listObj.element, 251);
                expect(uiFirstIndex + 5).toBe(listObj.virtualizationModule.uiFirstIndex);
                expect(uiLastIndex + 5).toBe(listObj.virtualizationModule.uiLastIndex);
            });
            it('Listview element scroll up', () => {
                let uiFirstIndex: number = listObj.virtualizationModule.uiFirstIndex;
                let uiLastIndex: number = listObj.virtualizationModule.uiLastIndex;
                simulateScrollEvent(listObj.element, 201);
                expect(uiFirstIndex - 1).toBe(listObj.virtualizationModule.uiFirstIndex);
                expect(uiLastIndex - 1).toBe(listObj.virtualizationModule.uiLastIndex);
            });
            it('scrolling to top of the page', () => {
                simulateScrollEvent(listObj.element, 0);
                expect(0).toBe(listObj.virtualizationModule.uiFirstIndex);
            });
            it('scrolling to end of the page', () => {
                simulateScrollEvent(listObj.element, 5000);
                expect(99).toBe(listObj.virtualizationModule.uiLastIndex);
            });
            it('Select list Item', () => {
                let data = '55';
                listObj.selectItem(data);
                let selectedItem = listObj.getSelectedItems();
                expect(selectedItem.index).toBe(55);
                expect(selectedItem.text).toBe('55');
                expect(selectedItem.data).toBe(data);
            });
            it('Adding single item at end of the scroll', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.addItem(['999']);
                simulateScrollEvent(listObj.element, 5050);
                expect(100).toBe(listObj.virtualizationModule.uiLastIndex);
                expect(ItemCount + 1).toBe(listObj.dataSource.length);
            });
            it('Adding Multiple items at end of the scroll', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.addItem(['9999', '99999', '999999']);
                simulateScrollEvent(listObj.element, 5200);
                expect(103).toBe(listObj.virtualizationModule.uiLastIndex);
                expect(ItemCount + 3).toBe(listObj.dataSource.length);
            });
            it('Removing item at end of the scroll', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.removeItem('999999');
                simulateScrollEvent(listObj.element, 5150);
                expect(102).toBe(listObj.virtualizationModule.uiLastIndex);
                expect(ItemCount - 1).toBe(listObj.dataSource.length);
            });
            it('Removing Multiple items at end of the scroll', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.removeMultipleItems(['999', '9999', '99999']);
                simulateScrollEvent(listObj.element, 5000);
                expect(99).toBe(listObj.virtualizationModule.uiLastIndex);
                expect(ItemCount - 3).toBe(listObj.dataSource.length);
            });
            it('Removing single item at top of the list', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.removeItem('0');
                expect(ItemCount - 1).toBe(listObj.dataSource.length);
            });
            it('Destroying UI virtualization', () => {
                listObj.destroy();
            });
            afterAll(() => {
                listObj.destroy();
                ele.remove();
            });
        });
        describe('UI virtualization with icon css', () => {
            let listObj: any;
            let ele: HTMLElement = createElement('div', { id: 'ListView' });
            ele.style.overflow = 'auto';
            setStyle(ele, 50);
            let data: { [key: string]: string }[] = [
            ];
            for (let i = 0; i <= 99; i++) {
                data.push({ 'text': i.toString(), 'id': i.toString(), icon: 'icon-' + i.toString() });
            }
            data[1].icon = undefined;
            beforeAll(() => {
                document.body.appendChild(ele);
                listObj = new ListView({
                    dataSource: data, enableVirtualization: true, height: 500,
                    fields: { iconCss: 'icon' }, showIcon: true
                });
                listObj.appendTo(ele);
            });
            it('Checking icon css class', () => {
                let element: HTMLElement = (listObj.element as HTMLElement).querySelector('.e-list-icon')
                expect(element.classList.contains('icon-0')).toBeTruthy();
            });
            it('Listview element scroll down', () => {
                simulateScrollEvent(listObj.element, 251);
                let element: HTMLElement = (listObj.element as HTMLElement).querySelector('.e-list-icon')
                expect(element.classList.contains('icon-5')).toBeTruthy();
            });
            it('Listview element scroll up', () => {
                simulateScrollEvent(listObj.element, 201);
                let element: HTMLElement = (listObj.element as HTMLElement).querySelector('.e-list-icon')
                expect(element.classList.contains('icon-4')).toBeTruthy();
            });
            it('scrolling to top of the page', () => {
                simulateScrollEvent(listObj.element, 0);
                let element: HTMLElement = (listObj.element as HTMLElement).querySelector('.e-list-icon')
                expect(element.classList.contains('icon-0')).toBeTruthy();
            });
            it('scrolling to end of the page', () => {
                simulateScrollEvent(listObj.element, 5000);
                let liCollection: NodeList = (listObj.element as HTMLElement).querySelectorAll('.e-list-icon');
                let element: HTMLElement = liCollection[liCollection.length - 1] as HTMLElement;
                expect(element.classList.contains('icon-99')).toBeTruthy();
            });
            it('On property changed - show icon', () => {
                listObj.showIcon = false;
                listObj.dataBind();
                expect(listObj.curUL.querySelectorAll('.e-list-icon').length).toBe(0);
                listObj.showIcon = true;
                listObj.dataBind();
                expect(listObj.curUL.querySelectorAll('.e-list-icon').length).not.toBe(0);
            });
            afterAll(() => {
                ele.remove();
            });
        });
        describe('UI virtualization with less item count than expected DOM count', () => {
            let listObj: any;
            let ele: HTMLElement = createElement('div', { id: 'ListView' });
            ele.style.overflow = 'auto';
            setStyle(ele, 50);
            let data: { [key: string]: Object }[] = [];
            beforeAll(() => {
                document.body.appendChild(ele);
                listObj = new ListView({
                    dataSource: data, enableVirtualization: true, sortOrder: 'Ascending', height: 100
                });
                listObj.appendTo(ele);
            });
            it('onProperty changed - fields with empty data ', () => {
                expect(listObj.fields.text).toBe('text');
                listObj.fields = { text: 'name' };
                listObj.dataBind();
                expect(listObj.fields.text).toBe('name');
            });
            it('Add single list item', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.addItem([{ name: '0', id: '0' }]);
                expect(ItemCount + 1).toBe(listObj.dataSource.length);
            });
            it('Add multiple list item', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.addItem([{ name: '1', id: '1' }, { name: '2', id: '2' }, { name: '3', id: '3' }, { name: '4', id: '4' }]);
                expect(ItemCount + 4).toBe(listObj.dataSource.length);
            });
            it('Removing single list item', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.removeItem({ name: '0', id: '0' });
                expect(ItemCount - 1).toBe(listObj.dataSource.length);
            });
            it('Removing multiple list item', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.removeMultipleItems([{ name: '1', id: '1' }, { name: '2', id: '2' }, { name: '3', id: '3' }, { name: '4', id: '4' }]);
                expect(ItemCount - 4).toBe(listObj.dataSource.length);
            });
            it('Removing wrong list item data', () => {
                let ItemCount: number = listObj.dataSource.length;
                listObj.removeItem({ name: '691', id: '881' });
                expect(ItemCount).toBe(listObj.dataSource.length);
            });
            afterAll(() => {
                listObj.destroy();
                ele.remove();
            })
        });
    });
    describe('UI virtualization for group list', () => {
        let listObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        setStyle(ele, 50);
        let data: { [key: string]: Object }[] = [
        ];
        for (let i = 0; i < 50; i++) {
            data.push({ 'text': i.toString(), 'id': i.toString(), 'category': Math.floor(i / 10).toString(), 'cat': Math.floor(i / 10).toString() });
        }
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new ListView({
                dataSource: data, enableVirtualization: true, sortOrder: 'Ascending', fields: { groupBy: 'category' }
            });
            listObj.appendTo(ele);
        });
        it('Adding new category', () => {
            let ItemCount: number = listObj.dataSource.length;
            let cusDsCount: number = listObj.curViewDS.length;
            let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                document.documentElement.getBoundingClientRect().top;
            simulateScrollEvent(document.documentElement, startingHeight + 2500);
            listObj.addItem([{ text: '50', id: '50', category: '5' }]);
            expect(ItemCount + 1).toBe(listObj.dataSource.length);
            expect(cusDsCount + 2).toBe(listObj.curViewDS.length);
        });
        it('Adding item to new category', () => {
            let ItemCount: number = listObj.dataSource.length;
            let cusDsCount: number = listObj.curViewDS.length;
            let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                document.documentElement.getBoundingClientRect().top;
            simulateScrollEvent(document.documentElement, startingHeight + 2600);
            listObj.addItem([{ text: '51', id: '51', category: '5' }]);
            expect(ItemCount + 1).toBe(listObj.dataSource.length);
            expect(cusDsCount + 1).toBe(listObj.curViewDS.length);
        });
        it('Selecting item', () => {
            let data = { text: '50', id: '50' };
            listObj.selectItem(data);
            let selectedItem = listObj.getSelectedItems();
            expect(selectedItem.index).toBe(50);
            expect(selectedItem.text).toBe('50');
            expect(selectedItem.data.text).toBe(data.text);
            expect(selectedItem.data.id).toBe(data.id);
        });
        it('Deleting whole category', () => {
            let ItemCount: number = listObj.dataSource.length;
            let cusDsCount: number = listObj.curViewDS.length;
            let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                document.documentElement.getBoundingClientRect().top;
            simulateScrollEvent(document.documentElement, startingHeight + 2650);
            listObj.removeMultipleItems([{ text: '50', id: '50', category: '5' }, { text: '51', id: '51', category: '5' }]);
            expect(ItemCount - 2).toBe(listObj.dataSource.length);
            expect(cusDsCount - 3).toBe(listObj.curViewDS.length);
        });
        afterAll(() => {
            listObj.destroy();
            ele.remove();
        })
    });
    describe('Check list with Array of JSON data', () => {
        let listObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        setStyle(ele, 50);
        let data: { [key: string]: Object }[] = [
        ];
        for (let i = 0; i < 50; i++) {
            data.push({ 'text': i.toString(), 'id': i.toString() });
        }
        data[30].isChecked = true;
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new ListView({
                dataSource: data, enableVirtualization: true, sortOrder: 'Ascending', showCheckBox: true
            });
            listObj.appendTo(ele);
        });
        it('Adding check list item', () => {
            let ItemCount: number = listObj.dataSource.length;
            let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                document.documentElement.getBoundingClientRect().top;
            simulateScrollEvent(document.documentElement, startingHeight + 2500);
            listObj.addItem([{ text: '50', id: '50' }]);
            expect(ItemCount + 1).toBe(listObj.dataSource.length);
        });
        it('Selecting item', () => {
            let data = { text: '50', id: '50' };
            listObj.selectItem(data);
            let selectedItem = listObj.getSelectedItems();
            expect(selectedItem.index.indexOf(30)).not.toBe(-1);
            expect(selectedItem.index.indexOf(50)).not.toBe(-1);
            expect(selectedItem.text.indexOf('50')).not.toBe(-1);
            expect(selectedItem.text.indexOf('30')).not.toBe(-1);
        });
        it('Adding check list item', () => {
            let ItemCount: number = listObj.dataSource.length;
            listObj.addItem([{ text: '370', id: '51' }]);
            expect(ItemCount + 1).toBe(listObj.dataSource.length);
        });
        it('using getSelectedItem to check the indices', () => {
            let selectedItem = listObj.getSelectedItems();
            expect(selectedItem.index.indexOf(30)).not.toBe(-1);
            expect(selectedItem.index.indexOf(50)).not.toBe(-1);
            expect(selectedItem.text.indexOf('50')).not.toBe(-1);
            expect(selectedItem.text.indexOf('30')).not.toBe(-1);
        });
        it('Deleting list item', () => {
            let ItemCount: number = listObj.dataSource.length;
            listObj.removeItem({ text: '37', id: '37' });
            expect(ItemCount - 1).toBe(listObj.dataSource.length);
        });
        it('Adding checked list item', () => {
            let ItemCount: number = listObj.dataSource.length;
            listObj.addItem([{ text: '52', id: '52', isChecked: true }]);
            let element: HTMLElement = listObj.element.querySelector('[data-uid="52"]');
            expect(element.classList.contains('e-active')).toBe(true);
            expect(ItemCount + 1).toBe(listObj.dataSource.length);
        });
        it('Deleting checked list item ', () => {
            let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                document.documentElement.getBoundingClientRect().top;
            simulateScrollEvent(document.documentElement, startingHeight + 0);
            let ItemCount: number = listObj.dataSource.length;
            let element: HTMLElement = listObj.element.querySelector('.e-list-item');
            element.click();
            expect(element.classList.contains('e-focused')).toBe(true);
            expect(element.classList.contains('e-active')).toBe(true);
            listObj.removeItem({ text: '0', id: '0' });
            expect(ItemCount - 1).toBe(listObj.dataSource.length);
            startingHeight = listObj.ulElement.getBoundingClientRect().top -
                document.documentElement.getBoundingClientRect().top;
            simulateScrollEvent(document.documentElement, startingHeight + 2550);
            listObj.removeItem({ text: '52', id: '52' });
            expect(ItemCount - 2).toBe(listObj.dataSource.length);
        });
        it('Hiding check list item', () => {
            let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                document.documentElement.getBoundingClientRect().top;
            simulateScrollEvent(document.documentElement, startingHeight + 0);
            listObj.hideItem({ text: '1', id: '1' });
            expect(listObj.element.querySelector('[data-uid="1"]').style.display).toBe('none');
        });
        it('Showing hidden check list item', () => {
            let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                document.documentElement.getBoundingClientRect().top;
            simulateScrollEvent(document.documentElement, startingHeight + 2550);
            simulateScrollEvent(document.documentElement, startingHeight + 0);
            listObj.showItem({ text: '1', id: '1' });
            expect(listObj.element.querySelector('[data-uid="1"]').style.display).toBe('');
        });
        it('Showing/hiding wrong list ID', () => {
            listObj.hideItem({ text: '2e1', id: '1h7' });
            listObj.showItem({ text: '2e1', id: '1h7' });
        });
        it('Removing hidden list item', () => {
            let ItemCount: number = listObj.dataSource.length;
            listObj.hideItem({ text: '2', id: '2' });
            listObj.removeItem({ text: '2', id: '2' });
            expect(ItemCount - 1).toBe(listObj.dataSource.length);
        });
        it('Checking all list item', () => {
            listObj.checkAllItems();
            let selectedItem = listObj.getSelectedItems();
            expect(selectedItem.data.length).toBe(listObj.dataSource.length);
        });
        it('unchecking all list item', () => {
            listObj.uncheckAllItems();
            let selectedItem = listObj.getSelectedItems();
            expect(selectedItem).toBe(undefined);
        });
        it('On property changed - enableUiVirtualization', () => {
            listObj.enableVirtualization = false;
            listObj.dataBind();
            expect(listObj.curUL.firstElementChild).not.toBe(listObj.virtualizationModule.topElement);
            listObj.enableVirtualization = true;
            listObj.dataBind();
            expect(listObj.curUL.firstElementChild).toBe(listObj.virtualizationModule.topElement);
        });
        it('Destroying UI virtualization', () => {
            listObj.destroy();
        });
        afterAll(() => {
            listObj.destroy();
            ele.remove();
        });
    });
    describe('Check list with Array of string data', () => {
        let listObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        ele.style.overflow = 'auto';
        setStyle(ele, 50);
        let data: string[] = [
        ];
        for (let i = 0; i <= 49; i++) {
            data.push(i.toString());
        }
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new ListView({
                dataSource: data, enableVirtualization: true, showCheckBox: true, sortOrder: 'Ascending'
            });
            listObj.appendTo(ele);
        });
        it('checking getSelected method with unchecked list item', () => {
            let selectedItem = listObj.getSelectedItems();
            expect(selectedItem).toBe(undefined);
        });
        it('Adding check list item', () => {
            let ItemCount: number = listObj.dataSource.length;
            listObj.addItem([50]);
            expect(ItemCount + 1).toBe(listObj.dataSource.length);
        });
        it('Deleting check list item', () => {
            let ItemCount: number = listObj.dataSource.length;
            listObj.removeItem(50);
            expect(ItemCount - 1).toBe(listObj.dataSource.length);
        });
        it('Toggle selection', () => {
            listObj.curUL.querySelectorAll('.e-checklist')[1].click();
            listObj.selectItem('40');
            let selectedItem = listObj.getSelectedItems();
            expect(selectedItem.index.indexOf(40)).not.toBe(-1);
            expect(selectedItem.index.indexOf(40)).not.toBe(-1);
            listObj.selectItem('40');
            let _selectedItem = listObj.getSelectedItems();
            expect(_selectedItem.index.indexOf(40)).toBe(-1);
            expect(_selectedItem.index.indexOf(40)).toBe(-1);
        });
        it('On property changed - showCheckBox, dataSource', () => {
            listObj.showCheckBox = false;
            listObj.dataBind();
            expect(listObj.curUL.querySelectorAll('.e-checklist').length).toBe(0);
            listObj.showCheckBox = true;
            listObj.dataBind();
            expect(listObj.curUL.querySelectorAll('.e-checklist').length).not.toBe(0);
            let itemCount: number = listObj.dataSource.length;
            listObj.dataSource = data.slice(1);
            listObj.dataBind();
            expect(listObj.dataSource.length).toBe(itemCount - 1);
        });
        afterAll(() => {
            listObj.destroy();
            ele.remove();
        });
    });
    describe('UI virtualization for grouped check list', () => {
        let listObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        setStyle(ele, 50);
        let data: { [key: string]: Object }[] = [
        ];
        for (let i = 0; i < 50; i++) {
            data.push({ 'text': i.toString(), 'id': i.toString(), 'category': Math.floor(i / 10).toString(), 'cat': Math.floor(i / 10).toString() });
        }
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new ListView({
                dataSource: data, enableVirtualization: true, showCheckBox: true, sortOrder: 'Ascending', fields: { groupBy: 'category' }
            });
            listObj.appendTo(ele);
        });
        it('Adding new category', () => {
            let ItemCount: number = listObj.dataSource.length;
            let cusDsCount: number = listObj.curViewDS.length;
            let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                document.documentElement.getBoundingClientRect().top;
            simulateScrollEvent(document.documentElement, startingHeight + 2500);
            listObj.addItem([{ text: '50', id: '50', category: '5' }]);
            expect(ItemCount + 1).toBe(listObj.dataSource.length);
            expect(cusDsCount + 2).toBe(listObj.curViewDS.length);
        });
        it('Adding item to new category', () => {
            let ItemCount: number = listObj.dataSource.length;
            let cusDsCount: number = listObj.curViewDS.length;
            let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                document.documentElement.getBoundingClientRect().top;
            simulateScrollEvent(document.documentElement, startingHeight + 2600);
            listObj.addItem([{ text: '51', id: '51', category: '5' }]);
            expect(ItemCount + 1).toBe(listObj.dataSource.length);
            expect(cusDsCount + 1).toBe(listObj.curViewDS.length);
        });
        it('Selecting item', () => {
            let data = { text: '50', id: '50' };
            listObj.selectItem(data);
            let selectedItem = listObj.getSelectedItems();
            expect(selectedItem.index.indexOf(50)).not.toBe(-1);
            expect(selectedItem.text.indexOf('50')).not.toBe(-1);
        });
        it('Deleting whole category', () => {
            let ItemCount: number = listObj.dataSource.length;
            let cusDsCount: number = listObj.curViewDS.length;
            let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                document.documentElement.getBoundingClientRect().top;
            simulateScrollEvent(document.documentElement, startingHeight + 2650);
            listObj.removeMultipleItems([{ text: '50', id: '50', category: '5' }, { text: '51', id: '51', category: '5' }]);
            expect(ItemCount - 2).toBe(listObj.dataSource.length);
            expect(cusDsCount - 3).toBe(listObj.curViewDS.length);
        });
        it('scrolling up and down', () => {
            let startingHeight: number = listObj.ulElement.getBoundingClientRect().top -
                document.documentElement.getBoundingClientRect().top;
            simulateScrollEvent(document.documentElement, startingHeight + 0);
            let element: HTMLElement = listObj.element.querySelector('.e-list-item');
            element.click();
            startingHeight = listObj.ulElement.getBoundingClientRect().top -
                document.documentElement.getBoundingClientRect().top;
            simulateScrollEvent(document.documentElement, startingHeight + 2500);
            simulateScrollEvent(document.documentElement, startingHeight + 0);
        });
        it('Checking all list item', () => {
            listObj.checkAllItems();
            let selectedItem = listObj.getSelectedItems();
            expect(selectedItem.data.length).toBe(listObj.dataSource.length);
        });
        it('unchecking all list item', () => {
            listObj.uncheckAllItems();
            let selectedItem = listObj.getSelectedItems();
            expect(selectedItem).toBe(undefined);
        });
        afterAll(() => {
            listObj.destroy();
            ele.remove();
        })
    });
    describe('template with Array of JSON data', () => {
        let listObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        ele.style.overflow = 'auto';
        let templateFunc: Function = (data: any) => {
            return `<div class ="${data.rid}" id ="${data.id}"><span ${data.rid}="true" type ="${data.id % 2 === 0 ? 'even-list' : 'odd-list'}"> ${data.id % 2 === 0 ? data.even : data.odd} </span> </div>`;
        }
        setStyle(ele, 50);
        let data: { [key: string]: Object }[] = [
        ];
        for (let i = 0; i < 50; i++) {
            data.push({ 'text': i.toString(), 'even': 'evenText', 'odd': 'oddText', 'id': i.toString(), 'rid': 'r-' + i.toString() });
        }
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new ListView({
                dataSource: data, enableVirtualization: true, showCheckBox: true,
                height: 500,
                template: templateFunc
            });
            listObj.appendTo(ele);
        });
        it('checking attribute', () => {
            let id: string = listObj.ulElement.getElementsByClassName('e-list-item')[0].firstElementChild.getAttribute('id');
            let type: string = listObj.ulElement.getElementsByClassName('e-list-item')[0].firstElementChild.lastElementChild.getAttribute('type');
            expect(id).toBe('0');
            expect(type).toBe('even-list');
            simulateScrollEvent(listObj.element, 51);
            id = listObj.ulElement.getElementsByClassName('e-list-item')[0].firstElementChild.getAttribute('id');
            type = listObj.ulElement.getElementsByClassName('e-list-item')[0].firstElementChild.lastElementChild.getAttribute('type');
            expect(id).toBe('1');
            expect(type).toBe('odd-list');
        });

        it('checking class', () => {
            simulateScrollEvent(listObj.element, 2500);
            let className = listObj.ulElement.getElementsByClassName('e-list-item')[listObj.ulElement.getElementsByClassName('e-list-item').length - 1].firstElementChild.classList;
            expect(className.contains('r-49')).toBe(true);
            simulateScrollEvent(listObj.element, 0);
            className = listObj.ulElement.getElementsByClassName('e-list-item')[0].firstElementChild.classList;
            expect(className.contains('r-0')).toBe(true);
        });

        it('checking text content', () => {
            let textContent: string = listObj.ulElement.getElementsByClassName('e-list-item')[0].firstElementChild.lastElementChild.innerText.trim();
            expect(textContent).toBe('evenText');
            simulateScrollEvent(listObj.element, 253);
            textContent = listObj.ulElement.getElementsByClassName('e-list-item')[0].firstElementChild.lastElementChild.innerText.trim();
            expect(textContent).toBe('oddText');
        });
        afterAll(() => {
            listObj.destroy();
            ele.remove();
        });
    });

    describe('Template in group list with Array of JSON data', () => {
        let listObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        ele.style.overflow = 'auto';
        let templateFunc: Function = (data: any) => {
            return `<div class ="${data.rid}" id ="${data.id}"><span ${data.rid}="true" type ="${data.id % 2 === 0 ? 'even-list' : 'odd-list'}"> ${data.id % 2 === 0 ? data.even : data.odd} </span> </div>`;
        }
        setStyle(ele, 50);
        let data: { [key: string]: Object }[] = [
        ];
        for (let i = 0; i < 50; i++) {
            data.push({ 'text': i.toString(), 'even': 'evenText', 'odd': 'oddText', 'id': i.toString(), 'rid': 'r-' + i.toString(), 'category': Math.floor(i / 10).toString() });
        }
        data[20].id = undefined;
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new ListView({
                dataSource: data, enableVirtualization: true, showCheckBox: true,
                height: 500,
                fields: { groupBy: 'category' },
                template: templateFunc
            });
            listObj.appendTo(ele);
        });
        it('checking attribute', () => {
            let id: string = listObj.ulElement.getElementsByClassName('e-list-item')[0].firstElementChild.getAttribute('id');
            let type: string = listObj.ulElement.getElementsByClassName('e-list-item')[0].firstElementChild.lastElementChild.getAttribute('type');
            expect(id).toBe('0');
            expect(type).toBe('even-list');
            simulateScrollEvent(listObj.element, 101);
            id = listObj.ulElement.getElementsByClassName('e-list-item')[0].firstElementChild.getAttribute('id');
            type = listObj.ulElement.getElementsByClassName('e-list-item')[0].firstElementChild.lastElementChild.getAttribute('type');
            expect(id).toBe('1');
            expect(type).toBe('odd-list');
        });

        it('checking class', () => {
            simulateScrollEvent(listObj.element, 2750);
            let className = listObj.ulElement.getElementsByClassName('e-list-item')[listObj.ulElement.getElementsByClassName('e-list-item').length - 1].firstElementChild.classList;
            expect(className.contains('r-49')).toBe(true);
            simulateScrollEvent(listObj.element, 0);
            className = listObj.ulElement.getElementsByClassName('e-list-item')[0].firstElementChild.classList;
            expect(className.contains('r-0')).toBe(true);
        });

        it('checking text content', () => {
            let textContent: string = listObj.ulElement.getElementsByClassName('e-list-item')[0].firstElementChild.lastElementChild.innerText.trim();
            expect(textContent).toBe('evenText');
            simulateScrollEvent(listObj.element, 301);
            textContent = listObj.ulElement.getElementsByClassName('e-list-item')[0].firstElementChild.lastElementChild.innerText.trim();
            expect(textContent).toBe('oddText');
        });
        afterAll(() => {
            listObj.destroy();
            ele.remove();
        });
    });
    describe('Template and group Template with Array of JSON data', () => {
        let listObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        ele.style.overflow = 'auto';
        let templateFunc: Function = (data: any) => {
            return `<div  class="${data.items[0].rid}" ${data.items[0].rid} = "true" type ="${data.items[0].id % 2 === 0 ? 'even-list' : 'odd-list'}">  ${data.text} </div>`;
        }
        setStyle(ele, 50);
        let data: { [key: string]: Object }[] = [
        ];
        for (let i = 0; i < 50; i++) {
            data.push({ 'text': i.toString(), 'even': 'evenText', 'odd': 'oddText', 'id': i.toString(), 'rid': 'r-' + i.toString(), 'category': Math.floor(i / 10).toString() });
        }
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new ListView({
                dataSource: data, enableVirtualization: true, showCheckBox: true,
                height: 550, headerTitle: 'list', showHeader: true,
                fields: { groupBy: 'category' },
                groupTemplate: templateFunc,
            });
            listObj.appendTo(ele);
        });

        it('checking attribute, class , text content', () => {
            let type: string = listObj.ulElement.getElementsByClassName('e-list-group-item')[0].firstElementChild.getAttribute('type');
            let className = listObj.ulElement.getElementsByClassName('e-list-group-item')[0].firstElementChild.classList;
            let textContent: string = listObj.ulElement.getElementsByClassName('e-list-group-item')[0].firstElementChild.innerText.trim();
            expect(textContent).toBe('0');
            expect(type).toBe('even-list');
            expect(className.contains('r-0')).toBe(true);
            simulateScrollEvent(listObj.element, 50);
        });
        afterAll(() => {
            ele.remove();
        });
    });

    describe('Template and group Template with Array of JSON data', () => {
        let listObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        ele.style.overflow = 'auto';
        let templateFunc: Function = (data: any) => {
            return `<div class ="${data.id % 2 === 0 ? 'even-list' : 'odd-list'}" id ="${data.id}"><span ${data.rid}="true" > ${data.id % 2 === 0 ? data.even : data.odd} </span> </div>`;
        }
        setStyle(ele, 45);
        let data: { [key: string]: Object }[] = [
        ];
        for (let i = 0; i < 50; i++) {
            data.push({ 'text': i.toString(), 'even': 'evenText', 'odd': 'oddText', 'id': i.toString(), 'rid': 'r-' + i.toString(), 'category': Math.floor(i / 10).toString() });
        }
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new ListView({
                dataSource: data, enableVirtualization: true, showCheckBox: true,
                height: 550,
                fields: { groupBy: 'id' },
                groupTemplate: '<div > <span></span> ${ text }</div>',
                template: templateFunc
            });
            listObj.appendTo(ele);
        });

        it('checking attribute, class , text content', () => {
            let id: string = listObj.ulElement.getElementsByClassName('e-list-item')[0].firstElementChild.getAttribute('id');
            let className = listObj.ulElement.getElementsByClassName('e-list-item')[0].firstElementChild.classList;
            let textContent: string = listObj.ulElement.getElementsByClassName('e-list-group-item')[0].firstElementChild.innerText.trim();
            expect(textContent).toBe('0');
            expect(id).toBe('0');
            expect(className.contains('even-list')).toBe(true);
            simulateScrollEvent(listObj.element, 91);
            id = listObj.ulElement.getElementsByClassName('e-list-item')[0].firstElementChild.getAttribute('id');
            className = listObj.ulElement.getElementsByClassName('e-list-item')[0].firstElementChild.classList;
            textContent = listObj.ulElement.getElementsByClassName('e-list-group-item')[0].firstElementChild.innerText.trim();
            expect(textContent).toBe('1');
            expect(id).toBe('1');
            expect(className.contains('odd-list')).toBe(true);
        });
        afterAll(() => {
            listObj.destroy();
            ele.remove();
        });
    });

    describe('ngTemplate method', () => {
        let listObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        ele.style.overflow = 'auto';
        setStyle(ele, 45);
        let data: { [key: string]: Object }[] = [
            { text: 'BMW', id: '1' }
        ];
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new ListView({
                dataSource: data, enableVirtualization: true,
                height: 550,
                template: '<div>${text}</div>'
            });
            let id: any = [{context: { $implicit: { text: 'BMW', id: '1' } }}];
            listObj.templateRef = {};
            listObj.viewContainerRef = {};
            listObj.viewContainerRef.get = function() {return id;};
            listObj.viewContainerRef.get(0).context ={ $implicit: { text: 'BMW', id: '1' } };
            listObj.appendTo(ele);
        });

        it('checking context data', () => {
            let li = listObj.element.querySelector('.e-list-item');
            let newData: { [key: string]: Object } = { text: 'Audi', id: '2' }
            listObj.virtualizationModule.onNgChange(newData, li, listObj.virtualizationModule);
            expect((li as HTMLElement).children[0].textContent).toBe('Audi');
            listObj.refreshItemHeight();
        });
        afterAll(() => {
            listObj.destroy();
            ele.remove();
        });
    });

    describe('Add item should inject new item if data count is less than expected', () => {
        let listObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        ele.style.overflow = 'auto';
        setStyle(ele, 50);
        let data: { [key: string]: Object }[] = [];
        data.push({ text: '0', id: '0', groupBy: 'number' });

        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new ListView({
                dataSource: data, enableVirtualization: true, height: 300,
                fields: { groupBy: 'groupBy' }
            });
            listObj.appendTo(ele);
        });

        it('should inject new item into DOM', () => {
            listObj.addItem([{ text: '1', id: '1', groupBy: 'number' }]);
            const li = listObj.element.querySelector('ul').querySelectorAll('li');
            expect(li[li.length - 1].getAttribute('data-uid')).toBe('1');
            expect(li[li.length - 1].querySelector('.e-list-text').textContent).toBe('1');
        });

        it('should inject new group item into DOM', () => {
            listObj.addItem([{ text: '2', id: '2', groupBy: 'numbers' }]);
            simulateScrollEvent(listObj.element, 1000);
            const li = listObj.element.querySelector('ul').querySelectorAll('li');
            expect(li[li.length - 1].getAttribute('data-uid')).toBe('2');
            expect(li[li.length - 1].querySelector('.e-list-text').textContent).toBe('2');

            expect(li[li.length - 2].getAttribute('data-uid')).toBe('group-list-item-numbers');
            expect(li[li.length - 2].querySelector('.e-list-text').textContent).toBe('numbers');
        });

        it('should inject new item into DOM', () => {
            listObj.addItem([{ text: '3', id: '3', groupBy: 'number' }]);
            const li = listObj.element.querySelector('ul').querySelectorAll('li');
            expect(li[3].getAttribute('data-uid')).toBe('3');
            expect(li[3].querySelector('.e-list-text').textContent).toBe('3');
        });

        it('addItem with template', () => {
            data = [];
            listObj.destroy();
            listObj = new ListView({
                dataSource: data, enableVirtualization: true, height: 300,
                template: '<div>${text}</div>'
            });
            listObj.appendTo(ele);

            listObj.addItem([{ id: '0', text: '0' }]);
            const li = listObj.element.querySelector('ul').querySelectorAll('li');
            expect(li[li.length - 1].getAttribute('data-uid')).toBe('0');
        })

        afterAll(() => {
            listObj.destroy();
            ele.remove();
        });
    });
    describe('UI virtualization with height property', () => {
        let ele: Element;
        let elementvalue: HTMLElement;
        let listObj: any;
        it('height property', () => {
            elementvalue = createElement('div');
            elementvalue.style.height = '1000px';
            ele = createElement('div', { id: 'ListView' });
            elementvalue.appendChild(ele);     
            document.body.appendChild(elementvalue);
            listObj = new ListView({ dataSource: dataSource, 
                enableVirtualization: true,
                height: '50%',
                headerTitle: 'Contacts',
                showHeader: true,
                fields: { text: 'name', id: 'id' } 
                });
                listObj.appendTo(ele);
            let heightValue: number = 500;
            expect(heightValue).toBe(listObj.element.getBoundingClientRect().height);
        });
        afterAll(() => {
            listObj.destroy();
            ele.remove();
        });
    });
});
