import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from './treegridutil.spec';
import { sampleData, projectData, treeMappedData, multiLevelSelfRef1, emptyChildData, allysonData } from './datasource.spec';
import { PageEventArgs, extend, Page, doesImplementInterface } from '@syncfusion/ej2-grids';
import { RowExpandingEventArgs, RowCollapsingEventArgs } from '../../src';
import { ColumnMenu } from '../../src/treegrid/actions/column-menu';
import {Toolbar} from '../../src/treegrid/actions/toolbar';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { profile, inMB, getMemoryProfile } from '../common.spec';


/**
 * Grid base spec 
 */

TreeGrid.Inject(ColumnMenu, Toolbar);

describe('TreeGrid base module', () => {
  
  beforeAll(() => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
        console.log("Unsupported environment, window.performance.memory is unavailable");
        this.skip(); //Skips test (in Chai)
        return;
    }
  });

  describe('Hierarchy Data Basic Rendering', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          showColumnMenu: true,
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
          actionBegin: (args: PageEventArgs) => {return true; },
          actionComplete: (args: PageEventArgs) => {return true; }
        },
        done
      );
    });
    it('expand testing', () => {
      rows = gridObj.getRows();
      gridObj.columnMenuModule.getColumnMenu();
      (rows[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
      expect((rows[1] as HTMLTableRowElement).style.display).toBe('none');
    });
    it('collapse testing', () => {
        rows = gridObj.getRows();
        (rows[0].getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
        expect((rows[1] as HTMLTableRowElement).style.display).toBe('table-row');
      });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Self Reference Data Basic Rendering', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: projectData,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          treeColumnIndex: 1,
          columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate']
        },
        done
      );
    });

    it('expand testing', () => {
      rows = gridObj.getRows();
      (rows[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
      expect((rows[1] as HTMLTableRowElement).style.display).toBe('none');
    });
    it('collapse testing', () => {
        rows = gridObj.getRows();
        (rows[0].getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
        expect((rows[1] as HTMLTableRowElement).style.display).toBe('table-row');
      });
    it('empty dataSource Update', (done: Function) => {
      gridObj.dataBound = (args: Object) => {
        expect((<HTMLTableElement>gridObj.getContentTable()).rows[0].classList.contains('e-emptyrow')).toBe(true);
        done();
      };
      gridObj.dataSource = [];
      gridObj.dataBind();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Self Reference DataSource update', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: projectData,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          treeColumnIndex: 1,
          columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate']
        },
        done
      );
    });
    it('dataSource Update', (done: Function) => {
      let data: Object[] = projectData.slice();
      data.push({TaskID : 52, TaskName : 'Test'});
      gridObj.dataBound = (args: PageEventArgs) => {
        rows = gridObj.getRows();
        expect((rows[rows.length - 1] as HTMLTableRowElement).cells[1].textContent).toBe('Test');
        done();
      };
      gridObj.dataSource = data;
      gridObj.dataBind();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('expandcollapse method', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
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

    it('collapse testing', () => {
        gridObj.collapseRow(null, gridObj.flatData[11]);
        rows = gridObj.getRows();
        expect((rows[12] as HTMLTableRowElement).style.display).toBe('none');
        gridObj.collapseRow(rows[0] as HTMLTableRowElement);
        expect((rows[1] as HTMLTableRowElement).style.display).toBe('none');
      });
    it('expand testing', () => {
      gridObj.expandRow(null, gridObj.flatData[11]);
      rows = gridObj.getRows();
      expect((rows[12] as HTMLTableRowElement).style.display).toBe('table-row');
      gridObj.expandRow(rows[0] as HTMLTableRowElement);
      expect((rows[1] as HTMLTableRowElement).style.display).toBe('table-row');
    });
    it('treecolumnIndex set model testing', () => {
        gridObj.treeColumnIndex = 2;
        gridObj.dataBind();
        rows = gridObj.getRows();
        expect(((rows[0] as HTMLTableRowElement).cells[2].getElementsByClassName('e-treegridexpand').length).toFixed(1));
    });
    it('getPersistData method', () => {
        expect(gridObj.getPersistData()).toBeDefined();
    });

    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('grid methods, setmodel', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
          dataBound: (args: Object) => {
            if (document.querySelectorAll('.e-popup-open').length) {
              document.querySelectorAll('.e-popup-open')[0].remove();
          }
            expect(gridObj.showSpinner).toBeDefined();
            gridObj.showSpinner();
            expect(gridObj.hideSpinner).toBeDefined();
            gridObj.hideSpinner();
            expect(gridObj.refresh).toBeDefined();
            gridObj.refresh();
            expect(gridObj.refreshHeader).toBeDefined();
            gridObj.refreshHeader();
            done();
          }
        },
        done
      );
    });
    it('setmodel', () => {
      gridObj.actionComplete = (args: PageEventArgs) => {
        expect(gridObj.grid.showColumnMenu).toBeTruthy();
      };
      gridObj.showColumnMenu = true;
      gridObj.dataBind();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('flat Data Basic Rendering', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: treeMappedData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
        },
        done
      );
    });
    it('collapse testing', () => {
      rows = gridObj.getDataRows();
      expect(rows.length).toBe(5);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('RTL Testing', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          showColumnMenu: true,
          toolbar: ['ExpandAll', 'CollapseAll'],
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
          actionBegin: (args: PageEventArgs) => {return true; },
          actionComplete: (args: PageEventArgs) => {return true; }
        },
        done
      );
    });
    it('enable RTL testing', () => {
      gridObj.enableRtl = true;
      gridObj.dataBind();
      expect(gridObj.element.querySelector('.e-grid').classList.contains('e-rtl')).toBeTruthy();
    });
    it('presence of expand/collapse tools', () => {
      let toolbarElements: Element = gridObj.grid.toolbarModule.getToolbar().firstElementChild;
      expect(toolbarElements.querySelectorAll('.e-toolbar-item')[0].getAttribute('title')).toBe('Expand All');
      expect(toolbarElements.querySelectorAll('.e-toolbar-item')[1].getAttribute('title')).toBe('Collapse All');
    });
    it('click events', () => {
        (<HTMLElement>gridObj.grid.toolbarModule.getToolbar().querySelector('#' + gridObj.grid.element.id + '_collapseall')).click();
        expect((<HTMLTableRowElement>gridObj.getRows()[1]).style.display).toBe('none');
        (<HTMLElement>gridObj.grid.toolbarModule.getToolbar().querySelector('#' + gridObj.grid.element.id + '_expandall')).click();
        expect((<HTMLTableRowElement>gridObj.getRows()[1]).style.display).toBe('table-row');
    });
    it('disable RTL testing', () => {
        gridObj.enableRtl = false;
        gridObj.dataBind();
        expect(gridObj.element.querySelector('.e-grid').classList.contains('e-rtl')).toBeFalsy();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('grid expand methods and properties', () => {
    let gridObj: TreeGrid;
    let rows: HTMLTableRowElement[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
          enableCollapseAll: true,
        },
        done
      );
    });
    it('enableCollapseAll testing', () => {
      expect(gridObj.element.querySelectorAll('.e-treegridexpand').length).toBe(0);
      gridObj.enableCollapseAll = false;
      gridObj.dataBind();
      expect(gridObj.element.querySelectorAll('.e-treegridexpand').length).toBe(9);
      gridObj.enableCollapseAll = true;
      gridObj.dataBind();
      expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(9);
      gridObj.enableCollapseAll = false;
    });
    it('expandstatemapping testing', (done: Function) => {
      gridObj.actionComplete = (args: Object) => {
        expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(0);
        done();
      };
      gridObj.expandStateMapping = 'isInExpandState';
      gridObj.dataBind();
    });
    it('collapseAtLevel testing', () => {
      gridObj.collapseAtLevel(1);
      expect(gridObj.getRows()[1].querySelectorAll('.e-treegridcollapse').length).toBe(0);
      expect(gridObj.getRows()[12].querySelectorAll('.e-treegridcollapse').length).toBe(1);
      gridObj.expandAtLevel(1);
      expect(gridObj.getRows()[12].querySelectorAll('.e-treegridexpand').length).toBe(1);
      expect(gridObj.getDataModule()).toBeDefined();
    });
    it('expandrow event testing', () => {
      rows = <HTMLTableRowElement[]>gridObj.getRows();
      gridObj.expandAll();
      gridObj.collapseRow(rows[1]);
      gridObj.collapsing = (args: RowCollapsingEventArgs) => {
        args.cancel = true;
      };
      gridObj.collapseRow(rows[0]);
      expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(0);
      gridObj.collapsing = undefined;
      gridObj.collapseRow(rows[0]);
      gridObj.expanding = (args: RowExpandingEventArgs) => {
        args.cancel = true;
      };
      gridObj.expandRow(rows[0]);
      expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(1);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('keyBoard Interaction for collapse particular parent row', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          selectionSettings: { mode:"Cell" },
          columns: ['taskID', 'taskName', 'duration', 'progress'],
        },
        done
      );
    });
    it('keyBoard Interaction', () => {
      gridObj.selectCell({ cellIndex: 1, rowIndex: 0 }, true);
      gridObj.keyboardModule.keyAction({ action: 'ctrlShiftUpArrow', preventDefault: preventDefault,
          target: gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1] } as any);
      rows = gridObj.getRows();
      expect((rows[1] as HTMLTableRowElement).style.display).toBe('none');
      gridObj.keyboardModule.keyAction({ action: 'ctrlShiftDownArrow', preventDefault: preventDefault,
          target: gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1] } as any);
      expect((rows[1] as HTMLTableRowElement).style.display).toBe('table-row');
      gridObj.keyboardModule.keyAction({ action: 'ctrlUpArrow', preventDefault: preventDefault,
          target: gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1] } as any);
      expect((<HTMLTableRowElement>gridObj.getRows()[1]).style.display).toBe('none');
      gridObj.keyboardModule.keyAction({ action: 'ctrlDownArrow', preventDefault: preventDefault,
          target: gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1] } as any);
      expect((<HTMLTableRowElement>gridObj.getRows()[1]).style.display).toBe('table-row');
      gridObj.keyboardModule.keyAction({ action: 'downArrow', preventDefault: preventDefault,
          target: gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1] } as any);
      expect(gridObj.getRows()[1].querySelectorAll(".e-focused").length).toBe(1);
      gridObj.keyboardModule.keyAction({ action: 'upArrow', preventDefault: preventDefault,
          target: gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1] } as any);
      expect(gridObj.getRows()[0].querySelectorAll(".e-focused").length).toBe(1);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Self Reference -multiple child levels', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: multiLevelSelfRef1,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          treeColumnIndex: 1,
          columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate']
        },
        done
      );
    });

    it('third inner level child', () => {
      expect(gridObj.getRows()[4].querySelector('td').innerText).toBe('44');
      expect(gridObj.getRows()[4].querySelectorAll('.e-treegridexpand').length).toBe(1);
      expect(gridObj.getRows()[5].querySelector('td').innerText).toBe('9');
      expect(gridObj.getRows()[6].querySelector('td').innerText).toBe('444');
      expect(gridObj.getRows()[9].querySelectorAll('.e-treegridexpand').length).toBe(1);
      expect(gridObj.getRows()[10].querySelectorAll('.e-treegridexpand').length).toBe(1);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });


  describe('Set height and width as 100%', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          height: '100%',
          width: '100%',
          columns: ['taskID', 'taskName', 'duration', 'progress'],
      },
      done
    );
  });
   it('Set height and width as 100%', () => {
      expect(gridObj.element.style.height).toBe('100%');
      expect(gridObj.element.style.width).toBe('100%');
  });
  afterAll(() => {
    destroy(gridObj);
  });
});


  describe('Set height and width as 100% using set model', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          columns: ['taskID', 'taskName', 'duration', 'progress'],
        },
        done
      );
    });
    it('Set height and width as 100% using set model', () => {
      gridObj.height = '100%';
      gridObj.width = '100%';
      gridObj.dataBind();
      expect(gridObj.element.style.height).toBe('100%');
      expect(gridObj.element.style.width).toBe('100%');
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

    describe('Checking dataSource property after updating', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionComplete: () => void;
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
    it('Check the length of dataSource after splicing', (done: Function) => {
      actionComplete = (args?: Object): void => {
        expect(gridObj.getRows().length == 11).toBe(true);
        expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treegridexpand"))).toBe(false);
        expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Planning").toBe(true);
        expect(isNullOrUndefined(gridObj.getRows()[5].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treegridexpand"))).toBe(false);
        expect(gridObj.getRows()[5].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Design").toBe(true);
       done();
      }
      gridObj.grid.actionComplete = actionComplete;
      gridObj.dataSource = (<any>gridObj.dataSource).splice(0,2);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('columnMenu, setmodel', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          showColumnMenu: true,
          treeColumnIndex: 1,
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });
    it('setmodel', () => {
      gridObj.columnMenuItems = [{text:'Clear Sorting', id:'gridclearsorting'}];
      expect(gridObj.columnMenuModule.getColumnMenu().children.length).toBeGreaterThan(0);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
    describe('Checking dataSource when Children property is empty', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: emptyChildData,
          childMapping: 'Children',
          treeColumnIndex: 0,
          columns: ['Name'],
        },
        done
      );
    });
    it('Checking dataSource when Children property is empty', () => {
      expect(gridObj.getRows().length != 0).toBe(true);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Check ParentData for Hierarchy data', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          columns: ['taskID', 'taskName', 'duration', 'progress'],
        },
        done
      );
    });
    it('check parentdata length after rendering', () => {
      expect(gridObj.flatData.length).toBe(36);
      expect(gridObj.parentData.length).toBe(3);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Check ParentData for Selfreference data', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: multiLevelSelfRef1,
          idMapping: 'TaskID',
          parentIdMapping: 'parentID',
          treeColumnIndex: 1,
          columns: ['TaskID', 'TaskName', 'Duration', 'Progress'],
        },
        done
      );
    });
    it('check parentdata length after rendering for selfreference data', () => {
      expect(gridObj.flatData.length).toBe(12);
      expect(gridObj.parentData.length).toBe(2);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
   describe('EJ2-22983: DataSource is not proper whose parentIDMapping record is not defined', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: allysonData,
          idMapping: 'AreaId',
          parentIdMapping: 'AreaPaiId',
          treeColumnIndex: 1,
          columns: ['AreaPaiId', 'AreaId', 'Nome']
        },
        done
      );
    });

    it('Rendering of unordered list', () => {
      expect(Object(gridObj.dataSource).length === gridObj.getCurrentViewRecords().length).toBe(true);
      expect(gridObj.getRows().length === gridObj.getCurrentViewRecords().length).toBe(true);
      gridObj.collapseAtLevel(1);
      let h: number = 0;
      (<any>(gridObj.element.querySelectorAll('.e-treegridcollapse')))
        .forEach((args: any) => {
           if (args.closest('tr').style['display'] != 'none') {
              h++;
            }
          });
      expect(h === 2).toBe(true);
      gridObj.expandAtLevel(1);
    });
    it('Collapsing testing', () => {
      let h: number = 0;
      expect(gridObj.element.querySelectorAll('.e-treegridexpand').length).toBe(18);
      gridObj.collapseRow(<HTMLTableRowElement>(gridObj.getRowByIndex(2)));
      (<any>(gridObj.element.querySelectorAll('.e-gridrowindex2level3')))
        .forEach((args: any) => {
           if (args.style['display'] === 'none') {
              h++;
            }
          });
      expect(h === 3).toBe(true);
    })
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
