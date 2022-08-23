import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { destroy } from './treegridutil.spec';
import { stateChangeData, childdata1 , customTotalData} from './datasource.spec';
import { createElement, EmitType } from '@syncfusion/ej2-base';
import { select } from '@syncfusion/ej2-base';

describe('Custom Binding', () => {
    let gridObj: TreeGrid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });    
    let dataStateChange: (args: any) => void;
    let dataSourceChanged: (args: any) => void;
    let originalTimeout: number;
    beforeAll((done: Function) => {
      document.body.appendChild(elem);
      let dataBound: EmitType<Object> = () => { done(); };
      jasmine.Ajax.install();
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
      gridObj = new TreeGrid(
        {
          dataSource: { result: stateChangeData.slice(0,1), count: 2 },
          dataBound: dataBound,
          hasChildMapping: 'isParent',
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          allowPaging: true,
          treeColumnIndex: 1,
          dataStateChange: dataStateChange,
          dataSourceChanged: dataSourceChanged,
          allowSorting: true,
          toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
          editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' },
          pageSettings: { pageSize: 1, pageSizeMode: 'Root' },
          columns: ['TaskID', 'TaskName', 'StartDate', 'Duration']
        }
      );
      gridObj.appendTo('#Grid');
      done();
    });
    it('Expand Testing', (done: Function) => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
      dataStateChange = (args: any) => {
        if (args.requestType === 'expand') {
          args.childData = childdata1;
          args.childDataBind();
        }        
      };
      gridObj.dataStateChange = dataStateChange;
      gridObj.expanded = (args: any) => {
        expect(gridObj.getRows()[0].getElementsByClassName('e-treegridexpand').length === 1).toBe(true);
        expect(gridObj.getRows()[1].getElementsByClassName('e-treegridexpand').length === 1).toBe(true);
      }   
      done();
      gridObj.expandRow(gridObj.getRows()[0]);
    });
    it ('Nested record expand/collapse icon test', () => {
      expect(gridObj.getRows()[1].getElementsByClassName('e-treegridcollapse').length === 1).toBe(true);
    });
    it('Pager Testing', (done: Function) => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
      dataStateChange = (args: any) => {
        if (args.action.requestType === 'paging') {
          let data: any = stateChangeData.slice(1,2);
          gridObj.dataSource = { result: data, count: 2 };
        }        
      };
      gridObj.dataStateChange = dataStateChange;
      gridObj.actionComplete = (args: any) => {
        if (args.requestType === 'paging') {
          expect(gridObj.grid.getRows()[0].querySelectorAll('.e-rowcell')[1].querySelectorAll('.e-treecell')[0].innerHTML == 'Parent Task 2').toBe(true);
          expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('index')).toBe("2");
        }
        done();
      }
      gridObj.goToPage(2);
    });

    it('Add Row', (done: Function) => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
      dataSourceChanged = (state: any) => {
        if (state.action == 'add') {
          state.endEdit();
        }        
      };
      dataStateChange = (args: any) => {
        if (args.action.action == 'add') {
          (gridObj.dataSource as any).result.splice(0, 0, args.action.data);
           gridObj.dataSource = { result: (gridObj.dataSource as any).result, count: (gridObj.dataSource as any).count + 1 };
        }        
      };
      gridObj.actionComplete = (args:any) => {
        if(args.requestType === 'add'){
          let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
          (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '121';
          (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'testing';
        }
        if(args.requestType == 'save'){          
          let cells: NodeListOf<Element> = gridObj.grid.getRows()[0].querySelectorAll('.e-rowcell');
          expect(cells[0].textContent === '121' ).toBeTruthy();
          expect(cells[1].textContent ).toBe('testing'); 
          done();        
        }                
      }
      gridObj.dataStateChange = dataStateChange;
      gridObj.dataSourceChanged = dataSourceChanged;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });      
    });


    it('Edit Row', (done: Function) => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
      dataSourceChanged = (state: any) => {
        if (state.action == 'edit') {
          state.endEdit();
        }
      };
      dataStateChange = (args: any) => {
        if (args.action.requestType == 'save') {
           gridObj.dataSource = { result: (gridObj.dataSource as any).result, count: (gridObj.dataSource as any).count };
        }        
      };
      gridObj.selectRow(0);
      gridObj.dataSourceChanged = dataSourceChanged;
      gridObj.dataStateChange = dataStateChange;
      gridObj.actionComplete = (args?: any): void => {
        if(args.requestType === 'save'){
          let cells: NodeListOf<Element> = gridObj.grid.getRows()[0].querySelectorAll('.e-rowcell');
          expect(cells[0].textContent === '121' ).toBeTruthy();
          expect(cells[1].querySelectorAll(".e-treecell")[0].innerHTML).toBe('test1');
        }            
        done();
      };
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
      (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'test1';     
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });

    afterAll(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      destroy(gridObj);
      jasmine.Ajax.uninstall();
    });
  });

  describe('Custom Binding with loadChildOnDemand enabled', () => {
    let gridObj: TreeGrid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });    
    beforeAll((done: Function) => {
      document.body.appendChild(elem);
      gridObj = new TreeGrid(
        {
          dataSource: { result: customTotalData, count: 2 },
          hasChildMapping: 'isParent',
          idMapping: 'TaskID',
          loadChildOnDemand: true,
          parentIdMapping: 'parentID',
          allowPaging: true,
          treeColumnIndex: 1,
          allowSorting: true,
          toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
          editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' },
          pageSettings: { pageSize: 1, pageSizeMode: 'Root' },
          columns: ['TaskID', 'TaskName', 'StartDate', 'Duration']
        }
      );
      gridObj.appendTo('#Grid');
      done();
    });
    it('Expand Testing', (done: Function) => {
        expect(gridObj.getRows()[0].getElementsByClassName('e-treegridexpand').length === 1).toBe(true); 
      done();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Custom Binding with loadChildOnDemand disabled', () => {
    let gridObj: TreeGrid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });    
    beforeAll((done: Function) => {
      document.body.appendChild(elem);
      gridObj = new TreeGrid(
        {
          dataSource: { result: customTotalData, count: 2 },
          hasChildMapping: 'isParent',
          idMapping: 'TaskID',
          loadChildOnDemand: false,
          parentIdMapping: 'parentID',
          allowPaging: true,
          treeColumnIndex: 1,
          allowSorting: true,
          toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
          editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' },
          pageSettings: { pageSize: 1, pageSizeMode: 'Root' },
          columns: ['TaskID', 'TaskName', 'StartDate', 'Duration']
        }
      );
      gridObj.appendTo('#Grid');
      done();
    });
    it('Expand Testing', (done: Function) => {
        expect(gridObj.getRows()[0].getElementsByClassName('e-treegridcollapse').length === 1).toBe(true); 
      done();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Refresh method for custom binding', () => {
    let gridObj: TreeGrid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });    
    let dataStateChange: (args: any) => void;
    beforeAll((done: Function) => {
      document.body.appendChild(elem);
      gridObj = new TreeGrid(
        {
          dataSource: { result: customTotalData, count: 2 },
          hasChildMapping: 'isParent',
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          allowPaging: true,
          treeColumnIndex: 1,
          allowSorting: true,
          pageSettings: { pageSize: 1, pageSizeMode: 'Root' },
          columns: ['TaskID', 'TaskName', 'StartDate', 'Duration']
        }
      );
      gridObj.appendTo('#Grid');
      done();
    });
    it('custom binding', (done: Function) => {
      dataStateChange = (args: any) => {
        if (args.requestType === 'refresh') {
          expect(args.requestType === 'refresh').toBe(true);
          (this as any).dataSource = {
            result:  (this as any).dataSource.result,
            count:  (this as any).dataSource.count
          };
        }        
      };
      gridObj.dataStateChange = dataStateChange;
      gridObj.refresh();
      done();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-61682 - Expand/collapse in observable binding', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let dataStateChange: (args: any) => void;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });    
    beforeAll((done: Function) => {
      document.body.appendChild(elem);
      gridObj = new TreeGrid(
        {
          dataSource: { result: customTotalData, count: 2 },
          hasChildMapping: 'isParent',
          idMapping: 'TaskID',
          dataStateChange: dataStateChange,
          parentIdMapping: 'parentID',
          allowPaging: true,
          treeColumnIndex: 1,
          allowSorting: true,
          toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
          editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' },
          pageSettings: { pageSize: 1, pageSizeMode: 'Root' },
          columns: ['TaskID', 'TaskName', 'StartDate', 'Duration']
        }
      );
      gridObj.appendTo('#Grid');
      done();
    });
    it('Expand testing first parent record', () => {
      dataStateChange = (args: any) => {
        if (args.requestType === 'expand') {
          args.childData = childdata1;
          args.childDataBind();
        }        
      };
      gridObj.dataStateChange = dataStateChange;
      rows = gridObj.getRows();
      gridObj.expandRow(rows[0] as HTMLTableRowElement);
      gridObj.collapseRow(rows[0] as HTMLTableRowElement);
      expect(gridObj.getRows()[0].getElementsByClassName('e-treegridcollapse').length === 1).toBe(true);
    });
    it('Expand testing second parent record', () => {
      rows = gridObj.getRows();
      gridObj.expandRow(rows[3] as HTMLTableRowElement);
      expect(gridObj.getRows()[0].getElementsByClassName('e-treegridcollapse').length === 1).toBe(true);
      expect(gridObj.getRows()[3].getElementsByClassName('e-treegridexpand').length === 1).toBe(true);
    });
    afterAll(() => {
      destroy(gridObj);
    });

	describe('EJ2-61682 - Expand/collapse in observable binding', () => {
		let gridObj: TreeGrid;
		let rows: Element[];
		let dataStateChange: (args: any) => void;
		let elem: HTMLElement = createElement('div', { id: 'Grid' });    
		beforeAll((done: Function) => {
		  document.body.appendChild(elem);
		  gridObj = new TreeGrid(
			{
			  dataSource: { result: stateChangeData, count: 2 },
			  hasChildMapping: 'isParent',
			  idMapping: 'TaskID',
			  dataStateChange: dataStateChange,
			  parentIdMapping: 'parentID',
			  allowPaging: true,
			  treeColumnIndex: 1,
			  allowSorting: true,
			  toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
			  editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' },
			  pageSettings: { pageSize: 1, pageSizeMode: 'Root' },
			  columns: ['TaskID', 'TaskName', 'StartDate', 'Duration']
			}
		  );
		  gridObj.appendTo('#Grid');
		  done();
		});
		it('Expand testing first parent record', () => {
		  expect(gridObj.getRows()[0].getElementsByClassName('e-treegridcollapse').length === 1).toBe(true);
		});
		afterAll(() => {
		  destroy(gridObj);
		});
	  });
  });
  