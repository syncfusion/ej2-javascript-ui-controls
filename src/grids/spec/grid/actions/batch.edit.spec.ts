/**
 * Grid batch edit spec document
 */ 
import { EmitType } from '@syncfusion/ej2-base';
import { extend, getValue } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { isActionPrevent } from '../../../src/grid/base/util';
import { QueryCellInfoEventArgs } from '../../../src/grid/base/interface';
import { Filter } from '../../../src/grid/actions/filter';
import { Edit } from '../../../src/grid/actions/edit';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Freeze } from '../../../src/grid/actions/freeze';
import { BatchEdit } from '../../../src/grid/actions/batch-edit';
import { Page } from '../../../src/grid/actions/page';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Column } from '../../../src/grid/models/column';
import { Selection } from '../../../src/grid/actions/selection';
import { NumericEditCell } from '../../../src/grid/renderer/numeric-edit-cell';
import { DropDownEditCell } from '../../../src/grid/renderer/dropdown-edit-cell';
import { DatePickerEditCell } from '../../../src/grid/renderer/datepicker-edit-cell';
import { BooleanEditCell } from '../../../src/grid/renderer/boolean-edit-cell';
import { data, employeeData } from '../base/datasource.spec';
import { DetailRow } from '../../../src/grid/actions/detail-row'
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy, getKeyUpObj, getClickObj, getKeyActionObj } from '../base/specutil.spec';

Grid.Inject(Filter, Page, Selection, Group, Edit, Sort, Reorder, Toolbar, Freeze, DetailRow);

