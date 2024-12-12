import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData, projectData, sortData, projectData2 } from '../base/datasource.spec';
import { Sort } from '../../src/treegrid/actions/sort';
import { Page } from '../../src/treegrid/actions/page';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { ITreeData } from '../../src';

/**
 * Grid base spec 
 */
TreeGrid.Inject(Sort, Page, Toolbar);

describe('TreeGrid Sort module', () => {
  beforeAll(() => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
        console.log("Unsupported environment, window.performance.memory is unavailable");
        pending(); //Skips test (in Chai)
        return;
    }
  });

  describe('Flat Data Single Sort Descending', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: projectData,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          treeColumnIndex: 1,
          allowSorting: true,
          allowMultiSorting: true,
          columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate']
        },done);
    });

    it('expand testing', (done: Function) => {
      actionComplete = (args?: Object): void => {
         expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Parent Task 2").toBe(true);
         expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Child Task 1").toBe(true);
         expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[0].innerHTML == "3").toBe(true);
         expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[0].innerHTML == "4").toBe(true);
         expect(gridObj.parentData.length).toBe(2);
         done();
      }
      gridObj.grid.actionComplete = actionComplete;
      gridObj.sortByColumn("TaskName", "Descending", true);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
});

describe('Flat Data Single Sort Ascending', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: projectData,
        idMapping: 'TaskID',
        parentIdMapping: 'parentID',
        treeColumnIndex: 1,
        allowSorting: true,
        columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate']
      },done);
  });

  it('expand testing', (done: Function) => {
    actionComplete = (args?: Object): void => {
       expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Parent Task 1").toBe(true);
       expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Child Task 1").toBe(true);
       expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[0].innerHTML == "1").toBe(true);
       expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[0].innerHTML == "2").toBe(true);
       expect(gridObj.parentData.length).toBe(2);
       done();
    }
    gridObj.sortByColumn("TaskName", "Ascending", true);
    gridObj.grid.actionComplete = actionComplete;
    gridObj.clearSorting();
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('Hierarchy data Single sort Ascending', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        allowSorting: true,
        columns: ['taskID', 'taskName', 'startDate', 'endDate']
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

describe('Multi sort Ascending', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        allowSorting: true,
        columns: ['taskID', 'taskName', 'startDate', 'endDate']
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

describe('Single sort Descending', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        allowSorting: true,
        columns: ['taskID', 'taskName', 'startDate', 'endDate']
      },done);
  });

  it('expand testing', (done: Function) => {
    actionComplete = (args?: Object): void => {
       expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Planning").toBe(true);
       expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Planning complete").toBe(true);
       expect(gridObj.getRows()[8].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Testing").toBe(true);
       expect(gridObj.getRows()[9].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Phase 3 complete").toBe(true);
       expect(gridObj.getRows()[16].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Testing").toBe(true);
       expect(gridObj.getRows()[30].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Design").toBe(true);
       done();
    }
    gridObj.sortByColumn("taskName", "Descending", true);
    gridObj.grid.actionComplete = actionComplete;
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('Sorting Propertychange', () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
      },
      done
    );
  });

  it('allowSorting and sortSettings using onproperty', () => {
    gridObj.allowSorting = true;
    gridObj.allowMultiSorting = true;
    gridObj.sortSettings = { columns: [{ field: 'taskName', direction: 'Descending' }] };
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('Remove Sort Column', () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        allowSorting: true,
        columns: ['taskID', 'taskName', 'startDate', 'endDate']
      },done);
  });

  it('Remove Sorting', () => {
    gridObj.sortByColumn("taskName", "Descending", true);
    gridObj.removeSortColumn('taskName');
    expect(gridObj.sortSettings.columns.length).toBe(0);
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('Sorting with Sort comparer property functionality checking', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  let called: boolean = false;
  let sortComparer: (reference: string, comparer: string) => number = (reference: string,
    comparer: string) => {
    called = true;
    if (reference < comparer) {
      return -1;
    }
    if (reference > comparer) {
      return 1;
    }
    return 0;
  };
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        allowSorting: true,
        treeColumnIndex: 1,
        allowPaging: true,
        columns: [
          { field: 'taskID', }, { field: 'taskName', sortComparer: sortComparer, }, { field: 'startDate' }, { field: 'endDate' },
          { field: 'duration' },]
      }, done);
  });

  it('Sorting with sortComparer property', (done: Function) => {
    actionComplete = (args?: any): void => {
      expect(called).toBe(true);
      expect(args.rows[0].data.taskName === "Planning").toBe(true);
      expect(args.direction === "Descending").toBe(true);
      expect(args.rows[6].data.taskName === "Phase 3").toBe(true);
      expect(args.rows[5].data.taskName === "Implementation Phase").toBe(true);
      gridObj.actionComplete = null;
      done();
    }
    gridObj.actionComplete = actionComplete;
    gridObj.sortByColumn("taskName", "Descending", false);
  });
  afterAll(() => {
    destroy(gridObj);
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

describe('EJ2-25219: Updating datasource dynamically after performing sorting is not working', () => {
    let gridObj: TreeGrid;
    let actionComplete: ()=> void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowSorting: true,
          sortSettings: {columns: [{field: 'taskName', direction: 'Ascending'}]},
          toolbar: ['Search'],
          columns: [
              { field: 'taskId', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 80 },
              { field: 'taskName', headerText: 'Task Name', width: 200 },
              { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' } },
              { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
              { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
          ]
        },
        done
      );
    });
    it('Datasource update with Sorting', (done: Function)  => {
      actionComplete = (args?: Object): void => {
        expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Implementation Phase").toBe(true);
        done();
    }
    gridObj.grid.dataBound = actionComplete;
    gridObj.dataSource = sampleData.slice(2);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

describe('EJ2-32541 - Issue in MultiSorting Sample', () => {
  let gridObj: TreeGrid;
  let actionComplete: ()=> void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sortData,
        childMapping: 'subtasks',
        treeColumnIndex: 0,
        allowSorting: true,
        columns: [
          { field: 'orderName', headerText: 'Order Name', width: 200 },
          { field: 'Category', headerText: 'Category', width: 140 },
          { field: 'orderDate', headerText: 'Order Date', width: 150, textAlign: 'Right', format: 'yMd', type: 'date' },
          { field: 'units', headerText: 'Units', width: 110, textAlign: 'Right' }
        ],
        sortSettings: { columns: [{ field: 'Category', direction: 'Ascending' }, { field: 'orderName', direction: 'Ascending' }] }
      },
      done
    );
  });
  it('Datasource update with Sorting', (done: Function)  => {
    actionComplete = (args?: Object): void => {
      expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].innerHTML == "Seafoods").toBe(true);
      done();
    }
    let event: MouseEvent = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    gridObj.actionComplete = actionComplete;
    gridObj.getHeaderTable().querySelectorAll('.e-sortnumber')[1].dispatchEvent(event);
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('EJ2-57928 - Sorting with Descending order does not work in case of SortComparer with uid property enabled', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  let called: boolean = false;
  let sortComparer: (reference: string, comparer: string) => number = (reference: string,
  comparer: string) => {
  called = true;
  if (reference < comparer) {
    return -1;
  }
  if (reference > comparer) {
    return 1;
  }
  return 0;
};
beforeAll((done: Function) => {
  gridObj = createGrid(
    {
      dataSource: projectData2,
        idMapping: 'TaskID',
        parentIdMapping: 'parentID',
        allowSorting: true,
        treeColumnIndex: 1,
        columns: [
          { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 140 },
          { field: 'TaskName', headerText: 'Task Name', width: 160, uid:'TaskID', sortComparer:sortComparer },
          { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120, format: { skeleton: 'yMd', type: 'date' }},
          { field: 'EndDate', headerText: 'End Date', textAlign: 'Right', width: 120, format: { skeleton: 'yMd', type: 'date' }},
          { field: 'Duration', headerText: 'Duration', textAlign: 'Right', width: 110},
          { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 110},
          { field: 'Priority', headerText: 'Priority', width: 110}]
    }, done);
});

  it('Sorting in Descending order with sortComparer property', (done: Function)  => {
    actionComplete = (args?: any): void => {
      expect((gridObj.getCurrentViewRecords()[0] as ITreeData).index === 9).toBe(true);
      gridObj.actionComplete = null;
      done();
    }
    gridObj.actionComplete = actionComplete;
    gridObj.sortByColumn("TaskName", "Descending", false);
    done();
  });
  afterAll(() => {
    destroy(gridObj);
  });
});
