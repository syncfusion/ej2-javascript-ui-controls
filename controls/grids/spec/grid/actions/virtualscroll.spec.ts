/**
 * virtual scrolling spec
 */
import { EmitType, EventHandler, select } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { createElement } from '@syncfusion/ej2-base';
import { Grid, InfiniteScrollSettings } from '../../../src/grid/base/grid';
import { Sort } from '../../../src/grid/actions/sort';
import { Group } from '../../../src/grid/actions/group';
import { Selection } from '../../../src/grid/actions/selection';
import { Edit } from '../../../src/grid/actions/edit';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Filter } from '../../../src/grid/actions/filter';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import { Aggregate } from '../../../src/grid/actions/aggregate';
import { GridModel } from '../../../src/grid/base/grid-model';
import { Column } from '../../../src/grid/models/column';
import { Row } from '../../../src/grid/models/row';
import { VirtualContentRenderer } from '../../../src/grid/renderer/virtual-content-renderer';
import { VirtualRowModelGenerator } from '../../../src/grid/services/virtual-row-model-generator';
import { RowModelGenerator } from '../../../src/grid/services/row-model-generator';
import '../../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import { largeDataset, employeeData, filterData } from '../base/datasource.spec';
import * as events from '../../../src/grid/base/constant';
import { EditEventArgs, NotifyArgs } from '../../../src';

Grid.Inject(VirtualScroll, Sort, Filter, Selection, Group, Aggregate, Edit, Toolbar);

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

let virtualData: Object[] = (() => {
    let arr: Object[] = [];
    for (let i: number = 0, o: Object = {}, j: number = 0; i < 1000; i++ , j++ , o = {}) {
        count500.forEach((lt: string) => o[lt] = i);
        arr[j] = o;
    }
    return arr;
})();




