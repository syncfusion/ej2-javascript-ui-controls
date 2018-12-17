import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData, projectData } from '../base/datasource.spec';
import { Filter } from '../../src/treegrid/actions/filter';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
/**
 * Grid base spec 
 */
TreeGrid.Inject(Filter, Toolbar);
describe('Search module', () => {
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
});
