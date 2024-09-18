import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData, selfEditData, projectDatas as data } from '../base/datasource.spec';
import { Edit } from '../../src/treegrid/actions/edit';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { Sort } from '../../src/treegrid/actions/sort';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { EmitType, createElement, remove } from '@syncfusion/ej2-base';
import { EditEventArgs } from '@syncfusion/ej2-grids';
import { ITreeData } from '../../src';
import { select } from '@syncfusion/ej2-base';
import { RowDD } from '../../src/treegrid/actions/rowdragdrop';
import { VirtualScroll } from '../../src/treegrid/actions/virtual-scroll';


/**
 * Grid Row Edit spec 
 */
TreeGrid.Inject(Edit, Toolbar, Sort, RowDD, VirtualScroll);
describe('Edit module', () => {
  beforeAll(() => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
        console.log("Unsupported environment, window.performance.memory is unavailable");
        pending(); //Skips test (in Chai)
        return;
    }
  });

  describe('Hirarchy editing - Add at top', () => {
    let gridObj: TreeGrid;
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
      (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '121';
      (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'first';
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
      (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '122';
      (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'second';
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
      (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'test1';
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
      (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'test2';
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
    (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '121';
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'first';
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
    (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '122';
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'second';
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
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'test1';
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
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'test2';
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
    (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '121';
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'first';
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
    (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '122';
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'second';
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
    (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '123';
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'third';
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
    (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '124';
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'fourth';
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
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'test1';
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
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'test3';
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
    (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '121';
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'first';
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
    (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '122';
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'second';
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
    (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '123';
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'third';
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
    (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '124';
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'fourth';
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
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'test1';
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
    (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '121';
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'first';
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
    (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '122';
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'second';
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
    (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '123';
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'third';
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
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'test1';
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
    (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '121';
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'first';
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
    (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '122';
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'second';
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
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'test1';
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
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'test2';
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
    (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '121';
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'first';
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
    (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '122';
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'second';
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
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'test1';
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
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'test2';
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
    (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '121';
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'first';
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
    (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '122';
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'second';
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
    (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '123';
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'third';
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
    (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '124';
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'fourth';
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
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'test1';
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
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'test3';
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
        idMapping: "TaskID",
        parentIdMapping: "parentID",
        editSettings: {
          allowEditing: true,
          mode: "Row",
          allowDeleting: true,
          allowAdding: true,
          newRowPosition: "Bottom",
        },

        treeColumnIndex: 1,
        toolbar: [
          "Add",
          "Edit",
          "Update",
          "Delete",
          "Cancel",
          "ExpandAll",
          "CollapseAll",
        ],
        columns: [
          { field: "TaskID", headerText: "Task ID", isPrimaryKey: true },
          { field: "TaskName", headerText: "Task Name" },
          { field: "StartDate", headerText: "Start Date" },
          { field: "Progress", headerText: "Progress" },
        ],
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
    (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '121';
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'first';
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
    (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '122';
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'second';
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
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'test1';
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
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'test2';
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
    (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '121';
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'first';
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
    (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '122';
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'second';
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
    (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '123';
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'third';
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
    (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '124';
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'fourth';
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
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'test1';
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
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'test3';
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
    (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '121';
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'first';
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
    (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '122';
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'second';
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
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'test1';
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
    (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'test2';
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
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: selfEditData,
        idMapping: "TaskID",
        parentIdMapping: "parentID",
        editSettings: {
          allowEditing: true,
          mode: "Row",
          allowDeleting: true,
          allowAdding: true,
          newRowPosition: "Child",
        },

        treeColumnIndex: 1,
        toolbar: [
          "Add",
          "Edit",
          "Update",
          "Delete",
          "Cancel",
          "ExpandAll",
          "CollapseAll",
        ],
        columns: [
          { field: "TaskID", headerText: "Task ID", isPrimaryKey: true },
          { field: "TaskName", headerText: "Task Name" },
          { field: "StartDate", headerText: "Start Date" },
          { field: "Progress", headerText: "Progress" },
        ],
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

describe('Add new row as child collapsed rows', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
          dataSource: sampleData,
          childMapping: 'subtasks',
          height: 300,
          editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Child' },

          treeColumnIndex: 1,
          toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
            columns: [
            {
              field: 'taskID', headerText: 'Task ID', textAlign: 'Right',
              width: 90, isPrimaryKey: true
          },
          { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220},
          { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130,
              format: 'yMd' },
          {
              field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100,
          }
            ]
      },
      done
    );
  });
  it('Add new row as child collapsed rows- Add row - child', (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === 'add') {
        expect(args.row.rowIndex == 20).toBe(true);
        done();
      }
    };
    gridObj.actionComplete = actionComplete;
    (gridObj.getRows()[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
    gridObj.grid.selectRow(12);
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
  });
  it('Add new row as child collapsed rows- Add record - child', (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === 'save') {
        expect(gridObj.getRows().length == 37).toBe(true);
        expect(gridObj.dataSource[2].subtasks[0].subtasks[1].taskID == 133).toBe(true);
        done();
      }
    };
    gridObj.actionComplete = actionComplete;
    let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
    (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = 133;
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });      
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('Add new row as child collapsed rows after delete', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
          dataSource: sampleData,
          childMapping: 'subtasks',
          height: 300,
          editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Child' },
          treeColumnIndex: 1,
          toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
            columns: [
            {
              field: 'taskID', headerText: 'Task ID', textAlign: 'Right',
              width: 90, isPrimaryKey: true
          },
          { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220},
          { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130,
              format: 'yMd' },
          {
              field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100,
          }
            ]
      },
      done
    );
  });
  it('Add new row as child collapsed rows after delete- Delete row - child', (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === 'delete') {
        expect(gridObj.getRows().length == 35).toBe(true);
        expect(gridObj.dataSource[2].subtasks[0].subtasks[0].subtasks[0].taskName == "Development Task 2").toBe(true);
        done();
      }
    };
    gridObj.actionComplete = actionComplete;
    (gridObj.getRows()[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
    gridObj.grid.selectRow(14);
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
  });
  it('Add new row as child collapsed rows after delete- Add row - child', (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === 'add') {
        expect(args.row.rowIndex == 19).toBe(true);
        done();
      }
    };
    gridObj.actionComplete = actionComplete;
    gridObj.grid.selectRow(12);
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
  });
  it('Add new row as child collapsed rows- Add record - child', (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === 'save') {
        expect(gridObj.getRows().length == 36).toBe(true);
        expect(gridObj.dataSource[2].subtasks[0].subtasks[1].taskID == 133).toBe(true);
        done();
      }
    };
    gridObj.actionComplete = actionComplete;
    let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
    (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = 133;
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    
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

describe('Editing with Sorting', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Child' },
          allowSorting: true,
          sortSettings: {columns: [{field: 'taskName', direction: 'Ascending'}]},
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
  it('delete row - after sorting', (done: Function) => {
    gridObj.selectRow(1);
    actionComplete = (args?: any): void => {
      let cells: NodeListOf<Element> = gridObj.grid.getRows()[1].querySelectorAll('.e-rowcell');
      expect(cells[0].textContent === '10' ).toBeTruthy();
      expect(cells[1].textContent === 'Design Documentation').toBeTruthy();
      done();
    };
    gridObj.actionComplete = actionComplete;
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
  });
  it('add row as child - after sorting', (done: Function) => {
    gridObj.selectRow(1);
    actionComplete = (args?: any): void => {
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '121';
      (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'child1';
      if(args.requestType === 'save'){
        expect(gridObj.getRows().length).toBe(36);
        expect(gridObj.dataSource[1].subtasks[3].subtasks[0].taskID === 121).toBe(true);
        expect(gridObj.dataSource[1].subtasks[3].subtasks[0].taskName === 'child1').toBe(true);
        done();
      } 
    };
    gridObj.actionComplete = actionComplete;
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('EJ2-31696-Default contextmenu Expand collapse throw script error in All platform', () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Child' },
          allowSorting: true,
          sortSettings: {columns: [{field: 'taskName', direction: 'Ascending'}]},
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
  it('Throw script error while expand collapse', () => {
    let event: MouseEvent = new MouseEvent('dblclick', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    gridObj.getCellFromIndex(0,1).querySelector(".e-treegridexpand").dispatchEvent(event);
    gridObj.selectRow(2);
    expect(gridObj.getRows()[2].getElementsByClassName('e-rowcell').length > 0).toBe(true);
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('Expand Collapse with Editing', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
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
  it('Cancel Edit after Collapsing Row', (done: Function) => {
    gridObj.selectRow(0);
    actionComplete = (args?: any): void => {
      expect(gridObj.getRows()[0].querySelectorAll('.e-treegridcollapse').length).toBe(1);
      done();
    };
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
    gridObj.collapseRow(gridObj.getRows()[0]);      
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
    gridObj.actionComplete = actionComplete;
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
  });
  
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('EJ2-31696-Default contextmenu Expand collapse throw script error in All platform', () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Child' },
        allowSorting: true,
        sortSettings: {columns: [{field: 'taskName', direction: 'Ascending'}]},
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
  it('Throw script error while expand collapse', () => {
    let event: MouseEvent = new MouseEvent('dblclick', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    gridObj.getCellFromIndex(0,1).querySelector(".e-treegridexpand").dispatchEvent(event);
    gridObj.selectRow(2);
    expect(gridObj.getRows()[2].getElementsByClassName('e-active').length >= 0).toBe(true);
    expect(gridObj.grid.editModule.formObj === undefined).toBe(true);
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('EJ2-31713-While add after expand through script error in platform', () => {
  let gridObj: TreeGrid;
  let rows: HTMLTableRowElement[];
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true },
          treeColumnIndex: 1,
          toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
            { field: 'taskName', headerText: 'Task Name' },
            { field: 'progress', headerText: 'Progress' },
            { field: 'startDate', headerText: 'Start Date' }
          ]
      },
      done
    );
  });
  it('While add after expand through script error in platform', (done: Function) => {
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    actionComplete = (args?: any): void => {
      let cells: NodeListOf<Element> = gridObj.grid.getRows()[0].querySelectorAll('.e-rowcell');
      expect(cells[0].textContent === '121' ).toBeTruthy();
      expect(cells[1].textContent === 'first').toBeTruthy();
      done()
    };
    gridObj.actionComplete = actionComplete;
    var formEle = gridObj.grid.editModule.formObj.element;
    (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '121';
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'first';
    (select('#' + gridObj.grid.element.id + 'progress', formEle) as any).value = '23';
    rows = gridObj.getRows();      
    (rows[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();      
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('EJ2-32035- Adding a new row after collapsing a row does not maintain collapsed state with paging', () => {
  let gridObj: TreeGrid;
  let rows: HTMLTableRowElement[];
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowPaging: true,
          editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true },
          treeColumnIndex: 1,
          toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
            { field: 'taskName', headerText: 'Task Name' },
            { field: 'progress', headerText: 'Progress' },
            { field: 'startDate', headerText: 'Start Date' }
          ]
      },
      done
    );
  });
  it('Add a new row after collapsing a row', (done: Function) => {
    rows = gridObj.getRows();
    (rows[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    actionComplete = (args?: any): void => {
      let cells: NodeListOf<Element> = gridObj.grid.getRows()[0].querySelectorAll('.e-rowcell');
      expect(cells[0].textContent === '121' ).toBeTruthy();
      expect(cells[1].textContent === 'first').toBeTruthy();
      expect(gridObj.grid.getRows()[1].getElementsByClassName('e-treegridcollapse').length).toBe(1);
      expect(gridObj.grid.getRows()[2].getElementsByClassName('e-treegridexpand').length).toBe(1);
      done()
    };
    gridObj.actionComplete = actionComplete;
    var formEle = gridObj.grid.editModule.formObj.element;
    (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '121';
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'first';
    (select('#' + gridObj.grid.element.id + 'progress', formEle) as any).value = '23';
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('EJ2-34712- Edit form does not generated when we add new record with collapsed state', () => {
  let gridObj: TreeGrid;
  let rows: HTMLTableRowElement[];
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowPaging: true,
          editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: "Child" },
          treeColumnIndex: 1,
          toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
            { field: 'taskName', headerText: 'Task Name' },
            { field: 'progress', headerText: 'Progress' },
            { field: 'startDate', headerText: 'Start Date' }
          ]
      },
      done
    );
  });
  it('Add a new row after collapsing a row', (done: Function) => {
    rows = gridObj.getRows();
    (rows[5].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
    gridObj.selectRow(5);
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    actionComplete = (args?: any): void => {
      let cells: NodeListOf<Element> = gridObj.grid.getRows()[11].querySelectorAll('.e-rowcell');
      expect(cells[0].textContent === '121' ).toBeTruthy();
      expect(cells[1].textContent === 'first').toBeTruthy();
      expect(gridObj.grid.getRows()[5].getElementsByClassName('e-treegridexpand').length).toBe(1);
      done()
    };
    gridObj.actionComplete = actionComplete;
    var formEle = gridObj.grid.editModule.formObj.element;
    (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '121';
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'first';
    (select('#' + gridObj.grid.element.id + 'progress', formEle) as any).value = '23';
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('Ensuring random adding in newRowPosition Below', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
      dataSource: sampleData,
      childMapping: 'subtasks',
      editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Below'},
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
  it('Add Row', (done: Function) => {
    actionComplete = (args?: any): void => {
      let childRecords: string = 'childRecords';
      expect(gridObj.getCurrentViewRecords()[0]['childRecords'].length === 4).toBe(true);
      done()
    };
    gridObj.actionComplete = actionComplete;
    gridObj.selectRow(0);
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = "1111";
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
  });
  
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('Remote Data Editing with Child Mode', () => {
    
  let gridObj: TreeGrid;
  let elem: HTMLElement = createElement('div', { id: 'Grid' });
  let request: JasmineAjaxRequest;
  let dataManager: DataManager;
  let originalTimeout: number;
  let actionBegin: (args: any) => void;
  let actionComplete: (args: any) => void;
  beforeAll((done: Function) => {
      let dataBound: EmitType<Object> = () => { done(); };
      jasmine.Ajax.install();
      spyOn(window, 'fetch').and.returnValue(Promise.resolve(
        new Response(JSON.stringify({ d: data.slice(0, 3), __count: 3 }), {
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
              toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
              editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Child' },
              parentIdMapping: 'parentID',
              treeColumnIndex: 1,
              columns: [
                  { field: "TaskID", headerText: "Task Id", isPrimaryKey: true },
                  { field: "TaskName", headerText: "Task Name" },
                  { field: "StartDate", headerText: "Start Date" },
                  { field: "EndDate", headerText: "End Date" },                    
                  { field: "Progress", headerText: "Progress" }
            ]
          });
      gridObj.appendTo('#Grid');
      request = window.fetch['calls'].mostRecent();
  });

  it('Add Row - No Selection', function (done) {
      actionComplete = function (args) {
          if (args.requestType === 'add') {
              expect(args.row.rowIndex).toBe(0);
              done();
          }
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
  });
  it('Add Row - ActionBegin Event', function (done) {
      var formEle = gridObj.grid.editModule.formObj.element;
      (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '121';
      (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'first';
      (select('#' + gridObj.grid.element.id + 'Progress', formEle) as any).value = '23';
      actionBegin = function (args) {
          expect(args.data.TaskName === 'first').toBe(true);
          done();
      };
      gridObj.actionBegin = actionBegin;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
  });
  afterAll(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      gridObj.destroy();
      remove(elem);
      jasmine.Ajax.uninstall();
  });
});

describe('Hirarchy misalignment when setrowdata is used to replace the value', () => {
  let gridObj: TreeGrid;
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
  it('hierarchical misalignment', (done: Function) => {
    gridObj.setRowData(2,{taskID: 2, taskName :"aaaa"} as ITreeData);
    expect(gridObj.getRows()[1].getElementsByClassName('e-treecolumn-container')[0].querySelectorAll('span.e-icons').length).toBe(3);
        done();
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('update rows methods', () => {
  let gridObj: TreeGrid;
  let actionComplete: ()=> void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' },
        columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
        { field: 'taskName', headerText: 'Task Name' },
        { field: 'progress', headerText: 'Progress' },
        { field: 'startDate', headerText: 'Start Date' }
        ]
      },     
      done
    );
  });
  it('methods', (done: Function) => {
    actionComplete = (args?:EditEventArgs): void => {
      if (args.requestType == 'save') {
        expect(gridObj.dataSource[0].taskName=='test');
        done();
  }
}
gridObj.actionComplete = actionComplete;
gridObj.updateRow(0,{taskID:1, taskName:"test"});
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('Editing - Add', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
          dataSource:[] ,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, mode: 'Cell', allowDeleting: true, allowAdding: true, newRowPosition: 'Bottom' },

          treeColumnIndex: 1,
          toolbar: ['Add', 'Edit', 'Update', 'Delete'],
            columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
            { field: 'taskName', headerText: 'Task Name' },
            { field: 'progress', headerText: 'Progress' },
            { field: 'startDate', headerText: 'Start Date' }
            ]
      },
      done
    );
  });
  
    
      it('Add row ', (done: Function) => {
        actionComplete = (args?: any): void => {
          if (args.requestType === 'save') {
            expect(gridObj.getRows().length == 1).toBe(true);
            done();
          }
        };
        gridObj.actionComplete = actionComplete;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = "11";
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
       });
       afterAll(() => {
    destroy(gridObj);
  });
});

describe('Editing - Add', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
          dataSource:[] ,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, mode: 'Cell', allowDeleting: true, allowAdding: true, newRowPosition: 'Below' },
          treeColumnIndex: 1,
          toolbar: ['Add', 'Edit', 'Update', 'Delete'],
            columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
            { field: 'taskName', headerText: 'Task Name' },
            { field: 'progress', headerText: 'Progress' },
            { field: 'startDate', headerText: 'Start Date' }
            ]
      },
      done
    );
  });
      it('Add row with Below position', (done: Function) => {
        actionComplete = (args?: any): void => {
          if (args.requestType === 'save') {
            expect(gridObj.getRows().length == 1).toBe(true);
            done();
          }
        };
        gridObj.actionComplete = actionComplete;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = "11";
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
       });
       afterAll(() => {
    destroy(gridObj);
  });
});

describe('Expand / Collapse Icon Issue when adding a new record', () => {
  let gridObj: TreeGrid;
  let rows: Element[];
  let actionComplete: () => void;
  let data =[{"TaskId":1,"TaskName":"Parent Task 1","Duration":10,"ParentId":null,"isParent":true,"isExpanded":true},
  {"TaskId":2,"TaskName":"Child task 1","Duration":4,"ParentId":null,"isParent":null,"isExpanded":true},
  {"TaskId":13,"TaskName":"Child task 5","Duration":4,"ParentId":2,"isParent":null,"isExpanded":false},
  {"TaskId":5,"TaskName":"Parent Task 2","Duration":10,"ParentId":null,"isParent":true,"isExpanded":true},
  {"TaskId":6,"TaskName":"Child task 2","Duration":4,"ParentId":5,"isParent":null,"isExpanded":false},
  {"TaskId":10,"TaskName":"Parent Task 3","Duration":10,"ParentId":null,"isParent":true,"isExpanded":true},
  {"TaskId":11,"TaskName":"Child task 3","Duration":4,"ParentId":10,"isParent":false,"isExpanded":false}];
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: data,
        idMapping: 'TaskId',
         treeColumnIndex: 1,
                parentIdMapping: 'ParentId',
                expandStateMapping: "isExpanded",
                        editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                mode: 'Row',
                newRowPosition: 'Below'
            },
             toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
        columns: [
          { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', isPrimaryKey:true, width: 140 },
          { field: 'TaskName', headerText: 'Task Name', width: 160 }
         
        ]
      },
      done
    );
  });
  it(' New row Add with the position below', (done: Function) => {
    gridObj.selectRow(0);
    actionComplete = (args?: any): void => {
    if (args.requestType === 'save') {
      rows = gridObj.getRows();
      let cells: NodeListOf<Element> = gridObj.grid.getRows()[1].querySelectorAll('.e-rowcell');
      expect(rows.length == 8).toBe(true);
      expect(cells[0].textContent === '25' ).toBeTruthy();
      expect(rows[0].getElementsByClassName('e-treegridexpand').length).toBe(0);
      expect(rows[1].getElementsByClassName('e-treegridexpand').length).toBe(0);
      done();
     }
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = "25";
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
  
  afterAll(() => {
    destroy(gridObj);
  });
}); 

describe('Updaterow method with self reference data', () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: selfEditData,
        idMapping: 'TaskID',
        parentIdMapping: 'parentID',
        treeColumnIndex: 1,
        allowPaging:true,
        pageSettings: {pageSize:10},
        columns: [{field: 'TaskID', headerText: 'Task ID', isPrimaryKey: true},
                  {field: 'TaskName', headerText: 'Task Name'},
                  {field: 'StartDate', headerText: 'Start Date'},
                  {field: 'Progress', headerText: 'Progress'}
       ]
      },     
      done
    );
  });
  it(' update row method', () => {
    gridObj.updateRow(undefined,{TaskID:7, TaskName:"Changed"});
    expect(gridObj.dataSource[7].TaskName=='Changed');
    });
    
  it(' update row method with index value', () => {
    gridObj.updateRow(1,{TaskID:2, TaskName:"test"});
    expect(gridObj.dataSource[1].TaskName=='test');
   });

  afterAll(() => {
    destroy(gridObj);
  });
});

describe('EJ2-48145 - Adding parent and child together with addRecord method', () => {
  let gridObj: TreeGrid;
  let d: string = 'dataSource'; let t: string = 'taskID'; let c: any = 'subtasks';
  let actionComplete: () => void;
  let arr: Object[] = [{
    taskID: 1000,
    taskName: 'Parent',
    startDate: new Date('02/17/2017'),
    endDate: new Date('02/27/2017'),
    priority: 'Normal',
    approved: false,
    duration: 11,
    progress: 69,
    subtasks: [{
      taskID: 1001,
      taskName: 'Child 1',
      startDate: new Date('02/17/2017'),
      endDate: new Date('02/27/2017'),
      priority: 'High',
      approved: false,
      duration: 11,
      progress: 69,
      subtasks: [{
        taskID: 1002,
        taskName: 'Child 2',
        startDate: new Date('02/17/2017'),
        endDate: new Date('02/27/2017'),
        priority: 'High',
        approved: false,
        duration: 11,
        progress: 69,
        subtasks: [{
          taskID: 1003,
          taskName: 'Child 3',
          startDate: new Date('02/17/2017'),
          endDate: new Date('02/27/2017'),
          priority: 'High',
          approved: false,
          duration: 11,
          progress: 69,
        }]
      }]
    }]
  }];
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true },
        treeColumnIndex: 1,
        columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
        { field: 'taskName', headerText: 'Task Name' },
        { field: 'progress', headerText: 'Progress' }]
      },
      done
    );
  });
  it('addRecordmethod - add at default newRowPosition', (done: Function) => {
    actionComplete = (): void => {
      expect(gridObj[d][0][t]).toBe(1000);
      expect(gridObj.grid[d][0][t]).toBe(1000);
      expect(gridObj[d][0][c][0][t]).toBe(1001);
      expect(gridObj.grid[d][0][c][0][t]).toBe(1001);
      expect(gridObj[d][0][c][0][c][0][t]).toBe(1002);
      expect(gridObj.grid[d][0][c][0][c][0][t]).toBe(1002);
      expect(gridObj[d][0][c][0][c][0][c][0][t]).toBe(1003);
      expect(gridObj.grid[d][0][c][0][c][0][c][0][t]).toBe(1003);
      done();
    }
    gridObj.actionComplete = actionComplete;
    gridObj.addRecord(arr[0], 0);
  });
  it('addRecordmethod - add with newRowPosition as top', (done: Function) => {
    actionComplete = (): void => {
      expect(gridObj[d][0][t]).toBe(1000);
      expect(gridObj.grid[d][0][t]).toBe(1000);
      expect(gridObj[d][0][c][0][t]).toBe(1001);
      expect(gridObj.grid[d][0][c][0][t]).toBe(1001);
      expect(gridObj[d][0][c][0][c][0][t]).toBe(1002);
      expect(gridObj.grid[d][0][c][0][c][0][t]).toBe(1002);
      expect(gridObj[d][0][c][0][c][0][c][0][t]).toBe(1003);
      expect(gridObj.grid[d][0][c][0][c][0][c][0][t]).toBe(1003);
      done();
    }
    gridObj.actionComplete = actionComplete;
    gridObj.addRecord(arr[0], 0, 'Top');
  });
  it('addRecordmethod - add with newRowPosition as bottom', (done: Function) => {
    actionComplete = (): void => {
      let index: number = (gridObj.dataSource as ITreeData[]).length - 1;
      expect(gridObj[d][index][t]).toBe(1000);
      expect(gridObj.grid[d][44][t]).toBe(1000);
      expect(gridObj[d][index][c][0][t]).toBe(1001);
      expect(gridObj.grid[d][45][t]).toBe(1001);
      expect(gridObj[d][index][c][0][c][0][t]).toBe(1002);
      expect(gridObj.grid[d][46][t]).toBe(1002);
      expect(gridObj[d][index][c][0][c][0][c][0][t]).toBe(1003);
      expect(gridObj.grid[d][47][t]).toBe(1003);
      done();
    }
    gridObj.actionComplete = actionComplete;
    gridObj.addRecord(arr[0], 0, 'Bottom');
  });
  it('addRecordmethod - add with newRowPosition as Above', (done: Function) => {
    actionComplete = (): void => {
      expect(gridObj[d][2][c][0][t]).toBe(1000);
      expect(gridObj.grid[d][9][t]).toBe(1000);
      expect(gridObj[d][2][c][0][c][0][t]).toBe(1001);
      expect(gridObj.grid[d][9][c][0][t]).toBe(1001);
      expect(gridObj[d][2][c][0][c][0][c][0][t]).toBe(1002);
      expect(gridObj.grid[d][9][c][0][c][0][t]).toBe(1002);
      expect(gridObj[d][2][c][0][c][0][c][0][c][0][t]).toBe(1003);
      expect(gridObj.grid[d][9][c][0][c][0][c][0][t]).toBe(1003);
      done();
    }
    gridObj.actionComplete = actionComplete;
    gridObj.addRecord(arr[0], 9, 'Above');
  });
  it('addRecordmethod - add with newRowPosition as Below', (done: Function) => {
    actionComplete = (): void => {
      expect(gridObj[d][4][t]).toBe(1000);
      expect(gridObj.grid[d][23][t]).toBe(1000);
      expect(gridObj[d][4][c][0][t]).toBe(1001);
      expect(gridObj.grid[d][23][c][0][t]).toBe(1001);
      expect(gridObj[d][4][c][0][c][0][t]).toBe(1002);
      expect(gridObj.grid[d][23][c][0][c][0][t]).toBe(1002);
      expect(gridObj[d][4][c][0][c][0][c][0][t]).toBe(1003);
      expect(gridObj.grid[d][23][c][0][c][0][c][0][t]).toBe(1003);
      done();
    }
    gridObj.actionComplete = actionComplete;
    gridObj.addRecord(arr[0], 17, 'Below');
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('EJ2-48145 - Adding parent and child together with addRecord method and toolbar', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  let arr: Object[] = [{
    taskID: 1000,
    taskName: 'Parent',
    startDate: new Date('02/17/2017'),
    endDate: new Date('02/27/2017'),
    priority: 'Normal',
    approved: false,
    duration: 11,
    progress: 69,
    subtasks: [{
      taskID: 1001,
      taskName: 'Child 1',
      startDate: new Date('02/17/2017'),
      endDate: new Date('02/27/2017'),
      priority: 'High',
      approved: false,
      duration: 11,
      progress: 69,
      subtasks: [{
        taskID: 1002,
        taskName: 'Child 2',
        startDate: new Date('02/17/2017'),
        endDate: new Date('02/27/2017'),
        priority: 'High',
        approved: false,
        duration: 11,
        progress: 69,
        subtasks: [{
          taskID: 1003,
          taskName: 'Child 3',
          startDate: new Date('02/17/2017'),
          endDate: new Date('02/27/2017'),
          priority: 'High',
          approved: false,
          duration: 11,
          progress: 69,
        }]
      }]
    }]
  }];
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true },
        treeColumnIndex: 1,
        toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
        columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
        { field: 'taskName', headerText: 'Task Name' },
        { field: 'progress', headerText: 'Progress' }]
      },
      done
    );
  });
  it('Adding a record using add button', (done: Function) => {
    actionComplete = (args?: Object): void => {
      if (args['requestType'] == "save") {
        expect(gridObj.dataSource[0].taskID === 50).toBe(true);
        done();
      }
    }
    gridObj.grid.actionComplete = actionComplete;
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = '50';
    gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[1].value = 'Add';
    gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[2].value = '10';
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
  });
  it('Adding a record Top of newly added record', function (done) {
    actionComplete = (args?: Object): void => {
      if (args['requestType'] == "refresh") {
        expect(gridObj.dataSource[0].taskID === 1000).toBe(true);
        expect(gridObj.dataSource[1].taskID === 50).toBe(true);
        done();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.addRecord(arr[0], 0, 'Above');
  });
});

describe('EJ2-48145 - Adding parent and child together with addRecord method and sorting enabled', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  let arr: Object[] = [{
    taskID: 1000,
    taskName: 'Parent',
    startDate: new Date('02/17/2017'),
    endDate: new Date('02/27/2017'),
    priority: 'Normal',
    approved: false,
    duration: 11,
    progress: 69,
    subtasks: [{
      taskID: 1001,
      taskName: 'Child 1',
      startDate: new Date('02/17/2017'),
      endDate: new Date('02/27/2017'),
      priority: 'High',
      approved: false,
      duration: 11,
      progress: 69,
      subtasks: [{
        taskID: 1002,
        taskName: 'Child 2',
        startDate: new Date('02/17/2017'),
        endDate: new Date('02/27/2017'),
        priority: 'High',
        approved: false,
        duration: 11,
        progress: 69,
        subtasks: [{
          taskID: 1003,
          taskName: 'Child 3',
          startDate: new Date('02/17/2017'),
          endDate: new Date('02/27/2017'),
          priority: 'High',
          approved: false,
          duration: 11,
          progress: 69,
        }]
      }]
    }]
  }];
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true },
        treeColumnIndex: 1,
        allowSorting: true,
        toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
        columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
        { field: 'taskName', headerText: 'Task Name' },
        { field: 'progress', headerText: 'Progress' }]
      },
      done
    );
  });
  it('Adding a record Top of newly added record', function (done) {
    actionComplete = (args?: Object): void => {
      if (args['requestType'] == "refresh") {
        expect(gridObj.dataSource[0].taskID === 1000).toBe(true);
        done();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.addRecord(arr[0], 0);
    gridObj.sortByColumn("taskID", "Descending", false);
  });
});

describe('EJ2-48145 - Adding parent and child together with addRecord method and paging enabled', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  let arr: Object[] = [{
    taskID: 1000,
    taskName: 'Parent',
    startDate: new Date('02/17/2017'),
    endDate: new Date('02/27/2017'),
    priority: 'Normal',
    approved: false,
    duration: 11,
    progress: 69,
    subtasks: [{
      taskID: 1001,
      taskName: 'Child 1',
      startDate: new Date('02/17/2017'),
      endDate: new Date('02/27/2017'),
      priority: 'High',
      approved: false,
      duration: 11,
      progress: 69,
      subtasks: [{
        taskID: 1002,
        taskName: 'Child 2',
        startDate: new Date('02/17/2017'),
        endDate: new Date('02/27/2017'),
        priority: 'High',
        approved: false,
        duration: 11,
        progress: 69,
        subtasks: [{
          taskID: 1003,
          taskName: 'Child 3',
          startDate: new Date('02/17/2017'),
          endDate: new Date('02/27/2017'),
          priority: 'High',
          approved: false,
          duration: 11,
          progress: 69,
        }]
      }]
    }]
  }];
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true },
        treeColumnIndex: 1,
        allowPaging: true,
        toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
        columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
        { field: 'taskName', headerText: 'Task Name' },
        { field: 'progress', headerText: 'Progress' }]
      },
      done
    );
  });
  it('Adding a record', function (done) {
    actionComplete = (args?: Object): void => {
      if (args['requestType'] == "refresh") {
        expect(gridObj.dataSource[0].taskID === 1000).toBe(true);
        done();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.goToPage(2);
    gridObj.addRecord(arr[0], 0);
  });
});

describe('EJ2-48935 - Adding record with addRecord method at last row position with rowPosition as Below', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  let arr: Object[] = [{
    taskID: 1000,
    taskName: 'Parent',
    startDate: new Date('02/17/2017'),
    endDate: new Date('02/27/2017'),
    priority: 'Normal',
    approved: false,
    duration: 11,
    progress: 69,
    subtasks: [{
      taskID: 1001,
      taskName: 'Child 1',
      startDate: new Date('02/17/2017'),
      endDate: new Date('02/27/2017'),
      priority: 'High',
      approved: false,
      duration: 11,
      progress: 69,
    }]
  }];
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData.slice(0, 1),
        childMapping: 'subtasks',
        editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true },
        treeColumnIndex: 1,
        columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
        { field: 'taskName', headerText: 'Task Name' },
        { field: 'progress', headerText: 'Progress' }]
      },
      done
    );
  });
  it('Adding a record to last row with rowPosition as Below', function (done) {
    actionComplete = (): void => {
        expect(gridObj.dataSource[0].subtasks[4].taskID).toBe(1000);
        done();
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.addRecord(arr[0], 4, "Below");
  });
});

describe('EJ2-48935 - Adding record with addRecord method at last to second row position with rowPosition as Below', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  let arr: Object[] = [{
    taskID: 1000,
    taskName: 'Parent',
    startDate: new Date('02/17/2017'),
    endDate: new Date('02/27/2017'),
    priority: 'Normal',
    approved: false,
    duration: 11,
    progress: 69,
    subtasks: [{
      taskID: 1001,
      taskName: 'Child 1',
      startDate: new Date('02/17/2017'),
      endDate: new Date('02/27/2017'),
      priority: 'High',
      approved: false,
      duration: 11,
      progress: 69,
    }]
  }];
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData.slice(0, 1),
        childMapping: 'subtasks',
        editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true },
        treeColumnIndex: 1,
        columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
        { field: 'taskName', headerText: 'Task Name' },
        { field: 'progress', headerText: 'Progress' }]
      },
      done
    );
  });
  it('Adding a record to last to second row with rowPosition as Below', function (done) {
    actionComplete = (): void => {
        expect(gridObj.dataSource[0].subtasks[3].taskID).toBe(1000);
        done();
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.addRecord(arr[0], 3, "Below");
  });
});

describe('Editing - double click on icon', () => {
	let gridObj: TreeGrid;
	beforeAll((done: Function) => {
		gridObj = createGrid(
			{
				dataSource: [],
				childMapping: 'subtasks',
				editSettings: { allowEditing: true, mode: 'Cell', allowDeleting: true, allowAdding: true, newRowPosition: 'Below' },
				treeColumnIndex: 1,
				toolbar: ['Add', 'Edit', 'Update', 'Delete'],
				columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
				{ field: 'taskName', headerText: 'Task Name' },
				{ field: 'progress', headerText: 'Progress' },
				{ field: 'startDate', headerText: 'Start Date' }
				]
			},
			done
		);
	});
	it('double click on icon', () => {
		for (let i: number = 0; i<gridObj.getInjectedModules().length; i++) {
			if (gridObj.getInjectedModules()[i].name != "Freeze") {
				expect(gridObj.getInjectedModules()[i].name != "Freeze").toBe(true);
			}
		}		
	});
	afterAll(() => {
		destroy(gridObj);
	});
});

describe('EJ2-54664 - delete the parent and child record using deleteRecord method', () => {
  let gridObj: TreeGrid;
  let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
            enableVirtualization:true,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            height: 400,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                mode: 'Row',

            },
            toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
            columns: [
                {
                    field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 90
                },
                { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
                { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130,
                  format: 'yMd' },
                {
                    field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100,
                }
            ],
            actionFailure: actionFailedFunction
      },
      done
    );
  });
  it('Delete -  Parent and Child record', (done: Function) => {
    gridObj.deleteRecord('taskID', {taskID:1});
    expect(gridObj.flatData.length === 31).toBe(true);
    done();
  });

  it('Delete without selection', (done: Function) => {
    gridObj.deleteRecord();
    expect(actionFailedFunction).toHaveBeenCalled();
    done();
  });
});