let largeDatasetColumns: Function = (count: number): Object[] => {
    let columns: any = [];
    for (let i: number = 0; i < count; i++) {
        columns.push({ field: 'FIELD' + i });
        columns[i].width = 120;
        columns[i].isPrimaryKey = columns[i].field === 'FIELD1';
    }
    return columns;
};

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
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
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
            grid = null;
        });
    });

    describe('virtualization with grouping enabled', () => {
        let grid: Grid;
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
            (contentModule as any).getVirtualRowIndex(1);
            (contentModule as any).editedRowIndex = 1;
            (contentModule as any).getEditedRowObject();
            (contentModule as any).getMovableVirtualRowByIndex(1);
            (contentModule as any).getFrozenRightVirtualRowByIndex(1);
            (contentModule as any).isSelectionScroll = true;
            (contentModule as any).selectRowIndex = 1;
            (contentModule as any).ensureSelectedRowPosition();
            expect(1).toBe(1);
        });
        afterAll(() => {
            destroy(grid);
            grid = null;
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
            grid = null;
        });
    });

    describe('checking in ColumnVirtualization', () => {
        let grid: Grid;
        beforeAll((done: Function) => {
                grid = createGrid(
                    {
                        dataSource: data,
                        columns: count500,
                        enableVirtualization: true,
                        frozenColumns: 2,
                        enableColumnVirtualization: true,
                        allowGrouping: true,
                        allowResizing: true,
                        height: 300,
                        rowHeight: 70
                    },
                    done
                );
            });

        it('frozenColumns Checking', () => {
            expect(grid.frozenColumns).toBe(2);
        });

        it('resetStickyLeftPos ', () => {
            let contentModule: VirtualContentRenderer = <VirtualContentRenderer>grid.contentModule;
            (contentModule as any).resetStickyLeftPos(100);
        });    

        afterAll(() => {
            destroy(grid);
            grid = null;
        });
    });

    describe('Check scroll position after grid filter actions', () => {
        let grid: Grid;
        let oneTime: boolean = true;
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
            grid = oneTime = null;
        });
    });

    describe('Check scroll position after grid sort actions', () => {
        let grid: Grid; let oneTime: boolean = true;
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
            grid = oneTime = null;
        });
    });

    describe('Selection feature testing', () => {
        describe('without scrolling', () => {
            let grid: Grid;
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
                grid = null;
            });
        });
        describe('after scrolling', () => {
            let grid: Grid;
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
                let index: number = parseInt(row.getAttribute('aria-rowindex'), 10) - 1;
                (<HTMLElement>row.cells[0]).click();
                expect(grid.getSelectedRowIndexes()[0]).toEqual(index);
            });
            it('check selection by selectRow method', (done: Function) => {
                let row: HTMLTableRowElement = <HTMLTableRowElement>(<HTMLTableElement>grid.getContentTable()).rows[5];
                let index: number = parseInt(row.getAttribute('aria-rowindex'), 10) - 1;
                grid.rowSelected = <EmitType<{}>>done;
                grid.selectRow(index, true);
                expect(grid.getSelectedRowIndexes()[0]).toEqual(index);
            });
            afterAll(() => {
                destroy(grid);
                grid = null;
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
            expect(grid.getColumnIndexesInView()[0]).toBeGreaterThanOrEqual(parseInt(row.cells[0].getAttribute('aria-colindex'), 10) - 1);
        });
        it('check last column index', () => {
            let row: HTMLTableRowElement = <HTMLTableRowElement>(<HTMLTableElement>grid.getContentTable()).rows[0];
            let indexes: number[] = grid.getColumnIndexesInView();
            expect(indexes[indexes.length - 1])
                .toBeGreaterThanOrEqual(parseInt(row.cells[indexes.length - 1].getAttribute('aria-colindex'), 10) - 1);
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
            expect(grid.getColumnIndexesInView()[0]).toBeGreaterThanOrEqual(parseInt(row.cells[0].getAttribute('aria-colindex'), 10) - 1);
        });
        afterAll(() => {
            destroy(grid);
            grid = null;
        });
    });

    describe('Grouping enabled', () => {
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
            window['browserDetails']['isDevice'] = false;
            destroy(grid);
            grid = null;
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
        it('memory leak', () => {     
            profile.sample();
            let average: any = inMB(profile.averageChange)
            //Check average change in memory samples to not be over 10MB
            expect(average).toBeLessThan(10);
            let memory: any = inMB(getMemoryProfile())
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });   
        // it('check scrollposition is same or not', () => {
        //     expect((<HTMLElement>grid.getContent().firstChild).scrollTop).toBe(100);
        // });
        afterAll(() => {
            destroy(grid);
            grid = null;
        });
    });
    describe('Ensure the virtual table after changing the datasource dynamically', () => {
        let grid: Grid;
        let button: HTMLElement;
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
        it('Ensured the virtual table count', (done: Function) => {
            let dataBound = () => {
                expect(grid.element.querySelectorAll('.e-virtualtable').length).toBe(1);
                expect(grid.element.querySelectorAll('.e-virtualtrack').length).toBe(1);
                grid.dataBound = null;
                done();
            }
            grid.dataBound = dataBound;
            button = createElement('button', { id: 'btn' });
            button.textContent = "Click";
            document.body.appendChild(button);
            document.getElementById('btn').addEventListener('click', function(e){
                grid.columns = [];
                grid.pageSettings.currentPage = 1;
                grid.dataSource = data1;
            });
            button.click();
        });
        afterAll(() => {
            destroy(grid);
            grid = button = null;
        });
    });

    describe('Ensure the virtual table while rendering the Grid', () => {
        let grid: Grid;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: data,
                    enableColumnVirtualization: true,
                    allowFiltering: true,
                    width:600,
                    allowSorting: true,                    
                    height: 300
                },
                done
            );
        });
        it('Ensured the virtual table while rendering', (done: Function) => {
            let dataBound = () => {
                expect(grid.element.querySelectorAll('.e-virtualtable').length).toBeTruthy(1);                
                grid.dataBound = null;
                done();
            }
            grid.dataSource = (<Object[]>grid.dataSource).splice(0,600);
            grid.dataBound = dataBound;           
        });
        afterAll(() => {
            destroy(grid);
            grid = null;
        });
    });

    // describe('Grouping enabled', () => {
    //     let grid: Grid;
    //     beforeAll((done: Function) => {
    //         grid = createGrid(
    //             {
    //                 dataSource: data1,
    //                 columns: count5000,
    //                 enableVirtualization: true,                    
    //                 height: 300,                    
    //                 allowGrouping: true,
    //                 groupSettings: { columns: ['Column6'] }
    //             },
    //             () => {
    //                 (<HTMLElement>grid.getContent().firstChild).scrollTop = 90;                    
    //                 done();
    //             }
    //         );
    //     });
    //     it('Check the scrollTop value', () => {
    //         let content: string = 'content';
    //         expect(grid.scrollModule[content].scrollTop).toBe(90);           
    //     });
    //     afterAll(() => {
    //         destroy(grid);
    //         grid = null;
    //     });
    // });

    describe('EJ2-37789 - Summary has an empty when collapse the record', () => {
        let gObj: Grid;
        beforeAll((done: Function) => {
            gObj = createGrid(
                {
                    dataSource: virtualData,
                    columns: count500,
                    enableVirtualization: true,
                    allowGrouping: true,
                    height: 300,
                    aggregates: [{
                        columns: [{
                            type: 'Sum',
                            field: 'Column2',
                            footerTemplate: 'Total: ${Sum}'
                        }]
                    }]
                }, done);
        });

        it('grouping', function (done: Function) {
            let actionC = function (args: any) {
                if (args.requestType === 'grouping') {
                    done();
                }
            }
            gObj.actionComplete = actionC;
            gObj.groupModule.groupColumn('Column3');
        });
        it('collapse first row', (done: Function) => {
            gObj.groupModule.expandCollapseRows(gObj.getContent().querySelector('.e-gdiagonaldown'));
            setTimeout(done, 200);
        });
        it('check aggregare value after the collapse action', (done: Function) => {
            let text: string = (gObj as any).footerElement.querySelector('.e-templatecell').textContent;
            let value: number = parseInt(text.split(' ')[1], 10);
            expect(parseInt(gObj.getRows()[0].getAttribute('aria-rowindex'), 10) - 1).toBe(1);
            expect(text).not.toBe('Total:  ');
            expect(text).not.toBe('');
            expect(text).not.toBe(' ');
            expect(value).toBe(499500);
            setTimeout(done, 200);
        });
        afterAll(() => {
            destroy(gObj);
            gObj = null;
        });
    });

    describe('Column virtualization with inline editing testing', () => {
        let gObj: Grid;
        let columns: Column[] = largeDatasetColumns(30);
        beforeAll((done: Function) => {
            gObj = createGrid(
                {
                    dataSource: largeDataset,
                    columns: columns,
                    enableVirtualization: true,
                    enableColumnVirtualization: true,
                    editSettings: {
                        allowEditing: true,
                        allowAdding: true,
                        allowDeleting: true
                    },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    height: 300,
                    width: 400
                }, done);
        });

        it('added record', (done: Function) => {
            let actionComplete = (args: EditEventArgs) => {
                expect(args.form.getElementsByTagName('td').length).toBe(gObj.getColumns().length);
                (select('#' + gObj.element.id + 'FIELD1', gObj.element)  as any).value = 11013456;
                gObj.actionComplete = null;
                done();
            };
            gObj.actionComplete = actionComplete;
            gObj.addRecord();
        });

        it('Check editforms count after horizontal scroll', (done: Function) => {
            let dataBound = (args: EditEventArgs) => {
                expect(gObj.element.querySelector('.e-gridform').getElementsByTagName('td').length).toBe(gObj.getColumns().length);
                gObj.dataBound = null;
                done();
            };
            gObj.dataBound = dataBound;
            (gObj.getContent().firstChild as Element).scrollLeft = 3000;
        });

        it('Save added record', (done: Function) => {
            let columns: Column[] = gObj.getColumns();
            let actionComplete = (args: EditEventArgs) => {
                expect(gObj.getCellFromIndex(0, 0).innerHTML).toBe('123');
                expect(gObj.getRowsObject()[0].data[columns[0].field]).toBe(123);
                expect(gObj.getRowsObject()[0].data['FIELD1']).toBe(11013456);
                gObj.actionComplete = null;
                done();
            };
            gObj.actionComplete = actionComplete;
            (select('#' + gObj.element.id + columns[0].field, gObj.element)  as any).value = 123;
            gObj.endEdit();
        });

        it('edit record', (done: Function) => {
            let actionComplete = (args: EditEventArgs) => {
                (select('#' + gObj.element.id + gObj.getColumns()[3].field, gObj.element)  as any).value = 456789;
                gObj.actionComplete = null;
                done();
            };
            gObj.actionComplete = actionComplete;
            gObj.startEdit();
        });

        it('Save edited record', (done: Function) => {
            let actionComplete = (args: EditEventArgs) => {
                expect(gObj.getCellFromIndex(0, 3).innerHTML).toBe('456789');
                expect(gObj.getRowsObject()[0].data[gObj.getColumns()[3].field]).toBe(456789);
                gObj.actionComplete = null;
                done();
            };
            gObj.actionComplete = actionComplete;
            gObj.endEdit();
        });

        afterAll(() => {
            destroy(gObj);
            gObj = null;
        });
    });
    
    describe('EJ2-49631 - Empty virtualization grid throw script when canceling the add action', () => {
        let gObj: Grid;
        let columns: Column[] = largeDatasetColumns(30);
        beforeAll((done: Function) => {
            gObj = createGrid(
                {
                    dataSource: [],
                    columns: columns,
                    enableVirtualization: true,
                    enableColumnVirtualization: true,
                    editSettings: {
                        allowEditing: true,
                        allowAdding: true,
                        allowDeleting: true
                    },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    height: 300,
                    width: 400
                }, done);
        });

        it('added record', (done: Function) => {
            let actionComplete = (args: EditEventArgs) => {
                gObj.actionComplete = null;
                done();
            };
            gObj.actionComplete = actionComplete;
            gObj.addRecord();
        });

        it('get row by index', (done: Function) => {
            let actionComplete = (args: EditEventArgs) => {
                gObj.actionComplete = null;
                done();
            };
            gObj.actionComplete = actionComplete;
            gObj.closeEdit();
        });

        afterAll(() => {
            destroy(gObj);
            gObj = null;
        });
    });

    describe("EJ2-49680 - Editing validation doesn't properly work with the column virtualization feature", () => {
        let gObj: Grid;
        let columns: Column[] = largeDatasetColumns(30);
        columns[columns.length - 1].validationRules = { required: true };
        beforeAll((done: Function) => {
            gObj = createGrid(
                {
                    dataSource: largeDataset,
                    columns: columns,
                    enableVirtualization: true,
                    enableColumnVirtualization: true,
                    editSettings: {
                        allowEditing: true,
                        allowAdding: true,
                        allowDeleting: true
                    },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    height: 300,
                    width: 400
                }, done);
        });

        it('check validation msg width', (done: Function) => {
            let actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    gObj.element.focus();
                    (<any>gObj.toolbarModule).toolbarClickHandler({ item: { id: gObj.element.id + '_update' } });
                    gObj.actionComplete = undefined;
                    done();
                }
            };
            gObj.actionComplete = actionComplete;
            (<any>gObj.toolbarModule).toolbarClickHandler({ item: { id: gObj.element.id + '_add' } });
        });

        it('check edit form', () => {
            expect(gObj.getContent().querySelector('.e-addedrow')).not.toBeNull();
        });

        afterAll(() => {
            destroy(gObj);
            gObj = null;
        });
    });

    describe("column virtualization with inline editing validation check", () => {
        let gObj: Grid;
        let columns: Column[] = largeDatasetColumns(30);
        columns[0].validationRules = { required: true };
        columns[columns.length - 1].validationRules = { required: true };
        beforeAll((done: Function) => {
            gObj = createGrid(
                {
                    dataSource: largeDataset,
                    columns: columns,
                    enableVirtualization: true,
                    enableColumnVirtualization: true,
                    editSettings: {
                        allowEditing: true,
                        allowAdding: true,
                        allowDeleting: true
                    },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    height: 300,
                    width: 400
                }, done);
        });

        it('add record to check horizontal scroll action', (done: Function) => {
            gObj.dataBound = null;
            let actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gObj.editModule.virtualFormObj.isDestroyed).toBeFalsy();
                    expect(gObj.editModule.virtualFormObj.element.getElementsByClassName('e-field').length).toBe(gObj.columns.length);
                    gObj.element.focus();
                    (<any>gObj.toolbarModule).toolbarClickHandler({ item: { id: gObj.element.id + '_update' } });
                    expect(gObj.editModule.virtualFormObj.element.querySelector('.e-griderror:not([style*="display: none"])')).toBeNull();
                    gObj.actionComplete = undefined;
                    done();
                }
            };
            gObj.actionComplete = actionComplete;
            (<any>gObj.toolbarModule).toolbarClickHandler({ item: { id: gObj.element.id + '_add' } });
        });

        it('check column virtualization horizontal scroll move', (done: Function) => {
            expect(gObj.element.querySelectorAll('.e-griderror:not([style*="display: none"])').length).toBe(1);
            (gObj.element.querySelector('#' + gObj.element.id + columns[0].field) as HTMLInputElement).value = '567843212345674';
            let actionComplete = (args: NotifyArgs) => {
                if (args.requestType === 'save') {
                    expect(gObj.editModule.virtualFormObj.isDestroyed).toBeTruthy();
                    expect(gObj.getContent().querySelector('.e-addedrow')).toBeNull();
                    gObj.actionComplete = null;
                    done();
                }
            };
            let dataBound = () => {
                expect(gObj.element.querySelectorAll('.e-griderror:not([style*="display: none"])').length).toBe(1);
                expect(gObj.editModule.virtualFormObj.element.querySelectorAll('.e-griderror:not([style*="display: none"])').length).toBe(1);
                expect(gObj.getContent().firstElementChild.scrollLeft).not.toBe(0);
                (gObj.element.querySelector('#' + gObj.element.id + columns[columns.length - 1].field) as HTMLInputElement).value = 'updated';
                gObj.actionComplete = actionComplete;
                gObj.dataBound = null;
                (<any>gObj.toolbarModule).toolbarClickHandler({ item: { id: gObj.element.id + '_update' } });
            };
            gObj.dataBound = dataBound;
            (<any>gObj.toolbarModule).toolbarClickHandler({ item: { id: gObj.element.id + '_update' } });
        });

        it('add record to check vertical scroll action', (done: Function) => {
            let dataBound = () => {
                gObj.dataBound = null;
                done();
            };
            let actionComplete = (args: NotifyArgs) => {
                if (args.requestType === 'add') {
                    gObj.dataBound = dataBound;
                    gObj.actionComplete = null;
                    gObj.getContent().firstElementChild.scrollTop = 5000;
                }
            };
            gObj.actionComplete = actionComplete;
            (<any>gObj.toolbarModule).toolbarClickHandler({ item: { id: gObj.element.id + '_add' } });
        });

        it('Check auto vertical scroll action', (done: Function) => {
            let dataBound = () => {
                expect(gObj.getContent().firstElementChild.scrollTop).toBe(0);
                expect(gObj.editModule.virtualFormObj.element.querySelector('.e-griderror:not([style*="display: none"])')).toBeNull();
                gObj.editModule.editFormValidate();
                expect(gObj.editModule.formObj.element.querySelectorAll('.e-griderror:not([style*="display: none"])').length).toBe(1);
                gObj.dataBound = null;
                done();
            };
            gObj.dataBound = dataBound;
            (<any>gObj.toolbarModule).toolbarClickHandler({ item: { id: gObj.element.id + '_update' } });
        });

        afterAll(() => {
            destroy(gObj);
            gObj = null;
        });
    });

    describe("Row virtualization with inline editing validation check", () => {
        let gObj: Grid;
        let columns: Column[] = largeDatasetColumns(30);
        columns[0].validationRules = { required: true };
        columns[columns.length - 1].validationRules = { required: true };
        beforeAll((done: Function) => {
            gObj = createGrid(
                {
                    dataSource: largeDataset,
                    columns: columns,
                    enableVirtualization: true,
                    enableColumnVirtualization: false,
                    editSettings: {
                        allowEditing: true,
                        allowAdding: true,
                        allowDeleting: true
                    },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    height: 300,
                    width: 400
                }, done);
        });

        it('check row virtualization horizontal scroll move', (done: Function) => {
            gObj.dataBound = null;
            let actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    gObj.element.focus();
                    expect(gObj.editModule.virtualFormObj.element.getElementsByClassName('e-field').length).toBe(gObj.columns.length);
                    (gObj.element.querySelector('#' + gObj.element.id + columns[0].field) as HTMLInputElement).value = '567843212345674';
                    (<any>gObj.toolbarModule).toolbarClickHandler({ item: { id: gObj.element.id + '_update' } });
                    (gObj.element.querySelector('#' + gObj.element.id + columns[columns.length - 1].field) as HTMLInputElement).value = 'updated';
                    (<any>gObj.toolbarModule).toolbarClickHandler({ item: { id: gObj.element.id + '_update' } });
                }
                if (args.requestType === 'save') {
                    expect(gObj.getContent().querySelector('.e-addedrow')).toBeNull();
                    gObj.actionComplete = null;
                    done();
                }
            };
            gObj.actionComplete = actionComplete;
            (<any>gObj.toolbarModule).toolbarClickHandler({ item: { id: gObj.element.id + '_add' } });
        });

        afterAll(() => {
            destroy(gObj);
            gObj = null;
        });
    });

    // describe("Inline editing validation check in Frozen with column virtualization", () => {
    //     let gObj: Grid;
    //     let columns: Column[] = largeDatasetColumns(30);
    //     columns[columns.length - 1].validationRules = { required: true };
    //     beforeAll((done: Function) => {
    //         gObj = createGrid(
    //             {
    //                 dataSource: largeDataset,
    //                 columns: columns,
    //                 enableVirtualization: true,
    //                 enableColumnVirtualization: true,
    //                 frozenColumns: 2,
    //                 editSettings: {
    //                     allowEditing: true,
    //                     allowAdding: true,
    //                     allowDeleting: true
    //                 },
    //                 toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
    //                 height: 300
    //             }, done);
    //     });

    //     it('add record to check horizontal scroll action', (done: Function) => {
    //         gObj.dataBound = null;
    //         let dataBound = () => {
    //             expect(gObj.editModule.formObj.element.querySelectorAll('.e-griderror:not([style*="display: none"])').length).toBe(0);
    //             expect(gObj.editModule.mFormObj.element.querySelectorAll('.e-griderror:not([style*="display: none"])').length).toBe(1);
    //             expect(gObj.editModule.virtualFormObj.element.querySelectorAll('.e-griderror:not([style*="display: none"])').length).toBe(1);
    //             // expect(gObj.getMovableVirtualContent().scrollLeft).not.toBe(0);
    //             (gObj.element.querySelector('#' + gObj.element.id + columns[columns.length - 1].field) as HTMLInputElement).value = '567843212345674';
    //             gObj.dataBound = null;
    //             done();
    //         };
    //         let actionComplete = (args?: any): void => {
    //             if (args.requestType === 'add') {
    //                 expect(gObj.editModule.formObj.element.getElementsByClassName('e-field').length).toBe(gObj.getFrozenColumns());
    //                 expect(gObj.editModule.mFormObj.element.getElementsByClassName('e-field').length).toBe(gObj.getColumns().length - gObj.getFrozenColumns());
    //                 expect(gObj.editModule.virtualFormObj.element.getElementsByClassName('e-field').length).toBe(gObj.columns.length);
    //                 gObj.element.focus();
    //                 (gObj.element.querySelector('#' + gObj.element.id + columns[0].field) as HTMLInputElement).value = '567843212345674';
    //                 gObj.dataBound = dataBound;
    //                 gObj.actionComplete = null;
    //                 (<any>gObj.toolbarModule).toolbarClickHandler({ item: { id: gObj.element.id + '_update' } });
    //             }
    //         };
    //         gObj.actionComplete = actionComplete;
    //         (<any>gObj.toolbarModule).toolbarClickHandler({ item: { id: gObj.element.id + '_add' } });
    //     });

    //     afterAll(() => {
    //         destroy(gObj);
    //         gObj = null;
    //     });
    // });
    describe("EJ2-53627 -> Grid column virtualization does not support dynamic column changes", () => {
        let gObj: Grid;
        beforeAll((done: Function) => {
            gObj = createGrid(
                {
                    dataSource: employeeData,
                    columns: [
                        { field: 'EmployeeID', width: 120 },
                        { field: 'FirstName', width: 120 },
                        { field: 'Title', width: 120 },
                        { field: 'TitleOfCourtesy', width: 120 },
                        { field: 'Address', width: 120 },
                        { field: 'City', width: 120 },
                        { field: 'Region', width: 120 },
                        { field: 'PostalCode', width: 120 },
                        { field: 'Country', width: 120 },
                        { field: 'HomePhone', width: 120 },
                        { field: 'Extension', width: 120 }
                    ],
                    enableVirtualization: true,
                    enableColumnVirtualization: true,
                    height: 300
                }, done);
        });

        it('Check the column visibility', (done: Function) => {
            let dataBound = () => {
                expect((gObj as any).columnModel[(gObj as any).columnModel.length - 1].visible).toBe((gObj as any).columnModel[3].visible);
                expect((gObj as any).columnModel[(gObj as any).columnModel.length - 1].visible).toBe(false);
                // expect(document.getElementsByClassName('e-headercell')[0].classList.contains('e-hide')).toBe(true);
                gObj.dataBound = null;
                done();
            };
            gObj.dataBound = dataBound;
            gObj.columns = [
                { field: 'EmployeeID', width: 120, visible: false },
                { field: 'FirstName', width: 120 },
                { field: 'Title', width: 120 },
                { field: 'TitleOfCourtesy', width: 120, visible: false },
                { field: 'Address', width: 120 },
                { field: 'City', width: 120 },
                { field: 'Region', width: 120 },
                { field: 'PostalCode', width: 120 },
                { field: 'Country', width: 120 },
                { field: 'HomePhone', width: 120 },
                { field: 'Extension', width: 120, visible: false }
            ];
        });

        afterAll(() => {
            destroy(gObj);
            gObj = null;
        });
    });

    describe('EJ2-828707- Editing not working properly when virtual scroll is enabled and the primary key is a complex data => ', () => {
        let gridObj: Grid;  
        let data: Object[] =  [
            {
              customer: {
                OrderID: 10248,
                RoleID: 123,
                CustomerID: 'VINET',
                CustomerName: 'Maria ',
              },
              location: {
                ShipCity: 'Reims',
                ShipCountry: 'France',
              },
            },
            {
              customer: {
                OrderID: 10249,
                RoleID: 456,
                CustomerID: 'TOMSP',
                CustomerName: 'Ana Trujillo',
              },
              location: {
                ShipCity: 'Münster',
                ShipCountry: 'Germany',
              },
            },
          ];
        beforeAll((done: Function) => {    
          gridObj = createGrid(    
           {    
             dataSource: data,    
             enableVirtualization: true,        
             editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },    
             toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],    
             height: 300,    
             columns: [    
              {field: 'customer.OrderID', headerText:'OrderID', width:120, isPrimaryKey:true},
              {field: 'customer.CustomerID', headerText:'CustomerID', width:120},        
              {field: 'location.ShipCity', headerText:'ShipCity', width:130}    
             ],    
           }, done );    
        });    
       
        it('Edit the row in grid', (done: Function) => {
           let actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.currentViewData[1]['customer']['CustomerID'])).toBe('TOMSP');
                    done();
                }
           };      
           gridObj.actionComplete = actionComplete;
           gridObj.selectRow(0, true);
           (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
           (select('#' + gridObj.element.id + 'customer___CustomerID', gridObj.element) as any).value =  'BRAMP';
           (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
       });

       afterAll(() => {
           destroy(gridObj);
           gridObj = null;
       });
    });

    describe('EJ2-870042- Editing a Grid with virtual scroll and column with no field results in a script error => ', () => {
        let gridObj: Grid;
        let columns: Column[] = largeDatasetColumns(5);
        columns.unshift({ type: 'checkbox', width: 50 } as Column);
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: largeDataset.slice(0, 50),
                    columns: columns,
                    enableVirtualization: true,
                    enableColumnVirtualization: true,
                    editSettings: {
                        allowEditing: true,
                        allowAdding: true,
                        allowDeleting: true
                    },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    height: 300,
                    width: 400
                }, done);
        });
        it('edit record', (done: Function) => {
            let actionComplete = (args: EditEventArgs) => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.isEdit).toBeTruthy();
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(0, true);
            gridObj.startEdit();
        });

        it('Save edited record', (done: Function) => {
            let actionComplete = (args: EditEventArgs) => {
                if (args.requestType === 'save') {
                    expect(gridObj.isEdit).toBeFalsy();
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.endEdit();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = columns = null;
        });
    });

    describe('EJ2-847398 - changeDataSource not working properly when virtualization is enabled => ', () => {
        let gridObj: Grid;
        const data: Object[] = [
            {
                customer: {
                    OrderID: 10248,
                    RoleID: 123,
                    CustomerID: 'VINET',
                    CustomerName: 'Maria ',
                },
                location: {
                    ShipCity: 'Reims',
                    ShipCountry: 'France',
                },
            },
            {
                customer: {
                    OrderID: 10249,
                    RoleID: 456,
                    CustomerID: 'TOMSP',
                    CustomerName: 'Ana Trujillo',
                },
                location: {
                    ShipCity: 'Münster',
                    ShipCountry: 'Germany',
                },
            },
        ];
        const columns2: any[] = [
            {
                field: 'CustomerID', headerText: 'Customer ID',
                width: 120,
                textAlign: 'Right'
            },
            {
                field: 'CustomerName',
                headerText: 'Customer Name',
                width: 150,

            },
        ];
        beforeAll((done: Function) => {    
          gridObj = createGrid(    
           {    
             dataSource: [],    
             enableVirtualization: true,
             enableColumnVirtualization: true,
             height: 300,
             columns: [
              {field: 'OrderID', headerText:'OrderID', width:120},
             ],
           }, done );
        });
       
        it('changedatasource call', (done: Function) => {
            let dataBound = () => {
                expect((gridObj as any).columnModel.length).toBe(2);
                expect(gridObj.headerModule['virtualEle'].wrapper.style.width).toBe('100%');
                gridObj.dataBound = null;
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.changeDataSource(data, columns2);
        });

       afterAll(() => {
           destroy(gridObj);
           gridObj = null;
       });
    });

    // used for code coverage
    describe('Column virtualization with freeze and editing testing', () => {
        let gObj: Grid;
        let columns: Column[] = largeDatasetColumns(30);
        columns[0]['freeze'] = 'Left';
        columns[3]['displayAsCheckBox'] = true;
        columns[4]['freeze'] = 'Fixed';
        columns[8]['freeze'] = 'Right';
        (columns as any).splice(1, 0, { type: 'Checkbox', width: 70 });

        beforeAll((done: Function) => {
            gObj = createGrid(
                {
                    dataSource: largeDataset,
                    columns: columns,
                    enableVirtualization: true,
                    enableColumnVirtualization: true,
                    editSettings: {
                        allowEditing: true,
                        allowAdding: true,
                        allowDeleting: true
                    },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    height: 300,
                    width: 400
                }, done);
        });

        it('edit record', (done: Function) => {
            let actionComplete = (args: EditEventArgs) => {
                expect(gObj.isEdit).toBeTruthy;
                gObj.actionComplete = null;
                done();
            };
            gObj.actionComplete = actionComplete;
            gObj.selectRow(1);
            gObj.startEdit();
        });

        // commented below code due to build failure. uncomment this case in future
        // it('Scroll in X direction', (done: Function) => {
        //     let dataBound = (args: any) => {
        //         expect(gObj.isEdit).toBeTruthy;
        //         gObj.dataBound = null;
        //         done();
        //     };
        //     gObj.dataBound = dataBound;
        //     gObj.element.querySelector('.e-movablescrollbar').scrollLeft = 1600;
        // });

        it('execute refreshColumns', (done: Function) => {
            let dataBound = (args: any) => {
                expect(gObj.isEdit).toBeFalsy;
                gObj.dataBound = null;
                done();
            };
            gObj.dataBound = dataBound;
            gObj.refreshColumns();
        });

        it('execute methods 1', (done: Function) => {
            expect(1).toBe(1);
            gObj.headerModule.setVisible(gObj.getColumns());
            gObj.contentModule.setVisible(gObj.getColumns());
            done();
        });

        afterAll(() => {
            destroy(gObj);
            gObj = columns = null;
        });
    });
});

