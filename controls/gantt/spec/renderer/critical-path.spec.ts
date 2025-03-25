/**
 * Gantt base spec
 */
import { Gantt, Edit, CriticalPath, ContextMenu, ContextMenuClickEventArgs, RowDD, Selection, Toolbar, DayMarkers, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, ExcelExport, PdfExport, ITaskbarEditedEventArgs } from '../../src/index';
import * as cls from '../../src/gantt/base/css-constants';
import { multiTaskbarData, projectData1, resources, normalResourceData, resourceCollection, criticalPathData, taskModeData1, taskModeData2, criticalPathData1, criticalPathData2, bwData1, bwData2, bwData3, bwData4, criticalData2, unscheduleCriticalTask,cr918186, CR933826 } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
Gantt.Inject(Edit, CriticalPath, ContextMenu, RowDD, Selection, Toolbar, DayMarkers, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, ExcelExport, PdfExport);
describe('Gantt spec for critical path', () => {
    describe('critical path rendering', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: projectData1,
                allowSelection: true,
                allowResizing: true,
                allowSorting: true,
                enableContextMenu: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
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
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                    { text: 'update', id: 'update' }],
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
            }, done);
        });
        it('Initial rendering critical path ', () => {
            expect(ganttObj.flatData[5].isCritical).toBe(true);
            expect(ganttObj.flatData[12].isCritical).toBe(true);
            expect(ganttObj.flatData[16].isCritical).toBe(true);
            expect(ganttObj.flatData[17].isCritical).toBe(true);
        });
        it('Drag and Drop', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'refresh') {
                    expect(ganttObj.flatData[33].isCritical).toBe(false);
                }
            };
            ganttObj.reorderRows([27], 35, 'child');
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Right resizing taskbar', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: projectData1,
                allowSelection: true,
                allowResizing: true,
                allowSorting: true,
                enableContextMenu: true,
                enableCriticalPath: true,
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
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                    { text: 'update', id: 'update' }],
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
            }, done);
        });
        it('Right Resizing', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                    expect(args.data.isCritical).toBe(true);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(41) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 1244, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Progress Resizing', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'ProgressResizing') {
                    expect(args.data.isCritical).toBe(true);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(12) > td > div.e-taskbar-main-container > div.e-child-progress-resizer') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', -10, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Delete dependency', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save') {
                    expect(ganttObj.flatData[18].isCritical).toBe(false);
                }
            };
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(20) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            let e = {
                item: ganttObj.contextMenuModule.contextMenu.items[5].items[0],
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        });
        it('Add record child', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'refresh') {
                    expect(ganttObj.flatData[40].isCritical).toBe(true);
                    expect(ganttObj.flatData[38].isCritical).toBe(false);
                }
            };
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(39)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Child' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering for FF and SF', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: criticalPathData,
                allowSorting: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                    'PrevTimeSpan', 'NextTimeSpan'],
                allowSelection: true,
                gridLines: "Both",
                showColumnMenu: false,
                highlightWeekends: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/25/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
        });
        it('Initial rendering critical path for SF ang FF', () => {
            expect(ganttObj.flatData[1].isCritical).toBe(true);
            expect(ganttObj.flatData[3].isCritical).toBe(false);
            expect(ganttObj.flatData[4].isCritical).toBe(false);
            expect(ganttObj.flatData[5].isCritical).toBe(false);
        });
        it('Right Resizing SF', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                    expect(args.data.isCritical).toBe(false);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 150, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Right Resizing FF', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                    expect(args.data.isCritical).toBe(true);
                    expect(ganttObj.flatData[4].isCritical).toBe(true);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(6) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 600, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Right Resizing SS', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                    expect(args.data.isCritical).toBe(true);
                    expect(ganttObj.flatData[4].isCritical).toBe(true);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(7) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 700, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering for FF and SF', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: criticalPathData,
                allowSorting: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                    'PrevTimeSpan', 'NextTimeSpan'],
                allowSelection: true,
                gridLines: "Both",
                showColumnMenu: false,
                highlightWeekends: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/25/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
        });
        it('Initial rendering critical path for SF ang FF', () => {
            expect(ganttObj.flatData[1].isCritical).toBe(true);
            expect(ganttObj.flatData[3].isCritical).toBe(false);
            expect(ganttObj.flatData[4].isCritical).toBe(false);
            expect(ganttObj.flatData[5].isCritical).toBe(false);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering for FF and SF with diff duration units', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: criticalPathData,
                allowSorting: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                    'PrevTimeSpan', 'NextTimeSpan'],
                allowSelection: true,
                gridLines: "Both",
                showColumnMenu: false,
                highlightWeekends: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/25/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
        });
        it('Duration units with hour and minute', () => {
            expect(ganttObj.flatData[1].isCritical).toBe(true);
            expect(ganttObj.flatData[3].isCritical).toBe(false);
            expect(ganttObj.flatData[4].isCritical).toBe(false);
            expect(ganttObj.flatData[5].isCritical).toBe(false);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering for diff taskmode', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: taskModeData1,
                allowSorting: true,
                enableContextMenu: true,
                height: '450px',
                allowSelection: true,
                highlightWeekends: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    endDate: 'EndDate',
                    dependency: 'Predecessor',
                    child: 'Children',
                    manual: 'isManual',
                },
                taskMode: 'Manual',
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                enableCriticalPath: true,
                splitterSettings: {
                    position: "50%",
                    // columnIndex: 4
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                allowFiltering: true,
                columns: [
                    { field: 'TaskID', visible: true },
                    { field: 'TaskName' },
                    { field: 'isManual' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' }
                ],
                validateManualTasksOnLinking: true,
                treeColumnIndex: 1,
                allowReordering: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: '${Progress}%'
                },
                projectStartDate: new Date('02/20/2017'),
                projectEndDate: new Date('03/30/2017'),

            }, done);
        });
        it('Custom taskmode', () => {
            expect(ganttObj.flatData[10].isCritical).toBe(false);
            expect(ganttObj.flatData[11].isCritical).toBe(false);
            expect(ganttObj.flatData[12].isCritical).toBe(true);
            expect(ganttObj.flatData[13].isCritical).toBe(true);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering with offset value for SF', () => {

        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: criticalPathData,
                allowSorting: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                    'PrevTimeSpan', 'NextTimeSpan'],
                allowSelection: true,
                gridLines: "Both",
                showColumnMenu: false,
                highlightWeekends: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/25/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
        });
        it('Critical path after resizing with offset value', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                    expect(args.data.isCritical).toBe(false);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 85, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering with offset value for SS', () => {

        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: criticalPathData,
                allowSorting: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                    'PrevTimeSpan', 'NextTimeSpan'],
                allowSelection: true,
                gridLines: "Both",
                showColumnMenu: false,
                highlightWeekends: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/25/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
        });
        it('Critical path after resizing with offset value', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                    expect(args.data.isCritical).toBe(false);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(6) > td > div.e-taskbar-main-container') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 440, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering with offset value for FF', () => {

        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: criticalPathData,
                allowSorting: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                    'PrevTimeSpan', 'NextTimeSpan'],
                allowSelection: true,
                gridLines: "Both",
                showColumnMenu: false,
                highlightWeekends: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/25/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
        });
        it('Critical path after resizing with offset value', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                    expect(args.data.isCritical).toBe(false);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 80, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering with offset value for FS', () => {

        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: criticalPathData,
                allowSorting: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                    'PrevTimeSpan', 'NextTimeSpan'],
                allowSelection: true,
                gridLines: "Both",
                showColumnMenu: false,
                highlightWeekends: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/25/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
        });
        it('Critical path after resizing with offset value', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'LeftResizing') {
                    expect(args.data.isCritical).toBe(true);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 680, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('taskbar resize for diff taskmode', () => {

        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: taskModeData2,
                allowSorting: true,
                enableContextMenu: true,
                height: '450px',
                allowSelection: true,
                highlightWeekends: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    endDate: 'EndDate',
                    dependency: 'Predecessor',
                    child: 'Children',
                    manual: 'isManual',
                },
                taskMode: 'Manual',
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                enableCriticalPath: true,
                splitterSettings: {
                    position: "50%",
                    // columnIndex: 4
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                allowFiltering: true,
                columns: [
                    { field: 'TaskID', visible: true },
                    { field: 'TaskName' },
                    { field: 'isManual',width:100,editType:'dropdownedit',headerTemplate:'Manual' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' }
                ],
                validateManualTasksOnLinking: true,
                treeColumnIndex: 1,
                allowReordering: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: '${Progress}%'
                },
                projectStartDate: new Date('02/20/2017'),
                projectEndDate: new Date('03/30/2017'),

            }, done);
        });
        it('Custom taskmode', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                    expect(args.data.isCritical).toBe(false);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(12) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 420, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering FS and FF', () => {

        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: criticalPathData1,
                allowSorting: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                    'PrevTimeSpan', 'NextTimeSpan'],
                allowSelection: true,
                gridLines: "Both",
                showColumnMenu: false,
                highlightWeekends: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/25/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
        });
        it('Initial rendering critical path for SF ang FF', () => {
            expect(ganttObj.flatData[5].isCritical).toBe(true);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering FS and FF', () => {

        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: criticalPathData2,
                allowSorting: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                    'PrevTimeSpan', 'NextTimeSpan'],
                allowSelection: true,
                gridLines: "Both",
                showColumnMenu: false,
                highlightWeekends: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/25/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
        });
        it('Initial rendering critical path for SF ang FF', () => {
            expect(ganttObj.flatData[5].isCritical).toBe(true);
        });
        it('Editing start date column without predecessor', () => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType == 'save') {
                    expect(args.data.isCritical).toBe(true);
                }
            };
            let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(4)') as HTMLElement;
            triggerMouseEvent(startDate, 'dblclick');
            let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolstartDate') as any).ej2_instances[0];
            input.value = new Date('02/22/2017');
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
        });
        it('Editing start date column with predecessor', () => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType == 'save') {
                    expect(args.data.isCritical).toBe(true);
                }
            };
            let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(4)') as HTMLElement;
            triggerMouseEvent(startDate, 'dblclick');
            let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolstartDate') as any).ej2_instances[0];
            input.value = new Date('02/16/2017');
            input.dataBind();
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('resource view with predecessor', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: multiTaskbarData,
                resources: resources,
                viewType: 'ResourceView',
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
                    expandState: 'isExpand',
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
                    { field: 'work', headerText: 'Work', editType:'numericedit' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                enableCriticalPath: true,
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
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
        });
        it('Initial rendering critical path for resource view', () => {
            expect(ganttObj.flatData[11].isCritical).toBe(false);
            expect(ganttObj.flatData[12].isCritical).toBe(false);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('resource view without predecessor', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: multiTaskbarData,
                resources: resources,
                viewType: 'ResourceView',
                collapseAllParentTasks: true,
                showOverAllocation: true,
                taskType: 'FixedWork',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    work: 'work',
                    expandState: 'isExpand',
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
                enableCriticalPath: true,
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
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
        });
        it('Initial rendering critical path for resource view', () => {
            expect(ganttObj.flatData[11].isCritical).toBe(false);
            expect(ganttObj.flatData[12].isCritical).toBe(false);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('critical path rendering', () => {

        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: projectData1,
                allowSelection: true,
                allowResizing: true,
                allowSorting: true,
                enableContextMenu: true,
                enableCriticalPath: true,
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
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['ZoomToFit', 'CriticalPath'],
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
            }, done);
        });
        it('Initial rendering critical path ', () => {
            ganttObj.fitToProject();
            expect(ganttObj.timelineModule.timelineStartDate.getDate()).toBe(25);
            let criticalpath: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_critical-path') as HTMLElement;
            triggerMouseEvent(criticalpath, 'click');
            expect(ganttObj.timelineModule.timelineStartDate.getDate()).toBe(25);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('resource view without predecessor', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: multiTaskbarData,
                resources: resources,
                viewType: 'ResourceView',
                collapseAllParentTasks: true,
                showOverAllocation: true,
                taskType: 'FixedWork',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    work: 'work',
                    expandState: 'isExpand',
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
                enableCriticalPath: true,
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
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
        });
        it('Initial rendering critical path for resource view', () => {
            expect(ganttObj.flatData[11].isCritical).toBe(false);
            expect(ganttObj.flatData[12].isCritical).toBe(false);
        });
        afterAll(() => {
            if(ganttObj){
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Critical path rendering for resource view', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: normalResourceData,
                resources: resourceCollection,
                enableCriticalPath: true,
                enableMultiTaskbar: true,
                viewType: 'ResourceView',
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
                    child: 'subtasks'
                },
                taskType: 'FixedWork',
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
                showOverAllocation: true,
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
                    { field: 'resources', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                splitterSettings: { columnIndex: 3 },
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
        });
        it('Multitaskbar Resource view', () => {
            expect(ganttObj.currentViewData[15].ganttProperties.isCritical).toBe(true);
        });
        it('Multitaskbar Resource view', () => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "save") {
                    expect(ganttObj.currentViewData[1].ganttProperties.isCritical).toBe(true);
                    expect(ganttObj.currentViewData[2].ganttProperties.isCritical).toBe(true);
                }
            };
            let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(7)') as HTMLElement;
            triggerMouseEvent(duration, 'dblclick');
            let input: any = (ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as any).ej2_instances[0];
            input.value = '16 days';
            input.dataBind();
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Critical path rendering for resource view', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: normalResourceData,
                resources: resourceCollection,
                enableCriticalPath: true,
                enableMultiTaskbar: true,
                collapseAllParentTasks: true,
                viewType: 'ResourceView',
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
                    child: 'subtasks'
                },
                taskType: 'FixedWork',
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
                showOverAllocation: true,
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
                    { field: 'resources', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                splitterSettings: { columnIndex: 3 },
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
        });
        it('Multitaskbar Resource view', () => {
            expect(ganttObj.currentViewData[15].ganttProperties.isCritical).toBe(true);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
});

