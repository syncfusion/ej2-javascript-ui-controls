/**
 * Grid dialog edit spec document
 */
import { EventHandler, ChildProperty, EmitType } from '@syncfusion/ej2-base';
import { extend, getValue } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { Edit } from '../../../src/grid/actions/edit';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Page } from '../../../src/grid/actions/page';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { CellType } from '../../../src/grid/base/enum';
import { ValueFormatter } from '../../../src/grid/services/value-formatter';
import { Column } from '../../../src/grid/models/column';
import { Selection } from '../../../src/grid/actions/selection';
import { NumericEditCell } from '../../../src/grid/renderer/numeric-edit-cell';
import { DropDownEditCell } from '../../../src/grid/renderer/dropdown-edit-cell';
import { filterData } from '../base/datasource.spec';
import { createGrid, destroy,  getKeyUpObj, getClickObj, getKeyActionObj } from '../base/specutil.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Filter, Page, Selection, Group, Edit, Sort, Reorder, Toolbar);

describe('Dialog Editing module', () => {

    let dataSource: Function = (): Object[] => {
        let data: Object[] = [];
        for (let i = 0; i < filterData.length; i++) {
            data.push(extend({}, {}, filterData[i], true));
        }
        return data;
    };

    describe('Dialog editing render => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog', showConfirmDialog: false, showDeleteConfirmDialog: false },
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

        it('Edit start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    let cells = gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
                    expect(cells.length).toBe(gridObj.getVisibleColumns().length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(1);
                    // allow Editing false
                    expect(cells[2].querySelectorAll('input.e-disabled').length).toBe(1);
                    // isIdentity check
                    expect(cells[6].querySelectorAll('input.e-disabled').length).toBe(1);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'CustomerID');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-toolbar-item.e-overlay').length).toBe(3);
                    expect(gridObj.isEdit).toBeTruthy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-toolbar-item.e-overlay').length).toBe(2);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(71);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(71);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.isEdit).toBeTruthy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            (gridObj.element.querySelector('#'+gridObj.element.id+'_dialogEdit_wrapper').querySelectorAll('button') as any)[1].click();
        });

        it('Add start', (done: Function) => {
            //last action check
            expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
            //form destroy check
            expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
            expect(gridObj.element.querySelectorAll('form').length).toBe(0);

            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-insertedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    let cells = gridObj.element.querySelector('.e-insertedrow').querySelectorAll('.e-rowcell');
                    expect(cells.length).toBe(gridObj.getVisibleColumns().length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(0);
                    // allow Editing false
                    expect(cells[2].querySelectorAll('input.e-disabled').length).toBe(1);
                    // isIdentity check
                    expect(cells[6].querySelectorAll('input.e-disabled').length).toBe(0);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'OrderID');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-toolbar-item.e-overlay').length).toBe(3);
                    expect(gridObj.isEdit).toBeTruthy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check for last action
            expect(gridObj.element.querySelectorAll('.e-toolbar-item.e-overlay').length).toBe(2);
            //edited class check for last action
            expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(0);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);

                    //form destroy check
                    expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).OrderID).toBe(10247);
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(72);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(72);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };

            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.isEdit).toBeTruthy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            (gridObj.element.querySelector('#'+ gridObj.element.id +'OrderID') as any).value = 10247;
            (gridObj.element.querySelector('#'+ gridObj.element.id +'CustomerID') as any).value = 'updated';
            (gridObj.element.querySelector('#'+ gridObj.element.id +'_dialogEdit_wrapper').querySelectorAll('button') as any)[1].click();
        });


        it('Delete action', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(71);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(71);
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-toolbar-item.e-overlay').length).toBe(2);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'delete') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check for last action
            expect(gridObj.element.querySelectorAll('.e-toolbar-item.e-overlay').length).toBe(2);
            //added class check for last action
            expect(gridObj.element.querySelectorAll('.e-insertedrow').length).toBe(0);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_delete' } });
        });

        it('Edit-cancel start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(gridObj.isEdit).toBeTruthy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-toolbar-item.e-overlay').length).toBe(2);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('Edit-cancel complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'cancel') {

                    //form destroy check
                    expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).CustomerID).not.toBe('updatednew');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(71);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(71);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    expect(gridObj.isEdit).toBeTruthy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-toolbar-item.e-overlay').length).toBe(3);
            (gridObj.element.querySelector('#'+ gridObj.element.id +'CustomerID') as any).value = 'updatednew';
            (gridObj.element.querySelector('#'+ gridObj.element.id +'_dialogEdit_wrapper').querySelectorAll('button') as any)[2].click();
        });

        it('Add-cancel start', (done: Function) => {
            //last action check
            expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
            expect(gridObj.element.querySelectorAll('form').length).toBe(0);
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-insertedrow').length).toBe(1);
                    expect(gridObj.isEdit).toBeTruthy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-toolbar-item.e-overlay').length).toBe(2);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add-cancel complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'cancel') {

                    //form destroy check
                    expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).OrderID).not.toBe(10247);
                    expect((gridObj.currentViewData[0] as any).CustomerID).not.toBe('updatednew');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(71);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(71);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };

            actionBegin = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    expect(gridObj.isEdit).toBeTruthy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-toolbar-item.e-overlay').length).toBe(3);
            (gridObj.element.querySelector('#'+ gridObj.element.id +'OrderID') as any).value = 10247;
            (gridObj.element.querySelector('#'+ gridObj.element.id +'CustomerID') as any).value = 'updatednew';
            (gridObj.element.querySelector('#'+ gridObj.element.id +'_dialogEdit_wrapper').querySelectorAll('button') as any)[2].click();
        });

        it('toolbar status check', () => {
            expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
            expect(gridObj.element.querySelectorAll('form').length).toBe(0);
            expect(gridObj.element.querySelectorAll('.e-toolbar-item.e-overlay').length).toBe(2);
        });

        it('dbl edit start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.isEdit).toBeTruthy();
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = null;
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].firstElementChild });
        });

        it('click another row edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.currentViewData[1] as any).CustomerID).toBe('updated');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(71);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            (gridObj.element.querySelector('#'+ gridObj.element.id +'_dialogEdit_wrapper').querySelectorAll('button') as any)[1].click();
        });

        it('check row selection on dialog close by esc and close icon', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    let td = (gridObj.element.querySelector('#' + gridObj.element.id + '_dialogEdit_wrapper').querySelectorAll('td.e-rowcell') as any)[0];
                    expect((td as HTMLElement).style.textAlign === 'left').toBe(true);
                    (gridObj.element.querySelector('#' + gridObj.element.id + '_dialogEdit_wrapper').querySelectorAll('.e-dlg-closeicon-btn') as any)[0].click();
                }
                if (args.requestType === 'cancel') {
                    expect(gridObj.getSelectedRecords().length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].firstElementChild });
        });
        it('check row selection when edit dialog is open', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.getSelectedRecords().length).toBe(1);
                    (gridObj.element.querySelector('#' + gridObj.element.id + '_dialogEdit_wrapper').querySelectorAll('.e-dlg-closeicon-btn') as any)[0].click();
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].firstElementChild });
        });
        it('enableRtl alignment check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    let td = (gridObj.element.querySelector('#' + gridObj.element.id + '_dialogEdit_wrapper').querySelectorAll('td.e-rowcell') as any)[0];
                    expect((td as HTMLElement).style.textAlign === 'right').toBe(true);
                    done();
                }               
            };
            gridObj.enableRtl = true;
            gridObj.dataBind();
            gridObj.actionComplete = actionComplete;
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].firstElementChild });
        });
        
        afterAll((done) => {
            gridObj.notify('tooltip-destroy', {});
           destroy(gridObj);
            setTimeout(function () {
                done();
            }, 1000);
    
        });
    });

});