describe('Batch Editing module', () => {


    let dataSource: Function = (): Object[] => {
        let datasrc: Object[] = [];
        for (let i = 0; i < 11; i++) {
            datasrc.push(extend({}, {}, data[i], true));
        }
        return datasrc;
    };


    describe('Batch editing render => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('cell edit start - args.cancel true', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                args.cancel = true;
                done();
            };
            gridObj.cellEdit = cellEdit;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-toolbar-item.e-overlay').length).toBe(2);
            gridObj.editModule.editCell(0, 'CustomerID');
        });

        it('cell edit start - args.cancel false', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'CustomerID');
        });

        it('cell save - args.cancel', (done: Function) => {
            let cellSave = (args?: any): void => {
                gridObj.cellSave = null;
                args.cancel = true;
                done();
            };
            gridObj.cellSave = cellSave;
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            expect(gridObj.editModule.getCurrentEditCellData()).toBe('updated');
            gridObj.editModule.saveCell();
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-toolbar-item.e-overlay').length).toBe(2);
        });

        it('cell save complete', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-toolbar-item.e-overlay').length).toBe(2);
            gridObj.editModule.saveCell();
        });

        it('last action check', () => {
            expect((gridObj as any).contentModule.getRows()[0].data.CustomerID).toBe('VINET');
            expect((gridObj as any).contentModule.getRows()[0].changes.CustomerID).toBe('updated');
            //row count check
            expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
            //record count check
            expect(gridObj.currentViewData.length).toBe(11);
            expect(gridObj.element.querySelectorAll('.e-toolbar-item.e-overlay').length).toBe(0);
        });

        it('add start', (done: Function) => {
            let beforeBatchAdd = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchAdd = null;
            };
            let batchAdd = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBeGreaterThan(gridObj.getVisibleColumns().length - 1);
                expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                gridObj.batchAdd = null;
                done();
            };
            gridObj.beforeBatchAdd = beforeBatchAdd;
            gridObj.batchAdd = batchAdd;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('add - cell edit complete', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            //update orderid
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 10247;
            gridObj.editModule.saveCell();
        });

        it('last action check', () => {
            let rowObj: any = gridObj.getRowObjectFromUID(gridObj.getContent().querySelector('.e-row').getAttribute('data-uid'));
            expect(rowObj.data.OrderID).toBe(0);
            expect(rowObj.data.CustomerID).toBeNull();
            expect(rowObj.data.Verified).toBeFalsy();
            expect(rowObj.changes.OrderID).toBe(10247);
            expect(rowObj.changes.CustomerID).toBeNull();
            expect(rowObj.changes.Verified).toBeFalsy();
            //row count check
            expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(12);
            //record count check
            expect(gridObj.currentViewData.length).toBe(11);
        });

        it('delete', (done: Function) => {
            let beforeBatchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchDelete = null;
            };
            let batchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                //row count check
                expect(gridObj.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)').length).toBe(11);
                //record count check
                expect(gridObj.currentViewData.length).toBe(11);
                gridObj.batchDelete = null;
                done();
            };
            gridObj.beforeBatchDelete = beforeBatchDelete;
            gridObj.batchDelete = batchDelete;
            gridObj.clearSelection();
            gridObj.selectRow(2, true);
            gridObj.deleteRow(gridObj.getContent().querySelectorAll('.e-row')[2] as any);
        });

        it('delete', (done: Function) => {
            let beforeBatchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchDelete = null;
            };
            let batchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                //row count check
                expect(gridObj.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)').length).toBe(10);
                //record count check
                expect(gridObj.currentViewData.length).toBe(11);
                gridObj.batchDelete = null;
                done();
            };
            gridObj.beforeBatchDelete = beforeBatchDelete;
            gridObj.batchDelete = batchDelete;
            gridObj.clearSelection();
            gridObj.selectRow(2, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_delete' } });
        });

        it('batch save - args.cancel', (done: Function) => {
            let beforeBatchSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                args.cancel = true;
                gridObj.beforeBatchSave = null;
                done();
            };
            gridObj.beforeBatchSave = beforeBatchSave;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('batch save', (done: Function) => {
            let beforeBatchSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchSave = null;
            };
            let dataBound = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                //row count check
                expect(gridObj.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)').length).toBe(10);
                //record count check
                expect(gridObj.currentViewData.length).toBe(10);
                expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                expect((gridObj.currentViewData[1] as any).OrderID).toBe(10251);
                expect((gridObj.currentViewData[9] as any).OrderID).toBe(10247);
                gridObj.dataBound = null;
                done();
            };
            gridObj.beforeBatchSave = beforeBatchSave;
            gridObj.dataBound = dataBound;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });
        it('EJ2-6134 - I193436 batch add - validation and selection', (done: Function) => {
            let batchAdd = (args?: any): void => {
                (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = '';
                gridObj.clearSelection()
                gridObj.selectRow(2);
                expect(gridObj.getSelectedRecords().length).toBe(0);
                (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = '456';
                gridObj.selectRow(2);
                expect(gridObj.getSelectedRecords().length).toBe(1);
                gridObj.batchAdd = null; ``
                done();
            };
            gridObj.batchAdd = batchAdd;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
        });
    });

    describe('same actions above for cancel edit => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('cell edit start', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'CustomerID');
        });

        it('cell edit complete', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.editModule.saveCell();
        });

        it('add start', (done: Function) => {
            let beforeBatchAdd = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchAdd = null;
            };
            let batchAdd = (args?: any): void => {
                expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                gridObj.batchAdd = null;
                done();
            };
            gridObj.beforeBatchAdd = beforeBatchAdd;
            gridObj.batchAdd = batchAdd;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('add - cell edit complete', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 10247;
            gridObj.editModule.saveCell();
        });

        it('delete', (done: Function) => {
            let beforeBatchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchDelete = null;
            };
            let batchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.batchDelete = null;
                done();
            };
            gridObj.beforeBatchDelete = beforeBatchDelete;
            gridObj.batchDelete = batchDelete;
            gridObj.clearSelection();
            gridObj.selectRow(2, true);
            gridObj.deleteRow(gridObj.getContent().querySelectorAll('.e-row')[2] as any);
        });

        it('delete - args.cancel - true', (done: Function) => {
            let beforeBatchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchDelete = null;
                args.cancel = true;
                done();
            };
            gridObj.beforeBatchDelete = beforeBatchDelete;
            gridObj.clearSelection();
            gridObj.selectRow(2, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_delete' } });
        });

        it('delete - args.cancel false', (done: Function) => {
            let beforeBatchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchDelete = null;
            };
            let batchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.batchDelete = null;
                done();
            };
            gridObj.beforeBatchDelete = beforeBatchDelete;
            gridObj.batchDelete = batchDelete;
            gridObj.clearSelection();
            gridObj.selectRow(2, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_delete' } });
        });

        it('batch cancel', () => {
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_cancel' } });
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
            //row count check
            expect(gridObj.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)').length).toBe(10);
            //record count check
            expect(gridObj.currentViewData.length).toBe(11);
            expect((gridObj.currentViewData[0] as any).OrderID).toBe(10248);
            expect((gridObj.currentViewData[0] as any).CustomerID).not.toBe('updated');
            expect((gridObj.currentViewData[1] as any).OrderID).toBe(10249);
            expect((gridObj.currentViewData[9] as any).OrderID).not.toBe(10247);
        });

        it('dbl click cell edit start', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            (gridObj as any).dblClickHandler(getClickObj(gridObj.element.querySelectorAll('.e-row')[1].childNodes[1] as any));
        });

        it('click cell edit - cell save trigger check', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            (gridObj.element.querySelectorAll('.e-row')[2] as any).cells[0].click();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
        });
    });

    describe('keyboard shortcuts testing => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        let actionComplete: () => void;
        let cell: HTMLElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: false,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        //firt cell with shift tab key        
        it('edit cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'CustomerID');
        });

        it('shift tab key', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
            expect(gridObj.isEdit).toBeFalsy();
        });

        //firt cell with shift tab key        
        it('edit cell', (done: Function) => {
            // last action check
            expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(0);
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(gridObj.currentViewData.length - 1, 'OrderDate');
        });

        it('tab key --1', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
            expect(gridObj.isEdit).toBeFalsy();
        });

        it('f2 key', (done: Function) => {
            // last action check
            expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(0);
            cell = gridObj.getContent().querySelector('.e-row').childNodes[1] as any;
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            cell.click();
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: cell } as any);
        });

        it('enter key', (done: Function) => {
            let cell = gridObj.getContent().querySelector('.e-row').childNodes[1] as any;
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: cell } as any);
        });

        it('cell save', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
        });


        it('add start - args.cancel true', (done: Function) => {
            let beforeBatchAdd = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchAdd = null;
                args.cancel = true;
                done();
            };
            gridObj.beforeBatchAdd = beforeBatchAdd;
            gridObj.keyboardModule.keyAction({ action: 'insert', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('add start - args.cancel false', (done: Function) => {
            let beforeBatchAdd = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchAdd = null;
            };
            let batchAdd = (args?: any): void => {
                expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                gridObj.batchAdd = null;
                done();
            };
            gridObj.beforeBatchAdd = beforeBatchAdd;
            gridObj.batchAdd = batchAdd;
            gridObj.keyboardModule.keyAction({ action: 'insert', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('add - cell edit complete', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 10247;
            (gridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
        });

        it('edit cell', function () {
            gridObj.editModule.editCell(0, 'CustomerID');           
        });

        it('add - cell edit complete', function () {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'ssdfd';
            (gridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
        });

        it('delete', (done: Function) => {
            let cell = gridObj.getContent().querySelectorAll('.e-row')[2].childNodes[1] as any;
            let beforeBatchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchDelete = null;
            };
            let batchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.batchDelete = null;
                done();
            };
            gridObj.beforeBatchDelete = beforeBatchDelete;
            gridObj.batchDelete = batchDelete;
            gridObj.clearSelection();
            gridObj.selectRow(2, true);
            gridObj.keyboardModule.keyAction({ action: 'delete', preventDefault: preventDefault, target: cell } as any);
        });
        // allowEditing false
        it('edit cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'CustomerID');
        });

        it('tab key --2', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('shift tab key', () => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'CustomerID');
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('cell save', (done: Function) => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'CustomerID');
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
        });


        //isIdentity true
        it('edit cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(1, 'Verified');
        });

        it('tab key --3', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('shift tab key', () => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'ShipName');
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('cell save', (done: Function) => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'Verified');
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
        });


        //visible false
        it('edit cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(1, 'ShipCountry');
        });

        it('tab key --4', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('shift tab key', () => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'OrderDate');
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('cell save', (done: Function) => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'ShipCountry');
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
        });

        //next row and previous row
        it('edit cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(1, 'OrderDate');
        });

        it('tab key --5', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
            expect(gridObj.isEdit).toBeFalsy();
        });

        it('edit cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(1, 'OrderDate');
        });

        it('shift tab key', () => {
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('cell save', (done: Function) => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'ShipCountry');
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
        });

        //next row and previous row
        it('edit cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(1, 'OrderDate');
        });

        it('tab key --6', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
            expect(gridObj.isEdit).toBeFalsy();
        });

        it('edit cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(1, 'OrderDate');
        });

        it('shift tab key', () => {
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('cell save', (done: Function) => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'ShipCountry');
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
        });

        //prev row and next row
        it('edit cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(1, 'CustomerID');
        });

        it('tab key --7', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
            expect(gridObj.isEdit).toBeFalsy();
        });

        it('shift tab key', () => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell')).toBeNull();
            gridObj.editModule.editCell(2, 'CustomerID');
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        });

        it('cell save', (done: Function) => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'CustomerID');
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            //for endedit and batch save while editing
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = '';
            (gridObj.editModule as any).editModule.endEdit();
            (gridObj.editModule as any).editModule.batchSave();
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';

            (gridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
        });

        //shortcuts with validation error
        it('edit cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(1, 'CustomerID');
        });

        it('tab key --8', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = '';
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.editModule.editFormValidate();
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = '';
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: cell } as any);
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.editModule.editFormValidate();
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = '';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: cell } as any);
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'CustomerID');
        });

        it('tab key --9', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            (gridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
            expect(gridObj.isEdit).toBeFalsy();
            gridObj.isEdit = true;
            (gridObj.editModule as any).editModule.validateFormObj = () => true;
            (gridObj.editModule as any).editModule.onBeforeCellFocused({ byClick: true, clickArgs: { preventDefault: () => { } } });
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
        });
    });

    describe('update cell and row method testing => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('update cell', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBe(1);
            expect((gridObj as any).contentModule.getRows()[0].changes.CustomerID).toBe('updated');
        });

        it('update row', () => {
            gridObj.editModule.updateRow(1, { CustomerID: 'updatedrow' });
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBe(2);
            expect((gridObj as any).contentModule.getRows()[1].changes.CustomerID).toBe('updatedrow');
        });

        it('add record by method', () => {
            gridObj.editModule.addRecord({ OrderID: 10247, CustomerID: 'updated' });
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBeGreaterThan(2);
            expect((gridObj as any).contentModule.getRows()[0].changes.OrderID).toBe(10247);
        });

        it('delete record by method', () => {
            gridObj.editModule.deleteRecord('OrderID', gridObj.currentViewData[2]);
            expect(gridObj.getContent().querySelectorAll('.e-row')[3].classList.contains('e-hiddenrow')).toBeTruthy();
        });

        it('getBatch changes method test', () => {
            let batch: any = gridObj.editModule.getBatchChanges();
            expect(batch.changedRecords[0].CustomerID).toBe('updated');
            expect(batch.changedRecords[1].CustomerID).toBe('updatedrow');
            expect(batch.addedRecords[0].OrderID).toBe(10247);
            expect(batch.deletedRecords[0].OrderID).toBe(10250);
        });

        it('batch save method testing', (done: Function) => {
            let dataBound = (args?: any): void => {
                expect(gridObj.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)').length).toBe(11);
                //record count check
                expect(gridObj.currentViewData.length).toBe(11);
                expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                expect((gridObj.currentViewData[2] as any).OrderID).toBe(10251);
                expect((gridObj.currentViewData[10] as any).OrderID).toBe(10247);
                gridObj.dataBound = null;
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.editModule.batchSave();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('add record by method', () => {
            gridObj.editModule.addRecord({ OrderID: 10246, CustomerID: 'updated' });
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBeGreaterThan(0);
            expect((gridObj as any).contentModule.getRows()[0].changes.OrderID).toBe(10246);
        });

        it('delete record by method', () => {
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.editModule.deleteRecord();
            expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeFalsy();
        });

        it('delete record by method', () => {
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.editModule.deleteRecord();
            expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeTruthy();
        });

        it('batch cancel method testing', () => {
            gridObj.editModule.batchCancel();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
            expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeFalsy();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
        });
    });

    describe('update cell and row method testing => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('update cell', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBe(1);
            expect((gridObj as any).contentModule.getRows()[0].changes.CustomerID).toBe('updated');
        });

        it('update row', () => {
            gridObj.editModule.updateRow(1, { CustomerID: 'updatedrow' });
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBe(2);
            expect((gridObj as any).contentModule.getRows()[1].changes.CustomerID).toBe('updatedrow');
        });

        it('add record by method', () => {
            gridObj.editModule.addRecord({ OrderID: 10247, CustomerID: 'updated' });
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBeGreaterThan(2);
            expect((gridObj as any).contentModule.getRows()[0].changes.OrderID).toBe(10247);
        });

        it('delete record by method', () => {
            gridObj.editModule.deleteRecord('OrderID', gridObj.currentViewData[2]);
            expect(gridObj.getContent().querySelectorAll('.e-row')[3].classList.contains('e-hiddenrow')).toBeTruthy();
        });

        it('getBatch changes method test', () => {
            let batch: any = gridObj.editModule.getBatchChanges();
            expect(batch.changedRecords[0].CustomerID).toBe('updated');
            expect(batch.changedRecords[1].CustomerID).toBe('updatedrow');
            expect(batch.addedRecords[0].OrderID).toBe(10247);
            expect(batch.deletedRecords[0].OrderID).toBe(10250);
        });

        it('batch save method testing', (done: Function) => {
            let dataBound = (args?: any): void => {
                expect(gridObj.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)').length).toBe(11);
                //record count check
                expect(gridObj.currentViewData.length).toBe(11);
                expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                expect((gridObj.currentViewData[2] as any).OrderID).toBe(10251);
                expect((gridObj.currentViewData[10] as any).OrderID).toBe(10247);
                gridObj.dataBound = null;
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.editModule.batchSave();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('add record by method', () => {
            gridObj.editModule.addRecord({ OrderID: 10246, CustomerID: 'updated' });
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBeGreaterThan(0);
            expect((gridObj as any).contentModule.getRows()[0].changes.OrderID).toBe(10246);
        });

        it('delete record by method', () => {
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.editModule.deleteRecord();
            expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeFalsy();
        });

        it('delete record by method', () => {
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.editModule.deleteRecord();
            expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeTruthy();
        });

        it('batch cancel method testing', () => {
            gridObj.editModule.batchCancel();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
            expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeFalsy();
        });

        it('batch edit invalie input', () => {
            (gridObj.editModule as any).editModule.dblClickHandler({ target: gridObj.element });
            expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(0);
            (gridObj.editModule as any).editModule.clickHandler({ target: gridObj.element.querySelector('#' + gridObj.element.id + '_add') });
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
        });
    });

    describe('batch editing lose with other actions => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    allowReordering: true,
                    allowSorting: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    pageSettings: { pageSize: 8 },
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin
                }, done);
        });

        it('Search method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.searchModule.search('10249');
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('Search method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.searchModule.search('10249');
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('clear search', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).not.toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.searchModule.search('');
        });

        it('sort method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.sortColumn('OrderID', 'Ascending', false);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('sort method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-ascending').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.sortColumn('OrderID', 'Ascending', false);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('clear sorting method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.clearSorting();
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('clear sorting method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-ascending').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSorting();
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('group column method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.groupModule.groupColumn('CustomerID');
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('group column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('CustomerID');
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('ungroup column method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.groupModule.ungroupColumn('CustomerID');
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('ungroup column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('CustomerID');
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('filter column method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.filterByColumn('OrderID', 'equal', 10248, 'and', true);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('filter column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('OrderID', 'equal', 10248, 'and', true);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('clearfiltering method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.clearFiltering();
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('clearfiltering method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).not.toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('filter column method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.filterByColumn('OrderID', 'equal', 10248, 'and', true);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('filter column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('OrderID', 'equal', 10248, 'and', true);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('removeFilteredColsByField method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.removeFilteredColsByField('OrderID')
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('removeFilteredColsByField method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).not.toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.removeFilteredColsByField('OrderID')
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('reorder column method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            (gridObj.reorderModule as any).moveColumns(2, gridObj.columns[0]);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('reorder column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect((gridObj.columns[0] as Column).field).not.toBe('OrderID');
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.reorderModule as any).moveColumns(2, gridObj.columns[0]);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('goto page - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.goToPage(2);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeFalsy();
            expect(gridObj.pageSettings.currentPage).not.toBe(2);
        });

        it('goto page - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.pageSettings.currentPage).toBe(2);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.goToPage(2);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeFalsy();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
        });
    });

    describe('cell edit types => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('input cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'CustomerID');
        });

        it('save', (done: Function) => {
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelectorAll('.e-defaultcell').length).toBe(1);
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.editModule.saveCell();
        });

        it('boolean cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'Verified');
        });

        it('save', (done: Function) => {
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelectorAll('.e-checkbox').length).toBe(1);
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = false;
            gridObj.editModule.saveCell();
        });

        // it('numeric cell', (done: Function) => {
        //     let cellEdit = (args?: any): void => {
        //         expect(gridObj.isEdit).toBeFalsy();
        //         gridObj.cellEdit = null;
        //         done();
        //     };
        //     gridObj.cellEdit = cellEdit;
        //     gridObj.editModule.editCell(0, 'Freight');
        // });

        // it('save', (done: Function) => {
        //     expect(gridObj.element.querySelector('.e-editedbatchcell').querySelectorAll('.e-numerictextbox').length).toBe(1);
        //     let cellSave = (args?: any): void => {
        //         expect(gridObj.isEdit).toBeTruthy();
        //         gridObj.cellSave = null;
        //         done();
        //     };
        //     gridObj.cellSave = cellSave;
        //     (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 10;
        //     gridObj.editModule.saveCell();
        // });

        it('dropdown cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'ShipCountry');
        });

        it('save', (done: Function) => {
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelectorAll('.e-dropdownlist').length).toBe(1);
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 'Germany';
            gridObj.editModule.saveCell();
        });

        it('datepicker cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'OrderDate');
        });

        it('save', (done: Function) => {
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelectorAll('.e-datepicker').length).toBe(1);
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 3;
            gridObj.editModule.saveCell();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
        });
    });

    describe('cell edit types => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        let actionComplete: () => void;
        let datamManager = new DataManager(dataSource() as JSON[]);
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: datamManager,
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit', edit: { params: { dataSource: datamManager, value: 'Germany' } } },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('dropdown cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'ShipCountry');
        });

        it('save', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            let dd = (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).ej2_instances[0];
            dd.value = 'Germany';
            dd.dataBind();
            gridObj.editModule.saveCell();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
        });
    });

    describe('Validation check => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        let actionComplete: () => void;
        let datamManager = new DataManager(dataSource() as JSON[]);
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: datamManager,
                    allowFiltering: true,
                    allowGrouping: false,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('editcell cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'CustomerID');
        });

        it('validate', () => {
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = '';
            gridObj.editModule.saveCell();
            expect(document.querySelectorAll('.e-griderror').length).toBeGreaterThan(0);
        });

        it('save', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 'updated';
            gridObj.editModule.saveCell();
        });

        it('allow adding false testing', () => {
            expect(document.querySelectorAll('.e-griderror').length).toBe(0);
            gridObj.editSettings.allowAdding = false;
            gridObj.dataBind();
            (gridObj.editModule as any).editModule.bulkAddRow();
            expect(gridObj.isEdit).toBeFalsy();
        });

        it('allow editing false testing', () => {
            gridObj.editSettings.allowEditing = false;
            gridObj.dataBind();
            (gridObj.editModule as any).editModule.editCell(0, 'CustomerID');
            expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(0);
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
        });
    });
    describe('keyboard shortcuts testing with cell spanning => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        let actionComplete: () => void;
        let cell: HTMLElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: false,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: true },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    queryCellInfo: function (args: QueryCellInfoEventArgs) {
                        if (args.column['field'] === 'CustomerID' && args.data['CustomerID'] === 'VICTE') {
                            args.colSpan = 2;
                        }
                        else if (args.column['field'] === 'ShipCountry' && args.data['ShipCountry'] === 'Germany') {
                            args.colSpan = 2;
                        }
                        else if (args.column['field'] === 'OrderID' && args.data['OrderID'] === 10250) {
                            args.colSpan = 3;
                        }
                    }
                }, done);
        });

        //firt cell with shift tab key        
        it(' shift Tab from spanned cell', () => {
            gridObj.editModule.editCell(1, 'ShipCountry');
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
            let td = gridObj.element.querySelector('.e-editedbatchcell') as HTMLTableCellElement;
            expect(td.getAttribute('aria-label').toString().indexOf('ShipName')).toBeGreaterThan(0);
            gridObj.editModule.editCell(3, 'CustomerID');
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
            td = gridObj.element.querySelector('.e-editedbatchcell') as HTMLTableCellElement;
            expect(td).toBeNull();
            expect(gridObj.getRows()[2].querySelectorAll('.e-editedbatchcell').length).toBe(0);
        });

        it('tab key', () => {
            gridObj.editModule.editCell(1, 'ShipCountry');
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
            let td = gridObj.element.querySelector('.e-editedbatchcell') as HTMLTableCellElement;
            expect(td.getAttribute('aria-label').toString().indexOf('ShipCountry')).toBeGreaterThan(0);
            expect(gridObj.getRows()[1].querySelectorAll('.e-editedbatchcell').length).toBeGreaterThan(0);
            gridObj.editModule.editCell(3, 'CustomerID');
        });

        it('f2 key', () => {
            let tr = gridObj.getContent().querySelectorAll('tr')[1];
            cell = tr.cells[tr.cells.length - 2];
            cell.click();
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: cell } as any);
            expect(cell.getAttribute('aria-label').toString().indexOf('ShipCountry')).toBeGreaterThan(0);
        });

        it('enter key', () => {
            let tr = gridObj.getContent().querySelectorAll('tr')[1];
            let cell = tr.cells[tr.cells.length - 2];
            let ele = gridObj.element.querySelector('.e-editedbatchcell').querySelector('input');
            ele['ej2_instances'][0].value = 'France';
            ele['ej2_instances'][0].dataBind();
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: cell } as any);
            gridObj.editModule.saveCell();
            expect(cell.classList.contains('e-updatedtd')).toBeGreaterThan(0);
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
        });
    });
    describe('showConfirmDialog check => ', () => {
        let gridObj: Grid;
        let preventDefault: Function = new Function();
        let datamManager = new DataManager(dataSource() as JSON[]);
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: datamManager,
                    allowGrouping: false,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    pageSettings: { pageSize: 5 },
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                    ]
                }, done);
        });


        it('false', (done) => {
            (gridObj.editModule as any).editModule.editCell(0, 'CustomerID');
            let input: HTMLInputElement = gridObj.element.querySelector('.e-editedbatchcell input') as HTMLInputElement;
            input.value += input.value;
            let dataBound = (args?: any): void => {
                gridObj.dataBound = null;
                done();
            };
            gridObj.dataBound = dataBound;
            (gridObj.editModule as any).editModule.batchSave();
            expect(isActionPrevent(gridObj)).toBe(false);
        });

        it('true', (done) => {
            gridObj.editSettings.showConfirmDialog = true;
            gridObj.dataBind();
            (gridObj.editModule as any).editModule.editCell(0, 'CustomerID');
            let input: HTMLInputElement = gridObj.element.querySelector('.e-editedbatchcell .e-input') as HTMLInputElement;
            input.value += 1;
            let dataBound = (args?: any): void => {
                gridObj.dataBound = null;
                done();
            };
            gridObj.dataBound = dataBound;
            (gridObj.editModule as any).editModule.batchSave();
            expect(isActionPrevent(gridObj)).toBe(true);
        });

        it('enter key with numeric textbox', (done: Function) => {
            (gridObj.editModule as any).editModule.editCell(0, 'Freight');
            let input: HTMLInputElement = gridObj.element.querySelector('.e-editedbatchcell .e-input') as HTMLInputElement;
            input['ej2_instances'][0].focusIn();
            input.value = '1';
            let cell = gridObj.getContent().querySelector('.e-row').childNodes[3] as any;
            let cellSave = (args?: any): void => {
                //expect(args.previousValue !== args.value).toBe(true);
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: cell } as any);
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });
    // describe('EJ2-6255 - I193332 => ', () => {
    //     let gridObj: Grid;
    //     let preventDefault: Function = new Function();
    //     let datamManager = new DataManager(dataSource() as JSON[]);
    //     beforeAll((done: Function) => {
    //         gridObj = createGrid(
    //             {
    //                 dataSource: datamManager,
    //                 allowGrouping: false,
    //                 editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
    //                 toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
    //                 allowPaging: true,
    //                 pageSettings: { pageSize: 5 },
    //                 columns: [
    //                     { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
    //                     { field: 'CustomerID', type: 'string', validationRules: { required: true } },
    //                     { field: 'EmployeeID', type: 'number', allowEditing: false, visible: false },
    //                     { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
    //                 ],
    //                 actionBegin: function (args: any) {
    //                     if (args.requestType === 'paging') {
    //                         if ((this.editModule.getBatchChanges() as any).changedRecords.length > 0) {
    //                             this.editModule.batchSave();
    //                         }
    //                     }
    //                 }
    //             }, done);
    //     });


    //     it('editing with paging on action begin event', (done) => {
    //         (gridObj.editModule as any).editModule.editCell(0, 'CustomerID');
    //         let input: HTMLInputElement = gridObj.element.querySelector('.e-editedbatchcell input') as HTMLInputElement;
    //         input.value += input.value;
    //         let dataBound = (args?: any): void => {
    //             gridObj.dataBound = null;
    //             done();
    //         };
    //         gridObj.element.click();
    //         gridObj.dataBound = dataBound;
    //         gridObj.goToPage(2);
    //     });

    //     it('again edit cell to test', () => {
    //         (gridObj.editModule as any).editModule.editCell(0, 'CustomerID');
    //         expect(gridObj.element.querySelectorAll('.e-editedbatchcell input').length).toBe(1);
    //     });

    //     it('EJ2-6393 - hide columns with batch changes', () => {
    //         gridObj.editSettings.showConfirmDialog = true;
    //         gridObj.dataBind();
    //         (gridObj.editModule as any).editModule.editCell(0, 'CustomerID');
    //         let input: HTMLInputElement = gridObj.element.querySelector('.e-editedbatchcell input') as HTMLInputElement;
    //         input.value += input.value;
    //         gridObj.element.click();
    //         gridObj.hideColumns('OrderID');
    //         let confirm = gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm');
    //         expect(confirm).not.toBe(null);
    //         expect((confirm as any).style.display !== 'none').toBeTruthy();
    //         confirm.querySelectorAll('button')[1].click();
    //     });
    //     it('EJ2-6393 - show columns with batch changes', () => {
    //         (gridObj.editModule as any).editModule.editCell(0, 'CustomerID');
    //         let input: HTMLInputElement = gridObj.element.querySelector('.e-editedbatchcell input') as HTMLInputElement;
    //         input.value += input.value;
    //         gridObj.element.click();
    //         gridObj.showColumns('EmployeeID');
    //         let confirm = gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm');
    //         expect(confirm).not.toBe(null);
    //         expect((confirm as any).style.display !== 'none').toBeTruthy();
    //         confirm.querySelectorAll('button')[1].click();
    //     });

    //     it('again edit cell to test', () => {
    //         (gridObj.editModule as any).editModule.editCell(0, 'CustomerID');
    //         expect(gridObj.element.querySelectorAll('.e-editedbatchcell input').length).toBe(1);
    //     });

    //     afterAll(() => {
    //         destroy(gridObj);
    //     });
    // });

    describe('EJ2-6337-script error throws when Delete a record after validation error appears => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 120, validationRules: { required: true } },
                        { field: 'Freight', headerText: 'Freight', editType: 'numericedit', textAlign: 'Right', width: 120, format: 'C2' },
                        { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150 }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('script error resolved EJ2-6337', () => {
            gridObj.editModule.editCell(0, 'CustomerID');
            (<any>document.getElementById(gridObj.element.id + 'CustomerID')).value = '';
            gridObj.editModule.saveCell();
            gridObj.deleteRecord('OrderID', gridObj.dataSource[1]);
            expect(gridObj.isEdit).toBe(false);
        });

        afterAll((done: Function) => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            setTimeout(function () {
                done();
            }, 1000);
        });
    });

    describe('Batch editing render with Freeze => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    frozenColumns: 2,
                    frozenRows: 2,
                    editSettings: {
                        allowEditing: true, allowAdding: true, allowDeleting: true,
                        mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false
                    },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' }
                    ]
                }, done);
        });

        it('cell save complete', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.editModule.editCell(0, 'CustomerID');
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.cellSave = cellSave;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-toolbar-item.e-overlay').length).toBe(2);
            gridObj.editModule.saveCell();
        });

        it('last action check', () => {
            expect((gridObj as any).contentModule.getRows()[0].data.CustomerID).toBe('VINET');
            expect((gridObj as any).contentModule.getRows()[0].changes.CustomerID).toBe('updated');
            //row count check
            expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(18);
            //record count check
            expect(gridObj.currentViewData.length).toBe(11);
            expect(gridObj.element.querySelectorAll('.e-toolbar-item.e-overlay').length).toBe(0);
        });

        it('add start', (done: Function) => {
            let beforeBatchAdd = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchAdd = null;
            };
            let batchAdd = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBeGreaterThan(gridObj.getVisibleColumns().length - 1);
                expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                gridObj.batchAdd = null;
                done();
            };
            gridObj.beforeBatchAdd = beforeBatchAdd;
            gridObj.batchAdd = batchAdd;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('add - cell edit complete', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            //update orderid
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 10247;
            gridObj.editModule.saveCell();
        });

        it('delete', (done: Function) => {
            let beforeBatchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchDelete = null;
            };
            let batchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                //row count check
                expect(gridObj.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)').length).toBe(16);
                //record count check
                expect(gridObj.currentViewData.length).toBe(11);
                gridObj.batchDelete = null;
                done();
            };
            gridObj.beforeBatchDelete = beforeBatchDelete;
            gridObj.batchDelete = batchDelete;
            gridObj.clearSelection();
            gridObj.selectRow(2, true);
            gridObj.deleteRow(gridObj.getContent().querySelectorAll('.e-row')[2] as any);
        });

        it('delete', (done: Function) => {
            let beforeBatchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchDelete = null;
            };
            let batchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                //row count check
                expect(gridObj.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)').length).toBe(16);
                //record count check
                expect(gridObj.currentViewData.length).toBe(11);
                gridObj.batchDelete = null;
                done();
            };
            gridObj.beforeBatchDelete = beforeBatchDelete;
            gridObj.batchDelete = batchDelete;
            gridObj.clearSelection();
            gridObj.selectRow(2, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_delete' } });
        });

        it('batch save', (done: Function) => {
            let beforeBatchSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchSave = null;
            };
            let dataBound = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                //row count check
                expect(gridObj.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)').length).toBe(16);
                //record count check
                expect(gridObj.currentViewData.length).toBe(10);
                expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                expect((gridObj.currentViewData[2] as any).OrderID).toBe(10251);
                expect((gridObj.currentViewData[9] as any).OrderID).toBe(10247);
                gridObj.dataBound = null;
                done();
            };
            gridObj.beforeBatchSave = beforeBatchSave;
            gridObj.dataBound = dataBound;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('delete record by method', () => {
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.editModule.deleteRecord();
            expect(gridObj.getHeaderContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeTruthy();
        });

        it('batch cancel method testing', () => {
            gridObj.editModule.batchCancel();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
            expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeFalsy();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
        });
    });

    describe('EJ2-6489 hierarchy testing => ', () => {
        let gridObj: Grid;
        let childGridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        let detailDataBound: () => void;
        let preventDefault: Function = new Function();
        let cell: HTMLElement;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData,
                    allowPaging: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                        { field: 'FirstName', headerText: 'First Name', textAlign: 'Left', width: 100 },
                    ],
                    detailDataBound: detailDataBound,
                    childGrid: {
                        dataSource: dataSource().concat([{
                            OrderID: 10555, CustomerID: 'TOMSP', EmployeeID: 1, OrderDate: new Date(836505e6),
                            ShipName: 'Toms Spezialitäten', ShipCity: 'Münster', ShipAddress: 'Luisenstr. 48',
                            ShipRegion: 'CJ', ShipPostalCode: '44087', ShipCountry: 'Germany', Freight: 11.61, Verified: !1
                        },
                        {
                            OrderID: 10556, CustomerID: 'HANAR', EmployeeID: 1, OrderDate: new Date(8367642e5),
                            ShipName: 'Hanari Carnes', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua do Paço, 67',
                            ShipRegion: 'RJ', ShipPostalCode: '05454-876', ShipCountry: 'Brazil', Freight: 65.83, Verified: !0
                        }]), queryString: 'EmployeeID',
                        allowPaging: false,
                        actionBegin: actionBegin,
                        actionComplete: actionComplete,
                        editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                        toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                        pageSettings: { pageCount: 5, pageSize: 5 },
                        columns: [
                            { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                            { field: 'CustomerID', type: 'string' },
                            { field: 'EmployeeID', type: 'number' },
                            { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                            { field: 'ShipCity' },
                            { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                            { field: 'ShipName', isIdentity: true },
                            { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                            { field: 'ShipRegion', type: 'string' },
                            { field: 'ShipAddress', allowFiltering: true, visible: false },
                            { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                        ],
                    }
                }, done);
        });

        it('Expand method testing', (done: Function) => {
            detailDataBound = (args?: any): void => {
                childGridObj = (gridObj.element.querySelector('.e-grid') as any).ej2_instances[0];
                done();
            };
            gridObj.detailDataBound = detailDataBound;
            gridObj.detailRowModule.expand(gridObj.getDataRows()[0].querySelector('.e-detailrowcollapse'));
        });

        //firt cell with shift tab key        
        it('edit cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(childGridObj.isEdit).toBeFalsy();
                childGridObj.cellEdit = null;
                done();
            };
            childGridObj.cellEdit = cellEdit;
            childGridObj.editModule.editCell(0, 'CustomerID');
        });

        it('shift tab key', () => {
            childGridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            childGridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: childGridObj.element.querySelector('.e-editedbatchcell') } as any);
            expect(childGridObj.isEdit).toBeFalsy();
        });

        //firt cell with shift tab key        
        it('edit cell', (done: Function) => {
            // last action check
            expect(childGridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(0);
            let cellEdit = (args?: any): void => {
                expect(childGridObj.isEdit).toBeFalsy();
                childGridObj.cellEdit = null;
                done();
            };
            childGridObj.cellEdit = cellEdit;
            childGridObj.editModule.editCell(childGridObj.currentViewData.length - 1, 'OrderDate');
        });

        it('tab key', () => {
            childGridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            childGridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: childGridObj.element.querySelector('.e-editedbatchcell') } as any);
            expect(childGridObj.isEdit).toBeFalsy();
        });

        it('f2 key', (done: Function) => {
            // last action check
            expect(childGridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(0);
            cell = childGridObj.getContent().querySelector('.e-row').childNodes[1] as any;
            let cellEdit = (args?: any): void => {
                expect(childGridObj.isEdit).toBeFalsy();
                childGridObj.cellEdit = null;
                done();
            };
            childGridObj.cellEdit = cellEdit;
            cell.click();
            childGridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: cell } as any);
        });

        it('enter key', (done: Function) => {
            let cell = childGridObj.getContent().querySelector('.e-row').childNodes[1] as any;
            let cellSave = (args?: any): void => {
                expect(childGridObj.isEdit).toBeTruthy();
                childGridObj.cellSave = null;
                done();
            };
            childGridObj.cellSave = cellSave;
            childGridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            childGridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: cell } as any);
        });

        it('cell save', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(childGridObj.isEdit).toBeTruthy();
                childGridObj.cellSave = null;
                done();
            };
            childGridObj.cellSave = cellSave;
            (childGridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
        });


        it('add start - args.cancel true', (done: Function) => {
            let beforeBatchAdd = (args?: any): void => {
                expect(childGridObj.isEdit).toBeFalsy();
                childGridObj.beforeBatchAdd = null;
                args.cancel = true;
                done();
            };
            childGridObj.beforeBatchAdd = beforeBatchAdd;
            childGridObj.keyboardModule.keyAction({ action: 'insert', preventDefault: preventDefault, target: childGridObj.getContent().querySelector('.e-row') } as any);
        });

        it('add start - args.cancel false', (done: Function) => {
            let beforeBatchAdd = (args?: any): void => {
                expect(childGridObj.isEdit).toBeFalsy();
                childGridObj.beforeBatchAdd = null;
            };
            let batchAdd = (args?: any): void => {
                expect(childGridObj.element.querySelectorAll('form').length).toBe(1);
                childGridObj.batchAdd = null;
                done();
            };
            childGridObj.beforeBatchAdd = beforeBatchAdd;
            childGridObj.batchAdd = batchAdd;
            childGridObj.keyboardModule.keyAction({ action: 'insert', preventDefault: preventDefault, target: childGridObj.getContent().querySelector('.e-row') } as any);
        });

        it('add - cell edit complete', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(childGridObj.isEdit).toBeTruthy();
                childGridObj.cellSave = null;
                done();
            };
            childGridObj.cellSave = cellSave;
            expect(childGridObj.element.querySelector('.e-defaultcell').id).toBe(childGridObj.element.id + 'OrderID');
            (childGridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 10247;
            (childGridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
        });

        it('delete', (done: Function) => {
            let cell = childGridObj.getContent().querySelectorAll('.e-row')[2].childNodes[1] as any;
            let beforeBatchDelete = (args?: any): void => {
                expect(childGridObj.isEdit).toBeFalsy();
                childGridObj.beforeBatchDelete = null;
            };
            let batchDelete = (args?: any): void => {
                expect(childGridObj.isEdit).toBeFalsy();
                childGridObj.batchDelete = null;
                done();
            };
            childGridObj.beforeBatchDelete = beforeBatchDelete;
            childGridObj.batchDelete = batchDelete;
            childGridObj.clearSelection();
            childGridObj.selectRow(2, true);
            childGridObj.keyboardModule.keyAction({ action: 'delete', preventDefault: preventDefault, target: cell } as any);
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
        });
    });

    describe('Editing with empty grid => ', () => {
        let gridObj: Grid;
        let childGridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        let detailDataBound: () => void;
        let preventDefault: Function = new Function();

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    allowPaging: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                        { field: 'FirstName', headerText: 'First Name', textAlign: 'Left', width: 100 },
                    ]
                }, done);
        });

        it('adding record', () => {
            gridObj.editModule.addRecord({ OrderID: 10246, CustomerID: 'updated' });
            expect(gridObj.getContentTable().querySelector('.e-emptyrow')).not.toBe(null);
            expect(gridObj.getContentTable().querySelector('.e-hide')).not.toBe(null);
        });

        it('closing record', () => {
            (gridObj.editModule as any).editModule.closeEdit();
            expect(gridObj.getContentTable().querySelector('.e-emptyrow')).not.toBe(null);
            expect(gridObj.getContentTable().querySelector('.e-hide')).toBe(null);
        });
       
        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
        });
    });
    describe('Batch editing the last column after grouping => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowGrouping: true,
                    editSettings: { allowEditing: true, mode: 'Batch' },
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', validationRules: { required: true } },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'CustomerID', type: 'string' }
                    ],
                    actionBegin: actionBegin
                }, done);
        });

        it('EJ2-7728===> Grouping one column', (done: Function) =>{
            actionComplete = (args?: Object): void => {
                expect(gridObj.groupSettings.columns.length).toBe(1);
                done();
            }
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('OrderID');
        });

        it('EJ2-7728===> Editing customerID(Last column) cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'CustomerID');
        });

        it('EJ2-7728===> saving CustomerID', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 'updated';
            gridObj.editModule.saveCell();
        });

        it('EJ2-7728====>Checking customerID value', () => {
            let tr = gridObj.getContent().querySelectorAll('tr')[1];
            expect(tr.cells[5].innerText).toBe('updated');
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
        });
    });

    describe('Batch editing the last row => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0,3),
                    editSettings: { allowEditing: true, mode: 'Batch' },
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', validationRules: { required: true } },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'CustomerID', type: 'string' }
                    ],
                    actionBegin: actionBegin
                }, done);
        });

        it('EJ2-8084===> Editing customerID(Last column and last row) cell', () => {
            gridObj.editModule.editCell(2, 'CustomerID');
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 'updated';
            gridObj.editModule.editCell(2, 'CustomerID');
        });

        it('EJ2-8084====>Checking customerID value(last row and lat column)', () => {
            let tr = gridObj.getContent().querySelectorAll('tr')[2];
            expect(tr.cells[4].innerText).toBe('updated');
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
        });
    });

    describe('add record with multiple validation for enforce all cells => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', validationRules: { required: true } },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('add and update check', function () {
            (gridObj.element.querySelector('#'+gridObj.element.id+'_add') as any).click();
            (gridObj.element.querySelector('#'+gridObj.element.id+'_update') as any).click();
            expect(document.querySelectorAll('.e-griderror').length).toBe(1);                
            (gridObj.element.querySelector('#'+gridObj.element.id+'CustomerID') as any).value ='test';
            (gridObj.element.querySelector('#'+gridObj.element.id+'_update') as any).click();
expect(document.querySelectorAll('.e-griderror').length).toBe(1);
(gridObj.element.querySelector('#'+gridObj.element.id+'_update') as any).click();
expect(document.querySelectorAll('.e-griderror').length).toBe(1);


(gridObj.element.querySelector('#'+gridObj.element.id+'ShipRegion') as any).value ='test';
expect(gridObj.isEdit).toBe(true);
(gridObj.element.querySelector('#'+gridObj.element.id+'_update') as any).click();
expect(gridObj.isEdit).toBe(false);
expect((gridObj.editModule as any).editModule.isAdded).toBe(false);
        });

        it('add and focus out', function () {
            (gridObj.element.querySelector('#'+gridObj.element.id+'_add') as any).click();
            gridObj.element.click()
            expect(document.querySelectorAll('.e-griderror').length).toBe(1);
            (gridObj.element.querySelector('#'+gridObj.element.id+'CustomerID') as any).value ='test';
            gridObj.element.click()
            expect(document.querySelectorAll('.e-griderror').length).toBe(1);
gridObj.element.click()
expect(document.querySelectorAll('.e-griderror').length).toBe(1);
(gridObj.element.querySelector('#'+gridObj.element.id+'ShipRegion') as any).value ='test';
expect(gridObj.isEdit).toBe(true);
gridObj.element.click()
expect(gridObj.isEdit).toBe(false);
//datasource .engt +1                
expect((gridObj.editModule as any).editModule.isAdded).toBe(false);
        });

        it('add and delete', function () {
            (gridObj.element.querySelector('#'+gridObj.element.id+'_add') as any).click();
            gridObj.element.click()
            expect(document.querySelectorAll('.e-griderror').length).toBe(1);
            (gridObj.element.querySelector('#'+gridObj.element.id+'_delete') as any).click();
            expect(document.querySelectorAll('.e-griderror').length).toBe(0);          
            expect((gridObj.editModule as any).editModule.isAdded).toBe(false);
        });

        it('add and cancel', function () {
            (gridObj.element.querySelector('#'+gridObj.element.id+'_add') as any).click();
            gridObj.element.click()
            expect(document.querySelectorAll('.e-griderror').length).toBe(1);
            gridObj.editModule.closeEdit();     
        });

        
        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
        });
    });


});

describe('Action Complete in batch edit => ', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    let actionComplete: () => void;
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
                    { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                ],
                actionComplete: actionComplete
            }, done);
    });
    it('batchsave as requestType in actionComplete', () => {
        actionComplete = (args?: any): void => {
            expect(args.requestType).toBe('batchsave');
        }
        gridObj.actionComplete = actionComplete;
        gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
        gridObj.editModule.batchSave();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

