import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData, projectData2, unorederedData, projectData } from '../base/datasource.spec';
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

    it('Reordered rows index must be changed', () => {
      let before: ITreeData = TreeGridObj.flatData[5];
      TreeGridObj.rowDragAndDropModule.reorderRows([3,4],0,'above');
      expect((TreeGridObj.flatData[0] as ITreeData)['taskID']).toBe(4);
      expect((TreeGridObj.flatData[0] as ITreeData).index).toBe(0);
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
            { field: "taskID", isPrimaryKey: true, headerText: "Task Id", width: 90 },
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
            { field: "taskID", headerText: "Task Id", isPrimaryKey: true, width: 90 },
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
            { field: "TaskID", isPrimaryKey: true, headerText: "Task Id", width: 90 },
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

  describe('EJ2-48275-Issue in Row Drag and Drop of TreeGrid', () => {
    let TreeGridObj: TreeGrid;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: sampleData,
            allowRowDragAndDrop: true,
            childMapping: 'subtasks',
            height: '400',
            allowSelection: true,
            selectionSettings: { type: 'Multiple' },
            treeColumnIndex: 1,
            columns: [
                { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 100 },
                { field: 'taskName', headerText: 'Task Name', width: 250 },
                { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 135, format: { skeleton: 'yMd', type: 'date' }},
                { field: 'endDate', headerText: 'End Date', textAlign: 'Right', width: 135, format: { skeleton: 'yMd', type: 'date' }},
                { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 120 },
                { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 120 },
                { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 135 },
            ],
        },done); 
      });
    
    it('---colapse testing---', (done: Function) => {
      ((TreeGridObj.getRows()[0] as HTMLTableRowElement).getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
      TreeGridObj.rowDragAndDropModule.reorderRows([0], 6, 'below');
      expect(TreeGridObj.grid.dataSource[0].taskID).toBe(6);
      done();
    });
   
    it('---expand testing---', (done: Function) => {
      ((TreeGridObj.getRows()[2] as HTMLTableRowElement).getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
      expect((TreeGridObj.getRows()[3] as HTMLTableRowElement).style.display).toBe('table-row');
      done();
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

describe('Drag and Drop with TextWrap', () => {
  let TreeGridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreeGridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        allowRowDragAndDrop: true,
        allowTextWrap: true,
        columns: [
            { field: 'taskID', headerText: 'Task ID', width: 90, textAlign: 'Right' },
            { field: 'taskName', headerText: 'TaskName', width: 50 },
            { field: 'startDate', headerText: 'Start Date', format: 'yMd', textAlign: 'Right', width: 90},
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
            { field: 'priority', headerText: 'Priority', width: 90 },
    ]
        
      },done); 
    });

  it('Drag action with text wrap', () => {
    TreeGridObj.reorderRows([2], 1, 'child');
    expect((TreeGridObj.grid.dataSource[1] as ITreeData).childRecords.length).toBe(1);
  });
  afterAll(() => {
    destroy(TreeGridObj);
  });
});

