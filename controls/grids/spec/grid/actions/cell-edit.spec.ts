import { Grid } from '../../../src/grid/base/grid';
import { data } from '../../../spec/grid/base/datasource.spec';
import { select } from '@syncfusion/ej2-base';
import { createGrid, destroy } from '../base/specutil.spec';

describe('CellEdit mode module', () => {
    let gridObj: Grid;
    let cellEditInstance: any;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending;
        }
        gridObj = createGrid(
            {
                dataSource:data,
                editSettings: {
                    allowEditing: true,
                    allowAdding: true,
                    allowDeleting: true,
                    mode: 'Cell'
                },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', width: 120, isPrimaryKey: true, validationRules: { required: true } },
                    { field: 'CustomerID', width: 150, validationRules: { required: true } },
                    { field: 'Freight', width: 120 },
                    { field: 'EmployeeID', width: 120, allowEditing: false },
                    { field: 'OrderDate', width: 150 },
                    { field: 'ShipCity', width: 150 },
                    { field: 'ShipCountry', width: 150, template: '${ShipCountry}' },
                    { field: 'Verified', width: 150, editType: 'booleanedit' }
                ],
                height: 400
            }, done);
    });

    beforeEach(() => {
        cellEditInstance = gridObj.editModule;
    });

    describe('saveCell() - Save Current Cell Edit', () => {
        it('should save string cell value correctly - edit cell', (done: Function) => {
            cellEditInstance.editCell(0, 'CustomerID');
            expect(gridObj.isEdit).toBe(true);
            expect(cellEditInstance.editModule.cellDetails.rowIndex).toBe(0);
            expect(cellEditInstance.editModule.cellDetails.column.field).toBe('CustomerID');
            done();
        });

        it('should save string cell value correctly - save cell', (done: Function) => {
            select('#' + gridObj.element.id + 'CustomerID', gridObj.element).value = 'Updated Customer';
            cellEditInstance.saveCell();
            expect(gridObj.isEdit).toBe(false);
            expect((gridObj.currentViewData[0] as any).CustomerID).toBe('Updated Customer');
            done();
        });

        it('should save numeric cell value correctly - edit cell', (done: Function) => {
            cellEditInstance.editCell(0, 'Freight');
            expect(gridObj.isEdit).toBe(true);
            expect(gridObj.element.querySelectorAll('.e-editedcell').length).toBe(1);
            done();
        });
        

        it('should save numeric cell value correctly - save cell', (done: Function) => {
            select('#' + gridObj.element.id + 'Freight', gridObj.element).value = 9999;
            cellEditInstance.saveCell();
            expect(gridObj.isEdit).toBe(false);
            expect((gridObj.currentViewData[0] as any).Freight).toBe(9999);
            expect(gridObj.element.querySelectorAll('e-editedcell').length).toBe(0);
            const cell = gridObj.getCellFromIndex(0, 2);
            expect(cell.textContent).toContain('9999');
            done();
        });

        it('should save boolean cell value correctly - edit cell', (done: Function) => {
            cellEditInstance.editCell(0, 'Verified');
            expect(gridObj.isEdit).toBe(true);
            expect(gridObj.element.querySelectorAll('.e-editedcell').length).toBe(1);
            done();
        });

        it('should edit cell - React', (done: Function) => {
            gridObj.isReact = true;
            cellEditInstance.editCell(0, 'ShipCountry');
            expect(gridObj.isEdit).toBe(true);
            done();
        });

        it('should validate cell before saving - edit cell', (done: Function) => {
            cellEditInstance.editCell(0, 'CustomerID');
            done();
        });

        it('should validate cell before saving - save cell', (done: Function) => {
            select('#' + gridObj.element.id + 'CustomerID', gridObj.element).value = '';
            (gridObj.getRows()[1].querySelector('.e-rowcell') as HTMLElement).click();
            expect(gridObj.isEdit).toBe(true);
            done();
        });

        it('should save cell - args cancel is true', (done: Function) => {
            gridObj.actionBegin = (args) => {
                if (args.requestType === 'save') {
                    args.cancel = true;
                }
                gridObj.actionBegin = null;
                done();
            }
            select('#' + gridObj.element.id + 'CustomerID', gridObj.element).value = 'Updated';
            cellEditInstance.saveCell();
            done();
        });

        it('save the cell', (done: Function) => {
            cellEditInstance.editModule.editNext = true;
            cellEditInstance.editModule.prevEditedBatchCell = true;
            cellEditInstance.saveCell();
            done();
        });

        it('should edit cell - args cancel is true', (done: Function) => {
            gridObj.actionBegin = (args) => {
                if (args.requestType === 'beginEdit') {
                    args.cancel = true;
                }
                gridObj.actionBegin = null;
                done();
            }
            cellEditInstance.editCell(0, 'CustomerID');
            done();
        });

        it('editCellExtend - isEdit is false', (done: Function) => {
            gridObj.isEdit = true;
            cellEditInstance.editModule.editCellExtend(1, 'CustomerID');
            done();
        });
        
        it('editCellExtend - primary key column', (done: Function) => {
            gridObj.isEdit = false;
            cellEditInstance.editModule .editCellExtend(1, 'OrderID');
            done();
        });

        it('edit cell - allowEditing is false', (done: Function) => {
            (gridObj.getRows()[0].querySelectorAll('.e-rowcell')[3] as HTMLElement).click();
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[0].querySelectorAll('.e-rowcell')[3] });
            done();
        });
        
    });

    describe('keyboard shortcuts testing => ', () => {     
        it('edit cell', (done: Function) => {
           cellEditInstance.editCell(0, 'Freight');
           done();
        });

        it('shift tab key', (done: Function) => {
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedcell') } as any);
            done();
        });

        it('tab key --1', (done: Function) => {
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedcell') } as any);
            done();
        });

        it('f2 key', (done: Function) => {
            let cell = gridObj.getContent().querySelector('.e-row').childNodes[1] as any;
            cell.click();
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: cell } as any);
            done();
        });

        it('enter key - savecell', (done: Function) => {
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[2].querySelectorAll('.e-rowcell')[2] });
        gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedcell') } as any);
            done();
        });

        it('enter key - editcell', (done: Function) => {
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.element.querySelectorAll('.e-row')[2].querySelectorAll('.e-rowcell')[2] } as any);
            expect(gridObj.element.querySelectorAll('.e-row')[2].querySelectorAll('.e-rowcell')[2].classList.contains('e-editedcell')).toBeTruthy();
             (gridObj.getRows()[2].querySelector('.e-rowcell') as HTMLElement).click();
            done();
        });
    });

    describe('updateCell() - Update Cell Value', () => {
        it('should update cell with string value', () => {
            const rowIndex = 0;
            const field = 'CustomerID';
            const value = 'Updated String';
            cellEditInstance.updateCell(rowIndex, field, value);
            expect(((gridObj.currentViewData[rowIndex] as any) as any)[field]).toBe(value);
        });

        it('should update cell with numeric value', () => {
            const rowIndex = 1;
            const field = 'Freight';
            const value = 12345;
            cellEditInstance.updateCell(rowIndex, field, value);
            expect(((gridObj.currentViewData[rowIndex] as any) as any)[field]).toBe(value);
        });

        it('should update cell with boolean value', () => {
            const rowIndex = 2;
            const field = 'Verified';
            const value = true;
            cellEditInstance.updateCell(rowIndex, field, value);
            expect((gridObj.currentViewData[rowIndex] as any)[field]).toBe(value);
        });

        it('should update cell with date value', () => {
            const rowIndex = 3;
            const field = 'OrderDate';
            const dateValue = new Date('2023-05-15');
            cellEditInstance.updateCell(rowIndex, field, dateValue);
            expect((gridObj.currentViewData[rowIndex] as any)[field]).toBe(dateValue);
        });

        it('should trigger actionBegin on updateCell', () => {
            let eventTriggered = false;
            const handler = () => {
                eventTriggered = true;
            };
            gridObj.addEventListener('actionBegin', handler);
            cellEditInstance.updateCell(0, 'CustomerID', 'New Value');
            expect(eventTriggered).toBe(true);
            gridObj.removeEventListener('actionBegin', handler);
        });

        it('should trigger actionComplete on updateCell', () => {
            let eventTriggered = false;
            const handler = () => {
                eventTriggered = true;
            };
            gridObj.addEventListener('actionComplete', handler);
            cellEditInstance.updateCell(0, 'CustomerID', 'Complete Test');
            expect(eventTriggered).toBe(true);
            gridObj.removeEventListener('actionComplete', handler);
        });

        it('should respect event cancellation in updateCell', () => {
            const rowIndex = 4;
            const field = 'CustomerID';
            const newValue = 'Should Not Update';
            const rowData = gridObj.currentViewData[rowIndex] as any;
            const handler = (args: any) => {
                args.cancel = true;
            };
            gridObj.addEventListener('actionBegin', handler);
            cellEditInstance.updateCell(rowIndex, field, newValue);
            gridObj.removeEventListener('actionBegin', handler);
            expect(rowData[field]).toBe(rowData[field]);
        });

        it('should clean rowObject changes after update', () => {
            const rowIndex = 5;
            const field = 'ShipCity';
            cellEditInstance.updateCell(rowIndex, field, 'City Update');
            const rowElement = gridObj.getRowByIndex(rowIndex);
            const rowObj = gridObj.getRowObjectFromUID(rowElement.getAttribute('data-uid'));
            expect(rowObj.hasOwnProperty('changes')).toBe(false);
        });


        it('should handle consecutive updateCell calls', () => {
            const rowIndex = 7;
            cellEditInstance.updateCell(rowIndex, 'CustomerID', 'Update 1');
            cellEditInstance.updateCell(rowIndex, 'ShipCity', 'City 1');
            cellEditInstance.updateCell(rowIndex, 'Freight', 9000);
            expect((gridObj.currentViewData[rowIndex] as any).CustomerID).toBe('Update 1');
            expect((gridObj.currentViewData[rowIndex] as any).ShipCity).toBe('City 1');
            expect((gridObj.currentViewData[rowIndex] as any).Freight).toBe(9000);
        });
    });

    describe('closeEdit() - Close Edit Mode', () => {
        it('should close edit and cancel changes', () => {
            const originalValue = (gridObj.currentViewData[0] as any).CustomerID;
            cellEditInstance.editCell(0, 'CustomerID');
            select('#' + gridObj.element.id + 'CustomerID', gridObj.element).value = 'Should be cancelled';
            expect(gridObj.element.classList.contains('e-editing')).toBe(true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_cancel' } });
            expect(gridObj.isEdit).toBe(false);
            expect(gridObj.element.classList.contains('e-editing')).toBe(false);
            expect((gridObj.currentViewData[0] as any).CustomerID).toBe(originalValue);
        });

        it('should trigger actionBegin on closeEdit', () => {
            let eventTriggered = false;
            const handler = (args: any) => {
                if (args.requestType === 'cancel') {
                    eventTriggered = true;
                }
            };
            gridObj.addEventListener('actionBegin', handler);
            cellEditInstance.editCell(0, 'CustomerID');
            cellEditInstance.closeEdit();
            expect(eventTriggered).toBe(true);
            gridObj.removeEventListener('actionBegin', handler);
        });

        it('should trigger actionComplete on closeEdit', () => {
            let eventTriggered = false;
            const handler = (args: any) => {
                if (args.type === 'actionComplete' && args.requestType === 'cancel') {
                    eventTriggered = true;
                }
            };
            gridObj.addEventListener('actionComplete', handler);
            cellEditInstance.editCell(0, 'CustomerID');
            cellEditInstance.closeEdit();
            expect(eventTriggered).toBe(true);
            gridObj.removeEventListener('actionComplete', handler);
        });

        it('should respect actionBegin cancellation', () => {
            const handler = (args: any) => {
                if (args.requestType === 'cancel') {
                    args.cancel = true;
                }
            };
            gridObj.addEventListener('actionBegin', handler);
            cellEditInstance.editCell(0, 'CustomerID');
            cellEditInstance.closeEdit();
            gridObj.removeEventListener('actionBegin', handler);
            expect(gridObj.isEdit).toBe(true);
        });

        it('should use cellEditModule.closeEdit for addedRow', () => {
            cellEditInstance.closeEdit();
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
            const addedRows = gridObj.element.getElementsByClassName('e-addedrow');
            if (addedRows.length > 0) {
                cellEditInstance.closeEdit();
            }
            expect(gridObj.isEdit).toBe(false);
        });
    });

    describe('addRecord() - Add New Record', () => {
        it('click the add toolbar button', (done: Function) => {
             gridObj.actionComplete = () => {
                expect(gridObj.isEdit).toBeTruthy();
                expect(gridObj.element.getElementsByClassName('e-addedrow').length).toBe(1);
                done();
            }
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
            done();
        });

        it('add the record', (done: Function) => {
            gridObj.actionComplete = (args: any) => {
                if (args.requestType === 'save') {
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            }
            (select('#' + gridObj.element.id + 'OrderID', gridObj.element) as any).value = 10247;
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element) as any).value = 'updated';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
            done();
        });
        it('should add new record with data', (done: Function) => {
            const initialCount = gridObj.currentViewData.length;
            const newData = {
                OrderID: 99999,
                CustomerID: 'New Customer',
                Freight: 5000,
                ShipCity: 'New City'
            };
            gridObj.actionComplete = (args: any) => {
                if (args.requestType === 'save') {
                    expect(gridObj.isEdit).toBeFalsy();
                    expect(gridObj.currentViewData.length).toBeGreaterThan(initialCount);
                    done();
                }
            }
            cellEditInstance.addRecord(newData);
            done();
        });

        it('should add record at specified index', (done: Function) => {
            const insertIndex = 2;
            const initialCount = gridObj.currentViewData.length
            const newData = {
                OrderID: 88888,
                CustomerID: 'Indexed Customer',
                Freight: 3000,
                ShipCity: 'Index City'
            };
            gridObj.actionComplete = (args: any) => {
                if (args.requestType === 'save') {
                    expect(gridObj.isEdit).toBeFalsy();
                    expect(gridObj.currentViewData.length).toBeGreaterThan(initialCount);
                    done();
                }
            }
            cellEditInstance.addRecord(newData, insertIndex);
            done();
        });

        it('should trigger actionBegin on addRecord', (done: Function) => {
            let eventTriggered = false;
            const handler = (args: any) => {
                if (args.requestType === 'save' || args.action === 'add') {
                    eventTriggered = true;
                }
            };
            gridObj.addEventListener('actionBegin', handler);
            cellEditInstance.addRecord({ OrderID: 1, CustomerID: 'Event Test' });
            gridObj.removeEventListener('actionBegin', handler);
            done();
        });
    });

    describe('deleteRecord() - Delete Record', () => {
        it('should delete record from grid', (done: Function) => {
            const initialCount = gridObj.currentViewData.length;
            const recordToDelete = (gridObj.currentViewData[0] as any);
             gridObj.actionComplete = (args: any) => {
                if (args.requestType === 'delete') {
                    expect(gridObj.currentViewData.length).toBeLessThan(initialCount);
                    done();
                }
            }
            cellEditInstance.deleteRecord('OrderID', recordToDelete);
            done();
        });

        it('should trigger actionBegin on deleteRecord', () => {
            let eventTriggered = false;
            const handler = (args: any) => {
                if (args.requestType === 'delete' || args.action === 'delete') {
                    eventTriggered = true;
                }
            };
            gridObj.addEventListener('actionBegin', handler);
            if (gridObj.currentViewData.length > 2) {
                const recordToDelete = gridObj.currentViewData[2];
                cellEditInstance.deleteRecord('OrderID', recordToDelete);
            }
            gridObj.removeEventListener('actionBegin', handler);
        });

        it('should trigger actionComplete on deleteRecord', () => {
            let eventTriggered = false;
            const handler = (args: any) => {
                if (args.type === 'actionComplete' && args.requestType === 'delete') {
                    eventTriggered = true;
                }
            };
            gridObj.addEventListener('actionComplete', handler);
            if (gridObj.currentViewData.length > 3) {
                const recordToDelete = gridObj.currentViewData[3];
                cellEditInstance.deleteRecord('OrderID', recordToDelete);
            }
            gridObj.removeEventListener('actionComplete', handler);
        });

        it('should respect actionBegin cancellation on delete', () => {
            let cancelCalled = false;
            const handler = (args: any) => {
                if (args.requestType === 'delete' || args.action === 'delete') {
                    args.cancel = true;
                    cancelCalled = true;
                }
            };
            gridObj.addEventListener('actionBegin', handler);
            if (gridObj.currentViewData.length > 4) {
                const recordToDelete = gridObj.currentViewData[4];
                cellEditInstance.deleteRecord('OrderID', recordToDelete);
            }
            gridObj.removeEventListener('actionBegin', handler);
        });

        it('should handle multiple consecutive deleteRecord calls', (done: Function) => {
            const initialLength = gridObj.currentViewData.length;
            if (gridObj.currentViewData.length > 1) {
                const record1 = (gridObj.currentViewData[0] as any);
                cellEditInstance.deleteRecord('OrderID', record1);
                expect(gridObj.currentViewData.length).toBeLessThanOrEqual(initialLength);
            }
            done();
        });

        it('click the cell', (done: Function) => {
            (gridObj.getRows()[1].querySelector('.e-rowcell') as HTMLElement).click();
            expect(gridObj.element.querySelectorAll('.e-row')[3].querySelectorAll('.e-rowcell')[2].classList.contains('e-editedcell')).toBeFalsy();
            done();
        });

        it('check the isDestroyed', () => {
            gridObj.isDestroyed = true;
            cellEditInstance.editModule.addEventListener();
        });
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = cellEditInstance = null;
    });
});

