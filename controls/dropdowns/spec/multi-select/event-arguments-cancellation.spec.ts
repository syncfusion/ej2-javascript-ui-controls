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

describe('MultiSelect - Group 18: Event Arguments & Cancellation', () => {
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
     * Test 1: Should provide complete event arguments on change
     * Validates all event argument properties
     */
    it('should provide complete event arguments on change', (done) => {
        let eventArgs: any = {};
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            change: (e: MultiSelectChangeEventArgs) => {
                eventArgs = {
                    value: e.value,
                    element: e.element,
                    oldValue: e.oldValue,
                    isInteracted: e.isInteracted
                };
            }
        });
        listObj.appendTo(element);
        listObj.value = ['list1'];
        listObj.dataBind();
        expect(eventArgs.value).toBeTruthy();
        expect(eventArgs.element).toBeTruthy();
        expect(eventArgs.oldValue).toBeNull();
        expect(eventArgs.isInteracted).toBe(false);
        done();
    });
    /**
     * Test 2: Should provide complete event arguments on select
     * Validates select event argument structure
     */
    it('should provide complete event arguments on select', (done) => {
        let eventArgs: any = {};
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            select: (e: SelectEventArgs) => {
                eventArgs = {
                    item: e.item,
                    cancel: e.cancel,
                    isInteracted: e.isInteracted,
                    itemData: e.itemData,
                    e: e.e
                };
            }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 13;
        (<any>listObj).onKeyDown(keyboardEventArgs);
        expect(eventArgs.item).toBeTruthy();
        expect(eventArgs.cancel).toBe(false);
        expect(eventArgs.isInteracted).toBeTruthy();
        expect(eventArgs.itemData).toBeTruthy();
        expect(eventArgs.e).toBeTruthy();
        done();
    });
    /**
     * Test 3: Should support cancellation through cancel flag
     * Validates cancel property on events
     */
    it('should support cancellation through cancel flag', (done) => {
        let selectFired = false;
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            select: (e: any) => {
                selectFired = true;
                e.cancel = true;
            }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 13;
        (<any>listObj).onKeyDown(keyboardEventArgs);
        expect(selectFired).toBe(true);
        let chips = element.parentElement.parentElement.querySelectorAll('.e-chips');
        expect(chips.length).toBe(0);
        done();
    });
    /**
     * Test 4: Should provide cancellable remove event
     * Validates remove event can be cancelled
     */
    it('should provide cancellable remove event', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' },
            value: ['list1', 'list2'],
            removing: (e: any) => {
                e.cancel = true;
            }
        });
        listObj.appendTo(element);
        let beforeCount = listObj.value.length;
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        // Try to remove
        (<any>listObj).removeValue('list2', mouseEventArgs);
        // Should not be removed due to cancel
        expect(listObj.value.length).toBe(beforeCount);
        done();
    });
});
