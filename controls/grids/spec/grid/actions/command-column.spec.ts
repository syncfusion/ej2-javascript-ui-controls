/**
 * Command Column spec
 */
import { EmitType, L10n } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Column } from '../../../src/grid/models/column';
import { data } from '../base/datasource.spec';
import { CommandColumn } from '../../../src/grid/actions/command-column';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { Edit } from '../../../src/grid/actions/edit';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Filter } from '../../../src/grid/actions/filter';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';
import { DetailRow } from '../../../src/grid/actions/detail-row';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';


Grid.Inject(Group, Sort,DetailRow, Filter, Reorder, CommandColumn, Edit, VirtualScroll);

describe('Command Column ', () => {

    describe('Command Column Rendering feature', () => {
        let rows: HTMLTableRowElement;
        let grid: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            grid = createGrid(
                {
                    columns: [
                        {
                            commands: [{ type: 'Edit', buttonOption: { content: 'edit' } },
                            { type: 'Delete', buttonOption: { content: 'delete' } },
                            { type: 'Save', buttonOption: { content: 'save' } },
                            { type: 'Cancel', buttonOption: { content: 'cancel' } }
                            ], headerText: 'Command Column'
                        }
                    ],
                    dataSource: [{ data: { a: 1 }, b: 5, c: true, d: new Date() },
                    { data: { a: 2 }, b: 6, c: false, d: new Date() }],
                    allowPaging: false
                }, done);
        });

        it('Command Column initial render checking', () => {
            rows = <HTMLTableRowElement>grid.getRows()[0];
            expect(rows.querySelector('.e-unboundcelldiv').children.length).toBe(4);
            expect(rows.querySelector('.e-unboundcelldiv').children[0].classList.contains('e-edit-delete')).toBeTruthy();
            expect(rows.querySelector('.e-unboundcelldiv').children[1].classList.contains('e-edit-delete')).toBeTruthy();
            expect(rows.querySelector('.e-unboundcelldiv').children[2].classList.contains('e-save-cancel')).toBeTruthy();
            expect(rows.querySelector('.e-unboundcelldiv').children[3].classList.contains('e-save-cancel')).toBeTruthy();
            expect(rows.querySelector('.e-unboundcelldiv').children[2].classList.contains('e-hide')).toBeTruthy();
            expect(rows.querySelector('.e-unboundcelldiv').children[3].classList.contains('e-hide')).toBeTruthy();
            expect(rows.querySelector('.e-unboundcelldiv').children[0].classList.contains('e-editbutton')).toBeTruthy();
            expect(rows.querySelector('.e-unboundcelldiv').children[1].classList.contains('e-deletebutton')).toBeTruthy();
            expect(rows.querySelector('.e-unboundcelldiv').children[2].classList.contains('e-savebutton')).toBeTruthy();
            expect(rows.querySelector('.e-unboundcelldiv').children[3].classList.contains('e-cancelbutton')).toBeTruthy();
        });

        it('Render Command Column with single string', (done: Function) => {

            grid.dataBound = () => {
                rows = <HTMLTableRowElement>grid.getRows()[0];
                expect(rows.querySelector('.e-unboundcelldiv').children[0].classList.contains('e-deletebutton')).toBeTruthy();
                done();
            };
            (<Column>grid.columns[0]).commands = [{ type: 'Delete', buttonOption: { content: 'delete' } }];
            grid.refresh();
        });
        it('Render Command Column with predefined and custom buttons', (done: Function) => {
            let buttonClick = (args: Event) => {
                expect((<HTMLElement>args.target).classList.contains('e-details')).toBeTruthy();
                done();
            };
            grid.dataBound = () => {
                rows = <HTMLTableRowElement>grid.getRows()[0];
                expect((<HTMLElement>rows.querySelector('.e-unboundcelldiv').children[1]).innerText.toLowerCase()).toBe('details');
                expect((<HTMLElement>rows.querySelector('.e-unboundcelldiv').children[0]).innerText.toLowerCase()).toBe('edit');
                (<HTMLElement>rows.querySelector('.e-details')).click();
            };
            (<Column>grid.columns[0]).commands = [{ type: 'Edit', buttonOption: { content: 'edit' } },
            { buttonOption: { content: 'Details', click: buttonClick, cssClass: 'e-details' } }];
            grid.refresh();
        });

        afterAll(() => {
            destroy(grid);
            grid = rows = null;
        });

    });

    describe('Command column with sorting, filtering, grouping enable', () => {
        let row: HTMLTableRowElement;
        let grid: Grid;
        let actionBegin: (e?: Object) => void;
        let actionComplete: (e?: Object) => void;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: data,
                    allowGrouping: true,
                    allowFiltering: true,
                    allowSorting: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' },
                    {
                        commands: [{ type: 'Edit', buttonOption: { content: 'edit' } },
                        { type: 'Delete', buttonOption: { content: 'delete' } },
                        { type: 'Cancel', buttonOption: { content: 'cancel' } },
                        { type: 'Save', buttonOption: { content: 'save' } }
                        ], headerText: 'Command Column'
                    }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                }, done);
        });
        it('Initial checking', () => {
            row = <HTMLTableRowElement>grid.getRows()[3];
            expect(row.querySelector('.e-unboundcelldiv').children.length).toBe(4);
            (<HTMLElement>row.querySelector('.e-unboundcelldiv').children[0]).click();
        });
        it('grouping, sorting, filtering test', () => {
            expect((<Column>grid.columns[5]).allowGrouping).toBeFalsy();
            expect((<Column>grid.columns[5]).allowFiltering).toBeFalsy();
            expect((<Column>grid.columns[5]).allowSorting).toBeFalsy();
            // for coverage
            grid.isDestroyed = true;
            (<any>grid).commandColumnModule.addEventListener();
            (<any>grid).commandColumnModule.destroy();
            (<any>grid).commandColumnModule.removeEventListener();
            grid.isDestroyed = false;
            (<any>grid).commandColumnModule.removeEventListener();
            (<any>grid).commandColumnModule.destroy();
        });

        afterAll(() => {
            destroy(grid);
            grid = row = actionBegin = actionComplete = null;
        });
    });
    describe('Command column with Editing enable', () => {
        let grid: Grid;
        let actionBegin: (e?: Object) => void;
        let actionComplete: (e?: Object) => void;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: data.map(data => data),
                    editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true },
                    columns: [{ field: 'OrderID', isPrimaryKey: true }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' },
                    {
                        commands: [{ type: 'Edit', buttonOption: { content: 'edit' } },
                        { type: 'Delete', buttonOption: { content: 'delete' } },
                        { type: 'Cancel', buttonOption: { content: 'cancel' } },
                        { type: 'Save', buttonOption: { content: 'save' } }
                        ], headerText: 'Command Column'
                    }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                }, done);
        });

        it('Editing feature with command edit', (done: Function) => {
            grid.actionComplete = (args) => {
                if (args.requestType === 'beginEdit') {
                    expect(grid.getRows()[0].querySelector('.e-unboundcelldiv').children[0].classList.contains('e-hide')).toBeTruthy();
                    (<any>grid).commandColumnModule.commandClickHandler({ target: grid.getRows()[0].querySelector('.e-unboundcelldiv').children[3] });
                }
                if (args.requestType === 'save') {
                    done();
                }
            }
            expect(grid.getRows()[0].querySelector('.e-unboundcelldiv').children.length).toBe(4);
            (<any>grid).commandColumnModule.commandClickHandler({ target: grid.getRows()[0].querySelector('.e-unboundcelldiv').children[0] });
        });

        it('Editing feature with edit new row', (done: Function) => {
            grid.actionComplete = (args) => {
                if (args.requestType === 'beginEdit') {
                    expect(grid.getRows()[4].querySelector('.e-unboundcelldiv').children[0].classList.contains('e-hide')).toBeTruthy();
                    (<any>grid).commandColumnModule.commandClickHandler({ target: grid.getRows()[2].querySelector('.e-unboundcelldiv').children[0] });
                }
                if (args.requestType === 'save') {
                    grid.actionComplete = undefined;
                    (<any>grid).commandColumnModule.commandClickHandler({ target: grid.getRows()[2].querySelector('.e-unboundcelldiv').children[2] });
                    done();
                }
            }
            (<any>grid).commandColumnModule.commandClickHandler({ target: grid.getRows()[4].querySelector('.e-unboundcelldiv').children[0] });
        });


        it('keyboard Testing', (done) => {
            grid.actionComplete = (args) => {
                if (args.requestType === 'beginEdit') {
                    expect(grid.getRows()[0].querySelector('.e-unboundcelldiv').children[0].classList.contains('e-hide')).toBeTruthy();
                    done();
                }
            }
            (<any>grid).commandColumnModule.keyPressHandler({ action: 'enter', target: grid.getRows()[0].querySelector('.e-unboundcelldiv').children[0], preventDefault: function () { } });
            (<any>grid).commandColumnModule.keyPressHandler({ action: 'enter', target: grid.getRows()[0].querySelector('.e-unboundcelldiv'), preventDefault: function () { } });
        });

        afterAll(() => {
            destroy(grid);
            grid = actionBegin = actionComplete = null;
        });
    });
    describe('Command column with deleting', () => {
        let grid: Grid;
        let actionBegin: (e?: Object) => void;
        let actionComplete: (e?: Object) => void;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    columns: [
                        { field: 'b' },
                        {
                            commands: [{ type: 'Edit', buttonOption: { content: 'edit' } },
                            { type: 'Delete', buttonOption: { content: 'delete' } },
                            { type: 'Cancel', buttonOption: { content: 'cancel' } },
                            { type: 'Save', buttonOption: { content: 'save' } },
                            { buttonOption: { content: 'Details' } }], headerText: 'Command Column'
                        }
                    ],
                    dataSource: [{ data: { a: 1 }, b: 5, c: true, d: new Date() },
                    { data: { a: 2 }, b: 6, c: false, d: new Date() }],
                    editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true },
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                }, done);
        });

        it('Editing feature with delete command', (done: Function) => {
            grid.actionComplete = (args) => {
                if (args.requestType === 'delete') {
                    expect(grid.getRows()[0].querySelector('.e-unboundcelldiv').children[0].classList.contains('e-hide')).toBeFalsy();
                    done();
                }
            }
            (<any>grid).commandColumnModule.commandClickHandler({ target: grid.getRows()[grid.getRows().length - 1].querySelector('.e-unboundcelldiv').children[1] });
        });

        afterAll(() => {
            destroy(grid);
            grid = actionBegin = actionComplete = null;
        });
    });
    describe('Command column with feature combinations', () => {
        let row: HTMLTableRowElement;
        let grid: Grid;
        let actionBegin: (e?: Object) => void;
        let actionComplete: (e?: Object) => void;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: data,
                    allowReordering: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' },
                    {
                        field: 'commandcolumn', commands: [{ type: 'Edit', buttonOption: { content: 'edit' } },
                        { type: 'Delete', buttonOption: { content: 'delete' } },
                        { type: 'Cancel', buttonOption: { content: 'cancel' } },
                        { type: 'Save', buttonOption: { content: 'save' } },
                        { buttonOption: { content: 'Details' } }
                        ], headerText: 'Command Column'
                    }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                }, done);
        });

        it('Reordering the command column', (done: Function) => {
            let commandColumn: Column = <Column>grid.columns[5];
            grid.actionComplete = () => {
                expect((<Column>grid.columns[0]).headerText).toBe(commandColumn.headerText);
                done();
            };
            grid.reorderModule.reorderColumns('commandcolumn', 'OrderID');
        });

        it('Selection with command column', (done: Function) => {
            grid.rowSelected = () => {
                expect(grid.getRows()[0].children[0].classList.contains('e-selectionbackground')).toBeTruthy();
                done();
            };
            grid.actionComplete = undefined;
            (<HTMLElement>grid.getContent().querySelector('tr').firstElementChild).click();
        });

        it('CommandColumn with print', (done: Function) => {
            grid.beforePrint = (args: { element: Element, cancel?: boolean }) => {
                row = args.element.querySelector('.e-gridcontent').querySelectorAll('tr')[0];
                expect(row.firstElementChild.classList.contains('e-unboundcell')).toBeTruthy();
                args.cancel = true;
                done();
            };
            grid.print();
        });

        afterAll((done) => {
            destroy(grid);
            setTimeout(function () {
                done();
            }, 1000);
            grid = row = actionBegin = actionComplete = null;

        });
    });
    describe('EJ2-7743 ShowConfirmDialog is not showing in Command Column => ', () => {
        let grid: Grid;
        let actionBegin: (e?: Object) => void;
        let actionComplete: (e?: Object) => void;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    columns: [
                        { field: 'b' },
                        {
                            commands: [{ type: 'Edit', buttonOption: { content: 'edit' } },
                            { type: 'Delete', buttonOption: { content: 'delete' } },
                            { type: 'Cancel', buttonOption: { content: 'cancel' } },
                            { type: 'Save', buttonOption: { content: 'save' } },
                            { buttonOption: { content: 'Details' } }], headerText: 'Command Column'
                        }
                    ],
                    dataSource: [{ data: { a: 1 }, b: 5, c: true, d: new Date() },
                    { data: { a: 2 }, b: 6, c: false, d: new Date() }],
                    editSettings: { showDeleteConfirmDialog: true, allowAdding: true, allowDeleting: true, allowEditing: true },
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                }, done);
        });

        it('Editing feature with delete command', () => {
            grid.clearSelection();
            (<any>grid).commandColumnModule.commandClickHandler({ target: grid.getRows()[0].querySelector('.e-unboundcelldiv').children[1] });
            let dlg: any = grid.element.querySelector('#' + grid.element.id + 'EditConfirm');
            expect(dlg).not.toBeUndefined();
            grid.element.querySelector('#' + grid.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('Editing feature with delete command with selection', () => {
            grid.selectRow(0);
            (<any>grid).commandColumnModule.commandClickHandler({ target: grid.getRows()[0].querySelector('.e-unboundcelldiv').children[1] });
            let dlg: any = grid.element.querySelector('#' + grid.element.id + 'EditConfirm');
            expect(dlg).not.toBeUndefined();
            grid.element.querySelector('#' + grid.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        afterAll(() => {
            destroy(grid);
            grid = actionBegin = actionComplete = null;
        });
    });
    describe('Support for command column localization', () => {
        let rows: HTMLTableRowElement;
        let grid: Grid;
        beforeAll((done: Function) => {
            L10n.load({
                'de-DE': {
                    'grid': {
                        'Delete':'language'
                    }
                }
            });
            grid = createGrid(
                {
                    columns: [
                        {
                            commands: [{ type: 'Edit', buttonOption: { iconCss: ' e-icons e-edit', cssClass: 'e-flat' } },
                            { type: 'Delete', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat' } },
                            { type: 'Save', buttonOption: { iconCss: 'e-icons e-update', cssClass: 'e-flat' } },
                            { type: 'Cancel', buttonOption: { iconCss: 'e-icons e-cancel-icon', cssClass: 'e-flat' } }
                            ], headerText: 'Command Column'
                        }
                    ],
                    dataSource: [{ data: { a: 1 }, b: 5, c: true, d: new Date() },
                    { data: { a: 2 }, b: 6, c: false, d: new Date() }], locale: 'de-DE',
                    allowPaging: false
                }, done);
        });

        it('Command Column initial render checking', () => {
            rows = <HTMLTableRowElement>grid.getRows()[0];
            expect(rows.querySelector('.e-unboundcelldiv').children[1].getAttribute('title')).toBe('language');
        });

        afterAll(() => {
            destroy(grid);
            grid = rows = null;
        });
    });

    describe('Inline editing custom command => ', function () {
        let gridObj: Grid;
        beforeAll(function (done) {
            gridObj = createGrid({
                dataSource: data,
                detailTemplate: '#detailtemplate',
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                allowPaging: true,
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right',
                     commands: [{ type: 'Save',buttonOption: { content: 'done', cssClass: 'e-flat' } }] },
                    { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' },
                    { commands: [{ type: 'Edit', buttonOption: { content: 'Verified', cssClass: 'e-flat' } }] },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 150 }
                ]
            
            }, done);
        });
        it('Custom command column checking', function () {
            let rows = <HTMLTableRowElement>gridObj.getRows()[0];
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].lastElementChild });
            expect(gridObj.isEdit).toBeTruthy();
            expect(rows.querySelectorAll('.e-unboundcelldiv')[0].querySelector('.e-btn').getAttribute('title')).toBe('done');
            expect(rows.querySelectorAll('.e-unboundcelldiv')[1].querySelector('.e-btn').getAttribute('title')).toBe('Verified');
            (gridObj.editModule as any).editModule.endEdit();
            expect(gridObj.isEdit).toBeFalsy();     
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
        afterAll(function () {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Batch editing delete with command column => ', function () {
        let gridObj: Grid;
        beforeAll(function (done) {
            gridObj = createGrid({
                dataSource: data.slice(0,8),
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch',
                showConfirmDialog: false },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                allowPaging: true,
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right'},
                    { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 150 },
                    { headerText: 'Manage Records', width: 160,
                    commands: [{ type: 'Edit', buttonOption: { iconCss: ' e-icons e-edit', cssClass: 'e-flat' } },
                        { type: 'Delete', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat' } },
                        { type: 'Save', buttonOption: { iconCss: 'e-icons e-update', cssClass: 'e-flat' } },
                        { type: 'Cancel', buttonOption: { iconCss: 'e-icons e-cancel-icon', cssClass: 'e-flat' } }]
                }
                ]
            
            }, done);
        });
        it('Delete operation with Batch mode', function () {
            expect((<any>gridObj).dataSource.length).toBe(8);            
            (<any>gridObj).getContent().querySelector('.e-unboundcelldiv').children[1].click();
            (gridObj.element.querySelector('.e-update') as any).click();
            expect((<any>gridObj).dataSource.length).toBe(7);            
           });
  
        afterAll(function () {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-34867 - Custom command column command button id checking => ', function () {
        let gridObj: Grid;
        beforeAll(function (done) {
            gridObj = createGrid({
                dataSource: data,
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                allowPaging: true,
                columns: [
                    { headerText: 'Command Column 1', width: 160, commands: [{ buttonOption: { content: 'ADD', cssClass: 'e-flat' }}]},
                    { headerText: 'Command Column 2', width: 160, commands: [{ buttonOption: { content: 'SUB', cssClass: 'e-flat' }}]},
                    { headerText: 'Command Column 3', width: 160, commands: [{ buttonOption: { content: 'MUL', cssClass: 'e-flat' }}]},
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right' }
                ]
            
            }, done);
        });
        it('Custom command column command button id checking', function () {
            let rows = <HTMLTableRowElement>gridObj.getRows()[0];
            let uid1 = gridObj.getRows()[0].querySelectorAll('.e-unboundcelldiv')[0].querySelector('.e-btn').getAttribute('data-uid');
            let uid2 = gridObj.getRows()[0].querySelectorAll('.e-unboundcelldiv')[1].querySelector('.e-btn').getAttribute('data-uid');
            let uid3 = gridObj.getRows()[0].querySelectorAll('.e-unboundcelldiv')[2].querySelector('.e-btn').getAttribute('data-uid');
            let buttonId1 = gridObj.element.id + '_' + '0' + '_' + uid1;
            let buttonId2 = gridObj.element.id + '_' + '0' + '_' + uid2;
            let buttonId3 = gridObj.element.id + '_' + '0' + '_' + uid3;
            expect(rows.querySelectorAll('.e-unboundcelldiv')[0].querySelector('.e-btn').getAttribute('id')).toBe(buttonId1);
            expect(rows.querySelectorAll('.e-unboundcelldiv')[1].querySelector('.e-btn').getAttribute('id')).toBe(buttonId2);
            expect(rows.querySelectorAll('.e-unboundcelldiv')[2].querySelector('.e-btn').getAttribute('id')).toBe(buttonId3);
           });
        afterAll(function () {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-41958 - Script error throws when click command buttons with virtualization => ', function () {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll(function (done) {
            gridObj = createGrid({
                dataSource: data,
                height: 300,
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, showConfirmDialog: false },
                pageSettings: {pageCount: 5},
                enableVirtualization: true,
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right'},
                    { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 150 },
                    { headerText: 'Manage Records', width: 160,
                    commands: [{ type: 'Edit', buttonOption: { iconCss: ' e-icons e-edit', cssClass: 'e-flat' } },
                        { type: 'Delete', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat' } },
                        { type: 'Save', buttonOption: { iconCss: 'e-icons e-update', cssClass: 'e-flat' } },
                        { type: 'Cancel', buttonOption: { iconCss: 'e-icons e-cancel-icon', cssClass: 'e-flat' } }]
                }
                ],
                actionComplete: actionComplete
            }, done);
        });

        it('Check Edit state', function (done: Function) {
            actionComplete = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj).getContent().querySelector('.e-unboundcelldiv').children[0].click();     
           });
  
        afterAll(function () {
            destroy(gridObj);
            gridObj = null;
        });
    });
});