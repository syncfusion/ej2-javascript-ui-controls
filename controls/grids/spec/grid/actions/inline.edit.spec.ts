/**
 * Grid Inline edit spec document
 */
import { EmitType, select } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { Edit } from '../../../src/grid/actions/edit';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { DetailRow } from '../../../src/grid/actions/detail-row';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Page } from '../../../src/grid/actions/page';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Selection } from '../../../src/grid/actions/selection';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { createGrid, destroy } from '../base/specutil.spec';
import { Query } from '@syncfusion/ej2-data';
import { data, employeeData, filterData, normalData, foreigndata } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import * as events from '../../../src/grid/base/constant';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import { RowDD } from '../../../src/grid/actions/row-reorder';
import { ForeignKey } from '../../../src/grid/actions/foreign-key';

Grid.Inject(Filter, Page, Selection, Group, Edit, Sort, Reorder, Toolbar, DetailRow, VirtualScroll, RowDD, ForeignKey);

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

describe('Inline Editing module', () => {

    let dataSource: Function = (): Object[] => {
        let datasrc: Object[] = [];
        for (let i = 0; i < 11; i++) {
            datasrc.push(extend({}, {}, data[i], true));
        }
        return datasrc;
    };


    describe('Inline editing render => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
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

        it('Edit start - args.cancel', (done: Function) => {
            actionBegin = (args?: any): void => {               
                if (args.requestType === 'beginEdit') {
                    args.cancel = true;
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };
            gridObj.actionBegin = actionBegin;
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });


        it('Edit start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect((gridObj.editModule as any).editModule.editRowIndex).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    let cells = gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
                    expect(cells.length).toBe(gridObj.columns.length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(1);
                    // allow Editing false
                    expect(cells[2].querySelectorAll('input.e-disabled').length).toBe(1);
                    // isIdentity check
                    expect(cells[6].querySelectorAll('input.e-disabled').length).toBe(1);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'CustomerID');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.clearSelection();
            let formFunc: any = (args?: any): void => {
                expect(args.name).toBe('edit-form');
                gridObj.off(events.beforeStartEdit, formFunc);
            };
            gridObj.on(events.beforeStartEdit, formFunc, this);
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('Edit complete - args.cancel', (done: Function) => {
            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    args.cancel = true;
                    done();
                }
            };
            gridObj.actionBegin = actionBegin;
            (gridObj.editModule as any).editModule.endEdit();
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.editModule as any).editModule.editRowIndex).toBeNull();
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);

                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
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
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element) as any).value = 'updated';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('Add start - args.cancel', (done: Function) => {
            //form destroy check for last action
            expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
            actionBegin = (args?: any): void => {
                if (args.requestType === 'add') {
                    args.cancel = true;
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };
            gridObj.actionBegin = actionBegin;
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    let cells = gridObj.element.querySelector('.e-addedrow').querySelectorAll('.e-rowcell');
                    expect(cells.length).toBe(gridObj.columns.length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(0);
                    // allow Editing false
                    expect(cells[2].querySelectorAll('input.e-disabled').length).toBe(1);
                    // isIdentity check
                    expect(cells[6].querySelectorAll('input.e-disabled').length).toBe(1);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'OrderID');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            //edited class check for last action
            expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(0);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add complete - args.cancel', (done: Function) => {
            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    args.cancel = true;
                    done();
                }
            };
            gridObj.actionBegin = actionBegin;
            (select('#' + gridObj.element.id + 'OrderID', gridObj.element) as any).value = 10247;
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element) as any).value = 'updated';
            (gridObj.editModule as any).editModule.endEdit();
        });

        it('Add complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);

                    //form destroy check
                    expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).OrderID).toBe(10247);
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(12);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(12);
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
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });


        it('Delete action', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            //added class check for last action
            expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(0);
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('Edit-cancel complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);

                    //form destroy check
                    expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).CustomerID).not.toBe('updatednew');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element) as any).value = 'updatednew';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_cancel' } });
        });

        it('Add-cancel start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    expect(gridObj.isEdit).toBeTruthy();
                    //for coverage
                    (gridObj.editModule as any).editModule.addRecord();
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add-cancel complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);
                    //form destroy check
                    expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).OrderID).not.toBe(10247);
                    expect((gridObj.currentViewData[0] as any).CustomerID).not.toBe('updatednew');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
            (select('#' + gridObj.element.id + 'OrderID', gridObj.element) as any).value = 10247;
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element) as any).value = 'updatednew';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_cancel' } });
        });

        it('toolbar status check', () => {
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            (gridObj.element.querySelector('.e-rowcell') as any).click();
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
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element) as any).value = 'updated';
            (gridObj.element.querySelectorAll('.e-row')[2] as any).cells[0].click();
        });

        it('Add complete method with data testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(12);
                //record count check
                expect(gridObj.currentViewData.length).toBe(12);
                done();
            };

            gridObj.actionComplete = actionComplete;
            (<any>gridObj.editModule).editModule.addRecord({ OrderID: 10246, CustomerID: 'updated' });
        });

        it('dbl edit false testing', () => {
            gridObj.editSettings.allowEditOnDblClick = false;
            gridObj.dataBind();
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].firstElementChild });
            expect(gridObj.isEdit).toBeFalsy();
        });

        it('end edit method call after editing completed', () => {
            (gridObj.editModule as any).editModule.endEdit();
            expect(gridObj.isEdit).toBeFalsy();
        });

        it('check validation msg width', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    gridObj.element.focus();
                    (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
                    let validationEle: HTMLElement = gridObj.element.querySelectorAll('.e-tooltip-wrap')[0] as HTMLElement;
                    expect(validationEle.style.maxWidth).not.toBe(null);
                    expect(validationEle.style.textAlign).toBe('center');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });


    describe('Keyboard shortcuts => ', () => {
        let gridObj: Grid;
        let preventDefault: Function = new Function();
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: false,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
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
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element) as any).value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Add start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'insert', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Add complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.currentViewData[0] as any).OrderID).toBe(10247);
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (select('#' + gridObj.element.id + 'OrderID', gridObj.element) as any).value = 10247;
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element) as any).value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });


        it('Delete action', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'delete', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit-cancel start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit-cancel complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    expect((gridObj.currentViewData[0] as any).CustomerID).not.toBe('updatednew');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element) as any).value = 'updatednew';
            gridObj.keyboardModule.keyAction({ action: 'escape', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = preventDefault = null;
        });
    });

    describe('Disable editing, edit mode change and delete alert => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', textAlign: 'Right' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity', textAlign: 'Center' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', textAlign: 'Left' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('editing disable testing', () => {
            gridObj.editSettings.allowAdding = false;
            gridObj.dataBind();
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
            gridObj.editSettings.allowDeleting = false;
            gridObj.dataBind();
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(5);
            gridObj.editSettings.allowEditing = false;
            gridObj.dataBind();
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(6);
            expect(gridObj.editModule).toBeUndefined();
            gridObj.editSettings.allowEditing = true;
            gridObj.dataBind();
            expect(gridObj.editModule).not.toBeUndefined();
        });

        it('adding disable testing', () => {
            gridObj.editModule.addRecord();
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(5);
        });

        it('deleting disable testing', () => {
            gridObj.clearSelection();
            gridObj.selectRow(3, true);
            gridObj.editModule.deleteRecord();
            expect((gridObj.editModule as any).editModule.editRowIndex).not.toBe(3);
            gridObj.editSettings.showDeleteConfirmDialog = true;
            gridObj.editSettings.allowDeleting = true;
            gridObj.dataBind();
        });

        it('deleting - no record alert', () => {
            gridObj.clearSelection();
            gridObj.deleteRecord();
            expect(select('#' + gridObj.element.id + 'EditAlert', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            select('#' + gridObj.element.id + 'EditAlert', gridObj.element).querySelector('button').click();
        });

        it('deleting - delete confirm - cancel', () => {
            gridObj.clearSelection();
            gridObj.selectRow(3, true);
            gridObj.deleteRecord();
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).querySelectorAll('button')[1].click();
        });

        it('deleting - delete confirm - ok', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    done();
                }
            };
            gridObj.clearSelection();
            gridObj.selectRow(3, true);
            gridObj.actionComplete = actionComplete;
            gridObj.deleteRecord();
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
            gridObj.editSettings.allowAdding = true;
            gridObj.dataBind();
            gridObj.editSettings.allowEditing = true;
            gridObj.dataBind();
        });

        it('edit mode change', () => {
            gridObj.editSettings.mode = 'Batch';
            gridObj.dataBind();
            expect((gridObj.editModule as any).editModule.saveCell).not.toBeUndefined();
            gridObj.editSettings.mode = 'Dialog';
            gridObj.dataBind();
            gridObj.editSettings.mode = 'Normal';
            gridObj.dataBind();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });


    describe('Group, and text align => ', () => {
        let gridObj: Grid;
        let preventDefault: Function = new Function();
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', textAlign: 'Right' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity', textAlign: 'Center' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', textAlign: 'Left' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('text align check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    let row: Element = gridObj.element.querySelectorAll('.e-editedrow')[0];
                    expect((select('#' + gridObj.element.id + 'CustomerID', row) as any).style.textAlign).toBe('right');
                    expect((select('#' + gridObj.element.id + 'ShipCity', row) as any).style.textAlign).toBe('center');
                    expect((select('#' + gridObj.element.id + 'ShipRegion', row) as any).style.textAlign).toBe('left');
                    expect(select('#' + gridObj.element.id + 'CustomerID', row).classList.contains('e-textbox')).toBeTruthy();
                    expect(select('#' + gridObj.element.id + 'ShipCity', row).classList.contains('e-textbox')).toBeTruthy();
                    expect(select('#' + gridObj.element.id + 'ShipRegion', row).classList.contains('e-textbox')).toBeTruthy();
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element) as any).value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: (<any>gridObj.getContent().querySelector('.e-row')).cells[0] } as any);
        });

        it('group column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ShipCity');
        });

        it('group cell indent check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-indentcell').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.getCurrentViewRecords()[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element)  as any).value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('ungroup column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('ShipCity');
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = preventDefault = actionComplete = null;
        });
    });

    describe('detail row editing => ', () => {
        let gridObj: Grid;
        let preventDefault: Function = new Function();
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    detailTemplate: '<div></div>',
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', textAlign: 'Right' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity', textAlign: 'Center' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', textAlign: 'Left' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('detail row edit check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-detailrowcollapse').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.getCurrentViewRecords()[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element)  as any).value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = preventDefault = actionComplete = null;
        });
    });

    describe('cell edit template => ', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid55abc' });
        let preventDefault: Function = new Function();
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            let datePickerObj: DatePicker;
            gridObj = new Grid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', textAlign: 'Right' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        {
                            field: 'ShipCity', textAlign: 'Center', edit: {
                                create: () => {
                                    return '<input>';
                                }
                            }
                        },
                        { field: 'Verified', type: 'boolean' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        {
                            field: 'ShipRegion', type: 'string', textAlign: 'Left', edit: {
                                create: () => {
                                    elem = document.createElement('div').appendChild(document.createElement('input'));
                                    return elem;
                                }
                            }
                        },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        {
                            field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', edit: {
                                create: () => {
                                    elem = document.createElement('input');
                                    return elem;
                                },
                                read: () => {
                                    return datePickerObj.value;
                                },
                                destroy: () => {
                                    datePickerObj.destroy();
                                },
                                write: (args: any) => {
                                    datePickerObj = new DatePicker({
                                        value: new Date(args.rowData[args.column.field]),
                                        floatLabelType: 'Never'
                                    });
                                    datePickerObj.appendTo(elem);
                                }
                            }
                        }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid55abc');
        });

        it('cell template edit check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.getCurrentViewRecords()[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element)  as any).value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            elem.remove();
            if (document.getElementById('Grid55abc')) {
                document.getElementById('Grid55abc').remove();
            }
            gridObj = actionBegin = elem = preventDefault = actionComplete = null;
        });
    });


    describe('validation testing => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', textAlign: 'Right', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity', textAlign: 'Center' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', textAlign: 'Left' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('edit row check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('Edit with invalid data', () => {
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element)  as any).value = '';
            expect(gridObj.editModule.editFormValidate()).toBeFalsy();
            expect(gridObj.editModule.formObj.element.querySelectorAll('.e-griderror').length).toBe(1);
            let errors: any = document.querySelectorAll('.e-griderror');
            // EJ2-7735 Grid Validation message is not shown in Essential JavaScript 2 compatibility theme
            expect(errors[0].classList.contains('e-control')).toBeTruthy();
            expect(errors.length).toBeGreaterThan(0);
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.getCurrentViewRecords()[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element)  as any).value = 'updated';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('Add start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add with invalid data', () => {
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
            expect(document.querySelectorAll('.e-griderror').length).toBeGreaterThan(0);
            // EJ2-50953 - When double-clicking inline editing validation message, JavaScript error is thrown
            (gridObj as any).dblClickHandler({ target: document.querySelectorAll('.e-griderror')[0] });
        });

        it('Add complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(12);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(12);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (select('#' + gridObj.element.id + 'OrderID', gridObj.element) as any).value = 10247;
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element)  as any).value = 'updated';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        afterAll((done) => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            setTimeout(function () {
                done();
            }, 1000);
            gridObj = actionBegin = actionComplete = null;

        });
    });

    describe('Adding rows after hiding OrderID columnzz', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: false, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                }, done);
        });

        it('Add start-hiding column and clicking add button', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
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
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add complete - checking updation-hiding column and clicking add button', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updatedrow');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(12);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(12);
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    done();
                }
            };
            gridObj.actionBegin = actionBegin;
            gridObj.actionComplete = actionComplete;
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element)  as any).value = 'updatedrow';
            (gridObj.editModule as any).editModule.endEdit();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });

    });
    describe('Datetime picker component rendering', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: false, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'datetime', editType: 'datetimepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                }, done);
        });

        it('render datetimepicker component while adding testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelector('.e-gridform').querySelectorAll('td')[6].querySelector('input').classList.contains('e-datetimepicker')).toBeTruthy();
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
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });

    });

    describe('Inline editing render with Freeze => ', () => {
        let gridObj: any;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    frozenColumns: 2,
                    frozenRows: 2,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, width: 75 },
                        { field: 'CustomerID', type: 'string', width: 75 },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit', width: 75 },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit', width: 75 },
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('Edit start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    let cells = gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
                    // let mCells = gridObj.element.querySelectorAll('.e-editedrow')[1].querySelectorAll('.e-rowcell');
                    expect(cells.length).toBe(gridObj.getVisibleColumns().length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(1);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'CustomerID');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);

                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length
                        + gridObj.getHeaderContent().querySelector('tbody').querySelectorAll('.e-row').length).toBe(11);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
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
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element)  as any).value = 'updated';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('Add start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    let cells = gridObj.element.querySelector('.e-addedrow').querySelectorAll('.e-rowcell');
                    // let mCells = gridObj.element.querySelectorAll('.e-addedrow')[1].querySelectorAll('.e-rowcell');
                    expect(cells.length).toBe(gridObj.getVisibleColumns().length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(0);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'OrderID');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            //edited class check for last action
            expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(0);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);

                    //form destroy check
                    expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).OrderID).toBe(10247);
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    //row count check
                    // expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(19);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(12);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };

            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.isEdit).toBeTruthy();
                }
            };
            (select('#' + gridObj.element.id + 'OrderID', gridObj.element) as any).value = 10247;
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element)  as any).value = 'updated';
            // (gridObj.editModule as any).editModule.endEdit();
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('Delete action', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    //row count check
                    // expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(19);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
                    expect(gridObj.isEdit).toBeFalsy();
                    gridObj.dblClickHandler({ target: gridObj.getContent().querySelectorAll('.e-row')[0] });
                    setTimeout(()=>{
                        done();
                    },100);
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            //added class check for last action
            expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(0);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_delete' } });
        });

        it('Ensure added row position', (done: Function) => {
            gridObj.editSettings.newRowPosition = "Bottom";
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    let editFormIndex: number = gridObj.element.querySelectorAll('.e-addedrow')[0].rowIndex;
                    let totalRowsCount: number = gridObj.getContent().querySelectorAll('.e-row').length;
                    expect((editFormIndex + 1)).toBe(totalRowsCount);
                    gridObj.closeEdit();
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });
        
        it('Edit start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    let cells = gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
                    // let mCells = gridObj.element.querySelectorAll('.e-editedrow')[1].querySelectorAll('.e-rowcell');
                    expect(cells.length).toBe(gridObj.getVisibleColumns().length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(1);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'CustomerID');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.clearSelection();
            gridObj.editModule.startEdit(gridObj.getContent().querySelector('tr'));
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('Inline editing render with Freeze => ', () => {
        let gridObj: any;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    frozenColumns: 2,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('Edit start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    let cells = gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
                    // let mCells = gridObj.element.querySelectorAll('.e-editedrow')[1].querySelectorAll('.e-rowcell');
                    expect(cells.length).toBe(gridObj.getVisibleColumns().length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(1);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'CustomerID');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);
                    
                    //old data check
                    expect(args.rowData.CustomerID).not.toBe('updated');
                    expect(args.previousData.CustomerID).not.toBe('updated');
                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
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
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element)  as any).value = 'updated';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('Add start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    let cells = gridObj.element.querySelector('.e-addedrow').querySelectorAll('.e-rowcell');
                    // let mCells = gridObj.element.querySelectorAll('.e-addedrow')[1].querySelectorAll('.e-rowcell');
                    expect(cells.length).toBe(gridObj.getVisibleColumns().length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(0);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'OrderID');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            //edited class check for last action
            expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(0);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('EJ2-6484 hierarchy testing => ', () => {
        let childData: Object[] = dataSource();
        let gridObj: Grid;
        let childGridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        let detailDataBound: () => void;
        let preventDefault: Function = new Function();

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData,
                    allowPaging: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                        { field: 'FirstName', headerText: 'First Name', textAlign: 'Left', width: 100 },
                    ],
                    detailDataBound: detailDataBound,
                    childGrid: {
                        dataSource: childData, queryString: 'EmployeeID',
                        allowPaging: false,
                        actionBegin: actionBegin,
                        actionComplete: actionComplete,
                        editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
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
        
        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = childData = childGridObj = detailDataBound = actionComplete = null;
        });
    });

    describe('Editing with empty grid => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    allowPaging: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                        { field: 'FirstName', headerText: 'First Name', textAlign: 'Left', width: 100 },
                    ]
                }, done);
        });

        it('adding record', () => {
            (gridObj.editModule as any).editModule.addRecord();
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


    describe('EJ2-7749 Disable edit, delete button when Grid is empty => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
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

        it('Initial toolbar staus check', () => {
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(5);
        });


        it('Add start && EJ2-7012-script error on numeric text box click', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
                    expect(gridObj.isEdit).toBeTruthy();
                    // double click script error while in edit state.
                    expect(gridObj.getRowInfo(<Element | EventTarget>gridObj.element).toString()).toBe({}.toString());

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
            //edited class check for last action
            expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(0);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
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
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element)  as any).value = 'updated';
            (select('#' + gridObj.element.id + 'OrderID', gridObj.element) as any).value = '23432';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('toolbar staus check after 1 record added', () => {
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
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
            gridObj = actionBegin = actionComplete = null;
        });
    });
    describe('EJ2-22823 Add and Delete operations current view check in virtualization => ', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    enableVirtualization: true,
                    height: 300,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true },
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
                    actionComplete: actionComplete
                }, done);
        });

        it('Delete operation in current view check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType == 'delete') {
                    expect((gridObj.getCurrentViewRecords()[0] as any).OrderID).toBe(10249);
                    done();
                }
            }
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_delete' } });
        });

        it('Add operation in current view check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType == 'add') {
                    args.form.querySelector('td input').value = 10001;
                        gridObj.endEdit();
                        gridObj.actionComplete = (args: any) => {
                            if (args.requestType == 'save') {
                                expect((gridObj.getCurrentViewRecords()[0] as any).OrderID).toBe(10001);
                                done();
                            }
                        };
                }
            }
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });   

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('EJ2-24249 - reqType shown as paging instead of delete while deleting single last record in last page', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
    
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0,11),
                    allowPaging: true,
                    pageSettings: {pageSize: 5, currentPage: 3},
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                        { headerText: 'OrderDate', field: 'OrderDate', format: 'long', type: 'datetime' },
                    ],
                    actionComplete: actionComplete
                }, done);
        });
    
        it('Delete action- request type should be delete', (done: Function) => {
            actionComplete = (args?: any): void => {
                expect(args.requestType).toBe('delete');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(0);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_delete' } });
        });
    
        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('Keyboard shortcuts => ', () => {
        let gridObj: Grid;
        let dataSource: object[] = [
            { OrderID: {Id:'V101'} , CustomerID: 'Vinet' },
            { OrderID: {Id:'V102'} , CustomerID: 'Cruze' },
            { OrderID: {Id:'V103'} , CustomerID: 'Vincet' },
            { OrderID: {Id:'V104'} , CustomerID: 'drone' }
        ];
        let preventDefault: Function = new Function();
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource:dataSource,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'OrderID.Id', type: 'number', isPrimaryKey: true,width:120 },
                        { field: 'CustomerID', type: 'string' ,width:120},
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
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.editModule as any).editModule.startEdit(gridObj.getRows()[1]);
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.getCurrentViewRecords()[1] as any).CustomerID).toBe('updated');
                    //expect((gridObj.getCurrentViewRecords()[0] as any).CustomerID).toBe('Vinet');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element)  as any).value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });
        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('EJ2-32089 - Border issue ', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        let actionBegin: () => void;
    
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0,5),
                    allowPaging: true,
                    height: 500,
                    pageSettings: {pageSize: 5, currentPage: 3},
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', newRowPosition: 'Bottom' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                        { headerText: 'OrderDate', field: 'OrderDate', format: 'long', type: 'datetime' },
                    ],
                    actionComplete: actionComplete,
                    actionBegin: actionBegin
                }, done);
        });

        it('Edit last row', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    let td: any= args.row.children;
                    for(let i:number = 0; i < td.length; i++ ) {
                        expect(td[i].querySelector('.e-rowcell').classList.contains('e-lastrowcell')).toBeTruthy();
                    }
                    gridObj.actionComplete = null;
                    (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_cancel' } });
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(4, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    let td: any= args.row.children;
                    for(let i:number = 0; i < td.length; i++ ) {
                        expect(td[i].classList.contains('e-lastrowcell')).toBeTruthy();
                    }
                    expect(gridObj.getContent().querySelectorAll('.e-lastrowcell').length).toBe(gridObj.getColumns().length);
                    gridObj.actionComplete = null;
                    (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_save' } });
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(4, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
            (select('#' + gridObj.element.id + 'CustomerID', gridObj.element)  as any).value = 'updated';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

    
        it('Add new row and check bottom border', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(args.row.querySelector('.e-rowcell').classList.contains('e-lastrowadded')).toBeTruthy();
                    gridObj.actionComplete = null;
                    (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_cancel' } });
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });
    
        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });
    // describe('EJ2-35482-Inline edit template editing with Freeze => ', () => {
    //     let gridObj: any;
    //     let actionBegin: () => void;
    //     let actionComplete: () => void;
    //     beforeAll((done: Function) => {
    //         gridObj = createGrid(
    //             {
    //                 dataSource: dataSource(),
    //                 allowFiltering: true,
    //                 frozenColumns: 2,
    //                 frozenRows: 2,
    //                 allowGrouping: true,
    //                 editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
    //                 toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
    //                 allowPaging: false,
    //                 columns: [
    //                     { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, width: 75 },
    //                     { field: 'CustomerID', type: 'string', width: 75 },
    //                     { field: 'ShipCity', template:'<div style="height:70px">${ShipCity}</div>', type: 'string', width: 75 },
    //                     { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit', width: 75 },
    //                     { field: 'Verified', type: 'boolean', editType: 'booleanedit', width: 75 },
    //                 ],
    //                 actionBegin: actionBegin,
    //                 actionComplete: actionComplete
    //             }, done);
    //     });

    //     it('Edit start', (done: Function) => {
    //         actionComplete = (args?: any): void => {
    //             if (args.requestType === 'beginEdit') {
    //                 expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(2);
    //                 expect(gridObj.element.querySelectorAll('.e-editedrow')[0].offsetHeight).toBe(gridObj.element.querySelectorAll('.e-editedrow')[1].offsetHeight);
    //                 done();
    //             }
    //         };
    //         gridObj.actionComplete = actionComplete;
    //         gridObj.clearSelection();
    //         gridObj.selectRow(0, true);
    //         (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
    //     });

    //     it('Edit complete', (done: Function) => {
    //         actionComplete = (args?: any): void => {               
    //             if (args.requestType === 'save') {
    //                 done();
    //             }
    //         };
    //         gridObj.actionComplete = actionComplete;
    //         (gridObj.editModule as any).editModule.endEdit();
    //     });

    //     it('adding record with freeze column template', (done: Function) => {
    //         actionComplete = (args?: any): void => {
    //             if (args.requestType === 'add') {
    //                 expect(gridObj.element.querySelectorAll('.e-addedrow')[0].offsetHeight).toBe(gridObj.element.querySelectorAll('.e-addedrow')[1].offsetHeight);
    //                 done();
    //             }
    //         };
    //         gridObj.actionComplete = actionComplete;
    //         (gridObj.editModule as any).editModule.addRecord();           
    //     });

    //    afterAll(() => {
    //         gridObj.notify('tooltip-destroy', {});
    //         destroy(gridObj);
    //         gridObj = actionBegin = actionComplete = null;
    //     });
    // });

    describe('Row virtualization with inline edit support', () => {
        virtualdataSource();
        let actionBegin: () => void;
        let actionComplete: () => void;
        let gridObj: any;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: virtualData,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    enableVirtualization: true,
                    pageSettings: { pageSize: 50 },
                    height: 400,
                    columns: [
                        { field: 'FIELD2', headerText: 'FIELD2', isPrimaryKey: true, width: 120 },
                        { field: 'FIELD1', headerText: 'FIELD1', width: 100 },
                        { field: 'FIELD3', headerText: 'FIELD3', allowEditing: false, width: 120 },
                        { field: 'FIELD4', headerText: 'FIELD4', width: 120 },
                        { field: 'FIELD5', headerText: 'FIELD5', width: 120 }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('edit start - 1', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    let cells = gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
                    expect(cells.length).toBe(gridObj.columns.length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(1);
                    // allow Editing false
                    expect(cells[2].querySelectorAll('input.e-disabled').length).toBe(1);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'FIELD1');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.clearSelection();
            let formFunc: any = (args?: any): void => {
                expect(args.name).toBe('edit-form');
                gridObj.off(events.beforeStartEdit, formFunc);
            };
            gridObj.on(events.beforeStartEdit, formFunc, this);
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('scroll', (done: Function) => {
            (<HTMLElement>gridObj.getContent().firstChild).scrollTop = 500;
            setTimeout(done, 600);
        });

        it('ensure edit form', (done: Function) => {
            expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(0);
            expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
            expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
            expect(gridObj.element.querySelectorAll('form').length).toBe(0);
            expect(gridObj.isEdit).toBeTruthy();
            let data: Object = (<{ virtualData?: Object }>(gridObj as Grid).contentModule).virtualData;
            expect(Object.keys(data).length).not.toBe(0);
            expect(gridObj.contentModule.editedRowIndex).toBe(0);
            expect(gridObj.getRowsObject()[0].data.FIELD2).toBe((data as any).FIELD2);
            setTimeout(done, 600);
        });

        it('scroll', (done: Function) => {
            (<HTMLElement>gridObj.getContent().firstChild).scrollTop = 0;
            setTimeout(done, 600);
        });

        it('edit complete - 2', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);

                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).FIELD1).toBe('updated');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(50);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(50);
                    expect(gridObj.isEdit).toBeFalsy();
                    let data: Object = (<{ virtualData?: Object }>(gridObj as Grid).contentModule).virtualData;
                    expect(Object.keys(data).length).toBe(0);
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
            (select('#' + gridObj.element.id + 'FIELD1', gridObj.element) as any).value = 'updated';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('Edit after scroll', (done: Function) => {
            (<HTMLElement>gridObj.getContent().firstChild).scrollTop = 4000;
            setTimeout(done, 600);
        });

        it('edit start - 2', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    let cells = gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
                    expect(cells.length).toBe(gridObj.columns.length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(1);
                    // allow Editing false
                    expect(cells[2].querySelectorAll('input.e-disabled').length).toBe(1);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'FIELD1');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
                    expect(gridObj.isEdit).toBeTruthy();
                    expect(cells[3].querySelector('.e-input').value).not.toBe('');
                    expect(cells[3].querySelector('.e-input').value).not.toBe(null);
                    expect(cells[3].querySelector('.e-input').value).not.toBe(undefined);
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.clearSelection();
            let formFunc: any = (args?: any): void => {
                expect(args.name).toBe('edit-form');
                gridObj.off(events.beforeStartEdit, formFunc);
            };
            gridObj.on(events.beforeStartEdit, formFunc, this);
            gridObj.selectRow(109, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('edit complete - 3', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);

                    //updatated data cehck
                    expect((gridObj.currentViewData[9] as any).FIELD1).toBe('updated');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(50);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(50);
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
            (select('#' + gridObj.element.id + 'FIELD1', gridObj.element) as any).value = 'updated';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('scroll', (done: Function) => {
            (<HTMLElement>gridObj.getContent().firstChild).scrollTop = 0;
            setTimeout(done, 600);
        });

        it('edit start - 3', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    (select('#' + gridObj.element.id + 'FIELD1', gridObj.element) as any).value = 'updated';
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(2, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('scroll', (done: Function) => {
            (<HTMLElement>gridObj.getContent().firstChild).scrollTop = 6000;
            setTimeout(done, 600);
        });

        it('edit complete - 4', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    //updatated data cehck
                    expect(gridObj.contentModule.vgenerator.cache[1][2].data.FIELD1).toBe('updated');
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
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('edit start - 4', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    (select('#' + gridObj.element.id + 'FIELD1', gridObj.element) as any).value = 'updated';
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(165, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('scroll', (done: Function) => {
            (<HTMLElement>gridObj.getContent().firstChild).scrollTop = 1500;
            setTimeout(done, 600);
        });

        it('Edit-cancel complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    //form destroy check
                    expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);
                    expect(gridObj.contentModule.vgenerator.cache[7][15].data.FIELD1).not.toBe('updated');
                    expect(gridObj.isEdit).toBeTruthy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_cancel' } });
        });

        it('edit start - 5', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    (select('#' + gridObj.element.id + 'FIELD1', gridObj.element) as any).value = 'updated';
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(44, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('scroll', (done: Function) => {
            (<HTMLElement>gridObj.getContent().firstChild).scrollTop = 5500;
            setTimeout(done, 600);
        });

        it('scroll', (done: Function) => {
            (<HTMLElement>gridObj.getContent().firstChild).scrollTop = 1500;
            setTimeout(done, 600);
        });

        it('Edit-cancel complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    //form destroy check
                    expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
                    expect(gridObj.isEdit).toBeFalsy();
                    expect(gridObj.contentModule.vgenerator.cache[2][19].data.FIELD1).not.toBe('updated');
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    expect((select('#' + gridObj.element.id + 'FIELD1', gridObj.element) as any).value).toBe('updated');
                    expect(gridObj.isEdit).toBeTruthy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_cancel' } });
        });

        it('scroll', (done: Function) => {
            (<HTMLElement>gridObj.getContent().firstChild).scrollTop = 0;
            setTimeout(done, 600);
        });

        it('Add start - 1', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    let cells = gridObj.element.querySelector('.e-addedrow').querySelectorAll('.e-rowcell');
                    expect(cells.length).toBe(gridObj.columns.length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(0);
                    // allow Editing false
                    expect(cells[2].querySelectorAll('input.e-disabled').length).toBe(1);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'FIELD2');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
                    expect(gridObj.isEdit).toBeTruthy();
                    (select('#' + gridObj.element.id + 'FIELD2', gridObj.element) as any).value = 1234567;
                    (select('#' + gridObj.element.id + 'FIELD1', gridObj.element) as any).value = 'updated';
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            //edited class check for last action
            expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(0);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('scroll', (done: Function) => {
            (<HTMLElement>gridObj.getContent().firstChild).scrollTop = 1000;
            setTimeout(done, 600);
        });

        it('ensure add form after scroll', () => {
            expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(0);
            expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
            expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
            expect(gridObj.element.querySelectorAll('form').length).toBe(0);
            expect(Object.keys(gridObj.contentModule.virtualData).length).not.toBe(0);
            expect(gridObj.contentModule.editedRowIndex).toBe(undefined);
        });

        it('scroll', (done: Function) => {
            (<HTMLElement>gridObj.getContent().firstChild).scrollTop = 0;
            setTimeout(done, 600);
        });

        it('Add complete - 1', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);
                    //form destroy check
                    expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).FIELD2).toBe(1234567);
                    expect((gridObj.currentViewData[0] as any).FIELD1).toBe('updated');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(50);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(50);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };

            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    expect((select('#' + gridObj.element.id + 'FIELD2', gridObj.element) as any).value).toBe('1234567');
                    expect((select('#' + gridObj.element.id + 'FIELD1', gridObj.element) as any).value).toBe('updated');
                    expect(gridObj.isEdit).toBeTruthy();
                    gridObj.actionBegin = undefined;
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('scroll', (done: Function) => {
            (<HTMLElement>gridObj.getContent().firstChild).scrollTop = 2300;
            setTimeout(done, 600);
        });

        it('Add start - 2', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect((<HTMLElement>gridObj.getContent().firstChild).scrollTop).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    (select('#' + gridObj.element.id + 'FIELD2', gridObj.element) as any).value = 12345678;
                    (select('#' + gridObj.element.id + 'FIELD1', gridObj.element) as any).value = 'updated';
                    done();
                }
            };

            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add complete - 2', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).FIELD2).toBe(12345678);
                    expect((gridObj.currentViewData[0] as any).FIELD1).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('Add start - 3', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    (select('#' + gridObj.element.id + 'FIELD2', gridObj.element) as any).value = 123456789;
                    (select('#' + gridObj.element.id + 'FIELD1', gridObj.element) as any).value = 'updated';
                    done();
                }
            };

            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('scroll', (done: Function) => {
            (<HTMLElement>gridObj.getContent().firstChild).scrollTop = 2700;
            setTimeout(done, 600);
        });

        it('Add complete - 3', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.dataSource[0].FIELD2).toBe(123456789);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('Add-cancel start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    (select('#' + gridObj.element.id + 'FIELD2', gridObj.element) as any).value = 123456;
                    (select('#' + gridObj.element.id + 'FIELD1', gridObj.element) as any).value = 'updated';
                    done();
                }
            };

            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('scroll', (done: Function) => {
            (<HTMLElement>gridObj.getContent().firstChild).scrollTop = 2800;
            setTimeout(done, 600);
        });

        it('Add-cancel complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    //updatated data cehck
                    expect(gridObj.dataSource[0].FIELD2).toBe(123456789);
                    expect((<HTMLElement>gridObj.getContent().firstChild).scrollTop).toBe(2800);
                    gridObj.actionComplete = undefined;
                    done();
                }
            };

            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_cancel' } });
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('EJ2-36215 Script error in empty dropDownList', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                    ],
                }, done);
        });

        it('Adding Null values', () => {
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
            expect(((gridObj.element.querySelector('.e-dropdownlist') as any).ej2_instances[0]).dataSource.dataSource.json.length).toBe(0);
            ((gridObj.element.querySelector('.e-dropdownlist') as any).ej2_instances[0]).dataSource.dataSource.json[0] = { ShipCountry: null };
            ((gridObj.element.querySelector('.e-dropdownlist') as any).ej2_instances[0]).showPopup();
            expect(((gridObj.element.querySelector('.e-dropdownlist') as any).ej2_instances[0]).dataSource.dataSource.json.length).toBe(1);
        });
        afterAll(() => {
            destroy(gridObj);
        });

    });

    describe('EJ2-37498 checkbox column value overrides the boolean column while editing', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        let beforeDataBound: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowPaging:true,
                    selectionSettings:{ persistSelection:true, checkboxOnly:true },
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true},
                    toolbar: ['Add',  'Delete', 'Update', 'Cancel'],
                    columns: [
                        { type:"checkbox", width:50},
                        { field: 'OrderID', isPrimaryKey: true, validationRules: { required: true },headerText: 'Order ID', width: 120},
                        { field: 'CustomerID', headerText: 'Customer ID', width: 140 },
                        { field: 'Verified', headerText: 'Verified', textAlign: 'Right', editType: 'booleanedit',
                            width: 120, displayAsCheckBox:true, type:"boolean" }
                    ],
                    actionComplete: actionComplete
                }, done);
        });

        it('editing row', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.dataSource[1].Verified).toBe(false);
                    expect(args.form.querySelector("#" + gridObj.element.id +"Verified").nextSibling.classList.contains("e-check")).toBe(false);
                    gridObj.actionComplete = undefined;
                }
                done();
            };
            gridObj.actionComplete = actionComplete;       
            gridObj.selectRow(1);
            (gridObj.editModule as any).editModule.startEdit(gridObj.getRows()[1]);
        });

        it('EJ2-39213 - Grid selection module editRowIndex will not get update while using updateRow method', (done: Function) => {
            beforeDataBound = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.editModule as any).editModule.editRowIndex).toBe(2);
                    gridObj.beforeDataBound = undefined;
                }
                done();
            };
            gridObj.beforeDataBound = beforeDataBound;
            gridObj.updateRow(2, { OrderID: 10250, CustomerID: 'ALFKI' });
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('EJ2-35693-Alignment issues reproduced attached sample', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
		            height: 500,
            		editSettings: { allowAdding: true, newRowPosition: 'Bottom' },
            		toolbar: ["Add"],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, validationRules: { required: true }, width: 120  },
                        { field: 'Freight', textAlign: 'Right', format: 'C2', width: 120 },
                        { field: 'CustomerID', headerText: 'Contact Name', width: 120 }
                    ],
                    actionComplete: actionComplete
                }, done);
        });
        it('Add start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(args.row.querySelector('.e-rowcell').classList.contains('e-lastrowadded')).toBeFalsy();
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('EJ2-39811 - Need to maintain the edit form actionBegin Event', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal',},
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                }, done);
        });

        it('Cancel botton check', (done: Function) => {
            actionBegin = (args?: any): void => {               
                if (args.requestType === 'cancel') {
                    args.cancel = true;
                    done();
                }
            };
            let cell: HTMLElement= gridObj.element.querySelector('.e-content').querySelector('table').rows[0].childNodes[1] as any;
            cell.click();
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: cell } as any);
            gridObj.element.querySelectorAll('.e-valid-input')[1].querySelector('input').innerText = 'JHON';
            let cancel = select('#' + gridObj.element.id + '_cancel', gridObj.element) as HTMLElement;
            gridObj.actionBegin = actionBegin;
            cancel.click();
        });
        it('check the edit form', () => {
            expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

describe('EJ2-40519 - ActionBegin event arguments cancel property value getting maintained', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal',},
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                }, done);
        });

        it('Cancel Events check', (done: Function) => {
            actionBegin = (args?: any): void => {               
                if (args.requestType === 'save') {
                    args.cancel = true;
                    gridObj.closeEdit(); 
                    done();
                }
            };
            let cell: HTMLElement= gridObj.element.querySelector('.e-content').querySelector('table').rows[0].childNodes[1] as any;
            cell.click();
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: cell } as any);
            let update = select('#' + gridObj.element.id + '_update', gridObj.element) as HTMLElement;
            gridObj.actionBegin = actionBegin;
            update.click();
        });
        it('check the edit form', () => {
            expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
        
    });

    describe('EJ2-45232 - Delete issue with grouping', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    allowGrouping: true,
                    groupSettings: { columns: ['EmployeeID'] },
                    pageSettings: { pageSize: 2 },
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true },
                        { field: 'EmployeeID' },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity', type: 'string', editType: 'dropdownedit' }
                    ]
                }, done);
        });

        it('Delete With Grouping', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    expect(gridObj.pageSettings.currentPage).toBe(1);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(0, true);
            gridObj.editModule.deleteRecord();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });

    });

    describe('EJ2-47605 - Delete issue with records other than current view records', () => {
        let gridObj: Grid;
        let length: number = dataSource().length;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    selectionSettings: { persistSelection: true },
                    pageSettings: { pageSize: 2 },
                    columns: [
                        {type:'checkbox', width:50},
                        { field: 'OrderID', type: 'number', isPrimaryKey: true },
                        { field: 'EmployeeID' },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity', type: 'string', editType: 'dropdownedit' }
                    ]
                }, done);
        });

        it('Delete With record', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    expect((gridObj.dataSource as any).length).toBe(length-1);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.deleteRecord('OrderID', [{OrderID:10258}]);
        });
        it('Delete With key', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    expect((gridObj.dataSource as any).length).toBe(length-2);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.deleteRecord('OrderID', [10257]);
        });

        it('Delete With record', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    expect((gridObj.dataSource as any).length).toBe(length-3);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.deleteRecord('OrderID', [10248]);
        });
        it('Delete With multiple records', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    expect((gridObj.dataSource as any).length).toBe(length-5);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.deleteRecord('OrderID', [{OrderID:10251},{OrderID:10255}]);
        });
        it('Delete With select all', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    expect((gridObj.dataSource as any).length).toBe(0);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('.e-headercelldiv').querySelectorAll('.e-frame.e-icons')[0] as any).click();
            gridObj.deleteRecord('OrderID', gridObj.getSelectedRecords());
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });

    });

    describe('EJ2-48215 - Delete issue in last page', () => {
        let gridObj: Grid;
        let data = dataSource();
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 3),
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    allowGrouping: true,
                    pageSettings: { currentPage:3, pageSize: 1 },
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true },
                        { field: 'EmployeeID' },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity', type: 'string', editType: 'dropdownedit' }
                    ]
                }, done);
        });

        it('Delete last record', (done: Function) => {
           let actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    expect(gridObj.pageSettings.currentPage).toBe(2);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(0, true);
            gridObj.editModule.deleteRecord();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });

    });

    describe('EJ2-50506 - Edit focus is not working properly when the Grid has a checkbox selection column', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    columns: [
                        { type: 'Checkbox', width: 50, allowEditing: false },
                        { field: 'OrderID', type: 'number', isPrimaryKey: true },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity', type: 'string', editType: 'dropdownedit' }
                    ]
                }, done);
        });

        it('Check focus cell with checkbox column', (done: Function) => {
            let actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'CustomerID');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-51016 - wrong rowData is bound when editing a Virtualization Grid with Grouping enabled', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    enableVirtualization: true,
                    height: 400,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowGrouping: true,
                    groupSettings: {columns: ['OrderID']},
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity', type: 'string', editType: 'dropdownedit' }
                    ]
                }, done);
        });

        it('Check rowData value with editing a row ', (done: Function) => {
            let actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(args.rowData.OrderID).toBe(gridObj.dataSource[0]['OrderID']);
                    expect(args.rowData.CustomerID).toBe(gridObj.dataSource[0]['CustomerID']);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    describe('EJ2-51487 - Borderline is not applied when edit form rendered at bottom for adding a row', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData.slice(0,5),
		            height: '500px',
            		editSettings: { allowAdding: true, newRowPosition: 'Bottom' },
            		toolbar: ["Add"],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, validationRules: { required: true }, width: 120  },
                        { field: 'Freight', textAlign: 'Right', format: 'C2', width: 120 },
                        { field: 'CustomerID', headerText: 'Contact Name', width: 120 }
                    ],
                    actionComplete: actionComplete
                }, done);
        });
        it('check the borderline in bottom row', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(args.row.querySelector('.e-rowcell').classList.contains('e-lastrowadded')).toBeTruthy();
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('EJ2-57848 - Inline editing does not work with Drag and drop and frozen columns', () => {
        let grid: Grid;
        let actionComplete: () => void;
        let actionBegin: () => void;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: filterData.slice(0,5),
            		allowRowDragAndDrop: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', newRowPosition: 'Top' },
                    frozenColumns: 2,
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        {
                            field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right',
                            validationRules: { required: true, number: true }, width: 140
                        },
                        {
                            field: 'CustomerID', headerText: 'Customer ID',
                            validationRules: { required: true }, width: 140
                        },
                        {
                            field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit',
                            width: 140, format: 'C2', validationRules: { required: true }
                        },
                        {
                            field: 'OrderDate', headerText: 'Order Date', editType: 'datetimepickeredit',
                            width: 160, format: { type: 'dateTime', format: 'M/d/y hh:mm a' },
                        },
                        {
                            field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150,
                            edit: { params: { popupHeight: '300px' } }
                        }],
                    actionComplete: actionComplete
                }, done);
        });

        it('Edit start', (done: Function) => {
            actionComplete = (args?: any): void => {               
                if (args.requestType === 'beginEdit') {
                    done();
                }
            };
            grid.actionBegin = actionComplete;
            grid.selectRow(0, true);
            (<any>grid.toolbarModule).toolbarClickHandler({ item: { id: grid.element.id + '_edit' } });
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((grid.getCurrentViewRecords()[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            grid.actionComplete = actionComplete;
            (select('#' + grid.element.id + 'CustomerID', grid.element)  as any).value = 'updated';
            (<any>grid.toolbarModule).toolbarClickHandler({ item: { id: grid.element.id + '_update' } });
        });
        it('EJ2-60088 - Alignment issue while adding a new row with frozen columns with RowDD', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect((grid.element.querySelector('.e-normaledit') as any).colSpan).toBe(
                        grid.getVisibleColumns().length + 1);
                    done();
                }
            };
            grid.actionComplete = actionComplete;
            (<any>grid.toolbarModule).toolbarClickHandler({ item: { id: grid.element.id + '_add' } });
        });

        afterAll(() => {
            destroy(grid);
            grid = actionComplete = null;
        });
    });
    
    describe('foreignKey column virtualization with inline edit support', () => {
        let gridObj: Grid;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: normalData,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowFiltering: true,
                    filterSettings:{type:'Menu'},
                    enableVirtualization: true,
                    height: "200",
                    columns: [
                        { field: 'CustomerID',  headerText: 'Customer ID', width: 120, foreignKeyField: 'CustomerName', foreignKeyValue: 'ShipCountry', dataSource: foreigndata },
                        { field: 'OrderID', headerText: 'Order ID', width: 120, isPrimaryKey: true },
                        { field: 'Freight',  headerText: 'Freight', width: 120},
                        { field: 'ShipCountry',  headerText: 'Ship Country', width: 120 }
                    ],
                    actionComplete: actionComplete
                }, done);
        });
        it('edit check', (done: Function) => {
            actionComplete = (args?: any): void => {               
                if (args.requestType === 'beginEdit') {
                    done();
                }
            };
            gridObj.actionBegin = actionComplete;
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
            done();
        });

        it('dropdown input check', (done: Function) => {
            var elem = document.getElementById(gridObj.element.id + 'CustomerID_hidden');
            expect(elem.querySelector('option').innerText).toBe('France');
            done();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            actionComplete = null;
        });
    });

    describe('EJ2-61600 Right click problem after grouped columns when enableVirtualization is true => ', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    allowGrouping: true,
                    groupSettings: { columns : [ "CustomerID" ] },
                    enableVirtualization: true,
                    height: 300,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                    ],
                    actionComplete: actionComplete
                }, done);
        });

        it('Delete operation check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType == 'delete') {
                    done();
                }
            }
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_delete' } });
        });
        it('Add operation check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType == 'add') {
                    args.form.querySelector('td input').value = 1111111;
                        gridObj.endEdit();
                        gridObj.actionComplete = (args: any) => {
                            if (args.requestType == 'save') {
                                expect((gridObj.dataSource[0] as any).OrderID).toBe(1111111);
                                done();
                            }
                        };
                }
            }
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('845385 - deleteRecord with showDeleteConfirmDialog is not working', () => {
        let gridObj: Grid;
        let data = dataSource();
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 5),
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal',showDeleteConfirmDialog: true },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true },
                        { field: 'EmployeeID' },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity', type: 'string', editType: 'dropdownedit' }
                    ]
                }, done);
        });
    
        it('Delete a record programmatically', (done: Function) => {
           let actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    expect(gridObj.currentViewData.length).toBe(4);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.editModule.deleteRecord('OrderID', { OrderID: 10249 });
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-popup-open')).toBeTruthy();
            select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
        });
    
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
});