describe('EJ2-859411-Scroll using the down arrow key by focusing the template, the Grid lose focus', () => {
    let grid: Grid;
    let dataBound: () => void;
    let row: HTMLTableRowElement;
    const columns = [
        {
            field: 'Field0', headerText: 'Field0',
            width: 120,
            textAlign: 'Right'
        },
        {
            field: 'Template',
            headerText: 'Template Link',
            width: 150,
            template: `<div>
            <a href="https://google.com/">
                Template link
            </a>
        </div>`
        },
    ];
    beforeAll((done: Function) => {
        grid = createGrid(
            {
                dataSource: largeDataset,
                columns: columns,
                enableVirtualization: true,
                allowSelection: true,
                selectionSettings: { type: 'Multiple' },
                height: 300
            },done);
    });
    it('check selection by click in last viewable row', (done: Function) => {
        grid.rowSelected = <EmitType<{}>>done;
        row = <HTMLTableRowElement>(<HTMLTableElement>grid.getContentTable()).rows[7];
        let index: number = parseInt(row.getAttribute('aria-rowindex'), 10) - 1;
        (<HTMLElement>row.cells[1]).click();
        expect(grid.getSelectedRowIndexes()[0]).toEqual(index);
    });
    it('down key action and check scrolltop set properly for 1 row height', (done: Function) => {
        expect((<HTMLElement>grid.getContent().firstChild).scrollTop).toBe(0);
        dataBound = (args?: any): void => {
            dataBound = null;
            expect((<HTMLElement>grid.getContent().firstChild).scrollTop).toBeLessThan(40);
            expect((<HTMLElement>grid.getContent().firstChild).scrollTop).not.toBe(0);
            done();
        };
        grid.dataBound = dataBound;
        grid.keyboardModule.keyAction({ action: 'downArrow', target: document.activeElement, preventDefault: () => {} } as any);
    });
    afterAll(() => {
        destroy(grid);
        grid = dataBound = null;
    });
});

