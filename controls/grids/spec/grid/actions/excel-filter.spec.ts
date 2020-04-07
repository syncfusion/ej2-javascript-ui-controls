/**
 * Grid Filtering spec document
 */
import { ChildProperty, L10n } from '@syncfusion/ej2-base';
import { getValue } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { Group } from '../../../src/grid/actions/group';
import { Page } from '../../../src/grid/actions/page';
import { Freeze } from '../../../src/grid/actions/freeze';
import { createGrid, destroy, getClickObj } from '../base/specutil.spec';
import { Selection } from '../../../src/grid/actions/selection';
import { filterData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import { PredicateModel } from '../../../src/grid/base/grid-model';
import * as events from '../../../src/grid/base/constant';

Grid.Inject(Filter, Page, Selection, Group, Freeze);

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

    let numOptr: Object[] = [
        { value: 'equal', text: 'Equal' },
        { value: 'greaterThan', text: 'Greater Than' },
        { value: 'greaterThanOrEqual', text: 'Greater Than Or Equal' },
        { value: 'lessThan', text: 'Less Than' },
        { value: 'lessThanOrEqual', text: 'Less Than Or Equal' },
        { value: 'notEqual', text: 'Not Equal' }
    ];
    let customOperators: Object = {
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
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
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
            expect(getString(gridObj.filterSettings.columns)).toBe('[{"field":"ShipCountry","operator":"contains","value":"a","predicate":"or","matchCase":false,"ignoreAccent":false,"actualFilterValue":{},"actualOperator":{}}]');
            done();
        });
        it('or-predicate', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(58);
                expect(getString(gridObj.filterSettings.columns)).toBe('[{"field":"ShipCountry","operator":"contains","value":"a","predicate":"or","matchCase":false,"ignoreAccent":false,"actualFilterValue":{},"actualOperator":{}},{"field":"OrderID","predicate":"or","matchCase":false,"ignoreAccent":false,"operator":"greaterthan","value":10249,"type":"number"},{"field":"OrderID","predicate":"or","matchCase":false,"ignoreAccent":false,"operator":"lessthan","value":10280,"type":"number"}]');
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
                expect(getString(gridObj.filterSettings.columns)).toBe('[{"field":"ShipCountry","operator":"contains","value":"a","predicate":"or","matchCase":false,"ignoreAccent":false,"actualFilterValue":{},"actualOperator":{}},{"field":"OrderID","predicate":"and","matchCase":false,"ignoreAccent":false,"operator":"greaterthan","value":10249,"type":"number"},{"field":"OrderID","predicate":"and","matchCase":false,"ignoreAccent":false,"operator":"notequal","value":10250,"type":"number"}]');
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
                expect(getString(gridObj.filterSettings.columns)).toBe('[{"field":"ShipCountry","operator":"contains","value":"a","predicate":"or","matchCase":false,"ignoreAccent":false,"actualFilterValue":{},"actualOperator":{}},{"field":"OrderID","predicate":"and","matchCase":false,"operator":"greaterthan","value":10249,"type":"number","ignoreAccent":false}]');
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
            let returnedValue: string =
                (<any>gridObj.filterModule).filterModule.excelFilterBase.performComplexDataOperation('Details.Somethings', gridObj.dataSource[0]);
            expect(returnedValue).toBe('asdsafasf');
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = preventDefault = value = null;
        });
    });

      describe('Customized the excel filter using filterTemplate => ', () => {
        let gridObj: Grid;
        let drpdwn: string ='<input id="dropdown" value="1" >'; 
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: false,
                    pageSettings: { currentPage: 1 },
                    filterSettings: { type: 'Excel' },
                    columns: [
                        { field: 'OrderID', visible: true },
                        {
                            field: 'EmployeeID', headerText: 'EmployeeID', filterTemplate: drpdwn
                        },
                        {field:'Fright',headerText:'Frieght', width:130}
                    ],
                }, done);
        });

        it('compile filterTemplate in menu filter', () => {
             (<any>gridObj).element.querySelector('.e-headercell:nth-child(2)').querySelector('.e-filtermenudiv').click();
            expect((<any>gridObj).columns[1].filterTemplateFn).not.toBe(undefined);
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
            gridObj = drpdwn = getActualProperties = getString = null;
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
                if(args.requestType === 'filterafteropen'){
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
                if(args.requestType === 'filterafteropen'){
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
                if(args.requestType === 'filterafteropen'){
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
                    let formFunc: any = (args?: any): void => {
                        expect(args.name).toBe('beforeCustomFilterOpen');
                        gridObj.off(events.beforeCustomFilterOpen, formFunc);
                    };
                    gridObj.on(events.beforeCustomFilterOpen, formFunc, this);
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
                        if(args.requestType === 'filterafteropen'){
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
                                expect(gridObj.focusModule.getContent().matrix.current[1]).toBe(4);
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
            let dataBound: (args: any) => void;
            let actionComplete: () => void;
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
            it('testing initial filter', (done: Function) => {
                actionComplete = (args?: Object): void => {
                expect(gridObj.currentViewData.length).not.toBe(0);
                done();
                }
                gridObj.actionComplete = actionComplete;
            });

            afterAll(() => {
                destroy(gridObj);
                gridObj = actionComplete = null;
            });
        });
    });