describe('Editing on ForeignKey column is not working in frozen grid when allowEditOnDblClick is false', () => {
    let gridObj: Grid;
    let actionComplete: (args: any) => void;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: normalData.slice(0, 3),
                allowPaging: true,
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, allowEditOnDblClick: false},
                columns: [
                { field: 'OrderID', width: 120, headerText: 'Order ID', isPrimaryKey: true, textAlign: 'Right', freeze: 'Left', validationRules: { required: true, number: true }},
                { field: 'EmployeeID', foreignKeyField: 'EmployeeID', foreignKeyValue: 'FirstName', dataSource: employeeData, width: 150, headerText: 'Customer Name', validationRules: { required: true }},
                { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150},
                ],
                actionComplete: actionComplete
            }, done);
    });

    it('select the first row', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'beginEdit') {
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.selectRow(0, true);
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });       
    });
    it('Edit complete', () => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.getContent().querySelectorAll('td')[1].innerHTML as any).toBe('Andrew');
            }
        };
        gridObj.actionComplete = actionComplete;
        (gridObj.element.querySelector('.e-dropdownlist') as any).ej2_instances[0].value = 2;        
        gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
        actionComplete = null;
    });
});

describe('EJ2-70349 - Last row gets removed, after adding a new row when page size set to ALL', () => {
    let gridObj: Grid;
    let actionComplete: (args: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData,
                allowPaging: true,
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true},
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 100, isPrimaryKey: true },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                    { field: 'Freight', headerText: 'Freight', textAlign: 'Right', width: 120, format: 'C2' },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 150 }
                ],
                pageSettings: { pageSizes: true, },
                actionComplete: actionComplete
            }, done);
    });

    it('Add start when page size set to ALL', (done: Function) => {
        (gridObj.pagerModule.pagerObj.pagerdropdownModule).setDropDownValue('value', gridObj.pageSettings.totalRecordsCount);   
        done();
    });

    it('Add complete', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.currentViewData.length).toBe(72);
                done();
            }
        };       
        gridObj.actionComplete = actionComplete;
        (<any>gridObj.editModule).editModule.addRecord({ OrderID: 10246, CustomerID: 'updated' });
    });

    it('Check current view data length', function () {
        gridObj.editSettings.mode = 'Batch'
    });

    it('Add complete', function () {
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 1024;
        gridObj.editModule.saveCell();
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        document.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
    });

    it('Check current view data length', function () {
        expect(gridObj.currentViewData.length).toBe(73);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
        actionComplete = null;
    });
});

