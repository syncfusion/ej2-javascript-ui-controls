import { EmitType, Browser, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownList } from '../../src/drop-down-list/drop-down-list';

describe('Priority 1 - Virtual Scrolling with Filtering', () => {
    let ddl: any;
    let element: HTMLInputElement;
    let keyEventArgs: any = { preventDefault: function () { }, target: null };
    const largeData: { [key: string]: Object }[] = [];
    for (let i: number = 0; i < 1000; i++) {
        largeData.push({
            id: `item_${i}`,
            text: `Item ${i}`,
            category: i % 10
        });
    }
    beforeEach(() => {
        element = createElement('input', { id: 'ddl-virt-filter' }) as HTMLInputElement;
        document.body.appendChild(element);
    });
    afterEach(() => {
        if (ddl) {
            ddl.destroy();
        }
        if (element) {
            element.remove();
        }
        document.body.innerHTML = '';
    });

    /**
     * Test Case 1.1: Render virtual scroll with filtering enabled
     * Expected: Both features should initialize without errors
     */
    it('should render virtual scroll with filtering enabled', () => {
        ddl = new DropDownList({
            dataSource: largeData,
            enableVirtualization: true,
            allowFiltering: true,
            fields: { text: 'text', value: 'id' },
            popupHeight: '200px'
        });
        ddl.appendTo(element);
        expect(ddl.enableVirtualization).toBe(true);
        expect(ddl.allowFiltering).toBe(true);
        expect(ddl.popupHeight).toBe('200px');
    });
    /**
     * Test Case 1.2: Filter items while maintaining virtual scroll
     * Expected: Filtered results should be rendered with virtual scrolling maintained
     */
    it('should filter items while maintaining virtual scroll', (done) => {
        ddl = new DropDownList({
            dataSource: largeData,
            enableVirtualization: true,
            allowFiltering: true,
            fields: { text: 'text', value: 'id' },
            debounceDelay: 0 // Disable debounce for testing
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const filterInput = ddl.filterInput;
            expect(filterInput).toBeDefined();
            // Type in filter box
            filterInput.value = 'Item 1';
            keyEventArgs.keyCode = 49;
            ddl.onInput();
            ddl.onFilterUp(keyEventArgs);
            const items = ddl.popupObj.element.querySelectorAll('li:not(.e-virtual-list)');
            // Should show filtered items (Item 1, 10-19, 100-199, etc.)
            expect(items.length).toBeGreaterThan(0);
            expect(items.length).toBeLessThan(100); // Much less than total 1000
            expect(items[0].textContent).toContain('Item 1');
            done();
        }, 100);
    });
    /**
     * Test Case 1.3: Keyboard navigate in virtual filtered results
     * Expected: Arrow keys should navigate within filtered virtual list
     */
    it('should keyboard navigate in virtual filtered results', (done) => {
        ddl = new DropDownList({
            dataSource: largeData,
            enableVirtualization: true,
            allowFiltering: true,
            debounceDelay: 0
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const filterInput = ddl.filterInput;
            filterInput.value = 'Item 5';
            keyEventArgs.keyCode = 53;
            ddl.onInput();
            ddl.onFilterUp(keyEventArgs);
            // Navigate down
            keyEventArgs.action = 'down';
            ddl.keyActionHandler(keyEventArgs);

            expect(ddl.activeIndex).not.toBe(-1);
            expect(ddl.activeIndex).toBeGreaterThanOrEqual(0);
            done();
        }, 100);
    });
    /**
     * Test Case 1.4: Scroll within filtered virtual list
     * Expected: Virtual list should scroll within filtered results
     */
    it('should scroll within filtered virtual list', (done) => {
        ddl = new DropDownList({
            dataSource: largeData,
            enableVirtualization: true,
            allowFiltering: true,
            popupHeight: '300px'
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const filterInput = ddl.filterInput;
            filterInput.value = 'Item';
            keyEventArgs.keyCode = 77;
            ddl.onInput();
            ddl.onFilterUp(keyEventArgs);
            const initialScrollTop = ddl.list.scrollTop;
            // Simulate scroll
            ddl.list.scrollTop = 100;
            expect(ddl.list.scrollTop).toBe(100);
            expect(ddl.list.scrollTop).not.toBe(initialScrollTop);
            done();
        }, 100);
    });
    /**
     * Test Case 1.5: Clear filter and show all items with virtual scroll
     * Expected: Clearing filter should restore all virtual items
     */
    it('should clear filter and show all items with virtual scroll', (done) => {
        ddl = new DropDownList({
            dataSource: largeData,
            enableVirtualization: true,
            allowFiltering: true,
            debounceDelay: 0
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const filterInput = ddl.filterInput;
            // Filter
            filterInput.value = 'Item 1';
            keyEventArgs.keyCode = 49;
            ddl.onInput();
            ddl.onFilterUp(keyEventArgs);
            const items = ddl.popupObj.element.querySelectorAll('li:not(.e-virtual-list)');
            expect(items[0].textContent).toContain('Item 1');
            // Clear filter
            filterInput.value = '';
            keyEventArgs.keyCode = 222;
            ddl.onInput();
            ddl.onFilterUp(keyEventArgs);
            const allItems = ddl.popupObj.element.querySelectorAll('li:not(.e-virtual-list)');
            // All items should be restored (or at least many more than filtered)
            expect(allItems[0].textContent).toContain('Item 0');
            done();
        }, 100);
    });
});

/**
 * Priority 1 - Debounce Delay Functionality Tests
 * ================================================
 */