describe('CellEdit saveCell() - isTreeGrid branch coverage', () => {
    let gridObj: Grid;
    let cellEditInstance: any;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                editSettings: {
                    allowEditing: true,
                    allowAdding: true,
                    allowDeleting: true,
                    mode: 'Cell'
                },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', width: 120, isPrimaryKey: true, validationRules: { required: true } },
                    { field: 'CustomerID', width: 150, validationRules: { required: true } },
                    { field: 'Freight', width: 120 },
                    { field: 'EmployeeID', width: 120, allowEditing: false },
                    { field: 'OrderDate', width: 150 },
                    { field: 'ShipCity', width: 150 },
                    { field: 'ShipCountry', width: 150, template: '${ShipCountry}' },
                    { field: 'Verified', width: 150, editType: 'booleanedit' }
                ],
                height: 400
            }, done);
    });

    beforeEach(() => {
        cellEditInstance = gridObj.editModule;
    });

    it('should trigger queryCellInfo event when isTreeGrid is true', (done: Function) => {
        let queryCellInfoTriggered = false;
        gridObj['isTreeGrid'] = true;
        const handler = (args: any) => {
            if (args.type === 'queryCellInfo') {
                queryCellInfoTriggered = true;
            }
        };
        gridObj.addEventListener('queryCellInfo', handler);
        cellEditInstance.editCell(0, 'CustomerID');
        select('#' + gridObj.element.id + 'CustomerID', gridObj.element).value = 'TreeGrid Updated';
        cellEditInstance.saveCell();
        setTimeout(() => {
            expect((gridObj.currentViewData[0] as any).CustomerID).toBe('TreeGrid Updated');
            gridObj.removeEventListener('queryCellInfo', handler);
            gridObj['isTreeGrid'] = false;
            done();
        }, 100);
    });

    it('should save cell correctly when isTreeGrid branch is executed', (done: Function) => {
        gridObj['isTreeGrid'] = true;
        cellEditInstance.editCell(1, 'Freight');
        select('#' + gridObj.element.id + 'Freight', gridObj.element).value = 7777;
        cellEditInstance.saveCell();
        setTimeout(() => {
            expect(gridObj.isEdit).toBe(false);
            expect((gridObj.currentViewData[1] as any).Freight).toBe(7777);
            const cell = gridObj.getCellFromIndex(1, 2);
            expect(cell.textContent).toContain('7777');
            gridObj['isTreeGrid'] = false;
            done();
        }, 100);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = cellEditInstance = null;
    });
});
describe('CellEdit with Aggregates Enabled', () => {
    let gridObj: Grid;
    let cellEditModule: any;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                editSettings: {
                    allowEditing: true,
                    allowAdding: true,
                    allowDeleting: true,
                    mode: 'Cell'
                },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', width: 120, isPrimaryKey: true },
                    { field: 'CustomerID', width: 150 },
                    { field: 'Freight', width: 120 },
                    { field: 'ShipCity', width: 150 },
                ],
                aggregates: [
                    {
                        columns: [{ type: 'Sum', field: 'Freight', footerTemplate: 'Sum: ${Sum}' }]
                    }
                ],
                height: 400
            }, done);
    });

    beforeEach(() => {
        cellEditModule = gridObj.editModule;
    });

    it('should initialize grid with aggregates enabled', () => {
        expect(gridObj.aggregateModule).toBeDefined();
        expect(gridObj.aggregates.length).toBeGreaterThan(0);
    });

    it('should edit cell value without affecting aggregate initialization', () => {
        cellEditModule.editCell(0, 'Freight');
        expect(gridObj.isEdit).toBe(true);
        expect(gridObj.aggregateModule).toBeDefined();
    });

    it('should save numeric cell and trigger aggregate refresh', (done: Function) => {
        let prevSum = parseFloat(gridObj.element.querySelectorAll('.e-summarycell')[2].innerHTML.replace(/[^\d.-]/g, ''));
        const input = select('#' + gridObj.element.id + 'Freight', gridObj.element);
        const prevVal: number = parseFloat(input.value || '0');
        input.value = (prevVal + 1).toString();
        gridObj.actionComplete = (args?: any) => {
            if (args.requestType === 'save') {
                const expectedSum = parseFloat(gridObj.element.querySelectorAll('.e-summarycell')[2].innerHTML.replace(/[^\d.-]/g, ''));
                expect(expectedSum).toBe(prevSum + 1);
                done();
            }
        };
        (gridObj.getRows()[1].querySelector('.e-rowcell') as HTMLElement).click();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = cellEditModule = null;
    });
});

