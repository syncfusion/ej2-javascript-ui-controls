import { TreeGrid} from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData } from '../base/datasource.spec';
import { Sort } from '../../src/treegrid/actions/sort';
import { Freeze } from '../../src/treegrid/actions/freeze-column';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Page } from '../../src/treegrid/actions/page';
import { createElement, EmitType, remove, extend, select } from '@syncfusion/ej2-base';
import { RowExpandedEventArgs, RowCollapsedEventArgs, RowCollapsingEventArgs } from '../../src';
import { projectDatas as data } from '../base/datasource.spec';
import { Filter } from '../../src/treegrid/actions/filter';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { ContextMenu } from '../../src/treegrid/actions/context-menu';


TreeGrid.Inject(Sort, Page, Filter, Toolbar, ContextMenu, Freeze);

describe('Render Frozen Rows and columns', () => {
    let gridObj1: TreeGrid;
    beforeAll((done: Function) => {

        gridObj1 = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                frozenRows: 2,
                frozenColumns: 3,
                pageSettings: {pageSize: 12, pageSizes: true},
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 100 },
                    { field: 'taskName', headerText: 'Task Name', width: 190 },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 100 },
                    { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 120 }
                ],
                height: 315
            },
            done
        );
    });
    it('Render the frozen rows', () => {
        expect(gridObj1.getRows()[0].closest('div').classList.contains('e-headercontent')).toBe(true);
        expect(gridObj1.getRows()[gridObj1.frozenRows].closest('div').classList.contains('e-content')).toBe(true);
        expect(gridObj1.getDataRows()[0].closest('div').classList.contains('e-headercontent')).toBe(true);
        expect(gridObj1.getDataRows()[gridObj1.frozenColumns].closest('div').classList.contains('e-content')).toBe(true);
    });
    it('onpropertychange columns', function () {
        gridObj1.frozenColumns = 2;
        expect(gridObj1.getCellFromIndex(1, 3).closest('div').classList.contains('e-headercontent')).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj1);
    });
});

describe('Render Frozen Rows and columns', () => {
    let gridObj1: TreeGrid;
    beforeAll((done: Function) => {

        gridObj1 = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                frozenRows: 2,
                frozenColumns: 3,
                pageSettings: {pageSize: 12, pageSizes: true},
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 100 },
                    { field: 'taskName', headerText: 'Task Name', width: 190 },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 100 },
                    { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 120 }
                ],
                height: 315
            },
            done
        );
    });
    it('onpropertychange Rows', function (done: Function) {
        gridObj1.dataBound = (args?: any) => {
            expect(gridObj1.getRows()[2].closest('div').classList.contains('e-headercontent')).toBe(true);
            done();
        };
        gridObj1.frozenRows = 3;
        gridObj1.dataBind();
    });
    afterAll(() => {
        destroy(gridObj1);
    });
});