describe('EJ2-835777 - Custom data source is not  assigned to the dropdown edit cell with Virtualization', () => {
    let gridObj: Grid;
    let actionComplete: (args: any) => void;
    let country = [
        { ShipCountry: 'Germany', countryId: '1' },
        { ShipCountry: 'Brazil', countryId: '3' },
        { ShipCountry: 'France', countryId: '4' },
        { ShipCountry: 'Belgium', countryId: '5' },
        { ShipCountry: 'Switzerland', countryId: '6' },
        { ShipCountry: 'Mexico', countryId: '8' },
        { ShipCountry: 'Austria', countryId: '12' },
        { ShipCountry: 'Spain', countryId: '9' },
        { ShipCountry: 'USA', countryId: '14' },
        { ShipCountry: 'Finland', countryId: '16' },
        { ShipCountry: 'Sweden', countryId: '18' },
    ];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                enableVirtualization: true,
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: {
                    allowEditing: true,
                    allowAdding: true,
                    allowDeleting: true,
                    mode: 'Normal',
                },
                height: "200",
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 100, isPrimaryKey: true, validationRules: { required: true }},
                    { field: 'CustomerID', headerText: 'Customer ID', width: 120, validationRules: { required: true, minLength: 3 }},
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 120, editType: 'dropdownedit',
                      edit: {
                        params: {
                          query: new Query(),
                          dataSource: country,
                          fields: { value: 'ShipCountry', text: 'countryId' },
                          actionComplete: () => false,
                        },
                      },
                    },
                  ],
                actionComplete: actionComplete
            }, done);
    });
    it('edit check', (done: Function) => {
        actionComplete = (args?: any): void => {               
            if (args.requestType === 'beginEdit') {
                done();
            }
        };
        gridObj.actionBegin = actionComplete;
        gridObj.selectRow(0, true);
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        done();
    });

    it('dropdown input value', (done: Function) => {
        var elem = document.getElementById(gridObj.element.id + 'ShipCountry_hidden');
        expect(elem.querySelector('option').innerText).toBe('4');
        done();
    });

    it('coverage improvement', () => {
        let tr: any = gridObj.getDataRows()[0];
        tr.style.display = 'none';
       gridObj.editModule.startEdit(tr);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
        actionComplete = null;
    });
});

