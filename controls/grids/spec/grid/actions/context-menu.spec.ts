/**
 * Grid context menu spec document
 */
import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Reorder } from '../../../src/grid/actions/reorder';
import { CommandColumn } from '../../../src/grid/actions/command-column';
import { ContextMenuOpenEventArgs, ContextMenuClickEventArgs } from '../../../src/grid/base/interface';
import { Grid } from '../../../src/grid/base/grid';
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { data } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';
import { ContextMenu, menuClass } from '../../../src/grid/actions/context-menu';
import { Sort } from '../../../src/grid/actions/sort';
import { Group } from '../../../src/grid/actions/group';
import { Resize } from '../../../src/grid/actions/resize';
import { Edit } from '../../../src/grid/actions/edit';
import { PdfExport } from '../../../src/grid/actions/pdf-export';
import { ExcelExport } from '../../../src/grid/actions/excel-export';
import { Column } from '../../../src/grid/models/column';
import { ContextMenuItemModel } from '../../../src/grid/base/interface';
import { Freeze } from '../../../src/grid/actions/freeze';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

Grid.Inject(Page, Selection, Reorder, CommandColumn, ContextMenu, Sort, Resize,
    Group, Edit, PdfExport, ExcelExport, Freeze);

let targetAndIconCheck: Function = (menuItem: ContextMenuItemModel): void => {
    switch (menuItem.text) {
        case 'AutoFitAll':
        case 'AutoFit':
            expect(menuItem.target).toBe(menuClass.header);
            expect(menuItem.iconCss).toBeFalsy();
            break;
        case 'Group':
            expect(menuItem.target).toBe(menuClass.header);
            expect(menuItem.iconCss).toBe(menuClass.group);
            break;
        case 'Ungroup':
            expect(menuItem.target).toBe(menuClass.header);
            expect(menuItem.iconCss).toBe(menuClass.ungroup);
            break;
        case 'Edit':
            expect(menuItem.target).toBe(menuClass.content);
            expect(menuItem.iconCss).toBe(menuClass.editIcon);
            break;
        case 'Delete':
            expect(menuItem.target).toBe(menuClass.content);
            expect(menuItem.iconCss).toBe(menuClass.delete);
            break;
        case 'Save':
            expect(menuItem.target).toBe(menuClass.edit);
            expect(menuItem.iconCss).toBe('e-icons ' + menuClass.save);
            break;
        case 'Cancel':
            expect(menuItem.target).toBe(menuClass.edit);
            expect(menuItem.iconCss).toBe('e-icons ' + menuClass.cancel);
            break;
        case 'Copy':
            expect(menuItem.target).toBe(menuClass.content);
            expect(menuItem.iconCss).toBe('e-icons ' + menuClass.copy);
            break;
        case 'export':
            expect(menuItem.target).toBe(menuClass.content);
            expect(menuItem.iconCss).toBeFalsy();
            break;
        case 'PdfExport':
            expect(menuItem.target).toBe(menuClass.content);
            expect(menuItem.iconCss).toBe(menuClass.pdf);
            break;
        case 'ExcelExport':
            expect(menuItem.target).toBe(menuClass.content);
            expect(menuItem.iconCss).toBe(menuClass.excel);
            break;
        case 'CsvExport':
            expect(menuItem.target).toBe(menuClass.content);
            expect(menuItem.iconCss).toBe(menuClass.csv);
            break;
        case 'SortAscending':
            expect(menuItem.target).toBe(menuClass.header);
            expect(menuItem.iconCss).toBe(menuClass.ascending);
            break;
        case 'SortDescending':
            expect(menuItem.target).toBe(menuClass.header);
            expect(menuItem.iconCss).toBe(menuClass.descending);
            break;
        case 'FirstPage':
            expect(menuItem.target).toBe(menuClass.pager);
            expect(menuItem.iconCss).toBe(menuClass.fPage);
            break;
        case 'PrevPage':
            expect(menuItem.target).toBe(menuClass.pager);
            expect(menuItem.iconCss).toBe(menuClass.pdf);
            break;
        case 'LastPage':
            expect(menuItem.target).toBe(menuClass.pager);
            expect(menuItem.iconCss).toBe(menuClass.lPage);
            break;
        case 'NextPage':
            expect(menuItem.target).toBe(menuClass.pager);
            expect(menuItem.iconCss).toBe(menuClass.nPage);
            break;
    };
}
describe('context menu module', () => {
    describe('default items', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data.map(data => data),
                    allowGrouping: true,
                    groupSettings: { showGroupedColumn: true, showToggleButton: true, showUngroupButton: true },
                    allowResizing: true,
                    allowSorting: true,
                    editSettings: { allowDeleting: true, allowEditing: true },
                    allowPaging: true,
                    pageSettings: {
                        pageSize: 10
                    },
                    allowExcelExport: true,
                    allowPdfExport: true,
                    contextMenuItems: ['AutoFitAll', 'AutoFit',
                        'Group', 'Ungroup', 'Edit', 'Delete', 'Save', 'Cancel',
                        'PdfExport', 'ExcelExport', 'CsvExport', 'SortAscending', 'SortDescending',
                        'FirstPage', 'PrevPage', 'LastPage', 'NextPage', 'Copy'],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Left', width: 125, isPrimaryKey: true },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 120 },
                        { field: 'ShipCity', headerText: 'Ship City', width: 170 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150, textAlign: 'Right' }
                    ]
                }, done);
        });
        it('render', () => {
            expect((gridObj.contextMenuModule as any).element).not.toBe(null);
            expect((gridObj.contextMenuModule as any).element.id).toBe(gridObj.element.id + '_cmenu');
            expect(gridObj.contextMenuModule.contextMenu.enableRtl).toBe(gridObj.enableRtl);
            expect(gridObj.contextMenuModule.contextMenu.locale).toBe(gridObj.locale);
            expect(gridObj.contextMenuModule.contextMenu.enablePersistence).toBe(gridObj.enablePersistence);
            expect(gridObj.contextMenuModule.contextMenu.target).toBe('#' + gridObj.element.id);
            expect(gridObj.contextMenuModule.contextMenu.cssClass).toBe('e-grid-menu');
            expect(gridObj.contextMenuModule.contextMenu.items.length).toBe(gridObj.contextMenuItems.length - 3 + 1);
            expect((gridObj.contextMenuModule as any).getModuleName()).toBe('contextMenu');
            expect(gridObj.contextMenuModule.getContextMenu()).toBe((gridObj.contextMenuModule as any).element);
        });

        it('build default item', () => {
            (gridObj.contextMenuModule as any).targetColumn = gridObj.getColumnByField('EmployeeID');
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getDataRows()[1].firstChild };
            for (let item of gridObj.contextMenuItems) {
                let itemModel = (gridObj.contextMenuModule as any).defaultItems[item as string];
                if ((item as string).toLocaleLowerCase().indexOf('export') !== -1) {
                    // let itemModel: ContextMenuItemModel = (gridObj.contextMenuModule as any).defaultItems['export']; //random failure
                    // expect(itemModel).not.toBe(null);
                    // targetAndIconCheck(itemModel);
                    // let presence = false;
                    // for (let i of itemModel.items) {
                    //     if ((gridObj.contextMenuModule as any).getKeyFromId(i.id) === item as string) {
                    //         presence = true;
                    //         targetAndIconCheck(i);
                    //         (gridObj.contextMenuModule as any).contextMenuItemClick({ item: i });
                    //         break;
                    //     }
                    // }
                    // expect(presence).toBeTruthy();
                } else {
                    if ((item as string).toLocaleLowerCase().indexOf('delete') !== -1) {
                        (gridObj.contextMenuModule as any).selectRow({ target: gridObj.getDataRows()[1].firstChild });
                    }

                    targetAndIconCheck(itemModel);
                    expect(itemModel).not.toBe(null);
                    (gridObj.contextMenuModule as any).contextMenuItemClick({ item: itemModel });
                }
            }
            if (gridObj.element.querySelector('#' + gridObj.element.id + 'EditAlert').querySelector('button')) {
                gridObj.element.querySelector('#' + gridObj.element.id + 'EditAlert').querySelector('button').click();
            }
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = targetAndIconCheck = null;
        });
    });
    describe('default items functionality', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.map(data => data),
                    allowGrouping: true,
                    groupSettings: { showGroupedColumn: true, showToggleButton: true, showUngroupButton: true },
                    allowResizing: true,
                    allowSorting: true,
                    editSettings: { allowDeleting: true, allowEditing: true },
                    allowPaging: true,
                    pageSettings: {
                        pageSize: 5
                    },
                    allowExcelExport: true,
                    allowPdfExport: true,
                    contextMenuItems: ['AutoFitAll', 'AutoFit',
                        'Group', 'Ungroup', 'Edit', 'Delete', 'Save', 'Cancel',
                        'PdfExport', 'ExcelExport', 'CsvExport', 'SortAscending', 'SortDescending',
                        'FirstPage', 'PrevPage', 'LastPage', 'NextPage', 'Copy'],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Left', width: 125, isPrimaryKey: true },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 120 },
                        { field: 'ShipCity', headerText: 'Ship City', width: 170 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150, textAlign: 'Right' }
                    ]
                }, done);
        });
        it('do sort in header', (done) => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getHeaderTable().querySelector('th') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr.edoas')
            };
            gridObj.sortColumn('OrderID', 'Ascending');
            gridObj.actionComplete = function (args) {
                if (args.requestType === 'sorting') {

                    gridObj.actionComplete = null;
                    done();
                }
            };
        });
        it('header with sort test', (done) => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getHeaderTable().querySelector('th') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr.edoas')
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect((gridObj.contextMenuModule as any).hiddenItems.length).toBeGreaterThan(0);
            expect((gridObj.contextMenuModule as any).hiddenItems.length).toBe(10);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Sort Ascending')).toBeGreaterThanOrEqual(0);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Ungroup by this column')).toBeGreaterThanOrEqual(0);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            expect((gridObj.contextMenuModule as any).isOpen).toBe(true);
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
            expect((gridObj.contextMenuModule as any).hiddenItems.length).toBe(0);
            expect((gridObj.contextMenuModule as any).disableItems.length).toBe(0);
            expect((gridObj.contextMenuModule as any).isOpen).toBe(false);
            gridObj.groupColumn('OrderID');
            gridObj.sortColumn('OrderID', 'Descending');
            gridObj.actionComplete = function (args) {
                if (args.requestType === 'sorting') {
                    gridObj.actionComplete = null;
                    done();
                }
            };
        });
        it('header with sort and group test', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getHeaderTable().querySelectorAll('th')[1] };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr.edoas')
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Sort Descending')).toBeGreaterThanOrEqual(0);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Group by this column')).toBeGreaterThanOrEqual(0);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
            expect((gridObj.contextMenuModule as any).hiddenItems.length).toBe(0);
            expect((gridObj.contextMenuModule as any).disableItems.length).toBe(0);
        });
        it('content', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getContent().querySelector('tr').querySelector('td') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect((gridObj.contextMenuModule as any).hiddenItems.length).toBe(12);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
            expect((gridObj.contextMenuModule as any).hiddenItems.length).toBe(0);
            expect((gridObj.contextMenuModule as any).disableItems.length).toBe(0);
            gridObj.clearSelection();
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Copy')).toBeGreaterThanOrEqual(0);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
        });
        it('page 1 test', (done) => {
            (gridObj.contextMenuModule as any).eventArgs = { target: (gridObj.pagerModule as any).element };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect((gridObj.contextMenuModule as any).hiddenItems.length).toBe(12);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('First Page')).toBeGreaterThanOrEqual(0);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Previous Page')).toBeGreaterThanOrEqual(0);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
            gridObj.goToPage(2);
            gridObj.dataBound = function () {
                gridObj.dataBound = null;
                done();
            };
        });
        it('page 2 test', (done) => {
            (gridObj.contextMenuModule as any).eventArgs = { target: (gridObj.pagerModule as any).element };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('First Page')).toBe(-1);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Previous Page')).toBe(-1);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Next Page')).toBe(-1);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Last Page')).toBe(-1);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
            let a = (gridObj.contextMenuModule as any).getLastPage();
            gridObj.goToPage(a);
            gridObj.dataBound = function () {
                gridObj.dataBound = null;
                done();
            };
        });
        it('last page test', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: (gridObj.pagerModule as any).element };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('First Page')).toBe(-1);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Previous Page')).toBe(-1);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Next Page') >= 0).toBeTruthy();
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Last Page') >= 0).toBeTruthy();
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
        });
        it('edited row', () => {
            gridObj.editModule.startEdit(gridObj.getContent().querySelectorAll('tr')[1]);
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getContentTable().querySelector('.e-inline-edit') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect((gridObj.contextMenuModule as any).hiddenItems.length).toBe(14);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Save')).toBe(-1);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Cancel')).toBe(-1);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
            gridObj.editModule.endEdit();
        });
        it('sub menu', () => {
            let item = (gridObj.contextMenuModule as any).defaultItems['export'].items;
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getContent().querySelector('tr').querySelector('td') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            let subE = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: item
            };
            expect(subE.items.length).toBe(3);
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(subE);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
        });
        it('group header', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.element.querySelector('.e-groupdroparea') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect(gridObj.contextMenuModule.isOpen).toBeFalsy();
        });
        it('content but not in table', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getContent().firstChild };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items,
                cancel: false
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect(e.cancel).toBeTruthy();
        });
        it('heirarchy grid test', () => {
            let element = document.createElement('span');
            let gridEle = createElement('div', { className: 'e-grid' });
            gridEle.appendChild(element);
            document.body.appendChild(gridEle);
            (gridObj.contextMenuModule as any).eventArgs = { target: element };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items,
                cancel: false
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect(e.cancel).toBeTruthy();
            remove(gridEle);
        });

        it('touch pop check', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: createElement('div', { className: 'e-gridpopup' }) };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items,
                cancel: false
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect(e.cancel).toBeTruthy();
        });


        it('EJ2-6536 group caption check', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: createElement('div', { className: 'e-groupcaption' }) };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items,
                cancel: false
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect(e.cancel).toBeTruthy();
        });

        it('EJ2-6536 summarycell check', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: createElement('div', { className: 'e-summarycell' }) };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items,
                cancel: false
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect(e.cancel).toBeTruthy();
        });

        it('EJ2-6604 filterbarcell check', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: createElement('div', { className: 'e-filterbarcell' }) };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items,
                cancel: false
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect(e.cancel).toBeTruthy();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    describe('default items without required module', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    contextMenuItems: ['AutoFitAll', 'AutoFit',
                        'Group', 'Ungroup', 'Edit', 'Delete', 'Save', 'Cancel',
                        'PdfExport', 'ExcelExport', 'CsvExport', 'SortAscending', 'SortDescending',
                        'FirstPage', 'PrevPage', 'LastPage', 'NextPage', 'Copy'
                    ],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Left', width: 125, isPrimaryKey: true },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 120 },
                        { field: 'ShipCity', headerText: 'Ship City', width: 170 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150, textAlign: 'Right' }
                    ]
                }, done);
        });

        it('disabled items', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getHeaderTable().querySelector('th') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            gridObj.clearSelection();
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('AutoFit this column')).toBe(-1);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('AutoFit all column')).toBe(-1);
            expect((gridObj.contextMenuModule as any).disableItems.length).toBe(14);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
        });
        it('sub menu', () => {
            let item = (gridObj.contextMenuModule as any).defaultItems['export'].items;
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getContent().querySelector('tr').querySelector('td') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            let subE = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: item
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(subE);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('PDF Export')).toBeGreaterThanOrEqual(0);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('CSV Export')).toBeGreaterThanOrEqual(0);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Excel Export')).toBeGreaterThanOrEqual(0);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    describe('custom items', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: true,
                    pageSettings: {
                        pageSize: 10
                    },
                    contextMenuItems: [{ text: 'item1', target: '.e-header' }],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Left', width: 125, isPrimaryKey: true },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 120 },
                        { field: 'ShipCity', headerText: 'Ship City', width: 170 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150, textAlign: 'Right' }
                    ]
                }, done);
        });

        it('header', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getHeaderTable().querySelector('th') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
            expect(gridObj.contextMenuModule.contextMenu.items.length).toBe(1);
        });
        it('content', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getContent().querySelector('tr').querySelector('td') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect(gridObj.contextMenuModule.isOpen).toBe(false);
            expect((gridObj.contextMenuModule as any).disableItems.length).toBe(0);
            expect((gridObj.contextMenuModule as any).hiddenItems.length).toBe(0);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('batch Edit', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.map(data => data),
                    allowPaging: true,
                    editSettings: { allowDeleting: true, allowEditing: true, allowAdding: true, mode: 'Batch' },
                    pageSettings: {
                        pageSize: 10
                    },
                    contextMenuItems: ['AutoFitAll', 'AutoFit',
                        'Edit', 'Delete', 'Save', 'Cancel', 'SortAscending', 'SortDescending',
                        'FirstPage', 'PrevPage', 'LastPage', 'NextPage', 'Copy'],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Left', width: 125, isPrimaryKey: true },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 120 },
                        { field: 'ShipCity', headerText: 'Ship City', width: 170 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150, textAlign: 'Right' }
                    ]
                }, done);
        });

        it('batch editing', () => {
            let e: {};
            gridObj.editModule.editCell(1, 'CustomerID');
            (<HTMLInputElement>document.getElementById(gridObj.element.id + 'CustomerID')).value = 'Tomsp1';
            gridObj.editModule.saveCell();
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getHeaderTable().querySelector('th') };
            e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
            expect((gridObj.contextMenuModule as any).hiddenItems.indexOf('save') !== -1);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    describe('default items', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            gridObj = createGrid(
                {
                    dataSource: data.map(data => data),
                    dataBound: dataBound,
                    allowGrouping: true,
                    groupSettings: { showGroupedColumn: true, showToggleButton: true, showUngroupButton: true },
                    allowResizing: true,
                    allowSorting: true,
                    editSettings: { allowDeleting: true, allowEditing: true },
                    allowPaging: true,
                    pageSettings: {
                        pageSize: 10
                    },
                    allowExcelExport: true,
                    allowPdfExport: true,

                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Left', width: 125, isPrimaryKey: true },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 120 },
                        { field: 'ShipCity', headerText: 'Ship City', width: 170 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150, textAlign: 'Right' }
                    ]
                }, done);
        });
        it('Context menu set model ', () => {
            gridObj.contextMenuItems = ['AutoFitAll', 'AutoFit',
                'Group', 'Ungroup', 'Edit', 'Delete', 'Save', 'Cancel',
                'PdfExport', 'ExcelExport', 'CsvExport', 'SortAscending', 'SortDescending',
                'FirstPage', 'PrevPage', 'LastPage'],
                gridObj.dataBind();
            expect(gridObj.contextMenuModule.contextMenu.items.length).toBe(14);
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-7177-default items with empty datasource', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            let options: Object = {
                dataSource: [],
                allowPaging: true,
                contextMenuItems: ['AutoFitAll', 'AutoFit', { separator: true, target: '.e-headercell', iconCss: '', text: '', id: 'headerSep1' },
                    'Group', 'Ungroup',{ separator: true, target: '.e-headercell', iconCss: '', text: '', id: 'headerSep1' }, , 'Edit', 'Delete', 'Save', 'Cancel',
                    { separator: true, target: '.e-row', iconCss: '', text: '', id: 'contentSep1' }, 'PdfExport', 'ExcelExport', 'CsvExport', 'SortAscending', 'SortDescending',
                    'FirstPage', 'PrevPage', { separator: true, target: '.e-gridpager', iconCss: '', text: '', id: 'pagerSep1' }, 'LastPage', 'NextPage', 'Copy'
                ],
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Left', width: 125, isPrimaryKey: true },
                    { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                    { field: 'ShipName', headerText: 'Ship Name', width: 120 },
                    { field: 'ShipCity', headerText: 'Ship City', width: 170 },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 150, textAlign: 'Right' }
                ]
            }
            gridObj = createGrid(options, done);
        });

        it('disable items', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: (gridObj.pagerModule as any).element };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('First Page') >= 0).toBeTruthy();
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Previous Page') >= 0).toBeTruthy();
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Next Page') >= 0).toBeTruthy();
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Last Page') >= 0).toBeTruthy();
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Context menu events', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowPaging: true,
                contextMenuItems: ['AutoFit', 'AutoFitAll'],
                selectionSettings: {type: 'Multiple'}, 
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Left', width: 125, isPrimaryKey: true },
                    { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                    { field: 'ShipName', headerText: 'Ship Name', width: 120, showColumnMenu: false },
                    { field: 'ShipCity', headerText: 'Ship City', width: 170, showInColumnChooser: false },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 150, visible: false, textAlign: 'Right' }
                ]
            }, done);
        });
        it('context menu open', (done: Function) => {
            gridObj.contextMenuOpen = function (args: ContextMenuOpenEventArgs) {
                expect(args.column).not.toBe(null);
                gridObj.contextMenuOpen = null;
                done();
            }
            let eventArgs = { target: gridObj.getHeaderTable().querySelector('th') };
            let e = {
                event: eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr.edoas')
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
        });

        it('context menu click', (done: Function) => {
            gridObj.contextMenuClick = function (args: ContextMenuClickEventArgs) {
                expect(args.column).not.toBe(null);
                gridObj.contextMenuClick = null;
                done();
            }
            let colMenu = gridObj.contextMenuModule as any;
            let colMenuObj = colMenu.contextMenu as ContextMenuItemModel;
            colMenu.contextMenuItemClick({ item: colMenuObj.items[0], element: document.createElement('span') });
        });

        it('dynamic context menu items', () => {
            gridObj.contextMenuItems = ['Copy'];
            gridObj.dataBind();
            let colMenu = gridObj.contextMenuModule as any;
            let colMenuObj = colMenu.contextMenu as ContextMenuItemModel;
            expect(colMenuObj.items.length).toBe(1);
            expect(document.querySelectorAll('.e-grid-menu').length).toBe(1);
        });

        it('with multiselect', () => {
            gridObj.clearSelection();
            let eventArgs = { target: gridObj.getContent().querySelector('tr').querySelector('td') };
            let e = {
                event: eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect(gridObj.getSelectedRecords().length).toBe(1);
            gridObj.element.focus();
            gridObj.clearSelection();
            gridObj.selectRows([1,2,3]);
            eventArgs = { target: gridObj.getContent().querySelector('tr').querySelector('td') };
            e = {
                event: eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect(gridObj.getSelectedRecords().length).toBe(1);
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Delete enabled when no records in grid', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                editSettings: {allowDeleting: true},
                contextMenuItems: ['Delete'],
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Left', width: 125, isPrimaryKey: true },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 150, visible: false, textAlign: 'Right' }
                ]
            }, done);
        });

        // it('EJ2-7730===>empty record and disabling delete', () => {
           // expect((gridObj.contextMenuModule as any).ensureDisabledStatus('Delete')).toBe(true);
        // });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('context menu with frozen', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                contextMenuItems: ['AutoFit', 'Copy'],
                frozenColumns: 1, 
                frozenRows: 1,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Left', width: 125, isPrimaryKey: true },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 150, visible: false, textAlign: 'Right' }
                ]
            }, done);
        });

        it('header test', () => {
            let target = gridObj.getHeaderTable().querySelector('th');
            expect((gridObj.contextMenuModule as any).ensureFrozenHeader(target)).toBe(true);
        });
        it('header table content test', () => {
            let target = gridObj.getHeaderTable().querySelector('tr');
            expect((gridObj.contextMenuModule as any).ensureFrozenHeader(target)).toBe(true);
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
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('context menu with stacked header', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowPaging: true,
                contextMenuItems: [{ text: 'Column', target: '.e-headercell' },
                { text: 'Row', target: 'td' }, { text: 'Footer', target: '.e-gridpager' }],
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120, minWidth: 10 },
                    {
                        headerText: 'Order Details', columns: [
                            { field: 'OrderDate', headerText: 'Order Date', textAlign: 'Right', width: 135, format: 'yMd', minWidth: 10 },
                            { field: 'Freight', headerText: 'Freight($)', textAlign: 'Right', width: 120, format: 'C2', minWidth: 10 },
                        ]
                    },
                    {
                        headerText: 'Ship Details', columns: [
                            { field: 'ShippedDate', headerText: 'Shipped Date', textAlign: 'Right', width: 145, format: 'yMd', minWidth: 10 },
                            { field: 'ShipCountry', headerText: 'Ship Country', width: 140, minWidth: 10 },
                        ]
                    }
                ]
            }, done);
        });
    
        it('context menu with Stacked header', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getHeaderTable().querySelector('.e-stackedheadercell') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            expect(gridObj.contextMenuModule.isOpen).toBe(true);
        });
    
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('context menu with column template', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data.slice(0,5),
                selectionSettings: {type: 'Multiple'},
                contextMenuItems: ['AutoFit', 'Copy'],
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Left', width: 125, isPrimaryKey: true,
                        template: '	<span>{{OrderID}} </span>' },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 150, visible: false, textAlign: 'Right' }
                ]
            }, done);
        });

        it('select multiple rows', () => {
            gridObj.selectRowsByRange(0,2);
            expect(gridObj.getContent().querySelectorAll('tr[aria-selected=true]').length).toBe(3);
            let eventArgs = { target: gridObj.getContent().querySelector('tr').querySelector('span') };
            let e = {
                event: eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect(gridObj.getContent().querySelectorAll('tr[aria-selected=true]').length).toBe(3);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
});