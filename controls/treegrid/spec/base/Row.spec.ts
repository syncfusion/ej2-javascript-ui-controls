import { sampleData } from './datasource.spec';
import { createGrid, destroy } from './treegridutil.spec';
import { TreeGrid } from '../../src';
import { Data } from '@syncfusion/ej2-grids';

describe('TreeGrid Row module', () => {
    describe('gridLines', () => {
        let gridObj: TreeGrid;
        let rows: Element[];
        beforeAll((done: Function) => {
          gridObj = createGrid(
            {
              dataSource: sampleData,
              childMapping: 'subtasks',
              treeColumnIndex: 1,
              gridLines: 'None',
              columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
            },
            done
          );
        });
        it('gridline testing', () => {
            expect(gridObj.grid.element.classList.contains('e-hidelines')).toBe(true);
          });
        it('gridline setmodel testing', () => {
          gridObj.gridLines = 'Vertical';
          gridObj.dataBind();
          expect(gridObj.grid.element.classList.contains('e-verticallines')).toBe(true);
        });
        afterAll(() => {
          destroy(gridObj);
        });
      });
    describe('gridhover, alt row, rowHeight', () => {
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

      it('row hoversetmodel testing', () => {
        gridObj.enableHover = false;
        gridObj.dataBind();
        expect(gridObj.grid.element.classList.contains('e-gridhover')).toBe(false);
        gridObj.enableAltRow = false;
        expect(gridObj.grid.element.classList.contains('e-altrow')).toBe(false);
      });
      it('row hoversetmodel testing', (done: Function) => {
        gridObj.dataBound = (args: Object) => {
          expect(gridObj.getRows()[1].style.height).toBe('60px');
          done();
        };
        gridObj.rowHeight = 60;
        gridObj.dataBind();
      });
      afterAll(() => {
        destroy(gridObj);
      });
    });
    describe('rows methods', () => {
      let gridObj: TreeGrid;
      let rows: Element[];
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
          },
          done
        );
      });
      it('methods', () => {
        rows = gridObj.getDataRows();
        expect(rows.length).toEqual(gridObj.getCurrentViewRecords().length)
        expect(gridObj.getRowInfo(<Element | EventTarget>gridObj.element).toString()).toBe({}.toString());
      });
      afterAll(() => {
        destroy(gridObj);
      });
    });
});