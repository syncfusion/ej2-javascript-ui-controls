import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData, projectData2 } from '../base/datasource.spec';
import { Edit } from '../../src/treegrid/actions/edit';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { SaveEventArgs, CellEditArgs } from '@syncfusion/ej2-grids';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { Sort } from '../../src/treegrid/actions/sort';
import { RowDD } from '../../src/treegrid/actions/rowdragdrop';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { VirtualScroll } from '../../src/treegrid/actions/virtual-scroll';
import { Query, DataManager } from '@syncfusion/ej2-data';

/**
 * Grid Cell Edit spec 
 */
TreeGrid.Inject(Edit, Toolbar, Sort, RowDD, VirtualScroll);
describe('Cell Edit module', () => {
  beforeAll(() => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
        console.log("Unsupported environment, window.performance.memory is unavailable");
        this.skip(); //Skips test (in Chai)
        return;
    }
  });
  describe('Hirarchy editing', () => {
    let gridObj: TreeGrid;
    let actionBegin: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
            dataSource: sampleData,
            childMapping: 'subtasks',
            editSettings: { allowEditing: true, mode: 'Cell', allowDeleting: true, allowAdding: true, newRowPosition: 'Top' },

            treeColumnIndex: 1,
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
              columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
              { field: 'taskName', headerText: 'Task Name' },
              { field: 'progress', headerText: 'Progress' },
              { field: 'startDate', headerText: 'Start Date' }
              ]
        },
        done
      );
    });
    it('record double click', (done: Function) => {
      gridObj.cellEdit = (args?: CellEditArgs): void => {
        expect(args.columnName).toBe('taskName');
        done();
      };
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
    });
    it('save record', (done: Function) => {
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
      gridObj.actionComplete = (args?: any): void => {
        expect(gridObj.dataSource[0].subtasks[1].taskName).toBe('test');
        done();
      };
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    afterAll(() => {
        destroy(gridObj);
      });
    });
  describe('Cell Editing - cell alone refresh', () => {
    let gridObj: TreeGrid;
    let actionBegin: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, newRowPosition: 'Top' },

          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
          { field: 'taskName', headerText: 'Task Name' },
          { field: 'progress', headerText: 'Progress' },
          { field: 'startDate', headerText: 'Start Date' }
          ]
        },
        done
      );
    });
    it('cell refresh', (done: Function) => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      (gridObj.getCellFromIndex(1, 1) as HTMLElement).style.background = 'red';
      gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
      gridObj.actionComplete = (args?: SaveEventArgs): void => {
        expect(args.target.textContent).toBe('test');
        expect((gridObj.getCellFromIndex(1, 1) as HTMLElement).style.background).toBe('red');
        done();
      };
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
      gridObj.getRows()[0].click();
    });
    it('cell refresh by toolbar update', (done: Function) => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      (gridObj.getCellFromIndex(1, 1) as HTMLElement).style.background = 'blue';
      gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
      gridObj.actionComplete = (args?: SaveEventArgs): void => {
        expect(args.target.textContent).toBe('test2');
        expect((gridObj.getCellFromIndex(1, 1) as HTMLElement).style.background).toBe('blue');
        done();
      };
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test2';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Cell Editing With scroller', () => {
    let gridObj: TreeGrid;
    let actionBegin: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          width: 600, height: 400,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, newRowPosition: 'Top' },

          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [
            {
                field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true }, width: 190
            },
            { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220, validationRules: { required: true } },
            { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 230, editType: 'datepickeredit',
                format: 'yMd', validationRules: { date: true } },
            {
                field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 200, editType: 'numericedit',
                validationRules: { number: true, min: 0 }, edit: { params: { format: 'n' } }
            }
        ]
        },
        done
      );
    });
    it('cell edit', () => {
      expect((<HTMLElement>gridObj.grid.element).style.width).toBe('600px');
      expect((<HTMLElement>gridObj.getContent().firstChild).classList.contains('e-content')).toBeTruthy();
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      let scrollPosition: number = gridObj.getContent().firstElementChild.scrollLeft;
      gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
      expect(gridObj.getContent().firstElementChild.scrollLeft).toEqual(scrollPosition);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      expect(gridObj.getContent().firstElementChild.scrollLeft).toEqual(scrollPosition);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
    describe('Sorting and update cell', () => {
      let gridObj: TreeGrid;
      let rows: Element[];
      let actionBegin: () => void;
      let actionComplete: () => void;
  
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: sampleData,
            childMapping: 'subtasks',
            allowSorting: true,
            treeColumnIndex: 1,
              editSettings: {
                  allowAdding: true,
                  allowEditing: true,
                  allowDeleting: true,
                  mode: 'Cell',
                  newRowPosition: 'Below'
  
              },
              toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
              columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
              { field: 'taskName', headerText: 'Task Name' },
              { field: 'startDate', headerText: 'Start Date'},
              { field: 'duration', headerText: 'duration' },
              ]
          },
          done
        );
      });
      it('double click parent cell edit and update',(done: Function) => {
        let event: MouseEvent = new MouseEvent('dblclick', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
        actionComplete = (args?: any): void => {
          if(args.type=='save'){
          expect((gridObj.getRows()[0].getElementsByClassName('e-treecell')[0] as HTMLElement).innerText=="Planned").toBe(true);
          
          done();
          }
       }
       gridObj.actionComplete = actionComplete;
        gridObj.getCellFromIndex(0, 1).dispatchEvent(event);
        gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'Planned';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        gridObj.getCellFromIndex(1, 1).dispatchEvent(event);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
        
      });
      it('double click on child cell edit and update',(done: Function) => {
        let event: MouseEvent = new MouseEvent('dblclick', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
        actionComplete = (args?: any): void => {
        if(args.type=='save'){
          expect((gridObj.getRows()[1].getElementsByClassName('e-treecell')[0] as HTMLElement).innerText=="Planning completed").toBe(true);
          done();
        }
        
       }
       gridObj.actionComplete = actionComplete;
        gridObj.getCellFromIndex(1, 1).dispatchEvent(event);
        gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'Planning completed';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
      });
      it('Sorting the column,edit and update the parent cell', (done: Function) => {
        actionComplete = (args?: Object): void => {
           expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Design").toBe(true);
           expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Design complete").toBe(true);
           expect(gridObj.getRows()[2].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Design Documentation").toBe(true);
           expect(gridObj.getRows()[3].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Develop prototype").toBe(true);
           expect(gridObj.getRows()[4].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Get approval from customer").toBe(true);
           expect(gridObj.getRows()[5].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Software Specification").toBe(true);
           done();
        }
        gridObj.sortByColumn("taskName", "Ascending", true);
        gridObj.grid.actionComplete = actionComplete;
      });
      it('double click on sorted parent cell edit and update',(done: Function) => {
        let event: MouseEvent = new MouseEvent('dblclick', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
        actionComplete = (args?: any): void => {
          if(args.type=='save'){
          expect((gridObj.getRows()[0].getElementsByClassName('e-treecell')[0] as HTMLElement).innerText=="Designs").toBe(true);
          done();
          }
          
       }
       gridObj.actionComplete = actionComplete;
        gridObj.getCellFromIndex(0, 1).dispatchEvent(event);
        gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'Designs';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        gridObj.getCellFromIndex(1, 1).dispatchEvent(event);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
      });
      afterAll(() => {
        destroy(gridObj);
      });
    });
    describe('Check the expanding state of record after delete operation', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionBegin: () => void;
    let actionComplete: () => void;

    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                mode: 'Cell',
                newRowPosition: 'Below'

            },
            toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
            columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
            { field: 'taskName', headerText: 'Task Name' },
            { field: 'startDate', headerText: 'Start Date'},
            { field: 'duration', headerText: 'duration' },
            ]
        },
        done
      );
    });
    it('Check expand state of record after deletion of another record', (done: Function) => {
      (<HTMLElement>gridObj.getRows()[5].querySelectorAll('.e-treegridexpand')[0]).click();
      (<HTMLElement>gridObj.getRows()[11].querySelectorAll('.e-treegridexpand')[0]).click();
      gridObj.selectRow(2);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
      gridObj.actionComplete = (args?: Object): void => {
        (<HTMLElement>gridObj.getRows()[10].querySelectorAll('.e-treegridcollapse')[0]).click();
        expect(gridObj.getRows()[11].getElementsByClassName('e-treecolumn-container')[0].children[1].classList.contains('e-treegridexpand')).toBe(true);
        expect(gridObj.getRows()[12].getElementsByClassName('e-treecolumn-container')[0].children[2].classList.contains('e-treegridexpand')).toBe(true);
        done();
      }
  });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Cell edit and cancel when selection mode is set as Cell', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
  
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowSelection: true,
          selectionSettings: {mode: 'Cell'},
          treeColumnIndex: 1,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                mode: 'Cell'
            },
            toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
            columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
            { field: 'taskName', headerText: 'Task Name' },
            { field: 'startDate', headerText: 'Start Date'},
            { field: 'duration', headerText: 'duration' },
            ]
        },
        done
      );
    });
    it('double click on a record, cell edit and cancel',() => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(1, 1).dispatchEvent(event);
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'Planning completed';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
      expect((gridObj.getRows()[1].getElementsByClassName('e-treecell')[0] as HTMLElement).innerText=="Plan timeline").toBe(true);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Expand/Collpase icon testing at the time of cell edit cancel', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowSelection: true,
          selectionSettings: {mode: 'Cell'},
          treeColumnIndex: 1,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                mode: 'Cell'
            },
            toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
            columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
            { field: 'taskName', template:"<span>test</span>", headerText: 'Task Name' },
            { field: 'startDate', headerText: 'Start Date'},
            { field: 'duration', headerText: 'duration' },
            ]
        },
        done
      );
    });
    it('double click on a record, cell edit and cancel',() => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(0, 1).dispatchEvent(event);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
      expect(gridObj.getRows()[0].getElementsByClassName('e-treecell').length).toBe(1);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-26550 - Edit cell through method', () => {
    let gridObj: TreeGrid;
    let cellEdit: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
        dataSource: sampleData,
        childMapping: 'subtasks',
        editSettings: { allowEditing: true, mode: 'Cell', allowDeleting: true, allowAdding: true,},
        treeColumnIndex: 1,
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
        columns: [{field: 'taskID', headerText: 'Task ID', isPrimaryKey: true},
                  {field: 'taskName', headerText: 'Task Name'},
                  {field: 'startDate', headerText: 'Start Date'},
                  {field: 'progress', headerText: 'Progress'}]
        },
        done
      );
    });
    it('Edit Cell', () => {
      cellEdit = (args?: any): void => {
        setTimeout(() => {
          expect(gridObj.grid.editModule.formObj.element.getElementsByTagName('input').length).toBe(1);
        }, 0);
      }
      gridObj.cellEdit = cellEdit;
      gridObj.editCell(2,'progress');
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-22751: Events not triggered', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionBegin: () => void;
    let actionComplete: () => void;
  
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                mode: 'Cell'
  
            },
            toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
            columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
            { field: 'taskName', headerText: 'Task Name' },
            { field: 'startDate', headerText: 'Start Date'},
            { field: 'duration', headerText: 'duration' },
            ]
        },
        done
      );
    });
    it('Check editing events', (done: Function) => {
      
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      
      gridObj.actionBegin = (args?: Object) : void => {
        expect(args['columnName'] === 'taskName').toBe(true);
        expect(args['type'] === 'edit').toBe(true);
        done();
      }
      /*gridObj.actionComplete = (args?: Object): void => {
        expect(args['type'] === 'edit').toBe(true);
        done();
      }*/
      gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
  });
  
  it('Check saving events', (done: Function) => {
    let event: MouseEvent = new MouseEvent('dblclick', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    gridObj.actionBegin = (args?: Object) : void => {
      expect(args['type'] === 'save').toBe(true);
    }
    gridObj.actionComplete = (args?: Object) : void => {
      expect(args['type'] === 'save').toBe(true);
      expect(args['target'].cellIndex === 1).toBe(true);
      done();
    }
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      
  });
  
  it('Check editing events again', (done: Function) => {
      
    let event: MouseEvent = new MouseEvent('dblclick', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    
    gridObj.actionBegin = (args?: Object) : void => {
      expect(args['columnName'] === 'taskName').toBe(true);
      expect(args['type'] === 'edit').toBe(true);
      done();
    }
    /*gridObj.actionComplete = (args?: Object): void => {
      expect(args['type'] === 'edit').toBe(true);
      done();
    }*/
    gridObj.getCellFromIndex(3, 1).dispatchEvent(event);
  });
  
  it('Check cancelling events', (done: Function) => {
    gridObj.actionComplete = (args?: Object) : void => {
      expect(args['name'] === 'actionComplete').toBe(true);
      done();
    }
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
  });
  
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('allowEditOnDblClick - Cell Editing', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Cell", newRowPosition: 'Below', allowEditOnDblClick: false },

          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
          { field: 'taskName', headerText: 'Task Name' },
          { field: 'progress', headerText: 'Progress' },
          { field: 'startDate', headerText: 'Start Date' }
          ]
        },
        done
      );
    });
    it('allowEditOnDblClick - Cell Editing', () => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
      expect(isNullOrUndefined(gridObj.grid.editModule.formObj)).toBe(true);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-32160 - DataSource not refreshed after cancelling the edit action on cellEditing', () => {
    let gridObj: TreeGrid;
    let cellEdit: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Cell", newRowPosition: 'Below' },
          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
          { field: 'taskName', headerText: 'Task Name' },
          { field: 'progress', headerText: 'Progress' },
          { field: 'startDate', headerText: 'Start Date' }
          ]
        },
        done
      );
    });
    it('DataSource not refreshed after cancelling the edit action on cellEditing', () => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      cellEdit = (args?: any): void => {
        args.cancel = true;
      }
      actionComplete = (args?: any): void => {
        expect(isNullOrUndefined(args.rowData.taskID)).toBe(true);
      }
      gridObj.cellEdit = cellEdit;
      gridObj.actionComplete = actionComplete;
      gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });




  describe('EJ2-32869 - Clicking on Expand icon while in edit state', () => {
    let gridObj: TreeGrid;
    let cellEdit: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: "Cell", newRowPosition: 'Below' },
          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
          { field: 'taskName', headerText: 'Task Name' },
          { field: 'progress', headerText: 'Progress' },
          { field: 'startDate', headerText: 'Start Date' }
          ]
        },
        done
      );
    });
    it('Clicking on expand icon in edit state', () => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });      
      gridObj.getCellFromIndex(0, 2).dispatchEvent(event);
      (gridObj.editModule as any).doubleClickTarget.getElementsByTagName("input")[0].value = "20";
      (gridObj.getRows()[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
      let cells: NodeListOf<Element> = gridObj.grid.getRows()[0].querySelectorAll('.e-rowcell');
      expect(cells[2].textContent === '20' ).toBeTruthy();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });




