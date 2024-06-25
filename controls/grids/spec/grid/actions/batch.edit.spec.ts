/**
 * Grid batch edit spec document
 */ 
import { extend, getValue, select, selectAll, createElement } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { isActionPrevent } from '../../../src/grid/base/util';
import { QueryCellInfoEventArgs } from '../../../src/grid/base/interface';
import { Filter } from '../../../src/grid/actions/filter';
import { Edit } from '../../../src/grid/actions/edit';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Page } from '../../../src/grid/actions/page';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Column } from '../../../src/grid/models/column';
import { Selection } from '../../../src/grid/actions/selection';
import { data, employeeData } from '../base/datasource.spec';
import { DetailRow } from '../../../src/grid/actions/detail-row'
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy, getClickObj } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import * as events from '../../../src/grid/base/constant';
import { BatchEdit } from '../../../src';
import { DefaultEditCell } from '../../../src/grid/renderer/default-edit-cell';
import { CommandColumn } from '../../../src/grid/actions/command-column';
import { Aggregate } from '../../../src/grid/actions/aggregate';
import { RowDD } from '../../../src/grid/actions/row-reorder';

Grid.Inject(Filter, Page, Selection, Group, Edit, Sort, Reorder, Aggregate, RowDD, Toolbar, DetailRow, CommandColumn);

