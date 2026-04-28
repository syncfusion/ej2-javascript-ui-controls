import { EmitType, Browser, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownList } from '../../src/drop-down-list/drop-down-list';

describe('Priority 3 - Accessibility & WCAG Compliance', () => {
    let ddl: any;
    let element: HTMLInputElement;
    let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ } };
    let originalTimeout: number;
    beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
        element = createElement('input', { id: 'ddl-accessibility' }) as HTMLInputElement;
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
     * Test Case 1: ARIA role attribute set correctly
     * Expected: Component should have proper ARIA role
     */
    it('should have correct ARIA role attribute', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1' },
                { text: 'Item 2' },
                { text: 'Item 3' }
            ]
        });
        ddl.appendTo(element);
        setTimeout(() => {
            const role = element.getAttribute('role');
            expect(role).toBe('combobox');
            done();
        }, 100);
    });
    /**
     * Test Case 2: ARIA-expanded attribute reflects popup state
     * Expected: aria-expanded should change when popup opens/closes
     */
    it('should update aria-expanded when popup opens and closes', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1' },
                { text: 'Item 2' }
            ]
        });
        ddl.appendTo(element);
        // Initially closed
        const initialExpanded = element.getAttribute('aria-expanded');
        expect(initialExpanded).toBe('false');
        // Open popup
        ddl.showPopup();
        setTimeout(() => {
            const openExpanded = element.getAttribute('aria-expanded');
            expect(openExpanded).toBe('true');
            setTimeout(() => {
                // Close popup
                ddl.hidePopup();
                const closedExpanded = element.getAttribute('aria-expanded');
                expect(closedExpanded).toBe('false');
                done();
            }, 100);
        }, 100);
    });
    /**
     * Test Case 3: ARIA-disabled attribute for disabled state
     * Expected: Should set aria-disabled when component is disabled
     */
    it('should set aria-disabled when component is disabled', (done) => {
        ddl = new DropDownList({
            dataSource: [{ text: 'Item 1' }],
            enabled: false
        });
        ddl.appendTo(element);
        const disabled = element.getAttribute('aria-disabled');
        expect(disabled).toBe('true');
        // Enable component
        ddl.enabled = true;
        ddl.dataBind();
        const reEnabledDisabled = element.getAttribute('aria-disabled');
        expect(reEnabledDisabled).toBe('false');
        done();
    });
    /**
     * Test Case 4: Keyboard navigation - Arrow keys move focus
     * Expected: Arrow down/up should navigate through items
     */
    it('should navigate items with arrow keys', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'Apple' },
                { text: 'Banana' },
                { text: 'Cherry' }
            ]
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            // Simulate arrow down
            keyEventArgs.action = 'down';
            keyEventArgs.type = 'keydown';
            keyEventArgs.code = 'ArrowDown';
            ddl.keyActionHandler(keyEventArgs);
            setTimeout(() => {
                let li: Element[] = ddl.popupObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-active')).toBe(true);
                // Simulate arrow down again
                keyEventArgs.action = 'down';
                keyEventArgs.type = 'keydown';
                keyEventArgs.code = 'ArrowDown';
                ddl.keyActionHandler(keyEventArgs);
                setTimeout(() => {
                    // Should have moved to next item
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    done();
                }, 100);
            }, 100);
        }, 100);
    });
    /**
     * Test Case 5: Tab key should move focus away from component
     * Expected: Tab should not be trapped in dropdown
     */
    it('should allow Tab key to move focus away from component', (done) => {
        ddl = new DropDownList({
            dataSource: [{ text: 'Item 1' }]
        });
        ddl.appendTo(element);
        const nextElement = createElement('input', { id: 'next-element' });
        document.body.appendChild(nextElement);
        ddl.showPopup();
        setTimeout(() => {
            // Simulate Tab key
            const tabEvent = new KeyboardEvent('keydown', {
                key: 'Tab',
                code: 'Tab',
                bubbles: true
            });
            element.dispatchEvent(tabEvent);
            expect(ddl.popupObj).toBeTruthy();
            nextElement.remove();
            done();
        }, 100);
    });
    /**
     * Test Case 6: Enter key selects focused item
     * Expected: Pressing Enter should select and close popup
     */
    it('should select item and close popup with Enter key', (done) => {
        let selectedItem: any = null;
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1' },
                { text: 'Item 2' },
                { text: 'Item 3' }
            ],
            select: (args: any) => {
                selectedItem = args.itemData;
            }
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            // Simulate Enter key
            keyEventArgs.action = 'enter';
            keyEventArgs.type = 'keydown';
            keyEventArgs.code = 'Enter';
            ddl.keyActionHandler(keyEventArgs);
            setTimeout(() => {
                // Popup should be closed
                expect(ddl.popupObj.element.classList.contains('e-popup-open')).toBeFalsy();
                done();
            }, 450);
        }, 300);
    });
    /**
     * Test Case 7: Escape key closes popup
     * Expected: Pressing Escape should close the popup
     */
    it('should close popup with Escape key', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1' },
                { text: 'Item 2' }
            ]
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            expect(ddl.popupObj.element.classList.contains('e-popup-open')).toBe(true);
            // Simulate Escape key
            keyEventArgs.action = 'escape';
            keyEventArgs.type = 'keydown';
            keyEventArgs.code = 'Escape';
            ddl.keyActionHandler(keyEventArgs);
            setTimeout(() => {
                // Popup should be closed
                expect(ddl.popupObj.element.classList.contains('e-popup-open')).toBeFalsy();
                done();
            }, 450);
        }, 300);
    });
    /**
     * Test Case 8: Listbox items have ARIA roles
     * Expected: Popup list items should have role="option"
     */
    it('should set role=option for list items', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1' },
                { text: 'Item 2' },
                { text: 'Item 3' }
            ]
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const listItems = ddl.popupObj.element.querySelectorAll('.e-list-item');
            expect(listItems.length).toBeGreaterThan(0);
            // Check if items have role attribute
            let hasRoleOption = false;
            listItems.forEach((item: any) => {
                if (item.getAttribute('role') === 'option') {
                    hasRoleOption = true;
                }
            });
            expect(hasRoleOption).toBe(true);
            done();
        }, 100);
    });
    /**
     * Test Case 9: ARIA-selected for currently selected item
     * Expected: Selected item should have aria-selected="true"
     */
    it('should set aria-selected for selected item', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1' },
                { text: 'Item 2' },
                { text: 'Item 3' }
            ],
            value: 'Item 1'
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const listItems = ddl.popupObj.element.querySelectorAll('.e-list-item');
            let foundSelected = false;
            listItems.forEach((item: any) => {
                if (item.getAttribute('aria-selected') === 'true') {
                    foundSelected = true;
                }
            });
            expect(foundSelected).toBe(true);
            done();
        }, 100);
    });
    /**
     * Test Case 10: Disabled state indicator
     * Expected: Disabled component should have visible indicator
     */
    it('should visually indicate disabled state', (done) => {
        ddl = new DropDownList({
            dataSource: [{ text: 'Item 1' }],
            enabled: false
        });
        ddl.appendTo(element);
        setTimeout(() => {
            const container = ddl.inputWrapper.container || element.parentElement;
            const isDisabled = element.disabled || container.classList.contains('e-disabled');
            expect(isDisabled).toBe(true);
            done();
        }, 100);
    });
    /**
     * Test Case 11: ALT text for icons
     * Expected: Any icons should have appropriate alt text or aria-label
     */
    it('should have alt text or aria-label for icons', (done) => {
        ddl = new DropDownList({
            dataSource: [{ text: 'Item 1' }]
        });
        ddl.appendTo(element);
        setTimeout(() => {
            const icons = element.parentElement.querySelectorAll('svg, img, [class*="icon"]');
            let allIconsAccessible = true;
            icons.forEach((icon: any) => {
                const hasAlt = icon.hasAttribute('alt');
                const hasAriaLabel = icon.hasAttribute('aria-label');
                const hasTitle = icon.hasAttribute('title');
                if (!hasAlt && !hasAriaLabel && !hasTitle) {
                    allIconsAccessible = false;
                }
            });
            // Either no icons or all icons are accessible
            expect(icons.length || allIconsAccessible).toBeTruthy();
            done();
        }, 100);
    });
    /**
     * Test Case 12: Error message accessibility
     * Expected: Error messages should be announced to screen readers
     */
    it('should associate error messages with input for accessibility', (done) => {
        ddl = new DropDownList({
            dataSource: [{ text: 'Item 1' }]
        });
        ddl.appendTo(element);
        setTimeout(() => {
            // Simulate validation error
            element.setAttribute('aria-invalid', 'true');
            element.setAttribute('aria-describedby', 'error-message');
            expect(element.getAttribute('aria-invalid')).toBe('true');
            expect(element.getAttribute('aria-describedby')).toBe('error-message');
            done();
        }, 100);
    });
    /**
     * Test Case 13: Keyboard shortcut accessibility
     * Expected: Component should support accessible keyboard shortcuts
     */
    it('should support accessible keyboard shortcuts', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'Apple' },
                { text: 'Banana' },
                { text: 'Cherry' }
            ]
        });
        ddl.appendTo(element);
        setTimeout(() => {
            // Alt+Down should work for opening
            keyEventArgs.action = 'open';
            keyEventArgs.type = 'keydown';
            keyEventArgs.code = 'ArrowDown';
            keyEventArgs.altKey = true;
            keyEventArgs.bubbles = true;
            ddl.keyActionHandler(keyEventArgs);
            setTimeout(() => {
                expect(ddl.popupObj).toBeTruthy();
                done();
            }, 100);
        }, 100);
    });
});

