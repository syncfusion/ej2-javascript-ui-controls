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
import { createGrid, destroy, getKeyUpObj } from '../base/specutil.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { InfiniteScroll } from '../../../src/grid/actions/infinite-scroll';

Grid.Inject(Filter, Page, Selection, Group, Edit, Sort, Reorder, InfiniteScroll);

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

describe('Inline editing render => ', () => {
    let gridObj: Grid;
    let actionComplete: (e?: any) => void;
    let field2Element: any;
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