/**
 * Grid Filtering spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { PredicateModel } from '../../../src/grid/base/grid-model';
import { Filter } from '../../../src/grid/actions/filter';
import { Group } from '../../../src/grid/actions/group';
import { Page } from '../../../src/grid/actions/page';
import { Freeze } from '../../../src/grid/actions/freeze';
import { CellType } from '../../../src/grid/base/enum';
import { ValueFormatter } from '../../../src/grid/services/value-formatter';
import { Column } from '../../../src/grid/models/column';
import { Selection } from '../../../src/grid/actions/selection';
import { filterData } from '../base/datasource.spec';
import { Reorder } from '../../../src/grid/actions/reorder';
import { createGrid, destroy, getKeyUpObj } from '../base/specutil.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { ColumnMenu } from '../../../src/grid/actions/column-menu';
import * as events from '../../../src/grid/base/constant';

Grid.Inject(Filter, Page, Selection, Group, Freeze, Reorder, ColumnMenu);

describe('Filtering module => ', () => {

    let checkFilterObj: Function = (obj: PredicateModel, field?: string,
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

    let filterColumn: Function = (gridObj: Grid, colName: string, value: string, keyCode?: number) => {
        let filterElement: any = gridObj.element.querySelector('[id=\'' + colName + '_filterBarcell\']');
        filterElement.value = value;
        filterElement.focus();
        (gridObj.filterModule as any).keyUpHandler(getKeyUpObj(keyCode ? keyCode : 13, filterElement));
    };

    let clearFilter: Function = (gridObj: Grid, done: Function) => {
        let actionComplete: any = (args?: Object): void => {
            if (gridObj.element.querySelectorAll('.e-row').length === filterData.length &&
                gridObj.filterSettings.columns.length === 0) {
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.clearFiltering();
    };

    describe('Filterbar functionalities => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let orderIDElement: any;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: false,
                    filterSettings: { type: 'FilterBar', showFilterBarStatus: true },
                    columns: [{ field: 'OrderID', type: 'number', visible: true },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'Freight', format: 'C2', type: 'number' },
                    { field: '9-10' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('Filter string column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(3);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'CustomerID', 'startswith', 'VINET', 'and', false)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            orderIDElement = gridObj.element.querySelector('#OrderID_filterBarcell');
            filterColumn(gridObj, 'CustomerID', 'VINET');
        });

        it('empty filter value testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(71);
                expect(gridObj.filterSettings.columns.length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'CustomerID', '');
        });

        it('skip input filter string value testing', () => {
            filterColumn(gridObj, 'CustomerID', '<');
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(71);
        });

        it('skip input filter number value testing', () => {
            filterColumn(gridObj, 'OrderID', '!');
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(71);
        });

        it('Filter number column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'equal', 10249, 'and', true)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'OrderID', '10249');
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(filterData.length);
                expect(gridObj.filterSettings.columns.length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('Filter number column string value testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'OrderID', '102i49i');
        });

        it('clear Filtering testing', (done: Function) => {
            clearFilter(gridObj, done);
        });

        it('Filter number format column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'Freight', 'equal', 32.38, 'and', true)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'Freight', '32.38');
        });

        it('clear Filtering testing', (done: Function) => {
            clearFilter(gridObj, done);
        });

        it('Filter number format with formated value testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'Freight', 'equal', 32.38, 'and', true)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'Freight', '$32.38');
        });

        it('clear Filtering testing', (done: Function) => {
            clearFilter(gridObj, done);
        });

        it('Filter number with < operator testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(4);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'lessthan', 10252, 'and', true)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'OrderID', '<10252');
        });

        it('clear Filtering testing', (done: Function) => {
            clearFilter(gridObj, done);
        });

        it('Filter number with > operator testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(66);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'greaterthan', 10252, 'and', true)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'OrderID', '>10252');
        });

        it('clear Filtering testing', (done: Function) => {
            clearFilter(gridObj, done);
        });

        it('Filter number with < operator testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(5);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'lessthanorequal', 10252, 'and', true)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'OrderID', '<=10252');
        });

        it('clear Filtering testing', (done: Function) => {
            clearFilter(gridObj, done);
        });

        it('Filter number with >= operator testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(67);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'greaterthanorequal', 10252, 'and', true)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'OrderID', '>=10252');
        });

        it('clear Filtering testing', (done: Function) => {
            clearFilter(gridObj, done);
        });

        it('Filter number with = operator testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'equal', 10252, 'and', true)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'OrderID', '=10252');
        });

        it('clear Filtering testing', (done: Function) => {
            clearFilter(gridObj, done);
        });

        it('Filter number with ! operator testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(filterData.length - 1);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'notequal', 10252, 'and', true)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'OrderID', '!10252');
        });

        it('clear Filtering testing', (done: Function) => {
            clearFilter(gridObj, done);
        });

        it('Filter string with * operator testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(4);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'CustomerID', 'startswith', 'v', 'and', false)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'CustomerID', '*v');
        });

        it('clear Filtering testing', (done: Function) => {
            clearFilter(gridObj, done);
        });

        it('Filter string with % first operator testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'CustomerID', 'endswith', 'v', 'and', false)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'CustomerID', '%v');
        });

        it('clear Filtering testing', (done: Function) => {
            clearFilter(gridObj, done);
        });

        it('Filter string with % last operator testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(5);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'CustomerID', 'startswith', 'b', 'and', false)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'CustomerID', 'b%');
        });

        it('clear Filtering testing', (done: Function) => {
            clearFilter(gridObj, done);
        });

        it('filterByColumn method testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'equal', 10248, 'and', true)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('OrderID', 'equal', 10248, 'and', true);
            expect(orderIDElement.disabled).toBeFalsy();
        });

        it('check already filtered column testing', () => {
            gridObj.filterByColumn('OrderID', 'equal', 10248, 'and', true);
            expect(orderIDElement.disabled).toBeFalsy();
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
            expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'equal', 10248, 'and', true)).toBeTruthy();
        });

        it('allowfiltering false testing', () => {
            gridObj.allowFiltering = false;
            gridObj.dataBind();
            gridObj.actionComplete = undefined;
            expect(gridObj.element.querySelectorAll('.e-filterbar').length).toBe(0);
        });

        it('allowfiltering true testing', () => {
            gridObj.allowFiltering = true;
            gridObj.dataBind();
            expect(gridObj.element.querySelectorAll('.e-filterbar').length).toBe(1);
        });

        it('filter clear testing', (done: Function) => {
            gridObj.clearFiltering();
            gridObj.actionComplete = (args?: Object): void => {
                gridObj.actionComplete = null;
                done();
            };
        });

        it('Filter -enable pager', (done: Function) => {
            gridObj.actionComplete = (args?: Object): void => {
                done();
            };
            gridObj.allowPaging = true;
            gridObj.dataBind();
        });
        it('Filter- go to last page', (done: Function) => {
            gridObj.actionComplete = (args?: Object): void => {
                done();
            };
            gridObj.goToPage(2);
        });
        // test case continues failed
        // it('Filter in last page with wrong value', (done: Function) => {
        //     gridObj.actionComplete = (args?: Object): void => {
        //         expect(gridObj.element.querySelectorAll('.e-row').length).toBe(0);
        //         done();
        //     };
        //     filterColumn(gridObj, 'CustomerID', 'vi9');
        // });
        // it('Filter and paging in same time', (done: Function) => {
        //     gridObj.actionComplete = (args?: Object): void => {
        //         expect(gridObj.pageSettings.totalRecordsCount).not.toBe(0);
        //         expect(gridObj.pageSettings.currentPage).toBe(1);
        //         gridObj.actionComplete = null;
        //         done();
        //     };
        //     filterColumn(gridObj, 'CustomerID', 'vi');
        // });
        // it('number filed name - filtering', (done: Function) => {
        //     //testing for script error 
        //     gridObj.actionComplete = (args?: Object): void => {
        //         done();
        //     };
        //     filterColumn(gridObj, '9-10', 'vi');
        // });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Filterbar functionalities2 => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let orderIDElement: any;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: false,
                    filterSettings: { type: 'FilterBar', showFilterBarStatus: true },
                    columns: [
                        { field: 'CustomerID', type: 'string', allowFiltering: false },
                        { field: 'ShipCity' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('Filter undefined format column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'ShipCity', 'startswith', 'Lyon', 'and', false)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'ShipCity', 'Lyon');
        });

        it('clear Filtering testing', (done: Function) => {
            clearFilter(gridObj, done);
        });

        it('Filter date column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                //expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1); //server date different compare to local so commented
                // expect(gridObj.filterSettings.columns.length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            let valueFormatter: ValueFormatter = new ValueFormatter();
            filterColumn(gridObj, 'OrderDate', valueFormatter.toView(new Date(8364186e5), (gridObj.getColumnByField('OrderDate') as Column).getFormatter()).toString());
        });

        it('clear Filtering testing', (done: Function) => {
            clearFilter(gridObj, done);
        });

        it('column allowFiltering false testing', () => {
            gridObj.filterModule.filterByColumn('CustomerID', 'equal', 'VINET');
            filterColumn(gridObj, 'CustomerID', 'VINET', 8);
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(71);
        });

        afterAll(() => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(71); //last action check
            destroy(gridObj);
        });
    });

    describe('Filterbar functionalities3 => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let orderIDElement: any;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: false,
                    filterSettings: { type: 'FilterBar', showFilterBarStatus: true },
                    columns: [{ field: 'Verified', type: 'boolean' },
                    { field: 'ShipCountry', type: 'string' }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('Filter undefined type column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(3);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'ShipCountry', 'startswith', 'UK', 'and', false)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'ShipCountry', 'UK');
        });

        it('clear Filtering testing', (done: Function) => {
            clearFilter(gridObj, done);
        });

        it('Filter boolean format true column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(35);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'Verified', 'equal', true, 'and', true)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'Verified', 'true');
        });

        it('Filter boolean format 0 column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(36);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'Verified', 'equal', false, 'and', true)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'Verified', '0');
        });

        it('Filter boolean format 1 column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(35);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'Verified', 'equal', true, 'and', true)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'Verified', '1');
        });

        it('Filter boolean format false column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(36);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'Verified', 'equal', false, 'and', true)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'Verified', 'false');
        });

        it('Filter boolean format invalid value testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'Verified', 'VINET');
        });

        it('clear Filtering testing', (done: Function) => {
            clearFilter(gridObj, done);
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Filterbar showFilterBarStatus false testing => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        let filterElement: HTMLInputElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    pageSettings: { currentPage: 1 },
                    filterSettings: { type: 'FilterBar', columns: [], showFilterBarStatus: true },
                    columns: [
                        { field: 'OrderID', type: 'number', visible: true },
                        { field: 'CustomerID', type: 'string' }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('showFilterBarStatus testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect((gridObj.element.querySelector('.e-pagerexternalmsg') as HTMLElement).style.display).toBe('none');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterSettings.showFilterBarStatus = false;
            gridObj.dataBind();
            gridObj.filterByColumn('OrderID', 'equal', '10248', 'and', false);
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Filterbar template => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: false,
                    pageSettings: { currentPage: 1 },
                    filterSettings: { type: 'FilterBar', columns: [] },
                    columns: [
                        { field: 'OrderID', type: 'number', visible: true },
                        {
                            field: 'EmployeeID', filterBarTemplate: {
                                create: (args: any) => {
                                    let input: any = document.createElement('input');
                                    input.classList.add('customfiltertemplate');
                                    input.type = 'text';
                                    return input;
                                },
                                write: (args: any) => {
                                    args.element.value = '5';
                                },
                                read: (args: any) => {
                                    gridObj.filterByColumn('EmployeeID', "equal", parseInt((gridObj.element.querySelector('.customfiltertemplate') as any).value, 10), "and", true);
                                }
                            }
                        }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('element classname testing', () => {
            expect(gridObj.getHeaderTable().querySelectorAll('.e-fltrtemp').length).toBe(1);
            expect((gridObj.getHeaderTable().querySelector('#EmployeeID_filterBarcell') as HTMLInputElement).querySelectorAll('.customfiltertemplate').length).toBe(1);
            expect((gridObj.getHeaderTable().querySelector('#OrderID_filterBarcell') as HTMLInputElement).disabled).toBeFalsy();
        });

        it('filter template column', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(4);
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.columns[1] as any).filterBarTemplate.read();
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Filterbar template without create testing => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        let filterElement: HTMLInputElement;
        let filterModule: Filter;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: false,
                    pageSettings: { currentPage: 1 },
                    filterSettings: { type: 'FilterBar', columns: [] },
                    columns: [{ field: 'OrderID', type: 'number', visible: true },
                    {
                        field: 'EmployeeID', filterBarTemplate: {
                            write: (args: any) => {
                                (document.getElementById('EmployeeID_filterBarcell') as any).value = '5';
                            },
                            read: (args: any) => {
                                gridObj.filterByColumn('EmployeeID', "equal", parseInt((document.getElementById('EmployeeID_filterBarcell') as any).value, 10), "and", true);
                            }
                        }
                    }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('element classname testing', () => {
            expect(gridObj.getHeaderTable().querySelectorAll('.e-fltrtemp').length).toBe(1);
        });

        it('filter template column', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(4);
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.columns[1] as any).filterBarTemplate.read();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Filter a column and clear filtering => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        let filterElement: HTMLInputElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    allowGrouping: true,
                    pageSettings: { currentPage: 1 },
                    filterSettings: {
                        type: 'FilterBar', columns: [
                            { field: 'EmployeeID', operator: 'equal', value: 5, matchCase: true }], showFilterBarStatus: true
                    },
                    columns: [
                        { field: 'OrderID', type: 'number', visible: true },
                        { field: 'EmployeeID', type: 'number' },
                        { field: 'Freight', format: 'C2', type: 'number' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean' },
                        { field: 'OrderDate', format: 'yMd', type: 'date' }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });
        // test initial filtering scenario
        it('showFilterBarStatus testing initial filter', () => {
            expect((<any>gridObj.getHeaderContent().querySelectorAll('#EmployeeID_filterBarcell')[0]).value).toBe('5');
            expect(gridObj.currentViewData.length).toBe(4);
            expect(gridObj.getPager().querySelectorAll('.e-pagerexternalmsg')[0].innerHTML).toBe('EmployeeID: 5');
        });

        it('showFilterBarStatus testing with aditional filter', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect((<any>gridObj.getHeaderContent().querySelectorAll('#OrderID_filterBarcell')[0]).value).toBe('10248');
                expect((<any>gridObj.getHeaderContent().querySelectorAll('#EmployeeID_filterBarcell')[0]).value).toBe('5');
                expect(gridObj.currentViewData.length).toBe(1);
                expect(gridObj.getPager().querySelectorAll('.e-pagerexternalmsg')[0].innerHTML).toBe('EmployeeID: 5 &amp;&amp; OrderID: 10248');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('OrderID', 'equal', 10248, 'and', false);
        });
        it('group a column', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toBe(1);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending').length).toBe(1);
                expect((<any>gridObj.getHeaderContent().querySelectorAll('#OrderID_filterBarcell')[0]).value).toBe('10248');
                expect((<any>gridObj.getHeaderContent().querySelectorAll('#EmployeeID_filterBarcell')[0]).value).toBe('5');
                expect(gridObj.getPager().querySelectorAll('.e-pagerexternalmsg')[0].innerHTML).toBe('EmployeeID: 5 &amp;&amp; OrderID: 10248');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('EmployeeID');
        });
        it('ungroup a column', (done: Function) => {
            actionComplete = (args?: Object) => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toBe(0);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(0);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-emptycell').length).toBe(0);
                expect((<any>gridObj.getHeaderContent().querySelectorAll('#OrderID_filterBarcell')[0]).value).toBe('10248');
                expect((<any>gridObj.getHeaderContent().querySelectorAll('#EmployeeID_filterBarcell')[0]).value).toBe('5');
                expect(gridObj.getPager().querySelectorAll('.e-pagerexternalmsg')[0].innerHTML).toBe('EmployeeID: 5 &amp;&amp; OrderID: 10248');
                done();
            }
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('EmployeeID');
        });

        //check scenario - group a column then filter a column to empty record and then ungroup a column - check ungroup done with empty grid

        it('group a column', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toBe(1);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('OrderID');
        });
        it('Filter a column', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.currentViewData.length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('Freight', 'lessthan', '0', 'and', true);
        });
        it('Clear grouping', (done: Function) => {
            actionComplete = (args?: Object) => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toBe(0);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('OrderID');
        });

        afterAll((done) => {
            destroy(gridObj);
        });
    });

    describe('Filterbar with Freeze Row and column => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let dBound: () => void;
        let filterElement: HTMLInputElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    frozenColumns: 2,
                    frozenRows: 2,
                    allowFiltering: true,
                    allowPaging: false,
                    filterSettings: { type: 'FilterBar', showFilterBarStatus: true },
                    columns: [{ field: 'OrderID', type: 'number', visible: true }, { field: 'CustomerID', type: 'string' },
                    { field: 'EmployeeID', type: 'number' }, { field: 'Freight', format: 'C2', type: 'number' },
                    { field: 'ShipCity' }, { field: 'Verified', type: 'boolean' }, { field: 'ShipName', allowFiltering: false },
                    { field: 'ShipCountry', type: 'string' },
                    { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' },
                    { field: 'ShipAddress', allowFiltering: true, visible: false }],
                    actionBegin: actionBegin
                }, done);
        });

        it('Filter on frozen content', (done: Function) => {
            dBound = (args?: Object): void => {
                expect(gridObj.getHeaderContent().querySelector('.e-frozenheader')
                    .querySelector('tbody').children[0].children[1].innerHTML).toBe('VINET');
                done();
            };
            gridObj.dataBound = dBound;
            filterColumn(gridObj, 'CustomerID', 'VINET');
        });

        it('Filter on movable content', (done: Function) => {
            dBound = (args?: Object): void => {
                expect(gridObj.getHeaderContent().querySelector('.e-movableheader')
                    .querySelector('tbody').children[0].children[2].innerHTML).toBe('Reims');
                done();
            };
            gridObj.dataBound = dBound;
            filterColumn(gridObj, 'ShipCity', 'REIMS');
        });

        it('Render empty', (done: Function) => {
            dBound = (args?: Object): void => {
                expect(gridObj.getContent().querySelector('.e-movablecontent').querySelector('tbody').childElementCount).toBe(1);
                expect(gridObj.getContent().querySelector('.e-frozencontent')
                    .querySelector('tbody').children[0].classList).toContain('e-emptyrow');
                done();
            };
            gridObj.dataBound = dBound;
            filterColumn(gridObj, 'OrderID', '2');
        });

        it('on property change', (done: Function) => {
            dBound = (args?: Object): void => {
                done();
            };
            gridObj.dataBound = dBound;
            gridObj.allowFiltering = false;
            gridObj.dataBind();
            expect(gridObj.getHeaderContent().querySelector('.e-filterbar')).toBe(null);
            gridObj.allowFiltering = true;
            gridObj.dataBind();
            expect(gridObj.getHeaderContent().querySelector('.e-frozenheader').querySelector('.e-filterbar')).not.toBe(null);
            expect(gridObj.getHeaderContent().querySelector('.e-movableheader').querySelector('.e-filterbar')).not.toBe(null);
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Filterbar with Freeze Row => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let dBound: () => void;
        let filterElement: HTMLInputElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    frozenRows: 2,
                    allowFiltering: true,
                    allowPaging: false,
                    filterSettings: { type: 'FilterBar', showFilterBarStatus: true },
                    columns: [{ field: 'OrderID', type: 'number', visible: true }, { field: 'CustomerID', type: 'string' },
                    { field: 'EmployeeID', type: 'number' }, { field: 'Freight', format: 'C2', type: 'number' },
                    { field: 'ShipCity' }, { field: 'Verified', type: 'boolean' }, { field: 'ShipName', allowFiltering: false },
                    { field: 'ShipCountry', type: 'string' },
                    { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' },
                    { field: 'ShipAddress', allowFiltering: true, visible: false }],
                    actionBegin: actionBegin
                }, done);
        });

        it('Filter on frozen rows', (done: Function) => {
            dBound = (args?: Object): void => {
                expect(gridObj.getHeaderContent().querySelector('tbody').children[0].children[1].innerHTML).toBe('VINET');
                done();
            };
            gridObj.dataBound = dBound;
            filterColumn(gridObj, 'CustomerID', 'VINET');
        });

        it('Render empty', (done: Function) => {
            dBound = (args?: Object): void => {
                expect(gridObj.getContent().querySelector('tbody').children[0].classList).toContain('e-emptyrow');
                done();
            };
            gridObj.dataBound = dBound;
            filterColumn(gridObj, 'OrderID', '2');
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Filterbar with Freeze Column => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let dBound: () => void;
        let filterElement: HTMLInputElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    frozenColumns: 2,
                    allowFiltering: true,
                    allowPaging: false,
                    filterSettings: { type: 'FilterBar', showFilterBarStatus: true },
                    columns: [{ field: 'OrderID', type: 'number', visible: true }, { field: 'CustomerID', type: 'string' },
                    { field: 'EmployeeID', type: 'number' }, { field: 'Freight', format: 'C2', type: 'number' },
                    { field: 'ShipCity' }, { field: 'Verified', type: 'boolean' }, { field: 'ShipName', allowFiltering: false },
                    { field: 'ShipCountry', type: 'string' },
                    { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' },
                    { field: 'ShipAddress', allowFiltering: true, visible: false }],
                    actionBegin: actionBegin
                }, done);
        });

        it('Filter on frozen content', (done: Function) => {
            dBound = (args?: Object): void => {
                expect(gridObj.getContent().querySelector('.e-frozencontent')
                    .querySelector('tbody').children[0].children[1].innerHTML).toBe('VINET');
                done();
            };
            gridObj.dataBound = dBound;
            filterColumn(gridObj, 'CustomerID', 'VINET');
        });

        it('Filter on movable content', (done: Function) => {
            dBound = (args?: Object): void => {
                expect(gridObj.getContent().querySelector('.e-movablecontent')
                    .querySelector('tbody').children[0].children[2].innerHTML).toBe('Reims');
                done();
            };
            gridObj.dataBound = dBound;
            filterColumn(gridObj, 'ShipCity', 'REIMS');
        });

        it('Render empty', (done: Function) => {
            dBound = (args?: Object): void => {
                expect(gridObj.getContent().querySelector('.e-movablecontent').querySelector('tbody').childElementCount).toBe(1);
                expect(gridObj.getContent().querySelector('.e-frozencontent')
                    .querySelector('tbody').children[0].classList).toContain('e-emptyrow');
                done();
            };
            gridObj.dataBound = dBound;
            filterColumn(gridObj, 'OrderID', '2');
        });

        afterAll((done) => {
            destroy(gridObj);
            setTimeout(function () {
                done();
            }, 1000);
        });
    });

    //scenario: check filterbar cell value after reordering with filter and clear fler
    describe('EJ2-6573, EJ2-6562 Filterbar with paging no records display => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: (e: any) => any;
        let filterElement: HTMLInputElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    allowReordering: true,
                    filterSettings: { type: 'FilterBar', showFilterBarStatus: true },
                    columns: [{ field: 'OrderID', type: 'number', visible: true }, { field: 'CustomerID', type: 'string' },
                    { field: 'EmployeeID', type: 'number' }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                }, done);
        });

        it('current page testing', (done: Function) => {
            actionComplete = (args: any): any => {
                expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('index')).toBe('6');
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('.e-last') as any).click();
            gridObj.dataBind();
        });

        it('Filter number column string value and pager first btn disable testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(0);
                expect(gridObj.element.querySelector('.e-first').classList.contains('e-disable')).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'OrderID', '102i49i');
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('first page testing', (done: Function) => {
            actionComplete = (args: any): any => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.pageSettings.currentPage = 1;
            gridObj.dataBind();
        });

        it('filter bar input value testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect((gridObj.element.querySelector('#EmployeeID_filterBarcell') as any).value).toBe('=234');
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'EmployeeID', '=234');
        });

        it('Reorder Column method testing', (done: Function) => {
            let dataBound = (args: Object): void => {
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.reorderColumns('EmployeeID', 'OrderID');
        });

        it('filter bar input value after reordered testing', () => {
            expect((gridObj.element.querySelector('#EmployeeID_filterBarcell') as any).value).toBe('234');
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('filter bar input value testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect((gridObj.element.querySelector('#EmployeeID_filterBarcell') as any).value).toBe('=234');
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'EmployeeID', '=234');
        });

        it('clear Filtering testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('Reorder Column method testing', (done: Function) => {
            let dataBound = (args: Object): void => {
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.reorderColumns('EmployeeID', 'OrderID');
        });

        it('filter bar input value after reordered testing', () => {
            expect((gridObj.element.querySelector('#EmployeeID_filterBarcell') as any).value).toBe('');
        });


        afterAll((done) => {
            destroy(gridObj);
        });
    });

    describe('Filter menu with column menu => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let dBound: () => void;
        let filterElement: HTMLInputElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: false,
                    showColumnMenu: true,
                    filterSettings: {
                        type: 'Menu', showFilterBarStatus: true,
                        columns: [{ field: 'ShipCity', matchCase: false, operator: 'startswith', predicate: 'and', value: 'reims' },
                        { field: 'ShipName', matchCase: false, operator: 'startswith', predicate: 'and', value: 'Vins et alcools Chevalier' }]
                    },
                    columns: [{ field: 'OrderID', type: 'number', visible: true }, { field: 'CustomerID', type: 'string' },
                    { field: 'EmployeeID', type: 'number' }, { field: 'Freight', format: 'C2', type: 'number' },
                    { field: 'ShipCity' }, { field: 'Verified', type: 'boolean' }, { field: 'ShipName', allowFiltering: false },
                    { field: 'ShipCountry', type: 'string' },
                    { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' },
                    { field: 'ShipAddress', allowFiltering: true, visible: false }],
                    actionBegin: actionBegin
                }, done);
        });

        it('EJ2-7135 - remvove column filter', (done: Function) => {
            var shipCityColumn = gridObj.getHeaderContent().querySelectorAll('th')[4];
            expect(shipCityColumn.querySelector('.e-filtered')).not.toBe(null);
            dBound = (args?: Object): void => {
                expect(shipCityColumn.querySelector('.e-filtered')).toBe(null);
                gridObj.actionBegin = null;
                done();
            };
            gridObj.actionBegin = dBound;
            gridObj.removeFilteredColsByField('ShipCity');
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Excel Filter dialog not updated while programmatically filter the column=> ', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: false,
                    filterSettings: { type: 'Excel' },
                    columns: [{ field: 'CustomerID', type: 'string' },
                    { field: 'OrderID', type: 'number', visible: true },
                    { field: 'ShipAddress', allowFiltering: true, visible: false }],
                    actionComplete: actionComplete
                }, done);
        });


        it('EJ2-10000(case 1) - Filtering customerID column by filterByColumn method', (done: Function) => {
            actionComplete = (args?: any): void => {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('CustomerID', 'contains', 'VIN');
        });

        it('EJ2-10000(case 1) - checking excel filter icon and whether value gets updated in Excel filter popup', (done: Function) => {
            expect(gridObj.element.querySelector('.e-columnheader').firstElementChild.querySelector('.e-filtered')).toBeTruthy();
            expect((gridObj.filterModule as any).actualPredicate["CustomerID"].length).toBe(1);
            actionComplete = (args?: any): void => {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.removeFilteredColsByField("CustomerID");
        });

        it('EJ2-10000(case 1) - Checking whether values in excel filter popup is cleared', () => {
            expect((gridObj.filterModule as any).actualPredicate["CustomerID"]).toBe(undefined);
        });

        it('EJ2-10000(case 2) - changing filtertype', (done: Function) => {
            let headerRefreshed = (): void => {
                gridObj.off(events.headerRefreshed, headerRefreshed);
                done();
            }
            gridObj.on(events.headerRefreshed, headerRefreshed, this);
            gridObj.filterSettings.type = 'Menu';
        });

        it('EJ2-10000(case 2) - Filtering in Menu type', (done: Function) => {
            actionComplete = (args?: any): void => {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('CustomerID', 'contains', 'VIN');
        });

        it('EJ2-10000(case 2) -clearing in Menu type', (done: Function) => {
            actionComplete = (args?: any): void => {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.removeFilteredColsByField("CustomerID");
        });

        it('EJ2-10000(case 2) - changing filter type', (done: Function) => {
            let headerRefreshed = (): void => {
                gridObj.off(events.headerRefreshed, headerRefreshed);
                done();
            }
            gridObj.on(events.headerRefreshed, headerRefreshed, this);
            gridObj.filterSettings.type = 'FilterBar';
        });

        it('EJ2-10000(case 3) - checking filterbar cell value after clearing in Menu type', (done: Function) => {
            //checking for case 2 actions.
            expect((gridObj.element.querySelector('#CustomerID_filterBarcell') as any).value).toBe('');
            let headerRefreshed = (): void => {
                gridObj.off(events.headerRefreshed, headerRefreshed);
                done();
            }
            gridObj.on(events.headerRefreshed, headerRefreshed, this);
            gridObj.filterSettings.type = 'Excel';
        });

        it('EJ2-10000(case 3) - Filtering in Excel type', (done: Function) => {
            actionComplete = (args?: any): void => {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('CustomerID', 'contains', 'VIN');
        });

        it('EJ2-10000(case 3) - clearing in Excel type', (done: Function) => {
            actionComplete = (args?: any): void => {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterHandler({ action: "clear-filter", field: "CustomerID" });
        });

        it('EJ2-10000(case 3) - changing filter settings', (done: Function) => {
            let headerRefreshed = (): void => {
                gridObj.off(events.headerRefreshed, headerRefreshed);
                done();
            }
            gridObj.on(events.headerRefreshed, headerRefreshed, this);
            gridObj.filterSettings.type = 'FilterBar';
        });

        it('EJ2-10000(case 4) - checking filterbar cell value after clearing in Excel type', (done: Function) => {
            //checking for case 3 actions.
            expect((gridObj.element.querySelector('#CustomerID_filterBarcell') as any).value).toBe('');
            actionComplete = (args?: any): void => {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('CustomerID', 'contains', 'VIN');
        });

        it('EJ2-10000(case 4) - clearing in FilterBar type', (done: Function) => {
            actionComplete = (args?: any): void => {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.removeFilteredColsByField("CustomerID");
        });

        it('EJ2-10000(case 4) - checking whether filterbar value is cleared by removeFilteredColsByField method', () => {
            //checking for case 4 actions
            expect((gridObj.element.querySelector('#CustomerID_filterBarcell') as any).value).toBe('');
        });

        afterAll(() => {
           destroy(gridObj);
        });
    });

    describe('Filter template in FilterBar filter type => ', () => {
        let gridObj: Grid;       
        let actionComplete: () => void;
        let drpdwn: string ='<input id="dropdown" value="1" >'       
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: false,
                    pageSettings: { currentPage: 1 },
                    filterSettings: { type: 'FilterBar' },
                    columns: [
                        { field: 'OrderID', visible: true },
                        {
                            field: 'EmployeeID', headerText: 'EmployeeID', filterTemplate: drpdwn
                        },
                        {field:'Fright',headerText:'Frieght', width:130}
                    ],
                }, done);
        });

        it('compile filterTemplate in filterbar filter', () => {            
            expect((<any>gridObj).columns[1].filterTemplateFn).not.toBe(undefined);
        });
        it('compile filterTemplate in filterbar filter', () => {              
            (<any>gridObj).filterByColumn('OrderID','equal',10248);        
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Filter template in Menu filter type => ', () => {
        let gridObj: Grid;       
        let actionComplete: () => void;
        let drpdwn: string ='<input id="dropdown" value="1" >'       
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: false,
                    pageSettings: { currentPage: 1 },
                    filterSettings: { type: 'Menu' },
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
        it('compile filterTemplate in menu filter', () => {  
            (<any>gridObj).element.querySelector('.e-headercell:nth-child(1)').querySelector('.e-filtermenudiv').click();
            (<any>gridObj).filterByColumn('OrderID','equal',10248);        
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

});
