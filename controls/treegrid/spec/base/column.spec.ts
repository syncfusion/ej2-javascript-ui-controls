import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from './treegridutil.spec';
import { sampleData, projectData, stackedData } from './datasource.spec';
import { PageEventArgs, QueryCellInfoEventArgs, doesImplementInterface, RowDataBoundEventArgs } from '@syncfusion/ej2-grids';
import { Column, ColumnModel } from '../../src';
import { ITreeData } from '../../src/treegrid/base/interface';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { ColumnChooser } from '../../src/treegrid/actions/column-chooser';
import { select } from '@syncfusion/ej2-base';

/**
 * Grid Column spec 
 */
TreeGrid.Inject(ColumnChooser);
describe('TreeGrid Column Module', () => {
  beforeAll(() => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
        console.log("Unsupported environment, window.performance.memory is unavailable");
        this.skip(); //Skips test (in Chai)
        return;
    }
  });

  describe('conditional formatting - queryCellInfo and rowdatabound', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
          queryCellInfo: (args: QueryCellInfoEventArgs) => {
            if (args.column.field === 'taskID') {
              (<HTMLTableCellElement>args.cell).style.color = 'red';
            }
          },
          rowDataBound: (args: RowDataBoundEventArgs) => {
              (<HTMLTableRowElement>args.row).cells[2].style.color = 'yellow';
          }
        },
        done
      );
    });
    it('querycell', () => {
      rows = gridObj.getRows();
      expect((rows[1] as HTMLTableRowElement).cells[0].style.color).toBe('red');
      expect((rows[1] as HTMLTableRowElement).cells[2].style.color).toBe('yellow');
        });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Autogenerate columns - Hierarchy', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          dataBound: (args: Object) => {
            rows = this.getRows();
            expect(rows.length).toBeGreaterThan(0);
            expect(this.columns.length).toBe(8);
            done();
          }
        },
        done
      );
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Autogenerate columns - SelfReference', () => {
    let gridInstance: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridInstance = createGrid(
        {
          dataSource: projectData,
          childMapping: 'subtasks',
          idMapping: 'TaskID',
          parentIdMapping: 'parentID'
        },
        done
      );
    });
    it('empty columns', () => {
      rows = gridInstance.getRows();
      expect(rows.length).toBeGreaterThan(0);
      expect(gridInstance.columns.length).toBe(5);
    });
    afterAll(() => {
      destroy(gridInstance);
      gridInstance = null;
    });
  });
  describe('columns method', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          columns: [{field: 'taskID', headerText: 'Task ID'},
          {field: 'taskName', headerText: 'Task Name'},
          {field: 'startDate', headerText: 'Start Date'},
          {field: 'progress', headerText: 'Progress'}
        ]
        },
        done
      );
    });
    it('column methods', () => {
      expect(gridObj.getCellFromIndex(2, 1).querySelector('.e-treecell').textContent).toBe('Plan budget');
      expect(gridObj.getColumnByField('taskName').headerText).toBe('Task Name');
      let uid: string = gridObj.getHeaderContent().querySelectorAll('.e-headercelldiv')[1].getAttribute('e-mappinguid');
      expect(gridObj.getColumnByUid(uid).headerText).toBe('Task Name');
      expect(gridObj.getColumnFieldNames()[2]).toBe('startDate');
      expect(gridObj.getColumnHeaderByField('startDate').querySelector('.e-headertext').textContent).toBe('Start Date');
      expect(gridObj.getColumnHeaderByIndex(2).querySelector('.e-headertext').textContent).toBe('Start Date');
      expect(gridObj.getColumnHeaderByUid(uid).querySelector('.e-headertext').textContent).toBe('Task Name');
      expect(gridObj.getColumnIndexByField('progress')).toBe(3);
      expect(gridObj.getColumnIndexByUid(uid)).toBe(1);
      expect(gridObj.getColumns().length).toBe(4);
      expect(gridObj.getContent().classList.contains('e-gridcontent')).toBe(true);
      expect(gridObj.getContentTable().classList.contains('e-table')).toBe(true);
      expect(gridObj.getHeaderContent().classList.contains('e-gridheader')).toBe(true);
      expect(gridObj.getHeaderTable().classList.contains('e-table')).toBe(true);
      expect(gridObj.getRowByIndex(1).children[0].textContent).toBe('' + gridObj.flatData[1][gridObj.getColumns()[0].field]);
      expect(gridObj.getUidByColumnField('taskName')).toMatch(uid);
      (<Column>gridObj.columns[2]).visible = false;
      gridObj.refreshColumns();
      expect(gridObj.getVisibleColumns().length).toBe(3);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  
  
  describe('Hide column method', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 100 },
            { field: 'taskName', headerText: 'Task Name', width: 250 },
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 135 },
        ]
        },
        done
      );
    });
    it('Check the Column Visibility after column hide', () => {
      gridObj.hideColumns('Task Name', 'headerText');
      expect(gridObj.columns[1]['visible'] == false).toBe(true);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Stacked Header', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          columns: [
            {headerText: 'Task Details', textAlign: 'Center', columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 100 },
            { field: 'taskName', headerText: 'Task Name', width: 250 },
            ]},
            { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 135 },
        ]
        },
        done
      );
    });
    it('column Checking after stacked header added dynamically', () => {
      actionComplete = (args?: Object): void => {
        if (args['requestType'] == "refresh" ) {
          expect(gridObj.columns.length == 3).toBe(true);
        }
      }
      gridObj.grid.actionComplete = actionComplete;
      let cols: ColumnModel = {headerText: 'Price Details', columns: [{ field: 'unitPrice' },{ field: 'price'}]};
      (gridObj.columns as ColumnModel[]).push(cols)
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });


  describe('Stacked Header with columns property as null', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: stackedData,
          childMapping: 'subtasks',
          allowResizing: true,
          treeColumnIndex: 1,
          height: 260,
          dataBound: function(args: Object) {
            expect(this.getHeaderContent().getElementsByTagName('thead')[0].childNodes.length).toBe(2);
            expect(this.getRows().length).toBeGreaterThan(0);
          },
          columns: [
            {
              headerText: 'Order Details', textAlign: 'Center', columns: null
            },
            {
              headerText: 'Shipment Details', textAlign: 'Center', 
              columns: [
                  { field: 'shipMentCategory', headerText: 'Shipment Category', textAlign: 'Left', width: 90 },
                  { field: 'shippedDate', headerText: 'Shipped Date', textAlign: 'Right', width: 90, format: 'yMd' }
              ]
            }
          ]
        },
        done
      );
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

