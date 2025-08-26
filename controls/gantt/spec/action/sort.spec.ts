/**
 * Gantt sort spec
 */
import { Gantt, Sort, Selection } from '../../src/index';
import { projectData1 } from '../base/data-source.spec';
import { createGantt, destroyGantt } from '../base/gantt-util.spec';
describe('Gantt sort support', () => {
    describe('Gantt sort action', () => {
        Gantt.Inject(Sort);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    allowSorting: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor'
                    },
                    //sortSettings: { columns: [{ field: 'TaskID', direction: 'Ascending' }, { field: 'TaskName', direction: 'Ascending' }] },
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });

        it('Sort column by method', () => {
            ganttObj.sortColumn('Duration', 'Descending', false);
            expect(ganttObj.element.getElementsByClassName('e-columnheader')[0].querySelectorAll('.e-descending').length).toBe(1);
        });

        it('Remove Sorted Column', () => {
            ganttObj.sortColumn('Progress', 'Ascending', false);
            ganttObj.removeSortColumn('Progress');
            expect(ganttObj.element.getElementsByClassName('e-columnheader')[0].querySelectorAll('.e-ascending').length).toBe(0);
        });

        it('Clear All Sorting', () => {
            ganttObj.clearSorting();
            expect(ganttObj.element.getElementsByClassName('e-columnheader')[0].querySelectorAll('.e-descending').length).toBe(0);
            expect(ganttObj.element.getElementsByClassName('e-columnheader')[0].querySelectorAll('.e-ascending').length).toBe(0);
        });

        it('Initial Sorting', (done: Function) => {
            ganttObj.sortSettings.columns = [{ field: 'TaskID', direction: 'Ascending' }, { field: 'TaskName', direction: 'Ascending' }];
            ganttObj.dataBind();
            expect(ganttObj.sortSettings.columns.length).toBe(2);
            done();
        });

        it('Sort column by method without sort module', () => {
            ganttObj.clearSorting();
            ganttObj.allowSorting = false;
            ganttObj.dataBind();
            ganttObj.sortColumn('Duration', 'Descending', false);
            expect(ganttObj.element.getElementsByClassName('e-columnheader')[0].querySelectorAll('.e-descending').length).toBe(0);
        });

        it('Sort column by method with sort value false', () => {
            ganttObj.dataBind();
            ganttObj.sortColumn('Duration', 'Descending', false);
            expect(ganttObj.element.getElementsByClassName('e-columnheader')[0].querySelectorAll('.e-descending').length).toBe(0);
        });

        it('Destroy Method', () => {
            ganttObj.allowSorting = true;
            ganttObj.dataBind();
            ganttObj.sortModule.destroy();
        });
    });
    describe('Gantt sort action', () => {
        Gantt.Inject(Sort, Selection);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    allowSorting: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor'
                    },
                    //sortSettings: { columns: [{ field: 'TaskID', direction: 'Ascending' }, { field: 'TaskName', direction: 'Ascending' }] },
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    selectedRowIndex: 2,
                    selectionSettings: {
                        mode: 'Row',
                        type: 'Multiple',
                        enableToggle: true,
                        persistSelection: true
                    },
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });

        it('Sort column by method', () => {
            ganttObj.sortColumn('Duration', 'Descending', false);
            expect(ganttObj.element.getElementsByClassName('e-columnheader')[0].querySelectorAll('.e-descending').length).toBe(1);
        });
    });
});