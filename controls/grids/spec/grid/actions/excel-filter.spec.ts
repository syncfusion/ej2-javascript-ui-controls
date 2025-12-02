/**
 * Grid Filtering spec document
 */
import { ChildProperty, EventHandler, L10n, initializeCSPTemplate } from '@syncfusion/ej2-base';
import { getValue } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { Group } from '../../../src/grid/actions/group';
import { LazyLoadGroup } from '../../../src/grid/actions/lazy-load-group';
import { Page } from '../../../src/grid/actions/page';
import { Sort } from '../../../src/grid/actions/sort';
import { createGrid, destroy, getClickObj } from '../base/specutil.spec';
import { Selection } from '../../../src/grid/actions/selection';
import { filterData, employeeData, groupData } from '../base/datasource.spec';
import { performComplexDataOperation } from '../../../src/grid/base/util';
import '../../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import { PredicateModel } from '../../../src/grid/base/grid-model';
import * as events from '../../../src/grid/base/constant';
import { ICustomOptr } from '../../../src/grid/base/interface';

Grid.Inject(Filter, Page, Selection, Group, LazyLoadGroup, Sort);

let getActualProperties: Function = (obj: any): any => {
    if (obj instanceof ChildProperty) {
        return <any>getValue('properties', obj);
    } else {
        return obj;
    }
};

let getString: Function = (obj: any) => {
    return JSON.stringify(obj, (key: string, value: Object) => {
        return getActualProperties(value);
    });
};

