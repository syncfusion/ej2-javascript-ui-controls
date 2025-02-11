/**
 * Grid dialog edit spec document
 */
import { extend, getValue, select, initializeCSPTemplate } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { Edit } from '../../../src/grid/actions/edit';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Page } from '../../../src/grid/actions/page';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Selection } from '../../../src/grid/actions/selection';
import { filterData, data, normalData, foreigndata } from '../base/datasource.spec';
import { ColumnMenu} from '../../../src/grid/actions/column-menu';
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
                pending; //Skips test (in Chai)
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
            (select('#' + gridObj.element.id + 'CustomerID', document) as any).value = 'updated';
            (select('#'+gridObj.element.id+'_dialogEdit_wrapper', document).querySelectorAll('button') as any)[1].click();
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
            (select('#'+ gridObj.element.id +'OrderID', document) as any).value = 10247;
            (select('#'+ gridObj.element.id +'CustomerID', document) as any).value = 'updated';
            (select('#'+ gridObj.element.id +'_dialogEdit_wrapper', document).querySelectorAll('button') as any)[1].click();
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
            (select('#'+ gridObj.element.id +'CustomerID', document) as any).value = 'updatednew';
            (select('#'+ gridObj.element.id +'_dialogEdit_wrapper', document).querySelectorAll('button') as any)[2].click();
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
            (select('#'+ gridObj.element.id +'OrderID', document) as any).value = 10247;
            (select('#'+ gridObj.element.id +'CustomerID', document) as any).value = 'updatednew';
            (select('#'+ gridObj.element.id +'_dialogEdit_wrapper', document).querySelectorAll('button') as any)[2].click();
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
            (select('#' + gridObj.element.id + 'CustomerID', document) as any).value = 'updated';
            (select('#'+ gridObj.element.id +'_dialogEdit_wrapper', document).querySelectorAll('button') as any)[1].click();
        });

        it('check row selection on dialog close by esc and close icon', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    let td = (select('#' + gridObj.element.id + '_dialogEdit_wrapper', document).querySelectorAll('td.e-rowcell') as any)[0];
                    expect((td as HTMLElement).style.textAlign === 'left').toBe(true);
                    (select('#' + gridObj.element.id + '_dialogEdit_wrapper', document).querySelectorAll('.e-dlg-closeicon-btn') as any)[0].click();
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
                    (select('#' + gridObj.element.id + '_dialogEdit_wrapper', document).querySelectorAll('.e-dlg-closeicon-btn') as any)[0].click();
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].firstElementChild });
        });
        it('enableRtl alignment check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    let td = (select('#' + gridObj.element.id + '_dialogEdit_wrapper', document).querySelectorAll('td.e-rowcell') as any)[0];
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

    describe('EJ2-47615 - Throws script error while updating the data in Dialog editing => ', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowSelection: false,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog'},
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true  },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number' },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' }
                    ]
                }, done);
        });
        it('open dialog', () => {
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].firstElementChild });
        });
        it('save the data', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    done();
                }               
            };
            gridObj.actionComplete = actionComplete;
            (select('#'+ gridObj.element.id +'_dialogEdit_wrapper', document).querySelectorAll('button') as any)[1].click();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-50266 - Validation rules for grouped field columns are not working => ', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' },
                    allowGrouping: true,
                    groupSettings: {  columns: ['CustomerID'] },
                    allowPaging: true,
                    pageSettings: { pageCount: 5 },
                    toolbar: ['Add', 'Edit', 'Delete'],
                    columns: [
                        { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 140, validationRules: { required: true } },
                        { field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit', width: 120, format: 'C2' },
                        { field: 'OrderDate', headerText: 'Order Date', editType: 'datepickeredit', format: 'yMd', width: 170 },
                        { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150, 
                          edit: { params: { popupHeight: '300px' } } }
                    ]
                }, done);
        });
        it('Add Record', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });
        it('Check the validation message', () => {
            (select('#'+ gridObj.element.id +'_dialogEdit_wrapper', document).querySelectorAll('button') as any)[1].click();
            expect(document.querySelectorAll('.e-griderror').length).toBe(1);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-880899 - issue with validation message positioning in dialog edit mode with frozen columns => ', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0,5),
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' },
                    allowPaging: true,
                    toolbar: ['Add', 'Edit', 'Delete'],
                    columns: [
                        { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', validationRules: { required: true }, width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 140 },
                        { field: 'ShipCountry', headerText: 'Ship Country', freeze: 'Right' }
                    ]
                }, done);
        });
        it('Add Record', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });
        it('Check the validation message', () => {
            (select('#'+ gridObj.element.id +'_dialogEdit_wrapper', document).querySelectorAll('button') as any)[1].click();
            expect(gridObj.editModule.formObj.element.querySelectorAll('.e-griderror').length).toBeGreaterThan(0);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('Coverage Imrovement => ', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog', footerTemplate:'<div></div>' },
                    allowPaging: true,
                    pageSettings: { pageCount: 5 },
                    toolbar: ['Add', 'Edit', 'Delete'],
                    columns: [
                        { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 140, validationRules: { required: true } },
                        { field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit', width: 120, format: 'C2' },
                        { field: 'OrderDate', headerText: 'Order Date', editType: 'datepickeredit', format: 'yMd', width: 170 },
                        { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150,
                            edit: { params: { popupHeight: '300px' } } }
                    ]
                }, done);
        });
        it('End edit', () => {
            (<any>gridObj.editModule).editModule.endEdit();
        });
        it('Edit Start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            let tr: Element = gridObj.getContent().querySelectorAll('.e-row')[0];
            (<any>gridObj.editModule).editModule.startEdit(tr);
        });
        it('Close edit', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.editModule).editModule.closeEdit();
        });
        it('addRecord', () => {
            (<any>gridObj.editModule).editModule.addRecord({ OrderID: 10247, CustomerID: 'updated' });
            (<any>gridObj.editModule).editModule.deleteRecord();
        });

        it('called updateRow method', (done: Function) => {
            actionComplete = (args?: any): void => {
                gridObj.actionComplete = undefined;
                done();
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.editModule).editModule.updateRow(2, { OrderID: 10250, CustomerID: 'ALFKI' });
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Coverage Imrovement => ', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog', headerTemplate:'<div></div>' },
                    allowPaging: true,
                    pageSettings: { pageCount: 5 },
                    toolbar: ['Add', 'Edit', 'Delete'],
                    columns: [
                        { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 140, validationRules: { required: true } },
                        { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150,
                            edit: { params: { popupHeight: '300px' } } }
                    ]
                }, done);
        });

        it('Edit Start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            let tr: Element = gridObj.getContent().querySelectorAll('.e-row')[0];
            (<any>gridObj.editModule).editModule.startEdit(tr);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-897585 - When the foreign key column is grouped, the edit dialog of the selected record does not open properly with those records => ', ()=>{
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: normalData,
                    allowPaging: true,
                    allowGrouping: true,
                    groupSettings: { columns: ['CustomerID'] },
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' },
                    pageSettings: { pageCount: 5 },
                    toolbar: ['Add', 'Edit', 'Delete'],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, isPrimaryKey: true },
                        { field: 'CustomerID',  headerText: 'Customer ID', width: 120, foreignKeyField: 'CustomerName', foreignKeyValue: 'ShipCountry', dataSource: foreigndata },
                        { field: 'Freight',  headerText: 'Freight', width: 120},
                        { field: 'ShipCountry',  headerText: 'Ship Country', width: 120 }
                    ],
                }, done);
        });

        it('Verify the presence of the clicked row for editing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(args.rowData.OrderID).toBe(10252);
                    done();
                }
            }
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('EJ2-903864 - Maintaining Text Formatting in Edit Dialog for Multiline TextBox in Grid UI => ', () => {
        let gridObj: Grid;
        let stringParams: any = {
            params: {
                multiline: true,
                showClearButton: true
            }
        };
        let isEditMode: boolean = false;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: normalData,
                    editSettings: {
                        allowEditing: true,
                        allowAdding: true,
                        allowDeleting: true,
                        mode: 'Dialog'
                    },
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
                            field: 'ShipAddress', headerText: 'ShipAddress', width: 170, edit: stringParams, disableHtmlEncode: false, valueAccessor: (field: string, data: Object) => {
                                if (isEditMode) {
                                    const value: string = data['ShipAddress'];
                                    return value !== undefined ? value.split('<br>').join('\n') : '';
                                } else {
                                    const value: string = data['ShipAddress'];
                                    return value !== undefined ? value.split('\n').join('<br>') : '';
                                }
                            }
                        }
                    ],
                    actionBegin: (args: any) => {
                        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
                            isEditMode = true;
                        }
                        if (args.requestType === 'save') {
                            isEditMode = false;
                        }
                    },
                    actionComplete: actionComplete
                }, done);
        });

        it('Editing the row', function (done) {
            gridObj.actionComplete = function (args: any) {
                if (args.requestType === 'beginEdit') {
                    args.form.elements[4].ej2_instances[0].value = 'Updated\n value';
                    gridObj.endEdit();
                    done();
                }
            };
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].firstElementChild });
        });

        it('Verify the edited row', function (done) {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(args.rowData.ShipAddress).toBe('Updated\n value');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].firstElementChild });
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('EJ2-916181 - All template is not rendering in React when using the CSPTemplate function => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: normalData,
                    editSettings: {
                        allowEditing: true,
                        allowAdding: true,
                        allowDeleting: true,
                        mode: 'Dialog',
                        template: initializeCSPTemplate(function() {
                            return '<input id="CustomerID"name="CustomerID___CustomerID" value="${CustomerID}" style="height: 28px" />' })
                    },
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
                    ],
                }, done);
        });

        it('Coverage the getEditElement', function (done: Function) {
            gridObj.actionBegin = function (args: any) {
                if (args.requestType === 'beginEdit') {
                    (gridObj as any).editModule.renderer.renderer.getEditElement((gridObj as any).editModule.renderer.getEditElements(args), args);
                    done();
                }
            };
            gridObj.isReact = true;
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].firstElementChild });
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-934120 - Focus Border Missing on Grid Cell After Adding Rows in Syncfusion EJ2 Grid => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: normalData,
                    editSettings: {
                        allowEditing: true,
                        allowAdding: true,
                        allowDeleting: true,
                        mode: 'Dialog',
                    },
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
                    ],
                }, done);
        });

        it('Edit first row', function (done: Function) {
            gridObj.selectRow(0);
            gridObj.startEdit();
            done();
        });
        it('Clicks the save button', function (done: Function) {
            let dlgEle: any = document.getElementById(gridObj.element.id + '_dialogEdit_wrapper');
            dlgEle.querySelector('.e-footer-content').querySelector('.e-btn').click();
            done();
        });
        
        it('Check the border is applied to for the cell', function (done: Function) {
            expect(gridObj.element.querySelectorAll('.e-rowcell')[0].classList.contains('e-focused')).toBe(true);
            done();
        });

        it('Edit first row', function (done: Function) {
            gridObj.startEdit();
            done();
        });
        
        it('Clicks the cancel button', function (done: Function) {
            let dlgEle: any = document.getElementById(gridObj.element.id + '_dialogEdit_wrapper');
            dlgEle.querySelector('.e-footer-content').querySelectorAll('.e-btn')[1].click();
            done();
        });

        it('Check the border is applied to for the cell', function (done: Function) {
            expect(gridObj.element.querySelectorAll('.e-rowcell')[0].classList.contains('e-focused')).toBe(true);
            done();
        });

        it('Delete the selected first record', function (done: Function) {
            gridObj.deleteRecord();
            done();
        });

        it('Check the border is applied to for the cell', function (done: Function) {
            expect(gridObj.element.querySelectorAll('.e-rowcell')[0].classList.contains('e-focused')).toBe(true);
            done();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
});
