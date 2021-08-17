/**
 * Gantt virtual scroll spec
 */

import { Gantt, Edit, Toolbar, Selection, Filter, VirtualScroll, Sort } from '../../src/index';
import { virtualData } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
Gantt.Inject(Edit, Toolbar, Selection, Filter, VirtualScroll, Sort);
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
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
                    allowSelection: true,
                    allowSorting: true,
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
        // it('Select rows', () => {
            // let row: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td');
            // triggerMouseEvent(row, 'mouseup', 30, 30);
            // expect(ganttObj.selectionModule.getSelectedRowIndexes()[0]).toBe(58);
            // ganttObj.selectionModule.clearSelection();
        // });
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
        it('Sort action', () => {   
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'sorting') {
                    expect(Number(ganttObj.currentViewData[0].ganttProperties.taskId)).toBe(91); 
                }
            };
            ganttObj.dataBind();
            ganttObj.sortColumn('TaskName', 'Descending')   
        });
        it('Editing record after sort action', (done: Function) => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save') {
                    expect(ganttObj.currentViewData[3].ganttProperties.taskName).toBe("Updated");
                }
            };
            ganttObj.dataBind();
            let row: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-left-label-container');
            triggerMouseEvent(row, 'mouseup', 10, 10);
            expect(ganttObj.selectionModule.getSelectedRecords().length).toBe(1);
            expect(ganttObj.selectionModule.getSelectedRecords()[0]['TaskID']).toBe(99);
            let editToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_edit');
            triggerMouseEvent(editToolbar, 'click');
            setTimeout(done, 1000);
            let taskName: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'TaskName')).ej2_instances[0];
            taskName.value='Updated';
            let saveRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
        });
        it('CollapseAll handler function', () => {       
            let collapseallToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_collapseall');
            triggerMouseEvent(collapseallToolbar, 'click');
            expect(ganttObj.flatData[1].expanded).toBe(false);
            expect(ganttObj.treeGrid.getRows()[1].getAttribute('aria-expanded')).toBe("false");
        });
        it('Expand/CollapseAtLevel method', () => {
            ganttObj.ganttChartModule.collapseAtLevel(0);
            expect(ganttObj.flatData[0].expanded).toBe(false);
            ganttObj.expandAtLevel(0);
            expect(ganttObj.flatData[0].expanded).toBe(true);
        });
    });
});