describe('EJ2-873384-When the Grid height is set in pixels, whitespaces are shown while scrolling up and down', () => {
    let grid: Grid;
    beforeAll((done: Function) => {
        grid = createGrid(
            {
                dataSource: largeDataset.slice(0,60),
                columns: [{ field: 'Field0', headerText: 'Field0', width: 120 }],
                enableVirtualization: true,
                height: '600px'
            },done);
    });
    it('ensure pageSize', (done: Function) => {
            expect(grid.pageSettings.pageSize).toBeGreaterThan(12);
            done();
    });
    afterAll(() => {
        destroy(grid);
        grid = null;
    });
});

 // used for code coverage
 describe('VirtualScroll code coverage', () => {
    let gObj: Grid;
    beforeAll((done: Function) => {
        gObj = createGrid(
            {
                dataSource: filterData,
                height: 400,
                enableVirtualization: true,
                columns: [    
                    {field: 'OrderID', headerText:'OrderID', width:120, isPrimaryKey:true},
                    {field: 'CustomerID', headerText:'CustomerID', width:120},        
                    {field: 'ShipCity', headerText:'ShipCity', width:130}    
                ], 
            }, done);
    });

    it('execute setBlockForManualRefresh', () => {
        let contentModule: VirtualContentRenderer = <VirtualContentRenderer>gObj.contentModule;
        let rows: any = gObj.getRowsObject();
        contentModule.vgenerator.includePrevPage = true;
        (contentModule.vgenerator as any).setBlockForManualRefresh(contentModule.vgenerator.cache, [1,2], rows);
    });
    it('execute setUndefinedColumnWidth ', () => {
        gObj.widthService.setUndefinedColumnWidth(gObj.getColumns());
        gObj.on(events.preventFrozenScrollRefresh, (args: any) => {
            args.cancel = true;
            gObj.off(events.preventFrozenScrollRefresh);
        });
        gObj.widthService.refreshFrozenScrollbar();
    });


    afterAll(() => {
        destroy(gObj);
        gObj = null;
    });
});



 // used for code coverage
 describe('VirtualScroll code coverage', () => {
    let gObj: Grid;
    beforeAll((done: Function) => {
        gObj = createGrid(
            {
                dataSource: filterData,
                height: 400,
                enableVirtualization: true,
                allowGrouping: true,
                groupSettings: { columns: ['CustomerID'] },
                columns: [    
                    {field: 'OrderID', headerText:'OrderID', width:120, isPrimaryKey:true},
                    {field: 'CustomerID', headerText:'CustomerID', width:120},        
                    {field: 'ShipCity', headerText:'ShipCity', width:130}    
                ], 
            }, done);
    });

    it('getCurrentBatchRecordChanges coverage', () => {
        gObj.selectionModule.getCurrentBatchRecordChanges();
    }); 

    it('vertical scroll in down direction', (done: Function) => {
        (<HTMLElement>gObj.getContent().firstChild).scrollTop = 700;
        setTimeout(done, 200);
    });

    it('vertical scroll in up direction', (done: Function) => {
        (<HTMLElement>gObj.getContent().firstChild).scrollTop = 200;
        setTimeout(done, 200);
    });

    afterAll(() => {
        destroy(gObj);
        gObj = null;
    });
});


 // used for code coverage
 describe('VirtualScroll code coverage 1', () => {
    let gObj: Grid;
    beforeAll((done: Function) => {
        gObj = createGrid(
            {
                dataSource: filterData,
                height: 400,
                enableVirtualization: true,

                columns: [    
                    {field: 'OrderID', headerText:'OrderID', width:120, isPrimaryKey:true},
                    {field: 'CustomerID', headerText:'CustomerID', width:120},        
                    {field: 'ShipCity', headerText:'ShipCity', width:130}    
                ], 
            }, done);
    });

    it('vertical scroll in down direction', () => {
        let contentModule: VirtualContentRenderer = <VirtualContentRenderer>gObj.contentModule;
        let e: object = { direction: 'down' };
        gObj.islazyloadRequest = true;
        gObj.enablePersistence = true;
        (contentModule as any).scrollListener(e);
        (contentModule as any).selectRowOnContextOpen({ isOpen: true });
    });

    it('virtual element function', () => {
        let contentModule: VirtualContentRenderer = <VirtualContentRenderer>gObj.contentModule;
        contentModule.virtualEle.renderFrozenWrapper(300);
        contentModule.virtualEle.renderFrozenPlaceHolder();
        contentModule.virtualEle.setFreezeWrapperWidth(gObj.element, '100', false);
        contentModule.virtualEle.setFreezeWrapperWidth(gObj.element, null, true);
        contentModule.virtualEle.setFreezeWrapperWidth(gObj.element, null, false);
    });



    afterAll(() => {
        destroy(gObj);
        gObj = null;
    });
});