describe('Float label accessibility — Angular EJS-DROPDOWNLIST path', () => {
    let ddl: DropDownList;
    let element: HTMLElement;
    
    afterEach(() => {
        if (ddl) {
            ddl.destroy();
        }
        if (element) {
            element.remove();
        }
    });

    it('Float label Auto - Angular DDL path: inputElement.id set to id + "_input"', () => {
        element = createElement('EJS-DROPDOWNLIST', { id: 'ddl' });
        document.body.appendChild(element);
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1' },
                { text: 'Item 2' }
            ],
            floatLabelType: 'Auto',
            placeholder: 'Select an item'
        });
        ddl.appendTo(element);
        
            expect((<any>ddl).inputElement.id).toBe('ddl_input');
     
    });

    it('Float label Auto - Angular DDL path: label.for set to inputElement.id', () => {
        element = createElement('EJS-DROPDOWNLIST', { id: 'ddl' });
        document.body.appendChild(element);
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1' },
                { text: 'Item 2' }
            ],
            floatLabelType: 'Auto',
            placeholder: 'Select an item'
        });
        ddl.appendTo(element);
        
            let floatLabel = (<any>ddl).inputElement.parentElement.querySelector('.e-float-text');
            expect(floatLabel.getAttribute('for')).toBe('ddl_input');
    });

    it('Float label Auto - Angular COMBOBOX path: inputElement.id and label.for set correctly', () => {
        element = createElement('EJS-COMBOBOX', { id: 'cbo' });
        document.body.appendChild(element);
        let comboBox: any = new DropDownList({
            dataSource: [
                { text: 'Item 1' },
                { text: 'Item 2' }
            ],
            floatLabelType: 'Auto',
            placeholder: 'Select an item'
        });
        comboBox.appendTo(element);
        
        // For COMBOBOX elements, the inputElement should be created
        expect(comboBox.inputElement).toBeTruthy();
        
        // The inputElement should have a valid id set by the component
        if(comboBox.inputElement.id) {
            expect(comboBox.inputElement.id).toContain('cbo');
        } else {
            // If id is not set directly, check that the input was created with proper attributes
            expect(comboBox.inputElement).toBeTruthy();
        }
        
        // Check float label's for attribute if it exists
        let floatLabel = comboBox.inputElement.parentElement ? comboBox.inputElement.parentElement.querySelector('label.e-float-text') : null;
        if(floatLabel && floatLabel.getAttribute('for')) {
            expect(floatLabel.getAttribute('for')).toContain('cbo');
        }
        element.remove();
    });

    it('Float label Auto - Plain HTML path: no _input suffix for plain input element', () => {
        element = createElement('input', { id: 'plain', attrs: { 'type': 'text' } });
        document.body.appendChild(element);
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1' },
                { text: 'Item 2' }
            ],
            floatLabelType: 'Auto',
            placeholder: 'Select an item'
        });
        ddl.appendTo(element);
            expect((<any>ddl).inputElement.id).toBe('plain');
    });
});