describe('Render isFrozen rows', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {

        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                pageSettings: {pageSize: 12, pageSizes: true},
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 100 },
                    { field: 'taskName', headerText: 'Task Name', width: 190, isFrozen: true },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100, isFrozen: true },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 100 },
                    { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 120 }
                ],
                height: 315
            },
            done
        );
    });
    it('Check the isFrozen columns', () => {
        expect(gridObj.getColumns()[0].field).toBe('taskName');
        expect(gridObj.getColumns()[1].field).toBe('duration');
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Without paging in frozen Rows', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {

        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                frozenRows: 8,
                frozenColumns: 2,
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 100 },
                    { field: 'taskName', headerText: 'Task Name', width: 190 },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 100 },
                    { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 120 }
                ],
                height: 315
            },
            done
        );
    });
    it('Without Pager Mode - Checking collapse action', (done: Function) => {
        gridObj.collapsed = (args?: RowCollapsedEventArgs) => {
            const displayAction: any = [].slice.call(gridObj.element.getElementsByClassName('e-headercontent')[0].getElementsByClassName('e-row'));
            let rows: number = 0;
            const count = displayAction.filter((e: any) => {
                if (e.style.display === 'none' ) {
                    rows++;
                }
            });
            const frozenrows: number = ((gridObj.element.getElementsByClassName('e-headercontent')[0].getElementsByClassName('e-row').length) - rows);
            expect(frozenrows).toBe(6);
            done();
        };
        gridObj.collapseRow(gridObj.getRows()[5], gridObj.getCurrentViewRecords()[5]);
    });

    it('Without Pager Mode - Checking expand action', (done: Function) => {
        gridObj.expanded = (args?: RowExpandedEventArgs) => {
            expect(gridObj.element.getElementsByClassName('e-headercontent')[0].getElementsByClassName('e-row').length).toBe(8);
            done();
        };
        gridObj.expandRow(gridObj.getRows()[5], gridObj.getCurrentViewRecords()[5]);
        gridObj.freezeModule.destroy();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Checkbox in Frozen Rows and columns', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {

        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                frozenRows: 8,
                frozenColumns: 2,
                autoCheckHierarchy: true,
                pageSettings: {pageSize: 12, pageSizes: true},
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 100 },
                    { field: 'taskName', headerText: 'Task Name', width: 190, showCheckbox: true },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 100 },
                    { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 120 }
                ],
                height: 315
            },
            done
        );
    });
    it('check the checkbox column', () => {
        gridObj.selectCheckboxes([0]);
        expect(gridObj.getCheckedRecords().length).toBe(5);
        gridObj.freezeModule.destroy();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Remotedata in Frozenrows and column', () => {

  type MockAjaxReturn = { promise: Promise<Object>, request: JasmineAjaxRequest };
  type ResponseType = { result: Object[], count: number | string };

  const mockAjax: Function = (d: { data: { [o: string]: Object | Object[] } | Object[], dm?: DataManager }, query: Query | Function, response?: Object):
  MockAjaxReturn => {
      jasmine.Ajax.install();
      const dataManager: DataManager = d.dm || new DataManager({
          url: '/api/Employees'
      });
      const prom: Promise<Object> = dataManager.executeQuery(query);
      let request: JasmineAjaxRequest;
      const defaults: Object = {
          'status': 200,
          'contentType': 'application/json',
          'responseText': JSON.stringify(d.data)
      };
      const responses: Object = {};
      request = jasmine.Ajax.requests.mostRecent();
      extend(responses, defaults, response);
      request.respondWith(responses);
      return {
          promise: prom,
          request: request
      };
  };

  let gridObj: TreeGrid;
  const elem: HTMLElement = createElement('div', { id: 'Grid' });
  let request: JasmineAjaxRequest;
  let dataManager: DataManager;
  let originalTimeout: number;
  beforeAll((done: Function) => {
      const dataBound: EmitType<Object> = () => { done(); };
      spyOn(window, 'fetch').and.returnValue(
          Promise.resolve(
              new Response(JSON.stringify({ d: data, __count: 4 }), {
                  status: 200
              })
          )
      );
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
              parentIdMapping: 'parentID',
              treeColumnIndex: 1,
              frozenRows: 1,
              frozenColumns: 2,
              columns: [
                  { field: 'TaskID', headerText: 'Task Id' },
                  { field: 'TaskName', headerText: 'Task Name' },
                  { field: 'StartDate', headerText: 'Start Date' },
                  { field: 'EndDate', headerText: 'End Date' },
                  { field: 'Progress', headerText: 'Progress' }
              ]
          });
      gridObj.appendTo('#Grid');
      this.request = window.fetch['calls'].mostRecent();
  });
  it('Expanding remote frozen rows', () => {
      (<HTMLElement>gridObj.getRows()[0].querySelectorAll('.e-treegridcollapse')[0]).click();
      expect(gridObj.element.getElementsByClassName('e-headercontent')[0].getElementsByClassName('e-row').length).toBe(1);
      (<HTMLElement>gridObj.getRows()[0].querySelectorAll('.e-treegridexpand')[0]).click();
      expect(gridObj.element.getElementsByClassName('e-headercontent')[0].getElementsByClassName('e-row').length).toBe(1);
      gridObj.freezeModule.destroy();
  });
  afterAll(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      gridObj.destroy();
      remove(elem);
      jasmine.Ajax.uninstall();
  });
});

