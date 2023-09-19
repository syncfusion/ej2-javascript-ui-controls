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
import { Aggregate } from '../../../src/grid/actions/aggregate';
import { SortSettingsModel } from '../../../src/grid/base/grid-model';
import { Column } from '../../../src/grid/models/column';
import { createGrid, destroy, getKeyUpObj, getClickObj } from '../base/specutil.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { InfiniteScroll } from '../../../src/grid/actions/infinite-scroll';
import { RowSelectEventArgs, NotifyArgs } from '../../../src/grid/base/interface';
import { select } from '@syncfusion/ej2-base';
import { infiniteGroupData } from '../../../spec/grid/base/datasource.spec';
import { CommandColumn } from '../../../src/grid/actions/command-column';

Grid.Inject(Filter, Page, Selection, Group, Edit, Sort, Reorder, InfiniteScroll, Toolbar, CommandColumn, Aggregate);

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
        expect(parseInt(gridObj.getRows()[0].getAttribute('data-rowindex'), 10)).toBe(0);
        expect(gridObj.getCurrentViewRecords().length).toBe(150);
        expect(gridObj.infiniteScrollSettings.enableCache).toBeFalsy();
        expect(gridObj.infiniteScrollSettings.initialBlocks).toBe(3);
        expect(gridObj.infiniteScrollSettings.maxBlocks).toBe(3);
        expect(Object.keys((gridObj.infiniteScrollModule as any).infiniteCache).length).toBe(0);
        expect(Object.keys((gridObj.infiniteScrollModule as any).infiniteCurrentViewData).length).toBe(gridObj.infiniteScrollSettings.initialBlocks);
    });
    it('scroll bottom', (done: Function) => {
        gridObj.getContent().firstElementChild.scrollTop = 5550;
        setTimeout(done, 200);
    });
    it('scroll bottom', () => {
        //expect(gridObj.getCurrentViewRecords().length).toBe(200);
        expect(parseInt(gridObj.getRows()[150].getAttribute('data-rowindex'), 10)).toBe(150);
        expect(gridObj.getRows().length).toBe(200);
        expect(Object.keys((gridObj.infiniteScrollModule as any).infiniteCurrentViewData).length).toBe(gridObj.infiniteScrollSettings.initialBlocks + 1);
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
        expect(gridObj.getRows()[0].getAttribute('data-rowindex')).toBe("0");
        expect(rowElements.length).toBe(visibleRowsCount);
        expect(rows.length).toBe(visibleRowsCount);
    });
    it('select row', function (done) {
        let rowSelected = function (args: any) {
            expect(gridObj.getSelectedRows()[0].getAttribute('data-rowindex')).toBe('1');
            done();
        }
        gridObj.rowSelected = rowSelected;
        gridObj.selectRow(1);
    });
    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 5500;
        setTimeout(done, 400);
    });
    it('ensure rows count after scroll', function () {
        let totalRowsCount: number = gridObj.pageSettings.currentPage * gridObj.pageSettings.pageSize;
        let visibleRowsCount: number = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
        let rowElements: Element[] = gridObj.getRows();
        let rows: object[] = gridObj.getRowsObject();
        expect((gridObj.infiniteScrollModule as any).infiniteCache).not.toBe({});
        expect((gridObj.infiniteScrollModule as any).infiniteCache[4]).toBeDefined();
        expect(gridObj.getCurrentViewRecords().length).toBe(visibleRowsCount);
        expect(rowElements[0].getAttribute('data-rowindex')).toBe("50");
        expect(rowElements.length).toBe(visibleRowsCount);
        expect(rows.length).toBe(totalRowsCount);
        expect(gridObj.getSelectedRows()[0].getAttribute('data-rowindex')).toBe('1');
        expect(gridObj.getRowByIndex(150)).toBe(gridObj.getRows()[100]);
        expect(gridObj.getRowByIndex(1)).toBeUndefined();
    });
    it('ensure row selection and methods after scroll', function(done: Function) {
        gridObj.on('append-infinite-content', function(){
            let visibleRowsCount: number = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
            expect((gridObj.infiniteScrollModule as any).infiniteCache).not.toBe({});
            expect((gridObj.infiniteScrollModule as any).infiniteCache[4]).toBeDefined();
            expect(gridObj.getSelectedRows()[0].getAttribute('data-rowindex')).toBe('1');
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
            expect(gridObj.getRows()[0].getAttribute('data-rowindex')).toBe('50');
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
        expect(rowElements[0].getAttribute('data-rowindex')).toBe('0');
        expect(parseInt(rowElements[rowElements.length - 1].getAttribute('data-rowindex'))).toBe(value);
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
        expect(rowElements[rowElements.length - 1].getAttribute('data-rowindex')).toBe('349');
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
            expect(parseInt(rowElements[0].getAttribute('data-rowindex'))).toBe(gridObj.pageSettings.pageSize);
            expect(parseInt(rowElements[rowElements.length - 1].getAttribute('data-rowindex'))).toBe((value));
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
});

describe('Infinite scroll with frozen columns => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableInfiniteScrolling: true,
                frozenColumns: 2,
                pageSettings: { pageSize: 50 },
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                    { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                ]
            }, () => {
                setTimeout(done, 200);
            });
    });

    it('ensure intinial rendering rows count', () => {
        let visibleRowsCount: number = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
        expect(gridObj.getRows().length).toBe(visibleRowsCount);
        expect((gridObj as any).contentModule.rowElements.length).toBe(visibleRowsCount);
    });

    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 15000;
        setTimeout(done, 400);
    });

    it('ensure rows count after scroll', () => {
        let visibleRowsCount: number = gridObj.pageSettings.currentPage * gridObj.pageSettings.pageSize;
        expect(gridObj.getRows().length).toBe(visibleRowsCount);
        expect((gridObj as any).contentModule.rowElements.length).toBe(visibleRowsCount);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Infinite scroll with frozen rows => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableInfiniteScrolling: true,
                frozenRows: 2,
                pageSettings: { pageSize: 50 },
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                    { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                ]
            }, () => {
                setTimeout(done, 200);
            });
    });

    it('ensure intinial rendering rows count', () => {
        let visibleRowsCount: number = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
        let rows: Element[] = [].slice.call(gridObj.getContent().querySelectorAll('.e-row'));
        let frozenRows: Element[] = [].slice.call(gridObj.getHeaderContent().querySelectorAll('.e-row'));
        expect(rows.length).toBe(visibleRowsCount - gridObj.frozenRows);
        expect(frozenRows.length).toBe(gridObj.frozenRows);
        expect(gridObj.getRows().length).toBe(visibleRowsCount);
    });

    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 15000;
        setTimeout(done, 200);
    });

    it('ensure rows count after scroll', () => {
        let visibleRowsCount: number = gridObj.pageSettings.currentPage * gridObj.pageSettings.pageSize;
        let rows: Element[] = [].slice.call(gridObj.getContent().querySelectorAll('.e-row'));
        let frozenRows: Element[] = [].slice.call(gridObj.getHeaderContent().querySelectorAll('.e-row'));
        expect(frozenRows.length).toBe(gridObj.frozenRows);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Infinite scroll cache mode with frozen columns => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableInfiniteScrolling: true,
                infiniteScrollSettings: { enableCache: true },
                frozenColumns: 2,
                pageSettings: { pageSize: 50 },
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                    { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                ]
            }, () => {
                setTimeout(done, 200);
            });
    });

    it('ensure intinial rendering rows count', () => {
        let visibleRowsCount: number = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
        expect((gridObj as any).contentModule.rowElements.length).toBe(visibleRowsCount);
        expect(gridObj.getRows().length).toBe(visibleRowsCount);
    });

    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 15000;
        setTimeout(done, 200);
    });

    it('ensure rows count after scroll', () => {
        let visibleRowsCount: number = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
        expect(gridObj.getRows().length).toBe(visibleRowsCount);
        expect((gridObj as any).contentModule.rowElements.length).toBe(visibleRowsCount);
        expect(gridObj.getRows()[0].getAttribute('data-rowindex')).toBe(gridObj.pageSettings.pageSize.toString());
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});