describe('Excel Filter =>', () => {
    let gridObj: Grid;
    let actionBegin: () => void;
    let actionComplete: () => void;

    let numOptr: { [key: string]: Object }[] = [
        { value: 'equal', text: 'Equal' },
        { value: 'greaterThan', text: 'Greater Than' },
        { value: 'greaterThanOrEqual', text: 'Greater Than Or Equal' },
        { value: 'lessThan', text: 'Less Than' },
        { value: 'lessThanOrEqual', text: 'Less Than Or Equal' },
        { value: 'notEqual', text: 'Not Equal' }
    ];
    let customOperators: ICustomOptr = {
        stringOperator: [
            { value: 'startsWith', text: 'Starts With' },
            { value: 'endsWith', text: 'Ends With' },
            { value: 'contains', text: 'Contains' },
            { value: 'equal', text: 'Equal' }, { value: 'notEqual', text: 'Not Equal' }],
        numberOperator: numOptr,
        dateOperator: numOptr,
        datetimeOperator: numOptr,
        booleanOperator: [
            { value: 'equal', text: 'Equal' }, { value: 'notEqual', text: 'Not Equal' }
        ]
    };
    describe('Excel Filter =>', () => {
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: false,
                    cssClass: 'e-grid',
                    filterSettings: {
                        type: 'Excel',
                        columns: [
                            {
                                field: "ShipCountry",
                                operator: "contains",
                                value: "a",
                                predicate: "or",
                                matchCase: false,
                            }
                        ]
                    },
                    columns: [
                        { field: 'OrderID', type: 'number', visible: true },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number' },
                        { field: 'Freight', format: 'C2', type: 'number' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean' },
                        { field: 'ShipName', allowFiltering: false },
                        { field: 'ShipCountry', type: 'string' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                }, done);
        });

        it('pre-filter-settings', (done: Function) => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(58);
            expect(getString(gridObj.filterSettings.columns)).toBe('[{"field":"ShipCountry","operator":"contains","value":"a","predicate":"or","matchCase":false,"uid":"' + gridObj.filterSettings.columns[0].uid + '","ignoreAccent":false,"actualFilterValue":{},"actualOperator":{}}]');
            done();
        });
        it('or-predicate', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(58);
                expect(getString(gridObj.filterSettings.columns)).toBe('[{"field":"ShipCountry","operator":"contains","value":"a","predicate":"or","matchCase":false,"uid":"' + gridObj.filterSettings.columns[0].uid + '","ignoreAccent":false,"actualFilterValue":{},"actualOperator":{}},{"field":"OrderID","predicate":"or","matchCase":false,"ignoreAccent":false,"operator":"greaterthan","value":10249,"type":"number","uid":"' + gridObj.filterSettings.columns[1].uid + '"},{"field":"OrderID","predicate":"or","matchCase":false,"ignoreAccent":false,"operator":"lessthan","value":10280,"type":"number","uid":"' + gridObj.filterSettings.columns[1].uid + '"}]');
                done();
            };


            let test = (<any>gridObj.filterModule);
            test.filterSettings = gridObj.filterSettings; //, gridObj.serviceLocator);
            let excel: any = new (<any>gridObj.filterModule).type['Excel'](
                gridObj, gridObj.filterSettings, gridObj.serviceLocator,
                customOperators);
            let column: any = gridObj.getColumnByField('OrderID');
            excel.excelFilterBase.updateModel({
                type: 'number', field: 'OrderID', displayName: 'Order ID',
                dataSource: gridObj.dataSource,
                filteredColumns: gridObj.filterSettings.columns, target: gridObj.element,
                query: gridObj.query,
                handler: test.filterHandler.bind(test), localizedStrings: {},
                column: column
            });
            excel.excelFilterBase.filterByColumn('OrderID', 'greaterthan', 10249, 'or', false, false, 'lessthan', 10280);
            gridObj.dataBind();
            gridObj.actionComplete = actionComplete;
        });

        it('and-predicate', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(55);
                expect(getString(gridObj.filterSettings.columns)).toBe('[{"field":"ShipCountry","operator":"contains","value":"a","predicate":"or","matchCase":false,"uid":"' + gridObj.filterSettings.columns[0].uid + '","ignoreAccent":false,"actualFilterValue":{},"actualOperator":{}},{"field":"OrderID","predicate":"and","matchCase":false,"ignoreAccent":false,"operator":"greaterthan","value":10249,"type":"number","uid":"' + gridObj.filterSettings.columns[1].uid + '"},{"field":"OrderID","predicate":"and","matchCase":false,"ignoreAccent":false,"operator":"notequal","value":10250,"type":"number","uid":"' + gridObj.filterSettings.columns[1].uid + '"}]');
                done();
            };

            let test = (<any>gridObj.filterModule);
            test.filterSettings = gridObj.filterSettings; //, gridObj.serviceLocator);
            let excel: any = new (<any>gridObj.filterModule).type['Excel'](
                gridObj, gridObj.filterSettings, gridObj.serviceLocator,
                customOperators);
            let column: any = gridObj.getColumnByField('OrderID');
            excel.excelFilterBase.updateModel({
                type: 'number', field: 'OrderID', displayName: 'Order ID',
                dataSource: gridObj.dataSource,
                filteredColumns: gridObj.filterSettings.columns, target: gridObj.element,
                query: gridObj.query,
                handler: test.filterHandler.bind(test), localizedStrings: {},
                column: column
            });
            excel.excelFilterBase.filterByColumn('OrderID', 'greaterthan', 10249, 'and', false, false, 'notequal', 10250);
            gridObj.dataBind();
            gridObj.actionComplete = actionComplete;
        });

        it('first value', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(56);
                expect(getString(gridObj.filterSettings.columns)).toBe('[{"field":"ShipCountry","operator":"contains","value":"a","predicate":"or","matchCase":false,"uid":"' + gridObj.filterSettings.columns[0].uid + '","ignoreAccent":false,"actualFilterValue":{},"actualOperator":{}},{"field":"OrderID","predicate":"and","matchCase":false,"operator":"greaterthan","value":10249,"type":"number","uid":"' + gridObj.filterSettings.columns[1].uid + '","ignoreAccent":false}]');
                done();
            };

            let test = (<any>gridObj.filterModule);
            test.filterSettings = gridObj.filterSettings; //, gridObj.serviceLocator);
            let excel: any = new (<any>gridObj.filterModule).type['Excel'](
                gridObj, gridObj.filterSettings, gridObj.serviceLocator,
                customOperators);
            let column: any = gridObj.getColumnByField('OrderID');
            excel.excelFilterBase.updateModel({
                type: 'number', field: 'OrderID', displayName: 'Order ID',
                dataSource: gridObj.dataSource,
                filteredColumns: gridObj.filterSettings.columns, target: gridObj.element,
                query: gridObj.query,
                handler: test.filterHandler.bind(test), localizedStrings: {},
                column: column
            });
            excel.excelFilterBase.filterByColumn('OrderID', 'greaterthan', 10249, 'and', false);//, undefined, 10250);
            gridObj.dataBind();
            gridObj.actionComplete = actionComplete;
        });

        it('EJ2-7592-Excel filter menu gets closed when click on the Text filter options', () => {

            let args: any = { event: { target: null }, cancel: false };
            let excel: any = new (<any>gridObj.filterModule).type['Excel'](
                gridObj, gridObj.filterSettings, gridObj.serviceLocator,
                customOperators);
            excel.excelFilterBase.preventClose(args);
            expect(args.cancel).toBeFalsy();
        });

        it('EJ2-7602-Excel Filter For notequal string operator Not Working', (done: Function) => {
            let value = (<string>gridObj.currentViewData[0]['ShipCountry']).toLowerCase();
            let actionComplete = (args: any) => {
                expect((<string>gridObj.currentViewData[0]['ShipCountry']).toLowerCase()).not.toBe(value);
                done();
            };
            gridObj.actionComplete = actionComplete;
            let test: any = <any>gridObj.filterModule;
            gridObj.filterSettings.columns.pop();
            test.column = gridObj.getColumnByField('ShipCountry');
            let excel: any = new test.type['Excel'](gridObj, gridObj.filterSettings, gridObj.serviceLocator, customOperators);
            let column: any = gridObj.getColumnByField('ShipCountry');
            excel.excelFilterBase.updateModel({
                type: 'string', field: 'ShipCountry', displayName: 'ShipCountry',
                dataSource: gridObj.dataSource,
                filteredColumns: gridObj.filterSettings.columns, target: gridObj.element,
                query: gridObj.query,
                handler: test.filterHandler.bind(test), localizedStrings: {},
                column: column
            });
            excel.excelFilterBase.filterByColumn('ShipCountry', 'notequal', value, 'and', true);
        });

        it('EJ2-7598-Excel Contains Filter Not Working Properly', (done: Function) => {
            let actionComplete: any = (args: any) => {
                expect((<string>gridObj.currentViewData[0]['ShipCountry']).toLowerCase()).toBe('france');
                done();
            };
            gridObj.actionComplete = actionComplete;
            let test: any = <any>gridObj.filterModule;
            gridObj.filterSettings.columns.pop();
            test.column = gridObj.getColumnByField('ShipCountry');
            let excel: any = new test.type['Excel'](gridObj, gridObj.filterSettings, gridObj.serviceLocator, customOperators);
            let column: any = gridObj.getColumnByField('ShipCountry');
            excel.excelFilterBase.updateModel({
                type: 'string', field: 'ShipCountry', displayName: 'ShipCountry',
                dataSource: gridObj.dataSource,
                filteredColumns: gridObj.filterSettings.columns, target: gridObj.element,
                query: gridObj.query,
                handler: test.filterHandler.bind(test), localizedStrings: {},
                column: column
            });
            excel.excelFilterBase.filterByColumn('ShipCountry', 'contains', 'fra', 'and', false);
        });

        it('EJ2-7601-Excel Filter For Starts With Not Working', (done: Function) => {
            let actionComplete: any = (args: any) => {
                expect((<string>gridObj.currentViewData[0]['ShipCountry']).toLowerCase()).toBe('france');
                done();
            };
            gridObj.actionComplete = actionComplete;
            let test: any = <any>gridObj.filterModule;
            gridObj.filterSettings.columns.pop();
            test.column = gridObj.getColumnByField('ShipCountry');
            let excel: any = new test.type['Excel'](gridObj, gridObj.filterSettings, gridObj.serviceLocator, customOperators);
            let column: any = gridObj.getColumnByField('ShipCountry');
            excel.excelFilterBase.updateModel({
                type: 'string', field: 'ShipCountry', displayName: 'ShipCountry',
                dataSource: gridObj.dataSource,
                filteredColumns: gridObj.filterSettings.columns, target: gridObj.element,
                query: gridObj.query,
                handler: test.filterHandler.bind(test), localizedStrings: {},
                column: column
            });
            excel.excelFilterBase.filterByColumn('ShipCountry', 'startswith', 'fra', 'and', false);
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

        describe('EJ2-6702 Script Error throws If we Check the match case and then click ok button', () => {
            let l10n: L10n;
            let grid: Grid;
            let filterElement: HTMLInputElement;
            let orderIDElement: HTMLInputElement;
            let numOptr: Object[] = [
                { value: 'equal', text: 'Equal' },
                { value: 'greaterThan', text: 'GreaterThan' },
                { value: 'greaterThanOrEqual', text: 'GreaterThanOrEqual' },
                { value: 'lessThan', text: 'LessThan' },
                { value: 'lessThanOrEqual', text: 'LessThanOrEqual' },
                { value: 'notEqual', text: 'NotEqual' }
            ];
            let customOperators: Object = {
                stringOperator: [
                    { value: 'startsWith', text: 'StartsWith' },
                    { value: 'endsWith', text: 'EndsWith' },
                    { value: 'contains', text: 'Contains' },
                    { value: 'equal', text: 'Equal' }, { value: 'notEqual', text: 'NotEqual' }],
                numberOperator: numOptr,
                dateOperator: numOptr,
                datetimeOperator: numOptr,
                booleanOperator: [
                    { value: 'equal', text: 'Equal' }, { value: 'notEqual', text: 'NotEqual' }
                ]
            };
            beforeAll((done: Function) => {
                grid = createGrid(
                    {
                        dataSource: filterData,
                        allowFiltering: true,
                        allowPaging: false,
                        filterSettings: {
                            type: 'Excel',
                            columns: [
                                {
                                    field: "ShipCountry",
                                    operator: "contains",
                                    predicate: "or",
                                    matchCase: true,
                                }
                            ]
                        },
                        columns: [
                            { field: 'CustomerID', type: 'string' },
                            { field: 'EmployeeID', type: 'number' },
                            { field: 'Freight', format: 'C2', type: 'number' },
                            { field: 'ShipCity' },
                            { field: 'Verified', type: 'boolean' },
                            { field: 'ShipName', allowFiltering: false },
                            { field: 'ShipCountry', type: 'string' },
                            { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' },
                            { field: 'ShipAddress', allowFiltering: true, visible: false }
                        ],
                    },
                    done
                );
            });

            it('EJ2-6702 Script Error throws If we Check the match case and then click ok button', () => {
                expect(grid.filterSettings.columns[0].value).toBe(undefined);
            });

            it('EJ2-7609-Excel Filter For Equal Date Is Not Working', (done: Function) => {
                let actionComplete = (args: any) => {
                    expect(grid.filterSettings.columns.length).toBe(1);
                    expect(grid.filterSettings.columns[0].value).toBe('7/8/1996');
                    done();
                };
                grid.actionComplete = actionComplete;
                let test: any = <any>grid.filterModule;
                grid.filterSettings.columns.pop();
                test.column = grid.getColumnByField('OrderDate');
                let excel: any = new test.type['Excel'](grid, grid.filterSettings, grid.serviceLocator, customOperators);
                let column: any = grid.getColumnByField('OrderDate');
                excel.excelFilterBase.updateModel({
                    type: 'date', field: 'OrderDate', displayName: 'OrderDate',
                    dataSource: grid.dataSource,
                    filteredColumns: grid.filterSettings.columns, target: grid.element,
                    query: grid.query,
                    handler: test.filterHandler.bind(test), localizedStrings: {},
                    column: column
                });
                excel.excelFilterBase.filterByColumn('OrderDate', 'equal', '7/8/1996', 'and', false);
            });

            it('EJ2-7255-Not equal filter on date column not working properly', (done: Function) => {
                let actionComplete = (args: any) => {
                    expect(grid.currentViewData[0]['OrderID']).not.toBe(10248);
                    done();
                };
                grid.actionComplete = actionComplete;
                let test: any = <any>grid.filterModule;
                grid.filterSettings.columns.pop();
                test.column = grid.getColumnByField('OrderDate');
                let excel: any = new test.type['Excel'](grid, grid.filterSettings, grid.serviceLocator, customOperators);
                let column: any = grid.getColumnByField('OrderDate');
                excel.excelFilterBase.updateModel({
                    type: 'date', field: 'OrderDate', displayName: 'OrderDate',
                    dataSource: grid.dataSource,
                    filteredColumns: grid.filterSettings.columns, target: grid.element,
                    query: grid.query,
                    handler: test.filterHandler.bind(test), localizedStrings: {},
                    column: column
                });
                excel.excelFilterBase.filterByColumn('OrderDate', 'notequal', grid.dataSource[0].OrderDate, 'and', false);
            });

            afterAll(() => {
                destroy(grid);
            });
    });

    describe('complex data filtering=> ', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        let preventDefault: Function = new Function();
        let value: Object = [
            {
                Id: "6b013b4e-fc62-4f08-a3cd-4f9619326812",
                IdDetails: "dafafasfaf",
                Name: "fsd",
                Details: {
                    Id: "2",
                    Somethings: "asdsafasf"
                }
            },

            {
                Id: "6b013b4e-fc62-4f08-a3cd-4f9619326814",
                IdDetails: "6b013b4e-fc62-4f08-a3cd-4f9619326814",
                Name: "dsd",
                Details: {
                    Id: "1",
                    Somethings: "dsadasd"
                }
            }
        ]
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: value,
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { ignoreAccent: true, mode: "Immediate", type: "Excel", immediateModeDelay: 2 },
                    columns: [
                        { field: 'Id', headerText: 'Id', isPrimaryKey: true },
                        { field: 'Name', headerText: 'Name' },
                        { field: 'Details.Somethings', headerText: 'Somethings' }
                    ],
                    actionComplete: actionComplete
                }, done);
        });

        it('EJ2-12661 - Filtering complex data field', (done: Function) => {
            actionComplete = (args?: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(0);
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('Details.Somethings', 'contains', 'z');
        });

        it('EJ2-12661 - Filtering complex data field', (done: Function) => {
            actionComplete = (args?: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('Details.Somethings', 'contains', 'f');
        });

        it('EJ2-12661 - Autocomplete checking for complex datas', () => {
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(
                gridObj.getColumnHeaderByField('Name').querySelector('.e-filtermenudiv')));
            gridObj.keyboardModule.keyAction({ action: 'Escape', preventDefault: preventDefault } as any);
            let returnedValue: string | object = performComplexDataOperation('Details.Somethings', gridObj.dataSource[0]);
            expect(returnedValue).toBe('asdsafasf');
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = preventDefault = value = null;
        });
    });

    describe('Customized the excel filter using filterTemplate => ', () => {
        let gridObj: Grid;
        let drpdwn: string = '<input id="dropdown" value="1" >';
        let uiInfo: any;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData,
                    allowFiltering: true,
                    allowPaging: false,
                    pageSettings: { currentPage: 1 },
                    filterSettings: {
                        type: 'Excel', columns: [
                            { field: 'EmployeeID', matchCase: false, operator: 'greaterthan', predicate: 'and', value: 0 },
                            { field: 'EmployeeID', matchCase: false, operator: 'lessthan', predicate: 'and', value: 8 }]
                    },
                    cssClass: 'report',
                    columns: [
                        { field: 'FirstName', visible: true },
                        {
                            field: 'EmployeeID', headerText: 'EmployeeID', filterTemplate: drpdwn
                        },
                        { field: 'BirthDate', headerText: 'Birth Date', type: 'date', width: 130 },
                        { field: 'HireDate', headerText: 'Hire Date', type: 'datetime', width: 130 }
                    ],
                }, done);
        });

        it('compile filterTemplate in menu filter', () => {
            (<any>gridObj).element.querySelector('.e-headercell:nth-child(2)').querySelector('.e-filtermenudiv').click();
            expect((<any>gridObj).columns[1].filterTemplateFn).not.toBe(undefined);
        });

        it('BeforeCustomFilterOpen event Check with filterTemplate', (done: Function) => {
            (gridObj.filterModule as any).filterModule.closeDialog();
            gridObj.beforeCustomFilterOpen = (args?: any): void => {
                expect(args.name).toBe('beforeCustomFilterOpen');
                gridObj.beforeCustomFilterOpen = null;
            };
            (gridObj.filterModule as any).filterModule.excelFilterBase.renderDialogue({ element: '' });
            (document.getElementsByClassName('e-btn')[0] as HTMLElement).click();
            done();
        });

        it('Custom Filter Open on date type', (done: Function) => {
            (<any>gridObj).element.querySelector('.e-headercell:nth-child(3)').querySelector('.e-filtermenudiv').click();
            (gridObj.filterModule as any).filterModule.closeDialog();
            gridObj.beforeCustomFilterOpen = (args?: any): void => {
                expect(args.name).toBe('beforeCustomFilterOpen');
                gridObj.beforeCustomFilterOpen = null;
            };
            (gridObj.filterModule as any).filterModule.excelFilterBase.renderDialogue({ element: '' });
            (document.getElementsByClassName('e-btn')[0] as HTMLElement).click();
            done();
        });

        it('Custom Filter Open on datetime type', (done: Function) => {
            (<any>gridObj).element.querySelector('.e-headercell:nth-child(4)').querySelector('.e-filtermenudiv').click();
            (gridObj.filterModule as any).filterModule.closeDialog();
            gridObj.beforeCustomFilterOpen = (args?: any): void => {
                expect(args.name).toBe('beforeCustomFilterOpen');
                gridObj.beforeCustomFilterOpen = null;
            };
            (gridObj.filterModule as any).filterModule.excelFilterBase.renderDialogue({ element: '' });
            (document.getElementsByClassName('e-btn')[0] as HTMLElement).click();
            done();
        });

        it('Custom Filter Open on filtered column', (done: Function) => {
            (gridObj.filterModule as any).filterModule.excelFilterBase.completeAction({result: ['a','b','b']});
            (<any>gridObj).element.querySelector('.e-headercell:nth-child(1)').querySelector('.e-filtermenudiv').click();
            (gridObj.filterModule as any).filterModule.closeDialog();
            gridObj.beforeCustomFilterOpen = (args?: any): void => {
                expect(args.name).toBe('beforeCustomFilterOpen');
                gridObj.beforeCustomFilterOpen = null;
            };
            (gridObj.filterModule as any).filterModule.excelFilterBase.renderDialogue({ element: '' });
            uiInfo = gridObj.getFilterUIInfo();
            (document.getElementsByClassName('e-btn')[1] as HTMLElement).click();
            done();
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
            gridObj = drpdwn = getActualProperties = getString = uiInfo = null;
        });
    });

    describe('Excel filter with Rtl mode', () => {
        let gridObj: Grid;
        let dataBound: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    enableRtl: true,
                    filterSettings: { type: 'Excel' },
                    columns: [{ field: 'OrderID', type: 'number', visible: true },
                    { field: 'CustomerID', type: 'string', filter: { type: 'Excel' } },
                    { field: 'Freight', format: 'C2', type: 'number' }
                    ],
                    actionComplete: actionComplete
                }, done);
        });

        it('open the filter dialog', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterAfterOpen') {
                    expect(1).toBe(1);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('filter multiple values', (done: Function) => {
            dataBound = (args?: any): void => {
                    expect(1).toBe(1);
                    gridObj.dataBound = null;
                    done();
            };
            gridObj.dataBound = dataBound;
            gridObj.filterByColumn('OrderID','equal',[10248, 10249]);
        });

        it('Custom Filter Open on filtered column', (done: Function) => {
            (gridObj.filterModule as any).filterModule.excelFilterBase.renderDialogue({ element: '' });
            (document.getElementsByClassName('e-btn')[0] as HTMLElement).click();
            done();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = dataBound = null;
        });
    });

    describe('EJ2-26559 enable case sensitivity check for Excel filter', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let excelFilter: Element;
        let actionComplete: () => void;

        let excelFilterObj: Function = (obj: PredicateModel, field?: string,
            operator?: string, value?: string, predicate?: string, matchCase?: boolean): boolean => {
            let isEqual: boolean = true;
            if (field) {
                isEqual = isEqual && obj.field === field;
            }
            if (operator) {
                isEqual = isEqual && obj.operator === operator;
            }
            if (value) {
                isEqual = isEqual && obj.value === value;
            }
            if (matchCase) {
                isEqual = isEqual && obj.matchCase === matchCase;
            }
            return isEqual;
        };
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: false,
                    filterSettings: { type: 'Excel', showFilterBarStatus: true },
                    columns: [{ field: 'OrderID', type: 'number', visible: true },
                    { field: 'CustomerID', type: 'string', filter: {type: 'Excel'} },
                    { field: 'Freight', format: 'C2', type: 'number' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('Filter OrderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterAfterOpen'){
                    excelFilter = gridObj.element.querySelector('.e-excelfilter');
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('Filter OrderID testing for matchcase default value true', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(2);
                expect(excelFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'equal', 10248, 'or', true)).toBeFalsy();
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(69);                
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            (excelFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();
            (excelFilter.querySelectorAll('.e-checkbox-wrapper')[2] as any).click(); 
            excelFilter.querySelectorAll('button')[0].click();
        });

        it('Filter CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterAfterOpen'){
                    excelFilter = gridObj.element.querySelector('.e-excelfilter');
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('Filter CustomerID testing for matchcase default value true', (done: Function) => {
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(4);
                expect(excelFilterObj(gridObj.filterSettings.columns[2], 'CustomerID', 'notequal', 'ANATR', 'and', true)).toBeFalsy();
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(66);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                     
            (excelFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();
            (excelFilter.querySelectorAll('.e-checkbox-wrapper')[2] as any).click();
            excelFilter.querySelectorAll('button')[0].click();
        });

        it('Filter Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterAfterOpen'){
                    excelFilter = gridObj.element.querySelector('.e-excelfilter');
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        it('Filter Freight testing for matchcase default value true', (done: Function) => {    
            actionComplete = (args?: any): void => {       
                expect(gridObj.filterSettings.columns.length).toBe(6);
                expect(excelFilterObj(gridObj.filterSettings.columns[4], 'Freight', 'notequal', 0.12, 'and', true)).toBeFalsy();        
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(64);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                     
            (excelFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();           
            (excelFilter.querySelectorAll('.e-checkbox-wrapper')[2] as any).click(); 
            excelFilter.querySelectorAll('button')[0].click();
        });
        
        afterAll(() => {
            destroy(gridObj);
            gridObj = excelFilter = actionBegin = actionComplete = null;
        });
    });
    describe('Excel filter test case => ', () => {
            let gridObj: Grid;
            let drpdwn: string ='<input id="dropdown" value="1" >'; 
            let actionComplete: (args: any) => void;
            beforeAll((done: Function) => {
                gridObj = createGrid(
                    {
                        dataSource: filterData,
                        allowFiltering: true,
                        allowPaging: false,
                        pageSettings: { currentPage: 1 },
                        filterSettings: { type: 'Excel' },
                        columns: [
                            { field: 'OrderID', visible: true,filter:{operator:"equal" } },
                            { field: 'CustomerID', headerText: 'CustomerID', filter:{operator:"contains" }},
                            { field:'Fright',headerText:'Frieght', width:130 , filter:{operator:"equal" }},
                            { field: 'ShipCountry',  headerText: 'Ship Country', width: 120,filter:{operator:"startswith" } }
                        ],
                        actionComplete : actionComplete
                    }, done);
                });

                it('action complete', (done: Function) => {
                        let flag: boolean = true;
                        actionComplete = (args?: any): void => {
                            if (flag) {
                                flag = false;
                                (gridObj.filterModule as any).filterModule.excelFilterBase.renderFilterUI((gridObj.columns[1] as any).field,args.filterModel.dlg);
                                done();
                            }
                            done();
                        };
                        gridObj.actionComplete = actionComplete;
                        (gridObj.element.querySelectorAll(".e-filtermenudiv")[1] as HTMLElement).click();                
                    });

                it('comparing operator with default value', (done: Function) => {
                    expect((gridObj.element.querySelector('.e-xlfl-optrdiv').firstChild.firstChild as any).value).toBe((gridObj.columns[1] as any).filter.operator);
                    done();
                });

            afterAll(() => {
                destroy(gridObj);
                gridObj = drpdwn = getActualProperties = getString = null;
                actionComplete = null;
            });
        });

        describe('Excel filter test case => ', () => {
            let gridObj: Grid;
            beforeAll((done: Function) => {
                gridObj = createGrid(
                    {
                        dataSource: filterData,
                        allowFiltering: true,
                        allowPaging: false,
                        pageSettings: { currentPage: 1 },
                        filterSettings: { type: 'Excel' },
                        columns: [
                            { field: 'OrderID', visible: true,filter:{operator:"equal" } },
                            { field: 'CustomerID', headerText: 'CustomerID', filter:{operator:"contains" }},
                            { field:'Fright',headerText:'Frieght', width:130 , filter:{operator:"equal" }},
                            { field: 'ShipCountry',  headerText: 'Ship Country', width: 120,filter:{operator:"startswith" } }
                        ],
                    }, done);
                });
                it('BeforeCustomFilterOpen event Check', (done: Function) => {
                    let fltrElement: Element =  document.getElementsByClassName('e-filtermenudiv')[0];
                    (gridObj.filterModule as any).filterDialogOpen(gridObj.getColumnByIndex(0),fltrElement,100,100);
                    (gridObj.filterModule as any).filterModule.closeDialog();
                    gridObj.beforeCustomFilterOpen = (args?: any): void => {
                        expect(args.name).toBe('beforeCustomFilterOpen');
                        gridObj.beforeCustomFilterOpen = null;
                    };
                    (gridObj.filterModule as any).filterModule.excelFilterBase.renderDialogue({element:''});   
                    (document.getElementsByClassName('e-btn')[0] as HTMLElement).click();
                    done();
                });
            afterAll(() => {
                destroy(gridObj);
                gridObj = null;
            });
        });

        describe('custom filter operator testing => ', () => {
            let gridObj: Grid;
            let drpdwn: string ='<input id="dropdown" value="1" >'; 
            let actionComplete: (args: any) => void;
            beforeAll((done: Function) => {
                gridObj = createGrid(
                    {
                        dataSource: filterData,
                        allowFiltering: true,
                        allowPaging: false,
                        pageSettings: { currentPage: 1 },
                        filterSettings: { type: 'Excel' },
                        columns: [
                            { field: 'OrderID', visible: true,width: 120 },
                            { field: 'CustomerID', headerText: 'CustomerID', width:120},
                            { field:'Fright',headerText:'Frieght', width:130 , filter:{operator:"equal" }},
                            { field: 'ShipCountry',  headerText: 'Ship Country', width: 120,filter:{operator:"startswith" } }
                        ],
                        actionComplete : actionComplete
                    }, done);
                });

                it('action complete', (done: Function) => {
                        let flag: boolean = true;
                        actionComplete = (args?: any): void => {
                            if (flag) {
                                flag = false;
                                (gridObj.filterModule as any).filterModule.excelFilterBase.renderFilterUI((gridObj.columns[1] as any).field,args.filterModel.dlg);
                                done();
                            }
                            done();
                        };
                        gridObj.actionComplete = actionComplete;
                        (gridObj.element.querySelectorAll(".e-filtermenudiv")[1] as HTMLElement).click();                
                    });

                it('comparing operator with default value', (done: Function) => {
                    expect((gridObj.element.querySelector('.e-xlfl-optrdiv').firstChild.firstChild as any).value).toBe('startswith');
                    done();
                });

            afterAll(() => {
                destroy(gridObj);
                gridObj = drpdwn = getActualProperties = getString = null;
                actionComplete = null;
            });
        });
        describe('EJ2-35295 custom filter operator testing => ', () => {
            let gridObj: Grid;
            let excelFilter: Element;
            let actionComplete: (args: any) => void;
            beforeAll((done: Function) => {
                gridObj = createGrid(
                    {
                        dataSource: filterData,
                        allowFiltering: true,
                        allowPaging: false,
                        pageSettings: { currentPage: 1 },
                        filterSettings: { type: 'Excel' },
                        columns: [
                            { field: 'OrderID', visible: true,width: 120 },
                            { field: 'CustomerID', headerText: 'CustomerID', width:120},
                            { field:'Fright',headerText:'Frieght', width:130 , filter:{operator:"equal" }},
                            { field: 'ShipCountry',  headerText: 'Ship Country', width: 120,filter:{operator:"startswith" } }
                        ],
                        actionComplete : actionComplete
                    }, done);
                });

                it('Filter OrderID dialog open testing', (done: Function) => {
                    actionComplete = (args?: any): void => {
                        if(args.requestType === 'filterAfterOpen'){
                            excelFilter = gridObj.element.querySelector('.e-excelfilter');
                        gridObj.actionComplete =null;
                        done();
                        }
                    };
                    gridObj.actionComplete = actionComplete;
                    (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
                });

                it('Filtering with null operator testing', (done: Function) => {    
                    actionComplete = (args?: any): void => {               
                        expect(gridObj.filterSettings.columns.length).toBe(1);
                        gridObj.actionComplete =null;
                        done();
                    };
                    gridObj.actionComplete = actionComplete;
                    (gridObj.filterModule as any).filterModule.excelFilterBase.filterByColumn("OrderID","equal",10248,'or',true,true,null,10250);
                });

                it('Filtering with equal operator testing', (done: Function) => {    
                    actionComplete = (args?: any): void => {               
                        expect(gridObj.filterSettings.columns.length).toBe(2);
                        gridObj.actionComplete =null;
                        done();
                    };
                    gridObj.actionComplete = actionComplete;
                    (gridObj.filterModule as any).filterModule.excelFilterBase.filterByColumn("OrderID","equal",10248,'or',true,true,'equal',10250);
                });

            afterAll(() => {
                destroy(gridObj);
                gridObj = excelFilter = getActualProperties = getString = null;
                actionComplete = null;
            });
        });

        describe('EJ2-36547 => Scrolling while filter => ', () => {
            let gridObj: Grid;
            let actionComplete: (args: any) => void;
            beforeAll((done: Function) => {
                gridObj = createGrid(
                    {
                        dataSource: filterData,
                        allowFiltering: true,
                        allowPaging: false,
                        width:600,
                        pageSettings: { currentPage: 1 },
                        filterSettings: { type: 'Excel' },
                        columns: [
                            { field: 'OrderID', visible: true,width: 120 },
                            { field: 'CustomerID', headerText: 'Customer ID', width:120},
                            { field:'Freight',headerText:'Freight', width:130 },
                            { field:'OrderDate',headerText:'Order Date', width:130 },
                            { field: 'ShipCountry',  headerText: 'Ship Country', width: 120 }
                        ],
                        actionComplete : actionComplete
                    }, done);
                });

                it('checking current focused element', (done: Function) => {
                        let flag: boolean = true;
                        actionComplete = (args?: any): void => {
                            if (flag) {
                                flag = false;
                                expect(parseInt(document.activeElement.getAttribute('aria-colindex'), 10) - 1).toBe(4);
                                done();
                            }
                            done();
                        };
                        gridObj.actionComplete = actionComplete;
                        (gridObj.element.querySelectorAll(".e-filtermenudiv")[4] as HTMLElement).click();                
                    });

            afterAll(() => {
                destroy(gridObj);
                gridObj = getActualProperties = getString = null;
                actionComplete = null;
            });
        });
        describe('EJ2-37174 => default match case is not working with Excel filter => ', () => {
            let gridObj: Grid;
            beforeAll((done: Function) => {
                gridObj = createGrid(
                    {
                        dataSource: filterData,
                        allowFiltering: true,
                        allowPaging: true,
                        allowGrouping: true,
                        pageSettings: { currentPage: 1 },
                        filterSettings: {
                            type: 'Excel', columns: [
                                { field: 'ShipCountry', operator: 'startswith', value: 'ger' }]
                        },
                        columns: [
                            { field: 'OrderID', type: 'number', visible: true },
                            { field: 'EmployeeID', type: 'number' },
                            { field: 'Freight', format: 'C2', type: 'number' },
                            { field: 'ShipCountry' },
                            { field: 'OrderDate', format: 'yMd', type: 'date' }],
                    }, done);
            });
            // test initial filtering scenario
            it('testing initial filter', () => {
                expect(gridObj.currentViewData.length).not.toBe(0);
            });

            afterAll(() => {
                destroy(gridObj);
            });
        });
    });

describe('Sorting feature testing in excel filter ', () => {
    let gridObj: Grid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData,
                allowFiltering: true,
                allowPaging: true,
                allowSorting: true,
                allowGrouping: true,
                pageSettings: { currentPage: 1 },
                filterSettings: { type: 'Excel' },
                columns: [
                    { field: 'OrderID', type: 'number' },
                    { field: 'EmployeeID', type: 'number' },
                    { field: 'Freight', format: 'C2', type: 'number' },
                    { field: 'ShipCountry' },
                    { field: 'OrderDate', format: 'yMd', type: 'date' }],
            }, done);
    });

    it('testing the list of sort in excel popup', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'filterAfterOpen') {
                expect(gridObj.element.querySelectorAll('.e-excel-ascending').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-excel-descending').length).toBe(1);
                (gridObj.filterModule as any).filterModule.closeDialog();
                gridObj.actionComplete = null;
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        (gridObj.element.querySelector('.e-headercell:nth-child(1)').querySelector('.e-filtermenudiv') as HTMLElement).click();
    });

    it('open excel filter popup', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'filterAfterOpen') {
                gridObj.actionComplete = null;
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        (gridObj.element.querySelector('.e-headercell:nth-child(1)').querySelector('.e-filtermenudiv') as HTMLElement).click();
    });

    it('Checking the sorting action in excel popup', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'sorting') {
                gridObj.actionComplete = null;
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        (gridObj.element.querySelectorAll('.e-excel-ascending')[0] as HTMLElement).click();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = actionComplete = null;
    });
});

