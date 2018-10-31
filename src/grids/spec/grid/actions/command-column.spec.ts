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

Grid.Inject(Group, Sort, Filter, Reorder, CommandColumn, Edit);

describe('Command Column ', () => {

    describe('Command Column Rendering feature', () => {
        let rows: HTMLTableRowElement;
        let grid: Grid;
        let element: Element = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
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
        });

    });

    describe('Command column with sorting, filtering, grouping enable', () => {
        let row: HTMLTableRowElement;
        let grid: Grid;
        let element: Element = createElement('div', { id: 'Grid' });
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
        });
    });
    describe('Command column with Editing enable', () => {
        let row: HTMLTableRowElement;
        let grid: Grid;
        let element: Element = createElement('div', { id: 'Grid' });
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
        });
    });
    describe('Command column with deleting', () => {
        let row: HTMLTableRowElement;
        let grid: Grid;
        let element: Element = createElement('div', { id: 'Grid' });
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
        });
    });
    describe('Command column with feature combinations', () => {
        let row: HTMLTableRowElement;
        let grid: Grid;
        let element: Element = createElement('div', { id: 'Grid' });
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
            grid.beforePrint = (args: { element: Element }) => {
                row = args.element.querySelector('.e-gridcontent').querySelectorAll('tr')[0];
                expect(row.firstElementChild.classList.contains('e-unboundcell')).toBeTruthy();
                done();
            };
            grid.print();
        });

        afterAll((done) => {
            destroy(grid);
            setTimeout(function () {
                done();
            }, 1000);

        });
    });
    describe('EJ2-7743 ShowConfirmDialog is not showing in Command Column => ', () => {
        let row: HTMLTableRowElement;
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
        });
    });

});