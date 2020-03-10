/**
 * Grid Sorting spec document
 */
import { Browser } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { SortSettingsModel } from '../../../src/grid/base/grid-model';
import { Sort } from '../../../src/grid/actions/sort';
import { Filter } from '../../../src/grid/actions/filter';
import { Freeze } from '../../../src/grid/actions/freeze';
import { Page } from '../../../src/grid/actions/page';
import { Group } from '../../../src/grid/actions/group';
import { data } from '../base/datasource.spec';
import { createGrid, destroy, getClickObj, getKeyActionObj } from '../base/specutil.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Column } from '../../../src/grid/models/column';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

Grid.Inject(Sort, Page, Filter, Group, Freeze);

describe('Sorting module => ', () => {

    describe('Sorting functionalities => ', () => {
        let gridObj: Grid;
        let actionBegin: (e?: any) => void;
        let actionComplete: (e?: any) => void;
        let cols: any
        let sortSettings: SortSettingsModel;

        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowSorting: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 5 },
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });
        it('Single sort orderID asc testing', (done: Function) => {
            actionComplete = (args: any): any => {
                expect(cols[0].querySelectorAll('.e-ascending').length).toBe(1);
                expect(sortSettings.columns[0].field).toBe('OrderID');
                expect(sortSettings.columns[0].direction).toBe('Ascending');
                expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toBe(0);
                done();
            };
            actionBegin = (args: any): any => {
                expect(args.target).not.toBeNull();
            };
			gridObj.actionBegin = actionBegin;
            gridObj.actionComplete = actionComplete;
            sortSettings = gridObj.sortSettings;
            cols = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            (gridObj as any).mouseClickHandler(getClickObj(cols[0]));
        });
        it('Single sort orderID des testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(cols[0].querySelectorAll('.e-descending').length).toBe(1);
                expect(sortSettings.columns[0].field).toBe('OrderID');
                expect(sortSettings.columns[0].direction).toBe('Descending');
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).mouseClickHandler(getClickObj(cols[0]));
        });
        it('Single sort CustomerID asc testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(cols[1].querySelectorAll('.e-ascending').length).toBe(1);
                expect(sortSettings.columns[0].field).toBe('CustomerID');
                expect(sortSettings.columns[0].direction).toBe('Ascending');
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).mouseClickHandler(getClickObj(cols[1]));
        });
        it('Single sort CustomerID des testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(cols[1].querySelectorAll('.e-descending').length).toBe(1);
                expect(sortSettings.columns[0].field).toBe('CustomerID');
                expect(sortSettings.columns[0].direction).toBe('Descending');
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).mouseClickHandler(getClickObj(cols[1]));
        });
        it('clear sorting', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(cols[0].parentElement.querySelectorAll('.e-sortnumber').length).toBe(0);
                expect(cols[0].parentElement.querySelectorAll('.e-ascending').length).toBe(0);
                expect(cols[0].parentElement.querySelectorAll('.e-descending').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSorting();
        });
        it('Disabled sort asc testing', () => {
            gridObj.allowSorting = false;
            gridObj.dataBind();
            (gridObj as any).mouseClickHandler(getClickObj(cols[0]));
            expect(cols[0].parentElement.querySelectorAll('.e-ascending').length).toBe(0);
            expect(sortSettings.columns.length).toBe(0);
        });
        it('Disabled sort des testing', () => {
            (gridObj as any).mouseClickHandler(getClickObj(cols[0]));
            expect(cols[0].parentElement.querySelectorAll('.e-descending').length).toBe(0);
            expect(sortSettings.columns.length).toBe(0);
        });
        it('OrderID asc testing', (done: Function) => {
            gridObj.allowSorting = true;
            gridObj.dataBind();
            actionComplete = (args: Object): void => {
                expect(cols[0].querySelectorAll('.e-ascending').length).toBe(1);
                expect(sortSettings.columns[0].field).toBe('OrderID');
                expect(sortSettings.columns[0].direction).toBe('Ascending');
                expect(cols[0].parentElement.querySelectorAll('.e-sortnumber').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).mouseClickHandler(getClickObj(cols[0]));
        });
        it('Multisort OrderID and CustomerID testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(cols[0].querySelectorAll('.e-ascending').length).toBe(1);
                expect(cols[1].querySelectorAll('.e-ascending').length).toBe(1);
                expect(sortSettings.columns[0].field).toBe('OrderID');
                expect(sortSettings.columns[0].direction).toBe('Ascending');
                expect(sortSettings.columns[1].field).toBe('CustomerID');
                expect(sortSettings.columns[1].direction).toBe('Ascending');
                expect(cols[0].parentElement.querySelectorAll('.e-sortnumber').length).toBe(2);
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).mouseClickHandler(getClickObj(cols[1], true));
        });
        it('Multisort OrderID and CustomerID des testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(cols[0].querySelectorAll('.e-ascending').length).toBe(1);
                expect(cols[1].querySelectorAll('.e-ascending').length).toBe(0);
                expect(cols[1].querySelectorAll('.e-descending').length).toBe(1);
                expect(sortSettings.columns[0].field).toBe('OrderID');
                expect(sortSettings.columns[0].direction).toBe('Ascending');
                expect(sortSettings.columns[1].field).toBe('CustomerID');
                expect(sortSettings.columns[1].direction).toBe('Descending');
                expect(cols[0].parentElement.querySelectorAll('.e-sortnumber').length).toBe(2);
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).mouseClickHandler(getClickObj(cols[1], true));
        });
        it('Multisort OrderID, CustomerID des, EmployeeID testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(cols[0].querySelectorAll('.e-ascending').length).toBe(1);
                expect(cols[1].querySelectorAll('.e-descending').length).toBe(1);
                expect(cols[2].querySelectorAll('.e-ascending').length).toBe(1);
                expect(sortSettings.columns[0].field).toBe('OrderID');
                expect(sortSettings.columns[0].direction).toBe('Ascending');
                expect(sortSettings.columns[1].field).toBe('CustomerID');
                expect(sortSettings.columns[1].direction).toBe('Descending');
                expect(sortSettings.columns[2].field).toBe('EmployeeID');
                expect(sortSettings.columns[2].direction).toBe('Ascending');
                expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toBe(3);
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).mouseClickHandler(getClickObj(cols[2], true));
        });
        it('Disable multisort des testing', (done: Function) => {
            gridObj.allowSorting = true;
            gridObj.allowMultiSorting = false;
            actionComplete = (args: Object): void => {
                expect(cols[0].querySelectorAll('.e-ascending').length).toBe(0);
                expect(cols[1].querySelectorAll('.e-descending').length).toBe(0);
                expect(cols[2].querySelectorAll('.e-descending').length).toBe(1);
                expect(sortSettings.columns[0].field).toBe('EmployeeID');
                expect(sortSettings.columns[0].direction).toBe('Descending');
                expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).mouseClickHandler(getClickObj(cols[2], true));
        });
        it('Clear sorting', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(cols[0].parentElement.querySelectorAll('.e-sortnumber').length).toBe(0);
                expect(cols[0].parentElement.querySelectorAll('.e-ascending').length).toBe(0);
                expect(cols[0].parentElement.querySelectorAll('.e-descending').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSorting();
        });
        it('Single sort column method testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(cols[0].querySelectorAll('.e-ascending').length).toBe(1);
                expect(sortSettings.columns[0].field).toBe('OrderID');
                expect(sortSettings.columns[0].direction).toBe('Ascending');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.sortColumn('OrderID', 'Ascending', false);
        });
        it('Multisort column method testing', (done: Function) => {
            gridObj.allowMultiSorting = true;
            actionComplete = (args: Object): void => {
                expect(cols[0].querySelectorAll('.e-ascending').length).toBe(1);
                expect(cols[1].querySelectorAll('.e-descending').length).toBe(1);
                expect(sortSettings.columns[0].field).toBe('OrderID');
                expect(sortSettings.columns[0].direction).toBe('Ascending');
                expect(sortSettings.columns[1].field).toBe('CustomerID');
                expect(sortSettings.columns[1].direction).toBe('Descending');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.sortColumn('CustomerID', 'Descending', true);
        });
        it('Multisort column - with same column', (done: Function) => {
            gridObj.allowMultiSorting = true;
            actionComplete = (args: Object): void => {
                expect(cols[0].querySelectorAll('.e-descending').length).toBe(1);
                expect(cols[0].querySelectorAll('.e-sortnumber').length).toBe(1);
                expect(cols[0].querySelector('.e-sortnumber').innerHTML).toBe('2');
                expect(cols[1].querySelectorAll('.e-sortnumber').length).toBe(1);
                expect(cols[1].querySelector('.e-sortnumber').innerHTML).toBe('1');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            gridObj.sortColumn('OrderID', 'Descending', true);
        });
        it('Remove sorted column by field method testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(cols[1].querySelectorAll('.e-descending').length).toBe(1);
                expect(sortSettings.columns[0].field).toBe('CustomerID');
                expect(sortSettings.columns[0].direction).toBe('Descending');
                gridObj.actionComplete = (e?: Object) => undefined;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.removeSortColumn('OrderID');
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = cols = sortSettings = null;
        });
    });

    describe('sort inital settings => ', () => {
        let gridObj: Grid;
        let cols: any;
        let sortSettings: SortSettingsModel;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowSorting: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 5 },
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    sortSettings: { columns: [{ field: 'OrderID', direction: 'Ascending' }, { field: 'CustomerID', direction: 'Ascending' }] },
                }, done);
        });
        it('Initial sort settings testing', () => {
            sortSettings = gridObj.sortSettings;
            cols = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(cols[0].querySelectorAll('.e-ascending').length).toBe(1);
            expect(cols[1].querySelectorAll('.e-ascending').length).toBe(1);
            expect(sortSettings.columns[0].field).toBe('OrderID');
            expect(sortSettings.columns[0].direction).toBe('Ascending');
            expect(sortSettings.columns[1].field).toBe('CustomerID');
            expect(sortSettings.columns[1].direction).toBe('Ascending');
            expect(cols[0].querySelectorAll('.e-sortnumber').length).toBe(1);
            expect(cols[1].querySelectorAll('.e-sortnumber').length).toBe(1);
            gridObj.sortModule.removeSortColumn('Freight');
        });
        //set model and default properties model check
        afterAll(() => {
            destroy(gridObj);
            gridObj = cols = sortSettings = null;
        });
    });

    describe('Sort with Grouping => ', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        let cols: any;
        let sortSettings: SortSettingsModel;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: true,
                    pageSettings: { pageSize: 5 },
                    allowSorting: true,
                    allowGrouping: true,
                    groupSettings: { showGroupedColumn: true },
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }]
                }, done);
        });
        // sort set model testing
        it('Sort a Column', (done: Function) => {
            sortSettings = gridObj.sortSettings;
            actionComplete = (args?: Object): void => {
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(1);
                expect(sortSettings.columns[0].field).toBe('Freight');
                expect(sortSettings.columns[0].direction).toBe('Ascending');
                expect((<any>gridObj.currentViewData[0]).Freight).toBe(3.05);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.sortColumn('Freight', 'Ascending', false);
        });
        it('Disable Allow Sorting', (done: Function) => {
            actionComplete = (args?: Object) => {
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(0);
                expect(sortSettings.columns.length).toBe(0);
                expect((<any>gridObj.currentViewData[0]).OrderID).toBe(10248);
                done();
            }
            gridObj.actionComplete = actionComplete;
            gridObj.allowSorting = false;
            gridObj.dataBind();

        });
        it('Enable Allow Sorting', (done: Function) => {
            actionComplete = (args?: Object) => {
                expect(gridObj.allowSorting).toBeTruthy();
                done();
            }
            gridObj.actionComplete = actionComplete;
            gridObj.allowSorting = true;
            gridObj.dataBind();

        });
        //check with sort and grouping - sort, group, sort, clear sort and group 
        it('Sort Column', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(1);
                expect((<any>gridObj.currentViewData[0]).Freight).toBe(3.05);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.sortColumn('Freight', 'Ascending', false);
        });
        it('Sort and Group testing', (done: Function) => {
            actionComplete = (args?: Object) => {
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending.e-icon-ascending').length).toBe(2);
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-sortnumber').length).toBe(2);
                done();
            }
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('EmployeeID');
        });
        it('Group with sort testing', (done: Function) => {
            actionComplete = (args?: Object) => {
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending.e-icon-ascending').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-sortnumber').length).toBe(2);
                done();
            }
            gridObj.actionComplete = actionComplete;
            gridObj.sortColumn('Freight', 'Descending');

        });
        it('Clear sorting', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-descending').length).toBe(0);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-sortnumber').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSorting();
        });
        it('remove Grouping', (done: Function) => {
            let actionComplete = (args: Object) => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(0);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-descending.e-icon-descending').length).toBe(0);
                done();
            }
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('EmployeeID');
        });

        it('tri-state Sorting testing - first', (done) => {
            let actionComplete = () => {
                expect(sortSettings.columns.length).toBe(1);
                expect(cols[0].querySelectorAll('.e-ascending').length).toBe(1);
                done();
            };
            cols = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            gridObj.actionComplete = actionComplete;
            (gridObj as any).mouseClickHandler(getClickObj(cols[0]));
        });

        it('tri-state Sorting testing - second', (done) => {
            let actionComplete = () => {
                expect(sortSettings.columns.length).toBe(1);
                expect(cols[0].querySelectorAll('.e-descending').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).mouseClickHandler(getClickObj(cols[0]));
        });

        it('tri-state Sorting testing - third', (done) => {
            let actionComplete = () => {
                expect(sortSettings.columns.length).toBe(0);
                expect(cols[0].querySelectorAll('.e-ascending').length).toBe(0);
                expect(cols[0].querySelectorAll('.e-descending').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).mouseClickHandler(getClickObj(cols[0]));
        });

        //set model and default properties model check
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = cols = sortSettings = null;
        });
    });

    describe('Grid popup testing', () => {
        let gridObj: Grid;
        let gridPopUp: HTMLElement;
        let spanElement: Element;
        let cols: any;
        let defaultBrowserAgent: string = Browser.userAgent;
        let actionComplete: (e?: Object) => void;
        let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        beforeAll((done: Function) => {
            Browser.userAgent = androidPhoneUa;
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowSorting: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 5 },
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity', allowSorting: false }],
                    actionComplete: actionComplete
                }, done);
        });

        it('gridPopUp display testing', () => {
            gridPopUp = gridObj.element.querySelector('.e-gridpopup') as HTMLElement;
            spanElement = gridPopUp.querySelector('span');
            cols = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(gridPopUp.style.display).toBe('none');
        });

        it('single sort testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridPopUp.style.display).toBe('');
                expect(spanElement.classList.contains('e-sortdirect')).toBeTruthy();
                expect(cols[0].querySelectorAll('.e-ascending').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).mouseClickHandler(getClickObj(cols[0]));
        });


        it('multi sort testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridPopUp.style.display).toBe('');
                expect(spanElement.classList.contains('e-sortdirect')).toBeTruthy();
                expect(cols[0].querySelectorAll('.e-ascending').length).toBe(1);
                expect(cols[1].querySelectorAll('.e-ascending').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).mouseClickHandler(getClickObj(spanElement));
            expect(spanElement.classList.contains('e-spanclicked')).toBeTruthy();
            (gridObj as any).mouseClickHandler(getClickObj(cols[1]));
        });

        it('gridpopup hide testing', () => {
            (gridObj as any).mouseClickHandler(getClickObj(spanElement));
            expect(gridPopUp.style.display).toBe('none');
        });

        afterAll(() => {
            Browser.userAgent = defaultBrowserAgent;
            destroy(gridObj)
            gridObj = gridPopUp = actionComplete = cols = spanElement = null;
        });
    });

    describe('Keyboard operation', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowSorting: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 5 },
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' },
                    { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }]
                }, done);
        });
        it('Pressing enter key', (done: Function) => {
            let flag: boolean = true;
            gridObj.actionComplete = (args: { requestType?: string }) => {
                if (!flag) { flag = !flag; return; }
                if (args.requestType === 'sorting') {
                    expect(gridObj.sortSettings.columns.length).toBeGreaterThan(0);
                    done();
                }
            };
            (gridObj as any).mouseClickHandler(getClickObj(gridObj.element.querySelector('.e-headercell')));
            gridObj.keyboardModule.keyAction(<any>getKeyActionObj('enter', (<any>gridObj.element.querySelector('.e-headercell'))));
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        })
    });

    describe('sort comparer', () => {
        let gridObj: Grid;
        let sortComparer = (reference: string,
            comparer:  string) => {
                if (reference < comparer) {
                    return -1;
                }
                if (reference > comparer) {
                    return 1;
                }
                return 0;
            };
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowSorting: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 5 },
                    columns: [{ field: 'OrderID', sortComparer: sortComparer }, { field: 'CustomerID' },
                    { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }]
                }, done);
        });

        it('Sort comparer check', (done: Function) => {
            spyOn(<Column>gridObj.columns[0], 'sortComparer');
            gridObj.actionComplete = () => {
                expect((<Column>gridObj.columns[0]).sortComparer).toHaveBeenCalled();
                gridObj.actionComplete = null;
                done();
            };
            gridObj.sortColumn('OrderID', 'Ascending');
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = sortComparer = null;
        })
    });

    describe('Sorting with Freeze pane', () => {
        let gridObj: Grid;
        let actionBegin: (e?: Object) => void;
        let actionComplete: (e?: Object) => void;
        let sortSettings: SortSettingsModel;
        let col1: Element;
        let col2: Element;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    frozenColumns: 2,
                    frozenRows: 2,
                    allowSorting: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 5 },
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('Single sort orderID asc testing', (done: Function) => {
            sortSettings = gridObj.sortSettings;
            actionComplete = (args: Object): void => {
                expect(col1.querySelectorAll('.e-ascending').length).toBe(1);
                expect(sortSettings.columns[0].field).toBe('OrderID');
                expect(sortSettings.columns[0].direction).toBe('Ascending');
                expect(col1.parentElement.querySelectorAll('.e-sortnumber').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            col1 = gridObj.getHeaderContent().querySelectorAll('.e-headercell')[0];
            (gridObj as any).mouseClickHandler(getClickObj(col1));
        });

        it('Single sort orderID des testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(col1.querySelectorAll('.e-descending').length).toBe(1);
                expect(sortSettings.columns[0].field).toBe('OrderID');
                expect(sortSettings.columns[0].direction).toBe('Descending');
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).mouseClickHandler(getClickObj(col1));
        });

        it('Single sort EmployeeID asc testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(col2.querySelectorAll('.e-ascending').length).toBe(1);
                expect(sortSettings.columns[0].field).toBe('EmployeeID');
                expect(sortSettings.columns[0].direction).toBe('Ascending');
                done();
            };
            gridObj.actionComplete = actionComplete;
            col2 = gridObj.getHeaderContent().querySelector('.e-movableheader').querySelectorAll('.e-headercell')[0];
            (gridObj as any).mouseClickHandler(getClickObj(col2));
        });

        it('Single sort EmployeeID des testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(col2.querySelectorAll('.e-descending').length).toBe(1);
                expect(sortSettings.columns[0].field).toBe('EmployeeID');
                expect(sortSettings.columns[0].direction).toBe('Descending');
                done();
            };
            gridObj.actionComplete = actionComplete;
            col2 = gridObj.getHeaderContent().querySelector('.e-movableheader').querySelectorAll('.e-headercell')[0];
            (gridObj as any).mouseClickHandler(getClickObj(col2));
        });

        it('Multisort OrderID and EmployeeID testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(col1.querySelectorAll('.e-ascending').length).toBe(1);
                expect(col2.querySelectorAll('.e-ascending').length).toBe(1);
                expect(sortSettings.columns[0].field).toBe('OrderID');
                expect(sortSettings.columns[0].direction).toBe('Ascending');
                expect(sortSettings.columns[1].field).toBe('EmployeeID');
                expect(sortSettings.columns[1].direction).toBe('Ascending');
                expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toBe(1);
                expect(gridObj.getHeaderContent().querySelector('.e-movableheader').querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj as any).mouseClickHandler(getClickObj(col1));
            (gridObj as any).mouseClickHandler(getClickObj(col2, true));
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

        afterAll((done) => {
            destroy(gridObj);
            setTimeout(function () {
                done();
            }, 1000);
            gridObj = actionBegin = actionComplete = sortSettings = col1 = col2 = null;
        });
    });

    describe('initial sorting with initial grouping => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowSorting: true,
                    sortSettings: { columns: [{ field: 'OrderID', direction: 'Descending' }] },
                    allowGrouping:true,
                    groupSettings: { columns: ['CustomerID'] },
                    allowPaging: true,
                    pageSettings: { pageSize: 5 },
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                }, done);
        });
        it('Initial sort settings testing', () => {
            gridObj.groupModule.ungroupColumn('CustomerID');
            (gridObj.element.querySelector('.e-columnheader .e-headercell') as any).click();
            expect(gridObj.sortSettings.columns.length).toBe(0);
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });


});