describe('EJ2-69973 - script error throws while collapsing a record after editing any parent row', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        height: 400,
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            mode: 'Row',
            newRowPosition: 'Below'

        },
        toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
        columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220, validationRules: {required: true} },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd', validationRules: { date: true} },
            {
                field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100, editType: 'numericedit',
                validationRules: { number: true, min: 0}, edit: { params: {  format: 'n'}}
            }
        ]
      },
      done
    );
  });
  it('collapsing a record after editing any parent row', (done: Function) => {
    actionComplete = (args?: Object): void => {
      if (args['requestType'] == "save") {
        expect(gridObj.dataSource[0].taskName).toBe('test');
        (gridObj.getRows()[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
        done();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.selectRow(0);
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
    let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
    (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'test';
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('Add rows - Add rows as child', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
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
  it('Add row - new row postion', (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === 'add') {
        expect(args.row.rowIndex).toBe(5);
        done();
      }
    };
    gridObj.actionComplete = actionComplete;
    gridObj.grid.selectRow(0);
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('ActionBegin action called twice while on Row Editing - 828869', () => {
  let gridObj: TreeGrid;
  let actionBegin: () => void;
  let count: number = 0;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Child' },
          treeColumnIndex: 1,
          toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
            { field: 'taskName', headerText: 'Task Name' },
            { field: 'progress', headerText: 'Progress' },
            { field: 'startDate', headerText: 'Start Date' }
            ]
      },
      done
    );
  });
  it('Ensuring actionBegin event triggering', (done: Function) => {
    actionBegin = (args?: any): void => {
      if (args.requestType === 'beginEdit') {
        count++;
        done();
      }
    };
    gridObj.actionBegin = actionBegin;
    gridObj.startEdit(gridObj.getRows()[0]);
    expect(count).toBe(1);
  });
  afterAll(() => {
    destroy(gridObj);
  });  
});

describe('Code coverage improment', () => {
  let gridObj: TreeGrid;
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
  it('check the removeEventListener Binding', (done: Function) => {
    gridObj.isDestroyed = false;
    gridObj.editModule.removeEventListener();
    done();
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('Remote Data Editing with Below Mode', () => {    
  let gridObj: TreeGrid;
  let elem: HTMLElement = createElement('div', { id: 'Grid' });
  let request: JasmineAjaxRequest;
  let dataManager: DataManager;
  let originalTimeout: number;
  let actionBegin: (args: any) => void;
  let actionComplete: (args: any) => void;
  beforeAll((done: Function) => {
      let dataBound: EmitType<Object> = () => { done(); };
      spyOn(window, 'fetch').and.returnValue(Promise.resolve(
        new Response(JSON.stringify({ d: data.slice(0, 3), __count: 3 }), {
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
              toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
              editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Below' },
              parentIdMapping: 'parentID',
              treeColumnIndex: 1,
              columns: [
                  { field: "TaskID", headerText: "Task Id", isPrimaryKey: true },
                  { field: "TaskName", headerText: "Task Name" },
                  { field: "StartDate", headerText: "Start Date" },
                  { field: "EndDate", headerText: "End Date" },                    
                  { field: "Progress", headerText: "Progress" }
            ]
          });
      gridObj.appendTo('#Grid');
      request = window.fetch['calls'].mostRecent();
  });

  it('Add Row - No Selection', function (done) {
      actionComplete = function (args) {
          if (args.requestType === 'add') {
              expect(args.row.rowIndex).toBe(0);
              done();
          }
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
  });
  it('Add Row - ActionBegin Event', function (done) {
      var formEle = gridObj.grid.editModule.formObj.element;
      (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '121';
      (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'first';
      (select('#' + gridObj.grid.element.id + 'Progress', formEle) as any).value = '23';
      actionBegin = function (args) {
          expect(args.data.TaskName === 'first').toBe(true);
          done();
      };
      gridObj.actionBegin = actionBegin;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
  });
  afterAll(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      gridObj.destroy();
      remove(elem);
      jasmine.Ajax.uninstall();
  });
});

describe('Remote Data Editing with Above Mode', () => {
    
  let gridObj: TreeGrid;
  let elem: HTMLElement = createElement('div', { id: 'Grid' });
  let request: JasmineAjaxRequest;
  let dataManager: DataManager;
  let originalTimeout: number;
  let actionBegin: (args: any) => void;
  let actionComplete: (args: any) => void;
  beforeAll((done: Function) => {
      let dataBound: EmitType<Object> = () => { done(); };
      spyOn(window, 'fetch').and.returnValue(Promise.resolve(
        new Response(JSON.stringify({ d: data.slice(0, 3), __count: 3 }), {
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
              toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
              editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Above' },
              parentIdMapping: 'parentID',
              treeColumnIndex: 1,
              columns: [
                  { field: "TaskID", headerText: "Task Id", isPrimaryKey: true },
                  { field: "TaskName", headerText: "Task Name" },
                  { field: "StartDate", headerText: "Start Date" },
                  { field: "EndDate", headerText: "End Date" },                    
                  { field: "Progress", headerText: "Progress" }
            ]
          });
      gridObj.appendTo('#Grid');
      request = window.fetch['calls'].mostRecent();
  });

  it('Add Row - No Selection', function (done) {
      actionComplete = function (args) {
          if (args.requestType === 'add') {
              expect(args.row.rowIndex).toBe(0);
              done();
          }
      };
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
  });
  it('Add Row - ActionBegin Event', function (done) {
      var formEle = gridObj.grid.editModule.formObj.element;
      (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '121';
      (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'first';
      (select('#' + gridObj.grid.element.id + 'Progress', formEle) as any).value = '23';
      actionBegin = function (args) {
          expect(args.data.TaskName === 'first').toBe(true);
          done();
      };
      gridObj.actionBegin = actionBegin;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
  });
  afterAll(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      gridObj.destroy();
      remove(elem);
      jasmine.Ajax.uninstall();
  });
});

describe('Code coverage improment', () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        allowPaging: true,
        treeColumnIndex: 1,
        editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Top' },
        height: '410',
        columns: [
            { field: 'taskID', headerText: 'Task ID', width: 60, textAlign: 'Right', isPrimaryKey: true },
            { field: 'taskName', headerText: 'Task Name', width: 150, textAlign: 'Left'},
            { field: 'startDate', headerText: 'Start Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd' },
        ]
      },
      done
    );
  });
  it('Check double click on treegrid expand', () => {
    let event: MouseEvent = new MouseEvent('dblclick', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    gridObj.getRowByIndex(0).querySelector('.e-treegridexpand').dispatchEvent(event);
  });
  afterAll(() => {
    destroy(gridObj);
  });
});
