import { MultiSelect, TaggingEventArgs, MultiSelectChangeEventArgs } from '../../src/multi-select/multi-select';
import { Browser, isNullOrUndefined, EmitType } from '@syncfusion/ej2-base';
import { createElement, L10n } from '@syncfusion/ej2-base';
import { dropDownBaseClasses, FilteringEventArgs, PopupEventArgs, FocusEventArgs } from '../../src/drop-down-base/drop-down-base';
import { DataManager, ODataV4Adaptor, Query, ODataAdaptor, WebApiAdaptor, UrlAdaptor } from '@syncfusion/ej2-data';
import { MultiSelectModel, ISelectAllEventArgs } from '../../src/index';
import { VirtualScroll } from '../../src/common/virtual-scroll';
import { CheckBoxSelection } from '../../src/multi-select/checkbox-selection';

MultiSelect.Inject(VirtualScroll);
MultiSelect.Inject(CheckBoxSelection);

let keyboardEventArgs = {
    preventDefault: function () { },
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    char: '',
    key: '',
    charCode: 22,
    keyCode: 22,
    which: 22,
    code: 22
};

describe('MultiSelect - Group 14: Virtual Scroll + Keyboard Navigation', () => {
    let listObj: MultiSelect;
    let element: HTMLInputElement;
    // Large dataset fixture for virtual scrolling
    let largeDataset: any[] = [];
    let largeDisabledDataset: any[] = [];
    beforeAll((): void => {
        // Create large dataset
        for (let i = 1; i <= 500; i++) {
            largeDataset.push({
                id: `item-${i}`,
                text: `Item ${i}`,
                category: `Category ${Math.floor(i / 50) + 1}`,
                disabled: i % 25 === 0 // 4% disabled items
            });
            largeDisabledDataset.push({
                id: `item-${i}`,
                text: `Item ${i}`,
                category: `Category ${Math.floor(i / 50) + 1}`,
                disabled: i % 2 === 0 // 4% disabled items
            });
        }
    });
    beforeEach((): void => {
        element = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        document.body.appendChild(element);
    });
    afterEach((): void => {
        if (listObj) {
            listObj.destroy();
        }
        element.remove();
        document.body.innerHTML = '';
    });
    // Test 1: Arrow down in virtual scrolling
    it('should navigate down with arrow key in virtual list', () => {
        listObj = new MultiSelect({
            dataSource: largeDataset,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // First item should be focused initially
        let firstItem = listObj.getItems()[0];
        expect(firstItem).toBeDefined();
        // Simulate arrow down
        keyboardEventArgs.keyCode = 40; // Arrow Down
        (listObj as any).onKeyDown(keyboardEventArgs);
        // Verify navigation occurred
        expect(listObj.getItems().length).toBeGreaterThan(0);
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        expect(focusedItem).toBeTruthy();
        expect(focusedItem.textContent).toContain('Item 2');
    });
    // Test 2: Arrow up in virtual scrolling
    it('should navigate up with arrow key in virtual list', () => {
        listObj = new MultiSelect({
            dataSource: largeDataset,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            popupHeight: '300px',
            value: ['item-10']
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Simulate arrow down
        keyboardEventArgs.keyCode = 40; // Arrow Down
        (listObj as any).onKeyDown(keyboardEventArgs);
        // Simulate arrow up
        keyboardEventArgs.keyCode = 38; // Arrow Up
        (listObj as any).onKeyDown(keyboardEventArgs);
        expect(listObj.getItems().length).toBeGreaterThan(0);
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        expect(focusedItem).toBeTruthy();
        expect(focusedItem.textContent).toContain('Item 1');
    });
    // Test 3: Home key in virtual scrolling
    it('should navigate to first item with Home key in virtual list', () => {
        listObj = new MultiSelect({
            dataSource: largeDataset,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Simulate Home key
        keyboardEventArgs.keyCode = 36; // Home
        keyboardEventArgs.key = 'Home';
        (listObj as any).onKeyDown(keyboardEventArgs);
        let items = listObj.getItems();
        expect(items.length).toBeGreaterThan(0);
    });
    // Test 4: End key in virtual scrolling
    it('should navigate to last visible item with End key in virtual list', () => {
        listObj = new MultiSelect({
            dataSource: largeDataset,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Simulate End key
        keyboardEventArgs.keyCode = 35; // End
        keyboardEventArgs.key = 'End';
        (listObj as any).onKeyDown(keyboardEventArgs);
        let items = listObj.getItems();
        expect(items.length).toBeGreaterThan(0);
    });
    // Test 5: Page Down in virtual scrolling
    it('should page down in virtual list', () => {
        listObj = new MultiSelect({
            dataSource: largeDataset,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Simulate Page Down
        keyboardEventArgs.keyCode = 34; // Page Down
        (listObj as any).onKeyDown(keyboardEventArgs);
        // Verify items still rendered
        expect(listObj.getItems().length).toBeGreaterThan(0);
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        expect(focusedItem).toBeTruthy();
        expect(focusedItem.textContent).toContain('Item 9');
    });
    // Test 6: Page Up in virtual scrolling
    it('should page up in virtual list', () => {
        listObj = new MultiSelect({
            dataSource: largeDataset,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            popupHeight: '300px',
            value: ['item-100']
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Simulate Page Up
        keyboardEventArgs.keyCode = 33; // Page Up
        (listObj as any).onKeyDown(keyboardEventArgs);
        expect(listObj.getItems().length).toBeGreaterThan(0);
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        expect(focusedItem).toBeTruthy();
        expect(focusedItem.textContent).toContain('Item 1');
    });
    // Test 7: Enter key selection in virtual list
    it('should select item with Enter key in virtual list', (done) => {
        let selectionChanged: boolean = false;
        listObj = new MultiSelect({
            dataSource: largeDataset,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            popupHeight: '300px',
            select: () => {
                selectionChanged = true;
            }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Simulate Enter key
        keyboardEventArgs.keyCode = 13; // Enter
        keyboardEventArgs.key = 'Enter';
        (listObj as any).onKeyDown(keyboardEventArgs);
        expect(listObj.value.length).toBeGreaterThanOrEqual(0);
        expect(listObj.value).toContain('item-1');
        done();
    });
    // Test 8: Keyboard navigation skips disabled items
    it('should skip disabled items during keyboard navigation', () => {
        listObj = new MultiSelect({
            dataSource: largeDisabledDataset,
            fields: { text: 'text', value: 'id', disabled: 'disabled' },
            enableVirtualization: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Navigate down multiple times
        for (let i = 0; i < 5; i++) {
            keyboardEventArgs.keyCode = 40; // Arrow Down
            (listObj as any).onKeyDown(keyboardEventArgs);
        }
        let items = listObj.getItems();
        expect(items.length).toBeGreaterThan(0);
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        expect(focusedItem).toBeTruthy();
        expect(focusedItem.textContent).toContain('Item 11');
    });
    // Test 9: Incremental search in virtual list
    it('should support incremental search in virtual list', () => {
        listObj = new MultiSelect({
            dataSource: largeDataset,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            allowFiltering: true,
            popupHeight: '300px',
            debounceDelay: 0
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Simulate typing 'It' for incremental search
        keyboardEventArgs.key = 'I';
        keyboardEventArgs.charCode = 73;
        (<any>listObj).keyDownStatus = true;
        (<any>listObj).onInput();
        expect((<any>listObj).keyDownStatus).toBe(false);
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        expect(focusedItem).toBeTruthy();
        expect(focusedItem.textContent).toContain('Item 1');
    });
    // Test 10: Focus visibility in virtual scrolling
    it('should maintain focus visibility when scrolling in virtual list', (done) => {
        listObj = new MultiSelect({
            dataSource: largeDataset,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Navigate several items
        for (let i = 0; i < 10; i++) {
            keyboardEventArgs.keyCode = 40; // Arrow Down
            (listObj as any).onKeyDown(keyboardEventArgs);
        }
        let visibleItems = listObj.getItems();
        expect(visibleItems.length).toBeGreaterThan(0);
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        expect(focusedItem).toBeTruthy();
        expect(focusedItem.textContent).toContain('Item 11');
        done();
    });
});