describe('EJ2-47491- Grid destroy with document click event ', () => {
    let gridObj1: Grid;
    let gridObj2: Grid;
    beforeAll((done: Function) => {
        gridObj1 = createGrid(
            {
                dataSource: filterData,
                allowFiltering: true,
                allowPaging: true,
                allowSorting: true,
                allowGrouping: true,
                pageSettings: { currentPage: 1 },
                filterSettings: { type: 'Excel' },
                columns: [
                    { field: 'OrderID', type: 'number' },
                    { field: 'EmployeeID', type: 'number' },
                    { field: 'Freight', format: 'C2', type: 'number' },
                    { field: 'ShipCountry' },
                    { field: 'OrderDate', format: 'yMd', type: 'date' }],
            }, done);

            gridObj2 = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    allowSorting: true,
                    allowGrouping: true,
                    pageSettings: { currentPage: 1 },
                    filterSettings: { type: 'Excel' },
                    columns: [
                        { field: 'OrderID', type: 'number' },
                        { field: 'EmployeeID', type: 'number' }],
                }, done);
    });

    it('testing the destroy funtionality', (done: Function) => {
        (gridObj1.element.querySelectorAll(".e-filtermenudiv")[0] as HTMLElement).click();
        gridObj2.destroy();
        document.onclick = () => {
            expect(gridObj1.element.querySelectorAll('.e-excelfilter').length).toBe(0);
            document.onclick = null;
            done();
        };
        document.body.click();
    });

    afterAll(() => {
        destroy(gridObj1);
        gridObj1 =  null;
    });
});