describe('VirtualScroll code coverage 2', () => {
    let gObj: Grid;
    beforeAll((done: Function) => {
        gObj = createGrid(
            {
                dataSource: filterData,
                height: '100%',
                enableVirtualization: true,
                selectionSettings: { checkboxOnly: true },
                columns: [    
                    {field: 'OrderID', headerText:'OrderID', width:120, isPrimaryKey:true},
                    {field: 'CustomerID', headerText:'CustomerID', width:120},        
                    {field: 'ShipCity', headerText:'ShipCity', width:130}    
                ], 
            }, done);
    });

    
    it('refreshVirtualLazyLoadCache  coevarge', () => {
        let contentModule: VirtualContentRenderer = <VirtualContentRenderer>gObj.contentModule;
        let row = gObj.getRowsObject()[0];
        (contentModule as any).refreshVirtualLazyLoadCache({});
        (contentModule as any).refreshVirtualLazyLoadCache({ count: 1, uid: row.uid });
        (contentModule as any).refreshVirtualLazyLoadCache({ rows: [row],  uid: row.uid });
    });

    it('virtual content renderer coverage', () => {
        let contentModule: VirtualContentRenderer = <VirtualContentRenderer>gObj.contentModule;
        (contentModule as any).rowIndex = 1;
        (contentModule as any).cellIndex = 1;
        (contentModule as any).activeKey = 'downArrow';
        (contentModule as any).focusCell(); 
        (contentModule as any).resetStickyLeftPos();
        (contentModule as any).isNormaledit = false;
        (contentModule as any).editSuccess();
        (contentModule as any).addActionBegin();
        (contentModule as any).actionBegin({ cancel : true });
        gObj.enableVirtualization = false;
        (contentModule as any).actionComplete();
    });

    afterAll(() => {
        destroy(gObj);
        gObj = null;
    });
});



