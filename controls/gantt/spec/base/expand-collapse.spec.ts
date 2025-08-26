/**
 * Gantt expand collapse spec
 */
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, Sort, RowDD, ContextMenu } from '../../src/index';
import { projectData1, multiResources, multiTaskbarData } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, Sort, RowDD, ContextMenu);


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
        it('Collapse from TreeGrid side', () => {
            let clickElement: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr:nth-child(2) > td > div > span.e-treegridexpand') as HTMLElement;
            triggerMouseEvent(clickElement, 'click');
            expect(clickElement.classList[1]).toEqual('e-treegridcollapse');
        });
        it('Expand from TreeGrid side', () => {
            let clickElement: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr:nth-child(2) > td > div > span.e-treegridcollapse') as HTMLElement;
            triggerMouseEvent(clickElement, 'click');
            expect(clickElement.classList[1]).toEqual('e-treegridexpand');
        });
        it('Collapse from Chart taskbar side', () => {
            let clickElement: HTMLElement = ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(2) > td div.e-gantt-parent-taskbar') as HTMLElement;
            triggerMouseEvent(clickElement, 'mouseup');
            expect(clickElement.classList.contains('e-row-collapse')).toBe(true);
        });
        it('Expand from Chart taskbar side', () => {
            let clickElement: HTMLElement = ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(2) > td div.e-gantt-parent-taskbar') as HTMLElement;
            triggerMouseEvent(clickElement, 'mouseup');
            expect(clickElement.classList.contains('e-row-expand')).toBe(true);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
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
        it('Collapse All Rows', () => {
            ganttObj.ganttChartModule.expandCollapseAll('collapse');
            let secondElement: HTMLElement = (ganttObj.element.querySelectorAll('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr')[1]) as HTMLElement;
            let displayValue = window.getComputedStyle(secondElement).display;
            expect(displayValue).toBe('none');
        });
        it('Expand All Rows', () => {
            ganttObj.ganttChartModule.expandCollapseAll('expand');
            let secondElement: HTMLElement = (ganttObj.element.querySelectorAll('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr')[1]) as HTMLElement;
            let displayValue = window.getComputedStyle(secondElement).display;
            expect(displayValue).toBe('table-row');
        });
        it('Collapse by collapseall method', () => {
            ganttObj.collapseAll();
            let secondElement: HTMLElement = (ganttObj.element.querySelectorAll('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr')[1]) as HTMLElement;
            let displayValue = window.getComputedStyle(secondElement).display;
            expect(displayValue).toBe('none');
        });
        it('Expand by expandall method', () => {
            ganttObj.expandAll();
            let secondElement: HTMLElement = (ganttObj.element.querySelectorAll('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr')[1]) as HTMLElement;
            let displayValue = window.getComputedStyle(secondElement).display;
            expect(displayValue).toBe('table-row');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
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
        it('Collapse at level', () => {
            ganttObj.ganttChartModule.collapseAtLevel(1);
            let rowElement: HTMLElement = (ganttObj.element.querySelectorAll('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr')[7]) as HTMLElement;
            let displayValue = window.getComputedStyle(rowElement).display;
            expect(displayValue).toBe('none');
        });
        it('Expand at level', () => {
            ganttObj.expandAtLevel(1);
            let rowElement: any = (ganttObj.element.querySelectorAll('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr')[7]) as HTMLElement;
            let displayValue = window.getComputedStyle(rowElement).display;
            expect(displayValue).toBe('table-row');
        });
        it('Collapse by index', () => {
            ganttObj.collapseByIndex(1);
            ganttObj.collapseByIndex(8);
            expect(ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(2) > td div.e-gantt-parent-taskbar').classList.contains('e-row-collapse')).toBe(true);
            expect(ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(9) > td div.e-gantt-parent-taskbar').classList.contains('e-row-collapse')).toBe(true);
        });
        it('Expand by index', () => {
            ganttObj.expandByIndex([1, 8]);
            expect(ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(2) > td div.e-gantt-parent-taskbar').classList.contains('e-row-expand')).toBe(true);
            expect(ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(9) > td div.e-gantt-parent-taskbar').classList.contains('e-row-expand')).toBe(true);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });

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
        it('Collapse by id', () => {
            ganttObj.collapseByID(1);
            expect(ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(1) > td div.e-gantt-parent-taskbar').classList.contains('e-row-collapse')).toBe(true);
        });
        it('Expand by id', () => {
            ganttObj.expandByID(1);
            expect(ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(1) > td div.e-gantt-parent-taskbar').classList.contains('e-row-expand')).toBe(true);
        });
        it('args.cancel as true for collapsing event', () => {
            ganttObj.collapsing = (args) => { args['cancel'] = true; };
            ganttObj.collapseByIndex(1);
            expect(ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(2) > td div.e-gantt-parent-taskbar').classList.contains('e-row-expand')).toBe(true);
        });
        it('Collapse from TreeGrid side by clicking while args.cancel as true', () => {
            let clickElement: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr:nth-child(2) > td > div > span.e-treegridexpand') as HTMLElement;
            triggerMouseEvent(clickElement, 'click');
            expect(ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(2) > td div.e-gantt-parent-taskbar').classList.contains('e-row-expand')).toBe(true);
        });
        it('args.cancel as true for expanding event', () => {
            ganttObj.collapsing = (args) => { args['cancel'] = false; };
            ganttObj.collapseByIndex(1);
            ganttObj.expanding = (args) => { args['cancel'] = true; };
            ganttObj.expandByIndex(1);
            expect(ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(2) > td div.e-gantt-parent-taskbar').classList.contains('e-row-collapse')).toBe(true);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Gantt expand collapse', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: multiTaskbarData,
                    resources: multiResources,
                    viewType: 'ResourceView',
                    showOverAllocation: true,
                    enableMultiTaskbar: true,
                    enableContextMenu: true,
                    allowSorting: true,
                    allowReordering: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        resourceInfo: 'resources',
                        expandState: 'isExpand',
                        work: 'work',
                        child: 'subtasks'
                    },
                    resourceFields: {
                        id: 'resourceId',
                        name: 'resourceName',
                        unit: 'resourceUnit',
                        group: 'resourceGroup'
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    columns: [
                        { field: 'TaskID', visible: false },
                        { field: 'TaskName', headerText: 'Name', width: 250 },
                        { field: 'work', headerText: 'Work' },
                        { field: 'Progress' },
                        { field: 'resourceGroup', headerText: 'Group' },
                        { field: 'StartDate' },
                        { field: 'Duration' },
                    ],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                        { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' }, 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                    labelSettings: {
                        rightLabel: 'resources',
                        taskLabel: 'Progress'
                    },
                    splitterSettings: {
                        columnIndex: 3
                    },
                    selectionSettings: {
                        mode: 'Row',
                        type: 'Single',
                        enableToggle: false
                    },
                    tooltipSettings: {
                        showTooltip: true
                    },
                    timelineSettings: {
                        showTooltip: true,
                        topTier: {
                            unit: 'Week',
                            format: 'dd/MM/yyyy'
                        },
                        bottomTier: {
                            unit: 'Day',
                            count: 1
                        }
                    },
                    eventMarkers: [
                        {
                            day: '04/17/2019',
                            cssClass: 'e-custom-event-marker',
                            label: 'Project approval and kick-off'
                        }
                    ],
                    holidays: [{
                        from: "04/04/2019",
                        to: "04/05/2019",
                        label: " Public holidays",
                        cssClass: "e-custom-holiday"
                    }],
                    readOnly: false,
                    allowRowDragAndDrop: true,
                    allowResizing: true,
                    allowFiltering: true,
                    allowSelection: true,
                    highlightWeekends: true,
                    treeColumnIndex: 1,
                    taskbarHeight: 20,
                    rowHeight: 40,
                    height: '550px',
                    allowTaskbarOverlap: false,
                    projectStartDate: new Date('03/28/2019'),
                    projectEndDate: new Date('05/18/2019')
                }, done);
        });
        it('Collapse single tasks in resource view', () => {
            let clickElement: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr:nth-child(5) > td > div > span.e-treegridexpand') as HTMLElement;
            triggerMouseEvent(clickElement, 'click');
        });
        it('expand single tasks in resource view', () => {
            let clickElement: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table tr:nth-child(1) > td > div > span.e-treegridcollapse') as HTMLElement;
            triggerMouseEvent(clickElement, 'click');
        });
        it('Collapse all tasks in resource view', (done: Function) => {
            ganttObj.collapsed = () => {
                expect(ganttObj.treeGrid.getRows()[16].getElementsByClassName('e-treegridexpand').length).toBe(1);
                done();
            }
            ganttObj.collapseAll();
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });

    describe('Dialog editing - resoruce selection', () => {
        let ganttObj: Gantt;
        let resourcesData1 : any = [
            {
                TaskID: 1,
                TaskName: 'Project initiation',
                StartDate: new Date('03/29/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    {
                        TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                        Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
                    },
                    {
                        TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                        resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
                    },
                    {
                        TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                        resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
                    },
                ]
            },
            {
                TaskID: 5,
                TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
                subtasks: [
                    {
                        TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('03/29/2019'),
                        Duration: 3, Progress: 30, resources: [{ resourceId: 2, resourceUnit: 70 }], Predecessor: '3FS+2', work: 30
                    },
                    {
                        TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/08/2019'), Duration: 12,
                        resources: [{ resourceId: 6, resourceUnit: 40 }], Progress: 30, work: 40
                    },
                    {
                        TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/03/2019'),
                        Duration: 10, resources: [{ resourceId: 5, resourceUnit: 75 }], Progress: 30, work: 60,
                    },
                    {
                        TaskID: 9, TaskName: 'Excavate for foundations', StartDate: new Date('04/01/2019'),
                        Duration: 4, Progress: 30, resources: [4]
                    },
                    {
                        TaskID: 10, TaskName: 'Install plumbing grounds', StartDate: new Date('04/08/2019'), Duration: 4,
                        Progress: 30, Predecessor: '9SS', resources: [3]
                    },
                    {
                        TaskID: 11, TaskName: 'Dig footer', StartDate: new Date('04/08/2019'),
                        Duration: 3, resources: [2]
                    },
                    {
                        TaskID: 12, TaskName: 'Electrical utilities', StartDate: new Date('04/03/2019'),
                        Duration: 4, Progress: 30, resources: [3]
                    }
                ]
            },
            {
                TaskID: 13, TaskName: 'Sign contract', StartDate: new Date('04/04/2019'), Duration: 2,
                Progress: 30,
            }
        ];
        let resourceCollection1 : any = [
            { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
            { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
            { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' },
            { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team' },
            { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team' },
            { resourceId: 6, resourceName: 'Van Jack', resourceGroup: 'Development Team' }
        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: resourcesData1,
                resources: resourceCollection1,
                viewType: 'ResourceView',
                showOverAllocation: true,
                enableMultiTaskbar: true,
                enableContextMenu: true,
                enableUndoRedo: true,
                allowSorting: true,
                allowReordering: true,
                editDialogFields: [
                    {
                        type: 'Resources'
                    },
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    resourceInfo: 'resources',
                    work: 'work',
                    child: 'subtasks',
                    notes: 'info'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: false,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Undo', 'Redo'],
                allowTaskbarDragAndDrop: true,
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                readOnly: false,
                allowRowDragAndDrop: true,
                allowResizing: true,
                allowFiltering: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    
        it('Collapse from Chart taskbar side', () => {
            let clickElement: HTMLElement = ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(1) > td div.e-gantt-parent-taskbar') as HTMLElement;
            triggerMouseEvent(clickElement, 'mouseup');
            expect(clickElement.classList.contains('e-row-collapse')).toBe(false);
        });
    });
    describe('collaspe rom chart resoruce view', () => {
        let ganttObj: Gantt;
        let resourcesData1 : any = [
            {
                TaskID: 1,
                TaskName: 'Project initiation',
                StartDate: new Date('03/29/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    {
                        TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                        Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
                    },
                    {
                        TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                        resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
                    },
                    {
                        TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                        resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
                    },
                ]
            },
        ];
        let resourceCollection1 : any = [
            { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
            { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
            { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' },
            { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team' },
            { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team' },
            { resourceId: 6, resourceName: 'Van Jack', resourceGroup: 'Development Team' }
        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: resourcesData1,
                resources: resourceCollection1,
                viewType: 'ResourceView',
                showOverAllocation: true,
                enableContextMenu: true,
                enableUndoRedo: true,
                allowSorting: true,
                allowReordering: true,
                editDialogFields: [
                    {
                        type: 'Resources'
                    },
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    resourceInfo: 'resources',
                    work: 'work',
                    child: 'subtasks',
                    notes: 'info'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: false,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Undo', 'Redo'],
                allowTaskbarDragAndDrop: true,
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                readOnly: false,
                allowRowDragAndDrop: true,
                allowResizing: true,
                allowFiltering: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    
        it('Collapse from Chart taskbar side', () => {
            let clickElement: HTMLElement = ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(1) > td div.e-gantt-parent-taskbar') as HTMLElement;
            triggerMouseEvent(clickElement, 'mouseup');
            expect(clickElement.classList.contains('e-row-collapse')).toBe(true);
        });
    });

    describe('collaspe rom chart resoruce view', () => {
        let ganttObj: Gantt;
        let resourcesData1 : any = [
            {
                TaskID: 1,
                TaskName: 'Project initiation',
                StartDate: new Date('03/29/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    {
                        TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                        Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
                    },
                    {
                        TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                        resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
                    },
                    {
                        TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                        resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
                    },
                ]
            },
        ];
        let resourceCollection1 : any = [
            { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
            { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
            { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' },
            { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team' },
            { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team' },
            { resourceId: 6, resourceName: 'Van Jack', resourceGroup: 'Development Team' }
        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: resourcesData1,
                resources: resourceCollection1,
                viewType: 'ResourceView',
                showOverAllocation: true,
                allowTaskbarOverlap: false,
                enableContextMenu: true,
                enableUndoRedo: true,
                allowSorting: true,
                allowReordering: true,
                editDialogFields: [
                    {
                        type: 'Resources'
                    },
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    resourceInfo: 'resources',
                    work: 'work',
                    child: 'subtasks',
                    notes: 'info'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: false,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Undo', 'Redo'],
                allowTaskbarDragAndDrop: true,
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                readOnly: false,
                allowRowDragAndDrop: true,
                allowResizing: true,
                allowFiltering: true,
                enableRtl: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    
        it('Collapse all from Chart taskbar side', () => {
            ganttObj.collapseAll();
            expect(ganttObj.flatData[0].expanded).toBe(false);

        });
    });
 describe('Gantt tasks collapse', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: multiTaskbarData,
                    resources: multiResources,
                    viewType: 'ResourceView',
                    enableMultiTaskbar: true,
                    collapseAllParentTasks: true,
                    showOverAllocation: true,
                    taskType: 'FixedWork',
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        dependency: 'Predecessor',
                        progress: 'Progress',
                        resourceInfo: 'resources',
                        work: 'work',
                        child: 'subtasks'
                    },
                    resourceFields: {
                        id: 'resourceId',
                        name: 'resourceName',
                        unit: 'resourceUnit',
                        group: 'resourceGroup'
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    columns: [
                        { field: 'TaskID', visible: false },
                        { field: 'TaskName', headerText: 'Name', width: 250 },
                        { field: 'work', headerText: 'Work' },
                        { field: 'Progress' },
                        { field: 'resourceGroup', headerText: 'Group' },
                        { field: 'StartDate' },
                        { field: 'Duration' },
                    ],
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                    labelSettings: {
                        taskLabel: 'TaskName'
                    },
                    splitterSettings: {
                        columnIndex: 2
                    },
                    allowResizing: true,
                    allowSelection: true,
                    highlightWeekends: true,
                    allowTaskbarOverlap: false,
                    treeColumnIndex: 1,
                    height: '450px',
                    projectStartDate: new Date('03/24/2024'),
                    projectEndDate: new Date('05/18/2024')
                }, done);
        });
     it('initial load with collapseallparenttasks', () => {
         if (ganttObj.getRowByID(4))
             expect(ganttObj.getRowByID(4).style.height).toBe('108px');
     });
     afterAll(() => {
         if (ganttObj) {
             destroyGantt(ganttObj);
         }
     });
 });
    // describe('Dialog editing - resoruce selection', () => {
    //     let ganttObj: Gantt;
    //     let dataSource: DataManager = new DataManager({
    //         url: 'https://services.syncfusion.com/js/production/api/GanttLoadOnDemand',
    //         adaptor: new WebApiAdaptor,
    //         crossDomain: true
    //     });
    
    //     beforeAll((done: Function) => {
    //         ganttObj = createGantt({
    //             dataSource: dataSource,
    //     loadChildOnDemand: false,
    //     taskFields: {
    //         id: 'taskId',
    //         name: 'taskName',
    //         startDate: 'startDate',
    //         endDate: 'endDate',
    //         duration: 'duration',
    //         progress: 'progress',
    //         hasChildMapping: 'isParent',
    //         parentID: 'parentID'
    //     },
    //     columns: [
    //         { field: 'taskId', headerText: 'Task ID' },
    //         { field: 'taskName', headerText: 'Task Name', allowReordering: false },
    //         { field: 'startDate', headerText: 'Start Date', allowSorting: false },
    //         { field: 'duration', headerText: 'Duration', allowEditing: false },
    //         { field: 'progress', headerText: 'Progress', allowFiltering: false },
    //     ],
    //     allowSelection: true,
    //     enableVirtualization: true,
    //     splitterSettings: {
    //         columnIndex: 3,
    //     },
    //     tooltipSettings: {
    //         showTooltip: true
    //     },
    //     highlightWeekends: true,
    //     timelineSettings: {
    //         showTooltip: true,
    //         topTier: {
    //             unit: 'Week',
    //             format: 'dd/MM/yyyy'
    //         },
    //         bottomTier: {
    //             unit: 'Day',
    //             count: 1
    //         }
    //     },
    //     treeColumnIndex: 1,
    //     taskbarHeight: 20,
    //     rowHeight: 40,
    //     height: '460px',
    //     projectStartDate: new Date('01/02/2000'),
    //     projectEndDate: new Date('12/01/2002'),
    //         }, done);
    //     });
    //     afterAll(() => {
    //         if (ganttObj) {
    //             destroyGantt(ganttObj);
    //         }
    //     });
    
    //     fit('Collapse from Chart taskbar side', () => {
    //         debugger
    //         let clickElement: HTMLElement = ganttObj.element.querySelector('#GanttTaskTable' + ganttObj.element.id + ' tr:nth-child(1) > td div.e-gantt-parent-taskbar') as HTMLElement;
    //         triggerMouseEvent(clickElement, 'mouseup');
    //         expect(clickElement.classList.contains('e-row-collapse')).toBe(true);
    //     });
    // });
});
describe('updating parent row index properly', () => {
    let ganttObj: Gantt;
    let data: Object = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 }]
        },
        {
            TaskID: 6,
            TaskName: 'Market Research',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8", Progress: 30 },
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                renderBaseline: true,
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                filterSettings: {
                    type: 'Menu'
                },
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
                timelineSettings: {
                    // showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                eventMarkers: [
                    {
                        day: '04/10/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off'
                    }
                ],
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('updating parent row index properly', () => {
        ganttObj.addRecord();
        expect(ganttObj.currentViewData[4].parentItem.index).toBe(3);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Collapse root parent for custom task mode', () => {
    let ganttObj: Gantt;
    let sampleData: any = [
        {
            "nodeID": 1,
            "nodeName": "Borgiallo",
            "startDate": "2024-10-14T05:00:00.000Z",
            "duration": 10,
            "progress": 100,
            "nodeType": 10000,
            "hasSubNodes": true,
            "parentID": null,

            "isManual" : true,
            "baselineStartDate": "2024-10-15T05:00:00.000Z",
            "baselineEndDate": "2024-10-24T05:00:00.000Z",
        },
        {
            "nodeID": 2,
            "nodeName": "Baseline",
            "startDate": "2024-10-15T05:00:00.000Z",
            "endDate": "2024-10-25T05:00:00.000Z",
            "duration": 10,
            "progress": 100,
            "nodeType": 20000,
            "hasSubNodes": true,
            "isManual" : false,
            "parentID": 1
        },
        {
            "nodeID": 200,
            "nodeName": "Collect",
            "startDate": "2024-10-15T05:00:00.000Z",
            "duration": 1,
            "progress": 100,
            "nodeType": 0,
            "isManual" : false,
            "parentID": 2
        },
        {
            "nodeID": 304,
            "nodeName": "Accept",
            "startDate": "2024-10-24T05:00:00.000Z",
            "duration": 1,
            "progress": 100,
            "nodeType": 4,
            "isManual" : false,
            "parentID": 2
        },
        {
            "nodeID": 4,
            "nodeName": "Actual",
            "startDate": "2024-10-14T05:00:00.000Z",
            "endDate": "2024-10-24T06:00:00.000Z",
            "duration": 10,
            "progress": 100,
            "nodeType": 20000,
            "hasSubNodes": true,
            "isManual" : false,
            "parentID": 1
        },
        {
            "nodeID": 400,
            "nodeName": "Collect",
            "startDate": "2024-10-14T05:00:00.000Z",
            "duration": 7,
            "progress": 100,
            "nodeType": 0,
            "isManual" : false,
            "parentID": 4
        },  {
            "nodeID": 404,
            "nodeName": "Accept",
            "startDate": "2024-10-23T05:00:00.000Z",
            "duration": 1,
            "progress": 100,
            "nodeType": 4,
            "isManual" : false,
            "parentID": 4
        }
      ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: sampleData,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: "nodeID",
                    name: "nodeName",
                    startDate: "startDate",
                    endDate: "endDate",
                    duration: "duration",
                    progress: "progress",
                    parentID: "parentID",
                    manual: 'isManual',
                    baselineStartDate: 'baselineStartDate',
                    baselineEndDate: 'baselineEndDate' 
                },
                enableMultiTaskbar: true,
                renderBaseline: true,
                taskMode:"Custom",
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowSelection: true,
                selectedRowIndex: 1,
                columns:[
                    { field: 'nodeName', headerText: 'Site', width: '400' },
                    { field: 'nodeID', headerText: 'Node Id', visible: false}, // Aparently, app crashes on editing if Id field is not included.  So include but hide it.
                  ]
            }, done);
    });
    it('Collapse root parent for custom task mode', () => {
        ganttObj.collapsed = () => {
            expect(ganttObj.treeGrid.getRows()[0].getElementsByClassName('e-treegridexpand').length).toBe(0);
        }
        ganttObj.collapseByID(1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