describe('Batch Editing module', () => {

    let dataSource: Function = (): Object[] => {
        let datasrc: Object[] = [];
        for (let i = 0; i < 11; i++) {
            datasrc.push(extend({}, {}, data[i], true));
        }
        
        return datasrc; 
    };
    
    let batchData: Object[] = dataSource();


    describe('Batch editing render => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: batchData,
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.saveCell();
        });

        it('last action check', () => {
            expect((gridObj as any).contentModule.getRows()[0].data.CustomerID).toBe('VINET');
            expect((gridObj as any).contentModule.getRows()[0].changes.CustomerID).toBe('updated');
            //row count check
            expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
            //record count check
            expect(gridObj.currentViewData.length).toBe(11);
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(1);
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
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
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
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
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
        it('Batch Edit form internal event check', (done: Function) => {
            gridObj.on(events.batchEditFormRendered, (args: any) => {
                expect(args.name).toBe('batcheditform-rendered');
                gridObj.off(events.batchEditFormRendered);
                done();
            });
            gridObj.editModule.editCell(0, 'CustomerID');
        });
        it('Batch Cancel internal event check', (done: Function) => {
            gridObj.editSettings.showConfirmDialog = false;
            gridObj.on(events.beforeBatchCancel, (args: any) => {
                expect(args.name).toBe('before-batch-cancel');
                args.cancel = true;
                gridObj.off(events.beforeBatchCancel);
                done();
            });
            (gridObj.toolbarModule as any).toolbarClickHandler({ item: { id: gridObj.element.id + '_cancel' } });
        });        

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('same actions above for cancel edit => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: batchData,
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
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[1].click();
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
            gridObj = actionBegin = actionComplete = null;
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
                    dataSource: batchData,
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
            gridObj.editModule.editCell(gridObj.currentViewData.length - 2, 'OrderDate');
        });

        it('tab key --1', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('f2 key', (done: Function) => {
            // last action check
            expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
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
            expect(gridObj.element.querySelectorAll('tr')[2].querySelectorAll('td')[1].innerText).toBe('updated');
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('cell save', (done: Function) => {
            //last action check
            expect(gridObj.focusModule.currentInfo.element.getAttribute('data-colindex')).toBe('1');
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
            expect(gridObj.isEdit).toBeTruthy();
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
            expect(gridObj.isEdit).toBeTruthy();
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
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('shift tab key', () => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell')).toBeTruthy();
            gridObj.editModule.editCell(2, 'CustomerID');
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        });

        it('cell save', (done: Function) => {
            //last action check
            expect(gridObj.element.querySelectorAll('tr')[3].querySelectorAll('td')[1].innerText).toBe('updated');
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            //for endedit and batch save while editing
            gridObj.editCell(2,'CustomerID');
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
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('update cell and row method testing => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: batchData,
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
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
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
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
            expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeFalsy();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('update cell and row method testing => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: batchData,
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
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
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
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
            expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeFalsy();
        });

        it('batch edit invalie input', () => {
            (gridObj.editModule as any).editModule.dblClickHandler({ target: gridObj.element });
            expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(0);
            (gridObj.editModule as any).editModule.clickHandler({ target: select('#' + gridObj.element.id + '_add', gridObj.element) });
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('batch editing lose with other actions => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: batchData,
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
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[1].click();
        });

        it('Search method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.searchModule.search('10249');
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
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
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[1].click();
        });

        it('sort method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-ascending').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.sortColumn('OrderID', 'Ascending', false);
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
        });

        it('clear sorting method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.clearSorting();
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[1].click();
        });

        it('clear sorting method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-ascending').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSorting();
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
        });

        it('group column method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.groupModule.groupColumn('CustomerID');
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[1].click();
        });

        it('group column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('CustomerID');
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
        });

        it('ungroup column method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.groupModule.ungroupColumn('CustomerID');
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[1].click();
        });

        it('ungroup column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('CustomerID');
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
        });

        it('filter column method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.filterByColumn('OrderID', 'equal', 10248, 'and', true);
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[1].click();
        });

        it('filter column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('OrderID', 'equal', 10248, 'and', true);
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
        });

        it('clearfiltering method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.clearFiltering();
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[1].click();
        });

        it('clearfiltering method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).not.toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
        });

        it('filter column method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.filterByColumn('OrderID', 'equal', 10248, 'and', true);
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[1].click();
        });

        it('filter column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('OrderID', 'equal', 10248, 'and', true);
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
        });

        it('removeFilteredColsByField method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.removeFilteredColsByField('OrderID')
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[1].click();
        });

        it('removeFilteredColsByField method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).not.toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.removeFilteredColsByField('OrderID')
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
        });

        it('reorder column method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            (gridObj.reorderModule as any).moveColumns(2, gridObj.columns[0]);
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[1].click();
        });

        it('reorder column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect((gridObj.columns[0] as Column).field).not.toBe('OrderID');
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.reorderModule as any).moveColumns(2, gridObj.columns[0]);
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
        });

        it('goto page - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.goToPage(2);
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[1].click();
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeFalsy();
            expect(gridObj.pageSettings.currentPage).not.toBe(2);
        });

        it('goto page - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.pageSettings.currentPage).toBe(2);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.goToPage(2);
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeFalsy();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('cell edit types => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: batchData,
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
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('cell edit types => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
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
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('Validation check => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
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
            gridObj = actionBegin = actionComplete = null;
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
            expect(td).toBeTruthy();
            expect(gridObj.getRows()[2].querySelectorAll('.e-editedbatchcell').length).toBe(1);
        });

        it('tab key', () => {
            gridObj.editModule.editCell(1, 'ShipCountry');
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
            let td = gridObj.element.querySelector('.e-focused') as HTMLTableCellElement;
            expect(gridObj.getRows()[2].querySelectorAll('.e-focused').length).toBeGreaterThan(0);
            gridObj.editModule.editCell(3, 'CustomerID');
        });

        it('EJ2-283684 editing is not enabled while pressing tab key', () => {
            gridObj.editModule.editCell(3, 'CustomerID');
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.getContent().querySelectorAll('tr')[3].cells[2]})
            expect(gridObj.getContent().querySelectorAll('tr')[3].cells[2].classList.contains('e-editedbatchcell')).toBeTruthy();
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

        it('tab key - allowNextRowEdit,Primary Key', () => {
            gridObj.editSettings.allowNextRowEdit = true;
            (gridObj.editModule as any).editModule.editCell(2, 'OrderDate');
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
            expect(gridObj.isEdit).toBeTruthy();
            expect(gridObj.selectedRowIndex).toBe(3);
            expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
            expect(gridObj.element.querySelectorAll('form').length).toBe(1);

        });
        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
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
                    allowSorting: true,
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

        it('EJ2-849429-Cell changes not saving when clicking outside grid', (done: Function) => {
            let cellSave = (args?: any): void => { // must be execute after focus out
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            gridObj['focusOutHandler']({target: null, relatedTarget: null} as any);
        });

        it('EJ2-846554-Script error when trying to edit after sorting in presence of validation message in Batch mode', () => {
            gridObj.cellSave = null;
            (gridObj.editModule as any).editModule.editCell(0, 'CustomerID');
            let input: HTMLInputElement = gridObj.element.querySelector('.e-editedbatchcell input') as HTMLInputElement;
            input.value = '';
            gridObj.sortColumn('CustomerID', 'Ascending');
            expect(selectAll('#' + gridObj.element.id + 'EditConfirm_dialog-content div', gridObj.element).length).toBeGreaterThan(0);
        });

        it('EJ2-846554-Script error when trying to edit after sorting in presence of validation message in Batch mode and showConfirmDialog as false', () => {
            gridObj.editSettings.showConfirmDialog = false;
            gridObj.dataBind();
            gridObj.cellSave = null;
            (gridObj.editModule as any).editModule.editCell(0, 'CustomerID');
            let input: HTMLInputElement = gridObj.element.querySelector('.e-editedbatchcell input') as HTMLInputElement;
            input.value = '';
            gridObj.sortColumn('CustomerID', 'Ascending');
            expect(gridObj.editModule.formObj).toBeUndefined;
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
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
    //         let confirm = select('#' + gridObj.element.id + 'EditConfirm', gridObj.element);
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
    //         let confirm = select('#' + gridObj.element.id + 'EditConfirm', gridObj.element);
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
                    dataSource: batchData,
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
            gridObj = actionBegin = actionComplete = null;
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
                    dataSource: batchData,
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.editModule.saveCell();
        });

        it('last action check', () => {
            expect((gridObj as any).contentModule.getRows()[0].data.CustomerID).toBe('VINET');
            expect((gridObj as any).contentModule.getRows()[0].changes.CustomerID).toBe('updated');
            //row count check
            expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(9);
            //record count check
            expect(gridObj.currentViewData.length).toBe(11);
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(1);
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
                expect(gridObj.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)').length).toBe(8);
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
                expect(gridObj.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)').length).toBe(8);
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
                expect(gridObj.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)').length).toBe(8);
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
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
        });

        it('delete record by method', () => {
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.editModule.deleteRecord();
            expect(gridObj.getHeaderContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeTruthy();
        });

        it('batch cancel method testing', () => {
            gridObj.editModule.batchCancel();
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
            expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeFalsy();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Batch editing render with Freeze and empty grid => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    frozenColumns: 2,
                    frozenRows: 2,
                    editSettings: {
                        allowEditing: true, allowAdding: true, allowDeleting: true,
                        mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false
                    },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity', type: 'string' }
                    ]
                }, done);
        });
        it('Disable altrow', (done: Function) => {
            let dataBound = (args: Object) => {
                expect(gridObj.getContent().querySelectorAll('.e-altrow').length).toBe(0);
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.refreshColumns();
        });

        it(' Batch edit add start', (done: Function) => {
            let beforeBatchAdd = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchAdd = null;
            };
            let batchAdd = (args?: any): void => {
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

        it('cell save complete', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBeGreaterThan(2);
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.editModule.editCell(0, 'Freight');
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = '10';
            gridObj.editModule.editCell(0, 'ShipCity');
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'Reims';
            gridObj.cellSave = cellSave;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.editModule.saveCell();
        });

        it('Batch edit add - cell edit complete', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            //update orderid
            gridObj.editModule.editCell(0, 'OrderID');
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 10247;
            gridObj.editModule.saveCell();
        });

        it('batch edit save', (done: Function) => {
            let beforeBatchSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchSave = null;
            };
            let dataBound = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                expect(gridObj.currentViewData.length).toBe(1);
                gridObj.dataBound = null;
                done();
            };
            gridObj.beforeBatchSave = beforeBatchSave;
            gridObj.dataBound = dataBound;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
            selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
        });
        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = null;
        });
    });
    
    // describe('EJ2-6489 hierarchy testing => ', () => {
    //     let gridObj: Grid;
    //     let childGridObj: Grid;
    //     let actionBegin: () => void;
    //     let actionComplete: () => void;
    //     let detailDataBound: () => void;
    //     let preventDefault: Function = new Function();
    //     let cell: HTMLElement;

    //     beforeAll((done: Function) => {
    //         gridObj = createGrid(
    //             {
    //                 dataSource: employeeData,
    //                 allowPaging: true,
    //                 editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
    //                 toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
    //                 columns: [
    //                     { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
    //                     { field: 'FirstName', headerText: 'First Name', textAlign: 'Left', width: 100 },
    //                 ],
    //                 detailDataBound: detailDataBound,
    //                 childGrid: {
    //                     dataSource: batchData.concat([{
    //                         OrderID: 10555, CustomerID: 'TOMSP', EmployeeID: 1, OrderDate: new Date(836505e6),
    //                         ShipName: 'Toms Spezialitäten', ShipCity: 'Münster', ShipAddress: 'Luisenstr. 48',
    //                         ShipRegion: 'CJ', ShipPostalCode: '44087', ShipCountry: 'Germany', Freight: 11.61, Verified: !1
    //                     },
    //                     {
    //                         OrderID: 10556, CustomerID: 'HANAR', EmployeeID: 1, OrderDate: new Date(8367642e5),
    //                         ShipName: 'Hanari Carnes', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua do Paço, 67',
    //                         ShipRegion: 'RJ', ShipPostalCode: '05454-876', ShipCountry: 'Brazil', Freight: 65.83, Verified: !0
    //                     }]), queryString: 'EmployeeID',
    //                     allowPaging: false,
    //                     actionBegin: actionBegin,
    //                     actionComplete: actionComplete,
    //                     editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
    //                     toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
    //                     pageSettings: { pageCount: 5, pageSize: 5 },
    //                     columns: [
    //                         { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
    //                         { field: 'CustomerID', type: 'string' },
    //                         { field: 'EmployeeID', type: 'number' },
    //                         { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
    //                         { field: 'ShipCity' },
    //                         { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
    //                         { field: 'ShipName', isIdentity: true },
    //                         { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
    //                         { field: 'ShipRegion', type: 'string' },
    //                         { field: 'ShipAddress', allowFiltering: true, visible: false },
    //                         { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
    //                     ],
    //                 }
    //             }, done);
    //     });

    //     it('Expand method testing', (done: Function) => {
    //         detailDataBound = (args?: any): void => {
    //             childGridObj = (gridObj.element.querySelector('.e-grid') as any).ej2_instances[0];
    //             done();
    //         };
    //         gridObj.detailDataBound = detailDataBound;
    //         gridObj.detailRowModule.expand(gridObj.getDataRows()[0].querySelector('.e-detailrowcollapse'));
    //     });

    //     it('add start - args.cancel true', (done: Function) => {
    //         let beforeBatchAdd = (args?: any): void => {
    //             expect(childGridObj.isEdit).toBeFalsy();
    //             childGridObj.beforeBatchAdd = null;
    //             args.cancel = true;
    //             done();
    //         };
    //         childGridObj.beforeBatchAdd = beforeBatchAdd;
    //         childGridObj.keyboardModule.keyAction({ action: 'insert', preventDefault: preventDefault, target: childGridObj.getContent().querySelector('.e-row') } as any);
    //     });

    //     it('add start - args.cancel false', (done: Function) => {
    //         let beforeBatchAdd = (args?: any): void => {
    //             expect(childGridObj.isEdit).toBeFalsy();
    //             childGridObj.beforeBatchAdd = null;
    //         };
    //         let batchAdd = (args?: any): void => {
    //             expect(childGridObj.element.querySelectorAll('form').length).toBe(1);
    //             childGridObj.batchAdd = null;
    //             done();
    //         };
    //         childGridObj.beforeBatchAdd = beforeBatchAdd;
    //         childGridObj.batchAdd = batchAdd;
    //         childGridObj.keyboardModule.keyAction({ action: 'insert', preventDefault: preventDefault, target: childGridObj.getContent().querySelector('.e-row') } as any);
    //     });

    //     it('add - cell edit complete', (done: Function) => {
    //         let cellSave = (args?: any): void => {
    //             expect(childGridObj.isEdit).toBeTruthy();
    //             childGridObj.cellSave = null;
    //             done();
    //         };
    //         childGridObj.cellSave = cellSave;
    //         expect(childGridObj.element.querySelector('.e-defaultcell').id).toBe(childGridObj.element.id + 'OrderID');
    //         (childGridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 10247;
    //         (childGridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
    //     });

    //     it('delete', (done: Function) => {
    //         let cell = childGridObj.getContent().querySelectorAll('.e-row')[2].childNodes[1] as any;
    //         let beforeBatchDelete = (args?: any): void => {
    //             expect(childGridObj.isEdit).toBeFalsy();
    //             childGridObj.beforeBatchDelete = null;
    //         };
    //         let batchDelete = (args?: any): void => {
    //             expect(childGridObj.isEdit).toBeFalsy();
    //             childGridObj.batchDelete = null;
    //             done();
    //         };
    //         childGridObj.beforeBatchDelete = beforeBatchDelete;
    //         childGridObj.batchDelete = batchDelete;
    //         childGridObj.clearSelection();
    //         childGridObj.selectRow(2, true);
    //         childGridObj.keyboardModule.keyAction({ action: 'delete', preventDefault: preventDefault, target: cell } as any);
    //     });

    //     afterAll(() => {
    //         gridObj.notify('tooltip-destroy', {});
    //         destroy(gridObj);
    //         gridObj = actionBegin = actionComplete = null;
    //     });
    // });

    describe('Editing with empty grid => ', () => {
        let gridObj: Grid;

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
            expect(gridObj.getContentTable().querySelector('.e-emptyrow')).toBe(null);
            expect(gridObj.getContentTable().querySelector('.e-hide')).toBe(null);
        });

        it('closing record', () => {
            (gridObj.editModule as any).editModule.closeEdit();
            expect(gridObj.getContentTable().querySelector('.e-emptyrow')).not.toBe(null);
            expect(gridObj.getContentTable().querySelector('.e-hide')).toBe(null);
        });
       
        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = null;
        });
    });
    describe('Batch editing the last column after grouping => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: batchData,
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
            gridObj = actionBegin = actionComplete = null;
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
                    editSettings: { allowEditing: true, allowDeleting: true, mode: 'Batch' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', validationRules: { required: true } },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'CustomerID', type: 'string' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
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

        it('save empty string', () => {
            gridObj.editModule.editCell(0,'CustomerID');
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = '';
            gridObj.editModule.saveCell();
            let tr = gridObj.getContent().querySelectorAll('tr')[0];
            expect(tr.cells[4].innerText).toBe('');
        });

        it('Delete all records to check action complete', function () {
            gridObj.selectRow(0);
            for (var i = 0; i < gridObj.getRows().length; i++) {
                gridObj.deleteRecord();
            }
            (select('#'+gridObj.element.id+'_update', gridObj.element) as any).click();
        });

        it('action complete triggered when deleting all records', function () {
            actionComplete = function (args) {
                expect(args.requestType).toBe('batchsave');
            };
            gridObj.actionComplete = actionComplete;
            (document.activeElement as any).click();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('add record with multiple validation for enforce all cells => ', () => {
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
            (select('#'+gridObj.element.id+'_add', gridObj.element) as any).click();
            (select('#'+gridObj.element.id+'_update', gridObj.element) as any).click();
            expect(document.querySelectorAll('.e-griderror').length).toBe(1);                
            (select('#'+gridObj.element.id+'CustomerID', gridObj.element) as any).value ='test';
            (select('#'+gridObj.element.id+'_update', gridObj.element) as any).click();
expect(document.querySelectorAll('.e-griderror').length).toBe(1);
(select('#'+gridObj.element.id+'_update', gridObj.element) as any).click();
expect(document.querySelectorAll('.e-griderror').length).toBe(1);


(select('#'+gridObj.element.id+'ShipRegion', gridObj.element) as any).value ='test';
expect(gridObj.isEdit).toBe(true);
(select('#'+gridObj.element.id+'_update', gridObj.element) as any).click();
expect(gridObj.isEdit).toBe(false);
expect((gridObj.editModule as any).editModule.isAdded).toBe(false);
        });

        it('add and focus out', function () {
            (select('#'+gridObj.element.id+'_add', gridObj.element) as any).click();
            gridObj.element.click()
            expect(document.querySelectorAll('.e-griderror').length).toBe(1);
            (select('#'+gridObj.element.id+'CustomerID', gridObj.element) as any).value ='test';
            gridObj.element.click()
            expect(document.querySelectorAll('.e-griderror').length).toBe(1);
gridObj.element.click()
expect(document.querySelectorAll('.e-griderror').length).toBe(1);
(select('#'+gridObj.element.id+'ShipRegion', gridObj.element) as any).value ='test';
expect(gridObj.isEdit).toBe(true);
gridObj.element.click()
expect(gridObj.isEdit).toBe(false);
//datasource .engt +1                
expect((gridObj.editModule as any).editModule.isAdded).toBe(false);
        });

        it('add and delete', function () {
            (select('#'+gridObj.element.id+'_add', gridObj.element) as any).click();
            gridObj.element.click()
            expect(document.querySelectorAll('.e-griderror').length).toBe(1);
            (select('#'+gridObj.element.id+'_delete', gridObj.element) as any).click();
            expect(document.querySelectorAll('.e-griderror').length).toBe(0);          
            expect((gridObj.editModule as any).editModule.isAdded).toBe(false);
        });

        it('add and cancel', function () {
            (select('#'+gridObj.element.id+'_add', gridObj.element) as any).click();
            gridObj.element.click()
            expect(document.querySelectorAll('.e-griderror').length).toBe(1);
            gridObj.editModule.closeEdit();     
        });

        
        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('Tab key to add new row , allowNextRowEdit property ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        let actionComplete: () => void;
        let cell: HTMLElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: batchData,
                    allowFiltering: false,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
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
                }, done);
        });

    it('tab key - allowNextRowEdit as true,', () => {
        gridObj.editSettings.allowNextRowEdit = true;
        (gridObj.editModule as any).editModule.editCell(2, 'OrderDate');
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'CustomerID');
        expect(gridObj.isEdit).toBeTruthy();
        expect(gridObj.selectedRowIndex).toBe(3);
        expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
        expect(gridObj.element.querySelectorAll('form').length).toBe(1);
    });

    it('shiftTab key - allowNextRowEdit as true', () => {
        (gridObj.editModule as any).editModule.editCell(9, 'CustomerID');
        gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        expect(gridObj.isEdit).toBeTruthy();
        expect(gridObj.selectedRowIndex).toBe(8);
        expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'OrderDate');
        expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
        expect(gridObj.element.querySelectorAll('form').length).toBe(1);
    });

    it('tab key - allowNextRowEdit as false,', () => {
        gridObj.editSettings.allowNextRowEdit = false;
        (gridObj.editModule as any).editModule.editCell(2, 'OrderDate');
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        expect(gridObj.isEdit).toBeTruthy();
        expect(gridObj.selectedRowIndex).toBe(3);
        expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
        expect(gridObj.element.querySelectorAll('form').length).toBe(1);
    });

    it('shiftTab key - allowNextRowEdit as false,', () => {
        (gridObj.editModule as any).editModule.editCell(2, 'CustomerID');
        gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        expect(gridObj.isEdit).toBeTruthy();
        expect(gridObj.selectedRowIndex).toBe(1);
        expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
        expect(gridObj.element.querySelectorAll('form').length).toBe(1);
    });

    it('tab key & shifttab key - check editing', function () {
        (gridObj.editModule as any).editModule.editCell(9, 'CustomerID');
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-focus') } as any);                
        expect(gridObj.isEdit).toBeTruthy();
        expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
        expect(gridObj.element.querySelectorAll('form').length).toBe(1);
        gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-focus') } as any);                
        expect(gridObj.isEdit).toBeTruthy();
        expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
        expect(gridObj.element.querySelectorAll('form').length).toBe(1);
    });


    it('tab key - add new row with last row, cell focused state', () => {
        let tr = gridObj.getContent().querySelectorAll('tr')[10];
        cell = tr.cells[tr.cells.length - 1];
        cell.click();
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
        expect(gridObj.isEdit).toBeTruthy();
        expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
        expect(gridObj.getContent().querySelectorAll('tr').length).toBe(12);
    });
    
    it('tab key - add new row with lastpreviousRow, edit state', () => {
        (gridObj.editModule as any).editModule.editCell(10, 'OrderDate');
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        expect(gridObj.isEdit).toBeTruthy();
        expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
        expect(gridObj.element.querySelectorAll('form').length).toBe(1);
        expect(gridObj.getContent().querySelectorAll('tr').length).toBe(12);
    });

    it('tab key - add new row with last row, edit state', () => {
        (gridObj.editModule as any).editModule.editCell(10, 'OrderDate');
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        expect(gridObj.isEdit).toBeTruthy();
        expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'CustomerID');
        expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
        expect(gridObj.element.querySelectorAll('form').length).toBe(1);
        expect(gridObj.getContent().querySelectorAll('tr').length).toBe(12);
    });

    afterAll(() => {
        gridObj.notify('tooltip-destroy', {});
        destroy(gridObj);
        gridObj = actionBegin = actionComplete = cell = preventDefault = null;
    });
});


});

