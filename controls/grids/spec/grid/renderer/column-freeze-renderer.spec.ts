/**
 * Freeze Renderer spec
 */
import { Grid } from '../../../src/grid/base/grid';
import { Column } from '../../../src/grid/models';
import { data } from '../base/datasource.spec';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Sort } from '../../../src/grid/actions/sort';
import { Aggregate } from '../../../src/grid/actions/aggregate';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import { Edit } from '../../../src/grid/actions/edit';
import { Filter } from '../../../src/grid/actions/filter';
import { createGrid, destroy, getClickObj } from '../base/specutil.spec';
import { NotifyArgs } from '../../../src/grid/base/interface';
import { Toolbar } from '../../../src/grid/actions/toolbar';

Grid.Inject(Aggregate, Edit, Reorder, Filter, Sort, VirtualScroll, Toolbar);

describe('Column freeze render module', () => {
    describe('Freeze the column at left side', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    frozenColumns: 2,
                    frozenRows: 2,
                    selectedRowIndex: 2,
                    height: 400,
                    width: 400,
                    allowSorting: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 130 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 100 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', freeze: 'Left', width: 150 },
                        { headerText: 'ShipCity', field: 'ShipCity', freeze: 'Left', width: 160 },
                    ]
                }, done);
        });
        it('Ensure frozenColumns and frozenRows count', () => {
            expect(gridObj.getFrozenColumns()).toBe(2);
            expect(gridObj.frozenRows).toBe(2);
        });
        it('Ensure frozen left initial selection', () => {
            expect(gridObj.getSelectedRows().length).toBe(gridObj.getTablesCount());
        });
        it('Ensure frozen left methods', () => {
            expect(gridObj.isFrozenGrid()).toBe(true);
            expect(gridObj.getFrozenLeftColumnsCount()).toBe(2);
            expect(gridObj.getMovableColumnsCount()).toBe(3);
            expect(gridObj.getFrozenRightColumnsCount()).toBe(0);
            expect(gridObj.getFrozenLeftColumns().length).toBe(gridObj.getFrozenLeftColumnsCount());
            expect(gridObj.getMovableColumns().length).toBe(gridObj.getMovableColumnsCount());
            expect(gridObj.getFrozenRightColumns().length).toBe(gridObj.getFrozenRightColumnsCount());
            expect(gridObj.getFrozenMode()).toBe('Left')
            expect(gridObj.getTablesCount()).toBe(1);
        });
        it('Ensure frozen left frozenColumns count', () => {
            expect(gridObj.getFrozenColumns()).toBe(2);
        });
        it('Ensure frozen left columns order', () => {
            let cols: Column[] = gridObj.getColumns();
            expect(cols[0].field).toBe('ShipCountry');
            expect(cols[1].field).toBe('ShipCity');
            expect(cols[2].field).toBe('OrderID');
            expect(cols[3].field).toBe('CustomerID');
            expect(cols[4].field).toBe('EmployeeID');
        });
        it('Ensure frozen left colgroups', () => {
            let left: Column[] = gridObj.getFrozenLeftColumns();
            let movable: Column[] = gridObj.getMovableColumns();
            expect(gridObj.getHeaderContent().querySelectorAll('colgroup').length).toBe(1);
            expect(gridObj.getHeaderContent().querySelectorAll('colgroup')[0].childElementCount).toBe(5);
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[0] as HTMLElement).style.width).toBe(left[0].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[1] as HTMLElement).style.width).toBe(left[1].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[2] as HTMLElement).style.width).toBe(movable[0].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[3] as HTMLElement).style.width).toBe(movable[1].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[4] as HTMLElement).style.width).toBe(movable[2].width + 'px');
        });
        it('Ensure frozen left row selection', (done: Function) => {
            let rowSelect = (args: any) => {
                expect(gridObj.getSelectedRows().length).toBe(gridObj.getTablesCount());
                expect(args.row).toBe(gridObj.getRowByIndex(args.rowIndex));
                gridObj.rowSelected = null;
                done();
            }
            gridObj.rowSelected = rowSelect;
            gridObj.selectRow(3);
        });

        // getDataRows
        it('getDataRows check in frozen grid', () => {
            let row: any = gridObj.getRowByIndex(1);
            expect(row).toBe(gridObj.getMovableRowByIndex(1));
            expect(row).toBe(gridObj.getFrozenRowByIndex(1));
            expect(row).toBe(gridObj.getFrozenRightRowByIndex(1));
        });
        it('Frozen left scroll action', () => {
            (gridObj.getContent().firstChild as HTMLElement).scrollTop = 50;
            (gridObj.getContent().firstChild as HTMLElement).scrollLeft = 50;
        });
        it('Ensure frozen left sort action', (done: Function) => {
            let actionComplete = (args: any): any => {
                expect(gridObj.sortSettings.columns[0].field).toBe('OrderID');
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            let cols = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            (gridObj as any).mouseClickHandler(getClickObj(cols[2]));
        });
        afterAll(() => {
            gridObj['freezeModule'].destroy();
            destroy(gridObj);
        });
    });

    describe('Freeze the column at right side', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    frozenRows: 2,
                    height: 400,
                    selectedRowIndex: 2,
                    allowFiltering: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 130 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 100 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', freeze: 'Right', width: 150 },
                        { headerText: 'ShipCity', field: 'ShipCity', freeze: 'Right', width: 160 },
                    ]
                }, done);
        });

        it('Ensure frozen left initial selection', () => {
            expect(gridObj.getSelectedRows().length).toBe(gridObj.getTablesCount());
        });
        it('Ensure frozen right methods', () => {
            expect(gridObj.isFrozenGrid()).toBe(true);
            expect(gridObj.getFrozenRightColumnsCount()).toBe(2);
            expect(gridObj.getMovableColumnsCount()).toBe(3);
            expect(gridObj.getFrozenLeftColumnsCount()).toBe(0);
            expect(gridObj.getFrozenRightColumns().length).toBe(gridObj.getFrozenRightColumnsCount());
            expect(gridObj.getMovableColumns().length).toBe(gridObj.getMovableColumnsCount());
            expect(gridObj.getFrozenLeftColumns().length).toBe(gridObj.getFrozenLeftColumnsCount());
            expect(gridObj.getFrozenMode()).toBe('Right')
            expect(gridObj.getTablesCount()).toBe(1);
        });
        it('Ensure frozen right columns order', () => {
            let cols: Column[] = gridObj.getColumns();
            expect(cols[3].field).toBe('ShipCountry');
            expect(cols[4].field).toBe('ShipCity');
            expect(cols[0].field).toBe('OrderID');
            expect(cols[1].field).toBe('CustomerID');
            expect(cols[2].field).toBe('EmployeeID');
        });
        it('Ensure frozen right colgroups', () => {
            let right: Column[] = gridObj.getFrozenRightColumns();
            let movable: Column[] = gridObj.getMovableColumns();
            expect(gridObj.getHeaderContent().querySelectorAll('colgroup').length).toBe(1);
            expect(gridObj.getHeaderContent().querySelectorAll('colgroup')[0].childElementCount).toBe(movable.length + right.length);
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[0] as HTMLElement).style.width).toBe(movable[0].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[1] as HTMLElement).style.width).toBe(movable[1].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[2] as HTMLElement).style.width).toBe(movable[2].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[3] as HTMLElement).style.width).toBe(right[0].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[4] as HTMLElement).style.width).toBe(right[1].width + 'px');
        });
        it('Ensure frozen right filterbar cells', () => {
            expect(gridObj.getHeaderTable().querySelectorAll('.e-filterbarcell').length).toBe(gridObj.getFrozenRightColumnsCount() + gridObj.getMovableColumnsCount());
            expect(gridObj.getHeaderTable().querySelector('#ShipCity_filterBarcell')).not.toBeNull();
            expect(gridObj.getHeaderTable().querySelector('#ShipCountry_filterBarcell')).not.toBeNull();
        });
        it('Ensure frozen right row selection', (done: Function) => {
            let rowSelect = (args: any) => {
                expect(gridObj.getSelectedRows().length).toBe(gridObj.getTablesCount());
                expect(args.row).toBe(gridObj.getRowByIndex(args.rowIndex));
                gridObj.rowSelected = null;
                done();
            }
            gridObj.rowSelected = rowSelect;
            gridObj.selectRow(3);
        });
        afterAll(() => {
            gridObj['freezeModule'].destroy();
            destroy(gridObj as any);
        });
    });
    
    describe('Freeze the column at left and right side', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    frozenRows: 2,
                    height: 400,
                    selectedRowIndex: 2,
                    allowReordering: true,
                    allowFiltering: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', width: 120, freeze: 'Right' },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 130 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 100 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 150 },
                        { headerText: 'ShipCity', field: 'ShipCity', freeze: 'Left', width: 160 },
                    ]
                }, done);
        });
        it('Ensure frozen left initial selection', () => {
            expect(gridObj.getSelectedRows().length).toBe(gridObj.getTablesCount());
        });
        it('Ensure frozen left-right cells count', () => {
            expect(gridObj.getRows()[0].childElementCount).toBe(5);
            expect(gridObj.getMovableRows()[0].childElementCount).toBe(5);
            expect(gridObj.getFrozenRightRows()[0].childElementCount).toBe(5);
        });
        it('Ensure frozen left-right methods', () => {
            expect(gridObj.isFrozenGrid()).toBe(true);
            expect(gridObj.getFrozenRightColumnsCount()).toBe(1);
            expect(gridObj.getMovableColumnsCount()).toBe(3);
            expect(gridObj.getFrozenLeftColumnsCount()).toBe(1);
            expect(gridObj.getFrozenRightColumns().length).toBe(gridObj.getFrozenRightColumnsCount());
            expect(gridObj.getMovableColumns().length).toBe(gridObj.getMovableColumnsCount());
            expect(gridObj.getFrozenLeftColumns().length).toBe(gridObj.getFrozenLeftColumnsCount());
            expect(gridObj.getFrozenMode()).toBe('Left-Right')
            expect(gridObj.getTablesCount()).toBe(1);
        });
        it('Ensure frozen left-right columns order', () => {
            let cols: Column[] = gridObj.getColumns();
            expect(cols[3].field).toBe('ShipCountry');
            expect(cols[0].field).toBe('ShipCity');
            expect(cols[4].field).toBe('OrderID');
            expect(cols[1].field).toBe('CustomerID');
            expect(cols[2].field).toBe('EmployeeID');
        });
        it('Ensure frozen left-right colgroups', () => {
            let left: Column[] = gridObj.getFrozenLeftColumns();
            let right: Column[] = gridObj.getFrozenRightColumns();
            let movable: Column[] = gridObj.getMovableColumns();
            expect(gridObj.getHeaderContent().querySelectorAll('colgroup').length).toBe(1);
            expect(gridObj.getHeaderContent().querySelectorAll('colgroup')[0].childElementCount).toBe(left.length + movable.length + right.length);

            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[0] as HTMLElement).style.width).toBe(left[0].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[1] as HTMLElement).style.width).toBe(movable[0].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[2] as HTMLElement).style.width).toBe(movable[1].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[3] as HTMLElement).style.width).toBe(movable[2].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[4] as HTMLElement).style.width).toBe(right[0].width + 'px');
        });
        it('Ensure frozen left-right filterbar cells', () => {
            expect(gridObj.getHeaderTable().querySelectorAll('.e-filterbarcell').length).toBe(
                gridObj.getFrozenLeftColumnsCount() + gridObj.getFrozenRightColumnsCount() + gridObj.getMovableColumnsCount());
            expect(gridObj.element.querySelector('#OrderID_filterBarcell')).not.toBeNull();
            expect(gridObj.getHeaderTable().querySelector('#ShipCity_filterBarcell')).not.toBeNull();
        });
        it('Ensure frozen left-right row selection', (done: Function) => {
            let rowSelect = (args: any) => {
                expect(gridObj.getSelectedRows().length).toBe(gridObj.getTablesCount());
                expect(args.row).toBe(gridObj.getRowByIndex(args.rowIndex));
                gridObj.rowSelected = null;
                done();
            }
            gridObj.rowSelected = rowSelect;
            gridObj.selectRow(3);
        });
        it('Frozen left-right column reorder testing', (done: Function) => {
            let dataBound = (args: Object): void => {
                expect(gridObj.getFrozenMode()).toBe('Right');
                gridObj.dataBound = null;
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.dataBind();
            gridObj.reorderColumns('ShipCity', 'CustomerID');
        });
        afterAll(() => {
            gridObj['freezeModule'].destroy();
            destroy(gridObj as any);
        });
    });
    describe('Column freeze with batch editing', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    frozenRows: 2,
                    height: 400,
                    editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Batch' },
                    toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', width: 120, isPrimaryKey: true },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 130, freeze: 'Right' },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 100 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 150 },
                        { headerText: 'ShipCity', field: 'ShipCity', freeze: 'Left', width: 160 },
                    ]
                }, done);
        });
        it('Ensure frozen left-right batch add', (done: Function) => {
            let batchAdd = (e: any) => {
                expect(gridObj.element.querySelectorAll('.e-insertedrow').length).toBe(gridObj.getTablesCount());
                expect(gridObj.getRowsObject().length).toBe((gridObj.dataSource as object[]).length + 1);
                expect(gridObj.getFrozenRightRowsObject().length).toBe((gridObj.dataSource as object[]).length + 1);
                expect(gridObj.getMovableRowsObject().length).toBe((gridObj.dataSource as object[]).length + 1);
                expect(gridObj.getAllDataRows(true).length).toBe((gridObj.dataSource as object[]).length + 1);
                gridObj.batchAdd = null;
                done();
            };
            gridObj.batchAdd = batchAdd;
            gridObj.addRecord();
        });
         // getDataRows
         it('getDataRows check in frozen grid', () => {
            let length: any =gridObj.getRowsObject().length;
            expect(gridObj.getFrozenRightRowsObject().length).toBe(length);
            expect(gridObj.getMovableRowsObject().length).toBe(length);;
        });
        it('Ensure frozen left-right batch edit', (done: Function) => {
            let cellEdit = (e: any) => {
                expect(e.rowData.CustomerID).toBe(gridObj.currentViewData[0]['CustomerID']);
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editCell(1, 'CustomerID');
        });
        afterAll(() => {
            gridObj['freezeModule'].destroy();
            destroy(gridObj as any);
        });
    });
    describe('Column freeze with inline editing', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    frozenRows: 2,
                    height: 400,
                    editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },
                    toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', width: 120, isPrimaryKey: true },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 130, freeze: 'Right', validationRules: { required: true } },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 100 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 150 },
                        { headerText: 'ShipCity', field: 'ShipCity', freeze: 'Left', width: 160 },
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Count',
                            field: 'ShipCity',
                            format: 'C2',
                            footerTemplate: 'Sum: ${Count}'
                        }]
                    },
                    {
                        columns: [{
                            type: 'Count',
                            field: 'CustomerID',
                            format: 'C2',
                            footerTemplate: 'Average: ${Count}'
                        }]
                    }]
                }, done);
        });
        it('Ensure frozen left-right add row', (done: Function) => {
            let actionComplete = (e: NotifyArgs) => {
                if (e.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(gridObj.getTablesCount());
                    gridObj.actionBegin = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.addRecord();
        });
        it('Ensure frozen left-right check validation', () => {
            gridObj.endEdit();
            expect(gridObj.editModule.editFormValidate()).toBeFalsy();
        });
        afterAll(() => {
            gridObj['freezeModule'].destroy();
            destroy(gridObj as any);
        });
    });

    describe('Column right freeze with rowdd', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    width: 900,
                    allowRowDragAndDrop: true,
                    allowFiltering: true,
                    height: 200,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', width: 120, isPrimaryKey: true },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 130, freeze: 'Right' },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 100 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 150 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 160 },
                    ]
                }, done);
        });
        it('Ensure drag element position', () => {
            expect(gridObj.getHeaderContent().querySelector('thead').children[1].children[5].classList.contains('e-rowdragheader')).toBeTruthy();
            expect(gridObj.getHeaderContent().querySelector('#CustomerID_filterBarcell')).toBeTruthy();
            expect((gridObj.getRows()[0] as any).cells[5].classList.contains('e-rowdragdrop'));
        });
        afterAll(() => {
            gridObj['freezeModule'].destroy();
            destroy(gridObj as any);
        });
    });

    describe('EJ2-851714 - When the column field value is not defined, freeze property is not working properly', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [
                        { headerText: 'CustomerID', width: 130, freeze: 'Left' },
                        { headerText: 'OrderID', field: 'OrderID', width: 120, isPrimaryKey: true },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 100 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 150 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 160 },
                    ]
                }, done);
        });
        it('Ensure 1st Column freeze ', () => {
            expect((gridObj.getRows()[0] as any).cells[0].classList.contains('e-freezeleftborder')).toBeTruthy();
        });
        afterAll(() => {
            gridObj['freezeModule'].destroy();
            destroy(gridObj as any);
        });
    });

    describe('EJ2-862783 - Column width not working properly in Grid with Frozen Columns', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    width: '100%',
                    gridLines: 'Both',
                    allowResizing: true,
                    columns: [
                        { field: 'OrderID', width: 100, freeze: 'Left'},
                        { field: 'CustomerID', minWidth: 60 },
                        { field: 'Freight', minWidth: 60 },
                        { field: 'ShipCountry', minWidth: 60 },
                    ]
                }, done);
        });
        it('Ensure 1st Column Width ', () => {
            expect(Math.ceil((gridObj.getRows()[0] as any).cells[0].offsetWidth)).toBe(100);
        });
        afterAll(() => {
            gridObj['freezeModule'].destroy();
            destroy(gridObj as any);
        });
    });
});
