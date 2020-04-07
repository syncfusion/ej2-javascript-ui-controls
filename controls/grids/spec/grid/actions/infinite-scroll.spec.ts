/**
 * Grid Infintie scroll spec document
 */
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { Edit } from '../../../src/grid/actions/edit';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { SortSettingsModel } from '../../../src/grid/base/grid-model';
import { Column } from '../../../src/grid/models/column';
import { createGrid, destroy, getKeyUpObj, getClickObj } from '../base/specutil.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { InfiniteScroll } from '../../../src/grid/actions/infinite-scroll';

Grid.Inject(Filter, Page, Selection, Group, Edit, Sort, Reorder, InfiniteScroll, Toolbar);

let virtualData: Object[] = [];
function virtualdataSource() {
    let names: string[] = ['VINET', 'TOMSP', 'HANAR', 'VICTE', 'SUPRD', 'HANAR', 'CHOPS', 'RICSU', 'WELLI', 'HILAA', 'ERNSH', 'CENTC',
        'OTTIK', 'QUEDE', 'RATTC', 'ERNSH', 'FOLKO', 'BLONP', 'WARTH', 'FRANK', 'GROSR', 'WHITC', 'WARTH', 'SPLIR', 'RATTC', 'QUICK', 'VINET',
        'MAGAA', 'TORTU', 'MORGK', 'BERGS', 'LEHMS', 'BERGS', 'ROMEY', 'ROMEY', 'LILAS', 'LEHMS', 'QUICK', 'QUICK', 'RICAR', 'REGGC', 'BSBEV',
        'COMMI', 'QUEDE', 'TRADH', 'TORTU', 'RATTC', 'VINET', 'LILAS', 'BLONP', 'HUNGO', 'RICAR', 'MAGAA', 'WANDK', 'SUPRD', 'GODOS', 'TORTU',
        'OLDWO', 'ROMEY', 'LONEP', 'ANATR', 'HUNGO', 'THEBI', 'DUMON', 'WANDK', 'QUICK', 'RATTC', 'ISLAT', 'RATTC', 'LONEP', 'ISLAT', 'TORTU',
        'WARTH', 'ISLAT', 'PERIC', 'KOENE', 'SAVEA', 'KOENE', 'BOLID', 'FOLKO', 'FURIB', 'SPLIR', 'LILAS', 'BONAP', 'MEREP', 'WARTH', 'VICTE',
        'HUNGO', 'PRINI', 'FRANK', 'OLDWO', 'MEREP', 'BONAP', 'SIMOB', 'FRANK', 'LEHMS', 'WHITC', 'QUICK', 'RATTC', 'FAMIA'];
    for (let i: number = 0; i < 1000; i++) {
        virtualData.push({
            'FIELD1': names[Math.floor(Math.random() * names.length)],
            'FIELD2': i,
            'FIELD3': i,
            'FIELD4': i === 0 ? 1 : Math.floor(Math.random() * 100),
            'FIELD5': i === 0 ? 2 : Math.floor(Math.random() * 2000),
            'FIELD6': i === 0 ? 3 : Math.floor(Math.random() * 1000),
            'FIELD7': i === 0 ? 4 : Math.floor(Math.random() * 100),
            'FIELD8': i,
            'FIELD9': i === 0 ? 6 : Math.floor(Math.random() * 10),
            'FIELD10': i === 0 ? 7 : Math.floor(Math.random() * 100),
            'FIELD11': i === 0 ? 8 : Math.floor(Math.random() * 100),
            'FIELD12': i,
            'FIELD13': i === 0 ? 10 : Math.floor(Math.random() * 10),
            'FIELD14': i === 0 ? 11 : Math.floor(Math.random() * 10),
            'FIELD15': i === 0 ? 12 : Math.floor(Math.random() * 1000),
            'FIELD16': i,
            'FIELD17': i === 0 ? 14 : Math.floor(Math.random() * 300),
            'FIELD18': i === 0 ? 15 : Math.floor(Math.random() * 400),
            'FIELD19': i,
            'FIELD20': i === 0 ? 17 : Math.floor(Math.random() * 700),
            'FIELD21': i === 0 ? 18 : Math.floor(Math.random() * 800),
            'FIELD22': i === 0 ? 19 : Math.floor(Math.random() * 1000),
            'FIELD23': i === 0 ? 20 : Math.floor(Math.random() * 2000),
            'FIELD24': i,
            'FIELD25': i === 0 ? 22 : Math.floor(Math.random() * 1000),
            'FIELD26': i === 0 ? 23 : Math.floor(Math.random() * 100),
            'FIELD27': i === 0 ? 24 : Math.floor(Math.random() * 400),
            'FIELD28': i,
            'FIELD29': i === 0 ? 26 : Math.floor(Math.random() * 500),
            'FIELD30': i === 0 ? 27 : Math.floor(Math.random() * 300),
        });
    }
}

