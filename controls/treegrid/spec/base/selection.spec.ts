import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from './treegridutil.spec';
import { sampleData, projectData, sampleData1 } from './datasource.spec';
import { RowSelectEventArgs, RowSelectingEventArgs, CellSelectEventArgs, CheckBoxChangeEventArgs } from '@syncfusion/ej2-grids';
import { RowDeselectEventArgs, CellSelectingEventArgs, CellDeselectEventArgs } from '@syncfusion/ej2-grids';
import { getObject, IIndex } from '@syncfusion/ej2-grids';
import { rowSelected, CellSaveEventArgs } from '../../src';
import { Sort } from '../../src/treegrid/actions/sort';
import { Page } from '../../src/treegrid/actions/page';
import { Filter } from '../../src/treegrid/actions/filter';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { SelectedEventArgs } from '@syncfusion/ej2-inputs';
import { profile, inMB, getMemoryProfile } from '../common.spec';

/**
 * Grid base spec 
 */

TreeGrid.Inject(Sort,Page,Filter,Toolbar);

describe('Selection module', () => {
  beforeAll(() => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
        console.log("Unsupported environment, window.performance.memory is unavailable");
        this.skip(); //Skips test (in Chai)
        return;
    }
  });

  describe('Row Selection', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionComplete: ()=>void;
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

    it('Row Selection and Public Methods', () => {
        gridObj.selectRow(2);
        expect(gridObj.getRows()[2].getElementsByClassName('e-active').length > 0).toBe(true);
      });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Row Selection Multiple', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionComplete: ()=>void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          selectionSettings: {type: 'Multiple'},
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });
      it('Row Selection and SelectRows Method', () => {
       gridObj.selectRows([3,4]);
        expect(gridObj.getSelectedRows().length === 2).toBe(true);
        expect(gridObj.getSelectedRowIndexes().indexOf(3) === 0).toBe(true);
        expect(gridObj.getSelectedRowIndexes().indexOf(4) === 1).toBe(true);
        let row: Object = gridObj.getSelectedRecords()[0];
        gridObj.clearSelection();
        expect(gridObj.getSelectedRows().length === 0).toBe(true);
      });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Cell Selection and public methods', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          selectionSettings: { type: 'Multiple' },
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });

    it('Cell Selection and Public methods', (done: Function) => {
            gridObj.selectionSettings.mode = 'Cell';
            setTimeout(() => {
            gridObj.selectCell({ cellIndex: 1, rowIndex: 3 });
            expect(gridObj.getSelectedRowCellIndexes().length === 1).toBe(true);
            gridObj.selectCell({ cellIndex: 1, rowIndex: 3 }, true);
            expect(gridObj.getSelectedRowCellIndexes().length === 0).toBe(true);
            done();
            }, 1000);
      });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Row Selection Disable', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          selectionSettings: { type: 'Multiple' },
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });

    it('Disable the Row selection method', (done: Function) => {
            gridObj.selectRow(1);
            gridObj.allowSelection = false;
            setTimeout(() => {
                expect(gridObj.getRows()[1].getElementsByClassName('e-active').length === 0).toBe(true);
            done();
            }, 1000);
      });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Row Selection Events', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let rowSelected: () => void;
    let rowSelecting: () => void;
    beforeAll((done: Function) => {
      rowSelected = (args?: RowSelectEventArgs): void => {
            expect(args.rowIndex === 0).toBe(true);
            done();
      }
      rowSelecting = (args?: RowSelectEventArgs): void => {
            expect(args.rowIndex === 0).toBe(true);
            done();
      }
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          rowSelected: rowSelected,
          rowSelecting: rowSelecting,
          selectionSettings: { type: 'Multiple' },
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });
    it('SelectRow method and events', (done: Function) => {
     gridObj.selectRow(0);
     //gridObj.selectRow(0,true);
     done();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Row DeSelection events', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let rowDeselected: () => void;
    let rowDeselecting: () => void;
    beforeAll((done: Function) => {
      rowDeselected = (args?: RowDeselectEventArgs): void => {
            expect(args.rowIndex === 0).toBe(true);
            done();
      }
      rowDeselecting = (args?: RowDeselectEventArgs): void => {
            expect(args.rowIndex === 0).toBe(true);
            done();
      }
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          rowDeselected: rowDeselected,
          rowDeselecting: rowDeselecting,
          selectionSettings: { type: 'Multiple' },
          selectedRowIndex: 0,
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });
    it('Row Selection Events', (done: Function) => {
     gridObj.selectRow(0,true);
     done();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });


  describe('TreeGrid CheckBoxSelection1', () => {
    let gridObj: TreeGrid;
    let rowSelected: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 2,
          allowPaging: true,
          selectionSettings: { persistSelection: true },
          columns: [
            { type: 'checkbox', width: 80 },
            { field: 'taskID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Customer ID', width: 150 },
            { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
            { field: 'progress', headerText: 'Ship Name', width: 150 },
          ],
        },
        done
      );
    });

    it('Selecting First row', (done: Function) => {
      rowSelected = (): void => {
          expect(gridObj.getSelectedRowIndexes()[0]).toBe(5);
          gridObj.rowSelected = null;
          done();
      };
      gridObj.rowSelected = rowSelected;
      (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[5].querySelector('.e-rowcell')).click();
      expect(gridObj.getRows()[5].children[0].querySelector('.e-checkselect').classList.contains("e-focus")).toBeTruthy();
      expect(gridObj.getRows()[5].hasAttribute('aria-selected')).toBeTruthy();
      expect(gridObj.getRows()[5].firstElementChild.classList.contains("e-selectionbackground")).toBeTruthy();
      expect(gridObj.getSelectedRecords().length).toBe(1);
      expect(gridObj.getSelectedRowIndexes().length).toBe(1);
  });

  it('Selecting Second row', (done: Function) => {
      rowSelected = (): void => {
          expect(gridObj.getSelectedRowIndexes()[1]).toBe(8);
          gridObj.rowSelected = null;
          done();
      };
      gridObj.rowSelected = rowSelected;
      (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[8].querySelector('.e-rowcell')).click();
      expect(gridObj.getRows()[8].children[0].querySelector('.e-checkselect').classList.contains("e-focus")).toBeTruthy();
      expect(gridObj.getRows()[8].hasAttribute('aria-selected')).toBeTruthy();
      expect(gridObj.getRows()[8].firstElementChild.classList.contains("e-selectionbackground")).toBeTruthy();
      expect(gridObj.getSelectedRecords().length).toBe(2);
      expect(gridObj.getSelectedRowIndexes().length).toBe(2);
  });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('TreeGrid CheckBoxSelection2', () => {
    let gridObj: TreeGrid;
    let rowSelected: () => void;
    let rowDeselected: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 2,
          allowPaging: true,
          selectionSettings: { persistSelection: true },
          columns: [
            { type: 'checkbox', width: 80 },
            { field: 'taskID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Customer ID', width: 150 },
            { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
            { field: 'progress', headerText: 'Ship Name', width: 150 },
          ],
        },
        done
      );
    });

    it('Selecting Header CheckBox', (done: Function) => {
      rowSelected = (): void => {
          expect(gridObj.getSelectedRowIndexes().length).toBe(12);
          gridObj.rowSelected = null;
          done();
      };
      gridObj.rowSelected = rowSelected;
      (<HTMLElement>gridObj.element.querySelector('.e-checkselectall')).click();
      expect(gridObj.getSelectedRowIndexes()[8]).toBe(8);
      expect(gridObj.getSelectedRowIndexes()[10]).toBe(10);
      expect(gridObj.getRows()[8].hasAttribute('aria-selected')).toBeTruthy();
      expect(gridObj.getRows()[8].firstElementChild.classList.contains("e-selectionbackground")).toBeTruthy();
      expect(gridObj.getSelectedRecords()[2]['taskName']).toBe('Plan budget');
      expect(gridObj.getSelectedRecords()[13]['taskName']).toBe('Implementation Module 1');
      expect(gridObj.getSelectedRecords().length).toBe(36);
      gridObj.goToPage(2);
      expect(gridObj.getRows()[10].hasAttribute('aria-selected')).toBeTruthy();
      expect(gridObj.getRows()[10].firstElementChild.classList.contains("e-selectionbackground")).toBeTruthy();
  });

  it('Deselect the Header Checkbox', (done: Function) => {
    rowDeselected = (): void => {
          expect(gridObj.getSelectedRowIndexes().length).toBe(0);
          gridObj.rowDeselected = null;
          done();
      };
      gridObj.rowDeselected = rowDeselected;
      (<HTMLElement>gridObj.element.querySelector('.e-checkselectall')).click();
  });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('TreeGrid CheckBoxSelection3', () => {
    let gridObj: TreeGrid;
    let rowSelected: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 2,
          selectionSettings: { persistSelection: true, checkboxOnly: true },
          columns: [
            { type: 'checkbox', width: 80 },
            { field: 'taskID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Customer ID', width: 150 },
            { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
            { field: 'progress', headerText: 'Ship Name', width: 150 },
          ],
        },
        done
      );
    });

    it('Selecting the first row', (done: Function) => {
      rowSelected = (): void => {
          expect(gridObj.getSelectedRowIndexes()[0]).toBe(3);
          gridObj.rowSelected = null;
          done();
      };
      gridObj.rowSelected = rowSelected;
      (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[3].querySelector('.e-rowcell').querySelector(".e-checkselect")).click();
      expect(gridObj.getRows()[3].children[0].querySelector('.e-checkselect').classList.contains("e-focus")).toBeTruthy();
      expect(gridObj.getRows()[3].hasAttribute('aria-selected')).toBeTruthy();
      expect(gridObj.getRows()[3].firstElementChild.classList.contains("e-selectionbackground")).toBeTruthy();
      expect(gridObj.getSelectedRecords().length).toBe(1);
      expect(gridObj.getSelectedRowIndexes().length).toBe(1);
  });

  it('Selecting the second row', (done: Function) => {
    rowSelected = (): void => {
          expect(gridObj.getSelectedRowIndexes()[1]).toBe(7);
          gridObj.rowSelected = null;
          done();
      };
      gridObj.rowSelected = rowSelected;
      (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[7].querySelector('.e-rowcell').querySelector(".e-checkselect")).click();
      expect(gridObj.getRows()[7].children[0].querySelector('.e-checkselect').classList.contains("e-focus")).toBeTruthy();
      expect(gridObj.getRows()[7].hasAttribute('aria-selected')).toBeTruthy();
      expect(gridObj.getRows()[7].firstElementChild.classList.contains("e-selectionbackground")).toBeTruthy();
      expect(gridObj.getSelectedRecords().length).toBe(2);
      expect(gridObj.getSelectedRowIndexes().length).toBe(2);
  });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('TreeGrid CheckBoxSelection4', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowSorting: true,
          allowPaging: true,
          treeColumnIndex: 2,
          selectionSettings: { persistSelection: true },
          columns: [
            { type: 'checkbox', width: 80 },
            { field: 'taskID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Customer ID', width: 150 },
            { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
            { field: 'progress', headerText: 'Ship Name', width: 150 },
          ],
        },
        done
      );
    });

    it('CheckBox Selection with Sorting', (done: Function) => {
      actionComplete = (args?: CellSaveEventArgs): void => {
          if (args.requestType == 'sorting') {
            expect(gridObj.getSelectedRowIndexes().length).toBe(3);
            expect(gridObj.getSelectedRowIndexes()[0]).toBe(2);
            expect(gridObj.getSelectedRowIndexes()[1]).toBe(4);
            expect(gridObj.getSelectedRowIndexes()[2]).toBe(5);
            gridObj.actionComplete = null;
            done();
          }
          done();
      };
      gridObj.actionComplete = actionComplete;
      (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[9].querySelector('.e-rowcell')).click();
      (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[8].querySelector('.e-rowcell')).click();
      (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[6].querySelector('.e-rowcell')).click();
      expect(gridObj.getSelectedRowIndexes()[0]).toBe(9);
      expect(gridObj.getSelectedRowIndexes()[1]).toBe(8);
      expect(gridObj.getSelectedRowIndexes()[2]).toBe(6);
      gridObj.sortByColumn('taskName', 'Ascending', true);
  });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  
  describe('EJ2-62012 - selection not persisted for parent records on Expand/Collapse action', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 2,
          selectionSettings: { persistSelection: true },
          columns: [
            { type: 'checkbox', width: 80 },
            { field: 'taskID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Customer ID', width: 150 },
            { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
            { field: 'progress', headerText: 'Ship Name', width: 150 },
          ],
        },
        done
      );
    });

    it('Checkbox selection on Expand/Collapse', () => {
      (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[0].querySelector('.e-rowcell')).click();
      (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[1].querySelector('.e-rowcell')).click();
      expect(gridObj.getSelectedRowIndexes().length).toBe(2);
      gridObj.collapseRow(gridObj.getRows()[0], gridObj.getCurrentViewRecords()[0]);
      expect(gridObj.getSelectedRowIndexes().length).toBe(2);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  
  describe('EJ2-64603 - TreeColumnIndex cell was selected while performing Expand/Collapse action', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowSelection: true,
          selectionSettings: { mode: 'Cell' },
          columns: [
            { field: 'taskID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Customer ID', width: 150 },
            { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
            { field: 'progress', headerText: 'Ship Name', width: 150 },
          ],
        },
        done
      );
    });

    it('TreeColumnIndex cellSelection on Expand/Collapse', () => {
      gridObj.collapseRow(gridObj.getRows()[0], gridObj.getCurrentViewRecords()[0]);
      expect(gridObj.getRows()[0].querySelector('.e-treerowcell').classList.contains('e-cellselectionbackground')).toBe(false);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  
  describe('TreeGrid CheckBoxSelection5', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 2,
          selectionSettings: { persistSelection: true },
          columns: [
            { type: 'checkbox', width: 80 },
            { field: 'taskID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Customer ID', width: 150 },
            { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
            { field: 'progress', headerText: 'Ship Name', width: 150 },
          ],
        },
        done
      );
    });

    it('Set Model for checkboxOnly', () => {
      (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[0].querySelector('.e-rowcell')).click();
      expect(gridObj.getSelectedRowIndexes().length).toBe(1);
      gridObj.selectionSettings.checkboxOnly = true;
      gridObj.dataBind();
      (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[1].querySelector('.e-rowcell')).click();
      expect(gridObj.getSelectedRowIndexes().length).toBe(1);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('TreeGrid CheckBoxSelection6', () => {
    let gridObj: TreeGrid;
    let rowSelected: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 2,
          selectionSettings: { persistSelection: true },
          columns: [
            { type: 'checkbox', width: 80 },
            { field: 'taskID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Customer ID', width: 150 },
            { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
            { field: 'progress', headerText: 'Ship Name', width: 150 },
          ],
        },
        done
      );
    });

    it('Select records using selectRows method', (done: Function) => {
      rowSelected = (): void => {
        expect(gridObj.getSelectedRowIndexes()[0]).toBe(12);
        gridObj.rowSelected = null;
        done();
      };
      gridObj.rowSelected = rowSelected;
      gridObj.selectRow(12);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('TreeGrid CheckBoxSelection using selectedRowIndex', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 2,
          selectedRowIndex: 5,
          columns: [
            { type: 'checkbox', width: 80 },
            { field: 'taskID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Customer ID', width: 150 },
            { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
            { field: 'progress', headerText: 'Ship Name', width: 150 },
          ],
        },
        done
      );
    });

    it('CheckBoxSelection with selected row index', () => {
      expect(gridObj.getSelectedRowIndexes()[0]).toBe(5);
      expect(gridObj.getRows()[5].children[0].querySelector('.e-checkselect').classList.contains("e-focus")).toBeTruthy();
      expect(gridObj.getRows()[5].hasAttribute('aria-selected')).toBeTruthy();
      expect(gridObj.getRows()[5].firstElementChild.classList.contains("e-selectionbackground")).toBeTruthy();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('TreeGrid CheckBoxSelection Events', () => {
    let gridObj: TreeGrid;
    let rowSelecting:() => void;
    let checkBoxChange: () => void;
    let rowDeselecting: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 2,
          selectionSettings: { persistSelection: true },
          columns: [
            { type: 'checkbox', width: 80 },
            { field: 'taskID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Customer ID', width: 150 },
            { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
            { field: 'progress', headerText: 'Ship Name', width: 150 },
          ],
        },
        done
      );
    });

    it('Events for checkBox Selection', (done: Function) => {
      rowSelecting = (args?: RowSelectingEventArgs): void => {
        if (args.rowIndex === 9) {
          expect(args.rowIndex).toBe(9);
          gridObj.rowSelecting = null;
        }
        done();
      };
      checkBoxChange = (args?: CheckBoxChangeEventArgs): void => {
        expect(args.checked).toBeTruthy();
        expect(args.selectedRowIndexes[0]).toBe(3);
        gridObj.checkboxChange = null;
        done();
      };
      rowDeselecting = (args?: RowDeselectEventArgs): void => {
        if (args.rowIndex === 9) {
          expect(args.rowIndex).toBe(9);
          gridObj.rowDeselecting = null;
        }
        done();
      };
      gridObj.rowSelecting = rowSelecting;
      gridObj.checkboxChange = checkBoxChange;
      gridObj.rowDeselecting = rowDeselecting;
      (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[9].querySelector('.e-rowcell')).click();
      (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[9].querySelector('.e-rowcell')).click();
      (<HTMLElement>gridObj.element.querySelectorAll('.e-row')[3].querySelector('.e-rowcell').querySelector(".e-checkselect")).click();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('TreeGrid CheckBoxSelection7', () => {
    let gridObj: TreeGrid;
    let rowSelected: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowSorting: true,
          allowPaging: true,
          treeColumnIndex: 2,
          selectionSettings: { persistSelection: true },
          columns: [
            { type: 'checkbox', field: 'approved', width: 80 },
            { field: 'taskID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Customer ID', width: 150 },
            { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
            { field: 'progress', headerText: 'Ship Name', width: 150 },
          ],
        },
        done
      );
    });

    it('CheckBox Selection with field', (done: Function) => {
      actionComplete = (args?: CellSaveEventArgs): void => {
        if (args.requestType === 'sorting') {
          expect(gridObj.getSelectedRowIndexes()[0]).toBe(1);
          expect(gridObj.getSelectedRowIndexes()[1]).toBe(2);
          expect(gridObj.getSelectedRowIndexes()[2]).toBe(4);
          gridObj.actionComplete = null;
          done();
        }
        done();
      };
      rowSelected = (args?: RowSelectEventArgs): void => {
        if (args.rowIndex === 2) {
          expect(gridObj.getSelectedRowIndexes()[0]).toBe(2);
          expect(gridObj.getSelectedRowIndexes()[1]).toBe(4);
          expect(gridObj.getSelectedRowIndexes()[2]).toBe(8);
          expect(gridObj.getSelectedRowIndexes().length).toBe(5);
        }
        gridObj.rowSelected = null;
        done();
      };
    gridObj.rowSelected = rowSelected;
    gridObj.actionComplete = actionComplete;
    gridObj.sortByColumn('taskName', 'Ascending', true);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Cell Selection events', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let cellSelected: () => void;
    let cellSelecting: () => void;
    let cellDeselected: () => void;
    let cellDeselecting: () => void;
    beforeAll((done: Function) => {
      cellSelected = (args?: CellSelectEventArgs): void => {
            expect(args.cellIndex.cellIndex === 1).toBe(true);
            expect(args.cellIndex.rowIndex === 0).toBe(true);
            done();
      }
      cellSelecting = (args?: CellSelectingEventArgs): void => {
        expect(args.cellIndex.cellIndex === 1).toBe(true);
        expect(args.cellIndex.rowIndex === 0).toBe(true);
            done();
      }
      cellDeselected = (args?: CellDeselectEventArgs): void => {
        expect(args.cellIndexes[0].rowIndex === 0).toBe(true);
        expect(args.cellIndexes[0].cellIndexes[0] === 1).toBe(true);
        done();
      }
      cellDeselecting = (args?: CellDeselectEventArgs): void => {
        expect(args.cellIndexes[0].rowIndex === 0).toBe(true);
        expect(args.cellIndexes[0].cellIndexes[0] === 1).toBe(true);
            done();
      }
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          cellSelected: cellSelected,
          cellSelecting: cellSelecting,
          cellDeselected: cellDeselected,
          cellDeselecting: cellDeselecting,
          selectionSettings: { type: 'Multiple' },
          selectedRowIndex: 0,
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });
    it('Row Selection Events', (done: Function) => {
     gridObj.selectCell({rowIndex: 0, cellIndex: 1});
     gridObj.selectCell({rowIndex: 0, cellIndex: 1},true);
     //gridObj.selectRow(0,true);
     done();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('TreeGrid enabletoggle', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 2,
          selectionSettings: { enableToggle: false },
          columns: [
            { field: 'taskID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Customer ID', width: 150 },
            { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
            { field: 'progress', headerText: 'Ship Name', width: 150 },
          ],
        },
        done
      );
    });

    it('set model for enabletoggle', (done: Function) => {
       (gridObj.getRows()[0].getElementsByClassName('e-rowcell')[0] as HTMLElement).click();
       (gridObj.getRows()[0].getElementsByClassName('e-rowcell')[0] as HTMLElement).click();
      expect(gridObj.getRows()[0].getElementsByClassName('e-active').length > 0).toBe(true);
      done();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-60435 - selecting multiple hierarchy levels checkbox with searching and filtering', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData1,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          height: '410',
          autoCheckHierarchy: true,
          toolbar: ['Search'],
          allowFiltering:true,
          allowSelection: true,
          selectionSettings: { type: 'Multiple'},
          columns: [
            { field: 'taskID', headerText: 'Order ID', isPrimaryKey: true, width: 120 },
            { field: 'taskName', headerText: 'Customer ID', width: 150, showCheckbox: true },
            { field: 'duration', headerText: 'Freight', type: "number", width: 150 },
            { field: 'progress', headerText: 'Ship Name', width: 150 },
          ],
        },
        done
      );
    });

    it('CheckBox Selection with searching', (done: Function) => {
      actionComplete = (args?: CellSaveEventArgs): void => {
        if (args.requestType === 'searching') {
          expect((gridObj.getCurrentViewRecords()[3] as any).taskID === 13).toBe(true);
          expect((gridObj.getCurrentViewRecords()[3] as any).checkboxState === 'check').toBe(true);
          gridObj.actionComplete = null;
          done();
        }
      };
    (gridObj.element.querySelectorAll('.e-row')[12].getElementsByClassName('e-frame e-icons')[0] as any).click();
    gridObj.search("Planning");
    gridObj.actionComplete = actionComplete;
    });

    it('CheckBox Selection with filtering', (done: Function) => {
      actionComplete = (args?: CellSaveEventArgs): void => {
        if (args.requestType === 'filtering') {
          expect((gridObj.getCurrentViewRecords()[3] as any).taskID === 13).toBe(true);
          expect((gridObj.getCurrentViewRecords()[3] as any).checkboxState === 'check').toBe(true);
          gridObj.actionComplete = null;
          done();
        }
      };
    gridObj.search("");
    (gridObj.element.querySelectorAll('.e-row')[3].getElementsByClassName('e-frame e-icons')[0] as any).click();
    (gridObj.element.querySelectorAll('.e-row')[3].getElementsByClassName('e-frame e-icons')[0] as any).click();
    gridObj.filterByColumn('taskName', 'startswith', 'Planning');
    gridObj.actionComplete = actionComplete;
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-64820 - selectedItems not getting properly after performing Filter and click the header checkbox', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowFiltering: true,
          allowSelection: true,
          filterSettings: {
              type: 'Menu',
              ignoreAccent: true,
              hierarchyMode: 'Both',
          },
          editSettings: {
              allowEditing: true,
              mode: 'Row',
          },
          selectionSettings: { persistSelection: true },
          height: 410,
          enableCollapseAll : true,
          autoCheckHierarchy :true,
          treeColumnIndex: 1,
          columns: [
            { field:"", showCheckbox:true, width:"50", allowEditing:false},
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 90, textAlign: 'Right', allowEditing:false},
            { field: 'taskName', headerText: 'Task Name', width: 180, allowEditing:false },
            { field: 'priority', headerText: 'Priority', width: 90, allowEditing:false },
            { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right', allowEditing:false }
          ],
        },
        done
      );
    });

    it('CheckBox Selection with filtering', (done: Function) => {
      actionComplete = (args?: CellSaveEventArgs): void => {
        if (args.requestType === 'filtering') {
          gridObj.filterByColumn('taskName', 'contains', 13);
          expect(gridObj.selectionModule.getCheckedrecords().length == 0).toBe(true);
          done();
        }
      };
    gridObj.actionComplete = actionComplete;
    done();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-65181- Accessibility issue - Checkbox column sample in audio mismatch ', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          height: '410',
          autoCheckHierarchy: true,
          columns: [
            { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 60, textAlign: 'Right' },
            { field: 'taskName', headerText: 'Task Name', width: 150, textAlign: 'Left', showCheckbox: true },
            { field: 'startDate', headerText: 'Start Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd' },
          ]
        },
        done
      );
    });
    it('aria-checked attribute checked', () => {
      (gridObj.element.querySelectorAll('.e-row')[0].getElementsByClassName('e-frame e-icons')[0] as any).click();
      expect((gridObj.element.querySelectorAll('.e-row')[0].querySelectorAll('.e-treecheckselect')[0] as any).hasAttribute('aria-checked')).toBe(true);
      expect((gridObj.element.querySelectorAll('.e-row')[0].querySelectorAll('.e-treecheckselect')[0] as any).hasAttribute('aria-label')).toBe(true);
      expect((gridObj.element.querySelectorAll('.e-row')[0].getElementsByClassName('e-frame e-icons')[0] as any).hasAttribute('title')).toBe(true);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  
  describe('EJ2-65673-When performing an expand or collapse operation the row is selected', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          height: 350,
          treeColumnIndex: 1,
          columns: [
            { field: 'taskID', headerText: 'Task ID', width: 70, textAlign: 'Right' },
            { field: 'taskName', headerText: 'Task Name', width: 200, textAlign: 'Left' },
            { field: 'startDate', headerText: 'Start Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd' },

          ],
        },
        done
      );
    });
    it('checking the selection records while collapse the row', () => {
      gridObj.selectRow(1);
      (gridObj.getRows()[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
      expect(gridObj.getSelectedRowIndexes()[0]).toBe(1);
    });
    it('checking the selection records while expand the row', () => {
      gridObj.selectRow(1);
      (gridObj.getRows()[0].getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
      expect(gridObj.getSelectedRowIndexes()[0]).toBe(1);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Performing expand/collapse operation with paging', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          height: 350,
          allowPaging: true,
          treeColumnIndex: 1,
          columns: [
            { field: 'taskID', headerText: 'Task ID', width: 70, textAlign: 'Right' },
            { field: 'taskName', headerText: 'Task Name', width: 200, textAlign: 'Left' },
            { field: 'startDate', headerText: 'Start Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd' },

          ],
        },
        done
      );
    });
    it('checking the selection records while collapse the row', () => {
      gridObj.selectRow(1);
      gridObj.selectRow(2);
      gridObj.selectRow(3);
      gridObj.selectRow(4);
      (gridObj.getRows()[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
      expect(gridObj.getSelectedRowIndexes().length === 0).toBe(true);
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
