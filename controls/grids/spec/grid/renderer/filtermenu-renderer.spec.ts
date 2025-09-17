/**
 * Grid Filtering spec document
 */
import { EventHandler, ChildProperty, EmitType, Browser, initializeCSPTemplate } from '@syncfusion/ej2-base';
import { extend, getValue } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid, FilterSettings } from '../../../src/grid/base/grid';
import { StringFilterUI } from '../../../src/grid/renderer/string-filter-ui';
import { Filter } from '../../../src/grid/actions/filter';
import { FilterMenuRenderer } from '../../../src/grid/renderer/filter-menu-renderer';
import { ColumnMenu } from '../../../src/grid/actions/column-menu';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Page } from '../../../src/grid/actions/page';
import { CellType } from '../../../src/grid/base/enum';
import { ValueFormatter } from '../../../src/grid/services/value-formatter';
import { Column } from '../../../src/grid/models/column';
import { Selection } from '../../../src/grid/actions/selection';
import { DropDownList, AutoComplete } from '@syncfusion/ej2-dropdowns';
import { BooleanFilterUI } from '../../../src/grid/renderer/boolean-filter-ui';
import { FlMenuOptrUI } from '../../../src/grid/renderer/filter-menu-operator';
import { DatePicker, DateTimePicker  } from '@syncfusion/ej2-calendars';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { filterData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy, getKeyUpObj, getClickObj, getKeyActionObj } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import * as events from '../../../src/grid/base/constant';
import { NumberFilterUI } from '../../../src/grid/renderer/number-filter-ui';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import { IFilterCreate, IFilterRead, IFilterWrite } from '../../../src/grid/base/interface';

Grid.Inject(Filter, Page, Selection, Group, Sort, Reorder, ColumnMenu, VirtualScroll);

