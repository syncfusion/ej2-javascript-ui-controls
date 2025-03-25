import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData, projectData2, unorederedData, projectData } from '../base/datasource.spec';
import { getObject } from '@syncfusion/ej2-grids';
import { EmitType } from '@syncfusion/ej2-base';
import { RowDD } from '../../src/treegrid/actions/rowdragdrop';
import { ITreeData, TreeGridColumn } from '../../src';
import { VirtualScroll } from '../../src/treegrid/actions/virtual-scroll';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { Sort } from '../../src/treegrid/actions/sort';
/**
 * TreeGrid Row Drag And Drop spec 
 */
TreeGrid.Inject(RowDD, VirtualScroll, Toolbar, Sort);
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
            { field: "taskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
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
            { field: "taskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
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
            { field: "taskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
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
            { field: "taskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
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
            { field: "taskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
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
            { field: "taskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
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
            { field: "taskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
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
            { field: "taskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
            { field: 'taskName', headerText: 'taskName', width: 60 },
            { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
            { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
          ],
        },done); 
      });

    it('Parent Row selected with child records for target to add above to target record', () => {
      TreeGridObj.rowDragAndDropModule.reorderRows([5,6,7],0,'above');
      expect((TreeGridObj.flatData[0] as ITreeData).childRecords.length).toBe(5);
      expect((TreeGridObj.flatData[6] as ITreeData).childRecords.length).toBe(4);
      expect((TreeGridObj.flatData[4] as ITreeData).parentItem['taskID']).toBe(6);
      expect((TreeGridObj.flatData[5] as ITreeData).parentItem['taskID']).toBe(6);
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
            { field: "TaskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
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
            { field: "TaskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
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
      expect(TreeGridObj.getRows()[3].classList.contains('e-childrow-visible')).toBe(true);
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
            { field: 'taskID', headerText: 'Task ID', width: 90, textAlign: 'Right', isPrimaryKey: true },
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
    expect(gridObj.getRows()[3].classList.contains('e-childrow-hidden')).toBe(true);         
  });

  it('Collapse Testing', () => {    
    ((gridObj.getRows()[2] as HTMLTableRowElement).getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
    expect(gridObj.getRows()[3].classList.contains('e-childrow-visible')).toBe(true);         
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
            { field: "TaskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
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
            { field: "TaskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
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
            { field: "TaskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
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
            { field: "TaskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
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
            { field: "TaskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
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

describe('EJ2-71626- Last row border is not added while drag and drop a row to the last index)', () => {
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
        ],
      },
      done
    );
  });

  it('Drop the record at bottom using RowDD and checking the last row border', (done: Function) => {
    actionComplete = (args?: any): void => {
      expect((gridObj.getVisibleRecords()[gridObj.getVisibleRecords().length - 1] as any).taskID).toBe(1);
      expect(gridObj.getRows()[31].cells[0].classList.contains('e-lastrowcell')).toBe(true);
      expect(gridObj.getRows()[31].cells[7].classList.contains('e-lastrowcell')).toBe(true);  
      done();
    };
    gridObj.actionComplete = actionComplete;
    gridObj.collapseAll();
    gridObj.rowDragAndDropModule.reorderRows([0],11, 'below');
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('Treegrid Row Reorder with immutablemode', () => {
  let TreeGridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreeGridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        allowRowDragAndDrop: false,
        enableImmutableMode: true,
        height: 400,
        toolbar: ['Indent', 'Outdent'],
        columns: [
          { field: "taskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
          { field: 'taskName', headerText: 'taskName', width: 60 },
          { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
          { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
        ],
      }, done);
  });

  it('Row Reorder Testing for child to indent', () => {
    TreeGridObj.selectRow(3);
    TreeGridObj.indent();
    expect(TreeGridObj.getCurrentViewRecords()[3]['level'] === 2).toBe(true);
  });

  it('Perform outdent with first row', () => {
    TreeGridObj.selectRow(0);
    TreeGridObj.outdent();
    expect(TreeGridObj.getCurrentViewRecords()[0]['level'] === 0).toBe(true);
  });
  
  afterAll(() => {
    destroy(TreeGridObj);
  });
});

describe('Treegrid Row Reorder with immutablemode', () => {
  let TreeGridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreeGridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        allowRowDragAndDrop: false,
        enableImmutableMode: true,
        height: 400,
        toolbar: ['Indent', 'Outdent'],
        columns: [
          { field: "taskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
          { field: 'taskName', headerText: 'taskName', width: 60 },
          { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
          { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
        ],
      }, done);
  });
  it('Row Reorder Testing for child to outdent with selection', () => {
    TreeGridObj.selectRow(6);
    TreeGridObj.outdent();
    expect(TreeGridObj.getCurrentViewRecords()[6]['level'] === 0).toBe(true);
  });

  it('Row Reorder Testing for child to outdent without selection', () => {
    TreeGridObj.outdent();
    expect(TreeGridObj.selectedRowIndex === -1).toBe(true);
  });

  it('Row Reorder Testing for child to indent for first row ', () => {
    TreeGridObj.selectRow(0);
    TreeGridObj.indent();
    expect(TreeGridObj.getCurrentViewRecords()[0]['level'] === 0).toBe(true);
  });

  afterAll(() => {
    destroy(TreeGridObj);
  });
});

describe('Treegrid indent and outdent action in virtualization', () => {
  let TreeGridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreeGridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        enableVirtualization: true,
        height: 450,
        allowRowDragAndDrop: false,
        toolbar: ['Indent', 'Outdent'],
        columns: [
          { field: "taskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
          { field: 'taskName', headerText: 'taskName', width: 60 },
          { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
          { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
        ],
      }, done);
  });
  it('Row Reorder Testing for child to outdent with selection', () => {
    TreeGridObj.selectRow(2);
    TreeGridObj.indent();
    TreeGridObj.selectRow(3);
    TreeGridObj.indent();
    expect(TreeGridObj.getCurrentViewRecords()[2]['level'] === 2).toBe(true);
  });

  afterAll(() => {
    destroy(TreeGridObj);
  });
});

describe('Drag and drop with in the treegrid', () => {
  let TreeGridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreeGridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        height: 450,
        allowRowDragAndDrop: true,
        columns: [
          { field: "taskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
          { field: 'taskName', headerText: 'taskName', width: 60 },
          { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
          { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
        ],
      }, done);
  });
  it('coverage improvement single treegrid with data drag and drop', () => {
    expect(TreeGridObj.rowDropSettings.targetID).toBe(undefined);
    const dragRowElem: Element = TreeGridObj.getRowByIndex(2).querySelector('.e-rowdragdrop.e-rowdragdropcell');
    const dropRowElem: Element = TreeGridObj.getRowByIndex(1).querySelector('.e-rowdragdrop.e-rowdragdropcell');
    const dragClient: any = dragRowElem.getBoundingClientRect();
    const dropClient: any = dropRowElem.getBoundingClientRect();
    TreeGridObj.selectRow(2);
    dragRowElem.classList.add('e-rowcell');
    (TreeGridObj.grid.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
    (TreeGridObj.grid.rowDragAndDropModule as any).helper({
      target: TreeGridObj.getContentTable().querySelector('tr'),
      sender: { clientX: 10, clientY: 10, target: dragRowElem }
    });
    const dropClone: HTMLElement = TreeGridObj.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
    (TreeGridObj.grid.rowDragAndDropModule as any).dragStart({
      target: dragRowElem,
      event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
    });
    (TreeGridObj.grid.rowDragAndDropModule as any).drag({
      target: dropRowElem,
      event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
    });
    (TreeGridObj.grid.rowDragAndDropModule as any).dragStop({
      target: dropRowElem,
      element: TreeGridObj.getContentTable(),
      helper: dropClone,
      event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
    });
  });

  afterAll(() => {
    destroy(TreeGridObj);
  });
});

describe('Drag and drop with immutablemode', () => {
  let TreeGridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreeGridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        enableImmutableMode: true,
        height: 450,
        allowRowDragAndDrop: true,
        toolbar: ['Indent', 'Outdent'],
        columns: [
          { field: "taskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
          { field: 'taskName', headerText: 'taskName', width: 60 },
          { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
          { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
        ],
      }, done);
  });
  it('coverage improvement single treegrid with data drag and drop', () => {
    expect(TreeGridObj.rowDropSettings.targetID).toBe(undefined);
    const dragRowElem: Element = TreeGridObj.getRowByIndex(2).querySelector('.e-rowdragdrop.e-rowdragdropcell');
    const dropRowElem: Element = TreeGridObj.getRowByIndex(1).querySelector('.e-rowdragdrop.e-rowdragdropcell');
    const dragClient: any = dragRowElem.getBoundingClientRect();
    const dropClient: any = dropRowElem.getBoundingClientRect();
    TreeGridObj.selectRow(2);
    dragRowElem.classList.add('e-rowcell');
    (TreeGridObj.grid.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
    (TreeGridObj.grid.rowDragAndDropModule as any).helper({
      target: TreeGridObj.getContentTable().querySelector('tr'),
      sender: { clientX: 10, clientY: 10, target: dragRowElem }
    });
    const dropClone: HTMLElement = TreeGridObj.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
    (TreeGridObj.grid.rowDragAndDropModule as any).dragStart({
      target: dragRowElem,
      event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
    });
    (TreeGridObj.grid.rowDragAndDropModule as any).drag({
      target: dropRowElem,
      event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
    });
    (TreeGridObj.grid.rowDragAndDropModule as any).dragStop({
      target: dropRowElem,
      element: TreeGridObj.getContentTable(),
      helper: dropClone,
      event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
    });
  });

  afterAll(() => {
    destroy(TreeGridObj);
  });
});

describe('Drag and drop with two treegrid', () => {
  let gridObj1: TreeGrid;
  let gridObj2: TreeGrid;
  beforeAll((done: Function) => {
    gridObj1 = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        height: 400,
        allowRowDragAndDrop: true,
        allowPaging: true,
        selectionSettings: { type: 'Multiple' },
        columns: [
          { field: "taskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
          { field: 'taskName', headerText: 'taskName', width: 60 },
          { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
          { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
        ],
      }, done);
  });
  beforeAll((done: Function) => {
    gridObj2 = createGrid(
      {
        dataSource: [],
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        height: 400,
        allowRowDragAndDrop: true,
        allowPaging: true,
        selectionSettings: { type: 'Multiple' },
        columns: [
          { field: "taskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
          { field: 'taskName', headerText: 'taskName', width: 60 },
          { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
          { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
        ],
      }, done);
  });
  it('coverage improvement multiple treegrid with data drag and drop', () => {
    gridObj1.element.style.display = 'inline-block';
    gridObj2.element.style.display = 'inline-block';
    expect(gridObj1.rowDropSettings.targetID).toBe(undefined);
    expect((gridObj2.dataSource as Object[]).length).toBe(0);
    gridObj1.rowDropSettings.targetID = gridObj2.element.id;
    const dragRowElem: Element = gridObj1.getRowByIndex(0).querySelector('.e-rowdragdrop.e-rowdragdropcell');
    const dropRowElem: Element = gridObj2.getContentTable().querySelector('tr');
    const dragClient: any = dragRowElem.getBoundingClientRect();
    const dropClient: any = dropRowElem.getBoundingClientRect();
    gridObj1.selectRows([0, 1]);
    dragRowElem.classList.add('e-rowcell');
    (gridObj1.grid.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
    (gridObj1.grid.rowDragAndDropModule as any).helper({
      target: gridObj1.getContentTable().querySelector('tr'),
      sender: { clientX: 10, clientY: 10, target: dragRowElem }
    });
    const dropClone: HTMLElement = gridObj1.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
    (gridObj1.grid.rowDragAndDropModule as any).dragStart({
      target: dragRowElem,
      event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
    });
    (gridObj1.grid.rowDragAndDropModule as any).drag({
      target: dropRowElem,
      event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
    });
    (gridObj1.grid.rowDragAndDropModule as any).dragStop({
      target: dropRowElem,
      element: gridObj2.getContentTable(),
      helper: dropClone,
      event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
    });
  });

  afterAll(() => {
    destroy(gridObj1);
    gridObj1 = null;
    destroy(gridObj2);
    gridObj2 = null;
  });
});

describe('Treegrid Row Reorder using self reference data', () => {
  let gridObj1: TreeGrid;
  let gridObj2: TreeGrid;
  beforeAll((done: Function) => {
    gridObj1 = createGrid(
      {
        dataSource: projectData2,
        idMapping: 'TaskID',
        parentIdMapping: 'parentID',
        treeColumnIndex: 1,
        allowRowDragAndDrop: true,
        allowPaging: true,
        height: 400,
        selectionSettings: { type: 'Multiple' },
        columns: [
          { field: "TaskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
          { field: 'TaskName', headerText: 'TaskName', width: 60 },
          { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
        ],
      },done); 
    });
    beforeAll((done: Function) => {
      gridObj2 = createGrid(
        {
          dataSource: [],
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          treeColumnIndex: 1,
          height: 400,
          allowRowDragAndDrop: true,
          allowPaging: true,
        selectionSettings: { type: 'Multiple' },
          columns: [
            { field: "TaskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
            { field: 'TaskName', headerText: 'TaskName', width: 60 },
            { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
          ],
        },done); 
      });

  it('coverage improvement multiple treegrid with data drag and drop with self referntial data', () => {
    gridObj1.element.style.display = 'inline-block';
    gridObj2.element.style.display = 'inline-block';
    expect(gridObj1.rowDropSettings.targetID).toBe(undefined);
    expect((gridObj2.dataSource as Object[]).length).toBe(0);
    gridObj1.rowDropSettings.targetID = gridObj2.element.id;
    const dragRowElem: Element = gridObj1.getRowByIndex(0).querySelector('.e-rowdragdrop.e-rowdragdropcell');
    const dropRowElem: Element = gridObj2.getContentTable().querySelector('tr');
    const dragClient: any = dragRowElem.getBoundingClientRect();
    const dropClient: any = dropRowElem.getBoundingClientRect();
    gridObj1.selectRows([0, 1]);
    dragRowElem.classList.add('e-rowcell');
    (gridObj1.grid.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
    (gridObj1.grid.rowDragAndDropModule as any).helper({
      target: gridObj1.getContentTable().querySelector('tr'),
      sender: { clientX: 10, clientY: 10, target: dragRowElem }
    });
    const dropClone: HTMLElement = gridObj1.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
    (gridObj1.grid.rowDragAndDropModule as any).dragStart({
      target: dragRowElem,
      event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
    });
    (gridObj1.grid.rowDragAndDropModule as any).drag({
      target: dropRowElem,
      event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
    });
    (gridObj1.grid.rowDragAndDropModule as any).dragStop({
      target: dropRowElem,
      element: gridObj2.getContentTable(),
      helper: dropClone,
      event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
    });
  });
  afterAll(() => {
    destroy(gridObj1);
    gridObj1 = null;
    destroy(gridObj2);
    gridObj2 = null;
  });
});

describe('Drag and drop with in the treegrid', () => {
  let TreeGridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreeGridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        enableImmutableMode: true,
        height: 450,
        allowRowDragAndDrop: true,
        columns: [
          { field: "taskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
          { field: 'taskName', headerText: 'taskName', width: 60 },
          { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
          { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
        ],
      }, done);
  });
  it('coverage improvement single treegrid with data drag and drop', () => {
    expect(TreeGridObj.rowDropSettings.targetID).toBe(undefined);
    const dragRowElem: Element = TreeGridObj.getRowByIndex(2).querySelector('.e-rowdragdrop.e-rowdragdropcell');
    const dropRowElem: Element = TreeGridObj.getRowByIndex(1).querySelector('.e-rowdragdrop.e-rowdragdropcell');
    const dragClient: any = dragRowElem.getBoundingClientRect();
    const dropClient: any = dropRowElem.getBoundingClientRect();
    TreeGridObj.selectRow(2);
    dragRowElem.classList.add('e-rowcell');
    (TreeGridObj.grid.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
    TreeGridObj.rowDrop = function(args: any){
      this.rowDragAndDropModule.dropPosition = 'middleSegment';
    };
    (TreeGridObj.grid.rowDragAndDropModule as any).helper({
      target: TreeGridObj.getContentTable().querySelector('tr'),
      sender: { clientX: 10, clientY: 10, target: dragRowElem }
    });
    const dropClone: HTMLElement = TreeGridObj.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
    (TreeGridObj.grid.rowDragAndDropModule as any).dragStart({
      target: dragRowElem,
      event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
    });
    (TreeGridObj.grid.rowDragAndDropModule as any).drag({
      target: dropRowElem,
      event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
    });
    (TreeGridObj.grid.rowDragAndDropModule as any).dragStop({
      target: dropRowElem,
      element: TreeGridObj.getContentTable(),
      helper: dropClone,
      event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
    });
  });

  afterAll(() => {
    destroy(TreeGridObj);
  });
});

describe('Drag and drop with sorting', () => {
  let TreeGridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreeGridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        allowSorting: true,
        height: 450,
        allowRowDragAndDrop: true,
        toolbar: ['Indent', 'Outdent'],
        columns: [
          { field: "taskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
          { field: 'taskName', headerText: 'taskName', width: 60 },
          { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
          { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
        ],
        sortSettings: { columns: [{ field: 'taskName', direction: 'Ascending' }]},
      }, done);
  });
  it('coverage improvement single treegrid with data drag and drop with sorting', () => {
    expect(TreeGridObj.rowDropSettings.targetID).toBe(undefined);
    const dragRowElem: Element = TreeGridObj.getRowByIndex(2).querySelector('.e-rowdragdrop.e-rowdragdropcell');
    const dropRowElem: Element = TreeGridObj.getRowByIndex(1).querySelector('.e-rowdragdrop.e-rowdragdropcell');
    const dragClient: any = dragRowElem.getBoundingClientRect();
    const dropClient: any = dropRowElem.getBoundingClientRect();
    TreeGridObj.selectRow(2);
    dragRowElem.classList.add('e-rowcell');
    (TreeGridObj.grid.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
    (TreeGridObj.grid.rowDragAndDropModule as any).helper({
      target: TreeGridObj.getContentTable().querySelector('tr'),
      sender: { clientX: 10, clientY: 10, target: dragRowElem }
    });
    const dropClone: HTMLElement = TreeGridObj.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
    (TreeGridObj.grid.rowDragAndDropModule as any).dragStart({
      target: dragRowElem,
      event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
    });
    (TreeGridObj.grid.rowDragAndDropModule as any).drag({
      target: dropRowElem,
      event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
    });
    (TreeGridObj.grid.rowDragAndDropModule as any).dragStop({
      target: dropRowElem,
      element: TreeGridObj.getContentTable(),
      helper: dropClone,
      event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
    });
  });

  afterAll(() => {
    destroy(TreeGridObj);
  });
});

describe('905629:Indent/outdent was not working properly with editing', () => {
  let TreeGridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    TreeGridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        height: 450,
        allowRowDragAndDrop: true,
        allowSelection: true,
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          mode: 'Cell',
        },
        toolbar: ['Add', 'Edit', 'Update', 'Indent', 'Outdent'],
        columns: [
          { field: "taskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
          { field: 'taskName', headerText: 'taskName', width: 60 },
          { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
          { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
        ],
      }, done);
  });
  it('Test Case: Edit -> Indent -> Check e-treegridexpand icon', (done) => {
    actionComplete = (args?: any): void => {
      if (args.requestType == 'indented') {
        expect((TreeGridObj.getRows()[2] as HTMLTableRowElement).getElementsByClassName('e-treegridexpand').length).toBe(1);
      }
      else if(args.requestType == 'outdented')
      {
        expect((TreeGridObj.getRows()[2] as HTMLTableRowElement).getElementsByClassName('e-treegridexpand').length).toBe(0);
        done();
      }
    };
    const event: MouseEvent = new MouseEvent('dblclick', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    TreeGridObj.actionComplete = actionComplete;
    TreeGridObj.getCellFromIndex(3, 1).dispatchEvent(event);
    TreeGridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'Just Allocate';
    (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: TreeGridObj.grid.element.id + '_update' } });
    TreeGridObj.selectRow(3);
    TreeGridObj.indent();
    TreeGridObj.selectRow(3);
    TreeGridObj.outdent();
  });
  afterAll(() => {
    destroy(TreeGridObj);
  });
});

describe('Drag and drop with detailTemplate', () => {
  let TreeGridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreeGridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        detailTemplate: 'Test',
        treeColumnIndex: 1,
        height: 450,
        allowRowDragAndDrop: true,
        columns: [
          { field: "taskID", headerText: "Task Id", width: 90, isPrimaryKey: true },
          { field: 'taskName', headerText: 'taskName', width: 60 },
          { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
          { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
        ],
      }, done);
  });
  it('detail Template with rowDD action', () => {
    expect(TreeGridObj.rowDropSettings.targetID).toBe(undefined);
    const dragRowElem: Element = TreeGridObj.getRowByIndex(2).querySelector('.e-rowdragdrop.e-rowdragdropcell');
    const dropRowElem: Element = TreeGridObj.getRowByIndex(1).querySelector('.e-rowdragdrop.e-rowdragdropcell');
    const dragClient: any = dragRowElem.getBoundingClientRect();
    const dropClient: any = dropRowElem.getBoundingClientRect();
    TreeGridObj.selectRow(2);
    dragRowElem.classList.add('e-rowcell');
    (TreeGridObj.grid.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
    TreeGridObj.rowDrop = function(args: any){
      this.rowDragAndDropModule.dropPosition = 'middleSegment';
    };
    (TreeGridObj.grid.rowDragAndDropModule as any).helper({
      target: TreeGridObj.getContentTable().querySelector('tr'),
      sender: { clientX: 10, clientY: 10, target: dragRowElem }
    });
    const dropClone: HTMLElement = TreeGridObj.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
    (TreeGridObj.grid.rowDragAndDropModule as any).dragStart({
      target: dragRowElem,
      event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
    });
    (TreeGridObj.grid.rowDragAndDropModule as any).drag({
      target: dropRowElem,
      event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
    });
    (TreeGridObj.grid.rowDragAndDropModule as any).dragStop({
      target: dropRowElem,
      element: TreeGridObj.getContentTable(),
      helper: dropClone,
      event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
    });
  });

  afterAll(() => {
    destroy(TreeGridObj);
  });
});