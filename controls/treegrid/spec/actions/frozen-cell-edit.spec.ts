import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData } from '../base/datasource.spec';
import { Edit } from '../../src/treegrid/actions/edit';
import { Freeze } from '../../src/treegrid/actions/freeze-column';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { SaveEventArgs, CellEditArgs } from '@syncfusion/ej2-grids';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { Sort } from '../../src/treegrid/actions/sort';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Grid Cell Edit spec 
 */
TreeGrid.Inject(Edit, Toolbar, Sort, Freeze);
describe('Cell Editing with Frozen Columns', () => {
  beforeAll(() => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
        console.log("Unsupported environment, window.performance.memory is unavailable");
        this.skip(); //Skips test (in Chai)
        return;
    }
  });
  describe('Hirarchy Frozen editing', () => {
    let gridObj: TreeGrid;
    let actionBegin: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
            dataSource: sampleData,
            childMapping: 'subtasks',
            editSettings: { allowEditing: true, mode: 'Cell', allowDeleting: true, allowAdding: true, newRowPosition: 'Top' },
            frozenColumns: 3,
            treeColumnIndex: 1,
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
              columns: [
                {
                    field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                    validationRules: { required: true, number: true}, width: 90
                },
                { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
                { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
                { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
                  format: 'yMd' },
                { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
                  type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
                { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },                
                { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
                { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
              ]
        },
        done
      );
    });
    it('record double click', (done: Function) => {
      gridObj.cellEdit = (args?: CellEditArgs): void => {
        expect(args.columnName).toBe('taskName');
        done();
      };
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
    });
    it('save record', (done: Function) => {
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
      gridObj.actionComplete = (args?: any): void => {
        expect(gridObj.dataSource[0].subtasks[1].taskName).toBe('test');
        done();
      };
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    afterAll(() => {
        destroy(gridObj);
      });
    });
  describe('Cell Editing with Frozen Columns - cell alone refresh', () => {
    let gridObj: TreeGrid;
    let actionBegin: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, newRowPosition: 'Top' },
          frozenColumns: 3,
          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },                
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
          ]
        },
        done
      );
    });
    it('cell refresh', (done: Function) => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      (gridObj.getCellFromIndex(1, 1) as HTMLElement).style.background = 'red';
      gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
      gridObj.actionComplete = (args?: SaveEventArgs): void => {
        expect(args.target.textContent).toBe('test');
        expect((gridObj.getCellFromIndex(1, 1) as HTMLElement).style.background).toBe('red');
        done();
      };
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
      gridObj.getRows()[0].click();
    });
    it('cell refresh by toolbar update', (done: Function) => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      (gridObj.getCellFromIndex(1, 1) as HTMLElement).style.background = 'blue';
      gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
      gridObj.actionComplete = (args?: SaveEventArgs): void => {
        expect(args.target.textContent).toBe('test2');
        expect((gridObj.getCellFromIndex(1, 1) as HTMLElement).style.background).toBe('blue');
        done();
      };
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test2';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Cell Editing With scroller and with Frozen Columns', () => {
    let gridObj: TreeGrid;
    let actionBegin: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          width: 600, height: 400,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, newRowPosition: 'Top' },
          frozenColumns: 3,
          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },                
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
        ]
        },
        done
      );
    });
    it('cell edit', () => {
      expect((<HTMLElement>gridObj.grid.element).style.width).toBe('600px');
      expect((<HTMLElement>gridObj.getContent().firstChild).classList.contains('e-content')).toBeTruthy();
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      let scrollPosition: number = gridObj.getContent().firstElementChild.scrollLeft;
      gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
      expect(gridObj.getContent().firstElementChild.scrollLeft).toEqual(scrollPosition);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      expect(gridObj.getContent().firstElementChild.scrollLeft).toEqual(scrollPosition);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });        
  describe('Cell edit and cancel when selection mode is set as Cell', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
  
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowSelection: true,
          selectionSettings: {mode: 'Cell'},
          treeColumnIndex: 1,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                mode: 'Cell'
            },
            frozenColumns: 3,
            toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
            columns: [
                {
                    field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                    validationRules: { required: true, number: true}, width: 90
                },
                { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
                { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
                { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
                  format: 'yMd' },
                { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
                  type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
                { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },                
                { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
                { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
            ]
        },
        done
      );
    });
    it('double click on a record, cell edit and cancel',() => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(1, 1).dispatchEvent(event);
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'Planning completed';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
      expect((gridObj.getRows()[1].getElementsByClassName('e-treecell')[0] as HTMLElement).innerText=="Plan timeline").toBe(true);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Expand/Collpase icon testing at the time of cell edit cancel with Frozen Columns', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowSelection: true,
          selectionSettings: {mode: 'Cell'},
          treeColumnIndex: 1,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                mode: 'Cell'
            },
            frozenColumns: 3,
            toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
            columns: [
                {
                    field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                    validationRules: { required: true, number: true}, width: 90
                },
                { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
                { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
                { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
                  format: 'yMd' },
                { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
                  type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
                { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },                
                { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
                { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
            ]
        },
        done
      );
    });
    it('double click on a record, cell edit and cancel',() => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(0, 1).dispatchEvent(event);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
      expect(gridObj.getRows()[0].getElementsByClassName('e-treecell').length).toBe(1);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Edit cell through method with Frozen Columns', () => {
    let gridObj: TreeGrid;
    let cellEdit: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
        dataSource: sampleData,
        childMapping: 'subtasks',
        editSettings: { allowEditing: true, mode: 'Cell', allowDeleting: true, allowAdding: true,},
        treeColumnIndex: 1,
        frozenColumns: 3,
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
        columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },                
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' },
            ]
        },
        done
      );
    });
    it('Edit Cell', () => {
      cellEdit = (args?: any): void => {
        setTimeout(() => {
          expect(gridObj.grid.editModule.formObj.element.getElementsByTagName('input').length).toBe(1);
        }, 0);
      }
      gridObj.cellEdit = cellEdit;
      gridObj.editCell(2,'progress');
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-22751: Events not triggered with Frozen Columns', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionBegin: () => void;
    let actionComplete: () => void;
  
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                mode: 'Cell'
  
            },
            frozenColumns: 3,
            toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
            columns: [
                {
                    field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                    validationRules: { required: true, number: true}, width: 90
                },
                { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
                { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
                { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
                  format: 'yMd' },
                { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
                  type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
                { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },                
                { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
                { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
            ]
        },
        done
      );
    });
    it('Check editing events', (done: Function) => {
      
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      
      gridObj.actionBegin = (args?: Object) : void => {
        expect(args['columnName'] === 'taskName').toBe(true);
        expect(args['type'] === 'edit').toBe(true);
        done();
      }
      /*gridObj.actionComplete = (args?: Object): void => {
        expect(args['type'] === 'edit').toBe(true);
        done();
      }*/
      gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
  });
  
  it('Check saving events', (done: Function) => {
    let event: MouseEvent = new MouseEvent('dblclick', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    gridObj.actionBegin = (args?: Object) : void => {
      expect(args['type'] === 'save').toBe(true);
    }
    gridObj.actionComplete = (args?: Object) : void => {
      expect(args['type'] === 'save').toBe(true);
      expect(args['target'].cellIndex === 1).toBe(true);
      done();
    }
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      
  });
  
  it('Check editing events again', (done: Function) => {
      
    let event: MouseEvent = new MouseEvent('dblclick', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    
    gridObj.actionBegin = (args?: Object) : void => {
      expect(args['columnName'] === 'taskName').toBe(true);
      expect(args['type'] === 'edit').toBe(true);
      done();
    }
    /*gridObj.actionComplete = (args?: Object): void => {
      expect(args['type'] === 'edit').toBe(true);
      done();
    }*/
    gridObj.getCellFromIndex(3, 1).dispatchEvent(event);
  });
  
  it('Check cancelling events', (done: Function) => {
    gridObj.actionComplete = (args?: Object) : void => {
      expect(args['name'] === 'actionComplete').toBe(true);
      done();
    }
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
  });
  
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('allowEditOnDblClick - Cell Editing with Frozen Columns', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Cell", newRowPosition: 'Below', allowEditOnDblClick: false },
          frozenColumns: 3,
          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },                
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
          ]
        },
        done
      );
    });
    it('allowEditOnDblClick - Cell Editing', () => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
      expect(isNullOrUndefined(gridObj.grid.editModule.formObj)).toBe(true);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-32160 - DataSource not refreshed after cancelling the edit action on cellEditing with Frozen Columns', () => {
    let gridObj: TreeGrid;
    let cellEdit: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Cell", newRowPosition: 'Below' },
          treeColumnIndex: 1,
          frozenColumns: 3,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },                
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
          ]
        },
        done
      );
    });
    it('DataSource not refreshed after cancelling the edit action on cellEditing', () => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      cellEdit = (args?: any): void => {
        args.cancel = true;
      }
      actionComplete = (args?: any): void => {
        expect(isNullOrUndefined(args.rowData.taskID)).toBe(true);
      }
      gridObj.cellEdit = cellEdit;
      gridObj.actionComplete = actionComplete;
      gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });




  describe('EJ2-32869 - Clicking on Expand icon while in edit state with Frozen Columns', () => {
    let gridObj: TreeGrid;
    let cellEdit: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Cell", newRowPosition: 'Below' },
          treeColumnIndex: 1,
          frozenColumns: 3,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },                
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
          ]
        },
        done
      );
    });
    it('Clicking on expand icon in edit state', () => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });      
      gridObj.getCellFromIndex(0, 2).dispatchEvent(event);
      debugger;
      (gridObj.editModule as any).doubleClickTarget.getElementsByTagName("input")[0].value = "20";
      (gridObj.getRows()[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
      let cells: NodeListOf<Element> = gridObj.grid.getRows()[0].querySelectorAll('.e-rowcell');
      expect(cells[2].textContent === '20' ).toBeTruthy();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });




describe('EJ2-36694 - Cell Update with aggregates with Frozen Columns', () => {
    let gridObj: TreeGrid;
    let cellEdit: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          frozenColumns: 3,
          height: 400,
          editSettings: {
              allowAdding: true,
              allowEditing: true,
              allowDeleting: true,
              mode: 'Cell',
              newRowPosition: 'Below'
  
          },
            aggregates: [{
              showChildSummary: true,
                  columns: [
                      {
                          type: 'Max',
                          field: 'duration',
                          columnName: 'duration',
                          footerTemplate: 'Maximum: ${Max}'
                      }
                      ]
          }],
          toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },                
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
          ]
        },
        done
      );
    });
    it('Edit Cell', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType == 'save') {
          expect((gridObj.getRows()[7].getElementsByClassName('e-treecell')[0] as HTMLElement).innerText=="test").toBe(true);
        }
        done();
      }
      gridObj.actionComplete = actionComplete;
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(7, 1).dispatchEvent(event);
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    afterAll(() => {
      destroy(gridObj);
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
