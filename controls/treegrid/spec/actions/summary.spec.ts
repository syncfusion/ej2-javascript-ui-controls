import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { projectData, sampleData } from '../base/datasource.spec';
import { CustomSummaryType, ActionEventArgs } from '@syncfusion/ej2-grids';
import { Filter } from '../../src/treegrid/actions/filter';
import { Aggregate } from '../../src/treegrid/actions/summary';

/**
 * Grid Summary spec 
 */
TreeGrid.Inject(Aggregate);

describe('Summary module', () => {
  describe('Hierarchy Data with summary', () => {
    let TreegridObj: TreeGrid;
    beforeAll((done: Function) => {
      TreegridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          columns: [
            { field: 'taskID', headerText: 'Order ID', width: 120 },
            { field: 'taskName', headerText: 'Customer ID', width: 150 },
            { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
            { field: 'progress', headerText: 'Ship Name', width: 150 },
            { field: 'startDate', headerText: 'start Date', type: "date", format: 'yMd', width: 150 }
          ],
          aggregates: [{
            columns: [{
               type: 'Sum',
               field: 'duration',
               columnName: 'taskName',
               format: 'C2',
               footerTemplate: 'Sum: ${Sum}'
            }, {
               type: 'Max',
               field: 'startDate',
               columnName: 'startDate',
               format: 'yMd',
               footerTemplate: '${Max}'
            }]
          }]
        },done);
    });
    it('Summary Row Rendering', () => {
       expect(TreegridObj.getRows()[5].getElementsByClassName('e-rowcell')[1].
           querySelector("div>.e-treecell").innerHTML === 'Sum: $15.00').toBe(true);
       expect(TreegridObj.getRows()[12].getElementsByClassName('e-rowcell')[1].
           querySelector("div>.e-treecell").innerHTML === 'Sum: $10.00').toBe(true);
       expect(TreegridObj.getRows()[12].getElementsByClassName('e-summarycell').length > 0).toBe(true);
       expect(TreegridObj.getRows()[12].classList.contains("e-summaryrow")).toBe(true);
    });
    afterAll(() => {
      destroy(TreegridObj);
    });
  });

  describe('Summary for Flat Data', () => {
    let TreegridObj: TreeGrid;
    beforeAll((done: Function) => {
      TreegridObj = createGrid(
        {
          dataSource: projectData,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          treeColumnIndex: 1,
          columns: ['TaskID', 'TaskName', 'Progress',],
          aggregates: [{
            columns: [{
                type: 'Sum',
                field: 'TaskID',
                columnName: 'TaskName',
                footerTemplate: 'Sum: ${Sum}'
             }]
          }]
        },done);
    });

    it('Summary Row Rendering', () => {
      expect(TreegridObj.getRows()[2].getElementsByClassName('e-rowcell')[1].
          querySelector("div>.e-treecell").innerHTML === 'Sum: 2').toBe(true);
      expect(TreegridObj.getRows()[5].getElementsByClassName('e-rowcell')[1].
          querySelector("div>.e-treecell").innerHTML === 'Sum: 4').toBe(true);
      expect(TreegridObj.getFooterContent()).not.toBeNull();
      expect(TreegridObj.getFooterContentTable()).not.toBeNull();
    });
    afterAll(() => {
      destroy(TreegridObj);
    });
  });

describe('Custom Summary', () => {
  let TreegridObj: TreeGrid;
  let customCount: CustomSummaryType = (data: Object) => 5;
  beforeAll((done: Function) => {
    TreegridObj = createGrid(
      {
        dataSource: projectData,
        idMapping: 'TaskID',
        parentIdMapping: 'parentID',
        treeColumnIndex: 1,
        columns: ['TaskID', 'TaskName', 'Progress',],
        aggregates: [{
          columns: [{
             type: 'Custom',
             customAggregate: customCount,
             columnName: 'TaskName',
             footerTemplate: 'Sum: ${Custom}'
           }]
        }]
      },done);
  });
  it('Summary Row Rendering', () => {
    expect(TreegridObj.getRows()[2].getElementsByClassName('e-rowcell')[1].
        querySelector("div>.e-treecell").innerHTML === 'Sum: 5').toBe(true);
  });
  afterAll(() => {
    destroy(TreegridObj);
  });
});

describe('Summary with Sorting', () => {
  let TreegridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreegridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        allowSorting: true,
        sortSettings: { columns: [{ field : "taskName", direction: "Ascending"}] },
        columns: [
          { field: 'taskID', headerText: 'Order ID', width: 120 },
          { field: 'taskName', headerText: 'Customer ID', width: 150 },
          { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
          { field: 'progress', headerText: 'Ship Name', width: 150 },
          { field: 'startDate', headerText: 'start Date', type: "datetime", format: 'yMd', width: 150 }
      ],
      aggregates: [{
        columns: [{
           type: 'Sum',
           field: 'duration',
           columnName: 'taskName',
           footerTemplate: 'Sum: ${Sum}'
          }, {
            type: 'Max',
            field: 'startDate',
            columnName: 'startDate',
            format: 'yMd',
            footerTemplate: '${Max}'
         }]
        }]
      },done);
    });
  it('Summary Row Rendering', () => {
    expect(TreegridObj.getRows()[6].getElementsByClassName('e-rowcell')[1].
        querySelector("div>.e-treecell").innerHTML === 'Sum: 10').toBe(true);
    expect(TreegridObj.getRows()[16].getElementsByClassName('e-rowcell')[1].
        querySelector("div>.e-treecell").innerHTML === 'Sum: 12').toBe(true);
  });
  afterAll(() => {
    destroy(TreegridObj);
  });
});

  describe('Summary with setModel', () => {
    let TreegridObj: TreeGrid;
    beforeAll((done: Function) => {
      TreegridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          columns: [
            { field: 'taskID', headerText: 'Order ID', width: 120 },
            { field: 'taskName', headerText: 'Customer ID', width: 150 },
            { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
            { field: 'progress', headerText: 'Ship Name', width: 150 },
            { field: 'startDate', headerText: 'start Date', type: "datetime", format: 'yMd', width: 150 }
          ]
        },done);
    });
    it('Summary Row Rendering', () => {
        TreegridObj.aggregates = [{
          columns: [{
            type: 'Sum',
            field: 'duration',
            columnName: 'taskName',
            footerTemplate: 'Sum: ${Sum}'
         }]
       }];
       expect(TreegridObj.getFooterContent()).not.toBeNull();
    });
    afterAll(() => {
      destroy(TreegridObj);
    });
  });

  describe('Hierarchy Data only with total Summary', () => {
    let TreegridObj: TreeGrid;
    beforeAll((done: Function) => {
      TreegridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          aggregates: [{
            showChildSummary: false,
            columns: [{
                type: 'Sum',
                field: 'duration',
                columnName: 'taskName',
                format: 'C2',
                footerTemplate: 'Sum: ${Sum}'
             }]
          }],
          columns: [
            { field: 'taskID', headerText: 'Order ID', width: 120 },
            { field: 'taskName', headerText: 'Customer ID', width: 150 },
            { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
            { field: 'progress', headerText: 'Ship Name', width: 150 },
            { field: 'startDate', headerText: 'start Date', type: "datetime", format: 'yMd', width: 150 }
          ]
        },done);
    });
    it('Summary Row Rendering', () => {
       expect(!TreegridObj.getRows()[5].classList.contains(".e-summaryrow")).toBe(true);
       expect(TreegridObj.getFooterContent()).not.toBeNull();
    });
    afterAll(() => {
      destroy(TreegridObj);
    });
  });

  describe('Summary with filtering', () => {
    let TreegridObj: TreeGrid;
    TreeGrid.Inject(Filter);
    beforeAll((done: Function) => {
      TreegridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowFiltering: true,
          filterSettings : { hierarchyMode: "Parent", columns: [{ field: "taskName", value: "Testing", operator: 'startswith'}]},
          aggregates: [{
            columns: [{
                type: 'Sum',
                field: 'duration',
                columnName: 'taskName',
                footerTemplate: 'Sum: ${Sum}'
             }]
          }],
          columns: [
            { field: 'taskID', headerText: 'Order ID', width: 120 },
            { field: 'taskName', headerText: 'Customer ID', width: 150 },
            { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
            { field: 'progress', headerText: 'Ship Name', width: 150 },
            { field: 'startDate', headerText: 'start Date', type: "datetime", format: 'yMd', width: 150 }
          ]
        },done);
    });
    it('Summary Row Rendering', () => {
      expect(TreegridObj.getRows()[4].getElementsByClassName('e-rowcell')[1].
        querySelector("div>.e-treecell").innerHTML === 'Sum: 2').toBe(true);
      expect(TreegridObj.getRows()[5].getElementsByClassName('e-rowcell')[1].
        querySelector("div>.e-treecell").innerHTML === 'Sum: 13').toBe(true);
    });
    afterAll(() => {
      destroy(TreegridObj);
    });
  });

  describe('Summary with Searching', () => {
    let TreegridObj: TreeGrid;
    TreeGrid.Inject(Filter);
    beforeAll((done: Function) => {
      TreegridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          toolbar: ['Search'],
          aggregates: [{
            columns: [{
                type: 'Sum',
                field: 'duration',
                columnName: 'taskName',
                footerTemplate: 'Sum: ${Sum}'
             }]
          }],
          columns: [
            { field: 'taskID', headerText: 'Order ID', width: 120 },
            { field: 'taskName', headerText: 'Customer ID', width: 150 },
            { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
            { field: 'progress', headerText: 'Ship Name', width: 150 },
            { field: 'startDate', headerText: 'start Date', type: "datetime", format: 'yMd', width: 150 }
          ]
        },done);
    });
    it('Summary Row Rendering', () => {
      TreegridObj.actionComplete = (args?: ActionEventArgs) => {
        expect(TreegridObj.getCurrentViewRecords().length === 3).toBe(true);
      }
      TreegridObj.search('timeline');
    });
    afterAll(() => {
      destroy(TreegridObj);
    });
  });
});