describe('Action Complete in batch edit => ', () => {
    let gridObj: Grid;
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
        gridObj = actionComplete = null;
    });
});

describe('EJ2-22814- Programatic delete not working => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'EmployeeID', type: 'number', allowEditing: false },
                    { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                    { field: 'ShipCity' },
                ]
            }, done);
    });

    it('delete record by method', () => {
        gridObj.editModule.deleteRecord('OrderID', gridObj.currentViewData[2]);
        expect(gridObj.getContent().querySelectorAll('.e-row')[2].classList.contains('e-hiddenrow')).toBeTruthy();
        expect(gridObj.getContent().querySelectorAll('.e-row')[3].classList.contains('e-hiddenrow')).toBeFalsy();
    });

    it('delete record by selecting a row and then invoking deleteRecord method', () => {
        gridObj.clearSelection();
        gridObj.selectRow(0);
        gridObj.editModule.deleteRecord();
        expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeTruthy();
        expect(gridObj.getContent().querySelectorAll('.e-row')[1].classList.contains('e-hiddenrow')).toBeFalsy();
        expect(gridObj.getSelectedRowIndexes()[0]).toEqual(0);
    });

    afterAll(() => {
        gridObj.notify('tooltip-destroy', {});
        destroy(gridObj);
    });
});

describe('EJ2-22944-script error thrown while valiation in batch edit, EJ2-23545 => ', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                editSettings: {
                    allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', newRowPosition:'Bottom'
                },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                allowPaging: true,
                columns: [
                    { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                    { field: 'CustomerID', type: 'string', validationRules: { required: true }  },
                    { field: 'EmployeeID', type: 'number', allowEditing: false },
                    { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit'
                    ,validationRules: { required: true, min: 10, max: 1200 } },
                    { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                ]
            }, done);
    });
    it('edit cell', (done: Function) => {
        let cellEdit = (args?: any): void => {
            expect(gridObj.isEdit).toBeFalsy();
            gridObj.cellEdit = null;
            done();
        };
        gridObj.cellEdit = cellEdit;
        gridObj.editModule.editCell(1, 'CustomerID');
    });

    it('Checking Validation with NewRowPosition as Bottom', () => {
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = '';
        expect(gridObj.editModule.editFormValidate()).toBeFalsy();
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
        expect(gridObj.editModule.editFormValidate()).toBeTruthy();
    });    

    it('EJ2-23545 - edit cell- Freight with min and max validation', (done: Function) => {
        let cellEdit = (args?: any): void => {
            expect(gridObj.isEdit).toBeFalsy();
            gridObj.cellEdit = null;
            done();
        };
        gridObj.cellEdit = cellEdit;
        gridObj.editModule.editCell(1, 'Freight');
    });

    it('EJ2-23545 -cell edit complete', (done: Function) => {
        let cellSave = (args?: any): void => {
            expect(gridObj.isEdit).toBeTruthy();
            gridObj.cellSave = null;
            done();
        };
        gridObj.cellSave = cellSave;
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = '1000';
        gridObj.editModule.saveCell();
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
        gridObj.notify('tooltip-destroy', {});
        destroy(gridObj);
    });
});

describe('EJ2-35868-script error thrown while adding bottom rows after batch delete,', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0,5),
                selectionSettings: { type: "Multiple" },
                editSettings: {
                    allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', newRowPosition:'Bottom'
                },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                allowPaging: true,
                columns: [
                    { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                    { field: 'CustomerID', type: 'string', validationRules: { required: true }  },
                    { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                ]
            }, done);
    });
    it('delete rows', (done: Function) => {
        gridObj.clearSelection();
        gridObj.selectRows([0,1,2]);
        gridObj.deleteRecord();
        gridObj.addRecord();
        expect(gridObj.getSelectedRowIndexes()[0]).toBe(2);
        done();
    });

    afterAll(() => {
        gridObj.notify('tooltip-destroy', {});
        destroy(gridObj);
    });
});

describe('EJ2-852976 - Disabling First Field with allowEditing False Does not Prevent Input in New Rows,', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0,5),
                editSettings: {
                    allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch'
                },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'CustomerID', type: 'string', allowEditing: false, width: 120  },
                    { field: 'OrderID', type: 'number', isPrimaryKey: true, validationRules: { required: true }, width: 120 },
                    { field: 'ShipCountry', type: 'string', editType: 'dropdownedit', width: 120 },
                    { field: 'Verified', type: 'boolean', editType: 'booleanedit', width: 120 },
                ]
            }, done);
    });
    it('add row', (done: Function) => {
        let batchAdd = (args?: any): void => {
            expect(args.cell.getAttribute('data-colindex')).toBe('1');            
            done();
        };
        gridObj.batchAdd = batchAdd;
        gridObj.addRecord();
    });

    afterAll(() => {
        gridObj.batchAdd = null;
        destroy(gridObj);
    });
});

describe('EJ2-36298 - Delete with persist selection => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog :false },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'EmployeeID', type: 'number', allowEditing: false },
                    { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                    { field: 'ShipCity' },
                ],
            }, done);
    });

    it('delete record by method', (done: Function) => {
        let actionComplete = (args?: any): void => {
            if(args.requestType == 'batchsave'){
                expect(firstPrimary).not.toEqual(gridObj.currentViewData[0]["OrderID"]);
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        let firstPrimary: number = gridObj.currentViewData[0]["OrderID"];
        gridObj.editModule.deleteRecord('OrderID', gridObj.currentViewData[0]);
        gridObj.editModule.batchSave();
    });

    afterAll(() => {
        gridObj.actionComplete = null;
        gridObj.notify('tooltip-destroy', {});
        destroy(gridObj);
    });
});

describe('Batch editing render with Freeze => ', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                frozenColumns: 1,
                editSettings: {
                    allowEditing: true, allowAdding: true, allowDeleting: true,
                    mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false
                },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', type: 'number', isPrimaryKey: true },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                    { field: 'ShipCity' }
                ]
            }, done);
    });

    it('tab key with frozen columns', (done: Function) => {
        gridObj.addRecord();
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        expect(gridObj.focusModule.currentInfo.element.getAttribute('data-colindex')).toBe("1");
        done();
    });

    afterAll(() => {
        gridObj.notify('tooltip-destroy', {});
        destroy(gridObj);
        gridObj = null;
    });
});

