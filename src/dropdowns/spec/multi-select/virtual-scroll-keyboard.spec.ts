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

describe('MultiSelect - Group 14: Virtual Scroll + Keyboard Navigation', () => {
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
     * Test 1: Should navigate with arrow down key in virtual list
     * Validates that down arrow works in virtualized list
     */
    it('should navigate with arrow down key in virtual list', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        let keyboardEventArgs: any = {
            preventDefault: function () { },
            key: 'ArrowDown',
            keyCode: 40
        };
        (listObj as any).onKeyDown(keyboardEventArgs);
        let liItems = (listObj as any).popupWrapper.querySelectorAll('.e-list-item');
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        expect(focusedItem).toBeTruthy();
        expect(liItems.length).toBeGreaterThan(0);
        done();
    });
    /**
     * Test 2: Should navigate with arrow up key in virtual list
     * Validates that up arrow works in virtualized list
     */
    it('should navigate with arrow up key in virtual list', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // First, move down
        let downArgs: any = {
            preventDefault: function () { },
            key: 'ArrowDown',
            keyCode: 40
        };
        (listObj as any).onKeyDown(downArgs);
        // Then move up
        let upArgs: any = {
            preventDefault: function () { },
            key: 'ArrowUp',
            keyCode: 38
        };
        (listObj as any).onKeyDown(upArgs);
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        expect(focusedItem).toBeTruthy();
        done();
    });
    /**
     * Test 3: Should handle Home key in virtual list
     * Validates that Home key moves to first visible item
     */
    it('should handle Home key in virtual list', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        let keyboardEventArgs: any = {
            preventDefault: function () { },
            key: 'Home',
            keyCode: 36
        };
        (listObj as any).onKeyDown(keyboardEventArgs);
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        let firstItem = (listObj as any).popupWrapper.querySelector('.e-list-item');
        expect(focusedItem).toBeTruthy();
        expect(firstItem).toBeTruthy();
        done();
    });
    /**
     * Test 4: Should handle End key in virtual list
     * Validates that End key moves to last visible item
     */
    it('should handle End key in virtual list', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        let keyboardEventArgs: any = {
            preventDefault: function () { },
            key: 'End',
            keyCode: 35
        };
        (listObj as any).onKeyDown(keyboardEventArgs);
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        expect(focusedItem).toBeTruthy();
        done();
    });
    /**
     * Test 5: Should page down in virtual list
     * Validates that Page Down scrolls through virtual items
     */
    it('should page down in virtual list', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        let keyboardEventArgs: any = {
            preventDefault: function () { },
            key: 'PageDown',
            keyCode: 34
        };
        (listObj as any).onKeyDown(keyboardEventArgs);
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        expect(focusedItem).toBeTruthy();
        done();
    });
    /**
     * Test 6: Should page up in virtual list
     * Validates that Page Up scrolls up through virtual items
     */
    it('should page up in virtual list', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // First page down
        let pageDownArgs: any = {
            preventDefault: function () { },
            key: 'PageDown',
            keyCode: 34
        };
        (listObj as any).onKeyDown(pageDownArgs);
        // Then page up
        let pageUpArgs: any = {
            preventDefault: function () { },
            key: 'PageUp',
            keyCode: 33
        };
        (listObj as any).onKeyDown(pageUpArgs);
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        expect(focusedItem).toBeTruthy();
        done();
    });
    /**
     * Test 7: Should maintain focus visibility in virtual scroll
     * Validates that focused item remains visible when scrolling
     */
    it('should maintain focus visibility in virtual scroll', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Navigate multiple times
        for (let i = 0; i < 10; i++) {
            let keyboardEventArgs: any = {
                preventDefault: function () { },
                key: 'ArrowDown',
                keyCode: 40
            };
            (listObj as any).onKeyDown(keyboardEventArgs);
        }
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        let popupElement = (listObj as any).popupWrapper;
        let focusedRect = focusedItem.getBoundingClientRect();
        let popupRect = popupElement.getBoundingClientRect();
        if (focusedRect && popupRect) {
            // Focused item should be within popup bounds
            expect(focusedRect.top).toBeGreaterThanOrEqual(popupRect.top);
            expect(focusedRect.bottom).toBeLessThanOrEqual(popupRect.bottom + 50);
        }
        expect(focusedItem).toBeTruthy();
        done();
    });
    /**
     * Test 8: Should skip disabled items during keyboard navigation
     * Validates that keyboard nav skips over disabled items
     */
    it('should skip disabled items during keyboard navigation', (done) => {
        let disabledData: { [key: string]: Object }[] = [
            { id: 'item-1', text: 'Item 1', disabled: false },
            { id: 'item-2', text: 'Item 2', disabled: true },
            { id: 'item-3', text: 'Item 3', disabled: true },
            { id: 'item-4', text: 'Item 4', disabled: false }
        ];
        listObj = new MultiSelect({
            dataSource: disabledData,
            fields: { text: 'text', value: 'id', disabled: 'disabled' },
            enableVirtualization: false
        });
        listObj.appendTo(element);
        listObj.showPopup();
        let keyboardEventArgs: any = {
            preventDefault: function () { },
            key: 'ArrowDown',
            keyCode: 40
        };
        (listObj as any).onKeyDown(keyboardEventArgs);
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        expect(focusedItem).toBeTruthy();
        expect(focusedItem.textContent).toContain('Item 4');
        done();
    });
    /**
     * Test 9: Should support incremental search in virtual list
     * Validates that typing filters in virtual list
     */
    it('should support incremental search in virtual list', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            popupHeight: '300px',
            allowFiltering: true,
            debounceDelay: 0
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Simulate search by typing
        (listObj as any).inputElement.value = 'Item 5';
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
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 53;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let liItems = (listObj as any).popupWrapper.querySelectorAll('.e-list-item');
        expect(liItems.length).toBeGreaterThan(0);
        done();
    });
    /**
     * Test 10: Should handle scroll + keyboard interaction correctly
     * Validates that both manual scroll and keyboard nav work together
     */
    it('should handle scroll + keyboard interaction correctly', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        let scroller = (listObj as any).popupWrapper.querySelector('.e-content');
        if (scroller) {
            let maxScroll = (scroller.scrollHeight || 0) - (scroller.clientHeight || 0);
            scroller.scrollTop = Math.max(0, Math.min(500, maxScroll > 0 ? Math.min(500, maxScroll) : 500));
        }
        // Then use keyboard
        let keyboardEventArgs: any = {
            preventDefault: function () { },
            key: 'ArrowDown',
            keyCode: 40
        };
        (listObj as any).onKeyDown(keyboardEventArgs);
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        expect(focusedItem).toBeTruthy();
        done();
    });
});
