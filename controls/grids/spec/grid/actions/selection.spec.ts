/**
 * Grid Selection spec document
 */
import { Browser, EmitType, select } from '@syncfusion/ej2-base';
import { EventHandler, isNullOrUndefined, closest } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Selection } from '../../../src/grid/actions/selection';
import { Page } from '../../../src/grid/actions/page';
import { data, infiniteGroupData } from '../base/datasource.spec';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { Edit } from '../../../src/grid/actions/edit';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Filter } from '../../../src/grid/actions/filter';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { QueryCellInfoEventArgs, RowSelectingEventArgs, RowSelectEventArgs, RowDeselectEventArgs } from '../../../src/grid/base/interface';
import { createGrid, destroy } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import { Column } from '../../../src/grid/models/column';
import { Row } from '../../../src/grid/models/row';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { Freeze } from '../../../src/grid/actions/freeze';

Grid.Inject(Selection, Page, Sort, Group, Edit, Toolbar, VirtualScroll, Filter, Freeze);

function copyObject(source: Object, destiation: Object): Object {
    for (let prop in source) {
        destiation[prop] = source[prop];
    }
    return destiation;
}

function getEventObject(eventType: string, eventName: string, target?: Element, x?: number, y?: number): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = copyObject(tempEvent, {});
    returnObject.preventDefault = () => { return true; };

    if (!isNullOrUndefined(x)) {
        returnObject.pageX = x;
        returnObject.clientX = x;
    }
    if (!isNullOrUndefined(y)) {
        returnObject.pageY = y;
        returnObject.clientY = y;
    }
    if (!isNullOrUndefined(target)) {
        returnObject.target = returnObject.srcElement = returnObject.toElement = returnObject.currentTarget = target;
    }

    return returnObject;
}

let ctr: number = 0;
let count500: string[] = Array.apply(null, Array(5)).map(() => 'Column' + ++ctr + '');
let virtualData: Object[] = (() => {
    let arr: Object[] = [];
    for (let i: number = 0, o: Object = {}, j: number = 0; i < 1000; i++ , j++ , o = {}) {
        count500.forEach((lt: string) => o[lt] = 'Column' + lt + 'Row' + i);
        arr[j] = o;
    }
    return arr;
})();


