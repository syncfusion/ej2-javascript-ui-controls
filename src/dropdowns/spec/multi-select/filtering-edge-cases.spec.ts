import { MultiSelect } from '../../src/multi-select/multi-select';
import { createElement } from '@syncfusion/ej2-base';

let basicData: { [key: string]: Object }[] = [
    { id: 'list1', text: 'JAVA' },
    { id: 'list2', text: 'JavaScript' },
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

describe('MultiSelect - Group 22: Filtering Edge Cases', () => {
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
     * Test 1: Should handle case-insensitive filtering
     * Validates filter ignores case
     */
    it('should handle case-insensitive filtering', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowFiltering: true,
            filterType: 'Contains',
            ignoreCase: true,
            debounceDelay: 0
        });
        listObj.appendTo(element);
        listObj.showPopup();
        (listObj as any).inputElement.value = 'java';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 65;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let items = (listObj as any).popupWrapper.querySelectorAll('.e-list-item');
        // Should match both JAVA and JavaScript
        expect(items.length).toBe(2);
        done();
    });
    /**
     * Test 2: Should handle special characters in filter
     * Validates filtering with regex special chars
     */
    it('should handle special characters in filter', (done) => {
        let specialData = [
            { id: '1', text: 'C++ Programming' },
            { id: '2', text: 'C# .NET' },
            { id: '3', text: 'Java/Kotlin' }
        ];
        listObj = new MultiSelect({
            dataSource: specialData,
            fields: { text: 'text', value: 'id' },
            allowFiltering: true,
            debounceDelay: 0
        });
        listObj.appendTo(element);
        listObj.showPopup();
        (listObj as any).inputElement.value = 'C++';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 187;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let items = (listObj as any).popupWrapper.querySelectorAll('.e-list-item');
        expect(items.length).toBe(1);
        done();
    });
    /**
     * Test 3: Should handle empty filter results gracefully
     * Validates behavior when filter matches nothing
     */
    it('should handle empty filter results gracefully', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowFiltering: true,
            debounceDelay: 0
        });
        listObj.appendTo(element);
        listObj.showPopup();
        (listObj as any).inputElement.value = 'NOMATCH123';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 51;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let items = (listObj as any).popupWrapper.querySelectorAll('.e-list-item');
        expect(items.length).toBe(0);
        done();
    });
    /**
     * Test 4: Should handle whitespace in filter
     * Validates filter with leading/trailing spaces
     */
    it('should handle whitespace in filter', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowFiltering: true,
            debounceDelay: 0
        });
        listObj.appendTo(element);
        listObj.showPopup();
        (listObj as any).inputElement.value = '  JAVA  ';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 65;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let items = (listObj as any).popupWrapper.querySelectorAll('.e-list-item');
        expect(items.length).toBe(0);
        done();
    });
    /**
     * Test 5: Should handle unicode characters in filter
     * Validates filtering with international characters
     */
    it('should handle unicode characters in filter', (done) => {
        let unicodeData = [
            { id: '1', text: 'Java' },
            { id: '2', text: '中文编程' },
            { id: '3', text: 'العربية' }
        ];
        listObj = new MultiSelect({
            dataSource: unicodeData,
            fields: { text: 'text', value: 'id' },
            allowFiltering: true,
            debounceDelay: 0
        });
        listObj.appendTo(element);
        listObj.showPopup();
        (listObj as any).inputElement.value = '中文';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 87;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let items = (listObj as any).popupWrapper.querySelectorAll('.e-list-item');
        expect(items.length).toBe(1);
        done();
    });
    /**
     * Test 6: Should preserve selections during filtering
     * Validates selected items stay marked through filter
     */
    it('should preserve selections during filtering', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowFiltering: true,
            value: ['list1', 'list2'],
            debounceDelay: 0
        });
        listObj.appendTo(element);
        let selectionsBefore = listObj.value.length;
        listObj.showPopup();
        (listObj as any).inputElement.value = 'Java';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 65;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let selectionsAfter = listObj.value.length;
        expect(selectionsAfter).toBe(selectionsBefore);
        done();
    });
    /**
     * Test 7: Should handle very long filter strings
     * Validates filtering doesn't break with long input
     */
    it('should handle very long filter strings', (done) => {
        let longFilterData = [
            { id: '1', text: 'Short' },
            { id: '2', text: 'This is a very long text entry that contains multiple words and should still filter correctly' }
        ];
        listObj = new MultiSelect({
            dataSource: longFilterData,
            fields: { text: 'text', value: 'id' },
            allowFiltering: true,
            debounceDelay: 0
        });
        listObj.appendTo(element);
        listObj.showPopup();
        let longFilter = 'This is a very long text entry that contains';
        (listObj as any).inputElement.value = longFilter;
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 83;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let items = (listObj as any).popupWrapper.querySelectorAll('.e-list-item');
        expect(items.length).toBe(1);
        done();
    });
    /**
     * Test 8: Should handle filter clear and restore
     * Validates behavior when filter is cleared
     */
    it('should handle filter clear and restore', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowFiltering: true,
            debounceDelay: 0
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Apply filter
        (listObj as any).inputElement.value = 'Java';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 65;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let filteredCount = (listObj as any).popupWrapper.querySelectorAll('.e-list-item').length;
        // Clear filter
        (listObj as any).inputElement.value = '';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 8;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let restoredCount = (listObj as any).popupWrapper.querySelectorAll('.e-list-item').length;
        // Should have more items after clearing filter
        expect(restoredCount).toBeGreaterThanOrEqual(filteredCount);
        done();
    });
});
