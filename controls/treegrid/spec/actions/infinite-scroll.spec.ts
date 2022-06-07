import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { Filter } from '../../src/treegrid/actions/filter';
import { Sort } from '../../src/treegrid/actions/sort';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { QueryCellInfoEventArgs, RowSelectEventArgs, Grid } from '@syncfusion/ej2-grids';
import { isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
import { InfiniteScroll } from '../../src/treegrid/actions/infinite-scroll';
import { Edit } from '../../src/treegrid/actions/edit';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { select } from '@syncfusion/ej2-base';

/**
 * TreeGrid Infinite Scroll spec
 */

TreeGrid.Inject(InfiniteScroll, Edit, Toolbar, Filter, Sort);

let virtualData: Object[] = [];
function dataSource(): void {
    let parent: number = -1;
    let parentId: number = null;
    let names: string[] = ['VINET', 'TOMSP', 'HANAR', 'VICTE', 'SUPRD', 'HANAR', 'CHOPS', 'RICSU', 'WELLI', 'HILAA', 'ERNSH', 'CENTC',
    'OTTIK', 'QUEDE', 'RATTC', 'ERNSH', 'FOLKO', 'BLONP', 'WARTH', 'FRANK', 'GROSR', 'WHITC', 'WARTH', 'SPLIR', 'RATTC', 'QUICK', 'VINET',
    'MAGAA', 'TORTU', 'MORGK', 'BERGS', 'LEHMS', 'BERGS', 'ROMEY', 'ROMEY', 'LILAS', 'LEHMS', 'QUICK', 'QUICK', 'RICAR', 'REGGC', 'BSBEV',
    'COMMI', 'QUEDE', 'TRADH', 'TORTU', 'RATTC', 'VINET', 'LILAS', 'BLONP', 'HUNGO', 'RICAR', 'MAGAA', 'WANDK', 'SUPRD', 'GODOS', 'TORTU',
    'OLDWO', 'ROMEY', 'LONEP', 'ANATR', 'HUNGO', 'THEBI', 'DUMON', 'WANDK', 'QUICK', 'RATTC', 'ISLAT', 'RATTC', 'LONEP', 'ISLAT', 'TORTU',
    'WARTH', 'ISLAT', 'PERIC', 'KOENE', 'SAVEA', 'KOENE', 'BOLID', 'FOLKO', 'FURIB', 'SPLIR', 'LILAS', 'BONAP', 'MEREP', 'WARTH', 'VICTE',
    'HUNGO', 'PRINI', 'FRANK', 'OLDWO', 'MEREP', 'BONAP', 'SIMOB', 'FRANK', 'LEHMS', 'WHITC', 'QUICK', 'RATTC', 'FAMIA'];
    for (let i: number = 0; i < 1000; i++) {
        if (i % 5 === 0) {
            parent = i;
        }
        if (i % 5 !== 0) {
            let crew: string = 'Crew';
            let num: number = isNaN((virtualData.length % parent) - 1) ?  0 : (virtualData.length % parent) - 1;
            virtualData[num][crew].push({
                'TaskID': i + 1,
                'FIELD1': names[Math.floor(Math.random() * names.length)],
                'FIELD2': 1967 + (i % 10),
                'FIELD3': Math.floor(Math.random() * 200),
                'FIELD4': Math.floor(Math.random() * 100),
                'FIELD5': Math.floor(Math.random() * 2000),
                'FIELD6': Math.floor(Math.random() * 1000),
                'FIELD7': Math.floor(Math.random() * 2000),
                'FIELD8': Math.floor(Math.random() * 3000)
            });
        } else {
            virtualData.push({
                'TaskID': i + 1,
                'Crew': [],
                'FIELD1': names[Math.floor(Math.random() * names.length)],
                'FIELD2': 1967 + (i % 10),
                'FIELD3': Math.floor(Math.random() * 200),
                'FIELD4': Math.floor(Math.random() * 100),
                'FIELD5': Math.floor(Math.random() * 2000),
                'FIELD6': Math.floor(Math.random() * 1000),
                'FIELD7': Math.floor(Math.random() * 2000),
                'FIELD8': Math.floor(Math.random() * 3000)
            });
        }
    }
}

dataSource();

function getKeyUpObj(keyCode: string | number, target: Element): any {
    let preventDefault = () => { };
    return { target: target, keyCode: keyCode };
}

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


describe('TreeGrid Infinite Scroll', () => {
  describe('Rendering and basic actions', () => {
    let treegrid: TreeGrid;
    let actionComplete: (e?: any) => void;
    let rows: Element[];
    let expanded: () => void;
    let collapsed: () => void;
    let rowSelected: () => void;
    beforeAll((done: Function) => {
        treegrid = createGrid(
        {
            dataSource: virtualData,
            enableInfiniteScrolling: true,
            childMapping: 'Crew',
            treeColumnIndex: 1,
            pageSettings: { pageSize: 50 },
            allowFiltering: true,
            allowSorting: true,
            height: 400,
            columns: [
              { field: 'TaskID', headerText: 'Player Jersey', isPrimaryKey: true, width: 140, textAlign: 'Right' },
              { field: 'FIELD1', headerText: 'Player Name', width: 140 },
              { field: 'FIELD2', headerText: 'Year', width: 80, textAlign: 'Right' },
              { field: 'FIELD3', headerText: 'Stint', width: 80, textAlign: 'Right' },
              { field: 'FIELD4', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD5', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD6', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD7', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD8', headerText: 'TMID', width: 80, textAlign: 'Right' }
            ]
        },
        done
      );
    });
    it('initial render', () => {
        expect(treegrid.getRows().length).toBe(150);
        expect(parseInt(treegrid.getRows()[0].getAttribute('aria-rowindex'), 10)).toBe(0);
        expect(treegrid.getCurrentViewRecords().length).toBe(150);
        expect(treegrid.grid.infiniteScrollSettings.enableCache).toBeFalsy();
        expect(treegrid.grid.infiniteScrollSettings.initialBlocks).toBe(3);
        expect(treegrid.grid.infiniteScrollSettings.maxBlocks).toBe(3);
        expect(Object.keys((treegrid.grid.infiniteScrollModule as any).infiniteCache).length).toBe(0);
        expect(Object.keys((treegrid.grid.infiniteScrollModule as any).infiniteCurrentViewData).length).toBe(treegrid.grid.infiniteScrollSettings.initialBlocks);
    });
    it('collapse test', () => {
        let rows: Element[] = treegrid.grid.getRows();
        (rows[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
        expect(treegrid.getCurrentViewRecords().indexOf(treegrid.flatData[1])).toBe(-1);
    });
    it('expand test', () => {
        let rows: Element[] = treegrid.grid.getRows();
        (rows[0].getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
        expect(treegrid.getCurrentViewRecords().indexOf(treegrid.flatData[1])).toBe(1);
    });
    it('scroll bottom', (done: Function) => {
        treegrid.getContent().firstElementChild.scrollTop = 5550;
        setTimeout(done, 200);
    });
    it('scroll bottom', () => {
        expect(treegrid.getCurrentViewRecords().length).toBe(200);
        expect(parseInt(treegrid.getRows()[150].getAttribute('aria-rowindex'), 10)).toBe(150);
        expect(treegrid.getRows().length).toBe(200);
        expect(Object.keys((treegrid.grid.infiniteScrollModule as any).infiniteCurrentViewData).length).toBe(treegrid.infiniteScrollSettings.initialBlocks + 1);
    });
    it('Filter string column testing', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'filtering') {
                expect(checkFilterObj(treegrid.grid.filterSettings.columns[0], 'FIELD1', 'startswith', 'VINET', 'and', false)).toBeTruthy();
                expect(treegrid.getContent().firstElementChild.scrollTop).toBe(0);
                expect(treegrid.grid.pageSettings.currentPage).toBe(1);
            }
            treegrid.actionComplete = undefined;
            done();
        };
        treegrid.grid.actionComplete = actionComplete;
        treegrid.grid.dataBind();
        filterColumn(treegrid.grid, 'FIELD1', 'VINET');
    });
    it('scroll bottom', (done: Function) => {
        treegrid.clearFiltering();
        treegrid.getContent().firstElementChild.scrollTop = 5550;
        setTimeout(done, 200);
    });
    it('scroll to top', (done: Function) => {
        treegrid.getContent().firstElementChild.scrollTop = 0;
        setTimeout(done, 200);
    });
    afterAll(() => {
      destroy(treegrid);
    });
  });

  describe('Add New Row', () => {
    let treegrid: TreeGrid;
    let actionComplete: (e?: any) => void;
    let actionBegin: (e?: any) => void;
    let rows: Element[];
    let expanded: () => void;
    let collapsed: () => void;
    let rowSelected: () => void;
    beforeAll((done: Function) => {
        treegrid = createGrid(
        {
            dataSource: virtualData,
            enableInfiniteScrolling: true,
            childMapping: 'Crew',
            treeColumnIndex: 1,
            pageSettings: { pageSize: 50 },
            editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, newRowPosition: 'Below' },
            toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
            allowFiltering: true,
            allowSorting: true,
            height: 400,
            columns: [
              { field: 'TaskID', headerText: 'Player Jersey', isPrimaryKey: true, width: 140, textAlign: 'Right' },
              { field: 'FIELD1', headerText: 'Player Name', width: 140 },
              { field: 'FIELD2', headerText: 'Year', width: 80, textAlign: 'Right' },
              { field: 'FIELD3', headerText: 'Stint', width: 80, textAlign: 'Right' },
              { field: 'FIELD4', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD5', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD6', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD7', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD8', headerText: 'TMID', width: 80, textAlign: 'Right' }
            ]
        },
        done
      );
    });
    it('Add New Row Begin', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'add') {
                expect(treegrid.grid.element.querySelectorAll('.e-addedrow').length).toBe(1);
                expect(treegrid.grid.element.querySelectorAll('.e-normaledit').length).toBe(1);
                expect(treegrid.grid.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(treegrid.grid.element.querySelectorAll('form').length).toBe(1);
                expect(document.activeElement.id).toBe(treegrid.grid.element.id + 'TaskID');
                //toolbar status check
                expect(treegrid.grid.element.querySelectorAll('.e-overlay').length).toBe(4);
                expect(treegrid.grid.isEdit).toBeTruthy();
                done();
            }
        };
        treegrid.grid.actionComplete = actionComplete;
        treegrid.grid.selectRow(1);
        (<any>treegrid.grid.toolbarModule).toolbarClickHandler({ item: { id: treegrid.grid.element.id + '_add' } });
    });

    it('Save New Row', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(treegrid.grid.element.querySelectorAll('.e-normaledit').length).toBe(0);
                expect(treegrid.grid.element.querySelectorAll('.e-gridform').length).toBe(0);
                expect(treegrid.grid.element.querySelectorAll('form').length).toBe(0);
                //updatated data cehck
                expect((treegrid.grid.dataSource as any).length === 1001).toBe(true);
                done();
            }
        };
        actionBegin = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(treegrid.grid.isEdit).toBeTruthy();
            }
        };
        treegrid.grid.actionComplete = actionComplete;
        treegrid.grid.actionBegin = actionBegin;
        (select('#' + treegrid.grid.element.id + 'TaskID', treegrid.grid.element) as any).value = '98765';
        (select('#' + treegrid.grid.element.id + 'FIELD1', treegrid.grid.element) as any).value = 'New Row';
        (<any>treegrid.grid.toolbarModule).toolbarClickHandler({ item: { id: treegrid.grid.element.id + '_update' } });
    });
    afterAll(() => {
      destroy(treegrid);
    });
  });

  describe('Delete Row', () => {
    let treegrid: TreeGrid;
    let actionComplete: (e?: any) => void;
    let actionBegin: (e?: any) => void;
    let rows: Element[];
    let expanded: () => void;
    let collapsed: () => void;
    let rowSelected: () => void;
    beforeAll((done: Function) => {
        treegrid = createGrid(
        {
            dataSource: virtualData,
            enableInfiniteScrolling: true,
            childMapping: 'Crew',
            treeColumnIndex: 1,
            pageSettings: { pageSize: 50 },
            editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, newRowPosition: 'Below' },
            toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
            allowFiltering: true,
            allowSorting: true,
            height: 400,
            columns: [
              { field: 'TaskID', headerText: 'Player Jersey', isPrimaryKey: true, width: 140, textAlign: 'Right' },
              { field: 'FIELD1', headerText: 'Player Name', width: 140 },
              { field: 'FIELD2', headerText: 'Year', width: 80, textAlign: 'Right' },
              { field: 'FIELD3', headerText: 'Stint', width: 80, textAlign: 'Right' },
              { field: 'FIELD4', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD5', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD6', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD7', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD8', headerText: 'TMID', width: 80, textAlign: 'Right' }
            ]
        },
        done
      );
    });
    it('Delete First Parent Row', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'delete') {
               expect((treegrid.grid.dataSource as any).length === 995).toBe(true);
               done();
            }
        };
        treegrid.grid.actionComplete = actionComplete;
        treegrid.grid.selectRow(0);
        (<any>treegrid.grid.toolbarModule).toolbarClickHandler({ item: { id: treegrid.grid.element.id + '_delete' } });
    });
    it('Delete Child Row', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'delete') {
               expect((treegrid.grid.dataSource as any).length === 994).toBe(true);
               done();
            }
        };
        treegrid.grid.actionComplete = actionComplete;
        treegrid.grid.selectRow(1);
        (<any>treegrid.grid.toolbarModule).toolbarClickHandler({ item: { id: treegrid.grid.element.id + '_delete' } });
    });
    afterAll(() => {
      treegrid['infiniteScrollModule']['destroy']();
      destroy(treegrid);
    });
  });

  describe('Add Row using addRecord method', () => {
    let treegrid: TreeGrid;
    let actionComplete: (e?: any) => void;
    let actionBegin: (e?: any) => void;
    let rows: Element[];
    let expanded: () => void;
    let collapsed: () => void;
    let rowSelected: () => void;
    beforeAll((done: Function) => {
        treegrid = createGrid(
        {
            dataSource: virtualData,
            enableInfiniteScrolling: true,
            childMapping: 'Crew',
            treeColumnIndex: 1,
            pageSettings: { pageSize: 50 },
            editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, newRowPosition: 'Child' },
            toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
            allowFiltering: true,
            allowSorting: true,
            height: 400,
            columns: [
              { field: 'TaskID', headerText: 'Player Jersey', isPrimaryKey: true, width: 140, textAlign: 'Right' },
              { field: 'FIELD1', headerText: 'Player Name', width: 140 },
              { field: 'FIELD2', headerText: 'Year', width: 80, textAlign: 'Right' },
              { field: 'FIELD3', headerText: 'Stint', width: 80, textAlign: 'Right' },
              { field: 'FIELD4', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD5', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD6', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD7', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD8', headerText: 'TMID', width: 80, textAlign: 'Right' }
            ]
        },
        done
      );
    });
    it('Level test of the Added Child record', (done: Function) => {
        actionComplete = (args?: any): void => {
            expect(treegrid.grid.dataSource[4].level).toBe(2);
            done();
        }
        treegrid.actionComplete = actionComplete;
        treegrid.addRecord({TaskID:Math.random(),FIELD1: 'test'}, 3, 'Child');
    });
    afterAll(() => {
        treegrid['infiniteScrollModule']['destroy']();
        destroy(treegrid);
    });
  });

  describe('EJ2-56410 - Infiniscrolling does not work properly when all records are collapsed', () => {
    let treegrid: TreeGrid;
    let actionComplete: (e?: any) => void;
    beforeAll((done: Function) => {
        treegrid = createGrid(
        {
            dataSource: virtualData,
            enableInfiniteScrolling: true,
            childMapping: 'Crew',
            treeColumnIndex: 1,
            pageSettings: { pageSize: 5 },
            enableCollapseAll: true,
            height: 400,
            columns: [
              { field: 'TaskID', headerText: 'Player Jersey', isPrimaryKey: true, width: 140, textAlign: 'Right' },
              { field: 'FIELD1', headerText: 'Player Name', width: 140 },
              { field: 'FIELD2', headerText: 'Year', width: 80, textAlign: 'Right' },
              { field: 'FIELD3', headerText: 'Stint', width: 80, textAlign: 'Right' },
              { field: 'FIELD4', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD5', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD6', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD7', headerText: 'TMID', width: 80, textAlign: 'Right' },
              { field: 'FIELD8', headerText: 'TMID', width: 80, textAlign: 'Right' }
            ]
        },
        done
      );
    });
    it('Collapsed records count test of the visible records', (done: Function) => {
        expect(treegrid.getCurrentViewRecords().length).toBe(15);
        done();
    });
    afterAll(() => {
        treegrid['infiniteScrollModule']['destroy']();
        destroy(treegrid);
    });
  });

});