describe('EJ2-851524 - Grouped complex data Row Reorder by edit functionalities', () => {
    let gridObj: Grid;
    let gdataSource = [
        {
          project: {
            id: 'b27585828a675f5acfef052dd',
            name: 'Leave',
            number: '1000000',
            description:
              'This project is used for personnel leave only.Please do not use this project unless personnel is going on leave.',
          },
          role: {
            id: 'f1720daf89ee3de12e77dd69c',
          },
        },
        {
          project: {
            id: 'c0d3c1454e0eec3d774d0bfe8',
            name: 'Project C',
            number: null,
            description: 'Building the coolest structure ever',
          },
          role: {
            id: '2589b2560b7338f055c0c9be3',
          },
        },
        {
          project: {
            id: 'c0d3c1454e0eec3d774d0bfe8',
            name: 'Project C',
            number: null,
            description: 'Building the coolest structure ever',
          },
          role: {
            id: '309068c34805da0a0cec63c6d',
          },
        },
        {
          project: {
            id: 'a6c827cce3fb0eee9dfa2395e',
            name: 'Project A',
            number: null,
            description: 'Building the coolest structure ever',
          },
          role: {
            id: 'd8094793b815df82db2c92728',
          },
        },
      ];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: gdataSource,
                editSettings: { allowEditing: true },
                allowGrouping: true,
                toolbar: ['Edit', 'Update', 'Cancel'],
                groupSettings: { columns: ['project.name'] },
                columns: [
                { field: 'role.id', headerText: 'Role Id', width: 250, isPrimaryKey: true },
                { field: 'project.name', headerText: 'project.name', width: 250 },
                {
                    field: 'project.description',
                    headerText: 'Project Description',
                    width: 250,
                },
                ],
            }, done);
    });

    it('edit complex data row', (done: Function) => {
        let actionComplete = (args?: any): void => {               
            if (args.requestType === 'beginEdit') {
                actionComplete = null;
                done();
            }
        };
        gridObj.actionBegin = actionComplete;
        gridObj.selectRow(1, true);
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
    });

    it('save complex data row', (done: Function) => {
        (select('#' + gridObj.element.id + 'project___description', gridObj.element) as any).value += 'updated';
        let actionComplete = (args?: any): void => {               
            if (args.requestType === 'save') {
                actionComplete = null;
                done();
            }
        };
        gridObj.actionBegin = actionComplete;
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
    });

    it('check not to be reorder', () => {
        expect((gridObj.getRowByIndex(1).previousSibling as HTMLElement).classList[0]).toBe('e-groupcaptionrow');
        expect((gridObj.getRowByIndex(1).nextSibling as HTMLElement).classList[0]).toBe('e-groupcaptionrow');
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
        gdataSource = null;
    });
});