describe('VirtualScroll code coverage 3', () => {
    let gObj: Grid;
    beforeAll((done: Function) => {
        gObj = createGrid(
            {
                dataSource: filterData,
                height: 300,
                enableVirtualMaskRow: false,
                enableVirtualization: true,
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, showAddNewRow: true, newRowPosition: 'Top'},
                columns: [    
                    {field: 'OrderID', headerText:'OrderID', width:120, isPrimaryKey:true},
                    {field: 'CustomerID', headerText:'CustomerID', width:120},        
                    {field: 'ShipCity', headerText:'ShipCity', width:130}    
                ], 
            }, done);
    });

    
    it('scrollToEdit   coevarge', () => {
        let contentModule: VirtualContentRenderer = <VirtualContentRenderer>gObj.contentModule;
        (contentModule as any).editedRowIndex = 5;
        (contentModule as any).scrollToEdit(gObj.columns[0]);
        (contentModule as any).editedRowIndex = 67;
        (contentModule as any).scrollToEdit();
    });

    it('setVirtualPageQuery  coevarge', () => {
        let contentModule: VirtualContentRenderer = <VirtualContentRenderer>gObj.contentModule;
        contentModule.requestType === 'virtualscroll';
        contentModule.vgenerator.currentInfo = {};
        contentModule.vgenerator.currentInfo.blockIndexes = [];
        (contentModule as any).setVirtualPageQuery();
    });

    it('vertical scroll in down 1 direction', (done: Function) => {
        let contentModule: VirtualContentRenderer = <VirtualContentRenderer>gObj.contentModule;
        (contentModule as any).refreshMaxPage();
        (contentModule as any).isBottom = true;
        (contentModule as any).isTop = true;
        (<HTMLElement>gObj.getContent().firstChild).scrollTop = 1000;
        setTimeout(done, 200);
    });
    
    it('VirtualScroll add action coevarge', (done: Function) => {
        gObj.editSettings.newRowPosition = 'Bottom';
        (<any>gObj.toolbarModule).toolbarClickHandler({ item: { id: gObj.element.id + '_add' } });
        done();
    });

    afterAll(() => {
        destroy(gObj);
        gObj = null;
    });
});




