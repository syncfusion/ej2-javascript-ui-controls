import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData, selfEditData } from '../base/datasource.spec';
import { Edit } from '../../src/treegrid/actions/edit';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { profile, inMB, getMemoryProfile } from '../common.spec';


/**
 * Grid Row Edit spec 
 */
TreeGrid.Inject(Edit, Toolbar);
describe('Edit module', () => {
  beforeAll(() => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
        console.log("Unsupported environment, window.performance.memory is unavailable");
        this.skip(); //Skips test (in Chai)
        return;
    }
  });

  describe('Hirarchy editing - Add at top', () => {
    let gridObj: TreeGrid;
    let actionBegin: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
            dataSource: sampleData,
            childMapping: 'subtasks',
            editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Top' },

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
    it('Add row - no selection', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          expect(args.row.rowIndex).toBe(0);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      
    });
    it('Add row - select row', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskID') as any).value = '121';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'first';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[0].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '121' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('first');
        expect(gridObj.dataSource[0].taskID === 121).toBeTruthy();
        expect(gridObj.dataSource[0].taskName).toBe('first');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - select row new row postion', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          expect(args.row.rowIndex).toBe(0);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(3);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - select row datasource index', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskID') as any).value = '122';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'second';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[0].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('second');
        expect(gridObj.dataSource[0].taskID === 122).toBeTruthy();
        expect(gridObj.dataSource[0].taskName).toBe('second');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - added row', (done: Function) => {
      gridObj.actionComplete = null;
      gridObj.selectRow(0);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'test1';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[0].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('test1');
        expect(gridObj.dataSource[0].taskID === 122).toBeTruthy();
        expect(gridObj.dataSource[0].taskName).toBe('test1');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - deep child parent row', (done: Function) => {
      gridObj.actionComplete = null;
      gridObj.selectRow(15);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'test2';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[15].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '14' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('test2');
        expect(gridObj.dataSource[4].subtasks[0].subtasks[0].taskID === 14).toBeTruthy();
        expect(gridObj.dataSource[4].subtasks[0].subtasks[0].taskName).toBe('test2');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('delete row - deep child parent row', (done: Function) => {
      gridObj.selectRow(15);
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[15].querySelectorAll('.e-rowcell');
        let previousrowCell: NodeListOf<Element> = gridObj.grid.getRows()[14].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '21' ).toBeTruthy();
        expect(previousrowCell[1].querySelector('.e-treegridexpand')).toBeNull();
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Hirarchy editing - Add at Bottom', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
            dataSource: sampleData,
            childMapping: 'subtasks',
            editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Bottom' },

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
    it('Add row - no selection', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(rows.length);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      
    });
    it('Add row - no selection datasource', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskID') as any).value = '121';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'first';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[rows.length - 1].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '121' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('first');
        expect(gridObj.dataSource[sampleData.length].taskID === 121).toBeTruthy();
        expect(gridObj.dataSource[sampleData.length].taskName).toBe('first');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - select row new row postion', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(rows.length);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(3);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - select row datasource index', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskID') as any).value = '122';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'second';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[rows.length - 1].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('second');
        expect(gridObj.dataSource[sampleData.length + 1].taskID === 122).toBeTruthy();
        expect(gridObj.dataSource[sampleData.length + 1].taskName).toBe('second');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - added row', (done: Function) => {
      gridObj.actionComplete = null;
      rows = gridObj.grid.getRows();
      gridObj.selectRow(rows.length - 1);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'test1';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[rows.length - 1].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('test1');
        expect(gridObj.dataSource[sampleData.length + 1].taskID === 122).toBeTruthy();
        expect(gridObj.dataSource[sampleData.length + 1].taskName).toBe('test1');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - deep child parent row', (done: Function) => {
      gridObj.actionComplete = null;
      gridObj.selectRow(13);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'test2';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[13].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '14' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('test2');
        expect(gridObj.dataSource[2].subtasks[0].subtasks[0].taskID === 14).toBeTruthy();
        expect(gridObj.dataSource[2].subtasks[0].subtasks[0].taskName).toBe('test2');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('delete row - deep child parent row', (done: Function) => {
      gridObj.selectRow(13);
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[13].querySelectorAll('.e-rowcell');
        let previousrowCell: NodeListOf<Element> = gridObj.grid.getRows()[12].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '21' ).toBeTruthy();
        expect(previousrowCell[1].querySelector('.e-treegridexpand')).toBeNull();
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Hirarchy editing - Add at Above', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
            dataSource: sampleData,
            childMapping: 'subtasks',
            editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Above' },

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
    it('Add row - no selection', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          expect(args.row.rowIndex).toBe(0);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      
    });
    it('Add row - no selection datasource', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskID') as any).value = '121';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'first';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[0].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '121' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('first');
        expect(gridObj.dataSource[0].taskID === 121).toBeTruthy();
        expect(gridObj.dataSource[0].taskName).toBe('first');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - select row new row postion', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(6);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(6);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - select row datasource index', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskID') as any).value = '122';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'second';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[6].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('second');
        expect(gridObj.dataSource[2].taskID === 122).toBeTruthy();
        expect(gridObj.dataSource[2].taskName).toBe('second');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - child', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(9);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(9);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - child datasource', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskID') as any).value = '123';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'third';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[9].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '123' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('third');
        expect(gridObj.dataSource[3].subtasks[1].taskID === 123).toBeTruthy();
        expect(gridObj.dataSource[3].subtasks[1].taskName).toBe('third');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - deep child', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(16);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(16);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - deep child datasource', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskID') as any).value = '124';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'fourth';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[16].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '124' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('fourth');
        expect(gridObj.dataSource[4].subtasks[0].subtasks[0].taskID === 124).toBeTruthy();
        expect(gridObj.dataSource[4].subtasks[0].subtasks[0].taskName).toBe('fourth');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - added row', (done: Function) => {
      gridObj.actionComplete = null;
      rows = gridObj.grid.getRows();
      gridObj.selectRow(16);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'test1';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[16].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '124' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('test1');
        expect(gridObj.dataSource[4].subtasks[0].subtasks[0].taskID === 124).toBeTruthy();
        expect(gridObj.dataSource[4].subtasks[0].subtasks[0].taskName).toBe('test1');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - deep child parent row', (done: Function) => {
      gridObj.actionComplete = null;
      gridObj.selectRow(18);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'test3';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[18].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '15' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('test3');
        expect(gridObj.dataSource[4].subtasks[0].subtasks[1].subtasks[0].taskID === 15).toBeTruthy();
        expect(gridObj.dataSource[4].subtasks[0].subtasks[1].subtasks[0].taskName).toBe('test3');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('delete row - deep child parent row - 1', (done: Function) => {
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[16].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '14' ).toBeTruthy();
        done();
      };
      gridObj.actionComplete = actionComplete;
      gridObj.deleteRow(<HTMLTableRowElement>gridObj.getRowByIndex(16));
    });
    it('delete row - deep child parent row - 2', (done: Function) => {
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[16].querySelectorAll('.e-rowcell');
        let previousrowCell: NodeListOf<Element> = gridObj.grid.getRows()[15].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '21' ).toBeTruthy();
        expect(previousrowCell[1].querySelector('.e-treegridexpand')).toBeNull();
        done();
      };
      gridObj.actionComplete = actionComplete;
      gridObj.deleteRow(<HTMLTableRowElement>gridObj.getRowByIndex(16));
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Hirarchy editing - Add at Below', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
            dataSource: sampleData,
            childMapping: 'subtasks',
            editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Below' },

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
    it('Add row - no selection', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          expect(args.row.rowIndex).toBe(0);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      
    });
    it('Add row - no selection datasource', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskID') as any).value = '121';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'first';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[0].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '121' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('first');
        expect(gridObj.dataSource[0].taskID === 121).toBeTruthy();
        expect(gridObj.dataSource[0].taskName).toBe('first');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - select row new row postion', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(12);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(6);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - select row datasource index', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskID') as any).value = '122';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'second';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[12].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('second');
        expect(gridObj.dataSource[3].taskID === 122).toBeTruthy();
        expect(gridObj.dataSource[3].taskName).toBe('second');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - child', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(9);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(8);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - child datasource', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskID') as any).value = '123';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'third';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[9].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '123' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('third');
        expect(gridObj.dataSource[2].subtasks[2].taskID === 123).toBeTruthy();
        expect(gridObj.dataSource[2].subtasks[2].taskName).toBe('third');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - deep child', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(23);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(16);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - deep child datasource', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskID') as any).value = '124';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'fourth';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[23].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '124' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('fourth');
        expect(gridObj.dataSource[4].subtasks[0].subtasks[1].taskID === 124).toBeTruthy();
        expect(gridObj.dataSource[4].subtasks[0].subtasks[1].taskName).toBe('fourth');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - added row', (done: Function) => {
      gridObj.actionComplete = null;
      rows = gridObj.grid.getRows();
      gridObj.selectRow(23);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'test1';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[23].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '124' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('test1');
        expect(gridObj.dataSource[4].subtasks[0].subtasks[1].taskID === 124).toBeTruthy();
        expect(gridObj.dataSource[4].subtasks[0].subtasks[1].taskName).toBe('test1');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('delete row - deep child parent row - 1', (done: Function) => {
      gridObj.actionComplete = null;
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[23].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '21' ).toBeTruthy();
        done();
      };
      gridObj.actionComplete = actionComplete;
      gridObj.deleteRow(<HTMLTableRowElement>gridObj.getRowByIndex(23));
    });
    it('delete row - deep child parent row - 2', (done: Function) => {
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[16].querySelectorAll('.e-rowcell');
        let previousrowCell: NodeListOf<Element> = gridObj.grid.getRows()[15].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '21' ).toBeTruthy();
        expect(previousrowCell[1].querySelector('.e-treegridexpand')).toBeNull();
        done();
      };
      gridObj.actionComplete = actionComplete;
      gridObj.deleteRow(<HTMLTableRowElement>gridObj.getRowByIndex(16));
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Hirarchy editing - Add at Child', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
            dataSource: sampleData,
            childMapping: 'subtasks',
            editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Child' },

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
    it('Add row - no selection', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          expect(args.row.rowIndex).toBe(0);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      
    });
    it('Add row - no selection datasource', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskID') as any).value = '121';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'first';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[0].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '121' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('first');
        expect(gridObj.dataSource[0].taskID === 121).toBeTruthy();
        expect(gridObj.dataSource[0].taskName).toBe('first');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - select row new row postion', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(8);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(7);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - select row datasource index', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskID') as any).value = '122';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'second';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[8].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('second');
        expect(gridObj.dataSource[2].subtasks[0].subtasks[0].taskID === 122).toBeTruthy();
        expect(gridObj.dataSource[2].subtasks[0].subtasks[0].taskName).toBe('second');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - parent', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(38);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(13);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - parent datasource', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskID') as any).value = '123';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'third';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[38].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '123' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('third');
        expect(gridObj.dataSource[3].subtasks[3].taskID === 123).toBeTruthy();
        expect(gridObj.dataSource[3].subtasks[3].taskName).toBe('third');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - added row', (done: Function) => {
      gridObj.actionComplete = null;
      rows = gridObj.grid.getRows();
      gridObj.selectRow(8);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'test1';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[8].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('test1');
        expect(gridObj.dataSource[2].subtasks[0].subtasks[0].taskID === 122).toBeTruthy();
        expect(gridObj.dataSource[2].subtasks[0].subtasks[0].taskName).toBe('test1');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('delete row - deep child parent row - 1', (done: Function) => {
      gridObj.actionComplete = null;
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[8].querySelectorAll('.e-rowcell');
        let previousCells: NodeListOf<Element> = gridObj.grid.getRows()[7].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '8' ).toBeTruthy();
        expect(previousCells[1].querySelector('.e-treegridexpand') ).toBeNull();
        done();
      };
      gridObj.actionComplete = actionComplete;
      gridObj.deleteRow(<HTMLTableRowElement>gridObj.getRowByIndex(8));
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('SelfReference editing - Add at top', () => {
    let gridObj: TreeGrid;
    let actionBegin: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: selfEditData,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Top' },

          treeColumnIndex: 1,
          toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
          columns: [{field: 'TaskID', headerText: 'Task ID', isPrimaryKey: true},
{field: 'TaskName', headerText: 'Task Name'},
{field: 'StartDate', headerText: 'Start Date'},
{field: 'Progress', headerText: 'Progress'}
]
        },
        done
      );
    });
    it('Add row - no selection', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          expect(args.row.rowIndex).toBe(0);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });

    });
    it('Add row - no selection dataSource', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskID') as any).value = '121';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'first';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[0].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '121').toBeTruthy();
        expect(cells[1].textContent).toBe('first');
        expect(gridObj.dataSource[0].TaskID === 121).toBeTruthy();
        expect(gridObj.dataSource[0].TaskName).toBe('first');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - select row new row postion', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          expect(args.row.rowIndex).toBe(0);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(3);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - select row datasource index', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskID') as any).value = '122';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'second';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[0].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122').toBeTruthy();
        expect(cells[1].textContent).toBe('second');
        expect(gridObj.dataSource[0].TaskID === 122).toBeTruthy();
        expect(gridObj.dataSource[0].TaskName).toBe('second');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - added row', (done: Function) => {
      gridObj.actionComplete = null;
      gridObj.selectRow(0);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'test1';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[0].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122').toBeTruthy();
        expect(cells[1].textContent).toBe('test1');
        expect(gridObj.dataSource[0].TaskID === 122).toBeTruthy();
        expect(gridObj.dataSource[0].TaskName).toBe('test1');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - deep child parent row', (done: Function) => {
      gridObj.actionComplete = null;
      gridObj.selectRow(4);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'test2';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[4].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '22').toBeTruthy();
        expect(cells[1].textContent).toBe('test2');
        expect(gridObj.dataSource[4].TaskID === 22).toBeTruthy();
        expect(gridObj.dataSource[4].TaskName).toBe('test2');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('delete row - deep child parent row', (done: Function) => {
      gridObj.selectRow(4);
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[4].querySelectorAll('.e-rowcell');
        let previousrowCell: NodeListOf<Element> = gridObj.grid.getRows()[3].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '3').toBeTruthy();
        expect(previousrowCell[1].querySelector('.e-treegridexpand')).toBeNull();
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Self Reference editing - Add at Bottom', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
            dataSource: selfEditData, 
            idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Bottom' },

          treeColumnIndex: 1,
          toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
          columns: [{field: 'TaskID', headerText: 'Task ID', isPrimaryKey: true},
{field: 'TaskName', headerText: 'Task Name'},
{field: 'StartDate', headerText: 'Start Date'},
{field: 'Progress', headerText: 'Progress'}
]
        },
        done
      );
    });
    it('Add row - no selection', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(rows.length);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      
    });
    it('Add row - no selection datasource', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskID') as any).value = '121';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'first';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[rows.length - 1].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '121' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('first');
        expect(gridObj.dataSource[selfEditData.length].TaskID === 121).toBeTruthy();
        expect(gridObj.dataSource[selfEditData.length].TaskName).toBe('first');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - select row new row postion', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(rows.length);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(3);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - select row datasource index', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskID') as any).value = '122';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'second';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[rows.length - 1].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('second');
        expect(gridObj.dataSource[selfEditData.length + 1].TaskID === 122).toBeTruthy();
        expect(gridObj.dataSource[selfEditData.length + 1].TaskName).toBe('second');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - added row', (done: Function) => {
      gridObj.actionComplete = null;
      rows = gridObj.grid.getRows();
      gridObj.selectRow(rows.length - 1);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'test1';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[rows.length - 1].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('test1');
        expect(gridObj.dataSource[selfEditData.length + 1].TaskID === 122).toBeTruthy();
        expect(gridObj.dataSource[selfEditData.length + 1].TaskName).toBe('test1');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - deep child parent row', (done: Function) => {
      gridObj.actionComplete = null;
      gridObj.selectRow(2);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'test2';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[2].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '22' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('test2');
        expect(gridObj.dataSource[2].TaskID === 22).toBeTruthy();
        expect(gridObj.dataSource[2].TaskName).toBe('test2');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('delete row - addedrow', (done: Function) => {
      rows = gridObj.grid.getRows();
      gridObj.selectRow(rows.length - 1);
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[rows.length - 1].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '121' ).toBeTruthy();
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  //above
  describe('Hirarchy editing - Add at Above', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: selfEditData, 
          idMapping: 'TaskID',
        parentIdMapping: 'parentID',
        editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Above' },

        treeColumnIndex: 1,
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
        columns: [{field: 'TaskID', headerText: 'Task ID', isPrimaryKey: true},
{field: 'TaskName', headerText: 'Task Name'},
{field: 'StartDate', headerText: 'Start Date'},
{field: 'Progress', headerText: 'Progress'}
]
        },
        done
      );
    });
    it('Add row - no selection', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          expect(args.row.rowIndex).toBe(0);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      
    });
    it('Add row - no selection datasource', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskID') as any).value = '121';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'first';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[0].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '121' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('first');
        expect(gridObj.dataSource[0].TaskID === 121).toBeTruthy();
        expect(gridObj.dataSource[0].TaskName).toBe('first');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - select row new row postion', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(4);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(4);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - select row datasource index', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskID') as any).value = '122';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'second';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[4].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('second');
        expect(gridObj.dataSource[4].TaskID === 122).toBeTruthy();
        expect(gridObj.dataSource[4].TaskName).toBe('second');
        expect(gridObj.dataSource[4].parentID === 1).toBeTruthy();
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - child', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(7);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(7);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - child datasource', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskID') as any).value = '123';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'third';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[7].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '123' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('third');
        expect(gridObj.dataSource[7].TaskID === 123).toBeTruthy();
        expect(gridObj.dataSource[7].TaskName).toBe('third');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - deep child', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(3);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(3);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - deep child datasource', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskID') as any).value = '124';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'fourth';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[3].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '124' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('fourth');
        expect(gridObj.dataSource[3].TaskID === 124).toBeTruthy();
        expect(gridObj.dataSource[3].TaskName).toBe('fourth');
        expect(gridObj.dataSource[3].parentID === 2).toBeTruthy();
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - added row', (done: Function) => {
      gridObj.actionComplete = null;
      rows = gridObj.grid.getRows();
      gridObj.selectRow(3);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'test1';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[3].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '124' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('test1');
        expect(gridObj.dataSource[3].TaskID === 124).toBeTruthy();
        expect(gridObj.dataSource[3].TaskName).toBe('test1');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - deep child parent row', (done: Function) => {
      gridObj.actionComplete = null;
      gridObj.selectRow(4);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'test3';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[4].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '22' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('test3');
        expect(gridObj.dataSource[4].TaskID === 22).toBeTruthy();
        expect(gridObj.dataSource[4].TaskName).toBe('test3');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('delete row - deep child parent row - 1', (done: Function) => {
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[4].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122' ).toBeTruthy();
        done();
      };
      gridObj.actionComplete = actionComplete;
      gridObj.deleteRow(<HTMLTableRowElement>gridObj.getRowByIndex(4));
    });
    it('delete row - deep child parent row - 2', (done: Function) => {
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[3].querySelectorAll('.e-rowcell');
        let previousrowCell: NodeListOf<Element> = gridObj.grid.getRows()[2].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122' ).toBeTruthy();
        expect(previousrowCell[1].querySelector('.e-treegridexpand')).toBeNull();
        done();
      };
      gridObj.actionComplete = actionComplete;
      gridObj.deleteRow(<HTMLTableRowElement>gridObj.getRowByIndex(3));
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  //tesst
  describe('Self Reference editing - Add at Bottom', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
            dataSource: selfEditData, 
            idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Bottom' },

          treeColumnIndex: 1,
          toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
          columns: [{field: 'TaskID', headerText: 'Task ID', isPrimaryKey: true},
{field: 'TaskName', headerText: 'Task Name'},
{field: 'StartDate', headerText: 'Start Date'},
{field: 'Progress', headerText: 'Progress'}
]
        },
        done
      );
    });
    it('Add row - no selection', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(rows.length);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      
    });
    it('Add row - no selection datasource', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskID') as any).value = '121';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'first';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[rows.length - 1].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '121' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('first');
        expect(gridObj.dataSource[selfEditData.length].TaskID === 121).toBeTruthy();
        expect(gridObj.dataSource[selfEditData.length].TaskName).toBe('first');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - select row new row postion', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(rows.length);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(3);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - select row datasource index', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskID') as any).value = '122';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'second';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[rows.length - 1].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('second');
        expect(gridObj.dataSource[selfEditData.length + 1].TaskID === 122).toBeTruthy();
        expect(gridObj.dataSource[selfEditData.length + 1].TaskName).toBe('second');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - added row', (done: Function) => {
      gridObj.actionComplete = null;
      rows = gridObj.grid.getRows();
      gridObj.selectRow(rows.length - 1);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'test1';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[rows.length - 1].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('test1');
        expect(gridObj.dataSource[selfEditData.length + 1].TaskID === 122).toBeTruthy();
        expect(gridObj.dataSource[selfEditData.length + 1].TaskName).toBe('test1');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - deep child parent row', (done: Function) => {
      gridObj.actionComplete = null;
      gridObj.selectRow(2);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'test2';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[2].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '22' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('test2');
        expect(gridObj.dataSource[2].TaskID === 22).toBeTruthy();
        expect(gridObj.dataSource[2].TaskName).toBe('test2');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('delete row - addedrow', (done: Function) => {
      rows = gridObj.grid.getRows();
      gridObj.selectRow(rows.length - 1);
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[rows.length - 1].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '121' ).toBeTruthy();
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Hirarchy editing - Add at Below', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: selfEditData,
          idMapping: 'TaskID',
        parentIdMapping: 'parentID',
        editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Below' },

        treeColumnIndex: 1,
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
        columns: [{field: 'TaskID', headerText: 'Task ID', isPrimaryKey: true},
{field: 'TaskName', headerText: 'Task Name'},
{field: 'StartDate', headerText: 'Start Date'},
{field: 'Progress', headerText: 'Progress'}
]
        },
        done
      );
    });
    it('Add row - no selection', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          expect(args.row.rowIndex).toBe(0);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      
    });
    it('Add row - no selection datasource', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskID') as any).value = '121';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'first';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[0].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '121' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('first');
        expect(gridObj.dataSource[0].TaskID === 121).toBeTruthy();
        expect(gridObj.dataSource[0].TaskName).toBe('first');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - select row new row postion', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(5);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(4);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - select row datasource index', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskID') as any).value = '122';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'second';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[5].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('second');
        expect(gridObj.dataSource[5].TaskID === 122).toBeTruthy();
        expect(gridObj.dataSource[5].TaskName).toBe('second');
        expect(gridObj.dataSource[5].parentID === 1).toBeTruthy();
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - child', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(12);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(7);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - child datasource', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskID') as any).value = '123';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'third';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[12].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '123' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('third');
        expect(gridObj.dataSource[8].TaskID === 123).toBeTruthy();
        expect(gridObj.dataSource[8].TaskName).toBe('third');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - deep child', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(4);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(3);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - deep child datasource', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskID') as any).value = '124';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'fourth';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[4].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '124' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('fourth');
        expect(gridObj.dataSource[4].TaskID === 124).toBeTruthy();
        expect(gridObj.dataSource[4].TaskName).toBe('fourth');
        expect(gridObj.dataSource[4].parentID === 2).toBeTruthy();
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - added row', (done: Function) => {
      gridObj.actionComplete = null;
      rows = gridObj.grid.getRows();
      gridObj.selectRow(4);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'test1';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[4].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '124' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('test1');
        expect(gridObj.dataSource[4].TaskID === 124).toBeTruthy();
        expect(gridObj.dataSource[4].TaskName).toBe('test1');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - deep child parent row', (done: Function) => {
      gridObj.actionComplete = null;
      gridObj.selectRow(3);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'test3';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[3].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '22' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('test3');
        expect(gridObj.dataSource[3].TaskID === 22).toBeTruthy();
        expect(gridObj.dataSource[3].TaskName).toBe('test3');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('delete row - deep child parent row - 1', (done: Function) => {
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[4].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '3' ).toBeTruthy();
        done();
      };
      gridObj.actionComplete = actionComplete;
      gridObj.deleteRow(<HTMLTableRowElement>gridObj.getRowByIndex(4));
    });
    it('delete row - deep child parent row - 2', (done: Function) => {
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[3].querySelectorAll('.e-rowcell');
        let previousrowCell: NodeListOf<Element> = gridObj.grid.getRows()[2].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '3' ).toBeTruthy();
        expect(previousrowCell[1].querySelector('.e-treegridexpand')).toBeNull();
        done();
      };
      gridObj.actionComplete = actionComplete;
      gridObj.deleteRow(<HTMLTableRowElement>gridObj.getRowByIndex(3));
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Hirarchy editing - Add at Child', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: selfEditData,
          idMapping: 'TaskID',
        parentIdMapping: 'parentID',
        editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Child' },

        treeColumnIndex: 1,
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
        columns: [{field: 'TaskID', headerText: 'Task ID', isPrimaryKey: true},
{field: 'TaskName', headerText: 'Task Name'},
{field: 'StartDate', headerText: 'Start Date'},
{field: 'Progress', headerText: 'Progress'}
]
        },
        done
      );
    });
    it('Add row - no selection', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          expect(args.row.rowIndex).toBe(0);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      
    });
    it('Add row - no selection datasource', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskID') as any).value = '121';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'first';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[0].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '121' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('first');
        expect(gridObj.dataSource[0].TaskID === 121).toBeTruthy();
        expect(gridObj.dataSource[0].TaskName).toBe('first');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('Add row - select row new row postion', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType === 'add') {
          rows = gridObj.grid.getRows();
          expect(args.row.rowIndex).toBe(11);
          done();
        }
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(6);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    it('Add row - select row datasource index', (done: Function) => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskID') as any).value = '122';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'second';
      actionComplete = (args?: any): void => {
        rows = gridObj.grid.getRows();
        let cells: NodeListOf<Element> = rows[11].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('second');
        expect(gridObj.dataSource[7].TaskID === 122).toBeTruthy();
        expect(gridObj.dataSource[7].TaskName).toBe('second');
        expect(gridObj.dataSource[7].parentID === 5).toBeTruthy();
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - added row', (done: Function) => {
      gridObj.actionComplete = null;
      rows = gridObj.grid.getRows();
      gridObj.selectRow(11);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'test1';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[11].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '122' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('test1');
        expect(gridObj.dataSource[7].TaskID === 122).toBeTruthy();
        expect(gridObj.dataSource[7].TaskName).toBe('test1');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('edit row - deep child parent row', (done: Function) => {
      gridObj.actionComplete = null;
      gridObj.selectRow(3);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'TaskName') as any).value = 'test2';
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[3].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '22' ).toBeTruthy();
        expect(cells[1].textContent ).toBe('test2');
        expect(gridObj.dataSource[3].TaskID === 22).toBeTruthy();
        expect(gridObj.dataSource[3].TaskName).toBe('test2');
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('delete row - deep child parent row', (done: Function) => {
      gridObj.selectRow(3);
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[3].querySelectorAll('.e-rowcell');
        let previousrowCell: NodeListOf<Element> = gridObj.grid.getRows()[2].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '3' ).toBeTruthy();
        expect(previousrowCell[1].querySelector('.e-treegridexpand')).toBeNull();
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
    });
    it('delete row - added row', (done: Function) => {
      gridObj.selectRow(3);
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[3].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '4' ).toBeTruthy();
        done();
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Hirarchy editing - Add at Child', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: selfEditData,
          idMapping: 'TaskID',
        parentIdMapping: 'parentID',
        editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Child' },

        treeColumnIndex: 1,
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
        columns: [{field: 'TaskID', headerText: 'Task ID', isPrimaryKey: true},
{field: 'TaskName', headerText: 'Task Name'},
{field: 'StartDate', headerText: 'Start Date'},
{field: 'Progress', headerText: 'Progress'}
]
        },
        done
      );
    });
    it('on property changed - with edit form', () => {
      gridObj.selectRow(1);
      gridObj.startEdit();
      gridObj.editSettings.mode = 'Cell';
      gridObj.dataBind();
      expect(gridObj.element.querySelector('.e-gridform')).toBeNull();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
 
  describe('Editing - Addrecord through method', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
        dataSource: sampleData,
        childMapping: 'subtasks',
        editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true,},
        treeColumnIndex: 1,
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
        columns: [{field: 'taskID', headerText: 'Task ID', isPrimaryKey: true},
                  {field: 'taskName', headerText: 'Task Name'},
                  {field: 'startDate', headerText: 'Start Date'},
                  {field: 'progress', headerText: 'Progress'}]
        },
        done
      );
    });
    it('Addrecordmethod - add as child', (done: Function) => {
      actionComplete = (args?: any): void => {
          expect(gridObj.dataSource[0][gridObj.childMapping][2][gridObj.childMapping][0].taskID).toBe(111);
          expect(gridObj.grid.dataSource[4].taskID).toBe(111);
          done();
      }
      gridObj.actionComplete = actionComplete;
      gridObj.addRecord({taskID:111,taskName: 'test'}, 3, 'Child');
    });
    it('Addrecordmethod - add To Below', (done: Function) => {
      actionComplete = (args?: any): void => {
          expect(gridObj.dataSource[0][gridObj.childMapping].length).toBe(5);
          expect(gridObj.grid.dataSource[2].taskID).toBe(123);
          expect(gridObj.dataSource[0]["subtasks"][1].taskID).toBe(123);
          done();
      }
      gridObj.actionComplete = actionComplete;
      gridObj.addRecord({taskID:123,taskName: 'Below record'}, 1, 'Below');
    });
    it('Addrecordmethod - add as Above', (done: Function) => {
      actionComplete = (args?: any): void => {
        expect(gridObj.dataSource[0]["subtasks"][0].taskID).toBe(124);
        expect(gridObj.grid.dataSource[1].taskID).toBe(124);
          expect(gridObj.dataSource[0][gridObj.childMapping].length).toBe(6);
          done();
      }
      gridObj.actionComplete = actionComplete;
      gridObj.addRecord({taskID:124, taskName: 'Above record'}, 1, 'Above');
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

