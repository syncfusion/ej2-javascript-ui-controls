/**
 * TreeGrid Clipboard spec document
 */
import { Browser, formatUnit } from '@syncfusion/ej2-base';
import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { Selection } from '../../src/treegrid/actions/selection';
import { Sort } from '../../src/treegrid/actions/sort';
import { Filter } from '../../src/treegrid/actions/filter';
import { Page } from '../../src/treegrid/actions/page';
import { TreeClipboard } from '../../src/treegrid/actions/clipboard';
import { sampleData } from '../base/datasource.spec';
import { BeforeCopyEventArgs } from '@syncfusion/ej2-grids';
import { createGrid, destroy } from '../base/treegridutil.spec';
import '../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from '../common.spec';

TreeGrid.Inject(Selection, TreeClipboard, Sort, Filter, Page);

describe('TreeGrid clipboard copy testing - => ', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            // pending(); //Skips test (in Chai)
        }
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: [{ field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 80 },
                    { field: 'taskName', headerText: 'Task Name', width: 200 },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' } },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
                ]
            }, done);
    });

    it('Check hidden clipboard textarea', () => {
        const clipArea: HTMLElement = (gridObj.element.querySelectorAll('.e-clipboard')[0] as HTMLElement);
        expect(gridObj.element.querySelectorAll('.e-clipboard').length > 0).toBeTruthy();
        expect(clipArea.style.opacity === '0').toBeTruthy();
    });

    it('Check with row type selection for parent mode', () => {
        gridObj.selectRows([0, 1]);
        gridObj.copy();
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === '1	Planning	2/3/2017	5	100\n2	Plan timeline	2/3/2017	5	100').toBeTruthy();
    });

    it('Check with row type selection for parent mode - include header', () => {
        gridObj.copy(true);
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === 'Task ID	Task Name	Start Date	Duration	Progress\n1	Planning	2/3/2017	5	100\n2	Plan timeline	2/3/2017	5	100').toBeTruthy();
    });

    it('Browser default selection for coverage', () => {
        const range: any = document.createRange();
        range.selectNodeContents(gridObj.element.querySelectorAll('.e-rowcell')[2]);
        const selection: any = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        gridObj.copy();
        selection.removeAllRanges();
    });

    it('Check with row type selection for Child mode', () => {
        gridObj.copyHierarchyMode = 'Child';
        gridObj.selectRow(0);
        gridObj.copy();
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === '1	Planning	2/3/2017	5	100\n2	Plan timeline	2/3/2017	5	100\n3	Plan budget	2/3/2017	5	100\n4	Allocate resources	2/3/2017	5	100\n5	Planning complete	2/7/2017	0	0').toBeTruthy();
    });

    it('Check with row type selection for child mode - include header', () => {
        gridObj.copy(true);
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === 'Task ID	Task Name	Start Date	Duration	Progress\n1	Planning	2/3/2017	5	100\n2	Plan timeline	2/3/2017	5	100\n3	Plan budget	2/3/2017	5	100\n4	Allocate resources	2/3/2017	5	100\n5	Planning complete	2/7/2017	0	0').toBeTruthy();
    });

    it('Check with row type selection for Both mode', () => {
        gridObj.copyHierarchyMode = 'Both';
        gridObj.selectRow(13);
        gridObj.copy();
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === '12	Implementation Phase	2/17/2017	11	\n13	Phase 1	2/17/2017	11	\n14	Implementation Module 1	2/17/2017	11	\n15	Development Task 1	2/17/2017	3	50\n16	Development Task 2	2/17/2017	3	50\n17	Testing	2/20/2017	2	0\n18	Bug fix	2/24/2017	2	0\n19	Customer review meeting	2/26/2017	2	0\n20	Phase 1 complete	2/27/2017	0	').toBeTruthy();
    });

    it('Check with row type selection for Both mode - include header', () => {
        gridObj.copy(true);
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === 'Task ID	Task Name	Start Date	Duration	Progress\n12	Implementation Phase	2/17/2017	11	\n13	Phase 1	2/17/2017	11	\n14	Implementation Module 1	2/17/2017	11	\n15	Development Task 1	2/17/2017	3	50\n16	Development Task 2	2/17/2017	3	50\n17	Testing	2/20/2017	2	0\n18	Bug fix	2/24/2017	2	0\n19	Customer review meeting	2/26/2017	2	0\n20	Phase 1 complete	2/27/2017	0	').toBeTruthy();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('TreeGrid clipboard copy testing -', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 80 },
                    { field: 'taskName', headerText: 'Task Name', width: 200 },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' } },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
                ],
                allowSelection: true,
                selectionSettings: { type: 'Multiple', mode: 'Cell' }
            }, done);
    });

    it('Check with cell type selection', () => {
        gridObj.selectCell({
            cellIndex: 1,
            rowIndex: 1
        });
        gridObj.copy();
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === 'Plan timeline').toBeTruthy();
    });

    it('Check with cell type selection - include header', () => {
        gridObj.selectCell({
            cellIndex: 1,
            rowIndex: 1
        });
        gridObj.copy(true);
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === 'Task Name\nPlan timeline').toBeTruthy();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Hierarchy data sorting with clipboard', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowSorting: true,
                columns: [{ field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 80 },
                    { field: 'taskName', headerText: 'Task Name', width: 200 },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' } },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }]
            }, done);
    });

    it('Check with row type selection after sorting operation', (done: Function) => {
        actionComplete = (args?: Object): void => {
            gridObj.selectRow(1);
            gridObj.copy();
            expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
              === '6	Design	2/10/2017	3	86\n11	Design complete	2/14/2017	0	0').toBeTruthy();
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.sortByColumn('taskName', 'Ascending', false);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hierarchy data sorting with clipboard - include header', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowSorting: true,
                columns: [{ field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 80 },
                    { field: 'taskName', headerText: 'Task Name', width: 200 },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' } },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }]
            }, done);
    });

    it('Check with row type selection after sorting operation- inlcude header', (done: Function) => {
        actionComplete = (args?: Object): void => {
            gridObj.selectRow(1);
            gridObj.copy(true);
            expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
                === 'Task ID	Task Name	Start Date	Duration	Progress\n6	Design	2/10/2017	3	86\n11	Design complete	2/14/2017	0	0').toBeTruthy();
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.sortByColumn('taskName', 'Ascending', false);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hierarchy data filtering with clipboard', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                columns: [{ field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 80 },
                    { field: 'taskName', headerText: 'Task Name', width: 200 },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' } },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }]
            }, done);
    });

    it('Check with row type selection after filtering operation', (done: Function) => {
        actionComplete = (args?: Object): void => {
            gridObj.selectRow(1);
            gridObj.copy();
            expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
              === '12	Implementation Phase	2/17/2017	11	\n13	Phase 1	2/17/2017	11	').toBeTruthy();
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('taskName', 'startswith', 'Phase 1');
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hierarchy data filtering with clipboard - Include header', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                columns: [{ field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 80 },
                    { field: 'taskName', headerText: 'Task Name', width: 200 },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' } },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }]
            }, done);
    });

    it('Check with row type selection after filtering operation- inlcude header', (done: Function) => {
        actionComplete = (args?: Object): void => {
            gridObj.selectRow(1);
            gridObj.copy(true);
            expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
                === 'Task ID	Task Name	Start Date	Duration	Progress\n12	Implementation Phase	2/17/2017	11	\n13	Phase 1	2/17/2017	11	').toBeTruthy();
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('taskName', 'startswith', 'Phase 1');
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Check with args cancel for coverage', () => {
    let gridObj: TreeGrid;
    let gridBeforeCopy: (e: BeforeCopyEventArgs) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                columns: [{ field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 80 },
                    { field: 'taskName', headerText: 'Task Name', width: 200 },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' } },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }]
            }, done);
    });

    it('Check with args cancel for coverage', () => {
        gridBeforeCopy = (args: BeforeCopyEventArgs): void => {
            args.cancel = true;
        };
        gridObj.beforeCopy = gridBeforeCopy;
        gridObj.copy();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = gridBeforeCopy = null;
    });
});

describe('TreeGrid clipboard copy testing', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                selectionSettings: { type: 'Multiple' },
                allowFiltering: true,
                columns: [{ field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 80 },
                    { field: 'taskName', headerText: 'Task Name', width: 200 },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' } },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }]
            }, done);
    });

    it('row type multiple selection - parent mode', () => {
        gridObj.selectRows([1, 8]);
        gridObj.copy();
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
          === '1	Planning	2/3/2017	5	100\n2	Plan timeline	2/3/2017	5	100\n6	Design	2/10/2017	3	86\n9	Get approval from customer	2/13/2017	2	100').toBeTruthy();
    });

    afterAll(() => {
        destroy(gridObj);
    });
});