describe('numeric text box validating minimum and maximum value', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowSelection: true,
                allowPaging: true,
                pageSettings: { pageSize: 6 },
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                columns: [
                    { field: 'OrderID', width: 120, textAlign: 'Right', headerText: 'Order ID' },
                    { field: 'CustomerID', width: 120, headerText: 'Customer ID' },
                    {
                        field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit',
                        width: 120, format: 'C2', validationRules: { required: true },
                        edit: { params: { min: 10, max: 20 } }
                    }
                ],
            }, done);
    });
    it('checking with freight max value', () => {
        (gridObj.editModule as any).editModule.editCell(0, 'Freight');
        let val: number = (gridObj.element.querySelector('.e-editedbatchcell .e-input') as any).ej2_instances[0].value;
        expect(val).toBe(20);
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-36298 - validation rules for columns => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog :false, newRowPosition:'Bottom' },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                    { field: 'CustomerID', type: 'string',validationRules: { required: true } },
                    { field: 'EmployeeID', type: 'number', allowEditing: false },
                    { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                    { field: 'ShipCity' },
                ],
            }, done);
    });
    it('add and delete', function () {
        (select('#'+gridObj.element.id+'_add', gridObj.element) as any).click();
        gridObj.element.click()
        expect(document.querySelectorAll('.e-griderror').length).toBe(1);
    });
    afterAll(() => {
        gridObj.notify('tooltip-destroy', {});
        destroy(gridObj);
    });
});

describe('EJ2-37034 - batch edit creates new record after add a record and tab from the last row=> ', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    let cell: HTMLElement;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                pageSettings: { pageCount: 5, pageSize:5 },
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch',newRowPosition:'Top' },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', width: 120 },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 140 },
                    { field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit', width: 120, format: 'C2' },
                    { field: 'OrderDate', headerText: 'Order Date', editType: 'datepickeredit', format: 'yMd', width: 170 },
                    { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150, edit: { params: { popupHeight: '300px' } } }
                ],
            }, done);
    });
    it('add and delete', function () {
        (select('#'+gridObj.element.id+'_add', gridObj.element) as any).click();
        let tr = gridObj.getContent().querySelectorAll('tr')[5];
        cell = tr.cells[tr.cells.length - 1];
        cell.click();
        gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: cell } as any);
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
        expect(gridObj.isEdit).toBeTruthy();
        expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
        expect(gridObj.getContent().querySelectorAll('tr').length).toBe(7);  
    });
    afterAll(() => {
        gridObj.notify('tooltip-destroy', {});
        destroy(gridObj);
    });
});

describe('EJ2-37546 - While saving the null values numeric type column stores as NaN => ', () => {
    let gridObj: Grid;
    let queryCellInfo: () => void;
    let flag: boolean = false;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                pageSettings: { pageCount: 5, pageSize:5 },
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch',newRowPosition:'Top' },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', width: 120 },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 140 },
                    { field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit', width: 120, format: 'C2' },
                    { field: 'OrderDate', headerText: 'Order Date', editType: 'datepickeredit', format: 'yMd', width: 170 },
                    { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150, edit: { params: { popupHeight: '300px' } } }
                ],
            }, done);
    });
    it('editing the number column with null', function (done: Function) {
        queryCellInfo = (args?: any): void => {
            if(flag){
                expect(args.data["Freight"]).toBe(null);
                flag = false;
                done();
            }
        };
        gridObj.queryCellInfo = queryCellInfo;
        flag = true;
        gridObj.updateCell(0, 'Freight', null);
    });
    afterAll(() => {
        gridObj.notify('tooltip-destroy', {});
        destroy(gridObj);
        queryCellInfo =null;
    });
});
describe('EJ2-36945- pressing tab key in batch edit does not save the cell', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog :false, newRowPosition:'Bottom' },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                    { field: 'CustomerID', type: 'string',validationRules: { required: true } },
                    { field: 'EmployeeID', type: 'number', allowEditing: false },
                    { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                    { field: 'ShipCity' },
                ],
            }, done);
    });
    it('edit cell', (done: Function) => {
        let cellEdit = (args?: any): void => {
            expect(gridObj.isEdit).toBeFalsy();
            gridObj.cellEdit = null;
            done();
        };
        gridObj.cellEdit = cellEdit;
        gridObj.editModule.editCell(0, 'CustomerID');
    });

    it('tab key', () => {
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBe(1);
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null ;
    });
});


describe('EJ2-37578 - [ObjectObject] while editing the fields  that are undefined=> ', () => {
    let gridObj: Grid;
    let newData: Object[] = [{
        OrderID: 10248, Freight: 32.38, Verified: !0
    },
    {
        OrderID: 10249, CustomerID: 'VICTE', Freight: 11.61, Verified: !1
    }]
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: newData,
                allowPaging: true,
                pageSettings: { pageCount: 5, pageSize:5 },
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', width: 120 },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 140 },
                    { field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit', width: 120, format: 'C2' }
                ],
            }, done);
    });
    it('cell edit', function (done: Function) {
        let cellSave = (args?: any): void => {
            if(args.columnName == "CustomerID"){
            expect(args.value).toBe(undefined);
            gridObj.cellSave = null;
            done();
            }
        };
        gridObj.cellSave = cellSave; 
        gridObj.editCell(0, "CustomerID");
        gridObj.editCell(0, "Freight");
    });
    afterAll(() => {
        gridObj.notify('tooltip-destroy', {});
        destroy(gridObj);
    });
});

describe('adding rows in empty grid through edit cell and press enter in batch edit ', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0,0),
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch'},
                columns: [
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' }],
                allowPaging: true,
                pageSettings: { pageSize: 8, pageCount: 4, currentPage: 1 },
                allowSelection: true,
            }, done);
    });

    it('pressing enter after editcell', (done: Function) => {
        let cellEdit = (args?: any): void =>{
        let cell = gridObj.element.querySelectorAll('.e-rowcell')[1]
        gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: cell } as any);
        done();
        }
        gridObj.cellEdit = cellEdit;
        gridObj.addRecord({OrderID:1, CustomerID:''});
        gridObj.addRecord({OrderID:2, CustomerID:''});
        gridObj.editCell(0,'CustomerID');
        
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null ;
    });

    describe('EJ2-39071- Unnecessary to include an Empty row in Grid when inserted a row with Frozen Column', () => {
        let gridObj: Grid;
        let elem: HTMLElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                    allowPaging: true,
                    frozenColumns:2,        
                    pageSettings: { pageCount: 5 },
                    toolbar: ['Add',  'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string',validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                    ]
                }, done);
        });
        it('Disable altrow', (done: Function) => {
            let dataBound = (args: Object) => {
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.refreshColumns();
        });
        it('Add start', (done: Function) => {
            let batchAdd = (args?: any): void => {
                expect(elem.children.length).toBe(1);
                gridObj.batchAdd = null;
                done();
            };
            gridObj.batchAdd = batchAdd;
            elem = gridObj.getContent().querySelector('tbody');
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
           
        });
        it('check item in pages', () => {
            expect((gridObj.element.querySelector('.e-pagecountmsg') as HTMLElement).innerText).toBe("(0 item)");
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = elem = null ;
        });
    });

    //  describe('EJ2-39517- Border Misalignment issue with Frozen Columns in Grid in batch edit', () => {
    //     let gridObj: Grid;
    //     let fElem: HTMLElement;
    //     let mElem: HTMLElement;
    //     beforeAll((done: Function) => {
    //         gridObj = createGrid(
    //             {
    //                 dataSource: data.slice(0,7),
    //                 editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
    //                 allowPaging: true,
    //                 frozenColumns:2,        
    //                 pageSettings: { pageCount: 5 },
    //                 toolbar: ['Add',  'Delete', 'Update', 'Cancel'],
    //                 columns: [
    //                     { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
    //                     { field: 'CustomerID', type: 'string',validationRules: { required: true } },
    //                     { field: 'EmployeeID', type: 'number', allowEditing: false },
    //                     { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
    //                 ]
    //             }, done);
    //     });
    //     it('Check Frozen-Content Height', (done: Function) => {
    //         let batchDelete = (args?: any): void => {
    //             expect(fElem.offsetHeight).toBe(Math.floor(mElem.offsetHeight));
    //             gridObj.batchDelete = null;
    //             done();
    //         };
    //         gridObj.batchDelete = batchDelete;
    //         mElem = gridObj.getContent().querySelector('.e-movablecontent').querySelector('tbody');
    //         fElem = gridObj.getContent().querySelector('.e-frozencontent'); 
    //         gridObj.deleteRow(gridObj.getContent().querySelectorAll('.e-row')[2] as any);
           
    //     });
    //     afterAll(() => {
    //         destroy(gridObj);
    //         gridObj = fElem = mElem = null ;
    //     });
    // });
    
});

describe('EJ2-39455- Cell editing is not working properly in last batch added row by tab key', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                height: 410,
                frozenColumns: 1,
                frozenRows: 2,
                editSettings: {
                    allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', newRowPosition: 'Bottom'
                },
                pageSettings: { pageCount: 5 },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'EmployeeID', type: 'number'},
                    { field: 'Freight', type: 'number' },
                    { field: 'ShipCity', type: 'string' },
                    { field: 'ShipName', isIdentity: true },
                    { field: 'ShipCountry', type: 'string' },
                ],
            }, done);
    });
    it('Check the Movable insertrow cells text', () => {
        let cell: HTMLElement= gridObj.getContent().querySelectorAll('.e-row')[9].childNodes[6] as any;
        cell.click();
        gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: cell } as any);
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = '10560';
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'JHON';
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = '7';
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = '5.3';
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'Newyork';
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'America';
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'U.S';
        gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        let mText: any = gridObj.getContent().querySelector('.e-insertedrow');
        expect(mText.cells[1].innerText).toBe('JHON');
        expect(mText.cells[2].innerText).toBe('7');
        expect(mText.cells[3].innerText).toBe('5.3');
        expect(mText.cells[4].innerText).toBe('Newyork');
        expect(mText.cells[5].innerText).toBe('America');
        expect(mText.cells[6].innerText).toBe('U.S');
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-40007- cell did not save the empty value for complex field', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    let localdata: Object[] = [
        {
          "OrderID":10248,
          "ShipCity":"VINET",
          "Ship": {
            "Freight": "32.38",
          }
        }
      ];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: localdata,
                allowPaging: true,
                editSettings : { allowEditing: true, allowAdding: true, allowDeleting: true , newRowPosition: 'Top', mode: "Batch" },
                toolbar : ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    { field: 'ShipCity', headerText: 'Ship City', width: 150 },
                    { field: 'Ship.Freight', headerText: 'Freight', width: 120, textAlign: 'Right' },
                ]
            }, done);
    });
    it('Check cell value', () => {
        let cell: HTMLElement = gridObj.element.querySelector('.e-content').querySelector('table').rows[0].childNodes[2] as any;
        cell.click();
        gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: cell } as any);
        (gridObj.element.querySelectorAll('.e-valid-input')[0].querySelector('.e-input') as any).value = '';
        gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: cell } as any);
        expect(cell.innerText).toBe('');
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = localdata = null ;
    });
});

