/**
 * Content renderer spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

describe('Content renderer module', () => {

    describe('grid content element testing', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    query: new Query().take(5), allowPaging: false, enableAltRow: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ]
                }, done);
        });

        it('Content div testing', () => {
            expect(gridObj.element.querySelectorAll('.e-gridcontent').length).toBe(1);
        });

        it('Content table testing', () => {
            expect(gridObj.contentModule.getPanel().querySelectorAll('.e-table').length).toBe(1);
        });

        it('Content cell count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row')[0].childNodes.length).toBe(gridObj.getColumns().length);
        });

        it('getRows', () => {
            expect(gridObj.contentModule.getRows().length).toBe(5);
            //for coverage 
            (<any>gridObj.contentModule).setColGroup(undefined);
            (<any>gridObj.contentModule).colGroupRefresh();
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
            gridObj = null;
        });

    });

    describe('EJ2-49706 - MutableData doesn’t work for date values in the dataSource', () => {
        let gridObj: Grid;
        let sampleData1: Object[] = [
            { taskID: 1, taskName: 'Planning', progress: 100, duration: 5, priority: 'Normal', approved: false, OrderDate: new Date('02/27/2017') }
        ];
        let sampleData2: Object[] = [
            { taskID: 1, taskName: 'Planning', progress: 100, duration: 5, priority: 'Normal', approved: false, OrderDate: new Date('02/27/2017') }
        ];
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: sampleData1,
                    enableImmutableMode: true,
                    columns: [
                        { headerText: 'taskID', field: 'taskID', isPrimaryKey: true },
                        { headerText: 'taskName', field: 'taskName' },
                        { headerText: 'progress', field: 'progress' },
                        { headerText: 'priority', field: 'priority' }
                    ]
                }, done);
        });

        it('reassign same data to grid', (done: Function) => {
            let count: number = 0;
            gridObj.dataBound = null;
            let dataBound = () => {
                expect(count).toBe(0);
                gridObj.rowDataBound = null;
                gridObj.dataBound = null;
                done();
            };
            let rowDataBound = () => {
                count++;
            };
            gridObj.dataBound = dataBound;
            gridObj.rowDataBound = rowDataBound;
            (gridObj.contentModule as any).mutableData = true;
            gridObj.dataSource = sampleData2;
        });
        
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });

    });

    describe('EJ2-49853 - Update the reordered data in immutable mode re-renders multiple rows', () => {
        let gridObj: Grid;
        let sampleData1: Object[] = [
            { taskID: 1, taskName: 'Planning', progress: 100, duration: 5, priority: 'Normal', approved: false },
            { taskID: 2, taskName: 'Plan timeline', parentId: 1, duration: 5, progress: 100, priority: 'Normal', approved: false },
            { taskID: 3, parentId: 1, taskName: 'Plan budget', duration: 5, progress: 100, priority: 'Low', approved: true }
        ];
        let sampleData2: Object[] = [
            { taskID: 1, taskName: 'Planning', progress: 100, duration: 5, priority: 'Normal', approved: false },
            { taskID: 3, parentId: 1, taskName: 'Plan budget', duration: 5, progress: 100, priority: 'Low', approved: true },
            { taskID: 2, taskName: 'Plan timeline', parentId: 1, duration: 5, progress: 100, priority: 'Normal', approved: false }
        ];
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: sampleData1,
                    enableImmutableMode: true,
                    columns: [
                        { headerText: 'taskID', field: 'taskID', isPrimaryKey: true },
                        { headerText: 'taskName', field: 'taskName' },
                        { headerText: 'progress', field: 'progress' },
                        { headerText: 'priority', field: 'priority' }
                    ]
                }, done);
        });

        it('update redordered data', (done: Function) => {
            let count: number = 0;
            gridObj.dataBound = null;
            let dataBound = () => {
                expect(count).toBe(0);
                gridObj.rowDataBound = null;
                gridObj.dataBound = null;
                done();
            };
            let rowDataBound = () => {
                count++;
            };
            gridObj.dataBound = dataBound;
            gridObj.rowDataBound = rowDataBound;
            (gridObj.contentModule as any).mutableData = true;
            gridObj.dataSource = sampleData2;
        });
        
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });

    });

});