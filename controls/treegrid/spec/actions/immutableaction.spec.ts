import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData, projectData } from '../base/datasource.spec';
import { Edit } from '../../src/treegrid/actions/edit';
import { Page } from '../../src/treegrid/actions/page';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { Sort } from '../../src/treegrid/actions/sort';
import { Filter } from '../../src/treegrid/actions/filter';
import { ITreeData } from '../../src';

/**
 * Tree Grid Immutable spec 
 */
TreeGrid.Inject(Edit, Toolbar, Sort, Filter, Page);
describe('Immutable action', () => {
  beforeAll(() => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
      console.log("Unsupported environment, window.performance.memory is unavailable");
      this.skip(); //Skips test (in Chai)
      return;
    }
  });

  describe('Immutable mode with expand/collapse', () => {
    let gridObj: TreeGrid;
    let rows: HTMLTableRowElement;
    let collapsed: () => void;
    let expanded: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowPaging: true,
          enableImmutableMode: true,
          treeColumnIndex: 1,
          columns: [{ field: 'taskID',isPrimaryKey: true, headerText: 'Task ID' },
          { field: 'taskName', headerText: 'Task Name' },
          { field: 'progress', headerText: 'Progress' },
          { field: 'startDate', headerText: 'Start Date' }
          ]
        },
        done
      );
    });
    it('collapse - Immutable changes', (done: Function) => {
      collapsed = (args?: Object): void => {
        expect(args['row'].style.backgroundColor == "red").toBe(true);
        done()
      }
      gridObj.collapsed = collapsed;
      rows = gridObj.getRows()[0];
      rows.style.backgroundColor = "red";
      gridObj.collapseRow(rows);
    });
    it('expand - Immutable changes', (done: Function) => {
      expanded = (args?: Object): void => {
        expect(args['row'].style.backgroundColor == "red").toBe(true);
        done()
      }
      gridObj.expanded = expanded;
      rows = gridObj.getRows()[0];
      rows.style.backgroundColor = "red";
      gridObj.expandRow(rows);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Hierarchy - CRUD with Immutable in Edit Mode Cell', () => {
    let gridObj: TreeGrid;
    let rows: HTMLTableRowElement;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          enableImmutableMode: true,
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Cell", newRowPosition: "Below" },
          allowSorting: true,
          allowFiltering: true,
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
    it('Add - Immutable changes', (done: Function) => {
      actionComplete = (args?: Object): void => {
        if (args['requestType'] == "save" ) {
        expect(gridObj.dataSource[0].subtasks.length === 5).toBe(true);
        expect(gridObj.getRows()[0].style.backgroundColor == "red").toBe(true);
        }
        done()
      }
      gridObj.grid.actionComplete = actionComplete;
      rows = gridObj.getRows()[0];
      rows.style.backgroundColor = "red";
      gridObj.selectRow(1);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = "1111";
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('delete - Immutable changes', (done: Function) => {
      actionComplete = (args?: Object): void => {
        if (args['requestType'] == "delete" ) {
        expect(gridObj.dataSource[0].subtasks.length === 4).toBe(true);
        expect(gridObj.getRows()[0].style.backgroundColor == "red").toBe(true);
        }
        done()
      }
      gridObj.grid.actionComplete = actionComplete;
      rows = gridObj.getRows()[0];
      rows.style.backgroundColor = "red";
      gridObj.selectRow(1);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
    });
    it('Edit - Immutable changes',(done: Function) => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      actionComplete = (args?: any): void => {
        if(args.type=='save'){
        expect((gridObj.getRows()[0].getElementsByClassName('e-treecell')[0] as HTMLElement).innerText=="Planned").toBe(true);
        expect(gridObj.getRows()[1].style.backgroundColor == "red").toBe(true);
        done();
        }
     }
     gridObj.actionComplete = actionComplete;
     rows = gridObj.getRows()[1];
      rows.style.backgroundColor = "red";
      gridObj.getCellFromIndex(0, 1).dispatchEvent(event);
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'Planned';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });


  describe('Immutable with Drag And Drop Child Action', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          enableImmutableMode: true,
          allowRowDragAndDrop: true,
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Cell", newRowPosition: "Child" },
          allowSorting: true,
          allowFiltering: true,
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
    it('Expand/Collapse icon testing', (done: Function) => {
      actionComplete = (args?: Object): void => {
        if (args['requestType'] == "save" ) {
        expect(gridObj.getRows()[1].querySelectorAll(".e-treegridexpand").length === 1).toBe(true);
        }
        done()
      }
      gridObj.grid.actionComplete = actionComplete;
      gridObj.selectRow(1);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = "1111";
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Immutable - Batch Add', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch", newRowPosition: "Below" },
          allowSorting: true,
          allowFiltering: true,
          enableImmutableMode: true,
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
    it('BatchChanges - Batch Editing', () => {
      let addedRecords = 'addedRecords';
      gridObj.selectRow(1);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
      gridObj.selectRow(3);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 42;
      expect(gridObj.getBatchChanges()[addedRecords].length === 2).toBe(true);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      gridObj.element.querySelector('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm').querySelectorAll('button')[0].click();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Immutable Changes on Re-ordering', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch", newRowPosition: "Below" },
          allowRowDragAndDrop: true,
          enableImmutableMode: true,
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
    it('Re-ordering action', (done: Function) => {
      actionComplete = (args?: Object): void => {
        if (args['requestType'] == "refresh" ) {
        expect(gridObj.dataSource[1].taskID === 1).toBe(true);
        }
        done()
      }
      gridObj.grid.actionComplete = actionComplete;
      gridObj.getRows()[0].style.backgroundColor = "red";
      gridObj.reorderRows([0], 5, "below"); 
    });
    it('Ensure Changes after Re-ordering', () => {
      expect(gridObj.getRows()[6].style.backgroundColor == "red").toBe(true);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('FlatData - Batch Add', () => {
    let gridObj: TreeGrid;
    let rows: HTMLTableRowElement;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: projectData,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          treeColumnIndex: 1,
          enableImmutableMode: true,
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Cell", newRowPosition: "Below" },
          toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
          columns: [
            { field: "TaskID", headerText: "Task ID", width: 90, isPrimaryKey: true },
            { field: 'TaskName', headerText: 'Task Name', width: 60 },
            { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
          ]
        },
        done
      );
    });
    it('Add - Immutable changes', (done: Function) => {
      actionComplete = (args?: Object): void => {
        if (args['requestType'] == "save" ) {
        expect(gridObj.dataSource[2].parentID === 1).toBe(true);
        expect(gridObj.getRows()[0].style.backgroundColor == "red").toBe(true);
        }
        done()
      }
      gridObj.grid.actionComplete = actionComplete;
      rows = gridObj.getRows()[0];
      rows.style.backgroundColor = "red";
      gridObj.selectRow(1);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = "1111";
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    it('delete - Immutable changes', (done: Function) => {
      actionComplete = (args?: Object): void => {
        if (args['requestType'] == "delete" ) {
        expect(gridObj.getRows()[0].style.backgroundColor == "red").toBe(true);
        }
        done()
      }
      gridObj.grid.actionComplete = actionComplete;
      rows = gridObj.getRows()[0];
      rows.style.backgroundColor = "red";
      gridObj.selectRow(1);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
    });
    it('Edit - Immutable changes',(done: Function) => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      actionComplete = (args?: any): void => {
        if(args.type=='save'){
        expect((gridObj.getRows()[0].getElementsByClassName('e-treecell')[0] as HTMLElement).innerText=="Planned").toBe(true);
        expect(gridObj.getRows()[1].style.backgroundColor == "red").toBe(true);
        done();
        }
     }
     gridObj.actionComplete = actionComplete;
     rows = gridObj.getRows()[1];
      rows.style.backgroundColor = "red";
      gridObj.getCellFromIndex(0, 1).dispatchEvent(event);
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'Planned';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Treegrid Row Reorder', () => {
    let TreeGridObj: TreeGrid;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          enableImmutableMode: true,
          allowRowDragAndDrop: true,
          columns: [
            { field: "taskID", headerText: "Task Id", isPrimaryKey: true, width: 90 },
            { field: 'taskName', headerText: 'taskName', width: 60 },
            { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
            { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
          ],
        },done);
    });

    it('Row Reorder Testing for child to tatget record', () => {
      let before: ITreeData = TreeGridObj.flatData[2];
      expect(before.childRecords).toBe(undefined);
      TreeGridObj.rowDragAndDropModule.reorderRows([3,4],2,'child');
      expect(before.childRecords.length).toBe(2);
      TreeGridObj.rowDragAndDropModule.destroy();
    });
    afterAll(() => {
      destroy(TreeGridObj);
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