describe('EJ2-51101 Custom excel filter Radio button alignment issue => ', () => {
    let gridObj: Grid; 
    let actionComplete: (args: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData,
                allowFiltering: true,
                allowPaging: false,
                pageSettings: { currentPage: 1 },
                filterSettings: { type: 'Excel' },
                columns: [
                    { field: 'OrderID', width: 120 },
                    { field: 'CustomerID', headerText: 'CustomerID', width:120},
                    { field:'Fright',headerText:'Frieght', width:130 },
                    { field: 'ShipCountry',  headerText: 'Ship Country', width: 120}
                ],
                actionComplete : actionComplete
            }, done);
        });

        it('action complete', (done: Function) => {
                let flag: boolean = true;
                actionComplete = (args?: any): void => {
                    if (flag) {
                        flag = false;
                        (gridObj.filterModule as any).filterModule.excelFilterBase.renderFilterUI((gridObj.columns[1] as any).field,args.filterModel.dlg);
                        done();
                    }
                };
                gridObj.actionComplete = actionComplete;
                (gridObj.element.querySelectorAll(".e-filtermenudiv")[1] as HTMLElement).click();                
            });

        it('checking the class for label element', () => {
            expect(document.querySelector('.e-xlfl-radio').querySelector('label').classList.contains("e-xlfl-radio-and")).toBeTruthy();
            expect(document.querySelector('.e-xlfl-radio').querySelectorAll('label')[1].classList.contains("e-xlfl-radio-or")).toBeTruthy();
        });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
        actionComplete = null;
    });
});