describe('Selection Shortcuts testing', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    let selectionModule: Selection;
    let rows: Element[];
    beforeAll((done: Function) => {
        const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                allowPaging: true,
                pageSettings: { pageSize: 8, pageCount: 4, currentPage: 1 },
                allowSelection: true,
                selectionSettings: { type: 'Multiple', mode: 'Both' },
            }, done);
    });

    it('shiftDown intial cell, row shortcut testing', (done: Function) => {
        let args: any = { action: 'shiftDown', preventDefault: preventDefault };
        let len: number = 5;
        selectionModule = gridObj.selectionModule;
        rows = gridObj.getRows();
        let focusHandler: Function = () => {
            gridObj.keyboardModule.keyAction(args);
            for (let i: number = 0; i <= 1; i++) {
                if (i === 1) {
                    len = 1;
                }
                for (let j: number = 0; j < len; j++) {
                    expect(rows[i].querySelectorAll('.e-rowcell')[j].classList.contains('e-cellselectionbackground')).toBeTruthy();
                }
            }
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            gridObj.clearSelection();
            EventHandler.remove(gridObj.element, 'focus', focusHandler);
            done();
        };
        EventHandler.add(gridObj.element, 'focus', focusHandler, gridObj);
        gridObj.element.focus();
        EventHandler.trigger(gridObj.element, 'focus');
    });

    it('downarrow shortcut testing', () => {
        let args: any = { action: 'downArrow', preventDefault: preventDefault };
        (gridObj.getRows()[1].querySelector('.e-rowcell') as HTMLElement).click();
        gridObj.keyboardModule.keyAction(args);
        expect(parseInt(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex'), 10) - 1).toBe(2);
        expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect(gridObj.getSelectedRecords().length).toBe(1);
        expect(gridObj.getSelectedRowIndexes().length).toBe(1);
        expect(rows[2].firstElementChild.classList.contains('e-cellselectionbackground')).toBeTruthy();
        expect(gridObj.getSelectedRowCellIndexes().length).toBe(1);
    });

    it('upArrow shortcut testing', () => {
        let args: any = { action: 'upArrow', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(parseInt(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex'), 10) - 1).toBe(1);
        expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect(selectionModule.selectedRecords.length).toBe(1);
        expect(selectionModule.selectedRowIndexes.length).toBe(1);
        expect(rows[1].firstElementChild.classList.contains('e-cellselectionbackground')).toBeTruthy();
        expect(selectionModule.selectedRowCellIndexes.length).toBe(1);
    });

    it('select cell method testing', () => {
        gridObj.clearSelection();
        selectionModule.selectCell({ rowIndex: 0, cellIndex: 2 });
        expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        expect((rows[0].querySelector('.e-cellselectionbackground') as HTMLTableCellElement)).not.toBeNull();
        selectionModule.selectCell({ rowIndex: 0, cellIndex: 2 });
        expect((rows[0].querySelector('.e-cellselectionbackground') as HTMLTableCellElement)).not.toBeNull();
        selectionModule.selectCell({ rowIndex: 0, cellIndex: 2 }, true);
        expect((rows[0].querySelector('.e-cellselectionbackground') as HTMLTableCellElement)).toBeNull();
        selectionModule.selectCell({ rowIndex: 0, cellIndex: 2 }, true);
        expect((rows[0].querySelector('.e-cellselectionbackground') as HTMLTableCellElement)).not.toBeNull();        
    });

    it('rightArrow shortcut next row testing', () => {
        gridObj.clearSelection();
        let args: any = { action: 'rightArrow', preventDefault: preventDefault };
        selectionModule.selectCell({ rowIndex: 0, cellIndex: 4 }, true);
        gridObj.keyboardModule.keyAction(args);
        expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        expect((rows[1].querySelector('.e-cellselectionbackground') as HTMLTableCellElement)).toBeNull();
    });

    it('rightArrow shortcut next row testing', () => {
        let args: any = { action: 'rightArrow', preventDefault: preventDefault };
        selectionModule.selectCell({ rowIndex: 0, cellIndex: 4 }, true);
        gridObj.keyboardModule.keyAction(args);
        expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        expect((rows[1].querySelector('.e-cellselectionbackground'))).toBeNull();
    });

    it('leftarrow shortcut prev row testing', () => {
        let args: any = { action: 'leftArrow', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect((rows[0].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(3);
    });

    it('leftarrow shortcut testing', () => {
        let args: any = { action: 'leftArrow', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        expect((rows[0].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(2);
    });

    it('home shortcut testing', () => {
        gridObj.selectRow(1);
        let args: any = { action: 'home', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(parseInt(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex'), 10) - 1).toBe(1);
        expect((rows[1].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(0);        
    });

    it('end shortcut testing', () => {
        let args: any = { action: 'end', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(parseInt(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex'), 10) - 1).toBe(1);
        expect((rows[1].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(4);        
    });

    it('ctrlHome shortcut testing', () => {
        let args: any = { action: 'ctrlHome', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(parseInt(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex'), 10) - 1).toBe(0);
        expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect((rows[0].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(0);
    });

    it('ctrlEnd shortcut testing', () => {
        let args: any = { action: 'ctrlEnd', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(parseInt(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex'), 10) - 1).toBe(7);
        expect(rows[7].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect((rows[7].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(4);
        gridObj.selectionModule.clearCellSelection();        
    });

    it('shiftUp row shortcut testing', (done: Function) => {
        let args: any = { action: 'shiftUp', preventDefault: preventDefault };
        let flag: boolean = true;
        gridObj.rowSelected = () => {
            if (!flag) { return; }
            flag = false;
            gridObj.rowSelected = null;
            gridObj.keyboardModule.keyAction(args);
            expect(parseInt(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex'), 10) - 1).toBe(2);
            expect(parseInt(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[1].getAttribute('aria-rowindex'), 10) - 1).toBe(3);
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[7].querySelectorAll('.e-rowcell')[4].classList.contains('e-cellselectionbackground')).toBeTruthy();
            done();
        };
        gridObj.selectRow(3);
    });

    it('shiftDown row shortcut testing', () => {
        let args: any = { action: 'shiftDown', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        gridObj.keyboardModule.keyAction(args);
        expect(parseInt(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex'), 10) - 1).toBe(3);
        expect(parseInt(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[1].getAttribute('aria-rowindex'), 10) - 1).toBe(4);
        expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect(rows[7].querySelectorAll('.e-rowcell')[4].classList.contains('e-cellselectionbackground')).toBeTruthy();
    });

    it('shiftUp row shortcut reverse testing', () => {
        let args: any = { action: 'shiftUp', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(parseInt(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex'), 10) - 1).toBe(3);
        expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        expect(rows[7].querySelectorAll('.e-rowcell')[4].classList.contains('e-cellselectionbackground')).toBeTruthy();
    });


    it('shiftLeft cell shortcut testing', () => {
        let args: any = { action: 'shiftLeft', preventDefault: preventDefault };
        selectionModule.selectCell({ rowIndex: 1, cellIndex: 1 }, true);
        gridObj.keyboardModule.keyAction(args);
        expect(rows[1].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
        expect(rows[1].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toBeTruthy();
    });

    it('shiftRight cell shortcut testing', () => {
        let args: any = { action: 'shiftRight', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        gridObj.keyboardModule.keyAction(args);
        expect(rows[1].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
        expect(rows[1].querySelectorAll('.e-rowcell')[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
        expect(rows[1].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toBeFalsy();
    });


    it('shiftUp cell shortcut testing', () => {
        let args: any = { action: 'shiftUp', preventDefault: preventDefault };
        let st: number = 2;
        let len: number = 2;
        gridObj.keyboardModule.keyAction(args);
        for (let i: number = 0; i <= 1; i++) {
            if (i === 1) {
                st = 0;
                len = 1;
            }
            for (let j: number = st; j < len; j++) {
                expect(rows[i].querySelectorAll('.e-rowcell')[j].classList.contains('e-cellselectionbackground')).toBeTruthy();
            }
        }
    });

    it('shiftDown cell shortcut testing', () => {
        let args: any = { action: 'shiftDown', preventDefault: preventDefault };
        let st: number = 1;
        let len: number = 3;
        gridObj.keyboardModule.keyAction(args);
        gridObj.keyboardModule.keyAction(args);
        for (let i: number = 1; i <= 2; i++) {
            if (i === 2) {
                st = 0;
                len = 2;
            }
            for (let j: number = st; j < len; j++) {
                expect(rows[i].querySelectorAll('.e-rowcell')[j].classList.contains('e-cellselectionbackground')).toBeTruthy();
            }
        }
    });

    it('escape shortcut testing', () => {
        let args: any = { action: 'escape', preventDefault: preventDefault };
        gridObj.selectRows([0, 1, 2]);
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.getSelectedRecords().length).toBe(0);
        expect(gridObj.getSelectedRowIndexes().length).toBe(0);
    });

    it('ctrl + A shortcut testing', () => {
        let args: any = { action: 'ctrlPlusA', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(gridObj.element.querySelectorAll('.e-rowcell').length);
        expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(gridObj.element.querySelectorAll('.e-rowcell').length);
    });

    it('shiftDown - header', () => {
        (gridObj.getHeaderContent().querySelector('.e-headercell') as HTMLElement).click()
        let args: any = { action: 'shiftDown', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect((<any>gridObj).focusModule.active.constructor.name).toBe('HeaderFocus');

    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = preventDefault = selectionModule = rows = null;
    });
});

    describe('grid selection functionalities with Frozen rows', function () {
        let gridObj: Grid;
        let preventDefault: Function = new Function();
        let selectionModule: Selection;
        let rows: Element[];
        beforeAll(function (done) {
            gridObj = createGrid({
                frozenRows: 2,
                dataSource: data,
                columns: [
                    { headerText: 'OrderID', field: 'OrderID' },
                    { headerText: 'CustomerID', field: 'CustomerID' },
                    { headerText: 'EmployeeID', field: 'EmployeeID' },
                    { headerText: 'ShipCountry', field: 'ShipCountry' },
                    { headerText: 'ShipCity', field: 'ShipCity' },
                ],
                allowSelection: true,
                selectionSettings: { type: 'Multiple', mode: 'Row' },
            }, done);
        });
        it('downarrow shortcut testing', function () {
            rows = gridObj.getRows();
            let args: any = { action: 'downArrow', preventDefault: preventDefault };
            (gridObj.getRows()[1].querySelector('.e-rowcell') as HTMLElement).click();
            gridObj.keyboardModule.keyAction(args);
            expect(parseInt(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex'), 10) - 1).toBe(2);
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(gridObj.getSelectedRecords().length).toBe(1);
            expect(gridObj.getSelectedRowIndexes().length).toBe(1);
            expect(rows[2].firstElementChild.classList.contains('e-cellselectionbackground')).toBeFalsy();
            expect(gridObj.getSelectedRowCellIndexes().length).toBe(0);
        });
        it('upArrow shortcut testing', function () {
            let args: any = { action: 'upArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(parseInt(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex'), 10) - 1).toBe(1);
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(gridObj.selectionModule.selectedRecords.length).toBe(1);
            expect(gridObj.selectionModule.selectedRowIndexes.length).toBe(1);
        });
        afterAll(function () {
            destroy(gridObj);
        });
    });

describe('EJ2-34955 - Grid row Selected Issue Fixes', () =>{
    let gridObj: Grid;
    let count: number = 0;
    beforeAll((done) => {
        gridObj = createGrid({
                dataSource: data,
                selectionSettings: { persistSelection: true },
                columns: [
                    { type: 'checkbox', width: 50 },
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' }
                ],
                allowPaging: true,
                rowSelected: function () {
                   count = count + 1;
                }
            }, done);
        });
    it('Selected count', function (done) {
       gridObj.refresh();
       expect(count).toBe(0);
       done();
    });
});

describe('Grid Selection module', () => {
    describe('grid single seletion functionalities', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                    selectionSettings: { type: 'Single', mode: 'Both' },
                }, done);
        });

        it('single row - selectRow testing', () => {
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            selectionModule.selectRow(0, true);
            expect(rows[0].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(5);
            expect(selectionModule.selectedRecords.length).toBe(1);
            expect(selectionModule.selectedRowIndexes.length).toBe(1);
        });

        it('single row testing', () => {
            selectionModule.selectRow(2, true);
            expect(rows[2].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(1);
            expect(selectionModule.selectedRowIndexes.length).toBe(1);
            expect(rows[1].hasAttribute('aria-selected')).toBeFalsy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        });

        it('single row - selectRowsByRange  testing', () => {
            selectionModule.clearRowSelection();
            selectionModule.selectRowsByRange(3, 4);
            expect(rows[3].hasAttribute('aria-selected')).toBeFalsy();
            expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(selectionModule.selectedRecords.length).toBe(1);
            expect(selectionModule.selectedRowIndexes.length).toBe(1);
        });

        it('single row - selectRows  testing', () => {
            selectionModule.clearRowSelection();
            gridObj.selectRows([1, 2]);
            expect(rows[1].hasAttribute('aria-selected')).toBeFalsy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(selectionModule.selectedRecords.length).toBe(1);
            expect(selectionModule.selectedRowIndexes.length).toBe(1);
        });

        it('single row - addRowsToSelection  testing', () => {
            selectionModule.clearRowSelection();
            selectionModule.addRowsToSelection([2]);
            expect(rows[1].hasAttribute('aria-selected')).toBeFalsy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(selectionModule.selectedRecords.length).toBe(1);
            expect(selectionModule.selectedRowIndexes.length).toBe(1);
        });

        it('clear row selection testing', () => {
            selectionModule.selectRow(1, true);
            selectionModule.clearRowSelection();
            expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(0);
            expect(selectionModule.selectedRecords.length).toBe(0);
            expect(selectionModule.selectedRowIndexes.length).toBe(0);
            expect(selectionModule.selectedRowIndexes.length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        it('single cell - selectCell testing', () => {
            gridObj.selectCell({ rowIndex: 0, cellIndex: 0 }, true);
            expect((rows[0].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(1);
        });

        it('single cell testing', () => {
            selectionModule.selectCell({ rowIndex: 1, cellIndex: 1 }, true);
            expect((rows[1].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(1);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(1);
            expect(rows[0].querySelectorAll('.e-cellselectionbackground').length).toBe(0);
        });

        it('single cell - selectCellsByRange testing', () => {
            selectionModule.clearCellSelection();
            selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: 1, cellIndex: 1 });
            expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        it('single cell - selectCellsByRange box mode testing', () => {
            selectionModule.clearCellSelection();
            gridObj.selectionSettings.cellSelectionMode = 'Box';
            gridObj.dataBind();
            selectionModule.selectCellsByRange({ rowIndex: 1, cellIndex: 1 }, { rowIndex: 2, cellIndex: 2 });
            expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        it('single cell - selectCells testing', () => {
            selectionModule.clearCellSelection();
            selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [0] }, { rowIndex: 1, cellIndexes: [1] }]);
            expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        it('single cell - addCellsToSelection testing', () => {
            selectionModule.clearCellSelection();
            selectionModule.addCellsToSelection([{ rowIndex: 0, cellIndex: 0 }]);
            expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        it('clear cell selection testing', () => {
            selectionModule.selectCell({ rowIndex: 1, cellIndex: 1 }, true);
            selectionModule.clearCellSelection();
            expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(0);
            expect(selectionModule.selectedRecords.length).toBe(0);
            expect(selectionModule.selectedRowIndexes.length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = selectionModule = rows = null;
        });
    });

    describe('grid single selection functionalities with Freeze pane', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    frozenColumns: 2,
                    frozenRows: 2,
                    dataSource: data,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                    selectionSettings: { type: 'Single', mode: 'Both' },
                }, done);
        });

        it('single row - selectRow testing', () => {
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            selectionModule.selectRow(0, true);
            expect(rows[0].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(5);
            expect(selectionModule.selectedRecords.length).toBe(1);
            expect(selectionModule.selectedRowIndexes.length).toBe(1);
        });

        it('single row testing', () => {
            selectionModule.selectRow(2, true);
            expect(rows[2].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(1);
            expect(selectionModule.selectedRowIndexes.length).toBe(1);
            expect(rows[1].hasAttribute('aria-selected')).toBeFalsy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        });

        it('clear row selection testing', () => {
            selectionModule.selectRow(1, true);
            selectionModule.clearRowSelection();
            expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(0);
            expect(selectionModule.selectedRecords.length).toBe(0);
            expect(selectionModule.selectedRowIndexes.length).toBe(0);
            expect(selectionModule.selectedRowIndexes.length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        it('single cell - selectCell testing', () => {
            gridObj.selectCell({ rowIndex: 0, cellIndex: 0 }, true);
            expect((rows[0].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(1);
        });

        it('single cell testing', () => {
            selectionModule.selectCell({ rowIndex: 1, cellIndex: 3 }, true);
            let rows: Element[] = gridObj.getRows();
            expect(
                (rows[1].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(3);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(1);
            expect(rows[0].querySelectorAll('.e-cellselectionbackground').length).toBe(0);
        });

        it('clear cell selection testing', () => {
            selectionModule.selectCell({ rowIndex: 1, cellIndex: 1 }, true);
            selectionModule.clearCellSelection();
            expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(0);
            expect(selectionModule.selectedRecords.length).toBe(0);
            expect(selectionModule.selectedRowIndexes.length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = selectionModule = rows = null;
        });
    });
});

describe('Mode and Type changes', () => {
    let gridObj: Grid;
    let selectionModule: Selection;
    let rows: Element[];
    let shiftEvt: MouseEvent = document.createEvent('MouseEvent');
    shiftEvt.initMouseEvent(
        'click',
        true /* bubble */, true /* cancelable */,
        window, null,
        0, 0, 0, 0, /* coordinates */
        false, false, true, false, /* modifier keys */
        0 /*left*/, null
    );
    
    let rowSelecting: (e?: Object) => void;
    let rowSelected: (e?: Object) => void;
       beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { headerText: 'OrderID', field: 'OrderID' },
                    { headerText: 'CustomerID', field: 'CustomerID' },
                    { headerText: 'EmployeeID', field: 'EmployeeID' },
                    { headerText: 'ShipCountry', field: 'ShipCountry' },
                    { headerText: 'ShipCity', field: 'ShipCity' },
                ],
                allowSelection: true,
                selectionSettings: { type: 'Multiple', mode: 'Row' },
                rowSelecting: rowSelecting,
                rowSelected: rowSelected,
            }, done);
    });

   
    it('multi row - selectRow test with mode change ',() =>{
        selectionModule = gridObj.selectionModule;
        rows = gridObj.getRows();
        selectionModule.selectRow(4,true);
        rows[6].firstChild.dispatchEvent(shiftEvt);   
        gridObj.selectionSettings.mode='Cell';
        gridObj.dataBind();
        gridObj.selectionSettings.mode="Row";
        gridObj.dataBind();
        rows[8].firstChild.dispatchEvent(shiftEvt);
        expect(gridObj.selectionModule.selectedRowIndexes.length).toBe(1);
        expect(rows[8].hasAttribute('aria-selected')).toBeTruthy;
        expect(rows[8].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
             
    });
  
      
      it('final type change row count',() =>{
        rows[5].firstChild.dispatchEvent(shiftEvt);
        gridObj.selectionSettings.type="Single";
        gridObj.dataBind();
        gridObj.selectionSettings.type="Multiple";
        rows[0].firstChild.dispatchEvent(shiftEvt);
        expect(gridObj.selectionModule.selectedRowIndexes.length).toBe(1);
        expect(gridObj.selectionModule.selectedRecords.length).toBe(1);
      });
      
      it('cell selection with type change',() =>{
        gridObj.selectionSettings.mode="Cell";
        gridObj.dataBind();
        (rows[1].querySelectorAll('.e-rowcell')[1] as HTMLElement).click();
        rows[2].querySelectorAll('.e-rowcell')[2].dispatchEvent(shiftEvt);
        gridObj.selectionSettings.mode="Row";
        gridObj.dataBind();
        gridObj.selectionSettings.mode="Cell";
        gridObj.dataBind();
        rows[2].querySelectorAll('.e-rowcell')[2].dispatchEvent(shiftEvt);
        expect(gridObj.selectionModule.selectedRowCellIndexes.length).toBe(1);
        expect(rows[2].firstElementChild.classList.contains('e-cellselectionbackground')).toBeTruthy;
        expect(rows[2].hasAttribute('aria-selected')).toBeTruthy;           
                
      });

      it('cell selection with mode change',() =>{
      rows[3].querySelectorAll('.e-rowcell')[3].dispatchEvent(shiftEvt);
        gridObj.selectionSettings.type="Single";
        gridObj.dataBind();
        gridObj.selectionSettings.type="Multiple";
        gridObj.dataBind();
        rows[4].querySelectorAll('.e-rowcell')[2].dispatchEvent(shiftEvt);
        expect(gridObj.selectionModule.selectedRowCellIndexes.length).toBe(1);
        expect(rows[4].firstElementChild.classList.contains('e-cellselectionbackground')).toBeTruthy;
        expect(rows[4].hasAttribute('aria-selected')).toBeTruthy;
           
                
      });
      afterAll(() => {
        destroy(gridObj);
        gridObj = selectionModule = rows = shiftEvt = null;
    });
    }); 


describe('Grid Selection module', () => {
    describe('grid row multiple seletion functionalities', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        let shiftEvt: MouseEvent = document.createEvent('MouseEvent');
        shiftEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            false, false, true, false, /* modifier keys */
            0 /*left*/, null
        );
        let ctrlEvt: MouseEvent = document.createEvent('MouseEvent');
        ctrlEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            true, false, false, false, /* modifier keys */
            0 /*left*/, null
        );
        let rowSelecting: (e?: Object) => void;
        let rowSelected: (e?: Object) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                    selectionSettings: { type: 'Multiple', mode: 'Row' },
                    rowSelecting: rowSelecting,
                    rowSelected: rowSelected,
                }, done);
        });

        it('multi row - selectRow testing', () => {
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            selectionModule.selectRowsByRange(0, 1);
            selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [0] }]);
            expect(rows[0].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[1].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(2);
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        it('single row testing', () => {
            selectionModule.selectRow(2, true);
            expect(rows[2].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(1);
            expect(selectionModule.selectedRowIndexes.length).toBe(1);
            expect(rows[1].hasAttribute('aria-selected')).toBeFalsy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        });

        it('multi row - addRowsToSelection  testing', () => {
            selectionModule.addRowsToSelection([4]);
            expect(rows[4].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[2].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(2);
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        it('multi row - ctrl click testing', () => {
            rows[0].firstChild.dispatchEvent(ctrlEvt);
            expect(rows[4].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[2].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[0].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(3);
            expect(selectionModule.selectedRowIndexes.length).toBe(3);
        });

        it('multi row toogle - ctrl click testing', () => {
            rows[4].firstChild.dispatchEvent(ctrlEvt);
            expect(rows[4].hasAttribute('aria-selected')).toBeFalsy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(selectionModule.selectedRecords.length).toBe(2);
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        it('clear row selection testing', () => {
            selectionModule.clearRowSelection();
            expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(0);
            expect(selectionModule.selectedRecords.length).toBe(0);
            expect(selectionModule.selectedRowIndexes.length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        it('multi row - shift click  testing', () => {
            (rows[4].firstChild as HTMLElement).click();
            rows[3].firstChild.dispatchEvent(shiftEvt);
            expect(rows[3].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[4].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(2);
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        it('multi row - shift click testing', () => {
            rows[5].firstChild.dispatchEvent(shiftEvt);
            expect(rows[4].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[5].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[5].firstElementChild.classList.contains('e-cellselectionbackground')).toBeFalsy();
            expect(selectionModule.selectedRecords.length).toBe(2);
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        it('multi row - shift click  testing', () => {
            rows[2].firstChild.dispatchEvent(shiftEvt);
            expect(rows[2].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[3].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[4].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(3);
            expect(selectionModule.selectedRowIndexes.length).toBe(3);
        });

        it('rowSelecting event call', () => {
            let spyFn: (e?: Object) => void = jasmine.createSpy('begin');
            gridObj.rowSelecting = spyFn;
            selectionModule.selectRow(1, true);
            expect(spyFn).toHaveBeenCalled();
        });

        it('rowSelected event call', () => {
            let spyFn: (e?: Object) => void = jasmine.createSpy('begin');
            gridObj.rowSelected = spyFn;
            selectionModule.selectRow(3, true);
            expect(spyFn).toHaveBeenCalled();
        });

        it('multi cell - selectRows testing', () => {
            selectionModule.clearRowSelection();
            selectionModule.selectRows([0, 2])
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        it('EJ2-19254 - selectRowsByRange testing - startvalue-0, endvalue-null', () => {
            selectionModule.clearRowSelection();
            selectionModule.selectRowsByRange(0, null);
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowIndexes.length).toBe(1);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = selectionModule = rows = shiftEvt = null;
        });
    });

    describe('grid selection functionalities: deselection with persistSelection property', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                    selectionSettings: { persistSelection: true },
                }, done);
        });

        it('selection and deselection with persistSelection property', () => {
            selectionModule = gridObj.selectionModule;
            selectionModule.selectRow(1, true);    
            rows = gridObj.getRows();
            expect(rows[1].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            selectionModule.selectedRecords[0].querySelector('td').click();
            expect(rows[1].hasAttribute('aria-selected')).toBeFalsy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = selectionModule = rows = null;
        });
    });


    describe('grid row multiple selection functionalities with Freeze pane', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        let shiftEvt: MouseEvent = document.createEvent('MouseEvent');
        shiftEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            false, false, true, false, /* modifier keys */
            0 /*left*/, null
        );
        let ctrlEvt: MouseEvent = document.createEvent('MouseEvent');
        ctrlEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            true, false, false, false, /* modifier keys */
            0 /*left*/, null
        );
        let rowSelecting: (e?: Object) => void;
        let rowSelected: (e?: Object) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    frozenColumns: 2,
                    frozenRows: 2,
                    dataSource: data,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                    selectionSettings: { type: 'Multiple', mode: 'Row' },
                    rowSelecting: rowSelecting,
                    rowSelected: rowSelected,
                }, done);
        });

        it('multi row - selectRow testing', () => {
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            selectionModule.selectRowsByRange(1, 2);
            selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [0] }]);
            expect(rows[1].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[2].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(2);
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        it('single row testing', () => {
            selectionModule.selectRow(3, true);
            expect(rows[3].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(1);
            expect(selectionModule.selectedRowIndexes.length).toBe(1);
            expect(rows[1].hasAttribute('aria-selected')).toBeFalsy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        });

        it('multi row - addRowsToSelection  testing', () => {
            selectionModule.addRowsToSelection([4]);
            expect(rows[4].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[3].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(2);
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        it('multi row - ctrl click testing', () => {
            rows[0].firstChild.dispatchEvent(ctrlEvt);
            expect(rows[4].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[3].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[0].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(3);
            expect(selectionModule.selectedRowIndexes.length).toBe(3);
        });

        it('multi row toogle - ctrl click testing', () => {
            rows[4].firstChild.dispatchEvent(ctrlEvt);
            expect(rows[4].hasAttribute('aria-selected')).toBeFalsy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(selectionModule.selectedRecords.length).toBe(2);
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        it('clear row selection testing', () => {
            selectionModule.clearRowSelection();
            expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(0);
            expect(selectionModule.selectedRecords.length).toBe(0);
            expect(selectionModule.selectedRowIndexes.length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        it('multi row - shift click  testing', () => {
            (rows[4].firstChild as HTMLElement).click();
            rows[3].firstChild.dispatchEvent(shiftEvt);
            expect(rows[3].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[4].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(2);
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        it('multi row - shift click testing', () => {
            rows[5].firstChild.dispatchEvent(shiftEvt);
            expect(rows[4].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[5].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[5].firstElementChild.classList.contains('e-cellselectionbackground')).toBeFalsy();
            expect(selectionModule.selectedRecords.length).toBe(2);
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        it('multi row - shift click  testing', () => {
            rows[2].firstChild.dispatchEvent(shiftEvt);
            expect(rows[2].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[3].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[4].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(3);
            expect(selectionModule.selectedRowIndexes.length).toBe(3);
        });

        it('rowSelecting event call', () => {
            let spyFn: (e?: Object) => void = jasmine.createSpy('begin');
            gridObj.rowSelecting = spyFn;
            selectionModule.selectRow(1, true);
            expect(spyFn).toHaveBeenCalled();
        });

        it('rowSelected event call', () => {
            let spyFn: (e?: Object) => void = jasmine.createSpy('begin');
            gridObj.rowSelected = spyFn;
            selectionModule.selectRow(3, true);
            expect(spyFn).toHaveBeenCalled();
        });

        it('multi cell - selectRows testing', () => {
            selectionModule.clearRowSelection();
            selectionModule.selectRows([0, 2])
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = selectionModule = rows = shiftEvt = null;
        });
    });
});

describe('Grid Selection module', () => {
    describe('grid cell multiple seletion functionalities', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        let cells: NodeListOf<Element>;
        let shiftEvt: MouseEvent = document.createEvent('MouseEvent');
        shiftEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            false, false, true, false, /* modifier keys */
            0 /*left*/, null
        );
        let ctrlEvt: MouseEvent = document.createEvent('MouseEvent');
        ctrlEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            true, false, false, false, /* modifier keys */
            0 /*left*/, null
        );
        let cellSelecting: (e?: Object) => void;
        let cellSelected: (e?: Object) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                    selectionSettings: { type: 'Multiple', mode: 'Cell' },
                    cellSelecting: cellSelecting,
                    cellSelected: cellSelected,
                }, done);
        });

        it('multi cell - selectCellsByRange testing', () => {
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: 1, cellIndex: 1 });
            let len = gridObj.getColumns().length;
            for (let i: number = 0; i <= 1; i++) {
                cells = rows[i].querySelectorAll('.e-rowcell');
                if (i === 1) {
                    len = 2;
                }
                for (let j: number = 0; j < len; j++) {
                    expect(cells[j].classList.contains('e-cellselectionbackground')).toBeTruthy();
                }
            }
            expect(selectionModule.selectedRowCellIndexes.length).toBe(2);
            expect(rows[0].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(rows[0].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('multi cell - selectCellsByRange box mode testing', () => {
            gridObj.selectionSettings.cellSelectionMode = 'Box';
            gridObj.dataBind();
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 2 }, { rowIndex: 1, cellIndex: 3 });
            for (let i: number = 0; i <= 1; i++) {
                cells = rows[i].querySelectorAll('.e-rowcell');
                for (let j: number = 2; j < 4; j++) {
                    expect(cells[j].classList.contains('e-cellselectionbackground')).toBeTruthy();
                }
            }
            expect(selectionModule.selectedRowCellIndexes.length).toBe(2);
            expect(rows[0].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toBeFalsy();
            expect(rows[0].querySelectorAll('.e-rowcell')[4].classList.contains('e-cellselectionbackground')).toBeFalsy();
            gridObj.selectionSettings.cellSelectionMode = 'Flow';
            gridObj.dataBind();
        });

        it('single cell testing', () => {
            selectionModule.selectCell({ rowIndex: 2, cellIndex: 2 }, true);
            expect(rows[2].querySelectorAll('.e-rowcell')[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowCellIndexes.length).toBe(1);
            expect(rows[0].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toBeFalsy();
        });

        it('multi cell - addCellsToSelection  testing', () => {
            selectionModule.addCellsToSelection([{ rowIndex: 1, cellIndex: 1 }]);
            expect(rows[2].querySelectorAll('.e-rowcell')[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(rows[1].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowCellIndexes.length).toBe(2);
        });

        it('multi cell - addRowsToSelection click testing', () => {
            rows[0].firstChild.dispatchEvent(ctrlEvt);
            expect(rows[2].querySelectorAll('.e-rowcell')[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(rows[1].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(rows[0].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowCellIndexes.length).toBe(3);
        });

        it('multi cell toogle - addRowsToSelection click testing', () => {
            rows[0].firstChild.dispatchEvent(ctrlEvt);
            expect(rows[0].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toBeFalsy();
        });

        it('selection on same row - addRowsToSelection click testing', () => {
            rows[0].querySelectorAll('.e-rowcell')[1].dispatchEvent(ctrlEvt);
            expect(rows[0].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('clear cell selection testing', () => {
            selectionModule.clearCellSelection();
            expect(selectionModule.selectedRowIndexes.length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        it('multi cell - shift click  testing', () => {
            (rows[1].querySelectorAll('.e-rowcell')[1] as HTMLElement).click();
            rows[2].querySelectorAll('.e-rowcell')[2].dispatchEvent(shiftEvt);
            let cellIndex: number = 1;
            let len: number = 5;
            for (let i: number = 1; i <= 2; i++) {
                cells = rows[i].querySelectorAll('.e-rowcell');
                if (i === 1) {
                    cellIndex = 2;
                    len = 3;
                }
                for (let j: number = cellIndex; j < len; j++) {
                    expect(cells[j].classList.contains('e-cellselectionbackground')).toBeTruthy();
                }
            }
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(selectionModule.selectedRowCellIndexes.length).toBe(2);
        });

        it('multi cell - shift click testing', () => {
            rows[0].querySelectorAll('.e-rowcell')[0].dispatchEvent(shiftEvt);
            let len: number = gridObj.getColumns().length;
            for (let i: number = 0; i <= 1; i++) {
                cells = rows[i].querySelectorAll('.e-rowcell');
                if (i === 1) {
                    len = 2;
                }
                for (let j: number = 0; j < len; j++) {
                    expect(cells[j].classList.contains('e-cellselectionbackground')).toBeTruthy();
                }
            }
            expect(selectionModule.selectedRowCellIndexes.length).toBe(2);
        });

        it('multi cell - shift click  testing', () => {
            rows[2].querySelectorAll('.e-rowcell')[2].dispatchEvent(shiftEvt);
            let cellIndex: number = 1;
            let len: number = 5;
            for (let i: number = 1; i <= 2; i++) {
                cells = rows[i].querySelectorAll('.e-rowcell');
                if (i === 1) {
                    cellIndex = 2;
                    len = 3;
                }
                for (let j: number = cellIndex; j < len; j++) {
                    expect(cells[j].classList.contains('e-cellselectionbackground')).toBeTruthy();
                }
            }
            expect(selectionModule.selectedRowCellIndexes.length).toBe(2);
        });

        it('cellSelecting event call', () => {
            let spyFn: (e?: Object) => void = jasmine.createSpy('begin');
            gridObj.cellSelecting = spyFn;
            selectionModule.selectCell({ rowIndex: 0, cellIndex: 0 }, true);
            expect(spyFn).toHaveBeenCalled();
        });

        it('cellSelected event call', () => {
            let spyFn: (e?: Object) => void = jasmine.createSpy('begin');
            gridObj.cellSelected = spyFn;
            selectionModule.selectCell({ rowIndex: 0, cellIndex: 1 }, true);
            expect(spyFn).toHaveBeenCalled();
        });


        it('multi cell - selectCells testing', () => {
            selectionModule.clearCellSelection();
            selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [0] }, { rowIndex: 1, cellIndexes: [1] }, { rowIndex: 2, cellIndexes: [2] }])
            for (let i: number = 0; i <= 2; i++) {
                cells = rows[i].querySelectorAll('.e-rowcell');
                expect(cells[i].classList.contains('e-cellselectionbackground')).toBeTruthy();
            }
            expect(selectionModule.selectedRowCellIndexes.length).toBe(3);
        });

        it('Muliple Cell selection while refreshing grid testing', function (done) {
            gridObj.dataBound = function () {
                gridObj.selectCell({ rowIndex: 0, cellIndex: 0 }, true);
                gridObj.refresh();
                gridObj.dataBound = function () {
                    gridObj.selectCellsByRange({rowIndex: 0, cellIndex: 0},{rowIndex: 0, cellIndex: 2});
                    expect(gridObj.getCellFromIndex(0,2).classList.contains('e-cellselectionbackground')).toBeTruthy;
                    expect(gridObj.getSelectedRowCellIndexes()[0].cellIndexes.length).toBe(3);
                    selectionModule.clearCellSelection();
                    done();
                }
            };
            gridObj.refresh();
            gridObj.refresh();
        });

        // getDataRows
        it('getDataRows check in frozen grid', () => {
            let cell: any = gridObj.getCellFromIndex(0,2);
            expect(gridObj.getMovableCellFromIndex(0,2)).toBe(cell);
            expect(gridObj.getFrozenRightCellFromIndex(0,2)).toBe(cell);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = selectionModule = rows = shiftEvt = null;
        });

    });

    describe('grid cell multiple seletion functionalities with Freeze pane', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        let cells: NodeListOf<Element>;
        let shiftEvt: MouseEvent = document.createEvent('MouseEvent');
        shiftEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            false, false, true, false, /* modifier keys */
            0 /*left*/, null
        );
        let ctrlEvt: MouseEvent = document.createEvent('MouseEvent');
        ctrlEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            true, false, false, false, /* modifier keys */
            0 /*left*/, null
        );
        let cellSelecting: (e?: Object) => void;
        let cellSelected: (e?: Object) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    frozenColumns: 2,
                    frozenRows: 2,
                    dataSource: data,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                    selectionSettings: { type: 'Multiple', mode: 'Cell' },
                    cellSelecting: cellSelecting,
                    cellSelected: cellSelected,
                }, done);
        });

        it('single cell testing', () => {
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            selectionModule.selectCell({ rowIndex: 2, cellIndex: 2 }, true);
            expect(rows[2].querySelectorAll('.e-rowcell')[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowCellIndexes.length).toBe(1);;
        });

        it('multi cell - addCellsToSelection  testing', () => {
            selectionModule.addCellsToSelection([{ rowIndex: 1, cellIndex: 1 }]);
            expect(rows[2].querySelectorAll('.e-rowcell')[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(rows[1].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowCellIndexes.length).toBe(2);
        });

        it('multi cell - addRowsToSelection click testing', () => {
            rows[3].firstChild.dispatchEvent(ctrlEvt);
            expect(rows[2].querySelectorAll('.e-rowcell')[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(rows[1].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(rows[3].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowCellIndexes.length).toBe(3);
        });

        it('multi cell toogle - addRowsToSelection click testing', () => {
            rows[3].firstChild.dispatchEvent(ctrlEvt);
            expect(rows[3].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toBeFalsy();
        });

        it('selection on same row - addRowsToSelection click testing', () => {
            rows[0].querySelectorAll('.e-rowcell')[1].dispatchEvent(ctrlEvt);
            expect(rows[0].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('clear cell selection testing', () => {
            selectionModule.clearCellSelection();
            expect(selectionModule.selectedRowIndexes.length).toBe(0);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(0);
        });

        it('multi cell - shift click  testing', () => {
            (rows[0].querySelectorAll('.e-rowcell')[1] as HTMLElement).click();
            rows[1].querySelectorAll('.e-rowcell')[1].dispatchEvent(shiftEvt);
            let cellIndex: number = 1;
            let len: number = 2;
            for (let i: number = 0; i <= 1; i++) {
                cells = rows[i].querySelectorAll('.e-rowcell');
                if (i === 1) {
                    cellIndex = 0;
                    len = 2;
                }
                for (let j: number = cellIndex; j < len; j++) {
                    expect(cells[j].classList.contains('e-cellselectionbackground')).toBeTruthy();
                }
            }
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(selectionModule.selectedRowCellIndexes.length).toBe(2);
        });

        it('cellSelecting event call', () => {
            let spyFn: (e?: Object) => void = jasmine.createSpy('begin');
            gridObj.cellSelecting = spyFn;
            selectionModule.selectCell({ rowIndex: 2, cellIndex: 4 }, true);
            expect(spyFn).toHaveBeenCalled();
        });

        it('cellSelected event call', () => {
            let spyFn: (e?: Object) => void = jasmine.createSpy('begin');
            gridObj.cellSelected = spyFn;
            selectionModule.selectCell({ rowIndex: 0, cellIndex: 1 }, true);
            expect(spyFn).toHaveBeenCalled();
        });


        it('multi cell - selectCells testing', () => {
            selectionModule.clearCellSelection();
            selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [0] }, { rowIndex: 1, cellIndexes: [1] }, { rowIndex: 2, cellIndexes: [2] }])
            for (let i: number = 0; i <= 2; i++) {
                cells = rows[i].querySelectorAll('.e-rowcell');
                expect(cells[i].classList.contains('e-cellselectionbackground')).toBeTruthy();
            }
            expect(selectionModule.selectedRowCellIndexes.length).toBe(3);
        });

        it('Muliple Cell selection while refreshing grid testing in Freeze', function (done) {
            gridObj.dataBound = function () {
                gridObj.selectCell({ rowIndex: 0, cellIndex: 0 }, true);
                gridObj.refresh();
                gridObj.dataBound = function () {
                    gridObj.selectCellsByRange({rowIndex: 0, cellIndex: 0},{rowIndex: 0, cellIndex: 1});
                    expect(gridObj.getCellFromIndex(0,1).classList.contains('e-cellselectionbackground')).toBeTruthy;
                    expect(gridObj.getSelectedRowCellIndexes()[0].cellIndexes.length).toBe(2);
                    selectionModule.clearCellSelection();
                    done();
                }
            };
            gridObj.refresh();
            gridObj.refresh();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = selectionModule = rows = cells = ctrlEvt = shiftEvt = null;
        });
    });
});



describe('Grid Selection module', () => {
    describe('clear selection cases', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        let cell: HTMLElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                    selectionSettings: { type: 'Multiple', mode: 'Both' },
                }, done);
        });

        it('select cell and clear row selection testing', () => {
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            cell = rows[0].firstChild as HTMLElement;
            selectionModule.selectCell({ rowIndex: 1, cellIndex: 0 }, true);
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(rows[1].firstElementChild.classList.contains('e-cellselectionbackground')).toBeTruthy();
            cell.click();
            expect(cell.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(rows[1].firstElementChild.classList.contains('e-cellselectionbackground')).toBeFalsy();
        });

        it('row and cell toogle testing', () => {
            selectionModule.clearSelection();
            cell.click();
            expect(cell.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeTruthy();
            cell.click();
            expect(cell.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeFalsy();
        });

        it('row and cell same row testing', () => {
            selectionModule.clearSelection();
            cell.click();
            expect(cell.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeTruthy();
            (rows[0].querySelectorAll('.e-rowcell')[1] as HTMLElement).click();
            expect(cell.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeFalsy();
            expect(rows[0].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
            (rows[0].querySelectorAll('.e-rowcell')[1] as HTMLElement).click();
            expect(cell.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeFalsy();
            expect(rows[0].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeFalsy();
            (rows[0].querySelectorAll('.e-rowcell')[1] as HTMLElement).click();
            expect(cell.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(rows[0].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('allowSelection false testing', () => {
            gridObj.allowSelection = false;
            gridObj.dataBind();
            cell.click();
            expect(cell.classList.contains('e-selectionbackground')).toBeFalsy();
            gridObj.selectionSettings.type = 'Single'; //for coverage
            gridObj.dataBind();
        });

        it('Row select false testing', () => {
            (gridObj.element.querySelectorAll('.e-row')[0].firstChild as HTMLElement).click();
            expect(gridObj.element.querySelectorAll('.e-row')[0].hasAttribute('aria-selected')).toBeFalsy();
        });

        it('keydown selection false testing', () => {
            gridObj.allowSelection = true;
            gridObj.dataBind();
            (gridObj.element.querySelectorAll('.e-row')[0].firstChild as HTMLElement).click();
            let preventDefault: Function = new Function();
            let args: any = { action: 'downArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);

            //for coverage
            (<any>gridObj.selectionModule).mouseDownHandler({ target: gridObj.element, preventDefault: () => { } });
            gridObj.allowRowDragAndDrop = true;
            gridObj.dataBind();
            (<any>gridObj.selectionModule).mouseDownHandler({ target: gridObj.element, preventDefault: () => { } });
            gridObj.isDestroyed = true;
            (<any>gridObj.selectionModule).addEventListener();
            gridObj.selectionModule.selectCell({ rowIndex: 1, cellIndex: 1 }, true);
            (<any>gridObj.selectionModule).isTrigger = true;
            gridObj.selectionModule.clearCellSelection();
            (<any>gridObj.selectionModule).isTrigger = false;
            gridObj.selectRow(1, true);
            (<any>gridObj.selectionModule).isRowSelected = true;
            (<any>gridObj.selectionModule).isTrigger = true;
            gridObj.selectionModule.clearRowSelection();
            (<any>gridObj.selectionModule).isTrigger = false;
            (<any>gridObj.selectionModule).prevECIdxs = undefined;
            gridObj.selectionModule.selectCell({ rowIndex: 1, cellIndex: 1 }, true);
            (<any>gridObj.selectionModule).prevECIdxs = undefined;
            gridObj.selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: 1, cellIndex: 1 });
            (<any>gridObj.selectionModule).prevECIdxs = undefined;
            gridObj.selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [0] }]);
            (<any>gridObj.selectionModule).prevECIdxs = undefined;
            gridObj.selectionModule.addCellsToSelection([{ rowIndex: 0, cellIndex: 0 }]);
            gridObj.selectionSettings.mode = 'Row';
            gridObj.dataBind();
            (<any>gridObj.selectionModule).applyHomeEndKey(0, 0);
            gridObj.allowRowDragAndDrop = true;
            gridObj.dataBind();
            (<any>gridObj.selectionModule).element = createElement('div');
            (<any>gridObj.selectionModule).startIndex = 0;
            (<any>gridObj.selectionModule).mouseMoveHandler({ target: gridObj.element, preventDefault: () => { }, clientX: 10, clientY: 10 });
            gridObj.selectionModule.destroy();
        });


        afterAll(() => {
            destroy(gridObj);
            gridObj = selectionModule = rows = cell = null;
        });
    });

    describe('clear selection cases with Freeze pane', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        let cell: HTMLElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    frozenColumns: 2,
                    frozenRows: 2,
                    dataSource: data,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                    selectionSettings: { type: 'Multiple', mode: 'Both' },
                }, done);
        });

        it('select cell and clear row selection testing', () => {
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            cell = rows[0].firstChild as HTMLElement;
            selectionModule.selectCell({ rowIndex: 1, cellIndex: 0 }, true);
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(rows[1].firstElementChild.classList.contains('e-cellselectionbackground')).toBeTruthy();
            cell.click();
            expect(cell.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(rows[1].firstElementChild.classList.contains('e-cellselectionbackground')).toBeFalsy();
        });

        it('row and cell toogle testing', () => {
            selectionModule.clearSelection();
            cell = rows[0].children[2] as HTMLElement;
            cell.click();
            expect(cell.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeTruthy();
            cell.click();
            expect(cell.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeFalsy();
        });

        it('row and cell same row testing', () => {
            selectionModule.clearSelection();
            cell.click();
            expect(cell.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeTruthy();
            (rows[0].querySelectorAll('.e-rowcell')[4] as HTMLElement).click();
            expect(cell.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeFalsy();
            expect(rows[0].querySelectorAll('.e-rowcell')[4].classList.contains('e-cellselectionbackground')).toBeTruthy();
            (rows[0].querySelectorAll('.e-rowcell')[4] as HTMLElement).click();
            expect(cell.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeFalsy();
            expect(rows[0].querySelectorAll('.e-rowcell')[4].classList.contains('e-cellselectionbackground')).toBeFalsy();
            (rows[0].querySelectorAll('.e-rowcell')[4] as HTMLElement).click();
            expect(cell.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(rows[0].querySelectorAll('.e-rowcell')[4].classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('keydown selection false testing', () => {
            gridObj.allowSelection = true;
            gridObj.dataBind();
            (gridObj.element.querySelectorAll('.e-row')[0].firstChild as HTMLElement).click();
            let preventDefault: Function = new Function();
            let args: any = { action: 'downArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.element.querySelectorAll('.e-row')[0].hasAttribute('aria-selected')).toBeFalsy();

            //for coverage
            (<any>gridObj.selectionModule).mouseDownHandler({ target: gridObj.element, preventDefault: () => { } });
            gridObj.allowRowDragAndDrop = true;
            gridObj.dataBind();
            (<any>gridObj.selectionModule).mouseDownHandler({ target: gridObj.element, preventDefault: () => { } });
            gridObj.isDestroyed = true;
            (<any>gridObj.selectionModule).addEventListener();
            gridObj.selectionModule.selectCell({ rowIndex: 1, cellIndex: 1 }, true);
            (<any>gridObj.selectionModule).isTrigger = true;
            gridObj.selectionModule.clearCellSelection();
            (<any>gridObj.selectionModule).isTrigger = false;
            gridObj.selectRow(1, true);
            (<any>gridObj.selectionModule).isRowSelected = true;
            (<any>gridObj.selectionModule).isTrigger = true;
            gridObj.selectionModule.clearRowSelection();
            (<any>gridObj.selectionModule).isTrigger = false;
            (<any>gridObj.selectionModule).prevECIdxs = undefined;
            gridObj.selectionModule.selectCell({ rowIndex: 1, cellIndex: 1 }, true);
            (<any>gridObj.selectionModule).prevECIdxs = undefined;
            gridObj.selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: 1, cellIndex: 1 });
            (<any>gridObj.selectionModule).prevECIdxs = undefined;
            gridObj.selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [0] }]);
            (<any>gridObj.selectionModule).prevECIdxs = undefined;
            gridObj.selectionModule.addCellsToSelection([{ rowIndex: 0, cellIndex: 0 }]);
            gridObj.selectionSettings.mode = 'Row';
            gridObj.dataBind();
            (<any>gridObj.selectionModule).applyHomeEndKey(0, 0);
            gridObj.allowRowDragAndDrop = true;
            gridObj.dataBind();
            (<any>gridObj.selectionModule).element = createElement('div');
            (<any>gridObj.selectionModule).startIndex = 0;
            (<any>gridObj.selectionModule).mouseMoveHandler({ target: gridObj.element, preventDefault: () => { }, clientX: 10, clientY: 10 });
            gridObj.selectionModule.destroy();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = selectionModule = rows = cell = null;
        });
    });

    describe('Model changes', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        let cell: HTMLElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: false,
                    selectionSettings: { type: 'Multiple', mode: 'Both' },
                }, done);
        });

        it('enable selection testing', (done: Function) => {
            let actionComplete = () => {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.allowSelection = true;
            gridObj.dataBind();
        });

        it('selction the row', () => {
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            cell = rows[0].firstChild as HTMLElement;
            selectionModule.selectRows([0, 1]);
            expect(cell.classList.contains('e-selectionbackground')).toBeTruthy();
        });


        it('selction type change row testing', () => {
            gridObj.selectionSettings.type = 'Single';
            gridObj.dataBind();
            expect(cell.classList.contains('e-selectionbackground')).toBeFalsy();
            gridObj.selectionSettings.type = 'Multiple';
            gridObj.dataBind();
        });

        it('cell selection testing', () => {
            selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: 1, cellIndex: 0 });
            expect(cell.classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('selction type change row testing', () => {
            gridObj.selectionSettings.type = 'Single';
            gridObj.dataBind();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeFalsy();
        });

        it('selection mode change to row', () => {
            gridObj.selectionSettings.mode = 'Row';
            gridObj.dataBind();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeFalsy();
        });
        it('select a row with wrong row index', () => {
            gridObj.selectRow(20, true);
            gridObj.dataBind();
            expect(gridObj.getContent().querySelectorAll('.e-selectionbackground').length).toBe(0);
        });
        it('selction type change row testing', () => {
            gridObj.selectionSettings.type = 'Multiple';
            gridObj.dataBind();
            expect(cell.classList.contains('e-selectionbackground')).toBeFalsy();
        });
        it('select multiple row with wrong index', () => {
            gridObj.selectRows([1, 3, 5, 15, 20]);
            gridObj.dataBind();
            //expect(gridObj.getContent().querySelectorAll('.e-selectionbackground').length).toBe(3 * gridObj.columns.length);
        });
        it('change selection mode row to cell', () => {
            gridObj.selectionSettings.mode = 'Cell';
            gridObj.dataBind();
            expect(gridObj.getContent().querySelectorAll('.e-selectionbackground').length).toBe(0);
        })
        it('select a cell with wrong object ', () => {
            gridObj.selectionModule.selectCell({ rowIndex: 0, cellIndex: 12 }, true);
            gridObj.dataBind();
            expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toBe(0);
        });
        it('select cells with wrong object ', () => {
            gridObj.selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [12, 15] }, { rowIndex: 5, cellIndexes: [1, 2] }]);
            gridObj.dataBind();
            expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toBe(2);
        });
        it('select cells with selectCellsByRange method ', () => {
            gridObj.selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 12 }, { rowIndex: 6, cellIndex: 12 });
            gridObj.dataBind();
            expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toBe(31);
        });


        afterAll(() => {
            destroy(gridObj);
            gridObj = selectionModule = rows = cell = null;
        });
    });
});


describe('Grid Touch Selection', () => {
    describe('touch selection', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        let gridPopUp: HTMLElement;
        let spanElement: Element;
        let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        beforeAll((done: Function) => {
            Browser.userAgent = androidPhoneUa;
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                    selectionSettings: { type: 'Multiple', mode: 'Both' },
                }, done);
        });

        it('gridPopUp display testing', () => {
            rows = gridObj.getRows();
            selectionModule = gridObj.selectionModule;
            gridPopUp = gridObj.element.querySelector('.e-gridpopup') as HTMLElement;
            spanElement = gridPopUp.querySelector('span');
            expect(gridPopUp.style.display).toBe('none');
        });

        it('single row testing', () => {
            (gridObj.getRows()[0].querySelector('.e-rowcell') as HTMLElement).click();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowIndexes.length).toBe(1);
            expect(gridPopUp.style.display).toBe('');
            expect(spanElement.classList.contains('e-rowselect')).toBeTruthy();
        });

        it('multi row  testing', () => {
            (spanElement as HTMLElement).click();
            expect(spanElement.classList.contains('e-spanclicked')).toBeTruthy();
            (gridObj.getRows()[1].querySelector('.e-rowcell') as HTMLElement).click();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
            expect(gridPopUp.style.display).toBe('');
            expect(spanElement.classList.contains('e-rowselect')).toBeTruthy();
        });

        it('gridpopup hide testing', () => {
            (spanElement as HTMLElement).click();
            expect(gridPopUp.style.display).toBe('none');
        });

        afterAll(() => {
            destroy(gridObj);
            let desktop: string = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
            Browser.userAgent = desktop;
            gridObj = selectionModule = rows = androidPhoneUa = spanElement = null;

        });
    });

    describe('touch selection with Freeze pane', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        let gridPopUp: HTMLElement;
        let spanElement: Element;
        let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        beforeAll((done: Function) => {
            Browser.userAgent = androidPhoneUa;
            gridObj = createGrid(
                {
                    frozenColumns: 2,
                    frozenRows: 2,
                    dataSource: data,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                    selectionSettings: { type: 'Multiple', mode: 'Both' },
                }, done);
        });

        it('gridPopUp display testing', () => {
            rows = gridObj.getRows();
            selectionModule = gridObj.selectionModule;
            gridPopUp = gridObj.element.querySelector('.e-gridpopup') as HTMLElement;
            spanElement = gridPopUp.querySelector('span');
            expect(gridPopUp.style.display).toBe('none');
        });

        it('single row testing', () => {
            (rows[0].querySelector('.e-rowcell') as HTMLElement).click();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowIndexes.length).toBe(1);
            expect(gridPopUp.style.display).toBe('');
            expect(spanElement.classList.contains('e-rowselect')).toBeTruthy();
        });

        it('multi row  testing', () => {
            (spanElement as HTMLElement).click();
            expect(spanElement.classList.contains('e-spanclicked')).toBeTruthy();
            (rows[2].querySelector('.e-rowcell') as HTMLElement).click();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
            expect(gridPopUp.style.display).toBe('');
            expect(spanElement.classList.contains('e-rowselect')).toBeTruthy();
        });

        it('gridpopup hide testing', () => {
            (spanElement as HTMLElement).click();
            expect(gridPopUp.style.display).toBe('none');
        });

        afterAll(() => {
            destroy(gridObj);
            let desktop: string = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
            Browser.userAgent = desktop;
            gridObj = selectionModule = rows = androidPhoneUa = spanElement = null;
        });
    });

    // select row/cell and navigate with grouped columns
    describe('select Row/cell after grouping', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        let rowSelecting: EmitType<Object>;
        let cellSelected: EmitType<Object>;
        let cellSelecting: EmitType<Object>;
        let previousRow: HTMLElement;
        let previousRowIndex: number;
        let previousRowCell: HTMLElement;
        let previousRowCellIndex: Object;
        let preventDefault: Function = new Function();
        let rows: HTMLElement[];
        let shiftEvt: MouseEvent = document.createEvent('MouseEvent');
        shiftEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            false, false, true, false, /* modifier keys */
            0 /*left*/, null
        );

        let ctrlEvt: MouseEvent = document.createEvent('MouseEvent');
        ctrlEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            true, false, false, false, /* modifier keys */
            0 /*left*/, null
        );
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { columns: ['EmployeeID', 'ShipCity'] },
                    allowSorting: true,
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('initial check', () => {
            expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(1);
            expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toBe(2);
            expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].querySelectorAll('.e-ungroupbutton').length).toBe(2);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(2);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell').length).toBe(2);
            expect(gridObj.getContentTable().querySelectorAll('.e-indentcell').length > 0).toBeTruthy();
            expect(gridObj.groupSettings.columns.length).toBe(2);
        });
        it('select a row', (done: Function) => {
            let rowSelected = (args: Object) => {
                expect((<HTMLTableCellElement>gridObj.getContent().querySelectorAll('.e-selectionbackground')[0]).innerHTML).
                    toEqual(gridObj.currentViewData['records'][0]['OrderID'].toString());
                expect(JSON.stringify(args['data'])).toEqual(JSON.stringify(gridObj.getSelectedRecords()[0]));
                expect(args['rowIndex']).toBe(gridObj.getSelectedRowIndexes()[0]);
                expect(args['row']).toEqual(gridObj.getSelectedRows()[0]);
                expect(args['previousRow']).toBeUndefined();
                expect(args['previousRowIndex']).toBeUndefined();
                previousRow = args['previousRow'];
                previousRowIndex = args['previousRowIndex'];
                expect(gridObj.getRows()[0].children[2].hasAttribute('aria-selected')).toBeTruthy();
                done();
            };
            rowSelecting = (args: Object) => {
                expect(JSON.stringify(args['data'])).not.toBeUndefined();
                expect(args['rowIndex']).toBe(0);
                expect(args['row']).toEqual(gridObj.getRows()[0]);
                expect(args['previousRow']).toBeUndefined();
                expect(args['previousRowIndex']).toBeUndefined();
                expect(args['isCtrlPressed']).toBeFalsy();
                expect(args['isShiftPressed']).toBeFalsy();
            };
            gridObj.rowSelected = rowSelected;
            gridObj.rowSelecting = rowSelecting;
            (<HTMLElement>gridObj.getRows()[0].children[2]).click();
        });

        it('Check selected records', () => {
            let selectedData: Object[] = gridObj.getSelectedRecords();
            expect((<HTMLTableCellElement>gridObj.getContent().querySelectorAll('.e-selectionbackground')[0]).innerHTML).
                toEqual(selectedData[0]['OrderID'].toString());
            gridObj.rowSelected = undefined;
            gridObj.rowSelecting = undefined;
        });

        it('DeSelect a row', (done: Function) => {
            gridObj.rowSelected = undefined;
            gridObj.rowSelecting = undefined;
            let rowDeSelecting: EmitType<Object> = (args: Object) => {
                expect(args['data']).not.toEqual(undefined);
                expect(args['rowIndex']).toEqual(0);
                expect(args['row']).toEqual(gridObj.getRows()[0]);
            };
            let rowDeSelected: EmitType<Object> = (args: Object) => {
                expect(args['data']).not.toEqual(undefined);
                expect(args['rowIndex']).toEqual(0);
                expect(args['row']).toEqual(gridObj.getRows()[0]);
                gridObj.rowSelected = undefined;
                gridObj.rowSelecting = undefined;
                done();
            };
            gridObj.rowDeselecting = rowDeSelecting;
            gridObj.rowDeselected = rowDeSelected;
            gridObj.selectRow(0, true);
        });

        //key board handling with grouping in row selection
        it('press up arrow', () => {
            gridObj.rowDeselecting = undefined;
            gridObj.rowDeselected = undefined;
            gridObj.selectRow(0, true);
            let args: any = { action: 'upArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[3].classList.contains('e-selectionbackground')).toBeFalsy();
            expect(gridObj.getRows()[0].children[3].hasAttribute('aria-selected')).toBeFalsy(); 
        });

        it('press ctrl+home arrow', () => {
            gridObj.rowSelected = undefined;
            gridObj.rowSelecting = undefined;
            let args: any = { action: 'ctrlHome', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[3].classList.contains('e-selectionbackground')).toBeFalsy();
            expect(gridObj.getRows()[0].children[2].hasAttribute('aria-selected')).toBeFalsy();
            expect(gridObj.getRows()[1].children[3].hasAttribute('aria-selected')).toBeFalsy();
        });

        it('press ctrl+end arrow', () => {
            gridObj.rowSelected = undefined;
            gridObj.rowSelecting = undefined;
            let args: any = { action: 'ctrlEnd', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[3].classList.contains('e-selectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[gridObj.columns.length - 1].hasAttribute('aria-selected')).toBeTruthy();
            expect(gridObj.getRows()[0].children[2].hasAttribute('aria-selected')).toBeFalsy();
        });

        // it('press down arrow', () => {
        //     let args: any = { action: 'downArrow', preventDefault: preventDefault };
        //     gridObj.keyboardModule.keyAction(args);
        //     expect(gridObj.getRows()[gridObj.getRows().length - 1].children[3].classList.contains('e-selectionbackground')).toBeTruthy();
        // });

        it('select multiple row with selction type "single"', () => {
            gridObj.selectRows([1, 2, 4]);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[3].classList.contains('e-selectionbackground')).toBeFalsy();
            expect(gridObj.getRows()[4].children[3].classList.contains('e-selectionbackground')).toBeTruthy();
            gridObj.selectionSettings.type = 'Multiple';
            gridObj.clearSelection();
            gridObj.selectRow(11);
            gridObj.dataBind();
        });

        it('Shift plus click event', () => {
            gridObj.getRows()[gridObj.getRows().length - 4].children[3].dispatchEvent(shiftEvt);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].querySelectorAll('.e-selectionbackground').length).toBe(6);
            expect(gridObj.getRows()[gridObj.getRows().length - 2].querySelectorAll('.e-selectionbackground').length).toBe(6);
            expect(gridObj.getRows()[gridObj.getRows().length - 3].querySelectorAll('.e-selectionbackground').length).toBe(6);
            expect(gridObj.getRows()[gridObj.getRows().length - 4].querySelectorAll('.e-selectionbackground').length).toBe(6);
            expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(24);
        });

        it('ctrl plus click', () => {
            gridObj.getRows()[1].children[3].dispatchEvent(ctrlEvt);
            expect(gridObj.getRows()[1].querySelectorAll('.e-selectionbackground').length).toBe(6);
            expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(30);
            expect(gridObj.getRows()[1].children[3].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('clear row selections', () => {
            gridObj.selectionModule.clearRowSelection();
            expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(0);
        });

        it('select a cell', (done: Function) => {
            cellSelecting = (args: Object) => {
                expect(JSON.stringify(args['data'])).not.toBeUndefined();
                expect(JSON.stringify(args['cellIndex'])).toEqual(JSON.stringify({ rowIndex: 0, cellIndex: 0 }));
                expect(args['currentCell']).toEqual(gridObj.getRows()[0].children[2]);
                expect(args['previousRowCellIndex']).toBeUndefined();
                expect(args['previousRowCell']).toBeUndefined();
                expect(args['isCtrlPressed']).toBeFalsy();
                expect(args['isShiftPressed']).toBeFalsy();
            };
            cellSelected = (args: Object) => {
                expect(JSON.stringify(args['data'])).not.toBeUndefined();
                expect(JSON.stringify(args['cellIndex'])).toEqual(JSON.stringify({ rowIndex: 0, cellIndex: 0 }));
                expect(args['currentCell']).toEqual(gridObj.getRows()[0].children[2]);
                expect(JSON.stringify(args['previousRowCellIndex'])).toBeUndefined();
                expect(args['previousRowCell']).toBeUndefined();
                expect(JSON.stringify(args['selectedRowCellIndex'])).toEqual(JSON.stringify([{ rowIndex: 0, cellIndexes: [0] }]));
                expect(gridObj.getRows()[0].children[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
                previousRowCell = args['previousRowCell'];
                previousRowCellIndex = args['selectedRowCellIndex'];
                done();
            };
            gridObj.selectionSettings.mode = 'Cell';
            gridObj.selectionSettings.type = 'Single';
            gridObj.cellSelected = cellSelected;
            gridObj.cellSelecting = cellSelecting;
            gridObj.dataBind();
            gridObj.selectCell({ rowIndex: 0, cellIndex: 0 }, true);
        });

        it('DeSelect a cell', (done: Function) => {
            gridObj.cellSelected = undefined;
            gridObj.cellSelecting = undefined;
            let cellDeSelecting: EmitType<Object> = (args: Object) => {
                expect(args['data']).not.toEqual(undefined);
                expect(args['cellIndexes'][0]['cellIndexes'][0]).toEqual(0);
                expect(args['cellIndexes'][0]['rowIndex']).toEqual(0);
                expect(args['cells'][0]).toEqual(gridObj.getRows()[0].children[2]);
            };
            let cellDeSelected: EmitType<Object> = (args: Object) => {
                expect(args['data']).not.toEqual(undefined);
                expect(args['cellIndexes'][0]['cellIndexes'][0]).toEqual(0);
                expect(args['cellIndexes'][0]['rowIndex']).toEqual(0);
                expect(args['cells'][0]).toEqual(gridObj.getRows()[0].children[2]);
                gridObj.selectCell({ rowIndex: 0, cellIndex: 0 }, true);
                done();
            };
            gridObj.cellDeselecting = cellDeSelecting;
            gridObj.cellDeselected = cellDeSelected;
            gridObj.selectCell({ rowIndex: 0, cellIndex: 0 }, true);
        });

        //key board handling with grouping in cell selection
        it('press left arrow', () => {
            gridObj.cellDeselecting = undefined;
            gridObj.cellDeselected = undefined;
            let args: any = { action: 'leftArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[2].classList.contains('e-cellselectionbackground')).toBeFalsy();
        });
        it('press right arrow', (done: Function) => {
            cellSelecting = (args: Object) => {
                expect(JSON.stringify(args['data'])).not.toBeUndefined();
                expect(JSON.stringify(args['cellIndex'])).toEqual(JSON.stringify({ rowIndex: 0, cellIndex: 1 }));
                expect(args['currentCell']).toEqual(gridObj.getRows()[0].children[3]);
                expect(JSON.stringify(args['previousRowCellIndex'])).toEqual(JSON.stringify({ rowIndex: 0, cellIndex: 0 }));
                expect(args['previousRowCell']).toEqual(gridObj.getRows()[0].children[2]);
                expect(args['isCtrlPressed']).toBeFalsy();
                expect(args['isShiftPressed']).toBeFalsy();
            };
            cellSelected = (args: Object) => {
                expect(JSON.stringify(args['data'])).not.toBeUndefined();
                expect(JSON.stringify(args['cellIndex'])).toEqual(JSON.stringify({ rowIndex: 0, cellIndex: 1 }));
                expect(args['currentCell']).toEqual(gridObj.getRows()[0].children[3]);
                expect(JSON.stringify(args['previousRowCellIndex'])).toEqual(JSON.stringify({ rowIndex: 0, cellIndex: 0 }));
                expect(args['previousRowCell']).toEqual(gridObj.getRows()[0].children[2]);
                expect(JSON.stringify(args['selectedRowCellIndex'])).toEqual(JSON.stringify([{ rowIndex: 0, cellIndexes: [1] }]));
                expect(gridObj.getRows()[0].children[3].classList.contains('e-cellselectionbackground')).toBeTruthy();
                done();
            };
            gridObj.cellSelected = cellSelected;
            gridObj.cellSelecting = cellSelecting;
            let args: any = { action: 'rightArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
        });

        it('press up arrow', () => {
            gridObj.cellSelected = undefined;
            gridObj.cellSelecting = undefined;
            let args: any = { action: 'upArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[3].classList.contains('e-cellselectionbackground')).toBeFalsy();
        });
        it('press down arrow', () => {
            let args: any = { action: 'downArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('press ctrl+home arrow', () => {
            let args: any = { action: 'ctrlHome', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[2].classList.contains('e-cellselectionbackground')).toBeFalsy();
        });

        it('press ctrl+end arrow', () => {
            let args: any = { action: 'ctrlEnd', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].lastElementChild.classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('press right arrow', () => {
            let args: any = { action: 'rightArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].lastElementChild.classList.contains('e-cellselectionbackground')).toBeFalsy();
        });

        it('selct multiple cell with selection type "single" ', () => {
            gridObj.selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [1, 2, 3] }]);
            expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toBe(0);
        });

        it('change selection Type as multiple', () => {
            gridObj.selectionSettings.type = 'Multiple';
            gridObj.dataBind();
            expect(gridObj.getRows()[gridObj.getRows().length - 1].lastElementChild.classList.contains('e-cellselectionbackground')).toBeFalsy();
        });

        it('press shiftUp arrow', () => {
            let args: any = { action: 'shiftUp', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toBe(gridObj.getColumns().length + 1);
        });

        it('press shiftDown arrow', () => {
            let args: any = { action: 'shiftDown', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].querySelectorAll('.e-cellselectionbackground').length).toBe(1);
        });

        it('press shiftLeft arrow', () => {
            let args: any = { action: 'shiftLeft', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].querySelectorAll('.e-cellselectionbackground').length).toBe(3);
        });

        it('press shiftRight arrow', () => {
            let args: any = { action: 'shiftRight', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].lastElementChild.classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('press shift+click arrow', () => {
            gridObj.getRows()[gridObj.getRows().length - 2].children[3].dispatchEvent(shiftEvt);
            expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toBe(11);
        });

        it('press ctrl+click arrow', () => {
            gridObj.getRows()[gridObj.getRows().length - 4].children[3].dispatchEvent(ctrlEvt);
            expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toBe(12);
        });

        it('press ctrlPlusA ', () => {
            let args: any = { action: 'ctrlPlusA', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toBe(gridObj.getColumns().length * gridObj.getRows().length);
        });

        it('clear cell Selection', () => {
            gridObj.selectionModule.clearCellSelection();
            expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(0);
            (gridObj.selectionModule as any).addRemoveClassesForRow(null, false, false);
            (gridObj.selectionModule as any).isDragged = true;
            (gridObj.selectionModule as any).isMultiCtrlRequest = false;
            (gridObj.selectionModule as any).isMultiShiftRequest = false;
            (gridObj.selectionModule as any).rowCellSelectionHandler(1, 1);
            (gridObj.selectionModule as any).beforeFragAppend({ requrestType: 'virtualscroll' });
            (gridObj.selectionModule as any).clearSelAfterRefresh({ requrestType: 'virtualscroll' });
        });

        it('ctrl cell selection', () => {
            // check row object and idx
            gridObj.selectionModule.addCellsToSelection([{ rowIndex: 0, cellIndex: 3 }]);
            expect(gridObj.getRows()[0].children[5].classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = rowSelecting = cellSelected = rows = cellSelecting = preventDefault = null;
        });
    });

    // navigate selected cells with hidden columns
    describe('select Row/cell in show/hide', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        let columns: any;
        let rowSelected: EmitType<Object>;
        let rowSelecting: EmitType<Object>;
        let cellSelected: EmitType<Object>;
        let cellSelecting: EmitType<Object>;
        let previousRow: HTMLElement;
        let previousRowIndex: number;
        let previousRowCell: HTMLElement;
        let previousRowCellIndex: Object;
        let preventDefault: Function = new Function();
        let shiftEvt: MouseEvent = document.createEvent('MouseEvent');
        shiftEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            false, false, true, false, /* modifier keys */
            0 /*left*/, null
        );

        let ctrlEvt: MouseEvent = document.createEvent('MouseEvent');
        ctrlEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            true, false, false, false, /* modifier keys */
            0 /*left*/, null
        );

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID', headerText: 'Order ID', visible: false },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID', visible: false },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country', visible: false }],
                    allowPaging: true,
                    selectionSettings: { mode: 'Cell', type: 'Multiple' },
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('initial check', () => {
            expect(gridObj.getHeaderContent().querySelectorAll('.e-headercell.e-hide').length).toBe(3);
            expect(gridObj.getContentTable().querySelectorAll('.e-hide').length).toBe(36);
        });

        it('select a cell', (done: Function) => {
            cellSelected = (args: Object) => {
                expect(gridObj.getRows()[0].children[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
                expect(gridObj.getRows()[0].children[1].hasAttribute('aria-selected')).toBeTruthy();
                done();
            };
            gridObj.cellSelected = cellSelected;
            gridObj.selectCell({ rowIndex: 0, cellIndex: 1 }, true);
            gridObj.dataBind();
        });

        //key board handling with hidden in cell selection
        it('press left arrow', () => {
            gridObj.cellSelected = undefined;
            let args: any = { action: 'leftArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[0].children[1].hasAttribute('aria-selected')).toBeTruthy();
        });
        it('press right arrow', () => {
            let args: any = { action: 'rightArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[3].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[0].children[3].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('press up arrow', () => {
            let args: any = { action: 'upArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[3].classList.contains('e-cellselectionbackground')).toBeFalsy();
            expect(gridObj.getRows()[0].children[3].hasAttribute('aria-selected')).toBeFalsy();
        });
        it('press down arrow', () => {
            let args: any = { action: 'downArrow', preventDefault: preventDefault, target: document.activeElement };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[3].classList.contains('e-cellselectionbackground')).toBeTruthy();
        });

        it('press ctrl+home arrow', () => {
            let args: any = { action: 'ctrlHome', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[0].children[1].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('press ctrl+end arrow', () => {
            let args: any = { action: 'ctrlEnd', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('press right arrow', () => {
            let args: any = { action: 'rightArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('change selection Type as multiple', () => {
            gridObj.selectionSettings.type = 'Multiple';
            gridObj.dataBind();
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('press shiftUp arrow', () => {
            let args: any = { action: 'shiftUp', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toBe(gridObj.getColumns().length + 1);
            expect(gridObj.getRows()[gridObj.getRows().length - 2].children[4].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('press shiftDown arrow', () => {
            let args: any = { action: 'shiftDown', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].querySelectorAll('.e-cellselectionbackground').length).toBe(1);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('press shiftLeft arrow', () => {
            let args: any = { action: 'shiftLeft', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].querySelectorAll('.e-cellselectionbackground').length).toBe(2);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[3].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('press shiftRight arrow', () => {
            let args: any = { action: 'shiftRight', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].hasAttribute('aria-selected')).toBeTruthy();
        });

        it('clear cell Selection', () => {
            gridObj.selectionModule.clearCellSelection();
            expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(0);
            expect(gridObj.getRows()[gridObj.getRows().length - 1].children[4].hasAttribute('aria-selected')).toBeFalsy();
            gridObj.selectionModule = null;
            gridObj.getSelectedRows();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = rowSelecting = cellSelected = cellSelecting = preventDefault = null;
        });
    });
    // navigate selected cells with hidden columns
    describe('cell span selection', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        let columns: any;
        let rowSelected: EmitType<Object>;
        let rowSelecting: EmitType<Object>;
        let cellSelected: EmitType<Object>;
        let cellSelecting: EmitType<Object>;
        let previousRow: HTMLElement;
        let previousRowIndex: number;
        let previousRowCell: HTMLElement;
        let previousRowCellIndex: Object;
        let preventDefault: Function = new Function();
        let shiftEvt: MouseEvent = document.createEvent('MouseEvent');
        shiftEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            false, false, true, false, /* modifier keys */
            0 /*left*/, null
        );

        let ctrlEvt: MouseEvent = document.createEvent('MouseEvent');
        ctrlEvt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            true, false, false, false, /* modifier keys */
            0 /*left*/, null
        );
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowPaging: true,
                    selectionSettings: { mode: 'Cell', type: 'Multiple' },
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    queryCellInfo: function (args: QueryCellInfoEventArgs) {
                        if (args.column.field === 'OrderID' && args.data['OrderID'] === 10248) {
                            args.colSpan = 2;
                        }
                        if (args.column.field === 'ShipCity' && args.data['ShipCity'] === 'Münster') {
                            args.colSpan = 2;
                        }
                    }
                }, done);
        });

        it('select after spanned cell', (done: Function) => {
            cellSelected = (args: Object) => {
                expect(gridObj.getRows()[0].children[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
                expect(gridObj.getRows()[0].children[1].hasAttribute('aria-selected')).toBeTruthy();
                expect(parseInt(gridObj.getRows()[0].children[1].getAttribute('aria-colindex'), 10) - 1).toBe(2);
                gridObj.cellSelected = undefined;
                done();
            };
            gridObj.cellSelected = cellSelected;
            gridObj.selectCell({ rowIndex: 0, cellIndex: 2 }, true);
            gridObj.dataBind();
        });

        it('press left arrow from adjacent cell of spanned cell', () => {
            ``
            let args: any = { action: 'leftArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].children[0].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[0].children[0].hasAttribute('aria-selected')).toBeTruthy();
        });
        it('press right arrow to select span cell from left adjacent cell', () => {
            gridObj.selectCell({ rowIndex: 1, cellIndex: 3 }, true);
            let args: any = { action: 'rightArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[1].children[4].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[1].children[4].hasAttribute('aria-selected')).toBeTruthy();
        });
        it('press right arrow from spanned cell', () => {
            let args: any = { action: 'rightArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[2].children[0].classList.contains('e-cellselectionbackground')).toBeFalsy();
            expect(gridObj.getRows()[2].children[0].hasAttribute('aria-selected')).toBeFalsy();
        });

        it('press up arrow', () => {
            let args: any = { action: 'upArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[0].querySelector('.e-cellselectionbackground')).not.toBeNull();
        });
        it('press down arrow', () => {
            let args: any = { action: 'downArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[1].querySelector('.e-cellselectionbackground')).not.toBeNull();
        });

        it('press shiftDown arrow', () => {
            let args: any = { action: 'shiftDown', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[2].querySelectorAll('.e-cellselectionbackground')).not.toBeNull();
        });

        it('press shiftUp arrow', () => {
            let args: any = { action: 'shiftUp', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getContent().querySelectorAll('.e-cellselectionbackground').length).toBe(1);
        });


        it('press shiftLeft arrow', () => {
            let args: any = { action: 'shiftLeft', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[1].querySelectorAll('.e-cellselectionbackground').length).toBe(2);
            expect(gridObj.getRows()[1].querySelectorAll('[aria-selected]')).not.toBeNull();
        });

        it('press shiftRight arrow', () => {
            let args: any = { action: 'shiftRight', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[1].querySelectorAll('.e-cellselectionbackground').length).toBe(1);
        });

        it('ctrl click', () => {
            gridObj.getRows()[1].children[4].dispatchEvent(ctrlEvt);
            gridObj.getRows()[0].children[0].dispatchEvent(ctrlEvt);
            gridObj.getRows()[0].children[4].dispatchEvent(ctrlEvt);
            expect(gridObj.getRows()[0].querySelectorAll('.e-cellselectionbackground').length).toBe(2);
            expect(gridObj.getRows()[1].querySelectorAll('.e-cellselectionbackground').length).toBe(0);
            expect(gridObj.getRows()[2].querySelectorAll('.e-cellselectionbackground').length).toBe(0);
        });
        it('press down arrow to spanned cell', () => {
            gridObj.selectCell({ rowIndex: 0, cellIndex: 5 }, true);
            let args: any = { action: 'downArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.getRows()[1].children[4].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(gridObj.getRows()[1].children[4].hasAttribute('aria-selected')).toBeTruthy();
        });

        afterAll((done) => {
            destroy(gridObj);
            setTimeout(function () {
                done();
            }, 1000);
            gridObj = rowSelecting = cellSelected = cellSelecting = preventDefault = null;
        });
    });

    describe('Grid Selection Issue Fixes', () =>{
        let gridObj: Grid;
        beforeAll((done) => {
            gridObj = createGrid({
                    dataSource: data,
                    columns: [
                    { type: 'checkbox', width: 50 },    
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' }],
                    allowPaging: true,
                    selectedRowIndex: 0
            }, done);
        });

        it('change selectedrowindex', () => {
          gridObj.selectedRowIndex = 3,
          gridObj.dataBind();
          let rows = gridObj.getRows();
          expect(rows[3].hasAttribute('aria-selected')).toBeTruthy();
          expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
          expect(gridObj.getSelectedRecords().length).toBe(1);
          expect(gridObj.getSelectedRowIndexes().length).toBe(1);
        });

        it('check de select', (done: Function) => {
            gridObj.rowDeselected = () => {
                expect(true).toBeTruthy();
                done();
            };
            gridObj.selectRow(0, true);
        });

        it('EJ2-6930-Check all checkbox issue', () => {
            gridObj.refreshHeader();
            (<HTMLElement>gridObj.element.querySelector('.e-checkselectall')).click();
            expect((<any>gridObj.element.querySelector('.e-checkselectall').nextSibling).classList.contains('e-check')).toBeTruthy();
        });

        it('EJ2-7517- Group Toogle button check', () => {
            gridObj.groupSettings.showToggleButton = true;
            gridObj.dataBind();
            expect((<any>gridObj.element.querySelector('.e-headerchkcelldiv').querySelector('.e-grptogglebtn'))).toBeNull();
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Grid checkboxOnly keyboard Selection Issue Fixes', () =>{
        let gridObj: Grid;
        let preventDefault: Function = new Function();
        beforeAll((done) => {
            gridObj = createGrid({
                    dataSource: data,
                    allowSelection: true,
                    selectionSettings: { persistSelection: true, checkboxOnly: true },
                    columns: [
                    { type: 'checkbox', width: 50 },    
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' }]
            }, done);
        });

        it('focus 1st row 2nd cell and press down arrow action', () => {
            gridObj.isPersistSelection = true;
            let args: any = { action: 'altW', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            let args1: any = { action: 'rightArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args1);
        });

        it('check selected records and select checkbox action', () => {
	    let args2: any = { action: 'downArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args2);
            expect(gridObj.selectionModule.selectedRecords.length).toBe(0);
	    let args3: any = { action: 'space', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args3);
            expect(gridObj.selectionModule.selectedRecords.length).toBe(0);
            let args1: any = { action: 'leftArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args1);
            let args: any = { action: 'space', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
        });

        it('check selected records and deselect action', () => {
            expect(gridObj.selectionModule.selectedRecords.length).toBe(1);
            let args: any = { action: 'space', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.selectionModule.selectedRecords.length).toBe(0);
        });

        it('change checkboxOnly mode as false and check navigate focus to down', () => {
            gridObj.selectionSettings.checkboxOnly = false;
            let args: any = { action: 'downArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
        });

        it('check selected records and clear selection action', () => {
            expect(gridObj.selectionModule.selectedRecords.length).toBe(1);
            gridObj.clearSelection();
        });

        it('focus header checkbox, select checkall and navigate focus to down', () => {
            gridObj.selectionSettings.persistSelection = false;
            gridObj.selectionSettings.checkboxOnly = true;
            (<HTMLElement>gridObj.element.querySelector('.e-checkselectall')).click();
            let args1: any = { action: 'downArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args1);
        });

        it('check select all datas', () => {
            expect(gridObj.selectionModule.selectedRowIndexes.length).toBe((gridObj.dataSource as object[]).length);
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('virtualization enabled Grid checkboxOnly keyboard Selection Issue =>', () =>{
        let gridObj: Grid;
        let preventDefault: Function = new Function();
        beforeAll((done) => {
            gridObj = createGrid({
                    dataSource: data,
                    allowSelection: true,
                    enableVirtualization: true,
                    selectionSettings: { persistSelection: true, checkboxOnly: true },
                    columns: [
                    { type: 'checkbox', width: 50 },    
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' }]
            }, done);
        });

        it('focus 1st row 2nd cell and press down arrow action', () => {
            gridObj.isPersistSelection = true;
            let args: any = { action: 'altW', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            let args1: any = { action: 'rightArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args1);
        });

        it('check selected records and select checkbox action', () => {
            let args2: any = { action: 'downArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args2);
            expect(gridObj.selectionModule.selectedRecords.length).toBe(0);
            let args3: any = { action: 'space', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args3);
            expect(gridObj.selectionModule.selectedRecords.length).toBe(0);
            let args1: any = { action: 'leftArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args1);
            let args: any = { action: 'space', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
        });

        it('check selected records and deselect action', () => {
            expect(gridObj.selectionModule.selectedRecords.length).toBe(1);
            let args: any = { action: 'space', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(gridObj.selectionModule.selectedRecords.length).toBe(0);
        });

        it('change checkboxOnly mode as false and check navigate focus to down', () => {
            gridObj.selectionSettings.checkboxOnly = false;
            let args: any = { action: 'downArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
        });

        it('check selected records and clear selection action', () => {
            expect(gridObj.selectionModule.selectedRecords.length).toBe(1);
            gridObj.clearSelection();
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Cell Selection Issue Fixes', () =>{
        let gridObj: Grid;
        let cellSelected: EmitType<Object>;
        beforeAll((done) => {
            gridObj = createGrid({
                    dataSource: data,
                    allowPaging: true,
                    allowSelection: true,
                    selectionSettings: { mode: 'Cell' },
                    enableHover: false,
                    columns: [
                        { type: 'checkbox', width: 50 },
                        { field: 'OrderID', headerText: 'OrderID', width: 180 },
          {
            headerText: 'Employee Image', textAlign: 'Center',
            template: '<div>${CustomerID}</div>', width: 150
        },
            { field: 'ShipPostalCode', headerText: 'ShipPostalCode', width: 195, textAlign: 'Right' },
            { field: 'ShipCity', headerText: 'ShipCity', width: 120 },
            { field: 'ShipCountry', headerText: 'ShipCountry', width: 130}
                    ],
                    pageSettings: { pageCount: 2 },
                    cellSelected: cellSelected
                }, done);
        });
        it('select the cell', () => {
            expect(gridObj.getRows()[0].children[0].classList.contains('e-gridchkbox')).toBeTruthy();
        });
        it('select the cell', () => {
            cellSelected = (args: {currentCell: any}) => {
                expect(args.currentCell.classList.contains('e-cellselectionbackground')).toBeTruthy();
                gridObj.cellSelected = undefined;
            };
            gridObj.cellSelected = cellSelected;
            gridObj.selectCell({ rowIndex: 0, cellIndex: 2 }, true);
            gridObj.dataBind();
        });
            afterAll(() => {
            destroy(gridObj);
            gridObj = cellSelected = null;
        });
    });

    // describe('Grid checkbox selection functionality', () => {
    //     describe('grid checkbox selection functionality with persist selection', () => {
    //         let gridObj: Grid;
    //         let elem: HTMLElement = createElement('div', { id: 'Grid' });
    //         let selectionModule: Selection;
    //         let rows: Element[];
    //         let preventDefault: Function = new Function();
    //         let chkAllObj: HTMLElement;
    //         beforeAll((done: Function) => {
    //             let dataBound: EmitType<Object> = () => { done(); };
    //             document.body.appendChild(elem);
    //             gridObj = new Grid(
    //                 {
    //                     dataSource: data, dataBound: dataBound,
    //                     columns: [
    //                         { type: 'checkbox', width: 50 },
    //                         { headerText: 'OrderID', isPrimaryKey: true, field: 'OrderID' },
    //                         { headerText: 'CustomerID', field: 'CustomerID' },
    //                         { headerText: 'EmployeeID', field: 'EmployeeID' },
    //                         { headerText: 'ShipCountry', field: 'ShipCountry' },
    //                         { headerText: 'ShipCity', field: 'ShipCity' },
    //                     ],
    //                     allowSelection: true,
    //                     pageSettings: { pageSize: 5 },
    //                     allowPaging: true,
    //                     allowSorting: true,
    //                     selectionSettings: { persistSelection: true }
    //                 });
    //             gridObj.appendTo('#Grid');
    //         });

    //         it('checkbox selection with persist selection on paging', () => {
    //             selectionModule = gridObj.selectionModule;
    //             rows = gridObj.getRows();
    //             chkAllObj = gridObj.element.querySelector('.e-checkselectall') as HTMLElement;
    //             selectionModule.selectRows([1, 2]);
    //             expect(rows[1].hasAttribute('aria-selected')).toBeTruthy();
    //             expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
    //             expect(!isNullOrUndefined(rows[1].querySelector('.e-checkselect'))).toBeTruthy();
    //             expect(rows[2].hasAttribute('aria-selected')).toBeTruthy();
    //             expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
    //             expect(!isNullOrUndefined(rows[2].querySelector('.e-checkselect'))).toBeTruthy();
    //             expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(12);
    //             expect(selectionModule.selectedRecords.length).toBe(2);
    //             expect(selectionModule.selectedRowIndexes.length).toBe(2);
    //             expect(chkAllObj.nextElementSibling.classList.contains('e-stop')).toBeTruthy();
    //             gridObj.goToPage(2);
    //             gridObj.goToPage(1);
    //             expect(rows[1].hasAttribute('aria-selected')).toBeTruthy();
    //             expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
    //             expect(!isNullOrUndefined(rows[1].querySelector('.e-checkselect'))).toBeTruthy();
    //             expect(rows[2].hasAttribute('aria-selected')).toBeTruthy();
    //             expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
    //             expect(!isNullOrUndefined(rows[2].querySelector('.e-checkselect'))).toBeTruthy();
    //             expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(12);
    //             expect(selectionModule.selectedRecords.length).toBe(2);
    //             expect(selectionModule.selectedRowIndexes.length).toBe(2);
    //             expect(chkAllObj.nextElementSibling.classList.contains('e-stop')).toBeTruthy();
    //             (gridObj.element.querySelectorAll('.e-checkselect')[0] as HTMLElement).click();
    //             expect(chkAllObj.nextElementSibling.classList.contains('e-stop')).toBeTruthy();
    //         });

    //         it('checkbox selection with check all checkbox', () => {
    //             (gridObj.element.querySelector('.e-checkselectall') as HTMLElement).click();
    //             (gridObj.element.querySelector('.e-checkselectall') as HTMLElement).click();
    //             expect(!chkAllObj.nextElementSibling.classList.contains('e-stop')).toBeTruthy();
    //             (gridObj.getCellFromIndex(0, 1) as HTMLElement).click();
    //         });

    //         it('checkbox selection through down and up keys', () => {
    //             let args: any = { action: 'downArrow', preventDefault: preventDefault };
    //             for (let i = 0; i < rows.length; i++) {
    //                 args.target = (rows[i].querySelector('.e-checkselect') as HTMLElement);
    //                 gridObj.keyboardModule.keyAction(args);
    //             }
    //             args.action = 'upArrow';
    //             for (let i = 0; i < rows.length; i++) {
    //                 args.target = (rows[i].querySelector('.e-checkselect') as HTMLElement);
    //                 gridObj.keyboardModule.keyAction(args);
    //             }
    //             (gridObj.element.querySelector('.e-checkselectall') as HTMLElement).click();
    //             args.action = 'downArrow';
    //             args.target = (gridObj.element.querySelector('.e-checkselectall') as HTMLElement);
    //             gridObj.keyboardModule.keyAction(args);
    //             (gridObj.element.querySelector('.e-checkselectall') as HTMLElement).click();
    //             expect(!chkAllObj.nextElementSibling.classList.contains('e-stop')).toBeTruthy();
    //         });

    //         it('checkbox selection through space key', () => {
    //             gridObj.element.focus();
    //             (<any>gridObj).focusModule.setActive(true);
    //             let args: any = { action: 'space', preventDefault: preventDefault };
    //             let chkBox: HTMLElement = (rows[2].querySelector('.e-checkselect') as HTMLElement);
    //             args.target = chkBox;
    //             gridObj.keyboardModule.keyAction(args);
    //             chkBox = (gridObj.element.querySelector('.e-checkselectall') as HTMLElement);
    //             args.target = chkBox;
    //             gridObj.keyboardModule.keyAction(args);
    //             (gridObj.element.querySelector('.e-checkselectall') as HTMLElement).click();
    //             expect(!chkAllObj.nextElementSibling.classList.contains('e-stop')).toBeTruthy();    
    //         });   

    //         afterAll(() => {
    //             gridObj.destroy();
    //             remove(elem);
    //         });
    //     });

    //     describe('grid checkbox selection functionality with dialog editing', () => {
    //         let gridObj: Grid;
    //         let elem: HTMLElement = createElement('div', { id: 'Grid' });
    //         let selectionModule: Selection;
    //         let chkAllObj: HTMLElement;
    //         let rows: Element[];
    //         beforeAll((done: Function) => {
    //             let dataBound: EmitType<Object> = () => { gridObj.dataBound = null; gridObj.element.focus(); done(); };
    //             document.body.appendChild(elem);
    //             gridObj = new Grid(
    //                 {
    //                     dataSource: employeeSelectData, dataBound: dataBound,
    //                     columns: [
    //                         { type: 'checkbox', width: 50 },
    //                         { field: 'EmployeeID', isPrimaryKey: true, headerText: 'Employee ID', textAlign: 'Right', width: 135, },
    //                         { field: 'FirstName', headerText: 'Name', width: 125 },
    //                         { field: 'Title', headerText: 'Title', width: 180 },
    //                     ],
    //                     allowSelection: true,
    //                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
    //                     editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' },
    //                     pageSettings: { pageSize: 5 },
    //                     allowPaging: true,
    //                     allowSorting: true,
    //                     allowFiltering: true,
    //                     selectionSettings: { persistSelection: true }
    //                 });
    //             gridObj.appendTo('#Grid');
    //         });
    //         it('test checkbox selection with dialog editing', () => {
    //             (<any>gridObj.editModule).editModule.dblClickHandler({ target: (<any>gridObj.contentModule.getTable()).rows[0].cells[0] });
    //             gridObj.endEdit();
    //             expect(gridObj.selectionModule.selectedRecords.length === 0).toBeTruthy();
    //         });
    //         it('checkbox selection on adding new record with dialog editing', () => {
    //             chkAllObj = gridObj.element.querySelector('.e-checkselectall') as HTMLElement;
    //             (document.getElementsByClassName('e-add')[0] as HTMLElement).click();
    //             (document.getElementsByClassName('e-field')[0] as HTMLInputElement).click();
    //             (document.getElementsByClassName('e-field')[1] as HTMLInputElement).value = "222";
    //             (document.getElementsByClassName('e-field')[2] as HTMLInputElement).value = "Angier";
    //             (document.getElementsByClassName('e-field')[3] as HTMLInputElement).value = "Sales Manager";
    //             (document.getElementsByClassName('e-primary')[2] as HTMLElement).click();
    //             expect(!chkAllObj.nextElementSibling.classList.contains('e-stop')).toBeTruthy();
    //         });
    //         it('checkbox selection on adding new record with normal editing', () => {
    //             gridObj.editSettings.mode = 'Normal';
    //             gridObj.dataBind();
    //             expect(gridObj.editSettings.mode === 'Normal').toBeTruthy();
    //             (document.getElementsByClassName('e-add')[0] as HTMLElement).click();
    //             (document.getElementsByClassName('e-field')[0] as HTMLInputElement).click();
    //             (document.getElementsByClassName('e-field')[1] as HTMLInputElement).value = "222";
    //             (document.getElementsByClassName('e-field')[2] as HTMLInputElement).value = "Angier";
    //             (document.getElementsByClassName('e-field')[3] as HTMLInputElement).value = "Sales Manager";
    //             (gridObj.getCellFromIndex(2, 2) as HTMLElement).click();
    //             (document.getElementsByClassName('e-add')[0] as HTMLElement).click();
    //             (document.getElementsByClassName('e-field')[0] as HTMLInputElement).click();
    //             (document.getElementsByClassName('e-field')[1] as HTMLInputElement).value = "222";
    //             (document.getElementsByClassName('e-field')[2] as HTMLInputElement).value = "Fallen";
    //             (document.getElementsByClassName('e-field')[3] as HTMLInputElement).value = "Sales Manager";
    //             (gridObj.element.querySelectorAll('.e-checkselect')[1] as HTMLElement).click();
    //         });
    //         afterAll(() => {
    //             gridObj.destroy();
    //             remove(elem);
    //         });
    //     });

    //     describe('grid checkbox selection functionality without persist selection', () => {
    //         let gridObj: Grid;
    //         let elem: HTMLElement = createElement('div', { id: 'Grid' });
    //         let selectionModule: Selection;
    //         let rows: Element[];
    //         beforeAll((done: Function) => {
    //             let dataBound: EmitType<Object> = () => { done(); };
    //             document.body.appendChild(elem);
    //             gridObj = new Grid(
    //                 {
    //                     dataSource: employeeSelectData, dataBound: dataBound,
    //                     columns: [
    //                         { type: 'checkbox', width: 50 },
    //                         { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 135, },
    //                         { field: 'FirstName', headerText: 'Name', width: 125 },
    //                         { field: 'Title', headerText: 'Title', width: 180 },
    //                     ],
    //                     allowSelection: true,
    //                     editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' },
    //                     pageSettings: { pageSize: 5 },
    //                     allowPaging: true,
    //                     allowSorting: true,
    //                     selectionSettings: { type: 'Multiple' }
    //                 });
    //             gridObj.appendTo('#Grid');
    //         });

    //         it('Test checkbox selection', () => {
    //             selectionModule = gridObj.selectionModule;
    //             rows = gridObj.getRows();
    //             selectionModule.selectRows([1, 2]);
    //             expect(rows[1].hasAttribute('aria-selected')).toBeTruthy();
    //             expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
    //             expect(!isNullOrUndefined(rows[1].querySelector('.e-checkselect'))).toBeTruthy();
    //             expect(rows[2].hasAttribute('aria-selected')).toBeTruthy();
    //             expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
    //             expect(!isNullOrUndefined(rows[2].querySelector('.e-checkselect'))).toBeTruthy();
    //             expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(8);
    //             expect(selectionModule.selectedRecords.length).toBe(2);
    //             expect(selectionModule.selectedRowIndexes.length).toBe(2);
    //             gridObj.goToPage(2);
    //             gridObj.goToPage(1);
    //         });

    //         it('checkbox selection on editing', () => {
    //             (<any>gridObj.editModule).editModule.dblClickHandler({ target: gridObj.getCellFromIndex(0, 0) });
    //             gridObj.endEdit();
    //             expect(gridObj.selectionModule.selectedRecords.length === 1).toBeTruthy();
    //         });

    //         afterAll(() => {
    //             gridObj.destroy();
    //             remove(elem);
    //         });
    //     });

    //     describe('persist selection functionality without checkbox', () => {
    //         let gridObj: Grid;
    //         let elem: HTMLElement = createElement('div', { id: 'Grid' });
    //         let selectionModule: Selection;
    //         let rows: Element[];
    //         beforeAll((done: Function) => {
    //             let dataBound: EmitType<Object> = () => { done(); };
    //             document.body.appendChild(elem);
    //             gridObj = new Grid(
    //                 {
    //                     dataSource: data, dataBound: dataBound,
    //                     columns: [
    //                         { headerText: 'OrderID', isPrimaryKey: true, field: 'OrderID' },
    //                         { headerText: 'CustomerID', field: 'CustomerID' },
    //                         { headerText: 'EmployeeID', field: 'EmployeeID' },
    //                         { headerText: 'ShipCountry', field: 'ShipCountry' },
    //                         { headerText: 'ShipCity', field: 'ShipCity' },
    //                     ],
    //                     allowSelection: true,
    //                     pageSettings: { pageSize: 5 },
    //                     allowPaging: true,
    //                     selectionSettings: { persistSelection: true }
    //                 });
    //             gridObj.appendTo('#Grid');
    //         });

    //         it('persist selection', () => {
    //             selectionModule = gridObj.selectionModule;
    //             rows = gridObj.getRows();
    //             selectionModule.selectRow(1, true);
    //             expect(rows[1].hasAttribute('aria-selected')).toBeTruthy();
    //             expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
    //             expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(5);
    //             expect(selectionModule.selectedRecords.length).toBe(1);
    //             expect(selectionModule.selectedRowIndexes.length).toBe(1);
    //             gridObj.goToPage(2);
    //             gridObj.goToPage(1);
    //             expect(rows[1].hasAttribute('aria-selected')).toBeTruthy();
    //             expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
    //             expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(5);
    //             expect(selectionModule.selectedRecords.length).toBe(1);
    //             expect(selectionModule.selectedRowIndexes.length).toBe(1);
    //         });
    //         afterAll(() => {
    //             gridObj.destroy();
    //             remove(elem);
    //         });
    //     });
    //     describe('grid checkbox selection functionality and selection persistance with virtualization', () => {
    //         let gridObj: Grid;
    //         let elem: HTMLElement = createElement('div', { id: 'Grid' });
    //         let selectionModule: Selection;
    //         let rows: Element[];
    //         beforeAll((done: Function) => {
    //             let dataBound: EmitType<Object> = () => { done(); };
    //             document.body.appendChild(elem);
    //             gridObj = new Grid(
    //                 {
    //                     dataSource: data, dataBound: dataBound,
    //                     columns: [
    //                         { type: 'checkbox' },
    //                         { headerText: 'OrderID', isPrimaryKey: true, field: 'OrderID' },
    //                         { headerText: 'CustomerID', field: 'CustomerID' },
    //                         { headerText: 'EmployeeID', field: 'EmployeeID' },
    //                         { headerText: 'ShipCountry', field: 'ShipCountry' },
    //                         { headerText: 'ShipCity', field: 'ShipCity' },
    //                     ],
    //                     allowSelection: true,
    //                     enableVirtualization: true,
    //                     selectionSettings: { persistSelection: true }
    //                 });
    //             gridObj.appendTo('#Grid');
    //         });

    //         it('Test checkbox selection and persist selection', () => {
    //             selectionModule = gridObj.selectionModule;
    //             rows = gridObj.getRows();
    //             let chkAllObj: HTMLElement = gridObj.element.querySelector('.e-checkselectall') as HTMLElement;
    //             selectionModule.selectRows([1, 2]);
    //             expect(rows[1].hasAttribute('aria-selected')).toBeTruthy();
    //             expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
    //             expect(!isNullOrUndefined(rows[1].querySelector('.e-checkselect'))).toBeTruthy();
    //             expect(rows[2].hasAttribute('aria-selected')).toBeTruthy();
    //             expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
    //             expect(!isNullOrUndefined(rows[2].querySelector('.e-checkselect'))).toBeTruthy();
    //             expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(12);
    //             expect(selectionModule.selectedRecords.length).toBe(2);
    //             expect(selectionModule.selectedRowIndexes.length).toBe(2);
    //             expect(chkAllObj.nextElementSibling.classList.contains('e-stop')).toBeTruthy();
    //         });
    //         afterAll(() => {
    //             gridObj.destroy();
    //             remove(elem);
    //         });
    //     });
    //     describe('grid checkbox selection functionaly with datasource field', () => {
    //         let gridObj: Grid;
    //         let elem: HTMLElement = createElement('div', { id: 'Grid' });
    //         let selectionModule: Selection;
    //         let rows: Element[];
    //         let chkAllObj: HTMLElement;
    //         beforeAll((done: Function) => {
    //             let dataBound: EmitType<Object> = () => { done(); };
    //             document.body.appendChild(elem);
    //             gridObj = new Grid(
    //                 {
    //                     dataSource: employeeSelectData, dataBound: dataBound,
    //                     columns: [
    //                         { type: 'checkbox', field: 'IsAutoSelect' },
    //                         { field: 'EmployeeID', isPrimaryKey: true, headerText: 'Employee ID', textAlign: 'Right', width: 135, },
    //                         { field: 'FirstName', headerText: 'Name', width: 125 },
    //                         { field: 'Title', headerText: 'Title', width: 180 },
    //                     ],
    //                     allowSelection: true,
    //                     editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
    //                     pageSettings: { pageSize: 5 },
    //                     allowPaging: true,
    //                     selectionSettings: { persistSelection: true }
    //                 });
    //             gridObj.appendTo('#Grid');
    //         });

    //         it('checkbox selection with persist selection on paging', (done: Function) => {
    //             setTimeout(
    //                 () => {
    //                     selectionModule = gridObj.selectionModule;
    //                     chkAllObj = gridObj.element.querySelector('.e-checkselectall') as HTMLElement;
    //                     rows = gridObj.getRows();
    //                     gridObj.goToPage(2);
    //                     gridObj.goToPage(1);
    //                     expect(chkAllObj.nextElementSibling.classList.contains('e-stop')).toBeTruthy();
    //                     done();
    //                 },
    //                 200);
    //         });

    //         it('checkbox selection with check all checkbox', (done: Function) => {
    //             setTimeout(
    //                 () => {
    //                     (gridObj.element.querySelector('.e-checkselectall') as HTMLElement).click();
    //                     (gridObj.element.querySelector('.e-checkselectall') as HTMLElement).click();
    //                     expect(!chkAllObj.nextElementSibling.classList.contains('e-stop')).toBeTruthy();
    //                     done();
    //                 },
    //                 500);
    //         });

    //         it('edit checkbox selection on editing', (done: Function) => {
    //             setTimeout(
    //                 () => {
    //                     (<any>gridObj.editModule).editModule.dblClickHandler({ target: gridObj.getCellFromIndex(0, 0) });
    //                     let preventDefault: Function = new Function();
    //                     let args: any = { action: 'tab', preventDefault: preventDefault };
    //                     gridObj.keyboardModule.keyAction(args);
    //                     (gridObj.element.querySelector('.e-edit-checkselect') as HTMLElement).click();
    //                     (gridObj.element.querySelector('.e-edit-checkselect') as HTMLElement).click();
    //                     gridObj.endEdit();
    //                     (<any>gridObj.editModule).editModule.dblClickHandler({ target: gridObj.getCellFromIndex(0, 0) });
    //                     (gridObj.element.querySelector('.e-checkselectall') as HTMLElement).click();
    //                     expect(!chkAllObj.nextElementSibling.classList.contains('e-stop')).toBeTruthy();
    //                     done();
    //                 },
    //                 500);
    //         });

    //         afterAll(() => {
    //             gridObj.destroy();
    //             remove(elem);
    //         });
    //     });
    // });

    describe('grid checkbox selection binding with data source', () => {
        let gridObj: Grid;
        let rowSelected: () => void;
        beforeAll((done: Function) => {
            let options: Object = {
                dataSource: [{ 'UnitsInStock': 39, 'Discontinued': false },
                { 'UnitsInStock': 17, 'Discontinued': false },
                { 'UnitsInStock': 13, 'Discontinued': true },
                { 'UnitsInStock': 53, 'Discontinued': false },
                { 'UnitsInStock': 0, 'Discontinued': true },
                { 'UnitsInStock': 120, 'Discontinued': false }],
                rowSelected: rowSelected,
                columns: [
                    { field: 'UnitsInStock', headerText: 'Units In Stock', width: 160, textAlign: 'Right' },
                    {
                        field: 'Discontinued', headerText: 'Discontinued', width: 150, textAlign: 'Center', type: 'checkbox',
                    },
                ],
                allowSelection: true,
                allowSorting: true,
            }
            gridObj = createGrid(options, done);
        });

        it('checkbox selection bind with datasource', (done: Function) => {
            done();
            // rowSelected = (): void => {
            //     // expect(gridObj.selectionModule.selectedRecords.length).toBe(2);
            //     // expect(gridObj.selectionModule.selectedRowIndexes.length).toBe(2);
            //     done();
            // };
            // gridObj.rowSelected = rowSelected;
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Grid Selection Issue Fixes', () =>{
        let gridObj: Grid;
        let rowSelected: () => void;
        beforeAll((done) => {
            gridObj = createGrid({
                    dataSource: data,
                    columns: [
                    { type: 'checkbox', width: 50 },
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' }],
                    allowPaging: true,
                    rowSelected: rowSelected
            }, done);
        });

        it('Selecting First row', (done: Function) => {
            rowSelected = (): void => {
                expect(gridObj.getSelectedRowIndexes().length).toBe(1);
                gridObj.rowSelected = null;
                done();
            };
            gridObj.rowSelected = rowSelected;
            gridObj.isCheckBoxSelection = false;
            (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[0].querySelector('.e-rowcell')).click();
        });

        it('Selecting Second row', (done: Function) => {
            rowSelected = (): void => {
                expect(gridObj.getSelectedRowIndexes().length).toBe(1);
                gridObj.rowSelected = null;
                done();
            };
            gridObj.rowSelected = rowSelected;
            (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[1].querySelector('.e-rowcell')).click();
        });

        it('Selecting Third row', (done: Function) => {
            rowSelected = (): void => {
                expect(gridObj.getSelectedRowIndexes().length).toBe(2);
                gridObj.rowSelected = null;
                done();
            };
            gridObj.rowSelected = rowSelected;
            (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[2].querySelector('.e-gridchkbox')
            .querySelector('.e-checkbox-wrapper')).click();
        });

        it('multi row - ctrl click testing- selecting Fourth row', (done: Function) => {
            rowSelected = (): void => {
                expect(gridObj.getSelectedRowIndexes().length).toBe(3);
                gridObj.rowSelected = null;
                done();
            };
            gridObj.rowSelected = rowSelected;
            (gridObj.selectionModule as any).clickHandler({target: gridObj.element.querySelectorAll('.e-row')[3]
            .querySelectorAll('.e-rowcell')[2], ctrlKey: true});
        });

        it('Selecting First row', (done: Function) => {
            rowSelected = (): void => {
                expect(gridObj.getSelectedRowIndexes().length).toBe(1);
                gridObj.rowSelected = null;
                done();
            };
            gridObj.rowSelected = rowSelected;
            gridObj.isCheckBoxSelection = false;
            (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[0].querySelector('.e-rowcell')).click();
        });

        it('multi row - Shift click testing', (done: Function) => {
            rowSelected = (): void => {
                expect(gridObj.getSelectedRowIndexes().length).toBe(4);
                gridObj.rowSelected = null;
                done();
            };
            gridObj.rowSelected = rowSelected;
            (gridObj.selectionModule as any)
            .clickHandler({target: gridObj.element.querySelectorAll('.e-row')[3].querySelectorAll('.e-rowcell')[2], shiftKey: true});
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Grid Selection Issue Fixes', () =>{
        let gridObj: Grid;
        let rowSelected: () => void;
        beforeAll((done) => {
            gridObj = createGrid({
                    dataSource: data,
                    columns: [
                    { type: 'checkbox', width: 50 },
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' }],
                    allowPaging: true,
                    rowSelected: rowSelected
            }, done);
        });

        it('Selecting First row', (done: Function) => {
            rowSelected = (): void => {
                expect(gridObj.getSelectedRowIndexes().length).toBe(1);
                gridObj.rowSelected = null;
                done();
            };
            gridObj.rowSelected = rowSelected;
            gridObj.isCheckBoxSelection = false;
            (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[0].querySelector('.e-rowcell')).click();
        });

        it('Shift + Clicking Checkbox in Fourth Row', (done: Function) => {
            rowSelected = (): void => {
                expect(gridObj.getSelectedRowIndexes().length).toBe(2);
                gridObj.rowSelected = null;
                done();
            };
            gridObj.rowSelected = rowSelected;
            (gridObj.selectionModule as any)
            .clickHandler({target: gridObj.element.querySelectorAll('.e-row')[3].querySelector('.e-gridchkbox')
            .querySelector('.e-checkbox-wrapper'), shiftKey: true});
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

});

describe('Row,cell Selecting in batch edit while adding record => ', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    let rowSelected: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                editSettings: {
                    allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch',
                    showConfirmDialog: false, showDeleteConfirmDialog: false
                },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                allowPaging: true,
                columns: [
                    { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'EmployeeID', type: 'number', allowEditing: false },
                    { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                ],
                rowSelected: rowSelected
            }, done);
    });
    it('rowSelect event while adding new records in batchedit', () => {
        rowSelected = (args?: any): void => {
            expect(args.data.OrderID).toBe(0);
        }
        gridObj.rowSelected = rowSelected;
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        gridObj.editModule.saveCell();
        expect(gridObj.selectionModule.getCurrentBatchRecordChanges().length).toBe(14);
    });

    it('rowSelect event while adding delete record in currentview data',() => {
            gridObj.clearSelection();
            gridObj.rowSelected = null;
            gridObj.selectRow(5, true);
            gridObj.editModule.deleteRecord();
            expect(gridObj.selectionModule.getCurrentBatchRecordChanges().length).toBe(13);
    });

    it('recordClick event in Grid', () => {
        gridObj.recordClick = (args: any): void => {
            expect(args.rowIndex).toBe(2);
            expect(args.cellIndex).toBe(1);
            expect(args.column.field).toBe('CustomerID');
        }
        (gridObj.getContent().querySelectorAll('.e-row')[2].querySelectorAll('.e-rowcell')[1] as
         HTMLElement).click();
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('enableSimpleMultiRowSelection property Testing => ', () => {
    let gridObj: Grid;
    let rows: Element[];
    let ctrlEvt: MouseEvent = document.createEvent('MouseEvent');
    ctrlEvt.initMouseEvent(
        'click',
        true /* bubble */, true /* cancelable */,
        window, null,
        0, 0, 0, 0, /* coordinates */
        true, false, false, false, /* modifier keys */
        0 /*left*/, null
    );
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                selectionSettings: { type:'Multiple', enableSimpleMultiRowSelection: true},
                columns: [
                    { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'EmployeeID', type: 'number', allowEditing: false },
                    { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                ]
            }, done);
    });
    it('Multiple row selection without pressing ctrl/shift', () => {
        gridObj.selectRow(0);
        rows = gridObj.getRows();
        expect(rows[0].hasAttribute('aria-selected')).toBeTruthy();
        gridObj.selectRow(1);
        expect(rows[0].hasAttribute('aria-selected')).toBeTruthy();
        expect(rows[1].hasAttribute('aria-selected')).toBeTruthy();
        gridObj.selectRow(1);
        expect(rows[0].hasAttribute('aria-selected')).toBeTruthy();
        expect(rows[1].hasAttribute('aria-selected')).toBeFalsy();
    });

    it('enableToggle Property check without pressing ctrl/shift', () => {
        gridObj.selectionSettings.enableToggle = false;
        (rows[1].querySelector('.e-rowcell') as HTMLElement).click();
        expect(rows[1].hasAttribute('aria-selected')).toBeTruthy();
        (rows[1].querySelector('.e-rowcell') as HTMLElement).click();
        expect(rows[1].hasAttribute('aria-selected')).toBeTruthy();
    });

    it('enableToggle Property check by pressing ctrl/shift', () => {
        rows[1].firstChild.dispatchEvent(ctrlEvt);
        expect(rows[1].hasAttribute('aria-selected')).toBeFalsy();
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('enableToggle property Testing => ', () => {
    let gridObj: Grid;
    let rows: Element[];
    let ctrlEvt: MouseEvent = document.createEvent('MouseEvent');
    ctrlEvt.initMouseEvent(
        'click',
        true /* bubble */, true /* cancelable */,
        window, null,
        0, 0, 0, 0, /* coordinates */
        true, false, false, false, /* modifier keys */
        0 /*left*/, null
    );
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                selectionSettings: { type:'Multiple', enableToggle: false},
                columns: [
                    { type: 'checkbox', width: 50},
                    { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'EmployeeID', type: 'number', allowEditing: false },
                    { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                ]
            }, done);
    });

    it('enableToggle(false) Property check without pressing ctrl/shift', () => {
        rows = gridObj.getRows();
        (rows[1].querySelector('.e-rowcell') as HTMLElement).click();
        expect(rows[1].hasAttribute('aria-selected')).toBeTruthy();
        (rows[1].querySelector('.e-rowcell') as HTMLElement).click();
        expect(rows[1].hasAttribute('aria-selected')).toBeFalsy();
    });

    it('enableToggle(false) Property check by pressing ctrl key', () => {
        (rows[1].querySelector('.e-rowcell') as HTMLElement).click();
        expect(rows[1].hasAttribute('aria-selected')).toBeTruthy();
        rows[1].firstChild.dispatchEvent(ctrlEvt);
        expect(rows[1].hasAttribute('aria-selected')).toBeFalsy();
        gridObj.selectionSettings.enableToggle = true;
    });

    it('enableToggle(true) Property check without pressing ctrl/shift', () => {
        expect(gridObj.selectionSettings.enableToggle).toBeTruthy();
        (rows[1].querySelector('.e-rowcell') as HTMLElement).click();
        expect(rows[1].hasAttribute('aria-selected')).toBeTruthy();
        (rows[1].querySelector('.e-rowcell') as HTMLElement).click();
        expect(rows[1].hasAttribute('aria-selected')).toBeFalsy();
    });

    it('enableToggle(true) Property check by pressing ctrl key', () => {
        (rows[1].querySelector('.e-rowcell') as HTMLElement).click();
        expect(rows[1].hasAttribute('aria-selected')).toBeTruthy();
        rows[1].firstChild.dispatchEvent(ctrlEvt);
        expect(rows[1].hasAttribute('aria-selected')).toBeFalsy();
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
        destroy(gridObj);
    });
});

describe('grid checkbox selection functionalities with Freeze pane', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                frozenColumns: 2,
                frozenRows: 1,
                dataSource: data,
                allowSelection: true,
                allowPaging: true,
                pageSettings: { pageSize: 6},
                columns: [
                    { type:'checkbox', width: 40},
                    { headerText: 'OrderID', field: 'OrderID' },
                    { headerText: 'CustomerID', field: 'CustomerID' },
                    { headerText: 'EmployeeID', field: 'EmployeeID' },
                    { headerText: 'ShipCountry', field: 'ShipCountry' },
                    { headerText: 'ShipCity', field: 'ShipCity' },
                ],
                
            }, done);
    });

    it('checkbox type check', () =>{
        let colType: string = 'checkbox';
        expect(gridObj.getVisibleColumns()[0].type).toBe(colType);
    });

    it('Checkbox select all', () => {
        (gridObj.element.querySelector('.e-headercelldiv').querySelectorAll('.e-frame.e-icons')[0] as any).click();
        expect(gridObj.getSelectedRowIndexes().length).toBe(6);
        expect(gridObj.element.querySelectorAll('.e-frame.e-icons.e-check').length).toBe(7);
    });

    it('checkbox deselect check', () => {
        (gridObj.element.querySelector('.e-headercontent').querySelectorAll('.e-rowcell')[0] as any).click();
        expect(gridObj.getSelectedRowIndexes().length).toBe(5);
        expect(gridObj.element.querySelector('.e-headercelldiv').querySelectorAll('.e-stop').length).toBe(1);
        (gridObj.element.querySelector('.e-headercelldiv').querySelectorAll('.e-frame.e-icons')[0] as any).click();
    });

    it('checkbox unselect all check', () => {
        (gridObj.element.querySelector('.e-headercelldiv').querySelectorAll('.e-frame.e-icons')[0] as any).click();
        expect(gridObj.element.querySelector('.e-headercelldiv').querySelectorAll('.e-uncheck').length).toBe(1);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('grid selection functionalities with Frozen rows', function () {
    let gridObj: Grid;
    beforeAll(function (done) {
        gridObj = createGrid({
            dataSource: data,
            columns: [
                { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true },
                { headerText: 'CustomerID', field: 'CustomerID' },
                { headerText: 'EmployeeID', field: 'EmployeeID' },
                { headerText: 'ShipCountry', field: 'ShipCountry' },
                { headerText: 'ShipCity', field: 'ShipCity' },
            ],
            allowSelection: true,
        }, done);
    });
    it('Get rowindex from primarykey', function () {
        gridObj.selectRow(gridObj.getRowIndexByPrimaryKey(10251));
        gridObj.dataBind();
        expect(gridObj.selectedRowIndex).toBe(3);
    });
    it('get rowIndex from rowdata', function () {
        gridObj.selectRow(gridObj.getRowIndexByPrimaryKey({OrderID: 10253, CustomerID: "HANAR", EmployeeID: 3, ShipCity: "Rio de Janeiro",
        ShipCountry: "Brazil"}));
        gridObj.dataBind();
        expect(gridObj.selectedRowIndex).toBe(5);
    });

    it('Primary key not in current page', function () {
        let index = gridObj.getRowIndexByPrimaryKey(10358);
        gridObj.selectRow(index);
        gridObj.dataBind();
        expect(index).toBe(-1);
    });
    afterAll(function () {
        destroy(gridObj);
    });
});

describe('selectRow with virtualScrolling', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: virtualData,
                enableVirtualization: true,
                height: 300,
                columns: count500
            }, done);
    });

    it('select 100th row in vitualized Grid', (done: Function) => {
        let dataBound = () => {
            expect(gridObj.getSelectedRecords().length).toBe(1);
            done();
        }
        gridObj.dataBound = dataBound;
        gridObj.selectRow(100);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('selectRow with virtualScrolling', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true },
                    { headerText: 'CustomerID', field: 'CustomerID' },
                    { headerText: 'EmployeeID', field: 'EmployeeID' },
                    { headerText: 'ShipCountry', field: 'ShipCountry' },
                    { headerText: 'ShipCity', field: 'ShipCity' },
                ],
                allowSelection: true,
                selectionSettings:{mode:'Cell',type:'Multiple'},
            }, done);
    });

    it('check cell select args', (done: Function) => {
        let cellSelecting = (args: any) => {
            expect(args['previousRowCell']).toBeUndefined();
            expect(args['previousRowCellIndex']).toBeUndefined();
        }
        let cellSelected = (args: any) => {
            expect(args['previousRowCell']).toBeUndefined();
            expect(args['previousRowCellIndex']).toBeUndefined();
            done();
        }
        gridObj.cellSelecting = cellSelecting;
        gridObj.cellSelected = cellSelected;
        gridObj.selectCell({ rowIndex: 0, cellIndex: 0 }, false);
    });

    it('check cell select args multiselect', (done: Function) => {
        let cellSelecting = (args: any) => {
            expect(args['previousRowCell']).toEqual(gridObj.getRows()[0].children[0]);
            expect(args['previousRowCellIndex']).toEqual({ rowIndex: 0, cellIndex: 0 });
        }
        let cellSelected = (args: any) => {
            expect(args['previousRowCell']).toEqual(gridObj.getRows()[0].children[0]);
            expect(args['previousRowCellIndex']).toEqual({ rowIndex: 0, cellIndex: 0 });
            done();
        }
        gridObj.cellSelecting = cellSelecting;
        gridObj.cellSelected = cellSelected;
        gridObj.selectionModule.addCellsToSelection([{ rowIndex: 0, cellIndex: 1 }]);
    });
    it('check cell select args multiselect with range', (done: Function) => {
        let cellSelecting = (args: any) => {
            expect(args['previousRowCell']).toEqual(gridObj.getRows()[0].children[1]);
            expect(args['previousRowCellIndex']).toEqual({ rowIndex: 0, cellIndex: 1 });
        }
        let cellSelected = (args: any) => {
            expect(args['previousRowCell']).toEqual(gridObj.getRows()[0].children[1]);
            expect(args['previousRowCellIndex']).toEqual({ rowIndex: 0, cellIndex: 1 });
            gridObj.clearCellSelection();
            done();
        }
        gridObj.cellSelecting = cellSelecting;
        gridObj.cellSelected = cellSelected;
        gridObj.selectionModule.selectCellsByRange({ rowIndex: 1, cellIndex: 0 }, { rowIndex: 1, cellIndex: 3 });
    });

    it('check cell select args multiselect with cancel args', (done: Function) => {
        let cellSelecting = (args: any) => {
            args.cancel = true;
            expect(gridObj.getSelectedRowCellIndexes.length).toBe(0);
            done();
        }
        gridObj.cellSelecting = cellSelecting;
        gridObj.selectionModule.selectCellsByRange({ rowIndex: 1, cellIndex: 0 }, { rowIndex: 1, cellIndex: 3 });
    });

    it('check row select args multiselect with cancel args', (done: Function) => {
        let rowSelecting = (args: any) => {
            args.cancel = true;
            expect(gridObj.getSelectedRowIndexes.length).toBe(0);
            expect(gridObj.getSelectedRows.length).toBe(0);
            done();
        }
        gridObj.selectionSettings.mode = 'Row';
        gridObj.rowSelecting = rowSelecting;
        gridObj.selectionModule.selectRowsByRange(1,2);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-33599 selection does not maintain while calling setrowdata method', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowRowDragAndDrop: true,
                columns: [
                    { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true },
                    { headerText: 'CustomerID', field: 'CustomerID' },
                    { headerText: 'EmployeeID', field: 'EmployeeID' },
                    { headerText: 'ShipCountry', field: 'ShipCountry' },
                    { headerText: 'ShipCity', field: 'ShipCity' },
                ]
            }, done);
    });

    it('selectrowdata', (done: Function) => {
        gridObj.selectRow(0);
        gridObj.setRowData(10248, { CustomerID: "aaa", Freight: 11 })
        expect((<any>gridObj.getRows()[0]).cells[0].classList.contains('e-selectionbackground')).toBeTruthy();
        done();
    });

    it('Check target in rowSelected event', (done: Function) => {
        gridObj.rowSelected = (args: any) => {
            expect(args.target).toBeNull();
            gridObj.rowSelected = null;
            done();
        };
        gridObj.clearSelection();
        gridObj.selectRow(1);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Checkbox state when Selecting in batch edit while adding record => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                editSettings: {
                    allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch',
                    showConfirmDialog: true, showDeleteConfirmDialog: false
                },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                allowPaging: true,
                columns: [
                    { type: 'checkbox', width: 50},
                    { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'EmployeeID', type: 'number', allowEditing: false },
                    { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                ],
            }, done);
    });
    
    it('Initial header checkbox state', () => {
        let cBox: HTMLElement = gridObj.element.querySelector('.e-checkselectall').nextElementSibling as HTMLElement;
        expect(cBox.classList.contains('e-check')).toBeFalsy();
        expect(cBox.classList.contains('e-uncheck')).toBeFalsy();
        expect(cBox.classList.contains('e-stop')).toBeFalsy();
    })

    it('Add new records, cancel and check state', (done: Function) => {
        let batchCancel = (args: any): void => {
            if (args.name === 'batchCancel') {
                expect(gridObj.element.querySelector('.e-checkselectall').nextElementSibling.classList.contains('e-stop')).toBeFalsy();
                gridObj.batchCancel = null;
                done();
            }
        }
        gridObj.batchCancel = batchCancel;
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        (gridObj.element.querySelector('.e-checkselectall') as HTMLElement).click();
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        expect(gridObj.element.querySelector('.e-checkselectall').nextElementSibling.classList.contains('e-stop')).toBeTruthy();
        gridObj.editModule.batchCancel();
        select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();        
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('isInteracted property in rowSelecting and rowSelected events testing', () => {
    let gridObj: Grid;
    let rowSelecting: (args: any) => void;
    let rowSelected: (args: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                allowPaging: true,
                pageSettings: { pageSize: 8, pageCount: 4, currentPage: 1 },
                allowSelection: true,
                selectionSettings: { type: 'Multiple', mode: 'Both' },
            }, done);
    });

    it('isInteracted property testing - Click', () => {
        rowSelecting = (args: any) => {
            expect(args.isInteracted).toBeTruthy();
        };
        rowSelected = (args: any) => {
            expect(args.isInteracted).toBeTruthy();
        };
        gridObj.rowSelecting = rowSelecting;
        gridObj.rowSelected = rowSelected;
        (gridObj.getRows()[1].querySelector('.e-rowcell') as HTMLElement).click();
    });

    it('isInteracted property testing - rowSelect method', () => {
        rowSelecting = (args: any) => {
            expect(args.isInteracted).toBeFalsy();
        };
        rowSelected = (args: any) => {
            expect(args.isInteracted).toBeFalsy();
        };
        gridObj.rowSelecting = rowSelecting;
        gridObj.rowSelected = rowSelected;
        gridObj.selectRow(2);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = rowSelecting = null;
        gridObj = rowSelected = null;
    });
});

describe('EJ2-38505 - Grid cell selection will be cleared when we press the left arrow', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                frozenColumns: 2,
                frozenRows: 2,
                allowSelection: true,
                selectionSettings: { type: 'Single', mode: 'Cell' },
            }, done);
    });

    it('Ensure selection while pressing left arrow after selecting first cell in first row', () => {
        let args: any = { action: 'leftArrow', preventDefault: preventDefault };
        gridObj.selectionModule.selectCell({ rowIndex: 2, cellIndex: 0 }, true);
        gridObj.keyboardModule.keyAction(args);
        gridObj.keyboardModule.keyAction(args);
        gridObj.keyboardModule.keyAction(args);
        let rows: Element[] = gridObj.getRows();
        expect(rows[2].firstElementChild.classList.contains('e-cellselectionbackground')).toBeTruthy();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('isInteracted checking after cancel the rowselecting event', () => {
    let gridObj: Grid;
    let rowSelecting: (args: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                allowPaging: true,
                pageSettings: { pageSize: 8, pageCount: 4, currentPage: 1 },
                allowSelection: true,
                selectionSettings: { type: 'Multiple', mode: 'Both' },
            }, done);
    });

    it('isInteracted property testing - Click', () => {
        rowSelecting = (args: any) => {
            args.cancel = true;
            expect(args.isInteracted).toBeTruthy();
        };
        gridObj.rowSelecting = rowSelecting;
        (gridObj.getRows()[1].querySelector('.e-rowcell') as HTMLElement).click();
    });

    it('isInteracted property testing - selectRow method', () => {
        rowSelecting = (args: any) => {
            expect(args.target).toBeNull();
            expect(args.isInteracted).toBeFalsy();
        };
        gridObj.rowSelecting = rowSelecting;
        gridObj.selectRow(4);
    });

    it('isInteracted property testing - selectRows method', () => {
        rowSelecting = (args: any) => {
            expect(args.target).toBeNull();
            expect(args.isInteracted).toBeFalsy();
        };
        gridObj.rowSelecting = rowSelecting;
        gridObj.selectRows([2,3]);
    });

    it('isInteracted property testing - selectRowsByRange method', () => {
        rowSelecting = (args: any) => {
            expect(args.target).toBeNull();
            expect(args.isInteracted).toBeFalsy();
            expect(args.isInteracted).toBeDefined();
        };
        gridObj.rowSelecting = rowSelecting;
        gridObj.selectRowsByRange(2,5);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = rowSelecting = null;
    });
});

describe('isInteracted property in rowSelecting and rowDeselected events indexes property testing', () => {
    let gridObj: Grid;
    let rowDeselected: (args: any) => void;
    let rowSelected: (args: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { type: 'checkbox', width: 50 },
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' }],
                allowPaging: true,
                pageSettings: { pageSize: 8, pageCount: 4, currentPage: 1 },
                allowSelection: true,
            }, done);
    });

    it('isInteracted property testing in selectall - rowselected', () => {
        rowSelected = (args: any) => {
            expect(args.isInteracted).toBeTruthy();
            gridObj.rowSelected = null;
        };
        gridObj.rowSelected = rowSelected;
        (<HTMLElement>gridObj.element.querySelector('.e-checkselectall')).click();
    });
    it('isInteracted property testing in selectall - rowDeselected', () => {
        rowDeselected = (args: any) => {
            expect(args.isInteracted).toBeTruthy();
            expect(args.rowIndexes).toBeDefined();
            expect(args.cancel).toBeUndefined();
        };
        gridObj.rowDeselected = rowDeselected;
        (<HTMLElement>gridObj.element.querySelector('.e-checkselectall')).click();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = rowSelected = null;
        gridObj = rowDeselected = null;
    });
});

describe('AutoFill Feature', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                enableAutoFill: true,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                allowPaging: true,
                selectionSettings: { type: 'Multiple', mode: 'Cell', cellSelectionMode: 'Box' },
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
            }, done);
    });

    it('update cell', () => {
        gridObj.selectionModule.selectCellsByRange({ rowIndex: 0, cellIndex: 1 },{ rowIndex: 0, cellIndex:4  });
        (gridObj.selectionModule as any).startAFCell = gridObj.getRowByIndex(0).querySelectorAll('td')[1];
        (gridObj.selectionModule as any).endAFCell = gridObj.getRowByIndex(2).querySelectorAll('td')[4];
        (gridObj.selectionModule as any).updateStartEndCells();
        (gridObj.selectionModule as any).selectLikeAutoFill(undefined,true);
        gridObj.copy();
        let value1: string = (document.querySelector('.e-clipboard') as HTMLInputElement).value.split(/\r?\n/)[0];
        let value2: string = (document.querySelector('.e-clipboard') as HTMLInputElement).value.split(/\r?\n/)[1];
        expect(value1 === value2).toBeTruthy();
    });

    it('EJ2-909377 - code coverage', () => {
        gridObj.resetIndentWidth();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('rowdeselect checking with persist selection and ResetOnRowClick', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                enableAutoFill: true,
                columns: [
                    { type: 'checkbox', width: 50 },
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                allowPaging: true,
                selectionSettings: { persistSelection: true, checkboxMode: 'ResetOnRowClick' },
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true },
            }, done);
    });

    it('selecting more than one row in checkbox and clicking in row element', () => {
        (gridObj.element.querySelectorAll('.e-frame.e-icons')[1] as HTMLElement).click();
        (gridObj.element.querySelectorAll('.e-frame.e-icons')[2] as HTMLElement).click();
        let rowDeSelecting = (e: any) => {
            expect(e.data.length).toBe(2);
        };
        let rowDeSelected = (e: any) => {
            expect(e.data.length).toBe(2);
        }
        gridObj.rowDeselecting = rowDeSelecting;
        gridObj.rowDeselected = rowDeSelected;
        (gridObj.element.querySelectorAll('.e-rowcell.e-gridchkbox')[0] as HTMLElement).click();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
        gridObj.rowDeselected = null;
        gridObj.rowDeselecting = null;
    });
});

describe('rowdeselect checking with persist selection and ResetOnRowClick', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { type: 'checkbox', width: 50 },
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                allowPaging: true,
                selectionSettings: { persistSelection: true, checkboxMode: 'ResetOnRowClick' },
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true },
            }, done);
    });

    it('selecting checkselectall ', () => {
        (gridObj.element.querySelectorAll('.e-frame.e-icons')[0] as HTMLElement).click(); //selecting all row
        let rowDeSelecting = (e: any) => {
            expect(e.data.length).toBe(12);
        };
        let rowDeSelected = (e: any) => {
            expect(e.data.length).toBe(12);
        }
        gridObj.rowDeselecting = rowDeSelecting;
        gridObj.rowDeselected = rowDeSelected;
        (gridObj.element.querySelectorAll('.e-rowcell.e-gridchkbox')[0] as HTMLElement).click();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
        gridObj.rowDeselected = null;
        gridObj.rowDeselecting = null;
    });
    describe('Ensure selection event arguments', () => {
        let gridObj: Grid;
        let start: number = 0;
        let end: number = 3;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [
                        { type: 'checkbox', width: 50 },
                        { field: 'OrderID', headerText: 'Order ID' },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'EmployeeID', headerText: 'Employee ID' },
                        { field: 'ShipCity', headerText: 'Ship City' },
                        { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowPaging: true
                }, done);
        });
        it('single row selecting', (done: Function) => {
            let rowSelecting = (args: RowSelectingEventArgs) => {
                let rows: Row<Column>[] = gridObj.getRowsObject();
                expect(args.rowIndex).toBe(1);
                expect(args.data).toBe(rows[args.rowIndex].data);
                expect(args.row).toBe(gridObj.getRowByIndex(args.rowIndex));
                expect(args.foreignKeyData).toBe(rows[args.rowIndex].foreignKeyData);
                gridObj.rowSelecting = null;
            };
            let rowSelected = (args: RowSelectEventArgs) => {
                let rows: Row<Column>[] = gridObj.getRowsObject();
                expect(args.rowIndex).toBe(1);
                expect(args.data).toBe(rows[args.rowIndex].data);
                expect(args.row).toBe(gridObj.getRowByIndex(args.rowIndex));
                expect(args.foreignKeyData).toBe(rows[args.rowIndex].foreignKeyData);
                gridObj.rowSelected = null;
                done();
            };
            gridObj.rowSelecting = rowSelecting;
            gridObj.rowSelected = rowSelected;
            gridObj.selectRow(1);
        });
        it('single row de-selecting', (done: Function) => {
            let rowDeselecting = (args: RowDeselectEventArgs) => {
                let rows: Row<Column>[] = gridObj.getRowsObject();
                expect(args.rowIndex).toBe(1);
                expect(args.data).toBe(rows[args.rowIndex].data);
                expect(args.row).toBe(gridObj.getRowByIndex(args.rowIndex));
                expect(args.foreignKeyData).toBe(rows[args.rowIndex].foreignKeyData);
                gridObj.rowDeselecting = null;
            };
            let rowDeselected = (args: RowDeselectEventArgs) => {
                let rows: Row<Column>[] = gridObj.getRowsObject();
                expect(args.rowIndex).toBe(1);
                expect(args.data).toBe(rows[args.rowIndex].data);
                expect(args.row).toBe(gridObj.getRowByIndex(args.rowIndex));
                expect(args.foreignKeyData).toBe(rows[args.rowIndex].foreignKeyData);
                gridObj.rowDeselected = null;
                done();
            };
            gridObj.rowDeselecting = rowDeselecting;
            gridObj.rowDeselected = rowDeselected;
            gridObj.selectRow(1, true);
        });
        it('header checkbox selection', (done: Function) => {
            let rowSelecting = (args: RowSelectingEventArgs) => {
                expect(args.rowIndex).toBe(0);
                expect(args.rowIndexes.length).toBe(gridObj.currentViewData.length);
                expect((args.data as Object[]).length).toBe(gridObj.currentViewData.length);
                expect((args.row as Element[]).length).toBe(gridObj.currentViewData.length);
                expect((args.foreignKeyData as Object[]).length).toBe(gridObj.currentViewData.length);
                gridObj.rowSelecting = null;
            };
            let rowSelected = (args: RowSelectEventArgs) => {
                expect(args.rowIndex).toBe(0);
                expect(args.rowIndexes.length).toBe(gridObj.currentViewData.length);
                expect((args.data as Object[]).length).toBe(gridObj.currentViewData.length);
                expect((args.row as Element[]).length).toBe(gridObj.currentViewData.length);
                expect((args.foreignKeyData as Object[]).length).toBe(gridObj.currentViewData.length);
                gridObj.rowSelected = null;
                done();
            };
            gridObj.rowSelecting = rowSelecting;
            gridObj.rowSelected = rowSelected;
            (<HTMLElement>gridObj.element.querySelector('.e-checkselectall')).click();
        });
        it('header checkbox de-selection', (done: Function) => {
            let rowDeselecting = (args: RowDeselectEventArgs) => {
                expect(args.rowIndex).toBe(0);
                expect(args.rowIndexes.length).toBe(gridObj.currentViewData.length);
                expect((args.data as Object[]).length).toBe(gridObj.currentViewData.length);
                expect((args.row as Element[]).length).toBe(gridObj.currentViewData.length);
                expect((args.foreignKeyData as Object[]).length).toBe(gridObj.currentViewData.length);
                gridObj.rowDeselecting = null;
            };
            let rowDeselected = (args: RowDeselectEventArgs) => {
                expect(args.rowIndex).toBe(0);
                expect(args.rowIndexes.length).toBe(gridObj.currentViewData.length);
                expect((args.data as Object[]).length).toBe(gridObj.currentViewData.length);
                expect((args.row as Element[]).length).toBe(gridObj.currentViewData.length);
                expect((args.foreignKeyData as Object[]).length).toBe(gridObj.currentViewData.length);
                gridObj.rowDeselected = null;
                done();
            };
            gridObj.rowDeselecting = rowDeselecting;
            gridObj.rowDeselected = rowDeselected;
            (<HTMLElement>gridObj.element.querySelector('.e-checkselectall')).click();
        });
        it('select multiple rows by selectRowsByRange method', (done: Function) => {
            let rowSelecting = (args: RowSelectingEventArgs) => {
                expect(args.rowIndex).toBe(0);
                expect(args.rowIndexes.length).toBe(end + 1);
                expect((args.data as Object[]).length).toBe(end + 1);
                expect((args.row as Element[]).length).toBe(end + 1);
                expect((args.foreignKeyData as Object[]).length).toBe(end + 1);
                gridObj.rowSelecting = null;
            };
            let rowSelected = (args: RowSelectEventArgs) => {
                expect(args.rowIndex).toBe(0);
                expect(args.rowIndexes.length).toBe(end + 1);
                expect((args.data as Object[]).length).toBe(end + 1);
                expect((args.row as Element[]).length).toBe(end + 1);
                expect((args.foreignKeyData as Object[]).length).toBe(end + 1);
                gridObj.rowSelected = null;
                done();
            };
            gridObj.rowSelecting = rowSelecting;
            gridObj.rowSelected = rowSelected;
            gridObj.selectRowsByRange(start, end);
            gridObj.clearSelection();
        });
        it('EJ2-41198 => rowIndexes property single row deselected in header checkbox', (done: Function) => {
            let rowDeselected = (args: RowDeselectEventArgs) => {
                expect(args.rowIndexes.length).toBe(1);
                done();
            };
            gridObj.rowDeselected = rowDeselected;
            (gridObj.element.querySelectorAll('.e-frame.e-icons')[2] as HTMLElement).click();
            (gridObj.element.querySelectorAll('.e-frame.e-icons')[2] as HTMLElement).click();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            gridObj.rowDeselected = null;
            gridObj.rowDeselecting = null;
            gridObj.rowSelecting = null;
            gridObj.rowSelected = null;
        });
    });
    describe('EJ2-67278 - Row deselection is not working in Virtualization with checkbox column', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: infiniteGroupData,
                    enableVirtualization: true,
                    columns: [{ type: "checkbox"},
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: "ShipCity", headerText: "Ship City", width: 250 }],
                    height: 300
                }, done);
        });

        it('single row selecting action', () => {
            expect(gridObj.selectedRowIndex).toBe(-1);
            expect(gridObj.selectionModule.selectedRecords.length).toBe(0);
            gridObj.selectRow(1);
        });
        it('check single row selection and single row de-selecting action', () => {
            expect(gridObj.selectedRowIndex).toBe(1);
            expect(gridObj.selectionModule.selectedRecords.length).toBe(1);
            gridObj.selectRow(1, true);
        });
        it('check single row deselection and header checkbox selection action', () => {
            expect(gridObj.selectedRowIndex).toBe(-1);
            expect(gridObj.selectionModule.selectedRecords.length).toBe(0);
            (<HTMLElement>gridObj.element.querySelector('.e-checkselectall')).click();
        });
        it('check select all selection and header checkbox de-selection action', () => {
            expect(gridObj.selectionModule.selectedRecords.length).toBe(gridObj.currentViewData.length);
            (<HTMLElement>gridObj.element.querySelector('.e-checkselectall')).click();
        });
        it('check select all deselection', () => {
            expect(gridObj.selectionModule.selectedRecords.length).toBe(0);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    describe('EJ2-41468 - row data in rowSelected event args is not maintained properly with Batch edit mode', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0,5),
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID' },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'EmployeeID', headerText: 'Employee ID' },
                        { field: 'ShipCity', headerText: 'Ship City' },
                        { field: 'ShipCountry', headerText: 'Ship Country' }],
                        editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode:'Batch', newRowPosition:'Bottom' },
                        allowPaging: true,
                        pageSettings: { pageCount: 5 },
                        toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                }, done);
        });
    
        it('Adding new record in bottom ', () => {
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Check selected data', () => {
            let rowSelected = (e: RowSelectEventArgs) => {
                expect(e.data["OrderID"].toString()).toBe(dataCell.innerText);
            }
            gridObj.rowSelected = rowSelected;
            let dataCell: HTMLElement = (gridObj.getRows()[1].querySelector('.e-rowcell') as HTMLElement);
            dataCell.click();
        });
    
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            gridObj.rowDeselected = null;
        });
    });

    describe('EJ2-41692 - Row drag issue when field-based checkbox column is present', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID' },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'EmployeeID', headerText: 'Employee ID' },
                        { field: 'Verified', headerText: 'Verified', type:'checkbox' },],
                        height:700,
                }, done);
        });
        it('dataBind', () => {
            gridObj.dataBind();
        });
        it('checkbox records ', () => {
            expect(gridObj.getSelectedRows().length >= 1).toBeTruthy();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    describe('EJ2-42056 - initial selection with persistSelection enabled', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    selectedRowIndex: 1,
                    selectionSettings: { persistSelection: true },
                    columns: [
                        { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'EmployeeID', headerText: 'Employee ID' }
						],
                    height: 700,
                }, done);
        });
        it('checking initial selection ', (done: Function) => {
            expect(gridObj.getSelectedRows().length).toBe(1);
            done();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-42056 - enable toggle with persist selection', () => {
        let gridObj: Grid;
        let rowSelected: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    rowSelected: rowSelected,
                    selectionSettings: { persistSelection: true, enableToggle:false },
                    columns: [
                        { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'EmployeeID', headerText: 'Employee ID' }
                        ],
                    height: 700,
                }, done);
        });
        it('checking select row with toggle', (done: Function) => {
            rowSelected = (): void => {
                expect(gridObj.element.querySelectorAll('.e-row')[3].getAttribute('aria-selected')).toBe('true');
                gridObj.rowSelected = null;
                done();
            };
            gridObj.rowSelected = rowSelected;
            gridObj.selectRow(3, false);
        });
        it('checking select row with enabletoggle', (done: Function) => {
            rowSelected = (): void => {
                expect(gridObj.element.querySelectorAll('.e-row')[3].getAttribute('aria-selected')).toBe('true');
                gridObj.rowSelected = null;
                done();
            };
            gridObj.rowSelected = rowSelected;
            gridObj.selectRow(3, false);
        });
        it('row selection with enable toggle and persistence', (done: Function) => {
            rowSelected = (): void => {
                expect(gridObj.element.querySelectorAll('.e-row')[1].getAttribute('aria-selected')).toBe('true');
                gridObj.rowSelected = null;
                done();
            };
            gridObj.rowSelected = rowSelected;
            (gridObj.getRows()[1].querySelector('.e-rowcell') as HTMLElement).click();
        });
        it('checking the row deselect', (done: Function) => {
            rowSelected = (): void => {
                expect(gridObj.element.querySelectorAll('.e-row')[1].getAttribute('aria-selected')).toBe('true');
                gridObj.rowSelected = null;
                done();
            };
            gridObj.rowSelected = rowSelected;
            (gridObj.getRows()[1].querySelector('.e-rowcell') as HTMLElement).click();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
});
describe(' EJ242851 => Column Selection testing', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    let selectionModule: Selection;
    beforeAll((done: Function) => {
        const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
        gridObj = createGrid(
            {
                dataSource: data,
                allowSorting: true,
                columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }, { field: 'ShipCountry' }],
                allowPaging: true,
                pageSettings: { pageSize: 8, pageCount: 4, currentPage: 1 },
                allowSelection: true,
                selectionSettings: { type: 'Multiple', allowColumnSelection: true },
            }, done);
    });

    it('select Column method testing', () => {
        selectionModule = gridObj.selectionModule;
        selectionModule.selectColumn(1);
        expect(gridObj.element.querySelector('e-selectionbackground')).toBeNull();
        expect((gridObj.element.querySelector('.e-cellselectionbackground') as HTMLTableCellElement)).toBeNull();  
        expect(gridObj.element.querySelector('.e-columnselection')).not.toBeNull();        
    });

    it('select Column by range method testing', () => {
        gridObj.clearSelection();
        selectionModule.selectColumnsByRange(1, 3);
        expect(gridObj.getSelectedColumnsUid().length).toBe(3);
        expect(gridObj.element.querySelector('.e-row').querySelectorAll('.e-columnselection').length).toBe(3);  
        expect(gridObj.getHeaderContent().querySelectorAll('.e-columnselection').length).toBe(3);        
    });

    it('select Column by Collection method testing', () => {
        gridObj.clearSelection();
        selectionModule.selectColumns([2,5]);
        expect(gridObj.getSelectedColumnsUid().length).toBe(2);
        expect(gridObj.element.querySelector('.e-row').querySelectorAll('.e-columnselection').length).toBe(2);  
        expect(gridObj.getHeaderContent().querySelectorAll('.e-columnselection').length).toBe(2);        
    });

    it('select Column with Existing method testing', () => {
        selectionModule.selectColumnWithExisting(3);
        expect(gridObj.getSelectedColumnsUid().length).toBe(3);
        expect(gridObj.element.querySelector('.e-row').querySelectorAll('.e-columnselection').length).toBe(3);  
        expect(gridObj.getHeaderContent().querySelectorAll('.e-columnselection').length).toBe(3);        
    });

    it('check select event', (done: Function) => {
        let columnSelecting: EmitType<Object> = (args: Object) => {
            expect(args['isInteracted']).toBeFalsy();
            expect(args['columnIndex']).toEqual(0);
            expect(args['headerCell']).toEqual(gridObj.getHeaderContent().querySelector('.e-headercell'));
        };
        let columnSelected: EmitType<Object> = (args: Object) => {
            expect(args['isInteracted']).toBeFalsy();
            expect(args['columnIndex']).toEqual(0);
            expect(args['headerCell']).toEqual(gridObj.getHeaderContent().querySelector('.e-headercell'));
            gridObj.columnSelected = null;
            gridObj.columnSelecting = null;
            done();
        };
        gridObj.columnSelecting = columnSelecting;
        gridObj.columnSelected = columnSelected;
        selectionModule.selectColumn(0);
    });

    it('check deselect event', (done: Function) => {
        gridObj.columnDeselected = undefined;
        gridObj.columnDeselecting = undefined;
        let columnDeselecting: EmitType<Object> = (args: Object) => {
            expect(args['isInteracted']).toBeFalsy();
            expect(args['columnIndex']).toEqual(0);
            expect(args['headerCell']).toEqual(gridObj.getHeaderContent().querySelector('.e-headercell'));
        };
        let columnDeselected: EmitType<Object> = (args: Object) => {
            expect(args['isInteracted']).toBeFalsy();
            expect(args['columnIndex']).toEqual(0);
            expect(args['headerCell']).toEqual(gridObj.getHeaderContent().querySelector('.e-headercell'));
            gridObj.columnDeselected = null;
            gridObj.columnDeselecting = null;
            done();
        };
        gridObj.columnDeselecting = columnDeselecting;
        gridObj.columnDeselected = columnDeselected;
        selectionModule.clearColumnSelection();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = preventDefault = selectionModule = null;
    });
});

describe('EJ2-44995 - isInteracted property in rowDeselecting and rowDeselected events with Selectall and paging', () => {
    let gridObj: Grid;
    let rowDeselecting: (args: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [{type:'checkbox'},{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                allowPaging: true,
                pageSettings: { pageSize: 8, pageCount: 4, currentPage: 1 },
                allowSelection: true,
                selectionSettings: { type: 'Multiple', mode: 'Both' },
            }, done);
    });

    it('isInteracted property testing - Click', (done: Function) => {
        rowDeselecting = (args: any) => {
            expect(args.isInteracted).toBeTruthy();
            done();
        };
        gridObj.rowDeselecting = rowDeselecting;
        let selectAll: HTMLElement = (<HTMLElement>gridObj.element.querySelector('.e-checkselectall'));
        selectAll.click();
        selectAll.click();
    });

    it('isInteracted property testing - clearSelection method', (done: Function) => {
        rowDeselecting = (args: any) => {
            expect(args.isInteracted).toBeFalsy();
            done();
        };
        gridObj.rowDeselecting = rowDeselecting;
        (<HTMLElement>gridObj.element.querySelector('.e-checkselectall')).click();
        gridObj.clearSelection();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = rowDeselecting = null;
    });
});

describe('EJ2-45406 - rowDeselect events with persistSelection', () => {
    let gridObj: Grid;
    let rowDeselecting: (args: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [{type:'checkbox'},{ field: 'OrderID', isPrimaryKey: true }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                allowPaging: true,
                pageSettings: { pageSize: 8, pageCount: 4, currentPage: 1 },
                allowSelection: true,
                selectionSettings: { persistSelection: true },
            }, done);
    });

    it('rowDeselecting event testing - Click', (done: Function) => {
        rowDeselecting = (args: any) => {
            done();
        };
        gridObj.rowDeselecting = rowDeselecting;
        (<HTMLElement>gridObj.element.querySelector('.e-row .e-checkselect')).click();
        gridObj.clearSelection();
    });

    it('isInteracted property testing - clearSelection method', (done: Function) => {
        rowDeselecting = (args: any) => {
            done();
        };
        gridObj.rowDeselecting = rowDeselecting;
        (<HTMLElement>gridObj.element.querySelectorAll('.e-rowcell')[1]).click();
        gridObj.clearSelection();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = rowDeselecting = null;
    });
});

describe('EJ2-45650 - Persist Checkbox selection not working properly with frozen column', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                selectionSettings: { persistSelection: true },
                columns: [
                    { type: "checkbox",  headerText: 'Check', width: 120 },
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID', freeze: 'Right' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: "ShipCity", headerText: "Ship City", width: 250 , freeze: 'Left' },
                    ],
                height: 700,
            }, done);
    });
    it('checking Deselect row with persistSelection and frozen column', () => {
        let chkBox: any = gridObj.element.querySelectorAll('.e-checkselect')[0] as HTMLElement;
        chkBox.click();
        chkBox.click();
        expect(chkBox.nextSibling.classList.contains('e-uncheck')).toBeTruthy();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-45836 - The rowSelected event is triggered when rowselectig cancel is true in multiselection', () => {
    let gridObj: Grid;
    let check: boolean = true;
    let rowSelecting: (e?: Object) => void;
    let rowSelected: (e?: Object) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                selectionSettings: { type: "Multiple", enableSimpleMultiRowSelection: true },
                rowSelecting: rowSelecting,
                rowSelected: rowSelected,
                columns: [
                    { type: "checkbox", width: 120 },
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID', freeze: 'Right' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: "ShipCity", headerText: "Ship City", width: 250, freeze: 'Left' },
                ],
                height: 700,
            }, done);
    });
    it('checking rowselected event should not call when rowselecting cancel is true', () => {
        let rowSelecting = (e: any) => {
            e.cancel = true;
        };
        let rowSelected = (e: any) => {
            check = false;
        };
        gridObj.rowSelecting = rowSelecting;
        gridObj.rowSelected = rowSelected;
        (gridObj.element.querySelectorAll('.e-rowcell')[0] as any).click();
        expect(check).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-46492 - Preventing row deselection in the rowDeselecting event is not working', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                selectionSettings: { type: "Multiple" },
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID', freeze: 'Right' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: "ShipCity", headerText: "Ship City", width: 250, freeze: 'Left' },
                ],
                height: 700,
            }, done);
    });
    it('checking rowDeselected event is not Working', () => {
        let rowDeselecting = (e: any) => {
            e.cancel = true;
        };
        gridObj.rowDeselecting = rowDeselecting;
        (gridObj.element.querySelectorAll('.e-rowcell')[0] as any).click();
        (gridObj.element.querySelectorAll('.e-rowcell')[0] as any).click();
        expect(gridObj.getSelectedRowIndexes().length).toBe(1);
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-46492 - Preventing row deselection in the rowDeselecting event is not working', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                selectionSettings: { type: "Multiple" },
                columns: [
                    { type: "checkbox"},
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: "ShipCity", headerText: "Ship City", width: 250 },
                ],
                height: 700,
            }, done);
    });
    it('checking rowDeselected with check column is not Working', () => {
        let chkBox: any = gridObj.element.querySelectorAll('.e-checkselect')[0] as HTMLElement;
        let rowDeselecting = (e: any) => {
            e.cancel = true;
        };
        gridObj.rowDeselecting = rowDeselecting;
        (gridObj.element.querySelectorAll('.e-rowcell')[0] as any).click();
        (gridObj.element.querySelectorAll('.e-rowcell')[0] as any).click();
        expect(chkBox.nextSibling.classList.contains('e-check')).toBeTruthy();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-48271 - Selected Row Index issue after deselection with checkbox', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { type: "checkbox"},
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: "ShipCity", headerText: "Ship City", width: 250 },
                ],
                height: 700,
            }, done);
    });
    it('checking selected row Index in rowDeselected ', () => {
        let rowDeselected = (e: any) => {
            expect(gridObj.selectedRowIndex).toBe(6);
            gridObj.rowDeselected= null;
        };
        gridObj.rowDeselected = rowDeselected;
        gridObj.selectRows([0,4,2,6]);
        expect(gridObj.selectedRowIndex).toBe(6);
        (gridObj.element.querySelectorAll('.e-rowcell')[4] as any).click();

    });
    it('checking selected row Index in rowDeselected with last row', () => {
        let rowDeselected = (e: any) => {
            expect(gridObj.selectedRowIndex).toBe(2);
            gridObj.rowDeselected= null;
        };
        gridObj.rowDeselected = rowDeselected;
        (gridObj.element.querySelectorAll('.e-rowcell')[6] as any).click();

    });
    it('clear all Rows', () => {
        let rowDeselected = (e: any) => {
            expect(gridObj.selectedRowIndex).toBe(-1);
            gridObj.rowDeselected= null;
        };
        gridObj.rowDeselected = rowDeselected;
        gridObj.clearSelection();

    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-56885 - Previously selected data is not returned in selection events when select rows with CTRL key', () => {
    let gridObj: Grid;
    let rowSelecting: (e?: Object) => void;
    let rowSelected: (e?: Object) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                selectionSettings: { type: 'Multiple' },
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: "ShipCity", headerText: "Ship City", width: 250 },
                ],
                height: 700,
            }, done);
    });
    it('Selecting first row', (done: Function) => {
        rowSelected = (): void => {
            gridObj.rowSelected = null;
            done();
        };
        gridObj.rowSelected = rowSelected;
        (gridObj.getRows()[0].querySelector('.e-rowcell') as HTMLElement).click();
    });

    it('multi row - ctrl click testing- selecting second row', (done: Function) => {
        rowSelected = (args?: any) => {
            expect(args.data.length).toBe(2);
            expect(args.row.length).toBe(2);
            gridObj.rowSelected = null;
            done();
        };
        rowSelecting = (args?: any) => {
            expect(args.data.length).toBe(2);
            expect(args.row.length).toBe(2);
            gridObj.rowSelecting = null;
        };
        gridObj.rowSelecting = rowSelecting;
        gridObj.rowSelected = rowSelected;
        (gridObj.selectionModule as any).clickHandler({target: gridObj.getRows()[1].querySelector('.e-rowcell'), ctrlKey: true});
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-53014 - specific row selection feature', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0,15),
                allowPaging: true,
                allowFiltering: true,
                selectionSettings: { persistSelection: true },
                toolbar: ["Add", "Edit","Delete","Save","Cancel"],
                editSettings: {allowAdding: true, allowEditing: true, allowDeleting: true},
                rowDataBound: (args) => {
                    args.isSelectable = args.data.OrderID % 2 === 0;
                },
                columns: [
                    { type: "checkbox" },
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: "ShipCity", headerText: "Ship City", width: 250 },
                ],
                height: 700,
            }, done);
    });
    it('checking selected row Index', (done: Function) => {
        let rowSelected = (e: any) => {
            let row: Element = gridObj.getRows()[1];
            expect(gridObj.getSelectedRecords().length).toBe(6);
            expect(gridObj.getSelectedRows().length).toBe(6);
            expect(gridObj.getSelectedRowIndexes().length).toBe(6);
            expect(gridObj.selectionModule.isPartialSelection).toBe(true);
            expect(row.querySelectorAll('.e-selectionbackground').length).toBe(0);
            gridObj.rowSelected = null;
            done();
        };
        gridObj.rowSelected = rowSelected;
        (gridObj.element.querySelector('.e-checkselectall') as HTMLElement).click()
    });

    // used for code coverage
    it('clear the selection', (done: Function) => {
        let rowDeselected = (e: any) => {
                expect(1).toBe(1);
                gridObj.actionComplete = null;
                done();
        };
        gridObj.rowDeselected = rowDeselected;
        expect(1).toBe(1);
        gridObj.clearSelection();
    });

    it('perform searching', (done: Function) => {
        let actionComplete = (e: any) => {
                expect(1).toBe(1);
                gridObj.actionComplete = null;
                done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.search("10248");
    });

    it('clear searching', (done: Function) => {
        let actionComplete = (e: any) => {
                expect(1).toBe(1);
                gridObj.actionComplete = null;
                done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.search("");
    });

    it('perform filtering', (done: Function) => {
        let actionComplete = (e: any) => {
                expect(1).toBe(1);
                gridObj.actionComplete = null;
                done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.filterByColumn("OrderID", "equal", 10248);
    });

    it('clear filtering', (done: Function) => {
        let actionComplete = (e: any) => {
                expect(1).toBe(1);
                gridObj.actionComplete = null;
                done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.clearFiltering();
    });

    it('edit the record', (done: Function) => {
        let actionComplete = (e: any) => {
            if (e.requestType === 'beginEdit') {
                expect(1).toBe(1);
                gridObj.actionComplete = null;
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.selectRow(2);
        gridObj.startEdit();
    });

    it('save the edited record', (done: Function) => {
        let actionComplete = (e: any) => {
            if (e.requestType === 'save') {
                expect(1).toBe(1);
                gridObj.actionComplete = null;
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.endEdit();
    });

    it('select the records', (done: Function) => {
        let rowSelected = (e: any) => {
            expect(1).toBe(1);
            gridObj.rowSelected = null;
            done();
        };
        gridObj.rowSelected = rowSelected;
        (gridObj.element.querySelector('.e-checkselectall') as HTMLElement).click()
    });

    it('perform paging after selection', (done: Function) => {
        let dataBound = (e: any) => {
                expect(1).toBe(1);
                gridObj.dataBound = null;
                done();
        };
        gridObj.dataBound = dataBound;
        gridObj.goToPage(2);
    });

    it('add the record', (done: Function) => {
        gridObj.addRecord({ OrderID: 1});
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-53014 - specific row selection with virtualization feature', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: infiniteGroupData,
                enableVirtualization: true,
                pageSettings: { pageSize: 30 },
                selectionSettings: { persistSelection: true },
                rowDataBound: (args) => {
                    args.isSelectable = args.data.OrderID % 2 === 0;
                },
                columns: [
                    { type: "checkbox"},
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: "ShipCity", headerText: "Ship City", width: 250 },
                ],
                height: 400,
            }, done);
    });
    it('checking selected row Index', (done: Function) => {
        let rowSelected = (e: any) => {
            let row: Element = gridObj.getRows()[1];
            expect(gridObj.getSelectedRecords().length).toBe(15);
            expect(gridObj.getSelectedRows().length).toBe(15);
            expect(row.querySelectorAll('.e-selectionbackground').length).toBe(0);
            gridObj.rowSelected = null;
            done();
        };
        gridObj.rowSelected = rowSelected;
        (gridObj.element.querySelector('.e-checkselectall') as HTMLElement).click()
    });

    // used for code coverage
    it('do scroll with partal selection', (done: Function) => {
        let dataBound = (e: any) => {
            expect(1).toBe(1);
            gridObj.dataBound = null;
            done();
        };
        gridObj.dataBound = dataBound;
        (gridObj.selectionModule as any).rowsRemoved({records: gridObj.getSelectedRecords()});
        (gridObj.element.querySelector('.e-gridcontent .e-content') as HTMLElement).scrollTop = 10;
    });

    // used for code coverage
    it('refresh Grid', (done: Function) => {
        let dataBound = (e: any) => {
            expect(1).toBe(1);
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

describe('EJ2-59308 Preventing keyboard actions when allow keyboard set to false', () =>{
    let gridObj: Grid;
    let rowSelected: () => void;
    let rows: Element[];
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid({
                dataSource: data,
                allowKeyboard: false,
                columns: [
                { type: 'checkbox', width: 50 },
                { field: 'OrderID', headerText: 'Order ID' },
                { field: 'CustomerID', headerText: 'CustomerID' },
                { field: 'EmployeeID', headerText: 'Employee ID' }],
                allowPaging: true,
                rowSelected: rowSelected
        }, done);
    });
    it('checkbox selection through ctrl click testing', (done: Function) => {
        rowSelected = (): void => {
            expect(gridObj.getSelectedRowIndexes().length).toBe(1);
            gridObj.rowSelected = null;
            done();
        };
        gridObj.rowSelected = rowSelected;
        (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[0].querySelector('.e-rowcell')).click();
        (gridObj.selectionModule as any).clickHandler({target: gridObj.element.querySelectorAll('.e-row')[3]
        .querySelectorAll('.e-rowcell')[2], ctrlKey: true});
    });
    it('Selecting First row', (done: Function) => {
        gridObj.rowSelected = rowSelected;
        gridObj.isCheckBoxSelection = false;
        (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[0].querySelector('.e-rowcell')).click();
        done();
    });
    it('checkbox selection through Shift click testing', (done: Function) => {
        rowSelected = (): void => {
            expect(gridObj.getSelectedRowIndexes().length).toBe(1);
            gridObj.rowSelected = null;
            done();
        };
        gridObj.rowSelected = rowSelected;
        (gridObj.selectionModule as any)
        .clickHandler({target: gridObj.element.querySelectorAll('.e-row')[3].querySelectorAll('.e-rowcell')[2], shiftKey: true});
    });
    it('checkbox selection through space key testing', () => {
        let args: any = { action: 'space', preventDefault: preventDefault };
        rows = gridObj.getRows();
        let chkBox: HTMLElement = (rows[2].querySelector('.e-checkselect') as HTMLElement);
        chkBox.click();
        args.target = chkBox;
        gridObj.keyboardModule.keyAction(args);
        expect(chkBox.nextElementSibling.classList.contains('e-check')).toBeTruthy();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Focus strategy coverage', () =>{
    let gridObj: Grid;
    let rows: Element[];
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid({
                dataSource: data,
                columns: [
                { field: 'OrderID', headerText: 'Order ID' },
                { field: 'CustomerID', headerText: 'CustomerID' },
                { field: 'EmployeeID', headerText: 'Employee ID' }],
        }, done);
    });
    it('focus navigation by Tab and ShiftTab', () => {
        const firstHeaderCell: HTMLElement = gridObj.getHeaderContent().querySelector('.e-headercell');
        expect(firstHeaderCell.getAttribute('tabindex')).toBe('0');
        rows = gridObj.getRows();
        (rows[0] as HTMLTableRowElement).cells[0].focus();
        gridObj.focusModule.setActive(true);
        gridObj.focusModule.active.matrix.current = [0, 0];
        let args: any = { action: 'tab', preventDefault: preventDefault, target: (rows[0] as HTMLTableRowElement).cells[0] };
        (gridObj.focusModule as any).onKeyPress(args);
        expect((rows[0] as HTMLTableRowElement).cells[1].classList.contains('e-focused')).toBeTruthy();
        args = { action: 'shiftTab', preventDefault: preventDefault, target: (rows[0] as HTMLTableRowElement).cells[1] };
        (gridObj.focusModule as any).onKeyPress(args);
        expect((rows[0] as HTMLTableRowElement).cells[0].classList.contains('e-focused')).toBeTruthy();
    });
    it('focus navigation from header to content', () => {
        rows = gridObj.getRows();
        (gridObj.element.querySelectorAll('.e-headercell')[2] as HTMLElement).focus();
        gridObj.focusModule.setActive(false);
        gridObj.focusModule.active.matrix.current = [0, 2];
        let args: any = { action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelectorAll('.e-headercell')[2] };
        (gridObj.focusModule as any).onKeyPress(args);
        expect((rows[0] as HTMLTableRowElement).cells[0].classList.contains('e-focused')).toBeTruthy();
        args = { action: 'shiftTab', preventDefault: preventDefault, target: (rows[0] as HTMLTableRowElement).cells[0] };
        (gridObj.focusModule as any).onKeyPress(args);
        expect(gridObj.element.querySelectorAll('.e-headercell')[2].classList.contains('e-focused')).toBeTruthy();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-59499 - implementation on Persist Selection misbehaves while sort, filter and search with virtualization => ', () => {
    let gridObj: Grid;
    let actionComplete: (e?: any) => void;
    let cols: any;
    let clearFilter: Function = (gridObj: Grid, done: Function) => {
        let actionComplete: any = (args?: Object): void => {
            if (gridObj.element.querySelectorAll('.e-row').length === (data.slice(0, 10)).length &&
                gridObj.filterSettings.columns.length === 0) {
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.clearFiltering();
    };
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0, 10),
                selectionSettings:{ persistSelection: true },
                enableVirtualization: true,
                allowSorting: true,
                allowFiltering: true,
                toolbar: ['Search'],
                columns: [
                    { type: "checkbox", width: "60" },
                    { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true },
                    { headerText: 'CustomerID', field: 'CustomerID' },
                    { headerText: 'EmployeeID', field: 'EmployeeID' },
                    { headerText: 'ShipCountry', field: 'ShipCountry' },
                    { headerText: 'ShipCity', field: 'ShipCity' },
                ],
                actionComplete: actionComplete,
                height: 300,
            }, done);
    });

    it('select the row action', () => {
        gridObj.selectRow(1, true);
    });

    it('check normal selection action', () => {
        var rows = gridObj.getRows();
        expect(parseInt(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex'), 10) - 1).toBe(1);
        expect(rows[1].querySelectorAll('.e-selectionbackground').length).toBe(6);
    });

    it('Check Single sort orderID dsc action', (done: Function) => {
        actionComplete = (args: any): any => {
            expect(cols[1].querySelectorAll('.e-descending').length).toBe(1);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toBe(0);
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.sortColumn("OrderID", "Descending", false);
        cols = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
    });

    it('check persist selection after sorting operation', () => {
        var rows = gridObj.getRows();
        expect(parseInt(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex'), 10) - 1).not.toBe(1);
        expect(rows[1].querySelectorAll('.e-selectionbackground').length).not.toBe(6);
        expect(parseInt(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex'), 10) - 1).toBe(8);
        expect(rows[8].querySelectorAll('.e-selectionbackground').length).toBe(6);
    });

    it('filter action', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.filterByColumn('OrderID', 'equal', 10249);
    });

    it('check persist selection after filtering operation', () => {
        var rows = gridObj.getRows();
        expect(parseInt(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex'), 10) - 1).toBe(0);
        expect(rows[0].querySelectorAll('.e-selectionbackground').length).toBe(6);
    });

    it('clear Filtering testing', (done: Function) => {
        clearFilter(gridObj, done);
    });

    it('Search method testing', (done: Function) => {
        actionComplete = (args: any): void => {
            if (args.requestType == 'searching') {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.searchModule.search('10249');
    });

    it('check persist selection after searching operation', () => {
        var rows = gridObj.getRows();
        expect(parseInt(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex'), 10) - 1).toBe(0);
        expect(rows[0].querySelectorAll('.e-selectionbackground').length).toBe(6);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj.actionComplete = null;
        gridObj = null;
    });
});

describe('EJ2-59308 Preventing keyboard actions when allow keyboard set to false', () =>{
    let gridObj: Grid;
    let rowSelected: () => void;
    let rows: Element[];
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid({
                dataSource: data,
                allowKeyboard: false,
                columns: [
                { type: 'checkbox', width: 50 },
                { field: 'OrderID', headerText: 'Order ID' },
                { field: 'CustomerID', headerText: 'CustomerID' },
                { field: 'EmployeeID', headerText: 'Employee ID' }],
                allowPaging: true,
                rowSelected: rowSelected
        }, done);
    });
    it('checkbox selection through ctrl click testing', (done: Function) => {
        rowSelected = (): void => {
            expect(gridObj.getSelectedRowIndexes().length).toBe(1);
            gridObj.rowSelected = null;
            done();
        };
        gridObj.rowSelected = rowSelected;
        (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[0].querySelector('.e-rowcell')).click();
        (gridObj.selectionModule as any).clickHandler({target: gridObj.element.querySelectorAll('.e-row')[3]
        .querySelectorAll('.e-rowcell')[2], ctrlKey: true});
    });
    it('Selecting First row', (done: Function) => {
        gridObj.rowSelected = rowSelected;
        gridObj.isCheckBoxSelection = false;
        (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[0].querySelector('.e-rowcell')).click();
        done();
    });
    it('checkbox selection through Shift click testing', (done: Function) => {
        rowSelected = (): void => {
            expect(gridObj.getSelectedRowIndexes().length).toBe(1);
            gridObj.rowSelected = null;
            done();
        };
        gridObj.rowSelected = rowSelected;
        (gridObj.selectionModule as any)
        .clickHandler({target: gridObj.element.querySelectorAll('.e-row')[3].querySelectorAll('.e-rowcell')[2], shiftKey: true});
    });
    it('checkbox selection through space key testing', () => {
        let args: any = { action: 'space', preventDefault: preventDefault };
        rows = gridObj.getRows();
        let chkBox: HTMLElement = (rows[2].querySelector('.e-checkselect') as HTMLElement);
        chkBox.click();
        args.target = chkBox;
        gridObj.keyboardModule.keyAction(args);
        expect(chkBox.nextElementSibling.classList.contains('e-check')).toBeTruthy();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-60999 Row selection is not updated properly inside the rowDeselected event while data actions', () => {
    let gridObj: Grid;
    let rowSelected: () => void;
    let rowDeselected: (args: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid({
            dataSource: data,
            allowPaging: true,
            allowSorting: true,
            columns: [
                { field: 'OrderID', headerText: 'Order ID' },
                { field: 'CustomerID', headerText: 'CustomerID' },
                { field: 'EmployeeID', headerText: 'Employee ID' }],
            rowSelected: rowSelected
        }, done);
    });
    it('Selecting a row', (done: Function) => {
        rowSelected = (): void => {
            gridObj.rowSelected = null;
            done();
        };
        gridObj.rowSelected = rowSelected;
        (gridObj.getRows()[0].querySelector('.e-rowcell') as HTMLElement).click();
    });
    it('EJ2-60026 - Ensuring Selected records to be null in rowDeselected event', (done: Function) => {
        rowDeselected = (e: any) => {
            expect(gridObj.getSelectedRecords().length).toBe(0);
            done();
        };
        gridObj.rowDeselected = rowDeselected;
        (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[4].querySelector('.e-rowcell')).click();
        (gridObj.getHeaderContent().querySelectorAll('.e-headercell')[0] as HTMLElement).click();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-62907-Checking rowSelected event should have rowIndexes when single row is selected', () => {
    let gridObj: Grid;
    let rowSelected: (e?: Object) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                selectionSettings: { type: "Multiple", enableSimpleMultiRowSelection: true },
                rowSelected: rowSelected,
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID', freeze: 'Right' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: "ShipCity", headerText: "Ship City", width: 250, freeze: 'Left' },
                ],
                height: 700,
            }, done);
    });
    it('Checking rowIndexes', () => {
        let rowSelected = (e: any) => {
            expect(e.rowIndexes).toBeDefined();
        };
        gridObj.rowSelected = rowSelected;
        (gridObj.element.querySelectorAll('.e-rowcell')[1] as any).click();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-67746-Checking rowSelected, rowDeselected event should not have cancel property', () => {
    let gridObj: Grid;
    let rowSelected: (e?: Object) => void;
    let rowSelecting: (e?: Object) => void;
    let rowDeselected: (e?: Object) => void;
    let rowDeselecting: (e?: Object) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                selectionSettings: { type: "Multiple", enableSimpleMultiRowSelection: true },
                rowSelected: rowSelected,
                rowSelecting: rowSelecting,
                rowDeselected: rowDeselected,
                rowDeselecting: rowDeselecting,
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID', freeze: 'Right' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: "ShipCity", headerText: "Ship City", width: 250, freeze: 'Left' },
                ],
                height: 700,
            }, done);
    });
    it('Checking rowSelected cancel property', () => {
        let rowSelected = (e: any) => {
            expect(e.cancel).toBeUndefined();
        };
        gridObj.rowSelected = rowSelected;
        (gridObj.element.querySelectorAll('.e-rowcell')[1] as any).click();
    });
    it('Checking rowSelecting cancel property', () => {
        let rowSelecting = (e: any) => {
            expect(e.cancel).toBeFalsy();
        };
        gridObj.rowSelecting = rowSelecting;
        (gridObj.element.querySelectorAll('.e-rowcell')[1] as any).click();
    });
    it('Checking rowDeselected cancel property', () => {
        let rowDeselected = (e: any) => {
            expect(e.cancel).toBeUndefined();
        };
        gridObj.rowDeselected = rowDeselected;
        (gridObj.element.querySelectorAll('.e-rowcell')[1] as any).click();
    });
    it('Checking rowDeselecting cancel property', () => {
        let rowDeselecting = (e: any) => {
            expect(e.cancel).toBeFalsy();
        };
        gridObj.rowDeselecting = rowDeselecting;
        (gridObj.element.querySelectorAll('.e-rowcell')[1] as any).click();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-65110 - Enter and shiftEnter key functionality with template column', () => {
    let gridObj: Grid;
    let rows: Element[];
    let preventDefault: Function = new Function();
    beforeAll((done) => {
        gridObj = createGrid({
            dataSource: data,
            allowPaging: true,
            allowSelection: true,
            selectionSettings: { mode: 'Cell' },
            enableHover: false,
            columns: [
                { type: 'checkbox', width: 50 },
                { field: 'OrderID', headerText: 'OrderID', width: 180 },
                {
                    headerText: 'Employee Image', textAlign: 'Center',
                    template: '<div>${CustomerID}</div>', width: 150
                },
                { field: 'ShipPostalCode', headerText: 'ShipPostalCode', width: 195, textAlign: 'Right' },
                { field: 'ShipCity', headerText: 'ShipCity', width: 120 },
                { field: 'ShipCountry', headerText: 'ShipCountry', width: 130 }
            ],
            pageSettings: { pageCount: 2 },
        }, done);
    });
    it('focus navigation by enter and ShiftEnter', () => {
        gridObj.dataBind();
        rows = gridObj.getRows();
        (rows[0] as HTMLTableRowElement).cells[2].focus();
        gridObj.focusModule.setActive(true);
        gridObj.focusModule.active.matrix.current = [0, 2];
        let args: any = { action: 'enter', preventDefault: preventDefault, target: (rows[0] as HTMLTableRowElement).cells[2] };
        (gridObj.focusModule as any).onKeyPress(args);
        expect((rows[1] as HTMLTableRowElement).cells[2].classList.contains('e-focused')).toBeTruthy();
        args = { action: 'shiftEnter', preventDefault: preventDefault, target: (rows[1] as HTMLTableRowElement).cells[2] };
        (gridObj.focusModule as any).onKeyPress(args);
        expect((rows[0] as HTMLTableRowElement).cells[2].classList.contains('e-focused')).toBeTruthy();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

// commented due to API slow leads to test case fail
// describe('EJ2-828323 - ResetOnRowClick resets the checked row only in the current page while using remote data binding', () => {
//     let gridObj: Grid;
//     const hostUrl = 'https://services.syncfusion.com/js/production/';
//     beforeAll((done: Function) => {
//         gridObj = createGrid(
//             {
//                 dataSource: new DataManager({
//                     url: hostUrl + 'api/Orders',
//                     adaptor: new WebApiAdaptor(),
//                     crossDomain: true,
//                 }),
//                 allowPaging: true,
//                 allowSelection: true,
//                 selectionSettings: { persistSelection: true, type: 'Multiple', checkboxMode: 'ResetOnRowClick' },
//                 editSettings: { allowDeleting: true },
//                 toolbar: ['Delete'],
//                 enableHover: false,
//                 columns: [
//                     { type: 'checkbox', width: 50 },
//                     { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 120, textAlign: 'Right' },
//                     { field: 'CustomerName', headerText: 'CustomerName', width: 130 },
//                     { field: 'Freight', format: 'C2', textAlign: 'Right', editType: 'numericedit', width: 120 },
//                     { field: 'ShipCountry', visible: false, headerText: 'Ship Country', width: 150 },
//                     { field: 'ShipCity', headerText: 'Ship City', width: 150 }
//                 ],
//             }, done);
//     });
//     it('clicking the selectAll checkbox and moving to next page', () => {
//         gridObj.dataBind();
//         (<HTMLElement>gridObj.element.querySelector('.e-checkselectall')).click();
//         gridObj.goToPage(2);
//     });
//     it('Selecting a record in second page and moving to first page', () => {
//         let rowSelecting = (e: any) => {
//         };
//         gridObj.rowSelecting = rowSelecting;
//         (gridObj.element.querySelectorAll('.e-rowcell')[16] as any).click();
//         gridObj.goToPage(1);
//     });
//     it('Ensuring the number of selected records', () => {
//          expect(gridObj.selectionModule.getSelectedRecords().length).toBe(1);
//     });
//     afterAll(() => {
//         destroy(gridObj);
//         gridObj = null;
//     });
// });

describe('BUG 836872 - The selectedRowIndex property is experiencing some issues and is not functioning correctly', () => {
    let gridObj: Grid;
    let rowSelected: (e?: Object) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                allowSelection: true,
                selectionSettings: { persistSelection: true },
                editSettings: {allowDeleting: true},
                toolbar: ['Delete'],
                enableHover: false,
                pageSettings: { pageCount: 2 },
                columns: [
                    { type: 'checkbox', width: 50 },
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', width: 180 },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 195, textAlign: 'Right' },
                    { field: 'EmployeeID', headerText: 'EmployeeID', width: 120 },
                    { field: 'ShipCity', headerText: 'ShipCity', width: 130 }
                ],                
                rowSelected: rowSelected,
            }, done);
    });
    it('Checking selectedRowIndex', function () {
        gridObj.selectRow(2, true);
        gridObj.selectRow(3, true);
        expect(gridObj.selectedRowIndex).toBe(3);
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('BUG 837180 - Selection moved to first row when newRowPosition given as Bottom', () => {
    let gridObj: Grid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: [],
                allowPaging: true,
                pageSettings: { pageCount: 5 },
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', newRowPosition: 'Bottom' },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', validationRules: { required: true, number: true }, width: 140},
                    { field: 'CustomerID', headerText: 'Customer ID', validationRules: { required: true }, width: 140},
                    { field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit', width: 140, format: 'C2', validationRules: { required: true }},
                    { field: 'OrderDate', headerText: 'Order Date', editType: 'datetimepickeredit', width: 160, format: { type: 'dateTime', format: 'M/d/y hh:mm a' },},
                    { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150, edit: { params: { popupHeight: '300px' } }}],
                    actionBegin : (args?: any): void => {
                        if (args.requestType === 'save') {
                            if (gridObj.pageSettings.currentPage !== 1 && gridObj.editSettings.newRowPosition === 'Top') {
                                args.index = (gridObj.pageSettings.currentPage * gridObj.pageSettings.pageSize) - gridObj.pageSettings.pageSize;
                            }
                            else if (gridObj.editSettings.newRowPosition === 'Bottom') {
                                args.index = (gridObj.dataSource['length']) ? gridObj.currentViewData.length  : 0;
                            }
                        }
                    }
                }, done);
    });
    
    it('1st Add complete', function (done) {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.selectedRowIndex).toBe(0);
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.editModule.editModule.addRecord({ OrderID: 10247, CustomerID: 'updated', Freight: 12 });
    });
    it('2st Add complete', function (done) {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.selectedRowIndex).toBe(1);
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.editModule.editModule.addRecord({ OrderID: 10244, CustomerID: 'updated', Freight: 13 });
    });

    afterAll(function () {
        destroy(gridObj);
        gridObj.actionComplete = null;
        gridObj = null;
    });
});

describe('BUG 839515 - Selection moved to first row while addRecord( ) with index value', () => {
    let gridObj: Grid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                pageSettings: { pageCount: 5 },
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', validationRules: { required: true, number: true }, width: 140},
                    { field: 'CustomerID', headerText: 'Customer ID', validationRules: { required: true }, width: 140},
                    { field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit', width: 140, format: 'C2', validationRules: { required: true }},
                    { field: 'OrderDate', headerText: 'Order Date', editType: 'datetimepickeredit', width: 160, format: { type: 'dateTime', format: 'M/d/y hh:mm a' },},
                    { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150, edit: { params: { popupHeight: '300px' } }}],
            }, done);
    });

    it('Add new row using addRecord', function (done) {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.selectedRowIndex).toBe(5);
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.editModule.editModule.addRecord({ OrderID: 10001, CustomerID: 'New Record', Freight: 10 }, 5);
    });
    it('Add 2nd row using addRecord', function (done) {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.selectedRowIndex).toBe(-1);
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.editModule.editModule.addRecord({ OrderID: 10001, CustomerID: 'New Record', Freight: 10 }, 15);
    });
    afterAll(function () {
        destroy(gridObj);
        gridObj.actionComplete = null;
        gridObj = null;
    });
});

describe('BUG 842498 - In a checkbox with a specified field, if you click the intermediate checkbox, all checkboxes should be selected', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { type: 'checkbox', field: 'Verified', width: 120 },
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120, isPrimaryKey: true },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
                    { field: 'ShipCity', headerText: 'Ship City', width: 150 },
                    { field: 'ShipName', headerText: 'Ship Name', width: 150 }
                ],
            }, done);
    });
    it('Select selectAll checkbox', function (done) {
        done();
    });
    it('Check selectAll checkbox', function () {
        (<HTMLElement>gridObj.element.querySelector('.e-checkselectall')).click();
        expect((document.getElementsByClassName('e-checkselectall')[0] as HTMLElement)['checked']).toBeTruthy();
    });
    afterAll(function () {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Code Coverage - autofill with scroll', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                selectionSettings: {
                    mode: 'Cell',
                    type: 'Multiple'
                },
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                enableAutoFill: true,
                pageSettings: { pageSize: 5 },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', visible: false, textAlign: 'Right', width: 120, isPrimaryKey: true },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
                    { field: 'ShipCity', headerText: 'Ship City', width: 150 },
                    { field: 'ShipName', headerText: 'Ship Name', visible: false, width: 150 },
                    { field: 'OrderDate', headerText: 'Order Date', editType: 'datetimepickeredit', width: 160, format: { type: 'dateTime', format: 'M/d/y hh:mm a' }, },
                    { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150, edit: { params: { popupHeight: '300px' } } },
                    { field: 'ShipAddress', headerText: 'Ship Address', width: 150 },
                    { field: 'ShipRegion', headerText: 'Ship Region', width: 150 },
                ],
            }, done);
    });
    it('for coverage - 1', () => {
        (gridObj.getCellFromIndex(2, 2) as HTMLElement).click();
        (<any>gridObj.selectionModule).startDIndex = 2;
        (<any>gridObj.selectionModule).startDCellIndex = 2;
        (<any>gridObj.selectionModule).startAFCell = gridObj.getCellFromIndex(2, 2);
    });
    it('for coverage - 2', () => {
        (<any>gridObj.selectionModule).setScrollPosition(gridObj.getContent(), 'right', null);
        (<any>gridObj.selectionModule).setScrollPosition(gridObj.getContent(), 'right', null);
        (<any>gridObj.selectionModule).setScrollPosition(gridObj.getContent(), 'right', null);
        (<any>gridObj.selectionModule).setScrollPosition(gridObj.getContent(), 'right', null);
        (<any>gridObj.selectionModule).setScrollPosition(gridObj.getContent(), 'left', null);
        (<any>gridObj.selectionModule).setScrollPosition(gridObj.getContent(), 'left', null);
        (<any>gridObj.selectionModule).setScrollPosition(gridObj.getContent(), 'left', null);
        (<any>gridObj.selectionModule).setScrollPosition(gridObj.getContent(), 'left', null);
        (<any>gridObj.selectionModule).setScrollPosition(gridObj.getContent(), 'down', null);
        (<any>gridObj.selectionModule).setScrollPosition(gridObj.getContent(), 'up', null);
        (<any>gridObj.selectionModule).isAutoFillSel = true;
        (<any>gridObj.selectionModule).setScrollPosition(gridObj.getContent(), 'left', null);
        (<any>gridObj.selectionModule).isAutoFillSel = false;
        (<any>gridObj.selectionModule).setScrollPosition(gridObj.getContent(), 'left', null);
        (<any>gridObj.selectionModule).setScrollPosition(gridObj.getContent(), 'up', { target: gridObj.getColumnHeaderByIndex(2) });
    });
    afterAll(function () {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Code Coverage - left freeze with autofill', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                frozenRows: 2,
                frozenColumns: 2,
                selectionSettings: {
                    mode: 'Cell',
                    type: 'Multiple'
                },
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                enableAutoFill: true,
                pageSettings: { pageSize: 5 },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120, isPrimaryKey: true },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
                    { field: 'ShipCity', headerText: 'Ship City', width: 150 },
                    { field: 'ShipName', headerText: 'Ship Name', width: 150 },
                    { field: 'OrderDate', headerText: 'Order Date', editType: 'datetimepickeredit', width: 160, format: { type: 'dateTime', format: 'M/d/y hh:mm a' },},
                    { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150, edit: { params: { popupHeight: '300px' } }},
                    { field: 'ShipAddress', headerText: 'Ship Address', width: 150 },
                    { field: 'ShipRegion', headerText: 'Ship Region', width: 150 },
                ],
            }, done);
    });
    it('for coverage - 1', () => {
        (gridObj.getCellFromIndex(2, 2) as HTMLElement).click();
    });

    it('1,3 => for coverage - 2', () => {
        let elem: Element = gridObj.getCellFromIndex(2, 1);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    it('3,4 => for coverage - 3', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 1);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    it('4 => for coverage - 4', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 1);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        gridObj.enableRtl = true;
    });

    it('1,3 => for coverage - 5', () => {
        let elem: Element = gridObj.getCellFromIndex(2, 6);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 6);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    it('3,4 => for coverage - 6', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 6);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 5);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    it('4 => for coverage - 7', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 6);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 5);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    afterAll(function () {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Code Coverage - Left - Right - Fixed freeze with autofill', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                frozenRows: 2,
                selectionSettings: {
                    mode: 'Cell',
                    type: 'Multiple'
                },
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                enableAutoFill: true,
                pageSettings: { pageSize: 5 },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', freeze: 'Left', width: 120, isPrimaryKey: true },
                    { field: 'CustomerID', headerText: 'Customer ID', freeze: 'Left', width: 150 },
                    { field: 'ShipCity', headerText: 'Ship City', width: 150 },
                    { field: 'ShipName', headerText: 'Ship Name', width: 150 },
                    { field: 'OrderDate', headerText: 'Order Date', freeze: 'Fixed', editType: 'datetimepickeredit', width: 160, format: { type: 'dateTime', format: 'M/d/y hh:mm a' },},
                    { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150, edit: { params: { popupHeight: '300px' } }},
                    { field: 'ShipAddress', headerText: 'Ship Address', freeze: 'Right', width: 150 },
                    { field: 'ShipRegion', headerText: 'Ship Region', freeze: 'Right', width: 150 },
                ],
            }, done);
    });
    
    it('for coverage - 1', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 1);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 3);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 4);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 6);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 3);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 4);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 6);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(4, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(4, 3);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(4, 4);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(4, 6);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
    });

    it('for coverage - 2', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 1);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 3);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(2, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(2, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    it('for coverage - 3', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 1);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        let autoFillTarget: Element = gridObj.element.querySelector('.e-autofill');
        elem = gridObj.getCellFromIndex(2, 3);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: autoFillTarget, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        autoFillTarget = gridObj.element.querySelector('.e-autofill');
        elem = gridObj.getCellFromIndex(2, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: autoFillTarget, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(2, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        autoFillTarget = gridObj.element.querySelector('.e-autofill');
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: autoFillTarget, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(2, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        autoFillTarget = gridObj.element.querySelector('.e-autofill');
        elem = gridObj.getCellFromIndex(1, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: autoFillTarget, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        gridObj.enableRtl = true;
    });

    it('for coverage - 4', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 1);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 3);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 4);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 6);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 3);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 4);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 6);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(4, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(4, 3);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(4, 4);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(4, 6);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
    });

    it('for coverage - 5', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 1);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 3);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(2, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(2, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    it('for coverage - 6', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 1);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        let autoFillTarget: Element = gridObj.element.querySelector('.e-autofill');
        elem = gridObj.getCellFromIndex(2, 3);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: autoFillTarget, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        autoFillTarget = gridObj.element.querySelector('.e-autofill');
        elem = gridObj.getCellFromIndex(2, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: autoFillTarget, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(2, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        autoFillTarget = gridObj.element.querySelector('.e-autofill');
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: autoFillTarget, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(2, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        autoFillTarget = gridObj.element.querySelector('.e-autofill');
        elem = gridObj.getCellFromIndex(1, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: autoFillTarget, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    afterAll(function () {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Code Coverage - Right - Fixed freeze with autofill', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                frozenRows: 2,
                selectionSettings: {
                    mode: 'Cell',
                    type: 'Multiple'
                },
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                enableAutoFill: true,
                pageSettings: { pageSize: 5 },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120, isPrimaryKey: true },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
                    { field: 'ShipCity', headerText: 'Ship City', width: 150 },
                    { field: 'ShipName', headerText: 'Ship Name', width: 150 },
                    { field: 'OrderDate', headerText: 'Order Date', freeze: 'Fixed', editType: 'datetimepickeredit', width: 160, format: { type: 'dateTime', format: 'M/d/y hh:mm a' },},
                    { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150, edit: { params: { popupHeight: '300px' } }},
                    { field: 'ShipAddress', headerText: 'Ship Address', freeze: 'Right', width: 150 },
                    { field: 'ShipRegion', headerText: 'Ship Region', freeze: 'Right', width: 150 },
                ],
            }, done);
    });

    it('for coverage - 1', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 1);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 3);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(2, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(2, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    it('for coverage - 2', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 1);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        let autoFillTarget: Element = gridObj.element.querySelector('.e-autofill');
        elem = gridObj.getCellFromIndex(2, 3);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: autoFillTarget, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        autoFillTarget = gridObj.element.querySelector('.e-autofill');
        elem = gridObj.getCellFromIndex(2, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: autoFillTarget, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(2, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        autoFillTarget = gridObj.element.querySelector('.e-autofill');
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: autoFillTarget, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(2, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        autoFillTarget = gridObj.element.querySelector('.e-autofill');
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: autoFillTarget, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        gridObj.enableRtl = true;
    });

    it('for coverage - 3', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 1);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 3);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(2, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(2, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    it('for coverage - 4', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 1);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        let autoFillTarget: Element = gridObj.element.querySelector('.e-autofill');
        elem = gridObj.getCellFromIndex(2, 3);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: autoFillTarget, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        autoFillTarget = gridObj.element.querySelector('.e-autofill');
        elem = gridObj.getCellFromIndex(2, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: autoFillTarget, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(2, 1);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        autoFillTarget = gridObj.element.querySelector('.e-autofill');
        elem = gridObj.getCellFromIndex(1, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: autoFillTarget, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        elem = gridObj.getCellFromIndex(2, 2);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        autoFillTarget = gridObj.element.querySelector('.e-autofill');
        elem = gridObj.getCellFromIndex(1, 2);
        elem.classList.add('e-cellselectionbackground');
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: autoFillTarget, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    afterAll(function () {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Code Coverage - Left - Right freeze with autofill', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                frozenRows: 2,
                selectionSettings: {
                    mode: 'Cell',
                    type: 'Multiple'
                },
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                enableAutoFill: true,
                pageSettings: { pageSize: 5 },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', freeze: 'Left', width: 120, isPrimaryKey: true },
                    { field: 'CustomerID', headerText: 'Customer ID', freeze: 'Left', width: 150 },
                    { field: 'ShipCity', headerText: 'Ship City', width: 150 },
                    { field: 'ShipName', headerText: 'Ship Name', width: 150 },
                    { field: 'OrderDate', headerText: 'Order Date', editType: 'datetimepickeredit', width: 160, format: { type: 'dateTime', format: 'M/d/y hh:mm a' },},
                    { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150, edit: { params: { popupHeight: '300px' } }},
                    { field: 'ShipAddress', headerText: 'Ship Address', freeze: 'Right', width: 150 },
                    { field: 'ShipRegion', headerText: 'Ship Region', freeze: 'Right', width: 150 },
                ],
            }, done);
    });

    it('3 => for coverage - 1', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 1);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 6);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    it('6 => for coverage - 2', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 1);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(4, 6);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    it('6 => for coverage - 3', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 6);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 5);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    it('5 => for coverage - 4', () => {
        let elem: Element = gridObj.getCellFromIndex(2, 6);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 5);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    it('2,5,4,6 => for coverage - 5', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 5);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 6);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        gridObj.enableRtl = true;
    });

    it('3 => for coverage - 6', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 1);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 6);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    it('6 => for coverage - 7', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 1);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(4, 6);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    it('6 => for coverage - 8', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 6);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(1, 5);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    it('5 => for coverage - 9', () => {
        let elem: Element = gridObj.getCellFromIndex(2, 6);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 5);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    it('2,5,4,6 => for coverage - 10', () => {
        let elem: Element = gridObj.getCellFromIndex(1, 5);
        let elemClient: any = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseDownHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
        (elem as HTMLElement).click();
        elem = gridObj.getCellFromIndex(2, 6);
        elemClient = elem.getBoundingClientRect();
        (<any>gridObj.selectionModule).mouseMoveHandler({ target: elem, preventDefault: function () { }, clientX: elemClient.x, clientY: elemClient.y });
        (<any>gridObj.selectionModule).mouseUpHandler({ target: elem, preventDefault: () => { }, clientX: elemClient.x, clientY: elemClient.y });
    });

    afterAll(function () {
        destroy(gridObj);
        gridObj = null;
    });

    // used for code coverage
    describe('on property change', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0,5),
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID' },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowPaging: true,
                    selectionSettings: { type: 'Multiple', mode: 'Cell', cellSelectionMode: 'Box' },
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                }, done);
        });

        it('execute methods 1', (done: Function) => {
            (gridObj.selectionModule as any).isFirstRow(gridObj.element.querySelector('.e-rowcell'));
            expect(1).toBe(1);
            done();
        });

        it('enable auto fill', (done: Function) => {
            gridObj.enableAutoFill = true;
            expect(1).toBe(1);
            done();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('283715 => Checkbox cell selection is not properly cleared on clearSelection method call.', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0,5),
                    columns: [
                        { type: 'checkbox', width: 50 },
                        { field: 'OrderID', headerText: 'Order ID' },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'ShipCountry', headerText: 'Ship Country' }],
                    selectionSettings: { type: 'Multiple', mode: 'Cell', cellSelectionMode: 'Flow' },
                }, done);
        });

        it('checkbox column cell selection', (done: Function) => {
            (<any>gridObj.selectionModule).selectCell({ rowIndex: 3, cellIndex: 0 }, true);
            done();
        });

        it('checkbox column cell de-selection', (done: Function) => {
            (<any>gridObj.selectionModule).clearCellSelection();
            expect((<any>gridObj.selectionModule).selectedRowIndexes.length).toBe(0);
            expect((<any>gridObj.selectionModule).selectedRowCellIndexes.length).toBe(0);
            done();
        });        

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
});

describe('853221 => When row drag and drop enabled, cell selection is not working properly.', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    let rows: Element[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0,5),
                allowRowDragAndDrop: true,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                selectionSettings: { type: 'Multiple', mode: 'Cell', cellSelectionMode: 'Box' },
            }, done);
    });

    it('First row second column cell selection', (done: Function) => {
        (<any>gridObj.selectionModule).selectCell({ rowIndex: 0, cellIndex: 1 }, true);
        done();
    });

    it('checking cell selection using shiftRight keyboard shortcut', (done: Function) => {
        rows = gridObj.getRows();
        let args: any = { action: 'shiftRight', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(rows[0].querySelectorAll('.e-rowcell')[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
        done();
    });        

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-855396 - SelectionSettings mode as Both shows wrong selected items', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [{ type: 'checkbox' }, { field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                allowSelection: true,
                selectionSettings: { type: 'Multiple', mode: 'Both' },
                enableHover: false,
            }, done);
    });

    it('Selecting with checkbox', (done: Function) => {
        (gridObj.element.querySelectorAll('.e-rowcell')[1] as any).click();
        (gridObj.element.querySelectorAll('.e-gridchkbox')[0] as any).click();
        done();
        expect(gridObj.selectionModule.selectedRowCellIndexes[0].cellIndexes[0]).toBe(1);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-885652 - Programmatic row deselect with toggle as true, not trigger rowDeselecting, rowDeselected events and not deselect row when the grid has existing selected rows', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                toolbar: [ 'Select' ],
                toolbarClick: function() {
                    gridObj.selectRow(3, true);
                },
                columns: [{ type: 'checkbox' }, { field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                allowSelection: true,
                selectionSettings: { persistSelection: true },
                enableHover: false,
            }, done);
    });

    it('Selecting with checkbox', (done: Function) => {
        (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[0].querySelector('.e-rowcell')).click();
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_select' } });
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_select' } });
        expect(gridObj.selectionModule.selectedRecords.length).toBe(1);
        done();
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-890459 - Programmatic row deselect with toggle as true not working properly when initially selected the toggle row index then select another row checkbox', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                toolbar: [ 'Select' ],
                toolbarClick: function() {
                    gridObj.selectRow(3, true);
                },
                columns: [{ type: 'checkbox' }, { field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                allowSelection: true,
                selectionSettings: { persistSelection: true },
                enableHover: false,
            }, done);
    });

    it('Selecting with checkbox', (done: Function) => {
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_select' } });
        (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[0].querySelector('.e-rowcell')).click();
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_select' } });
        expect(gridObj.selectionModule.selectedRecords.length).toBe(1);
        done();
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-891988 - SelectRow method with toggle set to true does not selects the rows properly.', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                toolbar: ['Select1','Select123'],
                toolbarClick: function (args) {
                    if (args.item.id === gridObj.element.id + '_select1') {
                        gridObj.selectRow(0, true);
                    }
                    if (args.item.id === gridObj.element.id + '_select123') {
                        gridObj.selectRows([0, 1, 2]);
                    }
                },
                columns: [{ type: 'checkbox' }, { field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                allowSelection: true,
                selectionSettings: { persistSelection: true },
                enableHover: false,
            }, done);
    });

    it('Selecting with checkbox', (done: Function) => {
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_select123' } });
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_select1' } });
        expect(gridObj.selectionModule.selectedRecords.length).toBe(2);
        done();
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Code Coverage - selection - enableAutoFill setScrollPosition', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                selectionSettings: {
                    mode: 'Cell',
                    type: 'Multiple'
                },
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                enableAutoFill: true,
                pageSettings: { pageSize: 5 },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                frozenRows: 1,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', visible: false, textAlign: 'Right', width: 120, isPrimaryKey: true },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
                    { field: 'ShipCity', headerText: 'Ship City', width: 150 },
                    { field: 'ShipName', headerText: 'Ship Name', visible: false, width: 150 },
                    { field: 'OrderDate', headerText: 'Order Date', editType: 'datetimepickeredit', width: 160, format: { type: 'dateTime', format: 'M/d/y hh:mm a' }, },
                    { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150, edit: { params: { popupHeight: '300px' } } },
                    { field: 'ShipAddress', headerText: 'Ship Address', width: 150 },
                    { field: 'ShipRegion', headerText: 'Ship Region', width: 150 },
                ],
            }, done);
    });

    it('for coverage - 1', () => {
        (gridObj.getCellFromIndex(3, 2) as HTMLElement).click();
        (<any>gridObj.selectionModule).startDIndex = 2;
        (<any>gridObj.selectionModule).startDCellIndex = 2;
        (<any>gridObj.selectionModule).startAFCell = gridObj.getCellFromIndex(3, 2);
    });

    it('for coverage - 2', () => {
        (<any>gridObj.selectionModule).isAutoFillSel = true;
        (<any>gridObj.selectionModule).startCell = gridObj.getCellFromIndex(2, 2);
        (<any>gridObj.selectionModule).setScrollPosition(gridObj.getContent(), 'up', null);
        (<any>gridObj.selectionModule).setScrollPosition(gridObj.getContent(), 'down', null);
        (<any>gridObj.selectionModule).setScrollPosition(gridObj.getContent(), 'left', null);
        (<any>gridObj.selectionModule).setScrollPosition(gridObj.getContent(), 'right', null);
    });

    afterAll(function () {
        destroy(gridObj);
        gridObj = null;
    });
});