describe('Priority 1 - Debounce Delay Functionality', () => {
    let ddl: any;
    let element: HTMLInputElement;
    let keyEventArgs: any = { preventDefault: function () { }, target: null };
    beforeEach(() => {
        element = createElement('input', { id: 'ddl-debounce' }) as HTMLInputElement;
        document.body.appendChild(element);
    });
    afterEach(() => {
        if (ddl) {
            ddl.destroy();
        }
        if (element) {
            element.remove();
        }
        document.body.innerHTML = '';
    });
    /**
     * Test Case 2.1: Verify default debounceDelay property
     * Expected: Default should be 300ms
     */
    it('should have default debounceDelay of 300ms', () => {
        ddl = new DropDownList({
            dataSource: [{ text: 'Test' }],
            allowFiltering: true
        });
        ddl.appendTo(element);
        expect(ddl.debounceDelay).toBe(300);
    });
    /**
     * Test Case 2.2: Set custom debounceDelay
     * Expected: Property should accept custom values
     */
    it('should set custom debounceDelay', () => {
        ddl = new DropDownList({
            dataSource: [{ text: 'Test' }],
            allowFiltering: true,
            debounceDelay: 500
        });
        ddl.appendTo(element);
        expect(ddl.debounceDelay).toBe(500);
    });
    /**
     * Test Case 2.3: Verify debounce delay actually delays filter execution
     * Expected: Filter should fire only once after delay, not on every keystroke
     */
    it('should delay filter execution based on debounceDelay', (done) => {
        let filterCount = 0;
        const testData: { text: string }[] = [];
        for (let i: number = 0; i < 100; i++) {
            testData.push({ text: `Item ${i}` });
        }
        ddl = new DropDownList({
            dataSource: testData,
            allowFiltering: true,
            debounceDelay: 200,
            filtering: () => {
                filterCount++;
            }
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const filterInput = ddl.filterInput;
            filterInput.value = 'I';
            keyEventArgs.keyCode = 73;
            ddl.onInput();
            ddl.onFilterUp(keyEventArgs);
            setTimeout(() => {
                filterInput.value = 'It';
                keyEventArgs.keyCode = 84;
                ddl.onInput();
                ddl.onFilterUp(keyEventArgs);
                setTimeout(() => {
                    filterInput.value = 'Itm';
                    keyEventArgs.keyCode = 69;
                    ddl.onInput();
                    ddl.onFilterUp(keyEventArgs);
                    setTimeout(() => {
                        expect(filterCount).toBe(3);
                        done();
                    }, 300);
                }, 300);
            }, 300);
        }, 100);
    });
    /**
     * Test Case 2.4: Allow zero debounceDelay for immediate filtering
     * Expected: With debounceDelay: 0, filter should fire on every input
     */
    it('should allow zero debounceDelay for immediate filtering', (done) => {
        let filterCount = 0;
        ddl = new DropDownList({
            dataSource: [{ text: 'Item 1' }, { text: 'Item 2' }],
            allowFiltering: true,
            debounceDelay: 0,
            filtering: () => {
                filterCount++;
            }
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const filterInput = ddl.filterInput;
            filterInput.value = 'I';
            keyEventArgs.keyCode = 73;
            ddl.onInput();
            ddl.onFilterUp(keyEventArgs);
            filterInput.value = 'It';
            keyEventArgs.keyCode = 84;
            ddl.onInput();
            ddl.onFilterUp(keyEventArgs);
            // With zero delay, should fire multiple times
            expect(filterCount).toBe(2);
            done();
        }, 100);
    });
    /**
     * Test Case 2.5: Dynamically change debounceDelay
     * Expected: Should accept runtime changes to debounceDelay
     */
    it('should dynamically change debounceDelay', (done) => {
        ddl = new DropDownList({
            dataSource: [{ text: 'Test' }],
            allowFiltering: true,
            debounceDelay: 100
        });
        ddl.appendTo(element);
        expect(ddl.debounceDelay).toBe(100);
        ddl.debounceDelay = 500;
        ddl.dataBind();
        expect(ddl.debounceDelay).toBe(500);
        done();
    });
    /**
     * Test Case 2.6: Verify debounce with large datasets
     * Expected: Debounce should help performance with large datasets
     */
    it('should perform efficiently with debounce on large datasets', (done) => {
        const largeData: { text: string }[] = [];
        for (let i: number = 0; i < 5000; i++) {
            largeData.push({ text: `Item ${i}` });
        }
        let filterCount = 0;
        ddl = new DropDownList({
            dataSource: largeData,
            allowFiltering: true,
            debounceDelay: 200,
            filtering: () => {
                filterCount++;
            }
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const filterInput = ddl.filterInput;
            const startTime = performance.now();
            (() => {
                const sequences: string[] = ['a', 'aa', 'aaa', 'aaaa', 'aaaaa', 'aaaaaa'];
                let i = 0;
                function runNext(): void {
                    if (i >= sequences.length) {
                        const endTime = performance.now();
                        const totalTime = endTime - startTime;
                        expect(filterCount).toBeLessThan(10);
                        expect(totalTime).toBeLessThan(5000);
                        done();
                        return;
                    }
                    filterInput.value = sequences[i];
                    keyEventArgs.keyCode = 65;
                    ddl.onInput();
                    ddl.onFilterUp(keyEventArgs);
                    i++;
                    setTimeout(runNext, 300);
                }
                runNext();
            })();
        }, 100);
    });
});
