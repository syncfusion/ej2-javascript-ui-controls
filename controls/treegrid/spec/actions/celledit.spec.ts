import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData } from '../base/datasource.spec';
import { Edit } from '../../src/treegrid/actions/edit';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { SaveEventArgs, CellEditArgs } from '@syncfusion/ej2-grids';
/**
 * Grid Cell Edit spec 
 */
TreeGrid.Inject(Edit, Toolbar);
describe('Cell Edit module', () => {
  describe('Hirarchy editing', () => {
    let gridObj: TreeGrid;
    let actionBegin: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
            dataSource: sampleData,
            childMapping: 'subtasks',
            editSettings: { allowEditing: true, mode: 'Cell', allowDeleting: true, allowAdding: true, newRowPosition: 'Top' },

            treeColumnIndex: 1,
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
              columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
              { field: 'taskName', headerText: 'Task Name' },
              { field: 'progress', headerText: 'Progress' },
              { field: 'startDate', headerText: 'Start Date' }
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
  describe('Cell Editing - cell alone refresh', () => {
    let gridObj: TreeGrid;
    let actionBegin: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, newRowPosition: 'Top' },

          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
          { field: 'taskName', headerText: 'Task Name' },
          { field: 'progress', headerText: 'Progress' },
          { field: 'startDate', headerText: 'Start Date' }
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
});