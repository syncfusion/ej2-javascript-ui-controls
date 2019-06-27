/**
 * Grid dialog edit spec document
 */
import { extend, getValue } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { Edit } from '../../../src/grid/actions/edit';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Page } from '../../../src/grid/actions/page';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Selection } from '../../../src/grid/actions/selection';
import { filterData, data } from '../base/datasource.spec';import { ColumnMenu} from '../../../src/grid/actions/column-menu';
import { ContextMenu } from '../../../src/grid/actions/context-menu';
import { ContextMenuOpenEventArgs } from '../../../src/grid/base/interface';
import { ColumnMenuOpenEventArgs } from '../../../src/grid/base/interface';
import { createGrid, destroy } from '../base/specutil.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

Grid.Inject(Filter, Page, Selection, Group, Edit, Sort, Reorder, Toolbar, ColumnMenu, ContextMenu);

describe('Dialog Editing module', () => {

    let dataSource: Function = (): Object[] => {
        let data: Object[] = [];
        for (let i = 0; i < filterData.length; i++) {
            data.push(extend({}, {}, filterData[i], true));
        }
        return data;
    };
    let dialogData: Object[] = dataSource();

    describe('Dialog editing render => ', () => {
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
                    dataSource: dialogData,
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
                    expect(document.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(document.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(document.querySelectorAll('form').length).toBe(1);
                    let cells = document.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
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
            (document.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            (document.querySelector('#'+gridObj.element.id+'_dialogEdit_wrapper').querySelectorAll('button') as any)[1].click();
        });

        it('Add start', (done: Function) => {
            //last action check
            expect(document.querySelectorAll('.e-gridform').length).toBe(0);
            //form destroy check
            expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
            expect(document.querySelectorAll('form').length).toBe(0);

            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(document.querySelectorAll('.e-insertedrow').length).toBe(1);
                    expect(document.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(document.querySelectorAll('form').length).toBe(1);
                    let cells = document.querySelector('.e-insertedrow').querySelectorAll('.e-rowcell');
                    expect(cells.length).toBe(gridObj.getVisibleColumns().length);
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
            expect(document.querySelectorAll('.e-editedrow').length).toBe(0);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(document.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(document.querySelectorAll('form').length).toBe(0);

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
            (document.querySelector('#'+ gridObj.element.id +'OrderID') as any).value = 10247;
            (document.querySelector('#'+ gridObj.element.id +'CustomerID') as any).value = 'updated';
            (document.querySelector('#'+ gridObj.element.id +'_dialogEdit_wrapper').querySelectorAll('button') as any)[1].click();
        });


        it('Delete action', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(71);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(71);
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
            expect(document.querySelectorAll('.e-insertedrow').length).toBe(0);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_delete' } });
        });

        it('Edit-cancel start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(document.querySelectorAll('.e-editedrow').length).toBe(1);
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
            (document.querySelector('#'+ gridObj.element.id +'CustomerID') as any).value = 'updatednew';
            (document.querySelector('#'+ gridObj.element.id +'_dialogEdit_wrapper').querySelectorAll('button') as any)[2].click();
        });

        it('Add-cancel start', (done: Function) => {
            //last action check
            expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
            expect(gridObj.element.querySelectorAll('form').length).toBe(0);
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(document.querySelectorAll('.e-insertedrow').length).toBe(1);
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
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
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
            (document.querySelector('#'+ gridObj.element.id +'OrderID') as any).value = 10247;
            (document.querySelector('#'+ gridObj.element.id +'CustomerID') as any).value = 'updatednew';
            (document.querySelector('#'+ gridObj.element.id +'_dialogEdit_wrapper').querySelectorAll('button') as any)[2].click();
        });

        it('toolbar status check', () => {
            expect(document.querySelectorAll('.e-gridform').length).toBe(0);
            expect(document.querySelectorAll('form').length).toBe(0);
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
        });

        it('dbl edit start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(document.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(document.querySelectorAll('.e-gridform').length).toBe(1);
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
            (document.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            (document.querySelector('#'+ gridObj.element.id +'_dialogEdit_wrapper').querySelectorAll('button') as any)[1].click();
        });

        it('check row selection on dialog close by esc and close icon', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    let td = (document.querySelector('#' + gridObj.element.id + '_dialogEdit_wrapper').querySelectorAll('td.e-rowcell') as any)[0];
                    expect((td as HTMLElement).style.textAlign === 'left').toBe(true);
                    (document.querySelector('#' + gridObj.element.id + '_dialogEdit_wrapper').querySelectorAll('.e-dlg-closeicon-btn') as any)[0].click();
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
                    (document.querySelector('#' + gridObj.element.id + '_dialogEdit_wrapper').querySelectorAll('.e-dlg-closeicon-btn') as any)[0].click();
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].firstElementChild });
        });
        it('enableRtl alignment check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    let td = (document.querySelector('#' + gridObj.element.id + '_dialogEdit_wrapper').querySelectorAll('td.e-rowcell') as any)[0];
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
            gridObj = actionBegin = actionComplete = null;
    
        });
    });

    describe('grid css class functionalities', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowSelection: true,
                    showColumnMenu: true,
                    allowGrouping: true,
                    selectionSettings: { type: 'Multiple' },
                    toolbar:['Add','Delete','Edit','ColumnChooser'],
                    editSettings:{allowEditing:true ,allowAdding:true,allowDeleting:true , mode:"Dialog"},
                    enableHover: false,
                    allowFiltering: true,
                    showColumnChooser: true,
                    filterSettings:{type:"Excel"},                   
                    contextMenuItems: ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
                    'Copy', 'Edit', 'Delete', 'Save', 'Cancel',
                    'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
                    'LastPage', 'NextPage'],
                    
                    columns: [
                        {
                            field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', width: 120, defaultValue: ''
                        },
                        {
                            field: 'CustomerID', headerText: 'Customer ID', width: 140, defaultValue: ''
                        },
                        {
                            field: 'Freight', headerText: 'Freight', textAlign: 'Right',
                            width: 120, format: 'C2'
                        },
                        {
                            field: 'OrderDate', headerText: 'Order Date',
                            format: 'yMd', width: 170
                        },
                        {
                            field: 'ShipCountry', headerText: 'Ship Country', width: 150
                        }],
                      
                }, done);
                gridObj.element.classList.add('e-bigger');                
        });
        it('context menu CSS class Test', (done: Function) => {
            gridObj.contextMenuOpen = function (args: ContextMenuOpenEventArgs) {
                   done();
            }
            let eventArgs = { target: gridObj.getHeaderTable().querySelector('th') };
            let e = {
                event: eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr.edoas')
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);           
            expect((gridObj.contextMenuModule as any).element.parentElement.classList.contains('e-bigger')).toBeTruthy();
            (gridObj.contextMenuModule as any).contextMenu.close();
               });
               
        it('dialog-css class Test', () => {  
            
                 
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].firstElementChild });
            expect(document.getElementById(gridObj.element.id +'_dialogEdit_wrapper').parentElement.classList.contains('e-bigger')).toBeTruthy();
            gridObj.editModule.closeEdit();
                                
        });       
        
        it('column menu open', (done: Function) => {
            gridObj.columnMenuOpen = function(args: ColumnMenuOpenEventArgs){               
                done();
            }
            gridObj.dataBind();
            (gridObj.getHeaderContent().querySelector('.e-columnmenu') as HTMLBRElement).click();           
            expect((gridObj.columnMenuModule as any).element.parentElement.classList.contains('e-bigger')).toBeTruthy();                           
            
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
        
    });   

    describe('Dialog editing render => ', () => {
        let gridObj: Grid;      
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dialogData,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, 
                        mode: 'Dialog', dialog: { params : {height: '500px', width: '400px'} }},
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' }
                    ]
                }, done);
        });
        it('DialogEdit start', () => {
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].firstElementChild });

        });
        it('Check the dialog height', () => {
            expect((document.querySelectorAll('.e-popup-open')[0] as any).style.height).toBe('500px');
            expect((document.querySelectorAll('.e-popup-open')[0] as any).style.width).toBe('400px');
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
        afterAll((done) => {           
           destroy(gridObj);
            setTimeout(function () {
                done();
            }, 1000);
            gridObj = dialogData = dataSource = null;
    
        });
    });

});