describe('Checkbox Column', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        autoCheckHierarchy: true,
        selectionSettings: { type: 'Multiple', mode: 'Row', persistSelection: true, checkboxOnly: true },
        columns: [
          { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, showCheckbox: true, textAlign: 'Right', width: 100 },
          { field: 'taskName', headerText: 'Task Name', width: 250 },
          { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 135 },
          { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
          { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
        ],
        aggregates: [{
          showChildSummary: true,
          columns: [
              {
                  type: 'Max',
                  field: 'duration',
                  columnName: 'duration',
                  footerTemplate: 'Maximum: ${Max}'
              },
              {
                  type: 'Min',
                  field: 'progress',
                  columnName: 'progress',
                  footerTemplate: 'Minimum: ${Min}'
              }
          ]
      }]
      },
      done
    );
  });
  it('Intremediate state for parent checkbox by child checkbox enabled', () => {
    (<HTMLElement>gridObj.getRows()[1].querySelectorAll('.e-treecheckselect')[0]).click();
    expect((<ITreeData>gridObj.getCurrentViewRecords()[1]).checkboxState).toBe("check");
    expect((<ITreeData>gridObj.getCurrentViewRecords()[0]).checkboxState).toBe("indeterminate");
  });
  it('Header checkbox check state', () => {
    (<HTMLElement>gridObj.getRows()[1].querySelectorAll('.e-treecheckselect')[0]).click();
    (<HTMLElement>gridObj.element.querySelectorAll('.e-treeselectall')[0]).click();
    expect((<ITreeData>gridObj.getCurrentViewRecords()[0]).checkboxState).toBe("check");
    expect((<ITreeData>gridObj.getCurrentViewRecords()[6]).checkboxState).toBe("check");
  });
  it('Header checkbox uncheck state', () => {
    (<HTMLElement>gridObj.element.querySelectorAll('.e-treeselectall')[0]).click();
    expect((<ITreeData>gridObj.getCurrentViewRecords()[0]).checkboxState).toBe("uncheck");
    expect((<ITreeData>gridObj.getCurrentViewRecords()[6]).checkboxState).toBe("uncheck");
  });
  afterAll(() => {
    destroy(gridObj);
  });
});
describe('Column Chooser', () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        showColumnChooser:false,
        toolbar:['ColumnChooser'],
        columns: [
          { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true,  textAlign: 'Right', width: 100 },
          { field: 'taskName', headerText: 'Task Name', width: 250, showInColumnChooser: false },
          { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 135 },
          { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
          { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
        ]
       
      },
      done
    );
  });
  it('Column chooser testing', () => {
    gridObj.showColumnChooser= true;
    gridObj.dataBind();
    (<HTMLElement>select('#' + gridObj.grid.element.id + '_columnchooser', gridObj.grid.toolbarModule.getToolbar())).click();
    (<any>gridObj.element.querySelectorAll('.e-cc-chbox')[3]).click();
    (<any> gridObj.element.querySelector('.e-cc_okbtn')).click()
    expect(gridObj.getVisibleColumns().length).toBe(4);
  
  });
  
  afterAll(() => {
    destroy(gridObj);
  });
}); 


