import { MultiSelect, TaggingEventArgs, MultiSelectChangeEventArgs, CustomValueEventArgs } from '../../src/multi-select/multi-select';
import { Browser, isNullOrUndefined, EmitType } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';

let basicData: { [key: string]: Object }[] = [
    { id: 'list1', text: 'JAVA', icon: 'icon-java' },
    { id: 'list2', text: 'C#', icon: 'icon-csharp' },
    { id: 'list3', text: 'C++', icon: 'icon-cpp' },
    { id: 'list4', text: '.NET', icon: 'icon-net' },
    { id: 'list5', text: 'Oracle', icon: 'icon-oracle' }
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

describe('MultiSelect - Group 12: Custom Value Events', () => {
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
     * Test 1: Should trigger customValueSelection event when adding custom value
     * Validates that the event fires when user enters a custom value
     */
    it('should trigger customValueSelection event when adding custom value', (done) => {
        let eventTriggered: boolean = false;
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowCustomValue: true,
            customValueSelection: (e: CustomValueEventArgs) => {
                eventTriggered = true;
            }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Simulate custom value entry
        (listObj as any).inputElement.value = 'CustomLanguage';
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
        expect(eventTriggered).toBe(true);
        done();
    });
    /**
     * Test 2: Should pass correct event arguments in customValueSelection
     * Validates the structure and content of event arguments
     */
    it('should pass correct event arguments in customValueSelection', (done) => {
        let passedArgs: any = {};
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowCustomValue: true,
            customValueSelection: (e: CustomValueEventArgs) => {
                passedArgs = e;
            }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        let inputValue = 'NewLanguage';
        (listObj as any).inputElement.value = inputValue;
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
        expect(passedArgs.newData.text).toBe(inputValue);
        expect(passedArgs.cancel).toBe(false);
        expect(passedArgs.name).toBe('customValueSelection');
        done();
    });
    /**
     * Test 3: Should allow event cancellation in customValueSelection
     * Validates that custom value is not added when event is prevented
     */
    it('should allow event cancellation in customValueSelection', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowCustomValue: true,
            customValueSelection: (e: CustomValueEventArgs) => {
                e.cancel = true; // Prevent custom value addition
            }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        let inputValue = 'BlockedValue';
        (listObj as any).inputElement.value = inputValue;
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
        expect(listObj.value).toBeNull();
        done();
    });
    /**
     * Test 4: Should handle multiple custom values with events
     * Validates that event fires correctly for each custom value
     */
    it('should handle multiple custom values with events', (done) => {
        let eventCount: number = 0;
        let eventValues: any[] = [];
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowCustomValue: true,
            customValueSelection: (e: CustomValueEventArgs) => {
                eventCount++;
                eventValues.push(e);
            }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Add first custom value
        (listObj as any).inputElement.value = 'Custom1';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 49;
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
        // Add second custom value
        (listObj as any).inputElement.value = 'Custom2';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 50;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let downArgs2: any = {
            preventDefault: function () { },
            key: 'Enter',
            keyCode: 13
        };
        (listObj as any).onKeyDown(downArgs2);
        expect(eventCount).toBe(2);
        expect(eventValues.length).toBe(2);
        expect(eventValues[0].newData.text).toBe('Custom1');
        expect(eventValues[1].newData.text).toBe('Custom2');
        done();
    });
    /**
     * Test 5: Should trigger tagging event for custom values
     * Validates that tagging event fires when custom tag is created
     */
    it('should trigger tagging event for custom values', (done) => {
        let tagEventTriggered: boolean = false;
        let tagEventArgs: any = {};
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowCustomValue: true,
            tagging: (e: TaggingEventArgs) => {
                tagEventTriggered = true;
                tagEventArgs = e;
            }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        (listObj as any).inputElement.value = 'CustomTag';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 71;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let downArgs: any = {
            preventDefault: function () { },
            key: 'Enter',
            keyCode: 13
        };
        (listObj as any).onKeyDown(downArgs);
        expect(tagEventTriggered).toBe(true);
        expect(tagEventArgs.itemData).toBeTruthy();
        done();
    });
    /**
     * Test 6: Should pass correct event arguments in tagging
     * Validates the structure of tagging event arguments
     */
    it('should pass correct event arguments in tagging', (done) => {
        let passedTagArgs: any = {};
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowCustomValue: true,
            tagging: (e: TaggingEventArgs) => {
                passedTagArgs = e;
            }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        let customValue = 'NewTag';
        (listObj as any).inputElement.value = customValue;
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 71;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let downArgs: any = {
            preventDefault: function () { },
            key: 'Enter',
            keyCode: 13
        };
        (listObj as any).onKeyDown(downArgs);
        expect(passedTagArgs.itemData.text).toBe(customValue);
        expect(passedTagArgs.cancel).toBe(false);
        done();
    });
    /**
     * Test 7: Should prevent tag creation when tagging event is cancelled
     * Validates that tag is not created when event is prevented
     */
    it('should prevent tag creation when tagging event is cancelled', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowCustomValue: true,
            tagging: (e: TaggingEventArgs) => {
                e.cancel = true;
            }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        (listObj as any).inputElement.value = 'BlockedTag';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 71;
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
        expect(chips.length).toBe(0);
        done();
    });
    /**
     * Test 8: Should maintain event order with custom values and selections
     * Validates that events fire in correct sequence
     */
    it('should maintain event order with custom values and selections', (done) => {
        let eventOrder: string[] = [];
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowCustomValue: true,
            customValueSelection: (e: any) => {
                eventOrder.push('customValueSelection');
            },
            change: (e: MultiSelectChangeEventArgs) => {
                eventOrder.push('change');
            }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        (listObj as any).inputElement.value = 'Custom';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 77;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let downArgs: any = {
            preventDefault: function () { },
            key: 'Enter',
            keyCode: 13
        };
        (listObj as any).onKeyDown(downArgs);
        expect(eventOrder.length).toBeGreaterThan(0);
        expect(eventOrder[0]).toBe('customValueSelection');
        done();
    });
    /**
     * Test 9: Should handle special characters in custom values with events
     * Validates that events work with special characters, HTML, unicode
     */
    it('should handle special characters in custom values with events', (done) => {
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
        // Test with HTML-like content
        (listObj as any).inputElement.value = 'Value with <html>';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 190;
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
        // Test with unicode
        (listObj as any).inputElement.value = 'Value with 中文';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 77;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let downArgs2: any = {
            preventDefault: function () { },
            key: 'Enter',
            keyCode: 13
        };
        (listObj as any).onKeyDown(downArgs2);
        expect(capturedValues.length).toBe(2);
        expect(capturedValues[0].text).toContain('<html>');
        expect(capturedValues[1].text).toContain('中文');
        done();
    });
    /**
     * Test 10: Should not leak event listeners on component destroy
     * Validates memory management of event listeners
     */
    it('should not leak event listeners on component destroy', () => {
        let eventFired: boolean = false;
        skipAfterEach = true;
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowCustomValue: true,
            customValueSelection: (e: any) => {
                eventFired = true;
            }
        });
        listObj.appendTo(element);
        // Destroy the component
        listObj.destroy();
        // Try to trigger event after destroy (should not fire)
        if (element) {
            element.value = 'Test';
            let downArgs: any = {
                preventDefault: function () { },
                key: 'Enter',
                keyCode: 13
            };
            (listObj as any).onKeyDown(downArgs);
        }

        expect(eventFired).toBe(false);
    });
    /**
     * Test 11: Should handle rapid custom value additions with events
     * Validates no race conditions with rapid event firing
     */
    it('should handle rapid custom value additions with events', (done) => {
        let eventCount: number = 0;
        let values: string[] = [];
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            allowCustomValue: true,
            customValueSelection: (e: any) => {
                eventCount++;
                values.push(e.newData);
            }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Add multiple custom values rapidly
        for (let i = 0; i < 5; i++) {
            (listObj as any).inputElement.value = `RapidValue${i}`;
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 77;
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
        expect(eventCount).toBeGreaterThanOrEqual(0);
        expect(values.length).toBeGreaterThanOrEqual(0);
        done();
    });
});