describe('EJ2-36694 - Cell Update with aggregates', () => {
    let gridObj: TreeGrid;
    let cellEdit: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          height: 400,
          editSettings: {
              allowAdding: true,
              allowEditing: true,
              allowDeleting: true,
              mode: 'Cell',
              newRowPosition: 'Below'
  
          },
            aggregates: [{
              showChildSummary: true,
                  columns: [
                      {
                          type: 'Max',
                          field: 'duration',
                          columnName: 'duration',
                          footerTemplate: 'Maximum: ${Max}'
                      }
                      ]
          }],
          toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
          columns: [
              {
                  field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                  validationRules: { required: true, number: true}, width: 90
              },
              { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220, validationRules: {required: true} },
              { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
                format: 'yMd', validationRules: { date: true} },
              {
                  field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100, editType: 'numericedit',
                  validationRules: { number: true, min: 0}, edit: { params: {  format: 'n'}}
              }
          ]
        },
        done
      );
    });
    it('Edit Cell', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType == 'save') {
          expect((gridObj.getRows()[7].getElementsByClassName('e-treecell')[0] as HTMLElement).innerText=="test").toBe(true);
        }
        done();
      }
      gridObj.actionComplete = actionComplete;
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(7, 1).dispatchEvent(event);
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

describe('checkbox retained after cell edit and cancel', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          autoCheckHierarchy:true,
          toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
          editSettings: { allowEditing: true, mode: 'Cell', allowDeleting: true, allowAdding: true, showDeleteConfirmDialog: true, newRowPosition: 'Below' },
          columns: [
            { field: 'taskID', headerText: 'Task ID', width: 90, isPrimaryKey: true, textAlign: 'Right' },
            { field: 'taskName', headerText: 'Task Name', width: 150, showCheckbox: true },
            { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' },
            { field: 'progress', headerText: 'progress', width: 80, textAlign: 'Right' }
        ],
        },
        done
      );
    });
    it('CheckBox rendering', () => {
      let click: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(2, 1).dispatchEvent(click);
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test2';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
      expect(gridObj.getRows()[2].getElementsByClassName('e-treecolumn-container')[0].children[4].className).toBe('e-treecell');
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('checkbox not rendered  after cell edit and cancel with drag and drop', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowRowDragAndDrop: true,
          autoCheckHierarchy:true,
          toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
          editSettings: { allowEditing: true, mode: 'Cell', allowDeleting: true, allowAdding: true, showDeleteConfirmDialog: true, newRowPosition: 'Below' },
          columns: [
            { field: 'taskID', headerText: 'Task ID', width: 90, isPrimaryKey: true, textAlign: 'Right' },
            { field: 'taskName', headerText: 'Task Name', width: 150, showCheckbox: true },
            { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' },
            { field: 'progress', headerText: 'progress', width: 80, textAlign: 'Right' }
        ],
        },
        done
      );
    });
    it('CheckBox renders', () => {
      let click: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(2, 1).dispatchEvent(click);
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test2';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
      expect(gridObj.getCellFromIndex(2,0).classList.contains('e-treegridcheckbox')).toBe(false);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Editing', () => {
    let gridObj: TreeGrid;
    let preventDefault: Function = new Function();
    let cellEdit: () => void;
    let actionBegin: () => void;
    let data: Object[] = sampleData;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: data.slice(0,1),
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          height: 400,
           selectionSettings: {
              mode: 'Cell'
          },
        
          editSettings: {
              allowAdding: true,
              allowEditing: true,
              allowDeleting: true,
              mode: 'Cell',
              newRowPosition: 'Child'
    
          },
          toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
          columns: [
              { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',  width: 90 },
              { field: 'taskName', headerText: 'Task Name',  },
              { field: 'startDate', headerText: 'Start', textAlign: 'Right', width: 130, showCheckbox: true },
              { field: 'progress', headerText: 'Duration', textAlign: 'Right', width: 100, }
          ],
        },
        done
      );
    });
    it('Double click',(done: Function) => {
      let click: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
     gridObj.cellEdit = (args?: Object) : void => {
        if(args['columnName'] === 'progress'){
        expect(args['type'] === 'edit').toBe(true);
        expect(args['cancel'] === 'true').toBe(false);
      }
       done();
     } 
     let cell:any = gridObj.element.querySelectorAll('.e-rowcell')[1];
     gridObj.getCellFromIndex(0, 1).dispatchEvent(click);
     gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = '102';
     gridObj.grid.keyboardModule.keyAction({ action: 'enter',preventDefault: preventDefault,  target: cell } as any);
     expect(cell.innerText = '102').toBeTruthy();
     gridObj.getCellFromIndex(0, 3).dispatchEvent(click);        
   });
   
   afterAll(() => {
     destroy(gridObj);
   });
 });

