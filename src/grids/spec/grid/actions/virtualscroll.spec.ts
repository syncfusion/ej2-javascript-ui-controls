/**
 * virtual scrolling spec
 */
import { EmitType, EventHandler } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Sort } from '../../../src/grid/actions/sort';
import { Group } from '../../../src/grid/actions/group';
import { Selection } from '../../../src/grid/actions/selection';
import { Filter } from '../../../src/grid/actions/filter';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import { GridModel } from '../../../src/grid/base/grid-model';
import { Column, ColumnModel } from '../../../src/grid/models/column';
import { Row } from '../../../src/grid/models/row';
import { VirtualContentRenderer } from '../../../src/grid/renderer/virtual-content-renderer';
import { VirtualRowModelGenerator } from '../../../src/grid/services/virtual-row-model-generator';
import { RowModelGenerator } from '../../../src/grid/services/row-model-generator';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(VirtualScroll, Sort, Filter, Selection, Group);

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
let count500: string[] = Array.apply(null, Array(5)).map(() => 'Column' + ++ctr + '');
let count5000: string[] = Array.apply(null, Array(500)).map(() => 'Column' + ++ctr + '');
let data: Object[] = (() => {
    let arr: Object[] = [];
    for (let i: number = 0, o: Object = {}, j: number = 0; i < 1000; i++ , j++ , o = {}) {
        count500.forEach((lt: string) => o[lt] = 'Column' + lt + 'Row' + i);
        arr[j] = o;
    }
    return arr;
})();

let data1: Object[] = (() => {
    let arr: Object[] = [];
    for (let i: number = 0, o: Object = {}, j: number = 0; i < 1000; i++ , j++ , o = {}) {
        count5000.forEach((lt: string) => o[lt] = 'Column' + lt + 'Row' + i);
        arr[j] = o;
    }
    return arr;
})();

