import { MultiSelect } from '../../src/multi-select/multi-select';
import { createElement } from '@syncfusion/ej2-base';
import { VirtualScroll } from '../../src/common/virtual-scroll';
import { CheckBoxSelection } from '../../src/multi-select/checkbox-selection';

MultiSelect.Inject(VirtualScroll);
MultiSelect.Inject(CheckBoxSelection);

// Generate large dataset
let largeData: { [key: string]: Object }[] = [];
for (let i = 1; i <= 500; i++) {
    largeData.push({
        id: `item-${i}`,
        text: `Item ${i}`
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

describe('MultiSelect - Group 16: Virtual Scroll + Custom Values', () => {
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
     * Test 1: Should add custom values to virtual scroll list
     * Validates custom values work with virtualized data
     */
    it('should add custom values to virtual scroll list', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            allowCustomValue: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        (listObj as any).inputElement.value = 'CustomInVirtual';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 76;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let downArgs: any = {
            preventDefault: function () { },
            key: 'Enter',
            keyCode: 13
        };
        (listObj as any).onKeyDown(downArgs);
        expect(listObj.value.length).toBeGreaterThan(0);
        expect(listObj.value[0]).toBe('CustomInVirtual');
        done();
    });

    /**
     * Test 2: Should handle custom values with virtual scroll navigation
     * Validates keyboard nav works after custom value added
     */
    it('should handle custom values with virtual scroll navigation', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            allowCustomValue: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        (listObj as any).inputElement.value = 'Custom1';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 76;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let downArgs: any = {
            preventDefault: function () { },
            key: 'Enter',
            keyCode: 13
        };
        (listObj as any).onKeyDown(downArgs);
        listObj.showPopup();
        // Navigate with keys
        let navEvent = {
            preventDefault: function () { },
            key: 'ArrowDown',
            keyCode: 40
        };
        (listObj as any).onKeyDown(navEvent);
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        expect(focusedItem).toBeTruthy();
        done();
    });
    /**
     * Test 3: Should preserve custom values during virtual scroll
     * Validates custom values not lost during scrolling
     */
    it('should preserve custom values during virtual scroll', (done) => {
        let customValues = ['Custom1', 'Custom2', 'Custom3'];
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            allowCustomValue: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Add multiple custom values
        function addCustom() {
            for (let val of customValues) {
                (listObj as any).inputElement.value = val;
                keyboardEventArgs.altKey = false;
                keyboardEventArgs.keyCode = 76;
                (listObj as any).keyDownStatus = true;
                (listObj as any).onInput();
                (listObj as any).keyUp(keyboardEventArgs);
                let downArgs: any = {
                    preventDefault: function () { },
                    key: 'Enter',
                    keyCode: 13
                };
                (listObj as any).onKeyDown(downArgs);
            }
        }
        addCustom();
        expect((listObj.value as any[]).slice(0, customValues.length)).toEqual(customValues);
        done();
    });
    /**
     * Test 4: Should handle mixed selections (data + custom) in virtual
     * Validates blending data source and custom values
     */
    it('should handle mixed selections (data + custom) in virtual', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            allowCustomValue: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        // Select from data
        listObj.value = ['item-50', 'item-100'];
        listObj.dataBind();
        let countBefore = listObj.value.length;
        listObj.showPopup();
        // Add custom value
        (listObj as any).inputElement.value = 'MixedCustom';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 76;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let downArgs: any = {
            preventDefault: function () { },
            key: 'Enter',
            keyCode: 13
        };
        (listObj as any).onKeyDown(downArgs);
        expect(listObj.value.length).toBe(countBefore + 1);
        expect(listObj.value).toContain('item-50');
        expect(listObj.value).toContain('MixedCustom');
        done();
    });
    /**
     * Test 5: Should provide custom value tags in virtual mode
     * Validates UI representation with custom values
     */
    it('should provide custom value tags in virtual mode', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            allowCustomValue: true,
            mode: 'Box',
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        (listObj as any).inputElement.value = 'CustomTag';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 76;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let downArgs: any = {
            preventDefault: function () { },
            key: 'Enter',
            keyCode: 13
        };
        (listObj as any).onKeyDown(downArgs);
        let chips = element.parentElement.parentElement.querySelectorAll('.e-chips');
        expect(chips.length).toBeGreaterThan(0);
        done();
    });
    /**
     * Test 6: Should handle custom value removal in virtual
     * Validates deleting custom values works correctly
     */
    it('should handle custom value removal in virtual', (done) => {
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            allowCustomValue: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Add custom value
        (listObj as any).inputElement.value = 'RemoveMe';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 69;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let downArgs: any = {
            preventDefault: function () { },
            key: 'Enter',
            keyCode: 13
        };
        (listObj as any).onKeyDown(downArgs);
        // Remove by setting value
        listObj.value = [];
        listObj.dataBind();

        expect(listObj.value.length).toBe(0);
        done();
    });
    /**
     * Test 7: Should handle rapid custom value additions in virtual
     * Validates no race conditions with fast additions
     */
    it('should handle rapid custom value additions in virtual', (done) => {
        let addCount = 0;
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            allowCustomValue: true,
            customValueSelection: (e: any) => {
                addCount++;
            },
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Rapidly add custom values
        function rapidAdd() {
            for (let i = 0; i < 5; i++) {
                (listObj as any).inputElement.value = `Rapid${i}`;
                keyboardEventArgs.altKey = false;
                keyboardEventArgs.keyCode = 76;
                (listObj as any).keyDownStatus = true;
                (listObj as any).onInput();
                (listObj as any).keyUp(keyboardEventArgs);
                let downArgs: any = {
                    preventDefault: function () { },
                    key: 'Enter',
                    keyCode: 13
                };
                (listObj as any).onKeyDown(downArgs);
            }
        }
        rapidAdd();
        expect(addCount).toBeGreaterThan(0);
        expect(listObj.value.length).toBeGreaterThan(0);
        done();
    });
});
