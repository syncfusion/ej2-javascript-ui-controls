/**
 * Grid print spec document
 */
import { Grid } from '../../../src/grid/base/grid';
import { Sort } from '../../../src/grid/actions/sort';
import { Filter } from '../../../src/grid/actions/filter';
import { Page } from '../../../src/grid/actions/page';
import { Print } from '../../../src/grid/actions/print';
import { Group } from '../../../src/grid/actions/group';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { DetailRow } from '../../../src/grid/actions/detail-row';
import { data, employeeData, fCustomerData } from '../base/datasource.spec';
import { createGrid, destroy } from '../base/specutil.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { IGrid } from '../../../src/grid/base/interface'; 
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

Grid.Inject(Sort, Page, Filter, Print, Group, Toolbar, DetailRow);

describe('Print module', () => {
    describe('Print without paging', () => {
        let gridObj: Grid;
        let actionComplete: Function;
        (<any>window).open = () => {
            return {
                document: { write: () => { }, close: () => { } },
                close: () => { }, print: () => { }, focus: () => { }, moveTo: () => { }, resizeTo: () => { }
            };
        };

        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid({
                dataSource: data.slice(0, 15),
                columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                allowSelection: false,
                allowFiltering: true,
                allowGrouping: true,
                allowPaging: true
            }, done);
        });
        it('basic feature testing', (done: Function) => {
            let printComplete = (args?: { element: Element }): void => {
                expect(args.element.querySelectorAll('.e-gridpager').length).toBe(0);
                expect(args.element.querySelectorAll('.e-filterbar').length).toBe(1);
                expect(args.element.classList.contains('e-print-grid-layout')).toBeTruthy();
                expect(args.element.querySelectorAll('.e-row').length).toBe(15);
                let contentDiv: HTMLElement = (args.element.querySelector('.e-content') as HTMLElement);
                expect(contentDiv.style.height).toBe('auto');
                expect(contentDiv.style.overflowY).toBe('auto');
                expect(contentDiv.style.overflowX).toBe('hidden');
                expect((args.element.querySelector('.e-groupdroparea') as HTMLElement).style.display).toBe('none');
                expect(args.element.querySelectorAll('.e-spin-show').length).toBe(0);
                expect(args.element.classList.contains('e-print-grid')).toBe(false);
                done();
            };
            window.print = () => { };
            (<any>Window).print = () => { };
            gridObj.printComplete = printComplete;
            gridObj.dataBind();
            gridObj.print();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            actionComplete = null;
        });
     });

    describe('Print with paging', () => {
        let gridObj: Grid;
        let actionComplete: Function;
        (<any>window).open = () => {
            return {
                document: { write: () => { }, close: () => { } },
                close: () => { }, print: () => { }, focus: () => { }, moveTo: () => { }, resizeTo: () => { }
            };
        };

        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                allowSelection: false,
                allowFiltering: true,
                allowGrouping: true,
                allowPaging: true,
                groupSettings: { columns: ['OrderID'] },
                toolbar: ['Add'],
                height: 200,
                printMode: 'CurrentPage'
            }, done);
        });

        it('current page testing and group column', (done: Function) => {
            let printComplete = (args?: { element: Element }): void => {
                expect(args.element.querySelectorAll('.e-gridpager').length).toBe(1);
                expect(args.element.querySelector('.e-gridpager').clientWidth).toBe(0);
                expect(args.element.querySelector('.e-grouptopleftcell').clientWidth).toBe(0);
                expect(args.element.querySelector('.e-indentcell').clientWidth).toBe(0);
                expect(args.element.querySelector('.e-recordplusexpand').clientWidth).toBe(0);
                expect(args.element.querySelectorAll('.e-toolbar').length).toBe(0);
                done();
            };
            window.print = () => { };
            (<any>Window).print = () => { };
            gridObj.printComplete = printComplete;
            gridObj.print();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            actionComplete = null;
        });
    });

    describe('Print empty grid', () => {
        let gridObj: Grid;
        let actionComplete: Function;
        (<any>window).open = () => {
            return {
                document: { write: () => { }, close: () => { } },
                close: () => { }, print: () => { }, focus: () => { }, moveTo: () => { }, resizeTo: () => { }
            };
        };

        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: [],
                columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                allowSelection: false,
                allowFiltering: true,
                allowGrouping: true,
                allowPaging: true
            }, done);
        });
        it('cancel print', (done: Function) => {
            let beforePrint = (args?: { element: Element, cancel?: boolean }): void => {
                args.cancel = true;
                expect(args.element.classList.contains('e-print-grid')).toBe(true);
                done();
            };
            window.print = () => { };
            (<any>Window).print = () => { };
            gridObj.beforePrint = beforePrint;
            gridObj.print();
        });
        it('check cancel print grid element has removed', () => {
            let id = gridObj.element.id + '_print';
            expect(document.getElementById(id)).toBe(null);
        });
        it('empty page testing', (done: Function) => {
            let printComp = (args?: { element: Element }): void => {
                done();
            };
            window.print = () => { };
            (<any>Window).print = () => { };
            gridObj.beforePrint = printComp;
            gridObj.print();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            actionComplete = null;
        });
    });

    describe('Print with custom action', () => {
        let gridObj: Grid;
        let actionComplete: Function;
        (<any>window).open = () => {
            return {
                document: { write: () => { }, close: () => { } },
                close: () => { }, print: () => { }, focus: () => { }, moveTo: () => { }, resizeTo: () => { }
            };
        };

        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                allowSelection: false,
                allowFiltering: true,
                allowGrouping: true,
                allowPaging: true
            }, done);
        });
        it('group in before print', (done: Function) => {
            let beforePrint = (args?: { element: Element, cancel?: boolean }): void => {
                (args.element as any).ej2_instances[0].groupColumn('OrderID');
            };
            window.print = () => { };
            (<any>Window).print = () => { };
            gridObj.beforePrint = beforePrint;
            gridObj.printComplete = function (args) {
                done();
            }
            gridObj.print();
        });


        afterAll(() => {
            gridObj.printModule.destroy();
            destroy(gridObj);
            gridObj = null;
            actionComplete = null;
        });
    });

    describe('Print with hierarchy grid All mode=>', () => {
        let gridObj: Grid;
        let printGrid: Grid;
        let c: number = 0;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: employeeData.slice(0, 4),
                allowSorting: true,
                allowFiltering: true,
                allowGrouping: true,
                hierarchyPrintMode: 'All',
                columns: [
                    { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                    { field: 'FirstName', headerText: 'Name', width: 125 },
                    { field: 'Title', headerText: 'Title', width: 180 },
                    { field: 'City', headerText: 'City', width: 110 },
                    { field: 'Country', headerText: 'Country', width: 110 }
                ],
                childGrid: {
                    created: () => ++c,
                    dataSource: data.slice(0, 20),
                    queryString: 'EmployeeID',
                    hierarchyPrintMode: 'All',
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120 },
                        { field: 'ShipCity', headerText: 'Ship City', width: 120 },
                        { field: 'Freight', headerText: 'Freight', width: 120 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 150 }
                    ],
                    childGrid: {
                        dataSource: fCustomerData,
                        queryString: 'CustomerID',
                        columns: [
                            { field: 'CustomerID', headerText: 'Customer ID', textAlign: 'Right', width: 75 },
                            { field: 'Phone', headerText: 'Phone', width: 100 },
                            { field: 'Address', headerText: 'Address', width: 120 },
                            { field: 'Country', headerText: 'Country', width: 100 }
                        ],
                        created: () => ++c
                    },
                }
            }, done);
        });
        it('Check hierarchy in before print', (done: Function) => {
            let trigger: number = 0;
            expect(gridObj.hierarchyPrintMode).toBe('All');
            gridObj.beforePrint = (args) => {
                expect(args.element.classList.contains('e-print-grid')).toBeTruthy();
                expect(args.element.querySelectorAll('[aria-busy=true]').length).toBe(0);
                expect((args.element as any).ej2_instances[0]['isPrinting']).toBeTruthy();
                expect(args.element.querySelectorAll('.e-grid').length).toBe(c);
                expect(trigger).toBe(0);
                expect((<{printGridObj?: IGrid}>window).printGridObj.expandedRows).not.toBeUndefined();
                printGrid = (<{printGridObj?: IGrid}>window).printGridObj as Grid;
            };
            gridObj.printComplete = (args) => {
                expect((args.element as any).ej2_instances[0]['isPrinting']).toBeFalsy();
                expect((<{printGridObj?: IGrid}>window).printGridObj).toBeUndefined();
                expect(args.element.classList.contains('e-print-grid-layout')).toBeTruthy();
                done();
            }
            (<any>gridObj.printModule).printGridElement = () => true;
            (<any>gridObj.printModule).renderPrintGrid();
            (<Grid>(<{printGridObj?: IGrid}>window).printGridObj).actionFailure = () => trigger++;
        });

        afterAll(() => {
            gridObj.printModule.destroy();
            destroy(gridObj);
            destroy(printGrid);
            printGrid = null;
            gridObj = null;
            c = null;
        });
    });

    describe('Print with hierarchy grid expanded mode =>', () => {
        let gridObj: Grid;
        let childGrid: Grid;
        let printGrid: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: employeeData.slice(0, 4),
                allowSorting: true,
                allowFiltering: true,
                allowGrouping: true,
                hierarchyPrintMode: 'Expanded',
                columns: [
                    { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                    { field: 'FirstName', headerText: 'Name', width: 125 },
                    { field: 'Title', headerText: 'Title', width: 180 },
                    { field: 'City', headerText: 'City', width: 110 },
                    { field: 'Country', headerText: 'Country', width: 110 }
                ],
                childGrid: {
                    dataSource: data.slice(0, 20),
                    queryString: 'EmployeeID',
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120 },
                        { field: 'ShipCity', headerText: 'Ship City', width: 120 },
                        { field: 'Freight', headerText: 'Freight', width: 120 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 150 }
                    ],
                    childGrid: {
                        dataSource: fCustomerData,
                        queryString: 'CustomerID',
                        columns: [
                            { field: 'CustomerID', headerText: 'Customer ID', textAlign: 'Right', width: 75 },
                            { field: 'Phone', headerText: 'Phone', width: 100 },
                            { field: 'Address', headerText: 'Address', width: 120 },
                            { field: 'Country', headerText: 'Country', width: 100 }
                        ]
                    },
                }
            }, done);
        });

        it('expand the child grid', (done: Function) => {
            gridObj.detailDataBound = (args: any) => {
                childGrid = args.childGrid;
                childGrid.dataBound = () => {done()};
                expect(gridObj.element.querySelectorAll('.e-grid').length).toBe(1);
            };
            gridObj.detailRowModule.expand(2);
        });

        it('expand inner childGrid', (done: Function) => {
            childGrid.detailDataBound = (args) => {
                expect(gridObj.element.querySelectorAll('.e-grid').length).toBe(2);
                done();
            };
            childGrid.detailRowModule.expand(1);
        });

        it('Check hierarchy in before expanded print', (done: Function) => {
            let trigger: number = 0;
            expect(gridObj.hierarchyPrintMode).toBe('Expanded');
            gridObj.beforePrint = (args) => {
                expect(args.element.classList.contains('e-print-grid')).toBeTruthy();
                expect(args.element.querySelectorAll('[aria-busy=true]').length).toBe(0);
                expect((args.element as any).ej2_instances[0]['isPrinting']).toBeTruthy();
                expect(args.element.querySelectorAll('.e-grid').length).toBe(2);
                expect(trigger).toBe(0);
                expect((<{printGridObj?: IGrid}>window).printGridObj.expandedRows).not.toBeUndefined();
                printGrid = (<{printGridObj?: IGrid}>window).printGridObj as Grid;
            };
            gridObj.printComplete = (args) => {
                expect((args.element as any).ej2_instances[0]['isPrinting']).toBeFalsy();
                expect((<{printGridObj?: IGrid}>window).printGridObj).toBeUndefined();
                expect(args.element.classList.contains('e-print-grid-layout')).toBeTruthy();
                done();
            }
            (<any>gridObj.printModule).printGridElement = () => true;
            (<any>gridObj.printModule).renderPrintGrid();
            (<Grid>(<{printGridObj?: IGrid}>window).printGridObj).actionFailure = () => trigger++;
        });

        afterAll(() => {
            gridObj.printModule.destroy();
            destroy(gridObj);
            destroy(printGrid);
            gridObj = null;
            childGrid = null;
            printGrid = null;
        });
    });

    describe('Print with hierarchy grid None mode =>', () => {
        let gridObj: Grid;
        let printGrid: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: employeeData.slice(0, 4),
                allowSorting: true,
                allowFiltering: true,
                allowGrouping: true,
                hierarchyPrintMode: 'None',
                columns: [
                    { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                    { field: 'FirstName', headerText: 'Name', width: 125 },
                    { field: 'Title', headerText: 'Title', width: 180 },
                    { field: 'City', headerText: 'City', width: 110 },
                    { field: 'Country', headerText: 'Country', width: 110 }
                ],
                childGrid: {
                    dataSource: data.slice(0, 20),
                    queryString: 'EmployeeID',
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120 },
                        { field: 'ShipCity', headerText: 'Ship City', width: 120 },
                        { field: 'Freight', headerText: 'Freight', width: 120 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 150 }
                    ],
                    childGrid: {
                        dataSource: fCustomerData,
                        queryString: 'CustomerID',
                        columns: [
                            { field: 'CustomerID', headerText: 'Customer ID', textAlign: 'Right', width: 75 },
                            { field: 'Phone', headerText: 'Phone', width: 100 },
                            { field: 'Address', headerText: 'Address', width: 120 },
                            { field: 'Country', headerText: 'Country', width: 100 }
                        ]
                    },
                }
            }, done);
        });

        it('expand the child grid', (done: Function) => {
            gridObj.detailDataBound = (args: any) => {
                expect(gridObj.element.querySelectorAll('.e-grid').length).toBe(1);
                done();
            };
            gridObj.detailRowModule.expand(2);
        });

        it('Check hierarchy in before None print', (done: Function) => {
            let trigger: number = 0;
            expect(gridObj.hierarchyPrintMode).toBe('None');
            gridObj.beforePrint = (args) => {
                expect(args.element.classList.contains('e-print-grid')).toBeTruthy();
                expect(args.element.querySelectorAll('[aria-busy=true]').length).toBe(0);
                expect((args.element as any).ej2_instances[0]['isPrinting']).toBeTruthy();
                expect(args.element.querySelectorAll('.e-grid').length).toBe(0);
                expect((<{printGridObj?: IGrid}>window).printGridObj.expandedRows).toBeUndefined();
                printGrid = (<{printGridObj?: IGrid}>window).printGridObj as Grid;
            };
            gridObj.printComplete = (args) => {
                expect((args.element as any).ej2_instances[0]['isPrinting']).toBeFalsy();
                expect((<{printGridObj?: IGrid}>window).printGridObj).toBeUndefined();
                expect(args.element.classList.contains('e-print-grid-layout')).toBeTruthy();
                done();
            }
            (<any>gridObj.printModule).printGridElement = () => true;
            (<any>gridObj.printModule).renderPrintGrid();
            (<Grid>(<{printGridObj?: IGrid}>window).printGridObj).actionFailure = () => trigger++;
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
            gridObj.printModule.destroy();
            destroy(gridObj);
            destroy(printGrid);
            gridObj = null;
            printGrid = null;
        });
    });
});
