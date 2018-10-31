/**
 * Grid print spec document
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { PrintMode } from '../../../src/grid/base/enum';
import { Grid } from '../../../src/grid/base/grid';
import { Sort } from '../../../src/grid/actions/sort';
import { Filter } from '../../../src/grid/actions/filter';
import { Page } from '../../../src/grid/actions/page';
import { Print } from '../../../src/grid/actions/print';
import { Group } from '../../../src/grid/actions/group';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { data } from '../base/datasource.spec';
import { createGrid, destroy } from '../base/specutil.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Sort, Page, Filter, Print, Group, Toolbar);

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
        it('basic feature testing', (done: Function) => {
            let printComplete = (args?: { element: Element }): void => {
                expect(args.element.querySelectorAll('.e-gridpager').length).toBe(0);
                expect(args.element.querySelectorAll('.e-filterbar').length).toBe(1);
                expect((args.element.querySelectorAll('.e-filterbar')[0] as HTMLElement).style.display).toBe('none');
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
                expect((args.element.querySelectorAll('.e-gridpager')[0] as HTMLElement).style.display).toBe('none');
                expect(args.element.querySelectorAll('.e-grouptopleftcell').length).toBe(0);
                expect(args.element.querySelectorAll('.e-recordpluscollapse').length).toBe(0);
                expect(args.element.querySelectorAll('.e-indentcell').length).toBe(0);
                expect(args.element.querySelectorAll('.e-recordplusexpand').length).toBe(0);
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
        });
    });
});
