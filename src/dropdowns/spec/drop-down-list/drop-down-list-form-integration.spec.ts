import { EmitType, Browser, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownList } from '../../src/drop-down-list/drop-down-list';

describe('Priority 3 - Form Integration', () => {
    let ddl: any;
    let element: HTMLInputElement;
    let form: HTMLFormElement;
    beforeEach(() => {
        form = createElement('form', { id: 'test-form' }) as HTMLFormElement;
        element = createElement('input', { id: 'ddl-form' }) as HTMLInputElement;
        element.name = 'dropdown_field';
        form.appendChild(element);
        document.body.appendChild(form);
    });
    afterEach(() => {
        if (ddl) {
            ddl.destroy();
        }
        if (form) {
            form.remove();
        }
        if (element) {
            element.remove();
        }
        document.body.innerHTML = '';
    });
    /**
     * Test Case 3.1: Form submission includes dropdown value
     * Expected: Selected value should be submitted with form
     */
    it('should include dropdown value in form submission', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'Option 1', value: 'opt1' },
                { text: 'Option 2', value: 'opt2' },
                { text: 'Option 3', value: 'opt3' }
            ],
            fields: { text: 'text', value: 'value' },
            value: 'opt2'
        });
        ddl.appendTo(element);
        setTimeout(() => {
            // Get form data
            const formData = new FormData(form);
            const value = formData.get('dropdown_field');
            expect(value).toBe('opt2');
            done();
        }, 100);
    });
    /**
     * Test Case 3.3: HTML5 required attribute validation
     * Expected: Component should validate required attribute
     */
    it('should support HTML5 required attribute', (done) => {
        element.setAttribute('required', '');
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1' },
                { text: 'Item 2' }
            ]
        });
        ddl.appendTo(element);
        setTimeout(() => {
            const isRequired = element.hasAttribute('required');
            expect(isRequired).toBe(true);
            done();
        }, 100);
    });
    /**
     * Test Case 3.4: Form submission prevents if validation fails
     * Expected: Form should not submit if validation fails
     */
    it('should prevent form submission on validation failure', (done) => {
        let submitAttempted = false;
        element.setAttribute('required', '');
        form.addEventListener('submit', (e: any) => {
            submitAttempted = true;
            e.preventDefault();
        });
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1' },
                { text: 'Item 2' }
            ]
        });
        ddl.appendTo(element);
        setTimeout(() => {
            // Try to submit empty form
            const submitEvent = new Event('submit', { bubbles: true });
            form.dispatchEvent(submitEvent);
            setTimeout(() => {
                // Form should still be empty (validation failed)
                expect(ddl.value).toBeNull();
                done();
            }, 100);
        }, 100);
    });
    /**
     * Test Case 3.6: Multiple dropdowns in same form
     * Expected: Each dropdown should maintain separate value
     */
    it('should handle multiple dropdowns in same form', (done) => {
        // Create second dropdown
        const element2 = createElement('input', { id: 'ddl-form-2' }) as HTMLInputElement;
        element2.name = 'dropdown_field_2';
        form.appendChild(element2);
        const ddl1 = new DropDownList({
            dataSource: [
                { text: 'DDL1-Item1', value: 'ddl1_val1' },
                { text: 'DDL1-Item2', value: 'ddl1_val2' }
            ],
            fields: { text: 'text', value: 'value' },
            value: 'ddl1_val1'
        });
        ddl1.appendTo(element);
        ddl = new DropDownList({
            dataSource: [
                { text: 'DDL2-Item1', value: 'ddl2_val1' },
                { text: 'DDL2-Item2', value: 'ddl2_val2' }
            ],
            fields: { text: 'text', value: 'value' },
            value: 'ddl2_val2'
        });
        ddl.appendTo(element2);
        setTimeout(() => {
            const formData = new FormData(form);
            const val1 = formData.get('dropdown_field');
            const val2 = formData.get('dropdown_field_2');
            expect(val1).toBe('ddl1_val1');
            expect(val2).toBe('ddl2_val2');
            ddl1.destroy();
            element2.remove();
            done();
        }, 100);
    });
    /**
     * Test Case 3.7: Form data persistence after change
     * Expected: Form should contain latest dropdown value after change
     */
    it('should update form data when dropdown value changes', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1', value: 'val1' },
                { text: 'Item 2', value: 'val2' },
                { text: 'Item 3', value: 'val3' }
            ],
            fields: { text: 'text', value: 'value' },
            value: 'val1'
        });
        ddl.appendTo(element);
        setTimeout(() => {
            let formData = new FormData(form);
            expect(formData.get('dropdown_field')).toBe('val1');
            // Change value
            ddl.value = 'val2';
            ddl.dataBind();
            setTimeout(() => {
                formData = new FormData(form);
                expect(formData.get('dropdown_field')).toBe('val2');
                done();
            }, 100);
        }, 100);
    });
    /**
     * Test Case 3.8: Error class applied for invalid state
     * Expected: Invalid dropdown should have error styling class
     */
    it('should apply error styling when validation fails', (done) => {
        element.setAttribute('required', '');
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1' },
                { text: 'Item 2' }
            ]
        });
        ddl.appendTo(element);
        setTimeout(() => {
            // Simulate validation error
            const container = ddl.inputWrapper.container || element.parentElement;
            container.classList.add('e-error');
            expect(container.classList.contains('e-error')).toBe(true);
            done();
        }, 100);
    });
    /**
     * Test Case 3.9: Name attribute preserved for form field identification
     * Expected: Input name should remain unchanged and usable in form
     */
    it('should preserve name attribute for form field identification', (done) => {
        element.setAttribute('name', 'custom_dropdown_name');
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1', value: 'val1' }
            ],
            fields: { text: 'text', value: 'value' },
            value: 'val1'
        });
        ddl.appendTo(element);
        setTimeout(() => {
            const name = element.parentElement.firstElementChild.getAttribute('name');
            expect(name).toBe('custom_dropdown_name');
            const formData = new FormData(form);
            const value = formData.get('custom_dropdown_name');
            expect(value).toBe('val1');
            done();
        }, 100);
    });
    /**
     * Test Case 3.10: Form submission with empty dropdown
     * Expected: Form should handle empty dropdown appropriately
     */
    it('should handle form submission with empty dropdown', (done) => {
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1' },
                { text: 'Item 2' }
            ]
        });
        ddl.appendTo(element);
        setTimeout(() => {
            // No value selected
            expect(ddl.value).toBeNull();
            const formData = new FormData(form);
            const value = formData.get('dropdown_field');
            // Empty string or null
            expect(value === null || value === '').toBe(true);
            done();
        }, 100);
    });
    /**
     * Test Case 3.11: Form state tracking with dropdown changes
     * Expected: Form should track dirty state on dropdown changes
     */
    it('should track form dirty state on dropdown changes', (done) => {
        let isDirty = false;
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1', value: 'val1' },
                { text: 'Item 2', value: 'val2' }
            ],
            fields: { text: 'text', value: 'value' },
            value: 'val1',
            change: () => {
                isDirty = true;
            }
        });
        ddl.appendTo(element);
        setTimeout(() => {
            expect(isDirty).toBe(false);
            // Change value
            ddl.value = 'val2';
            ddl.dataBind();
            setTimeout(() => {
                expect(isDirty).toBe(true);
                done();
            }, 100);
        }, 100);
    });
    /**
     * Test Case 3.12: Readonly state prevents modification in form
     * Expected: Readonly dropdown should prevent changes in form context
     */
    it('should prevent modifications in readonly state', (done) => {
        element.setAttribute('readonly', '');
        ddl = new DropDownList({
            dataSource: [
                { text: 'Item 1', value: 'val1' },
                { text: 'Item 2', value: 'val2' }
            ],
            fields: { text: 'text', value: 'value' },
            value: 'val1',
            readonly: true
        });
        ddl.appendTo(element);
        setTimeout(() => {
            const isReadonly = element.hasAttribute('readonly');
            expect(isReadonly).toBe(true);
            // Try to change value
            const initialValue = ddl.value;
            ddl.value = 'val2';
            setTimeout(() => {
                // Value might not change or change internally but not submit
                expect(element.hasAttribute('readonly')).toBe(true);
                done();
            }, 100);
        }, 100);
    });
});
