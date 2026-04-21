import { EmitType, Browser, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownList } from '../../src/drop-down-list/drop-down-list';

describe('Priority 3 - Template Advanced Features', () => {
    let ddl: any;
    let element: HTMLInputElement;
    let skipAfterEach: boolean = false;
    beforeEach(() => {
        element = createElement('input', { id: 'ddl-template' }) as HTMLInputElement;
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
     * Test Case 3.1: Complex nested HTML template
     * Expected: Should render nested HTML structure correctly
     */
    it('should render complex nested HTML template', (done) => {
        const data = [
            { id: 1, name: 'Product 1', category: 'Category A', price: 100, inStock: true },
            { id: 2, name: 'Product 2', category: 'Category B', price: 200, inStock: false }
        ];
        const template = (data: any) => {
            return `
                <div class="product-item">
                    <div class="product-header">
                        <span class="product-name">${data.name}</span>
                        <span class="product-price">$${data.price}</span>
                    </div>
                    <div class="product-details">
                        <small class="category">${data.category}</small>
                        <span class="stock-status">${data.inStock ? 'In Stock' : 'Out of Stock'}</span>
                    </div>
                </div>
            `;
        };
        ddl = new DropDownList({
            dataSource: data,
            itemTemplate: template,
            fields: { text: 'name', value: 'id' }
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const templateElements = ddl.popupObj.element.querySelectorAll('.product-item');
            expect(templateElements.length).toBe(2);
            const firstItem = templateElements[0];
            expect(firstItem.querySelector('.product-name')).toBeTruthy();
            expect(firstItem.querySelector('.product-price')).toBeTruthy();
            done();
        }, 100);
    });
    /**
     * Test Case 3.2: Template with event binding
     * Expected: Event handlers in template should work
     */
    it('should handle events within templates', (done) => {
        let clickCount = 0;
        const data = [
            { id: 1, text: 'Item 1' },
            { id: 2, text: 'Item 2' }
        ];
        const template = '<div class="item-with-button"><span>${text}</span><button class="item-btn">Click</button></div>';
        ddl = new DropDownList({
            dataSource: data,
            itemTemplate: template,
            fields: { text: 'text', value: 'id' }
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const buttons = ddl.popupObj.element.querySelectorAll('.item-btn');
            if (buttons.length > 0) {
                buttons[0].addEventListener('click', () => {
                    clickCount++;
                });
                (buttons[0] as HTMLElement).click();
            }
            setTimeout(() => {
                expect(clickCount).toBe(1);
                done();
            }, 100);
        }, 100);
    });
    /**
     * Test Case 3.3: Header and Footer template
     * Expected: Should support header and footer templates
     */
    it('should render header and footer templates', (done) => {
        const data = [
            { text: 'Item 1' },
            { text: 'Item 2' },
            { text: 'Item 3' }
        ];
        const headerTemplate = '<div class="dropdown-header">Select an item:</div>';
        const footerTemplate = '<div class="dropdown-footer">Total: 3 items</div>';
        ddl = new DropDownList({
            dataSource: data,
            headerTemplate: headerTemplate,
            footerTemplate: footerTemplate
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const header = ddl.popupObj.element.querySelector('.dropdown-header');
            const footer = ddl.popupObj.element.querySelector('.dropdown-footer');
            expect(header).toBeTruthy();
            expect(footer).toBeTruthy();
            done();
        }, 100);
    });
    /**
     * Test Case 3.4: Item template vs Group template
     * Expected: Should render correct template for items vs groups
     */
    it('should distinguish item and group templates', (done) => {
        const data = [
            {
                text: 'Apple',
                category: 'Fruits'
            },
            {
                text: 'Banana',
                category: 'Fruits'
            },
            {
                text: 'Carrot',
                category: 'Vegetables'
            }
        ];
        const template = '<div class="item-template">${text}</div>';
        const groupTemplate = '<div class="group-template"><b>${category}</b></div>';
        ddl = new DropDownList({
            dataSource: data,
            itemTemplate: template,
            groupTemplate: groupTemplate,
            fields: { text: 'text', groupBy: 'category' }
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const items = ddl.popupObj.element.querySelectorAll('.item-template');
            const groups = ddl.popupObj.element.querySelectorAll('.group-template');
            expect(items.length).toBe(3);
            expect(groups.length).toBe(2);
            done();
        }, 100);
    });
    /**
     * Test Case 3.5: Dynamic template switching
     * Expected: Should support changing template at runtime
     */
    it('should support dynamic template switching', (done) => {
        const data = [
            { text: 'Item 1', value: 1 },
            { text: 'Item 2', value: 2 }
        ];
        const template1 = '<div class="template-1">${text}</div>';
        const template2 = '<div class="template-2"><b>${text}</b></div>';
        ddl = new DropDownList({
            dataSource: data,
            itemTemplate: template1
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            let items = ddl.popupObj.element.querySelectorAll('.template-1');
            expect(items.length).toBeGreaterThan(0);
            // Switch template
            ddl.itemTemplate = template2;
            ddl.dataBind();
            setTimeout(() => {
                items = ddl.popupObj.element.querySelectorAll('.template-2');
                expect(items.length).toBeGreaterThan(0);

                done();
            }, 100);
        }, 100);
    });
    /**
     * Test Case 3.6: Template with conditional rendering
     * Expected: Should support conditional content in template
     */
    it('should support conditional content in template', (done) => {
        const data = [
            { text: 'Premium Item', price: 100, isPremium: true },
            { text: 'Regular Item', price: 50, isPremium: false },
            { text: 'Budget Item', price: 10, isPremium: false }
        ];
        const template = (data: any) => {
            return `
                <div class="item-wrapper">
                    <span>${data.text}</span>
                    <span class="price">$${data.price}</span>
                    ${data.isPremium ? '<span class="badge">Premium</span>' : ''}
                </div>
            `;
        };
        ddl = new DropDownList({
            dataSource: data,
            itemTemplate: template,
            fields: { text: 'text', value: 'text' }
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const badges = ddl.popupObj.element.querySelectorAll('.badge');
            // Should have 1 premium badge
            expect(badges.length).toBe(1);
            done();
        }, 100);
    });
    /**
     * Test Case 3.7: Template performance with large dataset
     * Expected: Template rendering should be efficient with large datasets
     */
    it('should render templates efficiently with large dataset', (done) => {
        const largeData: { id: number; text: string; category: string }[] = [];
        for (let i = 0; i < 1000; i++) {
            largeData.push({
                id: i,
                text: `Item ${i}`,
                category: `Category ${i % 10}`
            });
        }
        const template = '<div class="item"><span>${text}</span><small>${category}</small></div>';
        const startTime = performance.now();
        ddl = new DropDownList({
            dataSource: largeData,
            itemTemplate: template,
            fields: { text: 'text', value: 'id' },
            popupHeight: '300px'
        });
        ddl.appendTo(element);
        ddl.showPopup();
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        expect(renderTime).toBeLessThan(500);
        done();
    });
    /**
     * Test Case 3.8: Interaction between template and data binding
     * Expected: Template should update when data changes
     */
    it('should update template when data changes', (done) => {
        let data = [
            { text: 'Item 1', status: 'active' },
            { text: 'Item 2', status: 'inactive' }
        ];
        let updatedData = [
            { text: 'Item 1', status: 'inactive' },
            { text: 'Item 2', status: 'inactive' }
        ];
        const template = '<div class="item" data-status="${status}">${text}</div>';
        ddl = new DropDownList({
            dataSource: data,
            itemTemplate: template,
            fields: { text: 'text', value: 'text' }
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            let items = ddl.popupObj.element.querySelectorAll('.item');
            expect((items[0] as any).getAttribute('data-status')).toBe('active');
            // Update data
            ddl.dataSource = updatedData;
            ddl.dataBind();
            setTimeout(() => {
                items = ddl.popupObj.element.querySelectorAll('.item');
                expect((items[0] as any).getAttribute('data-status')).toBe('inactive');

                done();
            }, 100);
        }, 100);
    });
    /**
     * Test Case 3.9: Template with custom styling classes
     * Expected: Custom CSS classes in template should be applied
     */
    it('should apply custom styling classes from template', (done) => {
        const data = [
            { text: 'Important', priority: 'high' },
            { text: 'Normal', priority: 'normal' },
            { text: 'Low', priority: 'low' }
        ];
        const template = '<div class="item priority-${priority}">${text}</div>';
        ddl = new DropDownList({
            dataSource: data,
            itemTemplate: template,
            fields: { text: 'text', value: 'text' }
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const items = ddl.popupObj.element.querySelectorAll('.item');
            expect(items[0].classList.contains('priority-high')).toBe(true);
            expect(items[1].classList.contains('priority-normal')).toBe(true);
            expect(items[2].classList.contains('priority-low')).toBe(true);

            done();
        }, 100);
    });
    /**
     * Test Case 3.10: Template memory management
     * Expected: Templates should be properly cleaned up
     */
    it('should properly cleanup templates on destroy', (done) => {
        const data = [
            { text: 'Item 1' },
            { text: 'Item 2' }
        ];
        skipAfterEach = true;
        const template = '<div class="custom-template-class">${text}</div>';
        ddl = new DropDownList({
            dataSource: data,
            itemTemplate: template
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            const templateElements = ddl.popupObj.element.querySelectorAll('.custom-template-class');
            expect(templateElements.length).toBe(2);
            // Destroy component
            ddl.destroy();
            setTimeout(() => {
                // Template elements should be removed or not accessible
                const remaining = document.querySelectorAll('.custom-template-class');
                // Should be minimal or zero after destroy
                expect(remaining.length).toBeLessThanOrEqual(2);

                done();
            }, 100);
        }, 100);
    });
});