describe('EJ2-52268 Filtering array of values on date column through filterByColumn method is not working => ', () => {
    let gridObj: Grid; 
    let actionComplete: (args: any) => void;
    let data: object[] = [ { OrderID: 10248, CustomerID: 'VINET', OrderDate: new Date('08/16/2021') },
                            { OrderID: 10249, CustomerID: 'TOMSP', OrderDate: new Date('08/18/2021') },
                            { OrderID: 10250, CustomerID: 'HANAR', OrderDate: new Date('08/19/2021') },
                            { OrderID: 10249, CustomerID: 'TOMSP', OrderDate: null},
                            { OrderID: 10251, CustomerID: 'VICTE', OrderDate: new Date('08/22/2021') }];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowFiltering: true,
                filterSettings: { type: 'Excel' },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 140,  textAlign: 'Right' },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 140 },
                    { field: 'OrderDate', headerText: 'Order Date', width: 150, format:'yyyy/MM/dd', textAlign:'Right' },
                ],
                actionComplete : actionComplete
            }, done);
        });    
        it('checking the filterByColumn in mutiple value', (done: Function) => {
            actionComplete = (args?: any): void => {
                actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('OrderDate', 'equal', [new Date('08/16/2021'), new Date('08/18/2021')]);
        });

        it('EJ2-57953 Filtering date column with null value in array ', (done: Function) => {
            actionComplete = (args?: any): void => {
                actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('OrderDate', 'equal', [new Date('08/16/2021'), null]);
        });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
        actionComplete = data = null;
    });
});

