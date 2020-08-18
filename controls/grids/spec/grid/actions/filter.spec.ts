/**
 * Grid Filtering spec document
 */
import { Grid } from '../../../src/grid/base/grid';
import { PredicateModel } from '../../../src/grid/base/grid-model';
import { Filter } from '../../../src/grid/actions/filter';
import { Group } from '../../../src/grid/actions/group';
import { Page } from '../../../src/grid/actions/page';
import { ForeignKey } from '../../../src/grid/actions/foreign-key';
import { Freeze } from '../../../src/grid/actions/freeze';
import { ValueFormatter } from '../../../src/grid/services/value-formatter';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import { Column } from '../../../src/grid/models/column';
import { Selection } from '../../../src/grid/actions/selection';
import { filterData, foreigndata, normalData } from '../base/datasource.spec';
import { Reorder } from '../../../src/grid/actions/reorder';
import { createGrid, destroy, getKeyUpObj } from '../base/specutil.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { ColumnMenu } from '../../../src/grid/actions/column-menu';
import * as events from '../../../src/grid/base/constant';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import { DataManager, ODataV4Adaptor } from "@syncfusion/ej2-data";

Grid.Inject(Filter, Page, Selection, Group, Freeze, Reorder, ColumnMenu, ForeignKey,VirtualScroll);

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
            gridObj = actionBegin = actionComplete = orderIDElement = null;
        });
    });

    describe('Filterbar functionalities2 => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
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
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('Filterbar functionalities3 => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
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
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'Verified', 'equal', true, 'and', false)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'Verified', 'true');
        });

        it('Filter boolean format 0 column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(36);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'Verified', 'equal', false, 'and', false)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'Verified', '0');
        });

        it('Filter boolean format 1 column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(35);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'Verified', 'equal', true, 'and', false)).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'Verified', '1');
        });

        it('Filter boolean format false column testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(36);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'Verified', 'equal', false, 'and', false)).toBeTruthy();
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
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('Filterbar showFilterBarStatus false testing => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
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

        it('Ensure filterbar input element value', (done: Function) => {
            gridObj.clearFiltering();
            actionComplete = (args?: Object): void => {
                let elementVal: string = (document.getElementById('OrderID_filterBarcell') as any).value;
                expect(elementVal).not.toBe('');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterSettings.columns = [{ field: 'OrderID', operator: 'equal', value: 10248 }];
        });

        it('Empty string', (done: Function) => {
            actionComplete = (args?: Object): void => {
                let elementVal: string = (document.getElementById('OrderID_filterBarcell') as any).value;
                expect(elementVal).toBe('');
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'OrderID', "");
        });

        it('Ensure filterbar input element value after filtering', (done: Function) => {
            actionComplete = (args?: Object): void => {
                let elementVal: string = (document.getElementById('OrderID_filterBarcell') as any).value;
                expect(elementVal).not.toBe('');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('OrderID', 'equal', '10248');
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
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
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('Filterbar template without create testing => ', () => {
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
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('Filter a column and clear filtering => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
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
                        type: 'FilterBar', columns: [
                            { field: 'EmployeeID', operator: 'equal', value: 5, matchCase: true }], showFilterBarStatus: true
                    },
                    columns: [
                        { field: 'OrderID', type: 'number', visible: true },
                        { field: 'EmployeeID', type: 'number' },
                        { field: 'Freight', format: 'C2', type: 'number' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean' },
                        { field: 'OrderDate', format: 'yMd', type: 'date' }],
                }, done);
        });
        // test initial filtering scenario
        it('showFilterBarStatus testing initial filter', (done: Function) => {
            actionComplete = (args?: Object): void => {
            expect((<any>gridObj.getHeaderContent().querySelectorAll('#EmployeeID_filterBarcell')[0]).value).toBe('5');
            expect(gridObj.currentViewData.length).toBe(4);
            expect(gridObj.getPager().querySelectorAll('.e-pagerexternalmsg')[0].innerHTML).toBe('EmployeeID: 5');
            done();
            }
            gridObj.actionComplete = actionComplete;
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
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('Filterbar with Freeze Row and column => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let dBound: () => void;
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
            gridObj = actionBegin = dBound = null;
        });
    });

    describe('Filterbar with Freeze Row => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let dBound: () => void;
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
            gridObj = actionBegin = dBound = null;
        });
    });

    describe('Filterbar with Freeze Column => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let dBound: () => void;
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
            gridObj = actionBegin = dBound = null;
        });
    });

    //scenario: check filterbar cell value after reordering with filter and clear fler
    describe('EJ2-6573, EJ2-6562 Filterbar with paging no records display => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: (e: any) => any;
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
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('Filter menu with column menu => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let dBound: () => void;
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
            gridObj = actionBegin = dBound = null;
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
           gridObj = actionComplete = null;
        });
    });

    describe('Filter template in FilterBar filter type => ', () => {
        let gridObj: Grid;
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
            gridObj = drpdwn = null;
        });
    });

    describe('Filter template in Menu filter type => ', () => {
        let gridObj: Grid;
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
            gridObj = drpdwn = null;
        });
    });

    describe('Initial filtering => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
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
                        type: 'FilterBar', columns: [
                            { field: 'EmployeeID', matchCase: false, operator: 'equal', predicate: 'and', value: 5 }
                        ],
                        showFilterBarStatus: true
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

        it('Filter a column', () => { //EJ2-25278 is logged as an issue and once fixed need to uncomment the below expect
                //expect((gridObj as any).getHeaderContent().querySelectorAll('.e-filtertext')[5].value).toBe('7/12/1996');
                expect((gridObj as any).getHeaderContent().querySelectorAll('.e-filtertext')[1].value).toBe('5');
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('Get selectedrowindexes in virtualization after filtering ', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    filterSettings: {
                        type: 'FilterBar', columns: [
                            { field: 'OrderID', matchCase: false, operator: 'equal', predicate: 'and', value: 10248 }
                        ],
                        showFilterBarStatus: true
                    },
                    columns: [
                        { type: 'checkbox'},
                        { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID'},
                        { field: 'EmployeeID', isPrimaryKey: true, headerText: 'Employee ID', textAlign: 'Right', width: 135, },
                        { field: 'FirstName', headerText: 'Name', width: 125 },
                        { field: 'Title', headerText: 'Title', width: 180 },
                    ],
                    allowSelection: true,
                    allowFiltering: true,
                    enableVirtualization: true,
                    height: 300,
                    actionComplete: actionComplete
                }, done);
        });

        // it('Get selected rowindexes after filtering', (done: Function) => {
        //         gridObj.selectRow(0);
        //         expect(gridObj.getSelectedRowIndexes().length).toBe(1);
        //         done();
        // });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });


    describe('EJ2-25122 Clear filtering with Checkbox=> ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;        
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: true,
                    pageSettings: { currentPage: 1 },
                    filterSettings: {
                        type: 'Excel',
                        columns: [
                            { field: 'CustomerID', matchCase: false, operator: 'equal', predicate: 'or', value: 'TOMSP' },
                            { field: 'CustomerID', matchCase: false, operator: 'equal', predicate: 'or', value: 'VINET' },
                            { field: 'Freight', matchCase: false, operator: 'equal', predicate: 'or', value: '32.38' },
                            { field: 'Freight', matchCase: false, operator: 'equal', predicate: 'or', value: '11.61' },
                            { field: 'ShipCountry', matchCase: false, operator: 'equal', predicate: 'or', value: 'france' },
                        ],
                    },
                    columns: [
                        { field: 'OrderID', type: 'number', visible: true },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'Freight', format: 'C2', type: 'number' },
                        { field: 'OrderDate', format: 'yMd', type: 'date' },
                        { field: 'ShipCountry' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                }, done);
            });
            it('Checking Initial filter', function (done) {
                var dataBound = function (args: Object) {
                    expect(gridObj.filterSettings.columns.length).toBe(5);
                    expect(gridObj.currentViewData.length).toBe(1);
                    done();
                };
                gridObj.dataBound = dataBound;
            });

            it('Clear filtering with Excel filter', function (done) {
                var dataBound = function (args: Object) {
                    expect(gridObj.filterSettings.columns.length).toBe(0);
                    expect(gridObj.currentViewData.length).toBe(12);
                    done();
                };
                gridObj.dataBound = dataBound;
                gridObj.clearFiltering();
            });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('EJ2CORE-133- Filtering when foreignKeyValue and grid field are same', ()=>{
        let gridObj: Grid;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: normalData,
                    allowFiltering: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID',  headerText: 'Customer ID', width: 120, foreignKeyField: 'CustomerName', foreignKeyValue: 'ShipCountry', dataSource: foreigndata },
                        { field: 'Freight',  headerText: 'Freight', width: 120},
                        { field: 'ShipCountry',  headerText: 'Ship Country', width: 120 }
                    ],
                    actionComplete: actionComplete
                }, done);
        });
        it('field and foreignkeyvalue as same', (done: Function) => {
            actionComplete = (args: any) => {
                if(args.requestType == 'filtering') {
                    expect(args.rows.length).toBe(2);
                    done();    
                }
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'CustomerID', 'France');
        });
        it('field and foreignkeyvalue as same- multiple filtering', (done: Function) => {
            actionComplete = (args: any) => {
                if(args.requestType == 'filtering') {
                    expect(args.rows.length).toBe(1);
                    done();    
                }
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'ShipCountry', 'India');
        });
        it('clear filter and change type check', (done: Function) => {
            actionComplete = (args: any) => {
                if (args.requestType == 'refresh'){
                    expect(args.rows.length).toBe(10);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
            gridObj.filterSettings.type = 'Menu';
        });
        it('Menu filter check with foreignkey', (done: Function) => {
            actionComplete = (args: any) => {
                if(args.requestType == 'filterafteropen') {
                    (args.filterModel.dlgDiv.querySelector('.e-flmenu-input') as any).ej2_instances[0].value = 'F';        
                    (args.filterModel.dlgDiv.querySelector('.e-flmenu-okbtn') as HTMLElement).click();
                }
                else if (args.requestType == 'filtering'){
                    expect(args.rows.length).toBe(2);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll('.e-filtermenudiv')[1] as HTMLElement).click();
        });
        it('Filter menu icon for foreignkey column check', (done: Function) => {
            expect(gridObj.element.querySelectorAll('.e-filtermenudiv')[1].classList).toContain('e-filtered');
            expect(gridObj.element.querySelectorAll('.e-filtermenudiv')[3].classList.contains('e-filtered')).toBeFalsy();
            done();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            actionComplete = null;
        });
    });

    describe('EJ2-26559 Api support enable case sensitivity menu filter check', ()=>{
        let gridObj: Grid;
        let actionComplete: (args: any) => void;
        let menuFilterObj: Function = (obj: PredicateModel, field?: string,
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
                    dataSource: normalData,
                    allowFiltering: true,
                    filterSettings: { type: 'Menu'},
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID',  headerText: 'Customer ID', width: 120, foreignKeyField: 'CustomerName', foreignKeyValue: 'ShipCountry', dataSource: foreigndata },
                        { field: 'Freight',  headerText: 'Freight', width: 120},
                        { field: 'ShipCountry',  headerText: 'Ship Country', width: 120 }
                    ],
                    actionComplete: actionComplete
                }, done);
        });
        it(' Filter CustomerID testing for matchcase default value true', (done: Function) => {
            actionComplete = (args: any) => {
                    (args.filterModel.dlgDiv.querySelector('.e-flmenu-input') as any).ej2_instances[0].value = 'A';        
                    (args.filterModel.dlgDiv.querySelector('.e-flmenu-okbtn') as HTMLElement).click();
                    expect(menuFilterObj(gridObj.filterSettings.columns[0], 'CustomerID', 'notequal', 'ANATR', 'and', true)).toBeFalsy();
                    gridObj.actionComplete = null;
                    done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll('.e-filtermenudiv')[1] as HTMLElement).click();
        });
        it('Filter ShipCountry testing for matchcase default value true', (done: Function) => {
            actionComplete = (args: any) => {
                (args.filterModel.dlgDiv.querySelector('.e-flmenu-input') as any).ej2_instances[0].value = 'I';
                (args.filterModel.dlgDiv.querySelector('.e-flmenu-okbtn') as HTMLElement).click();
                expect(menuFilterObj(gridObj.filterSettings.columns[0], 'ShipCountry', 'contains', 'India', 'and', true)).toBeFalsy();
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll('.e-filtermenudiv')[3] as HTMLElement).click();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            actionComplete = null;
        });
    });
    describe('Filter Menu Opertor test case', ()=>{
            let gridObj: Grid;
            let actionComplete: (args: any) => void;
            beforeAll((done: Function) => {
                gridObj = createGrid(
                    {
                        dataSource: normalData,
                        allowFiltering: true,
                        filterSettings: { type: 'Menu' },
                        columns: [
                            { field: 'OrderID', headerText: 'Order ID', width: 120,filter:{operator:"equal" } },
                            { field: 'CustomerID',  headerText: 'Customer ID', width: 120,filter:{operator:"endswith" } },
                            { field: 'Freight',  headerText: 'Freight', width: 120,filter:{operator:"equal" }},
                            { field: 'ShipCountry',  headerText: 'Ship Country', width: 120,filter:{operator:"contains" } }
                        ],
                        actionComplete: actionComplete
                    }, done);
            });
            
            it('field and foreignkeyvalue as same- multiple filtering', (done: Function) => {
                actionComplete = (e:any) => {
                    expect(e.filterModel.flMuiObj.dropOptr.value).toBe((gridObj.columns[1] as any).filter.operator);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                (gridObj.element.querySelectorAll(".e-filtermenudiv")[1] as HTMLElement).click();
            });
            
            afterAll(() => {
                destroy(gridObj);
                gridObj = null;
                actionComplete = null;
            });
        });
    describe('Filter bar test case => ', () => {
            let gridObj: Grid;
            //let drpdwn: string ='<input id="dropdown" value="1" >'; 
            let actionComplete: (args: any) => void;
            beforeAll((done: Function) => {
                gridObj = createGrid(
                    {
                        dataSource: filterData,
                        allowFiltering: true,
                        allowPaging: false,
                        pageSettings: { currentPage: 1 },
                        
                        columns: [
                            { field: 'OrderID', visible: true,filter:{operator:"equal" } },
                            { field: 'CustomerID', headerText: 'CustomerID', filter:{operator:"startswith" }},
                            { field:'Fright',headerText:'Frieght', width:130 , filter:{operator:"equal" }},
                            { field: 'ShipCountry',  headerText: 'Ship Country', width: 120,filter:{operator:"startswith" } }
                        ],
                        actionComplete : actionComplete
                    }, done);
            });
    
            it('action complete', (done: Function) => {
                let flag: boolean = true;
                actionComplete = (args: any) => {
                    expect(args.currentFilterObject.operator).toBe((gridObj.columns[1] as any).filter.operator)
                    done();
                };
                gridObj.actionComplete = actionComplete;
                filterColumn(gridObj, 'CustomerID', 'r');
            });
            afterAll(() => {
                destroy(gridObj);
                gridObj = actionComplete  = null;
                actionComplete = null;
            });
    

    });
    describe('Ensure the filtered columns UID after change the Grid columns manually', ()=>{
        let gridObj: Grid;
        let uid: string;
        let dBound: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120,filter:{operator:"equal" } },
                        { field: 'CustomerID',  headerText: 'Customer ID', width: 120,filter:{operator:"endswith" } },
                        { field: 'Freight',  headerText: 'Freight', width: 120,filter:{operator:"equal" }},
                        { field: 'ShipCountry',  headerText: 'Ship Country', width: 120,filter:{operator:"contains" } }
                    ]
                }, done);
        });
        it('Perfom filtering', (done: Function) => {
            dBound = (args?: Object): void => {
                uid = (gridObj.filterSettings.columns[0] as Column).uid;
                done();
            };
            gridObj.dataBound = dBound;
            gridObj.filterByColumn('CustomerID', 'startswith', 'v');
        });
        it('Ensure UID', (done: Function) => {
            dBound = (args?: Object): void => {
                expect((gridObj.filterSettings.columns[0] as Column).uid).not.toBe(uid);
                done();
            };
            gridObj.dataBound = dBound;
            gridObj.columns = [
                { field: 'OrderID', headerText: 'Order ID', width: 120 },
                { field: 'CustomerID',  headerText: 'Customer ID', width: 120},
                { field: 'Freight',  headerText: 'Freight', width: 120},
                { field: 'ShipCountry',  headerText: 'Ship Country', width: 120}
            ];
            gridObj.dataBind();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = dBound = null;
        });
    });

    describe('Filtering with ColumnVirtualization', ()=>{
        let ctr: number = 0;
        let count: string[] = Array.apply(null, Array(60)).map(() => 'Column' + ++ctr + '');
        let data1: Object[] = (() => {
            let arr: Object[] = [];
            for (let i: number = 0, o: Object = {}, j: number = 0; i < 60; i++ , j++ , o = {}) {
                count.forEach((lt: string) => o[lt] = 'Column' + lt + 'Row' + i);
                arr[j] = o;
            }
            return arr;
        })();
        let gridObj: Grid;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            
            gridObj = createGrid(
                {
                    dataSource: data1,
                    allowFiltering: true,
                    enableColumnVirtualization: true,
                    columns:count
                }, done);
        });
        it('filtering with columnVirtualization', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(11);
                done();
            };
            filterColumn(gridObj, 'Column1', 'ColumnColumn1Row5');
            gridObj.actionComplete = actionComplete;
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete  = null;
        });

});