virtualdataSource();

let filterColumn: Function = (gridObj: Grid, colName: string, value: string, keyCode?: number) => {
    let filterElement: any = gridObj.element.querySelector('[id=\'' + colName + '_filterBarcell\']');
    filterElement.value = value;
    filterElement.focus();
    (gridObj.filterModule as any).keyUpHandler(getKeyUpObj(keyCode ? keyCode : 13, filterElement));
};

let checkFilterObj: Function = (obj: any, field?: string,
    operator?: string, value?: string, predicate?: string, matchCase?: boolean): boolean => {
    let isEqual: boolean = true;
    if (field) {
        isEqual = isEqual && obj.field === field;
    }
    if (operator) {
        isEqual = isEqual && obj.operator === operator;
    }
    if (value) {
        isEqual = isEqual && obj.value === value;
    }
    if (matchCase) {
        isEqual = isEqual && obj.matchCase === matchCase;
    }
    return isEqual;
};

describe('Infinite scroll normal mode => ', () => {
    let gridObj: Grid;
    let actionComplete: (e?: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                allowFiltering: true,
                allowGrouping: true,
                allowSorting: true,
                enableInfiniteScrolling: true,
                pageSettings: { pageSize: 50 },
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                    { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                ]
            }, done);
    });
    it('initial render', () => {
        expect(gridObj.getRows().length).toBe(150);
        expect(parseInt(gridObj.getRows()[0].getAttribute('aria-rowindex'), 10)).toBe(0);
        expect(gridObj.getCurrentViewRecords().length).toBe(150);
        expect(gridObj.infiniteScrollSettings.enableCache).toBeFalsy();
        expect(gridObj.infiniteScrollSettings.initialBlocks).toBe(3);
        expect(gridObj.infiniteScrollSettings.maxBlocks).toBe(3);
        expect(Object.keys((gridObj.infiniteScrollModule as any).infiniteCache).length).toBe(0);
    });
    it('scroll bottom', (done: Function) => {
        gridObj.getContent().firstElementChild.scrollTop = 5550;
        setTimeout(done, 200);
    });
    it('scroll bottom', () => {
        expect(gridObj.getCurrentViewRecords().length).toBe(50);
        expect(parseInt(gridObj.getRows()[150].getAttribute('aria-rowindex'), 10)).toBe(150);
        expect(gridObj.getRows().length).toBe(200);
    });
    it('Filter string column testing', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(checkFilterObj(gridObj.filterSettings.columns[0], 'FIELD1', 'startswith', 'VINET', 'and', false)).toBeTruthy();
            expect(gridObj.getContent().firstElementChild.scrollTop).toBe(0);
            expect(gridObj.pageSettings.currentPage).toBe(1);
            gridObj.actionComplete = undefined;
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.dataBind();
        filterColumn(gridObj, 'FIELD1', 'VINET');
    });
    it('scroll bottom', (done: Function) => {
        gridObj.clearFiltering();
        gridObj.getContent().firstElementChild.scrollTop = 5550;
        setTimeout(done, 200);
    });
    it('Ensure caption rows', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.getContent().firstElementChild.scrollTop).toBe(0);
            gridObj.actionComplete = undefined;
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.dataBind();
        gridObj.groupModule.groupColumn('FIELD1');
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});