describe('EJ2-52360 => In lazyload grouping enabled grid while hiding columns in column chooser throws script error => ', () => {
    let gridObj: Grid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData,
                allowGrouping: true,
                allowFiltering: true,
                groupSettings: { enableLazyLoading: true },
                filterSettings: { type: 'Excel' },
                columns: [
                    { field: 'OrderID', type: 'number', visible: true },
                    { field: 'EmployeeID', type: 'number' },
                    { field: 'Freight', format: 'C2', type: 'number' },
                    { field: 'ShipCountry' },
                    { field: 'OrderDate', format: 'yMd', type: 'date' }],
            }, done);
    });
    
    it('checking the rowsObject length', (done: Function) => {
        gridObj.actionComplete = actionComplete = (args?: any): void => {
            if (args.requestType === "filterchoicerequest") {
                expect(gridObj.getRowsObject().length).not.toBe(0);
                done();
            }
        }
        gridObj.actionComplete = actionComplete;
        (gridObj.element.getElementsByClassName('e-filtermenudiv e-icons e-icon-filter')[1] as any).click();
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Excel Filter on demand load and selection maintain for filter', () => {
    let gridObj: Grid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData.slice(0, 23),
                allowFiltering: true,
                filterSettings: { type: 'Excel', enableInfiniteScrolling: true, itemsCount: 5 },
                height: 500,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    { field: 'EmployeeID', headerText: 'EmployeeID', width: 150, },
                ],
                actionComplete: actionComplete
            }, done);
    });

    it('OrderID filter dialog open testing', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'filterAfterOpen') {
                expect(gridObj.element.querySelector('.e-checkboxlist').children.length).toBe(gridObj.filterSettings.itemsCount * 3);
                actionComplete = null;
                done();
            } else if (args.requestType === 'filterchoicerequest') {
                args.filterModel.infiniteInitialLoad = false;
            }
        };
        gridObj.actionComplete = actionComplete;
        (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
    });

    it('filter for display no records', (done: Function) => {
        actionComplete = (args?: any): void => {
            expect(gridObj.filterSettings.columns.length).toBe(2);
            gridObj.filterModule.filterModule.closeDialog();
            gridObj.actionComplete = null;
            done();
        };
        gridObj.actionComplete = actionComplete;
        (gridObj.filterModule as any).filterModule.excelFilterBase.filterByColumn("OrderID", "equal", 10248, 'and', true, true, 'notequal', 10248);
    });

    it('OrderID filter dialog open testing - 1', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'filterAfterOpen') {
                expect(gridObj.element.querySelector('.e-checkboxlist').children.length).toBe(gridObj.filterSettings.itemsCount * 3);
                expect(gridObj.element.querySelector('.e-checkboxlist').querySelectorAll('.e-check').length).toBe(0);
                expect((<any>gridObj.element.querySelector('.e-checkboxlist').parentElement.previousSibling).querySelectorAll('.e-uncheck').length).toBe(1);
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteManualSelectMaintainPred.length).toBe(0);
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteUnloadParentExistPred.length).toBe(0);
                actionComplete = null;
                done();
            } else if (args.requestType === 'filterchoicerequest') {
                args.filterModel.infiniteInitialLoad = false;
            }
        };
        gridObj.actionComplete = actionComplete;
        (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
    });

    it('OrderID filter dialog open testing and down scroll', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'filterAfterOpen') {
                expect(gridObj.element.querySelector('.e-checkboxlist').children.length).toBe(gridObj.filterSettings.itemsCount * 3);
                expect(gridObj.element.querySelector('.e-checkboxlist').querySelectorAll('.e-check').length).toBe(0);
                expect((<any>gridObj.element.querySelector('.e-checkboxlist').parentElement.previousSibling).querySelectorAll('.e-uncheck').length).toBe(1);
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteManualSelectMaintainPred.length).toBe(0);
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteUnloadParentExistPred.length).toBe(0);
                // gridObj.filterModule.filterModule.closeDialog();
                actionComplete = null;
                done();
            } else if (args.requestType === 'filterchoicerequest') {
                args.filterModel.infiniteInitialLoad = false;
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.element.querySelector('.e-checkboxlist').scrollTop = 500;
        (<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteScrollHandler();
        setTimeout(done, 1000);
    });

    it('filter in between', (done: Function) => {
        actionComplete = (args?: any): void => {
            expect(gridObj.filterSettings.columns.length).toBe(2);
            gridObj.filterModule.filterModule.closeDialog();
            gridObj.actionComplete = null;
            done();
        };
        gridObj.actionComplete = actionComplete;
        (gridObj.filterModule as any).filterModule.excelFilterBase.filterByColumn("OrderID", "greaterthanorequal", 10263, 'and', true, true, 'lessthanorequal', 10265);
    });

    it('OrderID filter dialog open testing - 2', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'filterAfterOpen') {
                expect(gridObj.element.querySelector('.e-checkboxlist').children.length).toBe(gridObj.filterSettings.itemsCount * 3);
                expect(gridObj.element.querySelector('.e-checkboxlist').querySelectorAll('.e-check').length).toBe(0);
                expect((<any>gridObj.element.querySelector('.e-checkboxlist').parentElement.previousSibling).querySelectorAll('.e-stop').length).toBe(1);
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteManualSelectMaintainPred.length).toBe(0);
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteUnloadParentExistPred.length).toBe(2);
                actionComplete = null;
                done();
            } else if (args.requestType === 'filterchoicerequest') {
                args.filterModel.infiniteInitialLoad = false;
            }
        };
        gridObj.actionComplete = actionComplete;
        (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        setTimeout(done, 1000);
    });

    it('OrderID filter dialog open testing and down scroll - 1', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'filterAfterOpen') {
                expect(gridObj.element.querySelector('.e-checkboxlist').children.length).toBe(gridObj.filterSettings.itemsCount * 3);
                expect(gridObj.element.querySelector('.e-checkboxlist').querySelectorAll('.e-check').length).toBe(3);
                expect((<any>gridObj.element.querySelector('.e-checkboxlist').parentElement.previousSibling).querySelectorAll('.e-stop').length).toBe(1);
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteManualSelectMaintainPred.length).toBe(0);
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteUnloadParentExistPred.length).toBe(2);
                actionComplete = null;
                done();
            } else if (args.requestType === 'filterchoicerequest') {
                args.filterModel.infiniteInitialLoad = false;
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.element.querySelector('.e-checkboxlist').scrollTop = 500;
        (<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteScrollHandler();
        setTimeout(done, 1000);
    });

    it('checkbox selection', () => {
        let checkBoxList: Element = gridObj.element.querySelector('.e-checkboxlist');
        let checkBox: Element = checkBoxList.children[10].querySelector('input');
        (<any>gridObj.filterModule).filterModule.excelFilterBase.clickHandler({ target: checkBox });
        expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteManualSelectMaintainPred.length).toBe(1);
        checkBox = checkBoxList.children[11].querySelector('input');
        (<any>gridObj.filterModule).filterModule.excelFilterBase.clickHandler({ target: checkBox });
        expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteManualSelectMaintainPred.length).toBe(2);
        checkBox = checkBoxList.children[12].querySelector('input');
        (<any>gridObj.filterModule).filterModule.excelFilterBase.clickHandler({ target: checkBox });
        expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteManualSelectMaintainPred.length).toBe(0);
        expect((<any>gridObj.element.querySelector('.e-checkboxlist').parentElement.previousSibling).querySelectorAll('.e-uncheck').length).toBe(1);
    });

    it('filter greaterthan', (done: Function) => {
        actionComplete = (args?: any): void => {
            expect(gridObj.filterSettings.columns.length).toBe(1);
            gridObj.filterModule.filterModule.closeDialog();
            gridObj.actionComplete = null;
            done();
        };
        gridObj.actionComplete = actionComplete;
        (gridObj.filterModule as any).filterModule.excelFilterBase.filterByColumn("OrderID", "greaterthan", 10247, 'or', true, true);
    });

    it('OrderID filter dialog open testing - 3', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'filterAfterOpen') {
                expect(gridObj.element.querySelector('.e-checkboxlist').children.length).toBe(gridObj.filterSettings.itemsCount * 3);
                expect(gridObj.element.querySelector('.e-checkboxlist').querySelectorAll('.e-check').length).toBe(gridObj.filterSettings.itemsCount * 3);
                expect((<any>gridObj.element.querySelector('.e-checkboxlist').parentElement.previousSibling).querySelectorAll('.e-check').length).toBe(1);
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteManualSelectMaintainPred.length).toBe(0);
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteUnloadParentExistPred.length).toBe(0);
                actionComplete = null;
                done();
            } else if (args.requestType === 'filterchoicerequest') {
                args.filterModel.infiniteInitialLoad = false;
            }
        };
        gridObj.actionComplete = actionComplete;
        (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        setTimeout(done, 1000);
    });

    it('filter greaterthan not loaded data', (done: Function) => {
        actionComplete = (args?: any): void => {
            expect(gridObj.filterSettings.columns.length).toBe(1);
            gridObj.filterModule.filterModule.closeDialog();
            gridObj.actionComplete = null;
            done();
        };
        gridObj.actionComplete = actionComplete;
        (gridObj.filterModule as any).filterModule.excelFilterBase.filterByColumn("OrderID", "greaterthan", 10262, 'or', true, true);
    });

    it('OrderID filter dialog open testing - 4', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'filterAfterOpen') {
                expect(gridObj.element.querySelector('.e-checkboxlist').children.length).toBe(gridObj.filterSettings.itemsCount * 3);
                expect(gridObj.element.querySelector('.e-checkboxlist').querySelectorAll('.e-check').length).toBe(0);
                expect((<any>gridObj.element.querySelector('.e-checkboxlist').parentElement.previousSibling).querySelectorAll('.e-stop').length).toBe(1);
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteManualSelectMaintainPred.length).toBe(0);
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteUnloadParentExistPred.length).toBe(1);
                actionComplete = null;
                done();
            } else if (args.requestType === 'filterchoicerequest') {
                args.filterModel.infiniteInitialLoad = false;
            }
        };
        gridObj.actionComplete = actionComplete;
        (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        setTimeout(done, 1000);
    });

    it('checkbox selection all data one by one', () => {
        let checkBoxList: Element = gridObj.element.querySelector('.e-checkboxlist');
        for (let i: number = 0; i < 15; i++) {
            let checkBox: Element = checkBoxList.children[i].querySelector('input');
            (<any>gridObj.filterModule).filterModule.excelFilterBase.clickHandler({ target: checkBox });
            if (i === 14) {
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteManualSelectMaintainPred.length).toBe(0);
            } else {
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteManualSelectMaintainPred.length).toBe(i + 1);
            }
        }
    });

    it('OrderID filter dialog open testing and down scroll - 2', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'filterAfterOpen') {
                expect(gridObj.element.querySelector('.e-checkboxlist').children.length).toBe(gridObj.filterSettings.itemsCount * 3);
                expect(gridObj.element.querySelector('.e-checkboxlist').querySelectorAll('.e-check').length).toBe(gridObj.filterSettings.itemsCount * 3);
                // expect((<any>gridObj.element.querySelector('.e-checkboxlist').parentElement.previousSibling).querySelectorAll('.e-stop').length).toBe(1);
                // expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteManualSelectMaintainPred.length).toBe(gridObj.filterSettings.itemsCount * 3);
                expect((<any>gridObj.element.querySelector('.e-checkboxlist').parentElement.previousSibling).querySelectorAll('.e-check').length).toBe(1);
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteManualSelectMaintainPred.length).toBe(0);
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteUnloadParentExistPred.length).toBe(0);
                actionComplete = null;
                done();
            } else if (args.requestType === 'filterchoicerequest') {
                args.filterModel.infiniteInitialLoad = false;
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.element.querySelector('.e-checkboxlist').scrollTop = 500;
        (<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteScrollHandler();
        setTimeout(done, 1000);
    });

    it('filter lessthan', (done: Function) => {
        actionComplete = (args?: any): void => {
            expect(gridObj.filterSettings.columns.length).toBe(1);
            gridObj.filterModule.filterModule.closeDialog();
            gridObj.actionComplete = null;
            done();
        };
        gridObj.actionComplete = actionComplete;
        (gridObj.filterModule as any).filterModule.excelFilterBase.filterByColumn("OrderID", "lessthan", 10271, 'or', true, true);
    });

    it('OrderID filter dialog open testing - 5', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'filterAfterOpen') {
                expect(gridObj.element.querySelector('.e-checkboxlist').children.length).toBe(gridObj.filterSettings.itemsCount * 3);
                expect(gridObj.element.querySelector('.e-checkboxlist').querySelectorAll('.e-check').length).toBe(gridObj.filterSettings.itemsCount * 3);
                expect((<any>gridObj.element.querySelector('.e-checkboxlist').parentElement.previousSibling).querySelectorAll('.e-check').length).toBe(1);
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteManualSelectMaintainPred.length).toBe(0);
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteUnloadParentExistPred.length).toBe(0);
                actionComplete = null;
                done();
            } else if (args.requestType === 'filterchoicerequest') {
                args.filterModel.infiniteInitialLoad = false;
            }
        };
        gridObj.actionComplete = actionComplete;
        (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        setTimeout(done, 1000);
    });

    it('filter lessthan not loaded data', (done: Function) => {
        actionComplete = (args?: any): void => {
            expect(gridObj.filterSettings.columns.length).toBe(1);
            gridObj.filterModule.filterModule.closeDialog();
            gridObj.actionComplete = null;
            done();
        };
        gridObj.actionComplete = actionComplete;
        (gridObj.filterModule as any).filterModule.excelFilterBase.filterByColumn("OrderID", "lessthan", 10263, 'or', true, true);
    });

    it('OrderID filter dialog open testing - 6', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'filterAfterOpen') {
                expect(gridObj.element.querySelector('.e-checkboxlist').children.length).toBe(gridObj.filterSettings.itemsCount * 3);
                expect(gridObj.element.querySelector('.e-checkboxlist').querySelectorAll('.e-check').length).toBe(gridObj.filterSettings.itemsCount * 3);
                expect((<any>gridObj.element.querySelector('.e-checkboxlist').parentElement.previousSibling).querySelectorAll('.e-stop').length).toBe(1);
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteManualSelectMaintainPred.length).toBe(0);
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteUnloadParentExistPred.length).toBe(1);
                actionComplete = null;
                done();
            } else if (args.requestType === 'filterchoicerequest') {
                args.filterModel.infiniteInitialLoad = false;
            }
        };
        gridObj.actionComplete = actionComplete;
        (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        setTimeout(done, 1000);
    });

    it('checkbox unselect all loaded data one by one', () => {
        let checkBoxList: Element = gridObj.element.querySelector('.e-checkboxlist');
        for (let i: number = 0; i < 15; i++) {
            let checkBox: Element = checkBoxList.children[i].querySelector('input');
            (<any>gridObj.filterModule).filterModule.excelFilterBase.clickHandler({ target: checkBox });
            if (i === 14) {
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteManualSelectMaintainPred.length).toBe(0);
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteUnloadParentExistPred.length).toBe(0);
            } else {
                expect((<any>gridObj.filterModule).filterModule.excelFilterBase.infiniteManualSelectMaintainPred.length).toBe(i + 1);
            }
        }
    });

    afterAll(() => {
        destroy(gridObj);
    });
});



