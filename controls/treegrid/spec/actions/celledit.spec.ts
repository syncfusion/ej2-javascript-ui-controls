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
  describe('Cell Editing With scroller', () => {
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

          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true }, width: 190
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220, validationRules: { required: true } },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 230, editType: 'datepickeredit',
                format: 'yMd', validationRules: { date: true } },
            {
                field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 200, editType: 'numericedit',
                validationRules: { number: true, min: 0 }, edit: { params: { format: 'n' } }
            }
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
      describe('Check the expanding state of record after delete operation', () => {
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
                mode: 'Cell',
                newRowPosition: 'Below'

            },
            toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
            columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
            { field: 'taskName', headerText: 'Task Name' },
            { field: 'startDate', headerText: 'Start Date'},
            { field: 'duration', headerText: 'duration' },
            ]
        },
        done
      );
    });
    it('Check expand state of record after deletion of another record', (done: Function) => {
      (<HTMLElement>gridObj.getRows()[5].querySelectorAll('.e-treegridexpand')[0]).click();
      (<HTMLElement>gridObj.getRows()[11].querySelectorAll('.e-treegridexpand')[0]).click();
      gridObj.selectRow(2);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
      gridObj.actionComplete = (args?: Object): void => {
        (<HTMLElement>gridObj.getRows()[10].querySelectorAll('.e-treegridcollapse')[0]).click();
        expect(gridObj.getRows()[11].getElementsByClassName('e-treecolumn-container')[0].children[1].classList.contains('e-treegridexpand')).toBe(true);
        expect(gridObj.getRows()[12].getElementsByClassName('e-treecolumn-container')[0].children[2].classList.contains('e-treegridexpand')).toBe(true);
        done();
      }
  });
    afterAll(() => {
      destroy(gridObj);
    });
  });

});