describe('Treegrid Row Drop as Child', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        allowRowDragAndDrop: true,
        childMapping: 'subtasks',
        height: '400',
        allowSelection: true,
        selectionSettings: { type: 'Multiple' },
        treeColumnIndex: 1,
        columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 100 },
            { field: 'taskName', headerText: 'Task Name', width: 250 },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 135, format: { skeleton: 'yMd', type: 'date' }},
            { field: 'endDate', headerText: 'End Date', textAlign: 'Right', width: 135, format: { skeleton: 'yMd', type: 'date' }},
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 120 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 120 },
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 135 },
        ]
      },
      done
    );
  });
  it('Expand Icon Checking', (done: Function) => {    
    actionComplete = (args?: any): void => {
      expect((gridObj.getRows()[2] as HTMLTableRowElement).getElementsByClassName('e-treegridexpand').length).toBe(1);    
      done();
    };
    gridObj.actionComplete = actionComplete;
    gridObj.rowDragAndDropModule.reorderRows([2],3,'child');
  });

  it('Expand Testing', () => {    
    ((gridObj.getRows()[2] as HTMLTableRowElement).getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
    expect((gridObj.getRows()[3] as HTMLTableRowElement).style.display).toBe('none');          
  });

  it('Collapse Testing', () => {    
    ((gridObj.getRows()[2] as HTMLTableRowElement).getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
    expect((gridObj.getRows()[3] as HTMLTableRowElement).style.display).toBe('table-row');          
  });
  

    describe('Treegrid Indent action with immutable Mode', () => {
    let TreeGridObj: TreeGrid;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: "subtasks",
          treeColumnIndex: 1,
          enableImmutableMode: true,
          allowRowDragAndDrop: true,
          toolbar: ['Indent', 'Outdent'],
          columns: [
            { field: "TaskID", headerText: "Task Id", isPrimaryKey: true, width: 90 },
            { field: 'TaskName', headerText: 'TaskName', width: 60 },
            { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
          ],
        },done); 
      });

    it('Indent and Outdent', () => {
      TreeGridObj.selectRow(1);
      TreeGridObj.selectRow(2);
      (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: TreeGridObj.grid.element.id + '_indent' } });
      expect((TreeGridObj.grid.dataSource[1] as ITreeData).childRecords.length).toBe(1);
    });
    afterAll(() => {
      destroy(TreeGridObj);
    });
  });


  afterAll(() => {
    destroy(gridObj);
  });

  describe('childMapping property to newly added row', () => {
    let TreeGridObj: TreeGrid;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: sampleData,
          allowRowDragAndDrop: true,
          childMapping: 'subtasks',
          height: '400',
          allowSelection: true,
          treeColumnIndex: 1,
          editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            mode: 'Cell',
            newRowPosition: 'Child'
          },
          toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 100 },
            { field: 'taskName', headerText: 'Task Name', width: 250 },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 120 },
          ]
        },
        done
      );
    });
    it('Adding new record', () => {
      (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: TreeGridObj.grid.element.id + '_add' } });
      TreeGridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = '99';
      TreeGridObj.grid.editModule.formObj.element.getElementsByTagName('input')[1].value = 'Planned';
      TreeGridObj.grid.editModule.formObj.element.getElementsByTagName('input')[2].value = '10';
      (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: TreeGridObj.grid.element.id + '_update' } });
      TreeGridObj.rowDragAndDropModule.reorderRows([3], 0, 'child');
      expect((TreeGridObj.grid.dataSource[0].level)).toBe(0);
      expect(TreeGridObj.dataSource[0].hasOwnProperty('subtasks')).toBe(true);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-47105-Dropping deep level root record to bottom of parent record', () => {
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
        },
        done
      );
    });

    it('Dropping deep level root record to bottom of parent record', () => {
      TreeGridObj.rowDragAndDropModule.reorderRows([2], 1, 'child');
      TreeGridObj.rowDragAndDropModule.reorderRows([2], 0, 'below');
      expect((TreeGridObj.grid.dataSource[0] as ITreeData).childRecords.length).toBe(2);
      expect((TreeGridObj.grid.dataSource[3].level)).toBe(0);
    });

    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-47105-Dropping root parent record as child to another root parent record', () => {
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
        },
        done
      );
    });

    it('Dropping root parent record as child to another root parent record', () => {
      TreeGridObj.rowDragAndDropModule.reorderRows([4], 0, 'child');
      expect((TreeGridObj.grid.dataSource[0] as ITreeData).childRecords.length).toBe(4);
      expect((TreeGridObj.grid.dataSource[3].level)).toBe(1);
    });

    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-47105-Dropping root parent record as child to record', () => {
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
        },
        done
      );
    });

    it('Dropping root parent record as child to record', () => {
      TreeGridObj.rowDragAndDropModule.reorderRows([3], 0, 'above');
      TreeGridObj.rowDragAndDropModule.reorderRows([1], 0, 'child');
      expect((TreeGridObj.grid.dataSource[0] as ITreeData).childRecords.length).toBe(1);
      expect((TreeGridObj.grid.dataSource[1].level)).toBe(1);
    });

    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-47105-Dropping root parent record below a record', () => {
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
        },
        done
      );
    });

    it('Dropping root parent record below a record', () => {
      TreeGridObj.rowDragAndDropModule.reorderRows([6], 4, 'above');
      TreeGridObj.rowDragAndDropModule.reorderRows([0], 4, 'below');
      expect((TreeGridObj.grid.dataSource[1] as ITreeData).childRecords.length).toBe(3);
    });

    afterAll(() => {
      destroy(gridObj);
    });
  });
  
  describe('EJ2-47105-Dropping child parent record below a root parent record', () => {
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
        },
        done
      );
    });

    it('Dropping child parent record below a root parent record', () => {
      TreeGridObj.rowDragAndDropModule.reorderRows([4], 0, 'child');
      TreeGridObj.rowDragAndDropModule.reorderRows([4], 0, 'below');
      expect((TreeGridObj.grid.dataSource[5].level)).toBe(1);
    });

    afterAll(() => {
      destroy(gridObj);
    });
  });
    
  describe('Treegrid Indent action params check', () => {
    let TreeGridObj: TreeGrid;
    let actionComplete: () => void;
    let actionBegin: () => void;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: "subtasks",
          treeColumnIndex: 1,
          allowRowDragAndDrop: true,
          toolbar: ['Indent', 'Outdent'],
          columns: [
            { field: "TaskID", headerText: "Task Id", isPrimaryKey: true, width: 90 },
            { field: 'TaskName', headerText: 'TaskName', width: 60 },
            { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
          ],
        },done); 
      });

    it('Indent', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType == 'outdented') {
         expect(args.data[0].level == 1).toBe(true);
        }
        done();
      }
      actionBegin = (args?: any): void => {
        if (args.action != 'outdenting') {
          expect(args.action == 'indenting').toBe(true);
      }
      }
      TreeGridObj.actionComplete = actionComplete;
      TreeGridObj.actionBegin = actionBegin;
      TreeGridObj.selectRow(1);
      TreeGridObj.selectRow(2);
      (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: TreeGridObj.grid.element.id + '_indent' } });
      TreeGridObj.selectRow(2);
      (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: TreeGridObj.grid.element.id + '_outdent' } });
    });
    afterAll(() => {
      destroy(TreeGridObj);
    });
  });


  describe('Treegrid Outdent action params check', () => {
    let TreeGridObj: TreeGrid;
    let actionComplete: () => void;
    let actionBegin: () => void;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: "subtasks",
          treeColumnIndex: 1,
          allowRowDragAndDrop: true,
          toolbar: ['Indent', 'Outdent'],
          columns: [
            { field: "TaskID", headerText: "Task Id", isPrimaryKey: true, width: 90 },
            { field: 'TaskName', headerText: 'TaskName', width: 60 },
            { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
          ],
        },done); 
      });

    it('Outdent', (done: Function) => {
      actionComplete = (args?: any): void => {
        expect(args.requestType == 'outdented').toBe(true);
        done();
      }
      actionBegin = (args?: any): void => {
        expect(args.action == 'outdenting').toBe(true);
        done();
      }
      TreeGridObj.actionComplete = actionComplete;
      TreeGridObj.actionBegin = actionBegin;
      TreeGridObj.selectRow(1);
      (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: TreeGridObj.grid.element.id + '_outdent' } });
    });
    afterAll(() => {
      destroy(TreeGridObj);
    });
  });

  describe('EJ2-53461- Drag and drop after the initial sort', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: projectData,
          height: 400,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          allowSelection: true,
          selectionSettings: { type: 'Multiple' },
          allowSorting: true,
          sortSettings: { columns: [{ field: 'TaskID', direction: 'Ascending' }] },
          editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            mode: 'Cell',
            newRowPosition: 'Below'
        },
          allowRowDragAndDrop: true,
          treeColumnIndex: 1,
          columns: [
              { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 140, isPrimaryKey:true },
              { field: 'TaskName', headerText: 'Task Name', width: 160 },
              { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120, format: { skeleton: 'yMd', type: 'date' }},
              { field: 'EndDate', headerText: 'End Date', textAlign: 'Right', width: 120, format: { skeleton: 'yMd', type: 'date' }},
              { field: 'Duration', headerText: 'Duration', textAlign: 'Right', width: 110},
              { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 110},
              { field: 'Priority', headerText: 'Priority', width: 110}
          ]
        },
        done
      );
    });

    it('Adding a new record and reordering', (done: Function) => {
      actionComplete = (args?: any): void => {
        gridObj.rowDragAndDropModule.reorderRows([4],0,'below');
        expect(gridObj.parentData.length).toBe(3);
        done();
      }
      gridObj.actionComplete = actionComplete;
      gridObj.addRecord({TaskID:123,TaskName: 'New Task1'}, 0, 'Above');
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-66304- Navigate over the cells through Tab when record is in collapsed state)', () => {
    let gridObj: TreeGrid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          allowRowDragAndDrop: true,
          childMapping: 'subtasks',
          height: '400',
          allowSelection: true,
          selectionSettings: { type: 'Multiple' },
          treeColumnIndex: 1,
          columns: [
                { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 100 },
                { field: 'taskName', headerText: 'Task Name', width: 250 },
                { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 135, format: { skeleton: 'yMd', type: 'date' }},
                { field: 'endDate', headerText: 'End Date', textAlign: 'Right', width: 135, format: { skeleton: 'yMd', type: 'date' }},
                { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 120 },
                { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 120 },
                { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 135 },
            ],
        },
        done
      );
    });

    it('Collapsing the record and navigate over the cells through Tab', (done: Function) => {
      gridObj.collapseRow(gridObj.getRows()[0]);
      let event: MouseEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(0, 5).dispatchEvent(event);
      gridObj.grid.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-rowcell.e-focus') });
      gridObj.grid.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-rowcell.e-focus') });
      expect(gridObj.grid.contentModule['rows'][2].visible).toBe(false);
      done();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

});

describe('EJ2-70341- Row Drop at bottom segment(with last record of TreeGrid) not working properly)', () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        allowRowDragAndDrop: true,
        childMapping: 'subtasks',
        height: '400',
        allowSelection: true,
        selectionSettings: { type: 'Multiple' },
        treeColumnIndex: 1,
        columns: [
          { field: "taskID", headerText: "Task Id", width: 90 },
          { field: 'taskName', headerText: 'taskName', width: 60 },
          { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
          { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
        ],
      },
      done
    );
  });

  it('Drop the record at bottom using RowDD', (done: Function) => {
    gridObj.rowDragAndDropModule.reorderRows([20],35,'below');
    expect(gridObj.grid.dataSource[28].level).toBe(1);
    done();
  });
  afterAll(() => {
    destroy(gridObj);
  });
});