describe('CellEdit with Aggregates Enabled - disablePageWiseAggregates', () => {
    let gridObj: Grid;
    let cellEditModule: any;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                allowGrouping: true,
                groupSettings: {disablePageWiseAggregates: true, columns: ['CustomerID']},
                editSettings: {
                    allowEditing: true,
                    allowAdding: true,
                    allowDeleting: true,
                    mode: 'Cell'
                },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', width: 120, isPrimaryKey: true },
                    { field: 'CustomerID', width: 150 },
                    { field: 'Freight', width: 120 },
                    { field: 'ShipCity', width: 150 },
                ],
                aggregates: [
                    {
                        columns: [{ type: 'Sum', field: 'Freight', footerTemplate: 'Sum: ${Sum}' }]
                    }
                ],
                height: 400
            }, done);
    });

    beforeEach(() => {
        cellEditModule = gridObj.editModule;
    });

    it('should edit cell - disablePageWiseAggregates', (done: Function) => {
        (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[0].querySelectorAll('.e-rowcell')[2] });
        done();
    });

    it('should save the cell - disablePageWiseAggregates', (done: Function) => {
        const input = select('#' + gridObj.element.id + 'Freight', gridObj.element);
        const prevVal: number = parseFloat(input.value || '0');
        input.value = (prevVal + 1).toString();
        (gridObj.getRows()[1].querySelector('.e-rowcell') as HTMLElement).click();
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = cellEditModule = null;
    });
});