describe('Grouped showgroupedcolumn complex data Row Reorder by edit functionalities', () => {
    let gridObj: Grid;
    let gdataSource = [
        {
          project: {
            id: 'b27585828a675f5acfef052dd',
            name: 'Leave',
            number: '1000000',
            description:
              'This project is used for personnel leave only.Please do not use this project unless personnel is going on leave.',
          },
          role: {
            id: 'f1720daf89ee3de12e77dd69c',
          },
        },
        {
          project: {
            id: 'c0d3c1454e0eec3d774d0bfe8',
            name: 'Project C',
            number: null,
            description: 'Building the coolest structure ever',
          },
          role: {
            id: '2589b2560b7338f055c0c9be3',
          },
        },
        {
          project: {
            id: 'c0d3c1454e0eec3d774d0bfe8',
            name: 'Project C',
            number: null,
            description: 'Building the coolest structure ever',
          },
          role: {
            id: '309068c34805da0a0cec63c6d',
          },
        },
        {
          project: {
            id: 'a6c827cce3fb0eee9dfa2395e',
            name: 'Project A',
            number: null,
            description: 'Building the coolest structure ever',
          },
          role: {
            id: 'd8094793b815df82db2c92728',
          },
        },
      ];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: gdataSource,
                editSettings: { allowEditing: true },
                allowGrouping: true,
                toolbar: ['Edit', 'Update', 'Cancel'],
                groupSettings: { columns: ['project.name'], showGroupedColumn: true },
                columns: [
                { field: 'role.id', headerText: 'Role Id', width: 250, isPrimaryKey: true },
                { field: 'project.name', headerText: 'project.name', width: 250 },
                {
                    field: 'project.description',
                    headerText: 'Project Description',
                    width: 250,
                },
                ],
            }, done);
    });

    it('edit grouped column complex data', (done: Function) => {
        let actionComplete = (args?: any): void => {               
            if (args.requestType === 'beginEdit') {
                actionComplete = null;
                done();
            }
        };
        gridObj.actionBegin = actionComplete;
        gridObj.selectRow(1, true);
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
    });

    it('save grouped column complex data', (done: Function) => {
        (select('#' + gridObj.element.id + 'project___name', gridObj.element) as any).value = 'Project C';
        let actionComplete = (args?: any): void => {               
            if (args.requestType === 'save') {
                actionComplete = null;
                done();
            }
        };
        gridObj.actionBegin = actionComplete;
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
    });

    it('check reordered successfully', () => {
        expect((gridObj.getRowByIndex(2).previousSibling as HTMLElement).classList[0]).toBe('e-row');
        expect((gridObj.getRowByIndex(2).nextSibling as HTMLElement).classList[0]).toBe('e-row');
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
        gdataSource = null;
    });
});

