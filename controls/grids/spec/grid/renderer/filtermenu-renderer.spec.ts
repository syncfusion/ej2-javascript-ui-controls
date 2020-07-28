/**
 * Grid Filtering spec document
 */
import { EventHandler, ChildProperty, EmitType, Browser } from '@syncfusion/ej2-base';
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
import { DatePicker, DateTimePicker  } from '@syncfusion/ej2-calendars';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { filterData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy, getKeyUpObj, getClickObj, getKeyActionObj } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

Grid.Inject(Filter, Page, Selection, Group, Sort, Reorder, ColumnMenu);

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
                this.skip(); //Skips test (in Chai)
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
                if (args.requestType === 'filterafteropen') {
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
                if (args.requestType === 'filterafteropen') {
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
                if (args.requestType === 'filterafteropen') {
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
                if (args.requestType === 'filterafteropen') {
                    let struiObj1: AutoComplete = document.querySelector('#strui-' + gridObj.getColumns()[1].uid)[instances][0];
                    expect(gridObj.filterSettings.columns[0].value).toEqual(struiObj1.value);
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
                if (args.requestType === 'filterafteropen') {
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
                if (args.requestType === 'filterafteropen') {
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
                if (args.requestType === 'filterafteropen') {
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
                if (args.requestType === 'filterafteropen') {
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
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterafteropen') {
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
                getClickObj(gridObj.getColumnHeaderByField('OrderDate').querySelector('.e-filtermenudiv')));
        });

        it('boolean filter ui render testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterafteropen') {
                    expect((gridObj.filterModule as any).filterModule.isDialogOpen).toEqual(true);
                    let instances: string = 'ej2_instances';
                    let boolObj: DropDownList = document.querySelector('#bool-ui-' + gridObj.getColumns()[4].uid)[instances][0];
                    boolObj.value = 'true';
                    (<HTMLInputElement>document.querySelector('.e-flmenu-okbtn')).click();
                    expect(gridObj.filterSettings.columns[0].field).toEqual('Verified');
                    expect(gridObj.filterSettings.columns.length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-filtered').length).toBe(1);
                    gridObj.actionComplete = null;
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
                if (args.requestType === 'filterafteropen') {
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
                if (args.requestType === 'filterafteropen') {
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
                if (args.requestType === 'filterafteropen') {
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
                if (args.requestType === 'filterafteropen') {
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
                if (args.requestType === 'filterafteropen') {
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
                if (args.requestType === 'filterafteropen') {
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
                if (args.requestType === 'filterafteropen') {
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
        let actionBegin: () => void;
        let actionComplete: () => void;
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
                                create: (args: { target: Element, column: Object }) => {
                                    let db: Object = new DataManager(filterData);
                                    let flValInput: HTMLElement = createElement('input', { className: 'flm-input' });
                                    args.target.appendChild(flValInput);
                                    this.dropInstance = new DropDownList({
                                        dataSource: new DataManager(filterData),
                                        fields: { text: 'CustomerID', value: 'CustomerID' },
                                        placeholder: 'Select a value',
                                        popupHeight: '200px'
                                    });
                                    this.dropInstance.appendTo(flValInput);
                                },
                                write: (args: {
                                    column: Object, target: Element, parent: any,
                                    filteredValue: number | string
                                }) => {
                                    this.dropInstance.value = args.filteredValue;
                                },
                                read: (args: { target: Element, column: any, operator: string, fltrObj: Filter }) => {
                                    args.fltrObj.filterByColumn(args.column.field, args.operator, this.dropInstance.value);

                                }
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
                if (args.requestType === 'filterafteropen') {
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
                if (args.requestType === 'filterafteropen') {
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
});