describe('Column Chooser', () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        showColumnChooser: true,
        toolbar:['ColumnChooser'],
        columns: [
          { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true,  textAlign: 'Right', width: 100 },
          { field: 'taskName', headerText: 'Task Name', width: 250, showInColumnChooser: false },
          { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 135 },
          { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
          { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
        ]
       
      },
      done
    );
  });
  it('Check ShowInColumnChooser method', () => {
    (<HTMLElement>select('#' + gridObj.grid.element.id + '_columnchooser', gridObj.grid.toolbarModule.getToolbar())).click();
      expect(gridObj.element.querySelectorAll('.e-cclist').length).toBe(5);
      expect(gridObj.element.querySelectorAll('.e-cclist')[0].textContent).toBe('Select All');
      expect(gridObj.element.querySelectorAll('.e-cclist')[1].textContent).toBe('Task ID');
      expect(gridObj.element.querySelectorAll('.e-cclist')[2].textContent).toBe('Priority');
      expect(gridObj.element.querySelectorAll('.e-cclist')[3].textContent).toBe('Duration');
      expect(gridObj.element.querySelectorAll('.e-cclist')[4].textContent).toBe('Progress'); 
    });
  it('Check showcolumnchooser', () => {
    (<HTMLElement>select('#' + gridObj.grid.element.id + '_columnchooser', gridObj.grid.toolbarModule.getToolbar())).click();
    (<any>gridObj.element.querySelectorAll('.e-cc-chbox')[2]).click();
    (<any>gridObj.element.querySelectorAll('.e-cc-chbox')[3]).click();
    (<any> gridObj.element.querySelector('.e-cc_okbtn')).click()
    expect(gridObj.getVisibleColumns().length).toBe(3);
 
  });

  afterAll(() => {
    destroy(gridObj);
  });
}); 