describe('Coverage Improvement', () => {
    let gridObj: Grid;
    let actionComplete: (args: any) => void;
    let actionBegin: (args: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: normalData,
                allowPaging: true,
                height: 300,
                enableVirtualization: true,
                frozenRows: 1,
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, allowEditOnDblClick: false},
                columns: [
                { field: 'OrderID', width: 120, headerText: 'Order ID', isPrimaryKey: true, textAlign: 'Right', freeze: 'Left', validationRules: { required: true, number: true }},
                { field: 'EmployeeID', foreignKeyField: 'EmployeeID', foreignKeyValue: 'FirstName', dataSource: employeeData, width: 150, headerText: 'Customer Name', validationRules: { required: true }},
                { field: 'Verified', type: 'boolean' }
                ],
                actionComplete: actionComplete
            }, done);
    });

    it('Edit start', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'beginEdit') {
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.selectRow(0, true);
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
    });

    it('Scroll Down', () => {
        gridObj.getContent().firstElementChild.scrollTop = 500;
    });

    it('Edit complete', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.isEdit).toBeFalsy();
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.actionBegin = actionBegin;
        (select('#' + gridObj.element.id + 'Verified', gridObj.element) as any).value = 'false';
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
    });

    it('check the addEventListener Binding', () => {
        gridObj.isDestroyed = true;
        gridObj.editModule.addEventListener();
        gridObj.isDestroyed = false;
    });


    // it('check the destroy method', () => {
    //     gridObj.element.innerHTML = '';
    //     gridObj.editModule.destroy();
    //     gridObj.element = null;
    //     gridObj.editModule.destroy();
    // });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
        actionComplete = null;
    });
});
