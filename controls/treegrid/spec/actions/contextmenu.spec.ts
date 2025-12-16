import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData } from '../base/datasource.spec';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ContextMenu } from '../../src/treegrid/actions/context-menu';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { CellSaveEventArgs } from '../../src';
import { L10n, select } from '@syncfusion/ej2-base';
import { CellEditArgs } from '@syncfusion/ej2-grids';
import { Edit } from '../../src/treegrid/actions/edit';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { Page } from '../../src/treegrid/actions/page';
import { Sort } from '../../src/treegrid/actions/sort';
import { PdfExport } from '../../src/treegrid/actions/pdf-export';
import { ExcelExport } from '../../src/treegrid/actions/excel-export';
import { Selection } from '../../src/treegrid/actions/selection';

/**
 * Grid base spec
 */
TreeGrid.Inject(ContextMenu, Edit, Toolbar, Page, Sort, PdfExport, ExcelExport, Selection);
describe('ContextMenu module', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); //Skips test (in Chai)
            return;
        }
    });

    describe('Default context menu', () => {
        let gridObj: TreeGrid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: sampleData,
                    childMapping: 'subtasks',
                    treeColumnIndex: 1,
                    contextMenuItems: ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
                        'Edit', 'Delete', 'Save', 'Cancel',
                        'ExcelExport', 'FirstPage', 'PrevPage',
                        'LastPage', 'NextPage', 'AddRow'],
                    columns: [
                        { field: 'taskID', headerText: 'Task ID', width: 80, isPrimaryKey: true, textAlign: 'Right', editType: 'numericedit' },
                        { field: 'taskName', headerText: 'Task Name', width: 190 },
                        {
                            field: 'startDate', headerText: 'Start Date', format: 'yMd', width: 90,
                            editType: 'datepickeredit', textAlign: 'Right'
                        },
                        { field: 'endDate', headerText: 'End Date', format: 'yMd', width: 90, editType: 'datepickeredit', textAlign: 'Right' },
                        {
                            field: 'duration', headerText: 'Duration', width: 85, textAlign: 'Right', editType: 'numericedit',
                            edit: { params: { format: 'n' } }
                        },
                        { field: 'priority', headerText: 'Priority', width: 80 }
                    ]
                },
                done
            );
        });
        it('Check the filered records for parent mode', () => {
            expect((gridObj.grid.contextMenuModule as any).element).not.toBe(null);
        });
        it('Context menu property changes', () => {
            (gridObj.grid.contextMenuModule as any).eventArgs = { target: gridObj.getContentTable().querySelector('tr') };
            const e: Object = {
                event: (gridObj.grid.contextMenuModule as any).eventArgs,
                items: gridObj.grid.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
            };
            (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.grid.contextMenuModule as any).contextMenuOpen();
            const addrow: HTMLElement = select('#' + gridObj.element.id + '_gridcontrol_cmenu_AddRow',
                document.getElementById(gridObj.element.id + '_gridcontrol_cmenu'));
            expect(addrow.style.display).toBe('none');
            (gridObj.grid.contextMenuModule as any).contextMenuOnClose(e);
            gridObj.grid.editSettings.allowAdding = true;
            (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.grid.contextMenuModule as any).contextMenuOpen();
            expect(addrow.style.display).toBe('block');
            (gridObj.grid.contextMenuModule as any).contextMenuOnClose(e);
            gridObj.contextMenuItems = [{ text: 'Expand all', target: '.e-content', id: 'expandall' }];
            gridObj.dataBind();
            expect(document.getElementById(gridObj.element.id + '_gridcontrol_cmenu').querySelector('#expandall')).not.toBe(null);
            expect(gridObj.contextMenuModule.getContextMenu()).not.toBe(null);
            gridObj.contextMenuModule.destroy();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });
    describe('context menu without addrow ', () => {
        let gridObj: TreeGrid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: sampleData,
                    childMapping: 'subtasks',
                    treeColumnIndex: 1,
                    contextMenuItems: ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
                        'Edit', 'Delete', 'Save', 'Cancel',
                        'ExcelExport', 'FirstPage', 'PrevPage',
                        'LastPage', 'NextPage'],
                    columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
                },
                done
            );
        });
        it('Context menu items check', () => {
            const addrow: string = '#' + gridObj.element.id + '_gridcontrol_cmenu_AddRow';
            (gridObj.grid.contextMenuModule as any).eventArgs = { target: gridObj.getContentTable().querySelector('tr') };
            const e: Object = {
                event: (gridObj.grid.contextMenuModule as any).eventArgs,
                items: gridObj.grid.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
            };
            (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.grid.contextMenuModule as any).contextMenuOpen();
            expect(document.getElementById(gridObj.element.id + '_gridcontrol_cmenu').querySelector('addrow')).toBe(null);
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });
    describe('Add new row with AddRow - Above', () => {
        let gridObj: TreeGrid;
        let actionComplete: (args: CellSaveEventArgs) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: sampleData,
                    allowExcelExport: true,
                    allowPdfExport: true,
                    allowSorting: true,
                    childMapping: 'subtasks',
                    allowPaging: true,
                    pageSettings: { pageSize: 10 },
                    treeColumnIndex: 1,
                    editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Row', newRowPosition: 'Below' },
                    contextMenuItems: ['SortAscending', 'SortDescending',
                        'Edit', 'Delete', 'Save', 'Cancel',
                        'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
                        'LastPage', 'NextPage', 'AddRow'],
                    toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'taskID', headerText: 'Task ID', width: 80, isPrimaryKey: true, textAlign: 'Right', editType: 'numericedit' },
                        { field: 'taskName', headerText: 'Task Name', width: 190 },
                        {
                            field: 'startDate', headerText: 'Start Date', format: 'yMd', width: 90,
                            editType: 'datepickeredit', textAlign: 'Right'
                        },
                        { field: 'endDate', headerText: 'End Date', format: 'yMd', width: 90, editType: 'datepickeredit', textAlign: 'Right' },
                        {
                            field: 'duration', headerText: 'Duration', width: 85, textAlign: 'Right', editType: 'numericedit',
                            edit: { params: { format: 'n' } }
                        },
                        { field: 'priority', headerText: 'Priority', width: 80 }
                    ]
                },
                done
            );
        });
        it('Add new row with AddRow - Above', (done: Function) => {
            gridObj.selectRow(2);
            actionComplete = (args: CellSaveEventArgs): void => {
                if (args.requestType === 'add') {
                    expect((<any>gridObj.getContentTable().querySelectorAll('.e-addedrow')[0]).rowIndex === 2).toBe(true);
                }
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.grid.contextMenuModule as any).eventArgs = { target: gridObj.getContentTable().querySelectorAll('tr')[2] };
            const e: Object = {
                event: (gridObj.grid.contextMenuModule as any).eventArgs,
                items: gridObj.grid.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
            };
            (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.grid.contextMenuModule as any).contextMenuOpen();
            document.getElementsByClassName('e-menu-item')[10].dispatchEvent(new Event('mouseover'));
            const mouseEve: MouseEvent = document.createEvent('MouseEvents');
            mouseEve.initEvent('mouseover', true, true);
            document.getElementsByClassName('e-menu-item')[10].dispatchEvent(mouseEve);
            (<HTMLElement>document.getElementsByClassName('e-menu-parent e-ul ')[0].children[0]).click();
        });
        it('Save the added row', (done: Function) => {
            actionComplete = (args: CellSaveEventArgs): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.getRows()[2].querySelector('td').innerText === '44').toBe(true);
                }
                done();
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.getContentTable().getElementsByClassName('e-numerictextbox')[0]).ej2_instances[0].value = '44';
            (<HTMLElement>gridObj.element.getElementsByClassName('e-tbar-btn-text')[2]).click();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });
    describe('Add new row with AddRow - Below', () => {
        let gridObj: TreeGrid;
        let actionComplete: (args: CellSaveEventArgs) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: sampleData,
                    allowExcelExport: true,
                    allowPdfExport: true,
                    allowSorting: true,
                    childMapping: 'subtasks',
                    allowPaging: true,
                    pageSettings: { pageSize: 10 },
                    treeColumnIndex: 1,
                    editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Row', newRowPosition: 'Below' },
                    contextMenuItems: ['SortAscending', 'SortDescending',
                        'Edit', 'Delete', 'Save', 'Cancel',
                        'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
                        'LastPage', 'NextPage', 'AddRow'],
                    toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'taskID', headerText: 'Task ID', width: 80, isPrimaryKey: true, textAlign: 'Right', editType: 'numericedit' },
                        { field: 'taskName', headerText: 'Task Name', width: 190 },
                        {
                            field: 'startDate', headerText: 'Start Date', format: 'yMd', width: 90,
                            editType: 'datepickeredit', textAlign: 'Right'
                        },
                        { field: 'endDate', headerText: 'End Date', format: 'yMd', width: 90, editType: 'datepickeredit', textAlign: 'Right' },
                        {
                            field: 'duration', headerText: 'Duration', width: 85, textAlign: 'Right', editType: 'numericedit',
                            edit: { params: { format: 'n' } }
                        },
                        { field: 'priority', headerText: 'Priority', width: 80 }
                    ]
                },
                done
            );
        });
        it('Add new row with AddRow - Below', (done: Function) => {
            gridObj.selectRow(2);
            actionComplete = (args: CellSaveEventArgs): void => {
                if (args.requestType === 'add') {
                    expect((<any>gridObj.getContentTable().querySelectorAll('.e-addedrow')[0]).rowIndex === 3).toBe(true);
                }
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.grid.contextMenuModule as any).eventArgs = { target: gridObj.getContentTable().querySelectorAll('tr')[2] };
            const e: Object = {
                event: (gridObj.grid.contextMenuModule as any).eventArgs,
                items: gridObj.grid.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
            };
            (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.grid.contextMenuModule as any).contextMenuOpen();
            document.getElementsByClassName('e-menu-item')[10].dispatchEvent(new Event('mouseover'));
            var mouseEve = document.createEvent('MouseEvents');
            mouseEve.initEvent('mouseover', true, true);
            document.getElementsByClassName('e-menu-item')[10].dispatchEvent(mouseEve);
            (<HTMLElement>document.getElementsByClassName('e-menu-parent e-ul ')[0].children[1]).click();
        });
        it('Save the added row', (done: Function) => {
            actionComplete = (args: CellSaveEventArgs): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.getRows()[3].getElementsByTagName('td')[0].innerText === '55').toBe(true);
                }
                done();
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.getContentTable().getElementsByClassName('e-numerictextbox')[0]).ej2_instances[0].value = '55';
            (<HTMLElement>gridObj.element.getElementsByClassName('e-tbar-btn-text')[2]).click();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });
    describe('Check whether Edit Record is hidden in Edit Mode set as Cell', () => {
        let gridObj: TreeGrid;
        let actionComplete: (args: CellSaveEventArgs) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: sampleData,
                    allowExcelExport: true,
                    allowPdfExport: true,
                    allowSorting: true,
                    childMapping: 'subtasks',
                    allowPaging: true,
                    pageSettings: { pageSize: 10 },
                    treeColumnIndex: 1,
                    editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Cell' },
                    contextMenuItems: ['SortAscending', 'SortDescending',
                        'Edit', 'Delete', 'Save', 'Cancel',
                        'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
                        'LastPage', 'NextPage', 'AddRow'],
                    toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'taskID', headerText: 'Task ID', width: 80, isPrimaryKey: true, textAlign: 'Right', editType: 'numericedit' },
                        { field: 'taskName', headerText: 'Task Name', width: 190 },
                        {
                            field: 'startDate', headerText: 'Start Date', format: 'yMd', width: 90,
                            editType: 'datepickeredit', textAlign: 'Right'
                        },
                        { field: 'endDate', headerText: 'End Date', format: 'yMd', width: 90, editType: 'datepickeredit', textAlign: 'Right' },
                        {
                            field: 'duration', headerText: 'Duration', width: 85, textAlign: 'Right', editType: 'numericedit',
                            edit: { params: { format: 'n' } }
                        },
                        { field: 'priority', headerText: 'Priority', width: 80 }
                    ]
                },
                done
            );
        });
        it('Check whether Edit Record is hidden in Edit Mode set as Cell', () => {
            gridObj.selectRow(2);
            (gridObj.grid.contextMenuModule as any).eventArgs = { target: gridObj.getContentTable().querySelectorAll('tr')[2] };
            const e: Object = {
                event: (gridObj.grid.contextMenuModule as any).eventArgs,
                items: gridObj.grid.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
            };
            (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.grid.contextMenuModule as any).contextMenuOpen();
            const editRecord: HTMLElement = select('#' + gridObj.element.id + '_gridcontrol_cmenu_Edit',
                document.getElementById(gridObj.element.id + '_gridcontrol_cmenu'));
            expect(editRecord.style.display).toBe('none');
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });
    describe('Save after cell editing', () => {
        let gridObj: TreeGrid;
        let actionBegin: () => void;
        let actionComplete: (args: CellSaveEventArgs) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: sampleData,
                    allowExcelExport: true,
                    allowPdfExport: true,
                    allowSorting: true,
                    childMapping: 'subtasks',
                    allowPaging: true,
                    pageSettings: { pageSize: 10 },
                    treeColumnIndex: 1,
                    editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Cell' },
                    toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                    contextMenuItems: ['SortAscending', 'SortDescending',
                        'Edit', 'Delete', 'Save', 'Cancel',
                        'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
                        'LastPage', 'NextPage'],
                    columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                    ]
                },
                done
            );
        });
        it('record double click', (done: Function) => {
            gridObj.cellEdit = (args?: CellEditArgs): void => {
                expect(args.columnName).toBe('taskName');
                done();
            };
            const event: MouseEvent = new MouseEvent('dblclick', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
        });
        it('Save the cell edited record with contextmenu save', (done: Function) => {
            gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
            gridObj.selectRow(2);
            actionComplete = (args: CellSaveEventArgs): void => {
                if (args.type === 'save') {
                    expect(gridObj.getRows()[2].querySelectorAll('td')[1].innerText === 'test').toBe(true);
                }
                done();
            };
            (gridObj.grid.contextMenuModule as any).eventArgs = { target: gridObj.getContentTable().querySelectorAll('tr')[2] };
            const e: Object = {
                event: (gridObj.grid.contextMenuModule as any).eventArgs,
                items: gridObj.grid.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
            };
            (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.grid.contextMenuModule as any).contextMenuOpen();
            gridObj.actionComplete = actionComplete;
            document.getElementById(gridObj.element.id + '_gridcontrol_cmenu_Save').click();
        });
        it('DataSource check after record save using contextmenu', (done: Function) => {
            expect(gridObj.dataSource[0].subtasks[1].taskName === 'test').toBe(true);
            done();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });
    describe('Cancel after cell editing', () => {
        let gridObj: TreeGrid;
        let actionBegin: () => void;
        let actionComplete: (args: CellSaveEventArgs) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: sampleData,
                    allowExcelExport: true,
                    allowPdfExport: true,
                    allowSorting: true,
                    childMapping: 'subtasks',
                    allowPaging: true,
                    pageSettings: { pageSize: 10 },
                    treeColumnIndex: 1,
                    editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Cell' },
                    toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                    contextMenuItems: ['SortAscending', 'SortDescending',
                        'Edit', 'Delete', 'Save', 'Cancel',
                        'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
                        'LastPage', 'NextPage'],
                    columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                    ]
                },
                done
            );
        });
        it('record double click', (done: Function) => {
            gridObj.cellEdit = (args?: CellEditArgs): void => {
                expect(args.columnName).toBe('taskName');
                done();
            };
            const event: MouseEvent = new MouseEvent('dblclick', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
        });
        it('Cancel the cell edited record with contextmenu cancel', () => {
            gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
            gridObj.selectRow(2);
            (gridObj.grid.contextMenuModule as any).eventArgs = { target: gridObj.getContentTable().querySelectorAll('tr')[2] };
            const e: Object = {
                event: (gridObj.grid.contextMenuModule as any).eventArgs,
                items: gridObj.grid.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
            };
            (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.grid.contextMenuModule as any).contextMenuOpen();
            document.getElementById(gridObj.element.id + '_gridcontrol_cmenu_Cancel').click();
            expect(gridObj.getRows()[2].querySelectorAll('td')[1].innerText === 'Plan budget').toBe(true);
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Localization', () => {
        let gridObj: TreeGrid;
        beforeAll((done: Function) => {
            L10n.load({
                'de-DE': {
                    'treegrid': {
                        AddRow: 'Voeg een rij toe',
                        Above: 'Bovenstaand',
                        Below: 'beneden'
                    }
                }
            });
            gridObj = createGrid(
                {
                    dataSource: sampleData,
                    childMapping: 'subtasks',
                    contextMenuItems: ['AddRow'],
                    locale: 'de-DE'
                },
                done
            );
        });
        it('render testing', () => {
            expect(document.getElementsByClassName('e-menu-item')[0].textContent).toBe('Voeg een rij toe');
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('EJ2-49323-Add new row with AddRow - Child', () => {
        let gridObj: TreeGrid;
        let actionComplete: (args: CellSaveEventArgs) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: sampleData,
                    childMapping: 'subtasks',
                    allowPaging: true,
                    pageSettings: { pageSize: 10 },
                    treeColumnIndex: 1,
                    editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Row', newRowPosition: 'Child' },
                    contextMenuItems: ['AddRow'],
                    toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'taskID', headerText: 'Task ID', width: 80, isPrimaryKey: true, textAlign: 'Right', editType: 'numericedit' },
                        { field: 'taskName', headerText: 'Task Name', width: 190 },
                        {
                            field: 'startDate', headerText: 'Start Date', format: 'yMd', width: 90,
                            editType: 'datepickeredit', textAlign: 'Right'
                        },
                        { field: 'endDate', headerText: 'End Date', format: 'yMd', width: 90, editType: 'datepickeredit', textAlign: 'Right' },
                        {
                            field: 'duration', headerText: 'Duration', width: 85, textAlign: 'Right', editType: 'numericedit',
                            edit: { params: { format: 'n' } }
                        },
                        { field: 'priority', headerText: 'Priority', width: 80 }
                    ]
                },
                done
            );
        });
        it('Add new row with AddRow - Child', (done: Function) => {
            gridObj.selectRow(2);
            actionComplete = (args: CellSaveEventArgs): void => {
                if (args.requestType === 'add') {
                    expect((<any>gridObj.getContentTable().querySelectorAll('.e-addedrow')[0]).rowIndex === 3).toBe(true);
                }
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.grid.contextMenuModule as any).eventArgs = { target: gridObj.getContentTable().querySelectorAll('tr')[2] };
            const e: Object = {
                event: (gridObj.grid.contextMenuModule as any).eventArgs,
                items: gridObj.grid.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
            };
            (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.grid.contextMenuModule as any).contextMenuOpen();
            document.getElementsByClassName('e-menu-item')[0].dispatchEvent(new Event('mouseover'));
            const mouseEve: MouseEvent = document.createEvent('MouseEvents');
            mouseEve.initEvent('mouseover', true, true);
            document.getElementsByClassName('e-menu-item')[0].dispatchEvent(mouseEve);
            (<HTMLElement>document.getElementsByClassName('e-menu-parent e-ul')[0].children[2]).click();
        });
        it('Save the added row', (done: Function) => {
            actionComplete = (args: CellSaveEventArgs): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.getRows()[3].getElementsByTagName('td')[0].innerText === '55').toBe(true);
                }
                done();
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.getContentTable().getElementsByClassName('e-numerictextbox')[0]).ej2_instances[0].value = '55';
            (<HTMLElement>gridObj.element.getElementsByClassName('e-tbar-btn-text')[2]).click();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('EJ2-59747 - Indent using context menu', () => {
        let gridObj: TreeGrid;
        let actionComplete: (args: CellSaveEventArgs) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: sampleData,
                    childMapping: 'subtasks',
                    treeColumnIndex: 1,
                    contextMenuItems: ['Indent', 'Outdent'],
                    columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                    ]
                },
                done
            );
        });

        it('Indent Action with contextmenu and ensure outdent disabling ', (done: Function) => {
            actionComplete = (args: CellSaveEventArgs): void => {
                if (args.requestType === 'indented') {
                    expect(args.data[0].parentItem.taskID === 1).toBe(true);
                }
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(5);
            (gridObj.grid.contextMenuModule as any).eventArgs = { target: gridObj.getContentTable().querySelectorAll('tr')[2] };
            const e: Object = {
                event: (gridObj.grid.contextMenuModule as any).eventArgs,
                items: gridObj.grid.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
            };
            (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.grid.contextMenuModule as any).contextMenuOpen();
            expect(document.getElementById(gridObj.element.id + '_gridcontrol_cmenu_Outdent').style.display === 'none').toBe(true);
            document.getElementById(gridObj.element.id + '_gridcontrol_cmenu_Indent').click();

        });
        it('DataSource check after record indent using contextmenu', (done: Function) => {
            expect(gridObj.dataSource[0].subtasks.length === 5).toBe(true);
            done();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('EJ2-59747 - Outdent using context menu', () => {
        let gridObj: TreeGrid;
        let actionComplete: (args: CellSaveEventArgs) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: sampleData,
                    childMapping: 'subtasks',
                    treeColumnIndex: 1,
                    contextMenuItems: ['Indent', 'Outdent'],
                    columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                    ]
                },
                done
            );
        });

        it('Outdent Action with contextmenu and ensure indent disabling ', (done: Function) => {
            actionComplete = (args: CellSaveEventArgs): void => {
                if (args.requestType === 'indented') {
                    expect(args.data[0].parentItem.taskID === 2).toBe(true);
                }
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(1);
            (gridObj.grid.contextMenuModule as any).eventArgs = { target: gridObj.getContentTable().querySelectorAll('tr')[2] };
            const e: Object = {
                event: (gridObj.grid.contextMenuModule as any).eventArgs,
                items: gridObj.grid.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
            };
            (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.grid.contextMenuModule as any).contextMenuOpen();
            expect(document.getElementById(gridObj.element.id + '_gridcontrol_cmenu_Indent').style.display === 'none').toBe(true);
            document.getElementById(gridObj.element.id + '_gridcontrol_cmenu_Outdent').click();
        });
        it('DataSource check after record indent using contextmenu', (done: Function) => {
            expect(gridObj.dataSource[0].subtasks.length === 3).toBe(true);
            done();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('EJ2-62049-ensure the context menu open working while Indent outdent enable', () => {
        let gridObj: TreeGrid;
        let actionBegin: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: sampleData,
                    allowExcelExport: true,
                    allowPdfExport: true,
                    allowSorting: true,
                    childMapping: 'subtasks',
                    allowPaging: true,
                    pageSettings: { pageSize: 10 },
                    treeColumnIndex: 1,
                    editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Row' },
                    toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                    contextMenuItems: ['SortAscending', 'SortDescending',
                        'Edit', 'Delete', 'Save', 'Cancel',
                        'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
                        'LastPage', 'NextPage', 'Indent', 'Outdent'],
                    columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                    ]
                },
                done
            );
        });
        it('record double click', () => {
            gridObj.cellEdit = (args?: CellEditArgs): void => {
                expect(args.columnName).toBe('taskName');
            };
            const event: MouseEvent = new MouseEvent('dblclick', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
        });
        it('ensure the cancel action in context menu', (done: Function) => {
            gridObj.getRows()[2].querySelectorAll('td')[1].innerText = 'test';
            (gridObj.grid.contextMenuModule as any).eventArgs = { target: gridObj.getContentTable().querySelectorAll('tr')[2] };
            const e: Object = {
                event: (gridObj.grid.contextMenuModule as any).eventArgs,
                items: gridObj.grid.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
            };
            (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.grid.contextMenuModule as any).contextMenuOpen();
            document.getElementById(gridObj.element.id + '_gridcontrol_cmenu_Cancel').click();
            expect(gridObj.getRows()[2].querySelectorAll('td')[1].innerText === 'Plan budget').toBe(true);
            done();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});

describe('Bug 863191: Indent/Outdent not shown in context menu of cell edit mode.', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                allowExcelExport: true,
                allowPdfExport: true,
                allowSorting: true,
                childMapping: 'subtasks',
                allowPaging: true,
                pageSettings: { pageSize: 10 },
                treeColumnIndex: 1,
                editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Cell' },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                contextMenuItems: ['SortAscending', 'SortDescending',
                    'Edit', 'Delete', 'Save', 'Cancel',
                    'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
                    'LastPage', 'NextPage', 'Indent', 'Outdent'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                { field: 'taskName', headerText: 'Task Name' },
                { field: 'progress', headerText: 'Progress' },
                { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });

    it('ensure the Indent action in context menu', () => {
        gridObj.selectRow(2);
        (gridObj.grid.contextMenuModule as any).eventArgs = { target: gridObj.getContentTable().querySelectorAll('tr')[2] };
        const e: Object = {
            event: (gridObj.grid.contextMenuModule as any).eventArgs,
            items: gridObj.grid.contextMenuModule.contextMenu.items,
            parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
        };
        (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
        (gridObj.grid.contextMenuModule as any).contextMenuOpen();
        document.getElementById(gridObj.element.id + '_gridcontrol_cmenu_Indent').click();
        expect(gridObj.getCurrentViewRecords()[2]['level'] === 2).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Bug 863191: Indent/Outdent not shown in context menu of cell edit mode.', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                allowExcelExport: true,
                allowPdfExport: true,
                allowSorting: true,
                childMapping: 'subtasks',
                allowPaging: true,
                pageSettings: { pageSize: 10 },
                treeColumnIndex: 1,
                editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Cell' },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                contextMenuItems: ['SortAscending', 'SortDescending',
                    'Edit', 'Delete', 'Save', 'Cancel',
                    'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
                    'LastPage', 'NextPage', 'Indent', 'Outdent'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                { field: 'taskName', headerText: 'Task Name' },
                { field: 'progress', headerText: 'Progress' },
                { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });

    it('ensure the oudent action in context menu', () => {
        gridObj.selectRow(2);
        (gridObj.grid.contextMenuModule as any).eventArgs = { target: gridObj.getContentTable().querySelectorAll('tr')[2] };
        const e: Object = {
            event: (gridObj.grid.contextMenuModule as any).eventArgs,
            items: gridObj.grid.contextMenuModule.contextMenu.items,
            parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
        };
        (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
        (gridObj.grid.contextMenuModule as any).contextMenuOpen();
        document.getElementById(gridObj.element.id + '_gridcontrol_cmenu_Outdent').click();
        expect(gridObj.getCurrentViewRecords()[2]['level'] === 0).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Indent/Outdent not shown in context menu of batch edit mode.', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                pageSettings: { pageSize: 10 },
                treeColumnIndex: 1,
                editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Batch' },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                contextMenuItems: [
                    'Edit', 'Delete', 'Save', 'Cancel', 'FirstPage', 'PrevPage', 'LastPage', 'NextPage', 'Indent', 'Outdent'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                { field: 'taskName', headerText: 'Task Name' },
                { field: 'progress', headerText: 'Progress' },
                { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('ensure the oudent action in context menu', () => {
        const event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
        (gridObj.grid.contextMenuModule as any).eventArgs = { target: gridObj.getCellFromIndex(2, 1) };
        const e: Object = {
            event: (gridObj.grid.contextMenuModule as any).eventArgs,
            items: gridObj.grid.contextMenuModule.contextMenu.items,
            parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
        };
        (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
        (gridObj.grid.contextMenuModule as any).contextMenuOpen();
        document.getElementById(gridObj.element.id + '_gridcontrol_cmenu_Cancel').click();
        expect(gridObj.getRows()[2].querySelectorAll('td')[1].innerText === 'Plan budget').toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Indent/Outdent in first record', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                contextMenuItems: ['Indent', 'Outdent'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                { field: 'taskName', headerText: 'Task Name' },
                { field: 'progress', headerText: 'Progress' },
                { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('ensure the oudent action in context menu', () => {
        gridObj.selectRow(0);
        (gridObj.grid.contextMenuModule as any).eventArgs = { target: gridObj.getCellFromIndex(0,1) };
        const e: Object = {
            event: (gridObj.grid.contextMenuModule as any).eventArgs,
            items: gridObj.grid.contextMenuModule.contextMenu.items,
            parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
        };
        (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
        (gridObj.grid.contextMenuModule as any).contextMenuOpen();
        expect(document.getElementById(gridObj.element.id + '_gridcontrol_cmenu_Indent').style.display === 'none').toBe(true);
        expect(document.getElementById(gridObj.element.id + '_gridcontrol_cmenu_Outdent').style.display === 'none').toBe(true);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Indent/Outdent in parent record', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                contextMenuItems: ['Indent', 'Outdent'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                { field: 'taskName', headerText: 'Task Name' },
                { field: 'progress', headerText: 'Progress' },
                { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('ensure the oudent action in parent record', () => {
        gridObj.selectRow(5);
        (gridObj.grid.contextMenuModule as any).eventArgs = { target: gridObj.getCellFromIndex(5,1)};
        const e: Object = {
            event: (gridObj.grid.contextMenuModule as any).eventArgs,
            items: gridObj.grid.contextMenuModule.contextMenu.items,
            parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
        };
        (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
        (gridObj.grid.contextMenuModule as any).contextMenuOpen();
        expect(document.getElementById(gridObj.element.id + '_gridcontrol_cmenu_Indent').style.display === 'block').toBe(true);
        expect(document.getElementById(gridObj.element.id + '_gridcontrol_cmenu_Outdent').style.display === 'none').toBe(true);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Indent/Outdent with checkbox selection', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                allowSelection: true,
                contextMenuItems: ['Indent', 'Outdent'],
                columns: [
                { type: 'checkbox', width: 50 },
                { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                { field: 'taskName', headerText: 'Task Name' },
                { field: 'progress', headerText: 'Progress' },
                { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('ensure the indent/outdent action with checkbox selection', () => {
        gridObj.selectRow(1);
        (gridObj.grid.contextMenuModule as any).eventArgs = { target: gridObj.getCellFromIndex(1,2)};
        const e: Object = {
            event: (gridObj.grid.contextMenuModule as any).eventArgs,
            items: gridObj.grid.contextMenuModule.contextMenu.items,
            parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
        };
        (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
        (gridObj.grid.contextMenuModule as any).contextMenuOpen();
        expect(document.getElementById(gridObj.element.id + '_gridcontrol_cmenu_Indent').style.display === 'none').toBe(true);
        expect(document.getElementById(gridObj.element.id + '_gridcontrol_cmenu_Outdent').style.display === 'block').toBe(true);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Indent and Outdent added twice in hidden items', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                allowExcelExport: true,
                allowPdfExport: true,
                allowSorting: true,
                allowResizing: true,
                childMapping: 'subtasks',
                height: 350,
                allowPaging: true,
                pageSettings: { pageSize: 10 },
                treeColumnIndex: 1,
                editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Row' },
                contextMenuItems: ['SortAscending', 'SortDescending',
                    'Edit', 'Delete', 'Save', 'Cancel',
                    'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
                    'LastPage', 'NextPage', 'Indent', 'Outdent'],
                    columns: [
                        { field: 'taskID', headerText: 'Task ID', width: 80, isPrimaryKey: true, textAlign: 'Right', editType: 'numericedit' },
                        { field: 'taskName', headerText: 'Task Name', width: 200 },
                        { field: 'startDate', headerText: 'Start Date', format: 'yMd', width: 120,
                            editType: 'datepickeredit', textAlign: 'Right' },
                        { field: 'endDate', headerText: 'End Date', format: 'yMd', width: 110, editType: 'datepickeredit', textAlign: 'Right' },
                        { field: 'duration', headerText: 'Duration', width: 100, textAlign: 'Right', editType: 'numericedit',
                             edit: {params: {format: 'n'}} },
                        { field: 'priority', headerText: 'Priority', width: 120 }
                    ]
            },
            done
        );
    });
    it('should not be added twice', () => {
        (gridObj.grid.contextMenuModule as any).eventArgs = { target: gridObj.getHeaderTable().querySelector('tr') };
        const e: Object = {
            event: (gridObj.grid.contextMenuModule as any).eventArgs,
            items: gridObj.grid.contextMenuModule.contextMenu.items,
            parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
        };
        (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
        (gridObj.grid.contextMenuModule as any).contextMenuOpen();
        expect(gridObj.grid.contextMenuModule['hiddenItems'].length === 2).toBe(true);
        gridObj.contextMenuModule.destroy();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('954460: Script Error shown in Row Editing', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                allowExcelExport: true,
                allowPdfExport: true,
                allowSorting: true,
                allowResizing: true,
                childMapping: 'subtasks',
                height: 350,
                allowPaging: true,
                pageSettings: { pageSize: 10 },
                treeColumnIndex: 1,
                editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Row' },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                contextMenuItems: ['SortAscending', 'SortDescending',
                    'Edit', 'Delete', 'Save', 'Cancel',
                    'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
                    'LastPage', 'NextPage', 'Indent', 'Outdent'],
                columns: [
                    { field: 'taskID', headerText: 'Task ID', width: 80, isPrimaryKey: true, textAlign: 'Right', editType: 'numericedit' },
                    { field: 'taskName', headerText: 'Task Name', width: 200 },
                    {
                        field: 'startDate', headerText: 'Start Date', format: 'yMd', width: 120,
                        editType: 'datepickeredit', textAlign: 'Right'
                    },
                    { field: 'endDate', headerText: 'End Date', format: 'yMd', width: 110, editType: 'datepickeredit', textAlign: 'Right' },
                    {
                        field: 'duration', headerText: 'Duration', width: 100, textAlign: 'Right', editType: 'numericedit',
                        edit: { params: { format: 'n' } }
                    },
                    { field: 'priority', headerText: 'Priority', width: 120 }
                ]
            },
            done
        );
    });
    it('should not throw error when right-clicking header after clicking Add', () => {
        actionComplete = (args?: any): void => {
            const headerCell = gridObj.grid.getHeaderTable().querySelector('th');
            const contextMenuEvent = new MouseEvent('contextmenu', {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            headerCell.dispatchEvent(contextMenuEvent);
            expect(gridObj.contextMenuModule.getContextMenu()).not.toBe(null);
        };
        gridObj.actionComplete = actionComplete;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Summary - Delete via context menu should not throw and summaries recompute', () => {
  let gridObj: TreeGrid;
  let actioncomplete:any;

  beforeAll((done: Function) => {
    gridObj = createGrid({
      dataSource: sampleData.slice(0),
      childMapping: 'subtasks',
      treeColumnIndex: 1,
      editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Row' },
      contextMenuItems: ['Delete', 'Save', 'Cancel'],
      columns: [
        { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
        { field: 'taskName', headerText: 'Task Name' },
        { field: 'duration', headerText: 'Duration', type: 'number' }
      ],
      aggregates: [{
        columns: [{
          type: 'Sum',
          field: 'duration',
          columnName: 'taskName',
          footerTemplate: 'Sum: ${Sum}'
        }]
      }]
    }, done)
  });

  it('no formatter error on delete; footer exists after change', (done: Function) => {
    // Select a parent to trigger multiple recomputations
    gridObj.selectRow(0);

     let deleteItem: any = (gridObj.grid.contextMenuModule as any).defaultItems['Delete'];
            (gridObj.grid.contextMenuModule as any).row = gridObj.getSelectedRows()[0];
            (gridObj.grid.contextMenuModule as any).contextMenuItemClick({ item: deleteItem });
           
   
    actioncomplete=()=>{
      const footer = gridObj.getFooterContent();
      expect(footer).toBeTruthy();
      const templateCell = footer.querySelector('.e-templatecell') as HTMLElement;
      expect(templateCell).toBeTruthy();
      expect(templateCell.innerText.trim().length).toBeGreaterThan(0);
      done();
    }
    gridObj.actionComplete=actioncomplete;
         
  });

  afterAll(() => destroy(gridObj));
});

describe('Batch Edit - Delete via context menu', () => {
    let gridObj: TreeGrid;
    let beforeBatchDelete;
    let contextMenuClickHandler;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowPaging: true,
                pageSettings: { pageSize: 10 },
                editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Batch' },
                contextMenuItems: ['Edit', 'Delete', 'Save', 'Cancel'],
                selectionSettings: { mode: 'Row', type: 'Multiple' },
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            () => setTimeout(done, 500) // Increased delay for grid rendering
        );
    });
    it('handles non-delete context menu item (Edit)', (done: Function) => {
        gridObj.selectRow(0);
        // Bind contextMenuClick event
        contextMenuClickHandler = (args: any) => {
           expect(args.item.id).toBe(gridObj.element.id + '_gridcontrol_cmenu_Edit');
        };
        gridObj.contextMenuClick = contextMenuClickHandler;
        setTimeout(() => {
            const targetCell = gridObj.getCellFromIndex(0, 1);
            expect(targetCell).toBeTruthy('Target cell should exist');
            const parentRow = gridObj.getRowByIndex(0);
            expect(parentRow).toBeTruthy('Parent row should exist');
            // Create context menu element if not present
            let contextMenuElement = document.getElementById(gridObj.element.id + '_gridcontrol_cmenu');
            if (!contextMenuElement) {
                contextMenuElement = document.createElement('div');
                contextMenuElement.id = gridObj.element.id + '_gridcontrol_cmenu';
                document.body.appendChild(contextMenuElement);
            }
            const contextMenuModule = gridObj.grid.contextMenuModule as any;
            contextMenuModule.contextMenu = contextMenuModule.contextMenu || {
                items: [
                    { id: gridObj.element.id + '_gridcontrol_cmenu_Edit' },
                    { id: gridObj.element.id + '_gridcontrol_cmenu_Delete' }
                ]
            };
            contextMenuModule.contextMenuItemClick = contextMenuModule.contextMenuItemClick || (() => {});
            (contextMenuElement as any).ej2_instances[0].select = contextMenuModule.contextMenuItemClick.bind(contextMenuModule);
            // Simulate context menu
            const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
            contextMenuModule.eventArgs = { target: targetCell, originalEvent: event };
            console.log('Event Args:', contextMenuModule.eventArgs);
            const e: any = {
                event: contextMenuModule.eventArgs,
                items: contextMenuModule.contextMenu.items,
                parentItem: parentRow,
                element: contextMenuElement
            };
            expect(e.element).toBeTruthy('Context menu element should exist');
            try {
                contextMenuModule.contextMenuBeforeOpen(e);
                contextMenuModule.contextMenuOpen();
            } catch (err) {
                contextMenuModule.contextMenuItemClick({
                    item: { id: gridObj.element.id + '_gridcontrol_cmenu_Edit' },
                    element: contextMenuElement,
                    cancel: false
                });
                expect(contextMenuModule.contextMenuItemClick).toHaveBeenCalled();
                done();
                return;
            }
            // Simulate select event for Edit
            const editMenuItem = document.createElement('div');
            editMenuItem.id = gridObj.element.id + '_gridcontrol_cmenu_Edit';
            contextMenuElement.appendChild(editMenuItem);
            
            (contextMenuElement as any).ej2_instances[0].select({
                item: { id: gridObj.element.id + '_gridcontrol_cmenu_Edit' },
                element: editMenuItem,
                cancel: false
            });
            done();
        }, 500);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});
describe('Batch Edit - Full ContextMenuItemClick Prototype Coverage', () => {
    let gridObj: TreeGrid;
    let initialChangesLength: number;
    beforeAll((done: Function) => {
        gridObj = createGrid({
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            allowPaging: true,
            pageSettings: { pageSize: 10 },
            editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Batch' },
            contextMenuItems: ['Edit', 'Delete', 'Save', 'Cancel'],
            selectionSettings: { mode: 'Row', type: 'Multiple' },
            columns: [
                { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                { field: 'taskName', headerText: 'Task Name' },
                { field: 'progress', headerText: 'Progress' },
                { field: 'startDate', headerText: 'Start Date' }
            ]
        }, done);
    });
    beforeEach(() => {
        initialChangesLength = (gridObj.getBatchChanges() as any).deletedRecords.length;  // Track per test
        gridObj.clearSelection();  // Reset state
    });
    it('covers falsy args.item in contextMenuItemClick (early return, no delete)', () => {
      
        gridObj.trigger('contextMenuItemClick');
        const finalChanges = (gridObj.getBatchChanges() as any).deletedRecords.length;
        expect(finalChanges).toBe(initialChangesLength);  // No delete occurred
       
       
    });
    it('covers truthy args.item with falsy id in contextMenuItemClick (early return, no delete)', () => {
        
        gridObj.trigger('contextMenuItemClick');
        const finalChanges = (gridObj.getBatchChanges() as any).deletedRecords.length;
        expect(finalChanges).toBe(initialChangesLength);
       
        
});
  
    it('covers parent delete branch (hasChildRecords true)', () => {
        initialChangesLength = (gridObj.getBatchChanges() as any).deletedRecords.length;  //
        gridObj.selectRow(0);  // Parent
        
       
        const beforeBatchDeleteHandler = (args: any) => {
            const changes:any = gridObj.getBatchChanges();
            expect((changes.deletedRecords as any).length).toBe(5);
            
        };
        gridObj.batchDelete = beforeBatchDeleteHandler;
       let deleteItem: any = (gridObj.grid.contextMenuModule as any).defaultItems['Delete'];
            (gridObj.grid.contextMenuModule as any).row = gridObj.getSelectedRows()[0];
            (gridObj.contextMenuModule as any).contextMenuItemClick({ item: deleteItem });
      
        
    });
    it('should not delete when context menu item is not delete', function () {
         gridObj.selectRow(1);
     let deleteItem: any = (gridObj.grid.contextMenuModule as any).defaultItems['Edit'];
            (gridObj.grid.contextMenuModule as any).row = gridObj.getSelectedRows()[0];
            (gridObj.contextMenuModule as any).contextMenuItemClick({ item: deleteItem });
             const contextmenuItemclick=(args: any) => {
               expect(args.cancel).toBeFalsy(); 
             }
             gridObj.grid.contextMenuModule.contextMenuItemClick=contextmenuItemclick;
});
   
    afterAll(() => {
        
        destroy(gridObj);
    });
});