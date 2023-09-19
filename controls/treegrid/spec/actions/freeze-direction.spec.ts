import { TreeGrid} from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData } from '../base/datasource.spec';
import { Sort } from '../../src/treegrid/actions/sort';
import { Freeze } from '../../src/treegrid/actions/freeze-column'; 
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Page } from '../../src/treegrid/actions/page';
import { createElement, EmitType, remove, extend, select, isNullOrUndefined } from '@syncfusion/ej2-base';
import { RowExpandedEventArgs, RowCollapsedEventArgs, RowCollapsingEventArgs } from '../../src';
import { projectDatas as data } from '../base/datasource.spec';
import { Filter } from '../../src/treegrid/actions/filter';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { ContextMenu } from '../../src/treegrid/actions/context-menu';
import { SaveEventArgs, CellEditArgs } from '@syncfusion/ej2-grids';


TreeGrid.Inject(Sort, Page, Filter, Toolbar, ContextMenu, Freeze);

describe('Ensure freeze direction', () => {
  let gridObj: TreeGrid;
  let rows: Element[];
  beforeAll((done: Function) => {
      
    gridObj = createGrid(
      {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Below'},
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          treeColumnIndex: 1,
          columns: [
              { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 100, freeze: 'Left' },
              { field: 'taskName', headerText: 'Task Name', width: 190, freeze: 'Left' },
              { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100 },
              { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 100 },
              { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 120, freeze: 'Right' },
          ],
          height: 315
      },
      done
    );
  });
  it('Ensure frozen method', (done: Function) => {
    expect(gridObj.getFrozenLeftColumnsCount()).toBe(2);
    expect(gridObj.getMovableColumnsCount()).toBe(2);
    expect(gridObj.getFrozenRightColumnsCount()).toBe(1);
    expect(gridObj.getFrozenLeftColumns().length).toBe(gridObj.getFrozenLeftColumnsCount());
    expect(gridObj.getMovableColumns().length).toBe(gridObj.getMovableColumnsCount());
    expect(gridObj.getFrozenRightColumns().length).toBe(gridObj.getFrozenRightColumnsCount());
    done();
 });
 it('Ensure expand collpase action', (done: Function) => {
    rows = gridObj.getRows();
    expect((rows[1] as HTMLTableRowElement).style.display).toBe('');
    (rows[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
    expect((rows[1] as HTMLTableRowElement).style.display).toBe('none');
    (rows[0].getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
    expect((rows[1] as HTMLTableRowElement).style.display).toBe('table-row');
    done();
 });
  
      afterAll(() => {
      destroy(gridObj);
    });
});

  describe('Hierarchy - Batch Add', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Batch" },
          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, freeze: 'Left' },
          { field: 'taskName', headerText: 'Task Name' },
          { field: 'progress', headerText: 'Progress' },
          { field: 'startDate', headerText: 'Start Date', freeze: 'Right' }
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
  describe('Ensure freeze direction with editing - Add at Above', () => {
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
              columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, freeze: 'Left' },
              { field: 'taskName', headerText: 'Task Name' },
              { field: 'progress', headerText: 'Progress' },
              { field: 'startDate', headerText: 'Start Date', freeze:'Right' }
              ]
        },
        done
      );
    });
       
    it('delete row - child parent row - 1', (done: Function) => {
      actionComplete = (args?: any): void => {
        let cells: NodeListOf<Element> = gridObj.grid.getRows()[1].querySelectorAll('.e-rowcell');
        expect(cells[0].textContent === '3' ).toBeTruthy()
        done();
      };
      gridObj.actionComplete = actionComplete;
      gridObj.grid.selectRow(1);
      gridObj.grid.deleteRecord('taskID',gridObj.dataSource[0].subtasks[0]);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Ensure freeze direction with editing', () => {
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
              columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, freeze: 'Left' },
              { field: 'taskName', headerText: 'Task Name' },
              { field: 'progress', headerText: 'Progress' },
              { field: 'startDate', headerText: 'Start Date', freeze: 'Right' }
              ]
        },
        done
      );
    });
    
    it('Add row', (done: Function) => {
        actionComplete = (args?: any): void => {
            expect(gridObj.dataSource[0][gridObj.childMapping].length).toBe(5);
            expect(gridObj.grid.dataSource[2].taskID).toBe(123);
            expect(gridObj.dataSource[0]["subtasks"][1].taskID).toBe(123);
            done();
        }
        gridObj.actionComplete = actionComplete;
        gridObj.addRecord({taskID:123,taskName: 'Below record'}, 1, 'Below');
    });

  describe('Ensure freeze direction with sorting', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowSorting: true,
          columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, freeze: 'Left' },
          { field: 'taskName', headerText: 'Task Name' },
          { field: 'progress', headerText: 'Progress' },
          { field: 'startDate', headerText: 'Start Date', freeze: 'Right' },
          { field: 'endDate', headerText: 'End Date', freeze: 'Right' }
          ]
        },done);
    });

    it('expand testing', (done: Function) => {
      actionComplete = (args?: Object): void => {
         expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Design").toBe(true);
         expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Design complete").toBe(true);
         expect(gridObj.getRows()[8].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Implementation Module 1").toBe(true);
         expect(gridObj.getRows()[9].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Bug fix").toBe(true);
         expect(gridObj.getRows()[16].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Implementation Module 2").toBe(true);
         expect(gridObj.getRows()[31].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Planning").toBe(true);
         done();
      }
      gridObj.sortByColumn("taskName", "Ascending", false);
      gridObj.grid.actionComplete = actionComplete;
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Ensure freeze direction with Multi sort Ascending', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowSorting: true,
          columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, freeze: 'Left' },
          { field: 'taskName', headerText: 'Task Name' },
          { field: 'progress', headerText: 'Progress' },
          { field: 'startDate', headerText: 'Start Date', freeze: 'Right' },
          { field: 'endDate', headerText: 'End Date', freeze: 'Right' }
          ]
        },done);
    });

    it('expand testing', (done: Function) => {
      actionComplete = (args?: Object): void => {
         expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Design").toBe(true);
         expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[0].innerHTML == "6").toBe(true);
         expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Design complete").toBe(true);
         expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[0].innerHTML == "11").toBe(true);
         expect(gridObj.getRows()[8].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Implementation Module 1").toBe(true);
         expect(gridObj.getRows()[8].getElementsByClassName('e-rowcell')[0].innerHTML == "14").toBe(true);
         expect(gridObj.getRows()[9].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Bug fix").toBe(true);
         expect(gridObj.getRows()[9].getElementsByClassName('e-rowcell')[0].innerHTML == "18").toBe(true);
         expect(gridObj.getRows()[16].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Implementation Module 2").toBe(true);
         expect(gridObj.getRows()[16].getElementsByClassName('e-rowcell')[0].innerHTML == "22").toBe(true);
         expect(gridObj.getRows()[31].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Planning").toBe(true);
         expect(gridObj.getRows()[31].getElementsByClassName('e-rowcell')[0].innerHTML == "1").toBe(true);
         done();
      }    
      gridObj.grid.actionComplete = actionComplete;
      gridObj.sortByColumn("taskName", "Ascending", true);  
      gridObj.sortByColumn("taskID", "Ascending", true);
    });   
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Ensure freeze direction with Filter Mode Testing - Parent', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let originalTimeout: number;
    let actionComplete: () => void;

    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowFiltering: true,
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90, freeze: 'Left'
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220, freeze:'Left' },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },                
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left', freeze: 'Right' }
          ]
        },
        done
      );
    });
    it('Check the filered records for parent mode', (done: Function) => {
        actionComplete = (args?: Object): void => {
         expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treegridexpand"))).toBe(false);
         expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Planning").toBe(true);
          expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Plan timeline").toBe(true);
         done();
        }
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn("taskName","startswith","Plan");
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Ensure freeze direction with Filter Mode Testing - Child', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionComplete: ()=> void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowFiltering: true, 
          filterSettings: { hierarchyMode: 'Child' },
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true}, width: 90, freeze: 'Left'
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220, freeze:'Left' },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
              format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right',
              type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },                
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
            { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left', freeze: 'Right' }
          ]
        },
        done
      );
    });

    it('Check the filtered records for child mode', (done: Function) => {

        actionComplete = (args?: Object): void => {
           expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treegridexpand"))).toBe(true);
           expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Develop prototype").toBe(true);
           expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Development Task 1").toBe(true); 
           done();
        }
        gridObj.grid.actionComplete = actionComplete;

      gridObj.filterByColumn("taskName","startswith","dev");
    });
    afterAll(() => {
      destroy(gridObj);
    });
   });
    
   describe('EJ2-66966- Collapse Issue on freeze direction sample', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: [{
            taskID: 1,
            taskName: 'Planning',
            startDate: new Date('02/03/2017'),
            endDate: new Date('02/07/2017'),
            progress: 100,
            duration: 5,
            isExpanded: false,
            priority: 'Normal',
            approved: false,
            designation: 'Vice President',
            employeeID: 1,
            subtasks: [
                {
                    taskID: 2,
                    taskName: 'Plan timeline',
                    startDate: new Date('02/03/2017'),
                    endDate: new Date('02/07/2017'),
                    duration: 5,
                    progress: 100,
                    priority: 'Normal',
                    approved: false,
                    designation: 'Chief Executive Officer',
                    employeeID: 2,
                    subtasks: [
                        {
                            taskID: 3,
                            taskName: 'Plan budget',
                            startDate: new Date('02/03/2017'),
                            endDate: new Date('02/07/2017'),
                            duration: 5,
                            progress: 100,
                            priority: 'Low',
                            approved: true,
                            designation: 'Chief Executive Officer',
                            employeeID: 3,
                            subtasks: [
                                {
                                    taskID: 4,
                                    taskName: 'Allocate resources',
                                    startDate: new Date('02/03/2017'),
                                    endDate: new Date('02/07/2017'),
                                    duration: 5,
                                    progress: 100,
                                    priority: 'Critical',
                                    approved: false,
                                    designation: 'Chief Executive Officer',
                                    employeeID: 4,
                                },
                            ]
                        }
                    ]
                }
            ]
        }],
        childMapping: 'subtasks',
        treeColumnIndex: 1,  
        allowSorting: true,
        allowSelection: false,
        height: 410,
        columns: [
            { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 100,freeze: 'Left'  },
            { field: 'taskName', headerText: 'Task Name', width: 250,freeze: 'Left' },
            { field: 'startDate', headerText: 'Start Date', width: 130, textAlign: 'Right',
                type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'endDate', headerText: 'End Date', width: 150, textAlign: 'Right',
                type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
            { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 130 },
            { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 130 },
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 160 },
            { field: 'designation', headerText: 'Designation', textAlign: 'Left', width: 190 },
            { field: 'employeeID', headerText: 'EmployeeID', textAlign: 'Left', width: 120 },
            { field: 'approved', headerText: 'Approved', width: 140, displayAsCheckBox: true, textAlign: 'Left',freeze: 'Right' }
        ]
        },
        done
      );
    });

    it('Collapse check for primary parent which has two level children', () => {
      expect(gridObj.getVisibleRecords().length == 4 ).toBe(true);
      gridObj.collapseRow(gridObj.getRows()[1]);
      expect(gridObj.getVisibleRecords().length == 2 ).toBe(true);

    });
    afterAll(() => {
      destroy(gridObj);
    });
   });
});
