import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { Aggregate } from '../../src/treegrid/actions/summary';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { projectData, sampleData } from '../base/datasource.spec';
import { Page } from '../../src/treegrid/actions/page';
import { RowExpandedEventArgs, RowCollapsedEventArgs, RowCollapsingEventArgs } from '../../src';
import { Filter } from '../../src/treegrid/actions/filter';
import { ActionEventArgs } from '@syncfusion/ej2-grids';
/**
 * Grid Toolbar spec 
 */
TreeGrid.Inject(Page, Filter, Aggregate);
describe('TreeGrid Pager module', () => {
  describe('Pager', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                allowPaging: true,
                pageSettings: {
                    pageSize: 2, currentPage: 2, pageCount: 4
                },
                columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate']
            },
            done
        );
    });

    it('current page testing', () => {
        expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('index')).toBe('2');
    });
    it('gotpage testing', () => {
        gridObj.goToPage(2);
        expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('index')).toBe('2');
    });
    it('set model testing pager settings', () => {
        gridObj.pageSettings = {currentPage: 1};
        gridObj.dataBind();
        expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('index')).toBe('1');
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Pager setModel', () => {
    let gridObj: TreeGrid;
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
    it('set model testing pager', (done: Function) => {
        gridObj.actionComplete = () => {
            expect(gridObj.getPager().querySelectorAll('.e-pagercontainer').length).toBe(1);
            done();
        };
        gridObj.allowPaging = true;
        gridObj.dataBind();
    });
    it('module methods', () => {
        gridObj.pagerModule.goToPage(2);
        gridObj.pagerModule.refresh();
        gridObj.pagerModule.updateExternalMessage('Test');
        expect(gridObj.getPager()).toBeDefined();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Pager Modes', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
               childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowSelection: true,
                allowPaging:true,
                pageSettings: { pageSizeMode: 'Root', pageSize: 2 },
                columns: ['taskID', 'taskName', 'startDate', 'endDate']
            },
            done
        );
    });
    it('Pager Mode - root', () => {
        expect(gridObj.getRows().length).toBe(11);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Pager Modes - All', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
               childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowSelection: true,
                allowPaging:true,
                pageSettings: { pageSizeMode: 'All', pageSize: 2 },
                columns: ['taskID', 'taskName', 'startDate', 'endDate']
            },
            done
        );
    });
    it('Pager Mode - Check the current view', () => {
        expect(gridObj.getRows().length).toBe(2);
    });
    it('Pager Mode - Checking collapse action', (done: Function) => {
        gridObj.collapsed = (args?: RowCollapsedEventArgs) => {
            expect(gridObj.getRows()[0].querySelector('span').classList.contains('e-treegridcollapse')).toBe(true);
            done();
        }
        gridObj.collapseRow(gridObj.getRows()[0], gridObj.getCurrentViewRecords()[0]);
    });
    it('Pager Mode - Checking expand action', (done: Function) => {
        gridObj.expanded = (args?: RowExpandedEventArgs) => {
            expect(gridObj.getRows()[0].querySelector('span').classList.contains('e-treegridexpand')).toBe(true);
            done();
        }
        gridObj.expandRow(gridObj.getRows()[0], gridObj.getCurrentViewRecords()[0]);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Pager Modes - Checking visibility', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
               childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowSelection: true,
                allowPaging:true,
                pageSettings: { pageSizeMode: 'All', pageSize: 4, currentPage: 6 },
                columns: ['taskID', 'taskName', 'startDate', 'endDate']
            },
            done
        );
    });
    it('Checke the row count', () => {
        expect(gridObj.getRows().length).toBe(4);
    });
    it('Checking visibility of the inner level records', (done: Function) => {
        gridObj.collapsed = (args?: RowCollapsedEventArgs) => {
            expect((<HTMLElement>(gridObj.getRows()[1].querySelector('span.e-treecell'))).innerText === 'Phase 3').toBe(true);
            done();
        }
        gridObj.collapseRow(gridObj.getRows()[0], gridObj.getCurrentViewRecords()[0]);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Pager Modes with Filtering functionality', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
               childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowSelection: true,
                allowPaging:true,
                allowFiltering: true,
                filterSettings: {hierarchyMode: 'Child',
                    columns: [{field: 'taskName', operator: 'startswith', value: 'Implementation phase'}]
                },
                pageSettings: { pageSizeMode: 'Root', pageSize: 4 },
                columns: ['taskID', 'taskName', 'startDate', 'endDate']
            },
            done
        );
    });
    it('Check data count', () => {
        expect(gridObj.getRows().length).toBe(25);
        expect(gridObj.grid.pageSettings.totalRecordsCount).toBe(1);
        expect((<HTMLElement>(gridObj.getRowByIndex(0).querySelector('span.e-treecell'))).innerText === 'Implementation Phase').toBe(true);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Pager Modes - destroy', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
               childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowSelection: true,
                allowPaging:true,
                allowFiltering: true,
                filterSettings: {hierarchyMode: 'Child',
                    columns: [{field: 'taskName', operator: 'startswith', value: 'Implementation phase'}]
                },
                pageSettings: { pageSizeMode: 'Root', pageSize: 4 },
                columns: ['taskID', 'taskName', 'startDate', 'endDate']
            },
            done
        );
    });
    it('Check data count', () => {
        gridObj.pagerModule.destroy();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Pager with filter, sort, summary', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowSelection: true,
                allowPaging: true,
                allowFiltering: true,
                allowSorting: true,
                aggregates: [{
                        columns: [
                            {
                                type: 'Max',
                                field: 'duration',
                                columnName: 'duration',
                                footerTemplate: 'Maximum: ${Max}'
                            }]
                }],
                columns: ['taskID', 'taskName', 'startDate', 'duration']
            },
            done
        );
    });
    it('Check successful collapsing', (done: Function) => {
        gridObj.collapsed = (args?: RowCollapsedEventArgs) => {
            expect(gridObj.getRows()[1].querySelector('.e-treecell').innerHTML === 'Design').toBe(true);
            done();
        }
        gridObj.collapseRow(gridObj.getRows()[0])
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('ExpandStateMapping with pager', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowPaging: true,
                pageSettings: { pageSize: 35 },
                expandStateMapping: 'isInExpandState',
                columns: ['taskID', 'taskName', 'startDate', 'duration']
            },
            done
        );
    });
    it('Checking the rendered records', () => {
      expect(gridObj.grid.pageSettings.totalRecordsCount).toBe(24);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('CollaspeAll and ExpandAll methods with pager - All Mode', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowPaging: true,
                columns: ['taskID', 'taskName', 'startDate', 'duration']
            },
            done
        );
    });
    it('Check the collapseAll Method -- All Mode', (done: Function) => {
        gridObj.collapsing = (args?: RowCollapsingEventArgs) => {
            expect((args.data as Object[]).length).toBe(9);
        }
        gridObj.collapsed = (args?: RowCollapsingEventArgs) => {
            expect((args.data as Object[]).length).toBe(9);
            expect(gridObj.getRows().length).toBe(3);
            done();
        }
        gridObj.collapseAll();
    });
    it('Check the expandAll Method -- All Mode', (done: Function) => {
        gridObj.expanding = (args?: RowCollapsingEventArgs) => {
            expect((args.data as Object[]).length).toBe(9);
        }
        gridObj.expanded = (args?: RowExpandedEventArgs) => {
            expect((args.data as Object[]).length).toBe(9);
            expect(gridObj.getRows().length).toBe(12);
            done();
        }
        gridObj.expandAll();
    });
    it('Check the collapseAtLevel Method -- All Mode', (done: Function) => {
        gridObj.collapsing = (args?: RowCollapsingEventArgs) => {
            expect((args.data as Object[]).length).toBe(3);
        }
        gridObj.collapsed = (args?: RowExpandedEventArgs) => {
            expect((args.data as Object[]).length).toBe(3);
            expect(gridObj.grid.pageSettings.totalRecordsCount).toBe(15);
            done();
        }
        gridObj.collapseAtLevel(1);
    });
    it('Check the expandAtLevel Method -- All Mode', (done: Function) => {
        gridObj.expanding = (args?: RowCollapsingEventArgs) => {
            expect((args.data as Object[]).length).toBe(3);
        }
        gridObj.expanded = (args?: RowExpandedEventArgs) => {
            expect((args.data as Object[]).length).toBe(3);
            expect(gridObj.grid.pageSettings.totalRecordsCount).toBe(36);
            done();
        }
        gridObj.expandAtLevel(1);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
});