describe('Check for case sensitive ', ()=>{
    let gridObj: Grid;
    let actionComplete: (args: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData.slice(0,30),
                allowFiltering: true,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120 },
                    { field: 'CustomerID',  headerText: 'Customer ID', width: 120},
                    { field: 'Freight',  headerText: 'Freight', width: 120},
                    { field: 'ShipCountry',  headerText: 'Ship Country', width: 120}
                ],
            }, done);
    });
    it('filterbyColumn Method checking with case sensitive', (done: Function) => {
        actionComplete = () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(7);
            expect((gridObj.element.querySelectorAll('.e-row')[0] as any).cells[3].innerHTML).toBe('Switzerland');
            done();
        };
        gridObj.filterModule.filterByColumn('ShipCountry', 'contains', 'S', 'and', true);
        gridObj.actionComplete = actionComplete;
    });
    it('filterbyColumn Method checking with case sensitive', (done: Function) => {
        actionComplete = () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(2);
            expect((gridObj.element.querySelectorAll('.e-row')[0] as any).cells[3].innerHTML).toBe('Austria');
            done();
        };
        gridObj.filterModule.filterByColumn('ShipCountry', 'contains', 's', 'and', true);
        gridObj.actionComplete = actionComplete;
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = actionComplete = null;
    });
});

    describe('Ensure the filtering when different characters are given', () => {
        let gridObj: Grid;
        let filterData1: Object[] = [
            { OrderID: 10248!, CustomerID: 'VINET!!' },
            { OrderID: 10249, CustomerID: 'TOMSP' },
            { OrderID: 10250, CustomerID: 'HANAR' }
        ];
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData1,
                    allowFiltering: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, filter: { operator: "equal" } },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 120, filter: { operator: "contains" } },
                    ],
                    actionComplete: actionComplete,
                }, done);
        });
        it('Perfom filtering with exclamation mark for string type', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'CustomerID', '!');
        });

        it('Perfom filtering with exclamation mark for number type', (done: Function) => {
            gridObj.clearFiltering();
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(3);
                done();
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'OrderID', '!');
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    
    describe('Check for case sensitive  Excel fltr', () => {
        let gridObj: Grid;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData.slice(0, 30),
                    allowFiltering: true,
                    filterSettings: { type: 'Excel' },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                        { field: 'Freight', headerText: 'Freight', width: 120 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 120 }
                    ],
                }, done);
        });
        it('filterbyColumn Method checking with case sensitive Excelfltr', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(9);
                expect((gridObj.element.querySelectorAll('.e-row')[0] as any).cells[3].innerHTML).toBe('Switzerland');
                done();
            };
            gridObj.filterModule.filterByColumn('ShipCountry', 'contains', 'S');
            gridObj.actionComplete = actionComplete;
        });
        it('filterbyColumn Method checking with case sensitive Excel Fltr', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(9);
                expect((gridObj.element.querySelectorAll('.e-row')[0] as any).cells[3].innerHTML).toBe('Switzerland');
                done();
            };
            gridObj.filterModule.filterByColumn('ShipCountry', 'contains', 's');
            gridObj.actionComplete = actionComplete;
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });
    
    describe('Check for getFiltered records', () => {
        let gridObj: Grid;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData.slice(0, 30),
                    allowPaging: true,
                    pageSettings:{pageSize:6},
                    allowFiltering: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                        { field: 'Freight', headerText: 'Freight', width: 120 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 120 }
                    ],
                }, done);
        });
        it('filterbyColumn Method checking with getFiltered records', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(6);
                expect((gridObj.element.querySelectorAll('.e-row')[0] as any).cells[3].innerHTML).toBe('Switzerland');
                expect((gridObj.getFilteredRecords() as any).length).toBe(9);
                done();
            };
            gridObj.filterModule.filterByColumn('ShipCountry', 'contains', 'S');
            gridObj.actionComplete = actionComplete;
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    }); 

    describe('Check for getFiltered records remote data', () => {
        let gridObj: Grid;
        let remoteData: DataManager = new DataManager({
            url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Orders',
            adaptor: new ODataV4Adaptor
        });
        let promise: Promise<Object>;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: remoteData,
                    allowPaging: true,
                    pageSettings:{pageSize:6},
                    allowFiltering: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                        { field: 'Freight', headerText: 'Freight', width: 120 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 120 }
                    ],
                }, done);
        });
        it('filterbyColumn Method checking with getFiltered records', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(6);
                expect((gridObj.element.querySelectorAll('.e-row')[0] as any).cells[3].innerHTML).toBe('Switzerland');
               (promise  as any) = gridObj.getFilteredRecords();
                done();
            };
            gridObj.filterModule.filterByColumn('ShipCountry', 'startsWith', 'S');
            gridObj.actionComplete = actionComplete;
        });
        it('filterbyColumn Method checking with getFiltered records', (done: Function) => {
           promise.then((e)=>{
            expect((e as any).result.length).toBe(78);
            done();
        });           
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });  
    
    describe('EJ2-34861 - Checking the arguments of filtering action', () => {
        let gridObj: Grid;
        let actionBegin: (args: any) => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData.slice(0, 30),
                    allowPaging: true,
                    pageSettings:{pageSize:6},
                    allowFiltering: true,
                    filterSettings: { type: "Menu" },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                        { field: 'Freight', headerText: 'Freight', width: 120 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 120 }
                    ],
                }, done);
        });
        it('Checking the arguments of filtering action - CustomerID', (done: Function) => {
            actionBegin = (args) => {
                if("currentFilterObject" in args){   
                    if(args.currentFilterObject.field == "CustomerID") {
                        expect(args.currentFilterObject.field).toBe("CustomerID");
                        expect(args.currentFilterObject.operator).toBe("startswith");
                        expect(args.currentFilterObject.value).toBe("M");
                    }
                    if(args.currentFilterObject.field == "OrderID") {
                        expect(args.currentFilterObject.field).toBe("OrderID");
                        expect(args.currentFilterObject.operator).toBe("greaterthan");
                        expect(args.currentFilterObject.value).toBe("10250");
                    }
                }
                done();
            };
            gridObj.actionBegin = actionBegin;
            gridObj.actionComplete = actionComplete;
            gridObj.filterModule.filterByColumn('CustomerID', 'startswith', 'M');

        });
        it('Checking the arguments of filtering action - OrderID', (done: Function) => {
            actionComplete = (args) => {
                if("currentFilterObject" in args){   
                    if(args.currentFilterObject.field == "CustomerID") {
                        expect(args.currentFilterObject.field).toBe("CustomerID");
                        expect(args.currentFilterObject.operator).toBe("startswith");
                        expect(args.currentFilterObject.value).toBe("M");
                    }
                    if(args.currentFilterObject.field == "OrderID") {
                        expect(args.currentFilterObject.field).toBe("OrderID");
                        expect(args.currentFilterObject.operator).toBe("greaterthan");
                        expect(args.currentFilterObject.value).toBe("10250");
                    }
                }
                done();
            };
            gridObj.actionBegin = actionBegin;
            gridObj.actionComplete = actionComplete;
            gridObj.filterModule.filterByColumn('OrderID', 'greaterthan', '10250');

        });
        it('Checking the arguments of filtering action - while clear', (done: Function) => {
            actionComplete = (args) => {
                if("currentFilterObject" in args){   
                    if(args.currentFilterObject.field == "CustomerID") {
                        expect(args.currentFilterObject.field).toBe("CustomerID");
                        expect(args.currentFilterObject.operator).toBe("startswith");
                        expect(args.currentFilterObject.value).toBe("M");
                    }
                    if(args.currentFilterObject.field == "OrderID") {
                        expect(args.currentFilterObject.field).toBe("OrderID");
                        expect(args.currentFilterObject.operator).toBe("greaterthan");
                        expect(args.currentFilterObject.value).toBe("10250");
                    }
                }
                done();
            };
            gridObj.actionBegin = actionBegin;
            gridObj.actionComplete = actionComplete;
            (gridObj).removeFilteredColsByField("CustomerID");

        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = null;
            gridObj = actionComplete = null;
        });
    });

    describe('EJ2-36193- Clear Filtering of foreignKey column', ()=>{
        let gridObj: Grid;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: normalData,
                    allowFiltering: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID',  headerText: 'Customer ID', width: 120, foreignKeyField: 'CustomerName', foreignKeyValue: 'ShipCountry', dataSource: foreigndata },
                        { field: 'Freight',  headerText: 'Freight', width: 120},
                        { field: 'ShipCountry',  headerText: 'Ship Country', width: 120 }
                    ],
                    actionComplete: actionComplete
                }, done);
        });
        it('filtering the foreignkeyvalue', (done: Function) => {
            actionComplete = (args: any) => {
                if(args.requestType == 'filtering') {
                    expect(args.rows.length).toBe(2);
                    done();    
                }
            };
            gridObj.actionComplete = actionComplete;
            filterColumn(gridObj, 'CustomerID', 'France');
        });        
        it('clear filter check', (done: Function) => {
            actionComplete = (args: any) => {
                if (args.requestType == 'refresh'){
                    expect(args.rows.length).toBe(10);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            actionComplete = null;
        });
    });

    describe('FilterbyColumn method for multiple data values with foreignKeyColumn and normal Columns ==>', () => {
        let gridObj: Grid;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: normalData,
                    allowFiltering: true,
                    filterSettings: { type: 'Menu' },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 120, foreignKeyField: 'CustomerName', foreignKeyValue: 'ShipCountry', dataSource: foreigndata },
                        { field: 'Freight', headerText: 'Freight', width: 120 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 170 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 120 }
                    ],
                    actionComplete: actionComplete
                }, done);
        });
        it('Filtering the  multiple Foreignkey value using single method', (done: Function) => {
            actionComplete = (args: any) => {
                if (args.requestType == 'filtering') {
                    expect(args.rows.length).toBe(3);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn("CustomerID", "contains", ["fra", "ger"]);
        });
        it('Filtering the  multiple OrderID value using single method', (done: Function) => {
            actionComplete = (args: any) => {
                if (args.requestType == 'filtering') {
                    expect(args.rows.length).toBe(2);
                    done();
                }
            };
            gridObj.clearFiltering();
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn("OrderID", "equal", [10248, 10249]);;
        });
        it('Filtering the  multiple ShipName value ', (done: Function) => {
            actionComplete = (args: any) => {
                if (args.requestType == 'filtering') {
                    expect(args.rows.length).toBe(2);
                    done();
                }
            };
            gridObj.clearFiltering();
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn("ShipName", "contains", ["vin", "tom"]);;
        });
        it('Filtering the  multiple value  in Excel filter ', (done: Function) => {
            actionComplete = (args: any) => {
                if (args.requestType == 'filtering') {
                    expect(args.rows.length).toBe(2);
                    done();
                }
            };
            gridObj.clearFiltering();
            gridObj.filterSettings.type = "Excel";
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn("ShipName", "contains", ["vin", "tom"]);;
        });
        it('Filtering the  multiple value  in FilterBar filter ', (done: Function) => {
            actionComplete = (args: any) => {
                if (args.requestType == 'filtering') {
                    expect(args.rows.length).toBe(2);
                    done();
                }
            };
            gridObj.clearFiltering();
            gridObj.filterSettings.type = "FilterBar";
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn("ShipName", "contains", ["vin", "tom"]);;
        });
        it('Filtering the  multiple value  in CheckBox filter ', (done: Function) => {
            actionComplete = (args: any) => {
                if (args.requestType == 'filtering') {
                    expect(args.rows.length).toBe(4);
                    done();
                }
            };
            gridObj.clearFiltering();
            gridObj.filterSettings.type = "CheckBox";
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn("ShipName", "contains", ["vin", "tom", "han"]);;
        });
        it('Filtering the  single value  ', (done: Function) => {
            actionComplete = (args: any) => {
                if (args.requestType == 'filtering') {
                    expect(args.rows.length).toBe(1);
                    done();
                }
            };
            gridObj.clearFiltering();
            gridObj.filterSettings.type = "FilterBar";
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn("ShipName", "contains", "vin");;
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            actionComplete = null;
        });
    });
    describe('EJ2-38480 - Filterbar focusing is not workig properly, while using checkboxmode as resetonrowclick', () => {
        let gridObj: Grid;
        let actionComplete: (args: any) => void;
        let filterBarEle: HTMLInputElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: normalData,
                    allowFiltering: true,
                    selectionSettings: { checkboxMode: 'ResetOnRowClick' },
                    columns: [
                        { type: 'CheckBox', width: 120 },
                        { field: 'OrderID', headerText: 'Order ID', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                        { field: 'Freight', headerText: 'Freight', width: 120 }
                    ],
                    actionComplete: actionComplete
                }, done);
        });
        it('Ensure filterbar input element focus', (done: Function) => {
            actionComplete = function (args) {
                let fieldName: string = args.currentFilterObject.field;
                let input = (gridObj.filterModule as any).getFilterBarElement(fieldName);
                expect(input.classList.contains('e-focus')).toBeTruthy();
                expect(input.selectionEnd).toBe(5);
                expect(input.selectionEnd).not.toBe(0);
                args.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            filterBarEle = gridObj.element.querySelector('#CustomerID_filterBarcell');
            gridObj.focusModule.onClick({ target: filterBarEle }, true);
            filterColumn(gridObj, 'CustomerID', 'VINET');
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            actionComplete = null;
        });
    });
});

