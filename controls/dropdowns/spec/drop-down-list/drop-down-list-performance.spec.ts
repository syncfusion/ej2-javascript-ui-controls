import { EmitType, Browser, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownList } from '../../src/drop-down-list/drop-down-list';;

/**
 * Priority 3 - Performance Benchmark Tests
 * =========================================
 */
describe('Priority 3 - Performance Benchmarks', () => {
    let ddl: any;
    let element: HTMLInputElement;
    let skipAfterEach: boolean = false;

    beforeEach(() => {
        element = createElement('input', { id: 'ddl-performance' }) as HTMLInputElement;
        document.body.appendChild(element);
    });

    afterEach(() => {
        if (skipAfterEach) {
            skipAfterEach = false;
            return;
        }
        if (ddl) {
            ddl.destroy();
        }
        if (element) {
            element.remove();
        }
        document.body.innerHTML = '';
    });

    /**
     * Test Case 3.1: Component initialization performance
     * Expected: Component should initialize within reasonable time
     */

    it('should initialize component within acceptable time', (done) => {
        const data: { text: string }[] = [];
        for (let i = 0; i < 1000; i++) {
            data.push({ text: `Item ${i}` });
        }

        const startTime = performance.now();

        ddl = new DropDownList({
            dataSource: data
        });
        ddl.appendTo(element);

        const endTime = performance.now();
        const initTime = endTime - startTime;

        // Should initialize within 500ms
        expect(initTime).toBeLessThan(500);
        done();
    });

    /**
     * Test Case 3.2: Popup rendering performance
     * Expected: Popup should open/render within acceptable time
     */
    it('should render popup within acceptable time', (done) => {
        const data: { text: string }[] = [];
        for (let i = 0; i < 2000; i++) {
            data.push({ text: `Item ${i}` });
        }

        ddl = new DropDownList({
            dataSource: data,
            popupHeight: '300px'
        });
        ddl.appendTo(element);

        const startTime = performance.now();
        ddl.showPopup();

        const endTime = performance.now();

        const renderTime = endTime - startTime;

        // Popup should render within 300ms
        expect(renderTime).toBeLessThan(300);
        done();
    });

    /**
     * Test Case 3.3: Virtual scrolling performance with large dataset
     * Expected: Virtual scrolling should handle 10000 items efficiently
     */
    it('should handle large datasets efficiently with virtual scrolling', (done) => {
        const largeData: { text: string }[] = [];
        for (let i = 0; i < 10000; i++) {
            largeData.push({ text: `Item ${i}` });
        }

        const startTime = performance.now();

        ddl = new DropDownList({
            dataSource: largeData,
            enableVirtualization: true,
            popupHeight: '300px'
        });
        ddl.appendTo(element);

        ddl.showPopup();
        setTimeout(() => {
            const endTime = performance.now();

            const totalTime = endTime - startTime;

            // Should complete within 1000ms even with 10000 items
            expect(totalTime).toBeLessThan(1000);

            // Virtual scrolling should render minimal items
            const visibleItems = ddl.popupObj.element.querySelectorAll('.e-list-item') || [];
            expect(visibleItems.length).toBeLessThan(50);

            done();
        }, 100);
    });

    /**
     * Test Case 3.4: Filtering performance
     * Expected: Filtering should complete within acceptable time
     */
    it('should filter large dataset within acceptable time', (done) => {
        const data: { text: string }[] = [];
        for (let i = 0; i < 5000; i++) {
            data.push({ text: `Item ${i}` });
        }

        ddl = new DropDownList({
            dataSource: data,
            allowFiltering: true,
            debounceDelay: 0  // Immediate filtering
        });
        ddl.appendTo(element);
        ddl.showPopup();

        setTimeout(() => {
            const startTime = performance.now();

            // Set filter value
            (element as any).value = 'Item 50';
            (element as any).dispatchEvent(new Event('input'));

            setTimeout(() => {
                const endTime = performance.now();
                const filterTime = endTime - startTime;

                // Filtering should complete within 200ms
                expect(filterTime).toBeLessThan(200);
                done();
            }, 50);
        }, 100);
    });

    /**
     * Test Case 3.5: Event handling performance
     * Expected: Event handlers should execute efficiently
     */
    it('should handle events without performance degradation', (done) => {
        let eventCount = 0;
        const data: { text: string }[] = [];
        for (let i = 0; i < 1000; i++) {
            data.push({ text: `Item ${i}` });
        }

        ddl = new DropDownList({
            dataSource: data,
            open: () => eventCount++,
            close: () => eventCount++,
            change: () => eventCount++
        });
        ddl.appendTo(element);

        const startTime = performance.now();

        // Trigger multiple events
        for (let i = 0; i < 10; i++) {
            ddl.showPopup();
            ddl.hidePopup();
        }

        const endTime = performance.now();
        const eventTime = endTime - startTime;

        // Should handle 20 events within 500ms
        expect(eventTime).toBeLessThan(500);
        done();
    });

    /**
     * Test Case 3.6: DOM operation efficiency
     * Expected: DOM operations should be efficient
     */
    it('should perform DOM operations efficiently', (done) => {
        const data: { text: string }[] = [];
        for (let i = 0; i < 500; i++) {
            data.push({ text: `Item ${i}` });
        }

        ddl = new DropDownList({
            dataSource: data
        });
        ddl.appendTo(element);

        const startTime = performance.now();

        // Multiple DOM operations
        ddl.showPopup();
        const listItems = ddl.popupObj.element.querySelectorAll('.e-list-item');
        listItems[0].click();
        ddl.hidePopup();

        const endTime = performance.now();
        const domTime = endTime - startTime;

        // DOM operations should complete within 300ms
        expect(domTime).toBeLessThan(300);
        done();
    });

    /**
     * Test Case 3.7: Template rendering performance
     * Expected: Complex templates should render efficiently
     */
    it('should render complex templates efficiently', (done) => {
        const data: { id: number; text: string; category: string; description: string }[] = [];
        for (let i = 0; i < 500; i++) {
            data.push({
                id: i,
                text: `Item ${i}`,
                category: `Cat ${i % 5}`,
                description: `Description for item ${i}`
            });
        }

        const template = '<div class="item"><span>${text}</span><small>${category}</small></div>';

        const startTime = performance.now();

        ddl = new DropDownList({
            dataSource: data,
            itemTemplate: template,
            popupHeight: '300px'
        });
        ddl.appendTo(element);

        const endTime = performance.now();
        const templateTime = endTime - startTime;

        // Template compilation should complete within 400ms
        expect(templateTime).toBeLessThan(400);
        done();
    });

    /**
     * Test Case 3.8: Keyboard navigation performance
     * Expected: Keyboard events should be handled efficiently
     */
    it('should handle keyboard navigation without lag', (done) => {
        const data: { text: string }[] = [];
        for (let i = 0; i < 1000; i++) {
            data.push({ text: `Item ${i}` });
        }

        ddl = new DropDownList({
            dataSource: data,
            popupHeight: '300px'
        });
        ddl.appendTo(element);
        ddl.showPopup();

        setTimeout(() => {
            const startTime = performance.now();

            // Simulate rapid keyboard navigation
            for (let i = 0; i < 20; i++) {
                const keyEvent = new KeyboardEvent('keydown', {
                    key: i % 2 === 0 ? 'ArrowDown' : 'ArrowUp',
                    bubbles: true
                });
                element.dispatchEvent(keyEvent);
            }

            const endTime = performance.now();
            const keyboardTime = endTime - startTime;

            // Should handle 20 key events within 200ms
            expect(keyboardTime).toBeLessThan(200);
            done();
        }, 100);
    });

    /**
     * Test Case 3.9: Memory usage with large datasets
     * Expected: Memory should not grow excessively
     */
    it('should maintain reasonable memory usage with large datasets', (done) => {
        const largeData: { text: string }[] = [];
        for (let i = 0; i < 5000; i++) {
            largeData.push({ text: `Item ${i}` });
        }

        const initialMemory = (performance as any).memory.usedJSHeapSize || 0;

        ddl = new DropDownList({
            dataSource: largeData,
            enableVirtualization: true
        });
        ddl.appendTo(element);
        ddl.showPopup();

        setTimeout(() => {
            const afterLoadMemory = (performance as any).memory.usedJSHeapSize || 0;
            const memoryGrowth = afterLoadMemory - initialMemory;

            // Should not grow more than 10MB for 5000 items with virtual scrolling
            if (initialMemory > 0) {
                expect(memoryGrowth).toBeLessThan(10485760);
            }

            done();
        }, 100);
    });

    /**
     * Test Case 3.10: Rapid value changes performance
     * Expected: Rapid value changes should complete efficiently
     */
    it('should handle rapid value changes efficiently', (done) => {
        const data: { text: string; value: number }[] = [];
        for (let i = 0; i < 500; i++) {
            data.push({ text: `Item ${i}`, value: i });
        }

        ddl = new DropDownList({
            dataSource: data,
            fields: { text: 'text', value: 'value' }
        });
        ddl.appendTo(element);

        const startTime = performance.now();

        // Rapid value changes
        for (let i = 0; i < 50; i++) {
            ddl.value = i;
            ddl.dataBind();
        }

        const endTime = performance.now();
        const changeTime = endTime - startTime;

        // Should complete within 300ms
        expect(changeTime).toBeLessThan(300);
        done();
    });

    /**
     * Test Case 3.11: Scroll performance in virtual list
     * Expected: Virtual scrolling should maintain smooth scroll
     */
    it('should maintain scroll performance in virtual list', (done) => {
        const largeData: { text: string }[] = [];
        for (let i = 0; i < 2000; i++) {
            largeData.push({ text: `Item ${i}` });
        }

        ddl = new DropDownList({
            dataSource: largeData,
            enableVirtualization: true,
            popupHeight: '300px'
        });
        ddl.appendTo(element);
        ddl.showPopup();

        setTimeout(() => {
            const scrollContainer = ddl.popupObj.element.querySelector('.e-list-parent') as HTMLElement;

            if (scrollContainer) {
                const startTime = performance.now();

                // Simulate rapid scrolling
                for (let i = 0; i < 100; i++) {
                    scrollContainer.scrollTop += 10;
                }

                const endTime = performance.now();
                const scrollTime = endTime - startTime;

                // Scrolling should complete quickly
                expect(scrollTime).toBeLessThan(500);
            }

            done();
        }, 100);
    });

    /**
     * Test Case 3.12: Stress test - multiple operations
     * Expected: Component should handle stress test
     */
    it('should handle combined stress test operations', (done) => {
        const data: { text: string; value: number }[] = [];
        for (let i = 0; i < 1000; i++) {
            data.push({ text: `Item ${i}`, value: i });
        }
        skipAfterEach = true;
        ddl = new DropDownList({
            dataSource: data,
            allowFiltering: true,
            enableVirtualization: true,
            debounceDelay: 0
        });
        ddl.appendTo(element);

        const startTime = performance.now();

        // Stress test: multiple operations
        ddl.showPopup();
        setTimeout(() => {
            let keyEventArgs: any = { preventDefault: function () { }, target: null };
            const filterInput = ddl.filterInput;
            expect(filterInput).toBeDefined();

            // Type in filter box
            filterInput.value = 'Item';
            keyEventArgs.keyCode = 77;
            ddl.onInput();
            ddl.onFilterUp(keyEventArgs);
            ddl.hidePopup();
            ddl.showPopup();
            setTimeout(() => {
                ddl.enableRtl = true;
                ddl.dataBind();
                ddl.hidePopup();
                ddl.destroy();

                const endTime = performance.now();
                const stressTime = endTime - startTime;

                // Should handle all operations within 1000ms
                expect(stressTime).toBeLessThan(1000);
                done();
            }, 100);
        }, 100);
    });
});