//code coverage improvement
describe('coverage for selection file.', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    let rows: Element[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0,5),
                columns: [
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }
                ],
            }, done);
    });

    it('selection file code coverage - 1', () => {
        gridObj.selectionSettings.type = 'Multiple';
        (gridObj.selectionModule as any).isMultiCtrlRequest = true;
        (gridObj.selectionModule as any).isMultiShiftRequest = true;
        (gridObj.selectionModule as any).headerSelectionHandler(1);
        (gridObj.selectionModule as any).prevColIndex = 1,
        (gridObj.selectionModule as any).headerSelectionHandler(2);
        (gridObj.selectionModule as any).isMultiShiftRequest = false;
        (gridObj.selectionModule as any).headerSelectionHandler(1);
        (gridObj.selectionModule as any).updateColSelection(null, 10);
        (gridObj.selectionModule as any).selectColumnWithExisting(10);
        gridObj.selectionSettings.type = 'Single';
        (gridObj.selectionModule as any).selectColumnWithExisting(1);
        (gridObj.selectionModule as any).selectColumns(1);
        (gridObj.selectionModule as any).selectColumnsByRange(10, 9);
        (gridObj.selectionModule as any).selectColumnsByRange(1);
        (gridObj.selectionModule as any).selectColumn(10);
        (gridObj.selectionModule as any).applyUpDown(-2);
    });

    it('selection file code coverage - 2', () => {
        (gridObj.selectionModule as any).selectionSettings.enableSimpleMultiRowSelection = true;
        (gridObj.selectionModule as any).showPopup();
        (gridObj.selectionModule as any).selectionSettings.enableSimpleMultiRowSelection = false;
        (gridObj.selectionModule as any).isCancelDeSelect = true;
        gridObj.checkAllRows = 'Uncheck';
        (gridObj.selectionModule as any).clearRowCallBack();
        (gridObj.selectionModule as any).toogle = true;
        (gridObj.selectionModule as any).disableUI = true;
        (gridObj.selectionModule as any).clearSelectedRow(1);
        (gridObj.selectionModule as any).createAFBorders();
        (gridObj.selectionModule as any).hideAFBorders();
        (gridObj.selectionModule as any).updateStartCellsIndex();
        (gridObj.selectionModule as any).beforeFragAppend( { requestType : 'virtualscroll'} );
        (gridObj.selectionModule as any).selectedRowIndexes = [1];
        (gridObj.selectionModule as any).initialEnd();
        (gridObj.selectionModule as any).selectedRowIndexes = [];
    });

    it('selection file code coverage - 3', () => {
        (gridObj.selectionModule as any).keyUpHandler({ keyCode: 93 });
        (gridObj.selectionModule as any).keyUpHandler({ });
        (gridObj.selectionModule as any).keyDownHandler({ target: gridObj.element });
        (gridObj.selectionModule as any).keyDownHandler({ keyCode: 93, target: gridObj.element });
        let target: Element = gridObj.element.querySelector('.e-rowcell');
        target.classList.add('e-gridchkbox');
        gridObj.allowKeyboard = false;
        (gridObj.selectionModule as any).keyDownHandler({ keyCode: 32, target: target, preventDefault: preventDefault });
        target = gridObj.element.querySelector('.e-headercell');
        target.children[0].classList.add('e-headerchkcelldiv');
        (gridObj.selectionModule as any).keyDownHandler({ keyCode: 32, target: target, preventDefault: preventDefault });
        (gridObj.selectionModule as any).ctrlPlusA();
        (gridObj.selectionModule as any).isColumnSelected = true;
        (gridObj.selectionModule as any).clearColumnSelection([]);
        (gridObj.selectionModule as any).isPartialSelection = true;
        gridObj.getRowsObject()[0].isSelectable = false;
        (gridObj.selectionModule as any).selectRow(0);
        (gridObj.selectionModule as any).addRowsToSelection([0]);
    });

    it('selection file code coverage - 4', () => {
        (gridObj.selectionModule as any).toggle = true;
        (gridObj.selectionModule as any).disableUI = false;
        (gridObj.selectionModule as any).clearSelectedRow(0);
        (gridObj.selectionModule as any).cellDeselect();
        (gridObj.selectionModule as any).bdrElement = document.createElement('div');
        (gridObj.selectionModule as any).createBorders();
        (gridObj.selectionModule as any).startCell = false;
        (gridObj.selectionModule as any).positionAFBorders();
        (gridObj.selectionModule as any).bdrAFLeft = document.createElement('div');
        (gridObj.selectionModule as any).createAFBorders();
        (gridObj.selectionModule as any).bdrAFLeft = null;
        (gridObj.selectionModule as any).hideAFBorders();
        (gridObj.selectionModule as any).isCheckedOnAdd = true;
        (gridObj.selectionModule as any).actionComplete( { selectedRow: 0, requestType : 'save', action: 'add' } );
    });

    it('selection file code coverage - 5', () => {
        gridObj.element.classList.add('e-gridcell-read');
        (gridObj.selectionModule as any).applyUpDown(1);
        (gridObj.selectionModule as any).selectionSettings.allowColumnSelection = true;
        (gridObj.selectionModule as any).needColumnSelection = true;
        (gridObj.selectionModule as any).applyRightLeftKey(1, 1); 
        (gridObj.selectionModule as any).applyRightLeftKey(2, 2);
        (gridObj.selectionModule as any).shiftDownKey();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-898361 - SelectedRowIndex property is not reset before rowDeselected event', () =>{
    let gridObj: Grid;
    let count: number = 0;
    beforeAll((done) => {
        gridObj = createGrid({
                dataSource: data,
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' }
                ],
                rowDeselected: function () {
                   count = count + 1;
                }
            }, done);
        });
    it('rowDeselected count - 1', () => {
       gridObj.selectRow(0, true);
    });

    it('rowDeselected count - 2', () => {
       gridObj.selectRow(0, true);
       expect(count).toBe(1);
    });

    afterAll(function () {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-929184 - When allowSelection is enabled dynamically, the SelectedRowIndex does not updated', () =>{
    let gridObj: Grid;
    beforeAll((done) => {
        gridObj = createGrid({
                dataSource: data,
                allowSelection: false,
                selectedRowIndex: 2,
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' }
                ],
            }, done);
        });
    it('enable the selection', (done: Function) => {
        let actionComplete = (args: any) => {
            expect(args.rows[2].isSelected).toBeTruthy();
            gridObj.actionComplete = null;
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.allowSelection = true;
    });

    afterAll(function () {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-939544 - Issue with selection persistence in grouped grid when collapsing and expanding', () =>{
    let gridObj: Grid;
    beforeAll((done) => {
        gridObj = createGrid({
                dataSource: data,
                selectionSettings: { type: 'Multiple', mode: 'Both', persistSelection: true },
                columns: [{ field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { columns: ['ShipCountry'] },
            }, done);
        });
    it('Select the row', (done: Function) => {
        gridObj.selectRow(0);
        done();

    });

    it('Check the selection', (done: Function) => {
        (gridObj.getContent().querySelectorAll('.e-recordplusexpand')[0] as HTMLElement).click();
        (gridObj.getContent().querySelectorAll('.e-recordpluscollapse')[0] as HTMLElement).click();
        expect(gridObj.selectedRowIndex).toBe(0);
        done();

    });
    
    afterAll(function () {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Coverage test case', () => {
    let gridObj: Grid;
    beforeAll((done) => {
        gridObj = createGrid({
            dataSource: data,
            selectionSettings: { persistSelection: true },
            columns: [
                { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true },
                { field: 'CustomerID', headerText: 'CustomerID' },
                { field: 'EmployeeID', headerText: 'Employee ID' },
                { field: 'Freight', headerText: 'Freight' },
                { field: 'ShipCity', headerText: 'Ship City' },
                { field: 'ShipCountry', headerText: 'Ship Country', freeze: 'Right' }
            ]
        }, done);
    });

    it('applyBorders 1', (done: Function) => {
        (gridObj.selectionModule as any).bdrElement = createElement('div');
        (gridObj.selectionModule as any).mcBdrElement = createElement('div');
        (gridObj.selectionModule as any).fhBdrElement = createElement('div');
        (gridObj.selectionModule as any).mhBdrElement = createElement('div');
        (gridObj.selectionModule as any).applyBorders('left');
        gridObj.enableRtl = true;
        (gridObj.selectionModule as any).applyBorders('left');
        (gridObj.selectionModule as any).applyBorders('lr');
        gridObj.setProperties({columns: [{ field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true }]});
        done();
    });

    it('applyBorders 2', (done: Function) => {
        (gridObj.selectionModule as any).applyBorders('lr');
        gridObj.frozenRows = 1;
        (gridObj.selectionModule as any).applyBorders('lr');
        done();
    });

    it('unWireEvents', (done: Function) => {
        (gridObj.selectionModule as any).isMacOS = true;
        (gridObj.selectionModule as any).unWireEvents();
        done();
    });

    it('type', (done: Function) => {
        (gridObj.selectionModule as any).selectedColumnsIndexes = [0, 1];
        gridObj.setProperties({selectionSettings: { type: 'Single' }});
        done();
    });

    afterAll(function () {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-948229: Focus Border Not Displayed on Cell After Clicking Header and Returning to Same Cell', () => {
    let gridObj: Grid;
    let rows: any;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID', freeze: 'Right' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: "ShipCity", headerText: "Ship City", width: 250, freeze: 'Left' },
                ],
                height: 700,
            }, done);
    });
    it('click any rowcell', (done: Function) => {
        rows = gridObj.getRows();
        let rowSelected = (args: any) => {
            gridObj.rowSelected = null;
            done();
        };
        gridObj.rowSelected = rowSelected;
        rows[2].cells[2].click();
        done();
    });

    it('click any headercell', (done: Function) => {
        (gridObj.getHeaderTable() as any).rows[0].cells[0].click();
        done();
    });

    it('click same rowcell', (done: Function) => {
        let rowDeselected = (args: any) => {
            expect(args.target.classList.contains('e-focused')).toBeTruthy();
            gridObj.rowDeselected = null;
            done();
        };
        gridObj.rowDeselected = rowDeselected;
        rows[2].cells[2].click();
    });

    
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-955281: Shift + Checkbox Click Does Not Perform Range Selection in resetOnRowClick Mode', () => {
    let gridObj: Grid;
    let rows: any;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                selectionSettings: { checkboxMode: 'ResetOnRowClick' },
                columns: [
                    {type: 'checkbox', width: 40},
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID', freeze: 'Right' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: "ShipCity", headerText: "Ship City", width: 250, freeze: 'Left' },
                ],
                height: 700,
            }, done);
    });
    
    it('Selecting First row', (done: Function) => {
        let rowSelected = (): void => {
            expect(gridObj.getSelectedRowIndexes().length).toBe(1);
            gridObj.rowSelected = null;
            done();
        };
        gridObj.rowSelected = rowSelected;
        (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[0].querySelector('.e-rowcell')).click();
    });

    it('Shift + Clicking Checkbox in Fourth Row', (done: Function) => {
        let rowSelected = (): void => {
            expect(gridObj.getSelectedRowIndexes().length).toBe(4);
            gridObj.rowSelected = null;
            done();
        };
        gridObj.rowSelected = rowSelected;
        (gridObj.selectionModule as any)
        .clickHandler({target: gridObj.element.querySelectorAll('.e-row')[3].querySelector('.e-gridchkbox')
        .querySelector('.e-checkbox-wrapper'), shiftKey: true});
    });
    
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-915005: The cell is not highlighted when selecting a row using the method.', () => {
    let gridObj: Grid;
    let rows: any;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID', },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: "ShipCity", headerText: "Ship City", width: 250,},
                ],
                height: 700,
            }, done);
    });
    it('click any rowcell', (done: Function) => {
        rows = gridObj.getRows();
        let rowSelected = (args: any) => {
            expect(args.row.cells[0].classList.contains('e-focused')).toBeTruthy();
            gridObj.rowSelected = null;
            done();
        };
        gridObj.rowSelected = rowSelected;
        gridObj.selectRow(2);
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-960012: Previously selected records gets removed in getSelectedRecords when clicking selectAll after filtering', () => {
    let gridObj: Grid;
    let rows: any;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                selectionSettings: {
                    persistSelection: true,
                    type: 'Multiple',
                },
                allowFiltering: true,
                filterSettings: { type: 'Excel' },
                columns: [
                    {type: 'checkbox', width: 40},
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID', freeze: 'Right' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: "ShipCountry", headerText: "Ship Country", width: 250, freeze: 'Left' },
                ],
            }, done);
    });
    
    it('Selecting First row', (done: Function) => {
        let rowSelected = (): void => {
            gridObj.rowSelected = null;
            done();
        };
        gridObj.rowSelected = rowSelected;
        gridObj.selectRow(0);
    });

    it('Filter any value', (done: Function) => {
        let actionComplete = (args: any): void => {
            if (args.requestType === 'filtering') {
                gridObj.actionComplete = null;
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.filterByColumn('ShipCountry', 'contains', 'Brazil');
    });

    it('Click header to chek the selected records length', (done: Function) => {
        let rowSelected = (): void => {
            expect(gridObj.getSelectedRecords().length).toBe(5);
            gridObj.rowSelected = null;
            done();
        };
        gridObj.rowSelected = rowSelected;
        (gridObj.element.querySelector('.e-checkselectall') as HTMLElement).click();
    });
    
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});