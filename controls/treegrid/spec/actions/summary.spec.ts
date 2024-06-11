import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { projectData, sampleData, summaryRowData, selectSummaryRowData } from '../base/datasource.spec';
import { CustomSummaryType, ActionEventArgs } from '@syncfusion/ej2-grids';
import { DataManager, RemoteSaveAdaptor } from '@syncfusion/ej2-data';
import { Filter } from '../../src/treegrid/actions/filter';
import { Aggregate } from '../../src/treegrid/actions/summary';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { Page } from '../../src/treegrid/actions/page';

/**
 * Grid Summary spec 
 */
TreeGrid.Inject(Aggregate, Toolbar, Filter, Page);

describe('Summary module', () => {
  beforeAll(() => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
        console.log("Unsupported environment, window.performance.memory is unavailable");
        pending(); //Skips test (in Chai)
        return;
    }
  });

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

describe('ExpandCollapse testing with Child Summary and without paging', () => {
  let TreegridObj: TreeGrid;
  TreeGrid.Inject(Filter);
  beforeAll((done: Function) => {
    TreegridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        aggregates: [{
          columns: [
            {
              type: 'Max',
              field: 'progress',
              columnName: 'progress',
              footerTemplate: 'Maximum: ${Max}'
            },
            {
              type: 'Min',
              field: 'duration',
              columnName: 'Duration',
              footerTemplate: 'Minimum: ${Min}'
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
  it('Collapsing using collapseRow method', () => {
    TreegridObj.collapseRow(null, TreegridObj.flatData[11]);
    let rows: Element[];
    rows = TreegridObj.getRows();
    expect((rows[14] as HTMLTableRowElement).style.display).toBe('none');
    expect((rows[15] as HTMLTableRowElement).style.display).toBe('none');
    expect((rows[16] as HTMLTableRowElement).style.display).toBe('none');
    expect((rows[44] as HTMLTableRowElement).style.display).toBe('none');               
  });
  it('Expanding using expandRow method', () => {
    TreegridObj.expandRow(null, TreegridObj.flatData[11]);
    let rows: Element[];
    rows = TreegridObj.getRows();
    expect((rows[14] as HTMLTableRowElement).style.display).toBe('table-row');
    expect((rows[15] as HTMLTableRowElement).style.display).toBe('table-row');
    expect((rows[16] as HTMLTableRowElement).style.display).toBe('table-row');
    expect((rows[44] as HTMLTableRowElement).style.display).toBe('table-row');              
  });
  it('Collapsing using collapseAll method', () => {
    TreegridObj.collapseAll();
    let rows: Element[];
    rows = TreegridObj.getRows();
    expect((rows[1] as HTMLTableRowElement).style.display).toBe('none');
    expect((rows[5] as HTMLTableRowElement).style.display).toBe('none');
    expect((rows[7] as HTMLTableRowElement).style.display).toBe('none');
    expect((rows[12] as HTMLTableRowElement).style.display).toBe('none');      
    expect((rows[14] as HTMLTableRowElement).style.display).toBe('none');
    expect((rows[15] as HTMLTableRowElement).style.display).toBe('none');
    expect((rows[16] as HTMLTableRowElement).style.display).toBe('none');
    expect((rows[22] as HTMLTableRowElement).style.display).toBe('none');
    expect((rows[23] as HTMLTableRowElement).style.display).toBe('none');
    expect((rows[42] as HTMLTableRowElement).style.display).toBe('none');
    expect((rows[43] as HTMLTableRowElement).style.display).toBe('none');
  });
  it('Expanding using expandAll method', () => {
    TreegridObj.expandAll();
    let rows: Element[];
    rows = TreegridObj.getRows();
    expect((rows[1] as HTMLTableRowElement).style.display).toBe('table-row');
    expect((rows[5] as HTMLTableRowElement).style.display).toBe('table-row');
    expect((rows[7] as HTMLTableRowElement).style.display).toBe('table-row');
    expect((rows[12] as HTMLTableRowElement).style.display).toBe('table-row');      
    expect((rows[14] as HTMLTableRowElement).style.display).toBe('table-row');
    expect((rows[15] as HTMLTableRowElement).style.display).toBe('table-row');
    expect((rows[16] as HTMLTableRowElement).style.display).toBe('table-row');
    expect((rows[22] as HTMLTableRowElement).style.display).toBe('table-row');
    expect((rows[23] as HTMLTableRowElement).style.display).toBe('table-row');
    expect((rows[32] as HTMLTableRowElement).style.display).toBe('table-row');
    expect((rows[33] as HTMLTableRowElement).style.display).toBe('table-row');
    expect((rows[42] as HTMLTableRowElement).style.display).toBe('table-row');
    expect((rows[43] as HTMLTableRowElement).style.display).toBe('table-row');
    expect((rows[44] as HTMLTableRowElement).style.display).toBe('table-row');
  });
  it('collapseAtLevel and expandAtLevel testing', function () {
    TreegridObj.collapseAtLevel(1);
    expect(TreegridObj.getRows()[13].querySelectorAll('.e-treegridcollapse').length).toBe(0);
    expect(TreegridObj.getRows()[14].querySelectorAll('.e-treegridcollapse').length).toBe(1);
    expect(TreegridObj.getRows()[24].querySelectorAll('.e-treegridcollapse').length).toBe(1);
    expect(TreegridObj.getRows()[34].querySelectorAll('.e-treegridcollapse').length).toBe(1);
    TreegridObj.expandAtLevel(1);
    expect(TreegridObj.getRows()[14].querySelectorAll('.e-treegridexpand').length).toBe(1);
    expect(TreegridObj.getRows()[24].querySelectorAll('.e-treegridexpand').length).toBe(1);
    expect(TreegridObj.getRows()[34].querySelectorAll('.e-treegridexpand').length).toBe(1);
    expect(TreegridObj.getDataModule()).toBeDefined();
});
  afterAll(() => {
    destroy(TreegridObj);
  });
});

describe('ExpandCollapse testing with Child Summary and with paging', () => {
  let TreegridObj: TreeGrid;
  TreeGrid.Inject(Filter);
  beforeAll((done: Function) => {
    TreegridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        allowPaging: true,
        aggregates: [{
          columns: [
            {
              type: 'Max',
              field: 'progress',
              columnName: 'progress',
              footerTemplate: 'Maximum: ${Max}'
            },
            {
              type: 'Min',
              field: 'duration',
              columnName: 'Duration',
              footerTemplate: 'Minimum: ${Min}'
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
  it('Collapsing using collapseRow method', () => {
    TreegridObj.collapseRow(null, TreegridObj.flatData[5]);
    let rows: Element[];
    rows = TreegridObj.getRows();
    expect((rows[6] as HTMLTableRowElement).querySelectorAll('.e-treegridexpand').length).toBe(0);
  });
  it('Expanding using expandRow method', () => {
    TreegridObj.expandRow(null, TreegridObj.flatData[5]);
    let rows: Element[];
    rows = TreegridObj.getRows();
    expect((rows[6] as HTMLTableRowElement).querySelectorAll('.e-treegridexpand').length).toBe(1);      
  });
  it('Collapsing using collapseAll method', () => {
    TreegridObj.collapseAll();
    let rows: Element[];
    rows = TreegridObj.getRows();
    expect((rows[0] as HTMLTableRowElement).querySelectorAll('.e-treegridexpand').length).toBe(0);
    expect((rows[1] as HTMLTableRowElement).querySelectorAll('.e-treegridexpand').length).toBe(0)
    expect((rows[2] as HTMLTableRowElement).querySelectorAll('.e-treegridexpand').length).toBe(0)
  });
  it('Expanding using expandAll method', () => {
    TreegridObj.expandAll();
    let rows: Element[];
    rows = TreegridObj.getRows();
    expect((rows[0] as HTMLTableRowElement).querySelectorAll('.e-treegridexpand').length).toBe(1);    
    expect((rows[6] as HTMLTableRowElement).querySelectorAll('.e-treegridexpand').length).toBe(1);      
  });
  it('collapseAtLevel and expandAtLevel testing', function () {
    TreegridObj.goToPage(2);
    TreegridObj.collapseAtLevel(1);
    expect(TreegridObj.getRows()[1].querySelectorAll('.e-treegridcollapse').length).toBe(0);
    expect(TreegridObj.getRows()[2].querySelectorAll('.e-treegridcollapse').length).toBe(1);
    expect(TreegridObj.getRows()[3].querySelectorAll('.e-treegridcollapse').length).toBe(1);
    expect(TreegridObj.getRows()[4].querySelectorAll('.e-treegridcollapse').length).toBe(1);
    TreegridObj.expandAtLevel(1);
    expect(TreegridObj.getRows()[2].querySelectorAll('.e-treegridexpand').length).toBe(1);
    expect(TreegridObj.getRows()[3].querySelectorAll('.e-treegridexpand').length).toBe(1);
    expect(TreegridObj.getDataModule()).toBeDefined();
});
  afterAll(() => {
    destroy(TreegridObj);
  });
});

describe(' Total Summary format', () => {
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
              columnName: 'duration',
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
  it('Summary Row format', () => {
     expect(!TreegridObj.getRows()[5].classList.contains(".e-summaryrow")).toBe(true);
     expect(TreegridObj.getFooterContent()).not.toBeNull();
     expect(TreegridObj.element.getElementsByClassName('e-gridfooter')[0].getElementsByTagName('tfoot')[0].querySelector('.e-templatecell').innerHTML === "Sum: $150.00").toBe(true);
    });
  afterAll(() => {
    destroy(TreegridObj);
  });
});

describe(' Summary row format', () => {
  let TreegridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreegridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        aggregates: [{
          showChildSummary: true,
          columns: [{
              type: 'Sum',
              field: 'duration',
              columnName: 'duration',
              format: 'C2',
              footerTemplate: 'Sum: ${Sum}'
           }]
        },
      {
        showChildSummary: false,
        columns: [{     
            type: 'Max',
            field: 'progress',
            columnName: 'progress',
            footerTemplate: 'Maximum: ${Max}'
         }]
      }
      ],
        columns: [
          { field: 'taskID', headerText: 'Order ID', width: 120 },
          { field: 'taskName', headerText: 'Customer ID', width: 150 },
          { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
          { field: 'progress', headerText: 'Ship Name',type: "number", width: 150 },
          { field: 'startDate', headerText: 'start Date', type: "datetime", format: 'yMd', width: 150 }
        ]
      },done);
  });

  it('Summary row format', () => {
    expect(TreegridObj.element.getElementsByClassName('e-gridfooter')[0].getElementsByTagName('tfoot')[0].querySelector('.e-templatecell').innerHTML === "Sum: $150.00").toBe(true);
    });
  afterAll(() => {
    destroy(TreegridObj);
  });
});

describe('Summary row Rendering ', () => {
  let TreegridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreegridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        columns: ['taskID', 'taskName', 'progress','duration'],
        aggregates: [{
          showChildSummary: false,
          columns: [{
              type: 'Sum',
              field: 'duration',
              columnName: 'duration',
              footerTemplate: 'Sum: ${Sum}'
           }]
        }]
      },done);
  });

  it('Summary Row Rendering', () => {
    expect(TreegridObj.element.getElementsByClassName('e-gridfooter')[0].getElementsByTagName('tfoot')[0].querySelector('.e-templatecell').innerHTML === "Sum: 150").toBe(true);
  });
  afterAll(() => {
    destroy(TreegridObj);
  });
});

describe(' Summary format', () => {
  let TreegridObj: TreeGrid;
  let data: DataManager = new DataManager({
    json: sampleData,
    adaptor: new RemoteSaveAdaptor 
});
  beforeAll((done: Function) => {
    TreegridObj = createGrid(
      {
        dataSource: data,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        aggregates: [{
          showChildSummary: false,
          columns: [{
              type: 'Max',
              field: 'duration',
              columnName: 'duration',
              format: 'C2',
              footerTemplate: 'Max: ${Max}'
           }]
        },
      ],
        columns: [
          { field: 'taskID', headerText: 'Order ID', width: 120 },
          { field: 'taskName', headerText: 'Customer ID', width: 150 },
          { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
          { field: 'progress', headerText: 'Ship Name',type: "number", width: 150 },
          { field: 'startDate', headerText: 'start Date', type: "datetime", format: 'yMd', width: 150 }
        ]
      },done);
  });

  it('Summary format', () => {
    expect(TreegridObj.element.getElementsByClassName('e-gridfooter')[0].getElementsByTagName('tfoot')[0].querySelector('.e-templatecell').innerHTML === "Max: $11.00").toBe(true);
    });
  afterAll(() => {
    destroy(TreegridObj);
  });
});

describe('Summary with child aggregate value and also with stacked header ', () => {
  let TreegridObj: TreeGrid;
  TreeGrid.Inject(Filter);
  beforeAll((done: Function) => {
    TreegridObj = createGrid(
      {
        dataSource: summaryRowData,
        childMapping: 'children',
        treeColumnIndex: 0,
        height: 260,
        columns: [
            {
                headerText: 'Order Details', textAlign: 'Center', columns: [
            { field: 'FreightID', headerText: 'Freight ID', width: 130 },
            { field: 'FreightName', width: 195, headerText: 'Freight Name' },
        ]
    },
    {
        headerText: 'Shipment Details', textAlign: 'Center', columns: [
            { field: 'UnitWeight', headerText: 'Weight Per Unit', type: 'number', width: 130, textAlign: 'Right' },
            { field: 'TotalUnits', headerText: 'Total Units', type: 'number', width: 125, textAlign: 'Right' }
    ]
    },
        ],
        aggregates: [{
            showChildSummary: true,
            columns: [
                {
                    type: 'Max',
                    field: 'UnitWeight',
                    columnName: 'UnitWeight',
                    footerTemplate: 'Maximum: ${Max}'
                },
                {
                type: 'Min',
                field: 'TotalUnits',
                columnName: 'TotalUnits',
                footerTemplate: 'Minimum: ${Min}'
            }]
        }]
      },done);
  });

  it('Summary Row Rendering', () => {
    expect(TreegridObj.getFooterContent()).not.toBeNull();
    expect((TreegridObj.getRows()[5].children[2] as HTMLElement).innerText === "Maximum: 87");
  });
  afterAll(() => {
    destroy(TreegridObj);
  });
});

describe('833721 - Resolved Child aggregates row displays in current view records. ', () => {
  let TreegridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreegridObj = createGrid(
      {
        dataSource: summaryRowData,
        childMapping: 'children',
        treeColumnIndex: 0,
        height: 260,
        columns: [
            { field: 'FreightID', headerText: 'Freight ID', width: 130 },
            { field: 'FreightName', width: 195, headerText: 'Freight Name' },
            { field: 'UnitWeight', headerText: 'Weight Per Unit', type: 'number', width: 130, textAlign: 'Right' },
            { field: 'TotalUnits', headerText: 'Total Units', type: 'number', width: 125, textAlign: 'Right' }
        ],
        aggregates: [{
            showChildSummary: true,
            columns: [
                {
                    type: 'Max',
                    field: 'UnitWeight',
                    columnName: 'UnitWeight',
                    footerTemplate: 'Maximum: ${Max}'
                },
                {
                type: 'Min',
                field: 'TotalUnits',
                columnName: 'TotalUnits',
                footerTemplate: 'Minimum: ${Min}'
            }]
        }]
      },done);
  });

  it('Check current view data length', () => {
    expect(TreegridObj.getCurrentViewRecords().length === 15);
  });
  afterAll(() => {
    destroy(TreegridObj);
  });
});

describe('844323 - Resolved header checkbox selection issue when child aggregate enabled. ', () => {
  let TreegridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreegridObj = createGrid(
      {
        dataSource: selectSummaryRowData,
        childMapping: 'children',
        treeColumnIndex: 0,
        height: 260,
        columns: [
          { type: 'checkbox', width: 60 },
            { field: 'FreightID', headerText: 'Freight ID', width: 130 },
            { field: 'FreightName', width: 195, headerText: 'Freight Name' },
            { field: 'UnitWeight', headerText: 'Weight Per Unit', type: 'number', width: 130, textAlign: 'Right' },
            { field: 'TotalUnits', headerText: 'Total Units', type: 'number', width: 125, textAlign: 'Right' }
        ],
        aggregates: [{
            showChildSummary: true,
            columns: [
                {
                    type: 'Max',
                    field: 'UnitWeight',
                    columnName: 'UnitWeight',
                    footerTemplate: 'Maximum: ${Max}'
                },
                {
                type: 'Min',
                field: 'TotalUnits',
                columnName: 'TotalUnits',
                footerTemplate: 'Minimum: ${Min}'
            }]
        }]
      },done);
  });

  it('Check headerCheckbox selection', () => {
    (<HTMLElement>TreegridObj.element.querySelectorAll('.e-row')[1].querySelector('.e-rowcell')).click();
    (<HTMLElement>TreegridObj.element.querySelectorAll('.e-row')[2].querySelector('.e-rowcell')).click();
    expect((document.getElementsByClassName("e-checkselectall")[0] as HTMLInputElement).checked === true);
  });
  afterAll(() => {
    destroy(TreegridObj);
  });
});

describe('Child summary after cell editing ', () => {
  let TreegridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreegridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            mode: 'Cell',
            newRowPosition: 'Below'
        },
        columns: [
        {
            field: 'FreightID',
            headerText: 'Freight ID',
            isPrimaryKey: true,
            width: 130
        },
        { field: 'FreightName', width: 200, headerText: 'Freight Name' },
        {
            field: 'UnitWeight',
            headerText: 'Weight Per Unit',
            type: 'number',
            width: 140,
            textAlign: 'Right'
        },
        {
            field: 'TotalUnits',
            headerText: 'Total Units',
            type: 'number',
            width: 140,
            textAlign: 'Right'
        }
        ],
        aggregates: [
        {
            showChildSummary: true,
            columns: [
                {
                    type: 'Sum',
                    field: 'UnitWeight',
                    columnName: 'UnitWeight',
                    footerTemplate: 'Sum: ${Sum}'
                }
            ]
          }]
      },done);
  });

  it('Child summary Row Rendering', () => {
    (TreegridObj.getRows()[1].children[2] as HTMLElement).innerHTML = "51";
    expect((TreegridObj.getRows()[5].children[2] as HTMLElement).innerText === "Sum: 242");
  });
  afterAll(() => {
    destroy(TreegridObj);
  });
});
