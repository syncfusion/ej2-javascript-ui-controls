/**
 * Freeze Renderer spec
 */
import { Grid } from '../../../src/grid/base/grid';
import { Column } from '../../../src/grid/models';
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { data, employeeData } from '../base/datasource.spec';
import { Freeze } from '../../../src/grid/actions/freeze';
import { Aggregate } from '../../../src/grid/actions/aggregate';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import { Edit } from '../../../src/grid/actions/edit';
import { createGrid, destroy } from '../base/specutil.spec';
import { profile, inMB, getMemoryProfile } from '../base/common.spec';
import { getScrollBarWidth } from '../../../src/grid/base/util';
import { QueryCellInfoEventArgs } from '../../../src/grid/base/interface';

Grid.Inject(Freeze, Aggregate, Edit, VirtualScroll);

describe('Freeze render module', () => {
    describe('Freeze Row and Column', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    frozenColumns: 2,
                    frozenRows: 2,
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity', width: 'auto' },
                    ]
                }, done);
        });

        it('Frozen Header testing', () => {
            expect(gridObj.getHeaderContent().querySelector('tbody').childElementCount).toBe(2);
            expect(gridObj.getFrozenRightHeaderTbody().childElementCount).toBe(2);
            expect(gridObj.getMovableHeaderTbody().childElementCount).toBe(2);
            expect(gridObj.getFrozenHeaderTbody().childElementCount).toBe(2);
            expect(gridObj.getFrozenRightHeader().querySelector('tbody').childElementCount).toBe(2);
            expect(gridObj.getHeaderContent().querySelector('tbody').children[0].
                   querySelectorAll('.e-leftfreeze').length).toBe(2);
            expect(gridObj.getHeaderContent().querySelector('tr').querySelectorAll('.e-leftfreeze').length).toBe(2);
        });

        // it('Movable Header testing', () => {
        //     expect(gridObj.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody').childElementCount).toBe(2);
        // });

        it('Frozen Content testing', () => {
            expect(gridObj.getContent().querySelector('tbody').childElementCount).toBeGreaterThan(1);
            expect(gridObj.getFrozenLeftContentTbody().childElementCount).toBeGreaterThan(1);
            expect(gridObj.getFrozenRightContentTbody().childElementCount).toBeGreaterThan(1);
            expect(gridObj.getMovableContentTbody().childElementCount).toBeGreaterThan(1);
            expect(gridObj.getContent().querySelector('tbody').children[0].querySelectorAll('.e-leftfreeze').length).toBe(2);
        });

        // it('Movable Content testing', () => {
        //     expect(gridObj.getContent().querySelector('.e-movablecontent').querySelector('tbody').childElementCount).toBeGreaterThan(1);
        // });

        // it('check scroll left header/content sync', () => {
        //     let ele: HTMLElement = gridObj.getContent().querySelector('.e-movablecontent') as HTMLElement;
        //     (<HTMLElement>ele).scrollLeft = 10;
        //     raise(gridObj, 'scroll', ele);
        //     (<HTMLElement>ele).scrollTop = 10;
        //     raise(gridObj, 'scroll', ele);
        //     (<HTMLElement>ele).scrollTop = 10;
        //     raise(gridObj, 'scroll', ele);
        //     (<HTMLElement>gridObj.getContent().querySelector('.e-frozencontent')).scrollTop = 20;
        //     raise(gridObj, 'wheel', <HTMLElement>gridObj.getContent().querySelector('.e-frozencontent'));
        //     gridObj.isDestroyed = true;
        //     (<HTMLElement>ele).scrollTop = 10;
        //     raise(gridObj, 'scroll', ele);
        //     (<HTMLElement>gridObj.getContent().querySelector('.e-frozencontent')).scrollTop = 20;
        //     raise(gridObj, 'wheel', <HTMLElement>gridObj.getContent().querySelector('.e-frozencontent'));
        //     raise(gridObj, 'touchstart', <HTMLElement>gridObj.getContent().querySelector('.e-frozencontent'));
        //     (<HTMLElement>gridObj.getContent().querySelector('.e-frozencontent')).scrollTop = 30;
        //     raise(gridObj, 'touchmove', <HTMLElement>gridObj.getContent().querySelector('.e-frozencontent'));
        //     raise(gridObj, 'touchstart', <HTMLElement>gridObj.getHeaderContent().querySelector('.e-movableheader'));
        //     (<HTMLElement>gridObj.getHeaderContent().querySelector('.e-movableheader')).scrollLeft = 30;
        //     raise(gridObj, 'touchmove', <HTMLElement>gridObj.getHeaderContent().querySelector('.e-movableheader'));
        //     let args = { target: gridObj.getContent().querySelector('.e-frozencontent'), touches: [{ pageY: 200 }] };
        //     gridObj.scrollModule.getPointXY(args);
        //     let arg = { target: gridObj.getContent().querySelector('.e-frozencontent') };
        //     gridObj.scrollModule.getPointXY(arg);
        //     remove(gridObj.getContent().querySelector('tbody'));
        //     remove(gridObj.getContent().querySelector('tbody'));
        //     (<HTMLElement>ele).scrollTop = 10;
        //     raise(gridObj, 'scroll', ele);
        //     (<HTMLElement>gridObj.getContent().querySelector('.e-frozencontent')).scrollTop = 20;
        //     raise(gridObj, 'wheel', <HTMLElement>gridObj.getContent().querySelector('.e-frozencontent'));
        // });

        // let raise: Function = (gridObj: Grid, type: string, ele: HTMLElement) => {
        //     let evt: Event = document.createEvent('HTMLEvents');
        //     evt.initEvent(type, true, true);
        //     ele.dispatchEvent(evt);
        // };

        afterAll(() => {
            // gridObj['freezeModule'].destroy();
            destroy(gridObj);
        });
    });

    let destroy: EmitType<Object> = (grid: Grid) => {
        if (grid) {
            grid.destroy();
            document.getElementById('Grid').remove();
        }
    };

    describe('Freeze Row', () => {
        let gridObj: Grid;
        let dBound: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    frozenRows: 2,
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity', minWidth: 300, width: 'auto' },
                    ]
                }, done);
        });

        it('Frozen Header testing', () => {
            expect(gridObj.getHeaderContent().querySelector('tbody').childElementCount).toBe(2);
        });

        it('Movable Content testing', () => {
            expect(gridObj.getContent().querySelector('tbody').childElementCount).toBeGreaterThan(1);
            expect(gridObj.getFrozenRightContent().querySelector('tbody').childElementCount).toBeGreaterThan(1);
        });

        it('on property change', () => {
            dBound = (args?: Object): void => {
                expect(gridObj.getContent().querySelector('tbody').children[0].querySelectorAll('.e-leftfreeze').length).toBe(2);
                expect(gridObj.getContent().querySelector('tbody').childElementCount).toBeGreaterThan(1);
                expect(gridObj.getHeaderContent().querySelector('tbody').children[0].
                       querySelectorAll('.e-leftfreeze').length).toBe(2);
                expect(gridObj.getHeaderContent().querySelector('tbody').childElementCount).toBe(2);
            };
            gridObj.frozenColumns = 2;
            gridObj.dataBound = dBound;
            gridObj.dataBind();
        });

        afterAll(() => {
            // gridObj['freezeModule'].destroy();
            destroy(gridObj);
        });
    });

     // used for code coverage
     describe('Freeze Row with virtualization', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    frozenRows: 2,
                    enableVirtualization: true,
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ]
                }, done);
        });

        it('execute methods', () => {
            let rows: any = (gridObj.contentModule as any).getReorderedRows({ virtualInfo: (gridObj.contentModule as any).prevInfo });
            rows = null;
            expect(1).toBe(1);
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Freeze Column', () => {
        let gridObj: Grid;
        let header: any;
        let movablecnt: number;
        let frozencnt: number;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    frozenColumns: 2,
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ]
                }, done);
        });

        it('Frozen Content testing', (done) => {
            expect(gridObj.getContent().querySelector('tbody').childElementCount).toBeGreaterThan(1);
            expect(gridObj.getContent().querySelector('tbody').children[0].querySelectorAll('.e-leftfreeze').length).toBe(2);
            // used for code coverage
            frozencnt = (gridObj as any).getVisibleFrozenColumnsCount();
            header = gridObj.getFrozenLeftColumnHeaderByIndex(0);
            movablecnt = gridObj.getVisibleMovableCount();
            done();
        });

        // it('Movable Content testing', () => {
        //     // gridObj.isDestroyed = true;
        //     // (gridObj as any).freezeModule.addEventListener();
        //     // gridObj.isDestroyed = false;
        //     expect(gridObj.getContent().querySelector('.e-movablecontent').querySelector('tbody').childElementCount).toBeGreaterThan(1);
        // });

        it('Add aggregates', () => {
            gridObj.aggregates = [{
                columns: [{
                    type: 'Sum',
                    field: 'EmployeeID',
                    footerTemplate: 'Sum: ${Sum}'
                }]
            },
            {
                columns: [{
                    type: 'Max',
                    field: 'EmployeeID',
                    footerTemplate: 'Max: ${Max}'
                }]
            }];
        });

        it('Ensure aggregate row visiblity', () => {
            let isHide: boolean = gridObj.element.querySelector('.e-summaryrow').classList.contains('e-hide');
            expect(isHide).toBe(false);
        });

        afterAll(() => {
            // gridObj['freezeModule'].destroy();
            destroy(gridObj);
            header = gridObj = movablecnt = frozencnt = null;
        });
    });

    describe('Without Freeze', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    frozenColumns: 0,
                    frozenRows: 0,
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ]
                }, done);
        });

        it('header content rendering', () => {
            // Test case for header content rendering
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Freeze Column', () => {
        let gridObj: Grid;
        let dBound: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    height: 400,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID', isFrozen: true },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Count',
                            field: 'ShipCity',
                            footerTemplate: 'Count: ${count}'
                        }]
                    }],
                }, done);
        });

        it('Frozen Content testing', () => {
            expect(gridObj.getContent().querySelector('tbody').childElementCount).toBeGreaterThan(1);
            expect(gridObj.getContent().querySelector('tbody').children[0].querySelectorAll('.e-leftfreeze').length).toBe(1);
        });

        // it('Movable Content testing', () => {
        //     expect(gridObj.getContent().querySelector('.e-movablecontent').querySelector('tbody').childElementCount).toBeGreaterThan(1);
        // });

        it('Aggregate checking', () => {
            expect(gridObj.element.querySelector('.e-summarycontent').childNodes.length).toBe(1);
        });

        it('clip board testing', () => {
            gridObj.selectRow(2);
            gridObj.copy();
            expect((<any>gridObj.clipboardModule).copyContent).toBe('HANAR	10250	4	Brazil	Rio de Janeiro');
        });

        it('copy with header', () => {
            gridObj.copy(true);
            expect((<any>gridObj.clipboardModule).copyContent).toBe('CustomerID	OrderID	EmployeeID	ShipCountry	ShipCity\nHANAR	10250	4	Brazil	Rio de Janeiro');
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

        // it('Ensure the grid table while dynamically disable isFrozen in the Grid column', (done: Function) => {
        //     (gridObj.columns[1] as Column).isFrozen = false;
        //     let dataBound = (args: Object) => {
        //         expect(gridObj.getContent().querySelector('.e-leftfreeze')).toBeNull();
        //         done();
        //     };
        //     gridObj.dataBound = dataBound;
        //     gridObj.freezeRefresh();
        // });

        // it('Ensure the grid table while dynamically enable isFrozen in the Grid column', (done: Function) => {
        //     (gridObj.columns[1] as Column).isFrozen = true;
        //     let dataBound = (args: Object) => {
        //         expect(gridObj.getContent().querySelector('.e-leftfreeze')).not.toBeUndefined();
        //         expect(gridObj.getContent().querySelector('.e-leftfreeze')).not.toBeNull();
        //         done();
        //     };
        //     gridObj.dataBound = dataBound;
        //     gridObj.freezeRefresh();
        // });

        // it('Ensure the movable content colgroup count while dynamically enable isFrozen in the Grid column', (done: Function) => {
        //     (gridObj.columns[2] as Column).isFrozen = true;
        //     let dataBound = (args: Object) => {
        //         let mTblColgr: Element = gridObj.contentModule.getMovableContent().querySelector('colgroup');
        //         let mHdrColgr: Element = gridObj.getHeaderContent().querySelector('colgroup');
        //         // expect(mTblColgr.children.length).toBe(mHdrColgr.children.length);
        //         done();
        //     };
        //     gridObj.dataBound = dataBound;
        //     gridObj.refreshColumns();
        // });

        afterAll(() => {
            // gridObj['freezeModule'].destroy();
            destroy(gridObj);
        });
    });

    // describe('Ensure deleteRow and deleteRecord with batch editing', () => {
    //     let gridObj: Grid;
    //     let dBound: () => void;
    //     let selectedRowIndex: number;
    //     beforeAll((done: Function) => {
    //         gridObj = createGrid(
    //             {
    //                 dataSource: data,
    //                 height: 400,
    //                 frozenColumns: 2,
    //                 frozenRows: 2,
    //                 editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: false },
    //                 columns: [
    //                     { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true },
    //                     { headerText: 'CustomerID', field: 'CustomerID', isFrozen: true },
    //                     { headerText: 'EmployeeID', field: 'EmployeeID' },
    //                     { headerText: 'ShipCountry', field: 'ShipCountry' },
    //                     { headerText: 'ShipCity', field: 'ShipCity' },
    //                 ]
    //             }, done);
    //     });
    //     it('Before delete', () => {
    //         gridObj.selectRow(4);
    //     });
    //     it('Ensure deleteRow method', (done: Function) => {
    //         selectedRowIndex = parseInt(gridObj.getSelectedRows()[0].getAttribute('data-rowindex'), 10);
    //         let batchDelete = (args: Object) => {
    //             // expect(gridObj.getMovableRows()[3].classList.contains('e-hiddenrow')).toBeTruthy();
    //             // expect(gridObj.getFrozenDataRows().length).toBe(gridObj.currentViewData.length - 1);
    //             // expect(gridObj.getMovableDataRows().length).toBe(gridObj.currentViewData.length - 1);
    //             //selectedRowIndex = parseInt(gridObj.getSelectedRows()[0].getAttribute('data-rowindex'), 10);
    //             //expect(selectedRowIndex).toBe(3);
    //             gridObj.editModule.batchCancel();
    //             gridObj.batchDelete = null;
    //             done();
    //         };
    //         gridObj.batchDelete = batchDelete;
    //         // gridObj.deleteRow(gridObj.getMovableRows()[3] as HTMLTableRowElement);
    //     });
    //     it('Before delete', () => {
    //         gridObj.selectRow(4);
    //     });
    //     it('Ensure deleteRecord method', (done: Function) => {
    //         selectedRowIndex = parseInt(gridObj.getSelectedRows()[0].getAttribute('data-rowindex'), 10);
    //         let batchDelete = (args: Object) => {
    //             // expect(gridObj.getMovableRows()[3].classList.contains('e-hiddenrow')).toBeTruthy();
    //             // expect(gridObj.getFrozenDataRows().length).toBe(gridObj.currentViewData.length - 1);
    //             // expect(gridObj.getMovableDataRows().length).toBe(gridObj.currentViewData.length - 1);
    //             //selectedRowIndex = parseInt(gridObj.getSelectedRows()[0].getAttribute('data-rowindex'), 10);
    //             //expect(selectedRowIndex).toBe(3);
    //             gridObj.editModule.batchCancel();
    //             gridObj.batchDelete = null;
    //             done();
    //         };
    //         gridObj.batchDelete = batchDelete;
    //         gridObj.deleteRecord('OrderID', gridObj.currentViewData[3]);
    //     });
    //     it('Ensure getFrozenRowByIndex', () => {
    //         // let frozenRow: Element = gridObj.getFrozenRowByIndex(2);
    //         // let rowindex: number = parseInt(frozenRow.getAttribute('data-rowindex'), 10);
    //         // expect(rowindex).toBe(2);
    //     });
    //     afterAll(() => {
    //         // gridObj['freezeModule'].destroy();
    //         destroy(gridObj);
    //     });
    // });

    // describe('Ensure movable header scrollLeft after the refrechColumns', () => {
    //     let gridObj: Grid;
    //     let dBound: () => void;
    //     let selectedRowIndex: number;
    //     beforeAll((done: Function) => {
    //         gridObj = createGrid(
    //             {
    //                 dataSource: data,
    //                 height: 400,
    //                 width: 200,
    //                 columns: [
    //                     { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true, isFrozen: true, width: 120 },
    //                     { headerText: 'CustomerID', field: 'CustomerID', width: 120 },
    //                     { headerText: 'EmployeeID', field: 'EmployeeID', width: 120 },
    //                     { headerText: 'ShipCountry', field: 'ShipCountry', width: 120 },
    //                     { headerText: 'ShipCity', field: 'ShipCity', width: 120 },
    //                 ]
    //             }, done);
    //     });
    //     it('set isFrozen', function (done) {
    //         (gridObj.columns[1] as Column).isFrozen = true;
    //         var dataB = function (args: any) {
    //             // gridObj.contentModule.getMovableContent().scrollLeft = 300;
    //             done();
    //         };
    //         gridObj.dataBound = dataB;
    //         gridObj.refreshColumns();
    //     });

    //     it('Ensure scrollLeft', function (done) {
    //         (gridObj.columns[2] as any).isFrozen = true;
    //         var dataB = function (args: any) {
    //             // var hdrScrollLeft = gridObj.headerModule.getMovableHeader().scrollLeft;
    //             // var cntScrollLeft = gridObj.contentModule.getMovableContent().scrollLeft;
    //             // expect(hdrScrollLeft).toBe(cntScrollLeft);
    //             done();
    //         };
    //         gridObj.dataBound = dataB;
    //         gridObj.refreshColumns();
    //     });
    //     afterAll(() => {
    //         // gridObj['freezeModule'].destroy();
    //         destroy(gridObj);
    //     });
    // });

    // describe(' EJ2-36046=> movable header misalignment with textwrap', () => {
    //     let gridObj: Grid;
    //     let dBound: () => void;
    //     let selectedRowIndex: number;
    //     beforeAll((done: Function) => {
    //         gridObj = createGrid(
    //             {
    //                 dataSource: employeeData,
    //                 allowTextWrap: true,
    //                 frozenColumns: 2,
    //                 gridLines: "Both",
    //                 columns: [
    //                     {
    //                         field: "FirstName", headerText: 'First Name', textAlign: 'Center',
    //                         width: 150
    //                     },
    //                     { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
    //                     { field: 'Title', headerText: 'Title', width: 70 },
    //                     {
    //                         field: 'HireDate', headerText: 'Hire Date', textAlign: 'Right',
    //                         width: 135, format: { skeleton: 'yMd', type: 'date' }
    //                     },
    //                     { field: 'ReportsTo', headerText: 'Reports To', width: 120, textAlign: 'Right' }
    //                 ],
    //                 width: 'auto',
    //                 height: 359
    //             }, done);
    //     });
    //     it('Ensure header padding', function (done) {
    //         expect((gridObj.getHeaderContent() as any).style.paddingRight).not.toBe("");
    //         done();
    //     });
    //     afterAll(() => {
    //         // gridObj['freezeModule'].destroy();
    //         destroy(gridObj);
    //     });
    // });

    describe('EJ2-39341 - Row height is not set properly in the grid when having frozen column', () => {
        let gridObj: Grid;
        let data1: Object[] = [
            {
                OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, OrderDate: new Date(8364186e5),
                ShipName: 'Vins et alcools Chevalier', Freight: 1.2, Verified: !0
            },
            {
                OrderID: 10249, CustomerID: '', EmployeeID: 6, OrderDate: new Date(836505e6),
                ShipName: 'Toms Spezialitäten', Freight: 2.4, Verified: !1
            },
            {
                OrderID: 10250, CustomerID: '', EmployeeID: 2, OrderDate: new Date(8367642e5),
                ShipName: 'Hanari Carnes', Freight: null, Verified: !0
            },
            {
                OrderID: 10251, CustomerID: 'HANAR', EmployeeID: 7, OrderDate: new Date(8367642e5),
                ShipName: 'Hanari Carnes', Freight: '', Verified: !0
            }
        ];
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data1,
                    frozenColumns: 2,
                    frozenRows: 2,
                    editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Batch' },
                    rowHeight: 20,
                    columns: [
                        { field: 'CustomerID', headerText: 'Customer ID', width: 130, minWidth: 10 },
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right', minWidth: 10 },
                        { field: 'Freight', width: 125, minWidth: 10 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 300, minWidth: 10 },
                    ]
                }, done);
        });
      
        it('Ensure Rows Height', () => {
        let fHead: HTMLElement = gridObj.getHeaderContent().querySelector('table').rows[2];
        // let mHead: HTMLElement = gridObj.element.querySelector('.e-movableheader').querySelector('table').rows[2];
        let fContent: HTMLElement = gridObj.getContent().querySelector('table').rows[0];
        // let mContent: HTMLElement = gridObj.element.querySelector('.e-movablecontent').querySelector('table').rows[0];
        expect(fHead.offsetHeight).toBe(gridObj.rowHeight);
        // expect(mHead.offsetHeight).toBe(gridObj.rowHeight);
        expect(fContent.offsetHeight).toBe(gridObj.rowHeight);
        // expect(mContent.offsetHeight).toBe(gridObj.rowHeight);
        });
       
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('EJ2-59576 - Grid is not rendering properly with row height and frozen columns properties', () => {
        let gridObj: Grid;
        
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    rowHeight: 30,
                    allowResizing: true,
                    height: 300,
                    frozenColumns: 1,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120, minWidth: 10, },
                        { headerText: 'Order Details',
                        columns: [
                            { field: 'OrderDate', headerText: 'Order Date', textAlign: 'Right', width: 135, format: 'yMd', minWidth: 10, },
                            { field: 'Freight', headerText: 'Freight($)', textAlign: 'Right', width: 120, format: 'C2', minWidth: 10, },
                        ],
                        },
                        { headerText: 'Ship Details',
                        columns: [
                            { field: 'OrderDate', headerText: 'Shipped Date', textAlign: 'Right', width: 145, format: 'yMd', minWidth: 10, },
                            { field: 'ShipCountry', headerText: 'Ship Country', width: 140, minWidth: 10, },
                        ],
                        },
                    ],
                }, done);
        });
      
        it('Ensure Rows Height', () => {
            let fHead: HTMLElement = gridObj.getHeaderContent().querySelector('table').rows[0];
            // let mHead: HTMLElement = gridObj.element.querySelector('.e-movableheader').querySelector('table').rows[0];
            let fContent: HTMLElement = gridObj.getContent().querySelector('table').rows[0];
            // let mContent: HTMLElement = gridObj.element.querySelector('.e-movablecontent').querySelector('table').rows[0];
            expect(fHead.offsetHeight).toBe(gridObj.rowHeight);
            // expect(mHead.offsetHeight).toBe(gridObj.rowHeight);
            expect(fContent.offsetHeight).toBe(gridObj.rowHeight);
            // expect(mContent.offsetHeight).toBe(gridObj.rowHeight);
        });
       
        afterAll(() => {
            destroy(gridObj);
        });
    });

    // describe('EJ2-45062 => Alignment issue when we have visible false column with empty data set', () => {
    //     let gridObj: Grid;
    //     beforeAll((done: Function) => {
    //         gridObj = createGrid(
    //             {
    //                 dataSource: [],
    //                 frozenColumns: 2,
    //                 columns: [
    //                     {
    //                         field: "FirstName", headerText: 'First Name', textAlign: 'Center',
    //                         width: 150, visible: false
    //                     },
    //                     { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
    //                     { field: 'Title', headerText: 'Title', width: 70 },
    //                     {
    //                         field: 'HireDate', headerText: 'Hire Date', textAlign: 'Right',
    //                         width: 135, format: { skeleton: 'yMd', type: 'date' }
    //                     },
    //                     { field: 'ReportsTo', headerText: 'Reports To', width: 120, textAlign: 'Right' }
    //                 ],
    //                 height: 359
    //             }, done);
    //     });
    //     it('Ensure empty row cell colSpan', () => {
    //         // expect(gridObj.getFrozenLeftContentTbody().querySelector('td').colSpan).toBe(1);
    //     });
    //     afterAll(() => {
    //         // gridObj['freezeModule'].destroy();
    //         destroy(gridObj);
    //     });
    // });
    // describe('EJ2-45062 => column level freeze left empty row missaligment issue', () => {
    //     let gridObj: Grid;
    //     beforeAll((done: Function) => {
    //         gridObj = createGrid(
    //             {
    //                 dataSource: [],
    //                 columns: [
    //                     {
    //                         field: "FirstName", headerText: 'First Name', textAlign: 'Center',
    //                         width: 150, visible: false, freeze: 'Left'
    //                     },
    //                     { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
    //                     { field: 'Title', headerText: 'Title', width: 70, freeze: 'Right' },
    //                     {
    //                         field: 'HireDate', headerText: 'Hire Date', textAlign: 'Right',
    //                         width: 135, format: { skeleton: 'yMd', type: 'date' }
    //                     },
    //                     { field: 'ReportsTo', headerText: 'Reports To', width: 120, textAlign: 'Right', freeze: 'Left' }
    //                 ],
    //                 height: 359
    //             }, done);
    //     });
    //     it('Ensure empty row cell colSpan', () => {
    //         // expect(gridObj.getFrozenLeftContentTbody().querySelector('td').colSpan).toBe(1);
    //     });
    //     afterAll(() => {
    //         // gridObj['freezeModule'].destroy();
    //         destroy(gridObj);
    //     });
    // });
    // describe('EJ2-45062 => column level freeze right empty row missaligment issue', () => {
    //     let gridObj: Grid;
    //     beforeAll((done: Function) => {
    //         gridObj = createGrid(
    //             {
    //                 dataSource: [],
    //                 columns: [
    //                     {
    //                         field: "FirstName", headerText: 'First Name', textAlign: 'Center',
    //                         width: 150, visible: false, freeze: 'Right'
    //                     },
    //                     { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
    //                     { field: 'Title', headerText: 'Title', width: 70, freeze: 'Right' },
    //                     {
    //                         field: 'HireDate', headerText: 'Hire Date', textAlign: 'Right',
    //                         width: 135, format: { skeleton: 'yMd', type: 'date' }
    //                     },
    //                     { field: 'ReportsTo', headerText: 'Reports To', width: 120, textAlign: 'Right' }
    //                 ],
    //                 height: 359
    //             }, done);
    //     });
    //     it('Ensure empty row cell colSpan', () => {
    //         // expect(gridObj.getFrozenRightContentTbody().querySelector('td').colSpan).toBe(1);
    //     });
    //     afterAll(() => {
    //         // gridObj['freezeModule'].destroy();
    //         destroy(gridObj);
    //     });
    // });

    describe('EJ2-45329 => Horizontal scroll bar is not displayed while using Frozen columns', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData,
                    frozenColumns: 2,
                    height: '100%',
                    columns: [
                        {
                            field: "FirstName", headerText: 'First Name', textAlign: 'Center',
                            width: 150, visible: false
                        },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                        { field: 'Title', headerText: 'Title', width: 70 },
                        {
                            field: 'HireDate', headerText: 'Hire Date', textAlign: 'Right',
                            width: 135, format: { skeleton: 'yMd', type: 'date' }
                        },
                        { field: 'ReportsTo', headerText: 'Reports To', width: 120, textAlign: 'Right' }
                    ],
                }, done);
        });
        it('Ensure e-content element height', () => {
            expect((gridObj.getContent().firstElementChild as HTMLElement).style.height).toBe('100%');
        });
        afterAll(() => {
            // gridObj['freezeModule'].destroy();
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-48927 - SetCellValue does not work when column.isFrozen Property is set to true', function () {
        let gridObj: Grid;
        let localData: Object[] = [{
            OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, OrderDate: new Date(8364186e5),
            ShipName: 'Vins et alcools Chevalier', ShipCity: 'Reims', ShipAddress: '59 rue de l Abbaye',
            ShipRegion: 'CJ', ShipPostalCode: '51100', ShipCountry: 'France', Freight: 32.38, Verified: !0
        },
        {
            OrderID: 10249, CustomerID: 'TOMSP', EmployeeID: 6, OrderDate: new Date(836505e6),
            ShipName: 'Toms Spezialitäten', ShipCity: 'Münster', ShipAddress: 'Luisenstr. 48',
            ShipRegion: 'CJ', ShipPostalCode: '44087', ShipCountry: 'Germany', Freight: 11.61, Verified: !1
        },
        {
            OrderID: 10250, CustomerID: 'HANAR', EmployeeID: 4, OrderDate: new Date(8367642e5),
            ShipName: 'Hanari Carnes', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua do Paço, 67',
            ShipRegion: 'RJ', ShipPostalCode: '05454-876', ShipCountry: 'Brazil', Freight: 65.83, Verified: !0
        }];
        beforeAll(function (done) {
            gridObj = createGrid({
                dataSource: localData,
                columns: [
                    { headerText: 'OrderID', field: 'OrderID', type: 'number', isPrimaryKey: true, isFrozen : true },
                    { headerText: 'CustomerID', field: 'CustomerID' },
                    { headerText: 'Freight', field: 'Freight', format: "C2" },
                    { headerText: 'ShipCountry', field: 'ShipCountry' },
                ]
            }, done);
        });
        it('update particular cell', () => {
            gridObj.setCellValue(10249, 'CustomerID', 'new value');
            let selRow: any = gridObj.contentModule.getRows()[1];
            expect((<any>selRow).data.CustomerID).toEqual('new value');
            gridObj.setCellValue(10249, 'Freight', 1);
            expect((<any>selRow).data.Freight).toEqual(1);
            gridObj.setCellValue(10249, 'ShipCountry', 'new country');
            expect((<any>selRow).data.ShipCountry).toEqual('new country');
        });
        afterAll(function () {
            destroy(gridObj);
        });
    });

    describe('Frozen Grid Mask Row', () => {
        let gridObj: Grid;
        let frozenLeftHeaderElement: Element;
        let movableHeaderElement: Element;
        let frozenRightHeaderElement: Element;
        let frozenLeftContentElement: Element;
        let movableContentElement: Element;
        let frozenRightContentElement: Element;
        let frozenLeftFooterElement: Element;
        let movableFooterElement: Element;
        let frozenRightFooterElement: Element;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 10),
                    loadingIndicator: { indicatorType: 'Shimmer' },
                    frozenRows: 3,
                    columns: [
                        { field: 'OrderID', freeze: 'Left'},
                        { field: 'CustomerID', freeze: 'Left'},
                        { field: 'EmployeeID'},
                        { field: 'ShipCity' },
                        { field: 'ShipName'},
                        { field: 'ShipCountry'},
                        { field: 'Freight', freeze: 'Right'},
                        { field: 'ShipRegion', freeze: 'Right'},
                    ],
                    aggregates: [
                        {
                            columns: [{
                                type: 'Max',
                                field: 'OrderID',
                                footerTemplate: 'Max: ${Max}'
                            }]
                        },
                        {
                            columns: [{
                                type: 'Max',
                                field: 'EmployeeID',
                                footerTemplate: 'Max: ${Max}'
                            }]
                        },
                        {
                            columns: [{
                                type: 'Max',
                                field: 'Freight',
                                footerTemplate: 'Max: ${Max}'
                            }]
                        }
                    ],
                }, done);
        });
        it('Show Mask Row', () => {
            gridObj.showMaskRow();

            frozenLeftHeaderElement = gridObj.getHeaderContent();
            // movableHeaderElement = gridObj.getHeaderContent().querySelector('.e-movableheader');
            // frozenRightHeaderElement = gridObj.getHeaderContent().querySelector('.e-frozen-right-header');

            frozenLeftContentElement = gridObj.getContent();
            // movableContentElement = gridObj.getContent().querySelector('.e-movablecontent');
            // frozenRightContentElement = gridObj.getContent().querySelector('.e-frozen-right-content');

            frozenLeftFooterElement = gridObj.getFooterContent();
            // movableFooterElement = gridObj.getFooterContent().querySelector('.e-movablefootercontent');
            // frozenRightFooterElement = gridObj.getFooterContent().querySelector('.e-frozen-right-footercontent');

            expect(frozenLeftHeaderElement.querySelector('.e-masked-table')).toBeTruthy();
            // expect(movableHeaderElement.querySelector('.e-masked-table')).toBeTruthy();
            // expect(frozenRightHeaderElement.querySelector('.e-masked-table')).toBeTruthy();

            expect(frozenLeftContentElement.querySelector('.e-masked-table')).toBeTruthy();
            // expect(movableContentElement.querySelector('.e-masked-table')).toBeTruthy();
            // expect(frozenRightContentElement.querySelector('.e-masked-table')).toBeTruthy();

            expect(frozenLeftFooterElement.querySelector('.e-masked-table')).toBeTruthy();
            // expect(movableFooterElement.querySelector('.e-masked-table')).toBeTruthy();
            // expect(frozenRightFooterElement.querySelector('.e-masked-table')).toBeTruthy();
        });
        it('Refresh Mask Row', () => {
            (gridObj as any).refreshMaskRow();

            expect(frozenLeftHeaderElement.querySelector('.e-masked-table').clientWidth).toBe(frozenLeftHeaderElement.querySelector('.e-table:not(.e-masked-table)').clientWidth);
            // expect(movableHeaderElement.querySelector('.e-masked-table').clientWidth).toBe(movableHeaderElement.querySelector('.e-table:not(.e-masked-table)').clientWidth);
            // expect(frozenRightHeaderElement.querySelector('.e-masked-table').clientWidth).toBe(frozenRightHeaderElement.querySelector('.e-table:not(.e-masked-table)').clientWidth);

            expect(frozenLeftContentElement.querySelector('.e-masked-table').clientWidth).toBe(frozenLeftContentElement.querySelector('.e-table:not(.e-masked-table)').clientWidth);
            // expect(movableContentElement.querySelector('.e-masked-table').clientWidth).toBe(movableContentElement.querySelector('.e-table:not(.e-masked-table)').clientWidth);
            // expect(frozenRightContentElement.querySelector('.e-masked-table').clientWidth).toBe(frozenRightContentElement.querySelector('.e-table:not(.e-masked-table)').clientWidth);
        });
        it('Remove Mask Row', () => {
            gridObj.removeMaskRow();

            expect(frozenLeftHeaderElement.querySelector('.e-masked-table')).toBeFalsy();
            // expect(movableHeaderElement.querySelector('.e-masked-table')).toBeFalsy();
            // expect(frozenRightHeaderElement.querySelector('.e-masked-table')).toBeFalsy();

            expect(frozenLeftContentElement.querySelector('.e-masked-table')).toBeFalsy();
            // expect(movableContentElement.querySelector('.e-masked-table')).toBeFalsy();
            // expect(frozenRightContentElement.querySelector('.e-masked-table')).toBeFalsy();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = frozenLeftHeaderElement = movableHeaderElement = frozenRightHeaderElement = null;
            frozenLeftContentElement = movableContentElement = frozenRightContentElement = null;
            frozenLeftFooterElement = movableFooterElement = frozenRightFooterElement = null;
        });
    });

    describe('EJ2-67886 => colSpan is not working with Frozen Grid', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    gridLines: 'Both',
                    frozenRows: 2,
                    frozenColumns: 3,
                    columns: [
                        {
                            field: 'OrderID',
                            headerText: 'Order ID',
                            width: 120,
                            textAlign: 'Right'
                        },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
                        {
                            field: 'OrderDate',
                            headerText: 'Order Date',
                            width: 130,
                            format: 'yMd',
                            textAlign: 'Right'
                        },
                        { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 150 },
                        { field: 'ShipName', width: 150 },
                        { field: 'ShipCity', width: 150 },
                    ],
                    queryCellInfo: function (args: QueryCellInfoEventArgs) {
                        if (args.column.field == 'CustomerID') {
                            args.colSpan = 2;
                        }
                        if (args.column.field == 'Freight') {
                            args.colSpan = 2;
                        }
                        if (args.column.field == 'ShipName') {
                            args.colSpan = 2;
                        }
                    }
                }, done);
        });
        it('Ensure colSpan for the cell', () => {
            expect((gridObj.getContentTable() as HTMLTableElement).rows[0].cells[1].getAttribute('colSpan')).toBe('2');
        });
        afterAll(() => {
            // gridObj['freezeModule'].destroy();
            destroy(gridObj);
            gridObj = null;
        });
    });
});