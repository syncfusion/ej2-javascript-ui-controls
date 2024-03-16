/**
 * Cell merge renderer spec 
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { CellMergeRender } from '../../../src/grid/renderer/cell-merge-renderer';
import { ContentRender } from '../../../src/grid/renderer/content-renderer';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { data, filterData } from '../base/datasource.spec';
import { extend } from '@syncfusion/ej2-base';
import { GridModel } from '../../../src/grid/base/grid-model';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import { Page } from '../../../src/grid/actions/page';
import { Edit } from '../../../src/grid/actions/edit';
import { profile, inMB, getMemoryProfile } from '../base/common.spec';

Grid.Inject(VirtualScroll, Page, Edit);

describe('Cell Merge', () => {

    describe('methods', () => {
        let gridObject: Grid;

        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObject = createGrid({
                dataSource: data,
                allowReordering: false,
                columns: [
                    { field: 'OrderID', headerText: 'OrderID', width: 150 },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'EmployeeID', width: 150 },
                    { field: 'Freight', headerText: 'Freight', width: 200 },
                    { field: 'ShipCity', headerText: 'ShipCity', visible: false, width: 180 },
                    { field: 'ShipName', headerText: 'Ship Name', width: 180 }],
                queryCellInfo: function (args: any) {
                    if (args.data.EmployeeID == 5 && args.column.field == 'EmployeeID') {
                        args.colSpan = 2;
                    }
                    if (args.data.EmployeeID == 3 && args.column.field == 'EmployeeID') {
                        args.colSpan = 3;
                        args.rowSpan = 2;
                    }
                    if (args.column.field == 'ShipName') {
                        args.colSpan = 2;
                    }
                    if (args.data.OrderID == 10248 && args.column.field == 'OrderID') {
                        args.rowSpan = 2;
                    }

                }
            }, done);
        });

        it('-- render --', () => {
            let tr = gridObject.getContentTable().querySelectorAll('tr');
            let row3 = tr[3].querySelectorAll('td');
            let row0 = tr[0].querySelectorAll('td');
            expect(row0.length).toBe(5);
            expect(row0[row0.length - 1].getAttribute('colspan')).toBe(null);
            expect(row3[2].innerHTML).toBe('3');
            expect(row3.length).toBe(4);
            expect(row3[2].getAttribute('colspan')).toBe('3');
            expect(row3[2].getAttribute('rowspan')).toBe('2');
            expect(Object.getOwnPropertyNames(gridObject.mergeCells).length).toBe(0);
        });

        it('-- internal methods --', () => {
            let cMerge = new CellMergeRender(gridObject.serviceLocator, gridObject);
            expect((cMerge as any).containsKey("fname", "data")).toBe(false);
            (cMerge as any).backupMergeCells("fname", "data", 10);
            expect((cMerge as any).containsKey("fname", "data")).toBe(true);
            let mCells: { [key: string]: number } = (cMerge as any).getMergeCells();
            let value: number, merge: string[];
            for (let key in mCells) {
                value = mCells[key];
                merge = (cMerge as any).splitKey(key);
            }
            expect(merge[0]).toBe("fname");
            expect(merge[1]).toBe("data");
            expect(value).toBe(10);
        });

        afterAll(() => {
            destroy(gridObject);
            gridObject = null;
        });

    });
    let createGrid: Function = (options: GridModel, done: Function): Grid => {
        let grid: Grid;
        let dataBound: EmitType<Object> = () => { done(); };
        let div: HTMLElement = createElement('div', { id: 'Grid' });
        document.body.appendChild(div);
        grid = new Grid(
            extend(
                {}, {
                    dataBound: dataBound,
                },
                options
            ),
        );
        grid.appendTo(div);
        return grid;
    };

    let destroy: EmitType<Object> = (grid: Grid) => {
        if (grid) {
            grid.destroy();
            document.getElementById('Grid').remove();
        }
    };
    let ctr: number = 0;
    let count5000: string[] = Array.apply(null, Array(500)).map(() => 'Column' + ++ctr + '');
    let data1: Object[] = (() => {
        let arr: Object[] = [];
        for (let i: number = 0, o: Object = {}, j: number = 0; i < 1000; i++ , j++ , o = {}) {
            count5000.forEach((lt: string) => o[lt] = 'Column' + lt + 'Row' + i);
            arr[j] = o;
        }
        return arr;
    })();
    describe('with Column virtualization', () => {

        describe('scroll left continous', () => {
            let grid: Grid;
            beforeAll((done: Function) => {
                grid = createGrid(
                    {
                        dataSource: data1,
                        columns: count5000,
                        enableVirtualization: true,
                        enableColumnVirtualization: true,
                        height: 300,
                        width: 400,
                        queryCellInfo: function (args: any) {
                            if (args.column.field == 'Column2') {
                                args.colSpan = 4;
                            }
                        }
                    },
                    () => {
                        (<HTMLElement>grid.getContent().firstChild).scrollLeft = 10;
                        (<HTMLElement>grid.getContent().firstChild).scrollLeft = 500;
                        done();
                    }
                );
            });
            it('cell merge check on cell recreate', () => {
                let cRender = new ContentRender(grid, grid.serviceLocator);
                cRender.renderPanel();
                cRender.renderTable();
                (grid as any).inViewIndexes = [3, 4, 5, 6];
                (cRender as any).contentTable = document.createElement('table');
                (cRender as any).contentTable.innerHTML = '<tbody></tbody>';
                cRender.refreshContentRows();
                expect(Object.getOwnPropertyNames(grid.mergeCells).length).toBeGreaterThan(0);
                let td = grid.getContentTable().querySelector('tbody tr').querySelectorAll('td');
                expect(td[1].getAttribute('colspan')).toBe('4');
                expect(td[1].getAttribute('aria-colspan')).toBe('4');
            });
            it('memory leak', () => {
                profile.sample();
                let average: any = inMB(profile.averageChange)
                //Check average change in memory samples to not be over 10MB
                expect(average).toBeLessThan(10);
                let memory: any = inMB(getMemoryProfile())
                //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
                expect(memory).toBeLessThan(profile.samples[0] + 0.25);
            });

            afterAll(() => {
                destroy(grid);
                grid = null;
            });
        });

    });

    // frozen rows and columns with column spanning and row spanning feature
    describe('EJ2-273272 - Need to provide support for frozen rows and columns with column spanning and row spanning', () => {
        let gridObj: Grid;
        let preventDefault: Function = new Function();
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    frozenColumns: 2,
                    allowPaging: true,
                    selectionSettings: { allowColumnSelection: true },
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right', minWidth: 10 },
                        { field: 'Freight', width: 125, format: 'C2', minWidth: 10 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 130, minWidth: 10 },
                        { field: 'EmployeeID', headerText: 'Employee ID', width: 180, minWidth: 10 },
                        { field: 'OrderDate', headerText: 'Order Date', freeze: 'Fixed', width: 150, format: 'yMd', textAlign: 'Right', minWidth: 10 },
                        { field: 'ShipRegion', headerText: 'Ship Region ', freeze: 'Fixed', width: 180, minWidth: 10 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 300, minWidth: 10 },
                        { field: 'ShipAddress', headerText: 'Ship Address', clipMode: 'Ellipsis', width: 170, minWidth: 10 },
                        { field: 'ShipCity', headerText: 'Ship City', freeze: 'Right', width: 250, minWidth: 10 },
                        { field: 'ShipCountry', headerText: 'Ship Country', freeze: 'Right', width: 250, minWidth: 10 },
                    ],
                    queryCellInfo: function (args: any) {
                        var data = args.data;
                        if (data.OrderID === 10249 && args.column.field === 'OrderID') {
                            args.colSpan = 2;
                        }
                        if (data.OrderID === 10249 && args.column.field === 'Freight') {
                            args.rowSpan = 3;
                        }
                        if (data.OrderID === 10248 && args.column.field === 'Freight') {
                            args.colSpan = 3;
                        }
                        if (data.OrderID === 10248 && args.column.field === 'OrderDate') {
                            args.colSpan = 5;
                        }
                        if (data.OrderID === 10248 && args.column.field === 'CustomerID') {
                            args.colSpan = 2;
                        }
                        if (data.OrderID === 10251 && args.column.field === 'EmployeeID') {
                            args.rowSpan = 2;
                        }
                        if (data.OrderID === 10255 && args.column.field === 'OrderDate') {
                            args.colSpan = 2;
                        }
                        if (data.OrderID === 10253 && args.column.field === 'OrderID') {
                            args.rowSpan = 2;
                        }
                        if (data.OrderID === 10253 && args.column.field === 'shipCity') {
                            args.colSpan = 5;
                        }
                        if (data.OrderID === 10251 && args.column.field === 'OrderDate') {
                            args.rowSpan = 2;
                        }
                        if (data.OrderID === 10252 && args.column.field === 'ShipRegion') {
                            args.rowSpan = 2;
                        }
                        if (data.OrderID === 10259 && args.column.field === 'ShipRegion') {
                            args.rowSpan = 2;
                        }
                        if (data.OrderID === 10258 && args.column.field === 'ShipName') {
                            args.rowSpan = 15;
                        }
            
                    },
                }, done);
        });

        it('-- Frozen grid with rowSpan and Colspan --', () => {
            let tr = gridObj.getContentTable().querySelectorAll('tr');
            let row1 = tr[1].querySelectorAll('td');
            let row2 = tr[2].querySelectorAll('td');
            expect(row1.length).toBe(9);
            expect(row2.length).toBe(9);
            expect(row2[row2.length - 1].getAttribute('colspan')).toBe(null);
            expect(row1[0].getAttribute('colspan')).toBe('2');
        });

        it('Rowspan and Colspan with columns selection - 1', () => {
            gridObj.selectionModule.selectColumn(1);
            let tr = gridObj.getContentTable().querySelectorAll('tr');
            let cells = tr[1].querySelectorAll('td');
            expect(cells[2].classList.contains('e-columnselection')).toBeFalsy();
        });

        
        it('Rowspan and Colspan with edting', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelector('.e-inline-edit').querySelectorAll('.e-rowcell').length).toBe(8);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });
        
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

});