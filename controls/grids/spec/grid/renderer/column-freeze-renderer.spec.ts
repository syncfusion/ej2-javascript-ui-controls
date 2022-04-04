/**
 * Freeze Renderer spec
 */
import { Grid } from '../../../src/grid/base/grid';
import { Column } from '../../../src/grid/models';
import { data } from '../base/datasource.spec';
import { Freeze } from '../../../src/grid/actions/freeze';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Sort } from '../../../src/grid/actions/sort';
import { Aggregate } from '../../../src/grid/actions/aggregate';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import { RowDD } from '../../../src/grid/actions/row-reorder';
import { Edit } from '../../../src/grid/actions/edit';
import { Filter } from '../../../src/grid/actions/filter';
import { createGrid, destroy, getClickObj } from '../base/specutil.spec';
import { NotifyArgs } from '../../../src/grid/base/interface';
import { getScrollBarWidth } from '../../../src/grid/base/util';

Grid.Inject(Freeze, Aggregate, Edit, Reorder, Filter, Sort, VirtualScroll);

describe('Column freeze render module', () => {
    describe('Freeze the column at left side', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
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
            expect(gridObj.getFrozenColumns()).toBe(0);
            expect(gridObj.frozenRows).toBe(2);
        });
        it('Ensure frozen left initial selection', () => {
            expect(gridObj.getSelectedRows().length).toBe(gridObj.getTablesCount());
        });
        it('Ensure frozen left scroll elements', () => {
            expect(gridObj.getContent().querySelector('.e-scrollbar')).not.toBeNull();
            expect(gridObj.getContent().querySelector('.e-frozen-right-scrollbar')).toBeNull();
            expect(gridObj.getContent().querySelector('.e-frozen-left-scrollbar')).not.toBeNull();
            expect(gridObj.getContent().querySelector('.e-movablescrollbar')).not.toBeNull();
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
            expect(gridObj.getTablesCount()).toBe(2);
        });
        it('Ensure frozen left styles', () => {
            expect((gridObj.getContent().firstChild as HTMLElement).style.overflow).toBe('hidden scroll');
            expect((gridObj.getContent().firstChild as HTMLElement).style.display).toBe('flex');
            expect((gridObj.getMovableVirtualContent() as HTMLElement).style.flex).toBe('1 1 0%');
        });
        it('Ensure frozen left content divs height', () => {
            expect((gridObj.getMovableVirtualContent() as HTMLElement).style.height).toBe((gridObj.getFrozenVirtualContent() as HTMLElement).style.height);
        });
        it('Ensure frozen left tables', () => {
            expect(gridObj.getHeaderContent().querySelectorAll('.e-frozen-left-header').length).toBe(1);
            expect(gridObj.getContent().querySelectorAll('.e-frozen-left-content').length).toBe(1);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-movableheader').length).toBe(1);
            expect(gridObj.getContent().querySelectorAll('.e-movablecontent').length).toBe(1);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-frozen-right-header').length).toBe(0);
            expect(gridObj.getContent().querySelectorAll('.e-frozen-right-content').length).toBe(0);
        });
        it('Ensure frozen left frozenColumns count', () => {
            expect(gridObj.getFrozenColumns()).toBe(0);
        });
        it('Ensure frozen left columns order', () => {
            let cols: Column[] = gridObj.getColumns();
            expect(cols[0].field).toBe('ShipCountry');
            expect(cols[1].field).toBe('ShipCity');
            expect(cols[2].field).toBe('OrderID');
            expect(cols[3].field).toBe('CustomerID');
            expect(cols[4].field).toBe('EmployeeID');
        });
        it('Ensure frozen left columns freezeTable name', () => {
            let cols: Column[] = gridObj.getColumns();
            expect(cols[0].getFreezeTableName()).toBe('frozen-left');
            expect(cols[1].getFreezeTableName()).toBe('frozen-left');
            expect(cols[2].getFreezeTableName()).toBe('movable');
            expect(cols[3].getFreezeTableName()).toBe('movable');
            expect(cols[4].getFreezeTableName()).toBe('movable');
        });
        it('Ensure frozen left colgroups', () => {
            let left: Column[] = gridObj.getFrozenLeftColumns();
            let movable: Column[] = gridObj.getMovableColumns();
            expect(gridObj.getHeaderContent().querySelectorAll('colgroup').length).toBe(2);
            expect(gridObj.getHeaderContent().querySelectorAll('colgroup')[0].childElementCount).toBe(2);
            expect(gridObj.getHeaderContent().querySelectorAll('colgroup')[1].childElementCount).toBe(3);
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[0] as HTMLElement).style.width).toBe(left[0].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[1] as HTMLElement).style.width).toBe(left[1].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[1].children[0] as HTMLElement).style.width).toBe(movable[0].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[1].children[1] as HTMLElement).style.width).toBe(movable[1].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[1].children[2] as HTMLElement).style.width).toBe(movable[2].width + 'px');
        });
        it('Ensure frozen left row selection', (done: Function) => {
            let rowSelect = (args: any) => {
                expect(gridObj.getSelectedRows().length).toBe(gridObj.getTablesCount());
                expect(args.row).toBe(gridObj.getFrozenRowByIndex(args.rowIndex));
                expect(args.mRow).toBe(gridObj.getMovableRowByIndex(args.rowIndex));
                expect(args.frozenRightRow).toBeUndefined();
                gridObj.rowSelected = null;
                done();
            }
            gridObj.rowSelected = rowSelect;
            gridObj.selectRow(3);
        });
        it('Frozen left scroll action', () => {
            (gridObj.getContent().firstChild as HTMLElement).scrollTop = 50;
            (gridObj.getContent().querySelector('.e-movablescrollbar') as HTMLElement).scrollLeft = 50;
        });
        it('Ensure frozen left sort action', (done: Function) => {
            let actionComplete = (args: any): any => {
                expect(gridObj.sortSettings.columns[0].field).toBe('OrderID');
                expect((gridObj.getContent().firstChild as HTMLElement).scrollTop).toBe(50);
                expect((gridObj.scrollModule as any).previousValues.top).toBe(50);
                expect((gridObj.getContent().querySelector('.e-movablescrollbar') as HTMLElement).scrollLeft).toBe(50);
                expect(gridObj.getMovableVirtualContent().scrollLeft).toBe(50);
                expect(gridObj.getMovableVirtualHeader().scrollLeft).toBe(50);
                expect(gridObj.getFrozenVirtualContent().scrollTop).toBe(0);
                expect(gridObj.getMovableVirtualContent().scrollTop).toBe(0);
                expect((gridObj.scrollModule as any).previousValues.left).toBe(50);
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
                this.skip(); //Skips test (in Chai)
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
        it('Ensure frozen right scroll elements', () => {
            expect(gridObj.getContent().querySelector('.e-frozen-right-scrollbar')).not.toBeNull();
            expect(gridObj.getContent().querySelector('.e-frozen-left-scrollbar')).toBeNull();
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
            expect(gridObj.getTablesCount()).toBe(2);
        });
        it('Ensure frozen right content divs height', () => {
            expect((gridObj.getMovableVirtualContent() as HTMLElement).style.height).toBe((gridObj.getFrozenVirtualContent() as HTMLElement).style.height);
        });
        it('Ensure frozen right tables', () => {
            expect(gridObj.getHeaderContent().querySelectorAll('.e-frozen-right-header').length).toBe(1);
            expect(gridObj.getContent().querySelectorAll('.e-frozen-right-content').length).toBe(1);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-movableheader').length).toBe(1);
            expect(gridObj.getContent().querySelectorAll('.e-movablecontent').length).toBe(1);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-frozen-left-header').length).toBe(0);
            expect(gridObj.getContent().querySelectorAll('.e-frozen-left-content').length).toBe(0);
        });
        it('Ensure frozen right columns order', () => {
            let cols: Column[] = gridObj.getColumns();
            expect(cols[3].field).toBe('ShipCountry');
            expect(cols[4].field).toBe('ShipCity');
            expect(cols[0].field).toBe('OrderID');
            expect(cols[1].field).toBe('CustomerID');
            expect(cols[2].field).toBe('EmployeeID');
        });
        it('Ensure frozen right columns freezeTable name', () => {
            let cols: Column[] = gridObj.getColumns();
            expect(cols[0].getFreezeTableName()).toBe('movable');
            expect(cols[1].getFreezeTableName()).toBe('movable');
            expect(cols[2].getFreezeTableName()).toBe('movable');
            expect(cols[3].getFreezeTableName()).toBe('frozen-right');
            expect(cols[4].getFreezeTableName()).toBe('frozen-right');
        });
        it('Ensure frozen right colgroups', () => {
            let right: Column[] = gridObj.getFrozenRightColumns();
            let movable: Column[] = gridObj.getMovableColumns();
            expect(gridObj.getHeaderContent().querySelectorAll('colgroup').length).toBe(2);
            expect(gridObj.getHeaderContent().querySelectorAll('colgroup')[0].childElementCount).toBe(movable.length);
            expect(gridObj.getHeaderContent().querySelectorAll('colgroup')[1].childElementCount).toBe(right.length);
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[0] as HTMLElement).style.width).toBe(movable[0].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[1] as HTMLElement).style.width).toBe(movable[1].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[2] as HTMLElement).style.width).toBe(movable[2].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[1].children[0] as HTMLElement).style.width).toBe(right[0].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[1].children[1] as HTMLElement).style.width).toBe(right[1].width + 'px');
        });
        it('Ensure frozen right filterbar cells', () => {
            expect(gridObj.getHeaderTable().querySelectorAll('.e-filterbarcell').length).toBe(gridObj.getFrozenRightColumnsCount());
            expect(gridObj.getHeaderTable().querySelector('#ShipCity_filterBarcell')).not.toBeNull();
            expect(gridObj.getHeaderTable().querySelector('#ShipCountry_filterBarcell')).not.toBeNull();
            expect(gridObj.getMovableVirtualHeader().querySelectorAll('.e-filterbarcell').length).toBe(gridObj.getMovableColumnsCount());
        });
        it('Ensure frozen right row selection', (done: Function) => {
            let rowSelect = (args: any) => {
                expect(gridObj.getSelectedRows().length).toBe(gridObj.getTablesCount());
                expect(args.row).toBe(gridObj.getFrozenRightRowByIndex(args.rowIndex));
                expect(args.mRow).toBe(gridObj.getMovableRowByIndex(args.rowIndex));
                expect(args.frozenRightRow).toBeUndefined();
                expect(gridObj.getFrozenRowByIndex(0)).toBe(gridObj.getFrozenRightRowByIndex(0));
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

    describe('EJ2-58375 - Unfreeze the column at right side', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    height: 400,
                    allowFiltering: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', width: 120 },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 130 },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 100 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 150 },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 160 },
                    ]
                }, done);
        });
        it('Freeze the column to right side', () => {
            expect(gridObj.getFrozenMode()).toBeUndefined();
            gridObj.getColumns()[2].freeze  = 'Right';
            gridObj.refreshColumns();
            expect(gridObj.getFrozenMode()).toBe('Right');
        });
        it('Check frozenName', () => {
            (gridObj.getColumns()[4] as any).freeze = 'Center';
            gridObj.refreshColumns();
            expect(gridObj.getFrozenMode()).toBeUndefined();
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
                this.skip(); //Skips test (in Chai)
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
        it('Ensure frozen left-right scroll elements', () => {
            expect(gridObj.getContent().querySelector('.e-frozen-right-scrollbar')).not.toBeNull();
            expect(gridObj.getContent().querySelector('.e-frozen-left-scrollbar')).not.toBeNull();
            expect((gridObj.getContent().querySelector('.e-movablescrollbar') as HTMLElement).style.maxHeight).toBe(getScrollBarWidth() + 'px');
            expect((gridObj.getContent().querySelector('.e-movablechild') as HTMLElement).style.maxHeight).toBe(getScrollBarWidth() + 'px');
        });
        it('Ensure frozen left initial selection', () => {
            expect(gridObj.getSelectedRows().length).toBe(gridObj.getTablesCount());
        });
        it('Ensure frozen left-right cells count', () => {
            expect(gridObj.getRows()[0].childElementCount).toBe(1);
            expect(gridObj.getMovableRows()[0].childElementCount).toBe(3);
            expect(gridObj.getFrozenRightRows()[0].childElementCount).toBe(1);
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
            expect(gridObj.getTablesCount()).toBe(3);
        });
        it('Ensure frozen left-right content divs height', () => {
            expect((gridObj.getMovableVirtualContent() as HTMLElement).style.height).toBe((gridObj.getFrozenVirtualContent() as HTMLElement).style.height);
            expect((gridObj.getFrozenRightContent() as HTMLElement).style.height).toBe((gridObj.getFrozenVirtualContent() as HTMLElement).style.height);
        });
        it('Ensure frozen left-right tables', () => {
            expect(gridObj.getHeaderContent().querySelectorAll('.e-frozen-right-header').length).toBe(1);
            expect(gridObj.getContent().querySelectorAll('.e-frozen-right-content').length).toBe(1);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-movableheader').length).toBe(1);
            expect(gridObj.getContent().querySelectorAll('.e-movablecontent').length).toBe(1);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-frozen-left-header').length).toBe(1);
            expect(gridObj.getContent().querySelectorAll('.e-frozen-left-content').length).toBe(1);
        });
        it('Ensure frozen left-right columns order', () => {
            let cols: Column[] = gridObj.getColumns();
            expect(cols[3].field).toBe('ShipCountry');
            expect(cols[0].field).toBe('ShipCity');
            expect(cols[4].field).toBe('OrderID');
            expect(cols[1].field).toBe('CustomerID');
            expect(cols[2].field).toBe('EmployeeID');
        });
        it('Ensure frozen left-right columns freezeTable name', () => {
            let cols: Column[] = gridObj.getColumns();
            expect(cols[0].getFreezeTableName()).toBe('frozen-left');
            expect(cols[1].getFreezeTableName()).toBe('movable');
            expect(cols[2].getFreezeTableName()).toBe('movable');
            expect(cols[3].getFreezeTableName()).toBe('movable');
            expect(cols[4].getFreezeTableName()).toBe('frozen-right');
        });
        it('Ensure frozen left-right colgroups', () => {
            let left: Column[] = gridObj.getFrozenLeftColumns();
            let right: Column[] = gridObj.getFrozenRightColumns();
            let movable: Column[] = gridObj.getMovableColumns();
            expect(gridObj.getHeaderContent().querySelectorAll('colgroup').length).toBe(3);
            expect(gridObj.getHeaderContent().querySelectorAll('colgroup')[0].childElementCount).toBe(left.length);
            expect(gridObj.getHeaderContent().querySelectorAll('colgroup')[1].childElementCount).toBe(movable.length);
            expect(gridObj.getHeaderContent().querySelectorAll('colgroup')[2].childElementCount).toBe(right.length);

            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[0].children[0] as HTMLElement).style.width).toBe(left[0].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[1].children[0] as HTMLElement).style.width).toBe(movable[0].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[1].children[1] as HTMLElement).style.width).toBe(movable[1].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[1].children[2] as HTMLElement).style.width).toBe(movable[2].width + 'px');
            expect((gridObj.getHeaderContent().querySelectorAll('colgroup')[2].children[0] as HTMLElement).style.width).toBe(right[0].width + 'px');
        });
        it('Ensure frozen left-right filterbar cells', () => {
            expect(gridObj.getHeaderTable().querySelectorAll('.e-filterbarcell').length).toBe(gridObj.getFrozenLeftColumnsCount());
            expect(gridObj.getFrozenRightHeader().querySelectorAll('.e-filterbarcell').length).toBe(gridObj.getFrozenRightColumnsCount());
            expect(gridObj.getMovableVirtualHeader().querySelectorAll('.e-filterbarcell').length).toBe(gridObj.getMovableColumnsCount());
            expect(gridObj.element.querySelector('.e-frozen-right-header').querySelector('#OrderID_filterBarcell')).not.toBeNull();
            expect(gridObj.getHeaderTable().querySelector('#ShipCity_filterBarcell')).not.toBeNull();
        });
        it('Ensure frozen left-right row selection', (done: Function) => {
            let rowSelect = (args: any) => {
                expect(gridObj.getSelectedRows().length).toBe(gridObj.getTablesCount());
                expect(args.row).toBe(gridObj.getFrozenRowByIndex(args.rowIndex));
                expect(args.mRow).toBe(gridObj.getMovableRowByIndex(args.rowIndex));
                expect(args.frozenRightRow).toBe(gridObj.getFrozenRightRowByIndex(args.rowIndex));
                expect(gridObj.getFrozenRowByIndex(0)).not.toBe(gridObj.getFrozenRightRowByIndex(0));
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
            gridObj .reorderColumns('ShipCity', 'CustomerID');
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
                this.skip(); //Skips test (in Chai)
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
                this.skip(); //Skips test (in Chai)
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
        it('Ensure frozen left-right aggregate', () => {
            let left: Element = gridObj.getFooterContent().querySelector('.e-frozen-left-footercontent');
            let right: Element = gridObj.getFooterContent().querySelector('.e-frozen-right-footercontent');
            let movable: Element = gridObj.getFooterContent().querySelector('.e-movablefootercontent');
            expect(left).not.toBeNull();
            expect(right).not.toBeNull();
            expect(movable).not.toBeNull();
            expect((right.querySelectorAll('.e-summarycell')[0] as HTMLElement).innerHTML).toBe("");
            expect((right.querySelectorAll('.e-summarycell')[1] as HTMLElement).innerHTML).not.toBe("");
            expect((left.querySelectorAll('.e-summarycell')[0] as HTMLElement).innerHTML).not.toBe("");
            expect((left.querySelectorAll('.e-summarycell')[1] as HTMLElement).innerHTML).toBe("");
            expect((movable.querySelectorAll('.e-summarycell')[0] as HTMLElement).innerHTML).toBe("");
            expect((movable.querySelectorAll('.e-summarycell')[1] as HTMLElement).innerHTML).toBe("");
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

    describe('Column freeze left and right empty grid row height check', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: [],
                    width: 900,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', width: 120, isPrimaryKey: true },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 130, freeze: 'Right' },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 100 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 150 },
                        { headerText: 'ShipCity', field: 'ShipCity', freeze: 'Left', width: 160 },
                    ]
                }, done);
        });
        it('Ensure empty row height', () => {
            let rows: HTMLElement[] = [].slice.call(gridObj.getContent().querySelectorAll('.e-emptyrow'));
            expect(rows.length).toBe(gridObj.getTablesCount());
            let height1: number = rows[0].getBoundingClientRect().height;
            let height2: number = rows[1].getBoundingClientRect().height;
            let height3: number = rows[2].getBoundingClientRect().height;
            expect(height1).toBe(height2);
            expect(height2).toBe(height3);
        });
        it('Ensure hide scroll', () => {
            gridObj.hideScroll();
            expect((gridObj.getContent().querySelector('.e-scrollbar') as HTMLElement).style.display).toBe('none');
        });
        afterAll(() => {
            gridObj['freezeModule'].destroy();
            destroy(gridObj as any);
        });
    });

    describe('Column freeze with virtual scroll check', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    width: 900,
                    enableVirtualization: true,
                    height: 200,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', width: 120, isPrimaryKey: true },
                        { headerText: 'CustomerID', field: 'CustomerID', width: 130, freeze: 'Right' },
                        { headerText: 'EmployeeID', field: 'EmployeeID', width: 100 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 150 },
                        { headerText: 'ShipCity', field: 'ShipCity', freeze: 'Left', width: 160 },
                    ]
                }, done);
        });
        it('Ensure virtual caches', (done: Function) => {
            expect(Object.keys((gridObj as any).contentModule.virtualRenderer.vgenerator.frozenRightCache).length).not.toBe(0);
            expect(Object.keys((gridObj as any).contentModule.virtualRenderer.vgenerator.movableCache).length).not.toBe(0);
            expect(Object.keys((gridObj as any).contentModule.virtualRenderer.vgenerator.cache).length).not.toBe(0);
            setTimeout(done, 400);
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
                this.skip(); //Skips test (in Chai)
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
            expect(gridObj.getFrozenRightHeader().querySelector('thead').children[1].children[1].classList.contains('e-rowdragheader')).toBeTruthy();
            expect(gridObj.getFrozenRightHeader().querySelector('#CustomerID_filterBarcell')).toBeTruthy();
            expect((gridObj.getRows()[0] as any).cells[1].classList.contains('e-rowdragdrop'));
        });
        afterAll(() => {
            gridObj['freezeModule'].destroy();
            destroy(gridObj as any);
        });
    });
});