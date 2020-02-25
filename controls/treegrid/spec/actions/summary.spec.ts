import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { projectData, sampleData } from '../base/datasource.spec';
import { CustomSummaryType, ActionEventArgs } from '@syncfusion/ej2-grids';
import { Filter } from '../../src/treegrid/actions/filter';
import { Aggregate } from '../../src/treegrid/actions/summary';
import { profile, inMB, getMemoryProfile } from '../common.spec';

/**
 * Grid Summary spec 
 */
TreeGrid.Inject(Aggregate);

describe('Summary module', () => {
  beforeAll(() => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
        console.log("Unsupported environment, window.performance.memory is unavailable");
        this.skip(); //Skips test (in Chai)
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
  
    describe('ChildSummary with type checkbox', () => {
    let TreegridObj: TreeGrid;
    beforeAll((done: Function) => {
      TreegridObj = createGrid(
        {
          dataSource: [ {
            taskID: 1,
            taskName: 'Planning',
            startDate: new Date('02/03/2017'),
            endDate: new Date('02/07/2017'),
            progress: 100,
            duration: 5,
            priority: 'Normal',
            approved: false,
            isInExpandState: true,
            subtasks: [
                { taskID: 2, taskName: 'Plan timeline', startDate: new Date('02/03/2017'), endDate: new Date('02/07/2017'), duration: 5, progress: 100, priority: 'Normal', approved: false },
            ]
        }],
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          aggregates: [{
            showChildSummary: true,
            columns: [{
                type: 'Sum',
                field: 'duration',
                columnName: 'taskName',
                format: 'C2',
                footerTemplate: 'Sum: ${Sum}'
             }]
          }],
          columns: [
            { type: 'checkbox', width: 50},
            { field: 'taskID', headerText: 'Order ID', width: 120 },
            { field: 'taskName', headerText: 'Customer ID', width: 150 },
            { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
            { field: 'progress', headerText: 'Ship Name', width: 150 },
            { field: 'startDate', headerText: 'start Date', type: "datetime", format: 'yMd', width: 150 }
          ]
        },done);
    });
    it('Summary Row Rendering', () => {
       expect(TreegridObj.getRows()[2].cells[0].innerText === '').toBe(true);
       (<HTMLElement>TreegridObj.element.querySelectorAll('.e-row')[0].querySelector('.e-rowcell')).click();
       (<HTMLElement>TreegridObj.element.querySelectorAll('.e-row')[1].querySelector('.e-rowcell')).click();
       expect(TreegridObj.getHeaderTable().querySelector('.e-checkselectall').nextElementSibling.classList.contains('e-check')).toBe(true);
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