describe('Grouping VirtualScroll code coverage', () => {
    let gObj: Grid;
    let preventDefault: Function = new Function();
    let captions: NodeListOf<Element>;
    beforeAll((done: Function) => {
        gObj = createGrid(
            {
                dataSource: filterData,
                height: 300,
                allowGrouping: true,
                enableVirtualization: true,
                groupSettings: { columns: ['CustomerID'] },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, newRowPosition: 'Top'},
                columns: [    
                    {field: 'OrderID', headerText:'OrderID', width:120, isPrimaryKey:true},
                    {field: 'CustomerID', headerText:'CustomerID', width:120},      
                    { field: 'Freight',textAlign: 'Right',width:110 ,format:'C2',headerText:"Freight"},
                    {field: 'ShipCity', headerText:'ShipCity', width:130}    
                ], 
            }, done);
        gObj.isInitialLoad = true;
    });

    it('coverage for grouping with hide/show column in virtualscroll', () => {
        captions = gObj.element.querySelectorAll('.e-groupcaption');
    });

    it('coverage for virtualcell focus due to preventFocusOnGroup', function () {
        (gObj.focusModule as any).focus();
    });

    it('coverage for grouping with hide/show column in virtualscroll', () => {
        let captions: NodeListOf<Element> = gObj.element.querySelectorAll('.e-groupcaption');
        gObj.keyboardModule.keyAction({ action: 'downArrow', preventDefault: preventDefault, target: captions[0] } as any);
        gObj.keyboardModule.keyAction({ action: 'downArrow', preventDefault: preventDefault, target: captions[1] } as any);
        gObj.keyboardModule.keyAction({ action: 'downArrow', preventDefault: preventDefault, target: captions[2] } as any);
        gObj.keyboardModule.keyAction({ action: 'downArrow', preventDefault: preventDefault, target: captions[3] } as any);
        gObj.keyboardModule.keyAction({ action: 'downArrow', preventDefault: preventDefault, target: captions[4] } as any);
        gObj.keyboardModule.keyAction({ action: 'downArrow', preventDefault: preventDefault, target: captions[5] } as any);
    });

    it('coverage for grouping with hide/show column in virtualscroll', () => {
        gObj.hideColumns(['Freight']);
    });


    afterAll(() => {
        destroy(gObj);
        gObj = preventDefault = captions = null;
    });
});



describe('enableColumnVirtualization code coverage', () => {
    let gObj: Grid;
    beforeAll((done: Function) => {
        gObj = createGrid(
            {
                dataSource: filterData,
                height: 300,
                width: 800,
                enableColumnVirtualization: true,
                enableInfiniteScrolling: true,
                infiniteScrollSettings: { enableCache: true },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, newRowPosition: 'Top'},
                columns: [    
                    {field: 'OrderID', headerText:'OrderID', width:120, isPrimaryKey:true},
                    {field: 'CustomerID', headerText:'CustomerID', width:120},      
                    { field: 'Freight',textAlign: 'Right',width:110 ,format:'C2',headerText:"Freight"},
                    {field: 'ShipCity', headerText:'ShipCity', width:130}    
                ], 
            }, done);
    });


    it('coverage for editActionBegin', () => {
        (gObj as any).updateMediaColumns(); 
        let contentModule: VirtualContentRenderer = <VirtualContentRenderer>gObj.contentModule;
        (contentModule as any).refreshCache();
        (contentModule as any).editActionBegin({  data: {OrderID: 101 }, index: 1, isScroll: false });
        gObj.enableInfiniteScrolling = false;
        gObj.groupSettings.columns = ['CustomerID'];
        (contentModule as any).refreshCache({});
        (contentModule as any).editedRowIndex = 1;
        gObj.allowPaging = true;
        (contentModule as any).refreshCache({});
        (gObj as any).virtualscrollModule.refreshVirtualElement({ module:'resize' });
        gObj.editModule.virtualFormObj = null;
        (gObj as any).virtualscrollModule.virtualEditFormValidation();
    });

    it('virtual content renderer coverage', () => {
        gObj.isDestroyed = true;
        (gObj as any).virtualscrollModule.addEventListener();
        gObj.isDestroyed = false;
    });



    afterAll(() => {
        destroy(gObj);
        gObj = null;
    });
});

describe('EJ2-909118: Virtualization not working properly with specific pageSize values', () => {
    let gObj: Grid;
    beforeAll((done: Function) => {
        gObj = createGrid(
            {
                dataSource: filterData,
                pageSettings: {pageSize: 25},
                height: 300,
                width: 800,
                enableVirtualization: true,
                allowGrouping: true,
                columns: [    
                    {field: 'OrderID', headerText:'OrderID', width:120, isPrimaryKey:true},
                    {field: 'CustomerID', headerText:'CustomerID', width:120},      
                    { field: 'Freight',textAlign: 'Right',width:110 ,format:'C2',headerText:"Freight"},
                    {field: 'ShipCity', headerText:'ShipCity', width:130}    
                ], 
            }, done);
    });

    it('virtual content renderer coverage', () => {
        gObj.groupColumn('OrderID');
    });

    afterAll(() => {
        destroy(gObj);
        gObj = null;
    });
});

describe('EJ2-914328: DataBound event is triggered multiple times during page refresh when virtualization with persistence is enabled.', () => {
    let gObj: Grid;
    beforeAll((done: Function) => {
        gObj = createGrid(
            {
                dataSource: filterData,
                height: 300,
                enableVirtualization: true,
                columns: [    
                    { field: 'OrderID', headerText:'OrderID', width:120, isPrimaryKey:true},
                    { field: 'CustomerID', headerText:'CustomerID', width:120},      
                    { field: 'Freight', textAlign: 'Right', width:110 , format:'C2', headerText:"Freight"},
                    { field: 'ShipCity', headerText:'ShipCity', width:130}    
                ], 
            }, done);
    });

    it('scroll listener coverage', () => {
        let e: object = { direction: 'down', sentinel: { axis: 'Z' }, offset: { left: 0, top: 1450} };
        gObj.enablePersistence = true;
        gObj.isInitialLoad = false;
        (gObj as any).contentModule.scrollListener(e);
    });

    afterAll(() => {
        destroy(gObj);
        gObj = null;
    });
});

