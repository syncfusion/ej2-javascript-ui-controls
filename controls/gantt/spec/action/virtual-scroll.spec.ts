/**
 * Gantt virtual scroll spec
 */

import { Gantt, Edit, Toolbar, Selection, Filter, VirtualScroll } from '../../src/index';
import { virtualData } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
Gantt.Inject(Edit, Toolbar, Selection, Filter, VirtualScroll);
describe('Gantt virtual scroll', () => {
    describe('Rendering and basic actions', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: virtualData,
                    enableVirtualization: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks'
                    },
                    height: '550px',
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: false
                    },
                    allowFiltering: true,
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search']
                }, done);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Rendering', () => {
            expect(ganttObj.currentViewData.length).toBe(24);
            expect(ganttObj.flatData.length).toBe(450);
        });
        it('Vertical scroll syncing', () => {
            ganttObj.dataBound = () => {
                if (ganttObj.ganttChartModule.scrollElement.scrollTop === 2000) {
                    expect(ganttObj.treeGrid.getRows()[0].getAttribute('aria-rowindex')).toBe('55');
                    expect(ganttObj.ganttChartModule.getChartRows()[0].getAttribute('aria-rowindex')).toBe('55');
                    ganttObj.dataBound = null;
                    ganttObj.dataBind();
                }
            };
            ganttObj.dataBind();
            ganttObj.ganttChartModule.scrollObject.setScrollTop(2000);
        });
        it('Select rows', () => {
            let row: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td');
            triggerMouseEvent(row, 'mouseup', 30, 30);
            expect(ganttObj.selectionModule.getSelectedRowIndexes()[0]).toBe(58);
            ganttObj.selectionModule.clearSelection();
        });
        it('Filtering', () => {         
            ganttObj.filterSettings.columns = [{ field: 'TaskName', matchCase: false, operator: 'startswith', value: 'task 300' }];
            ganttObj.dataBound = () => {
                if (ganttObj.filterSettings.columns.length > 0) {
                    expect(ganttObj.currentViewData.length).toBe(3);
                    ganttObj.clearFiltering();
                    ganttObj.dataBound = null;
                    ganttObj.dataBind();
                }
            };
            ganttObj.dataBind();
        });
        it('Adding record', () => {       
            ganttObj.addRecord({}, 'Child', 3);
            expect(ganttObj.flatData.length).toBe(451);
        });
        it('Editing record', () => {        
            ganttObj.updateRecordByID({TaskID:451, TaskName:'Edited Record'})
            expect(ganttObj.flatData[4].ganttProperties.taskName).toBe('Edited Record');
        });
        it('Deleting record', () => {        
            ganttObj.deleteRecord(5);
            expect(ganttObj.flatData.length).toBe(450);
        });
        it('CollapseAll handler function', () => {       
            let collapseallToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_collapseall');
            triggerMouseEvent(collapseallToolbar, 'click');
            expect(ganttObj.flatData[1].expanded).toBe(false);
            expect(ganttObj.treeGrid.getRows()[1].getAttribute('aria-expanded')).toBe("false");
        });
    });
});