describe('filter menu module =>', () => {
    let gridObj: Grid;
    describe('filter menu with ui render test =>', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    columns: [{ field: 'OrderID', type: 'number' },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'Freight', format: 'C2', type: 'number', allowFiltering: false },
                    { field: 'OrderDate', format: 'yMd' },
                    { field: 'Verified' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                },
                done);
        });

        it('filter icon render based on column visibility', () => {
            expect(gridObj.element.querySelectorAll('.e-icon-filter').length).toBeLessThan(gridObj.getColumns().length);
        });
        it('number filter ui render testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    let flm: FilterMenuRenderer = new FilterMenuRenderer(
                        gridObj, gridObj.filterSettings as FilterSettings, gridObj.serviceLocator);
                    expect((gridObj.filterModule as any).filterModule.isDialogOpen).toEqual(true);
                    let instances: string = 'ej2_instances';
                    let element: Element;
                    let numberuiObj: NumericTextBox = document.querySelector('#numberui-' + gridObj.getColumns()[0].uid)[instances][0];
                    numberuiObj.value = 10248;
                    (<HTMLInputElement>document.querySelector('.e-flmenu-okbtn')).click();
                    expect(gridObj.filterSettings.columns[0].field).toEqual('OrderID');
                    expect(gridObj.filterSettings.columns.length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-filtered').length).toBe(1);
                    element = gridObj.element.querySelectorAll('.e-icon-filter')[0];
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });
        it('number filter functionalites testing', (done: Function) => {
            let instances: string = 'ej2_instances';
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    let numberuiObj1: NumericTextBox = document.querySelector('#numberui-' + gridObj.getColumns()[0].uid)[instances][0];
                    expect(gridObj.filterSettings.columns[0].value).toEqual(numberuiObj1.value);
                    (<HTMLInputElement>document.querySelector('.e-flmenu-cancelbtn')).click();
                    expect(gridObj.filterSettings.columns.length).toBe(0);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('string filter ui render testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    expect((gridObj.filterModule as any).filterModule.isDialogOpen).toEqual(true);
                    let instances: string = 'ej2_instances';
                    let struiObj: AutoComplete = document.querySelector('#strui-' + gridObj.getColumns()[1].uid)[instances][0];
                    struiObj.value = 'Vinet';
                    (<HTMLInputElement>document.querySelector('.e-flmenu-okbtn')).click();
                    expect(gridObj.filterSettings.columns[0].field).toEqual('CustomerID');
                    expect(gridObj.filterSettings.columns.length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-filtered').length).toBe(1);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });
        it('string filter functionalites testing', (done: Function) => {
            let instances: string = 'ej2_instances';
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    let struiObj1: AutoComplete = document.querySelector('#strui-' + gridObj.getColumns()[1].uid)[instances][0];
                    expect(gridObj.filterSettings.columns[0].value).toEqual((struiObj1.value as string | number | boolean | Date));
                    (<HTMLInputElement>document.querySelector('.e-flmenu-cancelbtn')).click();
                    expect(gridObj.filterSettings.columns.length).toBe(0);
                    gridObj.actionComplete = null;
                    done();

                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('string filter with null values', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    (<HTMLInputElement>document.querySelector('.e-flmenu-okbtn')).click();
                    expect(gridObj.filterSettings.columns.length).toBe(1);
                    gridObj.clearFiltering();
                    expect(gridObj.filterSettings.columns.length).toBe(0);
                    gridObj.actionBegin = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('string filter with model value retain', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    let args: any = { column: gridObj.getColumns()[1], filteredValue: '' };
                    let strUI: StringFilterUI = new StringFilterUI(
                        gridObj, gridObj.serviceLocator, gridObj.filterSettings as FilterSettings);
                    strUI.write(args);
                    gridObj.clearFiltering();
                    expect(gridObj.filterSettings.columns.length).toBe(0);
                    gridObj.actionBegin = null;
                    done();
                }
            };

            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('date filter ui render testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    expect((gridObj.filterModule as any).filterModule.isDialogOpen).toEqual(true);
                    let instances: string = 'ej2_instances';
                    let element: Element;
                    let dateObj: DatePicker = document.querySelector('#dateui-' + gridObj.getColumns()[3].uid)[instances][0];
                    dateObj.value = new Date('07/4/1996');
                    (<HTMLInputElement>document.querySelector('.e-flmenu-okbtn')).click();
                    expect(gridObj.filterSettings.columns[0].field).toEqual('OrderDate');
                    expect(gridObj.filterSettings.columns.length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-filtered').length).toBe(1);
                    gridObj.actionBegin = null;
                    done();

                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('OrderDate').querySelector('.e-filtermenudiv')));
        });
        it('date filter functionalites testing', (done: Function) => {
            let instances: string = 'ej2_instances';
            let element: Element;
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    let dateObj1: DatePicker = document.querySelector('#dateui-' + gridObj.getColumns()[3].uid)[instances][0];
                    expect(gridObj.filterSettings.columns[0].value.toString()).toEqual(dateObj1.value.toString());
                    (<HTMLInputElement>document.querySelector('.e-flmenu-cancelbtn')).click();
                    expect(gridObj.filterSettings.columns.length).toBe(0);
                    gridObj.actionBegin = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('OrderDate').querySelector('.e-filtermenudiv')));

        });

        it('date filter with null values', (done: Function) => {
            gridObj.cssClass = 'coverage';
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    (<HTMLInputElement>document.querySelector('.e-flmenu-okbtn')).click();
                    expect(gridObj.filterSettings.columns.length).toBe(2);
                    gridObj.clearFiltering();
                    expect(gridObj.filterSettings.columns.length).toBe(0);
                    gridObj.actionBegin = null;
                    done();
                }
            };

            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('OrderDate').querySelector('.e-filtermenudiv')));
        });

        it('boolean filter ui render testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    expect((gridObj.filterModule as any).filterModule.isDialogOpen).toEqual(true);
                    let instances: string = 'ej2_instances';
                    let boolObj: DropDownList = document.querySelector('#bool-ui-' + gridObj.getColumns()[4].uid)[instances][0];
                    boolObj.value = 'true';
                    (<HTMLInputElement>document.querySelector('.e-flmenu-okbtn')).click();
                    expect(gridObj.filterSettings.columns[0].field).toEqual('Verified');
                    expect(gridObj.filterSettings.columns.length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-filtered').length).toBe(1);
                    gridObj.actionComplete = null;
                    gridObj.cssClass = undefined;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('Verified').querySelector('.e-filtermenudiv')));

        });
        it('boolean filter functionalites testing', (done: Function) => {
            let instances: string = 'ej2_instances';
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    expect(gridObj.filterSettings.columns[0].value).toEqual(gridObj.filterSettings.columns[0].value);
                    (<HTMLInputElement>document.querySelector('.e-flmenu-cancelbtn')).click();
                    expect(gridObj.filterSettings.columns.length).toBe(0);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('Verified').querySelector('.e-filtermenudiv')));

        });

        it('number filter ui change render testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                let flm: FilterMenuRenderer = new FilterMenuRenderer(
                    gridObj, gridObj.filterSettings as FilterSettings, gridObj.serviceLocator);
                if (args.requestType === 'filterAfterOpen') {
                    expect((gridObj.filterModule as any).filterModule.isDialogOpen).toEqual(true);
                    let instances: string = 'ej2_instances';
                    const dd: DropDownList = document.querySelector('.e-dropdownlist')[instances][0];
                    dd.value = 'isnull';
                    const valInput: HTMLElement = document.querySelector('.e-flmenu-valuediv').querySelector('input');
                    expect(valInput[instances][0].enabled).toBe(true);
                    dd.change();
                    expect(valInput[instances][0].enabled).toBe(false);
                    dd.value = 'equal';
                    dd.refresh();
                    (flm as any).closeResponsiveDialog();
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('filter menu with datetime filtering  =>', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    columns: [{ field: 'OrderID', type: 'number' },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'Freight', format: 'C2', type: 'number', allowFiltering: false },
                    { field: 'OrderDate', format: 'yMd', type:'datetime' },
                    { field: 'Verified' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                },
                done);
        });

        it('datetime filter ui render testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    expect((gridObj.filterModule as any).filterModule.isDialogOpen).toEqual(true);
                    let instances: string = 'ej2_instances';
                    let element: Element;
                    let dateObj: DateTimePicker = document.querySelector('#dateui-' + gridObj.getColumns()[3].uid)[instances][0];
                    dateObj.value = new Date();
                    (<HTMLInputElement>document.querySelector('.e-flmenu-okbtn')).click();
                    expect(gridObj.filterSettings.columns[0].field).toEqual('OrderDate');
                    expect(gridObj.filterSettings.columns.length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-filtered').length).toBe(1);
                    gridObj.actionBegin = null;
                    done();

                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('OrderDate').querySelector('.e-filtermenudiv')));
        });


        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('filter menu with multiple filtering  =>', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    columns: [{ field: 'OrderID', type: 'number' },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'Freight', format: 'C2', type: 'number', allowFiltering: false },
                    { field: 'OrderDate', format: 'yMd' },
                    { field: 'Verified' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                },
                done);
        });
        it('mutipe filter testing string column', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    let instances: string = 'ej2_instances';
                    let struiObj: AutoComplete = document.querySelector('#strui-' + gridObj.getColumns()[1].uid)[instances][0];
                    struiObj.value = 'Vinet';
                    (<HTMLInputElement>document.querySelector('.e-flmenu-okbtn')).click();
                    expect(gridObj.filterSettings.columns.length).toBe(1);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('mutipe filter testing number column', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    let instances: string = 'ej2_instances';
                    let numberuiObj: NumericTextBox = document.querySelector('#numberui-' + gridObj.getColumns()[0].uid)[instances][0];
                    numberuiObj.value = 10248;
                    (<HTMLInputElement>document.querySelector('.e-flmenu-okbtn')).click();
                    expect(gridObj.element.querySelectorAll('.e-filtered').length).toBe(2);
                    expect(gridObj.filterSettings.columns.length).toBe(2);
                    expect(gridObj.filterSettings.columns[0].value).toBe('Vinet');
                    expect(gridObj.filterSettings.columns[1].value).toBe(10248);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('reorder column with filtering menu  =>', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    allowReordering: true,
                    columns: [{ field: 'OrderID', type: 'number' },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'Freight', format: 'C2', type: 'number', allowFiltering: false },
                    { field: 'OrderDate', format: 'yMd' },
                    { field: 'Verified' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                },
                done);
        });
        it('reorder columns with filtering menu=>', () => {
            gridObj.reorderColumns('OrderID', 'CustomerID');
            expect(gridObj.element.querySelectorAll('.e-icon-filter').length).toBeLessThan(gridObj.getColumns().length);
            gridObj.reorderColumns('Freight', 'Verified');
            expect(gridObj.element.querySelectorAll('.e-icon-filter').length).toBeLessThan(gridObj.getColumns().length);
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('DataManager with filtering menu  =>', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: new DataManager(filterData),
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    allowReordering: true,
                    columns: [{ field: 'OrderID', type: 'number' },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'Freight', format: 'C2', type: 'number', allowFiltering: false },
                    { field: 'OrderDate', format: 'yMd' },
                    { field: 'Verified' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                },
                done);
        });
        it('DataManager with string column filtering menu=>', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    expect((gridObj.filterModule as any).filterModule.isDialogOpen).toEqual(true);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('DataManager with boolean column filtering menu', (done: Function) => {
            let instances: string = 'ej2_instances';
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    expect((gridObj.filterModule as any).filterModule.isDialogOpen).toEqual(true);
                    let instances: string = 'ej2_instances';
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('Verified').querySelector('.e-filtermenudiv')));

        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('filtering menu with column type  =>', () => {
        let gridObj: Grid;
        let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            Browser.userAgent = androidPhoneUa;
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    allowReordering: true,
                    columns: [{ field: 'OrderID', type: 'number' },
                    { field: 'CustomerID', type: 'string', filter: { type: 'Menu' } },
                    { field: 'Freight', format: 'C2', type: 'number', allowFiltering: false },
                    { field: 'OrderDate', format: 'yMd' },
                    { field: 'Verified', filter: { type: 'CheckBox' } }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                },
                done);
        });
        it('filtering menu open based on its column type =>', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    expect((gridObj.filterModule as any).filterModule.isDialogOpen).toEqual(true);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        afterAll(() => {
            let desktop: string = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
            Browser.userAgent = desktop;
            destroy(gridObj);
        });
    });

    describe('filtering menu template and custom filter operators  =>', () => {
        let gridObj: Grid;
        let dropInstance: any;
        let actionBegin: () => void;
        let actionComplete: () => void;
        (window as any).filterMenudestroy = () => {
            dropInstance.destroy();
            dropInstance = null;
        };
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: {
                        type: 'Menu', operators: {
                            stringOperator: [
                                { value: 'startsWith', text: 'starts with' },
                                { value: 'endsWith', text: 'ends with' },
                                { value: 'contains', text: 'contains' }],
                            numberOperator: [
                                { value: 'equal', text: 'equal' }
                            ]
                        }
                    },
                    allowReordering: true,
                    columns: [{ field: 'OrderID', type: 'number' },
                    {
                        field: 'CustomerID', type: 'string', filter: {
                            ui: {
                                create: (args: IFilterCreate) => {
                                    let db: Object = new DataManager(filterData);
                                    let flValInput: HTMLElement = createElement('input', { className: 'flm-input' });
                                    args.target.appendChild(flValInput);
                                    dropInstance = new DropDownList({
                                        dataSource: new DataManager(filterData),
                                        fields: { text: 'CustomerID', value: 'CustomerID' },
                                        placeholder: 'Select a value',
                                        popupHeight: '200px'
                                    });
                                    dropInstance.appendTo(flValInput);
                                },
                                write: (args: IFilterWrite) => {
                                    dropInstance.value = args.filteredValue;
                                },
                                read: (args: IFilterRead) => {
                                    args.fltrObj.filterByColumn(args.column.field, args.operator, dropInstance.value);

                                },
                                destroy: 'filterMenudestroy'
                            }
                        }
                    },
                    { field: 'Freight', format: 'C2', type: 'number', allowFiltering: false },
                    { field: 'OrderDate', format: 'yMd' },
                    { field: 'Verified' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                },
                done);
        });
        it('custom control with filtering menu =>', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    expect((gridObj.filterModule as any).filterModule.isDialogOpen).toEqual(true);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
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
        });
    });

    describe('EJ2-38311 ==> filtering menu with object type format  =>', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    allowReordering: true,
                    columns: [{ field: 'OrderID', type: 'number' },
                    { field: 'Freight', format: {format:'C2'}, type: 'number' }
                    ],
                    actionComplete: actionComplete
                },
                done);
        });
        it('filtering menu open based on its column type =>', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    expect((gridObj.filterModule as any).filterModule.dlgDiv.querySelector('.e-numerictextbox').ej2_instances[0].format).
                    toBe((gridObj.columns[1] as any).format.format);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('EJ2-41242 ==> filtering menu with custom data  =>', () => {
        let gridObj: Grid;
        let dataStateChange: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: { result: filterData, count: filterData.length},
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    allowReordering: true,
                    columns: [{ field: 'OrderID', type: 'number' },
                    { field: 'CustomerID' }
                    ],
                    dataStateChange: dataStateChange,
                },
                done);
        });
        it('filtering menu open based on its column type =>', (done: Function) => {
            dataStateChange = (args?: any): void => {
                expect(args.action.requestType).toBe('stringfilterrequest');
                gridObj.dataStateChange = null;
                done();
            };
            gridObj.dataStateChange = dataStateChange;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('autocomplete data check =>', () => {
            expect((document.querySelector('.e-autocomplete') as any).ej2_instances[0].dataSource).not.toBe(0);
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });
    describe('EJ2-43342 ==> filtering menu with checkbox  =>', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        let actionBegin: any = (args?: any) => {
            if (args.requestType == "filterBeforeOpen") {
                gridObj.filterModule.menuOperator = [{ value: 'equal', text: 'Equal' },
                { value: 'notequal', text: 'Not Equal' }];
            }
        };
        (window as any).renderCheckBoxMenu = function (value: any): HTMLElement {
            return gridObj.filterModule.renderCheckboxOnFilterMenu()
        };
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    allowReordering: true,
                    columns: [{ field: 'OrderID', type: 'number' },
                    { field: 'CustomerID', filterTemplate: '${renderCheckBoxMenu(data)}', }
                    ],
                    actionBegin: actionBegin,
                },
                done);
        });
        it('filtering menu checkbox ui testing =>', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    let menuCheckBoxFilter: HTMLElement = gridObj.element.querySelector('.e-menucheckbox');
                    let flm: FilterMenuRenderer = new FilterMenuRenderer(
                        gridObj, gridObj.filterSettings as FilterSettings, gridObj.serviceLocator);
                    expect(menuCheckBoxFilter.querySelector('.e-searchbox')).not.toBe(null);
                    expect(menuCheckBoxFilter.querySelector('.e-spinner')).not.toBe(null);
                    expect(menuCheckBoxFilter.querySelector('.e-flm_optrdiv')).not.toBe(null);
                    expect(menuCheckBoxFilter.querySelectorAll('.e-check').length).toBe(44);
                    (<HTMLInputElement>menuCheckBoxFilter.querySelectorAll('.e-check')[1]).click();
                    (menuCheckBoxFilter.querySelector('.e-dropdownlist') as any).ej2_instances[0].value = 'notequal';
                    (<HTMLInputElement>document.querySelector('.e-primary')).click();
                    expect(gridObj.filterSettings.columns[0].field).toEqual('CustomerID');
                    expect(gridObj.filterSettings.columns.length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-filtered').length).toBe(1);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    

    describe('Code Coverage for BooleanFilterUI =>', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    filterSettings: { type: 'Menu' },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'Verified', width: 150, headerText: 'Verified', validationRules: { required: true } },
                        { field: 'CustomerID', headerText: 'Customer Name', width: 150 },
                        { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right' },
                        { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' },
                        { field: 'ShippedDate', headerText: 'Shipped Date', width: 140, format: 'yMd', textAlign: 'Right' },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 150 }
                    ]
                },
                done);
        });
        it('boolean filter ui render testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    let dropDownList: DropDownList = document.querySelector('.e-filter-popup').querySelectorAll('.e-dropdownlist')[1]['ej2_instances'][0];
                    dropDownList.showPopup();
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('Verified').querySelector('.e-filtermenudiv')));
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Code Coverage for date FilterUI =>', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    filterSettings: { type: 'Menu' },
                    cssClass: 'e-grid',
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'Verified', width: 150, headerText: 'Verified', validationRules: { required: true } },
                        { field: 'CustomerID', headerText: 'Customer Name', width: 150 },
                        { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right' },
                        { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' },
                        { field: 'ShippedDate', headerText: 'Shipped Date', width: 140, format: 'yMd', type: 'dateonly', textAlign: 'Right' },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 150 }
                    ]
                },
                done);
        });
        it('date filter ui render testing', (done: Function) => {
            let filter: BooleanFilterUI = new BooleanFilterUI(undefined, undefined, undefined);
            let string: StringFilterUI = new StringFilterUI(undefined, undefined, undefined);
            let menu: FlMenuOptrUI = new FlMenuOptrUI(undefined, undefined, undefined);
            let number: NumberFilterUI = new NumberFilterUI(undefined, undefined, undefined);
            (number as any).dialogObj = {zIndex: '1'} as any;
            (number as any).openPopup(({popup: {element: {style: {zIndex: '1'}}}} as any));
            let numberActionCompete = (number as any).actionComplete('OrderID');
            numberActionCompete({result: [{OrderID: 1}]});
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    let datepicker: DatePicker = document.querySelector('.e-filter-popup').querySelectorAll('.e-datepicker')[0]['ej2_instances'][0];
                    datepicker.show();
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('ShippedDate').querySelector('.e-filtermenudiv')));
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });


    describe('Filter Menu Opertor test case', () => {
        let gridObj: Grid;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    filterSettings: { type: 'Menu' },
                    enableAdaptiveUI: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                        { field: 'Freight', headerText: 'Freight', width: 120 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 120 }
                    ],
                    actionComplete: actionComplete
                }, done);
        });

        it('field and foreignkeyvalue as same- multiple filtering', (done: Function) => {
            actionComplete = (e: any) => {
                e.filterModel.flMuiObj.renderResponsiveDropDownList({ popup: { element: document.querySelector('.e-responsive-dialog') } });
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll(".e-filtermenudiv")[1] as HTMLElement).click();
        });

        it('field and foreignkeyvalue as same- multiple filtering', () => {
            let dropdown: DropDownList = document.querySelector('.e-responsive-dialog').querySelectorAll('.e-dropdownlist')[0]['ej2_instances'][0];
            dropdown.showPopup();
        });


        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            actionComplete = null;
        });
    });


    describe('Filter Menu Opertor test case', () => {
        let gridObj: Grid;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    filterSettings: { type: 'Menu' },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                    ],
                    actionComplete: actionComplete
                }, done);
        });

        it('field and foreignkeyvalue as same- multiple filtering', (done: Function) => {
            actionComplete = (e: any) => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll(".e-filtermenudiv")[1] as HTMLElement).click();
        });

        it('field and foreignkeyvalue as same- multiple filtering', () => {
            let dropdown: DropDownList = document.querySelector('.e-filter-popup').querySelectorAll('.e-dropdownlist')[0]['ej2_instances'][0];
            dropdown.showPopup();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            actionComplete = null;
        });
    });


    describe('Filter Menu file Code Coverage - 1 => ', () => {
        let gridObj: Grid;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    columns: [
                        { field: 'OrderID', type: 'number', visible: true },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 120, filter: { type: 'CheckBox' } }
                    ],
                    actionComplete: actionComplete,
                }, done);
        });

        it('open filter menu filtering', (done: Function) => {
            actionComplete = (e: any) => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll(".e-filtermenudiv")[1] as HTMLElement).click();
        });

        it('clearCustomFilter coverage', (done: Function) => {
            actionComplete = (args?: Object): void => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterModule.filterModule.clearCustomFilter((gridObj as any).filterModule.column);
            (gridObj.element.querySelectorAll(".e-filtermenudiv")[1] as HTMLElement).click();
        });

        it('applyCustomFilter coverage', () => {
            gridObj.filterModule.filterModule.openDialog({ field: 'ShipCountry'});
            gridObj.filterModule.filterModule.applyCustomFilter({ col: (gridObj as any).filterModule.column });
        });

        it('getFilterUIInfo coverage', () => {
            gridObj.filterModule.filterModule.getFilterUIInfo();
        });

        it('filter menu coverage - 1', (done: Function) => {
            actionComplete = (args?: Object): void => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll(".e-filtermenudiv")[1] as HTMLElement).click();
        });

        it('filter menu afterRenderFilterUI coverage - 2', () => {
            (gridObj as any).filterModule.filterModule.currentDialogCreatedColumn.showColumnMenu = false;
            (gridObj as any).filterModule.filterModule.dlgObj.element.querySelector('.e-flm_optrdiv').querySelector('input').value = 'Empty';
            (gridObj as any).filterModule.filterModule.afterRenderFilterUI();
        });

        it('filter menu coverage - 2', (done: Function) => {
            gridObj.on(events.filterMenuClose, (args: any) => {
                args.cancel = true;
                gridObj.off(events.filterMenuClose);
                done();
            });
            (gridObj as any).filterModule.filterModule.closeDialog();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });


    describe('Filter Menu file Code Coverage - 2 => ', () => {
        let gridObj: Grid;
        let actionComplete: (args: any) => void;
        let template: string = '<input type="text" id="CustomerID" name="CustomerID" />';
        let template1: string = '<input type="text" id="ShipName" name="ShipName" />';
        let template2 = '<div><input type="checkbox" id="Boolean" name="Boolean" class="e-control" /></div>';
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    columns: [
                        { field: 'OrderID', type: 'number', visible: true },
                        { field: 'CustomerID', type: 'string', filterTemplate: template, foreignKeyValue:'CustomerID' },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 120, filter: { type: 'CheckBox' } },
                        { field: 'ShipName', headerText: 'Ship Name', width: 150, filterTemplate: template1, },
                        {  field: 'Verified', headerText: 'Boolean', width: 150, filterTemplate: template2, }
                    ],
                    actionComplete: actionComplete,
                }, done);
        });

        it('open filter menu with template - 1', (done: Function) => {
            actionComplete = (e: any) => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll(".e-filtermenudiv")[1] as HTMLElement).click();
        });                
        
        it('template filter - 1', (done: Function) => {
            actionComplete = (e: any) => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            (document.querySelector('.e-flmenu-okbtn') as any).click();
        });

        it('open filter menu with template - 2', (done: Function) => {
            actionComplete = (e: any) => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll(".e-filtermenudiv")[3] as HTMLElement).click();
        });                
        
        it('template filter - 2', (done: Function) => {
            (gridObj as any).filterModule.filterModule.dlgDiv.querySelector('.e-flmenu-valuediv').children[0].value = 'a';
            actionComplete = (e: any) => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            (document.querySelector('.e-flmenu-okbtn') as any).click();
        });

        it('open filter menu with template - 3', (done: Function) => {
            actionComplete = (e: any) => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll(".e-filtermenudiv")[4] as HTMLElement).click();
        });                
        
        it('template filter - 3', (done: Function) => {
            actionComplete = (e: any) => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.showColumnMenu = true;
            (document.querySelector('.e-flmenu-okbtn') as any).click();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = template = null;
        });
    });

    describe('Filter Menu file Code Coverage - 3 => ', () => {
        let gridObj: Grid;
        let actionComplete: (args: any) => void;
        let dropInstance: DropDownList;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    columns: [
                        { field: 'OrderID', type: 'number', visible: true },
                        { field: 'CustomerID', headerText: 'Customer Name', width: 120, filter: {
                            ui: {
                                create: (args: IFilterCreate) => {
                                    let flValInput: HTMLElement = gridObj.createElement('input', { className: 'flm-input' });
                                    args.target.appendChild(flValInput);
                                    dropInstance = new DropDownList({
                                        dataSource: new DataManager(filterData),
                                        fields: { text: 'CustomerID', value: 'CustomerID' },
                                        placeholder: 'Select a value',
                                        popupHeight: '200px'
                                    });
                                    dropInstance.appendTo(flValInput);
                                },
                                write: (args: IFilterWrite) => {
                                    dropInstance.value = args.filteredValue;
                                },
                                read: (args: IFilterRead) => {
                                    args.fltrObj.filterByColumn(args.column.field, args.operator, (dropInstance as any).value);
                                }
                            }
                        } },
                    ],
                    actionComplete: actionComplete,
                }, done);
        });

        it('open filter menu - create and write and read ', (done: Function) => {
            actionComplete = (e: any) => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll(".e-filtermenudiv")[1] as HTMLElement).click();
        });

        it('filter btn click - - create and write and read', (done: Function) => {
            actionComplete = (e: any) => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            (document.querySelector('.e-flmenu-okbtn') as any).click();
        });

 
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = dropInstance = null;
        });
    });

    describe('EJ2-892612 - Support for adaptive layout responsive dialog in specific rendering - 1 =>', () => {
        let gridObj: Grid;
        let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            Browser.userAgent = androidPhoneUa;
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    enableAdaptiveUI: true,
                    adaptiveUIMode: 'Desktop',
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    allowReordering: true,
                    columns: [{ field: 'OrderID', type: 'number' },
                    { field: 'CustomerID', type: 'string', filter: { type: 'Menu' } },
                    { field: 'Freight', format: 'C2', type: 'number', allowFiltering: false }
                    ],
                    actionComplete: actionComplete
                },
                done);
        });

        it('filtering menu open Desktop mode =>', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        afterAll(() => {
            let desktop: string = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
            Browser.userAgent = desktop;
            destroy(gridObj);
        });
    });


    describe('EJ2-892612 - Support for adaptive layout responsive dialog in specific rendering - 2=>', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    enableAdaptiveUI: true,
                    adaptiveUIMode: 'Mobile',
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    columns: [{ field: 'OrderID', type: 'number' },
                    { field: 'CustomerID', type: 'string', filter: { type: 'Menu' } },
                    { field: 'Freight', format: 'C2', type: 'number', allowFiltering: false }
                    ],
                    actionComplete: actionComplete
                },
                done);
        });

        it('filtering menu open Moblie mode =>', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(
                getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Filter Menu Operator Code Coverage => ', () => {
        let gridObj: Grid;
        let template: string = '<input type="text" id="CustomerID" name="CustomerID" />';
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    columns: [
                        { field: 'CustomerID' ,width:120, headerText:"Customer ID", filterTemplate: template },
                        { field: 'Freight',width:110 ,format:'C2',headerText:"Freight"},
                    ],
                    actionComplete: actionComplete,
                }, done);
        });
    
        it('open filter menu filtering', (done: Function) => {
            actionComplete = (e: any) => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll(".e-filtermenudiv")[0] as HTMLElement).click();
        });
    
        it('Open Dropdown list', () => {
            let dropDownList: DropDownList = document.querySelector('.e-filter-popup').querySelectorAll('.e-dropdownlist')[0]['ej2_instances'][0];
            dropDownList.showPopup();
        });

        it('Filter template isempty testing', () => {
            (<HTMLInputElement>document.querySelector(".e-dropdownbase").querySelector('[data-value="isempty"]')).click();
        });

        it('Open Dropdown list', () => {
            (gridObj.element.querySelectorAll(".e-filtermenudiv")[0] as HTMLElement).click();
            let dropDownList: DropDownList = document.querySelector('.e-filter-popup').querySelectorAll('.e-dropdownlist')[0]['ej2_instances'][0];
            dropDownList.showPopup();
        });

        it('Filter template null testing', () => {
            (<HTMLInputElement>document.querySelector(".e-dropdownbase").querySelector('[data-value="equal"]')).click();
        });
    
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('EJ2: 901721 => A script error occurs when using the filter template, after applying the filter and reopening the filter dialog. => ', () => {
        let gridObj: Grid;
        let shouldDisable: boolean = true;
        let template : string = `<input type="text" id="CustomerID" name="CustomerID" ${shouldDisable ? 'disabled' : ''} />`;
        let template1: string = '<input type="text" id="ShipCountry" name="ShipCountry" />';
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    columns: [
                        { field: 'CustomerID' ,width:120, headerText:"Customer ID", filterTemplate: template },
                        { field: 'ShipCountry', headerText: 'Ship Country', filterTemplate: template1 },
                    ],
                    actionComplete: actionComplete,
                }, done);
        });

        it('Filter template input field disable testing', () => {
            (gridObj.element.querySelectorAll(".e-filtermenudiv")[0] as HTMLElement).click();
        });
    
        it('Filter template testing', () => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    expect((gridObj.filterModule as any).filterModule.isDialogOpen).toEqual(true);
                    let dropDownList: DropDownList = document.querySelector('.e-filter-popup').querySelectorAll('.e-dropdownlist')[0]['ej2_instances'][0];
                    dropDownList.showPopup();
                    (<HTMLInputElement>document.querySelector(".e-dropdownbase").querySelector('[data-value="equal"]')).click();
                    (<HTMLInputElement>document.querySelector('.e-flmenu-okbtn')).click();
                    gridObj.actionComplete = null;
                }
            }
            (gridObj.element.querySelectorAll(".e-filtermenudiv")[1] as HTMLElement).click();
        });

        it('After Filtering click the filter icon testing', () => {
            (gridObj.element.querySelectorAll(".e-filtermenudiv")[1] as HTMLElement).click();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = shouldDisable = template = template1 = null;
        });
    });

    describe('EJ2: 916181 => All template is not rendering in React when using the CSPTemplate function. => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    columns: [
                        { field: 'CustomerID', width: 120, headerText: 'Customer ID', filterTemplate: initializeCSPTemplate(function() {
                            return '<input type="text" id="ShipCountry" name="ShipCountry" />' }) },
                        { field: 'ShipCountry', headerText: 'Ship Country' }
                    ]
                }, done);
        });

        it('Click the filter icon', () => {
            (gridObj.element.querySelectorAll(".e-filtermenudiv")[0] as HTMLElement).click();
        });

        it('Coverage for renderFIValueUI', (done: Function) => {
            gridObj.isReact = true;
            (gridObj.filterModule as any).filterModule.renderFlValueUI(document.body.querySelector('.e-flmenu-maindiv'),
                document.body.querySelector('.e-icon-filter'), gridObj.getColumns()[0]);
            done();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Filter Menu Code Coverage - 1 => ', () => {
        let gridObj: Grid;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Menu',
                        operators: {
                            stringOperator: [
                                { value: 'in', text: 'In' },
                            ],
                            numberOperator: [
                                { value: 'in', text: 'In' },
                            ],
                            booleanOperator: [
                                { value: 'in', text: 'In' },
                            ]
                        }
                     },
                    columns: [
                        { field: 'OrderID', type: 'number', visible: true},
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 120 },
                        { field: 'Verified', headerText: 'Verified', width: 150 }
                    ],
                    actionComplete: actionComplete,
                }, done);
        });
    
        it('open filter menu filtering orderID', (done: Function) => {
            actionComplete = (args: any) => {
                if(args.requestType == 'filterAfterOpen') {     
                    (args.filterModel.dlgDiv.querySelector('.e-flmenu-okbtn') as HTMLElement).click();
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll('.e-filtermenudiv')[0] as HTMLElement).click();
        });

        it('open filter menu filtering ShipCountry', (done: Function) => {
            actionComplete = (args: any) => {
                if(args.requestType == 'filterAfterOpen') {     
                    (args.filterModel.dlgDiv.querySelector('.e-flmenu-okbtn') as HTMLElement).click();
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll('.e-filtermenudiv')[1] as HTMLElement).click();
        });

        it('open filter menu filtering Verified', (done: Function) => {
            actionComplete = (args: any) => {
                if(args.requestType == 'filterAfterOpen') {     
                    (args.filterModel.dlgDiv.querySelector('.e-flmenu-okbtn') as HTMLElement).click();
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll('.e-filtermenudiv')[2] as HTMLElement).click();
        });
    
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('Filter Menu Code Coverage - 2 => ', () => {
        let gridObj: Grid;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    columns: [
                        { field: 'OrderID', type: 'number', visible: true },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 120 },
                        { field: 'Verified', headerText: 'Boolean', width: 150 }
                    ],
                    actionComplete: actionComplete,
                }, done);
        });
    
        it('open filter menu filtering orderID and destroy the intances', (done: Function) => {
            actionComplete = (args: any) => {
                if(args.requestType == 'filterAfterOpen') {     
                    (gridObj.filterModule as any).filterModule.closeDialog();
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll('.e-filtermenudiv')[0] as HTMLElement).click();
        });
        
        it('open filter menu filtering ShipCountry and destroy the intances', (done: Function) => {
            actionComplete = (args: any) => {
                if(args.requestType == 'filterAfterOpen') {     
                    (gridObj.filterModule as any).filterModule.closeDialog();
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll('.e-filtermenudiv')[1] as HTMLElement).click();
        });

        it('open filter menu filtering Verified and destroy the intances', (done: Function) => {
            actionComplete = (args: any) => {
                if(args.requestType == 'filterAfterOpen') {     
                    (gridObj.filterModule as any).filterModule.closeDialog();
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll('.e-filtermenudiv')[2] as HTMLElement).click();
        });
    
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('EJ2: 942488 => "Not Equal" Filter in Menu Type Filtering Fails for Date and DateTime type Columns. => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData.slice(0, 5),
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    columns: [
                        { field: 'OrderID', width: 100, headerText: 'Order ID' },
                        { field: 'CustomerID', width: 120, headerText: 'Customer ID' },
                        { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd' },
                        { field: 'Freight', width: 110, format: 'C2', headerText: 'Freight' },
                        { field: 'ShipCountry', width: 130, headerText: 'Ship Country' }
                    ]
                }, done);
        });

        it('Filter the date column', (done: Function) => {
            let actionComplete = () => {
                expect(gridObj.currentViewData.length).toBe(4);
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).filterModule.filterByColumn('OrderDate', 'notEqual', (gridObj as any).dataSource[3].OrderDate, 'and', true);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    
    describe('EJ2: 954669 => Error thrown when filtering a hidden column using filterByColumn() with column virtualization enabled => ', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData.splice(0,2),
                    allowFiltering: true,
                    enableColumnVirtualization: true,
                    columns: [
                        {
                            field: 'OrderID',
                            headerText: 'Order ID',
                            textAlign: 'Right',
                            width: 100
                        },
                        {
                            field: 'CustomerID',
                            headerText: 'CustomerID',
                            visible: false,
                            textAlign: 'Right',
                            width: 80
                        },
                        {
                            field: 'ShipCity',
                            headerText: 'Ship City',
                            width: 130
                        },
                    ],
                    height: 315
                }, done);
        });
    
        it('In enableColumnVirtualization, filterByColumn method in testing', (done: Function) => {
            actionComplete = (): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('CustomerID', 'startsWith', 'VINET');
        });
    
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('EJ2: 972656 => Filter popup overflows outside Grid => ', () => {
        let gridObj: Grid;    
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    width: 260,
                    filterSettings: { type: 'Menu' },
                    columns: [
                        { field: 'OrderID', width: 100, headerText: "Order ID" },
                        { field: 'CustomerID', width: 120, headerText: "Customer ID" },
                        { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd' },
                        { field: 'Freight', width: 110, format: 'C2', headerText: "Freight" },
                    ],
                }, done);
        });

        it('Open the filter popup', (done: Function) => {
            let actionComplete = (args: any) => {
                if(args.requestType == 'filterAfterOpen') {     
                    expect((gridObj as any).filterModule.filterModule.dlgDiv.style.left).toBe('12px');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll('.e-filtermenudiv')[0] as HTMLElement).click();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
});
