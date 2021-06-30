import { TreeGrid} from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData } from '../base/datasource.spec';
import { Sort } from '../../src/treegrid/actions/sort';
import { Freeze } from '../../src/treegrid/actions/freeze-column'; 
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Page } from '../../src/treegrid/actions/page';
import { createElement, EmitType, remove, extend } from '@syncfusion/ej2-base';
import { RowExpandedEventArgs, RowCollapsedEventArgs, RowCollapsingEventArgs } from '../../src';
import { projectDatas as data } from '../base/datasource.spec';
import { Filter } from '../../src/treegrid/actions/filter';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { ContextMenu } from '../../src/treegrid/actions/context-menu';


TreeGrid.Inject(Sort, Page, Filter, Toolbar, ContextMenu, Freeze);

describe('Render Frozen Rows and columns', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionBegin: () => void;
    let actionComplete: () => void;
    let dataBound: () => void;
    let actionFailure: () => void;
    beforeAll((done: Function) => {
        
      gridObj = createGrid(
        {
            dataSource: sampleData,
            childMapping: 'subtasks',
            allowPaging:true,
            frozenRows: 2,
            frozenColumns: 3,
            pageSettings: {pageSize: 12, pageSizes: true},
            treeColumnIndex: 1,
            columns: [
                { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 100 },
                { field: 'taskName', headerText: 'Task Name', width: 190 },
                { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100 },
                { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 100 },
                { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 120 },
            ],
            height: 315
        },
        done
      );
    });
    it('Render the frozen rows', () => {
        expect(gridObj.getRows()[0].closest('div').classList.contains("e-frozenheader")).toBe(true);
        expect(gridObj.getRows()[gridObj.frozenRows].closest('div').classList.contains("e-frozencontent")).toBe(true);
        expect(gridObj.getMovableDataRows()[0].closest('div').classList.contains("e-movableheader")).toBe(true);
        expect(gridObj.getMovableDataRows()[gridObj.frozenColumns].closest('div').classList.contains("e-movablecontent")).toBe(true);
     });
     it('onpropertychange columns', function () {
        gridObj.frozenColumns = 2;
        expect(gridObj.getMovableCellFromIndex(1,3).closest('div').classList.contains("e-movableheader")).toBe(true);
    });
    it('onpropertychange Rows', function (done: Function) {
      gridObj.dataBound = (args?: any) => {
        expect(gridObj.getRows()[2].closest('div').classList.contains("e-frozenheader")).toBe(true);
        done();
      }
       gridObj.frozenRows = 3;
       gridObj.dataBind();
       gridObj.freezeModule.destroy();
   });
        afterAll(() => {
        destroy(gridObj);
      });
});

describe('Render isFrozen rows', () => {
  let gridObj: TreeGrid;
  let rows: Element[];
  let actionBegin: () => void;
  let actionComplete: () => void;
  let dataBound: () => void;
  let actionFailure: () => void;
  beforeAll((done: Function) => {
      
    gridObj = createGrid(
      {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowPaging:true,
          pageSettings: {pageSize: 12, pageSizes: true},
          treeColumnIndex: 1,
          columns: [
              { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 100 },
              { field: 'taskName', headerText: 'Task Name', width: 190, isFrozen:true },
              { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100, isFrozen: true },
              { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 100 },
              { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 120 },
          ],
          height: 315
      },
      done
    );
  });
  it('Check the isFrozen columns', () => {
    expect(gridObj.getColumns()[0].field).toBe("taskName");
    expect(gridObj.getColumns()[1].field).toBe("duration");
   });
      afterAll(() => {
      destroy(gridObj);
    });
});

describe('Without paging in frozen Rows', () => {
  let gridObj: TreeGrid;
  let rows: Element[];
  let actionBegin: () => void;
  let actionComplete: () => void;
  let dataBound: () => void;
  let actionFailure: () => void;
  
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
              { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 120 },
          ],
          height: 315
      },
      done
    );
  });
  it('Without Pager Mode - Checking collapse action', (done: Function) => {
    gridObj.collapsed = (args?: RowCollapsedEventArgs) => {
      let displayAction = [].slice.call(gridObj.element.getElementsByClassName('e-frozenheader')[0].getElementsByClassName('e-row'));
      let rows = 0;
      let count = displayAction.filter((e: any) => {
        if(e.style.display == "none" ) {
          rows++;
        }
      });
      let frozenrows = ((gridObj.element.getElementsByClassName('e-frozenheader')[0].getElementsByClassName('e-row').length) - rows);
        expect(frozenrows).toBe(6);
        done();
    }
    gridObj.collapseRow(gridObj.getRows()[5], gridObj.getCurrentViewRecords()[5]);
});

