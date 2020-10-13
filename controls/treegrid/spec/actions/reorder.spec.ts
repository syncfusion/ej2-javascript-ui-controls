import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData, projectData, stackedData, employeeData } from '../base/datasource.spec';
import { ResizeArgs, ColumnDragEventArgs, getObject, Column } from '@syncfusion/ej2-grids';
import { EmitType } from '@syncfusion/ej2-base';
import { Reorder } from '../../src/treegrid/actions/reorder';
import { Resize } from '../../src/treegrid/actions/resize';
import { profile, inMB, getMemoryProfile } from '../common.spec';


/**
 * Grid base spec 
 */
TreeGrid.Inject(Reorder);
TreeGrid.Inject(Resize);
describe('TreeGrid Reordering', () => {
  beforeAll(() => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
        console.log("Unsupported environment, window.performance.memory is unavailable");
        this.skip(); //Skips test (in Chai)
        return;
    }
  });

  describe('Hierarchy data Reorder', () => {
    let TreeGridObj: TreeGrid;
    let headers: any;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowReordering: true,
          columns: [
            { field: "taskID", headerText: "Task Id", width: 90 },
            { field: 'taskName', headerText: 'taskName', width: 60 },
            { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
            { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
          ],
        },done);
    });

    it('Reorder Testing', (done: Function) => {
      actionComplete = (): void => {
        headers = TreeGridObj.getHeaderContent().querySelectorAll('.e-headercell');
        expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('taskName');
        expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('Task Id');
        expect(TreeGridObj.getRows()[0].getElementsByClassName('e-rowcell')[0].querySelector(".e-icons"));
        done();
      };
      TreeGridObj.actionComplete = actionComplete;
      TreeGridObj.reorderColumns("taskName", "taskID");
      TreeGridObj.reorderModule.destroy();
    });
    afterAll(() => {
      destroy(TreeGridObj);
    });
  });

  describe('TextWrap in Hierarchy Data', () => {
    let TreeGridObj: TreeGrid;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowTextWrap: true,
          allowPaging: true,
          columns: [
            { field: "taskID", headerText: "Task Id", width: 90 },
            { field: 'taskName', headerText: 'taskName', width: 60 },
            { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
            { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
          ],
        },done);
    });

    it('TextWrapping', () => {
      TreeGridObj.element.querySelector(".e-grid").classList.contains("e-wrap");
    });
    afterAll(() => {
      destroy(TreeGridObj);
    });
  });

  describe('Resizing in Hierarchy Data', () => {
    let TreeGridObj: TreeGrid;
    let headers: any;
    let resizeStartevent: EmitType<ResizeArgs> = jasmine.createSpy('resizeStartevent');
    let resizeStop: EmitType<ResizeArgs> = jasmine.createSpy('resizeStartStop');
    let resize: EmitType<ResizeArgs> = jasmine.createSpy('resize');
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowResizing: true,
          resizeStart: resizeStartevent,
          resizeStop: resizeStop,
          resizing: resize,
          columns: [
            { field: "taskID", headerText: "Task Id", width: 150, minWidth: 50, maxWidth: 250 },
            { field: 'taskName', headerText: 'taskName', width: 150, minWidth: 50, maxWidth: 250 },
            { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 150, minWidth: 50, maxWidth: 250 },
            { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 150, minWidth: 50, maxWidth: 250 },
            { field: 'startDate', headerText: 'start Date', textAlign: 'Right', width: 150, format:'yMd', minWidth: 50, maxWidth: 250 },
            { field: 'endDate', headerText: 'end Date', textAlign: 'Right', width: 150, format:'yMd', minWidth: 50, maxWidth: 250 },
          ],
        },done);
    });

    it('Resizing', () => {
        TreeGridObj.autoFitColumns('taskID');
        headers = (<HTMLElement>TreeGridObj.getHeaderTable().querySelectorAll('th')[0]).style.width;
        expect(headers).toBeFalsy();
        let columnwidth: string | number = getObject('width', TreeGridObj.columns[0]);
        expect(columnwidth === '58px').toBe(true);
        TreeGridObj.resizeModule.destroy();
    });
    afterAll(() => {
      destroy(TreeGridObj);
    });
  });

  describe('Flat data Reorder', () => {
    let TreeGridObj: TreeGrid;
    let headers: any;
    let colDrag: EmitType<ColumnDragEventArgs> = jasmine.createSpy('colDragevent');
    let coldragStart: EmitType<ColumnDragEventArgs> = jasmine.createSpy('colDragStart');
    let colDrop: EmitType<ColumnDragEventArgs> = jasmine.createSpy('colDrop');
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: projectData,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          treeColumnIndex: 1,
          allowReordering: true,
          columnDrag: colDrag,
          columnDragStart: coldragStart,
          columnDrop: colDrop,
          columns: [
            { field: "TaskID", headerText: "Task ID", width: 90 },
            { field: 'TaskName', headerText: 'Task Name', width: 60 },
            { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
          ],
        },done);
    });

    it('Reorder Testing', (done: Function) => {
      actionComplete = (): void => {
        headers = TreeGridObj.getHeaderContent().querySelectorAll('.e-headercell');
        expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('Task Name');
        expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('Task ID');
        expect(TreeGridObj.getRows()[0].getElementsByClassName('e-rowcell')[0].querySelector(".e-icons"));
        done();
      };
      TreeGridObj.actionComplete = actionComplete;
      TreeGridObj.reorderColumns("TaskName", "TaskID");
    });
    afterAll(() => {
      destroy(TreeGridObj);
    });
  });

  describe('SetModel', () => {
    let TreeGridObj: TreeGrid;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          columns: [
            { field: "taskID", headerText: "Task Id", width: 90 },
            { field: 'taskName', headerText: 'taskName', width: 60 },
            { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
            { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
          ],
        },done);
    });

    it('Reorder Testing', () => {
      TreeGridObj.allowTextWrap = true;
      TreeGridObj.allowReordering = true;
      TreeGridObj.allowResizing = true;
      TreeGridObj.textWrapSettings = { wrapMode: "Header"};
    });
    afterAll(() => {
      destroy(TreeGridObj);
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
describe('Reorder Columns by using method', () => {
  let TreeGridObj: TreeGrid;
  let headers: any;
  let columns: Column[];

  beforeAll((done: Function) => {
    TreeGridObj = createGrid(
          {
              dataSource: employeeData,
              allowReordering: true,
              columns: [{ field: 'EmployeeID' }, 
              { field: 'Address' }, 
              { field: 'DOB' }],
          }, done);
  });

  it('Reorder Column method', () => {
      TreeGridObj.reorderColumns(['EmployeeID','Address'],'DOB');
      columns = TreeGridObj.grid.getColumns() as Column[];
      headers = TreeGridObj.getHeaderContent().querySelectorAll('.e-headercell');
      expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('DOB');
      expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
      expect(headers[2].querySelector('.e-headercelldiv').textContent).toBe('Address');
      expect(columns[0].field).toBe('DOB');
      expect(columns[1].field).toBe('EmployeeID');
      expect(columns[2].field).toBe('Address');
  });
});
describe('Stacked data Reorder', () => {
  let TreeGridObj: TreeGrid;
   let headers: any;
   let columns: Column[];
  let actionComplete: () => void;
   beforeAll((done: Function) => {
    TreeGridObj = createGrid(
      {
        dataSource:  stackedData,
      
        allowReordering:true,
        childMapping: 'subtasks',
         treeColumnIndex: 3,
       
        
         columns: [
         
            {
                headerText: 'Order Details', textAlign: 'Center', columns: [
                    { field: 'orderID', headerText: 'Order ID', textAlign: 'Right', width: 90 },
                    { field: 'orderName', headerText: 'Order Name', textAlign: 'Left', width: 170 },
                    { field: 'orderDate', headerText: 'Order Date', textAlign: 'Right', width: 120, format: 'yMd'},
               ]
            },
            {
                headerText: 'Shipment Details', textAlign: 'Center', columns: [
                    { field: 'shipMentCategory', headerText: 'Shipment Category', textAlign: 'Left', width: 150 },
                    { field: 'shippedDate', headerText: 'Shipped Date', textAlign: 'Right', width: 120, format: 'yMd' },
                    { field: 'units', headerText: 'Units', textAlign: 'Left', width: 85 },
                ]
           },
           {
                headerText: 'Price Details', textAlign: 'Center', columns: [
                    { field: 'unitPrice', headerText: 'Price per unit', format: 'c2', type: 'number', width: 110, textAlign: 'Right' },
                   { field: 'price', headerText: 'Total Price', width: 110, format: 'c', type: 'number', textAlign: 'Right' }
                ]
            }
        ],
 
 
 
       },done);
    });
 
    it('Reorder Testing', () => {
      actionComplete = (): void => {
      columns = TreeGridObj.grid.getColumns() as Column[];
      headers = TreeGridObj.getHeaderContent().querySelectorAll('.e-headercell');
     
      expect(headers[0].querySelector('.e-headercelldiv')).toBe('Order Details');
      expect(headers[1].querySelector('.e-headercelldiv')).toBe('Shipment Details');
      expect(headers[2].querySelector('.e-headercelldiv')).toBe('Price Details');
      expect(columns[2].field).toBe('orderDate');
      expect(columns[3].field).toBe('shipMentCategory');
      expect(columns[4].field).toBe('shippedDate');
      expect(columns[5].field).toBe('units');
      expect(columns[6].field).toBe('unitPrice');
      expect(columns[7].field).toBe('price');
      expect(TreeGridObj.getRows()[0].getElementsByClassName('e-rowcell')[3].querySelector(".e-icons"));
        };
   TreeGridObj.actionComplete = actionComplete;
   TreeGridObj.reorderColumns( "orderName","orderID");
    
      TreeGridObj.reorderModule.destroy();
     
  });
    afterAll(() => {  
     destroy(TreeGridObj);
   });
 
  });
});