describe('Infinite scroll cache mode with frozen rows => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableInfiniteScrolling: true,
                frozenRows: 2,
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

    it('ensure intinial rendering rows count', () => {
        let visibleRowsCount: number = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
        let rows: Element[] = [].slice.call(gridObj.getContent().querySelectorAll('.e-row'));
        let frozenRows: Element[] = [].slice.call(gridObj.getHeaderContent().querySelectorAll('.e-row'));
        expect(rows.length).toBe(visibleRowsCount - gridObj.frozenRows);
        expect(frozenRows.length).toBe(gridObj.frozenRows);
        expect(gridObj.getRows().length).toBe(visibleRowsCount);
    });

    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 15000;
        setTimeout(done, 200);
    });

    it('ensure rows count after scroll', () => {
        let visibleRowsCount: number = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
        let rows: Element[] = [].slice.call(gridObj.getContent().querySelectorAll('.e-row'));
        let frozenRows: Element[] = [].slice.call(gridObj.getHeaderContent().querySelectorAll('.e-row'));
        expect(frozenRows.length).toBe(gridObj.frozenRows);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Infinite scroll cache mode with frozen rows => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableInfiniteScrolling: true,
                frozenColumns: 2,
                frozenRows: 2,
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
            }, () => {
                setTimeout(done, 200);
            });
    });

    it('ensure intinial rendering rows count', () => {
        let visibleRowsCount: number = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
        let contentRows: Element[] = [].slice.call(gridObj.getContent().querySelectorAll('.e-row'));
        let hdrRows: Element[] = [].slice.call(gridObj.getHeaderContent().querySelectorAll('.e-row'));
        expect(contentRows.length).toBe(visibleRowsCount - gridObj.frozenRows);
        expect(hdrRows.length).toBe(gridObj.frozenRows);
        expect(gridObj.getRows().length).toBe(visibleRowsCount);
        expect((gridObj as any).contentModule.rowElements.length).toBe(visibleRowsCount);
        // expect((gridObj as any).infiniteScrollModule.infiniteCache[1][0].length).toBe(gridObj.pageSettings.pageSize);
        // expect((gridObj as any).infiniteScrollModule.infiniteCache[1][1].length).toBe(gridObj.pageSettings.pageSize);
        expect(contentRows[0].getAttribute('data-rowindex')).toBe(gridObj.frozenRows.toString());
        expect(contentRows[contentRows.length - 1].getAttribute('data-rowindex')).toBe((visibleRowsCount - 1).toString());
        expect(hdrRows[0].getAttribute('data-rowindex')).toBe('0');
    });

    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 15000;
        setTimeout(done, 200);
    });

    it('ensure rows count after scroll', () => {
        let visibleRowsCount: number = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
        let contentRows: Element[] = [].slice.call(gridObj.getContent().querySelectorAll('.e-row'));
        let hdrRows: Element[] = [].slice.call(gridObj.getHeaderContent().querySelectorAll('.e-row'));
        expect(contentRows.length).toBe(visibleRowsCount);
        expect(hdrRows.length).toBe(gridObj.frozenRows);
        expect(gridObj.getRows().length).toBe(visibleRowsCount + gridObj.frozenRows);
        expect((gridObj as any).contentModule.rowElements.length).toBe(visibleRowsCount + gridObj.frozenRows);
        expect(contentRows[0].getAttribute('data-rowindex')).toBe(gridObj.pageSettings.pageSize.toString());
        // expect((gridObj as any).infiniteScrollModule.infiniteCache[4][0].length).toBe(gridObj.pageSettings.pageSize);
        // expect((gridObj as any).infiniteScrollModule.infiniteCache[4][1].length).toBe(gridObj.pageSettings.pageSize);
        expect(contentRows[contentRows.length - 1].getAttribute('data-rowindex')).toBe(((visibleRowsCount + gridObj.pageSettings.pageSize) - 1).toString());
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-40801 - Infinite scrolling is not working properly while enabling editSettings => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData.slice(0, 150),
                enableInfiniteScrolling: true,
                pageSettings: { pageSize: 50 },
                editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', isPrimaryKey: true, width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                    { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                ]
            }, () => {
                setTimeout(done, 200);
            });
    });
    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 15000;
        setTimeout(done, 200);
    });
    it('check no records to display issue  while scroll', function () {
        let visibleRowsCount = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
        let rows = gridObj.element.querySelectorAll('.e-row');
        expect(visibleRowsCount).toBe(rows.length);
        expect(gridObj.pageSettings.currentPage).toBe(gridObj.infiniteScrollSettings.initialBlocks);
    });
    it('select row', function (done: Function) {
        let rowSelected = function(args: RowSelectEventArgs) {
            gridObj.rowSelected = null;
            done();
        }
        gridObj.rowSelected = rowSelected;
        gridObj.selectRow(1);
    });
    it('check no records to display issue  while delete', function (done: Function) {
        let actionComplete = function (args: NotifyArgs) {
            let visibleRowsCount = gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize;
            let rows = gridObj.element.querySelectorAll('.e-row');
            expect(visibleRowsCount - 1).toBe(rows.length);
            gridObj.actionComplete = null;
            done();
        }
        gridObj.actionComplete = actionComplete;
        gridObj.deleteRecord();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Infinite scroll normal mode with edit feature teating => ', () => {
    let gridObj: Grid;
    let data1: Object; let data2; let rowindex = 1;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableInfiniteScrolling: true,
                pageSettings: { pageSize: 50 },
                editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', isPrimaryKey: true, width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                    { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                ]
            }, () => {
                setTimeout(done, 200);
            });
    });
    it('collect row data before editing', function(done: Function){
        data1 = gridObj.dataSource[rowindex];
        let rowSelected = function(args: RowSelectEventArgs) {
            expect(gridObj.getSelectedRecords()[0][(gridObj.columns[1] as Column).field]).toBe(data1[(gridObj.columns[1] as Column).field]);
            gridObj.rowSelected = null;
            done();
        }
        gridObj.rowSelected = rowSelected;
        gridObj.selectRow(rowindex);
    });
    it('start edit', function (done: Function) {
        let actionComplete = function (args: NotifyArgs) {
            if (args.requestType === 'beginEdit') {
                expect((gridObj.editModule as any).editModule.editRowIndex).toBe(rowindex);
                expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                let cells = gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
                expect(cells.length).toBe(gridObj.columns.length);
                //primary key check
                expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(1);
                //focus check
                expect(document.activeElement.id).toBe(gridObj.element.id + (gridObj.columns[rowindex] as Column).field);
                //toolbar status check
                expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.actionComplete = null;
                done();
            }
        }
        let actionBegin = function (args: NotifyArgs) {
            if (args.requestType === 'beginEdit') {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.actionBegin = null;
            }
        }
        gridObj.actionBegin = actionBegin;
        gridObj.actionComplete = actionComplete;
        gridObj.startEdit();
    });
    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 15000;
        setTimeout(done, 200);
    });
    it('Ensure grid edit form after scroll', function(done: Function){
        (select('#' + gridObj.element.id + (gridObj.columns[rowindex] as Column).field, gridObj.element) as any).value = 'updated';
        expect(gridObj.element.querySelectorAll('form').length).toBe(1);
        expect((gridObj as any).infiniteScrollModule.editRowIndex).toBe(rowindex);
        expect(Object.keys((gridObj as any).infiniteScrollModule.virtualInfiniteData).length).toBe(0);
        let actionComplete = function(args: NotifyArgs) {
            if (args.requestType === 'save') {
                expect(gridObj.dataSource[rowindex][(gridObj.columns[rowindex] as Column).field]).toBe('updated');
                gridObj.actionComplete = null;
                done();
            }
        }
        gridObj.actionComplete = actionComplete;
        gridObj.endEdit();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Infinite scroll normal mode with edit feature teating => ', () => {
    let gridObj: Grid;
    let dataLength = virtualData.length; let data1: number;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableInfiniteScrolling: true,
                pageSettings: { pageSize: 50 },
                editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', isPrimaryKey: true, width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                    { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                ]
            }, () => {
                setTimeout(done, 200);
            });
    });
    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 15000;
        setTimeout(done, 200);
    });
    it('start add', function (done: Function) {
        let actionBegin = function (args: NotifyArgs) {
            if (args.requestType === 'add') {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.actionBegin = null;
            }
        }
        let actionComplete = function (args: NotifyArgs) {
            if (args.requestType === 'add') {
                expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                let cells = gridObj.element.querySelector('.e-addedrow').querySelectorAll('.e-rowcell');
                expect(cells.length).toBe(gridObj.columns.length);
                //primary key check
                expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(0);
                //focus check
                expect(document.activeElement.id).toBe(gridObj.element.id + (gridObj.columns[0] as Column).field);
                //toolbar status check
                expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
                expect(gridObj.isEdit).toBeTruthy();
                expect(gridObj.getContent().firstElementChild.scrollTop).toBe(0);
                data1 = gridObj.dataSource[199][(gridObj.columns[0] as Column).field];
                gridObj.actionComplete = null;
                done();
            }
        };
        gridObj.actionBegin = actionBegin;
        gridObj.actionComplete = actionComplete;
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
    });
    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 15000;
        setTimeout(done, 200);
    });
    it('Save add', function(done: Function){
        let actionComplete = function(args: NotifyArgs) {
            if (args.requestType === 'save') {
                expect(gridObj.dataSource[0][(gridObj.columns[0] as Column).field]).toBe(897654);
                expect(gridObj.dataSource[0][(gridObj.columns[1] as Column).field]).toBe('updated');
                expect((gridObj.dataSource as any).length).toBe(dataLength + 1);
                expect(gridObj.isEdit).toBeFalsy();
                expect(gridObj.dataSource[199][(gridObj.columns[0] as Column).field]).not.toBe(data1);
                expect(gridObj.dataSource[199][(gridObj.columns[0] as Column).field]).toBe(data1 - 1);
                expect((gridObj.element.querySelector('.e-row')as any).getAttribute('data-rowindex')).toBe('0');
                gridObj.actionComplete = null;
                done();
            }
        };
        expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
        (select('#' + gridObj.element.id + (gridObj.columns[0] as Column).field, gridObj.element) as any).value = 897654;
        (select('#' + gridObj.element.id + (gridObj.columns[1] as Column).field, gridObj.element) as any).value = 'updated';
        let beforeDataBound = function(args: any) {
            expect(args.result.length).toBe(1);
            expect(args.result[0][(gridObj.columns[0] as Column).field]).toBe(897654);
            gridObj.beforeDataBound = null;
        };
        gridObj.beforeDataBound = beforeDataBound;
        gridObj.actionComplete = actionComplete;
        (gridObj.editModule as any).editModule.endEdit();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Infinite scroll normal mode with edit feature teating => ', () => {
    let gridObj: Grid;
    let dataLength = virtualData.length; let data1: number; let data2: number; let rowIndex: number = 149; let scrollTop: number;
    let rowsCount: number;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableInfiniteScrolling: true,
                pageSettings: { pageSize: 50 },
                editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', isPrimaryKey: true, width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                    { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                ]
            }, () => {
                setTimeout(done, 200);
            });
    });
    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 15000;
        setTimeout(done, 200);
    });
    it('select row for delete', function(done: Function){
        let rowSelected = function(args: RowSelectEventArgs) {
            scrollTop = gridObj.getContent().firstElementChild.scrollTop;
            rowsCount = (gridObj.element.querySelectorAll('.e-row') as any).length;
            data1 = gridObj.dataSource[rowIndex][(gridObj.columns[0] as Column).field];
            data2 = gridObj.dataSource[199][(gridObj.columns[0] as Column).field];
            gridObj.rowSelected = null;
            done();
        }
        gridObj.rowSelected = rowSelected;
        gridObj.selectRow(rowIndex);
    });
    it('delete record', function(done: Function){
        let actionComplete = function(args: NotifyArgs) {
            if (args.requestType === 'delete') {
                expect((gridObj.dataSource as any).length).toBe(dataLength - 1);
                expect((gridObj.element.querySelectorAll('.e-row') as any).length).toBe(rowsCount);
                expect((gridObj.element.querySelectorAll('.e-row')[rowIndex] as any).getAttribute('data-rowindex')).toBe(rowIndex.toString());
                expect(gridObj.dataSource[rowIndex][(gridObj.columns[0] as Column).field]).toBe(data1 + 1);
                expect(gridObj.dataSource[199][(gridObj.columns[0] as Column).field]).toBe(data2 + 1);
                expect(gridObj.getContent().firstElementChild.scrollTop).toBe(scrollTop);
                gridObj.actionComplete = null;
                done();
            }
        }
        let beforeDataBound = function(args: any) {
            expect(args.result.length).toBe(1);
            expect(args.result[0][(gridObj.columns[0] as Column).field]).toBe(200);
        }
        gridObj.beforeDataBound = beforeDataBound;
        gridObj.actionComplete = actionComplete;
        gridObj.deleteRecord();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Infinite scroll cache mode with edit feature teating => ', () => {
    let gridObj: Grid;
    let rowindex = 149;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableInfiniteScrolling: true,
                infiniteScrollSettings: { enableCache: true },
                pageSettings: { pageSize: 50 },
                editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', isPrimaryKey: true, width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                    { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                ]
            }, () => {
                setTimeout(done, 200);
            });
    });
    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 15000;
        setTimeout(done, 200);
    });
    it('collect row data before editing', function(done: Function){
        let rowSelected = function(args: RowSelectEventArgs) {
            gridObj.rowSelected = null;
            done();
        }
        gridObj.rowSelected = rowSelected;
        gridObj.selectRow(rowindex);
    });
    it('start edit', function (done: Function) {
        let actionComplete = function (args: NotifyArgs) {
            if (args.requestType === 'beginEdit') {
                expect((gridObj.editModule as any).editModule.editRowIndex).toBe(rowindex);
                expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                let cells = gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
                expect(cells.length).toBe(gridObj.columns.length);
                //primary key check
                expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(1);
                //focus check
                expect(document.activeElement.id).toBe(gridObj.element.id + (gridObj.columns[1] as Column).field);
                //toolbar status check
                expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
                expect(gridObj.isEdit).toBeTruthy();
                expect((select('#' + gridObj.element.id + (gridObj.columns[1] as Column).field, gridObj.element) as any).value).toBe(gridObj.dataSource[rowindex][(gridObj.columns[1] as Column).field]);
                (select('#' + gridObj.element.id + (gridObj.columns[1] as Column).field, gridObj.element) as any).value = 'updated';
                gridObj.actionComplete = null;
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.startEdit();
    });
    it('Save edit', function(done: Function){
        let actionComplete = function(args: NotifyArgs) {
            if (args.requestType === 'save') {
                expect(gridObj.dataSource[rowindex][(gridObj.columns[1] as Column).field]).toBe('updated');
                gridObj.actionComplete = null;
                done();
            }
        };
        gridObj.actionComplete =actionComplete;
        gridObj.endEdit();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-66529 - New record ID undefined on Infinite Scroll Grid => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableInfiniteScrolling: true,
                infiniteScrollSettings: { initialBlocks: 1, enableCache: true },
                editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', isPrimaryKey: true, width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100, defaultValue: "9999", visible: false },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                    { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                ]
            }, () => {
                setTimeout(done, 200);
            });
    });
    it('start add action and check add action complete default value', (done: Function) => {
        function actionComplete(args: any) {
            if(args.requestType === 'add') {
                expect(args.data['FIELD1']).toBe("9999");
                done();
            }
        }
        gridObj.actionComplete = actionComplete;
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
    });
    it('start save action and check save action begin default value', function (done: Function) {
        function actionBegin(args: any) {
            if(args.requestType === 'save') {
                expect(args.data['FIELD1']).toBe("9999");
                done();
            }
        }
        gridObj.actionBegin = actionBegin;
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Infinite scroll cache mode with edit feature teating => ', () => {
    let gridObj: Grid;
    let dataLength = virtualData.length; let data1: number;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableInfiniteScrolling: true,
                infiniteScrollSettings: { enableCache: true },
                pageSettings: { pageSize: 50 },
                editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', isPrimaryKey: true, width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                    { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                ]
            }, () => {
                setTimeout(done, 200);
            });
    });
    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 15000;
        setTimeout(done, 200);
    });
    it('start add', function (done: Function) {
        let actionComplete = function (args: NotifyArgs) {
            if (args.requestType === 'add') {
                expect(gridObj.pageSettings.currentPage).toBe(1);
                expect(gridObj.getContent().firstElementChild.scrollTop).toBe(0);
                expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                let cells = gridObj.element.querySelector('.e-addedrow').querySelectorAll('.e-rowcell');
                expect(cells.length).toBe(gridObj.columns.length);
                //primary key check
                expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(0);
                //focus check
                expect(document.activeElement.id).toBe(gridObj.element.id + (gridObj.columns[0] as Column).field);
                //toolbar status check
                expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.actionComplete = null;
                done();
            }
        }
        gridObj.actionComplete = actionComplete;
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
    });
    it('Save edit', function(done: Function){
        let actionComplete = function(args: NotifyArgs) {
            if (args.requestType === 'save') {
                expect(gridObj.dataSource[0][(gridObj.columns[0] as Column).field]).toBe(897654);
                expect(gridObj.dataSource[0][(gridObj.columns[1] as Column).field]).toBe('updated');
                expect((gridObj.dataSource as any).length).toBe(dataLength + 1);
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.actionComplete = null;
                done();
            }
        };
        expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
        (select('#' + gridObj.element.id + (gridObj.columns[0] as Column).field, gridObj.element) as any).value = 897654;
        (select('#' + gridObj.element.id + (gridObj.columns[1] as Column).field, gridObj.element) as any).value = 'updated';
        gridObj.actionComplete = actionComplete;
        (gridObj.editModule as any).editModule.endEdit();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Infinite scroll normal mode with edit feature teating => ', () => {
    let gridObj: Grid;
    let dataLength = virtualData.length; let data1: number; let rowIndex: number = 149; let scrollTop: number;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableInfiniteScrolling: true,
                pageSettings: { pageSize: 50 },
                editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', isPrimaryKey: true, width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                    { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                ]
            }, () => {
                setTimeout(done, 200);
            });
    });
    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 15000;
        setTimeout(done, 200);
    });
    it('select row for delete', function(done: Function){
        let rowSelected = function(args: RowSelectEventArgs) {
            scrollTop = gridObj.getContent().firstElementChild.scrollTop;
            data1 = gridObj.dataSource[rowIndex][(gridObj.columns[0] as Column).field];
            gridObj.rowSelected = null;
            done();
        }
        gridObj.rowSelected = rowSelected;
        gridObj.selectRow(rowIndex);
    });
    it('delete record', function(done: Function){
        let actionComplete = function(args: NotifyArgs) {
            if (args.requestType === 'delete') {
                expect((gridObj.dataSource as any).length).toBe(dataLength - 1);
                expect(gridObj.dataSource[rowIndex][(gridObj.columns[0] as Column).field]).toBe(data1 + 1);
                expect(gridObj.getContent().firstElementChild.scrollTop).toBe(scrollTop);
                gridObj.actionComplete = null;
                done();
            }
        }
        gridObj.actionComplete = actionComplete;
        gridObj.deleteRecord();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-42591-Infinite scroll with grouping => ', () => {
    let gridObj: Grid;
    let actionComplete: (e?: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: [{ 'FIELD2': '10001', 'FIELD1': 'Test' }, { 'FIELD2': '10002', 'FIELD1': 'Test' }],
                enableInfiniteScrolling: true,
                allowGrouping: true,
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', isPrimaryKey: true, width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                ]
            }, () => {
                setTimeout(done, 200);
            });
    });
    it('Grouping the FIELD1 column',(done: Function)  => {
        actionComplete = function (args) {
            expect(gridObj.element.querySelectorAll('.e-groupcaption').length).toBe(1);
            gridObj.actionComplete=null;
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.groupColumn('FIELD1');
    });
    it('unGrouping the FIELD1 column',(done: Function) => {
        actionComplete = function (args) {
            expect(gridObj.element.querySelectorAll('.e-groupcaption').length).toBe(0);
            gridObj.actionComplete=null;
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.ungroupColumn('FIELD1');
    });
    it('Grouping the FIELD1 column',(done: Function) => {
        actionComplete = function (args) {
            expect(gridObj.element.querySelectorAll('.e-groupcaption').length).toBe(1);
            gridObj.actionComplete=null;
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.groupColumn('FIELD1');
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-50577 - Script error throws when add record in a empty Grid with infiniteScrolling feature => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: [],
                enableInfiniteScrolling: true,
                pageSettings: { pageSize: 50 },
                editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', isPrimaryKey: true, width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                    { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                ]
            }, () => {
                setTimeout(done, 200);
            });
    });
    it('Add row in empty grid', function(done: Function){
        let actionComplete = function (args: NotifyArgs) {
            if (args.requestType === 'add') {
                gridObj.actionComplete = null;
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
    });
    it('Update the row in empty grid', function(done: Function){
        let actionComplete = function(args: NotifyArgs) {
            if (args.requestType === 'save') {
                gridObj.actionComplete = null;
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.endEdit();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-50385 - Infinite scroll records removed after refreshing => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableInfiniteScrolling: true,
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                    { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                ]
            }, () => {
                setTimeout(done, 200);
            });
    });
    it('scroll bottom', function(done: Function){
        gridObj.dataBound = null;
        let dataBound = () => {
            gridObj.dataBound = null;
            done();
        };
        gridObj.dataBound = dataBound;
        gridObj.getContent().firstElementChild.scrollTop = 5000;
    });
    it('refresh grid', function(done: Function){
        let dataBound = () => {
            expect(gridObj.getContent().firstElementChild.scrollTop).toBe(0);
            expect(gridObj.pageSettings.currentPage).toBe(1);
            gridObj.dataBound = null;
            done();
        };
        gridObj.dataBound = dataBound;
        gridObj.refresh();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-51576 - Adding is not working in infinite scroll with frozen columns => ', () => {
    let gridObj: Grid;
    let localData: object[] = [
        { FIELD1: '10001', FIELD2: 'Test1', FIELD3: 0, FIELD4: 5 },
        { FIELD1: '10002', FIELD2: 'Test2', FIELD3: 1, FIELD4: 5 },
        { FIELD1: '10003', FIELD2: 'Test3', FIELD3: 3, FIELD4: 5 }
    ];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: localData,
                enableInfiniteScrolling: true,
                editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                height: 400,
                frozenColumns: 1,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', isPrimaryKey: true, width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 }
                ]
            }, () => {
                setTimeout(done, 200);
            });
    });
    it('Add the row', function(done: Function){
        let actionComplete = function (args: NotifyArgs) {
            if (args.requestType === 'add') {
                gridObj.actionComplete = null;
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
    });
    it('Update the row', function(done: Function){
        let actionComplete = function(args: NotifyArgs) {
            if (args.requestType === 'save') {
                gridObj.actionComplete = null;
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.endEdit();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = localData = null;
    });
});

describe('Infinite scroll with grouping collapse testing => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: infiniteGroupData,
                allowGrouping: true,
                enableInfiniteScrolling: true,
                groupSettings: { columns: ['ProductName'] },
                height: 400,
                columns: [
                    { field: 'OrderID', headerText: 'Employee ID', textAlign: 'Right', width: 125, isPrimaryKey: true },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 125, editType: 'dropdownedit' },
                    { field: 'CustomerName', headerText: 'Customer Name', width: 180, editType: 'dropdownedit' },
                    { field: 'CustomerAddress', headerText: 'Customer Address', width: 110 },
                    { field: 'ProductName', headerText: 'Product Name', width: 110 }
                ],
                aggregates: [{
                    columns: [{
                        type: 'Sum',
                        field: 'OrderID',
                        groupFooterTemplate: 'Total Order: ${Sum}'
                    },
                    {
                        type: 'Count',
                        field: 'CustomerID',
                        groupCaptionTemplate: 'Maximum: ${Count}'
                    }]
                }]
            }, () => {
                setTimeout(done, 200);
            });
    });
    it('Initial check =>', () => {
        expect(gridObj.groupSettings.disablePageWiseAggregates).toBe(true);
        expect(gridObj.getContent().querySelectorAll('.e-groupcaption').length).toBe(1);
        expect(gridObj.getContent().querySelectorAll('.e-summaryrow').length).toBe(0);
    });

    it('Collapse caption =>', (done: Function) => {
        gridObj.dataBound = undefined; let triggerCount: number = 0;
        let nextCount: number = 0;
        const dataBound = () => {
            triggerCount++;
            if (triggerCount === 2) {
                expect(gridObj.getContent().querySelectorAll('.e-groupcaption').length).toBe(2);
                expect(gridObj.getContent().querySelectorAll('.e-summaryrow').length).toBe(1);
                const skip: number = parseInt(gridObj.getRows()[gridObj.getRows().length - 1].getAttribute('data-rowindex'), 10);
                expect(skip).toBe(nextCount);
                gridObj.dataBound = undefined;
                done();
            } else {
                const caption: any = gridObj.getRowsObject()[0];
                const skip: number = parseInt(gridObj.getRows()[gridObj.getRows().length - 1].getAttribute('data-rowindex'), 10) + 1;
                const size: number = gridObj.pageSettings.pageSize;
                expect(skip).toBe(caption.data.count);
                expect((gridObj.infiniteScrollModule as any).groupCaptionAction).toBe('refresh');
                let additionalCnt: number = ((skip - (skip % size)) + size) - skip;
                nextCount = skip + (gridObj.infiniteScrollSettings.initialBlocks * gridObj.pageSettings.pageSize) + additionalCnt - 1;
            }
        };
        gridObj.dataBound = dataBound;
        gridObj.groupModule.expandCollapseRows(gridObj.getContent().querySelectorAll('.e-recordplusexpand')[0]);
    });

    it('Multiple group testing =>', (done: Function) => {
        const dataBound = () => {
            expect(gridObj.getContent().querySelectorAll('.e-groupcaption').length).toBe(4);
            expect(gridObj.getContent().querySelectorAll('.e-summaryrow').length).toBe(1);
            gridObj.dataBound = undefined;
            done();
        };
        gridObj.dataBound = dataBound;
        gridObj.groupSettings.columns = ['ProductName', 'CustomerID', 'CustomerAddress'];
    });

    it('Complex caption collapse =>', (done: Function) => {
        const dataBound = () => {
            const skip: number = parseInt(gridObj.getRows()[gridObj.getRows().length - 1].getAttribute('data-rowindex'), 10) + 1;
            expect(skip).toBe(gridObj.pageSettings.pageSize * (gridObj.infiniteScrollSettings.initialBlocks * 2));
            gridObj.dataBound = undefined;
            done();
        };
        gridObj.dataBound = dataBound;
        gridObj.groupModule.expandCollapseRows(gridObj.getContent().querySelectorAll('.e-recordplusexpand')[2])
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-52419 - Infinite scrolling with frozen columns editing with checkbox selection is not working properly => ', () => {
    let gridObj: Grid;
    let localData: object[] = [
        { FIELD1: '10001', FIELD2: 'Test1', FIELD3: 0, FIELD4: 5 },
        { FIELD1: '10002', FIELD2: 'Test2', FIELD3: 1, FIELD4: 5 },
        { FIELD1: '10003', FIELD2: 'Test3', FIELD3: 3, FIELD4: 5 }
    ];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: localData,
                enableInfiniteScrolling: true,
                editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                height: 400,
                frozenColumns: 1,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', isPrimaryKey: true, width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'name', headerText: 'FIELD4', width: 120 }
                ]
            }, () => {
                setTimeout(done, 200);
            });
    });
    it('Edit the row', function(done: Function){
        let actionComplete = function (args: NotifyArgs) {
            if (args.requestType === 'beginEdit') {
                gridObj.actionComplete = null;
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.selectRow(1);
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
    });
    it('Check the edited data', function(done: Function){
        let actionComplete = function(args?: any) {
            if (args.requestType === 'save') {
                expect(args.data.name).toBeUndefined();
                gridObj.actionComplete = null;
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.endEdit();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = localData = null;
    });
});

describe('EJ2-53852 - Infinite scroll Grid is duplicating the last row => ', () => {
    let gridObj: Grid;
    let localData: object[] = virtualData.slice(0, 13);
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: localData,
                enableInfiniteScrolling: true,
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', isPrimaryKey: true, width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'name', headerText: 'FIELD4', width: 120 }
                ]
            }, () => {
                setTimeout(done, 200);
            });
    });
    it('scroll to bottom', function(done: Function) {
        gridObj.getContent().firstElementChild.scrollTop = 5550;
        setTimeout(done, 200);
    });
    it('Ensure rows count', function() {
        expect(gridObj.getRows().length).toBe(13);
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = localData = null;
    });
});

