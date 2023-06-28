/**
 * virtual scrolling spec
 */
import { EmitType, EventHandler, select } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { createElement } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Sort } from '../../../src/grid/actions/sort';
import { Group } from '../../../src/grid/actions/group';
import { Selection } from '../../../src/grid/actions/selection';
import { Edit } from '../../../src/grid/actions/edit';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Filter } from '../../../src/grid/actions/filter';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import { Freeze } from '../../../src/grid/actions/freeze';
import { Aggregate } from '../../../src/grid/actions/aggregate';
import { GridModel } from '../../../src/grid/base/grid-model';
import { Column } from '../../../src/grid/models/column';
import { Row } from '../../../src/grid/models/row';
import { VirtualContentRenderer } from '../../../src/grid/renderer/virtual-content-renderer';
import { VirtualRowModelGenerator } from '../../../src/grid/services/virtual-row-model-generator';
import { RowModelGenerator } from '../../../src/grid/services/row-model-generator';
import '../../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import { largeDataset, employeeData } from '../base/datasource.spec';
import { EditEventArgs, NotifyArgs } from '../../../src';

Grid.Inject(VirtualScroll, Sort, Filter, Selection, Group, Aggregate, Edit, Toolbar, Freeze);

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
                this.skip(); //Skips test (in Chai)
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
                let index: number = parseInt(row.getAttribute('data-rowindex'), 10);
                (<HTMLElement>row.cells[0]).click();
                expect(grid.getSelectedRowIndexes()[0]).toEqual(index);
            });
            it('check selection by selectRow method', (done: Function) => {
                let row: HTMLTableRowElement = <HTMLTableRowElement>(<HTMLTableElement>grid.getContentTable()).rows[5];
                let index: number = parseInt(row.getAttribute('data-rowindex'), 10);
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
            expect(grid.getColumnIndexesInView()[0]).toBeGreaterThanOrEqual(parseInt(row.cells[0].getAttribute('data-colindex'), 10));
        });
        it('check last column index', () => {
            let row: HTMLTableRowElement = <HTMLTableRowElement>(<HTMLTableElement>grid.getContentTable()).rows[0];
            let indexes: number[] = grid.getColumnIndexesInView();
            expect(indexes[indexes.length - 1])
                .toBeGreaterThanOrEqual(parseInt(row.cells[indexes.length - 1].getAttribute('data-colindex'), 10));
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
            expect(grid.getColumnIndexesInView()[0]).toBeGreaterThanOrEqual(parseInt(row.cells[0].getAttribute('data-colindex'), 10));
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
            expect(gObj.getRows()[0].getAttribute('data-rowindex')).toBe('1');
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

    describe("Inline editing validation check in Frozen with column virtualization", () => {
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
                    frozenColumns: 2,
                    editSettings: {
                        allowEditing: true,
                        allowAdding: true,
                        allowDeleting: true
                    },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    height: 300
                }, done);
        });

        it('add record to check horizontal scroll action', (done: Function) => {
            gObj.dataBound = null;
            let dataBound = () => {
                expect(gObj.editModule.formObj.element.querySelectorAll('.e-griderror:not([style*="display: none"])').length).toBe(0);
                expect(gObj.editModule.mFormObj.element.querySelectorAll('.e-griderror:not([style*="display: none"])').length).toBe(1);
                expect(gObj.editModule.virtualFormObj.element.querySelectorAll('.e-griderror:not([style*="display: none"])').length).toBe(1);
                expect(gObj.getMovableVirtualContent().scrollLeft).not.toBe(0);
                (gObj.element.querySelector('#' + gObj.element.id + columns[columns.length - 1].field) as HTMLInputElement).value = '567843212345674';
                gObj.dataBound = null;
                done();
            };
            let actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gObj.editModule.formObj.element.getElementsByClassName('e-field').length).toBe(gObj.getFrozenColumns());
                    expect(gObj.editModule.mFormObj.element.getElementsByClassName('e-field').length).toBe(gObj.getColumns().length - gObj.getFrozenColumns());
                    expect(gObj.editModule.virtualFormObj.element.getElementsByClassName('e-field').length).toBe(gObj.columns.length);
                    gObj.element.focus();
                    (gObj.element.querySelector('#' + gObj.element.id + columns[0].field) as HTMLInputElement).value = '567843212345674';
                    gObj.dataBound = dataBound;
                    gObj.actionComplete = null;
                    (<any>gObj.toolbarModule).toolbarClickHandler({ item: { id: gObj.element.id + '_update' } });
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
                expect(document.getElementsByClassName('e-headercell')[0].classList.contains('e-hide')).toBe(true);
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
});