describe('EJ2-41463-Column resize icon not displayed after double-clicking the primary key cell', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                allowResizing: true,
                editSettings : { allowEditing: true, allowAdding: true, allowDeleting: true , mode: "Batch" },
                toolbar : ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', headerText: 'Order ID',isPrimaryKey: true , width: 120, textAlign: 'Right' },
                    { field: 'EmployeeID', type: 'number', allowEditing: false},
                    { field: 'Freight', type: 'number' },
                    { field: 'ShipCity', type: 'string' },
                ]
            }, done);
    });
    it('editing the primary key cell', () => {
        gridObj.editCell(0,'OrderID');
        expect((gridObj.element as any).classList.contains('e-editing')).toBeFalsy();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-42099-The decimal values are not pasted properly in number column', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                editSettings : { allowEditing: true, allowAdding: true, allowDeleting: true , mode: "Batch" },
                toolbar : ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                selectionSettings: { type: 'Multiple', mode: 'Cell', cellSelectionMode: 'Box' },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID',isPrimaryKey: true , width: 120, textAlign: 'Right' },
                    { field: 'EmployeeID', headerText:'Employee ID', type: 'number' },
                    { field: 'Freight', headerText: 'Freight', editType: 'numericedit', width: 120, format: 'N4', type: 'number' },
                ]
            }, done);
    });
    it('check number column decimal value after editing', () => {
        gridObj.clipboardModule.paste('22.4567', 0, 2);
        let updateElem: HTMLElement = gridObj.element.querySelector('.e-content').querySelector('table').rows[0].childNodes[2] as any;
        expect(updateElem.innerHTML).toBe('22.4567');
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-41938-Auto-fill functionality not working properly with frozen columns', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0, 5),
                frozenColumns: 2,
                editSettings : { allowEditing: true, allowAdding: true, allowDeleting: true , mode: "Batch" },
                toolbar : ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right', minWidth: 10, isPrimaryKey: true },
                    { field: 'Freight', width: 125, format: 'C2', minWidth: 10 },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 130, minWidth: 10 },
                    { field: 'ShipCity', headerText: 'Ship City', width: 250, minWidth: 10, allowEditing: false },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 250, minWidth: 10 }
                ]
            }, done);
    });
    it('EJ2-49283 - columns.allowEditing property is not working properly when enable AutoFill ', () => {
        gridObj.editModule.updateCell(0, 'ShipCity', 'updated');
        expect((gridObj as any).contentModule.getRows()[0].changes).toBeUndefined();
    });
    it('Check the updatecell value', () => {
        (select('#'+gridObj.element.id+'_add', gridObj.element) as any).click();
        gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
        expect((gridObj as any).contentModule.getRows()[0].changes.CustomerID).toBe('updated');
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-42118-recordclick event arguments check', () => {
    let gridObj: Grid;
    let recordClick:() => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                editSettings : { allowEditing: true, allowAdding: true, allowDeleting: true , mode: "Batch" },
                toolbar : ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                selectionSettings: { type: 'Multiple', mode: 'Cell', cellSelectionMode: 'Box' },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID',isPrimaryKey: true , width: 120, textAlign: 'Right' },
                    { field: 'EmployeeID', headerText:'Employee ID', type: 'number' },
                    { field: 'Freight', headerText: 'Freight', editType: 'numericedit', width: 120, format: 'N4', type: 'number' },
                ],
            }, done);
    });
    it('check recordclick argument after edit state', () => {
        recordClick = (args?: any): void => {
            expect(args.cell).toBeDefined();
            expect(args.cellIndex).toBeDefined();
            expect(args.row).toBeDefined();
            expect(args.rowIndex).toBeDefined();
            expect(args.rowData).toBeDefined();
        }
        gridObj.recordClick = recordClick;
        gridObj.editModule.editCell(2,"Freight");
        (gridObj.element.querySelector('.e-row:nth-child(2)').querySelector('.e-rowcell') as any).click();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-42197 - Delete action was not working properly in checkbox selection', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                editSettings : { allowEditing: true, allowAdding: true, allowDeleting: true, mode: "Batch" },
                toolbar : ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { type:'checkbox', width:50 },
                    { field: 'OrderID', headerText: 'Order ID',isPrimaryKey: true , width: 120, textAlign: 'Right' },
                    { field: 'EmployeeID', type: 'number', allowEditing: false },
                    { field: 'Freight', type: 'number', defaultValue: null },
                    { field: 'ShipCity', type: 'string' },
                ]
            }, done);
    });
    it('check selection', () => {
        gridObj.selectRow(2);
        (select('#'+gridObj.element.id+'_delete', gridObj.element) as any).click();
        expect(gridObj.getSelectedRecords().length).toBe(0);
    });
    it('EJ2-49265 - Default value as null is not working for the number type column', (done: Function) => {
        let beforeBatchAdd = (args?: any): void => {
            expect(args.defaultData["Freight"]).toBeNull();
            gridObj.beforeBatchAdd = null;
            done();
        };
        gridObj.beforeBatchAdd = beforeBatchAdd;
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
    });
    it('code coverage improvement', () => {
        let checkAll: Element = gridObj.element.querySelector('.e-checkselectall').parentElement;
        checkAll.classList.add('e-checkbox-disabled');
        (gridObj.editModule as any).editModule.batchSave();
        expect(checkAll.classList.contains('e-checkbox-disabled')).toBeFalsy();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-49067 - Batch changes with date column without changing the value', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: "Batch", showConfirmDialog: false },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 120, textAlign: 'Right' },
                    { field: 'OrderDate', headerText: 'Order Date', type: 'date', format: 'yMd', editType: 'datepickeredit' }
                ]
            }, done);
    });
    it('check selection', (done: Function) => {
        let cellSaved = (args?: any): void => {
            expect(gridObj.getBatchChanges()['changedRecords'].length).toBe(0);
            gridObj.cellSave = null;
            done();
        };
        gridObj.editCell(1, 'OrderDate');
        gridObj.cellSaved = cellSaved;
        gridObj.endEdit();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-57804 - Need to consider validation when multiple records are added in batch edit mode => ', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Batch'},
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', {
                    text: 'Add 5 Rows',
                    tooltipText: 'Add 5 Rows',
                    prefixIcon: 'e-add',
                    id: 'add5Rows',
                }],
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120, validationRules: { required: true, number: true } },
                    { field: 'Freight', headerText: 'Freight', width: 150, format: 'C2', validationRules: { required: true }},// minValue: 50, maxValue: 200
                    { field: 'CustomerID', headerText: 'Customer ID', width: 150, validationRules: {minLength: 3} },// , validationRules: { required: true }
                    { field: 'OrderDate', headerText: 'Order Date', width: 120, format: {type: 'datetime', format: 'y/M/d hh:mm a'}, validationRules: { required: true, date: true }, editType: "dateTimePickerEdit" },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 150, validationRules: { required: true, minLength: 3 } }
                ],
                height: 290,
            }, done);
    });

    it('toolbar click action', () => {
        gridObj.toolbarClick = toolbarClick;
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: 'add5Rows' } });
        function toolbarClick(args: any): void {
            var nextNumber = 10260;
            if (gridObj && args.item.id.includes('add5Rows')) {
                for (let i = 0; i < 5; i++) {
                    if(i==0){
                        this.addRecord({ });
                    }
                    else if(i==1) {
                        this.addRecord({ OrderID: nextNumber, Freight: 20.22, OrderDate: '2022/4/14', ShipCountry: 'India' });
                    }
                    else if(i==4){
                        this.addRecord({ OrderID: nextNumber, OrderDate: 'hgf' });
                    }
                    else if(i==3){
                        this.addRecord({ ShipCountry: 'India'  });
                    }
                    else{
                        this.addRecord({  });
                    }
                    nextNumber = parseInt(nextNumber.toString()) + 1;
                }
            }
        }
    });

    it('check multiple row adding', () => {
        var rowLength = gridObj.element.querySelectorAll('.e-insertedrow').length;
        expect(rowLength).toBe(5);
        var row = gridObj.element.querySelectorAll('.e-insertedrow')[0];
        expect(row.classList.contains('e-editedrow')).toBe(false);
    });

    it('update click action', () => {
        select('#' + gridObj.element.id + '_update', gridObj.toolbarModule.getToolbar()).click();
    });

    it('check validation for multiple row adding when update', () => {
        var row = gridObj.element.querySelectorAll('.e-insertedrow')[0];
        expect(row.classList.contains('e-editedrow')).toBe(true);
        var cell = row.querySelectorAll('td')[1];
        expect(cell.classList.contains('e-editedbatchcell')).toBe(true);
        var validation = row.querySelectorAll('.e-formvalidator')[0];
        expect(validation).toBeDefined();
    });

    it('escape keyboard action', () => {
        gridObj.keyboardModule.keyAction({ action: 'escape', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
    });

    it('check escape validation when adding rows', () => {
        var row = gridObj.element.querySelectorAll('.e-insertedrow')[0];
        expect(row.classList.contains('e-editedrow')).toBe(true);
        var cell = row.querySelectorAll('td')[1];
        expect(cell.classList.contains('e-editedbatchcell')).toBe(true);
        var validation = row.querySelectorAll('.e-formvalidator')[0];
        expect(validation).toBeDefined();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null; 
    });
});

describe('EJ2-59995 - Frozen Grid Batch editing Bulk Validation and script error throw while validation => ', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Batch'},
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', {
                    text: 'Add 5 Rows',
                    tooltipText: 'Add 5 Rows',
                    prefixIcon: 'e-add',
                    id: 'add5Rows',
                }],
                columns: [
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 150, validationRules: { required: true, minLength: 3 }, freeze: "Right" },
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120, validationRules: { required: true, number: true } },
                    { field: 'Freight', headerText: 'Freight', width: 150, format: 'C2', validationRules: { required: true }},
                    { field: 'CustomerID', headerText: 'Customer ID', width: 150, validationRules: {minLength: 3} },
                    { field: 'OrderDate', headerText: 'Order Date', width: 120, format: {type: 'datetime', format: 'y/M/d hh:mm a'}, validationRules: { required: true, date: true }, editType: "dateTimePickerEdit" },
                ],
                height: 290,
            }, done);
    });

    it('toolbar click action', () => {
        gridObj.toolbarClick = toolbarClick;
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: 'add5Rows' } });
        function toolbarClick(args: any): void {
            var nextNumber = 10260;
            if (gridObj && args.item.id.includes('add5Rows')) {
                for (let i = 0; i < 5; i++) {
                    if(i==0){
                        this.addRecord({ });
                    }
                    else if(i==1) {
                        this.addRecord({ OrderID: nextNumber, Freight: 20.22, OrderDate: '2022/4/14', ShipCountry: 'India' });
                    }
                    else if(i==4){
                        this.addRecord({ OrderID: nextNumber, Freight: 20.22, OrderDate: '2022/4/14' });
                    }
                    else if(i==3){
                        this.addRecord({ ShipCountry: 'India'  });
                    }
                    else{
                        this.addRecord({  });
                    }
                    nextNumber = parseInt(nextNumber.toString()) + 1;
                }
            }
        }
    });

    it('check multiple row adding', () => {
        var rowLength = gridObj.element.querySelectorAll('.e-insertedrow').length;
        expect(rowLength).toBe(5);
        var row = gridObj.element.querySelectorAll('.e-insertedrow')[0];
        expect(row.classList.contains('e-editedrow')).toBe(false);
    });

    it('update click action', () => {
        select('#' + gridObj.element.id + '_update', gridObj.toolbarModule.getToolbar()).click();
    });

    it('check validation for multiple row adding when update', () => {
        var row = gridObj.element.querySelectorAll('.e-insertedrow')[0];
        expect(row.classList.contains('e-editedrow')).toBe(true);
        var cell = row.querySelectorAll('td')[4];
        expect(cell.classList.contains('e-editedbatchcell')).toBe(true);
        var validation = row.querySelectorAll('.e-formvalidator')[0];
        expect(validation).toBeDefined();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null; 
    });
});

