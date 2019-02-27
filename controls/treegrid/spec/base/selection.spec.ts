import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from './treegridutil.spec';
import { sampleData, projectData } from './datasource.spec';
import { PageEventArgs, RowSelectEventArgs, rowSelecting, RowSelectingEventArgs, CellSelectEventArgs, RowDeselectEventArgs, CellSelectingEventArgs, cellDeselected, CellDeselectEventArgs } from '@syncfusion/ej2-grids';
import { getObject, IIndex } from '@syncfusion/ej2-grids';
import { rowSelected } from '../../src';
import { profile, inMB, getMemoryProfile } from '../common.spec';

/**
 * Grid base spec 
 */
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
     //gridObj.selectRow(0,true);
     done();
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
