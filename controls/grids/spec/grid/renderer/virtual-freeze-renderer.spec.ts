/**
 * Virtual freeze renderer spec
 */
import { Grid } from '../../../src/grid/base/grid';
import { Freeze } from '../../../src/grid/actions/freeze';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import { createGrid, destroy } from '../base/specutil.spec';
import { getTransformValues, parentsUntil } from '../../../src/grid/base/util';
import { NotifyArgs, IGrid } from '../../../src/grid/base/interface';
import { Row } from '../../../src/grid/models/row';
import { Column } from '../../../src/grid/models/column';
import { EmitType, createElement, extend } from '@syncfusion/ej2-base';
import { GridModel } from '../../../src/grid/base/grid-model';
import { Filter } from '../../../src/grid/actions/filter';
import { Reorder } from '../../../src/grid/actions/reorder';

Grid.Inject(Freeze, VirtualScroll, Filter, Reorder);

let ctr: number = 0;
let count500: string[] = Array.apply(null, Array(5)).map(() => 'Column' + ++ctr + '');
let count5000: string[] = Array.apply(null, Array(500)).map(() => 'Column' + ++ctr + '');
let data1: Object[] = (() => {
    let arr: Object[] = [];
    for (let i: number = 0, o: Object = {}, j: number = 0; i < 1000; i++ , j++ , o = {}) {
        count500.forEach((lt: string) => o[lt] = 'Column' + lt + 'Row' + i);
        arr[j] = o;
    }
    return arr;
})();

let data2: Object[] = (() => {
    let arr: Object[] = [];
    for (let i: number = 0, o: Object = {}, j: number = 0; i < 1000; i++ , j++ , o = {}) {
        count5000.forEach((lt: string) => o[lt] = 'Column' + lt + 'Row' + i);
        arr[j] = o;
    }
    return arr;
})();

let createGrid1: Function = (options: GridModel, done: Function): Grid => {
    let grid: Grid;
    let div: HTMLElement = createElement('div', { id: 'Grid' });
    document.body.appendChild(div);
    grid = new Grid(
        extend(
            {}, {
                
            },
            options
        ),
    );
    grid.appendTo(div);
    return grid;
};

let destroy1: EmitType<Object> = (grid: Grid) => {
    if (grid) {
        grid.destroy();
        document.getElementById('Grid').remove();
    }
};

