import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createElement, EmitType, remove, extend, isNullOrUndefined, removeClass, addClass } from '@syncfusion/ej2-base';
import { DataManager, Query, UrlAdaptor, ODataAdaptor } from '@syncfusion/ej2-data'
import { createGrid, destroy } from './treegridutil.spec';
import { sampleData, projectDatas as data } from './datasource.spec';
import { PageEventArgs, RowDataBoundEventArgs, Grid } from '@syncfusion/ej2-grids';
import { DataManipulation } from '../../src/treegrid/base/data';
import { Render } from '../../src/treegrid/renderer/render';
import { RowExpandedEventArgs } from '../../src';
import { profile, inMB, getMemoryProfile } from '../common.spec';


/**
 * Grid base spec 
 */
describe('DataSource onDemand', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
      });
    
    // describe('Remote data', () => {

    //     type MockAjaxReturn = { promise: Promise<Object>, request: JasmineAjaxRequest };
    //     type ResponseType = { result: Object[], count: number | string };

    //     let mockAjax: Function = (d: { data: { [o: string]: Object | Object[] } | Object[], dm?: DataManager }, query: Query | Function, response?: Object):
    //         MockAjaxReturn => {
    //         jasmine.Ajax.install();
    //         let dataManager = d.dm || new DataManager({
    //             url: '/api/Employees',
    //         });
    //         let prom: Promise<Object> = dataManager.executeQuery(query);
    //         let request: JasmineAjaxRequest;
    //         let defaults: Object = {
    //             'status': 200,
    //             'contentType': 'application/json',
    //             'responseText': JSON.stringify(d.data)
    //         };
    //         let responses: Object = {};
    //         request = jasmine.Ajax.requests.mostRecent();
    //         extend(responses, defaults, response);
    //         request.respondWith(responses);
    //         return {
    //             promise: prom,
    //             request: request
    //         }
    //     };

    //     let gridObj: TreeGrid;
    //     let elem: HTMLElement = createElement('div', { id: 'Grid' });
    //     let request: JasmineAjaxRequest;
    //     let dataManager: DataManager;
    //     let originalTimeout: number;
    //     beforeAll((done: Function) => {
    //         let dataBound: EmitType<Object> = () => { done(); };
    //         jasmine.Ajax.install();
    //         originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
    //         dataManager = new DataManager({
    //             url: 'http://localhost:50499/Home/UrlData',
    //             crossDomain: true
    //         });
    //         document.body.appendChild(elem);
    //         gridObj = new TreeGrid(
    //             {
    //                 dataSource: dataManager, dataBound: dataBound,
    //                 hasChildMapping: 'isParent',
    //                 idMapping: 'TaskID',
    //                 parentIdMapping: 'ParentID',
    //                 treeColumnIndex: 1,
    //                 columns: [
    //                     { field: "TaskID", headerText: "Task Id" },
    //                     { field: "TaskName", headerText: "Task Name" },
    //                     { field: "StartDate", headerText: "Start Date" },
    //                     { field: "EndDate", headerText: "End Date" },                    
    //                     { field: "Progress", headerText: "Progress" }
    //               ]
    //             });
    //         gridObj.appendTo('#Grid');
    //         this.request = jasmine.Ajax.requests.mostRecent();
    //         this.request.respondWith({
    //             status: 200,
    //             responseText: JSON.stringify({ d: data.filter(e=>{ return isNullOrUndefined(e['parentID']);}), __count: 15 })
    //         });
    //     });

    //     it('TR generated testing', (done: Function) => {
    //         expect(gridObj.getRows().length).toBe(2);
    //         document.getElementsByClassName("e-treegridcollapse")[0]['click']();
    //         gridObj.actionComplete = (args?: Object) => {
    //             if(args['action'] === 'beforecontentrender') {
    //                 expect(args['result'].length === 5).toBe(true);
    //                 expect(args['result'][1].expanded).toBe(false);
    //                 args['result'][1].expanded = true;
    //                 args['result'][2].parentIndex = args['result'][2].index;
    //                 args['result'][2].level = 2;
    //                 args['result'][2].expanded = true;
    //                 args['result'][3].parentIndex = args['result'][2].index;
    //                 args['result'][3].level = 3;
    //             }
    //         };
    //         gridObj.expanded = (args?: RowExpandedEventArgs) => {
    //             expect(args.row.className.indexOf('e-row') !== -1).toBeTruthy();
    //             gridObj.collapseRow(gridObj.getRows()[0], gridObj.getCurrentViewRecords()[0]);
    //             console.log(gridObj.element.querySelectorAll('.e-treegridexpand').length);
    //             expect(gridObj.element.querySelectorAll('.e-treegridexpand').length).toBe(1);
    //             done();
    //         };
    //         this.request = jasmine.Ajax.requests.mostRecent();
    //         this.request.respondWith({
    //             status: 200,
    //             responseText: JSON.stringify({ d: [{isParent: true,  'TaskID': 2,
    //             'TaskName': 'Child Task 1',
    //             'StartDate': new Date('02/23/2014'),
    //             'EndDate': new Date('02/27/2014'),
    //             'Progress': '40', hasChildRecords: true, expanded: true},
    //             { 'TaskID': 3,
    //             'TaskName': 'Child Task 1',
    //             'StartDate': new Date('02/23/2014'),
    //             'EndDate': new Date('02/27/2014'),
    //             'Progress': '40', parentID: 2, hasChildRecords: true, expanded: true },
    //             { 'TaskID': 4,
    //             'TaskName': 'Child Task 1',
    //             'StartDate': new Date('02/23/2014'),
    //             'EndDate': new Date('02/27/2014'),
    //             'Progress': '40', parentID: 3}
    //         ], __count: 15, nextLevel: [true] })
    //         });
    //     });
    //     it('TR generated local expand testing', (done: Function) => {
    //         gridObj.expanded  = function (args) {
    //             expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(1);
    //             done();
    //         }
    //         gridObj.expandRow(gridObj.getRows()[0], gridObj.getCurrentViewRecords()[0]);
    //     });
    //     afterAll(() => {
    //         jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    //         gridObj.destroy();
    //         remove(elem);
    //         jasmine.Ajax.uninstall();
    //     });
    // });
    describe('datamanager offline - success testing', () => {
        let gridObj: TreeGrid;
        let dataManager: DataManager;
        let request: JasmineAjaxRequest;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let value : any = data.slice(0,4)
            spyOn(window, 'fetch').and.returnValue(Promise.resolve(
                new Response(JSON.stringify(value), {
                    status: 200,
                })
            ));
            dataManager = new DataManager({
                url: '/test/db',
                offline: true,
                crossDomain: true,
                adaptor: new ODataAdaptor
                }
            );
            request = window.fetch['calls'].mostRecent();
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new TreeGrid(
                {
                    dataSource: dataManager, dataBound: dataBound,
                    hasChildMapping: 'isParent',
                    idMapping: 'TaskID',
                    parentIdMapping: 'ParentID',
                    treeColumnIndex: 1,
                    columns: [
                        { field: "TaskID", headerText: "Task Id" },
                        { field: "TaskName", headerText: "Task Name" },
                        { field: "StartDate", headerText: "Start Date" },
                        { field: "EndDate", headerText: "End Date" },                    
                        { field: "Progress", headerText: "Progress" }
                  ]
                });
            gridObj.appendTo('#Grid');
        });

        it('promise test', () => {
            expect(dataManager.ready).not.toBeNull();
            expect(dataManager.dataSource.json.length).toBe(4);
        });

        it('Row count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(4);
        });

        afterAll(() => {
            gridObj.destroy();
            jasmine.Ajax.uninstall();
            remove(elem);
        });

    });
    describe('datamanager cell collapse', () => {
        let gridObj: TreeGrid;
        let dataManager: DataManager;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            dataManager = new DataManager({
                url: '/test/db',
                crossDomain: true,
                adaptor: new ODataAdaptor
                }
            );
            document.body.appendChild(elem);

            gridObj = new TreeGrid(
                {
                    dataSource: dataManager,
                    hasChildMapping: 'isParent',
                    idMapping: 'taskID',
                    parentIdMapping: 'ParentID',
                    treeColumnIndex: 1,
                    columns: [
                        { field: "TaskID", headerText: "Task Id" },
                        { field: "TaskName", headerText: "Task Name" },
                        { field: "StartDate", headerText: "Start Date" },
                        { field: "EndDate", headerText: "End Date" },                    
                        { field: "Progress", headerText: "Progress" }
                  ]
                });
                done();
            //gridObj.appendTo('#Grid');
        });

        it('promise test', (done: Function) => {
            gridObj.grid = new Grid();
            
            gridObj.rowDataBound = (args?: RowDataBoundEventArgs) => {
                expect(args.row.getAttribute('style')).toBe('display: table-row;');
                done();
            }
            gridObj.grid.currentViewData = [{"taskID":1,"taskName":"Planning", expanded: true },{"taskID":2, ParentID: 1, "taskName":"Plan timeline"},{"taskID":3,"taskName":"Plan budget"},{"taskID":4,"taskName":"Allocate resources"}]
            gridObj.renderModule = new Render(gridObj);
            let row: Element = createElement('tr', { className: 'e-row'})
            let args: RowDataBoundEventArgs = {data: {"taskID":2, ParentID: 1, "taskName":"Plan timeline"}, row: row};
            gridObj.renderModule.RowModifier(args);
            expect(args.row.getAttribute('style')).toBe('display: table-row;');
        });

        afterAll(() => {
            gridObj.renderModule = null;
            remove(elem);
        });

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
});