describe('EJ2-61565-Custom commands inside command column disappear on back tab with batch editing', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                allowResizing: true,
                editSettings : { allowEditing: true, allowAdding: true, allowDeleting: true , mode: "Batch" },
                toolbar : ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', headerText: 'Order ID',isPrimaryKey: true , width: 120, textAlign: 'Right' },
                    { field: 'EmployeeID', type: 'number', allowEditing: false},
                    { field: 'Freight', type: 'number' },
                    { headerText: 'Commands', width: 120, commands: [{ buttonOption: { content: 'Details', cssClass: 'e-flat' } }]}
                ],
                commandClick: (args: any) => {
                    alert(JSON.stringify(args.rowData));
                }
            }, done);
    });
    it('editing the Command Column cell', () => {
        gridObj.editCell(0,undefined);
        expect((gridObj.element as any).classList.contains('e-editing')).toBeFalsy();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-63046-Script error while batch adding if the primary key column is hidden and other columns are templates', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: employeeData,
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', newRowPosition: 'Top' },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel', 'Save'],
                columns: [
                    {
                        field: 'EmployeeID',
                        isPrimaryKey: true,
                        visible: false,
                        type: "number",
                    },
                    {
                        field: 'FirstName',
                        type: "string",
                        template: '${FirstName} - 1',
                        validationRules: { required: true },
                    },
                    {
                        field: 'Address',
                        type: "string",
                        template: '${Address} - 1',
                        validationRules: { required: true },
                    },
                ],
            }, done);
    });
    it('click add action', () => {
        expect(gridObj.isEdit).toBeFalsy();
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
    });

    it('check the focus', () => {
        expect(gridObj.element.querySelector('.e-insertedrow.e-editedrow.e-batchrow')
        .querySelectorAll('td')[0].classList.contains("e-active")).toBe(true);
        expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
        expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
        expect(gridObj.element.querySelectorAll('form').length).toBe(1);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

// describe('EJ2-64778 - Skipping non editable batch edit cell in freeze left => ', () => {
//     let gridObj: Grid;
//     let preventDefault: Function = new Function();
//     let gridHeader: Element;
//     let gridContent: Element;
//     let tr: HTMLTableRowElement;
//     beforeAll((done: Function) => {
//         gridObj = createGrid(
//             {
//                 dataSource: data.slice(0, 4),
//                 frozenRows: 2,
//                 editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
//                 toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
//                 columns: [
//                     { field: 'OrderID', type: 'number', isPrimaryKey: true, freeze: 'Left' },
//                     { field: 'CustomerID', type: 'string', freeze: 'Left' },
//                     { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit', allowEditing: false },
//                     { field: 'ShipCity' }
//                 ]
//             }, done);
//     });

//     it('Focus on frozen left header cell by click', (done: Function) => {
//         gridHeader = gridObj.getHeaderContent().firstChild as Element;
//         gridContent = gridObj.getContent().firstChild as Element;
//         tr = gridHeader.querySelector('.e-frozen-left-header').querySelectorAll('tr')[1];
//         tr.cells[0].click();
//         done();
//     });

//     it('Batch edit focus on frozen left header cell by tab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Focus on freeze left header coverage by tab - 1', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Focus on freeze left header coverage by tab - 2', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Batch edit focus on movable header cell by tab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridHeader.querySelector('.e-movableheader').querySelectorAll('tr')[2];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Batch edit focus on frozen left content cell by tab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridContent.querySelector('.e-frozen-left-content').querySelectorAll('tr')[0];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Focus on freeze left content coverage by tab - 3', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Focus on freeze left content coverage by tab - 4', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Batch edit focus on movable content cell by tab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridContent.querySelector('.e-movablecontent').querySelectorAll('tr')[1];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Focus on freeze left content coverage by shiftTab - 1', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Focus on freeze left content coverage by shiftTab - 2', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Batch edit focus on frozen left content cell by shiftTab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridContent.querySelector('.e-frozen-left-content').querySelectorAll('tr')[0];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Batch edit focus on movable header cell by shiftTab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridHeader.querySelector('.e-movableheader').querySelectorAll('tr')[2];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Focus on freeze left header coverage by shiftTab - 3', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Focus on freeze left header coverage by shiftTab - 4', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Batch edit focus on frozen left header cell by shiftTab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridHeader.querySelector('.e-frozen-left-header').querySelectorAll('tr')[1];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Focus on movable header cell by shiftTab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         expect(gridObj.isEdit).toBeFalsy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBeNull();
//         done();
//     });

//     afterAll(() => {
//         destroy(gridObj);
//         gridObj = null;
//     });
// });

// describe('EJ2-64778 - Skipping non editable batch edit cell in freeze right => ', () => {
//     let gridObj: Grid;
//     let preventDefault: Function = new Function();
//     let gridHeader: Element;
//     let gridContent: Element;
//     let tr: HTMLTableRowElement;
//     beforeAll((done: Function) => {
//         gridObj = createGrid(
//             {
//                 dataSource: data.slice(0, 4),
//                 frozenRows: 2,
//                 editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
//                 toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
//                 columns: [
//                     { field: 'OrderID', type: 'number', isPrimaryKey: true, freeze: 'Right' },
//                     { field: 'CustomerID', type: 'string', freeze: 'Right' },
//                     { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit', allowEditing: false },
//                     { field: 'ShipCity' }
//                 ]
//             }, done);
//     });

//     it('Focus on movable header cell', (done: Function) => {
//         gridHeader = gridObj.getHeaderContent().firstChild as Element;
//         gridContent = gridObj.getContent().firstChild as Element;
//         tr = gridHeader.querySelector('.e-movableheader').querySelectorAll('tr')[1];
//         tr.cells[0].click();
//         done();
//     });

//     it('Batch edit focus on movable header cell by tab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Focus on freeze right header coverage by tab - 1', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Focus on freeze right header coverage by tab - 2', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Batch edit focus on frozen right header cell by tab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridHeader.querySelector('.e-frozen-right-header').querySelectorAll('tr')[2];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Batch edit focus on movable content cell by tab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridContent.querySelector('.e-movablecontent').querySelectorAll('tr')[0];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Focus on freeze right content coverage by tab - 3', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Focus on freeze right content coverage by tab - 4', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Batch edit focus on frozen right content cell by tab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridContent.querySelector('.e-frozen-right-content').querySelectorAll('tr')[1];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Focus on freeze right content coverage by shiftTab - 1', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Focus on freeze right content coverage by shiftTab - 2', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Batch edit focus on movable content cell by shiftTab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridContent.querySelector('.e-movablecontent').querySelectorAll('tr')[0];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Batch edit focus on frozen right header cell by shiftTab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridHeader.querySelector('.e-frozen-right-header').querySelectorAll('tr')[2];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Focus on freeze left header coverage by shiftTab - 3', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Focus on freeze left header coverage by shiftTab - 4', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Batch edit focus on movable header cell by shiftTab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridHeader.querySelector('.e-movableheader').querySelectorAll('tr')[1];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Focus on frozen right header cell by shiftTab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         expect(gridObj.isEdit).toBeFalsy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBeNull();
//         done();
//     });

//     afterAll(() => {
//         destroy(gridObj);
//         gridObj = null;
//     });
// });

// describe('EJ2-64778 - Skipping non editable batch edit cell in freeze left right => ', () => {
//     let gridObj: Grid;
//     let preventDefault: Function = new Function();
//     let gridHeader: Element;
//     let gridContent: Element;
//     let tr: HTMLTableRowElement;
//     beforeAll((done: Function) => {
//         gridObj = createGrid(
//             {
//                 dataSource: data.slice(0, 4),
//                 frozenRows: 2,
//                 editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
//                 toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
//                 columns: [
//                     { field: 'OrderID', type: 'number', isPrimaryKey: true, freeze: 'Left' },
//                     { field: 'CustomerID', type: 'string', freeze: 'Left' },
//                     { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit', allowEditing: false },
//                     { field: 'ShipCity', headerText: 'Ship City' },
//                     { field: 'ShipPostalCode', headerText: 'Ship Postal Code', freeze: 'Right', allowEditing: false },
//                     { field: 'ShipRegion', headerText: 'Ship Region', freeze: 'Right' },
//                 ]
//             }, done);
//     });

//     it('Focus on frozen left header cell', (done: Function) => {
//         gridHeader = gridObj.getHeaderContent().firstChild as Element;
//         gridContent = gridObj.getContent().firstChild as Element;
//         tr = gridHeader.querySelector('.e-frozen-left-header').querySelectorAll('tr')[1];
//         tr.cells[0].click();
//         done();
//     });

//     it('Batch edit focus on frozen left header cell by tab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Batch edit focus on movable header cell by tab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridHeader.querySelector('.e-movableheader').querySelectorAll('tr')[1];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Focus on freeze left-right content coverage by tab - 1', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Focus on freeze left-right content coverage by tab - 2', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Focus on freeze left-right content coverage by tab - 3', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Batch edit focus on frozen right header cell by tab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridHeader.querySelector('.e-frozen-right-header').querySelectorAll('tr')[2];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Batch edit focus on frozen left content cell by tab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridContent.querySelector('.e-frozen-left-content').querySelectorAll('tr')[0];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Batch edit focus on movable content cell by tab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridContent.querySelector('.e-movablecontent').querySelectorAll('tr')[0];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Focus on freeze left-right content coverage by tab - 3', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Focus on freeze left-right content coverage by tab - 4', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Focus on freeze left-right content coverage by tab - 5', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Batch edit focus on frozen right content cell by tab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridContent.querySelector('.e-frozen-right-content').querySelectorAll('tr')[1];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Focus on freeze left-right content coverage by shiftTab - 1', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Focus on freeze left-right content coverage by shiftTab - 2', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Focus on freeze left-right content coverage by shiftTab - 3', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Batch edit focus on movable content cell by shiftTab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridContent.querySelector('.e-movablecontent').querySelectorAll('tr')[0];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Batch edit focus on frozen left content cell by shiftTab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridContent.querySelector('.e-frozen-left-content').querySelectorAll('tr')[0];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Batch edit focus on frozen right header cell by shiftTab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridHeader.querySelector('.e-frozen-right-header').querySelectorAll('tr')[2];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Focus on freeze left-right content coverage by shiftTab - 4', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Focus on freeze left-right content coverage by shiftTab - 5', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Focus on freeze left-right content coverage by shiftTab - 6', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         done();
//     });

//     it('Batch edit focus on movable header cell by shiftTab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridHeader.querySelector('.e-movableheader').querySelectorAll('tr')[1];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Batch edit focus on frozen left header cell by shiftTab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         tr = gridHeader.querySelector('.e-frozen-left-header').querySelectorAll('tr')[1];
//         expect(gridObj.isEdit).toBeTruthy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(tr.cells[1]);
//         done();
//     });

//     it('Focus on frozen right header cell by shiftTab', (done: Function) => {
//         gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: document.activeElement } as any);
//         expect(gridObj.isEdit).toBeFalsy();
//         expect(gridObj.element.querySelector('.e-editedbatchcell')).toBeNull();
//         done();
//     });

//     afterAll(() => {
//         destroy(gridObj);
//         gridObj = null;
//     });
// });

describe('EJ2-65238 - Show/hide column after batch editing confirm using cancel button', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                allowGrouping: true,
                dataSource: data,
                showColumnChooser: true,
                toolbar: ['Add', 'Delete', 'Update', 'Cancel', 'ColumnChooser'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: "Batch" },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right', minWidth: 10, isPrimaryKey: true },
                    { field: 'Freight', width: 125, format: 'C2', minWidth: 10 },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 130, minWidth: 10 },
                    { field: 'ShipCity', headerText: 'Ship City', width: 250, minWidth: 10, allowEditing: false },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 250, minWidth: 10 }
                ]
            }, done);
    });
    it('Batch- cancel', () => {
        gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
    });
    it('Column chooser - show column', () => {
        gridObj.hideColumns('Customer ID');
        expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
        selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[1].click();
        expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeFalsy();
        expect(gridObj.getVisibleColumns().length).toBe(5);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-65238 - Show/hide column after batch editing confirm using ok button', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                allowGrouping: true,
                dataSource: data,
                showColumnChooser: true,
                toolbar: ['Add', 'Delete', 'Update', 'Cancel', 'ColumnChooser'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: "Batch" },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right', minWidth: 10, isPrimaryKey: true },
                    { field: 'Freight', width: 125, format: 'C2', minWidth: 10 },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 130, minWidth: 10 },
                    { field: 'ShipCity', headerText: 'Ship City', width: 250, minWidth: 10, allowEditing: false },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 250, minWidth: 10 }
                ]
            }, done);
    });
    it('Batch- ok', () => {
        gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
    });
    it('Column chooser - hide column', () => {
        gridObj.hideColumns('Customer ID');
        expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
        selectAll('#' + gridObj.element.id + 'EditConfirm button', gridObj.element)[0].click();
        expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeFalsy();
        expect(gridObj.getVisibleColumns().length).toBe(4);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-66038 - Improper behavior in single batch edit cell column => ', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    let cell: HTMLElement;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0,3),
                editSettings: { allowEditing: true, allowDeleting: true, mode: 'Batch' },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                allowPaging: true,
                columns: [
                    { field: 'ShipCity' },
                ]
            }, done);
    });

    it('Edit frist row cell', () => {
        cell = gridObj.getContentTable().querySelector('tr').querySelector('td');
        cell.click();
        gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: cell } as any);
    });

    it('Navigate to second row cell', () => {
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
        const seccondRowCell: HTMLElement = gridObj.getContentTable().querySelectorAll('tr')[1].querySelector('td');
        expect(gridObj.element.querySelector('.e-editedbatchcell')).toBe(seccondRowCell);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-71160 - Code coverage for default edit cell file => ', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    let inputElement: HTMLInputElement;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowFiltering: false,
                allowGrouping: true,
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                allowPaging: false,
                columns: [
                    {
                        field: 'OrderID',
                        isPrimaryKey: true,
                        headerText: 'Order ID',
                        textAlign: 'Right',
                        validationRules: { required: true, number: true },
                        width: 120,
                      },
                      {
                        field: 'CustomerID',
                        headerText: 'Customer ID',
                        validationRules: { required: true },
                        width: 140,
                      },
                      {
                        field: 'Freight',
                        headerText: 'Freight',
                        textAlign: 'Right',
                        editType: 'numericedit',
                        width: 120,
                        format: 'C2',
                        validationRules: { required: true },
                      },
                      {
                        field: 'OrderDate',
                        headerText: 'Order Date',
                        editType: 'datepickeredit',
                        format: 'yMd',
                        width: 170,
                      },
                      {
                        field: 'ShipCountry',
                        headerText: 'Ship Country',
                        editType: 'dropdownedit',
                        width: 150,
                      },
                  ],
            }, done);
    });

    it('tab key action for text box cell batch editing and default edit cell file code coverage', () => {
        gridObj.editModule.editCell(1, 'CustomerID');
        inputElement = gridObj.element.querySelector('.e-editedbatchcell').querySelector('input');
        inputElement.value = 'updated';
        const defaultEditCell = new DefaultEditCell();
        defaultEditCell['keyEventHandler'].call({
            dispatchEvent: () => {} // Override the dispatchEvent method to do nothing
          }, {
            key: 'Tab' 
          });
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        expect((gridObj.getContentTable() as HTMLTableElement).rows[1].cells[1].innerHTML).toBe('updated');
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-72030 - Batch Edited cell value not saved during tab out from last column of last row =>', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0,5),
                editSettings: { allowEditing: true, allowAdding: false, allowDeleting: true, mode: 'Batch' },
                allowPaging: true,
                pageSettings: {pageCount: 5},
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', validationRules: { required: true, number: true }, width: 120 },
                    { field: 'CustomerID', headerText: 'Customer ID', validationRules: { required: true }, width: 140 },
                    { field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit', width: 120, format: 'C2', validationRules: { required: true }},
                    { field: 'OrderDate', headerText: 'Order Date', editType: 'datepickeredit', format: 'yMd', width: 170},
                    { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150, edit: { params: { popupHeight: '300px' } } }
                ],
            }, done);
    });

    it('tab out from last column of last row', () => {
        gridObj.editModule.editCell(4, 'ShipCountry');
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(0);
        expect(gridObj.isEdit).toBeFalsy();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-871057 - Add button is not getting focused on first click in Batch Editing Sample =>', () => {
    let gridObj: Grid;
    let batchAdd: (args: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0, 5),
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                allowPaging: true,
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', validationRules: { required: true, number: true }, width: 120 },
                    { field: 'CustomerID', headerText: 'Customer ID', validationRules: { required: true }, width: 140 },
                    { field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit', width: 120, format: 'C2', validationRules: { required: true } },
                ],
            }, done);
    });

    it('Add record 1', (done: Function) => {
        batchAdd = (args?: Object): void => {
            expect(gridObj.element.querySelectorAll('.e-insertedrow').length).toBe(1);
            gridObj.batchAdd = null;
            done();
        };
        gridObj.batchAdd = batchAdd;
        gridObj.addRecord();
    });
    it('Add record 2', (done: Function) => {
        gridObj.addRecord();
        expect(gridObj.element.querySelectorAll('.e-insertedrow').length).toBe(1);
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = batchAdd = null;
    });
});