describe('code coverage for excel filter file - 1 => ', () => {
    let gridObj: Grid;
    let actionComplete: () => void;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData,
                allowFiltering: true,
                filterSettings: { type: 'Excel' },
                height: 500,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    { field: 'EmployeeID', headerText: 'EmployeeID', width: 150, },
                ],
                actionComplete: actionComplete
            }, done);
    });
    
    it('excel filter open code coverage', (done: Function) => {
        gridObj.actionComplete = actionComplete = (args?: any): void => {
            if (args.requestType === "filterchoicerequest") {
                done();
            }
        }
        gridObj.actionComplete = actionComplete;
        (gridObj.element.getElementsByClassName('e-filtermenudiv')[1] as any).click();
    });

    it('excel filter file method and fucntion code coverage', () => {
        (gridObj.filterModule as any).filterModule.excelFilterBase.selectHandler({});
        (gridObj.filterModule as any).filterModule.excelFilterBase.excelSetFocus();
        (gridObj.filterModule as any).filterModule.excelFilterBase.keyDown({});
        (gridObj.filterModule as any).filterModule.excelFilterBase.focusNextOrPrevElement({}, [], []);
        (gridObj.filterModule as any).filterModule.excelFilterBase.keyDown({ key: 'ArrowDown', preventDefault: preventDefault });
        (gridObj.filterModule as any).filterModule.excelFilterBase.cmenu.appendChild(gridObj.createElement('div', { className: 'e-excel' }));
        (gridObj.filterModule as any).filterModule.excelFilterBase.excelSetFocus(gridObj.element, 'e-excel');
        (gridObj.filterModule as any).filterModule.excelFilterBase.options.isResponsiveFilter = true;
        (gridObj.filterModule as any).filterModule.excelFilterBase.hoverHandler( { type:'mouseover' });
        (gridObj.filterModule as any).filterModule.excelFilterBase.options.isResponsiveFilter = false;
        (gridObj.filterModule as any).filterModule.excelFilterBase.keyUp({});
        (gridObj.filterModule as any).filterModule.excelFilterBase.keyUp({ shiftKey: true, key:'Tab', target: document.querySelector('.e-chk-hidden') });
        (gridObj.filterModule as any).filterModule.excelFilterBase.keyUp({ shiftKey: true, key:'Tab', target: document.querySelector('.e-menu-item') });
        (gridObj.filterModule as any).filterModule.excelFilterBase.keyUp({ shiftKey: true, key:'ArrowDown', target: document.querySelector('.e-menu-item'), preventDefault: preventDefault });
        (gridObj.filterModule as any).filterModule.excelFilterBase.keyUp({ shiftKey: true, code:'ArrowRight', target:  document.querySelector('.e-submenu.e-menu-item'), preventDefault: preventDefault });
        (gridObj.filterModule as any).filterModule.excelFilterBase.contextKeyDownHandler({});
        (gridObj.filterModule as any).filterModule.excelFilterBase.contextKeyDownHandler({ shiftKey: true, key:'Tab', preventDefault :preventDefault });
        (gridObj.filterModule as any).filterModule.excelFilterBase.contextKeyDownHandler({ shiftKey: true, key:'Escape', preventDefault :preventDefault });
        (gridObj.filterModule as any).filterModule.excelFilterBase.dropDownOpen({ popup: { element: gridObj.element.querySelector('.e-dialog')} })
        gridObj.isDestroyed = true;
        (gridObj.filterModule as any).filterModule.excelFilterBase.removeObjects([gridObj]);
        gridObj.isDestroyed = false;
        (gridObj.filterModule as any).filterModule.excelFilterBase.clickExHandler({target: document.querySelector('.e-excl-filter-icon')});
    });

    it('Excel filter acActionComplete coverage', (done: Function) => {
        var autoCompleteAction = (gridObj.filterModule.filterModule.excelFilterBase as any).acActionComplete({}, null);
        var autoCompleteActionCall = autoCompleteAction({ result: [] });
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = actionComplete = preventDefault = null;
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
                filterSettings: { type: 'Excel' },
                columns: [
                    { field: 'CustomerID', width: 120, headerText: 'Customer ID', filterTemplate: initializeCSPTemplate(function() {
                        return '<input type="text" id="ShipCountry" name="ShipCountry" />' }) },
                    { field: 'ShipCountry', headerText: 'Ship Country' }
                ]
            }, done);
    });

    it('Coverage for renderFilterUI', (done: Function) => {
        gridObj.actionComplete = (args?: any): void => {
            if(args.requestType === 'filterchoicerequest') {
                (gridObj.filterModule as any).filterModule.excelFilterBase.renderFilterUI((gridObj.columns[0] as any).field, args.filterModel.dlg);
            }
            done();
        };
        gridObj.isReact = true;
        (gridObj.element.querySelectorAll(".e-filtermenudiv")[0] as HTMLElement).click();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2: 937540 => On-Demand Excel Filter Dialog in Grouped Grid with Existing Filters Does Not Show All Distinct Values => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: groupData,
                allowFiltering: true,
                allowSorting: true,
                allowGrouping: true,
                height: "600px",
                filterSettings: {
                    type: "Excel",
                    enableInfiniteScrolling: true,
                    columns: [{ field: "Status", matchCase: false, operator: "equal", predicate: "or", value: "Pending" }]
                },
                sortSettings: {
                    columns: [{ field: "DateStr", direction: "Ascending" }],
                },
                groupSettings: {
                    columns: ["DateStr"]
                },
                columns: [
                    { type: "checkbox", width: 50 },
                    { field: "Id", isPrimaryKey: true, headerText: "Id", width: 100, textAlign: "Right" },
                    { field: "Status", headerText: "Status", allowEditing: false, width: 150, showColumnMenu: true, },
                    { field: "User", headerText: "User" },
                    { field: "DateStr", headerText: "Date", format: "yMd", textAlign: "Right" },
                ]
            }, done);
    });

    it('After opens the filter dialog 3 records should be available', (done: Function) => {
        gridObj.actionComplete = (args?: any): void => {
            if(args.requestType === 'filterAfterOpen') {
                expect(args.filterModel.cBox.querySelectorAll('.e-ftrchk').length === 3).toBeTruthy();
            }
            done();
        };
        gridObj.filterModule.openMenuByField('User');
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2: 957122: Need to change the beforeCustomFilterOpen event as public. => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData,
                allowFiltering: true,
                allowPaging: true,
                filterSettings: { type: 'Excel' },
                columns: [
                    { field: 'CustomerID', width: 120, headerText: 'Customer ID'},
                    { field: 'ShipCountry', headerText: 'Ship Country' }
                ]
            }, done);
    });

    it('Prevent custom filter dialog open', (done: Function) => {
        gridObj.beforeCustomFilterOpen = (args?: any): void => {
            expect(args.name).toBe('beforeCustomFilterOpen');
            args.cancel = true;
            gridObj.beforeCustomFilterOpen = null;
            done();
        };
        (gridObj.element.querySelectorAll(".e-filtermenudiv")[0] as HTMLElement).click();
        (gridObj.filterModule as any).filterModule.closeDialog();
        (gridObj.filterModule as any).filterModule.excelFilterBase.renderDialogue({ element: '' });
    });

    it('The custom filter dialog should not be opened', (done: Function) => {
        expect(document.querySelector('.e-xlflmenu')).toBe(null);
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('991898: Updating the Chrome version in coverage test cases of EJ2 components => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData,
                allowFiltering: true,
                allowPaging: true,
                filterSettings: { type: 'Excel' },
                columns: [
                    { field: 'CustomerID', width: 120, headerText: 'Customer ID'},
                    { field: 'ShipCountry', headerText: 'Ship Country' }
                ]
            }, done);
    });
    it('Prevent custom filter dialog open', () => {
        (gridObj.element.querySelectorAll(".e-filtermenudiv")[0] as HTMLElement).click();
        let mockValueInputInstance: any = { enabled: true };
        let args: any = {
            value: 123,
            element: {
                id: 'my-xlfl-frstoptr-xyz',
                ej2_instances: [{ value: 'isempty', enabled: true }],
                closest: (selector: any) => ({
                children: [null, { querySelector: () => ({ ej2_instances: [mockValueInputInstance] }) }]
                })
            }
        };
        (gridObj.filterModule as any).filterModule.excelFilterBase.dropDownValueChange(args);
        mockValueInputInstance = {
            enabled: false,
            getAttribute: (attr: any) => {
                return attr === 'disabled' ? '' : null;
            }
        };
        args = {
            value: 123,
            element: {
                id: 'my-xlfl',
                ej2_instances: [{ value: null, enabled: false }],
                closest: (selector: any) => ({
                children: [null, { querySelector: () => ({ ej2_instances: [mockValueInputInstance], getAttribute: mockValueInputInstance.getAttribute }) }]
                })
            }
        };
        (gridObj.filterModule as any).filterModule.excelFilterBase.dropDownValueChange(args);
        (gridObj.filterModule as any).filterModule.excelFilterBase.acFocus({}, null, null, null);
    });
    it('Coverage - 2', () => {
        (gridObj.filterModule as any).filterModule.excelFilterBase.options.isResponsiveFilter = true;
        const mockEvent = { target: gridObj.createElement('div', { className: 'e-resfilterback' }), };
        const args = { event: mockEvent, cancel: false };
        (gridObj.filterModule as any).filterModule.excelFilterBase.preventClose(args);
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});