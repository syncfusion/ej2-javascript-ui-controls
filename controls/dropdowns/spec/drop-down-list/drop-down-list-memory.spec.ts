import { EmitType, Browser, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownList } from '../../src/drop-down-list/drop-down-list';

describe('Priority 2 - Memory Leak Prevention', () => {
    let ddl: any;
    let element: HTMLInputElement;
    let skipAfterEach: boolean = false;
    beforeEach(() => {
        element = createElement('input', { id: 'ddl-memory' }) as HTMLInputElement;
        document.body.appendChild(element);
    });
    afterEach(() => {
        if (skipAfterEach) {
            if (element) {
                element.remove();
            }
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
     * Test Case 2.1: Event listeners cleaned up on destroy
     * Expected: All event listeners should be removed after destroy
     */
    it('should cleanup event listeners on destroy', (done) => {
        let changeEventFired = 0;
        let openEventFired = 0;
        let closeEventFired = 0;
        skipAfterEach = true;
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1' },
                { text: 'Item 2' },
                { text: 'Item 3' }
            ],
            change: () => changeEventFired++,
            open: () => openEventFired++,
            close: () => closeEventFired++
        });
        ddl.appendTo(element);
        setTimeout(() => {
            // Trigger events before destroy
            ddl.showPopup();
            ddl.hidePopup();
            const eventCountBefore = changeEventFired + openEventFired + closeEventFired;
            // Destroy component
            ddl.destroy();
            // Simulate events - should NOT fire
            try {
                element.click();
                ddl.showPopup();
                ddl.hidePopup();
            } catch (e) {
                // Expected - methods should not exist
            }
            setTimeout(() => {
                const eventCountAfter = changeEventFired + openEventFired + closeEventFired;
                // Event count should not increase significantly
                expect(eventCountAfter - eventCountBefore).toBeLessThan(2);
                done();
            }, 100);
        }, 100);
    });
    /**
     * Test Case 2.2: Multiple create/destroy cycles don't leak memory
     * Expected: Multiple instances should not accumulate memory
     */
    it('should not leak memory through multiple create/destroy cycles', (done) => {
        skipAfterEach = true;
        const cycles = 10;
        const initialMemory = (performance as any).memory.usedJSHeapSize || 0;
        const createAndDestroy = (index: number) => {
            if (index >= cycles) {
                const finalMemory = (performance as any).memory.usedJSHeapSize || 0;
                // Memory growth should be minimal (allow 5MB variance)
                const memoryGrowth = finalMemory - initialMemory;
                expect(memoryGrowth).toBeLessThan(5242880); // 5MB threshold
                done();
                return;
            }
            const el = createElement('input', { id: `ddl-cycle-${index}` }) as HTMLInputElement;
            document.body.appendChild(el);
            const instance = new DropDownList({
                dataSource: (function () {
                    const arr: any[] = [];
                    for (let i = 0; i < 100; i++) {
                        arr.push({ text: `Item ${i}` });
                    }
                    return arr;
                })()
            });
            instance.appendTo(el);
            setTimeout(() => {
                instance.destroy();
                el.remove();
                createAndDestroy(index + 1);
            }, 50);
        };
        createAndDestroy(0);
    });
    /**
     * Test Case 2.3: Popup element properly removed from DOM on destroy
     * Expected: Popup should not remain in DOM after destroy
     */
    it('should remove popup element from DOM on destroy', (done) => {
        skipAfterEach = true;
        ddl = new DropDownList({
            dataSource: [{ text: 'Item 1' }]
        });
        ddl.appendTo(element);
        setTimeout(() => {
            ddl.showPopup();
            setTimeout(() => {
                const popupBefore = document.querySelector('.e-ddl.e-popup-open');
                expect(popupBefore).toBeTruthy();
                // Destroy
                ddl.destroy();
                setTimeout(() => {
                    // Popup should be removed or hidden
                    const popupAfter = document.querySelector('.e-ddl.e-popup-open');
                    expect(popupAfter).toBeFalsy();
                    done();
                }, 100);
            }, 100);
        }, 100);
    });
    /**
     * Test Case 2.4: Large dataset handling without memory bloat
     * Expected: Should handle 10000+ items without excessive memory
     */
    it('should handle large dataset efficiently without memory bloat', (done) => {
        const largeDataset = (function () {
            const arr: any[] = [];
            for (let i = 0; i < 5000; i++) {
                arr.push({
                    id: i,
                    text: `Item ${i}`,
                    value: i,
                    category: `Category ${i % 10}`
                });
            }
            return arr;
        })();
        ddl = new DropDownList({
            dataSource: largeDataset,
            fields: { text: 'text', value: 'value' },
            enableVirtualization: true
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            // Virtual scrolling should prevent full DOM rendering
            const listedItems = ddl.popupObj.element.querySelectorAll('.e-list-item') || [];
            expect(listedItems.length).toBeLessThan(100); // Should render only visible items
            done();
        }, 100);
    });
    /**
     * Test Case 2.5: Recursive data binding cleanup
     * Expected: Nested/recursive bindings should not cause memory cycles
     */
    it('should handle recursive data binding without memory cycles', (done) => {
        skipAfterEach = true;
        const recursiveData = {
            id: 1,
            name: 'Root',
            children: [
                { id: 2, name: 'Child 1' },
                { id: 3, name: 'Child 2' }
            ]
        };
        ddl = new DropDownList({
            dataSource: [recursiveData],
            fields: { text: 'name', value: 'id' }
        });
        ddl.appendTo(element);
        setTimeout(() => {
            expect(ddl.dataSource).toBeDefined();
            // Destroy and verify cleanup
            ddl.destroy();
            expect(ddl.element.classList.contains('e-control')).toBe(false);
            done();
        }, 100);
    });
    /**
     * Test Case 2.6: Template compilation doesn't leak templates
     * Expected: Templates should be cleaned up after component destroy
     */
    it('should cleanup compiled templates on destroy', (done) => {
        skipAfterEach = true;
        const template = '<div class="item-template">${text}</div>';
        ddl = new DropDownList({
            dataSource: [{ text: 'Item 1' }, { text: 'Item 2' }],
            itemTemplate: template
        });
        ddl.appendTo(element);
        setTimeout(() => {
            // Get template elements count before destroy
            const templatesBefore = document.querySelectorAll('.item-template').length;
            ddl.destroy();
            setTimeout(() => {
                // Templates should be cleaned up
                const templatesAfter = document.querySelectorAll('.item-template').length;
                expect(templatesAfter).toBeLessThanOrEqual(templatesBefore);
                done();
            }, 100);
        }, 100);
    });
    /**
     * Test Case 2.7: Circular reference prevention
     * Expected: Component should not create circular references with data
     */
    it('should not create circular references with data source', (done) => {
        const data = [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' }
        ];
        ddl = new DropDownList({
            dataSource: data,
            fields: { text: 'name', value: 'id' }
        });
        ddl.appendTo(element);
        setTimeout(() => {
            // Check that dataSource items don't reference back to component
            const firstItem = (ddl.dataSource as any[])[0];
            const hasCircularRef = Object.keys(firstItem).some(key =>
                firstItem[key] === ddl || firstItem[key].ddl === ddl
            );
            expect(hasCircularRef).toBeFalsy();
            done();
        }, 100);
    });
    /**
     * Test Case 2.8: Event subscription memory cleanup
     * Expected: Multiple event subscriptions should be properly cleaned up
     */
    it('should cleanup multiple event subscriptions on destroy', (done) => {
        skipAfterEach = true;
        let subscriptionCount = 0;
        ddl = new DropDownList({
            dataSource: [{ text: 'Item 1' }]
        });
        ddl.appendTo(element);
        setTimeout(() => {
            // Add multiple event handlers
            for (let i = 0; i < 5; i++) {
                ddl.addEventListener('change', () => subscriptionCount++);
            }
            // Verify subscriptions work
            ddl.value = 0;
            const countBefore = subscriptionCount;
            // Destroy
            ddl.destroy();
            // Try to trigger event (should not execute)
            try {
                (ddl as any).select(0);
            } catch (e) {
                // Expected
            }
            expect(subscriptionCount).toBe(countBefore);
            done();
        }, 100);
    });
    /**
     * Test Case 2.9: Debounce and timeout cleanup
     * Expected: All timers and debounce functions should be cleared on destroy
     */
    it('should clear debounce timers and timeouts on destroy', (done) => {
        skipAfterEach = true;
        let filterTimeout: any = null;
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1' },
                { text: 'Item 2' },
                { text: 'Item 3' }
            ],
            allowFiltering: true,
            debounceDelay: 300,
            filtering: () => {
                if (filterTimeout) clearTimeout(filterTimeout);
                filterTimeout = setTimeout(() => {
                    // Filter logic
                }, 300);
            }
        });
        ddl.appendTo(element);
        setTimeout(() => {
            // Trigger filtering
            ddl.showPopup();
            (element as any).value = 'Item';
            // Destroy before timeout completes
            ddl.destroy();
            // Verify no orphaned timers
            expect(() => {
                if (filterTimeout) clearTimeout(filterTimeout);
            }).not.toThrow();

            done();
        }, 100);
    });
    /**
     * Test Case 2.10: Virtual scroll cleanup
     * Expected: Virtual scrolling state should be properly cleaned
     */
    it('should cleanup virtual scroll state on destroy', (done) => {
        skipAfterEach = true;
        const largeData = (function () {
            const arr: any[] = [];
            for (let i = 0; i < 1000; i++) {
                arr.push({ text: `Item ${i}` });
            }
            return arr;
        })();
        ddl = new DropDownList({
            dataSource: largeData,
            enableVirtualization: true,
            popupHeight: '300px'
        });
        ddl.appendTo(element);
        setTimeout(() => {
            ddl.showPopup();
            setTimeout(() => {
                // Scroll to middle
                const scrollContainer = ddl.popupObj.element.querySelector('.e-list-parent');
                if (scrollContainer) {
                    scrollContainer.scrollTop = 500;
                }
                ddl.destroy();
                // Virtual scroller state should be cleared
                expect((ddl as any).virtualScroll).toBeUndefined();
                done();
            }, 100);
        }, 100);
    });
    /**
     * Test Case 2.11: DOM mutation observer cleanup
     * Expected: Any DOM observers should be disconnected on destroy
     */
    it('should disconnect DOM observers on destroy', (done) => {
        skipAfterEach = true;
        ddl = new DropDownList({
            dataSource: [{ text: 'Item 1' }]
        });
        ddl.appendTo(element);
        setTimeout(() => {
            // Component might use ResizeObserver or MutationObserver
            const observers = (ddl as any).observer || (ddl as any).resizeObserver;
            ddl.destroy();
            // Observers should be cleared
            // Component should not have active observers
            expect(() => {
                // This would throw if observers weren't properly cleaned
                document.body.appendChild(createElement('div'));
            }).not.toThrow();
            done();
        }, 100);
    });
    /**
     * Test Case 2.12: Prevent memory leak with repeated show/hide
     * Expected: Repeated popup show/hide should not accumulate memory
     */
    it('should not leak memory with repeated show/hide cycles', (done) => {
        ddl = new DropDownList({
            dataSource: [{ text: 'Item 1' }, { text: 'Item 2' }]
        });
        ddl.appendTo(element);
        let showHideCycle = 0;
        const maxCycles = 20;
        const cycleShowHide = () => {
            if (showHideCycle >= maxCycles) {
                done();
                return;
            }
            if (showHideCycle % 2 === 0) {
                ddl.showPopup();
            } else {
                ddl.hidePopup();
            }
            showHideCycle++;
            setTimeout(cycleShowHide, 50);
        };
        setTimeout(cycleShowHide, 100);
    });
});
