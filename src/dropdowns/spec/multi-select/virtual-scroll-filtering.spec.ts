import { MultiSelect } from '../../src/multi-select/multi-select';
import { createElement } from '@syncfusion/ej2-base';
import { VirtualScroll } from '../../src/common/virtual-scroll';
import { CheckBoxSelection } from '../../src/multi-select/checkbox-selection';

MultiSelect.Inject(VirtualScroll);
MultiSelect.Inject(CheckBoxSelection);

// Generate large dataset for virtual scrolling
let largeData: { [key: string]: Object }[] = [];
for (let i = 1; i <= 1000; i++) {
    largeData.push({
        id: `item-${i}`,
        text: `Item ${i}`,
        category: `Category ${Math.floor(i / 100) + 1}`
    });
}

let keyboardEventArgs: any = {
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

describe('MultiSelect - Group 15: Virtual Scroll + Filtering', () => {
    let listObj: MultiSelect;
    let element: HTMLInputElement;
    beforeEach((): void => {
        element = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        document.body.appendChild(element);
    });
    afterEach((): void => {
        if (listObj) {
            listObj.destroy();
        }
        if (element) {
            element.remove();
        }
        document.body.innerHTML = '';
    });
    /**
     * Test 1: Should filter items in virtual list
     * Validates that filtering works with virtual scrolling
     */
    it('should filter items in virtual list', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            allowFiltering: true,
            popupHeight: '300px',
            debounceDelay: 0
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Set filter input
        (listObj as any).inputElement.value = 'Item 5';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 53;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let liItems = (listObj as any).popupWrapper.querySelectorAll('.e-list-item:not(.e-virtual-list)');
        expect(liItems.length).toBeGreaterThan(0);
        let firstItemText = liItems[0].textContent;
        expect(firstItemText).toContain('5');
        done();
    });
    /**
     * Test 2: Should maintain virtualization during filtering
     * Validates that virtual rendering continues after filter
     */
    it('should maintain virtualization during filtering', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            allowFiltering: true,
            popupHeight: '300px',
            debounceDelay: 0
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Simulate filter
        (listObj as any).inputElement.value = 'Item';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 77;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let renderedItems = (listObj as any).popupWrapper.querySelectorAll('.e-list-item');
        // Should render subset, not all items
        expect(renderedItems.length).toBeLessThan(largeData.length);
        expect(renderedItems.length).toBeGreaterThan(0);
        done();
    });
    /**
     * Test 3: Should clear filter and restore virtual scrolling
     * Validates reset of filter maintains virtualization
     */
    it('should clear filter and restore virtual scrolling', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            allowFiltering: true,
            popupHeight: '300px',
            debounceDelay: 0
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Apply filter
        (listObj as any).inputElement.value = 'Item 100';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 48;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let filteredCount = (listObj as any).popupWrapper.querySelectorAll('.e-list-item').length;
        // Clear filter
        (listObj as any).inputElement.value = '';
        keyboardEventArgs.keyCode = 8;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let unfilteredCount = (listObj as any).popupWrapper.querySelectorAll('.e-list-item').length;
        expect(unfilteredCount).toBeGreaterThan(filteredCount);
        done();
    });
    /**
     * Test 4: Should handle no results in virtual filtered list
     * Validates behavior when filter matches nothing
     */
    it('should handle no results in virtual filtered list', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            allowFiltering: true,
            popupHeight: '300px',
            debounceDelay: 0
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Filter that matches nothing
        (listObj as any).inputElement.value = 'XYZ_NO_MATCH_ABC';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 90;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let liItems = (listObj as any).popupWrapper.querySelectorAll('.e-list-item');
        expect(liItems.length).toBe(0);
        done();
    });
    /**
     * Test 5: Should filter with custom operators in virtual scroll
     * Validates advanced filtering in virtual list
     */
    it('should filter with custom operators in virtual scroll', (done) => {
        let filterResults: string;
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            allowFiltering: true,
            popupHeight: '300px',
            filtering: (e: any) => {
                filterResults = e.text;
            },
            debounceDelay: 0
        });
        listObj.appendTo(element);
        listObj.showPopup();
        (listObj as any).inputElement.value = 'Item 1';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 49;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        expect(filterResults).toBe('Item 1');
        done();
    });
    /**
     * Test 6: Should maintain selection while filtering in virtual list
     * Validates that selected items remain marked during filter
     */
    it('should maintain selection while filtering in virtual list', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            allowFiltering: true,
            value: ['item-100', 'item-200'],
            popupHeight: '300px',
            debounceDelay: 0
        });
        listObj.appendTo(element);
        listObj.showPopup();
        let selectedBefore = listObj.value.length;
        // Apply filter
        (listObj as any).inputElement.value = 'Item 1';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 49;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let selectedAfter = listObj.value.length;
        expect(selectedAfter).toBe(selectedBefore);
        done();
    });
    /**
     * Test 7: Should handle rapid filter changes in virtual scroll
     * Validates no race conditions with quick filtering
     */
    it('should handle rapid filter changes in virtual scroll', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            allowFiltering: true,
            popupHeight: '300px',
            debounceDelay: 0
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Simulate rapid typing
        let filters = ['I', 'It', 'Ite', 'Item', 'Item ', 'Item 1', 'Item 10'];
        function applyFilters() {
            for (let filter of filters) {
                (listObj as any).inputElement.value = filter;
                // simulate keystroke handling used in other tests
                let lastChar = filter.length ? filter[filter.length - 1] : '';
                keyboardEventArgs.altKey = false;
                keyboardEventArgs.key = lastChar;
                keyboardEventArgs.char = lastChar;
                keyboardEventArgs.charCode = lastChar ? lastChar.charCodeAt(0) : 0;
                keyboardEventArgs.keyCode = keyboardEventArgs.charCode;
                keyboardEventArgs.which = keyboardEventArgs.charCode;
                (listObj as any).keyDownStatus = true;
                (listObj as any).onInput();
                (listObj as any).keyUp(keyboardEventArgs);
            }
        }
        applyFilters();
        let liItems = (listObj as any).popupWrapper.querySelectorAll('.e-list-item');
        expect(liItems.length).toBeGreaterThan(0);
        let firstItemText = liItems[0].textContent;
        expect(firstItemText).toContain('10');
        done();
    });
    /**
     * Test 8: Should paginate while filtering in virtual scroll
     * Validates page up/down works with active filter
     */
    it('should paginate while filtering in virtual scroll', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            allowFiltering: true,
            popupHeight: '300px',
            debounceDelay: 0
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Apply filter
        (listObj as any).inputElement.value = 'Item 5';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 53;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        // Page down
        let pageEvent = {
            preventDefault: function () { },
            key: 'PageDown',
            keyCode: 34
        };
        (listObj as any).onKeyDown(pageEvent);
        let itemsAfter = (listObj as any).popupWrapper.querySelectorAll('.e-list-item:not(.e-virtual-list)').length;
        expect(itemsAfter).toBeGreaterThan(0);
        done();
    });
});
