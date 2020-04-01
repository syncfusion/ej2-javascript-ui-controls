import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData, projectData2, unorederedData} from '../base/datasource.spec';
import { getObject } from '@syncfusion/ej2-grids';
import { EmitType } from '@syncfusion/ej2-base';
import { RowDD } from '../../src/treegrid/actions/rowdragdrop';
import { ITreeData } from '../../src';
/**
 * TreeGrid Row Drag And Drop spec 
 */
TreeGrid.Inject(RowDD);
describe('Treegrid Row Reorder', () => {
    let TreeGridObj: TreeGrid;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowRowDragAndDrop: true,
          columns: [
            { field: "taskID", headerText: "Task Id", width: 90 },
            { field: 'taskName', headerText: 'taskName', width: 60 },
            { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
            { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
          ],
        },done);
    });

    it('Row Reorder Testing for above tatget record', () => {
      let before: ITreeData = TreeGridObj.flatData[0];
      TreeGridObj.rowDragAndDropModule.reorderRows([3,4],0,'above');
      expect(TreeGridObj.flatData[0] !== before);
      expect((TreeGridObj.flatData[2] as ITreeData).childRecords.length).toBe(2);
      TreeGridObj.rowDragAndDropModule.destroy();
    });
    afterAll(() => {
      destroy(TreeGridObj);
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
          allowRowDragAndDrop: true,
          columns: [
            { field: "taskID", headerText: "Task Id", width: 90 },
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

  describe('Treegrid Row Reorder', () => {
    let TreeGridObj: TreeGrid;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowRowDragAndDrop: true,
          columns: [
            { field: "taskID", headerText: "Task Id", width: 90 },
            { field: 'taskName', headerText: 'taskName', width: 60 },
            { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
            { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
          ],
        },done);
    });

    it('Row Reorder Testing for below tatget record', () => {
      let before: ITreeData = TreeGridObj.flatData[5];
      expect((TreeGridObj.flatData[0] as ITreeData).childRecords.length).toBe(4);
      expect(before.childRecords.length).toBe(5);
      TreeGridObj.rowDragAndDropModule.reorderRows([3,4],5,'below');
      expect(before.childRecords.length).toBe(5);
      expect((TreeGridObj.flatData[0] as ITreeData).childRecords.length).toBe(2);
      TreeGridObj.rowDragAndDropModule.destroy();
    });
    afterAll(() => {
      destroy(TreeGridObj);
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
          allowRowDragAndDrop: true,
          columns: [
            { field: "taskID", headerText: "Task Id", width: 90 },
            { field: 'taskName', headerText: 'taskName', width: 60 },
            { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
            { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
          ],
        },done); 
      });

    it('Parent Row Reorder Testing for target to below  record', () => {
      TreeGridObj.rowDragAndDropModule.reorderRows([0],5,'below');
      expect((TreeGridObj.flatData[0] as ITreeData).childRecords.length).toBe(5);
      TreeGridObj.rowDragAndDropModule.destroy();
    });
    afterAll(() => {
      destroy(TreeGridObj);
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
          allowRowDragAndDrop: true,
          columns: [
            { field: "taskID", headerText: "Task Id", width: 90 },
            { field: 'taskName', headerText: 'taskName', width: 60 },
            { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
            { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
          ],
        },done); 
      });

    it('Parent Row Reorder Testing for target to child to target  record', () => {
      TreeGridObj.rowDragAndDropModule.reorderRows([5],0,'child');
      expect((TreeGridObj.flatData[0] as ITreeData).childRecords.length).toBe(5);
      TreeGridObj.rowDragAndDropModule.destroy();
    });
    afterAll(() => {
      destroy(TreeGridObj);
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
          allowRowDragAndDrop: true,
          columns: [
            { field: "taskID", headerText: "Task Id", width: 90 },
            { field: 'taskName', headerText: 'taskName', width: 60 },
            { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
            { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
          ],
        },done); 
      });

    it('Parent Row Reorder Testing for above to target  record', () => {
      TreeGridObj.rowDragAndDropModule.reorderRows([5],0,'above');
      expect((TreeGridObj.flatData[0] as ITreeData).childRecords.length).toBe(5);
      TreeGridObj.rowDragAndDropModule.destroy();
    });
    afterAll(() => {
      destroy(TreeGridObj);
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
          allowRowDragAndDrop: true,
          columns: [
            { field: "taskID", headerText: "Task Id", width: 90 },
            { field: 'taskName', headerText: 'taskName', width: 60 },
            { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
            { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
          ],
        },done); 
      });

    it('Parent Row selected with child records for target to add above to target record', () => {
      TreeGridObj.rowDragAndDropModule.reorderRows([5,6,7],0,'above');
      expect((TreeGridObj.flatData[0] as ITreeData).childRecords.length).toBe(3);
      expect((TreeGridObj.flatData[6] as ITreeData).childRecords.length).toBe(4);
      expect((TreeGridObj.flatData[4] as ITreeData).parentItem).toBe(undefined);
      expect((TreeGridObj.flatData[5] as ITreeData).parentItem).toBe(undefined);
      TreeGridObj.rowDragAndDropModule.destroy();
    });
    afterAll(() => {
      destroy(TreeGridObj);
    });
  });

  describe('Treegrid Row Reorder using Indent and Outdent Icon', () => {
    let TreeGridObj: TreeGrid;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowRowDragAndDrop: true,
          toolbar: ['Indent', 'Outdent'],
          columns: [
            { field: "taskID", headerText: "Task Id", width: 90 },
            { field: 'taskName', headerText: 'taskName', width: 60 },
            { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
            { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
          ],
        },done); 
      });

    it('Using Indent Icon and Outdent Icon', () => {
      TreeGridObj.selectRow(2);
      (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: TreeGridObj.grid.element.id + '_indent' } });
      expect((TreeGridObj.grid.dataSource[1] as ITreeData).childRecords.length).toBe(1);
      TreeGridObj.selectRow(2);
      (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: TreeGridObj.grid.element.id + '_outdent' } });
      expect((TreeGridObj.grid.dataSource[1] as ITreeData).childRecords.length).toBe(0);
      TreeGridObj.rowDragAndDropModule.destroy();
    });
    afterAll(() => {
      destroy(TreeGridObj);
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
          allowRowDragAndDrop: true,
          toolbar: ['Indent', 'Outdent'],
          columns: [
            { field: "taskID", headerText: "Task Id", width: 90 },
            { field: 'taskName', headerText: 'taskName', width: 60 },
            { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
            { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
          ],
        },done); 
      });

    it('Drop at Above', () => {
      expect((TreeGridObj.grid.dataSource[0] as ITreeData).childRecords.length).toBe(4);
      TreeGridObj.rowDragAndDropModule.reorderRows([7], 2, 'above');
      expect((TreeGridObj.grid.dataSource[0] as ITreeData).childRecords.length).toBe(5);
      TreeGridObj.rowDragAndDropModule.destroy();
    });
    afterAll(() => {
      destroy(TreeGridObj);
    });
  });

  describe('Treegrid Row Reorder using self reference data', () => {
    let TreeGridObj: TreeGrid;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: projectData2,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          treeColumnIndex: 1,
          allowRowDragAndDrop: true,
          toolbar: ['Indent', 'Outdent'],
          columns: [
            { field: "TaskID", headerText: "Task Id", width: 90 },
            { field: 'TaskName', headerText: 'TaskName', width: 60 },
            { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
          ],
        },done); 
      });

    it('Drop as Child', () => {
      expect((TreeGridObj.grid.dataSource[0] as ITreeData).childRecords.length).toBe(3);
      TreeGridObj.rowDragAndDropModule.reorderRows([4], 0, 'child');
      expect((TreeGridObj.grid.dataSource[0] as ITreeData).childRecords.length).toBe(4);
      expect(TreeGridObj.grid.dataSource[4].TaskID).toBe(5);
      expect(TreeGridObj.grid.dataSource[4].TaskName).toBe("Parent Task 2");
      TreeGridObj.rowDragAndDropModule.destroy();
    });
    afterAll(() => {
      destroy(TreeGridObj);
    });
  });

  describe('Treegrid Row Reorder using self reference data - Indent and Outdent Icon', () => {
    let TreeGridObj: TreeGrid;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: projectData2,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          treeColumnIndex: 1,
          allowRowDragAndDrop: true,
          toolbar: ['Indent', 'Outdent'],
          columns: [
            { field: "TaskID", headerText: "Task Id", width: 90 },
            { field: 'TaskName', headerText: 'TaskName', width: 60 },
            { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
          ],
        },done); 
      });

    it('Indent and Outdent', () => {
      TreeGridObj.selectRow(2);
      (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: TreeGridObj.grid.element.id + '_indent' } });
      expect((TreeGridObj.grid.dataSource[1] as ITreeData).childRecords.length).toBe(1);
      TreeGridObj.selectRow(2);
      (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: TreeGridObj.grid.element.id + '_outdent' } });
      expect((TreeGridObj.grid.dataSource[1] as ITreeData).childRecords.length).toBe(0);
      TreeGridObj.rowDragAndDropModule.destroy();
      TreeGridObj.toolbarModule.destroy();
    });
    afterAll(() => {
      destroy(TreeGridObj);
    });
  });

  describe('EJ2-31359-Issue in Row Drag and Drop of TreeGrid with self reference data', () => {
    let TreeGridObj: TreeGrid;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: projectData2,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          treeColumnIndex: 1,
          allowRowDragAndDrop: true,
          columns: [
            { field: "TaskID", headerText: "Task Id", width: 90 },
            { field: 'TaskName', headerText: 'TaskName', width: 60 },
            { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
          ],
        },done); 
      });

    it('Self Reference Data', () => {
      expect((TreeGridObj.grid.dataSource as ITreeData[]).length).toBe(15);
      TreeGridObj.rowDragAndDropModule.reorderRows([1], 6, 'above');
      expect((TreeGridObj.grid.dataSource as ITreeData[]).length).toBe(15);
      TreeGridObj.rowDragAndDropModule.destroy();
    });
    afterAll(() => {
      destroy(TreeGridObj);
    });
  });
  describe('Parent node disappearing on unordered list of data', () => {
    let TreeGridObj: TreeGrid;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: unorederedData,
          idMapping: 'id',
          parentIdMapping: 'parent_id',
          treeColumnIndex: 1,
          allowRowDragAndDrop: true,
          columns: [
            { field: 'id', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 100, visible: false },
            { field: 'question', headerText: 'Task Name', width: 250 },
            { field: 'is_sign_required', headerText: 'Start Date', textAlign: 'Right', width: 135, editType: 'booleanedit', displayAsCheckBox: true, type: 'boolean' },
            { field: 'is_notes_required', headerText: 'Duration', textAlign: 'Right', width: 120, editType: 'booleanedit', displayAsCheckBox: true, type: 'boolean'  },
          ],
          
        },done); 
      });

    it('Parent and child data', () => {
      expect((TreeGridObj.grid.dataSource[1] as ITreeData).childRecords.length).toBe(2);
      TreeGridObj.rowDragAndDropModule.reorderRows([4], 0, 'child');
      expect(TreeGridObj.grid.dataSource[6].id).toBe(20);
      TreeGridObj.rowDragAndDropModule.destroy();
      
    });
    afterAll(() => {
      destroy(TreeGridObj);
    });
});