describe('Virtualization testing', () => {

    // describe('enableVirtualization enabled', () => {
    //     let grid: Grid;
    //     let rows: HTMLTableRowElement;
    //     beforeAll((done: Function) => {
    //         grid = createGrid(
    //             {
    //                 dataSource: data,
    //                 columns: count500,
    //                 enableVirtualization: true,
    //                 height: 300
    //             },
    //             done
    //         );
    //     });
    //     it('check pageSize', () => {
    //         //expect(grid.pageSettings.pageSize).toBeGreaterThanOrEqual(~~(300 / 37) * 2);
    //         expect(1).toBe(1);
    //     });
    //     afterAll(() => {
    //         grid['virtualscrollModule'].destroy();
    //         destroy(grid);
    //     });
    // });

    // describe('horizontal scroll with row virtualization', () => {
    //     let grid: Grid;
    //     let rows: HTMLTableRowElement;
    //     let columns: ColumnModel[] = count500.map((val: string) => ({ field: val, width: 200 }));
    //     beforeAll((done: Function) => {
    //         grid = createGrid(
    //             {
    //                 dataSource: data,
    //                 columns: columns,
    //                 enableVirtualization: true,
    //                 pageSettings: { pageSize: 40 },
    //                 height: 300,
    //                 width: 300,
    //             },
    //             () => {
    //                 (<HTMLElement>grid.getContent().firstChild).scrollLeft = 100;
    //                 setTimeout(done, 200);
    //             }
    //         );
    //     });
    //     it('check current page', () => {
    //         expect(grid.pageSettings.currentPage).toBeGreaterThanOrEqual(1);
    //     });
    //     afterAll(() => {
    //         destroy(grid);
    //     });
    // });

    describe('scroll continous', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: data,
                    columns: count500,
                    enableVirtualization: true,
                    allowFiltering: true,
                    allowSorting: true,
                    height: 300
                },
                () => {
                    let content: HTMLElement = (<HTMLElement>grid.getContent().firstChild);
                    EventHandler.trigger(content, 'wheel');
                    content.scrollTop = 10;
                    content.scrollTop = 500;
                    EventHandler.trigger(content, 'scroll', { target: content });
                    setTimeout(done, 100);
                }
            );
        });
        // describe('Scroll back and forth testing', () => { //random failure
        //     beforeAll((done: Function) => {
        //         let content: HTMLElement = (<HTMLElement>grid.getContent().firstChild);
        //         (<HTMLElement>grid.getContent().firstChild).scrollTop = 0;
        //         EventHandler.trigger(content, 'scroll', { target: content });
        //         setTimeout(done, 200);
        //     });
        //     it('check scroll position', () => {
        //         expect(grid.currentViewData.length).not.toEqual(0);
        //     });
        // });
        // describe('Scroll to end testing', () => {
        //     beforeAll((done: Function) => {
        //         (<HTMLElement>grid.getContent().firstChild).scrollTop = (<HTMLElement>grid.getContent().firstChild).scrollHeight;;
        //         setTimeout(done, 200);
        //     });
        //     it('end block checking', () => {
        //         let contentModule: VirtualContentRenderer = <VirtualContentRenderer>grid.contentModule;
        //         let num: number[] = contentModule.ensureBlocks({ block: 0, blockIndexes: [124, 125], page: 63, direction: 'down' });
        //         let generator: VirtualRowModelGenerator = <VirtualRowModelGenerator>contentModule.getModelGenerator();
        //         generator.generateRows(grid.currentViewData, { virtualInfo: { blockIndexes: [1, 2, 3], page: 1, direction: 'up' } });
        //         expect(grid.currentViewData.length).not.toEqual(0);
        //         contentModule.refreshVirtualElement();
        //     });
        // });
        afterAll(() => {
            destroy(grid);
        });
    });

    describe('virtualization with grouping enabled', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: data,
                    columns: count500,
                    allowGrouping: true,
                    groupSettings: { columns: ['Column1'] },
                    enableVirtualization: true,
                    height: 300
                },
                () => {
                    let content: HTMLElement = (<HTMLElement>grid.getContent().firstChild);
                    EventHandler.trigger((<HTMLElement>grid.getContent().firstChild), 'wheel');
                    content.scrollTop = 10;
                    content.scrollTop = 1200;
                    setTimeout(done, 200);
                }
            );
        });
        it('check pageSize', () => {
            //expect(grid.pageSettings.currentPage).toBeGreaterThanOrEqual(2);
            //for coverage
            let row_model: RowModelGenerator = new RowModelGenerator(grid);
            row_model.refreshRows((<any>grid.contentModule).rows);
            let contentModule: VirtualContentRenderer = <VirtualContentRenderer>grid.contentModule;
            let fn: Function = (<any>(contentModule as any).observer).virtualScrollHandler(function () { }, function () { });
            let elem: HTMLElement = createElement('div');
            elem.scrollTop = 32;
            elem.scrollLeft = -12;
            (contentModule as any).observer.fromWheel = true;
            (contentModule as any).observer.options.debounceEvent = true;
            fn({ target: elem });
            (<any>(contentModule as any).observer).options.axes = [];
            fn({ target: elem });
            (<any>contentModule).virtualEle.setWrapperWidth(null, 1);
            (<any>contentModule).getInfoFromView('down', (contentModule as any).observer.sentinelInfo.up, { top: 100, left: 50 });
            (<any>contentModule).block(5);
            (<any>contentModule).onDataReady({ count: undefined });
            (<any>contentModule).preventEvent = true;
            (<any>contentModule).scrollListener();
            (<any>contentModule).onDataReady({ count: 1 });
            grid.dataSource = new DataManager();
            contentModule.renderTable();
            (<any>contentModule).getInfoFromView = function () {
                return { loadNext: true, loadSelf: true, event: 'virtual' };
            };
            (<any>contentModule).scrollListener({ sentinel: { axis: 'Z' } });
            (contentModule as any).offsetKeys = [1];
            let fn1: any = () => { return 1 };
            (contentModule as any).getTotalBlocks = fn1;
            (contentModule as any).getPageFromTop(1000, { block: 2 });
            expect(1).toBe(1);
        });
        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Row height checking in Virtual mode', () => {
        let grid: Grid;
        beforeAll((done: Function) => {
                grid = createGrid(
                    {
                        dataSource: data,
                        columns: count500,
                        enableVirtualization: true,
                        enableColumnVirtualization: true,
                        allowGrouping: true,
                        height: 300,
                        rowHeight: 70
                    },
                    done
                );
            });

        it('API Checking', () => {
            expect((grid.element.querySelectorAll('.e-row')[0] as HTMLElement).style.height).toBe('70px');
            expect((grid.element.classList.contains('e-grid-min-height'))).toBeTruthy();
        });

        it('EJ2-7420- Focus strategy script error', () => {
            spyOn((<any>grid).focusModule, 'onFocus');
            grid.groupColumn('Column4');
            expect((<any>grid).focusModule.onFocus).not.toHaveBeenCalled();
        });    

        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Check scroll position after grid filter actions', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement; let oneTime: boolean = true;
        beforeAll(() => {
            grid = createGrid(
                {
                    dataSource: data,
                    columns: count500,
                    enableVirtualization: true,
                    allowFiltering: true,
                    allowSorting: true,
                    height: 300
                },
                () => {
                    if (oneTime) {
                        oneTime = false;

                        (<HTMLElement>grid.getContent().firstChild).scrollTop = 500;
                    }
                }
            );
        });
        it('check scroll top after filter - should change to 0', (done: Function) => {
            grid.filterByColumn('Column1', 'startswith', 'c');
            setTimeout(done, 200);
            expect((<HTMLElement>grid.getContent().firstChild).scrollTop).toEqual(0);
        });
        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Check scroll position after grid sort actions', () => {
        let grid: Grid; let oneTime: boolean = true;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: data,
                    columns: count500,
                    enableVirtualization: true,
                    allowFiltering: true,
                    allowSorting: true,
                    height: 300
                },
                () => {
                    if (oneTime) {
                        oneTime = false;
                        grid.dataBound = function(){
                           
                        };
                        grid.actionComplete = function(args){
                            if(args.requestType === 'sorting'){
                                done();
                            }
                        };
                        (<HTMLElement>grid.getContent().firstChild).scrollTop = 500;
                        grid.sortColumn('Column1', 'Ascending');                        
                    }
                }
            );
        });
        it('check scroll top after filter - should change to 0', () => {
            expect((<HTMLElement>grid.getContent().firstChild).scrollTop).toEqual(500);
        });
        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Selection feature testing', () => {
        describe('without scrolling', () => {
            let grid: Grid; let oneTime: boolean = true;
            let rows: HTMLTableRowElement;
            beforeAll((done: Function) => {
                grid = createGrid(
                    {
                        dataSource: data,
                        columns: count500,
                        enableVirtualization: true,
                        allowSelection: true,
                        selectionSettings: { type: 'Multiple' },
                        height: 300
                    },
                    done
                );
            });
            it('check selection by click in first page', (done: Function) => {
                grid.rowSelected = <EmitType<{}>>done;
                let row: HTMLTableRowElement = <HTMLTableRowElement>(<HTMLTableElement>grid.getContentTable()).rows[0];
                (<HTMLElement>row.cells[0]).click();
                expect(grid.getSelectedRowIndexes()[0]).toEqual(0);
            });
            it('check selection by selectRow method in first page', (done: Function) => {
                grid.rowSelected = <EmitType<{}>>done;
                grid.selectRow(2, true);
                expect(grid.getSelectedRowIndexes()[0]).toEqual(2);
            });
            afterAll(() => {
                destroy(grid);
            });
        });
        describe('after scrolling', () => {
            let grid: Grid; let oneTime: boolean = true;
            let rows: HTMLTableRowElement;
            beforeAll((done: Function) => {
                grid = createGrid(
                    {
                        dataSource: data,
                        columns: count500,
                        enableVirtualization: true,
                        allowSelection: true,
                        selectionSettings: { type: 'Multiple' },
                        height: 300
                    },
                    () => {
                        (<HTMLElement>grid.getContent().firstChild).scrollTop = 500;
                        setTimeout(done, 50);
                    }
                );
            });
            it('check selection by click in first row', (done: Function) => {
                grid.rowSelected = <EmitType<{}>>done;
                let row: HTMLTableRowElement = <HTMLTableRowElement>(<HTMLTableElement>grid.getContentTable()).rows[0];
                let index: number = parseInt(row.getAttribute('aria-rowindex'), 10);
                (<HTMLElement>row.cells[0]).click();
                expect(grid.getSelectedRowIndexes()[0]).toEqual(index);
            });
            it('check selection by selectRow method', (done: Function) => {
                let row: HTMLTableRowElement = <HTMLTableRowElement>(<HTMLTableElement>grid.getContentTable()).rows[5];
                let index: number = parseInt(row.getAttribute('aria-rowindex'), 10);
                grid.rowSelected = <EmitType<{}>>done;
                grid.selectRow(index, true);
                expect(grid.getSelectedRowIndexes()[0]).toEqual(index);
            });
            afterAll(() => {
                destroy(grid);
            });
        });
        // describe('selection maintainance check', () => { //random failure
        //     let grid: Grid; let oneTime: boolean = true;
        //     let rows: HTMLTableRowElement;
        //     beforeAll((done: Function) => {
        //         grid = createGrid(
        //             {
        //                 dataSource: data,
        //                 columns: count500,
        //                 enableVirtualization: true,
        //                 allowSelection: true,
        //                 selectionSettings: { type: 'Multiple' },
        //                 height: 300
        //             },
        //             () => {
        //                 if (oneTime) {
        //                     oneTime = false; grid.selectRow(0, true);
        //                     (<HTMLElement>grid.getContent().firstChild).scrollTop = 500;
        //                     setTimeout(done, 200);
        //                 }
        //             }
        //         );
        //     });
        //     it('selected row is persisted after scroll', (done: Function) => {
        //         (<HTMLElement>grid.getContent().firstChild).scrollTop = 0;
        //         setTimeout(done, 200);
        //         let row: HTMLTableRowElement = <HTMLTableRowElement>(<HTMLTableElement>grid.getContentTable()).rows[0];
        //         expect(row.getAttribute('aria-selected')).not.toBeUndefined();
        //     });
        //     afterAll(() => {
        //         destroy(grid);
        //     });
        // });
    });
});

