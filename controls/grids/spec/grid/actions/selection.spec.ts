/**
 * Grid Selection spec document
 */
import { Browser, EmitType } from '@syncfusion/ej2-base';
import { EventHandler, isNullOrUndefined, closest } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Freeze } from '../../../src/grid/actions/freeze';
import { Selection } from '../../../src/grid/actions/selection';
import { Page } from '../../../src/grid/actions/page';
import { data } from '../base/datasource.spec';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { Edit } from '../../../src/grid/actions/edit';
import { FocusStrategy } from '../../../src/grid/services/focus-strategy'; 
import { CheckBox } from '@syncfusion/ej2-buttons';
import { employeeSelectData } from '../base/datasource.spec';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { QueryCellInfoEventArgs } from '../../../src/grid/base/interface';
import { createGrid, destroy } from '../base/specutil.spec';

Grid.Inject(Selection, Page, Sort, Group, Edit, Toolbar, Freeze);

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


describe('Selection Shortcuts testing', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    let selectionModule: Selection;
    let rows: Element[];
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
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('2');
        expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect(gridObj.getSelectedRecords().length).toBe(1);
        expect(gridObj.getSelectedRowIndexes().length).toBe(1);
        expect(rows[2].firstElementChild.classList.contains('e-cellselectionbackground')).toBeTruthy();
        expect(gridObj.getSelectedRowCellIndexes().length).toBe(1);
    });

    it('upArrow shortcut testing', () => {
        let args: any = { action: 'upArrow', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('1');
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
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('1');
        expect((rows[1].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(0);        
    });

    it('end shortcut testing', () => {
        let args: any = { action: 'end', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('1');
        expect((rows[1].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(4);        
    });

    it('ctrlHome shortcut testing', () => {
        let args: any = { action: 'ctrlHome', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('0');
        expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect((rows[0].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(0);
    });

    it('ctrlEnd shortcut testing', () => {
        let args: any = { action: 'ctrlEnd', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('7');
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
            expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('2');
            expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[1].getAttribute('aria-rowindex')).toBe('3');
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
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('3');
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[1].getAttribute('aria-rowindex')).toBe('4');
        expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect(rows[7].querySelectorAll('.e-rowcell')[4].classList.contains('e-cellselectionbackground')).toBeTruthy();
    });

    it('shiftUp row shortcut reverse testing', () => {
        let args: any = { action: 'shiftUp', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('3');
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

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Selection Shortcuts testing with Freeze pane', () => {
    let gridObj: any;
    let preventDefault: Function = new Function();
    let selectionModule: Selection;
    let rows: Element[];
    let mRows: Element[];
    let fColLen: number;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                frozenColumns: 2,
                frozenRows: 2,
                dataSource: data,
                columns: [{ field: 'OrderID', width: 100 }, { field: 'CustomerID', width: 100 }, { field: 'EmployeeID', width: 100  }, { field: 'Freight' },
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
        mRows = gridObj.getMovableRows();
        fColLen = gridObj.getFrozenColumns();
        let focusHandler: Function = () => {
            gridObj.keyboardModule.keyAction({ action:'downArrow', preventDefault: preventDefault });
            gridObj.keyboardModule.keyAction(args);
            for (let i: number = 0; i <= 1; i++) {
                if (i === 1) {
                    len = 1;
                }
                for (let j: number = 0; j < len; j++) {
                    if (j >= fColLen) {
                        expect(mRows[i].querySelectorAll('.e-rowcell')[j - fColLen].classList.contains('e-cellselectionbackground')).toBeTruthy();
                    } else {
                        expect(rows[i].querySelectorAll('.e-rowcell')[j].classList.contains('e-cellselectionbackground')).toBeTruthy();
                    }
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
        (gridObj.getRows()[0].querySelector('.e-rowcell') as HTMLElement).click();
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('1');
        expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect(gridObj.getSelectedRecords().length).toBe(1);
        expect(gridObj.getSelectedRowIndexes().length).toBe(1);
        expect(rows[1].firstElementChild.classList.contains('e-cellselectionbackground')).toBeTruthy();
        expect(gridObj.getSelectedRowCellIndexes().length).toBe(1);
    });

    it('upArrow shortcut testing', () => {
        let args: any = { action: 'upArrow', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('0');
        expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect(selectionModule.selectedRecords.length).toBe(2);
        expect(selectionModule.selectedRowIndexes.length).toBe(1);
        expect(rows[0].firstElementChild.classList.contains('e-cellselectionbackground')).toBeTruthy();
        expect(selectionModule.selectedRowCellIndexes.length).toBe(1);
    });

    it('rightArrow shortcut next row testing', () => {
        gridObj.clearSelection();
        let args: any = { action: 'rightArrow', preventDefault: preventDefault };
        selectionModule.selectCell({ rowIndex: 0, cellIndex: 1 }, true);
        gridObj.keyboardModule.keyAction(args);
        expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        expect((rows[1].querySelector('.e-cellselectionbackground') as HTMLTableCellElement)).toBeNull();
    });

    it('leftarrow shortcut prev row testing', () => {
        gridObj.clearSelection();
        selectionModule.selectCell({ rowIndex: 0, cellIndex: 4 }, true);
        let args: any = { action: 'leftArrow', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect((mRows[0].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(3 - fColLen);
    });

    it('leftarrow shortcut testing', () => {
        let args: any = { action: 'leftArrow', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(mRows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        expect((mRows[0].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(2 - fColLen);
    });

    it('home shortcut testing', () => {
        gridObj.selectRow(1);
        let args: any = { action: 'home', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('1');
        expect((rows[1].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(0);
    });

    it('end shortcut testing', () => {
        let args: any = { action: 'end', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('1');
        expect((mRows[1].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(4 - fColLen);
    });

    it('ctrlHome shortcut testing', () => {
        let args: any = { action: 'ctrlHome', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.getHeaderTable().querySelector('thead').querySelector('.e-focused').textContent).toBe('OrderID');
        expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
    });

    it('ctrlEnd shortcut testing', () => {
        let args: any = { action: 'ctrlEnd', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('7');
        expect(mRows[7].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect((mRows[7].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(4 - fColLen);
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
            expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('2');
            expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[1].getAttribute('aria-rowindex')).toBe('3');
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(mRows[7].querySelectorAll('.e-rowcell')[4 - fColLen].classList.contains('e-cellselectionbackground')).toBeTruthy();
            done();
        };
        gridObj.selectRow(3);
    });

    it('shiftDown row shortcut testing', () => {
        let args: any = { action: 'shiftDown', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('3');
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[1].getAttribute('aria-rowindex')).toBe('4');
        expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect(mRows[7].querySelectorAll('.e-rowcell')[4 - fColLen].classList.contains('e-cellselectionbackground')).toBeTruthy();
    });

    it('shiftUp row shortcut reverse testing', () => {
        let args: any = { action: 'shiftUp', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(gridObj.element.querySelectorAll('tr[aria-selected="true"]')[0].getAttribute('aria-rowindex')).toBe('3');
        expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        expect(mRows[7].querySelectorAll('.e-rowcell')[4 - fColLen].classList.contains('e-cellselectionbackground')).toBeTruthy();
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
        expect(mRows[1].querySelectorAll('.e-rowcell')[2 - fColLen].classList.contains('e-cellselectionbackground')).toBeFalsy();
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
        let len: number = 2;
        gridObj.keyboardModule.keyAction(args);
        for (let i: number = 1; i < 2; i++) {
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

    it('Cell Select shortcut testing', () => {
        let args: any = { action: 'leftArrow', preventDefault: preventDefault };
        gridObj.clearSelection();
        selectionModule.selectCell({ rowIndex: 1, cellIndex: 2 }, true);
        gridObj.keyboardModule.keyAction(args);
        expect(rows[1].querySelector('.e-cellselectionbackground').getAttribute('aria-colindex')).toBe('1');
        args = { action: 'enter', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(rows[2].querySelector('.e-cellselectionbackground').getAttribute('aria-colindex')).toBe('1');
        args = { action: 'upArrow', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        expect(rows[1].querySelector('.e-cellselectionbackground').getAttribute('aria-colindex')).toBe('1');
        args = { action: 'enter', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        args = { action: 'rightArrow', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
        args = { target: mRows[0].querySelectorAll('.e-rowcell')[0] };
        gridObj.focusModule.focusCheck(args);
        gridObj.getHeaderTable().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-headercell')[0].click();
        args = { action: 'upArrow', preventDefault: preventDefault };
        gridObj.keyboardModule.keyAction(args);
    });
    afterAll(() => {
        destroy(gridObj);
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
            expect(selectionModule.selectedRecords.length).toBe(2);
            expect(selectionModule.selectedRowIndexes.length).toBe(1);
        });

        it('single row testing', () => {
            selectionModule.selectRow(2, true);
            expect(rows[2].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(2);
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
            let mRows: Element[] = gridObj.getMovableRows();
            expect(
                (mRows[1].querySelector('.e-cellselectionbackground') as HTMLTableCellElement).cellIndex).toBe(3 - gridObj.frozenColumns);
            expect(selectionModule.selectedRowCellIndexes.length).toBe(1);
            expect(mRows[0].querySelectorAll('.e-cellselectionbackground').length).toBe(0);
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
        });
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
            selectionModule.selectRow(2, true);
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
            expect(selectionModule.selectedRecords.length).toBe(4);
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        it('single row testing', () => {
            selectionModule.selectRow(3, true);
            expect(rows[3].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(2);
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
            expect(selectionModule.selectedRecords.length).toBe(4);
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
            expect(selectionModule.selectedRecords.length).toBe(6);
            expect(selectionModule.selectedRowIndexes.length).toBe(3);
        });

        it('multi row toogle - ctrl click testing', () => {
            rows[4].firstChild.dispatchEvent(ctrlEvt);
            expect(rows[4].hasAttribute('aria-selected')).toBeFalsy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(selectionModule.selectedRecords.length).toBe(4);
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
            expect(selectionModule.selectedRecords.length).toBe(4);
            expect(selectionModule.selectedRowIndexes.length).toBe(2);
        });

        it('multi row - shift click testing', () => {
            rows[5].firstChild.dispatchEvent(shiftEvt);
            expect(rows[4].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[5].hasAttribute('aria-selected')).toBeTruthy();
            expect(rows[4].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[5].firstElementChild.classList.contains('e-cellselectionbackground')).toBeFalsy();
            expect(selectionModule.selectedRecords.length).toBe(4);
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
            expect(selectionModule.selectedRecords.length).toBe(6);
            expect(selectionModule.selectedRowIndexes.length).toBe(3);
        });

        it('rowSelecting event call', () => {
            let spyFn: (e?: Object) => void = jasmine.createSpy('begin');
            gridObj.rowSelecting = spyFn;
            selectionModule.selectRow(2, true);
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

        afterAll(() => {
            destroy(gridObj);
        });

    });

    describe('grid cell multiple seletion functionalities with Freeze pane', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        let mRows: Element[];
        let cells: NodeListOf<Element>;
        let mCells: NodeListOf<Element>;
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
            mRows = gridObj.getMovableRows();
            selectionModule.selectCell({ rowIndex: 2, cellIndex: 2 }, true);
            expect(mRows[2].querySelectorAll('.e-rowcell')[2 - 2].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowCellIndexes.length).toBe(1);
            expect(rows[0].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toBeFalsy();
        });

        it('multi cell - addCellsToSelection  testing', () => {
            selectionModule.addCellsToSelection([{ rowIndex: 1, cellIndex: 1 }]);
            expect(mRows[2].querySelectorAll('.e-rowcell')[2 - 2].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(rows[1].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowCellIndexes.length).toBe(2);
        });

        it('multi cell - addRowsToSelection click testing', () => {
            rows[3].firstChild.dispatchEvent(ctrlEvt);
            expect(mRows[2].querySelectorAll('.e-rowcell')[2 - 2].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(rows[1].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(rows[3].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRowCellIndexes.length).toBe(3);
        });

        it('multi cell toogle - addRowsToSelection click testing', () => {
            rows[3].firstChild.dispatchEvent(ctrlEvt);
            expect(rows[3].querySelectorAll('.e-rowcell')[0].classList.contains('e-cellselectionbackground')).toBeFalsy();
        });

        it('selection on same row - addRowsToSelection click testing', () => {
            mRows[0].querySelectorAll('.e-rowcell')[1].dispatchEvent(ctrlEvt);
            expect(mRows[0].querySelectorAll('.e-rowcell')[1].classList.contains('e-cellselectionbackground')).toBeTruthy();
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
                if (i === 2) {
                    cells = mRows[i].querySelectorAll('.e-rowcell');
                    expect(cells[i - gridObj.frozenColumns].classList.contains('e-cellselectionbackground')).toBeTruthy();
                } else {
                    cells = rows[i].querySelectorAll('.e-rowcell');
                    expect(cells[i].classList.contains('e-cellselectionbackground')).toBeTruthy();
                }
            }
            expect(selectionModule.selectedRowCellIndexes.length).toBe(3);
        });

        afterAll(() => {
            destroy(gridObj);
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
        });
    });

    describe('clear selection cases with Freeze pane', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        let mRows: Element[];
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
            mRows = gridObj.getMovableRows();
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
            cell = mRows[0].children[1] as HTMLElement;
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
            (mRows[0].querySelectorAll('.e-rowcell')[2] as HTMLElement).click();
            expect(cell.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeFalsy();
            expect(mRows[0].querySelectorAll('.e-rowcell')[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
            (mRows[0].querySelectorAll('.e-rowcell')[2] as HTMLElement).click();
            expect(cell.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(cell.classList.contains('e-cellselectionbackground')).toBeFalsy();
            expect(mRows[0].querySelectorAll('.e-rowcell')[2].classList.contains('e-cellselectionbackground')).toBeFalsy();
            (mRows[0].querySelectorAll('.e-rowcell')[2] as HTMLElement).click();
            expect(cell.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(mRows[0].querySelectorAll('.e-rowcell')[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
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

        it('enable selection testing', () => {
            gridObj.allowSelection = true;
            gridObj.dataBind();
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
        });
    });
});


describe('Grid Touch Selection', () => {
    describe('touch selection', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        let cell: HTMLElement;
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

        });
    });

    describe('touch selection with Freeze pane', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        let mRows: Element[];
        let cell: HTMLElement;
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
            mRows = gridObj.getMovableRows();
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

        it('multi row  testing', () => {
            (spanElement as HTMLElement).click();
            expect(spanElement.classList.contains('e-spanclicked')).toBeTruthy();
            (mRows[2].querySelector('.e-rowcell') as HTMLElement).click();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(mRows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
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
        });
    });

    // select row/cell and navigate with grouped columns
    describe('select Row/cell after grouping', () => {
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
                expect(args['rowIndex'][0]).toEqual(0);
                expect(args['row'][0]).toEqual(gridObj.getRows()[0]);
            };
            let rowDeSelected: EmitType<Object> = (args: Object) => {
                expect(args['data']).not.toEqual(undefined);
                expect(args['rowIndex'][0]).toEqual(0);
                expect(args['row'][0]).toEqual(gridObj.getRows()[0]);
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
                expect(JSON.stringify(args['previousRowCellIndex'])).toEqual(JSON.stringify({ rowIndex: 0, cellIndex: 0 }));
                expect(args['previousRowCell']).toEqual(gridObj.getRows()[0].children[2]);
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
                expect(args['previousRowCell']).toEqual(previousRowCell);
                expect(args['isCtrlPressed']).toBeFalsy();
                expect(args['isShiftPressed']).toBeFalsy();
            };
            cellSelected = (args: Object) => {
                expect(JSON.stringify(args['data'])).not.toBeUndefined();
                expect(JSON.stringify(args['cellIndex'])).toEqual(JSON.stringify({ rowIndex: 0, cellIndex: 1 }));
                expect(args['currentCell']).toEqual(gridObj.getRows()[0].children[3]);
                expect(JSON.stringify(args['previousRowCellIndex'])).toEqual(JSON.stringify({ rowIndex: 0, cellIndex: 1 }));
                expect(args['previousRowCell']).toEqual(gridObj.getRows()[0].children[3]);
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

        afterAll(() => {
            destroy(gridObj);
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
            expect(gridObj.getRows()[0].children[1].classList.contains('e-cellselectionbackground')).toBeFalsy();
            expect(gridObj.getRows()[0].children[1].hasAttribute('aria-selected')).toBeTruthy();
            expect(gridObj.getRows()[0].children[1].hasAttribute('aria-label')).toBeTruthy();
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
                expect(gridObj.getRows()[0].children[1].getAttribute('aria-colindex')).toBe('2');
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
            expect(gridObj.getRows()[0].children[0].hasAttribute('aria-label')).toBeTruthy();
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
    describe('Cell Selection Issue Fixes', () =>{
        let gridObj: Grid;
        let cellSelected: EmitType<Object>;
        let template: Element = createElement('div', { id: 'template' });
            template.innerHTML = '<div>${CustomerID}</div>';
            document.body.appendChild(template);
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
            template: '#template', width: 150
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
            cellSelected = (args: Object) => {
                expect(gridObj.getRows()[0].children[2].classList.contains('e-cellselectionbackground')).toBeTruthy();
                gridObj.cellSelected = undefined;
            };
            gridObj.cellSelected = cellSelected;
            gridObj.selectCell({ rowIndex: 0, cellIndex: 2 }, true);
            gridObj.dataBind();
        });
            afterAll(() => {
            destroy(gridObj);
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
    afterAll(() => {
        destroy(gridObj);
    });
});