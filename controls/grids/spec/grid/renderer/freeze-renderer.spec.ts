/**
 * Freeze Renderer spec
 */
import { Grid } from '../../../src/grid/base/grid';
import { Column } from '../../../src/grid/models';
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { data } from '../base/datasource.spec';
import { Freeze } from '../../../src/grid/actions/freeze';
import { Aggregate } from '../../../src/grid/actions/aggregate';
import { Edit } from '../../../src/grid/actions/edit';
import { createGrid, destroy } from '../base/specutil.spec';
import { profile, inMB, getMemoryProfile } from '../base/common.spec';

Grid.Inject(Freeze, Aggregate, Edit);

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
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ]
                }, done);
        });

        it('Frozen Header testing', () => {
            expect(gridObj.getHeaderContent().querySelector('.e-frozenheader').querySelector('tbody').childElementCount).toBe(2);
            expect(gridObj.getHeaderContent().querySelector('.e-frozenheader')
                .querySelector('tbody').children[0].childElementCount).toBe(2);
            expect(gridObj.getHeaderContent().querySelector('.e-frozenheader').querySelector('tr').children[0].childElementCount).toBe(2);
        });

        it('Movable Header testing', () => {
            expect(gridObj.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody').childElementCount).toBe(2);
        });

        it('Frozen Content testing', () => {
            expect(gridObj.getContent().querySelector('.e-frozencontent').querySelector('tbody').childElementCount).toBeGreaterThan(1);
            expect(gridObj.getContent().querySelector('.e-frozencontent').querySelector('tbody').children[0].childElementCount).toBe(2);
        });

        it('Movable Content testing', () => {
            expect(gridObj.getContent().querySelector('.e-movablecontent').querySelector('tbody').childElementCount).toBeGreaterThan(1);
        });

        it('check scroll left header/content sync', () => {
            let ele: HTMLElement = gridObj.getContent().querySelector('.e-movablecontent') as HTMLElement;
            (<HTMLElement>ele).scrollLeft = 10;
            raise(gridObj, 'scroll', ele);
            (<HTMLElement>ele).scrollTop = 10;
            raise(gridObj, 'scroll', ele);
            (<HTMLElement>ele).scrollTop = 10;
            raise(gridObj, 'scroll', ele);
            (<HTMLElement>gridObj.getContent().querySelector('.e-frozencontent')).scrollTop = 20;
            raise(gridObj, 'wheel', <HTMLElement>gridObj.getContent().querySelector('.e-frozencontent'));
            gridObj.isDestroyed = true;
            (<HTMLElement>ele).scrollTop = 10;
            raise(gridObj, 'scroll', ele);
            (<HTMLElement>gridObj.getContent().querySelector('.e-frozencontent')).scrollTop = 20;
            raise(gridObj, 'wheel', <HTMLElement>gridObj.getContent().querySelector('.e-frozencontent'));
            raise(gridObj, 'touchstart', <HTMLElement>gridObj.getContent().querySelector('.e-frozencontent'));
            (<HTMLElement>gridObj.getContent().querySelector('.e-frozencontent')).scrollTop = 30;
            raise(gridObj, 'touchmove', <HTMLElement>gridObj.getContent().querySelector('.e-frozencontent'));
            raise(gridObj, 'touchstart', <HTMLElement>gridObj.getHeaderContent().querySelector('.e-movableheader'));
            (<HTMLElement>gridObj.getHeaderContent().querySelector('.e-movableheader')).scrollLeft = 30;
            raise(gridObj, 'touchmove', <HTMLElement>gridObj.getHeaderContent().querySelector('.e-movableheader'));
            let args = { target: gridObj.getContent().querySelector('.e-frozencontent'), touches: [{ pageY: 200 }] };
            gridObj.scrollModule.getPointXY(args);
            let arg = { target: gridObj.getContent().querySelector('.e-frozencontent') };
            gridObj.scrollModule.getPointXY(arg);
            remove(gridObj.getContent().querySelector('tbody'));
            remove(gridObj.getContent().querySelector('tbody'));
            (<HTMLElement>ele).scrollTop = 10;
            raise(gridObj, 'scroll', ele);
            (<HTMLElement>gridObj.getContent().querySelector('.e-frozencontent')).scrollTop = 20;
            raise(gridObj, 'wheel', <HTMLElement>gridObj.getContent().querySelector('.e-frozencontent'));
        });

        let raise: Function = (gridObj: Grid, type: string, ele: HTMLElement) => {
            let evt: Event = document.createEvent('HTMLEvents');
            evt.initEvent(type, true, true);
            ele.dispatchEvent(evt);
        };

        afterAll(() => {
            gridObj['freezeModule'].destroy();
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
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ]
                }, done);
        });

        it('Frozen Header testing', () => {
            expect(gridObj.getHeaderContent().querySelector('tbody').childElementCount).toBe(2);
        });

        it('Movable Content testing', () => {
            expect(gridObj.getContent().querySelector('tbody').childElementCount).toBeGreaterThan(1);
        });

        it('on property change', () => {
            dBound = (args?: Object): void => {
                expect(gridObj.getContent().querySelector('.e-frozencontent').querySelector('tbody').children[0].childElementCount).toBe(2);
                expect(gridObj.getContent().querySelector('.e-movablecontent').querySelector('tbody').childElementCount).toBeGreaterThan(1);
                expect(gridObj.getHeaderContent().querySelector('.e-frozenheader')
                    .querySelector('tbody').children[0].childElementCount).toBe(2);
                expect(gridObj.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody').childElementCount).toBe(2);
            };
            gridObj.frozenColumns = 2;
            gridObj.dataBound = dBound;
            gridObj.dataBind();
        });

        afterAll(() => {
            gridObj['freezeModule'].destroy();
            destroy(gridObj);
        });
    });

    describe('Freeze Column', () => {
        let gridObj: Grid;
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

        it('Frozen Content testing', () => {
            expect(gridObj.getContent().querySelector('.e-frozencontent').querySelector('tbody').childElementCount).toBeGreaterThan(1);
            expect(gridObj.getContent().querySelector('.e-frozencontent').querySelector('tbody').children[0].childElementCount).toBe(2);
        });

        it('Movable Content testing', () => {
            gridObj.isDestroyed = true;
            (gridObj as any).freezeModule.addEventListener();
            gridObj.isDestroyed = false;
            expect(gridObj.getContent().querySelector('.e-movablecontent').querySelector('tbody').childElementCount).toBeGreaterThan(1);
        });

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
            let isHide: boolean = gridObj.element.querySelector('.e-frozenfootercontent').querySelector('.e-summaryrow').classList.contains('e-hide');
            expect(isHide).toBe(false);
        });

        afterAll(() => {
            gridObj['freezeModule'].destroy();
            destroy(gridObj);
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
            expect(gridObj.getContent().querySelector('.e-frozencontent').querySelector('tbody').childElementCount).toBeGreaterThan(1);
            expect(gridObj.getContent().querySelector('.e-frozencontent').querySelector('tbody').children[0].childElementCount).toBe(1);
        });

        it('Movable Content testing', () => {
            expect(gridObj.getContent().querySelector('.e-movablecontent').querySelector('tbody').childElementCount).toBeGreaterThan(1);
        });

        it('Aggregate checking', () => {
            expect(gridObj.element.querySelector('.e-summarycontent').childNodes.length).toBe(2);
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

        it('Ensure the grid table while dynamically disable isFrozen in the Grid column', (done: Function) => {
            (gridObj.columns[1] as Column).isFrozen = false;
            let dataBound = (args: Object) => {
                expect(gridObj.getContent().querySelector('.e-frozencontent')).toBeNull();
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.refreshColumns();
        });

        it('Ensure the grid table while dynamically enable isFrozen in the Grid column', (done: Function) => {
            (gridObj.columns[1] as Column).isFrozen = true;
            let dataBound = (args: Object) => {
                expect(gridObj.getContent().querySelector('.e-frozencontent')).not.toBeUndefined();
                expect(gridObj.getContent().querySelector('.e-frozencontent')).not.toBeNull();
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.refreshColumns();
        });

        it('Ensure the movable content colgroup count while dynamically enable isFrozen in the Grid column', (done: Function) => {
            (gridObj.columns[2] as Column).isFrozen = true;
            let dataBound = (args: Object) => {
                let mTblColgr: Element = gridObj.contentModule.getMovableContent().querySelector('colgroup');
                let mHdrColgr: Element = gridObj.getHeaderContent().querySelector('.e-movableheader').querySelector('colgroup');
                expect(mTblColgr.children.length).toBe(mHdrColgr.children.length);
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.refreshColumns();
        });

        afterAll(() => {
            gridObj['freezeModule'].destroy();
            destroy(gridObj);
        });
    });

    describe('Ensure deleteRow and deleteRecord with batch editing', () => {
        let gridObj: Grid;
        let dBound: () => void;
        let selectedRowIndex: number;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    height: 400,
                    frozenColumns: 2,
                    frozenRows: 2,
                    editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: false },
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true },
                        { headerText: 'CustomerID', field: 'CustomerID', isFrozen: true },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ]
                }, done);
        });
        it('Before delete', () => {
            gridObj.selectRow(4);
        });
        it('Enaure deleteRow method', (done: Function) => {
            selectedRowIndex = parseInt(gridObj.getSelectedRows()[0].getAttribute('aria-rowindex'), 10);
            let batchDelete = (args: Object) => {
                expect(gridObj.getMovableRows()[3].classList.contains('e-hiddenrow')).toBeTruthy();
                expect(gridObj.getFrozenDataRows().length).toBe(gridObj.currentViewData.length - 1);
                expect(gridObj.getMovableDataRows().length).toBe(gridObj.currentViewData.length - 1);
                selectedRowIndex = parseInt(gridObj.getSelectedRows()[0].getAttribute('aria-rowindex'), 10);
                expect(selectedRowIndex).toBe(3);
                gridObj.editModule.batchCancel();
                gridObj.batchDelete = null;
                done();
            };
            gridObj.batchDelete = batchDelete;
            gridObj.deleteRow(gridObj.getMovableRows()[3] as HTMLTableRowElement);
        });
        it('Before delete', () => {
            gridObj.selectRow(4);
        });
        it('Ensure deleteRecord mwthod', (done: Function) => {
            selectedRowIndex = parseInt(gridObj.getSelectedRows()[0].getAttribute('aria-rowindex'), 10);
            let batchDelete = (args: Object) => {
                expect(gridObj.getMovableRows()[3].classList.contains('e-hiddenrow')).toBeTruthy();
                expect(gridObj.getFrozenDataRows().length).toBe(gridObj.currentViewData.length - 1);
                expect(gridObj.getMovableDataRows().length).toBe(gridObj.currentViewData.length - 1);
                selectedRowIndex = parseInt(gridObj.getSelectedRows()[0].getAttribute('aria-rowindex'), 10);
                expect(selectedRowIndex).toBe(3);
                gridObj.editModule.batchCancel();
                gridObj.batchDelete = null;
                done();
            };
            gridObj.batchDelete = batchDelete;
            gridObj.deleteRecord('OrderID', gridObj.currentViewData[3]);
        });
        it('Ensure getFrozenRowByIndex', () => {
            let frozenRow: Element = gridObj.getFrozenRowByIndex(2);
            let rowindex: number = parseInt(frozenRow.getAttribute('aria-rowindex'), 10);
            expect(rowindex).toBe(2);
        });
        afterAll(() => {
            gridObj['freezeModule'].destroy();
            destroy(gridObj);
        });
    });
});