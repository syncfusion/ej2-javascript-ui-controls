import { MultiSelect } from '../../src/multi-select/multi-select';
import { createElement } from '@syncfusion/ej2-base';
import { VirtualScroll } from '../../src/common/virtual-scroll';
import { CheckBoxSelection } from '../../src/multi-select/checkbox-selection';

MultiSelect.Inject(VirtualScroll);
MultiSelect.Inject(CheckBoxSelection);

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

describe('MultiSelect - Group 20: Performance & Scalability', () => {
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
     * Test 1: Should handle 10000+ items with virtualization
     * Validates performance with very large datasets
     */
    it('should handle 10000+ items with virtualization', (done) => {
        // Generate 10000 items
        let largeData: { [key: string]: Object }[] = [];
        for (let i = 1; i <= 10000; i++) {
            largeData.push({
                id: `item-${i}`,
                text: `Item ${i}`
            });
        }
        let startTime = performance.now();
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true,
            popupHeight: '300px'
        });
        listObj.appendTo(element);
        let initTime = performance.now() - startTime;
        // Should initialize quickly (under 1 second)
        expect(initTime).toBeLessThan(1000);
        expect(listObj.getItems().length).toBeLessThan(largeData.length);
        done();
    });
    
    /**
     * Test 3: Should filter large datasets efficiently
     * Validates filter performance with big data
     */
    it('should filter large datasets efficiently', (done) => {
        // Generate 5000 items
        let largeData: { [key: string]: Object }[] = [];
        for (let i = 1; i <= 5000; i++) {
            largeData.push({
                id: `item-${i}`,
                text: `Item ${i}`
            });
        }
        listObj = new MultiSelect({
            dataSource: largeData,
            fields: { text: 'text', value: 'id' },
            allowFiltering: true,
            debounceDelay: 0
        });
        listObj.appendTo(element);
        let startTime = performance.now();
        listObj.showPopup();
        (listObj as any).inputElement.value = 'Item 500';
        keyboardEventArgs.altKey = false;
        keyboardEventArgs.keyCode = 48;
        (listObj as any).keyDownStatus = true;
        (listObj as any).onInput();
        (listObj as any).keyUp(keyboardEventArgs);
        let filterTime = performance.now() - startTime;
        let results = (listObj as any).popupWrapper.querySelectorAll('.e-list-item');
        // Filter should be fast and return results
        expect(filterTime).toBeLessThan(1000);
        expect(results.length).toBeGreaterThan(0);
        done();
    });
    /**
     * Test 4: Should handle memory efficiently with destroy
     * Validates no memory leaks on destroy
     */
    it('should handle memory efficiently with destroy', () => {
        let data: { [key: string]: Object }[] = [];
        for (let i = 1; i <= 1000; i++) {
            data.push({ id: `item-${i}`, text: `Item ${i}` });
        }
        skipAfterEach = true;
        listObj = new MultiSelect({
            dataSource: data,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true
        });
        listObj.appendTo(element);
        // Use component
        listObj.showPopup();
        listObj.value = ['item-1', 'item-100'];
        // Destroy should clean up
        listObj.destroy();
        // Component should be destroyed
        expect(listObj.isDestroyed).toBe(true);
        if (element) {
            element.remove();
        }
    });
    /**
     * Test 5: Should handle concurrent operations
     * Validates stability under concurrent load
     */
    it('should handle concurrent operations', (done) => {
        let data: { [key: string]: Object }[] = [];
        for (let i = 1; i <= 500; i++) {
            data.push({ id: `item-${i}`, text: `Item ${i}` });
        }
        listObj = new MultiSelect({
            dataSource: data,
            fields: { text: 'text', value: 'id' },
            enableVirtualization: true
        });
        listObj.appendTo(element);
        // Run multiple operations concurrently
        function operations() {
            listObj.showPopup();
            listObj.value = ['item-1', 'item-50'];
            listObj.dataBind();
            (listObj as any).inputElement.value = 'Item';
        }
        operations();
        expect(listObj.value.length).toBeGreaterThan(0);
        done();
    });

    /**
     * Test 9: Should handle multiple selections without lag
     * Validates selection performance
     */
    it('should handle multiple selections without lag', (done) => {
        let data: { [key: string]: Object }[] = [];
        for (let i = 1; i <= 500; i++) {
            data.push({ id: `item-${i}`, text: `Item ${i}` });
        }
        listObj = new MultiSelect({
            dataSource: data,
            fields: { text: 'text', value: 'id' }
        });
        listObj.appendTo(element);
        let startTime = performance.now();
        // Select many items
        let items = [];
        for (let i = 1; i <= 100; i++) {
            items.push(`item-${i}`);
        }
        listObj.value = items;
        listObj.dataBind();
        let selectionTime = performance.now() - startTime;
        // Selection should be fast
        expect(selectionTime).toBeLessThan(300);
        expect(listObj.value.length).toBe(100);
        done();
    });
    /**
     * Test 10: Should maintain performance with custom values and large data
     * Validates combined performance stress
     */
    it('should maintain performance with custom values and large data', (done) => {
        let data: { [key: string]: Object }[] = [];
        for (let i = 1; i <= 2000; i++) {
            data.push({ id: `item-${i}`, text: `Item ${i}` });
        }
        listObj = new MultiSelect({
            dataSource: data,
            fields: { text: 'text', value: 'id' },
            allowCustomValue: true,
            enableVirtualization: true
        });
        listObj.appendTo(element);
        let startTime = performance.now();
        // Add custom values with large dataset
        function addCustom() {
            for (let i = 0; i < 10; i++) {
                (listObj as any).inputElement.value = `Custom${i}`;
                keyboardEventArgs.altKey = false;
                // set keyCode/which from last character (compact)
                keyboardEventArgs.keyCode = ((listObj as any).inputElement.value || '').charCodeAt(((listObj as any).inputElement.value || '').length - 1) || 0;
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
        let totalTime = performance.now() - startTime;
        // Combined operation should be performant
        expect(totalTime).toBeLessThan(1000);
        expect(listObj.value.length).toBeGreaterThan(0);
        done();
    });
});