describe('Virtual-freeze-renderer --- row virtualization', () => {
    describe('Freeze Column', () => {
        let gridObj: any;
        let fCont: HTMLElement;
        let mCont: HTMLElement;
        let mHdr: HTMLElement;
        let fHdr: HTMLElement;
        let mRowBeforeScroll: Element;
        let fRowBeforeScroll: Element;
        let scrollEle: HTMLElement;
        let virtualTable: HTMLElement;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data1,
                    frozenColumns: 2,
                    enableVirtualization: true,
                    height: 400,
                    columns: count500
                }, done);
        });

        it('Collect html elements', () => {
            fCont = gridObj.getContent().querySelector('.e-frozencontent');
            mCont = gridObj.getContent().querySelector('.e-movablecontent');
            mHdr = gridObj.getHeaderContent().querySelector('.e-movableheader');
            fHdr = gridObj.getHeaderContent().querySelector('.e-movableheader');
            scrollEle = gridObj.getContent().firstElementChild;
            virtualTable = gridObj.getContent().querySelector('.e-virtualtable');
            fRowBeforeScroll = fCont.querySelector('.e-row');
            mRowBeforeScroll = mCont.querySelector('.e-row');
        });

        it('Frozen column testing', () => {
            expect(fCont.querySelector('.e-row').children.length).toBe(gridObj.frozenColumns);
            let colsLength: number = gridObj.getColumns().length;
            expect(mCont.querySelector('.e-row').children.length).toBe(colsLength - gridObj.frozenColumns);
        });

        it('Ensure tables, virtualtracks and its count', () => {
            expect(parentsUntil(fCont, 'e-virtualtable')).toBeTruthy();
            expect(parentsUntil(mCont, 'e-virtualtable')).toBeTruthy();
            expect(parentsUntil(fHdr, 'e-virtualtable')).toBeFalsy();
            expect(parentsUntil(mHdr, 'e-virtualtable')).toBeFalsy();
            expect(gridObj.getContent().querySelectorAll('.e-virtualtrack').length).toBe(1);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-virtualtrack').length).toBe(0);
        });

        it('Ensure rows and its count', () => {
            expect(fCont.querySelectorAll('.e-row').length).toBe(mCont.querySelectorAll('.e-row').length);
            expect(fCont.querySelector('.e-row')).not.toBe(mCont.querySelector('.e-row'));
        });

        it('Ensure transform values before scroll', () => {
            let mVTblTrans: { width: number, height: number } = getTransformValues(virtualTable);
            expect(mVTblTrans.height).toBe(0);
        });

        it('Ensure position absolute', () => {
            expect(virtualTable.style.position).toBe("");
        });

        it('Perform scrolling', (done: Function) => {
            scrollEle.scrollTop = 2500;
            setTimeout(done, 400);
        });

        it('Check rows count after scrolling', () => {
            let fcnt: Element = gridObj.getContent().querySelector('.e-frozencontent');
            let mVTblTrans: { width: number, height: number } = getTransformValues(virtualTable);
            expect(fcnt.querySelectorAll('.e-row').length).toBe(mCont.querySelectorAll('.e-row').length);
            expect(fcnt.querySelector('.e-row')).not.toBe(mCont.querySelector('.e-row'));
            expect(mVTblTrans.height).not.toBe(0);
            expect(mVTblTrans.width).toBe(0);
        });

        it('Go to first page', (done: Function) => {
            scrollEle.scrollTop = 0;
            setTimeout(done, 400);
        });

        it('ensure transform values in first page', () => {
            let mVTblTrans: { width: number, height: number } = getTransformValues(virtualTable);
            expect(mVTblTrans.height).toBe(0);
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Freeze Row and Column', () => {
        let gridObj: any;
        let virtualTable: HTMLElement;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data1,
                    frozenColumns: 2,
                    frozenRows: 2,
                    enableVirtualization: true,
                    height: 400,
                    columns: count500
                }, done);
        });

        it('Change dynamically', () => {
            gridObj.dataBound = function (done: Function) {
                virtualTable = gridObj.getContent().querySelector('.e-virtualtable');
                let fcnt: Element = gridObj.getContent().querySelector('.e-frozencontent');
                let mcnt: Element = gridObj.getContent().querySelector('.e-movablecontent');
                expect(fcnt.querySelector('.e-row').children.length).toBe(gridObj.frozenColumns);
                let colsLength: number = gridObj.getColumns().length;
                expect(mcnt.querySelector('.e-row').children.length).toBe(colsLength - gridObj.frozenColumns);
                let fHdr: Element = gridObj.getHeaderContent().querySelector('.e-frozenheader');
                let mHdr: Element = gridObj.getHeaderContent().querySelector('.e-movableheader');
                expect(fHdr.querySelectorAll('.e-row').length).toBe(gridObj.frozenRows);
                expect(mHdr.querySelectorAll('.e-row').length).toBe(gridObj.frozenRows);
                let mVTblTrans: { width: number, height: number } = getTransformValues(virtualTable);
                expect(mVTblTrans.height).not.toBe(0);
                done();
            },
            gridObj.frozenColumns = 4;
            gridObj.frozenRows = 4;
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    describe('Ensure new methods', () => {
        let gridObj: any;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data1,
                    frozenColumns: 2,
                    frozenRows: 2,
                    enableVirtualization: true,
                    height: 400,
                    columns: count500
                }, done);
        });

        it('Ensure getRowByIndex and getMovableRowByIndex methods', () => {
            let fcnt: Element = gridObj.getContent().querySelector('.e-frozencontent');
            let mcnt: Element = gridObj.getContent().querySelector('.e-movablecontent');
            let mRow1: Element = gridObj.contentModule.getMovableRowByIndex(gridObj.frozenRows);
            let mRow2: Element = mcnt.querySelectorAll('.e-row')[0];
            expect(mRow1).toBe(mRow2);
            let fRow1: Element = gridObj.contentModule.getRowByIndex(gridObj.frozenRows);
            let fRow2: Element = fcnt.querySelectorAll('.e-row')[0];
            expect(fRow1).toBe(fRow2);
            expect((gridObj as IGrid).getFrozenVirtualContent()).not.toBeNull();
            expect((gridObj as IGrid).getMovableVirtualContent()).not.toBeNull();
        });

        it('Ensure generateRows method', () => {
            let notifyArgs: NotifyArgs = {
                focusElement: document.body, requestType: 'virtualscroll',
                virtualInfo: {
                    block: 1,
                    blockIndexes: [2, 3, 4],
                    columnIndexes: [],
                    direction: 'down', event: 'model-changed', loadNext: true, loadSelf: false, nextInfo: { page: 2 },
                    offsets: { top: 400, left: 0 },
                    page: 1,
                    sentinelInfo: { axis: 'Y', entered: true }
                }
            };
            let pageData: object = gridObj.dataSource.slice(0, 20);
            let len: number = Object.keys(gridObj.dataSource[0]).length;
            let rowObject: Row<Column>[] = gridObj.contentModule.generateRows(pageData, notifyArgs);
            expect(rowObject[0].cells.length).toBe(2);
            notifyArgs = {
                focusElement: document.body, requestType: 'virtualscroll',
                isFrozen: true,
                virtualInfo: {
                    block: 1,
                    blockIndexes: [2, 3, 4],
                    columnIndexes: [],
                    direction: 'down', event: 'model-changed', loadNext: true, loadSelf: false, nextInfo: { page: 2 },
                    offsets: { top: 400, left: 0 },
                    page: 1,
                    sentinelInfo: { axis: 'Y', entered: true }
                }
            };
            rowObject = gridObj.contentModule.generateRows(pageData, notifyArgs);
            expect(rowObject[0].cells.length).toBe(len - gridObj.frozenColumns);
        });

        it('Ensure new methods', () => {
            expect((gridObj as IGrid).getFrozenVirtualHeader()).not.toBeNull();
            expect((gridObj as IGrid).getMovableVirtualHeader()).not.toBeNull();
            expect(gridObj.contentModule.virtualRenderer.vgenerator.getRows()).not.toBeNull();
            expect(gridObj.contentModule.getMovableRows()).not.toBeNull();
            expect(gridObj.contentModule.getRows()).not.toBeNull();
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Column virtualization - before scroll', () => {
        let gridObj: any;
        let fCont: HTMLElement;
        let mCont: HTMLElement;
        let mHdr: HTMLElement;
        let fHdr: HTMLElement;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data2,
                    columns: count5000,
                    frozenColumns: 2,
                    enableVirtualization: true,
                    enableColumnVirtualization: true,
                    height: 400
                }, done);
        });

        it('Collect html elements', () => {
            fCont = gridObj.getContent().querySelector('.e-frozencontent');
            mCont = gridObj.getContent().querySelector('.e-movablecontent');
            mHdr = gridObj.getHeaderContent().querySelector('.e-movableheader');
            fHdr = gridObj.getHeaderContent().querySelector('.e-movableheader');
        });

        it('Ensure tables, virtual tracks, cells and its count', () => {
            expect(parentsUntil(fHdr, 'e-virtualtable')).toBeTruthy();
            expect(parentsUntil(mHdr, 'e-virtualtable')).toBeTruthy();
            expect(parentsUntil(fCont, 'e-virtualtable')).toBeTruthy();
            expect(parentsUntil(mCont, 'e-virtualtable')).toBeTruthy();
            expect(mHdr.querySelectorAll('.e-virtualtable').length).toBe(1);
            expect(mHdr.querySelectorAll('.e-virtualtrack').length).toBe(1);
            expect(mCont.querySelectorAll('.e-virtualtable').length).toBe(1);
            expect(mCont.querySelectorAll('.e-virtualtrack').length).toBe(1);
            expect(gridObj.getContent().querySelectorAll('.e-virtualtrack').length).toBe(2);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-virtualtrack').length).toBe(2);
            expect(gridObj.getContent().querySelectorAll('.e-virtualtable').length).toBe(2);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-virtualtable').length).toBe(2);

            expect(fCont.querySelector('.e-row').children.length).toBe(gridObj.frozenColumns);
            let len: number = Object.keys(gridObj.dataSource[0]).length;
            expect(mCont.querySelector('.e-row').children.length).not.toBe(len);
        });

        it('Ensure transform value before scrolling', () => {
            let mVTblTrans: { width: number, height: number } = getTransformValues(gridObj.getContent().querySelector('.e-virtualtable'));
            let fVTblTrans: { width: number, height: number } = getTransformValues(mCont.querySelector('.e-virtualtable'));
            expect(mVTblTrans.width).toBe(0);
            expect(fVTblTrans.width).toBe(0);
            expect(mVTblTrans.height).toBe(0);
            expect(fVTblTrans.height).toBe(0);
            expect(mCont.scrollLeft).toBe(0);
            expect(mCont.scrollTop).toBe(0);

        });        

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Column virtualization - after scroll', () => {
        let gridObj: any;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data2,
                    columns: count5000,
                    frozenColumns: 2,
                    enableColumnVirtualization: true,
                    enableVirtualization: true,
                    height: 400
                }, done);
        });

        it('scroll left', (done: Function) => {
            gridObj.getContent().querySelector('.e-movablescrollbar').scrollLeft = 800;
            setTimeout(done, 400);
        })

        it('Ensure tables transform value', () => {
            let mcnt: Element = gridObj.getContent().querySelector('.e-movablecontent');
            let fVTblTrans: { width: number, height: number } = getTransformValues(gridObj.getContent().querySelector('.e-virtualtable'));
            let mVTblTrans: { width: number, height: number } = getTransformValues(mcnt.querySelector('.e-virtualtable'));
            expect(fVTblTrans.height).toBe(0);
            expect(mVTblTrans.height).toBe(0);
            expect(fVTblTrans.width).toBe(0);
            // expect(mVTblTrans.width).not.toBe(0);
        });
        
        it('scroll to bottom', function (done) {
            gridObj.getContent().firstElementChild.scrollTop = 800;
            setTimeout(done, 400);
        });

        it('ensure currentPage value', () => {
            expect(gridObj.pageSettings.currentPage).not.toBe(1);
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Column virtualization - dynamically enable the isFrozen in Grid column', () => {
        let gridObj: any;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data2,
                    columns: count5000,
                    enableColumnVirtualization: true,
                    enableVirtualization: true,
                    height: 400
                }, done);
        });

        it('Ensure isFrozen', (done: Function) => {
            (gridObj.columns[1] as Column).isFrozen = true;
            gridObj.dataBound = function() {
                expect((gridObj as IGrid).getMovableVirtualContent()).not.toBeNull();
                done();
            };
            gridObj.refreshColumns();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Frozen Rows and Columns with column vitualization', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data2,
                    columns: count5000,
                    frozenColumns: 2,
                    frozenRows: 2,
                    enableColumnVirtualization: true,
                    enableVirtualization: true,
                    height: 400
                }, done);
        });

        it('Ensure Header row', function (done) {
            gridObj.getContent().querySelector('.e-movablescrollbar').scrollLeft = 800;
            setTimeout(done, 400);
        });

        it ('Ensure header transform', () => {
            let transform1: { width: number, height: number } = getTransformValues(gridObj.getHeaderContent().querySelector('.e-virtualtable'));
            let transform2: { width: number, height: number } = getTransformValues(gridObj.getMovableVirtualHeader().firstElementChild);
            expect(transform1.height).toBe(0);
            expect(transform1.width).toBe(0);
            expect(transform2.height).toBe(0);
            // expect(transform2.width).not.toBe(0);
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Ensure Filter', () => {
        let gridObj: Grid;
        let firstCol: Column;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data2,
                    columns: count5000,
                    frozenColumns: 2,
                    frozenRows: 2,
                    enableColumnVirtualization: true,
                    enableVirtualization: true,
                    allowFiltering: true,
                    width: 800,
                    height: 400
                },done);
        });

        it('ensure filterbar id before scroll', () => {
            let cols: Column[] = gridObj.getColumns();
            firstCol = cols[0];
            let filterbars: HTMLElement[] = [].slice.call(gridObj.getHeaderContent().querySelectorAll('input'));
            expect(filterbars[0].id).toBe(firstCol.headerText + '_filterBarcell');
            expect(filterbars[gridObj.getFrozenColumns()].id).toBe(cols[gridObj.getFrozenColumns()].headerText + '_filterBarcell');
        });

        it('scroll left', (done: Function) => {
            gridObj.getContent().querySelector('.e-movablescrollbar').scrollLeft = 1000;
            setTimeout(done, 400);
        });

        it('ensure filterbar id after horizontal scroll', (done: Function) => {
            let cols: Column[] = gridObj.getColumns();
            let filterbars: HTMLElement[] = [].slice.call(gridObj.getHeaderContent().querySelectorAll('input'));
            expect(filterbars[0].id).toBe(cols[0].headerText + '_filterBarcell');
            expect(filterbars[gridObj.getFrozenColumns()].id).toBe(cols[gridObj.getFrozenColumns()].headerText + '_filterBarcell');
            setTimeout(done, 400);
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Ensure reorder', () => {
        let gridObj: Grid;
        let fCol: Column;
        let fromCol: string;
        let toCol: string;
        let fromColCellValue: string;
        let toColCellValue: string;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data2,
                    columns: count5000,
                    frozenColumns: 2,
                    frozenRows: 2,
                    enableColumnVirtualization: true,
                    enableVirtualization: true,
                    allowFiltering: true,
                    allowReordering: true,
                    width: 800,
                    height: 400
                },done);
        });

        it('store row object before reorder the column', (done: Function) => {
            let cols: Column[] = gridObj.getColumns();
            fCol = cols[1];
            let rowObjects: Row<Column>[] = gridObj.getRowsObject();
            fromCol = cols[0].field;
            toCol = cols[gridObj.getFrozenColumns()].field;
            fromColCellValue = rowObjects[0].data[cols[0].field];
            toColCellValue = rowObjects[0].data[cols[gridObj.getFrozenColumns()].field];
            setTimeout(done(), 100);
        });

        it('reorder column', (done: Function) => {
            let actionComplete = (args: NotifyArgs) => {
                if (args.requestType === 'reorder') {
                    let cols: Column[] = gridObj.getColumns();
                    let rowObjects: Row<Column>[] = gridObj.getRowsObject();
                    let vTblLength: number = gridObj.getHeaderContent().querySelectorAll('.e-virtualtable').length;
                    let mTblLength: number = gridObj.getMovableVirtualHeader().querySelectorAll('.e-virtualtable').length;
                    let vTrkLength: number = gridObj.getHeaderContent().querySelectorAll('.e-virtualtrack').length;
                    let mTrkLength: number = gridObj.getMovableVirtualHeader().querySelectorAll('.e-virtualtrack').length;
                    expect(vTblLength).toBe(2);
                    expect(mTblLength).toBe(1);
                    expect(vTrkLength).toBe(2);
                    expect(mTrkLength).toBe(1);

                    let cvTblLength: number = gridObj.getContent().querySelectorAll('.e-virtualtable').length;
                    let cmTblLength: number = gridObj.getMovableVirtualContent().querySelectorAll('.e-virtualtable').length;
                    let cvTrkLength: number = gridObj.getContent().querySelectorAll('.e-virtualtrack').length;
                    let cmTrkLength: number = gridObj.getMovableVirtualContent().querySelectorAll('.e-virtualtrack').length;
                    expect(cvTblLength).toBe(2);
                    expect(cmTblLength).toBe(1);
                    expect(cvTrkLength).toBe(2);
                    expect(cmTrkLength).toBe(1);
                    expect(cols[gridObj.getFrozenColumns()].field).toBe(fromCol);
                    expect(rowObjects[0].data[cols[gridObj.getFrozenColumns()].field]).toBe(fromColCellValue);
                    expect(rowObjects[0].data[cols[gridObj.getFrozenColumns() - 1].field]).toBe(toColCellValue);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.reorderColumns(fromCol, toCol);
        });

        it('ensure filterbar id', () => {
            let cols: Column[] = gridObj.getColumns();
            let firstCol: Column = cols[0];
            let filterbars: HTMLElement[] = [].slice.call(gridObj.getHeaderContent().querySelectorAll('input'));
            expect(fCol.field).toBe(cols[0].field);
            expect(filterbars[0].id).toBe(firstCol.headerText + '_filterBarcell');
            expect(filterbars[gridObj.getFrozenColumns()].id).toBe(cols[gridObj.getFrozenColumns()].headerText + '_filterBarcell');
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });
});
