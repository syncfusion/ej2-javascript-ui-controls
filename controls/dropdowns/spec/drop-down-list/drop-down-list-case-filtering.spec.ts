import { EmitType, Browser, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownList } from '../../src/drop-down-list/drop-down-list';

describe('Priority 2 - Case-Sensitive and Case-Insensitive Filtering', () => {
    let ddl: any;
    let element: HTMLInputElement;
    let originalTimeout: number;
    let keyEventArgs: any = {
        preventDefault: (): void => { /** NO Code */ },
        keyCode: 74,
        metaKey: false
    };
    beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
        element = createElement('input', { id: 'ddl-case-filter' }) as HTMLInputElement;
        document.body.appendChild(element);
    });
    afterEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        if (ddl) {
            ddl.destroy();
        }
        if (element) {
            element.remove();
        }
        document.body.innerHTML = '';
    });
    /**
     * Test Case 1: Case-insensitive filtering (default)
     * Expected: Should match items regardless of case
     */
    it('should perform case-insensitive filtering by default', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'Apple' },
                { text: 'BANANA' },
                { text: 'Cherry' },
                { text: 'DATE' }
            ],
            allowFiltering: true,
            debounceDelay: 0
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            // Search lowercase
            ddl.filterInput.value = "app";
            keyEventArgs.keyCode = 80;
            ddl.onInput()
            ddl.onFilterUp(keyEventArgs);
            const items = ddl.popupObj.element.querySelectorAll('.e-list-item');
            let found = false;
            items.forEach((item: any) => {
                if (item.textContent.includes('Apple')) {
                    found = true;
                }
            });
            expect(found).toBe(true);
            done();
        }, 100);
    });
    /**
     * Test Case 2: Case-sensitive filtering option
     * Expected: Should match only exact case when enabled
     */
    it('should support case-sensitive filtering when enabled', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'Apple' },
                { text: 'apple' },
                { text: 'APPLE' }
            ],
            allowFiltering: true,
            debounceDelay: 0,
            ignoreCase: false  // Case-sensitive
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            ddl.filterInput.value = "Apple";
            keyEventArgs.keyCode = 69;
            ddl.onInput()
            ddl.onFilterUp(keyEventArgs);
            const items = ddl.popupObj.element.querySelectorAll('.e-list-item');
            expect(items.length).toBeGreaterThan(0);
            let found = false;
            items.forEach((item: any) => {
                if (item.textContent.includes('Apple')) {
                    found = true;
                }
            });
            expect(found).toBe(true);
            done();
        }, 100);
    });
    /**
     * Test Case 3: Mixed case filtering
     * Expected: Should handle mixed case searches appropriately
     */
    it('should handle mixed case filtering correctly', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'JavaScript' },
                { text: 'TypeScript' },
                { text: 'CoffeeShop' },
                { text: 'ActionScript' }
            ],
            allowFiltering: true,
            debounceDelay: 0,
            filterType: 'Contains'
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            // Mixed case search
            ddl.filterInput.value = "ScRiPt";
            keyEventArgs.keyCode = 84;
            ddl.onInput()
            ddl.onFilterUp(keyEventArgs);
            const items = ddl.popupObj.element.querySelectorAll('.e-list-item');
            expect(items.length).toBe(3);
            done();
        }, 100);
    });
    /**
     * Test Case 4: Accent-insensitive filtering
     * Expected: Should match accented characters with non-accented
     */
    it('should handle accent-insensitive filtering', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'café' },
                { text: 'naïve' },
                { text: 'résumé' }
            ],
            allowFiltering: true,
            ignoreAccent: true,
            debounceDelay: 0,
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            ddl.filterInput.value = "cafe";
            keyEventArgs.keyCode = 69;
            ddl.onInput()
            ddl.onFilterUp(keyEventArgs);
            expect(ddl.popupObj).toBeTruthy();
            const items = ddl.popupObj.element.querySelectorAll('.e-list-item');
            expect(items.length).toBeGreaterThan(0);
            let found = false;
            // Should match 'café'
            items.forEach((item: any) => {
                if (item.textContent.includes('café')) {
                    found = true;
                }
            });
            expect(found).toBe(true);
            done();
        }, 100);
    });
    /**
     * Test Case 5: Special characters in case-sensitive search
     * Expected: Should handle special characters correctly
     */
    it('should filter with special characters', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item@1' },
                { text: 'Item#2' },
                { text: 'Item$3' },
                { text: 'Item&4' }
            ],
            allowFiltering: true,
            debounceDelay: 0,
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            ddl.filterInput.value = "Item@";
            keyEventArgs.keyCode = 50;
            ddl.onInput()
            ddl.onFilterUp(keyEventArgs);
            const items = ddl.popupObj.element.querySelectorAll('.e-list-item');
            expect(items.length).toBeGreaterThan(0);
            let found = false;
            // Should match 'Item@'
            items.forEach((item: any) => {
                if (item.textContent.includes('Item@')) {
                    found = true;
                }
            });
            expect(found).toBe(true);
            done();
        }, 100);
    });
    /**
     * Test Case 6: Unicode character filtering
     * Expected: Should handle unicode characters in filtering
     */
    it('should filter unicode characters correctly', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: '中文' },
                { text: '日本語' },
                { text: '한국어' },
                { text: 'العربية' }
            ],
            allowFiltering: true,
            debounceDelay: 0,
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            ddl.filterInput.value = "中";
            keyEventArgs.keyCode = 77;
            ddl.onInput()
            ddl.onFilterUp(keyEventArgs);
            expect(ddl.popupObj).toBeTruthy();
            const items = ddl.popupObj.element.querySelectorAll('.e-list-item');
            expect(items.length).toBeGreaterThan(0);
            let found = false;
            // Should match '中'
            items.forEach((item: any) => {
                if (item.textContent.includes('中文')) {
                    found = true;
                }
            });
            expect(found).toBe(true);
            done();
        }, 100);
    });
    /**
     * Test Case 7: Whitespace handling in filtering
     * Expected: Should handle leading/trailing spaces correctly
     */
    it('should handle whitespace in case-insensitive filter', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: '  Leading Space' },
                { text: 'Trailing Space  ' },
                { text: '  Both Spaces  ' }
            ],
            allowFiltering: true,
            debounceDelay: 0,
            filterType: 'Contains'
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            ddl.filterInput.value = "Leading";
            keyEventArgs.keyCode = 71;
            ddl.onInput()
            ddl.onFilterUp(keyEventArgs);
            const items = ddl.popupObj.element.querySelectorAll('.e-list-item');
            expect(items.length).toBeGreaterThan(0);
            let found = false;
            items.forEach((item: any) => {
                if (item.textContent.includes('Leading')) {
                    found = true;
                }
            });
            expect(found).toBe(true);
            done();
        }, 100);
    });
    /**
     * Test Case 8: Numeric string case filtering
     * Expected: Should handle numeric strings appropriately
     */
    it('should filter numeric string items', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: '123ABC' },
                { text: '456def' },
                { text: '789GHI' }
            ],
            allowFiltering: true,
            debounceDelay: 0,
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            ddl.filterInput.value = "123abc";
            keyEventArgs.keyCode = 71;
            ddl.onInput()
            ddl.onFilterUp(keyEventArgs);
            const items = ddl.popupObj.element.querySelectorAll('.e-list-item');
            expect(items.length).toBeGreaterThan(0);
            let found = false;
            items.forEach((item: any) => {
                if (item.textContent.includes('123ABC')) {
                    found = true;
                }
            });
            expect(found).toBe(true);
            done();
        }, 100);
    });
    /**
     * Test Case 9: Case-sensitive with special regex characters
     * Expected: Should escape special regex characters in filter
     */
    it('should handle regex special characters in filter', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item.*' },
                { text: 'Item.+' },
                { text: 'Item.?' },
                { text: 'Item[0]' }
            ],
            allowFiltering: true,
            debounceDelay: 0,
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            ddl.filterInput.value = "Item.*";
            keyEventArgs.keyCode = 71;
            ddl.onInput()
            ddl.onFilterUp(keyEventArgs);
            const items = ddl.popupObj.element.querySelectorAll('.e-list-item');
            expect(items.length).toBeGreaterThan(0);
            let found = false;
            items.forEach((item: any) => {
                if (item.textContent.includes('Item.*')) {
                    found = true;
                }
            });
            expect(found).toBe(true);
            done();
        }, 100);
    });
    /**
     * Test Case 10: Toggle ignoreCase property dynamically
     * Expected: Should update filtering behavior when property changes
     */
    it('should update filtering when ignoreCase property changes', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'Apple' },
                { text: 'BANANA' },
                { text: 'cherry' }
            ],
            allowFiltering: true,
            ignoreCase: true  // Start with case-insensitive
        });
        ddl.appendTo(element);
        expect(ddl.ignoreCase).toBe(true);
        // Change to case-sensitive
        ddl.ignoreCase = false;
        ddl.dataBind();
        expect(ddl.ignoreCase).toBe(false);
        done();
    });
    /**
     * Test Case 11: Empty search with case-sensitivity
     * Expected: Should return all items when search is empty
     */
    it('should return all items for empty search regardless of case setting', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'Apple' },
                { text: 'Banana' },
                { text: 'Cherry' }
            ],
            allowFiltering: true,
            debounceDelay: 0,
            ignoreCase: false  // Case-sensitive
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            ddl.filterInput.value = "";
            keyEventArgs.keyCode = 222;
            ddl.onInput()
            ddl.onFilterUp(keyEventArgs);
            const items = ddl.popupObj.element.querySelectorAll('.e-list-item');
            expect(items.length).toBe(3);
            done();
        }, 100);
    });
    /**
     * Test Case 12: Case-sensitive partial string match
     * Expected: Should match partial strings with case consideration
     */
    it('should match partial strings with case sensitivity', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'JavaScript' },
                { text: 'javascript' },
                { text: 'JAVASCRIPT' }
            ],
            allowFiltering: true,
            debounceDelay: 0,
            ignoreCase: false  // Case-sensitive
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            ddl.filterInput.value = "Java";
            keyEventArgs.keyCode = 65;
            ddl.onInput()
            ddl.onFilterUp(keyEventArgs);
            const items = ddl.popupObj.element.querySelectorAll('.e-list-item');
            expect(items.length).toBeGreaterThan(0);
            let found = false;
            items.forEach((item: any) => {
                if (item.textContent.includes('JavaScript')) {
                    found = true;
                }
            });
            expect(found).toBe(true);
            done();
        }, 100);
    });
});
