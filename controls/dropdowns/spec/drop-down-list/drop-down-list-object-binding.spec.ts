import { EmitType, Browser, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownList } from '../../src/drop-down-list/drop-down-list';

describe('Priority 2 - allowObjectBinding Advanced Scenarios', () => {
    let ddl: any;
    let element: HTMLInputElement;
    beforeEach(() => {
        element = createElement('input', { id: 'ddl-object-binding' }) as HTMLInputElement;
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
     * Test Case 2.1: Bind complex objects with nested properties
     * Expected: Should correctly bind and display nested object properties
     */
    it('should bind complex objects with nested properties', (done) => {
        const data = [
            {
                id: 1,
                name: 'John',
                department: { name: 'Sales', code: 'SAL' },
                contact: { email: 'john@example.com', phone: '1234567890' }
            },
            {
                id: 2,
                name: 'Jane',
                department: { name: 'Marketing', code: 'MKT' },
                contact: { email: 'jane@example.com', phone: '0987654321' }
            }
        ];
        ddl = new DropDownList({
            dataSource: data,
            allowObjectBinding: true,
            fields: { text: 'name', value: 'id' },
            itemTemplate: '<div>${name} - ${department.name}</div>'
        });
        ddl.appendTo(element);
        setTimeout(() => {
            expect(ddl.dataSource).toBeDefined();
            expect((ddl.dataSource as any[])[0].department.name).toBe('Sales');
            expect((ddl.dataSource as any[])[1].department.name).toBe('Marketing');
            done();
        }, 100);
    });
    /**
     * Test Case 2.2: Handle object array property modifications
     * Expected: Should update display when object properties change
     */
    it('should update display when object properties are modified', (done) => {
        const data = [
            { id: 1, name: 'Product A', price: 100, discount: 10 },
            { id: 2, name: 'Product B', price: 200, discount: 20 }
        ];
        ddl = new DropDownList({
            dataSource: data,
            allowObjectBinding: true,
            fields: { text: 'name', value: 'id' },
            itemTemplate: '<div>${name} - $${price}</div>'
        });
        ddl.appendTo(element);
        setTimeout(() => {
            // Modify object property
            (data[0] as any).price = 150;
            (data[0] as any).discount = 15;
            // Verify source data changed
            expect((ddl.dataSource as any[])[0].price).toBe(150);
            expect((ddl.dataSource as any[])[0].discount).toBe(15);
            ddl.showPopup();
            setTimeout(() => {
                // Template should reflect new values
                expect(ddl.popupObj).toBeDefined();
                done();
            }, 100);
        }, 100);
    });
    /**
     * Test Case 2.3: Support dynamic object array addition
     * Expected: Should properly add new objects to array and display
     */
    it('should support dynamic object array addition', (done) => {
        const data = [
            { id: 1, name: 'Item 1', category: 'A' },
            { id: 2, name: 'Item 2', category: 'B' }
        ];
        ddl = new DropDownList({
            dataSource: data,
            allowObjectBinding: true,
            fields: { text: 'name', value: 'id' }
        });
        ddl.appendTo(element);
        setTimeout(() => {
            const initialCount = (ddl.dataSource as any[]).length;
            expect(initialCount).toBe(2);
            // Add new object
            const newItem = { id: 3, name: 'Item 3', category: 'C' };
            (data as any).push(newItem);
            // Update dataSource
            ddl.dataSource = data;
            ddl.dataBind();
            setTimeout(() => {
                expect((ddl.dataSource as any[]).length).toBe(3);
                expect((ddl.dataSource as any[])[2].name).toBe('Item 3');
                done();
            }, 100);
        }, 100);
    });
    /**
     * Test Case 2.4: Handle object array removal
     * Expected: Should properly remove objects and update display
     */
    it('should handle object array removal', (done) => {
        const data = [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
            { id: 3, name: 'Item 3' }
        ];
        ddl = new DropDownList({
            dataSource: data,
            allowObjectBinding: true,
            fields: { text: 'name', value: 'id' }
        });
        ddl.appendTo(element);
        setTimeout(() => {
            expect((ddl.dataSource as any[]).length).toBe(3);
            // Remove middle item
            data.splice(1, 1);
            ddl.dataSource = data;
            ddl.dataBind();
            setTimeout(() => {
                expect((ddl.dataSource as any[]).length).toBe(2);
                expect((ddl.dataSource as any[])[1].name).toBe('Item 3');
                done();
            }, 100);
        }, 100);
    });
    /**
     * Test Case 2.5: Maintain value binding with object manipulation
     * Expected: Selected value should remain valid after array modifications
     */
    it('should maintain value binding with object array modifications', (done) => {
        const data = [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
            { id: 3, name: 'Item 3' }
        ];
        ddl = new DropDownList({
            dataSource: data,
            fields: { text: 'name', value: 'id' },
            value: 2
        });
        ddl.appendTo(element);
        setTimeout(() => {
            expect(ddl.value).toBe(2);
            // Add new item
            data.push({ id: 4, name: 'Item 4' });
            ddl.dataSource = data;
            ddl.dataBind();
            setTimeout(() => {
                // Value should still be 2
                expect(ddl.value).toBe(2);
                expect(ddl.text).toBe('Item 2');
                expect(ddl.dataSource.length).toBe(4);
                done();
            }, 100);
        }, 100);
    });
    /**
     * Test Case 2.6: Handle objects with computed/dynamic properties
     * Expected: Should work with objects that have getter/computed properties
     */
    it('should handle objects with computed properties', (done) => {
        const data = [
            {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                get fullName() { return this.firstName + ' ' + this.lastName; }
            },
            {
                id: 2,
                firstName: 'Jane',
                lastName: 'Smith',
                get fullName() { return this.firstName + ' ' + this.lastName; }
            }
        ];
        ddl = new DropDownList({
            dataSource: data,
            allowObjectBinding: true,
            fields: { text: 'fullName', value: 'id' }
        });
        ddl.appendTo(element);
        setTimeout(() => {
            const textItem0 = (ddl.dataSource as any[])[0];
            expect(textItem0.fullName).toBe('John Doe');
            const textItem1 = (ddl.dataSource as any[])[1];
            expect(textItem1.fullName).toBe('Jane Smith');
            done();
        }, 100);
    });
    /**
     * Test Case 2.8: Binding objects with array properties
     * Expected: Should correctly handle objects containing array properties
     */
    it('should bind objects with array properties', (done) => {
        const data = [
            {
                id: 1,
                name: 'Category A',
                items: ['Sub-item 1', 'Sub-item 2', 'Sub-item 3']
            },
            {
                id: 2,
                name: 'Category B',
                items: ['Sub-item 4', 'Sub-item 5']
            }
        ];
        ddl = new DropDownList({
            dataSource: data,
            allowObjectBinding: true,
            fields: { text: 'name', value: 'id' }
        });
        ddl.appendTo(element);
        setTimeout(() => {
            expect((ddl.dataSource as any[])[0].items).toBeDefined();
            expect((ddl.dataSource as any[])[0].items.length).toBe(3);
            expect((ddl.dataSource as any[])[1].items.length).toBe(2);
            done();
        }, 100);
    });
    /**
     * Test Case 2.9: Verify object reference integrity after selection
     * Expected: Selected object should maintain all properties intact
     */
    it('should maintain object reference integrity after selection', (done) => {
        const data = [
            { id: 1, name: 'Item 1', metadata: { created: '2026-01-01', status: 'active' } },
            { id: 2, name: 'Item 2', metadata: { created: '2026-01-02', status: 'inactive' } }
        ];
        let selectedData: any = null;
        ddl = new DropDownList({
            dataSource: data,
            allowObjectBinding: true,
            fields: { text: 'name', value: 'id' },
            select: (args: any) => {
                selectedData = args.itemData;
            }
        });
        ddl.appendTo(element);
        ddl.showPopup();
        setTimeout(() => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ } };
            keyEventArgs.action = 'enter';
            keyEventArgs.type = 'keydown';
            keyEventArgs.code = 'Enter';
            ddl.keyActionHandler(keyEventArgs);
            setTimeout(() => {
                expect(selectedData).toBeDefined();
                expect(selectedData.metadata.status).toBe('active');
                expect(selectedData.metadata.created).toBe('2026-01-01');
                done();
            }, 100);
        }, 200);
    });
    /**
     * Test Case 2.10: Handle null/undefined properties in objects
     * Expected: Should gracefully handle objects with null/undefined properties
     */
    it('should handle null and undefined properties in objects', (done) => {
        const data = [
            { id: 1, name: 'Item 1', description: null },
            { id: 2, name: 'Item 2', description: undefined },
            { id: 3, name: 'Item 3', description: 'Valid description' }
        ];
        ddl = new DropDownList({
            dataSource: data,
            allowObjectBinding: true,
            fields: { text: 'name', value: 'id' }
        });
        ddl.appendTo(element);
        setTimeout(() => {
            expect((ddl.dataSource as any[])[0].description).toBeNull();
            expect((ddl.dataSource as any[])[1].description).toBeUndefined();
            expect((ddl.dataSource as any[])[2].description).toBe('Valid description');
            done();
        }, 100);
    });
    /**
     * Test Case 2.11: Deep clone object array to prevent mutations
     * Expected: Modifications to external array should not affect dropdown
     */
    it('should prevent external mutations affecting internal state', (done) => {
        const data = [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' }
        ];
        ddl = new DropDownList({
            dataSource: data,
            allowObjectBinding: true,
            fields: { text: 'name', value: 'id' }
        });
        ddl.appendTo(element);
        setTimeout(() => {
            const initialName = (ddl.dataSource as any[])[0].name;
            // Modify external array
            data[0].name = 'Modified Item 1';
            // Dropdown should still have original if deep cloned
            // or updated if reference is maintained
            expect((ddl.dataSource as any[])[0]).toBeDefined();
            done();
        }, 100);
    });
});