it('Without Pager Mode - Checking expand action', (done: Function) => {
  gridObj.expanded = (args?: RowExpandedEventArgs) => {
      expect(gridObj.element.getElementsByClassName('e-frozenheader')[0].getElementsByClassName('e-row').length).toBe(8);
      done();
  }
  gridObj.expandRow(gridObj.getRows()[5], gridObj.getCurrentViewRecords()[5]);
  gridObj.freezeModule.destroy();
});
      afterAll(() => {
      destroy(gridObj);
    });
});

describe('Checkbox in Frozen Rows and columns', () => {
  let gridObj: TreeGrid;
  let rows: Element[];
  let actionBegin: () => void;
  let actionComplete: () => void;
  let dataBound: () => void;
  let actionFailure: () => void;
  beforeAll((done: Function) => {
      
    gridObj = createGrid(
      {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowPaging:true,
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
              { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 120 },
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
      jasmine.Ajax.install();
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
                  { field: "TaskID", headerText: "Task Id" },
                  { field: "TaskName", headerText: "Task Name" },
                  { field: "StartDate", headerText: "Start Date" },
                  { field: "EndDate", headerText: "End Date" },                    
                  { field: "Progress", headerText: "Progress" }
            ]
          });
      gridObj.appendTo('#Grid');
      this.request = jasmine.Ajax.requests.mostRecent();
      this.request.respondWith({
          status: 200,
          responseText: JSON.stringify({d:  data, __count: 4})
      });
  });
  it('Expanding remote frozen rows', () => {
      (<HTMLElement>gridObj.getRows()[0].querySelectorAll('.e-treegridcollapse')[0]).click();
      expect(gridObj.element.getElementsByClassName('e-frozenheader')[0].getElementsByClassName('e-row').length).toBe(1);
      (<HTMLElement>gridObj.getRows()[0].querySelectorAll('.e-treegridexpand')[0]).click();
      expect(gridObj.element.getElementsByClassName('e-frozenheader')[0].getElementsByClassName('e-row').length).toBe(1);
      gridObj.freezeModule.destroy();
   });
  afterAll(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      gridObj.destroy();
      remove(elem);
      jasmine.Ajax.uninstall();
  });
});
describe('RowEdit in Frozen Rows and columns', () => {
  let gridObj: TreeGrid;
  let rows: Element[];
  let actionBegin: () => void;
  let actionComplete: () => void;
  let dataBound: () => void;
  let actionFailure: () => void;
  beforeAll((done: Function) => {
      
    gridObj = createGrid(
      {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowPaging:true,
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
              { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 120 },
          ],
          height: 315
      },
      done
    );
  });
  it('Editing in frozen rows', (done: Function) => {
    gridObj.selectRow(1);
    actionComplete = (args?: any): void => {
      if (args.requestType === "add") {
      expect((<any>gridObj.element.getElementsByClassName('e-movableheader')[0].getElementsByClassName('e-addedrow')[0]).sectionRowIndex).toBe(2);
      done();
      }
    };
    gridObj.actionComplete = actionComplete;
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
 });
  it('Record double click', (done: Function) => {
   gridObj.actionBegin = (args?: any): void => {
     if (gridObj.element.getElementsByClassName('e-frozenheader')[0].getElementsByClassName('e-editedrow').length > 0) {
    expect((<any>+gridObj.element.getElementsByClassName('e-frozenheader')[0].getElementsByClassName('e-editedrow')[0].getAttribute('aria-rowindex'))).toBe(2);
     done();
     }
   };
   let event: MouseEvent = new MouseEvent('dblclick', {
     'view': window,
     'bubbles': true,
     'cancelable': true
   });
   gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
   gridObj.freezeModule.destroy();
 });
      afterAll(() => {
      destroy(gridObj);
    });
});