describe('update rows method', () => {
  let gridObj: TreeGrid;
  let rows: Element[];
  let actionComplete: ()=> void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
        editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Cell' },
        columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
        { field: 'taskName', headerText: 'Task Name' },
        { field: 'progress', headerText: 'Progress' },
        { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' },
      ]
      },     
      done
    );
  });
  it(' update row method with index value', () => {
    gridObj.updateRow(2,{taskID:3, taskName:"test"});
    let event: MouseEvent = new MouseEvent('dblclick', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    gridObj.getCellFromIndex(2, 3).dispatchEvent(event);
    (gridObj.editModule as any).doubleClickTarget.getElementsByTagName("input")[0].value = "20";
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    expect(gridObj.getCurrentViewRecords()[2]['duration'] === 20 ).toBeTruthy();
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

  describe('EJ2-43565 - Cell Edit with frozen Columns', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
          editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Cell' },
          frozenColumns: 1,
          columns: [
            { field: 'taskName', headerText: 'Task Name' },
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
            { field: 'progress', headerText: 'Progress' },
            { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' },
          ]
        },
        done
      );
    });
    it('Edit Movable Cell', () => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(0, 2).dispatchEvent(event);
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = '101';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      expect((gridObj.getMovableRows()[0].getElementsByClassName('e-rowcell')[1] as HTMLElement).innerText == "101").toBe(true);
    });
    it('Edit Frozen Cell', () => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(0, 0).dispatchEvent(event);
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'Planning Completed';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      expect((gridObj.getRows()[0].getElementsByClassName('e-rowcell')[0] as HTMLElement).innerText == "Planning Completed").toBe(true);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  
  describe('Tab Next Row Edit Testing - EJ2-45352', () => {
    let gridObj: TreeGrid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, allowNextRowEdit: true, mode: "Cell",
          newRowPosition: "Child" },
          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
          { field: 'taskName', headerText: 'Task Name' },
          { field: 'priority', headerText: 'priority' },
          ]
        },
        done
      );
    });
    it('Edit mode continued to the next row on tab click', () => {
      gridObj.editCell(0, 'priority');
      gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
      expect(gridObj.getRows()[0].classList.contains("e-editedrow")).toBe(true);
      gridObj.grid.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
      gridObj.grid.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
      expect(gridObj.getRows()[1].classList.contains("e-editedrow")).toBe(true);
  });
    afterAll(() => {
      destroy(gridObj);
    });
  });

    describe('Cancelling the edit action Testing - EJ2-50710', () => {
    let gridObj: TreeGrid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, allowNextRowEdit: true, mode: "Cell",
          newRowPosition: "Child" },
          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
          { field: 'taskName', headerText: 'Task Name' },
          { field: 'priority', headerText: 'priority' },
          ]
        },
        done
      );
    });
    it('Cancelling the edit action testing on escape click', () => {
      gridObj.editCell(0, 'taskName');
      gridObj.grid.keyboardModule.keyAction({ action: 'escape', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
      expect(gridObj.getRows()[0].querySelectorAll(".e-treegridexpand").length == 1).toBe(true);
  });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  
  describe('Tab Next Cell allowEdit false Testing - EJ2-51661', () => {
    let gridObj: TreeGrid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, allowNextRowEdit: true, mode: "Cell",
          newRowPosition: "Child" },
          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
          { field: 'taskName', headerText: 'Task Name' },
          { field: 'priority',allowEditing: false, headerText: 'priority' },
          ]
        },
        done
      );
    });
    it('Edit mode is not continued to the Cell on tab click', () => {
      gridObj.editCell(0, 'taskName');
      gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
      expect(gridObj.getRows()[0].classList.contains("e-editedrow")).toBe(true);
      gridObj.grid.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
      expect(gridObj.getRows()[0].classList.contains("e-editedrow")).toBe(false);
  });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-43565 - Cell Edit with isFrozen property', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
          editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Cell' },
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
            { field: 'taskName', headerText: 'Task Name', width: 200, isFrozen: true },
            { field: 'progress', headerText: 'Progress' },
            { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' },
          ]
        },
        done
      );
    });
    it('Edit Frozen Cell', () => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(0, 0).dispatchEvent(event);
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'Planning Completed';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      expect((gridObj.getRows()[0].getElementsByClassName('e-rowcell')[0] as HTMLElement).innerText == "Planning Completed").toBe(true);
    });
    it('Edit Movable Cell', () => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(0, 2).dispatchEvent(event);
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = '101';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      expect((gridObj.getMovableRows()[0].getElementsByClassName('e-rowcell')[1] as HTMLElement).innerText == "101").toBe(true);
    });
    it('Edit another Movable Cell', () => {
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(0, 3).dispatchEvent(event);
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = '51';
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      expect((gridObj.getMovableRows()[0].getElementsByClassName('e-rowcell')[2] as HTMLElement).innerText == "51").toBe(true);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-57487 - edit the cell using editCell method and press tab key for moving to another cell', () => {
    let gridObj: TreeGrid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Cell' },
          enableVirtualization: true,
          treeColumnIndex: 1,
          toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
          columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
          { field: 'taskName', headerText: 'Task Name' },
          { field: 'progress', headerText: 'Progress' },
          { field: 'startDate', headerText: 'Start Date' }
          ]
        },
        done
      );
    });
    it('Edit mode continued to the next cell on tab click', (done: Function) => {
      gridObj.editCell(2,'taskName');
      expect(gridObj.getRows()[2].classList.contains("e-editedrow")).toBe(true);
      gridObj.grid.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
      expect(gridObj.getRows()[2].getAttribute('data-rowindex') == '2').toBe(true);
      done();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-60332 - editing the dropdown column with params when Persistence enabled', () => {
    let gridObj: TreeGrid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: projectData2,
          height: 400,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          editSettings: {
              allowAdding: true,
              allowEditing: true,
          },
          enablePersistence: true,
          toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
          allowPaging: true,
          treeColumnIndex: 1,
          columns: [
              { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 140, isPrimaryKey:true },
              { field: 'TaskName', headerText: 'Task Name', width: 160 },
              { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120, format: { skeleton: 'yMd', type: 'date' }},
              { field: 'EndDate', headerText: 'End Date', textAlign: 'Right', width: 120, format: { skeleton: 'yMd', type: 'date' }},
              { field: 'Duration', headerText: 'Duration', textAlign: 'Right', width: 110,  editType: 'numericedit',
              edit: { params: { format: 'n' } },},
              { field: 'Priority', headerText: 'Priority', editType: 'dropdownedit',
              edit: {
                params: {
                  dataSource: new DataManager([
                    { name: 'Not Started', value: 'Not Started' },
                    { name: 'In Progress', value: 'In Progress' },
                    { name: 'Completed', value: 'Completed' },
                    { name: 'Rejected', value: 'Rejected' }
                  ]),
                  fields: { text: 'name', value: 'value' },
                  query: new Query(),
                },
              } }
          ]
        },
        done
      );
    });
    it('Editing the dropdown column with params', (done: Function) => {
      gridObj.editCell(2,'Priority');
      expect(gridObj.getRows()[2].classList.contains("e-editedrow")).toBe(true);
      done();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
});