describe('Infinite scroll cache mode basic scroll => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableInfiniteScrolling: true,
                infiniteScrollSettings: { enableCache: true },
                pageSettings: { pageSize: 50 },
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                    { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                ]
            }, done);
    });
    it('Ensure page size', function () {
        let visibleRowsCount: number = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
        let rowElements: Element[] = gridObj.getRows();
        let rows: object[] = gridObj.getRowsObject();
        expect((gridObj.infiniteScrollModule as any).infiniteCache).not.toBe({});
        expect((gridObj.infiniteScrollModule as any).infiniteCache[4]).toBeUndefined();
        expect((gridObj.infiniteScrollModule as any).infiniteCache[3]).toBeDefined();
        expect(gridObj.getCurrentViewRecords().length).toBe(visibleRowsCount);
        expect(gridObj.getRows()[0].getAttribute('aria-rowindex')).toBe("0");
        expect(rowElements.length).toBe(visibleRowsCount);
        expect(rows.length).toBe(visibleRowsCount);
    });
    it('select row', function (done) {
        let rowSelected = function (args: any) {
            expect(gridObj.getSelectedRows()[0].getAttribute('aria-rowindex')).toBe('1');
            done();
        }
        gridObj.rowSelected = rowSelected;
        gridObj.selectRow(1);
    });
    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 5500;
        setTimeout(done, 200);
    });
    it('ensure rows count after scroll', function () {
        let totalRowsCount: number = gridObj.pageSettings.currentPage * gridObj.pageSettings.pageSize;
        let visibleRowsCount: number = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
        let rowElements: Element[] = gridObj.getRows();
        let rows: object[] = gridObj.getRowsObject();
        expect((gridObj.infiniteScrollModule as any).infiniteCache).not.toBe({});
        expect((gridObj.infiniteScrollModule as any).infiniteCache[4]).toBeDefined();
        expect(gridObj.getCurrentViewRecords().length).toBe(gridObj.pageSettings.pageSize);
        expect(rowElements[0].getAttribute('aria-rowindex')).toBe("50");
        expect(rowElements.length).toBe(visibleRowsCount);
        expect(rows.length).toBe(totalRowsCount);
        expect(gridObj.getSelectedRows()[0].getAttribute('aria-rowindex')).toBe('1');
        expect(gridObj.getRowByIndex(150)).toBe(gridObj.getRows()[100]);
        expect(gridObj.getRowByIndex(1)).toBeUndefined();
    });
    it('ensure row selection and methods after scroll', function(done: Function) {
        gridObj.on('append-infinite-content', function(){
            let visibleRowsCount: number = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
            expect((gridObj.infiniteScrollModule as any).infiniteCache).not.toBe({});
            expect((gridObj.infiniteScrollModule as any).infiniteCache[4]).toBeDefined();
            expect(gridObj.getSelectedRows()[0].getAttribute('aria-rowindex')).toBe('1');
            expect(gridObj.getRows()[1].getAttribute('aria-selected')).toBe('true');
            expect(gridObj.getRowByIndex(1)).toBe(gridObj.getRows()[1]);
            expect(gridObj.getRowByIndex(visibleRowsCount)).toBeUndefined();
            expect(gridObj.getRowByIndex((visibleRowsCount - 1))).toBe(gridObj.getRows()[(visibleRowsCount - 1)]);
        });
        setTimeout(done, 400);
    });
    it('scroll to top', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 0;
        setTimeout(done, 200);
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Infinite scroll cache mode compare with other features => ', () => {
    let gridObj: Grid;
    let sortSettings: SortSettingsModel;
    let cols: any
    let headers: any;
    let columns: Column[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableInfiniteScrolling: true,
                allowFiltering: true,
                allowSorting: true,
                allowReordering: true,
                toolbar: ['Search'],
                infiniteScrollSettings: { enableCache: true },
                pageSettings: { pageSize: 50 },
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                    { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                ]
            }, done);
    });
    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 5500;
        setTimeout(done, 200);
    });
    it('Single sort orderID asc testing', (done: Function) => {
        expect(gridObj.pageSettings.currentPage).not.toBe(1);
        let actionComplete = (args: any): any => {
            expect(cols[0].querySelectorAll('.e-ascending').length).toBe(1);
            expect(sortSettings.columns[0].field).toBe('FIELD2');
            expect(sortSettings.columns[0].direction).toBe('Ascending');
            expect(gridObj.getContent().firstElementChild.scrollTop).toBe(0);
            expect(gridObj.pageSettings.currentPage).toBe(1);
            expect((gridObj.infiniteScrollModule as any).infiniteCache[4]).toBeUndefined();
            expect((gridObj.infiniteScrollModule as any).infiniteCache[3]).toBeDefined();
            expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toBe(0);
            done();
        };
        let actionBegin = (args: any): any => {
            expect(args.target).not.toBeNull();
        };
        gridObj.actionBegin = actionBegin;
        gridObj.actionComplete = actionComplete;
        sortSettings = gridObj.sortSettings;
        cols = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
        (gridObj as any).mouseClickHandler(getClickObj(cols[0]));
    });
    it('scroll to bottom', (done: Function) => {
        gridObj.getContent().firstElementChild.scrollTop = 5550;
        setTimeout(done, 200);
    });
    it('Reorder Column method testing', (done: Function) => {
        let dataBound = (args: Object): void => {
            columns = gridObj.getColumns() as Column[];
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(gridObj.getContent().firstElementChild.scrollTop).toBe(0);
            expect(gridObj.pageSettings.currentPage).toBe(1);
            expect((gridObj.infiniteScrollModule as any).infiniteCache[4]).toBeUndefined();
            expect((gridObj.infiniteScrollModule as any).infiniteCache[3]).toBeDefined();
            expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('FIELD2');
            expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('FIELD3');
            expect(headers[2].querySelector('.e-headercelldiv').textContent).toBe('FIELD1');
            expect(columns[0].field).toBe('FIELD2');
            expect(columns[1].field).toBe('FIELD3');
            expect(columns[2].field).toBe('FIELD1');
            gridObj.dataBound = undefined;
            done();
        };
        gridObj.dataBound = dataBound;
        gridObj.dataBind();
        gridObj.reorderColumns('FIELD1', 'FIELD3');
    });
    it('scroll to bottom', (done: Function) => {
        gridObj.getContent().firstElementChild.scrollTop = 5550;
        setTimeout(done, 200);
    });
    it('ensure scroll position after filtering', function(done){
        let actionComplete = (args?: Object): void => {
            expect(checkFilterObj(gridObj.filterSettings.columns[0], 'FIELD1', 'startswith', 'VINET', 'and', false)).toBeTruthy();
            expect(gridObj.getContent().firstElementChild.scrollTop).toBe(0);
            expect(gridObj.pageSettings.currentPage).toBe(1);
            expect((gridObj.infiniteScrollModule as any).infiniteCache[4]).toBeUndefined();
            expect((gridObj.infiniteScrollModule as any).infiniteCache[3]).toBeDefined();
            gridObj.actionComplete = undefined;
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.dataBind();
        filterColumn(gridObj, 'FIELD1', 'VINET');
    });
    it('clear filter', (done: Function) => {
        let actionComplete = (args?: Object): void => {
            expect(gridObj.filterSettings.columns.length).toBe(0);
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.clearFiltering();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Infinite scroll cache mode grouping => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableInfiniteScrolling: true,
                allowGrouping: true,
                infiniteScrollSettings: { enableCache: true },
                pageSettings: { pageSize: 50 },
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                    { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                ]
            }, done);
    });
    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 5500;
        setTimeout(done, 200);
    });
    it('Ensure caption rows', (done: Function) => {
        let actionComplete = (args?: Object): void => {
            let initalRows: number = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
            let rowElements: Element[] = gridObj.getRows();
            expect(gridObj.getContent().firstElementChild.scrollTop).toBe(0);
            expect(rowElements.length).toBe(initalRows);
            expect(gridObj.getContent().querySelectorAll('tr:not(.e-row)').length).not.toBe(0);
            expect(gridObj.getRowByIndex((initalRows - 1))).toBe(rowElements[rowElements.length - 1]);
            expect(gridObj.getRowByIndex(initalRows)).toBeUndefined();
            gridObj.actionComplete = undefined;
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.dataBind();
        gridObj.groupModule.groupColumn('FIELD1');
    });
    it('ensure row selection and methods after scroll', function (done) {
        gridObj.on('append-infinite-content', function () {
            expect(gridObj.getRowByIndex(1)).toBeUndefined();
            expect(gridObj.getRowByIndex(150)).toBe(gridObj.getRows()[100]);
            expect(gridObj.getRows()[0].getAttribute('aria-rowindex')).toBe('50');
        });
        setTimeout(done, 400);
    });
    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 10000;
        setTimeout(done, 600);
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});


