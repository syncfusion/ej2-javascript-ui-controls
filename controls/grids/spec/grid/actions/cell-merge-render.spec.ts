/**
 * Cell merge renderer spec 
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Column } from '../../../src/grid/models/column';
import { ICellFormatter } from '../../../src/grid/base/interface';
import { RowRenderer } from '../../../src/grid/renderer/row-renderer';
import { CellMergeRender } from '../../../src/grid/renderer/cell-merge-renderer';
import { ContentRender } from '../../../src/grid/renderer/content-renderer';
import { Row } from '../../../src/grid/models/row';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { data } from '../base/datasource.spec';
import { extend } from '@syncfusion/ej2-base';
import { GridModel } from '../../../src/grid/base/grid-model';
import {VirtualScroll} from '../../../src/grid/actions/virtual-scroll';

Grid.Inject(VirtualScroll);

describe('Cell Merge', () => {

    describe('methods', () => {
        let gridObject: Grid;

        beforeAll((done: Function) => {
            gridObject = createGrid({
                dataSource: data,
                allowReordering: false,
                columns: [
                    { field: 'OrderID',headerText: 'OrderID',width:150 },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'EmployeeID', width:150 },
                    { field: 'Freight', headerText: 'Freight',width:200  },
                    { field: 'ShipCity', headerText: 'ShipCity',visible: false, width:180  },
                    { field: 'ShipName', headerText: 'Ship Name',  width:180  }],
                queryCellInfo: function(args:any) {
                    if(args.data.EmployeeID == 5 && args.column.field == 'EmployeeID'){
                        args.colSpan = 2;
                    }        
                    if(args.data.EmployeeID == 3 && args.column.field == 'EmployeeID'){
                        args.colSpan = 3;
                    }
                    if (args.column.field == 'ShipName') {
                        args.colSpan = 2;
                    }
                }
            }, done);
        });

        it('-- render --', () => {
            let tr = gridObject.getContentTable().querySelectorAll('tr');
            let row3 = tr[3].querySelectorAll('td');
            let row0 = tr[0].querySelectorAll('td');
            expect(row0.length).toBe(5);
            expect(row0[row0.length-1].getAttribute('colspan')).toBe(null);
            expect(row3[2].innerHTML).toBe('3');
            expect(row3.length).toBe(4);
            expect(row3[2].getAttribute('colspan')).toBe('3');
            expect(Object.getOwnPropertyNames(gridObject.mergeCells).length).toBe(0);
        });

        it('-- internal methods --', () => {
            let cMerge = new CellMergeRender(gridObject.serviceLocator, gridObject);
            expect((cMerge as any).containsKey("fname", "data")).toBe(false);
            (cMerge as any).backupMergeCells("fname", "data", 10);
            expect((cMerge as any).containsKey("fname", "data")).toBe(true);
            let mCells: {[key: string]: number} = (cMerge as any).getMergeCells();
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
                let rows: HTMLTableRowElement;
                beforeAll((done: Function) => {
                    grid = createGrid(
                        {
                            dataSource: data1,
                            columns: count5000,
                            enableVirtualization: true,
                            enableColumnVirtualization: true,
                            height: 300,
                            width: 400,
                            queryCellInfo: function(args: any) {
                                if(args.column.field == 'Column2'){
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
                    (grid as any).inViewIndexes = [3,4,5];
                    (cRender as any).contentTable = document.createElement('table');
                    (cRender as any).contentTable.innerHTML = '<tbody></tbody>';
                    cRender.refreshContentRows();
                    expect(Object.getOwnPropertyNames(grid.mergeCells).length).toBeGreaterThan(0);
                    let td = grid.getContentTable().querySelector('tbody tr').querySelectorAll('td');
                    expect(td[1].getAttribute('colspan')).toBe('4');
                    expect(td[1].getAttribute('aria-colspan')).toBe('4');
                });
                
                afterAll(() => {
                    destroy(grid);
                });
            });
        

});

});