describe('Ensure freeze direction after removing freeze in columns', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                height: 410,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 100},
                    { field: 'taskName', headerText: 'Task Name', width: 250 },
                    { field: 'startDate', headerText: 'Start Date', width: 130, textAlign: 'Right',
                        type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
                    { field: 'endDate', headerText: 'End Date', width: 150, textAlign: 'Right',
                        type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 130 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 130 },
                    { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 160 },
                    { field: 'designation', headerText: 'Designation', textAlign: 'Left', width: 190 },
                    { field: 'employeeID', headerText: 'EmployeeID', textAlign: 'Left', width: 120 },
                    { field: 'approved', headerText: 'Approved', width: 140, displayAsCheckBox: true, textAlign: 'Left'}
                ]
            },
            done
        );
    });

    it('remove columns', (done: Function) => {
        const column: string = gridObj.getColumnFieldNames()[1];
        gridObj.grid.getColumnByField(column).freeze = 'Right';
        gridObj.refreshColumns();
        expect(gridObj.grid.getHeaderContent().scrollLeft).toBe(0);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('RowEdit in Frozen Rows and columns', () => {
    let gridObj3: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj3 = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                frozenRows: 6,
                frozenColumns: 2,
                editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Below'},
                pageSettings: {pageSize: 12, pageSizes: true},
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 100 },
                    { field: 'taskName', headerText: 'Task Name', width: 190 },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 100 },
                    { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 120 }
                ],
                height: 315
            },
            done
        );
    });
    it('Editing in frozen rows', () => {
        gridObj3.selectRow(1);
        actionComplete = (args?: any): void => {
            if (args.requestType === 'add') {
                expect((<any>gridObj3.element.getElementsByClassName('e-headercontent')[0].getElementsByClassName('e-addedrow')[0]).sectionRowIndex).toBe(2);
                (<any>gridObj3.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj3.grid.element.id + '_cancel' } });
            }
        };
        (<any>gridObj3.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj3.grid.element.id + '_add' } });
        gridObj3.actionComplete = actionComplete;
    });
    it('Record double click', () => {
        gridObj3.actionComplete = (args?: any): void => {
            if (gridObj3.element.getElementsByClassName('e-headercontent')[0].getElementsByClassName('e-editedrow').length > 0) {
                expect(<any>(gridObj3.element.getElementsByClassName('e-headercontent')[0].getElementsByClassName('e-editedrow')[0].getAttribute('data-rowindex'))).toBe(2);
            }
        };
        const event: MouseEvent = new MouseEvent('dblclick', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        gridObj3.getCellFromIndex(2, 1).dispatchEvent(event);
        gridObj3.actionComplete = actionComplete;
        // gridObj3.freezeModule.destroy();
    });
    afterAll(() => {
        destroy(gridObj3);
    });
});

describe('829685 - Frozen Rows and columns with enableCollapseAll', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {

        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                frozenRows: 3,
                frozenColumns: 2,
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID',  textAlign: 'Right', width: 100 },
                    { field: 'taskName', headerText: 'Task Name', width: 190 },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 100 },
                    { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 120 }
                ],
                height: 315
            },
            done
        );
    });
    it('Rendering check', (done: Function) => {
        expect(gridObj.grid.currentViewData.length > 1).toBe(true);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Bug 851412: script error throws on editing and focus out on a record', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                frozenColumns: 2,
                toolbar: ['Add', 'Delete', 'Update', 'Cancel', 'Indent', 'Outdent'],
                editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Batch', newRowPosition: 'Below'},
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true,  textAlign: 'Right', width: 100 },
                    { field: 'taskName', headerText: 'Task Name', width: 190 },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 100 },
                    { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 120 }
                ],
                height: 315
            },
            done
        );
    });
    it('Frozen with batch edit', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] === 'batchsave') {
                expect(gridObj.getCurrentViewRecords().length === 37).toBe(true);
                done();
            }
        };
        gridObj.selectRow(35);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 37;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
        gridObj.grid.actionComplete = actionComplete;
    });
    afterAll(() => {
        destroy(gridObj);
    });
});