describe('Infinite scroll cache mode scroll settings property check => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableInfiniteScrolling: true,
                allowGrouping: true,
                infiniteScrollSettings: { enableCache: true, initialBlocks: 5, maxBlocks: 6 },
                pageSettings: { pageSize: 50 },
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                    { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                ]
            }, done);
    });
    it('Ensure rows count at initial rendering', function () {
        let initialRowsCount: number = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
        let rowElements: Element[] = gridObj.getRows();
        expect(rowElements.length).toBe(initialRowsCount);
        expect((gridObj.infiniteScrollModule as any).infiniteCache[5]).toBeDefined();
        expect((gridObj.infiniteScrollModule as any).infiniteCache[6]).toBeUndefined();
    });
    it('Ensure rows count at initial rendering', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 10000;
        setTimeout(done, 200);
    });
    it('Ensure rows count after first scroll', function () {
        let initialRowsCount: number = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
        let rowElements: Element[] = gridObj.getRows();
        let value: number = (initialRowsCount + gridObj.pageSettings.pageSize) - 1;
        expect(rowElements.length).toBe(initialRowsCount + gridObj.pageSettings.pageSize);
        expect(rowElements[0].getAttribute('aria-rowindex')).toBe('0');
        expect(parseInt(rowElements[rowElements.length - 1].getAttribute('aria-rowindex'))).toBe(value);
        expect((gridObj.infiniteScrollModule as any).infiniteCache[6]).toBeDefined();
        expect((gridObj.infiniteScrollModule as any).infiniteCache[7]).toBeUndefined();
    });
    it('Ensure rows count at initial rendering', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 15000;
        setTimeout(done, 200);
    });
    it('Ensure rows count after second scroll', function () {
        let initialRowsCount: number = gridObj.infiniteScrollSettings.maxBlocks * gridObj.pageSettings.pageSize;
        let rowElements: Element[] = gridObj.getRows();
        expect(rowElements.length).toBe(initialRowsCount);
        expect(rowElements[0].getAttribute('aria-rowindex')).toBe('50');
        expect(rowElements[rowElements.length - 1].getAttribute('aria-rowindex')).toBe('349');
        expect((gridObj.infiniteScrollModule as any).infiniteCache[7]).toBeDefined();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

    describe('Infinite scroll cache mode scroll max block property => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: virtualData,
                    enableInfiniteScrolling: true,
                    allowGrouping: true,
                    infiniteScrollSettings: { enableCache: true, initialBlocks: 5, maxBlocks: 4 },
                    pageSettings: { pageSize: 50 },
                    height: 400,
                    columns: [
                        { field: 'FIELD2', headerText: 'FIELD2', width: 120 },
                        { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                        { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                        { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                        { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                    ]
                }, done);
        });
        it('Ensure rows count at initial rendering', function () {
            let initialRowsCount: number = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
            let rowElements: Element[] = gridObj.getRows();
            expect(gridObj.infiniteScrollSettings.initialBlocks).toBe(gridObj.infiniteScrollSettings.maxBlocks);
            expect(rowElements.length).toBe(initialRowsCount);
        });
        it('scroll to bottom', function (done) {
            gridObj.getContent().firstElementChild.scrollTop = 15000;
            setTimeout(done, 200);
        });
        it('Ensure rows count after scroll', function () {
            let initialRowsCount: number = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
            let rowElements: Element[] = gridObj.getRows();
            let value: number = (initialRowsCount + gridObj.pageSettings.pageSize) - 1;
            expect(rowElements.length).toBe(initialRowsCount);
            expect(parseInt(rowElements[0].getAttribute('aria-rowindex'))).toBe(gridObj.pageSettings.pageSize);
            expect(parseInt(rowElements[rowElements.length - 1].getAttribute('aria-rowindex'))).toBe((value));
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
});