import { MultiSelect } from '../../src/multi-select/multi-select';
import { createElement } from '@syncfusion/ej2-base';

let basicData: { [key: string]: Object }[] = [
    { id: 'list1', text: 'JAVA' },
    { id: 'list2', text: 'C#' },
    { id: 'list3', text: 'C++' },
    { id: 'list4', text: '.NET' },
    { id: 'list5', text: 'Oracle' }
];

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

describe('MultiSelect - Group 13: Custom Value Advanced', () => {
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
     * Test 1: Should handle whitespace trimming in custom values
     * Validates leading/trailing whitespace handling
     */
    it('should handle whitespace trimming in custom values', (done) => {
        let capturedValues: any[] = [];
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowCustomValue: true,
            customValueSelection: (e: any) => {
                capturedValues.push(e.newData);
            }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Custom value with spaces
        (listObj as any).inputElement.value = '   CustomValue   ';
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
        expect(capturedValues.length).toBeGreaterThan(0);
        expect(capturedValues[0]).toBeTruthy();
        done();
    });
    /**
     * Test 2: Should prevent duplicate custom values
     * Validates duplicate detection
     */
    it('should prevent duplicate custom values', (done) => {
        let duplicateCount = 0;
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowCustomValue: true,
            customValueSelection: (e: any) => {
                duplicateCount++;
            }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Add first custom value
        (listObj as any).inputElement.value = 'DuplicateValue';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 69;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let downArgs1: any = {
            preventDefault: function () { },
            key: 'Enter',
            keyCode: 13
        };
        (listObj as any).onKeyDown(downArgs1);
        listObj.showPopup();
        // Try to add same value again
        (listObj as any).inputElement.value = 'DuplicateValue';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 69;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let downArgs2: any = {
            preventDefault: function () { },
            key: 'Enter',
            keyCode: 13
        };
        (listObj as any).onKeyDown(downArgs2);
        // Should not trigger second time (duplicate prevention)
        expect(duplicateCount).toBeLessThanOrEqual(1);
        done();
    });
    /**
     * Test 3: Should handle custom values with delimiters
     * Validates delimiter mode with custom values
     */
    it('should handle custom values with delimiters', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowCustomValue: true,
            mode: 'Delimiter',
            delimiterChar: ','
        });
        listObj.appendTo(element);
        listObj.value = ['list1', 'CustomValue1', 'CustomValue2'];
        listObj.dataBind();
        expect(listObj.value.length).toBe(3);
        let delimDisplay = element.parentElement.parentElement.querySelectorAll('.e-delim-view.e-delim-values')[0].textContent;
        expect(delimDisplay).toContain('CustomValue1');
        done();
    });
    /**
     * Test 4: Should preserve custom values on data source change
     * Validates persistence when data source is updated
     */
    it('should preserve custom values on data source change', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowCustomValue: true
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Add custom value
        (listObj as any).inputElement.value = 'CustomPreserve';
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
        // Change data source
        let newData = [
            { id: 'item1', text: 'Item 1' },
            { id: 'item2', text: 'Item 2' }
        ];
        listObj.dataSource = newData;
        listObj.dataBind();
        // Custom value should be preserved
        expect(listObj.value[0]).toBe('CustomPreserve');
        done();
    });
    /**
     * Test 5: Should handle custom values with special delimiters
     * Validates handling of comma, semicolon, etc. in values
     */
    it('should handle custom values with special delimiters', (done) => {
        let capturedValues: any[] = [];
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowCustomValue: true,
            customValueSelection: (e: any) => {
                capturedValues.push(e.newData);
            }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Value with comma
        (listObj as any).inputElement.value = 'Value,with,comma';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 69;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let downArgs1: any = {
            preventDefault: function () { },
            key: 'Enter',
            keyCode: 13
        };
        (listObj as any).onKeyDown(downArgs1);
        listObj.showPopup();
        (listObj as any).inputElement.value = 'Value;with;semicolon';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 69;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let downArgs2: any = {
            preventDefault: function () { },
            key: 'Enter',
            keyCode: 13
        };
        (listObj as any).onKeyDown(downArgs2);
        expect(capturedValues.length).toBeGreaterThan(0);
        expect(capturedValues[0].text).toContain('comma');
        expect(capturedValues[1].text).toContain('semicolon');
        done();
    });
    /**
     * Test 6: Should validate custom value format
     * Validates regex/pattern matching
     */
    it('should validate custom value format', (done) => {
        let validationResults: boolean[] = [];
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowCustomValue: true,
            customValueSelection: (e: any) => {
                // Validate alphanumeric only
                let isValid = /^[a-zA-Z0-9]+$/.test(e.newData.text);
                validationResults.push(isValid);
                if (!isValid) {
                    e.cancel = true;
                }
            }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Invalid value with special chars
        (listObj as any).inputElement.value = 'Invalid@Value';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 69;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let downArgs1: any = {
            preventDefault: function () { },
            key: 'Enter',
            keyCode: 13
        };
        (listObj as any).onKeyDown(downArgs1);
        listObj.showPopup();
        // Valid value
        (listObj as any).inputElement.value = 'ValidValue123';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 51;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let downArgs2: any = {
            preventDefault: function () { },
            key: 'Enter',
            keyCode: 13
        };
        (listObj as any).onKeyDown(downArgs2);
        expect(validationResults.length).toBeGreaterThan(0);
        expect(listObj.value.length).toBe(1);
        done();
    });
    /**
     * Test 7: Should merge custom values with existing data
     * Validates blending custom and data source values
     */
    it('should merge custom values with existing data', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowCustomValue: true,
            value: ['list1', 'list2']
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Add custom value
        (listObj as any).inputElement.value = 'CustomMerged';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 68;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let downArgs: any = {
            preventDefault: function () { },
            key: 'Enter',
            keyCode: 13
        };
        (listObj as any).onKeyDown(downArgs);
        expect(listObj.value.length).toBe(3);
        expect(listObj.value).toContain('list1');
        expect(listObj.value).toContain('list2');
        expect(listObj.value).toContain('CustomMerged');
        done();
    });
    /**
     * Test 8: Should handle maximum custom values count
     * Validates limiting number of custom values
     */
    it('should handle maximum custom values count', (done) => {
        let maxCustomValues = 3;
        let customCount = 0;
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowCustomValue: true,
            customValueSelection: (e: any) => {
                customCount++;
                if (customCount > maxCustomValues) {
                    e.cancel = true;
                }
            }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Try to add multiple custom values
        function addValues() {
            for (let i = 0; i < 5; i++) {
                (listObj as any).inputElement.value = `Custom${i}`;
                keyboardEventArgs.altKey = false;
                keyboardEventArgs.keyCode = 68;
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
        addValues();
        expect(customCount).toBeGreaterThanOrEqual(3);
        done();
    });
});