describe('EJ2-917183: RowDeselected event arguments are undefined when we enable virtualization', () => {
    let gObj: Grid;
    let rowDeselecting: (args: any) => void;
    beforeAll((done: Function) => {
        gObj = createGrid(
            {
                dataSource: filterData,
                height: 400,
                enableVirtualization: true,
                columns: [    
                    {field: 'OrderID', headerText:'OrderID', width:120, isPrimaryKey:true},
                    {field: 'CustomerID', headerText:'CustomerID', width:120},      
                    { field: 'Freight',textAlign: 'Right',width:110 ,format:'C2',headerText:"Freight"},
                    {field: 'ShipCity', headerText:'ShipCity', width:130}    
                ], 
            }, done);
    });

    it('Change the scroller position after databound', (done: Function) => {
        let dataBound = () => {
            done();
        };
        gObj.dataBound = dataBound;
        gObj.getContent().firstElementChild.scrollTop = 1000;
    });

    it('Select one row in current view port', () => {
        (gObj.getDataRows()[15].querySelector('.e-rowcell') as HTMLElement).click();
    });

    it('Select another row in same page view port for deselection', (done: Function) => {
        rowDeselecting = (args: any) => {
            expect(args.row).toBeDefined();
            expect(args.data).toBeDefined();
            done();
        };
        gObj.rowDeselecting = rowDeselecting;
        (gObj.getDataRows()[17].querySelector('.e-rowcell') as HTMLElement).click();
    });

    afterAll(() => {
        destroy(gObj);
        gObj = null;
        gObj.rowDeselecting = null;
    });
});

describe('EJ2-917792: Console Error on Cell Selection with Virtualization Enabled in Grid so need to prevent cell selection', () => {
    let gObj: Grid;
    beforeAll((done: Function) => {
        gObj = createGrid(
            {
                dataSource: filterData,
                height: 400,
                enableVirtualization: true,
                selectionSettings: {
                    mode: 'Cell',
                }, 
                columns: [    
                    {field: 'OrderID', headerText:'OrderID', width:120, isPrimaryKey:true},
                    {field: 'CustomerID', headerText:'CustomerID', width:120},      
                    { field: 'Freight',textAlign: 'Right',width:110 ,format:'C2',headerText:"Freight"},
                    {field: 'ShipCity', headerText:'ShipCity', width:130}    
                ], 
            }, done);
    });

    it('Select one cell in current view port', () => {
        (gObj.getDataRows()[15].querySelector('.e-rowcell') as HTMLElement).click();
    });

    it('Expected as 0 in selectedCellIndexes', () => {
        expect(gObj.selectionModule.selectedRowCellIndexes.length).toBe(0);
    })

    afterAll(() => {
        destroy(gObj);
        gObj = null;
    });
});

describe('EJ2-889406: White space occurs in virtual scroll', () => {
    let gObj: Grid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gObj = createGrid(
            {
                dataSource: filterData,
                height: 400,
                enableVirtualization: true,
                columns: [    
                    {field: 'OrderID', headerText:'OrderID', width:120 },
                    {field: 'CustomerID', headerText:'CustomerID', width:120},      
                    { field: 'Freight',textAlign: 'Right',width:110 ,format:'C2',headerText:"Freight"},
                    {field: 'ShipCity', headerText:'ShipCity', width:130}    
                ], 
            }, done);
    });

    it('Scroll to some point', (done: Function) => {
        (gObj.contentModule as VirtualContentRenderer).content.scrollTop = 600;
        setTimeout(done, 200);
    });

    it('Select last header cell', () => {
        (gObj.getHeaderTable() as HTMLTableElement).rows[0].cells[3].click();
    })

    it('Press Tab', (done: Function) => {
        let e: object = { target: (gObj.getHeaderTable() as HTMLTableElement).rows[0].cells[3], action: 'tab', preventDefault };
        (gObj.focusModule as any).onKeyPress(e);
        setTimeout(done, 200);
    })

    it('Check activeElement', () => {
        expect(document.activeElement).toBe((gObj.getContentTable() as HTMLTableElement).rows[0].cells[0]);
    })

    afterAll(() => {
        destroy(gObj);
        gObj = null;
    });
});

describe('EJ2-948433: grid.getSelectedRecords() Returns Empty Array for Selected Rows in Virtualization enabled Grid with Grouping', () => {
    let gObj: Grid;
    beforeAll((done: Function) => {
        gObj = createGrid(
            {
                dataSource: filterData.slice(0, 4),
                height: 400,
                enableVirtualization: true,
                allowGrouping: true,
                columns: [    
                    {field: 'OrderID', headerText:'OrderID', width:120 },
                    {field: 'CustomerID', headerText:'CustomerID', width:120},      
                    {field: 'Freight', textAlign: 'Right', width:110 , format:'C2', headerText:"Freight"},
                    {field: 'ShipCity', headerText:'ShipCity', width:130}    
                ], 
            }, done);
    });

    it('Group the column', (done: Function) => {
        gObj.groupColumn('CustomerID');
        done();
    });

    it('Select the row', (done: Function) => {
        gObj.rowSelected = () => {
            expect(gObj.getSelectedRecords().length).toBe(1);
            gObj.rowSelected = null;
            done();
        }
        gObj.selectRow(1);
        done();
    })

    it('Coverage c=for first cell focus on appenChild method', (done: Function) => {
        (gObj.contentModule as any).firstCellFocus = true;
        gObj.refreshColumns();
        done();
    })

    afterAll(() => {
        destroy(gObj);
        gObj = null;
    });
});

describe('EJ2-963165: Unexpected White Space Appears When Cancelling a New Row at the Bottom in Virtual Scrolling', () => {
    let gObj: Grid;
    beforeAll((done: Function) => {
        gObj = createGrid(
            {
                dataSource: filterData,
                height: 300,
                enableVirtualization: true,
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, newRowPosition: 'Bottom'},
                columns: [    
                    {field: 'OrderID', headerText:'OrderID', width:120, isPrimaryKey:true},
                    {field: 'CustomerID', headerText:'CustomerID', width:120},      
                    {field: 'Freight',textAlign: 'Right',width:110 ,format:'C2',headerText:"Freight"},
                    {field: 'ShipCity', headerText:'ShipCity', width:130}    
                ], 
            }, done);
    });

    it('coverage for virtual scrolling with cancelling a new row', (done: Function) => {
        let actionComplete = (args?: any): void => {
            if (args.requestType === 'add') {
                gObj.element.focus();
                (<any>gObj.toolbarModule).toolbarClickHandler({ item: { id: gObj.element.id + '_cancel' } });
                gObj.actionComplete = undefined;
                done();
            }
        };
        gObj.actionComplete = actionComplete;
        (<any>gObj.toolbarModule).toolbarClickHandler({ item: { id: gObj.element.id + '_add' } });
    });

    afterAll(() => {
        destroy(gObj);
        gObj = null;
    });
});