describe('EJ2-54036 - Grouping collapse is not working properly with Infinite scroll if it dont have aggregates =>', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: infiniteGroupData,
                enableInfiniteScrolling: true,
                allowGrouping: true,
                groupSettings: { columns: ['ProductName'] },
                height: 400,
                columns: [
                    { field: 'OrderID', headerText: 'Employee ID', textAlign: 'Right', width: 125, isPrimaryKey: true },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 125, editType: 'dropdownedit' },
                    { field: 'CustomerName', headerText: 'Customer Name', width: 180, editType: 'dropdownedit' },
                    { field: 'CustomerAddress', headerText: 'Customer Address', width: 110 },
                    { field: 'ProductName', headerText: 'Product Name', width: 110 }
                ]
            }, () => {
                setTimeout(done, 200);
            });
    });

    it('Check disablePageWiseAggregate property', () => {
        expect(gridObj.groupSettings.disablePageWiseAggregates).toBe(true);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-55291 - Need to maintain scroll position with the updateRow method => ', () => {
    let gridObj: Grid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableInfiniteScrolling: true,
                pageSettings: { pageSize: 50 },
                editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', isPrimaryKey: true, width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                    { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                ],
                actionComplete: actionComplete
            }, () => {
                setTimeout(done, 200);
            });
    });

    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 1000;
        setTimeout(done, 200);
    });

    it('called updateRow method', (done: Function) => {
        actionComplete = (args?: any): void => {
            gridObj.actionComplete = undefined;
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.updateRow(20, { FIELD2: 10250, FIELD1: 'ALFKI' });
    });

    it('check scroll position while using updateRow method', () => {
        expect(gridObj.getContent().firstElementChild.scrollTop).toBe(1000);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-0000 - Need to maintain scroll position with the updateRow method => ', () => {
    let gridObj: Grid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableInfiniteScrolling: true,
                pageSettings: { pageSize: 20 },
                editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                height: 400,
                columns: [
                    { field: 'FIELD2', headerText: 'FIELD2', isPrimaryKey: true, width: 120 },
                    { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                    { field: 'FIELD3', headerText: 'FIELD3', width: 120 },
                    { headerText: 'Manage Records', width: 160,
                        commands: [{ buttonOption: { content: 'View', cssClass: 'command-button chi-button -sm' }}],
                    }
                ],
                actionComplete: actionComplete
            }, () => {
                setTimeout(done, 200);
            });
    });

    it('scroll to bottom', function (done) {
        gridObj.getContent().firstElementChild.scrollTop = 2500;
        setTimeout(done, 200);
    });

    it('called updateRow method', () => {
        expect(gridObj.getRows()[0].querySelector('.e-unboundcelldiv').children.length).toBe(1);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-63081 - Group by fails for 1 record on collapse => ', () => {
    let gridObj: Grid;
    let expandElem: NodeListOf<Element>;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData.slice(0, 200),
                allowGrouping: true,
                groupSettings: { columns: ['FIELD2'] },
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
    it('Scroll bottom', (done: Function) => {
        gridObj.getContent().firstElementChild.scrollTop = gridObj.getContent().firstElementChild.scrollHeight;
        setTimeout(done, 200);
    });
    it('Again scroll bottom', (done: Function) => {
        gridObj.getContent().firstElementChild.scrollTop = gridObj.getContent().firstElementChild.scrollHeight;
        setTimeout(done, 200);
    });
    it('Collapse Last Caption Row and check', (done: Function) => {
        expandElem = gridObj.getContent().querySelectorAll('.e-recordplusexpand');
        gridObj.groupModule.expandCollapseRows(expandElem[expandElem.length - 1]);
        expect(gridObj.pageSettings.currentPage).toBe((gridObj.infiniteScrollModule as any).maxPage);
        setTimeout(done, 200);
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-69299- Cant add row in Grid when enableInfiniteScrolling and enableCatch is set to true => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: [],
                enableInfiniteScrolling: true,
                pageSettings: { pageSize: 50 },
                editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },
                infiniteScrollSettings: { initialBlocks: 1, enableCache: true },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                height: 400,
                columns: [
                    {field: 'fieldName', defaultValue: 'Demo Text'},
                ],
            }, () => {
                setTimeout(done, 200);
            });
    });
    it('Add row in empty grid', function(done: Function){
        let actionComplete = function (args: NotifyArgs) {
            if (args.requestType === 'add') {
                gridObj.actionComplete = null;
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
    });
    it('Update the row in empty grid', function(done: Function){
        let actionComplete = function(args: NotifyArgs) {
            if (args.requestType === 'save') {
                gridObj.actionComplete = null;
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.endEdit();
    });
    it('check the infiniteCache first value not to be empty object', () => {
        expect((gridObj.infiniteScrollModule as any).infiniteCache[1]).not.toBe({});
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-72231- Cannot edit newly added row when infiniteScrolling enabled => ', () => {
    let gridObj: Grid;    
    beforeAll((done: Function) => {    
      gridObj = createGrid(    
       {    
         dataSource: [],    
         enableInfiniteScrolling: true,    
         infiniteScrollSettings: { initialBlocks: 1, enableCache: true },    
         pageSettings: { pageSize: 50 },    
         editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },    
         toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],    
         height: 300,    
         columns: [    
          {field: 'EmployeeID', headerText:'EmployeeID', width:120, isPrimaryKey:true},    
          {field:'City', headerText:'City', width:130}    
         ],    
       }, done );    
    });    
   
    it('Add row in empty grid', (done: Function) => {
       let actionComplete = (args?: any): void => {
           if (args.requestType === 'save') {
               done();
           }
       };      
       gridObj.actionComplete = actionComplete;
       gridObj.editModule.editModule.addRecord({ EmployeeID: 10246, City: 'updated' });
   });
   
   it('Edit the row in grid', function () {
       (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
   });
   
   it('Update the row in grid', function () {
       (select('#' + gridObj.element.id + 'City', gridObj.element) as any).value =  'New updated';
       (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
       expect((gridObj.currentViewData[0])['City']).toBe('New updated');
   });
   
   afterAll(() => {
       destroy(gridObj);
       gridObj = null;
   });
}); 
