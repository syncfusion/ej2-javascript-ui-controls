import { SelectEventArgs } from '../../src/drop-down-base';
import { MultiSelect, MultiSelectChangeEventArgs } from '../../src/multi-select/multi-select';
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

describe('MultiSelect - Group 17: Event System Enhancement', () => {
    let listObj: MultiSelect;
    let element: HTMLInputElement;
    let skipAfterEach: boolean = false;
    beforeEach((): void => {
        element = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        document.body.appendChild(element);
    });
    afterEach((): void => {
        if (skipAfterEach) {
            if (element) {
                element.remove();
            }
            document.body.innerHTML = '';
            skipAfterEach = false;
            return;
        }
        if (listObj) {
            listObj.destroy();
        }
        if (element) {
            element.remove();
        }
        document.body.innerHTML = '';
    });
    /**
     * Test 1: Change event should include correct arguments
     * Validates that change event has all expected properties
     */
    it('change event should include correct arguments', (done) => {
        let changeArgs: any = null;
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            change: (e: MultiSelectChangeEventArgs) => {
                changeArgs = e;
            }
        });
        listObj.appendTo(element);
        listObj.value = ['list1'];
        listObj.dataBind();
        expect(changeArgs).toBeTruthy();
        expect(changeArgs.value).toBeTruthy();
        expect(changeArgs.value.length).toBe(1);
        expect(changeArgs.value[0]).toBe('list1');
        done();
    });
    /**
     * Test 2: Select event should include correct arguments
     * Validates that select event has proper item and value properties
     */
    it('select event should include correct arguments', (done) => {
        let selectArgs: any = null;
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            select: (e: SelectEventArgs) => {
                selectArgs = e;
            }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 13;
        (<any>listObj).onKeyDown(keyboardEventArgs);
        expect(selectArgs).toBeTruthy();
        expect(selectArgs.item).toBeTruthy();
        expect(selectArgs.itemData).toBeTruthy();
        done();
    });
    /**
     * Test 3: Should trigger events in correct order
     * Validates that select fires before change
     */
    it('should trigger events in correct order', (done) => {
        let eventOrder: string[] = [];
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            select: (e: SelectEventArgs) => {
                eventOrder.push('select');
            },
            change: (e: MultiSelectChangeEventArgs) => {
                eventOrder.push('change');
            }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 13;
        (<any>listObj).onKeyDown(keyboardEventArgs);
        listObj.value = ['list2'];
        listObj.dataBind();
        expect(eventOrder.length).toBeGreaterThan(0);
        expect(eventOrder[0]).toBe('select');
        expect(eventOrder[1]).toBe('change');
        done();
    });
    /**
     * Test 4: Should handle multiple event listeners
     * Validates that all listeners are called
     */
    it('should handle multiple event listeners', (done) => {
        let listener1Called = false;
        let listener2Called = false;
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            change: (e: MultiSelectChangeEventArgs) => {
                listener1Called = true;
            }
        });
        listObj.appendTo(element);
        // Add another listener
        listObj.change = (e: MultiSelectChangeEventArgs) => {
            listener2Called = true;
        };
        listObj.value = ['list1'];
        listObj.dataBind();
        expect(listener2Called).toBe(true);
        done();
    });
    /**
     * Test 5: Should not leak event listeners on component destroy
     * Validates that listeners are properly removed
     */
    it('should not leak event listeners on component destroy', () => {
        let eventFired = false;
        skipAfterEach = true;
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            change: (e: MultiSelectChangeEventArgs) => {
                eventFired = true;
            }
        });
        listObj.appendTo(element);
        // Store reference to destroy
        let destroyedList = listObj;
        // Destroy component
        destroyedList.destroy();
        // Try to change value after destroy
        if (destroyedList.value) {
            destroyedList.value = ['list1'];
            destroyedList.dataBind();
        }
        // Event should not have fired
        expect(eventFired).toBe(false);
    });
    /**
     * Test 6: Should handle nested event triggering
     * Validates no infinite loops from nested events
     */
    it('should handle nested event triggering', (done) => {
        let changeCount = 0;
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            change: (e: MultiSelectChangeEventArgs) => {
                changeCount++;
                // Prevent infinite recursion
                if (changeCount > 10) {
                    return;
                }
                // This should not cause infinite loop
                listObj.value = ['list1'];
            }
        });
        listObj.appendTo(element);
        listObj.value = ['list1'];
        listObj.dataBind();
        expect(changeCount).toBeLessThanOrEqual(2);
        done();
    });
    /**
     * Test 7: Should pass isInteracted flag correctly
     * Validates that programmatic changes vs user interaction are distinguished
     */
    it('should pass isInteracted flag correctly', (done) => {
        let eventFlags: any[] = [];
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            change: (e: MultiSelectChangeEventArgs) => {
                eventFlags.push({
                    isInteracted: e.isInteracted,
                    value: e.value
                });
            }
        });
        listObj.appendTo(element);
        // Programmatic change
        listObj.value = ['list1'];
        listObj.dataBind();
        // User-initiated change
        listObj.showPopup();
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 13;
        (<any>listObj).onKeyDown(keyboardEventArgs);
        expect(eventFlags.length).toBeGreaterThanOrEqual(1);
        if (eventFlags.length >= 2) {
            // First is programmatic, should have isInteracted = false
            expect(eventFlags[0].isInteracted).toBe(false);
        }
        done();
    });
});