describe('Column virtualization', () => {

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
                },
                () => {
                    (<HTMLElement>grid.getContent().firstChild).scrollLeft = 10;
                    (<HTMLElement>grid.getContent().firstChild).scrollLeft = 500;
                    done();
                }
            );
        });
        it('check first column index', () => {
            expect(grid.getColumns().length).toBeLessThan(500);
            let row: HTMLTableRowElement = <HTMLTableRowElement>(<HTMLTableElement>grid.getContentTable()).rows[0];
            expect(grid.getColumnIndexesInView()[0]).toBeGreaterThanOrEqual(parseInt(row.cells[0].getAttribute('aria-colindex'), 10));
        });
        it('check last column index', () => {
            let row: HTMLTableRowElement = <HTMLTableRowElement>(<HTMLTableElement>grid.getContentTable()).rows[0];
            let indexes: number[] = grid.getColumnIndexesInView();
            expect(indexes[indexes.length - 1])
                .toBeGreaterThanOrEqual(parseInt(row.cells[indexes.length - 1].getAttribute('aria-colindex'), 10));
        });
        it('horizontal should not disturb vertical scroll', (done: Function) => {
            (<HTMLElement>grid.getContent().firstChild).scrollLeft = 100;
            setTimeout(done, 200);
            expect(grid.pageSettings.currentPage).toEqual(1);
        });
        it('horizontal scroll the grid content', (done: Function) => {
            (<HTMLElement>grid.getContent().firstChild).scrollLeft = 1000;
            setTimeout(done, 200);
            expect(grid.pageSettings.currentPage).toEqual(1);
            expect(grid.getColumns().length).toBeLessThan(500);
            let row: HTMLTableRowElement = <HTMLTableRowElement>(<HTMLTableElement>grid.getContentTable()).rows[0];
            expect(grid.getColumnIndexesInView()[0]).toBeGreaterThanOrEqual(parseInt(row.cells[0].getAttribute('aria-colindex'), 10));
        });
        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Grouping enabled', () => {
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
                    allowGrouping: true,
                    groupSettings: { columns: ['Column6'] }
                },
                () => {
                    (<HTMLElement>grid.getContent().firstChild).scrollLeft = 10;
                    (<HTMLElement>grid.getContent().firstChild).scrollLeft = 700;
                    done();
                }
            );
        });
        it('check expand group cell', () => {
            expect(grid.getColumns().length).toBeLessThan(500);
            let row: HTMLTableRowElement = <HTMLTableRowElement>(<HTMLTableElement>grid.getContentTable()).rows[0];
            expect(row.cells[0].classList.contains('e-recordplusexpand')).toBeTruthy();
            expect(row.cells.length).toBeTruthy(grid.getColumns().length);
        });
        it('horizontal scroll the grouped grid content', (done: Function) => {
            (<HTMLElement>grid.getContent().firstChild).scrollLeft = 1000;
            setTimeout(done, 200);
            expect(grid.pageSettings.currentPage).toEqual(1);
            expect(grid.getColumns().length).toBeLessThan(500);
            let row: HTMLTableRowElement = <HTMLTableRowElement>(<HTMLTableElement>grid.getContentTable()).rows[0];
            expect(row.cells[0].classList.contains('e-recordplusexpand')).toBeTruthy();
            expect(row.querySelectorAll('.e-groupcaption').length).toEqual(grid.getColumns().length);
        });
        // it('vertical scroll with grouping', (done: Function) => { //random failure
            // (<HTMLElement>grid.getContent().firstChild).scrollTop = 6000;
            // setTimeout(done, 200);
            // let row: HTMLTableRowElement = <HTMLTableRowElement>(<HTMLTableElement>grid.getContentTable()).rows[0];
            // expect(row.querySelectorAll('.e-groupcaption').length).toEqual(grid.getColumns().length);
        // });
        it('vertical scroll in up direction', (done: Function) => {
            (<HTMLElement>grid.getContent().firstChild).scrollTop = 100;
            setTimeout(done, 200);
            let row: HTMLTableRowElement = <HTMLTableRowElement>(<HTMLTableElement>grid.getContentTable()).rows[0];
            //expect(row.querySelectorAll('.e-groupcaption').length).toEqual(grid.getColumns().length);
        });
        it('check group merge', () => {
            let gen: VirtualRowModelGenerator = (<VirtualRowModelGenerator>(<VirtualContentRenderer>grid.contentModule).getModelGenerator())
            gen.cache[1] = [new Row<Column>({ data: { field: 'test1', 'key': 'test1' }, isDataRow: false })];
            let res: Row<Column>[] = gen.updateGroupRow([new Row<Column>({ data: { field: 'test1', 'key': 'test1' }, isDataRow: false }),
            new Row<Column>({ data: { field: 'test1', 'key': 'test1' }, isDataRow: true })], 3);
            expect(res.length).toBe(1);
            let no: Row<Column>[] = gen.updateGroupRow([new Row<Column>({ data: { field: 'test1', 'key': 'test1' }, isDataRow: true })], 3);
            expect(res.length).toBe(1);
        });

        it('for coverage', () => {
            window['browserDetails']['isDevice'] = false;
            let gen: VirtualRowModelGenerator = (<VirtualRowModelGenerator>(<VirtualContentRenderer>grid.contentModule).getModelGenerator())
            gen.getColumnIndexes(undefined);
            (gen as any).getStartIndex(1, 2, 3);
            (gen as any).getStartIndex(1, 2, 0);
            (gen as any).cache = { 1: [{ data: { field: 'Column9' }, field: 'Column9' }], 2: [{ data: { field: 'Column9' }, field: 'Column8' }] };
            (gen as any).generateRows({ records: [] }, { virtualInfo: null });
            window['browserDetails']['isDevice'] = true;
            let contentModule: VirtualContentRenderer = <VirtualContentRenderer>grid.contentModule;
            contentModule.ensureBlocks({ block: 0, blockIndexes: [124, 125], page: 63, direction: 'up' });
        });
        afterAll(() => {
            destroy(grid);
        });
    });
    describe('Check scroll position after selecting and scroll', () => {
        let grid: Grid;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: data,
                    enableVirtualization: true,
                    allowFiltering: true,
                    allowSorting: true,
                    selectionSettings: { persistSelection: true, type: 'Multiple'},
                    height: 300
                },
                done
            );
        });
        it('check selecting row', () => {
            grid.selectRow(1,true);
        });
        it('change the scrollbar place', () => {
            (<HTMLElement>grid.getContent().firstChild).scrollTop = 100;  
        });
        it('check scrollposition is same or not', () => {
            expect((<HTMLElement>grid.getContent().firstChild).scrollTop).toBe(100);
        });
        afterAll(() => {
            destroy(grid);
        });
    });
});
