import { MultiSelect } from '../../src/multi-select/multi-select';
import { createElement } from '@syncfusion/ej2-base';

let basicData: { [key: string]: Object }[] = [
    { id: 'list1', text: 'JAVA', disabled: false },
    { id: 'list2', text: 'C#', disabled: false },
    { id: 'list3', text: 'C++', disabled: true },
    { id: 'list4', text: '.NET', disabled: false },
    { id: 'list5', text: 'Oracle', disabled: true }
];

describe('MultiSelect - Group 19: Keyboard Navigation Advanced', () => {
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
     * Test 1: Should handle continuous arrow key navigation
     * Validates smooth multi-key navigation
     */
    it('should handle continuous arrow key navigation', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id', disabled: 'disabled' }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Navigate down multiple times
        for (let i = 0; i < 3; i++) {
            let keyboardEventArgs = {
                preventDefault: function () { },
                key: 'ArrowDown',
                keyCode: 40
            };
            (listObj as any).onKeyDown(keyboardEventArgs);
        }
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        expect(focusedItem).toBeTruthy();
        expect(focusedItem.textContent).toContain('.NET');
        done();
    });
    /**
     * Test 2: Should skip all disabled items during navigation
     * Validates comprehensive disabled item skipping
     */
    it('should skip all disabled items during navigation', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id', disabled: 'disabled' }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Multiple navigations
        for (let i = 0; i < 5; i++) {
            let keyboardEventArgs = {
                preventDefault: function () { },
                key: 'ArrowDown',
                keyCode: 40
            };
            (listObj as any).onKeyDown(keyboardEventArgs);
        }
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        expect(focusedItem).toBeTruthy();
        expect(focusedItem.classList.contains('e-disabled')).toBe(false);
        expect(focusedItem.textContent).toContain('.NET');
        done();
    });
    /**
     * Test 3: Should handle Escape key to close popup
     * Validates Escape closes dropdown
     */
    it('should handle Escape key to close popup', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        expect((listObj as any).isPopupOpen()).toBe(true);
        // Press Escape
        let escapeEvent = {
            preventDefault: function () { },
            key: 'Escape',
            keyCode: 27
        };
        (listObj as any).onKeyDown(escapeEvent);
        expect((listObj as any).isPopupOpen()).toBe(false);
        done();
    });
    /**
     * Test 4: Should handle rapid key presses without issues
     * Validates stability with fast key input
     */
    it('should handle rapid key presses without issues', (done) => {
        listObj = new MultiSelect({
            dataSource: basicData,
            fields: { text: 'text', value: 'id' }
        });
        listObj.appendTo(element);
        listObj.showPopup();
        // Rapid key presses
        function rapidKeys() {
            for (let i = 0; i < 10; i++) {
                let keyEvent = {
                    preventDefault: function () { },
                    key: 'ArrowDown',
                    keyCode: 40
                };
                (listObj as any).onKeyDown(keyEvent);
            }
        }
        rapidKeys();
        let focusedItem = (listObj as any).popupWrapper.querySelector('.e-item-focus');
        expect(focusedItem).toBeTruthy();
        done();
    });
});