describe('clone taskbar Right resizing taskbar', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectData1,
            allowSelection: true,
            allowResizing: true,
            allowSorting: true,
            enableContextMenu: true,
            enableCriticalPath: true,
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
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                { text: 'update', id: 'update' }],
            projectStartDate: new Date('02/01/2017'),
            projectEndDate: new Date('12/30/2017'),
            rowHeight: 40,
        }, done);
    });
    it('Right Resizing', () => {
        ganttObj.actionComplete = (args) => {
            if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                expect(args.data.isCritical).toBe(true);
            }
        }
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(41) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 1244, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(!isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(!isNullOrUndefined(resizeCheck)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    it('Progress Resizing', () => {
        ganttObj.actionComplete = (args) => {
            if (args.requestType == 'save' && args.taskBarEditAction == 'ProgressResizing') {
                expect(args.data.isCritical).toBe(true);
            }
        }
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(12) > td > div.e-taskbar-main-container > div.e-child-progress-resizer') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -10, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(!isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(!isNullOrUndefined(resizeCheck)).toBe(false);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

});
describe('critical path rendering with empty datasource', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [],
            allowSelection: true,
            allowResizing: true,
            allowSorting: true,
            enableContextMenu: true,
            enableCriticalPath: true,
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
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar: ['ZoomToFit', 'CriticalPath'],
            projectStartDate: new Date('02/01/2017'),
            projectEndDate: new Date('12/30/2017'),
            rowHeight: 40,
        }, done);
    });
    it('critical path with datasource ', () => {
        expect(ganttObj.currentViewData.length).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Critical path is not working properly when the baseline is changed dynamically', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: bwData1,
            allowSorting: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                parentID: 'parentID',
                baselineStartDate: 'BaselineStartDate',
                baselineEndDate: 'BaselineEndDate'
            },
            splitterSettings: {
                columnIndex: 2,
            },
            allowRowDragAndDrop: true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
                newRowPosition: 'Bottom',
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'CriticalPath',],
            allowSelection: true,
            gridLines: "Both",
            showColumnMenu: false,
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            labelSettings: {
                taskLabel: 'Progress',
            },
            height: '550px',
            allowUnscheduledTasks: true,
        }, done);
    });
    it('check critical path class', () => {
        ganttObj.enableCriticalPath = true;
        ganttObj.renderBaseline = true;
        ganttObj.dataBind();
        expect(ganttObj.element.getElementsByClassName('e-gantt-child-critical-taskbar-inner-div').length).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Critical path is not working properly when the baseline is changed dynamically', () => {
    let ganttObj: Gantt;


    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: bwData2,
            allowSorting: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                parentID: 'parentID',
                baselineStartDate: 'BaselineStartDate',
                baselineEndDate: 'BaselineEndDate'
            },
            splitterSettings: {
                columnIndex: 2,
            },
            allowRowDragAndDrop: true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
                newRowPosition: 'Bottom',
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'CriticalPath',],
            allowSelection: true,
            gridLines: "Both",
            showColumnMenu: false,
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            labelSettings: {
                taskLabel: 'Progress',
            },
            height: '550px',
            allowUnscheduledTasks: true,
        }, done);
    });
    it('check critical path class', () => {
        ganttObj.enableCriticalPath = true;
        ganttObj.renderBaseline = true;
        ganttObj.dataBind();
        expect(ganttObj.element.getElementsByClassName('e-gantt-child-critical-taskbar-inner-div').length).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Critical path is not working properly issue', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: bwData3,
            allowSorting: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                parentID: 'parentID',
                baselineStartDate: 'BaselineStartDate',
                baselineEndDate: 'BaselineEndDate'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
                newRowPosition: 'Bottom',
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                'PrevTimeSpan', 'NextTimeSpan', 'CriticalPath'],
            allowSelection: true,
            gridLines: "Both",
            showColumnMenu: false,
            enableCriticalPath: false,
            allowRowDragAndDrop: true,
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: 'Progress'
            },
            height: '550px',
            allowUnscheduledTasks: true,
        }, done);
    });
    it('check critical path class', () => {
        ganttObj.enableCriticalPath = true;
        ganttObj.dataBind();
        expect(ganttObj.element.getElementsByClassName('e-gantt-child-critical-taskbar-inner-div').length).toBe(4);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Index is not updated', () => {

    let ganttObj: Gantt;
  
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: bwData4,
            allowSorting: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                parentID: 'parentID',
                baselineStartDate: 'BaselineStartDate',
                baselineEndDate: 'BaselineEndDate'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                newRowPosition: 'Bottom',
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                'PrevTimeSpan', 'NextTimeSpan', 'CriticalPath'],
            allowSelection: true,
            gridLines: "Both",
            showColumnMenu: false,
            enableCriticalPath: false,
            allowRowDragAndDrop: true,
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: 'Progress'
            },
            height: '550px',
            allowUnscheduledTasks: true,
        }, done);
    });
    it('check index', () => {
        ganttObj.actionComplete = (args) => {
            if (args.requestType = 'delete') {
                ganttObj.flatData[1].index = 1;
            }
        }
        let deleteToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_delete') as HTMLElement;
        triggerMouseEvent(deleteToolbar, 'click');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR: 883874-Critical path of task connected dependent tasks have not changed to critical path', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: criticalData2,
            allowSelection: true,
            allowResizing: true,
            enableCriticalPath: true,
            taskFields: {
                id: 'taskId',
                name: 'taskName',
                startDate: 'startDate',
                duration: 'duration',
                endDate: 'endDate',
                dependency: 'dependencies',
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
        }, done);
    });
    it('Verifying the critical path if offset is 1-Day', () => {
        expect(ganttObj.currentViewData[0].isCritical).toBe(true);
        expect(ganttObj.currentViewData[1].isCritical).toBe(true);
        expect(ganttObj.currentViewData[1].ganttProperties.predecessor[0].offset).toBe(1);
    });
    afterAll(() => {
        if(ganttObj){
            destroyGantt(ganttObj);
        }
    });
});
describe('Invalid critical task', () => {
    let ganttObj: Gantt;
    let projectNewData = [
        {
            TaskID: 1,
            TaskName: 'Product concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
                {
                    TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 2,
                    Predecessor: '2', Progress: 30
                },
            ]
        },
        {
            TaskID: 5, TaskName: 'Concept approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: '3,4',
            Indicators: [
                {
                    'date': '04/10/2019',
                    'name': 'Design Phase',
                    'tooltip': 'Design phase completed',
                    'iconClass': 'okIcon e-icons'
                }
            ],
        },
        {
            TaskID: 6,
            TaskName: 'Market research',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 7,
                    TaskName: 'Demand analysis',
                    StartDate: new Date('04/04/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        {
                            TaskID: 8, TaskName: 'Customer strength', StartDate: new Date('04/04/2019'), Duration: 4,
                            Predecessor: '5', Progress: 30
                        },
                        { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: '5' }
                    ]
                },
                {
                    TaskID: 10, TaskName: 'Competitor analysis', StartDate: new Date('04/04/2019'), Duration: 4,
                    Predecessor: '7, 8', Progress: 30
                },
                { TaskID: 11, TaskName: 'Product strength analsysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: '9' },
                {
                    TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: '10',
                    Indicators: [
                        {
                            'date': '04/27/2019',
                            'name': 'Research completed',
                            'tooltip': 'Research completed',
                            'iconClass': 'description e-icons'
                        }
                    ],
                }
            ]
        },
        {
            TaskID: 13,
            TaskName: 'Product design and development',
            StartDate: new Date('04/04/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 14, TaskName: 'Functionality design', StartDate: new Date('04/04/2019'),
                    Duration: 3, Progress: 30, Predecessor: '12'
                },
                { TaskID: 15, TaskName: 'Quality design', StartDate: new Date('04/04/2019'), Duration: 3, Predecessor: '12' },
                { TaskID: 16, TaskName: 'Define reliability', StartDate: new Date('04/04/2019'), Duration: 2, Progress: 30, Predecessor: '15' },
                { TaskID: 17, TaskName: 'Identifying raw materials', StartDate: new Date('04/04/2019'), Duration: 2, Predecessor: '15' },
                {
                    TaskID: 18,
                    TaskName: 'Define cost plan',
                    StartDate: new Date('04/04/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        {
                            TaskID: 19, TaskName: 'Manufacturing cost', StartDate: new Date('04/04/2019'),
                            Duration: 2, Progress: 30, Predecessor: '17'
                        },
                        { TaskID: 20, TaskName: 'Selling cost', StartDate: new Date('04/04/2019'), Duration: 2, Predecessor: '17' }
                    ]
                },
                {
                    TaskID: 21,
                    TaskName: 'Development of the final design',
                    StartDate: new Date('04/04/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        {
                            TaskID: 22, TaskName: 'Defining dimensions and package volume', StartDate: new Date('04/04/2019'),
                            Duration: 2, Progress: 30, Predecessor: '19,20'
                        },
                        {
                            TaskID: 23, TaskName: 'Develop design to meet industry standards', StartDate: new Date('04/04/2019'),
                            Duration: 2, Predecessor: '22'
                        },
                        { TaskID: 24, TaskName: 'Include all the details', StartDate: new Date('04/04/2019'), Duration: 3, Predecessor: '23' }
                    ]
                },
                {
                    TaskID: 25, TaskName: 'CAD computer-aided design', StartDate: new Date('04/04/2019'),
                    Duration: 3, Progress: 30, Predecessor: '24'
                },
                { TaskID: 26, TaskName: 'CAM computer-aided manufacturing', StartDate: new Date('04/04/2019'), Duration: 3, Predecessor: '25' },
                {
                    TaskID: 27, TaskName: 'Design complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: '26',
                }
            ]
        },
        { TaskID: 28, TaskName: 'Prototype testing', StartDate: new Date('04/04/2019'), Duration: 4, Progress: 30, Predecessor: '27' },
        { TaskID: 29, TaskName: 'Include feedback', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: '28ss', Indicators: [
                {
                    'date': '05/24/2019',
                    'name': 'Production phase',
                    'tooltip': 'Production phase completed',
                    'iconClass': 'okIcon e-icons'
                }
            ], },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectNewData,
        height: '450px',
        enableCriticalPath: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            child: 'subtasks'
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        treeColumnIndex: 1,
        toolbar: ['Add', 'Edit', 'Delete', 'CriticalPath'],
        columns: [
            { field: 'TaskID', width: 80 },
            { field: 'TaskName', headerText: 'Name', width: 250 },
            { field: 'StartDate' },
            { field: 'EndDate' },
            { field: 'Duration' },
            { field: 'Predecessor' },
            { field: 'Progress' },
        ],
        labelSettings: {
            leftLabel: 'TaskName'
        },
        projectStartDate: new Date('03/24/2019'),
        projectEndDate: new Date('07/06/2019')
        }, done);
    });
    it('Verifying the critical path task', () => {
        ganttObj.actionComplete = (args: any): void => {
            if (args.requestType === 'save') {
                expect(ganttObj.flatData[10].ganttProperties.isCritical).toBe(true);
            }
        }
        let predecessor: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(12) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(predecessor, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as any).ej2_instances[0];
        input.value = '10FS,11FS';
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(13) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(element, 'click');
    });
    afterAll(() => {
        if(ganttObj){
            destroyGantt(ganttObj);
        }
    });
});
describe('Rendering unschedule critical task', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: unscheduleCriticalTask,
            height: '450px',
            enableCriticalPath: true,
            allowUnscheduledTasks :true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            treeColumnIndex: 1,
            toolbar: ['Add', 'Edit', 'Delete', 'CriticalPath'],
            columns: [
                { field: 'TaskID', width: 80 },
                { field: 'TaskName', headerText: 'Name', width: 250 },
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' },
                { field: 'Predecessor' },
                { field: 'Progress' },
            ],
            labelSettings: {
                leftLabel: 'TaskName'
            },
            projectStartDate: new Date('03/24/2019'),
            projectEndDate: new Date('07/06/2019')
        }, done);
    });
    it('Checking for unscheduled critical task', (done:Function) => {
        ganttObj.criticalPathModule.getCriticalTasks();
        ganttObj.dataBound = (): void => {
            expect(ganttObj.flatData[0].isCritical).toBe(true)
            done()
        }
        ganttObj.refresh()
    });
    afterAll(() => {
        if(ganttObj){
            destroyGantt(ganttObj);
        }
    });
});

