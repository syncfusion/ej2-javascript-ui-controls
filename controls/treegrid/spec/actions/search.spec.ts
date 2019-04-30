import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData, projectData, newSampledata } from '../base/datasource.spec';
import { Filter } from '../../src/treegrid/actions/filter';
import { Edit } from '../../src/treegrid/actions/edit';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { SaveEventArgs, ActionEventArgs } from '@syncfusion/ej2-grids';

/**
 * Grid base spec 
 */
TreeGrid.Inject(Filter, Toolbar, Edit);
describe('Search module', () => {
  beforeAll(() => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
        console.log("Unsupported environment, window.performance.memory is unavailable");
        this.skip(); //Skips test (in Chai)
        return;
    }
  });

  describe('Hierarchy Search Mode Testing - Parent', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          toolbar: ['Search'],
          columns: ['taskID', 'taskName', 'duration', 'progress'],
        },
        done
      );
    });
    it('Check the search records for parent mode', (done: Function) => {
        actionComplete = (args?: Object): void => {
         expect(gridObj.getRows()[3].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML  === "Testing").toBe(true);
         expect(gridObj.getRows()[6].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML === "Testing").toBe(true);
         expect(gridObj.getRows()[5].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML === "Implementation Module 2").toBe(true);
         done();
        }
        gridObj.grid.actionComplete = actionComplete;
        gridObj.search("Testing");
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Hierarchy Search Mode Testing - Child', () => {
    let gridObj: TreeGrid;
    let actionComplete: ()=> void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          toolbar: ['Search'],
          searchSettings: { hierarchyMode: 'Child' },
          columns: ['taskID', 'taskName', 'duration', 'progress'],
        },
        done
      );
    });

    it('Check the searched records for child mode', (done: Function) => {

        actionComplete = (args?: Object): void => {
           expect(gridObj.getRows().length).toBe(3);
           expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML === "Testing").toBe(true);
           expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML === "Testing").toBe(true); 
           expect(gridObj.getRows()[2].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML === "Testing").toBe(true); 
           done();
        }
        gridObj.grid.actionComplete = actionComplete;
        gridObj.search("Testing");
    });

    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Hierarchy Search Mode Testing - Both', () => {
    let gridObj: TreeGrid;
    let actionComplete: ()=> void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          toolbar: ['Search'],
          searchSettings: { hierarchyMode: 'Both' },
          columns: ['taskID', 'taskName', 'duration', 'progress'],
        },
        done
      );
    });

    it('Check the searched records for both mode', (done: Function) => {

        actionComplete = (args?: Object): void => {
           expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML === "Planning").toBe(true);
           done();
        }
        gridObj.grid.dataBound = actionComplete;
        gridObj.search("Plan");
    });

    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Hierarchy Search Mode Testing - None', () => {
    let gridObj: TreeGrid;
    let actionComplete: ()=> void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          toolbar: ['Search'],
          searchSettings: { hierarchyMode: 'None' },
          columns: ['taskID', 'taskName', 'duration', 'progress'],
        },
        done
      );
    });

    it('Check the searched records for both mode', (done: Function) => {

        actionComplete = (args?: Object): void => {
           expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML === "Design").toBe(true); 
           done();
        }
        gridObj.grid.actionComplete = actionComplete;
        gridObj.search("Design");
    });

    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Flat Data Search Mode Testing - Parent', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: projectData,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          treeColumnIndex: 1,
          toolbar: ['Search'],
          searchSettings: { hierarchyMode: "Parent" },
          columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate']
        },done);
    });

    it('Flat Data Search Mode Testing', (done: Function) => {
      actionComplete = (args?: Object): void => {
         expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML === 'Parent Task 1').toBe(true);
         expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML === 'Parent Task 2').toBe(true);
         done();
      }
      gridObj.search("Parent");
      gridObj.grid.actionComplete = actionComplete;
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Flat Data Search Mode Testing - Child', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: projectData,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          treeColumnIndex: 1,
          toolbar: ['Search'],
          searchSettings: { hierarchyMode: "Child" },
          columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate']
        },done);
    });

    it('Flat Data Search Mode Testing', (done: Function) => {
      actionComplete = (args?: Object): void => {
         expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML === 'Child Task 1').toBe(true);
         expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML === 'Child Task 1').toBe(true);
         done();
      }
      gridObj.search("Child");
      gridObj.grid.actionComplete = actionComplete;
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Flat Data Search Mode Testing - Both', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: projectData,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          treeColumnIndex: 1,
          toolbar: ['Search'],
          searchSettings: { hierarchyMode: "Both" },
          columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate']
        },done);
    });

    it('Flat Data Search Mode Testing', (done: Function) => {
      actionComplete = (args?: Object): void => {
         expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML === 'Parent Task 1').toBe(true);
         expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML === 'Child Task 1').toBe(true);
         done();
      }
      gridObj.search("Task");
      gridObj.grid.actionComplete = actionComplete;
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Flat Data Search Mode Testing - None', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: projectData,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          treeColumnIndex: 1,
          toolbar: ['Search'],
          searchSettings: { hierarchyMode: "None" },
          columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate']
        },done);
    });

    it('Flat Data Search Mode Testing', (done: Function) => {
      actionComplete = (args?: Object): void => {
         expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML === 'Parent Task 1').toBe(true);
         expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML === 'Parent Task 2').toBe(true);
         done();
      }
      gridObj.search("Parent");
      gridObj.grid.actionComplete = actionComplete;
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Searching Propertychange', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          toolbar: ['Search'],
          allowSorting: true,
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });

    it('searchSettings using onproperty', () => {
      gridObj.searchSettings = { hierarchyMode : "Parent"};
      gridObj.dataBind();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  
  describe('EJ2-23098: Editing with searching ', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionComplete: ()=> void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: newSampledata,
          childMapping: 'Children',
          treeColumnIndex: 1,
          editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            mode: 'Cell',
            newRowPosition: 'Below'
          },
          toolbar: ['Search'],
          columns: [
            { field: 'TaskId', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 80 },
            { field: 'TaskName', headerText: 'Task Name', width: 200 },
            { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' } },
            { field: 'Duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
            { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
          ]

        },
        done
      );
    });

    it('Editing', (done: Function) => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(1, 1).dispatchEvent(event);
      gridObj.actionComplete = (args?: SaveEventArgs): void => {
        expect(args.target.textContent).toBe('SP');
        done();
      };
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'SP';
      gridObj.getRows()[0].click();

    });
    it('Search after editing', (done: Function) => {
      gridObj.grid.actionComplete = (args?: ActionEventArgs) => {
        expect(gridObj.getRows()[1].querySelector('span.e-treecell').innerHTML).toBe('SP');
        done();
      };
      gridObj.search('SP');
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-23097: Records are not properly collapsed after filter/search is performed', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionComplete: ()=> void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: newSampledata,
          childMapping: 'Children',
          treeColumnIndex: 1,
          toolbar: ['Search'],
          columns: [
              { field: 'TaskId', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 80 },
              { field: 'TaskName', headerText: 'Task Name', width: 200 },
              { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' } },
              { field: 'Duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
              { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
          ]
        },
        done
      );
    });

    it('Searching followed by collapsing', () => {
      gridObj.collapseAtLevel(0);
      gridObj.search('Task 1');
      gridObj.expandRow(<HTMLTableRowElement>(gridObj.getRowByIndex(0)));
      (<HTMLElement>(gridObj.getRowByIndex(0).querySelector('.e-treegridexpand'))).click();
      expect((<HTMLElement>(gridObj.getRowByIndex(3))).style.display === 'none').toBe(true);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Search without toolbar', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          columns: ['taskID', 'taskName', 'startDate', 'duration'],
        },
        done
      );
    });
    it('Check the search records without toolbar', (done: Function) => {
        actionComplete = (args?: Object): void => {
         expect(gridObj.getRows()[3].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML  === "Testing").toBe(true);
         expect(gridObj.getRows()[6].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML === "Testing").toBe(true);
         expect(gridObj.getRows()[5].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML === "Implementation Module 2").toBe(true);
         done();
        }
        gridObj.grid.actionComplete = actionComplete;
        gridObj.search("Testing");
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
