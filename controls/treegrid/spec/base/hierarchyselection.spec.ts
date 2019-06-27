import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from './treegridutil.spec';
import { sampleData } from './datasource.spec';
import { Page } from '../../src/treegrid/actions/page';
import { Filter } from '../../src/treegrid/actions/filter';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { Edit } from '../../src/treegrid/actions/edit';
import { Sort } from '../../src/treegrid/actions/sort';
import { Aggregate } from '../../src/treegrid/actions/summary';
import { PageEventArgs, FilterEventArgs, EditEventArgs } from '@syncfusion/ej2-grids';

/**
 * TreeGrid HierarchySelection spec 
 */
TreeGrid.Inject(Page,Filter,Toolbar,Edit,Aggregate,Sort);

describe('TreeGrid Hierarchy Selection', () => {
  describe('select Checkboxes using selectCheckboxes method', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          allowFiltering: true,
          allowTextWrap: true,
          autoCheckHierarchy: true,
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Task Name', width: 150, showCheckbox: true },
            { field: 'duration', headerText: 'Duration', type: "number", width: 150 },
            { field: 'progress', headerText: 'Progress', width: 150 },
            { field: 'startDate', headerText: 'Start Date', type: "date", format: 'yMd', width: 150 }
          ],
        },
        done
      );
    });
    it('select the checkBoxes', () => {
      gridObj.selectCheckboxes([1,2]);
      expect(gridObj.getCheckedRecords().length).toBe(2);
      expect(gridObj.getCheckedRowIndexes().length).toBe(2);
      expect(gridObj.getCheckedRowIndexes()[0]).toBe(1);
      expect(gridObj.getCheckedRowIndexes()[1]).toBe(2);
      expect(gridObj.getRows()[1].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
      expect(gridObj.getRows()[2].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
      expect(gridObj.getRows()[0].querySelector('.e-frame').classList.contains('e-stop')).toBeTruthy();
      expect(gridObj.getHeaderTable().querySelectorAll('th')[1].querySelector('.e-frame').classList.contains('e-stop')
      ).toBeTruthy();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

    describe('select Checkboxes using selectCheckboxes method', () => {
      let gridObj: TreeGrid;
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            allowPaging: true,
            allowFiltering: true,
            autoCheckHierarchy: true,
            columns: [
              { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 120 },
              { field: 'taskName', headerText: 'Task Name', width: 150, showCheckbox: true },
              { field: 'duration', headerText: 'Duration', type: "number", width: 150 },
              { field: 'progress', headerText: 'Progress', width: 150 },
              { field: 'startDate', headerText: 'Start Date', type: "date", format: 'yMd', width: 150 }
            ],
          },
          done
        );
      });
      it('select the checkBoxes', () => {
        gridObj.selectCheckboxes([0]);
        expect(gridObj.getCheckedRecords().length).toBe(5);
        expect(gridObj.getCheckedRowIndexes().length).toBe(5);
        expect(gridObj.getCheckedRowIndexes()[0]).toBe(0);
        expect(gridObj.getCheckedRowIndexes()[1]).toBe(1);
        expect(gridObj.getRows()[1].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
        expect(gridObj.getRows()[2].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
        expect(gridObj.getRows()[3].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
        expect(gridObj.getRows()[4].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
        expect(gridObj.getRows()[0].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
        expect(gridObj.getHeaderTable().querySelectorAll('th')[1].querySelector('.e-frame').classList.contains('e-stop')
      ).toBeTruthy();
      });
      afterAll(() => {
        destroy(gridObj);
      });
  });

  describe('select Checkboxes using selectCheckboxes method', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          allowFiltering: true,
          autoCheckHierarchy: true,
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Task Name', width: 150, showCheckbox: true },
            { field: 'duration', headerText: 'Duration', type: "number", width: 150 },
            { field: 'progress', headerText: 'Progress', width: 150 },
            { field: 'startDate', headerText: 'Start Date', type: "date", format: 'yMd', width: 150 }
          ],
        },
        done
      );
    });
    it('select the checkBoxes', () => {
      gridObj.selectCheckboxes([5]);
      gridObj.selectCheckboxes([0]);
      expect(gridObj.getCheckedRecords().length).toBe(11);
      expect(gridObj.getCheckedRowIndexes().length).toBe(11);
      expect(gridObj.getCheckedRowIndexes()[0]).toBe(5);
      expect(gridObj.getCheckedRowIndexes()[1]).toBe(6);
      expect(gridObj.getCheckedRowIndexes()[2]).toBe(7);
      expect(gridObj.getCheckedRowIndexes()[3]).toBe(8);
      expect(gridObj.getRows()[1].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
      expect(gridObj.getRows()[2].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
      expect(gridObj.getRows()[3].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
      expect(gridObj.getRows()[4].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
      expect(gridObj.getRows()[0].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
      expect(gridObj.getHeaderTable().querySelectorAll('th')[1].querySelector('.e-frame').classList.contains('e-stop')
      ).toBeTruthy();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('select the header CheckBox', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          allowFiltering: true,
          autoCheckHierarchy: true,
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Task Name', width: 150, showCheckbox: true },
            { field: 'duration', headerText: 'Duration', type: "number", width: 150 },
            { field: 'progress', headerText: 'Progress', width: 150 },
            { field: 'startDate', headerText: 'Start Date', type: "date", format: 'yMd', width: 150 }
          ],
        },
        done
      );
    });
    it('select the header checkBox', () => {
      (<HTMLElement>gridObj.getHeaderTable().querySelectorAll('th')[1].querySelector('.e-treeselectall')).click();
      expect(gridObj.getCheckedRecords().length).toBe(36);
      expect(gridObj.getCheckedRowIndexes().length).toBe(12);
      expect(gridObj.getRows()[0].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
      expect(gridObj.getRows()[1].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
      expect(gridObj.getRows()[2].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
      expect(gridObj.getRows()[3].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
      expect(gridObj.getRows()[4].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
      expect(gridObj.getHeaderTable().querySelectorAll('th')[1].querySelector('.e-frame').classList.contains('e-check')
      ).toBeTruthy();
      gridObj.goToPage(2);
      expect(gridObj.getCheckedRowIndexes().length).toBe(12);
      (<HTMLElement>gridObj.getHeaderTable().querySelectorAll('th')[1].querySelector('.e-treeselectall')).click();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('select Checkboxes using selectCheckboxes method', () => {
    let gridObj: TreeGrid;
    let actionComplete:() => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          allowFiltering: true,
          autoCheckHierarchy: true,
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Task Name', width: 150, showCheckbox: true },
            { field: 'duration', headerText: 'Duration', type: "number", width: 150 },
            { field: 'progress', headerText: 'Progress', width: 150 },
            { field: 'startDate', headerText: 'Start Date', type: "date", format: 'yMd', width: 150 }
          ],
        },
        done
      );
    });
    it('select the checkBoxes', (done: Function) => {
      actionComplete = (args?: PageEventArgs): void => {
         if (args.requestType === 'paging') {
          expect(gridObj.getCheckedRowIndexes().length).toBe(0);
          expect(gridObj.getCheckedRecords().length).toBe(11);
         }
         done();
      };
      gridObj.actionComplete = actionComplete;
      gridObj.selectCheckboxes([0]);
      gridObj.selectCheckboxes([5]);
      expect(gridObj.getCheckedRecords().length).toBe(11);
      expect(gridObj.getCheckedRowIndexes().length).toBe(11);
      gridObj.goToPage(2);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('HierarchySelection with filtering', () => {
    let gridObj: TreeGrid;
    let actionComplete:() => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          allowFiltering: true,
          autoCheckHierarchy: true,
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Task Name', width: 150, showCheckbox: true },
            { field: 'duration', headerText: 'Duration', type: "number", width: 150 },
            { field: 'progress', headerText: 'Progress', width: 150 },
            { field: 'startDate', headerText: 'Start Date', type: "date", format: 'yMd', width: 150 }
          ],
        },
        done
      );
    });
    it('select the checkBoxes', (done: Function) => {
      actionComplete = (args?: FilterEventArgs): void => {
        if (args.requestType === 'filtering') {
          expect(gridObj.getCheckedRowIndexes().length).toBe(3);
          expect(gridObj.getCheckedRecords().length).toBe(3);
          expect(gridObj.getCurrentViewRecords().length).toBe(3);
          expect(gridObj.getHeaderTable().querySelectorAll('th')[1].querySelector('.e-frame').classList.contains('e-check')
      ).toBeTruthy();
        }
        done();
     };
      gridObj.actionComplete = actionComplete;
      gridObj.selectCheckboxes([5]);
      expect(gridObj.getCheckedRowIndexes().length).toBe(6);
      (<HTMLElement>gridObj.getRows()[6].querySelector('.e-treecheckselect')).click();
      expect(gridObj.getHeaderTable().querySelectorAll('th')[1].querySelector('.e-frame').classList.contains('e-stop')
      ).toBeTruthy();
      gridObj.filterByColumn('taskName','startswith','Design');
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('HierarchySelection with filtering - ChildMode', () => {
    let gridObj: TreeGrid;
    let actionComplete:() => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          allowFiltering: true,
          filterSettings: { hierarchyMode: 'Child' },
          autoCheckHierarchy: true,
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Task Name', width: 150, showCheckbox: true },
            { field: 'duration', headerText: 'Duration', type: "number", width: 150 },
            { field: 'progress', headerText: 'Progress', width: 150 },
            { field: 'startDate', headerText: 'Start Date', type: "date", format: 'yMd', width: 150 }
          ],
        },
        done
      );
    });
    it('select the checkBoxes', (done: Function) => {
      actionComplete = (args?: FilterEventArgs): void => {
        if (args.requestType === 'filtering') {
          expect(gridObj.getCheckedRowIndexes().length).toBe(0);
          expect(gridObj.getCheckedRecords().length).toBe(0);
          expect(gridObj.getCurrentViewRecords().length).toBe(3);
        }
        done();
     };
      gridObj.actionComplete = actionComplete;
      gridObj.selectCheckboxes([0]);
      expect(gridObj.getCheckedRowIndexes().length).toBe(5);
      expect(gridObj.getHeaderTable().querySelectorAll('th')[1].querySelector('.e-frame').classList.contains('e-stop')
      ).toBeTruthy();
      gridObj.filterByColumn('taskName','equal','Testing');
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('HierarchySelection with filtering - Both', () => {
    let gridObj: TreeGrid;
    let actionComplete:() => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          allowFiltering: true,
          filterSettings: { hierarchyMode: 'Both' },
          autoCheckHierarchy: true,
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Task Name', width: 150, showCheckbox: true },
            { field: 'duration', headerText: 'Duration', type: "number", width: 150 },
            { field: 'progress', headerText: 'Progress', width: 150 },
            { field: 'startDate', headerText: 'Start Date', type: "date", format: 'yMd', width: 150 }
          ],
        },
        done
      );
    });
    it('select the checkBoxes', (done: Function) => {
      actionComplete = (args?: FilterEventArgs): void => {
        if (args.requestType === 'filtering') {
          expect(gridObj.getCheckedRowIndexes().length).toBe(3);
          expect(gridObj.getCheckedRecords().length).toBe(3);
          expect(gridObj.getCurrentViewRecords().length).toBe(6);
        }
        done();
     };
      gridObj.actionComplete = actionComplete;
      gridObj.selectCheckboxes([8,9,10]);
      expect(gridObj.getCheckedRowIndexes().length).toBe(3);
      expect(gridObj.getHeaderTable().querySelectorAll('th')[1].querySelector('.e-frame').classList.contains('e-stop')
      ).toBeTruthy();
      gridObj.filterByColumn('taskName','equal','Design');
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('HierarchySelection with filtering - None', () => {
    let gridObj: TreeGrid;
    let actionComplete:() => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          allowFiltering: true,
          filterSettings: { hierarchyMode: 'None' },
          autoCheckHierarchy: true,
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Task Name', width: 150, showCheckbox: true },
            { field: 'duration', headerText: 'Duration', type: "number", width: 150 },
            { field: 'progress', headerText: 'Progress', width: 150 },
            { field: 'startDate', headerText: 'Start Date', type: "date", format: 'yMd', width: 150 }
          ],
        },
        done
      );
    });
    it('select the checkBoxes', (done: Function) => {
      actionComplete = (args?: FilterEventArgs): void => {
        if (args.requestType === 'filtering') {
          if (gridObj.filterModule.filteredResult.length > 0) {
            expect(gridObj.getCheckedRowIndexes().length).toBe(3);
            expect(gridObj.getCheckedRecords().length).toBe(3);
          }
        }
        done();
     };
      gridObj.actionComplete = actionComplete;
      gridObj.selectCheckboxes([9,10]);
      expect(gridObj.getCheckedRowIndexes().length).toBe(2);
      expect(gridObj.getHeaderTable().querySelectorAll('th')[1].querySelector('.e-frame').classList.contains('e-stop')
      ).toBeTruthy();
      gridObj.filterByColumn('taskName','startswith','Design');
      gridObj.clearFiltering();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('HierarchySelection with Editing - Row', () => {
    let gridObj: TreeGrid;
    let actionComplete:() => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          allowFiltering: true,
          editSettings: { allowEditing: true, allowAdding: true, mode: 'Row' },
          toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
          autoCheckHierarchy: true,
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Task Name', width: 150, showCheckbox: true },
            { field: 'duration', headerText: 'Duration', type: "number", width: 150 },
            { field: 'progress', headerText: 'Progress', width: 150 },
            { field: 'startDate', headerText: 'Start Date', type: "date", format: 'yMd', width: 150 }
          ],
        },
        done
      );
    });
    it('select the checkBoxes', () => {
      gridObj.selectCheckboxes([0]);
      gridObj.selectRow(1);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'Plan time';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      expect(gridObj.getRows()[1].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
      (<HTMLElement>gridObj.getRows()[1].querySelector('.e-treecheckselect')).click();
      expect(gridObj.getRows()[1].querySelector('.e-frame').classList.contains('e-uncheck')).toBeTruthy();
      expect(gridObj.getRows()[0].querySelector('.e-frame').classList.contains('e-stop')).toBeTruthy();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('HierarchySelection with Adding - Row', () => {
    let gridObj: TreeGrid;
    let actionComplete:() => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          allowFiltering: true,
          editSettings: { allowEditing: true, allowAdding: true, mode: 'Row', newRowPosition:'Child' },
          toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
          autoCheckHierarchy: true,
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Task Name', width: 150, showCheckbox: true },
            { field: 'duration', headerText: 'Duration', type: "number", width: 150 },
            { field: 'progress', headerText: 'Progress', width: 150 },
            { field: 'startDate', headerText: 'Start Date', type: "date", format: 'yMd', width: 150 }
          ],
        },
        done
      );
    });
    it('select the checkBoxes', (done: Function) => {
      actionComplete = (args?: EditEventArgs): void => {
        if (args.requestType === 'save') {
          expect(gridObj.getRows()[5].querySelector('.e-frame').classList.contains('e-stop')).toBeTruthy();
        }
        done();
      };
      gridObj.selectCheckboxes([5]);
      gridObj.selectRow(5);
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskID') as any).value = '122';
      (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'second';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('HierarchySelection with Deleting - Row', () => {
    let gridObj: TreeGrid;
    let actionComplete:() => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          allowFiltering: true,
          editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row', newRowPosition:'Child' },
          toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
          autoCheckHierarchy: true,
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Task Name', width: 150, showCheckbox: true },
            { field: 'duration', headerText: 'Duration', type: "number", width: 150 },
            { field: 'progress', headerText: 'Progress', width: 150 },
            { field: 'startDate', headerText: 'Start Date', type: "date", format: 'yMd', width: 150 }
          ],
        },
        done
      );
    });
    it('select the checkBoxes', (done:Function) => {
      actionComplete = (args?: EditEventArgs): void => {
        if (args.requestType === 'delete') {
          expect(gridObj.getRows()[0].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
        }
        done();
      };
      gridObj.selectCheckboxes([0]);
      gridObj.actionComplete = actionComplete;
      (<HTMLElement>gridObj.getRows()[1].querySelector('.e-treecheckselect')).click();
      expect(gridObj.getRows()[0].querySelector('.e-frame').classList.contains('e-stop')).toBeTruthy();
      gridObj.selectRow(1);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('HierarchySelection with Summary', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          allowFiltering: true,
          editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row', newRowPosition:'Child' },
          toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
          autoCheckHierarchy: true,
          aggregates: [{
            columns: [
                {
                    type: 'Sum',
                    field: 'duration',
                    columnName: 'taskName',
                    footerTemplate: 'Sum: ${Sum}'
                },
            ]
          }],
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Task Name', width: 150, showCheckbox: true },
            { field: 'duration', headerText: 'Duration', type: "number", width: 150 },
            { field: 'progress', headerText: 'Progress', width: 150 },
            { field: 'startDate', headerText: 'Start Date', type: "date", format: 'yMd', width: 150 }
          ],
        },
        done
      );
    });
    it('select the checkBoxes', () => {
      gridObj.selectCheckboxes([0]);
      expect(gridObj.getCheckedRecords().length).toBe(5);
      expect(gridObj.getCheckedRowIndexes().length).toBe(5);
      expect(gridObj.getCheckedRowIndexes()[0]).toBe(0);
      expect(gridObj.getCheckedRowIndexes()[1]).toBe(1);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('select Checkboxes using selectCheckboxes method', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          allowFiltering: true,
          autoCheckHierarchy: true,
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Task Name', width: 150 },
            { field: 'duration', headerText: 'Duration', type: "number", width: 150, showCheckbox: true },
            { field: 'progress', headerText: 'Progress', width: 150 },
            { field: 'startDate', headerText: 'Start Date', type: "date", format: 'yMd', width: 150 }
          ],
        },
        done
      );
    });
    it('select the checkBoxes', () => {
      gridObj.selectCheckboxes([0]);
      expect(gridObj.getCheckedRecords().length).toBe(5);
      expect(gridObj.getCheckedRowIndexes().length).toBe(5);
      gridObj.selectCheckboxes([0]);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('select Checkboxes using selectCheckboxes method', () => {
    let gridObj: TreeGrid;
    let actionComplete:() => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          allowFiltering: true,
          autoCheckHierarchy: true,
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Task Name', width: 150 },
            { field: 'duration', headerText: 'Duration', type: "number", width: 150, showCheckbox: true },
            { field: 'progress', headerText: 'Progress', width: 150 },
            { field: 'startDate', headerText: 'Start Date', type: "date", format: 'yMd', width: 150 }
          ],
        },
        done
      );
    });
    it('select the checkBoxes', (done: Function) => {
      actionComplete = (args?: PageEventArgs): void => {
            if (args.requestType === 'filtering') {
             gridObj.selectCheckboxes([0]);
             expect(gridObj.getCheckedRowIndexes().length).toBe(3);
             expect(gridObj.getCheckedRecords().length).toBe(3);
            }
            done();
      };
      gridObj.actionComplete = actionComplete;
      gridObj.filterByColumn('taskName', 'startswith', 'Design');
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('HierachySelection with Paging', () => {
    let gridObj: TreeGrid;
    let actionComplete:() => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          allowFiltering: true,
          autoCheckHierarchy: true,
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Task Name', width: 150 },
            { field: 'duration', headerText: 'Duration', type: "number", width: 150, showCheckbox: true },
            { field: 'progress', headerText: 'Progress', width: 150 },
            { field: 'startDate', headerText: 'Start Date', type: "date", format: 'yMd', width: 150 }
          ],
        },
        done
      );
    });
    it('select the checkBoxes', (done: Function) => {
        actionComplete = (args?: PageEventArgs): void => {
            if (args.requestType === 'paging') {
                gridObj.selectCheckboxes([0]);
                expect(gridObj.getCheckedRecords().length).toBe(8);
                expect(gridObj.getCheckedRowIndexes().length).toBe(8);
            }
            done();
      };
      gridObj.actionComplete = actionComplete;
      gridObj.goToPage(2);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Hierarchy Selection - Paging', () => {
    let gridObj: TreeGrid;
    let actionComplete:() => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          allowFiltering: true,
          autoCheckHierarchy: true,
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Task Name', width: 150 },
            { field: 'duration', headerText: 'Duration', type: "number", width: 150, showCheckbox: true },
            { field: 'progress', headerText: 'Progress', width: 150 },
            { field: 'startDate', headerText: 'Start Date', type: "date", format: 'yMd', width: 150 }
          ],
        },
        done
      );
    });
    it('select the checkBoxes', (done: Function) => {
        actionComplete = (args?: PageEventArgs): void => {
            if (args.requestType === 'paging') {
                gridObj.selectCheckboxes([2]);
                expect(gridObj.getCheckedRecords().length).toBe(1);
                expect(gridObj.getCheckedRowIndexes().length).toBe(1);
            }
            done();
      };
      gridObj.actionComplete = actionComplete;
      gridObj.goToPage(2);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Hierarchy Selection - Sorting', () => {
    let gridObj: TreeGrid;
    let actionComplete:() => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          allowFiltering: true,
          allowSorting: true,
          autoCheckHierarchy: true,
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Task Name', width: 150 },
            { field: 'duration', headerText: 'Duration', type: "number", width: 150, showCheckbox: true },
            { field: 'progress', headerText: 'Progress', width: 150 },
            { field: 'startDate', headerText: 'Start Date', type: "date", format: 'yMd', width: 150 }
          ],
        },
        done
      );
    });
    it('select the checkBoxes', (done: Function) => {
        actionComplete = (args?: PageEventArgs): void => {
            if (args.requestType === 'sorting') {
                expect(gridObj.getCheckedRowIndexes().length).toBe(0);
            }
            done();
      };
      gridObj.selectCheckboxes([0]);
      gridObj.sortByColumn('taskName', 'Ascending', true);
      gridObj.actionComplete = actionComplete;
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
});