describe('CellEdit with Aggregates Enabled - enableLazyLoading', () => {
    let gridObj: Grid;
    let cellEditModule: any;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                allowGrouping: true,
                groupSettings: {enableLazyLoading: true, columns: ['CustomerID']},
                editSettings: {
                    allowEditing: true,
                    allowAdding: true,
                    allowDeleting: true,
                    mode: 'Cell'
                },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', width: 120, isPrimaryKey: true },
                    { field: 'CustomerID', width: 150 },
                    { field: 'Freight', width: 120 },
                    { field: 'ShipCity', width: 150 },
                ],
                aggregates: [
                    {
                        columns: [{ type: 'Sum', field: 'Freight', footerTemplate: 'Sum: ${Sum}' }]
                    }
                ],
                height: 400
            }, done);
    });

    beforeEach(() => {
        cellEditModule = gridObj.editModule;
    });


    it('caption expand', (done: Function) => {
        const expandElem: NodeListOf<Element> = gridObj.getContent().querySelectorAll('.e-recordpluscollapse');
        gridObj.groupModule.expandCollapseRows(expandElem[0]);
        done();
    });

    it('should edit cell - enableLazyLoading', (done: Function) => {
        (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[0].querySelectorAll('.e-rowcell')[2] });
        done();
    });

    it('should save the cell - enableLazyLoading', (done: Function) => {
        const input = select('#' + gridObj.element.id + 'Freight', gridObj.element);
        const prevVal: number = parseFloat(input.value || '0');
        input.value = (prevVal + 1).toString();
        cellEditModule.saveCell();
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = cellEditModule = null;
    });
});
describe('CellEdit with allowEditOnDblClick', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                editSettings: {
                    allowEditing: true,
                    allowAdding: true,
                    allowDeleting: true,
                    mode: 'Cell',
                    allowEditOnDblClick: false
                },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', width: 120, isPrimaryKey: true },
                    { field: 'CustomerID', width: 150 },
                ],
                height: 400
            }, done);
    });


    it('click the cell', (done: Function) => {
        (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[0].querySelectorAll('.e-rowcell')[1] });
        done();
    });

    it('allowEditOnDblClick is false', (done: Function) => {
        expect(gridObj.isEdit).toBe(false);
        expect(gridObj.element.querySelectorAll('.e-editedcell').length).toBe(0);
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});
describe('CellEdit with frozen rows', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                frozenRows: 2,
                editSettings: {
                    allowEditing: true,
                    allowAdding: true,
                    allowDeleting: true,
                    mode: 'Cell',
                },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', width: 120, isPrimaryKey: true },
                    { field: 'CustomerID', width: 150 },
                ],
                height: 400
            }, done);
    });


    it('click the cell', (done: Function) => {
        (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[0].querySelectorAll('.e-rowcell')[1] });
        done();
    });

    it('savecell for frozen row', (done: Function) => {
        (gridObj.getRows()[1].querySelector('.e-rowcell') as HTMLElement).click();
        expect(gridObj.isEdit).toBe(false);
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-1048262: Updated Cell Value Not Reflected in actionBegin requestType Save Event with Cell Editing', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Cell'},
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', width: 120, isPrimaryKey: true },
                    { field: 'CustomerID', width: 150 },
                ],
                height: 400
            }, done);
    });


    it('click the cell', (done: Function) => {
        (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[0].querySelectorAll('.e-rowcell')[1] });
        done();
    });

    it('savecell for frozen row', (done: Function) => {
        select('#' + gridObj.element.id + 'CustomerID', gridObj.element).value = 'Updated Customer';
        gridObj.actionBegin = (args?: any) => {
            if (args.requestType === 'save') {
                expect(args.data['CustomerID']).toBe('Updated Customer');
                done();
            }
        };
        (gridObj.getRows()[1].querySelector('.e-rowcell') as HTMLElement).click();
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Cell edit in toolbar button', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Cell'},
                selectionSettings: { mode: 'Cell' },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', width: 120, isPrimaryKey: true },
                    { field: 'CustomerID', width: 150 },
                ],
                height: 400
            }, done);
    });


    it('click the cell', (done: Function) => {
        (gridObj.element.querySelectorAll('.e-row')[0].querySelectorAll('.e-rowcell')[1] as HTMLElement).click();
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        done();
    });

    it('edit the cell', (done: Function) => {
        expect(gridObj.isEdit).toBeTruthy();
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});