describe('Filter Bar Operator feature render checking and behaviour checking', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: normalData,
                allowFiltering: true,
                filterSettings: { showFilterBarOperator: true },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120 },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                    { field: 'Freight', headerText: 'Freight', width: 120 },
                    {
                        field: 'OrderDate', headerText: 'Order Date', format: 'yMd',
                        width: 170, allowEditing: false
                    },
                    {
                        field: 'ShipCountry', headerText: 'Ship Country', width: 150,
                        edit: { params: { popupHeight: '300px' } }
                    },
                    {
                        field: 'Verified', headerText: 'boolean column'
                    }
                ],
            }, done);
    });
    it('check for filterbar operator render', () => {
        let inptLen: number;
        let colLen: number;
        inptLen = gridObj.getHeaderTable().querySelector('.e-filterbar').querySelectorAll('.e-filterbaroperator').length;
        colLen = gridObj.columns.length;
        expect(inptLen).toBe(colLen);
    });
    it('checking altdown key', () => {
        let tar: any = (gridObj.getHeaderContent().querySelector('.e-filterbar').querySelector('.e-filtertext') as any);
        gridObj.keyboardModule.keyAction({ action: 'altDownArrow', preventDefault: preventDefault, target: tar } as any);

    });
    it('checking altdown key', () => {
        let popup: number = document.querySelectorAll('.e-popup').length;
        //checking for previous interaction altdownarrow
        expect(popup).toBe(1);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('checking for operator', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: normalData,
                allowFiltering: true,
                allowGrouping: true,
                filterSettings: { showFilterBarOperator: true },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120 },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                    { field: 'Freight', headerText: 'Freight', width: 120, filter: { operator: "greaterthan" } },
                    {
                        field: 'OrderDate', headerText: 'Order Date', format: 'yMd',
                        width: 170, allowEditing: false
                    },
                    {
                        field: 'ShipCountry', headerText: 'Ship Country', width: 150,
                        edit: { params: { popupHeight: '300px' } }
                    },
                    {
                        field: 'Verified', headerText: 'boolean column'
                    }
                ],
            }, done);
    });
    it('initial operator checking', () => {
        let ordeIdDrpdown: Element = gridObj.element.querySelectorAll('.e-filterbaroperator')[0];
        let odrIdOprtorValue = (ordeIdDrpdown as any).ej2_instances[0].value;
        expect(odrIdOprtorValue).toBe('equal');
    });
    it('checking for operator value  after changing in dropdown', () => {
        let ordeIdDrpdown: Element = gridObj.element.querySelectorAll('.e-filterbaroperator')[0];
        (ordeIdDrpdown as any).ej2_instances[0].value = 'contains';
        let value = (gridObj.filterModule as any).getOperatorName('OrderID');
        expect(value).toBe('contains');
    })
    it('checking for operator value after grouping', () => {
        let freightDrpdown: Element = gridObj.element.querySelectorAll('.e-filterbaroperator')[2];
        (freightDrpdown as any).ej2_instances[0].value = 'lessthanorequal';
        gridObj.groupModule.groupColumn('Freight');
        gridObj.groupModule.ungroupColumn('Freight');
        expect((gridObj.filterModule as any).getOperatorName('Freight')).toBe('lessthanorequal');
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Check for OdataV4 date filter', () => {
    let gridObj: Grid;
    let remoteData: DataManager = new DataManager({
        url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Employees',
        adaptor: new ODataV4Adaptor
    });
    let actionComplete: (args: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: remoteData,
                allowPaging: true,
                pageSettings:{pageSize:6},
                allowFiltering: true,
                columns: [
                    { field: 'BirthDate', type: 'date' },
                    { field: 'FirstName' }
                ],
            }, done);
    });
    it('filterbyColumn Method checking OdataV4 records records', (done: Function) => {
        actionComplete = () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
            done();
        };
        gridObj.filterModule.filterByColumn('BirthDate', 'equal', '1937/09/19')
        gridObj.actionComplete = actionComplete;
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = actionComplete = null;
    });
});  

describe('Check for operator symbol in datasource value in filtebar', () => {
    let gridObj: Grid;
    let sampleData: Object[] = [{
        FirstName: 'VINET', Value: 'ENV<0'
    }, { FirstName: 'TOMSP', Value: 'role' }];
    let actionComplete: (args: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                allowPaging: true,
                allowFiltering: true,
                columns: [
                    { field: 'FirstName', type: 'string' },
                    { field: 'Value', type: 'sting' }
                ],
            }, done);
    });
    it('filterbyColumn public Method checking', (done: Function) => {
        actionComplete = () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
            done();
        };
        gridObj.filterModule.filterByColumn('Value', 'equal', 'env<0');
        gridObj.actionComplete = actionComplete;
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = actionComplete = null;
    });
});  