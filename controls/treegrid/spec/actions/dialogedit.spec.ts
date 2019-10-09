import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData } from '../base/datasource.spec';
import { Edit } from '../../src/treegrid/actions/edit';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { profile, inMB, getMemoryProfile } from '../common.spec';

/**
 * Grid Dialog Edit spec 
 */
TreeGrid.Inject(Edit, Toolbar);
describe('Dialog Edit module', () => {
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
            editSettings: { allowEditing: true, mode: 'Dialog', allowDeleting: true, allowAdding: true, newRowPosition: 'Top' },

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
    it('edit row', (done: Function) => {
      actionComplete = (args?: any): void => {
        expect(document.getElementById(gridObj.grid.element.id + '_dialogEdit_wrapper')).not.toBeNull();
        done();
      };
      gridObj.actionComplete = actionComplete;
      gridObj.selectRow(2);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
    });
    it('edit row - modify data', (done: Function) => {
        let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
        (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'test';
        actionComplete = (args?: any): void => {
          let cells: NodeListOf<Element> = gridObj.grid.getRows()[2].querySelectorAll('.e-rowcell');
          expect(cells[1].textContent ).toBe('test');
          expect(gridObj.dataSource[0].subtasks[1].taskName === 'test').toBeTruthy();
          done();
        };
        gridObj.actionComplete = actionComplete;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
      });
    it('set settings - property changes', (done: Function) => {
    gridObj.actionComplete = (args: any) => {
        expect(gridObj.grid.editSettings.mode === 'Normal').toBeTruthy();
        done();
    };
    gridObj.editSettings.mode = 'Row';
    gridObj.dataBind();
    });
    it('editmethods', () => {
      gridObj.actionComplete = (args: any) => {
          expect(gridObj.addRecord()).toBeDefined();
          expect(gridObj.closeEdit()).toBeDefined();
          expect(gridObj.deleteRecord()).toBeDefined();
          expect(gridObj.deleteRow(gridObj.getRows()[0])).toBeDefined();
          expect(gridObj.endEdit()).toBeDefined();
          expect(gridObj.getPrimaryKeyFieldNames()).toBeDefined();
          expect(gridObj.startEdit()).toBeDefined();
          expect(gridObj.editModule.destroy()).toBeDefined();

      };
      gridObj.editSettings.allowAdding = false;
      gridObj.editSettings.allowEditing = false;
      gridObj.editSettings.allowAdding = false;
      gridObj.dataBind();
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
