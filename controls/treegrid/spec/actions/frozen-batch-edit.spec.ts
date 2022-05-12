import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData, projectData } from '../base/datasource.spec';
import { Edit } from '../../src/treegrid/actions/edit';
import { Freeze } from '../../src/treegrid/actions/freeze-column';
import { Page } from '../../src/treegrid/actions/page';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { Sort } from '../../src/treegrid/actions/sort';
import { Filter } from '../../src/treegrid/actions/filter';
import { isNullOrUndefined, select } from '@syncfusion/ej2-base';

/**
 * Grid Batch Edit spec 
 */
TreeGrid.Inject(Edit, Toolbar, Sort, Filter, Page, Freeze);
describe('Frozen Columns With Editing', () => {
  beforeAll(() => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
      console.log("Unsupported environment, window.performance.memory is unavailable");
      this.skip(); //Skips test (in Chai)
      return;
    }
  });

  describe('Hierarchy Frozen- Batch Add', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch" },
          allowSorting: true,
          allowFiltering: true,
          frozenColumns: 3,
          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
          ]
        },
        done
      );
    });
    it('Add - Batch Editing', (done: Function) => {
      actionComplete = (args?: Object): void => {
        if (args['requestType'] == "batchSave" ) {
          expect(gridObj.dataSource[3].taskID === 41).toBe(true);
        }
         done();
      }
      let addedRecords = 'addedRecords';
      gridObj.grid.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      expect(gridObj.getRowByIndex(0).classList.contains('e-insertedrow')).toBe(true);
      (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
      expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Hierarchy Frozen- Batch Add for next page', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowPaging: true,
          pageSettings: { pageSize: 2},
          frozenColumns: 3,
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch", newRowPosition:'Below' },
          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220, validationRules: { required: true } },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
          ],
        },
        done
      );
    });
    it('Add - Batch Editing for next page', (done: Function) => {
      actionComplete = (args?: Object): void => {
        if (args['requestType'] == "batchSave" ) {
          expect(gridObj.dataSource[0].taskID === 41).toBe(true);
        }
         done();
      }
      let addedRecords = 'addedRecords';
      gridObj.grid.actionComplete = actionComplete;
      gridObj.goToPage(2);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      expect(gridObj.getRowByIndex(0).classList.contains('e-insertedrow')).toBe(true);
      (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = "Planning Progress";
      expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Hierarchy Frozen- Batch Add NewRowPosition Below', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch", newRowPosition: "Below" },
          allowSorting: true,
          allowFiltering: true,
          treeColumnIndex: 1,
          frozenColumns: 3,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
          ]
        },
        done
      );
    });
    it('Add - Batch Editing', (done: Function) => {
      actionComplete = (args?: Object): void => {
        if (args['requestType'] == "batchSave" ) {
          expect(gridObj.dataSource[0].subtasks[1].taskID === 41).toBe(true);
        }
         done();
      }
      let addedRecords = 'addedRecords';
      gridObj.grid.actionComplete = actionComplete;
      gridObj.selectRow(1);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      expect(gridObj.getRowByIndex(2).classList.contains('e-insertedrow')).toBe(true);
      (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
      expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Hierarchy Frozen- Batch Add NewRowPosition Above', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch", newRowPosition: "Above" },
          allowSorting: true,
          allowFiltering: true,
          treeColumnIndex: 1,
          frozenColumns: 3,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
          ]
        },
        done
      );
    });
    it('Add - Batch Editing', (done: Function) => {
      actionComplete = (args?: Object): void => {
        if (args['requestType'] == "batchSave" ) {
          expect(gridObj.dataSource[0].taskID === 41).toBe(true);
        }
         done();
      }
      let addedRecords = 'addedRecords';
      gridObj.grid.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      expect(gridObj.getRowByIndex(0).classList.contains('e-insertedrow')).toBe(true);
      (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
      expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Hierarchy Frozen- Batch Add NewRowPosition Child', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch", newRowPosition: "Child" },
          allowSorting: true,
          allowFiltering: true,
          treeColumnIndex: 1,
          frozenColumns: 3,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
          ]
        },
        done
      );
    });
    it('Add - Batch Editing', (done: Function) => {
      actionComplete = (args?: Object): void => {
        if (args['requestType'] == "batchSave" ) {
          expect(gridObj.dataSource[0].subtasks[0].subtasks.length === 1).toBe(true);
          expect(gridObj.getRowByIndex(1).querySelectorAll('.e-treegridexpand').length === 1).toBe(true);
        }
         done();
      }
      let addedRecords = 'addedRecords';
      gridObj.grid.actionComplete = actionComplete;
      gridObj.selectRow(1);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      expect(gridObj.getRowByIndex(2).classList.contains('e-insertedrow')).toBe(true);
      (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
      expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Hierarchy Frozen- Random action checking', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowPaging: true,
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch", newRowPosition: "Child" },
          allowSorting: true,
          allowFiltering: true,
          frozenColumns: 3,
          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
          ]
        },
        done
      );
    });
    it('Add - Batch Editing', (done: Function) => {
      actionComplete = (args?: Object): void => {
        if (args['requestType'] == "batchSave" ) {
          expect(gridObj.dataSource[1].subtasks[3].taskID === 41).toBe(true);
        }
         done();
      }
      let addedRecords = 'addedRecords';
      gridObj.grid.actionComplete = actionComplete;
      gridObj.selectRow(5);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      expect(gridObj.getRowByIndex(6).classList.contains('e-insertedrow')).toBe(true);
      (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
      expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });


  describe('Hierarchy Frozen- Batch cancel checking', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowPaging: true,
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch", newRowPosition: "Child" },
          allowSorting: true,
          allowFiltering: true,
          frozenColumns: 3,
          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
          ]
        },
        done
      );
    });
    it('Add - Batch Editing', (done: Function) => {
      actionComplete = (args?: Object): void => {
        if (args['requestType'] == "batchSave" ) {
          expect(gridObj.dataSource[0].subtasks[0].taskID === 2).toBe(true);
        }
         done();
      }
      let addedRecords = 'addedRecords';
      gridObj.grid.actionComplete = actionComplete;
      gridObj.selectRow(6);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
      gridObj.selectRow(1);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });      
      expect(gridObj.getRowByIndex(2).classList.contains('e-insertedrow')).toBe(true);
      (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
      gridObj.selectRow(3);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });      
      expect(gridObj.getRowByIndex(4).classList.contains('e-insertedrow')).toBe(true);
      (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 42;
      expect(gridObj.getBatchChanges()[addedRecords].length === 2).toBe(true);
      gridObj.selectRow(5);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
      select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Hierarchy Frozen - Random Batch update checking', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowPaging: true,
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch", newRowPosition: "Below" },
          allowSorting: true,
          allowFiltering: true,
          frozenColumns: 3,
          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
          ]
        },
        done
      );
    });
    it('Add - Batch Editing', (done: Function) => {
      actionComplete = (args?: Object): void => {
        if (args['requestType'] == "batchSave" ) {
          expect(gridObj.dataSource[1].subtasks.length === 5).toBe(true);
        }
         done();
      }
      let addedRecords = 'addedRecords';
      gridObj.grid.actionComplete = actionComplete;
      gridObj.selectRow(5);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });      
      (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });      
      (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 42;
      expect(gridObj.getBatchChanges()[addedRecords].length === 2).toBe(true);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

//   describe('Hierarchy Frozen - Child update count checking', () => {
//     let gridObj: TreeGrid;
//     let actionComplete: () => void;
//     beforeAll((done: Function) => {
//       gridObj = createGrid(
//         {
//           dataSource: sampleData,
//           childMapping: 'subtasks',
//           allowPaging: true,
//           editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch", newRowPosition: "Below" },
//           allowSorting: true,
//           allowFiltering: true,
//           treeColumnIndex: 1,
//           frozenColumns: 3,
//           toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
//           columns: [
//             {
//                 field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
//                 validationRules: { required: true, number: true}, width: 90
//             },
//             { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
//             { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
//               format: 'yMd' },
//             { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
//               type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
//             { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },
//             { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
//             { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
//             { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
//           ]
//         },
//         done
//       );
//     });
//     it('Add - Batch Editing', (done: Function) => {
//       actionComplete = (args?: Object): void => {
//         if (args['requestType'] == "batchSave" ) {
//           expect(gridObj.dataSource[1].taskID === 42).toBe(true);
//         }
//          done();
//       }
//       let addedRecords = 'addedRecords';
//       gridObj.grid.actionComplete = actionComplete;
//       gridObj.selectRow(1);
//       (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });      
//       (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
//       gridObj.selectRow(0);
//       (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });      
//       (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 42;
//       expect(gridObj.getBatchChanges()[addedRecords].length === 2).toBe(true);
//       (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
//       select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
//     });
//     afterAll(() => {
//       destroy(gridObj);
//     });
//   });

  describe('Hierarchy Frozen - gotopage delete and add', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowPaging: true,
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch", newRowPosition: "Below" },
          allowSorting: true,
          allowFiltering: true,
          frozenColumns: 3,
          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
          ]
        },
        done
      );
    });
    it('Add - Batch Editing', (done: Function) => {
      actionComplete = (args?: Object): void => {
        if (args['requestType'] == "batchSave" ) {
          expect(gridObj.dataSource[2].subtasks[1].subtasks[0].subtasks[6] === 42).toBe(true);
        }
         done();
      }
      let addedRecords = 'addedRecords';
      gridObj.grid.actionComplete = actionComplete;
      gridObj.grid.goToPage(3);
      gridObj.selectRow(4);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });      
      gridObj.selectRow(3);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });      
      (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 42;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Hierarchy Frozen editing - Batch Mode', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
            dataSource: sampleData,
            childMapping: 'subtasks',
            editSettings: { allowEditing: true, mode: 'Batch', allowDeleting: true, allowAdding: true },
            frozenColumns: 3,
            treeColumnIndex: 1,
            toolbar: ['Add', 'Edit', 'Update'],
              columns: [
                {
                    field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                    validationRules: { required: true, number: true}, width: 90
                },
                { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
                { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
                  format: 'yMd' },
                { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
                  type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
                { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },
                { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
                { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
                { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
              ]
        },
        done
      );
    });
    it('record double click', () => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
    });
    it('batch changeds and save record', () => {
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      expect(gridObj.getBatchChanges()['changedRecords'].length === 1).toBe(true);
      select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    it('Batch Add Datasource check - Batch Editing', () => {
      expect(gridObj.dataSource[0].subtasks[1].taskName === 'test').toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
      });
    });

    describe('Hierarchy Frozen editing - Batch Edit with expand/collapse request', () => {
      let gridObj: TreeGrid;
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
              dataSource: sampleData,
              childMapping: 'subtasks',
              editSettings: { allowEditing: true, mode: 'Batch', allowDeleting: true, allowAdding: true },
  
              treeColumnIndex: 1,
              toolbar: ['Add', 'Edit', 'Update'],
                columns: [
                    {
                        field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                        validationRules: { required: true, number: true}, width: 90
                    },
                    { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
                      format: 'yMd' },
                    { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
                      type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
                    { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
                    { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
                ]
          },
          done
        );
      });
      it('record double click', () => {
        let event: MouseEvent = new MouseEvent('dblclick', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
        gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
      });
      it('batch edit', () => {
        let click: MouseEvent = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
        gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
        gridObj.getRowByIndex(1).dispatchEvent(click);
      });
      it('collapse record', () => {
        let method: string = 'expandCollapseRequest';
        gridObj[method](gridObj.getRowByIndex(0).querySelector('.e-treegridexpand'));
        expect(gridObj.getBatchChanges()['changedRecords'].length === 1).toBe(true);
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
      });
      afterAll(() => {
          destroy(gridObj);
        });
      });

    describe('Filtering Frozen Columns with Edit', () => {
      let gridObj: TreeGrid;
      let actionComplete: () => void;
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: sampleData,
            childMapping: 'subtasks',
            allowFiltering:true,
            frozenColumns: 3,
            treeColumnIndex: 1,
              editSettings: {
                  allowAdding: true,
                  allowEditing: true,
                  allowDeleting: true,
                  mode: 'Batch',
                  newRowPosition: 'Bottom' 
              },
              toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
              columns: [
                {
                    field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                    validationRules: { required: true, number: true}, width: 90
                },
                { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
                { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
                  format: 'yMd' },
                { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
                  type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
                { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },
                { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
                { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
                { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
              ]
          },
          done
        );
      });
      it('Filtering with batch update', (done: Function) => {
        actionComplete = (args?: Object): void => {
          if (args['requestType'] == "batchSave" ) {
            expect(gridObj.dataSource[0].taskName === 'test').toBe(true);
          }
           done();
        }
        gridObj.filterByColumn('priority', 'equal', 'Normal', 'and', true);
        gridObj.grid.actionComplete = actionComplete;
        let event: MouseEvent = new MouseEvent('dblclick', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
        gridObj.getCellFromIndex(0, 2).dispatchEvent(event);
        gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        expect(gridObj.getBatchChanges()['changedRecords'].length === 1).toBe(true);
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
      });
      afterAll(() => {
        destroy(gridObj);
      });
    });

    
    describe('Sorting Frozen Columns with Edit', () => {
      let gridObj: TreeGrid;
      let actionComplete: () => void;
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: sampleData,
            childMapping: 'subtasks',
            allowSorting: true,
            treeColumnIndex: 1,
            frozenColumns: 3,
              editSettings: {
                  allowAdding: true,
                  allowEditing: true,
                  allowDeleting: true,
                  mode: 'Batch'
              },
              toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
              columns: [
                {
                    field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                    validationRules: { required: true, number: true}, width: 90
                },
                { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
                { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
                  format: 'yMd' },
                { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
                  type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
                { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },
                { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
                { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
                { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
              ]
          },
          done
        );
      });
      it('Sorting with batch update', (done: Function) => {
        actionComplete = (args?: Object): void => {
          if (args['requestType'] == "batchSave" ) {
            expect(gridObj.dataSource[2].taskName === 'test').toBe(true);
          }
           done();
        }
        gridObj.sortByColumn('taskID', 'Descending', false);
        gridObj.grid.actionComplete = actionComplete;
        let event: MouseEvent = new MouseEvent('dblclick', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
        gridObj.getCellFromIndex(0, 2).dispatchEvent(event);
        gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        expect(gridObj.getBatchChanges()['changedRecords'].length === 1).toBe(true);
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
      });
      afterAll(() => {
        destroy(gridObj);
      });
    });



    describe('FlatData Frozen - Batch Add', () => {
      let gridObj: TreeGrid;
      let actionComplete: () => void;
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: projectData,
            idMapping: 'TaskID',
            parentIdMapping: 'parentID',
            treeColumnIndex: 1,
            frozenColumns: 3,
            editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch" },
            toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
            columns: [
              { field: "TaskID", headerText: "Task ID", width: 90, isPrimaryKey: true },
              { field: 'TaskName', headerText: 'Task Name', width: 60 },
              { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
              { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
                  format: 'yMd' },
                { field: 'EndDate', headerText: 'End Date', width: 230, textAlign: 'Right',
                  type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            ]
          },
          done
        );
      });
      it('Add - Batch Editing', (done: Function) => {
        actionComplete = (args?: Object): void => {
          if (args['requestType'] == "batchSave" ) {
            expect(gridObj.dataSource[4].taskID === 41).toBe(true);
          }
           done();
        }
        let addedRecords = 'addedRecords';
        gridObj.grid.actionComplete = actionComplete;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        expect(gridObj.getRowByIndex(0).classList.contains('e-insertedrow')).toBe(true);
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
      });
      afterAll(() => {
        destroy(gridObj);
      });
    });


    describe('FlatData Frozen - Batch Add NewRowPosition Below', () => {
      let gridObj: TreeGrid;
      let actionComplete: () => void;
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: projectData,
            idMapping: 'TaskID',
            parentIdMapping: 'parentID',
            treeColumnIndex: 1,
            frozenColumns: 3,
            editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch", newRowPosition: "Below" },
            toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
            columns: [
              { field: "TaskID", headerText: "Task ID", width: 90, isPrimaryKey: true },
              { field: 'TaskName', headerText: 'Task Name', width: 60 },
              { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
              { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
                  format: 'yMd' },
                { field: 'EndDate', headerText: 'End Date', width: 230, textAlign: 'Right',
                  type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            ]
          },
          done
        );
      });
      it('Add - Batch Editing', (done: Function) => {
        actionComplete = (args?: Object): void => {
          if (args['requestType'] == "batchSave" ) {
            expect(gridObj.dataSource[2].taskID === 41).toBe(true);
          }
           done();
        }
        let addedRecords = 'addedRecords';
        gridObj.grid.actionComplete = actionComplete;
        gridObj.selectRow(1);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        expect(gridObj.getRowByIndex(2).classList.contains('e-insertedrow')).toBe(true);
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
      });
      afterAll(() => {
        destroy(gridObj);
      });
    });
    

    describe('FlatData Frozen - Batch Add NewRowPosition Above', () => {
      let gridObj: TreeGrid;
      let actionComplete: () => void;
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: projectData,
            idMapping: 'TaskID',
            parentIdMapping: 'parentID',
            treeColumnIndex: 1,
            frozenColumns: 3,
            editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch", newRowPosition: "Above" },
            toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
            columns: [
              { field: "TaskID", headerText: "Task ID", width: 90, isPrimaryKey: true },
              { field: 'TaskName', headerText: 'Task Name', width: 60 },
              { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
              { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
                  format: 'yMd'},
                { field: 'EndDate', headerText: 'End Date', width: 230, textAlign: 'Right',
                  type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            ]
          },
          done
        );
      });
      it('Add - Batch Editing', (done: Function) => {
        actionComplete = (args?: Object): void => {
          if (args['requestType'] == "batchSave" ) {
            expect(gridObj.dataSource[1].taskID === 41).toBe(true);
          }
           done();
        }
        let addedRecords = 'addedRecords';
        gridObj.grid.actionComplete = actionComplete;
        gridObj.selectRow(1);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        expect(gridObj.getRowByIndex(1).classList.contains('e-insertedrow')).toBe(true);
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
      });
      afterAll(() => {
        destroy(gridObj);
      });
    });
    

    
    describe('FlatData Frozen - Batch Add NewRowPosition Child', () => {
      let gridObj: TreeGrid;
      let actionComplete: () => void;
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: projectData,
            idMapping: 'TaskID',
            parentIdMapping: 'parentID',
            frozenColumns: 3,
            treeColumnIndex: 1,
            editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch", newRowPosition: "Child" },
            toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
            columns: [
              { field: "TaskID", headerText: "Task ID", width: 90, isPrimaryKey: true },
              { field: 'TaskName', headerText: 'Task Name', width: 60 },
              { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
              { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
                  format: 'yMd'},
                { field: 'EndDate', headerText: 'End Date', width: 230, textAlign: 'Right',
                  type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            ]
          },
          done
        );
      });
      it('Add - Batch Editing', (done: Function) => {
        actionComplete = (args?: Object): void => {
          if (args['requestType'] == "batchSave" ) {
            expect(gridObj.getRowByIndex(1).querySelectorAll('.e-treegridexpand').length === 1).toBe(true);
            expect(gridObj.dataSource[2].taskID === 41).toBe(true);
          }
           done();
        }
        let addedRecords = 'addedRecords';
        gridObj.grid.actionComplete = actionComplete;
        gridObj.selectRow(1);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        expect(gridObj.getRowByIndex(2).classList.contains('e-insertedrow')).toBe(true);
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
      });
      afterAll(() => {
        destroy(gridObj);
      });
    });
    
    
  describe('Flat data - Batch Edit ', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: projectData,
          idMapping: 'TaskID',
          frozenColumns: 3,
          parentIdMapping: 'parentID',
          treeColumnIndex: 1,
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch" },
          toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
          columns: [
            { field: "TaskID", headerText: "Task ID", width: 90, isPrimaryKey: true },
            { field: 'TaskName', headerText: 'Task Name', width: 60 },
            { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
            { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
                  format: 'yMd'},
            { field: 'EndDate', headerText: 'End Date', width: 230, textAlign: 'Right',
                  type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
          ]
        },
        done
      );
    });
    it('record double click', () => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
    });
    it('batch changes and save record', () => {
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      expect(gridObj.getBatchChanges()["changedRecords"].length === 1).toBe(true);
      select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    it('Batch Add Datasource check - Batch Editing', () => {
      expect(gridObj.dataSource[2].TaskName === 'test').toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
      });
  });

  describe('Filtering', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: projectData,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          treeColumnIndex: 1,
          frozenColumns: 3,
          allowFiltering: true,
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch" },
          toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
          columns: [
            { field: "TaskID", headerText: "Task ID", width: 90, isPrimaryKey: true },
            { field: 'TaskName', headerText: 'Task Name', width: 60 },
            { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
            { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
                format: 'yMd'},
            { field: 'EndDate', headerText: 'End Date', width: 230, textAlign: 'Right',
                type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
          ]
        },
        done
      );
    });
    it('Filtering with batch update', (done: Function) => {
      actionComplete = (args?: Object): void => {
        if (args['requestType'] == "batchSave" ) {
          expect(gridObj.dataSource[0].TaskName === 'test').toBe(true);
        }
         done();
      }
      gridObj.filterByColumn('TaskName', 'equal', 'Parent Task 1', 'and', true);
      gridObj.grid.actionComplete = actionComplete;
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(0, 2).dispatchEvent(event);
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      expect(gridObj.getBatchChanges()['changedRecords'].length === 1).toBe(true);
      select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });


  describe('Sorting', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: projectData,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          treeColumnIndex: 1,
          frozenColumns: 3,
          allowSorting: true,
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch" },
          toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
          columns: [
            { field: "TaskID", headerText: "Task ID", width: 90, isPrimaryKey: true },
            { field: 'TaskName', headerText: 'Task Name', width: 60 },
            { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
            { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
                format: 'yMd'},
            { field: 'EndDate', headerText: 'End Date', width: 230, textAlign: 'Right',
                type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
          ]
        },
        done
      );
    });
    it('Sorting with batch update', (done: Function) => {
      actionComplete = (args?: Object): void => {
        if (args['requestType'] == "batchSave" ) {
          expect(gridObj.dataSource[3].TaskName === 'test').toBe(true);
        }
         done();
      }
      gridObj.sortByColumn('TaskID', 'Descending', false);
      gridObj.grid.actionComplete = actionComplete;
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(0, 1).dispatchEvent(event);
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      expect(gridObj.getBatchChanges()['changedRecords'].length === 1).toBe(true);
      select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe(' Batch  Delete cancel checking', () => {
    let gridObj: TreeGrid;
    
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowPaging: true,
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch", newRowPosition: "Child" },
          allowSorting: true,
          allowFiltering: true,
          treeColumnIndex: 1,
          frozenColumns: 3,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd'},
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
          ]
        },
        done
      );
    });
    it('Batch Delete cancel action ', () => {
      let childRecords: string = 'childRecords';
      gridObj.selectRow(6);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
      select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
      expect(gridObj.getCurrentViewRecords()[0][childRecords].length === 4).toBe(true);
     });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('While delete all records then add record showing script error', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch" },
          allowSorting: true,
          allowFiltering: true,
          frozenColumns: 3,
          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220, },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
          ]
        },
        done
      );
    });
    it('Delete all records then add new record', (done: Function) => {
      actionComplete = (args?: Object): void => {
        if (args['requestType'] == "batchSave"  ) {
          expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
        }
         done();
      }
       gridObj.selectRow(0);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });      
      gridObj.selectRow(6);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });      
      gridObj.selectRow(12);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });      
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
      let addedRecords = 'addedRecords';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 40;
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(0, 1).dispatchEvent(event);
      gridObj.grid.actionComplete = actionComplete;
     (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
      
   it('Add - Batch Editing', () => {
      let addedRecords = 'addedRecords';
      gridObj.grid.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
      expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true); 
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
