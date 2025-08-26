import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createElement, EmitType, remove, extend } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { projectDatas as data } from './datasource.spec';
  
describe('OnDemand load Child', () => {

    type MockAjaxReturn = { promise: Promise<Object>, request: JasmineAjaxRequest };
    type ResponseType = { result: Object[], count: number | string };

    let mockAjax: Function = (d: { data: { [o: string]: Object | Object[] } | Object[], dm?: DataManager }, query: Query | Function, response?: Object):
        MockAjaxReturn => {
        jasmine.Ajax.install();
        let dataManager = d.dm || new DataManager({
            url: '/api/Employees',
        });
        let prom: Promise<Object> = dataManager.executeQuery(query);
        let request: JasmineAjaxRequest;
        let defaults: Object = {
            'status': 200,
            'contentType': 'application/json',
            'responseText': JSON.stringify(d.data)
        };
        let responses: Object = {};
        request = jasmine.Ajax.requests.mostRecent();
        extend(responses, defaults, response);
        request.respondWith(responses);
        return {
            promise: prom,
            request: request
        }
    };

    let gridObj: TreeGrid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let request: JasmineAjaxRequest;
    let dataManager: DataManager;
    let originalTimeout: number;
    beforeAll((done: Function) => {
        let dataBound: EmitType<Object> = () => { done(); };
        spyOn(window, 'fetch').and.returnValue(Promise.resolve(
            new Response(JSON.stringify({ d:  data.slice(0,3), __count: 3}), {
                status: 200,

            })
        ));
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
        dataManager = new DataManager({
            url: 'http://localhost:50499/Home/UrlData',
            crossDomain: true
        });
        document.body.appendChild(elem);
        gridObj = new TreeGrid(
            {
                dataSource: dataManager, dataBound: dataBound,
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                loadChildOnDemand: false,
                parentIdMapping: 'parentID',
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
        request = window.fetch['calls'].mostRecent();
    });

    it('Render the data with expaned state', () => {
            expect(gridObj.element.querySelectorAll('.e-treegridexpand').length).toBe(1);
            expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(0);
            expect(gridObj.getRows().length).toBe(3);
    });
    it('CollapseAll method testing', () => {
        gridObj.collapseAll();
        expect(gridObj.element.querySelectorAll('.e-treegridexpand').length).toBe(0);
    });
    it('ExpandAll method testing', () => {
        gridObj.expandAll();
        expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(0);
    });
    afterAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        gridObj.destroy();
        remove(elem);
        jasmine.Ajax.uninstall();
    });
});
