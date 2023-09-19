/**
 * Gantt expand collapse spec
 */
import { Gantt } from '../../src/index';
import { projectData1, multiResources, multiTaskbarData } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
describe('Gantt expand collapse support', () => {
    describe('Gantt expand collapse', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                    },
                    projectStartDate: new Date('01/01/2018'),
                    projectEndDate: new Date('04/30/2018'),
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Collapse from TreeGrid side', (done: Function) => {
            let clickElement: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr:nth-child(2) > td > div > span.e-treegridexpand') as HTMLElement;
            triggerMouseEvent(clickElement, 'click');
            expect(clickElement.classList[1]).toEqual('e-treegridcollapse');
            done();
        });
        it('Expand from TreeGrid side', (done: Function) => {
            let clickElement: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr:nth-child(2) > td > div > span.e-treegridcollapse') as HTMLElement;
            triggerMouseEvent(clickElement, 'click');
            expect(clickElement.classList[1]).toEqual('e-treegridexpand');
            done();
        });
        it('Collapse from Chart taskbar side', (done: Function) => {
            let clickElement: HTMLElement = ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(2) > td div.e-gantt-parent-taskbar') as HTMLElement;
            triggerMouseEvent(clickElement, 'mouseup');
            expect(clickElement.classList.contains('e-row-collapse')).toBe(true);
            done();
        });
        it('Expand from Chart taskbar side', (done: Function) => {
            let clickElement: HTMLElement = ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(2) > td div.e-gantt-parent-taskbar') as HTMLElement;
            triggerMouseEvent(clickElement, 'mouseup');
            expect(clickElement.classList.contains('e-row-expand')).toBe(true);
            done();
        });
        it('Collapse All Rows', (done: Function) => {
            ganttObj.ganttChartModule.expandCollapseAll('collapse');
            let secondElement: HTMLElement = (ganttObj.element.querySelectorAll('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr')[1]) as HTMLElement;
            expect(secondElement.style.display).toBe('none');
            done();
        });
        it('Expand All Rows', (done: Function) => {
            ganttObj.ganttChartModule.expandCollapseAll('expand');
            let secondElement: HTMLElement = (ganttObj.element.querySelectorAll('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr')[1]) as HTMLElement;
            expect(secondElement.style.display).toBe('table-row');
            done();
        });
        it('Collapse by collapseall method', (done: Function) => {
            ganttObj.collapseAll();
            let secondElement: HTMLElement = (ganttObj.element.querySelectorAll('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr')[1]) as HTMLElement;
            expect(secondElement.style.display).toBe('none');
            done();
        });
        it('Expand by expandall method', (done: Function) => {
            ganttObj.expandAll();
            let secondElement: HTMLElement = (ganttObj.element.querySelectorAll('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr')[1]) as HTMLElement;
            expect(secondElement.style.display).toBe('table-row');
            done();
        });
        it('Collapse at level', (done: Function) => {
            ganttObj.ganttChartModule.collapseAtLevel(1);
            let rowElement: HTMLElement = (ganttObj.element.querySelectorAll('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr')[7]) as HTMLElement;
            expect(rowElement.style.display).toBe('none');
            done();
        });
        it('Expand at level', (done: Function) => {
            ganttObj.expandAtLevel(1);
            let rowElement: HTMLElement = (ganttObj.element.querySelectorAll('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr')[7]) as HTMLElement;
            expect(rowElement.style.display).toBe('table-row');
            done();
        });
        it('Collapse by index', (done: Function) => {
            ganttObj.collapseByIndex(1);
            ganttObj.collapseByIndex(8);
            expect(ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(2) > td div.e-gantt-parent-taskbar').classList.contains('e-row-collapse')).toBe(true);
            expect(ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(9) > td div.e-gantt-parent-taskbar').classList.contains('e-row-collapse')).toBe(true);
            done();
        });
        it('Expand by index', (done: Function) => {
            ganttObj.expandByIndex([1,8]);
            expect(ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(2) > td div.e-gantt-parent-taskbar').classList.contains('e-row-expand')).toBe(true);
            expect(ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(9) > td div.e-gantt-parent-taskbar').classList.contains('e-row-expand')).toBe(true);
            done();
        });
        it('Collapse by id', (done: Function) => {
            ganttObj.collapseByID(1);
            expect(ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(1) > td div.e-gantt-parent-taskbar').classList.contains('e-row-collapse')).toBe(true);
            done();
        });
        it('Expand by id', (done: Function) => {
            ganttObj.expandByID(1);
            expect(ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(1) > td div.e-gantt-parent-taskbar').classList.contains('e-row-expand')).toBe(true);
            done();
        });
        it('args.cancel as true for collapsing event', (done: Function) => {
            ganttObj.collapsing = (args) => { args['cancel'] = true; };
            ganttObj.collapseByIndex(1);
            expect(ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(2) > td div.e-gantt-parent-taskbar').classList.contains('e-row-expand')).toBe(true);
            done();
        });
        it('Collapse from TreeGrid side by clicking while args.cancel as true', (done: Function) => {
            let clickElement: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr:nth-child(2) > td > div > span.e-treegridexpand') as HTMLElement;
            triggerMouseEvent(clickElement, 'click');
            expect(ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(2) > td div.e-gantt-parent-taskbar').classList.contains('e-row-expand')).toBe(true);
            done();
        });
        it('args.cancel as true for expanding event', (done: Function) => {
            ganttObj.collapsing = (args) => { args['cancel'] = false; };
            ganttObj.dataBind();
            ganttObj.collapseByIndex(1);
            ganttObj.expanding = (args) => { args['cancel'] = true; };
            ganttObj.dataBind();
            ganttObj.expandByIndex(1);
            expect(ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(2) > td div.e-gantt-parent-taskbar').classList.contains('e-row-collapse')).toBe(true);
            done();
        });
    });
    // describe('Gantt expand collapse', () => {
//     let ganttObj: Gantt;
//     beforeAll((done: Function) => {
//         ganttObj = createGantt(
//             {
//                 dataSource: multiTaskbarData,
//                 resources: multiResources,
//                 viewType: 'ResourceView',
//                 showOverAllocation: true,
//                 enableMultiTaskbar: true,
//                 enableContextMenu: true,
//                 allowSorting: true,
//                 allowReordering: true,
//                 taskFields: {
//                     id: 'TaskID',
//                     name: 'TaskName',
//                     startDate: 'StartDate',
//                     endDate: 'EndDate',
//                     duration: 'Duration',
//                     progress: 'Progress',
//                     dependency: 'Predecessor',
//                     resourceInfo: 'resources',
//                     expandState: 'isExpand',
//                     work: 'work',
//                     child: 'subtasks'
//                 },
//                 resourceFields: {
//                     id: 'resourceId',
//                     name: 'resourceName',
//                     unit: 'resourceUnit',
//                     group: 'resourceGroup'
//                 },
//                 editSettings: {
//                     allowAdding: true,
//                     allowEditing: true,
//                     allowDeleting: true,
//                     allowTaskbarEditing: true,
//                     showDeleteConfirmDialog: true
//                 },
//                 columns: [
//                     { field: 'TaskID', visible: false },
//                     { field: 'TaskName', headerText: 'Name', width: 250 },
//                     { field: 'work', headerText: 'Work' },
//                     { field: 'Progress' },
//                     { field: 'resourceGroup', headerText: 'Group' },
//                     { field: 'StartDate' },
//                     { field: 'Duration' },
//                 ],
//                 toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
//                     { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' }, 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
//                 labelSettings: {
//                     rightLabel: 'resources',
//                     taskLabel: 'Progress'
//                 },
//                 splitterSettings: {
//                     columnIndex: 3
//                 },
//                 selectionSettings: {
//                     mode: 'Row',
//                     type: 'Single',
//                     enableToggle: false
//                 },
//                 tooltipSettings: {
//                     showTooltip: true
//                 },
//                 timelineSettings: {
//                     showTooltip: true,
//                     topTier: {
//                         unit: 'Week',
//                         format: 'dd/MM/yyyy'
//                     },
//                     bottomTier: {
//                         unit: 'Day',
//                         count: 1
//                     }
//                 },
//                 eventMarkers: [
//                     {
//                         day: '04/17/2019',
//                         cssClass: 'e-custom-event-marker',
//                         label: 'Project approval and kick-off'
//                     }
//                 ],
//                 holidays: [{
//                     from: "04/04/2019",
//                     to: "04/05/2019",
//                     label: " Public holidays",
//                     cssClass: "e-custom-holiday"
//                 }],
//                 readOnly: false,
//                 allowRowDragAndDrop: true,
//                 allowResizing: true,
//                 allowFiltering: true,
//                 allowSelection: true,
//                 highlightWeekends: true,
//                 treeColumnIndex: 1,
//                 taskbarHeight: 20,
//                 rowHeight: 40,
//                 height: '550px',
//                 projectStartDate: new Date('03/28/2019'),
//                 projectEndDate: new Date('05/18/2019')
//             }, done);
//     });
//     afterAll(() => {
//         if (ganttObj) {
//             destroyGantt(ganttObj);
//         }
//     });
//     it('Collapse all tasks in resource view', (done: Function) => {
//         ganttObj.collapsed = () => {
//             expect(ganttObj.treeGrid.getRows()[16].getElementsByClassName('e-treegridexpand').length).toBe(1);
//         }
//         ganttObj.dataBind();
//         ganttObj.collapseAll();
//         done();
//     });
// });
});