describe('EJ2-837195 - Inline and Batch Edit mode behave differently when column.allowEditing is false =>', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0,15),
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                allowPaging: true,
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                    { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                    { field: 'ShipCountry', allowEditing: false},
                ],
            }, done);
    });

    it('Add the row', function (done) {
        let batchAdd = (args?: any): void => {
            gridObj.batchAdd = null;
            done();
        };
        gridObj.batchAdd = batchAdd;
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
    });

    it('Editing the row', function () {
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 10247;
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        expect(gridObj.focusModule.currentInfo.element.getAttribute('data-colindex')).toBe('1');
    })

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-841523 - Batch Adding is not working properly with hidden primary key column =>', function () {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0,15),
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                allowPaging: true,
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: false },
                    { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                    { field: 'ShipCity', validationRules: { required: true }},
                    { field: 'ShipCountry', validationRules: { required: true }},
                ],
            }, done);
    });

    it('Add the row', function (done) {
        let batchAdd = (args?: any): void => {
            gridObj.batchAdd = null;
            done();
        };
        gridObj.batchAdd = batchAdd;
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
    });

    it('Editing the first row', function (done) {
        let cellEdit = (args?: any): void => {
            gridObj.cellEdit = null;
            done();
        };
        gridObj.cellEdit = cellEdit;
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
        gridObj.editModule.editCell(0, 'ShipCity');
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'chennai';
        gridObj.editModule.editCell(0, 'ShipCountry');
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'india';
    })

    it('Editing the second row', function (done) {
        let batchAdd = (args?: any): void => {
            gridObj.batchAdd = null;
            done();
        };
        gridObj.batchAdd = batchAdd;
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'secondupdated';
        (gridObj.editModule as any).editModule.clickHandler({ target: gridObj.element.querySelectorAll('.e-row')[0].childNodes[2] });
        expect(gridObj.element.querySelectorAll('.e-insertedrow')[0].querySelectorAll('td')[2].classList.contains('e-editedbatchcell')).toBeTruthy();
    })
    
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('coverage Improvement', () => {
    let gridObj: Grid;
    let actionComplete: (args: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowSelection: true,
                allowPaging: true,
                pageSettings: { pageSize: 6 },
                allowGrouping: true,
                selectionSettings: { persistSelection: true },
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                columns: [
                    { type: 'checkbox', width: 50 },
                    { field: 'OrderID', width: 120, textAlign: 'Right', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', width: 120, headerText: 'Customer ID' },
                    {
                        field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit',
                        width: 120, format: 'C2', validationRules: { required: true },
                    }
                ],
                aggregates: [{
                    columns: [{
                        type: 'Sum',
                        field: 'Freight',
                        format: 'C2',
                        footerTemplate: 'Sum: ${Sum}'
                    }]
                }]
            }, done);
    });
    it('coverage code improvemnet', function () {
        gridObj.editModule.editModule.deleteRecord();
        expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeFalsy();
        gridObj.selectionModule.selectRowsByRange(0, 2);
        gridObj.editModule.editModule.deleteRecord();
        gridObj.editModule.editModule.batchSave();
        expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeTruthy();
    });

    it('delete - 1', (done: Function) => {
        let beforeBatchDelete = (args?: any): void => {
            args.row = null;
            expect(gridObj.isEdit).toBeFalsy();
            gridObj.beforeBatchDelete = null;
            done();
        };
        gridObj.beforeBatchDelete = beforeBatchDelete;
        gridObj.selectedRowIndex = 2;
        gridObj.editModule.deleteRecord('OrderID', gridObj.currentViewData[0]);
    });

    it('delete - 2', () => {
        let beforeBatchDelete = (args?: any): void => {
            args.row = null;
            expect(gridObj.isEdit).toBeFalsy();
            gridObj.beforeBatchDelete = null;
        };
        gridObj.beforeBatchDelete = beforeBatchDelete;
        gridObj.selectedRowIndex = 3;
        gridObj.editModule.deleteRecord('OrderID');
    });

    it('add', () => {
        gridObj.addRecord({ OrderID: 11111, CustomerID: 'India', Freight: 20.22 });
        gridObj.selectionModule.selectRowsByRange(0, 2);
        // gridObj.editModule.deleteRecord();
        gridObj.editModule.batchSave();
    });

    it('column group testing', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.groupSettings.columns.length).toBe(1);
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.groupModule.groupColumn('CustomerID');
    });
    it('Grouped with add Records', () => {
        gridObj.addRecord({ OrderID: 22222, CustomerID: 'India', Freight: 22.22 });
        expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBeGreaterThan(3);
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('coverage Improvement', () => {
    let gridObj: Grid;
    let actionComplete: (args: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowSelection: true,
                allowPaging: true,
                pageSettings: { pageSize: 6 },
                selectionSettings: { persistSelection: true },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                columns: [
                    { type: 'checkbox', width: 50, allowEditing: false },
                    { field: 'OrderID', width: 120, textAlign: 'Right', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', width: 120, headerText: 'Customer ID' },
                    {
                        field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit',
                        width: 120, format: 'C2', validationRules: { required: true },
                    }
                ],
            }, done);
    });

    it('add start', (done: Function) => {
        let batchAdd = (): void => {
            gridObj.batchAdd = null;
            done();
        };
        gridObj.batchAdd = batchAdd;
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
    });

    it('cell edit start - args.cancel false', (done: Function) => {
        let cellEdit = (args?: any): void => {
            expect(gridObj.isEdit).toBeFalsy();
            args.cell = null;
            args.row = null;
            args.columnObject = null;
            gridObj.cellEdit = null;
            done();
        };
        gridObj.cellEdit = cellEdit;
        gridObj.editModule.editCell(0, 'CustomerID');
    });

    it('cell save complete', (done: Function) => {
        let cellSave = (args?: any): void => {
            gridObj.cellSave = null;
            done();
        };
        gridObj.cellSave = cellSave;
        gridObj.editModule.saveCell();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('coverage Improvement', () => {
    let gridObj: Grid;
    let actionComplete: (args: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowSelection: true,
                allowPaging: true,
                pageSettings: { pageSize: 6 },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', newRowPosition: 'Bottom' },
                columns: [
                    { type: 'checkbox', width: 50, allowEditing: false },
                    { field: 'OrderID', width: 120, textAlign: 'Right', isPrimaryKey: true, headerText: 'Order ID' },
                    { field: 'CustomerID', width: 120, headerText: 'Customer ID' },
                ],
            }, done);
    });

    it('add and update check', function () {
        (select('#' + gridObj.element.id + '_add', gridObj.element) as any).click();
        (select('#' + gridObj.element.id + '_add', gridObj.element) as any).click();
        gridObj.element.click();
    });

    it('check the batch', () => {
        gridObj.isDestroyed = true;
        (gridObj.editModule.editModule as any).addEventListener();
        gridObj.isDestroyed = false;
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('coverage Improvement => ', () => {
    let gridObj: Grid;
    let actionComplete: () => void;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowRowDragAndDrop: true,
                detailTemplate: '#detailtemplate',
                allowPaging: true,
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, isPrimaryKey: true, textAlign: 'Right' },
                    { field: 'CustomerID', validationRules: { required: true }, headerText: 'Customer ID', width: 125 },
                    { field: 'Freight', width: 120, format: 'C', textAlign: 'Right' },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 150 }
                ],
                actionComplete: actionComplete
            }, done);
    });

    it('Edit first row cell type - 1', () => {
        let cell: HTMLElement = gridObj.getContentTable().querySelector('tr').querySelectorAll('td')[3];
        cell.click();
        gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: cell } as any);
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = '';
        gridObj.keyboardModule.keyAction({ action: 'escape', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
    });

    it('Edit first row cell type - 2', (done: Function) => {
        let cellSave = (args?: any): void => {
            gridObj.cellSave = null;
            args.cell = null;
            args.columnObject = null;
            args.cancel = true;
            done();
        };
        gridObj.cellSave = cellSave;
        let cell: HTMLElement = gridObj.getContentTable().querySelector('tr').querySelectorAll('td')[3];
        cell.click();
        gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: cell } as any);
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updatetd';
        gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
    });

    it('Edit first row cell type - 3', () => {
        gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = '';
        gridObj.editModule.editModule.addCancelWhilePaging();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = actionComplete = null;
    });
});
describe('Code Coverage - renderer, react batch edit, number-filter-ui and numeric-edit-cell', () => {
    let gObj: Grid;
    beforeAll((done: Function) => {
        let template1: Element = createElement('div', { id: 'templateObj1' });
        template1.innerHTML = '<button class="tempcell">${ShipCity}</button>';
        document.body.appendChild(template1);
        let template2: Element = createElement('div', { id: 'templateObj2' });
        template2.innerHTML = '<button class="tempcell">Ship City</button>';
        document.body.appendChild(template2);
        gObj = createGrid(
            {
                dataSource: data,
                allowPaging: false,
                allowFiltering: true,
                cssClass: 'coverage',
                filterSettings: { type: 'Menu' },
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, isPrimaryKey: true },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
                        { field: 'ShipCity', headerText: 'Ship City', width: 150,
                        headerTemplate: '#templateObj2', template: '#templateObj1' },
                        { field: 'ShipName', headerText: 'Ship Name', width: 150, },
                        { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right', editType: 'numericedit' }
                ],
                load: function() {
                    expect(this.isReact).toBe(false);
                    expect(this.requireTemplateRef).toBe(true);
                    this.isReact = true;
                }
            }, done);
    });

    it("for coverage - 1", () => {
        gObj.editCell(0, 'ShipCity');
        gObj.editCell(0, 'Freight');
        let instances: string = 'ej2_instances';
        let numberuiObj: any = gObj.element.querySelector('.e-editedbatchcell .e-control.e-numerictextbox')[instances][0];
        (gObj.columns[4] as any).edit.dispatchEvent = function () { };
        (gObj.columns[4] as any).edit.keyEventHandler({ action: 'enter', preventDefault: function() {}, target: numberuiObj.element, keyCode: 13 } as any);
        numberuiObj = gObj.element.querySelector('.e-editedbatchcell .e-control.e-numerictextbox')[instances][0];
        (gObj.columns[4] as any).edit.dispatchEvent = function () { };
        (gObj.columns[4] as any).edit.keyEventHandler({ action: 'tab', preventDefault: function() {}, target: numberuiObj.element, keyCode: 9 } as any);
    });

    it('for coverage - 2', (done: Function) => {
        let actionComplete = (args?: any): void => {
            if (args.requestType === 'filterAfterOpen') {
                expect((gObj.filterModule as any).filterModule.isDialogOpen).toEqual(true);
                let instances: string = 'ej2_instances';
                let numberuiObj: any = document.querySelector('#numberui-' + gObj.getColumns()[4].uid)[instances][0];
                (numberuiObj.element).click();
                const filterMod: any = (gObj.filterModule.filterModule as any);
                const fltrmnuInst: any = new filterMod.colTypes[(gObj.columns[4] as any).type](gObj, filterMod.serviceLocator, gObj.filterSettings);
                fltrmnuInst.dispatchEvent = function () { };
                fltrmnuInst.keyEventHandler({ action: 'enter', preventDefault: function() {}, target: numberuiObj.element, keyCode: 13 } as any);
                (numberuiObj.element).click();
                fltrmnuInst.dispatchEvent = function () { };
                fltrmnuInst.keyEventHandler({ action: 'tab', preventDefault: function() {}, target: numberuiObj.element, keyCode: 9 } as any);
                done();
            }
        };
        gObj.actionComplete = actionComplete;
        (gObj.filterModule as any).filterIconClickHandler(
            getClickObj(gObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
    });

    it('for coverage - 3 setrowvalue, setcellvalue', () => {
        const rowObj = gObj.getRowsObject();
        rowObj[0].setRowValue({ OrderID: 10248, CustomerID: 'customer id test', ShipName: 'shipname test', ShipCity: 'shipcity test', Freight: 32.38, Verified: !0 })
        rowObj[1].setCellValue('CustomerID', 'TOMSP');
        rowObj[1].setCellValue('CustomerID', 'coverage');
        rowObj[0].parent = null;
        rowObj[1].parent = null;
        rowObj[0].setRowValue({ OrderID: 10248, CustomerID: 'customer id test', ShipName: 'shipname test', ShipCity: 'shipcity test', Freight: 32.38, Verified: !0 })
        rowObj[1].setCellValue('CustomerID', 'coverage');
        (rowObj[1] as any).makechanges('OrderID', {});
    });

    afterAll(() => {
        destroy(gObj);
        gObj = null;
    });
});

describe('EJ2-890614: Column’s Default Value property only allows String value =>', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
            dataSource: data,
            columns : [
                { field: 'ShipCountry', headerText:"Ship Country", type: 'string', defaultValue: 'France' },
                { field: 'Freight', headerText: 'Freight', type: 'number', defaultValue: 9999 },
                { field: 'OrderDate', headerText: 'Order Date',format: 'yMd', editType: 'datepickeredit', type: 'date', defaultValue: new Date('6/6/2024') },
                { field: 'Verified', headerText: 'Verified', type: 'boolean', defaultValue: true },
                ],
                editSettings : {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    mode: 'Batch'
                },
                toolbar : ['Add', 'Edit', 'Delete', 'Update', 'Cancel']
        }, done);
    });

    it('Add a row contains innerHTML testing', function (done) {
        let batchAdd = (args?: any): void => {
            let insertedRows = gridObj.element.querySelectorAll('.e-insertedrow');
            expect(insertedRows.length).toBeGreaterThan(0);
            let row = insertedRows[0];
            expect(row.classList.contains('e-editedrow')).toBe(true);
            let cells = row.querySelectorAll('td');
            expect(cells.length).toBeGreaterThan(0);
            expect(cells[1].innerHTML).toBe('9999');
            expect(cells[2].innerHTML).toBe('6/6/2024');
            expect(cells[3].innerHTML).toBe('true');
            gridObj.batchAdd = null;
            done();
        }; 
        
        gridObj.addRecord();
        gridObj.batchAdd = batchAdd;
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
    });
    
    it('Batch cancel', function () {
        gridObj.editModule.batchCancel();
    });
    
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });  
});