describe('Column Chooser', () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        showColumnChooser: true,
        columns: [
          { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true,  textAlign: 'Right', width: 100 },
          { field: 'taskName', headerText: 'Task Name', width: 250, showInColumnChooser: false },
          { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 135 },
          { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
          { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
        ]
       
      },
      done
    );
  });
  it('Check ShowInColumnChooser method', () => {
      gridObj.columnChooserModule.openColumnChooser(100,50);
      expect(gridObj.element.querySelectorAll('.e-cclist').length).toBe(5);
      expect(gridObj.element.querySelectorAll('.e-cclist')[0].textContent).toBe('Select All');
      expect(gridObj.element.querySelectorAll('.e-cclist')[1].textContent).toBe('Task ID');
      expect(gridObj.element.querySelectorAll('.e-cclist')[2].textContent).toBe('Priority');
      expect(gridObj.element.querySelectorAll('.e-cclist')[3].textContent).toBe('Duration');
      expect(gridObj.element.querySelectorAll('.e-cclist')[4].textContent).toBe('Progress'); 
    });
  it('Check showcolumnchooser', () => {
    gridObj.columnChooserModule.openColumnChooser(100,50);
    (<any>gridObj.element.querySelectorAll('.e-cc-chbox')[2]).click();
    (<any>gridObj.element.querySelectorAll('.e-cc-chbox')[3]).click();
    (<any> gridObj.element.querySelector('.e-cc_okbtn')).click()
    expect(gridObj.getVisibleColumns().length).toBe(3);
  });

  afterAll(() => {
    destroy(gridObj);
  });
}); 

describe('Checkbox Column', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        autoCheckHierarchy: true,
        columns: [
          { template:"<span>PA-${taskID}</span>", headerText: 'Task ID', isPrimaryKey: true, showCheckbox: true, textAlign: 'Right', width: 100 },
          { template:"<span> ${taskName}</span>", headerText: 'Task Name', width: 250 },
          { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 135 },
          { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
          { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
        ]
      },
      done
    );
  });
  
  it('Checkbox render', () => {
    expect(gridObj.getCellFromIndex(2,0).classList.contains('e-treegridcheckbox')).toBe(true);
    expect(gridObj.getCellFromIndex(2,1).classList.contains('e-treegridcheckbox')).toBe(false);
  });
 
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('stacked header with template tree column- EJ2-48776', () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: stackedData,
        childMapping: 'subtasks',
        allowPaging: true,
        treeColumnIndex: 0,
            height: 260,
            columns: [
                {
                    headerText: 'Order Details', textAlign: 'Center', columns: [
                        { field: 'orderID', headerText: 'Order ID', template: "<span>test</span>", textAlign: 'Right', width: 90 },
                        { field: 'orderName', headerText: 'Order Name', textAlign: 'Left', width: 170 },
                        { field: 'orderDate', headerText: 'Order Date',  template: "<span>test</span>", textAlign: 'Right', width: 120, format: 'yMd'},
                    ]
                },
                {
                    headerText: 'Shipment Details', textAlign: 'Center', columns: [
                        { field: 'shipMentCategory', headerText: 'Shipment Category',  template: "<span>test</span>", textAlign: 'Left', width: 150 },
                        { field: 'shippedDate', headerText: 'Shipped Date', template: "<span>test</span>", textAlign: 'Right', width: 120, format: 'yMd' },
                        { field: 'units', headerText: 'Units', textAlign: 'Left', width: 85 },
                    ]
                },
                {
                    headerText: 'Price Details', textAlign: 'Center', columns: [
                        { field: 'unitPrice', headerText: 'Price per unit',  template: "<span>test</span>",  width: 110, textAlign: 'Right' },
                        { field: 'price', headerText: 'Total Price', width: 110, format: 'c', type: 'number', textAlign: 'Right' }
                    ]
                }
            ]
    
       
      },
      done
    );
  });
  it('check template rendering', () => {
    expect(gridObj.getCellFromIndex(0,0).classList.contains("e-templatecell")).toBe(true);
    expect(gridObj.getCellFromIndex(1,2).classList.contains("e-templatecell")).toBe(true); 
    expect(gridObj.getCellFromIndex(2,3).classList.contains("e-templatecell")).toBe(true); 
    expect(gridObj.getCellFromIndex(3,4).classList.contains("e-templatecell")).toBe(true); 
    expect(gridObj.getCellFromIndex(4,6).classList.contains("e-templatecell")).toBe(true); 

    });
 
  afterAll(() => {
    destroy(gridObj);
  });
}); 