describe('Rendering critical task for different modes', () => {
    let ganttObj: Gantt;
    let projectNewData = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                    Indicators: [
                        {
                            'date': '04/10/2019',
                            'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                            'name': 'Indicator title',
                            'tooltip': 'tooltip'
                        }
                    ]
                },
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
        {
            TaskID: 6,
            TaskName: 'Market Research',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 7,
                    TaskName: 'Demand Analysis',
                    StartDate: new Date('04/04/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 8, TaskName: 'Customer strength', BaselineStartDate: new Date('04/08/2019'), BaselineEndDate: new Date('04/12/2019'), StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5", Progress: 30 },
                        { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5FS+2hour" },
                        { TaskID: 10, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5FS+2day" },
                        { TaskID: 11, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5FS+2minute" }
                    ]
                },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectNewData,
        allowSorting: true,
        allowReordering: true,
        enableContextMenu: true,
        enableCriticalPath: true,
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
        selectedRowIndex: 1,
        allowFiltering: true,
        gridLines: "Both",
        showColumnMenu: true,
        highlightWeekends: true,
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
    it('Checking for critical task', () => {
        ganttObj.criticalPathModule.showCriticalPath(false);
        ganttObj.getCriticalTasks();
        expect(ganttObj.flatData[9].ganttProperties.isCritical).toBe(true);
    });
    afterAll(() => {
        if(ganttObj){
            destroyGantt(ganttObj);
        }
    });
});

describe('Rendering critical task for SS connection', () => {
    let ganttObj: Gantt;
    let projectNewData = [
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/04/2019'), Duration: 0 },
        {
            TaskID: 6,
            TaskName: 'Market Research',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 7,
                    TaskName: 'Demand Analysis',
                    StartDate: new Date('04/04/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                      //  { TaskID: 8, TaskName: 'Customer strength', BaselineStartDate: new Date('04/08/2019'), BaselineEndDate: new Date('04/12/2019'), StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5", Progress: 30 },
                        { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5SS-2" },
                    ]
                },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectNewData,
        allowSorting: true,
        allowReordering: true,
        enableContextMenu: true,
        enableCriticalPath: true,
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
        selectedRowIndex: 1,
        allowFiltering: true,
        gridLines: "Both",
        showColumnMenu: true,
        highlightWeekends: true,
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
    it('Checking for critical task SS', () => {
        expect(ganttObj.flatData[0].ganttProperties.isCritical).toBe(true);
    });
    afterAll(() => {
        if(ganttObj){
            destroyGantt(ganttObj);
        }
    });
});

describe('Rendering critical task for SF connection', () => {
    let ganttObj: Gantt;
    let projectNewData = [
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/04/2019'), Duration: 0 },
        {
            TaskID: 6,
            TaskName: 'Market Research',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 7,
                    TaskName: 'Demand Analysis',
                    StartDate: new Date('04/04/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                      //  { TaskID: 8, TaskName: 'Customer strength', BaselineStartDate: new Date('04/08/2019'), BaselineEndDate: new Date('04/12/2019'), StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5", Progress: 30 },
                        { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4,Predecessor: "5SF" },
                    ]
                },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectNewData,
        allowSorting: true,
        allowReordering: true,
        enableContextMenu: true,
        enableCriticalPath: true,
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
        selectedRowIndex: 1,
        allowFiltering: true,
        gridLines: "Both",
        showColumnMenu: true,
        highlightWeekends: true,
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
    it('Checking for critical task SF', () => {
        ganttObj.windowResize();
        expect(ganttObj.flatData[0].ganttProperties.isCritical).toBe(true);
    });
    afterAll(() => {
        if(ganttObj){
            destroyGantt(ganttObj);
        }
    });
});
describe('Console error occurrence while giving more dependencies', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: cr918186,
            allowPdfExport: true,
            toolbar: ['PdfExport', 'Add'],
            dateFormat: "dd/MM/yyyy HH:mm",
            timezone: "Asia/Shanghai",
            includeWeekend: true,
            dayWorkingTime: [{
                from: 0.01,
                to: 24
            }],
            renderBaseline: true,
            taskFields: {
                id: "taskID",
                name: "taskName",
                startDate: "startDate",
                endDate: "endDate",
                duration: "duration",
                progress: "progress",
                dependency: "dependency",
                notes: "notes",
                child: "subtasks",
                expandState: "expandState",
                cssClass: "cssClass",
                baselineStartDate: "baselineStartDate",
                baselineEndDate: "baselineEndDate",
            },
            height: "768px",
            eventMarkers: [{
                day: new Date(),
                label: "Today"
            }],
            editSettings: {
                allowEditing: true,
                allowAdding: true,
            },
            enableCriticalPath: true,
            highlightWeekends: true,
            columns: [
                {
                    field: "taskID",
                    width: '100px'
                }, {
                    field: "taskName",
                    width: '300px'
                },
                {
                    field: "dependency",
                    width: '300px'
                },
            ],
        }, done);
    });
    it('Console error occurrence while giving more dependencies', () => {
        setTimeout(() => {
            expect(ganttObj.currentViewData.length > 0).toBe(true)   
        }, 100);
    });
    afterAll(() => {
        if(ganttObj){
            destroyGantt(ganttObj);
        }
    });
});
describe('update critical property', () => {
    let ganttObj: Gantt;
    let projectNewData: Object[] = [
        {
            TaskID: 6,
            TaskName: 'Market Research',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 7,
                    TaskName: 'Demand Analysis',
                    StartDate: new Date('04/04/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 8, TaskName: 'Customer strength', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5",Progress: 30 },
                        { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5" }
                    ]
                },
                { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8" ,Progress: 30},
                { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "9" },
                { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: "10" }
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectNewData,
            allowSorting: true,
            enableCriticalPath: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency:'Predecessor',
                child: 'subtasks'
            },

            editSettings: {
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar:['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
            'PrevTimeSpan', 'NextTimeSpan'],
            allowSelection: true,
            gridLines: "Both",
            showColumnMenu: false,
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: 'Progress'
            },
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
        }, done);
    });
    it('Checking for critical task in querytaskbar event', () => {
        ganttObj.queryTaskbarInfo = (args: any): void => {
            expect(ganttObj.currentViewData[6].ganttProperties.isCritical).toBe(true);
            if (
                args.data && args.data.cssClas && args.data.cssClas.indexOf("e-gantt-critical") > -1
            ) {
              args.taskbarBgColor = "#EDCED2";
              args.progressBarBgColor = "#B8394C";
              args.milestoneColor = "#B8394C";
              args.taskbarBorderColor = "#B8394C";

              args.data.isCritical = true;
            } else if (args.data.isCritical) {
              args.taskbarBgColor = "#EDCED2";
              args.progressBarBgColor = "#B8394C";
              args.milestoneColor = "#B8394C";
              args.taskbarBorderColor = "transparent";

              args.data.isCritical = true;
            } else {
              args.taskbarBgColor = "#DFEAEB";
              args.progressBarBgColor = "#00778B";
              args.milestoneColor = "#3D3935";
              args.taskbarBorderColor = "#00778B";
              args.data.isCritical = false;
            }
        };
        let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(7) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(startDate, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolStartDate') as any).ej2_instances[0];
        input.value = new Date('04/17/2019');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
    });
    afterAll(() => {
        if(ganttObj){
            destroyGantt(ganttObj);
        }
    });
});
describe('Invalid critical tasks', () => {
    let ganttObj: Gantt;
    let projectNewData = [
        { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2024'), Duration: 3, Progress: 30 },
        { TaskID: 3, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2024'), Duration: 3,Predecessor:'2FS', Progress: 30 },
        { TaskID: 4, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2024'), Duration: 3,Predecessor:'2FS', Progress: 30 },
        { TaskID: 5, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2024'), Duration: 7,Predecessor:'4FS', Progress: 30 }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectNewData,
        height: '450px',
        enableCriticalPath: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            child: 'subtasks'
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        treeColumnIndex: 1,
        toolbar: ['Add', 'Edit', 'Delete', 'CriticalPath'],
        columns: [
            { field: 'TaskID', width: 80 },
            { field: 'TaskName', headerText: 'Name', width: 250 },
            { field: 'StartDate' },
            { field: 'EndDate' },
            { field: 'Duration' },
            { field: 'Predecessor' },
            { field: 'Progress' },
        ],
        labelSettings: {
            leftLabel: 'TaskName'
        },
        projectStartDate: new Date('03/24/2024'),
        projectEndDate: new Date('07/06/2024')
        }, done);
    });
    it('Checking for critical task which is not in critical', () => {
        expect(ganttObj.flatData[0].ganttProperties.isCritical).toBe(true);
        expect(ganttObj.flatData[1].ganttProperties.isCritical).toBe(false);
        expect(ganttObj.flatData[2].ganttProperties.isCritical).toBe(true);
    });
    afterAll(() => {
        if(ganttObj){
            destroyGantt(ganttObj);
        }
    });
});
describe('Console error for redo deleted parent tasks', () => {
    let ganttObj: Gantt;
    var projectNewData = [
        {
            TaskID: 6,
            TaskName: 'Market Research',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 7,
                    TaskName: 'Demand Analysis',
                    StartDate: new Date('04/04/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 8, TaskName: 'Customer strength', BaselineStartDate: new Date('04/08/2019'), BaselineEndDate: new Date('04/12/2019'), StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5", Progress: 30 },
                        { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5" }
                    ]
                },
                { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8", Progress: 30 },
                { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "9" },
                { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: "10" }
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectNewData,
        allowSorting: true,
        allowReordering: true,
        enableContextMenu: true,
        enableUndoRedo: true,
        enableCriticalPath: true,
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
        toolbar: ['Add', 'Edit', 'Update', 'Undo', 'Redo', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowSelection: true,    
        allowFiltering: true,
        gridLines: "Both",
        showColumnMenu: true,
        highlightWeekends: true,
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
    it('redo action for deleted parent', () => {
        ganttObj.actionComplete = (args) => {
            if (args.requestType == 'add') {
                expect(ganttObj.flatData.length).toBe(7);
                ganttObj.redo();
            }
        };
        ganttObj.deleteRecord(7);
        ganttObj.undo();
    });
    afterAll(() => {
        if(ganttObj){
            destroyGantt(ganttObj);
        }
    });
});
describe('Delay issue occurs when the sample is loaded with the critical path', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
      ganttObj = createGantt(
        {
            dataSource: CR933826,
            allowPdfExport: true,
            height:'400px',
            dateFormat: "dd/MM/yyyy HH:mm",
            timezone: "Asia/Shanghai",
            includeWeekend: true,
            dayWorkingTime: [{
            from: 0.01,
            to: 24
            }],
            renderBaseline: true,
            taskFields: {
            id: "taskID",
            name: "taskName",
            startDate: "startDate",
            endDate: "endDate",
            duration: "duration",
            progress: "progress",
            dependency: "dependency",
            notes: "notes",
            child: "subtasks",
            expandState: "expandState",
            cssClass: "cssClass",
            baselineStartDate: "baselineStartDate",
            baselineEndDate: "baselineEndDate",
            },
            labelSettings: {
            // rightLabel: "taskName",
            // leftLabel: "taskID",
            },
            eventMarkers: [{
            day: new Date(),
            label: "Today"
            }],
            enableCriticalPath: true,
            highlightWeekends: true,
            // queryTaskbarInfo: queryTaskbarInfo,
            columns: [{
                field: "taskID",
                width: '100px'
            },
            {
                field: "taskName",
                width: '300px'
            },
            ],
     }, done);
    });
    it('Delay issue occurs when the sample is loaded with the critical path', () => {
        expect(ganttObj.criticalPathModule.criticalTasks.length).toBe(46);
    });
    afterAll(() => {
        if(ganttObj){
            destroyGantt(ganttObj);
        }
    });
});
describe('Critical path rendering', () => {
    let ganttObj: Gantt;
    let data = [
        {
            'TaskID': "a1",
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('05/03/2017'),
            'Progress': '40',
            'isManual': true,
            'Children': [
                { 'TaskID': "b2", 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('07/03/2017'), 'Progress': '40' },
                { 'TaskID': "c3", 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                    'EndDate': new Date('07/03/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': "d4", 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('07/03/2017'), 'Duration': 5, 'Progress': '40', }
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                allowSorting: true,
                enableContextMenu: true,
                height: '450px',
                allowSelection: true,
                highlightWeekends: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    endDate: 'EndDate',
                    dependency: 'Predecessor',
                    child: 'Children',
                    manual: 'isManual',
                },
                taskMode: 'Custom',
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search'],
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName' },
                    { field: 'isManual' }
                ],
                validateManualTasksOnLinking: true,
                treeColumnIndex: 1,
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                labelSettings: {
                    leftLabel: 'TaskName'
                },
                splitterSettings: {
                    position: '35%'
                },
                projectStartDate: new Date('02/20/2017'),
                projectEndDate: new Date('03/30/2017'),
                enableCriticalPath: true
            }, done);
    });
    it('Critical path rendering ', () => {
        expect(ganttObj.criticalPathModule.criticalTasks.length).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Critical path rendering 1', () => {
    let ganttObj: Gantt;
    let data : any = [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('03/03/2017'),
            'Progress': '40',
            'isManual': true,
            "Predecessor": "2SS+0.10 days",
            'Children': [
                { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Progress': '40',"Predecessor": "3SS+0.10 days,5SF+0.10 days",  },
                { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                    'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40',"Predecessor": "5SF+0.10 days" }
            ]
        },
        {
            'TaskID': 5,
            'TaskName': 'Parent Task 2',
            'StartDate': new Date('03/05/2017'),
            'EndDate': new Date('03/09/2017'),
            'Progress': '40',
            'isManual': true,
            'Children': [
                { 'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/06/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40',"Predecessor": "3SF+0.10 days, 1SF",  },
                { 'TaskID': 7, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/06/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40', },
                { 'TaskID': 8, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/28/2017'),
                    'EndDate': new Date('03/05/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': 9, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/04/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40', 'isManual': true,"Predecessor":"1SF+0.10 days" }
            ]
        },
        {
            'TaskID': 10,
            'TaskName': 'Parent Task 3',
            'StartDate': new Date('03/13/2017'),
            'EndDate': new Date('03/17/2017'),
            'Progress': '40',
            'Children': [
                { 'TaskID': 11, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/13/2017'),
                    'EndDate': new Date('03/17/2017'), 'Progress': '40' },
                { 'TaskID': 12, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/13/2017'),
                    'EndDate': new Date('03/17/2017'), 'Progress': '40', },
                { 'TaskID': 13, 'TaskName': 'Child Task 3', 'StartDate': new Date('03/13/2017'),
                    'EndDate': new Date('03/17/2017'), 'Progress': '40', },
                { 'TaskID': 14, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/12/2017'),
                    'EndDate': new Date('03/17/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': 15, 'TaskName': 'Child Task 5', 'StartDate': new Date('03/13/2017'),
                    'EndDate': new Date('03/17/2017'), 'Progress': '40' }
            ]
        }
    ];
    beforeAll((done: Function) => {
      ganttObj = createGantt(
        {
          dataSource: data,
          allowSorting: true,
          enableCriticalPath: true,
          enableContextMenu: true,
          height: "450px",
          allowSelection: true,
          highlightWeekends: true,
          taskFields: {
            id: "TaskID",
            name: "TaskName",
            startDate: "StartDate",
            duration: "Duration",
            progress: "Progress",
            endDate: "EndDate",
            dependency: "Predecessor",
            child: "Children",
            manual: "isManual",
          },
          taskMode: "Custom",
          sortSettings: {
            columns: [
              { field: "TaskID", direction: "Ascending" },
              { field: "TaskName", direction: "Ascending" },
            ],
          },
          allowExcelExport: true,
          allowPdfExport: true,
          allowRowDragAndDrop: true,
          splitterSettings: {
            position: "50%",
          },
          selectionSettings: {
            mode: "Row",
            type: "Single",
            enableToggle: false,
          },
          tooltipSettings: {
            showTooltip: true,
          },
          allowFiltering: true,
          columns: [
            { field: "TaskID", visible: true },
            { field: "TaskName" },
            { field: "isManual" },
            { field: "StartDate" },
            { field: "Duration" },
            { field: "Progress" },
          ],
          validateManualTasksOnLinking: true,
          treeColumnIndex: 1,
          allowReordering: true,
          editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true,
          },
          timelineSettings: {
            showTooltip: true,
            topTier: {
              unit: "Week",
              format: "dd/MM/yyyy",
            },
            bottomTier: {
              unit: "Day",
              count: 1,
            },
          },
          gridLines: "Both",
          showColumnMenu: true,
          allowResizing: true,
          readOnly: false,
          taskbarHeight: 20,
          rowHeight: 40,
          labelSettings: {
            leftLabel: "TaskName",
            taskLabel: "${Progress}%",
          },
          projectStartDate: new Date("02/20/2017"),
          projectEndDate: new Date("03/30/2017"),
        },
        done
      );
    });
    it('Critical path rendering ', () => {
        expect(ganttObj.criticalPathModule.criticalTasks.length).toBe(6);
    });
    afterAll(() => {
        if(ganttObj){
            destroyGantt(ganttObj);
        }
    });
});