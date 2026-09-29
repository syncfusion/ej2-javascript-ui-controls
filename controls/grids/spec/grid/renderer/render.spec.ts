/**
 * Render spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { RowDataBoundEventArgs } from '../../../src/grid/base/interface';
import { Column } from '../../../src/grid/models/column';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

describe('Render module', () => {
    describe('Grid render', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                        { headerText: 'OrderDate', field: 'OrderDate', format: 'long', type: 'datetime' },
                    ]
                }, done);
        });

        it('Row count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(data.length);
            //for coverage
            (gridObj.getColumns() as Column[])[0].type = undefined;
            (gridObj.getColumns() as Column[])[1].type = undefined;
            (gridObj.getColumns() as Column[])[2].type = undefined;
            (gridObj.getColumns() as Column[])[3].type = undefined;
            (gridObj.getColumns() as Column[])[4].type = undefined;
            (<any>gridObj.renderModule).updateColumnType({
                OrderID: new Date(2017, 2, 13, 0, 0, 0, 10),
                EmployeeID: new Date(2017, 2, 13, 0, 0, 10, 0), CustomerID: new Date(2017, 2, 13, 0, 10, 0, 0),
                ShipCity: new Date(2017, 2, 13, 10, 0, 0, 0), ShipCountry: new Date(2017, 2, 13, 0, 0, 0, 0), OrderDate: new Date(2017, 2, 13, 0, 10, 0, 10)
            });
            (<any>gridObj.renderModule).data.removeRows({ indexes: [4, 5], records: data.slice(4, 5)  });
            gridObj.ariaService.setOptions(null, { role: 'grid' });
        });

        afterAll(() => {
            destroy(gridObj);
        });

    });

    describe('Grid render without columns testing', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data, allowPaging: false
                }, done);
        });

        it('Column count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-headercell').length).toBe(gridObj.getColumns().length);
        });

        it('Content cell count testing', () => {
            let cols = gridObj.getColumns();
            expect(gridObj.element.querySelectorAll('.e-row')[0].childNodes.length).toBe(cols.length);
            cols = [];
            (<any>gridObj.renderModule).dataManagerSuccess({ result: {}, count: 0 });//for coverage
			gridObj.isDestroyed = true;
			(<any>gridObj.renderModule).addEventListener();
			gridObj.isDestroyed = false;
        });

        afterAll(() => {
            destroy(gridObj);
        });

    });


    describe('Column type testing with empty data source', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [], allowPaging: false,
                    columns: [
                        { field: 'Column1', type: 'string' },
                        { field: 'Column2' }
                    ]
                }, done);
        });

        it('Column type testing', () => {
            expect((<Column>gridObj.columns[0]).type).toBe('string');
            expect((<Column>gridObj.columns[1]).type).toBeNull();
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });
    describe('Row height checking', () => {
    let gridObj: Grid;

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowPaging: false,
                columns: [
                    { headerText: 'OrderID', field: 'OrderID' },
                    { headerText: 'CustomerID', field: 'CustomerID' },
                    { headerText: 'EmployeeID', field: 'EmployeeID' },
                    { headerText: 'ShipCountry', field: 'ShipCountry' },
                    { headerText: 'ShipCity', field: 'ShipCity' },
                    { headerText: 'OrderDate', field: 'OrderDate', format: 'long', type: 'datetime' },
                ],
                rowHeight: 50,
                rowDataBound: (args: RowDataBoundEventArgs) => {
                    if ((args.data as Customer).CustomerID === 'VICTE' ) {
                        args.rowHeight = 80;
                    }
                }
            }, done);
    });

    it('Row height API checking  checking', () => {
        expect((gridObj.element.querySelectorAll('.e-row')[0] as HTMLElement).style.height).toBe('50px');
    });
    
    it('Row height on property change checking', () => {
        gridObj.rowHeight = 20;
        gridObj.dataBind();
        expect((gridObj.element.classList.contains('e-grid-min-height'))).toBeTruthy();
        gridObj.rowHeight = null;
        gridObj.dataBind();
        expect((gridObj.element.classList.contains('e-grid-min-height'))).toBeFalsy();
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

describe('EJ2-920242 : Excel Filter Not Displaying Given Filter Values When No Data Exists Between the Filtered Range', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowFiltering: true,
                allowPaging: true,
                filterSettings: {
                  type: 'Excel',
                  columns: [
                    {
                      field: 'ShipName',
                      matchCase: false,
                      operator: 'startswith',
                      predicate: 'and',
                      value: 'John',
                    },
                  ],
                },
                columns: [
                  {
                    field: 'OrderID',
                    headerText: 'Order ID',
                    textAlign: 'Right',
                    width: 100,
                  },
                  { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                  { field: 'ShipName', headerText: 'Ship Name', width: 100 },
                ],
            }, done);
    });

    it('Filter Column testing', (done: Function) => {
        expect((gridObj.filterModule as any).actualPredicate.ShipName.length).toBe(1);
        done();
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Additional Render coverage', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid({ dataSource: data.slice(0, 5), allowPaging: false,
            columns: [ { headerText: 'OrderID', field: 'OrderID' }, { headerText: 'CustomerID', field: 'CustomerID' }, {headerText: 'Freight', field: 'Freight'}]
        }, done);
    });

    it('resetTemplates covers template branches safely', (done: Function) => {
        gridObj.detailTemplate = '<div>detail</div>' as any;
        gridObj.groupSettings = { captionTemplate: '<span>g</span>', columns: [] } as any;
        gridObj.rowTemplate = '<div>row</div>' as any;
        gridObj.toolbarTemplate = '<div>tb</div>' as any;
        gridObj.pageSettings = { template: '<div>p</div>' } as any;
        (gridObj as any).columns[0].template = '<span>ID: ${OrderID}</span>';
        (gridObj as any).columns[0].headerTemplate = '<b>Order</b>';
        (gridObj as any).columns[0].filterTemplate = '<input type="text" />';
        gridObj.aggregates = [{ columns: [{type: 'Sum', field: 'Freight', footerTemplate: 'Total: ${Sum}', groupFooterTemplate: 'Grp: ${Sum}', groupCaptionTemplate: 'Caption ${Sum}'}] } as any];
        (<any>gridObj.renderModule).resetTemplates();
        done();
    });

    it ('resetPartialRecords coverage', (done: Function) => {
        gridObj.isRowSelectable = () => true;
        gridObj.isRemote = () => true;
        gridObj.renderModule.resetPartialRecords();
        done();
    });

    it('dataManagerSuccess - returns early when parent isDestroyed', (done: Function) => {
        const rm = (<any>gridObj.renderModule);
        gridObj.isDestroyed = true;
        spyOn(gridObj, 'trigger').and.callFake((name: string, e: any, cb: Function) => { cb({ result: [], count: 0 }); });
        rm.dataManagerSuccess({ result: [] , count: 0}, { requestType: 'refresh' });
        gridObj.isDestroyed = false;
        done();
    });

    it('dataManagerSuccess - hides spinner and returns when no columns and empty result', (done: Function) => {
        const rm = (<any>gridObj.renderModule);
        gridObj.setProperties({ columns: [] }, true);
        rm.dataManagerSuccess({ result: [], count: 0 }, { requestType: 'refresh' });
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Render → sendBulkRequest coverage (batchsave)', () => {
    let grid: Grid;
    beforeAll((done: Function) => {
        grid = createGrid(
            {
                dataSource: data,
                allowPaging: true,
                pageSettings: { pageSize: 12, pageSizes: [10, 12, 20, 'All'] },
                editSettings: { allowAdding: true, mode: 'Batch', allowEditing: true },
                columns: [{ field: 'OrderID', isPrimaryKey: true }, {field:'CustomerID'}]
            }, done);
    });

    it('should reset isAllPage when batch changes exist in remote paging with pageSizes', (done: Function) => {
        grid.pagerModule.pagerObj.isAllPage = true;
        grid.pagerModule.pagerObj.checkAll = true;
        const args = {
            changes: {
                addedRecords: [],
                changedRecords: [],
                deletedRecords: []
            }
        } as any;
        (grid as any).renderModule.sendBulkRequest(args);
        done();
    });

    it('should chain to getData → dmSuccess on promise resolve (online)', (done: Function) => {
        (grid as any).renderModule.data.dataManager.dataSource.offline = false;
        const args: any = {
            changes: {
                addedRecords: [{ OrderID: 100001 }],
                changedRecords: [],
                deletedRecords: []
            }
        } as any;
        const fakePromise = Promise.resolve({ result: [], count: 0 });
        spyOn((grid as any).renderModule.data, 'saveChanges').and.returnValue(fakePromise);
        spyOn((grid as any).renderModule.data, 'getData').and.returnValue(Promise.resolve({ result: [], count: 0 }));
        spyOn((grid as any).renderModule, 'dataManagerSuccess');
        (grid as any).renderModule.sendBulkRequest(args);
        done();
    });

    it('should call dmFailure on saveChanges reject', (done: Function) => {
        const fakeReject = Promise.reject({ message: 'error' });
        const args: any = {
            changes: {
                addedRecords: [],
                changedRecords: [],
                deletedRecords: []
            }
        } as any;
        spyOn((grid as any).renderModule.data, 'saveChanges').and.returnValue(fakeReject);
        spyOn((grid as any).renderModule, 'dataManagerFailure');
        (grid as any).renderModule.sendBulkRequest(args);
        done();
    });

    afterAll(() => {
        destroy(grid);
        grid = null;
    });
});

describe('extendDataManagerSuccess coverage', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid({ dataSource: data.slice(0, 5), allowPaging: false,
            columns: [ { headerText: 'OrderID', field: 'OrderID' }, { headerText: 'CustomerID', field: 'CustomerID' }, {headerText: 'Freight', field: 'Freight'}]
        }, done);
    });

    it('extendDataManagerSuccess - infinite end with no len calls infiniteEditHandler', (done: Function) => {
        const rm = (<any>gridObj.renderModule);
        const args: any = { requestType: 'refresh' };
        const e: any = { result: [], count: 0 };
        spyOn(rm, 'isInfiniteEnd').and.returnValue(true);
        rm.extendDataManagerSuccess(e, args, 0, { result: [], count: 0 }, true);
        done();
    });

    it('extendDataManagerSuccess - destroys widgets when showAddNewRow + delete', (done: Function) => {
        const rm = (<any>gridObj.renderModule);
        const args: any = { requestType: 'delete' };
        const e: any = { result: [], count: 0 };
        gridObj.editSettings = { showAddNewRow: true } as any;
        gridObj.groupSettings = {enableLazyLoading: true};
        gridObj.editModule = { destroyWidgets: jasmine.createSpy('destroyWidgets'), destroyForm: jasmine.createSpy('destroyForm') } as any;
        rm.extendDataManagerSuccess(e, args, 1, { result: [{}], count: 1, actual: { lazyLoadRecordsCount: 5 }}, false);
        done();
    });

    it('extendDataManagerSuccess - paging branch sets prevPageMoving and pageSettings', (done: Function) => {
        const rm = (<any>gridObj.renderModule);
        const args: any = { requestType: 'grouping' };
        const e: any = { result: [{}, {}], count: 7 };
        gridObj.allowPaging = true;
        rm.extendDataManagerSuccess(e, args, 0, { result: [], count: 7 }, false);
        done();
    });
    it('extendDataManagerSuccess - isCaptionCollapse is true', (done: Function) => {
        const rm = (<any>gridObj.renderModule);
        gridObj.allowPaging = false;
        const args: any = { isCaptionCollapse: true };
        const e: any = { result: [{}, {}], count: 7 };
        rm.extendDataManagerSuccess(e, args, 0, { result: [], count: 7 }, false);
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2_1021756 Script error throws when using only skeleton without type in format property in date column', ()=> {
    let gridObj: Grid;
    beforeAll( (done: Function)=> {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { headerText: 'OrderID', field: 'OrderID' },
                    { headerText: 'CustomerID', field: 'CustomerID' },
                    { headerText: 'OrderDate', field: 'OrderDate', format: {skeleton: 'GyMMMEd'} }
                ]
        }, done);
    });
    it('Expect date column should load data without type in the format', ()=> {
        let record: any = gridObj.getRows()[0];
        let cells = record.cells;
        expect(cells[2].innerText).not.toBe('');
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });    
});

describe('Empty Record Mode Feature Tests', () => {
    describe('Normal Mode (Row Display) - Default Behavior', () => {
        let gridObj: Grid;
        
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'Freight', field: 'Freight' }
                    ],
                    emptyRecordMode: 'Normal'
                }, done);
        });

        it('should render empty record as table row in Normal mode', () => {
            const emptyRow = gridObj.element.querySelector('.e-emptyrow');
            expect(emptyRow).toBeTruthy();
            expect(emptyRow.tagName.toLowerCase()).toBe('tr');
        });

        it('should not display overlay in Normal mode', () => {
            const overlay = gridObj.element.querySelector('.e-empty-row-sticky');
            expect(overlay).toBeFalsy();
        });

        it('should display default empty message in Normal mode', () => {
            const emptyRow = gridObj.element.querySelector('.e-emptyrow');
            const td = emptyRow.querySelector('td');
            expect(td.textContent).toContain('No records to display');
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Sticky Mode (Overlay Display)', () => {
        let gridObj: Grid;
        
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'Freight', field: 'Freight' }
                    ],
                    emptyRecordMode: 'Sticky'
                }, done);
        });

        it('should render empty record as overlay in Sticky mode', () => {
            const overlay = gridObj.element.querySelector('.e-empty-row-sticky');
            expect(overlay).toBeTruthy();
            expect(overlay.classList.contains('e-empty-row-sticky')).toBe(true);
        });

        it('should display overlay content div with correct class', () => {
            const overlayContent = gridObj.element.querySelector('.e-empty-row-sticky-content');
            expect(overlayContent).toBeTruthy();
            expect(overlayContent.classList.contains('e-empty-row-sticky-content')).toBe(true);
        });

        it('should display default empty message in overlay', () => {
            const overlayContent = gridObj.element.querySelector('.e-empty-row-sticky-content');
            expect(overlayContent.textContent).toContain('No records to display');
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Empty Record Template in Normal Mode', () => {
        let gridObj: Grid;
        
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' }
                    ],
                    emptyRecordMode: 'Normal',
                    emptyRecordTemplate: () => '<div class="custom-empty">Custom Empty Template</div>'
                }, done);
        });

        it('should render custom template in empty row', () => {
            const emptyRow = gridObj.element.querySelector('.e-emptyrow');
            const td = emptyRow.querySelector('td');
            expect(td).toBeTruthy();
        });

        it('should display empty row as table row with custom template', () => {
            const emptyRow = gridObj.element.querySelector('.e-emptyrow');
            expect(emptyRow.tagName.toLowerCase()).toBe('tr');
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Empty Record Template in Sticky Mode', () => {
        let gridObj: Grid;
        
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' }
                    ],
                    emptyRecordMode: 'Sticky',
                    emptyRecordTemplate: () => '<div class="custom-empty-sticky">Custom Sticky Template</div>'
                }, done);
        });

        it('should render custom template in overlay', () => {
            const overlayContent = gridObj.element.querySelector('.e-empty-row-sticky-content');
            expect(overlayContent).toBeTruthy();
        });

        it('should display overlay with fixed positioning', () => {
            const overlay = gridObj.element.querySelector('.e-empty-row-sticky');
            expect(overlay).toBeTruthy();
            expect(overlay.classList.contains('e-empty-row-sticky')).toBe(true);
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Dynamic Mode Switching', () => {
        let gridObj: Grid;
        
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' }
                    ],
                    emptyRecordMode: 'Normal'
                }, done);
        });

        it('should switch from Normal to Sticky mode', (done: Function) => {
            gridObj.emptyRecordMode = 'Sticky';
            gridObj.dataBind();
            setTimeout(() => {
                const overlay = gridObj.element.querySelector('.e-empty-row-sticky');
                expect(overlay).toBeTruthy();
                done();
            }, 100);
        });

        it('should switch from Sticky to Normal mode', (done: Function) => {
            gridObj.emptyRecordMode = 'Normal';
            gridObj.dataBind();
            setTimeout(() => {
                const overlay = gridObj.element.querySelector('.e-empty-row-sticky');
                const emptyRow = gridObj.element.querySelector('.e-emptyrow');
                expect(emptyRow).toBeTruthy();
                expect(overlay).toBeFalsy();
                done();
            }, 100);
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Empty Data Clearing', () => {
        let gridObj: Grid;
        
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 5),
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' }
                    ],
                    emptyRecordMode: 'Sticky'
                }, done);
        });

        it('should load data in Sticky mode', () => {
            const rows = gridObj.element.querySelectorAll('.e-row');
            expect(rows.length).toBeGreaterThan(0);
            const overlay = gridObj.element.querySelector('.e-empty-row-sticky');
            expect(overlay).toBeFalsy();
        });

        it('should clear table rows when loading empty data', (done: Function) => {
            gridObj.dataBound = function () {
                var rows = gridObj.element.querySelectorAll('.e-row');
                expect(rows.length).toBe(0);
                var overlay = gridObj.element.querySelector('.e-empty-row-sticky');
                expect(overlay).toBeTruthy();
                done();
            }
            gridObj.dataSource = [];
        });

        it('should clear overlay when loading new data', (done: Function) => {
           gridObj.dataBound = function () {
                var rows = gridObj.element.querySelectorAll('.e-row');
                expect(rows.length).toBeGreaterThan(0);
                var overlay = gridObj.element.querySelector('.e-empty-row-sticky');
                expect(overlay).toBeFalsy();
                done();
            };
            gridObj.dataSource = data.slice(0, 5);
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Empty Mode with Data Loading', () => {
        let gridObj: Grid;
        
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'Freight', field: 'Freight' }
                    ],
                    emptyRecordMode: 'Normal'
                }, done);
        });

        it('should show empty row when grid loads with no data', () => {
            const emptyRow = gridObj.element.querySelector('.e-emptyrow');
            expect(emptyRow).toBeTruthy();
        });

        it('should replace empty row with data rows when data is loaded', (done: Function) => {
            gridObj.dataBound = function () {
                const emptyRow = gridObj.element.querySelector('.e-emptyrow');
                const dataRows = gridObj.element.querySelectorAll('.e-row');
                expect(emptyRow).toBeFalsy();
                expect(dataRows.length).toBe(3);
                done();
            };
            gridObj.dataSource = data.slice(0, 3);
        });

        it('should show empty row again when data is cleared', (done: Function) => {
            gridObj.dataBound = function () {
                const emptyRow = gridObj.element.querySelector('.e-emptyrow');
                const dataRows = gridObj.element.querySelectorAll('.e-row');
                expect(emptyRow).toBeTruthy();
                expect(dataRows.length).toBe(0);
                done();
            };
            gridObj.dataSource = [];
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Empty Mode Default Value', () => {
        let gridObj: Grid;
        
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' }
                    ]
                }, done);
        });

        it('should default to Normal mode when emptyRecordMode is not specified', () => {
            expect(gridObj.emptyRecordMode).toBe('Normal');
            const emptyRow = gridObj.element.querySelector('.e-emptyrow');
            expect(emptyRow).toBeTruthy();
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

});

});
interface Customer {
    CustomerID: string;
}